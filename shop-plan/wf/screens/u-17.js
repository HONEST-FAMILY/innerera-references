import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, OrderBadge, Box, KV, Note, Text, Empty, Thumb, Icon, Overlay, Modal, Confirm, Toast,
    Timeline, Tabs, Chips, Select, Input, Field, Pager, PriceSummary, Grid, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const PS = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const FLOW = {
    취소: ['취소 요청', '취소완료'],
    반품: ['반품 요청', '수거중', '검수중', '환불완료'],
    교환: ['교환 요청', '수거중', '재발송', '교환완료'],
};

const Steps = (list, cur, m) => `<div style="display:flex;align-items:center;gap:6px;font-size:12.5px;flex-wrap:wrap">${list.map((s, i) => `<span style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;${i === cur ? 'font-weight:800;color:var(--ink)' : i < cur ? 'color:var(--ink2)' : 'color:var(--mute)'}"><span style="width:17px;height:17px;border-radius:50%;border:1.5px solid ${i <= cur ? 'var(--dark)' : 'var(--line)'};background:${i === cur ? 'var(--dark)' : '#fff'};display:inline-flex;align-items:center;justify-content:center;font-size:10.5px;color:${i === cur ? '#fff' : 'inherit'}">${i < cur ? Icon('check-min') : i + 1}</span>${s}</span>`).join(`<span style="width:${m ? 8 : 32}px;height:1px;background:var(--line)"></span>`)}</div>`;

const Rejected = (type) => `<div style="display:flex;align-items:center;gap:8px;font-size:12.5px"><span style="color:var(--ink2)">${type} 요청</span><span style="width:32px;height:1px;background:var(--line)"></span>${Badge(`${type} 거부`, 'x')}<span style="color:var(--mute)">원래 상태(배송완료)로 돌아갔습니다</span></div>`;

