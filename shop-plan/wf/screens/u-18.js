import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, OrderBadge, Box, KV, Note, Text, Empty, Thumb, Icon, Overlay, Modal, BottomSheet, Toast,
    Stepper, Timeline, Tabs, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const [O1, O2] = SHOP.options.map((o) => o.name);
const STAGES = ['집화', '이동 중', '배송 출발', '배송완료'];

const bgCard = (st, msg, btns) => Box({ title: '2026-11-07 주문', sub: '주문번호 20261107-000088' },
    `<div style="display:flex;gap:14px;align-items:center">${Thumb(64)}<div style="flex:1;font-size:13px"><div style="margin-bottom:5px">${OrderBadge(st)} <span style="color:var(--ink2);font-size:12.5px">${msg}</span></div><b>${P}</b><div style="color:var(--mute);font-size:12.5px">${O2} · 1개 · 93,000원(예시)</div></div><div style="display:flex;flex-direction:column;gap:6px;width:124px">${btns.map((b) => Btn(b, { size: 'sm', block: true })).join('')}</div></div>`);

const pcBg = (st = '배송중', msg = 'CJ대한통운 581233441201 · 11-12(목) 도착 예정', btns = ['배송 조회']) => MypageLayout({ active: '주문 목록', title: '주문 목록', crumb: ['홈', '마이페이지', '주문 목록'] }, bgCard(st, msg, btns), bgCard(st, msg, btns), bgCard(st, msg, btns));
const mBg = () => MobilePage({ title: '주문 목록', tab: '마이' }, Text('2026-11-07 · 20261107-000088', { sm: true, mute: true }), Box({}, `${OrderBadge('배송중')}<div style="margin-top:8px;font-size:13px"><b>${SHOP.productShort}</b><br>${O2} · 1개</div>`), Btn('배송 조회', { block: true }));

const Item = (opt = O2, qty = 1) => `<div style="display:flex;gap:10px;align-items:center;padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid var(--line2)">${Thumb(48)}<div style="font-size:13px"><b>${P}</b><div style="color:var(--mute);font-size:12.5px">${opt} · ${qty}개 · 주문번호 20261107-000088</div></div></div>`;

