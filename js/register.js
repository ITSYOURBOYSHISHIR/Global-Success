/** Enrol page — multi-select goals and packages in separate sections */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const initialSlugs = (params.get('package') || params.get('packages') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const initialCity = params.get('city');

  const goalGrid = document.getElementById('goalChipGrid');
  const gridBefore = document.getElementById('packageGridBefore');
  const gridAfter = document.getElementById('packageGridAfter');
  const gridAddons = document.getElementById('packageGridAddons');
  const goalBadge = document.getElementById('goalBadge');
  const packageBadge = document.getElementById('packageBadge');
  const summaryList = document.getElementById('summaryList');
  const summaryDesc = document.getElementById('summaryDesc');
  const summaryName = document.getElementById('summaryName');
  const summaryVisual = document.getElementById('summaryVisual');
  const summaryThumb = document.getElementById('summaryThumb');
  const registerTitle = document.getElementById('registerTitle');
  const registerSubtitle = document.getElementById('registerSubtitle');

  const selectedGoals = new Set();
  const selectedPackages = new Set();
  const selectedAddons = new Set();

  function label(text) {
    if (typeof plainLabel === 'function') return plainLabel(text);
    if (typeof fixAmpersandText === 'function') return fixAmpersandText(text);
    return String(text).replace(/\s*&\s*/g, ' and ');
  }

  function initGoals() {
    if (!goalGrid || typeof ENROL_GOALS === 'undefined') return;

    goalGrid.innerHTML = ENROL_GOALS.map(g => `
      <button type="button" class="goal-chip-btn" data-value="${g.value}" data-package="${g.packageSlug || ''}" aria-pressed="false">
        <span class="goal-chip-icon" aria-hidden="true">${g.icon}</span>
        <span class="goal-chip-text">
          <strong>${label(g.label)}</strong>
          <small>${label(g.hint)}</small>
        </span>
      </button>
    `).join('');

    goalGrid.querySelectorAll('.goal-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleGoal(btn));
    });
  }

  function toggleGoal(btn) {
    const value = btn.dataset.value;
    const isNotSure = value === 'Not sure yet — help me choose';

    if (isNotSure) {
      if (selectedGoals.has(value)) {
        selectedGoals.delete(value);
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        selectedGoals.clear();
        goalGrid.querySelectorAll('.goal-chip-btn').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-pressed', 'false');
        });
        selectedGoals.add(value);
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }
    } else {
      selectedGoals.delete('Not sure yet — help me choose');
      const notSure = goalGrid.querySelector('[data-value="Not sure yet — help me choose"]');
      if (notSure) {
        notSure.classList.remove('selected');
        notSure.setAttribute('aria-pressed', 'false');
      }

      if (selectedGoals.has(value)) {
        selectedGoals.delete(value);
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        selectedGoals.add(value);
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }

      const slug = btn.dataset.package;
      if (slug && !selectedPackages.has(slug) && !selectedAddons.has(slug)) {
        togglePackage(slug, ADDONS.some(a => a.slug === slug) ? 'addon' : 'package', true);
      }
    }

    document.getElementById('panelGoals')?.classList.remove('field-error');
    updateGoalHiddenInputs();
    updateBadges();
    updateSummary();
  }

  function buildPackageGrid(container, items, type) {
    if (!container) return;
    container.innerHTML = items.map(item => `
      <button type="button" class="aus-package-card" data-slug="${item.slug}" data-type="${type}" aria-pressed="false">
        ${item.popular ? '<span class="aus-package-popular">Popular</span>' : ''}
        <span class="aus-package-check" aria-hidden="true"></span>
        <img src="${item.image || item.australia}" alt="" loading="lazy">
        <span class="aus-package-card-body">
          <span class="aus-package-name">${label(item.name)}</span>
        </span>
      </button>
    `).join('');

    container.querySelectorAll('.aus-package-card').forEach(btn => {
      btn.addEventListener('click', () => togglePackage(btn.dataset.slug, btn.dataset.type));
    });
  }

  function initPackages() {
    buildPackageGrid(gridBefore, PACKAGES.filter(p => p.phase === 'before'), 'package');
    buildPackageGrid(gridAfter, PACKAGES.filter(p => p.phase === 'after'), 'package');
    buildPackageGrid(gridAddons, ADDONS, 'addon');
  }

  function togglePackage(slug, type, forceOn) {
    const set = type === 'addon' ? selectedAddons : selectedPackages;
    const turningOn = forceOn === true ? !set.has(slug) : set.has(slug) ? false : true;
    if (turningOn) set.add(slug);
    else set.delete(slug);

    syncPackageUI();
    updatePackageHiddenInputs();
    updateBadges();
    updateSummary();
  }

  function syncPackageUI() {
    document.querySelectorAll('.aus-package-card').forEach(card => {
      const slug = card.dataset.slug;
      const active = selectedPackages.has(slug) || selectedAddons.has(slug);
      card.classList.toggle('selected', active);
      card.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateGoalHiddenInputs() {
    const holder = document.getElementById('goalHiddenInputs');
    if (!holder) return;
    holder.innerHTML = '';
    selectedGoals.forEach(value => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'goals';
      input.value = value;
      holder.appendChild(input);
    });
  }

  function updatePackageHiddenInputs() {
    const holder = document.getElementById('packageHiddenInputs');
    if (!holder) return;
    holder.innerHTML = '';
    selectedPackages.forEach(slug => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'packages';
      input.value = slug;
      holder.appendChild(input);
    });
    selectedAddons.forEach(slug => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'addons';
      input.value = slug;
      holder.appendChild(input);
    });
  }

  function updateBadges() {
    if (goalBadge) {
      const n = selectedGoals.size;
      goalBadge.textContent = n ? `${n} goal${n === 1 ? '' : 's'} picked` : 'Pick at least one';
      goalBadge.classList.toggle('has-items', n > 0);
    }
    if (packageBadge) {
      const n = selectedPackages.size + selectedAddons.size;
      packageBadge.textContent = n ? `${n} selected` : 'Tap to add';
      packageBadge.classList.toggle('has-items', n > 0);
    }
  }

  function updateSummary() {
    const pkgs = [...selectedPackages].map(s => getPackage(s)).filter(Boolean);
    const addons = [...selectedAddons].map(s => getPackage(s)).filter(Boolean);
    const goals = [...selectedGoals];
    const total = pkgs.length + addons.length;

    if (summaryList) {
      if (!goals.length && !total) {
        summaryList.innerHTML = '<li class="is-empty">Your goals and packages will appear here as you tap.</li>';
      } else {
        let html = goals.map(g => `<li><span class="summary-tag">Goal</span>${g}</li>`).join('');
        html += pkgs.map(p => `<li><span class="summary-tag">Package</span>${label(p.name)}</li>`).join('');
        html += addons.map(a => `<li><span class="summary-tag">Add-on</span>${label(a.name)}</li>`).join('');
        summaryList.innerHTML = html;
      }
    }

    if (summaryDesc) {
      if (goals.includes('Not sure yet — help me choose')) {
        summaryDesc.textContent = 'We will recommend packages after you submit.';
      } else if (total) {
        summaryDesc.textContent = `${total} package${total === 1 ? '' : 's'} selected — add more anytime.`;
      } else if (goals.length) {
        summaryDesc.textContent = `${goals.length} goal${goals.length === 1 ? '' : 's'} selected — pick matching packages or leave blank.`;
      } else {
        summaryDesc.textContent = 'Tap goals and packages — your choices appear here.';
      }
    }

    if (summaryName) {
      summaryName.textContent = total ? `${total} item${total === 1 ? '' : 's'} selected` : 'Your selection';
    }

    if (registerTitle) {
      registerTitle.textContent = total
        ? (total === 1 ? 'Almost done' : `${total} packages in your request`)
        : 'Enrol With Global Success';
    }
    if (registerSubtitle) {
      registerSubtitle.textContent = total
        ? 'Complete your details below — we will confirm within 24–48 hours.'
        : 'Pick your goals, choose as many packages as you need, and we will contact you within 24–48 hours.';
    }

    const hero = pkgs[0]?.image || pkgs[0]?.australia || addons[0]?.image || 'assets/images/heroes/students-australia.jpg';
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

  initialSlugs.forEach(slug => {
    if (ADDONS.some(a => a.slug === slug)) selectedAddons.add(slug);
    else if (PACKAGES.some(p => p.slug === slug)) selectedPackages.add(slug);
  });

  initGoals();
  initPackages();
  syncPackageUI();
  updateGoalHiddenInputs();
  updatePackageHiddenInputs();
  updateBadges();
  updateSummary();
  prefillCity(initialCity);

  form.addEventListener('register:validate', e => {
    if (selectedGoals.size === 0) {
      e.preventDefault();
      document.getElementById('panelGoals')?.classList.add('field-error');
      document.getElementById('panelGoals')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  if (typeof window.refreshCustomSelects === 'function') {
    window.refreshCustomSelects();
  }
});
