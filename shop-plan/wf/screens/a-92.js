import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle, Tabs,
    FormTable, ListHead, Table, Overlay, Modal, Confirm, Toast, Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Grid, Empty, SHOP,
} from '../lib/blocks.js';

const TABS = ['배송비 템플릿', '제주·도서산간', '택배사', '출고지·반품지', '반품·교환 배송비'];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-92', desc: '배송비 규칙과 택배사, 물건이 나가고 돌아오는 주소를 정합니다.', ...o }, Tabs(TABS, tab), body);
const won = (v, w = 130, o = {}) => Input({ value: v, suffix: '원', w, ...o });
const acts = `${Btn('수정', { size: 'sm' })} ${Btn('복사', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`;

const T_COLS = ['템플릿 이름', { t: '유형', w: 110 }, '배송비 규칙', { t: '묶음 계산', w: 110 }, { t: '연결된 상품', w: 96, align: 'right' }, { t: '', w: 176 }];
const T_ROWS = [
    [`<u>기본 배송비</u> ${Badge('기본', 'bold')}`, Badge('조건부 무료', 'line'), '3,000원 · 30,000원 이상 구매 시 무료', '묶음 가능', '<u>2개</u>', acts],
    ['<u>무료배송</u>', Badge('무료', 'line'), '0원', '묶음 가능', '<u>1개</u>', acts],
    ['<u>선물 세트(부피 큼)</u>', Badge('고정', 'line'), '주문마다 4,000원', '따로 계산', '<u>1개</u>', acts],
    { dim: true, c: ['<u>대량 구매</u>', Badge('수량별', 'line'), '1 ~ 10개 3,000원 · 11 ~ 30개 6,000원 · 31개부터 10개마다 3,000원 추가', '따로 계산', '0개', acts] },
];

const TYPES = ['무료', '고정', '조건부 무료', '수량별'];
const baseRows = (name, type, o = {}) => [
    { k: '템플릿 이름', required: true, v: Input({ value: name, placeholder: '예: 기본 배송비', w: 300, error: o.nameErr }), help: '상품을 등록할 때 이 이름으로 고릅니다. 고객에게는 안 보입니다.', error: o.nameErr ? '템플릿 이름을 넣어 주세요.' : undefined },
    { k: '배송비 유형', required: true, v: RadioGroup(TYPES, type) },
];
const tailRows = (bundle = '묶음 가능') => [
    { k: '묶음 계산', v: RadioGroup(['묶음 가능', '따로 계산'], bundle), help: '묶음 가능 = 같은 템플릿 상품끼리 한 번만 부과(조건 금액은 합쳐서 계산). 따로 계산 = 이 템플릿 상품은 다른 상품과 별도로 배송비를 받습니다.' },
    { k: '제주·도서산간', v: Check('제주·도서산간 추가 배송비 받기 (금액은 제주·도서산간 탭)', { on: true }) },
    { k: '기본 템플릿', v: Check('새 상품을 등록할 때 처음 골라져 있는 템플릿으로 쓰기') },
];
const example = (lines) => Box({ flat: true, title: '고객 화면 계산 예시', sub: '입력한 값으로 자동 계산 · 금액은 예시' }, Table({ dense: true, cols: ['장바구니', { t: '상품 금액', w: 110, align: 'right' }, { t: '배송비', w: 100, align: 'right' }, '고객에게 보이는 안내'], rows: lines }));

const tModal = (title, ...body) => Modal({ title, w: 760, foot: [Btn('취소'), Btn('저장', 'primary')] }, body);

