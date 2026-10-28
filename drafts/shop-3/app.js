(function () {
  // 아직 없는 메뉴(href="#")는 눌러도 화면이 튀지 않게
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  // 폰 바닥글: 메뉴 묶음 펼치기/접기 (원본의 아코디언)
  var heads = document.querySelectorAll('.ft-cols .col h4');
  heads.forEach(function (h) {
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    function toggle() {
      if (window.innerWidth > 767) return;
      h.parentNode.classList.toggle('open');
    }
    h.addEventListener('click', toggle);
    h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });

  // 가로 줄: PC에서 마우스로 끌어서 넘기기
  document.querySelectorAll('[data-rail]').forEach(function (rail) {
    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) moved = true;
      rail.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      down = false;
    });
    rail.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });
})();
