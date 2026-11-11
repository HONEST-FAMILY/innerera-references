import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    Textarea, FormTable, ListHead, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Flex, Grid, Stats, Stars, Empty, Thumb, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const TABS = [{ t: '기본정보' }, { t: '주문', n: 14 }, { t: '클레임', n: 2 }, { t: '적립금' }, { t: '쿠폰', n: 2 }, { t: '문의', n: 3 }, { t: '리뷰', n: 5 }, { t: '메모', n: 2 }, { t: '로그인 기록' }];

const Col = (...c) => `<div style="min-width:0">${c.join('')}</div>`;

const Head = (o = {}) => Box({},
    Flex({ align: 'center', justify: 'space-between' },
        Flex({ align: 'center', gap: 14 },
            `<div style="width:52px;height:52px;border-radius:50%;background:var(--fill);display:flex;align-items:center;justify-content:center;font-size:22px">${Icon('user-o')}</div>`,
            `<div><b style="font-size:18px">김민지</b> ${Badge('VIP', 'solid')} ${Badge('카카오 가입', 'line')} ${o.memoBadge === false ? '' : Badge('응대 주의 메모 있음', 'warn')}<br><span style="font-size:12.5px;color:var(--mute)">${o.open ? 'minji0314@naver.com · 010-4821-1234' : 'mi****@naver.com · 010-****-1234'} · 가입 2026-03-14 · 최근 접속 2026-11-11 08:52</span></div>`,
        ),
        Flex({ gap: 6 }, Btn(o.open ? '다시 가리기' : '가린 정보 보기', { size: 'sm', icon: o.open ? 'eye-off-o' : 'eye-o' }), Btn('적립금 지급·차감', { size: 'sm' }), Btn('쿠폰 발급', { size: 'sm' }), Btn('알림톡·문자 보내기', { size: 'sm', icon: 'send' })),
    ),
    '<div style="height:14px"></div>',
    Stats([
        { k: '누적 구매 금액(원)', v: '1,284,000', sub: '최근 3개월 468,000원' },
        { k: '주문', v: '14건', sub: '자사몰 11 · 스마트스토어 3' },
        { k: '취소·반품·교환', v: '2건', sub: '반품 1 · 교환 1' },
        { k: '적립금', v: '12,400원', sub: '30일 안에 소멸 2,000원' },
        { k: '쿠폰', v: '2장', sub: '사용 6장' },
        { k: '미답변 문의', v: '1건', sub: '경과 3시간 12분', on: true },
    ]),
);

const Page = (tab, ...body) => AdminLayout({ active: 'a-31', crumb: ['회원', '회원 목록', '김민지'], title: '회원 상세', actions: [Btn('목록으로', { icon: 'list' }), Btn('이전 회원', { icon: 'angle-left-min' }), Btn('다음 회원', { iconRight: 'angle-right-min' })] },
    Head(), Tabs(TABS, tab), body);

const infoView = Grid('1fr 1fr',
    Box({ title: '기본정보', right: Btn('수정', { size: 'sm', icon: 'pen-o' }) }, KV([
        ['이름', '김민지'], ['이메일(아이디)', 'mi****@naver.com'], ['휴대폰', '010-****-1234 · 본인인증 완료 2026-03-14'], ['생년월일 · 성별', '1991-**-** · 여성'],
        ['가입 경로', `${Icon('kakaotalk')} 카카오 간편가입 · 네이버 연결 안 됨`], ['등급', `${Badge('VIP', 'solid')} 자동 산정 · 다음 산정일 12-01 유지 예상`], ['기본 배송지', '서울 마포구 월드컵북로 *** (배송지 3곳 등록)'], ['환불 계좌', '국민은행 ****-**-**1234 김민지'],
    ], { wide: true })),
    Col(
        Box({ title: '광고 수신 동의', sub: '동의·거부한 날짜가 법적 증빙입니다' }, Table({ dense: true, cols: ['수단', { t: '상태', w: 80 }, '바뀐 날 · 바꾼 곳'], rows: [
            ['문자', Badge('동의', 'check'), '2026-03-14 · 가입할 때'],
            ['이메일', Badge('동의', 'check'), '2026-03-14 · 가입할 때'],
            ['알림톡(채널 추가)', Badge('동의', 'check'), '2026-06-02 · 마이페이지에서 고객이 변경'],
        ] })),
        Box({ title: '약관 동의' }, KV([['이용약관', '동의 · 2026-03-14 (2026-01-01 시행본)'], ['개인정보 수집·이용', '동의 · 2026-03-14'], ['만 14세 이상', '확인']], { wide: true })),
        Box({ title: '회원 상태', right: Btn('강제 탈퇴', { size: 'sm', kind: 'danger' }) }, KV([['상태', `${Badge('정상', 'check')} 로그인 가능`], ['로그인 제한', '없음 · <u>로그인 막기</u>'], ['비밀번호', '카카오 로그인만 사용 · <u>비밀번호 재설정 안내 보내기</u>']], { wide: true })),
    ),
);

