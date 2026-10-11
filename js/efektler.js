// blogmlog efektleri: dalgalı WordArt, imleç pırıltısı, kayan yazı

(function () {
  var hareketAzalt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dalgalı WordArt: harfleri bölüp her birini sinüs eğrisine oturt
  document.querySelectorAll('.wordart-dalga').forEach(function (el) {
    var harfler = Array.from(el.textContent);
    el.setAttribute('aria-label', el.textContent);
    el.textContent = '';
    harfler.forEach(function (harf, i) {
      var span = document.createElement('span');
      span.setAttribute('aria-hidden', 'true');
      span.textContent = harf === ' ' ? ' ' : harf;
      var t = harfler.length > 1 ? i / (harfler.length - 1) : 0;
      var y = Math.sin(t * Math.PI * 2) * -0.09;
      var olcek = 1 + Math.sin(t * Math.PI) * 0.18;
      span.style.transform = 'translateY(' + y + 'em) scaleY(' + olcek + ')';
      el.appendChild(span);
    });
    el.classList.add('dalgali');
  });

  function rastgele(min, max) { return min + Math.random() * (max - min); }

  // Yan menüdeki gökyüzü: rastgele yerlerde büyüyüp küçülen yıldızlar
  var menu = document.querySelector('.yan-menu');
  var gok = null;
  if (menu) {
    gok = document.createElement('div');
    gok.className = 'gokyuzu';
    gok.setAttribute('aria-hidden', 'true');
    menu.prepend(gok);

    var adet = Math.round(menu.clientWidth * menu.clientHeight / 6500);
    adet = Math.max(8, Math.min(28, adet));
    for (var i = 0; i < adet; i++) {
      var yildiz = document.createElement('span');
      yildiz.className = 'yildiz';
      yildiz.style.left = rastgele(4, 96) + '%';
      yildiz.style.top = rastgele(2, 98) + '%';
      yildiz.style.setProperty('--boy', rastgele(9, 19).toFixed(1) + 'px');
      yildiz.style.setProperty('--sure', rastgele(2, 5).toFixed(2) + 's');
      yildiz.style.setProperty('--gecikme', -rastgele(0, 5).toFixed(2) + 's');
      gok.appendChild(yildiz);
    }
  }

  if (hareketAzalt) {
    document.querySelectorAll('marquee').forEach(function (m) {
      if (m.stop) m.stop();
    });
    return;
  }

  // Kayan yıldız: birkaç saniyede bir soldan sağa çapraz bir çizgi
  if (gok) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var kayanSayisi = 0;

    var kayanYildiz = function () {
      if (!document.hidden) {
        var uzunluk = rastgele(110, 170);
        var aci = rastgele(12, 30) * Math.PI / 180;
        var en = Math.round(uzunluk * Math.cos(aci));
        var boy = Math.round(uzunluk * Math.sin(aci));
        var id = 'kuyruk-' + (++kayanSayisi);

        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'kayan-yildiz');
        svg.setAttribute('width', en + 4);
        svg.setAttribute('height', boy + 4);
        svg.style.left = rastgele(-30, Math.max(0, gok.clientWidth - en * 0.6)) + 'px';
        svg.style.top = rastgele(0, gok.clientHeight * 0.7) + 'px';
        svg.innerHTML =
          '<defs><linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="' + (en + 2) + '" y2="' + (boy + 2) + '">' +
          '<stop offset="0" stop-color="#fff" stop-opacity="0"/>' +
          '<stop offset=".75" stop-color="#cfe0ff" stop-opacity=".7"/>' +
          '<stop offset="1" stop-color="#fff"/>' +
          '</linearGradient></defs>' +
          '<path d="M2 2 L' + (en + 2) + ' ' + (boy + 2) + '" pathLength="100" stroke="url(#' + id + ')"/>';
        svg.addEventListener('animationend', function () { svg.remove(); });
        gok.appendChild(svg);
      }
      setTimeout(kayanYildiz, rastgele(3500, 8000));
    };

    setTimeout(kayanYildiz, rastgele(1000, 2500));
  }

  // İmleç pırıltısı (sadece fare ile)
  var isaretler = ['✦', '✧', '★', '✶'];
  var renkler = ['#ff5fc8', '#ffe14d', '#7ff6ff', '#ffffff', '#b38cff'];
  var son = 0;

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var simdi = performance.now();
    if (simdi - son < 45) return;
    son = simdi;

    var p = document.createElement('span');
    p.className = 'pirilti';
    p.setAttribute('aria-hidden', 'true');
    p.textContent = isaretler[Math.floor(Math.random() * isaretler.length)];
    p.style.color = renkler[Math.floor(Math.random() * renkler.length)];
    p.style.left = e.clientX + 'px';
    p.style.top = e.clientY + 'px';
    p.addEventListener('animationend', function () { p.remove(); });
    document.body.appendChild(p);
  });
})();
