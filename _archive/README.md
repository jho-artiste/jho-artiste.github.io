# Archive

Code mis de côté, **non utilisé par le site**. Ne pas lire ces fichiers à moins que
l'utilisateur ne demande explicitement de les ressortir.

## Contenu

- `brush-fill.js` — effet "peinture au pinceau" qui suit le curseur, utilisé un temps
  sur les boutons filtre de la galerie. Réutilisable via `JHO.brushFill(element, opts)`.
  Pour le réactiver : déplacer le fichier dans `assets/js/`, ajouter
  `<script src="assets/js/brush-fill.js" defer></script>` dans la page, et appeler
  `JHO.brushFill(el, { color: [...], brushSize: N, initialBurst: false })`.
