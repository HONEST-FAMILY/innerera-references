import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Chip, Chips, Input, Select, Check, RadioGroup, CheckGroup, Toggle, Tabs,
    Textarea, FormTable, Filters, Period, ListHead, BulkBar, Table, Pager, Overlay, Modal, Confirm, SideDrawer, Toast, Box, KV, Note, Text, Icon, Flex, Grid, Stats, Empty,
} from '../lib/blocks.js';

const TABS = ['알림 목록', '내부 수신자', '발송 이력', '발신 정보'];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-94', desc: '고객과 운영자에게 가는 알림톡·문자·메일을 켜고 끄고, 문구와 받는 사람을 정합니다.', ...o }, Tabs(TABS, tab), body);

const ch = (a, s, m) => `<span style="display:inline-flex;gap:10px">${Check('알림톡', { on: a === 1, disabled: a === -1 })}${Check('문자', { on: s === 1, disabled: s === -1 })}${Check('메일', { on: m === 1, disabled: m === -1 })}</span>`;
const tpl = (s) => ({ 승인: Badge('승인', 'check'), 심사: Badge('심사 중', 'dash'), 반려: Badge('반려 · 고쳐야 함', 'x'), 없음: '<span style="color:var(--mute)">-</span>' }[s]);
const edit = Btn('문구 편집', { size: 'sm' });

