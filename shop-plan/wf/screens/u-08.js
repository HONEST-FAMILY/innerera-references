import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, BtnRow, Badge, Input, Select, Textarea, Check, Radio, Field,
    Stepper, Overlay, Modal, BottomSheet, Toast, Empty, ProductRow, PriceSummary, Box, KV, Note, Text, Icon, Flex, Pager, Tabs, Divider, SHOP,
} from '../lib/blocks.js';

const won = (n) => `${n.toLocaleString('ko-KR')}원`;
const ITEM = 93000;
const STEPS = ['장바구니', '주문서·결제', '주문 완료'];
const ADDR_HOME = '서울 마포구 월드컵북로 ***, 101동 1203호';
const ADDR_JEJU = '제주 제주시 연북로 ***, 2층';

const card = (on, inner, o = {}) => `<div style="border:${on ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:${on ? 13 : 14}px;margin-bottom:8px;background:${o.off ? 'var(--box)' : '#fff'};color:${o.off ? 'var(--mute)' : 'inherit'}">${inner}</div>`;
const link = (t) => `<u style="font-size:12.5px;color:var(--ink2);white-space:nowrap">${t}</u>`;
const row = (l, r) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">${l}<span style="flex:none">${r || ''}</span></div>`;

const ItemsBox = () => Box({ title: '주문 상품', sub: '1건' },
    ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' }),
);

const BuyerBox = () => Box({ title: '주문자', right: Btn('수정', { size: 'sm' }) },
    KV([['이름', '김민지'], ['휴대폰', '010-****-1234'], ['이메일', 'minji.kim@example.com']]),
);

const MEMO_OPTIONS = ['선택 안 함', '문 앞에 놓아 주세요', '경비실에 맡겨 주세요', '택배함에 넣어 주세요', '배송 전에 연락 주세요', '직접 입력'];
const Memo = (o = {}) => {
    if (o.open) return Select({ value: o.value || '', placeholder: '배송 요청사항을 선택해 주세요', w: 420, open: true, options: MEMO_OPTIONS.map((t) => ({ t, on: t === o.value })) });
    const sel = Select({ value: o.value || '', placeholder: '배송 요청사항을 선택해 주세요', w: 420 });
    return o.custom ? `${sel}<div style="margin-top:8px">${Textarea({ value: o.custom === true ? '' : o.custom, placeholder: '예: 공동현관 비밀번호 #1234, 부재 시 문 앞', h: 72, count: o.custom === true ? '0 / 50' : `${o.custom.length} / 50` })}</div>` : sel;
};

const ShipBox = (o = {}) => Box({ title: '배송지', right: Btn('배송지 변경', { size: 'sm' }) },
    `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><b>${o.name || '우리 집'}</b>${o.base === false ? '' : Badge('기본 배송지', 'bold')}${o.jeju ? Badge('제주·도서산간 추가 배송비', 'warn') : ''}</div>`,
    KV([['받는 분', o.to || '김민지'], ['연락처', o.tel || '010-****-1234'], ['주소', `(${o.zip || '03925'}) ${o.addr || ADDR_HOME}`]]),
    Divider(),
    Field({ label: '배송 요청사항', help: o.memoHelp }, Memo(o.memo || { value: '문 앞에 놓아 주세요' })),
    o.memo && o.memo.open ? '' : Field({ label: '공동현관 출입 방법', help: '선택 항목입니다. 택배 기사님에게만 전달됩니다.' }, Input({ value: o.gate || '', placeholder: '예: 공동현관 비밀번호 #1234, 경비실 호출', w: 420 })),
);

const CouponLine = (o = {}) => Field({ label: '쿠폰', help: o.help },
    Flex({ gap: 8, align: 'center' },
        Input({ value: o.value || '', placeholder: '적용한 쿠폰이 없습니다', w: 300, disabled: !o.value }),
        Btn(o.value ? '쿠폰 변경' : '쿠폰 선택', { kind: 'line' }),
        `<span style="font-size:12.5px;color:var(--mute)">사용할 수 있는 쿠폰 ${o.usable === undefined ? 1 : o.usable}장 · 보유 ${o.have === undefined ? 4 : o.have}장</span>`,
    ),
);
const PointLine = (o = {}) => Field({ label: '적립금', help: o.error ? undefined : (o.help || '보유 6,400원 · 5,000원 이상 보유하면 100원 단위로 쓸 수 있습니다.'), error: o.error },
    Flex({ gap: 8, align: 'center' },
        Input({ value: o.value || '', placeholder: '0', suffix: '원', w: 200, error: !!o.error, focus: o.focus, disabled: o.disabled }),
        Btn(o.all ? '사용 취소' : '전액 사용', { kind: 'line', disabled: o.disabled }),
        `<span style="font-size:12.5px;color:var(--mute)">보유 <b style="color:var(--ink)">${o.have || '6,400원'}</b></span>`,
    ),
);
const BenefitBox = (o = {}) => Box({ title: '할인·혜택' }, CouponLine(o.coupon || {}), PointLine(o.point || {}));

const PAY_ALL = ['신용·체크카드', '실시간 계좌이체', '가상계좌(무통장)', '카카오페이', '네이버페이', '토스페이'];
const PAY_ICON = { '신용·체크카드': 'credit-card', '실시간 계좌이체': 'exchange', '가상계좌(무통장)': 'receipt', 카카오페이: 'kakaotalk', 네이버페이: 'naver-square', 토스페이: 'wallet' };
const PayGrid = (active, list = PAY_ALL, cols = 3) => `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:8px">${list.map((p) => `<div style="border:${p === active ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:${p === active ? 12 : 13}px 12px;display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:${p === active ? 800 : 500}">${Radio('', { on: p === active })}${Icon(PAY_ICON[p])}<span>${p}</span></div>`).join('')}</div>`;
const PayBox = (o = {}) => Box({ title: '결제수단', sub: o.sub },
    PayGrid(o.active === undefined ? '신용·체크카드' : o.active, o.list, o.cols),
    o.extra || '',
    o.remember === false ? '' : `<div style="margin-top:12px">${Check('이 결제수단을 다음에도 사용', { on: true })}</div>`,
);

