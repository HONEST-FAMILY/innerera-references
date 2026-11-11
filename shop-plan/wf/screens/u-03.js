import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Chip, Chips, Check, CheckGroup, Input, Select, Img, Icon, Overlay, BottomSheet, MobilePage, UserPage,
    Empty, Tabs, Pager, ProductCard, ProductGrid, Note, Stars, SHOP,
} from '../lib/blocks.js';

const CSS = `<style>
.u03-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 0 0 16px; font-size: 13.5px; }
.u03-bar .l, .u03-bar .r { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.u03-filter { border: 1px solid var(--line); border-radius: 6px; margin-bottom: 16px; font-size: 13.5px; }
.u03-filter .fr { display: flex; border-bottom: 1px solid var(--line2); }
.u03-filter .fr:last-child { border-bottom: 0; }
.u03-filter .fk { width: 110px; flex: none; padding: 14px 16px; font-weight: 700; background: var(--box); }
.u03-filter .fv { flex: 1; padding: 8px 16px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.u03-applied { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; font-size: 13px; }
.u03-cats { display: flex; gap: 6px; overflow: hidden; margin: 0 -16px 12px; padding: 0 16px; }
.u03-cats > * { flex: none; }
.u03-one { display: grid; grid-template-columns: 480px 1fr; gap: 48px; align-items: center; border: 1px solid var(--line); border-radius: 8px; padding: 28px; }
.u03-set { display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--line); border-radius: 6px; padding: 12px 14px; margin-bottom: 8px; font-size: 13.5px; }
.u03-set em { font-style: normal; color: var(--mute); font-size: 12.5px; margin-left: 6px; }
</style>`;

const IMG = '상품 대표 이미지 1000 × 1000';
const ITEMS = [
    { name: '코튼 옥스퍼드 셔츠', desc: '화이트 · 스카이블루 · 네이비', price: '59,000원', badge: ['신상품'], reviews: 84 },
    { name: '울 블렌드 하프 코트', desc: '차콜 · 베이지', price: '189,000원', orig: '210,000원', rate: '10%', badge: ['무료배송'], reviews: 212 },
    { name: '와이드 데님 팬츠', desc: '인디고 · 블랙', price: '69,000원', reviews: 57 },
    { name: '소프트 터틀넥 니트', desc: '아이보리 · 그레이 · 블랙', price: '49,000원', badge: ['신상품'], reviews: 132 },
    { name: '스트라이프 롱슬리브 티셔츠', desc: '네이비 · 그린', price: '32,000원', reviews: 41 },
    { name: '플리츠 미디 스커트', desc: '블랙 · 카키', price: '54,000원', orig: '68,000원', rate: '20%', reviews: 76 },
    { name: '캐시미어 머플러', desc: '그레이 · 버건디', price: '45,000원', reviews: 31 },
    { name: '라운드 가디건', desc: '오트밀 · 네이비', price: '62,000원', reviews: 9 },
].map((x) => ({ imgLabel: IMG, ...x }));

const CATS = [{ t: '전체', n: 48 }, { t: '아우터', n: 9 }, { t: '상의', n: 18 }, { t: '하의', n: 11 }, { t: '원피스', n: 4 }, { t: '액세서리', n: 6 }];
const SORTS = ['추천순', '신상품순', '판매 많은 순', '낮은 가격순', '높은 가격순', '리뷰 많은 순'];

const Bar = (total, o = {}) => `<div class="u03-bar"><div class="l"><span>상품 <b>${total}</b>개</span>${o.left || ''}</div><div class="r">${Check('품절 상품 빼고 보기', { on: o.hideSold })}${Btn(o.filterN ? `필터 ${o.filterN}` : '필터', { icon: 'filter', kind: o.filterOpen || o.filterN ? 'primary' : 'line' })}${o.sortOpen ? Select({ value: '추천순', w: 150, open: true, options: SORTS.map((s) => ({ t: s, on: s === '추천순' })) }) : Select({ value: o.sort || '추천순', w: 150 })}</div></div>`;

