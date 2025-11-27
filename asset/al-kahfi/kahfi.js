/* IlmuAlam Surah Al-Kahfi - https://ilmualam.com
 * - Vanilla JS, lightweight
 * - Via Audio & Full Surah from Aladhan
 * - LocalStorage cache (kurang hit API)
 */
(function () {
    "use strict";

    const CONFIG = {
        surahId: 18,
        apiUrl: "https://api.alquran.cloud/v1/surah/18/editions/quran-uthmani,ms.basmeih,en.transliteration,ar.alafasy",
        localStorageKey: "ilmu_kahf_bookmarks_v1"
    };

    // --- State Global ---
    let verses = [];              // [{number, arabic, translation, transliteration, audio}]
    let currentIndex = 0;         // index ayat semasa (0-based)
    let isPlaying = false;
    let autoScrollEnabled = true;
    let audioEl = null;
    let bookmarks = new Set();

    // --- Elemen DOM ---
    const appRoot = document.getElementById("ilmu-kahf-app");
    const loaderEl = document.getElementById("ilmu-kahf-loader");
    const errorEl = document.getElementById("ilmu-kahf-error");
    const mainEl = document.getElementById("ilmu-kahf-main");

    const surahNameEl = document.getElementById("ilmu-kahf-surah-name");
    const surahEnglishNameEl = document.getElementById("ilmu-kahf-surah-english-name");
    const versesContainerEl = document.getElementById("ilmu-kahf-player-container");

    const storyNavButtons = document.querySelectorAll("#ilmu-kahf-story-nav button");

    const gotoForm = document.getElementById("ilmu-kahf-goto-form");
    const gotoInput = document.getElementById("ilmu-kahf-goto-input");

    const playPauseBtn = document.getElementById("ilmu-kahf-play-pause-btn");
    const playIcon = document.getElementById("ilmu-kahf-play-icon");
    const pauseIcon = document.getElementById("ilmu-kahf-pause-icon");

    const autoscrollBtn = document.getElementById("ilmu-kahf-autoscroll-btn");
    const scrollIcon = document.getElementById("ilmu-kahf-scroll-icon");
    const noscrollIcon = document.getElementById("ilmu-kahf-noscroll-icon");

    const settingsBtn = document.getElementById("ilmu-kahf-settings-btn");
    const settingsPopup = document.getElementById("ilmu-kahf-settings-popup");
    const scrollTopBtn = document.getElementById("ilmu-kahf-scroll-top");

    const toggleArabic = document.getElementById("ilmu-kahf-toggle-arabic");
    const toggleTransliteration = document.getElementById("ilmu-kahf-toggle-transliteration");
    const toggleTranslation = document.getElementById("ilmu-kahf-toggle-translation");

    // --- Utiliti Kecil ---
    function showLoader() {
        if (loaderEl) loaderEl.style.display = "flex";
        if (errorEl) errorEl.style.display = "none";
        if (mainEl) mainEl.style.display = "none";
    }

    function showError(msg) {
        if (loaderEl) loaderEl.style.display = "none";
        if (mainEl) mainEl.style.display = "none";
        if (errorEl) {
            errorEl.style.display = "flex";
            const p = errorEl.querySelector("p");
            if (p) p.textContent = msg || "Sila cuba lagi beberapa saat lagi.";
        }
    }

    function showMain() {
        if (loaderEl) loaderEl.style.display = "none";
        if (errorEl) errorEl.style.display = "none";
        if (mainEl) mainEl.style.display = "block";
    }

    function clampVerseNumber(num) {
        if (!verses.length) return 1;
        if (num < 1) return 1;
        if (num > verses.length) return verses.length;
        return num;
    }

    function getVerseElement(index) {
        return versesContainerEl.querySelector('[data-verse-index="' + index + '"]');
    }

    // --- Bookmarks ---
    function loadBookmarks() {
        try {
            const raw = localStorage.getItem(CONFIG.localStorageKey);
            if (!raw) return;
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                bookmarks = new Set(arr);
            }
        } catch (e) {
            // ignore
        }
    }

    function saveBookmarks() {
        try {
            localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(Array.from(bookmarks)));
        } catch (e) {
            // ignore
        }
    }

    function toggleBookmark(verseNumber) {
        if (bookmarks.has(verseNumber)) {
            bookmarks.delete(verseNumber);
        } else {
            bookmarks.add(verseNumber);
        }
        saveBookmarks();
        updateBookmarkIcon(verseNumber);
    }

    function updateBookmarkIcon(verseNumber) {
        const index = verseNumber - 1;
        const verseEl = getVerseElement(index);
        if (!verseEl) return;
        const bookmarkBtn = verseEl.querySelector(".ilmu-kahf-btn-bookmark svg");
        if (!bookmarkBtn) return;
        if (bookmarks.has(verseNumber)) {
            bookmarkBtn.classList.add("ilmu-kahf-bookmarked-icon");
        } else {
            bookmarkBtn.classList.remove("ilmu-kahf-bookmarked-icon");
        }
    }

    function updateAllBookmarkIcons() {
        bookmarks.forEach(function (num) {
            updateBookmarkIcon(num);
        });
    }

    // --- Audio Logic ---
    function initAudio() {
        audioEl = new Audio();
        audioEl.preload = "none";

        audioEl.addEventListener("ended", function () {
            // Auto next ayat
            if (currentIndex + 1 < verses.length) {
                playFromIndex(currentIndex + 1);
            } else {
                isPlaying = false;
                updateGlobalPlayUI();
            }
        });

        audioEl.addEventListener("play", function () {
            isPlaying = true;
            updateGlobalPlayUI();
        });

        audioEl.addEventListener("pause", function () {
            // Kalau pause sebab nak tukar ayat, status akan di-update dalam playFromIndex
            setTimeout(function () {
                if (audioEl.paused) {
                    isPlaying = false;
                    updateGlobalPlayUI();
                }
            }, 50);
        });
    }

    function updateGlobalPlayUI() {
        if (!playIcon || !pauseIcon) return;
        if (isPlaying) {
            playIcon.style.display = "none";
            pauseIcon.style.display = "block";
        } else {
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
        }
    }

    function setActiveVerse(index, opts) {
        if (!verses.length) return;
        if (index < 0 || index >= verses.length) return;

        // buang active lama
        const prevActive = versesContainerEl.querySelector(".ilmu-kahf-verse.ilmu-kahf-active");
        if (prevActive) {
            prevActive.classList.remove("ilmu-kahf-active");
        }

        const verseEl = getVerseElement(index);
        if (!verseEl) return;

        verseEl.classList.add("ilmu-kahf-active");
        currentIndex = index;

        const options = opts || {};
        if (autoScrollEnabled && options.scroll !== false) {
            verseEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function playFromIndex(index) {
        if (!audioEl || !verses.length) return;
        if (index < 0 || index >= verses.length) return;

        const verse = verses[index];
        if (!verse.audio) {
            // kalau tiada audio, cuma highlight dan berhenti
            setActiveVerse(index, { scroll: true });
            isPlaying = false;
            updateGlobalPlayUI();
            return;
        }

        try {
            audioEl.src = verse.audio;
            audioEl.currentTime = 0;
            setActiveVerse(index, { scroll: true });
            audioEl.play().catch(function () {
                // Auto play blocked
                isPlaying = false;
                updateGlobalPlayUI();
            });
        } catch (e) {
            console.error("Audio error:", e);
        }
    }

    function toggleGlobalPlayPause() {
        if (!audioEl || !verses.length) return;

        if (!audioEl.src) {
            // belum pilih ayat – mula dari ayat 1
            playFromIndex(currentIndex || 0);
            return;
        }

        if (audioEl.paused) {
            audioEl.play().catch(function () {
                isPlaying = false;
                updateGlobalPlayUI();
            });
        } else {
            audioEl.pause();
            isPlaying = false;
            updateGlobalPlayUI();
        }
    }

    // --- Bina Verses DOM ---
    function buildVersesDom() {
        if (!versesContainerEl) return;
        versesContainerEl.innerHTML = "";

        verses.forEach(function (v, idx) {
            const verseWrapper = document.createElement("div");
            verseWrapper.className = "ilmu-kahf-verse";
            verseWrapper.setAttribute("data-verse-index", idx);
            verseWrapper.setAttribute("data-verse-number", v.number);

            // Header (nombor + actions)
            const header = document.createElement("div");
            header.className = "ilmu-kahf-verse-header";

            const numberEl = document.createElement("div");
            numberEl.className = "ilmu-kahf-verse-number";
            numberEl.textContent = v.number;

            // Klik nombor ayat = terus play
            numberEl.addEventListener("click", function (e) {
                e.stopPropagation();
                playFromIndex(idx);
            });

            const actions = document.createElement("div");
            actions.className = "ilmu-kahf-verse-actions";

            // Butang play kecil
            const playBtn = document.createElement("button");
            playBtn.setAttribute("type", "button");
            playBtn.className = "ilmu-kahf-btn-play";
            playBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">' +
                '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>' +
                "</svg>";
            playBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                playFromIndex(idx);
            });

            // Butang copy
            const copyBtn = document.createElement("button");
            copyBtn.setAttribute("type", "button");
            copyBtn.className = "ilmu-kahf-btn-copy";
            copyBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">' +
                '<path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v7a2 2 0 01-2 2H9a2 2 0 01-2-2V9z"></path>' +
                '<path d="M5 3a2 2 0 00-2 2v7a1 1 0 102 0V5h8a1 1 0 000-2H5z"></path>' +
                "</svg>";
            copyBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                const text =
                    "Surah Al-Kahf, ayat " +
                    v.number +
                    ":\n\n" +
                    v.arabic +
                    "\n\nTerjemahan:\n" +
                    v.translation;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).catch(function () {});
                }
            });

            // Butang share
            const shareBtn = document.createElement("button");
            shareBtn.setAttribute("type", "button");
            shareBtn.className = "ilmu-kahf-btn-share";
            shareBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">' +
                '<path d="M15 8a3 3 0 10-2.83-4H11a1 1 0 000 2h1.17A3.001 3.001 0 0015 8zM6 9a3 3 0 10-2.83 4H5a1 1 0 100-2H3.17A3.001 3.001 0 006 9zm9 2a3 3 0 00-2.83 2H11a1 1 0 000 2h1.17A3.001 3.001 0 1015 11z"></path>' +
                '<path d="M7.707 9.293a1 1 0 00-1.414 1.414l6 6a1 1 0 001.414-1.414l-6-6z"></path>' +
                '<path d="M7.707 10.707a1 1 0 01-1.414-1.414l6-6a1 1 0 011.414 1.414l-6 6z"></path>' +
                "</svg>";
            shareBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                const shareText =
                    "Surah Al-Kahf, ayat " +
                    v.number +
                    ":\n" +
                    v.arabic +
                    "\n\nTerjemahan:\n" +
                    v.translation +
                    "\n\nSumber: ilmualam.com";
                if (navigator.share) {
                    navigator
                        .share({
                            title: "Surah Al-Kahf ayat " + v.number,
                            text: shareText
                        })
                        .catch(function () {});
                } else if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(shareText).catch(function () {});
                }
            });

            // Butang bookmark
            const bookmarkBtn = document.createElement("button");
            bookmarkBtn.setAttribute("type", "button");
            bookmarkBtn.className = "ilmu-kahf-btn-bookmark";
            bookmarkBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">' +
                '<path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-3-5 3V4z"></path>' +
                "</svg>";
            bookmarkBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                toggleBookmark(v.number);
            });

            actions.appendChild(playBtn);
            actions.appendChild(copyBtn);
            actions.appendChild(shareBtn);
            actions.appendChild(bookmarkBtn);

            header.appendChild(numberEl);
            header.appendChild(actions);

            // Kandungan ayat
            const content = document.createElement("div");
            content.className = "ilmu-kahf-verse-content";

            const arabicEl = document.createElement("p");
            arabicEl.className = "ilmu-kahf-arabic";
            arabicEl.textContent = v.arabic;

            const translitEl = document.createElement("div");
            translitEl.className = "ilmu-kahf-transliteration";
            translitEl.textContent = v.transliteration;

            const translationEl = document.createElement("div");
            translationEl.className = "ilmu-kahf-translation";
            translationEl.textContent = v.translation;

            content.appendChild(arabicEl);
            content.appendChild(translitEl);
            content.appendChild(translationEl);

            verseWrapper.appendChild(header);
            verseWrapper.appendChild(content);

            versesContainerEl.appendChild(verseWrapper);
        });

        // apply bookmark UI selepas DOM siap
        updateAllBookmarkIcons();
    }

    // --- Fetch Data dari API ---
    function fetchSurahData() {
        showLoader();

        fetch(CONFIG.apiUrl)
            .then(function (res) {
                if (!res.ok) {
                    throw new Error("Gagal mendapatkan data Surah.");
                }
                return res.json();
            })
            .then(function (json) {
                if (!json || json.code !== 200 || !Array.isArray(json.data)) {
                    throw new Error("Format respons API tidak sah.");
                }

                const editions = json.data;
                // Susunan: 0 = arabic, 1 = ms.basmeih, 2 = transliteration, 3 = audio
                const arabicEdition = editions[0];
                const msEdition = editions[1];
                const translitEdition = editions[2];
                const audioEdition = editions[3];

                const totalAyahs = arabicEdition.ayahs.length;

                verses = [];
                for (let i = 0; i < totalAyahs; i++) {
                    verses.push({
                        number: arabicEdition.ayahs[i].numberInSurah,
                        arabic: arabicEdition.ayahs[i].text,
                        translation: msEdition.ayahs[i] ? msEdition.ayahs[i].text : "",
                        transliteration: translitEdition.ayahs[i] ? translitEdition.ayahs[i].text : "",
                        audio: audioEdition.ayahs[i] ? audioEdition.ayahs[i].audio : ""
                    });
                }

                // Set nama surah
                if (surahNameEl) {
                    surahNameEl.textContent = arabicEdition.englishName || "Surah Al-Kahf";
                }
                if (surahEnglishNameEl) {
                    surahEnglishNameEl.textContent =
                        arabicEdition.englishNameTranslation || "The Cave";
                }

                buildVersesDom();
                setActiveVerse(0, { scroll: false });
                showMain();
            })
            .catch(function (err) {
                console.error(err);
                showError("Gagal memuatkan Surah Al-Kahf. Sila pastikan sambungan internet stabil.");
            });
    }

    // --- Event Handlers UI ---
    function initEvents() {
        // Butang play/pause utama
        if (playPauseBtn) {
            playPauseBtn.addEventListener("click", function (e) {
                e.preventDefault();
                toggleGlobalPlayPause();
            });
        }

        // Auto-scroll toggle
        if (autoscrollBtn) {
            autoscrollBtn.addEventListener("click", function (e) {
                e.preventDefault();
                autoScrollEnabled = !autoScrollEnabled;
                if (autoScrollEnabled) {
                    scrollIcon.style.display = "inline-block";
                    noscrollIcon.style.display = "none";
                } else {
                    scrollIcon.style.display = "none";
                    noscrollIcon.style.display = "inline-block";
                }
            });
        }

        // Goto form
        if (gotoForm && gotoInput) {
            gotoForm.addEventListener("submit", function (e) {
                e.preventDefault();
                if (!verses.length) return;
                const val = parseInt(gotoInput.value, 10);
                if (isNaN(val)) return;
                const verseNumber = clampVerseNumber(val);
                const idx = verseNumber - 1;
                setActiveVerse(idx, { scroll: true });
                // auto play bila user guna goto
                playFromIndex(idx);
            });
        }

        // Settings popup
        if (settingsBtn && settingsPopup) {
            settingsBtn.addEventListener("click", function (e) {
                e.preventDefault();
                const isShown = settingsPopup.classList.contains("ilmu-kahf-show");
                if (isShown) {
                    settingsPopup.classList.remove("ilmu-kahf-show");
                } else {
                    settingsPopup.classList.add("ilmu-kahf-show");
                }
            });

            document.addEventListener("click", function (e) {
                if (!settingsPopup.classList.contains("ilmu-kahf-show")) return;
                if (!settingsPopup.contains(e.target) && e.target !== settingsBtn) {
                    settingsPopup.classList.remove("ilmu-kahf-show");
                }
            });
        }

        // Scroll top
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        // Story navigation
        storyNavButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                const verseStr = btn.getAttribute("data-verse");
                if (!verseStr) return;
                const verseNum = parseInt(verseStr, 10);
                if (isNaN(verseNum)) return;
                const idx = clampVerseNumber(verseNum) - 1;
                setActiveVerse(idx, { scroll: true });
                // pengguna boleh tekan play besar atau nombor ayat
            });
        });

        // Toggles paparan
        if (toggleArabic) {
            toggleArabic.addEventListener("change", function () {
                appRoot.style.setProperty(
                    "--ilmu-kahf-show-arabic",
                    toggleArabic.checked ? "block" : "none"
                );
            });
        }
        if (toggleTransliteration) {
            toggleTransliteration.addEventListener("change", function () {
                appRoot.style.setProperty(
                    "--ilmu-kahf-show-transliteration",
                    toggleTransliteration.checked ? "block" : "none"
                );
            });
        }
        if (toggleTranslation) {
            toggleTranslation.addEventListener("change", function () {
                appRoot.style.setProperty(
                    "--ilmu-kahf-show-translation",
                    toggleTranslation.checked ? "block" : "none"
                );
            });
        }
    }

    // --- Init ---
    document.addEventListener("DOMContentLoaded", function () {
        if (!appRoot) return;
        showLoader();
        loadBookmarks();
        initAudio();
        initEvents();
        fetchSurahData();
    });
})();
