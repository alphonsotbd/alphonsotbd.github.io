const preferenceKey = 'portfolio-section-scroll';
const motionControl = document.querySelector('#scroll-animation');
const header = document.querySelector('.site-header');
const viewport = document.scrollingElement;
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
let enabled = true;
let animationFrame = 0;

try {
  enabled = window.localStorage.getItem(preferenceKey) !== 'off';
} catch {
  // The control still works during this visit if storage is disabled.
}

function cancelAnimation() {
  window.cancelAnimationFrame(animationFrame);
  animationFrame = 0;
}

function updateMotionControl() {
  motionControl.setAttribute('aria-pressed', String(enabled));
  motionControl.querySelector('span').textContent = enabled ? 'On' : 'Off';
  if (!enabled) {
    cancelAnimation();
  }
}

document.documentElement.classList.add('section-scroll-js');
motionControl.hidden = false;
updateMotionControl();
motionControl.addEventListener('click', () => {
  enabled = !enabled;
  try {
    window.localStorage.setItem(preferenceKey, enabled ? 'on' : 'off');
  } catch {
    // The choice still applies while the page is open.
  }
  updateMotionControl();
});

function scrollToSection(target, start) {
  cancelAnimation();
  const bottom = viewport.scrollHeight - viewport.clientHeight;
  const sectionTop = viewport.scrollTop + target.getBoundingClientRect().top - header.offsetHeight;
  const end = Math.max(0, Math.min(bottom, sectionTop));

  if (!enabled || Math.abs(end - start) < 2) {
    viewport.scrollTop = end;
    return;
  }

  if (viewport.scrollTop !== start) {
    viewport.scrollTop = start;
  }
  const duration = Math.min(1250, 650 + Math.abs(end - start) * 0.1);
  const started = window.performance.now();
  function animate(now) {
    const progress = Math.max(0, Math.min(1, (now - started) / duration));
    const eased = (1 - Math.cos(Math.PI * progress)) / 2;
    viewport.scrollTop = start + (end - start) * eased;
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
  const start = viewport.scrollTop;
  if (window.location.hash !== link.hash) {
    window.history.pushState(null, '', link.hash);
  }

  if (!target.hasAttribute('tabindex')) {
    target.tabIndex = -1;
  }
  target.focus({ preventScroll: true });
  scrollToSection(target, start);
});

window.addEventListener('wheel', cancelAnimation, { passive: true });
window.addEventListener('touchstart', cancelAnimation, { passive: true });
window.addEventListener('popstate', cancelAnimation);
window.addEventListener('keydown', (event) => {
  if (scrollKeys.has(event.key)) {
    cancelAnimation();
  }
});