const FilterPanel = (picked = {}) => `<div class="u03-filter">
<div class="fr"><div class="fk">가격</div><div class="fv">${Chips(['전체', '3만원 이하', '3 ~ 5만원', '5 ~ 10만원', '10만원 이상'], picked.price || '전체')}<span style="margin-left:8px;color:var(--mute)">직접 입력</span>${Input({ value: picked.min || '', placeholder: '최소', suffix: '원', w: 120 })}<span>~</span>${Input({ value: picked.max || '', placeholder: '최대', suffix: '원', w: 120 })}</div></div>
<div class="fr"><div class="fk">색상</div><div class="fv">${CheckGroup(['화이트', '아이보리', '그레이', '블랙', '네이비', '베이지', '카키'], picked.color || [])}</div></div>
<div class="fr"><div class="fk">사이즈</div><div class="fv">${CheckGroup(['S', 'M', 'L', 'XL'], picked.size || [])}</div></div>
<div class="fr"><div class="fk">혜택</div><div class="fv">${CheckGroup(['무료배송', '할인 중', '신상품'], picked.benefit || [])}</div></div>
<div class="fr"><div class="fk"></div><div class="fv" style="justify-content:flex-end">${Btn('초기화', { icon: 'refresh' })}${Btn(picked.n !== undefined ? `상품 ${picked.n}개 보기` : '상품 48개 보기', 'primary')}</div></div>
</div>`;

const Page = (cat, ...body) => UserPage({ active: '상품', crumb: ['홈', '상품', cat].filter(Boolean), title: '상품' }, CSS, Tabs(CATS, cat || '전체'), body);

const MHead = (cat, o = {}) => `${CSS}<div class="u03-cats" data-clip="1">${CATS.map((c) => Chip(`${c.t} ${c.n}`, { on: c.t === cat })).join('')}</div><div class="u03-bar" style="font-size:12.5px"><span>상품 <b>${o.total === undefined ? 48 : o.total}</b>개</span><div class="r"><span>${o.sort || '추천순'} ${Icon('angle-down-min')}</span><span style="border:1px solid var(--line);border-radius:4px;padding:4px 8px;${o.filterN ? 'background:var(--dark);color:#fff' : ''}">${Icon('filter')} 필터${o.filterN ? ` ${o.filterN}` : ''}</span></div></div>`;

const state1 = StateBlock({ idx: 1, title: '기본(카테고리 탭·정렬)', note: '주소 /products. 상단 메뉴 상품 또는 모바일 탭바 카테고리를 누르면 열립니다. 상품이 여럿인 몰의 모습입니다(다른 업종 예시: 의류). 이너에라처럼 상품이 1개인 몰은 5번 상태로 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '카테고리 탭은 관리자 상품 > 카테고리(A-22)의 1단계 분류가 순서대로 나오고 숫자는 판매중 상품 수입니다. 상품이 0개인 카테고리는 탭에서 빠집니다. 2단계 분류가 있으면 탭 아래 작은 칩으로 나옵니다. 주소에 category 와 sort 가 남아 링크를 공유해도 같은 화면이 열립니다.'),
    Anno({ title: '초기값 · 관리자가 바꾸는 범위' }, '정렬 초기값은 추천순(운영자가 진열 관리에서 정한 순서 → 없으면 신상품순)입니다. PC는 4열 · 한 쪽 20개 쪽 번호, 모바일은 2열 · 아래로 내리면 20개씩 이어 붙습니다. 카드의 리뷰 별점은 리뷰 기능을 끈 몰에서는 보이지 않고, 찜 하트는 비로그인이 누르면 로그인 안내가 뜹니다. 대표 이미지 1000 × 1000 px(1:1), 5MB 이하, JPG · PNG · WEBP.'),
    Canvas({ label: 'U-03 · 상품 목록 기본 · 전체 탭 · 추천순(다른 업종 예시: 의류)' }, Page('',
        Bar(48),
        ProductGrid(ITEMS.map(ProductCard), 4),
        Pager({ page: 1, last: 3 }),
    )),
    Canvas({ label: 'U-03 · 상의 탭 선택(2단계 분류 칩) → 정렬 목록을 연 모습', h: 560 }, Page('상의',
        Chips(['상의 전체', '셔츠', '니트', '티셔츠'], '상의 전체'), '<div style="height:16px"></div>',
        Bar(18, { sortOpen: true }),
        ProductGrid(ITEMS.slice(0, 4).map(ProductCard), 4),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-03 · 모바일 · 2열 · 카테고리는 좌우로 밀기 · 탭바 카테고리 선택됨' }, MobilePage({ tab: '카테고리', cart: 1 },
            MHead('전체'),
            ProductGrid(ITEMS.slice(0, 6).map((x) => ProductCard({ ...x, imgLabel: '대표 이미지' })), 2),
            `<p style="text-align:center;font-size:12px;color:var(--mute);margin:16px 0 0">아래로 내리면 20개씩 이어서 나옵니다 · 6 / 48</p>`,
        )),
        Canvas({ size: 'mobile', label: 'U-03 · 모바일 · 정렬 누름 → 아래에서 올라오는 정렬 고르기' }, Overlay({ bg: MobilePage({ tab: '카테고리' }, MHead('전체'), ProductGrid(ITEMS.slice(0, 4).map((x) => ProductCard({ ...x, imgLabel: '대표 이미지' })), 2)), align: 'bottom', h: 720 },
            BottomSheet({ title: '정렬' }, SORTS.map((s) => `<div style="display:flex;justify-content:space-between;padding:13px 4px;border-bottom:1px solid var(--line2);font-size:14.5px;${s === '추천순' ? 'font-weight:800' : ''}">${s}${s === '추천순' ? Icon('check') : ''}</div>`).join('')))),
    ),
);

