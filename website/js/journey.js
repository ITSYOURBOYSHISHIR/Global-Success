/** Home page — tier support highlights */

const JOURNEY_HELP = [
  { icon: '✈️', title: 'Arrival Starter', desc: 'SIM, pickup, 7 days.' },
  { icon: '🏠', title: 'Student Settlement', desc: 'Bank, housing, 30 days.' },
  { icon: '💼', title: 'Career & Settlement', desc: 'Jobs, resume, 60 days.' },
  { icon: '⭐', title: 'Premium 90-Day', desc: 'WhatsApp, 5 consults.' }
];

document.addEventListener('DOMContentLoaded', () => {
  initJourneyHelp();
});

function initJourneyHelp() {
  const grid = document.getElementById('journeyHelpGrid');
  if (!grid) return;

  const label = typeof plainLabel === 'function' ? plainLabel : (t) => t;

  grid.innerHTML = JOURNEY_HELP.map(item => `
    <div class="journey-help-card">
      <span class="journey-help-icon" aria-hidden="true">${item.icon}</span>
      <h4>${label(item.title)}</h4>
      <p>${label(item.desc)}</p>
    </div>
  `).join('');

  if (typeof window.sanitizeAmpersands === 'function') window.sanitizeAmpersands();
}
