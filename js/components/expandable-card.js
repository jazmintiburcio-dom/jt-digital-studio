/*
  JT Digital Studio — Tarjeta expandible (Proyectos)
  Cada tarjeta es independiente (a diferencia del acordeón, varias
  pueden estar abiertas a la vez). El contenido revelado hace su
  fade-in escalonado (scroll-animations.css) una sola vez, la primera
  vez que se abre esa tarjeta — no se repite en aperturas siguientes,
  para no repetir la misma animación cada vez que el usuario alterna.
*/

function setupCard(card) {
  const trigger = card.querySelector('[data-expandable-trigger]');
  const closeButton = card.querySelector('[data-expandable-close]');
  const detail = card.querySelector('[data-expandable-detail]');
  const revealContent = card.querySelector('[data-scroll-reveal]');
  if (!trigger || !detail) return;

  let hasRevealedOnce = false;

  const open = () => {
    card.classList.add('is-expanded');
    detail.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    detail.inert = false;

    if (!hasRevealedOnce && revealContent) {
      requestAnimationFrame(() => revealContent.classList.add('is-in-view'));
      hasRevealedOnce = true;
    }
  };

  const close = ({ returnFocus = false } = {}) => {
    card.classList.remove('is-expanded');
    detail.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    detail.inert = true;
    if (returnFocus) trigger.focus();
  };

  detail.inert = true;

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    isOpen ? close({ returnFocus: true }) : open();
  });

  if (closeButton) {
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      close({ returnFocus: true });
    });
  }

  card.addEventListener('keydown', (event) => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    if (event.key === 'Escape' && isOpen) {
      close({ returnFocus: true });
    }
  });
}

export function initExpandableCards(root = document) {
  root.querySelectorAll('[data-expandable-card]').forEach(setupCard);
}
