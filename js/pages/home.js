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
  Vía GSAP + ScrollTrigger (antes: rAF manual + IntersectionObserver).
  2s con easing — deliberadamente más largo que el diseño original
  (500ms, "breve y sutil"): pedido explícito para un efecto más
  perceptible/profesional.
*/
function initCountUp(root = document) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const elements = Array.from(root.querySelectorAll('[data-count-up]'));
  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  elements.forEach((el) => {
    const from = parseFloat(el.dataset.countFrom) || 0;
    const to = parseFloat(el.dataset.countTo);

    if (prefersReducedMotion.matches) {
      el.textContent = Math.round(to);
      return;
    }

    const counter = { value: from };
    gsap.to(counter, {
      value: to,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      onUpdate: () => {
        el.textContent = Math.round(counter.value);
      },
    });
  });
}

/*
  Reveal de cards/pasos/testimonios/FAQ vía GSAP ScrollTrigger — antes
  era un único IntersectionObserver agregando .is-revealed; acá,
  ScrollTrigger.create hace exactamente lo mismo (agregar la clase la
  primera vez que el elemento entra 85% del viewport) y el CSS existente
  sigue manejando la animación real (opacity/transform/transition-delay
  por elemento, ver home.css/testimonial-card.css/accordion.css).

  Por qué no usar gsap.fromTo() escribiendo opacity/transform
  directamente (como en el pedido original): esos estilos quedarían
  inline en el elemento, con más prioridad que cualquier regla CSS sin
  !important — rompería el :hover (rotación + sombra) de las cards
  Cliento y el offset permanente de la card #2 (--rest-y), que están
  definidos en CSS. Dejar que ScrollTrigger solo dispare la clase, y que
  el CSS siga resolviendo el resto, logra el mismo objetivo (reveal
  suave vía ScrollTrigger en vez de IntersectionObserver) sin ese riesgo.
*/
function initScrollTriggerReveal(root = document) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // .social-proof__stats > div queda afuera a propósito: ya tiene su
  // propio reveal andando vía .social-proof.is-in-view (initScrollReveal
  // en scroll-animations.css/js, sitio entero) — agregarlo acá solo
  // sumaría una clase .is-revealed que ningún CSS escucha, sin cambiar
  // nada visible.
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
  initHeroVideo();
  initCountUp();
  initScrollTriggerReveal();
});
