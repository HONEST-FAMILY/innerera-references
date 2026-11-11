import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast,
    Box, KV, Note, Text, Icon, Flex, Grid, Empty, Thumb, Img, Timeline, MobilePage, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const Col = (...c) => `<div style="min-width:0">${c.join('')}</div>`;

const TAB_LIST = [{ t: '미답변', n: 7 }, { t: '답변완료', n: 412 }, { t: '전체', n: 419 }];
const Page = (tab, ...body) => AdminLayout({ active: 'a-50', counts: { 'a-50': 7, 'a-51': 3 }, actions: [Btn('자주 쓰는 답변 관리', { icon: 'bookmark-o' }), Btn('문의 분류 설정', { icon: 'cog' })], desc: '오늘 들어온 문의 9건 · 평균 답변 시간 2시간 40분(이번 주)' }, Tabs(TAB_LIST, tab), body);

const COLS = [{ t: '경과', w: 110, sort: 'desc' }, { t: '분류', w: 76 }, '제목 · 내용 앞부분', { t: '회원', w: 120 }, { t: '연결 주문', w: 170 }, { t: '접수', w: 96 }, { t: '담당', w: 90 }];
const QS = [
    { el: Badge('26시간 지남', 'warn'), cat: '반품', t: '상자가 찌그러져서 왔어요. 교환되나요?', sub: '사진 2장 · 어제 받았는데 상자 한쪽이 눌려서...', who: '이하은', tel: '010-****-7730', ord: '20261107-000112', st: '배송완료', at: '11-10 12:20', own: '-', hl: true },
    { el: Badge('9시간 12분', 'warn'), cat: '배송', t: '제주도인데 추가 배송비가 왜 붙나요', sub: '주문할 때 3,000원이 더 붙었는데 안내를 못 봤어요', who: '최도윤', tel: '010-****-2204', ord: '20261111-000126', st: '결제완료', at: '11-11 05:10', own: '-', hl: true },
    { el: '3시간 12분', cat: '배송', t: '어제 주문했는데 언제 출발하나요?', sub: '선물이라 금요일까지 받아야 해요', who: '김민지', tel: '010-****-1234', ord: '20261111-000128', st: '결제완료', at: '11-11 11:10', own: '정수아(작성 중)' },
    { el: '1시간 40분', cat: '상품', t: '하루에 2포 먹어도 되나요', sub: '1일 1포라고 되어 있는데...', who: '박서준', tel: '010-****-5821', ord: '', st: '', at: '11-11 12:42', own: '-' },
    { el: '25분', cat: '결제', t: '카드 결제가 두 번 된 것 같아요', sub: '문자가 두 번 왔습니다', who: '정수아', tel: '010-****-9015', ord: '20261111-000133', st: '결제완료', at: '11-11 13:57', own: '-' },
    { el: '8분', cat: '기타', t: '대량 구매 문의드립니다(회사 선물)', sub: '50박스 정도 견적 받을 수 있을까요', who: '비회원 강지호', tel: '010-****-4468', ord: '', st: '', at: '11-11 14:14', own: '-' },
];
const row = (q) => ({ hl: q.hl, c: [q.el, q.cat, `<u>${q.t}</u><small>${q.sub}</small>`, `${q.who}<small class="nw">${q.tel}</small>`, q.ord ? `<u>${q.ord}</u><small>${OrderBadge(q.st)}</small>` : '<small>연결된 주문 없음</small>', q.at, q.own] });

const listBody = (checked = []) => [
    Filters({ open: false, summary: '기간 전체 · 분류 전체 · 담당 전체' }),
    checked.length
        ? BulkBar({ count: checked.length, sub: '배송 문의 2건' }, Btn('같은 답변 한 번에 보내기', 'primary'), Btn('담당자 지정', 'line'), Btn('분류 바꾸기', 'line'))
        : ListHead({ total: 7, left: Chips(['전체 7', '배송 3', '반품·교환 1', '상품 1', '결제 1', '기타 1'], '전체 7'), right: [Text('오래 기다린 순', { sm: true, mute: true }), PerPage(50)] }),
    Table({ check: true, checked, cols: COLS, rows: QS.map(row) }),
    Note('경과 시간은 영업시간(평일 10:00 ~ 17:00)과 관계없이 접수한 때부터 셉니다. 8시간이 넘으면 경고 표시, 24시간이 넘으면 줄 전체가 강조되고 대시보드 "미답변 문의" 카드에 따로 셉니다.'),
    Pager({ page: 1, last: 1, per: 50 }),
];

