import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, OrderBadge, Chips, Input, Select, Overlay, Modal, Confirm,
    BottomSheet, Toast, Empty, ProductRow, Pager, Note, Text, Icon, Flex, KV, Radio, SHOP,
} from '../lib/blocks.js';

const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const STYLE = `<style>
.u14-card{border:1px solid var(--line);border-radius:6px;margin-bottom:16px;background:#fff}
.u14-ch{display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:1px solid var(--line2);font-size:13.5px;background:var(--box);border-radius:6px 6px 0 0}
.u14-ch .sp{flex:1}
.u14-ch span{color:var(--mute)}
.u14-ch u{display:inline-flex;align-items:center;white-space:nowrap}
.u14-it{display:flex;gap:20px;padding:16px;border-top:1px solid var(--line2)}
.u14-ch + .u14-it{border-top:0}
.u14-main{flex:1;min-width:0}
.u14-st{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;font-size:13.5px}
.u14-st .wf-badge{flex:none;margin-top:1px}
.u14-st p{margin:0;line-height:1.6;color:var(--ink2)}
.u14-bt{width:136px;flex:none;display:flex;flex-direction:column;gap:6px}
.u14-bt .wf-btn{width:100%}
.u14-bt small{font-size:11.5px;color:var(--mute);line-height:1.5;text-align:center}
.u14-acct{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 12px;padding:10px 12px;border:1px dashed var(--line);border-radius:4px;font-size:13px;background:var(--box)}
.u14-steps{display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin:0 0 12px;font-size:12.5px;color:var(--mute)}
.u14-steps b{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.u14-steps .dn{color:var(--ink2)}
.u14-ft{padding:10px 16px;border-top:1px solid var(--line2);font-size:12.5px;color:var(--ink2);background:var(--box);border-radius:0 0 6px 6px}
.u14-m .u14-ch{flex-wrap:wrap;gap:4px 8px;padding:10px 12px;font-size:12px}
.u14-m .u14-ch .sp{display:none}
.u14-m .u14-ch u{margin-left:auto}
.u14-m .u14-it{flex-direction:column;gap:12px;padding:12px}
.u14-m .u14-bt{width:auto;flex-direction:row;flex-wrap:wrap}
.u14-m .u14-bt .wf-btn{flex:1 1 40%;width:auto}
.u14-m .u14-bt small{flex:1 1 100%;text-align:left}
.u14-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:14px 16px;border:1px solid var(--line);border-radius:6px;margin-bottom:16px;background:var(--box)}
.u14-bar .k{font-size:13px;font-weight:700;margin-right:4px}
.u14-cal{width:280px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:12px;box-shadow:0 8px 24px rgba(0,0,0,.12)}
.u14-cal .hd{display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:700;margin-bottom:8px}
.u14-cal .gr{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:12.5px;text-align:center}
.u14-cal .gr span{height:32px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.u14-cal .gr .w{color:var(--mute);font-size:11.5px}
.u14-cal .gr .in{background:var(--fill);border-radius:0}
.u14-cal .gr .ed{background:var(--dark);color:#fff;font-weight:700}
.u14-cal .gr .td{border:1px solid var(--dark);font-weight:700}
.u14-cal .gr .no{color:var(--line);text-decoration:line-through}
.u14-leg{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;font-size:11.5px;color:var(--ink2)}
.u14-leg span{display:inline-flex;align-items:center;gap:4px}
.u14-leg i{display:inline-block;width:14px;height:14px;border-radius:3px;font-style:normal}
</style>`;

const Steps = (list, cur) => `<div class="u14-steps">${list.map((s, i) => (i === cur ? `<b>${s}</b>` : `<span class="${i < cur ? 'dn' : ''}">${s}</span>`)).join(Icon('angle-right-min'))}</div>`;

