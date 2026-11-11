import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, OrderBadge, Box, Stats, Grid, H, Note, Text, Empty, Thumb, Icon, Overlay, Toast, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const StepStrip = (items, m) => `<div style="display:flex;border:1px solid var(--line);border-radius:6px;margin-bottom:10px;background:#fff">${items.map(([k, v], i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:${m ? '12px 0' : '18px 0'};position:relative"><b style="font-size:${m ? 20 : 26}px;${v ? 'text-decoration:underline;text-underline-offset:4px' : 'color:var(--mute);font-weight:500'}">${v}</b><span style="font-size:${m ? 11.5 : 13}px;color:var(--ink2)">${k}</span>${i < items.length - 1 ? `<i class="xi-angle-right-min" style="position:absolute;right:-8px;top:50%;margin-top:-8px;color:var(--mute)"></i>` : ''}</div>`).join('')}</div>`;

const ClaimLine = (c, r, e, m) => `<div style="display:flex;align-items:center;gap:${m ? 12 : 24}px;padding:10px 16px;background:var(--box);border-radius:6px;font-size:13px;margin-bottom:${m ? 16 : 28}px"><span>취소 <b>${c}</b></span><span>반품 <b>${r}</b></span><span>교환 <b>${e}</b></span><span style="margin-left:auto;color:var(--ink2)">${m ? '내역' : '취소·반품·교환 내역'}${Icon('angle-right-min')}</span></div>`;

const STEPS = [['입금대기', 1], ['결제완료', 1], ['배송준비', 2], ['배송중', 1], ['배송완료', 1]];
const STEPS0 = STEPS.map(([k]) => [k, 0]);

const RECENT = [
    { date: '2026-11-11', no: '20261111-000128', st: '결제완료', msg: '판매자가 주문을 확인하기 전입니다. 지금은 바로 취소할 수 있습니다.', opt: O2, qty: 1, price: '93,000원(예시)', btns: ['주문 취소'] },
    { date: '2026-11-10', no: '20261110-000119', st: '입금대기', msg: '11-12(목) 23:59까지 입금해 주세요. 국민은행 4301-****-****-12', opt: O1, qty: 1, price: '49,000원(예시)', btns: ['입금 계좌 보기', '주문 취소'] },
    { date: '2026-11-07', no: '20261107-000088', st: '배송중', msg: 'CJ대한통운 581233441201 · 11-12(목) 도착 예정', opt: O2, qty: 1, price: '93,000원(예시)', btns: ['배송 조회'] },
];

const OrderCard = (o) => Box({ title: `${o.date} 주문`, sub: `주문번호 ${o.no}`, right: `<span style="font-size:12.5px;color:var(--ink2)">주문 상세${Icon('angle-right-min')}</span>` },
    `<div style="display:flex;gap:14px;align-items:center">${Thumb(64)}<div style="flex:1;min-width:0;font-size:13px"><div style="margin-bottom:5px">${OrderBadge(o.st)} <span style="color:var(--ink2);font-size:12.5px">${o.msg}</span></div><b>${P}</b><div style="color:var(--mute);font-size:12.5px">${o.opt} · ${o.qty}개 · ${o.price}</div></div><div style="display:flex;flex-direction:column;gap:6px;width:124px;flex:none">${o.btns.map((b) => Btn(b, { size: 'sm', block: true })).join('')}</div></div>`);

const OrderCardM = (o) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:10px;background:#fff"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mute);margin-bottom:8px"><span>${o.date} · ${o.no}</span><span>상세${Icon('angle-right-min')}</span></div><div style="display:flex;gap:10px">${Thumb(56)}<div style="flex:1;min-width:0;font-size:13px"><div style="margin-bottom:3px">${OrderBadge(o.st)}</div><b>${SHOP.productShort}</b><div style="color:var(--mute);font-size:12px">${o.opt} · ${o.qty}개 · ${o.price}</div></div></div><div style="font-size:12px;color:var(--ink2);margin:8px 0">${o.msg}</div><div style="display:flex;gap:6px">${o.btns.map((b) => `<div style="flex:1">${Btn(b, { size: 'sm', block: true })}</div>`).join('')}</div></div>`;

