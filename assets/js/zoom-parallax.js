(function () {
  'use strict';

  // Scales finales — valeurs exactes du composant ZoomParallax d'origine
  var SCALES = [4, 5, 6, 5, 6, 8, 9];

  document.addEventListener('DOMContentLoaded', function () {
    var section = document.getElementById('zoom-parallax');
    if (!section) return;

    var stage = section.querySelector('[data-zoom-stage]');
    var featured = (window.JHO_WORKS || []).filter(function (w) { return w.featured; });
    if (featured.length === 0) return;

    // Sept tuiles requises par le composant ; on boucle si on a moins d'œuvres
    var tilesData = [];
    for (var i = 0; i < 7; i++) {
      tilesData.push(featured[i % featured.length]);
    }

    tilesData.forEach(function (work, idx) {
      var tile = document.createElement('div');
      tile.className = 'zp-tile zp-i' + (idx + 1);

      var inner = document.createElement('div');
      inner.className = 'zp-inner';

      var a = document.createElement('a');
      a.href = 'oeuvre.html?w=' + encodeURIComponent(work.slug);
      a.className = 'zp-link';

      var img = document.createElement('img');
      img.src = work.img;
      img.alt = work.title || '';
      img.loading = 'lazy';

      a.appendChild(img);
      inner.appendChild(a);
      tile.appendChild(inner);
      stage.appendChild(tile);
    });

    var tiles = stage.querySelectorAll('.zp-tile');
    var bgText = stage.querySelector('.zp-bg-text');
    var bgSub  = stage.querySelector('.zp-bg-sub');
    var bgCta  = stage.querySelector('.zp-bg-cta');
    var pending = false;

    function update() {
      var rect = section.getBoundingClientRect();
      var scrollable = section.offsetHeight - window.innerHeight;
      var p = scrollable > 0 ? -rect.top / scrollable : 0;
      p = Math.max(0, Math.min(1, p));

      tiles.forEach(function (tile, i) {
        var scale = 1 + (SCALES[i] - 1) * p;
        tile.style.transform = 'scale(' + scale + ')';
        if (i === 0) {
          var opacity = p < 0.25 ? 1 : p > 0.50 ? 0 : 1 - (p - 0.25) / 0.25; // ← image : 25%-50%
          tile.querySelector('.zp-inner').style.opacity = opacity;
        }
      });
      if (bgText) {
        var tOpacity = p < 0.40 ? 0 : p > 0.60 ? 1 : (p - 0.40) / 0.20;
        if (bgText) bgText.style.opacity = tOpacity;
        if (bgSub)  bgSub.classList.toggle('visible', p >= 0.55);
        if (bgCta)  bgCta.classList.toggle('visible', p >= 0.60);
      }

      pending = false;
    }

    window.addEventListener('scroll', function () {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  });
})();
