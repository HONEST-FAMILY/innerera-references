import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle,
    FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, SideDrawer,
    Box, KV, Note, Text, Icon, Flex, Grid, Thumb, Stats, Empty, Img, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const TABS = [{ t: '연결 상태' }, { t: '상품 연동', n: 5 }, { t: '주문 수집 기록' }, { t: '발송 전송 기록', n: 2 }, { t: '클레임 기록', n: 1 }, { t: '재고 동기화', n: 2 }, { t: '설정' }];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-70', actions: o.actions || [Btn('스마트스토어 판매자센터 열기', { icon: 'external-link' })], desc: o.desc }, o.tabs === false ? '' : Tabs(TABS, tab), body);

const StepCard = (n, title, body) => `<div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--line2)"><span style="flex:none;width:28px;height:28px;border-radius:50%;background:var(--dark);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px">${n}</span><div style="flex:1;min-width:0"><b style="font-size:14px">${title}</b><div style="font-size:13px;color:var(--ink2);margin-top:4px;line-height:1.7">${body}</div></div></div>`;

const KeyForm = (o = {}) => FormTable([
    { k: '애플리케이션 ID', required: true, v: Input({ value: o.id === undefined ? '' : o.id, placeholder: '예) 4kQ7xT2mPz9aLw3cRv8n', w: 360, error: o.err }), help: '커머스API센터 > 내 애플리케이션에서 복사' },
    { k: '애플리케이션 시크릿', required: true, v: [Input({ value: o.secret === undefined ? '' : o.secret, placeholder: '$2a$04$ 로 시작하는 긴 글자', w: 360, error: o.err }), Btn('보기', { size: 'sm', icon: 'eye-o' })], help: '저장한 뒤에는 앞 6자만 보이고 다시 볼 수 없습니다.', error: o.err },
]);