const APPLIED = `<div class="u03-applied"><b>적용한 필터</b>${Chip('5 ~ 10만원', { close: true })}${Chip('색상 네이비', { close: true })}${Chip('사이즈 M', { close: true })}<span style="text-decoration:underline;color:var(--ink2)">${Icon('refresh')} 전체 해제</span></div>`;

const state2 = StateBlock({ idx: 2, title: '필터 적용', note: '필터 버튼을 누르면 조건 영역이 펼쳐지고, 고른 조건은 목록 위에 칩으로 남습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '필터 항목은 고정이 아닙니다. 가격 · 혜택은 모든 몰 공통이고, 색상 · 사이즈 같은 줄은 그 카테고리 상품들의 옵션 이름(관리자 상품 등록에서 정한 옵션 축)에서 자동으로 만들어집니다. 그래서 식품몰이면 맛 · 용량이, 의류몰이면 색상 · 사이즈가 나옵니다. 옵션이 없는 상품만 있는 몰은 가격 · 혜택 줄만 보입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '조건을 고를 때마다 맨 아래 버튼의 상품 수가 바로 바뀌어 0개가 될 조합을 미리 알 수 있습니다. 칩의 닫기를 누르면 그 조건만 빠지고, 전체 해제는 카테고리와 정렬은 그대로 둔 채 필터만 지웁니다.'),
    Canvas({ label: 'U-03 · 필터 버튼 → 조건 영역 펼침 · 조건 3개 고른 뒤(아직 보기 누르기 전)' }, Page('상의',
        Bar(18, { filterOpen: true }),
        FilterPanel({ price: '5 ~ 10만원', color: ['네이비'], size: ['M'], n: 3 }),
        ProductGrid(ITEMS.slice(0, 4).map(ProductCard), 4),
    )),
    Canvas({ label: 'U-03 · 상품 3개 보기 누름 → 필터 적용된 목록(조건 칩 · 전체 해제)' }, Page('상의',
        Bar(3, { filterN: 3 }),
        APPLIED,
        ProductGrid([ITEMS[0], ITEMS[7], { ...ITEMS[3], name: '브이넥 울 니트', desc: '네이비 · 그레이', price: '72,000원' }].map(ProductCard), 4),
        Pager({ page: 1, last: 1 }),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-03 · 모바일 · 필터 누름 → 필터 시트(조건 고르는 중)' }, Overlay({ bg: MobilePage({ tab: '카테고리' }, MHead('상의')), align: 'bottom', h: 720 },
            BottomSheet({ title: '필터', foot: [Btn('초기화', { icon: 'refresh' }), Btn('상품 3개 보기', 'primary')] },
                `<b style="font-size:13.5px">가격</b><div style="margin:8px 0 16px">${Chips(['전체', '3만원 이하', '3 ~ 5만원', '5 ~ 10만원', '10만원 이상'], '5 ~ 10만원')}</div>`,
                `<b style="font-size:13.5px">색상</b><div style="margin:8px 0 16px">${Chips(['화이트', '아이보리', '그레이', '블랙', '네이비', '베이지'], '네이비')}</div>`,
                `<b style="font-size:13.5px">사이즈</b><div style="margin:8px 0 16px">${Chips(['S', 'M', 'L', 'XL'], 'M')}</div>`,
                `<b style="font-size:13.5px">혜택</b><div style="margin:8px 0 4px">${Chips(['무료배송', '할인 중', '신상품'], '')}</div>`,
            ))),
        Canvas({ size: 'mobile', label: 'U-03 · 모바일 · 필터 3개 적용된 목록' }, MobilePage({ tab: '카테고리' },
            MHead('상의', { total: 3, filterN: 3 }),
            `<div class="u03-cats" data-clip="1" style="margin-bottom:14px">${Chip('5 ~ 10만원', { close: true })}${Chip('색상 네이비', { close: true })}${Chip('사이즈 M', { close: true })}${Chip('전체 해제', { icon: 'refresh' })}</div>`,
            ProductGrid([ITEMS[0], ITEMS[7]].map((x) => ProductCard({ ...x, imgLabel: '대표 이미지' })), 2),
        )),
    ),
);

