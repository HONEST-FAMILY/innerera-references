import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, ChannelBadge, Chips, Input, Select, Check, Radio, CheckGroup,
    FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Toast, SideDrawer,
    Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Thumb, Stats, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;

const ITEMS = [
    { p: P, o: '롱지비티 석류맛 박스 재고', n: '품목 4개가 함께 씀', use: '1박스 ×1 · 2박스 ×2 · 4박스 ×4 · 선물 세트 ×2', unit: '박스', stock: 48, hold: 6, safe: 60, wait: 0, ss: `${Badge('일치', 'check')}<small>11-11 10:30</small>`, low: true },
    { p: '롱지비티 체험 3포', o: '체험 3포 재고', n: '품목 1개', use: '체험 3포 ×1', unit: '개', stock: 0, hold: 0, safe: 20, wait: 14, out: true },
    { p: '스틱 보관 케이스', o: '케이스 베이지 재고', n: '품목 1개', use: '색상 베이지 ×1', unit: '개', stock: 64, hold: 1, safe: 10, wait: 0 },
    { p: '스틱 보관 케이스', o: '케이스 차콜 재고', n: '품목 1개', use: '색상 차콜 ×1', unit: '개', stock: 22, hold: 0, safe: 10, wait: 0 },
    { p: '이너에라 쇼핑백 (소)', o: '쇼핑백 재고', n: '추가구성상품', use: '쇼핑백 ×1 · 선물 세트 ×1', unit: '개', stock: 400, hold: 2, safe: 50, wait: 0 },
];

const saleBadge = (s) => Badge(s, { 판매중: 'solid', 품절: 'strike', 판매중지: 'mute' }[s]);
const COLS = [{ t: '', w: 48 }, '상품명 · 재고 이름', { t: '현재 재고', w: 112, align: 'right', sort: 'asc' }, { t: '선점 중', w: 64, align: 'right' }, { t: '판매 가능', w: 70, align: 'right' }, { t: '안전재고', w: 92, align: 'right' }, { t: '이 재고를 쓰는 품목', w: 170 }, { t: '재입고 알림 신청', w: 96, align: 'right' }, { t: '스마트스토어 전송', w: 104 }, { t: '', w: 44 }];
const row = (it, o = {}) => ({
    hl: it.low || it.out,
    ...o.row,
    c: [
        Thumb(36),
        `<u>${it.p}</u><small><b>${it.o}</b> · ${it.n}</small>`,
        o.edit ? Input({ value: String(o.stock === undefined ? it.stock : o.stock), w: 94, suffix: it.unit, focus: o.focus, error: o.err }) + (o.err ? `<small><b>${o.err}</b></small>` : o.diff ? `<small><b>${o.diff}</b></small>` : '') : `<b>${it.stock}${it.unit}</b>${it.out ? ` ${Badge('품절', 'strike')}` : it.low ? ` ${Badge('품절 임박', 'warn')}` : ''}`,
        `${it.hold}${it.unit}`,
        `${it.stock - it.hold}${it.unit}`,
        o.edit ? Input({ value: String(it.safe), w: 76, suffix: it.unit }) : `${it.safe}${it.unit}`,
        it.use,
        it.wait ? `<b><u>${it.wait}명</u></b>` : '0명',
        it.ss || '<small>연동 안 함</small>',
        '<u>이력</u>',
    ],
});

const TABS = ['재고 현황', '전체 변동 이력'];
const STOCK_CHIPS = ['전체 5', '품절 1', '품절 임박 1', '재입고 신청 있음 1'];
const HeadActions = [Btn('엑셀로 재고 일괄 수정', { icon: 'file-upload-o' })];
const Page = (tab, ...body) => AdminLayout({ active: 'a-23', actions: HeadActions }, Tabs(TABS, tab === '전체 변동 이력' ? tab : '재고 현황'), body);

const Summary = Stats([
    { k: '실물 재고', v: '5개', sub: '상품 5개 · 품목 8개가 나눠 씀', icon: 'box' },
    { k: '선점 중', v: '9개', sub: '결제 진행 중 · 입금 대기로 잡힌 수량', icon: 'package' },
    { k: '품절 임박', v: '1개', sub: '판매 가능이 안전재고 이하', link: '품절 임박만 보기', icon: 'warning', on: true },
    { k: '품절', v: '1개', sub: '재입고 알림 신청 14명', link: '품절만 보기', icon: 'error-o' },
]);

const FRows = (o = {}) => [
    { k: '검색어', v: [Select({ value: '상품명 · 재고 이름', w: 160 }), Input({ value: o.q || '', placeholder: '상품명 · 재고 이름 · 품목 코드 · 바코드 (여러 개는 쉼표나 줄바꿈)', icon: 'search', w: 440 })] },
    { k: '카테고리', v: Select({ placeholder: '카테고리 전체', w: 260 }) },
    { k: '재고 상태', v: CheckGroup(['품절', '품절 임박(판매 가능이 안전재고 이하)', '재입고 신청 있음', '안전재고 미설정'], o.low ? ['품절 임박(판매 가능이 안전재고 이하)'] : []) },
    { k: '판매 채널', v: CheckGroup(['자사몰', '스마트스토어'], ['자사몰', '스마트스토어']) },
];

