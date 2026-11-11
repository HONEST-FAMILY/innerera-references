import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chip, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast,
    Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Grid, Empty, Thumb, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;

const Col = (...c) => `<div style="min-width:0">${c.join('')}</div>`;

const Cal = (o = {}) => {
    const cells = [];
    for (let i = 0; i < (o.start || 0); i += 1) cells.push('<span></span>');
    for (let d = 1; d <= (o.days || 30); d += 1) {
        const past = d < (o.min || 0);
        const edge = d === o.from || d === o.to;
        const mid = o.from && o.to && d > o.from && d < o.to;
        const style = edge ? 'background:var(--dark);color:#fff;font-weight:700' : mid ? 'background:var(--fill)' : past ? 'color:var(--line);text-decoration:line-through' : d === o.today ? 'border:1px solid var(--ink)' : '';
        cells.push(`<span style="height:30px;display:flex;align-items:center;justify-content:center;border-radius:3px;${style}">${d}</span>`);
    }
    return `<div style="width:262px;border:1px solid var(--ink);border-radius:4px;background:#fff;padding:12px;font-size:12.5px;box-shadow:0 6px 18px rgba(0,0,0,.14)">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">${Icon('angle-left-min')}<b>${o.ym || '2026년 11월'}</b>${Icon('angle-right-min')}</div>
<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center"><span style="color:var(--mute)">일</span><span style="color:var(--mute)">월</span><span style="color:var(--mute)">화</span><span style="color:var(--mute)">수</span><span style="color:var(--mute)">목</span><span style="color:var(--mute)">금</span><span style="color:var(--mute)">토</span>${cells.join('')}</div>
<div style="margin-top:8px;font-size:11.5px;color:var(--mute)">${o.note || '테두리 = 오늘 · 줄 그은 날 = 고를 수 없음 · 검은 칸 = 시작·끝'}</div></div>`;
};

const COUPONS = [
    { n: '신규 가입 3,000원 할인', type: '주문서 쿠폰', how: '자동 · 회원가입', benefit: '3,000원 할인', cond: '3만원 이상', period: '상시 · 발급 뒤 30일', issued: '2,418', used: '1,102', st: '진행 중' },
    { n: '11월 감사 5,000원 할인', type: '주문서 쿠폰', how: '지정 발급', benefit: '5,000원 할인', cond: '3만원 이상', period: '11-05 ~ 12-05', issued: '64', used: '18', st: '진행 중' },
    { n: '블랙위크 2박스 구성 10%', type: '상품 쿠폰', how: '다운로드', benefit: '10% 할인<small>최대 10,000원</small>', cond: '2박스(28일분) 구성만', period: '11-20 ~ 11-30', issued: '0 / 500', used: '0', st: '예정' },
    { n: '첫 구매 무료배송', type: '배송비 쿠폰', how: '자동 · 첫 구매', benefit: '배송비 전액', cond: '조건 없음', period: '상시 · 발급 뒤 14일', issued: '733', used: '412', st: '진행 중' },
    { n: 'WELCOME2026', type: '주문서 쿠폰', how: '쿠폰 코드', benefit: '2,000원 할인', cond: '2만원 이상', period: '10-01 ~ 12-31', issued: '189 / 1,000', used: '97', st: '진행 중' },
    { n: '생일 축하 10% 할인', type: '주문서 쿠폰', how: '자동 · 생일', benefit: '10% 할인<small>최대 8,000원</small>', cond: '조건 없음', period: '상시 · 생일 달 말일까지', issued: '206', used: '74', st: '발급 중지' },
    { n: '10월 한가위 3,000원', type: '주문서 쿠폰', how: '다운로드', benefit: '3,000원 할인', cond: '3만원 이상', period: '09-25 ~ 10-10', issued: '500 / 500', used: '311', st: '종료' },
];
const stBadge = (s) => Badge(s, { '진행 중': 'solid', 예정: 'dash', '발급 중지': 'warn', 종료: 'mute' }[s]);
const COLS = ['쿠폰 이름', { t: '유형', w: 96 }, { t: '발급 방식', w: 110 }, { t: '혜택', w: 100 }, { t: '사용 조건', w: 120 }, { t: '기간', w: 130 }, { t: '발급 수', w: 80, align: 'right' }, { t: '사용 수', w: 64, align: 'right' }, { t: '사용률', w: 56, align: 'right' }, { t: '상태', w: 84 }];
const rate = (c) => { const i = parseInt(c.issued.replace(/,/g, ''), 10); const u = parseInt(c.used.replace(/,/g, ''), 10); return i ? `${Math.round((u / i) * 100)}%` : '-'; };
const row = (c) => ({ dim: c.st === '종료', c: [`<u>${c.n}</u>`, Badge(c.type, 'line'), c.how, c.benefit, c.cond, c.period, c.issued, `<u>${c.used}</u>`, rate(c), stBadge(c.st)] });

