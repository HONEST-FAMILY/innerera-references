import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, Toggle,
    Textarea, FormTable, Filters, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast,
    Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Empty, SHOP,
} from '../lib/blocks.js';

const P = '롱지비티 석류맛 젤리스틱';
const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const T_NEW = '신규 주문(결제완료)';
const T_READY = '배송준비';
const T_RISK = '발송 지연 위험';
const T_HOLD = '출고 보류';

const TAB_LIST = [{ t: T_NEW, n: 38 }, { t: T_READY, n: 200 }, { t: T_RISK, n: 3 }, { t: T_HOLD, n: 2 }];

const ORDERS = [
    { no: '20261109-000125', at: '11-09 21:40', ch: '자사몰', opt: O1, qty: 3, name: '강지호', tel: '010-****-4468', addr: '인천 연수구 송도과학로 ***', memo: '', pay: '147,000원', due: '11-12(목)', d: 1 },
    { no: '2026110945790022', at: '11-09 22:14', ch: '스마트스토어', opt: O2, qty: 1, name: '정수아', tel: '010-****-9015', addr: '대전 유성구 대학로 ***', memo: '배송 전 연락 바랍니다', pay: '93,000원', due: '11-12(목)', d: 1 },
    { no: '20261111-000126', at: '11-11 08:55', ch: '자사몰', opt: O1, qty: 1, name: '최도윤', tel: '010-****-2204', addr: '제주 제주시 연북로 ***', memo: '', pay: '52,000원', due: '11-16(월)', d: 3, jeju: true },
    { no: '20261111-000127', at: '11-11 09:18', ch: '자사몰', opt: O4, qty: 1, name: '이하은', tel: '010-****-7730', addr: '부산 해운대구 센텀중앙로 ***', memo: '경비실에 맡겨 주세요', pay: '176,000원', due: '11-16(월)', d: 3 },
    { no: '2026111145821371', at: '11-11 09:31', ch: '스마트스토어', opt: O1, qty: 2, name: '박서준', tel: '010-****-5821', addr: '경기 성남시 분당구 판교역로 ***', memo: '', pay: '98,000원', due: '11-16(월)', d: 3 },
    { no: '20261111-000128', at: '11-11 09:42', ch: '자사몰', opt: O2, qty: 1, name: '김민지', tel: '010-****-1234', addr: '서울 마포구 월드컵북로 ***', memo: '문 앞에 놓아 주세요', pay: '93,000원', due: '11-16(월)', d: 3 },
];
const [KANG, JUNG, CHOI, LEE, PARK, KIM] = ORDERS;

const noCell = (o) => `<u>${o.no}</u><small>${o.at}</small>`;
const itemCell = (o) => `${P}<small>구성: ${o.opt}</small>`;
const toCell = (o) => `${o.name}<small class="nw">${o.tel}</small>`;
const addrCell = (o) => `${o.addr}${o.jeju ? ` ${Badge('제주 추가 배송비', 'line')}` : ''}${o.memo ? `<small>${Icon('message-o')} ${o.memo}</small>` : ''}`;
const dueCell = (o) => (o.dueTag ? o.dueTag : `${o.d <= 1 ? Badge(`D-${o.d}`, 'warn') : `D-${o.d}`}<small class="nw">${o.due}</small>`);

const NEW_COLS = [{ t: '주문번호 · 결제 일시', w: 150, sort: 'asc' }, { t: '채널', w: 100 }, '상품 · 옵션', { t: '수량', w: 48, align: 'center' }, { t: '수령인', w: 104 }, '배송지 · 배송 요청 사항', { t: '결제금액', w: 88, align: 'right' }, { t: '상태', w: 76 }, { t: '발송 기한', w: 86 }];
const newRow = (o) => [noCell(o), ChannelBadge(o.ch), itemCell(o), o.qty, toCell(o), addrCell(o), o.pay, OrderBadge('결제완료'), dueCell(o)];

const SearchBar = (summary) => Filters({ open: false, summary: summary || '결제 일시 오래된 순 · 채널 전체 · 택배사 전체' });

const HeadActions = [Btn('엑셀 양식 설정', { icon: 'cog' }), Btn('송장 엑셀 일괄 등록', { kind: 'primary', icon: 'file-upload-o' })];

const Page = (tab, ...body) => AdminLayout(
    { active: 'a-12', counts: { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1 }, actions: HeadActions },
    Tabs(TAB_LIST, tab),
    body,
);

