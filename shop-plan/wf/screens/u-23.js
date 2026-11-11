import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, BtnRow, Badge, OrderBadge, Input, Select, Check, Toggle, Textarea, Field,
    Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Flex, H, Tabs, Empty, UserPage,
} from '../lib/blocks.js';

const TABS = ['내 정보', '수신 동의', '회원 탈퇴'];
const Page = (tab, o, ...body) => MypageLayout({ active: '회원정보', title: '회원정보', crumb: ['홈', '마이페이지', '회원정보'], ...o }, tab ? Tabs(TABS, tab) : '', '<div style="height:20px"></div>', body);
const W = (...body) => `<div style="max-width:560px">${body.flat(Infinity).join('')}</div>`;
const Row = (label, value, right, sub) => `<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--line2);font-size:13.5px"><span style="width:120px;flex:none;color:var(--mute)">${label}</span><div style="flex:1;min-width:0">${value}${sub ? `<div style="font-size:12px;color:var(--mute);margin-top:2px">${sub}</div>` : ''}</div>${right || ''}</div>`;

const pwGate = (o = {}) => W(
    Box({ title: '비밀번호 확인', sub: '내 정보를 안전하게 지키기 위해 한 번 더 확인합니다' },
        Field({ label: '이메일(아이디)' }, Input({ value: 'minji****@naver.com', disabled: true, w: '100%' })),
        Field({ label: '비밀번호', required: true, error: o.err ? '비밀번호가 맞지 않습니다. 다시 입력해 주세요. (5회 중 2회 틀림 · 5회 틀리면 10분간 잠깁니다)' : '' }, Input({ value: o.err ? '••••••••' : '', placeholder: '현재 비밀번호', error: o.err, focus: !o.err, w: '100%' })),
        o.lock ? Note('비밀번호를 5회 틀려 10분간 확인할 수 없습니다. 11:52 이후 다시 시도하거나 비밀번호를 재설정해 주세요.', { warn: true }) : '',
        Flex({ justify: 'space-between', align: 'center' }, Text('<u>비밀번호를 잊으셨나요?</u>', { sm: true, mute: true }), Btn('확인', { kind: 'primary', disabled: !!o.lock, w: 120 })),
    ));

const infoRows = (o = {}) => [
    Row('이름', '김민지', '', o.verified === false ? '' : '휴대폰 본인인증 완료 · 이름은 본인인증을 다시 하면 바뀝니다'),
    Row('이메일(아이디)', 'minji****@naver.com', Btn('변경', { size: 'sm' }), '로그인과 주문 안내 메일에 쓰입니다'),
    o.social ? '' : Row('비밀번호', '••••••••', Btn('변경', { size: 'sm' }), '마지막 변경 2026-08-14'),
    Row('휴대폰 번호', '010-****-1234', Btn('변경', { size: 'sm' }), '주문·배송 알림톡을 받는 번호입니다'),
    Row('생년월일', '1992-04-**', Btn('변경', { size: 'sm' }), '선택 항목 · 생일 쿠폰 발급에 쓰입니다(쿠폰 기능이 켜진 몰만 표시)'),
    Row('회원 등급', `${Badge('일반 회원', 'line')}`, '', '다음 등급 산정일 2026-12-01 (등급 기능이 꺼진 몰은 이 줄 없음)'),
    Row('가입일', '2026-03-02', '', o.social ? '카카오로 가입' : '이메일로 가입'),
];

const infoBody = W(infoRows(), '<div style="height:18px"></div>',
    H('간편 로그인 연결'),
    Row(`${Icon('kakaotalk')} 카카오`, '연결 안 됨', Btn('연결하기', { size: 'sm' })),
    Row(`${Icon('naver-square')} 네이버`, '연결됨 · 2026-05-20', Btn('연결 해제', { size: 'sm' })),
    Note('간편 로그인을 연결해 두면 이메일·비밀번호 없이도 같은 계정으로 로그인합니다.'));

