import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Input, Tabs, Empty, Note, Text, Icon, Flex, Box, Pager,
} from '../lib/blocks.js';

const CATS = [{ t: '전체', n: 18 }, { t: '주문·결제', n: 4 }, { t: '배송', n: 4 }, { t: '취소·반품·교환', n: 4 }, { t: '상품', n: 3 }, { t: '회원·혜택', n: 3 }];
const FAQS = [
    { c: '배송', q: '주문하면 언제 받을 수 있나요?', a: '평일 오후 2시 이전에 결제를 마친 주문은 당일 출고되고, 출고 후 1~2일(영업일) 안에 받으실 수 있습니다. 주말·공휴일 주문은 다음 영업일에 출고됩니다. 제주·도서산간은 1~2일 더 걸릴 수 있습니다.', btn: ['배송 조회하러 가기', '주문 목록'] },
    { c: '배송', q: '배송비는 얼마인가요?', a: '5만원 이상 구매하시면 무료이고, 5만원 미만은 3,000원입니다(금액은 예시). 제주·도서산간 지역은 3,000원이 추가됩니다.' },
    { c: '주문·결제', q: '주문한 뒤 배송지를 바꿀 수 있나요?', a: '상품 준비가 시작되기 전(결제완료 상태)까지는 마이페이지 > 주문 상세에서 직접 바꿀 수 있습니다. 배송준비 상태부터는 1:1 문의로 알려 주세요.', btn: ['주문 목록'] },
    { c: '주문·결제', q: '가상계좌 입금 기한이 지나면 어떻게 되나요?', a: '입금 기한(주문 다음 날 23:59)이 지나면 주문이 자동으로 취소됩니다. 다시 주문해 주세요.' },
    { c: '취소·반품·교환', q: '반품 배송비는 누가 내나요?', a: '단순 변심은 왕복 배송비 6,000원을 고객님이 부담하고 환불 금액에서 빼고 돌려드립니다. 상품 불량·오배송은 이너에라가 부담합니다.', btn: ['반품 신청하러 가기'] },
    { c: '취소·반품·교환', q: '개봉한 상품도 반품할 수 있나요?', a: '식품은 개봉하면 단순 변심 반품이 어렵습니다. 상품에 문제가 있을 때는 개봉 여부와 관계없이 받은 날부터 3개월 안에 반품·교환하실 수 있습니다.' },
    { c: '상품', q: '하루에 몇 포를 먹으면 되나요?', a: '하루 1포를 물 없이 그대로 드시면 됩니다. 1박스는 14포(14일분)입니다.' },
    { c: '회원·혜택', q: '적립금은 언제부터 쓸 수 있나요?', a: '1,000원 이상 모이면 주문서에서 100원 단위로 쓸 수 있습니다. 적립일로부터 1년이 지나면 사라집니다.' },
];

const Item = (f, o = {}) => `
<div style="border-bottom:1px solid var(--line2)">
  <div style="display:flex;gap:12px;align-items:center;padding:${o.m ? '14px 0' : '18px 8px'};font-size:${o.m ? 14 : 15}px;${o.open ? 'font-weight:700' : ''}"><b style="flex:none">Q</b>${o.cat === false ? '' : `<span style="flex:none;color:var(--mute);font-size:12.5px;font-weight:400">${f.c}</span>`}<span style="flex:1">${o.mark ? f.q.replace(o.mark, `<u><b>${o.mark}</b></u>`) : f.q}</span>${Icon(o.open ? 'angle-up-min' : 'angle-down-min')}</div>
  ${o.open ? `<div style="background:var(--box);padding:${o.m ? '14px' : '20px 24px 20px 40px'};font-size:13.5px;line-height:1.8;display:flex;gap:12px"><b style="flex:none">A</b><div>${f.a}${f.btn ? `<div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap">${f.btn.map((b) => Btn(b, { size: 'sm', iconRight: 'angle-right-min' })).join('')}</div>` : ''}</div></div>` : ''}
</div>`;

