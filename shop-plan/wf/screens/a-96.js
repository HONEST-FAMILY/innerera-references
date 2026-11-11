import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Chips, Input, Select, Check, RadioGroup, CheckGroup, Toggle, Tabs,
    Textarea, FormTable, Filters, Period, ListHead, Table, Pager, Overlay, Modal, Confirm, SideDrawer, Toast, Box, KV, Note as NoteBase, Text, Icon, Flex,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const TABS = [{ t: '운영자', n: 6 }, { t: '역할·권한', n: 5 }, { t: '작업 기록' }, { t: '보안' }];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-96', desc: '관리자에 들어올 수 있는 사람과, 역할마다 볼 수 있는 메뉴·할 수 있는 일을 정합니다.', ...o }, Tabs(TABS, tab), body);
const Invite = { actions: [Btn('운영자 초대', { kind: 'primary', icon: 'plus' })] };

const us = (s) => ({ 사용: Badge('사용 중', 'check'), 초대: Badge('초대 보냄', 'dash'), 만료: Badge('초대 기한 지남', 'warn'), 잠김: Badge('잠김 · 비밀번호 5회 틀림', 'x'), 중지: Badge('사용 중지', 'mute') }[s]);
const U_COLS = [{ t: '이름', w: 110 }, '아이디(메일) · 휴대폰', { t: '역할', w: 120 }, { t: '개인정보 내려받기', w: 120 }, { t: '상태', w: 180 }, { t: '2단계 인증', w: 90 }, { t: '마지막 로그인', w: 130 }, { t: '', w: 150 }];
const more = `<span style="font-size:17px;color:var(--ink2);vertical-align:middle">${Icon('ellipsis-v')}</span>`;
const U_ROWS = [
    [`<b>이보림</b> ${Badge('나', 'line')}`, 'boreum@innerera.example<small>010-****-7788</small>', Badge('최고관리자', 'bold'), '가능', us('사용'), '켬', '11-11 09:02<small>인천 · 사무실 IP</small>', `${Btn('역할 변경', { size: 'sm', disabled: true })} ${more}`],
    ['<b>윤서연</b>', 'order@innerera.example<small>010-****-3412</small>', '주문/배송', '불가', us('사용'), '켬', '11-11 08:47', `${Btn('역할 변경', { size: 'sm' })} ${more}`],
    ['<b>임재현</b>', 'cs@innerera.example<small>010-****-9026</small>', 'CS', '불가', us('잠김'), '켬', '11-10 18:20', `${Btn('잠김 풀기', { size: 'sm' })} ${more}`],
    ['<b>강지호</b>', 'md@innerera.example<small>010-****-4468</small>', '상품/전시', '불가', us('초대'), '-', '아직 없음<small>11-13 10:30 까지 수락</small>', `${Btn('다시 초대', { size: 'sm' })} ${more}`],
    { hl: true, c: ['<b>정수아</b>', 'mkt@innerera.example<small>휴대폰 없음</small>', '마케팅', '가능 (사유 필수)', us('만료'), '-', '아직 없음<small>11-08 초대 · 48시간 지남</small>', `${Btn('다시 초대', { size: 'sm' })} ${more}`] },
    { dim: true, c: ['최도윤', 'doyun@innerera.example<small>010-****-2204</small>', '주문/배송', '불가', us('중지'), '-', '10-24 17:55<small>10-31 중지 · 퇴사</small>', `${Btn('다시 사용', { size: 'sm' })} ${more}`] },
];

const MoreMenu = `<div style="width:210px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:6px 0;font-size:13px">${[['user-o', '정보 수정 (이름 · 휴대폰)'], ['key', '비밀번호 재설정 메일 보내기'], ['shield-checked-o', '2단계 인증 초기화'], ['time-o', '이 운영자의 작업 기록'], ['lock-o', '사용 중지'], ['trash-o', '삭제']].map(([i, t]) => `<div style="padding:8px 14px;display:flex;gap:8px;align-items:center">${Icon(i)}${t}</div>`).join('')}</div>`;