const emailModal = (step) => Modal({ title: '이메일 변경', w: 460, foot: step === 1 ? [Btn('취소'), Btn('인증 메일 보내기', 'primary')] : [Btn('닫기', 'primary')] },
    step === 1 ? [
        Field({ label: '지금 이메일' }, Input({ value: 'minji****@naver.com', disabled: true, w: '100%' })),
        Field({ label: '새 이메일', required: true, help: '새 이메일로 보낸 인증 메일의 버튼을 눌러야 바뀝니다. 그 전까지는 지금 이메일로 로그인합니다.' }, Input({ value: 'minji.kim@gmail.com', focus: true, w: '100%' })),
    ] : [
        Text(`${Icon('mail-o')} minji.kim@gmail.com 으로 인증 메일을 보냈습니다.`, { b: true }),
        Text('메일의 "이메일 변경 확인" 버튼을 30분 안에 눌러 주세요. 누르면 바로 새 이메일로 바뀌고, 지금 이메일로 변경 알림이 갑니다.', { sm: true }),
        Flex({ gap: 8, mt: 12 }, Btn('인증 메일 다시 보내기', { size: 'sm' }), Text('1분 뒤 다시 보낼 수 있습니다 (00:42)', { sm: true, mute: true })),
    ]);

const emailErr = Modal({ title: '이메일 변경', w: 460, foot: [Btn('취소'), Btn('인증 메일 보내기', { kind: 'primary', disabled: true })] },
    Field({ label: '새 이메일', required: true, error: '이미 다른 계정에서 쓰고 있는 이메일입니다. 다른 이메일을 입력해 주세요.' }, Input({ value: 'seojun@naver.com', error: true, w: '100%' })));

const phoneModal = (o = {}) => Modal({ title: '휴대폰 번호 변경', w: 460, foot: [Btn('취소'), Btn('변경', { kind: 'primary', disabled: !o.ok })] },
    Field({ label: '새 휴대폰 번호', required: true }, Flex({ gap: 8 }, Input({ value: '01098765432', w: 260 }), Btn(o.sent ? '재발송' : '인증번호 받기', {}))),
    o.sent ? Field({ label: '인증번호', required: true, error: o.err ? '인증번호가 맞지 않습니다. 문자로 받은 6자리 숫자를 다시 확인해 주세요.' : '', help: o.ok ? `${Icon('check-circle-o')} 인증이 완료되었습니다.` : o.err ? '' : '문자로 받은 6자리 숫자를 입력해 주세요. 남은 시간 02:41' },
        Flex({ gap: 8 }, Input({ value: o.ok ? '482913' : o.err ? '482918' : '4829', w: 260, focus: !o.ok && !o.err, error: o.err, disabled: o.ok, suffix: o.ok ? '' : '02:41' }), Btn('확인', { disabled: o.ok }))) : '',
    Note('본인인증을 켠 몰에서는 인증번호 대신 통신사 본인인증 창이 열립니다(관리자 설정 > 기능 켜고 끄기).'));

const pwModal = (o = {}) => Modal({ title: '비밀번호 변경', w: 460, foot: [Btn('취소'), Btn('변경', { kind: 'primary', disabled: o.err })] },
    Field({ label: '지금 비밀번호', required: true }, Input({ value: '••••••••', w: '100%' })),
    Field({ label: '새 비밀번호', required: true, error: o.err ? '영문·숫자·특수문자 중 2가지 이상을 섞어 8~20자로 입력해 주세요. 지금은 숫자만 6자입니다.' : '', help: o.err ? '' : `${Icon('check-min')} 8~20자 &nbsp; ${Icon('check-min')} 영문·숫자·특수문자 중 2가지 이상 &nbsp; ${Icon('check-min')} 지금 비밀번호와 다름` },
        Input({ value: o.err ? '••••••' : '••••••••••', error: o.err, w: '100%' })),
    Field({ label: '새 비밀번호 확인', required: true, error: o.err ? '새 비밀번호와 같지 않습니다.' : '' }, Input({ value: o.err ? '•••••••' : '••••••••••', error: o.err, w: '100%' })),
    Check('다른 기기에서 모두 로그아웃', { on: true }));

