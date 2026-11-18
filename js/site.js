/* Kyle McCutchen portfolio: small, progressive interactions.
   Everything here is optional: the site works fully without JavaScript. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var pre = /\/game-dev\//.test(location.pathname) ? '../' : '';
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------- header: solid after scrolling ---------- */
  var header = document.querySelector('.site-header');
  var bar = document.querySelector('.progress span');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    if (bar) {
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- home wordmark: fill the width on one line ---------- */
  var wm = document.querySelector('.hero-home .wordmark');
  function fit() {
    if (!wm) return;
    wm.style.fontSize = '';
    if (getComputedStyle(wm).whiteSpace !== 'nowrap') return;
    var span = wm.querySelector('span');
    if (!span) return;
    var size = parseFloat(getComputedStyle(wm).fontSize);
    wm.style.fontSize = Math.min(size * (wm.clientWidth / span.offsetWidth) * 0.995, 220) + 'px';
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener('resize', fit);

  /* ---------- local time in Durham ---------- */
  var clock = document.querySelector('.local-time');
  function tick() {
    if (!clock) return;
    try {
      clock.textContent = '· ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
    } catch (e) {}
  }
  tick(); setInterval(tick, 30000);

  /* ---------- hero portrait: subtle 3D tilt toward the cursor ---------- */
  var heroHome = document.querySelector('.hero-home');
  var portrait = document.querySelector('.hero-portrait img');
  if (heroHome && portrait && fine && !reduce) {
    heroHome.addEventListener('mousemove', function (e) {
      var r = heroHome.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      portrait.style.transform = 'rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 5).toFixed(2) + 'deg)';
    });
    heroHome.addEventListener('mouseleave', function () { portrait.style.transform = ''; });
  }

  /* ---------- cards: magnetic arrow ---------- */
  if (fine && !reduce) {
    document.querySelectorAll('.card, .next-card').forEach(function (card) {
      var arrow = card.querySelector('.card-arrow');
      if (!arrow) return;
      card.addEventListener('mousemove', function (e) {
        var a = arrow.getBoundingClientRect();
        var dx = e.clientX - (a.left + a.width / 2), dy = e.clientY - (a.top + a.height / 2);
        var d = Math.hypot(dx, dy), k = Math.max(0, 1 - d / 260) * 0.25;
        arrow.style.transform = 'translate(' + (dx * k).toFixed(1) + 'px,' + (dy * k).toFixed(1) + 'px)';
      });
      card.addEventListener('mouseleave', function () { arrow.style.transform = ''; });
    });
  }

  /* ---------- videos: only play while on screen ---------- */
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('video[autoplay]').forEach(function (v) { vio.observe(v); });
  }

  /* ---------- case studies: contents list that tracks the section you're reading ---------- */
  var toc = document.querySelector('.toc');
  if (toc) {
    var links = [];
    document.querySelectorAll('.cs-main .cs-section').forEach(function (sec, i) {
      var h = sec.querySelector('h2');
      if (!h) return;
      if (!sec.id) sec.id = 'section-' + (i + 1);
      var label = h.cloneNode(true);
      var n = label.querySelector('.n'); if (n) n.remove();
      var a = document.createElement('a');
      a.href = '#' + sec.id; a.textContent = label.textContent.trim();
      toc.appendChild(a); links.push([sec, a]);
    });
    if (links.length && 'IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) { l[1].classList.toggle('on', l[0] === e.target); });
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      links.forEach(function (l) { tio.observe(l[0]); });
    }
  }

  /* ---------- toast + copy email ---------- */
  var toast;
  function say(msg) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(say.t); say.t = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  function copyEmail() {
    var email = 'kwm26@duke.edu';
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(function () { say('Email copied'); }, function () { location.href = 'mailto:' + email; });
    else location.href = 'mailto:' + email;
  }
  var mail = document.querySelector('.site-footer .mail');
  if (mail) {
    var cb = document.createElement('button');
    cb.type = 'button'; cb.className = 'copy-btn'; cb.textContent = 'Copy';
    cb.addEventListener('click', copyEmail);
    mail.insertAdjacentElement('afterend', cb);
  }

  /* ---------- command menu (Ctrl/⌘ + K) ---------- */
  var items = [
    { g: 'Work', t: 'Product Design (ATP)', s: 'Case study', u: 'front-end.html' },
    { g: 'Work', t: 'Real-time motion overlays', s: 'ATP', u: 'front-end.html#realtime' },
    { g: 'Work', t: 'Production & Project Management', s: 'Case study', u: 'production.html' },
    { g: 'Work', t: 'ATP Board', s: 'Internal tool', u: 'production.html#board' },
    { g: 'Work', t: 'AI video blur tool', s: 'Video tooling', u: 'production.html#blur' },
    { g: 'Work', t: 'Game Development', s: 'Unreal & Unity', u: 'game-dev/index.html' },
    { g: 'Work', t: 'Audio Design', s: 'Ableton · Wwise · Unreal', u: 'game-dev/audio.html' },
    { g: 'Pages', t: 'Home', s: '', u: 'index.html' },
    { g: 'Pages', t: 'About', s: '', u: 'about.html' },
    { g: 'Contact', t: 'Copy email address', s: 'kwm26@duke.edu', a: copyEmail },
    { g: 'Contact', t: 'Open resume', s: 'PDF', u: 'assets/Kyle_McCutchen_Resume.pdf', ext: true },
    { g: 'Contact', t: 'LinkedIn', s: '', u: 'https://www.linkedin.com/in/kyle-mccutchen/', ext: true }
  ];
  var cmdk = document.createElement('div');
  cmdk.className = 'cmdk';
  cmdk.innerHTML = '<div class="cmdk-box" role="dialog" aria-modal="true" aria-label="Site menu"><input type="text" placeholder="Jump to a project, page, or contact..." aria-label="Search"><ul role="listbox"></ul><div class="cmdk-foot"><span>&uarr;&darr; to move</span><span>Enter to open</span><span>Esc to close</span></div></div>';
  document.body.appendChild(cmdk);
  var input = cmdk.querySelector('input'), list = cmdk.querySelector('ul'), shown = [], sel = 0;
  function render() {
    var q = input.value.trim().toLowerCase();
    shown = items.filter(function (it) { return !q || (it.t + ' ' + it.s + ' ' + it.g).toLowerCase().indexOf(q) > -1; });
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    var html = '', last = '';
    shown.forEach(function (it, i) {
      if (it.g !== last) { html += '<li class="group" aria-hidden="true">' + it.g + '</li>'; last = it.g; }
      html += '<li role="option" data-i="' + i + '"' + (i === sel ? ' class="sel" aria-selected="true"' : '') + '><span>' + it.t + '</span><small>' + it.s + '</small></li>';
    });
    list.innerHTML = html || '<li class="group">No matches</li>';
  }
  function run(it) {
    if (!it) return;
    close();
    if (it.a) return it.a();
    var url = /^https?:/.test(it.u) ? it.u : pre + it.u;
    if (it.ext) window.open(url, '_blank', 'noopener'); else location.href = url;
  }
  function open() { cmdk.classList.add('open'); input.value = ''; sel = 0; render(); setTimeout(function () { input.focus(); }, 10); }
  function close() { cmdk.classList.remove('open'); }
  input.addEventListener('input', function () { sel = 0; render(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, shown.length - 1); render(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    else if (e.key === 'Enter') { run(shown[sel]); e.preventDefault(); }
  });
  list.addEventListener('click', function (e) { var li = e.target.closest('li[data-i]'); if (li) run(shown[+li.dataset.i]); });
  cmdk.addEventListener('click', function (e) { if (e.target === cmdk) close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.classList.contains('open') ? close() : open(); }
    else if (e.key === 'Escape' && cmdk.classList.contains('open')) close();
  });
  var nav = document.querySelector('.site-header nav');
  if (nav) {
    var mb = document.createElement('button');
    mb.type = 'button'; mb.className = 'menu-btn';
    mb.innerHTML = 'Menu <kbd>' + (isMac ? '&#8984;K' : 'Ctrl K') + '</kbd>';
    mb.addEventListener('click', open);
    nav.appendChild(mb);
  }

  /* ---------- scroll reveal ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var groups = ['.section-head', '.bento .card', '.statement .wrap', '.steps .step', '.cs-facts .facts > div',
                  '.cs-section', '.decision', '.about-block', '.next-card'];
    var els = [];
    groups.forEach(function (selr) {
      document.querySelectorAll(selr).forEach(function (el, i) {
        el.classList.add('reveal');
        if (/card|step|facts|decision/.test(selr)) el.style.setProperty('--d', (i % 4) * 0.08 + 's');
        els.push(el);
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }
})();
