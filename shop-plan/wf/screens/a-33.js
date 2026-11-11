import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup, Toggle,
    FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Empty,
} from '../lib/blocks.js';

const TAB_LIST = [{ t: '휴면 예정', n: 12 }, { t: '휴면', n: 86 }, { t: '탈퇴', n: 31 }];
const Page = (tab, ...body) => AdminLayout({ active: 'a-33', actions: [Btn('휴면 정책 설정', { icon: 'cog' })], desc: '휴면 회원 기능을 켠 몰 · 1년 동안 로그인하지 않은 회원은 휴면으로 바뀌고 개인정보를 따로 보관합니다' }, Tabs(TAB_LIST, tab), body);

const SOON_COLS = [{ t: '회원 · 이메일', w: 180 }, { t: '휴대폰', w: 110 }, { t: '마지막 접속', w: 100, sort: 'asc' }, { t: '휴면 전환 예정일', w: 130 }, { t: '남은 적립금', w: 90, align: 'right' }, '안내 발송', { t: '관리', w: 110 }];
const soonRows = [
    ['<u>임재현</u><small>ja***@naver.com</small>', '010-****-6621', '2025-11-14', `2026-11-14<small>${Badge('3일 남음', 'warn')}</small>`, '4,200원', `${Badge('발송 완료', 'check')}<small>10-15 이메일 + 알림톡</small>`, Btn('다시 보내기', { size: 'sm' })],
    ['<u>윤서연</u><small>yo**@gmail.com</small>', '010-****-3307', '2025-11-20', `2026-11-20<small>${Badge('9일 남음', 'line')}</small>`, '0원', `${Badge('발송 실패', 'x')}<small>10-21 이메일 반송 · 알림톡 실패 → 문자 발송됨</small>`, Btn('다시 보내기', { size: 'sm' })],
    ['<u>강지호</u><small>ka***@daum.net</small>', '010-****-4468', '2025-12-02', `2026-12-02<small>${Badge('21일 남음', 'line')}</small>`, '1,000원', `${Badge('발송 완료', 'check')}<small>11-02 이메일 + 알림톡</small>`, Btn('다시 보내기', { size: 'sm' })],
    ['<u>정수아</u><small>su**@daum.net</small>', '010-****-9015', '2025-12-10', `2026-12-10<small>${Badge('29일 남음', 'line')}</small>`, '2,450원', `${Badge('오늘 발송 예정', 'dash')}<small>11-11 10:00</small>`, Btn('지금 보내기', { size: 'sm' })],
];

const policyModal = Modal({ title: '휴면 정책 설정', w: 620, foot: [Btn('취소'), Btn('저장', 'primary')] },
    Note('이 팝업은 설정 > 기능 켜고 끄기(A-97)에서 "휴면 회원"을 켠 몰에서만 열립니다. 휴면을 아예 쓰지 않으려면 A-97 에서 끕니다(기본값 끔). <u>기능 켜고 끄기로 가기</u>'),
    FormTable([
        { k: '휴면 기준', required: true, v: Select({ value: '마지막 로그인 뒤 1년', w: 220, open: true, options: [{ t: '마지막 로그인 뒤 1년', on: true, sub: '기본' }, '마지막 로그인 뒤 2년', '마지막 로그인 뒤 3년'] }) },
    ]),
    '<div style="height:96px"></div>',
    FormTable([
        { k: '미리 안내', required: true, v: [Input({ value: '30', suffix: '일 전', w: 110 }), Check('이메일', { on: true }), Check('알림톡(실패 시 문자)', { on: true })], help: '휴면 전환 30일 전에 한 번 보냅니다. 문구는 설정 > 알림 > 휴면 전환 안내에서 고칩니다.' },
        { k: '휴면 중 혜택', v: [Radio('적립금·쿠폰은 유효기간대로 계속 소멸', { on: true }), Radio('휴면 기간에는 소멸 멈춤')] },
        { k: '휴면 해제', v: [Check('고객이 로그인하고 본인 확인하면 바로 해제', { on: true }), Check('운영자가 손으로 해제 가능(고객 요청)', { on: true })] },
        { k: '탈퇴 정책', v: Text('재가입 제한 30일 · 탈퇴 사유 목록은 설정 > 회원가입·로그인 설정에서 바꿉니다.') },
    ]),
);

