import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Input, Select, Check, RadioGroup, Toggle, Textarea,
    FormTable, Table, Overlay, Confirm, Toast, Upload, ImageGuide, Box, Note, Text, Icon, Grid, Thumb, Empty,
} from '../lib/blocks.js';

const TREE = [
    { d: 0, name: '건강식품', n: 4, open: true },
    { d: 1, name: '젤리스틱', n: 2 },
    { d: 1, name: '이너뷰티', n: 1 },
    { d: 1, name: '선물 세트', n: 1 },
    { d: 0, name: '소품', n: 2 },
    { d: 0, name: '기획전', n: 1, open: true },
    { d: 1, name: '11월 감사제', n: 0, hidden: true },
    { d: 1, name: '추석', n: 1, hidden: true },
];

const Node = (t, o = {}) => {
    const on = o.active === t.name;
    const ghost = o.ghost === t.name;
    return `${o.dropBefore === t.name ? `<div style="margin-left:${t.d * 28}px;height:0;border-top:3px solid var(--dark);position:relative"><span style="position:absolute;left:8px;top:-10px;font-size:11px;background:var(--dark);color:#fff;padding:0 6px;border-radius:2px">여기로 옮김</span></div>` : ''}<div style="display:flex;align-items:center;gap:8px;margin-left:${t.d * 28}px;margin-bottom:4px;padding:8px 10px;border:${on ? '2px solid var(--dark)' : ghost ? '1.5px dashed #a8a8b0' : '1px solid var(--line)'};border-radius:4px;background:${on ? 'var(--box)' : '#fff'};font-size:13.5px;${t.hidden || ghost ? 'color:var(--mute)' : ''}">
${Icon('drag-vertical')}${t.d === 0 ? Icon(t.open ? 'angle-down-min' : 'angle-right-min') : ''}${Icon(t.d === 0 ? 'folder-o' : 'label-o')}<b style="font-weight:${on ? 800 : 600}">${t.name}</b><span style="font-size:12px;color:var(--mute)">상품 ${t.n}개</span>${t.hidden ? Badge('숨김', 'mute') : ''}<span style="flex:1"></span><span style="font-size:15px;color:var(--ink2);display:inline-flex;gap:8px">${Icon('angle-up')}${Icon('angle-down')}${t.d === 0 ? Icon('plus') : ''}${Icon('trash-o')}</span></div>`;
};

const Tree = (o = {}) => Box({ title: '카테고리', sub: '큰 분류 3 · 작은 분류 5', right: [Btn('모두 펼치기', { size: 'sm' }), Btn('큰 분류 추가', { size: 'sm', icon: 'plus' })] },
    (o.list || TREE).map((t) => Node(t, o)).join(''),
    Note('손잡이를 끌어 순서와 위치를 바꿉니다. 오른쪽 화살표로 한 칸씩 옮길 수도 있습니다. 분류는 2단계(큰 분류 > 작은 분류)까지 만들 수 있습니다.'),
    o.dirty ? `<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px 12px;background:var(--dark);color:#fff;border-radius:4px;font-size:13px">${Icon('info-o')}순서를 바꿨습니다. 저장해야 쇼핑몰에 반영됩니다.<span style="flex:1"></span><span class="wf-btn sm line" style="background:transparent;color:#fff;border-color:#fff">되돌리기</span><span class="wf-btn sm primary" style="background:#fff;color:var(--ink)">순서 저장</span></div>` : '',
);

