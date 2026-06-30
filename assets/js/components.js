// Web components partagés : <jho-header active="..."> et <jho-footer>.
// Évite de dupliquer header / footer dans chaque page.

(function () {
  var NAV = [
    { slug: 'accueil',  label: 'Accueil',  href: 'index.html'    },
    { slug: 'galerie',  label: 'Galerie',  href: 'galerie.html'  },
    { slug: 'a-propos', label: 'À propos', href: 'a-propos.html' },
    { slug: 'contact',  label: 'Contact',  href: 'contact.html'  },
  ];

  function headerTemplate(activeSlug) {
    var links = NAV.map(function (item, i) {
      var isActive = item.slug === activeSlug ? ' active' : '';
      return '<a class="menu-link' + isActive + '" href="' + item.href + '">'
        +   '<span class="num">' + (i + 1) + '.</span>'
        +   '<span class="word">' + item.label + '</span>'
        + '</a>';
    }).join('');

    return ''
      + '<a href="index.html" class="brand-mark" aria-label="jho — accueil">'
      +   '<img src="assets/img/Logo complet.svg" alt="jho">'
      + '</a>'
      + '<button class="menu-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false">'
      +   '<span class="bars"><span></span><span></span><span></span></span>'
      + '</button>'
      + '<div class="menu-overlay" aria-hidden="true"></div>'
      + '<aside class="menu-panel" aria-hidden="true">'
      +   '<svg class="menu-curve" preserveAspectRatio="none"><path d="" /></svg>'
      +   '<div class="menu-inner">'
      +     '<div class="menu-content">'
      +       '<div class="menu-label">Navigation</div>'
      +       '<nav class="menu-nav">' + links + '</nav>'
      +     '</div>'
      +     '<div class="menu-footer">'
      +       '<a href="mailto:atelier@jho.art">Email</a>'
      +       '<a href="#" aria-label="Instagram">Instagram</a>'
      +       '<a href="#" aria-label="Pinterest">Pinterest</a>'
      +       '<a href="#" aria-label="Facebook">Facebook</a>'
      +     '</div>'
      +   '</div>'
      + '</aside>';
  }

  function footerTemplate() {
    return ''
      + '<div class="footer-grid">'
      +   '<div class="footer-brand">'
      +     '<div class="logo"><img src="assets/img/Logo complet.svg" alt="jho"></div>'
      +     '<p>Recevez les actualités de l\'atelier, les nouvelles œuvres et les expositions à venir.</p>'
      +     '<form class="footer-newsletter" onsubmit="event.preventDefault();">'
      +       '<input type="email" placeholder="Votre email" aria-label="Votre email">'
      +       '<button type="submit">S\'inscrire</button>'
      +     '</form>'
      +   '</div>'
      +   '<div class="footer-col">'
      +     '<div class="heading">Contact</div>'
      +     '<div class="lines">atelier@jho.art<br>+33 6 00 00 00 00<br>11ᵉ arrondissement, Paris</div>'
      +   '</div>'
      +   '<div class="footer-col">'
      +     '<div class="heading">Suivre</div>'
      +     '<div class="lines">Instagram<br>Facebook<br>Pinterest</div>'
      +   '</div>'
      +   '<div class="footer-col">'
      +     '<div class="heading">Galerie</div>'
      +     '<div class="lines"><a href="galerie.html">Œuvres</a><br><a href="a-propos.html">À propos</a><br><a href="contact.html">Contact</a></div>'
      +   '</div>'
      + '</div>'
      + '<div class="footer-bottom">'
      +   '<span>© 2026 jho — Tous droits réservés</span>'
      +   '<span>Mentions légales · Confidentialité</span>'
      + '</div>';
  }

  // ===== Menu (panneau glissant + courbe SVG animée) =====
  function initMenu(root) {
    var toggle    = root.querySelector('.menu-toggle');
    var panel     = root.querySelector('.menu-panel');
    var overlay   = root.querySelector('.menu-overlay');
    var curvePath = root.querySelector('.menu-curve path');
    if (!toggle || !panel || !curvePath) return;

    var isOpen = false;
    var rafId = null;

    function pathFor(qx, h) {
      return 'M100 0 L200 0 L200 ' + h + ' L100 ' + h + ' Q' + qx + ' ' + (h / 2) + ' 100 0';
    }
    function setCurve(qx) {
      curvePath.setAttribute('d', pathFor(qx, window.innerHeight));
    }
    function ease(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
    function animateCurve(fromQx, toQx, duration) {
      if (rafId) cancelAnimationFrame(rafId);
      var start = performance.now();
      function step(now) {
        var t = Math.min(1, (now - start) / duration);
        setCurve(fromQx + (toQx - fromQx) * ease(t));
        if (t < 1) rafId = requestAnimationFrame(step);
        else rafId = null;
      }
      rafId = requestAnimationFrame(step);
    }

    function setOpen(next) {
      isOpen = next;
      panel.classList.toggle('open', next);
      toggle.classList.toggle('active', next);
      toggle.setAttribute('aria-expanded', String(next));
      toggle.setAttribute('aria-label', next ? 'Fermer le menu' : 'Ouvrir le menu');
      panel.setAttribute('aria-hidden', String(!next));
      if (overlay) overlay.classList.toggle('open', next);
      document.body.style.overflow = next ? 'hidden' : '';
      animateCurve(next ? -100 : 100, next ? 100 : -100, next ? 1000 : 800);
    }

    toggle.addEventListener('click', function () { setOpen(!isOpen); });
    if (overlay) overlay.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) setOpen(false);
    });
    window.addEventListener('resize', function () { setCurve(isOpen ? 100 : -100); });

    setCurve(-100);
  }

  // ===== Web components =====
  customElements.define('jho-header', class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = headerTemplate(this.getAttribute('active') || '');
      initMenu(this);
    }
  });

  customElements.define('jho-footer', class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = footerTemplate();
    }
  });

  // ===== Transition de page (inspirée du menu : panneau + courbe SVG) =====
  (function initPageTransition() {
    var COVER_MS  = 1000; // durée curve cover (le panel CSS est à 800ms)
    var REVEAL_MS = 800;  // durée curve reveal, synchro avec le panel

    var rafId = null;
    var navigating = false;
    var overlay = null;
    var path = null;

    function pathFor(qx, h) {
      // Identique au menu : courbe Q sur le bord gauche du panneau
      return 'M100 0 L200 0 L200 ' + h + ' L100 ' + h + ' Q' + qx + ' ' + (h / 2) + ' 100 0';
    }

    // Easing identique au menu (cubic-quartic ease-in-out)
    function ease(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function setCurve(qx) {
      if (!path) return;
      path.setAttribute('d', pathFor(qx, window.innerHeight));
    }

    function cancelAnim() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function animateCurve(fromQx, toQx, duration, onDone) {
      cancelAnim();
      var start = performance.now();
      function frame(now) {
        var t = Math.min(1, (now - start) / duration);
        setCurve(fromQx + (toQx - fromQx) * ease(t));
        if (t < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          rafId = null;
          if (onDone) onDone();
        }
      }
      rafId = requestAnimationFrame(frame);
    }

    function mount() {
      var div = document.createElement('div');
      // .cover dès le mount : le panneau SVG couvre immédiatement, en relai du
      // pseudo body::before. Les deux sont de la même couleur, aucun saut visuel.
      div.className = 'page-transition cover';
      div.setAttribute('aria-hidden', 'true');
      div.innerHTML = '<svg class="pt-curve" preserveAspectRatio="none"><path d="" /></svg>';
      document.body.insertBefore(div, document.body.firstChild);
      overlay = div;
      path = div.querySelector('path');
      setCurve(100);
      // Retire le pseudo CSS — notre overlay SVG prend le relai.
      document.body.classList.add('pt-ready');
    }

    function shouldIntercept(a, e) {
      if (!a || !a.href) return false;
      if (a.target === '_blank') return false;
      if (a.hasAttribute('download')) return false;
      if (a.dataset.noTransition === 'true') return false;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
      if (e.button !== 0) return false;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return false; }
      if (url.origin !== location.origin) return false;
      if (!/\.html?$/i.test(url.pathname) && url.pathname !== '/' && url.pathname !== '') return false;
      if (url.pathname === location.pathname && url.search === location.search) return false;
      return true;
    }

    function reveal() {
      // Panneau glisse vers la droite (via CSS), courbe : qx=100 → -100
      // Le double rAF garantit que la classe initiale (CSS) est commitée
      // avant qu'on retire .cover, sinon le navigateur peut sauter la transition.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlay.classList.remove('cover');
          animateCurve(100, -100, REVEAL_MS);
        });
      });
    }

    function cover(href) {
      overlay.classList.add('active');
      overlay.classList.add('cover');
      animateCurve(-100, 100, COVER_MS, function () {
        location.href = href;
      });
    }

    function start() {
      reveal();

      document.addEventListener('click', function (e) {
        if (navigating) return;
        var a = e.target.closest && e.target.closest('a');
        if (!shouldIntercept(a, e)) return;
        e.preventDefault();
        navigating = true;
        cover(a.href);
      });

      // Retour cache navigateur (bouton précédent)
      window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
          navigating = false;
          cancelAnim();
          overlay.classList.remove('active');
          overlay.classList.add('cover');
          setCurve(100);
          // Force reflow pour que la classe soit commitée avant la révélation
          void overlay.offsetHeight;
          reveal();
        }
      });

      // Recalcule la hauteur de la courbe au resize si elle est statique
      window.addEventListener('resize', function () {
        if (rafId === null && overlay) {
          setCurve(overlay.classList.contains('cover') ? 100 : -100);
        }
      });
    }

    // Monte aussi tôt que possible — components.js est `defer` donc body existe.
    if (document.body) {
      mount();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        mount();
        start();
      });
    }
  })();
})();
