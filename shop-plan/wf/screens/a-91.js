import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle, Tabs,
    FormTable, Table, Overlay, Modal, Confirm, Toast, Box, KV, Note as NoteBase, Text, Icon, Flex, Grid, Stepper, Empty, DragRow,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const TABS = ['결제 연결', '결제수단', '가상계좌', '무통장 입금'];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-91', desc: '결제 대행사 연결 상태를 확인하고 고객에게 보여 줄 결제수단을 정합니다.', ...o }, Tabs(TABS, tab), body);

const keyForm = (o = {}) => FormTable([
    { k: '상점 아이디', required: true, v: Input({ value: o.empty ? '' : 'store-4f2a91c7-****-****', placeholder: 'store- 로 시작하는 값', w: 360, error: o.err }), help: '포트원 관리자 화면 > 결제 연동 > 연동 정보에서 복사합니다.', error: o.err ? '상점 아이디는 store- 로 시작합니다. 포트원 화면의 값을 그대로 붙여 넣어 주세요.' : undefined },
    { k: '채널 키', required: true, v: [Input({ value: o.empty ? '' : 'channel-key-8b1d****', placeholder: 'channel-key- 로 시작하는 값', w: 360 }), Text('결제 대행사 계약마다 하나씩', { sm: true, mute: true })], help: '카드·계좌이체·가상계좌용 채널 키. 간편결제(카카오페이·네이버페이·토스페이)는 결제수단 탭에서 따로 넣습니다.' },
    { k: '비밀 키', required: true, v: [Input({ value: o.empty ? '' : '●●●●●●●●●●●●●●●●●●●● (저장됨)', placeholder: '붙여 넣기', w: 360 }), o.empty ? '' : Btn('다시 입력', { size: 'sm' })], help: '저장한 뒤에는 다시 볼 수 없습니다. 취소·환불을 자동으로 처리하는 데 쓰입니다.' },
    { k: '결제 결과 받는 주소', v: [Input({ value: 'https://innerera.example/api/payments/webhook', w: 420, disabled: true }), Btn('복사', { size: 'sm', icon: 'link' })], help: '이 주소를 포트원 관리자 화면 > 결제 알림(웹훅)에 넣어야 가상계좌 입금이 자동으로 확인됩니다.' },
]);

const testRows = (fail) => Table({ dense: true, cols: [{ t: '시험 항목', w: 220 }, { t: '결과', w: 110 }, '내용'], rows: [
    ['키 확인', Badge('성공', 'check'), '상점 아이디 · 채널 키 · 비밀 키가 맞습니다'],
    ['카드 100원 결제', Badge('성공', 'check'), '결제 창 열림 → 승인 완료 (시험 결제 · 실제 청구 없음)'],
    fail ? { hl: true, c: ['결제 취소', Badge('실패', 'x'), `${Icon('error-o')} 비밀 키에 취소 권한이 없습니다. 포트원에서 비밀 키를 새로 만들 때 결제 취소 권한을 켜 주세요.`] } : ['결제 취소', Badge('성공', 'check'), '100원 전액 취소 완료 — 관리자에서 취소 승인하면 자동 환불됩니다'],
    fail ? { dim: true, c: ['결제 결과 받기', Badge('건너뜀', 'mute'), '앞 단계가 실패해 시험하지 않았습니다'] } : ['결제 결과 받기', Badge('성공', 'check'), '포트원이 보낸 결과를 3초 안에 받았습니다 (가상계좌 입금 자동 확인 가능)'],
] });

