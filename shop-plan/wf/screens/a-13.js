import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Timeline, Overlay, Modal, Confirm, SideDrawer, Toast, ExcelResult,
    Box, KV, Note, Text, Icon, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };

const TABS = [{ t: '배송중', n: 42 }, { t: '배송완료', n: 97 }, { t: '추적 실패', n: 3 }, { t: '장기 배송', n: 1 }];

const MOVING = [
    { no: '20261110-000118', ch: '자사몰', opt: O2, qty: 1, name: '김민지', tel: '010-****-1234', co: 'CJ대한통운', inv: '581233441188', sent: '11-10 16:20', step: '배송 출발', at: '11-11 08:20 · 서울 마포', day: '1일째' },
    { no: '2026111045790187', ch: '스마트스토어', opt: O1, qty: 1, name: '임재현', tel: '010-****-6642', co: 'CJ대한통운', inv: '581233441190', sent: '11-10 16:20', step: '간선 하차', at: '11-11 04:10 · 대전 허브', day: '1일째' },
    { no: '20261110-000113', ch: '자사몰', opt: O4, qty: 1, name: '윤서연', tel: '010-****-3317', co: '한진택배', inv: '423198770301', sent: '11-10 15:02', step: '집화 완료', at: '11-10 18:44 · 인천 제물포', day: '1일째' },
    { no: '20261109-000102', ch: '자사몰', opt: O1, qty: 2, name: '최도윤', tel: '010-****-2204', co: 'CJ대한통운', inv: '581233440951', sent: '11-09 16:05', step: '배송 출발', at: '11-11 07:55 · 제주', day: '2일째' },
    { no: '20261106-000079', ch: '자사몰', opt: O1, qty: 1, name: '이하은', tel: '010-****-7730', co: '롯데택배', inv: '240118873352', sent: '11-06 15:40', step: '간선 상차', at: '11-07 02:15 · 군포 터미널', day: '5일째', slow: true },
    { no: '2026110845102266', ch: '스마트스토어', opt: O2, qty: 1, name: '강지호', tel: '010-****-4468', co: 'CJ대한통운', inv: '58123344087', sent: '11-08 16:10', step: '추적 실패', at: '운송장을 찾을 수 없음', day: '3일째', fail: true },
];

