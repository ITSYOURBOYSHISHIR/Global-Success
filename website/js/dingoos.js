/**
 * Dingoos-exact JavaScript behaviour
 * Header 103px · hide/show · 1000ms smooth scroll · card btnhover · carousel · parallax
 */

document.addEventListener('DOMContentLoaded', () => {
  initDingoosHeader();
  initSmoothScroll();
  initScrollReveal();
  initCityCarousel();
  initCardHover();
  initTocHighlight();
  initAccordions();
  initParallax();
});

/* Header — exact Dingoos: height 103px, oculto -110px, fondo on scroll, 0.4s ease */
function initDingoosHeader() {
  const header = document.querySelector('.dingoos-header, .navbar');
  if (!header) return;

  let lastScroll = 0;
  const progressBar = document.querySelector('.scroll-progress span');

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (current <= 0) {
      header.classList.remove('fondo', 'oculto');
    } else {
      header.classList.add('fondo');
      if (current > lastScroll && current > 120) {
        header.classList.add('oculto');
      } else {
        header.classList.remove('oculto');
      }
    }
    lastScroll = current;

    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${(current / docHeight) * 100}%`;
    }
  }, { passive: true });

  /* Nav menu handled by mobile-ui.js on ≤900px screens */
}

/* Smooth scroll — Dingoos uses 1000ms jQuery animate */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const start = window.scrollY;
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 103;
      const end = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      const duration = 1000;
      const startTime = performance.now();

      function ease(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + (end - start) * ease(progress));
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  });
}

/* Scroll reveal with Dingoos easing stagger */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .card1, .lista-item, .city-slide, .journey-paso');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => obs.observe(el));
}

/* Card hover — Dingoos a.btnenlaceF / card1.btnhover */
function initCardHover() {
  document.querySelectorAll('.card1').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('btnhover'));
    card.addEventListener('mouseleave', () => card.classList.remove('btnhover'));
  });
  document.querySelectorAll('.acordeon').forEach(ac => {
    const titu = ac.querySelector('.acordeon-titu');
    titu?.addEventListener('mouseenter', () => ac.classList.add('acordeonhover'));
    titu?.addEventListener('mouseleave', () => ac.classList.remove('acordeonhover'));
  });
}

/* City carousel — carrouselciudades slick settings */
function initCityCarousel() {
  const track = document.querySelector('.carousel-track');
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');
  const dots = document.querySelector('.carousel-dots');
  if (!track) return;

  const slides = [...track.children];
  let index = 0;
  let slidesToShow = getSlidesToShow();

  function getSlidesToShow() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1250) return 2;
    return 3;
  }

  function update() {
    slidesToShow = getSlidesToShow();
    document.documentElement.style.setProperty('--slides-show', slidesToShow);
    const maxIndex = Math.max(0, slides.length - slidesToShow);
    if (index > maxIndex) index = maxIndex;
    track.style.transform = `translateX(-${(index * 100) / slidesToShow}%)`;
    if (dots) {
      dots.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === index));
    }
  }

  if (dots) {
    const pages = Math.max(1, slides.length - 2);
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.addEventListener('click', () => { index = i; update(); });
      dots.appendChild(btn);
    }
  }

  prev?.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  next?.addEventListener('click', () => {
    index = Math.min(Math.max(0, slides.length - slidesToShow), index + 1);
    update();
  });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next?.click() : prev?.click();
  }, { passive: true });

  window.addEventListener('resize', update);
  update();
}

function initTocHighlight() {
  const links = document.querySelectorAll('.bloque-indice a, .toc-sidebar a');
  const sections = document.querySelectorAll('[id].dingoos-section, [id].content-section, [id].aus-topic-card');
  if (!links.length || !sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.3, rootMargin: '-100px 0px -55% 0px' });

  sections.forEach(s => obs.observe(s));
}

function initAccordions() {
  document.querySelectorAll('.acordeon-titu').forEach(titu => {
    titu.addEventListener('click', () => {
      const acordeon = titu.closest('.acordeon');
      const isActive = acordeon.classList.contains('active');
      document.querySelectorAll('.acordeon.active').forEach(a => {
        a.classList.remove('active');
        const d = a.querySelector('.acordeon-desc');
        if (d) d.style.maxHeight = '0';
      });
      if (!isActive) {
        acordeon.classList.add('active');
        const desc = acordeon.querySelector('.acordeon-desc');
        if (desc) desc.style.maxHeight = desc.scrollHeight + 'px';
      }
    });
  });
}


function initParallax() {
  const bg = document.querySelector('.dingoos-hero-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
  }, { passive: true });
}