const Item = (o) => `
<div class="u14-it">
  <div class="u14-main">
    <div class="u14-st">${o.badge || OrderBadge(o.status)}<p>${o.msg}</p></div>
    ${o.extra || ''}
    ${ProductRow({ option: o.opt, qty: o.qty || 1, price: o.price })}
  </div>
  <div class="u14-bt">${(o.btns || []).join('')}${o.hint ? `<small>${o.hint}</small>` : ''}</div>
</div>`;

const Card = (o) => `
<div class="u14-card">
  <div class="u14-ch"><b>${o.date} 주문</b><span>주문번호 ${o.no}</span><span class="sp"></span><u>주문 상세${Icon('angle-right-min')}</u></div>
  ${o.items.map(Item).join('')}
  ${o.foot ? `<div class="u14-ft">${o.foot}</div>` : ''}
</div>`;

const B = (t, kind) => Btn(t, { kind: kind || 'line', size: 'sm' });

const acct = `<div class="u14-acct">${Icon('wallet')}<span>국민은행 <b>4301-****-****-12</b> · 예금주 이너에라 · 입금할 금액 <b>49,000원(예시)</b></span>${Btn('계좌번호 복사', { size: 'sm', icon: 'documents-o' })}</div>`;

const C_WAIT = Card({ date: '2026.11.10', no: '20261110-000119', items: [{
    status: '입금대기', msg: '<b>11월 12일(목) 23:59까지</b> 아래 계좌로 입금해 주세요. 남은 시간 1일 14시간. 기한이 지나면 주문이 자동으로 취소됩니다.',
    extra: acct, opt: O1, price: '49,000원(예시)', btns: [B('입금 계좌 보기', 'primary'), B('주문 취소')],
}] });

const C_PAID = Card({ date: '2026.11.11', no: '20261111-000128', items: [{
    status: '결제완료', msg: '결제가 끝났습니다. 아직 상품을 준비하기 전이라 <b>지금은 바로 취소</b>할 수 있습니다.',
    opt: O2, price: '93,000원(예시)', btns: [B('주문 취소'), B('배송지 변경')],
}] });

const C_READY = Card({ date: '2026.11.09', no: '20261109-000104', items: [{
    status: '배송준비', msg: '상품을 포장하고 있습니다. 11월 12일(목)까지 발송할 예정입니다.',
    opt: O4, price: '176,000원(예시)', btns: [B('취소 요청')], hint: '포장을 시작해 판매자가 확인한 뒤 취소됩니다',
}] });

const C_SHIP = Card({ date: '2026.11.07', no: '20261107-000088', items: [{
    status: '배송중', msg: 'CJ대한통운 <u>581233441201</u> · 11월 12일(목) 도착 예정',
    opt: O2, price: '93,000원(예시)', btns: [B('배송 조회', 'primary')], hint: '반품·교환은 상품을 받은 뒤 신청할 수 있습니다',
}] });

const C_DONE = Card({ date: '2026.11.03', no: '20261103-000052', items: [{
    status: '배송완료', msg: '11월 5일(목) 배송완료 · <b>11월 12일(목)에 자동으로 구매확정</b>됩니다. 반품·교환은 그 전까지 신청해 주세요.',
    opt: O1, qty: 2, price: '98,000원(예시)', btns: [B('구매확정', 'primary'), B('반품 신청'), B('교환 신청'), B('배송 조회')],
}] });

const C_FIX = Card({ date: '2026.10.20', no: '20261020-000311', items: [{
    status: '구매확정', msg: '10월 30일 구매확정 · 적립금 930원 적립 · 리뷰는 2027년 1월 28일까지 쓸 수 있습니다.',
    opt: O2, price: '93,000원(예시)', btns: [B('리뷰 쓰기', 'primary'), B('재구매')], hint: '포토 리뷰를 쓰면 500원 적립',
}] });

const C_FIX_REVIEWED = Card({ date: '2026.09.12', no: '20260912-000233', items: [{
    status: '구매확정', msg: '9월 22일 구매확정 · 리뷰를 작성했습니다.',
    opt: O1, price: '49,000원(예시)', btns: [B('내 리뷰 보기'), B('재구매')],
}] });