const COLS = [{ t: '주문번호 · 발송일시', w: 148 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '받는 분', w: 100 }, { t: '택배사 · 송장번호', w: 130 }, { t: '추적 단계', w: 150 }, { t: '경과', w: 78 }, { t: '', w: 86 }];
const row = (o) => ({
    hl: o.slow || o.fail,
    c: [`<u>${o.no}</u><small>발송 ${o.sent}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, `${o.co}<small><u>${o.inv}</u></small>`,
        o.fail ? `${Badge('추적 실패', 'warn')}<small>${o.at}</small>` : `<b>${o.step}</b><small>${o.at}</small>`, o.slow ? Badge(o.day, 'warn') : o.day, Btn('송장 수정', { size: 'sm' })],
});

const HeadActions = [Btn('배송 추적 지금 새로 고침', { icon: 'refresh' }), Btn('송장 엑셀 일괄 수정', { icon: 'file-upload-o' })];
const Page = (tab, ...body) => AdminLayout({ active: 'a-13', counts: COUNTS, actions: HeadActions, desc: '택배 조회 연동으로 2시간마다 추적 단계를 가져옵니다. 배송완료가 확인되면 자동으로 배송완료 상태가 됩니다. 마지막 조회 11-11 09:30.' }, Tabs(TABS, tab), body);
const Search = (sum) => Filters({ open: false, summary: sum || '발송일 최근 7일 · 채널 전체 · 택배사 전체' });
const MoveHead = () => ListHead({ total: 42, left: Chips(['전체 42', '집화 전 4', '이동 중 29', '배송 출발 9', '장기 배송 1'], '전체 42'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] });

const DONE = [
    ['20261109-000101', '자사몰', O4, 1, '윤서연', '010-****-3317', '한진택배', '423198770215', '11-10 14:22', '문 앞', '11-17', false],
    ['2026110945300418', '스마트스토어', O1, 1, '정수아', '010-****-9015', 'CJ대한통운', '581233440820', '11-10 13:05', '본인 수령', '네이버 기준', false],
    ['20261108-000090', '자사몰', O2, 1, '박서준', '010-****-5821', 'CJ대한통운', '581233440733', '11-09 17:40', '경비실', '11-16', false],
    ['20261107-000088', '자사몰', O2, 1, '임재현', '010-****-6642', 'CJ대한통운', '581233440877', '11-08 15:12', '문 앞', '반품 요청 중', true],
    ['20261105-000066', '자사몰', O1, 1, '강지호', '010-****-4468', '우체국택배', '6896012345678', '11-06 11:30', '수동 처리(이보림)', '11-13', false],
];
const DONE_COLS = [{ t: '주문번호', w: 148 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '받는 분', w: 100 }, { t: '택배사 · 송장번호', w: 130 }, { t: '배송완료 시각 · 받은 곳', w: 136 }, { t: '자동 구매확정', w: 100 }, { t: '상태', w: 96 }];

const state1 = StateBlock({ idx: 1, title: '배송중·배송완료 탭', note: '내보낸 주문을 두 탭으로 나눠 봅니다. 배송중은 지금 어디 있는지, 배송완료는 언제 받았고 언제 구매확정되는지.' },
    Anno({ title: '왜 이렇게 하나' }, '발송 뒤에 운영자가 할 일은 거의 없어야 합니다. 택배 조회 연동이 추적 단계를 가져오고 배송완료를 자동으로 반영합니다. 운영자가 봐야 하는 것은 예외뿐입니다. 3일 넘게 움직이지 않는 건, 추적이 안 되는 건. 그래서 목록 위 칩으로 예외를 먼저 걸러 보고, 해당 줄은 강조합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '스마트스토어 주문의 배송완료·구매확정은 네이버가 판단합니다(우리 화면은 받아서 보여 주기만 함). 그래서 배송완료 탭의 자동 구매확정 칸에 스마트스토어 주문은 날짜 대신 네이버 기준이라고 적습니다. 발송 뒤 5일이 넘도록 배송완료가 안 된 주문은 줄을 강조하고 장기 배송 탭에 따로 모읍니다(상태 6 · 일수는 설정 > 주문·클레임 정책).'),
    Canvas({ label: 'A-13 · 배송중 탭 (경과 5일째 멈춘 건 · 추적 실패 건 강조)' }, Page('배송중', Search(), MoveHead(), Table({ check: true, cols: COLS, rows: MOVING.map(row) }), Pager({ page: 1, last: 1, per: 50 }))),
    Canvas({ label: 'A-13 · 배송완료 탭 (받은 곳 · 자동 구매확정 예정일)' }, Page('배송완료', Search('배송완료일 최근 7일 · 채널 전체'),
        ListHead({ total: 97, left: Chips(['전체 97', '자동 반영 95', '수동 처리 2'], '전체 97'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: DONE_COLS, rows: DONE.map((d) => ({ hl: d[11], c: [`<u>${d[0]}</u>`, ChannelBadge(d[1]), `${P}<small>${d[2]} · ${d[3]}개</small>`, `${d[4]}<small class="nw">${d[5]}</small>`, `${d[6]}<small><u>${d[7]}</u></small>`, `${d[8]}<small>${d[9]}</small>`, d[11] ? Badge(d[10], 'warn') : d[10], d[11] ? OrderBadge('반품요청') : OrderBadge('배송완료')] })) }),
        Note('배송완료 7일 뒤 자동으로 구매확정됩니다(설정 > 주문·클레임 정책). 반품·교환 요청이 들어온 주문은 자동 구매확정에서 빠집니다.'),
        Pager({ page: 1, last: 2, per: 50 }),
    )),
    Canvas({ label: 'A-13 · 검색 조건 펼침 (배송중 탭)' }, Page('배송중',
        Filters({ rows: [
            { k: '기간', v: [Select({ value: '발송일', w: 110 }), Period({ preset: '7일' })] },
            { k: '채널', v: RadioGroup(['전체', '자사몰', '스마트스토어'], '전체') },
            { k: '택배사', v: CheckGroup(['전체', ...SHOP.couriers], ['전체']) },
            { k: '추적 단계', v: CheckGroup(['집화 전', '집화 완료', '이동 중', '배송 출발', '장기 배송(발송 뒤 5일 넘음)'], []) },
            { k: '검색어', v: [Select({ value: '송장번호', w: 150 }), Input({ placeholder: '송장번호 · 받는 분 이름 · 연락처 뒷 4자리 · 주문번호 (여러 건은 쉼표로)', icon: 'search', w: 420 })] },
        ] }),
    )),
    Canvas({ label: 'A-13 · 배송중 3건 선택 → 일괄 처리 바' }, Page('배송중', Search(),
        BulkBar({ count: 3, sub: '자사몰 2건 · 스마트스토어 1건' }, Btn('배송완료 처리', 'primary'), Btn('추적 다시 조회', { kind: 'line', icon: 'refresh' }), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' }), Btn('배송 지연 안내 보내기', { kind: 'line', icon: 'send' })),
        Table({ check: true, checked: [3, 4, 5], cols: COLS, rows: MOVING.map(row) }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '배송완료 처리 → 확인 (추적이 안 되는 택배·직접 배달일 때만 쓰는 수동 처리)', right: '팝업만', pad: 20 },
            Modal({ title: '배송완료 처리 · 3건', w: 520, foot: [Btn('취소'), Btn('2건 배송완료 처리', 'primary')] },
                Note('스마트스토어 주문 1건은 여기서 배송완료로 바꿀 수 없습니다(네이버가 판단). 자사몰 2건만 처리합니다.', { warn: true }),
                FormTable([
                    { k: '배송완료 일시', required: true, v: Input({ value: '2026-11-11 10:00', icon: 'calendar', w: 200 }) },
                    { k: '사유', required: true, v: Select({ value: '택배사에서 배송완료 확인(전화)', w: 280 }) },
                    { k: '고객 알림', v: Check('배송 완료 안내 보내기', { on: false }), help: '수동 처리는 실제 수령과 시각이 다를 수 있어 초기값은 보내지 않음입니다.' },
                ]),
                Note('배송완료로 바꾸면 그날부터 7일 뒤 자동 구매확정됩니다. 처리 기록에 수동 처리(이보림)로 남습니다.'),
            )),
        Canvas({ size: 'auto', label: '배송중 주문이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:520px">${Empty({ icon: 'truck', title: '배송 중인 주문이 없습니다', desc: '발주 확인·발송 처리에서 송장을 넣고 발송처리하면 여기에 나타납니다.', action: Btn('발주 확인·발송 처리로', 'primary') })}</div>`),
    ),
);

const TRACK = [
    { t: '배송 출발', d: '서울 마포 · 배송기사 010-****-7788 · 오늘 14~16시 도착 예정', time: '11-11 08:20', on: true },
    { t: '배송지 도착', d: '서울 마포 대리점', time: '11-11 06:40' },
    { t: '간선 하차', d: '서울 서부 허브', time: '11-11 03:55' },
    { t: '간선 상차', d: '인천 허브', time: '11-10 22:30' },
    { t: '집화 완료', d: '인천 제물포 · 이너에라 출고지', time: '11-10 18:44' },
    { t: '송장 등록(발송처리)', d: '운영자 이보림 · 송장 엑셀 일괄 등록', time: '11-10 16:20' },
];

