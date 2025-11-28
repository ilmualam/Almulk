/**
 * Surah Al Maidah Interactive Tool
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
(function () {
  const CONFIG = {
    surahId: 5,
    surahName: "Al-Maidah",
    totalAyahs: 120,
    apiUrl:
      "https://api.alquran.cloud/v1/surah/5/editions/quran-uthmani,ar.alafasy,ms.basmeih,en.transliteration",
    lsPrefix: "ilmuAlam-maidah-",
  };

  const els = {};
  const state = {
    ayahs: [],
    currentIndex: null,
    isPlaying: false,
    isDark: false,
    showBookmarksOnly: false,
    bookmarks: new Set(),
    readAyahs: new Set(),
    audioReady: false,
  };

  let audio;

  function $(id) {
    return document.getElementById(id);
  }

  function showToast(message) {
    const existing = document.querySelector("#surah-al-maidah-tool .toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2800);
  }

  function loadPersistedState() {
    try {
      const ls = window.localStorage;
      const dark = ls.getItem(CONFIG.lsPrefix + "darkMode");
      const bookmarks = ls.getItem(CONFIG.lsPrefix + "bookmarks");
      const read = ls.getItem(CONFIG.lsPrefix + "readAyahs");

      if (dark === "1") state.isDark = true;
      if (bookmarks) {
        const arr = JSON.parse(bookmarks);
        arr.forEach((n) => state.bookmarks.add(n));
      }
      if (read) {
        const arr = JSON.parse(read);
        arr.forEach((n) => state.readAyahs.add(n));
      }
    } catch (e) {
      console.warn("Persist load failed", e);
    }
  }

  function persistState() {
    try {
      const ls = window.localStorage;
      ls.setItem(
        CONFIG.lsPrefix + "darkMode",
        state.isDark ? "1" : "0"
      );
      ls.setItem(
        CONFIG.lsPrefix + "bookmarks",
        JSON.stringify(Array.from(state.bookmarks))
      );
      ls.setItem(
        CONFIG.lsPrefix + "readAyahs",
        JSON.stringify(Array.from(state.readAyahs))
      );
    } catch (e) {
      console.warn("Persist save failed", e);
    }
  }

  function buildAyahCards() {
    const container = els.ayahList;
    container.innerHTML = "";

    state.ayahs.forEach((ayahObj, index) => {
      const ayahNo = index + 1;
      const card = document.createElement("article");
      card.className = "ayah-card";
      card.id = `ayah-5-${ayahNo}`;
      card.dataset.index = String(index);

      const header = document.createElement("div");
      header.className = "ayah-header";

      const numBtn = document.createElement("button");
      numBtn.type = "button";
      numBtn.className = "ayah-number";
      numBtn.innerHTML = `<span>${ayahNo}</span><small>/120</small>`;
      numBtn.addEventListener("click", () => {
        playAyah(index);
      });

      const actions = document.createElement("div");
      actions.className = "ayah-actions";

      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "icon-btn play-ayah-btn";
      playBtn.title = `Mainkan ayat ${ayahNo}`;
      playBtn.innerText = "▶️";
      playBtn.addEventListener("click", () => {
        playAyah(index);
      });

      const bookmarkBtn = document.createElement("button");
      bookmarkBtn.type = "button";
      bookmarkBtn.className = "icon-btn bookmark-btn";
      bookmarkBtn.title = `Simpan ayat ${ayahNo}`;
      bookmarkBtn.innerText = "🔖";
      if (state.bookmarks.has(ayahNo)) {
        bookmarkBtn.classList.add("active");
      }
      bookmarkBtn.addEventListener("click", () => {
        toggleBookmark(ayahNo, card, bookmarkBtn);
      });

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "icon-btn copy-btn";
      copyBtn.title = `Salin ayat ${ayahNo}`;
      copyBtn.innerText = "📋";
      copyBtn.addEventListener("click", () => {
        copyAyah(ayahNo, ayahObj);
      });

      actions.appendChild(playBtn);
      actions.appendChild(bookmarkBtn);
      actions.appendChild(copyBtn);

      header.appendChild(numBtn);
      header.appendChild(actions);

      const arabic = document.createElement("div");
      arabic.className = "ayah-arabic ayah-arabic-text";
      arabic.textContent = ayahObj.arabic;

      const rumi = document.createElement("div");
      rumi.className = "ayah-rumi ayah-rumi-text";
      rumi.textContent = ayahObj.rumi;

      const translation = document.createElement("div");
      translation.className = "ayah-translation ayah-translation-text";
      translation.textContent = ayahObj.translation;

      card.appendChild(header);
      card.appendChild(arabic);
      card.appendChild(rumi);
      card.appendChild(translation);

      if (state.bookmarks.has(ayahNo)) {
        const note = document.createElement("div");
        note.className = "bookmark-note";
        note.textContent =
          "Disimpan dalam bookmark anda. Akses pantas melalui butang 🔖 di bahagian atas.";
        card.appendChild(note);
      }

      container.appendChild(card);
    });

    updateStatsUI();
    applyVisibilityToggles();
  }

  function updateStatsUI() {
    if (els.totalAyahs) {
      els.totalAyahs.textContent = String(CONFIG.totalAyahs);
    }
    if (els.readCount) {
      els.readCount.textContent = String(state.readAyahs.size);
    }
    if (els.bookmarkedCount) {
      els.bookmarkedCount.textContent = String(state.bookmarks.size);
    }
    if (els.bookmarkCount) {
      els.bookmarkCount.textContent = String(state.bookmarks.size);
    }
  }

  function setDarkMode(on) {
    state.isDark = on;
    if (!els.surahContainer) return;
    els.surahContainer.classList.toggle("dark-mode", on);
    persistState();
  }

  function getCardByIndex(index) {
    return els.ayahList.querySelector(`.ayah-card[data-index="${index}"]`);
  }

  function highlightAyah(index, scrollIntoView) {
    if (state.currentIndex !== null) {
      const prevCard = getCardByIndex(state.currentIndex);
      if (prevCard) prevCard.classList.remove("playing");
    }
    state.currentIndex = index;

    const card = getCardByIndex(index);
    if (!card) return;
    card.classList.add("playing");

    const ayahNo = index + 1;
    state.readAyahs.add(ayahNo);
    updateStatsUI();
    persistState();

    if (els.currentAyahText) {
      els.currentAyahText.textContent = `Sedang dimainkan: Surah Al-Maidah ayat ${ayahNo}`;
    }

    if (scrollIntoView) {
      const rect = card.getBoundingClientRect();
      const parentRect = els.ayahList.getBoundingClientRect();
      const offset = rect.top - parentRect.top - parentRect.height * 0.15;
      els.ayahList.scrollTop += offset;
    }
  }

  function setGlobalPlayIcon(isPlaying) {
    if (!els.playIcon) return;
    els.playIcon.textContent = isPlaying ? "⏸️" : "▶️";
  }

  function setCardPlayIcons() {
    const cards = els.ayahList.querySelectorAll(".ayah-card");
    cards.forEach((card) => {
      const idx = Number(card.dataset.index || "-1");
      const btn = card.querySelector(".play-ayah-btn");
      if (!btn) return;
      if (idx === state.currentIndex && state.isPlaying) {
        btn.textContent = "⏸️";
      } else {
        btn.textContent = "▶️";
      }
    });
  }

  function playAyah(index) {
    if (!audio || !state.ayahs[index]) return;
    const ayahNo = index + 1;
    const ayah = state.ayahs[index];

    if (state.currentIndex === index && state.isPlaying) {
      audio.pause();
      state.isPlaying = false;
      setGlobalPlayIcon(false);
      setCardPlayIcons();
      return;
    }

    audio.src = ayah.audio;
    audio.currentTime = 0;
    audio.play().then(
      () => {
        state.isPlaying = true;
        highlightAyah(index, true);
        setGlobalPlayIcon(true);
        setCardPlayIcons();
      },
      (err) => {
        console.error(err);
        showToast("Audio gagal dimuat. Cuba lagi sebentar.");
      }
    );
  }

  function playNextAyah() {
    if (state.currentIndex === null) return;
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.ayahs.length) {
      state.isPlaying = false;
      setGlobalPlayIcon(false);
      setCardPlayIcons();
      return;
    }
    playAyah(nextIndex);
  }

  function setupAudio() {
    audio = new Audio();
    audio.preload = "metadata";

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration || !els.progressFill) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      els.progressFill.style.width = `${Math.min(100, pct)}%`;
    });

    audio.addEventListener("ended", () => {
      els.progressFill.style.width = "0%";
      playNextAyah();
    });

    audio.addEventListener("pause", () => {
      state.isPlaying = false;
      setGlobalPlayIcon(false);
      setCardPlayIcons();
    });

    audio.addEventListener("play", () => {
      state.isPlaying = true;
      setGlobalPlayIcon(true);
      setCardPlayIcons();
    });

    if (els.progressBar) {
      els.progressBar.addEventListener("click", (e) => {
        if (!audio.duration) return;
        const rect = els.progressBar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = Math.max(0, Math.min(audio.duration * ratio, audio.duration));
      });
    }

    if (els.playBtn) {
      els.playBtn.addEventListener("click", () => {
        if (state.currentIndex === null) {
          // mula dari ayat 1
          playAyah(0);
        } else if (state.isPlaying) {
          audio.pause();
        } else {
          audio.play().catch(() => {
            playAyah(state.currentIndex || 0);
          });
        }
      });
    }
  }

  function toggleBookmark(ayahNo, card, btn) {
    if (state.bookmarks.has(ayahNo)) {
      state.bookmarks.delete(ayahNo);
      btn.classList.remove("active");
      const note = card.querySelector(".bookmark-note");
      if (note) note.remove();
      showToast(`Ayat ${ayahNo} dibuang dari bookmark.`);
    } else {
      state.bookmarks.add(ayahNo);
      btn.classList.add("active");
      if (!card.querySelector(".bookmark-note")) {
        const note = document.createElement("div");
        note.className = "bookmark-note";
        note.textContent =
          "Ayat ini ditandakan sebagai bookmark. Anda boleh tapis melalui butang 🔖 di bahagian atas.";
        card.appendChild(note);
      }
      showToast(`Ayat ${ayahNo} disimpan dalam bookmark.`);
    }

    updateStatsUI();
    persistState();
    if (state.showBookmarksOnly) {
      applyBookmarksFilter();
    }
  }

  async function copyAyah(ayahNo, ayahObj) {
    const text = [
      `Surah Al-Maidah, ayat ${ayahNo}`,
      ayahObj.arabic,
      ayahObj.rumi,
      ayahObj.translation,
      "",
      "Sumber: Al-Quran (ms.basmeih)"
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      showToast(`Ayat ${ayahNo} disalin ke papan klip.`);
    } catch (e) {
      console.error(e);
      showToast("Gagal salin teks. Sila salin secara manual.");
    }
  }

  function applyVisibilityToggles() {
    const showArabic = els.toggleArabic.classList.contains("active");
    const showRumi = els.toggleRumi.classList.contains("active");
    const showTrans = els.toggleTranslation.classList.contains("active");

    const cards = els.ayahList.querySelectorAll(".ayah-card");
    cards.forEach((card) => {
      const a = card.querySelector(".ayah-arabic");
      const r = card.querySelector(".ayah-rumi");
      const t = card.querySelector(".ayah-translation");
      if (a) a.style.display = showArabic ? "" : "none";
      if (r) r.style.display = showRumi ? "" : "none";
      if (t) t.style.display = showTrans ? "" : "none";
    });
  }

  function applyBookmarksFilter() {
    const cards = els.ayahList.querySelectorAll(".ayah-card");
    cards.forEach((card) => {
      const index = Number(card.dataset.index || "-1");
      const ayahNo = index + 1;
      if (state.showBookmarksOnly && !state.bookmarks.has(ayahNo)) {
        card.classList.add("hidden");
      } else {
        card.classList.remove("hidden");
      }
    });
  }

  function handleSearchInput(value) {
    const q = value.trim().toLowerCase();
    const cards = els.ayahList.querySelectorAll(".ayah-card");

    if (!q) {
      cards.forEach((card) => {
        card.classList.remove("hidden-search");
      });
      return;
    }

    const numberMatch = q.match(/^(\d+)(?:\s*[-:]\s*(\d+))?$/);

    cards.forEach((card) => {
      const idx = Number(card.dataset.index || "-1");
      const ayahNo = idx + 1;
      let match = false;

      if (numberMatch) {
        const from = parseInt(numberMatch[1], 10);
        const to = numberMatch[2] ? parseInt(numberMatch[2], 10) : from;
        if (ayahNo >= from && ayahNo <= to) {
          match = true;
        }
      } else {
        const arabic = card
          .querySelector(".ayah-arabic-text")
          ?.textContent.toLowerCase() || "";
        const rumi = card
          .querySelector(".ayah-rumi-text")
          ?.textContent.toLowerCase() || "";
        const trans = card
          .querySelector(".ayah-translation-text")
          ?.textContent.toLowerCase() || "";

        if (arabic.includes(q) || rumi.includes(q) || trans.includes(q)) {
          match = true;
        }
      }

      if (match) {
        card.classList.remove("hidden-search");
      } else {
        card.classList.add("hidden-search");
      }
    });
  }

  function applySearchAndBookmarks() {
    // combine both filters by using two classes
    const cards = els.ayahList.querySelectorAll(".ayah-card");
    cards.forEach((card) => {
      const hiddenByBookmark = state.showBookmarksOnly && !state.bookmarks.has(Number(card.dataset.index) + 1);
      const hiddenBySearch = card.classList.contains("hidden-search");
      if (hiddenByBookmark || hiddenBySearch) {
        card.style.display = "none";
      } else {
        card.style.display = "";
      }
    });
  }

  function wireEvents() {
    if (els.toggleArabic) {
      els.toggleArabic.addEventListener("click", () => {
        els.toggleArabic.classList.toggle("active");
        applyVisibilityToggles();
      });
    }
    if (els.toggleRumi) {
      els.toggleRumi.addEventListener("click", () => {
        els.toggleRumi.classList.toggle("active");
        applyVisibilityToggles();
      });
    }
    if (els.toggleTranslation) {
      els.toggleTranslation.addEventListener("click", () => {
        els.toggleTranslation.classList.toggle("active");
        applyVisibilityToggles();
      });
    }

    if (els.toggleDarkMode) {
      els.toggleDarkMode.addEventListener("click", () => {
        setDarkMode(!state.isDark);
      });
    }

    if (els.showBookmarks) {
      els.showBookmarks.addEventListener("click", () => {
        state.showBookmarksOnly = !state.showBookmarksOnly;
        els.showBookmarks.classList.toggle("active", state.showBookmarksOnly);
        applyBookmarksFilter();
        applySearchAndBookmarks();
      });
    }

    if (els.searchAyah) {
      els.searchAyah.addEventListener("input", (e) => {
        handleSearchInput(e.target.value);
        applySearchAndBookmarks();
      });
    }

    if (els.shareBtn) {
      els.shareBtn.addEventListener("click", async () => {
        const url = window.location.href.split("#")[0] + "#surah-al-maidah-tool";
        const shareData = {
          title: "Surah Al-Maidah – IlmuAlam",
          text: "Baca & tadabbur Surah Al-Maidah dengan teks Arab, Rumi, terjemahan Melayu & audio Mishary Alafasy.",
          url,
        };
        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(url);
            showToast("Pautan tool disalin ke papan klip.");
          } else {
            showToast("Share tidak disokong pelayar ini.");
          }
        } catch {
          showToast("Gagal berkongsi pautan.");
        }
      });
    }

    // kecilkan / besarkan shadow bila sticky top
    if (els.controlsBar) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            els.controlsBar.classList.toggle("is-stuck", !entry.isIntersecting);
          });
        },
        { threshold: 1 }
      );
      observer.observe(els.controlsBar);
    }
  }

  async function fetchData() {
    const loading = $("ayahLoading");
    if (loading) loading.textContent = "Memuatkan ayat & audio Surah Al-Maidah...";

    try {
      const res = await fetch(CONFIG.apiUrl);
      const json = await res.json();
      if (!json || json.code !== 200) {
        throw new Error("API response error");
      }

      const editions = json.data;
      const arabicEdition = editions.find((e) => e.edition.identifier === "quran-uthmani");
      const audioEdition = editions.find((e) => e.edition.identifier === "ar.alafasy");
      const msEdition = editions.find((e) => e.edition.identifier === "ms.basmeih");
      const rumiEdition = editions.find((e) => e.edition.identifier === "en.transliteration");

      const len = CONFIG.totalAyahs;

      const ayahs = [];
      for (let i = 0; i < len; i++) {
        ayahs.push({
          index: i,
          arabic: arabicEdition?.ayahs[i]?.text || "",
          translation: msEdition?.ayahs[i]?.text || "",
          rumi: rumiEdition?.ayahs[i]?.text || "",
          audio: audioEdition?.ayahs[i]?.audio || "",
        });
      }

      state.ayahs = ayahs;
      if (loading) loading.remove();
      buildAyahCards();
      applyVisibilityToggles();
      applyBookmarksFilter();
      applySearchAndBookmarks();
      state.audioReady = true;
    } catch (e) {
      console.error(e);
      if (loading) {
        loading.textContent =
          "Gagal memuatkan data daripada pelayan. Sila semak sambungan internet dan cuba refresh.";
      }
      showToast("Gagal memuatkan data Surah Al-Maidah.");
    }
  }

  function init() {
    const root = document.getElementById("surah-al-maidah-tool");
    if (!root) return;

    els.surahContainer = $("surahContainer");
    els.controlsBar = $("controlsBar");
    els.ayahList = $("ayahList");
    els.totalAyahs = $("totalAyahs");
    els.readCount = $("readCount");
    els.bookmarkedCount = $("bookmarkedCount");
    els.bookmarkCount = $("bookmarkCount");
    els.playBtn = $("playBtn");
    els.playIcon = $("playIcon");
    els.currentAyahText = $("currentAyahText");
    els.progressBar = $("progressBar");
    els.progressFill = $("progressFill");
    els.toggleArabic = $("toggleArabic");
    els.toggleRumi = $("toggleRumi");
    els.toggleTranslation = $("toggleTranslation");
    els.toggleDarkMode = $("toggleDarkMode");
    els.showBookmarks = $("showBookmarks");
    els.searchAyah = $("searchAyah");
    els.shareBtn = $("shareBtn");

    loadPersistedState();
    setupAudio();
    wireEvents();

    // apply initial dark mode
    setDarkMode(state.isDark);

    fetchData();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
