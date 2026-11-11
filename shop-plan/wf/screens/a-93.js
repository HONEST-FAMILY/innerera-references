import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, OrderBadge, Input, Select, Check, RadioGroup, CheckGroup, Toggle,
    FormTable, Table, Overlay, Confirm, Toast, Box, Note, Text, Icon, Timeline,
} from '../lib/blocks.js';

const Page = (...body) => AdminLayout({ active: 'a-93', desc: '주문이 사람 손을 거치지 않고 넘어가는 규칙을 정합니다. 바꾼 값은 저장한 뒤 들어오는 주문부터 적용됩니다.', actions: [Btn('변경 기록', { icon: 'time-o' }), Btn('저장', 'primary')] }, body);
const days = (v, o = {}) => Select({ value: `${v}일`, w: 90, ...o });
const SaveBar = BtnRow({ align: 'right' }, Btn('취소'), Btn('저장', 'primary'));

const confirmBox = (o = {}) => Box({ title: '자동 구매확정', sub: '고객이 구매확정을 누르지 않아도 정해진 날이 지나면 자동으로 확정' },
    FormTable([
        { k: '자동 구매확정', required: true, v: [Text('배송완료 뒤', { sm: true }), o.open ? Select({ value: '7일', w: 110, open: true, options: ['3일', '5일', { t: '7일', on: true, sub: '기본 · 반품 기한과 같음' }, '8일', '10일', '14일'] }) : days(o.short ? 3 : 7, { error: o.short }), o.open ? '' : Text('이 지나면 자동 확정', { sm: true })], help: '예: 11월 11일(수) 배송완료 → 11월 18일(수) 자정에 구매확정. 반품 신청 기한보다 짧게 잡을 수 없습니다.', error: o.short ? '자동 구매확정(3일)이 반품 신청 기한(7일)보다 짧습니다. 7일 이상으로 고르거나 반품 기한을 먼저 확인해 주세요.' : undefined },
        ...(o.open ? [] : [
            { k: '배송완료 판단', v: [Text('택배 추적으로 배송완료가 확인된 시각', { sm: true }), Check('추적이 안 되는 주문은 발송 뒤 5일째에 배송완료로 보기', { on: true })], help: '직접 배송·추적 실패 건이 끝없이 배송중에 머물지 않게 합니다.' },
            { k: '확정 전 알림', v: [Check('자동 확정 하루 전 고객에게 알림 보내기 (구매확정 · 반품 안내)', { on: true }), Btn('알림 문구 보기', { size: 'sm' })] },
            { k: '확정하면', v: Text('적립금 지급(적립금 기능 켬) · 리뷰 작성 가능 · 정산 대상 · 반품·교환 신청 버튼이 사라짐', { sm: true }) },
            { k: '확정 뒤 반품', v: RadioGroup(['받지 않음', '고객센터 문의로만 받음 (운영자가 직접 접수)'], '고객센터 문의로만 받음 (운영자가 직접 접수)') },
            { k: '스마트스토어 주문', v: [Badge('네이버 기준 고정', 'mute'), Text('스마트스토어 주문은 네이버가 배송완료 뒤 8일째에 자동 확정하고, 그 결과를 받아 옵니다. 여기서 바꿀 수 없습니다.', { sm: true })] },
        ]),
    ]),
);

const shipBox = Box({ title: '발송 기한', sub: '발주 확인·발송 처리 화면의 발송 기한 칸과 대시보드 발송 지연 위험 카드의 기준' },
    FormTable([
        { k: '발송 기한', required: true, v: [Text('결제완료 다음 날부터 영업일', { sm: true }), days(2), Text('안에 발송', { sm: true })], help: '상품 상세의 배송 안내에 평일 오후 2시 이전 결제 시 당일 출고처럼 따로 적은 문구와 어긋나지 않게 맞춰 주세요.' },
        { k: '쉬는 날', v: [CheckGroup(['토요일', '일요일', '공휴일'], ['토요일', '일요일', '공휴일']), Btn('임시 휴무일 추가', { size: 'sm', icon: 'calendar' })], help: '영업일 계산에서 빠지는 날. 임시 휴무일: 2026-12-31(목) 재고 조사.' },
        { k: '당일 출고 마감', v: [Select({ value: '14:00', w: 100 }), Text('이전 결제 주문은 당일 출고 대상으로 표시', { sm: true })] },
    ]),
);

