// Animations and page transitions
document.addEventListener('DOMContentLoaded', () => {
  // Page fade-in
  const root = document.documentElement;
  root.classList.add('fade-enter');
  requestAnimationFrame(() => {
    root.classList.add('fade-enter-active');
    root.classList.remove('fade-enter');
  });

  // Optional: fade-out on navigation (same-origin links only)
  const sameOrigin = (url) => {
    try { const u = new URL(url, location.href); return u.origin === location.origin; } catch { return false; }
  };
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download') || link.getAttribute('href')?.startsWith('#')) return;
    if (!sameOrigin(link.href)) return;
    e.preventDefault();
    root.classList.add('fade-exit-active');
    setTimeout(() => { window.location.href = link.href; }, 180);
  });
});