const state1 = StateBlock({ idx: 1, title: '정보 수정(비밀번호 확인 후)', note: '회원정보 메뉴에 들어오면 먼저 비밀번호를 확인하고, 통과하면 30분 동안 내 정보·수신 동의·회원 탈퇴 탭을 쓸 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '로그인된 채 자리를 비운 사이 남이 연락처·비밀번호를 바꾸지 못하게 한 번 더 확인합니다. 항목은 한꺼번에 고치는 긴 폼이 아니라 줄마다 "변경" 버튼으로 하나씩 고칩니다. 이메일과 휴대폰은 주문 안내가 가는 곳이라 새 값이 정말 본인 것인지 인증을 거친 뒤에만 바뀝니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '초기값: 가입 때 넣은 값. 생년월일·회원 등급 줄은 쿠폰·등급 기능이 꺼진 몰에서는 나오지 않습니다. 비밀번호 5회 오류 시 10분 잠금. 이메일·휴대폰·비밀번호가 바뀌면 바뀌기 전 연락처로 "정보가 변경되었습니다" 알림이 갑니다.'),
    Canvas({ label: 'U-23 · 마이페이지 > 회원정보 진입 → 비밀번호 확인' }, Page('', {}, pwGate())),
    CanvasRow(
        Canvas({ size: 'auto', label: '비밀번호가 틀렸을 때', right: '본문만', pad: 20 }, pwGate({ err: true })),
        Canvas({ size: 'auto', label: '5회 틀려 잠겼을 때', right: '본문만', pad: 20 }, pwGate({ err: true, lock: true })),
    ),
    Canvas({ label: 'U-23 · 확인 통과 → 내 정보 탭' }, Page('내 정보', {}, infoBody)),
    CanvasRow(
        Canvas({ size: 'auto', label: '이메일 변경 버튼 → 새 이메일 입력', right: '팝업만', pad: 20 }, emailModal(1)),
        Canvas({ size: 'auto', label: '인증 메일 보낸 뒤', right: '팝업만', pad: 20 }, emailModal(2)),
        Canvas({ size: 'auto', label: '이미 쓰는 이메일', right: '팝업만', pad: 20 }, emailErr),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '휴대폰 변경 버튼 → 번호 입력', right: '팝업만', pad: 20 }, phoneModal()),
        Canvas({ size: 'auto', label: '인증번호 발송됨 · 입력 중', right: '팝업만', pad: 20 }, phoneModal({ sent: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '인증번호 오류', right: '팝업만', pad: 20 }, phoneModal({ sent: true, err: true })),
        Canvas({ size: 'auto', label: '인증 완료 → 변경 버튼 켜짐', right: '팝업만', pad: 20 }, phoneModal({ sent: true, ok: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '비밀번호 변경 버튼 → 규칙 충족', right: '팝업만', pad: 20 }, pwModal()),
        Canvas({ size: 'auto', label: '비밀번호 규칙 오류', right: '팝업만', pad: 20 }, pwModal({ err: true })),
        Canvas({ size: 'auto', label: '변경 완료 안내', right: '토스트만', pad: 20 }, [
            Toast('휴대폰 번호를 바꿨습니다. 이전 번호로 변경 안내를 보냈습니다.'), '<div style="height:10px"></div>',
            Toast('비밀번호를 바꿨습니다. 다른 기기에서는 로그아웃되었습니다.'), '<div style="height:10px"></div>',
            Toast('생년월일을 저장했습니다.')]),
    ),
    Canvas({ size: 'mobile', label: 'U-23 · 모바일 · 내 정보 탭' }, MobilePage({ title: '회원정보', tab: '마이' }, Tabs(TABS, '내 정보'), infoRows())),
);

const socialGate = W(Box({ title: '본인 확인', sub: '카카오로 가입한 회원은 비밀번호가 없어 카카오로 다시 확인합니다' },
    Text(`${Icon('kakaotalk')} 카카오 계정 minji****@kakao.com 으로 가입했습니다.`, { sm: true }),
    '<div style="height:12px"></div>',
    Btn('카카오로 본인 확인', { kind: 'primary', block: true, icon: 'kakaotalk', size: 'lg' }),
    Text('카카오 로그인 창이 열립니다. 가입한 카카오 계정과 다른 계정으로 로그인하면 확인되지 않습니다.', { sm: true, mute: true })));