const AGREE_MEMBER = ['주문할 상품·가격·배송지를 확인했으며 결제에 동의합니다', '개인정보 제3자 제공 동의 (결제 대행사·택배사)'];
const AGREE_GUEST = ['주문할 상품·가격·배송지를 확인했으며 결제에 동의합니다', '비회원 개인정보 수집·이용 동의', '개인정보 제3자 제공 동의 (결제 대행사·택배사)'];
const Agree = (o = {}) => {
    const list = o.guest ? AGREE_GUEST : AGREE_MEMBER;
    const on = o.on || list.map(() => true);
    const all = on.every(Boolean);
    return `<div style="border:1px solid var(--line);border-radius:6px;padding:12px;font-size:13px">
<div style="padding-bottom:10px;border-bottom:1px solid var(--line2);margin-bottom:10px;font-weight:800">${Check('아래 내용에 모두 동의합니다', { on: all, part: !all && on.some(Boolean) })}</div>
${list.map((t, i) => `<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;padding:4px 0"><span class="wf-check${on[i] ? ' on' : ''}" style="white-space:normal;align-items:flex-start"><span class="box">${on[i] ? Icon('check-min') : ''}</span><span><b style="font-weight:600">(필수)</b> ${t}</span></span>${i === 0 ? '' : link('보기')}</div>`).join('')}
</div>`;
};

const Sum = (o = {}) => {
    const coupons = o.coupons || [];
    const point = o.point || 0;
    const jeju = o.jeju ? 3000 : 0;
    const disc = coupons.reduce((a, [, v]) => a + v, 0);
    const total = ITEM - disc - point + jeju;
    const earn = Math.floor((ITEM - disc - point) / 100);
    const rows = [
        ['상품 금액', won(ITEM)],
        ...coupons.map(([k, v]) => [k, `-${won(v)}`]),
        point ? ['적립금 사용', `-${won(point)}`] : null,
        ['배송비', jeju ? won(jeju) : '무료', jeju ? '기본 0원(3만원 이상 무료) + 제주·도서산간 추가 3,000원' : '3만원 이상 구매 무료배송'],
    ].filter(Boolean);
    const earnLine = o.guest
        ? `${Icon('gift-o')} 회원으로 주문하면 ${won(earn)}이 적립됩니다`
        : o.off ? '' : `${Icon('gift-o')} 구매확정 시 적립 예정 <b>${won(earn)}</b> (결제 금액의 1%)`;
    return PriceSummary({
        title: '결제 금액',
        rows,
        total: ['최종 결제 금액', won(total)],
        note: `${earnLine}${earnLine ? '<br>' : ''}금액은 예시입니다(판매가 미확정).`,
        action: [
            o.agree === false ? '' : Agree({ guest: o.guest, on: o.agreeOn }),
            Btn(`${won(total)} 결제하기`, { kind: 'primary', size: 'lg', block: true, disabled: !!o.reason }),
            o.reason ? `<p class="err" style="margin:0;justify-content:center">${Icon('error-o')}${o.reason}</p>` : '',
        ],
    });
};

const Page = (o, left, right) => UserPage({ loggedIn: !o.guest, cart: 1, title: '주문서·결제', footer: !!o.footer },
    Stepper(STEPS, 1),
    `<div style="display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:32px;align-items:start"><div>${[].concat(left).join('')}</div><div>${[].concat(right).join('')}</div></div>`,
);

const memberLeft = (o = {}) => [ItemsBox(), BuyerBox(), ShipBox(o.ship), BenefitBox(o.benefit), PayBox(o.pay)];
const COUPON_NEW = ['주문서 쿠폰 · 신규 가입 3,000원', 3000];
const baseBg = Page({}, memberLeft(), Sum());

const mSec = (title, right, ...body) => `<div style="border-bottom:8px solid var(--box);margin:0 -16px;padding:16px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b style="font-size:15px">${title}</b>${right || ''}</div>${body.join('')}</div>`;
const mPrice = (rows, total) => `${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--ink2)"><span>${k}</span><span>${v}</span></div>`).join('')}<div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--dark);margin-top:8px;padding-top:12px;font-weight:700"><span>최종 결제 금액</span><b style="font-size:19px">${total}</b></div>`;

const mobileMember = MobilePage({ title: '주문서·결제', tab: false, bottom: [Btn('93,000원 결제하기', 'primary')] },
    `<div style="margin-top:-16px">`,
    mSec('주문 상품 1건', '', ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' })),
    mSec('배송지', Btn('변경', { size: 'sm' }),
        `<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px"><b>우리 집</b>${Badge('기본 배송지', 'bold')}</div>`,
        Text('김민지 · 010-****-1234', { sm: true }), Text(`(03925) ${ADDR_HOME}`, { sm: true }),
        `<span class="wf-input select" style="width:100%"><span class="v">문 앞에 놓아 주세요</span>${Icon('angle-down-min')}</span>`),
    mSec('할인·혜택', '',
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13.5px"><span>쿠폰 <span style="color:var(--mute);font-size:12.5px">사용 가능 1장</span></span>${Btn('쿠폰 선택', { size: 'sm' })}</div>`,
        `<div style="display:flex;gap:8px;align-items:center;padding:6px 0;font-size:13.5px"><span style="flex:none">적립금</span><span class="wf-input" style="flex:1;width:auto"><span class="ph">0</span><span class="suf">원</span></span>${Btn('전액 사용', { size: 'sm' })}</div>`,
        Text('보유 6,400원 · 5,000원 이상 보유 시 100원 단위로 사용', { mute: true, sm: true })),
    mSec('결제수단', '', PayGrid('신용·체크카드', PAY_ALL, 2)),
    mSec('결제 금액', '', mPrice([['상품 금액', '93,000원'], ['배송비', '무료']], '93,000원'),
        Text(`${Icon('gift-o')} 구매확정 시 적립 예정 930원`, { mute: true, sm: true })),
    `<div style="padding:16px 0 0">${Agree()}</div></div>`,
);

const state1 = StateBlock({ idx: 1, title: '회원(기본 배송지 채워짐)', note: '로그인한 회원이 장바구니 또는 바로 구매에서 넘어온 첫 모습. 기본 배송지·주문자 정보·지난번 결제수단이 미리 채워져 있습니다.' },
    Anno({ title: '왜 이렇게 하나 · 초기값' }, '재구매 고객은 아무것도 입력하지 않고 결제 버튼만 누르면 끝나야 합니다. 초기값: 배송지 = 기본 배송지(없으면 새 배송지 입력칸이 펼쳐진 채로 시작), 배송 요청사항 = 선택 안 함(선택지 문구는 관리자 주문·클레임 정책에서 편집), 결제수단 = 지난번에 쓴 수단(처음이면 관리자 결제 설정의 첫 번째), 쿠폰·적립금 = 적용 안 함. 약관은 매 주문 다시 동의받습니다(초기값 체크 해제 — 이 캔버스는 동의를 마친 모습).'),
    Anno({ title: '기능 켜고 끄기 · 관리자가 바꾸는 범위' }, '쿠폰·적립금을 끈 몰은 할인·혜택 상자와 결제 금액 상자의 해당 줄, 적립 예정 문구가 통째로 사라집니다(아래 세 번째 캔버스). 무료배송 기준 금액·제주 도서산간 추가 배송비는 설정 > 배송, 적립률은 혜택 > 적립금, 결제수단 종류는 설정 > 결제에서 바꿉니다. 금액 상자에서 값이 0원인 할인 줄은 숨깁니다. 오른쪽 결제 금액 상자는 PC 에서 스크롤을 따라 붙어 다니고, 모바일은 맨 아래 결제 버튼만 고정됩니다.'),
    Canvas({ label: 'U-08 · 회원 주문서 첫 모습 (약관 동의 마침)' }, Page({ footer: true }, memberLeft({ ship: { memo: { value: '' } } }), Sum())),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-08 · 모바일 회원 주문서 (금액 상자가 아래로, 결제 버튼 고정)' }, mobileMember),
        Canvas({ size: 'auto', label: '배송 요청사항 select 를 연 모습', right: '배송지 상자만', pad: 20 }, `<div style="width:560px;min-height:300px">${ShipBox({ memo: { open: true, value: '문 앞에 놓아 주세요' } })}</div>`),
        Canvas({ size: 'auto', label: "'직접 입력'을 고른 뒤 (50자까지)", right: '배송지 상자만', pad: 20 }, `<div style="width:560px">${ShipBox({ memo: { value: '직접 입력', custom: '공동현관 비밀번호 #1234, 부재 시 문 앞에 놓아 주세요' }, memoHelp: '택배 송장에 그대로 인쇄됩니다. 50자까지 쓸 수 있습니다.' })}</div>`),
    ),
    Canvas({ label: 'U-08 · 쿠폰·적립금 기능을 끈 몰 (할인·혜택 상자 없음, 금액 상자에 할인·적립 줄 없음)' }, Page({}, [ItemsBox(), BuyerBox(), ShipBox(), PayBox()], Sum({ off: true }))),
);