const infoEdit = Box({ title: '기본정보 수정', right: [Btn('취소', { size: 'sm' }), Btn('저장', { size: 'sm', kind: 'primary' })] }, FormTable([
    { k: '이름', required: true, v: Input({ value: '김민지', w: 220 }) },
    { k: '이메일(아이디)', v: Input({ value: 'minji0314@naver.com', w: 280, disabled: true }), help: '로그인에 쓰는 이메일은 운영자가 바꿀 수 없습니다. 고객이 마이페이지에서 인증 후 바꿉니다.' },
    { k: '휴대폰', required: true, v: Input({ value: '010-4821-12345', w: 220, error: true }), error: '휴대폰 번호는 숫자 10~11자리입니다. 한 자리가 더 들어갔습니다.' },
    { k: '생년월일', v: Input({ value: '1991-03-14', icon: 'calendar', w: 180 }) },
    { k: '등급', v: [Select({ value: 'VIP', w: 140 }), Check('등급 고정(자동 산정에서 제외)', { on: false })] },
    { k: '광고 수신 동의', v: CheckGroup(['문자', '이메일', '알림톡'], ['문자', '이메일', '알림톡']), help: '운영자가 대신 바꾸면 "운영자 변경(고객 요청)"으로 기록됩니다. 고객 요청 없이 동의로 바꾸면 안 됩니다.' },
    { k: '수정 사유', required: true, v: Input({ value: '고객 전화 요청 — 휴대폰 번호 변경', w: 360 }) },
]));

const ORDER_COLS = [{ t: '주문번호 · 주문일시', w: 150 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '수량', w: 48, align: 'center' }, { t: '결제금액', w: 112, align: 'right' }, { t: '결제수단', w: 90 }, { t: '상태', w: 86 }, { t: '송장', w: 130 }];
const orders = [
    ['<u>20261111-000128</u><small>11-11 09:42</small>', ChannelBadge('자사몰'), `${P}<small>${O2}</small>`, 1, '93,000원', '카카오페이', OrderBadge('결제완료'), '-'],
    ['<u>20261028-000092</u><small>10-28 20:15</small>', ChannelBadge('자사몰'), `${P}<small>${O2}</small>`, 1, '88,000원<small>쿠폰 -5,000</small>', '신용카드', OrderBadge('구매확정'), '<u>581233440871</u>'],
    ['<u>2026101245102233</u><small>10-12 11:03</small>', ChannelBadge('스마트스토어'), `${P}<small>${O1}</small>`, 2, '98,000원', '네이버페이', OrderBadge('반품완료'), '<u>581233440122</u>'],
    ['<u>20260930-000061</u><small>09-30 08:27</small>', ChannelBadge('자사몰'), `${P}<small>${O4}</small>`, 1, '176,000원', '신용카드', OrderBadge('구매확정'), '<u>581233439770</u>'],
];

const ordersTab = [
    ListHead({ total: 14, left: Chips(['전체 14', '진행 중 1', '구매확정 11', '취소·반품·교환 2'], '전체 14'), right: [Select({ value: '최근 1년', w: 120 }), Btn('이 회원 주문 엑셀', { icon: 'download', size: 'sm' })] }),
    Table({ cols: ORDER_COLS, rows: orders, foot: ['합계(구매확정 기준)', '', '', '', '1,284,000원', '', '', ''] }),
    Note('주문번호를 누르면 이 화면 위에 주문 상세가 오른쪽에서 열립니다(A-18). 금액은 예시 값입니다(판매가 미확정).'),
    Pager({ page: 1, last: 1 }),
];

