// Ziyaretçi defteri: onaylı imzaları data/defter.json'dan okuyup en yenisi
// üstte olacak şekilde 10'arlı sayfalar hâlinde gösterir. :) gibi kodlar
// küçük surat resimlerine dönüşür. Form şimdilik hiçbir yere gitmiyor.
//
// Yeni imza eklemek için defter.json'un SONUNA şu biçimde bir kayıt ekle:
//   { "ad": "Ayşe", "sehir": "İzmir", "tarih": "2026-10-12", "mesaj": "Selam :)" }

(function () {
  var SAYFA_BASINA = 10;
  var SURATLAR = {
    ':)': 'gulen',
    ';)': 'goz-kirpan',
    ':P': 'dil',
    ':p': 'dil',
    '<3': 'kalp'
  };
  var SURAT_DESENI = /(:\)|;\)|:P|:p|<3)/;

  var liste = document.querySelector('.imza-listesi');
  var toplam = document.querySelector('.imza-toplam');
  var sayfalama = document.querySelector('.imza-sayfalama');
  var sayfaYazisi = document.querySelector('.imza-sayfa');
  var tarihBicimi = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  var imzalar = [];
  var sayfa = 0;

  // Metni güvenle yaz, surat kodlarını resme çevir
  function suratli(el, metin) {
    metin.split(SURAT_DESENI).forEach(function (parca) {
      if (!parca) return;
      if (SURATLAR[parca]) {
        var img = document.createElement('img');
        img.className = 'surat';
        img.src = 'img/surat/' + SURATLAR[parca] + '.svg';
        img.alt = parca;
        img.width = 20;
        img.height = 20;
        el.appendChild(img);
      } else {
        el.appendChild(document.createTextNode(parca));
      }
    });
  }

  function imzaKutusu(imza) {
    var kutu = document.createElement('article');
    kutu.className = 'imza';

    var ust = document.createElement('header');
    ust.className = 'imza-ust';
    var no = document.createElement('span');
    no.className = 'imza-no';
    no.textContent = '#' + imza.no;
    var ad = document.createElement('strong');
    ad.className = 'imza-ad';
    ad.textContent = imza.ad;
    ust.append(no, ad);
    if (imza.sehir) {
      var sehir = document.createElement('span');
      sehir.className = 'imza-sehir';
      sehir.textContent = '(' + imza.sehir + ')';
      ust.append(sehir);
    }
    var tarih = document.createElement('time');
    tarih.className = 'imza-tarih';
    tarih.dateTime = imza.tarih;
    tarih.textContent = tarihBicimi.format(new Date(imza.tarih + 'T00:00:00Z'));
    ust.append(tarih);

    var mesaj = document.createElement('p');
    mesaj.className = 'imza-mesaj';
    suratli(mesaj, imza.mesaj);

    kutu.append(ust, mesaj);
    return kutu;
  }

  function goster() {
    var sayfaSayisi = Math.max(1, Math.ceil(imzalar.length / SAYFA_BASINA));
    sayfa = Math.min(Math.max(sayfa, 0), sayfaSayisi - 1);
    liste.textContent = '';
    imzalar.slice(sayfa * SAYFA_BASINA, (sayfa + 1) * SAYFA_BASINA).forEach(function (imza) {
      liste.appendChild(imzaKutusu(imza));
    });
    toplam.textContent = 'Defterde ' + imzalar.length + ' imza var.';
    sayfalama.hidden = sayfaSayisi < 2;
    sayfaYazisi.textContent = 'Sayfa ' + (sayfa + 1) + ' / ' + sayfaSayisi;
    sayfalama.querySelector('[data-yon="-1"]').disabled = sayfa === 0;
    sayfalama.querySelector('[data-yon="1"]').disabled = sayfa === sayfaSayisi - 1;
  }

  sayfalama.addEventListener('click', function (e) {
    var dugme = e.target.closest('[data-yon]');
    if (!dugme) return;
    sayfa += Number(dugme.dataset.yon);
    goster();
    document.getElementById('imzalar-baslik').scrollIntoView({ behavior: 'smooth' });
  });

  fetch('data/defter.json')
    .then(function (yanit) {
      if (!yanit.ok) throw new Error(yanit.status);
      return yanit.json();
    })
    .then(function (veri) {
      // Dosyadaki sıra = imza sırası; numarayı ver, en yenisini üste al
      imzalar = veri.map(function (imza, i) {
        return Object.assign({ no: i + 1 }, imza);
      }).reverse();
      goster();
    })
    .catch(function () {
      toplam.textContent = 'İmzalar şu an yüklenemedi, biraz sonra tekrar dener misin?';
    });

  // Surat butonları: kodu imlecin olduğu yere ekle
  var mesajKutusu = document.getElementById('defter-mesaj');
  document.querySelectorAll('.surat-dugme').forEach(function (dugme) {
    dugme.addEventListener('click', function () {
      var kod = ' ' + dugme.dataset.kod + ' ';
      mesajKutusu.setRangeText(kod, mesajKutusu.selectionStart, mesajKutusu.selectionEnd, 'end');
      mesajKutusu.focus();
    });
  });

  // İmza formu: kısa bir "gönderiliyor" anından sonra teşekkür ekranı
  var form = document.getElementById('defter-formu');
  var durum = form.querySelector('.mektup-durum');
  var tamam = document.querySelector('.gonderildi');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    durum.textContent = 'Deftere yazılıyor...';
    form.querySelector('[type="submit"]').disabled = true;
    setTimeout(function () {
      form.hidden = true;
      tamam.hidden = false;
      tamam.focus();
    }, 700);
  });
})();