const state1 = StateBlock({ idx: 1, title: '휴면 예정 안내 대상', note: '휴면 전환까지 30일 안쪽으로 남은 회원. 안내가 실제로 나갔는지 확인하는 화면입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '안내는 자동으로 나가지만(전환 30일 전 이메일 + 알림톡), 반송되거나 실패한 사람이 생깁니다. 안내 없이 휴면으로 바꾸면 분쟁이 되므로 "발송 완료·실패·예정"을 줄마다 보여 주고, 실패한 사람만 골라 다시 보냅니다. 초기 정렬: 전환 예정일이 가까운 순.'),
    Anno({ warn: true, title: '기능 켜고 끄기와의 관계' }, '휴면 회원은 설정 > 기능 켜고 끄기(A-97)에서 켜는 선택 기능이고 기본값은 끔입니다(1년 유효기간제는 2023-09-15 폐지되어 법정 의무가 아님). 켠 몰에서만 휴면 예정·휴면 탭과 "휴면 정책 설정" 팝업이 보이고, 꺼진 몰은 4번 상태처럼 탈퇴 탭만 남습니다. 팝업에서는 기준 기간(1·2·3년)과 안내 시점만 정하고 켜고 끄기 자체는 A-97 에서 합니다.'),
    Canvas({ label: 'A-33 · 휴면 예정 탭' }, Page('휴면 예정',
        ListHead({ total: 12, left: Chips(['전체 12', '발송 완료 9', '발송 실패 2', '발송 예정 1'], '전체 12'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: SOON_COLS, rows: soonRows.map((c, i) => (i === 1 ? { c, hl: true } : c)) }),
        Note('휴면 전환 예정일 전에 고객이 한 번이라도 로그인하면 이 목록에서 빠집니다.'),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-33 · 발송 실패 2명 선택 → 일괄 처리 바 → 안내 다시 보내기 팝업' }, Overlay({ bg: Page('휴면 예정',
        BulkBar({ count: 2, sub: '발송 실패 2명' }, Btn('안내 다시 보내기', 'primary'), Btn('휴면 전환 30일 미루기', 'line'), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' })),
        Table({ check: true, checked: [1], cols: SOON_COLS, rows: soonRows })), h: 600 },
    Modal({ title: '휴면 전환 안내 다시 보내기', w: 560, foot: [Btn('취소'), Btn('2명에게 보내기', 'primary')] },
        FormTable([
            { k: '대상', v: Text('선택한 <b>2명</b> (이메일 반송 2명)') },
            { k: '보내는 수단', required: true, v: [Check('이메일', { on: false }), Check('알림톡(실패 시 문자)', { on: true })], help: '이메일이 반송된 회원입니다. 알림톡·문자로 보내는 것을 권합니다.' },
        ]),
        Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '정보성 안내 · 수신 거부 회원에게도 발송' },
            Text('[이너에라] 윤서연 님, 1년 동안 로그인하지 않아 2026-11-20 에 휴면 계정으로 바뀝니다.<br>휴면이 되면 개인정보를 따로 보관하고, 로그인하면 바로 풀립니다.<br>남은 적립금 0원 · 쿠폰 0장<br>계속 이용하시려면 11-19 까지 로그인해 주세요. innerera.example/login', { sm: true })),
    ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '휴면 정책 설정 버튼 → 팝업(휴면 기준 목록 열림)', right: '팝업만', pad: 20 }, policyModal),
        Canvas({ size: 'auto', label: '완료 토스트 · 대상이 없을 때', right: '부분', pad: 20 },
            Toast('2명에게 휴면 전환 안내를 다시 보냈습니다.', { action: '발송 이력 보기' }),
            '<div style="height:16px"></div>',
            `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'check-circle-o', title: '30일 안에 휴면으로 바뀔 회원이 없습니다', desc: '대상이 생기면 전환 30일 전에 안내가 자동으로 나가고 여기에 나타납니다.' })}</div>`),
    ),
);

