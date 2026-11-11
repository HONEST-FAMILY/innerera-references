import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Select, Qty, Img, Thumb, Icon, Overlay, BottomSheet, Toast, MobilePage, Tabs, Stars, Note, SHOP,
    Input, Textarea,
} from '../lib/blocks.js';

const CSS = `<style>
.u06-name { font-size: 18px; font-weight: 800; line-height: 1.4; margin: 12px 0 4px; }
.u06-price { font-size: 20px; font-weight: 800; margin: 6px 0 10px; }
.u06-kv { font-size: 12.5px; color: var(--ink2); border-top: 1px solid var(--line2); padding-top: 10px; line-height: 1.9; }
.u06-bar { display: flex; gap: 8px; padding: 10px 16px; border-top: 1px solid var(--line); background: #fff; }
.u06-bar .wf-btn { height: 48px; flex: 1; }
.u06-bar .wf-btn.hb { flex: none; width: 52px; flex-direction: column; gap: 0; font-size: 10.5px; padding: 0; }
.u06-bar .wf-btn.hb i { font-size: 20px; }
.u06-sheet label { display: block; font-size: 13px; font-weight: 700; margin: 0 0 6px; }
.u06-sheet .wf-input, .u06-sheet .wf-select-open { width: 100% !important; }
.u06-sheet .row { margin-bottom: 12px; }
.u06-sel { background: var(--box); border: 1px solid var(--line2); border-radius: 6px; padding: 12px; margin-bottom: 8px; font-size: 13.5px; }
.u06-sel .t { display: flex; justify-content: space-between; margin-bottom: 8px; }
.u06-sel .b { display: flex; justify-content: space-between; align-items: center; }
.u06-sum { display: flex; justify-content: space-between; align-items: baseline; padding-top: 12px; margin-top: 12px; border-top: 1px solid var(--dark); font-size: 13.5px; }
.u06-sum b { font-size: 20px; }
.u06-sum em { font-style: normal; color: var(--mute); font-size: 12.5px; margin-right: 6px; }
.u06-msg { margin: 8px 0 0; font-size: 12.5px; font-weight: 700; display: flex; gap: 4px; align-items: center; }
.u06-free { background: var(--box); border-radius: 6px; padding: 10px 12px; font-size: 12.5px; margin-top: 12px; }
.u06-free .tr { height: 6px; border-radius: 3px; background: var(--fill); margin-top: 6px; overflow: hidden; }
.u06-free .tr span { display: block; height: 100%; background: var(--dark); }
</style>`;

const HeartBtn = (liked, n) => `<span class="wf-btn line hb">${Icon(liked ? 'heart' : 'heart-o')}${n || '찜'}</span>`;
const Bar = (o = {}) => `<div class="u06-bar">${HeartBtn(o.liked, o.likes)}${o.soldout ? Btn('재입고 알림 신청', { kind: 'primary', icon: 'bell-o' }) : `${Btn('장바구니')}${Btn('구매하기', 'primary')}`}</div>`;

const DetailBody = (p = {}) => `${CSS}<div style="margin:-16px -16px 0;position:relative">${Img({ ratio: '1/1', label: '상품 대표 이미지 1000 × 1000 · 좌우로 밀기 1 / 5' })}${p.soldout ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(40,40,46,.55);color:#fff;font-size:20px;font-weight:800">품절</div>' : ''}</div>
<div style="display:flex;gap:4px;margin-top:14px">${Badge(p.badge || 'GIP-01 특허원료')}</div>
<h1 class="u06-name">${p.name || SHOP.product}</h1>
<div style="display:flex;gap:6px;align-items:center;font-size:12.5px">${Stars(5)}<b>4.8</b><span style="color:var(--mute);text-decoration:underline">리뷰 ${p.reviews || 128}</span></div>
<div class="u06-price"${p.soldout ? ' style="color:var(--mute)"' : ''}>${p.price || '49,000원(예시)부터'}</div>
<div class="u06-kv">배송비 3,000원 · 5만원 이상 무료(예시)<br>오늘 14시 전 결제 시 오늘 출고</div>
<div style="margin:14px -16px 0;overflow:hidden" data-clip="1">${Tabs([{ t: '상세정보' }, { t: '리뷰', n: p.reviews || 128 }, { t: '문의', n: 12 }, { t: '배송·교환·반품' }], '상세정보').replace('class="wf-tabs ', 'style="font-size:13px" class="wf-tabs ')}</div>`;