const socialBody = W(infoRows({ social: true }), '<div style="height:18px"></div>',
    H('간편 로그인 연결'),
    Row(`${Icon('kakaotalk')} 카카오`, '연결됨 · 2026-03-02 (가입 계정)', Btn('연결 해제', { size: 'sm', disabled: true }), '로그인 수단이 이것 하나뿐이라 해제할 수 없습니다'),
    Row(`${Icon('naver-square')} 네이버`, '연결 안 됨', Btn('연결하기', { size: 'sm' })),
    '<div style="height:14px"></div>',
    Box({ flat: true, title: '이메일 로그인도 쓰고 싶다면' }, Text('비밀번호를 만들면 이메일(minji****@kakao.com)과 비밀번호로도 로그인할 수 있고, 카카오 연결을 해제할 수 있게 됩니다.', { sm: true }), Flex({ mt: 10 }, Btn('비밀번호 만들기', { size: 'sm' }))));

const state2 = StateBlock({ idx: 2, title: '간편가입 회원', note: '카카오·네이버로 가입해 비밀번호가 없는 회원. 비밀번호 확인 대신 간편 로그인 재인증을 거치고, 내 정보에 비밀번호 줄이 없습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '간편가입 회원에게 비밀번호를 물으면 "만든 적이 없는데"에서 막혀 문의가 됩니다. 가입 수단에 따라 확인 방법과 보이는 줄이 달라집니다(유형별 분기): 이메일 가입 = 비밀번호 확인 + 비밀번호 줄, 간편가입 = 재인증 + 비밀번호 만들기 안내.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '로그인 수단이 하나뿐일 때는 연결 해제를 막습니다(해제하면 다시 로그인할 길이 없음). 다른 간편 로그인을 연결했거나 비밀번호를 만든 뒤에만 해제 버튼이 켜집니다.'),
    Canvas({ label: 'U-23 · 카카오 가입 회원 진입 → 카카오 재인증' }, Page('', {}, socialGate)),
    Canvas({ label: 'U-23 · 재인증 통과 → 내 정보 탭 (비밀번호 줄 없음 · 연결 계정 표시)' }, Page('내 정보', {}, socialBody)),
    CanvasRow(
        Canvas({ size: 'auto', label: '다른 카카오 계정으로 확인했을 때', right: '안내만', pad: 20 }, W(Note('가입한 카카오 계정(minji****@kakao.com)과 다른 계정입니다. 카카오에서 로그아웃한 뒤 가입한 계정으로 다시 확인해 주세요.', { warn: true }))),
        Canvas({ size: 'auto', label: '네이버 연결 해제 버튼 → 확인 (수단이 둘 이상일 때)', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '네이버 연결을 해제할까요?', desc: '해제하면 네이버로는 이 계정에 로그인할 수 없습니다. 카카오 로그인은 그대로 쓸 수 있습니다.', ok: '연결 해제', danger: true })),
        Canvas({ size: 'auto', label: '네이버 연결하기 → 이미 다른 회원에 연결된 계정', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '이 네이버 계정은 다른 회원에 연결되어 있습니다', desc: '한 간편 로그인 계정은 회원 한 명에게만 연결할 수 있습니다. 그 회원으로 로그인해 연결을 해제한 뒤 다시 시도해 주세요.', foot: [Btn('확인', 'primary')] })),
    ),
);

const ConsentRow = (icon, name, desc, on, at) => `<div style="display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid var(--line2)"><i class="xi-${icon}" style="font-size:22px"></i><div style="flex:1"><b style="font-size:14px">${name}</b><div style="font-size:12.5px;color:var(--mute)">${desc}</div><div style="font-size:12px;color:var(--mute);margin-top:2px">${at}</div></div>${Toggle('', { on })}</div>`;

