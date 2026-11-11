import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, BtnRow, OrderBadge, Badge, Input, Select, Radio, Check, Field, Overlay, Modal,
    Confirm, BottomSheet, Toast, ProductRow, PriceSummary, Box, KV, Grid, Note, Text, Icon, Flex, Timeline, Table, SHOP,
} from '../lib/blocks.js';

const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const STYLE = `<style>
.u15-hd{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:14px 16px;border:1px solid var(--line);border-radius:6px;background:var(--box);margin-bottom:16px;font-size:13.5px}
.u15-hd b{font-size:16px}
.u15-hd .sp{flex:1}
.u15-hd span{color:var(--ink2)}
.u15-it{display:flex;gap:20px;padding:14px 0;border-top:1px solid var(--line2)}
.u15-it:first-child{border-top:0;padding-top:0}
.u15-it:last-child{padding-bottom:0}
.u15-main{flex:1;min-width:0}
.u15-st{display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:13.5px}
.u15-st .wf-badge{flex:none;margin-top:1px}
.u15-st p{margin:0;line-height:1.6;color:var(--ink2)}
.u15-bt{width:128px;flex:none;display:flex;flex-direction:column;gap:6px}
.u15-bt .wf-btn{width:100%}
.u15-bt small{font-size:11.5px;color:var(--mute);line-height:1.5;text-align:center}
.u15-m .u15-hd{padding:12px;gap:4px 10px;font-size:12.5px}
.u15-m .u15-hd .sp{display:none}
.u15-m .u15-it{flex-direction:column;gap:10px}
.u15-m .u15-bt{width:auto;flex-direction:row;flex-wrap:wrap}
.u15-m .u15-bt .wf-btn{flex:1 1 40%;width:auto}
.u15-m .u15-bt small{flex:1 1 100%;text-align:left}
.u15-acct{border:2px solid var(--dark);border-radius:6px;padding:16px;margin-bottom:16px;background:#fff}
.u15-acct .tt{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:800;margin-bottom:12px}
.u15-acct .no{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:18px;font-weight:800;margin:4px 0 12px}
.u15-slip{width:340px;border:1px solid var(--line);border-radius:4px;padding:18px;background:#fff;font-size:13px}
.u15-slip h4{margin:0 0 4px;font-size:16px;text-align:center}
.u15-slip .sub{text-align:center;color:var(--mute);font-size:12px;margin-bottom:12px}
.u15-slip hr{border:0;border-top:1px dashed var(--line);margin:12px 0}
.u15-slip .tot{display:flex;justify-content:space-between;font-size:15px;font-weight:800;margin-top:8px}
.u15-pick{display:flex;align-items:center;gap:12px;padding:14px;border:1px solid var(--line);border-radius:6px;margin-bottom:8px;font-size:13.5px}
.u15-pick i{font-size:22px}
.u15-pick div{flex:1;display:flex;flex-direction:column}
.u15-pick div span{font-size:12.5px;color:var(--mute)}
.u15-pick.off{background:var(--box);color:var(--mute)}
.u15-addr{display:flex;align-items:flex-start;gap:10px;padding:12px;border:1px solid var(--line);border-radius:6px;margin-bottom:8px;font-size:13px}
.u15-addr.on{border:2px solid var(--dark)}
.u15-addr div{flex:1;display:flex;flex-direction:column;gap:2px}
.u15-addr div span{color:var(--ink2)}
</style>`;

const B = (t, kind) => Btn(t, { kind: kind || 'line', size: 'sm' });
const gap = (h = 12) => `<div style="height:${h}px"></div>`;

const Item = (o) => `
<div class="u15-it">
  <div class="u15-main">
    <div class="u15-st">${o.badge || OrderBadge(o.status)}<p>${o.msg}</p></div>
    ${ProductRow({ option: o.opt, qty: o.qty || 1, price: o.price })}
  </div>
  <div class="u15-bt">${(o.btns || []).join('')}${o.hint ? `<small>${o.hint}</small>` : ''}</div>
</div>`;

const Head = (o) => `<div class="u15-hd"><b>주문번호 ${o.no}</b><span>${o.at} 주문</span><span class="sp"></span>${Btn('영수증', { size: 'sm', icon: 'receipt', disabled: o.noReceipt })}${Btn('1:1 문의', { size: 'sm', icon: 'message-o' })}</div>`;

const Items = (items, sub) => Box({ title: '주문 상품', sub: sub || `품목 ${items.length}개 · 품목마다 상태가 따로 움직입니다` }, items.map(Item).join(''));

const ADDR = [['받는 분', '김민지'], ['연락처', '010-****-1234'], ['주소', '(03925) 서울 마포구 월드컵북로 *** 101동 1203호'], ['배송 메모', '문 앞에 놓아 주세요'], ['공동현관', '비밀번호 입력됨 (기사님에게만 전달)']];

const Ship = (o = {}) => Box({ title: '배송지', right: o.edit ? Btn('배송지 변경', { size: 'sm' }) : Text(`${Icon('lock-o')} 변경 불가`, { sm: true, mute: true }) },
    KV(o.rows || ADDR),
    o.note ? gap(10) + Note(`<span>${o.note}</span>`) : '');

const Pay = (o) => [
    PriceSummary({ title: '결제 정보', rows: o.rows, total: o.total, note: o.note }),
    gap(16),
    Box({ title: '결제 수단' },
        KV(o.method),
        o.receipt === false ? '' : gap(12) + BtnRow({}, ...(o.receipt || [Btn('카드 전표', { size: 'sm', icon: 'receipt' })]))),
];

