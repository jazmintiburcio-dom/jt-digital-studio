/*
  JT Digital Studio — Header / drawer de menú mobile
  Maneja apertura, cierre, focus trap, cierre con Escape, click en el
  overlay, y bloqueo de scroll del body mientras el drawer está abierto.
  El drawer completo queda `inert` cuando está cerrado: aunque el panel
  siga en el DOM (fuera de pantalla via transform), no debe ser
  alcanzable por Tab.
*/

function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );
}

function trapFocus(container, event) {
  const focusable = getFocusable(container);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function initHeader(root = document) {
  const toggle = root.querySelector('[data-menu-toggle]');
  const menu = root.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  const overlay = menu.querySelector('[data-mobile-menu-overlay]');
  const panel = menu.querySelector('[data-mobile-menu-panel]');
  const closeButton = menu.querySelector('[data-mobile-menu-close]');

  menu.inert = true;

  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'Tab' && panel) {
      trapFocus(panel, event);
    }
  };

  function open() {
    menu.inert = false;
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('has-mobile-menu-open');
    getFocusable(panel)[0]?.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close({ returnFocus = true } = {}) {
    menu.classList.remove('is-open');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('has-mobile-menu-open');
    document.removeEventListener('keydown', onKeydown);
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? close() : open();
  });

  overlay?.addEventListener('click', () => close());
  closeButton?.addEventListener('click', () => close());

  menu.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => close({ returnFocus: false }));
  });
}

/*
  Header con efecto vidrio sobre el hero
  Opt-in: solo se activa en páginas que tengan un [data-hero-fade] Y un
  [data-header-sentinel] (hoy, Home). En el resto de las páginas el
  header queda con su fondo sólido de siempre — este comportamiento no
  las toca.

  El sentinel vive en flujo normal justo al cierre de la sección Hero
  (ver index.html), no a un offset fijo en píxeles: "dejó de
  intersectar" significa exactamente "el usuario pasó el Hero
  completo", sin importar cuánto mida el Hero en cada viewport.
*/
export function initHeaderTransparency(root = document) {
  const header = root.querySelector('.site-header');
  const hero = root.querySelector('[data-hero-fade]');
  const sentinel = root.querySelector('[data-header-sentinel]');
  if (!header || !hero || !sentinel) return;

  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('site-header--glass', entry.isIntersecting),
    { threshold: 0 }
  );

  observer.observe(sentinel);
}
