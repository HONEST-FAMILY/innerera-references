import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast,
    Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Thumb, Empty, SHOP,
} from '../lib/blocks.js';

const TAB_LIST = [{ t: '전체', n: 6 }, { t: '판매중', n: 4 }, { t: '품절', n: 1 }, { t: '판매중지', n: 1 }, { t: '임시 저장', n: 1 }];

const PRODUCTS = [
    { name: SHOP.product, code: 'IE-LG-PG14', cat: '건강식품 > 젤리스틱', price: '49,000원', sale: '45,000원 · 11-20 ~ 11-30 할인 예정', stock: '540', items: 3, state: '판매중', show: true, ch: ['자사몰', '스마트스토어'], ss: '연동됨', at: '11-10 17:42', by: '이보림' },
    { name: '이너에라 롱지비티 선물 세트 (2박스 + 쇼핑백)', code: 'IE-LG-GIFT', cat: '건강식품 > 선물 세트', price: '95,000원', stock: '42', items: 1, state: '판매중', show: true, ch: ['자사몰', '스마트스토어'], ss: '전송 오류', at: '11-11 09:12', by: '정수아', low: true },
    { name: '이너에라 스틱 보관 케이스', code: 'IE-AC-CASE', cat: '소품', price: '9,000원', stock: '86', items: 2, state: '판매중', show: true, ch: ['자사몰'], at: '11-07 14:20', by: '이보림' },
    { name: '이너에라 롱지비티 체험 3포', code: 'IE-LG-TRY3', cat: '건강식품 > 젤리스틱', price: '9,900원', stock: '0', items: 1, state: '품절', show: true, ch: ['자사몰'], at: '11-09 08:03', by: '자동(재고 0)' },
    { name: '이너에라 쇼핑백 (소)', code: 'IE-AC-BAG', cat: '소품', price: '500원', stock: '400', items: 1, state: '판매중', show: false, ch: ['자사몰'], at: '10-30 11:15', by: '이보림' },
    { name: '이너에라 추석 한정 세트', code: 'IE-LG-CHU', cat: '기획전 > 추석', price: '169,000원', stock: '12', items: 1, state: '판매중지', show: false, ch: ['자사몰'], at: '10-05 18:00', by: '이보림' },
];

const saleBadge = (s) => Badge(s, { 판매중: 'solid', 품절: 'strike', 판매중지: 'mute', '임시 저장': 'dash' }[s]);
const COLS = [{ t: '이미지', w: 56 }, '상품명 · 관리코드', { t: '판매가', w: 110, align: 'right', sort: undefined }, { t: '재고 합', w: 96, align: 'right' }, { t: '판매상태', w: 84 }, { t: '전시', w: 76 }, { t: '채널', w: 126 }, { t: '수정일', w: 96, sort: 'desc' }, { t: '', w: 104 }];
const row = (p, o = {}) => ({
    ...o,
    c: [
        Thumb(44),
        `<u>${p.name}</u><small>${p.code} · ${p.cat}</small>`,
        `${o.price || p.price}${p.sale ? `<small>${p.sale}</small>` : ''}`,
        `${o.stock || p.stock}개${p.low ? ` ${Badge('품절 임박', 'warn')}` : ''}<small>품목 ${p.items}개</small>`,
        saleBadge(o.state || p.state),
        Badge(p.show ? '전시함' : '전시 안 함', p.show ? 'check' : 'mute'),
        `${p.ch.map((c) => ChannelBadge(c)).join(' ')}${p.ss ? `<small>${p.ss === '전송 오류' ? `<b>${Icon('error-o')} 전송 오류</b>` : p.ss}</small>` : ''}`,
        `${p.at}<small>${p.by}</small>`,
        `${Btn('수정', { size: 'sm' })} ${Btn('복사', { size: 'sm' })}`,
    ],
});

