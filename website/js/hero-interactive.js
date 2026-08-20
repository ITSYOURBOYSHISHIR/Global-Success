/** Home hero v2 — city crossfade, auto-rotate, subtle parallax */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-v2');
  if (!hero) return;

  const bgA = document.getElementById('heroBgA');
  const bgB = document.getElementById('heroBgB');
  const slideA = document.getElementById('heroSlideA');
  const slideB = document.getElementById('heroSlideB');
  const nameEl = document.getElementById('heroCityName');
  const taglineEl = document.getElementById('heroCityTagline');
  const frame = document.getElementById('heroFrame');
  const tabs = [...hero.querySelectorAll('.hero-v2-city-strip button')];

  if (!tabs.length || !slideA || !slideB) return;

  let activeIndex = tabs.findIndex(t => t.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  let userPicked = false;
  let rotateTimer;
  let bgToggle = false;
  let slideToggle = false;

  function setBgLayer(el, src) {
    if (!el || !src) return;
    el.style.backgroundImage = `url('${src}')`;
  }

  function applyCity(tab) {
    const city = tab.dataset.city;
    const src = tab.dataset.img;
    const tagline = tab.dataset.tagline;

    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    /* Crossfade slides */
    const incoming = slideToggle ? slideA : slideB;
    const outgoing = slideToggle ? slideB : slideA;
    incoming.src = src;
    incoming.alt = `${city} skyline`;
    incoming.classList.add('is-active');
    outgoing.classList.remove('is-active');
    slideToggle = !slideToggle;

    /* Crossfade ambient bg */
    const bgIn = bgToggle ? bgA : bgB;
    const bgOut = bgToggle ? bgB : bgA;
    setBgLayer(bgIn, src);
    bgIn?.classList.add('is-active');
    bgOut?.classList.remove('is-active');
    bgToggle = !bgToggle;

    if (nameEl) nameEl.textContent = city;
    if (taglineEl) taglineEl.textContent = tagline;
  }

  function goTo(index) {
    activeIndex = ((index % tabs.length) + tabs.length) % tabs.length;
    applyCity(tabs[activeIndex]);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      userPicked = true;
      clearInterval(rotateTimer);
      activeIndex = i;
      applyCity(tab);
    });
  });

  rotateTimer = setInterval(() => {
    if (!userPicked) goTo(activeIndex + 1);
  }, 5000);

  /* Subtle mouse parallax on the visual frame */
  if (frame && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', e => {
      const rect = frame.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      frame.style.transform = `perspective(900px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      frame.style.transform = '';
    });
  }

  /* Init first city */
  const first = tabs[activeIndex];
  setBgLayer(bgA, first.dataset.img);
  bgA?.classList.add('is-active');
  slideA.src = first.dataset.img;
  slideA.alt = `${first.dataset.city} skyline`;
  slideA.classList.add('is-active');
  if (nameEl) nameEl.textContent = first.dataset.city;
  if (taglineEl) taglineEl.textContent = first.dataset.tagline;
});
