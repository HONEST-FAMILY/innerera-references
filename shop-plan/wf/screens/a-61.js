import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Chip, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle, Tabs,
    Textarea, FormTable, Overlay, Modal, Confirm, Toast, Upload, ImageGuide, Box, Note, Text, Icon, Flex, Grid, Img, Empty, DragRow, Table,
    UserHeader, UserFooter, MobilePage, ProductCard, ProductGrid, SHOP,
} from '../lib/blocks.js';

const TYPES = [
    { t: '첫 배너 슬라이드', i: 'image-o', d: '화면 맨 위 큰 이미지. 여러 장이 자동으로 넘어갑니다.', spec: 'PC 1920 × 800 · 모바일 750 × 900' },
    { t: '상품 진열', i: 'apps', d: '고른 상품을 한 줄에 2~5개씩 카드로 보여 줍니다.', spec: '이미지 없음 (상품 대표 이미지 사용)' },
    { t: '띠 배너', i: 'minus', d: '배경색 위에 한두 줄 문구와 버튼. 구역 사이를 끊어 줍니다.', spec: '이미지 없음 또는 배경 1920 × 360' },
    { t: '이미지+글', i: 'layout-o', d: '사진과 글을 나란히. 좌우 배치나 여러 장 카드로 씁니다.', spec: '장면 이미지 800 × 1000 (4:5)' },
    { t: '원료/특징 카드', i: 'view-list', d: '번호·이름·설명이 붙은 카드 묶음. 원료·특징·사용 순서 소개용.', spec: '카드 이미지 600 × 600 (1:1)' },
    { t: '후기 모음', i: 'star-o', d: '별점 높은 포토 리뷰를 자동으로 모아 보여 줍니다.', spec: '이미지 없음 (리뷰 사진 사용)' },
    { t: '인증 배너', i: 'shield-checked-o', d: '인증 마크와 설명을 가로로 나열합니다.', spec: '마크 240 × 240 (배경 투명 PNG · SVG)' },
    { t: '여백', i: 'arrows-v', d: '블록 사이 간격을 띄웁니다.', spec: '높이만 지정' },
];
const typeIcon = (t) => (TYPES.find((x) => x.t === t) || {}).i || 'layout-o';

const BLOCKS = [
    { type: '첫 배너 슬라이드', name: '하루 한 포, 롱제비티 젤리스틱', sub: '슬라이드 2장 · 5초마다 넘김', period: '계속', dev: 'PC · 모바일', on: true },
    { type: '원료/특징 카드', name: 'Formula · 하루 한 포에 담은 다섯 가지 핵심 원료', sub: '카드 5장 · 작은 번호 카드', period: '계속', dev: 'PC · 모바일', on: true },
    { type: '원료/특징 카드', name: 'Ingredients · 한 포 안에, 다섯 가지가 다 들어 있어요', sub: '카드 5장 · 큰 이미지 카드 · 버튼 원료 이야기 보러가기', period: '계속', dev: 'PC · 모바일', on: true },
    { type: '띠 배너', name: '5가지 핵심 원료, 하루 한 포로 간편하게', sub: '버튼 제품 살펴보기 → 상품', period: '계속', dev: 'PC · 모바일', on: true },
    { type: '띠 배너', name: '블랙프라이데이 2박스 구성 특가', sub: '버튼 지금 구매하기 → 상품', period: '11-23 00:00 ~ 11-30 23:59', dev: 'PC · 모바일', on: true, status: '예약' },
    { type: '이미지+글', name: 'Daily Ritual · 일상의 다섯 장면, 하루 한 포', sub: '장면 5장 · 가로로 넘기는 카드', period: '계속', dev: 'PC · 모바일', on: true },
    { type: '상품 진열', name: '나에게 맞는 구성', sub: '상품 1개 · 구성 3개를 카드로 펼침 · 한 줄 3개', period: '계속', dev: 'PC · 모바일', on: true },
    { type: '후기 모음', name: '먼저 드셔 본 분들의 이야기', sub: '포토 리뷰 8개 · 별점 4점 이상', period: '계속', dev: 'PC · 모바일', on: false },
    { type: '인증 배너', name: 'GIP-01 특허원료 · HACCP 인증', sub: '마크 2개 · 버튼 원칙 살펴보기', period: '계속', dev: 'PC 만', on: true },
    { type: '띠 배너', name: '추석 선물 세트 사전 예약', sub: '버튼 선물 세트 보기', period: '09-01 ~ 09-20', dev: 'PC · 모바일', on: true, status: '종료' },
];

const statusBadge = (b) => (b.status === '예약' ? Badge('예약 · 11-23 시작', 'dash') : b.status === '종료' ? Badge('기간 종료', 'strike') : b.on ? Badge('노출 중', 'check') : Badge('꺼짐', 'mute'));

const blockRow = (b, o = {}) => DragRow({ off: !b.on || b.status === '종료', right: [
    `<span style="width:170px;font-size:12px;color:var(--ink2)">${Icon('calendar')} ${b.period}</span>`,
    `<span style="width:86px;font-size:12px;color:var(--ink2)">${Icon(b.dev === 'PC 만' ? 'desktop' : 'mobile')} ${b.dev}</span>`,
    `<span style="width:112px">${statusBadge(b)}</span>`,
    Toggle('', { on: b.on }),
    Btn('편집', { size: 'sm' }),
    `<span style="font-size:18px;color:var(--ink2)">${Icon('ellipsis-v')}</span>`,
] }, `<div style="display:flex;gap:10px;align-items:center${o.drag ? ';font-weight:700' : ''}"><span style="flex:none;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:4px;font-size:17px;background:var(--box)">${Icon(typeIcon(b.type))}</span><div style="min-width:0"><div style="font-size:11.5px;color:var(--mute)">${b.type}</div><div style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.name}</div><div style="font-size:11.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.sub}</div></div></div>`);

const HeadActions = (o = {}) => [Btn('미리보기', { icon: 'eye-o' }), Btn('블록 추가', { icon: 'plus' }), Btn(o.dirty ? '변경 2건 게시' : '게시됨', { kind: 'primary', disabled: !o.dirty })];
const Page = (o, ...body) => AdminLayout({ active: 'a-61', desc: '블록을 위에서 아래 순서대로 쌓아 메인 화면을 만듭니다. 고친 내용은 게시를 눌러야 고객에게 보입니다.', actions: HeadActions(o), ...o }, body);

const ListTop = (o = {}) => Flex({ justify: 'space-between', align: 'center' },
    Text(o.dirty ? `${Icon('info-o')} 게시하지 않은 변경 <b>2건</b> · 순서 바꿈 1 · 블록 추가 1 <u>변경 취소</u>` : `${Icon('check-circle-o')} 고객에게 보이는 화면과 같습니다 · 마지막 게시 2026-11-10 16:22 운영자 이보림`, { sm: true }),
    Flex({ gap: 8, align: 'center' }, Check('기간 종료·꺼진 블록도 보기', { on: true }), Btn('게시 기록', { size: 'sm', icon: 'time-o' })),
);

const FixedRow = (label, where) => `<div class="wf-dragrow off" style="border-style:dashed">${Icon('lock-o')}<div class="dc" style="font-size:13px"><b>${label}</b> <span style="font-size:12px">· 고정 영역 · ${where}에서 관리</span></div>${Btn('바로 가기', { size: 'sm', iconRight: 'angle-right-min' })}</div>`;

