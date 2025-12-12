/*!
 * Surah Al-Jinn Interactive Reader Tool
 * FINAL – One-shot fix (Audio + Search + UX + Mobile sync)
 * Author: IlmuAlam.com
 */

(function () {
  "use strict";

  const SURAH_NUM = 72;
  const API_BASE = "https://api.alquran.cloud/v1";
  const EDITIONS = "quran-simple,en.transliteration,ms.basmeih,ar.alafasy";

  const STORAGE_KEY = "ilm_jinn_bookmarks";
  const LAST_VERSE_KEY = "ilm_jinn_last_verse";

  // fallback mp3 (CONFIRMED)
  const AUDIO_FALLBACK_BASE = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/";

  let verses = [];
  let viewVerses = [];
  let currentVerse = 0;
  let audio = null;
  let isPlaying = false;
  let bookmarks = [];

  /* ---------------- INIT ---------------- */
  function init() {
    const el = document.getElementById("surahJinnTool");
    if (!el) return;
    loadBookmarks();
    renderUI(el);
    fetchVerses();
  }

  /* ---------------- STORAGE ---------------- */
  function loadBookmarks() {
    try {
      bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      bookmarks = [];
    }
  }
  function saveBookmarks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }

  /* ---------------- UI ---------------- */
  function renderUI(container) {
    container.innerHTML = `
      <div class="ilm-x-reader">
        <div class="ilm-x-reader-header">
          <h3>🎧 Tool Interaktif Surah Al-Jinn</h3>
          <div class="ilm-x-controls">
            <button class="ilm-x-btn" onclick="ilmJinn.toggleSearch()">🔍</button>
            <button class="ilm-x-btn" onclick="ilmJinn.showBookmarks()">📑 <span class="ilm-x-bookmark-count"></span></button>
            <button class="ilm-x-btn" onclick="ilmJinn.share()">📤</button>
          </div>
        </div>

        <div class="ilm-x-search-box" style="display:none">
          <input class="ilm-x-search-input" placeholder="Cari ayat..." />
          <button class="ilm-x-btn-close" onclick="ilmJinn.toggleSearch()">✕</button>
        </div>

        <div class="ilm-x-player">
          <div class="ilm-x-progress-bar"><div class="ilm-x-progress"></div></div>
          <div class="ilm-x-player-controls">
            <button class="ilm-x-btn-prev" onclick="ilmJinn.prev()">⏮</button>
            <button class="ilm-x-btn-play" onclick="ilmJinn.togglePlay()">▶️</button>
            <button class="ilm-x-btn-next" onclick="ilmJinn.next()">⏭</button>
            <span class="ilm-x-verse-num">Ayat 1/28</span>
          </div>
        </div>

        <div class="ilm-x-verses-container">
          <div class="ilm-x-loading">⏳ Memuatkan ayat...</div>
        </div>
      </div>
    `;
    updateBookmarkCount();
  }

  /* ---------------- FETCH ---------------- */
  async function fetchVerses() {
    try {
      const res = await fetch(`${API_BASE}/surah/${SURAH_NUM}/editions/${EDITIONS}`);
      const json = await res.json();
      if (json.code !== 200) throw "API error";

      const [arab, rumi, malay, audioEd] = json.data;

      verses = arab.ayahs.map((a, i) => {
        const globalNum = a.number;
        const sec = audioEd.ayahs[i]?.audioSecondary;
        const audioUrl =
          (Array.isArray(sec) && sec[0]) ||
          audioEd.ayahs[i]?.audio ||
          `${AUDIO_FALLBACK_BASE}${globalNum}.mp3`;

        return {
          idx: i,
          number: i + 1,
          globalNum,
          arabic: a.text,
          rumi: rumi.ayahs[i]?.text || "",
          malay: malay.ayahs[i]?.text || "",
          audio: audioUrl
        };
      });

      viewVerses = [...verses];
      renderVerses(viewVerses);

      const last = +localStorage.getItem(LAST_VERSE_KEY);
      if (last >= 1 && last <= verses.length) {
        currentVerse = last - 1;
        scrollTo(currentVerse);
        highlight(currentVerse);
      }
    } catch (e) {
      document.querySelector(".ilm-x-verses-container").innerHTML =
        `<div class="ilm-x-error">❌ Gagal memuatkan data.</div>`;
      console.error(e);
    }
  }

  /* ---------------- RENDER ---------------- */
  function renderVerses(list) {
    document.querySelector(".ilm-x-verses-container").innerHTML = list.map(v => `
      <div class="ilm-x-verse" data-i="${v.idx}" id="verse-${v.idx}">
        <div class="ilm-x-verse-header">
          <span class="ilm-x-verse-badge">Ayat ${v.number}</span>
          <button class="ilm-x-btn-bookmark" onclick="ilmJinn.toggleBookmark(${v.number})">
            ${bookmarks.includes(v.number) ? "🔖" : "📌"}
          </button>
        </div>
        <div class="ilm-x-arabic">${esc(v.arabic)}</div>
        <div class="ilm-x-rumi">${esc(v.rumi)}</div>
        <div class="ilm-x-translation">${esc(v.malay)}</div>
        <div class="ilm-x-verse-actions">
          <button class="ilm-x-btn-small" onclick="ilmJinn.play(${v.idx})">🔊 Audio</button>
          <button class="ilm-x-btn-small" onclick="ilmJinn.copy(${v.idx})">📋 Copy</button>
        </div>
      </div>
    `).join("");
    updateVerseDisplay();
  }

  /* ---------------- AUDIO ---------------- */
  function play(i) {
    const v = verses[i];
    if (!v) return;

    currentVerse = i;
    if (audio) audio.pause();

    audio = new Audio(v.audio);
    audio.preload = "auto";

    audio.onloadedmetadata = () => {
      audio.play().catch(()=>{});
      isPlaying = true;
      updatePlayBtn();
      highlight(i);
      scrollTo(i);
      localStorage.setItem(LAST_VERSE_KEY, v.number);
    };

    audio.onended = () => {
      isPlaying = false;
      updatePlayBtn();
      if (i < verses.length - 1) setTimeout(() => play(i + 1), 500);
    };

    audio.ontimeupdate = () => {
      const bar = document.querySelector(".ilm-x-progress");
      if (audio.duration) bar.style.width = (audio.currentTime / audio.duration * 100) + "%";
    };
  }

  function togglePlay() {
    if (!audio) return play(currentVerse);
    isPlaying ? audio.pause() : audio.play().catch(()=>{});
    isPlaying = !isPlaying;
    updatePlayBtn();
  }

  /* ---------------- HELPERS ---------------- */
  function prev(){ if (currentVerse>0) play(currentVerse-1); }
  function next(){ if (currentVerse<verses.length-1) play(currentVerse+1); }

  function highlight(i){
    document.querySelectorAll(".ilm-x-verse").forEach(el=>{
      el.classList.toggle("ilm-x-active", +el.dataset.i === i);
    });
    updateVerseDisplay();
  }

  function scrollTo(i){
    document.getElementById("verse-"+i)?.scrollIntoView({behavior:"smooth",block:"center"});
  }

  function updatePlayBtn(){
    const b=document.querySelector(".ilm-x-btn-play");
    if(b) b.textContent = isPlaying ? "⏸" : "▶️";
  }

  function updateVerseDisplay(){
    const d=document.querySelector(".ilm-x-verse-num");
    if(d) d.textContent = `Ayat ${currentVerse+1}/${verses.length}`;
  }

  function toggleBookmark(n){
    bookmarks.includes(n)?bookmarks.splice(bookmarks.indexOf(n),1):bookmarks.push(n);
    saveBookmarks(); updateBookmarkCount(); renderVerses(viewVerses);
  }

  function updateBookmarkCount(){
    const c=document.querySelector(".ilm-x-bookmark-count");
    if(c){ c.textContent=bookmarks.length; c.style.display=bookmarks.length?"inline":"none"; }
  }

  function toggleSearch(){
    const box=document.querySelector(".ilm-x-search-box");
    const input=document.querySelector(".ilm-x-search-input");
    if(box.style.display==="none"){
      box.style.display="flex"; input.value=""; input.oninput=handleSearch;
    }else{
      box.style.display="none"; viewVerses=[...verses]; renderVerses(viewVerses);
    }
  }

  function handleSearch(e){
    const q=e.target.value.toLowerCase();
    viewVerses = q
      ? verses.filter(v=>v.rumi.toLowerCase().includes(q)||v.malay.toLowerCase().includes(q)||String(v.number)===q)
      : [...verses];
    renderVerses(viewVerses);
  }

  function copy(i){
    const v=verses[i];
    navigator.clipboard.writeText(
      `Surah Al-Jinn (72:${v.number})\n\n${v.arabic}\n\n${v.rumi}\n\n${v.malay}`
    );
  }

  function share(){
    navigator.share
      ? navigator.share({title:"Surah Al-Jinn",url:location.href})
      : window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`);
  }

  function esc(s){return String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]));}

  window.ilmJinn={
    play,prev,next,togglePlay,toggleBookmark,showBookmarks:()=>alert(bookmarks.join(", ")||"Tiada"),toggleSearch,copy,share
  };

  document.readyState==="loading"
    ? document.addEventListener("DOMContentLoaded",init)
    : init();

})();
