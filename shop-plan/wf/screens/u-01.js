import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Check, Img, Icon, Overlay, Drawer, MobilePage, UserHeader, UserFooter,
    ProductCard, ProductGrid, Note, SHOP,
} from '../lib/blocks.js';

const CSS = `<style>
.u01-blk { position: relative; isolation: isolate; border-top: 1px dashed #9a9aa2; }
.u01-tag { position: absolute; left: 0; top: 0; z-index: 1; display: inline-flex; gap: 8px; align-items: center; background: var(--dark); color: #fff; font-size: 11px; padding: 3px 10px; border-radius: 0 0 4px 0; white-space: nowrap; }
.u01-tag em { font-style: normal; opacity: .75; }
.u01-sec { max-width: 1200px; margin: 0 auto; padding: 64px 40px; }
.u01-sec.m { padding: 36px 16px 28px; }
.u01-eye { font-size: 12px; letter-spacing: .08em; color: var(--mute); margin: 0 0 6px; }
.u01-h { font-size: 28px; font-weight: 800; line-height: 1.35; margin: 0 0 8px; }
.u01-h.m { font-size: 20px; }
.u01-p { font-size: 14px; color: var(--ink2); margin: 0 0 18px; }
.u01-card { border: 1px solid var(--line); border-radius: 6px; padding: 14px; background: #fff; font-size: 13px; }
.u01-card b { display: block; font-size: 14.5px; margin: 8px 0 2px; }
.u01-card > span, .u01-card > div > span:not(.wf-badge) { display: block; color: var(--ink2); font-size: 12.5px; }
.u01-card em { font-style: normal; font-size: 11.5px; color: var(--mute); }
.u01-row { display: grid; gap: 16px; }
.u01-scroll { display: flex; gap: 10px; overflow: hidden; }
.u01-scroll > * { flex: none; width: 150px; }
.u01-pop { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,.25); }
.u01-popf { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; font-size: 13px; background: var(--box); border-top: 1px solid var(--line2); }
.u01-dots { display: flex; gap: 6px; align-items: center; font-size: 12px; color: var(--ink2); }
.u01-dots i { font-size: 18px; }
</style>`;

const Blk = (no, kind, cond, ...body) => `<div class="u01-blk"><span class="u01-tag">블록 ${no} · ${kind}${cond ? `<em>${cond}</em>` : ''}</span>${body.join('')}</div>`;
const Sec = (m, ...body) => `<div class="u01-sec${m ? ' m' : ''}">${body.join('')}</div>`;
const Head = (eye, h, p, m) => `<p class="u01-eye">${eye}</p><h2 class="u01-h${m ? ' m' : ''}">${h}</h2>${p ? `<p class="u01-p">${p}</p>` : ''}`;
const Row = (cols, ...items) => `<div class="u01-row" style="grid-template-columns:repeat(${cols}, minmax(0, 1fr))">${items.join('')}</div>`;

const INGREDIENTS = [
    ['01', 'Alpha-Lipoic Acid', '알파리포산', '시금치·브로콜리에 미량 들어 있는 성분', '에너지 대사 연구'],
    ['02', 'Glutathione', '글루타치온', '세 가지 아미노산이 이어진 성분', '이너뷰티 루틴'],
    ['03', 'Curcumin', '커큐민', '강황의 노란색을 내는 주요 성분', '강황 유래'],
    ['04', 'Quercetin', '퀘르세틴', '양파 껍질·사과에 들어 있는 식물 성분', 'GIP-01 특허원료'],
    ['05', 'Nicotinamide Mononucleotide', 'NMN', '합성이 아닌 효모 발효로 얻은 원료', '효모 발효 유래'],
];
const FORMULA = [['알파리포산', '시금치'], ['글루타치온', '효모'], ['커큐민', '강황'], ['퀘르세틴', '회화나무 꽃봉오리'], ['NMN', '효모 발효']];
const RITUAL = [
    ['아침, 하루를 열며', '무엇부터 챙길지 막막한 날', '나에게 필요한 데일리 루틴부터.'],
    ['육아 틈틈이', '나를 돌볼 여유가 없던 날', '미뤄왔던 나를 위한 시간, 매일 간편하게.'],
    ['야근 사이', '바쁜 하루의 작은 습관', '습관 하나쯤은 놓치고 싶지 않으니까.'],
    ['거울 앞에서', '매일의 이너뷰티 루틴', '겉모습뿐 아니라 매일의 루틴까지.'],
    ['외출 가방 속', '나만의 롱제비티 라이프', '더 늦기 전에, 오늘부터 꾸준히.'],
];
const SETS = [
    ['석류맛 20 g × 14포', '1박스 · 14포', '14일분', SHOP.options[0].price],
    ['석류맛 20 g × 28포', '2박스 · 28포', '28일분', SHOP.options[1].price],
    ['석류맛 20 g × 56포', '4박스 · 56포', '56일분', SHOP.options[2].price],
];

