import {
    Canvas, CanvasRow, StateBlock, Anno, Btn, Badge, Chips, Img, Icon, Overlay, MobilePage, UserHeader, UserFooter, UserPage,
    Empty, KV, Note, Tabs, SHOP,
    ProductCard, ProductGrid, Confirm, Toast,
} from '../lib/blocks.js';

const CSS = `<style>
.u02-blk { position: relative; isolation: isolate; border-top: 1px dashed #9a9aa2; }
.u02-tag { position: absolute; left: 0; top: 0; z-index: 1; background: var(--dark); color: #fff; font-size: 11px; padding: 3px 10px; border-radius: 0 0 4px 0; white-space: nowrap; }
.u02-sec { max-width: 960px; margin: 0 auto; padding: 56px 40px; }
.u02-sec.m { padding: 34px 16px 24px; }
.u02-eye { font-size: 12px; letter-spacing: .08em; color: var(--mute); margin: 0 0 6px; }
.u02-h { font-size: 26px; font-weight: 800; line-height: 1.4; margin: 0 0 10px; }
.u02-h.m { font-size: 19px; }
.u02-p { font-size: 14.5px; line-height: 1.85; color: var(--ink2); margin: 0 0 10px; }
.u02-two { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
.u02-card { border: 1px solid var(--line); border-radius: 6px; padding: 16px; font-size: 13px; background: #fff; }
.u02-card b { display: block; font-size: 14.5px; margin-bottom: 2px; }
.u02-card em { font-style: normal; font-size: 11.5px; color: var(--mute); }
.u02-prev { display: flex; align-items: center; gap: 10px; background: var(--warnbg); color: var(--warn); border-bottom: 1px solid #ecd9a4; padding: 9px 40px; font-size: 13px; font-weight: 600; }
</style>`;

const Blk = (no, kind, ...body) => `<div class="u02-blk"><span class="u02-tag">블록 ${no} · ${kind}</span>${body.join('')}</div>`;
const Sec = (m, ...body) => `<div class="u02-sec${m ? ' m' : ''}">${body.join('')}</div>`;
const P = (...lines) => lines.map((l) => `<p class="u02-p">${l}</p>`).join('');

const BRAND = [
    ['01', '보이는 변화보다 먼저', ['우리는 흔히 거울 속에 보이는 변화를 먼저 생각합니다.', '하지만 진정한 아름다움과 건강한 일상은 눈에 보이지 않는 곳에서부터 시작됩니다.'], '거울 앞 장면 사진 960 × 720'],
    ['02', '보이지 않는 과정', ['매일 우리 몸속에서는 에너지를 만들고, 균형을 유지하고, 스스로 회복하기 위한 수많은 과정이 일어납니다.', '이너에라는 그 보이지 않는 과정에 주목했습니다. 피부만 따로, 몸속만 따로 관리하는 것이 아니라 내 몸 전체를 하나의 균형으로 바라보는 것.'], '석류 원물 사진 960 × 720'],
];