const ADDRS = [
    { name: '우리 집', base: true, to: '김민지', tel: '010-****-1234', zip: '03925', addr: ADDR_HOME },
    { name: '회사', to: '김민지', tel: '010-****-1234', zip: '13494', addr: '경기 성남시 분당구 판교역로 ***, 8층 경영지원팀' },
    { name: '부모님 댁', to: '김영숙', tel: '010-****-7730', zip: '63122', addr: ADDR_JEJU, jeju: true },
];
const AddrCard = (a, on) => card(on, `${row(`<span style="display:flex;gap:8px;align-items:center">${Radio('', { on })}<b>${a.name}</b>${a.base ? Badge('기본 배송지', 'bold') : ''}${a.jeju ? Badge('제주·도서산간 +3,000원', 'warn') : ''}</span>`, `${link('수정')} &nbsp; ${a.base ? '' : link('삭제')}`)}
<div style="padding:8px 0 0 25px;font-size:13px;color:var(--ink2)">${a.to} · ${a.tel}<br>(${a.zip}) ${a.addr}</div>`);
const AddrList = (sel) => [
    ADDRS.map((a, i) => AddrCard(a, i === sel)).join(''),
    Btn('새 배송지 추가', { icon: 'plus', block: true }),
    Note('배송지는 10곳까지 저장됩니다. 기본 배송지는 마이페이지 > 배송지 관리에서 바꿉니다.'),
];