const cancelAutoBox = (o = {}) => Box({ title: '자동 취소', sub: '입금하지 않은 주문을 기한이 지나면 자동으로 취소' },
    FormTable([
        { k: '미입금 자동 취소', required: true, v: [Toggle('', { on: !o.off }), Text('주문한 날부터', { sm: true }), days(3, { disabled: o.off }), Text('뒤 23:59 까지 입금이 없으면 취소', { sm: true })], help: '가상계좌·무통장 입금 주문에 적용됩니다. 설정 > 결제의 가상계좌 입금 기한과 같은 값이며 어느 쪽에서 고쳐도 함께 바뀝니다.' },
        { k: '취소하면', v: [Check('재고 되돌리기', { on: true, disabled: true }), Check('쓴 쿠폰·적립금 되돌리기', { on: true, disabled: true })], help: '자동 취소된 주문은 주문 > 입금 대기의 기한 지난 건 안내와 전체 주문 조회(취소완료 · 사유 미입금)에서 봅니다.' },
        { k: '고객 알림', v: [Check('기한 하루 전 입금 재촉 알림', { on: true }), Check('자동 취소됐을 때 취소 안내 알림', { on: true })] },
        { k: '실행 시각', v: Text('매일 00:10 에 전날 기한이 끝난 주문을 한꺼번에 취소합니다. 취소 직전 입금이 확인되면 취소하지 않습니다.', { sm: true }) },
        { k: '취소 요청 자동 승인', v: [Toggle('', { on: false }), Text('배송준비 단계의 취소 요청을', { sm: true }), days(2, { disabled: true }), Text('동안 처리하지 않으면 자동 승인', { sm: true })], help: '꺼 두면 운영자가 주문 > 취소 관리에서 직접 승인·거부합니다. 포장이 이미 끝난 주문이 자동 취소되는 일을 막으려면 꺼 두세요.' },
    ]),
    o.off ? Note('자동 취소를 끄면 입금하지 않은 주문이 계속 입금대기로 남고 재고가 묶입니다. 주문 > 입금 대기에서 직접 취소해야 합니다.', { warn: true }) : '',
);

const stageRow = (st, who, how, opt) => [OrderBadge(st), who, how, opt];
const stageBox = (o = {}) => Box({ title: '취소 가능 단계', sub: '고객이 마이페이지에서 스스로 취소할 수 있는 단계' },
    Table({ cols: [{ t: '주문 상태', w: 110 }, { t: '고객 화면 버튼', w: 150 }, '처리 방식', { t: '설정', w: 330 }], rows: [
        stageRow('입금대기', '주문 취소', '바로 취소 · 환불할 돈 없음', Badge('고정', 'mute')),
        stageRow('결제완료', '주문 취소', '바로 취소 · 결제 대행사로 자동 환불 (승인 없이)', Badge('고정', 'mute')),
        { hl: true, c: stageRow('배송준비', o.block ? '버튼 없음' : '취소 요청', o.block ? '취소할 수 없음 · 받은 뒤 반품으로 안내' : '취소 요청 접수 → 운영자가 취소 관리에서 승인·거부', RadioGroup(['취소 요청 받기', '취소 막기 (반품으로 안내)'], o.block ? '취소 막기 (반품으로 안내)' : '취소 요청 받기')) },
        stageRow('배송중', '버튼 없음', '취소할 수 없음 · 배송완료 뒤 반품 신청', Badge('고정', 'mute')),
        stageRow('배송완료', '반품 · 교환 신청', '반품 기한 안에서 신청', Badge('아래 반품 기한', 'line')),
    ] }),
    FormTable([
        { k: '부분 취소', v: [Check('한 주문에서 일부 품목·일부 수량만 취소할 수 있게 하기', { on: true })], help: '부분 취소로 무료배송 조건 아래로 내려가면 배송비를 다시 계산해 환불 금액에서 뺍니다. 고객에게는 취소 전에 환불 예정 금액을 보여 줍니다.' },
        { k: '취소 사유', v: [Text('단순 변심 · 주문 실수 · 배송 지연 · 다른 상품으로 다시 주문 · 기타', { sm: true }), Btn('사유 목록 고치기', { size: 'sm' })] },
        { k: '스마트스토어 주문', v: [Badge('네이버 기준 고정', 'mute'), Text('발주확인 전에는 고객이 바로 취소, 발주확인 뒤에는 취소 요청으로 들어옵니다.', { sm: true })] },
    ]),
);

