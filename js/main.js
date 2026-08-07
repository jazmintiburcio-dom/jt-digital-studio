/*
  JT Digital Studio — Entry point
  Cada página incluye únicamente este módulo:
  <script type="module" src="js/main.js"></script>

  Todos los inicializadores son no-op seguros si el componente no
  existe en la página actual (cada uno resuelve sus propios selectores
  y no hace nada si no encuentra nodos que inicializar).
*/

import { initHeader, initHeaderTransparency } from './components/header.js';
import { initAccordions } from './components/accordion.js';
import { initExpandableCards } from './components/expandable-card.js';
import { initFooter } from './components/footer.js';
import { initScrollReveal, initParallax, initHeroFade } from './scroll-animations.js';
import { initContactForm } from './components/contact-form.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeaderTransparency();
  initAccordions();
  initExpandableCards();
  initFooter();
  initScrollReveal();
  initParallax();
  initHeroFade();
  initContactForm();
});