const PcDetail = (o) => MypageLayout({ active: '주문 목록', title: '주문 상세', crumb: ['홈', '마이페이지', '주문 목록', '주문 상세'] },
    Head(o),
    o.top || '',
    Grid('minmax(0,1fr) 300px',
        `<div>${Items(o.items, o.itemSub)}${o.mid || ''}${Ship(o.ship)}${o.under || ''}</div>`,
        `<div>${Pay(o.pay).join('')}</div>`),
    Flex({ justify: 'space-between', align: 'center', mt: 4 }, Btn('주문 목록으로', { icon: 'angle-left-min' }), Text('금액은 예시 값입니다(판매가 미확정).', { sm: true, mute: true })),
);

const MDetail = (label, o) => Canvas({ size: 'mobile', label }, MobilePage({ title: '주문 상세', tab: false, bottom: o.bottom },
    `<div class="u15-m">${Head(o)}${o.top || ''}${Items(o.items, ' ')}${o.mid || ''}${Ship(o.ship)}${Pay(o.pay).join('')}</div>`));

const D1 = {
    no: '20261111-000128', at: '2026-11-11 09:42',
    items: [{ status: '결제완료', msg: '결제가 끝났습니다. 상품을 준비하기 전이라 <b>지금은 바로 취소</b>할 수 있습니다. 11월 13일(금)까지 발송 예정.', opt: O2, price: '93,000원(예시)', btns: [B('주문 취소')], hint: '누르는 즉시 취소·환불됩니다' }],
    ship: { edit: true, note: '상품 준비를 시작하기 전(결제완료)까지만 배송지를 바꿀 수 있습니다.' },
    pay: {
        rows: [['상품 금액', '93,000원'], ['배송비', '0원', '5만원 이상 무료배송(예시)']],
        total: ['총 결제 금액', '93,000원'], note: '구매확정하면 930원이 적립됩니다',
        method: [['결제 수단', '신용카드'], ['카드', '신한카드 4518-****-****-1234'], ['할부', '일시불'], ['결제 일시', '2026-11-11 09:42']],
    },
    bottom: [Btn('배송지 변경'), Btn('주문 취소')],
};

const ADDR_LIST = (on, extra = '') => [
    `<div class="u15-addr${on === 0 ? ' on' : ''}">${Radio('', { on: on === 0 })}<div><b>집 ${Badge('기본 배송지', 'line')} ${Badge('지금 배송지', 'bold')}</b><span>김민지 · 010-****-1234</span><span>(03925) 서울 마포구 월드컵북로 *** 101동 1203호</span></div></div>`,
    `<div class="u15-addr${on === 1 ? ' on' : ''}">${Radio('', { on: on === 1 })}<div><b>회사</b><span>김민지 · 010-****-1234</span><span>(06142) 서울 강남구 테헤란로 *** 8층</span></div></div>`,
    `<div class="u15-addr${on === 2 ? ' on' : ''}">${Radio('', { on: on === 2 })}<div><b>부모님 댁</b><span>김영숙 · 010-****-7731</span><span>(48058) 부산 해운대구 센텀중앙로 *** 502호</span></div></div>`,
    `<div class="u15-addr${on === 3 ? ' on' : ''}">${Radio('', { on: on === 3 })}<div><b>새 배송지 직접 입력</b>${extra}</div></div>`,
].join('');

const MEMO_OPTS = [{ t: '문 앞에 놓아 주세요', on: true }, '경비실에 맡겨 주세요', '택배함에 넣어 주세요', '배송 전에 연락 주세요', '직접 입력'];

const addrModal = Modal({ title: '배송지 변경', w: 520, foot: [Btn('취소'), Btn('이 배송지로 변경', 'primary')] },
    ADDR_LIST(1),
    Field({ label: '배송 메모' }, Select({ value: '문 앞에 놓아 주세요', w: '100%' })),
    Note('<span>배송지 목록은 마이페이지 > 배송지 관리에서 고칩니다. 여기서 바꾼 주소는 이 주문에만 적용됩니다.</span>'),
);

const addrModalNew = Modal({ title: '배송지 변경', w: 520, foot: [Btn('취소'), Btn('이 배송지로 변경', { kind: 'primary', disabled: true })] },
    ADDR_LIST(3, gap(8) + Field({ label: '받는 분', required: true }, Input({ value: '김민지', w: '100%' }))
        + Field({ label: '연락처', required: true, error: '휴대폰 번호 11자리를 숫자로 입력해 주세요.' }, Input({ value: '010-1234', w: '100%', error: true }))
        + Field({ label: '주소', required: true }, `<div style="display:flex;gap:8px;align-items:center">${Input({ value: '63122', w: 110, disabled: true })}${Btn('주소 검색', { size: 'sm', w: 96 })}</div>`, gap(6), Input({ value: '제주 제주시 연북로 ***', w: '100%', disabled: true }), gap(6), Input({ placeholder: '상세 주소 (동·호수)', w: '100%', focus: true }))
        + Check('배송지 목록에도 저장', { on: false })),
    Field({ label: '배송 메모' }, Select({ value: '문 앞에 놓아 주세요', w: '100%', open: true, options: MEMO_OPTS })),
    Note('<span>제주·도서산간 주소는 추가 배송비 3,000원이 필요해 여기서 바꿀 수 없습니다. 주문을 취소하고 다시 주문하거나 1:1 문의로 알려 주세요.</span>', { warn: true }),
);

