import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, OrderBadge, Box, KV, Note, Text, Thumb, Icon, Overlay, Confirm, Toast,
    Tabs, Chips, Select, Input, Textarea, Field, Check, Radio, Qty, Upload, PriceSummary, Grid, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const PS = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const gap = (h = 14) => `<div style="height:${h}px"></div>`;

const OrderLine = (no, date, st, pay) => `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;font-size:13.5px"><b>주문번호 ${no}</b><span style="color:var(--mute)">${date} 주문 · ${pay}</span><span style="margin-left:auto">${OrderBadge(st)}</span></div>`;

const ItemPick = (o) => `<div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line2)${o.dim ? ';opacity:.5' : ''}">${Check('', { on: o.on, disabled: o.dim })}${Thumb(o.m ? 48 : 56)}<div style="flex:1;min-width:0;font-size:13px"><b>${o.name || (o.m ? PS : P)}</b><div style="color:var(--mute);font-size:12.5px">${o.opt} · 주문 ${o.total}개 · ${o.price}</div>${o.tag ? `<div style="margin-top:4px">${o.tag}</div>` : ''}</div>${o.qty === undefined ? '' : `<div style="text-align:right;font-size:12px;color:var(--mute);flex:none">${Qty(o.qty, { disabled: o.fix })}<div style="margin-top:3px">${o.total}개 중 ${o.qty}개</div></div>`}</div>`;

const RadioCard = (label, desc, on, extra = '') => `<div style="border:${on ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:12px 14px;margin-bottom:8px">${Radio(`<b>${label}</b>`, { on })}<div style="font-size:12.5px;color:var(--ink2);margin:4px 0 0 26px">${desc}</div>${on && extra ? `<div style="margin:10px 0 0 26px">${extra}</div>` : ''}</div>`;

const CANCEL_REASONS = ['단순 변심', '다른 구성·수량으로 다시 주문', '배송지를 잘못 입력', '결제 수단 변경', '배송이 늦어짐', '기타(직접 입력)'];
const RETURN_REASONS = [
    { t: '단순 변심', sub: '반품 배송비 고객 부담' }, { t: '주문 실수(구성·수량 잘못 선택)', sub: '반품 배송비 고객 부담' },
    { t: '상품 불량·파손', sub: '판매자 부담 · 사진 필수' }, { t: '다른 상품이 옴(오배송)', sub: '판매자 부담 · 사진 필수' },
    { t: '구성품 누락', sub: '판매자 부담 · 사진 필수' }, { t: '상품 설명과 다름', sub: '판매자 부담' }, { t: '기타(직접 입력)', sub: '판매자 확인 후 결정' },
];
const BANKS = ['국민은행', '신한은행', '우리은행', '하나은행', '농협은행', '기업은행', '카카오뱅크', '토스뱅크', '케이뱅크', '우체국'];

const RefundAccount = (o = {}) => Box({ title: '환불 받을 계좌', sub: '가상계좌(무통장)로 결제한 주문만 입력합니다' },
    Field({ label: '은행', required: true }, o.open ? Select({ placeholder: '은행을 고르세요', w: o.w || 320, open: true, search: '', options: BANKS }) : Select({ value: '카카오뱅크', w: o.w || 320 })),
    Field({ label: '계좌번호', required: true, error: o.error ? '계좌번호와 예금주가 일치하지 않습니다. 본인 명의 계좌인지 확인해 주세요.' : undefined }, Input({ value: o.open ? '' : '3333-01-*******', placeholder: '숫자만 입력', w: o.w || 320, error: o.error })),
    Field({ label: '예금주', required: true, help: '주문자 본인 명의 계좌만 가능합니다. 계좌 확인을 누르면 예금주 이름을 대조합니다.' }, `<span style="display:inline-flex;gap:6px">${Input({ value: o.open ? '' : '김민지', placeholder: '예금주 이름', w: 200 })}${Btn(o.ok ? '확인 완료' : '계좌 확인', { icon: o.ok ? 'check-min' : undefined, disabled: o.open })}</span>`),
    Check('다음 환불 때도 이 계좌 쓰기 (회원정보에 저장)', { on: !o.open }),
);

const page = (title, ...body) => MypageLayout({ active: '주문 목록', title, crumb: ['홈', '마이페이지', '주문 목록', '주문 상세', title] }, body);
const two = (left, right) => Grid('minmax(0,1fr) 300px', `<div>${[].concat(left).join('')}</div>`, `<div>${[].concat(right).join('')}</div>`);

const cancelSum = (o = {}) => PriceSummary({
    title: '환불 예정 금액',
    rows: o.rows || [['상품 금액', '93,000원'], ['배송비', '0원'], ['돌려받는 쿠폰', '없음'], ['돌려받는 적립금', '0원']],
    total: ['환불 금액', o.total || '93,000원'],
    note: o.note || '환불 수단 신용카드(신한 일시불) 취소 · 카드사에 따라 3~5영업일 뒤 반영됩니다. 금액은 예시입니다.',
    action: o.action === undefined ? Btn('주문 취소하기', { kind: 'primary', size: 'lg', block: true }) : o.action,
});

const cancelNow = page('주문 취소',
    OrderLine('20261111-000128', '2026-11-11 09:42', '결제완료', '신용카드(신한 일시불)'),
    two([
        Box({ title: '취소할 상품', sub: '품목이 여럿이면 골라서 일부만 취소할 수 있습니다' }, ItemPick({ on: true, opt: O2, total: 1, price: '93,000원(예시)', qty: 1, fix: true })),
        Box({ title: '취소 사유' },
            Field({ label: '사유', required: true }, Select({ value: '다른 구성·수량으로 다시 주문', w: 360 })),
            Field({ label: '자세한 내용', help: '선택 입력 · 판매자에게 전달됩니다.' }, Textarea({ placeholder: '더 알려 주실 내용이 있으면 적어 주세요', h: 72, count: '0 / 300' }))),
        Note(`<span>아직 판매자가 주문을 확인하기 전이라 <b>신청하는 즉시 취소되고 환불</b>됩니다. 취소한 뒤에는 되돌릴 수 없으니 다시 주문해 주세요.</span>`),
    ], cancelSum()),
);

