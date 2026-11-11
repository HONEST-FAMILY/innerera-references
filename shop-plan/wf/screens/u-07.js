import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Check, Select, Qty, Thumb, Icon, Overlay, Modal, Confirm, Toast, MobilePage, UserPage,
    Empty, Stepper, PriceSummary, ProductCard, ProductGrid, Note, SHOP,
} from '../lib/blocks.js';

const CSS = `<style>
.u07-wrap { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 32px; align-items: start; }
.u07-free { border: 1px solid var(--line); border-radius: 6px; padding: 14px 16px; margin-bottom: 16px; font-size: 13.5px; }
.u07-free .tr { position: relative; height: 8px; border-radius: 4px; background: var(--fill); margin-top: 10px; overflow: hidden; }
.u07-free .tr span { display: block; height: 100%; background: var(--dark); }
.u07-free .sc { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--mute); margin-top: 4px; }
.u07-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--dark); font-size: 13.5px; }
.u07-head .r { display: flex; gap: 6px; }
.u07-grp { font-size: 13.5px; font-weight: 800; margin: 28px 0 0; padding: 10px 0; border-bottom: 1px solid var(--dark); display: flex; justify-content: space-between; align-items: center; }
.u07-item { display: flex; gap: 14px; align-items: flex-start; padding: 18px 0; border-bottom: 1px solid var(--line2); font-size: 13.5px; }
.u07-item .ck { padding-top: 30px; }
.u07-item .inf { flex: 1; min-width: 0; }
.u07-item .inf b { display: block; }
.u07-item .inf .op { color: var(--ink2); font-size: 12.5px; margin: 3px 0 10px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.u07-item .ctl { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.u07-item .pv { width: 130px; text-align: right; flex: none; }
.u07-item .pv b { font-size: 15px; }
.u07-item .pv s { display: block; color: var(--mute); font-size: 12px; }
.u07-item .x { color: var(--mute); font-size: 18px; flex: none; }
.u07-item.off .inf b, .u07-item.off .pv { color: var(--mute); }
.u07-msg { margin: 8px 0 0; font-size: 12.5px; font-weight: 700; display: flex; gap: 4px; align-items: center; }
.u07-item.m { gap: 10px; padding: 14px 0; }
.u07-item.m .ck { padding-top: 22px; }
.u07-item.m .pv { width: auto; }
.u07-guest { display: flex; align-items: center; gap: 10px; background: var(--box); border: 1px solid var(--line2); border-radius: 6px; padding: 10px 14px; font-size: 13px; margin-bottom: 16px; }
.u07-mo label { display: block; font-size: 13px; font-weight: 700; margin: 0 0 6px; }
.u07-mo .wf-input, .u07-mo .wf-select-open { width: 100% !important; }
.u07-mo .row { margin-bottom: 14px; }
.u07-diff { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--dark); padding-top: 12px; margin-top: 4px; font-size: 13.5px; }
.u07-diff b { font-size: 18px; }
</style>`;

const P = SHOP.productShort;

const Free = (o) => {
    if (o.kind === 'done') return `<div class="u07-free">${Icon('truck')} <b>무료배송</b> 조건을 채웠습니다. 지금 주문하면 배송비가 0원입니다.<div class="tr"><span style="width:100%"></span></div><div class="sc"><span>0원</span><span>${o.goal} 이상 무료배송</span></div></div>`;
    if (o.kind === 'free') return `<div class="u07-free">${Icon('truck')} 이 상품은 금액과 상관없이 <b>배송비 무료</b>입니다.</div>`;
    if (o.kind === 'fixed') return `<div class="u07-free">${Icon('truck')} 배송비는 주문 금액과 상관없이 <b>3,000원</b>입니다.</div>`;
    return `<div class="u07-free">${Icon('truck')} <b>${o.left}</b> 더 담으면 <b>배송비가 무료</b>입니다. <u style="color:var(--ink2);margin-left:6px">상품 더 보기</u><div class="tr"><span style="width:${o.pct}%"></span></div><div class="sc"><span>지금 ${o.now}</span><span>${o.goal} 이상 무료배송</span></div></div>`;
};

