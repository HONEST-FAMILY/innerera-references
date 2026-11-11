import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Chips, Check, Input, Select, Textarea, Field, Qty, Img, Thumb, Icon, Overlay, Modal, Confirm, Toast,
    MobilePage, UserPage, Empty, Tabs, Pager, KV, Note, Stars, Table, ProductRow, SHOP,
} from '../lib/blocks.js';

const CSS = `<style>
.u05-top { display: grid; grid-template-columns: 520px minmax(0, 1fr); gap: 48px; align-items: start; }
.u05-thumbs { display: flex; gap: 8px; margin-top: 8px; }
.u05-thumbs > * { flex: 1; }
.u05-thumbs .on { outline: 2px solid var(--dark); }
.u05-gal { position: relative; }
.u05-so { position: absolute; left: 0; right: 0; top: 0; aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; background: rgba(40,40,46,.55); color: #fff; font-size: 22px; font-weight: 800; }
.u05-name { font-size: 24px; font-weight: 800; line-height: 1.4; margin: 8px 0 6px; }
.u05-sub { font-size: 13.5px; color: var(--ink2); margin: 0 0 10px; }
.u05-rev { display: flex; gap: 6px; align-items: center; font-size: 13px; margin-bottom: 14px; }
.u05-rev span { color: var(--mute); text-decoration: underline; }
.u05-price { display: flex; align-items: baseline; gap: 8px; padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 14px; }
.u05-price em { font-style: normal; font-size: 22px; font-weight: 800; }
.u05-price b { font-size: 26px; }
.u05-price s { color: var(--mute); font-size: 14px; }
.u05-price.off b, .u05-price.off em { color: var(--mute); }
.u05-opt { margin-top: 16px; }
.u05-opt label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; }
.u05-opt .wf-input, .u05-opt .wf-select-open { width: 100% !important; }
.u05-opt .row { margin-bottom: 10px; }
.u05-sel { background: var(--box); border: 1px solid var(--line2); border-radius: 6px; padding: 12px 14px; margin-top: 8px; font-size: 13.5px; }
.u05-sel .t { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.u05-sel .b { display: flex; justify-content: space-between; align-items: center; }
.u05-sum { display: flex; justify-content: space-between; align-items: baseline; margin: 16px 0 12px; padding-top: 14px; border-top: 1px solid var(--dark); font-size: 14px; }
.u05-sum b { font-size: 24px; }
.u05-sum span em { font-style: normal; color: var(--mute); margin-right: 8px; font-size: 13px; }
.u05-btns { display: flex; gap: 8px; }
.u05-btns .wf-btn.block { flex: 1; width: auto; }
.u05-msg { margin: 10px 0 0; font-size: 12.5px; font-weight: 700; display: flex; gap: 4px; align-items: center; }
.u05-tabs { margin-top: 56px; }
.u05-body { max-width: 860px; margin: 0 auto; }
.u05-dist { display: grid; grid-template-columns: 220px 1fr; gap: 32px; align-items: center; border: 1px solid var(--line); border-radius: 6px; padding: 22px 26px; margin-bottom: 20px; }
.u05-dist .avg { text-align: center; }
.u05-dist .avg b { display: block; font-size: 40px; line-height: 1.2; }
.u05-bar { display: flex; align-items: center; gap: 10px; font-size: 12.5px; margin: 5px 0; }
.u05-bar .tr { flex: 1; height: 8px; border-radius: 4px; background: var(--fill); overflow: hidden; }
.u05-bar .tr span { display: block; height: 100%; background: var(--dark); }
.u05-bar em { font-style: normal; width: 40px; text-align: right; color: var(--ink2); }
.u05-photos { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 8px; margin-bottom: 20px; }
.u05-photos > div { position: relative; }
.u05-more { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(40,40,46,.6); color: #fff; font-size: 13px; font-weight: 700; border-radius: 2px; }
.u05-rv { border-top: 1px solid var(--line2); padding: 18px 0; font-size: 13.5px; }
.u05-rv .h { display: flex; flex-wrap: wrap; gap: 4px 10px; align-items: center; font-size: 12.5px; color: var(--mute); margin-bottom: 6px; }
.u05-rv .p { display: flex; gap: 6px; margin: 10px 0; }
.u05-rv .a { background: var(--box); border-radius: 6px; padding: 12px 14px; margin-top: 10px; font-size: 13px; }
.u05-rv .f { display: flex; gap: 12px; align-items: center; font-size: 12.5px; color: var(--ink2); margin-top: 8px; }
.u05-qa { background: var(--box); padding: 16px 20px; font-size: 13.5px; }
.u05-qa p { margin: 0 0 10px; }
.u05-mbar { display: flex; gap: 8px; }
</style>`;

const Gallery = (o = {}) => `<div class="u05-gal">${Img({ ratio: '1/1', label: o.label || '상품 대표 이미지 1000 × 1000 (1:1) · 누르면 크게 보기' })}${o.soldout ? '<div class="u05-so">품절</div>' : ''}<div class="u05-thumbs">${[1, 2, 3, 4, 5].map((n) => `<div class="${n === 1 ? 'on' : ''}">${Img({ ratio: '1/1', label: n === 1 ? '대표' : `추가 ${n - 1}` })}</div>`).join('')}</div></div>`;

const Info = (p, ...buy) => `<div>
<div style="display:flex;gap:4px">${(p.badges || []).map((b) => Badge(b)).join('')}</div>
<h1 class="u05-name">${p.name}</h1>
<p class="u05-sub">${p.sub}</p>
${p.noReview ? '' : `<div class="u05-rev">${Stars(5)}<b>${p.rating || '4.8'}</b><span>리뷰 ${p.reviews}개 보기</span></div>`}
<div class="u05-price${p.soldout ? ' off' : ''}">${p.rate ? `<em>${p.rate}</em>` : ''}<b>${p.price}</b>${p.orig ? `<s>${p.orig}</s>` : ''}</div>
${KV([
        ...(p.point ? [['적립금', p.point]] : []),
        ['배송비', p.ship || '3,000원 (50,000원 이상 구매 시 무료)(예시) · 제주·도서산간 3,000원 추가'],
        ['출고 안내', p.soldout ? '재입고 일정이 정해지면 알려 드립니다' : '오늘 14시 전 결제 시 오늘 출고 (평일 기준) · CJ대한통운'],
    ])}
${buy.join('')}
</div>`;

const Opt = (...rows) => `<div class="u05-opt">${rows.map(([label, ctl]) => `<div class="row"><label>${label}</label>${ctl}</div>`).join('')}</div>`;
const Sel = (name, qty, price, o = {}) => `<div class="u05-sel"><div class="t"><span>${name}</span>${o.fixed ? '' : Icon('close-min')}</div><div class="b">${Qty(qty)}<b>${price}</b></div>${o.note ? `<p class="u05-msg">${Icon('error-o')}${o.note}</p>` : ''}</div>`;
const Sum = (n, total) => `<div class="u05-sum"><span>총 상품 금액</span><span><em>총 수량 ${n}개</em><b>${total}</b></span></div>`;
const Buttons = (o = {}) => `<div class="u05-btns">${Btn(Icon(o.liked ? 'heart' : 'heart-o'), { size: 'lg', w: 52 })}${Btn('장바구니', { size: 'lg', block: true, disabled: o.disabled })}${Btn('바로 구매', { kind: 'primary', size: 'lg', block: true, disabled: o.disabled })}</div>${o.msg ? `<p class="u05-msg">${Icon('info-o')}${o.msg}</p>` : ''}`;

const CREAM = { name: '시카 수분 크림 50 ml', sub: '민감한 피부를 위한 저자극 수분 크림', price: '32,000원', badges: [], reviews: 356, point: '320원 적립 (구매 금액의 1%)' };
const SHIRT = { name: '코튼 옥스퍼드 셔츠', sub: '사계절 입는 기본 셔츠 · 색상 3가지 · 사이즈 4가지', price: '59,000원', badges: ['신상품', '무료배송'], reviews: 84, point: '590원 적립 (구매 금액의 1%)' };
const INNER = { name: SHOP.product, sub: '5가지 핵심 원료를 담은 석류맛 젤리스틱 한 포 · 하루 한 포', price: '49,000원(예시)부터', badges: ['GIP-01 특허원료'], reviews: 128, point: '구매 금액의 1% 적립' };

const Page = (p, gal, info, o = {}) => UserPage({ active: '상품', crumb: ['홈', '상품', o.cat, p.name].filter(Boolean), loggedIn: o.loggedIn, cart: o.cart }, CSS, `<div class="u05-top">${Gallery(gal)}${info}</div>`, o.below || '');
const Panel = (label, info, w = 520) => Canvas({ size: 'auto', label, right: '구매 영역만', pad: 24 }, `${CSS}<div style="width:${w}px">${info}</div>`);

