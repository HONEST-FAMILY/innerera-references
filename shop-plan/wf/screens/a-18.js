import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio,
    Textarea, FormTable, Filters, ListHead, PerPage, Table, Tabs, Timeline, Overlay, Modal, Confirm, SideDrawer, Toast, Box, KV, Note, Text, Icon, Flex, Grid, Thumb, PriceSummary, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };

const LIST_COLS = [{ t: '주문번호 · 주문일시', w: 148 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '수량', w: 44, align: 'center' }, { t: '주문자', w: 100 }, { t: '결제금액', w: 90, align: 'right' }, { t: '상태', w: 96 }];
const LIST = [
    ['20261111-000128', '11-11 09:42', '자사몰', O2, 1, '김민지', '93,000원', '결제완료'],
    ['2026111145821371', '11-11 09:31', '스마트스토어', O1, 2, '박서준', '98,000원', '결제완료'],
    ['20261110-000116', '11-10 15:02', '자사몰', O2, 1, '김민지', '88,725원', '배송준비'],
    ['20261110-000116', '11-10 15:02', '자사몰', O1, 1, '김민지', '47,275원', '취소완료'],
    ['20261109-000101', '11-09 14:27', '자사몰', O4, 1, '윤서연', '176,000원', '배송완료'],
];
const Bg = (on = 2) => AdminLayout({ active: 'a-10', counts: COUNTS },
    Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }),
    ListHead({ total: 468, right: PerPage(50) }),
    Table({ check: true, cols: LIST_COLS, rows: LIST.map((r, i) => ({ on: i === on, c: [`<u>${r[0]}</u><small>${r[1]}</small>`, ChannelBadge(r[2]), `${P}<small>${r[3]}</small>`, r[4], r[5], r[6], OrderBadge(r[7])] })) }),
);

const SEC_NAME = { '주문 정보': '주문 상품', 결제: '결제·환불', 클레임: '클레임 이력', '관리자 메모': '관리자 메모', '알림 발송': '알림 발송 이력', '처리 기록': '처리 기록' };
const Sec = (name, n) => `<div style="display:flex;align-items:center;gap:8px;font-weight:800;font-size:14.5px;margin:22px 0 10px;padding-top:14px;border-top:2px solid var(--dark)">${name}${n !== undefined ? `<span style="font-size:12px;font-weight:700;border:1px solid var(--line);border-radius:10px;padding:0 8px;color:var(--ink2)">${n}</span>` : ''}</div>`;
const DTABS = (active) => Sec(SEC_NAME[active] || active);

const Head = (o = {}) => `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:12px">${ChannelBadge(o.ch || '자사몰')}<b style="font-size:15px">${o.name || '김민지'}</b><span style="font-size:12.5px;color:var(--mute)">${o.meta || '회원 · 일반 등급 · 주문 4번째'}</span><u style="font-size:12.5px">회원 상세</u><span style="margin-left:auto;font-size:12.5px;color:var(--ink2)">${o.at || '주문 2026-11-10 15:02'}</span></div>`;

const ItemRow = (o) => `
<div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--line2)${o.dim ? ';color:#a2a2aa' : ''}">
  ${Thumb(52)}
  <div style="flex:1;min-width:0;font-size:13px"><b>${P}</b><div style="color:var(--mute);font-size:12.5px">${o.opt} · ${o.qty}개 · ${o.price}</div><div style="margin-top:4px;font-size:12px;color:var(--ink2)">${o.info}</div></div>
  <div style="flex:none;text-align:right">${OrderBadge(o.st)}<div style="margin-top:8px;display:flex;gap:4px;justify-content:flex-end;flex-wrap:wrap;max-width:230px">${(o.btns || []).join('')}</div></div>
</div>`;

const b = (t, kind) => Btn(t, { size: 'sm', kind });

const infoTab = (o = {}) => [
    Head(o.head),
    o.top || '',
    Sec('주문 상품'),
    Box({ title: '주문 품목', sub: o.itemSub || '품목 2개 · 품목마다 상태가 따로 움직입니다' }, (o.items || [
        { opt: O2, qty: 1, price: '93,000원', st: '배송준비', info: '발주확인 11-10 16:10 (이보림) · 발송 기한 11-12(목) · 송장 미입력', btns: [b('송장 입력', 'primary'), b('발송 지연'), b('판매자 취소')] },
        { opt: O1, qty: 1, price: '49,000원', st: '취소완료', info: '취소 승인 11-11 10:14 (이보림) · 환불 47,275원 · 적립금 690원 반환', btns: [b('취소 내역')], dim: true },
    ]).map(ItemRow)),
    o.mid || '',
    Sec('주문자·배송지'),
    Grid(2,
        Box({ title: '주문자', right: o.ss ? '' : Btn('문자 보내기', { size: 'sm', icon: 'send' }) }, KV(o.buyer || [['이름', '김민지'], ['연락처', '010-****-1234 <u>전체 보기</u>'], ['이메일', 'minji@*****.com']])),
        Box({ title: '배송지', right: o.addrBtn === undefined ? Btn('배송지 수정', { size: 'sm', icon: 'pen-o' }) : o.addrBtn }, KV(o.addr || [['받는 분', '김민지'], ['연락처', '010-****-1234'], ['주소', '(03925) 서울 마포구 월드컵북로 *** 101동 1203호'], ['배송 메모', '문 앞에 놓아 주세요'], ['공동현관', '#1203*']])),
    ),
    o.bottom || '',
];

const drawer = (o, ...body) => SideDrawer({ title: '주문 상세', sub: o.sub || '20261110-000116', w: o.w || 760, foot: o.foot === undefined ? [Btn('주문서 출력', { icon: 'print' }), Btn('새 창으로 열기', { icon: 'external-link' }), Btn('닫기', 'primary')] : o.foot }, body);

