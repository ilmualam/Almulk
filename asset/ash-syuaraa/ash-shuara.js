/*!
 * Surah Ash-Shu'ara Interactive Reader
 * Version: 1.0.0
 * Author: IlmuAlam.com Development Team
 * License: MIT License
 * Copyright (c) 2024 IlmuAlam.com
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
 * API: Al-Quran Cloud API (https://alquran.cloud/api)
 * For ilmualam.com domain usage
 */

(function() {
    'use strict';
    
    const SURAH_NUMBER = 26; // Ash-Shu'ara
    const TOTAL_AYAT = 227;
    const API_BASE = 'https://api.alquran.cloud/v1';
    
    // Qari options
    const QARIS = [
        { id: 'ar.alafasy', name: 'Mishary Alafasy', lang: 'ar' },
        { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit', lang: 'ar' },
        { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', lang: 'ar' },
        { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais', lang: 'ar' }
    ];
    
    let currentAyat = 1;
    let currentQari = QARIS[0].id;
    let audioElement = new Audio();
    let bookmarks = JSON.parse(localStorage.getItem('ilm_ashshuara_bookmarks') || '[]');
    let surahData = null;
    let isPlaying = false;

    // SEO Keywords for JSON integration
    const SEO_KEYWORDS = [
        "surah asy syuara",
        "surah asy syuara rumi",
        "surah asy syuara terjemahan",
        "surah asy syuara audio",
        "surah asy syuara 227 ayat",
        "surah asy syuara kelebihan",
        "kisah nabi surah asy syuara",
        "surah 26 al quran",
        "surah asy syuara lengkap",
        "bacaan surah asy syuara"
    ];
    
    // Initialize
    function init() {
        const container = document.getElementById('surah-ashshuara-reader');
        if (!container) return;
        
        container.innerHTML = createReaderHTML();
        attachEventListeners();
        loadSurahData();
    }
    
    function createReaderHTML() {
        return `
            <div class="ilm-sr-container">
                <div class="ilm-sr-header">
                    <div class="ilm-sr-title-wrap">
                        <h2 class="ilm-sr-title">🎧 Bacaan Surah Asy Syuara</h2>
                        <p class="ilm-sr-subtitle">227 ayat | Audio, Rumi & Terjemahan</p>
                    </div>
                    <div class="ilm-sr-controls-top">
                        <select id="ilm-sr-qari" class="ilm-sr-select">
                            ${QARIS.map(q => `<option value="${q.id}">${q.name}</option>`).join('')}
                        </select>
                        <button id="ilm-sr-search-btn" class="ilm-sr-btn-icon" title="Cari Ayat">🔍</button>
                        <button id="ilm-sr-bookmark-btn" class="ilm-sr-btn-icon" title="Bookmark">📌</button>
                    </div>
                </div>
                
                <div id="ilm-sr-search-panel" class="ilm-sr-search-panel" style="display:none">
                    <input type="number" id="ilm-sr-search-input" placeholder="No. Ayat (1-227)" min="1" max="227" class="ilm-sr-input">
                    <button id="ilm-sr-go-btn" class="ilm-sr-btn-sm">Pergi</button>
                    <button id="ilm-sr-close-search" class="ilm-sr-btn-sm">Tutup</button>
                </div>
                
                <div id="ilm-sr-bookmarks-panel" class="ilm-sr-bookmarks-panel" style="display:none">
                    <h4>📌 Bookmark Anda</h4>
                    <div id="ilm-sr-bookmarks-list"></div>
                    <button id="ilm-sr-close-bookmarks" class="ilm-sr-btn-sm">Tutup</button>
                </div>
                
                <div id="ilm-sr-ayat-display" class="ilm-sr-ayat-display">
                    <div class="ilm-sr-loading">Memuatkan surah...</div>
                </div>
                
                <div class="ilm-sr-player">
                    <div class="ilm-sr-player-info">
                        <span id="ilm-sr-current-ayat">Ayat 1</span>
                        <span id="ilm-sr-progress-text">00:00 / 00:00</span>
                    </div>
                    <div class="ilm-sr-player-controls">
                        <button id="ilm-sr-prev" class="ilm-sr-btn-ctrl" title="Ayat Sebelum">⏮️</button>
                        <button id="ilm-sr-play" class="ilm-sr-btn-play" title="Main">▶️</button>
                        <button id="ilm-sr-next" class="ilm-sr-btn-ctrl" title="Ayat Seterus">⏭️</button>
                    </div>
                    <input type="range" id="ilm-sr-progress" class="ilm-sr-progress-bar" min="0" max="100" value="0">
                    <div class="ilm-sr-player-extra">
                        <button id="ilm-sr-repeat" class="ilm-sr-btn-sm" title="Ulang Ayat">🔁</button>
                        <button id="ilm-sr-add-bookmark" class="ilm-sr-btn-sm" title="Tambah Bookmark">⭐</button>
                        <button id="ilm-sr-share" class="ilm-sr-btn-sm" title="Kongsi">📤</button>
                    </div>
                </div>
                
                <div class="ilm-sr-footer">
                    <p>© <a href="https://www.ilmualam.com" target="_blank" rel="internal noopener">IlmuAlam.com</a> | Data: Al-Quran Cloud API</p>
                </div>
            </div>
            
            <style>
                .ilm-sr-container{max-width:1200px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)}
                .ilm-sr-header{background:linear-gradient(135deg,#249749 0%,#1a7a3a 100%);color:#fff;padding:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
                .ilm-sr-title{margin:0;font-size:1.4rem;font-weight:700}
                .ilm-sr-subtitle{margin:4px 0 0;opacity:0.9;font-size:0.9rem}
                .ilm-sr-controls-top{display:flex;gap:8px;align-items:center}
                .ilm-sr-select{padding:8px 12px;border:none;border-radius:6px;background:#fff;color:#0c3808;font-size:0.9rem;cursor:pointer}
                .ilm-sr-btn-icon{background:#fff;color:#249749;border:none;width:40px;height:40px;border-radius:50%;font-size:1.2rem;cursor:pointer;transition:transform 0.2s}
                .ilm-sr-btn-icon:hover{transform:scale(1.1)}
                .ilm-sr-search-panel,.ilm-sr-bookmarks-panel{padding:16px;background:#f8f9fa;border-bottom:1px solid #e0e0e0;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
                .ilm-sr-input{padding:8px 12px;border:1px solid #ccc;border-radius:6px;font-size:0.9rem;flex:1;min-width:150px}
                .ilm-sr-btn-sm{padding:8px 16px;background:#249749;color:#fff;border:none;border-radius:6px;font-size:0.85rem;cursor:pointer;font-weight:600}
                .ilm-sr-btn-sm:hover{background:#1a7a3a}
                .ilm-sr-bookmarks-panel h4{margin:0;color:#249749;width:100%}
                #ilm-sr-bookmarks-list{width:100%;max-height:200px;overflow-y:auto;margin:8px 0}
                .ilm-sr-bookmark-item{padding:8px;background:#fff;margin:4px 0;border-radius:4px;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
                .ilm-sr-bookmark-item:hover{background:#f0f8f4}
                .ilm-sr-ayat-display{padding:24px;min-height:400px;max-height:1000px;overflow-y:auto}
                .ilm-sr-loading{text-align:center;padding:40px;color:#666;font-size:1.1rem}
                .ilm-sr-ayat-card{background:#f8f9fa;padding:20px;margin:16px 0;border-radius:8px;border-left:4px solid #249749;transition:transform 0.2s}
                .ilm-sr-ayat-card.active{background:#e8f5e8;transform:translateX(8px)}
                .ilm-sr-ayat-number{color:#249749;font-weight:700;font-size:0.9rem;margin-bottom:8px}
                .ilm-sr-ayat-arabic{font-size:1.8rem;font-weight:600;line-height:2.2;text-align:right;color:#0c3808;margin:12px 0;font-family:'Amiri','Traditional Arabic',serif}
                .ilm-sr-ayat-rumi{font-size:15px;line-height:1.3;color:#0c3803;margin:12px 0;font-style:italic;border:1px dashed;border-color:#0c3803;padding:10px;margin:10px;background-color:#f0ffc7;}
                .ilm-sr-ayat-translation{font-size:15px;line-height:1.3;color:#0c3808;margin:12px 0}
                .ilm-sr-player{background:#f8f9fa;padding:20px;border-top:2px solid #249749}
                .ilm-sr-player-info{display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem;color:#666}
                #ilm-sr-current-ayat{font-weight:700;color:#249749}
                .ilm-sr-player-controls{display:flex;justify-content:center;gap:16px;margin:12px 0}
                .ilm-sr-btn-ctrl{background:#249749;color:#fff;border:none;width:48px;height:48px;border-radius:50%;font-size:1.2rem;cursor:pointer;transition:transform 0.2s}
                .ilm-sr-btn-ctrl:hover{transform:scale(1.1);background:#1a7a3a}
                .ilm-sr-btn-play{background:#249749;color:#fff;border:none;width:56px;height:56px;border-radius:50%;font-size:1.4rem;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 12px rgba(36,151,73,0.3)}
                .ilm-sr-btn-play:hover{transform:scale(1.15);box-shadow:0 6px 16px rgba(36,151,73,0.4)}
                .ilm-sr-progress-bar{width:100%;height:6px;margin:12px 0;cursor:pointer;appearance:none;background:#e0e0e0;border-radius:3px}
                .ilm-sr-progress-bar::-webkit-slider-thumb{appearance:none;width:16px;height:16px;background:#249749;border-radius:50%;cursor:pointer}
                .ilm-sr-progress-bar::-moz-range-thumb{width:16px;height:16px;background:#249749;border:none;border-radius:50%;cursor:pointer}
                .ilm-sr-player-extra{display:flex;justify-content:center;gap:12px;margin-top:12px}
                .ilm-sr-footer{text-align:center;padding:12px;font-size:0.8rem;color:#666;background:#f8f9fa}
                @media(max-width:600px){
                .ilm-sr-header{flex-direction:column;align-items:flex-start}
                .ilm-sr-controls-top{margin-top:12px;width:100%}
                .ilm-sr-title{font-size:1.2rem}
                .ilm-sr-ayat-arabic{font-size:1.5rem}
                .ilm-sr-player-controls{gap:12px}
                .ilm-sr-btn-ctrl{width:40px;height:40px}
                .ilm-sr-btn-play{width:48px;height:48px}
                }
            </style>
        `;
    }
    
    function attachEventListeners() {
        // Qari selection
        document.getElementById('ilm-sr-qari').addEventListener('change', (e) => {
            currentQari = e.target.value;
            if (isPlaying) {
                playAyat(currentAyat);
            }
        });
        
        // Search panel
        document.getElementById('ilm-sr-search-btn').addEventListener('click', toggleSearchPanel);
        document.getElementById('ilm-sr-close-search').addEventListener('click', toggleSearchPanel);
        document.getElementById('ilm-sr-go-btn').addEventListener('click', goToAyat);
        document.getElementById('ilm-sr-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') goToAyat();
        });
        
        // Bookmarks panel
        document.getElementById('ilm-sr-bookmark-btn').addEventListener('click', toggleBookmarksPanel);
        document.getElementById('ilm-sr-close-bookmarks').addEventListener('click', toggleBookmarksPanel);
        document.getElementById('ilm-sr-add-bookmark').addEventListener('click', addBookmark);
        
        // Player controls
        document.getElementById('ilm-sr-play').addEventListener('click', togglePlay);
        document.getElementById('ilm-sr-prev').addEventListener('click', prevAyat);
        document.getElementById('ilm-sr-next').addEventListener('click', nextAyat);
        document.getElementById('ilm-sr-repeat').addEventListener('click', repeatAyat);
        document.getElementById('ilm-sr-share').addEventListener('click', shareAyat);
        
        // Progress bar
        const progressBar = document.getElementById('ilm-sr-progress');
        progressBar.addEventListener('input', (e) => {
            const time = (audioElement.duration / 100) * e.target.value;
            audioElement.currentTime = time;
        });
        
        // Audio events
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('ended', nextAyat);
        audioElement.addEventListener('loadedmetadata', () => {
            updateProgressText();
        });
    }
    
    async function loadSurahData() {
        try {
            const [arabic, translation, transliteration] = await Promise.all([
                fetch(`${API_BASE}/surah/${SURAH_NUMBER}`).then(r => r.json()),
                fetch(`${API_BASE}/surah/${SURAH_NUMBER}/ms.basmeih`).then(r => r.json()),
                fetch(`${API_BASE}/surah/${SURAH_NUMBER}/en.transliteration`).then(r => r.json())
            ]);
            
            surahData = {
                arabic: arabic.data.ayahs,
                translation: translation.data.ayahs,
                transliteration: transliteration.data.ayahs
            };
            
            displayAllAyat();
        } catch (error) {
            console.error('Error loading surah:', error);
            document.getElementById('ilm-sr-ayat-display').innerHTML = 
                '<div class="ilm-sr-loading">❌ Ralat memuatkan data. Sila muat semula halaman.</div>';
        }
    }
    
    function displayAllAyat() {
        const container = document.getElementById('ilm-sr-ayat-display');
        container.innerHTML = '';
        
        for (let i = 0; i < TOTAL_AYAT; i++) {
            const ayatCard = document.createElement('div');
            ayatCard.className = 'ilm-sr-ayat-card';
            ayatCard.id = `ayat-${i + 1}`;
            ayatCard.innerHTML = `
                <div class="ilm-sr-ayat-number">Ayat ${i + 1}</div>
                <div class="ilm-sr-ayat-arabic">${surahData.arabic[i].text}</div>
                <div class="ilm-sr-ayat-rumi">${convertToMalayRumi(surahData.transliteration[i].text)}</div>
                <div class="ilm-sr-ayat-translation">${surahData.translation[i].text}</div>
            `;
            ayatCard.addEventListener('click', () => {
                currentAyat = i + 1;
                highlightAyat(currentAyat);
                playAyat(currentAyat);
            });
            container.appendChild(ayatCard);
        }
        
        highlightAyat(1);
    }
    
    function convertToMalayRumi(text) {
        // Simple conversion for better Malay pronunciation
        return text
            .replace(/th/gi, 'ts')
            .replace(/dh/gi, 'z')
            .replace(/kh/gi, 'kh')
            .replace(/gh/gi, 'gh')
            .replace(/sh/gi, 'sy')
            .replace(/aa/gi, 'a')
            .replace(/ee/gi, 'i')
            .replace(/oo/gi, 'u');
    }
    
    function highlightAyat(number) {
        document.querySelectorAll('.ilm-sr-ayat-card').forEach(card => {
            card.classList.remove('active');
        });
        const activeCard = document.getElementById(`ayat-${number}`);
        if (activeCard) {
            activeCard.classList.add('active');
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        document.getElementById('ilm-sr-current-ayat').textContent = `Ayat ${number}`;
    }
    
    function playAyat(number) {
        const ayatNumber = String(number).padStart(3, '0');
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/${currentQari}/${SURAH_NUMBER}${ayatNumber}.mp3`;
        
        audioElement.src = audioUrl;
        audioElement.play();
        isPlaying = true;
        document.getElementById('ilm-sr-play').textContent = '⏸️';
        currentAyat = number;
        highlightAyat(number);
    }
    
    function togglePlay() {
        if (isPlaying) {
            audioElement.pause();
            document.getElementById('ilm-sr-play').textContent = '▶️';
            isPlaying = false;
        } else {
            if (!audioElement.src) {
                playAyat(currentAyat);
            } else {
                audioElement.play();
                document.getElementById('ilm-sr-play').textContent = '⏸️';
                isPlaying = true;
            }
        }
    }
    
    function prevAyat() {
        if (currentAyat > 1) {
            currentAyat--;
            playAyat(currentAyat);
        }
    }
    
    function nextAyat() {
        if (currentAyat < TOTAL_AYAT) {
            currentAyat++;
            playAyat(currentAyat);
        } else {
            audioElement.pause();
            isPlaying = false;
            document.getElementById('ilm-sr-play').textContent = '▶️';
        }
    }
    
    function repeatAyat() {
        playAyat(currentAyat);
    }
    
    function updateProgress() {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        document.getElementById('ilm-sr-progress').value = progress || 0;
        updateProgressText();
    }
    
    function updateProgressText() {
        const current = formatTime(audioElement.currentTime);
        const duration = formatTime(audioElement.duration);
        document.getElementById('ilm-sr-progress-text').textContent = `${current} / ${duration}`;
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    function toggleSearchPanel() {
        const panel = document.getElementById('ilm-sr-search-panel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        if (panel.style.display === 'flex') {
            document.getElementById('ilm-sr-bookmarks-panel').style.display = 'none';
        }
    }
    
    function goToAyat() {
        const input = document.getElementById('ilm-sr-search-input');
        const number = parseInt(input.value);
        if (number >= 1 && number <= TOTAL_AYAT) {
            currentAyat = number;
            highlightAyat(currentAyat);
            document.getElementById('ilm-sr-search-panel').style.display = 'none';
            input.value = '';
        } else {
            alert('Sila masukkan nombor ayat antara 1 hingga 227');
        }
    }
    
    function toggleBookmarksPanel() {
        const panel = document.getElementById('ilm-sr-bookmarks-panel');
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        if (panel.style.display === 'flex') {
            document.getElementById('ilm-sr-search-panel').style.display = 'none';
            displayBookmarks();
        }
    }
    
    function addBookmark() {
        if (!bookmarks.includes(currentAyat)) {
            bookmarks.push(currentAyat);
            bookmarks.sort((a, b) => a - b);
            localStorage.setItem('ilm_ashshuara_bookmarks', JSON.stringify(bookmarks));
            alert(`✅ Ayat ${currentAyat} ditambah ke bookmark`);
        } else {
            alert(`ℹ️ Ayat ${currentAyat} sudah ada dalam bookmark`);
        }
    }
    
    function displayBookmarks() {
        const list = document.getElementById('ilm-sr-bookmarks-list');
        if (bookmarks.length === 0) {
            list.innerHTML = '<p style="color:#666;padding:8px">Tiada bookmark lagi</p>';
            return;
        }
        
        list.innerHTML = bookmarks.map(num => `
            <div class="ilm-sr-bookmark-item" onclick="ilmGoToBookmark(${num})">
                <span>📖 Ayat ${num}</span>
                <button onclick="event.stopPropagation();ilmRemoveBookmark(${num})" style="background:transparent;border:none;color:#dc3545;cursor:pointer">🗑️</button>
            </div>
        `).join('');
    }
    
    window.ilmGoToBookmark = function(num) {
        currentAyat = num;
        highlightAyat(num);
        document.getElementById('ilm-sr-bookmarks-panel').style.display = 'none';
        playAyat(num);
    };
    
    window.ilmRemoveBookmark = function(num) {
        bookmarks = bookmarks.filter(b => b !== num);
        localStorage.setItem('ilm_ashshuara_bookmarks', JSON.stringify(bookmarks));
        displayBookmarks();
    };
    
    function shareAyat() {
        const shareText = `Surah Asy Syuara Ayat ${currentAyat}\n\n${surahData.arabic[currentAyat - 1].text}\n\n${surahData.translation[currentAyat - 1].text}\n\nBaca lengkap di: https://ilmualam.com/2025/12/surah-asy-syuara-rumi.html#ayat-${currentAyat}`;
        
        if (navigator.share) {
            navigator.share({
                title: `Surah Asy Syuara Ayat ${currentAyat}`,
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('✅ Ayat disalin ke clipboard');
            });
        }
    }
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
