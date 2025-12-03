// Surah Ibrahim Interactive Learning System
// Deploy via GitHub CDN untuk Blogger compatibility
(function() {
  'use strict';
  
  // Domain protection
  const allowedDomains = ['ilmualam.com', 'blogger.com', 'blogspot.com'];
  const currentDomain = window.location.hostname;
  
  if (!allowedDomains.some(domain => currentDomain.includes(domain))) {
    console.warn('Unauthorized domain access detected');
    return;
  }
  
  // Configuration
  const CONFIG = {
    surahNumber: 14,
    surahName: 'Ibrahim',
    totalAyahs: 52,
    apiEndpoint: 'https://api.alquran.cloud/v1/surah/14',
    audioSource: 'ar.alafasy',
    colors: {
      primary: '#249749',
      secondary: '#0c3808',
      accent: '#FFD700',
      background: '#F0F8F0'
    }
  };
  
  // Initialize when DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveTool();
  });
  
  async function initializeInteractiveTool() {
    const container = document.getElementById('surah-ibrahim-interactive-tool');
    if (!container) return;
    
    // Create enhanced UI structure
    container.innerHTML = `
      <div class="sii-wrapper" style="background: linear-gradient(135deg, ${CONFIG.colors.primary}, ${CONFIG.colors.secondary}); border-radius: 15px; padding: 15px; font-family: 'Inter', Arial, sans-serif;">
        
        <!-- Header Section -->
        <div class="sii-header" style="text-align: center; color: white; margin-bottom: 30px;">
          <h2 style="font-size: 2em; margin-bottom: 10px;">📖 Surah ${CONFIG.surahName}</h2>
          <p style="opacity: 0.9;">Sistem Pembelajaran Interaktif dengan Audio Sync</p>
          
          <!-- Control Panel -->
          <div class="sii-controls" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px; flex-wrap: wrap;">
            <button onclick="playFullSurah()" style="padding: 10px 20px; background: ${CONFIG.colors.accent}; color: #333; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; transition: all 0.3s;">
              ▶️ Play Surah Penuh
            </button>
            <button onclick="toggleTranslation()" style="padding: 10px 20px; background: white; color: ${CONFIG.colors.secondary}; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
              🔄 Terjemahan
            </button>
            <button onclick="toggleTafsir()" style="padding: 10px 20px; background: white; color: ${CONFIG.colors.secondary}; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
              📚 Tafsir
            </button>
            <button onclick="openMemorizationMode()" style="padding: 10px 20px; background: white; color: ${CONFIG.colors.secondary}; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
              🧠 Mod Hafazan
            </button>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="sii-progress" style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 10px; margin-bottom: 30px; overflow: hidden;">
          <div id="progressBar" style="width: 0%; height: 100%; background: ${CONFIG.colors.accent}; transition: width 0.5s;"></div>
        </div>
        
        <!-- Search & Navigation -->
        <div class="sii-search" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
          <input type="text" id="ayahSearch" placeholder="Cari ayat... (cth: 'syukur', 'doa ibrahim')" style="width: 100%; padding: 12px; border: 2px solid ${CONFIG.colors.primary}; border-radius: 8px; font-size: 16px;">
          
          <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
            <select id="ayahSelector" onchange="jumpToAyah(this.value)" style="padding: 10px; border: 2px solid ${CONFIG.colors.primary}; border-radius: 8px; flex: 1;">
              <option value="">Pilih Ayat...</option>
              ${generateAyahOptions()}
            </select>
            
            <select id="reciterSelect" onchange="changeReciter(this.value)" style="padding: 10px; border: 2px solid ${CONFIG.colors.primary}; border-radius: 8px; flex: 1;">
              <option value="ar.alafasy">Mishary Alafasy</option>
              <option value="ar.abdurrahmaansudais">Abdul Rahman Sudais</option>
              <option value="ar.hudhaify">Ali Hudhaify</option>
            </select>
          </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="sii-content" style="background: white; border-radius: 10px; padding: 20px; max-height: 1000px; overflow-y: auto;">
          <div id="ayahDisplay" style="min-height: 400px;">
            <!-- Ayat akan dipaparkan di sini -->
            <div style="text-align: center; padding: 50px;">
              <div class="loader" style="border: 5px solid #f3f3f3; border-top: 5px solid ${CONFIG.colors.primary}; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
              <p style="margin-top: 20px; color: #666;">Memuatkan ayat-ayat Surah Ibrahim...</p>
            </div>
          </div>
        </div>
        
        <!-- Feature Tabs -->
        <div class="sii-tabs" style="background: white; border-radius: 10px; padding: 20px; margin-top: 20px;">
          <div class="tab-buttons" style="display: flex; gap: 10px; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
            <button onclick="showTab('bookmarks')" class="tab-btn" style="padding: 10px 20px; background: ${CONFIG.colors.primary}; color: white; border: none; border-radius: 8px 8px 0 0; cursor: pointer;">
              🔖 Bookmarks
            </button>
            <button onclick="showTab('notes')" class="tab-btn" style="padding: 10px 20px; background: #f0f0f0; color: #333; border: none; border-radius: 8px 8px 0 0; cursor: pointer;">
              📝 Nota
            </button>
            <button onclick="showTab('statistics')" class="tab-btn" style="padding: 10px 20px; background: #f0f0f0; color: #333; border: none; border-radius: 8px 8px 0 0; cursor: pointer;">
              📊 Statistik
            </button>
            <button onclick="showTab('quiz')" class="tab-btn" style="padding: 10px 20px; background: #f0f0f0; color: #333; border: none; border-radius: 8px 8px 0 0; cursor: pointer;">
              🎯 Kuiz
            </button>
          </div>
          
          <div id="tabContent" style="min-height: 200px;">
            <!-- Tab content akan dipaparkan di sini -->
          </div>
        </div>
        
        <!-- Footer dengan shortcuts -->
        <div class="sii-footer" style="margin-top: 30px; padding-top: 20px; border-top: 2px solid rgba(255,255,255,0.2); color: white; text-align: center;">
          <p style="margin-bottom: 15px;">⌨️ Keyboard Shortcuts:</p>
          <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 14px;">
            <span>Space: Play/Pause</span>
            <span>← →: Previous/Next Ayah</span>
            <span>R: Repeat Ayah</span>
            <span>B: Bookmark</span>
          </div>
        </div>
      </div>
      
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .ayah-item {
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 10px;
          background: #f9f9f9;
          transition: all 0.3s;
        }
        
        .ayah-item:hover {
          background: #f0f8f0;
          transform: translateX(5px);
        }
        
        .ayah-item.active {
          background: linear-gradient(135deg, #249749, #0c3808);
          color: white;
        }
        
        .arabic-text {
          font-size: 32px;
          line-height: 2;
          text-align: right;
          font-family: 'Amiri', 'Traditional Arabic', serif;
          margin-bottom: 15px;
        }
        
        .translation-text {
          font-size: 16px;
          line-height: 1.8;
          color: #333;
          margin-top: 10px;
          padding: 15px;
          background: rgba(36, 151, 73, 0.05);
          border-left: 4px solid #249749;
          border-radius: 5px;
        }
        
        .ayah-controls {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .ayah-controls button {
          padding: 8px 15px;
          background: #249749;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .ayah-controls button:hover {
          background: #0c3808;
          transform: scale(1.05);
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .arabic-text {
            font-size: 24px;
          }
          
          .sii-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .sii-controls button {
            width: 100%;
          }
        }
      </style>
    `;
    
    // Load Surah data
    await loadSurahData();
  }
  
  function generateAyahOptions() {
    let options = '';
    for (let i = 1; i <= CONFIG.totalAyahs; i++) {
      options += `<option value="${i}">Ayat ${i}</option>`;
    }
    return options;
  }
  
  async function loadSurahData() {
    try {
      // Fetch Arabic text and audio
      const arabicResponse = await fetch(`${CONFIG.apiEndpoint}/editions/quran-simple,ms.basmeih`);
      const arabicData = await arabicResponse.json();
      
      if (arabicData.status === 'OK' && arabicData.data) {
        const arabicAyahs = arabicData.data[0].ayahs;
        const malayAyahs = arabicData.data[1].ayahs;
        
        displayAyahs(arabicAyahs, malayAyahs);
        initializeAudioSync(arabicAyahs);
        
        // Initialize localStorage for progress tracking
        initializeProgressTracking();
      }
    } catch (error) {
      console.error('Error loading Surah data:', error);
      document.getElementById('ayahDisplay').innerHTML = `
        <div style="text-align: center; padding: 50px; color: red;">
          <p>Maaf, gagal memuatkan data. Sila refresh halaman.</p>
        </div>
      `;
    }
  }
  
  function displayAyahs(arabicAyahs, malayAyahs) {
    const display = document.getElementById('ayahDisplay');
    let html = '';
    
    arabicAyahs.forEach((ayah, index) => {
      const malayText = malayAyahs[index].text;
      
      html += `
        <div class="ayah-item" id="ayah-${ayah.numberInSurah}" data-ayah="${ayah.numberInSurah}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <span style="background: ${CONFIG.colors.primary}; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">
              Ayat ${ayah.numberInSurah}
            </span>
            <div class="ayah-controls">
              <button onclick="playAyah(${ayah.numberInSurah})" title="Play">▶️</button>
              <button onclick="repeatAyah(${ayah.numberInSurah})" title="Repeat">🔁</button>
              <button onclick="bookmarkAyah(${ayah.numberInSurah})" title="Bookmark">🔖</button>
              <button onclick="shareAyah(${ayah.numberInSurah})" title="Share">📤</button>
            </div>
          </div>
          
          <div class="arabic-text">${ayah.text}</div>
          
          <div class="transliteration" style="color: #666; font-style: italic; margin: 10px 0;">
            <!-- Transliteration akan ditambah melalui API atau manual mapping -->
          </div>
          
          <div class="translation-text">
            <strong>Terjemahan:</strong> ${malayText}
          </div>
          
          <div class="tafsir-section" id="tafsir-${ayah.numberInSurah}" style="display: none; margin-top: 15px; padding: 15px; background: #fff3cd; border-radius: 8px;">
            <!-- Tafsir akan dimuatkan bila diperlukan -->
          </div>
        </div>
      `;
    });
    
    display.innerHTML = html;
  }
  
  function initializeAudioSync(ayahs) {
    // Create audio element
    const audio = document.createElement('audio');
    audio.id = 'surahAudio';
    audio.style.display = 'none';
    document.body.appendChild(audio);
    
    // Set up audio sync functionality
    window.currentAyahPlaying = null;
    
    audio.addEventListener('ended', function() {
      if (window.autoPlayNext) {
        const nextAyah = window.currentAyahPlaying + 1;
        if (nextAyah <= CONFIG.totalAyahs) {
          playAyah(nextAyah);
        }
      }
    });
  }
  
  function initializeProgressTracking() {
    const storageKey = 'surah_ibrahim_progress';
    let progress = localStorage.getItem(storageKey);
    
    if (!progress) {
      progress = {
        lastRead: null,
        bookmarks: [],
        notes: {},
        completedAyahs: [],
        statistics: {
          totalTimeSpent: 0,
          ayahsMemorized: 0,
          lastAccessed: new Date().toISOString()
        }
      };
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
    
    window.surahProgress = JSON.parse(progress);
  }
  
  // Global functions untuk buttons
  window.playFullSurah = function() {
    window.autoPlayNext = true;
    playAyah(1);
  };
  
  window.playAyah = async function(ayahNumber) {
    const audio = document.getElementById('surahAudio');
    const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/14:${ayahNumber}`;
    
    // Highlight current ayah
    document.querySelectorAll('.ayah-item').forEach(item => {
      item.classList.remove('active');
    });
    document.getElementById(`ayah-${ayahNumber}`).classList.add('active');
    
    // Scroll to ayah
    document.getElementById(`ayah-${ayahNumber}`).scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    
    // Play audio
    audio.src = audioUrl;
    audio.play();
    
    window.currentAyahPlaying = ayahNumber;
    
    // Update progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${(ayahNumber / CONFIG.totalAyahs) * 100}%`;
  };
  
  window.repeatAyah = function(ayahNumber) {
    const audio = document.getElementById('surahAudio');
    audio.currentTime = 0;
    audio.play();
  };
  
  window.bookmarkAyah = function(ayahNumber) {
    if (!window.surahProgress.bookmarks.includes(ayahNumber)) {
      window.surahProgress.bookmarks.push(ayahNumber);
      localStorage.setItem('surah_ibrahim_progress', JSON.stringify(window.surahProgress));
      alert(`Ayat ${ayahNumber} telah ditanda!`);
    } else {
      alert(`Ayat ${ayahNumber} sudah ditanda sebelum ini.`);
    }
  };
  
  window.shareAyah = function(ayahNumber) {
    const text = `Surah Ibrahim, Ayat ${ayahNumber} - Baca dan dengar di ilmualam.com`;
    if (navigator.share) {
      navigator.share({
        title: 'Surah Ibrahim',
        text: text,
        url: window.location.href + `#ayah-${ayahNumber}`
      });
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href + `#ayah-${ayahNumber}`);
      alert('Link ayat telah disalin!');
    }
  };
  
  window.toggleTranslation = function() {
    const translations = document.querySelectorAll('.translation-text');
    translations.forEach(t => {
      t.style.display = t.style.display === 'none' ? 'block' : 'none';
    });
  };
  
  window.toggleTafsir = function() {
    const tafsirs = document.querySelectorAll('.tafsir-section');
    tafsirs.forEach(t => {
      t.style.display = t.style.display === 'none' ? 'block' : 'none';
    });
  };
  
  window.jumpToAyah = function(ayahNumber) {
    if (ayahNumber) {
      document.getElementById(`ayah-${ayahNumber}`).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      playAyah(parseInt(ayahNumber));
    }
  };
  
  window.showTab = function(tabName) {
    const content = document.getElementById('tabContent');
    const buttons = document.querySelectorAll('.tab-btn');
    
    // Update button styles
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
        btn.style.background = CONFIG.colors.primary;
        btn.style.color = 'white';
      } else {
        btn.style.background = '#f0f0f0';
        btn.style.color = '#333';
      }
    });
    
    // Update tab content
    switch(tabName) {
      case 'bookmarks':
        displayBookmarks();
        break;
      case 'notes':
        displayNotes();
        break;
      case 'statistics':
        displayStatistics();
        break;
      case 'quiz':
        displayQuiz();
        break;
    }
  };
  
  window.displayBookmarks = function() {
    const content = document.getElementById('tabContent');
    const bookmarks = window.surahProgress.bookmarks;
    
    if (bookmarks.length === 0) {
      content.innerHTML = '<p style="text-align: center; color: #666;">Tiada bookmark lagi. Klik 🔖 pada mana-mana ayat untuk menanda.</p>';
    } else {
      let html = '<h4>Ayat-ayat Bertanda:</h4><div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">';
      bookmarks.forEach(ayah => {
        html += `<button onclick="jumpToAyah(${ayah})" style="padding: 10px 20px; background: ${CONFIG.colors.primary}; color: white; border: none; border-radius: 20px; cursor: pointer;">Ayat ${ayah}</button>`;
      });
      html += '</div>';
      content.innerHTML = html;
    }
  };
  
  window.displayStatistics = function() {
    const content = document.getElementById('tabContent');
    const stats = window.surahProgress.statistics;
    
    content.innerHTML = `
      <h4>📊 Statistik Pembelajaran Anda:</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
        <div style="background: linear-gradient(135deg, #249749, #0c3808); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${window.surahProgress.completedAyahs.length}</div>
          <div>Ayat Selesai</div>
        </div>
        <div style="background: linear-gradient(135deg, #FF6B6B, #C92A2A); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${window.surahProgress.bookmarks.length}</div>
          <div>Bookmarks</div>
        </div>
        <div style="background: linear-gradient(135deg, #4ECDC4, #1A8A84); color: white; padding: 20px; border-radius: 10px; text-align: center;">
          <div style="font-size: 32px; font-weight: bold;">${Math.round((window.surahProgress.completedAyahs.length / CONFIG.totalAyahs) * 100)}%</div>
          <div>Progress</div>
        </div>
      </div>
    `;
  };
  
  window.displayQuiz = function() {
    const content = document.getElementById('tabContent');
    
    // Sample quiz questions about Surah Ibrahim
    const questions = [
      {
        question: "Apakah tema utama Surah Ibrahim?",
        options: ["Kisah para nabi", "Keteguhan iman dan syukur", "Hukum hakam", "Kisah perang"],
        correct: 1
      },
      {
        question: "Di manakah Surah Ibrahim diturunkan?",
        options: ["Madinah", "Makkah", "Thaif", "Badar"],
        correct: 1
      },
      {
        question: "Berapa jumlah ayat dalam Surah Ibrahim?",
        options: ["50", "51", "52", "53"],
        correct: 2
      }
    ];
    
    let html = '<h4>🎯 Kuiz Pemahaman Surah Ibrahim:</h4>';
    html += '<div id="quizContainer" style="margin-top: 20px;">';
    
    questions.forEach((q, index) => {
      html += `
        <div style="margin-bottom: 25px; padding: 20px; background: #f9f9f9; border-radius: 10px;">
          <p style="font-weight: bold; margin-bottom: 15px;">${index + 1}. ${q.question}</p>
          <div style="display: grid; gap: 10px;">
      `;
      
      q.options.forEach((option, optIndex) => {
        html += `
          <label style="display: flex; align-items: center; padding: 10px; background: white; border: 2px solid #ddd; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
            <input type="radio" name="q${index}" value="${optIndex}" style="margin-right: 10px;">
            ${option}
          </label>
        `;
      });
      
      html += '</div></div>';
    });
    
    html += `
      <button onclick="checkQuizAnswers()" style="width: 100%; padding: 15px; background: ${CONFIG.colors.primary}; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">
        Semak Jawapan
      </button>
      <div id="quizResults" style="margin-top: 20px;"></div>
    </div>`;
    
    content.innerHTML = html;
  };
  
  window.checkQuizAnswers = function() {
    // Quiz checking logic would go here
    const results = document.getElementById('quizResults');
    results.innerHTML = '<p style="text-align: center; color: green; font-weight: bold;">Tahniah! Teruskan pembelajaran anda.</p>';
  };
  
  window.openMemorizationMode = function() {
    alert('Mod Hafazan akan membimbing anda menghafaz Surah Ibrahim secara berperingkat. Feature ini sedang dibangunkan dan akan tersedia tidak lama lagi!');
  };
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case ' ':
        e.preventDefault();
        const audio = document.getElementById('surahAudio');
        if (audio) {
          audio.paused ? audio.play() : audio.pause();
        }
        break;
      case 'ArrowLeft':
        if (window.currentAyahPlaying > 1) {
          playAyah(window.currentAyahPlaying - 1);
        }
        break;
      case 'ArrowRight':
        if (window.currentAyahPlaying < CONFIG.totalAyahs) {
          playAyah(window.currentAyahPlaying + 1);
        }
        break;
      case 'r':
      case 'R':
        if (window.currentAyahPlaying) {
          repeatAyah(window.currentAyahPlaying);
        }
        break;
      case 'b':
      case 'B':
        if (window.currentAyahPlaying) {
          bookmarkAyah(window.currentAyahPlaying);
        }
        break;
    }
  });
  
})();