const Item = (o) => `<div class="u07-item${o.off ? ' off' : ''}${o.m ? ' m' : ''}">
<span class="ck">${o.off ? Check('', { disabled: true }) : Check('', { on: o.on !== false })}</span>${Thumb(o.m ? 64 : 88)}
<div class="inf"><b>${o.name}</b><div class="op">${o.opt ? `<span>${o.opt}</span>` : ''}${o.badge || ''}</div>
<div class="ctl">${o.off && !o.qtyFix ? '' : Qty(o.qty || 1, { disabled: o.off && !o.qtyFix })}${o.opt && !o.noChange ? Btn('옵션 변경', { size: 'sm' }) : ''}${o.extra || ''}</div>${o.msg ? `<p class="u07-msg">${Icon('error-o')}${o.msg}</p>` : ''}${o.m ? `<div class="pv" style="text-align:left;margin-top:8px"><b>${o.price}</b></div>` : ''}</div>
${o.m ? '' : `<div class="pv">${o.orig ? `<s>${o.orig}</s>` : ''}<b>${o.price}</b></div>`}<span class="x">${Icon('close')}</span></div>`;

const Head = (sel, total, o = {}) => `<div class="u07-head">${Check(`전체 선택 (${sel} / ${total})`, { on: sel === total && total > 0, part: sel > 0 && sel < total })}<span class="r">${Btn('선택 삭제', { size: 'sm', disabled: sel === 0 })}${o.sold ? Btn('구매 불가 상품 삭제', { size: 'sm' }) : ''}</span></div>`;

const Summary = (o) => PriceSummary({
    title: '결제 예정 금액',
    rows: [[`상품 금액 (${o.n}개)`, o.goods], ['배송비', o.ship, o.shipNote], ...(o.rows || [])],
    total: ['합계', o.total],
    note: o.note || '쿠폰 · 적립금은 주문서에서 적용합니다.',
    action: [Btn(o.btn || `선택 상품 주문하기 (${o.n}개)`, { kind: 'primary', size: 'lg', block: true, disabled: o.disabled }), Btn('쇼핑 계속하기', { block: true })],
});

const Guest = `<div class="u07-guest">${Icon('info-o')}<span>비회원으로 담은 상품입니다. <b>로그인하면 쿠폰 · 적립금</b>을 쓸 수 있고, 담은 상품은 로그인해도 그대로 남습니다.</span><span style="margin-left:auto;display:flex;gap:6px">${Btn('로그인', { size: 'sm', kind: 'primary' })}</span></div>`;

const Page = (o, left, right) => UserPage({ loggedIn: o.loggedIn, cart: o.cart, title: '장바구니', band: o.band }, CSS, Stepper(['장바구니', '주문서 · 결제', '주문 완료'], 0), `<div class="u07-wrap"><div>${left.join('')}</div><div>${right}</div></div>`);

const INNER1 = { name: P, opt: '1박스(14일분)', qty: 1, price: '49,000원(예시)' };
const INNER2 = { name: P, opt: '2박스(28일분)', qty: 1, price: '93,000원(예시)' };

