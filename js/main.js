// Alchemy Logic Consulting: site behaviour
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');

  // Header background once the page scrolls
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const isOpen = () => header.classList.contains('is-open');
  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (toggle) {
    toggle.addEventListener('click', () => setMenu(!isOpen()));
    document.querySelectorAll('.nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setMenu(false); toggle.focus(); } });
    window.matchMedia('(min-width: 821px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Services page: highlight the section in view
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length) {
    const byId = new Map([...tocLinks].map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((a) => a.classList.remove('is-active'));
        const link = byId.get(entry.target.id);
        if (!link) return;
        link.classList.add('is-active');
        // On phones the index is a horizontal chip row: keep the active chip in view
        const bar = link.parentElement;
        if (bar.scrollWidth > bar.clientWidth) {
          bar.scrollTo({ left: link.offsetLeft - (bar.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  // Home service cards on phones: open the card sitting at the reading line (55% down the screen).
  // Exactly one card is open at a time, so the list keeps the same height and the page doesn't jump.
  // The choice is based on the list's top and the collapsed row height, never on the cards'
  // current positions, so opening a card can't feed back into which card is open.
  const serviceList = document.querySelector('.service-cards');
  const serviceCards = serviceList ? [...serviceList.querySelectorAll('.card')] : [];
  if (serviceCards.length) {
    const phone = window.matchMedia('(max-width: 820px)');
    let ticking = false;
    let current = -1;
    const pickActive = () => {
      ticking = false;
      if (!phone.matches) { serviceCards.forEach((c) => c.classList.remove('is-active')); current = -1; return; }
      const closed = serviceCards.filter((c) => !c.classList.contains('is-active'));
      const rowGap = parseFloat(getComputedStyle(serviceList).rowGap) || 0;
      const pitch = Math.min(...closed.map((c) => c.offsetHeight)) + rowGap;
      const progress = (window.innerHeight * 0.55 - serviceList.getBoundingClientRect().top) / pitch;
      let next = Math.max(0, Math.min(serviceCards.length - 1, Math.floor(progress)));
      // Small dead zone at each boundary so a card doesn't flicker when you stop right on it
      if (current !== -1 && next !== current && Math.abs(progress - Math.max(next, current)) < 0.12) next = current;
      if (next === current) return;
      current = next;
      serviceCards.forEach((c, i) => c.classList.toggle('is-active', i === next));
    };
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(pickActive); } };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    phone.addEventListener('change', queue);
    pickActive();
  }

  // Services page on phones: "Read more" reveals the full write-up
  document.querySelectorAll('.more-toggle').forEach((btn) => {
    const block = btn.closest('.service-block');
    const label = btn.querySelector('span');
    btn.addEventListener('click', () => {
      const open = !block.classList.contains('is-expanded');
      block.classList.toggle('is-expanded', open);
      btn.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Show less' : 'Read more';
    });
  });

  // Contact page: copy email address
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.querySelector('span');
    if (!label) return;
    const original = label.textContent;
    let resetTimer;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        label.textContent = 'Copied!';
      } catch {
        label.textContent = btn.dataset.copy; // clipboard blocked: show the address so it can be copied by hand
      }
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { label.textContent = original; }, 2000);
    });
  });

  // Keep the copyright year current
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
});