const Page = (p, bar) => `<div class="m-page">${MobilePage({ title: ' ', tab: false, right: `${Icon('search')}<span class="cart">${Icon('cart-o')}${p.cart ? `<em>${p.cart}</em>` : ''}</span>` }, DetailBody(p)).replace('<div class="m-page">', '').replace(/<\/div>$/, '')}${bar}</div>`;

const Row = (label, ctl) => `<div class="row"><label>${label}</label>${ctl}</div>`;
const Sel = (name, qty, price, note) => `<div class="u06-sel"><div class="t"><span>${name}</span>${Icon('close-min')}</div><div class="b">${Qty(qty)}<b>${price}</b></div>${note ? `<p class="u06-msg">${Icon('error-o')}${note}</p>` : ''}</div>`;
const Sum = (n, total) => `<div class="u06-sum"><span>총 상품 금액</span><span><em>총 수량 ${n}개</em><b>${total}</b></span></div>`;
const Sheet = (o, ...body) => BottomSheet({ foot: o.foot || [Btn('장바구니', { disabled: o.disabled }), Btn('바로 구매', { kind: 'primary', disabled: o.disabled })] }, `<div class="u06-sheet">${body.join('')}</div>`);
const Open = (label, p, sheet, h = 720) => Canvas({ size: 'mobile', label }, Overlay({ bg: Page(p, Bar()), align: 'bottom', h }, sheet));