const Slide = (m) => m
    ? `<div style="position:relative">${Img({ h: 420, label: '첫 배너 슬라이드 1 / 2 · 모바일용 이미지 780 × 1040 (3:4) · 석류 원물과 젤리스틱' })}<div style="position:absolute;left:16px;right:16px;bottom:20px;background:#fff;border-radius:6px;padding:14px"><p class="u01-eye">Pomegranate · 20 g × 14</p><h2 class="u01-h m">하루 한 포,<br>롱제비티 젤리스틱</h2>${Btn('제품 살펴보기', { kind: 'primary', iconRight: 'angle-right-min' })}<div class="u01-dots" style="margin-top:10px">01 / 02 · 5초마다 넘어감 · 좌우로 밀기</div></div></div>`
    : `<div style="display:flex;height:480px"><div style="flex:1;background:var(--box);padding:120px 0 0 80px"><p class="u01-eye">Pomegranate · 20 g × 14</p><h2 class="u01-h" style="font-size:40px">하루 한 포,<br>롱제비티 젤리스틱</h2><p class="u01-p">Inner:Era Longevity x Inner Beauty</p>${Btn('제품 살펴보기', { kind: 'primary', size: 'lg', iconRight: 'angle-right-min' })}<div class="u01-dots" style="margin-top:56px">${Icon('angle-left')}<b>01</b> / 02${Icon('angle-right')}<span>5초마다 자동으로 넘어감 · 마우스를 올리면 멈춤</span></div></div><div style="width:640px;flex:none">${Img({ h: 480, label: '첫 배너 슬라이드 1 / 2 · PC용 이미지 1920 × 720 · 석류 원물과 젤리스틱 제품 사진' })}</div></div>`;

const Formula = (m) => Sec(m,
    Head('Formula', '하루 한 포에 담은<br>다섯 가지 핵심 원료', '여러 가지 따로 챙길 필요 없이, 간편하게', m),
    m
        ? `<div class="u01-scroll" data-clip="1">${FORMULA.map(([n, s]) => `<div style="width:96px;text-align:center;font-size:12.5px">${Img({ ratio: '1/1', round: true, label: '원료 사진' })}<b style="display:block;margin-top:6px">${n}</b><span style="color:var(--mute)">${s}</span></div>`).join('')}</div>`
        : Row(5, ...FORMULA.map(([n, s], i) => `<div style="text-align:center;font-size:13px">${Img({ ratio: '1/1', round: true, label: `원료 사진 0${i + 1} · 600 × 600` })}<b style="display:block;margin-top:10px;font-size:15px">${n}</b><span style="color:var(--mute)">${s}</span></div>`)),
    `<div style="margin-top:20px">${Btn('원료 살펴보기', { iconRight: 'angle-right-min' })}</div>`,
);

