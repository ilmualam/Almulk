/*!
 * Surah Al-Jinn Interactive Reader Tool (FIXED)
 * Version: 1.1.0
 * Author: IlmuAlam.com
 * License: MIT
 */

(function () {
  "use strict";

  const SURAH_NUM = 72;
  const TOTAL_VERSES = 28;

  const API_BASE = "https://api.alquran.cloud/v1";

  // Storage keys
  const STORAGE_KEY = "ilm_jinn_bookmarks";
  const LAST_VERSE_KEY = "ilm_jinn_last_verse";

  let verses = []; // master list (idx = ayatIndex asal)
  let currentVerse = 0;
  let audio = null;
  let bookmarks = [];
  let isPlaying = false;

  // -----------------------------
  // INIT
  // -----------------------------
  function init() {
    const container = document.getElementById("surahJinnTool");
    if (!container) return;

    loadBookmarks();
    renderUI(container);
    fetchVerses();
  }

  // -----------------------------
  // BOOKMARK STORAGE
  // -----------------------------
  function loadBookmarks() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      bookmarks = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(bookmarks)) bookmarks = [];
    } catch (e) {
      bookmarks = [];
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Cannot save bookmarks");
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
  function renderUI(container) {
    container.innerHTML = `
      <div class="ilm-x-reader">
        <div class="ilm-x-reader-header">
          <h3>🎧 Tool Interaktif Surah Al-Jinn</h3>
          <div class="ilm-x-controls">
            <button class="ilm-x-btn ilm-x-btn-search" onclick="window.ilmJinnReader.toggleSearch()" title="Cari Ayat">🔍</button>
            <button class="ilm-x-btn ilm-x-btn-bookmarks" onclick="window.ilmJinnReader.showBookmarks()" title="Lihat Bookmark">
              📑 <span class="ilm-x-bookmark-count">0</span>
            </button>
            <button class="ilm-x-btn ilm-x-btn-share" onclick="window.ilmJinnReader.share()" title="Share">📤</button>
          </div>
        </div>

        <div class="ilm-x-search-box" style="display:none">
          <input type="text" class="ilm-x-search-input" placeholder="Cari ayat (Rumi atau Malay)..." />
          <button class="ilm-x-btn-close" onclick="window.ilmJinnReader.toggleSearch()">✕</button>
        </div>

        <div class="ilm-x-player">
          <div class="ilm-x-progress-bar">
            <div class="ilm-x-progress"></div>
          </div>
          <div class="ilm-x-player-controls">
            <button class="ilm-x-btn-prev" onclick="window.ilmJinnReader.prevVerse()" title="Ayat Sebelum">⏮</button>
            <button class="ilm-x-btn-play" onclick="window.ilmJinnReader.togglePlay()" title="Play/Pause">▶️</button>
            <button class="ilm-x-btn-next" onclick="window.ilmJinnReader.nextVerse()" title="Ayat Seterusnya">⏭</button>
            <span class="ilm-x-verse-num">Ayat 1/${TOTAL_VERSES}</span>
          </div>
        </div>

        <div class="ilm-x-verses-container">
          <div class="ilm-x-loading">⏳ Memuatkan ayat-ayat...</div>
        </div>
      </div>
    `;

    updateBookmarkCount();
  }

  // -----------------------------
  // FETCH (ARABIC + RUMI + MALAY + AUDIO)
  // -----------------------------
  async function fetchVerses() {
    const container = document.querySelector(".ilm-x-verses-container");

    try {
      // PENTING: ambil audio dari API terus (confirm tak lari surah)
      const url = `${API_BASE}/surah/${SURAH_NUM}/editions/quran-simple,en.transliteration,ms.basmeih,ar.alafasy`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();

      if (data.code !== 200 || !data.data || data.data.length < 4) {
        throw new Error("Invalid API response");
      }

      const arabic = data.data[0].ayahs;
      const rumi = data.data[1].ayahs;
      const malay = data.data[2].ayahs;
      const audioAyah = data.data[3].ayahs;

      verses = arabic.map((_, i) => ({
        idx: i, // index asal (0..27)
        number: i + 1,
        arabic: arabic[i]?.text || "",
        rumi: rumi[i]?.text || "",
        malay: malay[i]?.text || "",
        audio: audioAyah[i]?.audio || "" // URL penuh dari API
      }));

      renderVerses(verses);

      // Load last read verse
      const lastVerse = localStorage.getItem(LAST_VERSE_KEY);
      if (lastVerse) {
        const num = parseInt(lastVerse, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= TOTAL_VERSES) {
          currentVerse = num - 1;
          scrollToVerse(currentVerse);
          highlightVerse(currentVerse);
          updateVerseDisplay();
        }
      }
    } catch (error) {
      container.innerHTML = `
        <div class="ilm-x-error">
          <p>❌ Maaf, gagal memuatkan ayat. Sila semak sambungan internet anda.</p>
          <button class="ilm-x-btn-retry" onclick="window.ilmJinnReader.retry()">🔄 Cuba Lagi</button>
        </div>
      `;
      console.error("Fetch error:", error);
    }
  }

  // -----------------------------
  // RENDER VERSES
  // FIX: guna idx asal, supaya search tak kacau mapping audio/ayat
  // -----------------------------
  function renderVerses(list) {
    const container = document.querySelector(".ilm-x-verses-container");

    const html = list
      .map((v) => {
        const marked = bookmarks.includes(v.number);
        return `
          <div class="ilm-x-verse ${marked ? "ilm-x-bookmarked" : ""}" data-verse="${v.idx}" id="verse-${v.idx}">
            <div class="ilm-x-verse-header">
              <span class="ilm-x-verse-badge">Ayat ${v.number}</span>
              <button class="ilm-x-btn-bookmark ${marked ? "active" : ""}"
                      onclick="window.ilmJinnReader.toggleBookmark(${v.number})" title="Tandabuku">
                ${marked ? "🔖" : "📌"}
              </button>
            </div>
            <div class="ilm-x-arabic">${escapeHTML(v.arabic)}</div>
            <div class="ilm-x-rumi">${escapeHTML(v.rumi)}</div>
            <div class="ilm-x-translation">${escapeHTML(v.malay)}</div>
            <div class="ilm-x-verse-actions">
              <button class="ilm-x-btn-small" onclick="window.ilmJinnReader.playVerse(${v.idx})" title="Main Audio">🔊 Audio</button>
              <button class="ilm-x-btn-small" onclick="window.ilmJinnReader.copyVerse(${v.idx})" title="Salin">📋 Copy</button>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = html;
    updateVerseDisplay();
  }

  // -----------------------------
  // AUDIO CORE
  // -----------------------------
  function stopAudio() {
    if (!audio) return;
    try {
      audio.pause();
      audio.src = "";
      audio.load();
    } catch (e) {}
    audio = null;
    isPlaying = false;
    updatePlayButton();
    updateProgressBar(true);
  }

  function playVerse(index) {
    if (index < 0 || index >= verses.length) return;

    currentVerse = index;
    const verse = verses[index];
    if (!verse || !verse.audio) {
      alert("Audio tidak dijumpai untuk ayat ini.");
      return;
    }

    // stop previous
    stopAudio();

    audio = new Audio();
    audio.preload = "auto";
    audio.volume = 1.0;
    audio.src = verse.audio;

    const onTimeUpdate = () => updateProgressBar(false);
    const onEnded = () => {
      isPlaying = false;
      updatePlayButton();
      // autoplay next ayat
      if (currentVerse < verses.length - 1) {
        setTimeout(() => playVerse(currentVerse + 1), 650);
      }
    };
    const onError = (e) => {
      console.error("Audio error:", e);
      alert("Audio gagal dimainkan. Cuba lagi.");
      isPlaying = false;
      updatePlayButton();
      updateProgressBar(true);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // play (handle browser promise)
    const startPlayback = () => {
      const p = audio.play();
      isPlaying = true;
      updatePlayButton();
      highlightVerse(index);
      scrollToVerse(index);
      updateProgressBar(true);

      // Save last read
      try {
        localStorage.setItem(LAST_VERSE_KEY, String(verse.number));
      } catch (e) {}

      if (p && typeof p.catch === "function") {
        p.catch((err) => {
          console.warn("Autoplay blocked:", err);
          // fallback: show play icon (user click)
          isPlaying = false;
          updatePlayButton();
        });
      }
    };

    // kalau canplay cepat, terus play
    if (audio.readyState >= 2) {
      startPlayback();
    } else {
      audio.addEventListener("canplay", startPlayback, { once: true });
    }
  }

  function togglePlay() {
    if (!verses.length) return;

    if (!audio) {
      playVerse(currentVerse);
      return;
    }

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      const p = audio.play();
      isPlaying = true;
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          isPlaying = false;
          updatePlayButton();
        });
      }
    }
    updatePlayButton();
  }

  function prevVerse() {
    if (currentVerse > 0) playVerse(currentVerse - 1);
  }

  function nextVerse() {
    if (currentVerse < verses.length - 1) playVerse(currentVerse + 1);
  }

  // -----------------------------
  // HIGHLIGHT / SCROLL / DISPLAY
  // -----------------------------
  function highlightVerse(index) {
    document.querySelectorAll(".ilm-x-verse").forEach((el) => {
      const v = parseInt(el.getAttribute("data-verse"), 10);
      if (v === index) el.classList.add("ilm-x-active");
      else el.classList.remove("ilm-x-active");
    });
    updateVerseDisplay();
  }

  function scrollToVerse(index) {
    const el = document.getElementById(`verse-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function updatePlayButton() {
    const btn = document.querySelector(".ilm-x-btn-play");
    if (!btn) return;
    btn.textContent = isPlaying ? "⏸" : "▶️";
    btn.title = isPlaying ? "Pause" : "Play";
  }

  function updateVerseDisplay() {
    const display = document.querySelector(".ilm-x-verse-num");
    if (!display) return;
    display.textContent = `Ayat ${currentVerse + 1}/${TOTAL_VERSES}`;
  }

  function updateProgressBar(reset) {
    const bar = document.querySelector(".ilm-x-progress");
    if (!bar) return;

    if (reset || !audio || !audio.duration || Number.isNaN(audio.duration)) {
      bar.style.width = "0%";
      return;
    }

    const pct = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));
    bar.style.width = pct + "%";
  }

  // -----------------------------
  // BOOKMARK
  // -----------------------------
  function toggleBookmark(verseNum) {
    const idx = bookmarks.indexOf(verseNum);
    if (idx > -1) bookmarks.splice(idx, 1);
    else bookmarks.push(verseNum);

    saveBookmarks();
    updateBookmarkCount();

    // Update UI (target verse by idx asal = verseNum-1)
    const verseIdx = verseNum - 1;
    const verseEl = document.querySelector(`.ilm-x-verse[data-verse="${verseIdx}"]`);
    const btnEl = verseEl ? verseEl.querySelector(".ilm-x-btn-bookmark") : null;

    if (verseEl && btnEl) {
      const marked = bookmarks.includes(verseNum);
      verseEl.classList.toggle("ilm-x-bookmarked", marked);
      btnEl.classList.toggle("active", marked);
      btnEl.textContent = marked ? "🔖" : "📌";
    }
  }

  function updateBookmarkCount() {
    const countEl = document.querySelector(".ilm-x-bookmark-count");
    if (!countEl) return;
    countEl.textContent = String(bookmarks.length);
    countEl.style.display = bookmarks.length > 0 ? "inline" : "none";
  }

  function showBookmarks() {
    if (bookmarks.length === 0) {
      alert("Tiada penanda buku. Klik ikon 📌 pada ayat untuk menanda.");
      return;
    }
    const list = bookmarks.map((n) => `Ayat ${n}`).join(", ");
    const choice = confirm(`Ayat yang ditanda:\n${list}\n\nKlik OK untuk pergi ke ayat pertama yang ditanda.`);
    if (choice) {
      const first = Math.min(...bookmarks);
      const idx = first - 1;
      scrollToVerse(idx);
      highlightVerse(idx);
    }
  }

  // -----------------------------
  // SEARCH
  // FIX: filter tapi maintain idx asal (audio tak lari)
  // -----------------------------
  function toggleSearch() {
    const searchBox = document.querySelector(".ilm-x-search-box");
    const input = document.querySelector(".ilm-x-search-input");
    if (!searchBox || !input) return;

    const isHidden = searchBox.style.display === "none" || !searchBox.style.display;
    if (isHidden) {
      searchBox.style.display = "flex";
      input.value = "";
      input.focus();
      input.removeEventListener("input", handleSearch);
      input.addEventListener("input", handleSearch);
    } else {
      searchBox.style.display = "none";
      input.value = "";
      renderVerses(verses);
    }
  }

  function handleSearch(e) {
    const query = (e.target.value || "").toLowerCase().trim();
    if (!query) {
      renderVerses(verses);
      return;
    }

    const filtered = verses.filter((v) => {
      return (
        (v.rumi || "").toLowerCase().includes(query) ||
        (v.malay || "").toLowerCase().includes(query) ||
        String(v.number) === query
      );
    });

    if (filtered.length > 0) {
      renderVerses(filtered);
    } else {
      const container = document.querySelector(".ilm-x-verses-container");
      if (container) container.innerHTML = '<div class="ilm-x-no-result">🔍 Tiada hasil ditemui</div>';
    }
  }

  // -----------------------------
  // COPY
  // -----------------------------
  function copyVerse(index) {
    const verse = verses[index];
    if (!verse) return;

    const text = `Surah Al-Jinn (72:${verse.number})\n\n${verse.arabic}\n\n${verse.rumi}\n\n${verse.malay}\n\nDaripada: IlmuAlam.com`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => alert("✅ Ayat berjaya disalin!"))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      alert("✅ Ayat berjaya disalin!");
    } catch (e) {
      alert("❌ Gagal menyalin. Sila salin secara manual.");
    }
    document.body.removeChild(textarea);
  }

  // -----------------------------
  // SHARE
  // -----------------------------
  function share() {
    const url = window.location.href;
    const text = "Baca Surah Al-Jinn lengkap dengan audio, rumi & terjemahan di IlmuAlam.com";

    if (navigator.share) {
      navigator.share({ title: "Surah Al-Jinn", text, url }).catch(() => {});
    } else {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  }

  // -----------------------------
  // RETRY
  // -----------------------------
  function retry() {
    stopAudio();
    const container = document.querySelector(".ilm-x-verses-container");
    if (container) container.innerHTML = '<div class="ilm-x-loading">⏳ Memuatkan ayat-ayat...</div>';
    fetchVerses();
  }

  // -----------------------------
  // HELPERS
  // -----------------------------
  function escapeHTML(str) {
    // ringan, elak HTML pecah bila ada karakter tertentu
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // -----------------------------
  // EXPOSE
  // -----------------------------
  window.ilmJinnReader = {
    togglePlay,
    prevVerse,
    nextVerse,
    playVerse,
    toggleBookmark,
    showBookmarks,
    toggleSearch,
    copyVerse,
    share,
    retry
  };

  // auto init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
