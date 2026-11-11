import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Input, Select, Check, RadioGroup, CheckGroup, Tabs,
    Textarea, FormTable, ListHead, Table, Overlay, Modal, Confirm, Toast, Box, KV, Note as NoteBase, Text, Icon, Flex, Empty,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const DOCS = [{ t: '이용약관', n: 3 }, { t: '개인정보처리방침', n: 4 }, { t: '개인정보 수집·이용 동의(가입)', n: 2 }, { t: '개인정보 수집·이용 동의(비회원 주문)', n: 1 }, { t: '마케팅 정보 수신 동의', n: 1 }];
const Page = (doc, o, ...body) => AdminLayout({ active: 'a-95', desc: '약관과 방침은 고치지 않고 새 버전을 등록합니다. 시행일이 되면 자동으로 바뀌고 지난 버전은 고객이 계속 볼 수 있습니다.', actions: [Btn('새 버전 등록', { kind: 'primary', icon: 'plus' })], ...o }, Tabs(DOCS, doc), body);

const vs = (s) => ({ 시행: Badge('시행 중', 'check'), 예정: Badge('시행 예정', 'dash'), 지남: Badge('지난 버전', 'mute') }[s]);
const V_COLS = [{ t: '버전', w: 70 }, { t: '시행일', w: 120 }, { t: '상태', w: 110 }, '바뀐 내용 요약', { t: '고객 안내', w: 190 }, { t: '등록', w: 130 }, { t: '', w: 170 }];
const view = `${Btn('보기', { size: 'sm' })} ${Btn('앞 버전과 비교', { size: 'sm' })}`;
const V_ROWS = [
    { hl: true, c: ['<b>v4</b>', '2026-12-15 (화)', vs('예정'), '개인정보 처리 위탁 업체 추가 (문자 대행사 · 택배 조회 서비스) · 보유 기간 문구 정리', '공지사항 11-11 게시<small>회원 메일 11-11 발송 1,284명</small>', '11-11 10:30<small>이보림</small>', `${view} ${Btn('수정', { size: 'sm' })}`] },
    ['<b>v3</b>', '2026-11-02 (월)', vs('시행'), '쇼핑몰 오픈 버전 · 결제 대행사(포트원) 위탁 명시', '오픈 버전 (안내 없음)', '10-30 16:12<small>이보림</small>', view],
    { dim: true, c: ['v2', '2026-10-20 (화)', vs('지남'), '시험 운영 버전 · 수집 항목에 배송지 추가', '-', '10-19 11:40<small>어니스트패밀리</small>', view] },
    { dim: true, c: ['v1', '2026-10-01 (목)', vs('지남'), '표준 양식으로 처음 등록', '-', '10-01 09:00<small>어니스트패밀리</small>', view] },
];

const diff = `<div style="font-size:13px;line-height:1.8;border:1px solid var(--line);border-radius:4px;padding:14px"><b>제5조 (개인정보 처리의 위탁)</b><br>회사는 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다.<br>· 결제 처리: 주식회사 코리아포트원<br>· 상품 배송: CJ대한통운<br><span style="background:var(--fill);font-weight:700;padding:0 3px">+ · 알림톡·문자 발송: 문자 대행사 (수탁자 이름은 계약 후 기재)</span><br><span style="background:var(--fill);font-weight:700;padding:0 3px">+ · 배송 조회: 택배 조회 서비스 제공사</span><br><br><b>제7조 (개인정보의 보유 기간)</b><br><s style="color:var(--mute)">− 회원 탈퇴 시까지 보유합니다.</s><br><span style="background:var(--fill);font-weight:700;padding:0 3px">+ 회원 탈퇴 후 지체 없이 파기합니다. 다만 전자상거래법에 따라 계약·청약철회 기록은 5년, 대금 결제 기록은 5년, 소비자 불만 기록은 3년 동안 보관합니다.</span></div><div style="font-size:11.5px;color:var(--mute);margin-top:8px">굵은 채움 줄(+) = 새로 들어간 문장 · 줄 그은 글(−) = 빠진 문장 · 바뀐 곳 2군데</div>`;

