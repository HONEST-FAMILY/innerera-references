import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle,
    FormTable, Filters, Period, ListHead, PerPage, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast,
    Upload, ExcelResult, Box, KV, Note, Text, Icon, Flex, Grid, Stats, Empty,
} from '../lib/blocks.js';

const TAB_LIST = ['적립금 정책', '전체 내역', '일괄 지급·차감'];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-41', ...o }, Tabs(TAB_LIST, tab), body);

const policy = (o = {}) => [
    Box({ title: '쌓아 주기', sub: '언제, 얼마나 적립하는지' }, FormTable([
        { k: '구매 적립', v: [Toggle('구매하면 적립금을 줍니다', { on: true }), Flex({ mt: 8, gap: 6, align: 'center' }, Text('결제한 상품 금액의', { sm: true }), Input({ value: o.err ? '35' : '1', suffix: '%', w: 90, error: o.err }), Text('· 회원 등급에 적립률이 있으면 등급 적립률이 우선', { sm: true, mute: true }))], error: o.err ? '구매 적립률은 0 ~ 20% 사이로 넣어 주세요.' : undefined, help: '쿠폰·적립금으로 할인받은 금액과 배송비는 빼고 계산합니다. 상품마다 따로 정하려면 상품 등록 > 판매가에서 덮어씁니다.' },
        { k: '적립 시점', v: Text('구매확정한 때(고정) — 고객 주문 상세에는 "구매확정하면 880원 적립 예정"으로 보입니다.'), help: '구매확정 전에 주면 반품 때 회수해야 해서 시점은 바꿀 수 없습니다. 금액은 품목마다 실제 결제 금액 × 적립률, 원 단위 아래는 버립니다.' },
        ...(o.open === 'unit' ? [] : [
            { k: '리뷰 적립', v: [Toggle('리뷰를 쓰면 적립금을 줍니다', { on: true }), Flex({ mt: 8, gap: 6, align: 'center', wrap: true }, Text('글 리뷰', { sm: true }), Input({ value: '500', suffix: '원', w: 110 }), Text('포토 리뷰', { sm: true }), Input({ value: '1,000', suffix: '원', w: 110 }), Text('작성 기한 구매확정 뒤', { sm: true }), Input({ value: '90', suffix: '일', w: 100 }))], help: '리뷰를 지우거나 숨기면 회수할지 묻습니다. 리뷰 기능이 꺼진 몰에는 이 줄이 없습니다.' },
            { k: '리뷰 지급 방식', v: RadioGroup(['작성하면 바로 자동 지급', '운영자가 확인하고 지급'], '작성하면 바로 자동 지급'), help: '기본은 자동 지급. "운영자가 확인하고 지급"으로 바꾸면 고객응대 > 리뷰의 "적립금 미지급" 탭에서 골라서 지급합니다.' },
            { k: '가입 적립', v: [Toggle('가입하면 적립금을 줍니다', { on: false }), Input({ value: '0', suffix: '원', w: 110, disabled: true })] },
        ]),
    ])),
    Box({ title: '쓰기', sub: '고객이 주문서에서 쓸 때의 조건' }, FormTable([
        { k: '최소 보유 금액', v: [Input({ value: '5,000', suffix: '원 이상', w: 160 }), Text('모였을 때부터 쓸 수 있음', { sm: true, mute: true })] },
        { k: '사용 단위', v: o.open === 'unit' ? Select({ value: '100원 단위', w: 150, open: true, options: ['10원 단위', { t: '100원 단위', on: true }] }) : Select({ value: '100원 단위', w: 150 }) },
        { k: '최소 주문 금액', v: [Input({ value: '10,000', suffix: '원 이상', w: 170 }), Text('주문일 때만 사용 가능', { sm: true, mute: true })] },
        ...(o.open === 'unit' ? [] : [{ k: '한 주문 최대 사용', v: [Text('상품 금액의', { sm: true }), Input({ value: '100', suffix: '%', w: 90 }), Text('까지(배송비에는 쓸 수 없음)', { sm: true, mute: true })] },
        { k: '쿠폰과 함께', v: Text('쿠폰과 적립금은 한 주문에 함께 쓸 수 있습니다(고정).') }]),
    ])),
    o.open === 'unit' ? '<div style="height:40px"></div>' : Box({ title: '소멸', sub: '유효기간과 미리 알리기' }, FormTable([
        { k: '유효기간', required: true, v: [Select({ value: '적립한 날부터 12개월', w: 220 }), Text('개월 수 또는 기한 없음 · 만료가 가까운 적립금부터 쓰입니다', { sm: true, mute: true })] },
        { k: '소멸 안내', v: [Check('소멸 30일 전에 고객에게 안내', { on: true }), Check('소멸 7일 전에 한 번 더', { on: false })], help: '소멸 예정 안내는 정보성 알림이라 광고 수신 거부 회원에게도 나갑니다. 문구는 설정 > 알림에서 고칩니다.' },
        { k: '탈퇴·휴면', v: Text('탈퇴하면 즉시 소멸 · 휴면 중에는 유효기간대로 소멸(회원 > 휴면·탈퇴 정책을 따름)') },
    ])),
];

