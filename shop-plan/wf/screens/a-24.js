import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Input, Select, Check, RadioGroup, Toggle,
    FormTable, Table, Tabs, Overlay, Modal, Toast, Box, Note, Text, Icon, Grid, Thumb, Empty, Pager, SHOP,
} from '../lib/blocks.js';

const AREAS = [
    { t: '메인 · 상품 진열 (베스트)', n: 4 },
    { t: '메인 · 함께 보면 좋은 상품', n: 2 },
    { t: '카테고리 · 건강식품 추천순', n: 4 },
    { t: '장바구니 · 같이 담기 좋은 상품', n: 0 },
];

const PRODS = [
    { name: SHOP.product, price: '49,000원', stock: '540개', state: '판매중' },
    { name: '이너에라 롱지비티 선물 세트 (2박스 + 쇼핑백)', price: '95,000원', stock: '42개', state: '판매중' },
    { name: '이너에라 스틱 보관 케이스', price: '9,000원', stock: '86개', state: '판매중' },
    { name: '이너에라 롱지비티 체험 3포', price: '9,900원', stock: '0개', state: '품절' },
];

const saleBadge = (s) => Badge(s, { 판매중: 'solid', 품절: 'strike', 판매중지: 'mute' }[s]);

const Row = (p, i, o = {}) => `${o.drop ? '<div style="height:0;border-top:3px solid var(--dark);margin:2px 0 6px"></div>' : ''}<div class="wf-dragrow${o.off ? ' off' : ''}"${o.ghost ? ' style="border-style:dashed;opacity:.55"' : o.lift ? ' style="border:2px solid var(--dark);box-shadow:0 6px 16px rgba(0,0,0,.18)"' : ''}>${Icon('drag-vertical')}<b style="width:22px;text-align:center;font-size:13px">${i}</b>${Thumb(44)}<div class="dc"><b style="font-size:13.5px">${p.name}</b><div style="font-size:12px;color:var(--mute)">${p.price} · 재고 ${p.stock}${o.msg ? ` · <b style="color:var(--ink)">${o.msg}</b>` : ''}</div></div>${saleBadge(p.state)}<span style="font-size:16px;color:var(--ink2);display:inline-flex;gap:8px;margin-left:8px">${Icon('angle-up')}${Icon('angle-down')}${Icon('trash-o')}</span></div>`;

