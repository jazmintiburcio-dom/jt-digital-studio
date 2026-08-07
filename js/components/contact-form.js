/*
  JT Digital Studio — Formulario de contacto
  CONFIGURACIÓN REQUERIDA: Crear cuenta gratuita en formspree.io, crear un nuevo Form,
  y reemplazar "XXXXXXXX" con el ID de 8 caracteres que asigna Formspree.
*/

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xljrdqpz';

export function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  const successEl = document.querySelector('.contact-form__success');
  const errorEl   = document.querySelector('.contact-form__error-msg');
  const formCol   = form.closest('.contact-form-col');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorEl) errorEl.hidden = true;

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.hidden = true;
        if (successEl) {
          successEl.hidden = false;
          successEl.focus();
        }
      } else {
        throw new Error('server');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      if (errorEl) errorEl.hidden = false;
    }
  });
}