const state2 = StateBlock({ idx: 2, title: '배송지 목록 팝업', note: "배송지 상자의 '배송지 변경'을 누르면 저장해 둔 배송지 목록이 뜹니다. 고르고 '이 배송지로 보내기'를 누르면 주문서에 반영됩니다." },
    Anno({ title: '왜 이렇게 하나' }, '선물·회사 수령처럼 배송지를 바꾸는 일이 잦아 주문서를 벗어나지 않고 고르게 합니다. 기본 배송지는 맨 위에 굵은 배지로 표시하고, 제주·도서산간 주소는 고르기 전에 추가 배송비를 미리 알려 결제 직전에 금액이 바뀌어 놀라지 않게 합니다. 여기서 고른다고 기본 배송지가 바뀌지는 않습니다(이번 주문에만 적용).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '배송지를 바꾸면 배송비가 다시 계산됩니다. 배송비 쿠폰을 이미 적용했다면 그대로 유지하고, 추가 배송비만큼 최종 금액이 달라졌다는 안내를 금액 상자 위에 잠깐 띄웁니다. 저장된 배송지가 없는 회원은 이 팝업 대신 새 배송지 입력 폼이 바로 뜹니다.'),
    Canvas({ label: "U-08 · '배송지 변경' 버튼 → 배송지 목록 팝업 (지금 쓰는 배송지가 선택된 채)" }, Overlay({ bg: baseBg, h: 640 },
        Modal({ title: '배송지 선택', w: 560, foot: [Btn('취소'), Btn('이 배송지로 보내기', 'primary')] }, AddrList(0)))),
    CanvasRow(
        Canvas({ size: 'auto', label: "'부모님 댁'(제주) 을 고른 모습", right: '팝업만', pad: 20 }, Modal({ title: '배송지 선택', w: 520, foot: [Btn('취소'), Btn('이 배송지로 보내기', 'primary')] }, AddrList(2))),
        Canvas({ size: 'auto', label: "'삭제'를 누른 뒤 확인", right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:360px"><div class="mb"><b class="ct">'회사' 배송지를 삭제할까요?</b><p>지난 주문의 배송지 기록은 그대로 남습니다.</p></div><div class="mf">${Btn('취소')}${Btn('삭제', 'danger')}</div></div>`),
    ),
    Canvas({ label: 'U-08 · 제주 배송지를 적용한 뒤 주문서 (배송비 3,000원 추가, 안내 토스트)' }, Overlay({
        bg: Page({}, [ItemsBox(), BuyerBox(), ShipBox({ name: '부모님 댁', base: false, to: '김영숙', tel: '010-****-7730', zip: '63122', addr: ADDR_JEJU, jeju: true, memo: { value: '배송 전에 연락 주세요' } }), BenefitBox()], Sum({ jeju: true })),
        dim: false, align: 'top', h: 760,
    }, Toast('배송지를 바꿨습니다. 제주·도서산간 추가 배송비 3,000원이 더해졌습니다.'))),
    Canvas({ size: 'mobile', label: 'U-08 · 모바일은 아래에서 올라오는 시트' }, Overlay({ bg: mobileMember, align: 'bottom', h: 720 },
        BottomSheet({ title: '배송지 선택', foot: [Btn('이 배송지로 보내기', 'primary')] }, AddrList(0)))),
);

const AddrForm = (o = {}) => [
    Field({ label: '배송지 이름', help: "예: 우리 집, 회사. 비워 두면 받는 분 이름으로 저장됩니다." }, Input({ value: o.name || '', placeholder: '배송지 이름' })),
    Field({ label: '받는 분', required: true, error: o.err && '받는 분 이름을 입력해 주세요.' }, Input({ value: o.to || '', placeholder: '이름', error: !!o.err })),
    Field({ label: '연락처', required: true, help: '택배 기사님이 연락할 번호입니다.' }, Input({ value: o.tel || '', placeholder: '010-0000-0000' })),
    Field({ label: '주소', required: true, error: o.err && '우편번호 찾기를 눌러 주소를 선택해 주세요.' },
        Flex({ gap: 8 }, Input({ value: o.zip || '', placeholder: '우편번호', w: 140, disabled: true }), Btn('우편번호 찾기', { kind: 'line', icon: 'search' })),
        `<div style="margin-top:8px">${Input({ value: o.road || '', placeholder: '우편번호 찾기로 주소를 선택하세요', w: '100%', disabled: true })}</div>`,
        `<div style="margin-top:8px">${Input({ value: o.detail || '', placeholder: '상세 주소 (동·호수, 건물 이름)', w: '100%', focus: o.detailFocus })}</div>`,
        o.jeju ? Note('제주·도서산간 지역입니다. 추가 배송비 3,000원이 붙습니다.', { warn: true }) : '',
    ),
    `<div style="display:flex;flex-direction:column;gap:8px">${Check('배송지 목록에 저장', { on: o.save !== false })}${Check('기본 배송지로 지정', { on: !!o.base })}</div>`,
];
const ZipRow = (zip, road, jibun, on) => `<div style="display:flex;gap:14px;padding:12px;border-bottom:1px solid var(--line2);background:${on ? 'var(--box)' : '#fff'}"><b style="flex:none;width:52px">${zip}</b><div style="font-size:13px"><div><span style="font-size:11px;border:1px solid var(--line);border-radius:2px;padding:0 4px;margin-right:6px;color:var(--mute)">도로명</span>${road}</div><div style="color:var(--mute);margin-top:2px"><span style="font-size:11px;border:1px solid var(--line);border-radius:2px;padding:0 4px;margin-right:6px">지번</span>${jibun}</div></div></div>`;
const ZipModal = (kind) => Modal({ title: '우편번호 찾기', w: 520 },
    Flex({ gap: 8 }, Input({ value: kind === 'before' ? '' : kind === 'none' ? '월드컴북로 396' : '월드컵북로 396', placeholder: '도로명, 건물 이름, 지번으로 검색', icon: 'search', w: 380, focus: kind === 'before' }), Btn('검색', 'primary')),
    kind === 'before' ? `<div style="margin-top:16px;font-size:13px;color:var(--ink2)"><b>이렇게 검색해 보세요</b><ul style="margin:8px 0 0;padding-left:18px;line-height:1.9"><li>도로명 + 건물번호 <span style="color:var(--mute)">예: 월드컵북로 396</span></li><li>동·읍·면 + 번지 <span style="color:var(--mute)">예: 상암동 1605</span></li><li>건물·아파트 이름 <span style="color:var(--mute)">예: 누리꿈스퀘어</span></li></ul></div>` : '',
    kind === 'result' ? `<div style="margin-top:14px;font-size:12.5px;color:var(--mute)">검색 결과 <b style="color:var(--ink)">3</b>건 · 주소를 누르면 입력칸에 채워집니다</div><div style="border-top:1px solid var(--dark);margin-top:8px">${[
        ZipRow('03925', '서울 마포구 월드컵북로 396 (상암동, 누리꿈스퀘어)', '서울 마포구 상암동 1605', true),
        ZipRow('03925', '서울 마포구 월드컵북로 396 (상암동, 누리꿈스퀘어 비즈니스타워)', '서울 마포구 상암동 1605-1'),
        ZipRow('03925', '서울 마포구 월드컵북로 396 (상암동, 누리꿈스퀘어 연구개발타워)', '서울 마포구 상암동 1605-2'),
    ].join('')}</div>${Pager({ page: 1, last: 1 })}` : '',
    kind === 'none' ? Empty({ icon: 'map-marker', title: "'월드컴북로 396' 으로 찾은 주소가 없습니다", desc: '도로명이나 건물 이름의 철자를 확인해 주세요.<br>건물번호를 빼고 도로명만 넣어도 찾을 수 있습니다.' }) : '',
);

const state3 = StateBlock({ idx: 3, title: '새 배송지 입력(주소 검색)', note: "배송지 목록 팝업의 '새 배송지 추가'를 누르거나, 저장된 배송지가 없는 회원·비회원이 주문서에 들어오면 나오는 입력 폼입니다." },
    Anno({ title: '왜 이렇게 하나 · 초기값' }, "주소는 손으로 치지 않고 우편번호 찾기로만 채웁니다(오타로 인한 반송을 막고, 우편번호로 제주·도서산간 추가 배송비를 자동 판별). 초기값: 받는 분·연락처 = 주문자 정보 그대로, '배송지 목록에 저장' 체크, '기본 배송지로 지정'은 저장된 배송지가 하나도 없을 때만 체크된 채 시작합니다."),
    Anno({ title: '개발 메모' }, '우편번호 찾기는 카카오(다음) 우편번호 서비스를 팝업으로 띄웁니다. 아래 검색 결과 목록은 그 서비스가 보여 주는 모습의 뼈대이며, 주소를 누르면 팝업이 닫히고 우편번호·기본 주소가 채워진 뒤 상세 주소 칸에 커서가 갑니다.'),
    Canvas({ label: "U-08 · 배송지 목록 → '새 배송지 추가' → 빈 입력 폼" }, Overlay({ bg: baseBg, h: 720 },
        Modal({ title: '새 배송지', w: 520, foot: [Btn('이전'), Btn('저장하고 이 배송지로 보내기', { kind: 'primary', disabled: true })] }, AddrForm({ to: '김민지', tel: '010-1234-1234' })))),
    CanvasRow(
        Canvas({ size: 'auto', label: "'우편번호 찾기' → 검색 전", right: '팝업만', pad: 20 }, ZipModal('before')),
        Canvas({ size: 'auto', label: "'월드컵북로 396' 검색 → 결과 목록", right: '팝업만', pad: 20 }, ZipModal('result')),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '검색 결과 없음', right: '팝업만', pad: 20 }, ZipModal('none')),
        Canvas({ size: 'auto', label: '주소를 고른 뒤 (상세 주소에 커서, 저장 버튼 켜짐)', right: '팝업만', pad: 20 },
            Modal({ title: '새 배송지', w: 520, foot: [Btn('이전'), Btn('저장하고 이 배송지로 보내기', 'primary')] }, AddrForm({ name: '사무실', to: '김민지', tel: '010-1234-1234', zip: '03925', road: '서울 마포구 월드컵북로 396 (상암동, 누리꿈스퀘어)', detail: '비즈니스타워 12층', detailFocus: true }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '필수 항목을 비우고 저장을 누름', right: '팝업만', pad: 20 },
            Modal({ title: '새 배송지', w: 520, foot: [Btn('이전'), Btn('저장하고 이 배송지로 보내기', 'primary')] }, AddrForm({ tel: '010-1234-1234', err: true }))),
        Canvas({ size: 'auto', label: '제주 주소를 고른 경우 (추가 배송비 안내)', right: '팝업만', pad: 20 },
            Modal({ title: '새 배송지', w: 520, foot: [Btn('이전'), Btn('저장하고 이 배송지로 보내기', 'primary')] }, AddrForm({ name: '부모님 댁', to: '김영숙', tel: '010-7730-7730', zip: '63122', road: '제주 제주시 연북로 *** (노형동)', detail: '2층', jeju: true }))),
    ),
);

const CouponCard = (c) => card(c.on, `${row(
    `<span style="display:flex;gap:10px;align-items:flex-start">${c.multi ? Check('', { on: c.on, disabled: c.off }) : Radio('', { on: c.on, disabled: c.off })}<span><b style="font-size:15px">${c.amount}</b> <span style="font-size:13px">${c.name}</span><br><span style="font-size:12px;color:var(--mute)">${c.cond} · ${c.until}까지</span></span></span>`,
    c.on ? Badge('적용 중', 'solid') : c.off ? Badge('사용 불가', 'mute') : '')}
${c.off ? `<div style="margin:8px 0 0 28px;font-size:12px;font-weight:700;color:var(--ink2)">${Icon('info-o')} ${c.off}</div>` : ''}`, { off: !!c.off });
const CGroup = (title, sub, ...cards) => `<div style="margin-bottom:18px"><div style="display:flex;gap:8px;align-items:baseline;margin-bottom:8px"><b>${title}</b><span style="font-size:12px;color:var(--mute)">${sub}</span></div>${cards.join('')}</div>`;
const CodeLine = (o = {}) => `<div style="background:var(--box);border-radius:6px;padding:12px;margin-bottom:18px"><div style="display:flex;gap:8px">${Input({ value: o.value || '', placeholder: '쿠폰 코드가 있다면 입력하세요', w: 300, error: !!o.error })}${Btn('쿠폰 등록', { kind: 'line' })}</div>${o.error ? `<p class="err">${Icon('error-o')}${o.error}</p>` : ''}${o.ok ? `<p class="help" style="color:var(--ink);font-weight:700">${Icon('check-circle-o')} ${o.ok}</p>` : ''}</div>`;
const CSum = (disc, ship) => `<div style="border-top:1px solid var(--dark);padding-top:12px;display:flex;justify-content:space-between;font-size:13.5px"><span>쿠폰 할인 합계${ship ? ' (배송비 할인 포함)' : ''}</span><b style="font-size:16px">-${won(disc)}</b></div>`;
const CouponModal = (o = {}) => Modal({ title: '쿠폰 적용', w: 560, foot: [Btn('적용 안 함'), Btn(o.disc ? `${won(o.disc)} 할인 적용` : '적용', { kind: 'primary', disabled: !o.disc })] },
    CodeLine(o.code),
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;font-size:13px"><span>사용할 수 있는 쿠폰 <b>${o.extra ? 2 : 1}</b>장 · 보유 ${o.extra ? 5 : 4}장</span>${Btn('최대 할인 적용', { size: 'sm', icon: 'check' })}</div>`,
    CGroup('상품 쿠폰', '상품마다 1장', CouponCard({ amount: '10% 할인', name: '4박스 구성 전용 쿠폰', cond: '4박스(56일분) 구성에만 · 최대 20,000원', until: '2026-11-30', off: '주문 상품에 쿠폰 대상 구성(4박스)이 없습니다.' })),
    CGroup('주문서 쿠폰', '주문 1건에 1장', [
        CouponCard({ amount: '3,000원 할인', name: '신규 가입 축하 쿠폰', cond: '30,000원 이상 구매 시', until: '2026-12-10', on: o.pick === 'new' }),
        o.extra ? CouponCard({ amount: '5,000원 할인', name: '11월 감사 쿠폰 (코드 등록)', cond: '50,000원 이상 구매 시', until: '2026-11-30', on: o.pick === 'code' }) : '',
        CouponCard({ amount: '10,000원 할인', name: '재구매 감사 쿠폰', cond: '150,000원 이상 구매 시', until: '2026-12-31', off: '57,000원을 더 담으면 쓸 수 있습니다 (150,000원 이상 구매 시).' }),
    ].join('')),
    CGroup('배송비 쿠폰', '주문 1건에 1장', CouponCard({ amount: '배송비 무료', name: '무료배송 쿠폰', cond: '기본 배송비에만 적용 (제주·도서산간 추가분 제외)', until: '2026-12-31', off: '이번 주문은 배송비가 0원이라 쓸 필요가 없습니다.' })),
    o.disc ? CSum(o.disc) : Text('쿠폰을 고르면 할인 금액이 여기에 표시됩니다.', { mute: true, sm: true }),
);

const state4 = StateBlock({ idx: 4, title: '쿠폰 적용 팝업', note: "할인·혜택 상자의 '쿠폰 선택'을 누르면 보유 쿠폰이 종류별로 나뉘어 뜹니다. 쿠폰 기능을 끈 몰에서는 버튼 자체가 없습니다." },
    Anno({ title: '왜 이렇게 하나 · 유형별 분기' }, '쿠폰은 관리자(혜택 > 쿠폰)에서 만드는 세 유형 그대로 묶어 보여 줍니다. 상품 쿠폰은 대상 상품마다 1장, 주문서 쿠폰과 배송비 쿠폰은 주문 1건에 각 1장, 서로 다른 유형끼리는 함께 쓸 수 있습니다(중복 허용 여부는 쿠폰 등록 때 정함). 못 쓰는 쿠폰을 숨기지 않고 흐리게 두고 이유를 한 줄로 적어, 고객센터에 "쿠폰이 안 보여요" 문의가 오지 않게 합니다.'),
    Anno({ title: '초기값 · 빈 상태' }, "초기값은 '적용 안 함'입니다(아껴 두려는 고객이 있어 자동 적용하지 않음). 대신 '최대 할인 적용'을 누르면 쓸 수 있는 쿠폰 중 할인이 가장 큰 조합을 한 번에 골라 줍니다. 정렬은 사용 가능 → 할인 큰 순 → 만료 임박 순. 쿠폰 코드는 여기서 바로 등록하면 목록에 추가되고 마이페이지 쿠폰함에도 들어갑니다. 보유 쿠폰이 한 장도 없으면 빈 상태 문구와 코드 입력칸만 보입니다."),
    Canvas({ label: "U-08 · '쿠폰 선택' 버튼 → 쿠폰 적용 팝업 (아직 고르지 않음)" }, Overlay({ bg: baseBg, h: 900 }, CouponModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '신규 가입 쿠폰을 고른 모습 (합계·버튼 문구 바뀜)', right: '팝업만', pad: 20 }, CouponModal({ pick: 'new', disc: 3000 })),
        Canvas({ size: 'auto', label: "쿠폰 코드 'THANKS11' 등록 성공 → 목록에 추가되고 선택됨", right: '팝업만', pad: 20 }, CouponModal({ pick: 'code', disc: 5000, extra: true, code: { value: 'THANKS11', ok: "'11월 감사 쿠폰'을 등록했습니다." } })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '쿠폰 코드 오류 문구 3가지', right: '코드 입력칸만', pad: 20 }, `<div style="width:480px">${CodeLine({ value: 'THANK11', error: '없는 쿠폰 코드입니다. 대소문자와 숫자를 다시 확인해 주세요.' })}${CodeLine({ value: 'OPEN2026', error: '이미 등록한 쿠폰입니다. 아래 목록에서 골라 주세요.' })}${CodeLine({ value: 'CHUSEOK10', error: '사용 기간이 끝난 쿠폰입니다 (2026-10-31 종료).' })}</div>`),
        Canvas({ size: 'auto', label: '보유 쿠폰이 없는 회원', right: '팝업만', pad: 20 }, Modal({ title: '쿠폰 적용', w: 480, foot: [Btn('닫기')] }, CodeLine(), Empty({ icon: 'coupon', title: '사용할 수 있는 쿠폰이 없습니다', desc: '쿠폰 코드가 있다면 위 칸에 입력해 등록해 주세요.' }))),
    ),
    Canvas({ label: 'U-08 · 쿠폰 적용 뒤 주문서 (할인·혜택 상자와 결제 금액 상자에 쿠폰 이름별로 표시)' }, Page({}, [ItemsBox(), BenefitBox({ coupon: { value: '신규 가입 축하 쿠폰 · -3,000원', help: '쿠폰을 쓴 주문을 전체 취소하면 쿠폰은 사용 기간 안에서 되돌려 드립니다.' } }), PayBox()], Sum({ coupons: [COUPON_NEW] }))),
);

