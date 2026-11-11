import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, ChannelBadge, Chips, Input, Select, Check, Radio, CheckGroup,
    FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Toast, SideDrawer,
    Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Thumb, Stats, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;

const ITEMS = [
    { p: P, o: '구성 1박스(14일분)', code: 'IE-LG-01', stock: 320, hold: 8, safe: 30, state: '판매중', ss: true, at: '11-11 09:42 · 주문 차감' },
    { p: P, o: '구성 2박스(28일분)', code: 'IE-LG-02', stock: 160, hold: 5, safe: 20, state: '판매중', ss: true, at: '11-11 09:31 · 스마트스토어 판매' },
    { p: P, o: '구성 4박스(56일분)', code: 'IE-LG-04', stock: 12, hold: 3, safe: 10, state: '판매중', ss: true, at: '11-11 09:18 · 주문 차감', low: true },
    { p: '롱지비티 선물 세트', o: '옵션 없음', code: 'IE-LG-GIFT', stock: 42, hold: 0, safe: 50, state: '판매중', ss: true, at: '11-10 20:11 · 주문 차감', low: true },
    { p: '롱지비티 체험 3포', o: '옵션 없음', code: 'IE-LG-TRY3', stock: 0, hold: 0, safe: 20, state: '품절', at: '11-09 08:03 · 주문 차감', out: true },
    { p: '스틱 보관 케이스', o: '색상 베이지', code: 'IE-AC-CASE-BE', stock: 64, hold: 1, safe: 10, state: '판매중', at: '11-08 15:20 · 수동 조정' },
    { p: '스틱 보관 케이스', o: '색상 차콜', code: 'IE-AC-CASE-CH', stock: 22, hold: 0, safe: 10, state: '판매중', at: '11-07 14:20 · 취소 원복' },
    { p: '이너에라 쇼핑백 (소)', o: '옵션 없음', code: 'IE-AC-BAG', stock: 400, hold: 2, safe: 50, state: '판매중', at: '10-30 11:15 · 수동 조정' },
];

const saleBadge = (s) => Badge(s, { 판매중: 'solid', 품절: 'strike', 판매중지: 'mute' }[s]);
const COLS = [{ t: '', w: 48 }, '상품명 · 옵션 값', { t: '관리코드', w: 120 }, { t: '현재 재고', w: 110, align: 'right', sort: 'asc' }, { t: '출고 대기', w: 76, align: 'right' }, { t: '판매 가능', w: 76, align: 'right' }, { t: '안전 재고', w: 100, align: 'right' }, { t: '판매상태', w: 80 }, { t: '마지막 변동', w: 150 }, { t: '', w: 54 }];
const row = (it, o = {}) => ({
    hl: it.low || it.out,
    ...o.row,
    c: [
        Thumb(36),
        `<u>${it.p}</u><small>${it.o}${it.ss ? ' · 스마트스토어와 함께 씀' : ''}</small>`,
        it.code,
        o.edit ? Input({ value: String(o.stock === undefined ? it.stock : o.stock), w: 90, suffix: '개', focus: o.focus, error: o.err }) + (o.err ? `<small><b>${o.err}</b></small>` : o.diff ? `<small><b>${o.diff}</b></small>` : '') : `<b>${it.stock}개</b>${it.out ? ` ${Badge('재고 0', 'strike')}` : it.low ? ` ${Badge('품절 임박', 'warn')}` : ''}`,
        `${it.hold}개`,
        `${it.stock - it.hold}개`,
        o.edit ? Input({ value: String(it.safe), w: 80, suffix: '개' }) : `${it.safe}개`,
        saleBadge(it.state),
        `<small style="color:var(--ink2)">${it.at}</small>`,
        `<u>이력</u>`,
    ],
});

