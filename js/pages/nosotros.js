/*
  JT Digital Studio — Nosotros
  Tilt 3D sutil de la foto del hero, siguiendo el cursor — sin
  librerías externas. Se desactiva en touch (no hay cursor) y con
  prefers-reduced-motion.
*/

function initHeroTilt(root = document) {
  const media = root.querySelector('.about-hero__media');
  const img = media?.querySelector('img');
  if (!media || !img) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsHover = window.matchMedia('(hover: hover)');
  if (prefersReducedMotion.matches || !supportsHover.matches) return;

  const maxTilt = 8;

  media.addEventListener('mousemove', (event) => {
    const rect = media.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
  });

  media.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroTilt();
});
