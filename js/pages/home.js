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

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
});