const benefitStats = (o = {}) => Stats([
    { k: '적립금', v: o.point || '2,400원', sub: o.pointSub || '11-30에 500원 소멸 예정', link: '적립금 내역', icon: 'money' },
    { k: '쿠폰', v: o.coupon || '1장', sub: o.couponSub || '신규 가입 3,000원 할인 · 12-10까지', link: '쿠폰 보기', icon: 'coupon' },
    { k: '쓸 수 있는 리뷰', v: o.review || '1건', sub: o.reviewSub || '포토 리뷰를 쓰면 500원 적립', link: '리뷰 쓰기', icon: 'pen-o' },
    { k: '문의 답변', v: o.inq || '새 답변 1건', sub: o.inqSub || '11-10 남긴 배송 문의에 답변이 달렸습니다', link: '문의 보기', icon: 'message-o' },
]);

const plainStats = () => Stats([
    { k: '쓸 수 있는 리뷰', v: '1건', sub: '배송완료 후 30일 안에 쓸 수 있습니다', link: '리뷰 쓰기', icon: 'pen-o' },
    { k: '문의 답변', v: '새 답변 1건', sub: '11-10 남긴 배송 문의에 답변이 달렸습니다', link: '문의 보기', icon: 'message-o' },
]);

const pcHome = (o = {}) => MypageLayout({ title: '마이페이지', crumb: ['홈', '마이페이지'], cart: 1, hideBenefit: o.plain, grade: o.grade },
    o.plain ? plainStats() : benefitStats(o),
    '<div style="height:28px"></div>',
    H('진행 중인 주문', { sub: '최근 3개월 · 숫자를 누르면 그 상태의 주문만 보입니다', right: Btn('주문 목록 전체 보기', 'ghost') }),
    StepStrip(STEPS),
    ClaimLine(0, 1, 1),
    H('최근 주문', { sub: '최근 3건', right: Btn('전체 보기', 'ghost') }),
    RECENT.map(OrderCard),
    Note('금액은 예시 값입니다(판매가 미확정).'),
);

const MenuList = (items) => `<div style="border-top:8px solid var(--box);margin:16px -16px 0;padding:0 16px">${items.map((it) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 2px;border-bottom:1px solid var(--line2);font-size:14.5px"><span>${it}</span>${Icon('angle-right-min')}</div>`).join('')}</div>`;
const MENU_M = ['주문 목록', '취소·반품·교환 내역', '쿠폰·적립금', '리뷰', '문의', '배송지 관리', '회원정보', '공지사항', '자주 묻는 질문', '로그아웃'];

const Hello = (sub) => `<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px"><div style="width:44px;height:44px;border-radius:50%;background:var(--fill);display:flex;align-items:center;justify-content:center;font-size:22px">${Icon('user-o')}</div><div style="flex:1"><b style="font-size:17px">김민지 님</b><div style="font-size:12.5px;color:var(--mute)">${sub}</div></div><span style="font-size:12.5px;color:var(--ink2)">회원정보${Icon('angle-right-min')}</span></div>`;

const Tile = (k, v, sub) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px"><div style="font-size:12px;color:var(--mute)">${k}</div><b style="font-size:18px">${v}</b><div style="font-size:11.5px;color:var(--ink2)">${sub}</div></div>`;

