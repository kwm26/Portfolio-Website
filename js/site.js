/* Home wordmark: scale the name so it fills the width exactly on one line. */
(function () {
  var el = document.querySelector('.hero-home .wordmark');
  if (!el) return;
  function fit() {
    el.style.fontSize = '';
    if (getComputedStyle(el).whiteSpace !== 'nowrap') return;
    var span = el.querySelector('span');
    if (!span) return;
    var size = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = Math.min(size * (el.clientWidth / span.offsetWidth) * 0.995, 220) + 'px';
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);
})();

/* Header: add a solid background (and show the name on the home page) after scrolling. */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* Scroll reveal: content fades up as it comes into view; items in a row are staggered. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = ['.section-head', '.bento .card', '.statement .wrap', '.steps .step', '.cs-facts .facts > div',
                '.cs-section', '.decision', '.about-block', '.cs-next'];
  var els = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add('reveal');
      if (/card|step|facts|decision/.test(sel)) el.style.setProperty('--d', (i % 4) * 0.08 + 's');
      els.push(el);
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  els.forEach(function (el) { io.observe(el); });
})();