const trackDrawer = (o = {}) => SideDrawer({ title: '배송 추적', sub: o.sub || 'CJ대한통운 581233441188', w: 520, foot: [Btn('택배사 사이트에서 보기', { icon: 'external-link' }), Btn('송장 수정'), Btn('닫기', 'primary')] },
    KV([['주문번호', `<u>${o.no || '20261110-000118'}</u> ${ChannelBadge(o.ch || '자사몰')}`], ['받는 분', o.to || '김민지 · 010-****-1234'], ['배송지', o.addr || '서울 마포구 월드컵북로 ***'], ['상품', `${P} · ${o.opt || O2} · 1개`], ['마지막 조회', o.last || '11-11 09:30 (2시간마다) <u>지금 다시 조회</u>']]),
    '<div style="height:16px"></div>',
    o.body,
);

const state2 = StateBlock({ idx: 2, title: '추적 단계', note: '목록의 추적 단계나 송장번호를 누르면 오른쪽에서 열립니다. 택배 조회 연동이 가져온 단계를 시간순으로 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 내 택배 어디 있느냐고 물으면 택배사 사이트를 새로 열지 않고 이 화면에서 답합니다. 맨 위가 가장 최근 단계이고, 맨 아래는 우리가 송장을 등록한 시각입니다. 고객 화면(배송 조회 팝업)과 같은 내용을 보여 주되 운영자에게는 배송기사 연락처와 누가 송장을 넣었는지가 더 보입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '택배사가 단계를 늦게 올리는 일이 흔합니다(집화했는데 반나절 동안 조회 안 됨). 그래서 발송 뒤 3일 동안은 추적 실패로 치지 않고 집화 전으로 보여 줍니다. 합포장 주문은 같은 송장을 쓰는 주문 목록을 함께 보여 줍니다.'),
    Canvas({ label: 'A-13 · 배송중 줄의 추적 단계를 누름 → 오른쪽 드로어 (배송 출발)' }, Overlay({ bg: Page('배송중', Search(), MoveHead(), Table({ check: true, cols: COLS, rows: MOVING.map((m, i) => ({ ...row(m), on: i === 0 })) })), align: 'right', h: 760 },
        trackDrawer({ body: [Box({ flat: true }, Text(`${Icon('truck')} <b>배송 출발</b> · 오늘 14~16시 도착 예정 · 발송 뒤 1일째`)), Timeline(TRACK)] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '집화 전 (송장 등록 뒤 아직 택배사 기록 없음 · 발송 뒤 3일 안)', right: '드로어만', pad: 0 },
            trackDrawer({ sub: '한진택배 423198770340', no: '20261111-000120', to: '정수아 · 010-****-9015', addr: '대전 유성구 대학로 ***', opt: O1, last: '11-11 09:30',
                body: [Box({ flat: true }, Text(`${Icon('clock-o')} <b>집화 전</b> · 택배사가 아직 물건을 가져가지 않았거나 기록을 올리지 않았습니다.`)), Timeline([{ t: '송장 등록(발송처리)', d: '운영자 이보림 · 목록에서 바로 입력', time: '11-11 09:02', on: true }]), Note('발송 뒤 3일(11-14 09:02)까지 기록이 없으면 추적 실패로 바뀌고 추적 실패 탭에 나타납니다.')] })),
        Canvas({ size: 'auto', label: '배송완료 (받은 곳 · 합포장 주문 함께 표시)', right: '드로어만', pad: 0 },
            trackDrawer({ sub: 'CJ대한통운 581233440733', no: '20261108-000090', to: '박서준 · 010-****-5821', addr: '경기 성남시 분당구 판교역로 ***', last: '11-09 18:00 (배송완료 뒤에는 조회 안 함)',
                body: [Box({ flat: true }, Text(`${Icon('check-circle-o')} <b>배송완료</b> · 11-09 17:40 · 경비실 · 자동 구매확정 예정 11-16`)),
                    Timeline([{ t: '배송완료', d: '경비실 수령 · 배송기사 010-****-3301', time: '11-09 17:40', on: true }, { t: '배송 출발', d: '성남 분당', time: '11-09 08:11' }, { t: '간선 하차', d: '성남 허브', time: '11-09 03:20' }, { t: '집화 완료', d: '인천 제물포', time: '11-08 18:30' }, { t: '송장 등록(발송처리)', d: '운영자 이보림', time: '11-08 16:10' }]),
                    Box({ title: '같은 송장으로 보낸 주문 (합포장)', sub: '2건' }, Text('<u>20261108-000090</u> 자사몰 · 2박스(28일분) 1개<br><u>2026110845102190</u> 스마트스토어 · 1박스(14일분) 1개', { sm: true }))] })),
    ),
);

const editForm = (o = {}) => FormTable([
    { k: '주문', v: Text(`<u>2026110845102266</u> ${ChannelBadge('스마트스토어')} 강지호 · ${P} ${O2} 1개`) },
    { k: '지금 송장', v: Text('CJ대한통운 <b>58123344087</b> (11자리) · 11-08 16:10 등록') },
    { k: '택배사', required: true, v: o.courier || Select({ value: 'CJ대한통운', w: 200 }) },
    { k: '새 송장번호', required: true, v: Input({ value: o.inv === undefined ? '581233440871' : o.inv, w: 200, error: !!o.err, focus: o.focus }), error: o.err, help: o.err ? undefined : 'CJ대한통운은 숫자 12자리입니다. 붙여 넣으면 줄표와 빈칸은 자동으로 지웁니다.' },
    { k: '수정 사유', required: true, v: Select({ value: '송장번호 오타', w: 200 }) },
    { k: '고객 재알림', required: true, v: [Radio('바뀐 송장번호로 발송 안내 다시 보내기', { on: o.notify !== false }), Radio('보내지 않기', { on: o.notify === false })], help: '고객이 이미 받은 안내의 송장번호가 틀렸다면 다시 보내야 고객이 조회할 수 있습니다. 택배사만 바로잡는 내부 정정이면 보내지 않아도 됩니다.' },
]);

const state3 = StateBlock({ idx: 3, title: '송장 수정', note: '송장번호나 택배사를 잘못 넣었을 때. 줄의 송장 수정 버튼 또는 추적 드로어에서 엽니다.' },
    Anno({ title: '왜 이렇게 하나' }, '하루 수백 건을 넣다 보면 한 자리를 빠뜨리거나 다른 주문 송장을 붙이는 일이 생깁니다. 고치는 것은 쉬워야 하고, 고친 뒤 고객이 받은 안내와 실제가 달라지지 않게 해야 합니다. 그래서 수정할 때마다 고객에게 다시 알릴지 운영자가 고르게 합니다(초기값: 다시 보내기).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '스마트스토어 주문은 송장 수정이 네이버에도 전송되어야 고객의 네이버 주문 내역이 바뀝니다. 전송에 실패하면 우리 쪽만 바뀐 채로 남지 않게 실패를 알리고 다시 보내기를 줍니다. 배송완료된 주문의 송장은 고칠 수 없습니다. 고친 내용(이전 값 → 새 값 · 누가 · 언제)은 주문 상세 처리 기록에 남습니다.'),
    Canvas({ label: 'A-13 · 송장 수정 버튼 → 팝업 (스마트스토어 주문)' }, Overlay({ bg: Page('배송중', Search(), MoveHead(), Table({ check: true, cols: COLS, rows: MOVING.map(row) })), h: 760 },
        Modal({ title: '송장 수정', w: 600, foot: [Btn('취소'), Btn('수정하고 고객에게 다시 알리기', 'primary')] },
            editForm(),
            Note('스마트스토어 주문이라 바뀐 송장이 네이버로 전송됩니다.'),
            Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 강지호 님, 앞서 안내드린 송장번호가 바뀌었습니다.<br>택배사: CJ대한통운<br>송장번호: 581233440871<br>배송 조회는 마이페이지 주문 내역에서 하실 수 있습니다.', { sm: true })),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '택배사 고르는 중 (검색형 목록)', right: '팝업만', pad: 20 },
            Modal({ title: '송장 수정', w: 600, foot: [Btn('취소'), Btn('수정', { kind: 'primary', disabled: true })] },
                editForm({ courier: Select({ value: 'CJ대한통운', w: 200, open: true, search: '', options: [{ t: 'CJ대한통운', sub: '기본', on: true }, '한진택배', '롯데택배', '우체국택배', '로젠택배', { t: '직접 배달·퀵', sub: '추적 안 됨' }] }), inv: '', focus: true }))),
        Canvas({ size: 'auto', label: '입력 오류 (자릿수 · 다른 주문에서 이미 쓰는 송장) · 알리지 않기 고름', right: '팝업만', pad: 20 },
            Modal({ title: '송장 수정', w: 600, foot: [Btn('취소'), Btn('수정', { kind: 'primary', disabled: true })] },
                editForm({ inv: '581233441188', notify: false, err: '이 송장번호는 주문 20261110-000118(김민지)에 이미 들어 있습니다. 합포장이 아니라면 번호를 다시 확인하세요.' }))),
    ),
    Canvas({ label: 'A-13 · 송장 엑셀 일괄 수정 버튼 → 검증 결과 (택배사가 송장을 통째로 다시 발급한 경우)' }, Overlay({ bg: Page('배송중', Search()), h: 600 },
        Modal({ title: '송장 엑셀 일괄 수정', w: 720, foot: [Btn('파일 다시 올리기'), Btn('성공 17건 수정', 'primary')] },
            Text('송장수정_20261111.xlsx · 18행 · 칸: 주문번호 · 택배사 · 새 송장번호', { sm: true, mute: true }),
            ExcelResult({ total: 18, ok: 17, fail: 1, rows: [{ row: 9, key: '20261109-000101', value: '423198770999', reason: '이미 배송완료된 주문이라 송장을 고칠 수 없습니다' }], note: '오류 행은 저장되지 않습니다.' }),
            FormTable([{ k: '고객 재알림', required: true, v: [Radio('17건 모두 바뀐 송장번호로 다시 알리기', { on: true }), Radio('보내지 않기')] }]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '수정 완료', right: '토스트만', pad: 20 }, Toast('송장을 수정하고 고객에게 다시 알렸습니다. 스마트스토어에도 전송했습니다.')),
        Canvas({ size: 'auto', label: '우리 쪽은 바뀌었지만 네이버 전송 실패 (닫기 전까지 남음)', right: '토스트만', pad: 20 }, Toast('송장은 수정했지만 스마트스토어 전송에 실패했습니다. 네이버 주문 내역에는 이전 송장이 보입니다.', { kind: 'error', action: '다시 보내기' })),
    ),
);

const FAIL = [
    { no: '2026110845102266', ch: '스마트스토어', opt: O2, name: '강지호', tel: '010-****-4468', co: 'CJ대한통운', inv: '58123344087', sent: '11-08 16:10', why: '송장번호 자릿수가 맞지 않음', hint: '12자리여야 하는데 11자리', day: '3일째' },
    { no: '20261109-000100', ch: '자사몰', opt: O1, name: '정수아', tel: '010-****-9015', co: '한진택배', inv: '581233440960', sent: '11-08 16:10', why: '택배사에 없는 송장번호', hint: 'CJ대한통운 번호 형식과 같음 · 택배사를 잘못 골랐을 수 있음', day: '3일째' },
    { no: '20261109-000099', ch: '자사몰', opt: O1, name: '박서준', tel: '010-****-5821', co: '로젠택배', inv: '90412233581', sent: '11-08 16:10', why: '발송 뒤 3일 넘게 집화 기록 없음', hint: '택배사가 아직 가져가지 않았을 수 있음', day: '3일째' },
];
const FAIL_COLS = [{ t: '주문번호 · 발송일시', w: 148 }, { t: '채널', w: 100 }, { t: '받는 분', w: 100 }, { t: '택배사 · 송장번호', w: 130 }, '실패 사유 · 짐작되는 원인', { t: '경과', w: 60 }, { t: '', w: 262 }];

const state4 = StateBlock({ idx: 4, title: '배송 추적 실패 건', note: '송장을 넣었는데 택배 조회가 안 되는 주문만 모은 탭. 대부분 송장번호 오타나 택배사를 잘못 고른 것입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '추적이 안 되는 주문은 배송완료가 자동으로 잡히지 않아 구매확정도 안 되고, 고객은 조회가 안 된다고 문의합니다. 빨리 찾아 고쳐야 하므로 탭을 따로 두고 대시보드에도 숫자를 올립니다. 실패 사유마다 짐작되는 원인을 같이 적어(자릿수가 다름 · 다른 택배사 번호 형식) 운영자가 무엇을 고칠지 바로 알게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '택배 조회 연동 자체가 끊긴 경우(택배 조회 서비스 장애 · 이용 한도 초과)는 주문마다의 실패가 아니므로 목록 위에 따로 알립니다. 이때는 송장을 고칠 필요가 없고 연결이 돌아오면 자동으로 다시 조회합니다. 직접 배달·퀵처럼 추적이 원래 안 되는 수단은 실패로 세지 않습니다.'),
    Canvas({ label: 'A-13 · 추적 실패 탭 (사유별 · 줄마다 바로 고치기)' }, Page('추적 실패',
        Note('발송 뒤 3일이 지나도 택배 조회 결과가 없는 주문입니다. 송장을 고치면 바로 다시 조회하고, 조회되면 이 탭에서 빠집니다.'),
        ListHead({ total: 3, left: Chips(['전체 3', '자릿수 오류 1', '택배사에 없는 번호 1', '집화 기록 없음 1'], '전체 3'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: FAIL_COLS, rows: FAIL.map((f) => ({ hl: true, c: [`<u>${f.no}</u><small>발송 ${f.sent}</small>`, ChannelBadge(f.ch), `${f.name}<small class="nw">${f.tel}</small>`, `${f.co}<small><u>${f.inv}</u></small>`, `<b>${f.why}</b><small>${f.hint}</small>`, f.day, `${Btn('송장 수정', { size: 'sm', kind: 'primary' })} ${Btn('다시 조회', { size: 'sm' })} ${Btn('배송완료 처리', { size: 'sm' })}`] })) }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '다시 조회 → 여전히 실패', right: '토스트만', pad: 20 }, Toast('다시 조회했지만 택배사에서 송장을 찾지 못했습니다. 송장번호와 택배사를 확인하세요.', { kind: 'error', action: '송장 수정' })),
        Canvas({ size: 'auto', label: '다시 조회 → 성공 (탭에서 빠짐)', right: '토스트만', pad: 20 }, Toast('추적이 확인되었습니다. 지금 단계: 집화 완료. 배송중 탭으로 옮겼습니다.')),
    ),
    Canvas({ label: 'A-13 · 택배 조회 연동이 끊겼을 때 (주문별 실패가 아님 · 목록 위 안내)' }, Page('배송중',
        Note('택배 조회 연결이 11-11 07:30부터 끊겨 추적 단계가 갱신되지 않고 있습니다. 송장을 고칠 필요는 없습니다. 연결이 돌아오면 자동으로 다시 조회합니다. 고객의 배송 조회 화면에는 택배사 사이트로 가는 주소가 대신 보입니다. <u>연결 상태 보기</u>', { warn: true }),
        Search(), MoveHead(), Table({ check: true, cols: COLS, rows: MOVING.slice(0, 3).map(row) }),
    )),
    Canvas({ label: 'A-13 · 추적 실패 건이 없을 때' }, Page('추적 실패', ListHead({ total: 0, right: PerPage(50) }),
        `<div class="wf-tablewrap">${Empty({ icon: 'check-circle-o', title: '추적이 안 되는 송장이 없습니다', desc: '보낸 주문이 모두 택배 조회되고 있습니다.', action: Btn('배송중 탭으로', 'primary') })}</div>`)),
);

const DIRECT = [
    { no: '20261110-000111', ch: '자사몰', opt: O4, qty: 2, name: '정수아', tel: '010-****-9015', co: '직접 배송', inv: '추적 안 됨', sent: '11-10 14:00', step: '추적하지 않는 배송', at: '운영자가 직접 전달 예정', day: '1일째' },
    { no: '20261110-000109', ch: '자사몰', opt: O1, qty: 1, name: '이하은', tel: '010-****-7730', co: '퀵서비스', inv: '추적 안 됨', sent: '11-10 11:30', step: '추적하지 않는 배송', at: '기사 010-****-4410', day: '1일째' },
];
const directRow = (o) => [`<u>${o.no}</u><small>발송 ${o.sent}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, `${o.co}<small>${o.inv}</small>`, `${Badge('추적 안 됨', 'dash')}<small>${o.at}</small>`, o.day, Btn('배송완료 처리', { size: 'sm', kind: 'primary' })];

const manualForm = (o = {}) => FormTable([
    { k: '대상', v: Text(o.target || '선택한 <b>2건</b> · 직접 배송 1건 · 퀵서비스 1건') },
    { k: '배송완료일', required: true, v: [Input({ value: o.date || '2026-11-11', icon: 'calendar', w: 160, error: !!o.err }), Select({ value: '오후 2시쯤', w: 130 })], error: o.err, help: o.err ? undefined : '초기값은 오늘입니다. 발송일보다 앞이거나 내일 이후는 고를 수 없습니다.' },
    { k: '처리 사유', required: true, v: o.reason || Select({ value: '직접 배송·퀵으로 전달함', w: 280 }) },
    { k: '받은 사람·메모', v: Input({ value: o.memo === undefined ? '본인 수령 확인(전화)' : o.memo, placeholder: '예: 본인 수령 · 경비실 · 문 앞', w: 320 }) },
    { k: '고객 알림', v: Check('배송 완료 안내 보내기', { on: false }), help: '수동 처리는 실제 수령 시각과 다를 수 있어 초기값은 보내지 않음입니다.' },
]);

const state5 = StateBlock({ idx: 5, title: '수동 배송완료 처리', note: '택배 조회로 배송완료를 알 수 없는 주문을 운영자가 직접 배송완료로 바꾸는 처리. 추적 안 되는 택배사 · 직접 배송 · 퀵 · 추적 실패가 끝내 풀리지 않는 건에 씁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '배송완료가 되어야 자동 구매확정이 흐르고 적립금이 나가고 매출이 굳습니다. 그런데 택배 조회가 지원하지 않는 택배사나 사장님이 직접 가져다 준 주문은 영원히 배송중에 남습니다. 그래서 운영자가 완료일을 넣어 직접 닫을 수 있게 합니다. 여러 건을 체크해 한 번에 처리하고, 완료일은 오늘이 채워져 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '수동 배송완료는 고객의 반품 기한과 자동 구매확정 날짜를 움직이는 처리입니다. 그래서 사유가 필수이고, 처리 기록에 수동 처리(운영자 이름)로 남으며, 배송완료 탭에 수동 처리 표시가 붙습니다. 추적이 정상으로 되고 있는 주문(이동 중)에는 경고를 한 번 더 띄웁니다. 스마트스토어 주문은 네이버가 배송완료를 판단하므로 여기서 바꿀 수 없습니다. 잘못 처리했으면 구매확정 전까지 배송중으로 되돌릴 수 있습니다.'),
    Canvas({ label: 'A-13 · 배송중 탭 · 택배사가 직접 배송·퀵인 주문 (추적 단계 대신 추적 안 됨 · 줄마다 배송완료 처리 버튼)' }, Page('배송중', Search('발송일 최근 7일 · 택배사 직접 배송·퀵'),
        ListHead({ total: 2, left: Chips(['전체 42', '추적 안 되는 배송 2'], '추적 안 되는 배송 2'), right: PerPage(50) }),
        Table({ check: true, cols: COLS, rows: DIRECT.map(directRow) }),
        Note('직접 배송 · 퀵서비스 · 추적을 지원하지 않는 택배사로 보낸 주문은 자동으로 배송완료가 되지 않습니다. 전달이 끝나면 배송완료 처리를 눌러 주세요.'),
    )),
    Canvas({ label: 'A-13 · 2건 선택 → 배송완료 처리 버튼 → 팝업 (완료일 초기값 오늘)' }, Overlay({ bg: Page('배송중', Search(), BulkBar({ count: 2, sub: '직접 배송 1건 · 퀵서비스 1건' }, Btn('배송완료 처리', 'primary')), Table({ check: true, checked: [0, 1], cols: COLS, rows: DIRECT.map(directRow) })), h: 640 },
        Modal({ title: '배송완료 처리 · 2건', w: 600, foot: [Btn('취소'), Btn('2건 배송완료 처리', 'primary')] },
            manualForm(),
            Note('배송완료로 바뀌면 그날부터 7일 뒤(11-18) 자동 구매확정됩니다. 처리 기록에 수동 처리(이보림)로 남습니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '처리 사유 고르는 중 (목록 열림)', right: '팝업만', pad: 20 },
            Modal({ title: '배송완료 처리 · 2건', w: 600, foot: [Btn('취소'), Btn('2건 배송완료 처리', { kind: 'primary', disabled: true })] },
                manualForm({ memo: '', reason: Select({ placeholder: '사유를 고르세요', w: 280, open: true, options: ['직접 배송·퀵으로 전달함', '추적을 지원하지 않는 택배사', '택배사에 전화로 배송완료를 확인함', '고객이 받았다고 알려 옴', '기타(직접 입력)'] }) }))),
        Canvas({ size: 'auto', label: '입력 오류 (완료일이 발송일보다 앞)', right: '팝업만', pad: 20 },
            Modal({ title: '배송완료 처리 · 2건', w: 600, foot: [Btn('취소'), Btn('2건 배송완료 처리', { kind: 'primary', disabled: true })] },
                manualForm({ date: '2026-11-09', err: '배송완료일이 발송일(11-10)보다 앞입니다. 11-10부터 오늘(11-11) 사이에서 고르세요.' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '추적이 잘 되고 있는 주문 · 스마트스토어 주문이 섞였을 때', right: '팝업만', pad: 20 },
            Modal({ title: '선택한 4건 중 2건만 바로 처리할 수 있습니다', w: 560, foot: [Btn('취소'), Btn('2건만 처리'), Btn('이동 중 1건도 함께 처리', 'primary')] },
                Table({ dense: true, cols: [{ t: '주문자', w: 70 }, { t: '배송', w: 150 }, '처리'], rows: [
                    ['정수아', '직접 배송', `${Icon('check-min')} 배송완료로 바꿉니다`], ['이하은', '퀵서비스', `${Icon('check-min')} 배송완료로 바꿉니다`],
                    { hl: true, c: ['김민지', 'CJ대한통운 · 배송 출발', '택배 조회가 되고 있는 주문입니다. 오늘 안에 자동으로 배송완료가 될 수 있습니다. 그래도 지금 바꾸려면 오른쪽 버튼을 누르세요'] },
                    { dim: true, c: ['임재현', '스마트스토어 주문', '네이버가 배송완료를 판단합니다. 여기서 바꿀 수 없습니다'] },
                ] }),
            )),
        Canvas({ size: 'auto', label: '처리 완료', right: '토스트만', pad: 20 }, Toast('2건을 배송완료로 바꿨습니다. 자동 구매확정 예정일 11-18.', { action: '배송완료 탭 보기' })),
    ),
    Canvas({ label: 'A-13 · 배송완료 탭 · 수동 처리 칩 (수동 처리한 건만 · 잘못 처리했으면 배송중으로 되돌리기)' }, Page('배송완료', Search('배송완료일 최근 7일'),
        ListHead({ total: 4, left: Chips(['전체 99', '자동 반영 95', '수동 처리 4'], '수동 처리 4'), right: PerPage(50) }),
        Table({ check: true, cols: [{ t: '주문번호', w: 148 }, { t: '채널', w: 96 }, '상품 · 구성', { t: '받는 분', w: 70 }, { t: '배송', w: 110 }, { t: '배송완료일 · 메모', w: 170 }, { t: '처리한 사람 · 사유', w: 190 }, { t: '', w: 124 }], rows: [
            ['<u>20261110-000111</u>', ChannelBadge('자사몰'), `${P}<small>${O4} · 2개</small>`, '정수아', '직접 배송', '11-11 오후 2시쯤<small>본인 수령 확인(전화)</small>', '이보림 · 11-11 15:02<small>직접 배송·퀵으로 전달함</small>', Btn('배송중으로 되돌리기', { size: 'sm' })],
            ['<u>20261105-000066</u>', ChannelBadge('자사몰'), `${P}<small>${O1} · 1개</small>`, '강지호', '우체국택배', '11-06 오전<small>택배사 전화 확인</small>', '이보림 · 11-07 09:40<small>택배사에 전화로 배송완료를 확인함</small>', Btn('배송중으로 되돌리기', { size: 'sm' })],
        ] }),
    )),
    Canvas({ size: 'auto', label: '배송중으로 되돌리기 → 확인 (구매확정 전까지만)', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '이 주문을 배송중으로 되돌릴까요?', desc: '정수아 · 20261110-000111<br>수동으로 넣은 배송완료일이 지워지고 자동 구매확정 예정일(11-18)도 없어집니다. 고객에게는 알림이 가지 않습니다.<br>이미 구매확정된 주문은 되돌릴 수 없습니다.', ok: '배송중으로 되돌리기', danger: true })),
);

const LONG = [
    { no: '20261106-000079', ch: '자사몰', opt: O1, qty: 1, name: '이하은', tel: '010-****-7730', co: '롯데택배', inv: '240118873352', sent: '11-06 15:40', step: '간선 상차', at: '11-07 02:15 · 군포 터미널', day: '발송 뒤 5일', stop: '4일째 움직임 없음', noti: '지연 안내 안 보냄' },
];
const LONG_COLS = [{ t: '주문번호 · 발송일시', w: 148 }, { t: '채널', w: 90 }, '상품 · 구성', { t: '받는 분', w: 96 }, { t: '택배사 · 송장번호', w: 124 }, { t: '마지막 추적 단계', w: 150 }, { t: '경과 · 고객 안내', w: 140 }, { t: '', w: 96 }];
const longRow = (o) => ({ hl: true, c: [`<u>${o.no}</u><small>발송 ${o.sent}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, `${o.co}<small><u>${o.inv}</u></small>`, `<b>${o.step}</b><small>${o.at}</small>`, `${Badge(o.day, 'warn')}<small>${o.stop} · ${o.noti}</small>`, Btn('처리 고르기', { size: 'sm', kind: 'primary' })] });

const state6 = StateBlock({ idx: 6, title: '장기 배송 탭', note: '발송한 지 5일이 넘었는데 아직 배송완료가 안 된 주문만 모은 탭. 분실·오배송·주소 불명일 가능성이 높아 사람이 확인해야 합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '택배는 보통 1~2일이면 도착합니다. 5일이 넘도록 배송중이면 터미널에 멈춰 있거나 분실된 것입니다. 고객이 먼저 화내며 전화하기 전에 운영자가 알아채도록 탭을 따로 두고 탭 숫자로 알립니다. 추적 실패 탭(송장이 틀림)과는 다릅니다. 여기는 송장은 맞고 추적도 되는데 물건이 안 가는 건입니다. 줄에서 바로 택배사에 확인하고, 고객에게 지연을 알리고, 분실이면 다시 보내거나 환불합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '기준 일수(초기값 발송 뒤 5일)는 설정 > 주문·클레임 정책에서 바꿉니다. 제주·도서산간은 기준에 2일을 더합니다. 분실로 다시 보내면 새 결제 없이 재발송 송장만 붙고 재고가 한 번 더 빠집니다(매출은 다시 잡지 않음). 택배사 분실 보상 접수는 화면 밖의 일이므로 메모로 남깁니다. 스마트스토어 주문도 이 탭에 나오지만 재발송·환불은 네이버 절차를 따릅니다.'),
    Canvas({ label: 'A-13 · 장기 배송 탭 (발송 뒤 5일 넘게 배송중)' }, Page('장기 배송',
        Note('발송한 지 5일이 넘도록 배송완료가 되지 않은 주문입니다(제주·도서산간은 7일). 택배사에 확인하고 고객에게 먼저 알려 주세요.', { warn: true }),
        ListHead({ total: 1, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: LONG_COLS, rows: LONG.map(longRow) }),
    )),
    Canvas({ label: 'A-13 · 처리 고르기 버튼 → 팝업 (택배사 확인 결과에 따라 할 일이 갈림)' }, Overlay({ bg: Page('장기 배송', Table({ check: true, cols: LONG_COLS, rows: LONG.map(longRow) })), h: 760 },
        Modal({ title: '장기 배송 처리 · 20261106-000079', w: 640, foot: [Btn('닫기'), Btn('저장하고 고객에게 알리기', 'primary')] },
            KV([['받는 분', '이하은 · 010-****-7730 · 부산 해운대구 센텀중앙로 ***'], ['송장', '롯데택배 240118873352 · 발송 11-06 15:40 (5일 전)'], ['마지막 추적', '간선 상차 · 11-07 02:15 · 군포 터미널 · 그 뒤 4일째 움직임 없음'], ['택배사 고객센터', '롯데택배 1588-2121 <u>택배사 사이트에서 보기</u>']], { wide: true }),
            '<div style="height:12px"></div>',
            FormTable([
                { k: '택배사 확인 결과', required: true, v: [Radio('배송 지연 (곧 도착 예정)', { on: true }), Radio('분실·파손 (다시 보내야 함)'), Radio('주소 불명·수취 거부로 반송 중'), Radio('이미 받았음 (추적만 안 바뀜)')] },
                { k: '도착 예정일', v: Input({ value: '2026-11-13 (금)', icon: 'calendar', w: 200 }), help: '택배사가 알려 준 날짜. 고객 알림에 들어갑니다.' },
                { k: '메모', v: Textarea({ value: '롯데택배 상담원 확인: 군포 터미널 물량 지연, 11-13 도착 예정.', h: 56, count: '37 / 200' }) },
                { k: '고객 알림', v: Check('배송 지연 안내 보내기 (사유 · 도착 예정일)', { on: true }) },
            ]),
            Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 이하은 님, 주문하신 상품의 배송이 택배사 사정으로 늦어지고 있습니다. 죄송합니다.<br>송장번호 롯데택배 240118873352<br>도착 예정일: 11월 13일(금)<br>예정일이 지나도 받지 못하시면 고객센터 070-****-1234 로 연락해 주세요.', { sm: true })),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '분실·파손을 고른 모습 (다시 보내기 · 환불 중 고르기)', right: '팝업만', pad: 20 },
            Modal({ title: '장기 배송 처리 · 20261106-000079', w: 600, foot: [Btn('닫기'), Btn('다시 보내기로 저장', 'primary')] },
                FormTable([
                    { k: '택배사 확인 결과', required: true, v: [Radio('배송 지연 (곧 도착 예정)'), Radio('분실·파손 (다시 보내야 함)', { on: true })] },
                    { k: '고객과 정한 처리', required: true, v: [Radio('같은 상품을 다시 보내기', { on: true }), Radio('주문을 취소하고 환불하기')], help: '다시 보내기: 새 결제 없이 발주 확인·발송 처리의 배송준비에 재발송 표시로 올라갑니다. 환불: 판매자 사유 취소로 전액 환불합니다(배송비 포함).' },
                    { k: '재고', v: Text(`${O1} 1개를 더 뺍니다 (재고 143 → 142) · 분실분은 재고 변동 이력에 분실로 남음`) },
                    { k: '고객 알림', v: Check('분실 안내 · 재발송 안내 보내기', { on: true }) },
                ]),
            )),
        Canvas({ size: 'auto', label: '이미 받았음을 고른 모습 → 수동 배송완료 처리로 이어짐', right: '팝업만', pad: 20 },
            Modal({ title: '장기 배송 처리 · 20261106-000079', w: 560, foot: [Btn('닫기'), Btn('배송완료 처리', 'primary')] },
                FormTable([
                    { k: '택배사 확인 결과', required: true, v: [Radio('이미 받았음 (추적만 안 바뀜)', { on: true })] },
                    { k: '배송완료일', required: true, v: Input({ value: '2026-11-08', icon: 'calendar', w: 160 }) },
                    { k: '처리 사유', required: true, v: Select({ value: '고객이 받았다고 알려 옴', w: 260 }) },
                ]),
                Note('수동 배송완료 처리와 같은 기록이 남습니다. 완료일이 7일 넘게 지났으면 바로 자동 구매확정 대상이 됩니다.'),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '처리 뒤 줄의 모습 (지연 안내 보냄 · 도착 예정일까지 탭에 남음)', right: '부분', pad: 20 }, `<div style="width:620px">${Box({ flat: true }, Text(`${Badge('발송 뒤 5일', 'warn')} <b>20261106-000079 · 이하은</b> · 롯데택배 240118873352<br>택배사 확인: 배송 지연 · 도착 예정 11-13 · 지연 안내 11-11 10:40 발송(알림톡 성공) · 메모 1건<br>도착 예정일이 지나도 배송완료가 안 되면 다시 강조되고 대시보드에 올라갑니다.`, { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '장기 배송 주문이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:460px">${Empty({ icon: 'check-circle-o', title: '오래 걸리는 배송이 없습니다', desc: '발송 뒤 5일이 넘도록 배송완료가 안 된 주문이 없습니다.', action: Btn('배송중 탭으로', 'primary') })}</div>`),
    ),
);

export default function A13() {
    return [state1, state2, state3, state4, state5, state6].join('');
}
