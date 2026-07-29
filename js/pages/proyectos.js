/*
  JT Digital Studio — Proyectos
  Resalta el punto activo del índice fijo (01-04) según qué caso está
  visible en el viewport. El reveal de entrada usa el sistema
  genérico del sitio (data-scroll-reveal), no hace falta acá.
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

document.addEventListener('DOMContentLoaded', () => {
  initCaseNav();
});