const state1 = StateBlock({ idx: 1, title: '연결 안 됨(연결 방법)', note: '스마트스토어 기능은 켰지만 아직 연결 정보를 넣지 않은 상태. 발급 방법을 단계로 안내하고 맨 아래에서 바로 넣습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '연결에 필요한 애플리케이션 ID·시크릿은 고객사가 네이버 커머스API센터에서 직접 발급받아야 합니다(스토어 주인 계정으로만 가능). 운영자가 어디서 무엇을 눌러야 하는지 몰라 멈추지 않게, 발급 화면에서 고를 값까지 단계로 적고 우리 서버 주소는 복사 버튼으로 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '네이버 쪽 등록 때 API 호출 IP에 우리 서버 주소를 넣지 않으면 연결 확인이 실패합니다. 시크릿은 저장 뒤 다시 보여 주지 않습니다. 설정 > 기능 켜고 끄기에서 스마트스토어를 끈 몰은 판매채널 메뉴 자체가 보이지 않습니다.'),
    Canvas({ label: 'A-70 · 연결 안 됨 · 연결 방법 단계 안내' }, Page('연결 상태', { tabs: false, desc: '스마트스토어를 연결하면 상품을 한 번에 등록하고, 두 곳 주문을 한 화면에서 출고할 수 있습니다.' },
        Box({ title: `${Icon('plug')} 스마트스토어가 아직 연결되지 않았습니다`, sub: '연결까지 10분쯤 걸립니다' },
            StepCard(1, '네이버 커머스API센터에 스토어 주인 계정으로 로그인', `스마트스토어 판매자센터의 <b>통합 매니저(주 계정)</b>로 로그인해야 합니다. ${Btn('커머스API센터 열기', { size: 'sm', icon: 'external-link' })}`),
            StepCard(2, '애플리케이션 등록', `애플리케이션 이름: 자유(예: 이너에라 공식몰) · 사용 범위: <b>내 스토어 애플리케이션</b> · API 그룹: <b>상품 · 주문 판매자 · 문의 · 판매자정보</b>를 모두 체크`),
            StepCard(3, 'API 호출 IP에 아래 주소 넣기', `<span style="display:inline-flex;align-items:center;gap:8px">${Input({ value: '3.36.***.123', w: 180, disabled: true })}${Btn('복사', { size: 'sm', icon: 'documents-o' })}</span><br>이 주소를 넣지 않으면 네이버가 우리 쇼핑몰의 요청을 받지 않습니다.`),
            StepCard(4, '발급된 애플리케이션 ID와 시크릿을 아래에 붙여 넣기', '등록을 마치면 내 애플리케이션 화면에 두 값이 나옵니다. 시크릿은 보기 버튼을 눌러 복사합니다.'),
            '<div style="height:14px"></div>',
            KeyForm(),
            Flex({ mt: 14, gap: 8, align: 'center' }, Btn('연결 확인하고 저장', { kind: 'primary', disabled: true }), Text('두 값을 모두 넣으면 버튼이 켜집니다. 넣은 값으로 네이버에 실제로 접속해 본 뒤 저장합니다.', { sm: true, mute: true })),
        ),
        Img({ h: 120, label: '커머스API센터 애플리케이션 등록 화면 따라 하기 그림 (사용 범위 · API 그룹 · 호출 IP 칸 표시) · 1000 × 360' }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '값을 넣고 연결 확인 → 실패 (사유별 문구)', right: '입력칸만', pad: 20 }, `<div style="width:640px">${KeyForm({ id: '4kQ7xT2mPz9aLw3cRv8n', secret: '••••••••••••••••••••', err: '네이버가 연결을 거부했습니다. 시크릿이 맞는지, 2단계에서 API 그룹(상품·주문 판매자)을 체크했는지 확인해 주세요.' })}${Note('다른 실패 사유 문구 — 호출 IP 미등록: 「3단계의 주소가 API 호출 IP에 등록되지 않았습니다.」 / 권한 부족: 「주문 판매자 API 그룹이 빠져 있어 주문을 가져올 수 없습니다.」', { warn: true })}${Flex({ mt: 10, gap: 8 }, Btn('다시 연결 확인', 'primary'))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '연결 확인 성공 → 스토어 확인 팝업', right: '팝업만', pad: 20 }, Modal({ title: '이 스토어가 맞나요?', w: 460, foot: [Btn('아니요, 다시 넣기'), Btn('맞습니다, 연결하기', 'primary')] },
            KV([['스토어 이름', '<b>이너에라 공식스토어</b>'], ['스토어 주소', 'smartstore.naver.com/innerera'], ['판매자', '이너에라 · 대표 이보림'], ['가져올 수 있는 것', '상품 · 주문 · 취소·반품·교환 요청']], { wide: true }),
            '<div style="height:12px"></div>',
            FormTable([
                { k: '주문 자동 수집', v: Select({ value: '10분마다', w: 140 }) },
                { k: '이미 있는 스마트스토어 상품', v: [Radio('우리 몰 상품과 짝짓기 화면으로 가기', { on: true }), Radio('나중에 하기')], help: '스마트스토어에 먼저 등록해 둔 상품 2개를 찾았습니다.' },
            ]),
        )),
    ),
);

const Conn = (o = {}) => Box({ title: `${Icon(o.broken ? 'link-broken' : 'link')} ${o.broken ? '연결이 끊겼습니다' : '연결됨'}`, sub: '이너에라 공식스토어 · smartstore.naver.com/innerera', right: [Btn('연결 다시 확인', { size: 'sm', icon: 'refresh' }), Btn('연결 정보 바꾸기', { size: 'sm' }), Btn('연결 끊기', { size: 'sm', kind: 'danger' })] },
    o.broken ? Note('11-11 08:50부터 네이버가 요청을 거부하고 있습니다(시크릿이 다시 발급된 것으로 보입니다). 주문 수집과 발송 전송이 멈췄습니다. 커머스API센터에서 시크릿을 확인해 연결 정보 바꾸기로 다시 넣어 주세요. 내부 수신자에게 알림을 보냈습니다.', { warn: true }) : '',
    KV([
        ['상태', o.broken ? `${Badge('연결 끊김', 'warn')} 마지막 성공 11-11 08:40` : `${Badge('정상', 'check')} 11-11 10:30 확인`],
        ['애플리케이션 ID', '4kQ7xT•••••••••••••• (시크릿은 다시 볼 수 없음)'],
        ['연결한 날', '2026-10-29 · 운영자 이보림'],
        ['마지막 주문 수집', o.broken ? '<b>11-11 08:40</b> · 이후 멈춤' : '<b>11-11 10:30</b> · 새 주문 2건 · 다음 수집 10:40'],
        ['마지막 발송 전송', o.broken ? '11-11 08:35 · 이후 12건 대기 중' : '11-11 10:12 · 42건 성공'],
    ], { wide: true }),
);

const SyncSet = FormTable([
    { k: '주문 자동 수집', v: [Toggle('켬', { on: true }), Select({ value: '10분마다', w: 140 }), Btn('지금 수집', { size: 'sm', icon: 'refresh' })], help: '새 주문 · 취소·반품·교환 요청 · 구매확정을 함께 가져옵니다. 수집한 주문은 주문 목록에 채널 = 스마트스토어로 들어옵니다.' },
    { k: '발주확인', v: RadioGroup(['수집하면 자동으로 발주확인', '운영자가 발주 확인 화면에서 직접'], '운영자가 발주 확인 화면에서 직접') },
    { k: '재고 맞추기', v: RadioGroup(['우리 몰 재고와 함께 쓰기', '상품마다 따로 정하기'], '우리 몰 재고와 함께 쓰기'), help: '함께 쓰면 어느 쪽에서 팔려도 두 곳 재고가 같이 줄어듭니다.' },
    { k: '가격 맞추기', v: RadioGroup(['우리 몰 판매가와 같게', '상품마다 따로 정하기'], '상품마다 따로 정하기') },
    { k: '오류 알림', v: [Check('전송·수집 실패 시 내부 수신자에게 알림', { on: true }), Text('수신자는 설정 > 알림에서 바꿉니다', { sm: true, mute: true })] },
]);

const state2 = StateBlock({ idx: 2, title: '연결됨(상태·마지막 수집 시각)', note: '연결된 뒤 첫 화면. 지금 연결이 살아 있는지, 마지막으로 주문을 가져온 때, 자동 수집 주기를 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '운영자가 가장 불안한 것은 스마트스토어 주문이 안 들어오고 있는데 모르는 것입니다. 마지막 수집 시각과 다음 수집 예정을 맨 위에 두고, 오늘 오간 건수와 실패 건수를 카드로 보여 줍니다. 실패가 있으면 카드를 눌러 바로 그 기록으로 갑니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기값: 자동 수집 10분마다 · 발주확인은 운영자가 직접 · 재고 함께 쓰기. 수집 주기는 5분·10분·30분·1시간 중에서 고릅니다. 연결이 끊기면(시크릿 재발급·권한 회수) 화면 맨 위와 대시보드에 경고가 뜨고 내부 수신자에게 알림이 갑니다. 연결을 끊어도 이미 수집한 주문은 남습니다.'),
    Canvas({ label: 'A-70 · 연결 상태 탭 · 정상' }, Page('연결 상태', {},
        Conn(),
        Stats([
            { k: '오늘 수집한 주문', v: '14건', sub: '중복 건너뜀 3건', link: '주문 수집 기록', icon: 'download' },
            { k: '오늘 발송 전송', v: '42건', sub: '실패 2건', link: '실패 건 다시 보내기', icon: 'send', on: true },
            { k: '연동된 상품', v: '3개', sub: '오류 1 · 미연동 1', link: '상품 연동', icon: 'box' },
            { k: '취소·반품·교환 요청', v: '1건', sub: '오늘 수집', link: '취소 관리로', icon: 'undo' },
        ]),
        '<div style="height:16px"></div>',
        Box({ title: '수집·전송 설정', right: Btn('저장', { kind: 'primary', size: 'sm' }) }, SyncSet),
    )),
    Canvas({ label: 'A-70 · 연결 상태 탭 · 연결이 끊긴 경우' }, Page('연결 상태', {}, Conn({ broken: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '수집 주기 칸을 누름', right: '입력칸만', pad: 20 }, `<div style="width:190px;min-height:200px">${Select({ value: '10분마다', w: 140, open: true, options: ['5분마다', { t: '10분마다', sub: '기본', on: true }, '30분마다', '1시간마다'] })}</div>`),
        Canvas({ size: 'auto', label: '지금 수집 버튼 → 결과 안내', right: '안내만', pad: 20 }, Toast('스마트스토어 주문을 수집했습니다. 새 주문 2건 · 이미 있는 주문 1건은 건너뜀.', { action: '발주 확인으로' })),
        Canvas({ size: 'auto', label: '연결 끊기 버튼 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '스마트스토어 연결을 끊을까요?', desc: '주문 수집과 발송 전송이 멈춥니다.<br>아직 발송 전인 스마트스토어 주문 9건은 판매자센터에서 직접 처리해야 합니다.<br>이미 수집한 주문과 상품 짝짓기 정보는 남고, 다시 연결하면 이어집니다.', ok: '연결 끊기', danger: true })),
    ),
);

const SYNC = [
    { name: SHOP.product, items: 3, price: '49,000원', ssPrice: '51,000원', st: '연동됨', no: '10482716635', at: '11-10 17:42' },
    { name: '이너에라 롱지비티 선물 세트 (2박스 + 쇼핑백)', items: 1, price: '95,000원', ssPrice: '95,000원', st: '오류', reason: '대표 이미지 크기가 스마트스토어 기준보다 작습니다 (지금 800 × 800, 1000 × 1000 이상 필요)', fix: '상품 수정 > 이미지', at: '11-11 09:12' },
    { name: '이너에라 롱지비티 체험 3포', items: 1, price: '9,900원', ssPrice: '9,900원', st: '오류', reason: '스마트스토어 카테고리를 고르지 않았습니다', fix: '상품 수정 > 스마트스토어', at: '11-09 08:10' },
    { name: '이너에라 스틱 보관 케이스', items: 2, price: '9,000원', ssPrice: '-', st: '미연동', at: '-' },
    { name: '이너에라 쇼핑백 (소)', items: 1, price: '500원', ssPrice: '-', st: '미연동', at: '-' },
];
const stBadge = (s) => Badge(s, { 연동됨: 'check', 오류: 'warn', 미연동: 'mute', '전송 중': 'dash' }[s]);
const SYNC_COLS = [{ t: '', w: 48 }, { t: '상품명', w: 230 }, { t: '우리 몰 판매가', w: 92, align: 'right' }, { t: '스마트스토어 판매가', w: 112, align: 'right' }, { t: '연동 상태', w: 80 }, '스마트스토어 상품번호 · 오류 사유', { t: '마지막 전송', w: 96 }, { t: '', w: 96 }];
const syncRow = (s, o = {}) => ({
    hl: s.st === '오류', ...o,
    c: [Thumb(36), `<u>${s.name}</u><small>품목 ${s.items}개</small>`, s.price, s.ssPrice, stBadge(o.st || s.st),
        s.st === '연동됨' ? `<u>${s.no}</u><small>가격 · 재고 · 내용이 같습니다</small>` : s.st === '오류' ? `<b>${Icon('error-o')} ${s.reason}</b><small>고칠 곳: <u>${s.fix}</u></small>` : '<small>스마트스토어에 보내지 않은 상품</small>',
        s.at, s.st === '미연동' ? Btn('연동하기', { size: 'sm' }) : Btn('다시 보내기', { size: 'sm', icon: 'refresh' })],
});

const state3 = StateBlock({ idx: 3, title: '상품 연동 목록(연동·미연동·오류 → 다시 보내기)', note: '우리 몰 상품마다 스마트스토어에 올라가 있는지, 두 곳 내용이 같은지. 오류는 사유와 고칠 곳을 보여 주고 고친 뒤 여러 개를 한 번에 다시 보냅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '네이버가 상품을 받아 주지 않는 이유는 대부분 이미지 규격·카테고리·상품정보제공고시 누락입니다. 네이버가 돌려준 말을 그대로 보여 주면 운영자가 못 고치므로 우리 말로 바꾸고 고칠 화면으로 가는 링크를 붙입니다. 고친 뒤에는 오류만 걸러 전체 선택 → 다시 보내기 한 번으로 끝냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '오류 상태인 상품은 스마트스토어에 예전 내용이 그대로 남아 있습니다(가격이 다를 수 있음). 미연동 상품을 연동하려면 스마트스토어 카테고리가 필요해 카테고리를 고르는 팝업이 먼저 뜹니다. 스마트스토어에 먼저 등록돼 있던 상품은 짝짓기로 우리 몰 상품과 이어 줍니다(새로 등록하면 리뷰·판매 기록이 사라지므로).'),
    Canvas({ label: 'A-70 · 상품 연동 탭 · 전체' }, Page('상품 연동', {},
        Filters({ open: false, summary: '연동 상태 전체 · 카테고리 전체' }),
        ListHead({ total: 5, left: Chips(['전체 5', '연동됨 1', '오류 2', '미연동 2'], '전체 5'), right: [Btn('스마트스토어 상품과 짝짓기', { size: 'sm', icon: 'link' }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: SYNC_COLS, rows: SYNC.map((s) => syncRow(s)) }),
        Note('금액은 예시 값입니다. 스마트스토어 판매가를 따로 정한 상품은 두 가격이 다르게 보입니다.'),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-70 · 오류만 거름 → 2개 선택 → 다시 보내기 → 결과' }, Overlay({ bg: Page('상품 연동', {},
        Filters({ open: false, summary: '연동 상태 오류' }),
        BulkBar({ count: 2, sub: '오류 2개' }, Btn('선택한 2개 다시 보내기', { kind: 'primary', icon: 'refresh' }), Btn('연동 끄기', 'line')),
        Table({ check: true, checked: [0, 1], cols: SYNC_COLS, rows: SYNC.slice(1, 3).map((s) => syncRow(s)) }),
    ), h: 520 },
        Modal({ title: '다시 보내기 결과', w: 600, foot: [Btn('닫기'), Btn('실패 1개 고치러 가기', 'primary')] },
            Flex({ gap: 8 }, `<div class="wf-excel" style="width:100%"><div class="sumrow"><div class="s"><span>보낸 상품</span><b>2개</b></div><div class="s ok">${Icon('check-circle-o')}<span>성공</span><b>1개</b></div><div class="s fail">${Icon('error-o')}<span>실패</span><b>1개</b></div></div></div>`),
            Table({ dense: true, cols: ['상품명', { t: '결과', w: 70 }, '사유'], rows: [
                ['롱지비티 선물 세트', Badge('성공', 'check'), '스마트스토어 상품번호 10482719902로 등록'],
                { hl: true, c: ['롱지비티 체험 3포', Badge('실패', 'warn'), `${Icon('error-o')} 스마트스토어 카테고리를 고르지 않았습니다. 상품 수정 > 스마트스토어에서 골라 주세요`] },
            ] }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '미연동 상품의 연동하기 버튼 → 카테고리 고르는 팝업', right: '팝업만', pad: 20 }, Modal({ title: '스마트스토어로 보내기 · 이너에라 스틱 보관 케이스', w: 560, foot: [Btn('취소'), Btn('스마트스토어로 보내기', 'primary')] },
            `<div style="min-height:250px">${FormTable([
                { k: '스마트스토어 카테고리', required: true, v: Select({ value: '', placeholder: '카테고리 이름으로 찾기', w: 340, open: true, search: '케이스', options: ['생활/건강 > 수납/정리용품 > 소품케이스', '생활/건강 > 건강관리용품 > 약통/약케이스', '패션잡화 > 지갑 > 카드/명함지갑'] }) },
                { k: '스마트스토어 판매가', v: [Radio('우리 몰과 같게 9,000원', { on: true }), Radio('따로 적기')] },
            ])}</div>`,
            Note('보내기 전에 확인: 대표 이미지 1000 × 1000 이상 · 상품정보제공고시 입력 · 배송비 템플릿 연결. 이 상품은 세 가지 모두 갖춰져 있습니다.'),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '스마트스토어 상품과 짝짓기 버튼 → 이미 스마트스토어에 있던 상품을 우리 몰 상품과 잇기', right: '팝업만', pad: 20 }, Modal({ title: '스마트스토어 상품과 짝짓기', w: 780, foot: [Text('2개 중 1개 짝지음', { sm: true }), Btn('취소'), Btn('짝짓기 저장', 'primary')] },
            Text('스마트스토어에 먼저 등록되어 있고 우리 몰 상품과 이어지지 않은 상품입니다. 짝을 지으면 새로 등록하지 않고 기존 스마트스토어 상품(리뷰·판매 기록 유지)에 가격·재고를 맞춥니다.', { sm: true }),
            Table({ dense: true, cols: ['스마트스토어 상품', { t: '', w: 30 }, { t: '우리 몰 상품', w: 300 }, { t: '옵션 짝', w: 130 }], rows: [
                ['[이너에라] 롱지비티 석류 젤리스틱 14포<small>상품번호 10482716635 · 옵션 3개</small>', Icon('exchange'), Select({ value: SHOP.productShort, w: 280 }), `${Badge('3개 모두 맞음', 'check')}`],
                { hl: true, c: ['이너에라 스틱 케이스 (베이지/차콜)<small>상품번호 10482801177 · 옵션 2개</small>', Icon('exchange'), Select({ placeholder: '우리 몰 상품 이름으로 찾기', w: 280 }), `${Badge('상품을 고르세요', 'dash')}`] },
            ] }),
            Note('옵션 이름이 달라 자동으로 맞지 않으면 옵션 짝 칸을 눌러 품목끼리 직접 이어 줍니다(스마트스토어 「2박스」 ↔ 우리 몰 「2박스(28일분)」).'),
        )),
    ),
    Canvas({ label: 'A-70 · 연동할 상품이 하나도 없는 몰' }, Page('상품 연동', {}, Empty({ icon: 'box', title: '스마트스토어에 보낸 상품이 없습니다', desc: '상품 목록에서 상품을 고른 뒤 스마트스토어로 보내기를 누르거나, 상품 수정에서 판매 채널에 스마트스토어를 체크하세요.', action: [Btn('상품 목록으로', 'primary'), Btn('스마트스토어 상품과 짝짓기')] }))),
);

const COLLECT_COLS = [{ t: '수집 일시', w: 120, sort: 'desc' }, { t: '방식', w: 80 }, { t: '새 주문', w: 76, align: 'right' }, { t: '중복 건너뜀', w: 90, align: 'right' }, { t: '취소·반품·교환 요청', w: 130, align: 'right' }, { t: '구매확정', w: 76, align: 'right' }, { t: '결과', w: 80 }, '내용'];

const state4 = StateBlock({ idx: 4, title: '주문 수집 기록', note: '스마트스토어에서 주문을 가져온 기록. 한 줄 = 수집 한 번. 몇 건을 새로 가져왔고 몇 건은 이미 있어 건너뛰었는지 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '주문이 빠졌다는 의심이 들 때 확인하는 곳입니다. 수집은 겹치는 시간대를 다시 훑기 때문에 이미 가져온 주문이 또 걸리는데, 이를 건너뛰었다고 숫자로 보여 줘야 주문이 두 번 들어온 것이 아님을 알 수 있습니다. 줄을 누르면 그때 가져온 주문 목록이 열립니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '우리 몰 상품과 짝이 없는 스마트스토어 상품의 주문은 수집은 되지만 재고가 줄지 않습니다 — 내용 칸에 표시하고 짝짓기로 보냅니다. 수집 실패가 3번 이어지면 내부 수신자에게 알림이 갑니다. 기록은 90일 동안 보관합니다.'),
    Canvas({ label: 'A-70 · 주문 수집 기록 탭' }, Page('주문 수집 기록', { actions: [Btn('지금 수집', { icon: 'refresh', kind: 'primary' })] },
        Filters({ rows: [{ k: '기간', v: Period({ preset: '오늘', from: '2026-11-11', to: '2026-11-11' }) }, { k: '결과', v: CheckGroup(['성공', '일부 실패', '실패', '새 주문이 있는 수집만'], ['성공', '일부 실패', '실패']) }] }),
        ListHead({ total: 63, left: Text('오늘 새 주문 14건 · 중복 건너뜀 3건 · 실패 1번', { sm: true, mute: true }), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: COLLECT_COLS, rows: [
            ['11-11 10:30', '자동', '<b>2건</b>', '0건', '0건', '1건', Badge('성공', 'check'), '<u>가져온 주문 보기</u>'],
            ['11-11 10:20', '자동', '0건', '0건', '0건', '0건', Badge('성공', 'check'), '<small>새 주문 없음</small>'],
            ['11-11 10:12', '수동 · 정수아', '<b>1건</b>', '1건', '0건', '0건', Badge('성공', 'check'), '<u>가져온 주문 보기</u>'],
            { hl: true, c: ['11-11 09:40', '자동', '<b>3건</b>', '2건', '1건', '0건', Badge('일부 실패', 'warn'), `<b>${Icon('error-o')} 주문 1건의 상품이 우리 몰 상품과 짝지어지지 않았습니다</b><small>주문은 들어왔지만 재고가 줄지 않았습니다 · <u>짝짓기로 이동</u></small>`] },
            { hl: true, c: ['11-11 08:50', '자동', '-', '-', '-', '-', Badge('실패', 'warn'), `<b>${Icon('error-o')} 네이버 서버가 응답하지 않았습니다(시간 초과)</b><small>다음 수집(09:00)에서 이 시간대를 다시 가져왔습니다</small>`] },
            ['11-11 08:40', '자동', '<b>4건</b>', '0건', '0건', '2건', Badge('성공', 'check'), '<u>가져온 주문 보기</u>'],
        ] }),
        Pager({ page: 1, last: 2, per: 50 }),
    )),
    Canvas({ label: 'A-70 · 09:40 줄을 누름 → 그때 가져온 주문 (오른쪽 드로어)' }, Overlay({ bg: Page('주문 수집 기록', {}, Filters({ open: false, summary: '기간 오늘' })), align: 'right', h: 560 },
        SideDrawer({ title: '수집한 주문', sub: '11-11 09:40 · 자동 수집', w: 700, foot: [Btn('발주 확인으로', 'primary')] },
            Table({ dense: true, cols: [{ t: '스마트스토어 주문번호', w: 150 }, '상품 · 구성', { t: '받는 분', w: 70 }, { t: '구분', w: 100 }, '처리'], rows: [
                ['<u>2026111145821371</u>', `${P}<small>1박스(14일분) · 2개</small>`, '박서준', Badge('새 주문', 'bold'), '주문 목록에 추가 · 재고 -2'],
                ['<u>2026111145830044</u>', `${P}<small>2박스(28일분) · 1개</small>`, '윤서연', Badge('새 주문', 'bold'), '주문 목록에 추가 · 재고 -1'],
                { hl: true, c: ['<u>2026111145833920</u>', '이너에라 스틱 케이스 (베이지/차콜)<small>베이지 · 1개</small>', '강지호', Badge('새 주문', 'bold'), `<b>${Icon('error-o')} 짝 없는 상품 — 재고 차감 안 됨</b>`] },
                { dim: true, c: ['2026111045790022', `${P}<small>2박스(28일분) · 1개</small>`, '정수아', Badge('중복', 'mute'), '이미 있는 주문이라 건너뜀'] },
                { dim: true, c: ['2026111045788101', `${P}<small>1박스(14일분) · 1개</small>`, '임재현', Badge('중복', 'mute'), '이미 있는 주문이라 건너뜀'] },
                ['<u>2026110945102277</u>', `${P}<small>4박스(56일분) · 1개</small>`, '최도윤', Badge('취소 요청', 'dot'), '취소 관리에 추가'],
            ] }),
        ))),
    Canvas({ label: 'A-70 · 수집 기록이 없을 때 (연결 직후)' }, Page('주문 수집 기록', {}, Empty({ icon: 'download', title: '아직 주문을 수집한 기록이 없습니다', desc: '연결한 뒤 10분 안에 첫 수집이 시작됩니다. 지금 바로 가져오려면 지금 수집을 누르세요.', action: [Btn('지금 수집', { kind: 'primary', icon: 'refresh' })] }))),
);

const SEND_COLS = [{ t: '전송 일시', w: 110, sort: 'desc' }, { t: '스마트스토어 주문번호', w: 150 }, '상품 · 받는 분', { t: '보낸 내용', w: 110 }, { t: '택배사 · 송장번호', w: 170 }, { t: '결과', w: 70 }, '실패 사유', { t: '', w: 86 }];

const state5 = StateBlock({ idx: 5, title: '발송 전송 기록(실패 재전송)', note: '우리 관리자에서 처리한 발주확인·발송처리·발송 지연·취소 승인 결과를 스마트스토어로 보낸 기록. 실패한 건은 사유를 보고 고쳐서 다시 보냅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '우리 화면에서는 발송처리가 끝났는데 스마트스토어에는 안 넘어간 주문이 가장 위험합니다(발송 기한 초과 벌점). 그래서 실패 건만 따로 탭 숫자로 보여 주고, 송장번호가 틀린 경우 이 자리에서 바로 고쳐 다시 보낼 수 있게 합니다. 일시적인 오류는 5분 간격으로 3번까지 자동으로 다시 보냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '자동 재전송 3번이 모두 실패한 건만 운영자가 손봐야 하는 실패로 남고, 대시보드 오늘 할 일과 내부 수신자 알림으로 올라갑니다. 이미 스마트스토어에서 취소된 주문처럼 다시 보내도 안 되는 건은 재전송 버튼 대신 해야 할 일을 안내합니다.'),
    Canvas({ label: 'A-70 · 발송 전송 기록 탭 · 실패만 거름' }, Page('발송 전송 기록', {},
        Filters({ rows: [{ k: '기간', v: Period({ preset: '7일' }) }, { k: '보낸 내용', v: CheckGroup(['발주확인', '발송처리', '발송 지연', '취소 승인·거부', '반품·교환 처리'], ['발주확인', '발송처리', '발송 지연', '취소 승인·거부', '반품·교환 처리']) }, { k: '검색어', v: Input({ placeholder: '스마트스토어 주문번호 · 송장번호 · 받는 분', icon: 'search', w: 360 }) }] }),
        ListHead({ total: 2, left: Chips(['전체 318', '성공 316', '실패 2'], '실패 2'), right: [Btn('실패 2건 모두 다시 보내기', { size: 'sm', icon: 'refresh', kind: 'primary' }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: SEND_COLS, rows: [
            { hl: true, c: ['11-11 10:12<small>3번 시도</small>', '<u>2026111045790022</u>', `${P}<small>2박스(28일분) · 정수아</small>`, '발송처리', `CJ대한통운<br>${Input({ value: '5812-3344-10', w: 150, error: true })}`, Badge('실패', 'warn'), `<b>${Icon('error-o')} 송장번호 형식이 맞지 않습니다</b><small>CJ대한통운은 숫자 12자리 · 왼쪽 칸에서 고친 뒤 다시 보내기</small>`, Btn('다시 보내기', { size: 'sm', kind: 'primary' })] },
            { hl: true, c: ['11-11 09:55<small>1번 시도</small>', '<u>2026110945102277</u>', `${P}<small>4박스(56일분) · 최도윤</small>`, '발송처리', 'CJ대한통운<br>581233441188', Badge('실패', 'warn'), `<b>${Icon('error-o')} 스마트스토어에서 이미 취소 요청된 주문입니다</b><small>다시 보내도 처리되지 않습니다 · 택배를 회수하거나 취소를 거부해야 합니다</small>`, Btn('취소 관리로', { size: 'sm' })] },
        ] }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-70 · 발송 전송 기록 탭 · 전체 (성공 건 포함)' }, Page('발송 전송 기록', {},
        Filters({ open: false, summary: '기간 최근 7일 · 보낸 내용 전체' }),
        ListHead({ total: 318, left: Chips(['전체 318', '성공 316', '실패 2'], '전체 318'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: SEND_COLS.slice(0, 7), rows: [
            ['11-11 10:12', '<u>2026111145821371</u>', `${P}<small>1박스(14일분) · 박서준</small>`, '발송처리', 'CJ대한통운 · 581233441202', Badge('성공', 'check'), '-'],
            ['11-11 09:50', '<u>2026111145830044</u>', `${P}<small>2박스(28일분) · 윤서연</small>`, '발주확인', '-', Badge('성공', 'check'), '-'],
            ['11-11 09:48', '<u>2026111045788101</u>', `${P}<small>1박스(14일분) · 임재현</small>`, '발송 지연', '-<small>사유 상품 준비 중 · 예정일 11-16</small>', Badge('성공', 'check'), '<small>2번째 시도에 성공 (첫 시도 시간 초과)</small>'],
            ['11-10 16:40', '<u>2026110945099310</u>', `${P}<small>1박스(14일분) · 이하은</small>`, '취소 승인', '-', Badge('성공', 'check'), '-'],
        ] }),
        Pager({ page: 1, last: 7, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '송장번호를 고치고 다시 보내기 → 성공', right: '안내만', pad: 20 }, Toast('주문 2026111045790022의 발송처리를 스마트스토어로 다시 보냈습니다. 우리 몰 송장번호도 함께 고쳤습니다.', { action: '배송 현황 보기' })),
        Canvas({ size: 'auto', label: '실패 2건 모두 다시 보내기 → 일부 실패 (닫기 전까지 남음)', right: '안내만', pad: 20 }, Toast('2건 중 1건을 다시 보냈습니다. 1건은 이미 취소 요청된 주문이라 보낼 수 없습니다.', { kind: 'error', action: '취소 관리로' })),
    ),
    Canvas({ label: 'A-70 · 실패 건이 없을 때' }, Page('발송 전송 기록', {}, Filters({ open: false, summary: '기간 최근 7일 · 결과 실패' }), Empty({ icon: 'check-circle-o', title: '전송에 실패한 건이 없습니다', desc: '최근 7일 동안 보낸 316건이 모두 스마트스토어에 반영됐습니다.', action: [Btn('전체 기록 보기')] }))),
);

const CLAIM_COLS = [{ t: '일시', w: 104, sort: 'desc' }, { t: '구분', w: 64 }, { t: '종류', w: 110 }, { t: '스마트스토어 주문번호', w: 150 }, { t: '상품 · 받는 분', w: 170 }, { t: '결과', w: 66 }, '내용 · 실패 사유', { t: '', w: 96 }];

const state6 = StateBlock({ idx: 6, title: '클레임 기록 탭', note: '스마트스토어에서 가져온 취소·반품·교환 요청과, 우리 관리자에서 승인·거부한 결과를 네이버로 보낸 기록. 한 줄 = 요청 한 건 또는 전송 한 번.' },
    Anno({ title: '왜 이렇게 하나' }, '스마트스토어 주문의 환불은 네이버가 합니다. 우리는 요청을 가져와 취소·반품·교환 관리 화면에서 승인·거부를 누르고 그 결과를 네이버로 보낼 뿐입니다. 그래서 승인을 눌렀는데 네이버에 안 넘어간 건이 가장 위험합니다 — 고객은 환불을 못 받고 우리 화면은 처리 끝으로 보입니다. 실패 건만 따로 모아 다시 보냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '수집 = 네이버 → 우리(요청), 전송 = 우리 → 네이버(처리 결과). 스마트스토어 주문의 결제·환불·구매확정·구매자 알림은 네이버 몫이라 이 화면에는 금액이 나오지 않습니다. 네이버에서 구매자가 요청을 철회하면 수집 기록에 철회로 남고 우리 쪽 요청도 자동으로 닫힙니다.'),
    Canvas({ label: 'A-70 · 클레임 기록 탭 · 전체' }, Page('클레임 기록', {},
        Filters({ rows: [{ k: '기간', v: Period({ preset: '7일' }) }, { k: '구분 · 종류', v: [CheckGroup(['수집', '전송'], ['수집', '전송']), '<span style="color:var(--line)">|</span>', CheckGroup(['취소', '반품', '교환'], ['취소', '반품', '교환'])] }, { k: '검색어', v: Input({ placeholder: '스마트스토어 주문번호 · 받는 분', icon: 'search', w: 340 }) }] }),
        ListHead({ total: 6, left: Chips(['전체 6', '성공 5', '실패 1'], '전체 6'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: CLAIM_COLS, rows: [
            { hl: true, c: ['11-11 10:05<small>3번 시도</small>', Badge('전송', 'solid'), '반품 승인', '<u>2026110644120988</u>', `${P}<small>1박스(14일분) · 윤서연</small>`, Badge('실패', 'warn'), `<b>${Icon('error-o')} 네이버에서 아직 수거 완료로 바뀌지 않아 승인할 수 없습니다</b><small>택배사 수거 완료가 네이버에 반영된 뒤 다시 보내 주세요</small>`, Btn('다시 보내기', { size: 'sm', kind: 'primary' })] },
            ['11-11 09:40', Badge('수집', 'line'), '취소 요청', '<u>2026110945102277</u>', `${P}<small>4박스(56일분) · 최도윤</small>`, Badge('성공', 'check'), '사유: 단순 변심 · <u>취소 관리에서 보기</u>', ''],
            ['11-10 16:40', Badge('전송', 'solid'), '취소 승인', '<u>2026110945099310</u>', `${P}<small>1박스(14일분) · 이하은</small>`, Badge('성공', 'check'), '네이버가 환불 처리 · 재고 +1 원복', ''],
            ['11-10 14:12', Badge('수집', 'line'), '교환 요청', '<u>2026110543877102</u>', `${P}<small>2박스(28일분) · 강지호</small>`, Badge('성공', 'check'), '사유: 상품 파손 · <u>교환 관리에서 보기</u>', ''],
            ['11-09 11:30', Badge('전송', 'solid'), '반품 거부', '<u>2026110342550631</u>', `${P}<small>1박스(14일분) · 임재현</small>`, Badge('성공', 'check'), '거부 사유: 개봉 후 섭취한 상품', ''],
            { dim: true, c: ['11-08 20:02', Badge('수집', 'line'), '취소 요청 철회', '2026110744630015', `${P}<small>2박스(28일분) · 정수아</small>`, Badge('성공', 'check'), '구매자가 네이버에서 철회 · 우리 쪽 요청 자동 닫힘', ''] },
        ] }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '실패 건 다시 보내기 → 성공', right: '안내만', pad: 20 }, Toast('주문 2026110644120988의 반품 승인을 스마트스토어로 다시 보냈습니다. 환불은 네이버가 처리합니다.')),
        Canvas({ size: 'auto', label: '다시 보내도 실패 (닫기 전까지 남음)', right: '안내만', pad: 20 }, Toast('다시 보냈지만 실패했습니다 — 네이버에서 아직 수거 완료가 아닙니다.', { kind: 'error', action: '반품 관리에서 보기' })),
    ),
    Canvas({ label: 'A-70 · 클레임 기록이 없을 때' }, Page('클레임 기록', {}, Empty({ icon: 'undo', title: '기록이 없습니다', desc: '스마트스토어에서 취소·반품·교환 요청이 들어오거나 처리 결과를 보내면 여기에 남습니다.' }))),
);

const INV_COLS = [{ t: '', w: 48 }, '상품명 · 옵션 값', { t: '재고 차감 수량', w: 96, align: 'right' }, { t: '우리 판매 가능', w: 96, align: 'right' }, { t: '여유분', w: 56, align: 'right' }, { t: '보내야 할 재고', w: 96, align: 'right' }, { t: '네이버 재고', w: 84, align: 'right' }, { t: '일치', w: 76 }, { t: '마지막 전송', w: 150 }, { t: '', w: 100 }];
const invRow = (name, opt, n, ours, naver, at, o = {}) => ({ hl: o.bad, c: [Thumb(36), `${name}<small>${opt}</small>`, n, `${ours}건`, '0', `<b>${ours}</b>`, o.bad ? `<b>${naver}</b>` : naver, o.bad ? Badge('불일치', 'warn') : Badge('일치', 'check'), o.bad ? `${at}<small><b>${o.why}</b></small>` : at, o.bad ? Btn('지금 맞추기', { size: 'sm', kind: 'primary' }) : ''] });

const state7 = StateBlock({ idx: 7, title: '재고 동기화 탭(불일치·지금 맞추기)', note: '품목마다 우리 몰에서 팔 수 있는 수량과 네이버에 올라가 있는 재고가 같은지. 다른 줄은 지금 맞추기로 바로 다시 보냅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '두 곳이 재고 하나를 같이 쓰므로 숫자가 어긋나면 한쪽에서 없는 물건이 팔립니다. 우리 실물 재고가 바뀔 때마다(자사몰 주문·취소·입고) 네이버 옵션별 재고 = (실물 재고 ÷ 재고 차감 수량, 버림) − 여유분으로 자동 전송하고, 하루 한 번 전체를 대조합니다. 이 탭은 그 결과를 보여 주고 어긋난 줄만 손으로 맞추는 곳입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '기준은 항상 우리 재고입니다 — 지금 맞추기는 네이버 숫자를 우리 숫자로 덮어씁니다. 판매자센터에서 재고를 직접 고치면 다음 전송 때 덮어써집니다. 수집 간격(10분) 사이에 두 곳에서 동시에 팔려 모자라면 대시보드에 재고 부족 주문 경고가 뜹니다. 불일치·전송 실패는 내부 수신자에게 알림이 갑니다.'),
    Canvas({ label: 'A-70 · 재고 동기화 탭 · 불일치 2 (직접 고침 1 · 전송 실패 1)' }, Page('재고 동기화', { actions: [Btn('전체 대조', { icon: 'refresh', kind: 'primary' })] },
        Box({ flat: true }, KV([['마지막 전체 대조', '11-11 04:00 · 품목 4개 모두 일치 (그 뒤 불일치 2건 생김)'], ['자동 전송', '우리 재고가 바뀔 때마다 · 오늘 37번 · 실패 1번'], ['재고 여유분', '0개 (설정 탭에서 바꿈)']], { wide: true })),
        ListHead({ total: 4, left: Chips(['전체 4', '일치 2', '불일치 2'], '전체 4'), right: [Btn('불일치 2건 모두 맞추기', { size: 'sm', icon: 'refresh' }), PerPage(50)] }),
        Table({ check: true, cols: INV_COLS, rows: [
            invRow(P, '구성 1박스(14일분)', '1박스', 42, 42, '11-11 10:30'),
            invRow(P, '구성 2박스(28일분)', '2박스', 21, 21, '11-11 10:30'),
            invRow(P, '구성 4박스(56일분)', '4박스', 10, 12, '11-11 10:30', { bad: true, why: '판매자센터에서 재고를 직접 고친 것으로 보입니다' }),
            invRow('롱지비티 선물 세트', '옵션 없음', '2박스', 21, 24, '11-11 09:12 실패', { bad: true, why: '상품 전송 오류로 재고도 전송되지 않았습니다' }),
        ] }),
        Note('보내야 할 재고 = 우리 판매 가능 − 여유분. 네이버 재고는 마지막 대조 때 네이버에서 읽어 온 값입니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '지금 맞추기 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '네이버 재고를 12 → 10으로 맞출까요?', desc: '롱지비티 석류맛 젤리스틱 · 4박스(56일분)<br>우리 재고가 기준입니다. 네이버에 올라간 재고를 우리 판매 가능 수량으로 덮어씁니다.', ok: '지금 맞추기' })),
        Canvas({ size: 'auto', label: '맞추기 완료', right: '안내만', pad: 20 }, Toast('4박스(56일분)의 네이버 재고를 10으로 맞췄습니다.')),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '상품 전송 오류 때문에 맞출 수 없음 (닫기 전까지 남음)', right: '안내만', pad: 20 }, Toast('선물 세트는 상품 전송 오류를 먼저 고쳐야 재고를 보낼 수 있습니다.', { kind: 'error', action: '상품 연동 탭으로' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '전체 대조 버튼 → 결과', right: '팝업만', pad: 20 }, Modal({ title: '전체 대조 결과', w: 480, foot: [Btn('닫기'), Btn('불일치 2건 모두 맞추기', 'primary')] },
            `<div class="wf-excel"><div class="sumrow"><div class="s"><span>대조한 품목</span><b>4개</b></div><div class="s ok">${Icon('check-circle-o')}<span>일치</span><b>2개</b></div><div class="s fail">${Icon('error-o')}<span>불일치</span><b>2개</b></div></div></div>`,
            Note('네이버에서 지금 재고를 다시 읽어 와 비교했습니다(11-11 10:46).'),
        )),
        Canvas({ size: 'auto', label: '모두 일치할 때', right: '요약만', pad: 20 }, `<div style="width:420px">${Empty({ icon: 'check-circle-o', title: '모든 품목의 재고가 일치합니다', desc: '마지막 전체 대조 11-11 04:00 · 품목 4개' })}</div>`),
    ),
);

const COURIER_MAP = [['CJ대한통운', 'CJ대한통운', true], ['한진택배', '한진택배', true], ['롯데택배', '롯데택배', true], ['우체국택배', '우체국택배', true], ['경동택배', '', false]];

const state8 = StateBlock({ idx: 8, title: '설정 탭(택배사 코드 짝짓기·출고지/반품지·재고 여유분)', note: '우리 몰 설정값을 네이버가 쓰는 값과 이어 주는 곳. 처음 연결할 때 한 번 맞추면 됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '발송처리를 네이버로 보낼 때 택배사는 이름이 아니라 네이버가 정한 코드로 보내야 합니다. 설정 > 배송에 등록한 택배사마다 네이버 택배사를 한 번 짝지어 두면 운영자는 송장번호만 넣으면 됩니다. 출고지·반품지도 네이버 판매자 주소록에 있는 주소와 이어야 상품 등록과 반품 수거가 됩니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기값: 이름이 같은 택배사는 자동으로 짝지음 · 재고 여유분 0개 · 주문 수집 10분마다. 짝이 없는 택배사로 발송처리한 스마트스토어 주문은 전송이 실패하므로 경고를 띄웁니다. 재고 여유분은 두 곳에서 동시에 팔리는 것에 대비해 네이버에는 n개 적게 보내는 값입니다. 이 탭은 최고관리자만 고칠 수 있습니다. 네이버 택배사 코드 값 자체는 화면에 보이지 않고 이름으로 고릅니다(코드 표는 개발 때 네이버 문서 기준으로 넣음).'),
    Canvas({ label: 'A-70 · 설정 탭' }, Page('설정', {},
        Box({ title: '택배사 짝짓기', sub: '우리 택배사(설정 > 배송) ↔ 네이버 택배사' },
            Note('경동택배에 짝이 없습니다. 이 택배사로 발송처리한 스마트스토어 주문은 네이버로 전송되지 않습니다.', { warn: true }),
            Table({ dense: true, cols: [{ t: '우리 택배사', w: 220 }, { t: '', w: 40 }, { t: '네이버 택배사', w: 330 }, '상태'], rows: COURIER_MAP.map(([a, b, ok]) => ({ hl: !ok, c: [`${a}${a === 'CJ대한통운' ? ' <small>기본 택배사</small>' : ''}`, Icon('exchange'), ok ? Select({ value: b, w: 300 }) : Select({ placeholder: '네이버 택배사 이름으로 찾기', w: 300, error: true }), ok ? Badge('짝지음', 'check') : Badge('짝 없음', 'warn')] })) }),
        ),
        Box({ title: '출고지 · 반품지 짝짓기', sub: '우리 주소(설정 > 배송) ↔ 네이버 판매자 주소록', right: Btn('네이버 주소록 새로 고침', { size: 'sm', icon: 'refresh' }) },
            FormTable([
                { k: '기본 출고지', required: true, v: [Text('이너에라 본사 · 인천광역시 제물포구 방축로83번길 23', { sm: true }), Icon('exchange'), Select({ value: '이너에라 출고지 (네이버 주소록)', w: 280 })] },
                { k: '기본 반품지', required: true, v: [Text('출고지와 같음', { sm: true }), Icon('exchange'), Select({ value: '이너에라 반품지 (네이버 주소록)', w: 280 })], help: '네이버 주소록에 없는 주소는 스마트스토어 판매자센터에서 먼저 등록한 뒤 새로 고침을 눌러 주세요.' },
            ]),
        ),
        Box({ title: '재고 · 수집' },
            FormTable([
                { k: '재고 여유분', v: [Text('네이버에는', { sm: true }), Input({ value: '0', w: 80, suffix: '개' }), Text('적게 보내기', { sm: true })], help: '예) 2로 두면 우리 판매 가능 10건일 때 네이버에는 8로 보냅니다. 동시에 팔려 재고가 모자라는 일이 잦으면 올려 주세요.' },
                { k: '주문 자동 수집', v: [Toggle('켬', { on: true }), Select({ value: '10분마다', w: 140 })] },
                { k: '발주확인', v: RadioGroup(['수집하면 자동으로 발주확인', '운영자가 발주 확인 화면에서 직접'], '운영자가 발주 확인 화면에서 직접') },
            ]),
            `<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">${Btn('되돌리기')}${Btn('설정 저장', 'primary')}</div>`,
        ),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '짝 없는 택배사의 네이버 택배사 칸을 누름 → 검색형 목록', right: '입력칸만', pad: 20 }, `<div style="width:360px;min-height:230px">${Select({ value: '', placeholder: '네이버 택배사 이름으로 찾기', w: 300, open: true, search: '경동', options: ['경동택배', '합동택배', { t: '목록에 없음 — 기타 택배', sub: '배송 추적 안 됨' }] })}</div>`),
        Canvas({ size: 'auto', label: '재고 여유분을 2로 바꿔 저장 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '재고 여유분을 0 → 2로 바꿀까요?', desc: '연동된 품목 4개의 네이버 재고가 각각 2씩 줄어 다시 전송됩니다.<br>우리 판매 가능이 2 이하인 품목은 네이버에서 품절로 보입니다.', ok: '바꾸고 재고 다시 보내기' })),
    ),
    Canvas({ size: 'auto', label: '최고관리자가 아닌 운영자가 이 탭을 엶', right: '안내', pad: 20 }, `<div style="width:420px">${Note('이 탭은 최고관리자만 고칠 수 있습니다. 지금은 보기만 됩니다.', { warn: true })}</div>`),
);