const state1 = StateBlock({ idx: 1, title: '버전 목록', note: '설정 > 약관·정책. 문서마다 탭이 있고, 탭 안에 그 문서의 버전이 시행일 순으로 쌓입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '약관과 개인정보처리방침은 고객이 동의한 문서라 덮어쓰면 안 됩니다. 고칠 때마다 새 버전으로 쌓고, 고객이 어느 버전에 동의했는지 남기고, 지난 버전을 고객 화면(약관·방침 > 이전 버전 보기)에서 볼 수 있게 합니다. 시행일을 미래로 잡아 두면 그날 자정에 자동으로 바뀝니다.'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '설치할 때 표준 양식에 쇼핑몰 정보(상호·대표·주소·책임자)를 채운 v1 이 들어 있습니다. 시행 중·지난 버전은 고칠 수 없고 보기만 됩니다. 시행 예정 버전만 시행일 전까지 고치거나 지울 수 있습니다. 문서 종류(탭)는 고정이고 본문은 운영자가 씁니다 — 법률 검토는 고객사 몫입니다.'),
    Canvas({ label: 'A-95 · 개인정보처리방침 탭 · 버전 목록 (시행 예정 1 · 시행 중 1 · 지난 버전 2)' }, Page('개인정보처리방침', {}, ListHead({ total: 4, left: [Text('지금 고객에게 보이는 버전 <b>v3</b> · 12월 15일부터 <b>v4</b>', { sm: true })], right: [Btn('고객 화면에서 보기', { size: 'sm', icon: 'external-link' })] }), Table({ cols: V_COLS, rows: V_ROWS }), Note('가입할 때 고객이 동의한 버전은 회원 상세 > 기본정보에 남습니다. 지금 회원 1,284명 중 v3 동의 1,284명.'))),
    Canvas({ label: 'A-95 · 앞 버전과 비교 버튼 → 바뀐 곳 보기 (v3 → v4)' }, Overlay({ bg: Page('개인정보처리방침', {}, Table({ cols: V_COLS, rows: V_ROWS })), h: 640 }, Modal({ title: '개인정보처리방침 · v3 → v4 바뀐 곳', w: 760, foot: [Btn('전체 본문 보기'), Btn('닫기', 'primary')] }, diff))),
    CanvasRow(
        Canvas({ size: 'auto', label: '보기 버튼 → 지난 버전 본문 (고칠 수 없음)', right: '팝업만', pad: 20 }, Modal({ title: '개인정보처리방침 v2 · 2026-10-20 ~ 2026-11-01 시행', w: 560, foot: [Btn('인쇄', { icon: 'print' }), Btn('이 본문으로 새 버전 만들기'), Btn('닫기', 'primary')] }, KV([['상태', vs('지남')], ['등록', '2026-10-19 11:40 · 어니스트패밀리'], ['동의한 회원', '0명 (시험 운영 기간)']]), `<div style="margin-top:12px;height:150px;overflow:hidden;border:1px solid var(--line);border-radius:4px;padding:12px;font-size:12.5px;line-height:1.8;background:var(--box)"><b>제1조 (수집하는 개인정보 항목)</b><br>회사는 회원가입, 상품 주문과 배송을 위해 아래 개인정보를 수집합니다.<br>· 회원가입: 이메일, 비밀번호, 이름, 휴대폰 번호<br>· 주문·배송: 받는 분 이름, 연락처, 배송지 주소<br>· 결제: 결제수단 정보는 결제 대행사가 처리하며 회사는 저장하지 않습니다.</div>`)),
        Canvas({ size: 'auto', label: '시행 예정 버전을 지울 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '시행 예정인 v4 를 지울까요?', desc: '12월 15일에 바뀌지 않고 v3 이 계속 시행됩니다. 이미 고객에게 변경 안내(공지사항 · 메일 1,284명)를 보냈으므로, 지운 뒤 변경이 취소됐다는 공지를 따로 올려야 합니다.', ok: '지우기', danger: true })),
    ),
    Canvas({ label: 'A-95 · 마케팅 정보 수신 동의 탭 · 버전이 1개뿐일 때' }, Page('마케팅 정보 수신 동의', {}, ListHead({ total: 1 }), Table({ cols: V_COLS, rows: [['<b>v1</b>', '2026-11-02 (월)', vs('시행'), '표준 양식으로 처음 등록 (알림톡 · 문자 · 메일 수신 동의)', '오픈 버전 (안내 없음)', '10-30 16:20<small>이보림</small>', view]] }), Note('쿠폰·적립금 기능을 끈 몰도 이 문서는 남습니다(공지·행사 안내 수신 동의).'))),
);

const Cal = (o = {}) => {
    const cells = [0, 0, ...Array.from({ length: 31 }, (_, i) => i + 1)];
    const cell = (d) => {
        if (!d) return '<span></span>';
        const s = d === o.pick ? 'background:var(--dark);color:#fff;font-weight:700;border-radius:4px' : d < o.min ? 'color:#b9b9c0;text-decoration:line-through' : d === o.min ? 'border:1px dashed var(--dark);border-radius:4px' : '';
        return `<span style="height:30px;line-height:30px;${s}">${d}</span>`;
    };
    return `<div style="width:264px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:12px;font-size:12.5px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">${Icon('angle-left-min')}<b>2026년 12월</b>${Icon('angle-right-min')}</div><div style="display:grid;grid-template-columns:repeat(7,34px);text-align:center;row-gap:2px">${['일', '월', '화', '수', '목', '금', '토'].map((d) => `<span style="color:var(--mute);height:26px">${d}</span>`).join('')}${cells.map(cell).join('')}</div><div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line2);font-size:11.5px;color:var(--mute);line-height:1.7">줄 그은 날 = 안내 기간이 모자라 고를 수 없음<br>점선 = 가장 빠른 시행일 (오늘 + ${o.gap}일) · 채운 칸 = 고른 날</div></div>`;
};

const Tool = `<div style="display:flex;gap:2px;border:1px solid var(--line);border-bottom:0;border-radius:4px 4px 0 0;padding:5px 8px;background:var(--box);font-size:12.5px;align-items:center"><b style="padding:0 6px">굵게</b><span style="padding:0 6px">제목(조)</span><span style="padding:0 6px">${Icon('list-dot')} 목록</span><span style="padding:0 6px">${Icon('view-list')} 표</span><span style="padding:0 6px">${Icon('undo')} 되돌리기</span><span style="margin-left:auto;padding:0 6px">${Icon('documents-o')} 쇼핑몰 정보 값 넣기 (상호 · 대표 · 주소 · 책임자)</span></div>`;

const regForm = (o = {}) => FormTable([
    { k: '문서 · 버전', v: [Text('개인정보처리방침', { b: true }), Badge('v4 (자동)', 'line'), Text('지금 시행 중 v3 · 2026-11-02 시행', { sm: true, mute: true })] },
    { k: '변경 종류', required: true, v: RadioGroup(['일반 변경', '고객에게 불리한 변경 · 중요한 변경'], o.heavy ? '고객에게 불리한 변경 · 중요한 변경' : '일반 변경'), help: '일반 변경은 시행 7일 전, 고객에게 불리하거나 중요한 변경(수집 항목 추가 · 제3자 제공 · 이용 목적 변경)은 시행 30일 전부터 알려야 합니다. 고르는 데 따라 고를 수 있는 시행일이 달라집니다.' },
    { k: '시행일', required: true, v: [Input({ value: o.dateErr ? '2026-11-13 (금)' : o.heavy ? '2026-12-15 (화)' : '2026-11-20 (금)', icon: 'calendar', w: 190, error: o.dateErr, focus: o.cal }), Text('00:00 부터 자동으로 적용', { sm: true })], help: o.heavy ? '가장 빠른 날: 2026-12-11 (오늘 11-11 + 30일)' : '가장 빠른 날: 2026-11-18 (오늘 11-11 + 7일)', error: o.dateErr ? '시행일이 너무 빠릅니다. 일반 변경은 오늘부터 7일 뒤(11월 18일)부터 고를 수 있습니다.' : undefined },
    { k: '바뀐 내용 요약', required: true, v: Textarea({ value: o.empty ? '' : '개인정보 처리 위탁 업체 추가 (문자 대행사 · 택배 조회 서비스) · 보유 기간 문구 정리', placeholder: '고객 안내 공지와 메일에 그대로 들어갑니다', h: 60, count: o.empty ? '0 / 300' : '47 / 300', error: o.empty }), help: '무엇이 왜 바뀌는지 고객이 읽을 말로 적어 주세요.', error: o.empty ? '바뀐 내용 요약을 넣어 주세요. 고객 안내에 쓰입니다.' : undefined },
    { k: '본문', required: true, v: `<div style="width:100%"><div style="display:flex;gap:8px;margin-bottom:8px">${Btn('v3 본문 불러와 고치기', { size: 'sm', icon: 'download' })}${Btn('표준 양식 불러오기', { size: 'sm' })}${Btn('바뀐 곳 보기', { size: 'sm', icon: 'eye-o' })}</div>${Tool}<div class="wf-textarea" style="height:190px;border-radius:0 0 4px 4px"><span class="v" style="line-height:1.8"><b>제5조 (개인정보 처리의 위탁)</b><br>회사는 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다.<br>· 결제 처리: 주식회사 코리아포트원<br>· 상품 배송: CJ대한통운<br>· 알림톡·문자 발송: 문자 대행사<br>· 배송 조회: 택배 조회 서비스 제공사</span><span class="cnt">v3 과 다른 곳 2군데 · 4,812자</span></div></div>` },
    { k: '고객 안내', v: [Check('공지사항에 변경 안내 자동으로 올리기 (오늘 게시 · 시행일까지 상단 고정)', { on: true }), Check('회원 전체에게 메일 보내기 (1,284명)', { on: !!o.heavy }), Check('쇼핑몰 맨 위 띠에 시행일까지 안내 문구 보이기')], help: '고객에게 불리한 변경은 메일 안내가 필수라 체크를 풀 수 없습니다.' },
    { k: '다시 동의 받기', v: [RadioGroup(['받지 않음 (안내만)', '시행일 뒤 첫 로그인 때 다시 동의 받기'], o.heavy ? '시행일 뒤 첫 로그인 때 다시 동의 받기' : '받지 않음 (안내만)')], help: '수집 항목이 늘거나 제3자 제공이 생기면 다시 동의를 받아야 합니다. 동의하지 않은 회원은 주문 전에 동의 화면을 만납니다.' },
]);

const state2 = StateBlock({ idx: 2, title: '새 버전 등록(시행일)', note: '새 버전 등록 버튼을 누르면 열리는 화면. 시행 예정 버전의 수정도 같은 화면입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '약관을 바꾸려면 시행 전에 고객에게 알려야 하고(일반 7일 전 · 불리한 변경 30일 전), 이 기간을 못 채우면 변경이 효력을 잃을 수 있습니다. 변경 종류를 고르면 고를 수 있는 가장 빠른 시행일이 자동으로 계산되고, 그보다 빠른 날은 달력에서 고를 수 없습니다. 등록하는 순간 공지사항 게시와 회원 메일 발송이 함께 나갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '앞 버전 본문을 불러와 고치게 해서 처음부터 다시 쓰지 않게 하고, 바뀐 곳 보기로 등록 전에 무엇이 달라졌는지 확인합니다. 등록한 뒤에는 시행일 전까지만 고칠 수 있고, 고치면 고객에게 다시 안내할지 묻습니다.'),
    Canvas({ label: 'A-95 · 새 버전 등록 버튼 → 등록 화면 · 일반 변경' }, AdminLayout({ active: 'a-95', title: '새 버전 등록', crumb: ['설정', '약관·정책', '개인정보처리방침', '새 버전 등록'], actions: [Btn('취소'), Btn('임시 저장'), Btn('등록하고 고객에게 안내', 'primary')] }, regForm())),
    CanvasRow(
        Canvas({ size: 'auto', label: '고객에게 불리한 변경을 고르면 → 시행일 30일 뒤부터 · 메일 필수 · 다시 동의', right: '부분', pad: 20 }, `<div style="width:800px">${FormTable([{ k: '변경 종류', required: true, v: RadioGroup(['일반 변경', '고객에게 불리한 변경 · 중요한 변경'], '고객에게 불리한 변경 · 중요한 변경') }, { k: '시행일', required: true, v: [Input({ value: '2026-12-15 (화)', icon: 'calendar', w: 190, focus: true }), Text('00:00 부터 자동으로 적용', { sm: true })], help: '가장 빠른 날: 2026-12-11 (오늘 11-11 + 30일)' }, { k: '고객 안내', v: [Check('공지사항에 변경 안내 자동으로 올리기', { on: true }), Check('회원 전체에게 메일 보내기 (1,284명) · 필수', { on: true, disabled: true })] }, { k: '다시 동의 받기', v: RadioGroup(['받지 않음 (안내만)', '시행일 뒤 첫 로그인 때 다시 동의 받기'], '시행일 뒤 첫 로그인 때 다시 동의 받기') }])}</div>`),
        Canvas({ size: 'auto', label: '시행일 칸 → 달력 (12월 11일 전은 고를 수 없음)', right: '부분', pad: 20 }, Cal({ min: 11, pick: 15, gap: 30 })),
    ),
    Canvas({ size: 'auto', label: '입력 오류 · 시행일이 안내 기간보다 빠름 + 요약 비움', right: '부분', pad: 20 }, `<div style="width:800px">${FormTable([{ k: '시행일', required: true, v: Input({ value: '2026-11-13 (금)', icon: 'calendar', w: 190, error: true }), error: '시행일이 너무 빠릅니다. 일반 변경은 오늘부터 7일 뒤(11월 18일)부터 고를 수 있습니다.' }, { k: '바뀐 내용 요약', required: true, v: Textarea({ placeholder: '고객 안내 공지와 메일에 그대로 들어갑니다', h: 60, count: '0 / 300', error: true }), error: '바뀐 내용 요약을 넣어 주세요. 고객 안내에 쓰입니다.' }])}</div>`),
    CanvasRow(
        Canvas({ size: 'auto', label: '등록하고 고객에게 안내 버튼 → 확인', right: '팝업만', pad: 20 }, Modal({ title: '개인정보처리방침 v4 등록', w: 520, foot: [Btn('취소'), Btn('등록하고 안내 보내기', 'primary')] }, KV([['시행일', '2026-12-15 (화) 00:00 — 오늘부터 34일 뒤'], ['공지사항', '오늘 게시 · 12-15 까지 상단 고정'], ['메일', '회원 1,284명에게 지금 발송'], ['다시 동의', '12-15 뒤 첫 로그인 때 받음']], { wide: true }), Note('등록하면 메일이 바로 나가 되돌릴 수 없습니다. 본문은 시행일 전까지 고칠 수 있지만 고치면 다시 안내해야 합니다.', { warn: true }))),
        Canvas({ size: 'auto', label: '등록 완료', right: '토스트만', pad: 20 }, Toast('개인정보처리방침 v4 를 등록했습니다. 12월 15일 00:00 에 자동으로 바뀝니다.', { action: '공지사항 보기' })),
    ),
    Canvas({ size: 'auto', label: '안내 공지 미리보기 (공지사항에 자동으로 올라가는 글)', right: '부분', pad: 20 }, `<div style="width:560px;border:1px solid var(--line);border-radius:6px;padding:16px;font-size:13px;line-height:1.8;background:#fff"><b style="font-size:15px">개인정보처리방침 변경 안내 (2026년 12월 15일 시행)</b><p style="margin:10px 0">안녕하세요. 이너에라입니다.<br>개인정보처리방침이 아래와 같이 바뀝니다.</p><b>바뀌는 내용</b><br>개인정보 처리 위탁 업체 추가 (문자 대행사 · 택배 조회 서비스) · 보유 기간 문구 정리<br><b>시행일</b> 2026년 12월 15일<br><br>바뀌는 내용에 동의하지 않으시면 회원 탈퇴를 요청하실 수 있습니다. 시행일까지 별도 의사를 밝히지 않으시면 동의하신 것으로 봅니다.<br><u>바뀌기 전 · 뒤 전체 보기</u></div>`),
);

export default function A95() {
    return [state1, state2].join('');
}
