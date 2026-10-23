/* Selected work grid: the highlighted tile follows the mouse (or keyboard focus)
   and stays on whichever tile was hovered last. */
document.querySelectorAll('.grid5').forEach(function (grid) {
  var items = grid.querySelectorAll('.item');
  function activate(el) {
    items.forEach(function (item) { item.classList.toggle('is-active', item === el); });
  }
  items.forEach(function (item) {
    item.addEventListener('mouseenter', function () { activate(item); });
    item.addEventListener('focus', function () { activate(item); });
  });
});

/* Scroll reveal: sections fade up as they come into view.
   Items in the same row are staggered slightly. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var groups = [
    '.work-head', '.grid5 .item', '.media h2', '.hl',
    '.facts > div', '.cs-section', '.cs-next', 'footer h2', '.flinks'
  ];
  var els = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (el.closest('.hero')) return;
      el.classList.add('reveal');
      if (/item|hl|facts/.test(sel)) el.style.setProperty('--d', (i % 4) * 0.09 + 's');
      els.push(el);
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(function (el) { io.observe(el); });
})();
