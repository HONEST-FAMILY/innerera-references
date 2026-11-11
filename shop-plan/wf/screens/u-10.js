import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Input, Check, Field, Tabs, Overlay, Toast,
    ProductRow, Note, Text, Icon, Divider, SHOP,
} from '../lib/blocks.js';

const TABS = ['회원 로그인', '비회원 주문조회'];
const Social = (o = {}) => `<div style="display:flex;flex-direction:column;gap:8px">
${o.kakao === false ? '' : `<span class="wf-btn lg block" style="border:1.5px solid var(--dark)">${Icon('kakaotalk')}카카오로 3초 만에 시작하기${o.last === 'kakao' ? ' <em style="font-style:normal;font-size:11px;border:1px solid var(--dark);border-radius:10px;padding:0 6px;margin-left:6px">최근 로그인</em>' : ''}</span>`}
${o.naver === false ? '' : `<span class="wf-btn lg block">${Icon('naver-square')}네이버로 시작하기</span>`}
</div>`;
const Or = (t) => `<div style="display:flex;align-items:center;gap:12px;margin:20px 0;font-size:12.5px;color:var(--mute)"><span style="flex:1;height:1px;background:var(--line2)"></span>${t}<span style="flex:1;height:1px;background:var(--line2)"></span></div>`;
const Links = () => `<div style="display:flex;justify-content:center;gap:14px;font-size:13px;color:var(--ink2);margin-top:16px"><u>아이디 찾기</u><span style="color:var(--line)">|</span><u>비밀번호 재설정</u><span style="color:var(--line)">|</span><u><b>회원가입</b></u></div>`;
const ErrBox = (html) => `<div class="wf-note warn" style="margin:0 0 14px;padding:12px 14px;font-size:13px">${Icon('warning')}<span>${html}</span></div>`;

const LoginForm = (o = {}) => [
    o.top || '',
    Field({ label: '이메일' }, Input({ value: o.email || '', placeholder: '가입한 이메일 주소', error: o.err, disabled: o.locked, focus: o.focus })),
    Field({ label: '비밀번호', error: o.fieldErr }, Input({ value: o.pw || '', placeholder: '비밀번호', error: o.err, disabled: o.locked, w: '100%', icon: 'lock-o', suffix: Icon('eye-o') })),
    `<div style="display:flex;justify-content:space-between;margin:-2px 0 16px">${Check('로그인 상태 유지', { on: o.keep })}${Check('아이디 저장', { on: !!o.save })}</div>`,
    Btn('로그인', { kind: 'primary', size: 'lg', block: true, disabled: o.locked }),
    o.locked ? `<div style="margin-top:8px">${Btn('비밀번호 재설정하러 가기', { size: 'lg', block: true, iconRight: 'angle-right-min' })}</div>` : '',
    Links(),
    Or('또는 간편 로그인'),
    Social(o.social),
];
const GuestLookup = (o = {}) => [
    Text('비회원으로 주문한 내역을 주문번호로 조회합니다.', { mute: true, sm: true }),
    Field({ label: '주문번호', help: '주문 완료 알림톡·메일에 적혀 있습니다. 예: 20261111-000131' }, Input({ value: o.no || '', placeholder: '주문번호 (숫자 14자리, 가운데 줄표 포함)' })),
    Field({ label: '주문자 휴대폰 번호' }, Input({ value: o.tel || '', placeholder: '주문할 때 입력한 번호' })),
    Field({ label: '주문 비밀번호' }, Input({ value: o.pw || '', placeholder: '주문할 때 정한 비밀번호', w: '100%', icon: 'lock-o' })),
    Btn('주문 조회', { kind: 'primary', size: 'lg', block: true, disabled: !o.no }),
    `<div style="display:flex;justify-content:center;gap:14px;font-size:13px;color:var(--ink2);margin-top:16px"><u>주문번호를 모르겠어요</u><span style="color:var(--line)">|</span><u>주문 비밀번호 다시 받기</u></div>`,
];
const Panel = (tab, body, o = {}) => `<div style="width:${o.w || 440}px">${o.tabs === false ? '' : Tabs(o.tabList || TABS, tab, { kind: 'box' })}${[].concat(body).join('')}</div>`;
const Page = (tab, body, o = {}) => UserPage({ narrow: true, footer: !!o.footer, title: o.title === undefined ? '로그인' : o.title }, o.before || '', o.tabs === false ? '' : Tabs(o.tabList || TABS, tab, { kind: 'box' }), body);
const Mobile = (tab, body, o = {}) => MobilePage({ title: '로그인', tab: false, right: Icon('close') }, o.before || '', o.tabs === false ? '' : Tabs(o.tabList || TABS, tab, { kind: 'box' }), body);