const state3 = StateBlock({ idx: 3, title: '결과 없음', note: '필터 조합에 맞는 상품이 없거나, 카테고리에 판매중 상품이 하나도 없을 때.' },
    Anno({ title: '왜 이렇게 하나' }, '빈 화면에서 고객이 나가지 않도록 왜 비었는지(필터 때문인지, 카테고리가 비었는지)를 구분해 말하고 바로 풀 수 있는 버튼을 줍니다. 필터 때문이면 필터 초기화, 카테고리가 비었으면 전체 상품 보기입니다.'),
    Anno({ title: '빈 상태 구분' }, '운영자가 카테고리의 상품을 전부 판매중지하거나 전시를 끄면 그 카테고리는 탭에서 사라지지만, 예전 링크로 들어온 고객에게는 아래 두 번째 화면이 나옵니다. 몰 전체에 상품이 0개(막 설치한 몰)일 때는 문구가 곧 상품이 준비됩니다로 바뀝니다.'),
    Canvas({ label: 'U-03 · 필터 조합에 맞는 상품 0개' }, Page('아우터',
        Bar(0, { filterN: 2 }),
        `<div class="u03-applied"><b>적용한 필터</b>${Chip('3만원 이하', { close: true })}${Chip('사이즈 XL', { close: true })}<span style="text-decoration:underline;color:var(--ink2)">${Icon('refresh')} 전체 해제</span></div>`,
        Empty({ icon: 'search', title: '조건에 맞는 상품이 없습니다', desc: '고른 조건을 줄이거나 다른 카테고리를 살펴보세요.', action: [Btn('필터 초기화', { kind: 'primary', icon: 'refresh' }), Btn('전체 상품 보기')] }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '카테고리에 판매중 상품이 없음(예전 링크로 들어옴)', right: '본문만', pad: 20 },
            `<div style="width:560px">${Empty({ icon: 'box', title: '이 카테고리에는 지금 판매 중인 상품이 없습니다', desc: '다른 카테고리의 상품을 살펴보세요.', action: Btn('전체 상품 보기', 'primary') })}</div>`),
        Canvas({ size: 'auto', label: '몰 전체에 상품 0개(막 설치한 몰 · 초기 상태)', right: '본문만', pad: 20 },
            `<div style="width:560px">${Empty({ icon: 'box', title: '곧 상품이 준비됩니다', desc: '조금만 기다려 주세요. 새 상품 소식은 공지사항에서 알려 드립니다.', action: Btn('공지사항 보기') })}</div>`),
        Canvas({ size: 'mobile', label: 'U-03 · 모바일 · 필터 결과 0개' }, MobilePage({ tab: '카테고리' },
            MHead('아우터', { total: 0, filterN: 2 }),
            Empty({ icon: 'search', title: '조건에 맞는 상품이 없습니다', desc: '고른 조건을 줄이거나 다른 카테고리를 살펴보세요.', action: [Btn('필터 초기화', 'primary'), Btn('전체 상품 보기')] }),
        )),
    ),
);

