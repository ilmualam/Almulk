/**
 * Surah Al-Jinn Interactive Tool
 * Copyright © 2025 ilmualam.com
 * 
 * This code is proprietary and confidential.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * Licensed exclusively for use on ilmualam.com
 * 
 * @author ilmualam.com
 * @version 2.0.0
 * @license Proprietary
 */
(function() {

  const SURAH_ID = 72;
  const TOTAL_AYAH = 28;

  const API_TEXT = `https://api.alquran.cloud/v1/surah/${SURAH_ID}/editions/quran-uthmani,ms.basmeih,en.transliteration`;
  const API_AUDIO = `https://api.alquran.cloud/v1/surah/${SURAH_ID}/ar.alafasy`;

  let state = {
    verses: [],
    currentIndex: -1,
    isPlaying: false,
    audioObj: new Audio(),
    bookmarks: JSON.parse(localStorage.getItem('ilmu_sj_bookmarks') || '[]')
  };

  const els = {
    container: document.getElementById("ilmu-sj-verses"),
    loading: document.getElementById("ilmu-sj-loading"),
    status: document.getElementById("player-status-text"),
    play: document.getElementById("btn-play-pause"),
    next: document.getElementById("btn-next"),
    prev: document.getElementById("btn-prev"),
    stop: document.getElementById("btn-stop"),
    search: document.getElementById("ilmu-sj-search"),
    bookmarks: document.getElementById("ilmu-sj-bookmarks"),
    clearBookmarks: document.getElementById("ilmu-sj-clear-bookmarks"),
    toggleTrans: document.getElementById("ilmu-sj-show-translation"),
    toggleTr: document.getElementById("ilmu-sj-show-translit"),
    toggleScroll: document.getElementById("ilmu-sj-auto-scroll")
  };


  // INIT
  init();

  async function init() {
    await loadData();
    setupAudioEvents();
    setupUIEvents();
    renderBookmarks();
  }


  // LOAD TEXT + AUDIO
  async function loadData() {
    try {
      const [textRes, audioRes] = await Promise.all([
        fetch(API_TEXT),
        fetch(API_AUDIO)
      ]);

      const text = await textRes.json();
      const audio = await audioRes.json();

      const arabic = text.data[0].ayahs;
      const malay = text.data[1].ayahs;
      const translit = text.data[2].ayahs;

      const audioMap = {};
      audio.data.ayahs.forEach(a => {
        let url = a.audio;
        if (Array.isArray(a.audioSecondary) && a.audioSecondary.length > 0) {
          url = a.audioSecondary[0];
        }
        audioMap[a.numberInSurah] = url;
      });

      // FINAL VERSES MAP
      state.verses = arabic.map((a, i) => ({
        num: a.numberInSurah,
        ar: a.text,
        ms: malay[i].text,
        tr: translit[i].text,
        audioUrl: audioMap[a.numberInSurah] || null
      }));

      els.loading.hidden = true;
      els.container.hidden = false;
      renderVerses();
    } catch (e) {
      console.error(e);
      els.loading.innerHTML = "Ralat memuatkan data. Sila refresh.";
    }
  }


  // RENDER
  function renderVerses() {
    const showTr = els.toggleTr ? els.toggleTr.checked : true;
    const showTrans = els.toggleTrans ? els.toggleTrans.checked : true;

    els.container.innerHTML = "";

    state.verses.forEach((v, idx) => {
      let card = document.createElement("div");
      card.className = "ilmu-sj-ayah";
      card.id = `ayah-${idx}`;

      card.innerHTML = `
        <div class="ilmu-sj-ayah-header">
          <span class="ilmu-sj-num-badge">Ayat ${v.num}</span>
          <div class="ilmu-sj-ayah-controls">
            <button onclick="window.playSpecific(${idx})">▶</button>
            <button onclick="window.toggleBookmark(${v.num})">★</button>
            <button onclick="window.copyAyah(${idx})">Copy</button>
          </div>
        </div>

        <div class="ilmu-sj-arabic">${v.ar}</div>
        <div class="ilmu-sj-translit" ${showTr ? "" : "hidden"}>${v.tr}</div>
        <div class="ilmu-sj-trans" ${showTrans ? "" : "hidden"}>${v.ms}</div>
      `;

      els.container.appendChild(card);
    });
  }


  // AUDIO EVENTS
  function setupAudioEvents() {
    state.audioObj.addEventListener("ended", () => {
      if (state.currentIndex < state.verses.length - 1) {
        playAyah(state.currentIndex + 1);
      } else {
        stopAudio();
        els.status.textContent = "Tamat Surah.";
      }
    });

    state.audioObj.addEventListener("play", () => {
      state.isPlaying = true;
      els.play.innerHTML = "⏸ Pause";
      highlightAyah(state.currentIndex);
    });

    state.audioObj.addEventListener("pause", () => {
      state.isPlaying = false;
      els.play.innerHTML = "▶ Sambung";
    });

    els.play.onclick = () => {
      if (!state.isPlaying) {
        if (state.currentIndex === -1) state.currentIndex = 0;
        playAyah(state.currentIndex);
      } else {
        state.audioObj.pause();
      }
    };

    els.next.onclick = () => {
      if (state.currentIndex < state.verses.length - 1) {
        playAyah(state.currentIndex + 1);
      }
    };

    els.prev.onclick = () => {
      if (state.currentIndex > 0) {
        playAyah(state.currentIndex - 1);
      }
    };

    els.stop.onclick = stopAudio;
  }


  // PLAY LOGIC
  function playAyah(i) {
    const v = state.verses[i];
    if (!v.audioUrl) {
      alert("Audio tidak tersedia.");
      return;
    }

    state.currentIndex = i;
    state.audioObj.src = v.audioUrl;
    state.audioObj.play();
    els.status.textContent = `Ayat ${v.num}`;
  }

  function stopAudio() {
    state.audioObj.pause();
    state.audioObj.currentTime = 0;
    state.currentIndex = -1;
    els.status.textContent = "Audio dihentikan.";
    document.querySelectorAll(".ilmu-sj-ayah").forEach(e => e.classList.remove("playing"));
  }

  function highlightAyah(i) {
    document.querySelectorAll(".ilmu-sj-ayah").forEach(e => e.classList.remove("playing"));
    const card = document.getElementById(`ayah-${i}`);
    if (card) {
      card.classList.add("playing");
      if (els.toggleScroll && els.toggleScroll.checked) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }


  // BOOKMARK
  window.toggleBookmark = (num) => {
    if (state.bookmarks.includes(num)) {
      state.bookmarks = state.bookmarks.filter(n => n !== num);
      alert(`Bookmark ${num} dipadam.`);
    } else {
      state.bookmarks.push(num);
      state.bookmarks.sort((a,b)=>a-b);
      alert(`Ayat ${num} disimpan.`);
    }
    localStorage.setItem("ilmu_sj_bookmarks", JSON.stringify(state.bookmarks));
    renderBookmarks();
  };

  function renderBookmarks() {
    els.bookmarks.innerHTML = "";
    if (state.bookmarks.length === 0) {
      els.bookmarks.innerHTML = `<li class="ilmu-sj-empty">Tiada bookmark</li>`;
      return;
    }
    state.bookmarks.forEach(n => {
      const li = document.createElement("li");
      li.textContent = `Ayat ${n}`;
      li.onclick = () => {
        const idx = state.verses.findIndex(v => v.num === n);
        playAyah(idx);
        document.getElementById(`ayah-${idx}`).scrollIntoView({ behavior: "smooth" });
      };
      els.bookmarks.appendChild(li);
    });
  }


  // COPY AYAH
  window.copyAyah = (i) => {
    const v = state.verses[i];
    const txt = `Surah Al-Jinn Ayat ${v.num}\n${v.ar}\n${v.ms}`;
    navigator.clipboard.writeText(txt);
    alert("Teks disalin!");
  };


  // SEARCH
  function setupUIEvents() {
    if (els.search) {
      els.search.oninput = (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll(".ilmu-sj-ayah").forEach(card => {
          card.style.display = card.innerText.toLowerCase().includes(q) ? "block" : "none";
        });
      };
    }

    if (els.clearBookmarks) {
      els.clearBookmarks.onclick = () => {
        if (confirm("Buang semua bookmark?")) {
          state.bookmarks = [];
          localStorage.setItem("ilmu_sj_bookmarks", "[]");
          renderBookmarks();
        }
      };
    }

    if (els.toggleTrans) els.toggleTrans.onchange = renderVerses;
    if (els.toggleTr) els.toggleTr.onchange = renderVerses;
  }


  // Expose wrapper
  window.playSpecific = (i) => playAyah(i);

})();