const mFree = tModal('배송비 템플릿 등록', FormTable([...baseRows('무료배송', '무료'), { k: '배송비', v: Text('0원 — 입력칸 없음. 상품 카드에 무료배송 배지가 붙습니다.', { sm: true }) }, ...tailRows()]));
const mFixed = tModal('배송비 템플릿 등록', FormTable([...baseRows('선물 세트(부피 큼)', '고정'), { k: '배송비', required: true, v: [won('4,000'), RadioGroup(['주문마다 한 번', '수량마다 (개당)'], '주문마다 한 번')], help: '수량마다를 고르면 2개 주문 시 8,000원입니다.' }, ...tailRows('따로 계산')]));
const mCond = (o = {}) => tModal(o.edit ? '배송비 템플릿 수정' : '배송비 템플릿 등록',
    FormTable([...baseRows(o.nameErr ? '' : '기본 배송비', '조건부 무료', o), { k: '기본 배송비', required: true, v: won('3,000') }, { k: '무료 조건', required: true, v: [won(o.condErr ? '2,000' : '30,000', 130, { error: o.condErr }), Text('이상 구매 시 무료', { sm: true }), Select({ value: '할인·쿠폰 적용 뒤 금액 기준', w: 230 })], help: '쿠폰을 써서 기준 아래로 내려가면 배송비가 붙습니다. 적용 전 금액 기준으로 바꿀 수 있습니다.', error: o.condErr ? '무료 조건 금액이 기본 배송비(3,000원)보다 작습니다. 금액을 다시 확인해 주세요.' : undefined }, { k: '남은 금액 안내', v: Check('장바구니에 무료배송까지 남은 금액 보여 주기', { on: true }) }, ...tailRows()]),
    example([['1박스(14일분) × 1', '49,000원', '0원', '무료배송'], ['체험 3포 × 2', '18,000원', '3,000원', '12,000원 더 담으면 무료배송']]),
);
const mQty = tModal('배송비 템플릿 등록',
    FormTable([...baseRows('대량 구매', '수량별'), { k: '수량 구간', required: true, v: Table({ dense: true, cols: [{ t: '수량', w: 260 }, { t: '배송비', w: 150 }, { t: '', w: 50 }], rows: [
        [`${Input({ value: '1', w: 70 })} ~ ${Input({ value: '10', w: 70 })} 개`, won('3,000', 120), Icon('close-min')],
        [`${Input({ value: '11', w: 70 })} ~ ${Input({ value: '30', w: 70 })} 개`, won('6,000', 120), Icon('close-min')],
        [`${Input({ value: '31', w: 70 })} 개부터 ${Input({ value: '10', w: 60 })} 개마다`, `${won('3,000', 120)} 추가`, Icon('close-min')],
    ] }), help: '구간이 겹치거나 비면 저장할 수 없습니다. 상자 하나에 들어가는 개수에 맞춰 나눕니다.' }, { k: '', v: Btn('구간 추가', { size: 'sm', icon: 'plus' }) }, ...tailRows('따로 계산')]),
    example([['1박스(14일분) × 12', '588,000원', '6,000원', '배송비 6,000원 (11 ~ 30개)'], ['1박스(14일분) × 45', '2,205,000원', '12,000원', '배송비 12,000원 (31개부터 10개마다 3,000원)']]),
);

const List = (rows = T_ROWS) => [ListHead({ total: rows.length, right: [Text('상품마다 템플릿 하나를 연결합니다 (상품 등록 > 배송)', { sm: true, mute: true })] }), Table({ cols: T_COLS, rows })];
const TAct = { actions: [Btn('배송비 템플릿 등록', { kind: 'primary', icon: 'plus' })] };

