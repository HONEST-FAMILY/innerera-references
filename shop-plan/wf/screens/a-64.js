import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Input, Select, Check, RadioGroup, CheckGroup, Toggle, Tabs,
    Textarea, FormTable, ListHead, Table, Overlay, Modal, Confirm, Toast, Upload, ImageGuide, Box, KV, Note, Text, Icon, Flex, Grid, Img, Empty,
    UserHeader, UserFooter, MobilePage,
} from '../lib/blocks.js';

const st = (s) => ({ 공개: Badge('공개', 'check'), 비공개: Badge('비공개', 'mute'), 예약: Badge('예약 공개', 'dash'), 수정중: Badge('공개 · 게시 안 한 수정 있음', 'warn') }[s]);
const acts = (pub) => `${Btn('편집', { size: 'sm' })} ${Btn(pub ? '보기' : '미리보기', { size: 'sm', icon: pub ? 'external-link' : 'eye-o' })} ${Btn('복사', { size: 'sm' })}`;

const COLS = ['페이지 제목 · 주소', { t: '상태', w: 190 }, { t: '블록', w: 56, align: 'center' }, { t: '연결된 메뉴', w: 170 }, { t: '방문(7일)', w: 80, align: 'right' }, { t: '마지막 수정', w: 130 }, { t: '', w: 196 }];
const ROWS = [
    ['<u>브랜드 이야기</u><small>/pages/brand</small>', st('수정중'), 6, '상단 · 서랍 · 바닥글', '1,284', '11-11 10:12<small>이보림</small>', acts(true)],
    ['<u>원료 이야기</u><small>/pages/ingredients</small>', st('공개'), 8, '상단 · 서랍 · 바닥글', '962', '11-06 15:40<small>윤서연</small>', acts(true)],
    ['<u>배송 안내</u><small>/pages/shipping</small>', st('공개'), 3, '바닥글', '148', '11-02 09:55<small>이보림</small>', acts(true)],
    ['<u>블랙프라이데이 안내</u><small>/pages/black-friday</small>', st('예약'), 4, '없음', '-', '11-10 17:20<small>윤서연</small>', acts(false)],
    { dim: true, c: ['<u>선물 포장 안내</u><small>/pages/gift</small>', st('비공개'), 2, '없음', '-', '10-28 11:03<small>이보림</small>', acts(false)] },
];

const Page = (o, ...body) => AdminLayout({ active: 'a-64', desc: '브랜드 이야기처럼 읽을거리 페이지를 블록으로 조립해 올립니다. 주소는 /pages/ 뒤에 붙습니다.', actions: [Btn('새 페이지 만들기', { kind: 'primary', icon: 'plus' })], ...o }, body);
const List = () => [ListHead({ total: 5, left: [Input({ placeholder: '페이지 제목으로 찾기', icon: 'search', w: 240 })], right: [Select({ value: '상태 전체', w: 130 })] }), Table({ cols: COLS, rows: ROWS })];

const tpl = (t, d, on) => `<div style="border:${on ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:12px"><div style="height:70px;border:1px dashed var(--line);background:var(--box);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--mute);margin-bottom:8px">구성 축소 그림</div><b style="font-size:13px">${t}</b><div style="font-size:12px;color:var(--ink2);margin-top:2px">${d}</div></div>`;

const newModal = (o = {}) => Modal({ title: '새 페이지 만들기', w: 680, foot: [Btn('취소'), Btn('만들고 편집 시작', 'primary')] },
    FormTable([
        { k: '페이지 제목', required: true, v: Input({ value: o.err ? '브랜드 스토리' : '블랙프라이데이 안내', w: 320 }), help: '브라우저 탭과 페이지 맨 위, 검색 결과에 나오는 이름입니다.' },
        { k: '주소', required: true, v: [Text('/pages/', { mute: true }), Input({ value: o.err ? 'brand' : 'black-friday', w: 220, error: o.err })], help: '영문 소문자·숫자·붙임표(-)만, 40자까지. 공개한 뒤에 바꾸면 예전 주소로 들어온 고객은 새 주소로 자동으로 옮겨집니다.', error: o.err ? '이미 쓰고 있는 주소입니다(브랜드 이야기). 다른 주소를 넣어 주세요.' : undefined },
    ]),
    Text('시작 구성', { b: true }),
    Grid(3, tpl('빈 페이지', '블록 없이 시작', false), tpl('이야기형', '큰 제목 · 글 · 이미지 · 이미지+글 · 인용', true), tpl('안내문형', '큰 제목 · 글 · 글', false)),
    Note('만든 페이지는 비공개로 시작합니다. 내용을 채운 뒤 공개하세요.'),
);

