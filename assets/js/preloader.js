(function () {
  'use strict';

  var overlay = document.getElementById('preloader');
  var numEl   = overlay && overlay.querySelector('.preloader-num');
  if (!overlay || !numEl) return;

  // Déjà visité dans cette session → skip le préchargeur
  if (sessionStorage.getItem('jho-visited')) {
    overlay.remove();
    document.dispatchEvent(new CustomEvent('anim-ready'));
    return;
  }
  sessionStorage.setItem('jho-visited', '1');

  var current  = 0;
  var target   = 0;
  var loadDone = false;
  var timeDone = false;
  var hiding   = false;
  var rafId;

  function setTarget(n) {
    target = Math.max(target, Math.min(100, Math.round(n)));
  }

  function tick() {
    if (current < target) {
      var step = Math.max(1, Math.ceil((target - current) * 0.07));
      current = Math.min(target, current + step);
      numEl.textContent = current;
    }
    if (current >= 100 && loadDone && timeDone && !hiding) {
      hiding = true;
      hide();
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  function hide() {
    overlay.classList.add('hide');
    // Les animations d'entrée démarrent en même temps que le préchargeur monte
    document.dispatchEvent(new CustomEvent('anim-ready'));
    setTimeout(function () { overlay.remove(); }, 920);
  }

  function tryComplete() {
    if (loadDone && timeDone) setTarget(100);
  }

  // Progression initiale
  setTarget(8);
  rafId = requestAnimationFrame(tick);

  // DOM prêt → suivi des images
  document.addEventListener('DOMContentLoaded', function () {
    setTarget(20);
    var imgs  = Array.from(document.querySelectorAll('img'));
    var total = imgs.length;
    var done  = 0;
    function onImg() {
      done++;
      setTarget(20 + Math.round(done / Math.max(total, 1) * 65));
    }
    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth !== 0) { onImg(); }
      else { img.addEventListener('load', onImg); img.addEventListener('error', onImg); }
    });
    if (!total) setTarget(85);
  });

  // Tout chargé + durée minimum (1.4 s)
  window.addEventListener('load', function () { loadDone = true; tryComplete(); });
  setTimeout(function () { timeDone = true; tryComplete(); }, 1400);
})();
