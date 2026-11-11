import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chip, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Overlay, Modal, Confirm, Toast,
    Box, KV, Note, Text, Icon, Flex, Empty,
} from '../lib/blocks.js';

const MEMBERS = [
    { name: '김민지', email: 'mi****@naver.com', tel: '010-****-1234', grade: 'VIP', join: '2026-03-14', via: '카카오', amt: '1,284,000원', cnt: 14, pt: '12,400원', ad: ['문자', '메일', '알림톡'], last: '11-11' },
    { name: '박서준', email: 'se*****@gmail.com', tel: '010-****-5821', grade: '골드', join: '2026-05-02', via: '네이버', amt: '612,000원', cnt: 7, pt: '4,900원', ad: ['문자', '알림톡'], last: '11-10' },
    { name: '이하은', email: 'ha***@kakao.com', tel: '010-****-7730', grade: '골드', join: '2026-06-21', via: '카카오', amt: '528,000원', cnt: 5, pt: '8,800원', ad: [], last: '11-09' },
    { name: '최도윤', email: 'do****@naver.com', tel: '010-****-2204', grade: '실버', join: '2026-08-07', via: '이메일', amt: '245,000원', cnt: 3, pt: '2,450원', ad: ['메일'], last: '11-11' },
    { name: '정수아', email: 'su**@daum.net', tel: '010-****-9015', grade: '실버', join: '2026-09-15', via: '네이버', amt: '186,000원', cnt: 2, pt: '0원', ad: ['문자', '메일', '알림톡'], last: '11-04' },
    { name: '강지호', email: 'ji***@gmail.com', tel: '010-****-4468', grade: '일반', join: '2026-10-28', via: '이메일', amt: '49,000원', cnt: 1, pt: '3,490원', ad: [], last: '11-08' },
    { name: '윤서연', email: 'se****@naver.com', tel: '010-****-3307', grade: '일반', join: '2026-11-09', via: '카카오', amt: '0원', cnt: 0, pt: '3,000원', ad: ['문자', '알림톡'], last: '11-09' },
];

const viaCell = (m) => `${m.join}<small>${m.via === '카카오' ? Icon('kakaotalk') : m.via === '네이버' ? Icon('naver') : Icon('mail-o')} ${m.via}</small>`;
const adCell = (m) => (m.ad.length ? m.ad.map((a) => Badge(a, 'check')).join(' ') : Badge('전부 거부', 'x'));
const COLS = [{ t: '회원 · 이메일', w: 170 }, { t: '휴대폰', w: 110 }, { t: '등급', w: 62 }, { t: '가입일 · 경로', w: 100, sort: 'desc' }, { t: '구매 금액', w: 100, align: 'right' }, { t: '주문', w: 50, align: 'right' }, { t: '적립금', w: 78, align: 'right' }, '광고 수신 동의', { t: '최근 접속', w: 72 }];
const row = (m) => [`<u>${m.name}</u><small>${m.email}</small>`, `<span class="nw">${m.tel}</span>`, Badge(m.grade, m.grade === 'VIP' ? 'solid' : m.grade === '골드' ? 'bold' : m.grade === '실버' ? 'fill' : 'line'), viaCell(m), m.amt, `${m.cnt}건`, m.pt, adCell(m), m.last];

const HeadActions = [Btn('회원 직접 등록', { icon: 'plus' }), Btn('엑셀 내려받기', { icon: 'download' })];
const Page = (...body) => AdminLayout({ active: 'a-30', actions: HeadActions, desc: '전체 회원 2,418명 · 오늘 가입 6명 · 휴면 예정 12명' }, body);