const state1 = StateBlock({ idx: 1, title: '정책(구매 적립률·리뷰 적립·사용 조건·소멸)', note: '혜택 > 적립금의 첫 탭. 쌓기·쓰기·소멸 세 묶음으로 나눠 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '적립금은 회사가 고객에게 진 빚입니다. 그래서 위에 "지금 고객이 갖고 있는 적립금 합계"와 "이번 달 소멸 예정"을 먼저 보여 주고, 그 아래에서 정책을 고칩니다. 솔루션 기본값(예시이며 고객사가 정함): 구매 적립 1% · 글 리뷰 500원 · 포토 리뷰 1,000원(자동 지급) · 5,000원 모이면 사용 · 상품 금액의 100%까지 사용 · 유효기간 12개월 · 소멸 30일 전 안내. 적립 시점(구매확정)과 쿠폰 동시 사용은 고정입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '정책을 바꿔도 이미 쌓인 적립금은 그대로이고 바꾼 뒤 들어온 주문부터 적용됩니다. 저장 전에 그 사실을 확인 팝업으로 알립니다. 적립금 기능이 꺼진 몰은 이 메뉴 전체와 주문서의 적립금 칸, 회원 상세의 적립금 탭이 사라집니다.'),
    Canvas({ label: 'A-41 · 적립금 정책 탭' }, Page('적립금 정책', { actions: [Btn('되돌리기'), Btn('저장', 'primary')] },
        Stats([{ k: '고객이 가진 적립금 합계', v: '4,812,300원', sub: '회원 1,204명' }, { k: '11월 지급', v: '612,400원', sub: '구매 428,900 · 리뷰 96,500 · 운영자 87,000' }, { k: '11월 사용', v: '388,000원', sub: '주문 142건' }, { k: '30일 안에 소멸 예정', v: '214,800원', sub: '회원 96명 · 안내 발송 완료' }]),
        policy(),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '사용 단위 고르는 중(목록 열림) · 적립률 오류', right: '부분', pad: 20 }, `<div style="width:700px">${policy({ open: 'unit', err: true }).join('')}</div>`),
        Canvas({ size: 'auto', label: '저장 버튼 → 확인 팝업 → 완료', right: '부분', pad: 20 },
            Confirm({ w: 440, title: '적립금 정책을 바꿀까요?', desc: '구매 적립률 1% → 2%<br>유효기간 12개월 → 6개월<br>저장한 뒤 들어오는 주문부터 적용됩니다. 이미 쌓인 4,812,300원의 유효기간은 그대로입니다.', ok: '저장' }),
            '<div style="height:16px"></div>', Toast('적립금 정책을 저장했습니다.')),
    ),
    Canvas({ label: 'A-41 · 적립금 기능이 꺼진 몰' }, AdminLayout({ active: 'a-41' },
        Empty({ icon: 'switch-on', title: '적립금 기능이 꺼져 있습니다', desc: '켜면 구매·리뷰 적립과 주문서의 적립금 사용 칸이 생깁니다.<br>끄기 전에 쌓여 있던 적립금 4,812,300원은 지워지지 않고 보관 중이며, 다시 켜면 그대로 쓸 수 있습니다.', action: Btn('설정 > 기능 켜고 끄기로 가기', { kind: 'primary', iconRight: 'angle-right-min' }) }),
    )),
);