const returnBox = (o = {}) => Box({ title: '반품 기한', sub: '고객이 마이페이지에서 반품·교환을 신청할 수 있는 기간' },
    FormTable([
        { k: '반품 신청 기한', required: true, v: [Text('배송완료 뒤', { sm: true }), days(o.short ? 5 : 7, { error: o.short }), Text('안에 신청', { sm: true })], help: '전자상거래법: 단순 변심 반품은 상품을 받은 날부터 7일 안에 할 수 있습니다. 7일보다 짧게 정할 수 없고 더 길게는 정할 수 있습니다.', error: o.short ? '반품 신청 기한은 7일보다 짧게 정할 수 없습니다(전자상거래법 제17조).' : undefined },
        { k: '교환 신청 기한', required: true, v: [Text('배송완료 뒤', { sm: true }), days(7), Check('반품 기한과 같게', { on: true })] },
        { k: '불량 · 표시와 다름', v: [Badge('법으로 고정', 'mute'), Text('받은 날부터 3개월 안, 그 사실을 안 날부터 30일 안 — 기한이 지나도 고객센터 문의로 접수합니다.', { sm: true })] },
        { k: '반품할 수 없는 경우', v: CheckGroup(['포장을 뜯어 상품 가치가 떨어진 경우', '일부를 먹었거나 쓴 경우', '시간이 지나 다시 팔기 어려운 경우', '주문 제작 상품'], ['포장을 뜯어 상품 가치가 떨어진 경우', '일부를 먹었거나 쓴 경우', '시간이 지나 다시 팔기 어려운 경우']), help: '체크한 항목이 반품 신청 화면과 상품 상세의 배송/교환/반품 안내에 나옵니다. 내용 확인을 위해 포장을 뜯은 것은 반품을 막을 수 없습니다.' },
        { k: '반품 요청 처리 기한', v: [Text('요청 뒤 영업일', { sm: true }), days(2), Text('안에 수거 지시가 없으면 대시보드 할 일에 표시', { sm: true })] },
        { k: '환불 기한', v: [Badge('법으로 고정', 'mute'), Text('반품 상품을 받은 날부터 영업일 3일 안에 환불 — 넘기면 반품 관리 목록에 경고가 붙습니다.', { sm: true })] },
    ]),
);

const tl = Timeline([
    { t: '구매확정 (자동)', d: '고객이 누르지 않아도 확정 · 적립금 지급 · 리뷰 작성 가능', time: '11-18(수) 24:00', on: true },
    { t: '확정 하루 전 알림', d: '내일 자동으로 구매확정됩니다. 반품·교환은 오늘까지 신청해 주세요', time: '11-17(화) 10:00' },
    { t: '반품·교환 신청 가능', d: '배송완료 뒤 7일', time: '11-11 ~ 11-18' },
    { t: '배송완료', d: '택배 추적으로 확인', time: '11-11(수) 14:32' },
]);

