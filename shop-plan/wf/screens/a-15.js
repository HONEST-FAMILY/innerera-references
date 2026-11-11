import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Empty, PriceSummary, Grid, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };
const TABS = [{ t: '취소 요청', n: 2 }, { t: '환불 처리 중', n: 1 }, { t: '환불 실패', n: 1 }, { t: '취소 완료', n: 23 }, { t: '거부', n: 4 }];

const REQ = [
    { no: '20261110-000116', sub: '품목 2 / 2 (부분 취소)', ch: '자사몰', opt: O1, qty: 1, name: '김민지', tel: '010-****-1234', pay: '신용카드', amt: '49,000원', st: '배송준비', why: '단순 변심', memo: '수량을 잘못 골랐어요. 1박스는 빼 주세요.', at: '11-10 16:20', wait: '17시간째' },
    { no: '2026111045790022', sub: '', ch: '스마트스토어', opt: O2, qty: 1, name: '정수아', tel: '010-****-9015', pay: '네이버페이', amt: '93,000원', st: '배송준비', why: '다른 상품으로 재주문', memo: '4박스 구성으로 다시 주문했습니다.', at: '11-11 08:02', wait: '2시간째', ss: true },
];
const COLS = [{ t: '주문번호 · 요청 일시', w: 152, sort: 'asc' }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 96 }, { t: '취소 사유', w: 150 }, { t: '취소 금액 · 결제수단', w: 110, align: 'right' }, { t: '요청 때 상태', w: 88 }, { t: '', w: 156 }];
const row = (o) => [`<u>${o.no}</u><small>${o.sub ? `${o.sub}<br>` : ''}요청 ${o.at} · ${o.wait}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`,
    `<b>${o.why}</b><small>${o.memo}</small>`, `${o.amt}<small>${o.pay}</small>`, OrderBadge(o.st), o.ss ? `${Btn('승인', { size: 'sm', kind: 'primary' })} ${Btn('발송으로 철회', { size: 'sm' })}` : `${Btn('승인', { size: 'sm', kind: 'primary' })} ${Btn('거부', { size: 'sm' })}`];

const Page = (tab, ...body) => AdminLayout({ active: 'a-15', counts: COUNTS, actions: [Btn('주문·클레임 정책', { icon: 'cog' })], desc: '결제완료 단계의 취소는 고객이 바로 취소하고 자동 환불됩니다. 여기에는 발주확인(배송준비) 뒤에 들어온 취소 요청만 옵니다.' }, Tabs(TABS, tab), body);
const Search = (sum) => Filters({ open: false, summary: sum || '요청일 최근 1개월 · 채널 전체' });
const ReqHead = () => ListHead({ total: 2, left: Chips(['전체 2', '자사몰 1', '스마트스토어 1'], '전체 2'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] });
const ReqList = (checked = []) => Table({ check: true, checked, cols: COLS, rows: REQ.map(row) });

const state1 = StateBlock({ idx: 1, title: '요청 목록', note: '아직 승인도 거부도 하지 않은 취소 요청. 오래 기다린 요청이 위에 옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '취소 요청은 출고와 경쟁합니다. 요청을 못 보고 발송하면 반품이 되어 택배비가 두 번 듭니다. 그래서 대시보드와 왼쪽 메뉴에 숫자를 올리고, 목록에는 요청 뒤 얼마나 지났는지와 요청 때 상태를 보여 줍니다. 요청이 들어온 주문은 발주 확인·발송 처리에서 송장을 넣으려 하면 막힙니다(A-12 엑셀 검증의 오류 사유).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '취소는 품목 단위입니다. 한 주문의 일부 품목만 취소하면 부분 취소가 되고, 쿠폰·적립금·배송비를 다시 계산해야 합니다(상태 2). 스마트스토어 요청은 네이버에서 가져온 것이라 승인하면 네이버로 전송되고 환불은 네이버가 합니다. 네이버에는 취소 거부 처리가 따로 없어 거부 버튼 대신 발송으로 철회 버튼이 나옵니다(상태 7). 이미 발송한 뒤 들어온 요청은 여기서 승인할 수 없고 반품으로 안내합니다.'),
    Canvas({ label: 'A-15 · 취소 요청 탭' }, Page('취소 요청', Search(), ReqHead(), ReqList(), Note('금액은 예시 값입니다(판매가 미확정).'), Pager({ page: 1, last: 1, per: 50 }))),
    Canvas({ label: 'A-15 · 검색 조건 펼침' }, Page('취소 요청',
        Filters({ rows: [
            { k: '기간', v: [Select({ value: '요청일', w: 110 }), Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })] },
            { k: '채널', v: RadioGroup(['전체', '자사몰', '스마트스토어'], '전체') },
            { k: '취소 사유', v: Select({ value: '전체', w: 220 }) },
            { k: '결제수단', v: RadioGroup(['전체', '카드·간편결제', '가상계좌·무통장입금'], '전체') },
            { k: '검색어', v: [Select({ value: '주문자 이름', w: 150 }), Input({ placeholder: '주문자 이름 · 연락처 뒷 4자리 · 주문번호', icon: 'search', w: 380 })] },
        ] }),
    )),
    Canvas({ label: 'A-15 · 2건 선택 → 일괄 처리 바 (일괄 승인은 전액 취소만 · 부분 취소는 한 건씩)' }, Page('취소 요청', Search(),
        BulkBar({ count: 2, sub: '자사몰 1건(부분 취소) · 스마트스토어 1건' }, Btn('일괄 승인', 'primary'), Btn('일괄 거부', 'line'), Btn('엑셀 내려받기', { kind: 'line', icon: 'download' })),
        ReqList([0, 1]),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '일괄 승인 → 부분 취소가 섞여 있을 때', right: '팝업만', pad: 20 },
            Modal({ title: '선택한 2건 중 1건만 일괄 승인할 수 있습니다', w: 540, foot: [Btn('취소'), Btn('1건 승인', 'primary')] },
                Table({ dense: true, cols: [{ t: '주문번호', w: 150 }, { t: '주문자', w: 70 }, '처리'], rows: [
                    ['2026111045790022', '정수아', `${Icon('check-min')} 승인 · 네이버로 전송 (환불은 네이버가 처리)`],
                    { dim: true, c: ['20261110-000116', '김민지', '부분 취소라 환불 금액을 확인해야 합니다. 목록에서 승인을 눌러 한 건씩 처리하세요'] },
                ] }),
            )),
        Canvas({ size: 'auto', label: '이미 발송한 주문에 요청이 걸려 있을 때 줄의 모습', right: '부분', pad: 20 }, `<div style="width:560px">${Box({ flat: true }, Text(`${Badge('이미 발송됨', 'warn')} <b>20261110-000113 · 윤서연</b><br>취소 요청(11-10 17:10)보다 발송처리(11-10 15:02)가 먼저입니다. 취소로 승인할 수 없습니다.<br>${Btn('반품으로 전환 안내 보내기', { size: 'sm', kind: 'primary' })} ${Btn('택배사에 회수 요청하고 취소 승인', { size: 'sm' })} ${Btn('거부', { size: 'sm' })}`, { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '취소 요청이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:460px">${Empty({ icon: 'check-circle-o', title: '처리할 취소 요청이 없습니다', desc: '발주확인 뒤 고객이 취소를 요청하면 여기에 나타나고 알림이 갑니다.' })}</div>`),
    ),
);

