/*
  JT Digital Studio — Sistema de animación al scroll (JS)
  Piezas independientes, cada una se puede usar sin las otras:

  - initScrollReveal: fade-in escalonado vía IntersectionObserver.
    Revela una sola vez (deja de observar tras la primera entrada al
    viewport) — evita "excessive motion" en scroll hacia arriba/abajo.
  - initParallax: desplazamiento sutil vía scroll + requestAnimationFrame,
    escribe solo la custom property --parallax-y; el transform real lo
    aplica scroll-animations.css.
  - initHeroFade: fade + leve desplazamiento hacia arriba mientras un
    hero en flujo normal (no sticky) atraviesa el viewport al scrollear.
    Misma técnica que initParallax (rAF + custom properties), con la
    curva de easing aplicada en JS en vez de una transition CSS, para
    que seguir el scroll frame a frame no quede "peleando" contra una
    transición que además está animando.

  Todas respetan prefers-reduced-motion: si está activo, el reveal se
  muestra de inmediato sin animar, y el parallax y el hero-fade ni
  siquiera se activan.
*/

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initScrollReveal(root = document) {
  const containers = Array.from(root.querySelectorAll('[data-scroll-reveal]'));
  if (!containers.length) return;

  containers.forEach((container) => {
    const items = container.querySelectorAll('[data-reveal]');
    items.forEach((item, index) => item.style.setProperty('--reveal-index', index));
  });

  if (prefersReducedMotion.matches) {
    containers.forEach((container) => container.classList.add('is-in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  );

  containers.forEach((container) => observer.observe(container));
}

export function initParallax(root = document) {
  if (prefersReducedMotion.matches) return;

  const elements = Array.from(root.querySelectorAll('[data-parallax]'));
  if (!elements.length) return;

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const intensity =
        parseFloat(getComputedStyle(el).getPropertyValue('--parallax-intensity')) || 0.15;
      // progress: -1 arriba del viewport, 0 centrado, 1 abajo del viewport
      const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = progress * intensity * viewportHeight * -1;
      el.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    });

    ticking = false;
  };

  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  update();
}

// Ease-out cúbica: mismo carácter que --ease-out (cubic-bezier(0.16,1,0.3,1))
// pero evaluable por frame en JS en vez de vía transition CSS.
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function initHeroFade(root = document) {
  if (prefersReducedMotion.matches) return;

  const elements = Array.from(root.querySelectorAll('[data-hero-fade]'));
  if (!elements.length) return;

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // El fade se completa a los ~60% de un viewport de scroll (no a
      // los 100%): así el hero ya está invisible bastante antes de
      // terminar de salir de pantalla, en vez de recortarse recién en
      // el borde.
      const raw = Math.min(Math.max(-rect.top / (viewportHeight * 0.6), 0), 1);
      const eased = easeOutCubic(raw);
      el.style.setProperty('--hero-fade-opacity', (1 - eased).toFixed(3));
      el.style.setProperty('--hero-fade-y', `${(-eased * 40).toFixed(1)}px`);
    });

    ticking = false;
  };

  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  update();
}
