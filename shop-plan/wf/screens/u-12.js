import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Badge, Input, Field, Tabs, Toast, Stepper,
    Note, Text, Icon, Flex, Empty,
} from '../lib/blocks.js';

const TABS = ['아이디 찾기', '비밀번호 재설정'];
const W = (w, ...body) => `<div style="width:${w}px">${body.join('')}</div>`;
const Page = (tab, body, o = {}) => UserPage({ narrow: true, footer: !!o.footer, title: '아이디·비밀번호 찾기' }, Tabs(TABS, tab, { kind: 'box' }), body);
const Mobile = (tab, body) => MobilePage({ title: '아이디·비밀번호 찾기', tab: false, right: Icon('close') }, Tabs(TABS, tab, { kind: 'box' }), body);
const okLine = (t) => `<p class="help" style="color:var(--ink);font-weight:700">${Icon('check-circle-o')} ${t}</p>`;

const Phone = (s, o = {}) => {
    const tel = s === 'empty' ? '' : '010-1234-1234';
    const btn = { empty: Btn('인증번호 받기', { kind: 'line', disabled: true }), typed: Btn('인증번호 받기', { kind: 'line' }), sent: Btn('재발송 (26초)', { kind: 'line', disabled: true }), resend: Btn('재발송', { kind: 'line' }), wrong: Btn('재발송', { kind: 'line' }), expired: Btn('재발송', { kind: 'line' }), done: Btn('인증 완료', { kind: 'line', disabled: true, icon: 'check' }) }[s];
    const code = (v, timer, x = {}) => `<div style="display:flex;gap:8px;margin-top:8px"><span class="grow" style="flex:1">${Input({ value: v, placeholder: '인증번호 6자리', w: '100%', suffix: timer, error: x.error, focus: x.focus, disabled: x.disabled })}</span>${Btn('확인', { kind: x.disabled ? 'line' : 'primary', disabled: x.disabled || !v })}</div>`;
    const below = {
        empty: '', typed: '',
        sent: `${code('', '02:54', { focus: true })}<p class="help">010-1234-1234 로 인증번호를 보냈습니다. 3분 안에 입력해 주세요. 재발송은 30초 뒤부터 할 수 있습니다.</p>`,
        resend: `${code('', '02:58', { focus: true })}<p class="help">인증번호를 다시 보냈습니다 (2회 / 하루 5회). 앞서 받은 번호는 쓸 수 없습니다.</p>`,
        wrong: `${code('482199', '01:37', { error: true })}<p class="err">${Icon('error-o')}인증번호가 맞지 않습니다. 문자로 받은 6자리를 다시 확인해 주세요. (2회 / 5회)</p>`,
        expired: `${code('', '00:00', { disabled: true })}<p class="err">${Icon('error-o')}입력 시간이 지났습니다. '재발송'을 눌러 새 인증번호를 받아 주세요.</p>`,
        done: okLine('휴대폰 인증을 마쳤습니다.'),
    }[s];
    return Field({ label: o.label || '가입한 휴대폰 번호', help: s === 'empty' || s === 'typed' ? o.help : undefined },
        Flex({ gap: 8 }, `<span style="flex:1">${Input({ value: tel, placeholder: '010-0000-0000', w: '100%', disabled: s === 'done' })}</span>`, btn), below);
};