const CLAIMS = [
    { type: '반품', at: '11-11', cno: 'R20261111-0012', no: '20261103-000052', opt: O1, qty: 1, badge: '반품요청', cur: 0, msg: '판매자가 신청 내용을 확인하고 있습니다. 영업일 1~2일 안에 회수 일정을 알림톡으로 알려 드립니다.', sub: '사유 단순 변심 · 판매자 회수 요청 · 환불 예정 46,000원(반품 배송비 3,000원 차감)', btns: ['신청 철회', '상세 보기'] },
    { type: '반품', at: '11-09', cno: 'R20261109-0007', no: '20261025-000291', opt: O2, qty: 1, badge: '수거중', cur: 1, msg: 'CJ대한통운 기사님이 11-12(목)에 방문합니다. 상품을 받은 상자에 다시 담아 문 앞에 두세요.', sub: '사유 상품 불량 · 회수 송장 681200457731 · 환불 예정 93,000원(반품 배송비 판매자 부담)', btns: ['회수 조회', '상세 보기'] },
    { type: '반품', at: '11-08', cno: 'R20261108-0004', no: '20261030-000336', opt: O1, qty: 1, badge: '반품요청', cur: 0, msg: '직접 보내기를 고르셨습니다. 11-15(일)까지 상품을 보내고 택배사와 송장번호를 알려 주세요.', sub: '사유 단순 변심 · 직접 발송 · 반품지 인천광역시 제물포구 방축로83번길 23, B동 3층 305호', btns: ['보낸 송장 입력', '신청 철회', '상세 보기'], hl: true },
    { type: '반품', at: '11-05', cno: 'R20261105-0003', no: '20261018-000233', opt: O1, qty: 1, badge: '수거완료', cur: 2, msg: '상품이 11-10(화) 판매자에게 도착해 상태를 확인하고 있습니다. 확인이 끝나면 영업일 3일 안에 환불합니다.', sub: '사유 단순 변심 · 환불 예정 46,000원', btns: ['상세 보기'] },
    { type: '반품', at: '10-30', cno: 'R20261030-0002', no: '20261012-000187', opt: O1, qty: 1, badge: '반품완료', cur: 3, msg: '11-06(금) 46,000원을 환불했습니다. 신용카드 취소는 카드사에 따라 3~5영업일 뒤 반영됩니다.', sub: '상품 금액 49,000원 - 반품 배송비 3,000원 · 신한카드 취소 · 돌려받은 적립금 0원', btns: ['환불 내역', '상세 보기'] },
    { type: '반품', at: '10-27', cno: 'R20261027-0001', no: '20261008-000141', opt: O1, qty: 1, badge: '거부', rejected: true, msg: '거부 사유: 포장을 뜯어 일부 드신 상품은 단순 변심으로 반품할 수 없습니다(식품). 보내 주신 상품은 11-02 다시 보내 드렸습니다.', sub: '거부 처리 10-31 · 다시 보낸 송장 CJ대한통운 581233440087', btns: ['1:1 문의하기', '상세 보기'] },
    { type: '취소', at: '11-11', cno: 'C20261111-0021', no: '20261109-000104', opt: O4, qty: 1, badge: '취소요청', cur: 0, msg: '이미 상품을 준비하고 있어 판매자가 승인해야 취소됩니다. 이미 발송했다면 취소가 거부될 수 있습니다.', sub: '사유 다른 구성으로 다시 주문 · 환불 예정 176,000원 · 카카오페이', btns: ['요청 철회', '상세 보기'] },
    { type: '취소', at: '10-28', cno: 'C20261028-0009', no: '20261028-000007', opt: O1, qty: 1, badge: '취소완료', cur: 1, msg: '10-28 49,000원을 환불했습니다. 신용카드 취소는 카드사에 따라 3~5영업일 뒤 반영됩니다.', sub: '결제완료 단계에서 바로 취소 · 신한카드 취소', btns: ['환불 내역', '다시 담기'] },
    { type: '교환', at: '11-04', cno: 'E20261104-0002', no: '20261022-000270', opt: O2, qty: 1, badge: '재발송', cur: 2, msg: '교환 상품을 11-10(화) 보냈습니다. CJ대한통운 581233441377 · 11-12(목) 도착 예정', sub: '사유 상품 불량(포장 파손) · 같은 구성으로 교환 · 교환 배송비 판매자 부담', btns: ['배송 조회', '상세 보기'] },
];

const Card = (c) => `<div style="border:1px solid var(--line);border-radius:6px;margin-bottom:12px;background:#fff${c.hl ? ';border-left:4px solid var(--dark)' : ''}"><div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid var(--line2);font-size:13px">${Badge(c.type, 'bold')}<b>2026-${c.at} 신청</b><span style="color:var(--mute);font-size:12.5px">접수번호 ${c.cno} · 주문번호 ${c.no}</span><span style="margin-left:auto">${OrderBadge(c.badge)}</span></div><div style="display:flex;gap:14px;padding:14px 16px">${Thumb(64)}<div style="flex:1;min-width:0;font-size:13px"><b>${P}</b><div style="color:var(--mute);font-size:12.5px;margin-bottom:10px">${c.opt} · ${c.qty}개</div>${c.rejected ? Rejected(c.type) : Steps(FLOW[c.type], c.cur)}<div style="margin-top:10px;font-size:13px">${c.msg}</div><div style="margin-top:3px;font-size:12.5px;color:var(--mute)">${c.sub}</div></div><div style="display:flex;flex-direction:column;gap:6px;width:124px;flex:none">${c.btns.map((b, i) => Btn(b, { size: 'sm', block: true, kind: i === 0 && c.hl ? 'primary' : 'line' })).join('')}</div></div></div>`;

