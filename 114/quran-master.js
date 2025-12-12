(function () {
  const API_BASE = 'https://api.alquran.cloud/v1';

  let allSurahs = [];
  let currentAudio = new Audio();
  let currentButtons = [];
  let currentSurahMeta = null;
  let playbackMode = 'single'; // 'single' | 'all'
  let currentIndex = -1;

  let deepLinkConfig = { surahKey: null, ayah: null };

  // ====== Helper: slugify surah name ======
  function slugify(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ====== Helper: parse deep link dari URL ======
  function parseDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const surahParam = params.get('surah');
    const ayahParam = params.get('ayah');

    if (surahParam) {
      const idPart = surahParam.split('-')[0];
      const surahId = parseInt(idPart, 10);
      if (!isNaN(surahId)) {
        deepLinkConfig.surahKey = surahId;
      }
    }
    if (ayahParam) {
      const ay = parseInt(ayahParam, 10);
      if (!isNaN(ay)) {
        deepLinkConfig.ayah = ay;
      }
    }
  }

  // ====== Once DOM ready ======
  document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('quran-app-container');
    if (!appContainer) return;

    const surahList = document.getElementById('surahList');
    const readerView = document.getElementById('readerView');
    const versesContainer = document.getElementById('versesContainer');
    const searchInput = document.getElementById('surahSearch');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const surahTitle = document.getElementById('surahTitle');
    const bismillah = document.getElementById('bismillah');
    const backBtn = document.getElementById('backBtn');

    const toggleTransliteration = document.getElementById('toggleTransliteration');
    const toggleTranslation = document.getElementById('toggleTranslation');
    const toggleAudio = document.getElementById('toggleAudio');

    const playAllBtn = document.getElementById('playAllBtn');
    const stopAllBtn = document.getElementById('stopAllBtn');
    const verseSearchInput = document.getElementById('verseSearch');

    parseDeepLink();

    // ===== 1. Fetch Surah List =====
    fetch(API_BASE + '/surah')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        allSurahs = data.data || [];
        renderSurahList(allSurahs);

        // Jika ada deep link, auto buka surah
        if (deepLinkConfig.surahKey) {
          var target = allSurahs.find(function (s) { return s.number === deepLinkConfig.surahKey; });
          if (target) {
            loadSurah(target, { targetAyah: deepLinkConfig.ayah });
          }
        }
      })
      .catch(function () {
        surahList.innerHTML =
          '<p style="text-align:center;color:red;">Gagal memuatkan data. Sila semak sambungan internet anda.</p>';
      });

    // ===== 2. Render Surah List =====
    function renderSurahList(surahs) {
      surahList.innerHTML = '';
      surahs.forEach(function (surah) {
        var card = document.createElement('div');
        card.className = 'surah-card';
        card.innerHTML =
          '<div style="display:flex;align-items:center;">' +
          '  <div class="surah-number">' + surah.number + '</div>' +
          '  <div class="surah-info">' +
          '    <h3>' + surah.englishName + '</h3>' +
          '    <p>' + surah.englishNameTranslation + ' • ' + surah.numberOfAyahs + ' Ayat</p>' +
          '  </div>' +
          '</div>' +
          '<div class="surah-arabic">' + surah.name.replace("سورة ", "") + '</div>';

        card.addEventListener('click', function () {
          loadSurah(surah);
        });
        surahList.appendChild(card);
      });
    }

    // ===== 3. Search Surah (header search input) =====
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        var term = e.target.value.toLowerCase().trim();
        var filtered = allSurahs.filter(function (s) {
          return (
            s.englishName.toLowerCase().indexOf(term) !== -1 ||
            s.englishNameTranslation.toLowerCase().indexOf(term) !== -1 ||
            s.number.toString() === term
          );
        });
        renderSurahList(filtered);
      });
    }

    // ===== 4. Settings Panel Toggle =====
    if (settingsBtn && settingsPanel) {
      settingsBtn.addEventListener('click', function () {
        settingsPanel.classList.toggle('hidden');
      });
    }

    function updateVisibility(cls, show) {
      var nodes = document.querySelectorAll(cls);
      nodes.forEach(function (el) {
        el.style.display = show ? 'block' : 'none';
      });
    }

    if (toggleTransliteration) {
      toggleTransliteration.addEventListener('change', function (e) {
        updateVisibility('.transliteration-text', e.target.checked);
      });
    }
    if (toggleTranslation) {
      toggleTranslation.addEventListener('change', function (e) {
        updateVisibility('.translation-text', e.target.checked);
      });
    }
    if (toggleAudio) {
      toggleAudio.addEventListener('change', function (e) {
        updateVisibility('.audio-btn-container', e.target.checked);
      });
    }

    // ===== 5. Load Surah Details =====
    async function loadSurah(surah, options) {
      options = options || {};
      deepLinkConfig = { surahKey: surah.number, ayah: options.targetAyah || null };
      currentSurahMeta = {
        number: surah.number,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation
      };

      surahList.classList.add('hidden');
      var headerWrap = document.querySelector('.search-box');
      if (headerWrap && headerWrap.parentElement) {
        headerWrap.parentElement.classList.add('hidden');
      }
      readerView.classList.remove('hidden');
      versesContainer.innerHTML = '<div class="loading-spinner">Sedang menyusun ayat...</div>';
      surahTitle.innerHTML =
        '<h2>' + surah.englishName + '</h2>' +
        '<p>' + surah.englishNameTranslation + ' • Surah ke-' + surah.number + '</p>';

      if (surah.number === 9) {
        bismillah.classList.add('hidden');
      } else {
        bismillah.classList.remove('hidden');
      }

      window.scrollTo(0, 0);

      try {
        var resp = await fetch(
          API_BASE + '/surah/' + surah.number + '/editions/quran-uthmani,ms.basmeih,en.transliteration'
        );
        var json = await resp.json();
        var data = json.data || [];
        var arabicData = data[0] || {};
        var malayData = data[1] || {};
        var rumiData = data[2] || {};

        renderVerses(arabicData.ayahs || [], malayData.ayahs || [], rumiData.ayahs || []);

        // Kalau deep link ada ayat -> focus
        if (options.targetAyah) {
          focusAyah(options.targetAyah);
        }

      } catch (e) {
        console.error(e);
        versesContainer.innerHTML =
          '<p style="text-align:center;color:red;">Ralat memuatkan surah. Cuba refresh semula.</p>';
      }
    }

    // ===== 6. Render Verses =====
    function renderVerses(arabic, malay, rumi) {
      versesContainer.innerHTML = '';
      var fragment = document.createDocumentFragment();
      var surahNameForText = currentSurahMeta ? currentSurahMeta.englishName : 'Surah';

      arabic.forEach(function (ayah, index) {
        var verseNum = ayah.numberInSurah;
        var textAr = ayah.text;
        var textRumi = (rumi[index] && rumi[index].text) || '';
        var textMy = (malay[index] && malay[index].text) || '';
        var globalAyah = ayah.number; // global ayah id (1-6236)

        var bookmarkKey = 'quran_bookmark_' + surahNameForText + '_' + verseNum;
        var isBookmarked = !!localStorage.getItem(bookmarkKey);
        var audioUrl = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/' + globalAyah + '.mp3';

        var verseDiv = document.createElement('div');
        verseDiv.className = 'verse-item';
        verseDiv.setAttribute('data-verse', verseNum);
        verseDiv.setAttribute('id', 'ayah-' + verseNum);

        verseDiv.innerHTML =
          '<div class="verse-top">' +
          '  <span class="verse-number">Ayat ' + verseNum + '</span>' +
          '  <div class="verse-actions">' +
          '    <button class="action-btn" aria-label="Salin Ayat" ' +
          '      onclick="copyVerse(\'' + surahNameForText.replace(/'/g, "\\'") + '\',' + verseNum + ', this)">' +
          '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
          '    </button>' +
          '    <button class="action-btn" aria-label="Kongsi Ayat" ' +
          '      onclick="shareVerse(\'' + surahNameForText.replace(/'/g, "\\'") + '\',' + verseNum + ')">' +
          '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>' +
          '    </button>' +
          '    <button class="action-btn ' + (isBookmarked ? 'bookmarked' : '') + '" aria-label="Bookmark Ayat" ' +
          '      onclick="toggleBookmark(\'' + surahNameForText.replace(/'/g, "\\'") + '\',' + verseNum + ', this)">' +
          '      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' + (isBookmarked ? 'fill="#ff9800"' : 'fill="none"') + ' stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>' +
          '    </button>' +
          '    <div class="audio-btn-container" style="display:' + (toggleAudio && toggleAudio.checked ? 'block' : 'none') + '">' +
          '      <button class="audio-btn" data-audio="' + audioUrl + '" aria-label="Mainkan ayat">' +
          '        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>' +
          '      </button>' +
          '    </div>' +
          '  </div>' +
          '</div>' +
          '<div class="arabic-text" id="ar-' + verseNum + '">' + textAr + '</div>' +
          '<div class="transliteration-text" id="rumi-' + verseNum + '" style="display:' + (toggleTransliteration && toggleTransliteration.checked ? 'block' : 'none') + ';">' + textRumi + '</div>' +
          '<div class="translation-text" id="my-' + verseNum + '" style="display:' + (toggleTranslation && toggleTranslation.checked ? 'block' : 'none') + ';">' + textMy + '</div>';

        fragment.appendChild(verseDiv);
      });

      versesContainer.appendChild(fragment);

      // Setup audio untuk setiap ayat
      setupAudioPlayers();

      // Search dalam surah
      if (verseSearchInput) {
        verseSearchInput.value = '';
      }
      initVerseSearch();
    }

    // ===== 7. Audio Manager (Single & Play All) =====
    function setupAudioPlayers() {
      currentButtons = Array.prototype.slice.call(
        document.querySelectorAll('.audio-btn')
      );
      currentButtons.forEach(function (btn, index) {
        btn.dataset.index = index;
        btn.addEventListener('click', function () {
          playbackMode = 'single';
          playVerseAtIndex(index);
        });
      });

      currentAudio.onended = function () {
        clearActiveVerse();
        if (playbackMode === 'all') {
          var nextIndex = currentIndex + 1;
          if (nextIndex < currentButtons.length) {
            playVerseAtIndex(nextIndex);
          } else {
            playbackMode = 'single';
          }
        }
      };

      if (playAllBtn) {
        playAllBtn.onclick = function () {
          if (!currentButtons.length) return;
          playbackMode = 'all';
          playVerseAtIndex(0);
        };
      }
      if (stopAllBtn) {
        stopAllBtn.onclick = function () {
          playbackMode = 'single';
          stopAudio();
        };
      }
    }

    function clearActiveVerse() {
      currentButtons.forEach(function (b) { b.classList.remove('playing'); });
      var items = document.querySelectorAll('.verse-item.active-verse');
      items.forEach(function (item) {
        item.classList.remove('active-verse');
      });
    }

    function stopAudio() {
      try { currentAudio.pause(); } catch (e) {}
      clearActiveVerse();
      currentIndex = -1;
    }

    function playVerseAtIndex(index) {
      if (!currentButtons[index]) return;

      var btn = currentButtons[index];
      var url = btn.getAttribute('data-audio');

      clearActiveVerse();

      currentIndex = index;
      currentAudio.src = url;
      currentAudio.play().catch(function (e) {
        console.error(e);
      });
      btn.classList.add('playing');

      var verseItem = btn.closest('.verse-item');
      if (verseItem) {
        verseItem.classList.add('active-verse');
        verseItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // ===== 8. Search dalam Surah =====
    function initVerseSearch() {
      if (!verseSearchInput) return;
      verseSearchInput.removeEventListener('input', handleVerseSearch);
      verseSearchInput.addEventListener('input', handleVerseSearch);
    }

    function handleVerseSearch(e) {
      var term = e.target.value.toLowerCase().trim();
      var items = document.querySelectorAll('.verse-item');

      items.forEach(function (item) {
        if (!term) {
          item.style.display = 'block';
          return;
        }
        var txt = item.innerText.toLowerCase();
        if (txt.indexOf(term) !== -1) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }

    // ===== 9. Back Navigation =====
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        stopAudio();
        readerView.classList.add('hidden');
        surahList.classList.remove('hidden');
        var headerWrap = document.querySelector('.search-box');
        if (headerWrap && headerWrap.parentElement) {
          headerWrap.parentElement.classList.remove('hidden');
        }
        window.scrollTo(0, 0);
      });
    }
  });

  // ====== Copy / Share / Bookmark (Global) ======

  function getVerseText(verseNum) {
    var arEl = document.getElementById('ar-' + verseNum);
    var rumiEl = document.getElementById('rumi-' + verseNum);
    var myEl = document.getElementById('my-' + verseNum);

    return {
      ar: arEl ? arEl.innerText : '',
      rumi: rumiEl ? rumiEl.innerText : '',
      my: myEl ? myEl.innerText : ''
    };
  }

  function showCopyFeedback(btn) {
    if (!btn) return;
    var originalHTML = btn.innerHTML;
    btn.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    setTimeout(function () {
      btn.innerHTML = originalHTML;
    }, 2000);
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (e) {
      console.error(e);
    }
    document.body.removeChild(textarea);
    showCopyFeedback(btn);
  }

  window.copyVerse = function (surahName, verseNum, btn) {
    var content = getVerseText(verseNum);
    var textToCopy =
      '*' + surahName + ' : Ayat ' + verseNum + '*\n\n' +
      content.ar + '\n\n' +
      content.rumi + '\n\n"' + content.my + '"\n\n' +
      '(Dipetik dari Al-Quran Online 30 Juzuk)';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(function () {
          showCopyFeedback(btn);
        })
        .catch(function () {
          fallbackCopy(textToCopy, btn);
        });
    } else {
      fallbackCopy(textToCopy, btn);
    }
  };

  function buildShareUrl(surahName, verseNum) {
    var params = new URLSearchParams(window.location.search);
    // Kalau ada deeplink surah sebelum ni, kekalkan.
    var currentSurahNumber = params.get('surah');
    var surahId = null;

    // Kita cuba baca dari global state yang disimpan pada URL (pattern: ?surah=2-al-baqarah)
    if (currentSurahNumber && currentSurahNumber.indexOf('-') > -1) {
      surahId = currentSurahNumber;
    } else if (currentSurahNumber && !isNaN(parseInt(currentSurahNumber, 10))) {
      // fallback lama kalau ada
      surahId = parseInt(currentSurahNumber, 10) + '-' + slugify(surahName);
    }

    if (!surahId) {
      // default kalau user buka dari main page tanpa param
      // (contoh: /p/quran-online.html)
      var baseSurahId = '1-' + slugify(surahName);
      surahId = baseSurahId;
    }

    var base = window.location.origin + window.location.pathname;
    return base + '?surah=' + surahId + '&ayah=' + verseNum + '#ayah-' + verseNum;
  }

  window.shareVerse = function (surahName, verseNum) {
    var content = getVerseText(verseNum);
    var url = buildShareUrl(surahName, verseNum);
    var textToShare =
      surahName + ' : Ayat ' + verseNum + '\n\n' +
      content.ar + '\n' + content.my + '\n\n' +
      'Baca penuh di: ' + url;

    if (navigator.share) {
      navigator.share({
        title: 'Al-Quran: ' + surahName + ' Ayat ' + verseNum,
        text: textToShare,
        url: url
      }).catch(function (err) {
        console.error(err);
      });
    } else {
      // Fallback: copy je ke clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToShare)
          .then(function () {
            alert('Pautan ayat telah disalin. Boleh tampal di WhatsApp / media sosial.');
          })
          .catch(function () {
            alert('Tidak dapat berkongsi secara automatik. Sila salin secara manual.');
          });
      } else {
        alert('Fungsi share tidak disokong. Sila salin secara manual.');
      }
    }
  };

  window.toggleBookmark = function (surahName, verseNum, btn) {
    var key = 'quran_bookmark_' + surahName + '_' + verseNum;
    var svg = btn.querySelector('svg');

    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      btn.classList.remove('bookmarked');
      if (svg) svg.setAttribute('fill', 'none');
    } else {
      localStorage.setItem(key, 'true');
      btn.classList.add('bookmarked');
      if (svg) svg.setAttribute('fill', '#ff9800');
    }
  };

  // Focus ayat (untuk deep link)
  window.focusAyah = function (verseNum) {
    var target = document.querySelector('.verse-item[data-verse="' + verseNum + '"]');
    if (target) {
      target.classList.add('focused-verse');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
})();