const innerOpts = (on) => SHOP.options.map((o, i) => ({ t: `${o.name}${i === 2 ? ' (품절)' : ''}`, sub: o.price, on: i === on, disabled: i === 2 }));
const Sets = (on = -1, sold) => `<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:8px">${SHOP.options.map((o, i) => {
    const off = sold === 'all' || (sold && i === 2);
    return `<div style="border:${i === on ? '2px solid var(--dark)' : '1px solid #b4b4bb'};border-radius:6px;padding:${i === on ? 9 : 10}px;font-size:12.5px;line-height:1.5;${off ? 'background:var(--fill);color:#a2a2aa;text-decoration:line-through' : ''}"><b style="display:block;font-size:13.5px">${o.name.replace(/\(.*/, '')}${i === on ? ` ${Icon('check-min')}` : ''}</b>${['14일분', '28일분', '56일분'][i]}<br>${off ? '품절' : o.price}</div>`;
}).join('')}</div>`;

const SHIRT = { name: '코튼 옥스퍼드 셔츠', price: '59,000원', reviews: 84, badge: '신상품' };
const CREAM = { name: '시카 수분 크림 50 ml', price: '32,000원', reviews: 356 };

const state1 = StateBlock({ idx: 1, title: '닫힘(하단 고정 바)', note: '모바일 상품 상세에서는 탭바 대신 화면 아래에 찜 · 장바구니 · 구매하기 바가 항상 붙어 있습니다. 스크롤을 어디까지 내려도 따라옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '모바일은 상세 이미지가 길어 구매 영역이 금방 화면 밖으로 사라집니다. 그래서 옵션 선택을 본문에 두지 않고, 아래 고정 바의 버튼을 누르면 시트가 올라오는 방식으로 통일합니다. 장바구니를 누르든 구매하기를 누르든 같은 시트가 열리고, 시트 안 버튼 두 개로 마무리합니다. 옵션이 없는 상품도 수량을 고르기 위해 시트가 열립니다.'),
    Anno({ title: '상태별 버튼 차이' }, '판매중 = 찜 · 장바구니 · 구매하기 / 전체 품절 = 찜 · 재입고 알림 신청(누르면 U-05 의 재입고 알림 팝업이 시트 모양으로) / 찜한 상품 = 채워진 하트. 찜은 비로그인이 누르면 로그인 안내가 뜹니다(U-05 7번 상태). 하트 아래 숫자는 리뷰 기능과 무관하게 보이며 관리자 사이트 기본에서 숨길 수 있습니다.'),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-06 · 시트 닫힘 · 하단 고정 바(찜 · 장바구니 · 구매하기)' }, Page({ cart: 1 }, Bar())),
        Canvas({ size: 'mobile', label: 'U-06 · 찜한 상품 · 채워진 하트' }, Page({ cart: 1 }, Bar({ liked: true }))),
        Canvas({ size: 'mobile', label: 'U-06 · 전체 품절 상품 · 바가 재입고 알림 신청으로 바뀜' }, Page({ soldout: true }, Bar({ soldout: true }))),
    ),
);

const state2 = StateBlock({ idx: 2, title: '열림·옵션 선택 중', note: '하단 바의 장바구니 또는 구매하기를 누르면 아래에서 시트가 올라옵니다. 뒤 화면은 어두워지고, 어두운 곳을 누르거나 시트를 아래로 끌면 닫힙니다(고른 내용은 유지).' },
    Anno({ title: '왜 이렇게 하나' }, 'PC 구매 영역과 규칙이 같습니다. 옵션을 모두 고르면 선택 목록에 줄이 생기고, 줄마다 수량을 바꾸고 지울 수 있으며, 한 줄 이상 있어야 아래 버튼이 켜집니다. 선택 칸을 누르면 목록이 시트 안에서 펼쳐지고 품절 품목은 줄이 그어져 누를 수 없습니다. 시트는 화면 높이의 80%까지만 올라오고 그보다 길면 시트 안에서 스크롤합니다.'),
    Anno({ title: '유형별 차이' }, '옵션 1축(이너에라 구성) = 선택 칸 1개 / 조합형 2축(의류) = 선택 칸 2개, 앞 축을 골라야 다음 축이 열림 / 옵션 없음(화장품 단품) = 선택 칸 없이 수량만 있고 버튼이 처음부터 켜짐. 금액은 예시이며 이너에라 판매가는 미확정입니다.'),
    CanvasRow(
        Open('U-06 · 구매하기 누름 → 시트 열림 · 이너에라 · 기본 선택을 지정하지 않은 경우 · 미선택 · 버튼 비활성', {}, Sheet({ disabled: true },
            Row('구성', Sets(-1)),
            Sum(0, '0원'), `<p class="u06-msg" style="font-weight:500">${Icon('info-o')}구성을 선택하면 구매할 수 있습니다.</p>`)),
        Open('U-06 · 4박스 품절 = 그 버튼만 잠김(선택 불가)', {}, Sheet({ disabled: true },
            Row('구성', Sets(-1, true)),
            Sum(0, '0원'))),
        Open('U-06 · 2박스 누름(기본 선택이 2박스인 몰은 열자마자 이 모습) → 선택 목록 · 수량 조절 · 합계 · 버튼 활성', {}, Sheet({},
            Row('구성', Sets(1)),
            Sel('2박스(28일분)', 1, '93,000원(예시)'),
            Sum(1, '93,000원(예시)'))),
    ),
    CanvasRow(
        Open('U-06 · 구성 두 가지 · 수량 올림 · 합계', {}, Sheet({},
            Row('구성', Sets(1)),
            Sel('1박스(14일분)', 2, '98,000원(예시)'), Sel('2박스(28일분)', 1, '93,000원(예시)'),
            Sum(3, '191,000원(예시)'))),
        Open('U-06 · 조합형 2축 · 색상 고른 뒤 사이즈 목록 펼침(다른 업종 예시: 의류)', SHIRT, Sheet({ disabled: true },
            Row('색상', Select({ value: '네이비' })),
            Row('사이즈', Select({ placeholder: '사이즈를 선택해 주세요', open: true, options: [{ t: 'S (품절)', disabled: true }, { t: 'M' }, { t: 'L', sub: '남은 수량 3개' }, { t: 'XL', sub: '+2,000원' }] })),
            Sum(0, '0원'))),
        Open('U-06 · 옵션 없는 상품 · 수량만 · 버튼 처음부터 활성(다른 업종 예시: 화장품)', CREAM, Sheet({},
            `<div class="u06-sel"><div class="t"><span>시카 수분 크림 50 ml</span></div><div class="b">${Qty(1)}<b>32,000원</b></div></div>`,
            Sum(1, '32,000원'))),
    ),
    CanvasRow(
        Open('U-06 · 재고보다 많이 올림 → 줄 아래 안내 · 수량은 남은 수량에서 멈춤', SHIRT, Sheet({},
            Row('색상', Select({ placeholder: '색상을 선택해 주세요' })), Row('사이즈', Select({ placeholder: '색상을 먼저 선택해 주세요', disabled: true })),
            Sel('네이비 / L', 3, '177,000원', '남은 수량이 3개입니다. 3개까지 담을 수 있습니다.'),
            Sum(3, '177,000원'))),
        Open('U-06 · 옵션을 덜 고르고 흐린 버튼 누름 → 안 고른 선택 칸 강조 + 안내', SHIRT, Sheet({ disabled: true },
            Row('색상', Select({ value: '네이비' })),
            Row('사이즈', `${Select({ placeholder: '사이즈를 선택해 주세요', error: true })}<p class="u06-msg">${Icon('error-o')}사이즈를 선택해 주세요.</p>`),
            Sum(0, '0원'))),
    ),
);

const DoneSheet = (o = {}) => BottomSheet({ foot: [Btn('계속 쇼핑'), Btn('장바구니 보기', 'primary')] },
    `<div style="text-align:center;padding:6px 0 14px"><div style="font-size:30px">${Icon('check-circle-o')}</div><b style="font-size:16px">장바구니에 담았습니다</b></div>`,
    `<div style="display:flex;gap:12px;align-items:center;border:1px solid var(--line);border-radius:6px;padding:10px">${Thumb(56)}<div style="font-size:13px"><b>${o.name || SHOP.productShort}</b><br><span style="color:var(--mute)">${o.opt || '2박스(28일분) · 1개'}</span></div><b style="margin-left:auto;font-size:13.5px">${o.price || '93,000원(예시)'}</b></div>`,
    o.free === false
        ? `<div class="u06-free"><b>1,000원</b> 더 담으면 배송비가 무료입니다 <span style="color:var(--mute)">(5만원 이상 무료 · 예시)</span><div class="tr"><span style="width:98%"></span></div></div>`
        : `<div class="u06-free">${Icon('truck')} 지금 주문하면 <b>배송비 무료</b>입니다</div>`,
);

const state3 = StateBlock({ idx: 3, title: '장바구니 담기 완료 안내', note: '시트에서 장바구니를 누르면 시트 내용이 담기 완료 안내로 바뀝니다. 머리의 장바구니 숫자가 올라갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '담은 뒤 고객이 할 일은 둘 중 하나입니다. 더 둘러보거나(계속 쇼핑 = 시트만 닫고 보던 자리 그대로), 결제하러 가거나(장바구니 보기 = U-07). 잠깐 떴다 사라지는 안내는 엄지로 누르기 전에 사라지므로 모바일에서는 시트로 남겨 둡니다. 배송비 무료까지 남은 금액도 여기서 한 번 알려 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '바로 구매는 이 안내를 거치지 않고 주문서(U-08)로 바로 갑니다. 비로그인이면 로그인 화면(U-10)이 먼저 나오고 거기에 비회원으로 주문하기가 함께 보입니다(비회원 주문 기능을 켠 몰). 이미 장바구니에 있는 같은 품목을 또 담으면 줄을 새로 만들지 않고 수량만 더합니다. 담는 순간 품절되었으면 담지 않고 안내합니다.'),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-06 · 장바구니 누름 → 담기 완료 안내 · 장바구니 숫자 1 → 2 · 무료배송 조건 채움' }, Overlay({ bg: Page({ cart: 2 }, Bar()), align: 'bottom', h: 720 }, DoneSheet())),
        Canvas({ size: 'mobile', label: 'U-06 · 담기 완료 · 1박스만 담아 무료배송까지 1,000원 남았을 때(기준 금액은 예시)' }, Overlay({ bg: Page({ cart: 1 }, Bar()), align: 'bottom', h: 720 },
            DoneSheet({ opt: '1박스(14일분) · 1개', price: '49,000원(예시)', free: false }))),
        Canvas({ size: 'mobile', label: 'U-06 · 이미 담긴 품목을 또 담음 → 수량을 더했다고 알림' }, Overlay({ bg: Page({ cart: 2 }, Bar()), align: 'bottom', h: 720 },
            BottomSheet({ foot: [Btn('계속 쇼핑'), Btn('장바구니 보기', 'primary')] },
                `<div style="text-align:center;padding:6px 0 14px"><div style="font-size:30px">${Icon('check-circle-o')}</div><b style="font-size:16px">장바구니에 이미 있는 상품이라<br>수량을 더했습니다</b></div>`,
                `<div style="display:flex;gap:12px;align-items:center;border:1px solid var(--line);border-radius:6px;padding:10px">${Thumb(56)}<div style="font-size:13px"><b>${SHOP.productShort}</b><br><span style="color:var(--mute)">2박스(28일분) · 1개에서 2개로</span></div></div>`))),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-06 · 계속 쇼핑 누름 → 시트 닫힘 · 보던 자리 그대로 · 장바구니 숫자만 바뀜' }, Page({ cart: 2 }, Bar())),
        Canvas({ size: 'mobile', label: 'U-06 · 담는 순간 품절됨 → 담지 않고 안내(시트는 열린 채)' }, Overlay({ bg: Overlay({ bg: Page({}, Bar()), align: 'bottom', h: 720 }, Sheet({ disabled: true },
            Row('구성', Sets(1)),
            Sel('2박스(28일분)', 1, '93,000원(예시)', '방금 품절되었습니다. 다른 구성을 선택해 주세요.'),
            Sum(1, '93,000원(예시)'))), dim: false, align: 'top', h: 720 },
            Toast('2박스(28일분)이 방금 품절되어 담지 못했습니다.', { kind: 'error' }))),
    ),
    Note('PC 에서는 같은 안내가 가운데 작은 팝업으로 뜹니다(U-05 1번 · 3번 상태에 그림).'),
);

