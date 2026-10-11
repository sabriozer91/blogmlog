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

  // Giriş sayfası: arkadaki çiçekler tek tek döner, %80–%100 arası nefes alır
  if (document.body.classList.contains('giris')) cicekBahcesi();

  function cicekBahcesi() {
    var tuval = document.createElement('canvas');
    var ctx = tuval.getContext('2d');
    if (!ctx || !window.Path2D) return;
    tuval.className = 'cicek-tuvali';
    tuval.setAttribute('aria-hidden', 'true');
    document.body.prepend(tuval);
    document.body.classList.add('cicekler-canli');

    // img/papatya-deseni.svg ile aynı desen: 96px karede 4 papatya [x, y, açı, boy]
    var DESEN = 96;
    var YERLESIM = [[24, 24, 0, 1], [72, 72, 15, 1], [72, 22, 40, 0.7], [22, 74, 10, 0.75]];
    var yaprak = new Path2D('M0 -2 C 3.6 -6 3.6 -18 0 -21 C -3.6 -18 -3.6 -6 0 -2 Z');
    var dpr, kalip, cicekler, en = 0, boy = 0;
    var zemin = getComputedStyle(document.body).backgroundColor; // renk stil.css'te

    // Papatyayı bir kez küçük bir tuvale çiz, her karede onu döndürüp bas
    function kalipCiz() {
      kalip = document.createElement('canvas');
      kalip.width = kalip.height = Math.ceil(48 * dpr);
      var c = kalip.getContext('2d');
      c.translate(kalip.width / 2, kalip.height / 2);
      c.scale(dpr, dpr);

      // Arka sıra: aralara düşen, biraz kısa kremimsi yapraklar
      c.fillStyle = '#f3ece0';
      for (var i = 0; i < 16; i++) {
        c.save(); c.rotate((i + 0.5) * Math.PI / 8); c.scale(0.92, 0.92); c.fill(yaprak); c.restore();
      }
      // Ön sıra: ince kenarlı beyaz yapraklar
      c.fillStyle = '#ffffff';
      c.strokeStyle = '#cdbfa6';
      c.lineWidth = 0.8;
      for (i = 0; i < 16; i++) {
        c.save(); c.rotate(i * Math.PI / 8); c.fill(yaprak); c.stroke(yaprak); c.restore();
      }

      var gobek = c.createRadialGradient(-1.5, -1.5, 0, -1.5, -1.5, 6);
      gobek.addColorStop(0, '#fff2a0');
      gobek.addColorStop(1, '#eba400');
      c.beginPath();
      c.arc(0, 0, 5, 0, Math.PI * 2);
      c.fillStyle = gobek;
      c.fill();
      c.strokeStyle = '#b47600';
      c.stroke();
    }

    function kur() {
      // Adres çubuğu açılıp kapanınca yeniden karıştırma; sadece boyut gerçekten değişince kur
      if (tuval.clientWidth === en && tuval.clientHeight === boy) return;
      en = tuval.clientWidth;
      boy = tuval.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      tuval.width = Math.round(en * dpr);
      tuval.height = Math.round(boy * dpr);
      kalipCiz();

      cicekler = [];
      for (var y = 0; y < boy; y += DESEN) {
        for (var x = 0; x < en; x += DESEN) {
          YERLESIM.forEach(function (p) {
            cicekler.push({
              x: x + p[0],
              y: y + p[1],
              boy: p[3],
              aci: rastgele(0, Math.PI * 2),
              hiz: rastgele(0.15, 0.45) * (Math.random() < 0.5 ? -1 : 1),
              nefes: rastgele(2.5, 6),
              faz: rastgele(0, Math.PI * 2)
            });
          });
        }
      }
    }

    function ciz(zaman) {
      var t = zaman / 1000;
      var yarim = kalip.width / 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = zemin;
      ctx.fillRect(0, 0, tuval.width, tuval.height);
      for (var i = 0; i < cicekler.length; i++) {
        var c = cicekler[i];
        var olcek = c.boy * (0.9 + 0.1 * Math.sin(t * 2 * Math.PI / c.nefes + c.faz));
        var a = c.aci + c.hiz * t;
        var cos = Math.cos(a) * olcek;
        var sin = Math.sin(a) * olcek;
        ctx.setTransform(cos, sin, -sin, cos, c.x * dpr, c.y * dpr);
        ctx.drawImage(kalip, -yarim, -yarim);
      }
      requestAnimationFrame(ciz);
    }

    var bekle;
    window.addEventListener('resize', function () {
      clearTimeout(bekle);
      bekle = setTimeout(kur, 150);
    });

    kur();
    requestAnimationFrame(ciz);
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