const calcBox = (o = {}) => Grid('1fr 300px',
    Table({ dense: true, cols: [{ t: '항목', w: 150 }, { t: '금액', w: 90, align: 'right' }, '계산'], rows: [
        ['취소하는 상품 금액', '49,000원', `${O1} 1개`],
        ['쿠폰 할인 나눠 빼기', '- 1,035원', '가입 축하 3,000원 쿠폰 × (49,000 ÷ 142,000)'],
        ['적립금 사용분', '- 690원', '사용한 2,000원 × (49,000 ÷ 142,000) → 적립금으로 돌려줌'],
        o.ship ? { hl: true, c: ['배송비 다시 계산', '- 3,000원', '남는 상품 0원 → 무료배송 조건(5만원 이상)에 못 미침'] } : ['배송비 다시 계산', '0원', '남는 상품 93,000원 → 무료배송 그대로'],
    ], foot: ['결제수단으로 환불', o.ship ? '44,275원' : '47,275원', '신용카드 부분 취소'] }),
    PriceSummary({ title: '돌려주는 것', rows: [['신용카드 부분 취소', o.ship ? '44,275원' : '47,275원'], ['적립금 반환', '690원'], ['쿠폰', '돌려주지 않음', '남은 주문(93,000원)이 쿠폰 조건을 채워 그대로 사용']], total: ['고객이 받는 합계', o.ship ? '44,965원' : '47,965원'], note: '금액은 예시 값입니다.' }),
);

const approveModal = (o = {}) => Modal({ title: '취소 승인 · 20261110-000116', w: 860, foot: o.foot || [Btn('닫기'), Btn('환불 금액 고치기'), Btn('승인하고 47,275원 환불', 'primary')] },
    o.top || '',
    KV([['주문자', '김민지 · 010-****-1234'], ['취소 품목', `${P} · ${O1} · 1개 (주문 품목 2개 중 1개 · 부분 취소)`], ['원 결제', '신용카드 137,000원 = 상품 142,000 - 쿠폰 3,000 - 적립금 2,000 + 배송비 0'], ['취소 사유', '단순 변심 · 수량을 잘못 골랐어요. 1박스는 빼 주세요.']], { wide: true }),
    '<div style="height:14px"></div>',
    o.body || calcBox(),
    o.bottom === undefined ? FormTable([
        { k: '재고', v: Check(`취소한 수량을 재고에 되돌리기 (${O1} +1)`, { on: true }) },
        { k: '고객 알림', v: Check('취소 완료 · 환불 금액 안내 보내기 (알림톡 · 실패 시 문자)', { on: true }) },
    ]) : o.bottom,
);