const claimsTab = [
    ListHead({ total: 2, left: Chips(['전체 2', '취소 0', '반품 1', '교환 1'], '전체 2') }),
    Table({ cols: [{ t: '접수일', w: 96 }, { t: '종류', w: 70 }, { t: '주문번호', w: 150 }, '상품 · 구성', '사유', { t: '환불·추가 금액', w: 120, align: 'right' }, { t: '진행', w: 86 }, { t: '부담', w: 70 }], rows: [
        ['2026-10-15', Badge('반품', 'line'), '<u>2026101245102233</u>', `${P}<small>${O1} · 2개 중 1개</small>`, '단순 변심<small>"맛이 기대와 달라요"</small>', '43,000원<small>반품 배송비 -6,000</small>', OrderBadge('반품완료'), '고객'],
        ['2026-07-02', Badge('교환', 'line'), '<u>20260628-000033</u>', `${P}<small>${O1}</small>`, '상품 파손<small>사진 2장 첨부</small>', '0원', OrderBadge('교환완료'), '판매자'],
    ] }),
    Note('반품·교환이 잦은 회원인지 한눈에 봅니다. 이 회원: 주문 14건 중 2건(14%), 그중 고객 사유 1건.'),
];

const pointsTab = [
    Stats([{ k: '지금 쓸 수 있는 적립금', v: '12,400원' }, { k: '지금까지 받은 적립금', v: '38,900원' }, { k: '사용한 적립금', v: '24,500원' }, { k: '30일 안에 소멸 예정', v: '2,000원', sub: '2026-12-02 소멸' }]),
    ListHead({ total: 23, left: Chips(['전체', '적립', '사용', '소멸', '운영자 지급·차감'], '전체'), right: Btn('적립금 지급·차감', { kind: 'primary', size: 'sm', icon: 'plus' }) }),
    Table({ cols: [{ t: '일시', w: 130 }, { t: '구분', w: 76 }, '사유', { t: '금액', w: 96, align: 'right' }, { t: '남은 적립금', w: 100, align: 'right' }, { t: '소멸 예정일', w: 100 }, { t: '처리', w: 110 }], rows: [
        ['2026-11-04 10:12', Badge('적립', 'check'), '포토 리뷰 작성<small>주문 20261028-000092</small>', '+1,000원', '12,400원', '2027-11-04', '자동'],
        ['2026-11-03 00:10', Badge('적립', 'check'), '구매확정 적립 1%<small>주문 20261028-000092</small>', '+880원', '11,400원', '2027-11-03', '자동'],
        ['2026-10-28 20:15', Badge('사용', 'line'), '주문 결제에 사용<small>주문 20261028-000092</small>', '-5,000원', '10,520원', '-', '자동'],
        ['2026-10-20 15:40', Badge('지급', 'bold'), '배송 지연 사과<small>운영자 메모: 10-12 주문 3일 지연</small>', '+2,000원', '15,520원', '2026-12-02', '운영자 이보림'],
        { dim: true, c: ['2026-10-01 00:05', Badge('소멸', 'strike'), '유효기간 지남(2025-09-30 적립분)', '-490원', '13,520원', '-', '자동'] },
    ] }),
    Pager({ page: 1, last: 2 }),
];

