// Port vanilla du composant <InkReveal /> (21st.dev).
// Comportement : remplit un canvas d'une couleur de masque opaque ; le passage
// de la souris "creuse" l'encre via destination-out, révélant le média sous-jacent.
// Chaque coup de pinceau se résorbe après `lifetime` ms.

(function () {
  function init(canvas, opts) {
    if (!canvas) return;
    opts = opts || {};

    var maskColor = opts.maskColor || [252, 250, 248];
    var brushSize = opts.brushSize || 128;
    var lifetime = opts.lifetime || 600;
    var rStart = opts.rStart || 10;
    var rVary = opts.rVary || 0.45;
    var stampStep = opts.stampStep || 10;
    var maxStamps = opts.maxStamps || 200;
    var segments = opts.segments || 36;
    var wobble = opts.wobble || [0.14, 0.08, 0.05];
    var gradientInnerRadius = opts.gradientInnerRadius || 0.2;
    var gradientStops = opts.gradientStops || [0.95, 0.88, 0];

    var ctx = canvas.getContext('2d');
    var stamps = [];
    var lastPos = null;
    var running = false;
    var dims = { w: 0, h: 0 };
    var maskFill = 'rgb(' + maskColor[0] + ',' + maskColor[1] + ',' + maskColor[2] + ')';

    function resize() {
      var parent = canvas.parentElement;
      if (!parent) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = parent.getBoundingClientRect();
      dims.w = rect.width;
      dims.h = rect.height;
      canvas.width = Math.round(dims.w * dpr);
      canvas.height = Math.round(dims.h * dpr);
      canvas.style.width = dims.w + 'px';
      canvas.style.height = dims.h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = maskFill;
      ctx.fillRect(0, 0, dims.w, dims.h);
    }

    function carveInk(x, y, r, seed, alpha) {
      var g = ctx.createRadialGradient(x, y, r * gradientInnerRadius, x, y, r);
      g.addColorStop(0,   'rgba(0,0,0,' + (gradientStops[0] * alpha) + ')');
      g.addColorStop(0.5, 'rgba(0,0,0,' + (gradientStops[1] * alpha) + ')');
      g.addColorStop(1,   'rgba(0,0,0,' + (gradientStops[2] * alpha) + ')');
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

    function addStamp(x, y) {
      if (stamps.length >= maxStamps) stamps.shift();
      stamps.push({
        x: x, y: y,
        born: performance.now(),
        seed: Math.random() * Math.PI * 2,
        rmax: brushSize * (1 - rVary + Math.random() * rVary),
      });
    }

    function stampAlong(x, y) {
      if (!lastPos) {
        addStamp(x, y);
      } else {
        var dx = x - lastPos.x;
        var dy = y - lastPos.y;
        var dist = Math.hypot(dx, dy);
        var steps = Math.max(1, Math.ceil(dist / stampStep));
        for (var i = 1; i <= steps; i++) {
          addStamp(lastPos.x + (dx * i) / steps, lastPos.y + (dy * i) / steps);
        }
      }
      lastPos = { x: x, y: y };
    }

    function loop() {
      var now = performance.now();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = maskFill;
      ctx.fillRect(0, 0, dims.w, dims.h);
      ctx.globalCompositeOperation = 'destination-out';
      for (var i = stamps.length - 1; i >= 0; i--) {
        var t = (now - stamps[i].born) / lifetime;
        if (t >= 1) { stamps.splice(i, 1); continue; }
        var ease = 1 - Math.pow(1 - t, 3);
        var r = rStart + (stamps[i].rmax - rStart) * ease;
        var alpha = 1 - t * t;
        carveInk(stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha);
      }
      if (stamps.length) requestAnimationFrame(loop);
      else running = false;
    }

    function startLoop() {
      if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function posFrom(e) {
      var rect = canvas.getBoundingClientRect();
      var src = e.touches && e.touches[0] ? e.touches[0] : e;
      return { x: src.clientX - rect.left, y: src.clientY - rect.top };
    }

    // Souris : trace le pinceau, l'encre se referme quand on s'arrête
    canvas.addEventListener('mouseenter', function (e) {
      var p = posFrom(e); lastPos = p; stampAlong(p.x, p.y); startLoop();
    });
    canvas.addEventListener('mousemove', function (e) {
      var p = posFrom(e); stampAlong(p.x, p.y); startLoop();
    });
    canvas.addEventListener('mouseleave', function () { lastPos = null; });

    // Tactile : le doigt qui glisse fait office de pinceau
    canvas.addEventListener('touchstart', function (e) {
      var p = posFrom(e); lastPos = p; stampAlong(p.x, p.y); startLoop();
    }, { passive: true });
    canvas.addEventListener('touchmove', function (e) {
      var p = posFrom(e); stampAlong(p.x, p.y); startLoop();
    }, { passive: true });
    canvas.addEventListener('touchend', function () { lastPos = null; });
    canvas.addEventListener('touchcancel', function () { lastPos = null; });

    resize();
    var ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement);
    } else {
      window.addEventListener('resize', resize);
    }
  }

  window.JHO = window.JHO || {};
  window.JHO.initInkReveal = init;
})();