const CardM = (c) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:10px;background:#fff"><div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--mute);margin-bottom:8px">${Badge(c.type, 'bold')}<span>${c.at} 신청</span><span style="margin-left:auto">${OrderBadge(c.badge)}</span></div><div style="display:flex;gap:10px;margin-bottom:10px">${Thumb(52)}<div style="font-size:13px"><b>${PS}</b><div style="color:var(--mute);font-size:12px">${c.opt} · ${c.qty}개</div></div></div>${c.rejected ? Badge(`${c.type} 거부`, 'x') : Steps(FLOW[c.type], c.cur, true)}<div style="font-size:12.5px;margin:8px 0">${c.msg}</div><div style="display:flex;gap:6px">${c.btns.slice(0, 2).map((b) => `<div style="flex:1">${Btn(b, { size: 'sm', block: true })}</div>`).join('')}</div></div>`;

const TABS = [{ t: '전체', n: 9 }, { t: '취소', n: 2 }, { t: '반품', n: 6 }, { t: '교환', n: 1 }];
const Head = (tab = '전체') => [
    Tabs(TABS, tab),
    `<div style="display:flex;align-items:center;gap:12px;margin:14px 0">${Chips(['최근 3개월', '6개월', '1년', '직접 입력'], '최근 3개월')}<span style="margin-left:auto">${Select({ value: '진행 상태 전체', w: 150 })}</span></div>`,
];

const listPage = (cards, tab) => MypageLayout({ active: '취소·반품·교환 내역', title: '취소·반품·교환 내역', crumb: ['홈', '마이페이지', '취소·반품·교환 내역'] },
    Head(tab), cards.map(Card), Note('금액은 예시 값입니다(판매가 미확정).'), Pager({ page: 1, last: 1 }));

const detail = MypageLayout({ active: '취소·반품·교환 내역', title: '반품 상세', crumb: ['홈', '마이페이지', '취소·반품·교환 내역', '반품 상세'] },
    `<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;font-size:13.5px">${OrderBadge('수거중')}<b>접수번호 R20261109-0007</b><span style="color:var(--mute)">2026-11-09 14:22 신청 · 주문번호 <u>20261025-000291</u></span></div>`,
    Box({}, Steps(FLOW.반품, 1), '<div style="height:12px"></div>', Text('CJ대한통운 기사님이 11-12(목)에 방문합니다. 상품을 받은 상자에 다시 담아 문 앞에 두세요.', { b: true })),
    Grid('minmax(0,1.3fr) minmax(0,1fr)',
        [
            Box({ title: '반품 상품' }, `<div style="display:flex;gap:12px;align-items:center">${Thumb(56)}<div style="font-size:13px"><b>${P}</b><div style="color:var(--mute);font-size:12.5px">${O2} · 1개 · 93,000원(예시)</div></div></div>`),
            Box({ title: '신청 내용' }, KV([
                ['사유', '상품 불량 · 스틱 2포가 터져서 왔습니다'],
                ['첨부 사진', `<span style="display:inline-flex;gap:6px">${Thumb(48)}${Thumb(48)}</span>`],
                ['회수 방법', '판매자 회수 요청'],
                ['회수지', '김민지 · 010-****-1234<br>서울 마포구 월드컵북로 *** (문 앞에 두겠습니다)'],
                ['회수 송장', `CJ대한통운 681200457731 ${Btn('회수 조회', { size: 'sm' })}`],
            ])),
            Box({ title: '진행 기록' }, Timeline([
                { t: '수거중', d: '택배사에 회수를 접수했습니다 · 방문 예정 11-12(목)', time: '11-10 10:05', on: true },
                { t: '반품 승인', d: '판매자가 신청을 확인했습니다 · 반품 배송비 판매자 부담', time: '11-10 09:48' },
                { t: '반품 요청', d: '마이페이지에서 신청', time: '11-09 14:22' },
            ])),
        ],
        [
            PriceSummary({ title: '환불 예정 금액', rows: [['상품 금액', '93,000원'], ['반품 배송비', '0원', '상품 불량 — 판매자 부담'], ['돌려받는 쿠폰', '없음'], ['돌려받는 적립금', '0원']], total: ['환불 예정 금액', '93,000원'], note: '환불 수단 신용카드(신한) 취소 · 판매자가 상품을 확인한 뒤 영업일 3일 안에 환불합니다. 금액은 예시입니다.' }),
            Box({ flat: true, title: '도움이 필요하신가요' }, Text('기사님이 오지 않았거나 일정을 바꾸려면 고객센터 070-****-1234 또는 1:1 문의로 알려 주세요.', { sm: true }), Btn('1:1 문의하기', { size: 'sm' })),
        ],
    ),
    `<div class="wf-btnrow center" style="margin-top:8px">${Btn('목록으로')}</div>`,
);

