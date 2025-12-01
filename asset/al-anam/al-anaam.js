/**
 * Surah Al-An'am Interactive Tool (Smart Lazy Load)
 * Author: Ilmu Alam (ilmualam.com)
 * Version: 2.0 (High Performance)
 * License: Proprietary
 */

(function() {
    const CONFIG = {
        surahId: 6, // Al-An'am
        totalAyahs: 165,
        batchSize: 15, // Load 15 ayahs at a time to keep it fast
        primaryColor: '#249749',
        darkColor: '#0c3808',
        containerId: 'ia-surah-anam-app'
    };

    const ICONS = {
        play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
        copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
        bookmark: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>',
        check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#249749" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    };

    // 1. INJECT STYLES
    const style = document.createElement('style');
    style.textContent = `
        #${CONFIG.containerId} {
            font-family: 'Inter', sans-serif;
            max-width: 100%;
            margin: 0 auto;
            color: #333;
            box-sizing: border-box;
        }
        #${CONFIG.containerId} * { box-sizing: border-box; }

        /* Control Panel */
        .ia-control-panel {
            background: #fff;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .ia-search-box {
            display: flex;
            align-items: center;
            gap: 5px;
            background: #f5f5f5;
            padding: 5px 10px;
            border-radius: 20px;
        }
        .ia-search-box input {
            border: none;
            background: transparent;
            width: 60px;
            font-size: 14px;
            outline: none;
        }
        .ia-main-play-btn {
            background: ${CONFIG.darkColor};
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9rem;
        }

        /* Ayah Card */
        .ia-ayah-card {
            background: white;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            scroll-margin-top: 80px; /* Offset for sticky header */
            transition: all 0.3s ease;
        }
        .ia-ayah-card.active {
            border-color: ${CONFIG.primaryColor};
            background-color: #f9fff9;
            box-shadow: 0 4px 10px rgba(36, 151, 73, 0.1);
        }

        /* Top Row: Number & Actions */
        .ia-card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px dashed #eee;
            padding-bottom: 10px;
        }
        .ia-ayah-badge {
            background: ${CONFIG.primaryColor};
            color: white;
            width: 32px; height: 32px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: bold; font-size: 0.85rem;
        }
        
        /* Mobile Responsive Action Buttons */
        .ia-action-row {
            display: flex;
            gap: 8px;
        }
        .ia-mini-btn {
            background: #f5f5f5;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            color: #555;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        .ia-mini-btn:hover { background: #e0e0e0; color: ${CONFIG.primaryColor}; }

        /* Text Styles */
        .ia-arabic-text {
            font-family: 'Amiri', 'Scheherazade', serif;
            font-size: 1.8rem;
            text-align: right;
            line-height: 2.3;
            margin-bottom: 15px;
            color: #000;
            direction: rtl;
        }
        .ia-rumi-text {
            color: ${CONFIG.primaryColor};
            font-size: 0.95rem;
            font-style: italic;
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .ia-malay-text {
            color: #444;
            font-size: 1rem;
            line-height: 1.6;
        }

        /* Load More Button */
        .ia-load-more {
            display: block;
            width: 100%;
            padding: 15px;
            background: white;
            border: 2px dashed ${CONFIG.primaryColor};
            color: ${CONFIG.primaryColor};
            text-align: center;
            font-weight: bold;
            cursor: pointer;
            border-radius: 8px;
            margin-top: 20px;
        }
        .ia-load-more:hover { background: #f0fdf4; }

        /* MOBILE FIXES */
        @media (max-width: 480px) {
            .ia-arabic-text { font-size: 1.5rem; line-height: 2.1; }
            .ia-card-top { flex-direction: column; align-items: flex-start; gap: 10px; }
            .ia-action-row { 
                width: 100%; 
                justify-content: space-between; 
            }
            .ia-mini-btn {
                flex: 1; /* Equal width */
                justify-content: center;
                padding: 8px 5px;
                font-size: 0.75rem;
            }
            .ia-control-panel { flex-direction: column; align-items: stretch; }
            .ia-search-box { justify-content: space-between; }
        }
    `;
    document.head.appendChild(style);

    // Load Arabic Font
    const font = document.createElement('link');
    font.href = 'https://fonts.googleapis.com/css2?family=Amiri&display=swap';
    font.rel = 'stylesheet';
    document.head.appendChild(font);

    // STATE
    let allData = [];
    let renderedCount = 0;
    let currentAudio = null;
    let currentPlayingIndex = -1;
    let isPlaying = false;

    const container = document.getElementById(CONFIG.containerId);

    // 2. INIT FUNCTION
    async function init() {
        if (!container) return;
        
        try {
            // Fetch All Data Once (JSON is light, DOM is heavy)
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${CONFIG.surahId}/editions/quran-uthmani,ms.basmeih,en.transliteration`);
            const data = await response.json();

            if (data.code === 200) {
                processData(data.data);
                renderStructure();
                renderBatch(); // Render first batch
                checkBookmark();
            } else {
                container.innerHTML = 'Ralat memuatkan data.';
            }
        } catch (e) {
            console.error(e);
            container.innerHTML = 'Gagal menyambung ke server.';
        }
    }

    function processData(editions) {
        const arabic = editions[0].ayahs;
        const malay = editions[1].ayahs;
        const rumi = editions[2].ayahs;

        allData = arabic.map((item, i) => ({
            number: item.numberInSurah,
            globalId: item.number, // For audio URL
            text: item.text,
            malay: malay[i].text,
            rumi: rumi[i].text,
            audio: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${item.number}.mp3`
        }));
    }

    function renderStructure() {
        container.innerHTML = `
            <div class="ia-control-panel">
                <div class="ia-search-box">
                    <span>Ke Ayat:</span>
                    <input type="number" id="ia-jump-input" min="1" max="165" placeholder="1-165">
                    <button class="ia-mini-btn" style="padding:4px 8px;" onclick="window.iaJumpToAyah()">Go</button>
                </div>
                <button class="ia-main-play-btn" id="ia-global-play" onclick="window.iaToggleGlobalPlay()">
                    ${ICONS.play} Mainkan Semua
                </button>
            </div>
            <div id="ia-ayah-list"></div>
            <button id="ia-load-more-btn" class="ia-load-more" onclick="window.iaLoadMore()">
                Muat Lagi (+15 Ayat)
            </button>
        `;
    }

    // 3. RENDER LOGIC (BATCHING)
    window.iaLoadMore = function() {
        renderBatch();
    };

    function renderBatch() {
        const list = document.getElementById('ia-ayah-list');
        const start = renderedCount;
        const end = Math.min(renderedCount + CONFIG.batchSize, allData.length);
        
        if (start >= allData.length) {
            document.getElementById('ia-load-more-btn').style.display = 'none';
            return;
        }

        let html = '';
        for (let i = start; i < end; i++) {
            const ayah = allData[i];
            html += `
                <div class="ia-ayah-card" id="ayah-${i}" data-index="${i}">
                    <div class="ia-card-top">
                        <div class="ia-ayah-badge">${ayah.number}</div>
                        <div class="ia-action-row">
                            <button class="ia-mini-btn play-btn" onclick="window.iaPlaySingle(${i})">${ICONS.play} Audio</button>
                            <button class="ia-mini-btn" onclick="window.iaCopy(${i})">${ICONS.copy} Copy</button>
                            <button class="ia-mini-btn" onclick="window.iaBookmark(${i})">${ICONS.bookmark} Tanda</button>
                        </div>
                    </div>
                    <div class="ia-arabic-text">${ayah.text}</div>
                    <div class="ia-rumi-text">${ayah.rumi}</div>
                    <div class="ia-malay-text">${ayah.malay}</div>
                </div>
            `;
        }
        
        // Append HTML (Better performance than innerHTML +=)
        list.insertAdjacentHTML('beforeend', html);
        renderedCount = end;

        if (renderedCount >= allData.length) {
            document.getElementById('ia-load-more-btn').style.display = 'none';
        }
    }

    // 4. JUMP FUNCTION (Auto Load if needed)
    window.iaJumpToAyah = function() {
        const input = document.getElementById('ia-jump-input');
        let num = parseInt(input.value);
        if(!num || num < 1 || num > 165) return alert('Sila masukkan nombor 1-165');

        const index = num - 1;

        // If ayah is not rendered yet, keep loading batches until it is
        while (renderedCount <= index) {
            renderBatch();
        }

        const el = document.getElementById(`ayah-${index}`);
        if(el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 2000);
        }
    };

    // 5. AUDIO ENGINE
    window.iaPlaySingle = function(index) {
        if(currentAudio && !currentAudio.paused && currentPlayingIndex === index) {
            pauseAudio();
            return;
        }
        playAudio(index);
    };

    window.iaToggleGlobalPlay = function() {
        if(isPlaying) {
            pauseAudio();
        } else {
            playAudio(currentPlayingIndex === -1 ? 0 : currentPlayingIndex);
        }
    };

    function playAudio(index) {
        if(currentAudio) currentAudio.pause();

        // Ensure element exists (auto load if needed)
        if(index >= renderedCount) renderBatch();

        currentPlayingIndex = index;
        const ayah = allData[index];
        
        // UI Updates
        updateIcons(index, true);
        highlightCard(index);

        currentAudio = new Audio(ayah.audio);
        currentAudio.play();
        isPlaying = true;

        // Auto Next
        currentAudio.onended = function() {
            updateIcons(index, false);
            if(index + 1 < allData.length) {
                playAudio(index + 1);
            } else {
                isPlaying = false;
                updateGlobalBtn(false);
            }
        };
    }

    function pauseAudio() {
        if(currentAudio) currentAudio.pause();
        isPlaying = false;
        updateIcons(currentPlayingIndex, false);
    }

    function highlightCard(index) {
        document.querySelectorAll('.ia-ayah-card').forEach(e => e.classList.remove('active'));
        const el = document.getElementById(`ayah-${index}`);
        if(el) {
            el.classList.add('active');
            // Only scroll if not in view
            const rect = el.getBoundingClientRect();
            if(rect.top < 0 || rect.bottom > window.innerHeight) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    function updateIcons(index, playing) {
        // Reset all play buttons
        document.querySelectorAll('.play-btn').forEach(b => b.innerHTML = `${ICONS.play} Audio`);
        updateGlobalBtn(playing);

        if(playing) {
            const btn = document.querySelector(`#ayah-${index} .play-btn`);
            if(btn) btn.innerHTML = `${ICONS.pause} Pause`;
        }
    }

    function updateGlobalBtn(playing) {
        const btn = document.getElementById('ia-global-play');
        btn.innerHTML = playing ? `${ICONS.pause} Pause` : `${ICONS.play} Mainkan Semua`;
    }

    // 6. UTILS
    window.iaCopy = function(index) {
        const d = allData[index];
        const text = `Surah Al-An'am Ayat ${d.number}:\n${d.text}\n"${d.malay}"`;
        navigator.clipboard.writeText(text).then(() => alert("Ayat disalin!"));
    };

    window.iaBookmark = function(index) {
        localStorage.setItem('ia_anam_bookmark', index);
        alert(`Ayat ${index + 1} ditanda.`);
    };

    function checkBookmark() {
        const saved = localStorage.getItem('ia_anam_bookmark');
        if(saved) {
            const btn = document.createElement('div');
            btn.innerHTML = `<button style="background:#249749; color:white; border:none; padding:5px 10px; border-radius:15px; font-size:12px; margin-top:5px; cursor:pointer;">Sambung Ayat ${parseInt(saved)+1}</button>`;
            btn.onclick = () => {
                document.getElementById('ia-jump-input').value = parseInt(saved) + 1;
                window.iaJumpToAyah();
            };
            document.querySelector('.ia-control-panel').appendChild(btn);
        }
    }

    // Init
    init();

})();
