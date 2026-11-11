import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Badge, Input, Check, Field, Stepper, Modal, Toast,
    Box, KV, Note, Text, Icon, Divider, Flex,
} from '../lib/blocks.js';

const STEPS = ['약관 동의', '정보 입력', '가입 완료'];
const link = (t) => `<u style="font-size:12.5px;color:var(--ink2);white-space:nowrap">${t}</u>`;
const W = (w, ...body) => `<div style="width:${w}px">${body.join('')}</div>`;
const Page = (step, body, o = {}) => UserPage({ narrow: true, footer: !!o.footer, title: o.title || '회원가입' }, Stepper(o.steps || STEPS, step), body);
const Mobile = (step, body, o = {}) => MobilePage({ title: o.title || '회원가입', tab: false, right: Icon('close'), bottom: o.bottom }, Stepper(o.steps || STEPS, step), body);

const TERMS = [
    { t: '만 14세 이상입니다', req: true, view: false },
    { t: '이용약관 동의', req: true },
    { t: '개인정보 수집·이용 동의', req: true },
    { t: '마케팅 정보 수신 동의', req: false, sub: ['문자', '이메일', '카카오톡'] },
];
const AgreeList = (on = [], sub = []) => {
    const all = on.length === TERMS.length && on.every(Boolean) && sub.every(Boolean) && sub.length === 3;
    const any = on.some(Boolean);
    return `<div style="border:1px solid var(--line);border-radius:6px">
<div style="padding:16px;border-bottom:1px solid var(--line2);font-weight:800;font-size:15px">${Check('전체 동의 (선택 항목 포함)', { on: all, part: !all && any })}<p class="help" style="font-weight:400;margin:6px 0 0 25px">선택 항목은 동의하지 않아도 가입할 수 있습니다.</p></div>
${TERMS.map((t, i) => `<div style="padding:12px 16px;${i < TERMS.length - 1 ? 'border-bottom:1px solid var(--line2)' : ''}"><div style="display:flex;justify-content:space-between;align-items:center">${Check(`<span><b style="font-weight:600">(${t.req ? '필수' : '선택'})</b> ${t.t}</span>`, { on: !!on[i] })}${t.view === false ? '' : link('전문 보기')}</div>${t.sub ? `<div style="display:flex;gap:18px;margin:10px 0 0 25px">${t.sub.map((s, k) => Check(s, { on: !!sub[k] })).join('')}</div><p class="help" style="margin-left:25px">할인 쿠폰·신제품 소식을 보내 드립니다. 주문·배송 안내는 동의와 관계없이 발송됩니다. 마이페이지에서 언제든 바꿀 수 있습니다.</p>` : ''}</div>`).join('')}
</div>`;
};
const SocialJoin = () => `<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:8px"><span class="wf-btn lg block" style="border:1.5px solid var(--dark)">${Icon('kakaotalk')}카카오로 3초 만에 가입하기</span><span class="wf-btn lg block">${Icon('naver-square')}네이버로 가입하기</span></div><div style="display:flex;align-items:center;gap:12px;margin:18px 0;font-size:12.5px;color:var(--mute)"><span style="flex:1;height:1px;background:var(--line2)"></span>또는 이메일로 가입<span style="flex:1;height:1px;background:var(--line2)"></span></div>`;
const Benefit = () => `<div style="border:1px dashed var(--ink2);border-radius:6px;padding:12px 14px;margin-bottom:16px;font-size:13px">${Icon('gift-o')} 가입하면 <b>3,000원 할인 쿠폰</b>과 <b>적립금 1,000원</b>을 바로 드립니다.</div>`;
const TermsStep = (o = {}) => [
    o.benefit === false ? '' : Benefit(),
    o.social === false ? '' : SocialJoin(),
    AgreeList(o.on, o.sub),
    o.reason ? `<p class="err" style="margin:12px 0 0">${Icon('error-o')}${o.reason}</p>` : '',
    `<div style="margin-top:16px">${Btn('다음', { kind: 'primary', size: 'lg', block: true, disabled: !o.ok })}</div>`,
    `<p style="text-align:center;font-size:13px;color:var(--ink2);margin-top:14px">이미 회원이신가요? <u><b>로그인</b></u></p>`,
].join('');

