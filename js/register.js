/** Enrol page — tier package selection + WhatsApp handoff */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const initialSlug = params.get('package') || (params.get('packages') || '').split(',')[0]?.trim();
  const initialCity = params.get('city');

  const tierGrid = document.getElementById('tierPackageGrid');
  const packageBadge = document.getElementById('packageBadge');
  const summaryList = document.getElementById('summaryList');
  const summaryDesc = document.getElementById('summaryDesc');
  const summaryName = document.getElementById('summaryName');
  const summaryVisual = document.getElementById('summaryVisual');
  const summaryThumb = document.getElementById('summaryThumb');
  const registerTitle = document.getElementById('registerTitle');
  const registerSubtitle = document.getElementById('registerSubtitle');
  const addonGrid = document.getElementById('addonGrid');
  const addonBadge = document.getElementById('addonBadge');

  let selectedPackage = initialSlug && PACKAGES.some(p => p.slug === initialSlug) ? initialSlug : '';
  const selectedAddons = new Set();

  function label(text) {
    if (typeof plainLabel === 'function') return plainLabel(text);
    return String(text).replace(/\s*&\s*/g, ' and ');
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

  function renderTierCards() {
    if (!tierGrid) return;

    tierGrid.innerHTML = PACKAGES.map(pkg => `
      <button type="button" class="tier-package-card tier-package-card--select ${pkg.popular ? 'is-featured' : ''} ${selectedPackage === pkg.slug ? 'selected' : ''}"
        data-slug="${pkg.slug}" aria-pressed="${selectedPackage === pkg.slug ? 'true' : 'false'}">
        ${pkg.popular ? '<span class="tier-package-badge">Most popular</span>' : ''}
        <span class="tier-package-check" aria-hidden="true"></span>
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
      </button>
    `).join('');

    tierGrid.querySelectorAll('.tier-package-card--select').forEach(btn => {
      btn.addEventListener('click', () => selectPackage(btn.dataset.slug));
    });
  }

  function selectPackage(slug) {
    selectedPackage = slug;
    renderTierCards();
    updatePackageHiddenInputs();
    updateBadges();
    updateSummary();
    document.getElementById('panelPackages')?.classList.remove('field-error');
  }

  function updatePackageHiddenInputs() {
    const holder = document.getElementById('packageHiddenInputs');
    if (!holder) return;
    holder.innerHTML = '';
    if (selectedPackage) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'packages';
      input.value = selectedPackage;
      holder.appendChild(input);
    }
  }

  function updateBadges() {
    if (packageBadge) {
      packageBadge.textContent = selectedPackage ? '1 selected' : 'Pick one';
      packageBadge.classList.toggle('has-items', !!selectedPackage);
    }
    if (addonBadge) {
      addonBadge.textContent = selectedAddons.size ? `${selectedAddons.size} selected` : 'Optional';
      addonBadge.classList.toggle('has-items', selectedAddons.size > 0);
    }
  }

  function renderAddonCards() {
    if (!addonGrid || typeof ADDONS === 'undefined') return;

    addonGrid.innerHTML = ADDONS.map(addon => `
      <button type="button" class="js-addon-card js-addon-card--select ${selectedAddons.has(addon.slug) ? 'selected' : ''}"
        data-slug="${addon.slug}" aria-pressed="${selectedAddons.has(addon.slug) ? 'true' : 'false'}">
        <h3>${label(addon.name)}</h3>
        <p>${label(addon.desc)}</p>
        <span class="js-addon-tag">Optional add-on</span>
      </button>
    `).join('');

    addonGrid.querySelectorAll('.js-addon-card--select').forEach(btn => {
      btn.addEventListener('click', () => toggleAddon(btn.dataset.slug));
    });
  }

  function toggleAddon(slug) {
    if (selectedAddons.has(slug)) selectedAddons.delete(slug);
    else selectedAddons.add(slug);
    renderAddonCards();
    updateAddonHiddenInputs();
    updateBadges();
    updateSummary();
  }

  function updateAddonHiddenInputs() {
    const holder = document.getElementById('addonHiddenInputs');
    if (!holder) return;
    holder.innerHTML = '';
    selectedAddons.forEach(slug => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'addons';
      input.value = slug;
      holder.appendChild(input);
    });
  }

  function getAddon(slug) {
    return ADDONS.find(a => a.slug === slug) || null;
  }

  function updateSummary() {
    const pkg = selectedPackage ? getPackage(selectedPackage) : null;

    if (summaryList) {
      if (!pkg) {
        summaryList.innerHTML = '<li class="is-empty">Your package will appear here when you tap one.</li>';
      } else {
        summaryList.innerHTML = `
          <li><span class="summary-tag">Package</span>${typeof packageTitle === 'function' ? packageTitle(pkg) : label(pkg.shortName || pkg.name)}</li>
          <li><span class="summary-tag">Support</span>${pkg.supportDays} days</li>
          ${pkg.consultations ? `<li><span class="summary-tag">Consults</span>${pkg.consultations}</li>` : ''}
          ${selectedAddons.size ? `<li><span class="summary-tag">Extras</span>${[...selectedAddons].map(slug => label(getAddon(slug)?.name || slug)).join(', ')}</li>` : ''}
        `;
      }
    }

    if (summaryDesc) {
      summaryDesc.textContent = pkg
        ? `${pkg.supportDays}-day support · WhatsApp after submit.`
        : 'Each tier includes the levels below.';
    }

    if (summaryName) {
      summaryName.textContent = pkg ? (typeof packageTitle === 'function' ? packageTitle(pkg) : label(pkg.shortName || pkg.name)) : 'Your package';
    }

    if (registerTitle) {
      registerTitle.textContent = pkg ? 'Complete enrolment' : 'Enrol';
    }
    if (registerSubtitle) {
      registerSubtitle.textContent = pkg
        ? 'Your details — then continue on WhatsApp.'
        : 'Pick a tier, then send your details.';
    }

    const hero = pkg?.image || pkg?.australia || 'assets/images/heroes/students-australia.jpg';
    if (summaryVisual) summaryVisual.style.backgroundImage = `url('${hero}')`;
    if (summaryThumb) summaryThumb.src = hero;
  }

  function prefillCity(city) {
    if (!city) return;
    const select = document.getElementById('destinationCity');
    if (!select) return;
    [...select.options].forEach(opt => {
      if (opt.value.toLowerCase() === city.toLowerCase()) select.value = opt.value;
    });
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  renderTierCards();
  renderAddonCards();
  updatePackageHiddenInputs();
  updateAddonHiddenInputs();
  updateBadges();
  updateSummary();
  prefillCity(initialCity);

  form.addEventListener('register:validate', e => {
    if (!selectedPackage) {
      e.preventDefault();
      document.getElementById('panelPackages')?.classList.add('field-error');
      document.getElementById('panelPackages')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  if (typeof window.refreshCustomSelects === 'function') {
    window.refreshCustomSelects();
  }
});
