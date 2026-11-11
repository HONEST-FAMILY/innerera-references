import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle, Tabs,
    Textarea, FormTable, Table, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Flex, Grid, DragRow,
} from '../lib/blocks.js';

const TABS = ['가입 항목', '간편 로그인', '휴대폰 확인', '가입 혜택', '탈퇴 정책'];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-98', desc: '회원가입 화면에서 무엇을 받을지, 어떤 로그인 수단을 쓸지, 가입·탈퇴 때의 규칙을 정합니다.', actions: [Btn('가입 화면 미리보기', { icon: 'eye-o' }), Btn('저장', 'primary')], ...o }, Tabs(TABS, tab), body);
const SaveBar = BtnRow({ align: 'right' }, Btn('취소'), Btn('저장', 'primary'));

const use = (v, lock) => (lock ? `<span style="font-size:12.5px;color:var(--mute)">${Icon('lock-o')} 필수 (바꿀 수 없음)</span>` : RadioGroup(['필수', '선택', '사용 안 함'], v));
const F_COLS = [{ t: '항목', w: 150 }, { t: '받는 방식', w: 290 }, '설명 · 쓰이는 곳', { t: '간편 가입 때', w: 180 }];
const F_ROWS = (o = {}) => [
    { group: '기본 항목 (모든 몰 공통)' },
    ['<b>이메일</b>', use('', true), '로그인 아이디 · 주문 메일. 중복 확인을 거칩니다.', '카카오·네이버에서 받아 옴'],
    ['<b>비밀번호</b>', use('', true), '영문·숫자·특수문자 10자 이상', '받지 않음'],
    ['<b>이름</b>', use('', true), '주문자 이름으로 쓰입니다.', '받아 옴'],
    ['<b>휴대폰 번호</b>', use('필수'), '주문·배송 알림을 받는 번호. 확인 방식은 휴대폰 확인 탭에서 정합니다.', '없으면 추가로 입력받음'],
    { group: '더 받을 수 있는 항목 (처음에는 모두 사용 안 함)' },
    ['<b>생년월일</b>', use(o.birth || '사용 안 함'), '생일 쿠폰을 쓰려면 필요합니다. 만 14세 미만 가입 제한에도 쓰입니다.', '없으면 추가로 입력받음'],
    ['<b>성별</b>', use('사용 안 함'), '통계에만 쓰입니다. 꼭 필요하지 않으면 받지 않는 것을 권합니다.', '없으면 추가로 입력받음'],
    ['<b>주소</b>', use('사용 안 함'), '가입할 때 기본 배송지로 저장. 받지 않아도 첫 주문 때 넣습니다.', '추가로 입력받음'],
    ['<b>추천인</b>', use('사용 안 함'), '추천한 회원의 이메일. 추천 적립금을 주려면 가입 혜택 탭에서 금액을 정합니다.', '추가로 입력받음'],
    { group: '수신 동의 (가입 화면 약관 동의 아래)' },
    ['<b>광고성 정보 수신</b>', `<span style="font-size:12.5px">${Check('알림톡·문자', { on: true })} ${Check('메일', { on: true })} <span style="color:var(--mute)">선택 동의로만 받을 수 있음</span></span>`, '쿠폰·행사 안내를 보내려면 동의가 필요합니다. 동의·거부한 날짜가 회원 상세에 남습니다.', '가입 완료 화면에서 물어봄'],
];

const JoinPv = (o = {}) => `<div style="border:1px solid var(--line);border-radius:6px;padding:18px;background:#fff;width:100%"><b style="font-size:15px">회원가입</b><div style="margin:12px 0;display:grid;gap:6px">${Btn('카카오로 시작하기', { block: true, icon: 'kakaotalk' })}${o.naver ? Btn('네이버로 시작하기', { block: true, icon: 'naver' }) : ''}</div><div style="font-size:11.5px;color:var(--mute);text-align:center;margin-bottom:10px">또는 이메일로 가입</div>${[['이메일', '필수'], ['비밀번호', '필수'], ['이름', '필수'], ['휴대폰 번호', '필수'], ...(o.birth ? [['생년월일', '선택']] : [])].map(([k, r]) => `<div style="margin-bottom:8px"><div style="font-size:12px;font-weight:700;margin-bottom:3px">${k} <span style="font-weight:400;color:var(--mute)">${r}</span></div>${k === '휴대폰 번호' ? `<div style="display:flex;gap:6px">${Input({ placeholder: '010-0000-0000', w: 170 })}${Btn('인증번호 받기', { size: 'sm' })}</div>` : Input({ placeholder: k, w: '100%' })}</div>`).join('')}<div style="font-size:12px;margin:10px 0;display:grid;gap:5px">${Check('이용약관 동의 (필수)')}${Check('개인정보 수집·이용 동의 (필수)')}${Check('만 14세 이상입니다 (필수)')}${Check('광고성 정보 수신 동의 (선택)')}</div>${Btn('가입하기', { kind: 'primary', block: true, disabled: true })}<div style="font-size:11.5px;color:var(--mute);margin-top:8px;text-align:center">가입하면 3,000원 쿠폰을 드립니다</div></div>`;