const Band = (m) => `<div style="background:var(--dark);color:#fff;padding:${m ? '30px 16px 22px' : '44px 80px'};display:flex;${m ? 'flex-direction:column;gap:12px' : 'align-items:center;justify-content:space-between'}"><b style="font-size:${m ? 18 : 24}px;line-height:1.4">5가지 핵심 원료,${m ? ' ' : '<br>'}하루 한 포로 간편하게</b>${Btn('제품 살펴보기', { iconRight: 'angle-right-min' })}</div>`;

const SetCard = ([name, box, days, price]) => `<div class="u01-card">${Img({ ratio: '4/3', label: `${box} 구성 사진 · 800 × 600` })}<b>${box} <em>${days}</em></b><span>${name}</span><b>${price}</b>${Btn('이 구성으로 구매하기', { kind: 'primary', block: true, size: 'sm' })}</div>`;
const Display = (m) => Sec(m,
    Head('Shop', '나에게 맞는 구성', '하루 한 포 기준', m),
    m ? SETS.map(SetCard).join('<div style="height:10px"></div>') : Row(3, ...SETS.map(SetCard)),
    Note('가격은 예시입니다(판매가 미확정). 카드를 누르면 상품 상세가 그 구성이 선택된 채로 열립니다.'),
);

const Ritual = (m) => Sec(m,
    Head('Daily Ritual', '일상의 다섯 장면, 하루 한 포', '', m),
    m
        ? `<div class="u01-scroll" data-clip="1">${RITUAL.slice(0, 3).map(([t, h]) => `<div class="u01-card" style="width:200px">${Img({ ratio: '3/4', label: '장면 사진 600 × 800' })}<em>${t}</em><b>${h}</b></div>`).join('')}</div><p class="u01-eye" style="margin-top:8px">좌우로 밀어 다섯 장면 보기 · 1 / 5</p>`
        : Row(5, ...RITUAL.map(([t, h, d]) => `<div class="u01-card">${Img({ ratio: '3/4', label: '장면 사진 600 × 800 (3:4)' })}<em>${t}</em><b>${h}</b><span>${d}</span></div>`)),
);

const Cards = (m) => Sec(m,
    Head('Ingredients', '한 포 안에, 다섯 가지가 다 들어 있어요', '', m),
    m
        ? INGREDIENTS.slice(0, 2).map(([no, en, ko, d, tag]) => `<div class="u01-card" style="margin-bottom:8px"><em>${no} · ${en}</em><b>${ko}</b><span>${d}</span><div style="margin-top:8px">${Badge(tag)}</div></div>`).join('') + Btn('원료 5가지 모두 보기', { block: true, iconRight: 'angle-down-min' })
        : Row(5, ...INGREDIENTS.map(([no, en, ko, d, tag]) => `<div class="u01-card"><em>${no} · ${en}</em><b>${ko}</b><span>${d}</span><div style="margin-top:10px">${Badge(tag)}</div></div>`)),
    '<p class="u01-eye" style="margin-top:14px">*상기 내용은 제품이 아닌 원료에 대한 정보입니다.</p>',
    m ? '' : Btn('원료 이야기 보러가기', { iconRight: 'angle-right-min' }),
);

const Cert = (m) => Sec(m,
    Head('Trust', 'GIP-01 특허원료 · HACCP 인증', '패키지에 표기된 그대로', m),
    Row(m ? 1 : 2,
        `<div class="u01-card" style="display:flex;gap:14px;align-items:center">${Img({ w: 72, h: 72, label: '인증 마크' })}<div><b style="margin-top:0">HACCP 안전관리인증</b><span>식품의약품안전처</span></div></div>`,
        `<div class="u01-card" style="display:flex;gap:14px;align-items:center">${Img({ w: 72, h: 72, label: '특허 마크' })}<div><b style="margin-top:0">GIP-01 특허원료 사용</b><span>특허 제10-2951534호</span></div></div>`,
    ),
    `<div style="margin-top:16px">${Btn('원칙 살펴보기', { iconRight: 'angle-right-min' })}</div>`,
);

