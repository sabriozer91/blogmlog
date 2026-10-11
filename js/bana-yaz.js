// Bana Yaz formu: şimdilik mesajlar hiçbir yere gitmiyor. Kısa bir
// "gönderiliyor" anından sonra teşekkür mesajı ve altında dans GIF'i çıkar.
// FormSubmit bağlanınca buradaki zamanlayıcı gerçek gönderimle değişecek.

(function () {
  var form = document.getElementById('mektup');
  if (!form) return;

  var durum = form.querySelector('.mektup-durum');
  var dugme = form.querySelector('[type="submit"]');
  var tamam = document.querySelector('.gonderildi');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    durum.textContent = 'Gönderiliyor...';
    dugme.disabled = true;
    setTimeout(basarili, 700);
  });

  function basarili() {
    form.hidden = true;
    // GIF'i ancak şimdi ekle ki baştan oynasın
    var gif = document.createElement('img');
    gif.className = 'tesekkur-gif';
    gif.src = 'img/tesekkurler.webp';
    gif.alt = 'Sevinçle dans eden bir çocuk';
    gif.width = 160;
    gif.height = 240;
    tamam.appendChild(gif);
    tamam.hidden = false;
    tamam.focus();
  }
})();
