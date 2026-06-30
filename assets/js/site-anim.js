(function () {
  'use strict';

  function splitChars(el) {
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

  // API pour les titres dynamiques (page oeuvre)
  window.JHO_ANIM = {
    animTitle: function (el) {
      if (!el || el.classList.contains('char-anim-text')) return;
      splitChars(el);
      if (document.getElementById('preloader')) {
        document.addEventListener('anim-ready', function () { el.classList.add('revealed'); });
      } else {
        el.classList.add('revealed');
      }
    }
  };

  document.addEventListener('DOMContentLoaded', function () {

    // ── Préparation DOM ───────────────────────────────────────────────
    var charEls = [];
    document.querySelectorAll('h1:not([data-field]), h2').forEach(function (el) {
      splitChars(el);
      charEls.push(el);
    });

    var fadeEls = [];
    [
      '.eyebrow-muted', '.lead', '.about-intro p', '.about-intro .quote',
      '.portrait', '.contact-info', '.contact-form',
      '.work-carousel-col', '.specs', '.cta-link',
    ].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('fade-up-el');
        fadeEls.push(el);
      });
    });

    document.querySelectorAll('.milestone').forEach(function (el, i) {
      el.classList.add('fade-up-el');
      el.style.animationDelay = (i * 0.12) + 's';
      fadeEls.push(el);
    });

    // ── Révélation : attend la fin du préchargeur ─────────────────────
    function doReveal() {
      if (!window.IntersectionObserver) {
        charEls.concat(fadeEls).forEach(function (el) { el.classList.add('revealed'); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08 });
      charEls.concat(fadeEls).forEach(function (el) { io.observe(el); });
    }

    if (document.getElementById('preloader')) {
      document.addEventListener('anim-ready', doReveal);
    } else {
      doReveal();
    }
  });
})();