const consentBody = (o = {}) => W(
    H('혜택·이벤트 알림 (선택)', { sub: '동의하지 않아도 가입과 주문에 불이익이 없습니다' }),
    ConsentRow('message-o', '문자', '할인·쿠폰·신상품 소식을 문자로 받습니다', !o.off, o.off ? '수신 거부 2026-11-11 10:24' : '수신 동의 2026-03-02 14:10'),
    ConsentRow('mail-o', '이메일', '뉴스레터와 혜택 안내를 메일로 받습니다', true, '수신 동의 2026-03-02 14:10'),
    ConsentRow('kakaotalk', '카카오톡(친구톡)', '카카오톡 채널 메시지로 혜택을 받습니다', false, '수신 거부 2026-07-19 09:03'),
    '<div style="height:10px"></div>',
    Check('야간(21시 ~ 다음 날 8시)에도 혜택 알림 받기', { on: false }),
    Text('체크하지 않으면 야간에는 광고성 알림을 보내지 않습니다.', { sm: true, mute: true }),
    '<div style="height:18px"></div>',
    Box({ flat: true, title: '동의와 관계없이 보내는 안내' },
        Text('주문·결제·배송·취소·반품·교환 진행, 문의 답변, 약관 변경처럼 거래에 꼭 필요한 안내는 수신 동의를 꺼도 알림톡(실패 시 문자)·이메일로 발송됩니다.', { sm: true })),
    Note('수신 동의 상태는 2년마다 다시 확인하는 안내가 발송됩니다. 수신 동의·거부 일시는 변경할 때마다 기록됩니다.'));

