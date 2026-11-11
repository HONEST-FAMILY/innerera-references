import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Chip, Input, Select, Icon, MobilePage, UserPage, UserHeader, Overlay,
    Empty, ProductCard, ProductGrid, Pager, Note, Thumb, SHOP,
} from '../lib/blocks.js';

const CSS = `<style>
.u04-box { max-width: 720px; margin: 0 auto; }
.u04-in { display: flex; align-items: center; gap: 10px; height: 52px; border: 2px solid var(--dark); border-radius: 26px; padding: 0 20px; font-size: 16px; background: #fff; }
.u04-in.m { height: 44px; font-size: 14.5px; padding: 0 14px; }
.u04-in .q { flex: 1; }
.u04-in .ph { flex: 1; color: #a8a8b0; }
.u04-in i { font-size: 20px; color: var(--ink2); }
.u04-cur { display: inline-block; width: 1.5px; height: 18px; background: var(--dark); vertical-align: -3px; margin-left: 1px; }
.u04-h { display: flex; justify-content: space-between; align-items: center; margin: 26px 0 10px; font-size: 14px; }
.u04-h span { font-size: 12.5px; color: var(--mute); text-decoration: underline; }
.u04-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.u04-sug { border: 1px solid var(--dark); border-radius: 8px; margin-top: 6px; background: #fff; box-shadow: 0 6px 16px rgba(0,0,0,.12); }
.u04-sug div { display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 14px; border-bottom: 1px solid var(--line2); }
.u04-sug div:last-child { border-bottom: 0; }
.u04-sug em { font-style: normal; margin-left: auto; font-size: 12px; color: var(--mute); }
.u04-res { font-size: 20px; font-weight: 800; margin: 28px 0 16px; }
.u04-res em { font-style: normal; font-weight: 500; font-size: 14px; color: var(--ink2); margin-left: 8px; }
.u04-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13.5px; }
</style>`;

const SearchIn = (q, o = {}) => `<div class="u04-in${o.m ? ' m' : ''}">${Icon('search')}${q ? `<span class="q">${q}${o.typing ? '<span class="u04-cur"></span>' : ''}</span>` : `<span class="ph">${o.typing ? '<span class="u04-cur"></span>' : ''}상품 이름을 입력하세요</span>`}${q ? Icon('close-min') : ''}${o.m ? '' : Btn('검색', { kind: 'primary', size: 'sm' })}</div>`;
const Recent = (list) => `<div class="u04-h"><b>최근 검색어</b>${list.length ? '<span>전체 삭제</span>' : ''}</div>${list.length ? `<div class="u04-chips">${list.map((t) => Chip(t, { close: true })).join('')}</div>` : '<p style="margin:0;font-size:13px;color:var(--mute)">최근 검색어가 없습니다.</p>'}`;
const Recommend = (list) => `<div class="u04-h"><b>추천 검색어</b></div><div class="u04-chips">${list.map((t) => Chip(t)).join('')}</div>`;
const REC = ['석류맛 젤리스틱', '롱지비티', '2박스', '선물'];
const HL = (name, q) => name.replace(q, `<b style="text-decoration:underline">${q}</b>`);

const Before = (o = {}) => `<div class="u04-box">${SearchIn(o.q || '', { typing: o.typing, m: o.m })}${o.suggest || ''}${o.suggest ? '' : Recent(o.recent || [])}${o.suggest ? '' : Recommend(REC)}</div>`;
const Suggest = (q, items) => `<div class="u04-sug">${items.map(([t, sub]) => `<div>${Icon('search')}<span>${HL(t, q)}</span><em>${sub}</em></div>`).join('')}</div>`;

const INNER = { name: SHOP.product, desc: '1박스 · 2박스 · 4박스', price: SHOP.options[0].price, reviews: 128, imgLabel: '상품 대표 이미지 1000 × 1000' };
const SHIRTS = [
    { name: '코튼 옥스퍼드 셔츠', price: '59,000원', badge: ['신상품'], reviews: 84 },
    { name: '린넨 오버핏 셔츠', price: '64,000원', reviews: 22 },
    { name: '스트라이프 셔츠 원피스', price: '79,000원', orig: '89,000원', rate: '11%', reviews: 45 },
    { name: '데님 셔츠 재킷', price: '98,000원', soldout: true, reviews: 17 },
].map((x) => ({ imgLabel: '상품 대표 이미지 1000 × 1000', ...x }));

const ResultHead = (q, n) => `<div class="u04-res">'${q}' 검색 결과<em>상품 ${n}개</em></div>`;