const payTab = [
    Head(), DTABS('결제'),
    Grid('1fr 300px',
        Box({ title: '결제 정보' }, KV([
            ['결제수단', '신용카드 · 현대카드 (일시불)'], ['결제 일시', '2026-11-10 15:02:41'], ['결제 대행사', '토스페이먼츠 (결제 연결: 포트원)'],
            ['거래번호', 'T2026111015020116 <u>복사</u>'], ['승인번호', '30418822'], ['영수증', '<u>카드 전표 보기</u>'],
        ], { wide: true })),
        PriceSummary({ title: '결제 금액', rows: [['상품 금액', '142,000원'], ['쿠폰 할인', '- 3,000원', '가입 축하 3,000원'], ['적립금 사용', '- 2,000원'], ['배송비', '0원', '5만원 이상 무료']], total: ['처음 결제한 금액', '137,000원'] }),
    ),
    Box({ title: '부분 취소·환불 이력', sub: '1건 · 지금 남은 결제 금액 89,725원' },
        Table({ dense: true, cols: [{ t: '일시', w: 120 }, { t: '구분', w: 90 }, '내용', { t: '금액', w: 90, align: 'right' }, { t: '결과', w: 80 }], rows: [
            ['11-10 15:02:41', '결제', '신용카드 승인<small>T2026111015020116</small>', '137,000원', Badge('성공', 'check')],
            ['11-11 10:14:08', '부분 취소', `${O1} 1개 취소 · 쿠폰 1,035원 · 적립금 690원 나눠 뺌<small>T2026111015020116-C1</small>`, '- 47,275원', Badge('성공', 'check')],
        ], foot: ['', '', '남은 결제 금액', '89,725원', ''] }),
    ),
    Grid(2,
        Box({ title: '쓴 혜택' }, KV([['쿠폰', '가입 축하 3,000원 (부분 취소 뒤에도 사용 유지)'], ['적립금', '2,000원 사용 → 690원 반환 · 지금 1,310원 사용'], ['적립 예정', '887원 (구매확정 때 지급)']])),
        Box({ title: '증빙' }, KV([['현금영수증', '해당 없음 (카드 결제)'], ['세금계산서', '신청 없음']])),
    ),
    Note('금액은 예시 값입니다(판매가 미확정). 결제 대행사에 문의할 때는 거래번호를 알려 주세요. 적립금·쿠폰을 끈 몰은 쓴 혜택 상자가 없습니다.'),
];

const addrModal = (o = {}) => Modal({ title: '배송지 수정 · 20261110-000116', w: 600, foot: [Btn('취소'), Btn('저장', { kind: 'primary', disabled: o.disabled })] },
    o.top || '',
    FormTable([
        { k: '받는 분', required: true, v: Input({ value: '김민지', w: 200 }) },
        { k: '연락처', required: true, v: Input({ value: o.tel === undefined ? '010-2345-1234' : o.tel, w: 200, error: !!o.telErr }), error: o.telErr },
        { k: '주소', required: true, v: [Input({ value: '03925', w: 90 }), Btn('주소 검색', { size: 'sm', icon: 'search' }), `<div style="height:6px;width:100%"></div>`, Input({ value: '서울 마포구 월드컵북로 ***', w: 400, disabled: true }), `<div style="height:6px;width:100%"></div>`, Input({ value: '101동 1203호', w: 400, focus: true })] },
        { k: '배송 메모', v: Input({ value: '문 앞에 놓아 주세요', w: 400 }) },
        { k: '수정 사유', required: true, v: Select({ value: '고객 요청(전화)', w: 220 }) },
        { k: '고객 알림', v: Check('바뀐 배송지 안내 보내기', { on: true }) },
    ]),
    o.bottom || '',
);

const memoTab = (o = {}) => [
    Head(), DTABS('관리자 메모'),
    Box({ title: '메모 쓰기', sub: '고객에게 보이지 않습니다' },
        Textarea({ value: o.draft, placeholder: '이 주문에 대해 다른 운영자가 알아야 할 내용을 남기세요', h: 72, count: o.draft ? '34 / 500' : '0 / 500' }),
        Flex({ gap: 12, mt: 8, align: 'center', justify: 'space-between' }, Check('중요 (목록의 주문번호 옆에 메모 표시)', { on: !!o.draft }), Btn('메모 남기기', { kind: 'primary', size: 'sm', disabled: !o.draft })),
    ),
    o.empty ? Box({}, Text('아직 남긴 메모가 없습니다.', { mute: true, sm: true })) : [
        Box({ flat: true }, `<div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink2);margin-bottom:4px"><span><b>이보림</b> (대표 운영자) · 2026-11-11 10:20 ${Badge('중요', 'bold')}</span><span><u>고치기</u> · <u>지우기</u></span></div>`, Text('1박스 취소 승인함. 남은 2박스는 11-11 오후 출고분에 포함. 사은품 스티커 같이 넣기.', { sm: true })),
        Box({ flat: true }, `<div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink2);margin-bottom:4px"><span><b>정하윤</b> (고객응대 담당) · 2026-11-10 16:35</span><span style="color:var(--mute)">다른 사람 메모는 고칠 수 없음</span></div>`, Text('고객 전화: 수량을 잘못 골랐다고 함. 마이페이지에서 취소 요청하도록 안내함.', { sm: true })),
    ],
];