const state1 = StateBlock({ idx: 1, title: '자동 구매확정 일수', note: '설정 > 주문·클레임 정책. 한 화면에 자동 구매확정 · 발송 기한 · 자동 취소 · 취소 가능 단계 · 반품 기한이 순서대로 있습니다. 이 상태는 맨 위 자동 구매확정 묶음입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객 대부분은 구매확정을 누르지 않습니다. 확정이 안 되면 적립금 지급·리뷰 작성·정산이 다 멈추므로 배송완료 뒤 정한 날(기본 7일)이 지나면 자동으로 확정합니다. 자동 확정 전날 알림을 보내 반품할 고객은 그 전에 신청하게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 초기값' }, '초기값은 배송완료 뒤 7일입니다. 반품 신청 기한(7일)보다 짧게 잡으면 반품할 수 있는 기간에 확정돼 버리므로 저장을 막습니다. 스마트스토어 주문은 네이버가 정한 날에 확정되고 여기 값이 적용되지 않습니다.'),
    Canvas({ label: 'A-93 · 주문·클레임 정책 전체 (자동 구매확정 · 발송 기한 · 자동 취소 · 취소 가능 단계 · 반품 기한)' }, Page(confirmBox(), shipBox, cancelAutoBox(), stageBox(), returnBox(), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '일수 목록을 연 모습', right: '부분', pad: 20 }, `<div style="width:700px;min-height:330px">${FormTable([{ k: '자동 구매확정', required: true, v: [Text('배송완료 뒤', { sm: true }), Select({ value: '7일', w: 230, open: true, options: ['3일', '5일', { t: '7일', on: true, sub: '기본 · 반품 기한과 같음' }, '8일', '10일', '14일'] })] }])}</div>`),
        Canvas({ size: 'auto', label: '고객 주문 한 건이 넘어가는 날짜 예시 (설정 아래에 표시)', right: '부분', pad: 20 }, `<div style="width:480px">${tl}</div>`),
    ),
    Canvas({ label: 'A-93 · 입력 오류 · 반품 기한보다 짧게 고름' }, Page(confirmBox({ short: true }), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '저장 버튼 → 적용 범위 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '자동 구매확정을 7일 → 10일로 바꿀까요?', desc: '저장한 뒤 배송완료되는 주문부터 10일이 적용됩니다. 이미 배송완료된 주문 318건은 원래대로 7일째에 확정됩니다(고객에게 안내한 날짜가 바뀌지 않게).', ok: '저장' })),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('주문·클레임 정책을 저장했습니다. 지금부터 들어오는 주문에 적용됩니다.', { action: '변경 기록' })),
    ),
);