const pointModal = (minus) => Modal({ title: '적립금 지급·차감 · 김민지', w: 580, foot: [Btn('취소'), Btn(minus ? '차감하기' : '3,000원 지급하기', { kind: 'primary', disabled: minus })] },
    KV([['지금 적립금', '<b>12,400원</b>'], ['처리 뒤', minus ? '<b>계산할 수 없음</b>' : '<b>15,400원</b>']]),
    '<div style="height:12px"></div>',
    FormTable([
        { k: '구분', required: true, v: RadioGroup(['지급', '차감'], minus ? '차감' : '지급') },
        minus
            ? { k: '금액', required: true, v: Input({ value: '15,000', suffix: '원', w: 160, error: true }), error: '가진 적립금(12,400원)보다 많이 차감할 수 없습니다. 12,400원 이하로 넣어 주세요.' }
            : { k: '금액', required: true, v: [Input({ value: '3,000', suffix: '원', w: 160 }), Chips(['1,000', '2,000', '3,000', '5,000'], '3,000')] },
        { k: '사유', required: true, v: minus
            ? Select({ placeholder: '사유를 고르세요', w: 220, open: true, options: ['잘못 지급한 적립금 회수', '주문 취소로 사용분 조정', '부정 이용', '기타(직접 입력)'] })
            : [Select({ value: '고객 불편 보상', w: 180 }), Input({ value: '11-11 문의 답변 지연 사과', w: 240 })], help: minus ? undefined : '고객의 마이페이지 적립금 내역에 그대로 보입니다.' },
        ...(minus ? [] : [
            { k: '유효기간', v: [Radio('정책대로(1년)', { on: true }), Radio('직접 지정')] },
            { k: '고객 알림', v: Check('적립금 지급 안내 보내기 (알림톡 · 실패 시 문자)', { on: true }) },
            { k: '운영자 메모', v: Input({ placeholder: '고객에게 안 보이는 내부 기록', w: 360 }) },
        ]),
    ]),
    minus ? '<div style="height:150px"></div>' : Box({ flat: true, title: '고객에게 가는 알림 미리보기' }, Text('[이너에라] 김민지 님, 적립금 3,000원이 지급되었습니다.<br>사유: 11-11 문의 답변 지연 사과 · 사용 기한 2027-11-11<br>현재 적립금 15,400원', { sm: true })),
);

const couponsTab = [
    ListHead({ total: 8, left: Chips(['보유 2', '사용 6', '만료·회수 0'], '보유 2'), right: Btn('쿠폰 발급', { kind: 'primary', size: 'sm', icon: 'plus' }) }),
    Table({ cols: ['쿠폰', { t: '유형', w: 96 }, { t: '혜택', w: 120 }, '사용 조건', { t: '받은 날 · 경로', w: 140 }, { t: '사용 기한', w: 110 }, { t: '관리', w: 80 }], rows: [
        ['<u>11월 감사 5,000원 할인</u>', Badge('주문서 쿠폰', 'line'), '5,000원 할인', '3만원 이상 주문', '2026-11-05<small>운영자 지정 발급</small>', `2026-12-05<small>${Badge('D-24', 'line')}</small>`, Btn('회수', { size: 'sm' })],
        ['<u>VIP 등급 무료배송</u>', Badge('배송비 쿠폰', 'line'), '배송비 전액', '조건 없음', '2026-11-01<small>등급 쿠폰 자동</small>', `2026-11-30<small>${Badge('D-19', 'line')}</small>`, Btn('회수', { size: 'sm' })],
    ] }),
];

const couponIssue = Modal({ title: '쿠폰 발급 · 김민지', w: 560, foot: [Btn('취소'), Btn('발급하기', 'primary')] },
    FormTable([
        { k: '쿠폰', required: true, v: Select({ value: '배송 지연 사과 3,000원', w: 340, open: true, search: '', options: [{ t: '배송 지연 사과 3,000원', sub: '주문서 쿠폰 · 조건 없음', on: true }, { t: '11월 무료배송 쿠폰', sub: '배송비 쿠폰' }, { t: '11월 감사 5,000원 할인', sub: '이미 보유', disabled: true }] }) },
    ]),
    '<div style="height:120px"></div>',
    FormTable([
        { k: '사용 기한', v: Text('발급일부터 30일 (2026-12-11 까지)') },
        { k: '고객 알림', v: Check('쿠폰 발급 안내 보내기', { on: true }), help: '이 회원은 광고 수신에 동의했습니다. 거부 회원이면 이 칸이 잠기고 쿠폰만 들어갑니다.' },
    ]),
);