const state1 = StateBlock({ idx: 1, title: '배송비 템플릿 목록·등록(무료·고정·조건부 무료·수량별)', note: '설정 > 배송의 첫 탭. 배송비 규칙을 이름 붙여 만들어 두고 상품에 연결합니다. 유형 4가지의 입력칸을 모두 그렸습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '배송비를 상품마다 숫자로 넣으면 택배비가 오를 때 상품 수백 개를 다 고쳐야 합니다. 규칙을 템플릿으로 만들고 상품은 템플릿만 가리키게 하면 템플릿 하나만 고쳐도 연결된 상품이 전부 바뀝니다. 스마트스토어의 배송비 묶음과 같은 방식이라 실무자가 익숙합니다.'),
    Anno({ warn: true, title: '유형별 입력칸 분기 · 초기값' }, '무료 = 금액 칸 없음 / 고정 = 금액 + 주문마다·수량마다 / 조건부 무료 = 기본 배송비 + n원 이상 무료 + 금액 기준 / 수량별 = 수량 구간 표. 설치 직후에는 기본 배송비(조건부 무료 3,000원 · 30,000원 이상 무료) 하나가 기본 템플릿으로 들어 있습니다. 상품이 연결된 템플릿은 지울 수 없고 다른 템플릿으로 옮긴 뒤 지웁니다.'),
    Canvas({ label: 'A-92 · 배송비 템플릿 탭 · 목록' }, Page('배송비 템플릿', TAct, List(), Note('금액은 예시 값입니다. 장바구니에 템플릿이 다른 상품이 섞이면 템플릿마다 계산해 더합니다(묶음 가능 템플릿끼리는 한 번만).'))),
    Canvas({ label: 'A-92 · 배송비 템플릿 등록 버튼 → 팝업 · 유형 = 조건부 무료 (n원 이상 무료)' }, Overlay({ bg: Page('배송비 템플릿', TAct, List()), h: 900 }, mCond())),
    CanvasRow(
        Canvas({ size: 'auto', label: '유형 = 무료 (금액 칸이 사라짐)', right: '팝업만', pad: 20 }, mFree),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '유형 = 고정', right: '팝업만', pad: 20 }, mFixed),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '유형 = 수량별 (수량 구간 표)', right: '팝업만', pad: 20 }, mQty),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 · 이름 비움 + 무료 조건이 배송비보다 작음', right: '팝업만', pad: 20 }, mCond({ nameErr: true, condErr: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '상품이 연결된 템플릿을 삭제할 때 (막힘)', right: '팝업만', pad: 20 }, Modal({ title: '이 템플릿은 바로 지울 수 없습니다', w: 520, foot: [Btn('취소'), Btn('옮기고 삭제', 'primary')] }, Text('기본 배송비 템플릿에 상품 <b>2개</b>가 연결돼 있습니다. 상품을 다른 템플릿으로 옮긴 뒤 지울 수 있습니다.', {}), FormTable([{ k: '옮길 템플릿', required: true, v: Select({ value: '무료배송 (무료)', w: 280 }) }]), Note('옮기는 즉시 그 상품들의 배송비가 바뀝니다. 이미 들어온 주문의 배송비는 그대로입니다.', { warn: true }))),
        Canvas({ size: 'auto', label: '수정 저장 → 연결된 상품에 바로 반영', right: '토스트만', pad: 20 }, Toast('기본 배송비 템플릿을 저장했습니다. 연결된 상품 2개에 바로 반영됐습니다.')),
    ),
    Canvas({ label: 'A-92 · 템플릿이 하나도 없을 때 (모두 지운 경우)' }, Page('배송비 템플릿', TAct, Empty({ icon: 'truck', title: '배송비 템플릿이 없습니다', desc: '템플릿이 없으면 상품을 판매중으로 바꿀 수 없습니다. 먼저 배송비 규칙을 하나 만들어 주세요.', action: Btn('배송비 템플릿 등록', { kind: 'primary', icon: 'plus' }) }))),
);

const Z_COLS = [{ t: '지역 이름', w: 190 }, { t: '우편번호 범위', w: 220 }, { t: '구분', w: 110 }, '추가 배송비', { t: '', w: 120 }];
const zact = `${Btn('수정', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`;
const Z_ROWS = [
    ['제주특별자치도 전역', '63000 ~ 63644', Badge('제주', 'line'), '제주 금액 적용 (3,000원)', zact],
    ['인천 옹진군 (백령 · 연평 · 덕적 등)', '23100 ~ 23136', Badge('도서산간', 'fill'), '도서산간 금액 적용 (5,000원)', zact],
    ['경북 울릉군', '40200 ~ 40240', Badge('도서산간', 'fill'), '도서산간 금액 적용 (5,000원)', zact],
    ['전남 신안군 (흑산 · 홍도 등)', '58800 ~ 58866', Badge('도서산간', 'fill'), '도서산간 금액 적용 (5,000원)', zact],
    ['경남 통영시 (욕지 · 한산 · 사량)', '53031 ~ 53033', Badge('도서산간', 'fill'), '따로 정한 금액 7,000원', zact],
];

