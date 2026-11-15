const airConsole = document.querySelector('.air-console');
const sensor = airConsole.querySelector('.sensor-orb');
const reading = sensor.querySelector('strong');
const modes = Array.from(airConsole.querySelectorAll('[data-air-mode]'));
let activeMode = 0;
let airDemoTimer;

function advanceAirDemo() {
  activeMode = (activeMode + 1) % modes.length;
  const mode = modes[activeMode];
  airConsole.dataset.airState = mode.dataset.airMode;
  reading.textContent = mode.querySelector('b').textContent;
}

const airDemoObserver = new IntersectionObserver(([entry]) => {
  window.clearInterval(airDemoTimer);
  if (entry.isIntersecting) {
    airDemoTimer = window.setInterval(advanceAirDemo, 4600);
  }
}, { threshold: .25 });

airDemoObserver.observe(sensor);