const TABS = [{ t: '전체 품목', n: 8 }, { t: '품절 임박', n: 2 }, { t: '재고 0', n: 1 }];
const HeadActions = [Btn('엑셀로 재고 일괄 수정', { icon: 'file-upload-o' }), Btn('전체 재고 변동 이력', { icon: 'time-o' })];
const Page = (tab, ...body) => AdminLayout({ active: 'a-23', actions: HeadActions }, Tabs(TABS, tab), body);

const Summary = Stats([
    { k: '품목', v: '8개', sub: '상품 5개', icon: 'box' },
    { k: '재고 합', v: '1,020개', sub: '출고 대기 19개 제외 시 1,001개', icon: 'package' },
    { k: '품절 임박', v: '2개', sub: '안전 재고 이하', link: '품절 임박만 보기', icon: 'warning', on: true },
    { k: '재고 0', v: '1개', sub: '자동 품절 표시 중', link: '재고 0만 보기', icon: 'error-o' },
]);

const FRows = (o = {}) => [
    { k: '검색어', v: [Select({ value: '상품명 · 옵션 값', w: 160 }), Input({ value: o.q || '', placeholder: '상품명 · 옵션 값 · 관리코드 · 바코드 (여러 개는 쉼표나 줄바꿈)', icon: 'search', w: 440 })] },
    { k: '카테고리', v: Select({ placeholder: '카테고리 전체', w: 260 }) },
    { k: '재고 상태', v: CheckGroup(['품절 임박(안전 재고 이하)', '재고 0', '안전 재고 미설정', '재고 제한 없음 상품 포함'], o.low ? ['품절 임박(안전 재고 이하)'] : []) },
    { k: '판매상태 · 채널', v: [CheckGroup(['판매중', '품절', '판매중지'], ['판매중', '품절']), '<span style="color:var(--line)">|</span>', CheckGroup(['자사몰', '스마트스토어'], ['자사몰', '스마트스토어'])] },
];

