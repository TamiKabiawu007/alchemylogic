// Basic, modern form validation and UX
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  const setBusy = (btn, busy) => {
    if (!btn) return;
    btn.disabled = !!busy;
    btn.dataset.busy = busy ? '1' : '';
    btn.textContent = busy ? 'Sending…' : (btn.dataset.label || 'Send Message');
  };

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn && !submitBtn.dataset.label) submitBtn.dataset.label = submitBtn.textContent || '';
    setBusy(submitBtn, true);

    const formData = new FormData(contactForm);
    // simple validation
    const required = ['name', 'email', 'subject', 'message'];
    const missing = required.filter((k) => !String(formData.get(k) || '').trim());
    if (missing.length) {
      alert('Please complete all required fields.');
      setBusy(submitBtn, false);
      return;
    }

    try {
      // placeholder: simulate network request
      await new Promise((r) => setTimeout(r, 900));
      contactForm.reset();
      alert('Thanks! Your message has been sent.');
    } catch (err) {
      console.error(err);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setBusy(submitBtn, false);
    }
  });
});


