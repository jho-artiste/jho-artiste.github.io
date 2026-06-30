(function () {
  'use strict';

  function splitChars(el) {
    if (!el) return;
    var frag = document.createDocumentFragment();
    el.textContent.split('').forEach(function (ch, i) {
      var wrap = document.createElement('span');
      wrap.className = 'anim-char-wrap';
      var inner = document.createElement('span');
      inner.className = 'anim-char';
      inner.style.animationDelay = (i * 0.028) + 's';
      inner.textContent = ch === ' ' ? ' ' : ch;
      wrap.appendChild(inner);
      frag.appendChild(wrap);
    });
    el.textContent = '';
    el.appendChild(frag);
    el.classList.add('char-anim-text');
  }

  function reveal(el, delay) {
    if (!el) return;
    setTimeout(function () { el.classList.add('revealed'); }, delay || 0);
  }

  document.addEventListener('DOMContentLoaded', function () {

    // ── Préparation DOM (invisible, avant anim-ready) ─────────────────
    splitChars(document.querySelector('.hero h1'));
    splitChars(document.querySelector('.intro h2'));

    var heroFade = [
      document.querySelector('.hero .eyebrow'),
      document.querySelector('.hero .sub'),
      document.querySelector('.hero .cta'),
    ].filter(Boolean);
    heroFade.forEach(function (el) { el.classList.add('fade-up-el'); });

    var introFade = [
      document.querySelector('.intro .portrait'),
      document.querySelector('.intro .eyebrow-muted'),
      document.querySelector('.intro p'),
      document.querySelector('.intro .signature'),
    ].filter(Boolean);
    introFade.forEach(function (el) { el.classList.add('fade-up-el'); });

    var introH2 = document.querySelector('.intro h2');

    // ── Révélation : attend la fin du préchargeur ─────────────────────
    function doReveal() {
      // Hero : échelonné
      heroFade.forEach(function (el, i) { reveal(el, 80 + i * 160); });
      reveal(document.querySelector('.hero h1'), 240);

      // Intro : IntersectionObserver
      if (!window.IntersectionObserver) {
        introFade.forEach(function (el) { el.classList.add('revealed'); });
        if (introH2) introH2.classList.add('revealed');
        return;
      }
      var fired = false;
      var io = new IntersectionObserver(function (entries) {
        if (fired) return;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          fired = true;
          io.disconnect();
          reveal(introFade[0], 0);
          reveal(introFade[1], 0);
          reveal(introH2, 80);
          reveal(introFade[2], 200);
          reveal(introFade[3], 320);
        });
      }, { threshold: 0.12 });
      var intro = document.querySelector('.intro');
      if (intro) io.observe(intro);
    }

    if (document.getElementById('preloader')) {
      document.addEventListener('anim-ready', doReveal);
    } else {
      doReveal();
    }
  });
})();
