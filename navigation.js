const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const preferenceKey = 'portfolio-smooth-scrolling';
const motionControl = document.querySelector('#scroll-animation');
const header = document.querySelector('.site-header');
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
let preference;
let animationFrame = 0;

try {
  preference = window.localStorage.getItem(preferenceKey);
} catch {
  // The system setting is still available when local storage is disabled.
}

function animationEnabled() {
  if (preference === 'on' || preference === 'off') {
    return preference === 'on';
  }
  return !reducedMotion.matches;
}

function cancelAnimation() {
  window.cancelAnimationFrame(animationFrame);
  animationFrame = 0;
}

function updateMotionControl() {
  const enabled = animationEnabled();
  motionControl.setAttribute('aria-pressed', String(enabled));
  motionControl.querySelector('span').textContent = enabled ? 'On' : 'Off';
  if (!enabled) {
    cancelAnimation();
  }
}

motionControl.hidden = false;
updateMotionControl();
motionControl.addEventListener('click', () => {
  preference = animationEnabled() ? 'off' : 'on';
  try {
    window.localStorage.setItem(preferenceKey, preference);
  } catch {
    // The choice still applies while the page is open.
  }
  updateMotionControl();
});
reducedMotion.addEventListener('change', updateMotionControl);

function scrollToSection(target) {
  cancelAnimation();
  const start = window.scrollY;
  const bottom = document.documentElement.scrollHeight - window.innerHeight;
  const sectionTop = start + target.getBoundingClientRect().top - header.offsetHeight;
  const end = Math.max(0, Math.min(bottom, sectionTop));

  const setPosition = (top) => window.scrollTo({ top, behavior: 'instant' });
  if (!animationEnabled() || Math.abs(end - start) < 2) {
    setPosition(end);
    return;
  }

  const duration = Math.min(900, 450 + Math.abs(end - start) * 0.13);
  const started = window.performance.now();
  function animate(now) {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - (1 - progress) ** 3;
    setPosition(start + (end - start) * eased);
    animationFrame = progress < 1 ? window.requestAnimationFrame(animate) : 0;
  }
  animationFrame = window.requestAnimationFrame(animate);
}

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
  scrollToSection(target);
});

window.addEventListener('wheel', cancelAnimation, { passive: true });
window.addEventListener('touchstart', cancelAnimation, { passive: true });
window.addEventListener('popstate', cancelAnimation);
window.addEventListener('keydown', (event) => {
  if (scrollKeys.has(event.key)) {
    cancelAnimation();
  }
});