const Disconnected = [
    Box({ title: '결제 연결 상태', right: Badge('연결 안 됨', 'x') },
        Text('아직 결제 대행사와 연결하지 않았습니다. 연결 전에는 고객이 주문서에서 결제할 수 없고 무통장 입금만 받을 수 있습니다.', {}),
        Stepper(['결제 대행사 계약', '포트원 가입·채널 등록', '키 입력', '연결 시험'], 0),
    ),
    Box({ title: '연결 방법', sub: '1 ~ 2번은 쇼핑몰 사업자(고객사)가 직접 해야 합니다' },
        Table({ dense: true, cols: [{ t: '순서', w: 50, align: 'center' }, { t: '할 일', w: 250 }, '설명', { t: '누가', w: 90 }, { t: '걸리는 시간', w: 110 }], rows: [
            [1, '<b>결제 대행사와 계약</b>', 'KG이니시스 · 토스페이먼츠 · NHN KCP 등에서 한 곳을 골라 신청합니다. 사업자등록증·통장 사본·통신판매업 신고증이 필요하고 카드사 심사를 받습니다.', '고객사', '영업일 5 ~ 10일'],
            [2, '<b>포트원 가입 · 채널 등록</b>', '포트원(portone.io)에 가입하고 계약한 결제 대행사의 상점 정보를 채널로 등록합니다.', '고객사', '30분'],
            [3, '<b>키 3개를 아래에 입력</b>', '포트원 관리자 화면의 상점 아이디 · 채널 키 · 비밀 키를 복사해 붙여 넣습니다.', '운영자', '5분'],
            [4, '<b>연결 시험</b>', '100원을 결제하고 바로 취소해 결제·취소·결과 받기가 되는지 확인합니다.', '운영자', '1분'],
        ] }),
        Note('간편결제(카카오페이 · 네이버페이 · 토스페이)는 각 회사와 따로 계약한 뒤 결제수단 탭에서 채널 키를 추가합니다.'),
    ),
    Box({ title: '키 입력' }, keyForm({ empty: true }), BtnRow({ align: 'right' }, Btn('저장하고 연결 시험', { kind: 'primary', disabled: true }))),
];

const Connected = (o = {}) => [
    Box({ title: '결제 연결 상태', right: o.fail ? Badge('연결됨 · 시험 실패 1건', 'warn') : Badge('연결됨', 'check') },
        Grid('1fr 1fr', KV([['결제 대행사', 'KG이니시스 (포트원 경유)'], ['연결한 날', '2026-11-02 · 운영자 이보림'], ['마지막 연결 시험', o.fail ? '2026-11-11 14:05 · 실패 1건' : '2026-11-11 14:05 · 모두 성공'], ['최근 결제', '2026-11-11 13:52 · 카드 93,000원 승인']], { wide: true }),
            `<div><div style="font-size:13px;font-weight:700;margin-bottom:8px">운영 모드</div>${Flex({ gap: 16, align: 'center' }, Radio('실제 결제', { on: !o.test }), Radio('시험 결제 (돈이 빠져나가지 않음)', { on: !!o.test }))}${Note(o.test ? '시험 결제 모드입니다. 고객 화면 주문서 위에 시험 결제 중이라는 띠가 보이고, 결제해도 실제로 청구되지 않습니다. 쇼핑몰을 열기 전에 실제 결제로 바꾸세요.' : '실제 결제 모드입니다. 고객이 결제하면 실제로 청구됩니다.', { warn: !!o.test })}</div>`),
        Flex({ gap: 8, mt: 12 }, Btn('연결 시험 다시 하기', { icon: 'refresh' }), Btn('포트원 관리자 화면 열기', { icon: 'external-link' }), Btn('연결 끊기', 'danger')),
    ),
    Box({ title: '연결 시험 결과', sub: '2026-11-11 14:05' }, testRows(o.fail), o.fail ? Note('취소 시험이 실패한 상태로 운영하면 관리자에서 취소를 승인해도 환불이 자동으로 되지 않아, 결제 대행사 화면에서 직접 취소해야 합니다.', { warn: true }) : ''),
    Box({ title: '키', sub: '키를 바꾸면 연결 시험을 다시 합니다' }, keyForm(), BtnRow({ align: 'right' }, Btn('저장하고 연결 시험', 'primary'))),
];