const Invoice = (o = {}) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px 14px;margin-bottom:16px;font-size:13.5px"><div style="display:flex;align-items:center;gap:8px"><span style="color:var(--mute);width:64px;flex:none;white-space:nowrap">택배사</span><b>${o.courier || 'CJ대한통운'}</b><span style="color:var(--mute);font-size:12.5px">${o.tel || '고객센터 1588-1255'}</span></div><div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap"><span style="color:var(--mute);width:64px;flex:none;white-space:nowrap">송장번호</span><b style="letter-spacing:.5px">${o.no || '581233441201'}</b>${Btn(o.copied ? '복사됨' : '복사', { size: 'sm', icon: o.copied ? 'check-min' : 'documents-o' })}<span style="margin-left:auto;font-size:12.5px;color:var(--ink2);white-space:nowrap">택배사 사이트에서 보기${Icon('external-link')}</span></div>${o.eta ? `<div style="display:flex;align-items:center;gap:8px;margin-top:8px"><span style="color:var(--mute);width:64px;flex:none;white-space:nowrap">${o.etaLabel || '도착 예정'}</span><span>${o.eta}</span></div>` : ''}</div>`;

const TL_MOVING = [
    { t: '배송 출발', d: '서울 마포 상암 · 오늘 14~16시 도착 예정 · 배송기사 010-****-7702', time: '11-12 08:20', on: true },
    { t: '간선 하차', d: '서울 마포 서브터미널', time: '11-12 04:10' },
    { t: '간선 상차', d: '대전 허브터미널', time: '11-11 22:35' },
    { t: '집화 처리', d: '인천 제물포 집화점 · 보내는 분 이너에라', time: '11-11 17:02' },
    { t: '상품을 택배사에 넘겼습니다', d: '송장 등록 · 판매자 발송처리', time: '11-11 15:40' },
];
const TL_DONE = [{ t: '배송완료', d: '서울 마포 상암 · 문 앞에 두었습니다 · 받은 분 본인', time: '11-12 15:12', on: true }].concat(TL_MOVING.map((x) => ({ ...x, on: false })));

const MStep = (cur) => `<div style="display:flex;align-items:center;gap:4px;font-size:12px">${STAGES.map((t, i) => `<span style="white-space:nowrap;${i === cur ? 'font-weight:800;border-bottom:2px solid var(--dark)' : i < cur ? 'color:var(--ink2)' : 'color:var(--mute)'}">${i < cur ? Icon('check-min') : ''}${t}</span>`).join('<span style="flex:1;height:1px;background:var(--line)"></span>')}</div>`;

const body = (o = {}) => [
    Item(o.opt, o.qty),
    o.tabs || '',
    Invoice(o),
    o.m ? MStep(o.step === undefined ? 2 : o.step) : Stepper(STAGES, o.step === undefined ? 2 : o.step),
    '<div style="height:16px"></div>',
    Timeline(o.tl || TL_MOVING),
    Text('택배사가 알려 준 정보를 30분마다 받아 옵니다. 마지막 확인 11-12 09:00', { sm: true, mute: true }),
];

const state1 = StateBlock({ idx: 1, title: '배송중(단계 타임라인)', note: '주문 목록·주문 상세·마이페이지 홈·발송 알림톡의 배송 조회를 누르면 뜨는 팝업. 페이지를 옮기지 않습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '택배사 사이트로 내보내면 송장번호를 다시 붙여 넣어야 하고 몰을 떠나게 됩니다. 운영자가 송장을 넣는 순간부터 택배사 조회 결과를 우리 화면 안에서 4단계(집화 · 이동 중 · 배송 출발 · 배송완료)로 묶어 보여 주고, 아래에는 택배사가 준 세부 이력을 최신순으로 그대로 보여 줍니다. 가장 최근 줄만 굵게 표시합니다.'),
    Anno({ title: '유형별 분기' }, '한 주문을 나눠 보냈으면(부분 발송) 송장마다 탭이 생기고 탭 이름에 그 상자에 든 품목을 적습니다. 송장번호 복사는 누르면 버튼이 복사됨으로 바뀌고 아래 토스트가 2초 뜹니다. 택배사 고객센터 번호와 택배사 사이트 링크는 관리자 설정 > 배송 > 택배사에 등록된 값입니다. 모바일은 아래에서 올라오는 시트입니다.'),
    Canvas({ label: 'U-18 · 주문 목록 배송중 카드 → 배송 조회 버튼 → 팝업' }, Overlay({ bg: pcBg(), h: 800 },
        Modal({ title: '배송 조회', w: 520, foot: [Btn('닫기', 'primary')] }, body({ eta: '11-12(목) 14~16시 · 택배사 예상 시간이라 달라질 수 있습니다' })))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-18 · 모바일 · 배송 조회 버튼 → 바텀시트' }, Overlay({ bg: mBg(), align: 'bottom', h: 820 },
            BottomSheet({ title: '배송 조회', foot: [Btn('닫기', 'primary')] }, body({ m: true, eta: '11-12(목) 14~16시' })))),
        Canvas({ size: 'auto', label: '송장번호 복사 버튼을 누른 뒤 — 버튼 바뀜 + 토스트(2초)', right: '팝업만', pad: 20 },
            Modal({ title: '배송 조회', w: 520, foot: [Btn('닫기', 'primary')] },
                Item(), Invoice({ copied: true, eta: '11-12(목) 14~16시' }),
                `<div style="display:flex;justify-content:center;padding:8px 0 4px">${Toast('송장번호 581233441201 을 복사했습니다.')}</div>`)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '나눠 보낸 주문(부분 발송) — 송장별 탭', right: '팝업만', pad: 20 },
            Modal({ title: '배송 조회', w: 520, foot: [Btn('닫기', 'primary')] },
                Note('이 주문은 상자 2개로 나눠 보냈습니다. 상자마다 송장번호가 다릅니다.'),
                Tabs([{ t: `상자 1 · ${O1} 2개` }, { t: `상자 2 · ${O1} 1개` }], `상자 1 · ${O1} 2개`, { kind: 'box' }),
                '<div style="height:14px"></div>',
                Invoice({ no: '581233441240', eta: '11-13(금)' }),
                Stepper(STAGES, 1),
                '<div style="height:16px"></div>',
                Timeline([{ t: '간선 상차', d: '대전 허브터미널', time: '11-12 22:35', on: true }, { t: '집화 처리', d: '인천 제물포 집화점', time: '11-12 17:02' }]))),
        Canvas({ size: 'auto', label: '방금 발송 — 택배사가 아직 물건을 가져가기 전', right: '팝업만', pad: 20 },
            Modal({ title: '배송 조회', w: 520, foot: [Btn('닫기', 'primary')] },
                Item(), Invoice({}),
                Stepper(STAGES, -1),
                '<div style="height:16px"></div>',
                Timeline([{ t: '상품을 택배사에 넘길 준비를 마쳤습니다', d: '송장 등록 · 택배사가 가져가면 집화로 바뀝니다(보통 당일 저녁)', time: '11-11 15:40', on: true }]))),
    ),
);

const state2 = StateBlock({ idx: 2, title: '배송완료', note: '택배사 조회 결과가 배송완료로 바뀐 뒤. 품목 상태도 자동으로 배송완료가 됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '배송완료 뒤에 고객이 할 일은 받았는지 확인하고 구매확정하거나, 못 받았으면 알리는 것입니다. 그래서 어디에 두었는지(문 앞·경비실·직접 수령)를 맨 위에 크게 보여 주고, 팝업 아래에 구매확정과 상품을 못 받았어요(1:1 문의 작성으로, 주문이 연결된 채)를 둡니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '구매확정을 누르지 않아도 배송완료 7일 뒤 자동으로 확정됩니다(일수는 관리자 설정 > 주문·클레임 정책). 그 날짜를 팝업에 적어, 반품·교환은 그 전에 신청해야 한다는 것을 알립니다. 이미 구매확정한 주문에서 열면 구매확정 버튼 대신 리뷰 쓰기가 나옵니다.'),
    Canvas({ label: 'U-18 · 주문 목록 배송완료 카드 → 배송 조회 버튼 → 팝업' }, Overlay({ bg: pcBg('배송완료', '11-12(목) 도착 · 11-19(목)에 자동으로 구매확정됩니다', ['구매확정', '반품 신청', '교환 신청', '배송 조회']), h: 900 },
        Modal({ title: '배송 조회', w: 520, foot: [Btn('상품을 못 받았어요'), Btn('구매확정', 'primary')] },
            `<div style="display:flex;gap:10px;align-items:center;padding:12px 14px;background:var(--box);border-radius:6px;margin-bottom:14px;font-size:14px">${Icon('check-circle-o')}<div><b>11월 12일(목) 15:12 배송을 마쳤습니다</b><div style="font-size:12.5px;color:var(--ink2)">문 앞에 두었습니다 · 받은 분 본인</div></div></div>`,
            body({ step: 4, tl: TL_DONE, eta: '11-19(목) · 그 전까지 반품·교환을 신청할 수 있습니다', etaLabel: '자동 확정' })))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-18 · 모바일 · 배송완료' }, Overlay({ bg: mBg(), align: 'bottom', h: 820 },
            BottomSheet({ title: '배송 조회', foot: [Btn('못 받았어요'), Btn('구매확정', 'primary')] },
                `<div style="display:flex;gap:10px;align-items:center;padding:12px 14px;background:var(--box);border-radius:6px;margin-bottom:14px;font-size:13.5px">${Icon('check-circle-o')}<div><b>11-12(목) 15:12 배송완료</b><div style="font-size:12.5px;color:var(--ink2)">문 앞에 두었습니다</div></div></div>`,
                Invoice({ eta: '11-19(목)', etaLabel: '자동 확정' }),
                MStep(3),
                '<div style="height:16px"></div>',
                Timeline(TL_DONE.slice(0, 3))))),
        Canvas({ size: 'auto', label: '이미 구매확정한 주문에서 열었을 때 — 아래 버튼만 다름', right: '팝업만', pad: 20 },
            Modal({ title: '배송 조회', w: 520, foot: [Btn('닫기'), Btn('리뷰 쓰기', 'primary')] },
                Item(), Invoice({ eta: '11-19(목) 구매확정됨', etaLabel: '구매확정' }), Stepper(STAGES, 4),
                '<div style="height:16px"></div>',
                Timeline(TL_DONE.slice(0, 2)))),
    ),
    Canvas({ size: 'auto', label: '팝업의 구매확정 버튼 → 확인 (적립금 켠 몰)', right: '팝업만', pad: 20 },
        `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">상품을 잘 받으셨나요?</b><p>구매확정하면 반품·교환을 신청할 수 없습니다.<br>구매 적립금 930원이 바로 적립됩니다.</p></div><div class="mf">${Btn('아니요')}${Btn('구매확정', 'primary')}</div></div>`),
);

