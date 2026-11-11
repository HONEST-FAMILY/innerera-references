import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Input, Check, Field, Overlay, Modal, Toast, Box, KV, Note, Text, Icon, Flex, Divider,
} from '../lib/blocks.js';

const Shell = (...body) => `
<div style="min-height:720px;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px">
  <div style="width:420px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:36px 36px 28px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><div class="u-logo">Inner:Era 로고</div><b style="font-size:17px">관리자</b></div>
    ${body.flat(Infinity).join('')}
  </div>
  <p style="margin:16px 0 0;font-size:12px;color:var(--mute)">이 화면은 운영자 전용입니다. 접속 기록(시각 · IP · 계정)이 저장됩니다.</p>
</div>`;

const Card = (...body) => `
<div style="width:420px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:32px 36px 28px">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><div class="u-logo">Inner:Era 로고</div><b style="font-size:17px">관리자</b></div>
  ${body.flat(Infinity).join('')}
</div>`;

const Lead = (t) => `<p style="margin:0 0 22px;font-size:13px;color:var(--ink2)">${t}</p>`;
const Links = () => `<div style="display:flex;justify-content:space-between;margin-top:14px;font-size:12.5px;color:var(--ink2)">${Check('아이디 저장', { on: true })}<u>비밀번호를 잊으셨나요?</u></div>`;
const Gap = (h = 12) => `<div style="height:${h}px"></div>`;

const loginForm = (o = {}) => [
    Lead('운영자 계정으로 로그인하세요. 계정은 설정 > 운영자·권한에서 대표 운영자가 초대합니다.'),
    o.top || '',
    Field({ label: '아이디(이메일)' }, Input({ w: '100%', value: o.id === undefined ? 'borim@innerera.example' : o.id, placeholder: '이메일 주소', error: o.idErr, focus: o.idFocus })),
    Field({ label: '비밀번호', error: o.err }, Input({ w: '100%', value: o.pw === undefined ? '●●●●●●●●●●' : o.pw, placeholder: '비밀번호', icon: 'lock-o', error: !!o.err })),
    Gap(6),
    Btn('로그인', { kind: 'primary', size: 'lg', block: true, disabled: o.disabled }),
    Links(),
];

const state1 = StateBlock({ idx: 1, title: '기본', note: '주소 /admin/login. 로그인하지 않고 관리자 주소로 들어오면 모두 이 화면으로 옵니다. 로그인하면 원래 가려던 화면으로 돌아갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '관리자에는 고객 이름·연락처·주소가 다 들어 있습니다. 그래서 회원가입 버튼이 없고(초대로만 계정 생성), 아이디·비밀번호가 맞아도 2단계 인증을 거쳐야 들어갑니다. 초기값: 아이디 저장을 켜 둔 기기에서는 아이디가 채워져 있고 비밀번호 칸에 커서가 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '오류 문구는 아이디가 틀렸는지 비밀번호가 틀렸는지 구분해 알려 주지 않습니다(계정 존재 여부 노출 방지). 남은 시도 횟수는 알려 줍니다. 5회 틀리면 잠깁니다(상태 3).'),
    CanvasRow(
        Canvas({ size: 'auto', label: 'A-01 · 처음 열었을 때 (빈 칸 · 로그인 버튼 비활성)', right: '화면 가운데 카드', pad: 20 }, Card(loginForm({ id: '', pw: '', disabled: true, idFocus: true }))),
        Canvas({ size: 'auto', label: 'A-01 · 입력을 마친 모습 (아이디 저장된 기기)', right: '화면 가운데 카드', pad: 20 }, Card(loginForm())),
        Canvas({ size: 'auto', label: 'A-01 · 로그인 실패 (정보 불일치)', right: '화면 가운데 카드', pad: 20 }, Card(loginForm({ err: '아이디 또는 비밀번호가 맞지 않습니다. (5회 중 2회 틀림 · 3회 더 틀리면 10분간 잠깁니다)' }))),
    ),
    Canvas({ label: 'A-01 · 전체 화면 배치 (PC 1280 · 가운데 카드 하나)' }, Shell(loginForm())),
    CanvasRow(
        Canvas({ size: 'auto', label: '비밀번호를 잊으셨나요? → 재설정 메일 팝업', right: '팝업만', pad: 20 },
            Modal({ title: '비밀번호 재설정', w: 440, foot: [Btn('취소'), Btn('재설정 메일 보내기', 'primary')] },
                Text('운영자 계정의 이메일을 넣으면 비밀번호를 새로 정하는 주소를 메일로 보냅니다. 주소는 30분 동안만 열립니다.', { sm: true }),
                Field({ label: '아이디(이메일)', required: true }, Input({ w: '100%', value: 'borim@innerera.example' })),
                Note('메일이 안 오면 스팸함을 확인하거나, 대표 운영자에게 설정 > 운영자·권한에서 비밀번호 초기화를 요청하세요.'),
            )),
        Canvas({ size: 'auto', label: '재설정 메일 보낸 뒤 (등록된 계정인지 알려 주지 않음)', right: '팝업만', pad: 20 },
            Modal({ title: '비밀번호 재설정', w: 440, foot: [Btn('로그인으로 돌아가기', 'primary')] },
                Text(`${Icon('mail-o')} 입력한 주소가 운영자 계정이면 재설정 메일이 발송됩니다.`, { b: true }),
                Text('borim@innerera.example<br>메일의 주소는 2026-11-11 10:12까지 열립니다. 한 번 쓰면 닫힙니다.', { sm: true, mute: true }),
            )),
        Canvas({ size: 'auto', label: '메일의 주소로 들어온 화면 · 새 비밀번호 정하기 (규칙 안 맞음)', right: '화면 가운데 카드', pad: 20 },
            Card(
                Lead('새 비밀번호를 정하세요. 정하면 다른 기기의 로그인은 모두 풀립니다.'),
                Field({ label: '새 비밀번호', required: true, error: '영문·숫자·특수문자를 섞어 10자 이상으로 정하세요. (지금 8자)' }, Input({ w: '100%', value: '●●●●●●●●', icon: 'lock-o', error: true })),
                Field({ label: '새 비밀번호 확인', required: true, help: '직전에 쓰던 비밀번호 3개는 다시 쓸 수 없습니다.' }, Input({ w: '100%', placeholder: '한 번 더 입력', icon: 'lock-o' })),
                Gap(6),
                Btn('비밀번호 바꾸기', { kind: 'primary', size: 'lg', block: true, disabled: true }),
            )),
    ),
);