const state2 = StateBlock({ idx: 2, title: '승인 팝업(환불 금액·PG 자동 취소 결과)', note: '승인 버튼을 누르면 환불 금액 계산을 보여 주고, 승인하면 결제 대행사에 결제 취소를 자동으로 요청합니다. 결과(성공 · 실패)가 같은 팝업에 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '부분 취소의 환불 금액은 손으로 계산하면 틀립니다. 상품 금액에서 쿠폰 할인을 금액 비율로 나눠 빼고, 쓴 적립금은 적립금으로 돌려주고, 남는 주문이 무료배송 조건에 못 미치면 배송비를 다시 받습니다. 이 계산을 줄마다 식과 함께 보여 줘 운영자가 고객에게 그대로 설명할 수 있게 합니다. 승인하면 결제 관리자 화면에 따로 들어가지 않아도 카드 취소까지 끝납니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '결제 취소 요청이 실패할 수 있습니다(결제 대행사 응답 없음 · 카드사 점검 · 이미 취소된 거래). 실패하면 주문은 취소완료가 아니라 환불 처리 중에 남고, 다시 시도하거나 직접 환불했다고 기록할 수 있어야 합니다. 화면 문구에서는 결제 대행사라고 쓰고, 거래번호는 그대로 보여 줘 문의할 때 쓰게 합니다.'),
    Canvas({ label: 'A-15 · 자사몰 부분 취소 요청의 승인 버튼 → 팝업 (환불 금액 계산)' }, Overlay({ bg: Page('취소 요청', Search(), ReqHead(), ReqList()), h: 780 }, approveModal())),
    Canvas({ size: 'auto', label: '남는 주문이 무료배송 조건에 못 미칠 때 (배송비를 환불 금액에서 뺌 · 다른 주문 예시)', right: '계산 부분만', pad: 20 }, `<div style="width:820px">${calcBox({ ship: true })}${Note('전체 취소면 배송비도 함께 돌려줍니다. 부분 취소로 남는 금액이 무료배송 기준 아래로 내려갈 때만 배송비(3,000원)를 뺍니다. 기준과 금액은 설정 > 배송의 배송비 규칙을 따릅니다.')}</div>`),
    CanvasRow(
        Canvas({ size: 'auto', label: '환불 금액 고치기 → 직접 입력 (고객과 따로 합의한 경우)', right: '팝업만', pad: 20 },
            Modal({ title: '환불 금액 고치기', w: 480, foot: [Btn('계산 값으로 되돌리기'), Btn('적용', 'primary')] },
                FormTable([
                    { k: '계산된 환불 금액', v: Text('47,275원') },
                    { k: '고친 환불 금액', required: true, v: Input({ value: '49,000', suffix: '원', w: 180, error: true }), error: '부분 취소로 돌려줄 수 있는 최대 금액은 47,275원입니다. (결제 금액에서 이미 환불한 금액을 뺀 범위)' },
                    { k: '고친 이유', required: true, v: Input({ placeholder: '예: 배송비는 받지 않기로 함', w: 280 }) },
                ]),
            )),
        Canvas({ size: 'auto', label: '쿠폰·적립금·배송비 조건이 없는 몰 (기능 끔) · 전액 취소', right: '계산 부분만', pad: 20 }, `<div style="width:420px">${PriceSummary({ title: '돌려주는 것', rows: [['취소하는 상품 금액', '93,000원'], ['배송비', '3,000원', '전체 취소라 배송비도 돌려줌']], total: ['카카오페이 전액 취소', '96,000원'] })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '승인 뒤 · 결제 취소 성공', right: '팝업만', pad: 20 },
            Modal({ title: '취소 승인 · 20261110-000116', w: 560, foot: [Btn('주문 상세 보기'), Btn('닫기', 'primary')] },
                Text(`${Icon('check-circle-o')} 취소를 승인하고 환불했습니다.`, { b: true }),
                KV([['결제 취소', `${Badge('성공', 'check')} 신용카드 부분 취소 47,275원`], ['거래번호', 'T2026111016200116 · 취소 11-11 10:14:08'], ['카드사 반영', '카드사에 따라 3~5영업일 (고객 알림에 안내됨)'], ['적립금', '690원 반환 완료'], ['재고', `${O1} +1 (142 → 143)`], ['고객 알림', '알림톡 발송 성공'], ['남은 주문', `${O2} 1개 · 배송준비 그대로`]], { wide: true }),
            )),
        Canvas({ size: 'auto', label: '승인 뒤 · 결제 취소 실패 (환불 처리 중 탭에 남음)', right: '팝업만', pad: 20 },
            Modal({ title: '취소 승인 · 20261110-000116', w: 560, foot: [Btn('닫기'), Btn('직접 환불했다고 기록'), Btn('결제 취소 다시 시도', { kind: 'primary', icon: 'refresh' })] },
                Note('결제 취소에 실패했습니다. 주문은 아직 취소완료가 아니고 고객에게 알림도 가지 않았습니다.', { warn: true }),
                KV([['결제 취소', `${Badge('실패', 'warn')} 신용카드 부분 취소 47,275원`], ['실패 사유', '카드사 점검 시간입니다 (23:30 ~ 00:30). 점검이 끝난 뒤 다시 시도하세요.'], ['거래번호', 'T2026111016200116'], ['자동 재시도', '30분 뒤 한 번 더 시도합니다 (최대 3회). 그래도 안 되면 알림이 옵니다.'], ['주문 상태', `${OrderBadge('취소요청')} → 환불 처리 중 탭으로 이동`]], { wide: true }),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '직접 환불했다고 기록 → 팝업 (결제 대행사 관리자에서 직접 취소했거나 계좌로 보낸 경우)', right: '팝업만', pad: 20 },
            Modal({ title: '직접 환불 기록', w: 520, foot: [Btn('취소'), Btn('기록하고 취소완료로 변경', 'primary')] },
                FormTable([
                    { k: '환불 방법', required: true, v: [Radio('결제 대행사 관리자에서 직접 취소함', { on: true }), Radio('고객 계좌로 보냄')] },
                    { k: '환불 금액', required: true, v: Input({ value: '47,275', suffix: '원', w: 180 }) },
                    { k: '환불일', required: true, v: Input({ value: '2026-11-11', icon: 'calendar', w: 180 }) },
                    { k: '메모', v: Input({ value: '결제 대행사 상담 뒤 수동 취소', w: 300 }) },
                ]),
                Note('이 기록은 실제 돈을 움직이지 않습니다. 이미 환불한 것이 맞는지 확인한 뒤 누르세요.', { warn: true }),
            )),
        Canvas({ size: 'auto', label: '스마트스토어 요청의 승인 → 확인 (환불 계산 없음 · 네이버가 환불)', right: '팝업만', pad: 20 },
            Modal({ title: '취소 승인 · 2026111045790022', w: 520, foot: [Btn('닫기'), Btn('승인하고 네이버로 전송', 'primary')] },
                KV([['채널', ChannelBadge('스마트스토어')], ['주문자', '정수아'], ['취소 품목', `${P} · ${O2} · 1개`], ['취소 사유', '다른 상품으로 재주문'], ['환불', '네이버페이가 고객에게 직접 환불합니다 (금액 93,000원)'], ['고객 알림', '네이버가 보냅니다 (우리 알림톡은 나가지 않음)']], { wide: true }),
                Note('승인하면 네이버에 취소 승인이 전송됩니다. 전송에 실패하면 판매채널 > 스마트스토어 연동의 전송 기록에서 다시 보낼 수 있습니다.'),
            )),
    ),
);

const REJECT_REASONS = [{ t: '이미 발송했습니다', on: true }, '주문 제작·개봉 상품이라 취소할 수 없습니다', '고객이 취소 요청을 거두었습니다', '기타(직접 입력)'];
const rejectModal = (o = {}) => Modal({ title: '취소 거부 · 20261110-000116', w: 600, foot: [Btn('닫기'), Btn('거부하고 고객에게 알리기', { kind: 'danger', disabled: o.disabled })] },
    FormTable([
        { k: '대상', v: Text(`김민지 · ${P} ${O1} 1개 · 요청 사유 단순 변심`) },
        { k: '거부 사유', required: true, v: o.reason || Select({ value: '이미 발송했습니다', w: 320 }), error: o.err },
        { k: '고객에게 할 말', v: Textarea({ value: o.msg === undefined ? '요청하신 시점에 이미 택배사에 넘어가 취소가 어렵습니다. 상품을 받으신 뒤 마이페이지에서 반품을 신청해 주세요.' : o.msg, placeholder: '거부 사유 아래에 덧붙일 말 (선택)', h: 72, count: o.msg === '' ? '0 / 200' : '62 / 200' }) },
        { k: '거부 뒤 주문 상태', v: Text(`${OrderBadge('배송준비')} 로 돌아갑니다 (요청 전 상태)`) },
    ]),
    o.preview === false ? '' : Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 김민지 님, 요청하신 주문 취소가 어렵게 되었습니다.<br>주문번호 20261110-000116 · 롱지비티 석류맛 젤리스틱 1박스(14일분) 1개<br>사유: 이미 발송했습니다<br>요청하신 시점에 이미 택배사에 넘어가 취소가 어렵습니다. 상품을 받으신 뒤 마이페이지에서 반품을 신청해 주세요.<br>문의: 고객센터 070-****-1234', { sm: true })),
);

const state3 = StateBlock({ idx: 3, title: '거부 팝업(사유 → 고객 알림)', note: '거부하려면 사유를 반드시 골라야 하고, 그 사유가 고객 알림에 그대로 들어갑니다. 보내기 전에 문구를 미리 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이유 없이 거부당한 고객은 바로 전화합니다. 사유를 필수로 받고, 고객이 다음에 무엇을 하면 되는지(받은 뒤 반품 신청)를 덧붙이게 합니다. 운영자가 실제로 나가는 문장을 눈으로 확인하고 보내도록 미리보기를 팝업 안에 둡니다. 거부하면 주문은 요청 전 상태로 돌아가 다시 출고 대상이 됩니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '전자상거래법상 단순 변심 취소는 발송 전이면 거부할 수 없는 경우가 대부분입니다. 그래서 거부 사유 목록은 정당한 사유로만 구성하고, 기타를 고르면 직접 쓴 문장이 고객에게 그대로 나간다고 알려 줍니다. 스마트스토어 요청에는 이 거부 팝업이 뜨지 않고, 송장을 넣어 발송 처리하는 것으로 취소 요청을 철회합니다(상태 7). 사유 목록은 설정 > 주문·클레임 정책에서 고칩니다.'),
    Canvas({ label: 'A-15 · 거부 버튼 → 팝업 (사유 고름 · 알림 미리보기)' }, Overlay({ bg: Page('취소 요청', Search(), ReqHead(), ReqList()), h: 760 }, rejectModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '사유 고르는 중 (목록 열림)', right: '팝업만', pad: 20 }, rejectModal({ reason: Select({ placeholder: '거부 사유를 고르세요', w: 320, open: true, options: REJECT_REASONS.map((r) => (typeof r === 'string' ? r : { ...r, on: false })) }), msg: '', preview: false, disabled: true })),
        Canvas({ size: 'auto', label: '사유를 고르지 않고 누름 → 오류', right: '팝업만', pad: 20 }, rejectModal({ reason: Select({ placeholder: '거부 사유를 고르세요', w: 320, error: true }), err: '거부 사유를 골라 주세요. 고른 사유가 고객 알림에 들어갑니다.', msg: '', preview: false })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '거부 완료', right: '토스트만', pad: 20 }, Toast('취소 요청을 거부하고 고객에게 알렸습니다. 주문은 배송준비로 돌아갔습니다.', { action: '거부 탭 보기' })),
        Canvas({ size: 'auto', label: '일괄 거부 → 같은 사유로 여러 건', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '선택한 2건을 같은 사유로 거부할까요?', desc: '사유: 이미 발송했습니다<br>자사몰 2건에 취소 거부 안내(알림톡 · 실패 시 문자)가 갑니다.<br>스마트스토어 요청은 일괄 거부에서 빠집니다(발송 처리로 철회).', ok: '2건 거부', danger: true })),
    ),
);

const VA_COLS = [{ t: '주문번호 · 승인 일시', w: 152 }, { t: '채널', w: 90 }, '상품 · 구성', { t: '주문자', w: 96 }, { t: '환불 금액 · 결제수단', w: 116, align: 'right' }, { t: '멈춘 이유', w: 220 }, { t: '', w: 128 }];
const vaRow = (st, btn) => [`<u>20261109-000103</u><small>승인 11-11 09:50</small>`, ChannelBadge('자사몰'), `${P}<small>${O1} · 2개</small>`, '임재현<small class="nw">010-****-6642</small>', '98,000원<small>가상계좌</small>', st, btn];

const vaForm = (o = {}) => FormTable([
    { k: '환불 금액', v: Text('<b>98,000원</b> · 가상계좌(신한) 입금분 전액') },
    { k: '은행', required: true, v: o.bank || Select({ value: '카카오뱅크', w: 220 }) },
    { k: '계좌번호', required: true, v: Input({ value: o.acct === undefined ? '3333-01-2345678' : o.acct, placeholder: '숫자만 입력', w: 220, error: !!o.err }), error: o.err },
    { k: '예금주', required: true, v: [Input({ value: o.holder === undefined ? '임재현' : o.holder, w: 140 }), Btn('예금주 확인', { size: 'sm' }), o.checked === false ? '' : Badge('예금주 일치', 'check')], help: '주문자 이름과 예금주가 다르면 환불할 수 없습니다(본인 계좌만).' },
]);

const state4 = StateBlock({ idx: 4, title: '가상계좌 환불(환불 계좌)', note: '가상계좌·무통장입금으로 낸 돈은 카드처럼 취소가 안 되어 고객 계좌로 보내야 합니다. 환불 계좌를 받아 결제 대행사에 환불을 요청합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '카드 취소는 승인 한 번으로 끝나지만 계좌로 낸 돈은 돌려줄 계좌가 있어야 합니다. 고객이 취소를 신청할 때 환불 계좌를 적게 하고(U-16), 적지 않았으면 승인한 뒤 환불 처리 중 탭에 남겨 고객에게 계좌 입력 주소를 보내거나 운영자가 전화로 받아 넣습니다. 계좌가 들어오면 결제 대행사 환불을 요청하고 결과를 받아 취소완료로 넘깁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '계좌번호는 개인정보라 화면에 가려서 보여 주고(뒤 4자리만), 환불이 끝나면 30일 뒤 지웁니다. 예금주 확인을 거쳐 주문자 본인 계좌일 때만 보냅니다. 무통장입금(우리 통장으로 직접 받은 돈)은 자동 환불이 안 되므로 운영자가 직접 이체하고 이체했다고 기록합니다.'),
    Canvas({ label: 'A-15 · 환불 처리 중 탭 (환불 계좌를 기다리는 건)' }, Page('환불 처리 중',
        Note('취소는 승인했지만 환불이 끝나지 않은 주문입니다. 환불 계좌 없음 · 결제 취소 실패 · 직접 이체 대기가 여기에 모입니다.'),
        ListHead({ total: 1, left: Chips(['전체 1', '환불 계좌 없음 1', '결제 취소 실패 0', '직접 이체 대기 0'], '전체 1'), right: PerPage(50) }),
        Table({ check: true, cols: VA_COLS, rows: [{ hl: true, c: vaRow(`${Badge('환불 계좌 없음', 'warn')}<small>고객에게 입력 요청 11-11 09:50 발송 · 아직 입력 안 함</small>`, `${Btn('환불 계좌 넣기', { size: 'sm', kind: 'primary' })}<small><u>입력 요청 다시 보내기</u></small>`) }] }),
    )),
    Canvas({ label: 'A-15 · 환불 계좌 넣기 버튼 → 팝업 (고객이 전화로 불러 준 계좌 · 예금주 확인 완료)' }, Overlay({ bg: Page('환불 처리 중', ListHead({ total: 1, right: PerPage(50) })), h: 600 },
        Modal({ title: '가상계좌 환불 · 20261109-000103', w: 580, foot: [Btn('닫기'), Btn('98,000원 환불 요청', 'primary')] },
            vaForm(),
            Note('환불 요청을 누르면 결제 대행사가 위 계좌로 보냅니다. 보통 그 자리에서 끝나고, 은행 점검 시간(23:30 ~ 00:30)에는 다음 날 처리됩니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '은행 고르는 중 (검색형) · 예금주 확인 전', right: '팝업만', pad: 20 },
            Modal({ title: '가상계좌 환불 · 20261109-000103', w: 580, foot: [Btn('닫기'), Btn('98,000원 환불 요청', { kind: 'primary', disabled: true })] },
                vaForm({ bank: Select({ placeholder: '은행을 고르세요', w: 220, open: true, search: '카', options: [{ t: '카카오뱅크', on: true }, 'KB국민은행', '케이뱅크'] }), acct: '', holder: '', checked: false }))),
        Canvas({ size: 'auto', label: '예금주가 주문자와 다름 → 막힘', right: '팝업만', pad: 20 },
            Modal({ title: '가상계좌 환불 · 20261109-000103', w: 580, foot: [Btn('닫기'), Btn('98,000원 환불 요청', { kind: 'primary', disabled: true })] },
                vaForm({ acct: '3333-01-2345679', holder: '임재현', checked: false, err: '이 계좌의 예금주는 임*수 입니다. 주문자(임재현) 본인 계좌만 환불할 수 있습니다. 계좌번호를 다시 확인하세요.' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '환불 요청 성공', right: '팝업만', pad: 20 },
            Modal({ title: '가상계좌 환불 · 20261109-000103', w: 480, foot: [Btn('닫기', 'primary')] },
                Text(`${Icon('check-circle-o')} 환불을 마쳤습니다. 주문이 취소완료로 바뀌었습니다.`, { b: true }),
                KV([['환불', `${Badge('성공', 'check')} 98,000원`], ['받는 계좌', '카카오뱅크 ****5678 · 임재현'], ['처리 시각', '11-11 10:31:44'], ['고객 알림', '취소 완료 · 환불 안내 발송 성공'], ['계좌 정보', '2026-12-11에 자동으로 지웁니다']]),
            )),
        Canvas({ size: 'auto', label: '무통장입금 주문 (자동 환불 안 됨 → 직접 이체 뒤 기록)', right: '팝업만', pad: 20 },
            Modal({ title: '무통장입금 환불 · 20261110-000119', w: 520, foot: [Btn('닫기'), Btn('이체했다고 기록하고 취소완료', 'primary')] },
                Note('무통장입금은 우리 통장으로 직접 받은 돈이라 자동으로 환불되지 않습니다. 은행에서 직접 이체한 뒤 기록하세요.', { warn: true }),
                KV([['환불 금액', '<b>176,000원</b>'], ['고객 환불 계좌', '국민은행 ****3381 · 윤서연 <u>전체 보기</u>'], ['전체 보기', '누르면 계좌번호 전체가 30초 동안 보이고 누가 봤는지 기록됩니다']], { wide: true }),
                '<div style="height:10px"></div>',
                FormTable([{ k: '이체일', required: true, v: Input({ value: '2026-11-11', icon: 'calendar', w: 180 }) }, { k: '이체한 사람', v: Text('이보림 (로그인한 운영자)') }]),
            )),
        Canvas({ size: 'auto', label: '고객에게 가는 환불 계좌 입력 요청', right: '알림 문구', pad: 20 }, `<div style="width:340px">${Box({ flat: true, title: '알림톡 · 실패 시 문자' }, Text('[이너에라] 임재현 님, 주문 취소가 승인되었습니다.<br>가상계좌로 결제하셔서 환불받을 계좌가 필요합니다.<br>환불 금액: 98,000원<br>아래 주소에서 본인 명의 계좌를 입력해 주세요. (7일 안)<br>환불 계좌 입력하기', { sm: true }))}</div>`),
    ),
);

const DONE = [
    ['20261110-000116', '품목 2 / 2', '자사몰', O1, 1, '김민지', '운영자 승인(이보림)', '47,275원', '신용카드 부분 취소', '11-11 10:14', '성공'],
    ['20261111-000121', '', '자사몰', O2, 1, '이하은', '고객 바로 취소', '93,000원', '카카오페이 전액 취소', '11-11 09:05', '성공'],
    ['2026111045790022', '', '스마트스토어', O2, 1, '정수아', '운영자 승인(이보림)', '93,000원', '네이버페이 · 네이버가 환불', '11-11 10:20', '네이버 전송 성공'],
    ['20261109-000103', '', '자사몰', O1, 2, '임재현', '운영자 승인(이보림)', '98,000원', '가상계좌 → 카카오뱅크 ****5678', '11-11 10:31', '성공'],
    ['20261108-000085', '', '자사몰', O2, 1, '박서준', '입금 기한 지나 자동 취소', '0원', '입금 전 · 환불 없음', '11-10 09:05', '-'],
    ['20261107-000080', '', '자사몰', O4, 1, '최도윤', '판매자 취소(품절)', '179,000원', '신용카드 전액 취소', '11-07 17:30', '성공'],
];
const DONE_COLS = [{ t: '주문번호 · 취소 일시', w: 152, sort: 'desc' }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '취소 종류', w: 150 }, { t: '환불 금액 · 방법', w: 190, align: 'right' }, { t: '환불 결과', w: 110 }];

const state5 = StateBlock({ idx: 5, title: '완료', note: '취소가 끝난 주문과 거부한 요청. 누가 어떻게 취소했고 얼마가 어떤 방법으로 환불됐는지 남습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 환불이 안 들어왔다고 물으면 이 탭에서 답합니다. 취소 종류(고객 바로 취소 · 운영자 승인 · 자동 취소 · 판매자 취소)와 환불 방법·결과·시각을 한 줄에 보여 주고, 눌러서 주문 상세의 결제 이력(거래번호)까지 갑니다. 결제완료 단계에서 고객이 바로 취소한 건도 여기 모여 하루 취소 금액을 한 번에 봅니다.'),
    Canvas({ label: 'A-15 · 취소 완료 탭' }, Page('취소 완료', Search('취소일 최근 7일 · 채널 전체'),
        ListHead({ total: 23, left: Chips(['전체 23', '고객 바로 취소 12', '운영자 승인 6', '자동 취소 3', '판매자 취소 2'], '전체 23'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: DONE_COLS, rows: DONE.map((d) => [`<u>${d[0]}</u><small>${d[1] ? `${d[1]} · ` : ''}${d[9]}</small>`, ChannelBadge(d[2]), `${P}<small>${d[3]} · ${d[4]}개</small>`, d[5], d[6], `${d[7]}<small>${d[8]}</small>`, d[10] === '-' ? '<small>환불 없음</small>' : Badge(d[10], 'check')]),
            foot: ['합계 (이 쪽 6건)', '', '', '', '', '510,275원', ''] }),
        Note('금액은 예시 값입니다(판매가 미확정). 주문번호를 누르면 주문 상세의 결제 이력에서 거래번호와 부분 취소 기록을 볼 수 있습니다.'),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-15 · 거부 탭 (사유 · 거부 뒤 주문이 어떻게 됐는지)' }, Page('거부', Search('거부일 최근 1개월 · 채널 전체'),
        ListHead({ total: 4, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '주문번호 · 거부 일시', w: 152 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '거부 사유', w: 220 }, { t: '거부한 사람', w: 90 }, { t: '지금 상태', w: 96 }, { t: '고객 알림', w: 90 }], rows: [
            ['<u>20261110-000113</u><small>11-10 17:25</small>', ChannelBadge('자사몰'), `${P}<small>${O4} · 1개</small>`, '윤서연', '이미 발송했습니다<small>받은 뒤 반품 신청 안내</small>', '이보림', OrderBadge('배송중'), '<small>알림톡 성공</small>'],
            ['<u>20261106-000075</u><small>11-06 11:02</small>', ChannelBadge('자사몰'), `${P}<small>${O1} · 1개</small>`, '강지호', '고객이 취소 요청을 거두었습니다', '이보림', OrderBadge('구매확정'), '<small>보내지 않음</small>'],
            ['<u>2026110344920518</u><small>11-03 15:40</small>', ChannelBadge('스마트스토어'), `${P}<small>${O2} · 1개</small>`, '박서준', '이미 발송했습니다', '이보림', OrderBadge('반품요청'), '<small>네이버 전송 성공</small>'],
        ] }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '취소 완료 탭이 비었을 때', right: '빈 상태만', pad: 20 }, `<div style="width:460px">${Empty({ icon: 'file-text-o', title: '이 기간에 취소된 주문이 없습니다', desc: '기간을 넓혀 다시 찾아보세요.', action: Btn('기간을 3개월로 넓히기', 'primary') })}</div>`),
        Canvas({ size: 'auto', label: '취소 완료 줄에서 영수증 재발송 · 환불 안내 재발송', right: '부분', pad: 20 }, `<div style="width:420px">${Select({ value: '더 보기', w: 300, open: true, options: ['주문 상세 열기', '환불 안내 다시 보내기', { t: '취소 영수증 보기', sub: '카드 취소 전표' }, { t: '취소 되돌리기', sub: '되돌릴 수 없음 · 새로 주문 필요', disabled: true }] })}</div>`),
    ),
);

const RF_COLS = [{ t: '주문번호 · 승인 일시', w: 152 }, { t: '채널', w: 90 }, '상품 · 구성', { t: '주문자', w: 92 }, { t: '환불 금액 · 결제수단', w: 116, align: 'right' }, { t: '상태 · 사유', w: 240 }, { t: '', w: 150 }];
const ING = [
    ['20261109-000103', '승인 11-11 09:50', O1, 2, '임재현', '010-****-6642', '98,000원', '가상계좌', `${Badge('환불 계좌 없음', 'warn')}<small>고객에게 입력 요청 11-11 09:50 발송</small>`, `${Btn('환불 계좌 넣기', { size: 'sm', kind: 'primary' })}`, true],
    ['20261110-000108', '승인 11-11 09:20', O2, 1, '박서준', '010-****-5821', '93,000원', '가상계좌', `${Badge('은행 처리 중', 'dash')}<small>환불 요청 11-11 09:21 · 영업일 1~2일 · 완료 통보를 받으면 자동으로 취소 완료</small>`, '<small>기다리는 중</small>', false],
];
const FAILED = [
    ['20261110-000107', '승인 11-10 23:41', O1, 1, '최도윤', '010-****-2204', '52,000원', '신용카드', `${Badge('환불 실패', 'warn')}<small><b>카드사 점검 시간(23:30 ~ 00:30)</b> · 자동 재시도 3회 모두 실패 · 마지막 시도 11-11 00:41</small>`, `${Btn('다시 시도', { size: 'sm', kind: 'primary' })} ${Btn('수동 환불 완료 확인', { size: 'sm' })}`, true],
];
const rfRow = (r) => ({ hl: r[10], c: [`<u>${r[0]}</u><small>${r[1]}</small>`, ChannelBadge('자사몰'), `${P}<small>${r[2]} · ${r[3]}개</small>`, `${r[4]}<small class="nw">${r[5]}</small>`, `${r[6]}<small>${r[7]}</small>`, r[8], r[9]] });
const FixedNote = Note('결제 대행사 관리자 화면에서 직접 취소하지 마세요. 우리 쪽 금액과 어긋납니다. 어쩔 수 없이 직접 취소했다면 수동 환불 완료 확인으로 반드시 기록하세요.', { warn: true });

const state6 = StateBlock({ idx: 6, title: '환불 처리 중·환불 실패 탭(사유·다시 시도·수동 환불 완료 확인)', note: '취소는 승인했지만 돈이 아직 돌아가지 않은 주문. 기다리면 되는 건(환불 처리 중)과 사람이 손봐야 하는 건(환불 실패)을 탭으로 나눕니다.' },
    Anno({ title: '왜 이렇게 하나' }, '취소 완료는 결제 대행사가 환불이 끝났다고 답한 뒤에만 됩니다. 화면에서만 환불 완료이고 실제 돈은 안 나간 사고를 막기 위해서입니다. 그래서 그 사이의 주문이 머무는 곳이 필요합니다. 환불 처리 중은 답을 기다리는 건(가상계좌 환불은 영업일 1~2일 · 환불 계좌 대기)이고, 환불 실패는 결제 대행사가 실패를 돌려준 건입니다. 실패 건은 사유를 그대로 보여 주고 다시 시도하거나, 다른 방법으로 이미 돌려줬다면 수동 환불 완료 확인으로 닫습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '환불 실패가 1건이라도 있으면 탭에 경고 표시가 붙고 대시보드 환불 실패 카드에 올라가며 내부 수신자에게 바로 알림이 갑니다. 실패하면 자동으로 30분 간격 3회 다시 시도하고, 그래도 안 되면 사람에게 넘깁니다. 실패한 동안 주문은 취소 처리 중으로 보이고 고객에게는 취소 완료 알림이 가지 않습니다. 승인 뒤 3영업일이 넘도록 환불이 안 끝나면 환불 기한 임박으로 강조합니다(법정 환불 기한). 반품 환불의 실패도 같은 방식으로 반품 관리의 환불 실패 탭에 모입니다.'),
    Canvas({ label: 'A-15 · 환불 처리 중 탭 (기다리는 건 · 환불 계좌를 받아야 하는 건)' }, Page('환불 처리 중', FixedNote,
        ListHead({ total: 2, left: Chips(['전체 2', '은행 처리 중 1', '환불 계좌 없음 1'], '전체 2'), right: PerPage(50) }),
        Table({ check: true, cols: RF_COLS, rows: ING.map(rfRow) }),
        Note('은행 처리 중인 건은 완료 통보를 받으면 자동으로 취소 완료 탭으로 옮겨지고 고객에게 환불 안내가 갑니다. 따로 누를 것이 없습니다.'),
    )),
    Canvas({ label: 'A-15 · 환불 실패 탭 (탭에 경고 표시 · 사유 · 다시 시도 · 수동 환불 완료 확인)' }, Page('환불 실패', FixedNote,
        ListHead({ total: 1, left: Chips(['전체 1', '결제 취소 실패 1', '환불 기한 임박 0'], '전체 1'), right: PerPage(50) }),
        Table({ check: true, cols: RF_COLS, rows: FAILED.map(rfRow) }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '다시 시도 → 성공', right: '팝업만', pad: 20 },
            Modal({ title: '환불 다시 시도 · 20261110-000107', w: 500, foot: [Btn('닫기', 'primary')] },
                Text(`${Icon('check-circle-o')} 환불했습니다. 주문이 취소 완료로 바뀌었습니다.`, { b: true }),
                KV([['결제 취소', `${Badge('성공', 'check')} 신용카드 52,000원`], ['취소 번호', 'T2026111008550126-C1 · 11-11 10:42:19'], ['고객 알림', '취소 완료 · 환불 안내 발송 성공'], ['재고', `${O1} +1`]]),
            )),
        Canvas({ size: 'auto', label: '다시 시도 → 또 실패 (사유가 바뀜 · 할 수 있는 일 안내)', right: '팝업만', pad: 20 },
            Modal({ title: '환불 다시 시도 · 20261110-000107', w: 540, foot: [Btn('닫기'), Btn('수동 환불 완료 확인'), Btn('다시 시도', { kind: 'primary', icon: 'refresh' })] },
                Note('다시 시도했지만 환불하지 못했습니다.', { warn: true }),
                KV([['실패 사유', '<b>취소할 수 있는 금액을 넘었습니다.</b> 이 결제는 이미 49,000원이 취소되어 남은 금액이 3,000원입니다.'], ['짐작되는 원인', '결제 대행사 관리자 화면에서 누군가 직접 취소했을 수 있습니다.'], ['할 수 있는 일', '직접 취소한 것이 맞으면 수동 환불 완료 확인으로 기록하세요. 아니라면 결제 대행사 고객센터에 거래번호 T2026111008550126 으로 문의하세요.']], { wide: true }),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '수동 환불 완료 확인 → 팝업 (다른 방법으로 이미 돌려준 경우)', right: '팝업만', pad: 20 },
            Modal({ title: '수동 환불 완료 확인 · 20261110-000107', w: 560, foot: [Btn('취소'), Btn('기록하고 취소 완료로 변경', 'primary')] },
                Note('이 처리는 실제 돈을 움직이지 않습니다. 이미 고객에게 돌려준 것이 맞을 때만 누르세요.', { warn: true }),
                FormTable([
                    { k: '환불해야 할 금액', v: Text('<b>52,000원</b> · 최도윤') },
                    { k: '돌려준 방법', required: true, v: [Radio('결제 대행사 관리자 화면에서 직접 취소함', { on: true }), Radio('고객 계좌로 송금함'), Radio('적립금으로 줌 (고객 동의)')] },
                    { k: '돌려준 금액', required: true, v: Input({ value: '52,000', suffix: '원', w: 180 }) },
                    { k: '돌려준 날', required: true, v: Input({ value: '2026-11-11', icon: 'calendar', w: 180 }) },
                    { k: '메모', required: true, v: Input({ value: '결제 대행사 상담 뒤 관리자 화면에서 취소. 취소 번호 C-88120', w: 340 }), help: '처리 기록에 남습니다. 취소 번호나 송금 내역을 적어 두세요.' },
                    { k: '고객 알림', v: Check('취소 완료 · 환불 안내 보내기', { on: true }) },
                ]),
            )),
        Canvas({ size: 'auto', label: '입력 오류 (돌려준 금액이 다름)', right: '부분', pad: 20 }, `<div style="width:520px">${FormTable([{ k: '돌려준 금액', required: true, v: Input({ value: '49,000', suffix: '원', w: 180, error: true }), error: '환불해야 할 금액(52,000원)과 다릅니다. 3,000원이 모자랍니다. 금액이 맞는지 확인하고, 일부만 돌려줬다면 나머지를 돌려준 뒤 기록하세요.' }])}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '실패 사유별 문구와 운영자가 할 일 (결제 대행사가 돌려준 사유를 운영자 말로 바꿈)', right: '문구 표', pad: 20 }, `<div style="width:1000px">${Table({ dense: true, cols: [{ t: '사유', w: 220 }, '화면 문구', { t: '먼저 할 일', w: 240 }], rows: [
            ['카드사·은행 점검 시간', '카드사 점검 시간입니다(23:30 ~ 00:30). 점검이 끝나면 자동으로 다시 시도합니다.', '기다리기 (자동 재시도)'],
            ['결제 대행사 응답 없음', '결제 대행사가 응답하지 않습니다. 30분 뒤 자동으로 다시 시도합니다.', '기다리기 · 계속되면 연결 상태 확인'],
            ['취소 가능 금액 초과', '취소할 수 있는 금액을 넘었습니다. 이미 다른 경로로 취소된 금액이 있습니다.', '수동 환불 완료 확인'],
            ['이미 취소된 거래', '이미 전액 취소된 결제입니다.', '수동 환불 완료 확인'],
            ['환불 계좌 오류', '환불 계좌로 보낼 수 없습니다(계좌 없음 · 예금주 다름 · 거래 정지).', '환불 계좌 다시 받기'],
            ['환불 기한 임박', '취소를 승인한 지 3영업일이 지났습니다. 오늘 안에 환불을 끝내 주세요.', '다시 시도 · 수동 환불'],
        ] })}</div>`),
    ),
    Canvas({ label: 'A-15 · 환불 실패 건이 없을 때 (탭에 경고 표시 없음)' }, Page('환불 실패', FixedNote, ListHead({ total: 0, right: PerPage(50) }),
        `<div class="wf-tablewrap">${Empty({ icon: 'check-circle-o', title: '환불에 실패한 주문이 없습니다', desc: '결제 취소가 실패하면 여기에 나타나고 대시보드와 내부 알림으로 바로 알려 드립니다.' })}</div>`)),
);

