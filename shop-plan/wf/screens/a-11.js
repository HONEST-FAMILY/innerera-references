import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };

const WAIT = [
    { no: '20261111-000126', at: '11-11 08:55', opt: O1, qty: 1, name: '최도윤', tel: '010-****-2204', how: '가상계좌', bank: '국민 9012-****-3381', payer: '최도윤', amt: '52,000원', due: '11-12 23:59', left: '1일 13시간 남음' },
    { no: '20261111-000122', at: '11-11 07:30', opt: O2, qty: 1, name: '정수아', tel: '010-****-9015', how: '무통장입금', bank: '기업 123-****-01-018', payer: '정수아', amt: '93,000원', due: '11-13 23:59', left: '2일 13시간 남음' },
    { no: '20261110-000119', at: '11-10 23:48', opt: O4, qty: 1, name: '윤서연', tel: '010-****-3317', how: '무통장입금', bank: '기업 123-****-01-018', payer: '윤영호(남편)', amt: '176,000원', due: '11-12 23:59', left: '1일 13시간 남음', memo: true },
    { no: '20261110-000104', at: '11-10 10:12', opt: O1, qty: 2, name: '임재현', tel: '010-****-6642', how: '가상계좌', bank: '신한 5621-****-7745', payer: '임재현', amt: '98,000원', due: '11-11 23:59', left: '13시간 남음', soon: true },
    { no: '20261109-000097', at: '11-09 12:05', opt: O1, qty: 1, name: '강지호', tel: '010-****-4468', how: '무통장입금', bank: '기업 123-****-01-018', payer: '강지호', amt: '49,000원', due: '11-11 12:05', left: '1시간 59분 남음', soon: true },
];

