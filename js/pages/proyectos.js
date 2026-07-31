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

function initFilmstrips(root = document) {
  root.querySelectorAll('[data-filmstrip]').forEach((strip) => {
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    strip.addEventListener('mousedown', (event) => {
      isDown = true;
      strip.classList.add('is-dragging');
      startX = event.pageX;
      scrollStart = strip.scrollLeft;
    });

    ['mouseleave', 'mouseup'].forEach((evt) =>
      strip.addEventListener(evt, () => {
        isDown = false;
        strip.classList.remove('is-dragging');
      })
    );

    strip.addEventListener('mousemove', (event) => {
      if (!isDown) return;
      event.preventDefault();
      const walk = event.pageX - startX;
      strip.scrollLeft = scrollStart - walk;
    });
  });
}

function initCompareSliders(root = document) {
  root.querySelectorAll('[data-compare-slider]').forEach((slider) => {
    const handle = slider.querySelector('[data-compare-handle]');
    const wrap = slider.querySelector('.compare-slider__before-wrap');
    if (!handle || !wrap) return;

    let dragging = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.min(100, Math.max(0, pct));
      wrap.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = `${pct}%`;
    };

    handle.addEventListener('pointerdown', (event) => {
      dragging = true;
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener('pointerup', () => {
      dragging = false;
    });

    handle.addEventListener('pointermove', (event) => {
      if (dragging) setPosition(event.clientX);
    });

    slider.addEventListener('click', (event) => {
      if (event.target.closest('[data-compare-handle]')) return;
      setPosition(event.clientX);
    });
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
  initFilmstrips();
  initCompareSliders();
  initPhotoFans();
});