const state1 = StateBlock({ idx: 1, title: '기본(이메일 + 카카오·네이버)', note: '머리의 로그인, 마이페이지·찜·리뷰 쓰기처럼 로그인이 필요한 곳을 눌렀을 때 오는 화면. 로그인하면 원래 가려던 화면으로 돌아갑니다.' },
    Anno({ title: '왜 이렇게 하나 · 초기값' }, "이메일 로그인과 간편 로그인을 한 화면에 두고, 비회원 주문조회는 탭으로 나눕니다. 초기값: 빈칸, '아이디 저장'·'로그인 상태 유지' 모두 해제(공용 PC 대비). 아이디 저장을 켠 적이 있는 기기에서는 이메일이 채워진 채 시작합니다. 같은 기기에서 마지막에 쓴 간편 로그인 버튼에는 '최근 로그인' 표시를 붙여 어떤 방법으로 가입했는지 헷갈리지 않게 합니다."),
    Anno({ title: '기능 켜고 끄기 · 관리자가 바꾸는 범위' }, '카카오·네이버 로그인은 관리자 설정에서 각각 켜고 끕니다. 둘 다 끄면 "또는 간편 로그인" 구역이 사라지고, 비회원 주문 기능을 끈 몰은 탭 없이 로그인 폼만 나옵니다(아래 오른쪽 캔버스). 간편 로그인으로 처음 들어온 사람은 가입 추가 입력(U-11 상태 3)으로 이어집니다.'),
    Canvas({ label: 'U-10 · 로그인 기본 (아이디 저장을 켠 기기 · 이메일이 채워진 채)' }, Page('회원 로그인', LoginForm({ email: 'minji.kim@example.com', save: true, social: { last: 'kakao' } }), { footer: true })),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-10 · 모바일 로그인 (처음 방문, 빈 입력칸)' }, Mobile('회원 로그인', LoginForm({ focus: true }))),
        Canvas({ size: 'auto', label: '비밀번호 눈 아이콘을 누름 → 글자 보임', right: '입력칸만', pad: 20 }, `<div style="width:400px">${Field({ label: '비밀번호' }, Input({ value: 'Pomegranate26!', w: '100%', icon: 'lock-o', suffix: Icon('eye-off-o') }))}${Text('눈 아이콘을 다시 누르면 가려집니다. 화면을 벗어나면 자동으로 가려집니다.', { mute: true, sm: true })}</div>`),
        Canvas({ size: 'auto', label: '간편 로그인·비회원 주문을 모두 끈 몰', right: '폼만', pad: 24 }, Panel('', [
            Field({ label: '이메일' }, Input({ placeholder: '가입한 이메일 주소' })),
            Field({ label: '비밀번호' }, Input({ placeholder: '비밀번호', w: '100%', icon: 'lock-o', suffix: Icon('eye-o') })),
            `<div style="display:flex;justify-content:space-between;margin:-2px 0 16px">${Check('로그인 상태 유지')}${Check('아이디 저장')}</div>`,
            Btn('로그인', { kind: 'primary', size: 'lg', block: true }),
            Links(),
        ], { tabs: false, w: 400 })),
    ),
    Canvas({ size: 'auto', label: "'카카오로 시작하기' → 카카오 동의 창 (카카오가 그리는 화면, 자리만 표시)", right: '팝업만', pad: 20 },
        `<div class="wf-modal" style="width:400px"><div class="mh"><b>카카오 로그인</b>${Icon('close')}</div><div class="mb"><div style="background:var(--fill);min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-size:13px;color:var(--ink2);text-align:center;padding:16px">${Icon('kakaotalk')}<b>카카오 동의 화면 자리</b>이너에라 Inner:Era 에 제공: 닉네임, 카카오계정(이메일), 전화번호(선택)</div><p class="help">동의를 마치면 창이 닫히고, 이미 가입한 회원은 바로 로그인, 처음이면 추가 입력 화면으로 갑니다. 창을 닫으면 로그인 화면에 그대로 머뭅니다.</p></div></div>`),
);