const state2 = StateBlock({ idx: 2, title: '자동 취소', note: '입금하지 않은 가상계좌·무통장 주문을 기한이 지나면 자동으로 취소하는 규칙.' },
    Anno({ title: '왜 이렇게 하나' }, '입금대기 주문은 재고를 잡고 있습니다. 기한이 지난 주문을 사람이 하나씩 취소하지 않도록 매일 새벽에 한꺼번에 취소하고, 재고·쿠폰·적립금을 되돌리고, 고객에게 취소됐다고 알립니다. 기한 하루 전에는 입금 재촉 알림이 먼저 갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '가상계좌 입금 기한(설정 > 결제)과 같은 값이라 한쪽에서 고치면 다른 쪽도 바뀝니다. 취소 요청 자동 승인은 초기값이 꺼짐입니다 — 켜면 이미 포장한 주문이 환불될 수 있어 켤 때 경고합니다.'),
    Canvas({ label: 'A-93 · 자동 취소 묶음' }, Page(cancelAutoBox(), SaveBar)),
    Canvas({ label: 'A-93 · 미입금 자동 취소를 끈 모습 (일수 칸 잠김 · 경고)' }, Page(cancelAutoBox({ off: true }), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '취소 요청 자동 승인 스위치를 켤 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '취소 요청 자동 승인을 켤까요?', desc: '배송준비 단계의 취소 요청을 2일 동안 처리하지 않으면 자동으로 승인돼 환불됩니다. 이미 포장했거나 송장을 뽑은 주문도 취소될 수 있습니다. 출고 담당자가 취소 요청을 매일 확인한다면 꺼 두는 편이 안전합니다.', ok: '켜기', danger: true })),
        Canvas({ size: 'auto', label: '임시 휴무일 추가 버튼 (발송 기한 묶음)', right: '부분', pad: 20 }, `<div style="width:420px">${FormTable([{ k: '임시 휴무일', v: [Input({ value: '2026-12-31 (목)', icon: 'calendar', w: 170 }), Input({ value: '재고 조사', w: 140 }), Btn('추가', { size: 'sm' })] }])}${Note('휴무일은 발송 기한 계산에서 빠지고, 그날 결제한 고객의 주문 완료 화면에 출고 예정일이 하루 밀려 나옵니다.')}</div>`),
    ),
);

const state3 = StateBlock({ idx: 3, title: '취소 가능 단계', note: '주문 상태마다 고객이 스스로 취소할 수 있는지, 요청만 할 수 있는지, 못 하는지를 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결제 직후에는 고객이 바로 취소해도 손해가 없지만, 발주확인(배송준비) 뒤에는 이미 포장 중일 수 있습니다. 그래서 결제완료까지는 승인 없이 바로 취소·자동 환불, 배송준비부터는 취소 요청으로 받아 운영자가 승인합니다. 포장이 빠른 몰은 배송준비 단계 취소를 아예 막고 반품으로 안내하게 고를 수 있습니다.'),
    Anno({ warn: true, title: '관리자가 바꿀 수 있는 범위' }, '바꿀 수 있는 것은 배송준비 단계의 처리 방식과 부분 취소 허용 여부, 취소 사유 목록입니다. 입금대기·결제완료의 바로 취소와 배송중의 취소 불가는 고정입니다.'),
    Canvas({ label: 'A-93 · 취소 가능 단계 묶음 · 배송준비 = 취소 요청 받기 (초기값)' }, Page(stageBox(), SaveBar)),
    Canvas({ label: 'A-93 · 배송준비 = 취소 막기를 고른 모습 (고객 화면 버튼이 사라짐)' }, Page(stageBox({ block: true }), Note('취소 막기를 고르면 배송준비 주문의 고객 화면에 지금은 취소할 수 없습니다. 상품을 받은 뒤 반품을 신청해 주세요 안내가 나옵니다.'), SaveBar)),
    Canvas({ size: 'auto', label: '사유 목록 고치기 버튼', right: '부분', pad: 20 }, `<div style="width:460px;border:1px solid var(--line);border-radius:6px;padding:14px;background:#fff;font-size:13px"><b>취소 사유 목록</b><div style="margin-top:10px">${['단순 변심', '주문 실수 (옵션·수량·주소)', '배송 지연', '다른 상품으로 다시 주문'].map((r) => `<div style="display:flex;gap:8px;align-items:center;border:1px solid var(--line2);border-radius:4px;padding:7px 10px;margin-bottom:5px">${Icon('drag-vertical')}<span style="flex:1">${r}</span>${Icon('pen-o')}${Icon('trash-o')}</div>`).join('')}<div style="display:flex;gap:8px;align-items:center;border:1px solid var(--line2);border-radius:4px;padding:7px 10px;margin-bottom:5px;background:var(--box)">${Icon('lock-o')}<span style="flex:1">기타 (직접 입력)</span><span style="font-size:11.5px;color:var(--mute)">지울 수 없음</span></div></div>${Btn('사유 추가', { size: 'sm', icon: 'plus' })}</div>`),
);

const state4 = StateBlock({ idx: 4, title: '반품 기한', note: '배송완료 뒤 며칠 동안 반품·교환 신청을 받을지 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '기한이 지나면 고객 화면의 반품·교환 신청 버튼이 사라지고 고객센터 문의로만 접수됩니다. 기한과 반품할 수 없는 경우는 반품 신청 화면과 상품 상세의 안내 탭에 그대로 나와, 운영자가 안내문을 따로 고치지 않아도 됩니다.'),
    Anno({ warn: true, title: '전자상거래법 7일' }, '단순 변심 반품은 받은 날부터 7일 안에 할 수 있다고 법이 정해 두어 7일보다 짧게 저장할 수 없습니다. 불량·표시와 다름은 3개월/30일로 고정이고, 환불은 반품 상품을 받은 날부터 영업일 3일 안에 해야 합니다. 식품은 포장을 뜯어 가치가 떨어진 경우를 반품 불가 사유로 표시할 수 있지만 내용 확인을 위한 개봉은 막을 수 없습니다.'),
    Canvas({ label: 'A-93 · 반품 기한 묶음' }, Page(returnBox(), SaveBar)),
    Canvas({ label: 'A-93 · 입력 오류 · 7일보다 짧게 고름' }, Page(returnBox({ short: true }), SaveBar)),
    Canvas({ size: 'auto', label: '변경 기록 버튼 (누가 언제 무엇을 바꿨는지)', right: '부분', pad: 20 }, `<div style="width:720px">${Table({ dense: true, cols: [{ t: '일시', w: 130 }, { t: '운영자', w: 80 }, '바꾼 내용'], rows: [['2026-11-10 09:12', '이보림', '당일 출고 마감 13:00 → 14:00'], ['2026-11-04 17:40', '윤서연', '배송준비 단계 취소: 취소 막기 → 취소 요청 받기'], ['2026-11-02 10:05', '이보림', '처음 설정 (자동 구매확정 7일 · 미입금 자동 취소 3일 · 반품 기한 7일)']] })}</div>`),
);

export default function A93() {
    return [state1, state2, state3, state4].join('');
}
