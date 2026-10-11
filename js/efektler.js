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

  if (hareketAzalt) {
    document.querySelectorAll('marquee').forEach(function (m) {
      if (m.stop) m.stop();
    });
    return;
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