const IpGuide = Box({ title: `${Icon('error-o')} 연결하지 못했습니다 — 허용 IP가 등록되지 않았습니다` },
    Text('네이버가 우리 서버에서 보낸 요청을 받지 않았습니다. 커머스API센터의 애플리케이션에 아래 주소를 API 호출 IP로 넣어야 합니다. 애플리케이션 ID와 시크릿은 맞습니다.'),
    `<div style="display:flex;align-items:center;gap:10px;margin:10px 0 4px;padding:12px;border:2px solid var(--dark);border-radius:4px;background:var(--box)"><span style="font-size:12.5px;color:var(--ink2)">우리 서버 주소</span><b style="font-size:17px;letter-spacing:.5px">3.36.***.123</b>${Btn('복사', { size: 'sm', icon: 'documents-o' })}</div>`,
    StepCard(1, '커머스API센터 > 내 애플리케이션에서 연결할 애플리케이션을 엽니다', Btn('커머스API센터 열기', { size: 'sm', icon: 'external-link' })),
    StepCard(2, '애플리케이션 수정 > API 호출 IP 칸에 위 주소를 넣고 저장합니다', '이미 다른 주소가 있으면 지우지 말고 추가하세요.'),
    StepCard(3, '아래 다시 연결 확인을 누릅니다', '네이버에 반영되기까지 잠시 걸릴 수 있습니다. 바로 안 되면 1 ~ 2분 뒤 다시 눌러 주세요.'),
    Flex({ mt: 14, gap: 8 }, Btn('다시 연결 확인', { kind: 'primary', icon: 'refresh' }), Btn('연결 정보 다시 넣기')),
);