const PointOnly = (o) => `<div style="width:560px">${Box({ title: '할인·혜택' }, PointLine(o))}</div>`;

const state5 = StateBlock({ idx: 5, title: '적립금 사용', note: '보유 적립금을 결제 금액에서 빼는 칸. 숫자를 치는 즉시 오른쪽 결제 금액과 적립 예정 금액이 다시 계산됩니다.' },
    Anno({ title: '왜 이렇게 하나 · 관리자가 바꾸는 범위' }, "'전액 사용'은 쓸 수 있는 최대치(보유액과 결제 금액 중 작은 쪽, 사용 단위로 내림)를 한 번에 채웁니다. 최소 보유액(솔루션 기본값 5,000원)·사용 단위(100원)·1회 최대 사용 한도·쿠폰과 함께 쓰기 허용 여부는 관리자 혜택 > 적립금 정책 값이며, 도움말 문구는 그 값으로 자동 생성됩니다. 적립 예정 금액은 쿠폰·적립금을 뺀 실제 결제 금액 기준입니다."),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '적립금으로 전액을 결제해 최종 금액이 0원이 되면 결제수단 상자가 접히고 버튼이 "주문하기"로 바뀌며 결제창 없이 바로 주문이 완료됩니다. 적립금 기능을 끈 몰은 이 칸이 없습니다.'),
    Canvas({ label: "U-08 · '전액 사용'을 누른 뒤 (6,400원 입력됨, 쿠폰과 함께 적용, 금액 상자 반영)" }, Page({}, [ItemsBox(), BenefitBox({ coupon: { value: '신규 가입 축하 쿠폰 · -3,000원' }, point: { value: '6,400', all: true, help: '6,400원을 모두 사용합니다. 남는 적립금 0원.' } }), PayBox()], Sum({ coupons: [COUPON_NEW], point: 6400 }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '직접 입력 중 (1,500원)', right: '상자만', pad: 20 }, PointOnly({ value: '1,500', focus: true, help: '1,500원 사용 · 남는 적립금 4,900원' })),
        Canvas({ size: 'auto', label: '오류 · 보유액보다 많이 입력', right: '상자만', pad: 20 }, PointOnly({ value: '9,000', error: '보유 적립금 6,400원까지만 쓸 수 있습니다.' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '오류 · 사용 단위가 맞지 않음', right: '상자만', pad: 20 }, PointOnly({ value: '1,250', error: '적립금은 100원 단위로 쓸 수 있습니다. 1,200원 또는 1,300원으로 입력해 주세요.' })),
        Canvas({ size: 'auto', label: '보유액이 최소 사용 금액에 못 미침 (입력칸 비활성)', right: '상자만', pad: 20 }, PointOnly({ disabled: true, have: '3,200원', help: '적립금은 5,000원 이상 모이면 쓸 수 있습니다. 1,800원 더 모으면 사용할 수 있어요.' })),
    ),
);

