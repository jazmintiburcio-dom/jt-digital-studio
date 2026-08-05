/*
  JT Digital Studio — Servicios
  Reveal al scroll vía GSAP ScrollTrigger — mismo patrón validado en
  Home (ver js/pages/home.js): ScrollTrigger solo agrega .is-revealed
  la primera vez que el elemento entra 85% del viewport, y el CSS
  existente por página resuelve la animación real (opacity/transform/
  transition-delay), para no pisar hover ni offsets permanentes con
  estilos inline.

  Sin parallax ni scroll-jacking en S3/S4 (las secciones más densas de
  texto): acá el scroll nunca se intercepta, solo se observa.
*/

function initScrollTriggerReveal(root = document) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const elements = Array.from(
    root.querySelectorAll(
      '.who-card, .stage-step, .plan-card, .care-card, .testimonial-card, .accordion__item'
    )
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
      onEnter: () => {
        el.classList.add('is-revealed');

        // Pulso sutil de escala en el plan destacado (Nivel 2), disparado
        // ~450ms después del reveal — nunca simultáneo con la transición
        // de translateY, para que ambos transforms no compitan entre sí.
        if (el.classList.contains('plan-card--featured')) {
          window.setTimeout(() => el.classList.add('pulse'), 450);
        }
      },
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollTriggerReveal();
});