const Page = (...body) => AdminLayout({ active: 'a-40', actions: [Btn('쿠폰 등록', { kind: 'primary', icon: 'plus' })] }, body);
const listBody = (checked = []) => [
    Filters({ open: false, summary: '상태 전체 · 유형 전체 · 발급 방식 전체' }),
    checked.length
        ? BulkBar({ count: checked.length, sub: '진행 중 2개' }, Btn('발급 중지', 'primary'), Btn('복사해서 새로 만들기', 'line'), Btn('삭제', 'line'))
        : ListHead({ total: 7, left: Chips(['전체 7', '진행 중 4', '예정 1', '발급 중지 1', '종료 1'], '전체 7'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
    Table({ check: true, checked, cols: COLS, rows: COUPONS.map(row) }),
    Pager({ page: 1, last: 1, per: 50 }),
];

const state1 = StateBlock({ idx: 1, title: '목록(발급·사용 수)', note: '혜택 > 쿠폰의 첫 화면. 쿠폰마다 몇 장 나가고 몇 장 쓰였는지를 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '쿠폰은 만들고 끝이 아니라 "얼마나 쓰였나"로 다음 쿠폰을 정합니다. 그래서 발급 수·사용 수·사용률을 목록에 바로 두고, 사용 수를 누르면 그 쿠폰을 쓴 주문 목록으로 갑니다. 선착순 수량이 있는 쿠폰은 "189 / 1,000"처럼 남은 양이 보입니다. 초기 정렬: 진행 중 → 예정 → 중지 → 종료.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '한 장이라도 발급된 쿠폰은 혜택·조건을 고칠 수 없고(이미 받은 고객과 달라지므로) 이름·기간 연장·발급 중지만 됩니다. 삭제도 발급 0장일 때만 됩니다. 쿠폰 기능이 꺼진 몰은 이 메뉴가 사라지고 주문서의 쿠폰 칸도 없어집니다.'),
    Canvas({ label: 'A-40 · 쿠폰 목록' }, Page(listBody())),
    Canvas({ label: 'A-40 · 쿠폰 이름 누름 → 오른쪽에서 열리는 쿠폰 요약(발급·사용 현황)' }, Page(
        Grid('1fr 1fr',
            Box({ title: '11월 감사 5,000원 할인', sub: '주문서 쿠폰 · 지정 발급', right: [Btn('지정 발급', { size: 'sm', kind: 'primary' }), Btn('수정', { size: 'sm' }), Btn('발급 중지', { size: 'sm' })] }, KV([['혜택', '5,000원 할인'], ['사용 조건', '3만원 이상 주문 · 다른 쿠폰과 함께 쓸 수 없음'], ['사용 기간', '2026-11-05 ~ 2026-12-05'], ['발급 · 사용', '64장 발급 · 18장 사용(28%) · 할인 금액 합계 90,000원'], ['쿠폰으로 생긴 매출', '1,674,000원 (주문 18건)']], { wide: true })),
            Box({ title: '받은 회원 64명', right: Btn('엑셀', { size: 'sm', icon: 'download' }) }, Table({ dense: true, check: true, cols: ['회원', { t: '받은 날', w: 90 }, { t: '상태', w: 80 }, { t: '쓴 주문', w: 140 }], rows: [
                ['<u>김민지</u>', '11-05', Badge('보유', 'line'), '-'], ['<u>박서준</u>', '11-05', Badge('사용', 'check'), '<u>20261108-000117</u>'], ['<u>정수아</u>', '11-05', Badge('회수', 'strike'), '-'],
            ] }), Flex({ mt: 8 }, Btn('선택한 회원 쿠폰 회수', { size: 'sm' }))),
        ),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '2개 선택 → 발급 중지 버튼 → 확인', right: '팝업만', pad: 20 },
            Confirm({ w: 420, title: '쿠폰 2개의 발급을 멈출까요?', desc: '새로 발급·다운로드되지 않습니다.<br>이미 받은 고객 2,482명은 사용 기한까지 그대로 쓸 수 있습니다.<br>다시 발급하려면 목록에서 "발급 다시 시작"을 누르세요.', ok: '발급 중지' })),
        Canvas({ size: 'auto', label: '쿠폰이 하나도 없는 몰', right: '부분', pad: 20 },
            `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'coupon', title: '아직 만든 쿠폰이 없습니다', desc: '가입 축하 쿠폰부터 만들어 보세요. 가입하면 자동으로 발급됩니다.', action: [Btn('가입 축하 쿠폰 만들기', 'primary'), Btn('빈 쿠폰 만들기')] })}</div>`),
    ),
);

const typeRows = (type) => {
    if (type === '상품 쿠폰') return [
        { k: '혜택', required: true, v: [RadioGroup(['정액(원)', '정률(%)'], '정률(%)'), Input({ value: '10', suffix: '%', w: 100 }), Text('최대', { sm: true }), Input({ value: '10,000', suffix: '원', w: 130 })], help: '정률이면 최대 할인 금액을 꼭 넣습니다(비싼 상품에서 할인이 과해지는 것을 막음).' },
        { k: '대상 상품', required: true, v: [RadioGroup(['전체 상품', '고른 상품', '고른 카테고리', '고른 상품만 제외'], '고른 상품'), Flex({ gap: 6, mt: 8, wrap: true }, Chip(`${P} · 2박스(28일분)`, { on: true, close: true }), Btn('상품 고르기', { size: 'sm', icon: 'search' }))], help: '상품 쿠폰은 대상 상품 금액에서만 할인되고, 상품 상세에 "쿠폰 받기"로 보입니다.' },
        { k: '최소 구매 금액', v: [Input({ value: '0', suffix: '원 이상', w: 170 }), Text('대상 상품 금액 기준', { sm: true, mute: true })] },
    ];
    if (type === '주문서 쿠폰') return [
        { k: '혜택', required: true, v: [RadioGroup(['정액(원)', '정률(%)'], '정액(원)'), Input({ value: '5,000', suffix: '원', w: 130 })], help: '정액 쿠폰에는 최대 할인 칸이 없습니다.' },
        { k: '최소 주문 금액', required: true, v: [Input({ value: '30,000', suffix: '원 이상', w: 170 }), Text('배송비를 뺀 상품 금액 합계 기준', { sm: true, mute: true })] },
        { k: '제외 상품', v: [Check('할인 중인 상품 제외', { on: false }), Btn('제외할 상품·카테고리 고르기', { size: 'sm', icon: 'search' })], help: '주문서 쿠폰은 주문 전체 금액에서 할인되고 주문서의 쿠폰 칸에서 고릅니다. 주문 한 건에 1장.' },
    ];
    return [
        { k: '혜택', required: true, v: [RadioGroup(['배송비 전액', '배송비 일부'], '배송비 전액'), Input({ placeholder: '3,000', suffix: '원', w: 130, disabled: true })] },
        { k: '제주·도서산간', v: [Radio('기본 배송비만 할인(추가 배송비는 고객 부담)', { on: true }), Radio('추가 배송비도 할인')] },
        { k: '최소 주문 금액', v: Input({ value: '0', suffix: '원 이상', w: 170 }), help: '배송비 쿠폰에는 할인율·최대 할인·대상 상품 칸이 없습니다. 이미 무료배송인 주문에서는 쿠폰이 쓰이지 않고 남습니다.' },
    ];
};

const howRows = (how) => {
    if (how === '다운로드') return [
        { k: '받는 곳', v: CheckGroup(['상품 상세', '쿠폰존', '기획전 페이지'], ['상품 상세', '쿠폰존']) },
        { k: '발급 수량', v: [Radio('제한 없음'), Radio('선착순', { on: true }), Input({ value: '500', suffix: '장', w: 110 })], help: '다 나가면 고객 화면 버튼이 "마감"으로 바뀝니다.' },
        { k: '한 사람당', v: [Text('1장(고정)'), Check('회원만 받기', { on: true })] },
        { k: '다운로드 기간', required: true, v: Text('2026-11-20 00:00 ~ 2026-11-30 23:59 (아래 사용 기간과 따로 정함)') },
    ];
    if (how === '자동') return [
        { k: '발급 시점', required: true, v: RadioGroup(['회원가입', '생일', '첫 구매', '등급(매월)'], '생일') },
        { k: '생일 쿠폰', v: [Text('생일', { sm: true }), Input({ value: '7', suffix: '일 전에 발급', w: 150 }), Text('생일을 입력한 회원만 · 1년에 1번', { sm: true, mute: true })], help: '회원가입 = 가입 완료 즉시(1회) · 첫 구매 = 첫 주문이 구매확정될 때(1회) · 등급 = 회원 등급 화면에서 연결한 등급에게 산정 직후.' },
        { k: '발급 알림', v: Check('발급되면 고객에게 안내(광고 수신 동의 회원만)', { on: true }) },
    ];
    if (how === '지정 발급') return [
        { k: '받을 사람', v: Text('쿠폰을 저장한 뒤 목록에서 <b>지정 발급</b>을 눌러 회원을 고르거나, 회원 목록에서 회원을 골라 발급합니다.') },
        { k: '사용 기한', v: [Radio('아래 사용 기간대로'), Radio('발급한 날부터', { on: true }), Input({ value: '30', suffix: '일', w: 90 })] },
    ];
    return [
        { k: '쿠폰 코드', required: true, v: [Flex({ gap: 6, wrap: true }, Input({ value: 'WELCOME2026', w: 180 }), Btn('자동으로 만들기', { size: 'sm', icon: 'refresh' }), Btn('겹치는지 확인', { size: 'sm' }), Badge('쓸 수 있는 코드', 'check'))], help: '공용 코드 1개를 여러 명이 등록하는 방식입니다. 영문 대문자·숫자 4 ~ 20자. 고객은 마이페이지 > 쿠폰 > 쿠폰 코드 등록이나 주문서에서 넣습니다.' },
        { k: '등록 수량', v: [Radio('제한 없음'), Radio('선착순', { on: true }), Input({ value: '1,000', suffix: '명', w: 120 })] },
        { k: '한 사람당', v: Text('1번(고정)') },
        { k: '1회용 코드', v: Text('사람마다 다른 1회용 코드(전단·택배 상자용)는 2단계에서 제공합니다.', { mute: true }) },
    ];
};

const commonTop = (type, how) => [
    { k: '쿠폰 이름', required: true, v: Input({ value: { '상품 쿠폰': '블랙위크 2박스 구성 10%', '주문서 쿠폰': '11월 감사 5,000원 할인', '배송비 쿠폰': '첫 구매 무료배송' }[type], w: 360 }), help: '고객 쿠폰함에 그대로 보입니다. 30자까지.' },
    { k: '쿠폰 유형', required: true, v: RadioGroup(['상품 쿠폰', '주문서 쿠폰', '배송비 쿠폰'], type), help: '유형에 따라 아래 혜택·조건 칸이 바뀝니다. 저장한 뒤에는 유형을 바꿀 수 없습니다.' },
];
const commonBottom = (o = {}) => [
    { k: '사용 기간', required: true, v: [RadioGroup(['기간 지정', '발급일부터 n일', '제한 없음'], '기간 지정'), Flex({ mt: 8, gap: 6, align: 'center' }, Input({ value: '2026-11-20 00:00', icon: 'calendar', w: 180 }), '<span class="tilde">~</span>', Input({ value: o.err ? '2026-11-15 23:59' : '2026-11-30 23:59', icon: 'calendar', w: 180, error: o.err }))], error: o.err ? '끝나는 날이 시작하는 날보다 빠릅니다. 11월 20일 이후로 골라 주세요.' : undefined },
    { k: '함께 쓰기', v: Text('한 주문에 상품 쿠폰(상품 줄마다 1장) + 주문서 쿠폰 1장 + 배송비 쿠폰 1장까지, 적립금과도 함께 쓸 수 있습니다(고정).'), help: '같은 유형의 쿠폰끼리는 함께 쓸 수 없습니다. 비회원은 쿠폰을 쓸 수 없습니다.' },
    { k: '사용 채널', v: CheckGroup(['PC', '모바일'], ['PC', '모바일']), help: '스마트스토어 주문에는 쓸 수 없습니다(네이버 쿠폰은 판매자센터에서).' },
    { k: '소멸 안내', v: [Check('사용 기한 3일 전에 고객에게 안내', { on: true }), Text('광고 수신 동의 회원만', { sm: true, mute: true })] },
    { k: '쿠폰 설명', v: Textarea({ value: '2박스(28일분) 구성에만 쓸 수 있어요.', h: 56, count: '21 / 100' }) },
];

const FormPage = (type, how, o = {}) => AdminLayout({ active: 'a-40', crumb: ['혜택', '쿠폰', '쿠폰 등록'], title: '쿠폰 등록', actions: [Btn('취소'), Btn('저장', 'primary')] },
    Grid('1fr 300px',
        Col(
            Box({ title: '1. 기본 · 혜택' }, FormTable([...commonTop(type, how), ...typeRows(type)])),
            Box({ title: '2. 발급 방식' }, FormTable([{ k: '발급 방식', required: true, v: RadioGroup(['다운로드', '자동', '지정 발급', '쿠폰 코드'], how), help: '방식에 따라 아래 칸이 바뀝니다.' }, ...howRows(how)])),
            Box({ title: '3. 사용 기간 · 조건' }, FormTable(commonBottom(o))),
        ),
        Box({ title: '고객에게 보이는 쿠폰', sub: '입력하는 대로 바뀜' },
            `<div style="border:1px dashed var(--ink);border-radius:6px;padding:14px"><b style="font-size:20px">10%</b> <span style="font-size:12px;color:var(--mute)">최대 10,000원</span><br><b>블랙위크 2박스 구성 10%</b><br><span style="font-size:12px;color:var(--ink2)">2박스(28일분) 구성만 · 11-30 까지</span><div style="margin-top:10px">${Btn('쿠폰 받기', { size: 'sm', icon: 'download', block: true })}</div></div>`,
            '<div style="height:12px"></div>',
            KV([['유형', type], ['발급', how === '다운로드' ? '다운로드 · 선착순 500장' : how], ['예상 할인', '주문당 최대 10,000원'], ['최대 비용', '500장 × 10,000원 = 500만원']], { wide: true }),
            Note('최대 비용은 모든 쿠폰이 최대 할인으로 쓰였을 때의 금액입니다.'),
        ),
    ),
);

const pickModal = Modal({ title: '대상 상품 고르기', w: 720, foot: [Text('고른 품목 <b>1</b>개', { sm: true }), Btn('취소'), Btn('고른 상품 적용', 'primary')] },
    Tabs(['상품에서 고르기', '카테고리에서 고르기'], '상품에서 고르기', { kind: 'pill' }),
    Flex({ gap: 6 }, Select({ value: '전체 카테고리', w: 170 }), Input({ value: '젤리', icon: 'search', w: 260, focus: true }), Check('판매 중인 상품만', { on: true })),
    '<div style="height:10px"></div>',
    Table({ check: true, checked: [1], dense: true, cols: [{ t: '상품', w: 300 }, '구성(품목)', { t: '판매가', w: 110, align: 'right' }, { t: '상태', w: 80 }], rows: [
        [`${P}`, '1박스(14일분)', '49,000원', Badge('판매 중', 'check')],
        [`${P}`, '2박스(28일분)', '93,000원', Badge('판매 중', 'check')],
        { dim: true, c: [`${P}`, '4박스(56일분)', '176,000원', Badge('품절', 'strike')] },
    ] }),
    Note('상품 전체를 고르려면 상품 줄 맨 앞 체크박스를, 일부 구성만이면 구성 줄을 고릅니다. 금액은 예시 값입니다. 상품이 많은 몰은 이름·상품 코드로 찾고 50개씩 넘겨 봅니다.'),
);

const state2 = StateBlock({ idx: 2, title: '등록(유형: 상품·주문서·배송비 → 입력칸 분기, 발급 방식: 다운로드·자동(가입·생일·첫 구매)·지정 발급·코드)', note: '쿠폰 등록 버튼을 누르면 열리는 화면. 유형 3가지 × 발급 방식 4가지에 따라 입력칸이 달라집니다.' },
    Anno({ title: '유형별 입력칸' }, '상품 쿠폰 = 정액·정률 + 최대 할인 + 대상 상품(검색해서 고름) / 주문서 쿠폰 = 정액·정률 + 최소 주문 금액 + 제외 상품 / 배송비 쿠폰 = 전액·일부 + 제주·도서산간 처리(할인율·대상 상품 칸 없음). 초기값: 주문서 쿠폰 · 정액. 다른 유형 쿠폰·적립금과 함께 쓰는 규칙은 고정이라 입력칸이 없습니다.'),
    Anno({ title: '발급 방식별 입력칸' }, '다운로드 = 받는 곳·선착순 수량·다운로드 기간(1인 1장 고정) / 자동 = 발급 시점(가입·생일·첫 구매·등급)과 시점별 세부 / 지정 발급 = 저장 뒤 회원을 고름(발급일부터 n일) / 쿠폰 코드 = 공용 코드 1개(직접 입력 또는 자동 만들기). 사람마다 다른 1회용 코드는 2단계.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '오른쪽 미리보기에서 "최대 비용"을 같이 보여 줍니다(정률 쿠폰에 최대 할인을 안 넣거나 수량 제한 없이 뿌리는 사고 방지). 발급이 시작된 쿠폰은 혜택·조건·유형·발급 방식이 잠깁니다.'),
    Canvas({ label: 'A-40 · 쿠폰 등록 · 상품 쿠폰 + 다운로드 (전체 화면)' }, FormPage('상품 쿠폰', '다운로드')),
    CanvasRow(
        Canvas({ size: 'auto', label: '유형 = 주문서 쿠폰일 때 바뀌는 칸', right: '부분', pad: 20 }, `<div style="width:640px">${Box({ title: '1. 기본 · 혜택' }, FormTable([...commonTop('주문서 쿠폰'), ...typeRows('주문서 쿠폰')]))}</div>`),
        Canvas({ size: 'auto', label: '유형 = 배송비 쿠폰일 때 바뀌는 칸', right: '부분', pad: 20 }, `<div style="width:640px">${Box({ title: '1. 기본 · 혜택' }, FormTable([...commonTop('배송비 쿠폰'), ...typeRows('배송비 쿠폰')]))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '발급 방식 = 자동(가입·생일·첫 구매·등급)', right: '부분', pad: 20 }, `<div style="width:640px">${Box({ title: '2. 발급 방식' }, FormTable([{ k: '발급 방식', required: true, v: RadioGroup(['다운로드', '자동', '지정 발급', '쿠폰 코드'], '자동') }, ...howRows('자동')]))}</div>`),
        Canvas({ size: 'auto', label: '발급 방식 = 쿠폰 코드', right: '부분', pad: 20 }, `<div style="width:640px">${Box({ title: '2. 발급 방식' }, FormTable([{ k: '발급 방식', required: true, v: RadioGroup(['다운로드', '자동', '지정 발급', '쿠폰 코드'], '쿠폰 코드') }, ...howRows('쿠폰 코드')]))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '발급 방식 = 지정 발급', right: '부분', pad: 20 }, `<div style="width:640px">${Box({ title: '2. 발급 방식' }, FormTable([{ k: '발급 방식', required: true, v: RadioGroup(['다운로드', '자동', '지정 발급', '쿠폰 코드'], '지정 발급') }, ...howRows('지정 발급')]))}</div>`),
        Canvas({ size: 'auto', label: '사용 기간 끝 날짜 칸 누름 → 달력', right: '부분', pad: 20 },
            Flex({ gap: 6, align: 'center' }, Input({ value: '2026-11-20 00:00', icon: 'calendar', w: 180 }), '<span class="tilde">~</span>', Input({ value: '2026-11-30 23:59', icon: 'calendar', w: 180, focus: true })),
            `<div style="margin:6px 0 0 200px">${Cal({ today: 11, min: 20, from: 20, to: 30, note: '테두리 = 오늘 · 줄 그은 날 = 시작일보다 앞이라 고를 수 없음 · 검은 칸 = 시작·끝' })}<div style="width:262px;margin-top:6px;display:flex;gap:6px;align-items:center;font-size:12.5px">끝나는 시각 ${Select({ value: '23:59', w: 100 })} ${Btn('적용', { size: 'sm', kind: 'primary' })}</div></div>`),
    ),
    Canvas({ label: 'A-40 · 대상 상품 > 상품 고르기 버튼 → 검색형 팝업' }, Overlay({ bg: FormPage('상품 쿠폰', '다운로드'), h: 620 }, pickModal)),
    CanvasRow(
        Canvas({ size: 'auto', label: '저장 오류 · 사용 기간이 거꾸로', right: '부분', pad: 20 }, `<div style="width:640px">${Box({ title: '3. 사용 기간 · 조건' }, FormTable(commonBottom({ err: true }).slice(0, 1)))}</div>`, '<div style="height:12px"></div>', Toast('저장하지 못했습니다. 표시된 1곳을 고쳐 주세요.', { kind: 'error' })),
        Canvas({ size: 'auto', label: '저장 완료 → 다음 행동 안내', right: '팝업만', pad: 20 },
            Modal({ title: '쿠폰을 저장했습니다', w: 460, foot: [Btn('목록으로'), Btn('지정 발급하기', 'primary')] },
                KV([['쿠폰', '11월 감사 5,000원 할인'], ['상태', `${Badge('진행 중', 'solid')} 아직 받은 회원 없음`], ['다음 할 일', '지정 발급 쿠폰은 받을 회원을 골라야 고객에게 들어갑니다.']], { wide: true }))),
    ),
);

const issueModal = (tab, body, foot) => Modal({ title: '지정 발급 · 11월 감사 5,000원 할인', w: 760, foot },
    Tabs(['회원 검색해서 고르기', '조건으로 고르기', '엑셀로 대상 올리기'], tab, { kind: 'box' }), body);

const searchBody = [
    Flex({ gap: 6 }, Select({ value: '이름', w: 110 }), Input({ value: '김', icon: 'search', w: 240, focus: true }), Select({ value: '등급 전체', w: 130 }), Btn('검색', { size: 'sm', kind: 'primary' })),
    '<div style="height:10px"></div>',
    Grid('1fr 260px',
        Table({ dense: true, check: true, checked: [0, 2], cols: ['회원', { t: '등급', w: 60 }, { t: '최근 6개월 구매', w: 110, align: 'right' }, { t: '광고 수신', w: 80 }], rows: [
            ['김민지<small>mi****@naver.com · 010-****-1234</small>', 'VIP', '842,000원', Badge('동의', 'check')],
            { dim: true, nocheck: true, c: ['김서연<small>se***@gmail.com · 010-****-2290</small>', '실버', '128,000원', `${Badge('이미 보유', 'mute')}`] },
            ['김도현<small>do**@naver.com · 010-****-7714</small>', '일반', '49,000원', Badge('거부', 'x')],
        ] }),
        Box({ flat: true, title: '받을 회원 2명', right: '<u style="font-size:12px">모두 빼기</u>' }, Flex({ col: true, gap: 6 }, Chip('김민지 · 010-****-1234', { on: true, close: true }), Chip('김도현 · 010-****-7714', { on: true, close: true })), Note('이미 이 쿠폰을 가진 회원은 고를 수 없습니다.')),
    ),
    FormTable([{ k: '사용 기한', v: Text('발급일부터 30일 (2026-12-11 까지)') }, { k: '고객 알림', v: Check('쿠폰 발급 안내 보내기', { on: true }), help: '쿠폰 안내는 광고성이라 수신 동의 회원 1명(김민지)에게만 알림이 갑니다. 김도현 님은 쿠폰만 들어갑니다.' }]),
];

const condBody = [
    FormTable([
        { k: '회원 등급', v: CheckGroup(['VIP', '골드', '실버', '일반'], ['VIP', '골드']) },
        { k: '구매 금액', v: [Select({ value: '최근 3개월', w: 130 }), Input({ value: '300,000', suffix: '원 이상', w: 170 })] },
        { k: '마지막 주문', v: Select({ value: '60일 넘게 주문 없음', w: 220, open: true, options: ['조건 없음', '30일 넘게 주문 없음', { t: '60일 넘게 주문 없음', on: true }, '90일 넘게 주문 없음', '한 번도 주문 안 함'] }) },
    ]),
    '<div style="height:150px"></div>',
    Note('조건에 맞는 회원 <b>38명</b> (이미 보유 3명 제외 → 35명 발급). <u>대상 회원 미리 보기</u>'),
];

const excelBody = [
    Stepper(['양식 내려받기', '엑셀 올리기', '검증 결과', '발급'], 2),
    ExcelResult({ total: 120, ok: 116, fail: 4, keyLabel: '휴대폰 번호', rows: [
        { row: 9, key: '010-5521-88', value: '김하늘', reason: '휴대폰 번호 자릿수가 모자랍니다(11자리)' },
        { row: 41, key: '010-3312-7790', value: '박지우', reason: '이 번호로 가입한 회원이 없습니다' },
        { row: 77, key: '010-4821-1234', value: '김민지', reason: '이미 이 쿠폰을 갖고 있습니다' },
        { row: 102, key: '010-9015-3321', value: '정수아', reason: '휴면 회원이라 발급할 수 없습니다' },
    ], note: '엑셀에는 휴대폰 번호 또는 이메일 한 칸만 있으면 됩니다. 오류 4행은 빼고 116명에게 발급합니다.' }),
];

const state3 = StateBlock({ idx: 3, title: '지정 발급 팝업(회원 검색)', note: '목록이나 쿠폰 요약에서 지정 발급을 누르면 뜹니다. 받을 회원을 세 가지 방법으로 고릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '대상이 몇 명이냐에 따라 방법이 다릅니다. 한두 명(불편 보상)은 이름으로 찾아 고르고, 수십~수백 명(휴면 직전·우수 고객)은 조건으로, 외부에서 받은 명단(행사 참여자)은 엑셀로 올립니다. 회원은 이름·휴대폰으로 찾고 내부 번호는 쓰지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '이미 가진 회원·휴면 회원은 자동으로 빠지고 왜 빠졌는지 알려 줍니다. 쿠폰 발급 안내는 광고성이라 수신 동의 회원에게만 나가며, 거부 회원에게는 쿠폰만 들어갑니다.'),
    Canvas({ label: 'A-40 · 지정 발급 버튼 → 팝업 · 회원 검색해서 고르기' }, Overlay({ bg: Page(listBody()), h: 720 }, issueModal('회원 검색해서 고르기', searchBody, [Btn('취소'), Btn('2명에게 발급', 'primary')]))),
    CanvasRow(
        Canvas({ size: 'auto', label: '조건으로 고르기 탭(마지막 주문 목록 열림)', right: '팝업만', pad: 20 }, issueModal('조건으로 고르기', condBody, [Btn('취소'), Btn('35명에게 발급', 'primary')])),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '엑셀로 대상 올리기 탭 · 검증 결과', right: '팝업만', pad: 20 }, issueModal('엑셀로 대상 올리기', excelBody, [Btn('오류 4행만 엑셀로 받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('116명에게 발급', 'primary')])),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '엑셀로 대상 올리기 탭 · 올리기 전', right: '부분', pad: 20 }, `<div style="width:520px">${Stepper(['양식 내려받기', '엑셀 올리기', '검증 결과', '발급'], 0)}${Flex({ mt: 4 }, Btn('양식 내려받기', { icon: 'file-download-o', size: 'sm' }))}<div style="height:10px"></div>${Upload({ title: '회원 명단 엑셀을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · XLS · CSV', '용량 10MB 이하, 한 번에 10,000행까지', '휴대폰 번호 또는 이메일 중 한 칸만 채우면 됩니다'] })}</div>`),
        Canvas({ size: 'auto', label: '발급 완료', right: '부분', pad: 20 }, Toast('116명에게 쿠폰을 발급했습니다. 수신 동의 81명에게 안내를 보냈습니다.', { action: '받은 회원 보기' }), '<div style="height:14px"></div>', Toast('발급 수량(500장)이 모자랍니다. 남은 38장만큼만 발급할 수 있습니다.', { kind: 'error', action: '수량 늘리기' })),
    ),
);

export default function A40() {
    return [state1, state2, state3].join('');
}
