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
  Count-up de las 3 cifras de la trust bar (3 meses / 15 días / 100%)
  Arranca desde data-count-from al entrar en viewport, una sola vez.
  Corto y sutil (500ms, ease-out) — no es un contador dramático.
*/
function initCountUp(root = document) {
  const elements = Array.from(root.querySelectorAll('[data-count-up]'));
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    elements.forEach((el) => {
      el.textContent = el.dataset.countTo;
    });
    return;
  }

  const duration = 500;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const from = parseInt(el.dataset.countFrom, 10);
    const to = parseInt(el.dataset.countTo, 10);
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(from + (to - from) * easeOutCubic(progress));
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  elements.forEach((el) => observer.observe(el));
}

/*
  Reveal de las cards de "Para quién diseñamos" y "Nuestros servicios"
  (estilo Cliento — ver home.css para el fondo/hover/offset de cada
  card). Agrega .is-revealed a cada card por separado la primera vez
  que entra en viewport; el fade + slide-up + stagger por-card lo hace
  el CSS a partir de esa clase.
*/
function initCardReveal(root = document) {
  const cards = Array.from(root.querySelectorAll('.archetype-card, .service-preview-card'));
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    cards.forEach((card) => card.classList.add('is-revealed'));
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
    { threshold: 0.2 }
  );

  cards.forEach((card) => observer.observe(card));
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initCountUp();
  initCardReveal();
});