const state1 = StateBlock({ idx: 1, title: '진행 단계별(요청·수거중·검수중·환불완료·거부(사유))', note: '마이페이지 > 취소·반품·교환 내역. 신청 1건이 카드 1장이고, 단계마다 안내 문장과 버튼이 다릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '신청한 뒤 고객이 궁금한 것은 지금 어느 단계이고, 내가 할 일이 있는지, 돈이 언제 얼마 들어오는지입니다. 그래서 카드마다 단계 줄(지나온 단계 체크 · 현재 단계 굵게) + 지금 상황 한 문장 + 그 단계에서만 가능한 버튼을 둡니다. 고객이 직접 해야 할 일이 있는 카드(직접 발송 송장 입력)는 왼쪽에 굵은 띠를 붙이고 버튼을 강조합니다.'),
    Anno({ title: '단계별 버튼' }, '반품 요청: 신청 철회 가능(판매자가 회수를 접수하기 전까지) / 수거중: 회수 조회(U-18 과 같은 팝업, 철회 불가) / 검수중: 버튼 없음 / 환불완료: 환불 내역 / 거부: 사유 표시 + 1:1 문의. 취소 요청(배송준비 단계)도 승인 전까지 철회할 수 있습니다. 교환은 수거 뒤 재발송 단계에서 배송 조회가 나옵니다. 고객 화면의 검수중은 관리자의 수거완료 상태와 같습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '거부된 신청은 사유를 반드시 문장으로 보여 주고(관리자 거부 팝업의 사유가 그대로 나옴), 품목이 원래 상태로 돌아갔다는 것과 보낸 상품을 어떻게 돌려주는지를 적습니다. 환불완료 카드에는 실제 환불 금액·차감 내역·환불 수단·반영까지 걸리는 기간을 적습니다.'),
    Canvas({ label: 'U-17 · 전체 탭 · 반품 6건(요청 · 수거중 · 직접 발송 송장 입력 필요 · 검수중 · 환불완료 · 거부)' }, listPage(CLAIMS.slice(0, 6))),
    Canvas({ label: 'U-17 · 취소(요청 = 승인 대기 · 취소완료) + 교환(재발송) 카드 — 같은 목록의 이어지는 부분' }, listPage(CLAIMS.slice(6))),
    Canvas({ label: 'U-17 · 카드의 상세 보기 → 반품 상세 (수거중)' }, detail),
    CanvasRow(
        Canvas({ size: 'auto', label: '반품 요청 카드 → 신청 철회 → 확인', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '반품 신청을 철회할까요?', desc: '철회하면 품목이 배송완료 상태로 돌아갑니다.<br>반품은 11-12(목)까지 다시 신청할 수 있고, 그 뒤에는 자동으로 구매확정됩니다.', ok: '신청 철회', foot: [Btn('닫기'), Btn('신청 철회', 'primary')] })),
        Canvas({ size: 'auto', label: '철회 뒤 토스트', right: '토스트만', pad: 20 }, Toast('반품 신청을 철회했습니다. 주문은 배송완료 상태로 돌아갔습니다.', { action: '주문 보기' })),
        Canvas({ size: 'auto', label: '이미 회수가 접수돼 철회할 수 없을 때', right: '토스트만', pad: 20 }, Toast('이미 택배사에 회수를 접수해 철회할 수 없습니다. 기사님께 반품하지 않겠다고 말씀해 주시거나 고객센터로 알려 주세요.', { kind: 'error' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '직접 발송 카드 → 보낸 송장 입력 → 팝업 (택배사 목록 열림)', right: '팝업만', pad: 20 },
            Modal({ title: '보낸 송장 입력', w: 460, foot: [Btn('취소'), Btn('저장', { kind: 'primary', disabled: true })] },
                Note('반품지: 인천광역시 제물포구 방축로83번길 23, B동 3층 305호 · 이너에라 반품 담당 · 070-****-1234'),
                Field({ label: '택배사', required: true }, Select({ placeholder: '보낸 택배사를 고르세요', w: 400, open: true, search: '', options: ['CJ대한통운', '한진택배', '롯데택배', '우체국택배', '로젠택배', '편의점택배(GS25 · CU)', '기타(직접 입력)'] })),
                Field({ label: '송장번호', required: true }, Input({ placeholder: '숫자만 입력', w: 400 })))),
        Canvas({ size: 'auto', label: '보낸 송장 입력 — 입력 오류 · 입력 완료', right: '팝업만', pad: 20 },
            Modal({ title: '보낸 송장 입력', w: 460, foot: [Btn('취소'), Btn('저장', 'primary')] },
                Field({ label: '택배사', required: true }, Select({ value: '우체국택배', w: 400 })),
                Field({ label: '송장번호', required: true, error: '우체국택배 송장번호는 숫자 13자리입니다. 영수증의 등기번호를 확인해 주세요.' }, Input({ value: '68120045', w: 400, error: true })),
                Field({ label: '배송비', help: '단순 변심 반품은 보내실 때 택배비를 선불로 내 주세요. 착불로 보내면 그 금액만큼 환불 금액에서 뺍니다.' }, `<div class="wf-inline"><span class="wf-radio on"><span class="dot"></span>선불로 보냈습니다</span><span class="wf-radio"><span class="dot"></span>착불로 보냈습니다</span></div>`),
                Toast('송장을 저장했습니다. 판매자에게 도착하면 검수를 시작합니다.'))),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-17 · 모바일 · 목록' }, MobilePage({ title: '취소·반품·교환 내역', tab: '마이' },
            Tabs(TABS, '전체'), '<div style="height:10px"></div>', Chips(['3개월', '6개월', '1년', '직접 입력'], '3개월'), '<div style="height:12px"></div>',
            [CLAIMS[1], CLAIMS[2], CLAIMS[5]].map(CardM))),
        Canvas({ size: 'mobile', label: 'U-17 · 모바일 · 반품 상세 (환불완료)' }, MobilePage({ title: '반품 상세', tab: false },
            `<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:13px">${OrderBadge('반품완료')}<b>R20261030-0002</b></div>`,
            Box({}, Steps(FLOW.반품, 3, true), '<div style="height:10px"></div>', Text('11-06(금) 46,000원을 환불했습니다.', { b: true }), Text('신용카드 취소는 카드사에 따라 3~5영업일 뒤 반영됩니다.', { sm: true, mute: true })),
            Box({ title: '반품 상품' }, `<div style="display:flex;gap:10px">${Thumb(52)}<div style="font-size:13px"><b>${PS}</b><div style="color:var(--mute);font-size:12px">${O1} · 1개</div></div></div>`),
            PriceSummary({ title: '환불 내역', rows: [['상품 금액', '49,000원'], ['반품 배송비', '-3,000원', '단순 변심 — 고객 부담(편도)'], ['돌려받은 적립금', '0원']], total: ['환불 금액', '46,000원'], note: '신한카드 취소 · 11-06 14:10 · 금액은 예시입니다' }),
            Box({ title: '진행 기록' }, Timeline([
                { t: '환불완료', d: '신한카드 취소 46,000원', time: '11-06 14:10', on: true },
                { t: '검수 완료', d: '상품 상태 이상 없음', time: '11-06 11:30' },
                { t: '수거 완료', d: '판매자 도착', time: '11-04 16:20' },
                { t: '반품 요청', time: '10-30 20:11' },
            ])))),
        Canvas({ size: 'mobile', label: 'U-17 · 모바일 · 거부된 반품 상세' }, MobilePage({ title: '반품 상세', tab: false, bottom: [Btn('1:1 문의하기', 'primary')] },
            `<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:13px">${OrderBadge('거부')}<b>R20261027-0001</b></div>`,
            Note('반품이 거부되어 품목이 배송완료 상태로 돌아갔습니다.', { warn: true }),
            Box({ title: '거부 사유', sub: '10-31 판매자 답변' }, Text('포장을 뜯어 일부 드신 상품은 단순 변심으로 반품할 수 없습니다(식품). 보내 주신 상품은 11-02 다시 보내 드렸습니다.'), Text('다시 보낸 송장 CJ대한통운 581233440087', { sm: true, mute: true }), Btn('배송 조회', { size: 'sm' })),
            Box({ title: '반품 상품' }, `<div style="display:flex;gap:10px">${Thumb(52)}<div style="font-size:13px"><b>${PS}</b><div style="color:var(--mute);font-size:12px">${O1} · 1개</div></div></div>`),
            Box({ title: '신청 내용' }, KV([['사유', '단순 변심'], ['회수 방법', '직접 발송'], ['신청일', '2026-10-27']])))),
    ),
);

