import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, Badge, OrderBadge, Chips, Tabs, Input, Select, Textarea, Field, Check, Radio,
    Overlay, Modal, Confirm, Toast, Empty, Upload, Box, KV, Note, Text, Icon, Flex, Thumb, Table, Pager, ListHead, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const PS = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);

const STYLE = `<style>
.u20-card { border:1px solid var(--line); border-radius:6px; padding:14px; margin-bottom:10px; background:#fff; font-size:13px; }
.u20-card .t { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--mute); margin-bottom:6px; }
.u20-card .t .sp { flex:1; }
.u20-card b { font-size:14px; display:block; margin-bottom:4px; }
.u20-card span.o { color:var(--mute); font-size:12.5px; }
.u20-q { border:1px solid var(--line); border-radius:6px; background:#fff; margin-bottom:14px; }
.u20-q .hd { padding:16px 18px; border-bottom:1px solid var(--line2); }
.u20-q .hd h4 { margin:8px 0 6px; font-size:17px; }
.u20-q .hd .meta { display:flex; gap:10px; align-items:center; font-size:12.5px; color:var(--mute); }
.u20-q .bd { padding:18px; font-size:13.5px; line-height:1.75; }
.u20-a { border-left:3px solid var(--dark); background:var(--box); padding:16px 18px; font-size:13.5px; line-height:1.75; margin-bottom:14px; }
.u20-a .who { display:flex; align-items:center; gap:6px; font-weight:700; margin-bottom:6px; }
.u20-a .who span { font-weight:400; color:var(--mute); font-size:12px; }
.u20-pick { display:flex; flex-wrap:wrap; align-items:center; gap:12px; border:1px solid var(--line); border-radius:6px; padding:12px; margin-bottom:8px; }
.u20-pick.on { border:2px solid var(--dark); padding:11px; }
.u20-pick .pi { flex:1; min-width:150px; display:flex; flex-direction:column; font-size:13px; }
.u20-pick .pi span { color:var(--mute); font-size:12.5px; }
.u20-pq { border-bottom:1px solid var(--line2); padding:14px 4px; font-size:13.5px; }
.u20-pq .row { display:flex; align-items:center; gap:10px; }
.u20-pq .row .sp { flex:1; }
.u20-pq .row small { color:var(--mute); font-size:12.5px; white-space:nowrap; }
.u20-pq .open { margin-top:12px; }
</style>`;

const W = Badge('답변대기', 'bold');
const D = Badge('답변완료', 'check');

const TOP = (active, o = {}) => (o.noProduct ? '' : Tabs([{ t: '1:1 문의', n: o.a === undefined ? 4 : o.a }, { t: '상품 문의', n: o.b === undefined ? 2 : o.b }], active));

const COLS = [{ t: '상태', w: 96 }, { t: '분류', w: 110 }, '제목', { t: '작성일', w: 96 }, { t: '', w: 118, align: 'right' }];
const ROWS = [
    [W, '배송', `<u>배송이 언제 출발하나요?</u><small>${Icon('receipt')} 주문 20261109-000104 · ${PS} ${O4}</small>`, '2026-11-11', `${Btn('수정', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`],
    [W, '상품', `<u>임산부가 먹어도 되는지 궁금합니다</u> ${Icon('paperclip')}<small>연결한 주문 없음</small>`, '2026-11-10', `${Btn('수정', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`],
    [`${D} ${Badge('새 답변', 'fill')}`, '취소·반품·교환', `<b><u>상자가 눌려서 왔어요, 교환되나요?</u></b> ${Icon('paperclip')}<small>${Icon('receipt')} 주문 20261103-000052 · ${PS} ${O1}</small>`, '2026-11-06', ''],
    [D, '결제', `<u>현금영수증을 사업자 번호로 바꾸고 싶어요</u><small>${Icon('receipt')} 주문 20261020-000311 · ${PS} ${O2}</small>`, '2026-10-21', ''],
];