const state1 = StateBlock({ idx: 1, title: '운영자 목록', note: '설정 > 운영자·권한의 첫 탭. 관리자에 들어올 수 있는 사람과 역할, 계정 상태를 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '아이디 하나를 여럿이 돌려 쓰면 누가 환불을 승인했는지, 누가 회원 엑셀을 받았는지 알 수 없습니다. 사람마다 계정을 주고 역할로 메뉴를 나눕니다. 목록에서 상태(사용 중 · 초대 보냄 · 초대 기한 지남 · 잠김 · 사용 중지)와 마지막 로그인을 보고, 퇴사자는 삭제 대신 사용 중지해 작업 기록을 남깁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 초기값' }, '설치 직후에는 최고관리자 1명만 있습니다. 최고관리자는 항상 1명 이상 있어야 해서 마지막 한 명은 역할을 바꾸거나 중지·삭제할 수 없고, 자기 자신의 역할도 스스로 못 바꿉니다. 운영자를 중지하면 그 사람이 받던 내부 알림(설정 > 알림)에서도 자동으로 빠집니다.'),
    Canvas({ label: 'A-96 · 운영자 탭 (사용 중 · 잠김 · 초대 보냄 · 초대 기한 지남 · 사용 중지)' }, Page('운영자', Invite, ListHead({ total: 6, left: Chips(['전체 6', '사용 중 3', '초대 중 2', '사용 중지 1'], '전체 6'), right: [Input({ placeholder: '이름·메일로 찾기', icon: 'search', w: 220 })] }), Table({ cols: U_COLS, rows: U_ROWS }), Note('운영자 수에는 제한이 없습니다. 계정은 한 사람이 하나씩 쓰고, 같은 계정으로 두 곳에서 동시에 들어오면 먼저 들어온 쪽이 로그아웃됩니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '줄 오른쪽 점 세 개 → 메뉴', right: '부분', pad: 20 }, MoreMenu),
        Canvas({ size: 'auto', label: '역할 변경 버튼 → 팝업 (역할 목록 열림)', right: '팝업만', pad: 20 }, `<div style="min-height:400px">${Modal({ title: '역할 변경 · 윤서연', w: 520, foot: [Btn('취소'), Btn('변경', 'primary')] }, FormTable([{ k: '지금 역할', v: '주문/배송' }, { k: '바꿀 역할', required: true, v: Select({ value: 'CS', w: 260, open: true, options: [{ t: '최고관리자', sub: '모든 메뉴 · 설정' }, { t: '주문/배송', sub: '지금 역할' }, { t: '상품/전시' }, { t: 'CS', sub: '주문 조회 · 클레임 접수 · 고객응대', on: true }, { t: '마케팅' }] }) }]))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '사용 중지', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '윤서연 님의 계정을 사용 중지할까요?', desc: '지금 로그인돼 있으면 바로 로그아웃되고 다시 들어올 수 없습니다. 작업 기록은 그대로 남습니다. 이 운영자가 받던 내부 알림 5종(신규 주문 · 취소 요청 · 반품·교환 · 연동 오류 · 발송 기한)에서도 빠집니다 — 받는 사람이 없어지는 알림 2종이 있으니 설정 > 알림에서 다른 사람을 지정해 주세요.', ok: '사용 중지', danger: true })),
        Canvas({ size: 'auto', label: '하나 남은 최고관리자를 중지·삭제하려 할 때', right: '토스트만', pad: 20 }, Toast('최고관리자는 한 명 이상 있어야 합니다. 다른 운영자를 최고관리자로 바꾼 뒤 다시 해 주세요.', { kind: 'error' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '잠김 풀기', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '임재현 님의 잠김을 풀까요?', desc: '11-10 18:21 비밀번호를 5번 틀려 잠겼습니다(접속 위치 서울 · 평소와 같은 IP). 풀면 비밀번호 재설정 메일이 함께 갑니다.', ok: '풀고 재설정 메일 보내기' })),
        Canvas({ size: 'auto', label: '삭제 (작업 기록이 있는 운영자)', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '최도윤 님을 삭제할까요?', desc: '작업 기록 1,204건에는 이름이 최도윤(삭제됨)으로 남습니다. 메일 주소는 다시 초대에 쓸 수 있게 됩니다. 삭제는 되돌릴 수 없습니다.', ok: '삭제', danger: true })),
    ),
);

const ROLES = ['최고관리자', '주문/배송', '상품/전시', 'CS', '마케팅'];
const inviteModal = (o = {}) => Modal({ title: '운영자 초대', w: 640, foot: [Btn('취소'), Btn('초대 메일 보내기', 'primary')] },
    FormTable([
        { k: '이름', required: true, v: Input({ value: '강지호', w: 200 }) },
        { k: '메일', required: true, v: Input({ value: o.dup ? 'order@innerera.example' : 'md@innerera.example', w: 300, error: o.dup }), help: '이 메일이 로그인 아이디가 됩니다. 회사 메일을 권합니다.', error: o.dup ? '이미 운영자로 등록된 메일입니다(윤서연 · 주문/배송). 역할을 바꾸려면 목록에서 역할 변경을 눌러 주세요.' : undefined },
        { k: '휴대폰', v: Input({ value: '010-****-4468', w: 200 }), help: '2단계 인증과 내부 알림 문자에 씁니다. 비우면 메일로만 인증·알림을 받습니다.' },
        { k: '역할', required: true, v: o.open ? Select({ value: '', placeholder: '역할 고르기', w: 300, open: true, options: [{ t: '최고관리자', sub: '모든 메뉴 · 설정 · 운영자 관리' }, { t: '주문/배송', sub: '주문 처리 · 환불 승인 · 재고' }, { t: '상품/전시', sub: '상품 · 디자인 · 스마트스토어 상품 연동', on: true }, { t: 'CS', sub: '주문 조회 · 클레임 접수 · 회원 · 고객응대' }, { t: '마케팅', sub: '혜택 · 통계 · 배너·팝업' }] }) : [Select({ value: '상품/전시', w: 200 }), Btn('이 역할의 권한 보기', { size: 'sm' })] },
        ...(o.open ? [] : [
            { k: '개인정보 내려받기', v: [Check('회원·주문 엑셀에 가리지 않은 개인정보 포함해 내려받기 허용'), Text('상품/전시 역할은 기본 불가', { sm: true, mute: true })], help: '허용해도 내려받을 때마다 사유를 적어야 하고 작업 기록에 남습니다.' },
            { k: '초대 문구', v: Textarea({ value: '이너에라 쇼핑몰 관리자에 초대합니다. 48시간 안에 비밀번호를 설정해 주세요.', h: 56, count: '41 / 200' }) },
        ]),
    ]),
    o.open ? '' : Note('초대 메일의 링크는 48시간 동안만 열립니다. 기한이 지나면 목록에서 다시 초대를 눌러 주세요.'),
);

const mailPv = `<div style="width:420px;border:1px solid var(--line);background:#fff;font-size:13px"><div style="padding:8px 14px;border-bottom:1px solid var(--line2);font-size:12px;color:var(--mute)">받는 사람 md@innerera.example · 제목 [이너에라] 쇼핑몰 관리자 초대</div><div style="padding:18px"><div class="u-logo" style="margin-bottom:14px">Inner:Era 로고</div><b style="font-size:16px">강지호 님을 관리자로 초대합니다</b><p style="line-height:1.8;color:var(--ink2)">이보림 님이 이너에라 쇼핑몰 관리자(역할: 상품/전시)에 초대했습니다.<br>아래 버튼을 눌러 비밀번호를 설정하면 바로 쓸 수 있습니다.</p>${Btn('비밀번호 설정하고 시작하기', 'primary')}<p style="font-size:12px;color:var(--mute);line-height:1.7">이 링크는 2026-11-13 10:30 까지만 열립니다.<br>초대받은 적이 없다면 이 메일을 무시해 주세요.</p></div></div>`;

const accept = (o = {}) => `<div style="width:420px;padding:28px;background:#fff"><div class="u-logo" style="margin:0 auto 18px">Inner:Era 로고</div>${o.expired ? `<div style="text-align:center"><div style="font-size:30px;color:var(--mute)">${Icon('time-o')}</div><b style="font-size:16px">초대 링크의 기한이 지났습니다</b><p style="font-size:13px;color:var(--ink2);line-height:1.7">초대 링크는 48시간 동안만 열립니다.<br>초대한 분(이보림)에게 다시 초대해 달라고 요청해 주세요.</p></div>` : `<b style="font-size:17px">관리자 계정 만들기</b><p style="font-size:12.5px;color:var(--ink2)">강지호 님 · md@innerera.example · 역할 상품/전시</p><div class="wf-field"><label>비밀번호<em class="req">필수</em></label><div class="ctl">${Input({ value: '●●●●●●●●', w: '100%' })}<p class="help">영문 · 숫자 · 특수문자를 섞어 10자 이상</p></div></div><div class="wf-field"><label>비밀번호 확인<em class="req">필수</em></label><div class="ctl">${Input({ value: '●●●●●●', w: '100%', error: true })}<p class="err">${Icon('error-o')}위에 넣은 비밀번호와 다릅니다.</p></div></div><div class="wf-field"><label>2단계 인증 휴대폰<em class="req">필수</em></label><div class="ctl" style="display:flex;gap:6px">${Input({ value: '010-****-4468', w: 220 })}${Btn('인증번호 받기')}</div></div><div style="margin:10px 0">${Check('개인정보 취급자 보안 서약에 동의합니다 (보기)', { on: true })}</div>${Btn('계정 만들고 로그인', { kind: 'primary', block: true, size: 'lg', disabled: true })}`}</div>`;

const state2 = StateBlock({ idx: 2, title: '초대', note: '운영자 초대 버튼을 누르면 뜨는 팝업. 이름·메일·역할을 넣고 보내면 초대받은 사람이 메일의 링크로 비밀번호를 직접 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '최고관리자가 비밀번호를 정해 메신저로 알려 주는 방식은 비밀번호가 새기 쉽습니다. 메일로 초대하고 본인이 비밀번호와 2단계 인증 휴대폰을 직접 넣게 합니다. 초대 링크는 48시간만 열리고, 기한이 지난 초대는 목록에 표시돼 다시 보낼 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '역할을 고를 때 그 역할이 무엇을 볼 수 있는지 한 줄 설명을 같이 보여 줍니다. 개인정보 내려받기는 역할과 별개로 사람마다 따로 허용하고, 초대받은 사람은 계정을 만들 때 개인정보 취급자 보안 서약에 동의해야 합니다.'),
    Canvas({ label: 'A-96 · 운영자 초대 버튼 → 팝업' }, Overlay({ bg: Page('운영자', Invite, Table({ cols: U_COLS, rows: U_ROWS })), h: 700 }, inviteModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '역할 목록을 연 모습 (역할마다 한 줄 설명)', right: '팝업만', pad: 20 }, `<div style="min-height:520px">${inviteModal({ open: true })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 · 이미 등록된 메일', right: '팝업만', pad: 20 }, inviteModal({ dup: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '초대받은 사람이 받는 메일', right: '메일', pad: 20 }, mailPv),
        Canvas({ size: 'auto', label: '메일 링크 → 계정 만들기 화면 (비밀번호 확인 오류)', right: '초대받은 사람 화면', pad: 0 }, accept()),
        Canvas({ size: 'auto', label: '48시간이 지난 링크를 눌렀을 때', right: '초대받은 사람 화면', pad: 0 }, accept({ expired: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '초대 보냄', right: '토스트만', pad: 20 }, Toast('강지호 님에게 초대 메일을 보냈습니다. 11월 13일 10:30 까지 수락할 수 있습니다.')),
        Canvas({ size: 'auto', label: '다시 초대 버튼 (기한 지난 초대)', right: '토스트만', pad: 20 }, Toast('정수아 님에게 초대 메일을 다시 보냈습니다. 앞서 보낸 링크는 쓸 수 없게 됩니다.')),
        Canvas({ size: 'auto', label: '점 세 개 → 초대 취소', right: '팝업만', pad: 20 }, Confirm({ w: 360, title: '강지호 님의 초대를 취소할까요?', desc: '보낸 링크가 바로 닫히고 목록에서 사라집니다.', ok: '초대 취소', danger: true })),
    ),
);

const P = { f: `<span title="보기+처리">${Check('보기', { on: true })} ${Check('처리', { on: true })}</span>`, v: `<span>${Check('보기', { on: true })} ${Check('처리')}</span>`, n: `<span>${Check('보기')} ${Check('처리', { disabled: true })}</span>`, l: `<span>${Check('보기', { on: true, disabled: true })} ${Check('처리', { on: true, disabled: true })}</span>` };
const prow = (menu, sub, ...c) => [`<b>${menu}</b>${sub ? `<small>${sub}</small>` : ''}`, P.l, ...c.map((x) => P[x])];
const PERM_COLS = [{ t: '메뉴', w: 230 }, ...ROLES.map((r) => ({ t: r, w: 150 }))];
const PERM_ROWS = [
    prow('홈 · 오늘 할 일', '역할에 맞는 카드만 보임', 'f', 'f', 'f', 'v'),
    prow('홈 · 매출 요약', '', 'n', 'n', 'n', 'f'),
    prow('주문 조회 · 주문 상세', '상품/전시는 개인정보 가림', 'f', 'v', 'f', 'n'),
    prow('주문 처리', '입금 확인 · 발주 · 발송 · 구매확정', 'f', 'n', 'v', 'n'),
    prow('취소·반품·교환', '접수 · 수거 지시 · 검수', 'f', 'n', 'f', 'n'),
    prow('상품 · 카테고리 · 진열', '', 'v', 'f', 'v', 'v'),
    prow('재고 관리', '', 'f', 'f', 'v', 'v'),
    prow('회원', '마케팅은 개인정보 가림', 'n', 'n', 'f', 'v'),
    prow('혜택', '쿠폰 · 적립금 · 기획전', 'n', 'v', 'v', 'f'),
    prow('고객응대', '문의 · 리뷰 · 공지', 'v', 'v', 'f', 'v'),
    prow('디자인', '마케팅은 배너·팝업만 처리', 'n', 'f', 'n', 'v'),
    prow('판매채널 · 스마트스토어', '', 'f', 'f', 'n', 'n'),
    prow('통계', '상품/전시는 상품 통계만', 'n', 'v', 'n', 'f'),
    prow('설정', '쇼핑몰 정보 ~ 회원가입·로그인 설정', 'n', 'n', 'n', 'n'),
];
const yes = Check('', { on: true });
const no = Check('');
const lk = Check('', { on: true, disabled: true });
const S_ROWS = [
    ['<b>환불 승인(실행)</b><small>취소·반품 승인 → 결제 대행사 자동 환불</small>', lk, yes, no, no, no],
    ['<b>개인정보 전체 보기</b><small>가운데 가림(010-****-1234) 풀기 · 볼 때마다 기록</small>', lk, yes, no, yes, no],
    ['<b>개인정보 엑셀 내려받기</b><small>회원·주문 엑셀 · 내려받을 때 사유 필수</small>', lk, yes, no, no, yes],
    ['<b>적립금·쿠폰 지급</b><small>CS = 한 건씩 · 마케팅 = 일괄</small>', lk, no, no, yes, yes],
    ['<b>일괄 변경 · 엑셀 올리기</b><small>상품 가격·재고, 송장 일괄 등록</small>', lk, yes, yes, no, no],
];

const PermPage = (o = {}) => Page('역할·권한', { actions: [Btn('역할 추가', { icon: 'plus' }), Btn(o.dirty ? '변경 3건 저장' : '저장됨', { kind: 'primary', disabled: !o.dirty })] },
    Text(`보기 = 메뉴가 보이고 내용을 볼 수 있음 · 처리 = 등록·수정·삭제·상태 변경까지 · 둘 다 끄면 그 역할에게 메뉴가 안 보임 · ${Icon('lock-o')} 최고관리자는 바꿀 수 없음`, { sm: true, mute: true }),
    Table({ dense: true, cols: PERM_COLS, rows: o.rows || PERM_ROWS }),
    Text('메뉴와 상관없이 따로 주는 권한', { b: true }),
    Table({ dense: true, cols: [{ t: '권한', w: 230 }, ...ROLES.map((r) => ({ t: r, w: 150, align: 'center' }))], rows: S_ROWS }),
    Note('기능을 끈 몰(회원 등급 꺼짐 등)의 메뉴는 표에 나오지 않습니다. 권한을 바꾸면 그 역할의 운영자가 다음에 화면을 열 때부터 적용됩니다.'),
);

const state3 = StateBlock({ idx: 3, title: '역할별 메뉴 권한', note: '역할·권한 탭. 메뉴를 줄로, 역할 5개를 칸으로 놓은 표에서 보기·처리를 체크합니다. 아래 표는 메뉴와 상관없이 따로 주는 민감한 권한입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '출고 담당자가 설정을 건드리거나 마케팅 담당자가 환불을 승인하는 사고를 막으려면 메뉴를 역할로 나눠야 합니다. 기본 역할 5개에 흔한 분담을 미리 채워 두어 대부분의 몰은 그대로 쓰고, 다르면 체크만 바꿉니다. 메뉴는 보이지만 손은 못 대게 하는 경우(CS 가 주문 처리를 보기만)가 많아 보기와 처리를 나눴습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '환불 승인 · 개인정보 전체 보기 · 개인정보 엑셀 내려받기 · 적립금·쿠폰 지급은 돈과 개인정보가 걸려 메뉴 권한과 따로 줍니다. 개인정보 내려받기는 역할에서 허용해도 내려받을 때마다 사유를 적고 작업 기록에 남습니다. 처리를 켜면 보기는 자동으로 켜지고, 보기를 끄면 처리도 꺼집니다.'),
    Canvas({ label: 'A-96 · 역할·권한 탭 · 기본값 (역할 5개 × 메뉴 14줄 + 따로 주는 권한 5줄)' }, PermPage()),
    CanvasRow(
        Canvas({ size: 'auto', label: '체크를 바꾼 뒤 저장 → 영향 확인', right: '팝업만', pad: 20 }, Modal({ title: '권한 변경 저장', w: 560, foot: [Btn('취소'), Btn('저장', 'primary')] }, Table({ dense: true, cols: [{ t: '역할', w: 100 }, '바뀌는 권한', { t: '해당 운영자', w: 120 }], rows: [['CS', '주문 처리: 보기 → 보기+처리', '임재현 1명'], ['CS', '환불 승인(실행): 불가 → 가능', '임재현 1명'], ['마케팅', '회원: 보기 → 없음 (메뉴가 사라짐)', '정수아 1명']] }), Note('환불 승인 권한을 주면 그 역할의 운영자가 결제 대행사 환불을 직접 실행할 수 있게 됩니다.', { warn: true }))),
        Canvas({ size: 'auto', label: '역할 추가 버튼', right: '팝업만', pad: 20 }, Modal({ title: '역할 추가', w: 520, foot: [Btn('취소'), Btn('추가하고 권한 정하기', 'primary')] }, FormTable([{ k: '역할 이름', required: true, v: Input({ value: '위탁 물류센터', w: 240 }), help: '12자까지.' }, { k: '시작 권한', v: RadioGroup(['다른 역할에서 복사', '모두 끈 상태'], '다른 역할에서 복사') }, { k: '복사할 역할', v: Select({ value: '주문/배송', w: 200 }) }]), Note('예: 위탁 물류센터에는 주문 처리(발송)만 주고 환불 승인·개인정보 내려받기는 끕니다.'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '운영자가 쓰고 있는 역할을 지우려 할 때', right: '토스트만', pad: 20 }, Toast('주문/배송 역할을 쓰는 운영자가 1명 있어 지울 수 없습니다. 운영자의 역할을 먼저 바꿔 주세요.', { kind: 'error' })),
        Canvas({ size: 'auto', label: '권한이 없는 메뉴 주소로 들어왔을 때 (그 운영자 화면)', right: '부분', pad: 20 }, `<div style="width:420px;text-align:center;padding:26px 10px"><div style="font-size:32px;color:var(--mute)">${Icon('lock-o')}</div><b style="font-size:16px">이 화면을 볼 권한이 없습니다</b><p style="font-size:13px;color:var(--ink2);line-height:1.7">지금 역할(CS)로는 설정 메뉴를 볼 수 없습니다.<br>필요하면 최고관리자(이보림)에게 요청해 주세요.</p>${Btn('홈으로', 'primary')}</div>`),
    ),
);

const kind = (k) => Badge(k, { 환불: 'bold', '개인정보 내려받기': 'warn', '설정 변경': 'line', '권한 변경': 'fill', '일괄 처리': 'line', 로그인: 'mute' }[k] || 'line');
const L_COLS = [{ t: '일시', w: 124, sort: 'desc' }, { t: '운영자', w: 80 }, { t: '종류', w: 150 }, { t: '메뉴', w: 150 }, '무엇을 어떻게', { t: '접속 IP', w: 110 }];
const L_ROWS = [
    ['11-11 14:05:12', '윤서연', kind('일괄 처리'), '발주 확인·발송 처리', '송장 엑셀 일괄 등록 — 121건 발송처리 (오류 3행 제외)', '211.***.**.18'],
    ['11-11 13:40:02', '이보림', kind('환불'), '취소 관리', '주문 <u>20261110-000098</u> 취소 승인 · 49,000원 카드 환불 성공', '211.***.**.18'],
    { hl: true, c: ['11-11 11:32:47', '정수아', kind('개인정보 내려받기'), '회원 목록', '회원 엑셀 1,284명 (이름 · 휴대폰 · 메일) — 사유: 11월 뉴스레터 발송 대상 추출', '175.***.**.203'] },
    ['11-11 10:30:15', '이보림', kind('설정 변경'), '약관·정책', '개인정보처리방침 v4 등록 (시행 2026-12-15) · 회원 메일 1,284명 발송', '211.***.**.18'],
    ['11-11 10:12:44', '이보림', kind('설정 변경'), '콘텐츠 페이지', '브랜드 이야기 수정 (블록 2개 수정 · 1개 추가) — 게시 전', '211.***.**.18'],
    ['11-10 18:21:09', '임재현', kind('로그인'), '로그인', '비밀번호 5회 틀림 → 계정 잠김', '211.***.**.18'],
    ['11-10 17:02:30', '이보림', kind('권한 변경'), '운영자·권한', '강지호 초대 (역할 상품/전시)', '211.***.**.18'],
    ['11-10 09:12:05', '이보림', kind('설정 변경'), '주문·클레임 정책', '당일 출고 마감 13:00 → 14:00', '211.***.**.18'],
];

const LogFilters = Filters({ rows: [
    { k: '기간', v: Period({ preset: '7일' }) },
    { k: '운영자', v: Select({ value: '전체 운영자', w: 220 }) },
    { k: '종류', v: CheckGroup(['환불', '개인정보 내려받기', '개인정보 전체 보기', '설정 변경', '권한 변경', '일괄 처리', '로그인'], ['환불', '개인정보 내려받기', '개인정보 전체 보기', '설정 변경', '권한 변경', '일괄 처리', '로그인']) },
    { k: '찾기', v: Input({ placeholder: '주문번호 · 회원 이름 · 상품명 · 내용', icon: 'search', w: 320 }) },
] });

const state4 = StateBlock({ idx: 4, title: '작업 기록', note: '작업 기록 탭. 누가 언제 어디서 무엇을 어떻게 바꿨는지 남습니다. 지울 수 없고 3년 보관합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '환불이 잘못 나갔거나 설정이 바뀌어 있을 때 가장 먼저 찾는 화면입니다. 메뉴 이름과 사람이 읽는 문장(무엇을 어떻게)으로 남기고, 주문번호·회원 이름으로 찾을 수 있습니다. 주문·회원·상품 한 건에 대한 기록은 그 상세 화면의 처리 기록 탭에도 같은 내용이 보입니다 — 여기는 몰 전체를 한꺼번에 보는 곳입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '개인정보 엑셀 내려받기와 가림 풀기는 따로 표시하고 사유를 함께 남깁니다(유출이 생겼을 때 추적). 평소와 다른 IP 에서의 로그인·내려받기는 줄에 표시합니다. 기록은 최고관리자도 고치거나 지울 수 없습니다.'),
    Canvas({ label: 'A-96 · 작업 기록 탭 (검색 조건 펼침)' }, Page('작업 기록', {}, LogFilters, ListHead({ total: 1842, left: Chips(['전체', '환불 12', '개인정보 내려받기 2', '설정 변경 31', '권한 변경 4'], '전체'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), Select({ value: '50개씩 보기', w: 130 })] }), Table({ cols: L_COLS, rows: L_ROWS }), Pager({ page: 1, last: 37, per: 50 }))),
    Canvas({ label: 'A-96 · 줄을 눌렀을 때 → 기록 상세 (바뀌기 전 · 뒤 값)' }, Overlay({ bg: Page('작업 기록', {}, Table({ cols: L_COLS, rows: L_ROWS })), align: 'right', h: 640 },
        SideDrawer({ title: '작업 기록 상세', sub: '11-10 09:12:05 · 이보림', w: 520, foot: [Btn('닫기'), Btn('그 화면 열기', { icon: 'external-link' })] },
            KV([['운영자', '이보림 (최고관리자)'], ['메뉴', '설정 > 주문·클레임 정책'], ['종류', kind('설정 변경')], ['접속', '211.***.**.18 · 인천 · 크롬 · 윈도우 (평소와 같은 위치)']], { wide: true }),
            '<div style="height:14px"></div>',
            Table({ dense: true, cols: ['항목', { t: '바뀌기 전', w: 130 }, { t: '바뀐 뒤', w: 130 }], rows: [['발송 기한 · 당일 출고 마감', '13:00', '<b>14:00</b>']] }),
            Note('설정 변경은 되돌리기 버튼이 없습니다. 그 화면에서 값을 다시 바꾸면 새 기록으로 남습니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '개인정보 내려받기 기록 상세 (사유 · 평소와 다른 IP 표시)', right: '부분', pad: 20 }, `<div style="width:520px">${KV([['운영자', '정수아 (마케팅)'], ['내려받은 것', '회원 엑셀 1,284명 · 항목: 이름 · 휴대폰 · 메일 · 수신 동의'], ['사유', '11월 뉴스레터 발송 대상 추출'], ['접속', `175.***.**.203 · 서울 ${Badge('평소와 다른 위치', 'warn')}`], ['파일', '열기 암호가 걸린 엑셀 · 내려받은 뒤 7일이 지나면 다시 받을 수 없음']], { wide: true })}</div>`),
        Canvas({ size: 'auto', label: '조건에 맞는 기록이 없을 때', right: '부분', pad: 20 }, `<div style="width:520px">${Table({ cols: ['일시', '운영자', '종류', '무엇을 어떻게'], rows: [], empty: '조건에 맞는 작업 기록이 없습니다. 기간을 넓히거나 종류 조건을 풀어 보세요.' })}</div>`),
    ),
    Canvas({ label: 'A-96 · 보안 탭 (2단계 인증 · 허용 IP · 비밀번호 주기 · 자동 로그아웃)' }, Page('보안', {}, FormTable([
        { k: '2단계 인증', v: [Toggle('모든 운영자에게 필수', { on: true }), Text('로그인할 때 휴대폰 문자 인증번호(휴대폰이 없으면 메일)', { sm: true, mute: true })], help: '개인정보를 다루는 관리자는 2단계 인증을 켜 두어야 합니다. 끄려면 최고관리자 비밀번호를 다시 넣습니다.' },
        { k: '허용 IP', v: [Toggle('정해 둔 IP 에서만 로그인', { on: false }), Input({ placeholder: '예: 211.123.45.18 (사무실)', w: 260, disabled: true }), Btn('지금 내 IP 넣기', { size: 'sm', disabled: true })], help: '켜면 목록에 없는 곳에서는 로그인 화면에 허용되지 않은 위치 안내가 나옵니다. 재택·외근이 있으면 꺼 두세요.' },
        { k: '비밀번호 바꾸기 안내', v: [Select({ value: '90일마다', w: 130 }), Text('지나면 로그인할 때 바꾸라고 안내 (건너뛸 수 있음)', { sm: true })] },
        { k: '로그인 실패 잠금', v: [Select({ value: '5번 틀리면', w: 130 }), Text('계정 잠김 → 최고관리자가 풀거나 본인이 메일로 재설정', { sm: true })] },
        { k: '자동 로그아웃', v: [Select({ value: '60분', w: 110 }), Text('동안 아무것도 안 하면 로그아웃 (쓰던 내용은 임시 저장)', { sm: true })] },
    ]), BtnRow({ align: 'right' }, Btn('저장', 'primary')))),
);

export default function A96() {
    return [state1, state2, state3, state4].join('');
}