const FilterOpen = (o = {}) => Filters({ rows: [
    { k: '검색어', v: [Select({ value: '이름', w: 120 }), Input({ placeholder: '이름 · 이메일 · 휴대폰 뒤 4자리', icon: 'search', w: 320, value: o.q })] },
    { k: '가입일', v: Period({ preset: o.preset || '3개월', from: o.from || '2026-08-12', to: '2026-11-11' }) },
    { k: '회원 등급', v: CheckGroup(['전체', 'VIP', '골드', '실버', '일반'], o.grade || ['전체']) },
    { k: '가입 경로', v: CheckGroup(['전체', '이메일', '카카오', '네이버'], ['전체']) },
    { k: '구매 금액', v: [Select({ value: o.amtBase || '누적', w: 110 }), Input({ value: o.amtFrom, placeholder: '0', suffix: '원', w: 150 }), '<span class="tilde">~</span>', Input({ value: o.amtTo, placeholder: '제한 없음', suffix: '원', w: 150 }), Chips(['10만원 이상', '30만원 이상', '50만원 이상', '구매 없음'], o.amtChip)] },
    { k: '주문 횟수', v: [Input({ placeholder: '0', suffix: '건', w: 110 }), '<span class="tilde">~</span>', Input({ placeholder: '제한 없음', suffix: '건', w: 130 })] },
    { k: '광고 수신 동의', v: CheckGroup(['문자 동의', '메일 동의', '알림톡 동의', '전부 거부'], o.ad || []) },
    { k: '최근 접속', v: Chips(['전체', '7일 이내', '30일 이내', '90일 넘게 없음', '11개월 넘게 없음(휴면 예정)'], '전체') },
] });