const state1 = StateBlock({ idx: 1, title: '품목별 재고·안전재고', note: '한 줄 = 창고에 실제로 있는 재고 하나(실물 재고). 옵션이 없는 상품이나 품목마다 실물이 다른 상품은 품목 하나가 재고 한 줄이고, 1박스·2박스·4박스처럼 같은 상자를 나눠 쓰는 품목은 한 줄로 묶여 이 재고를 쓰는 품목 칸에 품목별 차감 수량이 나옵니다. 현재 재고 · 선점 중 · 판매 가능 · 안전재고를 나란히 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '창고 담당자가 세는 것은 품목이 아니라 상자입니다. 구성마다 재고를 따로 적으면 4박스가 팔려도 1박스 재고는 그대로라 실물보다 많이 팔리는 사고가 납니다. 그래서 재고는 실물 기준 한 줄에만 적고, 품목별 판매 가능 수량은 (현재 재고 − 선점 중) ÷ 재고 차감 수량으로 계산해 보여 줍니다. 선점 중은 결제를 시작해 10분 동안 잡아 둔 수량과 가상계좌 입금 대기로 잡아 둔 수량입니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기값: 재고 현황 탭 · 전체 · 현재 재고 적은 순 · 50개씩 · 안전재고 0(임박 알림 없음). 스마트스토어와 함께 쓰는 재고는 여기서 바꾸면 옵션별 재고가 바로 다시 전송됩니다. 재고 제한 없음으로 설정한 상품은 목록에 나오지 않습니다. 품목과 재고의 연결 · 재고 차감 수량은 상품 등록·수정의 옵션·재고 묶음에서 정합니다.'),
    Canvas({ label: 'A-23 · 재고 현황 탭 · 전체 · 검색 조건 펼침' }, Page('재고 현황', Summary, '<div style="height:16px"></div>', Filters({ rows: FRows() }),
        ListHead({ total: 5, left: Chips(STOCK_CHIPS, '전체 5'), right: [Btn('목록에서 바로 고치기', { size: 'sm', icon: 'pen-o' }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: COLS, rows: [...ITEMS].sort((a, b) => a.stock - b.stock).map((it) => row(it)) }),
        Note('박스 재고 48박스 − 선점 6박스 = 판매 가능 42박스(1박스 42건 · 2박스 21건 · 4박스 10건). 줄을 누르면 품목별 판매 가능 수량이 펼쳐집니다(5번 상태).'),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
);

const state2 = StateBlock({ idx: 2, title: '품절 임박 필터', note: '판매 가능 수량이 안전재고 이하인 실물 재고만. 대시보드의 품절 임박 카드를 누르면 이 필터가 걸린 채 열립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '품절은 나고 나서 아는 것이 아니라 나기 전에 알아야 발주를 넣습니다. 실물 재고마다 안전재고를 정해 두면 그 아래로 내려간 것만 모아 보여 주고, 최근 7일 출고 속도로 며칠 뒤 품절될지 어림해 줍니다. 여기서 바로 입고 수량을 넣을 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '품절 임박이 되면 내부 수신자(설정 > 알림)에게 하루 한 번 모아서 알림이 갑니다. 며칠 뒤 품절은 어림값이며 최근 7일 출고가 없으면 표시하지 않습니다. 안전재고가 0인 재고는 품절 임박으로 잡히지 않습니다.'),
    Canvas({ label: 'A-23 · 품절 임박으로 거름 (대시보드 품절 임박 카드에서 들어옴)' }, Page('재고 현황', Filters({ open: false, summary: '재고 상태 품절 임박(판매 가능이 안전재고 이하)' }),
        ListHead({ total: 1, left: Chips(STOCK_CHIPS, '품절 임박 1'), right: [Btn('엑셀 내려받기 (발주용)', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '', w: 48 }, '상품명 · 재고 이름', { t: '현재 재고', w: 84, align: 'right' }, { t: '판매 가능', w: 80, align: 'right' }, { t: '안전재고', w: 76, align: 'right' }, { t: '모자란 수량', w: 86, align: 'right' }, { t: '최근 7일 출고', w: 130, align: 'right' }, { t: '품절 예상', w: 116 }, { t: '입고 수량 넣기', w: 210 }], rows: [
            { hl: true, c: [Thumb(36), `<u>${P}</u><small><b>롱지비티 석류맛 박스 재고</b> · 1박스 ×1 · 2박스 ×2 · 4박스 ×4 · 선물 세트 ×2</small>`, '<b>48박스</b>', '42박스', '60박스', '18박스', '63박스 (하루 9박스)', `${Badge('약 4일 뒤', 'warn')}<small>11-15(일) 무렵</small>`, `${Input({ value: '500', w: 110, suffix: '박스', focus: true })} ${Btn('더하기', { size: 'sm', kind: 'primary' })}`] },
        ] }),
        Note('입고 수량을 넣고 더하기를 누르면 현재 재고에 더해지고(48 → 548박스), 재고 변동 이력에 입고로 남습니다. 이 재고를 쓰는 품목 4개의 판매 가능 수량과 스마트스토어 재고가 함께 바뀝니다.'),
    )),
    Canvas({ label: 'A-23 · 품절로 거름 — 재입고 알림 신청 수를 함께 보여 줌' }, Page('재고 현황', Filters({ open: false, summary: '재고 상태 품절' }),
        ListHead({ total: 1, left: Chips(STOCK_CHIPS, '품절 1'), right: PerPage(50) }),
        Table({ check: true, cols: [{ t: '', w: 48 }, '상품명 · 재고 이름', { t: '재고 0이 된 때', w: 140 }, { t: '재입고 알림 신청', w: 120, align: 'right' }, { t: '판매상태', w: 90 }, { t: '입고 수량 넣기', w: 200 }], rows: [
            { hl: true, c: [Thumb(36), '<u>롱지비티 체험 3포</u><small><b>체험 3포 재고</b> · 품목 1개</small>', '11-09 08:03<small>주문 차감으로 0</small>', '<b><u>14명</u></b>', saleBadge('품절'), `${Input({ placeholder: '입고 수량', w: 100, suffix: '개' })} ${Btn('더하기', { size: 'sm' })}`] },
        ] }),
        Note('재고를 넣으면 자동으로 판매중으로 돌아가고, 재입고 알림을 신청한 14명에게 알림이 나갑니다(더하기를 누를 때 확인 팝업 — 6번 상태).'),
    )),
    Canvas({ label: 'A-23 · 품절 임박 재고가 없을 때' }, Page('재고 현황', Filters({ open: false, summary: '재고 상태 품절 임박(판매 가능이 안전재고 이하)' }),
        Empty({ icon: 'check-circle-o', title: '품절 임박 재고가 없습니다', desc: '모든 재고의 판매 가능 수량이 안전재고보다 많습니다. 안전재고를 넣지 않은 재고 2개는 여기에 잡히지 않습니다.', action: [Btn('안전재고 미설정 재고 보기')] }))),
);

const STEPS = ['양식 내려받기', '엑셀 올리기', '검증 결과', '반영'];
const sorted = [...ITEMS].sort((a, b) => a.stock - b.stock);

const state3 = StateBlock({ idx: 3, title: '일괄 수정·엑셀', note: '목록에서 바로 고치기(칸이 입력칸으로 바뀜), 체크한 재고에 같은 수량 더하기·빼기, 엑셀로 한꺼번에 올리기 세 가지. 모두 실물 재고 한 줄 단위로 고칩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '입고 날에는 재고 수십 줄의 숫자를 한 번에 고칩니다. 몇 개면 목록에서 바로 고치고 Enter로 다음 줄로 내려가고, 많으면 창고 엑셀을 양식에 붙여 올립니다. 고칠 때 더하는 방식(더하기/빼기 — 기본)과 덮어쓰는 방식(이 숫자로 맞추기)을 분명히 나눕니다 — 고치는 사이에 주문이 들어와도 더하기는 어긋나지 않습니다. 구성 옵션처럼 여러 품목이 나눠 쓰는 재고도 한 줄만 고치면 됩니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '재고를 선점 중 수량보다 적게 내릴 수 없습니다(결제 중이거나 입금을 기다리는 주문을 못 받게 됨). 모든 수정은 사유(입고 · 실사 조정 · 파손 · 기타)와 함께 재고 변동 이력에 남습니다. 엑셀 규격: XLSX·CSV · 10MB · 5,000행 · 한 줄 = 실물 재고 한 개. 올리면 바로 반영하지 않고 검증 결과를 먼저 보여 줍니다.'),
    Canvas({ label: 'A-23 · 목록에서 바로 고치기 버튼 → 현재 재고·안전재고 칸이 입력칸으로 (바꾼 칸 · 입력 중 · 오류)' }, Page('재고 현황', Filters({ open: false, summary: '조건 없음' }),
        `<div class="wf-bulk">${Icon('pen-o')}<span class="cnt">바로 고치는 중 · 바꾼 재고 <b>2</b>개</span><span class="acts" style="align-items:center"><span style="color:var(--ink);display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap">${Select({ value: '사유: 입고', w: 150 })}</span>${Btn('바꾼 2개 저장', 'primary')}${Btn('취소', 'line')}</span><span class="clear">Enter = 다음 줄 · Tab = 옆 칸</span></div>`,
        Table({ cols: COLS, rows: [
            row(sorted[0], { edit: true }),
            row(sorted[1], { edit: true, stock: 62, diff: '22 → 62 (+40)', row: { on: true } }),
            row(sorted[2], { edit: true, stock: 548, diff: '48 → 548 (+500)', row: { on: true } }),
            row(sorted[3], { edit: true, stock: 0, err: '선점 중 1개보다 적게 내릴 수 없습니다', row: { hl: true } }),
            row(sorted[4], { edit: true, stock: 400, focus: true }),
        ] }),
    )),
    Canvas({ label: 'A-23 · 3개 선택 → 일괄 처리 바 → 재고 더하기 버튼 → 팝업' }, Overlay({ bg: Page('재고 현황', Filters({ open: false, summary: '조건 없음' }),
        BulkBar({ count: 3, sub: '실물 재고 3개' }, Btn('재고 더하기', 'primary'), Btn('안전재고 변경', 'line'), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' })),
        Table({ check: true, checked: [0, 1, 2], cols: COLS, rows: [ITEMS[0], ITEMS[2], ITEMS[3], ITEMS[1], ITEMS[4]].map((it) => row(it)) }),
    ), h: 600 },
        Modal({ title: '재고 더하기 · 선택한 실물 재고 3개', w: 600, foot: [Btn('취소'), Btn('재고 3개 바꾸기', 'primary')] },
            FormTable([
                { k: '방식', required: true, v: [Radio('더하기', { on: true }), Radio('빼기'), Radio('이 숫자로 맞추기')] },
                { k: '수량', required: true, v: Input({ value: '200', w: 120, suffix: '개' }) },
                { k: '사유', required: true, v: Select({ value: '입고', w: 200 }) },
                { k: '메모', v: Input({ value: '11월 2차 생산분 입고', w: 340 }), help: '재고 변동 이력에 함께 남습니다.' },
            ]),
            '<div style="height:10px"></div>',
            Table({ dense: true, cols: ['실물 재고', { t: '지금', w: 90, align: 'right' }, { t: '바뀐 뒤', w: 90, align: 'right' }], rows: [
                ['롱지비티 석류맛 박스 재고<small>1박스 ×1 · 2박스 ×2 · 4박스 ×4 · 선물 세트 ×2</small>', '48박스', '<b>248박스</b>'], ['케이스 베이지 재고', '64개', '<b>264개</b>'], ['케이스 차콜 재고', '22개', '<b>222개</b>'],
            ] }),
            Note('박스 재고는 스마트스토어와 함께 씁니다. 저장하면 옵션별 재고(판매 가능 ÷ 재고 차감 수량)가 다시 전송됩니다.', { warn: true }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '사유 칸을 누름', right: '입력칸만', pad: 20 }, `<div style="width:240px;min-height:270px">${Select({ value: '입고', w: 200, open: true, options: [{ t: '입고', on: true }, '실사 조정(세어 보니 다름)', '파손', '기타(메모에 적기)'] })}</div>`),
        Canvas({ size: 'auto', label: '엑셀로 재고 일괄 수정 버튼 → 1단계', right: '팝업만', pad: 20 }, Modal({ title: '엑셀로 재고 일괄 수정', w: 600, foot: [Btn('닫기'), Btn('검증하기', { kind: 'primary', disabled: true })] },
            Stepper(STEPS, 0),
            FormTable([
                { k: '양식', v: [Btn('지금 재고가 채워진 양식 내려받기 (실물 재고 5행)', { icon: 'file-download-o' })], help: '칸: 재고 번호 · 상품명 · 재고 이름 · 이 재고를 쓰는 품목 · 현재 재고 · 안전재고. 재고 번호 칸은 바꾸지 마세요.' },
                { k: '올린 숫자를', required: true, v: [Radio('현재 재고에 더하기 (입고)', { on: true }), Radio('이 숫자로 맞추기 (재고 실사)')] },
                { k: '재고를 찾는 기준', v: [Radio('재고 번호', { on: true }), Radio('재고 이름'), Radio('바코드')], help: '창고 엑셀에 재고 번호가 없으면 재고 이름이나 바코드로 맞출 수 있습니다.' },
            ]),
            '<div style="height:10px"></div>',
            Upload({ title: '엑셀 파일을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · CSV', '용량 10MB 이하, 한 번에 5,000행까지', '재고 칸을 비운 줄은 건드리지 않습니다'] }),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '3단계 · 검증 결과 — 성공 3 · 오류 2', right: '팝업만', pad: 20 }, Modal({ title: '엑셀로 재고 일괄 수정', w: 720, foot: [Btn('오류 2행만 엑셀로 받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('성공 3행 반영', 'primary')] },
            Stepper(STEPS, 2),
            ExcelResult({ total: 5, ok: 3, fail: 2, keyLabel: '실물 재고', rows: [
                { row: 4, key: '스틱 보관 케이스 · 케이스 베이지 재고', value: '-64', reason: '선점 중 1개보다 적게 내릴 수 없습니다. 63 이하로 빼 주세요' },
                { row: 6, key: '재고 번호 없음', value: '50', reason: '재고 번호가 비어 있어 어느 재고인지 알 수 없습니다. 양식을 다시 내려받아 그 줄에 적어 주세요' },
            ], note: '성공 3행: 재고가 늘어나는 실물 재고 3개(박스 재고 +500박스 · 체험 3포 +50개 · 쇼핑백 +200개). 반영하면 재고 변동 이력에 입고 · 엑셀 · 이보림으로 남습니다. 체험 3포는 재입고 알림 신청 14명에게 알림이 나갑니다.' }),
        )),
        Canvas({ size: 'auto', label: '반영 완료 안내', right: '안내만', pad: 20 }, Toast('실물 재고 3개를 바꿨습니다. 스마트스토어 옵션 3개의 재고도 다시 전송했습니다.', { action: '변동 이력 보기' })),
    ),
);

const LOG_COLS = [{ t: '일시', w: 110, sort: 'desc' }, { t: '사유', w: 130 }, { t: '변동', w: 70, align: 'right' }, { t: '변동 뒤 재고', w: 110, align: 'right' }, '관련 주문 · 메모', { t: '처리자', w: 110 }];
const LOGS = [
    ['11-11 09:42', Badge('주문', 'line'), '-4', '48박스', `<u>20261111-000128</u> ${ChannelBadge('자사몰')}<small>김민지 · 4박스(56일분) 1건 · 결제완료</small>`, '시스템'],
    ['11-11 09:18', Badge('주문', 'line'), '-1', '52박스', `<u>20261111-000127</u> ${ChannelBadge('자사몰')}<small>이하은 · 1박스(14일분) 1건 · 결제완료</small>`, '시스템'],
    ['11-10 22:14', Badge('주문', 'fill'), '-2', '53박스', `<u>2026111045790022</u> ${ChannelBadge('스마트스토어')}<small>정수아 · 2박스(28일분) 1건 · 주문 수집 때 차감</small>`, '스마트스토어'],
    ['11-10 16:40', Badge('취소 원복', 'dash'), '+2', '55박스', `<u>20261109-000071</u> ${ChannelBadge('자사몰')}<small>임재현 · 2박스(28일분) 1건 · 취소 승인</small>`, '운영자 정수아'],
    ['11-09 11:02', Badge('파손', 'bold'), '-2', '53박스', '메모: 상자 찌그러짐 2박스', '운영자 이보림'],
    ['11-08 14:30', Badge('반품 입고', 'dash'), '+1', '55박스', `<u>20261102-000044</u> ${ChannelBadge('자사몰')}<small>윤서연 · 1박스(14일분) 1건 · 검수 통과(재판매 가능)</small>`, '운영자 정수아'],
    ['10-20 10:00', Badge('입고', 'bold'), '+300', '12박스 → 312박스', '엑셀<small>메모: 10월 2차 생산분 입고</small>', '운영자 이보림'],
];

const state4 = StateBlock({ idx: 4, title: '재고 변동 이력', note: '재고 줄의 이력을 누르면 오른쪽에서 열립니다. 실물 재고가 언제 · 왜 · 누구에 의해 몇 개 바뀌었는지 한 줄씩 남습니다. 모든 재고의 변동을 한 표로 보는 곳은 화면 위 전체 변동 이력 탭입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '창고에서 센 수량과 화면 숫자가 다를 때 어디서 어긋났는지 찾을 수 있어야 합니다. 한 재고의 이력은 따로 메뉴를 만들지 않고 그 재고 줄 안에서 봅니다. 사유는 주문 · 취소 원복 · 반품 입고 · 입고 · 조정 · 파손으로 나누고, 주문에서 생긴 변동은 주문번호를 눌러 주문 상세로 갑니다. 4박스 1건이 팔리면 박스 재고가 4 줄어든 한 줄로 남습니다(품목이 아니라 실물 기준). 전체 변동 이력 탭은 월말 재고 실사 때 기간 합계(입고 합 · 출고 합)를 대조하는 용도입니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '전체 변동 이력 탭 초기값: 최근 7일 · 최신순. 이력은 고치거나 지울 수 없습니다. 틀렸으면 조정으로 다시 맞춥니다. 결제를 시작하면 10분 동안 선점만 하고(이력에 안 남음) 결제완료 때 확정 차감이 이력에 남습니다. 가상계좌는 입금 기한까지 선점했다가 입금되면 차감하고, 결제 실패·입금 기한 만료·취소 승인 때 되돌아옵니다. 반품은 검수에서 재판매 가능으로 판정한 수량만 되돌아옵니다.'),
    Canvas({ label: 'A-23 · 박스 재고 줄의 이력 → 오른쪽 드로어' }, Overlay({ bg: Page('재고 현황', Filters({ open: false, summary: '조건 없음' }), Table({ check: true, cols: COLS, rows: ITEMS.map((it) => row(it)) })), align: 'right', h: 800 },
        SideDrawer({ title: '재고 변동 이력', sub: `${P} · 롱지비티 석류맛 박스 재고`, w: 760, foot: [Btn('엑셀 내려받기', { icon: 'download' }), Btn('재고 수정', 'primary')] },
            KV([['현재 재고', '<b>48박스</b> (선점 중 6박스 · 판매 가능 42박스)'], ['안전재고', '60박스'], ['이 재고를 쓰는 품목', '1박스 ×1 · 2박스 ×2 · 4박스 ×4 · 선물 세트 ×2'], ['스마트스토어', '옵션 3개와 함께 씀 · 마지막 전송 11-11 10:30 일치']], { wide: false }),
            '<div style="height:14px"></div>',
            Flex({ gap: 8, align: 'center' }, Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })),
            '<div style="height:8px"></div>',
            Chips(['전체 38', '주문 31', '취소 원복 2', '반품 입고 1', '입고 2', '조정 1', '파손 1'], '전체 38'),
            '<div style="height:10px"></div>',
            Table({ dense: true, cols: LOG_COLS, rows: LOGS }),
            Pager({ page: 1, last: 2 }),
        ))),
    Canvas({ label: 'A-23 · 전체 변동 이력 탭 → 모든 재고의 변동을 한 표로 (사유를 입고 · 조정 · 파손으로 거름)' }, Page('전체 변동 이력',
        Filters({ rows: [
            { k: '기간', v: Period({ preset: '7일' }) },
            { k: '사유', v: CheckGroup(['주문', '취소 원복', '반품 입고', '입고', '조정', '파손'], ['입고', '조정', '파손']) },
            { k: '상품', v: Select({ placeholder: '상품 이름으로 찾기 (전체)', w: 360 }) },
            { k: '처리자', v: Select({ value: '전체 (운영자 · 시스템 · 스마트스토어)', w: 280 }) },
        ] }),
        ListHead({ total: 3, left: Text('기간 합계 · 입고 합 <b>+40</b> · 출고 합 <b>-2</b>', { sm: true }), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: [{ t: '일시', w: 110, sort: 'desc' }, '상품 · 재고 이름', { t: '사유', w: 96 }, { t: '변동', w: 70, align: 'right' }, { t: '변동 후 수량', w: 100, align: 'right' }, { t: '관련 주문번호', w: 140 }, '메모', { t: '처리자', w: 110 }], rows: [
            ['11-09 11:02', `<u>${P}</u><small>롱지비티 석류맛 박스 재고</small>`, Badge('파손', 'bold'), '-2', '53박스', '-', '상자 찌그러짐 2박스', '운영자 이보림'],
            ['11-08 15:20', '<u>스틱 보관 케이스</u><small>케이스 베이지 재고</small>', Badge('입고', 'bold'), '+40', '65개', '-', '', '운영자 정수아'],
            ['11-06 09:30', '<u>스틱 보관 케이스</u><small>케이스 차콜 재고</small>', Badge('조정', 'bold'), '0', '22개', '-', '실사 결과 일치 확인', '운영자 정수아'],
        ] }),
        Note('사유를 주문으로 거르면 관련 주문번호를 눌러 주문 상세(A-18)로 갈 수 있습니다. 처리자는 운영자 이름 · 시스템(자사몰 주문) · 스마트스토어로 나뉩니다.'),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-23 · 전체 변동 이력 탭 · 선택한 기간에 변동이 없을 때' }, Page('전체 변동 이력', Filters({ open: false, summary: '기간 2026-11-11 ~ 2026-11-11 · 사유 파손' }),
        Empty({ icon: 'time-o', title: '선택한 기간에 변동이 없습니다', desc: '기간이나 사유 조건을 바꿔 보세요.', action: [Btn('조건 초기화')] }))),
    Canvas({ size: 'auto', label: '변동이 한 번도 없는 새 재고의 이력', right: '드로어 안', pad: 20 }, `<div style="width:520px">${Empty({ icon: 'time-o', title: '변동 이력 없음', desc: '주문이 들어오거나 재고를 고치면 여기에 한 줄씩 남습니다.', action: [Btn('재고 수정', 'primary')] })}</div>`),
);

const ViewSwitch = (active) => `<span style="display:inline-flex;border:1px solid var(--line);border-radius:4px;overflow:hidden;font-size:12.5px">${['실물 재고 단위', '품목 단위'].map((t) => `<span style="padding:6px 12px;${t === active ? 'background:var(--dark);color:#fff;font-weight:700' : 'background:#fff;color:var(--ink2)'}">${t}</span>`).join('')}</span>`;
const REAL_COLS = [{ t: '', w: 48 }, '상품명 · 재고 이름', { t: '현재 재고', w: 84, align: 'right', sort: 'asc' }, { t: '선점 중', w: 64, align: 'right' }, { t: '판매 가능', w: 70, align: 'right' }, { t: '안전재고', w: 64, align: 'right' }, { t: '이 재고를 쓰는 품목', w: 170 }, { t: '재입고 알림 신청', w: 96, align: 'right' }, { t: '스마트스토어 전송', w: 104 }, { t: '', w: 44 }];
const BOX_ROW = (open) => ({ hl: !open, on: open, c: [Thumb(36), `<u>${P}</u><small><b>롱지비티 석류맛 박스 재고</b> · 품목 4개가 함께 씀 ${Icon(open ? 'angle-up-min' : 'angle-down-min')}</small>`, `<b>48박스</b> ${Badge('품절 임박', 'warn')}`, '6박스', '42박스', '60박스', '1박스 ×1 · 2박스 ×2 · 4박스 ×4 · 선물 세트 ×2', '0명', `${Badge('일치', 'check')}<small>11-11 10:30</small>`, '<u>이력</u>'] });
const TRY_ROW = { hl: true, c: [Thumb(36), '<u>롱지비티 체험 3포</u><small>체험 3포 재고 · 품목 1개</small>', `<b>0개</b> ${Badge('품절', 'strike')}`, '0개', '0개', '20개', '체험 3포 ×1', '<b><u>14명</u></b>', '<small>연동 안 함</small>', '<u>이력</u>'] };
const REAL_REST = [
    [Thumb(36), '<u>스틱 보관 케이스</u><small>케이스 차콜 재고 · 품목 1개</small>', '<b>22개</b>', '0개', '22개', '10개', '색상 차콜 ×1', '0명', '<small>연동 안 함</small>', '<u>이력</u>'],
    [Thumb(36), '<u>스틱 보관 케이스</u><small>케이스 베이지 재고 · 품목 1개</small>', '<b>64개</b>', '1개', '63개', '10개', '색상 베이지 ×1', '0명', '<small>연동 안 함</small>', '<u>이력</u>'],
    [Thumb(36), '<u>이너에라 쇼핑백 (소)</u><small>쇼핑백 재고 · 추가구성상품</small>', '<b>400개</b>', '2개', '398개', '50개', '쇼핑백 ×1 · 선물 세트 ×1', '0명', '<small>연동 안 함</small>', '<u>이력</u>'],
];
const REAL_CHIPS = ['전체 5', '품절 1', '품절 임박 1', '재입고 신청 있음 1'];
const sub = (name, per, can, calc, naver) => ({ tied: true, nocheck: true, c: ['', `${name}<small>${per}</small>`, '', '', `<b>${can}</b>`, '', calc, '', naver, ''] });

const state5 = StateBlock({ idx: 5, title: '실물 재고 단위 보기(구성 옵션이 같은 재고를 나눠 씀)', note: '한 줄 = 창고에 실제로 있는 재고 하나. 1박스·2박스·4박스처럼 같은 상자를 나눠 쓰는 품목은 한 줄로 묶이고, 그 재고를 쓰는 품목과 한 건에 빠지는 수량을 같이 보여 줍니다. 재고 관리의 기본 보기입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '창고 담당자가 세는 것은 품목이 아니라 상자입니다. 입고 100박스를 넣을 때 1박스·2박스·4박스 줄에 나눠 적게 하면 틀립니다. 실물 재고 한 줄에 한 번 넣으면 그 재고를 쓰는 모든 품목의 판매 가능 수량이 계산됩니다(판매 가능 = (현재 − 선점) ÷ 재고 차감 수량, 버림). 품목별 숫자가 필요하면 품목 단위 보기로 바꾸거나 줄을 펼칩니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기값: 실물 재고 단위 보기 · 현재 재고 적은 순 · 안전재고 0(임박 알림 없음). 선점 중 = 결제 진행 중(10분)과 가상계좌 입금 대기로 잡혀 있는 수량으로, 아직 빠지지 않았지만 팔 수 없는 수량입니다. 품절 임박 = 판매 가능이 안전재고 이하. 다른 상품이 같은 재고를 쓰면(선물 세트 = 박스 ×2) 그 상품도 같은 줄에 나옵니다.'),
    Canvas({ label: 'A-23 · 실물 재고 단위 보기(기본)' }, Page('재고 현황', Filters({ open: false, summary: '조건 없음' }),
        ListHead({ total: 5, left: [ViewSwitch('실물 재고 단위'), Chips(REAL_CHIPS, '전체 5')], right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: REAL_COLS, rows: [TRY_ROW, BOX_ROW(false), ...REAL_REST] }),
        Note('박스 재고 48박스 − 선점 6박스 = 42박스. 판매 가능 42박스가 안전재고 60박스 이하라서 품절 임박으로 표시됩니다.'),
    )),
    Canvas({ label: 'A-23 · 박스 재고 줄을 펼침 → 품목별 판매 가능 수량 · 선점 내용' }, Page('재고 현황', Filters({ open: false, summary: '조건 없음' }),
        ListHead({ total: 5, left: [ViewSwitch('실물 재고 단위'), Chips(REAL_CHIPS, '전체 5')], right: PerPage(50) }),
        Table({ check: true, cols: REAL_COLS, rows: [
            BOX_ROW(true),
            sub('구성 1박스(14일분)', '한 건에 1박스', '42건', '42 ÷ 1', '네이버 재고 42'),
            sub('구성 2박스(28일분)', '한 건에 2박스', '21건', '42 ÷ 2', '네이버 재고 21'),
            sub('구성 4박스(56일분)', '한 건에 4박스', '10건', '42 ÷ 4 = 10.5 → 10', '네이버 재고 10'),
            sub('롱지비티 선물 세트', '다른 상품 · 한 건에 2박스', '21건', '42 ÷ 2', `${Badge('오류', 'warn')}<small>전송 실패</small>`),
            { tied: true, nocheck: true, c: ['', '<small>선점 중 6박스 내용</small>', '', '<small>6박스</small>', '', '', '<small>결제 진행 중 1건 2박스(10:41까지) · 입금 대기 1건 4박스(11-12 23:59까지)</small>', '', '', ''] },
        ] }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '현재 재고 칸을 누름 → 재고 수정 (기본 = 더하기/빼기)', right: '팝업만', pad: 20 }, Modal({ title: '재고 수정 · 롱지비티 석류맛 박스 재고', w: 520, foot: [Btn('취소'), Btn('재고 바꾸기', 'primary')] },
            FormTable([
                { k: '방식', required: true, v: [Radio('더하기/빼기', { on: true }), Radio('이 숫자로 맞추기')] },
                { k: '수량', required: true, v: [Select({ value: '더하기', w: 100 }), Input({ value: '500', w: 120, suffix: '박스' })] },
                { k: '사유', required: true, v: Select({ value: '입고', w: 180 }) },
            ]),
            Text('48박스 → <b>548박스</b> · 판매 가능 1박스 542건 · 2박스 271건 · 4박스 135건 · 선물 세트 271건', { sm: true }),
            Note('저장하면 품절 임박이 풀리고 스마트스토어 옵션별 재고가 다시 전송됩니다.'),
        )),
        Canvas({ size: 'auto', label: '이 숫자로 맞추기를 고름 → 경고 · 사유 목록 열림', right: '팝업만', pad: 20 }, Modal({ title: '재고 수정 · 롱지비티 석류맛 박스 재고', w: 520, foot: [Btn('취소'), Btn('재고 바꾸기', 'primary')] },
            Note('맞추기는 창고에서 수량을 센 뒤 그 사이에 주문이 들어왔으면 어긋날 수 있습니다. 오늘 결제된 주문 2건(3박스)이 있습니다 — 45가 그 주문을 뺀 숫자인지 확인해 주세요.', { warn: true }),
            `<div style="min-height:300px">${FormTable([
                { k: '방식', required: true, v: [Radio('더하기/빼기'), Radio('이 숫자로 맞추기', { on: true })] },
                { k: '수량', required: true, v: Input({ value: '45', w: 120, suffix: '박스' }) },
                { k: '사유', required: true, v: Select({ value: '실사 조정', w: 180, open: true, options: ['입고', { t: '실사 조정', on: true }, '파손', '기타'] }) },
            ])}</div>`,
        )),
    ),
    Canvas({ label: 'A-23 · 품목 단위 보기로 바꿈 — 같은 재고를 쓰는 품목은 묶음 머리줄 아래에' }, Page('재고 현황', Filters({ open: false, summary: '조건 없음' }),
        ListHead({ total: 8, left: [ViewSwitch('품목 단위')], right: PerPage(50) }),
        Table({ cols: [{ t: '', w: 48 }, '상품명 · 옵션 값', { t: '재고 차감 수량', w: 110, align: 'right' }, { t: '판매 가능', w: 90, align: 'right' }, { t: '판매상태', w: 90 }, { t: '스마트스토어 재고', w: 150, align: 'right' }], rows: [
            { group: `${Icon('package')}롱지비티 석류맛 박스 재고 · 현재 48박스 · 선점 6박스 · 판매 가능 42박스` },
            { tied: true, c: [Thumb(36), `${P}<small>구성 1박스(14일분)</small>`, '1박스', '<b>42건</b>', saleBadge('판매중'), '42'] },
            { tied: true, c: [Thumb(36), `${P}<small>구성 2박스(28일분)</small>`, '2박스', '<b>21건</b>', saleBadge('판매중'), '21'] },
            { tied: true, c: [Thumb(36), `${P}<small>구성 4박스(56일분)</small>`, '4박스', '<b>10건</b>', saleBadge('판매중'), '10'] },
            { tied: true, c: [Thumb(36), '롱지비티 선물 세트<small>옵션 없음</small>', '2박스', '<b>21건</b>', saleBadge('판매중'), `21 ${Badge('전송 오류', 'warn')}`] },
            { group: `${Icon('package')}체험 3포 재고 · 현재 0개` },
            { hl: true, c: [Thumb(36), '롱지비티 체험 3포<small>옵션 없음</small>', '1개', '<b>0건</b>', saleBadge('품절'), '연동 안 함'] },
        ] }),
        Note('품목 단위 보기에서는 재고를 고칠 수 없습니다(같은 재고를 두 번 고치는 실수 방지). 묶음 머리줄을 누르면 실물 재고 수정이 열립니다.'),
    )),
);

const restockBg = Page('재고 현황', Filters({ open: false, summary: '조건 없음' }),
    ListHead({ total: 1, left: [ViewSwitch('실물 재고 단위'), Chips(REAL_CHIPS, '재입고 신청 있음 1')], right: PerPage(50) }),
    Table({ check: true, cols: REAL_COLS, rows: [TRY_ROW] }));

const state6 = StateBlock({ idx: 6, title: '재입고 알림 신청 수와 재고 입력 시 자동 발송 안내', note: '품절 상품에 고객이 걸어 둔 재입고 알림 신청 수를 재고 줄에서 보고, 재고를 넣는 순간 신청자에게 알림이 나간다는 것을 저장 전에 알려 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '신청만 받아 놓고 보낼 곳이 없으면 고객 경험이 끊깁니다. 신청 수를 재고 줄에 보여 줘 무엇부터 입고할지 정하게 하고, 재고를 넣으면 따로 버튼을 누르지 않아도 자동으로 문자가 나갑니다. 운영자가 모르는 사이 문자가 나가지 않게 저장 전 확인 팝업에 몇 명에게 언제 나가는지 적습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '재입고 알림은 광고성 문자입니다: 신청할 때 수신 동의를 받은 사람에게만, 제목에 (광고) 표기, 오후 9시 ~ 오전 8시에는 보내지 않습니다. 신청자 1명에게 1번만 보내고 보낸 뒤 신청은 끝납니다. 품목이 여러 개인 상품은 신청한 품목이 판매 가능해졌을 때만 나갑니다(박스 3개 입고로는 4박스 신청자에게 안 나감). 알림을 켜고 끄는 곳과 문구는 설정 > 알림입니다.'),
    Canvas({ label: 'A-23 · 재입고 신청 있음으로 거름 — 신청 수 열' }, restockBg),
    Canvas({ label: 'A-23 · 체험 3포 재고에 50개 더하기 → 저장 전 확인 팝업 (자동 발송 안내)' }, Overlay({ bg: restockBg, h: 600 },
        Modal({ title: '재고를 넣으면 재입고 알림이 나갑니다', w: 600, foot: [Btn('취소'), Btn('재고 넣고 14명에게 알림 보내기', 'primary')] },
            KV([['재고', '체험 3포 재고 0개 → <b>50개</b> (사유: 입고)'], ['판매상태', '품절 → 판매중 (자동)'], ['재입고 알림', '<b>신청 14명</b> 전원에게 문자 1번 · 보낸 뒤 신청 종료'], ['보내는 때', '지금(11-11 10:45) 바로']], { wide: true }),
            '<div style="height:12px"></div>',
            Box({ flat: true, title: '고객에게 가는 문자 미리보기', sub: '광고성 · 신청 때 수신 동의 받음' }, Text('(광고) [이너에라] 기다리시던 이너에라 롱지비티 체험 3포가 재입고되었습니다.<br>바로 가기: innerera.example/products/try3<br>무료수신거부 080-****-1234', { sm: true })),
            Note('신청자가 재고보다 많아도 전원에게 보냅니다 — 먼저 사는 순서대로 팔립니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '밤 9시 이후에 재고를 넣을 때 — 보내는 때가 달라짐', right: '팝업 일부', pad: 20 }, `<div style="width:520px">${KV([['재입고 알림', '<b>신청 14명</b>에게 문자 1번'], ['보내는 때', '<b>내일 오전 8:00</b> (오후 9시 ~ 오전 8시에는 광고성 문자를 보내지 않습니다)']], { wide: true })}${Note('그 사이 다시 품절되면 알림은 나가지 않고 신청이 그대로 남습니다.', { warn: true })}</div>`),
        Canvas({ size: 'auto', label: '저장 뒤 안내', right: '안내만', pad: 20 }, Toast('체험 3포 재고를 50개로 바꿨습니다. 재입고 알림 14명에게 문자를 보냈습니다.', { action: '발송 이력 보기' })),
    ),
    Canvas({ label: 'A-23 · 신청 수(14명)를 누름 → 신청자 목록 (오른쪽 드로어)' }, Overlay({ bg: restockBg, align: 'right', h: 520 },
        SideDrawer({ title: '재입고 알림 신청', sub: '롱지비티 체험 3포 · 14명', w: 600, foot: [Btn('엑셀 내려받기', { icon: 'download' })] },
            Table({ dense: true, cols: ['신청자', { t: '연락처', w: 120 }, { t: '신청일', w: 100 }, { t: '품목', w: 100 }, { t: '알림', w: 110 }], rows: [
                ['김민지<small>회원</small>', '010-****-1234', '11-09 09:12', '체험 3포', Badge('대기', 'dash')],
                ['박서준<small>회원</small>', '010-****-5821', '11-09 13:40', '체험 3포', Badge('대기', 'dash')],
                ['비회원', '010-****-7730', '11-10 08:05', '체험 3포', Badge('대기', 'dash')],
                { dim: true, c: ['이하은<small>회원</small>', '010-****-2204', '10-21 19:30', '체험 3포', '<small>10-25 발송 완료</small>'] },
            ] }),
            Note('연락처는 가려서 보여 줍니다. 엑셀로 내려받을 때는 사유를 적어야 하고 기록이 남습니다.'),
        ))),
    Canvas({ size: 'auto', label: '재입고 알림을 끈 몰(설정 > 알림) — 신청 수 열은 남고 자동 발송 안내만 바뀜', right: '팝업 일부', pad: 20 }, `<div style="width:520px">${Note('재입고 알림이 꺼져 있어 신청 14명에게 문자가 나가지 않습니다. 보내려면 설정 > 알림에서 재입고 알림을 켜 주세요.', { warn: true })}</div>`),
);

export default function A23() {
    return [state1, state2, state3, state4, state5, state6].join('');
}