const Sets = (on = -1, sold) => `<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px">${SHOP.options.map((o, i) => {
    const off = sold === 'all' || (sold && i === 2);
    return `<div style="border:${i === on ? '2px solid var(--dark)' : '1px solid #b4b4bb'};border-radius:6px;padding:${i === on ? 9 : 10}px;font-size:12.5px;line-height:1.5;${off ? 'background:var(--fill);color:#a2a2aa;text-decoration:line-through' : ''}"><b style="display:block;font-size:13.5px">${o.name.replace(/\(.*/, '')}${i === on ? ` ${Icon('check-min')}` : ''}</b>${['14일분', '28일분', '56일분'][i]}<br>${off ? '품절' : o.price}</div>`;
}).join('')}</div>`;

const COLORS = ['화이트', '스카이블루', '네이비'];
const SIZES = ['S', 'M', 'L', 'XL'];
const innerOpts = (on, sold) => SHOP.options.map((o, i) => ({ t: `${o.name}${sold && i === 2 ? ' (품절)' : ''}`, sub: i === 0 ? o.price : `${o.price} · 1박스 대비 ${i === 1 ? '5' : '10'}% 절약`, on: i === on, disabled: sold && i === 2 }));

const DetailTabs = (active, o = {}) => `<div class="u05-tabs">${Tabs([{ t: '상세정보' }, ...(o.noReview ? [] : [{ t: '리뷰', n: o.reviews === undefined ? 128 : o.reviews }]), ...(o.noQna ? [] : [{ t: '문의', n: o.qna === undefined ? 12 : o.qna }]), { t: '배송·교환·반품' }], active)}</div>`;

const state1 = StateBlock({ idx: 1, title: '정상(옵션 없음·수량만)', note: '주소 /products/{id}. 옵션이 없는 상품은 수량만 고르면 바로 살 수 있어 구매 버튼이 처음부터 켜져 있습니다(다른 업종 예시: 화장품 단품).' },
    Anno({ title: '왜 이렇게 하나' }, '상품 상세는 이 솔루션에서 가장 중요한 사용자 화면이고, 구매 영역은 상품 등록(A-21)에서 고른 옵션 방식에 따라 모양이 달라집니다. 옵션 없음 = 수량만 / 옵션 1축(이너에라 구성) = 선택 목록 1개 / 조합형 2 ~ 3축(의류 색상 × 사이즈) = 선택 목록 여러 개. 같은 화면 틀이 세 경우를 모두 받습니다.'),
    Anno({ title: '초기값 · 기능을 껐을 때 · 이미지 규격' }, '수량 초기값 1, 최대 구매 수량은 상품 등록 값(없으면 재고까지). 적립금 줄은 적립금 기능을 끈 몰에서 사라지고, 별점 · 리뷰 수는 리뷰 기능을 끈 몰에서 사라집니다. 배송비 줄은 상품에 연결한 배송비 템플릿 값이 자동으로 나옵니다. 대표 이미지 1장 + 추가 이미지 최대 9장, 1000 × 1000 px(1:1), 장당 5MB 이하, JPG · PNG · WEBP.'),
    Canvas({ label: 'U-05 · 옵션 없는 상품 · 수량만 · 구매 버튼 활성 · 로그인 상태(다른 업종 예시: 화장품)' }, Page(CREAM, {}, Info(CREAM,
        Opt(['수량', `<div style="display:flex;justify-content:space-between;align-items:center">${Qty(1)}<span style="font-size:12.5px;color:var(--mute)">한 번에 최대 10개까지 구매할 수 있습니다</span></div>`]),
        Sum(1, '32,000원'), Buttons(),
    ), { cat: '스킨케어', loggedIn: true, cart: 1, below: DetailTabs('상세정보', { reviews: 356, qna: 24 }) })),
    CanvasRow(
        Panel('수량 3개로 올림 → 합계가 바로 바뀜', Info(CREAM, Opt(['수량', Qty(3)]), Sum(3, '96,000원'), Buttons())),
        Panel('최대 수량에서 더하기를 누름 → 안내(수량은 10에서 멈춤)', Info(CREAM, Opt(['수량', `${Qty(10)}<p class="u05-msg">${Icon('error-o')}이 상품은 한 번에 최대 10개까지 구매할 수 있습니다.</p>`]), Sum(10, '320,000원'), Buttons())),
    ),
    Canvas({ label: 'U-05 · 장바구니 버튼 누름 → 담기 완료 안내 팝업(PC) · 머리 장바구니 숫자 1 → 2' }, Overlay({ bg: Page(CREAM, {}, Info(CREAM, Opt(['수량', Qty(1)]), Sum(1, '32,000원'), Buttons()), { cat: '스킨케어', loggedIn: true, cart: 2 }), h: 420 },
        Confirm({ w: 400, title: '장바구니에 담았습니다', desc: '시카 수분 크림 50 ml · 1개<br>18,000원 더 담으면 배송비가 무료입니다.', foot: [Btn('계속 쇼핑'), Btn('장바구니 보기', 'primary')] }))),
);

const state2 = StateBlock({ idx: 2, title: '옵션 상품(조합형 2축) 옵션 미선택 = 구매 버튼 비활성', note: '옵션이 있는 상품은 모든 옵션을 골라 선택 목록에 한 줄 이상 들어가야 장바구니 · 바로 구매가 켜집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '옵션 축 이름(색상 · 사이즈)과 값은 상품마다 운영자가 자유롭게 정한 것이 그대로 나옵니다. 축이 2개 이상이면 위에서부터 차례로 고르게 하고, 앞 축을 골라야 다음 축이 열립니다. 다음 축 목록에는 그 조합의 추가 금액과 품절 여부가 붙으므로 고객이 품절 조합을 끝까지 골랐다가 막히는 일이 없습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '버튼을 흐리게만 두면 왜 안 눌리는지 모릅니다. 흐린 버튼을 누르면 아직 고르지 않은 옵션 이름을 넣어 안내하고(색상과 사이즈를 선택해 주세요) 그 선택 칸에 굵은 테두리를 줍니다. 이너에라 같은 단독형(1축)은 값이 8개 이하면 버튼형, 9개 이상이면 선택 상자형으로 자동으로 나옵니다(10번 상태).'),
    Canvas({ label: 'U-05 · 조합형 2축(색상 × 사이즈) · 아무것도 안 고름 · 버튼 비활성(다른 업종 예시: 의류)' }, Page(SHIRT, {}, Info(SHIRT,
        Opt(['색상', Select({ placeholder: '색상을 선택해 주세요' })], ['사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })]),
        Sum(0, '0원'), Buttons({ disabled: true, msg: '옵션을 선택하면 구매할 수 있습니다.' }),
    ), { cat: '상의', below: DetailTabs('상세정보', { reviews: 84, qna: 7 }) })),
    CanvasRow(
        Panel('색상 선택 칸을 연 모습', Info(SHIRT,
            Opt(['색상', Select({ placeholder: '색상을 선택해 주세요', open: true, options: COLORS })], ['사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })]),
            Sum(0, '0원'), Buttons({ disabled: true }))),
        Panel('색상 네이비 고름 → 사이즈 칸이 열림(추가 금액 · 남은 수량 표시)', Info(SHIRT,
            Opt(['색상', Select({ value: '네이비' })], ['사이즈', Select({ placeholder: '사이즈를 선택해 주세요', open: true, options: [{ t: 'S' }, { t: 'M' }, { t: 'L', sub: '남은 수량 3개' }, { t: 'XL', sub: '+2,000원' }] })]),
            Sum(0, '0원'), Buttons({ disabled: true }))),
    ),
    CanvasRow(
        Panel('흐린 구매 버튼을 누름 → 고르지 않은 옵션 안내 + 선택 칸 강조', Info(SHIRT,
            Opt(['색상', Select({ value: '네이비' })], ['사이즈', `${Select({ placeholder: '사이즈를 선택해 주세요', error: true })}<p class="u05-msg">${Icon('error-o')}사이즈를 선택해 주세요.</p>`]),
            Sum(0, '0원'), Buttons({ disabled: true }))),
        Panel('이너에라 · 단독형 구성 옵션 · 기본 선택을 지정하지 않은 경우 = 미선택(버튼형 · 구성별 가격)', Info(INNER,
            Opt(['구성', Sets(-1)]),
            Sum(0, '0원'), Buttons({ disabled: true, msg: '구성을 선택하면 구매할 수 있습니다.' }))),
    ),
);

const state3 = StateBlock({ idx: 3, title: '옵션 선택됨(선택 목록·합계)', note: '옵션을 끝까지 고르면 선택 목록에 한 줄이 생기고 선택 칸은 다시 처음으로 돌아가, 다른 조합을 이어서 담을 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '한 번에 여러 조합(화이트 M 1개 + 네이비 L 2개)을 담는 것이 의류 · 선물 구매의 기본입니다. 줄마다 수량을 따로 바꾸고 지울 수 있고, 합계는 줄 금액(판매가 + 옵션 추가 금액) × 수량의 합입니다. 장바구니에 담으면 줄마다 따로 들어갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '이미 목록에 있는 조합을 또 고르면 줄을 새로 만들지 않고 안내만 합니다. 수량은 그 품목의 재고와 상품의 최대 구매 수량 가운데 작은 값에서 멈춥니다. 금액은 예시이며 이너에라 판매가는 미확정입니다.'),
    Canvas({ label: 'U-05 · 조합형 2축 · 두 조합을 고른 뒤 · 선택 목록 2줄 · 합계 · 버튼 활성(다른 업종 예시: 의류)' }, Page(SHIRT, {}, Info(SHIRT,
        Opt(['색상', Select({ placeholder: '색상을 선택해 주세요' })], ['사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })]),
        Sel('화이트 / M', 1, '59,000원'), Sel('네이비 / XL (+2,000원)', 2, '122,000원'),
        Sum(3, '181,000원'), Buttons(),
    ), { cat: '상의', loggedIn: true, cart: 1 })),
    Canvas({ label: 'U-05 · 이너에라 · 2박스(28일분) 선택됨 · 합계', }, Page(INNER, { label: '상품 대표 이미지 1000 × 1000 · 젤리스틱 상자와 스틱' }, Info(INNER,
        Opt(['구성', Sets(1)]),
        Sel('2박스(28일분)', 1, '93,000원(예시)'),
        Sum(1, '93,000원(예시)'), Buttons(),
    ), { loggedIn: true })),
    CanvasRow(
        Panel('이너에라 · 구성 두 가지를 함께 담음', Info(INNER,
            Opt(['구성', Sets(1)]),
            Sel('1박스(14일분)', 2, '98,000원(예시)'), Sel('2박스(28일분)', 1, '93,000원(예시)'),
            Sum(3, '191,000원(예시)'), Buttons())),
        Panel('같은 조합을 다시 고름 → 줄을 늘리지 않고 안내 / 재고보다 많이 올림 → 안내', Info(SHIRT,
            Opt(['색상', Select({ placeholder: '색상을 선택해 주세요' })], ['사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })]),
            `<p class="u05-msg">${Icon('info-o')}이미 선택한 옵션입니다. 아래 목록에서 수량을 바꿔 주세요.</p>`,
            Sel('화이트 / M', 1, '59,000원'), Sel('네이비 / L', 3, '177,000원', { note: '남은 수량이 3개입니다. 3개까지 담을 수 있습니다.' }),
            Sum(4, '236,000원'), Buttons())),
    ),
    Canvas({ label: 'U-05 · 바로 구매 누름(비로그인) → 로그인 화면으로 이동 전 안내 없이 U-10 로그인(비회원으로 주문하기 노출)으로 감 · 장바구니 누름 → 담기 완료 팝업' }, Overlay({ bg: Page(INNER, {}, Info(INNER, Opt(['구성', Sets(1)]), Sel('2박스(28일분)', 1, '93,000원(예시)'), Sum(1, '93,000원(예시)'), Buttons()), { cart: 1 }), h: 440 },
        Confirm({ w: 400, title: '장바구니에 담았습니다', desc: `${SHOP.productShort}<br>2박스(28일분) · 1개`, foot: [Btn('계속 쇼핑'), Btn('장바구니 보기', 'primary')] }))),
);

const state4 = StateBlock({ idx: 4, title: '일부 품목 품절', note: '옵션 조합 가운데 일부만 재고가 없을 때. 상품은 계속 팔고, 품절된 조합만 목록 안에서 고를 수 없게 합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '재고는 상품이 아니라 품목(옵션 조합)마다 따로 있습니다(관리자 재고 관리 A-23). 품절 조합을 목록에서 숨기면 원래 없는 옵션인 줄 알기 때문에, 보여 주되 줄을 긋고 품절이라고 적고 누를 수 없게 합니다. 첫 축에서는 그 값의 모든 조합이 품절일 때만 품절로 표시합니다.'),
    Anno({ title: '관리자가 바꾸는 범위' }, '남은 수량 표시는 재고가 안전재고 이하로 내려간 품목에만 붙습니다(안전재고 값은 재고 관리에서 품목별로). 품절 품목 옆 재입고 알림은 품목 단위로 신청하며, 운영자가 그 품목 재고를 0보다 크게 고치면 신청자에게 알림톡이 자동으로 나갑니다(설정 > 알림에서 켜고 끄기).'),
    Canvas({ label: 'U-05 · 이너에라 · 4박스(56일분)만 품절 · 그 버튼만 잠김' }, Page(INNER, { label: '상품 대표 이미지 1000 × 1000' }, Info(INNER,
        Opt(['구성', Sets(-1, true)]),
        `<p class="u05-msg" style="font-weight:500">${Icon('bell-o')}4박스(56일분)은 품절입니다. <u>재입고 알림 신청</u></p>`,
        Sum(0, '0원'), Buttons({ disabled: true, msg: '구성을 선택하면 구매할 수 있습니다.' }),
    ), { loggedIn: true })),
    CanvasRow(
        Panel('조합형 2축 · 색상 목록 — 스카이블루는 모든 사이즈 품절(다른 업종 예시: 의류)', Info(SHIRT,
            Opt(['색상', Select({ placeholder: '색상을 선택해 주세요', open: true, options: [{ t: '화이트' }, { t: '스카이블루 (품절)', disabled: true }, { t: '네이비' }] })], ['사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })]),
            Sum(0, '0원'), Buttons({ disabled: true }))),
        Panel('색상 화이트 고름 → 사이즈 목록 — S · XL 품절, L 남은 수량 2개', Info(SHIRT,
            Opt(['색상', Select({ value: '화이트' })], ['사이즈', Select({ placeholder: '사이즈를 선택해 주세요', open: true, options: [{ t: 'S (품절)', disabled: true }, { t: 'M' }, { t: 'L', sub: '남은 수량 2개' }, { t: 'XL (품절)', sub: '+2,000원', disabled: true }] })]),
            `<p class="u05-msg" style="font-weight:500">${Icon('bell-o')}원하는 사이즈가 품절인가요? <u>재입고 알림 신청</u></p>`,
            Sum(0, '0원'), Buttons({ disabled: true }))),
    ),
    CanvasRow(
        Panel('선택 목록에 담아 둔 사이 그 품목이 품절됨 → 장바구니 · 바로 구매 누를 때 안내', Info(SHIRT,
            Opt(['색상', Select({ placeholder: '색상을 선택해 주세요' })], ['사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })]),
            Sel('화이트 / L', 1, '59,000원', { note: '방금 품절되었습니다. 이 줄을 지우고 다른 옵션을 선택해 주세요.' }),
            Sum(1, '59,000원'), Buttons({ disabled: true }))),
    ),
);

const restockForm = (o = {}) => [
    ProductRow({ name: SHOP.productShort, option: '판매 상태: 전체 품절', qty: 0 }).replace(' · 0개', ''),
    '<div style="height:16px"></div>',
    Field({ label: '알림 받을 구성', required: true, error: o.errItem }, `<div style="display:flex;flex-direction:column;gap:10px">${SHOP.options.map((op, i) => Check(`${op.name} <span style="color:var(--mute)">${op.price}</span>`, { on: i === (o.pick === undefined ? 1 : o.pick) })).join('')}</div>`),
    Field({ label: '휴대폰 번호', required: true, help: o.errPhone ? '' : '로그인 회원은 회원정보의 번호가 미리 들어갑니다. 다른 번호로 바꿀 수 있습니다.', error: o.errPhone }, Input({ value: o.phone === undefined ? '010-2345-1234' : o.phone, placeholder: '010-0000-0000', error: !!o.errPhone })),
    `<div style="border:1px solid var(--line);border-radius:6px;padding:12px 14px">${Check('<b>[필수]</b> 재입고 알림 수신에 동의합니다', { on: o.agree !== false })}<p class="help" style="margin-left:25px">입력한 번호로 재입고 알림(카카오 알림톡, 실패 시 문자)을 1회 보냅니다. 번호는 알림 발송 뒤 또는 신청 90일 뒤 지웁니다.</p>${o.errAgree ? `<p class="err" style="margin-left:25px">${Icon('error-o')}수신에 동의해야 알림을 보내 드릴 수 있습니다.</p>` : ''}</div>`,
];

const SOLD = { ...INNER, soldout: true, price: '49,000원(예시)부터' };
const SoldInfo = (applied) => Info(SOLD,
    Opt(['구성', Sets(-1, 'all')]),
    `<div class="u05-btns" style="margin-top:20px">${Btn(Icon('heart-o'), { size: 'lg', w: 52 })}${applied ? Btn('재입고 알림 신청됨', { size: 'lg', block: true, icon: 'check' }) : Btn('재입고 알림 신청', { kind: 'primary', size: 'lg', block: true, icon: 'bell-o' })}</div>`,
    applied ? `<p class="u05-msg" style="font-weight:500">${Icon('bell-o')}2박스(28일분) 재입고 시 010-****-1234 로 알려 드립니다. <u>신청 취소</u></p>` : `<p class="u05-msg" style="font-weight:500">${Icon('info-o')}지금은 모든 구성이 품절입니다. 재입고되면 알림톡으로 알려 드립니다.</p>`,
);

const state5 = StateBlock({ idx: 5, title: '전체 품절(재입고 알림 신청)', note: '모든 품목의 재고가 0이거나 운영자가 상품을 품절로 돌렸을 때. 장바구니 버튼은 숨기고, 바로 구매 자리가 재입고 알림 신청으로 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '품절은 수요가 있다는 신호입니다. 그냥 돌려보내지 않고 번호를 받아 두면 재입고한 날 바로 매출이 됩니다. 비회원도 신청할 수 있게 휴대폰 번호와 수신 동의만 받습니다(가입을 강요하지 않음). 신청자는 관리자 재고 관리에서 품목별 재입고 알림 대기 인원으로 보입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '수신 동의는 필수 체크이며 초기값은 체크 안 됨입니다(미리 체크해 두면 안 됨). 찜은 품절이어도 할 수 있습니다. 판매중지 상품은 이 화면이 아니라 판매가 종료된 상품입니다 안내와 다른 상품 보기 버튼만 나옵니다(아래 마지막 그림).'),
    Canvas({ label: 'U-05 · 전체 품절 · 대표 이미지 위 품절 표시 · 구매 버튼 자리에 재입고 알림 신청' }, Page(SOLD, { soldout: true, label: '상품 대표 이미지 1000 × 1000' }, SoldInfo(false), { loggedIn: true, below: DetailTabs('상세정보') })),
    Canvas({ label: 'U-05 · 재입고 알림 신청 버튼 → 팝업(로그인 회원 · 번호 미리 들어감 · 동의 체크함)' }, Overlay({ bg: Page(SOLD, { soldout: true }, SoldInfo(false), { loggedIn: true }), h: 720 },
        Modal({ title: '재입고 알림 신청', w: 460, foot: [Btn('취소'), Btn('알림 신청', 'primary')] }, ...restockForm()))),
    CanvasRow(
        Canvas({ size: 'auto', label: '비회원 · 처음 열었을 때(번호 빈칸 · 동의 체크 안 됨 · 신청 버튼 비활성)', right: '팝업만', pad: 20 },
            Modal({ title: '재입고 알림 신청', w: 460, foot: [Btn('취소'), Btn('알림 신청', { kind: 'primary', disabled: true })] }, ...restockForm({ phone: '', pick: -1, agree: false }))),
        Canvas({ size: 'auto', label: '입력 오류 · 번호 형식이 틀림 · 구성을 안 고름 · 동의 안 함', right: '팝업만', pad: 20 },
            Modal({ title: '재입고 알림 신청', w: 460, foot: [Btn('취소'), Btn('알림 신청', 'primary')] }, ...restockForm({ phone: '010-2345-12', errPhone: '휴대폰 번호를 끝까지 입력해 주세요. (예: 010-1234-5678)', errItem: '알림 받을 구성을 하나 이상 선택해 주세요.', pick: -1, agree: false, errAgree: true }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '알림 신청 누름 → 신청 완료', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '재입고 알림을 신청했습니다', desc: '2박스(28일분)이 다시 들어오면<br>010-****-1234 로 알림톡을 보내 드립니다.', foot: [Btn('확인', 'primary')] })),
        Canvas({ size: 'auto', label: '같은 번호 · 같은 구성으로 다시 신청', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '이미 신청한 구성입니다', desc: '2박스(28일분)은 11월 11일에 신청하셨습니다.<br>재입고되면 한 번만 알려 드립니다.', foot: [Btn('신청 취소'), Btn('확인', 'primary')] })),
    ),
    Canvas({ label: 'U-05 · 신청한 뒤 다시 들어온 모습 · 버튼이 신청됨으로 바뀜 · 신청 취소 가능' }, Page(SOLD, { soldout: true }, SoldInfo(true), { loggedIn: true })),
    Canvas({ label: 'U-05 · 판매중지 · 전시 끔 상품을 예전 링크로 들어옴(재입고 알림 없음)' }, UserPage({ active: '상품' },
        Empty({ icon: 'box', title: '판매가 종료된 상품입니다', desc: '찾으시는 상품은 더 이상 판매하지 않습니다. 다른 상품을 살펴보세요.', action: [Btn('상품 보러 가기', 'primary'), Btn('홈으로')] }))),
);

const TabPage = (p, tab, body, o = {}) => UserPage({ active: '상품', loggedIn: o.loggedIn }, CSS,
    `<div style="border:1px dashed var(--line);border-radius:6px;padding:14px 18px;font-size:13px;color:var(--mute);display:flex;justify-content:space-between;align-items:center">위쪽 대표 이미지 · 구매 영역은 줄임 (스크롤을 내리면 탭 줄이 화면 위에 붙고, 오른쪽에 작은 구매 버튼이 따라옴)<span>${Btn('구매하기', { kind: 'primary', size: 'sm' })}</span></div>`,
    DetailTabs(tab, o.tabs).replace('margin-top: 56px', ''), `<div class="u05-body">${body}</div>`);

const NOTICE = [['제품명', '이너에라 롱지비티 석류맛 젤리스틱'], ['식품의 유형', '운영자 입력값'], ['생산자 및 소재지', '운영자 입력값'], ['제조연월일 · 소비기한', '제조일로부터 운영자 입력값 (상품별 표기)'], ['포장 단위별 내용물의 용량 · 수량', '20 g × 14포 (280 g)'], ['원재료명 및 함량', '운영자 입력값'], ['영양성분', '운영자 입력값'], ['소비자 안전을 위한 주의사항', '운영자 입력값'], ['소비자상담 관련 전화번호', '070-****-1234']];

const REVIEWS = [
    { n: '김*지', d: '2026-11-09', o: '2박스(28일분)', s: 5, t: '아침마다 한 포씩 먹고 있어요. 석류맛이 달지 않고 깔끔해서 물 없이도 먹기 편합니다. 개별 포장이라 가방에 넣어 다니기 좋아요.', p: 3, h: 24, a: '소중한 후기 감사합니다. 매일의 루틴에 이너에라가 함께할 수 있어 기쁩니다.' },
    { n: '박*준', d: '2026-11-07', o: '1박스(14일분)', s: 4, t: '맛은 만족합니다. 다만 상자가 생각보다 커서 보관할 자리를 따로 마련했어요. 배송은 주문 다음 날 받았습니다.', p: 0, h: 6 },
    { n: '이*은', d: '2026-11-05', o: '4박스(56일분)', s: 5, t: '부모님 선물로 드렸는데 먹기 편하다고 좋아하셨어요.', p: 1, h: 11 },
];
const Review = (r) => `<div class="u05-rv"><div class="h">${Stars(r.s)}<b style="color:var(--ink)">${r.n}</b><span>${r.d}</span><span>구성 ${r.o}</span>${r.p ? Badge('포토', 'line') : ''}<span style="margin-left:auto">신고</span></div>${r.t}${r.p ? `<div class="p">${Array.from({ length: r.p }, () => Thumb(88)).join('')}</div>` : ''}<div class="f"><span style="border:1px solid var(--line);border-radius:14px;padding:3px 10px">${Icon('heart-o')} 도움돼요 ${r.h}</span></div>${r.a ? `<div class="a"><b>${Icon('reply')} 이너에라 답글</b> <span style="color:var(--mute);font-size:12px">2026-11-10</span><br>${r.a}</div>` : ''}</div>`;
const DIST = [[5, 102, 80], [4, 19, 15], [3, 5, 4], [2, 1, 1], [1, 1, 1]];

const ReviewTab = () => [
    `<div class="u05-dist"><div class="avg"><b>4.8</b>${Stars(5)}<p style="margin:6px 0 0;font-size:12.5px;color:var(--mute)">리뷰 128개</p></div><div>${DIST.map(([s, n, w]) => `<div class="u05-bar"><span>${s}점</span><div class="tr"><span style="width:${w}%"></span></div><em>${n}</em></div>`).join('')}</div></div>`,
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>포토 모아보기 <span style="font-weight:500;color:var(--mute)">46</span></b>${Btn('전체 보기', { kind: 'ghost', iconRight: 'angle-right-min' })}</div>`,
    `<div class="u05-photos">${Array.from({ length: 8 }, (_, i) => `<div>${Img({ ratio: '1/1', label: '' })}${i === 7 ? '<span class="u05-more">+38</span>' : ''}</div>`).join('')}</div>`,
    `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:6px">${Chips(['추천순', '최신순', '별점 높은 순', '별점 낮은 순'], '추천순')}<span style="display:flex;gap:12px;align-items:center">${Check('포토 리뷰만 보기')}${Select({ value: '구성 전체', w: 150 })}</span></div>`,
    REVIEWS.map(Review).join(''),
    Pager({ page: 1, last: 13 }),
    Note('리뷰는 구매확정한 고객만 마이페이지 > 리뷰에서 씁니다. 여기에는 쓰기 버튼을 두지 않습니다.'),
].join('');

const QNA_ROWS = [
    [Badge('답변완료', 'check'), `${Icon('lock-o')} 비밀글입니다.`, '박*준', '2026-11-10'],
    { on: true, c: [Badge('답변완료', 'check'), '<b>하루에 두 포 먹어도 되나요?</b>', '김*지 (내 문의)', '2026-11-09'] },
    [Badge('답변대기', 'dash'), `${Icon('lock-o')} 비밀글입니다.`, '이*은', '2026-11-09'],
    [Badge('답변완료', 'check'), '소비기한이 얼마나 남은 상품이 오나요?', '최*윤', '2026-11-06'],
];
const QnaTab = (o = {}) => [
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:13px;color:var(--ink2)">상품에 대해 궁금한 점을 남겨 주세요. 주문 · 배송 · 환불 문의는 <u>1:1 문의</u>를 이용해 주세요.</span><span style="display:flex;gap:10px;align-items:center">${o.loggedIn ? Check('내 문의만 보기') : ''}${Btn('상품 문의하기', { kind: 'primary', icon: 'pen-o' })}</span></div>`,
    Table({ cols: [{ t: '답변 상태', w: 100 }, '문의 내용', { t: '작성자', w: 130 }, { t: '작성일', w: 110 }], rows: [
        ...QNA_ROWS.slice(0, 2),
        { nocheck: true, c: [`<div style="display:none"></div>`, `<div class="u05-qa"><p><b>문의</b> · 상품 문의<br>하루 한 포라고 되어 있는데 두 포 먹어도 괜찮은지 궁금합니다.</p><p style="margin:0"><b>${Icon('reply')} 답변</b> · 이너에라 · 2026-11-10<br>안녕하세요, 이너에라입니다. 패키지에 적힌 대로 하루 한 포 드시기를 권합니다. 감사합니다.</p><div style="margin-top:10px;display:flex;gap:8px">${Btn('수정', { size: 'sm', disabled: true })}${Btn('삭제', { size: 'sm' })}<span style="font-size:12px;color:var(--mute);align-self:center">답변이 달린 문의는 고칠 수 없습니다</span></div></div>`, '', ''] },
        ...QNA_ROWS.slice(2),
    ] }),
    Pager({ page: 1, last: 2 }),
].join('');

const SHIPINFO = [
    ['배송 방법', '택배 (CJ대한통운)'],
    ['배송비', '3,000원 · 50,000원 이상 구매 시 무료 (예시 · 고객 확인 값)'],
    ['제주 · 도서산간', '3,000원 추가'],
    ['출고', '평일 14시 이전 결제 완료 건은 당일 출고, 이후 결제 건은 다음 영업일 출고'],
    ['배송 기간', '출고 후 1 ~ 2일 (주말 · 공휴일 제외, 택배사 사정에 따라 달라질 수 있음)'],
];
const RETURNINFO = [
    ['신청 기한', '상품을 받은 날부터 7일 이내 (마이페이지 > 주문 목록에서 신청)'],
    ['반품 배송비', '고객 사유(단순 변심): 편도 3,000원 · 무료배송으로 받은 주문은 처음 배송비 3,000원을 더해 6,000원 / 판매자 사유(불량 · 오배송): 무료'],
    ['교환 배송비', '고객 사유: 왕복 6,000원 / 판매자 사유: 무료'],
    ['반품 보내실 곳', `${SHOP.addr} · ${SHOP.name} 물류 담당`],
    ['환불', '반품 상품 도착 · 확인 뒤 영업일 3일 안에 결제 수단으로 환불'],
    ['교환 · 반품이 안 되는 경우', '포장을 뜯어 상품 가치가 떨어진 경우 · 받은 날부터 7일이 지난 경우 · 고객 책임으로 상품이 훼손된 경우 · 식품 특성상 개별 포장을 뜯은 경우'],
];

const state6 = StateBlock({ idx: 6, title: '상세 탭(상세정보·리뷰·문의·배송/교환/반품 안내)', note: '구매 영역 아래 탭 네 개. 탭을 누르면 그 자리로 내려가고, 스크롤해도 탭 줄이 화면 위에 붙어 따라옵니다.' },
    Anno({ title: '탭 1 상세정보 — 관리자 에디터 영역 · 이미지 규격' }, '운영자가 상품 등록의 상세설명 에디터에 올린 이미지와 글이 폭 860 px 영역에 그대로 나옵니다. 상세 이미지는 가로 860 px 권장(더 크면 860에 맞춰 줄임), 세로 제한 없음, 장당 10MB 이하, JPG · PNG · WEBP · GIF, 최대 30장. 길면 처음에는 접어 두고 상세정보 펼쳐보기로 엽니다. 그 아래 상품정보제공고시는 운영자가 고른 품목군(이너에라 = 가공식품)의 항목 표가 자동으로 붙습니다.'),
    Canvas({ label: 'U-05 · 탭 1 상세정보 · 에디터 영역(접힘) + 상품정보제공고시 표' }, TabPage(INNER, '상세정보', [
        Img({ h: 520, label: '상세설명 에디터 영역 · 운영자가 올린 상세 이미지 1 · 가로 860 px · 매일 한 포로 시작하는 롱제비티 루틴' }),
        Img({ h: 360, label: '상세 이미지 2 · 다섯 가지 핵심 원료, 하나의 포뮬러 (아래로 계속 이어짐)' }),
        `<div style="margin:-80px 0 0;padding:90px 0 0;background:linear-gradient(rgba(255,255,255,0), #fff 60%);position:relative">${Btn('상세정보 펼쳐보기', { size: 'lg', block: true, iconRight: 'angle-down-min' })}</div>`,
        `<h3 style="font-size:16px;margin:40px 0 10px">상품정보제공고시 <span style="font-size:12.5px;font-weight:500;color:var(--mute)">품목군: 가공식품</span></h3>`,
        Table({ dense: true, cols: [{ t: '항목', w: 260 }, '내용'], rows: NOTICE }),
        Note('항목 이름은 품목군에 따라 자동으로 정해지고, 내용은 운영자가 상품 등록에서 넣은 값입니다. 의류면 소재 · 색상 · 치수 · 세탁 방법 항목으로 바뀝니다.'),
    ].join(''))),
    Anno({ title: '탭 2 리뷰 — 왜 이렇게 하나' }, '별점 분포로 한눈에 믿을 만한지 보고, 포토 모아보기로 실제 사용 모습을 먼저 봅니다. 정렬 초기값은 추천순(운영자가 고른 베스트 → 도움돼요 많은 순)입니다. 옵션이 있는 상품은 구성(옵션)별로 걸러 볼 수 있습니다. 운영자가 숨긴 리뷰는 나오지 않고, 판매자 답글은 리뷰 바로 아래 붙습니다. 리뷰 기능을 끈 몰은 리뷰 탭과 위쪽 별점이 통째로 없습니다.'),
    Canvas({ label: 'U-05 · 탭 2 리뷰 · 별점 분포 · 포토 모아보기 · 정렬 · 포토만 보기 · 구성별 보기 · 판매자 답글' }, TabPage(INNER, '리뷰', ReviewTab())),
    CanvasRow(
        Canvas({ size: 'auto', label: '포토 모아보기 사진 누름 → 크게 보기(그 리뷰 글과 함께 · 좌우 넘김)', right: '팝업만', pad: 20 },
            Modal({ title: '포토 리뷰 3 / 46', w: 720 }, `<div style="display:grid;grid-template-columns:400px 1fr;gap:20px"><div style="display:flex;align-items:center;gap:6px">${Icon('angle-left')}${Img({ ratio: '1/1', label: '리뷰 사진 크게 · 1 / 3' })}${Icon('angle-right')}</div><div style="font-size:13.5px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">${Stars(5)}<b>김*지</b></div><p style="color:var(--mute);font-size:12.5px;margin:0 0 10px">2026-11-09 · 구성 2박스(28일분)</p>아침마다 한 포씩 먹고 있어요. 석류맛이 달지 않고 깔끔해서 물 없이도 먹기 편합니다.<div style="display:flex;gap:6px;margin-top:14px">${Thumb(56)}${Thumb(56)}${Thumb(56)}</div></div></div>`)),
        Canvas({ size: 'auto', label: '정렬 · 구성별 보기 선택 칸을 연 모습', right: '조각', pad: 20, h: 230 },
            `<div style="display:flex;gap:16px;align-items:flex-start">${Chips(['추천순', '최신순', '별점 높은 순', '별점 낮은 순'], '별점 낮은 순')}${Select({ value: '구성 전체', w: 180, open: true, options: [{ t: '구성 전체', on: true }, ...SHOP.options.map((o) => o.name)] })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '리뷰 0개(새 상품) — 빈 상태', right: '본문만', pad: 20 }, `<div style="width:560px">${Empty({ icon: 'star-o', title: '아직 리뷰가 없습니다', desc: '구매확정 후 마이페이지에서 첫 리뷰를 남겨 주세요.<br>글 리뷰 500원 · 포토 리뷰 1,000원 적립(예시)' })}</div>`),
        Canvas({ size: 'auto', label: '리뷰 · 상품문의 기능을 끈 몰 — 탭이 2개만', right: '탭 줄만', pad: 20 }, `<div style="width:560px">${Tabs(['상세정보', '배송·교환·반품'], '상세정보')}</div>`),
    ),
    Anno({ title: '탭 3 문의 — 왜 이렇게 하나' }, '상품 문의는 다른 고객에게도 정보가 되므로 목록을 공개하되, 비밀글은 제목 대신 비밀글입니다 로 가리고 쓴 사람과 운영자만 내용을 봅니다. 작성자는 가운데 글자를 가립니다. 답변이 달리면 고객에게 알림톡이 갑니다(문의 쓸 때 고른 경우). 쓰려면 로그인이 필요합니다.'),
    Canvas({ label: 'U-05 · 탭 3 문의 · 목록(비밀글 · 답변 상태) · 내 문의를 눌러 펼친 모습 · 로그인 상태' }, TabPage(INNER, '문의', QnaTab({ loggedIn: true }), { loggedIn: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: '상품 문의하기 버튼 → 작성 팝업(유형 선택 칸 열림)', right: '팝업만', pad: 20 },
            Modal({ title: '상품 문의하기', w: 480, foot: [Btn('취소'), Btn('문의 등록', 'primary')] },
                ProductRow({ name: SHOP.productShort, option: '상품 문의' }), '<div style="height:14px"></div>',
                Field({ label: '문의 유형', required: true }, Select({ value: '상품', open: true, w: 440, options: [{ t: '상품', on: true }, '재입고', '기타'] })),
                Field({ label: '문의 내용', required: true }, Textarea({ value: '하루 한 포라고 되어 있는데 두 포 먹어도 괜찮은지 궁금합니다.', h: 110, count: '34 / 1,000' })),
                `<div style="display:flex;flex-direction:column;gap:10px">${Check('비밀글로 문의하기 (나와 판매자만 볼 수 있습니다)', { on: true })}${Check('답변이 달리면 알림톡으로 받기 (010-****-1234)', { on: true })}</div>`,
            )),
        Canvas({ size: 'auto', label: '내용 없이 등록 누름 → 오류 / 등록 완료 안내', right: '팝업만', pad: 20 },
            `<div style="display:flex;flex-direction:column;gap:16px">${Modal({ title: '상품 문의하기', w: 440, foot: [Btn('취소'), Btn('문의 등록', 'primary')] },
                Field({ label: '문의 내용', required: true, error: '문의 내용을 10자 이상 입력해 주세요.' }, Textarea({ placeholder: '개인정보(전화번호 · 주소)는 적지 마세요.', h: 80, count: '0 / 1,000', error: true })),
            )}<div>${Toast('문의를 등록했습니다. 답변이 달리면 알림톡으로 알려 드립니다.')}</div></div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '비로그인으로 상품 문의하기 누름', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '로그인이 필요합니다', desc: '상품 문의는 로그인한 뒤 남길 수 있습니다.<br>로그인하면 이 상품으로 돌아옵니다.', foot: [Btn('취소'), Btn('로그인하기', 'primary')] })),
        Canvas({ size: 'auto', label: '남의 비밀글을 누름', right: '안내만', pad: 20 }, Toast('비밀글은 작성자와 판매자만 볼 수 있습니다.', { icon: 'lock-o' })),
        Canvas({ size: 'auto', label: '문의 0개 — 빈 상태', right: '본문만', pad: 20 }, `<div style="width:420px">${Empty({ icon: 'message-o', title: '아직 문의가 없습니다', desc: '궁금한 점을 남기시면 영업일 1일 안에 답변드립니다.', action: Btn('상품 문의하기', 'primary') })}</div>`),
    ),
    Anno({ title: '탭 4 배송·교환·반품 — 설정값이 자동으로' }, '이 탭은 운영자가 상품마다 손으로 쓰지 않습니다. 상품에 연결한 배송비 템플릿(설정 > 배송 A-92)의 배송비 · 제주 추가 · 택배사 · 반품지 · 반품/교환 배송비와, 주문·클레임 정책(A-93)의 반품 기한이 자동으로 채워집니다. 설정을 바꾸면 모든 상품 상세가 한꺼번에 바뀝니다. 맨 아래 덧붙임 글만 운영자가 자유롭게 적습니다.'),
    Canvas({ label: 'U-05 · 탭 4 배송 · 교환 · 반품 안내 · 배송비 템플릿과 정책 설정값에서 자동 생성' }, TabPage(INNER, '배송·교환·반품', [
        `<h3 style="font-size:16px;margin:0 0 10px">배송 안내</h3>`, Table({ dense: true, cols: [{ t: '항목', w: 200 }, '내용'], rows: SHIPINFO }),
        `<h3 style="font-size:16px;margin:28px 0 10px">교환 · 반품 안내</h3>`, Table({ dense: true, cols: [{ t: '항목', w: 200 }, '내용'], rows: RETURNINFO }),
        `<h3 style="font-size:16px;margin:28px 0 10px">판매자 정보</h3>`, Table({ dense: true, cols: [{ t: '항목', w: 200 }, '내용'], rows: [['상호 · 대표', `${SHOP.name} ${SHOP.nameEn} · ${SHOP.ceo}`], ['사업자등록번호', SHOP.bizNo], ['고객센터', '070-****-1234 · 평일 10:00 ~ 17:00']] }),
        Note('덧붙임 글(운영자 입력): 명절 · 창고 이전 등으로 출고가 쉬는 날은 공지사항에서 알려 드립니다.'),
    ].join(''))),
    Anno({ title: '모바일에서는' }, '탭 줄은 그대로 4칸이고 내용은 한 줄로 쌓입니다. 포토 모아보기는 4칸 2줄, 별점 분포는 평균 아래로 내려갑니다. 구매 버튼은 화면 아래 고정 바(U-06)에 있습니다.'),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-05 · 모바일 · 리뷰 탭' }, MobilePage({ title: '', tab: false, right: `${Icon('search')}<span class="cart">${Icon('cart-o')}<em>1</em></span>`, bottom: [Btn(Icon('heart-o'), { w: 52 }), Btn('구매하기', 'primary')] }, CSS,
            `<div style="margin:-16px -16px 0;overflow:hidden" data-clip="1">${Tabs([{ t: '상세정보' }, { t: '리뷰', n: 128 }, { t: '문의', n: 12 }, { t: '배송·교환·반품' }], '리뷰').replace('wf-tabs ', 'wf-tabs u05-mt ')}</div><style>.u05-mt .tab{padding:10px 10px;font-size:13px}</style>`,
            `<div style="text-align:center;margin-bottom:12px"><b style="font-size:32px">4.8</b><br>${Stars(5)} <span style="font-size:12.5px;color:var(--mute)">리뷰 128개</span></div>`,
            DIST.slice(0, 3).map(([s, n, w]) => `<div class="u05-bar"><span>${s}점</span><div class="tr"><span style="width:${w}%"></span></div><em>${n}</em></div>`).join(''),
            `<div class="u05-photos" style="grid-template-columns:repeat(4, minmax(0, 1fr));margin-top:14px">${Array.from({ length: 8 }, (_, i) => `<div>${Img({ ratio: '1/1', label: '' })}${i === 7 ? '<span class="u05-more">+38</span>' : ''}</div>`).join('')}</div>`,
            `<div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px"><span>추천순 ${Icon('angle-down-min')}</span>${Check('포토 리뷰만')}</div>`,
            Review({ ...REVIEWS[0], p: 3, a: '' }),
        )),
        Canvas({ size: 'mobile', label: 'U-05 · 모바일 · 문의 탭 → 상품 문의하기 → 작성 화면(전체 화면)' }, MobilePage({ title: '상품 문의하기', tab: false, right: '', bottom: [Btn('문의 등록', 'primary')] },
            ProductRow({ name: SHOP.productShort, option: '상품 문의' }), '<div style="height:14px"></div>',
            Field({ label: '문의 유형', required: true }, Select({ value: '상품', w: 358 })),
            Field({ label: '문의 내용', required: true }, Textarea({ placeholder: '궁금한 점을 적어 주세요. 개인정보(전화번호 · 주소)는 적지 마세요.', h: 140, count: '0 / 1,000' })),
            `<div style="display:flex;flex-direction:column;gap:12px;white-space:normal">${Check('비밀글로 문의하기', { on: true })}${Check('답변이 달리면 알림톡으로 받기', { on: true })}</div>`,
        )),
    ),
);

const state7 = StateBlock({ idx: 7, title: '비로그인 찜 → 로그인 유도', note: '로그인하지 않은 채 하트(찜)를 누르면 로그인 안내가 뜹니다. 로그인하면 보던 상품으로 돌아오고 찜이 된 상태가 됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '찜은 계정에 저장되어 다른 기기에서도 보여야 하므로 로그인이 필요합니다(장바구니는 비회원도 쓸 수 있는 것과 다름). 바로 로그인 화면으로 넘기지 않고 왜 필요한지 한 줄로 알려 준 뒤 고르게 합니다. 로그인 · 가입을 마치면 누르려던 찜을 자동으로 마저 처리해 다시 누르지 않게 합니다.'),
    Anno({ title: '이어지는 화면' }, '찜한 상품은 마이페이지 > 찜한 상품(U-29, /mypage/wishlist)에 모입니다. 안내 문구의 마이페이지에서 볼 수 있다는 말과 토스트의 찜한 상품 보기가 그 화면으로 이어집니다. 찜은 상품 단위로 저장하고 옵션은 저장하지 않습니다.'),
    Canvas({ label: 'U-05 · 비로그인 · 하트 누름 → 로그인 안내 팝업' }, Overlay({ bg: Page(INNER, {}, Info(INNER, Opt(['구성', Sets(-1)]), Sum(0, '0원'), Buttons({ disabled: true }))), h: 460 },
        Confirm({ w: 400, title: '로그인이 필요합니다', desc: '찜한 상품은 로그인하면 마이페이지에서 언제든 다시 볼 수 있습니다.<br>로그인하면 이 상품으로 돌아옵니다.', foot: [Btn('취소'), Btn('로그인하기', 'primary')] }))),
    Canvas({ label: 'U-05 · 로그인하기 → U-10 로그인 → 로그인 완료 → 이 상품으로 돌아옴 · 하트가 채워지고 안내가 3초 뜸' }, Overlay({ bg: Page(INNER, {}, Info(INNER, Opt(['구성', Sets(-1)]), Sum(0, '0원'), Buttons({ disabled: true, liked: true })), { loggedIn: true }), dim: false, align: 'top', h: 420 },
        Toast('찜한 상품에 담았습니다.', { action: '찜한 상품 보기', icon: 'heart' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '로그인 상태에서 채워진 하트를 다시 누름 → 찜 해제', right: '안내만', pad: 20 }, Toast('찜을 해제했습니다.', { icon: 'heart-o' })),
        Canvas({ size: 'mobile', label: 'U-05 · 모바일 · 하단 고정 바의 하트 누름(비로그인) → 로그인 안내' }, Overlay({ bg: MobilePage({ title: '', tab: false, bottom: [Btn(Icon('heart-o'), { w: 52 }), Btn('구매하기', 'primary')] }, CSS, Img({ ratio: '1/1', label: '상품 대표 이미지' }), `<h1 class="u05-name" style="font-size:18px">${SHOP.product}</h1>`), h: 720 },
            Confirm({ w: 310, title: '로그인이 필요합니다', desc: '찜한 상품은 로그인하면 마이페이지에서 다시 볼 수 있습니다.', foot: [Btn('취소'), Btn('로그인하기', 'primary')] }))),
    ),
);

const CAL_CSS = `<style>
.u05-cal { border: 1px solid var(--dark); border-radius: 6px; padding: 12px; margin-top: 4px; background: #fff; box-shadow: 0 6px 16px rgba(0,0,0,.12); }
.u05-cal .hd { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 14px; margin-bottom: 8px; }
.u05-cal .gr { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; font-size: 12.5px; }
.u05-cal .gr span { height: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; line-height: 1.1; }
.u05-cal .gr .w { height: 24px; color: var(--mute); font-size: 11.5px; }
.u05-cal .gr .no { color: #b0b0b8; text-decoration: line-through; }
.u05-cal .gr .off { color: #b0b0b8; background: var(--box); }
.u05-cal .gr .off em, .u05-cal .gr .td em { font-style: normal; font-size: 9.5px; text-decoration: none; }
.u05-cal .gr .td { border: 1px dashed #9a9aa2; color: #b0b0b8; }
.u05-cal .gr .ok { font-weight: 700; border: 1px solid var(--line); }
.u05-cal .gr .on { background: var(--dark); color: #fff; font-weight: 800; }
.u05-cal .lg { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--line2); font-size: 11.5px; color: var(--ink2); }
.u05-cal .lg i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; vertical-align: -2px; margin-right: 4px; }
.u05-pick { display: grid; gap: 8px; }
.u05-pick > div { border: 1px solid #b4b4bb; border-radius: 6px; padding: 10px; font-size: 12.5px; line-height: 1.5; }
.u05-pick > div b { display: block; font-size: 13.5px; }
.u05-pick > div.on { border: 2px solid var(--dark); padding: 9px; }
.u05-pick > div.off { background: var(--fill); color: #a2a2aa; text-decoration: line-through; }
</style>`;
const Cal = (pick) => `<div class="u05-cal"><div class="hd">${Icon('angle-left-min')}<span>2026년 11월</span>${Icon('angle-right-min')}</div><div class="gr">${['일', '월', '화', '수', '목', '금', '토'].map((w) => `<span class="w">${w}</span>`).join('')}${Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
    if (d === pick) return `<span class="on">${d}</span>`;
    if (d < 11) return `<span class="no">${d}</span>`;
    if (d === 11) return `<span class="td">${d}<em>오늘</em></span>`;
    if (d < 13) return `<span class="no">${d}</span>`;
    if (d % 7 === 1) return `<span class="off">${d}<em>휴무</em></span>`;
    return `<span class="ok">${d}</span>`;
}).join('')}</div><div class="lg"><span><i style="border:1px solid var(--line)"></i>고를 수 있음</span><span><i style="background:var(--dark)"></i>선택됨</span><span><s>12</s> 마감(지난 날 · 준비 기간)</span><span><i style="background:var(--box)"></i>휴무(쉬는 요일)</span></div></div>`;
const Pick = (items, on, cols = 2) => `<div class="u05-pick" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))">${items.map((it, i) => `<div class="${i === on ? 'on' : ''}${it.off ? ' off' : ''}"><b>${it.t}${i === on ? ` ${Icon('check-min')}` : ''}</b>${it.s ? `${it.s}<br>` : ''}${it.off ? '품절' : it.p}</div>`).join('')}</div>`;

const FLOWER = { name: '시즌 꽃다발', sub: '제철 꽃으로 그날 만드는 꽃다발 · 받고 싶은 날에 맞춰 보내 드립니다', price: '45,000원부터', badges: ['당일 제작'], reviews: 61, ship: '4,000원 · 꽃 전용 포장 (다른 업종 예시 값)' };
const SIZES_F = [{ t: '미디엄', s: '지름 약 25 cm', p: '45,000원' }, { t: '라지', s: '지름 약 35 cm', p: '65,000원' }];
const InOpt = (o = {}) => Opt(
    ['크기', Pick(SIZES_F, o.size === undefined ? 1 : o.size)],
    [`배송 희망일 <em class="req">필수</em>`, `${Input({ value: o.date || '', placeholder: '받고 싶은 날을 선택해 주세요', icon: 'calendar', focus: o.cal, error: o.dateErr })}${o.cal ? Cal(o.pick) : ''}${o.dateErr ? `<p class="u05-msg">${Icon('error-o')}배송 희망일을 선택해 주세요.</p>` : o.cal ? '' : '<p class="help">오늘부터 2일 뒤 ~ 30일 뒤까지 고를 수 있습니다. 일요일은 쉽니다.</p>'}`],
    [`메시지 카드 문구 <span style="font-weight:500;color:var(--mute)">(선택)</span>`, `${Textarea({ value: o.msg || '', placeholder: '카드에 적을 문구를 입력해 주세요. 비워 두면 카드 없이 보냅니다.', h: 76, count: o.count || '0 / 100', error: o.msgFull })}${o.msgFull ? `<p class="u05-msg">${Icon('error-o')}100자까지 입력할 수 있습니다.</p>` : ''}`],
);
const FPage = (info) => Page(FLOWER, { label: '상품 대표 이미지 1000 × 1000 · 꽃다발' }, `${CAL_CSS}${info}`, { cat: '꽃다발' });
const FPanel = (label, info) => Panel(label, `${CAL_CSS}${info}`);
const MSG = '생일 축하해. 올해도 건강하고 웃는 날이 많기를 바랄게. - 민지';

const state8 = StateBlock({ idx: 8, title: '입력형 옵션(문구·날짜 달력)', note: '고르는 옵션이 아니라 고객이 직접 적는 옵션. 꽃의 배송 희망일(날짜)과 메시지 카드 문구(글자)가 대표 예입니다(다른 업종 예시: 꽃).' },
    Anno({ title: '왜 이렇게 하나' }, '배송 희망일을 고르는 옵션으로 만들면 날짜마다 품목과 재고가 생겨 관리할 수 없습니다. 그래서 재고와 무관한 입력형 옵션을 따로 둡니다(상품마다 최대 5개, 종류는 글자 · 날짜). 입력한 값은 선택 목록의 줄에 딸려 장바구니 · 주문서 · 주문 상세 · 관리자 발주 확인 목록과 엑셀까지 그대로 따라갑니다. 필수 입력형 옵션을 비우면 구매 버튼이 켜지지 않습니다.'),
    Anno({ title: '달력의 날짜 상태 · 관리자가 바꾸는 범위' }, '고를 수 있음(테두리) / 선택됨(검게 채움) / 마감(지난 날과 준비 기간 — 줄 긋고 흐림) / 휴무(쉬는 요일 — 회색 바탕) / 오늘(점선 테두리, 준비 기간이라 선택 불가). 고를 수 있는 범위(오늘부터 며칠 뒤 ~ 며칠 뒤)와 쉬는 요일, 글자 수 제한, 필수 여부는 상품 등록(A-21)의 입력형 옵션에서 정합니다. 범위를 벗어난 달로는 넘어가지 않습니다(화살표 흐림).'),
    Canvas({ label: 'U-05 · 입력형 옵션이 있는 상품 · 크기는 기본 선택(라지) · 필수인 배송 희망일이 비어 구매 버튼 비활성(다른 업종 예시: 꽃)' }, FPage(Info(FLOWER,
        InOpt({}), Sum(0, '0원'), Buttons({ disabled: true, msg: '배송 희망일을 선택하면 구매할 수 있습니다.' })))),
    CanvasRow(
        FPanel('배송 희망일 칸 누름 → 달력 펼침 · 날짜 상태 5가지(오늘 11-11 기준)', Info(FLOWER, InOpt({ cal: true }), Sum(0, '0원'), Buttons({ disabled: true }))),
        FPanel('11월 20일 누름 → 달력에 선택 표시(누르면 달력이 닫히고 칸에 날짜가 들어감)', Info(FLOWER, InOpt({ cal: true, pick: 20, date: '2026-11-20 (금)' }), Sum(0, '0원'), Buttons({ disabled: true }))),
    ),
    CanvasRow(
        FPanel('날짜 · 문구 입력 끝 → 선택 목록 줄에 입력값이 딸려 나옴 · 버튼 활성', Info(FLOWER,
            InOpt({ date: '2026-11-20 (금)', msg: MSG, count: '37 / 100' }),
            `<div class="u05-sel"><div class="t"><span>라지<br><span style="font-size:12.5px;color:var(--ink2)">배송 희망일 2026-11-20 (금)<br>메시지 카드 ${MSG}</span></span>${Icon('close-min')}</div><div class="b">${Qty(1)}<b>65,000원</b></div></div>`,
            Sum(1, '65,000원'), Buttons())),
        FPanel('입력 오류 · 필수 날짜 없이 구매 누름 / 문구가 100자에 닿음(더 입력되지 않음)', Info(FLOWER,
            InOpt({ dateErr: true, msg: '생일 축하해. 올해도 건강하고 웃는 날이 많기를 바랄게. 늘 고맙고, 다음 달에 만나서 맛있는 것 먹자. 그때까지 감기 조심하고 잘 지내고 있어야 해 알았지', count: '100 / 100', msgFull: true }),
            Sum(0, '0원'), Buttons({ disabled: true }))),
    ),
    Note('같은 크기를 희망일이 다르게 두 번 담으면 장바구니에 두 줄로 따로 들어갑니다(입력값이 다르면 다른 줄).'),
);

const CREAM2 = { name: '시카 수분 크림', sub: '민감한 피부를 위한 저자극 수분 크림 · 용량 2가지', price: '32,000원부터', badges: [], reviews: 356, point: '구매 금액의 1% 적립' };
const VOLS = [{ t: '50 ml', p: '32,000원' }, { t: '100 ml', s: '50 ml 대비 15% 절약', p: '54,000원' }];
const ADDONS = [{ t: '전용 파우치', sub: '+3,000원' }, { t: '선물 포장 (품절)', sub: '+2,000원', disabled: true }];
const AddRow = (name, qty, price, note) => `<div class="u05-sel" style="margin-left:18px"><div class="t"><span>${Badge('추가구성', 'line')} ${name}</span>${Icon('close-min')}</div><div class="b">${Qty(qty)}<b>${price}</b></div>${note ? `<p class="u05-msg">${Icon('error-o')}${note}</p>` : ''}</div>`;
const AOpt = (o = {}) => Opt(
    ['용량', Pick(VOLS, o.vol === undefined ? -1 : o.vol)],
    [`추가구성상품 <span style="font-weight:500;color:var(--mute)">(선택) · 파우치 · 포장</span>`, o.open ? Select({ placeholder: '함께 구매할 상품을 선택해 주세요', open: true, options: ADDONS }) : Select({ placeholder: o.lock ? '상품을 먼저 선택해 주세요' : '함께 구매할 상품을 선택해 주세요', disabled: o.lock })],
);
const APanel = (label, info) => Panel(label, `${CAL_CSS}${info}`);

const state9 = StateBlock({ idx: 9, title: '추가구성상품 선택', note: '본 상품과 함께 살 수 있는 곁들이 상품(파우치 · 선물 포장 등). 본 상품을 하나 이상 골라야 고를 수 있습니다(다른 업종 예시: 화장품).' },
    Anno({ title: '왜 이렇게 하나' }, '추가구성상품은 혼자서는 팔지 않고 본 상품에 딸려 가는 상품입니다. 그래서 본 상품을 고르기 전에는 잠겨 있고, 선택 목록에서도 본 상품 줄 아래에 들여 써서 딸린 줄임을 보여 줍니다. 추가구성도 자기 재고와 가격이 있어 품절이면 목록에서 줄이 그어집니다. 합계는 본 상품 금액 + 추가구성 금액입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '본 상품 줄을 지우면 딸린 추가구성 줄도 함께 빠집니다(추가구성만 남아 결제되는 일을 막음). 주문 뒤 본 상품을 전부 취소 · 반품하면 추가구성도 함께 취소 · 반품됩니다. 추가구성이 등록되지 않은 상품은 이 선택 칸이 통째로 없습니다. 추가구성 수량은 본 상품 수량과 따로 조절합니다.'),
    Canvas({ label: 'U-05 · 추가구성상품이 있는 상품 · 본 상품(용량)을 아직 안 고름 → 추가구성 칸 잠김(다른 업종 예시: 화장품)' }, Page(CREAM2, {}, `${CAL_CSS}${Info(CREAM2,
        AOpt({ lock: true }), Sum(0, '0원'), Buttons({ disabled: true, msg: '용량을 선택하면 구매할 수 있습니다.' }))}`, { cat: '스킨케어', loggedIn: true })),
    CanvasRow(
        APanel('50 ml 고름 → 추가구성 칸이 열림 → 목록 펼침(가격 · 품절 표시)', Info(CREAM2,
            AOpt({ vol: 0, open: true }), Sel('50 ml', 1, '32,000원'), Sum(1, '32,000원'), Buttons())),
        APanel('전용 파우치 고름 → 본 상품 줄 아래에 추가구성 줄 · 합계에 더해짐', Info(CREAM2,
            AOpt({ vol: 0 }), Sel('50 ml', 1, '32,000원'), AddRow('전용 파우치', 1, '3,000원'),
            `<div class="u05-sum"><span>총 상품 금액</span><span><em>상품 1개 · 추가구성 1개</em><b>35,000원</b></span></div>`, Buttons())),
    ),
    CanvasRow(
        APanel('추가구성 수량을 재고보다 많이 올림 → 줄 아래 안내', Info(CREAM2,
            AOpt({ vol: 0 }), Sel('50 ml', 2, '64,000원'), AddRow('전용 파우치', 5, '15,000원', '전용 파우치는 5개 남았습니다. 5개까지 담을 수 있습니다.'),
            `<div class="u05-sum"><span>총 상품 금액</span><span><em>상품 2개 · 추가구성 5개</em><b>79,000원</b></span></div>`, Buttons())),
        Canvas({ size: 'auto', label: '추가구성이 딸린 본 상품 줄의 닫기를 누름 → 함께 빠진다는 확인', right: '팝업만', pad: 20 },
            Confirm({ w: 380, title: '50 ml 를 빼면 전용 파우치도 함께 빠집니다', desc: '추가구성상품은 본 상품과 함께만 구매할 수 있습니다.', foot: [Btn('취소'), Btn('함께 빼기', 'primary')] })),
    ),
);

const SCENTS = ['01 화이트 머스크', '02 블랙 체리', '03 우드 세이지', '04 프레시 린넨', '05 얼그레이', '06 피그 트리', '07 라벤더', '08 시더우드', '09 그린 티', '10 로즈 가든'];
const innerPick = (on, soldIdx) => Pick(SHOP.options.map((o, i) => ({ t: o.name.replace(/\(.*/, ''), s: ['14일분', '28일분', '56일분'][i], p: o.price, off: i === soldIdx })), on, 3);

const state10 = StateBlock({ idx: 10, title: '단독형 옵션 기본 품목 미리 선택', note: '옵션 축이 1개인 단독형 상품은 운영자가 기본 선택으로 지정한 품목이 들어오자마자 골라져 있어, 아무것도 누르지 않아도 바로 구매할 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이너에라처럼 구성만 고르는 상품에서 들어오자마자 구매 버튼이 꺼져 있으면 고객이 한 번 더 눌러야 하고, 그 한 번에서 이탈합니다. 운영자가 상품 등록(A-21)의 품목 표에서 기본 선택으로 지정한 품목 1개가 수량 1로 선택 목록에 미리 들어갑니다. 다른 구성을 누르면 선택 목록에 줄이 더해지고, 미리 들어간 줄은 지울 수 있습니다.'),
    Anno({ title: '초기값 · 유형별 차이' }, '기본 선택을 지정하지 않으면 미선택으로 시작합니다(2번 상태와 같음). 기본 품목이 품절이면 미리 고르지 않고 미선택으로 시작합니다. 값이 8개 이하면 버튼형, 9개 이상이면 선택 상자형으로 자동으로 바뀝니다. 이너에라의 기본 선택 품목은 고객 확인이 필요한 값이라 2박스(28일분)을 예시로 그렸습니다. 조합형(축 2개 이상)에는 기본 선택이 없습니다.'),
    Canvas({ label: 'U-05 · 이너에라 · 들어오자마자 기본 품목 2박스(28일분)이 선택됨 · 선택 목록 1줄 · 구매 버튼 활성(기본 품목 · 가격은 예시)' }, Page(INNER, { label: '상품 대표 이미지 1000 × 1000 · 젤리스틱 상자와 스틱' }, `${CAL_CSS}${Info(INNER,
        Opt(['구성', innerPick(1)]), Sel('2박스(28일분)', 1, '93,000원(예시)'), Sum(1, '93,000원(예시)'), Buttons())}`, { below: DetailTabs('상세정보') })),
    CanvasRow(
        APanel('기본 품목(2박스)이 품절일 때 → 미리 고르지 않고 미선택으로 시작 · 버튼 비활성', Info(INNER,
            Opt(['구성', innerPick(-1, 1)]), Sum(0, '0원'), Buttons({ disabled: true, msg: '구성을 선택하면 구매할 수 있습니다.' }))),
        APanel('미리 들어간 줄을 지움 → 선택 목록이 비고 버튼 비활성(버튼의 선택 표시도 풀림)', Info(INNER,
            Opt(['구성', innerPick(-1)]), Sum(0, '0원'), Buttons({ disabled: true, msg: '구성을 선택하면 구매할 수 있습니다.' }))),
    ),
    CanvasRow(
        APanel('값이 9개 이상인 단독형 → 선택 상자형 · 기본 품목이 골라진 채 시작(다른 업종 예시: 디퓨저 향 10가지)', Info({ name: '리드 디퓨저 200 ml', sub: '향 10가지 · 리드 스틱 5개 포함', price: '28,000원', badges: [], reviews: 47 },
            Opt(['향', Select({ value: '01 화이트 머스크' })]), Sel('01 화이트 머스크', 1, '28,000원'), Sum(1, '28,000원'), Buttons())),
        APanel('선택 상자를 연 모습 · 기본 품목에 체크 · 품절 품목은 줄 긋고 선택 불가', Info({ name: '리드 디퓨저 200 ml', sub: '향 10가지 · 리드 스틱 5개 포함', price: '28,000원', badges: [], reviews: 47 },
            Opt(['향', Select({ value: '01 화이트 머스크', open: true, options: SCENTS.map((t, i) => ({ t: i === 4 ? `${t} (품절)` : t, on: i === 0, disabled: i === 4 })) })]), Sel('01 화이트 머스크', 1, '28,000원'), Sum(1, '28,000원'), Buttons())),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U05() {
    return fixBand([state1, state2, state3, state4, state5, state6, state7, state8, state9, state10].join(''));
}