const C_COLS = [{ t: '알림', w: 190 }, '보내는 때', { t: '수단', w: 210 }, { t: '알림톡 심사', w: 120 }, { t: '켜기', w: 56 }, { t: '', w: 92 }];
const C_ROWS = [
    { group: '주문 · 결제' },
    ['<b>가상계좌 입금 안내</b>', '가상계좌·무통장으로 주문했을 때 (계좌 · 금액 · 기한)', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>입금 재촉</b>', '입금 기한 하루 전 오전 10시', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>결제 완료</b>', '결제가 끝났을 때 · 입금이 확인됐을 때', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>미입금 자동 취소</b>', '입금 기한이 지나 주문이 취소됐을 때', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    { group: '배송' },
    ['<b>발송 안내</b>', '발송 처리했을 때 (택배사 · 송장번호 · 배송 조회 링크)', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>발송 지연 안내</b>', '발송 지연 처리했을 때 (사유 · 발송 예정일)', ch(1, 0, 0), tpl('심사'), Toggle('', { on: true }), edit],
    ['<b>나눠서 발송 안내</b>', '부분 발송했을 때 (보낸 품목 · 남은 품목)', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>배송 완료</b>', '택배 추적으로 배송완료가 확인됐을 때', ch(1, 0, 0), tpl('승인'), Toggle('', { on: false }), edit],
    ['<b>구매확정 예정</b>', '자동 구매확정 하루 전 오전 10시', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    { group: '취소 · 반품 · 교환' },
    ['<b>취소 완료</b>', '취소가 끝나 환불했을 때 (환불 금액 · 수단)', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>취소·반품·교환 거부</b>', '운영자가 거부했을 때 (거부 사유)', ch(1, 0, 0), tpl('반려'), Toggle('', { on: true }), edit],
    ['<b>반품 수거 안내</b>', '수거 지시했을 때 (택배 기사 방문 · 회수 송장)', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>반품 환불 완료</b>', '검수가 끝나 환불했을 때 (차감 배송비 · 환불 금액)', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>교환 상품 발송</b>', '교환 상품을 다시 보냈을 때', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    { group: '회원 · 고객응대' },
    ['<b>회원가입 환영</b>', '가입이 끝났을 때 (가입 쿠폰 안내는 쿠폰 기능이 켜져 있을 때만)', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>문의 답변</b>', '1:1 문의·상품 문의에 답변했을 때', ch(1, 0, 1), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>재입고 알림</b>', '재입고 알림을 신청한 품목의 재고가 들어왔을 때', ch(1, 0, 0), tpl('승인'), Toggle('', { on: true }), edit],
    ['<b>인증번호 · 비밀번호 재설정</b>', '본인 확인이 필요할 때', ch(-1, 1, 1), tpl('없음'), `<span style="font-size:11.5px;color:var(--mute)">${Icon('lock-o')} 필수</span>`, edit],
    { dim: true, c: ['<b>적립금 소멸 예정</b>', '소멸 30일 전', ch(-1, -1, -1), tpl('없음'), Badge('적립금 기능 꺼짐', 'mute'), ''] },
    { dim: true, c: ['<b>휴면 전환 예정</b>', '1년 동안 로그인이 없어 휴면으로 바뀌기 30일 전', ch(-1, -1, 1), tpl('없음'), `<span style="font-size:11.5px;color:var(--mute)">${Icon('lock-o')} 필수</span>`, edit] },
];

const I_COLS = [{ t: '알림', w: 190 }, '보내는 때', { t: '수단', w: 150 }, { t: '받는 사람', w: 220 }, { t: '켜기', w: 56 }, { t: '', w: 92 }];
const ich = (s, m) => `<span style="display:inline-flex;gap:10px">${Check('문자', { on: s })}${Check('메일', { on: m })}</span>`;
const I_ROWS = [
    ['<b>신규 주문</b>', '결제가 끝난 주문이 들어올 때마다 · 또는 1시간마다 묶어서', ich(true, true), '이보림 · 윤서연 <u>2명</u>', Toggle('', { on: true }), edit],
    ['<b>취소 요청</b>', '배송준비 단계의 취소 요청이 들어왔을 때', ich(true, true), '윤서연 <u>1명</u>', Toggle('', { on: true }), edit],
    ['<b>반품·교환 요청</b>', '반품·교환 신청이 들어왔을 때', ich(false, true), '윤서연 <u>1명</u>', Toggle('', { on: true }), edit],
    ['<b>새 문의</b>', '1:1 문의·상품 문의가 올라왔을 때', ich(false, true), '임재현 <u>1명</u>', Toggle('', { on: true }), edit],
    { hl: true, c: ['<b>연동 오류</b>', '스마트스토어 주문 수집·발송 전송, 결제 연결, 알림 발송이 실패했을 때', ich(true, true), `${Badge('받는 사람 없음', 'warn')}`, Toggle('', { on: true }), edit] },
    ['<b>품절 임박</b>', '품목 재고가 안전재고 아래로 내려갔을 때', ich(false, true), '이보림 <u>1명</u>', Toggle('', { on: true }), edit],
    ['<b>발송 기한 임박</b>', '발송 기한이 내일인 주문이 남아 있을 때 · 매일 오전 9시', ich(true, false), '윤서연 <u>1명</u>', Toggle('', { on: true }), edit],
    ['<b>하루 요약</b>', '매일 오전 9시 · 어제 주문·매출·미처리 건수', ich(false, true), '이보림 <u>1명</u>', Toggle('', { on: false }), edit],
];

const SubTabs = (a) => Tabs([{ t: '고객 알림', n: 20 }, { t: '내부 알림', n: 8 }], a, { kind: 'pill' });
const SenderBar = Note('알림톡 발신 채널 @이너에라 · 문자 발신번호 070-****-1234 (등록 완료) · 메일 no-reply@innerera.example — <u>발신 정보 탭에서 보기</u>');

const state1 = StateBlock({ idx: 1, title: '알림 목록(켜고 끄기·수단)', note: '설정 > 알림의 첫 탭. 고객에게 가는 알림과 운영자에게 가는 내부 알림을 나눠, 알림마다 켜고 끄기와 보내는 수단을 정합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '알림은 화면에 안 보여서 빠뜨리기 쉽지만, 주문·배송·환불 단계마다 고객이 가장 먼저 받는 안내입니다. 몰에서 나가는 모든 알림을 한 표에 모아 언제 · 무엇으로 나가는지 보여 주고, 운영자가 개발자 없이 켜고 끄고 문구를 고칩니다. 알림톡이 실패하면(카카오톡 미사용·수신 차단) 같은 내용을 문자로 자동으로 다시 보냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 초기값' }, '① 알림톡 문구는 카카오 심사를 통과해야 나갑니다 — 심사 중·반려인 알림은 그동안 문자로 대신 나가고, 표에 상태가 보입니다. ② 인증번호·휴면 예정 같은 법정·필수 알림은 끌 수 없습니다. ③ 기능을 끈 몰(적립금 꺼짐)의 관련 알림은 흐리게 잠깁니다. ④ 초기값: 고객 알림은 배송 완료만 꺼짐, 수단은 알림톡(실패 시 문자), 결제·환불처럼 증빙이 필요한 알림만 메일 함께.'),
    Canvas({ label: 'A-94 · 알림 목록 탭 · 고객 알림 (승인 · 심사 중 · 반려 · 필수 · 기능 꺼짐)' }, Page('알림 목록', {}, Flex({ justify: 'space-between', align: 'center' }, SubTabs('고객 알림'), Check('알림톡 실패 시 문자로 대신 보내기', { on: true })), SenderBar, Table({ cols: C_COLS, rows: C_ROWS }))),
    Canvas({ label: 'A-94 · 알림 목록 탭 · 내부 알림 (받는 사람 수 · 받는 사람 없음 경고)' }, Page('알림 목록', {}, SubTabs('내부 알림'), Note('연동 오류 알림을 받을 사람이 없습니다. 스마트스토어 전송이 실패해도 아무도 모르게 됩니다. <u>내부 수신자 정하기</u>', { warn: true }), Table({ cols: I_COLS, rows: I_ROWS }), Note('내부 알림은 알림톡이 아니라 문자·메일로 갑니다. 받는 사람은 내부 수신자 탭에서 한꺼번에 정합니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '발송 안내 스위치를 끌 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '발송 안내 알림을 끌까요?', desc: '발송 처리를 해도 고객에게 송장번호가 가지 않습니다. 배송 문의가 늘 수 있습니다. 스마트스토어 주문은 네이버가 따로 알림을 보내므로 영향이 없습니다.', ok: '끄기', danger: true })),
        Canvas({ size: 'auto', label: '세 수단을 모두 끄려 할 때', right: '토스트만', pad: 20 }, Toast('수단을 하나는 남겨 주세요. 알림을 보내지 않으려면 켜기 스위치를 끄면 됩니다.', { kind: 'error' })),
    ),
    Canvas({ label: 'A-94 · 발신 정보 탭 (알림톡 채널 · 문자 발신번호 · 메일 · 밤 시간 발송)' }, Page('발신 정보', {},
        Box({ title: '알림톡 (카카오톡 채널)', right: Badge('연결됨', 'check') }, KV([['발신 채널', '@이너에라 (카카오톡 채널 · 사업자 인증 완료)'], ['문자 대행사', '연결됨 · 남은 발송 충전금 184,200원 (알림톡 건당 약 8원 · 문자 건당 약 10원 · 장문 약 28원)'], ['충전금 부족 알림', '10,000원 아래로 내려가면 내부 알림(연동 오류)으로 알림']], { wide: true }), Flex({ gap: 8, mt: 12 }, Btn('충전하러 가기', { icon: 'external-link' }), Btn('채널 다시 연결'))),
        Box({ title: '문자 발신번호', right: Badge('등록 완료', 'check') }, KV([['발신번호', '070-****-1234 (통신사 발신번호 사전 등록 완료)'], ['문자 앞머리', '[이너에라] — 모든 문자 맨 앞에 붙습니다']], { wide: true }), Note('등록하지 않은 번호로는 문자를 보낼 수 없습니다(전기통신사업법). 번호를 바꾸려면 통신 서비스 이용 증명원이 필요합니다.')),
        Box({ title: '메일' }, FormTable([{ k: '보내는 주소 · 이름', v: [Input({ value: 'no-reply@innerera.example', w: 260 }), Input({ value: '이너에라', w: 140 })] }, { k: '답장 받을 주소', v: Input({ value: 'help@innerera.example', w: 260 }) }, { k: '메일 위아래', v: Text('위 = 로고(디자인 > 사이트 기본) · 아래 = 사업자 정보(설정 > 쇼핑몰 정보) 자동', { sm: true }) }])),
        Box({ title: '밤 시간 발송' }, FormTable([{ k: '주문·배송 알림', v: Text('시간과 상관없이 바로 보냅니다 (고객이 한 행동에 대한 안내)', { sm: true }) }, { k: '예약 알림', v: [Text('입금 재촉 · 구매확정 예정 · 재입고 알림은', { sm: true }), Select({ value: '21:00', w: 100 }), '~', Select({ value: '08:00', w: 100 }), Text('사이에는 보내지 않고 다음 날 오전 8시에 보냅니다', { sm: true })] }])),
    )),
);

const VARS = ['#{고객명}', '#{주문번호}', '#{상품명}', '#{택배사}', '#{송장번호}', '#{배송조회링크}', '#{쇼핑몰명}', '#{고객센터전화}'];
const varChips = (list = VARS) => `<div style="display:flex;flex-wrap:wrap;gap:5px">${list.map((v) => Chip(v, { icon: 'plus-min' })).join('')}</div>`;
const mark = (s) => s.replace(/#\{[^}]+\}/g, (m) => `<b style="background:var(--fill);border-radius:3px;padding:0 3px">${m}</b>`);

const SHIP_TXT = '#{고객명} 님, 주문하신 상품을 발송했습니다.<br><br>주문번호 #{주문번호}<br>상품 #{상품명}<br>택배사 #{택배사}<br>송장번호 #{송장번호}<br><br>배송 조회는 아래 버튼을 눌러 주세요.';
const SHIP_PV = '김민지 님, 주문하신 상품을 발송했습니다.<br><br>주문번호 20261111-000128<br>상품 롱지비티 석류맛 젤리스틱 2박스(28일분)<br>택배사 CJ대한통운<br>송장번호 581233441201<br><br>배송 조회는 아래 버튼을 눌러 주세요.';

const Phone = (kind, body, btn) => `<div style="width:280px;border:1px solid var(--line);border-radius:18px;padding:14px 12px;background:var(--box)"><div style="font-size:11px;color:var(--mute);text-align:center;margin-bottom:8px">${kind} 미리보기 · 가명 고객 김민지 주문으로 채움</div><div style="background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden">${kind === '알림톡' ? `<div style="background:var(--fill);padding:8px 12px;font-size:12px;font-weight:700">알림톡 도착 · 이너에라</div>` : ''}<div style="padding:12px;font-size:12.5px;line-height:1.6">${kind === '문자' ? '[이너에라]<br>' : ''}${body}</div>${btn ? `<div style="border-top:1px solid var(--line2);padding:9px;text-align:center;font-size:12.5px;font-weight:700">${btn}</div>` : ''}</div></div>`;

const editModal = (o = {}) => Modal({ title: `문구 편집 · ${o.name || '발송 안내'}`, w: 980, foot: [Btn('취소'), Btn('나에게 시험 발송', { icon: 'send' }), Btn(o.ok || '저장하고 심사 요청', 'primary')] },
    Flex({ justify: 'space-between', align: 'center' }, Tabs([{ t: '알림톡' }, { t: '문자' }, { t: '메일' }], o.tab || '알림톡', { kind: 'pill' }), o.badge || Flex({ gap: 8, align: 'center' }, Text('알림톡 심사', { sm: true }), tpl('승인'), Text('2026-11-03 승인', { sm: true, mute: true }))),
    o.top || '',
    `<div style="display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:18px;align-items:start"><div>${o.form}</div><div>${o.pv}</div></div>`,
);

const formKakao = (o = {}) => [
    FormTable([
        { k: '문구', required: true, v: `<div class="wf-textarea${o.err ? ' error' : ''}" style="height:210px"><span class="v" style="line-height:1.7">${mark(o.text || SHIP_TXT)}</span><span class="cnt">${o.count || '118 / 1,000자'}</span></div>`, help: '변수는 보낼 때 실제 값으로 바뀝니다. 커서를 둔 자리에 아래 변수를 눌러 넣으세요.', error: o.err },
        { k: '넣을 수 있는 변수', v: varChips(), help: '이 알림(발송 안내)에서 쓸 수 있는 변수만 나옵니다.' },
        { k: '버튼', v: [Input({ value: '배송 조회', w: 150 }), Select({ value: '배송 조회 화면', w: 200 }), Btn('버튼 추가 (5개까지)', { size: 'sm', icon: 'plus' })] },
    ]),
    Note('알림톡은 정보를 알리는 글만 보낼 수 있습니다. 할인·쿠폰·이벤트 같은 광고 문구를 넣으면 심사에서 반려됩니다. 문구를 고치면 다시 심사를 받고(보통 영업일 1 ~ 3일), 그동안은 지금 승인된 문구로 계속 나갑니다.', { warn: true }),
];

const formSms = FormTable([
    { k: '문구', required: true, v: `<div class="wf-textarea" style="height:150px"><span class="v" style="line-height:1.7">${mark('#{고객명} 님, 주문하신 상품을 발송했습니다.<br>#{택배사} #{송장번호}<br>배송 조회 #{배송조회링크}')}</span><span class="cnt">약 96 / 90바이트 · 장문</span></div>`, help: '맨 앞에 [이너에라] 가 자동으로 붙습니다. 한글 45자(90바이트)를 넘으면 장문 문자로 나가 요금이 약 3배입니다. 변수 값 길이에 따라 달라집니다.' },
    { k: '넣을 수 있는 변수', v: varChips() },
    { k: '쓰는 때', v: RadioGroup(['알림톡이 실패했을 때만', '알림톡과 함께 항상'], '알림톡이 실패했을 때만') },
    { k: '알림톡 문구 따라가기', v: Check('문자 문구를 따로 쓰지 않고 알림톡 문구를 그대로 보내기 (장문)') },
]);

const formMail = FormTable([
    { k: '제목', required: true, v: Input({ value: '[이너에라] 주문하신 상품을 발송했습니다 (#{주문번호})', w: 480 }) },
    { k: '본문', required: true, v: `<div style="width:100%"><div style="display:flex;gap:2px;border:1px solid var(--line);border-bottom:0;border-radius:4px 4px 0 0;padding:5px 8px;background:var(--box);font-size:12.5px"><b style="padding:0 6px">굵게</b><span style="padding:0 6px">${Icon('link')} 링크</span><span style="padding:0 6px">${Icon('list-dot')} 목록</span><span style="padding:0 6px">${Icon('view-list')} 주문 상품 표 넣기</span></div><div class="wf-textarea" style="height:170px;border-radius:0 0 4px 4px"><span class="v" style="line-height:1.7">${mark('#{고객명} 님, 주문하신 상품을 발송했습니다.<br><br>[주문 상품 표 — 상품 · 구성 · 수량 · 금액이 자동으로 들어갑니다]<br><br>택배사 #{택배사} · 송장번호 #{송장번호}')}</span></div></div>`, help: '로고와 사업자 정보는 메일 위아래에 자동으로 붙습니다.' },
    { k: '넣을 수 있는 변수', v: varChips() },
    { k: '버튼', v: [Input({ value: '배송 조회하기', w: 150 }), Select({ value: '배송 조회 화면', w: 200 })] },
]);

const MailPv = `<div style="width:280px;border:1px solid var(--line);background:#fff;font-size:12px"><div style="padding:8px 12px;border-bottom:1px solid var(--line2);color:var(--mute)">메일 미리보기</div><div style="padding:14px"><div class="u-logo" style="margin-bottom:12px">Inner:Era 로고</div><b style="font-size:14px">주문하신 상품을 발송했습니다</b><p style="line-height:1.7">김민지 님, 주문하신 상품을 발송했습니다.</p><div style="border:1px solid var(--line2);padding:8px;margin:8px 0">롱지비티 석류맛 젤리스틱<br>2박스(28일분) · 1개 · 93,000원(예시)</div>CJ대한통운 · 581233441201<div style="margin:12px 0">${Btn('배송 조회하기', { kind: 'primary', size: 'sm' })}</div><div style="border-top:1px solid var(--line2);padding-top:8px;color:var(--mute);font-size:10.5px;line-height:1.6">이너에라 Inner:Era · 대표 이보림 · 384-17-02845<br>고객센터 070-****-1234</div></div></div>`;

const state2 = StateBlock({ idx: 2, title: '문구 편집(변수 넣기·미리보기)', note: '알림 목록에서 문구 편집을 누르면 열리는 팝업. 수단(알림톡 · 문자 · 메일)마다 탭이 나뉘고, 왼쪽에서 고치면 오른쪽 미리보기가 따라 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '문구 속 #{주문번호} 같은 변수는 보낼 때 실제 값으로 바뀝니다. 변수 이름을 외워 치게 하면 오타가 나므로 그 알림에서 쓸 수 있는 변수만 단추로 보여 주고 눌러서 넣습니다. 오른쪽에는 가명 고객의 실제 주문 값으로 채운 모습을 보여 줘 줄 바꿈과 길이를 확인합니다. 시험 발송으로 운영자 본인 휴대폰에 먼저 받아 볼 수 있습니다.'),
    Anno({ warn: true, title: '수단별 분기 · 알림톡 심사' }, '알림톡 = 문구 + 버튼(심사 필요, 고치면 재심사 · 광고 문구 불가) / 문자 = 문구만(90바이트 넘으면 장문 요금 안내) / 메일 = 제목 + 본문 + 주문 상품 표 + 버튼. 알림톡 심사 상태(승인 · 심사 중 · 반려 사유)를 팝업 위에 보여 주고, 심사 중이거나 반려된 동안은 문자로 대신 나갑니다.'),
    Canvas({ label: 'A-94 · 발송 안내 → 문구 편집 버튼 → 팝업 · 알림톡 탭 (승인된 문구)' }, Overlay({ bg: Page('알림 목록', {}, SubTabs('고객 알림'), Table({ cols: C_COLS, rows: C_ROWS.slice(0, 9) })), h: 860 },
        editModal({ form: formKakao(), pv: Phone('알림톡', SHIP_PV, '배송 조회') }))),
    Canvas({ size: 'auto', label: '알림톡 · 문구를 고친 뒤 (재심사 안내) + 없는 변수를 넣어 오류', right: '팝업만', pad: 20 }, editModal({
        top: Note('문구가 승인된 내용과 달라졌습니다. 저장하면 카카오 심사를 다시 받고, 승인될 때까지는 지금 승인된 문구로 나갑니다.', { warn: true }),
        form: formKakao({ text: `${SHIP_TXT}<br><br>문의는 #{고객센터전화} · #{쿠폰이름}`, count: '142 / 1,000자', err: '#{쿠폰이름} 은 이 알림에서 쓸 수 없는 변수입니다. 아래 변수 단추에 있는 것만 넣어 주세요.' }),
        pv: Phone('알림톡', `${SHIP_PV}<br><br>문의는 070-****-1234 · <b>#{쿠폰이름}</b>`, '배송 조회'),
    })),
    Canvas({ size: 'auto', label: '알림톡 · 심사 반려된 알림 (취소·반품·교환 거부) — 반려 사유와 고칠 곳', right: '팝업만', pad: 20 }, editModal({
        name: '취소·반품·교환 거부', ok: '고쳐서 다시 심사 요청',
        badge: Flex({ gap: 8, align: 'center' }, Text('알림톡 심사', { sm: true }), tpl('반려'), Text('2026-11-09 반려', { sm: true, mute: true })),
        top: Note('<b>반려 사유 (카카오)</b> 변수 #{거부사유} 에 어떤 내용이 들어가는지 알 수 없습니다. 변수에 들어갈 수 있는 값의 예시를 문구 아래 설명에 적어 다시 신청해 주세요. — 지금은 이 알림이 문자로 대신 나가고 있습니다.', { warn: true }),
        form: FormTable([
            { k: '문구', required: true, v: `<div class="wf-textarea" style="height:170px"><span class="v" style="line-height:1.7">${mark('#{고객명} 님, 신청하신 #{신청종류} 건을 처리해 드리지 못했습니다.<br><br>주문번호 #{주문번호}<br>사유 #{거부사유}<br><br>자세한 내용은 고객센터 #{고객센터전화} 로 문의해 주세요.')}</span><span class="cnt">104 / 1,000자</span></div>` },
            { k: '심사용 설명', v: Textarea({ value: '#{거부사유} 예시: 반품 신청 기한(배송완료 후 7일)이 지났습니다 / 상품을 사용한 흔적이 있습니다', h: 64, count: '58 / 200' }), help: '카카오 심사 담당자에게만 보이는 설명입니다. 고객에게는 안 나갑니다.' },
            { k: '넣을 수 있는 변수', v: varChips(['#{고객명}', '#{신청종류}', '#{주문번호}', '#{거부사유}', '#{고객센터전화}']) },
        ]),
        pv: Phone('알림톡', '김민지 님, 신청하신 반품 건을 처리해 드리지 못했습니다.<br><br>주문번호 20261111-000128<br>사유 반품 신청 기한(배송완료 후 7일)이 지났습니다<br><br>자세한 내용은 고객센터 070-****-1234 로 문의해 주세요.'),
    })),
    Canvas({ size: 'auto', label: '문자 탭 (길이 · 장문 요금 안내)', right: '팝업만', pad: 20 }, editModal({ tab: '문자', ok: '저장', badge: Text('문자는 심사가 없습니다', { sm: true, mute: true }), form: formSms, pv: Phone('문자', '김민지 님, 주문하신 상품을 발송했습니다.<br>CJ대한통운 581233441201<br>배송 조회 innerera.example/t/8Kd2') })),
    Canvas({ size: 'auto', label: '메일 탭 (제목 · 본문 · 주문 상품 표)', right: '팝업만', pad: 20 }, editModal({ tab: '메일', ok: '저장', badge: Text('메일은 심사가 없습니다', { sm: true, mute: true }), form: formMail, pv: MailPv })),
    CanvasRow(
        Canvas({ size: 'auto', label: '나에게 시험 발송 버튼', right: '팝업만', pad: 20 }, Modal({ title: '시험 발송', w: 460, foot: [Btn('취소'), Btn('보내기', 'primary')] }, FormTable([{ k: '받을 번호', v: Input({ value: '010-****-7788 (이보림)', w: 240 }) }, { k: '수단', v: CheckGroup(['알림톡', '문자', '메일'], ['알림톡']) }]), Note('변수는 가명 고객의 예시 값으로 채워 보냅니다. 심사 중인 알림톡 문구는 시험 발송할 수 없어 문자로 갑니다.'))),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('문구를 저장하고 카카오에 심사를 요청했습니다. 결과는 알림 목록의 알림톡 심사 칸에 표시됩니다.')),
    ),
    Canvas({ size: 'auto', label: '처음 문구로 되돌리기 (문구 칸 오른쪽 위 메뉴)', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '처음 문구로 되돌릴까요?', desc: '발송 안내 알림톡 문구가 설치할 때의 기본 문구(이미 승인됨)로 돌아갑니다. 지금 고친 내용은 사라집니다.', ok: '되돌리기' })),
);

const R_KINDS = ['신규 주문', '취소 요청', '반품·교환', '새 문의', '연동 오류', '품절 임박', '발송 기한', '하루 요약'];
const rrow = (name, role, tel, mail, on) => [`<b>${name}</b><small>${role}</small>`, `${tel}<small>${mail}</small>`, ...R_KINDS.map((_, i) => Check('', { on: on.includes(i) })), `${Btn('수정', { size: 'sm' })}`];
const R_COLS = [{ t: '받는 사람', w: 130 }, { t: '휴대폰 · 메일', w: 190 }, ...R_KINDS.map((k) => ({ t: k, w: 66, align: 'center' })), { t: '', w: 64 }];
const R_ROWS = (fix) => [
    rrow('이보림', '최고관리자', '010-****-7788', 'boreum@innerera.example', fix ? [0, 4, 5, 7] : [0, 5, 7]),
    rrow('윤서연', '주문/배송', '010-****-3412', 'order@innerera.example', fix ? [0, 1, 2, 4, 6] : [0, 1, 2, 6]),
    rrow('임재현', 'CS', '010-****-9026', 'cs@innerera.example', [3]),
    rrow('위탁 물류센터(김포)', '운영자 아님 · 직접 입력', '031-****-5678', 'gimpo@logis.example', [0]),
];

const addRecv = (o = {}) => Modal({ title: '받는 사람 추가', w: 620, foot: [Btn('취소'), Btn('추가', 'primary')] }, FormTable([
    { k: '누구', required: true, v: RadioGroup(['운영자 중에서 고르기', '직접 입력 (운영자가 아닌 사람)'], o.direct ? '직접 입력 (운영자가 아닌 사람)' : '운영자 중에서 고르기') },
    o.direct
        ? { k: '이름 · 연락처', required: true, v: [Input({ value: '세무 담당', w: 140 }), Input({ value: '010-1234', placeholder: '휴대폰', w: 160, error: true }), Input({ placeholder: '메일', w: 220 })], error: '휴대폰 번호를 끝까지 넣어 주세요. 메일만 받을 사람이면 휴대폰 칸을 비워 두세요.' }
        : { k: '운영자', required: true, v: Select({ value: '', placeholder: '이름으로 찾기', w: 300, open: true, search: '', options: [{ t: '강지호', sub: '상품/전시 · 010-****-4468' }, { t: '정수아', sub: '마케팅 · 휴대폰 없음 (메일만)' }, { t: '이보림', sub: '이미 추가됨', disabled: true }] }), help: '운영자의 휴대폰·메일은 설정 > 운영자·권한의 값을 씁니다. 운영자가 퇴사해 계정을 끄면 수신자에서도 자동으로 빠집니다.' },
    ...(o.direct ? [{ k: '받을 알림', required: true, v: CheckGroup(R_KINDS, ['하루 요약']) }, { k: '수단', v: CheckGroup(['문자', '메일'], ['메일']) }] : []),
]));

const state3 = StateBlock({ idx: 3, title: '내부 수신자 설정', note: '내부 수신자 탭. 신규 주문 · 취소 요청 · 문의 · 연동 오류 같은 내부 알림을 누가 받을지 사람 × 알림 표에서 체크합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '담당자가 바뀌면 알림 받는 사람도 바뀌어야 하는데, 이걸 개발자에게 부탁하게 만들면 몇 달씩 퇴사자에게 알림이 갑니다. 사람을 줄로, 알림 종류를 칸으로 놓은 표에서 체크만 하면 되고, 한 알림을 여러 명이 받을 수 있습니다. 운영자가 아닌 사람(위탁 물류센터, 세무 담당)도 직접 입력해 넣습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 초기값' }, '켜져 있는데 받는 사람이 한 명도 없는 알림은 칸 머리에 경고가 붙습니다(특히 연동 오류). 설치 직후에는 최고관리자 한 명이 모든 내부 알림을 메일로 받습니다. 밤에는 문자를 보내지 않고 아침에 모아 보내도록 사람마다 정할 수 있습니다.'),
    Canvas({ label: 'A-94 · 내부 수신자 탭 · 연동 오류를 받는 사람이 없음 (경고)' }, Page('내부 수신자', { actions: [Btn('받는 사람 추가', { kind: 'primary', icon: 'plus' })] },
        Note('연동 오류 알림을 받는 사람이 없습니다. 한 명 이상 체크해 주세요.', { warn: true }),
        Table({ cols: R_COLS.map((c) => (c.t === '연동 오류' ? { ...c, t: `연동 오류 ${Icon('warning')}` } : c)), rows: R_ROWS(false) }),
        Note('체크하면 바로 저장됩니다. 수단(문자·메일)은 알림 목록 탭의 내부 알림에서 알림마다 정하고, 휴대폰이 없는 사람은 메일만 받습니다.'),
        Box({ title: '신규 주문 알림을 보내는 방식' }, FormTable([{ k: '묶어 보내기', v: RadioGroup(['주문이 들어올 때마다', '1시간마다 묶어서', '하루 3번 (9시 · 13시 · 17시)'], '1시간마다 묶어서'), help: '주문이 많은 몰은 묶어 보내야 문자가 쏟아지지 않습니다. 예: [이너에라] 14시 ~ 15시 신규 주문 12건 (자사몰 8 · 스마트스토어 4)' }, { k: '밤 시간', v: [Check('21:00 ~ 08:00 에는 문자를 보내지 않고 08:00 에 모아 보내기', { on: true }), Text('연동 오류는 밤에도 바로 보냅니다', { sm: true, mute: true })] }])),
    )),
    Canvas({ label: 'A-94 · 연동 오류 칸을 체크한 뒤 (경고 사라짐 · 바로 저장)' }, Overlay({ bg: Page('내부 수신자', { actions: [Btn('받는 사람 추가', { kind: 'primary', icon: 'plus' })] }, Table({ cols: R_COLS, rows: R_ROWS(true) })), dim: false, align: 'top', h: 380 }, Toast('연동 오류 알림을 이보림 · 윤서연 님이 받도록 저장했습니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '받는 사람 추가 → 운영자 중에서 고르기 (검색형)', right: '팝업만', pad: 20 }, `<div style="min-height:400px">${addRecv()}</div>`),
        Canvas({ size: 'auto', label: '직접 입력 · 입력 오류', right: '팝업만', pad: 20 }, addRecv({ direct: true })),
    ),
    Canvas({ size: 'auto', label: '수정 → 받는 사람 빼기', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '임재현 님을 받는 사람에서 뺄까요?', desc: '새 문의 알림을 받는 사람이 아무도 없게 됩니다. 다른 사람을 먼저 체크한 뒤 빼는 것을 권합니다.', foot: [Btn('취소'), Btn('그래도 빼기', 'danger')] })),
);

const res = (r) => ({ 성공: Badge('성공', 'check'), 실패: Badge('실패', 'x'), 대체: Badge('문자로 대신 보냄', 'dash'), 대기: Badge('보내는 중', 'mute') }[r]);
const H_COLS = [{ t: '보낸 일시', w: 120, sort: 'desc' }, { t: '알림', w: 140 }, { t: '받는 분', w: 150 }, { t: '수단', w: 80 }, { t: '결과', w: 140 }, '내용 · 실패 사유', { t: '관련 주문', w: 140 }];
const H_ROWS = [
    ['11-11 14:05:12', '발송 안내', '김민지<small>010-****-1234</small>', '알림톡', res('성공'), '김민지 님, 주문하신 상품을 발송했습니다 …', '<u>20261111-000128</u>'],
    ['11-11 14:05:12', '발송 안내', '박서준<small>010-****-5821</small>', '알림톡', res('대체'), '카카오톡을 쓰지 않는 번호 → 14:05:20 문자 성공', '<u>20261111-000129</u>'],
    { hl: true, c: ['11-11 14:05:13', '발송 안내', '이하은<small>010-****-7730</small>', '알림톡', res('실패'), `${Icon('error-o')} 알림톡 실패(수신 차단) → 문자도 실패: 없는 번호입니다`, '<u>20261111-000127</u>'] },
    ['11-11 13:52:40', '결제 완료', '최도윤<small>dy.choi@mail.example</small>', '메일', res('성공'), '[이너에라] 결제가 완료되었습니다 (20261111-000126)', '<u>20261111-000126</u>'],
    ['11-11 13:00:02', '신규 주문 (내부)', '윤서연<small>010-****-3412</small>', '문자', res('성공'), '12시 ~ 13시 신규 주문 9건 (자사몰 6 · 스마트스토어 3)', '-'],
    { hl: true, c: ['11-11 11:20:31', '취소·반품·교환 거부', '정수아<small>010-****-9015</small>', '알림톡', res('대체'), '알림톡 문구 심사 반려 상태 → 문자로 보냄', '<u>20261109-000071</u>'] },
    { hl: true, c: ['11-11 10:00:00', '입금 재촉', '강지호<small>010-****-4468</small>', '알림톡', res('실패'), `${Icon('error-o')} 발송 충전금 부족 — 충전 뒤 다시 보내 주세요`, '<u>20261110-000125</u>'] },
];

const HistFilters = Filters({ rows: [
    { k: '기간', v: Period({ preset: '오늘', from: '2026-11-11', to: '2026-11-11' }) },
    { k: '구분 · 알림', v: [Chips(['전체', '고객 알림', '내부 알림'], '전체'), Select({ value: '알림 전체', w: 200 })] },
    { k: '수단 · 결과', v: [CheckGroup(['알림톡', '문자', '메일'], ['알림톡', '문자', '메일']), CheckGroup(['성공', '문자로 대신 보냄', '실패'], ['성공', '문자로 대신 보냄', '실패'])] },
    { k: '찾기', v: [Select({ value: '받는 분 이름', w: 150 }), Input({ placeholder: '이름 · 휴대폰 뒤 4자리 · 주문번호', icon: 'search', w: 300 })] },
] });

const state4 = StateBlock({ idx: 4, title: '발송 이력', note: '발송 이력 탭. 어떤 알림이 누구에게 무엇으로 갔고 성공했는지, 실패했다면 왜인지 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 송장 문자를 못 받았다고 하면 운영자는 실제로 보냈는지부터 확인해야 합니다. 알림 한 건마다 수단·결과·실패 사유를 남기고, 알림톡이 실패해 문자로 대신 나간 건은 따로 표시합니다. 실패 건은 골라서 다시 보낼 수 있습니다. 주문 상세의 알림 발송 이력 탭에도 그 주문 것만 같은 내용이 보입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '실패 사유는 운영자가 조치할 수 있는 말로 씁니다(없는 번호 → 고객에게 번호 확인 / 충전금 부족 → 충전 / 심사 반려 → 문구 편집). 발송 이력은 6개월 보관하고 받는 분 연락처는 가운데를 가려 보여 줍니다. 엑셀로 내려받을 때는 개인정보 다운로드 권한이 있어야 합니다.'),
    Canvas({ label: 'A-94 · 발송 이력 탭 (성공 · 문자로 대신 보냄 · 실패)' }, Page('발송 이력', {},
        Stats([{ k: '오늘 보낸 알림', v: '412', sub: '알림톡 356 · 문자 31 · 메일 25' }, { k: '성공', v: '398', sub: '96.6%' }, { k: '문자로 대신 보냄', v: '11', sub: '알림톡 실패 → 문자 성공' }, { k: '실패', v: '3', sub: '다시 보내기 필요', on: true }]),
        '<div style="height:16px"></div>', HistFilters,
        ListHead({ total: 412, left: Chips(['전체 412', '성공 398', '문자로 대신 보냄 11', '실패 3'], '전체 412'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), Select({ value: '50개씩 보기', w: 130 })] }),
        Table({ check: true, cols: H_COLS, rows: H_ROWS }), Pager({ page: 1, last: 9, per: 50 }),
    )),
    Canvas({ label: 'A-94 · 실패 3건 선택 → 일괄 처리 바 → 다시 보내기 확인' }, Overlay({ bg: Page('발송 이력', {}, BulkBar({ count: 3, sub: '실패 3건' }, Btn('다시 보내기', { kind: 'primary', icon: 'send' }), Btn('문자로 보내기')), Table({ check: true, checked: [0, 1, 2], cols: H_COLS, rows: [H_ROWS[2], H_ROWS[5], H_ROWS[6]] })), h: 440 },
        Confirm({ w: 420, title: '3건을 다시 보낼까요?', desc: '같은 문구를 지금 값으로 다시 보냅니다. 없는 번호로 실패한 1건(이하은)은 다시 보내도 실패합니다 — 주문 상세에서 연락처를 먼저 확인해 주세요.', foot: [Btn('취소'), Btn('없는 번호 1건 빼고 2건 보내기', 'primary')] }))),
    Canvas({ label: 'A-94 · 줄을 눌렀을 때 → 발송 상세 (오른쪽에서 열림)' }, Overlay({ bg: Page('발송 이력', {}, Table({ check: true, cols: H_COLS, rows: H_ROWS })), align: 'right', h: 720 },
        SideDrawer({ title: '발송 상세', sub: '발송 안내 · 박서준', w: 520, foot: [Btn('닫기'), Btn('주문 상세 열기', { icon: 'external-link' }), Btn('다시 보내기', { kind: 'primary', icon: 'send' })] },
            KV([['알림', '발송 안내 (고객 알림)'], ['받는 분', '박서준 · 010-****-5821'], ['관련 주문', '<u>20261111-000129</u> · 자사몰'], ['보낸 계기', '운영자 윤서연이 송장 엑셀 일괄 등록으로 발송처리']], { wide: true }),
            '<div style="height:14px"></div>',
            Table({ dense: true, cols: [{ t: '시각', w: 80 }, { t: '수단', w: 70 }, { t: '결과', w: 130 }, '내용'], rows: [['14:05:12', '알림톡', res('실패'), '카카오톡을 쓰지 않는 번호'], ['14:05:20', '문자', res('성공'), '통신사 전달 완료 (장문)']] }),
            Box({ flat: true, title: '보낸 문구' }, Text('[이너에라]<br>박서준 님, 주문하신 상품을 발송했습니다.<br>CJ대한통운 581233441202<br>배송 조회 innerera.example/t/9Qa1', { sm: true })),
        ))),
    Canvas({ label: 'A-94 · 조건에 맞는 이력이 없을 때' }, Page('발송 이력', {}, Filters({ open: false, summary: '기간 오늘 · 알림 재입고 알림 · 결과 실패' }), ListHead({ total: 0 }), Table({ cols: H_COLS, rows: [], empty: '조건에 맞는 발송 이력이 없습니다. 기간을 넓히거나 결과 조건을 풀어 보세요.' }))),
);

export default function A94() {
    return [state1, state2, state3, state4].join('');
}
