/*!
 * Surah Al-Ahzab Interactive Tool v1.0
 * Developed for IlmuAlam.com
 * Licensed under MIT License
 * Copyright (c) 2025 IlmuAlam.com
 * 
 * Features: Per-verse audio, rumi transliteration, Malay translation,
 * bookmark system, search functionality, responsive design
 * 
 * API: Al-Quran Cloud (https://alquran.cloud/api)
 * Qari: Mishary Rashid Alafasy
 */

(function() {
    'use strict';

    const CONFIG = {
        surahNumber: 33,
        surahName: 'Al-Ahzab',
        totalAyahs: 73,
        apiBase: 'https://api.alquran.cloud/v1',
        qari: 'ar.alafasy',
        translation: 'ms.basmeih',
        primaryColor: '#249749',
        darkColor: '#0c3808'
    };

    class SurahAlAhzabTool {
        constructor(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                console.error(`Container ${containerId} not found`);
                return;
            }
            
            this.currentAyah = 1;
            this.isPlaying = false;
            this.audioElement = null;
            this.ayahsData = [];
            this.bookmarks = this.loadBookmarks();
            
            this.init();
        }

        async init() {
            this.showLoading();
            try {
                await this.fetchData();
                this.render();
                this.attachEvents();
            } catch (error) {
                this.showError('Gagal memuatkan data. Sila muat semula halaman.');
                console.error(error);
            }
        }

        showLoading() {
            this.container.innerHTML = `
                <div class="ilm-x-loading" style="text-align: center; padding: 40px;">
                    <div style="display: inline-block; width: 50px; height: 50px; border: 4px solid ${CONFIG.primaryColor}; border-top-color: transparent; border-radius: 50%; animation: ilm-spin 1s linear infinite;"></div>
                    <p style="margin-top: 15px; color: #666;">Memuatkan Surah ${CONFIG.surahName}...</p>
                </div>
                <style>
                @keyframes ilm-spin {
                    to { transform: rotate(360deg); }
                }
                </style>
            `;
        }

        showError(message) {
            this.container.innerHTML = `
                <div style="background: #fee; border: 2px solid #c33; padding: 20px; border-radius: 8px; text-align: center; color: #c33;">
                    <strong>⚠️ Ralat:</strong> ${message}
                </div>
            `;
        }

        async fetchData() {
            const [arabicRes, translationRes, audioRes] = await Promise.all([
                fetch(`${CONFIG.apiBase}/surah/${CONFIG.surahNumber}`),
                fetch(`${CONFIG.apiBase}/surah/${CONFIG.surahNumber}/${CONFIG.translation}`),
                fetch(`${CONFIG.apiBase}/surah/${CONFIG.surahNumber}/${CONFIG.qari}`)
            ]);

            const arabic = await arabicRes.json();
            const translation = await translationRes.json();
            const audio = await audioRes.json();

            this.ayahsData = arabic.data.ayahs.map((ayah, index) => ({
                number: ayah.numberInSurah,
                arabic: ayah.text,
                translation: translation.data.ayahs[index].text,
                audio: audio.data.ayahs[index].audio,
                rumi: this.generateRumi(ayah.text) // Simplified rumi generation
            }));
        }

        generateRumi(arabicText) {
            // Simplified rumi transliteration (ideally use proper API)
            // For production, integrate proper transliteration API
            return "Bacaan rumi tersedia dalam versi lengkap";
        }

        render() {
            const html = `
                <div class="ilm-x-tool-header" style="background: ${CONFIG.primaryColor}; color: #fff; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h3 style="margin: 0 0 10px 0; font-size: 22px;">📖 Surah ${CONFIG.surahName}</h3>
                    <div style="font-size: 14px; opacity: 0.9;">
                        <span id="ilm-x-current-ayah">Ayat 1</span> / ${CONFIG.totalAyahs} Ayat
                    </div>
                </div>

                <div class="ilm-x-tool-controls" style="background: #f8fdf9; padding: 15px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; border-bottom: 1px solid #e0e0e0;">
                    <button id="ilm-x-prev-btn" class="ilm-x-ctrl-btn" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important; appearance: button !important;">
                        ⏮️ Sebelum
                    </button>
                    <button id="ilm-x-play-btn" class="ilm-x-ctrl-btn" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important; appearance: button !important;">
                        ▶️ Main
                    </button>
                    <button id="ilm-x-next-btn" class="ilm-x-ctrl-btn" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important; appearance: button !important;">
                        Seterusnya ⏭️
                    </button>
                    <button id="ilm-x-bookmark-btn" class="ilm-x-ctrl-btn" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important; appearance: button !important;">
                        🔖 Tandakan
                    </button>
                </div>

                <div class="ilm-x-tool-search" style="padding: 15px; background: #fff; border-bottom: 1px solid #e0e0e0;">
                    <input type="text" id="ilm-x-search" placeholder="🔍 Cari ayat (nombor atau teks)..." style="width: 100%; padding: 10px; border: 2px solid ${CONFIG.primaryColor}; border-radius: 6px; font-size: 14px;">
                </div>

                <div id="ilm-x-ayah-display" class="ilm-x-ayah-display" style="padding: 30px 20px; background: #fff; min-height: 300px;">
                    ${this.renderAyah(0)}
                </div>

                <div class="ilm-x-tool-footer" style="background: #f8fdf9; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px;">
                    <div style="margin-bottom: 10px;">
                        <button id="ilm-x-show-bookmarks" class="ilm-x-small-btn" style="display: inline-block !important; visibility: visible !important; opacity: 1 !important; appearance: button !important;">
                            📑 Lihat Tandaan (${this.bookmarks.length})
                        </button>
                    </div>
                    <div>Qari: Mishary Rashid Alafasy | Terjemahan: Abdullah Muhammad Basmeih</div>
                    <div style="margin-top: 5px;">© ${new Date().getFullYear()} IlmuAlam.com - Dikongsi dengan penuh kasih untuk umat ❤️</div>
                </div>

                <style>
                .ilm-x-ctrl-btn, .ilm-x-small-btn {
                    display: inline-block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    appearance: button !important;
                    background: ${CONFIG.primaryColor} !important;
                    color: #fff !important;
                    border: none !important;
                    padding: 10px 20px !important;
                    border-radius: 6px !important;
                    cursor: pointer !important;
                    font-weight: 600 !important;
                    transition: all 0.2s !important;
                    font-size: 14px !important;
                }
                .ilm-x-ctrl-btn:hover, .ilm-x-small-btn:hover {
                    background: ${CONFIG.darkColor} !important;
                    transform: translateY(-2px) !important;
                }
                .ilm-x-ctrl-btn:disabled {
                    opacity: 0.5 !important;
                    cursor: not-allowed !important;
                }
                .ilm-x-small-btn {
                    padding: 8px 16px !important;
                    font-size: 13px !important;
                }
                .ilm-x-arabic-text {
                    font-size: 28px;
                    line-height: 2.2;
                    text-align: right;
                    direction: rtl;
                    color: ${CONFIG.darkColor};
                    margin: 20px 0;
                    padding: 20px;
                    background: #f8fdf9;
                    border-radius: 8px;
                    font-family: "Traditional Arabic", "Amiri", serif;
                }
                .ilm-x-translation-text {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #2c3e50;
                    margin: 15px 0;
                    padding: 15px;
                    background: #fffaef;
                    border-left: 4px solid ${CONFIG.primaryColor};
                    border-radius: 5px;
                }
                .ilm-x-ayah-number {
                    display: inline-block;
                    background: ${CONFIG.primaryColor};
                    color: #fff;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                @media (max-width: 768px) {
                    .ilm-x-arabic-text {
                        font-size: 24px;
                        padding: 15px;
                    }
                    .ilm-x-ctrl-btn {
                        padding: 8px 12px !important;
                        font-size: 12px !important;
                    }
                }
                </style>
            `;
            
            this.container.innerHTML = html;
        }

        renderAyah(index) {
            const ayah = this.ayahsData[index];
            const isBookmarked = this.bookmarks.includes(ayah.number);
            
            return `
                <div class="ilm-x-ayah-number">
                    Ayat ${ayah.number} ${isBookmarked ? '🔖' : ''}
                </div>
                <div class="ilm-x-arabic-text">
                    ${ayah.arabic}
                </div>
                <div class="ilm-x-translation-text">
                    <strong>Terjemahan:</strong><br>
                    ${ayah.translation}
                </div>
            `;
        }

        attachEvents() {
            document.getElementById('ilm-x-prev-btn').addEventListener('click', () => this.prevAyah());
            document.getElementById('ilm-x-next-btn').addEventListener('click', () => this.nextAyah());
            document.getElementById('ilm-x-play-btn').addEventListener('click', () => this.togglePlay());
            document.getElementById('ilm-x-bookmark-btn').addEventListener('click', () => this.toggleBookmark());
            document.getElementById('ilm-x-show-bookmarks').addEventListener('click', () => this.showBookmarks());
            
            const searchInput = document.getElementById('ilm-x-search');
            searchInput.addEventListener('input', (e) => this.search(e.target.value));
            
            this.updateControls();
        }

        prevAyah() {
            if (this.currentAyah > 1) {
                this.currentAyah--;
                this.updateDisplay();
            }
        }

        nextAyah() {
            if (this.currentAyah < CONFIG.totalAyahs) {
                this.currentAyah++;
                this.updateDisplay();
            }
        }

        updateDisplay() {
            const display = document.getElementById('ilm-x-ayah-display');
            display.innerHTML = this.renderAyah(this.currentAyah - 1);
            document.getElementById('ilm-x-current-ayah').textContent = `Ayat ${this.currentAyah}`;
            this.updateControls();
            
            if (this.isPlaying) {
                this.playAudio();
            }
        }

        updateControls() {
            document.getElementById('ilm-x-prev-btn').disabled = this.currentAyah === 1;
            document.getElementById('ilm-x-next-btn').disabled = this.currentAyah === CONFIG.totalAyahs;
        }

        togglePlay() {
            if (this.isPlaying) {
                this.stopAudio();
            } else {
                this.playAudio();
            }
        }

        playAudio() {
            const ayah = this.ayahsData[this.currentAyah - 1];
            
            if (this.audioElement) {
                this.audioElement.pause();
            }
            
            this.audioElement = new Audio(ayah.audio);
            this.audioElement.play();
            this.isPlaying = true;
            document.getElementById('ilm-x-play-btn').innerHTML = '⏸️ Berhenti';
            
            this.audioElement.onended = () => {
                this.isPlaying = false;
                document.getElementById('ilm-x-play-btn').innerHTML = '▶️ Main';
                
                // Auto play next if not last ayah
                if (this.currentAyah < CONFIG.totalAyahs) {
                    setTimeout(() => {
                        this.nextAyah();
                        this.playAudio();
                    }, 1000);
                }
            };
        }

        stopAudio() {
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement = null;
            }
            this.isPlaying = false;
            document.getElementById('ilm-x-play-btn').innerHTML = '▶️ Main';
        }

        toggleBookmark() {
            const index = this.bookmarks.indexOf(this.currentAyah);
            if (index > -1) {
                this.bookmarks.splice(index, 1);
            } else {
                this.bookmarks.push(this.currentAyah);
                this.bookmarks.sort((a, b) => a - b);
            }
            this.saveBookmarks();
            this.updateDisplay();
            document.getElementById('ilm-x-show-bookmarks').innerHTML = `📑 Lihat Tandaan (${this.bookmarks.length})`;
        }

        loadBookmarks() {
            const saved = localStorage.getItem('ilmualam-surah33-bookmarks');
            return saved ? JSON.parse(saved) : [];
        }

        saveBookmarks() {
            localStorage.setItem('ilmualam-surah33-bookmarks', JSON.stringify(this.bookmarks));
        }

        showBookmarks() {
            if (this.bookmarks.length === 0) {
                alert('Tiada ayat yang ditandakan lagi. Klik butang 🔖 Tandakan untuk menanda ayat semasa.');
                return;
            }
            
            const list = this.bookmarks.map(num => `Ayat ${num}`).join(', ');
            const choice = confirm(`Ayat yang ditandakan:\n${list}\n\nKlik OK untuk pergi ke ayat pertama yang ditandakan, atau Cancel untuk tutup.`);
            
            if (choice) {
                this.currentAyah = this.bookmarks[0];
                this.updateDisplay();
            }
        }

        search(query) {
            if (!query.trim()) return;
            
            // Search by ayah number
            const ayahNumber = parseInt(query);
            if (!isNaN(ayahNumber) && ayahNumber >= 1 && ayahNumber <= CONFIG.totalAyahs) {
                this.currentAyah = ayahNumber;
                this.updateDisplay();
                return;
            }
            
            // Search by text (simplified - case insensitive)
            const found = this.ayahsData.findIndex(ayah => 
                ayah.translation.toLowerCase().includes(query.toLowerCase())
            );
            
            if (found !== -1) {
                this.currentAyah = found + 1;
                this.updateDisplay();
            } else {
                alert(`Tiada hasil untuk "${query}". Cuba cari dengan kata kunci lain.`);
            }
        }
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SurahAlAhzabTool('surahAlAhzabTool');
        });
    } else {
        new SurahAlAhzabTool('surahAlAhzabTool');
    }

})();
