// Catalogue des œuvres.
// Pour ajouter une œuvre : pousse un objet en bas de la liste, puis dépose
// l'image dans site/assets/img/works/ avec le nom de `img`.
// `tile` est la couleur du placeholder rayé tant que l'image n'est pas en place.
// `featured: true` = visible sur la page d'accueil.
window.JHO_WORKS = [
  {
    slug: 'renard',
    title: "Renard d'argent",
    year: 2024,
    technique: 'Acrylique sur toile',
    size: '100 × 100 cm',
    img: 'assets/img/works/fox.jpg',
    tile: 'tile-dark',
    featured: true,
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
    img: 'assets/img/works/pablo.jpg',
    tile: 'tile-light',
    featured: true,
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
    img: 'assets/img/works/elephants.jpg',
    tile: 'tile-mid',
    featured: true,
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
    img: 'assets/img/works/bouquet.jpg',
    tile: 'tile-light',
    featured: true,
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
    img: 'assets/img/works/aubin.jpg',
    tile: 'tile-dark',
    featured: true,
    description: "Deux plongeurs main dans la main au-dessus du récif. Toile de commande, célébration d'une passion partagée.",
    price: 'Sur demande',
    availability: 'Œuvre de commande · contactez l\'atelier',
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
      + '<a class="work-card ' + sizeClass + ' ' + (w.tile || 'tile-light') + '" href="' + href + '">'
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

  window.JHO.renderGrid = function (selector, opts) {
    var el = document.querySelector(selector);
    if (!el) return;
    opts = opts || {};
    var list = window.JHO_WORKS;
    if (opts.featuredOnly) list = list.filter(function (w) { return w.featured; });
    if (opts.limit) list = list.slice(0, opts.limit);
    if (opts.exclude) list = list.filter(function (w) { return w.slug !== opts.exclude; });
    el.innerHTML = list.map(function (w) { return cardHtml(w, opts); }).join('');
  };

  window.JHO.findWork = function (slug) {
    return window.JHO_WORKS.find(function (w) { return w.slug === slug; });
  };
})();
