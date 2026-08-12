/** Student journey — Dingoos-style path + before/after help grid */

const JOURNEY_HELP = {
  before: [
    { icon: '🎯', title: 'Package advice', desc: 'Tailored plan based on your city, budget, and goals — pick only what you need.' },
    { icon: '💻', title: 'Online classes', desc: 'Learn from Nepal before you fly with Nepali-friendly guidance.' },
    { icon: '📝', title: 'Practice quiz tools', desc: 'Road rules, job prep, and package quizzes while still at home.' },
    { icon: '💼', title: 'Jobs and resume prep', desc: 'Seek, Australian resume templates, and interview guidance.' },
    { icon: '🏠', title: 'Renting and scams guide', desc: 'Find rooms safely in any city — we guide, we do not find housing.' },
    { icon: '🗣️', title: 'NAATI and learner prep', desc: 'CCL and learner permit preparation can start in Nepal.' }
  ],
  after: [
    { icon: '✈️', title: 'Free airport pickup', desc: 'Met at Melbourne or Sydney airport and taken to your accommodation — every package.' },
    { icon: '📱', title: 'Free SIM and activation help', desc: 'SIM included on enrol in Nepal — we help you activate in Australia.' },
    { icon: '🚌', title: 'Free transport card top-up', desc: 'Pre-loaded city transport card for any Australian city.' },
    { icon: '🏦', title: 'Open a bank account', desc: 'Step-by-step guide to open an Australian bank account after arrival.' },
    { icon: '🍽️', title: 'Free food tips', desc: 'Salvation Army, Foodbank, and community kitchens mapped for you.' },
    { icon: '📋', title: 'Work rights and TFN', desc: 'Fair Work, tax file number, and super guidance — apply yourself.' }
  ]
};

const DOT_SVG = '';

document.addEventListener('DOMContentLoaded', () => {
  initJourneyHelp();
});

function initJourneyHelp() {
  const grid = document.getElementById('journeyHelpGrid');
  const tabs = document.getElementById('journeyPhaseTabs');
  if (!grid || !tabs) return;

  function render(phaseKey) {
    grid.classList.add('is-switching');
    setTimeout(() => {
      grid.innerHTML = JOURNEY_HELP[phaseKey].map(item => `
        <div class="journey-help-card">
          <span class="journey-help-icon" aria-hidden="true">${item.icon}</span>
        <h4>${plainLabel(item.title)}</h4>
        <p>${plainLabel(item.desc)}</p>
        </div>
      `).join('');
      grid.classList.remove('is-switching');
      if (typeof window.sanitizeAmpersands === 'function') window.sanitizeAmpersands();
    }, 180);
  }

  function setPhase(phaseKey, broadcast = true) {
    tabs.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b.dataset.phase === phaseKey);
    });
    render(phaseKey);
    if (broadcast) {
      window.dispatchEvent(new CustomEvent('homePhaseChange', { detail: { phase: phaseKey } }));
    }
  }

  tabs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => setPhase(btn.dataset.phase));
  });

  window.addEventListener('homePhaseChange', (e) => {
    const active = tabs.querySelector('button.active');
    if (!active || active.dataset.phase !== e.detail.phase) {
      setPhase(e.detail.phase, false);
    }
  });

  setPhase('before', false);
}