const inquiriesTab = [
    ListHead({ total: 3, left: Chips(['전체 3', '1:1 문의 2', '상품 문의 1'], '전체 3') }),
    Table({ cols: [{ t: '접수', w: 120 }, { t: '종류', w: 90 }, { t: '분류', w: 80 }, '제목', { t: '연결 주문', w: 150 }, { t: '상태', w: 110 }, { t: '답변한 사람', w: 100 }], rows: [
        { hl: true, c: ['11-11 08:55', '1:1 문의', '배송', '<u>어제 주문했는데 언제 출발하나요?</u>', '<u>20261111-000128</u>', `${Badge('미답변', 'warn')}<small>3시간 12분 경과</small>`, '-'] },
        ['10-14 13:20', '1:1 문의', '반품', '<u>1박스만 반품하고 싶어요</u>', '<u>2026101245102233</u>', Badge('답변완료', 'check'), '운영자 이보림'],
        ['09-02 21:44', '상품 문의', '상품', `${Icon('lock-o')} <u>임산부가 먹어도 되나요?</u>`, '-', Badge('답변완료', 'check'), '운영자 이보림'],
    ] }),
    Note('제목을 누르면 고객응대 > 1:1 문의의 답변 화면이 같은 창에서 열리고, 답변을 마치면 이 탭으로 돌아옵니다.'),
];

const reviewsTab = [
    ListHead({ total: 5, left: Text('평균 별점 <b>4.6</b> · 포토 리뷰 3건 · 숨김 0건', { sm: true, mute: true }) }),
    Table({ cols: [{ t: '작성일', w: 96 }, { t: '별점', w: 100 }, '내용', { t: '사진', w: 70 }, { t: '적립금', w: 96 }, { t: '상태', w: 90 }], rows: [
        ['2026-11-04', Stars(5), '<u>아침마다 하나씩 먹는데 석류 향이 진해서 좋아요</u><small>주문 20261028-000092 · 2박스(28일분)</small>', Thumb(40), Badge('1,000원 지급', 'check'), `${Badge('베스트', 'bold')}`],
        ['2026-10-06', Stars(4), '<u>포장이 깔끔합니다. 조금 달아요</u><small>주문 20260930-000061 · 4박스(56일분)</small>', '-', Badge('500원 지급', 'check'), Badge('노출 중', 'line')],
    ] }),
];

const memoTab = Grid('1fr 1fr',
    Box({ title: '메모 쓰기', sub: '고객에게 보이지 않습니다' },
        Textarea({ value: '11-11 전화 옴. 배송 재촉. 오늘 출고 약속함.', h: 80, count: '27 / 500' }),
        Flex({ mt: 10, justify: 'space-between', align: 'center' }, Check('응대 주의로 표시(회원 이름 옆에 경고 표시, 주문 상세에도 보임)', { on: false }), Btn('메모 저장', { kind: 'primary', size: 'sm' })),
    ),
    Box({ title: '메모 2건' },
        `<div style="border:1px solid var(--line2);border-radius:4px;padding:10px 12px;margin-bottom:8px">${Badge('응대 주의', 'warn')} <b>파손 민감 — 완충재 넉넉히</b><br><span style="font-size:12.5px;color:var(--ink2)">7월 교환 때 상자 찌그러짐으로 항의. 이후 주문은 완충재 추가해서 출고.</span><br><span style="font-size:12px;color:var(--mute)">운영자 이보림 · 2026-07-03 11:20 · <u>수정</u> · <u>삭제</u></span></div>`,
        `<div style="border:1px solid var(--line2);border-radius:4px;padding:10px 12px"><b>정기 구매 고객</b><br><span style="font-size:12.5px;color:var(--ink2)">매달 말 2박스 구성 주문. 정기배송 열리면 먼저 안내.</span><br><span style="font-size:12px;color:var(--mute)">운영자 정수아 · 2026-09-30 09:02 · <u>수정</u> · <u>삭제</u></span></div>`,
    ),
);

