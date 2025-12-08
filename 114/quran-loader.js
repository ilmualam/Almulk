/* ==== ILMU QURAN LOADER – GLOBAL UNTUK SEMUA SURAH ==== */
/* v1 – Fokus Surah An-Naml dulu, nanti kita expand 114 */

(function () {
  const API_BASE =
    "https://api.alquran.cloud/v1/surah/"; // guna editions multiple
  const SURAH_INFO = {
    27: {
      number: 27,
      arabicName: "النمل",
      latinName: "An-Naml",
      malayName: "Surah An-Naml",
      verses: 93,
      revelation: "Makkiyyah",
      juz: "19–20",
      shortDesc:
        "Surah An-Naml (Surah 27) mengandungi kisah Nabi Sulaiman a.s., dialog dengan semut, burung Hud-hud dan Ratu Saba’ sebagai peringatan tentang tauhid, syukur dan ketaatan kepada Allah.",
      mainKeywords: [
        "Surah An-Naml",
        "surah an naml rumi",
        "surah an-naml arab dan rumi",
        "surah 27",
        "kisah Nabi Sulaiman dan semut",
        "al quran online rumi"
      ]
    }
    // Nanti kita tambah 1–114 di sini
  };

  let globalAudio = null;
  let globalPlaying = null; // { container, ayahNumber }

  document.addEventListener("DOMContentLoaded", function () {
    const roots = document.querySelectorAll(".ilmu-quran-root[data-surah]");
    if (!roots.length) return;

    roots.forEach((root) => {
      const surahId = parseInt(root.getAttribute("data-surah"), 10);
      if (!surahId) return;
      initSurahTool(root, surahId);
    });
  });

  async function initSurahTool(root, surahId) {
    root.innerHTML =
      '<div class="ilmu-quran-loading">Memuatkan Surah... Sila tunggu seketika.</div>';

    try {
      const url =
        API_BASE +
        surahId +
        "/editions/quran-uthmani,ms.basmeih,en.transliteration,ar.alafasy";
      const res = await fetch(url);
      const json = await res.json();

      if (!json || json.code !== 200 || !Array.isArray(json.data)) {
        throw new Error("API tidak sah");
      }

      const [arabicEd, msEd, translitEd, audioEd] = json.data;
      buildUI(root, surahId, arabicEd, msEd, translitEd, audioEd);
    } catch (err) {
      console.error("Quran loader error:", err);
      root.innerHTML =
        '<div class="ilmu-quran-error">Maaf, alat Surah tidak dapat dimuatkan buat masa ini. Sila cuba lagi atau semak sambungan internet.</div>';
    }
  }

  function buildUI(root, surahId, arabicEd, msEd, translitEd, audioEd) {
    const info = SURAH_INFO[surahId] || {
      number: surahId,
      arabicName: arabicEd.englishName ? arabicEd.englishName : "السورة",
      latinName: arabicEd.englishName || "Surah",
      malayName: "Surah " + (arabicEd.englishName || surahId),
      verses: arabicEd.numberOfAyahs,
      revelation: arabicEd.revelationType === "Meccan" ? "Makkiyyah" : "Madaniyyah",
      juz: "",
      shortDesc:
        "Bacaan lengkap surah Al-Quran dengan teks Arab, Rumi, terjemahan dan audio MP3.",
      mainKeywords: ["Al-Quran", "surah", "bacaan rumi", "quran online"]
    };

    const prevUrl = root.getAttribute("data-prev-url");
    const nextUrl = root.getAttribute("data-next-url");

    const verses = arabicEd.ayahs.map((ayah, idx) => {
      const ms = msEd.ayahs[idx];
      const tr = translitEd.ayahs[idx];
      const audio =
        audioEd && audioEd.ayahs && audioEd.ayahs[idx]
          ? audioEd.ayahs[idx].audio
          : null;

      return {
        numberInSurah: ayah.numberInSurah,
        arabic: ayah.text,
        translit: tr ? tr.text : "",
        ms: ms ? ms.text : "",
        audio: audio
      };
    });

    const heroHtml = `
      <header class="ilmu-quran-hero">
        <div class="ilmu-quran-hero-title">
          <div class="ilmu-quran-hero-icon">27</div>
          <div>
            <h2>${info.malayName} (سورة ${info.arabicName}) – Bacaan Rumi, Arab & Terjemahan</h2>
            <small>${info.shortDesc}</small>
          </div>
        </div>
        <div class="ilmu-quran-hero-meta">
          <span class="ilmu-quran-pill">Surah ${info.latinName}</span>
          <span class="ilmu-quran-pill">${info.revelation}</span>
          <span class="ilmu-quran-pill">${info.verses} ayat</span>
          ${info.juz ? `<span class="ilmu-quran-pill">Juzuk ${info.juz}</span>` : ""}
        </div>
      </header>
    `;

    const toolbarHtml = `
      <div class="ilmu-quran-toolbar">
        <div class="ilmu-quran-audio">
          <button type="button" class="ilmu-quran-btn-global-play">
            <span>▶</span>
            <strong>Mainkan bacaan ayat terpilih</strong>
          </button>
          <div class="ilmu-quran-audio-status">Tiada ayat dipilih.</div>
        </div>
        <div class="ilmu-quran-toggle-group">
          <button type="button" class="ilmu-quran-toggle toggle-translit is-active">
            Rumi
          </button>
          <button type="button" class="ilmu-quran-toggle toggle-ms is-active">
            Terjemahan
          </button>
        </div>
      </div>
    `;

    const ayahListHtml =
      '<ol class="ilmu-quran-ayah-list">' +
      verses
        .map(
          (v) => `
        <li class="ilmu-quran-ayah" data-ayah="${v.numberInSurah}" ${
            v.audio ? `data-audio="${encodeHTML(v.audio)}"` : ""
          }>
          <div class="ilmu-quran-ayah-header">
            <span class="ilmu-quran-ayah-number">${v.numberInSurah}</span>
            <div class="ilmu-quran-ayah-actions">
              ${
                v.audio
                  ? `<button type="button" class="ayah-play">▶ Dengar</button>`
                  : ""
              }
              <button type="button" class="ayah-copy">Salin</button>
              <button type="button" class="ayah-bookmark">Tanda</button>
            </div>
          </div>
          <div class="ilmu-quran-text-ar">${v.arabic}</div>
          <div class="ilmu-quran-text-translit" data-role="translit">${
            v.translit || ""
          }</div>
          <div class="ilmu-quran-text-ms" data-role="ms">${
            v.ms || ""
          }</div>
        </li>
      `
        )
        .join("") +
      "</ol>";

    const footerNavHtml = `
      <div class="ilmu-quran-footer-nav">
        <div class="ilmu-quran-footer-links">
          ${
            prevUrl
              ? `<a href="${encodeHTML(
                  prevUrl
                )}" rel="prev">← Surah sebelum</a>`
              : ""
          }
          <a href="https://www.ilmualam.com/p/quran-online.html" class="primary">Kembali ke Indeks Al-Quran</a>
          ${
            nextUrl
              ? `<a href="${encodeHTML(
                  nextUrl
                )}" rel="next">Surah seterusnya →</a>`
              : ""
          }
        </div>
      </div>
    `;

    root.innerHTML =
      '<section class="ilmu-quran-tool">' +
      heroHtml +
      toolbarHtml +
      ayahListHtml +
      footerNavHtml +
      "</section>";

    attachBehaviour(root, surahId, info);
    injectJsonLd(root, surahId, info, verses);
  }

  function attachBehaviour(root, surahId, info) {
    const tool = root.querySelector(".ilmu-quran-tool");
    if (!tool) return;

    const audioStatus = tool.querySelector(".ilmu-quran-audio-status");
    const list = tool.querySelector(".ilmu-quran-ayah-list");
    const btnGlobalPlay = tool.querySelector(".ilmu-quran-btn-global-play");
    const toggleTranslit = tool.querySelector(".toggle-translit");
    const toggleMs = tool.querySelector(".toggle-ms");

    if (!globalAudio) {
      globalAudio = new Audio();
      globalAudio.addEventListener("ended", () => {
        if (globalPlaying) {
          setActiveAyah(globalPlaying.container, null);
          globalPlaying = null;
          if (audioStatus) audioStatus.textContent = "Bacaan tamat.";
        }
      });
    }

    // Klik dalam list
    list.addEventListener("click", function (e) {
      const target = e.target;
      const li = target.closest(".ilmu-quran-ayah");
      if (!li) return;

      const ayahNumber = li.getAttribute("data-ayah");

      // PLAY PER AYAT
      if (target.classList.contains("ayah-play")) {
        const audioUrl = li.getAttribute("data-audio");
        if (!audioUrl) return;
        playAyahAudio(root, li, audioUrl, audioStatus);
        return;
      }

      // COPY AYAT
      if (target.classList.contains("ayah-copy")) {
        const textAr = li.querySelector(".ilmu-quran-text-ar")?.innerText || "";
        const textTr =
          li.querySelector('[data-role="translit"]')?.innerText || "";
        const textMs = li.querySelector('[data-role="ms"]')?.innerText || "";
        const fullText =
          info.malayName +
          " ayat " +
          ayahNumber +
          ":\n\n" +
          textAr +
          "\n\n" +
          (textTr ? textTr + "\n\n" : "") +
          textMs;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(fullText).then(
            function () {
              toastBrief("Teks ayat disalin.", root);
            },
            function () {
              toastBrief("Tidak dapat salin teks.", root);
            }
          );
        } else {
          toastBrief("Clipboard tidak disokong pelayar ini.", root);
        }
        return;
      }

      // BOOKMARK
      if (target.classList.contains("ayah-bookmark")) {
        saveBookmark(surahId, ayahNumber);
        toastBrief("Ayat ditandakan sebagai bookmark.", root);
        return;
      }
    });

    // GLOBAL PLAY BUTTON (PLAY AYAT TERAKHIR DIKLIK / BOOKMARK)
    if (btnGlobalPlay) {
      btnGlobalPlay.addEventListener("click", function () {
        if (globalPlaying && globalPlaying.container === root) {
          // toggle pause/play
          if (!globalAudio.paused) {
            globalAudio.pause();
            btnGlobalPlay.querySelector("span").textContent = "▶";
            if (audioStatus) audioStatus.textContent = "Dijeda.";
          } else {
            globalAudio.play();
            btnGlobalPlay.querySelector("span").textContent = "⏸";
            if (audioStatus) audioStatus.textContent = "Sedang dimainkan.";
          }
          return;
        }

        const fromBookmark = loadBookmark(surahId);
        let targetAyah = null;

        if (fromBookmark) {
          targetAyah = list.querySelector(
            '.ilmu-quran-ayah[data-ayah="' + fromBookmark + '"]'
          );
        }

        if (!targetAyah) {
          targetAyah = list.querySelector(".ilmu-quran-ayah[data-audio]");
        }

        if (!targetAyah) {
          toastBrief("Tiada audio untuk ayat ini.", root);
          return;
        }

        const audioUrl = targetAyah.getAttribute("data-audio");
        playAyahAudio(root, targetAyah, audioUrl, audioStatus);

        btnGlobalPlay.querySelector("span").textContent = "⏸";
      });
    }

    // TOGGLE TRANSLIT / MS
    if (toggleTranslit) {
      toggleTranslit.addEventListener("click", function () {
        const isActive = toggleTranslit.classList.toggle("is-active");
        root
          .querySelectorAll('[data-role="translit"]')
          .forEach(function (el) {
            el.style.display = isActive ? "" : "none";
          });
      });
    }

    if (toggleMs) {
      toggleMs.addEventListener("click", function () {
        const isActive = toggleMs.classList.toggle("is-active");
        root.querySelectorAll('[data-role="ms"]').forEach(function (el) {
          el.style.display = isActive ? "" : "none";
        });
      });
    }
  }

  function playAyahAudio(root, li, audioUrl, audioStatus) {
    if (!audioUrl || !globalAudio) return;

    if (globalPlaying && globalPlaying.container === root) {
      setActiveAyah(root, null);
    }

    globalAudio.src = audioUrl;
    globalAudio
      .play()
      .then(function () {
        globalPlaying = {
          container: root,
          ayahNumber: li.getAttribute("data-ayah")
        };
        setActiveAyah(root, globalPlaying.ayahNumber);
        if (audioStatus) {
          audioStatus.textContent =
            "Memainkan ayat " + globalPlaying.ayahNumber + ".";
        }
      })
      .catch(function (err) {
        console.error("play error:", err);
        toastBrief("Audio tidak dapat dimainkan.", root);
      });
  }

  function setActiveAyah(root, ayahNumber) {
    root.querySelectorAll(".ilmu-quran-ayah").forEach(function (el) {
      if (ayahNumber && el.getAttribute("data-ayah") === String(ayahNumber)) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    });
  }

  function saveBookmark(surahId, ayahNumber) {
    try {
      const key = "ilmuQuranBookmarks";
      const current = JSON.parse(localStorage.getItem(key) || "{}");
      current[surahId] = ayahNumber;
      localStorage.setItem(key, JSON.stringify(current));
    } catch (e) {
      console.warn("Bookmark error:", e);
    }
  }

  function loadBookmark(surahId) {
    try {
      const key = "ilmuQuranBookmarks";
      const current = JSON.parse(localStorage.getItem(key) || "{}");
      return current[surahId] || null;
    } catch (e) {
      return null;
    }
  }

  function toastBrief(msg, root) {
    let el = root.querySelector(".ilmu-quran-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "ilmu-quran-toast";
      el.style.position = "fixed";
      el.style.left = "50%";
      el.style.bottom = "16px";
      el.style.transform = "translateX(-50%)";
      el.style.padding = "6px 12px";
      el.style.fontSize = "0.8rem";
      el.style.borderRadius = "999px";
      el.style.background = "#0c3808";
      el.style.color = "#ffffff";
      el.style.zIndex = "9999";
      el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    setTimeout(function () {
      el.style.opacity = "0";
    }, 2000);
  }

  function injectJsonLd(root, surahId, info, verses) {
    try {
      const ld = {
        "@context": "https://schema.org",
        "@type": ["Article", "WebApplication"],
        "name":
          info.malayName +
          " – Bacaan Rumi, Arab, Terjemahan & Audio MP3 (Surah " +
          info.latinName +
          ")",
        "headline":
          info.malayName +
          " – Bacaan Rumi, Arab, Terjemahan & Audio MP3 (Surah " +
          info.latinName +
          ")",
        "description": info.shortDesc,
        "applicationCategory": "ReligiousApplication",
        "operatingSystem": "All",
        "inLanguage": "ms-MY",
        "url": window.location.href,
        "isAccessibleForFree": true,
        "keywords": info.mainKeywords,
        "about": [
          info.malayName,
          "Al-Quran",
          "Quran online",
          "bacaan rumi",
          "terjemahan Bahasa Melayu"
        ],
        "publisher": {
          "@type": "Organization",
          "name": "IlmuAlam.com",
          "url": "https://www.ilmualam.com"
        },
        "mainEntity": {
          "@type": "CreativeWork",
          "name": info.malayName,
          "alternateName": "Surah " + info.latinName,
          "position": surahId,
          "text": verses
            .slice(0, 5)
            .map(function (v) {
              return v.ms;
            })
            .join(" ")
        }
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(ld);
      root.appendChild(script);
    } catch (e) {
      console.warn("JSON-LD inject error:", e);
    }
  }

  function encodeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
