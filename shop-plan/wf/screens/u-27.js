import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Badge, OrderBadge, Input, Field, Timeline, Modal, Toast,
    ProductRow, Box, KV, Note, Text, Icon, Flex, SHOP,
} from '../lib/blocks.js';

const NO = '20261111-000131';
const W = (w, ...body) => `<div style="width:${w}px">${body.join('')}</div>`;
const Page = (body, o = {}) => UserPage({ narrow: !o.wide, footer: !!o.footer, title: o.title || '비회원 주문 조회', crumb: o.crumb }, body);
const Mobile = (body, o = {}) => MobilePage({ title: o.title || '비회원 주문 조회', tab: o.tab === undefined ? false : o.tab, bottom: o.bottom }, body);
const Warn = (html, icon = 'warning') => `<div class="wf-note warn" style="margin:0 0 14px;padding:12px 14px;font-size:13px">${Icon(icon)}<span>${html}</span></div>`;
const linkRow = (...l) => `<div style="display:flex;justify-content:center;gap:14px;font-size:13px;color:var(--ink2);margin-top:16px;flex-wrap:wrap">${l.map((t) => `<u>${t}</u>`).join('<span style="color:var(--line)">|</span>')}</div>`;

const Form = (o = {}) => [
    o.top || '',
    Text('비회원으로 주문할 때 받은 주문번호와, 그때 입력한 휴대폰 번호·주문 비밀번호를 입력해 주세요.', { mute: true, sm: true }),
    Field({ label: '주문번호', help: o.noErr ? undefined : '주문 완료 알림톡·메일에 적혀 있습니다. 예: 20261111-000131', error: o.noErr }, Input({ value: o.no || '', placeholder: '주문번호 14자리', error: !!o.noErr || o.err, disabled: o.locked, focus: o.focus })),
    Field({ label: '주문자 휴대폰 번호', error: o.telErr }, Input({ value: o.tel || '', placeholder: '주문할 때 입력한 번호', error: !!o.telErr || o.err, disabled: o.locked })),
    Field({ label: '주문 비밀번호', error: o.pwErr }, Input({ value: o.pw || '', placeholder: '주문할 때 정한 비밀번호 (4~12자)', w: '100%', icon: 'lock-o', suffix: Icon('eye-o'), error: !!o.pwErr || o.err, disabled: o.locked })),
    Btn('주문 조회', { kind: 'primary', size: 'lg', block: true, disabled: !o.ok }),
    linkRow('주문번호를 모르겠어요', '주문 비밀번호 다시 받기'),
    o.member === false ? '' : `<div style="border-top:1px solid var(--line2);margin-top:20px;padding-top:16px;display:flex;justify-content:space-between;align-items:center;font-size:13px"><span>회원으로 주문하셨나요?</span>${Btn('로그인하고 주문 목록 보기', { size: 'sm' })}</div>`,
].join('');