const state9 = StateBlock({ idx: 9, title: '연결 실패(허용 IP 안내)', note: '애플리케이션 ID·시크릿을 넣고 연결 확인을 눌렀는데 실패한 모습. 가장 흔한 사유인 허용 IP 미등록은 우리 서버 주소와 넣는 방법을 바로 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '연결 실패의 대부분은 키가 틀려서가 아니라 네이버 쪽에 우리 서버 주소를 등록하지 않아서입니다. 운영자는 서버 주소가 무엇인지 모르므로 화면에 주소를 크게 보여 주고 복사 버튼을 붙입니다. 실패 사유는 세 가지(키 오류 · 권한 부족 · 허용 IP 미등록)로 나눠 사유마다 고칠 곳을 다르게 안내합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '서버를 옮기거나 주소가 바뀌면 이미 연결된 몰도 같은 사유로 끊깁니다 — 그때는 연결 상태 탭 맨 위에 같은 안내가 뜨고 내부 수신자에게 알림이 갑니다. 연결 정보를 넣고 확인하는 것은 최고관리자만 할 수 있습니다.'),
    Canvas({ label: 'A-70 · 연결 확인 → 실패 · 허용 IP 미등록' }, Page('연결 상태', { tabs: false }, IpGuide)),
    CanvasRow(
        Canvas({ size: 'auto', label: '실패 사유 = 키 오류', right: '안내만', pad: 20 }, `<div style="width:600px">${KeyForm({ id: '4kQ7xT2mPz9aLw3cRv8n', secret: '••••••••••••••••••••', err: '애플리케이션 ID 또는 시크릿이 맞지 않습니다. 커머스API센터에서 다시 복사해 붙여 넣어 주세요(앞뒤 빈칸 주의).' })}${Flex({ mt: 10 }, Btn('다시 연결 확인', 'primary'))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '실패 사유 = 권한 부족', right: '안내만', pad: 20 }, `<div style="width:640px">${Box({ title: `${Icon('error-o')} 연결은 됐지만 권한이 부족합니다` }, Table({ dense: true, cols: [{ t: '필요한 권한', w: 130 }, { t: '상태', w: 90 }, '없으면 안 되는 일'], rows: [['상품', Badge('있음', 'check'), '상품 등록·가격·재고 전송'], { hl: true, c: ['주문 판매자', Badge('없음', 'warn'), '<b>주문 수집 · 발주확인 · 발송처리 · 취소·반품·교환</b>'] }, ['판매자정보', Badge('있음', 'check'), '출고지·반품지 주소록 읽기']] }), Note('커머스API센터 > 애플리케이션 수정에서 주문 판매자 권한을 체크한 뒤 다시 연결 확인을 눌러 주세요.', { warn: true }), Btn('다시 연결 확인', 'primary'))}</div>`),
    ),
    Canvas({ label: 'A-70 · 이미 연결된 몰이 같은 사유로 끊긴 경우 — 연결 상태 탭 맨 위 안내 + 다시 연결' }, Page('연결 상태', {},
        `<div style="border:2px solid var(--dark);background:var(--warnbg);border-radius:4px;padding:12px 14px;margin-bottom:14px;font-size:13.5px;display:flex;align-items:center;gap:10px">${Icon('error-o')}<div style="flex:1"><b>11-11 08:50부터 연결이 끊겼습니다 — 허용 IP가 등록되지 않았습니다.</b><br>주문 수집과 발송 전송이 멈췄습니다(발송 전송 대기 12건). 우리 서버 주소 <b>3.36.***.123</b> 을 커머스API센터의 API 호출 IP에 넣어 주세요.</div>${Btn('주소 복사', { size: 'sm', icon: 'documents-o' })}${Btn('다시 연결', { size: 'sm', kind: 'primary', icon: 'refresh' })}</div>`,
        Box({ title: '연결 정보' }, KV([['스토어', '이너에라 공식스토어 · smartstore.naver.com/innerera'], ['상태', `${Badge('연결 끊김', 'warn')} 마지막 성공 11-11 08:40`], ['마지막 주문 수집', '<b>11-11 08:40</b> · 이후 멈춤'], ['마지막 발송 전송', '11-11 08:35 · 이후 12건 대기 중']], { wide: true })),
    )),
    Canvas({ size: 'auto', label: '다시 연결 확인 → 성공', right: '안내만', pad: 20 }, Toast('스마트스토어에 다시 연결했습니다. 밀린 발송 전송 12건을 보내고 주문 수집을 다시 시작합니다.', { action: '발송 전송 기록 보기' })),
);

export default function A70() {
    return [state1, state2, state3, state4, state5, state6, state7, state8, state9].join('');
}
