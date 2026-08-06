/*
  JT Digital Studio — Home
  El atributo autoplay del <video> del Hero no respeta
  prefers-reduced-motion por sí solo (eso lo decide el navegador, no
  la preferencia de accesibilidad del SO). Si el usuario la tiene
  activada, pausamos apenas carga: al no haber avanzado nunca, el
  navegador muestra el frame 0 como imagen estática — no hace falta
  un poster aparte.
*/

function initHeroVideo(root = document) {
  const video = root.querySelector('[data-hero-video]');
  if (!video) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    video.pause();
  }
}

/*
  Count-up de las 3 cifras de la trust bar (3 meses / 15 días / 100%).
  IntersectionObserver dispara una vez cuando el elemento entra al 85% del
  viewport; rAF + easing power2.out reproduce el efecto de 2s anterior.
*/
function initCountUp(root = document) {
  const elements = Array.from(root.querySelectorAll('[data-count-up]'));
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    elements.forEach((el) => {
      el.textContent = Math.round(parseFloat(el.dataset.countTo));
    });
    return;
  }

  const DURATION = 2000;

  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }

  function animateCount(el) {
    const from = parseFloat(el.dataset.countFrom) || 0;
    const to = parseFloat(el.dataset.countTo);
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      el.textContent = Math.round(from + (to - from) * easeOut(progress));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

/*
  Reveal de cards/pasos/testimonios/FAQ — IntersectionObserver agrega
  .is-revealed la primera vez que el elemento entra al 85% del viewport.
  El CSS sigue manejando opacity/transform/transition-delay por elemento
  (home.css / testimonial-card.css / accordion.css), igual que antes.

  .social-proof__stats > div queda afuera a propósito: ya tiene su propio
  reveal vía .social-proof.is-in-view (scroll-animations.js, sitio entero).
*/
function initScrollReveal(root = document) {
  const elements = Array.from(
    root.querySelectorAll(
      '.archetype-card, .service-preview-card, .process-step, .testimonial-card, .accordion__item'
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
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initCountUp();
  initScrollReveal();
});