const HeadActions = [Btn('엑셀 일괄 등록·수정', { icon: 'file-upload-o' }), Btn('상품 등록', { kind: 'primary', icon: 'plus' })];
const Page = (tab, ...body) => AdminLayout({ active: 'a-20', actions: HeadActions }, Tabs(TAB_LIST, tab), body);

const FILTER_ROWS = (o = {}) => [
    { k: '검색어', v: [Select({ value: '상품명', w: 130 }), Input({ value: o.q || '', placeholder: '상품명 · 관리코드 · 상품번호 · 옵션 값 (여러 개는 쉼표나 줄바꿈)', icon: 'search', w: 460 })] },
    { k: '카테고리', v: o.catOpen ? Select({ value: '', placeholder: '카테고리 전체', w: 280, open: true, search: '건강', options: [{ t: '건강식품', sub: '상품 4개' }, { t: '건강식품 > 젤리스틱', sub: '상품 2개', on: true }, { t: '건강식품 > 이너뷰티', sub: '상품 1개' }, { t: '건강식품 > 선물 세트', sub: '상품 1개' }] }) : [Select({ value: o.cat || '', placeholder: '카테고리 전체', w: 280 }), Check('하위 카테고리 포함', { on: true })] },
    { k: '판매상태', v: CheckGroup(['판매중', '품절', '판매중지'], o.sale || ['판매중', '품절', '판매중지']) },
    { k: '전시 · 채널', v: [CheckGroup(['전시함', '전시 안 함'], ['전시함', '전시 안 함']), '<span style="color:var(--line)">|</span>', CheckGroup(['자사몰', '스마트스토어'], ['자사몰', '스마트스토어']), Select({ value: '스마트스토어 전송 상태 전체', w: 220 })] },
    { k: '재고', v: [CheckGroup(['품절 임박(안전 재고 이하)', '재고 0'], o.low ? ['품절 임박(안전 재고 이하)'] : []), Input({ placeholder: '최소', w: 90, suffix: '개' }), '<span>~</span>', Input({ placeholder: '최대', w: 90, suffix: '개' })] },
    { k: '판매가', v: [Input({ placeholder: '최소', w: 130, suffix: '원' }), '<span>~</span>', Input({ placeholder: '최대', w: 130, suffix: '원' })] },
    { k: '기간', v: [Select({ value: '수정일', w: 110 }), Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })] },
];

