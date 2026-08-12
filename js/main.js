/* Skills Australia — supplementary interactions (dingoos.js handles header, carousel, etc.) */

document.addEventListener('DOMContentLoaded', () => {
  /* Extra reveal for index-only elements if dingoos already ran */
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    if (!el.classList.contains('card1') && !el.classList.contains('lista-item')) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      obs.observe(el);
    }
  });
});