const loginTab = [
    ListHead({ total: 61, left: Chips(['전체', '성공', '실패'], '전체'), right: Select({ value: '최근 3개월', w: 130 }) }),
    Table({ dense: true, cols: [{ t: '일시', w: 150 }, { t: '결과', w: 110 }, { t: '방법', w: 110 }, { t: '기기', w: 190 }, { t: '접속 주소', w: 150 }, '비고'], rows: [
        ['2026-11-11 08:52', Badge('성공', 'check'), '카카오', '모바일 · 아이폰 사파리', '211.***.***.18 · 서울', '-'],
        ['2026-11-09 22:10', Badge('성공', 'check'), '카카오', 'PC · 윈도우 크롬', '121.***.***.77 · 서울', '-'],
        { hl: true, c: ['2026-11-02 03:14', Badge('실패', 'x'), '이메일', 'PC · 윈도우 크롬', '45.***.***.9 · 해외(베트남)', '비밀번호 5회 틀림 → 10분 잠김 · 고객에게 알림 발송'] },
        ['2026-10-28 20:11', Badge('성공', 'check'), '카카오', '모바일 · 아이폰 사파리', '211.***.***.18 · 서울', '-'],
    ] }),
    Note('로그인 기록은 6개월 보관 후 자동으로 지워집니다. 해외나 새 기기에서 실패가 이어지면 줄이 강조됩니다.'),
    Pager({ page: 1, last: 2 }),
];

