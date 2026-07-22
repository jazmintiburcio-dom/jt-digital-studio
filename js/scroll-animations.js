/*
  JT Digital Studio — Sistema de animación al scroll (JS)
  Dos piezas independientes, cada una se puede usar sin la otra:

  - initScrollReveal: fade-in escalonado vía IntersectionObserver.
    Revela una sola vez (deja de observar tras la primera entrada al
    viewport) — evita "excessive motion" en scroll hacia arriba/abajo.
  - initParallax: desplazamiento sutil vía scroll + requestAnimationFrame,
    escribe solo la custom property --parallax-y; el transform real lo
    aplica scroll-animations.css.

  Ambas respetan prefers-reduced-motion: si está activo, el reveal se
  muestra de inmediato sin animar y el parallax ni siquiera se activa.
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
