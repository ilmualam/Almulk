/**
 * Surah Taha Interactive Tool
 * Copyright © 2025 ilmualam.com
 * 
 * This code is proprietary and confidential.
 * Unauthorized copying, distribution, or modification is strictly prohibited.
 * Licensed exclusively for use on ilmualam.com
 * 
 * @author ilmualam.com
 * @version 2.0.0
 * @license Proprietary
 */

(function() {
  'use strict';

  // Domain protection
  const ALLOWED_DOMAIN = 'ilmualam.com';
  if (!window.location.hostname.includes(ALLOWED_DOMAIN) && 
      !window.location.hostname.includes('localhost')) {
    console.error('Unauthorized domain. This tool is licensed for ilmualam.com only.');
    return;
  }

  // Surah Taha Data (135 verses)
  const surahData = [
  {
    number: 1,
    arabic: "طه",
    transliteration: "Ṭā Hā",
    translation: "Ṭā Hā."
  },
  {
    number: 2,
    arabic: "مَآ أَنزَلْنَا عَلَيْكَ ٱلْقُرْءَانَ لِتَشْقَىٰٓ",
    transliteration: "Mā anzalnā 'alayka al-Qur'āna litashqā",
    translation: "Kami tidak menurunkan Al-Quran ini kepadamu (wahai Muhammad) agar engkau menjadi susah,"
  },
  {
    number: 3,
    arabic: "إِلَّا تَذْكِرَةً لِّمَن يَخْشَىٰ",
    transliteration: "Illā tadhkiratan liman yakhshā",
    translation: "Tetapi sebagai peringatan bagi orang yang takut (kepada Allah),"
  },
  {
    number: 4,
    arabic: "تَنزِيلًا مِّمَّنْ خَلَقَ ٱلْأَرْضَ وَٱلسَّمَـٰوَٰتِ ٱلْعُلَى",
    transliteration: "Tanzīlan mimman khalaqa al-arḍa was-samāwāti al-'ulā",
    translation: "Diturunkan dari Tuhan yang menciptakan bumi dan langit yang tinggi,"
  },
  {
    number: 5,
    arabic: "ٱلرَّحْمَـٰنُ عَلَى ٱلْعَرْشِ ٱسْتَوَىٰ",
    transliteration: "Ar-Raḥmānu 'ala al-'arshi istawā",
    translation: "(Iaitu) Ar-Rahman (Yang Maha Pemurah) yang beristiwa di atas 'Arasy."
  },
  {
    number: 6,
    arabic: "لَهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ وَمَا بَيْنَهُمَا وَمَا تَحْتَ ٱلثَّرَىٰ",
    transliteration: "Lahū mā fī as-samāwāti wa mā fī al-arḍi wa mā baynahumā wa mā taḥta ath-tharā",
    translation: "Bagi-Nya segala yang ada di langit dan di bumi, dan segala yang ada di antara keduanya, dan segala yang ada di bawah tanah."
  },
  {
    number: 7,
    arabic: "وَإِن تَجْهَرْ بِٱلْقَوْلِ فَإِنَّهُۥ يَعْلَمُ ٱلسِّرَّ وَأَخْفَى",
    transliteration: "Wa in tajhar bil-qawli fa innahū ya'lamu as-sirra wa akhfā",
    translation: "Dan jika engkau mengeraskan suara (dalam berdoa atau membaca Al-Quran), maka sesungguhnya Dia mengetahui rahsia dan yang lebih tersembunyi."
  },
  {
    number: 8,
    arabic: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ۖ لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ",
    transliteration: "Allāhu lā ilāha illā huwa lahul-asmā'ul-ḥusnā",
    translation: "Allah, tiada Tuhan melainkan Dia. Bagi-Nya nama-nama yang terbaik (Asma'ul Husna)."
  },
  {
    number: 9,
    arabic: "وَهَلْ أَتَىٰكَ حَدِيثُ مُوسَىٰٓ",
    transliteration: "Wa hal atāka ḥadīthu Mūsā",
    translation: "Dan sudahkah sampai kepadamu (wahai Muhammad) cerita tentang Nabi Musa?"
  },
  {
    number: 10,
    arabic: "إِذْ رَءَا نَارًا فَقَالَ لِأَهْلِهِ ٱمْكُثُوٓا۟ إِنِّىٓ ءَانَسْتُ نَارًا لَّعَلِّىٓ ءَاتِيكُم مِّنْهَا بِقَبَسٍ أَوْ أَجِدُ عَلَى ٱلنَّارِ هُدًى",
    transliteration: "Idh ra'ā nāran faqāla li'ahlihi umkuthū innī ānastu nāran la'allī ātīkum minhā biqabasin aw ajidu 'alan-nāri hudā",
    translation: "Ketika dia melihat api, lalu dia berkata kepada keluarganya: 'Tinggallah kamu (di sini), sesungguhnya aku melihat api, mudah-mudahan aku dapat membawa sedikit api untukmu atau aku dapat petunjuk di tempat api itu.'"
  },
  {
    number: 11,
    arabic: "فَلَمَّآ أَتَىٰهَا نُودِىَ يَـٰمُوسَىٰٓ",
    transliteration: "Falammā atāhā nūdiya yā Mūsā",
    translation: "Maka tatkala dia datang ke tempat api itu, dipanggillah dia: 'Wahai Musa!'"
  },
  {
    number: 12,
    arabic: "إِنِّىٓ أَنَا۠ رَبُّكَ فَٱخْلَعْ نَعْلَيْكَ ۖ إِنَّكَ بِٱلْوَادِ ٱلْمُقَدَّسِ طُوًى",
    transliteration: "Innī ana rabbuka fakhla' na'layka innaka bil-wādil-muqaddasi Ṭuwā",
    translation: "Sesungguhnya Aku ini Tuhanmu, maka tanggalkanlah kedua-dua sepatumu; sesungguhnya engkau berada di lembah suci Tuwa."
  },
  {
    number: 13,
    arabic: "وَأَنَا ٱخْتَرْتُكَ فَٱسْتَمِعْ لِمَا يُوحَىٰٓ",
    transliteration: "Wa ana ikhtartuka fastami' limā yūḥā",
    translation: "Dan Aku telah memilihmu, maka dengarlah apa yang akan diwahyukan (kepadamu)."
  },
  {
    number: 14,
    arabic: "إِنَّنِىٓ أَنَا ٱللَّهُ لَآ إِلَـٰهَ إِلَّآ أَنَا۠ فَٱعْبُدْنِى وَأَقِمِ ٱلصَّلَوٰةَ لِذِكْرِىٓ",
    transliteration: "Innanī ana Allāhu lā ilāha illā ana fa'budnī wa aqimi aṣ-ṣalāta lidhikrī",
    translation: "Sesungguhnya Aku adalah Allah, tiada Tuhan selain Aku, maka sembahlah Aku dan dirikanlah solat untuk mengingati Aku."
  },
  {
    number: 15,
    arabic: "إِنَّ ٱلسَّاعَةَ ءَاتِيَةٌ أَكَادُ أُخْفِيهَا لِتُجْزَىٰ كُلُّ نَفْسٍۭ بِمَا تَسْعَىٰ",
    transliteration: "Inna as-sā'ata ātiyatun akādu ukhfīhā litujzā kullu nafsin bimā tas'ā",
    translation: "Sesungguhnya Hari Kiamat itu akan datang, Aku merahasiakan (waktunya), supaya setiap diri diberi balasan dengan apa yang diusahakannya."
  },
  {
    number: 16,
    arabic: "فَلَا يَصُدَّنَّكَ عَنْهَا مَن لَّا يُؤْمِنُ بِهَا وَٱتَّبَعَ هَوَىٰهُ فَتَرْدَىٰ",
    transliteration: "Falā yaṣuddannaka 'anhā man lā yu'minu bihā wattaba'a hawāhu fatardā",
    translation: "Maka janganlah sekali-kali engkau dipalingkan daripadanya oleh orang yang tidak beriman kepadanya dan mengikut hawa nafsunya yang menyebabkan engkau binasa."
  },
  {
    number: 17,
    arabic: "وَمَا تِلْكَ بِيَمِينِكَ يَـٰمُوسَىٰ",
    transliteration: "Wa mā tilka biyamīnika yā Mūsā",
    translation: "Dan apakah itu yang di tangan kananmu, wahai Musa?"
  },
  {
    number: 18,
    arabic: "قَالَ هِىَ عَصَاىَ أَتَوَكَّؤُا۟ عَلَيْهَا وَأَهُشُّ بِهَا عَلَىٰ غَنَمِى وَلِىَ فِيهَا مَـَٔارِبُ أُخْرَىٰ",
    transliteration: "Qāla hiya 'aṣāya atawakka'u 'alayhā wa ahushshu bihā 'alā ghanamī wa liya fīhā ma'āribu ukhrā",
    translation: "Musa menjawab: 'Ini adalah tongkatku, aku bertelekan padanya, dan aku memukulkan tongkat itu untuk (menggugurkan daun) kepada kambing-kambingku, dan lagi bagiku padanya ada keperluan-keperluan yang lain.'"
  },
  {
    number: 19,
    arabic: "قَالَ أَلْقِهَا يَـٰمُوسَىٰ",
    transliteration: "Qāla alqihā yā Mūsā",
    translation: "Allah berfirman: 'Lemparkanlah ia, wahai Musa!'"
  },
  {
    number: 20,
    arabic: "فَأَلْقَىٰهَا فَإِذَا هِىَ حَيَّةٌ تَسْعَىٰ",
    transliteration: "Fa'alqāhā fa'idhā hiya ḥayyatun tas'ā",
    translation: "Maka dilemparkannya tongkat itu, tiba-tiba ia menjadi seekor ular yang merayap dengan cepat."
  },
  {
    number: 21,
    arabic: "قَالَ خُذْهَا وَلَا تَخَفْ ۖ سَنُعِيدُهَا سِيرَتَهَا ٱلْأُولَىٰ",
    transliteration: "Qāla khudhhā wa lā takhaf sanu'īduhā sīratahā al-ūlā",
    translation: "Allah berfirman: 'Peganglah ia dan jangan takut, Kami akan mengembalikannya kepada keadaan semula.'"
  },
  {
    number: 22,
    arabic: "وَٱضْمُمْ يَدَكَ إِلَىٰ جَنَاحِكَ تَخْرُجْ بَيْضَآءَ مِنْ غَيْرِ سُوٓءٍ ءَايَةً أُخْرَىٰ",
    transliteration: "Wadhmum yadaka ilā janāḥika takhruj bayḍā'a min ghayri sū'in āyatan ukhrā",
    translation: "Dan kepitkan tanganmu ke ketiakmu, nescaya ia keluar (menjadi) putih bercahaya tanpa cacat, sebagai mukjizat yang lain (pula),"
  },
  {
    number: 23,
    arabic: "لِنُرِيَكَ مِنْ ءَايَـٰتِنَا ٱلْكُبْرَى",
    transliteration: "Linuriyaka min āyātinal-kubrā",
    translation: "Supaya Kami memperlihatkan kepadamu sebahagian dari tanda-tanda kekuasaan Kami yang besar."
  },
  {
    number: 24,
    arabic: "ٱذْهَبْ إِلَىٰ فِرْعَوْنَ إِنَّهُۥ طَغَىٰ",
    transliteration: "Idhhab ilā Fir'awna innahū ṭaghā",
    translation: "Pergilah kepada Firaun, sesungguhnya dia telah melampaui batas."
  },
  {
    number: 25,
    arabic: "قَالَ رَبِّ ٱشْرَحْ لِى صَدْرِى",
    transliteration: "Qāla rabbi ishraḥ lī ṣadrī",
    translation: "Musa berdoa: 'Ya Tuhanku, lapangkanlah dadaku (hati)ku,'"
  },
  {
    number: 26,
    arabic: "وَيَسِّرْ لِىٓ أَمْرِى",
    transliteration: "Wa yassir lī amrī",
    translation: "Dan mudahkanlah urusanku,"
  },
  {
    number: 27,
    arabic: "وَٱحْلُلْ عُقْدَةً مِّن لِّسَانِى",
    transliteration: "Wahlul 'uqdatan min lisānī",
    translation: "Dan lepaskanlah kekakuan dari lidahku,"
  },
  {
    number: 28,
    arabic: "يَفْقَهُوا۟ قَوْلِى",
    transliteration: "Yafqahū qawlī",
    translation: "Supaya mereka memahami perkataanku."
  },
  {
    number: 29,
    arabic: "وَٱجْعَل لِّى وَزِيرًا مِّنْ أَهْلِى",
    transliteration: "Waj'al lī wazīran min ahlī",
    translation: "Dan jadikanlah bagiku seorang pembantu dari keluargaku,"
  },
  {
    number: 30,
    arabic: "هَـٰرُونَ أَخِى",
    transliteration: "Hārūna akhī",
    translation: "Iaitu Harun, saudaraku,"
  },
  {
    number: 31,
    arabic: "ٱشْدُدْ بِهِۦٓ أَزْرِى",
    transliteration: "Ushdud bihī azrī",
    translation: "Teguhkanlah dengan dia kekuatanku,"
  },
  {
    number: 32,
    arabic: "وَأَشْرِكْهُ فِىٓ أَمْرِى",
    transliteration: "Wa ashrikhu fī amrī",
    translation: "Dan jadikanlah dia sekutu dalam urusanku,"
  },
  {
    number: 33,
    arabic: "كَىْ نُسَبِّحَكَ كَثِيرًا",
    transliteration: "Kay nusabbiḥaka kathīrā",
    translation: "Agar kami banyak bertasbih kepada-Mu,"
  },
  {
    number: 34,
    arabic: "وَنَذْكُرَكَ كَثِيرًا",
    transliteration: "Wa nadhkuraka kathīrā",
    translation: "Dan banyak mengingati-Mu."
  },
  {
    number: 35,
    arabic: "إِنَّكَ كُنتَ بِنَا بَصِيرًا",
    transliteration: "Innaka kunta binā baṣīrā",
    translation: "Sesungguhnya Engkau Maha Melihat (keadaan) kami.'"
  },
  {
    number: 36,
    arabic: "قَالَ قَدْ أُوتِيتَ سُؤْلَكَ يَـٰمُوسَىٰ",
    transliteration: "Qāla qad ūtīta su'laka yā Mūsā",
    translation: "Allah berfirman: 'Sesungguhnya telah dikabulkan permintaanmu, wahai Musa.'"
  },
  {
    number: 37,
    arabic: "وَلَقَدْ مَنَنَّا عَلَيْكَ مَرَّةً أُخْرَىٰٓ",
    transliteration: "Wa laqad manannā 'alayka marratan ukhrā",
    translation: "Dan sesungguhnya Kami telah memberi nikmat kepadamu pada kali yang lain,"
  },
  {
    number: 38,
    arabic: "إِذْ أَوْحَيْنَآ إِلَىٰٓ أُمِّكَ مَا يُوحَىٰٓ",
    transliteration: "Idh awḥaynā ilā ummika mā yūḥā",
    translation: "Iaitu ketika Kami wahyukan kepada ibumu suatu wahyu,"
  },
  {
    number: 39,
    arabic: "أَنِ ٱقْذِفِيهِ فِى ٱلتَّابُوتِ فَٱقْذِفِيهِ فِى ٱلْيَمِّ فَلْيُلْقِهِ ٱلْيَمُّ بِٱلسَّاحِلِ يَأْخُذْهُ عَدُوٌّ لِّى وَعَدُوٌّ لَّهُۥ ۚ وَأَلْقَيْتُ عَلَيْكَ مَحَبَّةً مِّنِّى وَلِتُصْنَعَ عَلَىٰ عَيْنِىٓ",
    transliteration: "Aniqdhifīhi fit-tābūti faqdhifīhi fil-yammi falyulqihil-yammu bis-sāḥili ya'khudhhu 'aduwwun lī wa 'aduwwun lahū wa alqaytu 'alayka maḥabbatan minnee wa lituṣna'a 'alā 'aynī",
    translation: "(Dengan firman): 'Letakkanlah dia (bayi Musa) di dalam peti, kemudian lemparkanlah dia ke sungai (Nil), maka sungai itu akan membawanya ke tepi, (di sana) dia akan diambil oleh musuh-Ku dan musuhnya.' Dan Aku melimpahkan kecintaan dari-Ku kepadamu; dan agar engkau dipelihara di bawah pengawasan-Ku."
  },
  {
    number: 40,
    arabic: "إِذْ تَمْشِىٓ أُخْتُكَ فَتَقُولُ هَلْ أَدُلُّكُمْ عَلَىٰ مَن يَكْفُلُهُۥ ۖ فَرَجَعْنَـٰكَ إِلَىٰٓ أُمِّكَ كَىْ تَقَرَّ عَيْنُهَا وَلَا تَحْزَنَ ۚ وَقَتَلْتَ نَفْسًا فَنَجَّيْنَـٰكَ مِنَ ٱلْغَمِّ وَفَتَنَّـٰكَ فُتُونًا ۚ فَلَبِثْتَ سِنِينَ فِىٓ أَهْلِ مَدْيَنَ ثُمَّ جِئْتَ عَلَىٰ قَدَرٍ يَـٰمُوسَىٰ",
    transliteration: "Idh tamshī ukhtuka fataqūlu hal adullukum 'alā man yakfuluhū faraja'nāka ilā ummika kay taqarra 'aynuhā wa lā taḥzana wa qatalta nafsan fanajjaynāka minal-ghammi wa fatannāka futūnā falabithta sinīna fī ahli Madyana thumma ji'ta 'alā qadarin yā Mūsā",
    translation: "(Ingatlah) ketika kakakmu (Maryam) berjalan, lalu dia berkata (kepada keluarga Firaun): 'Mahukah aku tunjukkan kepadamu orang yang akan memeliharanya?' Maka Kami mengembalikanmu kepada ibumu, agar senang hatinya dan tidak berdukacita. Dan engkau pernah membunuh seorang, lalu Kami selamatkan engkau dari kesusahan, dan Kami telah mencuba engkau dengan beberapa cubaan. Kemudian engkau tinggal beberapa tahun di kalangan penduduk Madyan; kemudian engkau datang menurut ketentuan (Kami), wahai Musa."
  },
  {
    number: 41,
    arabic: "وَٱصْطَنَعْتُكَ لِنَفْسِى",
    transliteration: "Waṣṭana'tuka linafsi",
    translation: "Dan Aku telah memilih engkau untuk diri-Ku (untuk menyampaikan risalah-Ku)."
  },
  {
    number: 42,
    arabic: "ٱذْهَبْ أَنتَ وَأَخُوكَ بِـَٔايَـٰتِى وَلَا تَنِيَا فِى ذِكْرِى",
    transliteration: "Idhhab anta wa akhūka bi'āyātī wa lā taniyā fī dhikrī",
    translation: "Pergilah engkau dan saudaramu dengan membawa tanda-tanda kekuasaan-Ku, dan janganlah kamu berdua lalai dalam mengingati Aku."
  },
  {
    number: 43,
    arabic: "ٱذْهَبَآ إِلَىٰ فِرْعَوْنَ إِنَّهُۥ طَغَىٰ",
    transliteration: "Idhhabā ilā Fir'awna innahū ṭaghā",
    translation: "Pergilah kamu berdua kepada Firaun, sesungguhnya dia telah melampaui batas;"
  },
  {
    number: 44,
    arabic: "فَقُولَا لَهُۥ قَوْلًا لَّيِّنًا لَّعَلَّهُۥ يَتَذَكَّرُ أَوْ يَخْشَىٰ",
    transliteration: "Faqūlā lahū qawlan layyinal la'allahū yatadhakkaru aw yakhshā",
    translation: "Maka bertuturlah kamu berdua kepadanya (Firaun) dengan kata-kata yang lemah lembut, mudah-mudahan dia ingat atau takut (kepada Allah)."
  },
  {
    number: 45,
    arabic: "قَالَا رَبَّنَآ إِنَّنَا نَخَافُ أَن يَفْرُطَ عَلَيْنَآ أَوْ أَن يَطْغَىٰ",
    transliteration: "Qālā rabbanā innanā nakhāfu an yafruṭa 'alaynā aw an yaṭghā",
    translation: "Kedua-duanya (Musa dan Harun) berkata: 'Ya Tuhan kami, sesungguhnya kami takut dia akan menyeksa kami atau dia akan melampaui batas (terhadap kami).'"
  },
  {
    number: 46,
    arabic: "قَالَ لَا تَخَافَآ ۖ إِنَّنِى مَعَكُمَآ أَسْمَعُ وَأَرَىٰ",
    transliteration: "Qāla lā takhāfā innanī ma'akumā asma'u wa arā",
    translation: "Allah berfirman: 'Janganlah kamu berdua takut, sesungguhnya Aku bersama kamu berdua, Aku mendengar dan melihat.'"
  },
  {
    number: 47,
    arabic: "فَأْتِيَاهُ فَقُولَآ إِنَّا رَسُولَا رَبِّكَ فَأَرْسِلْ مَعَنَا بَنِىٓ إِسْرَٰٓءِيلَ وَلَا تُعَذِّبْهُمْ ۖ قَدْ جِئْنَـٰكَ بِـَٔايَةٍ مِّن رَّبِّكَ ۖ وَٱلسَّلَـٰمُ عَلَىٰ مَنِ ٱتَّبَعَ ٱلْهُدَىٰٓ",
    transliteration: "Fa'tiyāhu faqūlā innā rasūlā rabbika fa'arsil ma'anā banī Isrā'īla wa lā tu'adhdhibhum qad ji'nāka bi'āyatin min rabbika was-salāmu 'alā manittaba'al-hudā",
    translation: "Maka datanglah kamu berdua kepadanya dan katakanlah: 'Sesungguhnya kami berdua adalah utusan Tuhanmu, maka lepaskanlah Bani Israil (pergi) bersama kami dan janganlah engkau menyeksa mereka. Sesungguhnya kami telah datang kepadamu dengan membawa bukti (mukjizat) dari Tuhanmu. Dan kesejahteraan atas orang yang mengikuti petunjuk.'"
  },
  {
    number: 48,
    arabic: "إِنَّا قَدْ أُوحِىَ إِلَيْنَآ أَنَّ ٱلْعَذَابَ عَلَىٰ مَن كَذَّبَ وَتَوَلَّىٰ",
    transliteration: "Innā qad ūḥiya ilaynā annal-'adhāba 'alā man kadhdhaba wa tawallā",
    translation: "Sesungguhnya telah diwahyukan kepada kami bahawa azab itu atas orang yang mendustakan dan berpaling (dari kebenaran).'"
  },
  {
    number: 49,
    arabic: "قَالَ فَمَن رَّبُّكُمَا يَـٰمُوسَىٰ",
    transliteration: "Qāla faman rabbukumā yā Mūsā",
    translation: "Firaun berkata: 'Siapakah Tuhan kamu berdua, wahai Musa?'"
  },
  {
    number: 50,
    arabic: "قَالَ رَبُّنَا ٱلَّذِىٓ أَعْطَىٰ كُلَّ شَىْءٍ خَلْقَهُۥ ثُمَّ هَدَىٰ",
    transliteration: "Qāla rabbunalladhī a'ṭā kulla shay'in khalqahū thumma hadā",
    translation: "Musa menjawab: 'Tuhan kami ialah (Tuhan) yang memberikan kepada setiap sesuatu bentuk kejadiannya, kemudian Dia memberinya petunjuk.'"
  },
  {
    number: 51,
    arabic: "قَالَ فَمَا بَالُ ٱلْقُرُونِ ٱلْأُولَىٰ",
    transliteration: "Qāla famā bālul-qurūnil-ūlā",
    translation: "Firaun berkata: 'Lalu bagaimana halnya dengan generasi-generasi yang terdahulu?'"
  },
  {
    number: 52,
    arabic: "قَالَ عِلْمُهَا عِندَ رَبِّى فِى كِتَـٰبٍ ۖ لَّا يَضِلُّ رَبِّى وَلَا يَنسَى",
    transliteration: "Qāla 'ilmuhā 'inda rabbī fī kitābin lā yaḍillu rabbī wa lā yansā",
    translation: "Musa menjawab: 'Pengetahuan tentang mereka itu ada pada Tuhanku dalam sebuah kitab (Lauh Mahfuz); Tuhanku tidak akan salah dan tidak (pula) lupa.'"
  },
  {
    number: 53,
    arabic: "ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ مَهْدًا وَسَلَكَ لَكُمْ فِيهَا سُبُلًا وَأَنزَلَ مِنَ ٱلسَّمَآءِ مَآءً فَأَخْرَجْنَا بِهِۦٓ أَزْوَٰجًا مِّن نَّبَاتٍ شَتَّىٰ",
    transliteration: "Alladhī ja'ala lakumul-arḍa mahdan wa salaka lakum fīhā subulan wa anzala minas-samā'i mā'an fa'akhrajnā bihī azwājan min nabātin shattā",
    translation: "(Iaitu Tuhan) yang telah menjadikan bumi sebagai hamparan bagimu, dan telah menjadikan jalan-jalan di atasnya bagimu, dan menurunkan air (hujan) dari langit; maka dengan air itu Kami tumbuhkan pelbagai jenis tumbuh-tumbuhan yang berlainan jenisnya."
  },
  {
    number: 54,
    arabic: "كُلُوا۟ وَٱرْعَوْا۟ أَنْعَـٰمَكُمْ ۗ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍ لِّأُو۟لِى ٱلنُّهَىٰ",
    transliteration: "Kulū war'aw an'āmakum inna fī dhālika la'āyātin li'ulin-nuhā",
    translation: "Makanlah (dari tumbuh-tumbuhan itu) dan gembalakanlah binatang-binatang ternakanmu. Sesungguhnya pada yang demikian itu terdapat tanda-tanda (kekuasaan Allah) bagi orang-orang yang mempunyai akal."
  },
  {
    number: 55,
    arabic: "۞ مِنْهَا خَلَقْنَـٰكُمْ وَفِيهَا نُعِيدُكُمْ وَمِنْهَا نُخْرِجُكُمْ تَارَةً أُخْرَىٰ",
    transliteration: "Minhā khalaqnākum wa fīhā nu'īdukum wa minhā nukhrijukum tāratan ukhrā",
    translation: "Dari bumi (tanah) itulah Kami menjadikan kamu, dan ke dalamnya Kami akan mengembalikan kamu, dan daripadanya (pula) Kami akan mengeluarkan kamu pada kali yang lain."
  },
  {
    number: 56,
    arabic: "وَلَقَدْ أَرَيْنَـٰهُ ءَايَـٰتِنَا كُلَّهَا فَكَذَّبَ وَأَبَىٰ",
    transliteration: "Wa laqad araynāhu āyātinā kullahā fakadhdhaba wa abā",
    translation: "Dan sesungguhnya telah Kami perlihatkan kepadanya (Firaun) semua tanda-tanda kekuasaan Kami, tetapi dia mendustakan dan enggan (beriman)."
  },
  {
    number: 57,
    arabic: "قَالَ أَجِئْتَنَا لِتُخْرِجَنَا مِنْ أَرْضِنَا بِسِحْرِكَ يَـٰمُوسَىٰ",
    transliteration: "Qāla aji'tanā litukhrijanā min arḍinā bisiḥrika yā Mūsā",
    translation: "Firaun berkata: 'Adakah engkau datang kepada kami untuk mengusir kami dari negeri kami dengan sihirmu, wahai Musa?'"
  },
  {
    number: 58,
    arabic: "فَلَنَأْتِيَنَّكَ بِسِحْرٍ مِّثْلِهِۦ فَٱجْعَلْ بَيْنَنَا وَبَيْنَكَ مَوْعِدًا لَّا نُخْلِفُهُۥ نَحْنُ وَلَآ أَنتَ مَكَانًا سُوًى",
    transliteration: "Falana'tiyannnaka bisiḥrin mithlihī faj'al baynanā wa baynaka maw'idan lā nukhlifuhū naḥnu wa lā anta makānan suwā",
    translation: "Maka kami akan mendatangkan kepadamu sihir yang seperti sihirmu, oleh itu tetapkanlah janji pertemuan antara kami dengan engkau, yang tidak kami ingkari dan tidak pula engkau ingkari, di tempat yang sama rata (untuk kedua-dua pihak).'"
  },
  {
    number: 59,
    arabic: "قَالَ مَوْعِدُكُمْ يَوْمُ ٱلزِّينَةِ وَأَن يُحْشَرَ ٱلنَّاسُ ضُحًى",
    transliteration: "Qāla maw'idukum yawmuz-zīnati wa an yuḥsharan-nāsu ḍuḥā",
    translation: "Musa berkata: 'Janji pertemuan kamu ialah pada hari perayaan, dan hendaklah orang ramai berkumpul pada waktu Dhuha (pagi).'"
  },
  {
    number: 60,
    arabic: "فَتَوَلَّىٰ فِرْعَوْنُ فَجَمَعَ كَيْدَهُۥ ثُمَّ أَتَىٰ",
    transliteration: "Fatawallā Fir'awnu fajama'a kaydahū thumma atā",
    translation: "Lalu berpalinglah Firaun (dari Musa), maka dia mengumpulkan tipu dayanya (ahli-ahli sihirnya), kemudian dia datang (ke tempat yang dijanjikan)."
  },
  {
    number: 61,
    arabic: "قَالَ لَهُم مُّوسَىٰ وَيْلَكُمْ لَا تَفْتَرُوا۟ عَلَى ٱللَّهِ كَذِبًا فَيُسْحِتَكُم بِعَذَابٍ ۖ وَقَدْ خَابَ مَنِ ٱفْتَرَىٰ",
    transliteration: "Qāla lahum Mūsā waylakum lā taftarū 'alAllāhi kadhiban fayusḥitakum bi'adhābin wa qad khāba maniftarā",
    translation: "Musa berkata kepada mereka (ahli-ahli sihir): 'Celakalah kamu! Janganlah kamu mengada-adakan dusta terhadap Allah, nanti Dia membinasakan kamu dengan azab; dan sesungguhnya merugilah orang yang mengada-adakan (dusta).'"
  },
  {
    number: 62,
    arabic: "فَتَنَـٰزَعُوٓا۟ أَمْرَهُم بَيْنَهُمْ وَأَسَرُّوا۟ ٱلنَّجْوَىٰ",
    transliteration: "Fatanāza'ū amrahum baynahum wa asarrun-najwā",
    translation: "Lalu mereka berbantah-bantah tentang urusan mereka sesama mereka, dan mereka merahsiakan pembicaraan."
  },
  {
    number: 63,
    arabic: "قَالُوٓا۟ إِنْ هَـٰذَٰنِ لَسَـٰحِرَٰنِ يُرِيدَانِ أَن يُخْرِجَاكُم مِّنْ أَرْضِكُم بِسِحْرِهِمَا وَيَذْهَبَا بِطَرِيقَتِكُمُ ٱلْمُثْلَىٰ",
    transliteration: "Qālū in hādhāni lasāḥirāni yurīdāni an yukhrijākum min arḍikum bisiḥrihimā wa yadhhaba biṭarīqatikumul-muthlā",
    translation: "Mereka berkata: 'Sesungguhnya kedua-duanya (Musa dan Harun) adalah ahli sihir yang hendak mengusir kamu dari negeri kamu dengan sihirnya, dan melenyapkan jalan hidup kamu yang paling utama.'"
  },
  {
    number: 64,
    arabic: "فَأَجْمِعُوا۟ كَيْدَكُمْ ثُمَّ ٱئْتُوا۟ صَفًّا ۚ وَقَدْ أَفْلَحَ ٱلْيَوْمَ مَنِ ٱسْتَعْلَىٰ",
    transliteration: "Fa'ajmi'ū kaydakum thumma'tū ṣaffan wa qad aflaḥal-yawma manista'lā",
    translation: "Maka kumpulkanlah tipu daya kamu, kemudian datanglah (menghadapi Musa) dengan berbaris (serentak); dan sesungguhnya beruntunglah pada hari ini orang yang menang.'"
  },
  {
    number: 65,
    arabic: "قَالُوا۟ يَـٰمُوسَىٰٓ إِمَّآ أَن تُلْقِىَ وَإِمَّآ أَن نَّكُونَ أَوَّلَ مَنْ أَلْقَىٰ",
    transliteration: "Qālū yā Mūsā immā an tulqiya wa immā an nakūna awwala man alqā",
    translation: "Mereka berkata: 'Wahai Musa, adakah engkau yang akan melemparkan (lebih dahulu), atau kamikah yang menjadi orang pertama yang melemparkan?'"
  },
  {
    number: 66,
    arabic: "قَالَ بَلْ أَلْقُوا۟ ۖ فَإِذَا حِبَالُهُمْ وَعِصِيُّهُمْ يُخَيَّلُ إِلَيْهِ مِن سِحْرِهِمْ أَنَّهَا تَسْعَىٰ",
    transliteration: "Qāla bal alqū fa'idhā ḥibāluhum wa 'iṣiyyuhum yukhayyalu ilayhi min siḥrihim annahā tas'ā",
    translation: "Musa berkata: 'Silakan kamu melemparkan.' Maka tiba-tiba tali-tali dan tongkat-tongkat mereka terbayang kepadanya (Musa) oleh sihir mereka, seolah-olah ia bergerak-gerak (seperti ular).'"
  },
  {
    number: 67,
    arabic: "فَأَوْجَسَ فِى نَفْسِهِۦ خِيفَةً مُّوسَىٰ",
    transliteration: "Fa'awjasa fī nafsihī khīfatan Mūsā",
    translation: "Maka Musa merasa takut dalam hatinya."
  },
  {
    number: 68,
    arabic: "قُلْنَا لَا تَخَفْ إِنَّكَ أَنتَ ٱلْأَعْلَىٰ",
    transliteration: "Qulnā lā takhaf innaka antal-a'lā",
    translation: "Kami berfirman: 'Jangan takut, sesungguhnya engkaulah yang unggul.'"
  },
  {
    number: 69,
    arabic: "وَأَلْقِ مَا فِى يَمِينِكَ تَلْقَفْ مَا صَنَعُوٓا۟ ۖ إِنَّمَا صَنَعُوا۟ كَيْدُ سَـٰحِرٍ ۖ وَلَا يُفْلِحُ ٱلسَّاحِرُ حَيْثُ أَتَىٰ",
    transliteration: "Wa alqi mā fī yamīnika talqaf mā ṣana'ū innamā ṣana'ū kaydu sāḥirin wa lā yufliḥus-sāḥiru ḥaythu atā",
    translation: "Dan lemparkanlah apa yang ada di tangan kananmu, nescaya ia akan menelan apa yang mereka buat. Sesungguhnya apa yang mereka buat itu hanyalah tipu daya ahli sihir. Dan tidak akan menang ahli sihir itu, dari mana pun dia datang.'"
  },
  {
    number: 70,
    arabic: "فَأُلْقِىَ ٱلسَّحَرَةُ سُجَّدًا قَالُوٓا۟ ءَامَنَّا بِرَبِّ هَـٰرُونَ وَمُوسَىٰ",
    transliteration: "Fa'ulqiyas-saḥaratu sujjadan qālū āmannā birabbi Hārūna wa Mūsā",
    translation: "Maka ahli-ahli sihir itu (tunduk) sujud, seraya berkata: 'Kami beriman kepada Tuhan Harun dan Musa.'"
  },
  {
    number: 71,
    arabic: "قَالَ ءَامَنتُمْ لَهُۥ قَبْلَ أَنْ ءَاذَنَ لَكُمْ ۖ إِنَّهُۥ لَكَبِيرُكُمُ ٱلَّذِى عَلَّمَكُمُ ٱلسِّحْرَ ۖ فَلَأُقَطِّعَنَّ أَيْدِيَكُمْ وَأَرْجُلَكُم مِّنْ خِلَـٰفٍ وَلَأُصَلِّبَنَّكُمْ فِى جُذُوعِ ٱلنَّخْلِ وَلَتَعْلَمُنَّ أَيُّنَآ أَشَدُّ عَذَابًا وَأَبْقَىٰ",
    transliteration: "Qāla āmantum lahū qabla an ādhana lakum innahū lakabīrukumulladhī 'allamakumus-siḥra fala'uqaṭṭi'anna aydiyakum wa arjulakum min khilāfin wa la'uṣallibannakum fī judhū'in-nakhli wa lata'lamunna ayyunā ashaddu 'adhāban wa abqā",
    translation: "Firaun berkata: 'Patutkah kamu beriman kepadanya sebelum aku memberi izin kepadamu? Sesungguhnya dialah ketua kamu yang mengajarkan sihir kepada kamu. Oleh itu, aku benar-benar akan memotong tangan dan kaki kamu secara bersilang, dan aku benar-benar akan menyalib kamu pada batang-batang pokok tamar. Dan pasti kamu akan mengetahui siapa di antara kami yang lebih keras siksaannya dan yang lebih kekal (azabnya).'"
  },
  {
    number: 72,
    arabic: "قَالُوا۟ لَن نُّؤْثِرَكَ عَلَىٰ مَا جَآءَنَا مِنَ ٱلْبَيِّنَـٰتِ وَٱلَّذِى فَطَرَنَا ۖ فَٱقْضِ مَآ أَنتَ قَاضٍ ۖ إِنَّمَا تَقْضِى هَـٰذِهِ ٱلْحَيَوٰةَ ٱلدُّنْيَآ",
    transliteration: "Qālū lan nu'thiraka 'alā mā jā'anā minal-bayyināti walladhī faṭaranā faqḍi mā anta qāḍin innamā taqḍī hādhihil-ḥayātad-dunyā",
    translation: "Mereka berkata: 'Kami sekali-kali tidak akan mengutamakan engkau daripada bukti-bukti yang nyata yang telah datang kepada kami, dan (tidak pula akan mengutamakan engkau) daripada (Allah) yang telah menciptakan kami. Maka putuskanlah apa yang hendak engkau putuskan. Sesungguhnya engkau hanya dapat memutuskan (menghukum) dalam kehidupan dunia ini sahaja.'"
  },
  {
    number: 73,
    arabic: "إِنَّآ ءَامَنَّا بِرَبِّنَا لِيَغْفِرَ لَنَا خَطَـٰيَـٰنَا وَمَآ أَكْرَهْتَنَا عَلَيْهِ مِنَ ٱلسِّحْرِ ۗ وَٱللَّهُ خَيْرٌ وَأَبْقَىٰٓ",
    transliteration: "Innā āmannā birabbinā liyaghfira lanā khaṭāyānā wa mā akrahtanā 'alayhi minas-siḥr wallāhu khayrun wa abqā",
    translation: "Sesungguhnya kami telah beriman kepada Tuhan kami, agar Dia mengampuni kesalahan-kesalahan kami dan (mengampuni) sihir yang engkau paksakan kepada kami melakukannya; dan Allah lebih baik (balasan-Nya) dan lebih kekal (nikmat-Nya).'"
  },
  {
    number: 74,
    arabic: "إِنَّهُۥ مَن يَأْتِ رَبَّهُۥ مُجْرِمًا فَإِنَّ لَهُۥ جَهَنَّمَ لَا يَمُوتُ فِيهَا وَلَا يَحْيَىٰ",
    transliteration: "Innahū man ya'ti rabbahū mujriman fa'inna lahū jahannama lā yamūtu fīhā wa lā yaḥyā",
    translation: "Sesungguhnya barangsiapa datang kepada Tuhannya dalam keadaan berdosa, maka sesungguhnya baginya neraka Jahannam; dia tidak mati di dalamnya dan tidak (pula) hidup."
  },
  {
    number: 75,
    arabic: "وَمَن يَأْتِهِۥ مُؤْمِنًا قَدْ عَمِلَ ٱلصَّـٰلِحَـٰتِ فَأُو۟لَـٰٓئِكَ لَهُمُ ٱلدَّرَجَـٰتُ ٱلْعُلَىٰ",
    transliteration: "Wa man ya'tihī mu'minan qad 'amilaṣ-ṣāliḥāti fa'ulā'ika lahumud-darajātul-'ulā",
    translation: "Dan barangsiapa datang kepada-Nya dalam keadaan beriman dan telah mengerjakan amal soleh, maka mereka itulah orang-orang yang memperoleh darjat-darjat yang tinggi (dalam syurga),"
  },
  {
    number: 76,
    arabic: "جَنَّـٰتُ عَدْنٍ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَـٰرُ خَـٰلِدِينَ فِيهَا ۚ وَذَٰلِكَ جَزَآءُ مَن تَزَكَّىٰ",
    transliteration: "Jannātu 'Adnin tajrī min taḥtihal-anhāru khālidīna fīhā wa dhālika jazā'u man tazakkā",
    translation: "(Iaitu) syurga 'Adn yang mengalir di bawahnya sungai-sungai; mereka kekal di dalamnya. Dan demikianlah balasan bagi orang yang membersihkan diri (dari dosa)."
  },
  {
    number: 77,
    arabic: "وَلَقَدْ أَوْحَيْنَآ إِلَىٰ مُوسَىٰٓ أَنْ أَسْرِ بِعِبَادِى فَٱضْرِبْ لَهُمْ طَرِيقًا فِى ٱلْبَحْرِ يَبَسًا لَّا تَخَـٰفُ دَرَكًا وَلَا تَخْشَىٰ",
    transliteration: "Wa laqad awḥaynā ilā Mūsā an asri bi'ibādī faḍrib lahum ṭarīqan fil-baḥri yabasan lā takhāfu darakan wa lā takhshā",
    translation: "Dan sesungguhnya telah Kami wahyukan kepada Musa: 'Pergilah dengan membawa hamba-hamba-Ku (Bani Israil) pada malam hari, dan buatlah untuk mereka jalan yang kering di lautan, engkau tidak perlu takut akan dikejar (oleh Firaun) dan tidak (pula) merasa cemas.'"
  },
  {
    number: 78,
    arabic: "فَأَتْبَعَهُمْ فِرْعَوْنُ بِجُنُودِهِۦ فَغَشِيَهُم مِّنَ ٱلْيَمِّ مَا غَشِيَهُمْ",
    transliteration: "Fa'atba'ahum Fir'awnu bijunūdihī fagashiyahum minal-yammi mā ghashiyahum",
    translation: "Lalu Firaun mengejar mereka dengan bala tenteranya, maka mereka ditenggelami oleh laut seperti yang telah menenggelamkan mereka."
  },
  {
    number: 79,
    arabic: "وَأَضَلَّ فِرْعَوْنُ قَوْمَهُۥ وَمَا هَدَىٰ",
    transliteration: "Wa aḍalla Fir'awnu qawmahū wa mā hadā",
    translation: "Dan Firaun telah menyesatkan kaumnya dan tidak memberi petunjuk."
  },
  {
    number: 80,
    arabic: "يَـٰبَنِىٓ إِسْرَٰٓءِيلَ قَدْ أَنجَيْنَـٰكُم مِّنْ عَدُوِّكُمْ وَوَٰعَدْنَـٰكُمْ جَانِبَ ٱلطُّورِ ٱلْأَيْمَنَ وَنَزَّلْنَا عَلَيْكُمُ ٱلْمَنَّ وَٱلسَّلْوَىٰ",
    transliteration: "Yā banī Isrā'īla qad anjaynākum min 'aduwwikum wa wā'adnākum jānibaṭ-Ṭūril-aymana wa nazzalnā 'alaykumul-manna was-salwā",
    translation: "Wahai Bani Israil, sesungguhnya Kami telah menyelamatkan kamu dari musuhmu, dan Kami telah menjanjikan (memberikan Taurat) kepadamu di sebelah kanan Gunung Tursina, dan Kami telah menurunkan kepada kamu manna dan salwa,"
  },
  {
    number: 81,
    arabic: "كُلُوا۟ مِن طَيِّبَـٰتِ مَا رَزَقْنَـٰكُمْ وَلَا تَطْغَوْا۟ فِيهِ فَيَحِلَّ عَلَيْكُمْ غَضَبِى ۖ وَمَن يَحْلِلْ عَلَيْهِ غَضَبِى فَقَدْ هَوَىٰ",
    transliteration: "Kulū min ṭayyibāti mā razaqnākum wa lā taṭghaw fīhi fayaḥilla 'alaykum ghaḍabī wa man yaḥlil 'alayhi ghaḍabī faqad hawā",
    translation: "(Dengan firman): 'Makanlah dari rezeki yang baik yang telah Kami berikan kepada kamu, dan janganlah kamu melampaui batas padanya, yang menyebabkan kemurkaan-Ku menimpa kamu, dan barangsiapa yang ditimpa oleh kemurkaan-Ku, maka sesungguhnya binasalah dia.'"
  },
  {
    number: 82,
    arabic: "وَإِنِّى لَغَفَّارٌ لِّمَن تَابَ وَءَامَنَ وَعَمِلَ صَـٰلِحًا ثُمَّ ٱهْتَدَىٰ",
    transliteration: "Wa innī laghaffārun liman tāba wa āmana wa 'amila ṣāliḥan thummahtadā",
    translation: "Dan sesungguhnya Aku Maha Pengampun bagi orang yang bertaubat, beriman dan beramal soleh, kemudian tetap mendapat petunjuk."
  },
  {
    number: 83,
    arabic: "۞ وَمَآ أَعْجَلَكَ عَن قَوْمِكَ يَـٰمُوسَىٰ",
    transliteration: "Wa mā a'jalaka 'an qawmika yā Mūsā",
    translation: "Dan apakah yang menyebabkan engkau tergesa-gesa meninggalkan kaummu, wahai Musa?"
  },
  {
    number: 84,
    arabic: "قَالَ هُمْ أُو۟لَآءِ عَلَىٰٓ أَثَرِى وَعَجِلْتُ إِلَيْكَ رَبِّ لِتَرْضَىٰ",
    transliteration: "Qāla hum ulā'i 'alā atharī wa 'ajiltu ilayka rabbi litarḍā",
    translation: "Musa menjawab: 'Mereka itu ada di belakangku mengikut jejakku, dan aku bersegera datang kepada-Mu, ya Tuhanku, agar Engkau redha.'"
  },
  {
    number: 85,
    arabic: "قَالَ فَإِنَّا قَدْ فَتَنَّا قَوْمَكَ مِنۢ بَعْدِكَ وَأَضَلَّهُمُ ٱلسَّامِرِىُّ",
    transliteration: "Qāla fa'innā qad fatannā qawmaka min ba'dika wa aḍallahumus-Sāmiriyy",
    translation: "Allah berfirman: 'Maka sesungguhnya Kami telah menguji kaummu sesudah engkau tinggalkan, dan mereka telah disesatkan oleh As-Samiri.'"
  },
  {
    number: 86,
    arabic: "فَرَجَعَ مُوسَىٰٓ إِلَىٰ قَوْمِهِۦ غَضْبَـٰنَ أَسِفًا ۚ قَالَ يَـٰقَوْمِ أَلَمْ يَعِدْكُمْ رَبُّكُمْ وَعْدًا حَسَنًا ۚ أَفَطَالَ عَلَيْكُمُ ٱلْعَهْدُ أَمْ أَرَدتُّمْ أَن يَحِلَّ عَلَيْكُمْ غَضَبٌ مِّن رَّبِّكُمْ فَأَخْلَفْتُم مَّوْعِدِى",
    transliteration: "Faraja'a Mūsā ilā qawmihī ghaḍbāna asifan qāla yā qawmi alam ya'idkum rabbukum wa'dan ḥasanan afaṭāla 'alaykumul-'ahdu am aradttum an yaḥilla 'alaykum ghaḍabun min rabbikum fa'akhlaftum maw'idī",
    translation: "Maka kembalilah Musa kepada kaumnya dengan marah dan sedih hati. Dia berkata: 'Wahai kaumku, bukankah Tuhan kamu telah menjanjikan kepadamu suatu janji yang baik? Maka apakah terlalu lama masa (menungguku) itu bagi kamu? Ataukah kamu menghendaki agar kemurkaan dari Tuhan kamu menimpa kamu, lalu kamu melanggar perjanjianmu dengan aku?'"
  },
  {
    number: 87,
    arabic: "قَالُوا۟ مَآ أَخْلَفْنَا مَوْعِدَكَ بِمَلْكِنَا وَلَـٰكِنَّا حُمِّلْنَآ أَوْزَارًا مِّن زِينَةِ ٱلْقَوْمِ فَقَذَفْنَـٰهَا فَكَذَٰلِكَ أَلْقَى ٱلسَّامِرِىُّ",
    transliteration: "Qālū mā akhlafnā maw'idaka bimalkinā wa lākinnā ḥummilnā awzāran min zīnatil-qawmi faqadhafnāhā fakadhālika alqas-Sāmiriyy",
    translation: "Mereka menjawab: 'Kami tidak melanggar perjanjianmu dengan kemahuan kami sendiri, tetapi kami disuruh memikul beban-beban dari perhiasan kaum itu, maka kami melemparkannya (ke dalam api), dan demikian pula As-Samiri melemparkannya (pula).'"
  },
  {
    number: 88,
    arabic: "فَأَخْرَجَ لَهُمْ عِجْلًا جَسَدًا لَّهُۥ خُوَارٌ فَقَالُوا۟ هَـٰذَآ إِلَـٰهُكُمْ وَإِلَـٰهُ مُوسَىٰ فَنَسِىَ",
    transliteration: "Fa'akhraja lahum 'ijlan jasadan lahū khuwārun faqālū hādhā ilāhukum wa ilāhu Mūsā fanasiya",
    translation: "Maka As-Samiri mengeluarkan untuk mereka (dari api itu) anak lembu yang bertubuh dan bersuara, lalu mereka berkata: 'Inilah tuhan kamu dan tuhan Musa, tetapi Musa telah lupa.'"
  },
  {
    number: 89,
    arabic: "أَفَلَا يَرَوْنَ أَلَّا يَرْجِعُ إِلَيْهِمْ قَوْلًا وَلَا يَمْلِكُ لَهُمْ ضَرًّا وَلَا نَفْعًا",
    transliteration: "Afalā yarawna allā yarji'u ilayhim qawlan wa lā yamliku lahum ḍarran wa lā naf'ā",
    translation: "Tidakkah mereka memperhatikan bahawa (anak lembu) itu tidak dapat memberi jawapan kepada mereka, dan tidak kuasa mendatangkan mudarat dan tidak pula manfaat kepada mereka?"
  },
  {
    number: 90,
    arabic: "وَلَقَدْ قَالَ لَهُمْ هَـٰرُونُ مِن قَبْلُ يَـٰقَوْمِ إِنَّمَا فُتِنتُم بِهِۦ ۖ وَإِنَّ رَبَّكُمُ ٱلرَّحْمَـٰنُ فَٱتَّبِعُونِى وَأَطِيعُوٓا۟ أَمْرِى",
    transliteration: "Wa laqad qāla lahum Hārūnu min qablu yā qawmi innamā futintum bihī wa inna rabbakumur-Raḥmānu fattabi'ūnī wa aṭī'ū amrī",
    translation: "Dan sesungguhnya Harun telah berkata kepada mereka sebelum itu (sebelum Musa kembali): 'Wahai kaumku, sesungguhnya kamu hanyalah diuji dengan (anak lembu) itu, dan sesungguhnya Tuhanmu ialah Ar-Rahman, maka ikutlah aku dan taatilah perintahku.'"
  },
  {
    number: 91,
    arabic: "قَالُوا۟ لَن نَّبْرَحَ عَلَيْهِ عَـٰكِفِينَ حَتَّىٰ يَرْجِعَ إِلَيْنَا مُوسَىٰ",
    transliteration: "Qālū lan nabraḥa 'alayhi 'ākifīna ḥattā yarji'a ilaynā Mūsā",
    translation: "Mereka berkata: 'Kami tidak akan berhenti menyembahnya sehingga Musa kembali kepada kami.'"
  },
  {
    number: 92,
    arabic: "قَالَ يَـٰهَـٰرُونُ مَا مَنَعَكَ إِذْ رَأَيْتَهُمْ ضَلُّوٓا۟",
    transliteration: "Qāla yā Hārūnu mā mana'aka idh ra'aytahum ḍallū",
    translation: "Musa berkata: 'Wahai Harun, apakah yang menghalangmu ketika engkau melihat mereka sesat,'"
  },
  {
    number: 93,
    arabic: "أَلَّا تَتَّبِعَنِ ۖ أَفَعَصَيْتَ أَمْرِى",
    transliteration: "Allā tattabi'ani afa'aṣayta amrī",
    translation: "Daripada mengikut aku? Maka apakah engkau telah menderhaka terhadap perintahku?'"
  },
  {
    number: 94,
    arabic: "قَالَ يَبْنَؤُمَّ لَا تَأْخُذْ بِلِحْيَتِى وَلَا بِرَأْسِىٓ ۖ إِنِّى خَشِيتُ أَن تَقُولَ فَرَّقْتَ بَيْنَ بَنِىٓ إِسْرَٰٓءِيلَ وَلَمْ تَرْقُبْ قَوْلِى",
    transliteration: "Qāla yabna'umma lā ta'khudh biliḥyatī wa lā bira'sī innī khashītu an taqūla farraqta bayna banī Isrā'īla wa lam tarqub qawlī",
    translation: "Harun menjawab: 'Wahai anak ibuku, janganlah engkau pegang janggutku dan jangan (pula) kepalaku. Sesungguhnya aku takut engkau akan berkata: "Engkau telah membuat perpecahan di antara Bani Israil, dan engkau tidak memelihara perkataanku."'"
  },
  {
    number: 95,
    arabic: "قَالَ فَمَا خَطْبُكَ يَـٰسَـٰمِرِىُّ",
    transliteration: "Qāla famā khaṭbuka yā Sāmiriyy",
    translation: "Musa berkata: 'Maka apakah keadaanmu (tujuanmu), wahai Samiri?'"
  },
  {
    number: 96,
    arabic: "قَالَ بَصُرْتُ بِمَا لَمْ يَبْصُرُوا۟ بِهِۦ فَقَبَضْتُ قَبْضَةً مِّنْ أَثَرِ ٱلرَّسُولِ فَنَبَذْتُهَا وَكَذَٰلِكَ سَوَّلَتْ لِى نَفْسِى",
    transliteration: "Qāla baṣurtu bimā lam yabṣurū bihī faqabaḍtu qabḍatan min atharir-rasūli fanabadhtuhā wa kadhālika sawwalat lī nafsī",
    translation: "As-Samiri menjawab: 'Aku melihat apa yang mereka tidak melihatnya, maka aku mengambil segenggam dari jejak Rasul (Jibril), lalu aku melemparkannya (ke dalam anak lembu emas itu), dan demikianlah nafsuku membisikkan (perbuatan itu) kepadaku.'"
  },
  {
    number: 97,
    arabic: "قَالَ فَٱذْهَبْ فَإِنَّ لَكَ فِى ٱلْحَيَوٰةِ أَن تَقُولَ لَا مِسَاسَ ۖ وَإِنَّ لَكَ مَوْعِدًا لَّن تُخْلَفَهُۥ ۖ وَٱنظُرْ إِلَىٰٓ إِلَـٰهِكَ ٱلَّذِى ظَلْتَ عَلَيْهِ عَاكِفًا ۖ لَّنُحَرِّقَنَّهُۥ ثُمَّ لَنَنسِفَنَّهُۥ فِى ٱلْيَمِّ نَسْفًا",
    transliteration: "Qāla fadh'hab fa'inna laka fil-ḥayāti an taqūla lā misāsa wa inna laka maw'idan lan tukhlafahu wanẓur ilā ilāhikalladhī ẓalta 'alayhi 'ākifan lanuḥarriqannahū thumma lanansifannahū fil-yammi nasfā",
    translation: "Musa berkata: 'Pergilah engkau, maka sesungguhnya bagimu di dalam kehidupan ini (hukumannya ialah) engkau akan berkata: "Jangan sentuh (aku)." Dan sesungguhnya bagimu (di akhirat) ada janji (azab) yang tidak akan meleset (menimpamu). Dan lihatlah tuhanmu yang engkau tetap menyembahnya, pasti kami akan membakarnya, kemudian kami akan melemparkan abunya ke laut dengan sepenuhnya.'"
  },
  {
    number: 98,
    arabic: "إِنَّمَآ إِلَـٰهُكُمُ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ ۚ وَسِعَ كُلَّ شَىْءٍ عِلْمًا",
    transliteration: "Innamā ilāhukumullāhulladhī lā ilāha illā huwa wasi'a kulla shay'in 'ilmā",
    translation: "Sesungguhnya Tuhan kamu hanyalah Allah yang tiada Tuhan selain Dia. Dia meliputi segala sesuatu dengan ilmu-Nya."
  },
  {
    number: 99,
    arabic: "كَذَٰلِكَ نَقُصُّ عَلَيْكَ مِنْ أَنۢبَآءِ مَا قَدْ سَبَقَ ۚ وَقَدْ ءَاتَيْنَـٰكَ مِن لَّدُنَّا ذِكْرًا",
    transliteration: "Kadhālika naquṣṣu 'alayka min anbā'i mā qad sabaqa wa qad ātaynāka mil-ladunnā dhikrā",
    translation: "Demikianlah Kami ceritakan kepadamu (Muhammad) sebahagian dari berita-berita umat yang telah lalu, dan sesungguhnya telah Kami berikan kepadamu dari sisi Kami suatu peringatan (Al-Quran)."
  },
  {
    number: 100,
    arabic: "مَّنْ أَعْرَضَ عَنْهُ فَإِنَّهُۥ يَحْمِلُ يَوْمَ ٱلْقِيَـٰمَةِ وِزْرًا",
    transliteration: "Man a'raḍa 'anhu fa'innahū yaḥmilu yawmal-qiyāmati wizrā",
    translation: "Barangsiapa berpaling daripadanya (Al-Quran), maka sesungguhnya dia akan memikul dosa yang berat pada Hari Kiamat,"
  },
  {
    number: 101,
    arabic: "خَـٰلِدِينَ فِيهِ ۖ وَسَآءَ لَهُمْ يَوْمَ ٱلْقِيَـٰمَةِ حِمْلًا",
    transliteration: "Khālidīna fīhi wa sā'a lahum yawmal-qiyāmati ḥimlā",
    translation: "Mereka kekal di dalam (azab) itu; dan amatlah buruk bagi mereka beban (dosa) itu pada Hari Kiamat,"
  },
  {
    number: 102,
    arabic: "يَوْمَ يُنفَخُ فِى ٱلصُّورِ ۚ وَنَحْشُرُ ٱلْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا",
    transliteration: "Yawma yunfakhu fiṣ-ṣūri wa naḥshurul-mujrimīna yawma'idhin zurqā",
    translation: "(Iaitu) pada hari ditiup sangkakala, dan Kami akan mengumpulkan orang-orang yang berdosa pada hari itu dalam keadaan mata mereka biru (kerana ketakutan)."
  },
  {
    number: 103,
    arabic: "يَتَخَـٰفَتُونَ بَيْنَهُمْ إِن لَّبِثْتُمْ إِلَّا عَشْرًا",
    transliteration: "Yatakhāfatūna baynahum il labith'tum illā 'ashrā",
    translation: "Mereka berbisik-bisik sesama mereka: 'Kamu tidak berdiam (di dunia) melainkan hanya sepuluh (hari).'"
  },
  {
    number: 104,
    arabic: "نَّحْنُ أَعْلَمُ بِمَا يَقُولُونَ إِذْ يَقُولُ أَمْثَلُهُمْ طَرِيقَةً إِن لَّبِثْتُمْ إِلَّا يَوْمًا",
    transliteration: "Naḥnu a'lamu bimā yaqūlūna idh yaqūlu amthaluhum ṭarīqatan il labith'tum illā yawmā",
    translation: "Kami lebih mengetahui apa yang mereka katakan, ketika berkata orang yang paling baik jalannya di antara mereka: 'Kamu tidak berdiam (di dunia) melainkan hanya sehari sahaja.'"
  },
  {
    number: 105,
    arabic: "وَيَسْـَٔلُونَكَ عَنِ ٱلْجِبَالِ فَقُلْ يَنسِفُهَا رَبِّى نَسْفًا",
    transliteration: "Wa yas'alūnaka 'anil-jibāli faqul yansifuhā rabbī nasfā",
    translation: "Dan mereka bertanya kepadamu (Muhammad) tentang gunung-ganang, maka katakanlah: 'Tuhanku akan menghancurkannya sehancur-hancurnya,'"
  },
  {
    number: 106,
    arabic: "فَيَذَرُهَا قَاعًا صَفْصَفًا",
    transliteration: "Fayadharuhā qā'an ṣafṣafā",
    translation: "Kemudian Dia akan menjadikannya tanah yang rata lagi licin,"
  },
  {
    number: 107,
    arabic: "لَّا تَرَىٰ فِيهَا عِوَجًا وَلَآ أَمْتًا",
    transliteration: "Lā tarā fīhā 'iwajan wa lā amtā",
    translation: "Engkau tidak akan melihat padanya (tanah itu) tempat yang bengkang-bengkok dan tidak pula tempat yang tinggi rendah."
  },
  {
    number: 108,
    arabic: "يَوْمَئِذٍ يَتَّبِعُونَ ٱلدَّاعِىَ لَا عِوَجَ لَهُۥ ۖ وَخَشَعَتِ ٱلْأَصْوَاتُ لِلرَّحْمَـٰنِ فَلَا تَسْمَعُ إِلَّا هَمْسًا",
    transliteration: "Yawma'idhin yattabi'ūnad-dā'iya lā 'iwaja lahū wa khasha'atil-aṣwātu lir-Raḥmāni falā tasma'u illā hamsā",
    translation: "Pada hari itu mereka mengikut (seruan) penyeru yang tidak ada kemungkiran padanya. Dan tunduk segala suara kepada Ar-Rahman, maka tidak akan engkau dengar kecuali bisikan perlahan."
  },
  {
    number: 109,
    arabic: "يَوْمَئِذٍ لَّا تَنفَعُ ٱلشَّفَـٰعَةُ إِلَّا مَنْ أَذِنَ لَهُ ٱلرَّحْمَـٰنُ وَرَضِىَ لَهُۥ قَوْلًا",
    transliteration: "Yawma'idhin lā tanfa'ush-shafā'atu illā man adhina lahur-Raḥmānu wa raḍiya lahū qawlā",
    translation: "Pada hari itu tidak berguna syafaat, kecuali (syafaat) orang yang telah diberi izin oleh Ar-Rahman dan yang diridhai-Nya perkataannya."
  },
  {
    number: 110,
    arabic: "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِهِۦ عِلْمًا",
    transliteration: "Ya'lamu mā bayna aydīhim wa mā khalfahum wa lā yuḥīṭūna bihī 'ilmā",
    translation: "Allah mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka, sedang mereka tidak dapat meliputi pengetahuan-Nya."
  },
  {
    number: 111,
    arabic: "وَعَنَتِ ٱلْوُجُوهُ لِلْحَىِّ ٱلْقَيُّومِ ۖ وَقَدْ خَابَ مَنْ حَمَلَ ظُلْمًا",
    transliteration: "Wa 'anatil-wujūhu lil-Ḥayyil-Qayyūmi wa qad khāba man ḥamala ẓulmā",
    translation: "Dan tunduk (semua) muka kepada (Allah) Yang Hidup lagi terus-menerus mengurus (makhluk-Nya); dan sesungguhnya merugilah orang yang membawa kezaliman."
  },
  {
    number: 112,
    arabic: "وَمَن يَعْمَلْ مِنَ ٱلصَّـٰلِحَـٰتِ وَهُوَ مُؤْمِنٌ فَلَا يَخَافُ ظُلْمًا وَلَا هَضْمًا",
    transliteration: "Wa man ya'mal minaṣ-ṣāliḥāti wa huwa mu'minun falā yakhāfu ẓulman wa lā haḍmā",
    translation: "Dan barangsiapa yang mengerjakan amal-amal soleh sedang dia beriman, maka dia tidak khawatir akan diperlakukan secara zalim dan tidak (pula) akan dikurangi haknya."
  },
  {
    number: 113,
    arabic: "وَكَذَٰلِكَ أَنزَلْنَـٰهُ قُرْءَانًا عَرَبِيًّا وَصَرَّفْنَا فِيهِ مِنَ ٱلْوَعِيدِ لَعَلَّهُمْ يَتَّقُونَ أَوْ يُحْدِثُ لَهُمْ ذِكْرًا",
    transliteration: "Wa kadhālika anzalnāhu qur'ānan 'arabiyyan wa ṣarrafnā fīhi minal-wa'īdi la'allahum yattaqūna aw yuḥdithu lahum dhikrā",
    translation: "Dan demikianlah Kami menurunkan Al-Quran dalam bahasa Arab, dan Kami telah menerangkan dengan berulang-ulang di dalamnya sebahagian dari ancaman, agar mereka bertakwa atau agar Al-Quran itu menimbulkan pengajaran bagi mereka."
  },
  {
    number: 114,
    arabic: "فَتَعَـٰلَى ٱللَّهُ ٱلْمَلِكُ ٱلْحَقُّ ۗ وَلَا تَعْجَلْ بِٱلْقُرْءَانِ مِن قَبْلِ أَن يُقْضَىٰٓ إِلَيْكَ وَحْيُهُۥ ۖ وَقُل رَّبِّ زِدْنِى عِلْمًا",
    transliteration: "Fata'ālallāhul-Malikul-Ḥaqq wa lā ta'jal bil-Qur'āni min qabli an yuqḍā ilayka waḥyuhū wa qur rabbi zidnī 'ilmā",
    translation: "Maka Maha Tinggi Allah, Raja yang sebenarnya; dan janganlah engkau (Muhammad) tergesa-gesa (membaca) Al-Quran sebelum selesai diwahyukan kepadamu, dan katakanlah: 'Ya Tuhanku, tambahkanlah ilmu kepadaku.'"
  },
  {
    number: 115,
    arabic: "وَلَقَدْ عَهِدْنَآ إِلَىٰٓ ءَادَمَ مِن قَبْلُ فَنَسِىَ وَلَمْ نَجِدْ لَهُۥ عَزْمًا",
    transliteration: "Wa laqad 'ahidnā ilā Ādama min qablu fanasiya wa lam najid lahū 'azmā",
    translation: "Dan sesungguhnya telah Kami perintahkan kepada Adam dahulu, tetapi dia lupa (melanggar perintah itu), dan tidak Kami dapati padanya kemauan yang kuat."
  },
  {
    number: 116,
    arabic: "وَإِذْ قُلْنَا لِلْمَلَـٰٓئِكَةِ ٱسْجُدُوا۟ لِـَٔادَمَ فَسَجَدُوٓا۟ إِلَّآ إِبْلِيسَ أَبَىٰ",
    transliteration: "Wa idh qulnā lilmalā'ikatisjudū li'Ādama fasajadū illā Iblīsa abā",
    translation: "Dan (ingatlah) ketika Kami berfirman kepada para malaikat: 'Sujudlah kepada Adam!' Maka mereka pun sujud kecuali Iblis; dia enggan."
  },
  {
    number: 117,
    arabic: "فَقُلْنَا يَـٰٓـَٔادَمُ إِنَّ هَـٰذَا عَدُوٌّ لَّكَ وَلِزَوْجِكَ فَلَا يُخْرِجَنَّكُمَا مِنَ ٱلْجَنَّةِ فَتَشْقَىٰٓ",
    transliteration: "Faqulnā yā Ādamu inna hādhā 'aduwwun laka wa lizawjika falā yukhrijannakumā minal-jannati fatashqā",
    translation: "Maka Kami berfirman: 'Wahai Adam, sesungguhnya ini (Iblis) adalah musuh bagimu dan bagi isterimu, maka jangan sekali-kali dia mengeluarkan kamu berdua dari syurga, yang menyebabkan engkau menjadi celaka.'"
  },
  {
    number: 118,
    arabic: "إِنَّ لَكَ أَلَّا تَجُوعَ فِيهَا وَلَا تَعْرَىٰ",
    transliteration: "Inna laka allā tajū'a fīhā wa lā ta'rā",
    translation: "Sesungguhnya engkau tidak akan lapar di dalamnya dan tidak akan telanjang,"
  },
  {
    number: 119,
    arabic: "وَأَنَّكَ لَا تَظْمَؤُا۟ فِيهَا وَلَا تَضْحَىٰ",
    transliteration: "Wa annaka lā taẓma'u fīhā wa lā taḍḥā",
    translation: "Dan sesungguhnya engkau tidak akan merasa dahaga di dalamnya dan tidak (pula) akan ditimpa panas matahari.'"
  },
  {
    number: 120,
    arabic: "فَوَسْوَسَ إِلَيْهِ ٱلشَّيْطَـٰنُ قَالَ يَـٰٓـَٔادَمُ هَلْ أَدُلُّكَ عَلَىٰ شَجَرَةِ ٱلْخُلْدِ وَمُلْكٍ لَّا يَبْلَىٰ",
    transliteration: "Fawaswasa ilayhish-shayṭānu qāla yā Ādamu hal adulluka 'alā shajaratil-khuldi wa mulkin lā yablā",
    translation: "Kemudian syaitan membisikkan (godaan) kepadanya, dengan berkata: 'Wahai Adam, mahukah aku tunjukkan kepadamu pohon keabadian dan kerajaan yang tidak akan binasa?'"
  },
  {
    number: 121,
    arabic: "فَأَكَلَا مِنْهَا فَبَدَتْ لَهُمَا سَوْءَٰتُهُمَا وَطَفِقَا يَخْصِفَانِ عَلَيْهِمَا مِن وَرَقِ ٱلْجَنَّةِ ۚ وَعَصَىٰٓ ءَادَمُ رَبَّهُۥ فَغَوَىٰ",
    transliteration: "Fa'akalā minhā fabadat lahumā saw'ātuhumā wa ṭafiqā yakhṣifāni 'alayhimā min waraqil-jannati wa 'aṣā Ādamu rabbahū faghawā",
    translation: "Maka mereka berdua memakan dari pohon itu, lalu nampaklah kepada mereka berdua aurat mereka, dan mulailah mereka menutupi (diri) dengan daun-daun (yang ada di) syurga, dan durhakalah Adam kepada Tuhannya, lalu sesatlah dia."
  },
  {
    number: 122,
    arabic: "ثُمَّ ٱجْتَبَـٰهُ رَبُّهُۥ فَتَابَ عَلَيْهِ وَهَدَىٰ",
    transliteration: "Thummajtabāhu rabbuhū fatāba 'alayhi wa hadā",
    translation: "Kemudian Tuhannya memilihnya, lalu Dia menerima taubatnya dan memberinya petunjuk."
  },
  {
    number: 123,
    arabic: "قَالَ ٱهْبِطَا مِنْهَا جَمِيعًۢا ۖ بَعْضُكُمْ لِبَعْضٍ عَدُوٌّ ۖ فَإِمَّا يَأْتِيَنَّكُم مِّنِّى هُدًى فَمَنِ ٱتَّبَعَ هُدَاىَ فَلَا يَضِلُّ وَلَا يَشْقَىٰ",
    transliteration: "Qālahbiṭā minhā jamī'an ba'ḍukum liba'ḍin 'aduwwun fa'immā ya'tiyannakum minnee hudan famanittaba'a hudāya falā yaḍillu wa lā yashqā",
    translation: "Allah berfirman: 'Turunlah kamu berdua dari syurga, sesetengah kamu menjadi musuh kepada sesetengah yang lain. Maka jika datang kepada kamu petunjuk dari-Ku, maka barangsiapa mengikut petunjuk-Ku, dia tidak akan sesat dan tidak akan celaka.'"
  },
  {
    number: 124,
    arabic: "وَمَنْ أَعْرَضَ عَن ذِكْرِى فَإِنَّ لَهُۥ مَعِيشَةً ضَنكًا وَنَحْشُرُهُۥ يَوْمَ ٱلْقِيَـٰمَةِ أَعْمَىٰ",
    transliteration: "Wa man a'raḍa 'an dhikrī fa'inna lahū ma'īshatan ḍankan wa naḥshuruhū yawmal-qiyāmati a'mā",
    translation: "Dan barangsiapa berpaling dari mengingati-Ku, maka sesungguhnya baginya kehidupan yang sempit, dan Kami akan mengumpulkannya pada Hari Kiamat dalam keadaan buta."
  },
  {
    number: 125,
    arabic: "قَالَ رَبِّ لِمَ حَشَرْتَنِىٓ أَعْمَىٰ وَقَدْ كُنتُ بَصِيرًا",
    transliteration: "Qāla rabbi lima ḥashartanī a'mā wa qad kuntu baṣīrā",
    translation: "Dia berkata: 'Ya Tuhanku, mengapakah Engkau kumpulkan aku dalam keadaan buta, padahal dahulunya aku dapat melihat?'"
  },
  {
    number: 126,
    arabic: "قَالَ كَذَٰلِكَ أَتَتْكَ ءَايَـٰتُنَا فَنَسِيتَهَا ۖ وَكَذَٰلِكَ ٱلْيَوْمَ تُنسَىٰ",
    transliteration: "Qāla kadhālika atatka āyātunā fanasītahā wa kadhālikal-yawma tunsā",
    translation: "Allah berfirman: 'Demikianlah, telah datang kepadamu ayat-ayat Kami, tetapi engkau melupakannya; dan demikian (pula) pada hari ini engkau dilupakan.'"
  },
  {
    number: 127,
    arabic: "وَكَذَٰلِكَ نَجْزِى مَنْ أَسْرَفَ وَلَمْ يُؤْمِنۢ بِـَٔايَـٰتِ رَبِّهِۦ ۚ وَلَعَذَابُ ٱلْـَٔاخِرَةِ أَشَدُّ وَأَبْقَىٰٓ",
    transliteration: "Wa kadhālika najzī man asrafa wa lam yu'mim bi'āyāti rabbihī wa la'adhābul-ākhirati ashaddu wa abqā",
    translation: "Dan demikianlah Kami membalas orang yang melampaui batas dan tidak beriman kepada ayat-ayat Tuhannya. Dan sesungguhnya azab di akhirat itu lebih berat dan lebih kekal."
  },
  {
    number: 128,
    arabic: "أَفَلَمْ يَهْدِ لَهُمْ كَمْ أَهْلَكْنَا قَبْلَهُم مِّنَ ٱلْقُرُونِ يَمْشُونَ فِى مَسَـٰكِنِهِمْ ۗ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍ لِّأُو۟لِى ٱلنُّهَىٰ",
    transliteration: "Afalam yahdi lahum kam ahlaknā qablahum minal-qurūni yamshūna fī masākinihim inna fī dhālika la'āyātin li'ulin-nuhā",
    translation: "Dan apakah tidak menjadi petunjuk bagi mereka, berapa banyak generasi sebelum mereka yang telah Kami binasakan, sedang mereka berjalan di tempat-tempat kediaman mereka itu? Sesungguhnya pada yang demikian itu terdapat tanda-tanda bagi orang-orang yang berakal."
  },
  {
    number: 129,
    arabic: "وَلَوْلَا كَلِمَةٌ سَبَقَتْ مِن رَّبِّكَ لَكَانَ لِزَامًا وَأَجَلٌ مُّسَمًّى",
    transliteration: "Wa lawlā kalimatun sabaqat mir-rabbika lakāna lizāman wa ajalun musammā",
    translation: "Dan sekiranya tidak ada ketetapan yang telah terdahulu dari Tuhanmu dan (ketetapan) ajal yang telah ditetapkan, tentulah mereka segera dibinasakan."
  },
  {
    number: 130,
    arabic: "فَٱصْبِرْ عَلَىٰ مَا يَقُولُونَ وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ ٱلشَّمْسِ وَقَبْلَ غُرُوبِهَا ۖ وَمِنْ ءَانَآىِٕ ٱلَّيْلِ فَسَبِّحْ وَأَطْرَافَ ٱلنَّهَارِ لَعَلَّكَ تَرْضَىٰ",
    transliteration: "Faṣbir 'alā mā yaqūlūna wa sabbiḥ biḥamdi rabbika qabla ṭulū'ish-shamsi wa qabla ghurūbihā wa min ānā'il-layli fasabbiḥ wa aṭrāfan-nahāri la'allaka tarḍā",
    translation: "Maka bersabarlah engkau (Muhammad) atas apa yang mereka katakan, dan bertasbihlah dengan memuji Tuhanmu, sebelum terbit matahari dan sebelum terbenamnya, dan bertasbihlah (pula) pada waktu-waktu di malam hari dan pada waktu-waktu di siang hari, supaya engkau merasa senang."
  },
  {
    number: 131,
    arabic: "وَلَا تَمُدَّنَّ عَيْنَيْكَ إِلَىٰ مَا مَتَّعْنَا بِهِۦٓ أَزْوَٰجًا مِّنْهُمْ زَهْرَةَ ٱلْحَيَوٰةِ ٱلدُّنْيَا لِنَفْتِنَهُمْ فِيهِ ۚ وَرِزْقُ رَبِّكَ خَيْرٌ وَأَبْقَىٰ",
    transliteration: "Wa lā tamuddanna 'aynayka ilā mā matta'nā bihī azwājan minhum zahrata l-ḥayātid-dunyā linaftinahum fīhi wa rizqu rabbika khayrun wa abqā",
    translation: "Dan janganlah sekali-kali engkau menujukan pandanganmu kepada apa yang telah Kami berikan kepada golongan-golongan dari mereka, sebagai kesenangan kehidupan dunia untuk Kami cuba mereka dengannya. Dan rezeki (yang diberi) Tuhanmu adalah lebih baik dan lebih kekal."
  },
  {
    number: 132,
    arabic: "وَأْمُرْ أَهْلَكَ بِٱلصَّلَوٰةِ وَٱصْطَبِرْ عَلَيْهَا ۖ لَا نَسْـَٔلُكَ رِزْقًا ۖ نَّحْنُ نَرْزُقُكَ ۗ وَٱلْعَـٰقِبَةُ لِلتَّقْوَىٰ",
    transliteration: "Wa'mur ahlaka biṣ-ṣalāti waṣṭabir 'alayhā lā nas'aluka rizqan naḥnu narzuquka wal-'āqibatu littaqwā",
    translation: "Dan perintahkanlah keluargamu mendirikan solat dan bersabarlah engkau mengerjakannya. Kami tidak meminta rezeki kepadamu, (bahkan) Kamilah yang memberi rezeki kepadamu. Dan akibat (yang baik di akhirat) adalah bagi orang yang bertakwa."
  },
  {
    number: 133,
    arabic: "وَقَالُوا۟ لَوْلَا يَأْتِينَا بِـَٔايَةٍ مِّن رَّبِّهِۦٓ ۚ أَوَلَمْ تَأْتِهِم بَيِّنَةُ مَا فِى ٱلصُّحُفِ ٱلْأُولَىٰ",
    transliteration: "Wa qālū lawlā ya'tīnā bi'āyatin mir-rabbihī awalam ta'tihim bayyinatu mā fiṣ-ṣuḥufil-ūlā",
    translation: "Dan mereka berkata: 'Mengapa dia (Muhammad) tidak membawa kepada kami suatu mukjizat dari Tuhannya?' Dan bukankah telah datang kepada mereka bukti yang nyata (tentang kebenaran Al-Quran) yaitu apa yang tersebut dalam kitab-kitab yang dahulu?"
  },
  {
    number: 134,
    arabic: "وَلَوْ أَنَّآ أَهْلَكْنَـٰهُم بِعَذَابٍ مِّن قَبْلِهِۦ لَقَالُوا۟ رَبَّنَا لَوْلَآ أَرْسَلْتَ إِلَيْنَا رَسُولًا فَنَتَّبِعَ ءَايَـٰتِكَ مِن قَبْلِ أَن نَّذِلَّ وَنَخْزَىٰ",
    transliteration: "Wa law annā ahlaknāhum bi'adhābin min qablihī laqālū rabbanā lawlā arsalta ilaynā rasūlan fanattabi'a āyātika min qabli an nadhilla wa nakhzā",
    translation: "Dan sekiranya Kami binasakan mereka dengan suatu azab sebelum Al-Quran (diturunkan), tentulah mereka berkata: 'Ya Tuhan kami, mengapa tidak Engkau utus seorang rasul kepada kami, supaya kami dapat mengikut ayat-ayat-Mu sebelum kami menjadi hina dan rendah?'"
  },
  {
    number: 135,
    arabic: "قُلْ كُلٌّ مُّتَرَبِّصٌ فَتَرَبَّصُوا۟ ۖ فَسَتَعْلَمُونَ مَنْ أَصْحَـٰبُ ٱلصِّرَٰطِ ٱلسَّوِىِّ وَمَنِ ٱهْتَدَىٰ",
    transliteration: "Qul kullum mutarabbiṣun fatarabbaṣū fasata'lamūna man aṣḥābuṣ-ṣirāṭis-sawiyyi wa manihhtadā",
    translation: "Katakanlah (Muhammad): 'Setiap orang menunggu (akibat perbuatannya), maka tunggulah! Kelak kamu akan mengetahui siapa golongan yang berada di jalan yang lurus dan siapa yang mendapat petunjuk.'"
  }
  ];

  // Audio configuration
  const audioConfig = {
    mishary: {
      name: 'Mishary Rashid Alafasy',
      baseUrl: 'https://server8.mp3quran.net/ahmad_huth/',
      format: '.mp3'
    },
    husary: {
      name: 'Mahmoud Khalil Al-Husary',
      baseUrl: 'https://server11.mp3quran.net/husary/',
      format: '.mp3'
    },
    sudais: {
      name: 'Abdul Rahman Al-Sudais',
      baseUrl: 'https://server11.mp3quran.net/sds/',
      format: '.mp3'
    }
  };

  // State management
  const state = {
    currentVerse: 0,
    isPlaying: false,
    currentQari: 'mishary',
    bookmarks: JSON.parse(localStorage.getItem('surahTahaBookmarks') || '[]'),
    settings: {
      arabicSize: 28,
      translationSize: 16,
      showTransliteration: true,
      autoScroll: true
    }
  };

  // Audio element
  let audioElement = null;
  let audioQueue = [];
  let isLoadingAudio = false;

  // DOM elements
  let elements = {};

  // Initialize
  function init() {
    cacheElements();
    loadSettings();
    renderVerses();
    setupEventListeners();
    initAudio();
    hideLoading();
  }

  function cacheElements() {
    elements = {
      container: document.getElementById('surah-taha-container'),
      versesContainer: document.getElementById('versesContainer'),
      playPauseBtn: document.getElementById('playPauseBtn'),
      playIcon: document.getElementById('playIcon'),
      pauseIcon: document.getElementById('pauseIcon'),
      progressBar: document.getElementById('progressBar'),
      currentVerse: document.getElementById('currentVerse'),
      audioTime: document.getElementById('audioTime'),
      qariSelector: document.getElementById('qariSelector'),
      settingsToggle: document.getElementById('settingsToggle'),
      settingsContent: document.getElementById('settingsContent'),
      arabicSize: document.getElementById('arabicSize'),
      arabicSizeValue: document.getElementById('arabicSizeValue'),
      translationSize: document.getElementById('translationSize'),
      translationSizeValue: document.getElementById('translationSizeValue'),
      showTransliteration: document.getElementById('showTransliteration'),
      autoScroll: document.getElementById('autoScroll'),
      toast: document.getElementById('toast'),
      loadingIndicator: document.getElementById('loadingIndicator')
    };
  }

  function loadSettings() {
    const saved = localStorage.getItem('surahTahaSettings');
    if (saved) {
      state.settings = { ...state.settings, ...JSON.parse(saved) };
      applySettings();
    }
  }

  function saveSettings() {
    localStorage.setItem('surahTahaSettings', JSON.stringify(state.settings));
  }

  function applySettings() {
    elements.arabicSize.value = state.settings.arabicSize;
    elements.arabicSizeValue.textContent = state.settings.arabicSize + 'px';
    elements.translationSize.value = state.settings.translationSize;
    elements.translationSizeValue.textContent = state.settings.translationSize + 'px';
    elements.showTransliteration.checked = state.settings.showTransliteration;
    elements.autoScroll.checked = state.settings.autoScroll;

    document.querySelectorAll('.verse-arabic').forEach(el => {
      el.style.fontSize = state.settings.arabicSize + 'px';
    });
    document.querySelectorAll('.verse-translation').forEach(el => {
      el.style.fontSize = state.settings.translationSize + 'px';
    });
    document.querySelectorAll('.verse-transliteration').forEach(el => {
      el.style.display = state.settings.showTransliteration ? 'block' : 'none';
    });
  }

  function renderVerses() {
    const fragment = document.createDocumentFragment();
    
    surahData.forEach(verse => {
      const card = createVerseCard(verse);
      fragment.appendChild(card);
    });

    elements.versesContainer.appendChild(fragment);
  }

  function createVerseCard(verse) {
    const card = document.createElement('div');
    card.className = 'verse-card';
    card.dataset.verse = verse.number;
    card.id = `verse-${verse.number}`;

    const isBookmarked = state.bookmarks.includes(verse.number);

    card.innerHTML = `
      <div class="verse-number">Ayat ${verse.number}</div>
      <div class="verse-arabic" style="font-size: ${state.settings.arabicSize}px;">${verse.arabic}</div>
      <div class="verse-transliteration" style="display: ${state.settings.showTransliteration ? 'block' : 'none'};">
        ${verse.transliteration}
      </div>
      <div class="verse-translation" style="font-size: ${state.settings.translationSize}px;">
        ${verse.translation}
      </div>
      <div class="verse-actions">
        <button class="action-btn copy-btn" data-verse="${verse.number}">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          Salin
        </button>
        <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-verse="${verse.number}">
          <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          ${isBookmarked ? 'Ditanda' : 'Tandabuku'}
        </button>
        <button class="action-btn share-btn" data-verse="${verse.number}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Kongsi
        </button>
      </div>
    `;

    return card;
  }

  function setupEventListeners() {
    // Play/Pause
    elements.playPauseBtn.addEventListener('click', togglePlayPause);

    // Qari selection
    elements.qariSelector.addEventListener('change', (e) => {
      state.currentQari = e.target.value;
      if (state.isPlaying) {
        playVerse(state.currentVerse);
      }
    });

    // Settings toggle
    elements.settingsToggle.addEventListener('click', () => {
      const isVisible = elements.settingsContent.style.display === 'block';
      elements.settingsContent.style.display = isVisible ? 'none' : 'block';
    });

    // Settings controls
    elements.arabicSize.addEventListener('input', (e) => {
      state.settings.arabicSize = parseInt(e.target.value);
      elements.arabicSizeValue.textContent = e.target.value + 'px';
      applySettings();
      saveSettings();
    });

    elements.translationSize.addEventListener('input', (e) => {
      state.settings.translationSize = parseInt(e.target.value);
      elements.translationSizeValue.textContent = e.target.value + 'px';
      applySettings();
      saveSettings();
    });

    elements.showTransliteration.addEventListener('change', (e) => {
      state.settings.showTransliteration = e.target.checked;
      applySettings();
      saveSettings();
    });

    elements.autoScroll.addEventListener('change', (e) => {
      state.settings.autoScroll = e.target.checked;
      saveSettings();
    });

    // Verse actions
    elements.versesContainer.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.copy-btn');
      const bookmarkBtn = e.target.closest('.bookmark-btn');
      const shareBtn = e.target.closest('.share-btn');

      if (copyBtn) {
        copyVerse(parseInt(copyBtn.dataset.verse));
      } else if (bookmarkBtn) {
        toggleBookmark(parseInt(bookmarkBtn.dataset.verse));
      } else if (shareBtn) {
        shareVerse(parseInt(shareBtn.dataset.verse));
      }
    });

    // Progress bar click
    elements.progressBar.parentElement.addEventListener('click', (e) => {
      if (audioElement) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioElement.currentTime = audioElement.duration * percent;
      }
    });
  }

  function initAudio() {
    audioElement = new Audio();
    
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', playNextVerse);
    audioElement.addEventListener('error', handleAudioError);
    audioElement.addEventListener('loadedmetadata', () => {
      updateAudioTime();
    });
  }

  function togglePlayPause() {
    if (state.isPlaying) {
      pauseAudio();
    } else {
      if (state.currentVerse === 0) {
        playVerse(1);
      } else {
        resumeAudio();
      }
    }
  }

  function playVerse(verseNumber) {
    if (isLoadingAudio) return;

    state.currentVerse = verseNumber;
    isLoadingAudio = true;

    const qari = audioConfig[state.currentQari];
    const paddedVerse = String(verseNumber).padStart(3, '0');
    const audioUrl = `${qari.baseUrl}020${paddedVerse}${qari.format}`;

    audioElement.src = audioUrl;
    audioElement.load();

    audioElement.play()
      .then(() => {
        state.isPlaying = true;
        updatePlayButton();
        highlightVerse(verseNumber);
        updateCurrentVerseText(verseNumber);
        isLoadingAudio = false;
      })
      .catch(error => {
        console.error('Audio playback failed:', error);
        showToast('Ralat memuatkan audio. Sila cuba lagi.');
        isLoadingAudio = false;
      });
  }

  function pauseAudio() {
    if (audioElement && !audioElement.paused) {
      audioElement.pause();
      state.isPlaying = false;
      updatePlayButton();
    }
  }

  function resumeAudio() {
    if (audioElement && audioElement.src) {
      audioElement.play()
        .then(() => {
          state.isPlaying = true;
          updatePlayButton();
        })
        .catch(error => {
          console.error('Resume failed:', error);
        });
    }
  }

  function playNextVerse() {
    if (state.currentVerse < surahData.length) {
      playVerse(state.currentVerse + 1);
    } else {
      state.isPlaying = false;
      state.currentVerse = 0;
      updatePlayButton();
      clearHighlight();
      showToast('Surah Taha selesai');
    }
  }

  function updateProgress() {
    if (audioElement && audioElement.duration) {
      const percent = (audioElement.currentTime / audioElement.duration) * 100;
      elements.progressBar.style.width = percent + '%';
      updateAudioTime();
    }
  }

  function updateAudioTime() {
    if (audioElement) {
      const current = formatTime(audioElement.currentTime || 0);
      const duration = formatTime(audioElement.duration || 0);
      elements.audioTime.textContent = `${current} / ${duration}`;
    }
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleAudioError(e) {
    console.error('Audio error:', e);
    showToast('Ralat audio. Cuba pilih qari lain.');
    isLoadingAudio = false;
    state.isPlaying = false;
    updatePlayButton();
  }

  function updatePlayButton() {
    if (state.isPlaying) {
      elements.playIcon.style.display = 'none';
      elements.pauseIcon.style.display = 'block';
    } else {
      elements.playIcon.style.display = 'block';
      elements.pauseIcon.style.display = 'none';
    }
  }

  function highlightVerse(verseNumber) {
    clearHighlight();
    const card = document.querySelector(`[data-verse="${verseNumber}"]`);
    if (card) {
      card.classList.add('active');
      if (state.settings.autoScroll) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function clearHighlight() {
    document.querySelectorAll('.verse-card.active').forEach(card => {
      card.classList.remove('active');
    });
  }

  function updateCurrentVerseText(verseNumber) {
    elements.currentVerse.textContent = `Ayat ${verseNumber}`;
  }

  function copyVerse(verseNumber) {
    const verse = surahData.find(v => v.number === verseNumber);
    if (!verse) return;

    const text = `${verse.arabic}\n\n${verse.transliteration}\n\n${verse.translation}\n\n(Surah Taha, Ayat ${verseNumber})`;

    navigator.clipboard.writeText(text)
      .then(() => showToast('Ayat berjaya disalin'))
      .catch(() => showToast('Ralat menyalin ayat'));
  }

  function toggleBookmark(verseNumber) {
    const index = state.bookmarks.indexOf(verseNumber);
    const btn = document.querySelector(`.bookmark-btn[data-verse="${verseNumber}"]`);
    
    if (index > -1) {
      state.bookmarks.splice(index, 1);
      btn.classList.remove('bookmarked');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        Tandabuku
      `;
      showToast('Tandabuku dibuang');
    } else {
      state.bookmarks.push(verseNumber);
      btn.classList.add('bookmarked');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        Ditanda
      `;
      showToast('Ayat ditanda');
    }

    localStorage.setItem('surahTahaBookmarks', JSON.stringify(state.bookmarks));
  }

  function shareVerse(verseNumber) {
    const verse = surahData.find(v => v.number === verseNumber);
    if (!verse) return;

    const shareData = {
      title: `Surah Taha - Ayat ${verseNumber}`,
      text: `${verse.arabic}\n\n${verse.translation}`,
      url: `${window.location.href}#verse-${verseNumber}`
    };

    if (navigator.share) {
      navigator.share(shareData)
        .catch(() => showToast('Ralat berkongsi'));
    } else {
      copyVerse(verseNumber);
    }
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 3000);
  }

  function hideLoading() {
    if (elements.loadingIndicator) {
      elements.loadingIndicator.style.display = 'none';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