const FindIdForm = (s) => [
    Text('가입할 때 등록한 이름과 휴대폰 번호로 이메일 아이디를 찾습니다.', { mute: true, sm: true }),
    Field({ label: '이름' }, Input({ value: s === 'empty' ? '' : '김민지', placeholder: '가입한 이름' })),
    Phone(s),
    Btn('아이디 찾기', { kind: 'primary', size: 'lg', block: true, disabled: s !== 'done' }),
].join('');
const IdResult = (o = {}) => [
    `<div style="text-align:center;padding:4px 0 16px"><div style="font-size:44px;line-height:1">${Icon('check-circle-o')}</div><h2 style="font-size:19px;margin:10px 0 4px">김민지 님의 아이디를 찾았습니다</h2><p style="margin:0;font-size:13px;color:var(--ink2)">개인정보 보호를 위해 일부를 가렸습니다.</p></div>`,
    `<div style="border:1px solid var(--line);border-radius:6px;margin-bottom:12px">${(o.list || [['mi****@example.com', '이메일 가입', '2026-09-14 가입']]).map(([id, via, at], i) => `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 16px;${i ? 'border-top:1px solid var(--line2)' : ''}"><div><b style="font-size:16px">${id}</b><div style="font-size:12.5px;color:var(--mute)">${at}</div></div>${Badge(via, via === '이메일 가입' ? 'line' : 'bold')}</div>`).join('')}</div>`,
    o.social ? Note('카카오로 가입한 계정은 비밀번호가 없습니다. 로그인 화면에서 "카카오로 시작하기"를 눌러 주세요.') : '',
    `<div style="margin-bottom:8px">${Btn('전체 이메일 주소를 알림톡으로 받기', { block: true, icon: 'kakaotalk' })}</div>`,
    `<div style="display:flex;gap:8px"><span style="flex:1">${Btn('비밀번호 재설정', { size: 'lg', block: true })}</span><span style="flex:1">${Btn('로그인하기', { kind: 'primary', size: 'lg', block: true })}</span></div>`,
].join('');