const CAL_CSS = `<style>
.u06-cal { border: 1px solid var(--dark); border-radius: 6px; padding: 12px; margin-top: 4px; background: #fff; box-shadow: 0 6px 16px rgba(0,0,0,.12); }
.u06-cal .hd { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 14px; margin-bottom: 8px; }
.u06-cal .gr { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; font-size: 12.5px; }
.u06-cal .gr span { height: 36px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 4px; line-height: 1.1; }
.u06-cal .gr .w { height: 24px; color: var(--mute); font-size: 11.5px; }
.u06-cal .gr .no { color: #b0b0b8; text-decoration: line-through; }
.u06-cal .gr .off { color: #b0b0b8; background: var(--box); }
.u06-cal .gr .off em, .u06-cal .gr .td em { font-style: normal; font-size: 9.5px; text-decoration: none; }
.u06-cal .gr .td { border: 1px dashed #9a9aa2; color: #b0b0b8; }
.u06-cal .gr .ok { font-weight: 700; border: 1px solid var(--line); }
.u06-cal .gr .on { background: var(--dark); color: #fff; font-weight: 800; }
.u06-cal .lg { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--line2); font-size: 11.5px; color: var(--ink2); }
.u06-cal .lg i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; vertical-align: -2px; margin-right: 4px; }
.u06-pick { display: grid; gap: 8px; }
.u06-pick > div { border: 1px solid #b4b4bb; border-radius: 6px; padding: 10px; font-size: 12.5px; line-height: 1.5; }
.u06-pick > div b { display: block; font-size: 13.5px; }
.u06-pick > div.on { border: 2px solid var(--dark); padding: 9px; }
.u06-pick > div.off { background: var(--fill); color: #a2a2aa; text-decoration: line-through; }
</style>`;
const Cal = (pick) => `<div class="u06-cal"><div class="hd">${Icon('angle-left-min')}<span>2026년 11월</span>${Icon('angle-right-min')}</div><div class="gr">${['일', '월', '화', '수', '목', '금', '토'].map((w) => `<span class="w">${w}</span>`).join('')}${Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
    if (d === pick) return `<span class="on">${d}</span>`;
    if (d < 11) return `<span class="no">${d}</span>`;
    if (d === 11) return `<span class="td">${d}<em>오늘</em></span>`;
    if (d < 13) return `<span class="no">${d}</span>`;
    if (d % 7 === 1) return `<span class="off">${d}<em>휴무</em></span>`;
    return `<span class="ok">${d}</span>`;
}).join('')}</div><div class="lg"><span><i style="border:1px solid var(--line)"></i>고를 수 있음</span><span><i style="background:var(--dark)"></i>선택됨</span><span><s>12</s> 마감(지난 날 · 준비 기간)</span><span><i style="background:var(--box)"></i>휴무(쉬는 요일)</span></div></div>`;
const Pick = (items, on, cols = 2) => `<div class="u06-pick" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))">${items.map((it, i) => `<div class="${i === on ? 'on' : ''}${it.off ? ' off' : ''}"><b>${it.t}${i === on ? ` ${Icon('check-min')}` : ''}</b>${it.s ? `${it.s}<br>` : ''}${it.off ? '품절' : it.p}</div>`).join('')}</div>`;