const C_CANCEL = Card({ date: '2026.10.28', no: '20261028-000007', items: [{
    status: '취소완료', msg: '10월 28일 취소완료 · <b>환불 49,000원</b> · 신용카드(신한) 승인 취소 — 카드사 반영까지 영업일 3~5일',
    opt: O1, price: '49,000원(예시)', btns: [B('취소 상세'), B('재구매')],
}] });

const C_AUTOCANCEL = Card({ date: '2026.10.14', no: '20261014-000201', items: [{
    status: '취소완료', msg: '입금 기한(10월 16일 23:59)이 지나 자동으로 취소되었습니다. 결제된 금액이 없어 환불도 없습니다.',
    opt: O1, price: '49,000원(예시)', btns: [B('재구매')],
}] });

const C_RETURN = Card({ date: '2026.10.25', no: '20261025-000291', items: [{
    status: '수거중', msg: '반품 진행 중 · 택배 기사님이 11월 12일(목)에 방문할 예정입니다. 상품을 받은 상자에 다시 담아 주세요.',
    extra: Steps(['반품 요청', '수거중', '검수중', '환불완료'], 1),
    opt: O2, price: '93,000원(예시)', btns: [B('반품 상세', 'primary'), B('회수 조회')], hint: '환불 예정 87,000원 (반품 배송비 6,000원 차감)',
}] });

const C_EXCHANGE = Card({ date: '2026.10.22', no: '20261022-000270', items: [{
    status: '재발송', msg: '교환 진행 중 · 새 상품을 보냈습니다. CJ대한통운 <u>581233441377</u> · 11월 12일(목) 도착 예정',
    extra: Steps(['교환 요청', '수거중', '재발송', '교환완료'], 2),
    opt: O2, price: '93,000원(예시)', btns: [B('교환 상세'), B('배송 조회', 'primary')],
}] });

const C_PART = Card({ date: '2026.11.06', no: '20261106-000075', foot: `${Icon('info-o')} 품목 2개 중 1개 취소 · 처음 결제 138,000원 · 환불 93,000원 · 남은 결제 금액 <b>45,000원</b>`, items: [
    { status: '취소완료', msg: '11월 6일 취소완료 · <b>환불 93,000원</b> · 카카오페이 결제 취소', opt: O2, price: '<s>93,000원(예시)</s>', btns: [B('취소 상세')] },
    { status: '배송준비', msg: '상품을 포장하고 있습니다. 11월 12일(목)까지 발송할 예정입니다.', opt: O1, price: '49,000원(예시)', btns: [B('취소 요청')], hint: '판매자가 확인한 뒤 취소됩니다' },
] });

const C_REQ = Card({ date: '2026.11.08', no: '20261108-000097', items: [{
    status: '취소요청', msg: '취소 요청을 판매자가 확인하고 있습니다(11월 11일 10:12 요청). 이미 발송된 경우 취소가 거부될 수 있고, 결과는 알림톡으로 알려 드립니다.',
    opt: O1, price: '49,000원(예시)', btns: [B('취소 요청 철회')], hint: '철회하면 원래대로 배송됩니다',
}] });

const C_DELAY = Card({ date: '2026.11.05', no: '20261105-000066', items: [{
    status: '발송지연', msg: '발송이 늦어지고 있습니다. 사유: 상품 입고 지연 · <b>11월 16일(월) 발송 예정</b>. 기다리기 어려우시면 취소를 요청할 수 있습니다.',
    opt: O4, price: '176,000원(예시)', btns: [B('취소 요청')],
}] });

