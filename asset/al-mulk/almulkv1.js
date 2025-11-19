(function() {
  'use strict';
  
  // Surah Al-Mulk Data - All 30 Ayat
  const ALMULK_DATA = [
    {
      num: 1,
      arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      latin: "Tabaarakal lazee biyadihil mulku wa huwa 'alaa kulli syai'in qadeer",
      translation: "Maha Suci Allah yang di tangan-Nyalah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu."
    },
    {
      num: 2,
      arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
      latin: "Allazee khalaqal mawta walhayaata liyabluwakum ayyukum ahsanu 'amalaa wa huwal 'azeezul ghafoor",
      translation: "Yang menjadikan mati dan hidup, supaya Dia menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Maha Perkasa lagi Maha Pengampun."
    },
    {
      num: 3,
      arabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
      latin: "Allazee khalaqa sab'a samaawaatin tibaaqaa maa taraa fee khalqir rahmaani min tafaawut farji'il basara hal taraa min futoor",
      translation: "Yang telah menciptakan tujuh langit berlapis-lapis. Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pemurah sesuatu yang tidak seimbang. Maka lihatlah berulang-ulang, adakah kamu lihat sesuatu yang tidak seimbang?"
    },
    {
      num: 4,
      arabic: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
      latin: "Summar ji'il basara karratayni yanqalib ilaikal basaru khaasi'anw wa huwa haseer",
      translation: "Kemudian pandanglah sekali lagi niscaya penglihatanmu akan kembali kepadamu dengan tidak menemukan sesuatu cacat dan penglihatanmu itupun dalam keadaan payah."
    },
    {
      num: 5,
      arabic: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ",
      latin: "Wa laqad zayyanas samaa'ad dunyaa bimasaa beeha wa ja'alnaahaa rujoomal lisy syayaateeni wa a'tadnaa lahum 'azaabas sa'eer",
      translation: "Sesungguhnya Kami telah menghiasi langit yang dekat dengan bintang-bintang, dan Kami jadikan bintang-bintang itu alat-alat pelempar syaitan, dan Kami sediakan bagi mereka siksa neraka yang menyala-nyala."
    },
    {
      num: 6,
      arabic: "وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ الْمَصِيرُ",
      latin: "Wa lillazeena kafaroo birabbihim 'azaabu jahannama wa bi'sal maseer",
      translation: "Dan orang-orang yang kafir kepada Tuhannya, memperoleh azab Jahannam. Dan itulah seburuk-buruk tempat kembali."
    },
    {
      num: 7,
      arabic: "إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ",
      latin: "Izaa ulqoo feehaa sami'oo lahaa shaheeqanw wa hiya tafoor",
      translation: "Apabila mereka dilemparkan ke dalamnya mereka mendengar suara neraka yang mengerikan, sedang neraka itu menggelegak."
    },
    {
      num: 8,
      arabic: "تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ ۖ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ",
      latin: "Takaadu tamayyazu minal ghaizi kullamaa ulqiya feehaa fawjun sa'alahum khazanatuhaaa alam ya'tikum nazeer",
      translation: "Hampir-hampir (neraka) itu terpecah-pecah lantaran marah. Setiap kali dilemparkan ke dalamnya sekumpulan (orang-orang kafir), penjaga-penjaga (neraka itu) bertanya kepada mereka: \"Apakah belum pernah datang kepada kamu (di dunia) seorang pemberi peringatan?\""
    },
    {
      num: 9,
      arabic: "قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ",
      latin: "Qaaloo balaa qad jaaa'anaa nazeerun fakazzabnaa wa qulnaa maa nazzalal laahu min shai'in in antum illaa fee dalaalin kabeer",
      translation: "Mereka menjawab: \"Benar ada, sesungguhnya telah datang kepada kami seorang pemberi peringatan, maka kami mendustakan(nya) dan kami katakan: \"Allah tidak menurunkan sesuatupun; kamu tidak lain hanyalah di dalam kesesatan yang besar\"."
    },
    {
      num: 10,
      arabic: "وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ",
      latin: "Wa qaaloo law kunnaa nasma'u aw na'qilu maa kunnaa feee as haabis sa'eer",
      translation: "Dan mereka berkata: \"Sekiranya kami mendengarkan atau memikirkan (peringatan itu) niscaya tidaklah kami termasuk penghuni-penghuni neraka yang menyala-nyala\"."
    },
    {
      num: 11,
      arabic: "فَاعْتَرَفُوا بِذَنبِهِمْ فَسُحْقًا لِّأَصْحَابِ السَّعِيرِ",
      latin: "Fa'tarafoo bizambihim fasuhqal li as haabis sa'eer",
      translation: "Mereka mengakui dosa mereka. Maka kebinasaanlah bagi penghuni-penghuni neraka yang menyala-nyala."
    },
    {
      num: 12,
      arabic: "إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ",
      latin: "Innal lazeena yakhshawna rabbahum bilghaibi lahum maghfiratunw wa ajrun kabeer",
      translation: "Sesungguhnya orang-orang yang takut kepada Tuhannya yang tidak nampak oleh mereka, mereka akan memperoleh ampunan dan pahala yang besar."
    },
    {
      num: 13,
      arabic: "وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ",
      latin: "Wa asirroo qawlakum awijharoo bihee innahoo 'aleemum bizaatis sudoor",
      translation: "Dan rahasiakanlah perkataanmu atau lahirkanlah; sesungguhnya Dia Maha Mengetahui segala isi hati."
    },
    {
      num: 14,
      arabic: "أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ",
      latin: "Alaa ya'lamu man khalaq wa huwal lateeful khabeer",
      translation: "Apakah Allah yang menciptakan itu tidak mengetahui (yang kamu lahirkan atau rahasiakan); dan Dia Maha Halus lagi Maha Mengetahui?"
    },
    {
      num: 15,
      arabic: "هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ",
      latin: "Huwal lazee ja'ala lakumul arda zaloolan famshoo fee manaakibihaa wa kuloo mir rizqihee wa ilaihin nushoor",
      translation: "Dialah yang menjadikan bumi itu mudah bagi kamu, maka berjalanlah di segala penjurunya dan makanlah sebahagian dari rezeki-Nya. Dan hanya kepada-Nya-lah kamu (kembali setelah) dibangkitkan."
    },
    {
      num: 16,
      arabic: "أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ فَإِذَا هِيَ تَمُورُ",
      latin: "'A-amintum man fis samaaa'i ai yakhsifa bikumul arda fa izaa hiya tamoor",
      translation: "Apakah kamu merasa aman terhadap Allah yang (berkuasa) di langit bahwa Dia akan menjungkir balikkan bumi bersama kamu, sehingga dengan tiba-tiba bumi itu bergoncang?"
    },
    {
      num: 17,
      arabic: "أَمْ أَمِنتُم مَّن فِي السَّمَاءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ",
      latin: "Am amintum man fis samaaa'i ai yursila 'alaikum haasiban fasata'lamoona kaifa nazeer",
      translation: "Atau apakah kamu merasa aman terhadap Allah yang (berkuasa) di langit bahwa Dia akan mengirimkan badai yang berbatu. Maka kelak kamu akan mengetahui bagaimana (akibat mendustakan) peringatan-Ku?"
    },
    {
      num: 18,
      arabic: "وَلَقَدْ كَذَّبَ الَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ",
      latin: "Wa laqad kazzabal lazeena min qablihim fakaifa kaana nakeer",
      translation: "Dan sesungguhnya orang-orang yang sebelum mereka telah mendustakan (rasul-rasul-Nya). Maka alangkah hebatnya kemurkaan-Ku."
    },
    {
      num: 19,
      arabic: "أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ ۚ إِنَّهُ بِكُلِّ شَيْءٍ بَصِيرٌ",
      latin: "Awalam yaraw ilat tairi fawqahum saaaffaatinw wa yaqbidna maa yumsikuhunna illar rahmaan innahoo bikulli shai'im baseer",
      translation: "Dan apakah mereka tidak memperhatikan burung-burung yang mengembangkan dan mengatupkan sayapnya di atas mereka? Tidak ada yang menahannya (di udara) selain Yang Maha Pemurah. Sesungguhnya Dia Maha Melihat segala sesuatu."
    },
    {
      num: 20,
      arabic: "أَمَّنْ هَٰذَا الَّذِي هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ الرَّحْمَٰنِ ۚ إِنِ الْكَافِرُونَ إِلَّا فِي غُرُورٍ",
      latin: "Amman haazal lazee huwa jundul lakum yansurukum min doonir rahmaan inilkaafiroona illaa fee ghuroor",
      translation: "Atau siapakah dia yang menjadi tentara bagimu yang akan menolongmu selain dari Yang Maha Pemurah? Orang-orang kafir itu tidak lain hanyalah dalam (keadaan) tertipu."
    },
    {
      num: 21,
      arabic: "أَمَّنْ هَٰذَا الَّذِي يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُ ۚ بَل لَّجُّوا فِي عُتُوٍّ وَنُفُورٍ",
      latin: "Amman haazal lazee yarzuqukum in amsaka rizqah bal lajjoo fee 'utuwwinw wa nufoor",
      translation: "Atau siapakah dia yang memberi kamu rezeki jika Allah menahan rezeki-Nya? Sebenarnya mereka terus menerus dalam kesombongan dan menjauhkan diri?"
    },
    {
      num: 22,
      arabic: "أَفَمَن يَمْشِي مُكِبًّا عَلَىٰ وَجْهِهِ أَهْدَىٰ أَمَّن يَمْشِي سَوِيًّا عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ",
      latin: "Afamai yamshee mukibban 'alaa wajhihee ahdaaa ammay yamshee sawiyyan 'alaa siratim mustaqeem",
      translation: "Maka apakah orang yang berjalan terjungkal di atas mukanya itu lebih banyak mendapatkan petunjuk ataukah orang yang berjalan tegap di atas jalan yang lurus?"
    },
    {
      num: 23,
      arabic: "قُلْ هُوَ الَّذِي أَنشَأَكُمْ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ",
      latin: "Qul huwal lazee ansha akum wa ja'ala lakumus sam'a wal absaara wal af'idata qaleelam maa tashkuroon",
      translation: "Katakanlah: \"Dialah yang menciptakan kamu dan menjadikan bagi kamu pendengaran, penglihatan dan hati\". (Tetapi) amat sedikit kamu bersyukur."
    },
    {
      num: 24,
      arabic: "قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ",
      latin: "Qul huwal lazee zara akum fil ardi wa ilaihi tuhsharoon",
      translation: "Katakanlah: \"Dialah yang menjadikan kamu berkembang biak di muka bumi, dan hanya kepada-Nya-lah kamu kelak dikumpulkan\"."
    },
    {
      num: 25,
      arabic: "وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ",
      latin: "Wa yaqooloona mataa haazal wa'du in kuntum saadiqeen",
      translation: "Dan mereka berkata: \"Bilakah datangnya ancaman itu, jika kamu adalah orang-orang yang benar?\"."
    },
    {
      num: 26,
      arabic: "قُلْ إِنَّمَا الْعِلْمُ عِندَ اللَّهِ وَإِنَّمَا أَنَا نَذِيرٌ مُّبِينٌ",
      latin: "Qul innamal 'ilmu 'indallaahi wa innamaaa ana nazeerum mubeen",
      translation: "Katakanlah: \"Sesungguhnya ilmu (tentang hari Kiamat itu) hanya pada sisi Allah. Dan sesungguhnya aku hanyalah seorang pemberi peringatan yang menjelaskan\"."
    },
    {
      num: 27,
      arabic: "فَلَمَّا رَأَوْهُ زُلْفَةً سِيئَتْ وُجُوهُ الَّذِينَ كَفَرُوا وَقِيلَ هَٰذَا الَّذِي كُنتُم بِهِ تَدَّعُونَ",
      latin: "Falammaa ra awhu zulfatan seee'at wujoohul lazeena kafaroo wa qeela haazal lazee kuntum bihee tadda'oon",
      translation: "Ketika mereka melihat azab (pada hari Kiamat) sudah dekat, muka orang-orang kafir itu menjadi muram. Dan dikatakan (kepada mereka): \"Inilah (azab) yang dahulu kamu minta\"."
    },
    {
      num: 28,
      arabic: "قُلْ أَرَأَيْتُمْ إِنْ أَهْلَكَنِيَ اللَّهُ وَمَن مَّعِيَ أَوْ رَحِمَنَا فَمَن يُجِيرُ الْكَافِرِينَ مِنْ عَذَابٍ أَلِيمٍ",
      latin: "Qul ara'aytum in ahlaka niyallaahu wa mam ma'iya aw rahimanaa famai-yujeerul kaafireena min 'azaabin aleem",
      translation: "Katakanlah: \"Terangkanlah kepadaku jika Allah mematikan aku dan orang-orang yang bersama dengan aku atau memberi rahmat kepada kami, (maka kami akan masuk syurga), tetapi siapakah yang dapat melindungi orang-orang kafir dari siksa yang pedih?\"."
    },
    {
      num: 29,
      arabic: "قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِي ضَلَالٍ مُّبِينٍ",
      latin: "Qul huwar rahmaanu aamannaa bihee wa 'alaihi tawakkalnaa fasata'lamoona man huwa fee dalaalim mubeen",
      translation: "Katakanlah: \"Dialah Allah Yang Maha Penyayang, kami beriman kepada-Nya dan kepada-Nya-lah kami bertawakal. Kelak kamu akan mengetahui siapakah yang berada dalam kesesatan yang nyata\"."
    },
    {
      num: 30,
      arabic: "قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ",
      latin: "Qul ara'aytum in asbaha maaa'ukum ghawran famai ya'teekum bimaaa'im ma'een",
      translation: "Katakanlah: \"Terangkanlah kepadaku jika sumber air kamu menjadi kering; maka siapakah yang akan mendatangkan air yang mengalir bagimu?\"."
    }
  ];
  
  // Audio base URL
  const AUDIO_BASE = 'https://api.alquran.cloud/v1/surah/67/editions/ar.alafasy,ms.basmeih,en.transliteration';
  const SURAH_START = 5545; // First ayat of Al-Mulk in global numbering
  
  // State
  let currentAyat = 0;
  let isPlaying = false;
  let autoPlay = false;
  
  // DOM Elements
  const reader = document.getElementById('almulkReader');
  const ayatList = document.getElementById('almulkAyatList');
  const audio = document.getElementById('almulkAudio');
  const playBtn = document.getElementById('almulkPlayAll');
  const playIcon = document.getElementById('almulkPlayIcon');
  const prevBtn = document.getElementById('almulkPrev');
  const nextBtn = document.getElementById('almulkNext');
  const progressFill = document.getElementById('almulkProgress');
  const progressText = document.getElementById('almulkProgressText');
  const darkModeBtn = document.getElementById('almulkDarkMode');
  const bookmarkBtn = document.getElementById('almulkBookmark');
  const toast = document.getElementById('almulkToast');
  
  // Initialize
  function init() {
    renderAyatList();
    loadBookmark();
    setupEventListeners();
    updateProgress();
  }
  
  // Render all ayat
  function renderAyatList() {
    ayatList.innerHTML = ALMULK_DATA.map((ayat, idx) => `
      <div class="almulk-ayat-item" data-idx="${idx}">
        <span class="almulk-ayat-num">${ayat.num}</span>
        <div class="almulk-arabic">${ayat.arabic}</div>
        <div class="almulk-latin">${ayat.latin}</div>
        <div class="almulk-translation">${ayat.translation}</div>
        <div class="almulk-ayat-actions">
          <button class="almulk-ayat-btn" onclick="almulkPlayAyat(${idx})">▶ Play</button>
          <button class="almulk-ayat-btn" onclick="almulkCopyAyat(${idx})">📋 Copy</button>
          <button class="almulk-ayat-btn" onclick="almulkShareAyat(${idx})">📤 Share</button>
        </div>
      </div>
    `).join('');
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Play all button
    playBtn.addEventListener('click', togglePlayAll);
    
    // Navigation
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    
    // Dark mode
    darkModeBtn.addEventListener('click', toggleDarkMode);
    
    // Bookmark
    bookmarkBtn.addEventListener('click', saveBookmark);
    
    // Audio events
    audio.addEventListener('ended', onAudioEnded);
    audio.addEventListener('error', onAudioError);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Click on ayat to play
    ayatList.addEventListener('click', (e) => {
      const item = e.target.closest('.almulk-ayat-item');
      if (item && !e.target.closest('.almulk-ayat-btn')) {
        const idx = parseInt(item.dataset.idx);
        playAyat(idx);
      }
    });
  }
  
  // Play specific ayat
  function playAyat(idx) {
    if (idx < 0 || idx >= ALMULK_DATA.length) return;
    
    currentAyat = idx;
    const globalNum = SURAH_START + idx;
    
    // Update audio source
    audio.src = `${AUDIO_BASE}${globalNum}.mp3`;
    audio.play().catch(e => console.warn('Audio play failed:', e));
    
    isPlaying = true;
    updateUI();
    scrollToAyat(idx);
  }
  
  // Toggle play all
  function togglePlayAll() {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      autoPlay = false;
    } else {
      autoPlay = true;
      playAyat(currentAyat);
    }
    updateUI();
  }
  
  // Play previous
  function playPrevious() {
    if (currentAyat > 0) {
      autoPlay = true;
      playAyat(currentAyat - 1);
    }
  }
  
  // Play next
  function playNext() {
    if (currentAyat < ALMULK_DATA.length - 1) {
      autoPlay = true;
      playAyat(currentAyat + 1);
    }
  }
  
  // Audio ended handler
  function onAudioEnded() {
    if (autoPlay && currentAyat < ALMULK_DATA.length - 1) {
      playAyat(currentAyat + 1);
    } else {
      isPlaying = false;
      autoPlay = false;
      updateUI();
      if (currentAyat === ALMULK_DATA.length - 1) {
        showToast('✅ Tamat bacaan Surah Al-Mulk');
      }
    }
  }
  
  // Audio error handler
  function onAudioError() {
    showToast('⚠️ Gagal memuatkan audio. Cuba semula.');
    isPlaying = false;
    updateUI();
  }
  
  // Update UI state
  function updateUI() {
    // Update play button
    playIcon.textContent = isPlaying ? '⏸' : '▶';
    
    // Highlight current ayat
    document.querySelectorAll('.almulk-ayat-item').forEach((item, idx) => {
      item.classList.toggle('almulk-playing', idx === currentAyat && isPlaying);
    });
    
    updateProgress();
  }
  
  // Update progress
  function updateProgress() {
    const percent = ((currentAyat + 1) / ALMULK_DATA.length) * 100;
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `Ayat ${currentAyat + 1} / ${ALMULK_DATA.length}`;
  }
  
  // Scroll to ayat
  function scrollToAyat(idx) {
    const items = document.querySelectorAll('.almulk-ayat-item');
    if (items[idx]) {
      items[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  // Toggle dark mode
  function toggleDarkMode() {
    reader.classList.toggle('almulk-dark');
    const isDark = reader.classList.contains('almulk-dark');
    localStorage.setItem('almulk-dark', isDark);
    showToast(isDark ? '🌙 Mod gelap diaktifkan' : '☀️ Mod cerah diaktifkan');
  }
  
  // Save bookmark
  function saveBookmark() {
    localStorage.setItem('almulk-bookmark', currentAyat);
    showToast(`🔖 Ditanda pada Ayat ${currentAyat + 1}`);
  }
  
  // Load bookmark
  function loadBookmark() {
    const saved = localStorage.getItem('almulk-bookmark');
    if (saved) {
      currentAyat = parseInt(saved);
      updateProgress();
      setTimeout(() => scrollToAyat(currentAyat), 500);
    }
    
    // Load dark mode preference
    if (localStorage.getItem('almulk-dark') === 'true') {
      reader.classList.add('almulk-dark');
    }
  }
  
  // Keyboard handler
  function handleKeyboard(e) {
    // Only handle if reader is visible
    if (!isElementInViewport(reader)) return;
    
    switch(e.key) {
      case ' ':
        e.preventDefault();
        togglePlayAll();
        break;
      case 'ArrowLeft':
        playPrevious();
        break;
      case 'ArrowRight':
        playNext();
        break;
      case 'd':
      case 'D':
        toggleDarkMode();
        break;
      case 'b':
      case 'B':
        saveBookmark();
        break;
    }
  }
  
  // Check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  // Show toast notification
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('almulk-show');
    setTimeout(() => toast.classList.remove('almulk-show'), 2500);
  }
  
  // Global functions for inline onclick
  window.almulkPlayAyat = playAyat;
  
  window.almulkCopyAyat = function(idx) {
    const ayat = ALMULK_DATA[idx];
    const text = `${ayat.arabic}\n\n${ayat.latin}\n\n${ayat.translation}\n\n- Surah Al-Mulk, Ayat ${ayat.num}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Ayat disalin!');
      });
    } else {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('📋 Ayat disalin!');
    }
  };
  
  window.almulkShareAyat = function(idx) {
    const ayat = ALMULK_DATA[idx];
    const text = `${ayat.arabic}\n\n${ayat.translation}\n\n- Surah Al-Mulk, Ayat ${ayat.num}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Surah Al-Mulk - Ayat ${ayat.num}`,
        text: text,
        url: window.location.href
      });
    } else {
      window.almulkCopyAyat(idx);
      showToast('📤 Link disalin untuk dikongsi');
    }
  };
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