const FLOWER = { name: '시즌 꽃다발', price: '45,000원부터', reviews: 61, badge: '당일 제작' };
const SIZES_F = [{ t: '미디엄', s: '지름 약 25 cm', p: '45,000원' }, { t: '라지', s: '지름 약 35 cm', p: '65,000원' }];
const FSheet = (o = {}) => Sheet({ disabled: o.disabled },
    CAL_CSS,
    Row('크기', Pick(SIZES_F, 1)),
    Row(`배송 희망일 <em class="req">필수</em>`, `${Input({ value: o.date || '', placeholder: '받고 싶은 날을 선택해 주세요', icon: 'calendar', focus: o.cal, error: o.dateErr })}${o.cal ? Cal(o.pick) : ''}${o.dateErr ? `<p class="u06-msg">${Icon('error-o')}배송 희망일을 선택해 주세요.</p>` : ''}`),
    o.cal ? '' : Row(`메시지 카드 문구 <span style="font-weight:500;color:var(--mute)">(선택)</span>`, Textarea({ value: o.msg || '', placeholder: '카드에 적을 문구를 입력해 주세요.', h: 84, count: o.count || '0 / 100' }).replace('class="wf-textarea', o.typing ? 'style="border:2px solid var(--dark)" class="wf-textarea' : 'class="wf-textarea')),
    o.cal ? '' : Sum(o.disabled ? 0 : 1, o.disabled ? '0원' : '65,000원'),
);
const Keys = `<div style="background:var(--fill);height:216px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:12px;color:#77777f;padding:0 24px">휴대폰 자판 영역<br>자판이 올라오면 시트가 자판 위로 밀려 입력 칸과 글자 수가 가려지지 않습니다</div>`;
const FOpen = (label, sheet, h = 760) => Canvas({ size: 'mobile', label }, Overlay({ bg: Page(FLOWER, Bar()), align: 'bottom', h }, sheet));