const ListBody = (o = {}) => [
    TOP('1:1 문의', o),
    ListHead({ left: Chips(['전체 4', '답변대기 2', '답변완료 2'], o.chip || '전체 4'), right: Btn('1:1 문의하기', { kind: 'primary', size: 'sm', icon: 'pen-o' }) }),
    Table({ cols: COLS, rows: o.rows || ROWS }),
    Note('답변은 평일 10:00 ~ 17:00 에 순서대로 드립니다(보통 영업일 1일 이내). 답변이 달리면 알림톡으로 알려 드립니다.'),
    Pager({ page: 1, last: 1 }),
];

const MCard = (st, cat, title, sub, date) => `<div class="u20-card"><div class="t">${st}<span>${cat}</span><span class="sp"></span><span>${date}</span></div><b>${title}</b><span class="o">${sub}</span></div>`;

const state1 = StateBlock({ idx: 1, title: '1:1 문의 목록(답변대기·답변완료)', note: '내가 남긴 1:1 문의를 최근 순으로 봅니다. 답변이 새로 달린 문의는 제목이 굵고 새 답변 배지가 붙습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 가장 알고 싶은 것은 "답이 달렸나"입니다. 그래서 상태 배지를 맨 앞 칸에 두고(답변대기 = 굵은 테두리, 답변완료 = 체크) 답변대기·답변완료로 걸러 볼 수 있게 합니다. 주문과 이어진 문의는 제목 아래에 주문번호와 구성을 같이 보여 주어 어떤 주문 얘기인지 다시 열지 않아도 압니다. 분류 목록과 답변 시간 안내 문구는 관리자 고객응대 설정값입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '수정·삭제 버튼은 답변대기 문의에만 있습니다. 답변이 달린 뒤에는 기록을 남기기 위해 고칠 수 없고, 더 물을 것이 있으면 답변 화면의 추가 문의를 씁니다. 상품 문의 기능을 끈 몰은 탭 줄 자체가 없고 1:1 문의 목록만 나옵니다.'),
    Canvas({ label: 'U-20 · 1:1 문의 탭 · 답변대기 2(수정·삭제) · 답변완료 2(새 답변 1)' }, STYLE, MypageLayout({ active: '문의', title: '문의' }, ListBody())),
    Canvas({ label: 'U-20 · 답변대기만 보기 + 상품 문의 기능을 끈 몰(탭 줄 없음)' }, MypageLayout({ active: '문의', title: '1:1 문의' }, ListBody({ noProduct: true, chip: '답변대기 2', rows: ROWS.slice(0, 2) }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 1:1 문의 목록(카드형, 아래 고정 버튼)' }, MobilePage({ title: '문의', tab: false, bottom: [Btn('1:1 문의하기', { kind: 'primary', icon: 'pen-o' })] },
            TOP('1:1 문의'), Chips(['전체 4', '답변대기 2', '답변완료 2'], '전체 4'), '<div style="height:12px"></div>',
            MCard(W, '배송', '배송이 언제 출발하나요?', `주문 20261109-000104 · ${O4}`, '11-11'),
            MCard(W, '상품', '임산부가 먹어도 되는지 궁금합니다', '연결한 주문 없음 · 사진 1장', '11-10'),
            MCard(`${D}${Badge('새 답변', 'fill')}`, '취소·반품·교환', '상자가 눌려서 왔어요, 교환되나요?', `주문 20261103-000052 · ${O1}`, '11-06'),
            MCard(D, '결제', '현금영수증을 사업자 번호로 바꾸고 싶어요', `주문 20261020-000311 · ${O2}`, '10-21'))),
        Canvas({ size: 'auto', label: '답변대기 문의의 삭제 버튼 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 380, danger: true, title: '이 문의를 삭제할까요?', desc: '배송이 언제 출발하나요?<br>삭제하면 되돌릴 수 없고 답변을 받을 수 없습니다.', ok: '삭제' })),
        Canvas({ size: 'auto', label: '삭제 완료', right: '토스트만', pad: 20 }, Toast('문의를 삭제했습니다.')),
    ),
);

const CATS = ['상품', '배송', '주문·결제', '취소·반품·교환', '회원·적립금·쿠폰', '기타'];
const PHOTO_GUIDE = ['JPG · PNG · 한 장에 10MB 이하 · 최대 5장', '파손·오배송 문의는 송장이 보이는 상자 겉면과 상품 사진을 함께 올려 주세요'];

const Linked = (no, opt, st) => `<div class="u20-pick on">${Thumb(48)}<div class="pi"><b>${P}</b><span>${opt} · 주문번호 ${no}</span></div>${OrderBadge(st)}${Btn('바꾸기', { size: 'sm' })}${Icon('close-min')}</div>`;
const NotifyField = () => Field({ label: '답변 알림', help: '답변이 달리면 고른 방법으로 알려 드립니다. 광고 수신 동의와 관계없이 발송되는 안내입니다.' },
    Flex({ gap: 20, wrap: true }, Check('알림톡 010-****-1234', { on: true }), Check('이메일 minji@example.com')));

const FormEmpty = () => [
    Field({ label: '문의 분류', required: true }, Select({ placeholder: '분류를 고르세요', w: 280 })),
    Field({ label: '주문 연결', help: '주문과 관련된 문의는 주문을 연결하면 더 빨리 답변드릴 수 있습니다.' }, Btn('주문 고르기', { icon: 'receipt' })),
    Field({ label: '제목', required: true }, Input({ placeholder: '제목을 입력하세요 (50자까지)' })),
    Field({ label: '문의 내용', required: true }, Textarea({ placeholder: '궁금한 점을 자세히 적어 주세요. 주민등록번호·카드번호 같은 개인정보는 적지 마세요.', h: 150, count: '0 / 2,000' })),
    Field({ label: '사진 첨부' }, Upload({ title: '사진을 끌어다 놓거나 눌러서 고르기', icon: 'camera-o', button: '사진 고르기', guide: PHOTO_GUIDE })),
    NotifyField(),
];

const FormFilled = () => [
    Field({ label: '문의 분류', required: true }, Select({ value: '취소·반품·교환', w: 280 })),
    Field({ label: '주문 연결', required: true }, Linked('20261103-000052', `${O1} · 2개`, '배송완료')),
    Field({ label: '제목', required: true }, Input({ value: '상자가 눌려서 왔어요, 교환되나요?' })),
    Field({ label: '문의 내용', required: true }, Textarea({ value: '어제 받았는데 겉 상자 한쪽이 심하게 눌려 있고 안쪽 상자 하나도 모서리가 찢어져 있습니다. 내용물은 뜯지 않았습니다. 교환이 가능한지, 가능하면 어떻게 보내면 되는지 알려 주세요.', h: 130, count: '104 / 2,000' })),
    Field({ label: '사진 첨부' }, Upload({ title: '사진 더 올리기 (2 / 5)', icon: 'camera-o', button: '사진 고르기', files: [{ name: '상자_겉면.jpg', size: '2.4MB', icon: 'image-o' }, { name: '안쪽_상자_모서리.jpg', size: '1.9MB', icon: 'image-o' }] })),
    NotifyField(),
];

const FormError = () => [
    Field({ label: '문의 분류', required: true }, Select({ value: '배송', w: 280 })),
    Field({ label: '주문 연결', required: true, error: '배송 문의는 어떤 주문인지 골라 주세요.' }, Btn('주문 고르기', { icon: 'receipt' })),
    Field({ label: '제목', required: true, error: '제목을 입력해 주세요.' }, Input({ placeholder: '제목을 입력하세요 (50자까지)', error: true })),
    Field({ label: '문의 내용', required: true, error: '문의 내용을 10자 이상 적어 주세요. 지금 5자입니다.' }, Textarea({ value: '언제 와요', h: 90, count: '5 / 2,000', error: true })),
    Field({ label: '사진 첨부' }, Upload({ title: '사진을 끌어다 놓거나 눌러서 고르기', icon: 'camera-o', button: '사진 고르기', files: [{ name: '동영상_0412.mp4', size: '38MB', icon: 'file-o', error: 'JPG · PNG 사진만 올릴 수 있습니다' }] })),
    Field({ label: '답변 알림', error: '답변 받을 방법을 하나 이상 골라 주세요.' }, Flex({ gap: 20, wrap: true }, Check('알림톡 010-****-1234'), Check('이메일 minji@example.com'))),
];

const WriteFoot = (on) => `<div class="wf-btnrow center" style="margin-top:8px">${Btn('취소', { size: 'lg', w: 140 })}${Btn('문의 등록', { kind: 'primary', size: 'lg', w: 200, disabled: !on })}</div>`;

const PickRow = (no, date, opt, st, on) => `<div class="u20-pick${on ? ' on' : ''}">${Radio('', { on })}${Thumb(48)}<div class="pi"><b>${P}</b><span>${opt}</span><span>주문 ${no} · ${date}</span></div>${OrderBadge(st)}</div>`;
const pickModal = Modal({ title: '문의할 주문 고르기', w: 560, foot: [Btn('연결 안 함'), Btn('이 주문으로 문의', 'primary')] },
    Flex({ align: 'center', justify: 'space-between' }, Chips(['최근 3개월', '6개월', '1년'], '최근 3개월'), Input({ placeholder: '주문번호로 찾기', icon: 'search', w: 200 })),
    '<div style="height:12px"></div>',
    PickRow('20261111-000128', '2026-11-11', `${O2} · 1개`, '결제완료'),
    PickRow('20261109-000104', '2026-11-09', `${O4} · 1개`, '배송준비'),
    PickRow('20261107-000088', '2026-11-07', `${O2} · 1개`, '배송중'),
    PickRow('20261103-000052', '2026-11-03', `${O1} · 2개`, '배송완료', true),
    PickRow('20261028-000007', '2026-10-28', `${O1} · 1개`, '취소완료'),
    PickRow('20261020-000311', '2026-10-20', `${O2} · 1개`, '구매확정'),
    Text('한 주문에 품목이 여럿이면 품목마다 한 줄로 나옵니다. 더 오래된 주문은 기간을 넓혀 찾으세요.', { sm: true, mute: true }),
);

const WritePage = (...body) => MypageLayout({ active: '문의', title: '1:1 문의하기' }, body);

const state2 = StateBlock({ idx: 2, title: '작성 폼(주문 연결·사진)', note: '1:1 문의하기를 누르면 열리는 화면. 주문 상세의 문의하기 버튼으로 들어오면 그 주문이 미리 연결되어 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '운영자가 답하려면 "어느 주문이냐"를 되묻는 일이 가장 많습니다. 그래서 주문을 목록에서 골라 붙이게 하고(주문번호를 손으로 치지 않음), 관리자 1:1 문의 화면에는 그 주문이 바로 열리는 링크로 붙습니다. 유형별 분기: 분류가 배송 · 주문·결제 · 취소·반품·교환이면 주문 연결이 필수, 상품 · 회원·적립금·쿠폰 · 기타면 선택입니다. 초기값: 답변 알림은 알림톡 켬. 분류 목록은 관리자가 추가·순서 변경합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '자산 규격: 사진 JPG · PNG, 한 장에 10MB 이하, 최대 5장(동영상은 받지 않음). 올리지 못한 파일은 이름과 이유를 보여 줍니다. 취소·반품·교환 분류를 고르면 "바로 신청할 수 있다"는 안내와 신청 화면 바로 가기를 먼저 보여 주어 문의 없이 스스로 처리하게 합니다.'),
    Canvas({ label: 'U-20 · 1:1 문의하기 버튼 → 작성 화면 · 빈값(등록 버튼 꺼짐)' }, WritePage(FormEmpty(), WriteFoot(false))),
    CanvasRow(
        Canvas({ size: 'auto', label: '문의 분류를 누름 → 목록 열림', right: '부분', pad: 20 }, `<div style="width:420px;min-height:300px">${Field({ label: '문의 분류', required: true }, Select({ placeholder: '분류를 고르세요', w: 280, open: true, options: CATS.map((c) => (c === '취소·반품·교환' ? { t: c, sub: '주문 연결 필수' } : c === '배송' || c === '주문·결제' ? { t: c, sub: '주문 연결 필수' } : c)) }))}</div>`),
        Canvas({ size: 'auto', label: '취소·반품·교환을 고른 직후 · 스스로 신청 안내', right: '부분', pad: 20 }, `<div style="width:460px">${Field({ label: '문의 분류', required: true }, Select({ value: '취소·반품·교환', w: 280 }))}${Note('<span>취소·반품·교환은 문의 없이 주문 목록에서 바로 신청할 수 있습니다. <u>주문 목록으로 가기</u></span>')}${Field({ label: '주문 연결', required: true, help: '이 분류는 주문을 꼭 골라야 합니다.' }, Btn('주문 고르기', { icon: 'receipt' }))}</div>`),
    ),
    Canvas({ label: 'U-20 · 주문 고르기 버튼 → 팝업(최근 주문 목록에서 하나 고르기)' }, Overlay({ bg: WritePage(FormEmpty()), h: 760 }, pickModal)),
    Canvas({ label: 'U-20 · 입력됨 · 주문 연결됨 · 사진 2장(등록 버튼 켜짐)' }, WritePage(FormFilled(), WriteFoot(true))),
    Canvas({ label: 'U-20 · 문의 등록을 눌렀을 때 입력 오류(주문 미연결 · 제목 없음 · 내용 짧음 · 사진 아닌 파일 · 알림 방법 없음)' }, WritePage(FormError(), WriteFoot(true))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 작성 화면(아래 고정 버튼)' }, MobilePage({ title: '1:1 문의하기', tab: false, right: '', bottom: [Btn('문의 등록', { kind: 'primary' })] }, FormFilled())),
        Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 주문 고르기는 아래에서 올라오는 시트' }, Overlay({ bg: MobilePage({ title: '1:1 문의하기', tab: false, right: '' }, FormEmpty()), align: 'bottom', h: 720 },
            `<div class="wf-sheet"><div class="grip"></div><div class="mh"><b>문의할 주문 고르기</b>${Icon('close')}</div><div class="mb">${PickRow('20261109-000104', '11-09', `${O4} · 1개`, '배송준비')}${PickRow('20261107-000088', '11-07', `${O2} · 1개`, '배송중')}${PickRow('20261103-000052', '11-03', `${O1} · 2개`, '배송완료', true)}</div><div class="mf">${Btn('연결 안 함')}${Btn('이 주문으로 문의', 'primary')}</div></div>`)),
        Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 등록 완료 토스트 → 목록 맨 위에 답변대기로' }, Overlay({ bg: MobilePage({ title: '문의', tab: false }, TOP('1:1 문의', { a: 5 }), MCard(W, '취소·반품·교환', '상자가 눌려서 왔어요, 교환되나요?', `주문 20261103-000052 · ${O1}`, '방금')), dim: false, align: 'toast-bottom', h: 720 },
            Toast('문의를 등록했습니다. 답변이 달리면 알림톡으로 알려 드립니다.'))),
    ),
    Canvas({ size: 'auto', label: 'PC · 등록 완료 토스트', right: '토스트만', pad: 20 }, Toast('문의를 등록했습니다. 답변이 달리면 알림톡으로 알려 드립니다.', { action: '등록한 문의 보기' })),
);

