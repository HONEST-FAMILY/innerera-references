import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chip, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle,
    Textarea, FormTable, Filters, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast,
    Upload, ImageGuide, Box, KV, Note, Text, Icon, Flex, Grid, Empty, Thumb, Img, DragRow, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const Col = (...c) => `<div style="min-width:0">${c.join('')}</div>`;

const Cal = (o = {}) => {
    const cells = [];
    for (let i = 0; i < (o.start || 0); i += 1) cells.push('<span></span>');
    for (let d = 1; d <= (o.days || 30); d += 1) {
        const past = d < (o.min || 0);
        const edge = d === o.from || d === o.to;
        const mid = o.from && o.to && d > o.from && d < o.to;
        const style = edge ? 'background:var(--dark);color:#fff;font-weight:700' : mid ? 'background:var(--fill)' : past ? 'color:var(--line);text-decoration:line-through' : d === o.today ? 'border:1px solid var(--ink)' : '';
        cells.push(`<span style="height:30px;display:flex;align-items:center;justify-content:center;border-radius:3px;${style}">${d}</span>`);
    }
    return `<div style="width:262px;border:1px solid var(--ink);border-radius:4px;background:#fff;padding:12px;font-size:12.5px;box-shadow:0 6px 18px rgba(0,0,0,.14)">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">${Icon('angle-left-min')}<b>${o.ym || '2026년 11월'}</b>${Icon('angle-right-min')}</div>
<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center">${['일', '월', '화', '수', '목', '금', '토'].map((w) => `<span style="color:var(--mute)">${w}</span>`).join('')}${cells.join('')}</div>
<div style="margin-top:8px;font-size:11.5px;color:var(--mute)">테두리 = 오늘 · 줄 그은 날 = 지난 날이라 고를 수 없음 · 검은 칸 = 시작·끝 · 회색 = 진행 기간</div></div>`;
};

const PROMOS = [
    { n: '블랙위크 — 2박스 구성 특가', period: '11-20 00:00 ~ 11-30 23:59', st: '예정', items: 2, place: '메인 띠 배너 · 상단 메뉴', view: '-', sales: '-' },
    { n: '11월 감사제 — 전 구성 무료배송', period: '11-01 00:00 ~ 11-19 23:59', st: '진행 중', items: 3, place: '메인 첫 배너 · 기획전 목록', view: '4,218', sales: '6,482,000원' },
    { n: '선물하기 좋은 4박스 묶음', period: '상시', st: '진행 중', items: 1, place: '기획전 목록', view: '912', sales: '1,408,000원' },
    { n: '한가위 미리 준비', period: '09-10 ~ 09-30', st: '종료', items: 3, place: '노출 안 함', view: '7,804', sales: '11,930,000원' },
    { n: '연말 감사 세트(작성 중)', period: '정하지 않음', st: '임시 저장', items: 0, place: '-', view: '-', sales: '-' },
];
const stBadge = (s) => Badge(s, { '진행 중': 'solid', 예정: 'dash', 종료: 'mute', '임시 저장': 'line' }[s]);
const COLS = [{ t: '순서', w: 46 }, { t: '배너', w: 110 }, '기획전 이름', { t: '기간', w: 190 }, { t: '상태', w: 84 }, { t: '상품', w: 56, align: 'right' }, { t: '노출 위치', w: 170 }, { t: '방문', w: 64, align: 'right' }, { t: '매출', w: 100, align: 'right' }, { t: '노출', w: 60 }];
const row = (p) => ({ dim: p.st === '종료', c: [Icon('drag-vertical'), Img({ w: 96, h: 40 }), `<u>${p.n}</u><small>/events/${p.st === '임시 저장' ? '(주소 미정)' : PROMOS.indexOf(p) + 11}</small>`, p.period, stBadge(p.st), `${p.items}개`, p.place, p.view, p.sales, Toggle('', { on: p.st === '진행 중' || p.st === '예정' })] });