const cancelReq = page('주문 취소 요청',
    OrderLine('20261109-000104', '2026-11-09 20:15', '배송준비', '카카오페이'),
    Note(`<span>판매자가 이미 상품을 준비하고 있습니다. 지금은 바로 취소되지 않고 <b>취소 요청 뒤 판매자가 승인</b>해야 환불됩니다. 이미 발송했다면 요청이 거부될 수 있고, 그때는 상품을 받은 뒤 반품으로 신청해 주세요.</span>`, { warn: true }),
    gap(),
    two([
        Box({ title: '취소 요청할 상품' }, ItemPick({ on: true, opt: O4, total: 1, price: '176,000원(예시)', qty: 1, fix: true })),
        Box({ title: '취소 사유' },
            Field({ label: '사유', required: true }, Select({ value: '단순 변심', w: 360 })),
            Field({ label: '자세한 내용' }, Textarea({ value: '4박스가 너무 많아 2박스로 다시 주문하려고 합니다.', h: 72, count: '27 / 300' }))),
        Box({ flat: true, title: '요청한 뒤에는' }, Text('판매자가 보통 영업일 1일 안에 승인하거나 거부합니다. 결과는 알림톡으로 알려 드리고 마이페이지 > 취소·반품·교환 내역에서 볼 수 있습니다. 승인 전에는 요청을 철회할 수 있습니다.', { sm: true })),
    ], cancelSum({ rows: [['상품 금액', '176,000원'], ['배송비', '0원'], ['돌려받는 쿠폰', '없음'], ['돌려받는 적립금', '0원']], total: '176,000원', note: '판매자가 승인하면 카카오페이로 환불됩니다(승인 후 1~3영업일). 금액은 예시입니다.', action: Btn('취소 요청하기', { kind: 'primary', size: 'lg', block: true }) })),
);

const mCancel = (req) => MobilePage({ title: req ? '주문 취소 요청' : '주문 취소', tab: false, bottom: [Btn(req ? '176,000원 취소 요청하기' : '93,000원 취소하기', 'primary')] },
    Text(req ? '주문번호 20261109-000104 · 배송준비' : '주문번호 20261111-000128 · 결제완료', { sm: true, mute: true }),
    req ? Note('판매자가 상품을 준비하고 있어 승인 뒤에 취소됩니다. 이미 발송했다면 거부될 수 있습니다.', { warn: true }) : Note('신청하는 즉시 취소되고 환불됩니다.'),
    ItemPick({ m: true, on: true, opt: req ? O4 : O2, total: 1, price: req ? '176,000원(예시)' : '93,000원(예시)' }),
    gap(),
    Field({ label: '취소 사유', required: true }, Select({ value: req ? '단순 변심' : '다른 구성·수량으로 다시 주문', w: '100%' })),
    Field({ label: '자세한 내용' }, Textarea({ placeholder: '선택 입력', h: 64, count: '0 / 300' })),
    cancelSum({ rows: req ? [['상품 금액', '176,000원'], ['배송비', '0원']] : [['상품 금액', '93,000원'], ['배송비', '0원']], total: req ? '176,000원' : '93,000원', note: req ? '승인되면 카카오페이로 환불 · 금액은 예시입니다' : '신한카드 취소 · 3~5영업일 · 금액은 예시입니다', action: '' }),
);

