/*
  JT Digital Studio — Servicios
  Reveal al scroll vía IntersectionObserver — agrega .is-revealed la
  primera vez que el elemento entra al 85% del viewport. El CSS existente
  por página resuelve la animación real (opacity/transform/transition-delay),
  para no pisar hover ni offsets permanentes con estilos inline.

  Sin parallax ni scroll-jacking en S3/S4 (las secciones más densas de
  texto): el scroll nunca se intercepta, solo se observa.
*/

function initScrollReveal(root = document) {
  const elements = Array.from(
    root.querySelectorAll(
      '.who-card, .stage-step, .plan-card, .care-card, .testimonial-card, .accordion__item'
    )
  );
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');

        // Pulso sutil de escala en el plan destacado (Nivel 2), disparado
        // ~450ms después del reveal — nunca simultáneo con la transición
        // de translateY, para que ambos transforms no compitan entre sí.
        if (entry.target.classList.contains('plan-card--featured')) {
          window.setTimeout(() => entry.target.classList.add('pulse'), 450);
        }

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});
