/*
  JT Digital Studio — Acordeón (apertura única)
  Cada [data-accordion] gestiona su propio estado: abrir un ítem cierra
  cualquier otro ítem abierto dentro del mismo acordeón (no afecta a
  otros acordeones que puedan existir en la misma página).
  Usa `inert` en el panel cerrado para sacarlo del tab order mientras
  está colapsado a altura 0 (grid-template-rows en accordion.css).
*/

function openPanel(trigger, panel) {
  trigger.setAttribute('aria-expanded', 'true');
  panel.classList.add('is-open');
  panel.inert = false;
}

function closePanel(trigger, panel) {
  trigger.setAttribute('aria-expanded', 'false');
  panel.classList.remove('is-open');
  panel.inert = true;
}

function getPanel(trigger) {
  const id = trigger.getAttribute('aria-controls');
  return id ? document.getElementById(id) : null;
}

function setupAccordion(accordion) {
  const triggers = Array.from(accordion.querySelectorAll('[data-accordion-trigger]'));

  triggers.forEach((trigger) => {
    const panel = getPanel(trigger);
    if (!panel) return;

    closePanel(trigger, panel);

    trigger.addEventListener('click', () => {
      const wasOpen = trigger.getAttribute('aria-expanded') === 'true';

      triggers.forEach((otherTrigger) => {
        if (otherTrigger === trigger) return;
        const otherPanel = getPanel(otherTrigger);
        if (otherPanel) closePanel(otherTrigger, otherPanel);
      });

      if (wasOpen) {
        closePanel(trigger, panel);
      } else {
        openPanel(trigger, panel);
      }
    });
  });
}

export function initAccordions(root = document) {
  root.querySelectorAll('[data-accordion]').forEach(setupAccordion);
}