const NOTI = [
    ['11-11 10:14', '취소 완료 · 환불 안내', '알림톡', '성공', '010-****-1234'],
    ['11-10 16:25', '취소 요청 접수', '알림톡', '성공', '010-****-1234'],
    ['11-10 16:10', '상품 준비 중', '알림톡 → 문자', '알림톡 실패 → 문자 성공', '010-****-1234'],
    ['11-10 15:03', '주문 완료', '이메일', '성공', 'minji@*****.com'],
    ['11-10 15:02', '주문 완료', '알림톡', '성공', '010-****-1234'],
];
const notiTab = [
    Head(), DTABS('알림 발송'),
    ListHead({ total: 5, left: Chips(['전체 5', '성공 5', '실패 0'], '전체 5'), right: Btn('알림 직접 보내기', { size: 'sm', icon: 'send' }) }),
    Table({ dense: true, cols: [{ t: '보낸 시각', w: 100 }, '알림', { t: '수단', w: 110 }, { t: '결과', w: 190 }, { t: '받는 곳', w: 130 }, { t: '', w: 100 }], rows: NOTI.map((n) => [n[0], `<u>${n[1]}</u>`, n[2], n[3].includes('실패') ? Badge(n[3], 'warn') : Badge(n[3], 'check'), `<small>${n[4]}</small>`, Btn('다시 보내기', { size: 'sm' })]) }),
    Note('알림 이름을 누르면 실제로 나간 문장을 볼 수 있습니다. 알림톡이 실패하면 문자로 한 번 더 보냅니다(설정 > 알림). 운영자에게 간 내부 알림(신규 주문 · 취소 요청)은 여기에 나오지 않습니다.'),
];

const LOG = [
    { t: '취소 승인 · 환불', d: `이보림 · ${O1} 1개 · 신용카드 부분 취소 47,275원 성공 · 적립금 690원 반환 · 재고 +1`, time: '11-11 10:14', on: true },
    { t: '관리자 메모 작성', d: '이보림 · 중요', time: '11-11 10:20' },
    { t: '취소 요청 접수', d: `고객(김민지) · 마이페이지 · ${O1} 1개 · 사유 단순 변심`, time: '11-10 16:20' },
    { t: '배송지 수정', d: '정하윤 · 상세 주소 101동 1203 → 101동 1203호 · 사유 고객 요청(전화) · 고객 알림 보냄', time: '11-10 16:32' },
    { t: '발주확인', d: '이보림 · 일괄 발주확인(38건 중 하나) · 품목 2개 배송준비로', time: '11-10 16:10' },
    { t: '결제 완료', d: '자동 · 신용카드 137,000원 · 거래번호 T2026111015020116', time: '11-10 15:02' },
    { t: '주문 접수', d: '고객(김민지) · 자사몰 · 모바일 · 접속 IP 211.***.***.45', time: '11-10 15:02' },
];

const claimSec = [
    DTABS('클레임'),
    Box({ title: `취소 · ${O1} 1개`, sub: '취소완료', right: Btn('취소 관리에서 보기', { size: 'sm' }) },
        Timeline([
            { t: '환불 완료', d: '신용카드 부분 취소 47,275원 성공 · 적립금 690원 반환 · 고객 알림 성공', time: '11-11 10:14', on: true },
            { t: '취소 승인', d: '이보림 · 재고 +1', time: '11-11 10:14' },
            { t: '취소 요청', d: '고객 · 사유 단순 변심 · 수량을 잘못 골랐어요. 1박스는 빼 주세요.', time: '11-10 16:20' },
        ])),
    Note('반품·교환이 있으면 같은 모양의 상자가 아래로 쌓입니다(회수 송장 · 검수 결과 · 환불 계산 · 재발송 송장 포함). 거부한 요청도 사유와 함께 남습니다.'),
    Box({ flat: true, title: '운영자가 대신 접수하기' }, Flex({ gap: 8 }, Btn('취소 접수', { size: 'sm' }), Btn('반품 접수', { size: 'sm', disabled: true }), Btn('교환 접수', { size: 'sm', disabled: true })), Text('반품·교환은 배송완료된 품목이 있어야 접수할 수 있습니다.', { sm: true, mute: true })),
];
const logSec = [
    DTABS('처리 기록'),
    ListHead({ left: Chips(['전체', '운영자가 한 일', '고객이 한 일', '자동'], '전체'), right: Btn('엑셀 내려받기', { size: 'sm', icon: 'download' }) }),
    Timeline(LOG),
    Note('처리 기록은 고치거나 지울 수 없습니다. 개인정보 전체 보기 · 엑셀 내려받기처럼 주문을 바꾸지 않은 열람도 설정 > 운영자·권한의 작업 기록에 따로 남습니다.'),
];