const codeBoxes = (digits, o = {}) => `<div style="display:flex;gap:8px;margin:4px 0 6px">${Array.from({ length: 6 }, (_, i) => `<span style="flex:1;height:52px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;border-radius:4px;background:${o.error ? '#fafafa' : '#fff'};border:${i === digits.length && !o.error ? '2px solid var(--dark)' : o.error ? '2px solid var(--dark)' : '1px solid #b4b4bb'}">${digits[i] || ''}</span>`).join('')}</div>`;

const twoStep = (o = {}) => [
    Lead('아이디와 비밀번호가 확인되었습니다. 등록된 휴대폰으로 보낸 인증번호 6자리를 넣으세요.'),
    Box({ flat: true }, KV([['계정', 'borim@innerera.example'], ['받는 번호', '010-****-1234 (문자)'], ['보낸 시각', o.sent || '09:42:10']])),
    `<div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;margin-bottom:6px"><span>인증번호</span><span style="font-weight:600">${Icon('clock-o')} ${o.left || '남은 시간 02:47'}</span></div>`,
    codeBoxes(o.digits || '', { error: !!o.err }),
    o.err ? `<p class="err">${Icon('error-o')}${o.err}</p>` : '<p class="help">문자가 안 오면 60초 뒤에 다시 받을 수 있습니다.</p>',
    Gap(8),
    Check('이 기기에서는 30일 동안 인증번호를 묻지 않기', { on: o.remember }),
    Gap(14),
    Btn(o.btn || '확인', { kind: 'primary', size: 'lg', block: true, disabled: o.disabled }),
    `<div style="display:flex;justify-content:space-between;margin-top:14px;font-size:12.5px;color:var(--ink2)"><span>${o.resend || `인증번호 다시 받기 <span style="color:var(--mute)">(41초 뒤 가능)</span>`}</span><u>다른 계정으로 로그인</u></div>`,
];