const LOG_COLS = [{ t: '일시', w: 130, sort: 'desc' }, { t: '회원', w: 150 }, { t: '구분', w: 76 }, '사유', { t: '금액', w: 90, align: 'right' }, { t: '회원 잔액', w: 90, align: 'right' }, { t: '소멸 예정일', w: 96 }, { t: '처리', w: 100 }];
const logs = [
    ['2026-11-11 10:12', '<u>김민지</u><small>010-****-1234</small>', Badge('적립', 'check'), '포토 리뷰 작성<small>주문 20261028-000092</small>', '+1,000원', '12,400원', '2027-11-11', '운영자 이보림'],
    ['2026-11-11 09:42', '<u>김민지</u><small>010-****-1234</small>', Badge('사용', 'line'), '주문 결제<small>주문 20261111-000128</small>', '-3,000원', '11,400원', '-', '자동'],
    ['2026-11-11 00:10', '<u>박서준</u><small>010-****-5821</small>', Badge('적립', 'check'), '구매확정 적립 2%(골드)<small>주문 20261101-000101</small>', '+1,860원', '4,900원', '2027-11-11', '자동'],
    ['2026-11-10 17:30', '<u>이하은</u><small>010-****-7730</small>', Badge('회수', 'x'), '반품으로 구매 적립 회수<small>주문 20261020-000085</small>', '-490원', '8,800원', '-', '자동'],
    ['2026-11-10 15:02', '<u>정수아</u><small>010-****-9015</small>', Badge('지급', 'bold'), '11월 체험단 후기 감사<small>일괄 지급 · 32명</small>', '+3,000원', '3,000원', '2027-11-10', '운영자 이보림'],
    { dim: true, c: ['2026-11-01 00:05', '<u>최도윤</u><small>010-****-2204</small>', Badge('소멸', 'strike'), '유효기간 지남(2025-10-31 적립분)', '-1,200원', '2,450원', '-', '자동'] },
];