const List = (rows, checked = [], o = {}) => [
    checked.length
        ? BulkBar({ count: checked.length, sub: o.sub || '광고 수신 동의 3명 · 거부 2명' }, Btn('등급 변경', 'primary'), Btn('적립금 지급·차감', 'line'), Btn('쿠폰 발급', 'line'), Btn('알림톡·문자 보내기', { kind: 'line', icon: 'send' }), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' }))
        : ListHead({ total: o.total || '2,418', left: o.left || Chips(['전체 2,418', 'VIP 42', '골드 187', '실버 496', '일반 1,693'], '전체 2,418'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
    Table({ check: true, checked, cols: COLS, rows: rows.map(row) }),
    Pager({ page: 1, last: o.last || 49, per: 50 }),
];

const state1 = StateBlock({ idx: 1, title: '검색·필터(등급·가입일·구매 금액·수신 동의)', note: '회원 메뉴에 들어오면 처음 보이는 화면. 처음에는 조건 없이 최근 가입 순으로 전체 회원이 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '회원 목록은 "누구에게 무엇을 줄지" 고르는 도구입니다. 그래서 검색 조건이 곧 대상 고르기입니다(최근 3개월에 30만원 이상 산 문자 동의 회원 → 쿠폰 발급). 구매 금액은 누적과 기간(최근 3·6·12개월)을 고를 수 있고, 자주 쓰는 구간은 칩 한 번으로 넣습니다. 초기값: 가입일 전체 · 등급 전체 · 50명씩 · 가입일 최신 순.'),
    Anno({ warn: true, title: '개인정보 가림 규칙' }, '목록에서는 이메일 앞 2글자만, 휴대폰은 가운데 4자리를 가립니다(이름은 그대로). 전체를 보려면 회원 상세에서 "가린 정보 보기"를 눌러야 하고 누가 언제 봤는지 기록됩니다. 가림 여부는 설정 > 운영자·권한의 역할별 "개인정보 전체 보기" 권한을 따릅니다.'),
    Canvas({ label: 'A-30 · 회원 목록 · 검색 조건 펼침(초기값)' }, Page(FilterOpen(), List(MEMBERS))),
    CanvasRow(
        Canvas({ size: 'auto', label: '검색어 기준 고르는 중(목록 열림)', right: '부분', pad: 20, h: 250 },
            Flex({ align: 'flex-start' }, Select({ value: '이름', w: 140, open: true, options: [{ t: '이름', on: true }, '이메일', '휴대폰 번호', '주문번호', '회원 메모'] }), Input({ value: '김민', focus: true, icon: 'search', w: 260 }))),
        Canvas({ size: 'auto', label: '구매 금액 기준 고르는 중(목록 열림)', right: '부분', pad: 20, h: 250 },
            Flex({ align: 'flex-start' }, Select({ value: '최근 3개월', w: 150, open: true, options: ['누적', { t: '최근 3개월', on: true }, '최근 6개월', '최근 12개월', { t: '가입일 조건과 같은 기간', sub: '위 기간 사용' }] }), Input({ value: '300,000', suffix: '원', w: 150 }), '<span class="tilde">~</span>', Input({ placeholder: '제한 없음', suffix: '원', w: 150 }))),
    ),
    Canvas({ label: 'A-30 · 조건을 넣고 검색한 뒤 — 조건 접힘 · 적용된 조건이 칩으로 남음' }, Page(
        Filters({ open: false, summary: '가입일 전체 · 최근 3개월 구매 30만원 이상 · 문자 동의' }),
        Flex({ gap: 6, align: 'center' }, Text('적용된 조건', { sm: true, mute: true }), Chip('최근 3개월 구매 30만원 이상', { on: true, close: true }), Chip('문자 동의', { on: true, close: true }), Btn('조건 모두 지우기', { kind: 'ghost', size: 'sm', icon: 'refresh' })),
        List([MEMBERS[0], MEMBERS[1], MEMBERS[4]], [], { total: 64, left: Text('구매 금액 합계 <b>31,842,000원</b> · 평균 497,531원', { sm: true, mute: true }), last: 2 }),
        Note('금액은 예시 값입니다(판매가 미확정). 구매 금액은 구매확정된 주문만 더하고 취소·반품 금액은 뺍니다.'),
    )),
);

const gradeModal = Modal({ title: '등급 변경', w: 560, foot: [Btn('취소'), Btn('5명 등급 변경', 'primary')] },
    FormTable([
        { k: '대상 회원', v: Text('선택한 <b>5명</b> (VIP 1 · 골드 2 · 실버 2)') },
        { k: '바꿀 등급', required: true, v: Select({ value: '골드', w: 200, open: true, options: ['VIP', { t: '골드', on: true, sub: '추가 적립 +1% · 무료배송' }, '실버', '일반'] }) },
        { k: '자동 산정', v: [Radio('다음 산정일(12-01)에 다시 계산', { on: true }), Radio('등급 고정(자동 산정에서 제외)')], help: '고정하면 구매 금액이 모자라도 내려가지 않습니다. 고정한 회원은 회원 등급 화면에서 따로 모아 볼 수 있습니다.' },
        { k: '변경 사유', required: true, v: Input({ value: '11월 체험단 참여 회원 우대', w: 340 }), help: '회원 상세 > 메모와 작업 기록에 남습니다.' },
        { k: '고객 알림', v: Check('등급 변경 안내 보내기 (알림톡 · 실패 시 문자)', { on: false }), help: '등급이 내려가는 회원 1명(김민지 VIP → 골드)이 섞여 있습니다. 내려갈 때는 알림을 보내지 않는 것이 기본값입니다.' },
    ]),
);

const pointModal = Modal({ title: '적립금 지급·차감', w: 580, foot: [Btn('취소'), Btn('5명에게 3,000원 지급', 'primary')] },
    FormTable([
        { k: '대상 회원', v: Text('선택한 <b>5명</b>') },
        { k: '구분', required: true, v: RadioGroup(['지급', '차감'], '지급') },
        { k: '금액', required: true, v: [Input({ value: '3,000', suffix: '원', w: 160 }), Text('한 명당 · 합계 <b>15,000원</b>', { sm: true, mute: true })] },
        { k: '사유', required: true, v: [Select({ value: '이벤트 보상', w: 180 }), Input({ value: '11월 체험단 후기 감사', w: 240 })], help: '사유는 고객의 마이페이지 적립금 내역에 그대로 보입니다.' },
        { k: '유효기간', v: [Radio('정책대로(지급일부터 1년)', { on: true }), Radio('직접 지정'), Input({ placeholder: '날짜 고르기', icon: 'calendar', w: 150, disabled: true })] },
        { k: '고객 알림', v: Check('적립금 지급 안내 보내기 (알림톡 · 실패 시 문자)', { on: true }) },
    ]),
    Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '정보성 안내라 광고 수신 거부 회원에게도 나갑니다' },
        Text('[이너에라] 김민지 님, 적립금 3,000원이 지급되었습니다.<br>사유: 11월 체험단 후기 감사<br>사용 기한: 2027-11-11<br>현재 적립금: 15,400원', { sm: true })),
);

const pointMinus = Modal({ title: '적립금 지급·차감', w: 580, foot: [Btn('취소'), Btn('3명에게서 차감', 'primary')] },
    Note('선택한 5명 중 2명(정수아 0원 · 최도윤 2,450원)은 가진 적립금이 차감 금액보다 적습니다.', { warn: true }),
    FormTable([
        { k: '구분', required: true, v: RadioGroup(['지급', '차감'], '차감') },
        { k: '금액', required: true, v: Input({ value: '3,000', suffix: '원', w: 160 }) },
        { k: '모자란 회원', required: true, v: [Radio('빼고 처리(3명만 차감)', { on: true }), Radio('가진 만큼만 차감(0원까지)')], help: '적립금은 0원 아래로 내려가지 않습니다.' },
        { k: '사유', required: true, v: Input({ w: 340, error: true, placeholder: '사유를 입력하세요' }), error: '차감 사유를 입력해 주세요. 고객의 적립금 내역에 보입니다.' },
    ]),
);

const couponModal = Modal({ title: '쿠폰 발급', w: 600, foot: [Btn('취소'), Btn('5명에게 발급', 'primary')] },
    FormTable([
        { k: '대상 회원', v: Text('선택한 <b>5명</b>') },
        { k: '쿠폰', required: true, v: Select({ value: '11월 감사 5,000원 할인', w: 380, open: true, search: '11월', options: [
            { t: '11월 감사 5,000원 할인', sub: '주문서 쿠폰 · 3만원 이상 · 지정 발급', on: true },
            { t: '11월 무료배송 쿠폰', sub: '배송비 쿠폰 · 지정 발급' },
            { t: '11월 블랙위크 10% 할인', sub: '기간 종료 11-08', disabled: true },
        ] }), help: '발급 방식이 지정 발급인 진행 중 쿠폰만 나옵니다. 새로 만들려면 혜택 > 쿠폰에서 등록하세요.' },
    ]),
    '<div style="height:120px"></div>',
    FormTable([
        { k: '사용 기간', v: Text('발급일부터 30일 (2026-12-11 까지)') },
        { k: '이미 가진 회원', v: Text('1명(김민지)은 같은 쿠폰을 이미 갖고 있어 빼고 <b>4명</b>에게 발급합니다.') },
        { k: '고객 알림', v: Check('쿠폰 발급 안내 보내기', { on: true }), help: '쿠폰 안내는 광고성 정보입니다. 광고 수신 동의 회원 3명 중 발급 대상 2명에게만 알림이 가고, 나머지는 쿠폰만 들어갑니다.' },
    ]),
);

const msgModal = (kind) => Modal({ title: '알림톡·문자 보내기', w: 760, foot: [Btn('나에게 시험 발송'), Btn('취소'), Btn(kind === '광고' ? '문자 동의 3명에게 보내기' : '5명에게 보내기', 'primary')] },
    FormTable([
        { k: '내용 종류', required: true, v: RadioGroup(['정보성 안내(주문·배송·정책 변경)', '광고성(할인·쿠폰·이벤트)'], kind === '광고' ? '광고성(할인·쿠폰·이벤트)' : '정보성 안내(주문·배송·정책 변경)') },
        { k: '보내는 수단', required: true, v: kind === '광고' ? [RadioGroup(['알림톡', '문자'], '문자'), Text('알림톡은 광고성 내용을 보낼 수 없습니다(카카오 정책).', { sm: true, mute: true })] : RadioGroup(['알림톡(실패 시 문자)', '문자'], '알림톡(실패 시 문자)') },
        { k: '받는 사람', v: kind === '광고'
            ? [Text('선택한 5명 중 <b>문자 수신 동의 3명</b>에게만 보냅니다.'), Text('빠지는 회원: 이하은 · 강지호 (광고 수신 거부)', { sm: true, mute: true })]
            : Text('선택한 <b>5명</b> 전원 (정보성 안내는 수신 동의와 관계없이 발송)') },
        kind === '광고'
            ? { k: '문자 내용', required: true, v: Textarea({ value: '(광고)[이너에라] 11월 감사 쿠폰 5,000원이 도착했어요. 12월 11일까지 3만원 이상 주문에 쓰실 수 있습니다.<br>innerera.example/coupon<br>무료수신거부 080-***-1234', h: 110, count: '168 / 2,000 byte · 장문(LMS)' }), help: '맨 앞 "(광고)"와 맨 끝 무료수신거부 번호는 자동으로 붙고 지울 수 없습니다. 변수: #{이름} #{적립금} #{등급}' }
            : { k: '알림톡 문구', required: true, v: Select({ value: '배송 정책 변경 안내', w: 320 }), help: '알림톡은 카카오 심사를 통과한 문구만 고를 수 있습니다. 문구 추가는 설정 > 알림에서 신청합니다.' },
        { k: '보내는 때', v: [Radio('지금', { on: true }), Radio('예약'), Input({ placeholder: '날짜 · 시각', icon: 'calendar', w: 180, disabled: true })], help: kind === '광고' ? '광고성 문자는 밤 9시부터 다음 날 아침 8시까지 보낼 수 없습니다. 이 시간에 누르면 아침 8시로 예약됩니다.' : undefined },
        { k: '예상 비용', v: Text(kind === '광고' ? '장문 문자 3건 × 27원 = <b>81원</b> (남은 충전금 48,200원)' : '알림톡 5건 × 8원 = <b>40원</b> (남은 충전금 48,200원)') },
    ]),
    kind === '광고' ? Note('광고 수신에 동의하지 않은 회원에게 광고를 보내면 과태료 대상입니다. 그래서 거부 회원은 선택했더라도 자동으로 빠지고, 보낸 기록은 설정 > 알림 > 발송 이력에 남습니다.', { warn: true })
        : Box({ flat: true, title: '미리보기', sub: '알림톡' }, Text('[이너에라] 김민지 님, 12월 1일부터 무료배송 기준이 5만원에서 3만원으로 바뀝니다. 자세한 내용은 공지사항에서 확인해 주세요.', { sm: true })),
);

const state2 = StateBlock({ idx: 2, title: '일괄(등급·적립금·쿠폰·메시지)', note: '회원을 체크하면 목록 위 줄이 일괄 처리 바로 바뀝니다. 검색 결과 전체(여러 쪽)를 한 번에 고를 수도 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이벤트 당첨자 30명에게 적립금을 주려고 회원 상세를 30번 열지 않게 합니다. 일괄 처리 바에는 선택한 사람 중 광고 수신 동의자가 몇 명인지 항상 같이 보여 줘서, 메시지를 보내기 전에 실제로 받을 사람 수를 압니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '광고성 메시지(쿠폰·할인 안내)는 수신 동의 회원에게만 나갑니다. 거부 회원이 섞여 있으면 팝업에서 몇 명이 왜 빠지는지 이름과 함께 알려 줍니다. 등급을 내리거나 적립금을 차감하는 처리는 고객 알림 기본값이 꺼져 있습니다.'),
    Canvas({ label: 'A-30 · 5명 선택 → 일괄 처리 바 · 머리 체크박스를 누르면 "검색 결과 2,418명 전체 선택" 안내' }, Page(
        Filters({ open: false, summary: '조건 없음 · 전체 회원' }),
        List(MEMBERS, [0, 1, 2, 3, 4]),
        Note('이 쪽의 50명을 모두 골랐습니다. <u>검색 결과 2,418명 전체 선택</u> — 전체를 고르면 등급·적립금·쿠폰·메시지 처리가 2,418명에게 적용되고, 처리 전에 대상 수를 한 번 더 확인합니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '등급 변경 버튼 → 팝업(등급 목록 열림)', right: '팝업만', pad: 20 }, gradeModal),
        Canvas({ size: 'auto', label: '쿠폰 발급 버튼 → 팝업(쿠폰 검색형 목록 열림)', right: '팝업만', pad: 20 }, couponModal),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '적립금 지급·차감 버튼 → 팝업 · 지급', right: '팝업만', pad: 20 }, pointModal),
        Canvas({ size: 'auto', label: '적립금 차감 · 모자란 회원이 있고 사유를 비웠을 때', right: '팝업만', pad: 20 }, pointMinus),
    ),
    Canvas({ label: 'A-30 · 알림톡·문자 보내기 버튼 → 팝업 · 광고성 내용(수신 동의자만)' }, Overlay({ bg: Page(Filters({ open: false, summary: '조건 없음 · 전체 회원' }), List(MEMBERS, [0, 1, 2, 3, 4])), h: 860 }, msgModal('광고'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '알림톡·문자 보내기 · 정보성 안내(전원 발송)', right: '팝업만', pad: 20 }, msgModal('정보')),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '처리 완료 토스트 · 등급', right: '토스트만', pad: 20 }, Toast('5명의 등급을 골드로 바꿨습니다.', { action: '바꾼 회원 보기' })),
        Canvas({ size: 'auto', label: '처리 완료 토스트 · 메시지(일부 제외)', right: '토스트만', pad: 20 }, Toast('문자 동의 3명에게 보냈습니다. 수신 거부 2명은 보내지 않았습니다.', { action: '발송 이력 보기' })),
    ),
);

const excelModal = (err) => Modal({ title: '회원 엑셀 내려받기', w: 600, foot: [Btn('취소'), Btn('내려받기', 'primary')] },
    Note('회원 개인정보가 들어 있는 파일입니다. 누가, 언제, 왜, 몇 명을 받았는지 기록되고 최고 관리자가 설정 > 운영자·권한 > 작업 기록에서 확인합니다.', { warn: true }),
    FormTable([
        { k: '대상', v: [Radio('검색 결과 전체 64명', { on: true }), Radio('선택한 회원만')] },
        { k: '받을 항목', v: CheckGroup(['이름', '이메일', '휴대폰', '등급', '가입일', '구매 금액', '주문 수', '적립금', '수신 동의', '주소'], ['이름', '휴대폰', '등급', '구매 금액', '수신 동의']), help: '필요한 항목만 고르세요. 주소는 기본으로 빠져 있습니다.' },
        { k: '개인정보 가림', v: [Radio('가린 채로 받기(010-****-1234)', { on: !err }), Radio('가리지 않고 받기', { on: !!err })], help: '가리지 않고 받으려면 "개인정보 전체 보기" 권한이 있어야 합니다.' },
        { k: '받는 사유', required: true, v: [Select({ value: err ? '' : '문자 발송 대상 추출', placeholder: '사유를 고르세요', w: 240, error: err }), Input({ value: err ? '' : '11월 감사 쿠폰 안내', placeholder: '자세한 사유', w: 220 })], error: err ? '받는 사유를 골라 주세요. 사유 없이는 개인정보 파일을 받을 수 없습니다.' : undefined },
        { k: '파일 암호', required: true, v: Input({ value: '••••••••', w: 200 }), help: '엑셀을 열 때 넣는 암호입니다. 영문·숫자 8자 이상.' },
    ]),
);

const state3 = StateBlock({ idx: 3, title: '엑셀', note: '엑셀 내려받기를 누르면 바로 내려가지 않고 사유를 묻는 팝업이 먼저 뜹니다.' },
    Anno({ title: '왜 이렇게 하나' }, '회원 엑셀은 문자 대행사에 대상 명단을 넘기거나 사은품 발송 명단을 만들 때 씁니다. 개인정보 파일이 운영자 PC에 남는 일이라 항목을 필요한 만큼만 고르게 하고, 사유와 암호를 넣어야 내려받을 수 있습니다. 초기값: 가린 채로 받기, 주소 빠짐.'),
    Canvas({ label: 'A-30 · 엑셀 내려받기 버튼 → 사유 입력 팝업' }, Overlay({ bg: Page(Filters({ open: false, summary: '최근 3개월 구매 30만원 이상 · 문자 동의' }), List([MEMBERS[0], MEMBERS[1], MEMBERS[4]], [], { total: 64, last: 2 })), h: 780 }, excelModal(false))),
    CanvasRow(
        Canvas({ size: 'auto', label: '사유를 고르지 않고 내려받기를 눌렀을 때', right: '팝업만', pad: 20 }, excelModal(true)),
        Canvas({ size: 'auto', label: '사유 목록 열림 · 내려받은 뒤 안내', right: '부분', pad: 20 },
            Select({ placeholder: '사유를 고르세요', w: 260, open: true, options: ['문자 발송 대상 추출', '사은품·경품 발송', '고객 문의 대응', '회계·정산 확인', '기타(직접 입력)'] }),
            '<div style="height:16px"></div>',
            Toast('회원 64명 엑셀을 내려받았습니다. 받은 기록이 남았습니다.', { action: '작업 기록 보기' }),
            '<div style="height:16px"></div>',
            Box({ flat: true, title: '작업 기록에 남는 내용', w: 460 }, KV([['받은 사람', '운영자 이보림'], ['받은 때', '2026-11-11 14:22 · 접속 IP 211.***.***.18'], ['대상', '회원 64명 · 5개 항목 · 가린 채로'], ['사유', '문자 발송 대상 추출 · 11월 감사 쿠폰 안내']], { wide: true })),
        ),
    ),
);

const state4 = StateBlock({ idx: 4, title: '결과 없음', note: '조건에 맞는 회원이 없거나, 막 문을 연 몰이라 회원이 아직 없을 때.' },
    Anno({ title: '왜 이렇게 하나' }, '결과가 없으면 왜 없는지(넣은 조건)를 그대로 보여 주고 조건을 푸는 버튼을 줍니다. 회원이 한 명도 없는 새 몰은 문구가 다릅니다.'),
    Canvas({ label: 'A-30 · 검색 결과 없음' }, Page(
        Filters({ open: false, summary: '검색어 이름 "김민서" · 등급 VIP · 문자 동의' }),
        ListHead({ total: 0, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm', disabled: true }), PerPage(50)] }),
        Empty({ icon: 'search', title: '조건에 맞는 회원이 없습니다', desc: '이름 "김민서" · 등급 VIP · 문자 동의 조건으로 찾았습니다.<br>이름 일부만 넣거나 등급 조건을 빼고 다시 찾아보세요.', action: [Btn('조건 모두 지우기', { icon: 'refresh' }), Btn('검색 조건 고치기', 'primary')] }),
    )),
    Canvas({ label: 'A-30 · 회원이 아직 없는 새 몰' }, AdminLayout({ active: 'a-30', actions: HeadActions, desc: '전체 회원 0명' },
        Empty({ icon: 'users-o', title: '아직 가입한 회원이 없습니다', desc: '고객이 가입하면 여기에 바로 나타납니다. 전화·매장에서 받은 고객은 직접 등록할 수 있고,<br>다른 쇼핑몰에서 옮겨 오는 회원은 엑셀로 한꺼번에 올릴 수 있습니다.', action: [Btn('회원 직접 등록', { icon: 'plus' }), Btn('엑셀로 회원 옮겨 오기', { kind: 'primary', icon: 'file-upload-o' })] }),
    )),
);

export default function A30() {
    return [state1, state2, state3, state4].join('');
}