const state1 = StateBlock({ idx: 1, title: '아이디 찾기 결과', note: "로그인 화면의 '아이디 찾기'로 들어와 이름과 휴대폰 인증을 마친 뒤의 결과. 인증 전 폼과 인증 과정도 함께 그렸습니다." },
    Anno({ title: '왜 이렇게 하나' }, '아이디(이메일)는 화면에 앞 2글자만 보여 주고 나머지는 가립니다(뒤에서 화면을 본 사람이 알 수 없게). 전체 주소가 필요하면 인증한 휴대폰으로 알림톡을 보냅니다. 결과에서 바로 로그인이나 비밀번호 재설정으로 이어지게 버튼을 둡니다. 같은 번호로 가입 경로가 다른 계정이 있으면(이메일·카카오) 모두 보여 주고 어떤 방법으로 가입했는지 배지로 구분합니다.'),
    Anno({ title: '기능 켜고 끄기' }, '휴대폰 본인인증을 끈 몰은 인증번호 단계 없이 이름 + 휴대폰 번호가 일치하면 가린 아이디를 보여 주고, 전체 주소는 가입한 휴대폰으로만 보냅니다. 인증번호 규칙(6자리·3분·재발송 30초 간격·하루 5회)은 회원가입(U-11)과 같습니다.'),
    Canvas({ label: 'U-12 · 아이디 찾기 결과 (이메일 가입 계정 1개)' }, Page('아이디 찾기', IdResult(), { footer: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: '결과 전 · 빈 폼', right: '폼만', pad: 24 }, W(420, FindIdForm('empty'))),
        Canvas({ size: 'auto', label: '인증번호 발송됨', right: '폼만', pad: 24 }, W(420, FindIdForm('sent'))),
        Canvas({ size: 'auto', label: '인증 완료 → 아이디 찾기 버튼 켜짐', right: '폼만', pad: 24 }, W(420, FindIdForm('done'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '계정이 2개인 경우 (이메일 + 카카오)', right: '결과만', pad: 24 }, W(440, IdResult({ social: true, list: [['mi****@example.com', '이메일 가입', '2026-09-14 가입'], ['mi****@kakao.com', '카카오 가입', '2026-10-02 가입']] }))),
        Canvas({ size: 'mobile', label: 'U-12 · 모바일 · 아이디 찾기 결과' }, Mobile('아이디 찾기', IdResult())),
        Canvas({ size: 'auto', label: "'전체 이메일 주소를 알림톡으로 받기' → 토스트", right: '토스트만', pad: 20 }, Toast('010-****-1234 로 아이디를 알림톡으로 보냈습니다.')),
    ),
);

const RESET_STEPS = ['본인 확인', '새 비밀번호', '완료'];
const PwRules = (ok = []) => `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;font-size:12px">${['8자 이상', '영문·숫자·특수문자 중 2가지 이상', '이메일 주소와 다름'].map((r, i) => `<span style="color:${ok[i] ? 'var(--ink)' : 'var(--mute)'};font-weight:${ok[i] ? 700 : 400}">${Icon(ok[i] ? 'check-circle-o' : 'minus-min')} ${r}</span>`).join('')}</div>`;
const ResetVerify = (s) => [
    Stepper(RESET_STEPS, 0),
    Text('가입한 이메일과 휴대폰 번호를 확인한 뒤 새 비밀번호를 만듭니다.', { mute: true, sm: true }),
    Field({ label: '이메일 아이디' }, Input({ value: s === 'empty' ? '' : 'minji.kim@example.com', placeholder: '가입한 이메일 주소' })),
    Phone(s),
    Btn('다음', { kind: 'primary', size: 'lg', block: true, disabled: s !== 'done' }),
    s === 'empty' ? `<p style="text-align:center;font-size:13px;color:var(--ink2);margin-top:14px">휴대폰 번호가 바뀌었나요? <u>이메일로 재설정 링크 받기</u></p>` : '',
].join('');
const NewPw = (o = {}) => [
    Stepper(RESET_STEPS, 1),
    Text('<b>minji.kim@example.com</b> 계정의 새 비밀번호를 입력해 주세요.', { sm: true }),
    Field({ label: '새 비밀번호', error: o.err1 }, Input({ value: o.pw || '', placeholder: '새 비밀번호', w: '100%', icon: 'lock-o', suffix: Icon('eye-o'), error: !!o.err1, focus: o.focus }), PwRules(o.rules)),
    Field({ label: '새 비밀번호 확인', error: o.err2 }, Input({ value: o.pw2 || '', placeholder: '한 번 더 입력', w: '100%', icon: 'lock-o', error: !!o.err2 }), o.same ? okLine('비밀번호가 일치합니다.') : ''),
    Btn('비밀번호 바꾸기', { kind: 'primary', size: 'lg', block: true, disabled: !o.ok }),
].join('');
const ResetDone = () => [
    Stepper(RESET_STEPS, 2),
    `<div style="text-align:center;padding:8px 0 18px"><div style="font-size:44px;line-height:1">${Icon('check-circle-o')}</div><h2 style="font-size:19px;margin:10px 0 6px">비밀번호를 바꿨습니다</h2><p style="margin:0;font-size:13px;color:var(--ink2)">새 비밀번호로 로그인해 주세요. 다른 기기에서는 모두 로그아웃되었습니다.<br>로그인 잠금도 함께 풀렸습니다.</p></div>`,
    Note('비밀번호 변경 사실을 알림톡(010-****-1234)과 메일로 알려 드렸습니다. 본인이 바꾼 것이 아니라면 고객센터로 바로 연락해 주세요.'),
    Btn('로그인하기', { kind: 'primary', size: 'lg', block: true }),
].join('');
const PC = (label, body, w = 420) => Canvas({ size: 'auto', label, right: '폼만', pad: 24 }, W(w, body));

const state2 = StateBlock({ idx: 2, title: '비밀번호 재설정(인증번호 발송됨·재발송·확인 완료)', note: "로그인 화면의 '비밀번호 재설정', 또는 로그인 5회 실패로 잠겼을 때 안내를 따라 들어오는 화면. 본인 확인 → 새 비밀번호 → 완료 세 단계입니다." },
    Anno({ title: '왜 이렇게 하나' }, '기존 비밀번호는 알려 줄 수 없으므로(저장할 때 되돌릴 수 없게 바꿔 둠) "찾기"가 아니라 "재설정"입니다. 휴대폰 인증번호로 본인을 확인하고 바로 새 비밀번호를 만들게 합니다. 인증번호는 3분 동안 유효하고 남은 시간을 입력칸 안에 보여 주며, 재발송은 30초 뒤부터 켜집니다(연속 발송 방지). 재발송하면 앞의 번호는 무효가 됩니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '재설정을 마치면 모든 기기에서 로그아웃시키고 변경 알림을 보냅니다(계정 도용 대비). 휴대폰 번호가 바뀐 회원을 위해 가입 이메일로 재설정 링크(30분 유효)를 받는 길을 둡니다. 간편가입 전용 계정은 비밀번호가 없으므로 안내만 하고 재설정을 진행하지 않습니다.'),
    Canvas({ label: 'U-12 · 비밀번호 재설정 · 인증번호 발송됨 (남은 시간 02:54, 재발송은 26초 뒤)' }, Page('비밀번호 재설정', ResetVerify('sent'))),
    CanvasRow(
        PC('처음 · 빈 폼', ResetVerify('empty')),
        PC('재발송함 (새 번호, 시간 다시 시작)', ResetVerify('resend')),
        PC('인증번호 틀림', ResetVerify('wrong')),
    ),
    CanvasRow(
        PC('입력 시간 지남', ResetVerify('expired')),
        PC('확인 완료 → 다음 켜짐', ResetVerify('done')),
        PC('새 비밀번호 입력 (빈 폼)', NewPw({ focus: true })),
    ),
    CanvasRow(
        PC('새 비밀번호 · 규칙 충족 + 일치 → 버튼 켜짐', NewPw({ pw: '••••••••••••••', rules: [true, true, true], pw2: '••••••••••••••', same: true, ok: true })),
        PC('오류 · 지금 쓰는 비밀번호와 같음 / 확인 불일치', NewPw({ pw: '••••••••••••', rules: [true, true, true], err1: '지금 쓰고 있는 비밀번호와 같습니다. 다른 비밀번호를 입력해 주세요.', pw2: '•••••••••••', err2: '위에 입력한 새 비밀번호와 다릅니다.' })),
        PC('완료', ResetDone()),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-12 · 모바일 · 인증번호 발송됨' }, Mobile('비밀번호 재설정', ResetVerify('sent'))),
        PC("'이메일로 재설정 링크 받기'를 누른 뒤", [
            `<div style="text-align:center;padding:8px 0 16px"><div style="font-size:44px;line-height:1">${Icon('mail-o')}</div><h2 style="font-size:19px;margin:10px 0 6px">재설정 링크를 메일로 보냈습니다</h2><p style="margin:0;font-size:13px;color:var(--ink2)">mi****@example.com 의 받은편지함을 확인해 주세요.<br>링크는 30분 동안만 쓸 수 있습니다 (2026-11-11 14:37 까지).</p></div>`,
            Note('메일이 보이지 않으면 스팸함을 확인해 주세요. 1분 뒤에 다시 보낼 수 있습니다.'),
            `<div style="display:flex;gap:8px"><span style="flex:1">${Btn('메일 다시 보내기 (52초)', { size: 'lg', block: true, disabled: true })}</span><span style="flex:1">${Btn('로그인 화면으로', { size: 'lg', block: true })}</span></div>`,
        ].join('')),
        PC('메일 링크가 만료된 뒤 열었을 때', Empty({ icon: 'time-o', title: '사용 기간이 지난 링크입니다', desc: '재설정 링크는 보낸 뒤 30분 동안만 쓸 수 있습니다.<br>비밀번호 재설정을 처음부터 다시 진행해 주세요.', action: '비밀번호 재설정 다시 하기' })),
    ),
);

const NoMatch = (kind) => `<div class="wf-note warn" style="margin:0 0 14px;padding:12px 14px;font-size:13px">${Icon('warning')}<span>${kind === 'id'
    ? '<b>입력한 이름과 휴대폰 번호로 가입한 계정이 없습니다.</b><br>이름의 띄어쓰기와 번호를 다시 확인해 주세요. 가입할 때 쓴 번호가 지금과 다를 수 있습니다.'
    : '<b>입력한 이메일과 휴대폰 번호가 일치하는 계정이 없습니다.</b><br>이메일 주소가 기억나지 않으면 먼저 <u>아이디 찾기</u>를 이용해 주세요.'}</span></div>`;
const NoMatchLinks = () => `<div style="border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-top:16px;font-size:13px"><b>이렇게 해 보세요</b><ul style="margin:8px 0 0;padding-left:18px;line-height:1.9;color:var(--ink2)"><li>카카오·네이버로 가입했다면 로그인 화면에서 간편 로그인 버튼을 눌러 주세요.</li><li>비회원으로 주문했다면 <u>비회원 주문 조회</u>를 이용해 주세요.</li><li>아직 회원이 아니라면 <u><b>회원가입</b></u> (3,000원 쿠폰 지급)</li><li>그래도 찾을 수 없다면 고객센터 070-****-1234 (평일 10:00 ~ 17:00)</li></ul></div>`;

const state3 = StateBlock({ idx: 3, title: '일치 정보 없음', note: '입력한 정보와 맞는 계정이 없을 때. 인증번호는 발송하지 않습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '막다른 길로 끝내지 않고 다음에 할 수 있는 일을 네 가지로 안내합니다 — 간편 로그인으로 가입했을 가능성, 비회원 주문, 신규 가입, 고객센터. 실제로 "가입한 적 없는 번호"보다 "카카오로 가입해 놓고 이메일을 찾는" 경우가 더 많기 때문입니다. 입력한 값은 지우지 않고 그대로 두어 고쳐서 다시 시도하게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '일치하는 계정이 없으면 인증번호 문자를 보내지 않습니다(남의 번호로 문자를 보내는 장난 방지, 문자 비용). 같은 기기에서 10분 안에 5회 넘게 실패하면 10분 동안 조회를 막고 고객센터 안내만 보여 줍니다.'),
    Canvas({ label: "U-12 · 아이디 찾기 · '인증번호 받기'를 눌렀는데 일치하는 계정이 없음" }, Page('아이디 찾기', [
        NoMatch('id'),
        Field({ label: '이름' }, Input({ value: '김민지', error: true })),
        Field({ label: '가입한 휴대폰 번호' }, Flex({ gap: 8 }, `<span style="flex:1">${Input({ value: '010-1234-5678', w: '100%', error: true })}</span>`, Btn('인증번호 받기', { kind: 'line' }))),
        Btn('아이디 찾기', { kind: 'primary', size: 'lg', block: true, disabled: true }),
        NoMatchLinks(),
    ].join(''))),
    CanvasRow(
        PC('비밀번호 재설정 · 일치하는 계정 없음', [
            NoMatch('pw'),
            Field({ label: '이메일 아이디' }, Input({ value: 'minji.kim@exmaple.com', error: true })),
            Field({ label: '가입한 휴대폰 번호' }, Flex({ gap: 8 }, `<span style="flex:1">${Input({ value: '010-1234-1234', w: '100%', error: true })}</span>`, Btn('인증번호 받기', { kind: 'line' }))),
            Btn('다음', { kind: 'primary', size: 'lg', block: true, disabled: true }),
        ].join('')),
        PC('비밀번호 재설정 · 간편가입 전용 계정', [
            `<div class="wf-note warn" style="margin:0 0 14px;padding:12px 14px;font-size:13px">${Icon('warning')}<span><b>카카오로 가입한 계정이라 비밀번호가 없습니다.</b><br>로그인 화면에서 "카카오로 시작하기"를 눌러 주세요. 카카오 계정의 비밀번호는 카카오에서 재설정합니다.</span></div>`,
            Btn('카카오로 로그인', { kind: 'primary', size: 'lg', block: true, icon: 'kakaotalk' }),
        ].join('')),
        PC('10분 안에 5회 실패 → 잠시 막힘', [
            `<div class="wf-note warn" style="margin:0 0 14px;padding:12px 14px;font-size:13px">${Icon('lock-o')}<span><b>여러 번 조회에 실패해 잠시 이용할 수 없습니다.</b><br>8분 15초 뒤에 다시 시도해 주세요. 급하시면 고객센터 070-****-1234 (평일 10:00 ~ 17:00) 로 문의해 주세요.</span></div>`,
            Field({ label: '이름' }, Input({ value: '김민지', disabled: true })),
            Field({ label: '가입한 휴대폰 번호' }, Flex({ gap: 8 }, `<span style="flex:1">${Input({ value: '010-1234-5678', w: '100%', disabled: true })}</span>`, Btn('인증번호 받기', { kind: 'line', disabled: true }))),
        ].join('')),
    ),
    Canvas({ size: 'mobile', label: 'U-12 · 모바일 · 일치 정보 없음' }, Mobile('아이디 찾기', [
        NoMatch('id'),
        Field({ label: '이름' }, Input({ value: '김민지', error: true })),
        Field({ label: '가입한 휴대폰 번호' }, Flex({ gap: 8 }, `<span style="flex:1">${Input({ value: '010-1234-5678', w: '100%', error: true })}</span>`, Btn('인증번호 받기', { kind: 'line' }))),
        NoMatchLinks(),
    ].join(''))),
);

export default function U12() {
    return [state1, state2, state3].join('');
}