const mHome = (o = {}) => MobilePage({ tab: '마이', cart: 1 },
    Hello(o.plain ? 'minji@example.com' : '일반 회원 · minji@example.com'),
    o.plain ? '' : Grid(2, Tile('적립금', '2,400원', '11-30에 500원 소멸 예정'), Tile('쿠폰', '1장', '12-10까지')),
    `<div style="display:flex;justify-content:space-between;align-items:center;margin:18px 0 8px"><b style="font-size:15px">진행 중인 주문</b><span style="font-size:12.5px;color:var(--ink2)">주문 목록${Icon('angle-right-min')}</span></div>`,
    StepStrip(STEPS, true),
    ClaimLine(0, 1, 1, true),
    `<div style="display:flex;justify-content:space-between;align-items:center;margin:0 0 8px"><b style="font-size:15px">최근 주문</b></div>`,
    RECENT.slice(0, 2).map(OrderCardM),
    MenuList(o.plain ? MENU_M.filter((x) => x !== '쿠폰·적립금') : MENU_M),
);

const state1 = StateBlock({ idx: 1, title: '기본(주문 단계별 건수·적립금·쿠폰·최근 주문)', note: '로그인한 회원이 머리의 사람 아이콘이나 모바일 하단 탭 마이를 눌렀을 때 첫 화면. 지금 해야 할 일(입금·수령·리뷰)이 위에서부터 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 마이페이지에 오는 이유는 대부분 내 주문이 어디까지 갔는지 보려는 것입니다. 그래서 주문 단계별 건수를 맨 위 가까이에 두고, 숫자를 누르면 주문 목록이 그 상태로 걸러져 열립니다. 건수는 주문이 아니라 품목 단위로 셉니다(한 주문의 품목이 따로 움직이므로). 구매확정된 품목은 끝난 일이라 세지 않고, 취소·반품·교환은 아래 줄에 따로 셉니다.'),
    Anno({ title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '집계 기간은 최근 3개월 고정, 최근 주문은 3건. 적립금·쿠폰·리뷰 카드는 관리자 설정 > 기능 켜고 끄기에서 끈 기능이면 카드와 왼쪽 메뉴가 함께 사라집니다. 회원 등급을 켠 몰은 이름 아래 등급명과 다음 등급까지 남은 금액이 나옵니다. 최근 주문 카드의 버튼은 U-14 주문 목록의 상태별 버튼과 같습니다.'),
    Canvas({ label: 'U-13 · 마이페이지 홈 · 진행 중인 주문 있음 (적립금·쿠폰·리뷰 켠 몰)' }, pcHome()),
    Canvas({ label: 'U-13 · 적립금·쿠폰을 끈 몰 — 혜택 카드와 왼쪽 나의 혜택 메뉴가 없음' }, pcHome({ plain: true })),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-13 · 모바일 · 하단 탭 마이' }, mHome()),
        Canvas({ size: 'mobile', label: 'U-13 · 모바일 · 적립금·쿠폰을 끈 몰' }, mHome({ plain: true })),
        Canvas({ size: 'mobile', label: 'U-13 · 모바일 · 로그아웃을 누른 뒤 확인' }, Overlay({ bg: mHome(), h: 720 },
            `<div class="wf-modal confirm" style="width:300px"><div class="mb"><b class="ct">로그아웃할까요?</b><p>장바구니에 담은 상품은 다음에 로그인하면 그대로 있습니다.</p></div><div class="mf">${Btn('취소')}${Btn('로그아웃', 'primary')}</div></div>`)),
    ),
    Canvas({ size: 'auto', label: '회원 등급을 켠 몰 — 인사 영역만 (왼쪽 메뉴 위 · 모바일 맨 위)', right: '부분', pad: 20 },
        `<div style="width:420px">${Box({ flat: true }, `<div style="display:flex;align-items:center;gap:12px"><div style="flex:1"><b style="font-size:16px">김민지 님</b> ${Badge('실버', 'bold')}<div style="font-size:12.5px;color:var(--ink2);margin-top:4px">구매 적립 2% · 다음 달 1일 등급 산정</div><div style="height:6px;background:var(--fill);border-radius:3px;margin:8px 0 4px"><div style="width:62%;height:6px;background:var(--dark);border-radius:3px"></div></div><div style="font-size:12px;color:var(--mute)">골드까지 114,000원 더 구매하면 됩니다 (최근 6개월 구매확정 금액 186,000원)</div></div></div>`)}</div>`),
);

