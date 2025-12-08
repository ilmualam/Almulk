// ==============================
// SURAH AN-NAS - ALAT INTERAKTIF
// ==============================

(function() {
  const modeSelect   = document.getElementById('nas-mode-select');
  const practiceArea = document.getElementById('nas-practice-area');
  const feedbackArea = document.getElementById('nas-feedback-area');

  if (!modeSelect || !practiceArea || !feedbackArea) return;

  function setMode(mode) {
    feedbackArea.style.display = 'none';
    feedbackArea.innerHTML = '';

    if (mode === 'full') {
      practiceArea.style.direction = 'rtl';
      practiceArea.style.textAlign = 'center';
      practiceArea.style.fontSize = '28px';
      practiceArea.innerHTML = `
بِسْمِ ٱللّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ<br>
قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ<br>
مَلِكِ ٱلنَّاسِ<br>
إِلَٰهِ ٱلنَّاسِ<br>
مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ<br>
ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ<br>
مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ`;
    } else if (mode === 'fill') {
      practiceArea.style.direction = 'rtl';
      practiceArea.style.textAlign = 'center';
      practiceArea.style.fontSize = '28px';
      practiceArea.innerHTML = `
قُلْ أَعُوذُ بِرَبِّ _____<br>
مَلِكِ _____<br>
إِلَٰهِ _____<br>
مِن شَرِّ ٱلْوَسْوَاسِ _____<br>
ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ _____<br>
مِنَ ٱلْجِنَّةِ وَ_____`;
    } else if (mode === 'quiz') {
      practiceArea.style.direction = 'rtl';
      practiceArea.style.textAlign = 'center';
      practiceArea.style.fontSize = '18px';
      practiceArea.innerHTML = `
<textarea style="width:100%;min-height:200px;padding:15px;border:2px solid #ddd;border-radius:8px;font-size:22px;direction:rtl;text-align:center;font-family:'Traditional Arabic',serif;resize:vertical;" placeholder="Cuba tulis Surah An-Nas di sini tanpa melihat teks..."></textarea>`;
    } else if (mode === 'audio') {
      practiceArea.style.direction = 'ltr';
      practiceArea.style.textAlign = 'left';
      practiceArea.style.fontSize = '16px';
      practiceArea.innerHTML = `
  <p style="font-size:18px;color:#666;">
    🎧 <strong>Mod Audio An-Nas AKTIF</strong><br><br>
    Tekan butang di bawah untuk dengar bacaan Surah An-Nas, kemudian ikut perlahan-lahan.
  </p>

  <div class="nas-audio-controls" style="direction:ltr;text-align:left;margin-top:15px;">
    <button type="button" class="nas-play-btn" id="nas-play-toggle"
      aria-label="Mainkan / berhenti Surah An-Nas"
      style="min-width:48px;height:48px;border-radius:999px;border:none;font-size:20px;cursor:pointer;background:#249749;color:#fff;">
      ▶
    </button>

    <div class="nas-progress-bar" id="nas-audio-progress"
      style="display:inline-block;width:65%;height:8px;background:#eee;border-radius:999px;margin:0 10px;vertical-align:middle;cursor:pointer;position:relative;">
      <div class="nas-progress-fill" id="nas-audio-progress-fill"
        style="height:100%;width:0;border-radius:999px;background:#249749;"></div>
    </div>

    <span class="nas-time-display" id="nas-time-display"
      style="font-size:13px;color:#555;vertical-align:middle;">00:00 / 00:00</span>

    <audio id="surah-annas-audio" preload="metadata" style="display:none">
      <source src="https://everyayah.com/data/Alafasy_128kbps/114.mp3" type="audio/mpeg">
      Browser anda tidak menyokong audio HTML5.
    </audio>
  </div>
      `;
      initNasAudioPlayer();
    }
  }

  modeSelect.addEventListener('change', function() {
    setMode(this.value);
  });

  // FIRST INIT
  setMode(modeSelect.value);

  // Expose helper functions for buttons
  window.nasCheckAnswer = function nasCheckAnswer() {
    const mode = modeSelect.value;
    feedbackArea.style.display = 'block';

    if (mode === 'full') {
      feedbackArea.style.background = '#e3f2fd';
      feedbackArea.style.color = '#1976d2';
      feedbackArea.innerHTML = '📚 Bagus! Ulang bacaan sekurang-kurangnya 7-10 kali. Bila dah lancar, cuba Mod Isi Tempat Kosong.';
    } else if (mode === 'fill') {
      feedbackArea.style.background = '#fff3e0';
      feedbackArea.style.color = '#f57c00';
      feedbackArea.innerHTML = '💪 Jawapan utama: ٱلنَّاسِ | ٱلْخَنَّاسِ | صُدُورِ | ٱلنَّاسِ | ٱلْجِنَّةِ | ٱلنَّاسِ.<br>Semak semula tempat kosong anda. Kalau semua tepat, teruskan ke Mod Ujian.';
    } else if (mode === 'quiz') {
      feedbackArea.style.background = '#f3e5f5';
      feedbackArea.style.color = '#7b1fa2';
      feedbackArea.innerHTML = '✨ Bandingkan jawapan anda dengan teks asal di Mod Paparan Penuh. Pastikan setiap baris &amp; harakat betul.';
    } else if (mode === 'audio') {
      feedbackArea.style.background = '#e8f5e9';
      feedbackArea.style.color = '#2e7d32';
      feedbackArea.innerHTML = '🎧 Tip: Dengar 3 kali tanpa ikut, kemudian kali ke-4 dan ke-5 baru ikut bacaan perlahan-lahan.';
    }
  };

  window.nasResetPractice = function nasResetPractice() {
    modeSelect.value = 'full';
    setMode('full');
    feedbackArea.style.display = 'none';
    feedbackArea.innerHTML = '';
  };

  window.nasShowTranslation = function nasShowTranslation() {
    feedbackArea.style.display = 'block';
    feedbackArea.style.background = '#e8f5e9';
    feedbackArea.style.color = '#2e7d32';
    feedbackArea.innerHTML = '<strong>Terjemahan Ringkas Surah An-Nas:</strong><br>Aku berlindung kepada Allah, Tuhan, Raja dan Ilah seluruh manusia daripada kejahatan pembisik yang bersembunyi, yang membisikkan ke dalam hati manusia - daripada kalangan jin dan manusia.';
  };

  // AUDIO PLAYER
  function initNasAudioPlayer() {
    const audio       = document.getElementById('surah-annas-audio');
    const playBtn     = document.getElementById('nas-play-toggle');
    const progressBar = document.getElementById('nas-audio-progress');
    const progressFill= document.getElementById('nas-audio-progress-fill');
    const timeDisplay = document.getElementById('nas-time-display');

    if (!audio || !playBtn || !progressBar || !progressFill || !timeDisplay) return;

    let rafId = null;

    function formatTime(sec) {
      if (isNaN(sec)) return '00:00';
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    }

    function updateProgress() {
      if (!audio.duration) {
        timeDisplay.textContent = '00:00 / 00:00';
        return;
      }
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = percent + '%';
      timeDisplay.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
      rafId = window.requestAnimationFrame(updateProgress);
    }

    playBtn.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function() {
      playBtn.textContent = '⏸';
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateProgress);
    });

    audio.addEventListener('pause', function() {
      playBtn.textContent = '▶';
      if (rafId) window.cancelAnimationFrame(rafId);
    });

    audio.addEventListener('ended', function() {
      playBtn.textContent = '▶';
      if (rafId) window.cancelAnimationFrame(rafId);
      progressFill.style.width = '0%';
      timeDisplay.textContent = '00:00 / ' + formatTime(audio.duration || 0);
    });

    progressBar.addEventListener('click', function(e) {
      const rect  = progressBar.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (audio.duration) {
        audio.currentTime = ratio * audio.duration;
        updateProgress();
      }
    });
  }

})();