const Panel = (o = {}) => Box({ title: o.title || '카테고리 수정', sub: o.sub || '건강식품 > 젤리스틱', right: o.isNew ? '' : Btn('이 카테고리 상품 보기', { size: 'sm', icon: 'external-link' }) },
    FormTable([
        { k: '이름', required: true, v: Input({ value: o.name === undefined ? '젤리스틱' : o.name, placeholder: '예) 젤리스틱', w: 260, error: o.nameErr, focus: o.isNew && !o.nameErr }), help: '1 ~ 20자', error: o.nameErr },
        { k: '위 분류', v: o.parentOpen ? Select({ value: '건강식품', w: 240, open: true, search: '', options: [{ t: '없음 (큰 분류로)' }, { t: '건강식품', on: true }, '소품', '기획전'] }) : Select({ value: o.parent || '건강식품', w: 240 }), help: '바꾸면 이 카테고리와 그 아래 분류·상품이 함께 옮겨집니다.' },
        { k: '노출', v: RadioGroup(['쇼핑몰에 보이기', '숨기기'], o.hidden ? '숨기기' : '쇼핑몰에 보이기'), help: '숨기면 상품 목록의 카테고리 탭과 메뉴에서 빠집니다. 안에 든 상품은 다른 카테고리나 검색으로는 계속 보입니다.' },
        { k: '대표 이미지', v: Upload({ title: '카테고리 대표 이미지 올리기 (선택)', guide: ImageGuide({ size: '1920 × 400 px', ratio: '24:5 (가로로 긴 띠)', max: '1MB 이하', ext: 'JPG · PNG · WEBP', more: ['상품 목록 화면 맨 위 띠 이미지로 쓰입니다. 없으면 카테고리 이름만 나옵니다.'] }), files: o.isNew ? [] : [{ name: 'cat_jellystick.jpg', size: '286KB · 1920 × 400', icon: 'image-o' }] }) },
        { k: '소개 문구', v: Textarea({ value: o.isNew ? '' : '하루 한 포로 챙기는 젤리스틱', placeholder: '상품 목록 화면 카테고리 이름 아래 한 줄 (선택)', h: 52, count: o.isNew ? '0 / 60' : '15 / 60' }) },
        { k: '상품 정렬 기본값', v: Select({ value: '운영자 추천순 (진열 관리에서 정한 순서)', w: 300 }) },
        { k: '주소', v: [Text('/products?category=', { sm: true, mute: true }), Input({ value: o.isNew ? '' : 'jelly-stick', placeholder: '비우면 자동', w: 180 })] },
    ]),
    `<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px">${o.isNew ? '' : Btn('삭제', 'danger')}<span style="flex:1"></span>${Btn('취소')}${Btn(o.isNew ? '카테고리 추가' : '저장', 'primary')}</div>`,
);

const Page = (...body) => AdminLayout({ active: 'a-22', actions: [Btn('내 쇼핑몰에서 보기', { icon: 'external-link' })] }, body);

const state1 = StateBlock({ idx: 1, title: '트리(드래그 순서)', note: '왼쪽에 카테고리 나무, 오른쪽에 고른 카테고리의 내용. 끌어서 순서와 위·아래 분류를 바꿉니다.' },
    Anno({ title: '왜 이렇게 하나' }, '카테고리 순서는 곧 쇼핑몰 메뉴 순서입니다. 번호를 적어 순서를 정하게 하지 않고 끌어서 옮기거나 위·아래 화살표로 한 칸씩 옮깁니다. 줄마다 상품 수를 보여 줘 빈 카테고리를 바로 알아봅니다. 순서는 옮기자마자 반영하지 않고 순서 저장을 눌러야 반영합니다(실수로 끌었을 때 되돌리기).'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '처음 설치한 몰은 카테고리가 없습니다(빈 상태). 운영자는 이름·순서·위 분류·노출·대표 이미지·소개 문구를 바꿀 수 있고, 분류 깊이는 2단계(큰 분류 > 작은 분류)까지입니다. 상품이 1개뿐인 몰(이너에라)은 카테고리를 1개만 만들어도 되고, 그때 사용자 화면 상품 목록의 카테고리 탭은 나오지 않습니다.'),
    Canvas({ label: 'A-22 · 카테고리 나무 · 젤리스틱 선택' }, Page(Grid('minmax(0,1fr) minmax(0,1.1fr)', Tree({ active: '젤리스틱' }), Panel()))),
    Canvas({ label: 'A-22 · 선물 세트를 끌어 젤리스틱 위로 옮기는 중 → 놓은 뒤 순서 저장 띠' }, Page(Grid('minmax(0,1fr) minmax(0,1.1fr)', Tree({ active: '선물 세트', ghost: '선물 세트', dropBefore: '젤리스틱', dirty: true }), Panel({ sub: '건강식품 > 선물 세트', name: '선물 세트' })))),
    Canvas({ label: 'A-22 · 카테고리가 하나도 없는 몰 (처음 설치한 상태)' }, Page(Empty({ icon: 'sitemap-o', title: '아직 카테고리가 없습니다', desc: '상품을 묶어 보여 줄 분류를 만들어 주세요. 상품이 몇 개 안 되면 1개만 만들어도 됩니다.', action: [Btn('큰 분류 추가', { kind: 'primary', icon: 'plus' })] }))),
);