const QHead = (st, cat, title, date, extra = '') => `<div class="hd"><div class="meta">${st}<span>${cat}</span></div><h4>${title}</h4><div class="meta"><span>${date}</span>${extra}</div></div>`;
const Photos = (n) => `<div style="display:flex;gap:8px;margin-top:14px">${Array.from({ length: n }, () => Thumb(88)).join('')}</div>`;
const OrderLink = (no, opt, st) => Box({ flat: true, title: '연결한 주문', right: Btn('주문 상세 보기', { size: 'sm' }) }, `<div class="wf-prow">${Thumb(48)}<div class="pi"><b>${P}</b><span>${opt} · 주문번호 ${no}</span></div>${OrderBadge(st)}</div>`);

const Q_DONE = `<div class="u20-q">${QHead(D, '취소·반품·교환', '상자가 눌려서 왔어요, 교환되나요?', '2026-11-06 14:22 작성', '<span>알림톡으로 답변 알림 받음</span>')}<div class="bd">어제 받았는데 겉 상자 한쪽이 심하게 눌려 있고 안쪽 상자 하나도 모서리가 찢어져 있습니다. 내용물은 뜯지 않았습니다. 교환이 가능한지, 가능하면 어떻게 보내면 되는지 알려 주세요.${Photos(2)}</div></div>`;
const A_DONE = `<div class="u20-a"><div class="who">${Icon('reply')}이너에라 고객센터 <span>2026-11-07 10:05 답변</span></div>김민지 님, 안녕하세요. 이너에라입니다.<br>받으신 상품이 눌려 도착해 불편을 드려 죄송합니다. 배송 중 파손으로 확인되어 배송비 부담 없이 교환해 드립니다.<br>마이페이지 &gt; 주문 목록에서 해당 주문의 <u>교환 신청</u>을 눌러 사유를 "상품 불량·파손"으로 고르시면 택배 기사님이 방문해 가져갑니다.<br>감사합니다.</div>`;