const Page = (...body) => AdminLayout({ active: 'a-42', actions: [Btn('기획전 등록', { kind: 'primary', icon: 'plus' })] }, body);
const listBody = (checked = []) => [
    Filters({ open: false, summary: '상태 전체 · 기간 전체' }),
    checked.length
        ? BulkBar({ count: checked.length }, Btn('노출 끄기', 'primary'), Btn('복사해서 새로 만들기', 'line'), Btn('삭제', 'line'))
        : ListHead({ total: 5, left: Chips(['전체 5', '진행 중 2', '예정 1', '종료 1', '임시 저장 1'], '전체 5'), right: PerPage(50) }),
    Table({ check: true, checked, cols: COLS, rows: PROMOS.map(row) }),
    Note('순서는 고객 화면 기획전 목록(/events)에 나오는 차례입니다. 손잡이를 끌어 바꿉니다. 방문·매출은 기획전 페이지를 거쳐 주문한 금액(예시 값)입니다.'),
];

const state1 = StateBlock({ idx: 1, title: '목록', note: '혜택 > 기획전의 첫 화면. 기간이 지나면 자동으로 종료되고 고객 화면에서 내려갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '기획전은 "기간 + 배너 + 상품 묶음"입니다. 시작·종료 시각에 맞춰 자동으로 열리고 닫히므로 운영자가 밤 12시에 깨어 있을 필요가 없습니다. 목록에서 상태(예정·진행 중·종료·임시 저장)와 성과(방문·매출)를 같이 보고, 지난 기획전을 복사해 다음 달 것을 만듭니다.'),
    Anno({ title: '범용성' }, '이너에라처럼 상품이 1개인 몰은 구성(1·2·4박스)을 묶어 기획전을 만들 수 있고, 기획전이 하나도 없으면 고객 화면의 기획전 메뉴는 자동으로 숨습니다. 상품이 많은 몰은 묶음을 여러 개(예: "선물용", "2만원 이하") 나눠 탭으로 보여 줍니다.'),
    Canvas({ label: 'A-42 · 기획전 목록' }, Page(listBody())),
    CanvasRow(
        Canvas({ size: 'auto', label: '진행 중인 기획전 삭제 → 막힘 안내', right: '팝업만', pad: 20 },
            Confirm({ w: 430, title: '진행 중인 기획전은 삭제할 수 없습니다', desc: '"11월 감사제 — 전 구성 무료배송"이 고객 화면에 나가 있습니다(메인 첫 배너 연결).<br>먼저 노출을 끄면 배너에서도 내려가고, 그 뒤에 삭제할 수 있습니다.', foot: [Btn('닫기'), Btn('노출 끄기', 'primary')] })),
        Canvas({ size: 'auto', label: '기획전이 없는 몰', right: '부분', pad: 20 },
            `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'gift-o', title: '아직 만든 기획전이 없습니다', desc: '기간을 정해 상품을 묶어 보여 주는 행사 페이지입니다.<br>기획전이 없으면 고객 화면의 기획전 메뉴는 보이지 않습니다.', action: Btn('기획전 등록', { kind: 'primary', icon: 'plus' }) })}</div>`),
    ),
);

const bannerBox = (err) => Box({ title: '2. 대표 배너', sub: 'PC와 모바일을 따로 올립니다' }, Grid('1fr 1fr',
    Col(Text('PC 배너', { b: true }), Upload({ title: 'PC 배너 올리기', guide: ImageGuide({ size: '1920 × 600 px', ratio: '16:5', max: '2MB 이하', ext: 'JPG · PNG · WEBP', more: ['글자는 가운데 1200 px 안쪽에(양옆은 화면 폭에 따라 잘림)'] }), files: err ? [{ name: 'blackweek_pc.psd', size: '18.4MB', error: 'PSD 불가' }] : [{ name: 'blackweek_pc_1920x600.jpg', size: '412KB', icon: 'image-o' }] }), err ? `<p class="err">${Icon('error-o')}PSD 는 올릴 수 없습니다. JPG · PNG · WEBP 로 저장해 다시 올려 주세요.</p>` : ''),
    Col(Text('모바일 배너', { b: true }), Upload({ title: '모바일 배너 올리기', guide: ImageGuide({ size: '750 × 750 px', ratio: '1:1', max: '1MB 이하', ext: 'JPG · PNG · WEBP', more: ['안 올리면 PC 배너 가운데를 잘라 씁니다(권하지 않음)'] }), files: err ? [{ name: 'blackweek_m.jpg', size: '640 × 400', error: '크기 작음' }] : [] }), err ? `<p class="err">${Icon('error-o')}가로 750 px 이상으로 올려 주세요(지금 640 px).</p>` : ''),
));

const productBox = Box({ title: '3. 상품 묶음', sub: '묶음마다 제목을 붙이고 상품을 고릅니다', right: Btn('묶음 추가', { size: 'sm', icon: 'plus' }) },
    DragRow({ right: [Btn('상품 고르기', { size: 'sm', icon: 'search' }), Btn('묶음 삭제', { size: 'sm' })] }, Flex({ gap: 8, align: 'center' }, Text('묶음 1', { sm: true, mute: true }), Input({ value: '가장 많이 찾는 구성', w: 240 }), Select({ value: '한 줄에 2개', w: 130 }))),
    Table({ dense: true, cols: [{ t: '순서', w: 46 }, { t: '상품 · 구성', w: 300 }, { t: '판매가', w: 100, align: 'right' }, { t: '기획전 가격', w: 150 }, { t: '재고', w: 70, align: 'right' }, { t: '상태', w: 80 }, { t: '빼기', w: 50 }], rows: [
        [Icon('drag-vertical'), `${Flex({ gap: 8, align: 'center' }, Thumb(36), `<span>${P}<small>2박스(28일분)</small></span>`)}`, '93,000원', `${Input({ value: '83,700', suffix: '원', w: 120 })}<small>10% 할인</small>`, '212', Badge('판매 중', 'check'), Icon('close')],
        [Icon('drag-vertical'), `${Flex({ gap: 8, align: 'center' }, Thumb(36), `<span>${P}<small>4박스(56일분)</small></span>`)}`, '176,000원', `${Input({ placeholder: '판매가 그대로', suffix: '원', w: 120 })}`, '0', Badge('품절', 'strike'), Icon('close')],
    ] }),
    Note('기획전 가격을 넣으면 기획전 기간에만 그 가격으로 팔리고, 끝나면 판매가로 돌아갑니다. 비우면 판매가 그대로. 품절 상품은 고객 화면에서 맨 뒤로 가고 "품절" 표시가 붙습니다. 금액은 예시 값입니다.'),
    DragRow({ right: [Btn('상품 고르기', { size: 'sm', icon: 'search' }), Btn('묶음 삭제', { size: 'sm' })] }, Flex({ gap: 8, align: 'center' }, Text('묶음 2', { sm: true, mute: true }), Input({ placeholder: '묶음 제목(비우면 제목 없이 이어서 보임)', w: 300 }), Text('상품 0개', { sm: true, mute: true }))),
);

const FormPage = (o = {}) => AdminLayout({ active: 'a-42', crumb: ['혜택', '기획전', '기획전 등록'], title: '기획전 등록', actions: [Btn('미리보기', { icon: 'eye-o' }), Btn('임시 저장'), Btn('저장', 'primary')] },
    Box({ title: '1. 기본 정보' }, FormTable([
        { k: '기획전 이름', required: true, v: Input({ value: '블랙위크 — 2박스 구성 특가', w: 400 }), help: '고객 화면 제목과 검색 결과에 보입니다. 40자까지.' },
        { k: '한 줄 소개', v: Input({ value: '11월 마지막 열흘, 2박스 구성 10% 할인', w: 480 }) },
        { k: '기간', required: true, v: [RadioGroup(['기간 지정', '상시'], '기간 지정'), Flex({ mt: 8, gap: 6, align: 'center' }, Input({ value: '2026-11-20 00:00', icon: 'calendar', w: 180 }), '<span class="tilde">~</span>', Input({ value: o.err ? '' : '2026-11-30 23:59', placeholder: '끝나는 날', icon: 'calendar', w: 180, error: o.err }))], error: o.err ? '끝나는 날을 골라 주세요. 끝이 없는 기획전이면 "상시"를 고르세요.' : undefined, help: '시작 시각에 자동으로 열리고 끝 시각에 자동으로 닫힙니다.' },
        { k: '끝난 뒤', v: RadioGroup(['"종료된 기획전입니다" 안내 보여 주기', '상품 목록으로 보내기'], '"종료된 기획전입니다" 안내 보여 주기') },
    ])),
    bannerBox(o.err),
    productBox,
    Box({ title: '4. 노출 위치' }, FormTable([
        { k: '고객 화면 노출', v: [Toggle('기간이 되면 고객 화면에 보여 줍니다', { on: true })] },
        { k: '보여 줄 곳', v: CheckGroup(['기획전 목록(/events)', '메인 띠 배너', '메인 첫 배너 슬라이드', '상단 메뉴에 이름으로 추가', '상품 상세 위쪽 띠'], ['기획전 목록(/events)', '메인 띠 배너', '상단 메뉴에 이름으로 추가']), help: '메인 배너에 넣으면 디자인 > 배너·팝업에 이 기획전으로 가는 배너가 자동으로 만들어지고, 기간이 끝나면 함께 내려갑니다.' },
        { k: '연결 쿠폰', v: [Chip('블랙위크 2박스 구성 10%', { on: true, close: true }), Btn('쿠폰 고르기', { size: 'sm', icon: 'search' })], help: '기획전 페이지 위쪽에 "쿠폰 받기"로 보입니다(다운로드 방식 쿠폰만). 쿠폰 기능이 꺼진 몰에는 이 줄이 없습니다.' },
        { k: '주소', v: [Text('innerera.example/events/', { sm: true, mute: true }), Input({ value: 'blackweek', w: 160 }), Btn('주소 복사', { size: 'sm', icon: 'link' })], help: '광고·알림톡에 붙일 주소. 영문 소문자·숫자·하이픈.' },
        { k: '검색 노출', v: Textarea({ value: '이너에라 블랙위크 — 롱지비티 석류맛 젤리스틱 2박스 구성 10% 할인, 11월 30일까지', h: 56, count: '48 / 120' }), help: '검색 결과와 카카오톡 공유 미리보기에 나오는 설명.' },
    ])),
);

const pickModal = Modal({ title: '상품 고르기 · 묶음 1', w: 760, foot: [Text('고른 품목 <b>2</b>개', { sm: true }), Btn('취소'), Btn('2개 넣기', 'primary')] },
    Flex({ gap: 6 }, Select({ value: '전체 카테고리', w: 170, open: true, search: '', options: [{ t: '전체 카테고리', on: true }, '젤리스틱', '선물 세트', { t: '정기배송', sub: '준비 중', disabled: true }] }), Input({ placeholder: '상품 이름 · 상품 코드', icon: 'search', w: 260 }), Check('판매 중인 상품만', { on: true }), Check('이미 넣은 상품 숨기기', { on: false })),
    '<div style="height:150px"></div>',
    Table({ check: true, checked: [1, 2], dense: true, cols: [{ t: '상품', w: 290 }, '구성(품목)', { t: '판매가', w: 100, align: 'right' }, { t: '재고', w: 60, align: 'right' }, { t: '상태', w: 110 }], rows: [
        [P, '1박스(14일분)', '49,000원', '480', Badge('판매 중', 'check')],
        [P, '2박스(28일분)', '93,000원', '212', Badge('판매 중', 'check')],
        [P, '4박스(56일분)', '176,000원', '0', Badge('품절', 'strike')],
        { dim: true, nocheck: true, c: ['석류맛 젤리스틱 체험 3포', '단일 구성', '5,000원', '-', Badge('판매 중지', 'x')] },
    ] }),
    Note('판매 중지 상품은 고를 수 없습니다. 품절 상품은 고를 수 있지만 고객 화면에 "품절"로 보입니다.'),
);

const state2 = StateBlock({ idx: 2, title: '등록(배너·상품 묶음·기간)', note: '기획전 등록 버튼 또는 목록에서 이름을 눌렀을 때. 위에서부터 기본 정보 → 배너 → 상품 묶음 → 노출 위치.' },
    Anno({ title: '이미지 규격' }, 'PC 배너 1920 × 600 px(16:5) · 2MB 이하 / 모바일 배너 750 × 750 px(1:1) · 1MB 이하 / JPG · PNG · WEBP. 규격은 올리는 칸 바로 아래에 항상 적혀 있고, 맞지 않으면 무엇이 틀렸는지 파일 줄에 표시합니다. 초기값: 기간 지정(오늘 ~ 14일 뒤) · 노출 켜짐 · 기획전 목록에만 노출.'),
    Anno({ title: '운영자가 바꿀 수 있는 범위' }, '이름·소개·기간·배너·상품 묶음(여러 개, 제목·한 줄 개수·순서)·기획전 가격·노출 위치·연결 쿠폰·주소·검색 설명. 페이지 모양(배너 아래 상품 격자)은 고정이고, 자유로운 구성이 필요하면 디자인 > 콘텐츠 페이지를 씁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '기획전 가격은 기간에만 적용되고 끝나면 자동으로 원래 판매가로 돌아갑니다. 스마트스토어 가격은 바뀌지 않습니다. 진행 중인 기획전의 기간을 줄이거나 가격을 올릴 때는 "이미 장바구니에 담은 고객은 주문할 때 바뀐 가격이 적용됩니다" 안내가 뜹니다.'),
    Canvas({ label: 'A-42 · 기획전 등록(전체 화면)' }, FormPage()),
    Canvas({ label: 'A-42 · 상품 고르기 버튼 → 검색형 팝업(카테고리 목록 열림)' }, Overlay({ bg: FormPage(), h: 700 }, pickModal)),
    CanvasRow(
        Canvas({ size: 'auto', label: '기간 끝 날짜 칸 누름 → 달력', right: '부분', pad: 20 },
            Flex({ gap: 6, align: 'center' }, Input({ value: '2026-11-20 00:00', icon: 'calendar', w: 180 }), '<span class="tilde">~</span>', Input({ value: '2026-11-30 23:59', icon: 'calendar', w: 180, focus: true })),
            `<div style="margin:6px 0 0 200px">${Cal({ today: 11, min: 11, from: 20, to: 30 })}<div style="width:262px;margin-top:6px;display:flex;gap:6px;align-items:center;font-size:12.5px">끝나는 시각 ${Select({ value: '23:59', w: 100 })} ${Btn('적용', { size: 'sm', kind: 'primary' })}</div></div>`),
        Canvas({ size: 'auto', label: '배너 파일 오류(확장자 · 크기)', right: '부분', pad: 20 }, `<div style="width:640px">${bannerBox(true)}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '저장 오류 · 끝나는 날 없음 / 상품 0개', right: '부분', pad: 20 }, `<div style="width:600px">${FormTable([
            { k: '기간', required: true, v: Flex({ gap: 6, align: 'center' }, Input({ value: '2026-11-20 00:00', icon: 'calendar', w: 180 }), '<span class="tilde">~</span>', Input({ placeholder: '끝나는 날', icon: 'calendar', w: 180, error: true })), error: '끝나는 날을 골라 주세요. 끝이 없는 기획전이면 "상시"를 고르세요.' },
            { k: '상품 묶음', required: true, v: Text('묶음 1 · 상품 0개'), error: '상품을 1개 이상 넣어 주세요. 상품 없이 저장하려면 "임시 저장"을 쓰세요.' },
        ])}</div>`, '<div style="height:12px"></div>', Toast('저장하지 못했습니다. 표시된 2곳을 고쳐 주세요.', { kind: 'error' })),
        Canvas({ size: 'auto', label: '저장 완료 · 미리보기 버튼', right: '부분', pad: 20 },
            Toast('기획전을 저장했습니다. 11-20 00:00 에 자동으로 열립니다.', { action: '고객 화면 미리보기' }),
            '<div style="height:14px"></div>',
            `<div style="width:420px;border:1px solid var(--line);border-radius:4px;padding:12px">${Text('고객 화면 미리보기(새 창) — PC / 모바일 전환', { sm: true, mute: true })}${Img({ h: 120, label: 'PC 배너 1920 × 600' })}<div style="height:8px"></div><b>가장 많이 찾는 구성</b>${Grid(2, Img({ h: 90, label: '2박스(28일분) 83,700원' }), Img({ h: 90, label: '4박스(56일분) 품절' }))}</div>`),
    ),
);

export default function A42() {
    return [state1, state2].join('');
}