const state1 = StateBlock({ idx: 1, title: '취소(결제완료 단계, 즉시 취소)', note: '주문 목록·주문 상세에서 주문 취소(결제완료·입금대기) 또는 취소 요청(배송준비)을 눌렀을 때. 단계에 따라 같은 화면의 안내와 버튼 이름이 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '판매자가 발주확인을 누르기 전(결제완료)에는 고객이 누르는 즉시 취소되고 결제 대행사 취소가 자동으로 나갑니다 — 운영자가 손댈 일이 없어야 취소 문의가 줄어듭니다. 발주확인 뒤(배송준비)에는 포장·출고와 엇갈릴 수 있으므로 요청 → 운영자 승인으로 바뀌고, 화면 제목·경고·버튼 이름이 달라집니다. 어느 단계까지 즉시 취소할지는 관리자 설정 > 주문·클레임 정책에서 정합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '환불 예정 금액은 버튼을 누르기 전에 보여 줍니다: 일부 품목만 취소해 남은 금액이 무료배송 기준(5만원 · 예시) 아래로 내려가면 배송비 3,000원이 빠지고, 주문에 쓴 쿠폰·적립금은 전부 취소일 때만 돌려줍니다(쿠폰은 최소 주문 금액을 못 채우게 되면 회수). 가상계좌로 입금한 주문은 카드 취소가 안 되므로 환불 계좌 입력칸이 나타납니다. 입금 전(입금대기) 취소는 환불할 돈이 없으므로 확인만 받습니다.'),
    Canvas({ label: 'U-16 · 결제완료 주문 → 주문 취소 버튼 → 취소 화면 (즉시 취소)' }, cancelNow),
    Canvas({ label: 'U-16 · 주문 취소하기 버튼 → 확인 팝업' }, Overlay({ bg: cancelNow, h: 460 },
        Confirm({ w: 400, title: '주문을 취소할까요?', desc: '바로 취소되고 93,000원이 신한카드로 환불됩니다.<br>취소한 뒤에는 되돌릴 수 없습니다.', foot: [Btn('아니요'), Btn('주문 취소', 'primary')] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '취소 사유 고르는 중 (목록 열림)', right: '부분', pad: 20 }, `<div style="width:400px;min-height:330px">${Field({ label: '사유', required: true }, Select({ placeholder: '사유를 고르세요', w: 360, open: true, options: CANCEL_REASONS }))}</div>`),
        Canvas({ size: 'auto', label: '사유를 안 고르고 버튼을 눌렀을 때 · 기타를 골랐는데 내용이 없을 때', right: '부분', pad: 20 }, `<div style="width:400px">${Field({ label: '사유', required: true, error: '취소 사유를 골라 주세요.' }, Select({ placeholder: '사유를 고르세요', w: 360, error: true }))}${Field({ label: '사유', required: true }, Select({ value: '기타(직접 입력)', w: 360 }))}${Field({ label: '자세한 내용', required: true, error: '기타를 고르셨으면 사유를 10자 이상 적어 주세요.' }, Textarea({ value: '그냥요', h: 64, count: '3 / 300', error: true }))}</div>`),
    ),
    Canvas({ label: 'U-16 · 배송준비 주문 → 취소 요청 버튼 → 취소 요청 화면 (운영자 승인 필요)' }, cancelReq),
    CanvasRow(
        Canvas({ size: 'auto', label: '쿠폰·적립금을 쓴 주문 전체 취소 — 환불 예정 금액', right: '부분', pad: 20 }, `<div style="width:300px">${cancelSum({ rows: [['상품 금액', '93,000원'], ['쿠폰 할인', '-3,000원'], ['적립금 사용', '-2,000원'], ['돌려받는 쿠폰', '1장', '신규 가입 3,000원 할인 · 유효기간 12-10 그대로'], ['돌려받는 적립금', '2,000원']], total: '88,000원', action: '' })}</div>`),
        Canvas({ size: 'auto', label: '품목 2개 중 1개만 취소 — 남은 금액이 무료배송 기준 아래로 내려갈 때', right: '부분', pad: 20 }, `<div style="width:420px">${ItemPick({ on: true, opt: O2, total: 1, price: '93,000원(예시)' })}${ItemPick({ on: false, name: '이너에라 휴대용 스틱 케이스', opt: '단품', total: 1, price: '12,000원(예시)' })}${gap()}${cancelSum({ rows: [['취소 상품 금액', '93,000원'], ['배송비 차감', '-3,000원', '남은 상품 12,000원이 무료배송 기준 30,000원보다 적어 배송비가 생깁니다'], ['돌려받는 쿠폰', '없음', '일부 취소에서는 쿠폰을 돌려드리지 않습니다']], total: '90,000원', action: '' })}</div>`),
        Canvas({ size: 'auto', label: '이미 일부 취소된 주문 — 취소된 품목은 고를 수 없음', right: '부분', pad: 20 }, `<div style="width:420px">${Text('주문번호 20261106-000075', { sm: true, mute: true })}${ItemPick({ dim: true, opt: O2, total: 1, price: '93,000원(예시)', tag: OrderBadge('취소완료') })}${ItemPick({ on: true, opt: O1, total: 1, price: '49,000원(예시)', tag: `${OrderBadge('배송준비')} <span style="font-size:12px;color:var(--ink2)">취소 요청 뒤 판매자 승인</span>` })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '가상계좌로 입금한 주문 취소 — 환불 계좌 (은행 목록 열림)', right: '부분', pad: 20 }, `<div style="width:420px;min-height:520px">${RefundAccount({ open: true })}</div>`),
        Canvas({ size: 'auto', label: '환불 계좌 입력 · 예금주 불일치 오류', right: '부분', pad: 20 }, `<div style="width:420px">${RefundAccount({ error: true })}</div>`),
        Canvas({ size: 'auto', label: '입금대기 주문(20261110-000119) 취소 — 환불 없이 확인만', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '주문을 취소할까요?', desc: '아직 입금 전이라 환불할 금액이 없습니다.<br>취소하면 가상계좌(국민은행 4301-****-****-12)는 더 쓸 수 없으니 입금하지 마세요.', foot: [Btn('아니요'), Btn('주문 취소', 'primary')] })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 즉시 취소 (하단 고정 버튼에 금액)' }, mCancel(false)),
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 취소 요청 (배송준비)' }, mCancel(true)),
    ),
);

const retSum = (kind, action) => {
    const set = {
        one: { rows: [['반품 상품 금액', '49,000원', `${O1} 1개`], ['반품 배송비', '-3,000원', '단순 변심 — 고객 부담 · 편도 3,000원'], ['돌려받는 적립금', '0원']], total: '46,000원' },
        all: { rows: [['반품 상품 금액', '98,000원', `${O1} 2개(전체)`], ['반품 배송비', '-6,000원', '단순 변심 — 고객 부담 · 전체 반품이라 처음 무료였던 배송비까지 왕복 6,000원'], ['돌려받는 적립금', '0원']], total: '92,000원' },
        bad: { rows: [['반품 상품 금액', '49,000원', `${O1} 1개`], ['반품 배송비', '0원', '상품 불량·파손 — 판매자 부담'], ['돌려받는 적립금', '0원']], total: '49,000원' },
    }[kind];
    return PriceSummary({ title: '환불 예정 금액', rows: set.rows, total: ['환불 예정 금액', set.total], note: '환불 수단 신용카드(신한) 취소 · 판매자가 상품을 받아 확인한 뒤 영업일 3일 안에 환불합니다. 금액은 예시입니다.', action });
};

const PickupSeller = [
    KV([['회수지', '김민지 · 010-****-1234<br>서울 마포구 월드컵북로 *** (기본 배송지)'], ['회수 택배사', 'CJ대한통운 (판매자 계약 택배)']]),
    gap(8), Btn('회수지 변경', { size: 'sm' }), gap(10),
    Field({ label: '기사님께 남길 말' }, Select({ value: '문 앞에 두겠습니다', w: 320 })),
].join('');

const PickupSelf = [
    KV([['보낼 곳', `${SHOP.addr}<br>이너에라 반품 담당 · 070-****-1234 ${Btn('주소 복사', { size: 'sm', icon: 'documents-o' })}`], ['보내는 기한', '신청일부터 5일 안 (11-16까지)']]),
    gap(10),
    Field({ label: '보낸 택배사 · 송장번호', help: '지금 몰라도 됩니다. 보낸 뒤 취소·반품·교환 내역에서 입력할 수 있습니다.' }, `<span style="display:inline-flex;gap:6px">${Select({ placeholder: '택배사', w: 150 })}${Input({ placeholder: '송장번호', w: 200 })}</span>`),
    Note('단순 변심 반품은 택배비를 선불로 내고 보내 주세요. 착불로 보내면 그 금액을 환불 금액에서 뺍니다.'),
].join('');

const PhotoBox = (o = {}) => Box({ title: '사진 첨부', sub: o.required ? '상품 불량·파손·오배송은 1장 이상 필수' : '선택 · 상태를 확인할 수 있는 사진이 있으면 처리가 빨라집니다' },
    Upload({
        title: '사진을 끌어다 놓거나 눌러서 고르기', button: '사진 고르기', icon: 'camera-o',
        guide: ['확장자 JPG · PNG · HEIC · WEBP', '한 장에 10MB 이하, 최대 5장', '권장: 상품 전체 1장 + 문제 부분 가까이 1장 + 송장이 보이는 상자 1장', '긴 변 2,000 px 로 자동 축소해 올립니다'],
        files: o.files,
    }),
    o.error ? `<p class="err">${Icon('error-o')}${o.error}</p>` : '',
);

const returnPage = page('반품 신청',
    OrderLine('20261103-000052', '2026-11-03 13:20', '배송완료', '신용카드(신한 일시불)'),
    Note(`<span>반품은 상품을 받은 날(11-05)부터 7일 안, <b>11-12(목)까지</b> 신청할 수 있습니다. 그 뒤에는 자동으로 구매확정됩니다.</span>`),
    gap(),
    two([
        Box({ title: '반품할 상품 · 수량', sub: '같은 품목을 여러 개 샀으면 반품할 수량만 고릅니다' }, ItemPick({ on: true, opt: O1, total: 2, price: '개당 49,000원(예시)', qty: 1 })),
        Box({ title: '반품 사유' },
            Field({ label: '사유', required: true, help: '사유에 따라 반품 배송비를 누가 내는지가 달라지고, 오른쪽 환불 예정 금액이 바로 바뀝니다.' }, Select({ value: '단순 변심', w: 360 })),
            Field({ label: '자세한 내용' }, Textarea({ value: '맛이 입에 맞지 않아 남은 한 박스를 반품합니다. 뜯지 않았습니다.', h: 72, count: '36 / 500' }))),
        PhotoBox(),
        Box({ title: '회수 방법' },
            RadioCard('판매자 회수 요청', '택배 기사님이 아래 주소로 찾아갑니다. 신청 후 영업일 1~3일.', true, PickupSeller),
            RadioCard('직접 발송', '편한 택배·편의점 택배로 직접 보냅니다. 보낸 뒤 송장번호를 알려 주세요.', false)),
        Box({ title: '반품 배송비 내는 방법', sub: '단순 변심 · 주문 실수일 때만 나옵니다' }, Radio('환불 금액에서 빼기 (3,000원)', { on: true }), gap(6), Radio('상자에 현금을 넣어 보내기는 받지 않습니다', { disabled: true })),
        Check('반품 상품은 받은 상태 그대로(구성품·포장 포함) 보내야 하며, 뜯어서 드신 식품은 단순 변심 반품이 안 된다는 안내를 확인했습니다.', { on: true }),
    ], retSum('one', Btn('반품 신청하기', { kind: 'primary', size: 'lg', block: true }))),
);

const mReturnTop = MobilePage({ title: '반품 신청', tab: false, bottom: [Btn('환불 예정 46,000원 · 반품 신청하기', 'primary')] },
    Text('주문번호 20261103-000052 · 11-12(목)까지 신청 가능', { sm: true, mute: true }),
    ItemPick({ m: true, on: true, opt: O1, total: 2, price: '개당 49,000원(예시)', qty: 1 }),
    gap(),
    Field({ label: '반품 사유', required: true, help: '사유에 따라 반품 배송비 부담이 달라집니다.' }, Select({ value: '단순 변심', w: '100%' })),
    Field({ label: '자세한 내용' }, Textarea({ placeholder: '선택 입력', h: 64, count: '0 / 500' })),
    Field({ label: '사진 첨부', help: 'JPG · PNG · HEIC · 한 장 10MB 이하 · 최대 5장' }, `<div style="display:flex;gap:8px"><div style="width:64px;height:64px;border:1px dashed var(--line);border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11px;color:var(--mute)">${Icon('camera-o')}0 / 5</div></div>`),
);
const mReturnBottom = MobilePage({ title: '반품 신청', tab: false, bottom: [Btn('환불 예정 46,000원 · 반품 신청하기', 'primary')] },
    `<b style="font-size:14px">회수 방법</b>`, gap(8),
    RadioCard('판매자 회수 요청', '기사님이 방문합니다. 영업일 1~3일.', true, `<div style="font-size:12.5px">김민지 · 010-****-1234<br>서울 마포구 월드컵북로 ***</div>${gap(6)}${Btn('회수지 변경', { size: 'sm' })}`),
    RadioCard('직접 발송', '편의점 택배 등으로 직접 보냅니다.', false),
    gap(6),
    retSum('one', ''),
    Check('받은 상태 그대로 보내야 한다는 안내를 확인했습니다.', { on: true }),
);

const state2 = StateBlock({ idx: 2, title: '반품(사유·품목·수량·회수 방법·사진·환불 예정 금액·반품 배송비)', note: '배송완료 품목의 반품 신청 버튼을 눌렀을 때. 구매확정 전, 반품 기한 안에서만 열립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '반품 문의의 절반은 얼마가 환불되느냐입니다. 사유를 고르는 순간 반품 배송비를 누가 내는지와 환불 예정 금액을 오른쪽에 계산해 보여 줍니다. 단순 변심·주문 실수 = 고객 부담(일부 반품은 편도 3,000원, 전체 반품이고 처음 배송비가 무료였다면 왕복 6,000원), 불량·오배송·누락 = 판매자 부담 0원. 금액 기준은 관리자 설정 > 배송 > 반품·교환 배송비, 사유 목록은 설정 > 주문·클레임 정책에서 고칩니다.'),
    Anno({ title: '유형별 입력칸 분기 · 자산 규격' }, '사유가 불량·파손·오배송·누락이면 사진 1장 이상 필수. 회수 방법이 판매자 회수면 회수지(기본값 = 받은 배송지)·기사님 메모, 직접 발송이면 반품지 주소와 송장 입력칸(나중에 입력 가능). 가상계좌 결제 주문만 환불 계좌 입력칸이 나옵니다. 사진: JPG · PNG · HEIC · WEBP, 한 장 10MB 이하, 최대 5장, 긴 변 2,000 px 로 자동 축소.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '여기서 보여 주는 금액은 예정 금액입니다. 운영자가 검수에서 사유를 바꾸면(불량이라 했지만 단순 변심으로 판정) 배송비 부담이 달라질 수 있다는 것을 금액 아래에 적습니다. 스마트스토어에서 산 주문은 이 화면이 아니라 네이버에서 신청합니다(자사몰 마이페이지에는 자사몰 주문만 나옴).'),
    Canvas({ label: 'U-16 · 배송완료 주문 → 반품 신청 버튼 → 반품 신청 (단순 변심 · 2개 중 1개 · 판매자 회수)' }, returnPage),
    CanvasRow(
        Canvas({ size: 'auto', label: '반품 사유 고르는 중 (목록 열림 · 사유마다 배송비 부담 표시)', right: '부분', pad: 20 }, `<div style="width:400px;min-height:400px">${Field({ label: '사유', required: true }, Select({ placeholder: '사유를 고르세요', w: 360, open: true, options: RETURN_REASONS }))}</div>`),
        Canvas({ size: 'auto', label: '기사님께 남길 말 (목록 열림)', right: '부분', pad: 20 }, `<div style="width:360px;min-height:300px">${Field({ label: '기사님께 남길 말' }, Select({ value: '문 앞에 두겠습니다', w: 320, open: true, options: [{ t: '문 앞에 두겠습니다', on: true }, '경비실에 맡기겠습니다', '방문 전에 연락 주세요', '직접 입력'] }))}</div>`),
    ),
    Canvas({ size: 'auto', label: '사유·수량에 따라 달라지는 환불 예정 금액 (같은 주문 20261103-000052 · 1박스 2개 98,000원 · 처음 배송비 무료)', right: '오른쪽 금액 상자만 3가지', pad: 20 },
        `<div style="display:grid;grid-template-columns:repeat(3,300px);gap:20px"><div>${Text('① 단순 변심 · 1개 반품', { b: true })}${retSum('one', '')}</div><div>${Text('② 단순 변심 · 2개 전체 반품', { b: true })}${retSum('all', '')}</div><div>${Text('③ 상품 불량·파손 · 1개 반품', { b: true })}${retSum('bad', '')}</div></div>`),
    CanvasRow(
        Canvas({ size: 'auto', label: '회수 방법 = 직접 발송을 골랐을 때', right: '부분', pad: 20 }, `<div style="width:520px">${Box({ title: '회수 방법' }, RadioCard('판매자 회수 요청', '택배 기사님이 찾아갑니다. 신청 후 영업일 1~3일.', false), RadioCard('직접 발송', '편한 택배·편의점 택배로 직접 보냅니다.', true, PickupSelf))}</div>`),
        Canvas({ size: 'auto', label: '사유 = 상품 불량·파손 · 사진 2장 올림 (1장은 용량 초과)', right: '부분', pad: 20 }, `<div style="width:480px">${PhotoBox({ required: true, files: [{ name: '터진_스틱.jpg', size: '2.4MB', icon: 'image-o' }, { name: '상자_송장.heic', size: '3.1MB', icon: 'image-o' }, { name: '동영상캡처.png', size: '14.2MB', icon: 'image-o', error: '10MB 를 넘어 올리지 못했습니다' }] })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 — 불량인데 사진 없음 · 상품 미선택 · 확인 미체크', right: '부분', pad: 20 }, `<div style="width:480px">${Field({ label: '반품할 상품', required: true, error: '반품할 상품을 1개 이상 골라 주세요.' }, ItemPick({ on: false, opt: O1, total: 2, price: '개당 49,000원(예시)', qty: 0 }))}${PhotoBox({ required: true, error: '상품 불량·파손으로 신청하려면 사진을 1장 이상 올려 주세요.' })}${Check('받은 상태 그대로 보내야 한다는 안내를 확인했습니다.')}<p class="err">${Icon('error-o')}안내를 확인하고 체크해 주세요.</p></div>`),
        Canvas({ size: 'auto', label: '가상계좌로 결제한 주문의 반품 — 환불 계좌 칸이 추가됨 (계좌 확인 완료)', right: '부분', pad: 20 }, `<div style="width:420px">${RefundAccount({ ok: true })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '반품 기한이 지난 주문에서 주소로 직접 들어왔을 때', right: '안내만', pad: 20 }, `<div style="width:420px">${Box({}, `<div class="wf-empty">${Icon('calendar')}<b>반품 신청 기간이 지났습니다</b><p>이 주문은 11-05 에 받으셔서 11-12 까지 신청할 수 있었고, 11-12 에 구매확정됐습니다.<br>상품에 문제가 있다면 1:1 문의로 알려 주세요.</p><div class="act">${Btn('주문 상세로')}${Btn('1:1 문의하기', 'primary')}</div></div>`)}</div>`),
        Canvas({ size: 'auto', label: '이미 반품·교환을 신청한 품목일 때', right: '안내만', pad: 20 }, `<div style="width:420px">${Box({}, `<div class="wf-empty">${Icon('exchange')}<b>이미 반품을 신청한 상품입니다</b><p>11-11 에 신청한 반품(접수번호 R20261111-0012)이 진행 중입니다.</p><div class="act">${Btn('진행 상황 보기', 'primary')}</div></div>`)}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 반품 신청 위쪽 (상품·사유·사진)' }, mReturnTop),
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 반품 신청 아래쪽 (회수 방법·환불 예정 금액·하단 고정 버튼)' }, mReturnBottom),
    ),
);

const exSum = (bad, action) => PriceSummary({
    title: '교환 비용',
    rows: bad ? [['교환 배송비', '0원', '상품 불량·파손 — 판매자 부담'], ['옵션 차액', '0원']] : [['교환 배송비', '6,000원', '단순 변심 — 고객 부담 · 왕복(회수 3,000원 + 다시 보내기 3,000원)'], ['옵션 차액', '0원', '같은 가격의 옵션끼리만 교환할 수 있습니다']],
    total: ['지금 결제할 금액', bad ? '0원' : '6,000원'],
    note: bad ? '추가로 내실 금액이 없습니다.' : '신청하기를 누르면 결제 창이 열립니다. 판매자가 교환을 거부하면 전액 돌려드립니다. 금액은 예시입니다.',
    action,
});

const exPage = page('교환 신청',
    OrderLine('20261022-000270', '2026-10-22 11:05', '배송완료', '신용카드(신한 일시불)'),
    two([
        Box({ title: '교환할 상품 · 수량' }, ItemPick({ on: true, opt: O2, total: 1, price: '93,000원(예시)', qty: 1, fix: true })),
        Box({ title: '교환 사유' },
            Field({ label: '사유', required: true }, Select({ value: '상품 불량·파손', w: 360 })),
            Field({ label: '자세한 내용', required: true }, Textarea({ value: '상자 모서리가 찌그러지고 안쪽 스틱 3포가 터져 있었습니다.', h: 72, count: '32 / 500' }))),
        PhotoBox({ required: true, files: [{ name: '상자_파손.jpg', size: '1.9MB', icon: 'image-o' }, { name: '터진_스틱.jpg', size: '2.4MB', icon: 'image-o' }] }),
        Box({ title: '교환해서 받을 옵션', sub: '이 상품은 구성마다 가격이 달라 같은 구성으로만 교환됩니다' },
            Field({ label: '구성', required: true, help: '다른 구성(1박스·4박스)으로 바꾸려면 반품한 뒤 다시 주문해 주세요.' }, Select({ value: `${O2} · 같은 구성 · 재고 있음`, w: 360, disabled: true })),
            `<span style="font-size:12.5px;text-decoration:underline">반품 신청으로 바꾸기</span>`),
        Box({ title: '회수 방법 · 교환 상품 받을 곳' },
            RadioCard('판매자 회수 요청', '교환 상품을 가져온 기사님이 기존 상품을 가져갑니다(맞교환). 맞교환이 안 되는 지역은 회수 뒤 발송합니다.', true, KV([['회수·배송지', '김민지 · 010-****-1234<br>서울 마포구 월드컵북로 ***']]) + gap(8) + Btn('주소 변경', { size: 'sm' })),
            RadioCard('직접 발송', '직접 보내면 판매자가 받은 뒤 교환 상품을 보냅니다.', false)),
    ], exSum(true, Btn('교환 신청하기', { kind: 'primary', size: 'lg', block: true }))),
);

const clothItem = { name: '오버핏 코튼 셔츠', opt: '아이보리 / M', total: 1, price: '39,000원(예시)' };
const exCloth = (o = {}) => page('교환 신청',
    OrderLine('20261104-000061', '2026-11-04 19:40', '배송완료', '네이버페이'),
    two([
        Box({ title: '교환할 상품 · 수량' }, ItemPick({ on: true, ...clothItem, qty: 1, fix: true })),
        Box({ title: '교환 사유' }, Field({ label: '사유', required: true }, Select({ value: '사이즈가 맞지 않음(단순 변심)', w: 360 }))),
        Box({ title: '교환해서 받을 옵션', sub: '옵션을 다시 골라 주세요 · 가격이 같은 옵션만 고를 수 있습니다' },
            Field({ label: '색상', required: true }, Chips(['아이보리', '차콜', '스카이블루'], '아이보리')),
            Field({ label: '사이즈', required: true, error: o.err }, o.open
                ? Select({ placeholder: '사이즈를 고르세요', w: 360, open: true, options: ['S · 재고 있음', { t: 'M', sub: '지금 가진 옵션', disabled: true }, { t: 'L', sub: '재고 2개', on: true }, { t: 'XL', sub: '품절 · 재입고 알림 신청', disabled: true }, { t: '2XL', sub: '추가금 +3,000원이라 교환 불가', disabled: true }] })
                : Select({ value: 'L', w: 360 })),
            o.open ? gap(170) : Note('아이보리 / L 로 교환합니다. 교환 상품은 신청 시점에 1개를 잡아 둡니다(판매자가 거부하면 풀림).')),
    ], exSum(false, Btn('6,000원 결제하고 교환 신청하기', { kind: 'primary', size: 'lg', block: true, disabled: o.open }))),
);

const state3 = StateBlock({ idx: 3, title: '교환(옵션 다시 고르기)', note: '배송완료 품목의 교환 신청 버튼을 눌렀을 때. 반품과 같은 틀에 교환해서 받을 옵션과 교환 비용이 더해집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '교환은 돈이 오가지 않게 같은 가격의 옵션끼리만 받습니다(차액 결제·부분 환불이 섞이면 정산과 스마트스토어 연동이 꼬임). 이너에라처럼 구성마다 가격이 다른 상품은 같은 구성으로만 교환(사실상 불량 교환)되고, 다른 구성을 원하면 반품 후 재주문으로 안내합니다. 의류처럼 색상·사이즈 옵션은 다시 고를 수 있고, 옵션 목록에 재고·품절·추가금 있는 옵션을 표시합니다.'),
    Anno({ title: '유형별 입력칸 분기' }, '옵션 없는 상품: 받을 옵션 칸 없음 / 가격이 다른 1축 옵션(이너에라): 같은 옵션 고정 / 조합형 옵션(의류): 축마다 다시 고르기. 단순 변심 교환은 왕복 배송비 6,000원을 신청할 때 결제하고(금액은 설정 > 배송), 불량은 0원. 교환 옵션의 재고는 신청 시점에 1개 잡아 둡니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '고른 옵션이 품절이면 신청 버튼이 꺼지고 대안 두 가지(다른 옵션 고르기 · 반품으로 바꾸기)를 줍니다. 신청한 뒤 판매자 쪽 재고가 없어지면 관리자 교환 관리의 교환 옵션 재고 없음 상태로 넘어가고 고객에게 반품 전환 안내가 갑니다.'),
    Canvas({ label: 'U-16 · 교환 신청 (이너에라 · 구성 옵션은 가격이 달라 같은 구성으로만 교환 · 상품 불량)' }, exPage),
    Canvas({ label: 'U-16 · 다른 업종 예시(의류 색상 × 사이즈) · 교환 받을 옵션 다시 고르기 — 사이즈 목록 열림(품절·추가금 옵션 비활성)' }, exCloth({ open: true })),
    Canvas({ label: 'U-16 · 다른 업종 예시(의류) · 옵션을 고른 뒤 — 단순 변심이라 교환 배송비 6,000원 결제' }, exCloth()),
    CanvasRow(
        Canvas({ size: 'auto', label: '교환 받을 옵션이 품절일 때 (이너에라 · 같은 구성 재고 없음)', right: '부분', pad: 20 }, `<div style="width:480px">${Box({ title: '교환해서 받을 옵션' },
            Field({ label: '구성', required: true, error: `${O2} 재고가 없어 지금은 교환할 수 없습니다.` }, Select({ value: `${O2} · 품절`, w: 360, error: true })),
            Note('다음 입고 예정일은 11-16(월)입니다. 기다리기 어려우면 반품으로 신청해 환불받을 수 있습니다(상품 불량이라 반품 배송비 없음).', { warn: true }),
            `<div class="wf-btnrow">${Btn('입고되면 교환하기 (11-16 이후 발송)')}${Btn('반품 신청으로 바꾸기', 'primary')}</div>`)}</div>`),
        Canvas({ size: 'auto', label: '교환 비용 — 단순 변심 / 상품 불량', right: '금액 상자만', pad: 20 }, `<div style="display:grid;grid-template-columns:repeat(2,300px);gap:20px"><div>${exSum(false, '')}</div><div>${exSum(true, '')}</div></div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '옵션을 안 고르고 신청 · 신청 직전에 품절된 경우', right: '부분', pad: 20 }, `<div style="width:420px">${Field({ label: '사이즈', required: true, error: '교환해서 받을 사이즈를 골라 주세요.' }, Select({ placeholder: '사이즈를 고르세요', w: 360, error: true }))}${Toast('방금 아이보리 / L 이 품절됐습니다. 다른 옵션을 고르거나 반품으로 신청해 주세요.', { kind: 'error' })}</div>`),
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 교환 신청 (다른 업종 예시 · 의류)' }, MobilePage({ title: '교환 신청', tab: false, bottom: [Btn('6,000원 결제하고 교환 신청하기', 'primary')] },
            Text('주문번호 20261104-000061 · 11-13(금)까지 신청 가능', { sm: true, mute: true }),
            ItemPick({ m: true, on: true, ...clothItem }),
            gap(),
            Field({ label: '교환 사유', required: true }, Select({ value: '사이즈가 맞지 않음(단순 변심)', w: '100%' })),
            `<b style="font-size:14px">교환해서 받을 옵션</b>`, gap(8),
            Field({ label: '색상', required: true }, Chips(['아이보리', '차콜', '스카이블루'], '아이보리')),
            Field({ label: '사이즈', required: true }, `<div class="wf-chips">${['S', 'M', 'L', 'XL'].map((s) => `<span class="wf-chip${s === 'L' ? ' on' : ''}" style="${s === 'XL' ? 'text-decoration:line-through;color:var(--mute);border-style:dashed' : s === 'M' ? 'color:var(--mute)' : ''}">${s}${s === 'XL' ? ' 품절' : s === 'M' ? ' 지금 옵션' : ''}</span>`).join('')}</div>`),
            exSum(false, ''))),
    ),
);

const Done = (o) => `<div style="max-width:${o.w || 560}px;margin:0 auto;text-align:center;padding:${o.m ? '8px 0' : '16px 0 8px'}"><div style="font-size:44px">${Icon(o.icon || 'check-circle-o')}</div><b style="display:block;font-size:${o.m ? 18 : 22}px;margin:8px 0 6px">${o.title}</b><p style="margin:0 0 18px;font-size:13.5px;color:var(--ink2)">${o.desc}</p><div style="text-align:left">${Box({ flat: true }, KV(o.kv, { wide: !o.m }))}${o.note ? Note(o.note) : ''}</div><div class="wf-btnrow center" style="margin-top:16px">${o.btns.join('')}</div></div>`;

const DONE = {
    cancel: { title: '주문을 취소했습니다', desc: '주문번호 20261111-000128 · 2026-11-11 10:05 취소', kv: [['취소 상품', `${PS} · ${O2} 1개`], ['환불 금액', '<b>93,000원</b> (예시)'], ['환불 수단', '신용카드(신한) 취소 · 카드사에 따라 3~5영업일'], ['알림', '취소 완료 알림톡을 010-****-1234 로 보냈습니다']], btns: [Btn('주문 목록으로'), Btn('쇼핑 계속하기', 'primary')] },
    cancelReq: { icon: 'clock-o', title: '취소를 요청했습니다', desc: '판매자가 승인하면 취소되고 환불됩니다. 아직 취소된 것이 아닙니다.', kv: [['접수번호', 'C20261111-0021'], ['요청 상품', `${PS} · ${O4} 1개`], ['환불 예정 금액', '176,000원 (예시) · 카카오페이'], ['결과 안내', '영업일 1일 안에 알림톡으로 알려 드립니다']], note: '이미 발송된 경우 요청이 거부될 수 있습니다. 그때는 상품을 받은 뒤 반품으로 신청해 주세요.', btns: [Btn('요청 철회'), Btn('진행 상황 보기', 'primary')] },
    ret: { title: '반품을 신청했습니다', desc: '판매자가 확인한 뒤 회수 일정을 알림톡으로 알려 드립니다.', kv: [['접수번호', 'R20261111-0012'], ['반품 상품', `${PS} · ${O1} 1개`], ['회수 방법', '판매자 회수 요청 · 서울 마포구 월드컵북로 ***'], ['환불 예정 금액', '46,000원 (예시) · 반품 배송비 3,000원 차감'], ['환불 시점', '상품이 판매자에게 도착해 확인이 끝나면 영업일 3일 안']], note: '받은 상자에 구성품을 모두 넣어 테이프로 닫아 두세요. 기사님이 영업일 1~3일 안에 방문합니다.', btns: [Btn('주문 목록으로'), Btn('진행 상황 보기', 'primary')] },
    retSelf: { title: '반품을 신청했습니다', desc: '11-16(월)까지 아래 주소로 상품을 보내 주세요.', kv: [['접수번호', 'R20261108-0004'], ['보낼 곳', `${SHOP.addr}<br>이너에라 반품 담당 · 070-****-1234 ${Btn('주소 복사', { size: 'sm', icon: 'documents-o' })}`], ['택배비', '선불로 내고 보내 주세요 (착불이면 환불 금액에서 차감)'], ['환불 예정 금액', '49,000원 (예시)']], note: '보낸 뒤 취소·반품·교환 내역에서 택배사와 송장번호를 입력해 주세요.', btns: [Btn('나중에 입력'), Btn('보낸 송장 입력', 'primary')] },
    ex: { title: '교환을 신청했습니다', desc: '판매자가 확인한 뒤 회수와 교환 상품 발송 일정을 알려 드립니다.', kv: [['접수번호', 'E20261104-0002'], ['보내는 상품', `${PS} · ${O2} 1개`], ['받는 상품', `${PS} · ${O2} 1개 (같은 구성)`], ['교환 배송비', '0원 · 상품 불량이라 판매자 부담'], ['회수·배송지', '서울 마포구 월드컵북로 ***']], btns: [Btn('주문 목록으로'), Btn('진행 상황 보기', 'primary')] },
};

const donePage = (d) => MypageLayout({ active: '주문 목록', crumb: ['홈', '마이페이지', '주문 목록', '신청 완료'] }, Done(d));

const state4 = StateBlock({ idx: 4, title: '신청 완료', note: '신청 버튼(과 확인 팝업·교환 배송비 결제)을 마친 뒤. 취소·취소 요청·반품·교환마다 문구와 다음 행동이 다릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '완료 화면은 끝났다가 아니라 이제 무슨 일이 일어나는지를 알려 주는 자리입니다. 즉시 취소는 얼마가 어디로 언제 환불되는지, 취소 요청은 아직 취소된 것이 아니라는 점, 반품·교환은 고객이 할 일(상자에 다시 담기 · 직접 발송이면 보낼 주소와 기한)을 적습니다. 접수번호는 문의할 때 쓰는 번호입니다.'),
    Anno({ title: '고객에게 나가는 알림' }, '취소 완료·취소 요청 접수·반품 접수·교환 접수 알림톡이 주문자 휴대폰으로 나가고(실패 시 문자), 운영자에게는 내부 수신자 설정대로 새 요청 알림이 갑니다. 알림 문구는 관리자 설정 > 알림에서 고칩니다. 완료 화면에서 새로 고침해도 다시 신청되지 않습니다.'),
    Canvas({ label: 'U-16 · 즉시 취소 완료 (결제완료 단계)' }, donePage(DONE.cancel)),
    CanvasRow(
        Canvas({ size: 'auto', label: '취소 요청 접수 (배송준비 단계 · 승인 대기)', right: '본문만', pad: 24 }, `<div style="width:560px">${Done(DONE.cancelReq)}</div>`),
        Canvas({ size: 'auto', label: '반품 접수 (판매자 회수 요청)', right: '본문만', pad: 24 }, `<div style="width:560px">${Done(DONE.ret)}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '반품 접수 (직접 발송 — 보낼 주소·기한)', right: '본문만', pad: 24 }, `<div style="width:560px">${Done(DONE.retSelf)}</div>`),
        Canvas({ size: 'auto', label: '교환 접수', right: '본문만', pad: 24 }, `<div style="width:560px">${Done(DONE.ex)}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 반품 접수 완료' }, MobilePage({ title: '신청 완료', tab: false, bottom: [Btn('주문 목록'), Btn('진행 상황 보기', 'primary')] }, Done({ ...DONE.ret, m: true, btns: [] }))),
        Canvas({ size: 'mobile', label: 'U-16 · 모바일 · 취소 요청 접수' }, MobilePage({ title: '신청 완료', tab: false, bottom: [Btn('요청 철회'), Btn('진행 상황 보기', 'primary')] }, Done({ ...DONE.cancelReq, m: true, btns: [] }))),
        Canvas({ size: 'auto', label: '신청 중 실패 — 결제 대행사 취소가 안 됐을 때 · 그 사이 판매자가 발송했을 때', right: '토스트만', pad: 20 }, `<div style="display:flex;flex-direction:column;gap:12px;width:440px">${Toast('카드 취소가 처리되지 않았습니다. 주문은 그대로입니다. 잠시 뒤 다시 시도하거나 고객센터 070-****-1234 로 알려 주세요.', { kind: 'error' })}${Toast('방금 판매자가 상품을 발송해 취소할 수 없습니다. 상품을 받은 뒤 반품으로 신청해 주세요.', { kind: 'error', action: '배송 조회' })}</div>`),
    ),
);

export default function U16() {
    return [state1, state2, state3, state4].join('');
}