const state1 = StateBlock({ idx: 1, title: '결제완료(주문 취소 가능)', note: '주문 목록에서 주문 상세를 누르거나 주문 완료 알림톡의 링크로 들어옵니다. 결제가 끝나고 판매자가 아직 발주확인을 하지 않은 단계.' },
    Anno({ title: '왜 이렇게 하나' }, '화면은 위에서부터 "무엇을 샀나(품목·상태·버튼) → 어디로 오나(배송지) → 얼마를 냈나(결제 정보)" 순서입니다. 버튼은 화면 맨 아래가 아니라 품목 줄에 붙습니다 — 품목마다 할 수 있는 일이 다르기 때문입니다. 결제 정보에서 쓰지 않은 할인(쿠폰·적립금) 줄은 숨기고, 기능을 끈 몰에서는 그 줄과 적립 예정 문구가 아예 없습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '결제완료 단계의 주문 취소는 승인 없이 즉시 환불이라 버튼 아래에 그 사실을 적습니다(누르면 U-16 취소 화면에서 환불 금액을 확인하고 확정). 배송지 변경은 발주확인 전까지만 — 배송준비가 되는 순간 버튼이 "변경 불가" 표시로 바뀝니다. 추가 배송비가 생기는 지역으로는 바꿀 수 없습니다(추가 결제가 필요하므로).'),
    Canvas({ label: 'U-15 · 주문 상세 · 결제완료 — 주문 취소 · 배송지 변경 가능' }, PcDetail(D1)),
    Canvas({ label: 'U-15 · 배송지 변경 버튼 → 팝업 (저장된 배송지에서 고르기)' }, Overlay({ bg: PcDetail(D1), h: 700 }, addrModal)),
    CanvasRow(
        Canvas({ size: 'auto', label: '새 배송지 직접 입력 · 배송 메모 목록 열림 · 입력 오류 · 추가 배송비 지역이라 막힘', right: '팝업만', pad: 20 }, addrModalNew),
        `<div>${Canvas({ size: 'auto', label: '배송지 변경 완료', right: '토스트만', pad: 20 }, Toast('배송지를 바꿨습니다. 서울 강남구 테헤란로 *** 8층'))}${gap(20)}${Canvas({ size: 'auto', label: '팝업을 연 사이 판매자가 발주확인을 했을 때 (닫기 전까지 남음)', right: '토스트만', pad: 20 }, Toast('상품 준비가 시작되어 배송지를 바꿀 수 없습니다. 1:1 문의로 알려 주세요.', { kind: 'error', action: '1:1 문의' }))}</div>`,
    ),
    CanvasRow(
        MDetail('U-15 모바일 · 결제완료 — 아래 고정 버튼', D1),
        Canvas({ size: 'mobile', label: 'U-15 모바일 · 배송지 변경 → 바텀시트' }, Overlay({ bg: MobilePage({ title: '주문 상세', tab: false }, `<div class="u15-m">${Head(D1)}${Items(D1.items, ' ')}</div>`), align: 'bottom', h: 760 },
            BottomSheet({ title: '배송지 변경', foot: [Btn('취소'), Btn('이 배송지로 변경', 'primary')] }, ADDR_LIST(1), Field({ label: '배송 메모' }, Select({ value: '문 앞에 놓아 주세요', w: '100%' }))))),
    ),
);

const D2 = {
    no: '20261107-000088', at: '2026-11-07 20:15',
    items: [{ status: '배송중', msg: 'CJ대한통운 <u>581233441201</u> · 11월 10일(화) 발송 · <b>11월 12일(목) 도착 예정</b>', opt: O2, price: '93,000원(예시)', btns: [B('배송 조회', 'primary')], hint: '반품·교환은 상품을 받은 뒤 신청할 수 있습니다' }],
    mid: Box({ title: '배송 현황', sub: 'CJ대한통운 581233441201', right: Btn('전체 보기', { size: 'sm' }) },
        Timeline([{ t: '배송 출발', d: '마포 상암 · 오늘 14시 ~ 16시 도착 예정', time: '11-11 08:20', on: true }, { t: '간선 하차', d: '서울 마포 터미널', time: '11-11 04:10' }])),
    ship: { note: '이미 발송되어 배송지를 바꿀 수 없습니다. 주소가 틀렸다면 배송 조회의 택배사 고객센터(1588-1255)로 연락해 주세요.' },
    pay: {
        rows: [['상품 금액', '93,000원'], ['배송비', '0원', '5만원 이상 무료배송(예시)']],
        total: ['총 결제 금액', '93,000원'], note: '구매확정하면 930원이 적립됩니다',
        method: [['결제 수단', '네이버페이'], ['결제 일시', '2026-11-07 20:15']],
        receipt: [Btn('영수증', { size: 'sm', icon: 'receipt' })],
    },
    bottom: [Btn('배송 조회', 'primary')],
};

const D2B = {
    ...D2, no: '20261110-000125', at: '2026-11-10 21:40', itemSub: '품목 2개 · 먼저 준비된 상품부터 나눠 보냈습니다', mid: '',
    items: [
        { status: '배송중', msg: 'CJ대한통운 <u>581233441240</u> · 11월 12일(목) 도착 예정', opt: O1, qty: 2, price: '98,000원(예시)', btns: [B('배송 조회', 'primary')] },
        { status: '발송지연', msg: '입고가 늦어져 <b>11월 16일(월) 발송 예정</b>입니다. 기다리기 어려우시면 이 품목만 취소를 요청할 수 있습니다.', opt: O4, price: '176,000원(예시)', btns: [B('취소 요청')], hint: '판매자가 확인한 뒤 취소됩니다' },
    ],
    pay: { ...D2.pay, rows: [['상품 금액', '274,000원'], ['배송비', '0원', '나눠 보내도 배송비는 한 번만']], total: ['총 결제 금액', '274,000원'], note: '구매확정하면 품목별로 적립됩니다', method: [['결제 수단', '신용카드'], ['카드', '국민카드 5570-****-****-9012'], ['할부', '3개월 무이자'], ['결제 일시', '2026-11-10 21:40']], receipt: undefined },
};

const state2 = StateBlock({ idx: 2, title: '배송중(배송 조회)', note: '판매자가 송장을 넣어 발송처리한 뒤. 택배사 추적이 배송완료를 알려 오면 자동으로 배송완료로 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이 단계에서 고객이 궁금한 것은 "언제 오나" 하나입니다. 품목 줄에 택배사·송장번호·도착 예정일을 적고, 팝업을 열지 않아도 가장 최근 두 단계가 화면에 보이게 합니다. 배송 조회 · 전체 보기 · 송장번호를 누르면 U-18 배송 조회 팝업이 뜹니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '나눠 보낸 주문(부분 발송)은 품목마다 송장과 상태가 다릅니다. 송장이 둘이면 배송 조회 버튼도 품목마다 따로 있습니다. 배송지 변경 · 주문 취소 버튼은 사라지고, 왜 안 되는지와 대신 할 수 있는 일을 문장으로 적습니다.'),
    Canvas({ label: 'U-15 · 주문 상세 · 배송중 — 배송 조회 · 배송지 변경 불가' }, PcDetail(D2)),
    Canvas({ label: 'U-15 · 나눠 보낸 주문 — 한 품목은 배송중, 한 품목은 발송 지연 안내' }, PcDetail(D2B)),
    CanvasRow(MDetail('U-15 모바일 · 배송중', D2)),
);

const D3 = {
    no: '20261103-000052', at: '2026-11-03 13:27',
    items: [{ status: '배송완료', msg: '11월 5일(목) 배송완료 · <b>11월 12일(목)에 자동으로 구매확정</b>됩니다. 반품·교환은 그 전까지 신청해 주세요.', opt: O1, qty: 2, price: '98,000원(예시)', btns: [B('구매확정', 'primary'), B('반품 신청'), B('교환 신청'), B('배송 조회')], hint: '구매확정 뒤 리뷰를 쓸 수 있습니다' }],
    ship: { rows: ADDR.concat([['받은 날', '2026-11-05 15:42 · 문 앞 배송 완료']]) },
    pay: {
        rows: [['상품 금액', '98,000원'], ['배송비', '0원', '5만원 이상 무료배송(예시)']],
        total: ['총 결제 금액', '98,000원'], note: '구매확정하면 980원이 적립됩니다',
        method: [['결제 수단', '신용카드'], ['카드', '신한카드 4518-****-****-1234'], ['할부', '일시불'], ['결제 일시', '2026-11-03 13:27']],
    },
    bottom: [Btn('반품·교환 신청'), Btn('구매확정', 'primary')],
};

const itemFixed = Item({ status: '구매확정', msg: '11월 11일 구매확정 · 적립금 980원 적립 · 리뷰는 2027년 2월 9일까지 쓸 수 있습니다.', opt: O1, qty: 2, price: '98,000원(예시)', btns: [B('리뷰 쓰기', 'primary'), B('재구매'), B('배송 조회')], hint: '포토 리뷰를 쓰면 500원 적립' });
const itemFixedOff = Item({ status: '구매확정', msg: '11월 11일 구매확정', opt: O1, qty: 2, price: '98,000원(예시)', btns: [B('재구매'), B('배송 조회')] });
const itemLate = Item({ status: '구매확정', msg: '11월 12일 자동 구매확정 · 반품·교환 신청 기간이 지났습니다. 상품에 문제가 있다면 1:1 문의로 알려 주세요.', opt: O1, qty: 2, price: '98,000원(예시)', btns: [B('리뷰 쓰기', 'primary'), B('재구매'), B('1:1 문의')] });

const state3 = StateBlock({ idx: 3, title: '배송완료(구매확정·반품·교환·리뷰)', note: '택배사가 배송완료를 알려 온 뒤. 자동 구매확정일(배송완료 7일 뒤, 관리자 설정)까지가 반품·교환 신청 기간입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '배송완료는 버튼이 가장 많은 단계입니다. 가장 바라는 행동(구매확정)만 진하게, 나머지는 선 버튼으로 둡니다. 구매확정을 누르면 되돌릴 수 없으므로 확인 팝업에서 "반품·교환 불가"와 받게 될 적립금을 함께 알립니다. 확정 뒤에는 같은 자리가 리뷰 쓰기 · 재구매로 바뀝니다.'),
    Anno({ warn: true, title: '기능을 끈 몰 · 기간이 지난 주문' }, '리뷰 기능을 끈 몰은 리뷰 쓰기 버튼과 리뷰 문구가 없고, 적립금을 끈 몰은 적립 문구가 없습니다. 자동 구매확정된 주문은 반품·교환 버튼이 없으므로 대신 1:1 문의 버튼을 둡니다(불량은 기간이 지나도 접수받아야 하므로).'),
    Canvas({ label: 'U-15 · 주문 상세 · 배송완료 — 구매확정 · 반품 신청 · 교환 신청 · 배송 조회' }, PcDetail(D3)),
    Canvas({ label: 'U-15 · 구매확정 버튼 → 확인 팝업' }, Overlay({ bg: PcDetail(D3), h: 460 },
        Confirm({ w: 420, title: '구매를 확정할까요?', desc: `${SHOP.productShort} · ${O1} 2개<br>구매확정 뒤에는 <b>반품·교환을 신청할 수 없습니다.</b><br>확정하면 적립금 980원이 바로 적립되고 리뷰를 쓸 수 있습니다.`, ok: '구매확정' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '구매확정 뒤 품목 줄 — 리뷰 쓰기 · 재구매', right: '주문 상품 칸만', pad: 20 }, `<div style="width:620px">${Box({ title: '주문 상품', sub: '품목 1개' }, itemFixed)}</div>`),
        Canvas({ size: 'auto', label: '리뷰 · 적립금을 끈 몰의 구매확정 품목 줄', right: '주문 상품 칸만', pad: 20 }, `<div style="width:560px">${Box({ title: '주문 상품', sub: '품목 1개' }, itemFixedOff)}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '자동 구매확정되어 반품·교환 기간이 지난 품목 줄', right: '주문 상품 칸만', pad: 20 }, `<div style="width:620px">${Box({ title: '주문 상품', sub: '품목 1개' }, itemLate)}</div>`),
        Canvas({ size: 'auto', label: '구매확정 완료', right: '토스트만', pad: 20 }, Toast('구매확정했습니다. 적립금 980원이 적립되었습니다.', { action: '리뷰 쓰기' })),
    ),
    CanvasRow(
        MDetail('U-15 모바일 · 배송완료 — 아래 고정 버튼 2개로 줄임', D3),
        Canvas({ size: 'mobile', label: 'U-15 모바일 · 반품·교환 신청 → 무엇을 신청할지 고르는 시트' }, Overlay({ bg: MobilePage({ title: '주문 상세', tab: false }, `<div class="u15-m">${Head(D3)}${Items(D3.items, ' ')}</div>`), align: 'bottom', h: 760 },
            BottomSheet({ title: '무엇을 신청할까요?' },
                `<div class="u15-pick">${Icon('undo')}<div><b>반품 신청</b><span>상품을 돌려보내고 환불받습니다</span></div>${Icon('angle-right-min')}</div>`,
                `<div class="u15-pick">${Icon('exchange')}<div><b>교환 신청</b><span>같은 상품의 다른 구성이나 새 상품으로 바꿉니다</span></div>${Icon('angle-right-min')}</div>`,
                Note('<span>11월 12일(목)까지 신청할 수 있습니다. 단순 변심은 왕복 배송비 6,000원이 듭니다.</span>')))),
    ),
);

const D4 = {
    no: '20261106-000075', at: '2026-11-06 11:03', itemSub: '품목 2개 중 1개 취소',
    items: [
        { status: '취소완료', msg: '11월 6일 14:20 취소완료 · <b>환불 93,000원</b> · 카카오페이 결제 취소', opt: O2, price: '<s>93,000원(예시)</s>', btns: [B('취소 상세'), B('재구매')] },
        { status: '배송준비', msg: '상품을 포장하고 있습니다. 11월 12일(목)까지 발송할 예정입니다.', opt: O1, price: '49,000원(예시)', btns: [B('취소 요청')], hint: '판매자가 확인한 뒤 취소됩니다' },
    ],
    ship: { note: '상품 준비가 시작되어 배송지를 바꿀 수 없습니다. 급하면 1:1 문의로 알려 주세요.' },
    under: Box({ title: '환불 내역', sub: '1건' },
        Table({ dense: true, cols: [{ t: '환불 일시', w: 120 }, '품목', { t: '환불 금액', w: 100, align: 'right' }, { t: '환불 수단', w: 150 }, { t: '상태', w: 90 }],
            rows: [['2026-11-06 14:20', `${O2} 1개`, '90,000원<small>배송비 3,000원 차감</small>', '카카오페이 결제 취소', Badge('환불완료', 'check')]] }),
        gap(8) + Text('카카오페이 머니는 바로, 카카오페이에 연결한 카드는 카드사 반영까지 영업일 3~5일이 걸립니다.', { sm: true, mute: true })),
    pay: {
        rows: [['상품 금액', '142,000원'], ['배송비', '0원', '5만원 이상 무료배송(예시)'], ['쿠폰 할인', '- 3,000원', '첫 구매 감사 쿠폰'], ['적립금 사용', '- 1,000원'], ['처음 결제한 금액', '138,000원'], ['취소 환불', '- 90,000원', `${O2} 1개 93,000원 − 배송비 3,000원 · 11-06`]],
        total: ['남은 결제 금액', '48,000원'], note: '남은 상품 금액 49,000원이 무료배송 기준(5만원)에 못 미쳐 배송비 3,000원을 빼고 환불했습니다. 쿠폰 조건(3만원 이상)은 지켜 할인은 그대로입니다',
        method: [['결제 수단', '카카오페이'], ['결제 일시', '2026-11-06 11:03'], ['부분 취소', '2026-11-06 14:20']],
        receipt: [Btn('영수증', { size: 'sm', icon: 'receipt' })],
    },
    bottom: [Btn('1:1 문의'), Btn('취소 요청')],
};

const state4 = StateBlock({ idx: 4, title: '부분 취소된 주문', note: '한 주문에 품목이 둘이고 하나만 취소된 주문. 품목 줄마다 상태가 다르고, 결제 정보에 처음 결제 · 환불 · 남은 금액이 나뉘어 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '부분 취소 뒤 고객이 가장 헷갈리는 것은 "그래서 얼마가 환불됐고 지금 얼마를 낸 건가"입니다. 결제 정보를 처음 결제한 금액 → 취소 환불 → 남은 결제 금액 순서로 한 칸에 적고, 환불마다 일시 · 금액 · 수단 · 상태를 환불 내역 표에 한 줄씩 남깁니다. 취소된 품목은 금액에 취소선을 긋습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 — 환불 금액 계산' }, '일부만 취소해서 남은 금액이 쿠폰 최소 주문금액이나 무료배송 기준 아래로 내려가면, 깨진 조건만큼(쿠폰 할인액 · 배송비)을 환불 금액에서 빼고 그 이유를 줄로 보여 줍니다. 쓴 쿠폰은 조건이 깨졌을 때만 돌려주고, 적립금은 전체 취소일 때 돌려줍니다. 아래 두 번째 그림이 그 경우입니다.'),
    Canvas({ label: 'U-15 · 주문 상세 · 부분 취소 — 품목별 상태 · 환불 내역 · 남은 결제 금액' }, PcDetail(D4)),
    CanvasRow(
        Canvas({ size: 'auto', label: '다른 경우 · 남은 금액이 무료배송 · 쿠폰 조건 아래로 내려간 부분 취소', right: '결제 정보 칸만', pad: 20 },
            `<div style="width:320px">${PriceSummary({ title: '결제 정보', rows: [['상품 금액', '67,000원'], ['배송비', '0원', '5만원 이상 무료배송(예시)'], ['쿠폰 할인', '- 3,000원', '첫 구매 감사 쿠폰'], ['처음 결제한 금액', '64,000원'], ['취소한 상품 금액', '- 49,000원', `${O1} 1개`], ['배송비 다시 계산', '+ 3,000원', '남은 18,000원 · 3만원 미만'], ['쿠폰 할인 취소', '+ 3,000원', '3만원 이상 조건이 깨져 쿠폰을 돌려드림'], ['실제 환불 금액', '43,000원']], total: ['남은 결제 금액', '21,000원'], note: '다른 업종 예시(1만 8천원짜리 추가 상품이 있는 몰). 취소 전에 U-16 신청 화면에서 같은 계산을 먼저 보여 줍니다' })}</div>`),
        MDetail('U-15 모바일 · 부분 취소', D4),
    ),
);

const acctBox = (o = {}) => `
<div class="u15-acct">
  <div class="tt">${Icon('alarm-o')}입금을 기다리고 있습니다 ${Badge('남은 시간 1일 14시간', 'warn')}</div>
  ${Text('아래 계좌로 <b>11월 12일(목) 23:59까지</b> 입금해 주세요. 입금이 확인되면 알림톡으로 알려 드리고 결제완료로 바뀝니다. 기한이 지나면 주문이 자동으로 취소됩니다.', { sm: true })}
  <div class="no">국민은행 4301-****-****-12 ${Btn('계좌번호 복사', { size: 'sm', icon: 'documents-o' })}</div>
  ${KV([['예금주', '이너에라'], ['입금할 금액', '<b>52,000원</b> (1원이라도 다르면 입금되지 않습니다)'], ['입금 기한', '2026-11-12(목) 23:59']], { wide: !o.m })}
</div>`;

const D5 = {
    no: '20261110-000119', at: '2026-11-10 09:58', noReceipt: true,
    top: acctBox(),
    items: [{ status: '입금대기', msg: '입금 전입니다. 입금이 확인되면 상품 준비를 시작합니다.', opt: O1, price: '49,000원(예시)', btns: [B('입금 계좌 보기', 'primary'), B('주문 취소')], hint: '입금 전이라 환불할 금액은 없습니다' }],
    ship: { edit: true, note: '입금 전에는 배송지를 바꿀 수 있습니다.' },
    pay: {
        rows: [['상품 금액', '49,000원'], ['배송비', '3,000원', '5만원 이상 무료배송(예시)']],
        total: ['입금할 금액', '52,000원'], note: '입금 전 — 아직 결제되지 않았습니다',
        method: [['결제 수단', '가상계좌(무통장 입금)'], ['현금영수증', '소득공제용 · 010-****-1234 (입금 확인 뒤 자동 발급)']],
        receipt: [Btn('현금영수증 정보 변경', { size: 'sm' })],
    },
    bottom: [Btn('주문 취소'), Btn('계좌번호 복사', 'primary')],
};
const D5M = { ...D5, top: acctBox({ m: true }) };

const D5X = {
    ...D5, top: Note('<span>입금 기한(11월 12일 23:59)이 지나 주문이 자동으로 취소되었습니다. 발급된 계좌로는 더 이상 입금할 수 없습니다. 필요하시면 다시 주문해 주세요.</span>', { warn: true }),
    items: [{ status: '취소완료', msg: '11월 13일 00:00 자동 취소 · 입금된 금액이 없어 환불도 없습니다.', opt: O1, price: '<s>49,000원(예시)</s>', btns: [B('재구매', 'primary')] }],
    ship: {},
    pay: { rows: [['상품 금액', '49,000원'], ['배송비', '3,000원']], total: ['결제한 금액', '0원'], note: '입금 전에 취소된 주문입니다', method: [['결제 수단', '가상계좌(무통장 입금) · 입금 없음']], receipt: false },
};

const state5 = StateBlock({ idx: 5, title: '가상계좌 입금대기(계좌 다시 보기)', note: '가상계좌로 주문하고 아직 입금하지 않은 주문. 주문 완료 화면을 닫은 뒤 계좌를 다시 찾으러 오는 화면입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '입금대기 주문에서 고객이 찾는 것은 계좌번호 · 금액 · 기한 세 가지입니다. 그래서 다른 정보보다 위에 굵은 테두리 칸으로 올리고 복사 버튼을 붙입니다. 금액이 다르면 입금이 안 된다는 점과 남은 시간을 같이 적어 "입금했는데 왜 안 바뀌나요" 문의를 줄입니다. 기한(관리자 설정 > 결제, 기본 주문 뒤 2일)은 몰마다 다릅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '입금 전에는 영수증 버튼이 비활성(영수증이 아직 없음)이고, 주문 취소는 환불 없이 바로 끝납니다. 기한이 지나 자동 취소된 주문은 계좌 칸이 사라지고 왜 취소됐는지와 다시 주문하는 길만 남습니다. 무통장 계좌(고정 계좌)를 쓰는 몰은 계좌번호가 가려지지 않고 "입금자 이름"이 함께 나옵니다.'),
    Canvas({ label: 'U-15 · 주문 상세 · 가상계좌 입금대기 — 계좌 · 금액 · 기한이 맨 위' }, PcDetail(D5)),
    CanvasRow(
        Canvas({ size: 'auto', label: '입금 계좌 보기 버튼 → 팝업 (주문 목록에서 눌러도 같은 팝업)', right: '팝업만', pad: 20 },
            Modal({ title: '입금 계좌', w: 420, foot: [Btn('닫기'), Btn('계좌번호 복사', { kind: 'primary', icon: 'documents-o' })] },
                KV([['은행', '국민은행'], ['계좌번호', '<b>4301-****-****-12</b>'], ['예금주', '이너에라'], ['입금할 금액', '<b>52,000원</b>'], ['입금 기한', '2026-11-12(목) 23:59 · 남은 시간 1일 14시간']]),
                gap(12), Note('<span>금액이 1원이라도 다르면 입금되지 않습니다. 입금이 확인되면 알림톡으로 알려 드립니다.</span>'))),
        `<div>${Canvas({ size: 'auto', label: '계좌번호 복사', right: '토스트만', pad: 20 }, Toast('계좌번호를 복사했습니다.'))}${gap(20)}${Canvas({ size: 'auto', label: '입금대기 · 주문 취소 → 확인 팝업', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '이 주문을 취소할까요?', desc: '아직 입금 전이라 환불할 금액은 없습니다. 발급된 입금 계좌는 더 이상 쓸 수 없습니다.', ok: '주문 취소', danger: true }))}</div>`,
    ),
    Canvas({ label: 'U-15 · 입금 기한이 지나 자동 취소된 주문' }, PcDetail(D5X)),
    CanvasRow(MDetail('U-15 모바일 · 가상계좌 입금대기 — 아래 고정 버튼: 주문 취소 · 계좌번호 복사', D5M)),
);

const SELLER = `<hr>${KV([['판매자', `${SHOP.name} ${SHOP.nameEn}`], ['대표', SHOP.ceo], ['사업자번호', SHOP.bizNo], ['주소', SHOP.addr]])}`;

const slipCard = `<div class="u15-slip"><h4>신용카드 매출전표</h4><div class="sub">승인</div>
${KV([['카드', '신한카드 4518-****-****-1234'], ['거래 일시', '2026-11-11 09:42:17'], ['승인번호', '30458812'], ['할부', '일시불'], ['상품', `${SHOP.productShort}`], ['주문번호', '20261111-000128']])}
<hr>${KV([['공급가액', '84,545원'], ['부가세', '8,455원']])}<div class="tot"><span>합계</span><span>93,000원</span></div>${SELLER}</div>`;

const slipCash = `<div class="u15-slip"><h4>현금영수증</h4><div class="sub">소득공제용 · 승인</div>
${KV([['발급 번호', '010-****-1234'], ['거래 일시', '2026-09-12 16:05:40'], ['승인번호', '112233445'], ['거래 구분', '가상계좌 입금'], ['상품', SHOP.productShort], ['주문번호', '20260912-000233']])}
<hr>${KV([['공급가액', '44,545원'], ['부가세', '4,455원']])}<div class="tot"><span>합계</span><span>49,000원</span></div>${SELLER}</div>`;

const pick = (icon, t, d, off) => `<div class="u15-pick${off ? ' off' : ''}">${Icon(icon)}<div><b>${t}</b><span>${d}</span></div>${off ? '' : Icon('angle-right-min')}</div>`;

const state6 = StateBlock({ idx: 6, title: '영수증', note: '주문 상세의 영수증 · 카드 전표 버튼을 누르면 뜨는 팝업. 결제 수단에 따라 받을 수 있는 증빙이 다릅니다.' },
    Anno({ title: '결제 수단별 분기' }, '신용카드 = 카드 매출전표 / 가상계좌 · 실시간 계좌이체 = 현금영수증(주문할 때 신청했으면 발급된 영수증, 안 했으면 여기서 신청) / 카카오페이 · 네이버페이 · 토스페이 = 그 간편결제 앱의 결제 내역으로 안내(카드로 냈는지 머니로 냈는지 우리 몰은 알 수 없음) / 모든 수단 = 거래명세서(회사 제출용, 사업자 정보는 관리자 설정 > 쇼핑몰 정보에서 자동). 전표 내용은 결제 대행사가 준 값을 그대로 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '부분 취소한 주문은 승인 전표와 취소 전표가 따로 있으므로 목록으로 보여 줍니다. 현금영수증은 구매확정 뒤 신청 기한(결제일부터 영업일 기준 관리자 설정값, 예시 30일)이 지나면 신청 버튼 대신 "1:1 문의" 안내가 나옵니다. 입금 전 주문은 버튼이 비활성입니다.'),
    Canvas({ label: 'U-15 · 영수증 버튼 → 증빙 고르기 팝업 (신용카드 결제 주문)' }, Overlay({ bg: PcDetail(D1), h: 520 },
        Modal({ title: '영수증 · 증빙', w: 440, foot: [Btn('닫기')] },
            pick('credit-card', '카드 매출전표', '신한카드 · 93,000원 · 승인 2026-11-11'),
            pick('file-text-o', '거래명세서', '회사 제출용 · 인쇄하거나 PDF로 저장'),
            pick('money', '현금영수증', '카드로 결제한 주문은 발급 대상이 아닙니다', true)))),
    CanvasRow(
        Canvas({ size: 'auto', label: '카드 매출전표 → 팝업', right: '팝업만', pad: 20 },
            Modal({ title: '카드 매출전표', w: 400, foot: [Btn('인쇄', { icon: 'print' }), Btn('닫기', 'primary')] }, slipCard)),
        Canvas({ size: 'auto', label: '현금영수증(발급됨) → 팝업 · 가상계좌 결제 주문', right: '팝업만', pad: 20 },
            Modal({ title: '현금영수증', w: 400, foot: [Btn('인쇄', { icon: 'print' }), Btn('닫기', 'primary')] }, slipCash)),
        Canvas({ size: 'auto', label: '부분 취소한 주문의 영수증 목록 (승인 · 취소)', right: '팝업만', pad: 20 },
            Modal({ title: '영수증 · 증빙', w: 440, foot: [Btn('닫기')] },
                pick('money', '결제 내역 · 승인', '카카오페이 · 138,000원 · 2026-11-06 11:03'),
                pick('undo', '결제 내역 · 부분 취소', '카카오페이 · - 93,000원 · 2026-11-06 14:20'),
                pick('file-text-o', '거래명세서', '남은 결제 금액 45,000원 기준'),
                Note('<span>카카오페이로 결제한 주문의 카드 전표 · 현금영수증은 카카오페이 앱 > 결제 내역에서 확인할 수 있습니다.</span>'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '현금영수증을 신청하지 않은 계좌이체 주문 → 신청 폼 (소득공제용)', right: '팝업만', pad: 20 },
            Modal({ title: '현금영수증 신청', w: 420, foot: [Btn('취소'), Btn('신청', 'primary')] },
                Field({ label: '용도', required: true }, Flex({ gap: 16 }, Radio('소득공제용(개인)', { on: true }), Radio('지출증빙용(사업자)'))),
                Field({ label: '휴대폰 번호', required: true, help: '국세청에 등록한 번호를 입력해 주세요. 현금영수증 카드 번호도 쓸 수 있습니다.' }, Input({ value: '010-****-1234', w: '100%' })),
                KV([['주문번호', '20260815-000412'], ['금액', '93,000원']]))),
        Canvas({ size: 'auto', label: '지출증빙용을 고르면 입력칸이 사업자등록번호로 바뀜 · 입력 오류', right: '팝업만', pad: 20 },
            Modal({ title: '현금영수증 신청', w: 420, foot: [Btn('취소'), Btn('신청', { kind: 'primary', disabled: true })] },
                Field({ label: '용도', required: true }, Flex({ gap: 16 }, Radio('소득공제용(개인)'), Radio('지출증빙용(사업자)', { on: true }))),
                Field({ label: '사업자등록번호', required: true, error: '사업자등록번호 10자리를 숫자로 입력해 주세요.' }, Input({ value: '384-17-028', w: '100%', error: true })),
                KV([['주문번호', '20260815-000412'], ['금액', '93,000원']]))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '거래명세서 → 팝업', right: '팝업만', pad: 20 },
            Modal({ title: '거래명세서', w: 560, foot: [Btn('PDF로 저장', { icon: 'download' }), Btn('인쇄', { icon: 'print' }), Btn('닫기', 'primary')] },
                Grid(2, Box({ flat: true, title: '공급자' }, KV([['상호', `${SHOP.name} ${SHOP.nameEn}`], ['대표', SHOP.ceo], ['사업자번호', SHOP.bizNo], ['주소', SHOP.addr]])), Box({ flat: true, title: '공급받는 자' }, KV([['이름', '김민지'], ['주문번호', '20261111-000128'], ['거래일', '2026-11-11']]))),
                Table({ dense: true, cols: ['품목', { t: '수량', w: 50, align: 'center' }, { t: '공급가액', w: 90, align: 'right' }, { t: '부가세', w: 80, align: 'right' }, { t: '합계', w: 90, align: 'right' }],
                    rows: [[`${SHOP.productShort}<small>${O2}</small>`, 1, '84,545원', '8,455원', '93,000원']], foot: ['합계', '', '', '', '93,000원'] }))),
        `<div>${Canvas({ size: 'auto', label: '현금영수증 신청 완료', right: '토스트만', pad: 20 }, Toast('현금영수증을 신청했습니다. 국세청 반영까지 1~2일 걸립니다.'))}${gap(20)}${Canvas({ size: 'auto', label: '신청 기한이 지난 주문', right: '팝업 안내만', pad: 20 }, `<div style="width:380px">${Note('<span>결제일부터 30일이 지나 여기서는 현금영수증을 신청할 수 없습니다. <u>1:1 문의</u>로 요청해 주세요.</span>', { warn: true })}</div>`)}</div>`,
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-15 모바일 · 영수증 → 바텀시트' }, Overlay({ bg: MobilePage({ title: '주문 상세', tab: false }, `<div class="u15-m">${Head(D1)}${Items(D1.items, ' ')}</div>`), align: 'bottom', h: 720 },
            BottomSheet({ title: '영수증 · 증빙' },
                pick('credit-card', '카드 매출전표', '신한카드 · 93,000원'),
                pick('file-text-o', '거래명세서', '회사 제출용'),
                pick('money', '현금영수증', '카드 결제 주문은 발급 대상이 아닙니다', true)))),
        Canvas({ size: 'mobile', label: 'U-15 모바일 · 카드 매출전표 — 전체 화면' }, MobilePage({ title: '카드 매출전표', tab: false, bottom: [Btn('이미지로 저장', { icon: 'download' }), Btn('닫기', 'primary')] },
            `<div style="display:flex;justify-content:center">${slipCard}</div>`)),
    ),
);

export default function U15() {
    return [STYLE, state1, state2, state3, state4, state5, state6].join('');
}