const BlockList = (o = {}) => [
    ListTop(o),
    FixedRow('상단 띠 · 머리(로고·메뉴)', '디자인 > 사이트 기본 · 메뉴'),
    (o.rows || BLOCKS).map((b) => blockRow(b)),
    `<div style="border:1.5px dashed var(--line);border-radius:4px;padding:12px;text-align:center;font-size:13px;color:var(--ink2);margin-bottom:6px">${Icon('plus')} 블록 추가</div>`,
    FixedRow('바닥글(사업자 정보·링크)', '설정 > 쇼핑몰 정보 · 디자인 > 메뉴'),
];

const MoreMenu = `<div style="width:190px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:6px 0;font-size:13px">${[['pen-o', '편집'], ['calendar', '노출 기간 정하기'], ['documents-o', '복제'], ['angle-up', '맨 위로'], ['angle-down', '맨 아래로'], ['trash-o', '삭제']].map(([i, t]) => `<div style="padding:8px 14px;display:flex;gap:8px;align-items:center">${Icon(i)}${t}</div>`).join('')}</div>`;

const Cal = (o = {}) => {
    const cells = [...Array(o.start || 0).fill(0), ...Array.from({ length: 30 }, (_, i) => i + 1)];
    const cell = (d) => {
        if (!d) return '<span></span>';
        const edge = d === o.from || d === o.to;
        const mid = o.from && o.to && d > o.from && d < o.to;
        const s = edge ? 'background:var(--dark);color:#fff;font-weight:700;border-radius:4px' : mid ? 'background:var(--fill)' : d < 11 ? 'color:#b9b9c0;text-decoration:line-through' : d === 11 ? 'border:1px solid var(--dark);border-radius:4px' : '';
        return `<span style="height:30px;line-height:30px;${s}">${d}</span>`;
    };
    return `<div style="width:264px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:12px;font-size:12.5px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">${Icon('angle-left-min')}<b>2026년 11월</b>${Icon('angle-right-min')}</div><div style="display:grid;grid-template-columns:repeat(7,34px);text-align:center;row-gap:2px">${['일', '월', '화', '수', '목', '금', '토'].map((d) => `<span style="color:var(--mute);height:26px">${d}</span>`).join('')}${cells.map(cell).join('')}</div><div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line2);font-size:11.5px;color:var(--mute);line-height:1.7">테두리 = 오늘(11) · 줄 그은 날 = 지난 날(고를 수 없음)<br>채운 칸 = 시작일·종료일 · 옅은 칸 = 노출 기간</div></div>`;
};

const periodModal = Modal({ title: '노출 기간 정하기 · 블랙프라이데이 2박스 구성 특가', w: 620, foot: [Btn('취소'), Btn('기간 저장', 'primary')] },
    FormTable([
        { k: '노출 기간', v: RadioGroup(['계속 노출', '기간 정하기'], '기간 정하기') },
        { k: '시작', required: true, v: [Input({ value: '2026-11-23 (월)', icon: 'calendar', w: 180, focus: true }), Select({ value: '00:00', w: 100 })] },
        { k: '종료', required: true, v: [Input({ value: '2026-11-30 (월)', icon: 'calendar', w: 180 }), Select({ value: '23:59', w: 100 })], help: '종료 시각이 지나면 블록이 자동으로 내려가고 목록에 기간 종료로 남습니다.' },
    ]),
    Flex({ gap: 16, mt: 12, align: 'flex-start' }, Cal({ from: 23, to: 30 }), `<div style="width:120px;border:1px solid var(--line);border-radius:6px;font-size:12.5px;padding:6px 0">${['00:00', '06:00', '09:00', '10:00', '12:00', '18:00', '23:59'].map((t, i) => `<div style="padding:6px 12px${i === 0 ? ';background:var(--fill);font-weight:700' : ''}">${t}</div>`).join('')}<div style="padding:6px 12px;color:var(--mute)">직접 입력</div></div>`),
);

