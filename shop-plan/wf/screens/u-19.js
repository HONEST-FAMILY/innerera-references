import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, BtnRow, Badge, OrderBadge, Tabs, Textarea, Field, Check,
    Overlay, Modal, Confirm, Toast, Empty, Upload, Box, Note, Text, Icon, Flex, Stars, Thumb, Pager, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const [O1, O2] = SHOP.options.map((o) => o.name);

const STYLE = `<style>
.u19-item { display:flex; gap:16px; align-items:center; border:1px solid var(--line); border-radius:6px; padding:16px; margin-bottom:12px; background:#fff; }
.u19-item.off { background:var(--box); color:var(--mute); }
.u19-item .info { flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; font-size:13px; }
.u19-item .info b { font-size:14px; }
.u19-item .info span { color:var(--mute); font-size:12.5px; }
.u19-item .side { flex:none; display:flex; flex-direction:column; align-items:flex-end; gap:6px; font-size:12.5px; color:var(--mute); }
.u19-m .u19-item { flex-wrap:wrap; padding:14px; gap:12px; }
.u19-m .u19-item .side { width:100%; flex-direction:row; justify-content:space-between; align-items:center; }
.u19-band { display:flex; align-items:center; gap:10px; border:1px solid var(--line); border-radius:6px; background:var(--box); padding:12px 16px; margin-bottom:16px; font-size:13px; }
.u19-band i { font-size:20px; }
.u19-star { display:flex; align-items:center; gap:14px; }
.u19-star .big { display:inline-flex; gap:4px; font-size:34px; }
.u19-star em { font-style:normal; font-size:13.5px; color:var(--ink2); }
.u19-photos { display:flex; gap:8px; flex-wrap:wrap; }
.u19-ph { position:relative; }
.u19-ph .x { position:absolute; right:-6px; top:-6px; width:18px; height:18px; border-radius:50%; background:var(--dark); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; }
.u19-add { width:72px; height:72px; border:1px dashed var(--line); border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; font-size:11.5px; color:var(--mute); }
.u19-add i { font-size:20px; }
.u19-rv { border:1px solid var(--line); border-radius:6px; padding:18px; margin-bottom:14px; background:#fff; }
.u19-rv .top { display:flex; flex-wrap:wrap; align-items:center; gap:10px; font-size:12.5px; color:var(--mute); margin-bottom:10px; }
.u19-rv .top .sp { flex:1; }
.u19-rv .body { font-size:13.5px; line-height:1.7; margin:10px 0 12px; }
.u19-reply { margin-top:14px; border-left:3px solid var(--dark); background:var(--box); padding:12px 14px; font-size:13px; line-height:1.7; }
.u19-reply b { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
.u19-reply b span { font-weight:400; color:var(--mute); font-size:12px; }
</style>`;

const TABS = (active, a = 3, b = 3) => Tabs([{ t: '작성 가능한 리뷰', n: a }, { t: '작성한 리뷰', n: b }], active);

const Band = () => `<div class="u19-band">${Icon('gift-o')}<div><b>리뷰를 쓰면 적립금을 드립니다</b> · 사진 리뷰 1,000원 · 글 리뷰 500원(예시)<br><span style="color:var(--mute);font-size:12.5px">운영자 확인 뒤 영업일 3일 안에 지급됩니다. 상품과 관계없는 글·사진은 지급되지 않습니다.</span></div></div>`;

const Item = (o) => `<div class="u19-item${o.off ? ' off' : ''}">${Thumb(72)}<div class="info"><b>${P}</b><span>${o.opt}</span><span>주문번호 ${o.no} · ${o.when}</span></div><div class="side"><span>${o.badge || ''} ${o.due}</span>${o.btn}</div></div>`;

const ITEMS = [
    { no: '20260815-000412', opt: `${O1} · 1개`, when: '구매확정 2026-08-20', badge: Badge('7일 남음', 'warn'), due: '2026-11-18까지 작성 가능', btn: Btn('리뷰 쓰기', { kind: 'primary', size: 'sm', icon: 'pen-o' }) },
    { no: '20261103-000052', opt: `${O1} · 2개`, when: '배송완료 2026-11-05', badge: OrderBadge('배송완료'), due: '2027-02-03까지 작성 가능', btn: Btn('리뷰 쓰기', { kind: 'primary', size: 'sm', icon: 'pen-o' }) },
    { no: '20260912-000233', opt: `${O2} · 1개`, when: '구매확정 2026-09-20', badge: '', due: '2026-12-19까지 작성 가능', btn: Btn('리뷰 쓰기', { kind: 'primary', size: 'sm', icon: 'pen-o' }) },
];
const EXPIRED = { off: true, no: '20260610-000097', opt: `${O1} · 1개`, when: '구매확정 2026-06-16', badge: Badge('작성 기간 종료', 'strike'), due: '2026-09-14에 끝남', btn: Btn('리뷰 쓰기', { size: 'sm', disabled: true }) };

