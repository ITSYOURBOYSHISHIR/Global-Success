/** Packages page — render packages + toggle */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('packagesGrid');
  const toggle = document.getElementById('packageToggle');
  const slider = document.getElementById('toggleSlider');
  let phase = 'before';

  function renderPackages(p) {
    if (!grid) return;
    const list = PACKAGES.filter(pkg => pkg.phase === p);
    grid.innerHTML = list.map(pkg => `
      <article class="js-package-card ${pkg.popular ? 'popular' : ''}" data-slug="${pkg.slug}">
        ${pkg.popular ? '<span class="popular-badge">Popular</span>' : ''}
        <div class="js-package-visual">
          <img class="package-topic-img" src="${pkg.image || pkg.australia}" alt="${pkg.name}" loading="lazy">
        </div>
        <div class="js-package-body">
          <h3 class="js-package-name">${plainLabel(pkg.name)}</h3>
          <p class="js-package-desc">${plainLabel(pkg.desc)}</p>
          <ul class="js-package-features">
            ${pkg.features.map(f => `<li>${plainLabel(f)}</li>`).join('')}
          </ul>
        </div>
        <div class="js-package-foot">
          <a href="register.html?package=${pkg.slug}" class="js-btn js-btn-navy">Select Package →</a>
        </div>
      </article>
    `).join('');
  }

  function setPhase(p, broadcast = true) {
    phase = p;
    toggle.classList.toggle('after', p === 'after');
    toggle.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.phase === p);
    });
    renderPackages(p);
    if (typeof window.sanitizeAmpersands === 'function') window.sanitizeAmpersands();
    if (broadcast) {
      window.dispatchEvent(new CustomEvent('homePhaseChange', { detail: { phase: p } }));
    }
  }

  toggle?.querySelectorAll('button[data-phase]').forEach(btn => {
    btn.addEventListener('click', () => setPhase(btn.dataset.phase));
  });
  slider?.addEventListener('click', () => {
    setPhase(phase === 'before' ? 'after' : 'before');
  });

  window.addEventListener('homePhaseChange', (e) => {
    if (e.detail.phase !== phase) setPhase(e.detail.phase, false);
  });

  setPhase('before', false);

  // Free perks
  const perksGrid = document.getElementById('freePerksGrid');
  if (perksGrid) {
    perksGrid.innerHTML = FREE_PERKS.map(text => `
      <div class="js-addon-card">
        <span class="js-addon-tag">Included free</span>
        <h3>${plainLabel(text)}</h3>
      </div>
    `).join('');
  }

  // Add-ons
  const addonsGrid = document.getElementById('addonsGrid');
  if (addonsGrid) {
    addonsGrid.innerHTML = ADDONS.map(a => `
      <div class="js-addon-card">
        <span class="js-addon-tag">${plainLabel(a.tag)}</span>
        <img src="${a.image}" alt="" class="js-addon-thumb" loading="lazy">
        <h3>${plainLabel(a.name)}</h3>
        <p>${plainLabel(a.desc)}</p>
        <a href="register.html?package=${a.slug}" class="js-btn js-btn-primary" style="font-size:0.85rem;padding:0.6rem 1.2rem">Add to Enrolment →</a>
      </div>
    `).join('');
  }
});