const state1 = StateBlock({ idx: 1, title: '미답변 우선 목록', note: '고객응대 > 1:1 문의의 첫 화면. 미답변 탭이 먼저 열리고 가장 오래 기다린 문의가 맨 위입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '문의는 "새로 온 것"이 아니라 "오래 기다린 것"부터 답해야 합니다. 그래서 첫 탭이 미답변이고 정렬 기본값이 경과 시간 긴 순입니다. 줄에서 바로 연결 주문과 그 주문의 지금 상태가 보여서, 열어 보기 전에 무슨 문의인지 짐작합니다. 다른 운영자가 답을 쓰는 중이면 담당 칸에 표시해 두 사람이 같은 문의에 답하지 않게 합니다.'),
    Anno({ warn: true, title: '모바일' }, '관리자는 PC 기준이지만 문의 답변은 사장님이 폰으로도 합니다(골격 D11). 그래서 이 화면과 답변 화면은 모바일에서도 쓸 수 있게 한 줄 카드로 접힙니다. 신규 문의가 오면 설정 > 알림의 내부 수신자에게 알림톡이 갑니다.'),
    Canvas({ label: 'A-50 · 미답변 탭(처음 열리는 탭)' }, Page('미답변', listBody())),
    Canvas({ label: 'A-50 · 배송 문의 2건 선택 → 일괄 처리 바' }, Page('미답변', listBody([1, 2]))),
    Canvas({ label: 'A-50 · 답변완료 탭' }, Page('답변완료',
        Filters({ rows: [
            { k: '기간', v: Period({ preset: '7일' }) },
            { k: '분류', v: CheckGroup(['전체', '배송', '반품·교환', '상품', '결제', '회원·적립금', '기타'], ['전체']) },
            { k: '검색어', v: [Select({ value: '제목 + 내용', w: 140 }), Input({ placeholder: '문의 내용 · 회원 이름 · 주문번호', icon: 'search', w: 320 })] },
            { k: '답변한 사람', v: Select({ value: '전체', w: 160 }) },
        ] }),
        ListHead({ total: 58, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: [{ t: '답변일', w: 110, sort: 'desc' }, { t: '분류', w: 76 }, '제목', { t: '회원', w: 110 }, { t: '연결 주문', w: 150 }, { t: '답변까지', w: 90 }, { t: '답변한 사람', w: 100 }, { t: '고객 알림', w: 110 }], rows: [
            ['11-11 10:02', '배송', '<u>송장번호가 조회가 안 돼요</u>', '윤서연', '<u>20261109-000121</u>', '42분', '정수아', Badge('알림톡 발송', 'check')],
            ['11-10 16:30', '반품', `<u>1박스만 반품하고 싶어요</u> ${Badge('추가 문의', 'bold')}`, '김민지', '<u>2026101245102233</u>', '3시간 5분', '이보림', Badge('알림톡 발송', 'check')],
            ['11-10 11:12', '상품', '<u>유통기한이 얼마나 남았나요</u>', '임재현', '-', '1시간 20분', '이보림', Badge('문자 대체', 'line')],
        ] }),
        Pager({ page: 1, last: 2, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'A-50 · 모바일 관리자 · 미답변 목록' }, MobilePage({ title: '1:1 문의', tab: false, right: Icon('filter') },
            Tabs([{ t: '미답변', n: 7 }, { t: '답변완료', n: 412 }], '미답변'),
            QS.slice(0, 4).map((q) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-top:10px;${q.hl ? 'background:var(--warnbg)' : ''}"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mute)"><span>${q.cat} · ${q.who}</span><span>${q.el}</span></div><b style="display:block;margin:4px 0">${q.t}</b><span style="font-size:12.5px;color:var(--ink2)">${q.ord ? `주문 ${q.ord} · ${q.st}` : '연결된 주문 없음'}</span></div>`).join(''),
        )),
        Canvas({ size: 'auto', label: '미답변이 0건일 때', right: '부분', pad: 20 },
            `<div style="width:560px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'check-circle-o', title: '답변을 기다리는 문의가 없습니다', desc: '오늘 9건에 모두 답했습니다. 평균 답변 시간 1시간 52분.', action: Btn('답변완료 문의 보기') })}</div>`,
            '<div style="height:16px"></div>',
            Modal({ title: '담당자 지정', w: 420, foot: [Btn('취소'), Btn('2건 지정', 'primary')] },
                Select({ value: '정수아', w: 360, open: true, search: '', options: [{ t: '이보림', sub: '최고 관리자 · 미답변 0건' }, { t: '정수아', sub: '고객응대 · 미답변 1건', on: true }, { t: '강지호', sub: '출고 · 문의 권한 없음', disabled: true }] }),
                '<div style="height:150px"></div>')),
    ),
);

const question = Box({ title: '문의 내용', sub: '11-11 11:10 접수 · 3시간 12분 경과', right: [Select({ value: '배송', w: 110 }), Badge('미답변', 'warn')] },
    Text('<b>어제 주문했는데 언제 출발하나요?</b>'),
    Text('안녕하세요. 어제 밤에 2박스 구성 주문했는데 아직 결제완료로만 나와서요.<br>선물이라 금요일(13일)까지는 꼭 받아야 하는데 오늘 출발 가능한가요?<br>안 되면 취소하고 다른 데서 사야 할 것 같아요.'),
    Flex({ gap: 8 }, Thumb(64, '첨부 1'), Text('첨부 사진 1장 · 누르면 크게 보기', { sm: true, mute: true })),
);

const answerBox = (o = {}) => Box({ title: '답변 쓰기', right: [Btn('자주 쓰는 답변 불러오기', { size: 'sm', icon: 'bookmark-o' }), Btn('이 답변을 자주 쓰는 답변으로 저장', { size: 'sm', icon: 'save' })] },
    Textarea({ value: o.empty ? '' : '안녕하세요, 김민지 님. 이너에라입니다.<br>주문하신 2박스(28일분) 구성은 오늘(11일) 오후 4시에 출고되어 CJ대한통운으로 발송됩니다.<br>보통 출고 다음 날 도착하므로 12일(목), 늦어도 13일(금)에는 받으실 수 있습니다.<br>출고되면 송장번호를 알림톡으로 보내 드리겠습니다. 감사합니다.', placeholder: '답변을 입력하세요', h: 150, count: o.empty ? '0 / 2,000' : '164 / 2,000', error: o.empty }),
    o.empty ? `<p class="err">${Icon('error-o')}답변 내용을 입력해 주세요.</p>` : '',
    Flex({ mt: 8, gap: 8, align: 'center', wrap: true }, Text('넣기', { sm: true, mute: true }), Chips(['#{고객이름}', '#{주문번호}', '#{송장번호}', '#{택배사}', '#{발송예정일}'], ''), Btn('사진 첨부', { size: 'sm', icon: 'paperclip' })),
    '<div style="height:10px"></div>',
    FormTable([
        { k: '고객 알림', v: [Check('답변 등록 알림 보내기 (알림톡 · 실패 시 문자)', { on: true }), Check('이메일로도 보내기', { on: false })], help: '답변 알림은 정보성이라 광고 수신 거부 회원에게도 나갑니다.' },
        { k: '운영자 메모', v: Input({ placeholder: '고객에게 안 보이는 내부 기록', w: 380 }) },
    ]),
    Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡' }, Text('[이너에라] 김민지 님, 문의하신 내용에 답변이 등록되었습니다.<br>문의: 어제 주문했는데 언제 출발하나요?<br>답변 보기: innerera.example/mypage/inquiries/3812', { sm: true })),
    Flex({ mt: 12, justify: 'space-between' }, Btn('임시 저장'), Flex({ gap: 6 }, Btn('목록으로'), Btn('답변 등록하고 알림 보내기', 'primary'))),
);

const orderPanel = Col(
    Box({ title: '연결 주문', right: Btn('주문 상세', { size: 'sm', icon: 'external-link' }) },
        Flex({ gap: 10, align: 'center' }, Thumb(48), `<div><b>${P}</b><br><span style="font-size:12.5px;color:var(--ink2)">2박스(28일분) · 1개 · 93,000원</span></div>`),
        '<div style="height:10px"></div>',
        KV([['주문번호', '<u>20261111-000128</u>'], ['상태', `${OrderBadge('결제완료')} 발주확인 전`], ['채널', ChannelBadge('자사몰')], ['결제', '카카오페이 · 11-10 23:48'], ['발송 기한', '11-13(금)'], ['배송지', '서울 마포구 월드컵북로 ***'], ['배송 메모', '문 앞에 놓아 주세요']]),
        Flex({ mt: 10, gap: 6, wrap: true }, Btn('발주확인', { size: 'sm' }), Btn('송장 입력', { size: 'sm' }), Btn('주문 취소', { size: 'sm' })),
    ),
    Box({ title: '김민지', sub: 'VIP · 주문 14건', right: Btn('회원 상세', { size: 'sm' }) },
        KV([['연락처', '010-****-1234'], ['누적 구매', '1,284,000원'], ['지난 문의', '2건 (반품 1 · 상품 1)']]),
        Note('응대 주의 메모: 파손 민감 — 완충재 넉넉히', { warn: true }),
    ),
);

const AnswerPage = (left, right) => AdminLayout({ active: 'a-50', counts: { 'a-50': 7 }, crumb: ['고객응대', '1:1 문의', '답변'], title: '1:1 문의 답변', actions: [Btn('이전 문의', { icon: 'angle-left-min' }), Btn('다음 미답변 문의', { iconRight: 'angle-right-min' })] },
    Grid('1fr 320px', Col(...left), right));

const tplModal = Modal({ title: '자주 쓰는 답변 불러오기', w: 680, foot: [Btn('자주 쓰는 답변 관리'), Btn('취소'), Btn('이 답변 넣기', 'primary')] },
    Flex({ gap: 6 }, Chips(['전체', '배송', '반품·교환', '상품', '결제'], '배송'), Input({ value: '출고', icon: 'search', w: 200, focus: true })),
    '<div style="height:10px"></div>',
    Grid('260px 1fr',
        `<div style="border:1px solid var(--line);border-radius:4px;font-size:13px"><div style="padding:9px 12px;background:var(--fill);font-weight:700">오늘 출고 안내 <small style="color:var(--mute);font-weight:400">· 42번 씀</small></div><div style="padding:9px 12px;border-top:1px solid var(--line2)">출고 지연 사과 <small style="color:var(--mute)">· 17번</small></div><div style="padding:9px 12px;border-top:1px solid var(--line2)">제주·도서산간 추가 배송비 <small style="color:var(--mute)">· 9번</small></div><div style="padding:9px 12px;border-top:1px solid var(--line2)">송장 조회가 안 될 때 <small style="color:var(--mute)">· 8번</small></div></div>`,
        Box({ flat: true, title: '오늘 출고 안내', sub: '변수는 이 문의의 값으로 채워져 들어갑니다' }, Text('안녕하세요, #{고객이름} 님. 이너에라입니다.<br>주문하신 상품은 오늘 오후 4시에 출고되어 #{택배사}로 발송됩니다.<br>보통 출고 다음 날 도착합니다. 출고되면 송장번호를 알림톡으로 보내 드리겠습니다.', { sm: true }),
            Note('넣은 뒤에 고쳐 쓸 수 있습니다. 쓰던 답변이 있으면 그 뒤에 이어 붙습니다.')),
    ),
);

const state2 = StateBlock({ idx: 2, title: '답변(자주 쓰는 답변 불러오기, 답변 시 알림)', note: '목록에서 문의를 누르면 열리는 화면. 왼쪽에 문의와 답변, 오른쪽에 연결 주문과 회원 정보가 나란히 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '"언제 와요?"에 답하려면 주문 상태를 봐야 합니다. 주문 메뉴로 갔다 오지 않도록 연결 주문의 상태·발송 기한·배송지를 답변칸 바로 옆에 두고, 발주확인·송장 입력까지 여기서 할 수 있게 합니다. 같은 질문이 반복되므로 자주 쓰는 답변을 불러와 고객 이름·송장번호가 자동으로 채워진 채 넣습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '답변을 등록하면 고객에게 무슨 알림이 나가는지 등록 버튼 위에 미리 보여 줍니다(버튼 이름도 "답변 등록하고 알림 보내기"). 등록한 답변을 고치면 고객에게 다시 알릴지 묻습니다. 답변을 쓰는 동안 다른 운영자에게는 "정수아 작성 중"으로 보입니다.'),
    Canvas({ label: 'A-50 · 문의 누름 → 답변 화면(답변 작성 중)' }, AnswerPage([question, answerBox()], orderPanel)),
    Canvas({ label: 'A-50 · 자주 쓰는 답변 불러오기 버튼 → 팝업(분류 · 검색 · 미리보기)' }, Overlay({ bg: AnswerPage([question, answerBox({ empty: false })], orderPanel), h: 600 }, tplModal)),
    CanvasRow(
        Canvas({ size: 'auto', label: '이 답변을 자주 쓰는 답변으로 저장 → 팝업', right: '팝업만', pad: 20 },
            Modal({ title: '자주 쓰는 답변으로 저장', w: 480, foot: [Btn('취소'), Btn('저장', 'primary')] }, FormTable([
                { k: '이름', required: true, v: Input({ value: '오늘 출고 안내(선물 일정)', w: 300 }) },
                { k: '분류', required: true, v: Select({ value: '배송', w: 160 }) },
                { k: '변수로 바꾸기', v: Check('고객 이름·날짜·택배사를 변수로 바꿔 저장', { on: true }), help: '"김민지" → #{고객이름}, "CJ대한통운" → #{택배사}' },
                { k: '함께 쓰기', v: RadioGroup(['모든 운영자', '나만'], '모든 운영자') },
            ]))),
        Canvas({ size: 'auto', label: '답변을 비우고 등록을 눌렀을 때', right: '부분', pad: 20 }, `<div style="width:560px">${Textarea({ placeholder: '답변을 입력하세요', h: 80, count: '0 / 2,000', error: true })}<p class="err">${Icon('error-o')}답변 내용을 입력해 주세요.</p></div>`,
            '<div style="height:14px"></div>', Toast('답변을 등록하고 김민지 님에게 알림톡을 보냈습니다.', { action: '다음 미답변 문의' }),
            '<div style="height:10px"></div>', Toast('답변은 등록했지만 알림톡·문자 발송에 실패했습니다(수신 번호 오류).', { kind: 'error', action: '발송 이력 보기' })),
    ),
    Canvas({ label: 'A-50 · 답변 완료된 문의 — 답변 수정 · 고객의 추가 문의' }, AnswerPage([
        question.replace('미답변', '답변완료'),
        Box({ title: '답변', sub: '11-11 14:25 · 정수아 · 답변까지 3시간 15분', right: [Badge('알림톡 발송 완료', 'check'), Btn('수정', { size: 'sm', icon: 'pen-o' }), Btn('삭제', { size: 'sm' })] },
            Text('안녕하세요, 김민지 님. 이너에라입니다.<br>주문하신 2박스(28일분) 구성은 오늘(11일) 오후 4시에 출고되어 CJ대한통운으로 발송됩니다. ...'),
            Text('고객이 읽음 11-11 14:31', { sm: true, mute: true })),
        Box({ title: '추가 문의', sub: '11-11 15:02 · 김민지', right: Badge('미답변 · 12분 경과', 'warn') },
            Text('감사합니다! 혹시 선물 포장도 되나요?'),
            Textarea({ placeholder: '추가 문의에 답변을 입력하세요', h: 70, count: '0 / 2,000' }),
            Flex({ mt: 8, justify: 'flex-end' }, Btn('답변 등록하고 알림 보내기', 'primary'))),
    ], orderPanel)),
    CanvasRow(
        Canvas({ size: 'auto', label: '답변 수정 → 저장할 때 묻는 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 420, title: '고친 답변을 고객에게 다시 알릴까요?', desc: '고객이 이미 답변을 읽었습니다(11-11 14:31).<br>내용이 달라졌다면 다시 알리는 것을 권합니다.', foot: [Btn('알리지 않고 저장'), Btn('저장하고 다시 알림', 'primary')] })),
        Canvas({ size: 'mobile', label: 'A-50 · 모바일 관리자 · 답변 화면' }, MobilePage({ title: '문의 답변', tab: false, bottom: [Btn('자주 쓰는 답변'), Btn('답변 등록', 'primary')] },
            `<div style="font-size:12px;color:var(--mute)">배송 · 김민지 · 3시간 12분 경과</div><b>어제 주문했는데 언제 출발하나요?</b>`,
            Text('선물이라 금요일(13일)까지는 꼭 받아야 하는데 오늘 출발 가능한가요?', { sm: true }),
            `<div style="border:1px solid var(--line);border-radius:6px;padding:10px;margin:10px 0;font-size:12.5px"><b>주문 20261111-000128</b> ${OrderBadge('결제완료')}<br>2박스(28일분) · 1개 · 발송 기한 11-13(금) ${Icon('angle-right-min')}</div>`,
            Textarea({ placeholder: '답변을 입력하세요', h: 140, count: '0 / 2,000' }),
            Check('답변 알림 보내기(알림톡)', { on: true }),
        )),
    ),
);

const state3 = StateBlock({ idx: 3, title: '주문 연결 문의', note: '고객이 문의를 쓸 때 주문을 골랐거나, 운영자가 답변 화면에서 주문을 찾아 연결한 경우. 주문 상태에 따라 오른쪽 상자의 버튼이 달라집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '문의의 절반 이상이 특정 주문에 대한 것입니다. 연결 주문 상자에는 그 주문 상태에서 할 수 있는 처리 버튼만 나옵니다(결제완료 = 발주확인·송장 입력·취소 / 배송중 = 배송 조회·송장 수정 / 배송완료 = 반품 접수·교환 접수). 고객이 주문을 고르지 않았으면 운영자가 주문번호나 이름으로 찾아 붙입니다.'),
    Canvas({ label: 'A-50 · 배송완료 주문에 연결된 문의(상자 파손) — 여기서 바로 교환 접수' }, AnswerPage([
        Box({ title: '문의 내용', sub: '11-10 12:20 접수 · 26시간 지남', right: [Select({ value: '반품·교환', w: 120 }), Badge('미답변', 'warn')] },
            Text('<b>상자가 찌그러져서 왔어요. 교환되나요?</b>'), Text('어제 받았는데 상자 한쪽이 눌려서 안에 스틱 3포가 터져 있었어요. 사진 첨부합니다.'),
            Flex({ gap: 8 }, Thumb(64, '첨부 1'), Thumb(64, '첨부 2'))),
        Box({ title: '답변 쓰기', right: Btn('자주 쓰는 답변 불러오기', { size: 'sm', icon: 'bookmark-o' }) }, Textarea({ value: '안녕하세요, 이하은 님. 불편을 드려 죄송합니다. 새 상품으로 교환해 드리겠습니다. 내일 CJ대한통운 기사님이 방문해 수거하고, 수거와 동시에 새 상품을 보내 드립니다. 배송비는 저희가 부담합니다.', h: 110, count: '118 / 2,000' }),
            Note('교환 접수를 함께 하면 답변 알림과 교환 접수 알림이 따로 한 번씩 나갑니다.'),
            Flex({ mt: 10, justify: 'flex-end' }, Btn('답변 등록하고 알림 보내기', 'primary'))),
    ], Col(
        Box({ title: '연결 주문', right: Btn('주문 상세', { size: 'sm', icon: 'external-link' }) },
            Flex({ gap: 10, align: 'center' }, Thumb(48), `<div><b>${P}</b><br><span style="font-size:12.5px;color:var(--ink2)">1박스(14일분) · 1개 · 49,000원</span></div>`),
            '<div style="height:10px"></div>',
            KV([['주문번호', '<u>20261107-000112</u>'], ['상태', `${OrderBadge('배송완료')} 11-09 14:20`], ['송장', '<u>CJ대한통운 581233441077</u>'], ['구매확정', '11-16 자동 확정 예정'], ['반품 기한', '11-16 까지(수령 후 7일)']]),
            Flex({ mt: 10, gap: 6, wrap: true }, Btn('교환 접수', { size: 'sm', kind: 'primary' }), Btn('반품 접수', { size: 'sm' }), Btn('배송 조회', { size: 'sm' })),
        ),
        Box({ title: '이 주문의 다른 문의·클레임' }, Text('없음', { sm: true, mute: true })),
    ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '교환 접수 버튼 → 팝업(운영자가 대신 접수)', right: '팝업만', pad: 20 },
            Modal({ title: '교환 접수 · 주문 20261107-000112', w: 560, foot: [Btn('취소'), Btn('교환 접수하고 수거 요청', 'primary')] }, FormTable([
                { k: '대상', v: Text(`${P} · 1박스(14일분) · 1개`) },
                { k: '사유', required: true, v: Select({ value: '배송 중 파손', w: 200, open: true, options: [{ t: '배송 중 파손', on: true, sub: '판매자 부담' }, { t: '상품 불량', sub: '판매자 부담' }, { t: '다른 상품이 옴', sub: '판매자 부담' }, { t: '단순 변심', sub: '고객 부담' }] }) },
            ]), '<div style="height:120px"></div>', FormTable([
                { k: '교환 배송비', v: Text('0원 (판매자 부담 사유)') },
                { k: '수거', v: [Radio('택배사에 회수 요청(CJ대한통운)', { on: true }), Radio('고객이 직접 보냄')] },
                { k: '고객 알림', v: Check('교환 접수 안내 보내기', { on: true }) },
            ]))),
        Canvas({ size: 'auto', label: '주문이 연결되지 않은 문의 → 주문 찾아 연결', right: '부분', pad: 20 },
            `<div style="width:340px">${Box({ title: '연결 주문', sub: '없음' }, Text('고객이 주문을 고르지 않았습니다.', { sm: true, mute: true }),
                Input({ value: '박서준', icon: 'search', w: 290, focus: true }),
                `<div style="border:1px solid var(--ink);border-radius:4px;margin-top:4px;font-size:12.5px"><div style="padding:8px 10px;background:var(--fill)"><b>2026111145821371</b> ${OrderBadge('결제완료')}<br>스마트스토어 · 1박스(14일분) 2개 · 11-11</div><div style="padding:8px 10px;border-top:1px solid var(--line2)"><b>20261101-000101</b> ${OrderBadge('구매확정')}<br>자사몰 · 2박스(28일분) 1개 · 11-01</div></div>`,
                Note('이 회원의 최근 주문이 먼저 나옵니다. 주문번호·받는 분 이름·휴대폰 뒤 4자리로 찾습니다.'))}</div>`),
    ),
    Canvas({ size: 'auto', label: '연결 주문 상자 — 주문 상태별 버튼 차이', right: '부분', pad: 20 }, `<div style="width:900px">${Table({ cols: [{ t: '주문 상태', w: 110 }, '상자에 보이는 정보', '누를 수 있는 버튼'], rows: [
        [OrderBadge('입금대기'), '입금 기한 · 가상계좌', '입금 확인 · 주문 취소'],
        [OrderBadge('결제완료'), '발송 기한 · 배송지 · 배송 메모', '발주확인 · 송장 입력 · 주문 취소'],
        [OrderBadge('배송준비'), '발송 기한 · 배송지', '송장 입력 · 발송 지연 처리 · 배송지 수정'],
        [OrderBadge('배송중'), '택배사 · 송장번호 · 지금 위치', '배송 조회 · 송장 수정'],
        [OrderBadge('배송완료'), '도착일 · 자동 구매확정 예정일 · 반품 기한', '교환 접수 · 반품 접수 · 배송 조회'],
        [OrderBadge('구매확정'), '확정일 · 반품 기한 지남 여부', '주문 상세 열기(기한이 지나면 접수 버튼 없음)'],
        [OrderBadge('반품요청'), '반품 사유 · 진행 단계', '반품 관리로 가기'],
        [ChannelBadge('스마트스토어'), '네이버 주문번호 · 네이버 상태', '처리는 같지만 결과가 네이버로 전송된다는 안내가 붙음'],
    ] })}</div>`),
);

export default function A50() {
    return [state1, state2, state3].join('');
}
