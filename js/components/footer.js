/*
  JT Digital Studio — Footer
  Mantiene el año del copyright actualizado sin tocar el HTML cada año.
*/

export function initFooter(root = document) {
  const yearEl = root.querySelector('[data-current-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