const state1 = StateBlock({ idx: 1, title: '약관 동의', note: "머리·로그인 화면의 '회원가입'을 누르면 처음 나오는 단계. 필수 3개에 동의해야 '다음'이 켜집니다." },
    Anno({ title: '왜 이렇게 하나 · 초기값' }, "초기값은 전부 체크 해제입니다(개인정보보호법상 미리 체크해 둘 수 없음). '전체 동의'는 선택 항목까지 한 번에 켜되 그 사실을 문구로 밝히고, 마케팅 수신은 문자·이메일·카카오톡을 각각 고를 수 있게 합니다(수신 동의 일시는 회원 정보에 기록되어 관리자 회원 상세에서 확인). 간편가입 버튼을 맨 위에 두어 입력을 줄이는 길을 먼저 보여 줍니다."),
    Anno({ title: '관리자가 바꾸는 범위 · 기능 켜고 끄기' }, '약관 전문은 설정 > 약관·정책의 현재 버전이 나오고 동의한 버전이 회원에 기록됩니다. 가입 혜택 문구(쿠폰 3,000원·적립금 1,000원)는 혜택 > 쿠폰의 가입 자동 발급 쿠폰과 적립금 정책의 가입 적립 값으로 자동 생성되며, 둘 다 없거나 기능이 꺼진 몰은 혜택 줄이 사라집니다. 카카오·네이버 버튼은 켠 것만 나옵니다.'),
    Canvas({ label: 'U-11 · 약관 동의 첫 모습 (다음 버튼 꺼짐)' }, Page(0, TermsStep({ reason: '필수 항목 3개에 동의하면 다음으로 넘어갈 수 있습니다.' }), { footer: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: "'전체 동의'를 누름 (선택 포함 전부 켜짐)", right: '약관 상자만', pad: 24 }, W(440, AgreeList([true, true, true, true], [true, true, true]), `<div style="margin-top:16px">${Btn('다음', { kind: 'primary', size: 'lg', block: true })}</div>`)),
        Canvas({ size: 'auto', label: '필수만 동의 + 마케팅은 이메일만 (전체 동의 칸은 일부 선택 표시)', right: '약관 상자만', pad: 24 }, W(440, AgreeList([true, true, true, true], [false, true, false]), `<div style="margin-top:16px">${Btn('다음', { kind: 'primary', size: 'lg', block: true })}</div>`)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: "'전문 보기' → 약관 팝업 (스크롤, 동의하고 닫기)", right: '팝업만', pad: 20 }, Modal({ title: '개인정보 수집·이용 동의', w: 480, foot: [Btn('닫기'), Btn('동의하고 닫기', 'primary')] },
            KV([['수집 항목', '(필수) 이메일, 비밀번호, 이름, 휴대폰 번호<br>(선택) 생년월일'], ['수집 목적', '회원 식별, 주문·배송·환불 처리, 고객 문의 응대, 부정 이용 방지'], ['보유 기간', '<b>회원 탈퇴 시까지</b> (관계 법령에 따라 보존해야 하는 주문·결제 기록은 5년)']]),
            Divider(),
            Text('동의하지 않을 수 있으나, 필수 항목에 동의하지 않으면 회원가입을 할 수 없습니다.', { sm: true, mute: true }),
            Text('시행일 2026-11-01 · 버전 1.0', { sm: true, mute: true }))),
        Canvas({ size: 'mobile', label: 'U-11 · 모바일 약관 동의 (다음 버튼 하단 고정)' }, Mobile(0, [Benefit(), SocialJoin(), AgreeList([true, true, true, false], [])].join(''), { bottom: [Btn('다음', 'primary')] })),
        Canvas({ size: 'auto', label: '가입 혜택이 없고 간편가입도 끈 몰', right: '폼만', pad: 24 }, W(420, TermsStep({ benefit: false, social: false, on: [true, true, true, false], ok: true }))),
    ),
);