const state1 = StateBlock({ idx: 1, title: '검색 전(최근·추천 검색어)', note: '주소 /search. PC는 머리의 돋보기를 누르면 머리 아래로 검색 영역이 내려오고, 모바일은 탭바 검색을 누르면 화면이 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '검색어를 치기 전에 누를 수 있는 것을 먼저 줍니다. 최근 검색어는 이 기기에만 저장되고(로그인과 무관, 최대 10개, 하나씩 또는 전체 삭제), 추천 검색어는 운영자가 정한 낱말입니다. 추천 검색어를 누르면 바로 그 낱말의 결과로 갑니다.'),
    Anno({ title: '초기값 · 관리자가 바꾸는 범위' }, '추천 검색어는 관리자 디자인 > 사이트 기본에서 최대 8개까지 넣고 순서를 바꿉니다. 하나도 없으면 추천 검색어 줄은 통째로 보이지 않습니다(초기값: 없음). 검색은 상품 이름 · 한 줄 설명 · 관리자가 넣은 검색 낱말(상품 등록의 검색 노출 칸)을 찾고, 판매중지 · 전시 끔 상품은 찾지 않습니다.'),
    Canvas({ label: 'U-04 · PC · 머리의 돋보기 누름 → 머리 아래로 검색 영역이 내려옴 · 최근 검색어 있음 (아래 어두운 곳을 누르면 닫힘)' },
        CSS, UserHeader({ active: '' }),
        `<div style="padding:28px 40px 30px;background:#fff">${Before({ recent: ['젤리스틱', '석류', '선물 세트'], typing: true })}<div style="text-align:right;font-size:13px;color:var(--ink2);margin-top:14px">닫기 ${Icon('close-min')}</div></div>`,
        '<div style="height:200px;background:rgba(20,20,26,.5)"></div>'),
    CanvasRow(
        Canvas({ size: 'auto', label: '최근 검색어 없음(처음 방문) — 추천 검색어만', right: '검색 영역만', pad: 24 }, `${CSS}<div style="width:720px">${Before({ recent: [] })}</div>`),
        Canvas({ size: 'auto', label: "'젤' 까지 입력함 → 상품 이름 제안(누르면 그 상품 상세로 바로 감)", right: '검색 영역만', pad: 24 }, `${CSS}<div style="width:720px">${Before({ q: '젤', typing: true, suggest: Suggest('젤', [[SHOP.product, '상품']]) })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-04 · 모바일 · 탭바 검색 → 검색 전 화면' }, MobilePage({ title: '검색', tab: '검색', right: '' }, CSS,
            Before({ recent: ['젤리스틱', '석류', '선물 세트'], m: true, typing: true }))),
        Canvas({ size: 'mobile', label: 'U-04 · 모바일 · 검색어 없이 검색 누름 → 안내(검색하지 않음)' }, Overlay({ bg: MobilePage({ title: '검색', tab: '검색', right: '' }, CSS, Before({ recent: ['젤리스틱'], m: true })), dim: false, align: 'toast-bottom', h: 720 },
            `<div class="wf-toast" style="margin-bottom:64px">${Icon('info-o')}<span>검색어를 2글자 이상 입력해 주세요.</span></div>`)),
    ),
);

const state2 = StateBlock({ idx: 2, title: '결과 있음', note: '주소 /search?q=젤리스틱. 검색어가 입력칸에 그대로 남고, 맞는 상품이 카드로 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결과 화면에서도 입력칸이 맨 위에 남아 바로 고쳐 검색할 수 있습니다. 상품 이름에서 검색어와 맞는 부분에 밑줄을 그어 왜 나온 결과인지 알려 줍니다. 띄어쓰기를 무시하고 찾습니다(젤리 스틱 = 젤리스틱). 품절 상품은 결과에 나오되 맨 뒤로 갑니다.'),
    Anno({ title: '유형별 차이' }, '이너에라처럼 상품이 1개인 몰은 결과가 1개여도 4열 틀을 유지합니다(검색 결과는 목록 문맥이므로). 상품이 많은 몰은 정렬(정확도순 · 신상품순 · 낮은 가격순 · 높은 가격순 · 리뷰 많은 순)과 쪽 번호가 붙습니다. 결과가 4개 이하면 정렬이 보이지 않습니다.'),
    Canvas({ label: "U-04 · '젤리스틱' 검색 결과 1개 · 이너에라" }, UserPage({ active: '' }, CSS,
        `<div class="u04-box">${SearchIn('젤리스틱')}</div>`,
        ResultHead('젤리스틱', 1),
        ProductGrid([ProductCard({ ...INNER, name: HL(SHOP.product, '젤리스틱') })], 4),
        Note('가격은 예시입니다(판매가 미확정).'),
    )),
    Canvas({ label: "U-04 · '셔츠' 검색 결과 12개 · 정렬 있음 · 품절은 맨 뒤(다른 업종 예시: 의류)" }, UserPage({ active: '' }, CSS,
        `<div class="u04-box">${SearchIn('셔츠')}</div>`,
        ResultHead('셔츠', 12),
        `<div class="u04-bar"><span style="color:var(--ink2)">상품 이름 · 설명에서 찾았습니다</span>${Select({ value: '정확도순', w: 150 })}</div>`,
        ProductGrid(SHIRTS.map((x) => ProductCard({ ...x, name: HL(x.name, '셔츠') })), 4),
        Pager({ page: 1, last: 1 }),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: "U-04 · 모바일 · '젤리스틱' 결과 1개" }, MobilePage({ title: '검색', tab: '검색', right: '' }, CSS,
            SearchIn('젤리스틱', { m: true }),
            `<div class="u04-res" style="font-size:16px;margin:18px 0 12px">'젤리스틱' 검색 결과<em>상품 1개</em></div>`,
            ProductGrid([ProductCard({ ...INNER, name: HL(SHOP.product, '젤리스틱'), imgLabel: '대표 이미지' })], 2),
        )),
    ),
);

const state3 = StateBlock({ idx: 3, title: '결과 없음', note: '검색어에 맞는 상품이 없을 때. 다시 찾을 방법과 대신 볼 상품을 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결과 없음은 고객이 가장 쉽게 떠나는 화면입니다. 무엇이 없었는지(검색어를 그대로 보여 줌), 어떻게 다시 찾는지(짧은 낱말 · 맞춤법), 대신 볼 것(추천 검색어 · 추천 상품)을 한 화면에 둡니다. 추천 상품은 관리자 진열 관리의 추천 영역 상품이고, 비어 있으면 최근 등록 상품 4개입니다.'),
    Anno({ title: '운영에 쓰이는 값' }, '결과가 없었던 검색어는 관리자 통계 > 상품에 많이 찾았지만 결과가 없던 검색어로 쌓입니다. 운영자는 이를 보고 상품의 검색 낱말을 보강합니다(예: 콜라겐을 찾는 고객이 많으면 관련 낱말 추가).'),
    Canvas({ label: "U-04 · '콜라겐' 검색 → 결과 없음 · 추천 검색어 · 추천 상품" }, UserPage({ active: '' }, CSS,
        `<div class="u04-box">${SearchIn('콜라겐')}</div>`,
        Empty({ icon: 'search', title: "'콜라겐'에 맞는 상품이 없습니다", desc: '검색어의 철자가 맞는지 확인하거나, 더 짧은 낱말로 다시 검색해 보세요.<br>예: 석류맛 젤리스틱 대신 젤리스틱', action: [Btn('전체 상품 보기', 'primary'), Btn('1:1 문의하기')] }),
        `<div class="u04-box">${Recommend(REC)}</div>`,
        `<div class="u04-h" style="margin-top:36px"><b style="font-size:16px">이런 상품은 어떠세요</b></div>`,
        ProductGrid([ProductCard(INNER)], 4),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: "U-04 · 모바일 · '콜라겐' 결과 없음" }, MobilePage({ title: '검색', tab: '검색', right: '' }, CSS,
            SearchIn('콜라겐', { m: true }),
            Empty({ icon: 'search', title: "'콜라겐'에 맞는 상품이 없습니다", desc: '철자를 확인하거나 더 짧은 낱말로 다시 검색해 보세요.', action: Btn('전체 상품 보기', 'primary') }),
            Recommend(REC),
            `<div class="u04-h"><b>이런 상품은 어떠세요</b></div>`,
            `<div style="display:flex;gap:12px;align-items:center;border:1px solid var(--line);border-radius:6px;padding:10px">${Thumb(64)}<div style="font-size:13px"><b>${SHOP.productShort}</b><br>${SHOP.options[0].price}</div></div>`,
        )),
        Canvas({ size: 'auto', label: '검색어가 너무 길 때(50자 넘음) — 입력칸 아래 안내', right: '검색 영역만', pad: 24 },
            `${CSS}<div style="width:520px">${SearchIn('매일 아침 간편하게 먹을 수 있는 석류맛 젤리 형태의 건강 간식을 찾고 있어요')}<p class="err" style="margin:8px 0 0 20px">${Icon('error-o')}검색어는 50자까지 입력할 수 있습니다. 핵심 낱말만 남겨 주세요.</p></div>`),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U04() {
    return fixBand([state1, state2, state3].join(''));
}