const zoneModal = (o = {}) => Modal({ title: '우편번호 범위 추가', w: 580, foot: [Btn('취소'), Btn('추가', 'primary')] }, FormTable([
    { k: '지역 이름', required: true, v: Input({ value: '전남 완도군 (청산 · 보길 등)', w: 320 }) },
    { k: '우편번호 범위', required: true, v: [Input({ value: '59100', w: 110 }), '~', Input({ value: o.err ? '5916' : '59166', w: 110, error: o.err }), Text('한 곳이면 같은 번호를 두 번', { sm: true, mute: true })], error: o.err ? '우편번호는 숫자 5자리입니다.' : undefined },
    { k: '구분', v: RadioGroup(['제주', '도서산간'], '도서산간') },
    { k: '추가 배송비', v: [RadioGroup(['구분의 기본 금액', '따로 정하기'], '구분의 기본 금액'), Input({ placeholder: '금액', suffix: '원', w: 120, disabled: true })] },
]));

const state2 = StateBlock({ idx: 2, title: '제주·도서산간 추가', note: '제주·도서산간 탭. 추가 배송비 금액과, 어느 우편번호가 제주·도서산간인지를 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '택배사는 제주와 섬 지역에 추가 운임을 받습니다. 고객이 주소를 넣는 순간 우편번호로 판별해 주문서에 추가 배송비를 자동으로 더해야 나중에 따로 연락해 받는 일이 없습니다. 택배사마다 도서산간 범위가 조금씩 달라 표준 목록을 불러온 뒤 고칠 수 있게 합니다.'),
    Anno({ warn: true, title: '초기값' }, '설치 직후에는 표준 목록(제주 1개 범위 + 도서산간 주요 범위)이 들어 있고 금액은 제주 3,000원 · 도서산간 5,000원입니다. 무료배송 템플릿 상품도 템플릿에서 추가 배송비 받기를 켜면 제주·도서산간 금액은 붙습니다.'),
    Canvas({ label: 'A-92 · 제주·도서산간 탭' }, Page('제주·도서산간', {},
        Box({ title: '추가 배송비 금액' }, FormTable([
            { k: '사용', v: Toggle('제주·도서산간 추가 배송비 받기', { on: true }) },
            { k: '제주', required: true, v: won('3,000') },
            { k: '도서산간', required: true, v: won('5,000') },
            { k: '부과 방식', v: RadioGroup(['주문마다 한 번', '배송비 템플릿마다 한 번'], '주문마다 한 번') },
            { k: '주소 확인해 보기', v: [Input({ value: '63309', placeholder: '우편번호 5자리', w: 140 }), Btn('확인', { size: 'sm' }), Badge('제주 · 추가 3,000원', 'check')], help: '고객 문의가 왔을 때 그 우편번호에 추가 배송비가 붙는지 바로 확인합니다.' },
        ]), BtnRow({ align: 'right' }, Btn('저장', 'primary'))),
        ListHead({ total: 5, left: [Input({ placeholder: '지역 이름·우편번호로 찾기', icon: 'search', w: 240 })], right: [Btn('표준 목록 다시 불러오기', { size: 'sm', icon: 'refresh' }), Btn('엑셀 올리기', { size: 'sm', icon: 'upload' }), Btn('엑셀 내려받기', { size: 'sm', icon: 'download' }), Btn('범위 추가', { size: 'sm', icon: 'plus', kind: 'primary' })] }),
        Table({ check: true, cols: Z_COLS, rows: Z_ROWS }),
        Note('표준 목록에는 범위가 120개쯤 됩니다. 화면에는 5개만 그렸습니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '범위 추가 버튼 → 팝업', right: '팝업만', pad: 20 }, zoneModal()),
        Canvas({ size: 'auto', label: '입력 오류 · 우편번호 자릿수', right: '팝업만', pad: 20 }, zoneModal({ err: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '엑셀 올리기 → 검증 결과 (택배사가 준 도서산간 목록)', right: '팝업만', pad: 20 }, Modal({ title: '우편번호 범위 엑셀 올리기', w: 700, foot: [Btn('파일 다시 올리기'), Btn('성공 86행 추가', 'primary')] }, ExcelResult({ total: 88, ok: 86, fail: 2, keyLabel: '지역 이름', rows: [{ row: 14, key: '충남 보령시 (외연도)', value: '3354', reason: '우편번호는 숫자 5자리입니다' }, { row: 61, key: '제주 추자면', value: '63000 ~ 63001', reason: '이미 등록된 범위(제주특별자치도 전역 63000 ~ 63644)와 겹칩니다' }], note: '양식: 지역 이름 · 시작 우편번호 · 끝 우편번호 · 구분(제주/도서산간) · 금액(비우면 기본 금액). 오류 행은 빼고 추가합니다.' }))),
        Canvas({ size: 'auto', label: '표준 목록 다시 불러오기', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '표준 목록으로 바꿀까요?', desc: '지금 목록 5개를 지우고 표준 목록(제주 1 · 도서산간 119)으로 바꿉니다. 직접 추가하거나 고친 범위는 사라집니다.', foot: [Btn('취소'), Btn('지금 목록에 더하기'), Btn('바꾸기', 'danger')] })),
    ),
);

const C_COLS = [{ t: '택배사', w: 170 }, { t: '계약 코드(고객번호)', w: 170 }, { t: '송장번호 형식', w: 130 }, { t: '배송 추적', w: 130 }, { t: '스마트스토어 전송 이름', w: 170 }, { t: '사용', w: 60 }, { t: '', w: 150 }];
const C_ROWS = [
    [`<b>CJ대한통운</b> ${Badge('기본', 'bold')}`, '30****21', '숫자 12자리', Badge('자동 추적 중', 'check'), 'CJ대한통운', Toggle('', { on: true }), `${Btn('수정', { size: 'sm' })}`],
    ['<b>우체국택배</b>', '없음', '숫자 13자리', Badge('자동 추적 중', 'check'), '우체국택배', Toggle('', { on: true }), `${Btn('수정', { size: 'sm' })} ${Btn('기본으로', { size: 'sm' })}`],
    { dim: true, c: ['<b>한진택배</b>', '없음', '숫자 10 · 12자리', Badge('꺼짐', 'mute'), '한진택배', Toggle('', { on: false }), `${Btn('수정', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`] },
];

const courierOpen = Select({ value: '', placeholder: '택배사 이름으로 찾기', w: 300, open: true, search: '로', options: [{ t: '롯데택배', on: true }, '로젠택배', { t: '일양로지스' }, { t: '경동택배', sub: '화물' }, { t: '직접 배송 · 퀵', sub: '송장번호 없이 발송처리' }] });
const courierModal = (open) => Modal({ title: '택배사 추가', w: 600, foot: [Btn('취소'), Btn('추가', 'primary')] }, FormTable([
    { k: '택배사', required: true, v: open ? courierOpen : Select({ value: '롯데택배', w: 300 }), help: open ? undefined : '송장번호 형식(숫자 12자리)과 배송 추적은 택배사를 고르면 자동으로 맞춰집니다.' },
    ...(open ? [] : [
        { k: '계약 코드(고객번호)', v: Input({ placeholder: '택배사와 계약할 때 받은 번호 (선택)', w: 300 }), help: '택배사 프로그램에 올릴 주문 엑셀에 함께 들어갑니다. 송장 자동 발급 연동(2단계)에 쓰입니다.' },
        { k: '보내는 분 표시', v: [Input({ value: '이너에라', w: 160 }), Input({ value: '070-****-1234', w: 160 })], help: '운송장의 보내는 분. 비우면 쇼핑몰 정보의 상호와 고객센터 전화를 씁니다.' },
        { k: '기본 택배사', v: Check('발송 처리 화면에서 처음 골라져 있는 택배사로 쓰기') },
    ]),
]));

const state3 = StateBlock({ idx: 3, title: '택배사', note: '택배사 탭. 쓰는 택배사와 계약 코드를 등록합니다. 여기 등록한 택배사만 발송 처리 화면과 송장 엑셀에서 고를 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '택배사를 미리 등록해 두면 발송 처리 때 기본 택배사가 골라져 있어 송장번호만 넣으면 되고, 송장 자릿수 검사와 배송 추적이 택배사에 맞게 자동으로 됩니다. 스마트스토어로 발송을 전송할 때는 네이버가 쓰는 택배사 이름으로 바꿔 보냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '기본 택배사는 하나만 지정됩니다. 그 택배사로 배송중인 주문이 있으면 삭제 대신 끄기만 할 수 있습니다(추적이 끊기지 않게). 택배가 아닌 직접 배송·퀵은 송장번호 없이 발송처리할 수 있게 따로 고릅니다.'),
    Canvas({ label: 'A-92 · 택배사 탭' }, Page('택배사', { actions: [Btn('택배사 추가', { kind: 'primary', icon: 'plus' })] }, Table({ cols: C_COLS, rows: C_ROWS }), Note('배송 추적은 택배 조회 서비스로 1시간마다 확인해 배송완료를 자동으로 반영합니다. 추적 실패 건은 주문 > 배송 현황에서 봅니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '택배사 추가 → 택배사 찾기 (검색형)', right: '팝업만', pad: 20 }, `<div style="min-height:400px">${courierModal(true)}</div>`),
        Canvas({ size: 'auto', label: '택배사를 고른 뒤', right: '팝업만', pad: 20 }, courierModal(false)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '기본으로 버튼', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '기본 택배사를 우체국택배로 바꿀까요?', desc: '발송 처리 화면과 송장 엑셀 양식에서 우체국택배가 처음 골라져 있게 됩니다. 이미 입력한 송장은 바뀌지 않습니다.', ok: '바꾸기' })),
        Canvas({ size: 'auto', label: '배송중 주문이 있는 택배사 삭제', right: '토스트만', pad: 20 }, Toast('CJ대한통운으로 배송중인 주문이 42건 있어 지울 수 없습니다. 사용 스위치를 끄면 새 발송에서만 빠집니다.', { kind: 'error' })),
    ),
);

const A_COLS = [{ t: '구분', w: 90 }, { t: '이름', w: 150 }, '주소', { t: '담당자 · 연락처', w: 170 }, { t: '기본', w: 70 }, { t: '', w: 120 }];
const A_ROWS = [
    [Badge('출고지', 'fill'), '본사 창고', `(22530) ${SHOP.addr}`, '이보림 · 070-****-1234', Badge('기본', 'bold'), zact],
    [Badge('반품지', 'line'), '본사 창고', `(22530) ${SHOP.addr}`, '이보림 · 070-****-1234', Badge('기본', 'bold'), zact],
    [Badge('출고지', 'fill'), '위탁 물류센터(김포)', '(10048) 경기도 김포시 고촌읍 아라육로 ***', '강지호 · 031-****-5678', '', zact],
];

const addrModal = (o = {}) => Modal({ title: '주소 등록', w: 640, foot: [Btn('취소'), Btn('등록', 'primary')] }, FormTable([
    { k: '구분', required: true, v: CheckGroup(['출고지', '반품지'], ['출고지', '반품지']), help: '둘 다 고르면 같은 주소로 두 줄이 만들어집니다.' },
    { k: '이름', required: true, v: Input({ value: '본사 창고', w: 240 }) },
    { k: '주소', required: true, v: [Input({ value: o.err ? '' : '22530', placeholder: '우편번호', w: 100, error: o.err }), Btn('주소 찾기', { size: 'sm', icon: 'search' }), Check('쇼핑몰 정보의 사업장 주소와 같음', { on: !o.err }), `<div style="width:100%;display:flex;gap:8px">${Input({ value: o.err ? '' : '인천광역시 제물포구 방축로83번길 23', placeholder: '도로명 주소', w: 300 })}${Input({ value: o.err ? '' : 'B동 3층 305호', placeholder: '상세 주소', w: 150 })}</div>`], error: o.err ? '주소 찾기로 주소를 넣어 주세요. 반품 회수 접수에 우편번호가 필요합니다.' : undefined },
    { k: '담당자 · 연락처', required: true, v: [Input({ value: '이보림', w: 140 }), Input({ value: '070-****-1234', w: 170 })], help: '택배 기사가 연락하는 번호입니다.' },
    { k: '기본으로 쓰기', v: Check('이 구분의 기본 주소로 쓰기', { on: true }) },
]));

const state4 = StateBlock({ idx: 4, title: '출고지·반품지', note: '출고지·반품지 탭. 물건이 나가는 주소와 반품·교환 물건이 돌아오는 주소를 등록합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '사업장 주소와 창고 주소가 다른 몰이 많고(위탁 물류), 반품은 다른 곳으로 받기도 합니다. 반품지 주소는 고객의 반품 신청 화면과 반품 안내 알림, 택배사 회수 접수에 그대로 쓰입니다. 여러 곳을 등록하고 구분마다 기본을 하나씩 정합니다.'),
    Anno({ warn: true, title: '초기값 · 빈 상태' }, '설치 직후에는 쇼핑몰 정보의 사업장 주소가 출고지·반품지 기본으로 들어 있습니다. 반품지가 하나도 없으면 고객이 반품 신청을 할 수 없으므로 마지막 반품지는 지울 수 없습니다.'),
    Canvas({ label: 'A-92 · 출고지·반품지 탭' }, Page('출고지·반품지', { actions: [Btn('주소 등록', { kind: 'primary', icon: 'plus' })] }, Table({ cols: A_COLS, rows: A_ROWS }), Note('상품마다 출고지가 다르면 상품 등록 > 배송에서 출고지를 고릅니다. 고르지 않은 상품은 기본 출고지를 씁니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '주소 등록 버튼 → 팝업', right: '팝업만', pad: 20 }, addrModal()),
        Canvas({ size: 'auto', label: '입력 오류 · 주소 비움', right: '팝업만', pad: 20 }, addrModal({ err: true })),
    ),
    Canvas({ size: 'auto', label: '하나 남은 반품지를 삭제하려 할 때', right: '토스트만', pad: 20 }, Toast('반품지는 하나 이상 있어야 합니다. 새 반품지를 먼저 등록한 뒤 지워 주세요.', { kind: 'error' })),
);

const retForm = (o = {}) => FormTable([
    { k: '반품 배송비 (편도)', required: true, v: won('3,000'), help: '고객 사정(단순 변심)으로 반품할 때 고객이 내는 회수 택배비.' },
    { k: '교환 배송비 (왕복)', required: true, v: won(o.err ? '2,000' : '6,000', 130, { error: o.err }), help: '회수 + 다시 보내기. 보통 편도의 2배입니다.', error: o.err ? '교환 배송비(왕복)가 반품 배송비(편도 3,000원)보다 작습니다. 금액을 확인해 주세요.' : undefined },
    { k: '무료배송으로 받은 주문', v: [Check('반품하면 처음 보낼 때 든 배송비도 함께 받기', { on: true }), won('3,000')], help: '조건부 무료·무료배송으로 나간 주문을 전부 반품하면 편도 3,000원 + 처음 배송비 3,000원 = 6,000원을 환불 금액에서 뺍니다.' },
    { k: '제주·도서산간', v: [Check('반품·교환에도 추가 배송비 받기', { on: true }), Text('제주 3,000원 · 도서산간 5,000원 (편도마다)', { sm: true, mute: true })] },
    { k: '누가 내는가', v: Table({ dense: true, cols: [{ t: '사유', w: 240 }, { t: '배송비 부담', w: 130 }, '처리'], rows: [
        ['단순 변심 · 주문 실수', '고객', '환불 금액에서 자동으로 빼고 환불'],
        ['상품 불량 · 파손 · 다른 상품이 옴', '판매자', '차감 없이 전액 환불 · 회수비는 판매자 부담'],
        ['표시·광고와 다름', '판매자', '차감 없이 전액 환불 (받은 날부터 3개월 · 안 날부터 30일 안)'],
    ] }), help: '사유는 고객이 반품 신청 때 고르고, 운영자가 검수하면서 바꿀 수 있습니다(고객 귀책 ↔ 판매자 귀책).' },
    { k: '받는 방법', v: RadioGroup(['환불 금액에서 빼기', '상자에 동봉', '계좌로 따로 입금'], '환불 금액에서 빼기'), help: '교환은 환불 금액이 없으므로 고객이 교환 신청 때 결제하거나 동봉합니다.' },
]);

const state5 = StateBlock({ idx: 5, title: '반품·교환 배송비', note: '반품·교환 배송비 탭. 반품·교환 때 고객이 내는 택배비와 누가 부담하는지를 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '반품 환불 금액은 결제 금액 − 반품 배송비로 계산되는데, 이 값이 정해져 있지 않으면 운영자가 건마다 계산기를 두드립니다. 여기서 정한 값으로 고객의 반품 신청 화면에 환불 예정 금액이 미리 나오고, 반품 관리의 환불 팝업에 차감 금액이 자동으로 채워집니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '상품 불량·오배송처럼 판매자 잘못이면 배송비를 고객에게 받을 수 없습니다(전자상거래법). 사유에 따라 부담 주체가 자동으로 갈리고, 운영자는 검수 때 사유를 바꿔 차감을 빼거나 넣을 수 있습니다. 이 탭의 안내는 상품 상세의 배송/교환/반품 안내 탭에도 그대로 나옵니다.'),
    Canvas({ label: 'A-92 · 반품·교환 배송비 탭' }, Page('반품·교환 배송비', {}, retForm(),
        Box({ flat: true, title: '환불 계산 예시', sub: '입력한 값으로 자동 계산 · 금액은 예시' }, Table({ dense: true, cols: ['경우', { t: '결제 금액', w: 110, align: 'right' }, { t: '차감', w: 190, align: 'right' }, { t: '환불 금액', w: 110, align: 'right' }], rows: [
            ['2박스(28일분) 1개 · 무료배송으로 받음 · 단순 변심 전체 반품', '93,000원', '6,000원 (회수 3,000 + 처음 배송비 3,000)', '87,000원'],
            ['1박스(14일분) 2개 중 1개만 반품 · 단순 변심 (남은 금액 49,000원 = 무료 조건 유지)', '98,000원', '3,000원 (회수)', '46,000원'],
            ['1박스(14일분) 1개 · 상자 파손 (판매자 부담)', '49,000원', '0원', '49,000원'],
            ['제주 · 1박스(14일분) 1개 · 단순 변심', '52,000원', '9,000원 (회수 3,000 + 제주 3,000 + 처음 배송비 3,000)', '43,000원'],
        ] })),
        BtnRow({ align: 'right' }, Btn('취소'), Btn('저장', 'primary')),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 · 교환 배송비가 반품 배송비보다 작음', right: '부분', pad: 20 }, `<div style="width:760px">${FormTable([{ k: '교환 배송비 (왕복)', required: true, v: won('2,000', 130, { error: true }), error: '교환 배송비(왕복)가 반품 배송비(편도 3,000원)보다 작습니다. 금액을 확인해 주세요.' }])}</div>`),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('반품·교환 배송비를 저장했습니다. 지금부터 들어오는 반품·교환 신청에 적용됩니다.')),
    ),
);

export default function A92() {
    return [state1, state2, state3, state4, state5].join('');
}