const state3 = StateBlock({ idx: 3, title: '답변 보기', note: '목록에서 제목을 누르면 열리는 상세. 답변대기와 답변완료에서 쓸 수 있는 버튼이 다릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '답변은 고객이 쓴 글 바로 아래에 구분되는 띠(왼쪽 굵은 선)로 붙이고, 답변 안에서 다음 행동(교환 신청 등)으로 바로 넘어가는 링크를 줄 수 있게 합니다. 답변이 달리면 고객에게 알림톡(실패 시 문자)과 고른 경우 이메일이 가고, 상세를 열면 목록의 새 답변 배지가 사라집니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '답변완료 뒤에는 수정·삭제가 없고 추가 문의만 있습니다. 추가 문의는 원래 문의·연결 주문·분류를 그대로 이어받아 운영자가 앞뒤 사정을 다시 묻지 않게 하고, 한 문의에 이어진 대화로 쌓입니다. 답변대기 상세는 수정·삭제가 있고 답변 예정 안내가 답변 자리에 나옵니다.'),
    Canvas({ label: 'U-20 · 답변완료 문의 상세 · 내 글 + 사진 + 연결한 주문 + 운영자 답변 · 추가 문의 버튼' }, MypageLayout({ active: '문의', title: '1:1 문의' },
        Q_DONE, OrderLink('20261103-000052', `${O1} · 2개`, '배송완료'), A_DONE,
        `<div class="wf-btnrow between">${Btn('목록으로', { icon: 'list' })}<span>${Btn('추가 문의', { kind: 'primary', icon: 'pen-o' })}</span></div>`)),
    Canvas({ label: 'U-20 · 답변대기 문의 상세 · 수정·삭제 가능 · 답변 자리엔 예정 안내' }, MypageLayout({ active: '문의', title: '1:1 문의' },
        `<div class="u20-q">${QHead(W, '배송', '배송이 언제 출발하나요?', '2026-11-11 09:50 작성', '<span>알림톡으로 답변 알림 받음</span>')}<div class="bd">11월 9일에 주문했는데 아직 배송준비 상태입니다. 이번 주 안에 받을 수 있을까요?</div></div>`,
        OrderLink('20261109-000104', `${O4} · 1개`, '배송준비'),
        Box({ flat: true }, Text(`${Icon('clock-o')} <b>답변을 준비하고 있습니다.</b> 평일 10:00 ~ 17:00 에 순서대로 답변드리며, 답변이 달리면 알림톡으로 알려 드립니다.`)),
        `<div class="wf-btnrow between">${Btn('목록으로', { icon: 'list' })}<span>${Btn('삭제')} ${Btn('수정', 'primary')}</span></div>`)),
    Canvas({ label: 'U-20 · 추가 문의 버튼 → 아래에 입력칸이 펼쳐짐 · 이어진 대화(추가 문의 → 추가 답변)' }, MypageLayout({ active: '문의', title: '1:1 문의' },
        Q_DONE, A_DONE,
        `<div class="u20-q"><div class="hd"><div class="meta">${Badge('추가 문의', 'line')}<span>2026-11-07 13:40 작성</span></div></div><div class="bd">교환 신청했습니다. 수거는 며칠쯤 걸리나요? 집에 사람이 없는 날이 많습니다.</div></div>`,
        `<div class="u20-a"><div class="who">${Icon('reply')}이너에라 고객센터 <span>2026-11-07 15:12 답변</span></div>신청 다음 영업일에 CJ대한통운 기사님이 방문합니다. 부재 시 문 앞에 두셔도 수거하니 상자 겉면에 "반품"이라고 적어 문 앞에 두시면 됩니다.</div>`,
        Box({ title: '추가 문의 쓰기', sub: '분류 취소·반품·교환 · 주문 20261103-000052 에 이어서 등록됩니다' },
            Textarea({ placeholder: '더 궁금한 점을 적어 주세요.', h: 100, count: '0 / 2,000' }),
            Flex({ align: 'center', justify: 'space-between', mt: 10 }, Btn('사진 첨부 (0 / 5)', { icon: 'camera-o', size: 'sm' }), `<span>${Btn('취소', { size: 'sm' })} ${Btn('추가 문의 등록', { kind: 'primary', size: 'sm', disabled: true })}</span>`)))),
    Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 답변 보기' }, MobilePage({ title: '1:1 문의', tab: false, bottom: [Btn('목록으로'), Btn('추가 문의', 'primary')] },
        Q_DONE, A_DONE)),
);