const state1 = StateBlock({ idx: 1, title: '오른쪽 드로어(목록에서 클릭)', note: '주문 목록 어디서든(전체 주문 조회 · 발주 확인 · 취소·반품·교환 관리 · 대시보드 최근 주문) 주문번호를 누르면 목록 위로 오른쪽에서 열립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '주문 한 건을 보려고 화면을 옮기면 보던 목록의 검색 조건과 위치를 잃습니다. 그래서 상세는 별도 화면이 아니라 넓은 오른쪽 드로어(760)로 열고, 닫으면 목록이 그대로 있습니다. 드로어 안은 탭으로 나누지 않고 주문 상품 → 결제·환불 → 주문자·배송지 → 클레임 이력 → 관리자 메모 → 알림 발송 이력 → 처리 기록 순서로 전부 펼쳐 두고 스크롤합니다(구역 순서는 고정). 탭을 눌러야 보이는 내용은 통화 중에 놓치기 쉽고, 이 주문에 딸린 모든 이력을 다른 메뉴로 가지 않고 한 번에 훑을 수 있어야 하기 때문입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '드로어가 열린 채로 목록의 다른 주문번호를 누르면 내용만 바뀝니다(위아래 화살표 키로도 이동). 주소 /admin/orders/{주문번호} 로 직접 들어오면(알림의 주소 · 새 창으로 열기) 전체 주문 조회 위에 이 드로어가 열린 상태로 시작합니다. 연락처·이메일은 가려서 보여 주고 전체 보기를 누르면 누가 봤는지 기록됩니다. 권한이 없는 운영자에게는 전체 보기가 없습니다.'),
    Canvas({ label: 'A-18 · 전체 주문 조회에서 주문번호를 누름 → 오른쪽 드로어 · 모든 구역이 펼쳐진 한 화면(스크롤) · 품목 2개, 하나는 부분 취소됨' }, Overlay({ bg: Bg(2), align: 'right', h: 3000 }, drawer({}, infoTab({ mid: payTab.slice(1) }), claimSec, memoTab().slice(1), notiTab.slice(1), logSec))),
    CanvasRow(
        Canvas({ size: 'auto', label: '드로어 머리 · 주문 이동과 닫기', right: '부분', pad: 20 }, `<div style="width:560px">${Box({ flat: true }, Text(`${Icon('angle-up-min')} ${Icon('angle-down-min')} 목록의 앞·뒤 주문으로 이동 (5건 중 3번째)<br>${Icon('external-link')} 새 창으로 열기 → 주소 <code>/admin/orders/20261110-000116</code><br>${Icon('close')} 닫기 · 바깥(어두운 곳)을 눌러도 닫힘 · 수정하던 내용이 있으면 닫기 전에 물어봄`, { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '없는 주문번호로 직접 들어왔을 때', right: '드로어 안', pad: 20 }, `<div style="width:420px">${Box({}, Text(`${Icon('error-o')} <b>주문 20261110-999999 를 찾을 수 없습니다</b><br>주문번호를 다시 확인하세요. 스마트스토어 주문은 가져오기 전이면 보이지 않습니다.`, { sm: true }), Flex({ gap: 8, mt: 8 }, Btn('전체 주문 조회로', { kind: 'primary', size: 'sm' }), Btn('스마트스토어 주문 지금 가져오기', { size: 'sm' })))}</div>`),
    ),
);

const state2 = StateBlock({ idx: 2, title: '품목별 상태·결제·배송지 수정·클레임 이력·관리자 메모·알림 발송 이력·처리 기록', note: '드로어 안의 구역을 하나씩 자세히 그립니다. 주문 상품 구역의 품목별 처리 버튼, 배송지 수정, 그리고 결제·환불 · 클레임 이력 · 관리자 메모 · 알림 발송 이력 · 처리 기록 구역입니다(실제 화면에서는 1번 상태처럼 한 드로어 안에 모두 펼쳐져 있습니다).' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 전화하면 운영자는 이 드로어 하나로 답해야 합니다. 지금 어디까지 갔나(품목별 상태), 얼마를 냈고 얼마가 환불됐나(결제 · 부분 취소 이력), 취소·반품은 어떻게 됐나(클레임), 지난번 통화에서 뭐라고 했나(관리자 메모), 안내 문자가 갔나(알림 발송), 누가 무엇을 바꿨나(처리 기록). 품목마다 지금 상태에서 할 수 있는 처리만 버튼으로 나옵니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '배송지는 배송준비 전(결제완료까지)에는 자유롭게, 배송준비(발주확인) 뒤 송장 입력 전에는 경고와 함께, 발송한 뒤에는 고칠 수 없습니다(택배사에 직접 연락). 주소가 바뀌어 제주·도서산간 추가 배송비가 생기면 저장 전에 알려 줍니다. 처리 기록은 지우거나 고칠 수 없습니다. 메모는 쓴 사람만 고치고 지울 수 있고, 지워도 처리 기록에 남습니다.'),
    Canvas({ size: 'auto', label: '품목 상태별 처리 버튼 (주문 상품 구역의 품목 줄 · 상태마다 버튼이 다름)', right: '기준 표', pad: 20 }, `<div style="width:1180px">${Table({ dense: true, cols: [{ t: '품목 상태', w: 110 }, { t: '품목 줄의 버튼', w: 330 }, '줄 아래 안내 글', { t: '배송지 수정', w: 200 }], rows: [
        [OrderBadge('입금대기'), `${b('입금 확인', 'primary')} ${b('입금 기한 늘리기')} ${b('주문 취소')}`, '입금 기한 11-12 23:59 · 남은 시간 1일 13시간 · 가상계좌 국민 9012-****-3381', '할 수 있음'],
        [OrderBadge('결제완료'), `${b('발주확인', 'primary')} ${b('발송 지연')} ${b('판매자 취소')}`, '결제 11-11 09:42 · 발송 기한 11-13(금) · 고객이 바로 취소할 수 있는 단계', '할 수 있음'],
        [OrderBadge('배송준비'), `${b('송장 입력', 'primary')} ${b('발송 지연')} ${b('판매자 취소')}`, '발주확인 11-10 16:10 (이보림) · 발송 기한 11-12(목) · 송장 미입력', '할 수 있음 (경고 뜸)'],
        [OrderBadge('배송중'), `${b('배송 추적', 'primary')} ${b('송장 수정')} ${b('배송완료 처리')}`, 'CJ대한통운 581233441188 · 배송 출발 11-11 08:20 · 발송 뒤 1일째', '할 수 없음 (택배사 연락)'],
        [OrderBadge('배송완료'), `${b('구매확정 처리', 'primary')} ${b('반품 접수')} ${b('교환 접수')}`, '배송완료 11-10 14:22 · 문 앞 · 자동 구매확정 예정 11-17', '할 수 없음'],
        [OrderBadge('구매확정'), `${b('리뷰 요청 보내기')} ${b('직권 반품 접수')} ${b('직권 교환 접수')}`, '구매확정 11-10 09:14 (고객) · 적립금 980원 지급 · 확정은 되돌릴 수 없고, 고객은 반품·교환을 신청할 수 없어 운영자 직권 접수만 가능', '할 수 없음'],
        [OrderBadge('취소요청'), `${b('취소 승인', 'primary')} ${b('취소 거부')}`, '요청 11-10 16:20 · 사유 단순 변심 · 17시간째', '할 수 없음 (요청 처리 뒤)'],
        [OrderBadge('반품요청'), `${b('수거 지시', 'primary')} ${b('반품 거부')}`, '요청 11-10 19:40 · 사유 단순 변심 · 고객 부담 · 판매자 회수 요청', '회수지 고치기만'],
        [OrderBadge('수거중'), `${b('회수 추적', 'primary')} ${b('수거완료 처리')}`, '회수 CJ대한통운 690012345401 · 회수 접수 11-10 14:00', '회수지 고치기만'],
        [OrderBadge('수거완료'), `${b('검수하기', 'primary')}`, '반품지 도착 11-10 15:30 · 검수 대기 1일째', '할 수 없음'],
        [OrderBadge('교환요청'), `${b('수거 지시', 'primary')} ${b('교환 거부')}`, `요청 11-10 20:15 · 상품 불량 · 바꿔 받을 구성 ${O1} (판매 가능 42건)`, '재발송 받을 곳 고치기'],
        [OrderBadge('재발송'), `${b('배송 추적', 'primary')} ${b('송장 수정')}`, '재발송 CJ대한통운 581233441377 · 집화 완료 11-11 17:40', '할 수 없음'],
        [`${OrderBadge('취소완료')} ${OrderBadge('반품완료')} ${OrderBadge('교환완료')}`, `${b('내역 보기')}`, '끝난 품목은 흐리게 · 환불 금액과 일시', '할 수 없음'],
    ] })}${Note('고객이 직접 신청하지 않고 전화로 요청한 취소·반품·교환은 운영자가 품목 줄의 판매자 취소 · 반품 접수 · 교환 접수로 대신 넣습니다. 넣으면 각 관리 화면의 요청 탭으로 들어갑니다.')}</div>`),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문자·배송지 구역 · 배송지 수정 버튼 → 팝업 (배송준비 단계 · 경고)', right: '팝업만', pad: 20 }, addrModal({ top: Note('이미 발주확인한 주문입니다. 송장을 출력했다면 포장 담당자에게 바뀐 주소를 꼭 알려 주세요.', { warn: true }) })),
        Canvas({ size: 'auto', label: '입력 오류 + 주소가 제주로 바뀌어 추가 배송비가 생길 때', right: '팝업만', pad: 20 }, addrModal({ tel: '010-2345-12', telErr: '휴대폰 번호를 끝까지 넣어 주세요. (예: 010-2345-1234)', disabled: true,
            bottom: Box({ flat: true, title: '추가 배송비 3,000원이 생깁니다', sub: '제주 지역' }, FormTable([{ k: '추가 배송비', required: true, v: [Radio('고객에게 결제 주소 보내기 (결제되면 배송지 바뀜)', { on: true }), Radio('받지 않기 (판매자가 냄)')] }])) })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '발송한 뒤의 배송지 상자 (수정 버튼 대신 안내)', right: '부분', pad: 20 }, `<div style="width:380px">${Box({ title: '배송지', right: Btn('배송지 수정', { size: 'sm', icon: 'pen-o', disabled: true }) }, KV([['받는 분', '윤서연'], ['주소', '(48058) 부산 해운대구 센텀중앙로 ***']]), Note('이미 발송해 여기서 고칠 수 없습니다. 택배사(CJ대한통운 1588-1255)에 송장번호 581233441188 로 주소 변경을 요청하세요.'))}</div>`),
        Canvas({ size: 'auto', label: '품목 줄의 송장 입력 → 그 자리에서 입력 (한 건만 급히 보낼 때)', right: '부분', pad: 20 }, `<div style="width:520px">${Box({ flat: true }, Flex({ gap: 8, align: 'center' }, Select({ value: 'CJ대한통운', w: 130 }), Input({ value: '581233441', w: 180, focus: true }), Btn('발송처리', { kind: 'primary', size: 'sm' }), Btn('취소', { size: 'sm' })), Text('발송처리하면 배송중으로 바뀌고 고객에게 발송 안내가 갑니다. 여러 건은 발주 확인·발송 처리에서 엑셀로 올리세요.', { sm: true, mute: true }))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '결제·환불 구역 (거래번호 · 부분 취소 이력)', right: '드로어만', pad: 0 }, drawer({}, payTab)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '클레임 이력 구역 (이 주문의 취소·반품·교환 이력)', right: '드로어만', pad: 0 }, drawer({}, Head(), claimSec)),
        Canvas({ size: 'auto', label: '클레임이 없는 주문', right: '구역 내용만', pad: 20 }, `<div style="width:400px">${Box({}, Text(`${Icon('check-circle-o')} <b>취소·반품·교환 이력 없음</b>`, { sm: true }), Text('고객이 전화로 요청했다면 주문 상품 구역의 품목 줄에서 대신 접수할 수 있습니다.', { sm: true, mute: true }))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '관리자 메모 구역 (작성자 · 시각 · 내 메모만 고치기)', right: '드로어만', pad: 0 }, drawer({ w: 640 }, memoTab())),
        Canvas({ size: 'auto', label: '메모 쓰는 중 · 메모가 없는 주문', right: '드로어만', pad: 0 }, drawer({ w: 640 }, memoTab({ draft: '고객 재통화: 오후 3시 이후 배송 희망. 택배사에 전달함.', empty: true }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '알림 발송 이력 구역 (알림톡 · 문자 · 이메일 성공/실패)', right: '드로어만', pad: 0 }, drawer({}, notiTab)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '알림 이름을 누름 → 실제 나간 문장', right: '팝업만', pad: 20 },
            Modal({ title: '상품 준비 중 · 11-10 16:10', w: 440, foot: [Btn('닫기'), Btn('다시 보내기', 'primary')] },
                KV([['1차', `알림톡 ${Badge('실패', 'warn')} 수신 거부(카카오톡 미사용)`], ['2차', `문자 ${Badge('성공', 'check')} 16:10:42`], ['받는 번호', '010-****-1234']]),
                '<div style="height:10px"></div>',
                Box({ flat: true }, Text('[이너에라] 김민지 님, 주문하신 상품을 준비하고 있습니다.<br>주문번호 20261110-000116<br>발송되면 송장번호를 알려 드리겠습니다.', { sm: true })),
            )),
        Canvas({ size: 'auto', label: '알림 직접 보내기 → 팝업 (정해진 알림 고르기 · 자유 문자)', right: '팝업만', pad: 20 },
            Modal({ title: '알림 직접 보내기', w: 480, foot: [Btn('취소'), Btn('보내기', 'primary')] },
                FormTable([
                    { k: '보낼 알림', required: true, v: Select({ value: '직접 쓰기(문자)', w: 240, open: true, options: ['주문 완료 다시 보내기', '발송 안내 다시 보내기', '입금 안내 다시 보내기', { t: '직접 쓰기(문자)', on: true }] }) },
                    { k: '내용', required: true, v: Textarea({ value: '[이너에라] 김민지 님, 요청하신 대로 오후 3시 이후 배송되도록 택배사에 전달했습니다.', h: 72, count: '48 / 90자 (단문)' }), help: '직접 쓴 문자는 광고성 내용을 넣을 수 없습니다. 보낸 내용은 알림 발송 이력에 남습니다.' },
                ]),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '처리 기록 구역 (누가 · 언제 · 무엇을 — 지울 수 없음)', right: '드로어만', pad: 0 }, drawer({}, Head(), logSec)),
    ),
);

const ssItems = [
    { opt: O1, qty: 2, price: '98,000원', st: '결제완료', info: '상품주문번호 2026111145821371-01 · 발송 기한 11-13(금) · 네이버 기준', btns: [b('발주확인', 'primary'), b('발송 지연'), b('판매자 취소')] },
];

const state3 = StateBlock({ idx: 3, title: '스마트스토어 주문 표시', note: '채널이 스마트스토어인 주문의 드로어. 같은 틀을 쓰되 네이버 주문번호를 보여 주고, 여기서 한 처리가 네이버로 전송된다는 것과 네이버에서만 할 수 있는 일을 알려 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '스마트스토어 주문도 우리 관리자에서 똑같이 처리하게 하는 것이 연동의 목적입니다. 다만 운영자가 착각하면 안 되는 차이가 있습니다. 결제와 환불은 네이버가 하고(거래번호 · 환불 계산 없음), 고객 연락처는 안심번호이고, 우리 알림톡은 나가지 않으며, 우리가 한 발주확인·발송·취소 승인은 네이버로 전송되어야 끝납니다. 이 차이를 드로어 맨 위 띠와 각 구역에서 분명히 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '네이버 전송이 실패한 처리는 우리 쪽만 바뀐 채 남으면 안 됩니다. 품목 줄과 처리 기록에 전송 결과(성공 · 실패 · 다시 보내기)를 붙입니다. 배송지 수정 · 구매확정 · 가격 변경은 네이버에서만 할 수 있어 버튼 대신 스마트스토어 판매자센터로 가는 주소를 둡니다. 스마트스토어 연동을 끈 몰에는 이 상태가 없습니다.'),
    Canvas({ label: 'A-18 · 스마트스토어 주문을 누름 → 드로어 (맨 위 띠 · 스마트스토어 주문번호 · 안심번호 · 아래 구역은 같은 순서로 이어짐)' }, Overlay({ bg: Bg(1), align: 'right', h: 860 }, drawer({ sub: '2026111145821371' },
        infoTab({
            head: { ch: '스마트스토어', name: '박서준', meta: '네이버 구매자 · 우리 몰 회원 아님', at: '주문 2026-11-11 09:31' },
            tabs: { claim: 0, memo: 0, noti: 0 },
            top: `<div style="display:flex;gap:10px;align-items:flex-start;border:2px solid var(--dark);border-radius:6px;padding:12px 14px;margin-bottom:14px;font-size:13px">${Icon('naver-square')}<div><b>스마트스토어 주문입니다 · 변경은 스마트스토어로 전송됩니다</b><br>스마트스토어 주문번호 <b>2026111145821371</b> <u>복사</u> · 마지막으로 가져온 시각 11-11 10:00 · <u>스마트스토어 판매자센터에서 열기</u><br><span style="color:var(--ink2)">여기서 하는 발주확인 · 발송처리 · 발송 지연 · 취소·반품·교환 승인과 거부가 네이버로 전송됩니다. 결제와 환불은 네이버가 합니다.</span></div></div>`,
            itemSub: '품목 1개 · 스마트스토어 상품주문번호 단위',
            items: ssItems,
            buyer: [['이름', '박서준'], ['연락처', `0504-****-5821 ${Badge('안심번호', 'line')}`], ['네이버 아이디', 'seo****']],
            addr: [['받는 분', '박서준'], ['연락처', `0504-****-5821 ${Badge('안심번호', 'line')}`], ['주소', '(13529) 경기 성남시 분당구 판교역로 *** 3층'], ['배송 메모', '부재 시 경비실']],
            addrBtn: Btn('네이버에서 수정', { size: 'sm', icon: 'external-link' }),
            ss: true,
            bottom: Note('안심번호는 배송완료 뒤 일정 기간이 지나면 쓸 수 없게 됩니다. 배송지는 고객이 네이버에서 바꾸면 다음 가져오기 때 자동으로 반영됩니다.'),
        }),
    ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '스마트스토어 주문의 결제·환불 구역 (거래번호 · 환불 계산 없음)', right: '구역 내용만', pad: 20 }, `<div style="width:560px">${Box({ title: '결제 정보', sub: '네이버가 결제·정산합니다' }, KV([['결제수단', '네이버페이'], ['결제 일시', '2026-11-11 09:31'], ['상품 금액', '98,000원 (1박스 49,000원 × 2)'], ['배송비', '0원'], ['네이버 할인', '판매자 부담 0원 · 네이버 부담 2,000원'], ['정산 예정 금액', '94,570원 (수수료 3,430원 뺀 금액 · 네이버 기준)'], ['정산 예정일', '구매확정 다음 영업일']], { wide: true }))}${Note('결제 취소·환불은 네이버가 고객에게 직접 합니다. 우리 결제 대행사 거래번호는 없습니다. 정산 금액은 네이버가 알려 준 값이며 통계 > 매출에는 주문 결제 금액으로 잡힙니다.')}</div>`),
        Canvas({ size: 'auto', label: '스마트스토어 주문의 알림 발송 이력 구역', right: '구역 내용만', pad: 20 }, `<div style="width:420px">${Box({}, Text(`${Icon('info-o')} <b>우리 몰에서 보낸 알림이 없습니다</b>`, { sm: true }), Text('스마트스토어 주문의 주문·발송·취소 안내는 네이버가 고객에게 보냅니다. 운영자에게 가는 내부 알림(신규 주문)만 우리 설정을 따릅니다.', { sm: true, mute: true }))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '발송처리 뒤 품목 줄 · 네이버 전송 성공', right: '부분', pad: 20 }, `<div style="width:700px">${ItemRow({ opt: O1, qty: 2, price: '98,000원', st: '배송중', info: `CJ대한통운 581233441202 · 발송 11-11 16:20 · ${Badge('네이버 전송 성공 16:20', 'check')}`, btns: [b('배송 추적', 'primary'), b('송장 수정')] })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '발송처리 뒤 품목 줄 · 네이버 전송 실패 (다시 보내기)', right: '부분', pad: 20 }, `<div style="width:700px">${ItemRow({ opt: O1, qty: 2, price: '98,000원', st: '배송중', info: `CJ대한통운 581233441202 · 발송 11-11 16:20 · ${Badge('네이버 전송 실패', 'warn')} 네이버에는 아직 발송 전으로 보입니다. 사유: 네이버 응답 없음 · 자동 재시도 16:50`, btns: [b('네이버로 다시 보내기', 'primary'), b('송장 수정')] })}</div>`),
    ),
    Canvas({ size: 'auto', label: '스마트스토어 주문의 처리 기록 구역 (전송 결과가 줄마다 붙음)', right: '드로어만', pad: 0 }, drawer({ sub: '2026111145821371' },
        Head({ ch: '스마트스토어', name: '박서준', meta: '네이버 구매자', at: '주문 2026-11-11 09:31' }), DTABS('처리 기록', { claim: 0, memo: 0, noti: 0 }),
        Timeline([
            { t: '발송처리 → 네이버 전송 성공', d: '이보림 · 송장 엑셀 일괄 등록 · CJ대한통운 581233441202 · 전송 16:20:11', time: '11-11 16:20', on: true },
            { t: '발주확인 → 네이버 전송 성공', d: '이보림 · 일괄 발주확인', time: '11-11 10:30' },
            { t: '주문 가져옴', d: '자동 · 스마트스토어 주문 수집(10분마다) · 네이버 결제 09:31', time: '11-11 09:40' },
        ]),
    )),
);

const FailBand = (text, btns) => `<div style="display:flex;gap:10px;align-items:center;border:2px solid var(--dark);background:var(--warnbg);border-radius:6px;padding:10px 14px;margin-bottom:14px;font-size:13px;color:var(--warn)">${Icon('warning')}<div style="flex:1"><b>${text}</b></div>${btns || ''}</div>`;
const PayTabs = (active) => Tabs([{ t: '결제 내역' }, { t: '환불 내역', n: 1 }, { t: '환불 실패', n: 1 }], active, { kind: 'pill' });
const failHead = { name: '최도윤', meta: '회원 · 일반 등급 · 주문 2번째', at: '주문 2026-11-10 08:55' };

const failPayTab = (o = {}) => [
    Head(failHead), DTABS('결제', { claim: 1, memo: 0, noti: 3 }),
    FailBand(o.band || '환불 실패 1건 — 52,000원, 사유: 카드사 점검 시간(23:30 ~ 00:30)', Btn('환불 실패 보기', { size: 'sm', kind: 'primary' })),
    PayTabs('환불 실패'),
    Box({ title: '실패한 환불', sub: '취소 승인 11-10 23:41 (이보림) · 아직 고객에게 돈이 돌아가지 않았습니다' },
        KV([
            ['환불 금액', o.amt || '<b>52,000원</b> · 신용카드 전액 취소 (상품 49,000 + 제주 추가 배송비 3,000)'],
            ['실패 사유', o.reason || '<b>카드사 점검 시간입니다(23:30 ~ 00:30).</b> 점검이 끝난 뒤 다시 시도하세요.'],
            ['시도 기록', o.tries || '11-10 23:41 실패 · 11-11 00:11 실패(자동) · 11-11 00:41 실패(자동) — 자동 재시도 3회를 모두 썼습니다'],
            ['거래번호', 'T2026111008550126 <u>복사</u>'],
            ['주문 상태', `${OrderBadge('취소요청')} 취소 처리 중 · 고객에게 취소 완료 알림이 가지 않았습니다`],
            ['환불 기한', o.due || '취소 승인 뒤 3영업일 = 11-13(금)까지'],
        ], { wide: true }),
        Flex({ gap: 8, mt: 12 }, o.btns || [Btn('다시 시도', { kind: 'primary', icon: 'refresh' }), Btn('수동 환불 완료 확인'), Btn('취소 관리에서 보기', 'ghost')]),
    ),
    Note('결제 대행사 관리자 화면에서 직접 취소하지 마세요. 우리 쪽 금액과 어긋납니다. 다시 시도 · 수동 환불 완료 확인은 취소 관리(A-15)의 환불 실패 탭과 같은 팝업입니다.', { warn: true }),
];

const state4 = StateBlock({ idx: 4, title: '환불 실패 표시(경고 띠·결제 탭)', note: '이 주문에 실패한 환불이 있을 때만 드로어 맨 위에 경고 띠가 뜨고, 결제·환불 구역 안에 환불 실패 탭이 생깁니다. 실패가 없으면 띠도 탭도 없습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 환불이 안 들어왔다고 전화하면 운영자는 그 주문을 엽니다. 그때 화면이 취소 완료처럼 보이면 안 됩니다. 실패한 환불이 있으면 드로어를 열자마자 맨 위 띠로 금액과 사유를 알려 주고(띠의 버튼을 누르면 결제·환불 구역으로 내려감), 결제·환불 구역의 환불 실패 탭에서 그 자리에서 다시 시도하거나 수동 환불 완료 확인으로 닫습니다. 취소 관리·반품 관리의 환불 실패 탭으로 가지 않아도 같은 처리를 할 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '환불이 끝나기 전에는 품목 상태가 취소완료·반품완료로 바뀌지 않고 고객에게 완료 알림도 가지 않습니다. 가상계좌 환불의 실패(계좌 없음 · 예금주 다름)에는 환불 계좌 수정 버튼이 더 나옵니다. 환불 승인 권한이 없는 역할(고객응대 담당)은 띠와 사유는 보이지만 버튼이 없고 담당자에게 알리기만 할 수 있습니다. 스마트스토어 주문은 네이버가 환불하므로 이 표시가 없습니다.'),
    Canvas({ label: 'A-18 · 환불에 실패한 주문을 엶 → 맨 위 경고 띠 + 결제·환불 구역의 환불 실패 탭 (신용카드 · 카드사 점검)' }, Overlay({ bg: Bg(-1), align: 'right', h: 860 }, drawer({ sub: '20261110-000107' }, failPayTab()))),
    CanvasRow(
        Canvas({ size: 'auto', label: '드로어 맨 위 — 띠 바로 아래 주문 상품 구역 (품목 줄에 환불 실패 표시)', right: '드로어만', pad: 0 }, drawer({ sub: '20261110-000107' },
            Head(failHead), DTABS('주문 정보', { claim: 1, memo: 0, noti: 3 }),
            FailBand('환불 실패 1건 — 52,000원, 사유: 카드사 점검 시간(23:30 ~ 00:30)', Btn('환불 실패 보기', { size: 'sm', kind: 'primary' })),
            Box({ title: '주문 품목', sub: '품목 1개' }, ItemRow({ opt: O1, qty: 1, price: '49,000원', st: '취소요청', info: `취소 승인 11-10 23:41 (이보림) · ${Badge('환불 실패', 'warn')} 아직 환불되지 않음 · 취소 처리 중`, btns: [b('환불 다시 시도', 'primary'), b('수동 환불 완료 확인')] })),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '가상계좌 환불의 실패 (환불 계좌 수정 버튼이 더 나옴)', right: '구역 내용만', pad: 20 }, `<div style="width:700px">${failPayTab({
            band: '환불 실패 1건 — 98,000원, 사유: 환불 계좌의 예금주가 다릅니다',
            reason: '<b>환불 계좌로 보낼 수 없습니다.</b> 카카오뱅크 ****5679 의 예금주(임*수)가 주문자(임재현)와 다릅니다.',
            tries: '11-11 10:31 실패 · 계좌 문제라 자동 재시도하지 않습니다',
            due: '취소 승인 뒤 3영업일 = 11-16(월)까지',
            amt: '<b>98,000원</b> · 가상계좌 입금분 전액 → 고객 계좌로 송금',
            btns: [Btn('환불 계좌 수정', { kind: 'primary', icon: 'pen-o' }), Btn('고객에게 계좌 다시 요청', { icon: 'send' }), Btn('수동 환불 완료 확인')],
        }).slice(2).join('')}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '환불 승인 권한이 없는 역할이 본 모습 (버튼 없음 · 담당자에게 알리기)', right: '부분', pad: 20 }, `<div style="width:640px">${FailBand('환불 실패 1건 — 52,000원, 사유: 카드사 점검 시간(23:30 ~ 00:30)')}${Box({ flat: true }, Text('환불 처리는 주문·배송 담당 또는 대표 운영자만 할 수 있습니다.', { sm: true }), Flex({ gap: 8, mt: 6 }, Btn('담당자에게 알리기 (내부 알림)', { size: 'sm', icon: 'bell-o' }), Btn('관리자 메모 남기기', { size: 'sm', icon: 'note-o' })))}</div>`),
        Canvas({ size: 'auto', label: '다시 시도 성공 뒤 (띠와 환불 실패 탭이 사라지고 환불 내역에 한 줄)', right: '부분', pad: 20 }, `<div style="width:640px">${Tabs([{ t: '결제 내역' }, { t: '환불 내역', n: 1 }], '환불 내역', { kind: 'pill' })}${Table({ dense: true, cols: [{ t: '일시', w: 120 }, '내용', { t: '금액', w: 90, align: 'right' }, { t: '결과', w: 80 }, { t: '처리한 사람', w: 90 }], rows: [['11-11 10:42:19', '신용카드 전액 취소 · 실패 3회 뒤 다시 시도<small>T2026111008550126-C1</small>', '- 52,000원', Badge('성공', 'check'), '이보림']] })}</div>`),
    ),
    Canvas({ size: 'auto', label: '처리 기록 구역에 남는 모습 (실패와 다시 시도가 모두 남음)', right: '구역 내용만', pad: 20 }, `<div style="width:640px">${Timeline([
        { t: '환불 완료 · 취소완료', d: '이보림 · 다시 시도 성공 · 신용카드 52,000원 · 고객 알림 성공', time: '11-11 10:42', on: true },
        { t: '환불 실패 (자동 재시도 3회째)', d: '자동 · 카드사 점검 시간 · 내부 알림 발송(이보림 · 정하윤)', time: '11-11 00:41' },
        { t: '환불 실패 (자동 재시도 2회째)', d: '자동 · 카드사 점검 시간', time: '11-11 00:11' },
        { t: '취소 승인 → 환불 실패', d: '이보림 · 결제 취소 요청 52,000원 · 카드사 점검 시간', time: '11-10 23:41' },
        { t: '취소 요청 접수', d: '고객(최도윤) · 사유 단순 변심', time: '11-10 23:10' },
    ])}</div>`),
);

export default function A18(page) {
    const n = page && page.states ? page.states.length : 4;
    return [state1, state2, state3, state4].slice(0, Math.max(3, n)).join('');
}
