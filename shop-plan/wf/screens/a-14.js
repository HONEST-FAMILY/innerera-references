import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup,
    FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };
const TABS = [{ t: '확정 대기', n: 97 }, { t: '확정 완료', n: 148 }];

const WAIT = [
    { no: '20261105-000066', ch: '자사몰', opt: O1, qty: 1, name: '강지호', tel: '010-****-4468', pay: '49,000원', done: '11-06 11:30', auto: '11-13', left: '2일 뒤', pt: '490원' },
    { no: '20261104-000061', ch: '자사몰', opt: O2, qty: 1, name: '김민지', tel: '010-****-1234', pay: '93,000원', done: '11-05 14:02', auto: '11-12', left: '내일', pt: '930원', soon: true },
    { no: '2026110445001177', ch: '스마트스토어', opt: O1, qty: 2, name: '박서준', tel: '010-****-5821', pay: '98,000원', done: '11-05 13:20', auto: '네이버 기준', left: '네이버가 확정', pt: '-', ss: true },
    { no: '20261108-000090', ch: '자사몰', opt: O2, qty: 1, name: '박서준', tel: '010-****-5821', pay: '93,000원', done: '11-09 17:40', auto: '11-16', left: '5일 뒤', pt: '930원' },
    { no: '20261109-000101', ch: '자사몰', opt: O4, qty: 1, name: '윤서연', tel: '010-****-3317', pay: '176,000원', done: '11-10 14:22', auto: '11-17', left: '6일 뒤', pt: '1,760원' },
    { no: '20261107-000088', ch: '자사몰', opt: O2, qty: 1, name: '임재현', tel: '010-****-6642', pay: '93,000원', done: '11-08 15:12', auto: '멈춤', left: '반품 요청 처리 중', pt: '-', claim: true },
];