const state2 = StateBlock({ idx: 2, title: '전체 내역', note: '모든 회원의 적립·사용·소멸·지급·차감·회수 기록. 회원 한 명의 내역은 회원 상세 > 적립금 탭에서 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '"적립금이 왜 줄었어요?"라는 문의와 월말 회계 확인 두 가지에 씁니다. 그래서 구분(적립·사용·소멸·지급·차감·회수)과 사유, 처리한 사람(자동/운영자)으로 거르고, 기간 합계를 표 아래에 냅니다. 초기값: 최근 7일 · 구분 전체 · 최신 순.'),
    Canvas({ label: 'A-41 · 전체 내역 탭 · 검색 조건 펼침' }, Page('전체 내역', {},
        Filters({ rows: [
            { k: '기간', v: Period({ preset: '7일' }) },
            { k: '구분', v: CheckGroup(['전체', '적립', '사용', '소멸', '운영자 지급', '운영자 차감', '회수'], ['전체']) },
            { k: '사유', v: Select({ value: '전체', w: 200 }) },
            { k: '회원', v: [Select({ value: '이름', w: 110 }), Input({ placeholder: '이름 · 휴대폰 뒤 4자리 · 주문번호', icon: 'search', w: 300 })] },
            { k: '처리', v: RadioGroup(['전체', '자동', '운영자'], '전체') },
        ] }),
        ListHead({ total: 842, left: Text('지급·적립 <b>+612,400원</b> · 사용 <b>-388,000원</b> · 소멸·차감·회수 <b>-41,200원</b>', { sm: true }), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: LOG_COLS, rows: logs }),
        Pager({ page: 1, last: 17, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '사유 고르는 중(목록 열림)', right: '부분', pad: 20, h: 330 },
            Select({ value: '전체', w: 240, open: true, search: '', options: [{ t: '전체', on: true }, '구매확정 적립', '글 리뷰 작성', '포토 리뷰 작성', '주문 결제 사용', '주문 취소로 돌려줌', '반품으로 회수', '유효기간 지남', '이벤트 보상', '고객 불편 보상'] })),
        Canvas({ size: 'auto', label: '운영자가 지급한 줄 누름 → 일괄 지급 묶음 보기 · 조건에 맞는 내역 없음', right: '부분', pad: 20 },
            `<div style="width:560px">${Box({ title: '일괄 지급 · 11월 체험단 후기 감사', sub: '2026-11-10 15:02 · 운영자 이보림' }, KV([['대상', '32명 (성공 32 · 실패 0)'], ['금액', '한 명당 3,000원 · 합계 96,000원'], ['고객 알림', '알림톡 32건 발송(문자 대체 1건)'], ['되돌리기', '<u>이 지급 전체 회수</u> — 아직 쓰지 않은 금액만 회수됩니다']], { wide: true }))}${Table({ cols: ['일시', '회원', '구분', '금액'], rows: [], empty: '이 기간에 조건에 맞는 적립금 내역이 없습니다. 기간을 넓혀 보세요.' })}</div>`),
    ),
);

const STEPS = ['대상 정하기', '금액·사유', '확인', '완료'];

const state3 = StateBlock({ idx: 3, title: '일괄 지급·차감', note: '여러 회원에게 한 번에 적립금을 주거나 뺍니다. 대상은 엑셀로 올리거나 조건으로 고릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이벤트 당첨자, 배송 사고 보상처럼 명단이 밖에서 만들어지는 일이 많아 엑셀이 기본입니다. 엑셀에는 휴대폰(또는 이메일)과 금액만 있으면 되고 금액 칸을 비우면 화면에서 넣은 금액이 모두에게 적용됩니다. 저장 전에 검증 결과(성공 n · 오류 n, 행별 사유)를 먼저 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '차감은 가진 금액보다 많이 뺄 수 없어 모자란 회원을 어떻게 할지 고르게 합니다. 한 번에 100만원이 넘는 지급은 최고 관리자만 할 수 있습니다(설정 > 운영자·권한). 지급 묶음은 전체 내역에서 한 번에 회수할 수 있습니다.'),
    Canvas({ label: 'A-41 · 일괄 지급·차감 탭 · 1단계 대상 정하기 + 지난 일괄 처리 기록' }, Page('일괄 지급·차감', {},
        Grid('1fr 1fr',
            Box({ title: '새 일괄 처리' },
                Stepper(STEPS, 0),
                FormTable([
                    { k: '구분', required: true, v: RadioGroup(['지급', '차감'], '지급') },
                    { k: '대상', required: true, v: RadioGroup(['엑셀로 올리기', '조건으로 고르기', '전체 회원'], '엑셀로 올리기') },
                ]),
                Flex({ mt: 10 }, Btn('양식 내려받기', { icon: 'file-download-o', size: 'sm' }), Text('휴대폰 번호(또는 이메일) · 금액 · 사유 3칸', { sm: true, mute: true })),
                '<div style="height:10px"></div>',
                Upload({ title: '대상 엑셀을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · XLS · CSV', '용량 10MB 이하, 한 번에 10,000행까지', '금액 칸을 비우면 다음 단계에서 넣는 금액이 모두에게 적용됩니다'], files: [{ name: '11월_체험단_당첨자.xlsx', size: '21KB · 34행', icon: 'file-text-o' }] }),
                Flex({ mt: 12, justify: 'flex-end' }, Btn('검증하고 다음', 'primary')),
            ),
            Box({ title: '지난 일괄 처리', right: Btn('전체 보기', { size: 'sm' }) }, Table({ dense: true, cols: [{ t: '일시', w: 110 }, '사유', { t: '대상', w: 60, align: 'right' }, { t: '합계', w: 100, align: 'right' }, { t: '처리', w: 90 }], rows: [
                ['11-10 15:02', '<u>11월 체험단 후기 감사</u>', '32명', '+96,000원', '이보림'],
                ['10-21 11:40', '<u>10-19 배송 지연 사과</u>', '118명', '+236,000원', '이보림'],
                ['10-02 09:15', '<u>잘못 지급한 한가위 적립금 회수</u>', '7명', '-21,000원', '정수아'],
            ] })),
        ),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '검증 결과(엑셀 34행)', right: '부분', pad: 20 }, `<div style="width:660px">${Stepper(STEPS, 0)}${ExcelResult({ total: 34, ok: 32, fail: 2, keyLabel: '휴대폰 번호', rows: [
            { row: 12, key: '010-7730-21', value: '3,000', reason: '휴대폰 번호 자릿수가 모자랍니다(11자리)' },
            { row: 29, key: '010-6621-0098', value: '삼천원', reason: '금액은 숫자만 넣어 주세요(예: 3000)' },
        ], note: '오류 2행은 빼고 32명만 다음 단계로 갑니다. 고쳐서 다시 올려도 됩니다.' })}${Flex({ mt: 10, justify: 'flex-end' }, Btn('오류 2행만 엑셀로 받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('32명으로 다음', 'primary'))}</div>`),
        Canvas({ size: 'auto', label: '대상 = 조건으로 고르기일 때 바뀌는 칸', right: '부분', pad: 20 }, `<div style="width:560px">${FormTable([
            { k: '대상', required: true, v: RadioGroup(['엑셀로 올리기', '조건으로 고르기', '전체 회원'], '조건으로 고르기') },
            { k: '회원 등급', v: CheckGroup(['VIP', '골드', '실버', '일반'], ['VIP']) },
            { k: '주문 기간', v: [Input({ value: '2026-10-17', icon: 'calendar', w: 140 }), '<span class="tilde">~</span>', Input({ value: '2026-10-19', icon: 'calendar', w: 140 })], help: '이 기간에 주문한 회원(배송 사고 보상에 씀)' },
            { k: '광고 수신', v: RadioGroup(['관계없음', '동의한 회원만'], '관계없음') },
        ])}${Note('조건에 맞는 회원 <b>118명</b>. <u>대상 미리 보기</u>')}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '2단계 금액·사유 → 3단계 확인', right: '부분', pad: 20 }, `<div style="width:660px">${Stepper(STEPS, 2)}${FormTable([
            { k: '대상', v: Text('<b>32명</b> (엑셀 · 11월_체험단_당첨자.xlsx)') },
            { k: '금액', required: true, v: [Radio('모두 같은 금액', { on: true }), Input({ value: '3,000', suffix: '원', w: 130 }), Radio('엑셀의 금액 칸대로')] },
            { k: '사유', required: true, v: [Select({ value: '이벤트 보상', w: 160 }), Input({ value: '11월 체험단 후기 감사', w: 240 })], help: '고객의 적립금 내역에 보입니다.' },
            { k: '유효기간', v: [Radio('정책대로(1년)', { on: true }), Radio('직접 지정')] },
            { k: '고객 알림', v: Check('적립금 지급 안내 보내기 (알림톡 · 실패 시 문자)', { on: true }) },
            { k: '합계', v: Text('32명 × 3,000원 = <b>96,000원</b> · 알림 비용 약 256원') },
        ])}${Flex({ mt: 10, justify: 'flex-end' }, Btn('이전'), Btn('32명에게 96,000원 지급', 'primary'))}</div>`),
        Canvas({ size: 'auto', label: '차감일 때 3단계 · 모자란 회원', right: '부분', pad: 20 }, `<div style="width:560px">${Note('7명 중 2명은 가진 적립금이 3,000원보다 적습니다(0원 1명 · 1,200원 1명).', { warn: true })}${FormTable([
            { k: '모자란 회원', required: true, v: [Radio('빼고 처리(5명만 차감)', { on: true }), Radio('가진 만큼만 차감')] },
            { k: '사유', required: true, v: Input({ value: '잘못 지급한 한가위 적립금 회수', w: 300 }) },
            { k: '고객 알림', v: Check('차감 안내 보내기', { on: false }), help: '차감은 알림 기본값이 꺼져 있습니다.' },
        ])}${Flex({ mt: 10, justify: 'flex-end' }, Btn('이전'), Btn('5명에게서 15,000원 차감', 'danger'))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '4단계 완료', right: '부분', pad: 20 }, `<div style="width:520px">${Stepper(STEPS, 3)}${Text(`${Icon('check-circle-o')} 32명에게 96,000원을 지급했습니다.`, { b: true })}${KV([['고객 알림', '알림톡 31건 · 문자 대체 1건'], ['기록', '전체 내역에 "11월 체험단 후기 감사"로 묶여 남았습니다'], ['되돌리기', '전체 내역 > 이 묶음 > 지급 전체 회수']], { wide: true })}${Flex({ mt: 10, justify: 'flex-end' }, Btn('전체 내역 보기'), Btn('새 일괄 처리', 'primary'))}</div>`),
        Canvas({ size: 'auto', label: '권한 한도를 넘었을 때', right: '팝업만', pad: 20 },
            Confirm({ w: 440, title: '한 번에 지급할 수 있는 금액을 넘었습니다', desc: '합계 1,180,000원(118명 × 10,000원)은 운영자 권한 한도 1,000,000원을 넘습니다.<br>최고 관리자(이보림)에게 승인을 요청하거나 금액·대상을 줄여 주세요.', foot: [Btn('돌아가기'), Btn('승인 요청 보내기', 'primary')] })),
    ),
);

export default function A41() {
    return [state1, state2, state3].join('');
}
