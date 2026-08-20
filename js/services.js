/** Home page — render tiered packages */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('packagesGrid');
  if (!grid || typeof PACKAGES === 'undefined') return;

  function label(text) {
    return typeof plainLabel === 'function' ? plainLabel(text) : text;
  }

  function title(pkg) {
    if (typeof packageTitle === 'function') return packageTitle(pkg);
    return label(pkg.shortName || pkg.name);
  }

  function renderFeatureList(pkg) {
    return pkg.features.map((f, i) => {
      const isIncludes = i === 0 && pkg.includesPrevious;
      return `
        <li class="tier-package-feature ${isIncludes ? 'is-includes' : ''}">
          <span class="tier-feature-check" aria-hidden="true"></span>
          <span>${label(f)}</span>
        </li>
      `;
    }).join('');
  }

  grid.className = 'tier-packages-grid';
  grid.innerHTML = PACKAGES.map(pkg => `
    <article class="tier-package-card ${pkg.popular ? 'is-featured' : ''}" data-slug="${pkg.slug}">
      ${pkg.popular ? '<span class="tier-package-badge">Most popular</span>' : ''}
      <header class="tier-package-head">
        <span class="tier-package-num">Tier ${pkg.tier}</span>
        <h3 class="tier-package-name">${title(pkg)}</h3>
        <p class="tier-package-tagline">${label(pkg.tagline)}</p>
      </header>
      <div class="tier-package-stats">
        <div class="tier-stat">
          <strong>${pkg.supportDays}</strong>
          <span>days support</span>
        </div>
        ${pkg.consultations ? `
          <div class="tier-stat">
            <strong>${pkg.consultations}</strong>
            <span>consultation${pkg.consultations === 1 ? '' : 's'}</span>
          </div>
        ` : ''}
      </div>
      <div class="tier-package-body">
        <p class="tier-package-features-label">What's included</p>
        <ul class="tier-package-features">${renderFeatureList(pkg)}</ul>
      </div>
      <div class="tier-package-foot">
        <a href="register.html?package=${pkg.slug}" class="js-btn ${pkg.popular ? 'js-btn-primary' : 'js-btn-navy'}">Enrol in this package →</a>
      </div>
    </article>
  `).join('');

  if (typeof window.sanitizeAmpersands === 'function') window.sanitizeAmpersands();

  const addonsGrid = document.getElementById('addonsGrid');
  if (addonsGrid && typeof ADDONS !== 'undefined' && ADDONS.length) {
    addonsGrid.innerHTML = ADDONS.map(addon => `
      <article class="js-addon-card">
        <h3>${label(addon.name)}</h3>
        <p>${label(addon.desc)}</p>
        <span class="js-addon-tag">Optional add-on</span>
      </article>
    `).join('');
    if (typeof window.sanitizeAmpersands === 'function') window.sanitizeAmpersands();
  }
});