const PQ = (o) => `<div class="u20-pq"><div class="row">${o.st}${o.secret ? Icon('lock-o') : ''}<span>${o.title}</span><span class="sp"></span><small>${o.date}</small>${Icon(o.open ? 'angle-up-min' : 'angle-down-min')}</div><div class="row" style="margin-top:6px"><small>${P}</small></div>${o.open ? `<div class="open">${o.open}</div>` : ''}</div>`;

const state4 = StateBlock({ idx: 4, title: '상품 문의 목록', note: '상품 상세의 문의 탭에서 내가 남긴 글만 모아 봅니다. 새 상품 문의는 상품 상세에서 씁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품 문의는 다른 고객도 보는 공개 게시판이라 1:1 문의와 탭을 나눕니다. 비밀글은 자물쇠로 표시하고, 상품 상세에서는 다른 사람에게 "비밀글입니다"로만 보이지만 여기서는 본인이라 내용이 그대로 펼쳐집니다. 초기값: 비밀글 체크 켬(관리자 고객응대 설정에서 초기값과 비밀글 허용 여부를 바꿈).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '답변대기 글만 수정·삭제할 수 있습니다. 주문·배송처럼 개인 사정이 담긴 질문을 공개 게시판에 쓰지 않도록 작성 팝업 맨 위에 "주문·배송 문의는 1:1 문의로" 안내를 둡니다. 상품 문의 기능을 끈 몰은 이 탭과 상품 상세의 문의 탭이 함께 없습니다.'),
    Canvas({ label: 'U-20 · 상품 문의 탭 · 답변완료 비밀글(펼침) · 답변대기 공개글(펼침, 수정·삭제)' }, MypageLayout({ active: '문의', title: '문의' },
        TOP('상품 문의'),
        ListHead({ left: Chips(['전체 2', '답변대기 1', '답변완료 1'], '전체 2'), right: Text('상품 문의는 상품 화면의 문의 탭에서 남길 수 있습니다. <u>상품 보러 가기</u>', { sm: true, mute: true }) }),
        PQ({ st: W, title: '하루에 두 포 먹어도 되나요?', date: '2026-11-10', open: `<div class="u20-q" style="margin-bottom:10px"><div class="bd">운동하는 날은 두 포 먹고 싶은데 괜찮은지 궁금합니다.</div></div><div class="wf-btnrow right">${Btn('삭제', { size: 'sm' })}${Btn('수정', { size: 'sm' })}</div>` }),
        PQ({ st: D, secret: true, title: '유통기한이 얼마나 남은 상품이 오나요?', date: '2026-10-18', open: `<div class="u20-q" style="margin-bottom:10px"><div class="bd">선물용으로 4박스를 사려고 합니다. 받는 날 기준으로 유통기한이 얼마나 남아 있는지 알려 주세요.</div></div><div class="u20-a"><div class="who">${Icon('reply')}이너에라 고객센터 <span>2026-10-19 11:30 답변</span></div>현재 출고 상품은 제조일로부터 18개월 중 15개월 이상 남은 상품입니다. 선물용으로 넉넉히 쓰실 수 있습니다.</div>` }),
        Pager({ page: 1, last: 1 }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '수정 버튼 → 상품 문의 수정 팝업(상품 상세의 작성 팝업과 같은 모양)', right: '팝업만', pad: 20 },
            Modal({ title: '상품 문의 수정', w: 520, foot: [Btn('취소'), Btn('수정 내용 저장', 'primary')] },
                Note('<span>주문·배송·교환처럼 내 주문에 관한 문의는 <u>1:1 문의</u>로 남겨 주세요. 이 글은 다른 고객에게도 보입니다.</span>'),
                Box({ flat: true }, `<div class="wf-prow">${Thumb(48)}<div class="pi"><b>${P}</b><span>문의할 상품</span></div></div>`),
                Field({ label: '제목', required: true }, Input({ value: '하루에 두 포 먹어도 되나요?' })),
                Field({ label: '문의 내용', required: true }, Textarea({ value: '운동하는 날은 두 포 먹고 싶은데 괜찮은지 궁금합니다.', h: 96, count: '31 / 1,000' })),
                Flex({ gap: 20, wrap: true }, Check(`${Icon('lock-o')} 비밀글로 남기기`), Check('답변 알림 받기 (알림톡 010-****-1234)', { on: true })))),
        Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 상품 문의 목록' }, MobilePage({ title: '문의', tab: false },
            TOP('상품 문의'),
            PQ({ st: W, title: '하루에 두 포 먹어도 되나요?', date: '11-10' }),
            PQ({ st: D, secret: true, title: '유통기한이 얼마나 남은 상품이 오나요?', date: '10-18', open: `<div class="u20-a" style="margin-bottom:0"><div class="who">${Icon('reply')}이너에라 고객센터</div>현재 출고 상품은 제조일로부터 18개월 중 15개월 이상 남은 상품입니다.</div>` }))),
    ),
);