const DORMANT_COLS = [{ t: '회원(가림)', w: 170 }, { t: '휴면 전환일', w: 110, sort: 'desc' }, { t: '마지막 접속', w: 110 }, { t: '가입일', w: 100 }, { t: '누적 구매', w: 100, align: 'right' }, { t: '남은 적립금', w: 90, align: 'right' }, '분리 보관 파기 예정', { t: '관리', w: 100 }];

const state2 = StateBlock({ idx: 2, title: '휴면', note: '휴면으로 바뀐 회원. 개인정보는 따로 보관돼 이름 일부만 보이고 메시지를 보낼 수 없습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '휴면 회원은 광고도 주문 안내도 받을 수 없는 상태입니다. 운영자가 할 수 있는 일은 고객 요청으로 휴면을 풀어 주는 것뿐이라, 이 탭에는 등급·적립금·쿠폰·메시지 일괄 버튼이 없습니다. 고객이 직접 로그인하면 본인 확인 뒤 자동으로 풀립니다.'),
    Canvas({ label: 'A-33 · 휴면 탭' }, Page('휴면',
        Filters({ open: false, summary: '휴면 전환일 전체 · 검색어 없음' }),
        ListHead({ total: 86, left: Text('휴면 회원은 회원 목록·메시지 대상·등급 산정에서 빠집니다.', { sm: true, mute: true }), right: PerPage(50) }),
        Table({ check: true, cols: DORMANT_COLS, rows: [
            ['<u>최*윤</u><small>do****@naver.com</small>', '2026-11-02', '2025-11-02', '2024-06-18', '245,000원', '2,450원', '2030-11-02<small>4년 뒤 자동 탈퇴·파기</small>', Btn('휴면 해제', { size: 'sm' })],
            ['<u>이*은</u><small>ha***@kakao.com</small>', '2026-10-21', '2025-10-21', '2025-01-09', '98,000원', '0원', '2030-10-21', Btn('휴면 해제', { size: 'sm' })],
            ['<u>박*준</u><small>pa***@gmail.com</small>', '2026-09-30', '2025-09-30', '2024-11-27', '0원', '3,000원', '2030-09-30', Btn('휴면 해제', { size: 'sm' })],
        ] }),
        Pager({ page: 1, last: 2, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '휴면 해제 버튼 → 팝업(본인 확인 방법)', right: '팝업만', pad: 20 },
            Modal({ title: '휴면 해제 · 최*윤', w: 520, foot: [Btn('취소'), Btn('휴면 해제', 'primary')] },
                Note('고객 본인이 요청했는지 확인한 뒤에만 해제하세요. 해제하면 분리 보관하던 개인정보가 되돌아오고 정상 회원이 됩니다.', { warn: true }),
                FormTable([
                    { k: '본인 확인', required: true, v: [Radio('전화로 이름·생년월일·휴대폰 확인', { on: true }), Radio('1:1 문의로 요청(문의 번호 연결)')] },
                    { k: '요청 내용', required: true, v: Input({ value: '11-11 전화 · 재주문하려고 해제 요청', w: 340 }) },
                    { k: '고객 알림', v: Check('휴면이 풀렸다는 안내 보내기', { on: true }) },
                ]))),
        Canvas({ size: 'auto', label: '완료 토스트', right: '부분', pad: 20 },
            Toast('최도윤 님의 휴면을 해제했습니다. 회원 목록에서 볼 수 있습니다.', { action: '회원 상세 보기' })),
    ),
);

const OUT_COLS = [{ t: '회원', w: 150 }, { t: '탈퇴일', w: 130, sort: 'desc' }, { t: '구분', w: 90 }, '탈퇴 사유', { t: '주문', w: 50, align: 'right' }, { t: '보관 중인 기록 · 파기 예정일', w: 180 }, { t: '재가입 제한', w: 90 }, { t: '관리', w: 110 }];
const outRows = [
    ['<u>탈퇴 회원(2026-11-09)</u>', '2026-11-09 21:14', '본인 탈퇴', '가격이 부담돼서<small>"정기 할인 있으면 다시 올게요"</small>', '2건', '주문·결제 2031-11-09<small>표시·광고 2027-05-09</small>', '12-09 까지', '<u>보관 기록 보기</u>'],
    ['<u>탈퇴 회원(2026-11-03)</u>', '2026-11-03 16:40', '본인 탈퇴', '자주 이용하지 않아서', '4건', '주문·결제 2031-11-03<small>문의·분쟁 2029-11-03</small>', '12-03 까지', '<u>보관 기록 보기</u>'],
    ['탈퇴 회원(2026-10-28)', '2026-10-28 09:02', '본인 탈퇴', '개인정보가 걱정돼서', '0건', '없음', '11-27 까지', '-'],
    ['<u>탈퇴 회원(2026-10-20)</u>', '2026-10-20 11:02', '강제 탈퇴', '부정 이용<small>가입 쿠폰 반복 수령 · 운영자 이보림</small>', '1건', '주문·결제 2031-10-20', '11-19 까지', '<u>보관 기록 보기</u>'],
];
const reasonStat = Box({ title: '탈퇴 사유 통계', sub: '최근 1개월 31명' }, Table({ dense: true, cols: ['사유', { t: '명', w: 60, align: 'right' }, { t: '비율', w: 60, align: 'right' }], rows: [['자주 이용하지 않아서', '12', '39%'], ['가격이 부담돼서', '8', '26%'], ['상품이 맞지 않아서', '5', '16%'], ['개인정보가 걱정돼서', '2', '6%'], ['기타', '4', '13%']] }));
const outList = () => [
    Filters({ rows: [
        { k: '탈퇴일', v: Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' }) },
        { k: '구분', v: RadioGroup(['전체', '본인 탈퇴', '운영자 강제 탈퇴'], '전체') },
        { k: '보관 기록', v: RadioGroup(['전체', '보관 중인 기록 있음', '모두 파기됨'], '전체') },
    ] }),
    ListHead({ total: 31, left: Chips(['전체 31', '자주 이용하지 않아서 12', '가격이 부담돼서 8', '상품이 맞지 않아서 5', '개인정보 걱정 2', '기타 4'], '전체 31'), right: [Btn('탈퇴 사유 엑셀', { icon: 'download', size: 'sm' }), PerPage(50)] }),
    Table({ cols: OUT_COLS, rows: outRows }),
    Note('탈퇴하면 바로 로그인할 수 없고 이름·이메일·휴대폰 같은 개인정보는 즉시 지워져 "탈퇴 회원(탈퇴일)"로만 보입니다. 주문·결제 기록 5년, 불만·분쟁 기록 3년, 표시·광고 기록 6개월은 따로 보관했다가 날짜가 되면 자동으로 파기됩니다.'),
    Pager({ page: 1, last: 1, per: 50 }),
];

const state3 = StateBlock({ idx: 3, title: '탈퇴(파기 예정일)', note: '탈퇴한 회원과 법정 보관 기록이 언제 지워지는지. 탈퇴 사유를 모아 보는 곳이기도 합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '탈퇴하는 순간 개인정보는 지워지고, 법으로 남겨야 하는 거래 기록만 분리 보관됩니다. 그래서 목록에는 이름 대신 "탈퇴 회원(탈퇴일)"과 남아 있는 기록 종류·파기 예정일만 보입니다. 탈퇴한 고객이 지난 주문 영수증을 물어 오면 "보관 기록 보기"로 주문 기록을 엽니다. 탈퇴 사유는 위쪽 칩과 통계로 바로 봅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '진행 중인 주문이나 클레임이 있는 회원은 고객 화면에서 탈퇴가 막힙니다. 운영자가 강제 탈퇴시키는 경우(부정 이용)에는 사유가 필수입니다. 재가입 제한은 기본 30일이고 설정 > 회원가입·로그인 설정에서 바꿉니다. 탈퇴는 되돌릴 수 없습니다.'),
    Canvas({ label: 'A-33 · 탈퇴 탭(휴면 기능 켠 몰)' }, Page('탈퇴', outList())),
    CanvasRow(
        Canvas({ size: 'auto', label: '탈퇴 사유 통계', right: '부분', pad: 20 }, `<div style="width:420px">${reasonStat}</div>`),
        Canvas({ size: 'auto', label: '탈퇴 회원이 없을 때 · 회원 상세의 강제 탈퇴 확인(사유 필수)', right: '부분', pad: 20 },
            `<div style="width:480px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'user-o', title: '탈퇴한 회원이 없습니다', desc: '회원이 탈퇴하면 탈퇴일·사유와 법정 보관 기록의 파기 예정일이 여기에 나타납니다.' })}</div>`,
            '<div style="height:14px"></div>',
            Modal({ title: '강제 탈퇴 · 강지호', w: 480, foot: [Btn('취소'), Btn('강제 탈퇴', 'danger')] },
                Note('바로 로그인할 수 없게 되고 개인정보가 지워집니다. 되돌릴 수 없습니다. 남은 적립금 3,490원 · 쿠폰 1장은 소멸합니다.', { warn: true }),
                FormTable([{ k: '사유', required: true, v: Input({ value: '가입 쿠폰 반복 수령(같은 주소 4개 계정)', w: 300 }) }, { k: '고객 알림', v: Check('탈퇴 처리 안내 메일 보내기', { on: true }) }]))),
    ),
);

const state4 = StateBlock({ idx: 4, title: '휴면 기능 꺼진 몰(탈퇴만)', note: '설정 > 기능 켜고 끄기에서 휴면 회원을 켜지 않은 몰(기본값, 이너에라도 끔). 휴면 예정·휴면 탭 없이 탈퇴 탭만 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '1년 유효기간제는 2023-09-15 에 폐지되어 휴면 전환은 법정 의무가 아니고, 휴면은 다시 사러 온 고객을 본인 확인으로 한 번 더 막을 뿐입니다. 그래서 기본은 꺼 두고 필요한 고객사만 켭니다. 꺼진 몰에서는 메뉴 이름은 그대로 두되 탭이 탈퇴 하나뿐이고, 휴면 정책 설정 버튼·휴면 전환 안내 알림·회원 목록의 휴면 상태 필터가 함께 사라집니다.'),
    Anno({ warn: true, title: '켜는 곳' }, '휴면을 쓰려면 최고 관리자가 A-97 에서 "휴면 회원"을 켭니다. 켜면 이 화면에 휴면 예정·휴면 탭과 휴면 정책 설정 버튼이 생기고(1 ~ 3번 상태), 기준 기간과 안내 시점은 그 팝업에서 정합니다.'),
    Canvas({ label: 'A-33 · 휴면 기능 꺼진 몰 · 탈퇴 탭만(이너에라 적용 모습)' }, AdminLayout({ active: 'a-33', desc: '탈퇴한 회원과 법정 보관 기록의 파기 예정일을 봅니다 · 휴면 회원 기능 꺼짐' },
        Tabs([{ t: '탈퇴', n: 31 }], '탈퇴'),
        Note('이 몰은 휴면 회원 기능을 쓰지 않습니다. 회원은 탈퇴하기 전까지 정상 회원으로 남습니다. 쓰려면 <u>설정 > 기능 켜고 끄기</u>에서 "휴면 회원"을 켜세요(최고 관리자).'),
        outList(),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '설정 > 기능 켜고 끄기(A-97)의 휴면 회원 줄 — 여기서 켜면 탭이 생김', right: '참고', pad: 20 },
            `<div style="width:640px">${Table({ cols: [{ t: '기능', w: 100 }, '켜면 생기는 것', { t: '켜고 끄기', w: 90 }], rows: [['휴면 회원', '1년 미접속 회원 휴면 전환 · 30일 전 안내 알림 · 회원 > 휴면·탈퇴의 휴면 예정·휴면 탭', Toggle('', { on: false })]] })}</div>`),
        Canvas({ size: 'auto', label: '켠 몰과 꺼진 몰의 탭 차이', right: '부분', pad: 20 },
            `<div style="width:420px">${Text('켠 몰', { sm: true, mute: true })}${Tabs(TAB_LIST, '휴면 예정')}${Text('꺼진 몰(기본)', { sm: true, mute: true })}${Tabs([{ t: '탈퇴', n: 31 }], '탈퇴')}</div>`),
    ),
);

export default function A33() {
    return [state1, state2, state3, state4].join('');
}
