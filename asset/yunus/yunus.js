/*!
 * Surah Yunus Interactive Reader Tool
 * Version: 2.0.0
 * Author: IlmuAlam.com
 * License: MIT License
 * Copyright (c) 2025 IlmuAlam.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 */

(function() {
    'use strict';
    
    const SURAH_NUMBER = 10;
    const TOTAL_AYAT = 109;
    const API_BASE = 'https://api.alquran.cloud/v1';
    const AUDIO_CDN = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';
    
    // Rumi transliteration data (abbreviated - full version would have all 109 verses)
    const RUMI_DATA = {
        1: "Alif Laam Raa. Tilka aayaatul kitaabil hakeem",
        2: "Akaanal linnaasi 'ajaiban an awhainaaa ilaa rajulim minhum an anzirin naasa wa bashshiril lazeena aamanoo anna lahum qadama sidqin 'inda Rabbihim; qaalal kaafiroona inna haazaa lasaahirum mubeen",
        3: "Inna Rabbakumul laahul lazee khalaqas samaawaati wal arda fee sittati ayyaamin summas tawaa 'alal 'Arshi yudabbirul amr; maa min shafee'in illaa mim ba'di iznih; zaalikumul laahu Rabbukum fa'budooh; afalaa tazakkaroon",
        // ... (would continue for all 109 verses)
    };
    
    // Malay translation (abbreviated)
    const MALAY_TRANS = {
        1: "Alif Laam Raa. Inilah ayat-ayat Al-Kitab (Al-Quran) yang penuh hikmah.",
        2: "Patutkah manusia menjadi hairan bahawa Kami mewahyukan kepada seorang lelaki dari kalangan mereka: Berilah peringatan kepada manusia dan gembirakanlah orang-orang yang beriman bahawa mereka mempunyai kedudukan yang tinggi di sisi Tuhan mereka? Orang-orang kafir berkata: Sesungguhnya orang ini (Muhammad) adalah ahli sihir yang nyata.",
        3: "Sesungguhnya Tuhan kamu ialah Allah yang menjadikan langit dan bumi dalam enam masa kemudian Ia bersemayam di atas Arasy mentadbirkan segala urusan. Tidak ada sesiapa pun yang dapat memberi syafaat kecuali setelah mendapat izin-Nya. Itulah Allah Tuhan kamu maka sembahlah Dia; tidakkah kamu mengambil pelajaran?",
        // ... (would continue for all 109 verses)
    };
    
    let currentAudio = null;
    let bookmarks = JSON.parse(localStorage.getItem('yunus_bookmarks') || '[]');
    let isLoading = false;
    
    // Main initialization
    function init() {
        const container = document.getElementById('ilm-x-yunus-reader');
        if (!container) return;
        
        injectCSS();
        renderTool(container);
        loadVerses();
    }
    
    // Inject critical CSS
    function injectCSS() {
        if (document.getElementById('ilm-x-yunus-css')) return;
        
        const style = document.createElement('style');
        style.id = 'ilm-x-yunus-css';
        style.textContent = `
            .ilm-x-yunus-wrapper{max-width:100%;margin:0 auto;padding:0}
            .ilm-x-yunus-controls{display:flex!important;visibility:visible!important;opacity:1!important;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;padding:1rem;background:#f0f9f3;border-radius:8px}
            .ilm-x-yunus-btn{display:inline-flex!important;visibility:visible!important;opacity:1!important;appearance:button!important;align-items:center;gap:0.4rem;padding:0.6rem 1rem!important;background:#249749!important;color:#fff!important;border:none!important;border-radius:6px!important;font-size:0.9rem!important;font-weight:500!important;cursor:pointer!important;transition:all 0.2s!important;text-decoration:none!important}
            .ilm-x-yunus-btn:hover{background:#1a7038!important;transform:translateY(-1px)!important}
            .ilm-x-yunus-verse{background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:1.2rem;margin-bottom:1rem;transition:box-shadow 0.3s}
            .ilm-x-yunus-verse:hover{box-shadow:0 4px 12px rgba(36,151,73,0.1)}
            .ilm-x-yunus-verse.ilm-x-active{border-color:#249749;box-shadow:0 0 0 3px rgba(36,151,73,0.1)}
            .ilm-x-yunus-number{display:inline-block;background:#249749;color:#fff;width:32px;height:32px;line-height:32px;text-align:center;border-radius:50%;font-weight:600;font-size:0.9rem;margin-bottom:0.8rem}
            .ilm-x-yunus-arabic{font-family:'Amiri','Traditional Arabic',serif;font-size:1.8rem;line-height:2.2;text-align:right;direction:rtl;color:#0c3808;margin:1rem 0}
            .ilm-x-yunus-rumi{background:#f0f9f3;border-left:4px solid #249749;padding:1rem;border-radius:4px;margin:1rem 0;line-height:1.3;font-size:15px;color:#oc3803;}
            .ilm-x-yunus-trans{color:#333;line-height:1.3;font-size:15px;margin:1rem 0}
            .ilm-x-yunus-actions{display:flex!important;visibility:visible!important;opacity:1!important;gap:0.5rem;margin-top:1rem;flex-wrap:wrap}
            .ilm-x-yunus-action-btn{display:inline-flex!important;visibility:visible!important;opacity:1!important;appearance:button!important;align-items:center;justify-content:center;width:36px;height:36px;padding:0!important;background:#fff!important;border:1px solid #249749!important;border-radius:50%!important;color:#249749!important;cursor:pointer!important;transition:all 0.2s!important;font-size:1rem!important}
            .ilm-x-yunus-action-btn:hover{background:#249749!important;color:#fff!important;transform:scale(1.1)!important}
            .ilm-x-yunus-action-btn.ilm-x-bookmarked{background:#249749!important;color:#fff!important}
            .ilm-x-yunus-loading{text-align:center;padding:3rem 1rem;color:#1a7038}
            .ilm-x-yunus-spinner{border:3px solid #f0f9f3;border-top:3px solid #249749;border-radius:50%;width:40px;height:40px;animation:ilm-x-spin 1s linear infinite;margin:0 auto 1rem}
            @keyframes ilm-x-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
            @media(max-width:768px){
                .ilm-x-yunus-arabic{font-size:1.5rem;line-height:2.2}
                .ilm-x-yunus-rumi{font-size:0.95rem;padding:0.8rem}
                .ilm-x-yunus-trans{font-size:0.95rem}
                .ilm-x-yunus-verse{padding:1rem}
            }
        `;
        document.head.appendChild(style);
    }
    
    // Render tool UI
    function renderTool(container) {
        container.innerHTML = `
            <div class="ilm-x-yunus-wrapper">
                <div class="ilm-x-yunus-controls">
                    <button class="ilm-x-yunus-btn" onclick="window.ilmYunusTool.filterBookmarks()" type="button">
                        <span>🔖</span> ON Bookmark (${bookmarks.length})
                    </button>
                    <button class="ilm-x-yunus-btn" onclick="window.ilmYunusTool.scrollToAyat()" type="button">
                        <span>🔍</span> Cari Ayat
                    </button>
                    <button class="ilm-x-yunus-btn" onclick="window.ilmYunusTool.shareAll()" type="button">
                        <span>📤</span> Share Surah
                    </button>
                </div>
                <div id="ilm-x-yunus-verses" class="ilm-x-yunus-verses">
                    <div class="ilm-x-yunus-loading">
                        <div class="ilm-x-yunus-spinner"></div>
                        <p>Memuatkan Surah Yunus...</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Load verses from API
    async function loadVerses() {
        if (isLoading) return;
        isLoading = true;
        
        const versesContainer = document.getElementById('ilm-x-yunus-verses');
        
        try {
            // Load Arabic text
            const arabicRes = await fetch(`${API_BASE}/surah/${SURAH_NUMBER}`);
            const arabicData = await arabicRes.json();
            
            // Load Malay translation
            const malayRes = await fetch(`${API_BASE}/surah/${SURAH_NUMBER}/ms.basmeih`);
            const malayData = await malayRes.json();
            
            if (!arabicData.data || !malayData.data) throw new Error('Failed to load data');
            
            const verses = arabicData.data.ayahs;
            const malayVerses = malayData.data.ayahs;
            
            let html = '';
            
            for (let i = 0; i < verses.length; i++) {
                const verse = verses[i];
                const malayVerse = malayVerses[i];
                const verseNum = verse.numberInSurah;
                const isBookmarked = bookmarks.includes(verseNum);
                
                // For demo purposes, use placeholder Rumi if not in data
                const rumi = RUMI_DATA[verseNum] || 'Transliterasi dalam pembangunan...';
                
                html += `
                    <div class="ilm-x-yunus-verse" id="ilm-x-verse-${verseNum}" data-verse="${verseNum}">
                        <div class="ilm-x-yunus-number">Ayat ${verseNum}</div>
                        <div class="ilm-x-yunus-arabic">${verse.text}</div>
                        <div class="ilm-x-yunus-rumi">${rumi}</div>
                        <div class="ilm-x-yunus-trans">${malayVerse.text}</div>
                        <div class="ilm-x-yunus-actions">
                            <button class="ilm-x-yunus-action-btn" onclick="window.ilmYunusTool.playAudio(${verseNum})" title="Play Audio" type="button">
                                ▶
                            </button>
                            <button class="ilm-x-yunus-action-btn ${isBookmarked ? 'ilm-x-bookmarked' : ''}" onclick="window.ilmYunusTool.toggleBookmark(${verseNum})" title="Simpan Ayat" type="button">
                                🔖
                            </button>
                            <button class="ilm-x-yunus-action-btn" onclick="window.ilmYunusTool.copyVerse(${verseNum})" title="Copy Ayat" type="button">
                                📋
                            </button>
                            <button class="ilm-x-yunus-action-btn" onclick="window.ilmYunusTool.shareVerse(${verseNum})" title="Share Ayat" type="button">
                                📤
                            </button>
                        </div>
                    </div>
                `;
            }
            
            versesContainer.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading Surah Yunus:', error);
            versesContainer.innerHTML = `
                <div class="ilm-x-yunus-loading">
                    <p style="color:#d32f2f">⚠️ Maaf, terdapat masalah memuatkan surah. Sila muat semula halaman.</p>
                </div>
            `;
        } finally {
            isLoading = false;
        }
    }
    
    // Play audio for specific verse
    function playAudio(verseNum) {
        if (currentAudio) {
            currentAudio.pause();
            document.querySelectorAll('.ilm-x-yunus-verse').forEach(v => v.classList.remove('ilm-x-active'));
        }
        
        const paddedNum = String(verseNum).padStart(3, '0');
        const audioUrl = `${AUDIO_CDN}/${SURAH_NUMBER}${paddedNum}.mp3`;
        
        currentAudio = new Audio(audioUrl);
        const verseEl = document.getElementById(`ilm-x-verse-${verseNum}`);
        
        if (verseEl) {
            verseEl.classList.add('ilm-x-active');
            verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        currentAudio.play().catch(err => {
            console.error('Audio playback error:', err);
            alert('Maaf, audio tidak dapat dimainkan. Sila cuba lagi.');
        });
        
        currentAudio.onended = () => {
            if (verseEl) verseEl.classList.remove('ilm-x-active');
        };
    }
    
    // Toggle bookmark
    function toggleBookmark(verseNum) {
        const idx = bookmarks.indexOf(verseNum);
        
        if (idx > -1) {
            bookmarks.splice(idx, 1);
        } else {
            bookmarks.push(verseNum);
        }
        
        localStorage.setItem('yunus_bookmarks', JSON.stringify(bookmarks));
        
        const btn = document.querySelector(`#ilm-x-verse-${verseNum} .ilm-x-yunus-action-btn:nth-child(2)`);
        if (btn) btn.classList.toggle('ilm-x-bookmarked');
        
        // Update counter
        const counterBtn = document.querySelector('.ilm-x-yunus-controls .ilm-x-yunus-btn');
        if (counterBtn) {
            counterBtn.innerHTML = `<span>🔖</span> Tunjuk Simpanan (${bookmarks.length})`;
        }
    }
    
    // Copy verse to clipboard
    async function copyVerse(verseNum) {
        const verseEl = document.getElementById(`ilm-x-verse-${verseNum}`);
        if (!verseEl) return;
        
        const arabic = verseEl.querySelector('.ilm-x-yunus-arabic').textContent;
        const rumi = verseEl.querySelector('.ilm-x-yunus-rumi').textContent;
        const trans = verseEl.querySelector('.ilm-x-yunus-trans').textContent;
        
        const text = `Surah Yunus Ayat ${verseNum}

${arabic}

${rumi}

Terjemahan: ${trans}

Sumber: IlmuAlam.com`;
        
        try {
            await navigator.clipboard.writeText(text);
            alert('✅ Ayat berjaya disalin!');
        } catch (err) {
            console.error('Copy failed:', err);
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Ayat berjaya disalin!');
        }
    }
    
    // Share verse
    function shareVerse(verseNum) {
        const url = `${window.location.origin}${window.location.pathname}#ilm-x-verse-${verseNum}`;
        const text = `Surah Yunus Ayat ${verseNum} - Bacaan &amp; Tafsir Lengkap`;
        
        if (navigator.share) {
            navigator.share({
                title: text,
                text: text,
                url: url
            }).catch(err => console.log('Share cancelled', err));
        } else {
            copyToClipboard(url);
            alert('🔗 Pautan ayat disalin! Anda boleh kongsikannya sekarang.');
        }
    }
    
    // Share entire Surah
    function shareAll() {
        const url = window.location.href.split('#')[0];
        const text = 'Surah Yunus: Bacaan Lengkap dengan Rumi, Tafsir &amp; Audio Interaktif';
        
        if (navigator.share) {
            navigator.share({
                title: text,
                text: text,
                url: url
            }).catch(err => console.log('Share cancelled', err));
        } else {
            copyToClipboard(url);
            alert('🔗 Pautan Surah Yunus disalin! Anda boleh kongsikannya sekarang.');
        }
    }
    
    // Filter to show only bookmarks
    function filterBookmarks() {
        if (bookmarks.length === 0) {
            alert('📌 Anda belum menyimpan mana-mana ayat. Klik ikon bookmark pada ayat untuk menyimpannya.');
            return;
        }
        
        const allVerses = document.querySelectorAll('.ilm-x-yunus-verse');
        const isFiltered = allVerses[0].style.display === 'none';
        
        allVerses.forEach(verse => {
            const verseNum = parseInt(verse.dataset.verse);
            if (isFiltered) {
                // Show all
                verse.style.display = 'block';
            } else {
                // Show only bookmarks
                verse.style.display = bookmarks.includes(verseNum) ? 'block' : 'none';
            }
        });
        
        const btn = document.querySelector('.ilm-x-yunus-controls .ilm-x-yunus-btn');
        if (btn) {
            btn.innerHTML = isFiltered 
                ? `<span>🔖</span> Show Bookmark (${bookmarks.length})`
                : `<span>📖</span> Show All`;
        }
    }
    
    // Scroll to specific ayat
    function scrollToAyat() {
        const num = prompt('Masukkan nombor ayat (1-109):');
        if (!num) return;
        
        const verseNum = parseInt(num);
        if (isNaN(verseNum) || verseNum < 1 || verseNum > TOTAL_AYAT) {
            alert('❌ Nombor ayat tidak sah. Sila masukkan nombor antara 1-109.');
            return;
        }
        
        const verseEl = document.getElementById(`ilm-x-verse-${verseNum}`);
        if (verseEl) {
            verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            verseEl.style.background = '#fff9e6';
            setTimeout(() => {
                verseEl.style.background = '#fff';
            }, 2000);
        }
    }
    
    // Helper: Copy to clipboard fallback
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Expose public API
    window.ilmYunusTool = {
        playAudio,
        toggleBookmark,
        copyVerse,
        shareVerse,
        shareAll,
        filterBookmarks,
        scrollToAyat
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Hidden copyright notice (encoded)
    const _0x1a2b=['SWxtdUFsYW0uY29t'];
    console.log(atob(_0x1a2b[0]));
    
})();
