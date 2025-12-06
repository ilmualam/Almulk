// ### SURAH AD-DHUHA INTERAKTIF – AUTO PLAY AYAT v3.0 ###
// Dibina khas untuk IlmuAlam.com – Audio ayat-by-ayat, auto-play, auto-scroll.

(function () {
  "use strict";

  // === AUDIO URL PER AYAT (Alafasy) ===
  function getAyahAudio(ayah) {
    return "https://cdn.islamic.network/quran/audio/128/ar.alafasy/93" + ayah + ".mp3";
  }

  // === DATA AYAT ===
  const VERSES = [
    { n: 1, a: "وَالضُّحَىٰ", r: "Wad-dhuha", t: "Demi waktu Dhuha (pagi yang cerah)," },
    { n: 2, a: "وَاللَّيْلِ إِذَا سَجَىٰ", r: "Wal-layli idza saja", t: "Dan demi malam apabila ia sunyi," },
    { n: 3, a: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", r: "Ma wadda'aka rabbuka...", t: "Tuhanmu tidak meninggalkanmu..." },
    { n: 4, a: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", r: "Walal-akhiratu khayr...", t: "Akhirat lebih baik bagimu..." },
    { n: 5, a: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", r: "Wa lasawfa yu'tika...", t: "Tuhanmu akan memberimu hingga kamu reda." },
    { n: 6, a: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ", r: "Alam yajidka...", t: "Dia mendapatimu yatim lalu melindungimu." },
    { n: 7, a: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", r: "Wa wajadaka dhol-lan...", t: "Dia mendapatimu mencari lalu memberi petunjuk." },
    { n: 8, a: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ", r: "Wa wajadaka 'a-ilan...", t: "Dia mendapatimu miskin lalu memberikan kecukupan." },
    { n: 9, a: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", r: "Fa-ammal yatima...", t: "Maka janganlah engkau hinakan anak yatim." },
    { n: 10, a: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ", r: "Wa ammas-sa-ila...", t: "Dan janganlah engkau menghardik orang meminta." },
    { n: 11, a: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", r: "Wa amma bi ni'mati...", t: "Dan ceritakanlah nikmat Tuhanmu." },
  ];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const root = document.getElementById("surah-ad-dhuha-tool");
    if (!root) return;

    const container = root.querySelector("#verses-container");
    const playBtn = root.querySelector("#play-toggle");
    const progressFill = root.querySelector("#audio-progress-fill");
    const timeDisplay = root.querySelector("#time-display");

    let currentAyah = 1;
    let audio = new Audio();
    let timer = null;

    // === Render ayat ===
    VERSES.forEach(v => {
      const card = document.createElement("div");
      card.className = "verse-card";
      card.dataset.ayah = v.n;
      card.innerHTML = `
        <div class="verse-header"><div class="verse-number">${v.n}</div></div>
        <div class="verse-arabic">${v.a}</div>
        <div class="verse-rumi">${v.r}</div>
        <div class="verse-translation">${v.t}</div>
      `;
      card.addEventListener("click", () => {
        currentAyah = v.n;
        highlight();
        playAyah();
      });
      container.appendChild(card);
    });

    // === Highlight ayat semasa ===
    function highlight() {
      container.querySelectorAll(".verse-card").forEach(c => c.classList.remove("playing"));
      const active = container.querySelector(`.verse-card[data-ayah="${currentAyah}"]`);
      if (active) {
        active.classList.add("playing");
        active.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    // === Play ayat ===
    function playAyah() {
      audio.pause();
      audio = new Audio(getAyahAudio(currentAyah));
      audio.play();

      playBtn.textContent = "⏸";

      highlight();
      startTimer();

      audio.onended = () => {
        if (currentAyah < VERSES.length) {
          currentAyah++;
          playAyah(); // >>> AUTO NEXT AYAT !!! <<<
        } else {
          playBtn.textContent = "▶";
          stopTimer();
        }
      };
    }

    // === Timer untuk progress bar ===
    function startTimer() {
      stopTimer();
      timer = setInterval(() => {
        if (!audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + "%";
        timeDisplay.textContent =
          format(audio.currentTime) + " / " + format(audio.duration);
      }, 200);
    }

    function stopTimer() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function format(sec) {
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }

    // === Event Play/Pause ===
    playBtn.addEventListener("click", () => {
      if (audio.paused) {
        playAyah();
      } else {
        audio.pause();
        playBtn.textContent = "▶";
        stopTimer();
      }
    });

    highlight();
  }
})();