const state1 = StateBlock({ idx: 1, title: '블록 목록(드래그 순서·켜고 끄기·노출 기간)', note: '디자인 > 메인 화면 구성의 첫 모습. 메인 화면에 쌓인 블록이 위에서 아래 순서 그대로 한 줄씩 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '메인 화면은 시즌·행사마다 바뀝니다. 블록 한 줄 = 화면의 한 구역이라 줄을 끌어 순서를 바꾸고, 스위치로 잠깐 내리고, 기간을 걸어 두면 행사 날 새벽에 사람이 없어도 올라갔다 내려옵니다. 이너에라 시안(shop-1)의 구역을 그대로 블록으로 옮겨 두었습니다. 다음 고객사는 블록 내용만 바꿔 씁니다.'),
    Anno({ warn: true, title: '관리자가 바꿀 수 있는 범위 · 초기값' }, '운영자는 블록의 순서·켜고 끄기·기간·기기·내용(이미지·문구·링크·상품)을 바꿉니다. 블록의 생김새(글꼴·간격·배치 방식)는 디자인 시안으로 고정이고 블록 종류 8가지 밖의 새 구역은 개발이 필요합니다. 고친 내용은 바로 반영되지 않고 게시를 눌러야 고객에게 보입니다(실수로 반쯤 고친 화면이 나가지 않게). 상단 띠·머리·바닥글은 블록이 아니라 고정 영역입니다.'),
    Canvas({ label: 'A-61 · 블록 목록 · 게시된 상태 (노출 중 · 예약 · 꺼짐 · 기간 종료 · PC 만)' }, Page({}, BlockList())),
    Canvas({ label: 'A-61 · 블록을 끌어 옮기는 중 (상품 진열을 위로) → 놓으면 게시하지 않은 변경으로 쌓임' }, Page({ dirty: true },
        ListTop({ dirty: true }),
        blockRow(BLOCKS[0]),
        `<div style="border:2px dashed var(--dark);border-radius:4px;height:56px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:12.5px;color:var(--ink2)">여기에 놓기</div>`,
        `<div style="margin:0 0 6px 28px;box-shadow:0 6px 18px rgba(0,0,0,.18);border:2px solid var(--dark);border-radius:4px">${blockRow(BLOCKS[6], { drag: true }).replace('margin-bottom:6px', '')}</div>`,
        BLOCKS.slice(1, 4).map((b) => blockRow(b)),
        Note('끌기 어려운 긴 목록은 줄 오른쪽 점 세 개 메뉴의 맨 위로 · 맨 아래로를 쓰거나, 키보드 위아래 화살표로 한 칸씩 옮깁니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '줄 오른쪽 점 세 개 → 메뉴', right: '부분', pad: 20 }, MoreMenu),
        Canvas({ size: 'auto', label: '메뉴 → 노출 기간 정하기 팝업 (시작일 달력 · 시각 목록 열림)', right: '팝업만', pad: 20 }, periodModal),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '스위치를 끌 때 (바로 꺼지지 않고 게시 때 반영)', right: '토스트만', pad: 20 }, Toast('후기 모음 블록을 껐습니다. 게시를 누르면 메인 화면에서 내려갑니다.', { action: '되돌리기' })),
        Canvas({ size: 'auto', label: '메뉴 → 삭제', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '추석 선물 세트 사전 예약 블록을 삭제할까요?', desc: '블록에 넣은 문구와 링크가 함께 지워집니다. 잠깐 내리는 것이면 삭제 대신 스위치를 끄세요. 삭제한 블록은 게시 기록에서 30일 동안 되살릴 수 있습니다.', ok: '삭제', danger: true })),
    ),
    Canvas({ label: 'A-61 · 변경 2건 게시 버튼 → 확인 팝업' }, Overlay({ bg: Page({ dirty: true }, BlockList({ dirty: true })), h: 460 },
        Modal({ title: '메인 화면에 게시', w: 520, foot: [Btn('취소'), Btn('미리보기', { icon: 'eye-o' }), Btn('지금 게시', 'primary')] },
            Text('아래 변경이 고객에게 바로 보이게 됩니다.', { b: true }),
            Table({ dense: true, cols: [{ t: '변경', w: 90 }, '블록'], rows: [['순서 바꿈', '상품 진열 · 나에게 맞는 구성 — 7번째 → 2번째'], ['블록 추가', '띠 배너 · 블랙프라이데이 2박스 구성 특가 (11-23 시작 예약)']] }),
            Note('게시 뒤에도 게시 기록에서 이전 화면으로 되돌릴 수 있습니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '게시 완료', right: '토스트만', pad: 20 }, Toast('메인 화면에 게시했습니다.', { action: '내 쇼핑몰 보기' })),
        Canvas({ size: 'auto', label: '게시 기록 버튼 → 이전 화면으로 되돌리기', right: '팝업만', pad: 20 }, Modal({ title: '게시 기록', w: 620, foot: [Btn('닫기')] },
            Table({ dense: true, cols: [{ t: '게시 일시', w: 130 }, { t: '운영자', w: 80 }, '바뀐 내용', { t: '', w: 150 }], rows: [
                ['2026-11-10 16:22', '이보림', '첫 배너 슬라이드 2번째 장 문구 수정', Badge('지금 화면', 'check')],
                ['2026-11-06 11:05', '윤서연', '인증 배너 추가 · 후기 모음 끔', `${Btn('보기', { size: 'sm' })} ${Btn('이때로 되돌리기', { size: 'sm' })}`],
                ['2026-11-02 09:40', '이보림', '처음 구성 (블록 7개)', `${Btn('보기', { size: 'sm' })} ${Btn('이때로 되돌리기', { size: 'sm' })}`],
            ] }),
        )),
    ),
    Canvas({ label: 'A-61 · 설치 직후 빈 상태 (블록 없음)' }, Page({}, FixedRow('상단 띠 · 머리(로고·메뉴)', '디자인 > 사이트 기본 · 메뉴'), Empty({ icon: 'layout-o', title: '아직 메인 화면에 블록이 없습니다', desc: '블록을 추가해 메인 화면을 만들어 보세요. 블록이 없으면 고객에게는 전체 상품 목록이 메인 화면 대신 나옵니다.', action: [Btn('블록 추가', { kind: 'primary', icon: 'plus' }), Btn('기본 구성으로 시작 (첫 배너 · 상품 진열 · 띠 배너)')] }), FixedRow('바닥글(사업자 정보·링크)', '설정 > 쇼핑몰 정보 · 디자인 > 메뉴'))),
);

const typeCard = (x, o = {}) => `<div style="border:${o.on ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:14px;background:${o.disabled ? 'var(--box)' : '#fff'};${o.disabled ? 'color:var(--mute);' : ''}position:relative"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:22px">${Icon(x.i)}</span><b style="font-size:14px">${x.t}</b>${o.on ? `<span style="margin-left:auto">${Icon('check-circle-o')}</span>` : ''}</div><div style="height:54px;border:1px dashed var(--line);border-radius:4px;background:var(--box);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--mute);margin-bottom:8px">블록 생김새 축소 그림</div><div style="font-size:12.5px;line-height:1.5;min-height:38px">${x.d}</div><div style="font-size:11.5px;color:var(--mute);margin-top:6px">${Icon('image-o')} ${x.spec}</div>${o.disabled ? `<div style="margin-top:8px">${Badge(o.disabled, 'warn')}</div>` : ''}</div>`;

const addModal = (pick, o = {}) => Modal({ title: '블록 추가 · 종류 고르기', w: 920, foot: [Btn('취소'), Btn(pick ? `${pick} 블록 만들기` : '종류를 고르세요', { kind: 'primary', disabled: !pick })] },
    Text('어떤 구역을 넣을지 고르세요. 만든 뒤 목록 맨 아래에 꺼진 상태로 추가되고, 내용을 채운 뒤 켜면 됩니다.', { sm: true, mute: true }),
    Grid(4, TYPES.map((x) => typeCard(x, { on: x.t === pick, disabled: o.reviewOff && x.t === '후기 모음' ? '리뷰 기능이 꺼져 있음' : false }))),
    o.reviewOff ? Note('후기 모음은 설정 > 기능 켜고 끄기에서 리뷰를 켜야 쓸 수 있습니다. <u>기능 켜고 끄기로 가기</u>') : Note('같은 종류를 여러 개 넣을 수 있습니다(예: 띠 배너 2개). 첫 배너 슬라이드만 화면에 1개입니다.'),
);

const state2 = StateBlock({ idx: 2, title: '블록 추가 팝업(종류 고르기)', note: '블록 추가 버튼을 누르면 뜨는 팝업. 종류 카드 8개 중 하나를 고르면 그 종류의 편집 화면으로 넘어갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '운영자는 블록 이름만 보고는 어떤 모양인지 모릅니다. 종류마다 축소 그림·한 줄 설명·필요한 이미지 크기를 카드에 같이 보여 줘서, 고르기 전에 준비할 이미지를 알 수 있게 합니다.'),
    Anno({ warn: true, title: '유형별 분기' }, '기능이 꺼져 있어 쓸 수 없는 종류(리뷰를 끈 몰의 후기 모음)는 카드를 흐리게 하고 이유와 켜는 곳을 알려 줍니다. 첫 배너 슬라이드는 이미 1개가 있으면 고를 수 없습니다.'),
    Canvas({ label: 'A-61 · 블록 추가 버튼 → 종류 고르기 팝업 (고르기 전)' }, Overlay({ bg: Page({}, BlockList()), h: 760 }, addModal(''))),
    Canvas({ size: 'auto', label: '띠 배너를 고른 모습 → 만들기 버튼 활성', right: '팝업만', pad: 20 }, addModal('띠 배너')),
    Canvas({ size: 'auto', label: '리뷰 기능을 끈 몰 — 후기 모음 카드 비활성', right: '팝업만', pad: 20 }, addModal('', { reviewOff: true })),
);

const commonRows = (name, o = {}) => [
    { k: '블록 이름', required: true, v: Input({ value: name, w: 420 }), help: '관리자 목록에서만 보이는 이름입니다. 고객에게는 안 보입니다.' },
    { k: '노출 기간', v: [RadioGroup(['계속 노출', '기간 정하기'], o.period ? '기간 정하기' : '계속 노출'), o.period ? [Input({ value: '2026-11-23 00:00', icon: 'calendar', w: 170 }), '~', Input({ value: '2026-11-30 23:59', icon: 'calendar', w: 170 })] : ''] },
    { k: '노출 기기', v: CheckGroup(['PC', '모바일'], o.pcOnly ? ['PC'] : ['PC', '모바일']), help: '둘 다 끄면 저장할 수 없습니다.' },
    { k: '위아래 간격', v: RadioGroup(['좁게', '보통', '넓게'], '보통') },
];

const LinkPick = (kind, target, o = {}) => [Select({ value: kind, w: 150, open: o.openKind, options: o.openKind ? [{ t: '상품', on: true }, '카테고리', '콘텐츠 페이지', '기획전', '게시판', '외부 주소', '이동 없음'] : undefined }), o.openKind ? '' : (kind === '외부 주소' ? Input({ value: target, w: 300 }) : Select({ value: target, w: 300 })), kind === '외부 주소' ? Check('새 창으로 열기', { on: true }) : ''];

const SLIDE_PC = ImageGuide({ size: '1920 × 800 px', ratio: '12:5', max: '2MB 이하', ext: 'JPG · PNG · WEBP', more: ['글자는 이미지에 넣지 말고 아래 입력칸에 넣으세요(검색·모바일에서 읽힘)', '가운데 1280 px 안에 주요 피사체를 두세요. 넓은 화면에서 좌우가 더 보입니다'] });
const SLIDE_M = ImageGuide({ size: '750 × 900 px', ratio: '5:6', max: '1MB 이하', ext: 'JPG · PNG · WEBP', more: ['안 올리면 PC 이미지 가운데를 잘라 씁니다'] });

const slideTab = (i, t, on, extra = '') => `<div style="display:flex;align-items:center;gap:8px;border:${on ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:4px;padding:8px;margin-bottom:6px;font-size:12.5px;background:#fff">${Icon('drag-vertical')}${Img({ w: 64, h: 28 })}<div style="min-width:0;flex:1"><b>${i}장</b> ${extra}<div style="color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t}</div></div>${Icon('trash-o')}</div>`;

const slideForm = (o = {}) => `<div style="display:grid;grid-template-columns:230px minmax(0,1fr);gap:16px"><div>${Text('슬라이드 장 (끌어서 순서 바꾸기)', { sm: true, b: true })}${slideTab(1, '하루 한 포, 롱제비티 젤리스틱', true)}${slideTab(2, '5가지 핵심 원료로 설계한 프리미엄 롱제비티 데일리 포뮬러', false)}${o.third ? slideTab(3, '이미지 없음', false, Badge('미완성', 'warn')) : ''}<div style="border:1.5px dashed var(--line);border-radius:4px;padding:9px;text-align:center;font-size:12.5px;color:var(--ink2)">${Icon('plus')} 장 추가 (최대 8장)</div>${Divider2()}${FormTableMini([['자동 넘김', Select({ value: '5초마다', w: 120 })], ['넘김 방식', Select({ value: '옆으로 밀기', w: 120 })]])}</div><div>${Text('1장 내용', { b: true })}${Grid(2,
    Upload({ title: 'PC 이미지', button: '파일 바꾸기', guide: SLIDE_PC, files: o.imgError ? [{ name: 'hero_main.png', size: '6.8MB · 1200 × 500', error: '용량이 2MB 를 넘고 가로가 1920 px 보다 작습니다. 흐리게 보일 수 있어 올릴 수 없습니다.' }] : [{ name: 'hero_pomegranate_pc.jpg', size: '412KB · 1920 × 800', icon: 'image-o' }] }),
    Upload({ title: '모바일 이미지', button: '파일 바꾸기', guide: SLIDE_M, files: [{ name: 'hero_pomegranate_m.jpg', size: '188KB · 750 × 900', icon: 'image-o' }] }),
)}<div style="height:12px"></div>${FormTable([
    { k: '작은 글', v: Input({ value: 'Pomegranate · 20 g × 14', w: 360 }), help: '큰 글 위에 작게 들어갑니다. 비워 두면 안 나옵니다. 30자까지.' },
    { k: '큰 글', required: true, v: Textarea({ value: '하루 한 포,<br>롱제비티 젤리스틱', h: 60, count: '17 / 40' }), help: '줄을 바꾼 곳에서 화면에서도 줄이 바뀝니다. 2줄까지.' },
    { k: '버튼 문구', v: Input({ value: '제품 살펴보기', w: 220 }), help: '비워 두면 버튼 없이 이미지 전체가 링크가 됩니다. 12자까지.' },
    { k: '누르면 이동', v: LinkPick('상품', '이너에라 롱지비티 석류맛 젤리스틱'), error: o.linkError ? '연결한 상품이 판매중지 상태입니다. 다른 상품을 고르거나 이동 없음으로 바꿔 주세요.' : undefined },
    { k: '글자 위치 · 색', v: [Select({ value: '왼쪽 가운데', w: 140 }), RadioGroup(['어두운 글자', '밝은 글자'], '어두운 글자')], help: '이미지가 어두우면 밝은 글자를 고르세요.' },
    { k: '대체 글', v: Input({ value: '석류 원물과 이너에라 롱지비티 젤리스틱 상자', w: 420 }), help: '이미지가 안 보이는 환경과 검색 엔진에 읽히는 설명입니다.' },
])}</div></div>`;

const Divider2 = () => '<div style="height:14px"></div>';
const FormTableMini = (rows) => `<div style="font-size:12.5px">${rows.map(([k, v]) => `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><span>${k}</span>${v}</div>`).join('')}</div>`;

const EditModal = (type, title, w, ...body) => Modal({ title: `블록 편집 · ${type}`, w, foot: [Btn('취소'), Btn('미리보기', { icon: 'eye-o' }), Btn('저장', 'primary')] }, body);

const pickList = `<span class="wf-select-open" style="width:520px"><span class="wf-input select focus" style="width:520px"><span class="v">젤리</span>${Icon('angle-up-min')}</span><span class="wf-select-list"><span class="wf-select-search">${Icon('search')}젤리</span><ul><li class="on">이너에라 롱지비티 석류맛 젤리스틱 20 g × 14포<em>판매중 · 재고 1,240 · 49,000원(예시)</em>${Icon('check-min')}</li><li>이너에라 롱지비티 선물 세트 (젤리스틱 2박스 + 쇼핑백)<em>판매중 · 재고 86 · 96,000원(예시)</em></li><li class="disabled">이너에라 롱지비티 체험 3포<em>판매중지 · 고를 수 없음</em></li><li class="disabled">이너에라 젤리스틱 레몬맛 (출시 예정)<em>전시 안 함 · 고를 수 없음</em></li></ul></span></span>`;

const productForm = (o = {}) => FormTable([
    { k: '제목', v: Input({ value: '나에게 맞는 구성', w: 360 }), help: '비워 두면 제목 없이 상품만 나옵니다.' },
    { k: '설명', v: Input({ value: '하루 한 포 기준', w: 360 }) },
    { k: '상품 고르는 방법', v: RadioGroup(['직접 고르기', '카테고리의 상품 자동', '많이 팔린 순 자동', '새로 등록한 순 자동'], o.auto ? '카테고리의 상품 자동' : '직접 고르기') },
    o.auto
        ? { k: '카테고리 · 개수', v: [Select({ value: '젤리스틱', w: 200 }), Select({ value: '8개까지', w: 120 }), Select({ value: '판매량 많은 순', w: 160 })], help: '카테고리에 상품을 추가하면 이 블록에도 자동으로 나옵니다. 품절·판매중지 상품은 빠집니다.' }
        : { k: '상품', required: true, v: [o.open ? pickList : Input({ placeholder: '상품명·상품코드로 찾기', icon: 'search', w: 520 }), o.open ? '' : `<div style="width:100%">${DragRow({ right: [Badge('판매중', 'check'), Icon('close-min')] }, `<b style="font-size:13px">${SHOP.product}</b> <span style="font-size:12px;color:var(--mute)">구성 3개 · 49,000원(예시)부터</span>`)}</div>`], help: '끌어서 진열 순서를 바꿉니다. 판매중·전시 중인 상품만 고를 수 있고, 나중에 품절되면 품절 표시와 함께 맨 뒤로 갑니다.' },
    { k: '보여 주는 단위', v: RadioGroup(['상품 1개 = 카드 1장', '구성(옵션)마다 카드 1장'], '구성(옵션)마다 카드 1장'), help: '상품이 1개뿐인 몰은 구성마다 카드를 펼쳐 1박스 · 2박스 · 4박스를 나란히 보여 줍니다.' },
    { k: '한 줄 개수', v: [Text('PC', { sm: true }), Select({ value: '3개', w: 90 }), Text('모바일', { sm: true }), Select({ value: '1개 (옆으로 넘김)', w: 170 })] },
    { k: '카드에 표시', v: CheckGroup(['할인율', '리뷰 수·별점', '무료배송 배지', '장바구니 버튼'], ['리뷰 수·별점', '무료배송 배지']) },
    { k: '더 보기 버튼', v: [Input({ value: '', placeholder: '예: 전체 상품 보기', w: 200 }), ...LinkPick('이동 없음', '')] },
]);

const bandForm = FormTable([
    { k: '문구', required: true, v: Textarea({ value: '5가지 핵심 원료,<br>하루 한 포로 간편하게', h: 60, count: '22 / 60' }) },
    { k: '작은 글', v: Input({ placeholder: '문구 위에 작게 (선택)', w: 360 }) },
    { k: '배경', v: [RadioGroup(['색', '이미지'], '색'), `<span style="display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 10px;border:1px solid var(--line);border-radius:4px;font-size:12.5px"><span style="width:20px;height:20px;border-radius:3px;background:var(--dark)"></span>대표색 #7A1F2B</span>`, Btn('색 고르기', { size: 'sm', icon: 'palette' })], help: '이미지를 고르면 1920 × 360 px(모바일 750 × 400), 1MB 이하 JPG · PNG · WEBP 를 올립니다.' },
    { k: '글자색', v: RadioGroup(['밝은 글자', '어두운 글자'], '밝은 글자') },
    { k: '버튼 문구', v: Input({ value: '제품 살펴보기', w: 220 }) },
    { k: '누르면 이동', v: LinkPick('상품', '이너에라 롱지비티 석류맛 젤리스틱') },
    { k: '높이', v: RadioGroup(['낮게 (한 줄 띠)', '보통', '높게'], '보통') },
]);

const cardItem = (n, a, b, c) => DragRow({ right: [Btn('고치기', { size: 'sm' }), Icon('trash-o')] }, `<div style="display:flex;gap:10px;align-items:center">${Img({ w: 40, h: 40 })}<div style="font-size:12.5px"><b>${n} ${a}</b><div style="color:var(--mute)">${b} · ${c}</div></div></div>`);

const cardForm = [
    FormTable([
        { k: '작은 제목 · 제목', v: [Input({ value: 'Ingredients', w: 160 }), Input({ value: '한 포 안에, 다섯 가지가 다 들어 있어요', w: 340 })] },
        { k: '카드 모양', v: RadioGroup(['작은 번호 카드 (한 줄 5개)', '큰 이미지 카드 (옆으로 넘김)'], '큰 이미지 카드 (옆으로 넘김)') },
        { k: '버튼', v: [Input({ value: '원료 이야기 보러가기', w: 200 }), ...LinkPick('콘텐츠 페이지', '원료 이야기 (/pages/ingredients)')] },
        { k: '아래 작은 글', v: Input({ value: '*상기 내용은 제품이 아닌 원료에 대한 정보입니다.', w: 460 }), help: '식품 표시·광고 관련 안내 문구를 넣는 자리입니다.' },
    ]),
    Text('카드 (끌어서 순서 바꾸기 · 2~10장)', { b: true }),
    cardItem('01', '알파리포산', 'Alpha-Lipoic Acid · 시금치·브로콜리에 미량 들어 있는 성분', '꼬리표 에너지 대사 연구'),
    cardItem('02', '글루타치온', 'Glutathione · 세 가지 아미노산이 이어진 성분', '꼬리표 이너뷰티 루틴'),
    cardItem('03', '커큐민', 'Curcumin · 강황의 노란색을 내는 주요 성분', '꼬리표 강황 유래'),
    cardItem('04', '퀘르세틴', 'Quercetin · 양파 껍질·사과에 들어 있는 식물 성분', '꼬리표 GIP-01 특허원료'),
    cardItem('05', 'NMN', 'Nicotinamide Mononucleotide · 효모 발효로 얻은 원료', '꼬리표 효모 발효 유래'),
    Btn('카드 추가', { icon: 'plus', size: 'sm' }),
];

const cardEdit = Modal({ title: '카드 고치기 · 04 퀘르세틴', w: 560, foot: [Btn('취소'), Btn('카드 저장', 'primary')] },
    FormTable([
        { k: '이미지', v: Upload({ title: '카드 이미지', button: '파일 바꾸기', guide: ImageGuide({ size: '600 × 600 px', ratio: '1:1', max: '500KB 이하' }), files: [{ name: 'ing_quercetin.jpg', size: '96KB · 600 × 600', icon: 'image-o' }] }) },
        { k: '번호', v: [Check('번호 자동 (01, 02 …)', { on: true })] },
        { k: '이름', required: true, v: Input({ value: '퀘르세틴', w: 240 }) },
        { k: '영문·보조 이름', v: Input({ value: 'Quercetin', w: 240 }) },
        { k: '설명', v: Textarea({ value: '양파 껍질·사과에 들어 있는 식물 성분', h: 56, count: '20 / 60' }) },
        { k: '꼬리표', v: Input({ value: 'GIP-01 특허원료', w: 240 }), help: '카드 아래 작은 표시. 비워 두면 안 나옵니다.' },
    ]),
);

const imgTextForm = [
    FormTable([
        { k: '작은 제목 · 제목', v: [Input({ value: 'Daily Ritual', w: 160 }), Input({ value: '일상의 다섯 장면, 하루 한 포', w: 340 })] },
        { k: '배치', v: RadioGroup(['이미지 왼쪽 + 글 오른쪽', '이미지 오른쪽 + 글 왼쪽', '여러 장 카드 (옆으로 넘김)'], '여러 장 카드 (옆으로 넘김)'), help: '좌우 배치는 장면 1장만, 여러 장 카드는 2~8장을 넣습니다. 모바일에서는 좌우 배치가 위아래로 바뀝니다.' },
    ]),
    Text('장면 (끌어서 순서 바꾸기)', { b: true }),
    cardItem('', '아침, 하루를 열며', '무엇부터 챙길지 막막한 날', '나에게 필요한 데일리 루틴부터.'),
    cardItem('', '육아 틈틈이', '나를 돌볼 여유가 없던 날', '미뤄왔던 나를 위한 시간, 매일 간편하게.'),
    cardItem('', '야근 사이', '바쁜 하루의 작은 습관', '습관 하나쯤은 놓치고 싶지 않으니까.'),
    cardItem('', '거울 앞에서', '매일의 이너뷰티 루틴', '겉모습뿐 아니라 매일의 루틴까지.'),
    cardItem('', '외출 가방 속', '나만의 롱제비티 라이프', '더 늦기 전에, 오늘부터 꾸준히.'),
    Btn('장면 추가', { icon: 'plus', size: 'sm' }),
    Note('장면 이미지 800 × 1000 px (4:5) · 1MB 이하 · JPG · PNG · WEBP. 장면마다 작은 글 · 제목 · 설명 · 누르면 이동을 넣습니다.'),
];

const imgTextSingle = FormTable([
    { k: '배치', v: RadioGroup(['이미지 왼쪽 + 글 오른쪽', '이미지 오른쪽 + 글 왼쪽', '여러 장 카드 (옆으로 넘김)'], '이미지 왼쪽 + 글 오른쪽') },
    { k: '이미지', required: true, v: Upload({ title: '이미지 고르기', guide: ImageGuide({ size: '1200 × 900 px', ratio: '4:3', max: '1MB 이하' }) }), error: '이미지를 올려 주세요. 좌우 배치는 이미지가 꼭 있어야 합니다.' },
    { k: '제목', required: true, v: Input({ value: '원료를 고르는 원칙', w: 360 }) },
    { k: '글', v: Textarea({ value: '패키지에 표기된 그대로, 원료의 출처와 함량을 숨기지 않습니다.', h: 72, count: '34 / 300' }) },
    { k: '버튼', v: [Input({ value: '브랜드 이야기 보기', w: 180 }), ...LinkPick('콘텐츠 페이지', '브랜드 이야기 (/pages/brand)')] },
]);

const reviewForm = FormTable([
    { k: '제목', v: Input({ value: '먼저 드셔 본 분들의 이야기', w: 360 }) },
    { k: '모으는 기준', v: [RadioGroup(['자동', '베스트로 지정한 리뷰만'], '자동'), Select({ value: '별점 4점 이상', w: 150 }), Check('사진 있는 리뷰만', { on: true })], help: '고객응대 > 리뷰에서 숨긴 리뷰는 나오지 않습니다. 베스트 지정도 그 화면에서 합니다.' },
    { k: '상품', v: Select({ value: '전체 상품', w: 300 }) },
    { k: '개수 · 모양', v: [Select({ value: '8개', w: 90 }), RadioGroup(['카드 옆으로 넘김', '바둑판'], '카드 옆으로 넘김')] },
    { k: '표시', v: CheckGroup(['별점', '작성자(가운데 가림 김*지)', '구매한 구성', '작성일'], ['별점', '작성자(가운데 가림 김*지)', '구매한 구성']) },
    { k: '리뷰가 모자랄 때', v: RadioGroup(['3개 미만이면 블록 숨기기', '있는 만큼만 보여 주기'], '3개 미만이면 블록 숨기기'), help: '지금 조건에 맞는 리뷰 0개 — 켜도 리뷰가 3개 쌓일 때까지 화면에 안 나옵니다.' },
]);

const certForm = [
    FormTable([
        { k: '제목 · 설명', v: [Input({ value: 'GIP-01 특허원료 · HACCP 인증', w: 280 }), Input({ value: '패키지에 표기된 그대로', w: 220 })] },
        { k: '버튼', v: [Input({ value: '원칙 살펴보기', w: 160 }), ...LinkPick('콘텐츠 페이지', '브랜드 이야기 (/pages/brand)')] },
    ]),
    Text('인증 마크 (2~6개)', { b: true }),
    cardItem('', 'HACCP 안전관리인증', '식품의약품안전처', 'haccp_mark.svg · 240 × 240'),
    cardItem('', 'GIP-01 특허원료 사용', '특허 제10-2951534호', 'gip01_mark.png · 240 × 240'),
    Btn('마크 추가', { icon: 'plus', size: 'sm' }),
    Note('인증 마크는 발급 기관이 준 원본 파일을 그대로 올리세요(색·비율을 바꾸면 안 되는 마크가 많습니다). 240 × 240 px 이상 · 배경 투명 PNG 또는 SVG · 500KB 이하.', { warn: true }),
];

const spaceForm = FormTable([
    { k: '높이', v: [Text('PC', { sm: true }), Input({ value: '120', suffix: 'px', w: 110 }), Text('모바일', { sm: true }), Input({ value: '64', suffix: 'px', w: 110 })], help: '0 ~ 300 px. 모바일을 비우면 PC 값의 절반을 씁니다.' },
    { k: '구분선', v: Check('가운데에 가는 선 넣기') },
]);

const state3 = StateBlock({ idx: 3, title: '블록 편집(종류별 입력칸 분기)', note: '목록에서 편집을 누르거나 블록을 새로 만들면 열리는 편집 화면. 블록 종류 8가지마다 입력칸이 다릅니다. 아래에 8가지를 모두 그렸습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '블록 종류마다 넣을 것이 다릅니다: 슬라이드는 장마다 PC·모바일 이미지 두 장과 글·버튼·링크, 상품 진열은 상품 고르기와 한 줄 개수, 띠 배너는 배경색·문구·링크. 한 폼에 모든 칸을 넣고 안 쓰는 칸을 비워 두게 하면 운영자가 헷갈리므로 종류에 맞는 칸만 보여 줍니다. 블록 이름·노출 기간·기기·간격은 모든 종류에 공통입니다.'),
    Anno({ warn: true, title: '자산 규격 · 링크' }, '이미지 칸마다 권장 크기·비율·용량·확장자를 칸 바로 아래에 적고, 규격에 안 맞으면 올리는 순간 이유를 알려 줍니다. 이동 대상은 주소를 손으로 치지 않고 종류(상품·카테고리·콘텐츠 페이지·기획전·게시판·외부 주소)를 고른 뒤 이름으로 찾아 고릅니다. 연결한 상품이 판매중지되면 편집 화면과 목록에 경고가 뜹니다.'),
    Canvas({ label: 'A-61 · 첫 배너 슬라이드 편집 (장마다 PC 1920 × 800 · 모바일 750 × 900 + 작은 글 · 큰 글 · 버튼 문구 · 링크)' }, Overlay({ bg: Page({}, BlockList()), h: 1180 },
        EditModal('첫 배너 슬라이드', '', 1040, slideForm(), Divider2(), FormTable(commonRows('하루 한 포, 롱제비티 젤리스틱'))))),
    Canvas({ size: 'auto', label: '슬라이드 · 이미지 규격 오류 + 연결 상품 판매중지 + 미완성 장', right: '팝업만', pad: 20 }, EditModal('첫 배너 슬라이드', '', 1040, Note('3장은 이미지가 없어 저장해도 화면에 나오지 않습니다.', { warn: true }), slideForm({ imgError: true, linkError: true, third: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '누르면 이동 · 종류 목록을 연 모습', right: '부분', pad: 20 }, `<div style="width:520px;min-height:300px">${FormTable([{ k: '누르면 이동', v: LinkPick('상품', '', { openKind: true }) }])}</div>`),
        Canvas({ size: 'auto', label: '종류 = 외부 주소일 때', right: '부분', pad: 20 }, `<div style="width:680px">${FormTable([{ k: '누르면 이동', v: LinkPick('외부 주소', 'https://smartstore.naver.com/innerera'), help: 'https:// 로 시작하는 전체 주소. 우리 몰 밖으로 나가는 링크는 새 창으로 여는 것을 권합니다.' }])}</div>`),
    ),
    Canvas({ size: 'auto', label: '상품 진열 편집 · 직접 고르기 (이너에라: 상품 1개를 구성별 카드로)', right: '팝업만', pad: 20 }, EditModal('상품 진열', '', 860, productForm(), Divider2(), FormTable(commonRows('나에게 맞는 구성')))),
    CanvasRow(
        Canvas({ size: 'auto', label: '상품 진열 · 상품 찾기를 연 모습 (검색형 · 판매중지·전시 안 함은 고를 수 없음)', right: '팝업만', pad: 20 }, `<div style="min-height:420px">${EditModal('상품 진열', '', 760, productForm({ open: true }))}</div>`),
    ),
    Canvas({ size: 'auto', label: '상품 진열 · 카테고리의 상품 자동 (상품이 많은 다른 업종 몰)', right: '팝업만', pad: 20 }, EditModal('상품 진열', '', 860, productForm({ auto: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '띠 배너 편집 (배경색 · 문구 · 링크)', right: '팝업만', pad: 20 }, EditModal('띠 배너', '', 700, bandForm, Divider2(), FormTable(commonRows('블랙프라이데이 2박스 구성 특가', { period: true })))),
        Canvas({ size: 'auto', label: '여백 편집', right: '팝업만', pad: 20 }, EditModal('여백', '', 560, spaceForm)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '원료/특징 카드 편집 (Ingredients 5장)', right: '팝업만', pad: 20 }, EditModal('원료/특징 카드', '', 760, cardForm)),
        Canvas({ size: 'auto', label: '카드 한 장 고치기 팝업', right: '팝업만', pad: 20 }, cardEdit),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '이미지+글 편집 · 여러 장 카드 (Daily Ritual 5장면)', right: '팝업만', pad: 20 }, EditModal('이미지+글', '', 760, imgTextForm)),
        Canvas({ size: 'auto', label: '이미지+글 · 좌우 배치 (입력칸이 장면 1장으로 바뀜) · 이미지 없이 저장 → 오류', right: '팝업만', pad: 20 }, EditModal('이미지+글', '', 720, imgTextSingle)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '후기 모음 편집 (리뷰 기능이 켜진 몰)', right: '팝업만', pad: 20 }, EditModal('후기 모음', '', 760, reviewForm)),
        Canvas({ size: 'auto', label: '인증 배너 편집', right: '팝업만', pad: 20 }, EditModal('인증 배너', '', 760, certForm, Divider2(), FormTable(commonRows('GIP-01 특허원료 · HACCP 인증', { pcOnly: true }).slice(2, 3)))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '블록 저장', right: '토스트만', pad: 20 }, Toast('블록을 저장했습니다. 게시를 눌러야 고객에게 보입니다.', { action: '지금 게시' })),
        Canvas({ size: 'auto', label: '고치다가 닫기를 눌렀을 때', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '고친 내용을 저장하지 않고 닫을까요?', desc: '큰 글 · 버튼 문구를 바꾸고 저장하지 않았습니다.', foot: [Btn('계속 편집'), Btn('저장하지 않고 닫기', 'danger')] })),
    ),
);

const sec = (h, label) => Img({ h, label });
const PcPreview = `<div style="border:1px solid var(--line);border-radius:4px;overflow:hidden"><div style="zoom:.74">${UserHeader({ band: '5가지 핵심 원료를 하루 한 포에 — 이너에라 롱지비티 보러가기' })}
${sec(420, '1. 첫 배너 슬라이드 · 하루 한 포, 롱제비티 젤리스틱 · 1 / 2 · 버튼 제품 살펴보기')}
<div style="padding:48px 40px"><div style="font-size:12px;color:var(--mute)">Formula</div><b style="font-size:22px">하루 한 포에 담은 다섯 가지 핵심 원료</b><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-top:20px">${['알파리포산', '글루타치온', '커큐민', '퀘르세틴', 'NMN'].map((n, i) => `<div style="border:1px solid var(--line);border-radius:4px;padding:14px;font-size:13px"><span style="color:var(--mute)">0${i + 1}</span><br><b>${n}</b></div>`).join('')}</div><div style="font-size:11px;color:var(--mute);margin-top:6px">2. 원료/특징 카드 · 작은 번호 카드</div></div>
${sec(300, '3. 원료/특징 카드 · Ingredients · 큰 이미지 카드 5장 (옆으로 넘김) · 버튼 원료 이야기 보러가기')}
<div style="background:var(--dark);color:#fff;padding:44px 40px;text-align:center"><b style="font-size:22px">5가지 핵심 원료, 하루 한 포로 간편하게</b><div style="margin-top:14px">${Btn('제품 살펴보기')}</div><div style="font-size:11px;opacity:.7;margin-top:8px">4. 띠 배너</div></div>
${sec(320, '5. 이미지+글 · Daily Ritual · 장면 5장 (옆으로 넘김)')}
<div style="padding:48px 40px"><b style="font-size:22px">나에게 맞는 구성</b> <span style="color:var(--mute);font-size:13px">하루 한 포 기준 · 6. 상품 진열</span><div style="margin-top:20px">${ProductGrid(SHOP.options.map((o) => ProductCard({ name: `석류맛 20 g · ${o.name}`, price: o.price, badge: ['무료배송'], heart: false })), 3)}</div></div>
${sec(160, '7. 인증 배너 · HACCP 안전관리인증 · GIP-01 특허원료 사용 (PC 만)')}
${UserFooter()}</div></div>`;

const MPreview = MobilePage({ tab: '홈', cart: 0 },
    sec(360, '1. 첫 배너 슬라이드 · 모바일 이미지 750 × 900'),
    `<div style="padding:20px 16px"><div style="font-size:11px;color:var(--mute)">Formula</div><b>하루 한 포에 담은 다섯 가지 핵심 원료</b><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">${['알파리포산', '글루타치온', '커큐민', '퀘르세틴'].map((n, i) => `<div style="border:1px solid var(--line);border-radius:4px;padding:10px;font-size:12.5px"><span style="color:var(--mute)">0${i + 1}</span> <b>${n}</b></div>`).join('')}</div></div>`,
    sec(200, '3. Ingredients 카드 (옆으로 넘김)'),
    `<div style="background:var(--dark);color:#fff;padding:26px 16px;text-align:center;font-weight:700">5가지 핵심 원료,<br>하루 한 포로 간편하게</div>`,
    sec(180, '5. Daily Ritual 장면 카드'),
    `<div style="padding:20px 16px"><b>나에게 맞는 구성</b><div style="margin-top:10px">${ProductCard({ name: '석류맛 20 g · 1박스(14일분)', badge: ['무료배송'], heart: false })}</div></div>`,
    Note('인증 배너는 PC 만 노출로 설정해 모바일에서는 안 나옵니다.'),
);

const PreviewBar = (dev, when) => Flex({ justify: 'space-between', align: 'center' },
    Tabs([{ t: 'PC' }, { t: '모바일' }], dev, { kind: 'pill' }),
    Flex({ gap: 8, align: 'center' }, Text('보는 시점', { sm: true }), Select({ value: when, w: 230 }), Check('꺼진 블록 자리 표시')),
);

const state4 = StateBlock({ idx: 4, title: 'PC·모바일 미리보기', note: '미리보기 버튼을 누르면 게시하기 전 화면을 PC·모바일로 바꿔 가며 봅니다. 예약한 블록이 올라간 날의 화면도 날짜를 골라 미리 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '블록 순서를 바꾸고 바로 게시하면 모바일에서 어색한 것을 고객이 먼저 봅니다. 게시 전 화면을 PC 와 모바일 폭으로 각각 보여 주고, 기기별 노출을 다르게 한 블록(PC 만)이 실제로 빠지는지 확인하게 합니다. 보는 시점을 11-23 으로 바꾸면 예약한 블랙프라이데이 띠 배너가 들어간 화면을 미리 봅니다.'),
    Canvas({ label: 'A-61 · 미리보기 버튼 → 미리보기 창 · PC 탭 · 지금 시점' }, Overlay({ bg: Page({ dirty: true }, BlockList({ dirty: true })), h: 1640 },
        Modal({ title: '메인 화면 미리보기 · 게시하지 않은 변경 2건 포함', w: 1100, foot: [Btn('닫고 계속 편집'), Btn('새 창으로 크게 보기', { icon: 'external-link' }), Btn('이대로 게시', 'primary')] }, PreviewBar('PC', '지금 (2026-11-11 14:20)'), PcPreview))),
    CanvasRow(
        Canvas({ size: 'auto', label: '미리보기 창 · 모바일 탭', right: '팝업만', pad: 20 }, Modal({ title: '메인 화면 미리보기', w: 660, foot: [Btn('닫고 계속 편집'), Btn('이대로 게시', 'primary')] }, PreviewBar('모바일', '지금'), `<div style="width:390px;margin:0 auto;border:1px solid var(--line)">${MPreview}</div>`)),
        Canvas({ size: 'auto', label: '보는 시점 목록을 연 모습 → 예약 블록이 올라간 날', right: '부분', pad: 20 }, `<div style="width:420px;min-height:260px">${Select({ value: '2026-11-23 (월) 00:00 · 블랙프라이데이 띠 배너 시작', w: 400, open: true, options: [{ t: '지금 (2026-11-11 14:20)' }, { t: '2026-11-23 (월) 00:00 · 블랙프라이데이 띠 배너 시작', on: true }, { t: '2026-12-01 (화) 00:00 · 블랙프라이데이 띠 배너 종료 뒤' }, { t: '날짜 직접 고르기' }] })}</div><div style="width:420px;background:var(--dark);color:#fff;padding:22px;text-align:center;font-weight:700">블랙프라이데이 2박스 구성 특가<div style="margin-top:10px">${Btn('지금 구매하기')}</div></div>${Note('11-23 시점 미리보기에는 이 띠 배너가 4번 블록 아래에 들어갑니다.')}`),
    ),
);

const FoodBand = (o = {}) => `<div style="border:1px solid #ecd9a4;border-left:4px solid #c08a00;background:var(--warnbg);border-radius:4px;padding:10px 14px;margin-bottom:14px;font-size:12.5px;color:#5c4200;line-height:1.7"><div style="display:flex;gap:8px;align-items:flex-start">${Icon('warning')}<div style="flex:1"><b>식품·건강 표현 주의</b> — 이 몰의 상품은 일반식품입니다. 문구를 고칠 때 아래 표현은 쓰지 마세요.${o.fold ? '' : '<br>효능·기능 표현(노화 방지 · 항산화 효과 · 피로 회복 · 면역 · 피부 개선) / 질병 이름(예방 · 치료 · 완화) / 의사·전문가 추천 / 확인되지 않은 후기 · 수상 · 수치'}</div><span style="white-space:nowrap"><u>자세히 보기</u> · ${o.fold ? '펼치기' : '접기'} ${Icon(o.fold ? 'angle-down-min' : 'angle-up-min')}</span></div></div>`;

const FoodDetail = Modal({ title: '식품·건강 표현 주의 안내', w: 720, foot: [Btn('닫기', 'primary')] },
    Table({ dense: true, cols: [{ t: '묶음', w: 130 }, '쓰면 안 되는 표현 (예)', { t: '대신 쓸 수 있는 말 (예)', w: 230 }], rows: [
        ['효능·기능', '노화 방지 · 항산화 효과 · 피로 회복 · 면역력 · 피부 개선 · 활력 충전', '원료 이름과 유래 · 하루 한 포 같은 먹는 방법'],
        ['질병', '○○ 예방 · 치료 · 완화 · 개선, 병 이름을 드는 문구', '쓰지 않음'],
        ['권위', '의사 · 약사 · 전문가 추천, 병원에서 쓰는', '인증 · 특허는 받은 그대로 (HACCP · 특허 번호)'],
        ['근거 없는 자랑', '확인되지 않은 후기 · 수상 · 판매 1위 · 만족도 수치', '실제 리뷰 원문 · 확인된 수치와 출처'],
    ] }),
    Note('원료를 소개할 때는 블록 아래에 *상기 내용은 제품이 아닌 원료에 대한 정보입니다. 주석이 자동으로 붙습니다. 이 안내는 설정 > 기능 켜고 끄기에서 켜고 끄며 표현 목록은 최고관리자가 고칩니다.'),
);

const foodHit = (text, words) => `<div class="wf-textarea" style="height:70px;border-color:#c08a00"><span class="v" style="line-height:1.7">${text}</span></div><p class="err" style="width:100%;margin:0;color:#8a5a00">${Icon('warning')}주의할 표현이 있습니다: <b>${words}</b> — 일반식품에는 쓸 수 없는 효능 표현일 수 있습니다. 저장은 되지만 게시 전에 다시 확인해 주세요.</p>`;

const state5 = StateBlock({ idx: 5, title: '식품·건강 표현 주의 안내 띠', note: '설정 > 기능 켜고 끄기에서 식품·건강 표현 주의 안내를 켠 몰(이너에라)은 메인 화면 구성의 목록과 블록 편집 화면 맨 위에 쓰면 안 되는 표현 안내가 항상 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이너에라 상품은 일반식품이라 노화 방지 · 피로 회복 같은 효능 표현이나 질병 이름을 쓰면 표시·광고 위반이 됩니다. 처음 문구는 검토를 거쳐 들어가지만, 운영자가 행사 때 배너 문구를 고치다 무심코 넣기 쉽습니다. 문구를 고치는 바로 그 화면 위에 안내를 고정해 두고, 입력칸에 주의할 낱말이 들어오면 그 칸 아래에 표시합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '안내는 알려 주기만 하고 저장·게시를 막지 않습니다(같은 낱말도 문맥에 따라 괜찮을 수 있어 최종 판단은 고객사 몫). 띠는 접을 수 있지만 닫아 없앨 수는 없고, 화면을 다시 열면 펼쳐져 있습니다. 식품이 아닌 몰은 이 기능을 꺼 두어 띠가 나오지 않습니다.'),
    Canvas({ label: 'A-61 · 안내를 켠 몰 · 블록 목록 위에 띠가 고정 (펼친 모습)' }, Page({}, FoodBand(), BlockList().slice(0, 2), BLOCKS.slice(0, 4).map((b) => blockRow(b)))),
    Canvas({ label: 'A-61 · 블록 편집 팝업 안에서도 맨 위에 고정 (띠 배너 편집 · 접은 모습) + 주의할 표현을 넣었을 때' }, Overlay({ bg: Page({}, FoodBand(), BlockList()), h: 700 },
        EditModal('띠 배너', '', 720, FoodBand({ fold: true }), FormTable([
            { k: '문구', required: true, v: foodHit('피로 회복과 노화 방지에 좋은<br>5가지 핵심 원료, 하루 한 포로', '피로 회복 · 노화 방지') },
            { k: '버튼 문구', v: Input({ value: '제품 살펴보기', w: 220 }) },
            { k: '누르면 이동', v: LinkPick('상품', '이너에라 롱지비티 석류맛 젤리스틱') },
        ])))),
    CanvasRow(
        Canvas({ size: 'auto', label: '띠의 자세히 보기 → 표현 목록 팝업', right: '팝업만', pad: 20 }, FoodDetail),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '주의할 표현이 남은 채 저장 (막지 않고 한 번 더 물음)', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '주의할 표현이 들어 있습니다', desc: '문구에 피로 회복 · 노화 방지가 있습니다. 일반식품에는 쓸 수 없는 효능 표현일 수 있습니다. 그대로 저장할까요?', foot: [Btn('다시 고치기', 'primary'), Btn('그대로 저장')] })),
        Canvas({ size: 'auto', label: '게시 확인 팝업에도 표시', right: '부분', pad: 20 }, `<div style="width:460px">${Note('게시할 변경 중 주의할 표현이 들어 있는 블록이 1개 있습니다: 띠 배너 · 피로 회복 · 노화 방지 <u>블록 열기</u>', { warn: true })}</div>`),
    ),
    Canvas({ label: 'A-61 · 안내를 끈 몰 (식품이 아닌 다른 고객사) — 띠 없음' }, Page({}, BlockList().slice(0, 2), BLOCKS.slice(0, 3).map((b) => blockRow(b)), Note('설정 > 기능 켜고 끄기의 식품·건강 표현 주의 안내가 꺼져 있으면 띠와 입력칸 아래 표시가 모두 나오지 않습니다.'))),
);

export default function A61() {
    return [state1, state2, state3, state4, state5].join('');
}