const ssCancelRow = [`<u>2026111045790022</u><small>요청 11-11 08:02 · 2시간째</small>`, ChannelBadge('스마트스토어'), `${P}<small>${O2} · 1개</small>`, `정수아<small class="nw">0504-****-9015</small>`, '<b>다른 상품으로 재주문</b><small>4박스 구성으로 다시 주문했습니다.</small>', '93,000원<small>네이버페이</small>', OrderBadge('배송준비'), `${Btn('승인', { size: 'sm', kind: 'primary' })} ${Btn('발송으로 철회', { size: 'sm' })}`];

const withdrawForm = (o = {}) => FormTable([
    { k: '대상', v: Text(`${ChannelBadge('스마트스토어')} 정수아 · ${P} ${O2} 1개 · 취소 요청 11-11 08:02`) },
    { k: '택배사', required: true, v: o.courier || Select({ value: 'CJ대한통운', w: 200 }) },
    { k: '송장번호', required: true, v: Input({ value: o.inv === undefined ? '581233441420' : o.inv, placeholder: '숫자 12자리', w: 220, error: !!o.err, focus: o.inv === '' }), error: o.err, help: o.err ? undefined : '실제로 택배사에 넘긴 송장번호만 넣으세요. 발송하지 않고 번호만 넣으면 네이버 벌점 대상입니다.' },
    { k: '고객에게 남길 말', v: Textarea({ value: o.msg === undefined ? '요청하신 시점에 이미 상품이 출고되어 취소가 어렵습니다. 받으신 뒤 반품을 신청해 주세요.' : o.msg, placeholder: '네이버 주문 내역에 함께 전달됩니다 (선택)', h: 60, count: o.msg === '' ? '0 / 200' : '48 / 200' }) },
]);