const state1 = StateBlock({ idx: 1, title: '목록(브랜드 이야기·원료 이야기)', note: '디자인 > 콘텐츠 페이지에 들어오면 보이는 페이지 목록. 이너에라는 브랜드 이야기·원료 이야기·배송 안내가 공개돼 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '브랜드 소개·원료 설명·배송 안내·행사 안내는 고객사마다 내용도 개수도 다릅니다. 페이지마다 개발하지 않고 운영자가 블록으로 조립해 주소(/pages/이름)를 붙여 올립니다. 목록에서는 공개 여부, 어느 메뉴에 걸려 있는지, 지난 7일 방문 수를 함께 보여 줘서 안 쓰는 페이지와 메뉴에서 빠진 페이지를 바로 알 수 있습니다.'),
    Anno({ warn: true, title: '초기값 · 빈 상태' }, '설치 직후에는 페이지가 없습니다. 공개 중인 페이지를 고치면 고객 화면은 그대로이고 목록에 게시 안 한 수정 있음이 붙습니다(게시해야 반영). 메뉴에 걸린 페이지를 지우려 하면 어느 메뉴가 끊기는지 먼저 알려 줍니다.'),
    Canvas({ label: 'A-64 · 페이지 목록 (공개 · 게시 안 한 수정 있음 · 예약 공개 · 비공개)' }, Page({}, List())),
    Canvas({ label: 'A-64 · 새 페이지 만들기 버튼 → 팝업' }, Overlay({ bg: Page({}, List()), h: 640 }, newModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 · 이미 쓰는 주소', right: '팝업만', pad: 20 }, newModal({ err: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '메뉴에 걸린 페이지를 지울 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '배송 안내 페이지를 지울까요?', desc: '이 페이지는 바닥글 링크 배송 안내에 연결돼 있습니다. 지우면 그 메뉴가 고객 화면에서 자동으로 숨겨집니다. 지운 페이지는 30일 동안 휴지통에서 되살릴 수 있습니다.', foot: [Btn('취소'), Btn('비공개로만 바꾸기'), Btn('지우기', 'danger')] })),
        Canvas({ size: 'auto', label: '복사 버튼', right: '토스트만', pad: 20 }, Toast('브랜드 이야기를 복사했습니다. 복사본은 비공개 · 주소 /pages/brand-copy 입니다.', { action: '복사본 편집' })),
    ),
    Canvas({ label: 'A-64 · 설치 직후 빈 상태' }, Page({}, Empty({ icon: 'file-text-o', title: '아직 만든 페이지가 없습니다', desc: '브랜드 이야기, 원료·소재 이야기, 배송 안내처럼 상품 밖의 읽을거리를 만들어 메뉴에 걸 수 있습니다.', action: Btn('새 페이지 만들기', { kind: 'primary', icon: 'plus' }) }))),
);

const BTYPES = [['큰 제목', 'pen', '페이지나 구역의 제목 한두 줄'], ['글', 'file-text-o', '문단 글. 굵게·링크·목록'], ['이미지', 'image-o', '가로로 꽉 차는 이미지 한 장'], ['이미지+글 좌우', 'layout-o', '사진과 글을 나란히'], ['인용', 'message-o', '강조하고 싶은 한 문장'], ['원료 카드', 'view-list', '번호·이름·설명 카드 묶음'], ['여백', 'arrows-v', '블록 사이 간격']];
const bIcon = (t) => (BTYPES.find((b) => b[0] === t) || [])[1];

const BRAND = [['큰 제목', '미래의 나를 위한 데일리 리추얼'], ['글', '이너에라는 매일의 작은 습관이 …'], ['이미지', '석류 원물과 젤리스틱 · 1920 × 900'], ['이미지+글 좌우', '패키지에 표기된 그대로'], ['인용', '여러 가지 따로 챙길 필요 없이, 간편하게'], ['여백', 'PC 120 px · 모바일 64 px']];

const side = (sel) => `<div><div style="font-size:12px;font-weight:700;margin-bottom:8px">블록 6개 (끌어서 순서 바꾸기)</div>${BRAND.map(([t, s], i) => `<div style="display:flex;gap:8px;align-items:center;border:${i === sel ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:4px;padding:8px;margin-bottom:5px;background:#fff;font-size:12px">${Icon('drag-vertical')}${Icon(bIcon(t))}<div style="min-width:0;flex:1"><b>${t}</b><div style="color:var(--mute);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s}</div></div></div>`).join('')}<div style="border:1.5px dashed var(--line);border-radius:4px;padding:8px;text-align:center;font-size:12px;color:var(--ink2)">${Icon('plus')} 블록 추가</div></div>`;

