// 연구 배경 패널 탭: Timeline 임상 패널처럼 탭을 누르면 해당 원료 막대만 크림슨으로 바뀐다.
(function () {
  var names = ['알파리포산', '글루타치온', '커큐민', '퀘르세틴', 'NMN'];
  var counts = ['7,399', '180,343', '28,845', '33,390', '1,548'];
  var root = document.getElementById('research');
  if (!root) return;
  var tabs = root.querySelectorAll('.tabs button');
  var bars = root.querySelectorAll('.bar');
  var stat = document.getElementById('stat');
  function pick(i) {
    for (var k = 0; k < tabs.length; k++) {
      var on = k === i;
      tabs[k].classList.toggle('on', on);
      tabs[k].setAttribute('aria-selected', on ? 'true' : 'false');
      bars[k].classList.toggle('on', on);
    }
    stat.innerHTML = '<b>' + names[i] + '</b>을 제목·초록에서 다룬 PubMed 논문은 <b>' + counts[i] + '편</b>입니다.';
  }
  for (var j = 0; j < tabs.length; j++) {
    tabs[j].addEventListener('click', function () { pick(+this.getAttribute('data-i')); });
  }
})();
