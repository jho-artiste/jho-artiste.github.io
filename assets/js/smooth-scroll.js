(function () {
  'use strict';

  // ← Régler l'intensité ici : 0.04 = très doux · 0.08 = équilibré · 0.15 = réactif
  var ease = 0.08;

  // Pas de smooth scroll sur écrans tactiles (déjà fluide nativement)
  if (window.matchMedia('(hover: none)').matches) return;

  var current = 0;
  var target  = 0;
  var raf     = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    current = lerp(current, target, ease);
    if (Math.abs(target - current) > 0.3) {
      window.scrollTo(0, Math.round(current));
      raf = requestAnimationFrame(tick);
    } else {
      window.scrollTo(0, target);
      current = target;
      raf = null;
    }
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    var max = document.documentElement.scrollHeight - window.innerHeight;
    target = Math.max(0, Math.min(max, target + e.deltaY));
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: false });

  window.addEventListener('keydown', function (e) {
    var max  = document.documentElement.scrollHeight - window.innerHeight;
    var step = window.innerHeight * 0.75;
    var delta = { ArrowDown: 100, ArrowUp: -100, PageDown: step, PageUp: -step }[e.key];
    if (e.key === 'Home') { e.preventDefault(); target = 0; }
    else if (e.key === 'End') { e.preventDefault(); target = max; }
    else if (delta !== undefined) { e.preventDefault(); target = Math.max(0, Math.min(max, target + delta)); }
    else return;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  window.addEventListener('load', function () { current = target = window.scrollY; });
})();
