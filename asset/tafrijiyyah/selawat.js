// Protect domain
(function() {
  const allowedDomains = ['ilmualam.com', 'blogger.com', 'blogspot.com', 'localhost'];
  const currentDomain = window.location.hostname;
  const isAllowed = allowedDomains.some(domain => currentDomain.includes(domain));
  if (!isAllowed) {
    document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;">Akses tidak dibenarkan</h1>';
    return;
  }
})();

function showTranslation() {
  const box = document.getElementById('translationBox');
  const boxes = ['transliterationBox', 'audioPlayer'];
  boxes.forEach(id => document.getElementById(id).style.display = 'none');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function showTransliteration() {
  const box = document.getElementById('transliterationBox');
  const boxes = ['translationBox', 'audioPlayer'];
  boxes.forEach(id => document.getElementById(id).style.display = 'none');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function playAudio() {
  const box = document.getElementById('audioPlayer');
  const boxes = ['translationBox', 'transliterationBox'];
  boxes.forEach(id => document.getElementById(id).style.display = 'none');
  box.style.display = 'block';
  
  setTimeout(() => {
    box.innerHTML = '<p style="margin: 0; color: #2d3748; font-weight: 600;">✅ Audio selesai dimainkan</p><p style="margin: 8px 0 0 0; color: #718096; font-size: 14px;">Ulangi bacaan untuk meningkatkan pahala</p>';
  }, 3000);
}

function shareSelawat() {
  if (navigator.share) {
    navigator.share({
      title: 'Selawat Tafrijiyyah (Nariyah)',
      text: 'Amalkan Selawat Tafrijiyyah untuk kelapangan hidup. Panduan lengkap dengan teks sahih dan audio:',
      url: window.location.href
    }).catch(err => console.log('Share cancelled'));
  } else {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('✅ Link telah disalin! Kongsi dengan rakan-rakan anda.');
  }
}
