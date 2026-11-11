import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Input, Select, Check, Radio, RadioGroup, Toggle,
    FormTable, ListHead, Table, Overlay, Modal, Confirm, Toast, Box, Note, Text, Icon, Flex, Grid, Stats, Empty, DragRow, Upload, ImageGuide,
} from '../lib/blocks.js';

const GRADES = [
    { n: 'VIP', k: 'solid', cond: '최근 3개월 구매확정 50만원 이상', pt: '+2%', free: '항상 무료배송', cp: '5,000원 할인 쿠폰 매월 1장', cnt: 42, keep: 3 },
    { n: '골드', k: 'bold', cond: '최근 3개월 구매확정 30만원 이상', pt: '+1%', free: '항상 무료배송', cp: '3,000원 할인 쿠폰 매월 1장', cnt: 187, keep: 5 },
    { n: '실버', k: 'fill', cond: '최근 3개월 구매확정 10만원 이상 또는 3건 이상', pt: '+0.5%', free: '-', cp: '없음', cnt: 496, keep: 0 },
    { n: '일반', k: 'line', cond: '가입하면 바로(기본 등급)', pt: '-', free: '-', cp: '없음', cnt: 1693, keep: 0 },
];

const gradeTable = () => Table({ cols: [{ t: '순서', w: 50 }, { t: '등급', w: 80 }, '기준', { t: '추가 적립률', w: 86, align: 'right' }, { t: '무료배송', w: 110 }, '등급 쿠폰', { t: '회원 수', w: 80, align: 'right' }, { t: '고정 회원', w: 76, align: 'right' }, { t: '관리', w: 120 }], rows: GRADES.map((g) => [
    Icon('drag-vertical'), Badge(g.n, g.k), g.cond, g.pt, g.free, g.cp, `<u>${g.cnt.toLocaleString()}명</u>`, g.keep ? `<u>${g.keep}명</u>` : '-',
    g.n === '일반' ? `${Btn('수정', { size: 'sm' })}` : `${Btn('수정', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`,
]) });

const Page = (...body) => AdminLayout({ active: 'a-32', actions: [Btn('등급 추가', { kind: 'primary', icon: 'plus' })], desc: '등급 4개 · 자동 산정 매월 1일 새벽 · 최근 3개월 기준 · 다음 산정 2026-12-01' }, body);

