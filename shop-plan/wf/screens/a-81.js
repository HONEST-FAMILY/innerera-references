import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Input, Select, Check, Radio, CheckGroup,
    Filters, ListHead, PerPage, Table, Tabs, Overlay, Toast, SideDrawer, Box, KV, Note, Text, Icon, Stats, BarChart, Empty, Thumb, Pager, Period, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;

const FRows = [
    { k: '기간', v: [Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' }), Check('바로 앞 같은 기간과 비교', { on: true })] },
    { k: '채널', v: CheckGroup(['자사몰', '스마트스토어'], ['자사몰', '스마트스토어']) },
    { k: '카테고리', v: [Select({ placeholder: '카테고리 전체', w: 260 }), Check('하위 카테고리 포함', { on: true })] },
    { k: '상품', v: Input({ placeholder: '상품명 · 관리코드로 찾기 (비우면 전체)', icon: 'search', w: 400 }) },
    { k: '포함', v: CheckGroup(['추가구성상품 포함', '판매중지 상품 포함'], ['추가구성상품 포함', '판매중지 상품 포함']) },
];

const VIEW = [{ t: '상품별' }, { t: '옵션(품목)별' }];
const Page = (...body) => AdminLayout({ active: 'a-81', actions: [Btn('엑셀 내려받기', { icon: 'download' })] }, body);

const Sum = Stats([
    { k: '판매 수량', v: '618개', sub: '앞 기간보다 +9.8%', icon: 'box', on: true },
    { k: '판매 금액', v: '31,256,100원', sub: '취소·반품 빼기 전', icon: 'won' },
    { k: '취소·반품', v: '27개 · 4.4%', sub: '취소 19 · 반품 8', icon: 'undo' },
    { k: '가장 많이 팔린 구성', v: '2박스(28일분)', sub: '판매 금액의 46%', icon: 'star-o' },
]);

const P_COLS = [{ t: '순위', w: 48, align: 'center' }, { t: '', w: 48 }, '상품명', { t: '판매 수량', w: 90, align: 'right', sort: 'desc' }, { t: '판매 금액', w: 120, align: 'right' }, { t: '취소·반품', w: 96, align: 'right' }, { t: '취소율', w: 70, align: 'right' }, { t: '순매출', w: 120, align: 'right' }, { t: '자사몰 / 스마트스토어', w: 150, align: 'right' }, { t: '앞 기간 대비', w: 90, align: 'right' }];
const PRODUCTS = [
    ['1', Thumb(36), `<u>${P}</u><small>품목 3개 · 펼쳐서 구성별로 보기 ${Icon('angle-down-min')}</small>`, '<b>498개</b>', '28,930,000원', '21개', '4.2%', '<b>27,640,000원</b>', '332개 / 166개', '+11.2%'],
    ['2', Thumb(36), '<u>이너에라 롱지비티 선물 세트 (2박스 + 쇼핑백)</u><small>옵션 없음</small>', '<b>18개</b>', '1,710,000원', '1개', '5.6%', '<b>1,615,000원</b>', '13개 / 5개', '새 상품'],
    ['3', Thumb(36), '<u>이너에라 스틱 보관 케이스</u><small>품목 2개</small>', '<b>51개</b>', '459,000원', '2개', '3.9%', '<b>441,000원</b>', '51개 / -', '-4.0%'],
    { hl: true, c: ['4', Thumb(36), `<u>이너에라 롱지비티 체험 3포</u><small>옵션 없음 · ${Badge('취소율 높음', 'warn')}</small>`, '<b>14개</b>', '138,600원', '3개', '<b>21.4%</b>', '<b>108,900원</b>', '14개 / -', '-38.0%'] },
    ['5', Thumb(36), '<u>이너에라 쇼핑백 (소)</u><small>추가구성상품</small>', '<b>37개</b>', '18,500원', '0개', '0%', '<b>18,500원</b>', '37개 / -', '+5.7%'],
];
const P_FOOT = ['', '', '합계', '618개', '31,256,100원', '27개', '4.4%', '29,823,400원', '447개 / 171개', '+9.8%'];

const O_COLS = [{ t: '', w: 48 }, '상품명 · 옵션 값', { t: '판매 수량', w: 90, align: 'right', sort: 'desc' }, { t: '상품 안 비중', w: 100, align: 'right' }, { t: '판매 금액', w: 120, align: 'right' }, { t: '취소·반품', w: 90, align: 'right' }, { t: '취소율', w: 70, align: 'right' }, { t: '순매출', w: 120, align: 'right' }, { t: '지금 재고', w: 90, align: 'right' }];
const ITEMS = [
    [Thumb(36), `${SHOP.productShort}<small>구성 1박스(14일분)</small>`, '<b>271개</b>', '54%', '13,279,000원', '9개', '3.3%', '<b>12,838,000원</b>', '320개'],
    [Thumb(36), `${SHOP.productShort}<small>구성 2박스(28일분)</small>`, '<b>168개</b>', '34%', '15,624,000원', '8개', '4.8%', '<b>14,880,000원</b>', '160개'],
    { hl: true, c: [Thumb(36), `${SHOP.productShort}<small>구성 4박스(56일분)</small>`, '<b>59개</b>', '12%', '10,384,000원', '4개', '6.8%', '<b>9,680,000원</b>', `12개 ${Badge('품절 임박', 'warn')}`] },
    [Thumb(36), '스틱 보관 케이스<small>색상 베이지</small>', '<b>34개</b>', '67%', '306,000원', '1개', '2.9%', '<b>297,000원</b>', '64개'],
    [Thumb(36), '스틱 보관 케이스<small>색상 차콜</small>', '<b>17개</b>', '33%', '153,000원', '1개', '5.9%', '<b>144,000원</b>', '22개'],
];

const state1 = StateBlock({ idx: 1, title: '상품·옵션별 판매량·매출', note: '기간 안에 어떤 상품이, 그 안에서 어떤 옵션(구성)이 얼마나 팔렸는지. 상품별 보기와 옵션(품목)별 보기를 바꿔 봅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '다음 생산 물량과 행사 구성을 정하는 화면입니다. 상품이 1개인 몰(이너에라)에서는 상품별보다 구성별(1박스·2박스·4박스) 비중이 더 중요하므로 옵션(품목)별 보기를 따로 두고, 상품 줄을 펼쳐 그 자리에서 구성별로도 볼 수 있습니다. 취소율이 유난히 높은 상품은 줄을 강조해 상세설명·품질 문제를 의심하게 합니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기값: 최근 1개월 · 채널 전체 · 판매 수량 많은 순 · 상품별 보기 · 50개씩. 판매 수량은 결제 완료 기준이며 취소·반품은 따로 셉니다(취소율 = 취소·반품 수량 ÷ 판매 수량, 10% 이상이면 표시). 옵션을 나중에 바꿔 지금은 없는 품목도 판 기록이 있으면 판매 종료 품목으로 나옵니다. 스마트스토어 기능을 끈 몰은 채널 조건과 자사몰 / 스마트스토어 칸이 없습니다.'),
    Canvas({ label: 'A-81 · 최근 1개월 · 상품별 보기' }, Page(
        Filters({ rows: FRows }),
        Sum,
        '<div style="height:16px"></div>',
        Box({ title: '판매 수량 많은 상품', sub: '단위 개 · 최근 1개월', right: [`<span class="wf-btn sm primary">수량</span>`, `<span class="wf-btn sm line">금액</span>`] },
            BarChart([498, 51, 37, 18, 14], ['석류맛 젤리스틱', '보관 케이스', '쇼핑백', '선물 세트', '체험 3포']),
            Text('그래프 자리 — 위 10개 상품의 막대. 수량·금액 단추로 기준을 바꿉니다.', { sm: true, mute: true }),
        ),
        Tabs(VIEW, '상품별'),
        ListHead({ total: 5, right: [Select({ value: '판매 수량 많은 순', w: 160 }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: P_COLS, rows: PRODUCTS, foot: P_FOOT }),
        Note('금액은 예시 값입니다(판매가 미확정). 상품명을 누르면 그 상품의 날짜별 판매 추이가 오른쪽에서 열립니다.'),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-81 · 상품별 보기 · 1위 상품 줄을 펼침 → 구성별 줄이 아래로' }, Page(
        Filters({ open: false, summary: '기간 10-12 ~ 11-11 (최근 1개월) · 채널 전체 · 카테고리 전체' }),
        Tabs(VIEW, '상품별'),
        Table({ cols: P_COLS, rows: [
            { on: true, c: ['1', Thumb(36), `<u>${P}</u><small>품목 3개 · 접기 ${Icon('angle-up-min')}</small>`, '<b>498개</b>', '28,930,000원', '21개', '4.2%', '<b>27,640,000원</b>', '332개 / 166개', '+11.2%'] },
            { tied: true, c: ['', '', '구성 1박스(14일분)', '271개 <small>54%</small>', '13,279,000원', '9개', '3.3%', '12,838,000원', '176개 / 95개', '+6.3%'] },
            { tied: true, c: ['', '', '구성 2박스(28일분)', '168개 <small>34%</small>', '15,624,000원', '8개', '4.8%', '14,880,000원', '112개 / 56개', '+15.9%'] },
            { tied: true, c: ['', '', '구성 4박스(56일분)', '59개 <small>12%</small>', '10,384,000원', '4개', '6.8%', '9,680,000원', '44개 / 15개', '+22.9%'] },
            PRODUCTS[1],
        ] }),
    )),
    Canvas({ label: 'A-81 · 옵션(품목)별 보기' }, Page(
        Filters({ open: false, summary: '기간 10-12 ~ 11-11 (최근 1개월) · 채널 전체 · 카테고리 전체' }),
        Tabs(VIEW, '옵션(품목)별'),
        ListHead({ total: 9, left: Check('옵션 있는 상품만', { on: true }), right: [Select({ value: '판매 수량 많은 순', w: 160 }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ cols: O_COLS, rows: ITEMS }),
        Note('상품 안 비중 = 그 상품 판매 수량 중 이 옵션이 차지하는 몫. 지금 재고는 재고 관리와 같은 값이며 품절 임박 품목은 표시됩니다.'),
    )),
    Canvas({ label: 'A-81 · 상품명을 누름 → 날짜별 판매 추이 (오른쪽 드로어)' }, Overlay({ bg: Page(Filters({ open: false, summary: '기간 10-12 ~ 11-11 (최근 1개월)' }), Tabs(VIEW, '상품별'), Table({ cols: P_COLS, rows: PRODUCTS })), align: 'right', h: 660 },
        SideDrawer({ title: '상품 판매 추이', sub: SHOP.productShort, w: 640, foot: [Btn('상품 수정으로'), Btn('재고 관리로'), Btn('엑셀 내려받기', { icon: 'download' })] },
            KV([['기간', '10-12 ~ 11-11 (최근 1개월)'], ['판매 수량', '<b>498개</b> · 하루 평균 16개'], ['가장 많이 팔린 날', '11-06(금) 31개'], ['취소·반품', '21개 (취소 15 · 반품 6) · 가장 많은 사유: 단순 변심 9']], { wide: true }),
            '<div style="height:14px"></div>',
            BarChart([98, 104, 121, 133, 42], ['10월 3주', '10월 4주', '11월 1주', '11월 2주', '이번 주(3일)']),
            Text('그래프 자리 — 주 단위 판매 수량. 일 단위로 바꿀 수 있습니다.', { sm: true, mute: true }),
            Table({ dense: true, cols: ['주', { t: '1박스', w: 70, align: 'right' }, { t: '2박스', w: 70, align: 'right' }, { t: '4박스', w: 70, align: 'right' }, { t: '합계', w: 70, align: 'right' }, { t: '취소·반품', w: 80, align: 'right' }], rows: [
                ['11-09 ~ 11-11', '24', '14', '4', '<b>42</b>', '1'], ['11-02 ~ 11-08', '71', '46', '16', '<b>133</b>', '6'], ['10-26 ~ 11-01', '66', '40', '15', '<b>121</b>', '5'], ['10-19 ~ 10-25', '58', '35', '11', '<b>104</b>', '5'], ['10-12 ~ 10-18', '52', '33', '13', '<b>98</b>', '4'],
            ] }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '정렬 칸을 누름', right: '입력칸만', pad: 20 }, `<div style="width:210px;min-height:230px">${Select({ value: '판매 수량 많은 순', w: 160, open: true, options: [{ t: '판매 수량 많은 순', on: true }, '판매 금액 많은 순', '취소율 높은 순', '앞 기간보다 많이 늘어난 순', '앞 기간보다 많이 줄어든 순'] })}</div>`),
        Canvas({ size: 'auto', label: '엑셀 내려받기 → 완료 (보고 있는 보기 그대로)', right: '안내만', pad: 20 }, Toast('상품통계_옵션별_20261012-20261111.xlsx 를 내려받았습니다. (9행)')),
    ),
    Canvas({ label: 'A-81 · 고른 기간에 판매가 없을 때' }, Page(
        Filters({ open: false, summary: '기간 11-11 (오늘) · 채널 스마트스토어 · 카테고리 소품' }),
        Empty({ icon: 'chart-bar', title: '이 조건으로 팔린 상품이 없습니다', desc: '오늘 · 스마트스토어 · 소품 카테고리로 찾았습니다. 소품 카테고리 상품은 스마트스토어에 연동되어 있지 않습니다.', action: [Btn('최근 1개월로 보기', 'primary'), Btn('조건 초기화')] }),
    )),
);

export default function A81() {
    return [state1].join('');
}