const state7 = StateBlock({ idx: 7, title: '스마트스토어 주문 거부(발송 처리로 취소 철회)', note: '스마트스토어 취소 요청을 받아 줄 수 없을 때. 네이버에는 취소 거부 처리가 따로 없어, 송장을 넣어 발송 처리하면 취소 요청이 철회됩니다. 그래서 거부 버튼 대신 발송으로 철회 버튼이 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '자사몰 주문은 사유를 골라 거부하면 끝나지만, 스마트스토어는 판매자가 취소 요청을 거부하는 길이 발송 처리뿐입니다. 이미 포장해 택배사에 넘긴 주문이라면 송장을 등록해 발송 처리하고, 그러면 네이버가 취소 요청을 철회하고 고객에게 알립니다. 운영자가 자사몰과 같은 거부 팝업을 기대하고 헤매지 않도록, 스마트스토어 요청 줄에는 처음부터 다른 버튼과 다른 팝업을 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '택배사와 송장번호가 필수입니다(자사몰 거부는 사유가 필수). 실제로 발송하지 않으면서 철회만 하려고 송장을 넣으면 안 된다고 팝업에서 분명히 말합니다. 아직 발송 전이라면 철회할 수 없고 승인해야 합니다. 발송으로 철회하면 이 주문은 취소 관리에서 빠지고 배송중이 되며, 네이버 전송에 실패하면 우리 쪽 상태도 바꾸지 않습니다(둘이 어긋나지 않게). 고객 안내는 네이버가 보냅니다.'),
    Canvas({ label: 'A-15 · 취소 요청 탭 · 스마트스토어 요청 줄 (거부 대신 발송으로 철회 버튼)' }, Page('취소 요청', Search(), ReqHead(), ReqList(),
        Note('스마트스토어 요청은 승인 또는 발송으로 철회만 할 수 있습니다. 네이버에는 취소 거부 처리가 없습니다.'),
    )),
    Canvas({ label: 'A-15 · 발송으로 철회 버튼 → 팝업 (택배사 · 송장번호 필수)' }, Overlay({ bg: Page('취소 요청', Search(), ReqHead(), ReqList()), h: 700 },
        Modal({ title: '발송 처리로 취소 철회 · 2026111045790022', w: 620, foot: [Btn('닫기'), Btn('발송 처리하고 취소 철회', 'primary')] },
            Note('스마트스토어는 취소 요청을 거부하는 처리가 따로 없습니다. 송장을 등록해 발송 처리하면 네이버가 고객의 취소 요청을 철회합니다.'),
            withdrawForm(),
            KV([['처리 뒤 주문 상태', `${OrderBadge('배송중')} · 취소 관리에서 빠지고 배송 현황에 나타남`], ['네이버 전송', '발송 처리(택배사 · 송장번호)가 네이버로 전송됩니다'], ['고객 안내', '네이버가 취소 요청 철회와 발송을 고객에게 알립니다 (우리 알림톡은 나가지 않음)']], { wide: true }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '택배사 고르는 중 · 송장 입력 전 (버튼 비활성)', right: '팝업만', pad: 20 },
            Modal({ title: '발송 처리로 취소 철회 · 2026111045790022', w: 620, foot: [Btn('닫기'), Btn('발송 처리하고 취소 철회', { kind: 'primary', disabled: true })] },
                withdrawForm({ inv: '', msg: '', courier: Select({ value: 'CJ대한통운', w: 200, open: true, search: '', options: [{ t: 'CJ대한통운', sub: '기본', on: true }, '한진택배', '롯데택배', '우체국택배', '로젠택배'] }) }))),
        Canvas({ size: 'auto', label: '입력 오류 (송장번호 자릿수)', right: '팝업만', pad: 20 },
            Modal({ title: '발송 처리로 취소 철회 · 2026111045790022', w: 620, foot: [Btn('닫기'), Btn('발송 처리하고 취소 철회', { kind: 'primary', disabled: true })] },
                withdrawForm({ inv: '5812334414', err: 'CJ대한통운 송장번호는 숫자 12자리입니다. (지금 10자리)' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '아직 발송하지 않은 주문에서 눌렀을 때 (철회할 수 없음 → 승인으로)', right: '팝업만', pad: 20 }, Confirm({ w: 460, title: '아직 발송하지 않은 주문입니다', desc: '스마트스토어 취소 요청은 실제로 발송한 주문만 철회할 수 있습니다.<br>아직 포장 전이라면 취소를 승인해 주세요. 단순 변심 취소를 발송으로 막으면 네이버 판매자 벌점을 받을 수 있습니다.', foot: [Btn('닫기'), Btn('취소 승인으로', 'primary')] })),
        Canvas({ size: 'auto', label: '철회 성공 (네이버 전송 완료)', right: '팝업만', pad: 20 },
            Modal({ title: '발송 처리로 취소 철회 · 2026111045790022', w: 500, foot: [Btn('배송 현황에서 보기'), Btn('닫기', 'primary')] },
                Text(`${Icon('check-circle-o')} 발송 처리했습니다. 취소 요청이 철회되었습니다.`, { b: true }),
                KV([['네이버 전송', `${Badge('성공', 'check')} 11-11 10:48:02`], ['송장', 'CJ대한통운 581233441420'], ['주문 상태', `${OrderBadge('배송중')}`], ['취소 요청', '철회됨 · 거부 탭에 발송으로 철회로 남음']]),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '네이버 전송 실패 (우리 쪽 상태도 바꾸지 않음 · 다시 보내기)', right: '팝업만', pad: 20 },
            Modal({ title: '발송 처리로 취소 철회 · 2026111045790022', w: 540, foot: [Btn('닫기'), Btn('다시 보내기', { kind: 'primary', icon: 'refresh' })] },
                Note('네이버로 전송하지 못했습니다. 주문은 아직 취소 요청 상태입니다.', { warn: true }),
                KV([['실패 사유', '고객이 방금 네이버에서 취소 요청을 거두었습니다. 주문을 다시 가져온 뒤 발주 확인·발송 처리에서 송장을 등록하세요.'], ['다른 사유 예', '네이버 응답 없음 → 잠시 뒤 다시 보내기 / 이미 취소 완료된 주문 → 철회할 수 없음(택배 회수 필요)']], { wide: true }),
            )),
        Canvas({ size: 'auto', label: '거부 탭에 남는 모습 (자사몰 거부와 구분)', right: '기록 한 줄', pad: 20 }, `<div style="width:760px">${Table({ dense: true, cols: [{ t: '주문번호 · 일시', w: 150 }, { t: '채널', w: 100 }, { t: '주문자', w: 60 }, '거부 사유', { t: '처리한 사람', w: 80 }, { t: '지금 상태', w: 80 }, { t: '고객 알림', w: 110 }], rows: [['<u>2026111045790022</u><small>11-11 10:48</small>', ChannelBadge('스마트스토어'), '정수아', `${Badge('발송으로 철회', 'bold')} CJ대한통운 581233441420`, '이보림', OrderBadge('배송중'), '<small>네이버가 안내</small>']] })}</div>`),
    ),
);

export default function A15() {
    return [state1, state2, state3, state4, state5, state6, state7].join('');
}