const state1 = StateBlock({ idx: 1, title: '품목별 재고·안전재고', note: '한 줄 = 품목 한 개(상품명 + 옵션 값). 옵션이 없는 상품도 품목 1줄로 나옵니다. 현재 재고 · 출고 대기 · 판매 가능 · 안전 재고를 나란히 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '재고는 상품이 아니라 품목(1박스·2박스·4박스)마다 다릅니다. 창고 담당자는 상품 수정 화면을 하나씩 열지 않고 이 표 하나에서 모든 품목을 봅니다. 현재 재고에서 결제는 됐지만 아직 안 나간 수량(출고 대기)을 뺀 것이 실제로 더 팔 수 있는 수량(판매 가능)이라 둘을 나눠 보여 줍니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기 정렬: 현재 재고 적은 순 · 50개씩 · 판매중지 품목 제외. 스마트스토어와 재고를 함께 쓰는 품목은 여기서 바꾸면 스마트스토어 재고도 바로 전송됩니다. 재고 제한 없음으로 설정한 상품은 기본으로 목록에서 빠집니다. 안전 재고를 넣지 않은 품목은 품절 임박으로 잡히지 않습니다.'),
    Canvas({ label: 'A-23 · 전체 품목 탭 · 검색 조건 펼침' }, Page('전체 품목', Summary, '<div style="height:16px"></div>', Filters({ rows: FRows() }),
        ListHead({ total: 8, left: Text('재고가 적은 품목부터', { sm: true, mute: true }), right: [Btn('목록에서 바로 고치기', { size: 'sm', icon: 'pen-o' }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: COLS, rows: [...ITEMS].sort((a, b) => a.stock - b.stock).map((it) => row(it)) }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
);

const state2 = StateBlock({ idx: 2, title: '품절 임박 필터', note: '현재 재고가 안전 재고 이하인 품목만. 대시보드의 품절 임박 카드를 누르면 이 탭이 열립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '품절은 나고 나서 아는 것이 아니라 나기 전에 알아야 발주를 넣습니다. 품목마다 안전 재고를 정해 두면 그 아래로 내려간 것만 모아 보여 주고, 최근 7일 판매 속도로 며칠 뒤 품절될지 어림해 줍니다. 여기서 바로 입고 수량을 넣을 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '품절 임박이 되면 내부 수신자(설정 > 알림)에게 하루 한 번 모아서 알림이 갑니다. 며칠 뒤 품절은 어림값이며 최근 7일 판매가 없으면 표시하지 않습니다.'),
    Canvas({ label: 'A-23 · 품절 임박 탭 (대시보드 품절 임박 카드에서 들어옴)' }, Page('품절 임박', Filters({ open: false, summary: '재고 상태 품절 임박(안전 재고 이하)' }),
        ListHead({ total: 2, right: [Btn('엑셀 내려받기 (발주용)', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '', w: 48 }, '상품명 · 옵션 값', { t: '현재 재고', w: 90, align: 'right' }, { t: '안전 재고', w: 80, align: 'right' }, { t: '모자란 수량', w: 90, align: 'right' }, { t: '최근 7일 판매', w: 100, align: 'right' }, { t: '품절 예상', w: 120 }, { t: '입고 수량 넣기', w: 200 }], rows: [
            { hl: true, c: [Thumb(36), `<u>${P}</u><small>구성 4박스(56일분)</small>`, '<b>12개</b>', '10개', '-', '21개 (하루 3개)', `${Badge('약 4일 뒤', 'warn')}<small>11-15(일) 무렵</small>`, `${Input({ placeholder: '입고 수량', w: 100, suffix: '개' })} ${Btn('더하기', { size: 'sm' })}`] },
            { hl: true, c: [Thumb(36), '<u>롱지비티 선물 세트</u><small>옵션 없음</small>', '<b>42개</b>', '50개', '8개', '35개 (하루 5개)', `${Badge('약 8일 뒤', 'warn')}<small>11-19(목) 무렵</small>`, `${Input({ value: '100', w: 100, suffix: '개', focus: true })} ${Btn('더하기', { size: 'sm', kind: 'primary' })}`] },
        ] }),
        Note('입고 수량을 넣고 더하기를 누르면 현재 재고에 더해지고, 재고 변동 이력에 수동 조정 · 입고로 남습니다.'),
    )),
    Canvas({ label: 'A-23 · 재고 0 탭 — 재입고 알림 신청 수를 함께 보여 줌' }, Page('재고 0', Filters({ open: false, summary: '재고 상태 재고 0' }),
        ListHead({ total: 1, right: PerPage(50) }),
        Table({ check: true, cols: [{ t: '', w: 48 }, '상품명 · 옵션 값', { t: '재고 0이 된 때', w: 140 }, { t: '재입고 알림 신청', w: 120, align: 'right' }, { t: '판매상태', w: 90 }, { t: '입고 수량 넣기', w: 200 }], rows: [
            { hl: true, c: [Thumb(36), '<u>롱지비티 체험 3포</u><small>옵션 없음</small>', '11-09 08:03<small>주문 차감으로 0</small>', '14명', saleBadge('품절'), `${Input({ placeholder: '입고 수량', w: 100, suffix: '개' })} ${Btn('더하기', { size: 'sm' })}`] },
        ] }),
        Note('재고를 넣으면 자동으로 판매중으로 돌아가고, 재입고 알림을 신청한 14명에게 알림톡이 나갑니다(더하기를 누를 때 확인 팝업).'),
    )),
    Canvas({ label: 'A-23 · 품절 임박 품목이 없을 때' }, Page('품절 임박', Filters({ open: false, summary: '재고 상태 품절 임박(안전 재고 이하)' }),
        Empty({ icon: 'check-circle-o', title: '품절 임박 품목이 없습니다', desc: '모든 품목의 재고가 안전 재고보다 많습니다. 안전 재고를 넣지 않은 품목 2개는 여기에 잡히지 않습니다.', action: [Btn('안전 재고 미설정 품목 보기')] }))),
);

const STEPS = ['양식 내려받기', '엑셀 올리기', '검증 결과', '반영'];
const sorted = [...ITEMS].sort((a, b) => a.stock - b.stock);

const state3 = StateBlock({ idx: 3, title: '일괄 수정·엑셀', note: '목록에서 바로 고치기(칸이 입력칸으로 바뀜), 체크한 품목에 같은 수량 더하기·빼기, 엑셀로 한꺼번에 올리기 세 가지.' },
    Anno({ title: '왜 이렇게 하나' }, '입고 날에는 품목 수십 개의 숫자를 한 번에 고칩니다. 몇 개면 목록에서 바로 고치고 Enter로 다음 줄로 내려가고, 많으면 창고 엑셀을 양식에 붙여 올립니다. 고칠 때 재고를 덮어쓰는 방식(이 수량으로 맞추기)과 더하는 방식(입고 수량 더하기)을 분명히 나눕니다 — 고치는 사이에 주문이 들어와도 더하기는 어긋나지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '재고를 출고 대기 수량보다 적게 내릴 수 없습니다(이미 결제된 주문을 못 보내게 됨). 모든 수정은 사유와 함께 재고 변동 이력에 남습니다. 엑셀 규격: XLSX·XLS·CSV · 10MB · 5,000행 · 한 줄 = 품목 한 개.'),
    Canvas({ label: 'A-23 · 목록에서 바로 고치기 버튼 → 재고·안전 재고 칸이 입력칸으로 (바꾼 칸 · 입력 중 · 오류)' }, Page('전체 품목', Filters({ open: false, summary: '조건 없음' }),
        `<div class="wf-bulk">${Icon('pen-o')}<span class="cnt">바로 고치는 중 · 바꾼 품목 <b>2</b>개</span><span class="acts" style="align-items:center"><span style="color:var(--ink);display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap">${Select({ value: '사유: 입고', w: 150 })}</span>${Btn('바꾼 2개 저장', 'primary')}${Btn('취소', 'line')}</span><span class="clear">Enter = 다음 줄 · Tab = 옆 칸</span></div>`,
        Table({ cols: COLS, rows: [
            row(sorted[0], { edit: true, stock: 20, diff: '0 → 20 (+20)', row: { on: true } }),
            row(sorted[1], { edit: true, stock: 112, diff: '12 → 112 (+100)', row: { on: true } }),
            row(sorted[2], { edit: true, stock: 2, focus: true }),
            row(sorted[3], { edit: true }),
            row(sorted[4], { edit: true, stock: 0, err: '출고 대기 1개보다 적게 내릴 수 없습니다', row: { hl: true } }),
        ] }),
    )),
    Canvas({ label: 'A-23 · 3개 선택 → 일괄 처리 바 → 재고 변경 버튼 → 팝업' }, Overlay({ bg: Page('전체 품목', Filters({ open: false, summary: '조건 없음' }),
        BulkBar({ count: 3, sub: '롱지비티 석류맛 젤리스틱 3개 품목' }, Btn('재고 변경', 'primary'), Btn('안전 재고 변경', 'line'), Btn('판매상태 변경', 'line'), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' })),
        Table({ check: true, checked: [0, 1, 2], cols: COLS, rows: ITEMS.slice(0, 5).map((it) => row(it)) }),
    ), h: 600 },
        Modal({ title: '재고 변경 · 선택한 3개 품목', w: 600, foot: [Btn('취소'), Btn('3개 품목 재고 바꾸기', 'primary')] },
            FormTable([
                { k: '방법', required: true, v: [Radio('더하기', { on: true }), Radio('빼기'), Radio('이 수량으로 맞추기')] },
                { k: '수량', required: true, v: Input({ value: '200', w: 120, suffix: '개' }) },
                { k: '사유', required: true, v: Select({ value: '입고', w: 200 }) },
                { k: '메모', v: Input({ value: '11월 2차 생산분 입고', w: 340 }), help: '재고 변동 이력에 함께 남습니다.' },
            ]),
            '<div style="height:10px"></div>',
            Table({ dense: true, cols: ['품목', { t: '지금', w: 80, align: 'right' }, { t: '바뀐 뒤', w: 80, align: 'right' }], rows: [
                ['구성 1박스(14일분)', '320개', '<b>520개</b>'], ['구성 2박스(28일분)', '160개', '<b>360개</b>'], ['구성 4박스(56일분)', '12개', '<b>212개</b>'],
            ] }),
            Note('3개 품목 모두 스마트스토어와 재고를 함께 씁니다. 저장하면 스마트스토어 재고도 전송됩니다.', { warn: true }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '사유 칸을 누름', right: '입력칸만', pad: 20 }, `<div style="width:240px;min-height:270px">${Select({ value: '입고', w: 200, open: true, options: [{ t: '입고', on: true }, '재고 실사(세어 보니 다름)', '파손·폐기', '증정·샘플 출고', '반품 재입고', '기타(메모에 적기)'] })}</div>`),
        Canvas({ size: 'auto', label: '엑셀로 재고 일괄 수정 버튼 → 1단계', right: '팝업만', pad: 20 }, Modal({ title: '엑셀로 재고 일괄 수정', w: 600, foot: [Btn('닫기'), Btn('검증하기', { kind: 'primary', disabled: true })] },
            Stepper(STEPS, 0),
            FormTable([
                { k: '양식', v: [Btn('지금 재고가 채워진 양식 내려받기 (품목 8행)', { icon: 'file-download-o' })], help: '칸: 품목번호 · 상품명 · 옵션 값 · 관리코드 · 현재 재고 · 안전 재고. 품목번호 칸은 바꾸지 마세요.' },
                { k: '올린 숫자를', required: true, v: [Radio('이 수량으로 맞추기 (재고 실사)', { on: true }), Radio('현재 재고에 더하기 (입고)')] },
                { k: '품목을 찾는 기준', v: [Radio('품목번호', { on: true }), Radio('관리코드'), Radio('바코드')], help: '창고 엑셀에 품목번호가 없으면 관리코드나 바코드로 맞출 수 있습니다.' },
            ]),
            '<div style="height:10px"></div>',
            Upload({ title: '엑셀 파일을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · XLS · CSV', '용량 10MB 이하, 한 번에 5,000행까지', '재고 칸을 비운 줄은 건드리지 않습니다'] }),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '3단계 · 검증 결과 — 성공 6 · 오류 2', right: '팝업만', pad: 20 }, Modal({ title: '엑셀로 재고 일괄 수정', w: 720, foot: [Btn('오류 2행만 엑셀로 받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('성공 6행 반영', 'primary')] },
            Stepper(STEPS, 2),
            ExcelResult({ total: 8, ok: 6, fail: 2, keyLabel: '품목', rows: [
                { row: 5, key: '스틱 보관 케이스 · 색상 베이지', value: '0', reason: '출고 대기 1개보다 적게 내릴 수 없습니다. 1 이상으로 넣어 주세요' },
                { row: 9, key: 'IE-AC-BOX', value: '50', reason: '관리코드 IE-AC-BOX인 품목을 찾을 수 없습니다. 상품 수정에서 관리코드를 확인하세요' },
            ], note: '성공 6행: 재고가 늘어나는 품목 5개(+870개) · 줄어드는 품목 1개(-3개). 반영하면 재고 변동 이력에 수동 조정 · 엑셀 · 이보림으로 남습니다.' }),
        )),
        Canvas({ size: 'auto', label: '반영 완료 안내', right: '안내만', pad: 20 }, Toast('품목 6개의 재고를 바꿨습니다. 스마트스토어 3개 품목에도 전송했습니다.', { action: '변동 이력 보기' })),
    ),
);

const LOG_COLS = [{ t: '일시', w: 110, sort: 'desc' }, { t: '구분', w: 130 }, { t: '변동', w: 70, align: 'right' }, { t: '변동 뒤 재고', w: 90, align: 'right' }, '관련 주문 · 사유', { t: '누가', w: 110 }];
const LOGS = [
    ['11-11 09:18', Badge('주문 차감', 'line'), '-1', '12개', `<u>20261111-000127</u> ${ChannelBadge('자사몰')}<small>이하은 · 결제완료</small>`, '자동'],
    ['11-10 22:14', Badge('스마트스토어 판매', 'fill'), '-1', '13개', `<u>2026111045790022</u> ${ChannelBadge('스마트스토어')}<small>정수아 · 주문 수집 때 차감</small>`, '자동'],
    ['11-10 16:40', Badge('취소 원복', 'dash'), '+1', '14개', `<u>20261109-000071</u> ${ChannelBadge('자사몰')}<small>임재현 · 취소 승인</small>`, '운영자 정수아'],
    ['11-09 11:02', Badge('수동 조정', 'bold'), '-2', '13개', '파손·폐기<small>메모: 상자 찌그러짐 2개</small>', '운영자 이보림'],
    ['11-08 14:30', Badge('반품 재입고', 'dash'), '+1', '15개', `<u>20261102-000044</u> ${ChannelBadge('자사몰')}<small>윤서연 · 검수 통과(재판매 가능)</small>`, '운영자 정수아'],
    ['11-05 10:00', Badge('수동 조정', 'bold'), '+60', '14개 → 74개', '입고 · 엑셀<small>메모: 11월 1차 생산분 입고</small>', '운영자 이보림'],
];

const state4 = StateBlock({ idx: 4, title: '재고 변동 이력', note: '품목 줄의 이력을 누르면 오른쪽에서 열립니다. 재고가 언제 · 왜 · 누구에 의해 몇 개 바뀌었는지 한 줄씩 남습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '창고에서 센 수량과 화면 숫자가 다를 때 어디서 어긋났는지 찾을 수 있어야 합니다. 이력은 따로 메뉴를 만들지 않고 그 품목 안에서 봅니다. 구분은 주문 차감 · 취소 원복 · 반품 재입고 · 수동 조정 · 스마트스토어 판매로 나누고, 주문에서 생긴 변동은 주문번호를 눌러 주문 상세로 갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '이력은 고치거나 지울 수 없습니다. 틀렸으면 수동 조정으로 다시 맞춥니다. 재고가 빠지는 때는 결제 완료(가상계좌는 입금 확인) 시점이고, 취소 승인·입금 기한 만료 때 되돌아옵니다. 반품은 검수에서 재판매 가능으로 판정한 수량만 되돌아옵니다.'),
    Canvas({ label: 'A-23 · 4박스(56일분) 줄의 이력 → 오른쪽 드로어' }, Overlay({ bg: Page('전체 품목', Filters({ open: false, summary: '조건 없음' }), Table({ check: true, cols: COLS, rows: ITEMS.map((it) => row(it)) })), align: 'right', h: 800 },
        SideDrawer({ title: '재고 변동 이력', sub: `${P} · 구성 4박스(56일분)`, w: 760, foot: [Btn('엑셀 내려받기', { icon: 'download' }), Btn('재고 수동 조정', 'primary')] },
            KV([['현재 재고', '<b>12개</b> (출고 대기 3개 · 판매 가능 9개)'], ['안전 재고', '10개'], ['관리코드', 'IE-LG-04'], ['스마트스토어', '재고 함께 씀 · 마지막 전송 11-11 09:18 성공']], { wide: false }),
            '<div style="height:14px"></div>',
            Flex({ gap: 8, align: 'center' }, Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })),
            '<div style="height:8px"></div>',
            Chips(['전체 38', '주문 차감 24', '스마트스토어 판매 9', '취소 원복 2', '반품 재입고 1', '수동 조정 2'], '전체 38'),
            '<div style="height:10px"></div>',
            Table({ dense: true, cols: LOG_COLS, rows: LOGS }),
            Pager({ page: 1, last: 2 }),
        ))),
    Canvas({ label: 'A-23 · 전체 재고 변동 이력 버튼 → 모든 품목의 변동을 한 표로 (수동 조정만 거름)' }, AdminLayout({ active: 'a-23', title: '전체 재고 변동 이력', crumb: ['상품', '재고 관리', '전체 재고 변동 이력'], actions: [Btn('재고 관리로', { icon: 'angle-left-min' })] },
        Filters({ rows: [
            { k: '기간', v: Period({ preset: '7일' }) },
            { k: '구분', v: CheckGroup(['주문 차감', '취소 원복', '반품 재입고', '수동 조정', '스마트스토어 판매'], ['수동 조정']) },
            { k: '상품 · 품목', v: Input({ placeholder: '상품명 · 옵션 값 · 관리코드', icon: 'search', w: 360 }) },
            { k: '누가', v: Select({ value: '운영자 전체', w: 200 }) },
        ] }),
        ListHead({ total: 4, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: [{ t: '일시', w: 110, sort: 'desc' }, '상품명 · 옵션 값', { t: '구분', w: 110 }, { t: '변동', w: 70, align: 'right' }, { t: '변동 뒤 재고', w: 100, align: 'right' }, '사유 · 메모', { t: '누가', w: 110 }], rows: [
            ['11-09 11:02', `<u>${P}</u><small>구성 4박스(56일분)</small>`, Badge('수동 조정', 'bold'), '-2', '13개', '파손·폐기<small>상자 찌그러짐 2개</small>', '운영자 이보림'],
            ['11-08 15:20', '<u>스틱 보관 케이스</u><small>색상 베이지</small>', Badge('수동 조정', 'bold'), '+40', '65개', '입고', '운영자 정수아'],
            ['11-05 10:00', `<u>${P}</u><small>구성 4박스(56일분)</small>`, Badge('수동 조정', 'bold'), '+60', '74개', '입고 · 엑셀<small>11월 1차 생산분 입고</small>', '운영자 이보림'],
            ['11-05 10:00', `<u>${P}</u><small>구성 1박스(14일분)</small>`, Badge('수동 조정', 'bold'), '+300', '412개', '입고 · 엑셀<small>11월 1차 생산분 입고</small>', '운영자 이보림'],
        ] }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ size: 'auto', label: '변동이 한 번도 없는 새 품목의 이력', right: '드로어 안', pad: 20 }, `<div style="width:520px">${Empty({ icon: 'time-o', title: '아직 재고 변동이 없습니다', desc: '주문이 들어오거나 재고를 고치면 여기에 한 줄씩 남습니다.', action: [Btn('재고 수동 조정', 'primary')] })}</div>`),
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
    Canvas({ label: 'A-23 · 실물 재고 단위 보기(기본)' }, Page('전체 품목', Filters({ open: false, summary: '조건 없음' }),
        ListHead({ total: 5, left: [ViewSwitch('실물 재고 단위'), Chips(REAL_CHIPS, '전체 5')], right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: REAL_COLS, rows: [TRY_ROW, BOX_ROW(false), ...REAL_REST] }),
        Note('박스 재고 48박스 − 선점 6박스 = 42박스. 판매 가능 42박스가 안전재고 60박스 이하라서 품절 임박으로 표시됩니다.'),
    )),
    Canvas({ label: 'A-23 · 박스 재고 줄을 펼침 → 품목별 판매 가능 수량 · 선점 내용' }, Page('전체 품목', Filters({ open: false, summary: '조건 없음' }),
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
    Canvas({ label: 'A-23 · 품목 단위 보기로 바꿈 — 같은 재고를 쓰는 품목은 묶음 머리줄 아래에' }, Page('전체 품목', Filters({ open: false, summary: '조건 없음' }),
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

const restockBg = Page('전체 품목', Filters({ open: false, summary: '조건 없음' }),
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