const CashReceipt = (kind) => `<div style="margin-top:12px;border-top:1px solid var(--line2);padding-top:12px">${Field({ label: '현금영수증' },
    `<div class="wf-inline">${Radio('소득공제용(개인)', { on: kind === '소득' })}${Radio('지출증빙용(사업자)', { on: kind === '지출' })}${Radio('신청 안 함', { on: !kind })}</div>`,
    kind === '소득' ? `<div style="margin-top:8px">${Input({ value: '010-1234-1234', w: 240 })}<p class="help">휴대폰 번호로 발급됩니다. 결제(입금) 확인 뒤 국세청에 자동 신고됩니다.</p></div>` : '',
    kind === '지출' ? `<div style="margin-top:8px">${Input({ placeholder: '사업자등록번호 10자리', w: 240 })}</div>` : '',
)}</div>`;
const payExtraCard = Note('결제하기를 누르면 결제 대행사의 카드 결제창이 열립니다. 카드사·할부 개월(5만원 이상)·무이자 여부는 결제창에서 고릅니다.');
const BANKS = ['국민은행', '신한은행', '우리은행', '하나은행', '농협은행', '기업은행', '카카오뱅크', '토스뱅크'];
const payExtraVbank = (open) => `<div style="margin-top:12px">${Field({ label: '입금 은행', required: true, help: open ? undefined : '결제하기를 누르면 이 은행의 입금 전용 계좌가 발급됩니다.' },
    open ? Select({ value: '국민은행', w: 260, open: true, options: BANKS.map((t) => ({ t, on: t === '국민은행' })) }) : Select({ value: '국민은행', w: 260 }))}
${open ? '' : Note('환불받을 계좌는 지금 받지 않습니다. 취소·반품을 신청할 때 입력합니다.')}
${open ? '' : Note('입금 기한은 주문 후 3일(2026-11-14 23:59)입니다. 기한까지 입금하지 않으면 주문이 자동으로 취소됩니다.', { warn: true })}
${open ? '' : CashReceipt('소득')}</div>`;
const PgWindow = (title, body) => `<div class="wf-modal" style="width:420px"><div class="mh"><b>${title}</b>${Icon('close')}</div><div class="mb" style="min-height:300px;display:flex;flex-direction:column;gap:12px">${body}</div></div>`;

const state6 = StateBlock({ idx: 6, title: '결제수단 선택', note: '관리자 설정 > 결제에서 켠 결제수단만, 관리자가 정한 순서대로 나옵니다. 수단마다 아래에 펼쳐지는 추가 입력칸이 다릅니다.' },
    Anno({ title: '왜 이렇게 하나 · 유형별 분기' }, '카드·간편결제(카카오페이·네이버페이·토스페이)는 추가 입력 없이 결제창으로 넘어갑니다. 실시간 계좌이체는 현금영수증 칸, 가상계좌는 입금 은행(필수)·입금 기한 안내·현금영수증 칸이 펼쳐집니다(환불 계좌는 취소할 때 입력). 가상계좌 입금 기한(예시 3일)은 설정 > 결제 값입니다.'),
    Anno({ title: '초기값 · 관리자가 바꾸는 범위' }, "초기값은 지난 주문에 쓴 수단('이 결제수단을 다음에도 사용' 체크 시), 첫 주문이면 관리자 순서의 첫 번째. 결제수단을 하나만 켠 몰은 고르는 칸 없이 그 수단 이름만 보여 줍니다. 결제창(카드사 선택·간편결제 앱 화면)은 결제 대행사가 그리는 화면이라 우리 디자인 대상이 아니며, 아래에는 떠 있는 자리만 표시했습니다."),
    Canvas({ label: 'U-08 · 6개 모두 켠 몰 · 신용·체크카드 선택(초기값)' }, Page({}, [PayBox({ extra: payExtraCard })], Sum())),
    CanvasRow(
        Canvas({ size: 'auto', label: '가상계좌(무통장) 선택 → 추가 입력칸 펼침', right: '결제수단 상자만', pad: 20 }, `<div style="width:720px">${PayBox({ active: '가상계좌(무통장)', extra: payExtraVbank(false) })}</div>`),
        Canvas({ size: 'auto', label: '입금 은행 select 를 연 모습', right: '결제수단 상자만', pad: 20 }, `<div style="width:520px;min-height:520px">${PayBox({ active: '가상계좌(무통장)', extra: payExtraVbank(true), remember: false, cols: 2 })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '실시간 계좌이체 선택 · 현금영수증 지출증빙용', right: '결제수단 상자만', pad: 20 }, `<div style="width:720px">${PayBox({ active: '실시간 계좌이체', extra: `${Note('결제하기를 누르면 은행을 고르고 계좌 비밀번호로 바로 이체하는 창이 열립니다.')}${CashReceipt('지출')}` })}</div>`),
        Canvas({ size: 'auto', label: '카카오페이 선택', right: '결제수단 상자만', pad: 20 }, `<div style="width:520px">${PayBox({ active: '카카오페이', cols: 2, extra: Note('결제하기를 누르면 카카오페이 결제창이 열립니다. 모바일에서는 카카오톡 앱으로 넘어갑니다.') })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '카드·카카오페이만 켠 몰', right: '결제수단 상자만', pad: 20 }, `<div style="width:520px">${PayBox({ list: ['신용·체크카드', '카카오페이'], cols: 2, extra: payExtraCard })}</div>`),
        Canvas({ size: 'auto', label: '카드 하나만 켠 몰 (고르는 칸 없음)', right: '결제수단 상자만', pad: 20 }, `<div style="width:520px">${Box({ title: '결제수단' }, `<div style="display:flex;gap:8px;align-items:center;font-weight:700">${Icon('credit-card')}신용·체크카드</div>`, payExtraCard)}</div>`),
    ),
    Canvas({ label: "U-08 · '결제하기' → 결제 대행사 결제창이 뜬 모습 (창 안쪽은 결제 대행사 화면)" }, Overlay({ bg: baseBg, h: 520 },
        PgWindow('카드 결제', `<div style="background:var(--fill);flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:240px;color:var(--ink2);font-size:13px;text-align:center;padding:16px">${Icon('credit-card')}<b>결제 대행사 결제창 자리</b>이너에라 Inner:Era · 93,000원<br>카드사 선택 · 할부 개월 · 약관 동의는 결제 대행사가 그립니다</div><p class="help" style="margin:0">창을 닫으면 결제가 취소되고 주문서로 돌아옵니다. 입력한 내용은 그대로 남습니다.</p>`))),
    Canvas({ label: 'U-08 · 결제창을 닫고 돌아온 주문서 (입력값 유지, 안내 토스트)' }, Overlay({ bg: baseBg, dim: false, align: 'top', h: 300 }, Toast('결제를 취소했습니다. 결제수단을 바꾸거나 다시 시도해 주세요.', { kind: 'error' }))),
);

