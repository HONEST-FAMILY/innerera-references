/* Inner:Era shop-4 — 바닐라 JS (외부 라이브러리 없음). transform·opacity·clip-path만 움직인다. */
(() => {
  const d = document, html = d.documentElement, body = d.body;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (RM) html.classList.add('rm');
  const $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => 1 - Math.pow(1 - t, 3);            // 감속
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // 가속→감속
  const fmt = n => Math.round(n).toLocaleString('ko-KR');

  /* 첫 화면 진입: 둥근 모서리 판이 화면 가득 펼쳐지고(1.4s) 사진이 1.14→1로 자리 잡고(2.8s) 제목이 줄 단위로 올라온다 */
  const enter = () => html.classList.add('is-in');
  if (RM) enter(); else requestAnimationFrame(() => setTimeout(enter, 60));

  /* 머리글: 8px 넘으면 불투명 + 64px */
  const hd = $('#hd');
  const onHeader = () => hd.classList.toggle('is-solid', scrollY > 8);

  /* 서랍 */
  const drawer = $('#drawer'), dim = $('#dim'), drawerBtns = $$('.js-drawer');
  let lastFocus = null;
  const openDrawer = (btn) => {
    lastFocus = btn || drawerBtns[0];
    dim.hidden = false; requestAnimationFrame(() => dim.classList.add('on'));
    drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false');
    drawerBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    body.classList.add('lock');
    setTimeout(() => { const f = $('.drawer__nav a', drawer); f && f.focus({ preventScroll: true }); }, RM ? 0 : 120);
  };
  const closeDrawer = () => {
    if (!drawer.classList.contains('on')) return;
    drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true');
    dim.classList.remove('on'); setTimeout(() => { if (!dim.classList.contains('on')) dim.hidden = true; }, RM ? 0 : 360);
    drawerBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    body.classList.remove('lock');
    const isMobile = innerWidth <= 1024;
    const back = lastFocus && lastFocus.offsetParent ? lastFocus : (isMobile ? drawerBtns[1] : drawerBtns[0]);
    back && back.focus({ preventScroll: true });
  };
  drawerBtns.forEach(b => b.addEventListener('click', () => openDrawer(b)));
  $('.js-close', drawer).addEventListener('click', closeDrawer);
  dim.addEventListener('click', closeDrawer);
  $$('.drawer__nav a').forEach(a => a.addEventListener('click', closeDrawer));
  $$('.js-nop').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  $$('.hd__r a[href="#"], .drawer__auth a, .ft__nav a, .drawer__nav a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  /* 구매 칸: 상품 사진이 카드에서 구매 칸 썸네일로 날아가 자리 잡는다(FLIP, 0.65s) */
  const buy = $('#buy'), sdim = $('#sdim'), thumb = $('.buy__thumb'), thumbImg = $('.buy__thumb img');
  const PRICE = 49000; let qty = 1, buyFrom = null;
  const setQty = q => { qty = clamp(q, 1, 9); $('#qv').textContent = qty; $('#qt').textContent = fmt(PRICE * qty); };
  const openBuy = (btn) => {
    buyFrom = btn;
    const src = $('.pcard__img .a');
    const r1 = src.getBoundingClientRect();
    buy.classList.add('notrans', 'on'); const r2 = thumbImg.getBoundingClientRect(); buy.classList.remove('on'); void buy.offsetWidth; buy.classList.remove('notrans');
    sdim.hidden = false; requestAnimationFrame(() => sdim.classList.add('on'));
    buy.classList.add('on'); buy.setAttribute('aria-hidden', 'false'); body.classList.add('lock');
    if (!RM && r1.width && r1.top < innerHeight && r1.bottom > 0) {
      thumb.classList.add('hide');
      const fly = src.cloneNode(); fly.className = 'fly'; fly.removeAttribute('loading'); fly.alt = '';
      Object.assign(fly.style, { left: r1.left + 'px', top: r1.top + 'px', width: r1.width + 'px', height: r1.height + 'px' });
      body.appendChild(fly);
      const s = r2.height / r1.height;
      const a = fly.animate([
        { transform: 'translate(0,0) scale(1)' },
        { transform: `translate(${r2.left - r1.left}px, ${r2.top - r1.top}px) scale(${s})` }
      ], { duration: 650, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
      a.onfinish = () => { thumb.classList.remove('hide'); fly.remove(); };
    }
    setTimeout(() => $('.js-buy-close').focus({ preventScroll: true }), RM ? 0 : 300);
  };
  const closeBuy = () => {
    if (!buy.classList.contains('on')) return;
    buy.classList.remove('on'); buy.setAttribute('aria-hidden', 'true'); sdim.classList.remove('on'); body.classList.remove('lock');
    setTimeout(() => { if (!sdim.classList.contains('on')) sdim.hidden = true; }, RM ? 0 : 600);
    buyFrom && buyFrom.focus({ preventScroll: true });
  };
  $$('.js-buy').forEach(b => b.addEventListener('click', () => openBuy(b)));
  $('.js-buy-close').addEventListener('click', closeBuy);
  sdim.addEventListener('click', closeBuy);
  $('.js-qm').addEventListener('click', () => setQty(qty - 1));
  $('.js-qp').addEventListener('click', () => setQty(qty + 1));
  $('.js-add').addEventListener('click', () => { const n = $('#cartN'); n.hidden = false; n.textContent = (+n.textContent || 0) + qty; closeBuy(); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeBuy(); } });

  /* 숫자 세기 (화면에 들어오면 0부터 1.2s) */
  const countUp = (el, dur = 1200) => {
    const to = +el.dataset.count; if (RM || !to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = now => { const t = clamp((now - t0) / dur); el.textContent = fmt(to * ease(t)); if (t < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  };

  /* 스크롤 등장 */
  const rvs = $$('.rv');
  const counters = $$('.facts [data-count]');
  if (RM) { rvs.forEach(el => el.classList.add('in')); }
  else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains('rv'));
      const i = Math.max(0, sibs.indexOf(el));
      el.style.transitionDelay = (i * 80) + 'ms';
      el.classList.add('in'); io.unobserve(el);
      el.querySelectorAll('[data-count]').forEach(c => countUp(c));
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(el => io.observe(el));
    // 안전장치: 관찰이 실패해도 지나간 덩어리는 1.2s 뒤 보이게
    setTimeout(() => rvs.forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in'); }), 1200);
  }

  /* ---------- 스크롤 연동 장면 ---------- */
  const scenes = $$('[data-scene]').map(el => ({ el, type: el.dataset.scene, top: 0, h: 0, cur: -1 }));
  let vh = innerHeight, pinTop = 64, pinH = 0;

  // 2. 제품: 스틱이 상자 뒤에서 나와(0.05~0.42) 상자 앞으로 들어서고(0.42~0.62), 궤도 고리가 가는 선으로 그려진다(0.12~0.7)
  const P = { stick: $('.p-stick'), box: $('.p-box'), orbit: $('.orbit'), facts: $$('.pf'), nums: $$('.pf [data-scroll-num]') };
  const product = (s, p) => {
    const W = P.box.offsetWidth, H = P.box.offsetHeight;
    const a = eio(seg(p, .05, .42)), b = eio(seg(p, .42, .62));
    const x = W * (.8 * a - .24 * b), y = H * (.06 - .1 * a + .02 * b);
    const st = P.stick.style;
    st.setProperty('--sx', x.toFixed(1) + 'px'); st.setProperty('--sy', y.toFixed(1) + 'px');
    st.setProperty('--ss', (1 + .05 * b).toFixed(3)); st.setProperty('--sz', p > .42 ? 3 : 0);
    const os = P.orbit.style;
    os.setProperty('--o', (1 - eio(seg(p, .12, .6))).toFixed(4));
    os.setProperty('--o2', (1 - eio(seg(p, .24, .72))).toFixed(4));
    os.setProperty('--od', seg(p, .62, .72).toFixed(3));
    P.facts.forEach((f, i) => f.classList.toggle('on', p > .58 + i * .1));
    P.nums.forEach((n, i) => { const to = +n.dataset.scrollNum; n.textContent = Math.round(to * ease(seg(p, .58 + i * .1, .7 + i * .1))); });
  };

  // 3. 원료: 진행률을 5칸으로 나눠 한 칸씩 넘어감. 칸 안에서는 분자가 천천히 위로 흐름
  const I = { items: $$('.ingi'), bar: $$('.ing__bar li') };
  const ing = (s, p) => {
    const n = I.items.length, idx = Math.min(n - 1, Math.floor(p * n));
    const local = clamp(p * n - idx);
    if (idx !== s.cur) {
      I.items.forEach((it, i) => { it.classList.toggle('is-on', i === idx); it.classList.toggle('is-off', i !== idx && i < idx); if (i > idx) it.classList.remove('is-off'); });
      I.bar.forEach((b, i) => b.classList.toggle('on', i === idx));
      const c = I.items[idx].querySelector('[data-count]'); if (c && s.cur !== -1) countUp(c, 900);
      s.cur = idx;
    }
    I.bar.forEach((b, i) => b.firstElementChild.style.setProperty('--f', i < idx ? 1 : i === idx ? local.toFixed(3) : 0));
    const img = I.items[idx].querySelector('.ingi__mol img');
    img.style.setProperty('--my', ((.5 - local) * 36).toFixed(1) + 'px');
  };

  // 4. 다섯 통 → 한 포: 분자 다섯 개가 차례로 스틱 쪽으로 빨려 들어가며 숫자가 5→1로 줄어든다
  const C = { ms: $$('.conv__m'), stick: $('.conv__stick'), stage: $('.conv__stage'), n: $('.conv__n'), cap: $('.conv__cap'), chips: $$('.conv__chips li') };
  const POS = [[-.42, -.32], [.4, -.26], [-.46, .04], [.42, .18], [-.34, .34]];
  let convN = -1;
  const conv = (s, p) => {
    const k0 = innerWidth < 768 ? .78 : innerWidth <= 1024 ? .82 : 1, w = C.stage.offsetWidth * k0, h = C.stage.offsetHeight * k0;
    let got = 0;
    C.ms.forEach((m, k) => {
      const t = eio(seg(p, .1 + k * .12, .3 + k * .12));
      const ms = m.style;
      ms.setProperty('--mx', (POS[k][0] * w * (1 - t)).toFixed(1) + 'px');
      ms.setProperty('--mY', (POS[k][1] * h * (1 - t)).toFixed(1) + 'px');
      ms.setProperty('--msc', (1 - .82 * t).toFixed(3));
      ms.setProperty('--mo', (1 - seg(t, .55, 1)).toFixed(3));
      if (t > .98) got++;
      C.chips[k] && C.chips[k].classList.toggle('got', t > .98);
    });
    C.stick.style.setProperty('--cy', ((1 - ease(seg(p, 0, .85))) * h * .06).toFixed(1) + 'px');
    C.stick.style.setProperty('--cs', (.92 + .08 * ease(seg(p, 0, .85))).toFixed(3));
    const nn = Math.max(1, 5 - got);
    if (nn !== convN) {
      C.n.textContent = nn; C.cap.textContent = nn === 1 ? '하루 한 포' : '따로 챙기던 원료';
      if (convN !== -1) { C.n.classList.remove('tick'); void C.n.offsetWidth; C.n.classList.add('tick'); }
      convN = nn;
    }
  };

  // 1. 첫 화면: 내려가면 사진이 1→1.08로 커지고 어두워지며 글이 위로 빠진다(다음 판이 덮는 동안)
  const heroEl = $('.hero'), heroImg = $('.hero__img'), heroDrip = $('.hero__scroll span');
  const hero = (s, p) => {
    heroImg.style.setProperty('--hz', (1 + .08 * p).toFixed(4));
    heroEl.style.setProperty('--hv', (.6 * p).toFixed(3));
    heroEl.style.setProperty('--hy', (-60 * p).toFixed(1) + 'px');
    heroEl.style.setProperty('--ho', (1 - clamp(p * 1.4)).toFixed(3));
    if (heroDrip) heroDrip.style.animationPlayState = p > .5 || d.hidden ? 'paused' : 'running';
  };

  // 6. 리추얼 사진: 화면에 들어오며 테두리 안쪽에서 바깥으로 열리고(clip-path 8%→0) 사진이 1.16→1로 자리 잡음
  const ritualFrame = $('.ritual__frame');
  const ritual = (s, p) => {
    const e = ease(seg(p, .05, .55));
    ritualFrame.style.setProperty('--rc', ((1 - e) * 8).toFixed(2) + '%');
    ritualFrame.style.setProperty('--rs', (1.16 - .16 * e).toFixed(4));
  };

  const U = { product, ing, conv, hero, ritual };
  const measure = () => {
    vh = innerHeight;
    const cs = getComputedStyle(html);
    pinTop = hd.classList.contains('is-solid') ? hd.offsetHeight : parseFloat(cs.getPropertyValue('--hs')) || 64;
    pinTop = parseFloat(cs.getPropertyValue('--hs')) || 64;
    const tb = $('.tb'); const tbH = tb && getComputedStyle(tb).display !== 'none' ? tb.offsetHeight : 0;
    pinH = vh - pinTop - tbH;
    scenes.forEach(s => { const r = s.el.getBoundingClientRect(); s.top = r.top + scrollY; s.h = s.el.offsetHeight; });
  };
  let ticking = false;
  const frame = () => {
    ticking = false;
    onHeader();
    if (RM) return;
    const y = scrollY;
    for (const s of scenes) {
      if (y + vh < s.top - 100 || y > s.top + s.h + 100) continue;
      let p;
      if (s.type === 'hero') p = clamp(y / vh);
      else if (s.type === 'ritual') p = clamp((y + vh - s.top) / (vh + s.h));
      else p = clamp((y + pinTop - s.top) / Math.max(1, s.h - pinH));
      U[s.type](s, p);
    }
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', () => { measure(); req(); });
  addEventListener('load', () => { measure(); req(); });
  measure();
  if (RM) {
    // 정지 상태 = 마지막 장면
    product(null, 1); conv(null, 1);
    ritualFrame.style.setProperty('--rc', '0%'); ritualFrame.style.setProperty('--rs', '1');
    I.items.forEach(it => it.classList.add('is-on'));
    onHeader();
  } else {
    // 초기값: 원료 1번 켜기, 숫자 장면은 5에서 시작
    ing({ cur: -1 }, 0); C.n.textContent = '5'; C.cap.textContent = '따로 챙기던 원료';
    frame();
  }
  // 화면 밖 지속 움직임 멈춤: 탭이 숨으면 스크롤 표시 애니메이션 정지
  d.addEventListener('visibilitychange', () => { const s = $('.hero__scroll span'); if (s) s.style.animationPlayState = d.hidden ? 'paused' : 'running'; });
})();