const state1 = StateBlock({ idx: 1, title: '기본(배송비 무료까지 남은 금액)', note: '주소 /cart. 담은 상품을 확인하고 수량 · 옵션을 고친 뒤 주문서로 넘어갑니다. 비회원도 그대로 쓸 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '맨 위 막대는 상품에 연결된 배송비 템플릿(설정 > 배송 A-92)이 조건부 무료일 때만 나옵니다. 체크한 상품 금액 기준으로 남은 금액을 계산하고, 수량을 바꾸거나 체크를 풀면 바로 다시 계산합니다. 무료 템플릿이면 무료 안내 한 줄, 고정 배송비 템플릿이면 금액 안내 한 줄로 바뀌고 막대는 없습니다. 배송비 템플릿이 다른 상품이 섞이면 템플릿별로 묶어 따로 계산합니다.'),
    Anno({ title: '비회원 장바구니 · 초기값' }, '비회원이 담은 상품은 이 기기에 30일 동안 남습니다. 로그인하면 회원 장바구니와 합쳐지고(같은 품목은 수량을 더함, 최대 구매 수량까지만) 합쳤다는 안내가 한 번 뜹니다. 들어왔을 때 초기값은 살 수 있는 상품 전체 체크입니다. 회원 장바구니는 90일 동안 보관합니다. 이너에라의 배송비와 무료배송 기준 금액은 고객 확인이 필요한 값이라 기획서 예시(3,000원 · 50,000원 이상 무료)로 그렸습니다. 쿠폰 · 적립금은 여기서 받지 않고 주문서에서 적용합니다(기능을 끈 몰은 안내 문구가 사라짐).'),
    Canvas({ label: 'U-07 · 장바구니 기본 · 이너에라 · 로그인 · 2가지 중 1박스만 체크 · 무료배송까지 1,000원 남음(배송비 3,000원 · 5만원 이상 무료는 예시 — 고객 확인 값)' }, Page({ loggedIn: true, cart: 2 }, [
        Free({ left: '1,000원', pct: 98, now: '49,000원', goal: '50,000원(예시)' }),
        Head(1, 2),
        Item(INNER1), Item({ ...INNER2, on: false }),
        Note('체크한 상품만 금액에 들어가고 주문서로 넘어갑니다. 줄 오른쪽 닫기는 그 상품만 바로 지웁니다(되돌리기 안내 3초). 금액과 무료배송 기준은 예시입니다.'),
    ], Summary({ n: 1, goods: '49,000원(예시)', ship: '+3,000원', shipNote: '50,000원 이상 구매 시 무료(예시)', total: '52,000원(예시)' }))),
    Canvas({ label: 'U-07 · 이너에라 · 비회원 · 2가지 모두 체크 · 무료배송 조건 채움 · 로그인 안내 줄' }, Page({ cart: 2 }, [
        Guest,
        Free({ kind: 'done', goal: '50,000원(예시)' }),
        Head(2, 2),
        Item(INNER1), Item(INNER2),
        Note('금액은 예시입니다(판매가 미확정).'),
    ], Summary({ n: 2, goods: '142,000원(예시)', ship: '0원', shipNote: '무료배송 조건 충족', total: '142,000원(예시)', note: '로그인하면 주문서에서 쿠폰 · 적립금을 쓸 수 있습니다.', btn: '선택 상품 주문하기 (2개)' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '배송비 템플릿이 무료일 때 — 막대 없음', right: '안내 줄만', pad: 20 }, `${CSS}<div style="width:560px">${Free({ kind: 'free' })}</div>`),
        Canvas({ size: 'auto', label: '배송비 템플릿이 고정 배송비일 때 — 막대 없음', right: '안내 줄만', pad: 20 }, `${CSS}<div style="width:560px">${Free({ kind: 'fixed' })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '수량 더하기를 최대에서 누름 → 줄 아래 안내', right: '상품 줄만', pad: 20 }, `${CSS}<div style="width:760px">${Item({ ...INNER1, qty: 10, price: '490,000원(예시)', msg: '이 상품은 한 번에 최대 10개까지 구매할 수 있습니다.' })}</div>`),
        Canvas({ size: 'auto', label: '2가지 체크 → 선택 삭제 누름 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '선택한 상품 2개를 장바구니에서 삭제할까요?', desc: '삭제한 상품은 다시 담아야 합니다.', ok: '2개 삭제', danger: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '아무것도 체크하지 않음 → 주문 버튼 비활성 + 안내', right: '금액 영역만', pad: 20 }, `<div style="width:340px">${Summary({ n: 0, goods: '0원', ship: '0원', total: '0원', disabled: true, btn: '주문할 상품을 선택해 주세요', note: '주문할 상품을 하나 이상 체크해 주세요.' })}</div>`),
        Canvas({ size: 'auto', label: '비회원으로 담은 뒤 로그인함 → 회원 장바구니와 합쳐짐 안내(3초)', right: '안내만', pad: 20 }, Toast('비회원으로 담은 상품 1개를 장바구니에 합쳤습니다. 같은 상품은 수량을 더했습니다.')),
        Canvas({ size: 'auto', label: '줄 오른쪽 닫기로 한 개 지움 → 되돌리기 안내(3초)', right: '안내만', pad: 20 }, Toast('장바구니에서 삭제했습니다.', { action: '되돌리기' })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-07 · 모바일 · 탭바 장바구니 · 아래 고정 주문 버튼' }, MobilePage({ title: '장바구니', tab: '장바구니', right: '', bottom: [`<div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px"><span>상품 142,000원 + 배송비 0원</span><b style="font-size:15px">142,000원(예시)</b></div>${Btn('선택 상품 주문하기 (2개)', { kind: 'primary', block: true })}</div>`] }, CSS,
            Free({ kind: 'done', goal: '50,000원(예시)' }),
            Head(2, 2),
            Item({ ...INNER1, m: true }), Item({ ...INNER2, m: true }),
        )),
        Canvas({ size: 'mobile', label: 'U-07 · 모바일 · 무료배송까지 1,000원 남음 · 1박스만 체크' }, MobilePage({ title: '장바구니', tab: '장바구니', right: '', bottom: [`<div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px"><span>상품 49,000원 + 배송비 3,000원</span><b style="font-size:15px">52,000원(예시)</b></div>${Btn('선택 상품 주문하기 (1개)', { kind: 'primary', block: true })}</div>`] }, CSS,
            Free({ left: '1,000원', pct: 98, now: '49,000원', goal: '50,000원(예시)' }),
            Head(1, 2),
            Item({ ...INNER1, m: true }), Item({ ...INNER2, m: true, on: false }),
        )),
    ),
);

const SOLD4 = { name: P, opt: '4박스(56일분)', off: true, price: '176,000원(예시)', badge: Badge('품절', 'strike'), noChange: true, extra: [Btn('다른 구성으로 변경', { size: 'sm' }), Btn('재입고 알림 신청', { size: 'sm', icon: 'bell-o' })].join('') };
const STOPPED = { name: '롱지비티 석류맛 젤리스틱 (이전 패키지)', off: true, price: '-', badge: Badge('판매 종료', 'mute'), extra: `<span style="font-size:12.5px;color:var(--mute)">더 이상 판매하지 않는 상품입니다. 삭제해 주세요.</span>` };
const SHORT = { name: P, opt: '2박스(28일분)', off: true, qtyFix: true, qty: 5, price: '465,000원(예시)', badge: Badge('재고 부족', 'warn'), noChange: true, msg: '남은 수량이 2개입니다. 수량을 2개 이하로 줄이면 주문할 수 있습니다.', extra: Btn('2개로 바꾸기', { size: 'sm', kind: 'primary' }) };

const state2 = StateBlock({ idx: 2, title: '품절·판매중지 상품 포함(구매 불가 표시)', note: '담아 둔 사이 품절되거나 판매가 끝난 상품은 구매할 수 없는 상품 묶음으로 따로 내려가고, 체크할 수 없으며 금액에 들어가지 않습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '살 수 없는 상품을 조용히 지우면 고객은 담은 적이 없다고 느끼고, 섞어 두면 결제 직전에야 막힙니다. 그래서 묶음을 나눠 이유(품절 · 판매 종료 · 재고 부족)를 상품마다 배지로 적고, 이유에 맞는 다음 행동을 줍니다. 품절 = 다른 구성으로 변경 · 재입고 알림 / 재고 부족 = 남은 수량으로 바꾸기 / 판매 종료 = 삭제.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '장바구니를 열 때마다, 그리고 주문하기를 누르는 순간에 한 번 더 재고와 판매 상태를 확인합니다. 그 사이 바뀐 상품이 있으면 주문서로 넘기지 않고 아래 안내 팝업을 띄운 뒤 이 화면에 남습니다. 가격이 바뀐 상품은 살 수 있는 묶음에 두되 가격이 바뀌었다고 줄 아래에 알립니다.'),
    Canvas({ label: 'U-07 · 살 수 있는 상품 1가지 + 구매할 수 없는 상품 3가지(품절 · 재고 부족 · 판매 종료)' }, Page({ loggedIn: true, cart: 4 }, [
        Free({ left: '1,000원', pct: 98, now: '49,000원', goal: '50,000원(예시)' }),
        Head(1, 1, { sold: true }),
        Item({ ...INNER1, msg: '담은 뒤 가격이 52,000원에서 49,000원으로 바뀌었습니다.', orig: '52,000원' }),
        `<div class="u07-grp"><span>구매할 수 없는 상품 3</span><span style="font-weight:500;font-size:12.5px;color:var(--mute)">금액에 포함되지 않습니다</span></div>`,
        Item(SOLD4), Item(SHORT), Item(STOPPED),
        Note('금액은 예시입니다(판매가 미확정).'),
    ], Summary({ n: 1, goods: '49,000원(예시)', ship: '+3,000원', shipNote: '50,000원 이상 구매 시 무료(예시)', total: '52,000원(예시)' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문하기 누르는 순간 체크한 상품이 품절됨 → 주문서로 가지 않고 안내', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '주문할 수 없는 상품이 있습니다', desc: `${P} · 2박스(28일분)이 방금 품절되었습니다.<br>이 상품을 빼고 나머지 1개만 주문할까요?`, foot: [Btn('장바구니로 돌아가기'), Btn('1개만 주문하기', 'primary')] })),
        Canvas({ size: 'auto', label: '살 수 있는 상품이 하나도 없을 때 — 주문 버튼 비활성', right: '금액 영역만', pad: 20 }, `<div style="width:340px">${Summary({ n: 0, goods: '0원', ship: '0원', total: '0원', disabled: true, btn: '주문할 수 있는 상품이 없습니다', note: '품절 상품은 재입고 알림을 신청해 두면 알려 드립니다.' })}</div>`),
        Canvas({ size: 'auto', label: '구매 불가 상품 삭제 누름 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '구매할 수 없는 상품 3개를 삭제할까요?', desc: '품절 상품의 재입고 알림 신청은 그대로 유지됩니다.', ok: '3개 삭제', danger: true })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-07 · 모바일 · 구매할 수 없는 상품 묶음' }, MobilePage({ title: '장바구니', tab: '장바구니', right: '', bottom: [`<div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px"><span>상품 49,000원 + 배송비 3,000원</span><b style="font-size:15px">52,000원(예시)</b></div>${Btn('선택 상품 주문하기 (1개)', { kind: 'primary', block: true })}</div>`] }, CSS,
            Head(1, 1, { sold: true }),
            Item({ ...INNER1, m: true }),
            `<div class="u07-grp" style="margin-top:18px"><span>구매할 수 없는 상품 2</span></div>`,
            Item({ ...SOLD4, m: true, extra: Btn('재입고 알림 신청', { size: 'sm', icon: 'bell-o' }) }),
            Item({ ...STOPPED, m: true, extra: `<span style="font-size:12px;color:var(--mute)">판매가 끝난 상품입니다.</span>` }),
        )),
    ),
);

const REC = [
    { name: SHOP.product, price: SHOP.options[0].price, reviews: 128, imgLabel: '상품 대표 이미지 1000 × 1000' },
];
const REC_OTHER = [
    { name: '시카 수분 크림 50 ml', price: '32,000원', reviews: 356 },
    { name: '데일리 립밤 4 g', price: '12,000원', reviews: 91 },
    { name: '시카 진정 토너 200 ml', price: '18,000원', reviews: 143 },
    { name: '저자극 선크림 50 ml', price: '22,000원', orig: '26,000원', rate: '15%', reviews: 208 },
].map((x) => ({ imgLabel: '상품 대표 이미지 1000 × 1000', ...x }));

const state3 = StateBlock({ idx: 3, title: '비어 있음', note: '담은 상품이 하나도 없을 때. 빈 화면으로 끝내지 않고 다음 행동과 추천 상품을 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '빈 장바구니에서 고객이 할 수 있는 일은 쇼핑을 계속하는 것뿐이므로 버튼을 가운데 크게 둡니다. 추천 상품은 관리자 진열 관리의 추천 영역 상품(없으면 판매 많은 순 4개)이고, 이너에라처럼 상품이 1개인 몰은 그 한 개만 나옵니다. 주문 단계 표시와 금액 영역은 비었을 때 보이지 않습니다.'),
    Anno({ title: '비회원일 때' }, '비회원에게는 로그인하면 전에 담아 둔 상품을 볼 수 있다는 안내와 로그인 버튼을 함께 줍니다(다른 기기에서 담았을 수 있으므로). 비회원 주문 기능과 상관없이 장바구니 자체는 누구나 쓸 수 있습니다.'),
    Canvas({ label: 'U-07 · 비어 있음 · 로그인 상태 · 추천 상품(이너에라는 1개)' }, UserPage({ loggedIn: true, title: '장바구니' }, CSS,
        Empty({ icon: 'cart-o', title: '장바구니가 비어 있습니다', desc: '마음에 드는 상품을 담아 보세요.', action: Btn('쇼핑 계속하기', { kind: 'primary', size: 'lg' }) }),
        `<h3 style="font-size:16px;margin:8px 0 14px">이런 상품은 어떠세요</h3>`,
        ProductGrid(REC.map(ProductCard), 4),
    )),
    Canvas({ label: 'U-07 · 비어 있음 · 비회원 · 로그인 안내 · 추천 상품 4개(다른 업종 예시: 화장품)' }, UserPage({ title: '장바구니' }, CSS,
        Empty({ icon: 'cart-o', title: '장바구니가 비어 있습니다', desc: '로그인하면 전에 담아 둔 상품을 볼 수 있습니다.', action: [Btn('쇼핑 계속하기', { kind: 'primary', size: 'lg' }), Btn('로그인', { size: 'lg' })] }),
        `<h3 style="font-size:16px;margin:8px 0 14px">이런 상품은 어떠세요</h3>`,
        ProductGrid(REC_OTHER.map(ProductCard), 4),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-07 · 모바일 · 비어 있음 · 비회원' }, MobilePage({ title: '장바구니', tab: '장바구니', right: '' },
            Empty({ icon: 'cart-o', title: '장바구니가 비어 있습니다', desc: '로그인하면 전에 담아 둔 상품을 볼 수 있습니다.', action: [Btn('쇼핑 계속하기', 'primary'), Btn('로그인')] }),
            `<h3 style="font-size:14.5px;margin:0 0 10px">이런 상품은 어떠세요</h3>`,
            ProductGrid(REC.map((x) => ProductCard({ ...x, imgLabel: '대표 이미지' })), 2),
        )),
    ),
);

const Mo = (...rows) => `<div class="u07-mo">${rows.join('')}</div>`;
const Row = (label, ctl) => `<div class="row"><label>${label}</label>${ctl}</div>`;
const Cur = (name, opt) => `<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">${Thumb(56)}<div style="font-size:13.5px"><b>${name}</b><br><span style="color:var(--mute)">지금 옵션: ${opt}</span></div></div>`;
const Diff = (label, v) => `<div class="u07-diff"><span>${label}</span><b>${v}</b></div>`;
const innerOpts = (on) => SHOP.options.map((o, i) => ({ t: `${o.name}${i === 2 ? ' (품절)' : ''}`, sub: o.price, on: i === on, disabled: i === 2 }));

const Sets = (on = -1, sold) => `<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px">${SHOP.options.map((o, i) => {
    const off = sold === 'all' || (sold && i === 2);
    return `<div style="border:${i === on ? '2px solid var(--dark)' : '1px solid #b4b4bb'};border-radius:6px;padding:${i === on ? 9 : 10}px;font-size:12.5px;line-height:1.5;${off ? 'background:var(--fill);color:#a2a2aa;text-decoration:line-through' : ''}"><b style="display:block;font-size:13.5px">${o.name.replace(/\(.*/, '')}${i === on ? ` ${Icon('check-min')}` : ''}</b>${['14일분', '28일분', '56일분'][i]}<br>${off ? '품절' : o.price}</div>`;
}).join('')}</div>`;

const cartBg = Page({ loggedIn: true, cart: 2 }, [Free({ kind: 'done', goal: '50,000원(예시)' }), Head(2, 2), Item(INNER1), Item(INNER2)], Summary({ n: 2, goods: '142,000원(예시)', ship: '0원', total: '142,000원(예시)' }));

const state4 = StateBlock({ idx: 4, title: '옵션 변경 팝업', note: '상품 줄의 옵션 변경을 누르면 뜹니다. 상세로 돌아가지 않고 장바구니 안에서 옵션과 수량을 바꿉니다.' },
    Anno({ title: '왜 이렇게 하나' }, '1박스를 담았다가 2박스로 바꾸려는 고객이 지우고 다시 담게 하면 그 사이에 이탈합니다. 팝업의 선택 칸은 상세의 구매 영역과 같은 규칙입니다(품절 품목은 고를 수 없음, 조합형은 앞 축부터). 바꾸면 얼마가 달라지는지 아래에 바로 보여 줍니다. 옵션이 없는 상품에는 옵션 변경 버튼이 없습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '바꾸려는 옵션이 이미 장바구니에 있으면 줄이 두 개가 되지 않게 하나로 합치고 수량을 더한다고 미리 알려 줍니다. 합친 수량이 최대 구매 수량이나 재고를 넘으면 넘지 않는 만큼만 담깁니다. 옵션을 바꾸지 않았으면 변경 버튼은 꺼져 있습니다.'),
    Canvas({ label: 'U-07 · 1박스 줄의 옵션 변경 누름 → 팝업 · 처음 열었을 때(지금 옵션이 골라져 있고 변경 버튼 비활성)' }, Overlay({ bg: cartBg, h: 560 },
        Modal({ title: '옵션 변경', w: 440, foot: [Btn('취소'), Btn('변경', { kind: 'primary', disabled: true })] },
            Cur(P, '1박스(14일분) · 1개'),
            Mo(Row('구성', Sets(0)), Row('수량', Qty(1))),
            Diff('변경 후 금액', '49,000원(예시)')))),
    CanvasRow(
        Canvas({ size: 'auto', label: '4박스가 품절일 때 · 지금 옵션 체크 · 품절 버튼 잠김', right: '팝업만', pad: 20 },
            Modal({ title: '옵션 변경', w: 440, foot: [Btn('취소'), Btn('변경', { kind: 'primary', disabled: true })] },
                Cur(P, '1박스(14일분) · 1개'),
                Mo(Row('구성', Sets(0, true)), Row('수량', Qty(1))),
                Diff('변경 후 금액', '49,000원(예시)'))),
        Canvas({ size: 'auto', label: '2박스로 바꿈 → 이미 담긴 옵션이라 합쳐진다는 안내 · 금액 차이', right: '팝업만', pad: 20 },
            Modal({ title: '옵션 변경', w: 440, foot: [Btn('취소'), Btn('변경', 'primary')] },
                Cur(P, '1박스(14일분) · 1개'),
                Mo(Row('구성', Sets(1)), Row('수량', Qty(1))),
                Note('2박스(28일분)은 이미 장바구니에 1개 있습니다. 변경하면 한 줄로 합쳐져 2개가 됩니다.', { warn: true }),
                Diff('변경 후 금액', '93,000원(예시) <span style="font-size:12.5px;font-weight:500;color:var(--ink2)">(+44,000원)</span>'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '조합형 2축 · 색상 그대로 · 사이즈 목록 연 모습(다른 업종 예시: 의류)', right: '팝업만', pad: 20 },
            Modal({ title: '옵션 변경', w: 440, foot: [Btn('취소'), Btn('변경', { kind: 'primary', disabled: true })] },
                Cur('코튼 옥스퍼드 셔츠', '네이비 / M · 1개'),
                Mo(Row('색상', Select({ value: '네이비' })), Row('사이즈', Select({ value: 'M', open: true, options: [{ t: 'S (품절)', disabled: true }, { t: 'M', on: true }, { t: 'L', sub: '남은 수량 3개' }, { t: 'XL', sub: '+2,000원' }] })), Row('수량', Qty(1))),
                Diff('변경 후 금액', '59,000원'))),
        Canvas({ size: 'auto', label: '색상을 바꾸면 사이즈가 다시 비워짐 → 사이즈를 골라야 변경 가능', right: '팝업만', pad: 20 },
            Modal({ title: '옵션 변경', w: 440, foot: [Btn('취소'), Btn('변경', { kind: 'primary', disabled: true })] },
                Cur('코튼 옥스퍼드 셔츠', '네이비 / M · 1개'),
                Mo(Row('색상', Select({ value: '화이트' })), Row('사이즈', `${Select({ placeholder: '사이즈를 선택해 주세요', error: true })}<p class="u07-msg">${Icon('error-o')}색상을 바꿨습니다. 사이즈를 다시 선택해 주세요.</p>`), Row('수량', Qty(1))),
                Diff('변경 후 금액', '-'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '변경 누름 → 팝업 닫히고 안내(3초) · 목록과 금액이 바로 바뀜', right: '안내만', pad: 20 }, Toast('옵션을 2박스(28일분)으로 바꿨습니다. 같은 상품과 합쳐 2개가 되었습니다.')),
        Canvas({ size: 'auto', label: '변경 누르는 순간 그 옵션이 품절됨', right: '안내만', pad: 20 }, Toast('2박스(28일분)이 방금 품절되어 바꾸지 못했습니다. 다른 구성을 선택해 주세요.', { kind: 'error' })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-07 · 모바일 · 옵션 변경 = 아래에서 올라오는 시트' }, Overlay({ bg: MobilePage({ title: '장바구니', tab: '장바구니', right: '' }, CSS, Head(2, 2), Item({ ...INNER1, m: true }), Item({ ...INNER2, m: true })), align: 'bottom', h: 720 },
            `<div class="wf-sheet"><div class="grip"></div><div class="mh"><b>옵션 변경</b>${Icon('close')}</div><div class="mb">${CSS}${Cur(P, '1박스(14일분) · 1개')}${Mo(Row('구성', Sets(0, true)), Row('수량', Qty(1)))}${Diff('변경 후 금액', '49,000원(예시)')}</div><div class="mf">${Btn('취소')}${Btn('변경', { kind: 'primary', disabled: true })}</div></div>`)),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U07() {
    return fixBand([state1, state2, state3, state4].join(''));
}