const state1 = StateBlock({ idx: 1, title: '가입 항목(필수·선택·사용 안 함)', note: '설정 > 회원가입·로그인 설정의 첫 탭. 가입 화면에서 받을 항목마다 필수 · 선택 · 사용 안 함을 고릅니다. 오른쪽에 고객이 보는 가입 화면이 따라 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '가입 항목은 고객사마다 다릅니다(생일 쿠폰을 쓰는 몰은 생년월일, 추천 행사를 하는 몰은 추천인). 항목을 코드에 박으면 고객사마다 가입 화면을 다시 만들어야 하므로 항목별로 스위치를 둡니다. 받는 항목이 늘수록 가입을 그만두는 사람이 늘기 때문에 처음에는 꼭 필요한 4가지만 받고 나머지는 모두 사용 안 함입니다.'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '초기값: 필수 = 이메일 · 비밀번호 · 이름 · 휴대폰 / 생년월일 · 성별 · 주소 · 추천인 = 사용 안 함. 이메일 · 비밀번호 · 이름은 주문에 꼭 필요해 바꿀 수 없습니다. 항목을 새로 필수로 바꾸면 이미 가입한 회원에게는 다음 로그인 때가 아니라 그 항목이 필요한 순간(생일 쿠폰 받기 등)에만 물어봅니다. 목록에 없는 새 항목을 만드는 것은 개발이 필요합니다.'),
    Canvas({ label: 'A-98 · 가입 항목 탭 (이너에라 값 = 초기값 그대로)' }, Page('가입 항목', {}, Grid('minmax(0,1fr) 290px', `<div>${Table({ cols: F_COLS, rows: F_ROWS() })}${Note('만 14세 미만은 가입할 수 없습니다(법정대리인 동의 절차를 두지 않음). 가입 화면의 만 14세 이상 확인은 끌 수 없습니다.')}</div>`, `<div><div style="font-size:12.5px;font-weight:700;margin-bottom:8px">고객이 보는 가입 화면</div>${JoinPv()}</div>`), SaveBar)),
    Canvas({ label: 'A-98 · 생년월일을 선택으로 바꾼 모습 (미리보기에 칸이 생김 · 저장 전)' }, Page('가입 항목', {}, Grid('minmax(0,1fr) 290px', `<div>${Table({ cols: F_COLS, rows: F_ROWS({ birth: '선택' }).slice(5, 10) })}${Note('생년월일을 받기 시작하면 혜택 > 쿠폰에서 생일 자동 발급 쿠폰을 만들 수 있습니다. 개인정보처리방침의 수집 항목에 생년월일을 추가한 새 버전을 등록해야 합니다. <u>약관·정책으로 가기</u>', { warn: true })}</div>`, `<div><div style="font-size:12.5px;font-weight:700;margin-bottom:8px">고객이 보는 가입 화면</div>${JoinPv({ birth: true })}</div>`), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '휴대폰 번호를 사용 안 함으로 바꾸려 할 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '휴대폰 번호를 받지 않을까요?', desc: '가입할 때 휴대폰 번호를 받지 않으면 알림톡·문자를 보낼 수 없어 주문 알림이 메일로만 갑니다. 첫 주문 때 주문서에서 받는 번호는 그대로 받습니다. 휴대폰 확인 탭의 인증도 함께 꺼집니다.', ok: '받지 않기', danger: true })),
        Canvas({ size: 'auto', label: '저장 → 수집 항목이 늘 때 안내', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '받는 항목이 늘었습니다', desc: '생년월일을 새로 받습니다. 개인정보처리방침과 가입 동의서의 수집 항목에 생년월일이 들어가야 합니다. 저장한 뒤 약관·정책에서 새 버전을 등록해 주세요.', foot: [Btn('취소'), Btn('저장만 하기'), Btn('저장하고 약관·정책으로', 'primary')] })),
    ),
);

const keyBox = (name, icon, o = {}) => Box({ title: `${name} 로그인`, right: o.on ? Badge('연결됨', 'check') : o.fail ? Badge('연결 실패', 'x') : Badge('연결 안 됨', 'mute') },
    FormTable([
        { k: '사용', v: [Toggle('로그인·가입 화면에 버튼 보이기', { on: !!o.on, disabled: !o.on }), o.on ? '' : Text('연결 확인이 끝나야 켤 수 있습니다', { sm: true, mute: true })] },
        { k: name === '카카오' ? '앱 키 (REST API 키)' : '클라이언트 아이디', required: true, v: Input({ value: o.on || o.fail ? (name === '카카오' ? '3f9c****************a21b' : 'Qk7v****Xp2') : '', placeholder: `${name} 개발자 화면에서 복사`, w: 340, error: o.fail }), error: o.fail ? `${name}가 이 키를 받아 주지 않았습니다. 키를 다시 복사하거나, 아래 돌아올 주소가 ${name} 개발자 화면에 등록됐는지 확인해 주세요.` : undefined },
        { k: name === '카카오' ? '보안 키 (Client Secret)' : '클라이언트 비밀 키', required: true, v: [Input({ value: o.on || o.fail ? '●●●●●●●●●●●● (저장됨)' : '', placeholder: '붙여 넣기', w: 340 }), o.on ? Btn('다시 입력', { size: 'sm' }) : ''], help: '저장한 뒤에는 다시 볼 수 없습니다.' },
        { k: '돌아올 주소', v: [Input({ value: `https://innerera.example/login/${name === '카카오' ? 'kakao' : 'naver'}/callback`, w: 420, disabled: true }), Btn('복사', { size: 'sm', icon: 'link' })], help: `이 주소를 ${name} 개발자 화면의 ${name === '카카오' ? 'Redirect URI' : '서비스 URL · Callback URL'} 에 그대로 등록해야 합니다.` },
        { k: `${name}에서 받는 항목`, v: Text(name === '카카오' ? '이메일(필수 동의) · 이름 · 휴대폰 번호 — 이름·휴대폰은 카카오 비즈 앱 전환과 심사가 필요하고, 못 받으면 가입 때 추가로 입력받습니다' : '이메일 · 이름 · 휴대폰 번호 — 네이버 검수를 통과해야 일반 고객이 쓸 수 있습니다', { sm: true }) },
        ...(o.on ? [{ k: '지금', v: Text(`<b>${name}로 가입한 회원 ${name === '카카오' ? '812' : '0'}명</b> · 마지막 연결 확인 2026-11-11 09:30 성공`, { sm: true }) }] : []),
    ]),
    Flex({ gap: 8, mt: 12 }, Btn('저장하고 연결 확인', { kind: o.on ? 'line' : 'primary', icon: 'refresh' }), o.on ? Btn('연결 끊기', 'danger') : Btn(`${name} 연결 방법 보기`, { icon: 'external-link' })),
);

const state2 = StateBlock({ idx: 2, title: '간편 로그인 연결(카카오·네이버 연결 상태)', note: '간편 로그인 탭. 카카오·네이버 로그인을 쓰려면 고객사 이름으로 받은 키를 넣고 연결 확인을 합니다. 연결된 수단만 고객 화면에 버튼이 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '간편 로그인 키는 쇼핑몰 사업자 이름으로 카카오·네이버 개발자 화면에서 받아야 해서 고객사마다 다릅니다. 키를 코드에 넣으면 고객사가 바뀔 때마다 배포해야 하므로 이 화면에서 넣고, 연결 확인 버튼으로 실제 로그인 창이 열리는지 바로 시험합니다. 우리 쪽 돌아올 주소는 복사 버튼으로 줘서 오타가 없게 합니다.'),
    Anno({ warn: true, title: '초기값 · 빈 상태 · 놓치면 안 되는 것' }, '초기값은 둘 다 연결 안 됨이고, 연결 안 된 수단의 버튼은 고객의 로그인·가입 화면에 아예 나오지 않습니다. 연결을 끊어도 그 수단으로 가입한 회원은 지워지지 않지만 로그인할 수 없게 되므로, 끊기 전에 몇 명인지와 이메일 비밀번호 설정 안내를 보낼지 묻습니다. 이 탭은 최고관리자만 고칩니다.'),
    Canvas({ label: 'A-98 · 간편 로그인 탭 · 카카오 연결됨 · 네이버 연결 안 됨 (이너에라 오픈 시점 예시)' }, Page('간편 로그인', {}, keyBox('카카오', 'kakaotalk', { on: true }), keyBox('네이버', 'naver'), Note('간편 로그인으로 처음 들어온 고객은 부족한 항목(가입 항목 탭에서 필수로 정한 것)만 추가로 입력하고 가입이 끝납니다. 같은 이메일로 이미 가입한 회원이면 계정을 합칠지 묻습니다.'))),
    Canvas({ label: 'A-98 · 설치 직후 · 둘 다 연결 안 됨 (고객 화면에 간편 로그인 버튼 없음)' }, Page('간편 로그인', {}, Note('연결된 간편 로그인이 없습니다. 고객은 이메일로만 가입·로그인합니다.'), keyBox('카카오', 'kakaotalk'))),
    Canvas({ label: 'A-98 · 저장하고 연결 확인 → 실패 (키가 틀렸거나 돌아올 주소 미등록)' }, Page('간편 로그인', {}, keyBox('네이버', 'naver', { fail: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '연결 확인 성공', right: '토스트만', pad: 20 }, Toast('네이버 로그인 연결을 확인했습니다. 사용 스위치를 켜면 고객 화면에 버튼이 나옵니다.', { action: '지금 켜기' })),
        Canvas({ size: 'auto', label: '카카오 연결 끊기 버튼', right: '팝업만', pad: 20 }, Modal({ title: '카카오 로그인 연결을 끊을까요?', w: 520, foot: [Btn('취소'), Btn('연결 끊기', 'danger')] }, Note('카카오로만 로그인하는 회원이 <b>812명</b> 있습니다. 끊으면 이 회원들은 로그인할 수 없습니다.', { warn: true }), FormTable([{ k: '회원 안내', v: Check('812명에게 비밀번호 설정 메일 보내기', { on: true }), help: '메일의 링크로 비밀번호를 정하면 이메일로 로그인할 수 있습니다.' }]), Text('회원 정보와 주문 내역은 지워지지 않습니다. 다시 연결하면 그대로 카카오로 로그인할 수 있습니다.', { sm: true }))),
    ),
);

const phoneForm = (mode, o = {}) => FormTable([
    { k: '확인 방식', required: true, v: `<div style="width:100%;display:grid;gap:8px">${[
        ['확인하지 않음', '번호를 적기만 합니다. 잘못된 번호로 알림이 갈 수 있습니다.'],
        ['문자 인증번호', '적은 번호로 6자리 인증번호를 보내 본인 휴대폰인지만 확인합니다. 문자 요금만 듭니다. (기본)'],
        ['본인인증', '통신사 본인인증으로 실명 · 생년월일 · 성별까지 확인합니다. 본인인증 회사와 따로 계약해야 하고 건당 요금이 듭니다.'],
    ].map(([t, d]) => `<div style="border:${t === mode ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:10px 12px">${Radio(`<b>${t}</b>`, { on: t === mode })}<div style="font-size:12.5px;color:var(--ink2);margin:3px 0 0 26px">${d}</div></div>`).join('')}</div>` },
    ...(mode === '문자 인증번호' ? [
        { k: '인증번호', v: [Text('6자리 숫자 ·', { sm: true }), Select({ value: '3분', w: 90 }), Text('안에 입력 · 다시 받기는', { sm: true }), Select({ value: '60초', w: 90 }), Text('뒤부터', { sm: true })] },
        { k: '보내는 횟수 제한', v: [Text('한 번호로 하루', { sm: true }), Select({ value: '5번', w: 90 }), Text('까지 · 넘으면 내일 다시 시도해 주세요 안내', { sm: true })], help: '인증 문자를 일부러 많이 보내게 해 요금을 쓰게 하는 장난을 막습니다.' },
        { k: '같은 번호로 가입', v: RadioGroup(['한 번호에 계정 하나만', '여러 계정 허용'], '한 번호에 계정 하나만'), help: '가입 쿠폰을 여러 번 받으려는 중복 가입을 막습니다. 이미 가입된 번호면 가입한 이메일 일부(mi***@naver.com)를 알려 줍니다.' },
        { k: '확인하는 때', v: CheckGroup(['회원가입', '휴대폰 번호 변경', '비밀번호 찾기', '비회원 주문 조회'], ['회원가입', '휴대폰 번호 변경', '비밀번호 찾기']) },
    ] : []),
    ...(mode === '본인인증' ? [
        { k: '본인인증 연결', required: true, v: [Input({ value: o.empty ? '' : 'store-4f2a91c7-****', placeholder: '본인인증 상점 아이디', w: 280, error: o.empty }), Btn('연결 확인', { size: 'sm', icon: 'refresh' }), o.empty ? Badge('연결 안 됨', 'x') : Badge('연결됨', 'check')], help: '결제 연결(포트원)과 같은 계정에서 본인인증 채널을 추가해 받은 값입니다. 계약과 요금은 쇼핑몰 사업자 몫입니다.', error: o.empty ? '본인인증 상점 아이디를 넣고 연결 확인을 해야 본인인증으로 바꿀 수 있습니다. 그동안은 문자 인증번호로 확인합니다.' : undefined },
    ] : []),
    ...(mode === '본인인증' && !o.empty ? [
        { k: '확인하는 때', v: CheckGroup(['회원가입', '휴대폰 번호 변경', '비밀번호 찾기'], ['회원가입']), help: '본인인증을 거치면 이름 · 생년월일 · 성별이 자동으로 채워져 가입 항목에서 따로 받지 않습니다.' },
        { k: '나이 제한', v: [Check('만 19세 미만 가입 막기 (성인 상품을 파는 몰)'), Text('만 14세 미만은 항상 막습니다', { sm: true, mute: true })] },
        { k: '같은 사람 중복 가입', v: RadioGroup(['한 사람에 계정 하나만', '여러 계정 허용'], '한 사람에 계정 하나만') },
    ] : []),
]);

const state3 = StateBlock({ idx: 3, title: '휴대폰 확인 방식(문자 인증·본인인증)', note: '휴대폰 확인 탭. 가입할 때 적은 휴대폰 번호를 어떻게 확인할지 고릅니다. 방식에 따라 아래 입력칸이 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '번호가 틀리면 주문·배송 알림이 엉뚱한 사람에게 갑니다. 문자 인증번호는 요금이 적고 가입이 빠르며, 본인인증은 실명과 나이까지 확인하지만 계약·건당 요금이 들고 가입을 그만두는 사람이 늡니다. 몰의 성격(성인 확인이 필요한 상품인지)에 따라 고르게 합니다.'),
    Anno({ warn: true, title: '유형별 입력칸 분기 · 초기값' }, '초기값 = 문자 인증번호(이너에라도 이 값 — 일반식품이라 성인 확인이 필요 없음). 문자 인증번호 = 유효 시간 · 횟수 제한 · 같은 번호 가입 제한 / 본인인증 = 연결 값 · 나이 제한 · 한 사람 한 계정. 본인인증은 연결 확인이 끝나기 전에는 고를 수 없고, 가입 항목 탭에서 휴대폰을 사용 안 함으로 두면 이 탭 전체가 잠깁니다.'),
    Canvas({ label: 'A-98 · 휴대폰 확인 탭 · 문자 인증번호 (초기값)' }, Page('휴대폰 확인', {}, phoneForm('문자 인증번호'), SaveBar)),
    Canvas({ label: 'A-98 · 본인인증을 고른 모습 (연결됨 · 다른 업종 예시: 성인 확인이 필요한 몰)' }, Page('휴대폰 확인', {}, phoneForm('본인인증'), SaveBar)),
    Canvas({ label: 'A-98 · 본인인증을 골랐지만 연결 값이 없을 때 (저장 막힘)' }, Page('휴대폰 확인', {}, phoneForm('본인인증', { empty: true }), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '문자 인증번호 → 확인하지 않음으로 바꿀 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '휴대폰 번호를 확인하지 않을까요?', desc: '틀린 번호나 남의 번호로 가입할 수 있게 됩니다. 주문 알림이 다른 사람에게 갈 수 있고, 한 번호 한 계정 제한도 풀려 가입 쿠폰을 여러 번 받을 수 있습니다.', ok: '확인하지 않기', danger: true })),
        Canvas({ size: 'auto', label: '고객이 받는 인증 문자 (문구는 설정 > 알림에서 고침)', right: '부분', pad: 20 }, `<div style="width:280px;border:1px solid var(--line);border-radius:10px;padding:12px;font-size:12.5px;line-height:1.6;background:#fff">[이너에라] 인증번호 482915<br>3분 안에 입력해 주세요. 다른 사람에게 알려 주지 마세요.</div>`),
    ),
);

const benefitForm = (o = {}) => [
    Box({ title: '가입 쿠폰', right: o.couponOff ? Badge('쿠폰 기능 꺼짐', 'mute') : Badge('주는 중', 'check') },
        o.couponOff
            ? Note('쿠폰 기능이 꺼져 있어 가입 쿠폰을 줄 수 없습니다. 설정 > 기능 켜고 끄기에서 쿠폰을 켜 주세요. <u>기능 켜고 끄기로 가기</u>')
            : [Table({ dense: true, cols: ['자동 발급 쿠폰 (혜택 > 쿠폰에서 발급 방식이 가입인 것)', { t: '할인', w: 120 }, { t: '쓸 수 있는 기간', w: 150 }, { t: '지금까지', w: 110 }, { t: '', w: 100 }], rows: [['<b>신규 가입 3,000원 할인</b><small>30,000원 이상 주문에 사용</small>', '3,000원', '받은 날부터 30일', '1,284장 발급', Btn('쿠폰 고치기', { size: 'sm', iconRight: 'angle-right-min' })]] }), Note('가입 쿠폰의 금액·조건은 혜택 > 쿠폰에서 고칩니다. 여기서는 어떤 쿠폰이 가입할 때 나가는지 보여 주기만 합니다. 쿠폰을 더 주려면 쿠폰을 새로 만들고 발급 방식을 가입으로 고르세요.')]),
    Box({ title: '가입 적립금', right: o.pointOff ? Badge('적립금 기능 꺼짐', 'mute') : '' },
        o.pointOff
            ? Note('적립금 기능이 꺼져 있어 가입 적립금을 줄 수 없습니다.')
            : FormTable([
                { k: '가입 적립금', v: [Toggle('', { on: !!o.point }), Input({ value: o.point ? '1,000' : '', placeholder: '금액', suffix: '원', w: 130, disabled: !o.point, error: o.pointErr })], help: '가입이 끝나면 바로 지급합니다. 소멸 기한은 혜택 > 적립금 정책을 따릅니다.', error: o.pointErr ? '금액을 넣어 주세요. 주지 않으려면 스위치를 꺼 주세요.' : undefined },
                { k: '추천인 적립금', v: [Toggle('', { on: false, disabled: true }), Text('가입 항목 탭에서 추천인을 받도록 해야 켤 수 있습니다', { sm: true, mute: true })] },
            ])),
    Box({ title: '고객에게 보이는 문구' }, FormTable([
        { k: '가입 화면 아래 한 줄', v: Input({ value: '가입하면 3,000원 쿠폰을 드립니다', w: 400 }), help: '가입 화면 · 로그인 화면 · 서랍 메뉴 맨 위에 나옵니다. 비우면 안 나옵니다. 30자까지.' },
        { k: '가입 완료 화면 문구', v: Textarea({ value: '이너에라 회원이 되신 것을 환영합니다.<br>3,000원 할인 쿠폰이 발급되었습니다. 마이페이지 > 쿠폰에서 확인해 주세요.', h: 64, count: '58 / 200' }) },
        { k: '혜택 받는 조건', v: [Check('휴대폰 확인을 마친 회원에게만 주기', { on: true }), Check('탈퇴 뒤 다시 가입한 회원에게는 주지 않기', { on: true })], help: '쿠폰을 여러 번 받으려고 가입과 탈퇴를 되풀이하는 것을 막습니다.' },
    ])),
];

const state4 = StateBlock({ idx: 4, title: '가입 혜택(쿠폰·적립금)', note: '가입 혜택 탭. 가입한 고객에게 주는 쿠폰·적립금과 가입 화면에 보이는 안내 문구를 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '가입 쿠폰은 첫 주문을 끌어내는 가장 흔한 수단입니다. 쿠폰 자체(금액 · 조건 · 기간)는 혜택 > 쿠폰에서 만들고, 이 탭은 가입할 때 무엇이 나가는지를 한눈에 보여 주며 가입 화면 문구와 받는 조건을 정합니다. 문구와 실제 혜택이 어긋나지 않게 같은 화면에 둡니다.'),
    Anno({ warn: true, title: '초기값 · 기능이 꺼진 몰' }, '초기값은 혜택 없음(쿠폰 없음 · 적립금 끔 · 문구 비움)이고, 이너에라는 3,000원 가입 쿠폰을 줍니다(금액은 예시 · 고객 확인 필요). 쿠폰·적립금 기능을 끈 몰에서는 그 묶음이 잠기고 켜는 곳을 알려 줍니다. 가입 화면 문구에 금액을 적어 놓고 쿠폰을 지우면 저장할 때 경고합니다.'),
    Canvas({ label: 'A-98 · 가입 혜택 탭 (이너에라: 가입 쿠폰 1종 · 가입 적립금 끔)' }, Page('가입 혜택', {}, benefitForm(), SaveBar)),
    Canvas({ label: 'A-98 · 쿠폰 · 적립금 기능을 끈 몰 (다른 고객사 예시 — 묶음이 잠김)' }, Page('가입 혜택', {}, benefitForm({ couponOff: true, pointOff: true }).slice(0, 2), Note('혜택 없이 가입만 받는 몰입니다. 가입 화면 아래 한 줄 문구는 비워 두세요.'), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '가입 적립금을 켜고 금액을 비운 채 저장', right: '부분', pad: 20 }, `<div style="width:640px">${FormTable([{ k: '가입 적립금', v: [Toggle('', { on: true }), Input({ placeholder: '금액', suffix: '원', w: 130, error: true })], error: '금액을 넣어 주세요. 주지 않으려면 스위치를 꺼 주세요.' }])}</div>`),
        Canvas({ size: 'auto', label: '문구에는 쿠폰이 있는데 가입 쿠폰이 없을 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '가입 화면 문구와 실제 혜택이 다릅니다', desc: '가입 화면에 가입하면 3,000원 쿠폰을 드립니다 문구가 나가는데, 가입할 때 발급되는 쿠폰이 없습니다(11-11 삭제). 문구를 지우거나 쿠폰을 다시 만들어 주세요.', foot: [Btn('문구 지우고 저장', 'primary'), Btn('쿠폰 만들러 가기')] })),
    ),
);

const reasons = ['상품이 마음에 들지 않아서', '가격이 비싸서', '배송이 느려서', '자주 이용하지 않아서', '개인정보가 걱정돼서'];
const leaveForm = (o = {}) => [
    Box({ title: '재가입 제한' }, FormTable([
        { k: '탈퇴 뒤 다시 가입', required: true, v: [Text('탈퇴한 날부터', { sm: true }), Select({ value: o.zero ? '제한 없음' : '30일', w: 120, open: o.open, options: o.open ? ['제한 없음', '7일', { t: '30일', on: true, sub: '기본' }, '90일', '1년'] : undefined }), o.open ? '' : Text('동안 같은 이메일·휴대폰으로 가입할 수 없음', { sm: true })], help: o.open ? undefined : '가입 쿠폰만 받고 탈퇴했다가 다시 가입하는 것을 막습니다. 제한 중에 가입하려 하면 11월 30일부터 다시 가입할 수 있습니다 안내가 나옵니다.' },
        ...(o.open ? [] : [{ k: '제한에 쓰는 정보', v: Text('이메일과 휴대폰 번호를 알아볼 수 없게 바꾼 값만 제한 기간 동안 보관하고, 기간이 끝나면 지웁니다.', { sm: true }) }]),
    ]), o.zero ? Note('제한 없음으로 두면 가입 혜택을 여러 번 받을 수 있습니다. 가입 혜택 탭의 다시 가입한 회원에게는 주지 않기는 제한 기간이 있어야 동작합니다.', { warn: true }) : ''),
    Box({ title: '정보 파기' }, FormTable([
        { k: '파기 유예', required: true, v: [Text('탈퇴 신청 뒤', { sm: true }), Select({ value: '7일', w: 100 }), Text('동안 보관한 뒤 파기 (그 안에 탈퇴 철회 가능)', { sm: true })], help: '실수로 탈퇴한 고객이 고객센터에 연락하면 유예 기간 안에는 되살릴 수 있습니다. 0일로 하면 탈퇴 즉시 파기합니다. 파기 예정일은 회원 > 휴면·탈퇴의 탈퇴 탭에 보입니다.' },
        { k: '법에 따라 남기는 것', v: Table({ dense: true, cols: ['남기는 기록', { t: '기간', w: 80 }, '근거'], rows: [['계약 · 청약철회(주문 · 취소 · 반품) 기록', '5년', '전자상거래법'], ['대금 결제 · 재화 공급 기록', '5년', '전자상거래법'], ['소비자 불만 · 분쟁 처리(문의) 기록', '3년', '전자상거래법'], ['로그인 기록', '3개월', '통신비밀보호법']] }), help: '고정 값입니다. 탈퇴한 회원의 주문은 주문 목록에 탈퇴 회원으로 표시되고 이름·연락처는 배송과 분쟁 처리에 필요한 범위에서만 보입니다.' },
        { k: '함께 사라지는 것', v: Text('적립금 잔액 · 쓰지 않은 쿠폰 · 찜 · 배송지 · 작성한 리뷰의 작성자 이름(탈퇴 회원으로 바뀜 · 리뷰 글은 남김)', { sm: true }) },
    ])),
    Box({ title: '탈퇴 화면' }, FormTable([
        { k: '탈퇴할 수 없는 경우', v: [Check('진행 중인 주문(결제완료 ~ 배송중)이 있으면 탈퇴 막기', { on: true, disabled: true }), Check('취소·반품·교환이 진행 중이면 탈퇴 막기', { on: true, disabled: true })], help: '고정 값입니다. 환불받을 돈이 남은 채 탈퇴하는 것을 막습니다.' },
        { k: '탈퇴 사유 목록', v: `<div style="width:100%">${reasons.map((r) => DragRow({ right: [Icon('pen-o'), Icon('trash-o')] }, `<span style="font-size:13px">${r}</span>`)).join('')}<div class="wf-dragrow off">${Icon('lock-o')}<div class="dc" style="font-size:13px">기타 (직접 입력)</div><span style="font-size:11.5px">지울 수 없음</span></div>${Btn('사유 추가', { size: 'sm', icon: 'plus' })}</div>`, help: '고객이 하나를 고릅니다. 고른 사유는 회원 > 휴면·탈퇴에서 모아 봅니다. 8개까지.' },
        { k: '탈퇴 안내 문구', v: Textarea({ value: '탈퇴하시면 보유하신 적립금과 쿠폰은 모두 사라지며 되살릴 수 없습니다.<br>주문 내역은 관련 법에 따라 5년 동안 보관됩니다.', h: 64, count: '62 / 300' }), help: '고객의 탈퇴 화면 맨 위에 나옵니다. 남은 적립금·쿠폰 수는 자동으로 붙습니다.' },
    ])),
];

const state5 = StateBlock({ idx: 5, title: '탈퇴 정책(재가입 제한·정보 파기 유예)', note: '탈퇴 정책 탭. 탈퇴한 뒤 다시 가입할 수 있는 때, 정보를 지우는 때, 고객의 탈퇴 화면에 보이는 사유와 문구를 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '탈퇴는 개인정보를 지우는 일이라 규칙이 분명해야 합니다. 재가입 제한은 가입 혜택을 되풀이해 받는 것을 막고, 파기 유예는 실수로 탈퇴한 고객을 되살릴 여지를 줍니다. 법에 따라 남겨야 하는 기록(주문 5년 등)은 고정으로 보여 줘, 운영자가 왜 탈퇴 회원의 주문이 남아 있는지 고객에게 설명할 수 있게 합니다.'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '초기값: 재가입 제한 30일 · 파기 유예 7일 · 탈퇴 사유 5개 + 기타. 바꿀 수 있는 것 = 제한 일수 · 유예 일수 · 사유 목록 · 안내 문구. 바꿀 수 없는 것 = 법에 따라 남기는 기록과 기간, 진행 중인 주문이 있을 때 탈퇴 막기. 값을 바꿔도 이미 탈퇴한 회원에게는 탈퇴 당시의 값이 적용됩니다.'),
    Canvas({ label: 'A-98 · 탈퇴 정책 탭 (초기값)' }, Page('탈퇴 정책', {}, leaveForm(), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '재가입 제한 일수 목록을 연 모습', right: '부분', pad: 20 }, `<div style="width:560px;min-height:300px">${FormTable([{ k: '탈퇴 뒤 다시 가입', required: true, v: [Text('탈퇴한 날부터', { sm: true }), Select({ value: '30일', w: 160, open: true, options: ['제한 없음', '7일', { t: '30일', on: true, sub: '기본' }, '90일', '1년'] })] }])}</div>`),
        Canvas({ size: 'auto', label: '제한 없음을 고르면 뜨는 경고', right: '부분', pad: 20 }, `<div style="width:560px">${Note('제한 없음으로 두면 가입 혜택을 여러 번 받을 수 있습니다. 가입 혜택 탭의 다시 가입한 회원에게는 주지 않기는 제한 기간이 있어야 동작합니다.', { warn: true })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '파기 유예를 0일로 바꿀 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '탈퇴하면 바로 파기할까요?', desc: '유예 기간을 0일로 하면 고객이 탈퇴를 누르는 즉시 회원 정보가 지워져, 실수로 탈퇴한 고객을 되살릴 수 없습니다. 법에 따라 남기는 주문·결제 기록은 그대로 남습니다.', ok: '0일로 저장', danger: true })),
        Canvas({ size: 'auto', label: '사유 추가 → 8개를 넘길 때', right: '토스트만', pad: 20 }, Toast('탈퇴 사유는 8개까지 넣을 수 있습니다. 쓰지 않는 사유를 지운 뒤 추가해 주세요.', { kind: 'error' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('탈퇴 정책을 저장했습니다. 지금부터 탈퇴하는 회원에게 적용됩니다.')),
        Canvas({ size: 'auto', label: '가입 화면 미리보기 버튼 (모든 탭 공통 · 저장 전 값 반영)', right: '부분', pad: 20 }, `<div style="width:300px">${JoinPv({ naver: true })}</div>`),
    ),
);

export default function A98() {
    return [state1, state2, state3, state4, state5].join('');
}
