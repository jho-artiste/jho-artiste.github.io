// Catalogue des œuvres.
// Pour ajouter une œuvre : pousse un objet en bas de la liste, puis dépose
// l'image dans site/assets/img/works/ avec le nom de `img`.
// `tile`     : couleur du placeholder rayé tant que l'image n'est pas en place.
// `featured` : visible sur la page d'accueil.
// `status`   : 'available' | 'sold'         (filtre Disponibilité)
// `kind`     : 'original'  | 'custom'       (filtre Type — Création jho / Personnalisée)
// `category` : 'tableau'   | 'vetement'     (filtre Catégorie)
window.JHO_WORKS = [
  {
    slug: 'renard',
    title: "Renard d'argent",
    year: 2024,
    technique: 'Acrylique sur toile',
    size: '100 × 100 cm',
    img: 'assets/img/works/fox.png',
    tile: 'tile-dark',
    featured: true,
    status: 'available',
    kind: 'original',
    category: 'tableau',
    description: "Un renard surgi de la nuit végétale, fourrure d'argent ourlée d'orange. La toile cherche la tension entre la matière vivante du regard et l'immobilité minérale du décor.",
    price: '1 800 €',
    availability: 'Pièce unique · disponible',
  },
  {
    slug: 'pablo',
    title: 'Pablo',
    year: 2024,
    technique: 'Acrylique sur toile',
    size: '80 × 100 cm',
    img: 'assets/img/works/pablo.png',
    tile: 'tile-light',
    featured: true,
    status: 'sold',
    kind: 'custom',
    category: 'tableau',
    description: "Portrait de famille face aux sommets — une commande personnelle, peinte en hommage à un premier hiver en montagne. Travail du blanc en plusieurs glacis.",
    price: 'Sur demande',
    availability: 'Œuvre de commande · contactez l\'atelier',
  },
  {
    slug: 'elephants',
    title: 'Deux éléphants',
    year: 2023,
    technique: 'Acrylique et encre sur toile',
    size: '116 × 89 cm',
    img: 'assets/img/works/elephants.png',
    tile: 'tile-mid',
    featured: true,
    status: 'sold',
    kind: 'original',
    category: 'tableau',
    description: "Tête contre tête, deux silhouettes grises devant une explosion de couleurs. L'arrière-plan, traité en projections, cherche à dire le vacarme du monde — eux, l'ignorent.",
    price: '2 400 €',
    availability: 'Pièce unique · disponible',
  },
  {
    slug: 'bouquet',
    title: 'Bouquet (Roses & orchidées)',
    year: 2023,
    technique: 'Huile sur toile',
    size: '60 × 60 cm',
    img: 'assets/img/works/bouquet.png',
    tile: 'tile-light',
    featured: true,
    status: 'available',
    kind: 'original',
    category: 'tableau',
    description: "Un bouquet nuptial peint d'après nature. Le fond géométrique en cuivre renvoie à la matière brute, contrepoint terrien aux pétales.",
    price: '1 200 €',
    availability: 'Pièce unique · disponible',
  },
  {
    slug: 'aubin',
    title: 'Aubin',
    year: 2024,
    technique: 'Acrylique sur toile',
    size: '80 × 100 cm',
    img: 'assets/img/works/aubin.png',
    tile: 'tile-dark',
    featured: true,
    status: 'sold',
    kind: 'custom',
    category: 'tableau',
    description: "Deux plongeurs main dans la main au-dessus du récif. Toile de commande, célébration d'une passion partagée.",
    price: 'Sur demande',
    availability: 'Œuvre de commande · contactez l\'atelier',
  },
  {
    slug: 'cheval',
    title: 'Cheval',
    year: 2024,
    technique: 'Acrylique sur toile',
    size: '60 × 80 cm',
    img: 'assets/img/works/cheval.png',
    tile: 'tile-mid',
    featured: true,
    status: 'available',
    kind: 'original',
    category: 'tableau',
    description: "Un cheval bai au repos, tête baissée devant un fond cuivré. Étude de la matière du pelage et du calme animal.",
    price: '1 400 €',
    availability: 'Pièce unique · disponible',
  },
];

