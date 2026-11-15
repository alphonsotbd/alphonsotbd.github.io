const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const link = event.target.closest('a[href^="#"]');
  const target = link && document.getElementById(link.hash.slice(1));
  if (!target) {
    return;
  }

  event.preventDefault();
  if (window.location.hash !== link.hash) {
    window.history.pushState(null, '', link.hash);
  }

  if (!target.hasAttribute('tabindex')) {
    target.tabIndex = -1;
  }
  target.focus({ preventScroll: true });
  target.scrollIntoView({
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
    block: 'start',
  });
});