const PwRules = (ok = []) => `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;font-size:12px">${['8자 이상', '영문·숫자·특수문자 중 2가지 이상', '이메일 주소와 다름'].map((r, i) => `<span style="color:${ok[i] ? 'var(--ink)' : 'var(--mute)'};font-weight:${ok[i] ? 700 : 400}">${Icon(ok[i] ? 'check-circle-o' : 'minus-min')} ${r}</span>`).join('')}</div>`;
const EmailField = (s) => {
    const m = {
        empty: { v: '', btn: Btn('중복 확인', { kind: 'line', disabled: true }), help: '로그인 아이디로 쓰입니다. 주문·배송 안내 메일도 이 주소로 보냅니다.' },
        typed: { v: 'minji.kim@example.com', btn: Btn('중복 확인', { kind: 'line' }), help: "'중복 확인'을 눌러 주세요." },
        ok: { v: 'minji.kim@example.com', btn: Btn('확인 완료', { kind: 'line', disabled: true, icon: 'check' }), ok: '사용할 수 있는 이메일입니다.' },
        dup: { v: 'minji.kim@example.com', btn: Btn('중복 확인', { kind: 'line' }), err: '이미 가입된 이메일입니다. 로그인하거나 비밀번호를 재설정해 주세요.', extra: `<div style="display:flex;gap:8px;margin-top:8px">${Btn('로그인하기', { size: 'sm' })}${Btn('비밀번호 재설정', { size: 'sm' })}</div>` },
        social: { v: 'minji.kim@example.com', btn: Btn('중복 확인', { kind: 'line' }), err: '카카오로 가입된 이메일입니다. 카카오로 로그인해 주세요.', extra: `<div style="margin-top:8px">${Btn('카카오로 로그인', { size: 'sm', icon: 'kakaotalk' })}</div>` },
        bad: { v: 'minji.kim@example', btn: Btn('중복 확인', { kind: 'line', disabled: true }), err: '이메일 주소 형식이 맞지 않습니다. 예: name@example.com' },
    }[s];
    return Field({ label: '이메일', required: true, help: m.help, error: m.err },
        Flex({ gap: 8 }, `<span class="grow">${Input({ value: m.v, placeholder: 'name@example.com', w: '100%', error: !!m.err, focus: s === 'typed' })}</span>`, m.btn),
        m.ok ? `<p class="help" style="color:var(--ink);font-weight:700">${Icon('check-circle-o')} ${m.ok}</p>` : '', m.extra || '');
};
const PhoneField = (s) => {
    const tel = s === 'empty' ? '' : '010-1234-1234';
    const first = { empty: Btn('인증번호 받기', { kind: 'line', disabled: true }), typed: Btn('인증번호 받기', { kind: 'line' }), sent: Btn('재발송', { kind: 'line', disabled: true }), resend: Btn('재발송', { kind: 'line' }), wrong: Btn('재발송', { kind: 'line' }), expired: Btn('재발송', { kind: 'line' }), done: Btn('인증 완료', { kind: 'line', disabled: true, icon: 'check' }), limit: Btn('재발송', { kind: 'line', disabled: true }) }[s];
    const codeRow = (v, timer, o = {}) => `<div style="display:flex;gap:8px;margin-top:8px"><span style="flex:1">${Input({ value: v, placeholder: '인증번호 6자리', w: '100%', suffix: timer, error: o.error, focus: o.focus, disabled: o.disabled })}</span>${Btn('확인', { kind: o.disabled ? 'line' : 'primary', disabled: o.disabled || !v })}</div>`;
    const below = {
        empty: '', typed: '',
        sent: `${codeRow('', '02:54', { focus: true })}<p class="help">010-1234-1234 로 인증번호를 보냈습니다. 3분 안에 입력해 주세요. 재발송은 30초 뒤부터 할 수 있습니다 (26초).</p>`,
        resend: `${codeRow('4821', '02:11')}<p class="help">인증번호를 다시 보냈습니다 (2회 / 하루 5회). 문자가 오지 않으면 스팸함과 번호를 확인해 주세요.</p>`,
        wrong: `${codeRow('482199', '01:37', { error: true })}<p class="err">${Icon('error-o')}인증번호가 맞지 않습니다. 문자로 받은 6자리를 다시 확인해 주세요. (2회 / 5회)</p>`,
        expired: `${codeRow('', '00:00', { disabled: true })}<p class="err">${Icon('error-o')}입력 시간이 지났습니다. '재발송'을 눌러 새 인증번호를 받아 주세요.</p>`,
        done: `<p class="help" style="color:var(--ink);font-weight:700">${Icon('check-circle-o')} 휴대폰 인증을 마쳤습니다.</p>`,
        limit: `<p class="err">${Icon('error-o')}오늘 인증번호를 5회 모두 받았습니다. 내일 다시 시도하거나 고객센터(070-****-1234)로 문의해 주세요.</p>`,
    }[s];
    return Field({ label: '휴대폰 번호', required: true, help: s === 'empty' || s === 'typed' ? '주문·배송 알림톡을 받을 번호입니다. 번호 하나로 한 계정만 가입할 수 있습니다.' : undefined },
        Flex({ gap: 8 }, `<span class="grow">${Input({ value: tel, placeholder: '010-0000-0000', w: '100%', disabled: s === 'done' })}</span>`, first), below);
};
const InfoForm = (o = {}) => [
    EmailField(o.email || 'empty'),
    Field({ label: '비밀번호', required: true, error: o.pwErr }, Input({ value: o.pw || '', placeholder: '비밀번호', w: '100%', icon: 'lock-o', suffix: Icon('eye-o'), error: !!o.pwErr }), PwRules(o.rules)),
    Field({ label: '비밀번호 확인', required: true, error: o.pw2Err }, Input({ value: o.pw2 || '', placeholder: '비밀번호를 한 번 더 입력', w: '100%', icon: 'lock-o', error: !!o.pw2Err }),
        o.pw2Ok ? `<p class="help" style="color:var(--ink);font-weight:700">${Icon('check-circle-o')} 비밀번호가 일치합니다.</p>` : ''),
    Field({ label: '이름', required: true, error: o.nameErr }, Input({ value: o.name || '', placeholder: '받는 분 이름으로도 쓰입니다', error: !!o.nameErr })),
    PhoneField(o.phone || 'empty'),
    Field({ label: '생년월일', help: '선택 항목입니다. 입력하면 생일 쿠폰을 보내 드립니다.' }, Input({ value: o.birth || '', placeholder: '예: 1990-05-17', icon: 'calendar' })),
    o.reason ? `<p class="err" style="margin:0 0 10px">${Icon('error-o')}${o.reason}</p>` : '',
    `<div style="display:flex;gap:8px">${Btn('이전', { size: 'lg', w: 110 })}<span style="flex:1">${Btn('가입하기', { kind: 'primary', size: 'lg', block: true, disabled: !o.ok })}</span></div>`,
].join('');
const FieldCanvas = (label, body, w = 420) => Canvas({ size: 'auto', label, right: '해당 칸만', pad: 20 }, W(w, body));