const state1 = StateBlock({ idx: 1, title: '탭: 기본정보·주문·클레임·적립금(지급·차감)·쿠폰(발급·회수)·문의·리뷰·메모·로그인 기록', note: '회원 목록·주문 상세·문의 답변 화면에서 회원 이름을 누르면 열립니다. 위쪽 요약 상자는 어느 탭에서나 그대로 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '전화를 받으면서 "이 고객이 누구인지"를 10초 안에 알아야 합니다. 그래서 주문·클레임·적립금·쿠폰·문의·리뷰를 각 메뉴로 찾아가지 않고 이 화면의 탭으로 모았고, 맨 위 요약에 구매 금액·미답변 문의·응대 주의 메모를 항상 띄웁니다. 처음 열리는 탭은 기본정보, 탭 숫자는 건수입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '이메일·휴대폰은 가려서 보이고 "가린 정보 보기"를 누른 사람·시각이 기록됩니다. 적립금 차감·쿠폰 회수·등급 변경처럼 고객에게 불리한 처리는 사유가 필수이고 고객 알림 기본값이 꺼져 있습니다. 기능이 꺼진 몰은 그 탭(적립금·쿠폰·리뷰)과 요약 칸이 함께 사라집니다.'),
    Canvas({ label: 'A-31 · 기본정보 탭(처음 열리는 탭)' }, Page('기본정보', infoView)),
    CanvasRow(
        Canvas({ size: 'auto', label: '기본정보 > 수정 버튼 → 수정 모드(입력 오류 포함)', right: '부분', pad: 20 }, `<div style="width:640px">${infoEdit}</div>`),
        Canvas({ size: 'auto', label: '가린 정보 보기 버튼 → 확인 팝업 → 가림 풀린 머리', right: '부분', pad: 20 },
            Confirm({ w: 420, title: '가린 개인정보를 볼까요?', desc: '이메일·휴대폰·생년월일·주소 전체가 10분 동안 보입니다.<br>운영자 이보림 님이 2026-11-11 14:30 에 본 기록이 남습니다.', ok: '기록 남기고 보기' }),
            '<div style="height:16px"></div>',
            `<div style="width:560px;font-size:12.5px;border:1px solid var(--line);border-radius:4px;padding:12px"><b style="font-size:16px">김민지</b> ${Badge('VIP', 'solid')}<br>minji0314@naver.com · 010-4821-1234 · 1991-03-14<br><span style="color:var(--mute)">${Icon('eye-o')} 가림 풀림 · 9분 41초 뒤 다시 가려집니다 · <u>다시 가리기</u></span></div>`),
    ),
    Canvas({ label: 'A-31 · 주문 탭' }, Page('주문', ordersTab)),
    Canvas({ label: 'A-31 · 클레임 탭(취소·반품·교환)' }, Page('클레임', claimsTab)),
    Canvas({ label: 'A-31 · 적립금 탭' }, Page('적립금', pointsTab)),
    CanvasRow(
        Canvas({ size: 'auto', label: '적립금 지급·차감 버튼 → 팝업 · 지급', right: '팝업만', pad: 20 }, pointModal(false)),
        Canvas({ size: 'auto', label: '차감 · 가진 것보다 많이 넣음 + 사유 목록 열림', right: '팝업만', pad: 20 }, pointModal(true)),
    ),
    Canvas({ label: 'A-31 · 쿠폰 탭(보유)' }, Page('쿠폰', couponsTab)),
    CanvasRow(
        Canvas({ size: 'auto', label: '쿠폰 발급 버튼 → 팝업(쿠폰 검색형 목록 열림)', right: '팝업만', pad: 20 }, couponIssue),
        Canvas({ size: 'auto', label: '회수 버튼 → 확인 팝업 · 사용 탭 · 완료 토스트', right: '부분', pad: 20 },
            Confirm({ w: 420, title: '"11월 감사 5,000원 할인" 쿠폰을 회수할까요?', desc: '고객의 쿠폰함에서 바로 사라지고 되돌릴 수 없습니다(다시 주려면 새로 발급).<br>고객에게 알림은 가지 않습니다.', ok: '회수하기', danger: true }),
            '<div style="height:16px"></div>',
            `<div style="width:600px">${Table({ dense: true, cols: ['쿠폰(사용 탭)', { t: '쓴 주문', w: 150 }, { t: '할인받은 금액', w: 100, align: 'right' }, { t: '쓴 날', w: 96 }], rows: [['가입 축하 3,000원 할인', '<u>20260314-000007</u>', '3,000원', '2026-03-14'], ['10월 5,000원 할인', '<u>20261028-000092</u>', '5,000원', '2026-10-28']] })}</div>`,
            '<div style="height:16px"></div>',
            Toast('쿠폰 1장을 회수했습니다.')),
    ),
    Canvas({ label: 'A-31 · 문의 탭(1:1 문의 + 상품 문의)' }, Page('문의', inquiriesTab)),
    Canvas({ label: 'A-31 · 리뷰 탭' }, Page('리뷰', reviewsTab)),
    Canvas({ label: 'A-31 · 메모 탭(운영자끼리 보는 기록)' }, Page('메모', memoTab)),
    Canvas({ label: 'A-31 · 로그인 기록 탭' }, Page('로그인 기록', loginTab)),
    Canvas({ label: 'A-31 · 주문이 없는 새 회원 — 탭 안 빈 상태(주문 탭 예시, 다른 탭도 같은 꼴)' }, AdminLayout({ active: 'a-31', crumb: ['회원', '회원 목록', '윤서연'], title: '회원 상세', actions: [Btn('목록으로', { icon: 'list' })] },
        Tabs([{ t: '기본정보' }, { t: '주문', n: 0 }, { t: '클레임', n: 0 }, { t: '적립금' }, { t: '쿠폰', n: 1 }, { t: '문의', n: 0 }, { t: '리뷰', n: 0 }, { t: '메모', n: 0 }, { t: '로그인 기록' }], '주문'),
        Empty({ icon: 'receipt', title: '아직 주문이 없습니다', desc: '윤서연 님은 2026-11-09 에 가입했고 가입 쿠폰 1장을 갖고 있습니다(사용 기한 12-09).', action: Btn('쿠폰 탭 보기') }),
    )),
);

