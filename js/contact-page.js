/** Contact page — Find Us map sync */

const CONTACT_LOCATIONS = {
  melbourne: {
    label: 'Melbourne',
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=144.85,-38.0,145.1,-37.7&layer=mapnik&marker=-37.8136%2C144.9631'
  },
  sydney: {
    label: 'Sydney',
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=151.05,-34.0,151.35,-33.75&layer=mapnik&marker=-33.8688%2C151.2093'
  },
  kathmandu: {
    label: 'Kathmandu',
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=85.25,27.65,85.45,27.78&layer=mapnik&marker=27.7172%2C85.3240'
  },
  butwal: {
    label: 'Butwal',
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=83.40,27.65,83.50,27.75&layer=mapnik&marker=27.7000%2C83.4486'
  },
  chitwan: {
    label: 'Chitwan',
    map: 'https://www.openstreetmap.org/export/embed.html?bbox=84.2,27.45,84.5,27.65&layer=mapnik&marker=27.5291%2C84.3542'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLocationTabs();
  initLocationCards();
  syncFindUsHeights();
  window.addEventListener('resize', syncFindUsHeights);
  if (typeof window.refreshCustomSelects === 'function') {
    window.refreshCustomSelects();
  }
});

function syncFindUsHeights() {
  const list = document.querySelector('.locations-list');
  const mapWrap = document.querySelector('.find-us-map-wrap');
  if (!list || !mapWrap) return;

  if (window.innerWidth <= 900) {
    mapWrap.style.minHeight = '';
    return;
  }

  mapWrap.style.minHeight = `${list.offsetHeight}px`;
}

function initLocationTabs() {
  const tabs = document.getElementById('locationRegionTabs');
  const cards = document.querySelectorAll('.loc-card[data-region]');
  if (!tabs) return;

  function filterRegion(region) {
    tabs.querySelectorAll('button').forEach(btn => {
      const isActive = btn.dataset.region === region;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    cards.forEach(card => {
      const show = region === 'all' || card.dataset.region === region;
      card.classList.toggle('is-hidden', !show);
    });

    const firstVisible = [...cards].find(c => !c.classList.contains('is-hidden'));
    if (firstVisible) selectLocation(firstVisible.dataset.location);
    syncFindUsHeights();
  }

  tabs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => filterRegion(btn.dataset.region));
  });

  filterRegion('all');
}

function initLocationCards() {
  document.querySelectorAll('.loc-card[data-location]').forEach(card => {
    card.addEventListener('click', () => selectLocation(card.dataset.location));
  });
}

function selectLocation(key) {
  const loc = CONTACT_LOCATIONS[key];
  if (!loc) return;

  const card = document.querySelector(`.loc-card[data-location="${key}"]`);
  if (card?.classList.contains('is-hidden')) return;

  document.querySelectorAll('.loc-card[data-location]').forEach(c => {
    c.classList.toggle('is-active', c.dataset.location === key);
  });

  const cityEl = document.getElementById('mapLocationCity');
  const personEl = document.getElementById('mapLocationPerson');
  const thumbEl = document.getElementById('mapBarThumb');
  const call = document.getElementById('mapBarCall');
  const iframe = document.getElementById('contactMap');
  const wrap = document.querySelector('.find-us-map');

  const person = card?.dataset.person || '';
  if (cityEl) cityEl.textContent = loc.label;
  if (personEl) personEl.textContent = person;
  if (thumbEl && card?.dataset.image) {
    thumbEl.src = card.dataset.image;
    thumbEl.alt = loc.label;
  }
  if (call && card) {
    call.href = `tel:${card.dataset.phone || ''}`;
    call.textContent = card.dataset.phoneDisplay ? `Call ${card.dataset.phoneDisplay}` : 'Call';
  }

  if (iframe) {
    const nextSrc = loc.map;
    if (iframe.getAttribute('src') !== nextSrc) {
      wrap?.classList.add('is-loading');
      iframe.src = nextSrc;
      iframe.onload = () => wrap?.classList.remove('is-loading');
    }
  }
}