const cols = (point) => [{ t: '주문번호', w: 148 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 100 }, { t: '결제금액', w: 84, align: 'right' }, { t: '배송완료', w: 90 }, { t: '자동 확정 예정일', w: 130, sort: 'asc' }, ...(point ? [{ t: '적립 예정', w: 76, align: 'right' }] : []), { t: '상태', w: 84 }];
const row = (point) => (o) => ({
    hl: o.claim, nocheck: o.ss || o.claim,
    c: [`<u>${o.no}</u>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, o.pay, o.done,
        o.claim ? `${Badge('자동 확정 멈춤', 'warn')}<small>${o.left}</small>` : o.ss ? `네이버 기준<small>${o.left}</small>` : `${o.auto}<small>${o.soon ? `<b>${o.left}</b>` : o.left}</small>`,
        ...(point ? [o.pt] : []), o.claim ? OrderBadge('반품요청') : OrderBadge('배송완료')],
});

const Page = (tab, ...body) => AdminLayout({ active: 'a-14', counts: COUNTS, actions: [Btn('주문·클레임 정책', { icon: 'cog' })], desc: '배송완료 7일 뒤 자동으로 구매확정됩니다. 구매확정되면 반품·교환 신청이 닫히고 구매 적립금이 지급됩니다.' }, Tabs(TABS, tab), body);
const Search = (sum) => Filters({ open: false, summary: sum || '배송완료일 최근 1개월 · 채널 전체' });
const WaitHead = () => ListHead({ total: 97, left: Chips(['전체 97', '내일 자동 확정 12', '자동 확정 멈춤 3', '스마트스토어 31'], '전체 97'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] });

const state1 = StateBlock({ idx: 1, title: '확정 대기(자동 확정 예정일)', note: '배송완료됐지만 아직 구매확정되지 않은 주문. 고객이 직접 확정하거나, 예정일에 자동으로 확정됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '구매확정은 대부분 사람이 누르지 않습니다. 고객이 마이페이지에서 누르거나 배송완료 뒤 정해진 날이 지나면 자동으로 됩니다. 운영자가 이 화면에서 보는 것은 언제 확정되는지(적립금이 언제 나가고 반품 창구가 언제 닫히는지)와 자동 확정이 멈춘 건입니다. 반품·교환 요청이 걸린 주문은 처리가 끝날 때까지 자동 확정이 멈춥니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '자동 확정 일수는 설정 > 주문·클레임 정책(초기값 7일, 3~14일)에서 바꿉니다. 스마트스토어 주문은 네이버가 구매확정하고 우리는 결과만 받으므로 예정일 대신 네이버 기준이라고 적고 체크박스가 없습니다. 적립금 기능을 끈 몰은 적립 예정 칸이 없습니다.'),
    Canvas({ label: 'A-14 · 확정 대기 탭 (적립금 켠 몰 · 이너에라)' }, Page('확정 대기', Search(), WaitHead(), Table({ check: true, cols: cols(true), rows: WAIT.map(row(true)) }),
        Note('금액은 예시 값입니다(판매가 미확정). 적립 예정은 구매 적립률 1% 기준이며 혜택 > 적립금에서 바꿉니다.'), Pager({ page: 1, last: 2, per: 50 }))),
    Canvas({ label: 'A-14 · 검색 조건 펼침' }, Page('확정 대기',
        Filters({ rows: [
            { k: '기간', v: [Select({ value: '배송완료일', w: 120 }), Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })] },
            { k: '채널', v: RadioGroup(['전체', '자사몰', '스마트스토어'], '전체') },
            { k: '자동 확정', v: RadioGroup(['전체', '오늘·내일 확정', '멈춤(클레임 처리 중)'], '전체') },
            { k: '검색어', v: [Select({ value: '주문자 이름', w: 150 }), Input({ placeholder: '주문자 이름 · 연락처 뒷 4자리 · 주문번호', icon: 'search', w: 380 })] },
        ] }),
    )),
    Canvas({ label: 'A-14 · 확정 대기 탭 · 적립금을 끈 몰 (적립 예정 칸 없음 · 안내 문구도 다름)' }, AdminLayout({ active: 'a-14', counts: COUNTS, actions: [Btn('주문·클레임 정책', { icon: 'cog' })], desc: '배송완료 7일 뒤 자동으로 구매확정됩니다. 구매확정되면 반품·교환 신청이 닫힙니다.' },
        Tabs(TABS, '확정 대기'), Search(), WaitHead(), Table({ check: true, cols: cols(false), rows: WAIT.slice(0, 3).map(row(false)) }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '자동 확정 멈춤 줄에 마우스를 올림 → 이유 말풍선', right: '부분', pad: 20 }, `<div style="width:360px">${Box({ flat: true }, Text('<b>자동 확정이 멈춘 이유</b><br>반품 요청(11-10 19:40)이 처리 중입니다. 반품이 거부되거나 철회되면 그날부터 다시 7일을 셉니다. 환불까지 끝나면 구매확정 없이 반품완료로 끝납니다. <u>반품 관리에서 보기</u>', { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '확정 대기 주문이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:520px">${Empty({ icon: 'check-circle-o', title: '구매확정을 기다리는 주문이 없습니다', desc: '배송완료된 주문이 모두 구매확정되었습니다.', action: Btn('확정 완료 탭 보기', 'primary') })}</div>`),
    ),
);

const DONE = [
    ['20261103-000052', '자사몰', O1, 2, '이하은', '010-****-7730', '98,000원', '11-10 09:14', '고객이 확정', '980원 지급', true],
    ['20261102-000049', '자사몰', O2, 1, '정수아', '010-****-9015', '93,000원', '11-11 06:00', '자동 확정(7일 지남)', '930원 지급', false],
    ['2026110244870631', '스마트스토어', O1, 1, '윤서연', '010-****-3317', '49,000원', '11-10 21:02', '네이버에서 확정', '-', false],
    ['20261101-000041', '자사몰', O4, 1, '최도윤', '010-****-2204', '179,000원', '11-09 15:30', '운영자 확정(이보림)', '1,760원 지급', false],
    ['20261030-000033', '자사몰', O1, 1, '비회원 · 한지우', '010-****-8120', '52,000원', '11-08 06:00', '자동 확정(7일 지남)', '비회원', false],
];
const doneCols = (point) => [{ t: '주문번호', w: 148 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 110 }, { t: '결제금액', w: 84, align: 'right' }, { t: '확정 일시', w: 96, sort: 'desc' }, { t: '확정 방법', w: 140 }, ...(point ? [{ t: '적립금', w: 90, align: 'right' }] : []), { t: '리뷰', w: 70 }];

const state2 = StateBlock({ idx: 2, title: '확정 완료', note: '구매확정이 끝난 주문. 어떻게 확정됐는지(고객 · 자동 · 운영자 · 네이버)와 적립금이 나갔는지 확인합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '확정된 주문은 매출이 굳은 주문입니다. 여기서 운영자가 묻는 것은 두 가지입니다. 적립금이 제대로 나갔나, 그리고 확정됐는데 고객이 뒤늦게 반품을 원하면 어떻게 하나. 그래서 확정 방법과 적립금 지급 결과를 칸으로 보여 줍니다. 구매확정 자체는 되돌리지 않습니다(확정과 함께 적립금이 나가고 매출이 굳기 때문). 확정 뒤에는 고객이 반품·교환을 신청할 수 없으므로, 제품 불량처럼 꼭 받아 줘야 하는 경우에만 운영자가 직권으로 반품·교환을 접수하는 길을 둡니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '직권 반품·교환 접수는 환불 승인 권한이 있는 역할에게만 보이고 사유를 반드시 적습니다(처리 기록에 남음). 접수하면 반품 관리·교환 관리의 요청 탭으로 들어가 보통 반품과 같은 순서로 처리되고, 지급한 적립금은 환불이 끝날 때 회수합니다(고객이 이미 썼다면 모자란 만큼 환불 금액에서 뺌). 스마트스토어 주문은 네이버 판매자센터에서 처리합니다. 리뷰 칸은 리뷰 기능을 켠 몰에서만 보입니다.'),
    Canvas({ label: 'A-14 · 확정 완료 탭' }, Page('확정 완료', Search('확정일 최근 1개월 · 채널 전체'),
        ListHead({ total: 148, left: Chips(['전체 148', '고객이 확정 61', '자동 확정 84', '운영자 확정 3'], '전체 148'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: doneCols(true), rows: DONE.map((d) => [`<u>${d[0]}</u>`, ChannelBadge(d[1]), `${P}<small>${d[2]} · ${d[3]}개</small>`, `${d[4]}<small class="nw">${d[5]}</small>`, d[6], d[7], d[8], d[9] === '-' || d[9] === '비회원' ? `<small>${d[9] === '-' ? '네이버 포인트' : '비회원 주문'}</small>` : d[9], d[10] ? Badge('작성함', 'check') : '<small>아직</small>']),
            foot: ['합계 (이 쪽 5건)', '', '', '', '471,000원', '', '', '3,670원', ''] }),
        Pager({ page: 1, last: 3, per: 50 }),
    )),
    Canvas({ label: 'A-14 · 확정 완료 1건 선택 → 일괄 처리 바 → 직권 반품·교환 접수 팝업 (운영자 직권 · 환불 승인 권한)' }, Overlay({ bg: Page('확정 완료', Search(), BulkBar({ count: 1, sub: '자사몰 1건' }, Btn('엑셀 내려받기', 'primary'), Btn('리뷰 요청 보내기', { kind: 'line', icon: 'send' }), Btn('직권 반품·교환 접수', 'line')),
        Table({ check: true, checked: [1], cols: doneCols(true), rows: DONE.slice(0, 3).map((d) => [`<u>${d[0]}</u>`, ChannelBadge(d[1]), `${P}<small>${d[2]} · ${d[3]}개</small>`, d[4], d[6], d[7], d[8], d[9], '<small>아직</small>']) })), h: 640 },
        Modal({ title: '운영자 직권 반품·교환 접수 · 20261102-000049', w: 560, foot: [Btn('닫기'), Btn('직권 반품 접수', 'primary')] },
            Note('구매확정은 되돌리지 않습니다. 확정 뒤에는 고객이 반품·교환을 신청할 수 없으므로, 꼭 받아 줘야 하는 경우에만 운영자가 대신 접수합니다.', { warn: true }),
            FormTable([
                { k: '주문', v: Text(`정수아 · ${P} ${O2} 1개 · 93,000원 · 구매확정 11-05 (자동)`) },
                { k: '접수 종류', required: true, v: [Radio('반품', { on: true }), Radio('교환')] },
                { k: '사유', required: true, v: [Select({ value: '상품 불량 (판매자 부담)', w: 220 }), Input({ value: '고객 전화 · 스틱 포장 터짐 사진 받음', w: 280 })], help: '처리 기록에 남습니다.' },
                { k: '지급한 적립금', v: Text('930원 → 환불이 끝날 때 <b>회수</b> (고객 보유 적립금 2,400원에서 뺌)') },
                { k: '접수한 뒤', v: Text('반품 관리의 반품 요청 탭으로 들어갑니다. 수거 지시 → 검수 → 환불 순서는 보통 반품과 같습니다.', { sm: true }) },
            ]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '회수할 적립금을 고객이 이미 썼을 때', right: '안내만', pad: 20 }, `<div style="width:460px">${Note('지급한 적립금 930원 중 고객에게 남은 것은 200원입니다. 200원만 회수하고, 모자란 730원은 반품 관리의 환불 계산에서 환불 금액에서 뺍니다(계산 표에 한 줄로 표시).', { warn: true })}</div>`),
        Canvas({ size: 'auto', label: '리뷰 요청 보내기 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '리뷰 요청을 1건 보낼까요?', desc: '구매확정 뒤 리뷰를 쓰지 않은 고객에게 알림톡이 갑니다.<br>같은 주문에는 한 번만 보낼 수 있고, 광고성 정보 수신에 동의한 고객에게만 갑니다.', ok: '보내기' })),
    ),
);

const state3 = StateBlock({ idx: 3, title: '수동 확정', note: '자동 확정일을 기다리지 않고 운영자가 직접 구매확정하는 처리. 확정 대기 탭에서 체크하고 일괄로 합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 전화로 잘 받았으니 적립금을 빨리 달라고 하거나, 월 마감 전에 확정을 당겨야 할 때 씁니다. 한 건씩 누르지 않도록 체크박스로 고르고 한 번에 확정합니다. 확정하면 무슨 일이 일어나는지(반품 창구 닫힘 · 적립금 지급 · 고객 알림)를 확인 팝업에서 숫자로 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '수동 확정은 고객의 반품·교환 권리를 닫는 처리라 배송완료 뒤 최소 일수(초기값 1일)가 지나야 누를 수 있습니다. 반품·교환 요청이 걸린 주문과 스마트스토어 주문은 고를 수 없고(체크박스 없음), 섞여 있으면 빼고 처리한다고 알려 줍니다.'),
    Canvas({ label: 'A-14 · 확정 대기 탭 · 3건 선택 → 일괄 처리 바' }, Page('확정 대기', Search(),
        BulkBar({ count: 3, sub: '자사몰 3건 · 결제금액 합계 235,000원' }, Btn('구매확정 처리', 'primary'), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' }), Btn('자동 확정 미루기', 'line')),
        Table({ check: true, checked: [0, 1, 3], cols: cols(true), rows: WAIT.map(row(true)) }),
    )),
    Canvas({ label: 'A-14 · 구매확정 처리 버튼 → 확인 팝업' }, Overlay({ bg: Page('확정 대기', Search(), BulkBar({ count: 3, sub: '자사몰 3건' }, Btn('구매확정 처리', 'primary')), Table({ check: true, checked: [0, 1, 3], cols: cols(true), rows: WAIT.map(row(true)) })), h: 560 },
        Modal({ title: '선택한 3건을 구매확정할까요?', w: 520, foot: [Btn('취소'), Btn('3건 구매확정', 'primary')] },
            KV([['대상', '자사몰 3건 · 결제금액 합계 235,000원'], ['반품·교환', '확정하면 이 주문들은 고객이 반품·교환을 신청할 수 없습니다'], ['적립금 지급', '2,350원 (3명에게 바로 지급)'], ['고객 알림', '구매확정 안내 · 리뷰 작성 안내 3건']], { wide: true }),
            '<div style="height:12px"></div>',
            FormTable([{ k: '사유', required: true, v: Select({ value: '고객 요청(전화·문의)', w: 260, open: true, options: [{ t: '고객 요청(전화·문의)', on: true }, '수령 확인됨', '정산 마감', '기타(직접 입력)'] }) }]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '배송완료 뒤 1일이 안 지난 주문이 섞였을 때', right: '팝업만', pad: 20 },
            Modal({ title: '선택한 3건 중 2건만 구매확정할 수 있습니다', w: 520, foot: [Btn('취소'), Btn('2건 구매확정', 'primary')] },
                Table({ dense: true, cols: [{ t: '주문번호', w: 150 }, { t: '주문자', w: 70 }, '처리'], rows: [
                    ['20261105-000066', '강지호', `${Icon('check-min')} 구매확정합니다`], ['20261104-000061', '김민지', `${Icon('check-min')} 구매확정합니다`],
                    { dim: true, c: ['20261109-000101', '윤서연', '배송완료(11-10 14:22) 뒤 1일이 지나지 않았습니다. 11-11 14:22부터 가능'] },
                ] }),
            )),
        Canvas({ size: 'auto', label: '자동 확정 미루기 → 팝업 (고객이 써 보고 결정하겠다고 한 경우)', right: '팝업만', pad: 20 },
            Modal({ title: '자동 확정 미루기 · 3건', w: 460, foot: [Btn('취소'), Btn('미루기', 'primary')] },
                FormTable([
                    { k: '미룰 기간', required: true, v: RadioGroup(['3일', '7일', '14일'], '7일'), help: '주문마다 한 번만 미룰 수 있습니다. 그동안 고객은 반품·교환을 신청할 수 있습니다.' },
                    { k: '사유', required: true, v: Input({ value: '고객 요청 · 복용 뒤 결정', w: 260 }) },
                ]),
            )),
    ),
    Canvas({ label: 'A-14 · 구매확정 뒤 토스트 (확정 완료 탭으로 옮겨짐 · 탭 숫자 바뀜)' }, Overlay({ bg: Page('확정 대기', Search(), WaitHead(), Table({ check: true, cols: cols(true), rows: WAIT.slice(2).map(row(true)) })), dim: false, align: 'top', h: 380 },
        Toast('3건을 구매확정했습니다. 적립금 2,350원을 지급했습니다.', { action: '확정 완료 탭 보기' }))),
);

export default function A14() {
    return [state1, state2, state3].join('');
}