const GuestBuyer = (o = {}) => Box({ title: '주문자 정보', sub: '주문 확인·배송 안내를 받을 연락처' },
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">`,
    Field({ label: '이름', required: true, error: o.err && '주문하시는 분 이름을 입력해 주세요.' }, Input({ value: o.err ? '' : '윤서연', placeholder: '이름', error: !!o.err })),
    Field({ label: '휴대폰 번호', required: true, error: o.err && '휴대폰 번호 11자리를 숫자로 입력해 주세요. 예: 01012345678' }, Input({ value: o.err ? '010-5521-88' : '010-5521-8834', placeholder: '010-0000-0000', error: !!o.err })),
    `</div>`,
    Field({ label: '이메일', required: true, help: o.err ? undefined : '주문 확인 메일을 보내 드립니다.', error: o.err && '이메일 주소 형식이 맞지 않습니다. 예: name@example.com' }, Input({ value: o.err ? 'seoyeon.yoon@' : 'seoyeon.yoon@example.com', error: !!o.err })),
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">`,
    Field({ label: '주문 비밀번호', required: true, help: o.err ? undefined : '숫자·영문 4~12자. 주문 조회·취소할 때 필요합니다.', error: o.err && '주문 비밀번호는 4자 이상이어야 합니다.' }, Input({ value: o.err ? '•••' : '••••••', error: !!o.err })),
    Field({ label: '주문 비밀번호 확인', required: true, error: o.err && '위에 입력한 주문 비밀번호와 다릅니다.' }, Input({ value: o.err ? '••••' : '••••••', error: !!o.err })),
    `</div>`,
    Note('비회원 주문은 주문번호 + 휴대폰 번호 + 주문 비밀번호로 조회합니다. 주문번호는 결제 뒤 알림톡과 메일로 보내 드립니다.'),
);
const GuestShip = (o = {}) => Box({ title: '배송지', right: Check('주문자 정보와 같음', { on: !o.err }) },
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 16px">`,
    Field({ label: '받는 분', required: true, error: o.err && '받는 분 이름을 입력해 주세요.' }, Input({ value: o.err ? '' : '윤서연', placeholder: '이름', error: !!o.err })),
    Field({ label: '연락처', required: true }, Input({ value: '010-5521-8834' })),
    `</div>`,
    Field({ label: '주소', required: true, error: o.err && '우편번호 찾기를 눌러 주소를 선택해 주세요.' },
        Flex({ gap: 8 }, Input({ value: o.err ? '' : '06236', placeholder: '우편번호', w: 140, disabled: true, error: !!o.err }), Btn('우편번호 찾기', { kind: 'line', icon: 'search' })),
        `<div style="margin-top:8px">${Input({ value: o.err ? '' : '서울 강남구 테헤란로 *** (역삼동)', placeholder: '우편번호 찾기로 주소를 선택하세요', w: '100%', disabled: true })}</div>`,
        `<div style="margin-top:8px">${Input({ value: o.err ? '' : '7층 702호', placeholder: '상세 주소 (동·호수, 건물 이름)', w: '100%' })}</div>`),
    Field({ label: '배송 요청사항' }, Memo({ value: o.err ? '' : '경비실에 맡겨 주세요' })),
);
const JoinNudge = () => `<div style="border:1px dashed var(--ink2);border-radius:6px;padding:14px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:12px"><div style="font-size:13px">${Icon('gift-o')} <b>회원으로 주문하면 3,000원 쿠폰을 바로 쓰고 930원이 적립됩니다.</b><br><span style="color:var(--mute)">비회원 주문에는 쿠폰·적립금을 쓸 수 없습니다. 입력한 내용은 가입 뒤에도 남습니다.</span></div><div style="display:flex;gap:8px;flex:none">${Btn('로그인', { size: 'sm' })}${Btn('1분 회원가입', { kind: 'primary', size: 'sm' })}</div></div>`;
const guestLeft = (o = {}) => [JoinNudge(), ItemsBox(), GuestBuyer(o), GuestShip(o), PayBox({ remember: false, extra: payExtraCard })];

