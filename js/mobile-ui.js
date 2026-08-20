/** Mobile & tablet UI — nav drawer, touch polish, seamless scroll */

document.addEventListener('DOMContentLoaded', () => {
  initResponsiveNav();
  initTouchClass();
});

function initTouchClass() {
  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  document.documentElement.classList.toggle('is-touch', touch);
}

function initResponsiveNav() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  const header = document.querySelector('.dingoos-header, .navbar');
  if (!toggle || !links) return;

  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.hidden = true;
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  const closeMenu = () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    backdrop.classList.remove('is-visible');
  };

  const openMenu = () => {
    links.classList.add('open');
    toggle.classList.add('open');
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
  };

  toggle.addEventListener('click', () => {
    if (links.classList.contains('open')) closeMenu();
    else openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  window.matchMedia('(min-width: 901px)').addEventListener('change', e => {
    if (e.matches) closeMenu();
  });

  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', links.id || 'navLinks');
}