const state1 = StateBlock({ idx: 1, title: '조회 폼', note: '서랍 메뉴·바닥글의 "비회원 주문 조회", 로그인 화면의 비회원 주문조회 탭, 주문 완료 알림톡의 링크로 들어오는 화면. 비회원 주문 기능을 켠 몰에만 있습니다.' },
    Anno({ title: '왜 이렇게 하나 · 초기값' }, '주문번호 + 휴대폰 번호 + 주문 비밀번호 세 가지가 모두 맞아야 열립니다(골격 D7). 주문번호만으로 열리면 남의 배송지가 보이기 때문입니다. 초기값은 빈칸이며, 알림톡의 "주문 조회" 링크로 들어오면 주문번호가 채워진 채 시작해 나머지 둘만 입력하면 됩니다. 세 칸을 모두 채워야 조회 버튼이 켜집니다. 줄표(-)·띄어쓰기는 넣어도 빼도 됩니다.'),
    Anno({ title: '잊었을 때의 길' }, '주문번호를 모르면 주문자 이름 + 휴대폰 번호로 최근 3개월 주문번호를 알림톡으로 다시 받습니다. 주문 비밀번호를 잊으면 주문번호 + 휴대폰 인증번호로 본인을 확인한 뒤 새 주문 비밀번호를 정합니다. 두 길 모두 주문 때 입력한 휴대폰으로만 보내므로 고객센터 손을 거치지 않습니다.'),
    Canvas({ label: 'U-27 · 조회 폼 (빈칸, 조회 버튼 꺼짐)' }, Page(Form({ focus: true }), { footer: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: '알림톡 링크로 들어옴 (주문번호가 채워진 채) → 나머지 입력', right: '폼만', pad: 24 }, W(440, Form({ no: NO, tel: '010-5521-8834', pw: '••••••', ok: true, member: false }))),
        Canvas({ size: 'auto', label: "'주문번호를 모르겠어요' → 팝업", right: '팝업만', pad: 20 }, Modal({ title: '주문번호 다시 받기', w: 420, foot: [Btn('닫기'), Btn('주문번호 보내기', 'primary')] },
            Text('주문할 때 입력한 휴대폰 번호로 최근 3개월 주문번호를 알림톡으로 보내 드립니다.', { sm: true, mute: true }),
            Field({ label: '주문자 이름' }, Input({ value: '윤서연' })),
            Field({ label: '주문자 휴대폰 번호', help: '입력한 정보와 맞는 주문이 있을 때만 발송됩니다.' }, Input({ value: '010-5521-8834' })))),
        Canvas({ size: 'mobile', label: 'U-27 · 모바일 조회 폼' }, Mobile(Form({}))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: "'주문 비밀번호 다시 받기' → 1. 본인 확인 (인증번호 발송됨)", right: '팝업만', pad: 20 }, Modal({ title: '주문 비밀번호 다시 정하기', w: 440, foot: [Btn('닫기'), Btn('다음', { kind: 'primary', disabled: true })] },
            Field({ label: '주문번호' }, Input({ value: NO })),
            Field({ label: '주문자 휴대폰 번호' }, Flex({ gap: 8 }, `<span style="flex:1">${Input({ value: '010-5521-8834', w: '100%' })}</span>`, Btn('재발송 (26초)', { kind: 'line', disabled: true })),
                `<div style="display:flex;gap:8px;margin-top:8px"><span style="flex:1">${Input({ placeholder: '인증번호 6자리', w: '100%', suffix: '02:54', focus: true })}</span>${Btn('확인', { disabled: true })}</div><p class="help">010-5521-8834 로 인증번호를 보냈습니다. 3분 안에 입력해 주세요.</p>`))),
        Canvas({ size: 'auto', label: '2. 인증 완료 → 새 주문 비밀번호', right: '팝업만', pad: 20 }, Modal({ title: '주문 비밀번호 다시 정하기', w: 440, foot: [Btn('닫기'), Btn('저장하고 주문 조회', 'primary')] },
            `<p class="help" style="color:var(--ink);font-weight:700;margin:0 0 12px">${Icon('check-circle-o')} 휴대폰 인증을 마쳤습니다. 주문 ${NO}</p>`,
            Field({ label: '새 주문 비밀번호', help: '숫자·영문 4~12자' }, Input({ value: '••••••', w: '100%', icon: 'lock-o' })),
            Field({ label: '새 주문 비밀번호 확인' }, Input({ value: '••••••', w: '100%', icon: 'lock-o' })))),
        Canvas({ size: 'auto', label: "'주문번호 보내기' → 토스트", right: '토스트만', pad: 20 }, Toast('입력한 번호로 주문한 내역이 있으면 알림톡으로 주문번호를 보냈습니다.')),
    ),
);