const ListBlock = (o = {}) => [
    o.checked && o.checked.length
        ? BulkBar({ count: o.checked.length, sub: `품목 ${o.items || 5}개` }, Btn('판매상태 변경', 'primary'), Btn('전시 변경', 'line'), Btn('가격 % 조정', 'line'), Btn('재고 변경', 'line'), Btn('카테고리 변경', 'line'), Btn('스마트스토어로 보내기', 'line'), Btn('삭제', 'line'))
        : ListHead({ total: o.total || 6, left: Text('재고 합 1,080개 · 품절 임박 1 · 스마트스토어 전송 오류 1', { sm: true, mute: true }), right: [Select({ value: '수정일 최신순', w: 140 }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
    Table({ check: true, checked: o.checked || [], cols: COLS, rows: (o.rows || PRODUCTS).map((p) => row(p)) }),
    Note('금액은 예시 값입니다(판매가 미확정). 재고 합은 품목 재고를 더한 값이며 품목별 재고는 상품 > 재고 관리에서 봅니다.'),
    Pager({ page: 1, last: 1, per: 50 }),
];

const state1 = StateBlock({ idx: 1, title: '검색·필터', note: '검색 조건을 펼친 모습. 조건은 접어 두어도 요약 한 줄로 보이고, 마지막으로 쓴 조건을 기억합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품이 1개인 몰도 1만 개인 몰도 같은 화면을 씁니다. 그래서 검색어는 상품명·관리코드·상품번호·옵션 값을 여러 개 한 번에 붙여 넣어 찾을 수 있고(엑셀에서 복사한 관리코드 30개), 카테고리는 검색형, 재고·판매가는 범위로 거릅니다. 대시보드 품절 임박 카드를 누르면 재고 조건이 미리 체크된 채 이 화면이 열립니다.'),
    Anno({ warn: true, title: '초기값 · 기능을 껐을 때' }, '초기값: 판매상태 전부 · 전시 전부 · 기간 없음(전체) · 수정일 최신순 · 50개씩. 스마트스토어 기능을 끈 몰은 채널 조건과 채널 칸, 스마트스토어로 보내기 버튼이 없습니다.'),
    Canvas({ label: 'A-20 · 검색 조건 펼침' }, Page('전체', Filters({ rows: FILTER_ROWS() }), ListBlock())),
    CanvasRow(
        Canvas({ size: 'auto', label: '카테고리 칸을 누름 → 검색형 목록', right: '조건만', pad: 20 }, `<div style="width:760px;min-height:260px">${Filters({ rows: FILTER_ROWS({ catOpen: true }).slice(1, 2), actions: ' ' })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '검색어 종류를 누름', right: '조건만', pad: 20 }, `<div style="width:220px;min-height:230px">${Select({ value: '상품명', w: 160, open: true, options: [{ t: '상품명', on: true }, '관리코드', '상품번호', '옵션 값', '검색어(태그)'] })}</div>`),
        Canvas({ size: 'auto', label: '조건 접힘 — 요약 한 줄', right: '조건만', pad: 20 }, `<div style="width:760px">${Filters({ open: false, summary: '카테고리 건강식품 > 젤리스틱(하위 포함) · 판매상태 판매중 · 재고 품절 임박' })}</div>`),
    ),
);

const state2 = StateBlock({ idx: 2, title: '목록(대표 이미지·이름·판매가·재고 합·판매상태·전시·채널)', note: '상품 한 개가 한 줄. 재고는 품목 재고의 합과 품목 수를 같이 보여 줍니다. 상품명을 누르면 상품 수정으로 갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '운영자가 목록에서 알고 싶은 것은 지금 팔리고 있나(판매상태·전시), 어디서 팔리나(채널·전송 상태), 얼마나 남았나(재고 합)입니다. 내부 번호 대신 대표 이미지와 상품명으로 찾고, 품절 임박·전송 오류는 줄 안에서 바로 눈에 띄게 표시합니다. 판매상태는 탭으로도 나눠 건수를 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '판매상태(판매중·품절·판매중지)와 전시(전시함·전시 안 함)는 서로 다른 값입니다. 전시 안 함 + 판매중이면 주소를 아는 사람만 살 수 있습니다. 품절은 재고 0으로 자동으로 바뀐 것인지 운영자가 바꾼 것인지 수정일 칸에 적습니다.'),
    Canvas({ label: 'A-20 · 전체 탭 · 선택 없음 (조건 접힘)' }, Page('전체', Filters({ open: false, summary: '조건 없음 · 전체 상품' }), ListBlock())),
    Canvas({ label: 'A-20 · 임시 저장 탭 — 필수 항목을 다 채우지 못한 상품' }, Page('임시 저장', Filters({ open: false, summary: '조건 없음' }),
        ListHead({ total: 1, right: PerPage(50) }),
        Table({ check: true, cols: [{ t: '이미지', w: 56 }, '상품명', { t: '아직 비어 있는 필수 항목', w: 320 }, { t: '저장일', w: 110 }, { t: '', w: 150 }], rows: [
            [Thumb(44), '<u>이너에라 롱지비티 레몬맛 젤리스틱 20 g × 14포</u><small>임시 저장 · 고객에게 보이지 않음</small>', '대표 이미지 · 상세설명 · 상품정보제공고시', '11-11 10:05<small>정수아</small>', `${Btn('이어서 등록', { size: 'sm', kind: 'primary' })} ${Btn('삭제', { size: 'sm' })}`],
        ] }),
    )),
    Canvas({ size: 'auto', label: '스마트스토어 기능을 끈 몰 — 채널 칸 없음', right: '표만', pad: 20 }, `<div style="width:900px">${Table({ check: true, cols: COLS.filter((c) => c.t !== '채널'), rows: PRODUCTS.slice(0, 2).map((p) => { const r = row(p); r.c.splice(6, 1); return r; }) })}</div>`),
);

const BulkBg = Page('전체', Filters({ open: false, summary: '조건 없음 · 전체 상품' }), ListBlock({ checked: [0, 1, 2] }));

const state3 = StateBlock({ idx: 3, title: '일괄 변경 바(판매상태·전시·가격·재고)', note: '체크하면 목록 위 줄이 일괄 변경 바로 바뀝니다. 버튼마다 무엇을 어떻게 바꿀지 묻는 작은 팝업이 뜨고, 바뀔 내용을 먼저 보여 준 뒤 적용합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '행사 시작 날 30개 상품 가격을 10% 내리고, 끝나면 되돌리고, 휴가 전에 전부 판매중지로 바꾸는 일을 상품 하나씩 열어서 하지 않게 합니다. 가격은 % 또는 원으로 올리고 내릴 수 있고, 적용 전에 상품별 바뀌기 전·후 가격을 표로 확인합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '스마트스토어에 연동된 상품은 바꾼 내용이 스마트스토어로도 전송됩니다(팝업에 건수 표시). 가격 일괄 조정은 판매가만 바꾸고 옵션 추가금은 그대로 둡니다. 재고 일괄 변경은 품목이 여러 개인 상품에는 모든 품목에 같은 값이 들어가므로 품목별로 다르게 넣으려면 재고 관리로 보냅니다.'),
    Canvas({ label: 'A-20 · 3개 선택 → 일괄 변경 바' }, BulkBg),
    CanvasRow(
        Canvas({ size: 'auto', label: '판매상태 변경 버튼 → 팝업', right: '팝업만', pad: 20 }, Modal({ title: '판매상태 변경 · 선택한 3개 상품', w: 460, foot: [Btn('취소'), Btn('3개 상품 바꾸기', 'primary')] },
            FormTable([
                { k: '바꿀 상태', required: true, v: [Radio('판매중'), Radio('품절', { on: true }), Radio('판매중지')] },
                { k: '품목', v: [Radio('상품의 모든 품목', { on: true }), Radio('상품 상태만 (품목은 그대로)')] },
            ]),
            Note('스마트스토어에 연동된 2개 상품은 스마트스토어에서도 품절로 바뀝니다.', { warn: true }),
        )),
        Canvas({ size: 'auto', label: '전시 변경 버튼 → 팝업', right: '팝업만', pad: 20 }, Modal({ title: '전시 변경 · 선택한 3개 상품', w: 420, foot: [Btn('취소'), Btn('3개 상품 바꾸기', 'primary')] },
            FormTable([{ k: '전시', required: true, v: [Radio('전시함'), Radio('전시 안 함', { on: true })] }]),
            Note('전시 안 함으로 바꾸면 목록·검색·메인 진열에서 빠집니다. 메인 진열 영역 2곳에 걸려 있는 상품 1개가 포함되어 있습니다.'),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '가격 % 조정 버튼 → 팝업 (바뀌기 전 · 후 미리 보기)', right: '팝업만', pad: 20 }, Modal({ title: '가격 조정 · 선택한 3개 상품', w: 640, foot: [Btn('취소'), Btn('3개 상품 가격 바꾸기', 'primary')] },
            FormTable([
                { k: '조정', required: true, v: [Input({ value: '10', w: 90 }), Select({ value: '%', w: 80 }), RadioGroup(['내리기', '올리기'], '내리기')] },
                { k: '원 단위', v: Select({ value: '100원 단위 버림', w: 170 }) },
                { k: '대상', v: RadioGroup(['판매가', '정가(소비자가)도 함께'], '판매가'), help: '옵션 추가금은 바뀌지 않습니다. 기간을 두고 깎으려면 가격을 바꾸지 말고 상품 수정의 할인 기간을 쓰세요.' },
            ]),
            '<div style="height:10px"></div>',
            Table({ dense: true, cols: ['상품명', { t: '지금', w: 100, align: 'right' }, { t: '바뀐 뒤', w: 100, align: 'right' }, { t: '차이', w: 90, align: 'right' }], rows: [
                [SHOP.productShort, '49,000원', '<b>44,100원</b>', '-4,900원'],
                ['롱지비티 선물 세트', '95,000원', '<b>85,500원</b>', '-9,500원'],
                ['스틱 보관 케이스', '9,000원', '<b>8,100원</b>', '-900원'],
            ] }),
            Note('스마트스토어에 연동된 2개 상품은 스마트스토어 판매가도 같은 비율로 바뀌어 전송됩니다. 금액은 예시 값입니다.', { warn: true }),
        )),
        Canvas({ size: 'auto', label: '조정 단위를 누름 · 0보다 작아지는 오류', right: '팝업 일부', pad: 20 }, `<div style="width:420px;min-height:200px">${FormTable([{ k: '조정', required: true, v: [Input({ value: '10,000', w: 100, error: true }), Select({ value: '원', w: 80, open: true, options: ['%', { t: '원', on: true }] })], error: '스틱 보관 케이스(9,000원)는 10,000원을 내리면 0원 아래가 됩니다. 금액을 줄이거나 그 상품을 빼 주세요.' }])}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '재고 변경 버튼 → 팝업', right: '팝업만', pad: 20 }, Modal({ title: '재고 변경 · 선택한 3개 상품(품목 6개)', w: 520, foot: [Btn('품목별로 넣기 (재고 관리로)'), Btn('취소'), Btn('6개 품목 바꾸기', 'primary')] },
            FormTable([
                { k: '방법', required: true, v: [Radio('더하기', { on: true }), Radio('빼기'), Radio('이 수량으로 맞추기')] },
                { k: '수량', required: true, v: Input({ value: '100', w: 120, suffix: '개' }) },
                { k: '사유', v: Select({ value: '입고', w: 180 }), help: '재고 변동 이력에 수동 조정 · 입고 · 이보림으로 남습니다.' },
            ]),
            Note('선택한 상품의 모든 품목에 같은 수량이 적용됩니다. 구성(1박스·2박스·4박스)마다 다르게 넣으려면 품목별로 넣기를 누르세요.', { warn: true }),
        )),
        Canvas({ size: 'auto', label: '삭제 버튼 → 주문 있는 상품이 섞임', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '3개 중 1개만 삭제할 수 있습니다', desc: '주문이 있는 상품 2개(롱지비티 석류맛 젤리스틱 · 롱지비티 선물 세트)는 삭제할 수 없어 판매중지 + 전시 안 함으로 바꿉니다.<br>스틱 보관 케이스 1개는 삭제됩니다. 삭제한 상품은 30일 동안 휴지통에서 되살릴 수 있습니다.', ok: '1개 삭제 · 2개 판매중지', danger: true })),
    ),
    Canvas({ label: 'A-20 · 일괄 변경 완료 안내' }, Overlay({ bg: BulkBg, dim: false, align: 'top', h: 300 }, Toast('3개 상품의 판매가를 10% 내렸습니다. 스마트스토어 2개 상품에도 전송했습니다.', { action: '되돌리기' }))),
);

const STEPS = ['양식 내려받기', '엑셀 올리기', '검증 결과', '반영'];

const state4 = StateBlock({ idx: 4, title: '엑셀 일괄 등록·수정', note: '양식 내려받기 → 채워서 올리기 → 검증 결과(성공 n · 오류 n, 행별 사유) → 반영. 새 상품 등록과 기존 상품 수정을 같은 팝업에서 고릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품을 수십 개 한꺼번에 올리거나 시즌마다 가격·재고를 통째로 고칠 때는 엑셀이 가장 빠릅니다. 수정용 양식은 지금 상품 내용이 채워진 채로 내려와 바꿀 칸만 고쳐 올립니다. 한 줄 = 품목 한 개이고, 같은 상품의 품목은 관리코드(또는 상품번호)로 묶입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '올리자마자 반영하지 않습니다. 검증해서 몇 행이 되고 몇 행이 왜 안 되는지 보여 준 뒤 성공한 행만 반영할지 정합니다. 이미지·상세설명은 엑셀로 넣지 못하므로 엑셀로 새로 등록한 상품은 임시 저장 상태로 들어가고, 이미지를 넣어야 판매를 시작할 수 있습니다. 규격: XLSX·XLS·CSV · 10MB · 한 번에 5,000행.'),
    Canvas({ label: 'A-20 · 엑셀 일괄 등록·수정 버튼 → 1단계' }, Overlay({ bg: Page('전체', Filters({ open: false, summary: '조건 없음' })), h: 780 },
        Modal({ title: '엑셀 일괄 등록·수정', w: 660, foot: [Btn('닫기'), Btn('검증하기', { kind: 'primary', disabled: true })] },
            Stepper(STEPS, 0),
            Box({ title: '1. 양식 내려받기' },
                FormTable([
                    { k: '무엇을 할까요', required: true, v: [Radio('새 상품 등록'), Radio('기존 상품 수정', { on: true })] },
                    { k: '수정할 항목', v: CheckGroup(['판매가·할인', '재고·안전 재고', '판매상태·전시', '상품명·카테고리', '옵션 추가금'], ['판매가·할인', '재고·안전 재고']), help: '고른 항목의 칸만 양식에 들어갑니다. 나머지는 건드리지 않습니다.' },
                    { k: '대상', v: [Radio('전체 상품 6개 (품목 9개)', { on: true }), Radio('목록에서 선택한 상품'), Radio('지금 검색 조건의 상품')] },
                ]),
                Flex({ mt: 12 }, Btn('양식 내려받기 (품목 9행)', { icon: 'file-download-o' }), Btn('작성 방법 보기', 'ghost')),
            ),
            Box({ title: '2. 엑셀 올리기' },
                Upload({ title: '엑셀 파일을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · XLS · CSV', '용량 10MB 이하, 한 번에 5,000행까지', '첫 줄(제목 줄)과 상품번호·품목번호 칸은 지우거나 바꾸지 마세요', '한 줄 = 품목 한 개 (옵션이 있는 상품은 품목 수만큼 줄)'] }),
            ),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '새 상품 등록을 고른 모습 — 양식 종류가 옵션 방식별로 나뉨', right: '팝업 일부', pad: 20 }, `<div style="width:620px">${Box({ title: '1. 양식 내려받기' }, FormTable([
            { k: '무엇을 할까요', required: true, v: [Radio('새 상품 등록', { on: true }), Radio('기존 상품 수정')] },
            { k: '양식', v: [Radio('옵션 없는 상품', { on: true }), Radio('옵션 있는 상품 (한 줄 = 품목 한 개)')], help: '양식 둘째 시트에 카테고리 이름·배송비 템플릿 이름·상품정보제공고시 품목군 목록이 들어 있어 그대로 복사해 씁니다.' },
        ]), Flex({ mt: 12 }, Btn('빈 양식 내려받기', { icon: 'file-download-o' }), Btn('예시가 채워진 양식 내려받기', { icon: 'file-download-o' })))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '3단계 · 검증 결과 — 성공 7 · 오류 2 (행별 사유)', right: '팝업만', pad: 20 }, Modal({ title: '엑셀 일괄 등록·수정', w: 740, foot: [Btn('오류 2행만 엑셀로 받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('성공 7행 반영', 'primary')] },
            Stepper(STEPS, 2),
            Text('상품수정_20261111.xlsx · 9행 · 기존 상품 수정(판매가·할인, 재고·안전 재고)', { sm: true, mute: true }),
            ExcelResult({ total: 9, ok: 7, fail: 2, keyLabel: '상품 · 품목', rows: [
                { row: 4, key: '롱지비티 석류맛 젤리스틱 · 4박스(56일분)', value: '재고 -5', reason: '재고는 0 이상의 숫자로 넣어 주세요' },
                { row: 8, key: '롱지비티 선물 세트', value: '판매가 95000원', reason: "판매가에 글자가 들어 있습니다. 숫자만 넣어 주세요 (예: 95000)" },
            ], note: '오류 행은 반영되지 않습니다. 성공한 7행은 판매가 3곳 · 재고 6곳이 바뀝니다. 스마트스토어 연동 상품 2개는 반영과 함께 전송됩니다.' }),
            Table({ dense: true, cols: ['바뀌는 내용 미리 보기 (앞 3행)', { t: '항목', w: 80 }, { t: '지금', w: 100, align: 'right' }, { t: '바뀐 뒤', w: 100, align: 'right' }], rows: [
                ['롱지비티 석류맛 젤리스틱 · 1박스(14일분)', '재고', '320개', '<b>820개</b>'],
                ['롱지비티 석류맛 젤리스틱 · 2박스(28일분)', '재고', '160개', '<b>410개</b>'],
                ['스틱 보관 케이스 · 색상 베이지', '판매가', '9,000원', '<b>8,500원</b>'],
            ] }),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '4단계 · 반영 완료', right: '팝업만', pad: 20 }, Modal({ title: '엑셀 일괄 등록·수정', w: 480, foot: [Btn('작업 기록 보기'), Btn('닫기', 'primary')] },
            Stepper(STEPS, 3),
            Text(`${Icon('check-circle-o')} 7행을 반영했습니다.`, { b: true }),
            KV([['바뀐 상품', '3개 (품목 7개)'], ['스마트스토어', '2개 상품 전송 완료'], ['남은 오류', '2행 · 고쳐서 다시 올리기'], ['되돌리기', '반영 전 값이 재고 변동 이력·작업 기록에 남습니다']], { wide: true }),
        )),
        Canvas({ size: 'auto', label: '양식이 다른 파일을 올림', right: '팝업 일부', pad: 20 }, `<div style="width:480px">${Upload({ title: '다른 파일로 바꾸려면 끌어다 놓기', button: '파일 바꾸기', files: [{ name: '재고현황_창고.xlsx', size: '22KB', icon: 'file-text-o', error: '양식이 다릅니다 — 제목 줄에 품목번호 칸이 없습니다' }] })}${Note('내려받은 양식의 제목 줄을 그대로 둔 파일만 올릴 수 있습니다.', { warn: true })}</div>`),
    ),
);

const state5 = StateBlock({ idx: 5, title: '복사', note: '줄 끝의 복사 버튼. 비슷한 상품을 새로 만들 때 기존 상품을 복사해 다른 부분만 고칩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '석류맛에 이어 레몬맛을 내놓을 때 상품정보제공고시·배송·옵션 구조는 거의 같습니다. 처음부터 다시 적지 않고 복사한 뒤 이름·이미지만 바꿉니다. 복사본이 실수로 바로 팔리지 않도록 전시 안 함 · 재고 0으로 만들어집니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '복사되지 않는 것: 재고 수량 · 리뷰·문의 · 판매 기록 · 스마트스토어 연동(새 상품으로 다시 등록해야 함) · 관리코드(겹치면 안 되므로 비움). 복사할 항목은 팝업에서 고를 수 있습니다.'),
    Canvas({ label: 'A-20 · 줄 끝 복사 버튼 → 팝업' }, Overlay({ bg: Page('전체', Filters({ open: false, summary: '조건 없음' }), ListBlock()), h: 560 },
        Modal({ title: '상품 복사', w: 540, foot: [Btn('취소'), Btn('복사하고 수정 화면 열기', 'primary')] },
            KV([['원본', `${SHOP.product}`]], { wide: false }),
            '<div style="height:12px"></div>',
            FormTable([
                { k: '새 상품명', required: true, v: Input({ value: `${SHOP.product} (복사)`, w: 320 }) },
                { k: '함께 복사', v: CheckGroup(['옵션 구조와 추가금', '이미지', '상세설명', '상품정보제공고시', '배송 설정', '검색 노출 문구'], ['옵션 구조와 추가금', '상세설명', '상품정보제공고시', '배송 설정']) },
                { k: '복사 개수', v: Input({ value: '1', w: 80, suffix: '개' }), help: '최대 10개 · 여러 개면 이름 뒤에 (복사 1), (복사 2)가 붙습니다.' },
            ]),
            Note('복사본은 판매중 · 전시 안 함 · 재고 0개 · 자사몰만으로 만들어집니다. 재고 · 리뷰 · 판매 기록 · 스마트스토어 연동 · 관리코드는 복사되지 않습니다.'),
        ))),
    Canvas({ label: 'A-20 · 복사 뒤 목록으로 돌아온 모습 — 복사본이 맨 위' }, Overlay({ bg: Page('전체', Filters({ open: false, summary: '조건 없음' }),
        ListHead({ total: 7, right: PerPage(50) }),
        Table({ check: true, cols: COLS, rows: [
            row({ ...PRODUCTS[0], name: `${SHOP.product} (복사)`, code: '관리코드 없음', sale: '', stock: '0', ch: ['자사몰'], ss: '', show: false, at: '11-11 10:31', by: '이보림' }, { on: true }),
            row(PRODUCTS[0]), row(PRODUCTS[1]),
        ] }),
    ), dim: false, align: 'top', h: 420 }, Toast('상품을 복사했습니다. 전시 안 함 · 재고 0개 상태입니다.', { action: '복사본 수정하기' }))),
);

const state6 = StateBlock({ idx: 6, title: '결과 없음', note: '조건에 맞는 상품이 없을 때와, 상품을 아직 하나도 등록하지 않았을 때.' },
    Anno({ title: '왜 이렇게 하나' }, '빈 화면에서 멈추지 않게 다음에 할 일을 버튼으로 줍니다. 검색 결과가 없을 때는 조건을 풀 수 있게, 처음 쓰는 몰에서는 상품 등록과 엑셀 일괄 등록으로 바로 가게 합니다.'),
    Canvas({ label: 'A-20 · 검색 결과 없음' }, Page('전체', Filters({ rows: FILTER_ROWS({ q: '레몬', sale: ['판매중'] }).slice(0, 3) }),
        ListHead({ total: 0, right: PerPage(50) }),
        Table({ check: true, cols: COLS, rows: [], empty: Empty({ icon: 'search', title: "'레몬'으로 찾은 상품이 없습니다", desc: '상품명 · 판매상태 판매중 조건으로 찾았습니다. 임시 저장 탭에 비슷한 상품 1개가 있습니다.', action: [Btn('조건 초기화', { icon: 'refresh' }), Btn('임시 저장 탭 보기')] }) }),
    )),
    Canvas({ label: 'A-20 · 상품을 아직 등록하지 않은 몰 (처음 설치한 상태)' }, AdminLayout({ active: 'a-20', actions: HeadActions },
        Tabs(TAB_LIST.map((t) => ({ ...t, n: 0 })), '전체'),
        Empty({ icon: 'box', title: '아직 등록한 상품이 없습니다', desc: '상품을 하나씩 등록하거나, 엑셀로 여러 개를 한 번에 올릴 수 있습니다. 먼저 카테고리와 배송비 템플릿을 만들어 두면 등록이 빨라집니다.', action: [Btn('상품 등록', { kind: 'primary', icon: 'plus' }), Btn('엑셀 일괄 등록', { icon: 'file-upload-o' }), Btn('카테고리 만들기')] }),
    )),
);

export default function A20() {
    return [state1, state2, state3, state4, state5, state6].join('');
}
