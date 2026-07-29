/*
  JT Digital Studio — Nosotros
  Reveal al scroll vía GSAP ScrollTrigger — mismo patrón que Servicios
  y Home (ver js/pages/servicios.js).
*/

function initScrollTriggerReveal(root = document) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const elements = Array.from(
    root.querySelectorAll('.credibility-card, .process-step, .value-card, .workspace-item')
  );
  if (!elements.length) return;

  if (prefersReducedMotion.matches) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  elements.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-revealed'),
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollTriggerReveal();
});