const ListBody = (band = true) => [
    TABS('작성 가능한 리뷰'),
    band && Band(),
    ITEMS.map(Item),
    Flex({ align: 'center', justify: 'space-between', mt: 20 }, Text('<b>작성 기간이 지난 상품 1</b>', {}), Text(`접기 ${Icon('angle-up-min')}`, { sm: true, mute: true })),
    Item(EXPIRED),
    Note('리뷰는 배송완료 또는 구매확정 뒤 90일 안에 쓸 수 있습니다. 배송완료 상태에서 리뷰를 쓰면 구매확정도 함께 처리됩니다.'),
];

const state1 = StateBlock({ idx: 1, title: '작성 가능한 상품', note: '배송완료·구매확정된 품목 중 아직 리뷰를 쓰지 않은 것. 주문이 아니라 품목마다 한 줄씩 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '리뷰는 받은 직후에 가장 많이 씁니다. 그래서 작성 기한이 가까운 순으로 세우고 남은 날짜를 배지로 보여 줍니다. 초기값: 작성 기한 90일 · 사진 리뷰 1,000원 · 글 리뷰 500원 — 관리자 혜택 > 적립금 정책과 고객응대 > 리뷰 설정에서 운영자가 바꿉니다. 기한이 지난 상품은 지우지 않고 아래에 접어 두어 왜 못 쓰는지 알게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '배송완료 상태에서 리뷰를 쓰면 구매확정이 함께 되어 그 뒤로는 반품·교환 신청을 못 합니다. 리뷰 쓰기를 누르는 순간 이 사실을 확인 팝업으로 한 번 묻습니다. 적립금 기능을 끈 몰은 적립 안내 띠와 폼 안의 적립 문구가 통째로 없습니다.'),
    Canvas({ label: 'U-19 · 작성 가능한 리뷰 탭 · 적립금 켠 몰(기한 임박 · 배송완료 · 일반 · 기간 종료)' }, STYLE, MypageLayout({ active: '리뷰', title: '리뷰', cart: 1 }, ListBody())),
    CanvasRow(
        Canvas({ size: 'auto', label: '배송완료 품목에서 리뷰 쓰기 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 400, title: '리뷰를 쓰면 구매확정됩니다', desc: '주문 20261103-000052 은 아직 구매확정 전입니다.<br>리뷰를 등록하면 구매확정이 함께 처리되고, 그 뒤에는 반품·교환을 신청할 수 없습니다.', ok: '확인하고 리뷰 쓰기' })),
        Canvas({ size: 'mobile', label: 'U-19 · 모바일 · 작성 가능한 리뷰' }, `<div class="u19-m">${MobilePage({ title: '리뷰', tab: '마이' },
            TABS('작성 가능한 리뷰'), Band(), ITEMS.slice(0, 2).map(Item), Item(EXPIRED))}</div>`),
    ),
    Canvas({ label: 'U-19 · 적립금·쿠폰을 끈 몰 — 적립 안내 띠 없음, 왼쪽 메뉴에 나의 혜택 없음' }, MypageLayout({ active: '리뷰', title: '리뷰', hideBenefit: true },
        TABS('작성 가능한 리뷰'), ITEMS.slice(0, 2).map(Item),
        Note('리뷰는 배송완료 또는 구매확정 뒤 90일 안에 쓸 수 있습니다. 배송완료 상태에서 리뷰를 쓰면 구매확정도 함께 처리됩니다.'))),
);

const StarPick = (n, label) => `<div class="u19-star"><span class="big">${Array.from({ length: 5 }, (_, i) => Icon(i < n ? 'star' : 'star-o')).join('')}</span><em>${label}</em></div>`;
const Photos = (n, o = {}) => `<div class="u19-photos">${Array.from({ length: n }, (_, i) => `<span class="u19-ph">${Thumb(72, i === 0 ? '대표' : '')}<span class="x">${Icon('close-min')}</span></span>`).join('')}${n < 5 ? `<span class="u19-add">${Icon('camera-o')}${n} / 5</span>` : ''}</div>${o.help === false ? '' : ''}`;
const PHOTO_HELP = 'JPG · PNG · 한 장에 10MB 이하 · 최대 5장 · 첫 사진이 대표 사진(끌어서 순서 바꾸기). 권장 1000 × 1000 px 이상, 올리면 자동으로 줄여 저장합니다.';
const Target = (opt = `${O2} · 1개`, no = '20260912-000233') => Box({ flat: true }, `<div class="wf-prow">${Thumb(56)}<div class="pi"><b>${P}</b><span>구매한 구성: ${opt}</span><span>주문번호 ${no}</span></div></div>`);

const FormEmpty = (point = true) => [
    Target(),
    Field({ label: '별점', required: true }, StarPick(0, '별을 눌러 점수를 주세요')),
    Field({ label: '리뷰 내용', required: true, help: '10자 이상 1,000자까지 쓸 수 있습니다.' }, Textarea({ placeholder: '맛, 먹기 편한 정도, 포장 상태 등 써 보신 느낌을 알려 주세요.', h: 120, count: '0 / 1,000' })),
    Field({ label: '사진', help: PHOTO_HELP }, Photos(0)),
    point && Note('사진을 1장 이상 올리면 1,000원, 글만 쓰면 500원이 적립됩니다(예시). 운영자 확인 뒤 영업일 3일 안에 지급됩니다.'),
];

const FormFilled = () => [
    Target(),
    Field({ label: '별점', required: true }, StarPick(5, '5점 · 아주 좋아요')),
    Field({ label: '리뷰 내용', required: true }, Textarea({ value: '아침에 물 없이 한 포씩 먹기 좋아요. 석류 맛이 진한데 달지 않아서 2주째 빠뜨리지 않고 먹고 있습니다. 낱개 포장이라 가방에 넣어 다니기도 편합니다.', h: 120, count: '86 / 1,000' })),
    Field({ label: '사진', help: PHOTO_HELP }, Photos(3)),
    Note('사진 리뷰로 등록됩니다. 확인 뒤 1,000원이 적립됩니다(예시).'),
];

const FormError = () => [
    Target(),
    Field({ label: '별점', required: true, error: '별점을 선택해 주세요.' }, StarPick(0, '별을 눌러 점수를 주세요')),
    Field({ label: '리뷰 내용', required: true, error: '리뷰는 10자 이상 써 주세요. 지금 4자입니다.' }, Textarea({ value: '좋아요!', h: 96, count: '4 / 1,000', error: true })),
    Field({ label: '사진' },
        Photos(1),
        Upload({ button: false, title: '올리지 못한 사진 2장', icon: 'error-o', files: [
            { name: 'IMG_2291.HEIC', size: '3.1MB', icon: 'image-o', error: 'JPG · PNG 사진만 올릴 수 있습니다' },
            { name: 'IMG_2304.jpg', size: '14.2MB', icon: 'image-o', error: '한 장에 10MB 이하만 올릴 수 있습니다' },
        ] })),
];

const FOOT = (on) => [Btn('취소'), Btn('리뷰 등록', { kind: 'primary', disabled: !on })];

const state2 = StateBlock({ idx: 2, title: '작성 폼(별점·사진·글, 포토 적립 안내)', note: '리뷰 쓰기를 누르면 PC 는 팝업, 모바일은 한 화면으로 열립니다. 어떤 구성을 샀는지는 고객이 고르지 않고 주문에서 자동으로 붙습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '입력은 별점과 글 두 가지만 필수로 두어 30초 안에 끝나게 합니다. 구매한 구성(1박스·2박스)은 상품 상세 리뷰 목록에 그대로 표시되어 다른 고객이 참고합니다. 자산 규격: 사진 JPG · PNG, 한 장에 10MB 이하, 최대 5장, 권장 1000 × 1000 px 이상(서버에서 긴 변 1600 px 로 줄여 저장). 글 10 ~ 1,000자. 최소 글자 수와 최대 장수는 관리자 리뷰 설정값입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '등록 버튼은 별점과 10자 이상 글이 모두 채워져야 켜집니다. 사진 올리기에 실패한 파일은 조용히 빼지 않고 파일 이름과 이유를 보여 줍니다. 적립금을 끈 몰은 적립 문구만 빠지고 나머지는 같습니다.'),
    Canvas({ label: 'U-19 · 리뷰 쓰기 버튼 → 팝업 · 빈값(등록 버튼 꺼짐)' }, Overlay({ bg: MypageLayout({ active: '리뷰', title: '리뷰' }, ListBody()), h: 820 },
        Modal({ title: '리뷰 쓰기', w: 600, foot: FOOT(false) }, FormEmpty()))),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력됨 · 별 5개 · 사진 3장(등록 버튼 켜짐)', right: '팝업만', pad: 20 }, Modal({ title: '리뷰 쓰기', w: 560, foot: FOOT(true) }, FormFilled())),
        Canvas({ size: 'auto', label: '입력 오류 · 별점 없음 · 글자 수 모자람 · 사진 형식·용량 초과', right: '팝업만', pad: 20 }, Modal({ title: '리뷰 쓰기', w: 560, foot: FOOT(false) }, FormError())),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '적립금을 끈 몰 · 적립 안내 없음', right: '팝업만', pad: 20 }, Modal({ title: '리뷰 쓰기', w: 520, foot: FOOT(false) }, FormEmpty(false))),
        Canvas({ size: 'auto', label: '사진 5장을 다 채웠을 때 · 추가 칸 사라짐', right: '부분', pad: 20 }, `<div style="width:460px">${Field({ label: '사진', help: '최대 5장까지 올렸습니다. 바꾸려면 사진을 지우고 다시 올리세요.' }, Photos(5))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-19 · 모바일 · 작성 폼(한 화면, 아래 고정 버튼)' }, MobilePage({ title: '리뷰 쓰기', tab: false, right: '', bottom: [Btn('리뷰 등록', { kind: 'primary' })] }, FormFilled())),
        Canvas({ size: 'mobile', label: 'U-19 · 모바일 · 사진 칸을 누름 → 고르기 시트' }, Overlay({ bg: MobilePage({ title: '리뷰 쓰기', tab: false, right: '' }, FormEmpty()), align: 'bottom', h: 720 },
            `<div class="wf-sheet"><div class="grip"></div><div class="mb">${['사진 찍기', '앨범에서 고르기 (최대 5장)'].map((t, i) => `<div style="display:flex;align-items:center;gap:10px;padding:14px 4px;border-bottom:1px solid var(--line2);font-size:15px">${Icon(i ? 'image-o' : 'camera-o')}${t}</div>`).join('')}<div style="padding:14px 4px;font-size:15px;color:var(--mute)">취소</div></div></div>`)),
        Canvas({ size: 'mobile', label: 'U-19 · 모바일 · 등록 완료 토스트 → 작성한 리뷰 탭' }, Overlay({ bg: MobilePage({ title: '리뷰', tab: '마이' }, TABS('작성한 리뷰', 2, 3)), dim: false, align: 'toast-bottom', h: 720 },
            Toast('리뷰를 등록했습니다. 확인 뒤 1,000원이 적립됩니다.'))),
    ),
);

const Review = (o) => `<div class="u19-rv"><div class="wf-prow">${Thumb(48)}<div class="pi"><b>${P}</b><span>${o.opt} · 주문번호 ${o.no}</span></div></div>
<div class="top" style="margin-top:12px">${Stars(o.star)}<span>${o.date}</span>${o.badges || ''}<span class="sp"></span>${o.acts === false ? '' : `${Btn('수정', { size: 'sm' })}${Btn('삭제', { size: 'sm' })}`}</div>
<div class="body">${o.text}</div>${o.photos ? `<div class="u19-photos">${Array.from({ length: o.photos }, () => Thumb(72)).join('')}</div>` : ''}
${o.reply ? `<div class="u19-reply"><b>${Icon('reply')}이너에라 고객센터 <span>${o.replyAt}</span></b>${o.reply}</div>` : ''}${o.foot || ''}</div>`;

const RV1 = { opt: `${O2} · 1개`, no: '20261020-000311', star: 5, date: '2026-11-10 작성', badges: `${Badge('사진 리뷰', 'line')}${Badge('적립 1,000원 지급 예정', 'dash')}`, photos: 3,
    text: '아침에 물 없이 한 포씩 먹기 좋아요. 석류 맛이 진한데 달지 않아서 2주째 빠뜨리지 않고 먹고 있습니다. 낱개 포장이라 가방에 넣어 다니기도 편합니다.' };
const RV2 = { opt: `${O1} · 1개`, no: '20260722-000188', star: 4, date: '2026-08-22 작성 · 2026-08-23 수정', badges: `${Badge('글 리뷰', 'line')}${Badge('적립 500원 지급 완료', 'check')}`,
    text: '맛은 만족합니다. 다만 상자가 조금 눌려서 왔어요. 내용물은 멀쩡했습니다.',
    reply: '김민지 님, 소중한 후기 감사합니다. 상자가 눌려 도착한 점 죄송합니다. 포장 완충재를 보강했고, 다음 주문에 쓰실 수 있는 쿠폰을 넣어 드렸습니다.', replyAt: '2026-08-24 10:12' };
const RV3 = { opt: `${O1} · 1개`, no: '20260610-000097', star: 3, date: '2026-06-20 작성', badges: `${Badge('숨김 처리됨', 'x')}`, acts: false,
    text: '다른 쇼핑몰 주소가 들어 있어 운영 정책에 따라 숨김 처리된 리뷰입니다.',
    foot: Note('이 리뷰는 상품 화면에 보이지 않습니다. 사유: 다른 쇼핑몰 홍보 문구 포함. 내용을 고치고 싶으면 1:1 문의로 알려 주세요.', { warn: true }) };

const WrittenBody = () => [TABS('작성한 리뷰', 3, 3), Review(RV1), Review(RV2), Review(RV3), Pager({ page: 1, last: 1 })];

const state3 = StateBlock({ idx: 3, title: '작성한 리뷰', note: '내가 쓴 리뷰와 적립 상태, 운영자 답글을 모아 봅니다. 여기서 고치고 지웁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '리뷰마다 적립금이 지급 예정인지 지급됐는지 배지로 보여 주어 "적립금 언제 들어오나요" 문의를 줄입니다. 운영자 답글(관리자 고객응대 > 리뷰에서 작성)은 리뷰 바로 아래에 붙고, 답글이 달리면 고객에게 알림이 갑니다. 운영자가 숨긴 리뷰는 목록에 남기고 사유를 알려 줍니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '삭제하면 이미 받은 리뷰 적립금이 회수되고, 같은 품목의 리뷰는 다시 쓸 수 없습니다(적립금 반복 수령 방지). 사진을 모두 지워 글 리뷰로 바뀌면 차액 400원이 회수됩니다. 회수할 적립금을 이미 썼으면 보유 적립금이 0원 아래로 내려가지 않게 남은 만큼만 회수합니다 — 이 규칙은 삭제 확인 팝업에 문장으로 적습니다.'),
    Canvas({ label: 'U-19 · 작성한 리뷰 탭 · 사진 리뷰(지급 예정) · 글 리뷰 + 운영자 답글(지급 완료) · 숨김 처리된 리뷰' }, MypageLayout({ active: '리뷰', title: '리뷰' }, WrittenBody())),
    CanvasRow(
        Canvas({ size: 'auto', label: '수정 버튼 → 수정 팝업(쓴 내용이 채워져 열림)', right: '팝업만', pad: 20 },
            Modal({ title: '리뷰 수정', w: 560, foot: [Btn('취소'), Btn('수정 내용 저장', 'primary')] },
                Target(`${O2} · 1개`, '20261020-000311'),
                Field({ label: '별점', required: true }, StarPick(5, '5점 · 아주 좋아요')),
                Field({ label: '리뷰 내용', required: true }, Textarea({ value: RV1.text, h: 110, count: '86 / 1,000' })),
                Field({ label: '사진', help: PHOTO_HELP }, Photos(3)),
                Note('사진을 모두 지우면 글 리뷰로 바뀌어 적립금이 1,000원에서 500원으로 줄어듭니다.', { warn: true }))),
        `<div>${Canvas({ size: 'auto', label: '삭제 버튼 → 확인 팝업 · 적립금 지급된 리뷰', right: '팝업만', pad: 20 },
            Confirm({ w: 400, danger: true, title: '이 리뷰를 삭제할까요?', desc: '삭제하면 되돌릴 수 없고, 이 상품의 리뷰는 다시 쓸 수 없습니다.<br><b>받은 적립금 500원이 회수됩니다.</b> 보유 적립금이 모자라면 남은 만큼만 회수됩니다.', ok: '삭제하고 500원 반납' }))}
        ${Canvas({ size: 'auto', label: '삭제 확인 팝업 · 적립금을 끈 몰 또는 아직 지급 전', right: '팝업만', pad: 20 },
            Confirm({ w: 400, danger: true, title: '이 리뷰를 삭제할까요?', desc: '삭제하면 되돌릴 수 없고, 이 상품의 리뷰는 다시 쓸 수 없습니다.', ok: '삭제' }))}</div>`,
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '수정 저장 완료', right: '토스트만', pad: 20 }, Toast('리뷰를 수정했습니다.')),
        Canvas({ size: 'auto', label: '삭제 완료', right: '토스트만', pad: 20 }, Toast('리뷰를 삭제했습니다. 적립금 500원이 회수되었습니다.', { action: '적립금 내역 보기' })),
        Canvas({ size: 'auto', label: '사진을 눌렀을 때 · 크게 보기', right: '팝업만', pad: 20 }, Modal({ title: '사진 1 / 3', w: 420 },
            `<div class="wf-img" style="height:360px">${Icon('image-o')}<span>리뷰 사진 원본 비율 그대로 · 좌우로 넘기기</span></div>`, Flex({ justify: 'space-between', mt: 10 }, Text(`${Icon('angle-left')} 이전`, { sm: true }), Text(`다음 ${Icon('angle-right')}`, { sm: true })))),
    ),
    Canvas({ size: 'mobile', label: 'U-19 · 모바일 · 작성한 리뷰' }, MobilePage({ title: '리뷰', tab: '마이' }, TABS('작성한 리뷰', 3, 3), Review({ ...RV2 }))),
);

const state4 = StateBlock({ idx: 4, title: '없음', note: '탭마다 빈 상태가 다릅니다. 문구 + 다음 행동 버튼을 함께 둡니다.' },
    Anno({ title: '왜 이렇게 하나' }, '쓸 수 있는 리뷰가 없는 이유는 두 가지(아직 받은 상품이 없음 / 이미 다 씀)라서 문장을 나눕니다. 리뷰 기능을 끈 몰(관리자 설정 > 기능 켜고 끄기)은 이 화면과 마이페이지의 리뷰 메뉴, 상품 상세의 리뷰 탭, 상단 메뉴의 리뷰가 함께 사라지고 주소로 직접 들어오면 마이페이지 홈으로 보냅니다.'),
    Canvas({ label: 'U-19 · 작성 가능한 리뷰 없음 · 아직 배송완료된 상품이 없는 회원' }, MypageLayout({ active: '리뷰', title: '리뷰' },
        TABS('작성 가능한 리뷰', 0, 0), Band(),
        Empty({ icon: 'pen-o', title: '지금 쓸 수 있는 리뷰가 없습니다', desc: '상품을 받으신 뒤 90일 안에 리뷰를 쓸 수 있습니다.', action: [Btn('주문 목록 보기'), Btn('상품 보러 가기', 'primary')] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '작성 가능한 리뷰 없음 · 받은 상품의 리뷰를 모두 쓴 회원', right: '본문만', pad: 20 }, `<div style="width:520px">${TABS('작성 가능한 리뷰', 0, 3)}${Empty({ icon: 'check-circle-o', title: '받으신 상품의 리뷰를 모두 쓰셨습니다', desc: '소중한 후기 감사합니다.', action: Btn('작성한 리뷰 보기') })}</div>`),
        Canvas({ size: 'auto', label: '작성한 리뷰 없음', right: '본문만', pad: 20 }, `<div style="width:520px">${TABS('작성한 리뷰', 3, 0)}${Empty({ icon: 'star-o', title: '아직 작성한 리뷰가 없습니다', desc: '쓸 수 있는 리뷰가 3개 있습니다.', action: Btn('리뷰 쓰러 가기', 'primary') })}</div>`),
    ),
    Canvas({ size: 'mobile', label: 'U-19 · 모바일 · 없음' }, MobilePage({ title: '리뷰', tab: '마이' }, TABS('작성 가능한 리뷰', 0, 0),
        Empty({ icon: 'pen-o', title: '지금 쓸 수 있는 리뷰가 없습니다', desc: '상품을 받으신 뒤 90일 안에 리뷰를 쓸 수 있습니다.', action: '상품 보러 가기' }))),
);

export default function U19() {
    return [state1, state2, state3, state4].join('');
}