const mobileGuest = MobilePage({ title: '주문서·결제', tab: false, bottom: [Btn('93,000원 결제하기', 'primary')] },
    `<div style="margin-top:-16px">`,
    mSec('주문 상품 1건', '', ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' })),
    mSec('주문자 정보', '',
        Field({ label: '이름', required: true }, Input({ value: '윤서연' })),
        Field({ label: '휴대폰 번호', required: true }, Input({ value: '010-5521-8834' })),
        Field({ label: '이메일', required: true }, Input({ value: 'seoyeon.yoon@example.com' })),
        Field({ label: '주문 비밀번호', required: true, help: '숫자·영문 4~12자. 주문 조회·취소할 때 필요합니다.' }, Input({ value: '••••••' })),
        Field({ label: '주문 비밀번호 확인', required: true }, Input({ value: '••••••' }))),
    mSec('배송지', Check('주문자와 같음', { on: true }),
        Field({ label: '주소', required: true }, `<div style="display:flex;gap:8px">${Input({ value: '06236', w: 120, disabled: true })}${Btn('우편번호 찾기', { kind: 'line' })}</div><div style="margin-top:8px">${Input({ value: '서울 강남구 테헤란로 *** (역삼동)', w: '100%', disabled: true })}</div><div style="margin-top:8px">${Input({ value: '7층 702호', w: '100%' })}</div>`)),
    `<div style="padding:16px 0 0">${Agree({ guest: true })}</div></div>`,
);

const state7 = StateBlock({ idx: 7, title: '비회원 주문(주문 비밀번호)', note: "로그인 화면에서 '비회원으로 주문하기'를 누르고 들어온 모습. 비회원 주문 기능을 켠 몰에서만 이 길이 있습니다." },
    Anno({ title: '왜 이렇게 하나 · 유형별 분기' }, '회원 주문서와 다른 점: 주문자 정보를 직접 입력, 주문 비밀번호(조회·취소용) 추가, 배송지 목록 없이 바로 입력 폼, 쿠폰·적립금 상자 대신 회원 혜택 안내, 약관에 비회원 개인정보 수집·이용 동의가 한 줄 늘어남, 금액 상자에 적립금 줄 없음. 개인정보는 주문 처리에 필요한 것만 받습니다(생년월일·성별 없음).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, "주문 비밀번호를 잊으면 조회할 방법이 없어 고객센터 문의로 이어집니다. 그래서 비밀번호는 저장만 하고, 조회 화면(U-27)에 '주문 비밀번호 다시 받기'(주문 때 입력한 휴대폰으로 인증 후 재설정)를 둡니다. 초기값: '주문자 정보와 같음' 체크 → 받는 분·연락처가 주문자 값으로 채워지고, 체크를 풀면 빈칸이 됩니다."),
    Canvas({ label: 'U-08 · 비회원 주문서 (입력을 마치고 약관 3개 동의)' }, Page({ guest: true }, guestLeft(), Sum({ guest: true }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-08 · 모바일 비회원 주문서 (결제수단·금액은 회원과 같아 생략)' }, mobileGuest),
        Canvas({ size: 'auto', label: "약관 줄의 '보기' → 비회원 개인정보 수집·이용 동의 전문", right: '팝업만', pad: 20 }, Modal({ title: '비회원 개인정보 수집·이용 동의', w: 480, foot: [Btn('닫기'), Btn('동의하고 닫기', 'primary')] },
            KV([['수집 항목', '이름, 휴대폰 번호, 이메일, 배송지 주소, 주문 비밀번호'], ['수집 목적', '주문 확인, 결제, 배송, 교환·반품·환불 처리, 고객 문의 응대'], ['보유 기간', '<b>전자상거래법에 따라 주문일부터 5년</b> (대금 결제 및 재화 공급 기록)']]),
            Divider(),
            Text('동의하지 않을 수 있으나, 동의하지 않으면 비회원 주문을 할 수 없습니다.', { sm: true, mute: true }),
            Text('전문 내용은 관리자 설정 > 약관·정책에 등록한 현재 버전이 그대로 나옵니다.', { sm: true, mute: true }))),
    ),
);

const ErrTop = (n, first) => `<div class="wf-note warn" style="margin:0 0 16px;padding:12px 14px;font-size:13.5px">${Icon('warning')}<span><b>입력을 확인해 주세요 (${n}곳)</b><br>${first}</span></div>`;

const state8 = StateBlock({ idx: 8, title: '입력 오류', note: "'결제하기'를 눌렀을 때 빠지거나 잘못된 칸이 있으면 결제창을 열지 않고, 맨 위 요약과 칸마다의 문장으로 알려 줍니다." },
    Anno({ title: '왜 이렇게 하나' }, '오류 문장은 무엇이 틀렸는지와 어떻게 고치면 되는지를 함께 적습니다("필수 항목입니다" 금지). 결제하기를 누르면 첫 오류 칸으로 화면이 올라가 커서가 놓이고, 맨 위 요약의 항목을 누르면 그 칸으로 이동합니다. 값을 고치면 그 칸의 오류 표시는 바로 사라집니다. 입력 중에는 검사하지 않고, 칸을 벗어날 때와 결제하기를 누를 때 검사합니다.'),
    Anno({ warn: true, title: '결제 직전 서버 확인에서 걸리는 경우' }, '그사이 품절·판매 중지·가격 변경·쿠폰 만료가 생기면 결제창을 열지 않고 사유를 팝업으로 알려 장바구니로 돌려보냅니다(아래 팝업 3종). 결제창에서 난 실패(한도 초과 등)는 U-09 결제 실패 화면에서 다룹니다.'),
    Canvas({ label: "U-08 · 비회원 주문서 · 빈칸을 두고 '결제하기'를 누른 뒤" }, Page({ guest: true }, [
        ErrTop(8, '주문자 이름 · 휴대폰 번호 · 이메일 · 주문 비밀번호 · 주문 비밀번호 확인 · 받는 분 · 주소 · 입금 은행'),
        ItemsBox(), GuestBuyer({ err: true }), GuestShip({ err: true }),
        PayBox({ active: '가상계좌(무통장)', remember: false, extra: `<div style="margin-top:12px">${Field({ label: '입금 은행', required: true, error: '입금할 은행을 선택해 주세요.' }, Select({ placeholder: '은행 선택', w: 260, error: true }))}</div>` }),
    ], Sum({ guest: true, reason: '입력을 확인해 주세요 (8곳)' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '회원 주문서에서 날 수 있는 오류', right: '해당 칸만', pad: 20 }, `<div style="width:560px">${Box({ title: '배송지' },
            Field({ label: '배송 요청사항 (직접 입력)', error: '배송 요청사항은 50자까지 쓸 수 있습니다. 지금 63자입니다.' }, Textarea({ value: '공동현관 비밀번호는 #1234 이고 부재 시에는 문 앞에 두지 말고 꼭 경비실에 맡겨 주신 뒤 문자 한 통 부탁드립니다', h: 72, count: '63 / 50', error: true })),
        )}${Box({ title: '결제수단' }, PayGrid(null, PAY_ALL, 3), `<p class="err">${Icon('error-o')}결제수단을 선택해 주세요.</p>`)}</div>`),
        Canvas({ size: 'auto', label: '결제 직전 확인 · 그사이 품절', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">주문할 수 없는 상품이 있습니다</b><p>${SHOP.productShort} · 2박스(28일분)<br><b>방금 품절되었습니다.</b><br>장바구니에서 다른 구성을 고르거나 재입고 알림을 신청해 주세요.</p></div><div class="mf">${Btn('장바구니로 돌아가기', 'primary')}</div></div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '결제 직전 확인 · 가격이 바뀜', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">상품 가격이 바뀌었습니다</b><p>2박스(28일분) 93,000원에서 <b>95,000원</b>으로<br>바뀐 금액으로 주문서를 다시 계산했습니다. 금액을 확인하고 결제해 주세요.</p></div><div class="mf">${Btn('장바구니로')}${Btn('바뀐 금액 확인', 'primary')}</div></div>`),
        Canvas({ size: 'auto', label: '결제 직전 확인 · 쿠폰 사용 기간 끝남', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">쿠폰을 쓸 수 없습니다</b><p>'신규 가입 축하 쿠폰'의 사용 기간이 방금 끝났습니다.<br>쿠폰을 빼고 금액을 다시 계산했습니다 (93,000원).</p></div><div class="mf">${Btn('다른 쿠폰 고르기')}${Btn('확인', 'primary')}</div></div>`),
    ),
);

const TermsModal = Modal({ title: '개인정보 제3자 제공 동의', w: 520, foot: [Btn('닫기'), Btn('동의하고 닫기', 'primary')] },
    `<div class="wf-tablewrap"><table class="wf-table dense"><thead><tr><th style="width:120px">제공받는 곳</th><th>제공 항목</th><th style="width:130px">이용 목적</th><th style="width:110px">보유 기간</th></tr></thead><tbody>
<tr><td>포트원 및 결제 대행사</td><td>이름, 휴대폰 번호, 이메일, 결제 정보</td><td>결제 처리·취소·환불</td><td><b>결제 후 5년</b></td></tr>
<tr><td>CJ대한통운</td><td>받는 분 이름, 연락처, 주소, 배송 요청사항</td><td>상품 배송·회수</td><td><b>배송 완료 후 3개월</b></td></tr></tbody></table></div>`,
    Text('동의하지 않을 수 있으나, 동의하지 않으면 결제와 배송을 할 수 없어 주문이 진행되지 않습니다.', { sm: true, mute: true }),
    Text('택배사 이름은 관리자 설정 > 배송에 등록한 택배사가, 전문은 설정 > 약관·정책의 현재 버전이 자동으로 들어갑니다.', { sm: true, mute: true }),
);

const state9 = StateBlock({ idx: 9, title: '약관 미동의', note: '필수 약관에 모두 동의하기 전에는 결제 버튼이 꺼져 있고, 버튼 바로 아래에 왜 꺼져 있는지 적혀 있습니다.' },
    Anno({ title: '왜 이렇게 하나 · 구매 버튼 활성 조건' }, '결제 버튼이 켜지는 조건은 필수 약관 전체 동의 하나뿐입니다(입력 누락은 버튼을 눌렀을 때 알려 줌 — 이유를 모른 채 꺼진 버튼만 보게 하지 않기 위해). 초기값은 전부 체크 해제이며 "모두 동의"로 한 번에 켭니다. 꺼진 버튼을 눌러도 약관 상자로 화면이 이동하고 상자가 굵은 테두리로 강조됩니다.'),
    Anno({ title: '관리자가 바꾸는 범위' }, "약관 전문은 설정 > 약관·정책에서 버전을 올려 바꾸고, 주문 때 동의한 버전이 주문에 기록됩니다. 약관 줄 구성(회원 2줄 · 비회원 3줄)은 고정입니다. 모바일은 '보기'를 누르면 전체 화면 시트로 뜹니다."),
    Canvas({ label: 'U-08 · 약관에 아직 동의하지 않은 주문서 (결제 버튼 꺼짐 + 이유)' }, Page({}, [ItemsBox(), ShipBox(), PayBox({ extra: payExtraCard })], Sum({ agreeOn: [false, false], reason: '필수 약관 2개에 동의하면 결제할 수 있습니다.' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '하나만 동의 (모두 동의 칸은 일부 선택 표시)', right: '금액 상자만', pad: 20 }, `<div style="width:380px">${Sum({ agreeOn: [true, false], reason: "'개인정보 제3자 제공 동의'에 동의해 주세요." })}</div>`),
        Canvas({ size: 'auto', label: '꺼진 버튼을 누름 → 약관 상자 강조', right: '금액 상자만', pad: 20 }, `<div style="width:380px"><div class="wf-price"><div style="border:2px solid var(--dark);border-radius:8px;padding:2px">${Agree({ on: [false, false] })}</div><div class="act">${Btn('93,000원 결제하기', { kind: 'primary', size: 'lg', block: true, disabled: true })}<p class="err" style="margin:0;justify-content:center">${Icon('error-o')}필수 약관 2개에 동의하면 결제할 수 있습니다.</p></div></div></div>`),
        Canvas({ size: 'auto', label: "'보기' → 약관 전문 팝업", right: '팝업만', pad: 20 }, TermsModal),
    ),
    Canvas({ size: 'mobile', label: 'U-08 · 모바일 · 하단 고정 버튼이 꺼진 모습과 이유' }, MobilePage({ title: '주문서·결제', tab: false, bottom: [Btn('93,000원 결제하기', { kind: 'primary', disabled: true })] },
        `<div style="margin-top:-16px">`,
        mSec('결제 금액', '', mPrice([['상품 금액', '93,000원'], ['배송비', '무료']], '93,000원')),
        `<div style="padding:16px 0 0">${Agree({ on: [false, false] })}<p class="err" style="justify-content:center;margin-top:14px">${Icon('error-o')}필수 약관 2개에 동의하면 결제할 수 있습니다.</p></div></div>`)),
);

export default function U08() {
    return [state1, state2, state3, state4, state5, state6, state7, state8, state9].join('');
}