const Search = (q = '', w = 480) => Flex({ justify: 'center', gap: 8 }, Input({ value: q, placeholder: '궁금한 내용을 검색해 보세요 (예: 배송비, 반품)', icon: 'search', w }), Btn('검색', 'primary'));
const Ask = () => Box({ flat: true }, Flex({ justify: 'space-between', align: 'center' },
    `<div><b style="font-size:14.5px">찾는 답이 없나요?</b><div style="font-size:12.5px;color:var(--mute)">1:1 문의를 남기시면 영업일 1일 안에 답변드립니다. 고객센터 070-****-1234 · 평일 10:00 ~ 17:00</div></div>`,
    Btn('1:1 문의하기', { kind: 'primary', icon: 'message-o' })));
const Page = (...body) => UserPage({ active: '고객센터', crumb: ['홈', '고객센터', '자주 묻는 질문'], title: '자주 묻는 질문' }, body);
const gap = (h = 20) => `<div style="height:${h}px"></div>`;
const top = '<div style="border-top:2px solid var(--dark)"></div>';

const state1 = StateBlock({ idx: 1, title: '분류 탭', note: '분류 탭으로 질문을 좁혀 봅니다. 처음에는 "전체"가 골라져 있고 모든 질문이 접혀 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 문의를 쓰기 전에 스스로 답을 찾으면 응대가 줄어듭니다. 분류 이름·순서와 질문 순서는 운영자가 관리자 고객응대 > 공지사항·FAQ에서 드래그로 바꾸고, 탭 옆 숫자는 그 분류의 질문 수입니다. 질문이 없는 분류는 탭이 나오지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '초기값: 솔루션 기본 질문 18개(주문·배송·반품 정책 값은 설정의 배송비·반품 배송비·자동 구매확정 일수와 맞춰 운영자가 문장을 확인)가 들어 있고 고객사가 고칩니다. 적립금·쿠폰을 끈 몰은 관련 질문을 운영자가 숨깁니다. 맨 아래에는 항상 1:1 문의로 가는 길을 둡니다.'),
    Canvas({ label: 'U-25 · 자주 묻는 질문 · 전체 탭' }, Page(Search(), gap(24), Tabs(CATS, '전체'), FAQS.map((f) => Item(f)), Pager({ page: 1, last: 2 }), gap(), Ask())),
    Canvas({ label: 'U-25 · 배송 탭을 누른 뒤 (분류 글자는 숨김)' }, Page(Search(), gap(24), Tabs(CATS, '배송'),
        FAQS.filter((f) => f.c === '배송').map((f) => Item(f, { cat: false })),
        Item({ q: '제주·도서산간도 배송되나요?' }, { cat: false }), Item({ q: '여러 개를 주문하면 한 상자로 오나요?' }, { cat: false }), gap(), Ask())),
    Canvas({ size: 'mobile', label: 'U-25 · 모바일 · 분류 탭은 옆으로 밀어 넘김' }, MobilePage({ title: '자주 묻는 질문', tab: false },
        Input({ placeholder: '궁금한 내용을 검색해 보세요', icon: 'search', w: '100%' }), gap(12),
        `<div style="overflow:hidden;margin-right:-16px"><div style="width:560px">${Tabs(CATS.map((c) => c.t), '전체', { kind: 'pill' })}</div></div>`, gap(6),
        FAQS.slice(0, 6).map((f) => Item(f, { m: true, cat: false })), gap(14), Btn('더 보기 (6 / 18)', { block: true }), gap(14),
        Btn('1:1 문의하기', { kind: 'primary', block: true, icon: 'message-o' }))),
);

const state2 = StateBlock({ idx: 2, title: '펼침', note: '질문을 누르면 그 자리에서 답이 펼쳐집니다. 다른 질문을 누르면 먼저 펼친 것은 접힙니다(한 번에 하나).' },
    Anno({ title: '왜 이렇게 하나' }, '답을 읽고 바로 다음 행동으로 가게, 답 안에 버튼을 넣을 수 있습니다(관리자 작성 화면에서 "바로 가기 버튼" 이름과 연결 화면을 고름: 주문 목록·배송 조회·반품 신청·1:1 문의 등). 로그인이 필요한 화면으로 가는 버튼은 비로그인이면 로그인 뒤 그 화면으로 보냅니다.'),
    Canvas({ label: 'U-25 · 첫 질문 펼침 (바로 가기 버튼 2개) · 나머지 접힘' }, Page(Search(), gap(24), Tabs(CATS, '전체'),
        FAQS.slice(0, 5).map((f, i) => Item(f, { open: i === 0 })), gap(), Ask())),
    Canvas({ label: 'U-25 · "반품"으로 검색 → 결과 2건 · 검색어 밑줄 · 첫 결과 펼침' }, Page(Search('반품'), gap(16),
        Text('"반품" 검색 결과 <b>2</b>건 · <u>검색 지우기</u>', { sm: true }), top,
        Item(FAQS[4], { open: true, mark: '반품' }), Item(FAQS[5], { mark: '반품' }), gap(), Ask())),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-25 · 모바일 · 펼침' }, MobilePage({ title: '자주 묻는 질문', tab: false },
            Input({ placeholder: '궁금한 내용을 검색해 보세요', icon: 'search', w: '100%' }), gap(12), Tabs(['전체', '주문·결제', '배송'], '배송', { kind: 'pill' }), gap(6),
            Item(FAQS[0], { m: true, open: true, cat: false }), Item(FAQS[1], { m: true, cat: false }), Item({ q: '제주·도서산간도 배송되나요?' }, { m: true, cat: false }))),
        Canvas({ size: 'auto', label: '비로그인으로 "주문 목록" 버튼을 눌렀을 때', right: '팝업만', pad: 20 },
            `<div class="wf-modal confirm" style="width:360px"><div class="mb"><b class="ct">로그인이 필요합니다</b><p>로그인하면 바로 주문 목록으로 이동합니다. 비회원으로 주문하셨다면 비회원 주문 조회를 이용해 주세요.</p></div><div class="mf">${Btn('비회원 주문 조회')}${Btn('로그인', 'primary')}</div></div>`),
    ),
);

