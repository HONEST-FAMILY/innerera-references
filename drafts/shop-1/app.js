(() => {
  // 아직 없는 메뉴(#)는 눌러도 화면이 튀지 않게
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  // 첫 화면 배너 자동 넘김(오니스트처럼) — 동작 줄이기 설정이면 첫 장에 멈춤
  const slides = [...document.querySelectorAll('.hero .slide')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0;
  if (slides.length > 1 && !reduce) {
    setInterval(() => {
      slides[i].classList.remove('is-on');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-on');
    }, 5000);
  }

  // 가로 목록: 가운데 카드가 화면 가운데 오게 (원본처럼 양옆이 잘려 보임)
  const center = (track, card) => {
    if (!track || !card) return;
    track.scrollLeft = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
  };
  const place = () => {
    center(document.querySelector('.ing-track'), document.querySelectorAll('.ing')[2]);
    if (window.innerWidth <= 768) center(document.querySelector('.cards'), document.querySelector('.card.c2'));
  };
  window.addEventListener('load', place);

  // PC에서 원료 목록을 끌어서 넘기기
  const t = document.querySelector('.ing-track');
  if (t) {
    let down = false, x0 = 0, s0 = 0;
    t.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; x0 = e.clientX; s0 = t.scrollLeft; t.style.scrollSnapType = 'none'; });
    window.addEventListener('pointermove', (e) => { if (down) t.scrollLeft = s0 - (e.clientX - x0); });
    window.addEventListener('pointerup', () => { if (down) { down = false; t.style.scrollSnapType = ''; } });
  }
})();