const state2 = StateBlock({ idx: 2, title: '내역 없음', note: '취소·반품·교환을 신청한 적이 없거나, 고른 기간·탭에 해당 건이 없을 때.' },
    Anno({ title: '빈 상태' }, '신청은 이 화면이 아니라 주문 목록·주문 상세의 품목에서 시작합니다. 그래서 빈 상태 문구에 어디서 신청하는지를 적고 주문 목록으로 가는 버튼을 둡니다. 기간이나 탭 때문에 비어 보이는 경우는 문구가 다르고 기간을 넓히는 버튼을 줍니다.'),
    Canvas({ label: 'U-17 · 신청한 적 없음' }, MypageLayout({ active: '취소·반품·교환 내역', title: '취소·반품·교환 내역', crumb: ['홈', '마이페이지', '취소·반품·교환 내역'] },
        Tabs(TABS.map((t) => ({ ...t, n: 0 })), '전체'),
        Empty({ icon: 'exchange', title: '취소·반품·교환을 신청한 내역이 없습니다', desc: '취소·반품·교환은 주문 목록에서 해당 상품의 버튼으로 신청할 수 있습니다.<br>반품·교환은 상품을 받은 날부터 7일 안에 신청해 주세요.', action: '주문 목록으로' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '교환 탭 · 최근 3개월에는 없음 (다른 기간에는 있음)', right: '목록 자리만', pad: 20 },
            `<div style="width:560px">${Tabs(TABS, '교환')}${Empty({ icon: 'calendar', title: '최근 3개월 동안 신청한 교환이 없습니다', desc: '기간을 넓히면 지난 내역을 볼 수 있습니다.', action: [Btn('1년으로 넓혀 보기')] })}</div>`),
        Canvas({ size: 'mobile', label: 'U-17 · 모바일 · 내역 없음' }, MobilePage({ title: '취소·반품·교환 내역', tab: '마이' },
            Tabs(TABS.map((t) => ({ ...t, n: 0 })), '전체'),
            Empty({ icon: 'exchange', title: '신청한 내역이 없습니다', desc: '취소·반품·교환은 주문 목록에서 해당 상품의 버튼으로 신청할 수 있습니다.', action: '주문 목록으로' }))),
    ),
);

export default function U17() {
    return [state1, state2].join('');
}
