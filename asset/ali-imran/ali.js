// Nama Fail: surah-ali-imran-tool.js
document.addEventListener('DOMContentLoaded', function() {
    (function() {
        // --- Konfigurasi Utama ---
        const surahNumber = 3; // Surah Ali 'Imran
        const surahName = "Ali Imran";
        const totalAyahs = 200;

        // --- Pemilih Elemen DOM ---
        const surahContainer = document.getElementById('surah-aliimran-tool-container');
        if (!surahContainer) return; // Hentikan jika bekas tidak dijumpai

        const ayahListContainer = surahContainer.querySelector('#ilmu-sai-ayah-list');
        const audioPlayer = surahContainer.querySelector('#ilmu-sai-audio-player');
        const playPauseAllBtn = surahContainer.querySelector('#ilmu-sai-play-pause-all');
        const autoplayToggle = surahContainer.querySelector('#ilmu-sai-autoplay-toggle');
        const loadingIndicator = surahContainer.querySelector('#ilmu-sai-loading');
        const controlsContainer = surahContainer.querySelector('.ilmu-sai-controls');
        const notification = surahContainer.querySelector('#ilmu-sai-copy-notification');
        const goToAyahSelect = surahContainer.querySelector('#ilmu-sai-goto-ayah');

        // --- Pembolehubah Keadaan ---
        const surahData = [];
        let currentAyahIndex = -1;
        let isPlaying = false;
        let bookmarkedAyahs = new Set(JSON.parse(localStorage.getItem(`bookmarked_${surahNumber}`)) || []);

        // --- Fungsi Utama ---
        async function fetchSurahData() {
            try {
                // API mengambil 3 edisi: Arab, Terjemahan Melayu, dan Transliterasi Rumi
                const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/ar.alafasy,ms.basmeih,en.transliteration`);
                if (!response.ok) throw new Error('Respons rangkaian tidak baik');
                const data = await response.json();

                if (loadingIndicator) loadingIndicator.style.display = 'none';
                if (controlsContainer) controlsContainer.style.display = 'flex';

                const arabicAyahs = data.data[0].ayahs;
                const malayAyahs = data.data[1].ayahs;
                const rumiAyahs = data.data[2].ayahs;

                for (let i = 0; i < arabicAyahs.length; i++) {
                    surahData.push({
                        number: arabicAyahs[i].numberInSurah,
                        arabic: arabicAyahs[i].text,
                        translation: malayAyahs[i].text,
                        transliteration: rumiAyahs[i].text,
                        audio: arabicAyahs[i].audio
                    });
                }
                populateGoToAyah();
                renderAyahs();
            } catch (error) {
                if (loadingIndicator) loadingIndicator.innerHTML = `<p style="color:red;">Maaf, gagal memuatkan data Surah ${surahName}. Sila cuba lagi nanti.</p>`;
                console.error(`Error fetching Surah ${surahName} data:`, error);
            }
        }

        function populateGoToAyah() {
            if (!goToAyahSelect) return;
            for (let i = 1; i <= totalAyahs; i++) {
                const option = document.createElement('option');
                option.value = i - 1; // Indeks berasaskan 0
                option.textContent = `Ayat ${i}`;
                goToAyahSelect.appendChild(option);
            }
        }

        function renderAyahs() {
            if (!ayahListContainer) return;
            const fragment = document.createDocumentFragment();
            surahData.forEach((ayah, index) => {
                const ayahDiv = document.createElement('div');
                ayahDiv.className = 'ilmu-sai-ayah';
                ayahDiv.id = `ilmu-sai-ayah-${index}`;
                if (bookmarkedAyahs.has(index)) {
                    ayahDiv.classList.add('ilmu-sai-bookmarked');
                }

                const bookmarkIcon = bookmarkedAyahs.has(index)
                    ? `<svg fill="#ffc107" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg>`
                    : `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"></path></svg>`;

                ayahDiv.innerHTML = `
                    <div class="ilmu-sai-ayah-header">
                        <span class="ilmu-sai-ayah-number">${surahName} : Ayat ${ayah.number}</span>
                        <button class="ilmu-sai-action-button" data-action="play" data-index="${index}" aria-label="Mainkan Ayat ${ayah.number}">
                             <svg fill="#249749" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        </button>
                    </div>
                    <p class="ilmu-sai-arabic">${ayah.arabic}</p>
                    <p class="ilmu-sai-rumi">${ayah.transliteration}</p>
                    <p class="ilmu-sai-translation">${ayah.translation}</p>
                    <div class="ilmu-sai-ayah-actions">
                         <button class="ilmu-sai-action-button" data-action="copy" data-index="${index}">
                            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>
                            Copy
                        </button>
                        <button class="ilmu-sai-action-button" data-action="share" data-index="${index}">
                           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 8.11C7.5 7.61 6.79 7.3 6 7.3c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>
                            Share
                        </button>
                         <button class="ilmu-sai-action-button" data-action="bookmark" data-index="${index}">
                            ${bookmarkIcon}
                            Bookmark
                        </button>
                    </div>
                `;
                fragment.appendChild(ayahDiv);
            });
            ayahListContainer.innerHTML = '';
            ayahListContainer.appendChild(fragment);
        }
        
        function handleAction(e) {
            const target = e.target.closest('.ilmu-sai-action-button');
            if (!target) return;

            const action = target.dataset.action;
            const index = parseInt(target.dataset.index);
            const ayahData = surahData[index];
            const textToCopy = `Surah ${surahName}, Ayat ${ayahData.number}:\n\n${ayahData.arabic}\n\nTerjemahan: "${ayahData.translation}"\n\n- Dari ilmualam.com`;

            if (action === 'play') playAyah(index);
            if (action === 'copy') copyToClipboard(textToCopy);
            if (action === 'share') shareAyah(textToCopy);
            if (action === 'bookmark') toggleBookmark(index, target);
        }

        function addEventListeners() {
            ayahListContainer.addEventListener('click', handleAction);
            playPauseAllBtn.addEventListener('click', () => isPlaying ? stopPlayback() : playAyah(0));
            audioPlayer.addEventListener('ended', () => {
                if (autoplayToggle.checked && currentAyahIndex < surahData.length - 1) {
                    playAyah(currentAyahIndex + 1);
                } else {
                    stopPlayback();
                }
            });
            goToAyahSelect.addEventListener('change', (e) => {
                const ayahIndex = parseInt(e.target.value);
                const targetAyah = document.getElementById(`ilmu-sai-ayah-${ayahIndex}`);
                if(targetAyah) {
                    targetAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        function playAyah(index) {
            if (index >= surahData.length || index < 0) return stopPlayback();
            currentAyahIndex = index;
            audioPlayer.src = surahData[index].audio;
            audioPlayer.play().catch(e => console.error("Audio error:", e));
            isPlaying = true;
            updateUIForPlayback();
        }

        function stopPlayback() {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            isPlaying = false;
            currentAyahIndex = -1;
            updateUIForPlayback();
        }

        function updateUIForPlayback() {
            playPauseAllBtn.textContent = isPlaying ? 'Hentikan Bacaan' : 'Mula Bacaan';
            document.querySelectorAll('.ilmu-sai-ayah').forEach((div, idx) => {
                const playBtnIcon = div.querySelector('[data-action="play"] svg path');
                if (idx === currentAyahIndex && isPlaying) {
                    div.classList.add('ilmu-sai-playing');
                    if (playBtnIcon) playBtnIcon.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'); // Pause
                    div.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if(goToAyahSelect) goToAyahSelect.value = idx;
                } else {
                    div.classList.remove('ilmu-sai-playing');
                    if (playBtnIcon) playBtnIcon.setAttribute('d', 'M8 5v14l11-7z'); // Play
                }
            });
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => showNotification("Teks berjaya disalin!"));
        }

        async function shareAyah(text) {
            if (navigator.share) {
                try {
                    await navigator.share({ title: `Ayat dari Surah ${surahName}`, text: text, url: window.location.href });
                } catch(err) { console.error('Share failed:', err); }
            } else {
                copyToClipboard(text);
            }
        }
        
        function toggleBookmark(index, button) {
            const ayahDiv = document.getElementById(`ilmu-sai-ayah-${index}`);
            if (bookmarkedAyahs.has(index)) {
                bookmarkedAyahs.delete(index);
                ayahDiv.classList.remove('ilmu-sai-bookmarked');
                button.innerHTML = `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"></path></svg> Tanda`;
            } else {
                bookmarkedAyahs.add(index);
                ayahDiv.classList.add('ilmu-sai-bookmarked');
                 button.innerHTML = `<svg fill="#ffc107" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg> Ditanda`;
            }
            localStorage.setItem(`bookmarked_${surahNumber}`, JSON.stringify([...bookmarkedAyahs]));
        }
        
        function showNotification(message) {
            if (!notification) return;
            notification.textContent = message;
            notification.style.opacity = 1;
            setTimeout(() => { notification.style.opacity = 0; }, 2000);
        }

        // --- Mulakan Alat ---
        fetchSurahData();
        addEventListeners();
    })();
});
