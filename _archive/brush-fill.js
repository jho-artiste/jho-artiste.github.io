// Brush-fill : remplit un élément avec une peinture au pinceau qui suit le curseur.
// Réutilise la même mécanique de stamps wobbly que l'ink-reveal du hero.
//
// Usage minimal :
//   JHO.brushFill(element);
//
// Avec options :
//   JHO.brushFill(element, {
//     color: [61, 90, 76],   // RGB de la peinture
//     brushSize: 80,         // rayon max d'un stamp (px)
//     rVary: 0.3,            // variation aléatoire du rayon (0–1)
//     stampStep: 5,          // pas entre deux stamps le long du tracé (px)
//     segments: 28,          // segments du contour wobbly (plus = plus lisse)
//     wobble: [.14,.08,.05], // amplitudes des 3 sinus du contour
//     fadeMs: 300,           // durée du fade-out quand le curseur quitte
//     initialBurst: true,    // pose 3 stamps au survol pour couvrir tout de suite
//   });
//
// Au montage, brushFill enveloppe le contenu de l'élément dans un <span class="brush-label">
// et y ajoute un <canvas class="brush-canvas">. L'élément reçoit la classe `is-filling`
// pendant le survol, puis `fading-out` jusqu'à la fin du fade. Le CSS de l'élément peut
// s'appuyer sur ces classes pour inverser ses couleurs.

(function () {
  function brushFill(el, opts) {
    if (!el) return;
    opts = opts || {};
    var color        = opts.color        || [61, 90, 76];
    var brushSize    = opts.brushSize    || 80;
    var rVary        = opts.rVary        || 0.3;
    var stampStep    = opts.stampStep    || 5;
    var segments     = opts.segments     || 28;
    var wobble       = opts.wobble       || [0.14, 0.08, 0.05];
    var fadeMs       = opts.fadeMs       || 300;
    var initialBurst = opts.initialBurst !== false;

    // Envelopper le contenu existant dans un span pour qu'il reste au-dessus du canvas
    if (!el.querySelector('.brush-label')) {
      var label = document.createElement('span');
      label.className = 'brush-label';
      while (el.firstChild) label.appendChild(el.firstChild);
      el.appendChild(label);
    }
    // Canvas de peinture
    var canvas = el.querySelector('.brush-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'brush-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      el.appendChild(canvas);
    }
    var ctx = canvas.getContext('2d');
    var rgb = color.join(',');
    var lastPos = null;
    var dims = { w: 0, h: 0 };
    var fadeTimer = null;

    function resize() {
      var rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      dims.w = rect.width; dims.h = rect.height;
      canvas.width  = Math.round(dims.w * dpr);
      canvas.height = Math.round(dims.h * dpr);
      canvas.style.width  = dims.w + 'px';
      canvas.style.height = dims.h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, dims.w, dims.h);
    }

    function paintAt(x, y, r, seed) {
      var g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r);
      g.addColorStop(0,   'rgba(' + rgb + ',1)');
      g.addColorStop(0.5, 'rgba(' + rgb + ',0.92)');
      g.addColorStop(1,   'rgba(' + rgb + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      for (var i = 0; i <= segments; i++) {
        var a = (i / segments) * Math.PI * 2;
        var wob = 0.78
          + wobble[0] * Math.sin(a * 3 + seed)
          + wobble[1] * Math.sin(a * 5 + seed * 2.1)
          + wobble[2] * Math.sin(a * 7 + seed * 0.7);
        var px = x + Math.cos(a) * r * wob;
        var py = y + Math.sin(a) * r * wob;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }

    function stamp(x, y) {
      paintAt(
        x, y,
        brushSize * (1 - rVary + Math.random() * rVary),
        Math.random() * Math.PI * 2
      );
    }

    function trail(x, y) {
      if (!lastPos) {
        stamp(x, y);
      } else {
        var dx = x - lastPos.x, dy = y - lastPos.y;
        var dist = Math.hypot(dx, dy);
        var steps = Math.max(1, Math.ceil(dist / stampStep));
        for (var i = 1; i <= steps; i++) {
          stamp(lastPos.x + dx * i / steps, lastPos.y + dy * i / steps);
        }
      }
      lastPos = { x: x, y: y };
    }

    function posFrom(e) {
      var r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function clearFade() {
      if (fadeTimer) { clearTimeout(fadeTimer); fadeTimer = null; }
    }

    el.addEventListener('pointerenter', function (e) {
      clearFade();
      el.classList.remove('fading-out');
      el.classList.add('is-filling');
      var p = posFrom(e);
      lastPos = p;
      if (initialBurst) {
        // Carpet-bomb : 3 stamps répartis horizontalement pour remplir tout le bouton
        stamp(dims.w * 0.25, dims.h / 2);
        stamp(dims.w * 0.50, dims.h / 2);
        stamp(dims.w * 0.75, dims.h / 2);
      }
      stamp(p.x, p.y);
    });
    el.addEventListener('pointermove', function (e) {
      if (!el.classList.contains('is-filling')) return;
      var p = posFrom(e);
      trail(p.x, p.y);
    });
    el.addEventListener('pointerleave', function () {
      el.classList.remove('is-filling');
      el.classList.add('fading-out');
      lastPos = null;
      fadeTimer = setTimeout(function () {
        ctx.clearRect(0, 0, dims.w, dims.h);
        el.classList.remove('fading-out');
        fadeTimer = null;
      }, fadeMs);
    });

    resize();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(el);
    } else {
      window.addEventListener('resize', resize);
    }
  }

  window.JHO = window.JHO || {};
  window.JHO.brushFill = brushFill;
})();