const failModal = (o) => Modal({ title: '배송 조회', w: 520, foot: o.foot || [Btn('닫기', 'primary')] }, Item(), o.invoice || '', Empty({ icon: o.icon || 'truck', title: o.title, desc: o.desc, action: o.action }));

const state3 = StateBlock({ idx: 3, title: '조회 불가(택배사 정보 없음)', note: '송장은 들어갔는데 단계를 보여 줄 수 없는 경우. 이유마다 문구와 다음 행동이 다릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '빈 팝업이나 오류 코드를 보여 주면 고객은 물건이 사라졌다고 생각하고 전화를 겁니다. 조회가 안 되는 이유를 세 가지로 나눠 고객이 할 수 있는 일을 알려 줍니다: ① 택배사 없이 보낸 주문(직접 전달·화물·퀵) ② 송장번호로 조회가 안 됨(잘못 입력했거나 택배사 반영 전) ③ 택배사 조회가 잠시 안 됨.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '② 가 발송 후 하루 넘게 이어지면 관리자 배송 현황의 배송 추적 실패 건에 올라가 운영자가 송장을 고칩니다. 고객 화면에는 운영자에게 알렸다는 말을 넣습니다. 송장번호가 있으면 어느 경우든 번호와 복사 버튼, 택배사 사이트 링크는 보여 줍니다.'),
    Canvas({ label: 'U-18 · 배송 조회 버튼 → 택배사 정보가 없는 주문 (운영자가 직접 배송으로 발송처리)' }, Overlay({ bg: pcBg('배송중', '판매자가 직접 배송합니다 · 11-11 발송', ['배송 조회']), h: 560 },
        failModal({ title: '택배사 조회를 할 수 없는 배송입니다', desc: '이 주문은 판매자가 택배사를 거치지 않고 직접 보냈습니다(11-11 발송).<br>도착 일정은 고객센터 070-****-1234 (평일 10:00 ~ 17:00)로 문의해 주세요.', action: [Btn('전화하기', { icon: 'call' }), Btn('1:1 문의 남기기', 'primary')] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '송장번호로 조회되지 않음 (발송 직후 · 번호 오류)', right: '팝업만', pad: 20 },
            failModal({ icon: 'search', invoice: Invoice({}), title: '아직 택배사에서 조회되지 않습니다', desc: '송장번호가 택배사에 등록되기까지 발송 후 반나절쯤 걸릴 수 있습니다.<br>11-12(목) 저녁까지도 조회되지 않으면 판매자가 확인하도록 자동으로 알립니다.', action: [Btn('다시 조회', { icon: 'refresh' })] })),
        Canvas({ size: 'auto', label: '택배사 조회가 일시적으로 안 됨', right: '팝업만', pad: 20 },
            failModal({ icon: 'warning', invoice: Invoice({}), title: '지금은 배송 정보를 가져올 수 없습니다', desc: '택배사 조회가 잠시 원활하지 않습니다. 잠시 뒤 다시 조회하거나 택배사 사이트에서 송장번호로 확인해 주세요.<br>마지막으로 확인한 단계: 이동 중 (11-11 22:35 대전 허브터미널)', action: [Btn('다시 조회', { icon: 'refresh' }), Btn('택배사 사이트에서 보기', { iconRight: 'external-link' })] })),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-18 · 모바일 · 조회되지 않음' }, Overlay({ bg: mBg(), align: 'bottom', h: 720 },
            BottomSheet({ title: '배송 조회', foot: [Btn('닫기', 'primary')] },
                Invoice({}),
                Empty({ icon: 'search', title: '아직 택배사에서 조회되지 않습니다', desc: '발송 후 반나절쯤 걸릴 수 있습니다. 11-12(목) 저녁까지 조회되지 않으면 판매자에게 자동으로 알립니다.', action: [Btn('다시 조회', { icon: 'refresh' })] })))),
        Canvas({ size: 'auto', label: '아직 발송 전(배송준비)인 품목에서 주소로 직접 들어온 경우', right: '팝업만', pad: 20 },
            failModal({ icon: 'package', title: '아직 발송 전입니다', desc: '판매자가 상품을 준비하고 있습니다. 발송하면 알림톡으로 송장번호를 보내 드립니다.<br>발송 예정 11-13(금)까지' })),
    ),
);

export default function U18() {
    return [state1, state2, state3].join('');
}
