(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const eo3 = t => 1 - Math.pow(1 - t, 3);
  const eo4 = t => 1 - Math.pow(1 - t, 4);
  const ei3 = t => t * t * t;
  const eio = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const spring = t => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const z = .6, w = 2 * Math.PI * 1.9, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  };
  const springFrames = (from, to, n = 24) => [...Array(n + 1).keys()].map(k => ({ transform: `scale(${(from + (to - from) * spring(k / n)).toFixed(4)})` }));
  const put = (el, prop, v) => { if (!el) return; const k = '_' + prop; if (el[k] !== v) { el[k] = v; el.style[prop] = v; } };
  const fmt = n => Math.round(n).toLocaleString('ko-KR');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IMG = '../../assets/photos/d/';
  const OUT = 'cubic-bezier(.16,1,.3,1)';

  const ING = [
    { k: 'ala', ko: '알파리포산', en: 'Alpha-Lipoic Acid', desc: '황 원자 2개가 고리를 이룬<br>지방산입니다.', f: 'C<sub>8</sub>H<sub>14</sub>O<sub>2</sub>S<sub>2</sub>', w: '206.3', pm: 7399, src: '시금치·브로콜리 등에 미량', img: 'd3_spinach.jpg', alt: '시금치 잎' },
    { k: 'glutathione', ko: '글루타치온', en: 'Glutathione', desc: '아미노산 3가지가 이어진<br>트리펩타이드입니다.', f: 'C<sub>10</sub>H<sub>17</sub>N<sub>3</sub>O<sub>6</sub>S', w: '307.33', pm: 180343, src: '효모 등에서 얻음', img: 'd3_yeast.jpg', alt: '효모 거품' },
    { k: 'curcumin', ko: '커큐민', en: 'Curcumin', desc: '강황 뿌리줄기의<br>노란 색소 성분입니다.', f: 'C<sub>21</sub>H<sub>20</sub>O<sub>6</sub>', w: '368.4', pm: 28845, src: '강황 뿌리줄기', img: 'd3_turmeric.jpg', alt: '강황 가루' },
    { k: 'quercetin', ko: '퀘르세틴', en: 'Quercetin', desc: '양파 껍질·사과·케이퍼 등에<br>있는 플라보놀입니다.', f: 'C<sub>15</sub>H<sub>10</sub>O<sub>7</sub>', w: '302.23', pm: 33390, src: '양파 껍질·사과·케이퍼', img: 'd3_onion.jpg', alt: '자른 적양파' },
    { k: 'nmn', ko: 'NMN', en: 'Nicotinamide Mononucleotide', desc: 'NAD+의 전구체로 연구되는<br>뉴클레오타이드입니다.', f: 'C<sub>11</sub>H<sub>15</sub>N<sub>2</sub>O<sub>8</sub>P', w: '334.22', pm: 1548, src: '브로콜리·에다마메·아보카도 등에 미량', img: 'd3_broccoli.jpg', alt: '브로콜리' },
  ];
  const sprite = k => `url(img/spin_${k}.webp)`;
  ING.forEach(i => { const im = new Image(); im.src = `img/spin_${i.k}.webp`; });

  const film = $('#film'), inside = $('#inside'), pour = $('#pour'), buy = $('#buy'), end = $('#end');
  const hd = $('#hd');
  const letters = $$('.wm__l'), colon = $('#colon'), dotT = $('.wm__d--t'), dotB = $('#dotB');
  const cap = $('.wm__cap > span'), orb = $('#orb'), orbImg = $('#orbImg'), hint = $('#hint'), openCopy = $('#openCopy');

  const rollBuild = (el, items) => { el.classList.add('roll'); el.innerHTML = items.map(h => `<span>${h}</span>`).join(''); return [...el.children]; };
  const rolls = [rollBuild($('#nameRoll'), ING.map(i => i.ko)), rollBuild($('#enRoll'), ING.map(i => i.en)), rollBuild($('#descRoll'), ING.map(i => i.desc)),
    rollBuild($('#dF'), ING.map(i => i.f)), rollBuild($('#dW'), ING.map(i => i.w)), rollBuild($('#dS'), ING.map(i => i.src))];
  rolls.forEach((spans, g) => spans.forEach(s => (s.style.transitionDelay = (g * .045).toFixed(3) + 's')));
  const iris = $('#iris');
  iris.innerHTML = ING.map(i => `<img src="${IMG + i.img}" alt="${i.alt}">`).join('');
  const irisImgs = [...iris.children];
  const spr = $('#spr'), dP = $('#dP'), inCur = $('#inCur'), ticks = $$('#ticks li');

  const flood = $('#flood'), pourCopy = $('.pour__copy'), pourCount = $('.pour__count');
  const cnt = $('#cnt'), cntU = $('#cntU'), stick = $('#stick'), chips = $$('#chips li'), row = $('#pourRow');
  row.innerHTML = ING.map(i => `<div class="bead"><i style="background-image:${sprite(i.k)}"></i><b>${i.ko}</b></div>`).join('');
  const beads = $$('.bead', row);

  const endWm = $('#endWm');
  endWm.innerHTML = 'Inner'.split('').map(c => `<span>${c}</span>`).join('') + '<span class="c">:</span>' + 'Era'.split('').map(c => `<span>${c}</span>`).join('');
  const endL = $$('span', endWm);

  let vw = innerWidth, vh = innerHeight, mobile = vw <= 1024, G = {};
  const measure = () => {
    vw = innerWidth; vh = innerHeight; mobile = vw <= 1024;
    const reset = el => { el.style.transform = 'none'; el._transform = undefined; };
    letters.forEach(reset); reset(dotT); reset(stick);
    const st = film.querySelector('.stage').getBoundingClientRect();
    const cb = colon.getBoundingClientRect();
    const db = dotB.getBoundingClientRect();
    G.colonX = cb.left + cb.width / 2;
    G.lx = letters.map(l => { const r = l.getBoundingClientRect(); return r.left + r.width / 2; });
    G.dot = { x: db.left + db.width / 2 - st.left, y: db.top + db.height / 2 - st.top, d: db.width };
    G.dotDrop = db.top - dotT.getBoundingClientRect().top;
    const hdH = mobile ? 56 : 64, tabH = mobile ? 58 : 0;
    G.D = mobile ? Math.min(vw * .72, vh * .40) : Math.min(vh * .56, 540);
    G.mid = { x: vw / 2, y: mobile ? vh * .40 : vh * .5 };
    if (mobile) {
      const copyH = (openCopy.offsetHeight || 240) + 30 + tabH;
      const top = hdH + 14, bottom = vh - copyH - 22;
      let H = Math.max(180, bottom - top), W = H * 811 / 1440;
      if (W > vw - 44) { W = vw - 44; H = W * 1440 / 811; }
      G.card = { w: W, h: H, x: vw / 2, y: top + H / 2 };
    } else {
      const H = Math.min(vh * .80, 800), W = H * 811 / 1440;
      const left = Math.max(32, (vw - 1376) / 2);
      G.card = { w: W, h: H, x: Math.min(vw - left - W / 2 - vw * .04, vw * .7), y: hdH / 2 + vh / 2 };
    }
    const sr = stick.getBoundingClientRect(), ps = pour.querySelector('.stage').getBoundingClientRect();
    G.stickTop = { x: sr.left - ps.left + sr.width / 2, y: sr.top - ps.top + sr.height * .08 };
    G.rowY = mobile ? vh * .35 : vh * .5;
    const n = ING.length, gap = mobile ? Math.min(74, (vw - 44) / n) : Math.min(140, vw * .085);
    G.beadX = ING.map((_, k) => (mobile ? vw / 2 : vw * .42) - gap * (n - 1) / 2 + k * gap);
    G.top = { film: film.offsetTop, inside: inside.offsetTop, pour: pour.offsetTop, buy: buy.offsetTop, end: end.offsetTop };
    G.len = { film: film.offsetHeight - vh, inside: inside.offsetHeight - vh, pour: pour.offsetHeight - vh };
  };
  const prog = (y, name) => clamp((y - G.top[name]) / Math.max(1, G.len[name]));

  const sceneOpen = p => {
    const eA = eio(seg(p, .02, .20));
    letters.forEach((l, i) => {
      put(l, 'transform', `translateX(${((G.colonX - G.lx[i]) * eA).toFixed(1)}px) scaleX(${Math.max(.001, 1 - eA).toFixed(3)})`);
      put(l, 'visibility', eA > .9 ? 'hidden' : 'visible');
    });
    put(cap, 'transform', `translateY(${(105 * eo3(seg(p, 0, .12))).toFixed(1)}%)`);
    put(hint, 'opacity', String(1 - seg(p, 0, .05)));
    put(dotT, 'transform', `translateY(${(G.dotDrop * eo3(seg(p, .10, .17))).toFixed(1)}px)`);
    const showOrb = p > .155;
    put(colon, 'opacity', showOrb ? '0' : '1');
    put(orb, 'opacity', showOrb ? '1' : '0');
    const eB = eo4(seg(p, .16, .34)), eD = eio(seg(p, .50, .76));
    const d0 = lerp(G.dot.d, G.D, eB);
    const w = lerp(d0, G.card.w, eD), h = lerp(d0, G.card.h, eD);
    const cx = lerp(lerp(G.dot.x, G.mid.x, eB), G.card.x, eD);
    const cy = lerp(lerp(G.dot.y, G.mid.y, eB), G.card.y, eD);
    put(orb, 'width', w.toFixed(1) + 'px');
    put(orb, 'height', h.toFixed(1) + 'px');
    put(orb, 'borderRadius', lerp(d0 / 2, mobile ? 22 : 28, eD).toFixed(1) + 'px');
    put(orb, 'transform', `translate(${(cx - w / 2).toFixed(1)}px,${(cy - h / 2).toFixed(1)}px)`);
    put(orbImg, 'clipPath', `circle(${(72 * eo3(seg(p, .30, .52))).toFixed(2)}% at 50% 50%)`);
    put(orbImg, 'transform', `scale(${lerp(1.3, 1, eo3(seg(p, .30, .66))).toFixed(4)})`);
    if (p >= .6 && !openCopy.classList.contains('in')) openCopy.classList.add('in');
    else if (p < .52 && openCopy.classList.contains('in')) openCopy.classList.remove('in');
  };

  let idx = -1, countRaf = 0;
  const countTo = (el, to, dur) => {
    cancelAnimationFrame(countRaf);
    if (RM) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = now => { const k = eo3(clamp((now - t0) / dur)); el.textContent = fmt(to * k); if (k < 1) countRaf = requestAnimationFrame(step); };
    countRaf = requestAnimationFrame(step);
  };
  const setIndex = (i, prev) => {
    rolls.forEach(spans => spans.forEach((s, j) => { s.classList.toggle('is-on', j === i); s.classList.toggle('is-up', j < i); }));
    inCur.textContent = String(i + 1).padStart(2, '0');
    irisImgs.forEach((im, j) => { im.classList.toggle('is-on', j === i); im.classList.toggle('was', j === prev && j !== i); });
    countTo(dP, ING[i].pm, 1200);
    if (prev < 0 || RM) { spr.style.backgroundImage = sprite(ING[i].k); return; }
    spr.getAnimations().forEach(a => a.cancel());
    const out = spr.animate([{ transform: 'scale(1)' }, { transform: 'scale(.001)' }], { duration: 170, easing: 'cubic-bezier(.5,0,.9,.4)', fill: 'forwards' });
    out.onfinish = () => {
      spr.style.backgroundImage = sprite(ING[i].k);
      out.cancel();
      spr.animate(springFrames(.001, 1), { duration: 760, easing: 'linear' });
    };
  };
  const sceneInside = p => {
    const n = ING.length, x = Math.min(n - 1e-4, p * n), i = Math.floor(x), t = x - i;
    if (i !== idx) { const prev = idx; idx = i; setIndex(i, prev); }
    ticks.forEach((li, j) => li.style.setProperty('--f', j < i ? 1 : j === i ? seg(t, 0, 1).toFixed(3) : 0));
    const fr = Math.round(lerp(0, 29, seg(t, .04, 1)));
    put(spr, 'backgroundPosition', `${((fr % 6) / 5 * 100).toFixed(2)}% ${(Math.floor(fr / 6) / 4 * 100).toFixed(2)}%`);
  };

  const arrivals = ING.map((_, k) => .40 + k * .085 + .11);
  let pourStep = -1;
  const rollDigit = (el, txt) => {
    const cur = el.lastElementChild;
    if (cur && cur.textContent === txt) return;
    [...el.children].forEach(c => { if (c !== cur) c.remove(); });
    const nx = document.createElement('span'); nx.textContent = txt;
    if (!cur || RM) { el.innerHTML = ''; el.appendChild(nx); return; }
    cur.getAnimations().forEach(a => a.cancel());
    el.appendChild(nx);
    nx.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 650, easing: OUT });
    const a = cur.animate([{ transform: 'none' }, { transform: 'translateY(-105%)' }], { duration: 650, easing: OUT, fill: 'forwards' });
    a.onfinish = () => cur.remove();
  };
  const scenePour = p => {
    const fe = eio(clamp((cur - (G.top.pour - vh * .85)) / (vh * .95)));
    put(flood, 'clipPath', `circle(${(110 * fe).toFixed(2)}% at 50% ${mobile ? 44 : 50}%)`);
    pourCopy.classList.toggle('in', fe > .72);
    pourCount.classList.toggle('in', p >= .08);
    const rise = eo4(seg(p, .06, .26));
    let bounce = 0;
    arrivals.forEach(a => { const d = p - a; if (d > 0 && d < .08) bounce += .045 * Math.exp(-d * 55) * Math.sin(d * 120); });
    put(stick, 'transform', `translateY(${((1 - rise) * 118).toFixed(2)}%) scaleY(${(1 - bounce).toFixed(4)}) scaleX(${(1 + bounce * .5).toFixed(4)})`);
    const st = G.stickTop;
    beads.forEach((b, k) => {
      const pop = spring(seg(p, .08 + k * .025, .27 + k * .025));
      const a0 = .40 + k * .085, f = eio(seg(p, a0, a0 + .11));
      const sx = G.beadX[k], sy = G.rowY, cx = lerp(sx, st.x, .5), cy = Math.min(sy, st.y) - (mobile ? 90 : 160);
      const x = (1 - f) * (1 - f) * sx + 2 * (1 - f) * f * cx + f * f * st.x;
      const y = (1 - f) * (1 - f) * sy + 2 * (1 - f) * f * cy + f * f * st.y;
      const s = f >= 1 ? 0 : pop * lerp(1, .18, ei3(f));
      put(b, 'transform', `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${Math.max(.001, s).toFixed(4)})`);
      put(b.lastElementChild, 'opacity', f > .05 ? '0' : '1');
      if (chips[k]) chips[k].classList.toggle('in', p >= arrivals[k] - .005);
    });
    let step = 0;
    arrivals.forEach(a => { if (p >= a - .005) step++; });
    if (step !== pourStep) {
      pourStep = step;
      rollDigit(cnt, String(Math.max(1, 5 - step)));
      rollDigit(cntU, step >= 5 ? '포' : '통');
    }
  };

  const buyMedia = $('#buyMedia'), buyStick = $('#buyStick'), buyBox = $('.buy__box');
  let mx = 0, my = 0, smx = 0, smy = 0;
  const sceneBuy = y => {
    const q = clamp((y + vh - G.top.buy) / (vh + buy.offsetHeight));
    smx += (mx - smx) * .08; smy += (my - smy) * .08;
    put(buyStick, 'transform', `translate(${(smx * -10).toFixed(2)}px,${(lerp(36, -24, q) + smy * -8).toFixed(2)}px)`);
    put(buyBox, 'transform', `translate(${(smx * -4).toFixed(2)}px,${(lerp(14, -8, q) + smy * -3).toFixed(2)}px)`);
  };

  const sceneEnd = y => {
    const q = clamp((y + vh - G.top.end - 80) / (vh * .55)), ci = 5;
    endL.forEach((s, i) => {
      if (i === ci) { put(s, 'transform', `scale(${Math.max(.001, spring(seg(q, 0, .45))).toFixed(4)})`); return; }
      const dist = Math.abs(i - ci), k = spring(seg(q, .12 + dist * .05, .62 + dist * .05));
      put(s, 'transform', `translateX(${((ci - i) * .55 * (1 - k)).toFixed(3)}em) scaleX(${Math.max(.001, k).toFixed(4)})`);
    });
  };

  let cur = scrollY, last = performance.now(), raf = 0;
  const frame = now => {
    const dt = Math.min(64, now - last); last = now;
    const target = scrollY;
    cur += (target - cur) * (1 - Math.pow(1 - .16, dt / 16.67));
    if (Math.abs(target - cur) < .4) cur = target;
    sceneOpen(prog(cur, 'film'));
    sceneInside(prog(cur, 'inside'));
    scenePour(prog(cur, 'pour'));
    sceneBuy(cur);
    sceneEnd(cur);
    const pp = prog(target, 'pour');
    hd.classList.toggle('is-dark', target >= G.top.pour && pp > .07 && target < G.top.pour + G.len.pour + vh * .5);
    hd.classList.toggle('is-solid', target > G.len.film * .45);
    raf = requestAnimationFrame(frame);
  };

  const staticRender = () => {
    sceneOpen(.92);
    openCopy.classList.add('in');
    idx = 0; setIndex(0, -1);
    spr.style.backgroundPosition = '60% 50%';
    ticks.forEach((li, j) => {
      li.style.setProperty('--f', j === 0 ? 1 : 0);
      li.setAttribute('role', 'button'); li.tabIndex = 0; li.setAttribute('aria-label', ING[j].ko);
      const go = () => { setIndex(j, idx); idx = j; ticks.forEach((t2, m) => t2.style.setProperty('--f', m === j ? 1 : 0)); };
      li.addEventListener('click', go);
      li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    scenePour(1);
    put(flood, 'clipPath', 'none');
    endL.forEach(s => { s.style.transform = 'none'; s._transform = 'none'; });
    hd.classList.add('is-solid');
  };

  const init = () => {
    measure();
    if (RM) { staticRender(); return; }
    letters.forEach((l, i) => l.animate([{ transform: 'translateY(40%)', clipPath: 'inset(0 0 100% 0)' }, { transform: 'none', clipPath: 'inset(0 0 0% 0)' }], { duration: 1100, delay: 120 + i * 45, easing: OUT, fill: 'backwards' }));
    [dotT, dotB].forEach((d, i) => d.animate(springFrames(.001, 1), { duration: 900, delay: 520 + i * 90, easing: 'linear', fill: 'backwards', composite: 'add' }));
    cap.parentElement.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 900, delay: 700, easing: OUT, fill: 'backwards' });
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  };
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { measure(); if (RM) staticRender(); }, 120); });
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init);

  if (!RM) addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = buyMedia.getBoundingClientRect();
    mx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1); my = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
  }, { passive: true });

  const priceEl = $('#price');
  const renderPrice = (val, animate) => {
    const s = fmt(val);
    if (!animate || (priceEl.dataset.v || '').length !== s.length) {
      priceEl.innerHTML = s.split('').map(ch => /\d/.test(ch) ? `<span class="dg"><span>${[...Array(10).keys()].map(d => `<i>${d}</i>`).join('')}</span></span>` : `<span>${ch}</span>`).join('');
    }
    const digits = s.replace(/,/g, '');
    $$('.dg', priceEl).forEach((dg, i) => {
      const inner = dg.firstElementChild;
      if (!animate) inner.style.transition = 'none';
      inner.style.transform = `translateY(${-(+digits[i]) * 10}%)`;
      if (!animate) { inner.offsetHeight; inner.style.transition = ''; }
    });
    priceEl.dataset.v = s;
    priceEl.setAttribute('aria-label', s + '원');
  };
  renderPrice(49000, false);
  $$('.opt').forEach(o => o.addEventListener('click', () => {
    $$('.opt').forEach(x => { x.classList.toggle('is-on', x === o); x.setAttribute('aria-checked', x === o ? 'true' : 'false'); });
    renderPrice(+o.dataset.price, !RM);
  }));

  const cta = $('#cta'), bagN = $('#bagN');
  let bag = 0, ctaT;
  cta.addEventListener('click', () => {
    bag += +($('.opt.is-on')?.dataset.n || 1);
    bagN.textContent = String(bag);
    bagN.classList.add('is-on');
    if (!RM) bagN.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    cta.classList.add('is-done');
    clearTimeout(ctaT);
    ctaT = setTimeout(() => cta.classList.remove('is-done'), 2200);
  });

  $$('[data-noop]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2 || a.hasAttribute('data-noop') || a.hasAttribute('data-drawer')) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); closeDrawer();
    let y = t.getBoundingClientRect().top + scrollY;
    if (id === '#pour') y += (pour.offsetHeight - vh) * .9;
    if (id === '#film' || id === '#top') y = 0;
    scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
  }));

  const drawer = $('#drawer'), scrim = $('#scrim'), burger = $('#burger');
  let lastFocus = null;
  const openDrawer = () => {
    lastFocus = document.activeElement;
    scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('is-on'));
    drawer.classList.add('is-on'); drawer.setAttribute('aria-hidden', 'false'); burger.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => $('.drawer__nav a', drawer)?.focus(), 60);
  };
  function closeDrawer() {
    if (!drawer.classList.contains('is-on')) return;
    drawer.classList.remove('is-on'); drawer.setAttribute('aria-hidden', 'true'); burger.setAttribute('aria-expanded', 'false');
    scrim.classList.remove('is-on'); setTimeout(() => (scrim.hidden = true), 350);
    document.documentElement.style.overflow = '';
    (lastFocus && lastFocus.focus) ? lastFocus.focus() : burger.focus();
  }
  burger.addEventListener('click', openDrawer);
  $$('[data-drawer]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openDrawer(); }));
  $('#drawerX').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
})();