const state2 = StateBlock({ idx: 2, title: '오류(정보 불일치·잠김)', note: '이메일이나 비밀번호가 맞지 않을 때와, 5회 연속 틀려 로그인이 잠겼을 때의 모습.' },
    Anno({ title: '왜 이렇게 하나' }, '어느 쪽이 틀렸는지는 알려 주지 않습니다(가입된 이메일인지 남이 확인할 수 없게). 대신 남은 횟수를 알려 주고, 3회째부터는 비밀번호 재설정 길을 함께 보여 줍니다. 5회 연속 틀리면 그 계정의 로그인을 10분 동안 잠그고 입력칸을 끈 뒤 비밀번호 재설정으로 안내합니다. 비밀번호를 재설정하면 잠금은 바로 풀립니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '간편 로그인으로만 가입한 회원이 이메일·비밀번호 칸에 로그인하려는 경우가 많습니다. 이때는 불일치 횟수를 세지 않고 "카카오로 가입한 계정입니다" 안내를 띄웁니다. 휴면·탈퇴 계정도 문장이 다릅니다. 잠금 횟수·시간(5회·10분)은 고정값입니다.'),
    Canvas({ label: 'U-10 · 정보 불일치 2회째' }, Page('회원 로그인', LoginForm({
        email: 'minji.kim@example.com', pw: '••••••••', err: true,
        top: ErrBox('<b>이메일 또는 비밀번호가 맞지 않습니다. (2회 / 5회)</b><br>5회 틀리면 10분 동안 로그인이 잠깁니다. 대문자 잠금(Caps Lock)이 켜져 있는지 확인해 주세요.'),
    }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '4회째 (마지막 기회 + 재설정 권유)', right: '폼만', pad: 24 }, Panel('회원 로그인', LoginForm({
            email: 'minji.kim@example.com', pw: '••••••••', err: true,
            top: ErrBox('<b>이메일 또는 비밀번호가 맞지 않습니다. (4회 / 5회)</b><br>한 번 더 틀리면 10분 동안 로그인이 잠깁니다. 비밀번호가 기억나지 않으면 <u><b>비밀번호 재설정</b></u>을 이용해 주세요.'),
        }))),
        Canvas({ size: 'auto', label: '5회 틀려 잠김 (입력칸·로그인 버튼 꺼짐)', right: '폼만', pad: 24 }, Panel('회원 로그인', LoginForm({
            email: 'minji.kim@example.com', pw: '', locked: true,
            top: ErrBox(`${Icon('lock-o')} <b>비밀번호를 5회 잘못 입력해 로그인이 잠겼습니다.</b><br>9분 42초 뒤에 다시 시도하거나, 지금 비밀번호를 재설정하면 바로 로그인할 수 있습니다. 가입한 휴대폰으로 잠금 안내를 보냈습니다.`),
        }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '간편 로그인으로만 가입한 이메일', right: '안내만', pad: 24 }, `<div style="width:440px">${ErrBox('<b>카카오로 가입한 계정입니다.</b><br>아래 <u>카카오로 시작하기</u> 버튼으로 로그인해 주세요. 비밀번호를 따로 만들려면 로그인 뒤 회원정보에서 설정할 수 있습니다.')}</div>`),
        Canvas({ size: 'auto', label: '빈칸으로 로그인을 누름', right: '입력칸만', pad: 24 }, `<div style="width:400px">${Field({ label: '이메일', error: '이메일을 입력해 주세요.' }, Input({ placeholder: '가입한 이메일 주소', error: true, w: '100%' }))}${Field({ label: '비밀번호', error: '비밀번호를 입력해 주세요.' }, Input({ placeholder: '비밀번호', error: true, w: '100%', icon: 'lock-o' }))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '휴면 계정 (1년 넘게 로그인 안 함)', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">휴면 상태인 계정입니다</b><p>2025-10-28 이후 로그인하지 않아 개인정보를 분리 보관하고 있습니다.<br>휴대폰 인증을 하면 바로 다시 이용할 수 있습니다. 적립금과 쿠폰은 그대로입니다.</p></div><div class="mf">${Btn('취소')}${Btn('휴대폰 인증하고 계속', 'primary')}</div></div>`),
        Canvas({ size: 'auto', label: '탈퇴한 계정', right: '안내만', pad: 24 }, `<div style="width:440px">${ErrBox('<b>탈퇴한 계정입니다.</b><br>같은 이메일로는 탈퇴 후 30일이 지나야 다시 가입할 수 있습니다 (2026-12-02 부터 가능).')}</div>`),
        Canvas({ size: 'mobile', label: 'U-10 · 모바일 · 잠김' }, Mobile('회원 로그인', LoginForm({
            email: 'minji.kim@example.com', locked: true, social: { naver: true },
            top: ErrBox(`${Icon('lock-o')} <b>비밀번호를 5회 잘못 입력해 로그인이 잠겼습니다.</b><br>9분 42초 뒤에 다시 시도하거나, 지금 비밀번호를 재설정해 주세요.`),
        }))),
    ),
);

const state3 = StateBlock({ idx: 3, title: '비회원 주문조회 탭', note: "로그인 화면의 두 번째 탭. 비회원 주문 기능을 켠 몰에만 있고, 조회 결과는 U-27 로 이어집니다." },
    Anno({ title: '왜 이렇게 하나' }, '비회원으로 주문한 고객은 "로그인"을 눌러 주문을 찾으려 합니다. 그래서 별도 메뉴를 찾지 않아도 되게 로그인 화면 안에 탭으로 둡니다(서랍 메뉴·바닥글의 "비회원 주문 조회"도 같은 화면 U-27 로 감). 세 값을 모두 넣어야 조회 버튼이 켜집니다.'),
    Anno({ title: '초기값 · 주문번호를 모를 때' }, "초기값은 모두 빈칸. '주문번호를 모르겠어요'를 누르면 주문 때 입력한 휴대폰 번호로 인증한 뒤 최근 주문번호를 알림톡으로 다시 보냅니다. 불일치 오류와 조회 결과는 U-27 에 그렸습니다."),
    Canvas({ label: 'U-10 · 비회원 주문조회 탭 (빈 폼, 조회 버튼 꺼짐)' }, Page('비회원 주문조회', GuestLookup())),
    CanvasRow(
        Canvas({ size: 'auto', label: '세 칸을 모두 채움 → 조회 버튼 켜짐', right: '폼만', pad: 24 }, Panel('비회원 주문조회', GuestLookup({ no: '20261111-000131', tel: '010-5521-8834', pw: '••••••' }))),
        Canvas({ size: 'auto', label: "'주문번호를 모르겠어요' → 팝업", right: '팝업만', pad: 20 }, `<div class="wf-modal" style="width:420px"><div class="mh"><b>주문번호 다시 받기</b>${Icon('close')}</div><div class="mb">${Text('주문할 때 입력한 휴대폰 번호로 최근 3개월 주문번호를 알림톡으로 보내 드립니다.', { sm: true, mute: true })}${Field({ label: '주문자 이름' }, Input({ value: '윤서연' }))}${Field({ label: '주문자 휴대폰 번호', help: '입력한 정보와 맞는 주문이 있을 때만 발송됩니다.' }, Input({ value: '010-5521-8834' }))}</div><div class="mf">${Btn('닫기')}${Btn('주문번호 보내기', 'primary')}</div></div>`),
        Canvas({ size: 'mobile', label: 'U-10 · 모바일 · 비회원 주문조회 탭' }, Mobile('비회원 주문조회', GuestLookup())),
    ),
    Canvas({ size: 'auto', label: "'주문번호 보내기' → 토스트 (맞는 주문이 없어도 같은 문구)", right: '토스트만', pad: 20 }, Toast('입력한 번호로 주문한 내역이 있으면 알림톡으로 주문번호를 보냈습니다.')),
);

const OrderCtx = () => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px 14px;margin-bottom:16px"><div style="font-size:12.5px;color:var(--mute);margin-bottom:8px">${Icon('cart-o')} 주문하려는 상품</div>${ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)', size: 44 })}</div>`;
const GuestOrder = () => `${Or('회원가입 없이 주문하려면')}${Btn('비회원으로 주문하기', { size: 'lg', block: true, iconRight: 'angle-right-min' })}<p class="help" style="text-align:center">비회원 주문은 쿠폰·적립금을 쓸 수 없고, 주문번호와 주문 비밀번호로 조회합니다.</p>`;
const JoinHint = () => `<div style="border:1px dashed var(--ink2);border-radius:6px;padding:12px 14px;margin-top:14px;font-size:13px;display:flex;justify-content:space-between;align-items:center;gap:10px"><span>${Icon('gift-o')} 지금 가입하면 <b>3,000원 쿠폰</b>을 이 주문에 바로 쓸 수 있습니다.</span>${Btn('회원가입', { size: 'sm' })}</div>`;

const state4 = StateBlock({ idx: 4, title: '주문하기 중 진입(비회원으로 주문하기 노출)', note: "로그인하지 않은 채 장바구니의 '주문하기'나 상품 상세의 '바로 구매'를 눌렀을 때. 로그인하면 주문서(U-08)로 바로 이어집니다." },
    Anno({ title: '왜 이렇게 하나' }, '결제 직전에 가입을 강제하면 이탈이 큽니다. 그래서 주문 중에 들어온 경우에만 로그인 폼 아래에 "비회원으로 주문하기"를 보여 줍니다. 무엇을 사려던 중인지 잊지 않게 맨 위에 주문하려는 상품을 한 줄로 보여 주고, 로그인·가입·비회원 어느 길로 가도 담아 둔 상품은 그대로 주문서로 넘어갑니다(비로그인 장바구니는 로그인하면 회원 장바구니와 합쳐짐).'),
    Anno({ title: '기능 켜고 끄기' }, '비회원 주문 기능을 끈 몰은 "비회원으로 주문하기" 버튼과 비회원 주문조회 탭이 없고, 대신 가입 혜택 안내만 나옵니다(오른쪽 캔버스). 머리의 로그인으로 들어온 일반 진입(상태 1)에는 이 버튼이 나오지 않습니다. 가입 쿠폰 금액은 혜택 > 쿠폰의 가입 자동 발급 쿠폰 값입니다.'),
    Canvas({ label: "U-10 · 장바구니 '주문하기' → 로그인 (비회원 주문 켠 몰)" }, Page('회원 로그인', [LoginForm({ social: {} }), GuestOrder(), JoinHint()], { title: '로그인하고 주문하기', before: OrderCtx() })),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-10 · 모바일 · 주문하기 중 진입' }, Mobile('회원 로그인', [LoginForm({ social: {} }), GuestOrder()], { before: OrderCtx() })),
        Canvas({ size: 'auto', label: '비회원 주문을 끈 몰 (버튼·탭 없음, 가입 혜택만)', right: '폼만', pad: 24 }, Panel('', [OrderCtx(), LoginForm({ social: {} }), JoinHint()], { tabs: false })),
    ),
    Canvas({ size: 'auto', label: '로그인 성공 → 주문서로 넘어가며 뜨는 토스트 (비로그인 때 담은 상품이 합쳐진 경우)', right: '토스트만', pad: 20 }, Toast('김민지 님, 로그인했습니다. 장바구니에 담아 둔 상품 1개와 합쳤습니다.')),
);

export default function U10() {
    return [state1, state2, state3, state4].join('');
}
