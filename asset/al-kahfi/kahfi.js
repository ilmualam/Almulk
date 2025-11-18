
document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('ilmu-kahf-app');
    if (!app) return;

    // --- STATE MANAGEMENT ---
    let state = {
        surahData: null,
        isLoading: true,
        error: null,
        currentVerseKey: null, // e.g., 'verse-1'
        isPlaying: false,
        isAutoScroll: true,
        displayOptions: {
            showArabic: true,
            showTransliteration: true,
            showTranslation: true,
        },
        bookmarkedVerses: [],
    };

    // --- DOM ELEMENT REFERENCES ---
    const dom = {
        loader: app.querySelector('#ilmu-kahf-loader'),
        errorContainer: app.querySelector('#ilmu-kahf-error'),
        mainContent: app.querySelector('#ilmu-kahf-main'),
        playerContainer: app.querySelector('#ilmu-kahf-player-container'),
        surahName: app.querySelector('#ilmu-kahf-surah-name'),
        surahEnglishName: app.querySelector('#ilmu-kahf-surah-english-name'),
        storyNavigator: app.querySelector('#ilmu-kahf-story-nav'),
        playPauseBtn: app.querySelector('#ilmu-kahf-play-pause-btn'),
        playIcon: app.querySelector('#ilmu-kahf-play-icon'),
        pauseIcon: app.querySelector('#ilmu-kahf-pause-icon'),
        autoScrollBtn: app.querySelector('#ilmu-kahf-autoscroll-btn'),
        scrollIcon: app.querySelector('#ilmu-kahf-scroll-icon'),
        noScrollIcon: app.querySelector('#ilmu-kahf-noscroll-icon'),
        settingsBtn: app.querySelector('#ilmu-kahf-settings-btn'),
        settingsPopup: app.querySelector('#ilmu-kahf-settings-popup'),
        arabicToggle: app.querySelector('#ilmu-kahf-toggle-arabic'),
        transliterationToggle: app.querySelector('#ilmu-kahf-toggle-transliteration'),
        translationToggle: app.querySelector('#ilmu-kahf-toggle-translation'),
        goToVerseForm: app.querySelector('#ilmu-kahf-goto-form'),
        goToVerseInput: app.querySelector('#ilmu-kahf-goto-input'),
        scrollToTopBtn: app.querySelector('#ilmu-kahf-scroll-top'),
        audioPlayer: new Audio(),
    };

    const ALQURAN_API_BASE = 'https://api.alquran.cloud/v1';
    const BOOKMARKS_KEY = 'alkahf-bookmarks';

    // --- SERVICES ---
    async function fetchSurah(surahNumber) {
        const editions = 'quran-uthmani,en.transliteration,ms.basmeih';
        const url = `${ALQURAN_API_BASE}/surah/${surahNumber}/editions/${editions}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const json = await response.json();
        const data = json.data;

        if (data.length < 3) throw new Error('Could not fetch all required editions.');
        
        const arabicEd = data.find(e => e.edition.identifier === 'quran-uthmani');
        const transliEd = data.find(e => e.edition.identifier === 'en.transliteration');
        const translaEd = data.find(e => e.edition.identifier === 'ms.basmeih');

        if (!arabicEd || !transliEd || !translaEd) throw new Error('Missing editions in API response.');

        const verses = arabicEd.ayahs.map((ayah, index) => ({
            numberInSurah: ayah.numberInSurah,
            arabicText: ayah.text,
            transliterationText: transliEd.ayahs[index].text,
            translationText: translaEd.ayahs[index].text,
            audio: ayah.audio,
        }));

        return {
            name: arabicEd.name,
            englishName: arabicEd.englishName,
            verses: verses,
        };
    }

    function loadBookmarks() {
        try {
            const stored = localStorage.getItem(BOOKMARKS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load bookmarks:", e);
            return [];
        }
    }

    function saveBookmarks() {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(state.bookmarkedVerses));
        } catch (e) {
            console.error("Failed to save bookmarks:", e);
        }
    }

    // --- UI RENDERING & UPDATES ---
    function render() {
        dom.loader.style.display = state.isLoading ? 'flex' : 'none';
        dom.errorContainer.style.display = state.error ? 'flex' : 'none';
        dom.mainContent.style.display = (state.surahData && !state.isLoading && !state.error) ? 'block' : 'none';
        
        if(state.error) dom.errorContainer.querySelector('p').textContent = state.error;

        if (state.surahData) {
            dom.surahName.textContent = state.surahData.name;
            dom.surahEnglishName.textContent = state.surahData.englishName;
            dom.goToVerseInput.max = state.surahData.verses.length;
            renderAllVerses();
        }
    }
    
    function renderAllVerses() {
        const fragment = document.createDocumentFragment();
        state.surahData.verses.forEach(verse => {
            fragment.appendChild(createVerseElement(verse));
        });
        dom.playerContainer.innerHTML = '';
        dom.playerContainer.appendChild(fragment);
        updateVerseVisibility();
    }

    function createVerseElement(verse) {
        const isBookmarked = state.bookmarkedVerses.includes(verse.numberInSurah);
        const verseEl = document.createElement('div');
        verseEl.className = 'ilmu-kahf-verse';
        verseEl.id = `verse-${verse.numberInSurah}`;
        verseEl.dataset.verseNumber = verse.numberInSurah;

        verseEl.innerHTML = `
            <div class="ilmu-kahf-verse-header">
                <span class="ilmu-kahf-verse-number">${verse.numberInSurah}</span>
                <div class="ilmu-kahf-verse-actions">
                    <button title="Play Audio" data-action="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                    </button>
                    <button title="Copy Verse" data-action="copy">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button title="Share Verse" data-action="share">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                    </button>
                    <button title="${isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}" data-action="bookmark">
                       ${isBookmarked 
                         ? `<svg class="ilmu-kahf-bookmarked-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>`
                         : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>`
                       }
                    </button>
                </div>
            </div>
            <div class="ilmu-kahf-verse-content">
                <p class="ilmu-kahf-arabic">${verse.arabicText}</p>
                <p class="ilmu-kahf-transliteration">${verse.transliterationText}</p>
                <p class="ilmu-kahf-translation">${verse.translationText}</p>
            </div>
        `;
        return verseEl;
    }

    function updatePlayPauseIcon() {
        dom.playIcon.style.display = state.isPlaying ? 'none' : 'block';
        dom.pauseIcon.style.display = state.isPlaying ? 'block' : 'none';
    }

    function updateAutoScrollIcon() {
        dom.scrollIcon.style.display = state.isAutoScroll ? 'block' : 'none';
        dom.noScrollIcon.style.display = state.isAutoScroll ? 'none' : 'block';
    }

    function highlightActiveVerse() {
        app.querySelectorAll('.ilmu-kahf-verse.ilmu-kahf-active').forEach(el => el.classList.remove('ilmu-kahf-active'));
        if (state.currentVerseKey) {
            const activeVerse = app.querySelector(`#${state.currentVerseKey}`);
            if (activeVerse) {
                activeVerse.classList.add('ilmu-kahf-active');
                if (state.isAutoScroll) {
                    activeVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }
    
    function updateVerseVisibility() {
        app.style.setProperty('--ilmu-kahf-show-arabic', state.displayOptions.showArabic ? 'block' : 'none');
        app.style.setProperty('--ilmu-kahf-show-transliteration', state.displayOptions.showTransliteration ? 'block' : 'none');
        app.style.setProperty('--ilmu-kahf-show-translation', state.displayOptions.showTranslation ? 'block' : 'none');
    }

    function updateBookmarkIcon(verseNumber, isBookmarked) {
        const btn = app.querySelector(`#verse-${verseNumber} [data-action="bookmark"]`);
        if (btn) {
            btn.title = isBookmarked ? 'Remove Bookmark' : 'Add Bookmark';
            btn.innerHTML = isBookmarked
                ? `<svg class="ilmu-kahf-bookmarked-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>`;
        }
    }

    // --- ACTIONS & EVENT HANDLERS ---
    function getVerseByKey(key) {
        if (!state.surahData || !key) return null;
        const verseNum = parseInt(key.split('-')[1]);
        return state.surahData.verses[verseNum - 1];
    }
    
    function playVerse(verseKey) {
        const verse = getVerseByKey(verseKey);
        if (verse && dom.audioPlayer) {
            dom.audioPlayer.src = verse.audio;
            dom.audioPlayer.play().then(() => {
                state.isPlaying = true;
                state.currentVerseKey = verseKey;
                updatePlayPauseIcon();
                highlightActiveVerse();
            }).catch(e => console.error("Audio playback failed:", e));
        }
    }

    function handlePlayPause() {
        if (state.isPlaying) {
            dom.audioPlayer.pause();
            state.isPlaying = false;
        } else {
            if (state.currentVerseKey) {
                dom.audioPlayer.play().catch(e => console.error("Audio resume failed:", e));
                state.isPlaying = true;
            } else if (state.surahData?.verses.length) {
                playVerse('verse-1');
            }
        }
        updatePlayPauseIcon();
    }
    
    function playNextVerse() {
        if (!state.surahData || !state.currentVerseKey) return;
        const currentNum = parseInt(state.currentVerseKey.split('-')[1]);
        if (currentNum < state.surahData.verses.length) {
            playVerse(`verse-${currentNum + 1}`);
        } else {
            state.isPlaying = false;
            state.currentVerseKey = null;
            updatePlayPauseIcon();
            highlightActiveVerse();
        }
    }
    
    function handleVerseAction(e) {
        const target = e.target.closest('button');
        if (!target) return;

        const action = target.dataset.action;
        const verseEl = target.closest('.ilmu-kahf-verse');
        const verseNum = parseInt(verseEl.dataset.verseNumber);
        const verse = state.surahData.verses[verseNum - 1];

        if (!action || !verse) return;

        switch(action) {
            case 'play':
                playVerse(`verse-${verseNum}`);
                break;
            case 'copy':
                const textToCopy = `Surah Al-Kahf, Ayah ${verse.numberInSurah}\n\nArabic:\n${verse.arabicText}\n\nTransliteration:\n${verse.transliterationText}\n\nTranslation (Malay):\n${verse.translationText}\n\nShared from ilmualam.com`.trim();
                navigator.clipboard.writeText(textToCopy)
                    .then(() => alert('Verse copied!'))
                    .catch(() => alert('Failed to copy.'));
                break;
            case 'share':
                 if (navigator.share) {
                    navigator.share({
                        title: `Surah Al-Kahf, Ayah ${verse.numberInSurah}`,
                        text: `${verse.translationText} - (Al-Kahf: ${verse.numberInSurah})`,
                        url: window.location.href
                    }).catch(console.error);
                } else {
                    alert('Share API not supported. Please copy the verse instead.');
                }
                break;
            case 'bookmark':
                const isBookmarked = state.bookmarkedVerses.includes(verseNum);
                if (isBookmarked) {
                    state.bookmarkedVerses = state.bookmarkedVerses.filter(v => v !== verseNum);
                } else {
                    state.bookmarkedVerses.push(verseNum);
                    state.bookmarkedVerses.sort((a, b) => a - b);
                }
                saveBookmarks();
                updateBookmarkIcon(verseNum, !isBookmarked);
                break;
        }
    }
    
    function scrollToVerse(verseNumber) {
        const verseEl = app.querySelector(`#verse-${verseNumber}`);
        if(verseEl) {
            verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // --- INITIALIZATION ---
    async function init() {
        state.bookmarkedVerses = loadBookmarks();
        render(); // Show loader initially

        try {
            const data = await fetchSurah(18);
            state.surahData = data;
        } catch (err) {
            state.error = 'Failed to load Surah data. Please check your connection and try again.';
            console.error(err);
        } finally {
            state.isLoading = false;
            render();
        }

        // Attach event listeners
        dom.playPauseBtn.addEventListener('click', handlePlayPause);
        dom.audioPlayer.addEventListener('ended', playNextVerse);
        dom.playerContainer.addEventListener('click', handleVerseAction);

        dom.autoScrollBtn.addEventListener('click', () => {
            state.isAutoScroll = !state.isAutoScroll;
            updateAutoScrollIcon();
        });

        dom.storyNavigator.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (btn && btn.dataset.verse) {
                scrollToVerse(parseInt(btn.dataset.verse));
            }
        });
        
        dom.goToVerseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const num = parseInt(dom.goToVerseInput.value);
            if (num > 0 && num <= state.surahData.verses.length) {
                scrollToVerse(num);
                dom.goToVerseInput.value = '';
            } else {
                alert(`Enter a verse between 1 and ${state.surahData.verses.length}.`);
            }
        });

        dom.settingsBtn.addEventListener('click', () => {
            dom.settingsPopup.classList.toggle('ilmu-kahf-show');
        });
        
        document.addEventListener('click', (e) => {
            if (!dom.settingsBtn.contains(e.target) && !dom.settingsPopup.contains(e.target)) {
                dom.settingsPopup.classList.remove('ilmu-kahf-show');
            }
        });

        dom.arabicToggle.addEventListener('change', (e) => {
            state.displayOptions.showArabic = e.target.checked;
            updateVerseVisibility();
        });
        dom.transliterationToggle.addEventListener('change', (e) => {
            state.displayOptions.showTransliteration = e.target.checked;
            updateVerseVisibility();
        });
        dom.translationToggle.addEventListener('change', (e) => {
            state.displayOptions.showTranslation = e.target.checked;
            updateVerseVisibility();
        });
        
        dom.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Initial UI state updates
        updatePlayPauseIcon();
        updateAutoScrollIcon();
    }

    init();
});
