import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast, ExcelResult,
    Box, KV, Note, Text, Icon, Empty, PriceSummary, Grid, Img, Flex, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };
const TABS = [{ t: '반품 요청', n: 1 }, { t: '수거중', n: 4 }, { t: '수거완료(검수)', n: 2 }, { t: '환불 실패', n: 1 }, { t: '환불완료', n: 31 }, { t: '거부', n: 3 }];
const STEPS = ['반품 요청', '수거중', '수거완료(검수)', '환불완료'];

const Page = (tab, ...body) => AdminLayout({ active: 'a-16', counts: COUNTS, actions: [Btn('반품·교환 배송비 설정', { icon: 'cog' }), Btn('회수 송장 엑셀 일괄 등록', { icon: 'file-upload-o' })], desc: '반품은 요청 → 수거 → 검수 → 환불 순서로 움직입니다. 탭 숫자는 그 단계에서 운영자가 할 일이 남은 건수입니다.' }, Tabs(TABS, tab), body);
const Search = (sum) => Filters({ open: false, summary: sum || '요청일 최근 1개월 · 채널 전체 · 사유 전체' });

const REQ = { no: '20261107-000088', ch: '자사몰', opt: O2, qty: 1, name: '임재현', tel: '010-****-6642', why: '단순 변심', memo: '맛이 입에 맞지 않아요. 한 포만 뜯었습니다.', at: '11-10 19:40', amt: '93,000원', pay: '신용카드', pick: '판매자 회수 요청', fee: '고객 부담' };
const REQ_COLS = [{ t: '주문번호 · 요청 일시', w: 150 }, { t: '채널', w: 96 }, '상품 · 구성', { t: '주문자', w: 92 }, { t: '반품 사유', w: 180 }, { t: '회수 방법', w: 104 }, { t: '반품 배송비', w: 84 }, { t: '결제금액', w: 84, align: 'right' }, { t: '', w: 120 }];
const reqRow = (o) => [`<u>${o.no}</u><small>요청 ${o.at}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, `<b>${o.why}</b><small>${o.memo}</small>`, o.pick, o.fee === '고객 부담' ? Badge('고객 부담', 'bold') : Badge('판매자 부담', 'line'), `${o.amt}<small>${o.pay}</small>`, `${Btn('수거 지시', { size: 'sm', kind: 'primary' })} ${Btn('거부', { size: 'sm' })}`];

const reqDetail = Modal({ title: '반품 요청 내용 · 20261107-000088', w: 720, foot: [Btn('닫기'), Btn('거부'), Btn('수거 지시', 'primary')] },
    Stepper(STEPS, 0),
    Grid(2,
        KV([['주문자', '임재현 · 010-****-6642'], ['반품 품목', `${P}<br>${O2} · 1개 (주문 수량 1개 중 1개)`], ['배송완료', '11-08 15:12 (3일 전 · 반품 기한 11-15까지)'], ['결제', '신용카드 93,000원']]),
        KV([['반품 사유', '<b>단순 변심</b> (고객 부담 사유)'], ['고객이 쓴 말', '맛이 입에 맞지 않아요. 한 포만 뜯었습니다.'], ['회수 방법', '판매자 회수 요청 (우리가 택배를 보냄)'], ['회수지', '서울 송파구 올림픽로 *** · 임수경 010-****-6642']]),
    ),
    '<div style="height:14px"></div>',
    Box({ title: '고객이 올린 사진', sub: '2장 · 누르면 크게 보기' }, Flex({ gap: 8 }, Img({ w: 120, h: 120, label: '상자 겉면' }), Img({ w: 120, h: 120, label: '뜯은 포 1개' }))),
    Box({ flat: true, title: '고객에게 안내된 환불 예정 금액' }, Text('93,000원 - 반품 배송비 6,000원(왕복) = <b>87,000원</b> · 검수 결과에 따라 달라질 수 있다고 안내됨', { sm: true })),
);

const state1 = StateBlock({ idx: 1, title: '요청', note: '고객이 마이페이지에서 반품을 신청한 직후. 운영자는 내용을 보고 수거를 지시하거나 거부합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '반품 요청에서 운영자가 판단할 것은 세 가지입니다. 반품 기한 안인가, 사유가 누구 책임인가(반품 배송비를 누가 내는가), 회수를 누가 부르는가. 이 세 가지를 목록 한 줄에서 읽을 수 있게 하고, 줄을 누르면 고객이 쓴 말과 사진을 봅니다. 사유는 고객 부담(단순 변심 · 주문 실수)과 판매자 부담(불량 · 파손 · 오배송)으로 나뉘며 이 구분이 환불 계산까지 이어집니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '고객이 고른 사유가 실제와 다를 수 있습니다(불량이라고 했는데 검수하니 정상). 그래서 배송비 부담은 요청 단계의 값이 끝이 아니고 검수 단계에서 운영자가 바꿀 수 있습니다. 반품 기한(배송완료 뒤 7일, 설정 > 주문·클레임 정책)이 지난 요청은 고객 화면에서 막히지만 불량 사유는 기한과 관계없이 받습니다.'),
    Canvas({ label: 'A-16 · 반품 요청 탭' }, Page('반품 요청', Search(),
        ListHead({ total: 1, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] }),
        Note('금액은 예시 값입니다(판매가 미확정). 반품 배송비는 설정 > 배송의 반품·교환 배송비(지금 편도 3,000원)를 따릅니다.'),
    )),
    Canvas({ label: 'A-16 · 요청 줄을 누름 → 요청 내용 팝업 (사유 · 사진 · 안내된 환불 예정 금액)' }, Overlay({ bg: Page('반품 요청', Search(), ListHead({ total: 1, right: PerPage(50) }), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), h: 760 }, reqDetail)),
    Canvas({ label: 'A-16 · 검색 조건 펼침' }, Page('반품 요청',
        Filters({ rows: [
            { k: '기간', v: [Select({ value: '요청일', w: 110 }), Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })] },
            { k: '채널', v: RadioGroup(['전체', '자사몰', '스마트스토어'], '전체') },
            { k: '반품 사유', v: RadioGroup(['전체', '고객 부담 사유', '판매자 부담 사유'], '전체') },
            { k: '회수 방법', v: RadioGroup(['전체', '판매자 회수 요청', '고객이 직접 보냄'], '전체') },
            { k: '검색어', v: [Select({ value: '주문자 이름', w: 150 }), Input({ placeholder: '주문자 이름 · 연락처 뒷 4자리 · 주문번호 · 회수 송장번호', icon: 'search', w: 400 })] },
        ] }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '스마트스토어 반품 요청 줄 (네이버에서 가져옴)', right: '부분', pad: 20 }, `<div style="width:520px">${Box({ flat: true }, Text(`${ChannelBadge('스마트스토어')} <b>2026110344920518 · 박서준</b><br>사유: 상품 파손 (판매자 부담) · 회수: 네이버 자동 회수 접수됨 (CJ대한통운 회수 송장 690012345512)<br>스마트스토어 반품은 네이버가 회수 택배를 자동으로 부릅니다. 수거 지시 단계 없이 바로 수거중 탭으로 들어오고, 검수와 환불 승인 결과만 네이버로 전송합니다.`, { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '반품 요청이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:440px">${Empty({ icon: 'check-circle-o', title: '처리할 반품 요청이 없습니다', desc: '고객이 반품을 신청하면 여기에 나타나고 알림이 갑니다.' })}</div>`),
    ),
);

const pickForm = (o = {}) => FormTable([
    { k: '대상', v: Text(`임재현 · ${P} ${O2} 1개`) },
    { k: '회수 방법', required: true, v: [Radio('판매자 회수 요청 (택배사에 회수 접수)', { on: o.mode !== 'self' }), Radio('고객이 직접 보냄 (고객이 송장을 입력)', { on: o.mode === 'self' })], help: '고객이 신청할 때 고른 값이 채워져 있습니다. 통화로 바뀌었으면 여기서 고칩니다.' },
    ...(o.mode === 'self' ? [
        { k: '보낼 곳(반품지)', v: Text('인천광역시 제물포구 방축로83번길 23, B동 3층 305호 · 이너에라 반품 담당 · 070-****-1234') },
        { k: '고객 송장', v: [Select({ placeholder: '택배사', w: 150 }), Input({ placeholder: '고객이 알려 주면 입력 (비워 두면 고객이 직접 입력)', w: 300 })] },
    ] : [
        { k: '회수 택배사', required: true, v: o.courier || Select({ value: 'CJ대한통운 (계약 택배사)', w: 240 }) },
        { k: '회수 접수', required: true, v: [Radio('지금 자동으로 회수 접수하기', { on: !o.manual }), Radio('이미 접수했음 (회수 송장 직접 입력)', { on: o.manual })], help: '자동 접수는 택배사 계약 연동이 되어 있을 때만 됩니다(설정 > 배송). 안 되어 있으면 택배사 프로그램에서 접수한 뒤 송장을 넣습니다.' },
        ...(o.manual ? [{ k: '회수 송장번호', required: true, v: Input({ value: o.inv === undefined ? '' : o.inv, placeholder: '숫자 12자리', w: 220, error: !!o.err, focus: !o.err }), error: o.err }] : []),
        { k: '회수지', v: [Text('서울 송파구 올림픽로 *** · 임수경 010-****-6642'), Btn('회수지 고치기', { size: 'sm' })], help: '주문 배송지가 채워져 있습니다. 고객이 다른 곳에서 보내겠다고 하면 고칩니다.' },
        { k: '회수 희망일', v: Input({ value: '2026-11-12 (목)', icon: 'calendar', w: 200 }) },
    ]),
    { k: '고객 알림', v: Check(o.mode === 'self' ? '반품 접수 · 보낼 곳 안내 보내기' : '반품 접수 · 회수 방문 안내 보내기', { on: true }) },
]);

const PICK = [
    ['20261106-000079', '자사몰', O1, '이하은', '판매자 회수', 'CJ대한통운', '690012345401', '회수 접수', '11-10 14:00', '1일째', false],
    ['20261105-000070', '자사몰', O2, '정수아', '판매자 회수', 'CJ대한통운', '690012345377', '회수 완료 · 이동 중', '11-10 09:20', '2일째', false],
    ['2026110344920518', '스마트스토어', O2, '박서준', '네이버 자동 회수', 'CJ대한통운', '690012345512', '반품지 도착', '11-11 09:02', '3일째', false],
    ['20261101-000044', '자사몰', O1, '강지호', '고객이 직접 보냄', '', '', '고객이 아직 송장을 넣지 않음', '11-04 10:00', '7일째', true],
];
const PICK_COLS = [{ t: '주문번호', w: 146 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 64 }, { t: '회수 방법', w: 112 }, { t: '회수 택배사 · 송장', w: 124 }, { t: '회수 단계', w: 170 }, { t: '경과', w: 70 }, { t: '', w: 100 }];
const pickRow = (p) => ({ hl: p[10], c: [`<u>${p[0]}</u>`, ChannelBadge(p[1]), `${P}<small>${p[2]} · 1개</small>`, p[3], p[4], p[5] ? `${p[5]}<small><u>${p[6]}</u></small>` : '<small>송장 없음</small>', `<b>${p[7]}</b><small>${p[8]}</small>`, p[10] ? Badge(p[9], 'warn') : p[9], p[7] === '반품지 도착' ? Btn('수거완료 처리', { size: 'sm', kind: 'primary' }) : p[10] ? Btn('고객에게 재안내', { size: 'sm' }) : Btn('송장 수정', { size: 'sm' })] });

const state2 = StateBlock({ idx: 2, title: '수거 지시(회수 송장)', note: '요청을 받아들이고 물건을 가져오게 하는 단계. 회수 택배를 부르고 회수 송장을 남기면 수거중 탭으로 넘어갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '반품에서 가장 손이 가는 일이 회수 접수입니다. 택배사 연동이 되어 있으면 버튼 한 번에 회수가 접수되고 회수 송장이 자동으로 들어옵니다. 연동이 없으면 택배사 프로그램에서 접수한 회수 송장을 넣습니다. 여러 건이면 회수 송장도 엑셀로 한 번에 올립니다(출고 송장과 같은 방식). 고객이 직접 보내는 경우에는 보낼 곳을 알림으로 안내하고 고객이 송장을 넣기를 기다립니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '회수 송장은 출고 송장과 다른 번호입니다. 회수 추적도 택배 조회 연동으로 2시간마다 가져와, 반품지에 도착하면 줄에 수거완료 처리 버튼이 켜집니다. 고객이 직접 보내기로 하고 7일 넘게 송장을 넣지 않으면 강조하고 재안내할 수 있게 합니다. 스마트스토어 반품은 네이버가 회수를 접수하므로 이 팝업이 없습니다.'),
    Canvas({ label: 'A-16 · 수거 지시 버튼 → 팝업 (판매자 회수 요청 · 자동 회수 접수)' }, Overlay({ bg: Page('반품 요청', Search(), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), h: 780 },
        Modal({ title: '수거 지시 · 20261107-000088', w: 640, foot: [Btn('닫기'), Btn('회수 접수하고 수거중으로', 'primary')] },
            Stepper(STEPS, 0), pickForm(),
            Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 임재현 님, 반품 신청이 접수되었습니다.<br>CJ대한통운 기사님이 11월 12일(목)에 방문해 상품을 가져갑니다.<br>받으신 상자에 그대로 넣어 문 앞에 두시면 됩니다.<br>환불은 상품이 도착해 확인이 끝난 뒤 진행됩니다.', { sm: true })),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '이미 접수했음 → 회수 송장 직접 입력 · 택배사 고르는 중', right: '팝업만', pad: 20 },
            Modal({ title: '수거 지시 · 20261107-000088', w: 640, foot: [Btn('닫기'), Btn('수거중으로', { kind: 'primary', disabled: true })] },
                pickForm({ manual: true, courier: Select({ value: 'CJ대한통운 (계약 택배사)', w: 240, open: true, search: '', options: [{ t: 'CJ대한통운', sub: '계약 택배사', on: true }, '한진택배', '롯데택배', '우체국택배', '로젠택배'] }) }))),
        Canvas({ size: 'auto', label: '회수 송장 입력 오류', right: '팝업만', pad: 20 },
            Modal({ title: '수거 지시 · 20261107-000088', w: 640, foot: [Btn('닫기'), Btn('수거중으로', { kind: 'primary', disabled: true })] },
                pickForm({ manual: true, inv: '581233440877', err: '이 번호는 이 주문의 출고 송장번호입니다. 회수용으로 새로 받은 송장번호를 넣어 주세요.' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '고객이 직접 보냄을 고른 모습 (입력칸이 바뀜)', right: '팝업만', pad: 20 },
            Modal({ title: '수거 지시 · 20261107-000088', w: 640, foot: [Btn('닫기'), Btn('반품지 안내 보내고 수거중으로', 'primary')] }, pickForm({ mode: 'self' }))),
        Canvas({ size: 'auto', label: '자동 회수 접수 실패 (택배사 응답 오류)', right: '팝업만', pad: 20 },
            Confirm({ w: 440, title: '회수 접수에 실패했습니다', desc: 'CJ대한통운에서 회수지 주소를 확인하지 못했습니다 (상세 주소 없음).<br>회수지를 고친 뒤 다시 접수하거나, 택배사 프로그램에서 직접 접수하고 회수 송장을 넣어 주세요.<br>주문은 아직 반품 요청 상태입니다.', foot: [Btn('회수 송장 직접 입력'), Btn('회수지 고치기', 'primary')] })),
    ),
    Canvas({ label: 'A-16 · 수거중 탭 (회수 추적 단계 · 반품지 도착 줄에 수거완료 처리 버튼)' }, Page('수거중', Search(),
        ListHead({ total: 4, left: Chips(['전체 4', '회수 접수 1', '이동 중 1', '반품지 도착 1', '고객 송장 대기 1'], '전체 4'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: PICK_COLS, rows: PICK.map(pickRow) }),
    )),
    Canvas({ label: 'A-16 · 회수 송장 엑셀 일괄 등록 버튼 → 검증 결과 (여러 건을 택배사 프로그램에서 한꺼번에 접수한 날)' }, Overlay({ bg: Page('반품 요청', Search()), h: 520 },
        Modal({ title: '회수 송장 엑셀 일괄 등록', w: 720, foot: [Btn('양식 내려받기 (반품 요청 6건)', { icon: 'file-download-o' }), Btn('파일 다시 올리기'), Btn('성공 5건 수거중으로', 'primary')] },
            ExcelResult({ total: 6, ok: 5, fail: 1, rows: [{ row: 4, key: '20261103-000055', value: '69001234', reason: '회수 송장번호 자릿수가 맞지 않습니다 (CJ대한통운은 숫자 12자리)' }], note: '성공한 5건은 수거중으로 바뀌고 고객에게 회수 방문 안내가 갑니다. 오류 1행은 고쳐서 다시 올리거나 수거 지시 팝업에서 직접 넣으세요.' }),
        ))),
);

const INSPECT = [
    ['20261104-000060', '자사몰', O2, 1, '윤서연', '단순 변심', '고객 부담', '11-10 15:30', '1일째'],
    ['20261102-000048', '자사몰', O1, 1, '최도윤', '상품 불량(포장 터짐)', '판매자 부담', '11-09 11:10', '2일째'],
];
const INS_COLS = [{ t: '주문번호', w: 146 }, { t: '채널', w: 96 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '고객이 고른 사유', w: 160 }, { t: '배송비 부담', w: 96 }, { t: '반품지 도착', w: 100 }, { t: '검수 대기', w: 76 }, { t: '', w: 90 }];
const insRow = (d) => [`<u>${d[0]}</u>`, ChannelBadge(d[1]), `${P}<small>${d[2]} · ${d[3]}개</small>`, d[4], d[5], d[6] === '고객 부담' ? Badge('고객 부담', 'bold') : Badge('판매자 부담', 'line'), d[7], d[8], Btn('검수하기', { size: 'sm', kind: 'primary' })];

const inspectForm = (o = {}) => [
    Stepper(STEPS, 2),
    KV([['주문자', '윤서연 · 010-****-3317'], ['반품 품목', `${P} · ${O2} · 1개`], ['고객이 고른 사유', '단순 변심 (고객 부담)'], ['회수', 'CJ대한통운 690012345290 · 11-10 15:30 반품지 도착']], { wide: true }),
    '<div style="height:14px"></div>',
    FormTable([
        { k: '받은 수량', required: true, v: [Input({ value: '1', suffix: '개', w: 100 }), Text('요청 수량 1개', { sm: true, mute: true })] },
        { k: '검수 결과', required: true, v: [Radio('이상 없음 (다시 팔 수 있음)', { on: o.result === 'ok' }), Radio('고객 책임 훼손 (개봉·사용·구성품 없음)', { on: o.result === 'used' }), Radio('불량 판정 (제품 문제)', { on: o.result === 'bad' })] },
        ...(o.result === 'used' ? [{ k: '훼손 내용', required: true, v: Textarea({ value: '2박스 중 1박스 개봉, 스틱 5포 사용.', h: 56, count: '21 / 200' }), help: '고객에게 그대로 안내됩니다. 훼손 차감 금액은 환불 단계에서 넣습니다.' }] : []),
        ...(o.result === 'bad' ? [{ k: '배송비 부담', v: Text(`${Badge('판매자 부담', 'line')} 으로 바뀝니다 (고객이 고른 사유는 단순 변심이었음) · 반품 배송비를 차감하지 않습니다`) }] : [{ k: '배송비 부담', v: Text(`${Badge('고객 부담', 'bold')} 그대로 · 환불 금액에서 반품 배송비를 뺍니다 <u>판매자 부담으로 바꾸기</u>`) }]),
        { k: '검수 사진', v: Flex({ gap: 8 }, Img({ w: 84, h: 84, label: '도착 상태' }), `<div class="wf-img" style="width:84px;height:84px;border:1.5px dashed #a8a8b0;background:var(--box)">${Icon('plus')}<span>추가</span></div>`), help: 'JPG · PNG · 장당 5MB 이하 · 최대 5장. 분쟁이 생기면 근거가 됩니다.' },
        { k: '재고', required: true, v: o.result === 'ok' ? [Radio(`판매 가능 재고로 되돌리기 (${O2} +1)`, { on: true }), Radio('되돌리지 않기')] : [Radio('판매 가능 재고로 되돌리기'), Radio('되돌리지 않기 (폐기 · 불량 재고)', { on: true })], help: '식품처럼 한 번 나간 상품을 다시 팔지 않는 몰은 설정 > 주문·클레임 정책에서 초기값을 되돌리지 않기로 바꿉니다.' },
    ]),
];

const state3 = StateBlock({ idx: 3, title: '수거 완료·검수', note: '물건이 반품지에 도착한 뒤. 열어 보고 이상 없음인지 불량인지 판정하면 환불 단계로 넘어갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '환불 금액은 검수에서 정해집니다. 고객이 단순 변심이라 했는데 열어 보니 제품 불량이면 배송비는 판매자가 내야 하고, 반대로 불량이라 했는데 멀쩡하고 이미 뜯어 썼다면 차감이 생깁니다. 그래서 검수 결과를 세 가지(이상 없음 · 고객 책임 훼손 · 불량 판정)로 받고, 결과에 따라 배송비 부담과 재고 처리가 바뀌는 것을 팝업 안에서 바로 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '검수 사진은 고객과 다툼이 생겼을 때의 근거입니다(이미지 규격: JPG · PNG, 장당 5MB 이하, 최대 5장). 건강기능식품처럼 되팔 수 없는 상품은 재고로 되돌리지 않는 것이 초기값이어야 하므로 몰 설정으로 바꿀 수 있게 합니다. 받은 수량이 요청 수량보다 적으면 받은 만큼만 환불합니다.'),
    Canvas({ label: 'A-16 · 수거완료(검수) 탭' }, Page('수거완료(검수)', Search(),
        ListHead({ total: 2, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: INS_COLS, rows: INSPECT.map(insRow) }),
    )),
    Canvas({ label: 'A-16 · 검수하기 버튼 → 팝업 (이상 없음)' }, Overlay({ bg: Page('수거완료(검수)', Search(), Table({ check: true, cols: INS_COLS, rows: INSPECT.map(insRow) })), h: 820 },
        Modal({ title: '검수 · 20261104-000060', w: 660, foot: [Btn('닫기'), Btn('검수 저장하고 환불 계산으로', 'primary')] }, inspectForm({ result: 'ok' })))),
    CanvasRow(
        Canvas({ size: 'auto', label: '불량 판정을 고른 모습 (배송비 부담이 판매자로 바뀜 · 재고 되돌리지 않음)', right: '팝업만', pad: 20 },
            Modal({ title: '검수 · 20261104-000060', w: 660, foot: [Btn('닫기'), Btn('검수 저장하고 환불 계산으로', 'primary')] }, inspectForm({ result: 'bad' }))),
        Canvas({ size: 'auto', label: '고객 책임 훼손을 고른 모습 (훼손 내용 입력칸이 생김)', right: '팝업만', pad: 20 },
            Modal({ title: '검수 · 20261104-000060', w: 660, foot: [Btn('닫기'), Btn('반품 거부'), Btn('검수 저장하고 환불 계산으로', 'primary')] }, inspectForm({ result: 'used' }))),
    ),
    Canvas({ size: 'auto', label: '수거완료(검수) 탭에서 2건을 선택해도 검수·환불 버튼은 없음 (한 건씩만)', right: '일괄 처리 바만', pad: 20 },
        `<div style="width:760px">${BulkBar({ count: 2, sub: '검수 대기 2건' }, Btn('엑셀 내려받기', { kind: 'line', icon: 'download' }))}${Note('검수와 환불은 한 건씩 합니다. 물건 상태를 보지 않고 여러 건을 한꺼번에 환불하면 훼손된 상품까지 환불하는 사고가 납니다. 줄의 검수하기 버튼으로 한 건씩 여세요.', { warn: true })}</div>`),
);

const refundCalc = (o = {}) => Grid('1fr 300px',
    Table({ dense: true, cols: [{ t: '항목', w: 170 }, { t: '금액', w: 90, align: 'right' }, '계산'], rows: [
        ['반품 상품 금액', '93,000원', `${O2} 1개`],
        ['쿠폰 할인 나눠 빼기', '- 3,000원', '가입 축하 3,000원 쿠폰 (품목이 하나라 전부)'],
        ...(o.seller ? [['반품 배송비', '0원', '판매자 부담 사유(불량 판정) → 빼지 않음']] : [
            { hl: true, c: ['반품 배송비 (회수)', '- 3,000원', '고객 부담 사유(단순 변심) · 편도 3,000원'] },
            { hl: true, c: ['처음 배송비 (출고)', '- 3,000원', '무료배송으로 나갔던 주문 · 전체 반품이라 처음 배송비도 받음'] },
        ]),
        ...(o.used ? [{ hl: true, c: ['훼손 차감', '- 46,500원', '2박스 중 1박스 개봉·사용 (운영자 입력)'] }] : []),
    ], foot: ['결제수단으로 환불', o.seller ? '90,000원' : o.used ? '37,500원' : '84,000원', '신용카드 취소'] }),
    PriceSummary({ title: '돌려주는 것', rows: [['신용카드 취소', o.seller ? '90,000원' : o.used ? '37,500원' : '84,000원'], ['쿠폰', '돌려줌', '가입 축하 3,000원 (유효기간 남음)'], ['구매 적립금', '회수 없음', '구매확정 전이라 지급된 적립금 없음']], total: ['고객이 받는 금액', o.seller ? '90,000원' : o.used ? '37,500원' : '84,000원'], note: '금액은 예시 값입니다.' }),
);

const refundModal = (o = {}) => Modal({ title: '환불 · 20261104-000060', w: 880, foot: o.foot || [Btn('닫기'), Btn('환불 금액 고치기'), Btn(`${o.seller ? '90,000' : '84,000'}원 환불하고 반품 완료`, 'primary')] },
    Stepper(STEPS, 3),
    KV([['주문자', '윤서연 · 010-****-3317'], ['검수 결과', o.seller ? `${Badge('불량 판정', 'bold')} 배송비 판매자 부담` : `${Badge('이상 없음', 'check')} 배송비 고객 부담 (단순 변심)`], ['원 결제', '신용카드 90,000원 = 상품 93,000 - 쿠폰 3,000 + 배송비 0(무료배송)']], { wide: true }),
    '<div style="height:14px"></div>',
    refundCalc(o),
    FormTable([
        { k: '반품 배송비 받는 방법', v: o.seller ? Text('받지 않음 (판매자 부담)') : [Radio('환불 금액에서 빼기', { on: true }), Radio('고객이 상자에 동봉함 (빼지 않음)'), Radio('고객이 따로 입금함 (빼지 않음)')] },
        { k: '고객 알림', v: Check('환불 완료 안내 보내기 (환불 금액 · 차감 내역 포함)', { on: true }) },
    ]),
);

const state4 = StateBlock({ idx: 4, title: '환불(반품 배송비 차감 계산)', note: '검수를 마치면 환불 계산이 열립니다. 고객 부담 사유일 때만 반품 배송비를 환불 금액에서 빼고, 결제 대행사에 취소를 요청합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '반품 환불에서 가장 많이 다투는 것이 배송비입니다. 규칙은 하나입니다. 고객 부담 사유(단순 변심 · 주문 실수)일 때만 반품 배송비를 빼고, 판매자 부담 사유(불량 · 파손 · 오배송)이면 한 푼도 빼지 않습니다. 무료배송으로 나갔던 주문을 전부 반품하면 처음 보낼 때의 배송비도 고객이 냅니다. 줄마다 왜 빠지는지 적어 고객에게 그대로 설명할 수 있게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '고객이 반품 배송비를 상자에 넣어 보냈거나 따로 입금했다면 환불에서 또 빼면 안 됩니다. 그래서 받는 방법을 고르게 합니다. 환불 요청 결과(성공 · 실패)와 가상계좌 환불 계좌 처리는 취소 관리(A-15)와 같은 팝업·같은 문구를 씁니다. 구매확정 뒤 예외로 받은 반품은 지급한 적립금을 회수합니다. 배송비 금액은 설정 > 배송의 반품·교환 배송비를 따릅니다.'),
    Canvas({ label: 'A-16 · 검수 저장 뒤 → 환불 계산 팝업 (고객 부담 사유 · 반품 배송비 차감)' }, Overlay({ bg: Page('수거완료(검수)', Search(), Table({ check: true, cols: INS_COLS, rows: INSPECT.map(insRow) })), h: 800 }, refundModal())),
    Canvas({ size: 'auto', label: '판매자 부담 사유 (불량 판정) → 배송비 차감 없음', right: '팝업만', pad: 20 }, refundModal({ seller: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: '고객 책임 훼손 → 훼손 차감 줄이 더해진 계산', right: '계산 부분만', pad: 20 }, `<div style="width:840px">${refundCalc({ used: true })}${Note('훼손 차감은 운영자가 금액과 이유를 직접 넣습니다. 고객 알림에 차감 이유가 그대로 들어갑니다.')}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '부분 반품 (2개 중 1개) · 남는 주문이 무료배송 조건에 못 미쳐 처음 배송비를 뺌', right: '계산 부분만', pad: 20 }, `<div style="width:560px">${Table({ dense: true, cols: [{ t: '항목', w: 170 }, { t: '금액', w: 90, align: 'right' }, '계산'], rows: [
            ['반품 상품 금액', '49,000원', `${O1} 1개 (주문 2개 중 1개)`],
            { hl: true, c: ['반품 배송비 (회수)', '- 3,000원', '고객 부담 사유 · 편도'] },
            { hl: true, c: ['처음 배송비 (출고)', '- 3,000원', '남는 상품 49,000원이 무료배송 조건(5만원 이상)에 못 미침'] },
        ], foot: ['결제수단으로 환불', '43,000원', '카카오페이 부분 취소'] })}</div>`),
        Canvas({ size: 'auto', label: '환불 성공', right: '팝업만', pad: 20 },
            Modal({ title: '환불 · 20261104-000060', w: 480, foot: [Btn('주문 상세 보기'), Btn('닫기', 'primary')] },
                Text(`${Icon('check-circle-o')} 환불하고 반품을 마쳤습니다.`, { b: true }),
                KV([['결제 취소', `${Badge('성공', 'check')} 신용카드 84,000원`], ['거래번호', 'T2026110414020060 · 취소 11-11 11:02:15'], ['쿠폰', '가입 축하 3,000원 반환'], ['주문 상태', `${OrderBadge('반품완료')}`], ['고객 알림', '알림톡 발송 성공']]),
            )),
    ),
    Canvas({ size: 'auto', label: '환불 실패 (취소 관리와 같은 처리) · 닫으면 환불 실패 탭에 남음', right: '팝업만', pad: 20 },
        Modal({ title: '환불 · 20261104-000060', w: 560, foot: [Btn('닫기'), Btn('직접 환불했다고 기록'), Btn('결제 취소 다시 시도', { kind: 'primary', icon: 'refresh' })] },
            Note('결제 취소에 실패했습니다. 반품은 아직 끝나지 않았고 고객에게 알림도 가지 않았습니다.', { warn: true }),
            KV([['결제 취소', `${Badge('실패', 'warn')} 신용카드 84,000원`], ['실패 사유', '결제 대행사가 응답하지 않습니다. 잠시 뒤 다시 시도하세요.'], ['자동 재시도', '30분 뒤 한 번 더 시도합니다 (최대 3회)']], { wide: true }),
        )),
);

const rejectModal = (o = {}) => Modal({ title: '반품 거부 · 20261107-000088', w: 620, foot: [Btn('닫기'), Btn('거부하고 고객에게 알리기', { kind: 'danger', disabled: o.disabled })] },
    FormTable([
        { k: '대상', v: Text(`임재현 · ${P} ${O2} 1개 · 요청 사유 단순 변심`) },
        { k: '거부 사유', required: true, v: o.reason || Select({ value: '상품을 사용했거나 훼손되어 가치가 줄었습니다', w: 380 }), error: o.err },
        { k: '고객에게 할 말', v: Textarea({ value: o.msg === undefined ? '2박스 중 1박스가 개봉되어 5포가 사용된 상태로 확인되었습니다. 식품은 개봉 뒤에는 반품이 어렵습니다.' : o.msg, placeholder: '거부 사유 아래에 덧붙일 말 (선택)', h: 72, count: o.msg === '' ? '0 / 200' : '58 / 200' }) },
        ...(o.back ? [{ k: '받은 상품 돌려보내기', required: true, v: [Radio('고객에게 다시 보냄 (착불)', { on: true }), Radio('고객에게 다시 보냄 (선불 · 판매자 부담)'), Radio('고객이 폐기에 동의함')], help: '수거한 뒤 거부할 때만 나옵니다. 다시 보낸 송장은 주문 상세에서 넣습니다.' }] : []),
        { k: '거부 뒤 주문 상태', v: Text(`${OrderBadge('배송완료')} 로 돌아가고 자동 구매확정 날짜를 오늘부터 7일 뒤로 다시 잡습니다`) },
    ]),
    o.preview === false ? '' : Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 임재현 님, 요청하신 반품이 어렵게 되었습니다.<br>주문번호 20261107-000088 · 롱지비티 석류맛 젤리스틱 2박스(28일분) 1개<br>사유: 상품을 사용했거나 훼손되어 가치가 줄었습니다<br>2박스 중 1박스가 개봉되어 5포가 사용된 상태로 확인되었습니다. 식품은 개봉 뒤에는 반품이 어렵습니다.<br>문의: 고객센터 070-****-1234', { sm: true })),
);

const state5 = StateBlock({ idx: 5, title: '거부', note: '반품을 받아 줄 수 없을 때. 요청 단계에서도, 수거해서 검수한 뒤에도 거부할 수 있습니다. 사유는 필수이고 고객 알림에 그대로 들어갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '거부는 두 시점에 일어납니다. 요청만 보고 거부(반품 기한이 지남)와, 받아서 열어 보고 거부(사용 · 훼손)입니다. 뒤의 경우에는 받은 상품을 어떻게 할지(다시 보냄 · 폐기 동의)를 반드시 정해야 하므로 입력칸이 하나 더 생깁니다. 거부하면 주문은 배송완료로 돌아가고 멈췄던 자동 구매확정이 다시 흐릅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '거부 사유 목록은 법에서 인정하는 청약철회 제한 사유로 구성합니다(사용·훼손 · 시간이 지나 가치가 줄어듦 · 복제 가능한 상품의 포장 훼손 · 반품 기한 지남). 불량 사유의 반품은 거부 사유를 고를 때 한 번 더 경고합니다. 스마트스토어 반품의 거부는 네이버로 전송되고 네이버가 고객에게 알립니다.'),
    Canvas({ label: 'A-16 · 요청 단계에서 거부 버튼 → 팝업' }, Overlay({ bg: Page('반품 요청', Search(), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), h: 760 }, rejectModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '거부 사유 고르는 중 (목록 열림) · 사유 없이는 버튼 비활성', right: '팝업만', pad: 20 }, rejectModal({ reason: Select({ placeholder: '거부 사유를 고르세요', w: 380, open: true, options: ['반품할 수 있는 기간(배송완료 뒤 7일)이 지났습니다', '상품을 사용했거나 훼손되어 가치가 줄었습니다', '포장을 뜯어 다시 팔 수 없는 상품입니다', '고객이 반품 요청을 거두었습니다', '기타(직접 입력)'] }), msg: '', preview: false, disabled: true })),
        Canvas({ size: 'auto', label: '검수 뒤 거부 (받은 상품 돌려보내기 입력칸이 생김)', right: '팝업만', pad: 20 }, rejectModal({ back: true, preview: false })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '불량 사유 반품을 거부하려 할 때 경고', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '불량 사유로 들어온 반품입니다', desc: '고객이 고른 사유: 상품 불량(포장 터짐) · 사진 2장 첨부<br>제품 문제로 인한 반품은 배송완료 뒤 3개월 안에는 거부할 수 없습니다. 검수에서 불량이 아니라고 확인한 경우에만 거부하세요.', ok: '검수 결과 확인했음 · 계속', danger: true })),
        Canvas({ size: 'auto', label: '거부 완료', right: '토스트만', pad: 20 }, Toast('반품을 거부하고 고객에게 알렸습니다. 주문은 배송완료로 돌아갔습니다.', { action: '거부 탭 보기' })),
    ),
    Canvas({ label: 'A-16 · 거부 탭' }, Page('거부', Search('거부일 최근 1개월'),
        ListHead({ total: 3, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '주문번호 · 거부 일시', w: 150 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '거부 시점', w: 90 }, { t: '거부 사유', w: 220 }, { t: '받은 상품', w: 130 }, { t: '지금 상태', w: 90 }], rows: [
            ['<u>20261028-000021</u><small>11-08 14:20</small>', ChannelBadge('자사몰'), `${P}<small>${O2} · 1개</small>`, '김민지', '검수 뒤', '상품을 사용했거나 훼손되어 가치가 줄었습니다', '다시 보냄(착불)<small><u>581233441002</u></small>', OrderBadge('구매확정')],
            ['<u>20261020-000009</u><small>11-05 10:02</small>', ChannelBadge('자사몰'), `${P}<small>${O1} · 1개</small>`, '강지호', '요청 단계', '반품할 수 있는 기간이 지났습니다', '<small>수거 안 함</small>', OrderBadge('구매확정')],
            ['<u>2026102544310072</u><small>11-02 16:45</small>', ChannelBadge('스마트스토어'), `${P}<small>${O1} · 2개</small>`, '이하은', '요청 단계', '고객이 반품 요청을 거두었습니다', '<small>수거 안 함</small>', OrderBadge('배송완료')],
        ] }),
    )),
);

const DONE = [
    ['20261104-000060', '자사몰', O2, '윤서연', '단순 변심', '고객 부담', '84,000원', '배송비 6,000원 차감', '11-11 11:02'],
    ['20261102-000048', '자사몰', O1, '최도윤', '상품 불량', '판매자 부담', '52,000원', '차감 없음 · 제주 추가 배송비 포함', '11-10 16:40'],
    ['2026103044600921', '스마트스토어', O1, '정수아', '오배송', '판매자 부담', '49,000원', '네이버가 환불', '11-09 13:15'],
];

const failCanvases = [
    Canvas({ label: 'A-16 · 환불 실패 탭 (검수는 끝났는데 환불이 안 끝난 건 · 사유 · 다시 시도 · 수동 환불 완료 확인)' }, Page('환불 실패',
        Note('결제 대행사 관리자 화면에서 직접 취소하지 마세요. 우리 쪽 금액과 어긋납니다. 어쩔 수 없이 직접 취소했다면 수동 환불 완료 확인으로 반드시 기록하세요.', { warn: true }),
        ListHead({ total: 1, left: Chips(['전체 1', '결제 취소 실패 1', '환불 계좌 없음 0', '환불 기한 임박 0'], '전체 1'), right: PerPage(50) }),
        Table({ check: true, cols: [{ t: '주문번호 · 검수 일시', w: 150 }, { t: '채널', w: 90 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '환불 금액 · 결제수단', w: 116, align: 'right' }, { t: '실패 사유', w: 270 }, { t: '', w: 150 }], rows: [
            { hl: true, c: ['<u>20261104-000060</u><small>검수 11-11 10:58</small>', ChannelBadge('자사몰'), `${P}<small>${O2} · 1개</small>`, '윤서연', '84,000원<small>신용카드</small>', `${Badge('환불 실패', 'warn')}<small><b>결제 대행사가 응답하지 않습니다</b> · 자동 재시도 3회 모두 실패 · 마지막 시도 11-11 12:32</small>`, `${Btn('다시 시도', { size: 'sm', kind: 'primary' })} ${Btn('수동 환불 완료 확인', { size: 'sm' })}`] },
        ] }),
        Note('환불이 끝날 때까지 주문은 반품 처리 중으로 보이고 고객에게 환불 완료 알림이 가지 않습니다. 실패가 생기면 대시보드 환불 실패 카드와 내부 알림으로 바로 알립니다. 다시 시도 · 수동 환불 완료 확인 팝업과 사유 문구는 취소 관리(A-15)의 환불 실패 탭과 같습니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '수동 환불 완료 확인 → 팝업 (반품 환불 · 차감 내역이 함께 기록됨)', right: '팝업만', pad: 20 },
            Modal({ title: '수동 환불 완료 확인 · 20261104-000060', w: 560, foot: [Btn('취소'), Btn('기록하고 반품 완료로 변경', 'primary')] },
                Note('이 처리는 실제 돈을 움직이지 않습니다. 이미 고객에게 돌려준 것이 맞을 때만 누르세요.', { warn: true }),
                FormTable([
                    { k: '환불해야 할 금액', v: Text('<b>84,000원</b> = 상품 93,000 - 쿠폰 3,000 - 반품 배송비 6,000') },
                    { k: '돌려준 방법', required: true, v: [Radio('결제 대행사 관리자 화면에서 직접 취소함'), Radio('고객 계좌로 송금함', { on: true })] },
                    { k: '돌려준 금액 · 날', required: true, v: [Input({ value: '84,000', suffix: '원', w: 150 }), Input({ value: '2026-11-11', icon: 'calendar', w: 150 })] },
                    { k: '메모', required: true, v: Input({ value: '국민은행 ****3317 윤서연 송금', w: 320 }) },
                ]),
            )),
        Canvas({ size: 'auto', label: '환불 실패 건이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:440px">${Empty({ icon: 'check-circle-o', title: '환불에 실패한 반품이 없습니다', desc: '결제 취소가 실패하면 여기에 나타나고 바로 알려 드립니다.' })}</div>`),
    ),
];

const state6 = (withFail) => StateBlock({ idx: 6, title: '단계별 탭', note: '탭이 반품의 단계입니다(환불 실패 탭은 환불이 안 끝난 건만 모으는 예외 탭). 한 건은 처리할 때마다 다음 탭으로 넘어가고, 각 탭에서 할 수 있는 일괄 처리가 다릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '반품은 며칠에 걸쳐 여러 번 손이 갑니다. 한 목록에 섞어 두면 오늘 무엇을 해야 하는지 보이지 않으므로 단계마다 탭을 나누고 탭 숫자로 할 일을 알려 줍니다. 탭마다 버튼이 다릅니다. 요청 = 수거 지시·거부, 수거중 = 수거완료 처리·송장 수정, 수거완료(검수) = 검수·환불, 환불완료·거부 = 조회만. 여러 건을 고르면 그 탭에서 되는 일괄 처리만 바에 나옵니다(요청 = 수거 지시, 수거중 = 수거완료 처리). 검수와 환불은 일괄 처리가 없고 한 건씩 합니다.'),
    Canvas({ size: 'auto', label: '탭별 할 일과 일괄 처리', right: '기준 표', pad: 20 }, `<div style="width:1180px">${Table({ dense: true, cols: [{ t: '탭', w: 150 }, { t: '여기에 있는 주문', w: 300 }, { t: '줄마다 버튼', w: 210 }, { t: '일괄 처리 바', w: 280 }, '다음 탭으로 넘어가는 때'], rows: [
        [`<b>반품 요청</b> ${OrderBadge('반품요청')}`, '고객이 신청했고 아직 보지 않은 건', '수거 지시 · 거부', '일괄 수거 지시(자동 회수 접수) · 회수 송장 엑셀 일괄 등록', '수거 지시 → 수거중'],
        [`<b>수거중</b> ${OrderBadge('수거중')}`, '회수 택배가 움직이는 중이거나 고객 송장을 기다리는 건', '송장 수정 · 수거완료 처리 · 고객에게 재안내', '일괄 수거완료 처리 · 회수 추적 다시 조회', '반품지 도착 확인 → 수거완료(검수)'],
        [`<b>수거완료(검수)</b> ${OrderBadge('수거완료')}`, '물건을 받았고 검수·환불이 남은 건 (환불 실패 건 포함)', '검수하기 · 환불하기', '없음 — 검수·환불은 한 건씩 (엑셀 내려받기만)', '환불 성공 → 환불완료 / 환불 실패 → 환불 실패 / 거부 → 거부'],
        ['<b>환불 실패</b>', '환불을 눌렀지만 결제 대행사가 실패를 돌려줬거나 환불 계좌를 기다리는 건', '다시 시도 · 수동 환불 완료 확인 · 환불 계좌 넣기', '없음 — 다시 시도도 한 건씩', '환불 성공 → 환불완료'],
        [`<b>환불완료</b> ${OrderBadge('반품완료')}`, '환불까지 끝난 건', '주문 상세 열기', '엑셀 내려받기 · 환불 안내 다시 보내기', '끝'],
        [`<b>거부</b> ${OrderBadge('거부')}`, '받아 주지 않은 건 (주문은 원래 상태로 돌아감)', '주문 상세 열기', '엑셀 내려받기', '끝'],
    ] })}</div>`),
    Canvas({ label: 'A-16 · 수거중 탭 · 2건 선택 → 일괄 처리 바 (이 탭에서 되는 처리만)' }, Page('수거중', Search(),
        BulkBar({ count: 2, sub: '반품지 도착 1건 · 이동 중 1건' }, Btn('수거완료 처리', 'primary'), Btn('회수 추적 다시 조회', { kind: 'line', icon: 'refresh' }), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' })),
        Table({ check: true, checked: [1, 2], cols: PICK_COLS, rows: PICK.map(pickRow) }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '수거완료 처리 → 아직 도착 전인 건이 섞였을 때', right: '팝업만', pad: 20 },
            Confirm({ w: 460, title: '선택한 2건을 수거완료로 바꿀까요?', desc: '1건(정수아)은 회수 추적이 아직 이동 중입니다. 실제로 물건을 받았을 때만 수거완료로 바꾸세요.<br>수거완료가 되면 고객에게 상품 도착 · 검수 시작 안내가 갑니다.', ok: '2건 수거완료 처리' })),
        Canvas({ size: 'auto', label: '일괄 처리는 수거 지시 · 수거완료 처리 · 회수 송장 엑셀 등록까지', right: '안내만', pad: 20 },
            `<div style="width:460px">${Note('환불은 일괄 처리가 없습니다. 수거완료(검수) 탭에서 한 건씩 검수한 뒤 환불 계산을 확인하고 환불합니다(4번 상태).', { warn: true })}</div>`),
    ),
    ...(withFail ? failCanvases : []),
    Canvas({ label: 'A-16 · 환불완료 탭 (환불 금액과 차감 내역)' }, Page('환불완료', Search('환불일 최근 1개월'),
        ListHead({ total: 31, left: Chips(['전체 31', '고객 부담 사유 22', '판매자 부담 사유 9'], '전체 31'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '주문번호 · 환불 일시', w: 150, sort: 'desc' }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '반품 사유', w: 100 }, { t: '배송비 부담', w: 96 }, { t: '환불 금액', w: 90, align: 'right' }, { t: '차감 내역', w: 200 }], rows: DONE.map((d) => [`<u>${d[0]}</u><small>${d[8]}</small>`, ChannelBadge(d[1]), `${P}<small>${d[2]} · 1개</small>`, d[3], d[4], d[5] === '고객 부담' ? Badge('고객 부담', 'bold') : Badge('판매자 부담', 'line'), d[6], `<small>${d[7]}</small>`]),
            foot: ['합계 (이 쪽 3건)', '', '', '', '', '', '185,000원', ''] }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-16 · 반품 요청 탭 · 요청이 여러 건인 날 2건 선택 → 일괄 수거 지시 (다른 날 예시)' }, Overlay({ bg: Page('반품 요청', Search(), BulkBar({ count: 2, sub: '자사몰 2건 · 판매자 회수 요청 2건' }, Btn('일괄 수거 지시', 'primary'), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' })),
        Table({ check: true, checked: [0, 1], cols: REQ_COLS, rows: [reqRow(REQ), reqRow({ ...REQ, no: '20261106-000082', name: '김민지', tel: '010-****-1234', opt: O1, why: '상품 불량', memo: '스틱 2포가 터져서 왔어요.', at: '11-10 20:15', amt: '49,000원', fee: '판매자 부담' })] })), h: 520 },
        Modal({ title: '일괄 수거 지시 · 2건', w: 540, foot: [Btn('취소'), Btn('2건 회수 접수하고 수거중으로', 'primary')] },
            FormTable([
                { k: '회수 택배사', required: true, v: Select({ value: 'CJ대한통운 (계약 택배사)', w: 240 }) },
                { k: '회수 희망일', v: Input({ value: '2026-11-12 (목)', icon: 'calendar', w: 200 }) },
                { k: '고객 알림', v: Check('반품 접수 · 회수 방문 안내 보내기', { on: true }) },
            ]),
            Note('회수지는 각 주문의 배송지로 접수합니다. 고객이 직접 보내기로 한 요청은 일괄 수거 지시에서 빠지고 반품지 안내만 보냅니다.'),
        ))),
);

export default function A16(page) {
    const split = !!(page && page.states && page.states.length > 6);
    const state7 = split ? StateBlock({ idx: 7, title: page.states[6], note: '검수는 끝났는데 환불이 끝나지 않은 반품만 모으는 탭. 사유를 보고 다시 시도하거나, 다른 방법으로 돌려줬다면 수동 환불 완료 확인으로 닫습니다.' },
        Anno({ title: '왜 이렇게 하나' }, '반품 완료는 결제 대행사가 환불이 끝났다고 답한 뒤에만 됩니다. 실패한 환불이 수거완료(검수) 목록에 섞여 있으면 묻히므로 따로 탭에 모으고 탭 숫자 · 대시보드 환불 실패 카드 · 내부 알림으로 알립니다. 팝업과 사유 문구는 취소 관리(A-15)의 환불 실패 탭과 같습니다.'),
        failCanvases) : '';
    return [state1, state2, state3, state4, state5, state6(!split), state7].join('');
}
