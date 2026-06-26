// Catalogue des œuvres.
// Pour ajouter une œuvre : pousse un objet en bas de la liste, puis dépose
// l'image dans site/assets/img/works/ avec le nom de `img`.
// `tile`     : couleur du placeholder rayé tant que l'image n'est pas en place.
// `featured` : visible sur la page d'accueil.
// `status`   : 'available' | 'sold'         (filtre Disponibilité)
// `kind`     : 'original'  | 'custom'       (filtre Type — Création jho / Personnalisée)
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
      +   ' data-kind="' + escapeHtml(w.kind || 'original') + '">'
      + imgTag
      + '<span class="size">' + escapeHtml(w.size || '') + '</span>'
      + '<div class="overlay">'
      +   '<div class="title">' + escapeHtml(w.title) + '</div>'
      +   '<div class="meta">' + escapeHtml(w.year + ' · ' + w.technique) + '</div>'
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

  // Filtres de galerie. Trois cas de chip :
  //   data-group="reset"           → bouton "Tout" : remet les deux groupes à 'all'
  //   data-group="status|kind"     → chip filtre ; re-cliquer un chip actif le désactive
  window.JHO.initFilters = function (opts) {
    opts = opts || {};
    var cards = document.querySelectorAll(opts.cards || '.work-card');
    var chips = document.querySelectorAll(opts.chips || '.filter-chip');
    var state = { status: 'all', kind: 'all' };

    function refreshUI() {
      chips.forEach(function (c) {
        var g = c.getAttribute('data-group');
        var v = c.getAttribute('data-value');
        if (g === 'reset') {
          c.classList.toggle('active', state.status === 'all' && state.kind === 'all');
        } else if (g && state[g] !== undefined) {
          c.classList.toggle('active', state[g] === v);
        }
      });
    }

    function applyFilter() {
      cards.forEach(function (card) {
        var s = card.getAttribute('data-status');
        var k = card.getAttribute('data-kind');
        var ok = (state.status === 'all' || s === state.status)
              && (state.kind   === 'all' || k === state.kind);
        card.style.display = ok ? '' : 'none';
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var g = chip.getAttribute('data-group');
        var v = chip.getAttribute('data-value');
        if (g === 'reset') {
          state.status = 'all'; state.kind = 'all';
        } else if (g && state[g] !== undefined) {
          state[g] = (state[g] === v) ? 'all' : v;
        }
        refreshUI();
        applyFilter();
      });
    });

    refreshUI();
  };
})();
