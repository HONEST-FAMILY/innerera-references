/* Inner:Era 쇼핑몰 시안 공통 동작 — 따라다니는 헤더 · 왼쪽 서랍 · 하단 탭바 · 스크롤 등장 · 숫자 세기 · 첫 화면 배너
   외부 라이브러리 없음. 움직임은 transform·opacity만, 동작 줄이기 설정이면 모두 끄고 바로 보이게. */
(function () {
  var d = document, w = window, root = d.documentElement;
  var reduce = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (reduce) root.classList.add('rm');

  // 아직 없는 메뉴(href="#")는 화면이 튀지 않게
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  /* 1. 헤더: 8px 넘게 내리면 불투명 + 아래 선 (+ PC는 64px로 줄어듦) */
  var hd = d.querySelector('.hd');
  var ticking = false;
  function onScroll() {
    ticking = false;
    if (hd) hd.classList.toggle('is-scrolled', (w.scrollY || w.pageYOffset) > 8);
  }
  w.addEventListener('scroll', function () { if (!ticking) { ticking = true; w.requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* 2. 햄버거 → 왼쪽 서랍 */
  var dw = d.getElementById('drawer');
  var burger = d.querySelector('.burger');
  var opener = null, openState = false;
  function focusables() { return dw ? [].slice.call(dw.querySelectorAll('a[href]:not([tabindex="-1"]), button')) : []; }
  function openDrawer(src) {
    if (!dw || openState) return;
    openState = true; opener = src || burger;
    root.classList.add('dw-open');
    dw.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var first = dw.querySelector('.dw-nav a');
    setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, reduce ? 0 : 60);
  }
  function closeDrawer() {
    if (!dw || !openState) return;
    openState = false;
    root.classList.remove('dw-open');
    dw.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    var back = opener || burger;
    if (back) back.focus({ preventScroll: true });
  }
  if (dw) {
    dw.setAttribute('aria-hidden', 'true');
    if (burger) burger.addEventListener('click', function () { openDrawer(burger); });
    d.querySelectorAll('[data-open-drawer]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(b); }); });
    d.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
    dw.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { if (a.getAttribute('href') !== '#') closeDrawer(); }); });
    d.addEventListener('keydown', function (e) {
      if (!openState) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key === 'Tab') { // 열린 동안 포커스는 서랍 안에서만
        var f = focusables(); if (!f.length) return;
        var i = f.indexOf(d.activeElement);
        if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* 3. 하단 탭바: '#' 칸은 화면 튐 없이 (위 공통 처리), 카테고리 = 서랍 열기 (위 data-open-drawer) */

  /* 4. 스크롤 등장: 아래 24px → 제자리, 같은 줄 카드는 80ms 간격 */
  var blocks = [].slice.call(d.querySelectorAll('.rv, .rv-g'));
  d.querySelectorAll('.rv-g').forEach(function (g) {
    [].slice.call(g.children).forEach(function (c, i) { c.style.transitionDelay = (Math.min(i, 6) * 80) + 'ms'; });
  });
  function show(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    if (el.classList.contains('rv-g')) setTimeout(function () { [].slice.call(el.children).forEach(function (c) { c.style.transitionDelay = ''; }); }, 1400);
  }
  if (reduce || !('IntersectionObserver' in w)) {
    blocks.forEach(show);
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var r = en.boundingClientRect, ir = en.intersectionRect;
        if (en.intersectionRatio >= 0.15 || ir.height >= Math.min(r.height * 0.15, 120)) { show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: [0, 0.05, 0.1, 0.15, 0.3], rootMargin: '0px 0px 8% 0px' });
    blocks.forEach(function (el) { io.observe(el); });
    // 안전장치: 1.2s 뒤 화면 안(또는 이미 지나간) 덩어리는 관찰 결과와 상관없이 보이게
    setTimeout(function () {
      blocks.forEach(function (el) { if (el.getBoundingClientRect().top < w.innerHeight) show(el); });
    }, 1200);
  }

  /* 5. 실제 숫자는 화면에 들어올 때 0부터 세기 (1.2s) */
  function countUp(el) {
    if (reduce || el.dataset.done) return;
    el.dataset.done = '1';
    var to = parseFloat(el.getAttribute('data-count')); if (!(to > 0)) return;
    var t0 = null, dur = 1200;
    el.style.display = 'inline-block'; el.style.minWidth = el.offsetWidth + 'px';
    function fmt(v) { return Math.round(v).toLocaleString('ko-KR'); }
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) w.requestAnimationFrame(step); else { el.textContent = fmt(to); el.style.minWidth = ''; }
    }
    el.textContent = '0';
    w.requestAnimationFrame(step);
  }
  var counters = [].slice.call(d.querySelectorAll('[data-count]'));
  if (!reduce && 'IntersectionObserver' in w) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting && en.target.offsetParent !== null) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* 6. 원료 탭 (원본의 임상 탭 자리) */
  var tabs = d.querySelectorAll('.tabs button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var i = b.getAttribute('data-i');
      tabs.forEach(function (t) { var on = t === b; t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
      d.querySelectorAll('.pane').forEach(function (p) {
        var on = p.getAttribute('data-i') === i; p.classList.toggle('on', on);
        if (on) p.querySelectorAll('[data-count]').forEach(countUp);
      });
      d.querySelectorAll('.fig').forEach(function (f) { f.classList.toggle('on', f.getAttribute('data-i') === i); });
    });
  });

  /* 7. 첫 화면 배너: 6s마다 0.8s 크로스페이드, 진행 막대, 마우스 올리면 멈춤, 손가락으로 넘기기 */
  var hero = d.querySelector('[data-hero]');
  if (hero) {
    var slides = [].slice.call(hero.querySelectorAll('.slide'));
    var bars = [].slice.call(hero.querySelectorAll('.hbar button'));
    var cur = 0;
    function go(n) {
      n = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('on', i === n); s.setAttribute('aria-hidden', i === n ? 'false' : 'true'); if (s.tagName === 'A') s.tabIndex = i === n ? 0 : -1; });
      bars.forEach(function (b, i) {
        b.classList.remove('on'); b.classList.toggle('done', i < n);
        if (i === n) { void b.offsetWidth; b.classList.add('on'); }
        b.setAttribute('aria-current', i === n ? 'true' : 'false');
      });
      hero.classList.toggle('is-light', slides[n].getAttribute('data-tone') === 'light');
      cur = n;
    }
    bars.forEach(function (b, i) {
      b.addEventListener('click', function () { go(i); });
      var fill = b.querySelector('b');
      if (fill) fill.addEventListener('animationend', function () { if (b.classList.contains('on')) go(cur + 1); });
    });
    hero.addEventListener('mouseenter', function () { hero.classList.add('paused'); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('paused'); });
    hero.addEventListener('focusin', function () { hero.classList.add('paused'); });
    hero.addEventListener('focusout', function () { hero.classList.remove('paused'); });
    var media = hero.querySelector('[data-swipe]'), sx = null, sy = 0, swiped = false;
    if (media) {
      media.addEventListener('pointerdown', function (e) { sx = e.clientX; sy = e.clientY; swiped = false; });
      media.addEventListener('pointerup', function (e) {
        if (sx === null) return;
        var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; go(cur + (dx < 0 ? 1 : -1)); }
      });
      media.addEventListener('pointercancel', function () { sx = null; });
      media.addEventListener('click', function (e) { if (swiped) { e.preventDefault(); swiped = false; } }, true);
    }
    go(0);
  }

  /* 8. 폰 바닥글: 메뉴 묶음 펼치기/접기 (원본의 아코디언) */
  d.querySelectorAll('.ft-cols .col h4').forEach(function (h) {
    h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0');
    function toggle() { if (w.innerWidth > 767) return; h.parentNode.classList.toggle('open'); }
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  /* 8-2. 가로 줄: PC에서 마우스로 끌어서 넘기기 */
  d.querySelectorAll('[data-rail]').forEach(function (rail) {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
    w.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    w.addEventListener('pointerup', function () { down = false; });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });

  /* 9. 흐르는 띠: 화면 밖이면 멈춤 */
  if ('IntersectionObserver' in w) {
    var mio = new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.target.style.animationPlayState = en.isIntersecting ? 'running' : 'paused'; });
    });
    d.querySelectorAll('.marq-in, .names-in').forEach(function (m) { mio.observe(m); });
  }
})();
