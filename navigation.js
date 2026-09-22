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
