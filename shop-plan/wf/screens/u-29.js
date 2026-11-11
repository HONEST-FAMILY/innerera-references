import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Check, Select, Qty, Img, Thumb, Icon, Overlay, Modal, Confirm, Toast, MobilePage, MypageLayout, UserPage,
    Empty, Pager, Note, Field, Input, SHOP,
} from '../lib/blocks.js';

const CSS = `<style>
.u29-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--dark); margin-bottom: 18px; font-size: 13.5px; }
.u29-head .r { display: flex; gap: 6px; align-items: center; }
.u29-grid { display: grid; gap: 20px 16px; }
.u29-card { position: relative; font-size: 13.5px; }
.u29-card .im { position: relative; margin-bottom: 10px; }
.u29-card .ck { position: absolute; left: 8px; top: 8px; background: #fff; border-radius: 4px; padding: 3px; display: flex; }
.u29-card .hb { position: absolute; right: 8px; top: 8px; width: 30px; height: 30px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.u29-card .so { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(40,40,46,.55); color: #fff; font-weight: 800; font-size: 15px; }
.u29-card .nm { font-weight: 600; line-height: 1.4; }
.u29-card .ds { font-size: 12.5px; color: var(--mute); margin-top: 2px; }
.u29-card .pr { margin: 6px 0 10px; font-weight: 800; font-size: 15px; display: flex; gap: 6px; align-items: baseline; }
.u29-card .pr s { font-weight: 400; font-size: 12.5px; color: var(--mute); }
.u29-card.off .nm, .u29-card.off .pr { color: var(--mute); }
.u29-card.sel .im { outline: 2px solid var(--dark); outline-offset: 2px; }
.u29-pick { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.u29-pick > div { border: 1px solid #b4b4bb; border-radius: 6px; padding: 10px; font-size: 12.5px; line-height: 1.5; }
.u29-pick > div b { display: block; font-size: 13.5px; }
.u29-pick > div.on { border: 2px solid var(--dark); padding: 9px; }
.u29-pick > div.off { background: var(--fill); color: #a2a2aa; text-decoration: line-through; }
</style>`;

const Card = (o) => `<div class="u29-card${o.soldout || o.stopped ? ' off' : ''}${o.on ? ' sel' : ''}">
<div class="im">${Img({ ratio: '1/1', label: o.m ? '대표 이미지' : '상품 대표 이미지 1000 × 1000' })}${o.soldout ? '<span class="so">품절</span>' : ''}${o.stopped ? '<span class="so">판매 종료</span>' : ''}<span class="ck">${Check('', { on: o.on })}</span><span class="hb">${Icon('heart')}</span></div>
<div class="nm">${o.name}</div>${o.desc ? `<div class="ds">${o.desc}</div>` : ''}
<div class="pr">${o.rate ? `<span>${o.rate}</span>` : ''}${o.price}${o.orig ? `<s>${o.orig}</s>` : ''}</div>
${o.stopped ? Btn('삭제', { size: 'sm', block: true, icon: 'trash-o' }) : o.soldout ? (o.applied ? Btn('재입고 알림 신청됨', { size: 'sm', block: true, icon: 'check', disabled: true }) : Btn('재입고 알림 신청', { size: 'sm', block: true, icon: 'bell-o' })) : Btn(o.option ? '옵션 선택 후 담기' : '장바구니 담기', { size: 'sm', block: true, icon: 'cart-o' })}
</div>`;

const Head = (sel, total) => `<div class="u29-head">${Check(`전체 선택 (${sel} / ${total})`, { on: sel === total && total > 0, part: sel > 0 && sel < total })}<span class="r"><span style="color:var(--mute);font-size:12.5px;margin-right:6px">찜한 순</span>${Btn('선택 삭제', { size: 'sm', disabled: sel === 0 })}${Btn('선택 상품 장바구니 담기', { size: 'sm', disabled: sel === 0, icon: 'cart-o' })}</span></div>`;
const Grid = (cards, cols = 4) => `<div class="u29-grid" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))">${cards.join('')}</div>`;

const My = (o, ...body) => MypageLayout({ active: '찜한 상품', title: '찜한 상품', crumb: ['홈', '마이페이지', '찜한 상품'], cart: o.cart === undefined ? 1 : o.cart }, CSS, body);