const STATUS = {
    입금대기: { desc: '2026-11-14(토) 23:59 까지 입금해 주세요. 기한이 지나면 자동으로 취소됩니다.', btns: [Btn('입금 계좌 다시 보기', 'primary'), Btn('주문 취소')] },
    결제완료: { desc: '결제를 확인했습니다. 출고 준비를 시작하기 전까지 바로 취소할 수 있습니다.', btns: [Btn('주문 취소', 'primary'), Btn('배송지 변경'), Btn('1:1 문의')] },
    배송준비: { desc: '상품을 포장하고 있습니다. 지금부터는 취소를 요청하면 운영자 확인 뒤 처리됩니다.', btns: [Btn('취소 요청', 'primary'), Btn('1:1 문의')] },
    배송중: { desc: 'CJ대한통운 5812-3344-1027 · 2026-11-12(목) 08:20 배송 출발', btns: [Btn('배송 조회', 'primary'), Btn('1:1 문의')] },
    배송완료: { desc: '2026-11-13(금) 배송 완료 · 2026-11-20(금) 에 자동으로 구매확정됩니다.', btns: [Btn('구매확정', 'primary'), Btn('반품 신청'), Btn('교환 신청'), Btn('배송 조회')] },
    구매확정: { desc: '2026-11-20(금) 구매확정 · 반품·교환 신청 기간이 끝났습니다.', btns: [Btn('같은 상품 다시 주문', 'primary'), Btn('영수증')] },
    취소완료: { desc: '2026-11-11(수) 15:02 취소 · 신용카드 93,000원 승인 취소 (카드사에 따라 3~5영업일)', btns: [Btn('같은 상품 다시 주문', 'primary'), Btn('취소 내역 보기')] },
    반품요청: { desc: '2026-11-14(토) 반품 신청 · 운영자 확인 뒤 택배 기사님이 회수하러 방문합니다.', btns: [Btn('반품 진행 보기', 'primary'), Btn('반품 신청 철회')] },
};
const StatusHead = (s) => `<div style="border:2px solid var(--dark);border-radius:8px;padding:16px 20px;margin-bottom:16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">${OrderBadge(s)}<b style="font-size:16px">${s}</b></div><div style="font-size:13px;color:var(--ink2)">${STATUS[s].desc}</div></div><div style="display:flex;gap:6px;flex-wrap:wrap">${STATUS[s].btns.join('')}</div></div></div>`;
const GuestBar = () => `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--box);border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px"><span>${Icon('user-o')} <b>윤서연</b> 님의 비회원 주문 · 주문번호 <b>${NO}</b> · 2026-11-11(수) 14:07 주문</span><span style="display:flex;gap:8px">${Btn('다른 주문 조회', { size: 'sm' })}${Btn('조회 끝내기', { size: 'sm', icon: 'log-out' })}</span></div>`;
const pr = (rows, total) => `${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--ink2)"><span>${k}</span><span>${v}</span></div>`).join('')}<div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--dark);margin-top:8px;padding-top:12px;font-weight:700"><span>${total[0]}</span><b style="font-size:19px">${total[1]}</b></div>`;
const Detail = (s) => [
    GuestBar(),
    StatusHead(s),
    Box({ title: '주문 상품' }, ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)', right: `<span style="margin-left:12px">${OrderBadge(s)}</span>` })),
    `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start"><div>${Box({ title: '배송지', right: s === '결제완료' ? Btn('변경', { size: 'sm' }) : '' }, KV([['받는 분', '윤서연'], ['연락처', '010-****-8834'], ['주소', '(06236) 서울 강남구 테헤란로 ***, 7층 702호'], ['배송 요청', '경비실에 맡겨 주세요']]))}</div><div>${Box({ title: '결제 정보', right: Btn('영수증', { size: 'sm', icon: 'receipt' }) }, pr([['상품 금액', '93,000원'], ['배송비', '0원']], ['결제한 금액', '93,000원']), `<div style="margin-top:10px;font-size:13px;color:var(--ink2)">신용카드 · 신한카드(일시불) · 2026-11-11 14:07</div>`)}</div></div>`,
    `<div style="border:1px dashed var(--ink2);border-radius:6px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px"><span>${Icon('gift-o')} <b>회원가입하면 이 주문이 내 주문 목록에 담기고</b>, 구매확정 때 930원이 적립됩니다. 리뷰 작성도 회원만 할 수 있습니다.</span>${Btn('회원가입', { kind: 'primary', size: 'sm' })}</div>`,
].join('');