const BrandBody = (m) => [
    Blk(1, '머리(큰 제목 + 배경 이미지)', `<div style="position:relative">${Img({ h: m ? 260 : 380, label: `머리 배경 이미지 · ${m ? '모바일 780 × 520' : 'PC 1920 × 760'} · 브랜드 대표 사진` })}<div style="position:absolute;left:${m ? 16 : 80}px;bottom:${m ? 16 : 48}px;background:#fff;padding:${m ? '12px 14px' : '20px 28px'};border-radius:4px"><p class="u02-eye">Brand Story</p><h1 class="u02-h${m ? ' m' : ''}" style="margin:0">Longevity | Inner Beauty<br>새로운 변화는 내면에서 시작됩니다.</h1></div></div>`),
    ...BRAND.map(([no, h, ps, img], i) => Blk(i + 2, `이미지 + 글(이미지 ${i % 2 ? '오른쪽' : '왼쪽'})`, Sec(m,
        m
            ? `${Img({ ratio: '4/3', label: img })}<p class="u02-eye" style="margin-top:14px">${no}</p><h2 class="u02-h m">${h}</h2>${P(...ps)}`
            : `<div class="u02-two">${i % 2 ? '' : Img({ ratio: '4/3', label: img })}<div><p class="u02-eye">${no}</p><h2 class="u02-h">${h}</h2>${P(...ps)}</div>${i % 2 ? Img({ ratio: '4/3', label: img }) : ''}</div>`))),
    Blk(4, '글(제목 + 본문 + 낱말 묶음)', Sec(m,
        `<p class="u02-eye">03</p><h2 class="u02-h${m ? ' m' : ''}">다섯 가지를 한 포에</h2>`,
        P('그래서 우리는 글루타치온, 알파리포산, NMN, 커큐민, 퀘르세틴과 같은 다섯 가지 핵심 원료를 한 포에 담았습니다.'),
        Chips(['글루타치온', '알파리포산', 'NMN', '커큐민', '퀘르세틴']),
        '<div style="height:14px"></div>',
        P('복잡하게 여러 가지를 챙기기보다, 매일의 일상 속에서 쉽고 편안하게 이어갈 수 있도록.', '건강과 아름다움을 위한 관리가 특별한 날의 노력이 아니라 자연스러운 하루의 습관이 되도록.'),
    )),
    Blk(5, '글(제목 + 본문)', Sec(m,
        `<p class="u02-eye">04</p><h2 class="u02-h${m ? ' m' : ''}">이것은 시작입니다</h2>`,
        P('지금의 나를 소중히 돌보는 작은 습관이 더 나은 내일을 만들어간다고 믿습니다.', '이너에라는 몸속에서 시작되는 더 나은 변화에 주목하며, 일상의 건강과 아름다움을 새롭게 정의하는 제품들을 만들어갑니다.'),
    )),
    Blk(6, '맺음(문구 + 버튼 2개)', `<div style="background:var(--box);text-align:center;padding:${m ? '36px 16px 28px' : '56px 40px'}"><h2 class="u02-h${m ? ' m' : ''}">내일의 변화는 오늘, 내 안에서 시작됩니다.</h2><div style="display:flex;gap:8px;justify-content:center;margin-top:16px">${Btn('원료 이야기', { iconRight: 'angle-right-min' })}${Btn('구매하기', { kind: 'primary', iconRight: 'angle-right-min' })}</div></div>`),
].join('');

const ING = [
    ['01', 'Alpha-Lipoic Acid', '알파리포산', '시금치·브로콜리에 미량 들어 있는, 황 원자 두 개가 고리를 이룬 지방산 유래 성분', '몸속 에너지를 만드는 미토콘드리아 효소의 보조 인자로 알려져, 에너지 대사 연구에서 꾸준히 다뤄지는 원료입니다.', '분자량 206.3 · PubMed 7,399편'],
    ['02', 'Glutathione', '글루타치온', '글루탐산·시스테인·글리신, 세 가지 아미노산이 이어진 트리펩타이드', '맑은 컨디션을 챙기는 이너뷰티 루틴의 대표 원료. 다섯 원료 가운데 가장 많이 연구된 성분입니다.', '분자량 307.33 · PubMed 180,343편 · 효모에서 얻음'],
];
const PRINCIPLES = [
    ['01', '인증받은 시설에서 만듭니다', 'HACCP 안전관리인증 (식품의약품안전처)'],
    ['02', '원료 이름을 숨기지 않습니다', '다섯 가지 원료를 패키지에 그대로 적습니다'],
    ['03', '매일 먹을 수 있는 맛으로', '부담 없이 즐기는 석류맛 젤리스틱'],
    ['04', '한 포씩, 개별 포장으로', '20 g 스틱을 EASY CUT으로 간편하게'],
];
const DOCS = ['시험성적서', '수입신고필증', '수입식품 신고확인증'];