const state4 = StateBlock({ idx: 4, title: '입력형 옵션 입력 중', note: '입력형 옵션(날짜 · 글자)이 있는 상품의 시트. 날짜는 시트 안에서 달력이 펼쳐지고, 글자는 자판이 올라옵니다(다른 업종 예시: 꽃).' },
    Anno({ title: '왜 이렇게 하나' }, 'PC 구매 영역(U-05 8번 상태)과 같은 규칙을 시트에 담습니다. 고르는 옵션(크기)은 기본 품목이 미리 선택되어 있고, 필수 입력형 옵션(배송 희망일)을 채워야 아래 버튼이 켜집니다. 달력은 새 화면으로 넘기지 않고 시트 안에서 펼쳐 날짜를 누르면 닫히게 해, 엄지 한 번으로 끝냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '글자를 입력할 때 자판이 시트 아래 버튼과 입력 칸을 가리면 안 됩니다. 자판이 올라오면 시트 전체가 자판 위로 밀리고, 글자 수(37 / 100)가 계속 보입니다. 시트를 닫았다 다시 열어도 입력하던 날짜와 문구는 남아 있습니다. 달력의 날짜 상태(고를 수 있음 · 선택됨 · 마감 · 휴무 · 오늘)는 PC 와 같습니다.'),
    CanvasRow(
        FOpen('U-06 · 구매하기 누름 → 시트 열림 · 크기는 기본 선택(라지) · 필수 날짜가 비어 버튼 비활성', FSheet({ disabled: true })),
        FOpen('U-06 · 배송 희망일 칸 누름 → 시트 안에서 달력 펼침 · 11월 20일 누르는 중', FSheet({ disabled: true, cal: true, pick: 20, date: '2026-11-20 (금)' }), 800),
        FOpen('U-06 · 메시지 카드 문구 입력 중 · 자판이 올라와 시트가 위로 밀림 · 글자 수 표시', `<div style="width:100%">${FSheet({ date: '2026-11-20 (금)', msg: '생일 축하해. 올해도 건강하고 웃는 날이 많기를 바랄게. - 민지', count: '37 / 100', typing: true })}${Keys}</div>`, 900),
    ),
    CanvasRow(
        FOpen('U-06 · 입력 끝(자판 내려감) · 합계 · 버튼 활성', FSheet({ date: '2026-11-20 (금)', msg: '생일 축하해. 올해도 건강하고 웃는 날이 많기를 바랄게. - 민지', count: '37 / 100' })),
        FOpen('U-06 · 날짜를 안 고르고 흐린 버튼 누름 → 날짜 칸 강조 + 안내', FSheet({ disabled: true, dateErr: true })),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U06() {
    return fixBand([state1, state2, state3, state4].join(''));
}