const HomePc = (o = {}) => [
    CSS,
    UserHeader({ loggedIn: o.loggedIn, cart: o.cart }),
    Blk(1, '첫 배너 슬라이드', '2장 · 상시', Slide()),
    Blk(2, '글 + 이미지 묶음(포뮬러)', '상시', Formula()),
    Blk(3, '띠 배너', '기간 2026-11-01 ~ 2026-12-31', Band()),
    Blk(4, '상품 진열', '구성별 카드 · 상시', Display()),
    Blk(5, '이미지 카드 묶음(Daily Ritual)', '5장 · 상시', Ritual()),
    Blk(6, '글 카드 묶음(원료 카드)', '5장 · 상시', Cards()),
    Blk(7, '인증 배너', '상시', Cert()),
    UserFooter(),
].join('');

const HomeMobileBody = (short) => `${CSS}<div style="margin:-16px">${[
    Blk(1, '첫 배너 슬라이드', '', Slide(true)),
    Blk(2, '글 + 이미지 묶음(포뮬러)', '', Formula(true)),
    Blk(3, '띠 배너', '', Band(true)),
    Blk(4, '상품 진열', '', Display(true)),
    short ? '' : Blk(5, '이미지 카드 묶음(Daily Ritual)', '', Ritual(true)),
    short ? '' : Blk(6, '글 카드 묶음(원료 카드)', '', Cards(true)),
    short ? '' : Blk(7, '인증 배너', '', Cert(true)),
    short ? '' : `<div style="padding:20px 16px;background:var(--box);font-size:11.5px;color:var(--mute);line-height:1.7"><b style="color:var(--ink2)">이용약관 · 개인정보처리방침 · 공지사항 · 자주 묻는 질문</b><br>상호 ${SHOP.name} ${SHOP.nameEn} · 대표 ${SHOP.ceo} · 사업자등록번호 ${SHOP.bizNo}<br>${SHOP.addr}<br>고객센터 070-****-1234 · 평일 10:00 ~ 17:00 ${Icon('angle-down-min')} 사업자 정보 접기</div>`,
].join('')}</div>`;

const OTHER = [
    { name: '코튼 옥스퍼드 셔츠', price: '59,000원', badge: ['신상품'], reviews: 84, imgLabel: '상품 대표 이미지 1000 × 1000' },
    { name: '울 블렌드 하프 코트', price: '189,000원', orig: '210,000원', rate: '10%', badge: ['무료배송'], reviews: 212, imgLabel: '상품 대표 이미지 1000 × 1000' },
    { name: '와이드 데님 팬츠', price: '69,000원', reviews: 57, imgLabel: '상품 대표 이미지 1000 × 1000' },
    { name: '캐시미어 머플러', price: '45,000원', soldout: true, reviews: 31, imgLabel: '상품 대표 이미지 1000 × 1000' },
];