const state1 = StateBlock({ idx: 1, title: 'PG 연결 상태', note: '설정 > 결제의 첫 탭 결제 연결. 결제 대행사(포트원 경유)와 연결됐는지, 시험 결제가 되는지 보여 줍니다. 화면 문구에서는 결제 대행사 · 결제 연결이라고 부릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결제 대행사 계약과 키 발급은 사업자 본인만 할 수 있어 고객사 몫입니다. 운영자가 받은 키 3개를 붙여 넣고 연결 시험을 누르면 100원을 결제했다가 바로 취소해, 결제·취소·결제 결과 받기 세 가지가 되는지 단계별로 알려 줍니다. 결제 대행사를 바꿔도 키만 다시 넣으면 됩니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 초기값' }, '설치 직후에는 연결 안 됨 · 시험 결제 모드입니다. 취소 시험이 실패한 채로 열면 관리자에서 취소를 승인해도 환불이 안 나가므로 실패 사유와 고치는 법을 그 줄에 적습니다. 비밀 키는 저장 뒤 다시 보여 주지 않습니다. 연결을 끊으면 진행 중인 주문의 자동 환불이 멈춘다고 경고합니다.'),
    Canvas({ label: 'A-91 · 결제 연결 탭 · 연결 안 됨 (설치 직후 · 연결 방법 안내)' }, Page('결제 연결', {}, Disconnected)),
    Canvas({ label: 'A-91 · 결제 연결 탭 · 연결됨 · 연결 시험 모두 성공 · 실제 결제 모드' }, Page('결제 연결', {}, Connected())),
    Canvas({ label: 'A-91 · 연결됨 · 연결 시험 일부 실패 (취소 권한 없음) · 시험 결제 모드' }, Page('결제 연결', {}, Connected({ fail: true, test: true }).slice(0, 2))),
    CanvasRow(
        Canvas({ size: 'auto', label: '저장하고 연결 시험 → 키 형식 오류', right: '부분', pad: 20 }, `<div style="width:760px">${keyForm({ err: true })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '시험 결제 → 실제 결제로 바꿀 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '실제 결제 모드로 바꿀까요?', desc: '지금부터 고객이 결제하면 실제로 청구됩니다. 연결 시험 4가지가 모두 성공한 상태입니다. 시험 결제 모드에서 만든 시험 주문 3건은 주문 목록에서 자동으로 숨겨집니다.', ok: '실제 결제로 바꾸기' })),
        Canvas({ size: 'auto', label: '연결 끊기 버튼', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '결제 연결을 끊을까요?', desc: '고객이 카드·간편결제로 결제할 수 없게 되고, 진행 중인 주문 42건의 취소·반품 환불이 자동으로 처리되지 않습니다. 결제 대행사를 바꾸는 중이라면 새 키를 넣고 저장하면 끊지 않고 바뀝니다.', ok: '그래도 끊기', danger: true })),
    ),
    Canvas({ size: 'auto', label: '연결 시험 성공', right: '토스트만', pad: 20 }, Toast('연결 시험 4가지를 모두 통과했습니다. 시험 결제 100원은 바로 취소했습니다.')),
);

const METHODS = [
    { n: '신용·체크카드', ch: 'KG이니시스', st: '사용 가능', on: true, extra: '할부 최대 12개월 · 5만원 이상', def: true },
    { n: '카카오페이', ch: '카카오페이 직접 계약', st: '사용 가능', on: true, extra: '' },
    { n: '네이버페이', ch: '네이버파이낸셜 직접 계약', st: '심사 중', on: false, extra: '11-06 신청 · 보통 영업일 7일' },
    { n: '토스페이', ch: '채널 키 없음', st: '키 필요', on: false, extra: '' },
    { n: '실시간 계좌이체', ch: 'KG이니시스', st: '사용 가능', on: true, extra: '' },
    { n: '가상계좌', ch: 'KG이니시스', st: '사용 가능', on: true, extra: '입금 기한 3일 · 가상계좌 탭에서 설정' },
    { n: '무통장 입금', ch: '결제 대행사 없이 직접', st: '사용 가능', on: false, extra: '계좌 1개 등록됨 · 입금 확인은 운영자가 직접' },
];
const mst = (s) => ({ '사용 가능': Badge('사용 가능', 'check'), '심사 중': Badge('심사 중', 'dash'), '키 필요': Badge('채널 키 필요', 'warn') }[s]);
const methodRow = (m) => DragRow({ off: !m.on, right: [`<span style="width:120px">${mst(m.st)}</span>`, Toggle('', { on: m.on, disabled: m.st !== '사용 가능' }), Btn(m.st === '키 필요' ? '키 넣기' : '설정', { size: 'sm' })] }, `<div style="display:flex;align-items:center;gap:12px;font-size:13.5px"><b style="width:130px">${m.n}</b>${m.def ? Badge('처음 선택돼 있음', 'bold') : ''}<span style="font-size:12px;color:var(--ink2)">${m.ch}</span><span style="font-size:12px;color:var(--mute)">${m.extra}</span></div>`);

const OrderPv = `<div style="border:1px solid var(--line);border-radius:6px;padding:14px;background:#fff;font-size:13px"><b>결제수단</b><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px">${['신용·체크카드', '카카오페이', '실시간 계좌이체', '가상계좌'].map((n, i) => `<div style="border:${i === 0 ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:4px;padding:10px;text-align:center;font-size:12.5px${i === 0 ? ';font-weight:700' : ''}">${n}</div>`).join('')}</div><div style="margin-top:10px">${Check('이 결제수단을 다음에도 사용', { on: true })}</div></div>`;

const state2 = StateBlock({ idx: 2, title: '결제수단 켜고 끄기', note: '결제수단 탭. 켠 수단만 고객 주문서에 위에서 아래 순서로 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결제수단은 계약이 끝난 것만 켤 수 있어야 고객이 눌렀다가 오류를 보지 않습니다. 수단마다 계약 상태(사용 가능 · 심사 중 · 키 필요)를 보여 주고, 심사 중·키 없는 수단의 스위치는 잠급니다. 순서는 끌어서 바꾸고, 맨 위 수단이 주문서에서 처음 선택돼 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '켜진 수단이 하나도 없으면 주문을 받을 수 없으므로 마지막 하나는 끌 수 없습니다. 수단을 끄더라도 이미 그 수단으로 결제한 주문의 취소·환불은 그대로 처리됩니다.'),
    Canvas({ label: 'A-91 · 결제수단 탭 (사용 가능 · 심사 중 · 키 필요 · 꺼짐)' }, Page('결제수단', {},
        Grid('minmax(0,1fr) 300px', `<div>${METHODS.map(methodRow).join('')}${Note('끌어서 순서를 바꾸면 고객 주문서의 결제수단 순서가 바뀝니다. 고객이 지난번에 쓴 수단이 있으면 그 수단이 먼저 선택됩니다.')}</div>`, `<div><div style="font-size:12.5px;font-weight:700;margin-bottom:8px">고객 주문서에 보이는 모습</div>${OrderPv}</div>`),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '신용·체크카드 → 설정 버튼', right: '팝업만', pad: 20 }, Modal({ title: '신용·체크카드 설정', w: 600, foot: [Btn('취소'), Btn('저장', 'primary')] }, FormTable([
            { k: '할부', v: [Select({ value: '최대 12개월', w: 150 }), Input({ value: '50,000', suffix: '원 이상', w: 170 })], help: '결제 대행사 계약에서 허용한 범위 안에서만 고를 수 있습니다.' },
            { k: '무이자 할부 안내', v: Input({ placeholder: '예: 11월 삼성·현대카드 2 ~ 3개월 무이자', w: 380 }), help: '주문서의 카드 선택 아래에 한 줄로 나옵니다. 비우면 안 나옵니다.' },
            { k: '최소 결제 금액', v: Input({ value: '1,000', suffix: '원', w: 140 }) },
        ]))),
        Canvas({ size: 'auto', label: '토스페이 → 키 넣기 버튼', right: '팝업만', pad: 20 }, Modal({ title: '토스페이 연결', w: 560, foot: [Btn('취소'), Btn('저장하고 연결 시험', 'primary')] }, Text('토스페이와 계약한 뒤 포트원에 채널로 등록하고, 그 채널 키를 넣어 주세요.', { sm: true }), FormTable([{ k: '채널 키', required: true, v: Input({ placeholder: 'channel-key- 로 시작하는 값', w: 340, focus: true }) }]))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '카카오페이 스위치를 끌 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '카카오페이를 끌까요?', desc: '주문서에서 카카오페이가 사라집니다. 이미 카카오페이로 결제한 주문 18건의 취소·환불은 그대로 처리됩니다.', ok: '끄기' })),
        Canvas({ size: 'auto', label: '마지막 남은 수단을 끄려 할 때', right: '토스트만', pad: 20 }, Toast('결제수단이 하나는 켜져 있어야 주문을 받을 수 있습니다. 다른 수단을 먼저 켜 주세요.', { kind: 'error' })),
    ),
);

const vaForm = () => FormTable([
    { k: '입금 기한', required: true, v: [RadioGroup(['주문한 날부터', '날짜·시각 고정'], '주문한 날부터'), Select({ value: '3일', w: 100 }), Text('뒤', { sm: true }), Select({ value: '23:59 까지', w: 130 })], help: '예: 11월 11일(수) 14:20 주문 → 11월 14일(토) 23:59 까지 입금. 고객에게는 주문 완료 화면과 알림톡으로 계좌와 기한을 알려 줍니다.' },
    { k: '기한이 지나면', v: [Text('주문을 자동으로 취소하고 재고를 되돌립니다', {}), Btn('주문·클레임 정책에서 바꾸기', { size: 'sm', iconRight: 'angle-right-min' })] },
    { k: '입금 재촉 알림', v: [Check('기한 하루 전 오전 10시에 고객에게 알림 보내기', { on: true }), Btn('알림 문구 보기', { size: 'sm' })] },
    { k: '입금 은행', v: CheckGroup(['국민', '신한', '우리', '하나', '농협', '기업', '카카오뱅크', '토스뱅크'], ['국민', '신한', '우리', '하나', '농협']), help: '고객이 가상계좌를 발급받을 은행. 결제 대행사 계약에 있는 은행만 나옵니다.' },
    { k: '현금영수증', v: [Check('주문서에서 현금영수증 신청 받기', { on: true }), RadioGroup(['입금 확인 때 자동 발급', '구매확정 때 자동 발급'], '입금 확인 때 자동 발급')] },
    { k: '환불 계좌', v: Text('가상계좌 주문을 취소·반품하면 고객에게 환불 계좌(은행 · 계좌번호 · 예금주)를 받습니다. 예금주가 주문자와 다르면 운영자 확인 뒤 환불합니다.', { sm: true }) },
]);

const state3 = StateBlock({ idx: 3, title: '가상계좌 입금 기한', note: '가상계좌 탭. 고객이 주문한 뒤 언제까지 입금해야 하는지와 기한이 지났을 때의 처리를 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '가상계좌는 주문과 입금 사이에 시간이 떠서, 기한이 없으면 재고가 묶인 채 주문만 쌓입니다. 기한(기본 3일)을 정해 두면 기한이 지난 주문은 자동으로 취소되고 재고가 풀립니다. 입금은 결제 대행사가 알려 줘 자동으로 결제완료가 되므로 운영자가 통장을 확인할 일이 없습니다.'),
    Canvas({ label: 'A-91 · 가상계좌 탭' }, Page('가상계좌', {}, vaForm(), BtnRow({ align: 'right' }, Btn('취소'), Btn('저장', 'primary')), Note('입금 대기 중인 주문은 주문 > 입금 대기에서 남은 시간과 함께 봅니다. 기한을 바꿔도 이미 들어온 주문의 기한은 그대로입니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '입금 기한 일수 목록을 연 모습', right: '부분', pad: 20 }, `<div style="width:760px;min-height:280px">${FormTable([{ k: '입금 기한', required: true, v: [RadioGroup(['주문한 날부터', '날짜·시각 고정'], '주문한 날부터'), Select({ value: '3일', w: 110, open: true, options: ['1일', '2일', { t: '3일', on: true, sub: '기본' }, '5일', '7일'] })] }])}</div>`),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('가상계좌 설정을 저장했습니다. 지금부터 들어오는 주문에 적용됩니다.')),
    ),
);

const ACC_COLS = [{ t: '순서', w: 50, align: 'center' }, { t: '은행', w: 130 }, { t: '계좌번호', w: 200 }, { t: '예금주', w: 150 }, { t: '고객에게 보이기', w: 120 }, { t: '', w: 130 }];
const accRows = [[1, '국민은행', '123456-04-******', '이보림(이너에라)', Toggle('', { on: true }), `${Btn('수정', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`]];

const bankOpen = Select({ value: '', placeholder: '은행 고르기', w: 220, open: true, search: '농', options: [{ t: 'NH농협은행', on: true }, '지역 농·축협'] });

const accModal = (o = {}) => Modal({ title: '입금 계좌 추가', w: 560, foot: [Btn('취소'), Btn('추가', 'primary')] }, FormTable([
    { k: '은행', required: true, v: o.open ? bankOpen : Select({ value: 'NH농협은행', w: 220 }) },
    ...(o.open ? [] : [
        { k: '계좌번호', required: true, v: Input({ value: o.err ? '301-0123-45' : '301-0123-4567-81', w: 240, error: o.err }), help: '붙임표(-)는 넣어도 되고 빼도 됩니다.', error: o.err ? '농협은행 계좌번호는 숫자 11 ~ 14자리입니다. 자릿수를 확인해 주세요.' : undefined },
        { k: '예금주', required: true, v: Input({ value: '이보림(이너에라)', w: 240 }), help: '사업자 정보의 상호·대표자와 다르면 고객이 불안해합니다. 통장에 찍힌 이름 그대로 넣어 주세요.' },
    ]),
]));

const bankForm = FormTable([
    { k: '입금 기한', v: [Select({ value: '주문한 날부터 3일', w: 190 }), Text('가상계좌와 같은 값을 씁니다', { sm: true, mute: true })] },
    { k: '입금자 이름', v: Check('주문서에서 입금자 이름을 따로 받기 (주문자와 다를 때)', { on: true }) },
    { k: '입금 확인', v: Text('무통장 입금은 자동으로 확인되지 않습니다. 운영자가 통장을 보고 주문 > 입금 대기에서 입금 확인을 눌러야 결제완료가 됩니다.', { sm: true }) },
]);

const state4 = StateBlock({ idx: 4, title: '무통장 계좌', note: '무통장 입금 탭. 결제 대행사를 거치지 않고 쇼핑몰 통장으로 직접 받는 계좌를 등록합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결제 대행사 심사가 끝나기 전에 먼저 문을 열거나, 기업 고객이 계좌 이체를 원할 때 씁니다. 계좌는 여러 개 등록할 수 있고 고객이 주문서에서 은행을 고릅니다. 가상계좌와 달리 입금이 자동으로 확인되지 않으므로 그 차이를 화면에 분명히 적습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 빈 상태' }, '등록한 계좌가 없으면 결제수단 탭에서 무통장 입금을 켤 수 없습니다. 입금 대기 주문이 걸려 있는 계좌는 삭제 대신 고객에게 보이기만 끄게 합니다(이미 안내받은 고객이 입금할 수 있게).'),
    Canvas({ label: 'A-91 · 무통장 입금 탭 · 계좌 1개 등록' }, Page('무통장 입금', { actions: [Btn('계좌 추가', { kind: 'primary', icon: 'plus' })] }, Note('무통장 입금은 지금 꺼져 있습니다. 켜려면 결제수단 탭에서 스위치를 켜세요.'), Table({ cols: ACC_COLS, rows: accRows }), bankForm, BtnRow({ align: 'right' }, Btn('저장', 'primary')))),
    Canvas({ label: 'A-91 · 무통장 입금 탭 · 등록한 계좌가 없을 때' }, Page('무통장 입금', { actions: [Btn('계좌 추가', { kind: 'primary', icon: 'plus' })] }, Empty({ icon: 'wallet', title: '등록한 입금 계좌가 없습니다', desc: '계좌를 등록해야 결제수단에서 무통장 입금을 켤 수 있습니다.', action: Btn('계좌 추가', { kind: 'primary', icon: 'plus' }) }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '계좌 추가 → 은행 고르기 (검색형)', right: '팝업만', pad: 20 }, `<div style="min-height:300px">${accModal({ open: true })}</div>`),
        Canvas({ size: 'auto', label: '계좌 추가 · 입력 오류 (자릿수)', right: '팝업만', pad: 20 }, accModal({ err: true })),
    ),
    Canvas({ size: 'auto', label: '입금 대기 주문이 있는 계좌를 삭제할 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '이 계좌로 입금을 기다리는 주문이 5건 있습니다', desc: '국민은행 123456-04-****** — 삭제하면 이미 계좌를 안내받은 고객이 입금해도 주문과 짝을 맞추기 어렵습니다. 새 주문에만 안 보이게 하려면 고객에게 보이기를 끄세요.', foot: [Btn('취소'), Btn('고객에게 보이기만 끄기', 'primary')] })),
);

export default function A91() {
    return [state1, state2, state3, state4].join('');
}
