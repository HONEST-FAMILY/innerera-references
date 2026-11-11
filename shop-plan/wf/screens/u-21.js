import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, Chips, Tabs, Input, Field,
    Overlay, Modal, Toast, Empty, Box, Note, Text, Icon, Flex, Table, Pager, ListHead, Stats, Grid, SHOP,
} from '../lib/blocks.js';

const PS = SHOP.productShort;

const STYLE = `<style>
.u21-cp { display:flex; border:1px solid var(--line); border-radius:6px; background:#fff; min-height:132px; }
.u21-cp .amt { width:150px; flex:none; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; border-right:1px dashed var(--line); padding:12px; text-align:center; }
.u21-cp .amt b { font-size:24px; font-weight:800; white-space:nowrap; }
.u21-cp .amt span { font-size:12px; color:var(--mute); }
.u21-cp .inf { flex:1; min-width:0; padding:14px 16px; display:flex; flex-direction:column; gap:4px; font-size:12.5px; color:var(--ink2); }
.u21-cp .inf .nm { font-size:14.5px; font-weight:700; color:var(--ink); display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.u21-cp .inf .ft { margin-top:auto; padding-top:6px; display:flex; align-items:center; justify-content:space-between; gap:8px; color:var(--mute); }
.u21-cp.off { background:var(--box); }
.u21-cp.off .amt b, .u21-cp.off .inf .nm { color:var(--mute); text-decoration:line-through; }
.u21-m .u21-cp .amt { width:104px; }
.u21-m .u21-cp .amt b { font-size:19px; }
.u21-code { display:flex; align-items:center; gap:10px; border:1px solid var(--line); border-radius:6px; background:var(--box); padding:12px 16px; margin-bottom:16px; font-size:13px; }
.u21-code .sp { flex:1; }
.u21-sum { display:flex; border:1px solid var(--line); border-radius:6px; margin-bottom:18px; }
.u21-sum > div { flex:1; padding:18px 20px; border-right:1px solid var(--line2); display:flex; flex-direction:column; gap:4px; font-size:12.5px; color:var(--mute); }
.u21-sum > div:last-child { border-right:0; }
.u21-sum b { font-size:22px; color:var(--ink); }
.u21-sum .k { font-size:13px; color:var(--ink2); display:flex; align-items:center; gap:6px; }
.u21-m .u21-sum { flex-direction:column; }
.u21-m .u21-sum > div { border-right:0; border-bottom:1px solid var(--line2); padding:12px 16px; }
.u21-ml { display:flex; justify-content:space-between; gap:10px; padding:12px 2px; border-bottom:1px solid var(--line2); font-size:13px; }
.u21-ml span { display:block; color:var(--mute); font-size:12px; }
.u21-ml b { white-space:nowrap; text-align:right; }
</style>`;

const Coupon = (o) => `<div class="u21-cp${o.off ? ' off' : ''}"><div class="amt"><b>${o.amt}</b><span>${o.kind}</span></div><div class="inf"><div class="nm">${o.name}${o.badge || ''}</div><span>${o.cond}</span><span>적용 대상: ${o.target}</span>${o.extra ? `<span>${o.extra}</span>` : ''}<div class="ft"><span>${o.until}</span>${o.btn || ''}</div></div></div>`;

const USE = Btn('쓰러 가기', { size: 'sm', iconRight: 'angle-right-min' });