const state2 = StateBlock({ idx: 2, title: '조회 결과(주문 상세와 같은 버튼)', note: '세 값이 맞으면 그 주문의 상세가 열립니다. 회원 주문 상세(U-15)와 같은 내용·같은 상태별 버튼이며, 마이페이지 메뉴만 없습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '비회원이라고 할 수 있는 일이 줄어들면 고객센터 전화로 돌아옵니다. 그래서 취소·배송 조회·구매확정·반품·교환 신청을 회원과 똑같이 스스로 하게 합니다. 누르면 뜨는 화면도 회원과 같습니다(취소·반품·교환 신청 U-16, 배송 조회 U-18, 입금 계좌 U-15). 다른 점은 세 가지 — 왼쪽 마이페이지 메뉴가 없고, 위에 "다른 주문 조회 / 조회 끝내기"가 있고, 리뷰 쓰기·적립 관련 버튼이 없고 대신 회원가입 권유가 붙습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '조회에 성공하면 이 브라우저에서 30분 동안 그 주문만 볼 수 있고(다른 주문은 다시 조회), 30분이 지나거나 "조회 끝내기"를 누르면 조회 폼으로 돌아갑니다. 환불 계좌가 필요한 가상계좌 주문 취소는 신청 화면에서 계좌를 입력받습니다. 비회원에게는 적립금·쿠폰 줄이 없습니다.'),
    Canvas({ label: 'U-27 · 조회 결과 · 배송중인 주문' }, Page(Detail('배송중'), { wide: true, title: '비회원 주문 상세', crumb: ['홈', '비회원 주문 조회', NO] })),
    Text('상태마다 달라지는 머리 상자와 버튼 (회원 주문 상세 U-15 와 같은 규칙)', { b: true }),
    CanvasRow(
        Canvas({ size: 'auto', label: '입금대기', right: '상태 상자만', pad: 20 }, W(600, StatusHead('입금대기'))),
        Canvas({ size: 'auto', label: '결제완료 (바로 취소 가능)', right: '상태 상자만', pad: 20 }, W(600, StatusHead('결제완료'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '배송준비 (취소는 요청으로)', right: '상태 상자만', pad: 20 }, W(600, StatusHead('배송준비'))),
        Canvas({ size: 'auto', label: '배송완료', right: '상태 상자만', pad: 20 }, W(600, StatusHead('배송완료'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '구매확정', right: '상태 상자만', pad: 20 }, W(600, StatusHead('구매확정'))),
        Canvas({ size: 'auto', label: '취소완료', right: '상태 상자만', pad: 20 }, W(600, StatusHead('취소완료'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '반품요청', right: '상태 상자만', pad: 20 }, W(600, StatusHead('반품요청'))),
        Canvas({ size: 'auto', label: "배송중 · '배송 조회' → 팝업 (U-18 과 같음)", right: '팝업만', pad: 20 }, Modal({ title: '배송 조회', w: 440, foot: [Btn('닫기')] },
            KV([['택배사', 'CJ대한통운'], ['송장번호', '5812-3344-1027'], ['받는 분', '윤서연']]),
            `<div style="height:14px"></div>`,
            Timeline([{ t: '배송 출발', d: '강남 역삼 · 배송기사 010-****-4410', time: '11-12 08:20', on: true }, { t: '간선 하차', d: '강남 터미널', time: '11-12 04:10' }, { t: '간선 상차', d: '인천 허브', time: '11-11 22:35' }, { t: '집화 처리', d: '인천 제물포', time: '11-11 17:40' }]))),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-27 · 모바일 조회 결과 · 배송완료 (버튼은 하단 고정)' }, Mobile([
            `<div style="background:var(--box);border-radius:6px;padding:10px 12px;font-size:12.5px;margin-bottom:12px">${Icon('user-o')} 윤서연 님의 비회원 주문<br><b>${NO}</b> · 2026-11-11(수) 주문</div>`,
            `<div style="border:2px solid var(--dark);border-radius:8px;padding:14px;margin-bottom:12px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">${OrderBadge('배송완료')}<b>배송완료</b></div><div style="font-size:12.5px;color:var(--ink2)">${STATUS.배송완료.desc}</div></div>`,
            Box({ title: '주문 상품' }, ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' })),
            Box({ title: '배송지' }, Text('윤서연 · 010-****-8834', { sm: true }), Text('(06236) 서울 강남구 테헤란로 ***, 7층 702호', { sm: true })),
            Box({ title: '결제 정보' }, pr([['상품 금액', '93,000원'], ['배송비', '0원']], ['결제한 금액', '93,000원'])),
            `<div style="display:flex;gap:8px">${Btn('반품 신청', { block: true })}${Btn('교환 신청', { block: true })}${Btn('배송 조회', { block: true })}</div>`,
        ].join(''), { title: '비회원 주문 상세', bottom: [Btn('구매확정', 'primary')] })),
        Canvas({ size: 'auto', label: "결제완료 · '주문 취소' → 확인 (즉시 취소·자동 환불)", right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">이 주문을 취소할까요?</b><p>${SHOP.productShort} · 2박스(28일분) 1개<br>신용카드 93,000원이 바로 승인 취소됩니다.<br>카드사에 따라 취소 반영까지 3~5영업일 걸릴 수 있습니다.</p></div><div class="mf">${Btn('닫기')}${Btn('주문 취소', 'danger')}</div></div>`),
        Canvas({ size: 'auto', label: '30분이 지나 조회가 끝남', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:360px"><div class="mb"><b class="ct">조회 시간이 끝났습니다</b><p>개인정보 보호를 위해 비회원 주문 조회는 30분 동안만 유지됩니다. 다시 조회해 주세요.</p></div><div class="mf">${Btn('다시 조회하기', 'primary')}</div></div>`),
    ),
);

const state3 = StateBlock({ idx: 3, title: '정보 불일치', note: '입력한 세 값 중 하나라도 맞지 않거나, 형식이 틀렸을 때.' },
    Anno({ title: '왜 이렇게 하나' }, '세 값 중 어느 것이 틀렸는지는 알려 주지 않습니다(주문번호가 실제로 있는지 남이 확인할 수 없게). 대신 형식이 틀린 것(자릿수 부족 등)은 칸마다 바로 알려 주고, 불일치 안내에는 흔한 원인 — 회원으로 주문한 경우, 주문번호 오타, 잊어버린 주문 비밀번호 — 과 그 해결 길을 함께 적습니다. 입력한 값은 지우지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '같은 주문번호에 대해 5회 연속 틀리면 그 주문의 조회를 10분 동안 막고 주문자 휴대폰으로 알림을 보냅니다(비밀번호를 하나씩 넣어 보는 시도 차단). 스마트스토어에서 주문한 고객이 여기서 조회하려는 경우가 있어 주문번호 16자리를 넣으면 네이버에서 조회하라고 따로 안내합니다.'),
    Canvas({ label: "U-27 · '주문 조회'를 눌렀는데 일치하는 주문이 없음 (2회째)" }, Page(Form({
        no: '20261111-000113', tel: '010-5521-8834', pw: '••••••', err: true, ok: true,
        top: Warn('<b>입력한 정보와 일치하는 주문이 없습니다. (2회 / 5회)</b><br>주문번호·휴대폰 번호·주문 비밀번호를 다시 확인해 주세요. 회원으로 주문했다면 로그인 뒤 마이페이지에서 확인할 수 있습니다.'),
    }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '형식 오류 (칸마다 문장)', right: '폼만', pad: 24 }, W(440, Form({
            no: '2026111-131', noErr: '주문번호는 숫자 14자리입니다. 예: 20261111-000131', tel: '010-5521-88', telErr: '휴대폰 번호 11자리를 숫자로 입력해 주세요.', pw: '•••', pwErr: '주문 비밀번호는 4자 이상입니다.', member: false,
        }))),
        Canvas({ size: 'auto', label: '5회 틀려 10분 동안 막힘', right: '폼만', pad: 24 }, W(440, Form({
            no: '20261111-000131', tel: '010-5521-8834', pw: '', locked: true, member: false,
            top: Warn('<b>5회 잘못 입력해 이 주문의 조회가 잠겼습니다.</b><br>9분 30초 뒤에 다시 시도하거나, 아래 "주문 비밀번호 다시 받기"로 새 비밀번호를 정해 주세요. 주문자 휴대폰으로 안내를 보냈습니다.', 'lock-o'),
        }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '스마트스토어 주문번호(16자리)를 넣은 경우', right: '안내만', pad: 24 }, W(440, Warn(`<b>네이버 스마트스토어에서 주문하신 것 같습니다.</b><br>스마트스토어 주문은 네이버 쇼핑 주문 내역(네이버페이 > 결제 내역)에서 조회·취소·반품할 수 있습니다.`, 'naver-square'), Btn('네이버 주문 내역 열기', { block: true, iconRight: 'external-link' }))),
        Canvas({ size: 'mobile', label: 'U-27 · 모바일 · 정보 불일치' }, Mobile(Form({
            no: '20261111-000113', tel: '010-5521-8834', pw: '••••••', err: true, ok: true, member: false,
            top: Warn('<b>입력한 정보와 일치하는 주문이 없습니다. (2회 / 5회)</b><br>주문번호·휴대폰 번호·주문 비밀번호를 다시 확인해 주세요.'),
        }))),
        Canvas({ size: 'auto', label: '비회원 주문 기능을 끈 몰에서 이 주소로 들어옴 → 로그인 화면(U-10)으로 보내며 뜨는 토스트', right: '토스트만', pad: 20 }, Toast('이 쇼핑몰은 회원 주문만 받습니다. 로그인하면 마이페이지에서 주문을 볼 수 있습니다.', { icon: 'info-o' })),
    ),
);

export default function U27() {
    return [state1, state2, state3].join('');
}