(function () {
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardHtml(w, opts) {
    opts = opts || {};
    var sizeClass = opts.size || 'tall';
    var href = 'oeuvre.html?w=' + encodeURIComponent(w.slug);
    var hasImg = !!w.img;
    var imgTag = hasImg
      ? '<img src="' + escapeHtml(w.img) + '" alt="' + escapeHtml(w.title) + '" loading="lazy" onerror="this.remove()">'
      : '';
    return ''
      + '<a class="work-card ' + sizeClass + ' ' + (w.tile || 'tile-light') + '" href="' + href + '"'
      +   ' data-status="' + escapeHtml(w.status || 'available') + '"'
      +   ' data-kind="' + escapeHtml(w.kind || 'original') + '"'
      +   ' data-category="' + escapeHtml(w.category || 'tableau') + '">'
      + imgTag
      + '<span class="size">' + escapeHtml(w.size || '') + '</span>'
      + '<div class="overlay">'
      +   '<div class="meta">' + escapeHtml(w.title + ' - ' + w.year) + '</div>'
      + '</div>'
      + '</a>';
  }

  window.JHO = window.JHO || {};
  window.JHO.escapeHtml = escapeHtml;
  window.JHO.cardHtml = cardHtml;

  // Effet 3D au survol : tilt souris + lift. Activé via opts.enable3d.
  function init3DCard(card) {
    var rafId = null;
    var hovered = false;
    var tx = 0, ty = 0;

    function apply() {
      rafId = null;
      var rotY = tx * 10;        // gauche/droite
      var rotX = -ty * 10;       // haut/bas
      var lift = hovered ? 18 : 0;
      card.style.transform = 'perspective(1200px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateZ(' + lift + 'px)';
    }

    card.addEventListener('mouseenter', function () { hovered = true; });
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      tx = (x - 0.5) * 2;
      ty = (y - 0.5) * 2;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
      if (!rafId) rafId = requestAnimationFrame(apply);
    });
    card.addEventListener('mouseleave', function () {
      hovered = false;
      tx = 0; ty = 0;
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  }

  window.JHO.renderGrid = function (selector, opts) {
    var el = document.querySelector(selector);
    if (!el) return;
    opts = opts || {};
    var list = window.JHO_WORKS;
    if (opts.featuredOnly) list = list.filter(function (w) { return w.featured; });
    if (opts.limit) list = list.slice(0, opts.limit);
    if (opts.exclude) list = list.filter(function (w) { return w.slug !== opts.exclude; });
    el.innerHTML = list.map(function (w) { return cardHtml(w, opts); }).join('');
    if (opts.enable3d) {
      el.querySelectorAll('.work-card').forEach(init3DCard);
    }
  };

  window.JHO.findWork = function (slug) {
    return window.JHO_WORKS.find(function (w) { return w.slug === slug; });
  };

  // Cartes expansives pour la section "Œuvres associées".
  // Au survol d'une carte, sa colonne s'étend (5fr) tandis que les autres se rétractent (1fr).
  window.JHO.renderExpandingCards = function (selector, opts) {
    var el = document.querySelector(selector);
    if (!el) return;
    opts = opts || {};

    var list = window.JHO_WORKS;
    if (opts.exclude) list = list.filter(function (w) { return w.slug !== opts.exclude; });
    if (opts.limit) list = list.slice(0, opts.limit);

    el.innerHTML = list.map(function (w, i) {
      var href = 'oeuvre.html?w=' + encodeURIComponent(w.slug);
      var imgTag = w.img
        ? '<img src="' + escapeHtml(w.img) + '" alt="' + escapeHtml(w.title) + '" loading="lazy">'
        : '';
      return ''
        + '<li class="exp-card' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">'
        +   '<a href="' + href + '" class="exp-card-link">'
        +     imgTag
        +     '<div class="exp-card-shade"></div>'
        +     '<div class="exp-card-title-mini">' + escapeHtml(w.title) + '</div>'
        +     '<div class="exp-card-info">'
        +       '<h3 class="exp-card-title">' + escapeHtml(w.title) + '</h3>'
        +       '<p class="exp-card-year">' + escapeHtml(String(w.year)) + '</p>'
        +     '</div>'
        +   '</a>'
        + '</li>';
    }).join('');

    var cards = el.querySelectorAll('.exp-card');
    function setActive(i) {
      cards.forEach(function (c, j) {
        c.classList.toggle('active', j === i);
      });
      var cols = [];
      cards.forEach(function (_, j) { cols.push(j === i ? '5fr' : '1fr'); });
      el.style.gridTemplateColumns = cols.join(' ');
    }
    cards.forEach(function (card, i) {
      card.addEventListener('mouseenter', function () { setActive(i); });
      card.addEventListener('focusin',    function () { setActive(i); });
    });
    // État initial
    setActive(0);
  };

  window.JHO.initCarousel = function (images, work) {
    var wrap      = document.getElementById('carouselWrap');
    var slidesEl  = document.getElementById('carouselSlides');
    var prevBtn   = document.getElementById('carouselPrev');
    var nextBtn   = document.getElementById('carouselNext');
    var dotsEl    = document.getElementById('carouselDots');
    var lensClone = document.getElementById('lensClone');
    var lensImg   = document.getElementById('lensCloneImg');
    var lensRing  = document.getElementById('lensRing');

    if (!wrap || !slidesEl || !images.length) return;

    // Toujours au moins 3 slides pour voir le carrousel fonctionner
    while (images.length < 3) images = images.concat(images);
    images = images.slice(0, Math.max(3, images.length));

    var current    = 0;
    var total      = images.length;
    var ZOOM       = 2.5;
    var LENS_R     = 80;
    var isHovering = false;
    var lastX = 0, lastY = 0;

    // Construire les slides
    images.forEach(function (src, i) {
      var slide = document.createElement('div');
      slide.className = 'carousel-slide' + (i === 0 ? ' active' : '');
      var img = document.createElement('img');
      img.src = src;
      img.alt = work.title;
      img.draggable = false;
      slide.appendChild(img);
      slidesEl.appendChild(slide);
    });

    // Init image loupe
    if (images[0]) lensImg.src = images[0];

    function goTo(idx) {
      var slides = slidesEl.querySelectorAll('.carousel-slide');
      var dots   = dotsEl.querySelectorAll('.carousel-dot');
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = ((idx % total) + total) % total;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      lensImg.src = images[current];
      if (isHovering) updateLens(lastX, lastY);
    }

    // Navigation toujours visible
    if (total > 1) {
      prevBtn.removeAttribute('hidden');
      nextBtn.removeAttribute('hidden');
      images.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Image ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsEl.appendChild(dot);
      });
      prevBtn.addEventListener('click', function () { goTo(current - 1); });
      nextBtn.addEventListener('click', function () { goTo(current + 1); });
    }

    function updateLens(x, y) {
      lensRing.style.left = x + 'px';
      lensRing.style.top  = y + 'px';
      lensClone.style.clipPath = 'circle(' + LENS_R + 'px at ' + x + 'px ' + y + 'px)';
      lensImg.style.transformOrigin = x + 'px ' + y + 'px';
      lensImg.style.transform = 'scale(' + ZOOM + ')';
    }

    function hideLens() {
      lensRing.style.display = 'none';
      lensClone.style.opacity = '0';
      lensClone.style.clipPath = 'circle(0px at -200px -200px)';
      lensImg.style.transform = '';
      wrap.style.cursor = '';
    }
    function showLens() {
      lensRing.style.display = 'block';
      lensClone.style.opacity = '1';
      wrap.style.cursor = 'none';
    }

    wrap.addEventListener('mousemove', function (e) {
      if (!isHovering) { isHovering = true; showLens(); }
      var rect = wrap.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;
      updateLens(lastX, lastY);
    });

    wrap.addEventListener('mouseleave', function () {
      isHovering = false;
      hideLens();
    });
  };

  // Filtres de galerie. Trois cas de chip :
  //   data-group="reset"           → bouton "Tout" : remet les deux groupes à 'all'
  //   data-group="status|kind"     → chip filtre ; re-cliquer un chip actif le désactive
  // Filtres galerie. status = sélection unique ('all' ou valeur).
  // kind & category = sélection multiple (Array vide = aucun filtre).
  window.JHO.initFilters = function (opts) {
    opts = opts || {};
    var cards = document.querySelectorAll(opts.cards || '.work-card');
    var chips = document.querySelectorAll(opts.chips || '.filter-chip');
    var menus = document.querySelectorAll('.filter-menu');
    var multi = { kind: true, category: true };
    var state = { status: 'all', kind: [], category: [] };

    var labels = {
      category: { tableau: 'Tableau', vetement: 'Vêtement' },
      status:   { available: 'Disponible', sold: 'Vendue' },
      kind:     { original: 'Jho création', custom: 'Personnalisé' },
    };
    var defaults = {
      category: 'Catégorie',
      status:   'Disponibilité',
      kind:     'Type',
    };

    function isEmpty(g) {
      return multi[g] ? state[g].length === 0 : state[g] === 'all';
    }
    function isSelected(g, v) {
      return multi[g] ? state[g].indexOf(v) >= 0 : state[g] === v;
    }
    function allEmpty() {
      return isEmpty('status') && isEmpty('kind') && isEmpty('category');
    }

    function closeMenus(except) {
      menus.forEach(function (m) {
        if (m !== except) m.classList.remove('open');
      });
    }

    function refreshUI() {
      chips.forEach(function (c) {
        var g = c.getAttribute('data-group');
        var v = c.getAttribute('data-value');
        if (g === 'reset') {
          c.classList.toggle('active', allEmpty());
        } else if (g && state[g] !== undefined) {
          c.classList.toggle('active', isSelected(g, v));
        }
      });
      menus.forEach(function (m) {
        var g = m.getAttribute('data-group');
        var trig = m.querySelector('.filter-trigger');
        var lbl = trig && trig.querySelector('.label');
        if (!lbl) return;
        if (isEmpty(g)) {
          lbl.textContent = defaults[g] || g;
          trig.classList.remove('active');
        } else if (multi[g]) {
          var arr = state[g];
          if (arr.length === 1) {
            lbl.textContent = labels[g][arr[0]] || defaults[g];
          } else {
            lbl.textContent = arr.length + ' sélectionnés';
          }
          trig.classList.add('active');
        } else {
          lbl.textContent = (labels[g] && labels[g][state[g]]) || defaults[g];
          trig.classList.add('active');
        }
      });
    }

    function applyFilter() {
      cards.forEach(function (card) {
        var s = card.getAttribute('data-status');
        var k = card.getAttribute('data-kind');
        var c = card.getAttribute('data-category');
        var ok = (isEmpty('status')   || s === state.status)
              && (isEmpty('kind')     || state.kind.indexOf(k) >= 0)
              && (isEmpty('category') || state.category.indexOf(c) >= 0);
        card.style.display = ok ? '' : 'none';
      });
    }

    function toggleValue(g, v) {
      if (multi[g]) {
        var i = state[g].indexOf(v);
        if (i >= 0) state[g].splice(i, 1);
        else state[g].push(v);
      } else {
        state[g] = (state[g] === v) ? 'all' : v;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        var g = chip.getAttribute('data-group');
        var v = chip.getAttribute('data-value');
        if (g === 'reset') {
          state.status = 'all'; state.kind = []; state.category = [];
          closeMenus(null);
        } else if (g && state[g] !== undefined) {
          toggleValue(g, v);
          // Pour multi, on ne ferme PAS le menu après un clic.
          if (!multi[g]) closeMenus(null);
        }
        refreshUI();
        applyFilter();
      });
    });

    menus.forEach(function (menu) {
      var trigger = menu.querySelector('.filter-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = menu.classList.contains('open');
        closeMenus(menu);
        menu.classList.toggle('open', !wasOpen);
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.filter-menu')) closeMenus(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenus(null);
    });

    refreshUI();
  };
})();
