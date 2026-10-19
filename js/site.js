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