const NewList = (checked = []) => [
    SearchBar(),
    checked.length
        ? BulkBar({ count: checked.length, sub: '자사몰 2건 · 스마트스토어 1건' }, Btn('발주확인', 'primary'), Btn('주문서 출력', { kind: 'line', icon: 'print' }), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' }), Btn('발송 지연 처리', 'line'))
        : ListHead({ total: 38, left: Chips(['전체 38', '자사몰 24', '스마트스토어 14'], '전체 38'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
    Table({ check: true, checked, cols: NEW_COLS, rows: ORDERS.map(newRow) }),
    Note('금액은 예시 값입니다(판매가 미확정). 발송 기한은 결제완료 후 3영업일이며 설정 > 주문·클레임 정책에서 바꿉니다.'),
    Pager({ page: 1, last: 1, per: 50 }),
];

const READY_COLS = [{ t: '주문번호 · 결제 일시', w: 140 }, { t: '채널', w: 96 }, '상품 · 옵션', { t: '수량', w: 44, align: 'center' }, { t: '수령인', w: 96 }, { t: '택배사', w: 124 }, { t: '송장번호', w: 150 }, { t: '상태', w: 76 }, { t: '발송 기한', w: 86 }];
const readyRow = (o, courier, invoice, extra = {}) => ({
    ...extra,
    c: [noCell(o), ChannelBadge(o.ch), itemCell(o), o.qty, toCell(o), courier, invoice, extra.badge || OrderBadge(extra.status || '배송준비'), dueCell(o)],
});
const Courier = () => Select({ value: 'CJ대한통운', w: 116 });
const Invoice = (value) => Input(value ? { value, w: 140 } : { placeholder: '송장번호', w: 140 });

const state1 = StateBlock({ idx: 1, title: '신규 주문(결제완료) 목록', note: '결제가 끝나 아직 아무도 확인하지 않은 주문. 결제 일시가 오래된 주문이 맨 위에 옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '자사몰 주문과 스마트스토어 주문을 한 목록에 섞어 보여 주고 채널 칸으로만 구분합니다. 주문/배송 담당은 두 관리자를 오가지 않고 이 화면 하나에서 포장할 물량을 셉니다. 스마트스토어 주문은 밑줄 표시로 구분합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '발송 기한(결제완료 후 3영업일)까지 하루 남은 주문은 기한 칸에 D-1 경고가 붙고, 오래된 순 정렬이라 맨 위에 옵니다. 같은 주문이 발송 지연 위험 탭에도 모입니다. 스마트스토어는 기한을 넘기면 판매자 벌점이 붙습니다.'),
    Canvas({ label: 'A-12 · 신규 주문 탭 · 선택 없음' }, Page(T_NEW, NewList())),
);

const state2 = StateBlock({ idx: 2, title: '일괄 발주확인', note: '체크한 주문을 한 번에 배송준비 상태로 넘깁니다. 이때부터 고객은 바로 취소할 수 없고 취소 요청으로 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '하루 200건을 한 건씩 눌러 확인하지 않도록, 머리 체크박스로 전체를 고르고 버튼 한 번으로 끝냅니다. 확인 팝업을 띄우지 않고 바로 처리한 뒤, 잘못 눌렀을 때를 위해 10초 동안 되돌리기를 줍니다. 스마트스토어 주문은 발주확인이 네이버로도 함께 전송됩니다.'),
    Canvas({ label: 'A-12 · 3건 선택 → 일괄 처리 바' }, Page(T_NEW, NewList([0, 1, 2]))),
    Canvas({ label: 'A-12 · 발주확인 버튼 → 바로 처리 → 토스트(되돌리기 10초)' }, Overlay({ bg: Page(T_NEW, SearchBar(), ListHead({ total: 35, left: Chips(['전체 35', '자사몰 23', '스마트스토어 12'], '전체 35'), right: PerPage(50) }), Table({ check: true, cols: NEW_COLS, rows: ORDERS.slice(3).map(newRow) })), dim: false, align: 'top', h: 420 },
        Toast('발주확인 3건 완료 · 배송준비 탭으로 옮겼습니다.', { action: '되돌리기 (10초)' }))),
);

const STEPS = ['양식 내려받기', '엑셀 올리기', '검증 결과', '발송처리'];

const modalUpload = Modal({ title: '송장 엑셀 일괄 등록', w: 640, foot: [Btn('닫기'), Btn('검증하기', { kind: 'primary', disabled: true })] },
    Stepper(STEPS, 0),
    Box({ title: '1. 양식 내려받기', sub: '배송준비 주문 200건이 채워진 엑셀' },
        FormTable([
            { k: '양식', v: Select({ value: '기본 양식 (주문번호 · 품목 주문번호 · 수령인 · 상품 · 택배사 · 송장번호)', w: 400 }), help: '택배사 프로그램에서 내려받은 파일을 그대로 올리려면 택배사 양식을 고르세요. 양식은 주문 > 엑셀 양식 설정에서 만듭니다.' },
            { k: '대상', v: [Radio('배송준비 전체 200건', { on: true }), Radio('목록에서 선택한 주문만')], help: '출고 보류(취소 요청 중) 2건은 양식에 들어가지 않습니다.' },
        ]),
        Flex({ mt: 12 }, Btn('양식 내려받기 (200건)', { icon: 'file-download-o' })),
    ),
    Box({ title: '2. 엑셀 올리기', sub: '택배사와 송장번호 칸을 채운 파일' },
        Upload({ title: '엑셀 파일을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · CSV', '용량 10MB 이하, 한 번에 5,000행까지', '첫 줄(제목 줄)은 지우지 마세요', '한 주문에 품목이 여럿이면 품목마다 한 줄'] }),
    ),
);

const modalPicked = Modal({ title: '송장 엑셀 일괄 등록', w: 640, foot: [Btn('닫기'), Btn('검증하기', 'primary')] },
    Stepper(STEPS, 1),
    Box({ title: '2. 엑셀 올리기', sub: '택배사와 송장번호 칸을 채운 파일' },
        Upload({ title: '다른 파일로 바꾸려면 끌어다 놓기', button: '파일 바꾸기', files: [{ name: '송장등록_20261111_CJ대한통운.xlsx', size: '62KB · 200행', icon: 'file-text-o' }] }),
        Note('검증하기를 누르면 아직 저장하지 않고, 주문번호·택배사·송장번호가 맞는지만 먼저 확인합니다.'),
    ),
);

const HOLD_REASON = '취소 요청 중(출고 보류) 품목이라 제외했습니다. 취소 관리에서 승인·거부를 먼저 처리하세요';

const modalResult = Modal({ title: '송장 엑셀 일괄 등록', w: 720, foot: [Btn('오류 행만 내려받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('성공 198건 발송 처리', 'primary')] },
    Stepper(STEPS, 2),
    ExcelResult({
        total: 200, ok: 198, fail: 2,
        rows: [
            { row: 17, key: '20261110-000098', value: '5812-3344-10', reason: '송장번호 형식 오류 (CJ대한통운은 숫자 12자리)' },
            { row: 88, key: '2026111045790031', value: '581233441207', reason: HOLD_REASON },
        ],
        note: '오류 행은 저장되지 않고 그대로 배송준비에 남습니다. 성공한 198건만 먼저 발송 처리하고, 오류 2행은 고쳐서 다시 올리거나 목록에서 바로 입력할 수 있습니다.',
    }),
);

const modalAllOk = Modal({ title: '송장 엑셀 일괄 등록', w: 520, foot: [Btn('파일 다시 올리기'), Btn('200건 발송 처리', 'primary')] },
    Stepper(STEPS, 2),
    ExcelResult({ total: 200, ok: 200, fail: 0, note: '모든 행이 정상입니다. 발송 처리를 누르면 200건이 배송중으로 바뀌고 고객에게 발송 안내가 갑니다.' }),
);

const modalDone = Modal({ title: '송장 엑셀 일괄 등록', w: 560, foot: [Btn('배송 현황 보기'), Btn('닫기', 'primary')] },
    Stepper(STEPS, 3),
    Text(`${Icon('check-circle-o')} 발송 처리 198건 완료`, { b: true }),
    KV([
        ['자사몰', '130건 · 배송중으로 변경, 배송 추적 등록'],
        ['스마트스토어', '68건 · 네이버로 발송처리 전송 완료'],
        ['고객 안내', '자사몰 130건 발송 안내 알림톡 발송(실패 시 문자로 대체) · 스마트스토어 68건은 네이버가 안내'],
        ['남은 주문', '배송준비 2건 (오류 행)'],
    ], { wide: true }),
);

const state3 = StateBlock({ idx: 3, title: '송장 엑셀 일괄 등록 팝업', note: '양식 내려받기 → 올리기 → 검증 결과(성공 n · 오류 n, 행별 사유) → 발송처리. 팝업 한 개가 단계에 따라 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '택배사 프로그램은 주문 엑셀을 넣으면 송장번호가 채워진 엑셀을 돌려줍니다. 그 파일을 그대로 올리면 하루 200건이 한 번에 끝납니다. 그래서 내려받는 양식을 택배사 양식에 맞출 수 있고(엑셀 양식 설정), 주문번호·품목 주문번호로 짝을 맞춥니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '올리자마자 저장하지 않습니다. 먼저 검증해서 몇 행이 되고 몇 행이 왜 안 되는지 행 번호와 사유로 보여 준 뒤, 되는 것만 발송 처리할지 운영자가 정합니다. 사유 종류: 없는 주문번호 · 이미 발송된 주문 · 취소 요청 중(출고 보류) · 택배사 이름을 알 수 없음 · 송장번호 형식 오류 · 같은 송장번호 중복(합포장이면 허용).'),
    Canvas({ label: 'A-12 · 송장 엑셀 일괄 등록 버튼 → 1단계 양식 내려받기 · 올리기 전' }, Overlay({ bg: Page(T_READY, SearchBar()), h: 780 }, modalUpload)),
    CanvasRow(
        Canvas({ size: 'auto', label: '2단계 · 파일을 고른 뒤', right: '팝업만', pad: 20 }, modalPicked),
        Canvas({ size: 'auto', label: '3단계 · 검증 결과 — 오류가 없을 때', right: '팝업만', pad: 20 }, modalAllOk),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '3단계 · 검증 결과 — 전체 200행 · 성공 198 · 오류 2 (행별 사유)', right: '팝업만', pad: 20 }, modalResult),
        Canvas({ size: 'auto', label: '4단계 · 발송 처리 완료 요약', right: '팝업만', pad: 20 }, modalDone),
    ),
);

const courierOpen = Select({ value: 'CJ대한통운', w: 116, open: true, search: '', options: [{ t: 'CJ대한통운', sub: '기본', on: true }, '한진택배', '롯데택배', '우체국택배', '로젠택배'] });

const state4 = StateBlock({ idx: 4, title: '목록에서 송장 바로 입력', note: '엑셀 없이 몇 건만 급하게 보낼 때. 줄마다 택배사와 송장번호를 넣고 한 번에 발송 처리합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '오류로 남은 2건, 오후에 추가로 나가는 몇 건은 엑셀을 다시 만들 일이 아닙니다. 택배사는 설정 > 배송의 기본 택배사가 미리 골라져 있어 송장번호만 치고 엔터로 다음 줄로 내려갑니다. 바코드 스캐너로 찍어도 같은 칸에 들어갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '자릿수·형식이 택배사 규칙과 다르면 칸에 경고만 띄우고 저장은 막지 않습니다(택배사가 번호 체계를 바꾸는 일이 있어서).'),
    Canvas({ label: 'A-12 · 배송준비 탭 · 송장 입력 중 (입력칸 상태: 입력됨 · 입력 중 · 형식 경고 · 택배사 고르는 중 · 빈칸)' }, Page(T_READY,
        SearchBar('결제 일시 오래된 순 · 채널 전체 · 송장 미입력만'),
        ListHead({ total: 200, left: [Chips(['송장 미입력 200', '송장 입력됨 0'], '송장 미입력 200'), Btn('택배사 일괄 지정', { size: 'sm' })], right: [Text('입력한 주문 <b>2</b>건', { sm: true }), Btn('입력한 2건 발송 처리', { kind: 'primary', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: READY_COLS, rows: [
            readyRow(KANG, Courier(), Invoice('581233441201'), { on: true }),
            readyRow(JUNG, Courier(), Invoice('581233441202'), { on: true }),
            readyRow(CHOI, Courier(), Input({ value: '5812334412', w: 140, focus: true })),
            readyRow(LEE, Courier(), `${Input({ value: '5812-3344-10', w: 140, error: true })}<small><b>CJ대한통운 송장은 숫자 12자리입니다</b></small>`, { hl: true }),
            readyRow(PARK, courierOpen, Invoice()),
            readyRow(KIM, Courier(), Invoice()),
        ] }),
        Pager({ page: 1, last: 4, per: 50 }),
    )),
);

const tieHead = (text, extra = '') => `${Icon('package')}${text} ${extra}<span style="float:right;font-weight:500">송장 1개로 함께 발송</span>`;
const KIM2 = { ...KIM, no: '20261111-000131', at: '11-11 13:05', opt: O1, pay: '49,000원' };
const PARK2 = { ...PARK, no: '20261111-000129', at: '11-11 10:02', ch: '자사몰', opt: O2, qty: 1, pay: '93,000원' };
const PARK3 = { ...PARK, no: '20261111-000130', at: '11-11 10:40', ch: '자사몰', opt: O1, qty: 1, pay: '49,000원' };

const tieRows = (applied) => [
    { group: tieHead('합포장 가능 2건 · 김민지 · 서울 마포구 월드컵북로 ***') },
    readyRow(KIM, Courier(), Invoice('581233441201'), { tied: true }),
    readyRow(KIM2, Courier(), applied ? Invoice('581233441201') : Invoice(), { tied: true }),
    { group: tieHead('합포장 가능 3건 · 박서준 · 경기 성남시 분당구 판교역로 ***', Badge('배송 요청 사항이 서로 다름', 'warn')) },
    readyRow(PARK, Courier(), Invoice(), { tied: true }),
    readyRow(PARK2, Courier(), Invoice(), { tied: true }),
    readyRow(PARK3, Courier(), Invoice(), { tied: true }),
    { group: '묶음 없는 주문' },
    readyRow(LEE, Courier(), Invoice()),
];

const tiePage = (applied) => Page(T_READY,
    SearchBar(),
    ListHead({ total: 200, left: [Toggle('묶음 보기', { on: true }), Text('합포장 가능 묶음 <b>2</b>개 · 주문 5건', { sm: true, mute: true })], right: [Btn(applied ? '입력한 2건 발송 처리' : '입력한 0건 발송 처리', { kind: 'primary', size: 'sm', disabled: !applied }), PerPage(50)] }),
    Table({ check: true, cols: READY_COLS, rows: tieRows(applied) }),
    Pager({ page: 1, last: 4, per: 50 }),
);

const state5 = StateBlock({ idx: 5, title: '합포장 묶음 표시', note: '수령인 이름·휴대폰·주소가 같은 미발송 주문을 묶음 선과 합포장 가능 n건 표시로 알려 줍니다. 기본은 표시만 하고, 묶음 보기를 켜면 묶음끼리 모아 정렬합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '같은 고객이 오전·오후에 따로 주문하거나 자사몰과 스마트스토어에서 한 번씩 주문하는 일이 있습니다. 따로 보내면 택배비가 두 번 나가고, 묶다가 한 건을 빠뜨리기도 합니다. 묶음의 한 줄에 송장을 넣으면 같은 묶음에도 적용할지 물어보고, 송장이 안 들어간 품목은 배송준비에 그대로 남아 눈에 보입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '채널이 다른 주문도 묶을 수 있지만 발송 전송은 채널마다 따로 갑니다(스마트스토어 주문은 같은 송장번호로 네이버에 전송). 배송 요청 사항이 서로 다르면 묶음 머리줄에 표시합니다. 묶음 기준(이름·휴대폰·주소)은 바꿀 수 없습니다.'),
    Canvas({ label: 'A-12 · 배송준비 탭 · 묶음 보기 켬 · 묶음 2개 + 묶음 없는 주문' }, tiePage(false)),
    Canvas({ label: 'A-12 · 묶음의 한 줄에 송장 입력 → 같은 묶음에도 적용할지 묻는 팝업' }, Overlay({ bg: tiePage(false), h: 420 },
        Confirm({ w: 420, title: '같은 묶음에도 적용할까요?', desc: '김민지 님 묶음의 다른 주문 1건(20261111-000131)에<br>CJ대한통운 581233441201 을 함께 넣습니다.', foot: [Btn('이 주문에만'), Btn('묶음 전체에 적용', 'primary')] }))),
    Canvas({ label: 'A-12 · 묶음 전체에 적용한 뒤 — 두 줄에 같은 송장' }, tiePage(true)),
);

const N08 = (reason, date) => Box({ flat: true, title: '고객 안내 문구 미리보기', sub: '알림톡 · 실패 시 문자 · 자사몰 주문만(스마트스토어는 네이버가 안내)' },
    Text(`[이너에라] 발송이 늦어져 죄송합니다.<br>주문번호 20261109-000125<br>사유: ${reason}<br>발송 예정일: ${date}<br>기다리기 어려우시면 취소하실 수 있습니다.`, { sm: true }),
);

const REASONS = ['주문 폭주', '재고 부족(입고 예정)', '제작/준비 기간', '택배사 사정', '기타(직접 입력)'];
const delayTarget = { k: '대상 주문', v: Text('선택한 <b>3건</b> (자사몰 2건 · 스마트스토어 1건)') };

const state6 = StateBlock({ idx: 6, title: '발송 지연 처리 팝업', note: '발송 기한 안에 못 보낼 주문에 사유와 예정일을 넣으면 고객에게 안내가 갑니다. 처리한 주문에는 발송 지연 안내됨 표시와 예정일이 붙습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '늦는다는 사실보다 말없이 늦는 것이 문의와 취소를 만듭니다. 사유와 예정일을 넣는 순간 고객에게 안내가 가고, 고객이 기다릴지 취소할지 스스로 정하게 합니다. 여러 건을 체크해 한 번에 처리합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '발송 지연 안내는 한 주문에 한 번이 원칙입니다. 이미 안내한 주문이 섞여 있으면 경고를 띄우고, 그래도 진행할 수는 있습니다. 스마트스토어 주문은 네이버로 발송지연을 전송하며, 전송이 지원되지 않으면 네이버 판매자센터에서 처리하라고 안내합니다(지원 여부 개발 확인 필요).'),
    Canvas({ label: 'A-12 · 3건 선택 → 발송 지연 처리 버튼 → 팝업 처음 모습 (사유 미선택 · 예정일 빈칸)' }, Overlay({ bg: Page(T_NEW, NewList([0, 1, 2])), h: 520 },
        Modal({ title: '발송 지연 처리', w: 620, foot: [Btn('취소'), Btn('3건 지연 처리하고 안내 보내기', { kind: 'primary', disabled: true })] },
            FormTable([
                delayTarget,
                { k: '지연 사유', required: true, v: Select({ placeholder: '사유를 고르세요', w: 280 }) },
                { k: '발송 예정일', required: true, v: Input({ placeholder: '날짜 고르기', icon: 'calendar', w: 200 }), help: '오늘 이후 날짜만 고를 수 있습니다.' },
                { k: '고객 안내', v: Check('고객에게 발송 지연 안내 보내기', { on: true }) },
            ]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '지연 사유 고르는 중 (목록 열림)', right: '팝업만', pad: 20 },
            Modal({ title: '발송 지연 처리', w: 620, foot: [Btn('취소'), Btn('3건 지연 처리하고 안내 보내기', { kind: 'primary', disabled: true })] },
                FormTable([
                    delayTarget,
                    { k: '지연 사유', required: true, v: Select({ placeholder: '사유를 고르세요', w: 280, open: true, options: REASONS }) },
                    { k: '발송 예정일', required: true, v: Input({ placeholder: '날짜 고르기', icon: 'calendar', w: 200 }) },
                ]),
            )),
        Canvas({ size: 'auto', label: '입력 완료 · 고객 안내 문구 미리보기', right: '팝업만', pad: 20 },
            Modal({ title: '발송 지연 처리', w: 620, foot: [Btn('취소'), Btn('3건 지연 처리하고 안내 보내기', 'primary')] },
                FormTable([
                    delayTarget,
                    { k: '지연 사유', required: true, v: Select({ value: '재고 부족(입고 예정)', w: 280 }) },
                    { k: '발송 예정일', required: true, v: Input({ value: '2026-11-16 (월)', icon: 'calendar', w: 200 }) },
                    { k: '고객 안내', v: Check('고객에게 발송 지연 안내 보내기', { on: true }) },
                ]),
                Note('스마트스토어 주문 1건은 네이버로 발송지연을 전송합니다.'),
                N08('재고 부족(입고 예정)', '11월 16일(월)'),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '기타(직접 입력) 사유 + 예정일 오류', right: '팝업만', pad: 20 },
            Modal({ title: '발송 지연 처리', w: 620, foot: [Btn('취소'), Btn('3건 지연 처리하고 안내 보내기', { kind: 'primary', disabled: true })] },
                FormTable([
                    delayTarget,
                    { k: '지연 사유', required: true, v: [Select({ value: '기타(직접 입력)', w: 280 }), Textarea({ value: '창고 이전으로 11월 12일까지 출고가 멈춥니다.', h: 64, count: '25 / 100' })], help: '직접 입력한 사유가 고객 안내에 그대로 나갑니다.' },
                    { k: '발송 예정일', required: true, v: Input({ value: '2026-11-10 (화)', icon: 'calendar', w: 200, error: true }), error: '오늘 이후 날짜를 골라 주세요.' },
                ]),
            )),
        Canvas({ size: 'auto', label: '이미 안내한 주문이 섞였을 때 (경고 뒤 진행 가능) · 네이버 전송이 안 될 때', right: '팝업만', pad: 20 },
            Modal({ title: '발송 지연 처리', w: 620, foot: [Btn('취소'), Btn('3건 지연 처리하고 안내 보내기', 'primary')] },
                Note('이미 안내한 주문입니다: 20261109-000125 (11-10 안내, 예정일 11-12). 그대로 진행하면 고객에게 안내가 한 번 더 갑니다.', { warn: true }),
                Note('스마트스토어 주문 1건(2026110945790022)은 네이버로 전송되지 않습니다. 네이버 판매자센터에서 발송지연을 처리해 주세요.', { warn: true }),
                FormTable([
                    delayTarget,
                    { k: '지연 사유', required: true, v: Select({ value: '재고 부족(입고 예정)', w: 280 }) },
                    { k: '발송 예정일', required: true, v: Input({ value: '2026-11-16 (월)', icon: 'calendar', w: 200 }) },
                ]),
            )),
    ),
    Canvas({ label: 'A-12 · 처리 뒤 목록 — 발송 지연 안내됨 표시와 예정일' }, Page(T_NEW,
        SearchBar(),
        ListHead({ total: 38, right: PerPage(50) }),
        Table({ check: true, cols: NEW_COLS, rows: [KANG, JUNG, CHOI].map((o) => newRow({ ...o, dueTag: `${Badge('발송 지연 안내됨', 'warn')}<small class="nw">예정 11-16(월)</small>` })).concat(ORDERS.slice(3).map(newRow)) }),
    )),
);

const KANG4 = { ...KANG, opt: O4, qty: 1 };
const partCols = [{ t: '상품 · 옵션', w: 280 }, { t: '수량', w: 60, align: 'center' }, { t: '재고', w: 150 }, { t: '상태', w: 100 }];

const state7 = StateBlock({ idx: 7, title: '부분 발송', note: '한 주문의 일부 품목만 체크해 발송 처리합니다. 보낸 품목은 배송중, 남은 품목은 배송준비에 남고 주문에 부분 발송 표시가 붙습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상태·송장은 주문이 아니라 품목 주문(주문 안의 한 줄)마다 따로 움직입니다. 4박스 구성이 품절이고 1박스 구성만 있을 때, 있는 것부터 보내고 고객에게 나머지는 따로 간다고 알립니다. 한 품목의 수량을 쪼개 보내지는 않습니다.'),
    Canvas({ label: 'A-12 · 배송준비 탭 · 품목이 2줄인 주문에서 한 줄만 체크하고 송장 입력' }, Page(T_READY,
        SearchBar('주문번호 20261109-000125'),
        BulkBar({ count: 1, sub: '주문 20261109-000125 의 2개 품목 중 1개' }, Btn('선택한 1건 발송 처리', 'primary'), Btn('발송 지연 처리', 'line')),
        Table({ check: true, checked: [0], cols: READY_COLS, rows: [
            readyRow(KANG, Courier(), Invoice('581233441240')),
            readyRow(KANG4, Courier(), `${Invoice()}<small>재고 0개 · 11-16 입고 예정</small>`),
        ] }),
    )),
    Canvas({ label: 'A-12 · 발송 처리 버튼 → 부분 발송 확인 팝업' }, Overlay({ bg: Page(T_READY, SearchBar('주문번호 20261109-000125')), h: 600 },
        Modal({ title: '부분 발송 · 주문 20261109-000125', w: 700, foot: [Btn('취소'), Btn('1개 품목만 발송 처리', 'primary')] },
            Note('이 주문의 품목 2개 중 1개만 발송합니다. 남은 품목은 배송준비에 남습니다.', { warn: true }),
            Table({ cols: partCols, rows: [
                [`${P}<small>구성: ${O1}</small>`, 3, '재고 충분', Badge('이번에 발송', 'solid')],
                { dim: true, c: [`${P}<small>구성: ${O4}</small>`, 1, '재고 0개 · 11-16 입고 예정', Badge('배송준비에 남음', 'fill')] },
            ] }),
            KV([['수령인', '강지호 · 010-****-4468'], ['송장', 'CJ대한통운 581233441240']]),
            '<div style="height:14px"></div>',
            Box({ flat: true, title: '고객 안내 문구 미리보기', sub: '알림톡 · 실패 시 문자' },
                Text('[이너에라] 상품이 발송되었습니다.<br>CJ대한통운 581233441240<br>나머지 상품은 따로 발송됩니다.', { sm: true })),
        ))),
    Canvas({ label: 'A-12 · 부분 발송 뒤 목록 — 한 주문이 품목별로 다른 상태' }, Page(T_READY,
        SearchBar('주문번호 20261109-000125'),
        ListHead({ total: 2, right: PerPage(50) }),
        Table({ check: true, cols: READY_COLS, rows: [
            { group: `주문 20261109-000125 · 강지호 · ${Badge('부분 발송', 'bold')} 품목 2개 중 1개 발송` },
            readyRow(KANG, 'CJ대한통운', '<u>581233441240</u>', { status: '배송중', nocheck: true, dim: true }),
            readyRow(KANG4, Courier(), Invoice()),
        ] }),
    )),
);

const toastBg = Page(T_READY, SearchBar(), ListHead({ total: 2, right: PerPage(50) }), Table({ check: true, cols: READY_COLS, rows: [readyRow(LEE, Courier(), Invoice()), readyRow(KIM, Courier(), Invoice())] }));

const state8 = StateBlock({ idx: 8, title: '처리 완료 토스트', note: '처리가 끝나면 화면 위쪽 가운데에 잠깐 떴다 사라지는 안내. 처리한 주문은 목록에서 빠지고 탭 숫자가 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '수백 건을 처리한 뒤 정말 됐는지 확인하려고 다시 검색하지 않게, 몇 건이 처리됐고 고객 안내가 나갔는지를 한 줄로 알려 줍니다. 일부만 성공했을 때는 사라지지 않는 요약으로 남겨 실패한 건을 바로 열 수 있게 합니다.'),
    Canvas({ label: 'A-12 · 발송 처리 완료 (3초 뒤 사라짐)' }, Overlay({ bg: toastBg, dim: false, align: 'top', h: 420 },
        Toast('발송 처리 198건 완료 · 고객 안내 발송됨', { action: '배송 현황 보기' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '발주확인 완료', right: '토스트만', pad: 20 }, Toast('발주확인 3건 완료', { action: '되돌리기 (10초)' })),
        Canvas({ size: 'auto', label: '발송 지연 처리 완료', right: '토스트만', pad: 20 }, Toast('발송 지연 처리 3건 완료 · 고객 안내 발송됨')),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '부분 발송 완료', right: '토스트만', pad: 20 }, Toast('발송 처리 1건 완료 · 주문 20261109-000125 의 남은 품목 1개는 배송준비에 남았습니다.')),
        Canvas({ size: 'auto', label: '실패 포함 요약 (닫기 전까지 남음)', right: '토스트만', pad: 20 }, Toast('발송 처리 5건 중 4건 완료 · 스마트스토어 1건은 네이버 전송에 실패했습니다.', { kind: 'error', action: '실패한 주문 보기' })),
    ),
);

const HOLD_COLS = [{ t: '주문번호 · 결제 일시', w: 150 }, { t: '채널', w: 100 }, '상품 · 옵션', { t: '수량', w: 48, align: 'center' }, { t: '수령인', w: 100 }, { t: '취소 요청', w: 190 }, { t: '표시', w: 150 }, { t: '처리', w: 130 }];
const HOLD_A = { ...LEE, no: '20261110-000119', at: '11-10 14:22' };
const HOLD_B = { no: '2026111045790031', at: '11-10 16:05', ch: '스마트스토어', opt: O1, qty: 1, name: '윤서연', tel: '010-****-3307' };
const holdBadge = Badge('출고 보류 · 취소 요청 중', 'dot');
const holdRow = (o, when, why) => ({ c: [noCell(o), ChannelBadge(o.ch), itemCell(o), o.qty, toCell(o), `${when}<small>${why}</small>`, holdBadge, Btn('취소 관리로 이동', { size: 'sm', iconRight: 'angle-right-min' })] });

const state9 = StateBlock({ idx: 9, title: '출고 보류(취소 요청 중) 탭', note: '배송준비 상태에서 고객이 취소를 요청한 품목이 모이는 탭. 승인·거부가 끝날 때까지 포장·발송 대상에서 빠집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '취소 요청과 출고 화면이 따로 놀면 취소 요청이 들어온 주문을 그대로 발송하는 사고가 납니다. 그래서 취소 요청이 걸린 품목은 출고 보류로 옮기고, 체크박스·엑셀 내려받기·송장 일괄 등록 대상에서 자동으로 뺍니다. 여기서는 처리하지 않고 취소 관리(A-15)로 보내 승인·거부를 하게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '스마트스토어에서 들어온 취소 요청도 10분마다 수집되어 같은 탭에 모입니다. 취소를 거부하면 품목은 배송준비로 돌아오고 출고 보류가 풀립니다. 승인하면 취소완료가 되어 이 화면에서 사라집니다.'),
    Canvas({ label: 'A-12 · 출고 보류 탭 · 체크박스 없음 · 취소 관리로 이동 버튼' }, Page(T_HOLD,
        Note('출고 보류 2건은 엑셀 내려받기와 송장 등록에서 빠져 있습니다. 취소 관리에서 승인하거나 거부하면 이 목록에서 사라집니다.', { warn: true }),
        ListHead({ total: 2, left: Chips(['전체 2', '자사몰 1', '스마트스토어 1'], '전체 2'), right: Btn('취소 관리에서 2건 처리하기', { kind: 'primary', size: 'sm', iconRight: 'angle-right-min' }) }),
        Table({ cols: HOLD_COLS, rows: [
            holdRow(HOLD_A, '11-11 08:10 · 2시간 전', '사유: 단순 변심'),
            holdRow(HOLD_B, '11-11 09:50 · 20분 전', '사유: 다른 구성으로 다시 주문'),
        ] }),
    )),
    Canvas({ label: 'A-12 · 배송준비 탭 — 합포장 묶음 안에 출고 보류 품목이 있을 때 (체크 불가 · 입력칸 잠김)' }, Page(T_READY,
        SearchBar(),
        ListHead({ total: 200, left: [Toggle('묶음 보기', { on: true }), Text(`${Icon('info-o')} 출고 보류 2건은 이 목록의 발송 대상에서 빠졌습니다. <u>출고 보류 탭 보기</u>`, { sm: true })], right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: READY_COLS, rows: [
            { group: tieHead('합포장 가능 2건 · 이하은 · 부산 해운대구 센텀중앙로 ***', Badge('1건 출고 보류', 'dot')) },
            readyRow(LEE, Courier(), Invoice(), { tied: true }),
            readyRow(HOLD_A, Select({ value: 'CJ대한통운', w: 116, disabled: true }), `${Input({ placeholder: '입력할 수 없음', w: 140, disabled: true })}<small><u>취소 관리로 이동</u></small>`, { tied: true, dim: true, nocheck: true, badge: Badge('출고 보류', 'dot') }),
            { group: '묶음 없는 주문' },
            readyRow(KIM, Courier(), Invoice()),
        ] }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '송장 엑셀에 출고 보류 품목이 들어 있을 때 — 검증 결과 행 사유', right: '팝업만', pad: 20 },
            Modal({ title: '송장 엑셀 일괄 등록', w: 720, foot: [Btn('오류 행만 내려받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('성공 199건 발송 처리', 'primary')] },
                Stepper(STEPS, 2),
                ExcelResult({ total: 200, ok: 199, fail: 1, rows: [{ row: 88, key: '2026111045790031', value: '581233441207', reason: HOLD_REASON }], note: '양식을 내려받은 뒤에 취소 요청이 들어온 주문입니다. 이 행은 발송 처리되지 않습니다.' }),
            )),
        Canvas({ size: 'auto', label: '출고 보류 탭 · 0건', right: '본문만', pad: 20 }, `<div style="width:420px">${Empty({ icon: 'check-circle-o', title: '처리할 주문이 없습니다', desc: '취소 요청이 걸린 배송준비 품목이 없습니다.' })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '취소 관리에서 거부한 뒤 돌아왔을 때', right: '토스트만', pad: 20 }, Toast('취소 요청 거부 1건 · 주문 20261110-000119 가 배송준비로 돌아왔습니다.', { action: '배송준비 탭 보기' })),
        Canvas({ size: 'auto', label: '취소 관리에서 승인한 뒤', right: '토스트만', pad: 20 }, Toast('취소 승인 1건 · 주문 2026111045790031 은 취소완료되어 출고 대상에서 빠졌습니다.')),
    ),
);

export default function A12() {
    return [state1, state2, state3, state4, state5, state6, state7, state8, state9].join('');
}