const state2 = StateBlock({ idx: 2, title: '탈퇴 회원 보기', note: '휴면·탈퇴 목록이나 지난 주문에서 탈퇴한 회원을 눌렀을 때. 개인정보는 지워졌고 법으로 보관해야 하는 기록만 남습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '탈퇴한 고객이 "지난달 주문 영수증"을 물어 오는 일이 있습니다. 탈퇴하면 개인정보는 바로 지워지지만 주문·결제 기록 5년, 불만·분쟁 기록 3년, 표시·광고 기록 6개월은 법에 따라 따로 보관합니다. 그래서 이름 자리에는 "탈퇴 회원(탈퇴일)"만 보이고, 남은 기록마다 파기 예정일을 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '탈퇴 회원 화면에는 수정·지급·발급·메시지 버튼이 없습니다. 탭은 법정 보관 대상인 주문·클레임·문의만 남고, 주문의 받는 분 정보는 가려진 채 보입니다. 파기 예정일이 지나면 그 기록도 자동으로 지워집니다.'),
    Canvas({ label: 'A-31 · 탈퇴 회원 · 법정 보관 기록만 남은 모습' }, AdminLayout({ active: 'a-31', crumb: ['회원', '휴면·탈퇴', '탈퇴 회원(2026-11-03)'], title: '회원 상세', actions: [Btn('목록으로', { icon: 'list' })] },
        Note('2026-11-03 에 탈퇴한 회원입니다. 개인정보는 탈퇴와 함께 지워졌고, 법정 보관 기록만 분리 보관 중입니다.', { warn: true }),
        Grid('1fr 1fr',
            Box({ title: '탈퇴 정보' }, KV([['이름', '탈퇴 회원(2026-11-03)'], ['탈퇴일', '2026-11-03 16:40 · 본인 탈퇴(마이페이지)'], ['탈퇴 사유', '자주 이용하지 않아서<small> · 남긴 말: "가격이 부담돼요"</small>'], ['소멸한 혜택', '적립금 1,200원 · 쿠폰 1장 (탈퇴와 함께 소멸)'], ['재가입', '같은 휴대폰 번호로 30일 뒤(2026-12-03)부터 가능']], { wide: true })),
            Box({ title: '보관 중인 기록과 파기 예정일' }, Table({ dense: true, cols: ['항목', { t: '보관 근거', w: 150 }, { t: '파기 예정일', w: 110 }], rows: [
                ['이름 · 이메일 · 휴대폰 · 생년월일 · 수신 동의 · 메모', '없음', `${Badge('삭제됨', 'strike')}<small>2026-11-03</small>`],
                ['주문 · 결제 · 배송 기록', '전자상거래법 5년', '2031-11-03'],
                ['반품 · 교환 · 문의(불만·분쟁) 기록', '전자상거래법 3년', '2029-11-03'],
                ['표시 · 광고 기록', '전자상거래법 6개월', '2027-05-03'],
            ] })),
        ),
        Tabs([{ t: '주문', n: 4 }, { t: '클레임', n: 0 }, { t: '문의', n: 1 }], '주문'),
        Table({ cols: ORDER_COLS, rows: [
            ['<u>20261019-000081</u><small>10-19 12:30</small>', ChannelBadge('자사몰'), `${P}<small>${O1}</small>`, 1, '52,000원', '신용카드', OrderBadge('구매확정'), '<u>581233440455</u>'],
            ['<u>20260905-000048</u><small>09-05 19:02</small>', ChannelBadge('자사몰'), `${P}<small>${O1}</small>`, 1, '52,000원', '토스페이', OrderBadge('구매확정'), '<u>581233439120</u>'],
        ] }),
        Note('탈퇴 회원의 주문은 받는 분 이름·연락처·주소가 가려진 채 보관됩니다. 분쟁 대응으로 꼭 봐야 할 때만 최고 관리자가 사유를 남기고 볼 수 있습니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '가려진 받는 분 정보 보기 → 사유 입력(최고 관리자만)', right: '팝업만', pad: 20 },
            Modal({ title: '탈퇴 회원 주문의 받는 분 정보 보기', w: 460, foot: [Btn('취소'), Btn('기록 남기고 보기', 'primary')] },
                FormTable([{ k: '보는 사유', required: true, v: Input({ value: '결제 분쟁 대응(카드사 이의 제기)', w: 280 }) }]),
                Note('누가 언제 왜 봤는지 작업 기록에 남습니다. 10분 뒤 다시 가려집니다.'))),
        Canvas({ size: 'auto', label: '보관 기간이 모두 끝난 탈퇴 회원을 눌렀을 때', right: '부분', pad: 20 },
            `<div style="width:480px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'file-o', title: '보관 중인 기록이 없습니다', desc: '법정 보관 기간이 끝나 모든 기록이 파기되었습니다.', action: Btn('목록으로') })}</div>`),
    ),
);

export default function A31() {
    return [state1, state2].join('');
}