const C_REJECT = Card({ date: '2026.10.08', no: '20261008-000141', items: [{
    badge: `${OrderBadge('배송완료')} ${OrderBadge('거부')}`, msg: '반품 요청이 거부되어 배송완료 상태로 돌아왔습니다. 사유: 개봉 후 일부를 드신 상품은 반품이 어렵습니다(11월 2일).',
    opt: O1, price: '49,000원(예시)', btns: [B('거부 사유 보기'), B('1:1 문의'), B('구매확정', 'primary')],
}] });

const TABS = ['전체 14', '입금대기 1', '결제완료 1', '배송준비 3', '배송중 1', '배송완료 2', '구매확정 2', '취소·반품·교환 4'];

const FilterBar = (o = {}) => `<div class="u14-bar"><span class="k">조회 기간</span>${Chips(['1개월', '3개월', '6개월', '1년', '직접 입력'], o.preset || '3개월')}${Input({ value: o.from || '2026-08-11', icon: 'calendar', w: 140, focus: o.focus === 'from' })}<span>~</span>${Input({ value: o.to || '2026-11-11', icon: 'calendar', w: 140, focus: o.focus === 'to' })}${o.status || Select({ value: '주문 상태 전체', w: 150 })}${Input({ placeholder: '상품 이름', icon: 'search', w: 150, value: o.q })}${Btn('조회', { kind: 'primary', size: 'sm' })}</div>`;

const PcList = (o, ...cards) => MypageLayout({ active: '주문 목록', title: '주문 목록', crumb: ['홈', '마이페이지', '주문 목록'] },
    FilterBar(o.filter || {}),
    Chips(TABS, o.tab || '전체 14'),
    '<div style="height:16px"></div>',
    cards,
    o.note === false ? '' : Note('<span>금액은 예시 값입니다(판매가 미확정). 한 주문에 품목이 여럿이면 품목마다 상태와 버튼이 따로 나옵니다.</span>'),
    o.pager === false ? '' : Pager({ page: 1, last: 2 }),
);

const MList = (label, ...cards) => Canvas({ size: 'mobile', label }, MobilePage({ title: '주문 목록', tab: '마이' },
    `<div class="u14-m">${Flex({ justify: 'space-between', align: 'center' }, Text('최근 3개월 · 전체 <b>14</b>건', { sm: true }), Btn('기간·상태', { size: 'sm', icon: 'filter' }))}<div style="height:12px"></div>${cards.join('')}</div>`));