const AreaList = (active) => `<div>${AREAS.map((a) => `<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;margin-bottom:6px;border:${a.t === active ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:4px;background:${a.t === active ? 'var(--box)' : '#fff'};font-size:13px"><b style="font-weight:${a.t === active ? 800 : 500}">${a.t}</b><span style="flex:1"></span><span style="font-size:12px;color:var(--mute)">${a.n}개</span></div>`).join('')}${Note('진열 영역은 디자인 > 메인 화면 구성의 상품 진열 블록과 카테고리마다 하나씩 자동으로 생깁니다. 영역을 더하려면 메인 화면 구성에서 상품 진열 블록을 추가하세요.')}</div>`;

const AreaSet = (o = {}) => FormTable([
    { k: '채우는 방법', v: RadioGroup(['직접 고른 상품', '자동(판매량 많은 순)', '자동(새로 등록한 순)'], o.auto ? '자동(판매량 많은 순)' : '직접 고른 상품'), help: '자동을 고르면 아래 목록 대신 기준(기간·카테고리·개수)을 정하고, 순서는 매일 새벽에 다시 계산됩니다.' },
    { k: '보여 줄 개수', v: [Select({ value: 'PC 4개 · 모바일 2개씩 2줄', w: 240 }), Text('목록이 이보다 많으면 앞에서부터 잘라 보여 줍니다', { sm: true, mute: true })] },
    { k: '품절 상품', v: RadioGroup(['맨 뒤로 보내기', '숨기기', '그대로 두기'], '맨 뒤로 보내기') },
]);

const Page = (active, ...body) => AdminLayout({ active: 'a-24', actions: [Btn('PC 미리보기', { icon: 'desktop' }), Btn('모바일 미리보기', { icon: 'mobile' })] },
    Grid('280px minmax(0,1fr)', Box({ title: '진열 영역' }, AreaList(active)), `<div>${body.flat(Infinity).join('')}</div>`));

const SaveStrip = (text) => `<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px 12px;background:var(--dark);color:#fff;border-radius:4px;font-size:13px">${Icon('info-o')}${text}<span style="flex:1"></span><span class="wf-btn sm line" style="background:transparent;color:#fff;border-color:#fff">되돌리기</span><span class="wf-btn sm primary" style="background:#fff;color:var(--ink)">순서 저장</span></div>`;

const BEST = '메인 · 상품 진열 (베스트)';

const state1 = StateBlock({ idx: 1, title: '메인 진열 영역별 상품 순서(드래그)', note: '왼쪽에서 진열 영역을 고르고, 오른쪽에서 그 영역에 나올 상품과 순서를 정합니다. 끌거나 위·아래 화살표로 옮깁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '메인에 무엇을 먼저 보여 줄지는 운영자가 매주 바꾸는 일입니다. 상품마다 진열 순서 번호를 적게 하면 번호가 겹치고 밀립니다. 영역을 고르고 목록을 끌어서 순서를 정하면 보이는 순서가 곧 진열 순서입니다. 판매중지·전시 안 함이 된 상품은 목록에 남되 고객 화면에서는 빠진다고 줄에 표시합니다.'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '초기값: 영역마다 비어 있음(빈 영역은 고객 화면에서 블록째 숨김) · 직접 고른 상품 · 품절은 맨 뒤로. 운영자는 상품·순서·채우는 방법·개수·품절 처리 방식을 바꿉니다. 영역 자체의 제목·위치·모양은 디자인 > 메인 화면 구성에서 바꿉니다. 상품이 1개뿐인 몰(이너에라)은 상품 1개만 넣어도 블록이 자연스럽게 1개 모양으로 나옵니다.'),
    Canvas({ label: 'A-24 · 메인 · 상품 진열 (베스트) 영역 · 상품 4개' }, Page(BEST,
        Box({ title: BEST, sub: '상품 4개 · 마지막 저장 11-10 17:50 이보림', right: Btn('상품 고르기', { kind: 'primary', size: 'sm', icon: 'plus' }) },
            AreaSet(),
            '<div style="height:14px"></div>',
            PRODS.map((p, i) => Row(p, i + 1, p.state === '품절' ? { off: true, msg: '품절 — 맨 뒤로 보내기 설정에 따라 마지막에 표시' } : {})).join(''),
            Note('금액은 예시 값입니다. 고객 화면에는 위에서부터 PC 4개, 모바일 2개씩 2줄로 나옵니다.'),
        ))),
    Canvas({ label: 'A-24 · 3번 상품을 끌어 1번 위로 옮기는 중 → 놓으면 순서 저장 띠' }, Page(BEST,
        Box({ title: BEST, sub: '상품 4개 · 저장하지 않은 변경 있음', right: Btn('상품 고르기', { kind: 'primary', size: 'sm', icon: 'plus' }) },
            Row(PRODS[2], 1, { lift: true, drop: true }),
            Row(PRODS[0], 2),
            Row(PRODS[1], 3),
            Row(PRODS[2], '', { ghost: true }),
            Row(PRODS[3], 4, { off: true }),
            SaveStrip('순서를 바꿨습니다. 저장해야 쇼핑몰에 반영됩니다.'),
        ))),
    Canvas({ label: 'A-24 · 채우는 방법 = 자동(판매량 많은 순) — 목록 대신 기준 입력' }, Page(BEST,
        Box({ title: BEST, sub: '자동으로 채움 · 마지막 계산 11-11 04:00' },
            FormTable([
                { k: '채우는 방법', v: RadioGroup(['직접 고른 상품', '자동(판매량 많은 순)', '자동(새로 등록한 순)'], '자동(판매량 많은 순)') },
                { k: '판매량 기준 기간', v: Select({ value: '최근 30일', w: 160 }) },
                { k: '대상 카테고리', v: [Select({ value: '전체 카테고리', w: 240 }), Check('품절 상품 빼기', { on: true })] },
                { k: '보여 줄 개수', v: Select({ value: 'PC 4개 · 모바일 2개씩 2줄', w: 240 }) },
                { k: '맨 앞에 고정', v: [`<span style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px">${Thumb(28)}${SHOP.productShort}</span>`, Btn('고정할 상품 고르기', { size: 'sm' })], help: '자동으로 채우더라도 꼭 먼저 보여 줄 상품을 3개까지 맨 앞에 고정할 수 있습니다.' },
            ]),
            '<div style="height:14px"></div>',
            Text('지금 기준으로 나오는 상품 (미리 보기)', { b: true, sm: true }),
            Table({ dense: true, cols: [{ t: '순서', w: 50 }, '상품명', { t: '최근 30일 판매', w: 120, align: 'right' }, { t: '판매상태', w: 90 }], rows: [
                ['1', `${SHOP.product} ${Badge('고정', 'bold')}`, '412개', saleBadge('판매중')],
                ['2', '이너에라 롱지비티 선물 세트 (2박스 + 쇼핑백)', '96개', saleBadge('판매중')],
                ['3', '이너에라 스틱 보관 케이스', '51개', saleBadge('판매중')],
            ] }),
        ))),
    Canvas({ label: 'A-24 · 비어 있는 영역 (장바구니 · 같이 담기 좋은 상품)' }, Page('장바구니 · 같이 담기 좋은 상품',
        Box({ title: '장바구니 · 같이 담기 좋은 상품', sub: '상품 0개' },
            Empty({ icon: 'apps', title: '이 영역에 넣은 상품이 없습니다', desc: '비어 있는 영역은 고객 화면에서 블록째 보이지 않습니다. 상품을 고르면 바로 나타납니다.', action: [Btn('상품 고르기', { kind: 'primary', icon: 'plus' })] }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '순서 저장 → 완료 안내', right: '안내만', pad: 20 }, Toast('진열 순서를 저장했습니다. 쇼핑몰 메인에 바로 반영됩니다.', { action: '내 쇼핑몰에서 보기' })),
        Canvas({ size: 'auto', label: '저장하지 않고 다른 영역을 누름', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:380px"><div class="mb"><b class="ct">순서를 저장하지 않았습니다</b><p>메인 · 상품 진열 (베스트)에서 바꾼 순서가 저장되지 않았습니다.</p></div><div class="mf">${Btn('저장 없이 이동')}${Btn('저장하고 이동', 'primary')}</div></div>`),
    ),
);

const PICK = [
    { name: SHOP.product, cat: '건강식품 > 젤리스틱', price: '49,000원', stock: '540', state: '판매중', in: true },
    { name: '이너에라 롱지비티 선물 세트 (2박스 + 쇼핑백)', cat: '건강식품 > 선물 세트', price: '95,000원', stock: '42', state: '판매중', in: true },
    { name: '이너에라 스틱 보관 케이스', cat: '소품', price: '9,000원', stock: '86', state: '판매중' },
    { name: '이너에라 쇼핑백 (소)', cat: '소품', price: '500원', stock: '400', state: '판매중', hide: true },
];
const PICK_COLS = [{ t: '', w: 44 }, '상품명 · 카테고리', { t: '판매가', w: 90, align: 'right' }, { t: '재고', w: 70, align: 'right' }, { t: '판매상태', w: 80 }, { t: '전시', w: 90 }];
const pickRow = (p) => ({ dim: p.in, nocheck: p.in, c: [Thumb(32), `${p.name}<small>${p.cat}${p.in ? ' · 이미 이 영역에 있음' : ''}</small>`, p.price, p.stock, saleBadge(p.state), p.hide ? Badge('전시 안 함', 'mute') : Badge('전시함', 'check')] });

const PickModal = (o = {}) => Modal({ title: '진열할 상품 고르기 · 메인 · 함께 보면 좋은 상품', w: 760, foot: [Text(o.count ? `${o.count}개 선택` : '선택한 상품 없음', { sm: true }), Btn('취소'), Btn(o.count ? `${o.count}개 추가` : '추가', { kind: 'primary', disabled: !o.count })] },
    `<div style="display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap">${Input({ value: o.q || '', placeholder: '상품명 · 관리코드로 찾기', icon: 'search', w: 280, focus: true })}${o.catOpen ? Select({ value: '', placeholder: '카테고리 전체', w: 200, open: true, search: '', options: [{ t: '카테고리 전체', on: true }, '건강식품', '건강식품 > 젤리스틱', '건강식품 > 선물 세트', '소품', '기획전'] }) : Select({ placeholder: '카테고리 전체', w: 200 })}<span style="display:inline-flex;align-items:center;min-height:36px;gap:14px">${Check('판매중만', { on: o.all ? false : true })}${Check('전시함만', { on: true })}</span></div>`,
    '<div style="height:10px"></div>',
    o.empty
        ? Empty({ icon: 'search', title: `'${o.q}'으로 찾은 판매중 상품이 없습니다`, desc: '품절·판매중지 상품까지 보려면 판매중만 체크를 풀어 주세요.', action: [Btn('판매중만 풀고 다시 찾기')] })
        : [Table({ check: true, checked: o.checked || [], dense: true, cols: PICK_COLS, rows: o.rows || PICK.filter((p) => !p.hide).map(pickRow) }), Pager({ page: 1, last: 1 })],
    o.note ? Note(o.note, { warn: true }) : Note('이미 이 영역에 있는 상품은 흐리게 보이고 다시 고를 수 없습니다. 고른 상품은 목록 맨 아래에 추가되며 순서는 닫은 뒤 끌어서 바꿉니다.'),
);

const pickBg = Page('메인 · 함께 보면 좋은 상품', Box({ title: '메인 · 함께 보면 좋은 상품', sub: '상품 2개' }, PRODS.slice(0, 2).map((p, i) => Row(p, i + 1)).join('')));

const state2 = StateBlock({ idx: 2, title: '상품 고르기 팝업(검색형, 판매중만)', note: '상품 고르기 버튼을 누르면 뜨는 팝업. 이름으로 찾고 여러 개를 체크해 한 번에 넣습니다. 기본으로 판매중 · 전시함 상품만 보입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품이 수백 개인 몰에서 선택 목록을 내려 가며 찾을 수 없으므로 검색이 먼저입니다. 팔 수 없는 상품을 메인에 걸어 두는 실수를 막으려고 판매중만을 기본으로 켜 두되, 곧 재입고될 상품을 미리 걸어 두는 경우를 위해 체크를 풀 수 있습니다. 이 팝업은 기획전 상품 묶음·추가구성상품·쿠폰 적용 상품을 고를 때도 같은 모양으로 씁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '한 영역에 넣을 수 있는 상품은 최대 100개. 판매중만을 풀고 품절·판매중지 상품을 고르면 고객 화면에 어떻게 보이는지(품절 표시 / 보이지 않음) 팝업 아래에 알려 줍니다.'),
    Canvas({ label: 'A-24 · 상품 고르기 버튼 → 팝업 · 1개 체크' }, Overlay({ bg: pickBg, h: 620 }, PickModal({ count: 1, checked: [0] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '카테고리 칸을 누름 → 검색형 목록', right: '팝업만', pad: 20 }, PickModal({ catOpen: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: "판매중만을 풀고 '체험'으로 찾음 → 품절 상품을 고름", right: '팝업만', pad: 20 }, PickModal({ q: '체험', all: true, count: 1, checked: [0], rows: [{ on: true, c: [Thumb(32), '이너에라 롱지비티 체험 3포<small>건강식품 > 젤리스틱</small>', '9,900원', '0', saleBadge('품절'), Badge('전시함', 'check')] }], note: '품절 상품 1개를 골랐습니다. 이 영역의 품절 상품 설정(맨 뒤로 보내기)에 따라 마지막에 품절 표시로 나옵니다.' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '찾는 상품이 없을 때', right: '팝업만', pad: 20 }, PickModal({ q: '레몬', empty: true })),
    ),
    Canvas({ label: 'A-24 · 1개 추가 뒤 — 목록 맨 아래에 들어옴 + 순서 저장 띠' }, Page('메인 · 함께 보면 좋은 상품',
        Box({ title: '메인 · 함께 보면 좋은 상품', sub: '상품 3개 · 저장하지 않은 변경 있음', right: Btn('상품 고르기', { kind: 'primary', size: 'sm', icon: 'plus' }) },
            Row(PRODS[0], 1), Row(PRODS[1], 2), Row(PRODS[2], 3, { lift: true, msg: '방금 추가' }),
            SaveStrip('상품 1개를 추가했습니다. 저장해야 쇼핑몰에 반영됩니다.'),
        ))),
);

export default function A24() {
    return [state1, state2].join('');
}