const IngBody = (m) => [
    Blk(1, '머리(큰 제목)', `<div style="background:var(--box);padding:${m ? '40px 16px 24px' : '64px 80px'}"><p class="u02-eye">Ingredients</p><h1 class="u02-h${m ? ' m' : ''}" style="font-size:${m ? 22 : 34}px">한 포 안에, 다섯 가지</h1><p class="u02-p">따로 챙기던 원료를, 하루 한 포로.</p></div>`),
    Blk(2, '바로 가기 탭(누르면 아래 해당 블록으로 내려감 · 스크롤 시 위에 붙음)', `<div style="padding:${m ? '26px 16px 0' : '30px 40px 0'};max-width:960px;margin:0 auto${m ? ';overflow:hidden' : ''}"${m ? ' data-clip="1"' : ''}>${Tabs(['01 알파리포산', '02 글루타치온', '03 커큐민', '04 퀘르세틴', '05 NMN'], '01 알파리포산')}</div>`),
    ...ING.map(([no, en, ko, d1, d2, spec], i) => Blk(i + 3, `이미지 + 글(이미지 ${i % 2 ? '오른쪽' : '왼쪽'}) · 덧붙임 줄`, Sec(m,
        (() => {
            const img = Img({ ratio: '1/1', label: `${ko} 원료 사진 800 × 800 (1:1)` });
            const txt = `<div><p class="u02-eye">${no} · ${en}</p><h2 class="u02-h${m ? ' m' : ''}">${ko}</h2><p class="u02-p"><b>${d1}</b></p><p class="u02-p">${d2}</p>${Badge(spec, 'mute')}</div>`;
            return m ? `${img}<div style="height:14px"></div>${txt}` : `<div class="u02-two">${i % 2 ? txt + img : img + txt}</div>`;
        })(),
    ))),
    Blk(5, '같은 모양 블록 3개(커큐민 · 퀘르세틴 · NMN) — 그림에서는 줄임', `<div style="padding:${m ? '34px 16px 18px' : '40px'};text-align:center;color:var(--mute);font-size:13px">03 커큐민 · 04 퀘르세틴 · 05 NMN 이 위와 같은 이미지 + 글 블록으로 이어집니다(이미지 좌우 번갈아).</div>`),
    Blk(6, '각주(작은 글)', `<div style="max-width:960px;margin:0 auto;padding:${m ? '30px 16px 14px' : '34px 40px 18px'};font-size:12px;color:var(--mute)">*상기 내용은 제품이 아닌 원료에 대한 정보입니다.<br>*논문 수: PubMed 제목·초록 검색 기준, 2026년 10월</div>`),
    Blk(7, '표 + 이미지 묶음(특허 원료 · 서류 사진은 누르면 크게 보기)', Sec(m,
        `<p class="u02-eye">Patented Ingredient</p><h2 class="u02-h${m ? ' m' : ''}">퀘르세틴을 핵심으로 설계한<br>특허 복합 원료, GIP-01</h2>`,
        `<div class="u02-card" style="margin-bottom:16px">${KV([['원료', '회화나무 추출물(퀘르세틴)'], ['특허', '제10-2951534호'], ['출원', '2025년 11월 4일'], ['등록', '2026년 4월 7일'], ['검사 결과', '수입 단계 공인 시험기관 검사 모든 항목 적합 (건조감량 · 함량 · 확인시험 · 납 · 비소)']])}</div>`,
        `<div style="display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:${m ? 8 : 16}px">${DOCS.map((d) => `<div style="position:relative">${Img({ ratio: '3/4', label: `${d} 사진${m ? '' : ' · 900 × 1200'}` })}<span style="position:absolute;right:6px;bottom:6px;background:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center">${Icon('zoom-in')}</span><p style="margin:6px 0 0;font-size:12.5px;text-align:center">${d}</p></div>`).join('')}</div>`,
    )),
    Blk(8, '글 카드 묶음(원칙 4개)', Sec(m,
        `<p class="u02-eye">Our Principles</p><h2 class="u02-h${m ? ' m' : ''}">원칙을 지켜 만듭니다</h2>`,
        `<div style="display:grid;grid-template-columns:repeat(${m ? 1 : 4}, minmax(0, 1fr));gap:${m ? 8 : 16}px">${PRINCIPLES.map(([no, t, d]) => `<div class="u02-card"><em>${no}</em><b>${t}</b>${d}</div>`).join('')}</div>`,
    )),
    Blk(9, '띠 배너(문구 + 버튼)', `<div style="background:var(--dark);color:#fff;padding:${m ? '32px 16px 22px' : '44px 80px'};display:flex;${m ? 'flex-direction:column;gap:12px' : 'align-items:center;justify-content:space-between'}"><b style="font-size:${m ? 18 : 24}px">5가지 핵심 원료, 하루 한 포로 간편하게</b>${Btn('제품 살펴보기', { iconRight: 'angle-right-min' })}</div>`),
].join('');

