(function () {
  // 메뉴 자리 링크(href="#")는 화면이 튀지 않게
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  // 과학 패널: 원료 탭 (원본의 Renewal/Strength 탭 자리)
  var tabs = document.querySelectorAll('.tabs button');
  var panes = document.querySelectorAll('.pane');
  var figs = document.querySelectorAll('.fig');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      var i = b.getAttribute('data-i');
      tabs.forEach(function (t) { var on = t === b; t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
      panes.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-i') === i); });
      figs.forEach(function (f) { f.classList.toggle('on', f.getAttribute('data-i') === i); });
    });
  });

  // 바닥글: PC는 모두 펼침, 폰은 첫 칸만 펼친 아코디언 (원본 폰 바닥글 방식)
  var mq = window.matchMedia('(max-width: 760px)');
  function setFooter() {
    document.querySelectorAll('details.fc').forEach(function (d, i) {
      if (!mq.matches) d.open = true; else d.open = i === 0;
    });
  }
  setFooter();
  if (mq.addEventListener) mq.addEventListener('change', setFooter);
  document.querySelectorAll('details.fc summary').forEach(function (s) {
    s.addEventListener('click', function (e) { if (!mq.matches) e.preventDefault(); });
  });

  // 흐르는 띠: 동작 줄이기면 멈춤 (CSS에서 처리), 화면 밖이면 멈춤
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { en.target.style.animationPlayState = en.isIntersecting ? 'running' : 'paused'; });
    });
    document.querySelectorAll('.marq-in, .names-in').forEach(function (m) { io.observe(m); });
  }
})();