const state3 = StateBlock({ idx: 3, title: '검색 결과 없음', note: '검색어에 맞는 질문이 없을 때. 검색은 질문과 답 글 전체에서 찾습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '답을 못 찾은 고객을 빈 화면에 두지 않고 바로 1:1 문의로 넘깁니다. 문의 작성 화면으로 갈 때 검색어를 제목 칸에 미리 넣어 줍니다. 운영자는 결과가 없었던 검색어를 관리자에서 보고 질문을 보탭니다.'),
    Canvas({ label: 'U-25 · "임산부"로 검색 → 결과 없음' }, Page(Search('임산부'), gap(16),
        Empty({ icon: 'search', title: '"임산부"에 맞는 질문이 없습니다', desc: '낱말을 줄이거나 다른 말로 검색해 보세요. 그래도 없으면 1:1 문의로 물어봐 주세요.', action: Flex({ gap: 8, justify: 'center' }, Btn('전체 질문 보기'), Btn('1:1 문의하기', { kind: 'primary', icon: 'message-o' })) }),
        Note('많이 찾는 낱말: 배송비 · 반품 · 배송지 변경 · 적립금 · 섭취 방법'))),
    Canvas({ size: 'mobile', label: 'U-25 · 모바일 · 결과 없음' }, MobilePage({ title: '자주 묻는 질문', tab: false },
        Input({ value: '임산부', icon: 'search', w: '100%' }),
        Empty({ icon: 'search', title: '"임산부"에 맞는 질문이 없습니다', desc: '낱말을 줄이거나 다른 말로 검색해 보세요.', action: Btn('1:1 문의하기', { kind: 'primary', icon: 'message-o' }) }))),
);

export default function U25() {
    return [state1, state2, state3].join('');
}