const state3 = StateBlock({ idx: 3, title: '수신 동의 변경', note: '혜택 알림을 문자·이메일·카카오톡 각각 켜고 끕니다. 스위치를 누르는 즉시 저장되고 결과를 알려 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '광고성 정보는 수단별로 따로 동의받아야 하고, 동의·거부한 날짜를 고객에게 알려야 합니다(정보통신망법). 그래서 수단마다 스위치와 변경 일시를 같이 보여 주고, 바꾸면 처리 결과(일시·내용)를 바로 띄웁니다. 관리자 회원 목록의 수신 동의 필터와 같은 값입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '초기값은 가입 때 고른 값. 야간 수신은 따로 동의받고 기본 꺼짐. 주문·배송 안내는 광고가 아니므로 이 스위치와 무관하게 나간다는 것을 화면에 적어 "껐는데 왜 오나" 문의를 줄입니다. 카카오톡 줄은 친구톡을 쓰지 않는 몰에서는 나오지 않습니다.'),
    Canvas({ label: 'U-23 · 수신 동의 탭' }, Page('수신 동의', {}, consentBody())),
    Canvas({ label: 'U-23 · 문자 스위치를 끔 → 처리 결과 안내' }, Overlay({ bg: Page('수신 동의', {}, consentBody({ off: true })), dim: false, align: 'top', h: 380 },
        Toast('문자 혜택 알림 수신을 거부했습니다. (2026-11-11 10:24 처리 · 이너에라)'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '이메일 스위치를 켬', right: '토스트만', pad: 20 }, Toast('이메일 혜택 알림 수신에 동의했습니다. (2026-11-11 10:25 처리 · 이너에라)')),
        Canvas({ size: 'auto', label: '야간 수신 체크 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '야간에도 혜택 알림을 받을까요?', desc: '21시부터 다음 날 8시 사이에도 문자·카카오톡 혜택 알림이 올 수 있습니다. 언제든 다시 끌 수 있습니다.', ok: '야간 수신 동의' })),
    ),
    Canvas({ size: 'mobile', label: 'U-23 · 모바일 · 수신 동의 탭' }, MobilePage({ title: '회원정보', tab: '마이' }, Tabs(TABS, '수신 동의'), consentBody())),
);

const REASONS = ['자주 이용하지 않아요', '상품 가격이 부담돼요', '배송·교환·환불이 불편했어요', '상품이 기대와 달랐어요', '다른 계정으로 다시 가입하려고요', '개인정보가 걱정돼요', '기타(직접 입력)'];

const loseBox = Box({ title: '탈퇴하면 사라지는 것' },
    KV([['적립금', '<b>2,400원</b> — 탈퇴 즉시 소멸, 되살릴 수 없습니다'], ['쿠폰', '<b>1장</b> (신규 가입 3,000원 쿠폰 · 2026-12-31까지) — 탈퇴 즉시 소멸'], ['회원 등급', '일반 회원 — 다시 가입해도 이어지지 않습니다'], ['작성한 리뷰·문의', '리뷰 2건은 삭제되지 않고 이름이 가려진 채 남습니다. 지우려면 탈퇴 전에 직접 삭제해 주세요']], { wide: true }));
const keepBox = Box({ flat: true, title: '법에 따라 보관하는 정보' },
    Text('주문·결제·배송 기록 5년, 소비자 불만·분쟁 처리 기록 3년, 로그인 기록 3개월(전자상거래법·통신비밀보호법). 보관 기간이 지나면 지체 없이 파기합니다. 그 밖의 개인정보는 탈퇴 즉시 파기합니다.', { sm: true }),
    Text('같은 이메일로는 탈퇴 후 30일 동안 다시 가입할 수 없습니다(재가입 제한 일수는 관리자 설정값).', { sm: true, mute: true }));

const leaveForm = (o = {}) => W(
    o.noBenefit ? Box({ title: '탈퇴하면 사라지는 것' }, KV([['작성한 리뷰·문의', '리뷰 2건은 삭제되지 않고 이름이 가려진 채 남습니다. 지우려면 탈퇴 전에 직접 삭제해 주세요']], { wide: true })) : loseBox,
    keepBox,
    Field({ label: '탈퇴 사유', required: true },
        o.open ? Select({ placeholder: '사유를 골라 주세요', open: true, w: '100%', options: REASONS })
            : Select({ value: o.filled ? (o.etc ? '기타(직접 입력)' : '자주 이용하지 않아요') : '', placeholder: '사유를 골라 주세요', w: '100%' })),
    o.etc ? Field({ label: '사유 직접 입력', required: true }, Textarea({ value: '정기배송이 생기면 다시 가입하고 싶어요.', h: 72, count: '21 / 200' })) : '',
    Field({ label: '본인 확인', required: true }, Input({ value: o.filled ? '••••••••' : '', placeholder: '현재 비밀번호', w: '100%' })),
    Check(o.noBenefit ? '위 안내를 모두 확인했고, 탈퇴에 동의합니다.' : '적립금 2,400원과 쿠폰 1장이 사라지는 것을 확인했고, 탈퇴에 동의합니다.', { on: !!o.filled }),
    '<div style="height:16px"></div>',
    BtnRow({ align: 'right' }, Btn('계속 이용하기'), Btn('회원 탈퇴', { kind: 'danger', disabled: !o.filled })));

const blocked = W(
    Note('진행 중인 주문이 있어 지금은 탈퇴할 수 없습니다. 아래 주문이 구매확정되거나 취소·환불이 끝난 뒤 다시 시도해 주세요.', { warn: true }),
    Box({ title: '진행 중인 주문 2건' },
        `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line2);font-size:13.5px"><u>20261111-000128</u>${OrderBadge('결제완료')}<span style="flex:1;color:var(--mute)">롱지비티 석류맛 젤리스틱 · 2박스(28일분)</span>${Btn('주문 취소', { size: 'sm' })}</div>`,
        `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;font-size:13.5px"><u>20261107-000088</u>${OrderBadge('배송중')}<span style="flex:1;color:var(--mute)">롱지비티 석류맛 젤리스틱 · 1박스(14일분)</span>${Btn('배송 조회', { size: 'sm' })}</div>`),
    Text('탈퇴를 막는 상태: 입금대기 · 결제완료 · 배송준비 · 배송중 · 배송완료(구매확정 전) · 취소·반품·교환 진행 중. 구매확정을 직접 누르면 바로 탈퇴할 수 있습니다.', { sm: true, mute: true }),
    '<div style="height:14px"></div>',
    BtnRow({ align: 'right' }, Btn('주문 목록으로'), Btn('회원 탈퇴', { kind: 'danger', disabled: true })));

const state4 = StateBlock({ idx: 4, title: '탈퇴(사유·남은 적립금 소멸 안내)', note: '회원 탈퇴 탭. 사라지는 것을 금액·장수로 보여 주고, 사유·본인 확인·동의 체크가 모두 끝나야 탈퇴 버튼이 켜집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '"혜택이 사라집니다"가 아니라 실제 남은 적립금 2,400원·쿠폰 1장을 그대로 보여 줘야 나중에 "몰랐다"는 분쟁이 없습니다. 탈퇴 사유는 운영자가 관리자 회원 > 휴면·탈퇴에서 통계로 봅니다(사유 목록은 관리자가 편집). 적립금·쿠폰 기능이 꺼진 몰에서는 소멸 안내 줄이 나오지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '진행 중인 주문(입금대기~구매확정 전, 클레임 진행 중)이 있으면 탈퇴를 막고 어떤 주문 때문인지와 해결 버튼을 보여 줍니다. 환불받을 돈이 남은 채 계정이 사라지면 안 되기 때문입니다. 간편가입 회원은 비밀번호 대신 재인증, 탈퇴와 함께 간편 로그인 연결도 끊깁니다.'),
    Canvas({ label: 'U-23 · 회원 탈퇴 탭 · 입력 전 (탈퇴 버튼 잠김)' }, Page('회원 탈퇴', {}, leaveForm())),
    CanvasRow(
        Canvas({ size: 'auto', label: '탈퇴 사유 목록 열림', right: '본문만', pad: 20 }, W(Field({ label: '탈퇴 사유', required: true }, Select({ placeholder: '사유를 골라 주세요', open: true, w: 520, options: REASONS })))),
        Canvas({ size: 'auto', label: '기타 선택 · 모두 입력 → 탈퇴 버튼 켜짐', right: '본문만', pad: 20 }, leaveForm({ filled: true, etc: true })),
    ),
    Canvas({ label: 'U-23 · 회원 탈퇴 버튼 → 마지막 확인' }, Overlay({ bg: Page('회원 탈퇴', {}, leaveForm({ filled: true })), h: 460 },
        Confirm({ w: 420, title: '정말 탈퇴할까요?', desc: '적립금 2,400원과 쿠폰 1장이 바로 사라지고 되돌릴 수 없습니다.<br>같은 이메일로는 30일 동안 다시 가입할 수 없습니다.', ok: '탈퇴하기', danger: true }))),
    Canvas({ label: 'U-23 · 진행 중인 주문이 있어 탈퇴가 막힌 상태' }, Page('회원 탈퇴', {}, blocked)),
    CanvasRow(
        Canvas({ size: 'auto', label: '적립금·쿠폰 기능이 꺼진 몰 — 소멸 안내 없음', right: '본문만', pad: 20 }, leaveForm({ noBenefit: true })),
        Canvas({ size: 'auto', label: '본인 확인 비밀번호가 틀렸을 때', right: '본문만', pad: 20 }, W(Field({ label: '본인 확인', required: true, error: '비밀번호가 맞지 않습니다. 다시 입력해 주세요.' }, Input({ value: '••••••', error: true, w: 520 })))),
    ),
    Canvas({ label: 'U-23 · 탈퇴 완료 (로그아웃된 화면)' }, UserPage({ narrow: true, loggedIn: false },
        Empty({ icon: 'check-circle-o', title: '회원 탈퇴가 완료되었습니다', desc: '그동안 이너에라를 이용해 주셔서 감사합니다.<br>탈퇴 완료 안내를 minji****@naver.com 으로 보냈습니다. 주문 기록은 법에 따라 5년간 보관한 뒤 파기합니다.', action: Btn('홈으로', 'primary') }))),
    Canvas({ size: 'mobile', label: 'U-23 · 모바일 · 회원 탈퇴 탭' }, MobilePage({ title: '회원정보', tab: false, bottom: [Btn('계속 이용하기'), Btn('회원 탈퇴', { kind: 'danger', disabled: true })] }, Tabs(TABS, '회원 탈퇴'), '<div style="height:14px"></div>', `<style>.u23-m .wf-kv.wide{grid-template-columns:84px 1fr}</style><div class="u23-m">${loseBox}</div>`, keepBox,
        Field({ label: '탈퇴 사유', required: true }, Select({ placeholder: '사유를 골라 주세요', w: '100%' })),
        Field({ label: '본인 확인', required: true }, Input({ placeholder: '현재 비밀번호', w: '100%' })),
        Check('적립금 2,400원 · 쿠폰 1장 소멸을 확인했고 탈퇴에 동의합니다.'))),
);

export default function U23() {
    return [state1, state2, state3, state4].join('');
}