const state2 = StateBlock({ idx: 2, title: '정보 입력(중복 확인·본인인증 상태 바뀜)', note: "약관 동의 다음 단계. 이메일 중복 확인과 휴대폰 인증을 마쳐야 '가입하기'가 켜집니다." },
    Anno({ title: '왜 이렇게 하나 · 수집 항목' }, '받는 값은 이메일·비밀번호·이름·휴대폰(필수)과, 관리자 회원 설정에서 켠 선택 항목(생년월일·성별·추천인 — 이너에라는 생년월일만)입니다. 주소는 첫 주문 때 받습니다. 이메일은 버튼을 눌러 중복을 확인하고, 확인 뒤 이메일을 고치면 다시 확인해야 합니다. 비밀번호 규칙은 칸 아래에 항목별로 충족 여부를 실시간 표시해 무엇이 부족한지 바로 알게 합니다.'),
    Anno({ title: '기능 켜고 끄기 · 휴대폰 본인인증' }, '휴대폰 인증은 관리자 설정에서 켜고 끕니다(골격 D7). 켠 몰은 인증번호 문자(6자리, 3분 유효, 재발송 30초 간격, 하루 5회)로 번호 주인을 확인하고, 끈 몰은 인증번호 받기 버튼 없이 번호만 입력받습니다. 통신사 본인인증(별도 계약)을 쓰는 몰은 문자 인증 대신 [본인인증] 버튼이 나오고, 마치면 이름·휴대폰이 채워져 잠깁니다(아래 캔버스). 같은 번호로 이미 가입한 계정이 있으면 가입을 막고 아이디 찾기로 안내합니다.'),
    Canvas({ label: 'U-11 · 정보 입력 첫 모습 (빈 폼)' }, Page(1, InfoForm({ reason: '이메일 중복 확인과 휴대폰 인증을 마치면 가입할 수 있습니다.' }))),
    Text('이메일 중복 확인 — 상태가 바뀌는 모습', { b: true }),
    CanvasRow(
        FieldCanvas('입력함 → 중복 확인 버튼 켜짐', EmailField('typed')),
        FieldCanvas('중복 확인 → 사용 가능', EmailField('ok')),
        FieldCanvas('중복 확인 → 이미 가입됨', EmailField('dup')),
    ),
    CanvasRow(
        FieldCanvas('중복 확인 → 간편가입으로 가입된 이메일', EmailField('social')),
        FieldCanvas('형식이 틀림 (버튼 꺼짐)', EmailField('bad')),
        FieldCanvas('비밀번호 규칙 · 입력 중 (영문만 넣음)', Field({ label: '비밀번호', required: true }, Input({ value: 'pomegranate', w: '100%', icon: 'lock-o', suffix: Icon('eye-off-o'), focus: true }), PwRules([true, false, true]))),
    ),
    CanvasRow(
        FieldCanvas('비밀번호 규칙 미충족으로 칸을 벗어남', Field({ label: '비밀번호', required: true, error: '숫자나 특수문자를 하나 이상 넣어 주세요. 예: pomegranate26' }, Input({ value: '•••••••••••', w: '100%', icon: 'lock-o', suffix: Icon('eye-o'), error: true }), PwRules([true, false, true]))),
        FieldCanvas('비밀번호 확인이 다름', Field({ label: '비밀번호 확인', required: true, error: '위에 입력한 비밀번호와 다릅니다. 다시 입력해 주세요.' }, Input({ value: '••••••••••••', w: '100%', icon: 'lock-o', error: true }))),
        FieldCanvas('이메일과 같은 비밀번호', Field({ label: '비밀번호', required: true, error: '이메일 주소가 들어간 비밀번호는 쓸 수 없습니다.' }, Input({ value: '••••••••••••', w: '100%', icon: 'lock-o', suffix: Icon('eye-o'), error: true }), PwRules([true, true, false]))),
    ),
    Text('휴대폰 본인인증 — 상태가 바뀌는 모습', { b: true }),
    CanvasRow(
        FieldCanvas('번호 입력 → 인증번호 받기 켜짐', PhoneField('typed')),
        FieldCanvas('인증번호 발송됨 (남은 시간, 재발송은 30초 뒤)', PhoneField('sent')),
        FieldCanvas('재발송함 (30초 지나 재발송 버튼 켜짐)', PhoneField('resend')),
    ),
    CanvasRow(
        FieldCanvas('인증번호 틀림', PhoneField('wrong')),
        FieldCanvas('입력 시간 지남', PhoneField('expired')),
        FieldCanvas('확인 완료 (번호 칸 잠김)', PhoneField('done')),
    ),
    CanvasRow(
        FieldCanvas('하루 발송 횟수 초과', PhoneField('limit')),
        FieldCanvas('통신사 본인인증을 쓰는 몰 · 인증 전 / 인증 후', [Field({ label: '본인인증', required: true, help: '휴대폰 본인인증 창이 열립니다. 인증한 이름·휴대폰 번호가 자동으로 채워집니다.' }, Btn('휴대폰 본인인증', { kind: 'line', block: true, icon: 'shield-checked-o' })), Divider(), Field({ label: '본인인증', required: true }, Btn('본인인증 완료', { kind: 'line', block: true, disabled: true, icon: 'check' })), Field({ label: '이름' }, Input({ value: '김민지', disabled: true })), Field({ label: '휴대폰 번호' }, Input({ value: '010-1234-1234', disabled: true }))].join('')),
        FieldCanvas('이미 가입된 휴대폰 번호', Field({ label: '휴대폰 번호', required: true, error: '이 번호로 가입한 계정이 있습니다 (mi****@example.com).' }, Flex({ gap: 8 }, `<span class="grow">${Input({ value: '010-1234-1234', w: '100%', error: true })}</span>`, Btn('인증번호 받기', { kind: 'line' })), `<div style="display:flex;gap:8px;margin-top:8px">${Btn('로그인하기', { size: 'sm' })}${Btn('비밀번호 재설정', { size: 'sm' })}</div>`)),
        FieldCanvas('휴대폰 인증을 끈 몰 (번호만 입력)', Field({ label: '휴대폰 번호', required: true, help: '주문·배송 알림톡을 받을 번호입니다.' }, Input({ value: '010-1234-1234' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '모두 채움 → 가입하기 켜짐', right: '폼만', pad: 24 }, W(440, InfoForm({ email: 'ok', pw: '••••••••••••••', rules: [true, true, true], pw2: '••••••••••••••', pw2Ok: true, name: '김민지', phone: 'done', birth: '1990-05-17', ok: true }))),
        Canvas({ size: 'mobile', label: 'U-11 · 모바일 정보 입력 (인증번호 발송됨)' }, Mobile(1, InfoForm({ email: 'ok', pw: '••••••••••••••', rules: [true, true, true], pw2: '••••••••••••••', pw2Ok: true, name: '김민지', phone: 'sent', reason: '휴대폰 인증을 마치면 가입할 수 있습니다.' }))),
        Canvas({ size: 'auto', label: "'인증번호 받기' → 토스트", right: '토스트만', pad: 20 }, Toast('010-1234-1234 로 인증번호를 보냈습니다.')),
    ),
);

const SocialHead = (via, email) => `<div style="border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-bottom:16px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">${Icon(via === '카카오' ? 'kakaotalk' : 'naver-square')}<b>${via} 계정에서 가져온 정보</b>${Badge('확인됨', 'check')}</div>${KV([['이메일', email], ['이름', '김민지']])}<p class="help">${via}에서 받은 정보는 여기서 고칠 수 없습니다. 가입 뒤 회원정보에서 바꿀 수 있습니다.</p></div>`;
const SocialAgree = (on) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px"><div style="font-weight:800;padding-bottom:8px;border-bottom:1px solid var(--line2);margin-bottom:8px">${Check('전체 동의 (선택 항목 포함)', { on: on.every(Boolean), part: !on.every(Boolean) })}</div>${[['(필수) 만 14세 이상입니다', false], ['(필수) 이용약관 동의', true], ['(필수) 개인정보 수집·이용 동의', true], ['(선택) 마케팅 정보 수신 동의 (문자·알림톡·이메일)', true]].map(([t, v], i) => `<div style="display:flex;justify-content:space-between;padding:4px 0">${Check(t, { on: on[i] })}${v ? link('전문 보기') : ''}</div>`).join('')}</div>`;
const SOCIAL_STEPS = ['간편 로그인', '추가 입력', '가입 완료'];

const state3 = StateBlock({ idx: 3, title: '간편가입 추가 입력(부족한 항목만)', note: '카카오·네이버로 처음 들어온 사람이 동의 창을 마치고 돌아온 화면. 간편 로그인에서 받지 못한 항목과 약관 동의만 받습니다.' },
    Anno({ title: '왜 이렇게 하나 · 유형별 분기' }, '간편가입의 장점은 입력이 적다는 것이므로, 이미 받은 값(이메일·이름)은 다시 묻지 않고 읽기 전용으로 보여 줍니다. 부족한 항목만 입력칸으로 나옵니다 — 필수 항목을 모두 받았으면 입력칸 없이 약관 동의만 받고 완료, 동의하지 않았으면 휴대폰 번호(인증 켠 몰은 인증까지), 이메일 제공을 거절했으면 이메일 칸도 나옵니다. 비밀번호는 받지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '간편 로그인 이메일이 이미 이메일 가입 계정으로 있으면 계정을 새로 만들지 않고 "기존 계정에 카카오 로그인을 연결"할지 묻습니다(비밀번호 확인 후 연결). 추가 입력을 마치지 않고 나가면 가입되지 않으며, 다음에 같은 버튼을 누르면 이 화면부터 다시 시작합니다.'),
    Canvas({ label: 'U-11 · 카카오 간편가입 · 휴대폰 번호만 부족한 경우' }, Page(1, [
        SocialHead('카카오', 'minji.kim@example.com'),
        PhoneField('typed'),
        SocialAgree([false, false, false, false]),
        `<p class="err" style="margin:0 0 10px">${Icon('error-o')}휴대폰 인증과 필수 약관 동의를 마치면 가입할 수 있습니다.</p>`,
        Btn('가입 완료하기', { kind: 'primary', size: 'lg', block: true, disabled: true }),
    ].join(''), { steps: SOCIAL_STEPS, title: '카카오로 가입하기' })),
    CanvasRow(
        Canvas({ size: 'auto', label: '모든 정보를 받은 경우 (약관 동의만)', right: '폼만', pad: 24 }, W(440,
            `<div style="border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-bottom:16px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">${Icon('kakaotalk')}<b>카카오 계정에서 가져온 정보</b>${Badge('확인됨', 'check')}</div>${KV([['이메일', 'minji.kim@example.com'], ['이름', '김민지'], ['휴대폰', '010-****-1234']])}</div>`,
            SocialAgree([true, true, true, false]),
            Btn('가입 완료하기', { kind: 'primary', size: 'lg', block: true }))),
        Canvas({ size: 'auto', label: '네이버 · 이메일 제공을 거절한 경우 (이메일 + 휴대폰)', right: '폼만', pad: 24 }, W(440,
            `<div style="border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-bottom:16px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:10px">${Icon('naver-square')}<b>네이버 계정에서 가져온 정보</b>${Badge('확인됨', 'check')}</div>${KV([['이름', '박서준']])}</div>`,
            EmailField('ok').replace('minji.kim', 'seojun.park'),
            PhoneField('done'),
            SocialAgree([true, true, true, true]),
            Btn('가입 완료하기', { kind: 'primary', size: 'lg', block: true }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '같은 이메일의 기존 계정이 있음 → 연결 팝업', right: '팝업만', pad: 20 }, Modal({ title: '이미 가입한 계정이 있습니다', w: 440, foot: [Btn('취소'), Btn('연결하고 로그인', 'primary')] },
            Text('<b>minji.kim@example.com</b> 은 2026-09-14 에 이메일로 가입한 계정입니다. 이 계정에 카카오 로그인을 연결하면 다음부터 카카오로도 로그인할 수 있습니다.'),
            Field({ label: '기존 계정 비밀번호', help: '본인 확인을 위해 한 번만 입력합니다.' }, Input({ placeholder: '비밀번호', w: '100%', icon: 'lock-o' })),
            `<div style="font-size:13px">${link('비밀번호가 기억나지 않아요')}</div>`)),
        Canvas({ size: 'mobile', label: 'U-11 · 모바일 · 간편가입 추가 입력 (인증번호 발송됨)' }, Mobile(1, [SocialHead('카카오', 'minji.kim@example.com'), PhoneField('sent'), SocialAgree([true, true, true, false])].join(''), { steps: SOCIAL_STEPS, title: '카카오로 가입하기', bottom: [Btn('가입 완료하기', { kind: 'primary', disabled: true })] })),
    ),
);

const Gift = (icon, title, big, desc) => `<div style="border:1px solid var(--line);border-radius:6px;padding:16px;display:flex;gap:14px;align-items:center;margin-bottom:8px"><span style="font-size:28px">${Icon(icon)}</span><div style="flex:1"><div style="font-size:12.5px;color:var(--mute)">${title}</div><b style="font-size:17px">${big}</b><div style="font-size:12.5px;color:var(--ink2)">${desc}</div></div></div>`;
const DoneBody = (o = {}) => [
    `<div style="text-align:center;padding:4px 0 22px"><div style="font-size:52px;line-height:1">${Icon('check-circle-o')}</div><h2 style="font-size:22px;margin:12px 0 6px">김민지 님, 가입을 환영합니다</h2><p style="margin:0;color:var(--ink2);font-size:13.5px">${o.via || 'minji.kim@example.com'} 으로 가입했습니다.</p></div>`,
    o.coupon === false ? '' : Gift('coupon', '가입 축하 쿠폰', '3,000원 할인', '30,000원 이상 구매 시 · 2026-12-11 까지 · 쿠폰함에 넣어 드렸습니다'),
    o.point === false ? '' : Gift('money', '가입 축하 적립금', '1,000원', '바로 쓸 수 있습니다 · 2027-11-11 소멸 예정'),
    o.coupon === false && o.point === false ? '' : Note('가입 안내와 혜택 내용을 알림톡(010-****-1234)으로도 보냈습니다.'),
    `<div style="display:flex;gap:8px;margin-top:16px">${o.order ? `<span style="flex:1">${Btn('주문 계속하기', { kind: 'primary', size: 'lg', block: true })}</span>` : `<span style="flex:1">${Btn('홈으로', { size: 'lg', block: true })}</span><span style="flex:1">${Btn('상품 보러 가기', { kind: 'primary', size: 'lg', block: true })}</span>`}</div>`,
].join('');

const state4 = StateBlock({ idx: 4, title: '가입 완료(가입 쿠폰 안내)', note: '가입이 끝나 자동으로 로그인된 상태. 받은 혜택을 보여 주고 쇼핑으로 돌려보냅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '가입 직후가 첫 구매로 이어지기 가장 좋은 때라, 받은 쿠폰·적립금을 금액과 사용 조건·기한까지 구체적으로 보여 주고 상품으로 가는 버튼을 굵게 둡니다. 다시 로그인하게 하지 않습니다(가입과 동시에 로그인). 주문하다가 가입한 사람은 버튼이 "주문 계속하기" 하나로 바뀌고 주문서로 돌아가 쿠폰을 바로 쓸 수 있습니다.'),
    Anno({ title: '관리자가 바꾸는 범위 · 기능 켜고 끄기' }, '쿠폰 금액·조건·유효기간은 혜택 > 쿠폰의 "가입 자동 발급" 쿠폰, 적립금은 혜택 > 적립금 정책의 가입 적립 값이 그대로 나옵니다. 쿠폰 기능을 끈 몰은 쿠폰 카드가, 적립금을 끈 몰은 적립금 카드가 없고, 둘 다 없으면 환영 문구와 버튼만 남습니다. 가입 알림톡은 설정 > 알림에서 켜고 끕니다.'),
    Canvas({ label: 'U-11 · 가입 완료 (쿠폰·적립금 모두 주는 몰)' }, Page(2, DoneBody(), { title: '가입 완료' })),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문하다가 가입한 경우 (버튼이 다름)', right: '달라지는 부분만', pad: 24 }, W(440, DoneBody({ order: true, point: false }))),
        Canvas({ size: 'auto', label: '쿠폰·적립금이 없는 몰', right: '달라지는 부분만', pad: 24 }, W(440, DoneBody({ coupon: false, point: false, via: '카카오 계정(minji.kim@example.com)' }))),
        Canvas({ size: 'mobile', label: 'U-11 · 모바일 가입 완료' }, Mobile(2, DoneBody(), { title: '가입 완료' })),
    ),
);

export default function U11() {
    return [state1, state2, state3, state4].join('');
}