const state1 = StateBlock({ idx: 1, title: '상태별 카드 전부(입금대기·결제완료·배송준비·배송중·배송완료·구매확정·취소완료·반품진행·교환진행) — 상태마다 버튼 다름', note: '마이페이지 > 주문 목록. 처음 들어오면 최근 3개월 · 전체 상태 · 최근 주문이 위. 카드 한 장 = 주문 한 건, 그 안의 줄 = 품목.' },
    Anno({ title: '왜 이렇게 하나' }, '주문 상태는 주문이 아니라 품목마다 따로 움직입니다(부분 취소·부분 발송). 그래서 배지·안내 문구·버튼을 카드가 아니라 품목 줄에 붙입니다. 안내 문구는 상태 이름을 되풀이하지 않고 "언제까지 · 무엇을 할 수 있는지"를 날짜와 함께 적어, 고객이 문의하지 않고도 다음 일을 알게 합니다.'),
    Anno({ title: '버튼이 가는 곳' }, '주문 취소(입금대기) = 이 화면 확인 팝업 / 주문 취소(결제완료) · 취소 요청(배송준비) · 반품 신청 · 교환 신청 = U-16 신청 화면 / 배송 조회 · 회수 조회 = U-18 팝업 / 구매확정 = 이 화면 확인 팝업 / 리뷰 쓰기 = U-19 작성 폼 / 재구매 = 같은 구성을 장바구니에 담고 토스트 / 취소·반품·교환 상세 = U-17 / 배송지 변경 · 입금 계좌 보기 = U-15 주문 상세. 리뷰·적립금 기능을 끈 몰에서는 리뷰 쓰기 버튼과 적립 문구가 나오지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '결제완료 단계는 고객이 바로 취소(자동 환불), 배송준비부터는 "취소 요청"으로 이름이 바뀌고 판매자 승인이 필요하다는 말을 버튼 아래에 적습니다. 배송완료 카드에는 자동 구매확정 날짜를 반드시 적습니다 — 그날이 지나면 반품·교환 버튼이 사라지기 때문입니다(일수는 관리자 설정 > 주문·클레임 정책).'),
    Canvas({ label: 'U-14 · 주문 목록 · 전체 탭 — 주문 진행 6단계 카드(입금대기 · 결제완료 · 배송준비 · 배송중 · 배송완료 · 구매확정)' },
        PcList({}, C_WAIT, C_PAID, C_READY, C_SHIP, C_DONE, C_FIX, C_FIX_REVIEWED)),
    Canvas({ label: 'U-14 · 주문 목록 · 취소·반품·교환 탭 — 취소완료(환불 금액·수단) · 입금 기한 지나 자동 취소 · 반품진행 · 교환진행 · 부분 취소' },
        PcList({ tab: '취소·반품·교환 4', pager: false }, C_CANCEL, C_AUTOCANCEL, C_RETURN, C_EXCHANGE, C_PART)),
    Canvas({ label: 'U-14 · 그 밖의 카드 — 취소 요청 승인 대기 · 발송 지연 안내를 받은 주문 · 반품이 거부되어 돌아온 주문' },
        PcList({ tab: '배송준비 3', pager: false, note: false }, C_REQ, C_DELAY, C_REJECT)),
    CanvasRow(
        MList('U-14 모바일 · 입금대기 · 결제완료 · 배송준비', C_WAIT, C_PAID, C_READY),
        MList('U-14 모바일 · 배송중 · 배송완료 · 구매확정', C_SHIP, C_DONE, C_FIX),
        MList('U-14 모바일 · 취소완료 · 반품진행 · 교환진행', C_CANCEL, C_RETURN, C_EXCHANGE),
    ),
    CanvasRow(
        MList('U-14 모바일 · 부분 취소 · 취소 요청 승인 대기', C_PART, C_REQ),
        Canvas({ size: 'auto', label: '입금대기 카드 · 주문 취소 버튼 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '이 주문을 취소할까요?', desc: `주문번호 20261110-000119<br>${SHOP.productShort} · ${O1} 1개<br>아직 입금 전이라 환불할 금액은 없습니다. 발급된 입금 계좌는 더 이상 쓸 수 없습니다.`, ok: '주문 취소', danger: true })),
        Canvas({ size: 'auto', label: '배송완료 카드 · 구매확정 버튼 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '구매를 확정할까요?', desc: `${SHOP.productShort} · ${O1} 2개<br>구매확정 뒤에는 <b>반품·교환을 신청할 수 없습니다.</b><br>확정하면 적립금 980원이 바로 적립되고 리뷰를 쓸 수 있습니다.`, ok: '구매확정' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '취소 요청 승인 대기 카드 · 취소 요청 철회 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '취소 요청을 철회할까요?', desc: '철회하면 주문이 배송준비 상태로 돌아가 원래대로 발송됩니다.', ok: '요청 철회' })),
        Canvas({ size: 'auto', label: '반품 거부 카드 · 거부 사유 보기 → 팝업', right: '팝업만', pad: 20 },
            Modal({ title: '반품 요청 거부 안내', w: 420, foot: [Btn('1:1 문의하기'), Btn('확인', 'primary')] },
                KV([['요청일', '2026-10-30 14:20'], ['거부일', '2026-11-02 11:05'], ['거부 사유', '개봉 후 일부를 드신 상품은 반품이 어렵습니다. 14포 중 9포만 회수되었습니다.'], ['지금 상태', '배송완료 (11월 9일 자동 구매확정 예정)']]))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입금대기 카드 · 계좌번호 복사 → 토스트', right: '토스트만', pad: 20 }, Toast('계좌번호를 복사했습니다. 국민은행 4301-****-****-12')),
        Canvas({ size: 'auto', label: '구매확정 완료 → 토스트', right: '토스트만', pad: 20 }, Toast('구매확정했습니다. 적립금 980원이 적립되었습니다.', { action: '리뷰 쓰기' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '재구매 → 장바구니에 담김', right: '토스트만', pad: 20 }, Toast(`${O2} 1개를 장바구니에 담았습니다.`, { action: '장바구니 보기' })),
        Canvas({ size: 'auto', label: '재구매 → 그 구성이 품절일 때 (닫기 전까지 남음)', right: '토스트만', pad: 20 }, Toast(`${O4} 구성은 지금 품절입니다. 상품 화면에서 다른 구성을 골라 주세요.`, { kind: 'error', action: '상품 보기' })),
    ),
);

const W = ['일', '월', '화', '수', '목', '금', '토'];
const Cal = (o) => {
    const cells = [];
    for (let i = 0; i < o.offset; i += 1) cells.push('<span></span>');
    for (let d = 1; d <= o.days; d += 1) {
        const cls = d === o.from || d === o.to ? 'ed' : o.from && o.to && d > o.from && d < o.to ? 'in' : o.max && d > o.max ? 'no' : d === o.today ? 'td' : '';
        cells.push(`<span class="${cls}">${d}</span>`);
    }
    return `<div class="u14-cal"><div class="hd">${Icon('angle-left-min')}<span>${o.title}</span>${Icon('angle-right-min')}</div><div class="gr">${W.map((w) => `<span class="w">${w}</span>`).join('')}${cells.join('')}</div>${o.legend ? `<div class="u14-leg"><span><i style="background:var(--dark)"></i>시작일 · 끝일</span><span><i style="background:var(--fill)"></i>고른 기간</span><span><i style="border:1px solid var(--dark)"></i>오늘</span><span><i style="border:1px solid var(--line2)"></i><s>12</s> 고를 수 없음(오늘 이후)</span></div>` : ''}</div>`;
};

const STATUS_OPTS = [{ t: '주문 상태 전체', on: true }, '입금대기', '결제완료', '배송준비', '배송중', '배송완료', '구매확정', '취소', '반품', '교환'];

const mFilterSheet = BottomSheet({ title: '기간·상태', foot: [Btn('초기화'), Btn("1건 보기", "primary")] },
    Text('조회 기간', { b: true }),
    Chips(['1개월', '3개월', '6개월', '1년', '직접 입력'], '직접 입력'),
    Flex({ gap: 8, align: 'center', mt: 10 }, Input({ value: '2026-10-01', icon: 'calendar', w: 150 }), '<span>~</span>', Input({ value: '2026-10-31', icon: 'calendar', w: 150 })),
    '<div style="height:16px"></div>',
    Text('주문 상태', { b: true }),
    Chips(['전체', '입금대기', '결제완료', '배송준비', '배송중', '배송완료', '구매확정', '취소', '반품', '교환'], '구매확정'),
    '<div style="height:16px"></div>',
    Text('상품 이름', { b: true }),
    Input({ placeholder: '상품 이름으로 찾기', icon: 'search', w: '100%' }),
);

const state2 = StateBlock({ idx: 2, title: '기간 필터', note: '조회 기간 · 주문 상태 · 상품 이름으로 지난 주문을 찾습니다. 상태 칩과 조회 조건은 함께 걸립니다.' },
    Anno({ title: '초기값 · 범위' }, '초기값은 최근 3개월 · 주문 상태 전체. 빠른 선택 1개월 · 3개월 · 6개월 · 1년, 직접 입력은 한 번에 최대 1년 · 5년 전까지(거래 기록 보관 기간). 상태 칩의 숫자는 지금 조회 기간 안의 건수이고, 0건인 상태 칩은 숨기지 않고 흐리게 둡니다. 모바일은 조건 줄 대신 "기간·상태" 버튼 → 바텀시트.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '부분 취소 주문은 "취소"로 걸러도, "배송준비"로 걸러도 나와야 합니다(품목 단위로 거름). 걸렸을 때는 카드 전체를 보여 주되 조건에 맞는 품목 줄만 진하게, 나머지 품목은 흐리게 둡니다.'),
    Canvas({ label: 'U-14 · 직접 입력 → 시작일 칸을 눌러 달력이 열린 모습 (10월 1일 ~ 10월 31일을 고름)' },
        MypageLayout({ active: '주문 목록', title: '주문 목록', crumb: ['홈', '마이페이지', '주문 목록'] },
            FilterBar({ preset: '직접 입력', from: '2026-10-01', to: '2026-10-31', focus: 'from' }),
            Flex({ gap: 16, align: 'flex-start' },
                Cal({ title: '2026년 10월', offset: 4, days: 31, from: 1, to: 31 }),
                Cal({ title: '2026년 11월', offset: 0, days: 30, today: 11, max: 11, legend: true }),
            ),
        )),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문 상태 고르는 중 (목록 열림)', right: '조건 줄만', pad: 20, h: 420 },
            `<div class="u14-bar" style="align-items:flex-start;margin:0">${Select({ value: '주문 상태 전체', w: 170, open: true, options: STATUS_OPTS })}</div>`),
        Canvas({ size: 'auto', label: '직접 입력 오류 · 기간이 1년을 넘을 때', right: '조건 줄만', pad: 20 },
            `<div style="width:560px"><div class="u14-bar" style="margin-bottom:6px">${Chips(['1개월', '3개월', '6개월', '1년', '직접 입력'], '직접 입력')}${Input({ value: '2025-06-01', icon: 'calendar', w: 140, error: true })}<span>~</span>${Input({ value: '2026-11-11', icon: 'calendar', w: 140 })}</div><p class="err">${Icon('error-o')}한 번에 1년까지만 조회할 수 있습니다. 시작일을 2025년 11월 12일 이후로 골라 주세요.</p></div>`),
    ),
    Canvas({ label: 'U-14 · 조건 적용 뒤 — 2026-10-01 ~ 2026-10-31 · 구매확정 · 결과 1건' },
        PcList({ filter: { preset: '직접 입력', from: '2026-10-01', to: '2026-10-31', status: Select({ value: '구매확정', w: 150 }) }, tab: '구매확정 1', pager: false },
            Flex({ gap: 8, align: 'center' }, Text('적용한 조건', { sm: true, mute: true }), Chips(['2026-10-01 ~ 2026-10-31', '구매확정'], '', { close: true }), Btn('조건 지우기', { kind: 'ghost', size: 'sm', icon: 'refresh' })),
            '<div style="height:12px"></div>',
            C_FIX)),
    Canvas({ label: 'U-14 · 조건에 맞는 주문이 없을 때 — 주문이 아예 없는 것과 다른 문구(조건을 바꾸게 함)' },
        MypageLayout({ active: '주문 목록', title: '주문 목록', crumb: ['홈', '마이페이지', '주문 목록'] },
            FilterBar({ preset: '1개월', from: '2026-10-11', to: '2026-11-11', status: Select({ value: '교환', w: 150 }), q: '망고' }),
            Empty({ icon: 'search', title: '조건에 맞는 주문이 없습니다', desc: '최근 1개월 · 교환 · "망고"로 찾았습니다. 기간을 넓히거나 조건을 지우고 다시 찾아보세요.', action: [Btn('조건 지우기'), Btn('최근 1년 보기', 'primary')] }),
        )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-14 모바일 · 기간·상태 버튼 → 바텀시트' }, Overlay({ bg: MobilePage({ title: '주문 목록', tab: '마이' }, `<div class="u14-m">${C_PAID}${C_READY}</div>`), align: 'bottom', h: 720 }, mFilterSheet)),
        Canvas({ size: 'mobile', label: 'U-14 모바일 · 조건 적용 뒤' }, MobilePage({ title: '주문 목록', tab: '마이' },
            `<div class="u14-m">${Flex({ justify: 'space-between', align: 'center' }, Text('<b>1</b>건', { sm: true }), Btn('기간·상태 2', { size: 'sm', icon: 'filter', kind: 'primary' }))}<div style="height:8px"></div>${Chips(['10-01 ~ 10-31', '구매확정'], '', { close: true })}<div style="height:12px"></div>${C_FIX}</div>`)),
        Canvas({ size: 'mobile', label: 'U-14 모바일 · 시트 안 시작일 → 달력' }, Overlay({ bg: MobilePage({ title: '주문 목록', tab: '마이' }, ''), align: 'bottom', h: 720 },
            BottomSheet({ title: '시작일 고르기', foot: [Btn('취소'), Btn('10월 1일로 정하기', 'primary')] },
                `<div style="display:flex;justify-content:center">${Cal({ title: '2026년 10월', offset: 4, days: 31, from: 1 })}</div>`,
                Flex({ gap: 16, mt: 12 }, Radio('시작일', { on: true }), Radio('끝일'))))),
    ),
);

const state3 = StateBlock({ idx: 3, title: '주문 없음', note: '가입하고 아직 한 번도 주문하지 않은 회원. 조회 조건 줄과 상태 칩을 보여 주지 않습니다.' },
    Anno({ title: '빈 상태' }, '빈 화면은 "없습니다"로 끝내지 않고 다음 행동을 줍니다. 상품이 1개뿐인 몰(이너에라)은 버튼이 그 상품 상세로 바로 가고, 상품이 여럿인 몰은 상품 목록으로 갑니다. 쓸 수 있는 쿠폰이 있으면 한 줄로 알려 첫 주문으로 잇습니다(쿠폰 기능을 끈 몰은 이 줄 없음). 비회원으로 주문한 내역은 여기 나오지 않으므로 비회원 주문 조회로 가는 길을 둡니다.'),
    Canvas({ label: 'U-14 · 주문이 한 건도 없는 회원' },
        MypageLayout({ active: '주문 목록', title: '주문 목록', crumb: ['홈', '마이페이지', '주문 목록'], name: '윤서연' },
            Empty({ icon: 'receipt', title: '아직 주문한 상품이 없습니다', desc: '지금 쓸 수 있는 쿠폰이 1장 있습니다 — 신규 가입 3,000원 할인(2026-12-10까지).', action: Btn('상품 보러 가기', 'primary') }),
            Note('<span>회원가입 전에 비회원으로 주문하셨나요? <u>비회원 주문 조회</u>에서 주문번호와 휴대폰 번호로 찾을 수 있습니다.</span>'),
        )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-14 모바일 · 주문 없음' }, MobilePage({ title: '주문 목록', tab: '마이' },
            Empty({ icon: 'receipt', title: '아직 주문한 상품이 없습니다', desc: '지금 쓸 수 있는 쿠폰이 1장 있습니다.<br>신규 가입 3,000원 할인(2026-12-10까지)', action: Btn('상품 보러 가기', 'primary') }),
            Note('<span>비회원으로 주문하셨다면 <u>비회원 주문 조회</u>를 이용해 주세요.</span>'))),
        Canvas({ size: 'mobile', label: 'U-14 모바일 · 쿠폰 기능을 끈 몰의 주문 없음' }, MobilePage({ title: '주문 목록', tab: '마이' },
            Empty({ icon: 'receipt', title: '아직 주문한 상품이 없습니다', desc: '마음에 드는 상품을 담아 보세요.', action: Btn('상품 보러 가기', 'primary') }))),
    ),
);

export default function U14() {
    return [STYLE, state1, state2, state3].join('');
}