const state2 = StateBlock({ idx: 2, title: '2단계 인증(휴대폰 번호 인증)', note: '아이디·비밀번호가 맞으면 같은 카드가 인증번호 입력으로 바뀝니다. 운영자 계정에 등록된 휴대폰으로 문자가 갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '비밀번호가 새도 휴대폰이 없으면 못 들어오게 합니다(개인정보 취급 관리자는 2단계 인증이 사실상 필수). 매번 묻으면 출근할 때마다 번거로우므로 믿는 기기에서는 30일 동안 묻지 않게 할 수 있고, 이 선택은 설정 > 운영자·권한에서 대표 운영자가 막을 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '인증번호는 3분 동안만 유효하고 5회 틀리면 계정이 잠깁니다. 휴대폰 번호가 바뀐 운영자는 스스로 바꿀 수 없고 대표 운영자가 설정 > 운영자·권한에서 고쳐 줍니다(본인 확인 없이 번호를 바꾸면 2단계 인증이 뚫립니다).'),
    CanvasRow(
        Canvas({ size: 'auto', label: 'A-01 · 인증번호 발송됨 (입력 전 · 확인 버튼 비활성)', right: '화면 가운데 카드', pad: 20 }, Card(twoStep({ disabled: true }))),
        Canvas({ size: 'auto', label: 'A-01 · 6자리 입력 완료', right: '화면 가운데 카드', pad: 20 }, Card(twoStep({ digits: '482913', remember: true, left: '남은 시간 02:21' }))),
        Canvas({ size: 'auto', label: 'A-01 · 인증번호가 틀림', right: '화면 가운데 카드', pad: 20 }, Card(twoStep({ digits: '482918', err: '인증번호가 맞지 않습니다. 문자를 다시 확인하세요. (5회 중 1회 틀림)', left: '남은 시간 01:58' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: 'A-01 · 시간 만료 (3분 지남 → 다시 받기만 가능)', right: '화면 가운데 카드', pad: 20 }, Card(twoStep({ digits: '', err: '인증번호 입력 시간이 지났습니다. 인증번호 다시 받기를 눌러 주세요.', left: '남은 시간 00:00', disabled: true, resend: '<u><b>인증번호 다시 받기</b></u>' }))),
        Canvas({ size: 'auto', label: 'A-01 · 다시 받기 누른 뒤 (새 번호 발송 · 하루 5회까지)', right: '화면 가운데 카드', pad: 20 }, Card(
            Note('인증번호를 다시 보냈습니다. 이전 번호는 쓸 수 없습니다. (오늘 2회 / 5회)'),
            twoStep({ sent: '09:45:32', left: '남은 시간 02:59', disabled: true, resend: '인증번호 다시 받기 <span style="color:var(--mute)">(60초 뒤 가능)</span>' }),
        )),
        Canvas({ size: 'auto', label: 'A-01 · 휴대폰이 등록되지 않은 계정 (초대 직후 첫 로그인)', right: '화면 가운데 카드', pad: 20 }, Card(
            Lead('처음 로그인하셨습니다. 2단계 인증에 쓸 휴대폰 번호를 등록하세요.'),
            Field({ label: '휴대폰 번호', required: true, help: '본인 명의 휴대폰만 등록하세요. 등록 뒤에는 대표 운영자만 바꿀 수 있습니다.' }, Flex({ gap: 8 }, `<span class="grow">${Input({ w: '100%', value: '010-2345-1234' })}</span>`, Btn('인증번호 받기'))),
            Field({ label: '인증번호' }, Input({ w: '100%', placeholder: '문자로 받은 6자리', disabled: true })),
            Gap(6),
            Btn('등록하고 들어가기', { kind: 'primary', size: 'lg', block: true, disabled: true }),
        )),
    ),
    Canvas({ label: 'A-01 · 인증 성공 → 대시보드로 이동하며 뜨는 안내 (3초 뒤 사라짐)', h: 120 }, Overlay({ bg: '<div style="height:200px;background:var(--bg)"></div>', dim: false, align: 'top', h: 110 },
        Toast('로그인했습니다. 마지막 접속: 2026-11-10 18:22 · 서울 (IP 211.***.***.45)'))),
);

const blockCard = (icon, title, ...body) => Card(
    `<div style="text-align:center;margin:12px 0 16px"><i class="xi-${icon}" style="font-size:40px;color:var(--ink2)"></i><b style="display:block;font-size:17px;margin-top:8px">${title}</b></div>`,
    body,
);

const state3 = StateBlock({ idx: 3, title: '허용 안 된 IP·잠김', note: '들어올 수 없는 두 가지 경우. 왜 막혔는지와 푸는 방법을 화면에서 바로 알려 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '허용 IP는 설정 > 운영자·권한에서 켜는 선택 기능입니다(초기값 꺼짐). 켜면 사무실·물류창고 IP에서만 관리자가 열립니다. 막힌 운영자가 누구에게 무엇을 말해야 하는지 알 수 있게 지금 접속한 IP를 그대로 보여 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '잠김은 시간이 지나면 저절로 풀리는 잠김(비밀번호 5회 오류 → 10분)과 대표 운영자가 풀어야 하는 잠김(인증번호 5회 오류 · 90일 미접속 · 대표 운영자가 사용 중지)으로 나뉩니다. 대표 운영자 본인이 잠기면 계정 메일로 가는 잠금 해제 주소로만 풉니다.'),
    CanvasRow(
        Canvas({ size: 'auto', label: 'A-01 · 허용 안 된 IP (아이디·비밀번호를 넣기 전에 막힘)', right: '화면 가운데 카드', pad: 20 }, blockCard('shield-checked-o', '허용되지 않은 곳에서 접속했습니다',
            Text('이 쇼핑몰 관리자는 등록된 IP에서만 열 수 있습니다. 사무실 밖(집·카페·휴대폰 데이터)에서는 접속할 수 없습니다.', { sm: true }),
            Box({ flat: true }, KV([['지금 접속한 IP', '<b>121.***.***.87</b>'], ['접속 시각', '2026-11-11 21:14'], ['허용 요청', '대표 운영자 이보림']])),
            Note('위 IP를 대표 운영자에게 알려 주면 설정 > 운영자·권한 > 허용 IP에 추가할 수 있습니다.'),
            Btn('다시 시도', { block: true, icon: 'refresh' }),
        )),
        Canvas({ size: 'auto', label: 'A-01 · 비밀번호 5회 오류 → 10분 잠김 (저절로 풀림)', right: '화면 가운데 카드', pad: 20 }, blockCard('lock-o', '계정이 잠시 잠겼습니다',
            Text('비밀번호를 5회 잘못 입력해 10분 동안 로그인할 수 없습니다.', { sm: true }),
            Box({ flat: true }, KV([['계정', 'borim@innerera.example'], ['다시 로그인 가능', '<b>21:24</b> (남은 시간 08:41)']])),
            Note('본인이 시도한 것이 아니라면 비밀번호를 바로 바꾸세요. 잠긴 사실은 계정 메일과 대표 운영자에게 알림으로 갑니다.', { warn: true }),
            Flex({ gap: 8 }, Btn('비밀번호 재설정', { block: true }), Btn('로그인 화면으로', { kind: 'primary', block: true, disabled: true })),
        )),
        Canvas({ size: 'auto', label: 'A-01 · 대표 운영자가 풀어야 하는 잠김 (인증번호 5회 오류 · 90일 미접속 · 사용 중지)', right: '화면 가운데 카드', pad: 20 }, blockCard('lock-o', '계정이 잠겼습니다',
            Text('인증번호를 5회 잘못 입력해 계정이 잠겼습니다. 시간이 지나도 풀리지 않습니다.', { sm: true }),
            Box({ flat: true }, KV([['계정', 'staff01@innerera.example'], ['잠긴 시각', '2026-11-11 09:51'], ['잠긴 이유', '인증번호 5회 오류']])),
            Divider(),
            Text('<b>푸는 방법</b><br>대표 운영자(이보림)가 설정 > 운영자·권한에서 잠금 해제를 눌러야 합니다. 대표 운영자 본인 계정이면 계정 메일로 보낸 잠금 해제 주소를 여세요.', { sm: true }),
            Flex({ gap: 8 }, Btn('잠금 해제 메일 다시 받기', { block: true, icon: 'mail-o' }), Btn('다른 계정으로 로그인', { block: true })),
        )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '잠긴 이유별 문구 (같은 카드에서 문구만 바뀜)', right: '문구 표', pad: 20 },
            `<div style="width:640px">${KV([
                ['비밀번호 5회 오류', '비밀번호를 5회 잘못 입력해 10분 동안 로그인할 수 없습니다. → 10분 뒤 자동 해제'],
                ['인증번호 5회 오류', '인증번호를 5회 잘못 입력해 계정이 잠겼습니다. → 대표 운영자가 해제'],
                ['90일 미접속', '90일 동안 접속하지 않아 계정이 잠겼습니다. → 대표 운영자가 해제'],
                ['사용 중지', '대표 운영자가 이 계정의 사용을 중지했습니다. → 대표 운영자에게 문의'],
                ['다른 곳에서 로그인', '다른 기기에서 로그인해 이 기기의 접속이 끊겼습니다. 다시 로그인하세요. (같은 계정 동시 접속 1대)'],
                ['오래 쓰지 않음', '60분 동안 사용하지 않아 로그아웃되었습니다. 다시 로그인하세요. (작성 중이던 내용은 임시 저장됨)'],
            ], { wide: true })}</div>`),
        Canvas({ size: 'auto', label: '오래 쓰지 않아 로그아웃됨 → 로그인 화면 위 안내', right: '화면 가운데 카드', pad: 20 }, Card(loginForm({ pw: '', top: Note('60분 동안 사용하지 않아 로그아웃되었습니다. 다시 로그인하면 보던 화면(주문 > 발주 확인·발송 처리)으로 돌아갑니다.', { warn: true }), disabled: true }))),
    ),
);

export default function A01() {
    return [state1, state2, state3].join('');
}