const state1 = StateBlock({ idx: 1, title: '기본(블록: 첫 배너 슬라이드·포뮬러·띠 배너·상품 진열·Daily Ritual·원료 카드·인증 배너)', note: '주소 / 로 들어오면 보이는 첫 화면. 관리자 디자인 > 메인 화면 구성(A-61)에 쌓아 둔 블록이 위에서 아래로 그대로 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '홈은 고정된 한 장이 아니라 블록 목록입니다. 운영자가 관리자에서 블록 순서를 끌어 바꾸고, 블록마다 켜고 끄고, 노출 기간을 정합니다(기간이 지난 블록은 자동으로 빠짐). 그림 왼쪽 위 검은 딱지는 블록 종류와 노출 조건을 알려 주는 설명용이며 실제 화면에는 보이지 않습니다. 다음 고객사는 같은 블록 종류에 문구·이미지만 바꿔 씁니다.'),
    Anno({ title: '관리자가 바꾸는 범위 · 이미지 규격' }, '블록 안 문구·버튼 이름·버튼이 가는 주소·이미지는 전부 관리자 입력값입니다. 첫 배너 슬라이드 PC 1920 × 720 px, 모바일 780 × 1040 px(3:4), 장당 2MB 이하, JPG · PNG · WEBP, 최대 5장. 카드 이미지는 600 × 800 px(3:4). 상단 띠 문구·로고·메뉴는 디자인 > 사이트 기본(A-60)·메뉴(A-63)에서, 바닥글 사업자 정보는 설정 > 쇼핑몰 정보(A-90)에서 자동으로 들어옵니다.'),
    Canvas({ label: 'U-01 · 홈 기본 · 비로그인 · 블록 7개가 관리자에서 정한 순서대로' }, HomePc()),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '상품 진열 블록은 몰에 따라 모양이 다릅니다. 이너에라처럼 상품이 1개면 구성(옵션)별 카드로, 상품이 여럿인 몰은 상품 카드 4열로 나옵니다. 진열할 상품과 순서는 상품 > 진열 관리(A-24)에서 고르고, 품절 상품은 카드에 품절 표시가 붙은 채 맨 뒤로 갑니다. 진열할 상품이 하나도 없으면 블록째 보이지 않습니다.'),
    Canvas({ label: 'U-01 · 상품 진열 블록 — 상품이 여럿인 몰일 때(다른 업종 예시: 의류) · 품절 상품은 맨 뒤' },
        CSS, Blk(4, '상품 진열', '상품 카드 4열 · 최대 8개 · 전체 보기 버튼', Sec(false,
            `<div style="display:flex;justify-content:space-between;align-items:flex-end"><div>${Head('Best', '지금 많이 찾는 상품', '')}</div>${Btn('전체 보기', { kind: 'ghost', iconRight: 'angle-right-min' })}</div>`,
            ProductGrid(OTHER.map(ProductCard), 4),
        ))),
);

const PopupPc = (label) => `<div class="u01-pop" style="width:400px">${Img({ h: 500, label })}<div class="u01-popf">${Check('오늘 하루 보지 않기')}<span>닫기 ${Icon('close-min')}</span></div></div>`;

const state2 = StateBlock({ idx: 2, title: '메인 팝업 떠 있음', note: '관리자 디자인 > 배너·팝업(A-62)에서 노출 기간 안에 있는 팝업이 있을 때, 홈에 처음 들어오면 뜹니다.' },
    Anno({ title: '왜 이렇게 하나' }, '오픈 이벤트·배송 휴무 공지를 개발자 없이 올리고 내리기 위한 자리입니다. 팝업마다 노출 기간, 보이는 기기(PC · 모바일), 이미지를 눌렀을 때 가는 주소를 운영자가 정합니다. 오늘 하루 보지 않기를 체크하고 닫으면 그 팝업은 자정까지 다시 뜨지 않고, 그냥 닫으면 홈에 다시 들어올 때 또 뜹니다.'),
    Anno({ title: '초기값 · 이미지 규격' }, '등록된 팝업이 없으면 아무것도 뜨지 않습니다(초기값). 팝업 이미지 800 × 1000 px(4:5) 권장, 2MB 이하, JPG · PNG · WEBP. PC는 최대 2개까지 나란히, 모바일은 한 장씩 넘겨 봅니다. 3개 이상 등록하면 순서가 앞선 2개만 뜬다고 관리자 등록 화면에서 알려 줍니다.'),
    Canvas({ label: 'U-01 · 홈 진입 → 메인 팝업 2개가 나란히 뜬 모습 (팝업 밖 어두운 곳을 눌러도 닫힘)' }, Overlay({ bg: HomePc(), h: 680 },
        `<div style="display:flex;gap:16px;align-items:flex-start">${PopupPc('메인 팝업 1 · 오픈 기념 첫 구매 10% 할인 쿠폰 안내 · 800 × 1000 · 누르면 회원가입으로')}${PopupPc('메인 팝업 2 · 11월 배송 안내(11-14 창고 이전으로 출고 쉼) · 800 × 1000 · 누르면 공지사항으로')}</div>`)),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-01 · 모바일 · 팝업 2개 = 한 장씩 넘김' }, Overlay({ bg: MobilePage({ tab: '홈' }, HomeMobileBody(true)), h: 720 },
            `<div class="u01-pop" style="width:310px">${Img({ h: 388, label: '메인 팝업 1 · 오픈 기념 첫 구매 10% 할인 쿠폰 안내 · 800 × 1000 (4:5)' })}<div class="u01-dots" style="justify-content:center;padding:8px">${Icon('angle-left-min')}<b>1</b> / 2${Icon('angle-right-min')} 좌우로 밀기</div><div class="u01-popf">${Check('오늘 하루 보지 않기')}<span>닫기 ${Icon('close-min')}</span></div></div>`)),
        Canvas({ size: 'mobile', label: 'U-01 · 모바일 · 오늘 하루 보지 않기 체크 → 닫기 누르기 직전' }, Overlay({ bg: MobilePage({ tab: '홈' }, HomeMobileBody(true)), h: 720 },
            `<div class="u01-pop" style="width:310px">${Img({ h: 388, label: '메인 팝업 2 · 11월 배송 안내 · 800 × 1000 (4:5)' })}<div class="u01-dots" style="justify-content:center;padding:8px">${Icon('angle-left-min')}<b>2</b> / 2${Icon('angle-right-min')}</div><div class="u01-popf">${Check('오늘 하루 보지 않기', { on: true })}<span><b>닫기</b> ${Icon('close-min')}</span></div></div>`)),
    ),
);