const state2 = StateBlock({ idx: 2, title: '추가·수정', note: '큰 분류 추가 버튼 또는 줄의 더하기 단추를 누르면 오른쪽 내용 칸이 새 카테고리 입력으로 바뀝니다. 줄을 누르면 수정입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '추가·수정을 팝업으로 띄우지 않고 오른쪽 칸에서 합니다. 왼쪽 나무를 보면서 어디에 들어가는지 확인할 수 있고, 여러 개를 연달아 만들 때 팝업을 여닫지 않습니다.'),
    Anno({ warn: true, title: '자산 규격' }, '카테고리 머리 이미지: 1920 × 400 px · JPG·PNG·WEBP · 1MB 이하 · 선택. 이름 1 ~ 20자, 같은 위 분류 안에서 겹치면 안 됩니다. 소개 문구 60자.'),
    Canvas({ label: 'A-22 · 건강식품 줄의 더하기 단추 → 새 작은 분류 입력' }, Page(Grid('minmax(0,1fr) minmax(0,1.1fr)', Tree({ active: '건강식품' }), Panel({ isNew: true, title: '카테고리 추가', sub: '건강식품 아래', name: '' })))),
    CanvasRow(
        Canvas({ size: 'auto', label: '이름이 겹침 → 오류', right: '입력칸만', pad: 20 }, `<div style="width:560px">${FormTable([{ k: '이름', required: true, v: Input({ value: '젤리스틱', w: 260, error: true }), error: "건강식품 아래에 이미 '젤리스틱'이 있습니다. 다른 이름을 적어 주세요." }])}</div>`),
        Canvas({ size: 'auto', label: '위 분류 칸을 누름 → 검색형 목록', right: '입력칸만', pad: 20 }, `<div style="width:300px;min-height:240px">${Select({ value: '건강식품', w: 240, open: true, search: '', options: [{ t: '없음 (큰 분류로)' }, { t: '건강식품', on: true }, '소품', '기획전', { t: '젤리스틱 (자기 자신)', disabled: true }] })}</div>`),
    ),
    Canvas({ label: 'A-22 · 노출을 숨기기로 바꿔 저장 → 완료 안내' }, Overlay({ bg: Page(Grid('minmax(0,1fr) minmax(0,1.1fr)', Tree({ active: '이너뷰티', list: TREE.map((t) => (t.name === '이너뷰티' ? { ...t, hidden: true } : t)) }), Panel({ sub: '건강식품 > 이너뷰티', name: '이너뷰티', hidden: true }))), dim: false, align: 'top', h: 360 },
        Toast("'이너뷰티'를 숨겼습니다. 쇼핑몰 메뉴와 카테고리 탭에서 빠졌습니다.", { action: '되돌리기' }))),
);

const blockBg = Page(Grid('minmax(0,1fr) minmax(0,1.1fr)', Tree({ active: '젤리스틱' }), Panel()));

const state3 = StateBlock({ idx: 3, title: '상품 있는 카테고리 삭제 막힘', note: '상품이나 아래 분류가 들어 있는 카테고리는 바로 지울 수 없습니다. 상품을 다른 카테고리로 옮기거나 숨기는 방법을 안내합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '카테고리를 지우는 순간 그 안의 상품이 쇼핑몰에서 길을 잃습니다(어느 목록에도 안 나옴). 그래서 지우기 전에 상품을 옮길 곳을 고르게 하고, 당장 정리하기 어려우면 숨기기를 권합니다. 빈 카테고리는 확인만 하고 바로 지웁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '삭제하려는 카테고리가 메인 진열 영역·상단 메뉴·기획전·쿠폰 적용 대상에 걸려 있으면 어디에 걸려 있는지도 함께 알려 줍니다. 지우면 그 연결도 함께 풀립니다.'),
    Canvas({ label: 'A-22 · 상품 2개가 든 젤리스틱 삭제 버튼 → 막힘 팝업' }, Overlay({ bg: blockBg, h: 560 },
        `<div class="wf-modal" style="width:520px"><div class="mh"><b>'젤리스틱'은 바로 삭제할 수 없습니다</b>${Icon('close')}</div><div class="mb">
${Text('이 카테고리에 <b>상품 2개</b>가 들어 있습니다. 상품을 옮길 곳을 정하거나 숨기기를 써 주세요.')}
${Table({ dense: true, cols: [{ t: '', w: 44 }, '들어 있는 상품', { t: '다른 카테고리', w: 150 }], rows: [
        [Thumb(32), '이너에라 롱지비티 석류맛 젤리스틱 20 g × 14포', '이너뷰티에도 있음'],
        [Thumb(32), '이너에라 롱지비티 체험 3포', `${Badge('이 카테고리뿐', 'warn')}`],
    ] })}
${FormTable([{ k: '상품을 옮길 곳', required: true, v: Select({ value: '건강식품 > 이너뷰티', w: 260 }), help: '이 카테고리뿐인 상품 1개가 옮겨집니다. 다른 카테고리에도 있는 상품은 이 카테고리만 빠집니다.' }])}
${Note('걸려 있는 곳: 디자인 > 메뉴의 상단 메뉴 1곳 · 쿠폰 「젤리스틱 10% 할인」 적용 대상. 삭제하면 함께 풀립니다.', { warn: true })}
</div><div class="mf">${Btn('취소')}${Btn('삭제 대신 숨기기')}${Btn('상품 옮기고 삭제', 'danger')}</div></div>`)),
    CanvasRow(
        Canvas({ size: 'auto', label: '아래 분류가 있는 큰 분류(건강식품) 삭제 → 막힘', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: "'건강식품'은 삭제할 수 없습니다", desc: '아래에 작은 분류 3개(젤리스틱 · 이너뷰티 · 선물 세트)와 상품 4개가 있습니다.<br>작은 분류를 먼저 다른 곳으로 옮기거나 삭제한 뒤 다시 시도해 주세요.', foot: [Btn('닫기'), Btn('삭제 대신 숨기기', 'primary')] })),
        Canvas({ size: 'auto', label: '상품이 없는 카테고리(11월 감사제) 삭제 → 확인만', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: "'11월 감사제'를 삭제할까요?", desc: '들어 있는 상품이 없습니다. 삭제하면 되돌릴 수 없습니다.', ok: '삭제', danger: true })),
    ),
    Canvas({ size: 'auto', label: '옮길 곳 칸을 누름 → 검색형 목록 (삭제하려는 카테고리는 고를 수 없음)', right: '입력칸만', pad: 20 }, `<div style="width:320px;min-height:250px">${Select({ value: '건강식품 > 이너뷰티', w: 260, open: true, search: '', options: [{ t: '건강식품 > 젤리스틱', sub: '삭제 대상', disabled: true }, { t: '건강식품 > 이너뷰티', on: true }, '건강식품 > 선물 세트', '소품', { t: '카테고리 없음으로 두기', sub: '검색으로만 찾을 수 있음' }] })}</div>`),
);

export default function A22() {
    return [state1, state2, state3].join('');
}