const CP_JOIN = { amt: '3,000원', kind: '주문 할인', name: '신규 가입 축하 쿠폰', cond: '30,000원 이상 주문 시', target: '전체 상품', until: '2026-12-10 23:59까지 · 29일 남음', btn: USE };
const CP_SAMPLES = [
    { amt: '10%', kind: '상품 할인', name: '석류맛 젤리스틱 4박스 구성 10% 할인', badge: Badge('3일 남음', 'warn'), cond: '최대 15,000원 할인 · 금액 조건 없음', target: `${PS} 4박스(56일분)`, until: '2026-11-14 23:59까지', btn: USE },
    { amt: '무료배송', kind: '배송비 할인', name: '무료배송 쿠폰', cond: '30,000원 미만 주문의 기본 배송비 3,000원 할인', target: '전체 상품 (제주·도서산간 추가 배송비는 제외)', until: '2026-11-30 23:59까지', btn: USE },
    { amt: '5,000원', kind: '주문 할인', name: '11월 감사 쿠폰', badge: Badge('12-01부터 사용', 'dash'), cond: '50,000원 이상 주문 시 · 다른 주문 할인 쿠폰과 함께 못 씀', target: '전체 상품', until: '2026-12-01 00:00 ~ 2026-12-31 23:59', btn: Btn('사용 기간 전', { size: 'sm', disabled: true }) },
    { amt: '2,000원', kind: '주문 할인', name: '생일 축하 쿠폰', badge: Badge('오늘까지', 'warn'), cond: '20,000원 이상 주문 시', target: '전체 상품', until: '2026-11-11 23:59까지', btn: USE },
];
const CP_USED = [
    { off: true, amt: '무료배송', kind: '배송비 할인', name: '무료배송 쿠폰', badge: Badge('사용완료', 'check'), cond: '2026-06-10 사용 · 3,000원 할인받음', target: '주문 <u>20260610-000097</u>', until: '사용한 쿠폰은 주문을 취소하면 되돌려 드립니다' },
    { off: true, amt: '10%', kind: '상품 할인', name: '첫 구매 10% 할인', badge: Badge('사용완료', 'check'), cond: '2025-12-05 사용 · 4,900원 할인받음', target: '주문 <u>20251205-000031</u>', until: '' },
];
const CP_EXPIRED = [
    { off: true, amt: '5,000원', kind: '주문 할인', name: '추석 감사 쿠폰', badge: Badge('기간 만료', 'strike'), cond: '50,000원 이상 주문 시', target: '전체 상품', until: '2026-10-04 23:59에 끝남' },
];

const MAIN = (active, o = {}) => (o.only ? '' : Tabs([{ t: '쿠폰', n: o.cn === undefined ? 1 : o.cn }, { t: '적립금', n: o.pt || '2,400원' }], active));
const SUB = (active, n = [1, 2, 1]) => Tabs([{ t: '사용 가능', n: n[0] }, { t: '사용완료', n: n[1] }, { t: '만료', n: n[2] }], active, { kind: 'pill' });
const CodeBar = () => `<div class="u21-code">${Icon('coupon')}<span>쿠폰 코드가 있으신가요?</span><span class="sp"></span>${Btn('쿠폰 코드 등록', { size: 'sm', icon: 'plus' })}</div>`;
const CP_NOTE = Note('쿠폰은 주문서의 쿠폰 적용에서 고릅니다. 한 주문에 주문 할인 쿠폰 1장 + 배송비 쿠폰 1장까지 쓸 수 있습니다. 주문을 전부 취소하면 쓴 쿠폰은 남은 기간 안에서 되돌아옵니다.');

const CouponTab = (sub, list, o = {}) => [MAIN('쿠폰', o), CodeBar(), SUB(sub, o.n), '<div style="height:14px"></div>', Grid(o.cols || 2, list.map(Coupon)), '<div style="height:14px"></div>', o.note === false ? '' : CP_NOTE];

