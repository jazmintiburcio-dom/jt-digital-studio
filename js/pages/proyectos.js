/*
  JT Digital Studio — Proyectos
  1. Índice fijo (01-04): resalta el caso visible en el viewport.
  2. Lupa de zoom (Marciano): sigue el cursor, revela detalle a 2x.
  3. Filmstrip arrastrable (Yina): drag-to-scroll horizontal.
  4. Slider antes/después (XBlues): comparador con clip-path.
  5. Pila de fotos en abanico (Dreams Fusion): click trae al frente.
  Todo vanilla JS, sin dependencias — el reveal de entrada usa el
  sistema genérico del sitio (data-scroll-reveal).
*/

function initCaseNav(root = document) {
  const nav = root.querySelector('[data-case-nav]');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('[data-case-nav-link]'));
  const sections = links
    .map((link) => root.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initZoomLens(root = document) {
  const supportsHover = window.matchMedia('(hover: hover)');
  if (!supportsHover.matches) return;

  root.querySelectorAll('[data-zoom-lens]').forEach((container) => {
    const img = container.querySelector('img');
    if (!img) return;

    const lens = document.createElement('div');
    lens.className = 'zoom-lens';
    container.appendChild(lens);
    const zoomFactor = 1.8;

    const moveLens = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;
      lens.style.left = `${relX}px`;
      lens.style.top = `${relY}px`;
      lens.style.backgroundImage = `url(${img.currentSrc || img.src})`;
      lens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
      const bgX = -(relX * zoomFactor - lens.offsetWidth / 2);
      const bgY = -(relY * zoomFactor - lens.offsetHeight / 2);
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    };

    container.addEventListener('mouseenter', () => lens.classList.add('is-active'));
    container.addEventListener('mouseleave', () => lens.classList.remove('is-active'));
    container.addEventListener('mousemove', (event) => moveLens(event.clientX, event.clientY));
  });
}

function initDotCarousel(root = document) {
  root.querySelectorAll('[data-dot-carousel]').forEach((carousel) => {
    const imgs = Array.from(carousel.querySelectorAll('.dot-carousel__img'));
    const dots = Array.from(carousel.querySelectorAll('.dot-carousel__dot'));
    const slideLabel = carousel.querySelector('.dot-carousel__slide-label');
    if (!imgs.length) return;

    let current = 0;
    let timer;

    const updateLabel = (idx) => {
      if (!slideLabel) return;
      const state = imgs[idx].dataset.label || null;
      if (state) {
        slideLabel.dataset.state = state;
        slideLabel.textContent = state === 'after' ? 'Después' : 'Antes';
      }
    };

    const show = (idx) => {
      imgs[current].classList.remove('is-active');
      dots[current]?.classList.remove('is-active');
      current = idx;
      imgs[current].classList.add('is-active');
      dots[current]?.classList.add('is-active');
      updateLabel(idx);
    };

    const next = () => show((current + 1) % imgs.length);
    const start = () => { timer = setInterval(next, 4000); };
    const stop = () => clearInterval(timer);

    dots.forEach((dot, i) => dot.addEventListener('click', () => { stop(); show(i); start(); }));
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    updateLabel(0);
    start();
  });
}

function initPhotoFans(root = document) {
  root.querySelectorAll('[data-photo-fan]').forEach((fan) => {
    const cards = Array.from(fan.querySelectorAll('.photo-fan__card'));
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => c.classList.remove('is-front'));
        card.classList.add('is-front');
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCaseNav();
  initZoomLens();
  initDotCarousel();
  initPhotoFans();
});
