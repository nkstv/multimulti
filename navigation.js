(() => {
  const header = document.querySelector('[data-site-header]');
  if (!header) return;

  const dropdowns = [...header.querySelectorAll('.nav-dropdown')];
  const toggle = header.querySelector('.mobile-menu-toggle');
  const mobileMenu = header.querySelector('.mobile-menu');

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener('toggle', () => {
      if (!dropdown.open) return;
      dropdowns.forEach((other) => {
        if (other !== dropdown) other.open = false;
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) dropdowns.forEach((dropdown) => { dropdown.open = false; });
  });

  const setMobileOpen = (open) => {
    if (!toggle || !mobileMenu) return;
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('mobile-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    mobileMenu.setAttribute('aria-hidden', String(!open));
  };

  if (toggle) {
    toggle.addEventListener('click', () => setMobileOpen(!header.classList.contains('menu-open')));
  }

  header.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => setMobileOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    dropdowns.forEach((dropdown) => { dropdown.open = false; });
    setMobileOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMobileOpen(false);
  });

  const normalize = (path) => {
    if (!path) return '/';
    return path !== '/' && !path.endsWith('/') ? `${path}/` : path;
  };
  const current = normalize(window.location.pathname);

  header.querySelectorAll('a[href^="/"]').forEach((link) => {
    const url = new URL(link.href, window.location.origin);
    const target = normalize(url.pathname);
    if (target === current && !url.hash) {
      link.classList.add('is-current');
      const dropdown = link.closest('.nav-dropdown');
      if (dropdown) dropdown.classList.add('contains-current');
    }
  });
})();

/* ----------------------------------------------------------
   Motif guilloché
   Les rosaces gravées des billets de banque, calculées ici
   plutôt que stockées en image : quelques lignes de code au
   lieu d'un fichier de 100 Ko. Posé derrière la carte du n°1
   sur l'accueil (avec un tracé à l'ouverture) et derrière les
   encadrés « réponse » et « montant » des guides.
---------------------------------------------------------- */
(() => {
  const hotes = document.querySelectorAll('.mc-1, .answer-card, .amount-display');
  if (!hotes.length) return;

  // Chaque bande : rayon, amplitude de l'onde, nombre d'ondes,
  // nombre de courbes décalées qui forment la tresse.
  const bandes = [
    { r: 262, a: 12, n: 40, k: 9 },
    { r: 214, a: 20, n: 28, k: 8 },
    { r: 150, a: 30, n: 18, k: 7 },
    { r: 84, a: 24, n: 10, k: 6 },
  ];
  const PAS = 480;
  const courbes = [];
  bandes.forEach((b) => {
    for (let j = 0; j < b.k; j++) {
      const phase = (j / b.k) * Math.PI * 2;
      let d = '';
      for (let s = 0; s <= PAS; s++) {
        const t = (s / PAS) * Math.PI * 2;
        const r = b.r + b.a * Math.sin(b.n * t + phase);
        const x = 300 + r * Math.cos(t);
        const y = 300 + r * Math.sin(t);
        d += (s ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      courbes.push(d + 'Z');
    }
  });

  hotes.forEach((hote) => {
    if (hote.querySelector('.guilloche')) return;
    const trace = hote.classList.contains('mc-1');
    const chemins = courbes
      .map((d, i) => `<path d="${d}"${trace ? ` pathLength="1" style="--i:${i}"` : ''}/>`)
      .join('');
    hote.insertAdjacentHTML(
      'afterbegin',
      `<svg class="guilloche${trace ? ' draw' : ''}" viewBox="0 0 600 600" aria-hidden="true" focusable="false">${chemins}</svg>`
    );
  });
})();