const emptyBody = (plain) => [
    plain ? '' : [benefitStats({ point: '0원', pointSub: '구매확정하면 결제 금액의 1%가 적립됩니다', coupon: '1장', couponSub: '신규 가입 3,000원 할인 · 12-10까지', review: '0건', reviewSub: '구매확정한 상품이 생기면 쓸 수 있습니다', inq: '0건', inqSub: '궁금한 점은 1:1 문의로 남겨 주세요' }), '<div style="height:28px"></div>'],
    H('진행 중인 주문', { sub: '최근 3개월' }),
    StepStrip(STEPS0),
    ClaimLine(0, 0, 0),
    H('최근 주문'),
];

const state2 = StateBlock({ idx: 2, title: '주문 없음', note: '가입만 하고 아직 주문한 적이 없거나, 최근 3개월 안에 주문이 없는 회원.' },
    Anno({ title: '빈 상태' }, '건수는 0으로 흐리게 두고(자리를 없애면 화면이 들쭉날쭉해짐), 최근 주문 자리에 안내 문구와 다음 행동 버튼을 둡니다. 가입 쿠폰이 남아 있으면 그 사실을 빈 상태 문구에 넣어 첫 구매로 이어지게 합니다. 쿠폰을 끈 몰은 쿠폰 문장이 빠집니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '3개월보다 오래된 주문만 있는 회원은 주문한 적이 있으므로 문구와 버튼이 다릅니다(지난 주문 보기). 비회원으로 주문한 내역은 회원 마이페이지에 나오지 않으므로 비회원 주문 조회로 가는 길을 함께 둡니다.'),
    Canvas({ label: 'U-13 · 주문한 적 없는 신규 회원 (가입 쿠폰 1장 보유)' }, MypageLayout({ title: '마이페이지', crumb: ['홈', '마이페이지'] },
        emptyBody(),
        Empty({ icon: 'shopping-bag', title: '아직 주문한 상품이 없습니다', desc: '가입 축하 3,000원 할인 쿠폰이 12월 10일까지 남아 있습니다. 첫 주문에 써 보세요.', action: '상품 보러 가기' }),
        Text(`비회원으로 주문하셨나요? <u>비회원 주문 조회</u>`, { sm: true, mute: true }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '최근 3개월 안에 주문이 없는 기존 회원 — 최근 주문 자리만', right: '부분', pad: 20 },
            `<div style="width:560px">${Empty({ icon: 'receipt', title: '최근 3개월 동안 주문한 상품이 없습니다', desc: '그 전에 주문한 내역은 주문 목록에서 기간을 넓혀 볼 수 있습니다.', action: [Btn('지난 주문 보기'), Btn('상품 보러 가기', 'primary')] })}</div>`),
        Canvas({ size: 'mobile', label: 'U-13 · 모바일 · 주문 없음' }, MobilePage({ tab: '마이' },
            Hello('일반 회원 · minji@example.com'),
            Grid(2, Tile('적립금', '0원', '구매확정 시 1% 적립'), Tile('쿠폰', '1장', '12-10까지')),
            `<div style="margin:18px 0 8px"><b style="font-size:15px">진행 중인 주문</b></div>`,
            StepStrip(STEPS0, true),
            Empty({ icon: 'shopping-bag', title: '아직 주문한 상품이 없습니다', desc: '가입 축하 3,000원 할인 쿠폰이 12월 10일까지 남아 있습니다.', action: '상품 보러 가기' }),
            MenuList(MENU_M),
        )),
    ),
    Canvas({ size: 'auto', label: '로그인하지 않고 /mypage 로 들어왔을 때 — 로그인 화면으로 보내며 뜨는 안내', right: '토스트만', pad: 20 }, Toast('로그인이 필요한 화면입니다. 로그인하면 마이페이지로 돌아옵니다.', { icon: 'lock-o' })),
);

export default function U13() {
    return [state1, state2].join('');
}