const INNER = { name: SHOP.product, desc: '1박스 · 2박스 · 4박스', price: SHOP.options[0].price, option: true };
const OTHERS = [
    { name: '시카 수분 크림', desc: '50 ml · 100 ml', price: '32,000원', option: true },
    { name: '데일리 립밤 4 g', price: '12,000원' },
    { name: '저자극 선크림 50 ml', price: '22,000원', orig: '26,000원', rate: '15%' },
    { name: '시카 진정 토너 200 ml', price: '18,000원', soldout: true },
    { name: '수분 마스크 10매', price: '15,000원', soldout: true, applied: true },
    { name: '클렌징 폼 150 ml (이전 용기)', price: '-', stopped: true },
];
const Pick = (on, sold) => `<div class="u29-pick">${SHOP.options.map((o, i) => `<div class="${i === on ? 'on' : ''}${i === sold ? ' off' : ''}"><b>${o.name.replace(/\(.*/, '')}${i === on ? ` ${Icon('check-min')}` : ''}</b>${['14일분', '28일분', '56일분'][i]}<br>${i === sold ? '품절' : o.price}</div>`).join('')}</div>`;

const state1 = StateBlock({ idx: 1, title: '목록(품절 표시·장바구니 담기)', note: '주소 /mypage/wishlist. 상품 상세 · 목록에서 하트를 누른 상품이 모입니다. 마이페이지 왼쪽 메뉴 나의 쇼핑 > 찜한 상품, 상세의 찜 안내(찜한 상품 보기)에서 들어옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '찜은 나중에 사려고 표시해 둔 것이므로 이 화면의 목적은 장바구니로 옮기기입니다. 카드마다 장바구니 담기를 두고, 옵션이 있는 상품은 옵션을 고르는 작은 팝업을 거칩니다(찜은 상품 단위로 저장하고 옵션은 저장하지 않음). 품절 · 판매 종료 상품은 숨기지 않고 표시만 바꿉니다. 품절 = 재입고 알림 신청, 판매 종료 = 삭제만.'),
    Anno({ title: '초기값 · 관리자가 바꾸는 범위' }, '정렬은 최근에 찜한 순 고정, 한 쪽 20개. 가격 · 할인 · 품절 여부는 찜한 때가 아니라 지금 값입니다. 채워진 하트를 누르면 그 상품만 바로 찜에서 빠집니다(되돌리기 안내 3초). 운영자가 설정할 값은 없습니다. 왼쪽 메뉴의 찜한 상품 항목은 공통 마이페이지 메뉴에 추가되어야 하며, 이 그림에서는 추가된 모습으로 그렸습니다.'),
    Canvas({ label: 'U-29 · 찜한 상품 목록 · 판매중 3 + 품절 2(하나는 재입고 알림 신청됨) + 판매 종료 1(다른 업종 예시: 화장품)' }, My({},
        Head(0, 6),
        Grid(OTHERS.map(Card)),
        Pager({ page: 1, last: 1 }),
    )),
    Canvas({ label: 'U-29 · 이너에라 · 찜한 상품 1개(상품이 1개인 몰 · 가격은 예시)' }, My({},
        Head(0, 1),
        Grid([Card(INNER)]),
        Note('가격은 예시입니다(판매가 미확정).'),
    )),
    Canvas({ label: 'U-29 · 옵션 있는 상품의 옵션 선택 후 담기 누름 → 옵션 고르기 팝업(기본 품목 2박스가 골라진 채 · 4박스 품절)' }, Overlay({ bg: My({}, Head(0, 1), Grid([Card(INNER)])), h: 560 },
        Modal({ title: '옵션 선택', w: 460, foot: [Btn('취소'), Btn('장바구니 담기', 'primary')] },
            `<div style="display:flex;gap:12px;align-items:center;margin-bottom:16px">${Thumb(56)}<b style="font-size:13.5px">${SHOP.productShort}</b></div>`,
            `<b style="display:block;font-size:13px;margin-bottom:6px">구성</b>${Pick(1, 2)}`,
            `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">${Qty(1)}<b style="font-size:18px">93,000원(예시)</b></div>`,
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '옵션 없는 상품의 장바구니 담기 누름 → 바로 담김(3초 안내 · 찜에서는 빠지지 않음)', right: '안내만', pad: 20 }, Toast('장바구니에 담았습니다.', { action: '장바구니 보기' })),
        Canvas({ size: 'auto', label: '채워진 하트를 누름 → 그 상품만 찜에서 빠짐', right: '안내만', pad: 20 }, Toast('찜을 해제했습니다.', { action: '되돌리기', icon: 'heart-o' })),
        Canvas({ size: 'auto', label: '담는 순간 품절됨', right: '안내만', pad: 20 }, Toast('방금 품절되어 담지 못했습니다. 재입고 알림을 신청해 보세요.', { kind: 'error' })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-29 · 모바일 · 2열 · 탭바 마이' }, MobilePage({ title: '찜한 상품', tab: '마이' }, CSS,
            Head(0, 6).replace('선택 상품 장바구니 담기', '담기').replace('<span style="color:var(--mute);font-size:12.5px;margin-right:6px">찜한 순</span>', ''),
            Grid(OTHERS.slice(0, 4).map((x) => Card({ ...x, m: true })), 2),
        )),
        Canvas({ size: 'mobile', label: 'U-29 · 모바일 · 옵션 선택 후 담기 → 아래에서 올라오는 옵션 시트' }, Overlay({ bg: MobilePage({ title: '찜한 상품', tab: '마이' }, CSS, Head(0, 1), Grid([Card({ ...INNER, m: true })], 2)), align: 'bottom', h: 720 },
            `<div class="wf-sheet"><div class="grip"></div><div class="mh"><b>옵션 선택</b>${Icon('close')}</div><div class="mb">${CSS}<b style="display:block;font-size:13px;margin-bottom:6px">구성</b>${Pick(1, 2)}<div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">${Qty(1)}<b style="font-size:18px">93,000원(예시)</b></div></div><div class="mf">${Btn('취소')}${Btn('장바구니 담기', 'primary')}</div></div>`)),
    ),
);

const state2 = StateBlock({ idx: 2, title: '선택 삭제', note: '카드 왼쪽 위 체크박스로 여러 개를 골라 한 번에 지우거나 장바구니에 담습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '찜이 쌓이면 하나씩 하트를 눌러 정리하기 번거롭습니다. 전체 선택과 선택 삭제를 두고, 지우기 전에 한 번 확인합니다(여러 개를 한꺼번에 지우는 것은 되돌리기 어려우므로). 고른 카드는 테두리가 굵어져 어느 것이 선택됐는지 보입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '선택 상품 장바구니 담기는 옵션이 없는 상품만 바로 담고, 옵션이 있는 상품과 품절 · 판매 종료 상품은 담지 않은 채 몇 개가 왜 빠졌는지 알려 줍니다. 품절 상품을 지워도 이미 신청한 재입고 알림은 유지됩니다.'),
    Canvas({ label: 'U-29 · 2개 체크(판매 종료 1 · 품절 1) → 선택 삭제 · 선택 상품 장바구니 담기 버튼이 켜짐' }, My({},
        Head(2, 6),
        Grid(OTHERS.map((x, i) => Card({ ...x, on: i === 3 || i === 5 }))),
    )),
    Canvas({ label: 'U-29 · 선택 삭제 누름 → 확인 팝업' }, Overlay({ bg: My({}, Head(2, 6), Grid(OTHERS.map((x, i) => Card({ ...x, on: i === 3 || i === 5 })))), h: 420 },
        Confirm({ w: 380, title: '선택한 상품 2개를 찜에서 삭제할까요?', desc: '재입고 알림 신청은 그대로 유지됩니다.', ok: '2개 삭제', danger: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '삭제 완료(3초 안내 · 목록과 전체 수가 바로 줄어듦)', right: '안내만', pad: 20 }, Toast('찜한 상품 2개를 삭제했습니다.')),
        Canvas({ size: 'auto', label: '4개 체크 → 선택 상품 장바구니 담기 → 일부만 담김 안내(닫기 전까지 남음)', right: '안내만', pad: 20 }, Toast('2개를 장바구니에 담았습니다. 옵션을 골라야 하는 상품 1개와 품절 상품 1개는 담지 못했습니다.', { kind: 'error', action: '장바구니 보기' })),
        Canvas({ size: 'auto', label: '아무것도 체크하지 않음 — 두 버튼 비활성', right: '머리 줄만', pad: 20 }, `${CSS}<div style="width:720px">${Head(0, 6)}</div>`),
    ),
);

const state3 = StateBlock({ idx: 3, title: '없음', note: '찜한 상품이 하나도 없을 때(처음 들어왔거나 모두 지운 뒤).' },
    Anno({ title: '왜 이렇게 하나' }, '빈 화면에서 찜이 무엇인지와 어떻게 하는지를 한 줄로 알려 주고 상품을 보러 갈 버튼을 줍니다. 전체 선택 줄과 쪽 번호는 보이지 않습니다. 이너에라처럼 상품이 1개인 몰은 버튼이 그 상품 상세로 바로 갑니다.'),
    Canvas({ label: 'U-29 · 찜한 상품 없음' }, My({ cart: 0 },
        Empty({ icon: 'heart-o', title: '찜한 상품이 없습니다', desc: '마음에 드는 상품의 하트를 누르면 여기에 모아 볼 수 있습니다.', action: Btn('상품 보러 가기', 'primary') }),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-29 · 모바일 · 없음' }, MobilePage({ title: '찜한 상품', tab: '마이' },
            Empty({ icon: 'heart-o', title: '찜한 상품이 없습니다', desc: '마음에 드는 상품의 하트를 누르면 여기에 모아 볼 수 있습니다.', action: Btn('상품 보러 가기', 'primary') }))),
    ),
);

const LoginBox = (m) => `<div style="${m ? '' : 'max-width:420px;margin:0 auto;'}text-align:center;padding:${m ? '40px 0' : '56px 0'}"><div style="font-size:40px;color:#b4b4bb">${Icon('lock-o')}</div><b style="display:block;font-size:17px;margin:10px 0 6px">로그인이 필요합니다</b><p style="margin:0 0 20px;font-size:13.5px;color:var(--ink2)">찜한 상품은 로그인한 뒤 볼 수 있습니다.<br>로그인하면 찜한 상품 화면으로 바로 이동합니다.</p><div style="display:flex;flex-direction:column;gap:8px">${Btn('로그인하기', { kind: 'primary', size: 'lg', block: true })}${Btn('회원가입', { size: 'lg', block: true })}</div><p style="margin:16px 0 0;font-size:12.5px;color:var(--mute)">비회원으로 주문하셨나요? <u>비회원 주문 조회</u></p></div>`;

const state4 = StateBlock({ idx: 4, title: '비로그인 접근(로그인 유도)', note: '로그인하지 않은 채 /mypage/wishlist 주소로 들어오거나, 로그인이 풀린 뒤 이 화면을 다시 열었을 때.' },
    Anno({ title: '왜 이렇게 하나' }, '찜은 계정에 저장되므로 비회원에게는 보여 줄 목록이 없습니다. 빈 목록처럼 보이면 찜이 사라진 줄 알기 때문에, 로그인이 필요하다는 안내와 로그인 버튼을 줍니다. 로그인을 마치면 홈이 아니라 찜한 상품 화면으로 돌아옵니다. 마이페이지의 다른 화면도 비로그인으로 들어오면 같은 안내가 나옵니다.'),
    Anno({ title: '기능을 껐을 때' }, '비회원 주문 기능을 끈 몰은 맨 아래 비회원 주문 조회 줄이 나오지 않습니다. 왼쪽 마이페이지 메뉴는 비로그인 상태에서는 보이지 않습니다.'),
    Canvas({ label: 'U-29 · 비로그인으로 /mypage/wishlist 접근 → 로그인 안내(마이페이지 메뉴 없음)' }, UserPage({ crumb: ['홈', '찜한 상품'] }, LoginBox(false))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-29 · 모바일 · 비로그인 접근' }, MobilePage({ title: '찜한 상품', tab: '마이' }, LoginBox(true))),
        Canvas({ size: 'auto', label: '로그인하기 → U-10 로그인 → 완료 → 찜한 상품 화면으로 돌아옴(3초 안내 없음, 목록이 바로 보임)', right: '흐름 설명', pad: 20 },
            `<div style="width:420px;font-size:13px;color:var(--ink2);line-height:1.8">${Icon('arrow-right')} 로그인 화면(U-10)으로 이동<br>${Icon('arrow-right')} 로그인 완료<br>${Icon('arrow-right')} 이 화면(1번 상태 목록)으로 돌아옴<br>${Icon('arrow-right')} 로그인 전에 누르려던 하트가 있었다면 그 상품이 목록 맨 앞에 추가됨</div>`),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U29() {
    return fixBand([state1, state2, state3, state4].join(''));
}