const Pc = (active, body) => CSS + UserHeader({ active }) + body + UserFooter();

const state1 = StateBlock({ idx: 1, title: '브랜드 이야기', note: '주소 /pages/brand. 상단 메뉴 브랜드 이야기를 누르면 열립니다. 운영자가 디자인 > 콘텐츠 페이지(A-64)에서 블록을 쌓아 만든 읽을거리입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '브랜드 소개는 고객사마다 내용과 길이가 달라 화면을 고정해 만들면 다음 고객사에서 다시 개발해야 합니다. 그래서 머리 · 이미지 + 글 · 글 · 카드 묶음 · 표 · 띠 배너 · 맺음 같은 블록을 운영자가 골라 순서대로 쌓는 페이지로 둡니다. 그림의 검은 딱지는 블록 종류 설명이며 실제 화면에는 없습니다.'),
    Anno({ title: '관리자가 바꾸는 범위 · 이미지 규격' }, '페이지 이름 · 주소 끝말(brand) · 블록 순서 · 블록별 문구와 이미지 · 버튼이 가는 곳 · 공개 여부를 운영자가 바꿉니다. 머리 배경 PC 1920 × 760 px · 모바일 780 × 520 px, 이미지 + 글 블록 960 × 720 px(4:3), 장당 2MB 이하, JPG · PNG · WEBP. 모바일에서는 이미지 + 글 블록이 이미지 위 · 글 아래로 쌓입니다.'),
    Canvas({ label: 'U-02 · 브랜드 이야기 · 블록 6개' }, Pc('브랜드 이야기', BrandBody(false))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-02 · 브랜드 이야기 · 모바일(이미지 위 · 글 아래)' }, MobilePage({ title: '브랜드 이야기', tab: '홈' }, `${CSS}<div style="margin:-16px">${BrandBody(true)}</div>`)),
    ),
);

const state2 = StateBlock({ idx: 2, title: '원료 이야기(블록 조립 예시)', note: '주소 /pages/ingredients. 같은 블록 편집기로 만든 두 번째 페이지. 블록 종류가 더 많이 쓰인 예시입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '긴 페이지는 위쪽 바로 가기 탭으로 원하는 원료로 내려가게 합니다(탭은 스크롤해도 위에 붙어 따라옴). 시험성적서 같은 서류 사진은 작게 깔고 누르면 크게 보게 해서, 글자를 읽어야 하는 이미지를 본문 폭에 억지로 맞추지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '식품은 원료 설명이 제품 효능처럼 읽히면 표시·광고 위반이 됩니다. 각주 블록(*상기 내용은 제품이 아닌 원료에 대한 정보입니다)을 운영자가 지우지 않도록 관리자 블록 편집기에서 이 페이지의 각주 블록은 잠금 표시를 달 수 있게 합니다. 서류 이미지는 900 × 1200 px(3:4), 5MB 이하.'),
    Canvas({ label: 'U-02 · 원료 이야기 · 블록 9종 조립 예시' }, Pc('원료 이야기', IngBody(false))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-02 · 원료 이야기 · 모바일(바로 가기 탭은 좌우로 밀기)' }, MobilePage({ title: '원료 이야기', tab: '홈' }, `${CSS}<div style="margin:-16px">${IngBody(true)}</div>`)),
        Canvas({ size: 'auto', label: '서류 사진 누름 → 크게 보기(좌우 넘김 · 바깥 누르면 닫힘)', right: '팝업만', pad: 20 },
            `<div style="width:520px;background:var(--dark);border-radius:8px;padding:14px;color:#fff"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;font-size:13.5px"><b>시험성적서</b><span>1 / 3 ${Icon('close')}</span></div><div style="display:flex;align-items:center;gap:8px">${Icon('angle-left')}${Img({ h: 620, label: '시험성적서 원본 이미지 · 화면 높이에 맞춰 크게 · 두 손가락으로 확대' })}${Icon('angle-right')}</div></div>`),
    ),
);

const state3 = StateBlock({ idx: 3, title: '없는 페이지', note: '주소 끝말이 틀렸거나, 운영자가 페이지를 비공개로 돌리거나 지운 뒤 예전 링크로 들어온 경우.' },
    Anno({ title: '왜 이렇게 하나' }, '블로그·광고에 걸어 둔 링크가 페이지를 내린 뒤에도 남습니다. 빈 화면 대신 페이지가 없다는 말과 다음 행동(홈 · 상품 보기)을 줍니다. 상단 메뉴에 연결돼 있던 페이지를 비공개로 돌리면 메뉴에서도 함께 빠집니다(관리자 저장 때 안내).'),
    Anno({ title: '초기값 · 운영자 미리보기' }, '새 페이지의 초기값은 비공개입니다. 운영자는 관리자에서 미리보기를 눌러 공개 전 모습을 볼 수 있고, 이때 화면 위에 미리보기 띠가 붙습니다. 고객이 같은 주소로 들어오면 아래 없는 페이지 화면이 나옵니다.'),
    Canvas({ label: 'U-02 · /pages/event-2025 처럼 없는 주소 또는 비공개 페이지로 들어옴' }, UserPage({},
        Empty({ icon: 'file-text-o', title: '페이지를 찾을 수 없습니다', desc: '주소가 바뀌었거나 더 이상 공개하지 않는 페이지입니다.<br>주소를 다시 확인하시거나 아래 버튼으로 이동해 주세요.', action: [Btn('홈으로', 'primary'), Btn('상품 보러 가기')] }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-02 · 없는 페이지 · 모바일' }, MobilePage({ title: '', tab: '홈' },
            Empty({ icon: 'file-text-o', title: '페이지를 찾을 수 없습니다', desc: '주소가 바뀌었거나 더 이상 공개하지 않는 페이지입니다.', action: [Btn('홈으로', 'primary'), Btn('상품 보러 가기')] }))),
    ),
    Canvas({ label: 'U-02 · 운영자가 관리자 콘텐츠 페이지에서 미리보기를 누름 → 비공개 페이지 미리보기(운영자 로그인 상태에서만)', h: 420 },
        CSS, `<div class="u02-prev">${Icon('eye-o')}미리보기 중입니다. 아직 공개하지 않은 페이지이며 고객에게는 보이지 않습니다.<span style="margin-left:auto;text-decoration:underline">관리자로 돌아가기</span></div>`,
        UserHeader({ active: '' }),
        Blk(1, '머리(큰 제목)', `<div style="background:var(--box);padding:64px 80px"><p class="u02-eye">Daily Ritual</p><h1 class="u02-h" style="font-size:34px">일상의 다섯 장면, 하루 한 포</h1><p class="u02-p">작성 중인 새 페이지 · 주소 /pages/daily-ritual</p></div>`),
        Note('이 아래로 작성 중인 블록이 이어집니다.'),
    ),
);

const EV_COATS = [
    { name: '울 블렌드 하프 코트', price: '189,000원', orig: '210,000원', rate: '10%', reviews: 212 },
    { name: '핸드메이드 롱 코트', price: '248,000원', orig: '310,000원', rate: '20%', reviews: 96 },
    { name: '더블 버튼 숏 코트', price: '159,000원', reviews: 44 },
    { name: '벨티드 트렌치 코트', price: '179,000원', soldout: true, reviews: 73 },
].map((x) => ({ imgLabel: '상품 대표 이미지 1000 × 1000', ...x }));
const EV_KNITS = [
    { name: '소프트 터틀넥 니트', price: '49,000원', badge: ['신상품'], reviews: 132 },
    { name: '브이넥 울 니트', price: '72,000원', reviews: 58 },
    { name: '라운드 가디건', price: '62,000원', reviews: 9 },
    { name: '캐시미어 머플러', price: '45,000원', reviews: 31 },
].map((x) => ({ imgLabel: '상품 대표 이미지 1000 × 1000', ...x }));

const EvHead = (o) => `<div style="max-width:1200px;margin:0 auto;padding:${o.m ? '18px 16px 0' : '32px 40px 0'}"><div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">${Badge(o.status, o.status === '진행 중' ? 'solid' : o.status === '예정' ? 'dash' : 'mute')}<span style="font-size:13px;color:var(--ink2)">${o.period}</span>${o.left ? `<b style="font-size:13px">${o.left}</b>` : ''}</div><h1 class="u02-h${o.m ? ' m' : ''}">${o.title}</h1><p class="u02-p">${o.desc}</p></div>`;
const EvCoupon = (o = {}) => `<div style="max-width:1200px;margin:0 auto;padding:${o.m ? '0 16px' : o.bare ? '0' : '0 40px'}"><div class="u02-card" style="display:flex;${o.m ? 'flex-direction:column;gap:10px' : 'align-items:center;justify-content:space-between;gap:16px'}"><div style="display:flex;gap:12px;align-items:center"><span style="font-size:26px">${Icon('coupon')}</span><div><b>${o.name || '기획전 전용 10% 할인 쿠폰'}</b>${o.cond || '50,000원 이상 구매 시 · 최대 20,000원 할인 · 2026-11-30 까지 사용 · 1인 1장'}</div></div>${o.got ? Btn('받은 쿠폰', { icon: 'check', disabled: true }) : o.out ? Btn('쿠폰이 모두 소진되었습니다', { disabled: true }) : Btn('쿠폰 받기', { kind: 'primary', icon: 'download' })}</div></div>`;
const EvGroup = (name, n, cards, o = {}) => `<div style="max-width:1200px;margin:0 auto;padding:${o.m ? '26px 16px 0' : '40px 40px 0'}"><div style="display:flex;align-items:baseline;gap:8px;margin-bottom:14px"><h2 style="font-size:${o.m ? 16 : 20}px;margin:0">${name}</h2><span style="font-size:12.5px;color:var(--mute)">상품 ${n}개</span></div>${ProductGrid(cards.map(ProductCard), o.m ? 2 : 4)}</div>`;

const EvPc = (o = {}) => CSS + UserHeader({ active: '', loggedIn: o.loggedIn }) + [
    Blk(1, '머리 배너(기획전 등록의 배너 이미지)', Img({ h: 375, label: '기획전 머리 배너 · PC 1920 × 600 · 겨울 아우터 기획전 대표 이미지' })),
    Blk(2, '제목 · 기간 · 소개 글(에디터)', EvHead({ status: '진행 중', period: '2026-11-11 ~ 2026-11-30', left: '19일 남음', title: '겨울 아우터 기획전', desc: '올겨울 코트와 니트를 한자리에 모았습니다. 기획전 기간에만 받을 수 있는 10% 쿠폰과 함께 만나 보세요.' })),
    Blk(3, '받을 수 있는 쿠폰(연결한 경우에만)', `<div style="padding-top:30px">${EvCoupon({ got: o.got })}</div>`),
    Blk(4, '상품 묶음 바로 가기(묶음이 2개 이상일 때)', `<div style="max-width:1200px;margin:0 auto;padding:34px 40px 0">${Chips(['코트 4', '니트 · 머플러 4'], '코트 4')}</div>`),
    Blk(5, '상품 묶음 1', EvGroup('코트', 4, EV_COATS)),
    Blk(6, '상품 묶음 2', EvGroup('니트 · 머플러', 4, EV_KNITS)),
    '<div style="height:64px"></div>',
].join('') + UserFooter();

const EvClosed = (o) => CSS + UserHeader({ active: '' }) + `<div style="position:relative">${Img({ h: 375, label: '기획전 머리 배너 · PC 1920 × 600' })}<div style="position:absolute;inset:0;background:rgba(40,40,46,.6);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px"><b style="font-size:26px">${o.big}</b><span style="font-size:14px">${o.small}</span></div></div>` + EvHead({ status: o.status, period: o.period, left: o.left, title: '겨울 아우터 기획전', desc: o.desc }) + `<div style="display:flex;gap:8px;justify-content:center;padding:28px 0 72px">${Btn('상품 보러 가기', 'primary')}${Btn('홈으로')}</div>` + UserFooter();

const state4 = StateBlock({ idx: 4, title: '기획전 페이지(/events/{이름})', note: '관리자 혜택 > 기획전(A-42)에서 만든 배너 · 소개 글 · 상품 묶음 · 기간이 보이는 화면. 메인 배너 · 띠 배너 · 메뉴에서 연결해 들어옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '기획전은 콘텐츠 페이지와 같은 틀을 쓰되 블록을 운영자가 쌓지 않고 기획전 등록 값이 정해진 순서로 나옵니다(머리 배너 → 제목 · 기간 · 소개 글 → 쿠폰 → 상품 묶음들). 운영자는 묶음 이름과 상품, 순서만 정하면 됩니다. 상품 카드는 상품 목록과 같은 카드라 품절 표시 · 찜 · 할인율이 그대로 따라옵니다.'),
    Anno({ title: '초기값 · 관리자가 바꾸는 범위 · 이미지 규격' }, '등록 직후 상태는 예정이고, 기간이 되면 자동으로 진행 중 · 종료로 바뀝니다(사람이 누르지 않음). 머리 배너 PC 1920 × 600 px · 모바일 750 × 750 px, 2MB 이하, JPG · PNG · WEBP. 쿠폰을 연결하지 않으면 쿠폰 줄이 없고, 묶음이 1개면 바로 가기 줄이 없습니다. 쿠폰 기능을 끈 몰은 쿠폰 줄이 나오지 않습니다.'),
    Canvas({ label: 'U-02 · 기획전 진행 중 · 머리 배너 + 소개 + 쿠폰 받기 + 상품 묶음 2개(다른 업종 예시: 의류)' }, EvPc({ loggedIn: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: '쿠폰 받기 누름 → 버튼이 받은 쿠폰으로 바뀌고 안내(3초)', right: '쿠폰 줄만', pad: 20 }, `${CSS}<div style="width:760px">${EvCoupon({ got: true, bare: true })}</div><div style="margin-top:12px">${Toast('쿠폰을 받았습니다. 주문서에서 사용할 수 있습니다.', { action: '내 쿠폰 보기' })}</div>`),
        Canvas({ size: 'auto', label: '비로그인으로 쿠폰 받기 누름', right: '팝업만', pad: 20 }, Confirm({ w: 380, title: '로그인이 필요합니다', desc: '쿠폰은 로그인한 뒤 받을 수 있습니다.<br>로그인하면 이 기획전으로 돌아옵니다.', foot: [Btn('취소'), Btn('로그인하기', 'primary')] })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '쿠폰 수량이 다 나갔을 때', right: '쿠폰 줄만', pad: 20 }, `${CSS}<div style="width:760px">${EvCoupon({ out: true, bare: true })}</div>`),
        Canvas({ size: 'auto', label: '이미 받은 쿠폰을 다른 기기에서 다시 누름', right: '안내만', pad: 20 }, Toast('이미 받은 쿠폰입니다. 한 분당 1장만 받을 수 있습니다.', { icon: 'info-o' })),
    ),
    Canvas({ label: 'U-02 · 이너에라 · 상품이 1개인 몰의 기획전(묶음 1개 · 바로 가기 줄 없음 · 가격은 예시)' }, CSS, UserHeader({ active: '' }),
        Img({ h: 375, label: '기획전 머리 배너 · PC 1920 × 600 · 공식몰 오픈 기념' }),
        EvHead({ status: '진행 중', period: '2026-11-11 ~ 2026-11-30', left: '19일 남음', title: '공식몰 오픈 기념 기획전', desc: '이너에라 공식몰 오픈을 기념해 첫 구매 쿠폰을 드립니다.' }),
        EvCoupon({ name: '오픈 기념 3,000원 할인 쿠폰(예시)', cond: '50,000원 이상 구매 시 · 2026-11-30 까지 사용 · 1인 1장' }),
        EvGroup('오픈 기념 구성', 1, [{ name: SHOP.product, desc: '1박스 · 2박스 · 4박스', price: SHOP.options[0].price, reviews: 128, imgLabel: '상품 대표 이미지 1000 × 1000' }]),
        '<div style="height:64px"></div>', UserFooter()),
    Anno({ warn: true, title: '기간이 끝난 기획전 · 시작 전 기획전' }, '종료 후 모습은 기획전 등록의 종료 후 설정을 따릅니다. 종료된 기획전 표시 = 아래처럼 배너 위에 종료 안내를 덮고 쿠폰과 상품 묶음은 숨깁니다(광고 · 블로그 링크로 늦게 들어온 고객이 길을 잃지 않게). 목록에서 숨김 = 3번 상태의 없는 페이지가 나옵니다. 시작 전에 주소로 먼저 들어오면 시작일만 알려 줍니다. 운영자가 종료 버튼으로 일찍 끝낸 경우도 같은 화면입니다.'),
    Canvas({ label: 'U-02 · 기간이 끝난 기획전(종료 후 설정 = 종료된 기획전 표시) · 쿠폰 · 상품 묶음 숨김' }, EvClosed({ status: '종료', period: '2026-10-01 ~ 2026-10-31', big: '종료된 기획전입니다', small: '2026년 10월 31일에 끝났습니다', desc: '기획전은 끝났지만 상품은 계속 만나 보실 수 있습니다.' })),
    Canvas({ label: 'U-02 · 시작 전 기획전에 주소로 먼저 들어옴 · 상품 묶음 숨김' }, EvClosed({ status: '예정', period: '2026-11-20 ~ 2026-12-10', left: '9일 뒤 시작', big: '11월 20일(금) 0시에 시작합니다', small: '조금만 기다려 주세요', desc: '시작하면 이 주소에서 바로 보실 수 있습니다.' })),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-02 · 기획전 진행 중 · 모바일(배너 750 × 750 · 상품 2열)' }, MobilePage({ title: '기획전', tab: '홈' }, `${CSS}<div style="margin:-16px">${[
            Img({ ratio: '1/1', label: '기획전 머리 배너 · 모바일 750 × 750' }),
            EvHead({ m: true, status: '진행 중', period: '11-11 ~ 11-30', left: '19일 남음', title: '겨울 아우터 기획전', desc: '올겨울 코트와 니트를 한자리에 모았습니다.' }),
            EvCoupon({ m: true, cond: '50,000원 이상 · 11-30 까지 · 1인 1장' }),
            `<div style="padding:22px 16px 0">${Chips(['코트 4', '니트 · 머플러 4'], '코트 4')}</div>`,
            EvGroup('코트', 4, EV_COATS.slice(0, 4).map((x) => ({ ...x, imgLabel: '대표 이미지' })), { m: true }),
            '<div style="height:24px"></div>',
        ].join('')}</div>`)),
        Canvas({ size: 'mobile', label: 'U-02 · 종료된 기획전 · 모바일' }, MobilePage({ title: '기획전', tab: '홈' }, `${CSS}<div style="margin:-16px"><div style="position:relative">${Img({ ratio: '1/1', label: '기획전 머리 배너' })}<div style="position:absolute;inset:0;background:rgba(40,40,46,.6);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px"><b style="font-size:20px">종료된 기획전입니다</b><span style="font-size:13px">2026년 10월 31일에 끝났습니다</span></div></div>${EvHead({ m: true, status: '종료', period: '10-01 ~ 10-31', title: '겨울 아우터 기획전', desc: '기획전은 끝났지만 상품은 계속 만나 보실 수 있습니다.' })}<div style="display:flex;gap:8px;padding:8px 16px 24px">${Btn('상품 보러 가기', { kind: 'primary', block: true })}${Btn('홈으로', { block: true })}</div></div>`)),
    ),
);

const fixBand = (html) => html.replaceAll('3만원 이상 구매 시 무료배송', '5만원 이상 구매 시 무료배송(예시)');

export default function U02() {
    return fixBand([state1, state2, state3, state4].join(''));
}