const state4 = StateBlock({ idx: 4, title: '품절 상품 섞임', note: '모든 품목(옵션)이 품절인 상품은 카드에 품절 표시가 덮이고, 정렬과 상관없이 목록 맨 뒤로 갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '품절 상품을 목록에서 아예 빼면 검색·광고로 들어온 고객이 상품이 없어진 줄 압니다. 그래서 보여 주되 살 수 있는 상품을 앞에 둡니다. 옵션 일부만 품절인 상품은 목록에서는 정상 카드로 보이고 상세의 옵션 목록에서 품절을 알려 줍니다. 품절 카드를 눌러도 상세로 들어가 재입고 알림을 신청할 수 있습니다.'),
    Anno({ title: '관리자가 바꾸는 범위' }, '품절 상품을 맨 뒤로 보낼지, 목록에서 숨길지는 상품 > 진열 관리에서 정합니다(초기값: 맨 뒤로). 판매중지 · 전시 끔 상품은 목록에 나오지 않습니다. 고객은 품절 상품 빼고 보기를 체크해 스스로 숨길 수 있고, 이 선택은 다음 방문에도 기억됩니다.'),
    Canvas({ label: 'U-03 · 품절 상품 2개 섞임 → 맨 뒤 · 재입고 알림 버튼' }, Page('',
        Bar(48),
        ProductGrid([
            ...ITEMS.slice(0, 6).map(ProductCard),
            `<div>${ProductCard({ ...ITEMS[6], soldout: true })}<div style="margin-top:8px">${Btn('재입고 알림 신청', { size: 'sm', icon: 'bell-o', block: true })}</div></div>`,
            `<div>${ProductCard({ ...ITEMS[7], soldout: true })}<div style="margin-top:8px">${Btn('재입고 알림 신청됨', { size: 'sm', icon: 'check', block: true, disabled: true })}</div></div>`,
        ], 4),
        Pager({ page: 3, last: 3 }),
    )),
    Canvas({ label: 'U-03 · 품절 상품 빼고 보기 체크 → 품절 2개가 빠지고 상품 수가 46개로' }, Page('',
        Bar(46, { hideSold: true }),
        ProductGrid(ITEMS.slice(0, 4).map(ProductCard), 4),
    )),
);

const OneInfo = (m) => `<div>
<div style="display:flex;gap:4px;margin-bottom:8px">${Badge('GIP-01 특허원료')}</div>
<h2 style="font-size:${m ? 17 : 24}px;font-weight:800;margin:0 0 6px;line-height:1.4">${SHOP.product}</h2>
<p style="margin:0 0 10px;color:var(--ink2);font-size:13.5px">5가지 핵심 원료를 담은 석류맛 젤리스틱 한 포</p>
<div style="display:flex;gap:6px;align-items:center;font-size:13px;margin-bottom:14px">${Stars(5)}<b>4.8</b><span style="color:var(--mute)">리뷰 128</span></div>
${SHOP.options.map((o, i) => `<div class="u03-set"><span><b>${o.name}</b><em>하루 한 포 기준</em></span><span><b>${o.price}</b>${i === 2 ? ` ${Badge('품절', 'strike')}` : ''}</span></div>`).join('')}
<div style="display:flex;gap:8px;margin-top:14px">${Btn(Icon('heart-o'), { size: 'lg', w: 52 })}${Btn('상품 자세히 보기', { size: 'lg', block: true })}${Btn('구매하기', { kind: 'primary', size: 'lg', block: true })}</div>
</div>`;

const state5 = StateBlock({ idx: 5, title: '상품 1개뿐인 몰(이너에라)', note: '판매중 상품이 1개면 카테고리 탭 · 정렬 · 필터 · 쪽 번호를 모두 빼고 그 상품을 크게 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품이 1개인데 4열 목록 틀에 카드 한 장만 덩그러니 있으면 덜 만든 몰처럼 보입니다. 상품 수가 1개면 목록 틀 대신 큰 카드로 바뀌고 구성(옵션)과 가격을 바로 보여 줍니다. 상품이 2개 이상이 되면 자동으로 1번 상태의 목록으로 돌아갑니다(코드 수정 없음).'),
    Anno({ title: '관리자가 바꾸는 범위' }, '이너에라는 상단 메뉴 구매하기를 상품 목록이 아니라 상품 상세로 바로 연결해 둘 수 있습니다(디자인 > 메뉴에서 메뉴가 가는 곳을 고름). 그래도 탭바 카테고리나 직접 주소로 /products 에 들어오는 고객을 위해 이 화면이 필요합니다. 구성 이름 · 가격 · 품절 표시는 상품 등록의 옵션 값 그대로입니다.'),
    Canvas({ label: 'U-03 · 상품 1개뿐인 몰 · 이너에라 · 탭 · 정렬 · 필터 없음' }, UserPage({ active: '상품', crumb: ['홈', '상품'], title: '상품' }, CSS,
        `<div class="u03-one">${Img({ ratio: '1/1', label: '상품 대표 이미지 1000 × 1000 · 젤리스틱 상자와 스틱' })}${OneInfo(false)}</div>`,
        Note('가격은 예시입니다(판매가 미확정). 구매하기를 누르면 상품 상세의 구매 영역으로, 구성 줄을 누르면 그 구성이 선택된 상세로 갑니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-03 · 상품 1개뿐인 몰 · 모바일' }, MobilePage({ tab: '카테고리', cart: 1 }, CSS,
            Img({ ratio: '1/1', label: '상품 대표 이미지 1000 × 1000' }), '<div style="height:14px"></div>', OneInfo(true),
        )),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U03() {
    return fixBand([state1, state2, state3, state4, state5].join(''));
}