const state1 = StateBlock({ idx: 1, title: '등급 목록(기준·혜택)', note: '회원 등급 메뉴의 첫 화면. 높은 등급이 위에 옵니다. 회원 등급 기능을 켠 몰에서만 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '등급은 "얼마나 사면 무엇을 더 주는가" 한 줄로 읽혀야 운영자가 고객 문의에 바로 답합니다. 그래서 기준(최근 n개월 구매확정 금액·건수)과 혜택(추가 적립률·등급 쿠폰·무료배송)을 한 표에 두고, 등급마다 지금 몇 명인지와 운영자가 손으로 고정한 회원 수를 보여 줍니다. 초기값: 기본 등급 "일반" 1개만 있고 지울 수 없습니다. 등급은 10개까지.'),
    Anno({ warn: true, title: '기능 켜고 끄기' }, '설정 > 기능 켜고 끄기에서 회원 등급을 끄면 이 메뉴에는 안내만 남고, 회원 목록의 등급 칸·검색 조건·일괄 등급 변경, 고객 마이페이지의 등급 표시, 등급 혜택이 함께 사라집니다. 이너에라는 회원 등급을 끈 채로 엽니다(아래 두 번째 캔버스가 이너에라 모습). 첫 캔버스는 등급을 켠 다른 몰의 예시입니다.'),
    Canvas({ label: 'A-32 · 등급 목록(등급 기능을 켠 몰 예시)' }, Page(
        Stats([{ k: 'VIP', v: '42명', sub: '전체의 1.7%' }, { k: '골드', v: '187명', sub: '7.7%' }, { k: '실버', v: '496명', sub: '20.5%' }, { k: '일반', v: '1,693명', sub: '70.0%' }]),
        ListHead({ left: Text('등급 순서는 왼쪽 손잡이를 끌어 바꿉니다. 위에 있을수록 높은 등급이고, 기준을 여러 개 만족하면 가장 높은 등급이 됩니다.', { sm: true, mute: true }) }),
        gradeTable(),
        Note('추가 적립률은 혜택 > 적립금의 기본 적립률(1%)에 더해집니다(VIP = 1% + 2%). 스마트스토어 주문은 회원과 연결되지 않아 등급 산정에도 혜택에도 들어가지 않습니다.'),
    )),
    Canvas({ label: 'A-32 · 등급 기능이 꺼진 몰(이너에라 적용 모습)' }, AdminLayout({ active: 'a-32' },
        Empty({ icon: 'switch-on', title: '회원 등급 기능이 꺼져 있습니다', desc: '지금은 모든 회원이 같은 혜택을 받습니다. 켜면 구매 금액에 따라 등급과 혜택을 나눌 수 있고,<br>회원 목록에 등급 칸이, 고객 마이페이지에 등급 표시가 생깁니다. 켜기 전에 만든 등급 설정은 그대로 남아 있습니다.', action: Btn('설정 > 기능 켜고 끄기로 가기', { kind: 'primary', iconRight: 'angle-right-min' }) }),
    )),
);

const cycleBox = (open) => Box({ title: '자동 산정', right: [Btn('지금 미리 계산해 보기', { size: 'sm', icon: 'refresh' }), Btn('저장', { size: 'sm', kind: 'primary' })] }, FormTable([
    { k: '자동 산정', v: Toggle('주기마다 자동으로 등급을 다시 매깁니다', { on: true }), help: '끄면 등급이 바뀌지 않고, 운영자가 회원 목록에서 손으로만 바꿉니다.' },
    { k: '산정 주기', required: true, v: open === 'cycle'
        ? Select({ value: '매월 1일', w: 220, open: true, options: [{ t: '매월 1일', on: true, sub: '기본' }, '분기마다 1일(1·4·7·10월)'] })
        : [Select({ value: '매월 1일', w: 220 }), Text('새벽에 실행', { sm: true, mute: true })] },
    ...(open === 'cycle' ? [] : [
        { k: '기준 기간', required: true, v: open === 'period'
            ? Select({ value: '최근 3개월', w: 160, open: true, options: ['최근 1개월', { t: '최근 3개월', on: true, sub: '기본' }, '최근 6개월', '최근 12개월'] })
            : Select({ value: '최근 3개월', w: 160 }), help: open === 'period' ? undefined : '구매확정한 주문만 셉니다(취소·반품 제외, 배송비 제외, 쿠폰·적립금을 뺀 실제 결제 금액). 스마트스토어 주문은 들어가지 않습니다.' },
        ...(open === 'period' ? [] : [
            { k: '등급 변동', v: Text('산정할 때 올라가는 것과 내려가는 것을 모두 반영합니다. 운영자가 손으로 정한 등급은 "다음 산정 때 유지"를 체크한 회원만 그대로 둡니다.') },
            { k: '고객 알림', v: [Check('등급이 바뀐 회원에게 안내(올라감·내려감)', { on: true }), Check('등급 쿠폰 발급 안내', { on: true })], help: '등급 쿠폰은 산정 직후 자동으로 발급됩니다.' },
        ]),
    ]),
]));

const state2 = StateBlock({ idx: 2, title: '자동 산정 주기', note: '등급 목록 아래 "자동 산정" 상자. 언제, 어느 기간의 구매 금액으로 등급을 다시 매길지 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '주기마다 새벽에 자동으로 돌고 운영자는 결과만 확인합니다. 초기값: 매월 1일 새벽 · 최근 3개월 기준. 바꿀 수 있는 것은 주기(매월·분기)와 기준 기간(1·3·6·12개월)이고, 저장하기 전에 "지금 미리 계산해 보기"로 누가 오르고 내리는지 사람 수를 먼저 봅니다(기준을 잘못 바꿔 VIP가 한꺼번에 사라지는 사고 방지).'),
    Canvas({ label: 'A-32 · 자동 산정 설정 + 미리 계산 결과 + 지난 산정 기록' }, Page(
        cycleBox(),
        Grid('1fr 1fr',
            Box({ title: '미리 계산해 본 결과', sub: '오늘(11-11) 기준 · 실제로 바뀌지는 않음' }, Table({ dense: true, cols: ['등급', { t: '지금', w: 70, align: 'right' }, { t: '올라옴', w: 70, align: 'right' }, { t: '내려감', w: 70, align: 'right' }, { t: '산정 뒤', w: 70, align: 'right' }], rows: [
                [Badge('VIP', 'solid'), '42', '+6', '-2', '<b>46</b>'], [Badge('골드', 'bold'), '187', '+21', '-14', '<b>194</b>'], [Badge('실버', 'fill'), '496', '+38', '-27', '<b>507</b>'], [Badge('일반', 'line'), '1,693', '-', '-', '<b>1,671</b>'],
            ] }), Flex({ mt: 10 }, Btn('오를 회원 65명 보기', { size: 'sm' }), Btn('내려갈 회원 43명 보기', { size: 'sm' }))),
            Box({ title: '지난 산정 기록' }, Table({ dense: true, cols: [{ t: '실행', w: 130 }, { t: '오름', w: 56, align: 'right' }, { t: '내림', w: 56, align: 'right' }, '등급 쿠폰 · 알림'], rows: [
                ['2026-11-01 새벽', '58', '31', '쿠폰 229장 · 알림톡 89건(문자 대체 2)'], ['2026-10-01 새벽', '44', '29', '쿠폰 215장 · 알림톡 73건'], ['2026-09-01 새벽', '51', '22', '쿠폰 198장 · 알림톡 73건'],
            ] })),
        ),
        Box({ title: '등급 고정 회원 8명', sub: '운영자가 손으로 정하고 "다음 산정 때 유지"를 체크한 회원', right: Btn('전체 보기', { size: 'sm' }) }, Table({ dense: true, cols: ['회원', { t: '고정 등급', w: 90 }, '사유', { t: '고정한 사람 · 날짜', w: 200 }, { t: '관리', w: 90 }], rows: [
            ['<u>박서준</u><small>se*****@gmail.com</small>', Badge('골드', 'bold'), '11월 체험단 참여 회원 우대', '운영자 이보림 · 2026-11-11', Btn('고정 풀기', { size: 'sm' })],
            ['<u>임재현</u><small>ja***@naver.com</small>', Badge('VIP', 'solid'), '제휴사 임직원', '운영자 이보림 · 2026-08-20', Btn('고정 풀기', { size: 'sm' })],
        ] })),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '산정 주기 고르는 중(목록 열림)', right: '부분', pad: 20, h: 300 }, `<div style="width:620px">${cycleBox('cycle')}</div>`),
        Canvas({ size: 'auto', label: '기준 기간 고르는 중(목록 열림)', right: '부분', pad: 20, h: 400 }, `<div style="width:620px">${cycleBox('period')}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '기준 기간을 바꾸고 저장 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 430, title: '자동 산정 기준을 바꿀까요?', desc: '기준 기간 최근 3개월 → 최근 6개월<br>다음 산정(2026-12-01)부터 적용됩니다.<br>미리 계산: 올라갈 회원 112명 · 내려갈 회원 9명 · 고정 회원 8명은 그대로', ok: '저장' })),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('자동 산정 설정을 저장했습니다. 12-01 산정부터 적용됩니다.')),
    ),
);

const editModal = (o = {}) => Modal({ title: o.add ? '등급 추가' : '등급 수정 · 골드', w: 660, foot: [Btn('취소'), Btn('저장', 'primary')] },
    o.err ? Note('골드 기준이 위 등급 VIP(50만원)와 같거나 높으면 저장할 수 없습니다.', { warn: true }) : '',
    FormTable([
        { k: '등급 이름', required: true, v: Input({ value: '골드', w: 200 }), help: '고객 마이페이지에 그대로 보입니다. 10자까지.' },
        { k: '기준', required: true, v: [
            Flex({ gap: 6, align: 'center' }, Check('구매확정 금액', { on: true }), Input({ value: o.err ? '500,000' : '300,000', suffix: '원 이상', w: 180, error: o.err })),
            Flex({ gap: 6, align: 'center', mt: 6 }, Check('구매확정 건수', { on: false }), Input({ placeholder: '0', suffix: '건 이상', w: 140, disabled: true }), RadioGroup(['둘 중 하나', '둘 다'], '둘 중 하나')),
        ], help: '기준 기간(최근 3개월)은 자동 산정 설정을 따릅니다(모든 등급 공통).', error: o.err ? 'VIP 기준(500,000원)보다 낮은 금액을 넣어 주세요.' : undefined },
        { k: '추가 적립률', v: Input({ value: '1', suffix: '%', w: 100 }), help: '기본 적립률(1%)에 더해집니다. 적립금 기능이 꺼진 몰에는 이 칸이 없습니다.' },
        { k: '등급 쿠폰', v: o.open
            ? Select({ value: '골드 3,000원 할인', w: 320, open: true, search: '', options: [{ t: '골드 3,000원 할인', sub: '주문서 쿠폰 · 자동(등급)', on: true }, { t: 'VIP 5,000원 할인', sub: '주문서 쿠폰 · 자동(등급)' }, '주지 않음'] })
            : [Select({ value: '골드 3,000원 할인', w: 260 }), Text('산정 직후 매월 1장 자동 발급', { sm: true, mute: true })], help: o.open ? undefined : '혜택 > 쿠폰에서 만든 쿠폰을 이름으로 찾아 고릅니다. 쿠폰 기능이 꺼진 몰에는 이 칸이 없습니다.' },
        ...(o.open ? [] : [
            { k: '무료배송', v: Check('이 등급은 주문 금액과 관계없이 무료배송', { on: true }), help: '제주·도서산간 추가 배송비는 그대로 받습니다.' },
            { k: '등급 아이콘', v: Upload({ title: '아이콘 올리기(선택)', guide: ImageGuide({ size: '120 × 120 px', ratio: '1:1', max: '200KB 이하', ext: 'PNG' }), w: 380 }), help: '안 올리면 등급 이름 글자로 보입니다.' },
        ]),
    ]),
    o.open ? '<div style="height:120px"></div>' : Note('저장하면 기준은 다음 산정(12-01)부터, 추가 적립률·무료배송은 저장 뒤 이 등급 187명의 다음 주문부터 적용됩니다.'),
);

const state3 = StateBlock({ idx: 3, title: '수정', note: '목록에서 수정 또는 등급 추가를 눌렀을 때 뜨는 팝업, 그리고 삭제.' },
    Anno({ title: '왜 이렇게 하나' }, '등급 하나를 고칠 때 기준과 혜택을 한 팝업에서 끝냅니다. 운영자가 바꿀 수 있는 것: 이름, 기준(구매확정 금액 · 건수 · 둘 중 하나/둘 다), 추가 적립률, 등급 쿠폰(검색형), 무료배송, 아이콘, 순서. 기준 기간은 모든 등급 공통이라 자동 산정 설정에서만 바꿉니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 자산 규격' }, '아래 등급 기준이 위 등급보다 높으면 저장을 막습니다. 회원이 있는 등급을 지우면 그 회원이 어디로 갈지 물어봅니다. 기본 등급(일반)은 지울 수 없어 삭제 버튼이 없습니다. 등급 아이콘(선택): 120 × 120 px · PNG · 200KB 이하.'),
    Canvas({ label: 'A-32 · 골드 줄의 수정 버튼 → 팝업' }, Overlay({ bg: Page(gradeTable()), h: 900 }, editModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '등급 쿠폰 고르는 중(검색형 목록 열림)', right: '팝업만', pad: 20 }, editModal({ open: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 · 기준이 위 등급과 겹침', right: '팝업만', pad: 20 }, editModal({ err: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '실버 줄의 삭제 버튼 → 회원이 있는 등급', right: '팝업만', pad: 20 },
            Modal({ title: '실버 등급 삭제', w: 480, foot: [Btn('취소'), Btn('496명 옮기고 삭제', 'danger')] },
                Text('실버 등급에 회원 <b>496명</b>이 있습니다. 이 회원들을 옮길 등급을 고르세요.'),
                FormTable([{ k: '옮길 등급', required: true, v: RadioGroup(['일반', '골드'], '일반') }, { k: '고객 알림', v: Check('등급이 바뀐다는 안내 보내기', { on: false }) }]),
                Note('이미 준 등급 쿠폰은 그대로 남습니다.'))),
        Canvas({ size: 'auto', label: '순서 끌어 바꾸는 중 · 저장 완료 토스트 · 10개를 넘을 때', right: '부분', pad: 20 },
            `<div style="width:420px">${DragRow({ right: Text('50만원 이상', { sm: true, mute: true }) }, Badge('VIP', 'solid'))}${DragRow({ off: true, right: Text('놓을 자리', { sm: true, mute: true }) }, Text('여기에 놓기', { sm: true, mute: true }))}${DragRow({ right: Text('10만원 이상', { sm: true, mute: true }) }, Badge('실버', 'fill'))}<div style="margin:-6px 0 0 24px;box-shadow:0 6px 16px rgba(0,0,0,.18)">${DragRow({ right: Text('30만원 이상 · 끄는 중', { sm: true }) }, Badge('골드', 'bold'))}</div></div>`,
            '<div style="height:16px"></div>',
            Toast('골드 등급을 저장했습니다. 기준은 12-01 산정부터 적용됩니다.'),
            '<div style="height:10px"></div>',
            Toast('등급은 10개까지 만들 수 있습니다. 쓰지 않는 등급을 먼저 지워 주세요.', { kind: 'error' })),
    ),
);

export default function A32() {
    return [state1, state2, state3].join('');
}
