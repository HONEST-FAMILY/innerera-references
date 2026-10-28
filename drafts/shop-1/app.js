(() => {
  const doc = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // 아직 없는 메뉴(#)는 눌러도 화면이 튀지 않게
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  // 1. 헤더 — 8px 넘게 내리면 흰 바탕 + 선 (+ PC는 64px)
  const gnb = $('#gnb');
  const onScroll = () => gnb.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. 왼쪽 서랍
  const drawer = $('#drawer');
  const scrim = $('.scrim');
  const openers = $$('[data-drawer-open]');
  let lastOpener = null;
  const focusables = () => $$('a[href], button:not([disabled])', drawer);
  const openDrawer = (from) => {
    lastOpener = from || $('.gnb-menu');
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('is-open');
    scrim.classList.add('is-on');
    openers.forEach((b) => b.setAttribute('aria-expanded', 'true'));
    doc.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const first = $('.dr-nav a', drawer);
    setTimeout(() => first && first.focus({ preventScroll: true }), reduce ? 0 : 60);
  };
  const closeDrawer = () => {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    scrim.classList.remove('is-on');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    openers.forEach((b) => b.setAttribute('aria-expanded', 'false'));
    doc.style.overflow = '';
    document.body.style.overflow = '';
    let back = lastOpener;
    if (!back || !back.offsetParent) back = $('.gnb-menu');
    if (back && back.offsetParent) back.focus({ preventScroll: true });
  };
  openers.forEach((b) => b.addEventListener('click', () => openDrawer(b)));
  $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (e) => {
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key === 'Tab') {
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  $$('.dr-nav a, .dr-prod', drawer).forEach((a) => a.addEventListener('click', () => {
    if ((a.getAttribute('href') || '').startsWith('#')) closeDrawer();
  }));
  window.__drawer = { open: openDrawer, close: closeDrawer };

  // 숫자 세기 — 0부터 1.2s, 원래 숫자로 끝
  const fmt = (n) => n.toLocaleString('en-US');
  const countUp = (el) => {
    const end = Number(el.dataset.count);
    if (reduce || !Number.isFinite(end)) { el.textContent = fmt(end); return; }
    if (!el.style.minWidth) {
      el.style.display = 'inline-block';
      el.style.minWidth = el.getBoundingClientRect().width + 'px';
    }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1200);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(end * e));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(end);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  };

  // 3. 첫 화면 배너 — 0.8s 크로스페이드, 6s 진행 막대가 끝나면 다음 장, 마우스 올리면 멈춤, 손가락으로 넘기기
  const hero = $('.hero');
  const slides = $$('.hero .slide');
  const bar = $('.h-bar');
  const num = $('.h-num b');
  let cur = 0;
  const restartBar = () => {
    if (!bar || reduce) return;
    bar.classList.remove('run');
    void bar.offsetWidth;
    bar.classList.add('run');
  };
  const show = (n) => {
    if (n === cur || slides.length < 2) return;
    const prev = slides[cur];
    cur = (n + slides.length) % slides.length;
    const next = slides[cur];
    slides.forEach((s) => { if (s !== prev) s.classList.remove('is-prev'); });
    prev.classList.remove('is-on');
    prev.classList.add('is-prev');
    next.classList.add('is-on');
    setTimeout(() => prev.classList.remove('is-prev'), reduce ? 0 : 820);
    if (num) num.textContent = String(cur + 1).padStart(2, '0');
    $$('[data-count]', next).forEach(countUp);
    restartBar();
  };
  if (slides.length > 1 && !reduce) {
    bar.addEventListener('animationend', () => show(cur + 1));
    restartBar();
    $$('[data-count]', slides[0]).forEach(countUp);
    let x0 = null, y0 = 0;
    hero.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; x0 = e.clientX; y0 = e.clientY; hero.classList.add('is-hold'); });
    const end = (e) => {
      hero.classList.remove('is-hold');
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
    };
    hero.addEventListener('pointerup', end);
    hero.addEventListener('pointercancel', () => { x0 = null; hero.classList.remove('is-hold'); });
  }

  // 4. 스크롤 등장 — 아래 24px에서 0.7s, 같은 줄 카드는 80ms 간격, 첫 화면은 0.4s 안에
  const rv = $$('.rv');
  const groups = new Map();
  rv.forEach((el) => {
    const p = el.parentElement;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  });
  groups.forEach((list) => {
    const same = list.filter((el) => el.matches('.card, .ing'));
    same.forEach((el, i) => el.style.setProperty('--d', (i * 80) + 'ms'));
  });
  const reveal = (el, fast) => {
    if (el.classList.contains('in')) return;
    if (fast) el.classList.add('fast');
    el.classList.add('in');
    if (!reduce) $$('[data-count]', el).forEach(countUp);
  };
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach((el) => el.classList.add('in'));
  } else {
    let alive = false;
    const io = new IntersectionObserver((entries) => {
      alive = true;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        reveal(en.target, false);
        io.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    // 가로로 넘기는 줄(원료·구성 카드)은 화면 밖 카드가 관찰에 안 잡히므로 줄 단위로 함께 등장
    const rowIo = new IntersectionObserver((entries) => {
      alive = true;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(':scope > .rv', en.target).forEach((el) => reveal(el, false));
        rowIo.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    const vh = window.innerHeight;
    const rows = new Set();
    rv.forEach((el) => {
      const row = el.parentElement.matches('.ing-track, .cards') ? el.parentElement : null;
      if (row) {
        if (row.getBoundingClientRect().top < vh) reveal(el, true);
        else rows.add(row);
        return;
      }
      if (el.getBoundingClientRect().top < vh) reveal(el, true);
      else io.observe(el);
    });
    rows.forEach((row) => rowIo.observe(row));
    // 안전장치: 관찰이 안 돌면 1.2s 뒤 전부 보이게
    setTimeout(() => { if (!alive) rv.forEach((el) => el.classList.add('in')); }, 1200);
  }

  // 5. 가로 목록: 가운데 카드가 화면 가운데 오게 (원본처럼 양옆이 잘려 보임)
  const center = (track, card) => {
    if (!track || !card || track.scrollWidth <= track.clientWidth) return;
    track.scrollLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
  };
  const place = () => {
    center($('.ing-track'), $$('.ing')[2]);
    if (window.innerWidth <= 768) center($('.cards'), $('.card.c2'));
  };
  window.addEventListener('load', place);

  // PC에서 원료 목록을 끌어서 넘기기
  const t = $('.ing-track');
  if (t) {
    let down = false, x0 = 0, s0 = 0;
    t.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = e.clientX; s0 = t.scrollLeft; t.style.scrollSnapType = 'none'; });
    window.addEventListener('pointermove', (e) => { if (down) t.scrollLeft = s0 - (e.clientX - x0); });
    window.addEventListener('pointerup', () => { if (down) { down = false; t.style.scrollSnapType = ''; } });
  }
})();
