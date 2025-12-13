(function(){
  "use strict";

  const CONFIG = {
    surahNumber: 11,
    totalAyahs: 123,
    apiBase: "https://api.alquran.cloud/v1",
    editions: {
      arabic: "quran-simple-enhanced",
      translation: "ms.basmeih",
      transliteration: "en.transliteration"
    },
    storageKey: "ilm_hud_bookmarks"
  };

  // DOM
  const container = document.getElementById("surah-hud-container");
  if(!container) return;

  const versesContainer = document.getElementById("versesContainer");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const progressBar = document.getElementById("progressBar");
  const currentVerseEl = document.getElementById("currentVerse");
  const audioTimeEl = document.getElementById("audioTime");
  const qariSelector = document.getElementById("qariSelector");
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsContent = document.getElementById("settingsContent");
  const arabicSizeSlider = document.getElementById("arabicSizeSlider");
  const arabicSizeValue = document.getElementById("arabicSizeValue");
  const translationSizeSlider = document.getElementById("translationSizeSlider");
  const translationSizeValue = document.getElementById("translationSizeValue");
  const autoScrollToggle = document.getElementById("autoScrollToggle");
  const autoPlayNextToggle = document.getElementById("autoPlayNextToggle");
  const toast = document.getElementById("toast");
  const audio = document.getElementById("hudAudio");

  // State
  let verses = [];
  let currentIndex = 0; // 0-based
  let isReady = false;
  let isUserPaused = true;

  const pad3 = (n) => String(n).padStart(3,"0");
  const surahPad = pad3(CONFIG.surahNumber);

  function toastMsg(msg){
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(()=>toast.classList.remove("show"), 1400);
  }

  function formatTime(sec){
    if(!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60);
    return m + ":" + String(s).padStart(2,"0");
  }

  function audioUrlFor(index){
    const qari = qariSelector?.value || "Alafasy_128kbps";
    const ayah = pad3(index + 1);
    // everyayah naming: SSSAAA.mp3 (surah 3 digits + ayah 3 digits)
    return `https://everyayah.com/data/${qari}/${surahPad}${ayah}.mp3`;
  }

  function setPlayingUI(isPlaying){
    if(isPlaying){
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    }else{
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  function clearPlayingClasses(){
    versesContainer.querySelectorAll(".verse.playing").forEach(el=>el.classList.remove("playing"));
  }

  function markPlaying(index){
    clearPlayingClasses();
    const card = versesContainer.querySelector(`.verse[data-index="${index}"]`);
    if(card) card.classList.add("playing");
  }

  function scrollToVerse(index){
    if(!autoScrollToggle?.checked) return;
    const card = versesContainer.querySelector(`.verse[data-index="${index}"]`);
    if(!card) return;
    card.scrollIntoView({behavior:"smooth", block:"center"});
  }

  function updateHeaderAyah(index){
    currentVerseEl.textContent = "Ayat " + (index+1);
  }

  async function safePlay(){
    try{
      await audio.play();
      isUserPaused = false;
      setPlayingUI(true);
    }catch(e){
      // Mobile autoplay policy: user gesture required
      setPlayingUI(false);
      toastMsg("Klik ▶️ untuk mula main audio.");
    }
  }

  function loadAyah(index, autoplay){
    currentIndex = Math.max(0, Math.min(CONFIG.totalAyahs-1, index));
    const url = audioUrlFor(currentIndex);

    audio.src = url;
    audio.load();

    updateHeaderAyah(currentIndex);
    markPlaying(currentIndex);
    scrollToVerse(currentIndex);

    if(autoplay){
      safePlay();
    }else{
      setPlayingUI(false);
      isUserPaused = true;
    }
  }

  function togglePlayPause(){
    if(!isReady) return;
    if(!audio.src){
      loadAyah(currentIndex || 0, true);
      return;
    }
    if(audio.paused){
      safePlay();
    }else{
      audio.pause();
      isUserPaused = true;
      setPlayingUI(false);
    }
  }

  function renderVerses(){
    const arabicSize = Number(arabicSizeSlider.value || 30);
    const transSize = Number(translationSizeSlider.value || 16);

    versesContainer.innerHTML = "";

    const frag = document.createDocumentFragment();

    verses.forEach((v, idx)=>{
      const card = document.createElement("div");
      card.className = "verse";
      card.dataset.index = idx;

      card.innerHTML = `
        <div class="verse-top">
          <div class="verse-no">11:${idx+1}</div>
          <div class="verse-actions">
            <button class="vbtn primary" type="button" data-act="play">${idx===currentIndex && !audio.paused ? "Pause" : "Play"}</button>
            <button class="vbtn" type="button" data-act="jump">Pergi</button>
          </div>
        </div>

        <div class="arabic" style="font-size:${arabicSize}px">${v.arabic}</div>
        <p class="rumi" style="font-size:${Math.max(14, transSize)}px"><strong>Rumi:</strong> ${v.transliteration || "-"}</p>
        <p class="ms" style="font-size:${transSize}px"><strong>Maksud:</strong> ${v.translation || "-"}</p>
      `;

      // whole card click: play that ayah
      card.addEventListener("click", (e)=>{
        const act = e.target?.dataset?.act;

        // avoid double-trigger on button click (still handled below)
        if(act === "play" || act === "jump") return;

        loadAyah(idx, true);
      });

      card.querySelector('[data-act="jump"]').addEventListener("click", (e)=>{
        e.stopPropagation();
        const target = versesContainer.querySelector(`.verse[data-index="${idx}"]`);
        if(target) target.scrollIntoView({behavior:"smooth", block:"center"});
        toastMsg("Pergi ayat " + (idx+1));
      });

      card.querySelector('[data-act="play"]').addEventListener("click", (e)=>{
        e.stopPropagation();
        if(currentIndex !== idx){
          loadAyah(idx, true);
          return;
        }
        togglePlayPause();
      });

      frag.appendChild(card);
    });

    versesContainer.appendChild(frag);

    // apply current playing highlight after re-render
    markPlaying(currentIndex);
  }

  async function fetchJSON(url){
    const res = await fetch(url, {cache:"no-store"});
    if(!res.ok) throw new Error("Fetch failed: " + res.status);
    return res.json();
  }

  async function loadSurah(){
    const s = CONFIG.surahNumber;
    const aUrl = `${CONFIG.apiBase}/surah/${s}/${CONFIG.editions.arabic}`;
    const tUrl = `${CONFIG.apiBase}/surah/${s}/${CONFIG.editions.translation}`;
    const rUrl = `${CONFIG.apiBase}/surah/${s}/${CONFIG.editions.transliteration}`;

    const [arabic, translation, translit] = await Promise.all([
      fetchJSON(aUrl),
      fetchJSON(tUrl),
      fetchJSON(rUrl)
    ]);

    const aAyahs = arabic?.data?.ayahs || [];
    const tAyahs = translation?.data?.ayahs || [];
    const rAyahs = translit?.data?.ayahs || [];

    verses = aAyahs.map((x, i)=>({
      arabic: x?.text || "",
      translation: tAyahs[i]?.text || "",
      transliteration: rAyahs[i]?.text || ""
    }));

    // fallback count safety
    if(!verses.length){
      throw new Error("No verses returned");
    }

    isReady = true;
    renderVerses();
    loadAyah(0, false);
    toastMsg("Surah Hud siap dimuat.");
  }

  // Events
  playPauseBtn.addEventListener("click", togglePlayPause);

  qariSelector.addEventListener("change", ()=>{
    if(!isReady) return;
    const wasPlaying = !audio.paused && !isUserPaused;
    loadAyah(currentIndex, wasPlaying);
    toastMsg("Qari ditukar.");
  });

  settingsToggle.addEventListener("click", ()=>{
    const isOpen = settingsContent.style.display !== "none";
    settingsContent.style.display = isOpen ? "none" : "block";
  });

  arabicSizeSlider.addEventListener("input", ()=>{
    arabicSizeValue.textContent = arabicSizeSlider.value + "px";
    if(isReady) renderVerses();
  });
  translationSizeSlider.addEventListener("input", ()=>{
    translationSizeValue.textContent = translationSizeSlider.value + "px";
    if(isReady) renderVerses();
  });

  audio.addEventListener("timeupdate", ()=>{
    if(!audio.duration || !isFinite(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = pct.toFixed(2) + "%";
    audioTimeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener("loadedmetadata", ()=>{
    audioTimeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener("play", ()=>{
    setPlayingUI(true);
    markPlaying(currentIndex);
  });

  audio.addEventListener("pause", ()=>{
    if(!isUserPaused) return; // pause due to ended/next handled elsewhere
    setPlayingUI(false);
  });

  audio.addEventListener("ended", ()=>{
    setPlayingUI(false);

    if(autoPlayNextToggle?.checked){
      const next = currentIndex + 1;
      if(next < CONFIG.totalAyahs){
        loadAyah(next, true);
      }else{
        toastMsg("Tamat Surah Hud.");
        isUserPaused = true;
        clearPlayingClasses();
      }
    }else{
      isUserPaused = true;
    }
  });

  // Click progress bar to seek
  const progressWrap = container.querySelector(".audio-progress");
  progressWrap.addEventListener("click", (e)=>{
    if(!audio.duration || !isFinite(audio.duration)) return;
    const rect = progressWrap.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const pct = x / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // Init
  (async ()=>{
    try{
      await loadSurah();
    }catch(err){
      console.error(err);
      versesContainer.innerHTML = `
        <div class="ilmhud-loading">
          ❌ Gagal memuat Surah Hud. Cuba refresh / semak blocker / semak API.<br>
          <small>${String(err?.message || err)}</small>
        </div>
      `;
      toastMsg("Gagal load data surah.");
    }
  })();

})();