const state5 = StateBlock({ idx: 5, title: '없음', note: '탭마다, 그리고 걸러 보기 결과가 없을 때 문구가 다릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '문의가 없는 고객에게는 문의 버튼과 함께 자주 묻는 질문 바로 가기를 먼저 권합니다. 문의 전에 스스로 답을 찾으면 운영자 일이 줄어듭니다. 고객센터 운영 시간과 전화번호는 관리자 설정 > 쇼핑몰 정보 값이 그대로 나옵니다.'),
    Canvas({ label: 'U-20 · 1:1 문의 없음' }, MypageLayout({ active: '문의', title: '문의' },
        TOP('1:1 문의', { a: 0, b: 0 }),
        Empty({ icon: 'message-o', title: '남기신 1:1 문의가 없습니다', desc: '궁금한 점은 자주 묻는 질문에서 먼저 찾아보세요. 평일 10:00 ~ 17:00 에 답변드립니다.', action: [Btn('자주 묻는 질문 보기'), Btn('1:1 문의하기', { kind: 'primary', icon: 'pen-o' })] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '상품 문의 없음', right: '본문만', pad: 20 }, `<div style="width:520px">${TOP('상품 문의', { a: 4, b: 0 })}${Empty({ icon: 'forum-o', title: '남기신 상품 문의가 없습니다', desc: '상품 문의는 상품 화면의 문의 탭에서 남길 수 있습니다.', action: Btn('상품 보러 가기') })}</div>`),
        Canvas({ size: 'auto', label: '답변대기만 보기 · 결과 없음', right: '본문만', pad: 20 }, `<div style="width:520px">${TOP('1:1 문의', { a: 2 })}${Chips(['전체 2', '답변대기 0', '답변완료 2'], '답변대기 0')}${Empty({ icon: 'check-circle-o', title: '답변을 기다리는 문의가 없습니다', desc: '모든 문의에 답변이 달렸습니다.', action: Btn('전체 문의 보기') })}</div>`),
        Canvas({ size: 'mobile', label: 'U-20 · 모바일 · 없음' }, MobilePage({ title: '문의', tab: false, bottom: [Btn('1:1 문의하기', { kind: 'primary', icon: 'pen-o' })] },
            TOP('1:1 문의', { a: 0, b: 0 }),
            Empty({ icon: 'message-o', title: '남기신 1:1 문의가 없습니다', desc: '궁금한 점은 자주 묻는 질문에서 먼저 찾아보세요.', action: Btn('자주 묻는 질문 보기') }))),
    ),
);

export default function U20() {
    return [state1, state2, state3, state4, state5].join('');
}