const state3 = StateBlock({ idx: 3, title: '모바일(하단 탭바·서랍 메뉴 열림)', note: '화면 폭이 좁으면 메뉴가 서랍으로 들어가고, 아래에 탭바(홈 · 카테고리 · 검색 · 마이 · 장바구니)가 항상 붙습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '모바일 구매가 대부분이라 엄지로 닿는 아래쪽에 자주 쓰는 다섯 곳을 고정합니다. 블록은 PC와 같은 순서로 한 줄씩 쌓이고, 카드 묶음은 좌우로 밀어 봅니다. 블록마다 모바일에서만 끄기를 할 수 있습니다(관리자 메인 화면 구성의 보이는 기기).'),
    Anno({ title: '관리자가 바꾸는 범위' }, '서랍 메뉴 항목과 순서는 디자인 > 메뉴(A-63)에서 바꿉니다. 비회원 주문 기능을 끄면 서랍의 비회원 주문 조회가, 적립금·쿠폰을 끄면 로그인 상태 머리의 적립금·쿠폰 줄이 함께 사라집니다. 장바구니 탭의 숫자는 담은 상품 가짓수입니다.'),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-01 · 모바일 홈 · 하단 탭바(홈 선택됨) · 블록 7개 세로로' }, MobilePage({ tab: '홈', cart: 1 }, HomeMobileBody(false))),
        Canvas({ size: 'mobile', label: 'U-01 · 왼쪽 위 메뉴 버튼 → 서랍 메뉴 열림 · 비로그인' }, Overlay({ bg: MobilePage({ tab: '홈' }, HomeMobileBody(true)), align: 'left', h: 720 },
            Drawer({ loggedIn: false }, `<div style="padding:16px 18px;font-size:12.5px;color:var(--mute);line-height:1.8">고객센터 070-****-1234<br>평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)</div>`))),
        Canvas({ size: 'mobile', label: 'U-01 · 서랍 메뉴 열림 · 로그인 상태(이름 · 적립금 · 쿠폰, 맨 아래 로그아웃)' }, Overlay({ bg: MobilePage({ tab: '홈', cart: 1 }, HomeMobileBody(true)), align: 'left', h: 720 },
            Drawer({ loggedIn: true, menu: ['브랜드 이야기', '원료 이야기', '상품', '리뷰', '고객센터', '공지사항', '자주 묻는 질문', '주문 목록'] }, `<div style="padding:16px 18px;font-size:13px;color:var(--ink2)">${Icon('log-out')} 로그아웃</div>`))),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U01() {
    return fixBand([state1, state2, state3].join(''));
}