const sideEmpty = `<div><div style="font-size:12px;font-weight:700;margin-bottom:8px">블록 0개</div><div style="border:1.5px dashed var(--line);border-radius:4px;padding:8px;text-align:center;font-size:12px;color:var(--ink2)">${Icon('plus')} 블록 추가</div></div>`;

const wrapSel = (on, html, tools = true) => `<div style="position:relative;${on ? 'outline:2px solid var(--dark);outline-offset:2px;' : ''}margin-bottom:14px">${html}${on && tools ? `<div style="position:absolute;right:0;top:-30px;display:flex;gap:2px;background:var(--dark);color:#fff;border-radius:4px;padding:4px 8px;font-size:14px">${Icon('angle-up')}${Icon('angle-down')}${Icon('documents-o')}${Icon('trash-o')}</div>` : ''}</div>`;

const stage = (sel) => `<div style="border:1px solid var(--line);background:#fff;padding:22px 26px">
${wrapSel(sel === 0, `<div style="text-align:center;padding:14px 0"><div style="font-size:11px;color:var(--mute)">Brand Story</div><b style="font-size:22px">미래의 나를 위한 데일리 리추얼</b></div>`)}
${wrapSel(sel === 1, `<p style="font-size:13px;line-height:1.8;margin:0;color:var(--ink2)">이너에라는 매일의 작은 습관이 미래의 나를 만든다고 믿습니다. 여러 가지를 따로 챙기지 않아도 되도록 다섯 가지 핵심 원료를 하루 한 포에 담았습니다. <u>원료 이야기 보러가기</u></p>`)}
${wrapSel(sel === 2, Img({ h: 150, label: '이미지 · 석류 원물과 젤리스틱 · 1920 × 900' }))}
${wrapSel(sel === 3, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center">${Img({ h: 150, label: '이미지 1200 × 900' })}<div><b style="font-size:16px">패키지에 표기된 그대로</b><p style="font-size:12.5px;line-height:1.7;color:var(--ink2);margin:6px 0">원료의 출처와 함량을 숨기지 않습니다. HACCP 인증 시설에서 만들고 GIP-01 특허원료를 씁니다.</p>${Btn('원칙 살펴보기', { size: 'sm' })}</div></div>`)}
${wrapSel(sel === 4, `<div style="border-left:4px solid var(--dark);padding:10px 16px;font-size:15px;font-weight:700">여러 가지 따로 챙길 필요 없이, 간편하게</div>`)}
${wrapSel(sel === 5, `<div style="height:40px;border:1px dashed var(--line);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--mute)">여백 120 px</div>`)}
</div>`;

const Toolbar = `<div style="display:flex;gap:2px;border:1px solid var(--line);border-bottom:0;border-radius:4px 4px 0 0;padding:5px 8px;background:var(--box);font-size:12.5px;align-items:center"><b style="padding:0 6px">굵게</b><u style="padding:0 6px">밑줄</u><span style="padding:0 6px">${Icon('link')} 링크</span><span style="padding:0 6px">${Icon('list-dot')} 목록</span><span style="padding:0 6px">${Icon('undo')} 되돌리기</span></div>`;

const panel = (t, rows, extra = '') => `<div style="border:1px solid var(--line);border-radius:6px;background:#fff;width:100%"><div style="padding:10px 12px;border-bottom:1px solid var(--line2);font-size:13px;display:flex;gap:6px;align-items:center">${Icon(bIcon(t))}<b>${t}</b><span style="margin-left:auto;font-size:11.5px;color:var(--mute)">블록 설정</span></div><div style="padding:12px;font-size:12.5px">${rows.map(([k, v, h]) => `<div style="margin-bottom:12px"><div style="font-weight:700;margin-bottom:5px">${k}</div><div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${[].concat(v).join('')}</div>${h ? `<div style="color:var(--mute);font-size:11.5px;margin-top:4px">${h}</div>` : ''}</div>`).join('')}${extra}</div></div>`;

const P_SPLIT = panel('이미지+글 좌우', [
    ['이미지 위치', RadioGroup(['왼쪽', '오른쪽'], '왼쪽'), '모바일에서는 이미지가 위, 글이 아래로 갑니다.'],
    ['이미지', Upload({ title: '이미지 바꾸기', button: '파일 바꾸기', guide: ImageGuide({ size: '1200 × 900 px', ratio: '4:3', max: '1MB 이하' }), files: [{ name: 'brand_principle.jpg', size: '284KB · 1200 × 900', icon: 'image-o' }] })],
    ['대체 글', Input({ value: 'HACCP 인증 시설의 생산 라인', w: 268 })],
    ['제목', Input({ value: '패키지에 표기된 그대로', w: 268 })],
    ['글', `${Toolbar}${Textarea({ value: '원료의 출처와 함량을 숨기지 않습니다. HACCP 인증 시설에서 만들고 GIP-01 특허원료를 씁니다.', h: 86, count: '52 / 400' })}`],
    ['버튼', [Input({ value: '원칙 살펴보기', w: 130 }), Select({ value: '콘텐츠 페이지', w: 130 }), Select({ value: '원료 이야기', w: 268 })], '버튼 문구를 비우면 버튼이 안 나옵니다.'],
]);

const P_TITLE = panel('큰 제목', [['작은 글', Input({ value: 'Brand Story', w: 268 }), '제목 위에 작게. 비우면 안 나옵니다.'], ['제목', Textarea({ value: '미래의 나를 위한 데일리 리추얼', h: 56, count: '16 / 40' }), '2줄까지.'], ['크기', RadioGroup(['크게 (페이지 제목)', '보통 (구역 제목)'], '크게 (페이지 제목)')], ['정렬', RadioGroup(['왼쪽', '가운데'], '가운데')]]);
const P_TEXT = panel('글', [['글', `${Toolbar}${Textarea({ value: '이너에라는 매일의 작은 습관이 미래의 나를 만든다고 믿습니다. 여러 가지를 따로 챙기지 않아도 되도록 다섯 가지 핵심 원료를 하루 한 포에 담았습니다.', h: 120, count: '78 / 2,000' })}`, '글자 크기·색·글꼴은 디자인으로 고정입니다. 굵게·밑줄·링크·목록만 쓸 수 있습니다.'], ['폭', RadioGroup(['좁게 (읽기 좋은 폭)', '넓게'], '좁게 (읽기 좋은 폭)')], ['정렬', RadioGroup(['왼쪽', '가운데'], '왼쪽')]]);
const P_IMG = panel('이미지', [['PC 이미지', Upload({ title: '이미지 고르기', guide: ImageGuide({ size: '1920 × 900 px', ratio: '자유 (세로 400 ~ 1200 px)', max: '2MB 이하' }), files: [{ name: 'brand_main.png', size: '5.2MB', error: '용량이 2MB 를 넘습니다. 줄여서 다시 올려 주세요.' }] })], ['모바일 이미지 (선택)', Text('750 × 900 px · 1MB 이하 · 안 올리면 PC 이미지를 줄여 씁니다', { sm: true, mute: true })], ['대체 글', Input({ placeholder: '이미지 설명 (필수)', w: 268, error: true }), '이미지를 설명하는 글을 넣어 주세요. 검색과 화면 읽기에 쓰입니다.'], ['폭', RadioGroup(['화면 꽉 차게', '본문 폭'], '화면 꽉 차게')], ['누르면 이동', Select({ value: '이동 없음', w: 268 })]]);
const P_QUOTE = panel('인용', [['문장', Textarea({ value: '여러 가지 따로 챙길 필요 없이, 간편하게', h: 60, count: '21 / 120' })], ['출처 (선택)', Input({ placeholder: '예: 이너에라 대표 이보림', w: 268 })], ['모양', RadioGroup(['왼쪽 굵은 줄', '가운데 큰 글자'], '왼쪽 굵은 줄')]]);
const P_CARD = panel('원료 카드', [['한 줄 개수', [Text('PC'), Select({ value: '5개', w: 80 }), Text('모바일'), Select({ value: '1개 (옆으로 넘김)', w: 150 })]], ['카드 5장', ['01 알파리포산', '02 글루타치온', '03 커큐민', '04 퀘르세틴', '05 NMN'].map((c) => `<div style="width:100%;display:flex;align-items:center;gap:6px;border:1px solid var(--line2);border-radius:4px;padding:6px 8px">${Icon('drag-vertical')}${Img({ w: 26, h: 26 })}<b style="flex:1">${c}</b>${Icon('pen-o')}${Icon('trash-o')}</div>`), '카드 이미지 600 × 600 px (1:1) · 500KB 이하. 카드마다 번호·이름·영문 이름·설명·꼬리표를 넣습니다.'], ['', Btn('카드 추가', { size: 'sm', icon: 'plus' })], ['메인 화면의 카드 가져오기', Btn('메인 화면 구성의 Ingredients 카드 5장 불러오기', { size: 'sm', icon: 'download' }), '같은 내용을 두 번 입력하지 않게 불러옵니다. 불러온 뒤에는 따로 고칩니다.']]);
const P_SPACE = panel('여백', [['높이', [Text('PC'), Input({ value: '120', suffix: 'px', w: 100 }), Text('모바일'), Input({ value: '64', suffix: 'px', w: 100 })], '0 ~ 300 px'], ['구분선', Check('가운데에 가는 선 넣기')]]);

const EdHead = (o = {}) => Flex({ justify: 'space-between', align: 'center' },
    Flex({ gap: 10, align: 'center' }, Btn('목록', { size: 'sm', icon: 'angle-left-min' }), `<b style="font-size:16px">${o.title || '브랜드 이야기'}</b>`, `<span style="font-size:12px;color:var(--mute)">${o.url || '/pages/brand'}</span>`, o.badge || st('수정중')),
    Flex({ gap: 8, align: 'center' }, Text(`${Icon('check-min')} 자동 저장됨 14:20`, { sm: true, mute: true }), Btn('미리보기', { icon: 'eye-o' }), Btn('공개 설정', { icon: 'cog' }), Btn(o.pub || '수정 내용 게시', 'primary')),
);

const Editor = (sel, panelHtml, o = {}) => AdminLayout({ active: 'a-64', title: '콘텐츠 페이지 편집', crumb: ['디자인', '콘텐츠 페이지', o.title || '브랜드 이야기'] },
    o.top || '', EdHead(o), '<div style="height:14px"></div>',
    `<div style="display:grid;grid-template-columns:190px minmax(0,1fr) 300px;gap:14px;align-items:start">${o.empty ? sideEmpty : side(sel)}${o.stage || stage(sel)}${panelHtml}</div>`,
);

const addPop = `<div style="width:560px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:14px"><b style="font-size:13.5px">블록 추가 · 종류 고르기</b><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px">${BTYPES.map(([t, i, d], n) => `<div style="border:${n === 5 ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:4px;padding:10px;font-size:12px"><div style="font-size:20px">${Icon(i)}</div><b>${t}</b><div style="color:var(--mute);font-size:11px;margin-top:2px">${d}</div></div>`).join('')}</div><div style="font-size:11.5px;color:var(--mute);margin-top:10px">고르면 지금 고른 블록 바로 아래에 들어갑니다. 상품 진열·후기 모음은 메인 화면 전용 블록이라 여기에는 없습니다.</div></div>`;

const state2 = StateBlock({ idx: 2, title: '블록 편집기', note: '목록에서 편집을 누르면 열리는 화면. 왼쪽 = 블록 순서, 가운데 = 페이지 모습, 오른쪽 = 고른 블록의 입력칸. 블록 종류 7가지(큰 제목·글·이미지·이미지+글 좌우·인용·원료 카드·여백)의 입력칸을 모두 그렸습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '자유롭게 꾸미는 편집기는 운영자가 글꼴·색·간격을 제각각 써서 페이지마다 모양이 달라집니다. 블록 7가지 안에서 내용만 넣게 하면 누가 만들어도 시안과 같은 모양이 나옵니다. 가운데 화면에서 블록을 누르면 오른쪽 입력칸이 그 블록 종류에 맞게 바뀌고, 고친 내용은 가운데에 바로 보입니다.'),
    Anno({ warn: true, title: '관리자가 바꿀 수 있는 범위 · 자산 규격' }, '바꿀 수 있는 것: 블록 순서·추가·삭제, 문구, 이미지, 링크, 정렬·폭 같은 정해진 선택지. 바꿀 수 없는 것: 글꼴·글자 크기·색(디자인 고정). 이미지는 블록마다 권장 크기가 다르고(이미지 1920 × 900 · 이미지+글 1200 × 900 · 원료 카드 600 × 600) 대체 글이 필수입니다. 고치는 동안 자동 저장되지만 공개 중인 페이지는 게시를 눌러야 고객에게 보입니다.'),
    Canvas({ label: 'A-64 · 브랜드 이야기 편집 · 이미지+글 좌우 블록을 고른 모습' }, Editor(3, P_SPLIT)),
    Canvas({ size: 'auto', label: '왼쪽 블록 추가 버튼 → 종류 고르기 (원료 카드에 마우스를 올린 모습)', right: '부분', pad: 20 }, addPop),
    Text('고른 블록 종류에 따라 바뀌는 오른쪽 입력칸', { b: true }),
    CanvasRow(
        Canvas({ size: 'auto', label: '큰 제목', right: '설정 칸만', pad: 16 }, `<div style="width:300px">${P_TITLE}</div>`),
        Canvas({ size: 'auto', label: '글 (굵게·밑줄·링크·목록만)', right: '설정 칸만', pad: 16 }, `<div style="width:300px">${P_TEXT}</div>`),
        Canvas({ size: 'auto', label: '이미지 · 오류(용량 초과 · 대체 글 없음)', right: '설정 칸만', pad: 16 }, `<div style="width:300px">${P_IMG}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '인용', right: '설정 칸만', pad: 16 }, `<div style="width:300px">${P_QUOTE}</div>`),
        Canvas({ size: 'auto', label: '원료 카드 (원료 이야기 페이지)', right: '설정 칸만', pad: 16 }, `<div style="width:300px">${P_CARD}</div>`),
        Canvas({ size: 'auto', label: '여백', right: '설정 칸만', pad: 16 }, `<div style="width:300px">${P_SPACE}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '글 블록 · 글자를 끌어 고르고 링크를 누름', right: '부분', pad: 20 }, `<div style="width:420px;border:1px solid var(--line);border-radius:6px;padding:12px;background:#fff;font-size:12.5px"><b>링크 넣기</b><div style="margin:8px 0;color:var(--mute)">고른 글자: 원료 이야기 보러가기</div><div style="display:flex;gap:6px;flex-wrap:wrap">${Select({ value: '콘텐츠 페이지', w: 140 })}${Select({ value: '원료 이야기 (/pages/ingredients)', w: 250 })}</div><div style="margin-top:8px">${Check('새 창으로 열기')}</div><div style="display:flex;justify-content:flex-end;gap:6px;margin-top:10px">${Btn('링크 지우기', { size: 'sm' })}${Btn('넣기', { kind: 'primary', size: 'sm' })}</div></div>`),
        Canvas({ size: 'auto', label: '블록 위 휴지통 → 삭제', right: '팝업만', pad: 20 }, Confirm({ w: 360, title: '이미지+글 좌우 블록을 지울까요?', desc: '넣은 이미지와 글이 함께 지워집니다. 지운 직후에는 화면 아래 되돌리기로 살릴 수 있습니다.', ok: '지우기', danger: true })),
        Canvas({ size: 'auto', label: '삭제 뒤', right: '토스트만', pad: 20 }, Toast('블록을 지웠습니다.', { action: '되돌리기' })),
    ),
    Canvas({ label: 'A-64 · 새로 만든 빈 페이지 (블록 없음)' }, Editor(-1, `<div style="border:1px dashed var(--line);border-radius:6px;padding:20px;font-size:12.5px;color:var(--mute);text-align:center">블록을 고르면 여기에 입력칸이 나옵니다</div>`, { title: '선물 포장 안내', url: '/pages/gift', badge: st('비공개'), pub: '공개하기', empty: true, stage: `<div style="border:1px solid var(--line);background:#fff">${Empty({ icon: 'plus', title: '첫 블록을 추가해 보세요', desc: '보통 큰 제목으로 시작해 글과 이미지를 이어 붙입니다.', action: Btn('블록 추가', { kind: 'primary', icon: 'plus' }) })}</div>` })),
);

const PvPc = `<div style="border:1px solid var(--line);overflow:hidden"><div style="zoom:.72">${UserHeader({ active: '브랜드 이야기' })}<div style="padding:60px 200px"><div style="text-align:center"><div style="font-size:13px;color:var(--mute)">Brand Story</div><b style="font-size:34px">미래의 나를 위한 데일리 리추얼</b></div><p style="font-size:16px;line-height:1.9;color:var(--ink2);margin:30px 0">이너에라는 매일의 작은 습관이 미래의 나를 만든다고 믿습니다. 여러 가지를 따로 챙기지 않아도 되도록 다섯 가지 핵심 원료를 하루 한 포에 담았습니다. <u>원료 이야기 보러가기</u></p></div>${Img({ h: 380, label: '이미지 · 석류 원물과 젤리스틱 · 화면 꽉 차게' })}<div style="padding:60px 200px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center">${Img({ h: 300, label: '이미지 1200 × 900' })}<div><b style="font-size:24px">패키지에 표기된 그대로</b><p style="line-height:1.8;color:var(--ink2)">원료의 출처와 함량을 숨기지 않습니다. HACCP 인증 시설에서 만들고 GIP-01 특허원료를 씁니다.</p>${Btn('원칙 살펴보기')}</div></div><div style="border-left:5px solid var(--dark);padding:14px 22px;font-size:22px;font-weight:700;margin-top:50px">여러 가지 따로 챙길 필요 없이, 간편하게</div></div>${UserFooter()}</div></div>`;

const PvM = MobilePage({ title: '브랜드 이야기', tab: '홈' }, `<div style="padding:24px 16px"><div style="text-align:center"><div style="font-size:11px;color:var(--mute)">Brand Story</div><b style="font-size:20px">미래의 나를 위한<br>데일리 리추얼</b></div><p style="font-size:13.5px;line-height:1.8;color:var(--ink2)">이너에라는 매일의 작은 습관이 미래의 나를 만든다고 믿습니다. 다섯 가지 핵심 원료를 하루 한 포에 담았습니다.</p></div>`, Img({ h: 220, label: '이미지 (모바일 750 × 900 없으면 PC 이미지 축소)' }), `<div style="padding:24px 16px">${Img({ h: 200, label: '이미지+글 → 이미지가 위' })}<b style="display:block;margin-top:12px;font-size:17px">패키지에 표기된 그대로</b><p style="font-size:13px;line-height:1.7;color:var(--ink2)">원료의 출처와 함량을 숨기지 않습니다.</p>${Btn('원칙 살펴보기', { block: true })}</div>`);

const pubForm = (o = {}) => FormTable([
    { k: '공개 상태', required: true, v: RadioGroup(['공개', '비공개', '예약 공개'], o.mode || '공개') },
    o.mode === '예약 공개' ? { k: '공개 일시', required: true, v: [Input({ value: '2026-11-23 (월)', icon: 'calendar', w: 180 }), Select({ value: '00:00', w: 100 })], help: '이 시각에 자동으로 공개되고, 이 페이지에 연결한 메뉴도 그때부터 보입니다.' } : null,
    { k: '주소', v: [Text('https://innerera.example/pages/', { mute: true, sm: true }), Input({ value: o.url || 'brand', w: 160 }), Btn('주소 복사', { size: 'sm', icon: 'link' })] },
    { k: '검색 결과 제목', v: Input({ value: '브랜드 이야기 | 이너에라 Inner:Era', w: 400 }), help: '비우면 페이지 제목 | 쇼핑몰 이름으로 자동. 30자 안팎.' },
    { k: '검색 결과 설명', v: Textarea({ value: '다섯 가지 핵심 원료를 하루 한 포에. 이너에라가 원료를 고르고 만드는 원칙을 소개합니다.', h: 60, count: '48 / 80' }) },
    { k: '공유 이미지', v: Upload({ title: '카카오톡·SNS 에 공유될 때 보이는 이미지', guide: ImageGuide({ size: '1200 × 630 px', ratio: '1.91:1', max: '1MB 이하', ext: 'JPG · PNG', more: ['안 올리면 페이지의 첫 이미지를 씁니다'] }) }) },
    { k: '검색 엔진 노출', v: Check('네이버·구글 검색에 나오게 하기', { on: true }) },
].filter(Boolean));

const state3 = StateBlock({ idx: 3, title: '미리보기·공개', note: '편집기 오른쪽 위 미리보기 · 공개 설정 · 게시 버튼. 공개하면 주소 /pages/brand 로 고객이 볼 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '쓰는 중인 글이 고객에게 보이면 안 되므로 새 페이지는 비공개로 시작하고, 공개·비공개·예약 공개 중에서 고릅니다. 예약 공개는 행사 페이지를 미리 만들어 두고 시작 시각에 메뉴와 함께 열리게 하는 용도입니다. 공개 중인 페이지를 고칠 때는 게시를 눌러야 반영돼 고치는 중간 모습이 나가지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '공개 중인 페이지를 비공개로 바꾸면 이 페이지에 연결한 메뉴(상단·서랍·바닥글)가 자동으로 숨겨진다고 미리 알려 줍니다. 주소를 바꾸면 예전 주소는 새 주소로 자동으로 넘깁니다(공유된 링크가 끊기지 않게).'),
    Canvas({ label: 'A-64 · 미리보기 버튼 → 미리보기 창 · PC 탭' }, Overlay({ bg: Editor(3, P_SPLIT), h: 1180 },
        Modal({ title: '미리보기 · 브랜드 이야기 (게시 안 한 수정 포함)', w: 1080, foot: [Btn('닫고 계속 편집'), Btn('새 창으로 크게 보기', { icon: 'external-link' }), Btn('수정 내용 게시', 'primary')] }, Tabs([{ t: 'PC' }, { t: '모바일' }], 'PC', { kind: 'pill' }), PvPc))),
    CanvasRow(
        Canvas({ size: 'mobile', label: '미리보기 창 · 모바일 탭 (이미지+글이 위아래로)' }, PvM),
        Canvas({ size: 'auto', label: '공개 설정 버튼 → 팝업 (공개)', right: '팝업만', pad: 20 }, Modal({ title: '공개 설정 · 브랜드 이야기', w: 720, foot: [Btn('취소'), Btn('설정 저장', 'primary')] }, pubForm())),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '공개 설정 · 예약 공개를 고르면 공개 일시 칸이 생김', right: '팝업만', pad: 20 }, Modal({ title: '공개 설정 · 블랙프라이데이 안내', w: 720, foot: [Btn('취소'), Btn('예약 저장', 'primary')] }, pubForm({ mode: '예약 공개', url: 'black-friday' }).replace('브랜드 이야기 | 이너에라 Inner:Era', '블랙프라이데이 안내 | 이너에라 Inner:Era'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '수정 내용 게시 버튼', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '수정 내용을 게시할까요?', desc: '브랜드 이야기 — 블록 2개 수정 · 1개 추가. 게시하면 /pages/brand 에 바로 반영됩니다.', ok: '게시' })),
        Canvas({ size: 'auto', label: '게시 완료', right: '토스트만', pad: 20 }, Toast('브랜드 이야기를 게시했습니다. innerera.example/pages/brand', { action: '페이지 보기' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '공개 → 비공개로 바꿀 때 (메뉴에 연결된 페이지)', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '브랜드 이야기를 비공개로 바꿀까요?', desc: '이 페이지에 연결한 메뉴 3곳(상단 메뉴 · 서랍 메뉴 · 바닥글 링크)이 고객 화면에서 함께 숨겨집니다. 주소로 직접 들어온 고객에게는 없는 페이지 안내가 보입니다.', ok: '비공개로 바꾸기', danger: true })),
        Canvas({ size: 'auto', label: '블록이 없는 페이지를 공개하려 할 때', right: '토스트만', pad: 20 }, Toast('블록이 하나도 없어 공개할 수 없습니다. 블록을 먼저 추가해 주세요.', { kind: 'error' })),
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

const P_TEXT_HIT = panel('글', [['글', `${Toolbar}${foodHit('이너에라는 매일의 작은 습관이 미래의 나를 만든다고 믿습니다. 항산화 효과가 뛰어난 다섯 가지 원료로 면역력을 지켜 드립니다.', '항산화 효과 · 면역력')}`], ['폭', RadioGroup(['좁게 (읽기 좋은 폭)', '넓게'], '좁게 (읽기 좋은 폭)')]]);

const state4 = StateBlock({ idx: 4, title: '식품·건강 표현 주의 안내 띠', note: '설정 > 기능 켜고 끄기에서 식품·건강 표현 주의 안내를 켠 몰(이너에라)은 콘텐츠 페이지 편집기 맨 위에 쓰면 안 되는 표현 안내가 항상 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '브랜드 이야기 · 원료 이야기는 글이 길어 효능 표현이 가장 들어가기 쉬운 곳입니다. 원료를 설명하다 보면 무엇에 좋다는 말을 쓰고 싶어지는데, 일반식품은 그렇게 쓸 수 없습니다. 글을 쓰는 화면 위에 안내를 고정하고, 글 블록에 주의할 낱말이 들어오면 그 블록의 입력칸 아래에 표시합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '메인 화면 구성과 같은 안내 · 같은 표현 목록을 씁니다(설정 > 기능 켜고 끄기에서 한 번 정함). 저장·공개를 막지는 않고, 공개·게시할 때 주의할 표현이 남은 블록 수를 한 번 더 보여 줍니다. 원료 카드 블록에는 *상기 내용은 제품이 아닌 원료에 대한 정보입니다. 주석이 자동으로 붙습니다.'),
    Canvas({ label: 'A-64 · 안내를 켠 몰 · 편집기 맨 위에 띠가 고정 + 글 블록에 주의할 표현이 들어간 모습' }, Editor(1, P_TEXT_HIT, { top: FoodBand() })),
    CanvasRow(
        Canvas({ size: 'auto', label: '띠를 접은 모습 (다시 열면 펼쳐짐)', right: '부분', pad: 20 }, `<div style="width:900px">${FoodBand({ fold: true })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '띠의 자세히 보기 → 표현 목록 팝업', right: '팝업만', pad: 20 }, FoodDetail),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '수정 내용 게시 버튼 → 주의할 표현이 남아 있을 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '주의할 표현이 남은 블록이 1개 있습니다', desc: '글 블록 — 항산화 효과 · 면역력. 일반식품에는 쓸 수 없는 효능 표현일 수 있습니다. 그대로 게시할까요?', foot: [Btn('블록 열어 고치기', 'primary'), Btn('그대로 게시')] })),
        Canvas({ size: 'auto', label: '원료 카드 블록 아래 자동 주석 (지울 수 없음)', right: '부분', pad: 20 }, `<div style="width:420px;border:1px solid var(--line);padding:14px;background:#fff"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${['01 알파리포산', '02 글루타치온', '03 커큐민'].map((c) => `<div style="border:1px solid var(--line);border-radius:4px;padding:10px;font-size:12px"><b>${c}</b></div>`).join('')}</div><div style="font-size:11.5px;color:var(--mute);margin-top:10px">${Icon('lock-o')} *상기 내용은 제품이 아닌 원료에 대한 정보입니다.</div></div>`),
    ),
    Canvas({ label: 'A-64 · 안내를 끈 몰 (식품이 아닌 다른 고객사) — 띠 없음' }, Editor(1, P_TEXT)),
);

export default function A64() {
    return [state1, state2, state3, state4].join('');
}