const state1 = StateBlock({ idx: 1, title: '쿠폰 보유·사용완료·만료 탭', note: '가진 쿠폰을 쓸 수 있는 것 · 이미 쓴 것 · 기간이 끝난 것으로 나눠 봅니다. 처음 열면 사용 가능 탭입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '쿠폰 한 장에서 고객이 확인하는 것은 얼마 깎이나 · 얼마 이상 사야 하나 · 언제까지인가 · 어디에 쓰나 네 가지입니다. 이 넷을 카드에 빠짐없이 적고, 기한이 7일 안으로 남으면 남은 날 배지를 붙여 기한이 빠른 순으로 세웁니다. 유형별 분기: 관리자 혜택 > 쿠폰에서 만든 유형(주문 할인 · 상품 할인 · 배송비 할인)에 따라 왼쪽 큰 글자가 금액 · 비율 · 무료배송으로 바뀝니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '사용완료 쿠폰에는 어느 주문에 썼고 실제로 얼마 할인받았는지를 남깁니다(비율 쿠폰은 금액으로 환산). 주문을 전부 취소하면 쿠폰이 사용 가능으로 돌아오지만, 그사이 기간이 끝났으면 만료 탭으로 갑니다. 사용완료·만료 쿠폰은 최근 6개월 치만 보여 줍니다.'),
    Canvas({ label: 'U-21 · 쿠폰 탭 · 사용 가능 1장(김민지 · 신규 가입 쿠폰)' }, STYLE, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금' }, CouponTab('사용 가능', [CP_JOIN]))),
    Canvas({ label: 'U-21 · 사용 가능 탭 · 쿠폰 유형별 카드 모습(다른 회원 예시: 상품 할인 비율 · 배송비 · 사용 기간 전 · 오늘까지)' }, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금', name: '박서준' },
        CouponTab('사용 가능', CP_SAMPLES, { cn: 4, pt: '0원', n: [4, 0, 0] }))),
    Canvas({ label: 'U-21 · 사용완료 탭 · 쓴 주문과 실제 할인 금액' }, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금' }, CouponTab('사용완료', CP_USED, { note: false }),
        Text('최근 6개월 안에 쓴 쿠폰만 보입니다.', { sm: true, mute: true }))),
    Canvas({ label: 'U-21 · 만료 탭' }, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금' }, CouponTab('만료', CP_EXPIRED, { note: false }),
        Text('기간이 끝난 쿠폰은 다시 쓸 수 없고, 6개월 뒤 목록에서 사라집니다.', { sm: true, mute: true }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-21 · 모바일 · 쿠폰 탭(카드 한 줄에 하나)' }, `<div class="u21-m">${MobilePage({ title: '쿠폰·적립금', tab: '마이' }, CouponTab('사용 가능', [CP_JOIN, CP_SAMPLES[1]], { cols: 1, cn: 2, n: [2, 2, 1], note: false }))}</div>`),
        Canvas({ size: 'auto', label: '사용 가능한 쿠폰이 없을 때', right: '본문만', pad: 20 }, `<div style="width:520px">${MAIN('쿠폰', { cn: 0 })}${CodeBar()}${SUB('사용 가능', [0, 2, 1])}${Empty({ icon: 'coupon', title: '지금 쓸 수 있는 쿠폰이 없습니다', desc: '쿠폰 코드가 있으면 등록해 보세요.', action: Btn('쿠폰 코드 등록', { icon: 'plus' }) })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '사용완료 쿠폰 없음', right: '본문만', pad: 20 }, `<div style="width:420px">${SUB('사용완료', [1, 0, 0])}${Empty({ icon: 'coupon', title: '사용한 쿠폰이 없습니다', desc: '최근 6개월 안에 쓴 쿠폰이 여기에 보입니다.' })}</div>`),
        Canvas({ size: 'auto', label: '만료 쿠폰 없음', right: '본문만', pad: 20 }, `<div style="width:420px">${SUB('만료', [1, 0, 0])}${Empty({ icon: 'coupon', title: '기간이 끝난 쿠폰이 없습니다' })}</div>`),
    ),
);

const CodeModal = (o = {}) => Modal({ title: '쿠폰 코드 등록', w: 440, foot: [Btn('닫기'), Btn('등록', { kind: 'primary', disabled: o.disabled })] },
    Field({ label: '쿠폰 코드', required: true, help: o.error ? undefined : '영문·숫자 8 ~ 16자. 대문자·소문자는 구분하지 않고, 띄어쓰기와 하이픈(-)은 자동으로 뺍니다.', error: o.error },
        Input({ value: o.value, placeholder: '예: WELCOME2026', error: !!o.error, focus: o.focus })),
    o.body);

const ERRS = [
    ['없는 코드', 'WELCOM2026', '쿠폰 코드를 찾을 수 없습니다. 받은 코드와 한 글자씩 비교해 다시 입력해 주세요.'],
    ['이미 등록한 코드', 'WELCOME2026', '이미 등록한 쿠폰입니다. 쿠폰 목록의 사용 가능 · 사용완료 탭에서 확인해 주세요.'],
    ['등록 기간이 끝난 코드', 'CHUSEOK2026', '등록 기간이 끝난 쿠폰입니다. (등록 기간 2026-09-20 ~ 2026-10-04)'],
    ['선착순 수량이 다 나간 코드', 'FIRST100', '준비한 수량이 모두 소진된 쿠폰입니다. (선착순 100명 마감)'],
    ['아직 시작 전인 코드', 'BLACK1127', '아직 등록할 수 없는 쿠폰입니다. 2026-11-27 00:00부터 등록할 수 있습니다.'],
    ['대상이 아닌 회원', 'VIPONLY', '이 쿠폰은 받을 수 있는 회원이 정해져 있습니다. 받으신 안내의 계정으로 로그인했는지 확인해 주세요.'],
];

const state2 = StateBlock({ idx: 2, title: '쿠폰 코드 등록', note: '인플루언서 공구·오프라인 전단·제휴처에서 받은 코드를 넣어 쿠폰으로 바꿉니다. 쿠폰 탭 위의 쿠폰 코드 등록 버튼으로 엽니다.' },
    Anno({ title: '왜 이렇게 하나' }, '코드 발급 방식 쿠폰(관리자 혜택 > 쿠폰 > 발급 방식: 코드)은 고객이 직접 입력해야 생깁니다. 손으로 옮겨 적다 틀리는 일이 많아 대소문자·띄어쓰기·하이픈 차이는 받아 주고, 안 될 때는 왜 안 되는지를 경우마다 다른 문장으로 알려 줍니다. 같은 팝업을 주문서의 쿠폰 적용 팝업에서도 엽니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '5번 연속 틀리면 10분 동안 등록을 막습니다(코드 무작위 대입 방지). 등록에 성공하면 팝업 안에서 어떤 쿠폰이 들어왔는지 카드로 바로 보여 주고, 목록의 사용 가능 숫자가 올라갑니다.'),
    Canvas({ label: 'U-21 · 쿠폰 코드 등록 버튼 → 팝업 · 빈값(등록 버튼 꺼짐)' }, Overlay({ bg: MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금' }, CouponTab('사용 가능', [CP_JOIN])), h: 460 }, CodeModal({ disabled: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 중 · 소문자·하이픈으로 넣어도 됨', right: '팝업만', pad: 20 }, CodeModal({ value: 'thanks-1111', focus: true })),
        Canvas({ size: 'auto', label: '등록 성공 · 들어온 쿠폰을 바로 보여 줌', right: '팝업만', pad: 20 },
            Modal({ title: '쿠폰 코드 등록', w: 480, foot: [Btn('다른 코드 등록'), Btn('쿠폰 목록 보기', 'primary')] },
                Text(`${Icon('check-circle-o')} 쿠폰을 등록했습니다.`, { b: true }),
                Coupon({ amt: '5,000원', kind: '주문 할인', name: '11월 감사 쿠폰', cond: '50,000원 이상 주문 시', target: '전체 상품', until: '2026-11-30 23:59까지', btn: USE }))),
    ),
    CanvasRow(ERRS.slice(0, 2).map(([l, v, e]) => Canvas({ size: 'auto', label: `오류 · ${l}`, right: '팝업만', pad: 20 }, CodeModal({ value: v, error: e })))),
    CanvasRow(ERRS.slice(2, 4).map(([l, v, e]) => Canvas({ size: 'auto', label: `오류 · ${l}`, right: '팝업만', pad: 20 }, CodeModal({ value: v, error: e })))),
    CanvasRow(ERRS.slice(4, 6).map(([l, v, e]) => Canvas({ size: 'auto', label: `오류 · ${l}`, right: '팝업만', pad: 20 }, CodeModal({ value: v, error: e })))),
    CanvasRow(
        Canvas({ size: 'auto', label: '오류 · 형식이 맞지 않음(한글·기호 · 8자 미만)', right: '팝업만', pad: 20 }, CodeModal({ value: '감사쿠폰!', error: '쿠폰 코드는 영문과 숫자 8 ~ 16자입니다. 한글이나 기호가 들어가지 않았는지 확인해 주세요.', disabled: true })),
        Canvas({ size: 'auto', label: '5번 연속 틀림 · 10분 동안 등록 막힘', right: '팝업만', pad: 20 }, CodeModal({ value: 'WELCOM2027', disabled: true, error: '코드를 5번 잘못 입력해 10분 동안 등록할 수 없습니다. 11:42 이후에 다시 시도해 주세요.' })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-21 · 모바일 · 코드 등록은 아래에서 올라오는 시트' }, `<div class="u21-m">${Overlay({ bg: MobilePage({ title: '쿠폰·적립금', tab: '마이' }, CouponTab('사용 가능', [CP_JOIN], { cols: 1, note: false })), align: 'bottom', h: 720 },
            `<div class="wf-sheet"><div class="grip"></div><div class="mh"><b>쿠폰 코드 등록</b>${Icon('close')}</div><div class="mb">${Field({ label: '쿠폰 코드', required: true, error: ERRS[0][2] }, Input({ value: 'WELCOM2026', error: true }))}</div><div class="mf">${Btn('등록', 'primary')}</div></div>`)}</div>`),
        Canvas({ size: 'auto', label: '등록 뒤 팝업을 닫았을 때', right: '토스트만', pad: 20 }, Toast('11월 감사 쿠폰을 등록했습니다. 사용 가능한 쿠폰 2장', {})),
    ),
);

const POINT_COLS = [{ t: '날짜', w: 96 }, { t: '구분', w: 92 }, '내용', { t: '금액', w: 90, align: 'right' }, { t: '소멸 예정일', w: 112 }, { t: '남은 적립금', w: 96, align: 'right' }];
const plus = (v) => `<b>+${v}원</b>`;
const minus = (v) => `<span style="text-decoration:underline">-${v}원</span>`;
const POINT_ROWS = [
    ['2026-10-30', Badge('적립', 'check'), `구매 적립 (결제금액의 1%)<small>주문 <u>20261020-000311</u> 구매확정</small>`, plus('920'), '2027-10-30', '2,400원'],
    ['2026-10-28', Badge('취소 환원', 'dot'), `주문 취소로 돌려받음<small>주문 <u>20261028-000007</u> 취소완료 · 원래 소멸 예정일 그대로</small>`, plus('500'), '2026-12-05 외', '1,480원'],
    ['2026-10-28', Badge('사용', 'bold'), `주문 결제에 사용<small>주문 <u>20261028-000007</u></small>`, minus('500'), '-', '980원'],
    ['2026-10-20', Badge('사용', 'bold'), `주문 결제에 사용<small>주문 <u>20261020-000311</u></small>`, minus('600'), '-', '1,480원'],
    { dim: true, c: ['2026-10-01', Badge('소멸', 'strike'), `유효기간이 끝나 소멸<small>2025-10-01 이벤트 적립분</small>`, minus('300'), '-', '2,080원'] },
    ['2026-08-22', Badge('적립', 'check'), `글 리뷰 작성<small>주문 <u>20260722-000188</u> · ${PS}</small>`, plus('100'), '2027-08-22', '2,380원'],
    ['2026-08-20', Badge('적립', 'check'), `구매 적립 (결제금액의 1%)<small>주문 <u>20260815-000412</u> 구매확정</small>`, plus('490'), '2027-08-20', '2,280원'],
    ['2026-07-28', Badge('적립', 'check'), `구매 적립 (결제금액의 1%)<small>주문 <u>20260722-000188</u> 구매확정</small>`, plus('490'), '2027-07-28', '1,790원'],
    { hl: true, c: ['2025-12-05', Badge('적립', 'check'), `첫 구매 감사 적립<small>${Badge('24일 뒤 400원 소멸', 'warn')} 1,000원 중 600원 사용</small>`, plus('1,000'), '2026-12-05', '1,300원'] },
];

const Summary = () => `<div class="u21-sum">
<div><span class="k">${Icon('wallet')}쓸 수 있는 적립금</span><b>2,400원</b><span>1,000원 이상 모이면 10원 단위로 사용</span></div>
<div><span class="k">${Icon('alarm-o')}30일 안에 소멸 예정</span><b>400원</b><span>2026-12-05 23:59에 소멸</span></div>
<div><span class="k">${Icon('clock-o')}적립 예정</span><b>5,100원</b><span>구매확정 4,600원 · 리뷰 확인 500원</span></div>
</div>`;

const PERIOD = (a = '3개월') => Chips(['1개월', '3개월', '6개월', '1년', '직접 고르기'], a);
const KIND = (a = '전체') => Chips(['전체', '적립', '사용', '소멸'], a);

const PointBody = (o = {}) => [
    MAIN('적립금', o), Summary(),
    ListHead({ left: KIND(o.kind), right: PERIOD(o.period) }),
    Table({ cols: POINT_COLS, rows: o.rows || POINT_ROWS.slice(0, 6), empty: o.empty }),
    Note('적립금은 적립일부터 1년 뒤 소멸하며, 소멸일이 빠른 적립금부터 먼저 쓰입니다. 구매 적립은 구매확정 때 들어옵니다. 금액과 적립률은 예시 값입니다.'),
    o.pager === false ? '' : Pager({ page: 1, last: 2 }),
];

const state3 = StateBlock({ idx: 3, title: '적립금 내역(적립·사용·소멸 예정)', note: '지금 쓸 수 있는 적립금, 곧 사라질 적립금, 들어올 적립금을 위에 요약하고 아래에 한 줄씩 내역을 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '적립금 문의의 대부분은 "왜 이 금액이냐"와 "언제 없어지냐"입니다. 그래서 줄마다 사유(어느 주문 · 어떤 활동)와 그때 남은 적립금을 적어 고객이 스스로 맞춰 볼 수 있게 하고, 30일 안에 사라질 금액과 날짜를 맨 위에 따로 둡니다. 초기값: 구매 적립 1% · 유효기간 1년 · 1,000원 이상부터 사용 — 관리자 혜택 > 적립금 정책에서 바꾸고, 운영자가 직접 지급·차감한 건은 사유와 함께 이 내역에 그대로 나옵니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '구분은 색이 아니라 배지 모양과 부호(+ 굵은 글씨 / - 밑줄)로 가릅니다. 주문을 취소해 돌려받은 적립금은 새로 1년이 생기지 않고 원래 소멸 예정일을 그대로 가집니다. 이미 소멸일이 지난 적립금은 환원과 동시에 소멸 처리되며 두 줄로 남습니다. 소멸 30일 전 · 7일 전에 고객에게 알림이 갑니다(설정 > 알림).'),
    Canvas({ label: 'U-21 · 적립금 탭 · 요약 3칸 + 내역(적립 · 취소 환원 · 사용 · 소멸) · 최근 3개월' }, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금' }, PointBody())),
    Canvas({ label: 'U-21 · 기간 1년으로 넓힘 · 2쪽 · 소멸 예정이 가까운 줄 강조' }, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰·적립금' },
        MAIN('적립금'), ListHead({ total: 9, left: KIND(), right: PERIOD('1년') }), Table({ cols: POINT_COLS, rows: POINT_ROWS.slice(5) }), Pager({ page: 2, last: 2 }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '직접 고르기를 누름 → 기간 입력', right: '부분', pad: 20 }, `<div style="width:560px">${PERIOD('직접 고르기')}<div style="height:10px"></div>${Flex({ align: 'center', gap: 8 }, Input({ value: '2025-12-01', icon: 'calendar', w: 160 }), '~', Input({ value: '2026-11-11', icon: 'calendar', w: 160, focus: true }), Btn('조회', { kind: 'primary', size: 'sm' }))}${Text('한 번에 최대 1년까지 조회할 수 있습니다. 내역은 5년 동안 보관됩니다.', { sm: true, mute: true })}</div>`),
        Canvas({ size: 'auto', label: '소멸만 보기 · 소멸 예정과 소멸 완료', right: '부분', pad: 20 }, `<div style="width:600px">${KIND('소멸')}<div style="height:10px"></div>${Table({ dense: true, cols: [{ t: '소멸일', w: 100 }, { t: '상태', w: 96 }, '적립 사유', { t: '금액', w: 80, align: 'right' }], rows: [
            { hl: true, c: ['2026-12-05', Badge('소멸 예정', 'warn'), '첫 구매 감사 적립 (2025-12-05)', '400원'] },
            ['2027-07-28', Badge('소멸 예정', 'dash'), '구매 적립 (2026-07-28)', '490원'],
            { dim: true, c: ['2026-10-01', Badge('소멸', 'strike'), '이벤트 적립 (2025-10-01)', '300원'] },
        ] })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-21 · 모바일 · 적립금 탭(요약 세로 · 내역은 두 줄 카드)' }, `<div class="u21-m">${MobilePage({ title: '쿠폰·적립금', tab: '마이' },
            MAIN('적립금'), Summary(), KIND(), '<div style="height:8px"></div>',
            [['구매 적립 (1%)', '10-30 · 주문 20261020-000311 · 소멸 2027-10-30', '+920원', '2,400원'], ['주문 취소로 돌려받음', '10-28 · 주문 20261028-000007', '+500원', '1,480원'], ['주문 결제에 사용', '10-28 · 주문 20261028-000007', '-500원', '980원'], ['유효기간이 끝나 소멸', '10-01 · 2025-10-01 이벤트 적립분', '-300원', '2,080원']]
                .map(([t, s, v, r]) => `<div class="u21-ml"><div>${t}<span>${s}</span></div><b>${v}<span>남은 ${r}</span></b></div>`).join(''))}</div>`),
        Canvas({ size: 'auto', label: '적립금 내역 없음 · 갓 가입한 회원', right: '본문만', pad: 20 }, `<div style="width:560px">${MAIN('적립금', { cn: 1, pt: '0원' })}<div class="u21-sum"><div><span class="k">${Icon('wallet')}쓸 수 있는 적립금</span><b>0원</b></div><div><span class="k">${Icon('alarm-o')}30일 안에 소멸 예정</span><b>0원</b></div><div><span class="k">${Icon('clock-o')}적립 예정</span><b>0원</b></div></div>${Empty({ icon: 'wallet', title: '적립금 내역이 없습니다', desc: '구매확정하면 결제금액의 1%, 리뷰를 쓰면 최대 500원이 적립됩니다(예시).', action: '상품 보러 가기' })}</div>`),
    ),
    Canvas({ size: 'auto', label: '고른 기간에 내역 없음', right: '부분', pad: 20 }, `<div style="width:640px">${ListHead({ left: KIND('사용'), right: PERIOD('1개월') })}${Table({ cols: POINT_COLS.slice(0, 4), rows: [], empty: '최근 1개월 동안 사용한 적립금이 없습니다. 기간을 넓혀 보세요.' })}</div>`),
);

const state4 = StateBlock({ idx: 4, title: '기능 꺼진 몰(메뉴 없음)', note: '관리자 설정 > 기능 켜고 끄기에서 쿠폰·적립금을 끈 몰. 하나만 끄면 남은 것만, 둘 다 끄면 메뉴째 사라집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '쓰지 않는 기능의 빈 화면이 보이면 고객이 "쿠폰은 언제 주나요"를 묻게 됩니다. 꺼진 기능은 마이페이지 메뉴 · 마이페이지 홈의 요약 칸 · 주문서의 쿠폰/적립금 칸 · 서랍 메뉴의 보유 표시 · 가입 완료 안내 · 알림에서 함께 사라집니다. 관리자가 바꿀 수 있는 범위: 쿠폰 · 적립금을 따로따로 켜고 끕니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '적립금을 끌 때 이미 쌓인 적립금이 있는 회원이 있으면 관리자 화면에서 영향 안내(보유 회원 수 · 총액)를 먼저 보여 주고, 끈 뒤에는 고객 화면에서 숨겨질 뿐 지워지지 않아 다시 켜면 그대로 나옵니다. 꺼진 몰에서 이 주소(/mypage/benefits)로 직접 들어오면 마이페이지 홈으로 보냅니다.'),
    Canvas({ label: 'U-21 · 쿠폰만 켠 몰 · 메뉴 이름이 쿠폰, 적립금 탭 없음' }, MypageLayout({ active: '쿠폰·적립금', title: '쿠폰' },
        Note('와이어프레임 표시 안내: 이 몰에서는 왼쪽 메뉴 이름도 "쿠폰"으로 나옵니다.'),
        CouponTab('사용 가능', [CP_JOIN], { only: true }))),
    Canvas({ label: 'U-21 · 적립금만 켠 몰 · 메뉴 이름이 적립금, 쿠폰 탭·코드 등록 없음' }, MypageLayout({ active: '쿠폰·적립금', title: '적립금' },
        Note('와이어프레임 표시 안내: 이 몰에서는 왼쪽 메뉴 이름도 "적립금"으로 나옵니다.'),
        PointBody({ only: true, rows: POINT_ROWS.slice(0, 3), pager: false }))),
    Canvas({ label: 'U-21 · 둘 다 끈 몰 · 마이페이지 왼쪽 메뉴에 나의 혜택 묶음이 없음(주문 목록 화면에서 본 모습)' }, MypageLayout({ active: '주문 목록', title: '주문 목록', hideBenefit: true },
        Box({ flat: true }, Text(`${Icon('info-o')} 왼쪽 메뉴가 <b>나의 쇼핑 · 나의 활동 · 나의 정보</b> 세 묶음만 나옵니다. 쿠폰·적립금 화면은 존재하지 않고, 주소로 직접 들어오면 마이페이지 홈으로 이동합니다.`)),
        Stats([{ k: '입금대기', v: '0' }, { k: '결제완료', v: '1' }, { k: '배송준비', v: '1' }, { k: '배송중', v: '1' }, { k: '배송완료', v: '1' }]))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-21 · 모바일 · 둘 다 끈 몰의 마이 탭(혜택 줄 없음)' }, MobilePage({ tab: '마이' },
            `<div style="padding:4px 0 14px"><b style="font-size:18px">김민지 님</b><div style="font-size:12.5px;color:var(--mute)">일반 회원</div></div>`,
            ['주문 목록', '취소·반품·교환 내역', '리뷰', '문의', '배송지 관리', '회원정보'].map((m) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:15px 2px;border-bottom:1px solid var(--line2);font-size:15px">${m}${Icon('angle-right-min')}</div>`).join(''))),
        Canvas({ size: 'mobile', label: 'U-21 · 모바일 · 켠 몰의 마이 탭(비교용 · 적립금·쿠폰 줄 있음)' }, MobilePage({ tab: '마이' },
            `<div style="padding:4px 0 14px"><b style="font-size:18px">김민지 님</b><div style="font-size:12.5px;color:var(--mute)">일반 회원</div></div>`,
            Stats([{ k: '적립금', v: '2,400원' }, { k: '쿠폰', v: '1장' }]), '<div style="height:8px"></div>',
            ['주문 목록', '취소·반품·교환 내역', '쿠폰·적립금', '리뷰', '문의', '배송지 관리', '회원정보'].map((m) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:15px 2px;border-bottom:1px solid var(--line2);font-size:15px">${m}${Icon('angle-right-min')}</div>`).join(''))),
    ),
);

export default function U21() {
    return [state1, state2, state3, state4].join('');
}