const COLS = [{ t: '주문번호 · 주문일시', w: 146 }, '상품 · 구성', { t: '주문자', w: 100 }, { t: '결제수단 · 입금 계좌', w: 150 }, { t: '입금자명', w: 96 }, { t: '입금할 금액', w: 92, align: 'right' }, { t: '입금 기한 · 남은 시간', w: 136, sort: 'asc' }, { t: '입금 확인', w: 96 }];
const row = (o) => ({
    hl: o.soon,
    c: [`<u>${o.no}</u><small>${o.at}</small>`, `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, `${o.how}<small>${o.bank}</small>`,
        `${o.payer}${o.memo ? `<small>${Icon('note-o')} 메모 있음</small>` : ''}`, o.amt, `${o.due}<small>${o.soon ? Badge(o.left, 'warn') : o.left}</small>`,
        o.how === '무통장입금' ? Btn('입금 확인', { size: 'sm' }) : '<small>자동 확인</small>'],
});

const TABS = [{ t: '입금 대기', n: 5 }, { t: '기한 지나 자동 취소됨', n: 2 }];
const HeadActions = [Btn('주문·클레임 정책', { icon: 'cog' }), Btn('입금 내역 엑셀로 대조', { kind: 'primary', icon: 'file-upload-o' })];
const Page = (tab, ...body) => AdminLayout({ active: 'a-11', counts: COUNTS, actions: HeadActions, desc: '가상계좌는 입금되면 자동으로 결제완료가 됩니다. 무통장입금만 통장을 보고 직접 확인합니다.' }, Tabs(TABS, tab), body);

const Search = (sum) => Filters({ open: false, summary: sum || '주문일 최근 7일 · 결제수단 전체 · 입금 기한 순' });
const Head = () => ListHead({ total: 5, left: Chips(['전체 5', '가상계좌 2', '무통장입금 3', '오늘 기한 2'], '전체 5'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] });
const Foot = () => [Note('금액은 예시 값입니다(판매가 미확정). 입금 기한은 설정 > 결제의 가상계좌 입금 기한(지금 주문 다음 날 23:59), 무통장입금은 설정 > 주문·클레임 정책의 자동 취소 기한(지금 2일)을 따릅니다.'), Pager({ page: 1, last: 1, per: 50 })];

const state1 = StateBlock({ idx: 1, title: '목록(입금 기한·남은 시간)', note: '아직 돈이 들어오지 않은 주문. 기한이 가까운 순으로 정렬되고, 기한이 24시간 안으로 남으면 줄이 강조됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '입금 대기 주문은 재고를 잡고 있습니다. 운영자가 알아야 하는 것은 언제 풀리는지(입금 기한 · 남은 시간)와 내가 직접 확인해야 하는 건인지(무통장입금)입니다. 가상계좌는 결제 대행사가 입금을 알려 주므로 버튼 없이 자동 확인이라고만 적고, 무통장입금 줄에만 입금 확인 버튼이 있습니다. 이 화면은 자사몰 주문만 나옵니다(스마트스토어는 네이버가 결제 완료된 주문만 넘겨 줌).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '무통장입금을 켜지 않은 몰(설정 > 결제)은 입금 확인 칸과 입금 내역 엑셀 대조 버튼이 없습니다. 입금자명이 주문자와 다르면(가족 이름 등) 고객이 주문서에 적은 입금자명을 보여 줍니다. 입금 기한 하루 전에 고객에게 입금 안내가 한 번 더 갑니다(설정 > 알림에서 켜고 끔).'),
    Canvas({ label: 'A-11 · 입금 대기 탭 · 목록 (가상계좌 + 무통장입금)' }, Page('입금 대기', Search(), Head(), Table({ check: true, cols: COLS, rows: WAIT.map(row) }), Foot())),
    Canvas({ label: 'A-11 · 검색 조건 펼침' }, Page('입금 대기',
        Filters({ rows: [
            { k: '기간', v: [Select({ value: '주문일', w: 110 }), Period({ preset: '7일' })] },
            { k: '결제수단', v: RadioGroup(['전체', '가상계좌', '무통장입금'], '전체') },
            { k: '입금 기한', v: RadioGroup(['전체', '오늘까지', '내일까지'], '전체') },
            { k: '검색어', v: [Select({ value: '입금자명', w: 150 }), Input({ placeholder: '입금자명 · 주문자 이름 · 연락처 뒷 4자리 · 주문번호', icon: 'search', w: 380 })] },
        ] }),
    )),
    Canvas({ label: 'A-11 · 2건 선택 → 일괄 처리 바' }, Page('입금 대기', Search(),
        BulkBar({ count: 2, sub: '무통장입금 2건 · 합계 269,000원' }, Btn('입금 확인', 'primary'), Btn('입금 안내 다시 보내기', { kind: 'line', icon: 'send' }), Btn('입금 기한 늘리기', 'line'), Btn('주문 취소', 'line')),
        Table({ check: true, checked: [1, 2], cols: COLS, rows: WAIT.map(row) }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '입금 기한 늘리기 → 팝업 (고객이 내일 넣겠다고 전화한 경우)', right: '팝업만', pad: 20 },
            Modal({ title: '입금 기한 늘리기 · 2건', w: 480, foot: [Btn('취소'), Btn('기한 늘리기', 'primary')] },
                FormTable([
                    { k: '새 입금 기한', required: true, v: RadioGroup(['1일 더', '2일 더', '3일 더'], '1일 더'), help: '최대 3일까지 한 번만 늘릴 수 있습니다. 가상계좌는 결제 대행사 계좌의 만료일도 함께 늘어납니다.' },
                    { k: '고객 알림', v: Check('바뀐 입금 기한 안내 보내기', { on: true }) },
                ]),
                Table({ dense: true, cols: ['주문번호', '주문자', '지금 기한', '바뀌는 기한'], rows: [['20261111-000122', '정수아', '11-13 23:59', '<b>11-14 23:59</b>'], ['20261110-000119', '윤서연', '11-12 23:59', '<b>11-13 23:59</b>']] }),
            )),
        Canvas({ size: 'auto', label: '입금 안내 다시 보내기 → 확인 (알림 문구 미리보기)', right: '팝업만', pad: 20 },
            Modal({ title: '입금 안내 다시 보내기 · 2건', w: 480, foot: [Btn('취소'), Btn('2건 보내기', 'primary')] },
                Box({ flat: true, title: '고객에게 가는 알림', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 정수아 님, 아직 입금이 확인되지 않았습니다.<br>입금 계좌: 기업은행 123-456789-01-018 (예금주 이너에라)<br>입금 금액: 93,000원<br>입금 기한: 11월 13일(금) 23:59<br>기한이 지나면 주문이 자동으로 취소됩니다.', { sm: true })),
                Note('같은 주문에는 하루에 한 번만 다시 보낼 수 있습니다.'),
            )),
    ),
    Canvas({ label: 'A-11 · 입금 대기 주문이 없을 때' }, Page('입금 대기', Search(), ListHead({ total: 0, right: PerPage(50) }),
        `<div class="wf-tablewrap">${Empty({ icon: 'wallet', title: '입금을 기다리는 주문이 없습니다', desc: '가상계좌·무통장입금으로 주문이 들어오면 여기에 나타납니다.', action: Btn('전체 주문 조회로', 'primary') })}</div>`)),
);

const GONE = [
    ['20261108-000091', '11-08 20:11', O1, 1, '이하은', '010-****-7730', '가상계좌', '49,000원', '11-09 23:59', '11-10 00:05', '알림톡 성공'],
    ['20261108-000085', '11-08 09:02', O2, 1, '박서준', '010-****-5821', '무통장입금', '93,000원', '11-10 09:02', '11-10 09:05', '알림톡 실패 → 문자 성공'],
];
const GONE_COLS = [{ t: '주문번호 · 주문일시', w: 146 }, '상품 · 구성', { t: '주문자', w: 100 }, { t: '결제수단', w: 86 }, { t: '금액', w: 84, align: 'right' }, { t: '입금 기한', w: 96 }, { t: '자동 취소 시각', w: 104 }, { t: '상태', w: 84 }, { t: '고객 알림', w: 140 }];

const state2 = StateBlock({ idx: 2, title: '기한 지난 건 자동 취소 안내', note: '입금 기한이 지난 주문은 운영자가 손대지 않아도 취소되고 재고가 풀립니다. 무엇이 왜 취소됐는지 이 탭에서 확인합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '입금되지 않은 주문을 사람이 매일 찾아 취소하는 일을 없앱니다. 대신 자동으로 한 일을 숨기지 않습니다. 목록 위 안내 줄에 규칙(며칠 뒤 자동 취소)과 설정 위치를 적고, 자동 취소된 주문은 따로 탭에 7일 동안 남깁니다. 취소 뒤 고객이 뒤늦게 입금했다고 연락하면 여기서 주문을 되살립니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '자동 취소 일수는 설정 > 주문·클레임 정책에서 1~7일로 바꿉니다(초기값 2일, 끄면 자동 취소 안 함). 자동 취소되면 쓴 쿠폰·적립금이 고객에게 돌아가고 취소 안내가 갑니다. 주문 되살리기는 재고가 남아 있을 때만 됩니다.'),
    Canvas({ label: 'A-11 · 입금 대기 탭 위 안내 줄 (오늘 자동 취소될 건이 있을 때)' }, Page('입금 대기',
        Note('입금 기한이 지나면 주문이 자동으로 취소되고 재고가 풀립니다. 지금 설정: 무통장입금 주문 뒤 <b>2일</b> · 가상계좌 주문 다음 날 23:59. 오늘 안에 기한이 끝나는 주문 <b>2건</b>. <u>설정 바꾸기</u>', { warn: true }),
        Search(), Head(), Table({ check: true, cols: COLS, rows: WAIT.slice(3).map(row) }),
    )),
    Canvas({ label: 'A-11 · 기한 지나 자동 취소됨 탭 (최근 7일)' }, Page('기한 지나 자동 취소됨',
        Note('최근 7일 동안 입금 기한이 지나 자동으로 취소된 주문입니다. 7일이 지나면 이 탭에서 빠지고 전체 주문 조회(상태 취소)에서 찾을 수 있습니다.'),
        ListHead({ total: 2, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: GONE_COLS, rows: GONE.map((g) => [`<u>${g[0]}</u><small>${g[1]}</small>`, `${P}<small>${g[2]} · ${g[3]}개</small>`, `${g[4]}<small class="nw">${g[5]}</small>`, g[6], g[7], g[8], g[9], OrderBadge('취소완료'), `<small>${g[10]}</small>`]) }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '자동 취소된 주문 1건 선택 → 주문 되살리기 (뒤늦게 입금한 고객)', right: '팝업만', pad: 20 },
            Modal({ title: '주문 되살리기 · 20261108-000085', w: 520, foot: [Btn('닫기'), Btn('되살리고 입금 확인', 'primary')] },
                KV([['주문자', '박서준 · 010-****-5821'], ['상품', `${P} · ${O2} · 1개`], ['금액', '93,000원'], ['재고', `${Badge('남아 있음', 'check')} ${O2} 재고 142개`]]),
                '<div style="height:12px"></div>',
                FormTable([
                    { k: '되살린 뒤 상태', v: [Radio('바로 결제완료 (입금을 확인했음)', { on: true }), Radio('입금 대기로 (기한 1일 다시 줌)')] },
                    { k: '입금 확인 내용', v: [Input({ value: '박서준', w: 120 }), Input({ value: '93,000', suffix: '원', w: 130 }), Input({ value: '2026-11-11', icon: 'calendar', w: 140 })] },
                ]),
                Note('취소할 때 고객에게 돌려준 쿠폰(가입 축하 3,000원)을 다시 사용 처리합니다. 고객에게 결제 완료 안내가 갑니다.'),
            )),
        Canvas({ size: 'auto', label: '되살릴 수 없을 때 (그사이 품절)', right: '팝업만', pad: 20 },
            Confirm({ w: 420, title: '이 주문은 되살릴 수 없습니다', desc: `${O4} 재고가 0개입니다.<br>재고를 채운 뒤 다시 시도하거나, 고객에게 입금액을 돌려주고 새로 주문하도록 안내하세요.`, foot: [Btn('닫기'), Btn('재고 관리로', 'primary')] })),
        Canvas({ size: 'auto', label: '자동 취소를 끈 몰의 안내 줄', right: '부분', pad: 20 }, `<div style="width:460px">${Note('자동 취소가 꺼져 있습니다. 입금되지 않은 주문이 계속 재고를 잡고 있으니 직접 취소해 주세요. <u>설정 바꾸기</u>', { warn: true })}</div>`),
    ),
);

const depositForm = (o = {}) => FormTable([
    { k: '주문', v: Text(`<u>${o.no || '20261110-000119'}</u> · ${o.name || '윤서연'} · ${P} ${o.opt || O4} 1개`) },
    { k: '입금할 금액', v: Text(`<b>${o.need || '176,000원'}</b>`) },
    { k: '주문서의 입금자명', v: Text(o.payer || '윤영호(남편)') },
    { k: '실제 입금자명', required: true, v: Input({ value: o.realName === undefined ? '윤영호' : o.realName, w: 200 }), help: '통장에 찍힌 이름을 적습니다. 주문서의 입금자명과 다르면 처리 기록에 남습니다.' },
    { k: '실제 입금액', required: true, v: Input({ value: o.real || '176,000', suffix: '원', w: 200, error: !!o.err }), error: o.err },
    { k: '입금일', required: true, v: Input({ value: '2026-11-11', icon: 'calendar', w: 200 }) },
    { k: '고객 알림', v: Check('결제 완료 안내 보내기 (알림톡 · 실패 시 문자)', { on: true }) },
]);

const bankRows = [
    { row: 3, a: '11-11 09:12 · 강지호 · 49,000원', b: '<u>20261109-000097</u> 강지호 49,000원', r: Badge('일치', 'check') },
    { row: 4, a: '11-11 09:30 · 윤영호 · 176,000원', b: '<u>20261110-000119</u> 윤서연 176,000원', r: Badge('입금자명 다름 · 주문서 입금자명과 일치', 'check') },
    { row: 5, a: '11-11 09:41 · 정수아 · 90,000원', b: '<u>20261111-000122</u> 정수아 93,000원', r: Badge('3,000원 모자람', 'warn'), hl: true },
    { row: 6, a: '11-11 10:02 · 한지우 · 49,000원', b: '맞는 주문 없음', r: Badge('주문을 찾지 못함', 'warn'), hl: true },
];

const state3 = StateBlock({ idx: 3, title: '수동 입금 확인 팝업', note: '무통장입금 주문의 입금 확인 버튼을 누르면 뜹니다. 통장 내역과 입금자명·금액을 대조하고 확인하면 결제완료가 됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '무통장입금은 통장을 사람이 봅니다. 가장 흔한 실수는 금액이 모자란데 확인을 누르는 것과 다른 사람 입금을 엉뚱한 주문에 붙이는 것입니다. 그래서 주문서의 입금자명·입금할 금액을 위에 보여 주고 실제 값을 넣게 해, 다르면 그 자리에서 알려 줍니다. 건수가 많은 몰은 은행에서 내려받은 입금 내역 엑셀을 올려 한 번에 대조합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '입금 확인은 되돌리기 어렵습니다(결제완료가 되면 발주 대상이 됨). 금액이 모자라면 확인 버튼이 막히고, 넘치면 차액을 어떻게 할지 고르게 합니다. 누가 언제 확인했는지는 주문 상세 처리 기록에 남습니다.'),
    Canvas({ label: 'A-11 · 무통장입금 주문의 입금 확인 버튼 → 팝업 (금액 일치)' }, Overlay({ bg: Page('입금 대기', Search(), Head(), Table({ check: true, cols: COLS, rows: WAIT.map(row) })), h: 700 },
        Modal({ title: '입금 확인', w: 560, foot: [Btn('취소'), Btn('입금 확인 (결제완료로 변경)', 'primary')] },
            depositForm(),
            Note(`${Icon('check-min')} 입금액이 입금할 금액과 같습니다. 확인하면 주문이 결제완료가 되고 발주 확인·발송 처리의 신규 주문에 나타납니다.`),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '입금액이 모자람 → 확인 막힘', right: '팝업만', pad: 20 },
            Modal({ title: '입금 확인', w: 560, foot: [Btn('취소'), Btn('모자란 금액 안내 보내기', { icon: 'send' }), Btn('입금 확인 (결제완료로 변경)', { kind: 'primary', disabled: true })] },
                depositForm({ no: '20261111-000122', name: '정수아', opt: O2, need: '93,000원', payer: '정수아', realName: '정수아', real: '90,000', err: '입금할 금액보다 3,000원 모자랍니다. 나머지가 들어오면 다시 확인하세요.' }),
            )),
        Canvas({ size: 'auto', label: '입금액이 넘침 → 차액 처리 고르기', right: '팝업만', pad: 20 },
            Modal({ title: '입금 확인', w: 560, foot: [Btn('취소'), Btn('입금 확인 (결제완료로 변경)', 'primary')] },
                FormTable([
                    { k: '입금할 금액', v: Text('<b>49,000원</b> · 강지호') },
                    { k: '실제 입금액', required: true, v: Input({ value: '50,000', suffix: '원', w: 200 }), help: '입금할 금액보다 1,000원 많습니다.' },
                    { k: '더 들어온 1,000원', required: true, v: [Radio('고객 계좌로 돌려주기 (환불 계좌를 고객에게 요청)', { on: true }), Radio('적립금으로 넣어 주기'), Radio('나중에 처리 (관리자 메모에 남김)')], help: '적립금 기능을 끈 몰에서는 적립금 선택지가 없습니다.' },
                ]),
            )),
    ),
    Canvas({ label: 'A-11 · 2건 선택 → 입금 확인 (일괄 · 금액이 모두 맞는다고 보고 확인)' }, Overlay({ bg: Page('입금 대기', Search(), BulkBar({ count: 2, sub: '무통장입금 2건 · 합계 269,000원' }, Btn('입금 확인', 'primary')), Table({ check: true, checked: [1, 2], cols: COLS, rows: WAIT.map(row) })), h: 460 },
        Confirm({ w: 460, title: '선택한 2건을 입금 확인할까요?', desc: '정수아 93,000원 · 윤서연(입금자 윤영호) 176,000원<br>통장에 입금된 금액이 위와 같은지 확인하셨나요? 확인하면 결제완료가 되고 고객에게 결제 완료 안내가 갑니다.<br>가상계좌 주문은 일괄 입금 확인 대상에서 빠집니다.', ok: '2건 입금 확인' }))),
    Canvas({ label: 'A-11 · 입금 내역 엑셀로 대조 버튼 → 은행 엑셀을 올린 뒤 대조 결과' }, Overlay({ bg: Page('입금 대기', Search()), h: 640 },
        Modal({ title: '입금 내역 엑셀로 대조', w: 820, foot: [Btn('파일 다시 올리기'), Btn('일치한 2건 입금 확인', 'primary')] },
            Text('기업은행_거래내역_20261111.xlsx · 입금 4행 · 대조 기준: 입금자명 + 금액 (주문서의 입금자명 포함)', { sm: true, mute: true }),
            Table({ dense: true, cols: [{ t: '엑셀 행', w: 64 }, '통장 입금 내역', '맞는 주문', { t: '결과', w: 250 }], rows: bankRows.map((b) => ({ hl: b.hl, c: [`${b.row}행`, b.a, b.b, b.r] })) }),
            Note('금액이 모자라거나 주문을 찾지 못한 2행은 처리하지 않습니다. 목록에서 한 건씩 입금 확인하거나 고객에게 연락하세요. 은행 양식(기업·국민·신한·농협·우리·하나)은 자동으로 알아봅니다.'),
        ))),
    Canvas({ label: 'A-11 · 입금 확인 뒤 토스트' }, Overlay({ bg: Page('입금 대기', Search(), Table({ check: true, cols: COLS, rows: WAIT.slice(0, 2).map(row) })), dim: false, align: 'top', h: 340 },
        Toast('2건을 입금 확인했습니다. 결제완료로 바뀌어 신규 주문에 들어갔습니다.', { action: '발주 확인으로 가기' }))),
);

export default function A11() {
    return [state1, state2, state3].join('');
}
