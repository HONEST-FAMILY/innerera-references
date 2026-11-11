import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, ChannelBadge, Chip, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle,
    Textarea, FormTable, Table, Tabs, Overlay, Modal, Confirm, Toast, Upload, ImageGuide, Box, KV, Note, Text, Icon, Flex, Grid, Img, Thumb, Filters, ListHead, Pager, SHOP,
} from '../lib/blocks.js';

const P = SHOP.product;
const SECTIONS = ['기본정보', '판매가·할인', '옵션·재고', '추가구성상품', '이미지', '상세설명', '상품정보제공고시', '배송', '검색 노출', '스마트스토어'];

const SectionNav = (active, errors = {}) => `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">${SECTIONS.map((s) => `<span class="wf-chip${s === active ? ' on' : ''}"${errors[s] ? ' style="border:2px solid var(--dark);font-weight:800"' : ''}>${errors[s] ? Icon('error-o') : ''}${s}${errors[s] ? ` ${errors[s]}` : ''}</span>`).join('')}</div>`;

const CHECKLIST = ['상품명', '카테고리', '판매가', '옵션·재고', '대표 이미지', '상세설명', '상품정보제공고시', '배송비 템플릿'];

const SaveBar = (o = {}) => {
    const miss = o.miss || [];
    return `<div style="position:sticky;top:70px">${Box({ title: '저장', sub: o.isNew ? '새 상품' : '수정 중' },
        `<dl style="display:grid;grid-template-columns:62px 1fr;gap:6px 8px;margin:0;font-size:12.5px">${[['판매상태', Badge(o.sale || '판매중', o.sale === '판매중지' ? 'strike' : 'solid')], ['전시', Badge(o.show || '전시함', 'check')], ['채널', o.channel || '자사몰 · 스마트스토어'], ['마지막 저장', o.saved || '11-10 17:42 이보림']].map(([k, v]) => `<dt style="color:var(--mute)">${k}</dt><dd style="margin:0">${v}</dd>`).join('')}</dl>`,
        '<div style="height:12px"></div>',
        Text('필수 항목', { b: true, sm: true }),
        `<div style="display:flex;flex-direction:column;gap:4px;font-size:12.5px;margin-bottom:12px">${CHECKLIST.map((c) => (miss.includes(c) ? `<span style="font-weight:800">${Icon('error-o')} ${c} <u>이동</u></span>` : `<span style="color:var(--ink2)">${Icon('check-min')} ${c}</span>`)).join('')}</div>`,
        Btn(o.isNew ? '상품 등록' : '저장', { kind: 'primary', block: true, size: 'lg' }),
        '<div style="height:6px"></div>',
        Btn('임시 저장', { block: true }),
        '<div style="height:6px"></div>',
        Btn('내 쇼핑몰에서 미리보기', { block: true, icon: 'external-link' }),
        o.isNew ? '' : `<div style="height:6px"></div>${Flex({ gap: 6 }, Btn('복사', { size: 'sm' }), Btn('삭제', { size: 'sm', kind: 'danger' }))}`,
        Note(o.note || '저장하면 자사몰에 바로 반영되고, 스마트스토어 연동이 켜져 있으면 가격·재고가 함께 전송됩니다.'),
    )}</div>`;
};

const Page = (section, o, ...body) => AdminLayout(
    { active: 'a-21', title: o.isNew ? '상품 등록' : '상품 수정', crumb: ['상품', '상품 목록', o.isNew ? '상품 등록' : P], desc: o.isNew ? '' : `${P} · 상품번호 1001 · 등록 2026-10-28`, actions: [Btn('목록으로', { icon: 'list' })] },
    SectionNav(section, o.errors),
    Grid('minmax(0,1fr) 236px', `<div>${body.flat(Infinity).join('')}</div>`, SaveBar(o)),
);

const TagBox = (values = [], ph = '', w = 420) => `<span style="display:inline-flex;flex-wrap:wrap;gap:4px;align-items:center;min-height:36px;padding:4px 8px;border:1px solid #b4b4bb;border-radius:4px;background:#fff;width:${w}px;max-width:100%">${values.map((v) => Chip(v, { on: true, close: true })).join('')}<span style="color:var(--mute);font-size:12.5px">${ph}</span></span>`;

const Cal = (o = {}) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const cells = [];
    for (let d = 1; d <= 30; d += 1) cells.push(d);
    const cell = (d) => {
        const past = d < 11;
        const on = d === o.from || d === o.to;
        const mid = o.from && o.to && d > o.from && d < o.to;
        const today = d === 11;
        const style = on ? 'background:var(--dark);color:#fff;font-weight:800' : mid ? 'background:var(--fill)' : past && o.blockPast ? 'color:#b0b0b8;text-decoration:line-through' : today ? 'border:1px solid var(--dark)' : '';
        return `<span style="height:30px;display:flex;align-items:center;justify-content:center;border-radius:3px;font-size:12.5px;${style}">${d}</span>`;
    };
    return `<div style="width:260px;border:1px solid var(--dark);border-radius:4px;background:#fff;padding:10px;box-shadow:0 6px 16px rgba(0,0,0,.12)">
<div style="display:flex;align-items:center;justify-content:space-between;font-weight:800;font-size:13.5px;margin-bottom:6px">${Icon('angle-left-min')}<span>2026년 11월</span>${Icon('angle-right-min')}</div>
<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${days.map((d) => `<span style="text-align:center;font-size:11.5px;color:var(--mute);height:22px">${d}</span>`).join('')}${cells.map(cell).join('')}</div>
<div style="font-size:11.5px;color:var(--mute);margin-top:8px;line-height:1.6">테두리 = 오늘 · 검은 칸 = 시작일·종료일 · 회색 = 기간 안${o.blockPast ? ' · 취소선 = 지난 날짜(고를 수 없음)' : ''}</div>
<div style="display:flex;gap:6px;margin-top:8px">${Input({ value: o.time || '00:00', icon: 'clock-o', w: 110 })}${Btn('적용', { kind: 'primary', size: 'sm' })}</div>
</div>`;
};

const CATS = [{ t: '건강식품 > 젤리스틱', on: true }, { t: '건강식품 > 이너뷰티', on: true }, '건강식품 > 선물 세트', '기획전 > 11월 감사제'];

const basicRows = (o = {}) => [
    { k: '상품명', required: true, v: Input({ value: o.empty ? '' : P, placeholder: '예) 이너에라 롱지비티 석류맛 젤리스틱 20 g × 14포', w: 520 }), help: `${o.empty ? '0' : '27'} / 100자 · 스마트스토어로 보낼 때는 50자까지만 전송되고 특수문자 일부가 빠집니다.` },
    { k: '한 줄 소개', v: Input({ value: o.empty ? '' : '하루 한 포, 석류 한 알의 리추얼', placeholder: '목록·상세 상품명 아래에 나오는 짧은 문구', w: 520 }), help: '0 ~ 40자 · 비워 두면 표시하지 않습니다.' },
    { k: '카테고리', required: true, v: o.catOpen
        ? `<span>${TagBox(['건강식품 > 젤리스틱', '건강식품 > 이너뷰티'], '', 520)}<span style="display:block;margin-top:2px">${Select({ value: '', placeholder: '카테고리 이름으로 찾기', w: 520, open: true, search: '건강', options: CATS.concat([{ t: `${Icon('plus-min')} '건강' 이름으로 새 카테고리 만들기`, sub: '카테고리 화면으로 가지 않고 바로 추가' }]) })}</span></span>`
        : TagBox(o.empty ? [] : ['건강식품 > 젤리스틱', '건강식품 > 이너뷰티'], o.empty ? '카테고리 이름으로 찾기' : '추가하려면 이름 입력', 520), help: '여러 개를 고를 수 있습니다. 첫 번째가 대표 카테고리이며 상세 화면 경로에 나옵니다(끌어서 순서 바꾸기).' },
    { k: '판매상태', required: true, v: RadioGroup(['판매중', '품절', '판매중지'], o.empty ? '판매중' : '판매중'), help: '품절 = 상품은 보이고 구매 버튼이 재입고 알림으로 바뀜 · 판매중지 = 구매 불가, 주문 내역에서는 계속 보임. 재고가 0이 되면 자동으로 품절이 됩니다.' },
    { k: '전시 상태', required: true, v: RadioGroup(['전시함', '전시 안 함'], o.empty ? '전시 안 함' : '전시함'), help: '전시 안 함 = 목록·검색에서 숨김. 주소를 아는 사람만 볼 수 있어 등록 중인 상품을 미리 확인할 때 씁니다.' },
    o.noChannel ? null : { k: '판매 채널', required: true, v: [Check(ChannelBadge('자사몰'), { on: true }), Check(ChannelBadge('스마트스토어'), { on: !o.empty })], help: '스마트스토어를 체크하면 아래 스마트스토어 묶음에서 카테고리를 맞춘 뒤 저장할 때 함께 전송됩니다.' },
    { k: '판매 기간', v: [RadioGroup(['상시 판매', '기간 설정'], '상시 판매')], help: '기간 설정을 고르면 시작·종료 일시 칸이 나오고, 종료되면 자동으로 판매중지가 됩니다.' },
    { k: '상품 표시', v: CheckGroup(['신상품', '베스트', '추천', '무료배송 표시'], o.empty ? [] : ['베스트']), help: '목록 카드에 붙는 작은 표시. 표시 이름과 종류는 디자인 > 사이트 기본에서 바꿉니다.' },
    { k: '1회 구매 수량', v: [Text('최소', { sm: true }), Input({ value: '1', w: 80, suffix: '개' }), Text('최대', { sm: true }), Input({ value: o.empty ? '' : '10', placeholder: '제한 없음', w: 110, suffix: '개' })] },
    { k: '상품 관리코드', v: Input({ value: o.empty ? '' : 'IE-LG-PG14', placeholder: '창고·회계에서 쓰는 자체 코드', w: 240 }), help: '고객에게 보이지 않습니다. 엑셀 일괄 수정에서 상품을 찾는 기준으로 쓸 수 있습니다.' },
    { k: '관리자 메모', v: Textarea({ value: o.empty ? '' : '11월 감사제 기간(11-20 ~ 11-30) 2박스 구성 할인 예정. 가격은 대표 확인 후 변경.', placeholder: '운영자끼리 보는 메모', h: 56 }) },
].filter(Boolean);

const state1 = StateBlock({ idx: 1, title: '기본정보', note: '상품 등록·수정 화면 맨 위 묶음. 화면은 한 페이지에 묶음이 위에서 아래로 이어지고, 위쪽 묶음 이름표를 누르면 그 위치로 내려갑니다. 오른쪽 저장 바는 스크롤해도 따라옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '카페24·스마트스토어처럼 한 페이지에서 위에서 아래로 채우고 저장 한 번으로 끝냅니다. 묶음을 탭으로 나누면 다른 탭의 필수 항목을 빠뜨린 줄 모르고 저장을 누르게 되므로, 오른쪽 저장 바에 필수 항목 체크 목록을 항상 띄워 둡니다. 카테고리는 수십 개가 될 수 있어 검색형 다중 선택입니다.'),
    Anno({ warn: true, title: '초기값 · 기능을 껐을 때' }, '새 상품 초기값: 판매상태 판매중 · 전시 안 함(다 채우고 나서 전시함으로) · 채널 자사몰만 · 판매 기간 상시 · 최소 1개. 설정 > 기능 켜고 끄기에서 스마트스토어를 끈 몰은 판매 채널 줄과 스마트스토어 묶음이 아예 없습니다.'),
    Canvas({ label: 'A-21 · 상품 수정(이너에라) · 기본정보 묶음' }, Page('기본정보', {}, Box({ title: '기본정보' }, FormTable(basicRows())))),
    Canvas({ label: 'A-21 · 상품 목록 > 상품 등록 버튼 → 새 상품(빈 화면·초기값) · 카테고리 칸을 눌러 찾는 중' }, Page('기본정보', { isNew: true, sale: '판매중', show: '전시 안 함', channel: '자사몰', saved: '아직 저장 전', miss: CHECKLIST, note: '필수 항목을 다 채우기 전에는 임시 저장만 할 수 있습니다. 임시 저장한 상품은 상품 목록의 임시 저장 탭에 있습니다.' },
        Box({ title: '기본정보' }, FormTable(basicRows({ empty: true, catOpen: true }).slice(0, 6))))),
    Canvas({ size: 'auto', label: '스마트스토어 기능을 끈 몰 — 판매 채널 줄 없음, 묶음 이름표에도 스마트스토어 없음', right: '묶음만', pad: 20 },
        `<div style="width:792px">${Box({ title: '기본정보' }, FormTable(basicRows({ noChannel: true }).slice(2, 6)))}</div>`),
);

const priceRows = (o = {}) => [
    { k: '판매가', required: true, v: [Input({ value: '49,000', w: 160, suffix: '원' }), Badge('예시 값', 'line')], help: '옵션이 있으면 가장 싼 품목의 가격입니다. 옵션별 가격은 옵션·재고 묶음의 추가금으로 넣습니다.' },
    { k: '정가(소비자가)', v: Input({ value: '55,000', w: 160, suffix: '원' }), help: '넣으면 판매가 옆에 취소선으로 보입니다. 비우면 표시하지 않습니다.' },
    { k: '할인', v: RadioGroup(['할인 없음', '정액(원)', '정률(%)'], o.kind || '정액(원)') },
    o.kind === '할인 없음' ? null : { k: '할인 값', required: true, v: o.kind === '정률(%)'
        ? [Input({ value: '10', w: 110, suffix: '%' }), Text('원 단위', { sm: true }), Select({ value: '10원 단위 버림', w: 150 })]
        : [Input({ value: o.err ? '52,000' : '4,000', w: 160, suffix: '원', error: o.err })], error: o.err ? '할인 금액이 판매가(49,000원)보다 큽니다. 49,000원보다 작은 금액을 넣어 주세요.' : undefined },
    o.kind === '할인 없음' ? null : { k: '할인 기간', v: [RadioGroup(['기간 없이 계속', '기간 설정'], '기간 설정'), Input({ value: '2026-11-20 00:00', icon: 'calendar', w: 180, focus: o.cal }), '<span>~</span>', Input({ value: '2026-11-30 23:59', icon: 'calendar', w: 180 }), o.cal ? `<span style="display:block;width:100%">${Cal({ from: 20, to: 30, blockPast: true })}</span>` : ''], help: '기간이 끝나면 자동으로 판매가로 돌아갑니다. 시작 전에는 목록에 할인 예정으로 표시됩니다.' },
    { k: '고객이 보는 가격', v: `<div style="border:1px solid var(--line);border-radius:4px;padding:10px 14px;background:var(--box);font-size:13.5px"><s style="color:var(--mute)">55,000원</s> &nbsp; <b style="font-size:17px">${o.kind === '정률(%)' ? '44,100' : o.kind === '할인 없음' ? '49,000' : o.err ? '-' : '45,000'}원</b> &nbsp; ${o.kind === '할인 없음' ? '정가 대비 10% 낮음' : o.err ? '계산할 수 없음' : `정가 대비 ${o.kind === '정률(%)' ? '19' : '18'}% 할인으로 표시 · 11-20 ~ 11-30`}</div>` },
    { k: '과세 구분', required: true, v: RadioGroup(['과세', '면세', '영세'], '과세'), help: '농수산물 원물 같은 면세 상품은 면세로. 현금영수증·세금계산서 금액 계산에 쓰입니다.' },
    o.noPoint ? null : { k: '적립금', v: [RadioGroup(['기본 정책 따름 (구매 금액의 1%)', '이 상품만 따로'], '기본 정책 따름 (구매 금액의 1%)')], help: '이 상품만 따로를 고르면 적립률(%) 또는 적립 금액(원) 칸이 나옵니다. 기본 정책은 혜택 > 적립금에서 바꿉니다.' },
    { k: '원가(공급가)', v: [Input({ value: '21,500', w: 160, suffix: '원' }), Text('예상 이익 23,500원 (판매가의 52%) · 고객에게 보이지 않음', { sm: true, mute: true })] },
].filter(Boolean);

const state2 = StateBlock({ idx: 2, title: '판매가·할인', note: '판매가와 할인 방식(없음·정액·정률), 할인 기간. 값을 넣는 즉시 고객이 보는 가격을 계산해 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '행사 때마다 판매가를 직접 고쳤다가 되돌리는 것을 잊는 사고를 막으려고 할인을 판매가와 따로 두고 기간을 겁니다. 기간이 끝나면 저절로 원래 가격이 됩니다. 정률 할인은 원 단위 처리(10원 단위 버림 등)를 정해야 스마트스토어 가격과 어긋나지 않습니다.'),
    Anno({ warn: true, title: '유형별 입력칸 · 기능을 껐을 때' }, '할인 없음 = 할인 값·기간 줄이 사라짐 / 정액 = 원 입력 / 정률 = % 입력 + 원 단위 처리. 적립금 기능을 끈 몰은 적립금 줄이 없습니다. 금액은 모두 예시 값입니다(판매가 미확정).'),
    Canvas({ label: 'A-21 · 판매가·할인 묶음 · 정액 할인 + 기간 설정' }, Page('판매가·할인', {}, Box({ title: '판매가·할인' }, FormTable(priceRows())))),
    CanvasRow(
        Canvas({ size: 'auto', label: '정률(%)을 고르고 할인 기간 시작일 칸을 누름 → 달력', right: '묶음만', pad: 20 }, `<div style="width:792px">${Box({ title: '판매가·할인' }, FormTable(priceRows({ kind: '정률(%)', cal: true }).slice(2, 6)))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '할인 없음 — 할인 값·기간 줄이 사라짐 · 적립금 기능 끈 몰', right: '묶음만', pad: 20 }, `<div style="width:792px">${Box({ title: '판매가·할인' }, FormTable(priceRows({ kind: '할인 없음', noPoint: true }).slice(0, 5)))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 — 할인 금액이 판매가보다 큼', right: '묶음만', pad: 20 }, `<div style="width:792px">${Box({ title: '판매가·할인' }, FormTable(priceRows({ err: true }).slice(2, 6)))}</div>`),
    ),
);

const OptMode = (active) => ({ k: '옵션 방식', required: true, v: RadioGroup(['옵션 없음', '조합형', '단독형'], active), help: '옵션 없음 = 수량만 고름 · 조합형 = 옵션을 곱해서 품목을 만듦(색상 × 사이즈) · 단독형 = 옵션마다 따로 고름(본품 + 선택 사항). 입력형 옵션(고객이 직접 적는 칸)은 어느 방식에서나 아래에서 따로 더합니다.' });

const stockRows = [
    { k: '재고 관리', v: [RadioGroup(['재고 수량으로 관리', '재고 제한 없음'], '재고 수량으로 관리')], help: '주문 제작·디지털 상품처럼 재고가 의미 없는 상품은 제한 없음으로. 이때 재고 칸이 사라지고 재고 관리 화면에도 나오지 않습니다.' },
    { k: '재고 수량', required: true, v: [Input({ value: '320', w: 120, suffix: '개' }), Text('판매 가능 312개 (결제 완료·미출고 8개 제외)', { sm: true, mute: true })] },
    { k: '안전 재고', v: Input({ value: '30', w: 120, suffix: '개' }), help: '이 수량 아래로 내려가면 대시보드 품절 임박 카드와 재고 관리의 품절 임박 필터에 나오고, 내부 수신자에게 알림이 갑니다.' },
    { k: '재고 0일 때', v: RadioGroup(['자동으로 품절 표시', '판매중지로 바꾸기'], '자동으로 품절 표시'), help: '재고가 다시 들어오면 자동으로 판매중으로 돌아갑니다(재입고 알림 신청 고객에게 알림).' },
    { k: '바코드', v: Input({ placeholder: '상품 포장의 바코드 번호 (선택)', w: 240 }) },
];

const state3 = StateBlock({ idx: 3, title: '옵션 없음', note: '옵션 방식에서 옵션 없음을 고른 모습. 품목이 1개라 재고·안전 재고를 이 자리에서 바로 넣습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '옵션이 없는 상품에 옵션 표를 억지로 만들게 하지 않습니다. 옵션 방식 세 가지 중 하나를 고르면 아래 입력칸이 통째로 바뀝니다. 재고는 어떤 방식이든 품목 단위로 저장되므로, 옵션 없는 상품도 재고 관리 화면에서는 품목 1줄로 나옵니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '이미 주문이 있는 상품의 옵션 방식을 바꾸면 기존 품목이 사라져 주문 내역과 재고가 꼬입니다. 바꾸기 전에 확인 팝업을 띄우고, 기존 품목은 지우지 않고 판매 종료 품목으로 남깁니다.'),
    Canvas({ label: 'A-21 · 옵션·재고 묶음 · 옵션 없음' }, Page('옵션·재고', {}, Box({ title: '옵션·재고' }, FormTable([OptMode('옵션 없음'), ...stockRows])))),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문이 있는 상품에서 옵션 방식을 조합형 → 옵션 없음으로 바꿈 → 확인 팝업', right: '팝업만', pad: 20 },
            Confirm({ w: 460, title: '옵션 방식을 바꿀까요?', desc: '지금 품목 3개(1박스 · 2박스 · 4박스)로 받은 주문이 128건 있습니다.<br>바꾸면 기존 품목은 판매 종료 품목으로 남고(주문 내역·통계에는 그대로 보임), 새 품목 1개가 재고 0개로 만들어집니다.<br>스마트스토어에 연동된 상품은 옵션이 다시 전송됩니다.', ok: '옵션 방식 바꾸기', danger: true })),
        Canvas({ size: 'auto', label: '재고 제한 없음을 고른 모습 — 재고 칸이 사라짐', right: '묶음만', pad: 20 }, `<div style="width:640px">${FormTable([{ k: '재고 관리', v: RadioGroup(['재고 수량으로 관리', '재고 제한 없음'], '재고 제한 없음'), help: '재고 수량·안전 재고·재고 0일 때 줄이 사라지고, 판매상태는 직접 바꿀 때만 바뀝니다.' }])}</div>`),
    ),
);

const AxisRow = (n, name, values, o = {}) => `<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px">${Icon('drag-vertical')}<span style="font-size:12.5px;font-weight:700;width:52px;padding-top:8px">옵션 ${n}</span>${Input({ value: name, placeholder: '옵션 이름 (예: 색상)', w: 150, error: o.nameErr })}${TagBox(values, o.ph === undefined ? '값을 적고 Enter 또는 쉼표' : o.ph, 400)}<span style="padding-top:6px">${Btn('', { icon: 'trash-o', size: 'sm' })}</span></div>`;

const AxisBox = (rows, o = {}) => `<div style="border:1px solid var(--line);border-radius:4px;padding:12px;background:var(--box);width:100%">${rows.join('')}<div style="display:flex;align-items:center;gap:8px;margin-top:4px">${Btn(`옵션 추가 (${o.count} / 3)`, { icon: 'plus', size: 'sm', disabled: o.count >= 3 })}${Btn(o.made ? '품목 다시 만들기' : '품목 만들기', { kind: 'primary', size: 'sm' })}<span style="font-size:12.5px;color:var(--ink2)">${o.calc}</span></div></div>`;

const SALE = (v = '판매중') => Select({ value: v, w: 92 });
const NW = (t) => `<span style="white-space:nowrap">${t}</span>`;
const itemCols = (axes) => [...axes.map((a) => ({ t: a })), { t: '추가금', w: 112 }, { t: '재고', w: 96 }, { t: '안전 재고', w: 88 }, { t: '판매상태', w: 106 }, { t: '관리코드', w: 116 }];
const itemRow = (vals, add, stock, safe, code, o = {}) => ({ ...o, c: [...vals.map(NW), Input({ value: add, w: 96, suffix: '원' }), Input({ value: stock, w: 78, suffix: '개', error: o.stockErr }), Input({ value: safe, w: 70, suffix: '개' }), SALE(o.sale), Input({ value: code, w: 98 })] });

const FillBar = (count) => `<div class="wf-bulk">${Icon('check-circle-o')}<span class="cnt" style="white-space:nowrap">선택 <b>${count}</b>개 품목</span><span class="acts" style="align-items:center"><span style="color:var(--ink);display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap">${Input({ placeholder: '추가금', w: 88, suffix: '원' })}${Input({ value: '50', w: 76, suffix: '개' })}${Input({ placeholder: '안전 재고', w: 84 })}${Select({ value: '판매상태 그대로', w: 132 })}</span>${Btn('선택한 품목에 넣기', 'primary')}</span><span class="clear">선택 해제${Icon('close-min')}</span></div>`;

const CLOTH = [['블랙', 'S'], ['블랙', 'M'], ['블랙', 'L'], ['아이보리', 'S'], ['아이보리', 'M'], ['아이보리', 'L']];

const state4 = StateBlock({ idx: 4, title: '조합형 옵션(축 추가 → 품목 자동 생성 → 품목별 추가금·재고·판매상태 일괄 입력)', note: '옵션 이름과 값을 상품마다 자유롭게 적으면(최대 3개) 값을 곱한 품목 표가 만들어집니다. 표에서 여러 줄을 골라 추가금·재고·판매상태를 한 번에 넣습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '옵션 이름을 색상·사이즈처럼 미리 정해 두면 식품의 구성, 화장품의 용량, 꽃의 크기를 담지 못합니다. 그래서 이름도 값도 운영자가 적습니다. 값은 쉼표로 여러 개를 한 번에 붙여 넣을 수 있고(블랙,아이보리), 품목이 수십 개가 되어도 일괄 입력 바로 한 번에 채웁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '품목 수 = 옵션 값의 곱. 300개를 넘으면 만들지 않고 줄이라고 안내합니다. 값을 더하면 새 품목만 추가되고 이미 넣은 추가금·재고는 그대로 둡니다. 주문이 있는 품목의 값은 지우지 못하고 판매중지로만 바꿀 수 있습니다. 추가금은 판매가에 더하는 금액이며 0 이상(가장 싼 품목이 0원)입니다.'),
    Canvas({ label: 'A-21 · 옵션·재고 묶음 · 조합형 · 다른 업종 예시(의류: 색상 2 × 사이즈 3 = 품목 6개) · 3개 선택 → 일괄 입력 바' }, Page('옵션·재고', { channel: '자사몰' },
        Box({ title: '옵션·재고', sub: '다른 업종 예시 · 의류(베이직 코튼 티셔츠)' },
            FormTable([
                OptMode('조합형'),
                { k: '옵션 이름 · 값', required: true, v: AxisBox([AxisRow(1, '색상', ['블랙', '아이보리']), AxisRow(2, '사이즈', ['S', 'M', 'L'])], { count: 2, made: true, calc: '색상 2 × 사이즈 3 = <b>품목 6개</b>' }), help: '줄 왼쪽 손잡이를 끌면 옵션 순서가, 값 칩을 끌면 값 순서가 바뀝니다. 고객 화면에서는 이 순서대로 고릅니다.' },
            ]),
            `<div style="display:flex;align-items:center;gap:10px;margin:16px 0 8px"><b>품목 6개</b><span style="font-size:12.5px;color:var(--mute)">재고 합 290개 · 판매중 5 · 품절 1</span><span style="flex:1"></span>${Btn('엑셀로 내려받아 채우기', { size: 'sm', icon: 'download' })}${Btn('엑셀 올리기', { size: 'sm', icon: 'upload' })}</div>`,
            FillBar(3),
            Table({ check: true, checked: [0, 1, 2], dense: true, cols: itemCols(['색상', '사이즈']), rows: [
                itemRow(CLOTH[0], '0', '50', '5', 'TS-BK-S'),
                itemRow(CLOTH[1], '0', '50', '5', 'TS-BK-M'),
                itemRow(CLOTH[2], '2,000', '50', '5', 'TS-BK-L'),
                itemRow(CLOTH[3], '0', '60', '5', 'TS-IV-S'),
                itemRow(CLOTH[4], '0', '80', '5', 'TS-IV-M'),
                itemRow(CLOTH[5], '2,000', '0', '5', 'TS-IV-L', { sale: '품절', hl: true }),
            ] }),
            Note('머리 체크박스로 전체를 고르거나, 색상·사이즈 머리글을 눌러 그 값만(예: 블랙 전체) 고를 수 있습니다. 재고 0인 품목은 자동으로 품절이 되고 줄이 강조됩니다.'),
        ))),
    Canvas({ label: 'A-21 · 옵션·재고 묶음 · 이너에라 — 구성 1개 옵션(1박스 · 2박스 · 4박스), 추가금으로 가격 차이' }, Page('옵션·재고', {},
        Box({ title: '옵션·재고' },
            FormTable([
                OptMode('조합형'),
                { k: '옵션 이름 · 값', required: true, v: AxisBox([AxisRow(1, '구성', SHOP.options.map((o) => o.name))], { count: 1, made: true, calc: '구성 3 = <b>품목 3개</b>' }), help: '옵션이 1개뿐이면 값이 곧 품목입니다. 판매가 49,000원(예시)에 추가금을 더한 값이 그 구성의 가격입니다.' },
            ]),
            `<div style="display:flex;align-items:center;gap:10px;margin:16px 0 8px"><b>품목 3개</b><span style="font-size:12.5px;color:var(--mute)">재고 합 540개 · 판매중 3</span></div>`,
            Table({ check: true, dense: true, cols: [{ t: '구성' }, { t: '추가금', w: 108 }, { t: '보이는 가격', w: 84, align: 'right' }, { t: '재고', w: 92 }, { t: '안전 재고', w: 84 }, { t: '판매상태', w: 104 }, { t: '관리코드', w: 102 }], rows: [
                [NW('1박스(14일분)'), Input({ value: '0', w: 92, suffix: '원' }), '49,000원', Input({ value: '320', w: 72, suffix: '개' }), Input({ value: '30', w: 64, suffix: '개' }), SALE(), Input({ value: 'IE-LG-01', w: 82 })],
                [NW('2박스(28일분)'), Input({ value: '44,000', w: 92, suffix: '원' }), '93,000원', Input({ value: '160', w: 72, suffix: '개' }), Input({ value: '20', w: 64, suffix: '개' }), SALE(), Input({ value: 'IE-LG-02', w: 82 })],
                [NW('4박스(56일분)'), Input({ value: '127,000', w: 92, suffix: '원' }), '176,000원', Input({ value: '60', w: 72, suffix: '개' }), Input({ value: '10', w: 64, suffix: '개' }), SALE(), Input({ value: 'IE-LG-04', w: 82 })],
            ] }),
            Note('금액은 예시 값입니다(판매가 미확정). 할인(4,000원)은 판매가에만 걸리고 추가금에는 걸리지 않습니다 — 정률 할인은 추가금을 더한 금액 전체에 걸립니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '옵션 3개를 다 채움(옵션 추가 버튼 잠김) · 품목 만들기 전 · 값 이름 중복 오류', right: '입력칸만', pad: 20 }, `<div style="width:700px">${AxisBox([AxisRow(1, '색상', ['블랙', '아이보리', '네이비']), AxisRow(2, '사이즈', ['S', 'M', 'L', 'XL']), AxisRow(3, '기장', ['기본', '롱', '기본'], { ph: '' })], { count: 3, calc: '색상 3 × 사이즈 4 × 기장 2 = 품목 24개가 만들어집니다' })}<p style="font-size:12.5px;font-weight:700;margin:8px 0 0">${Icon('error-o')} 옵션 3 기장에 같은 값 '기본'이 두 번 들어 있습니다. 하나를 지워 주세요.</p></div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문이 있는 값(4박스)을 지우려 함 → 막힘 안내', right: '팝업만', pad: 20 },
            Confirm({ w: 440, title: "'4박스(56일분)'은 지울 수 없습니다", desc: '이 구성으로 받은 주문이 31건 있어 지우면 주문 내역에서 상품을 알 수 없게 됩니다.<br>더 팔지 않으려면 판매상태를 판매중지로 바꾸세요. 고객 화면 옵션 목록에서 사라집니다.', foot: [Btn('닫기'), Btn('판매중지로 바꾸기', 'primary')] })),
        Canvas({ size: 'auto', label: '값을 더한 뒤 품목 다시 만들기 → 확인', right: '팝업만', pad: 20 },
            Confirm({ w: 440, title: '품목 3개가 새로 만들어집니다', desc: "색상에 '네이비'를 더해 네이비 × S·M·L 품목 3개가 추가됩니다.<br>이미 있던 품목 6개의 추가금·재고·관리코드는 그대로 둡니다.<br>새 품목은 재고 0개 · 품절 상태로 만들어지니 재고를 넣어 주세요.", ok: '품목 3개 추가' })),
    ),
);

const soloCols = [{ t: '옵션 값', w: 190 }, { t: '추가금', w: 126 }, { t: '재고', w: 100 }, { t: '판매상태', w: 110 }, { t: '관리코드', w: 120 }, { t: '', w: 70 }];
const soloRow = (name, add, stock, code) => [Input({ value: name, w: 174 }), Input({ value: add, w: 110, suffix: '원' }), Input({ value: stock, w: 84, suffix: '개' }), SALE(), Input({ value: code, w: 108 }), `${Icon('arrows-v')} ${Icon('trash-o')}`];
const SoloGroup = (n, name, required, rows) => Box({ flat: true, title: `${Icon('drag-vertical')} 옵션 ${n}`, right: Btn('옵션 삭제', { size: 'sm', icon: 'trash-o' }) },
    Flex({ gap: 12, align: 'center' }, Input({ value: name, w: 200 }), RadioGroup(['필수 선택', '선택 사항'], required ? '필수 선택' : '선택 사항')),
    '<div style="height:10px"></div>',
    Table({ dense: true, cols: soloCols, rows }),
    Btn('값 추가', { size: 'sm', icon: 'plus' }),
);

const inputCols = [{ t: '', w: 26 }, { t: '입력칸 이름', w: 146 }, { t: '입력 종류', w: 112 }, { t: '필수', w: 44, align: 'center' }, '조건 · 안내 문구', { t: '추가금', w: 98 }, { t: '', w: 34 }];

const state5 = StateBlock({ idx: 5, title: '단독형 옵션', note: '옵션끼리 곱하지 않고 옵션마다 따로 고르게 하는 방식. 필수·선택을 옵션마다 정합니다. 고객이 직접 적는 입력형 옵션도 이 묶음에서 더합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '꽃다발 크기는 반드시 고르고 화병은 원하는 사람만 더하는 식의 상품은 조합형으로 만들면 품목이 쓸데없이 불어납니다(크기 3 × 화병 2 = 6). 단독형은 옵션 값 하나하나가 따로 재고를 가집니다. 고객 화면에서는 옵션마다 선택 목록이 따로 나오고 고른 값이 각각 한 줄로 담깁니다.'),
    Anno({ warn: true, title: '입력형 옵션 — 유형별 입력칸' }, '입력 종류: 글자(최대 글자 수) · 날짜(오늘부터 며칠 뒤 ~ 며칠 뒤까지, 쉬는 요일) · 숫자 · 사진 올리기(JPG·PNG 10MB). 종류에 따라 조건 칸이 달라집니다. 입력한 내용은 주문 목록·주문서 출력·엑셀에 품목과 함께 나와 포장 담당자가 바로 봅니다. 스마트스토어로는 직접입력형 옵션으로 전송됩니다(최대 5개).'),
    Canvas({ label: 'A-21 · 옵션·재고 묶음 · 단독형 · 다른 업종 예시(꽃: 크기 필수 + 화병 선택)' }, Page('옵션·재고', { channel: '자사몰' },
        Box({ title: '옵션·재고', sub: '다른 업종 예시 · 꽃(시즌 꽃다발)' },
            FormTable([OptMode('단독형')]),
            '<div style="height:12px"></div>',
            SoloGroup(1, '꽃다발 크기', true, [soloRow('S (지름 25cm)', '0', '20', 'FL-S'), soloRow('M (지름 35cm)', '15,000', '20', 'FL-M'), soloRow('L (지름 45cm)', '35,000', '8', 'FL-L')]),
            SoloGroup(2, '화병 추가', false, [soloRow('유리 화병', '12,000', '40', 'VS-GL'), soloRow('도자기 화병', '22,000', '15', 'VS-CR')]),
            Btn('옵션 추가', { icon: 'plus' }),
        ))),
    Canvas({ label: 'A-21 · 옵션·재고 묶음 아래 · 입력형 옵션 2개 · 다른 업종 예시(꽃: 배송 희망일 · 메시지 카드 문구)' }, Page('옵션·재고', { channel: '자사몰' },
        Box({ title: '입력형 옵션', sub: '고객이 주문할 때 직접 적는 칸 · 최대 5개', right: Toggle('사용', { on: true }) },
            Table({ dense: true, cols: inputCols, rows: [
                [Icon('drag-vertical'), Input({ value: '배송 희망일', w: 126 }), Select({ value: '날짜', w: 92 }), Check('', { on: true }), `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center">${Text('오늘부터', { sm: true })}${Input({ value: '2', w: 64, suffix: '일' })}${Text('뒤 ~', { sm: true })}${Input({ value: '30', w: 70, suffix: '일' })}${Text('뒤까지 · 쉬는 요일', { sm: true })}${CheckGroup(['일', '월'], ['일'])}</div><small>안내 문구: 일요일·공휴일은 배송하지 않습니다.</small>`, Input({ value: '0', w: 78, suffix: '원' }), Icon('trash-o')],
                [Icon('drag-vertical'), Input({ value: '메시지 카드 문구', w: 126 }), Select({ value: '글자', w: 92 }), Check('', { on: false }), `<div style="display:flex;gap:6px;align-items:center">${Text('최대', { sm: true })}${Input({ value: '40', w: 70, suffix: '자' })}</div><small>안내 문구: 적지 않으면 카드 없이 보내 드립니다.</small>`, Input({ value: '0', w: 78, suffix: '원' }), Icon('trash-o')],
                [Icon('drag-vertical'), Input({ placeholder: '예) 각인 문구', w: 126, focus: true }), Select({ value: '글자', w: 92, open: true, options: [{ t: '글자', sub: '최대 글자 수', on: true }, { t: '날짜', sub: '고를 수 있는 기간' }, { t: '숫자', sub: '최소 ~ 최대' }, { t: '사진 올리기', sub: 'JPG · PNG 10MB' }] }), Check('', { on: false }), Text('입력 종류를 고르면 조건 칸이 나옵니다', { sm: true, mute: true }), Input({ value: '0', w: 78, suffix: '원' }), Icon('trash-o')],
            ] }),
            Btn('입력칸 추가 (3 / 5)', { size: 'sm', icon: 'plus' }),
            Grid('1fr 1fr',
                Box({ flat: true, title: '고객 화면에서 보이는 모습' }, FormTable([{ k: '배송 희망일', required: true, v: Input({ placeholder: '날짜를 골라 주세요', icon: 'calendar', w: 200 }), help: '일요일·공휴일은 배송하지 않습니다.' }, { k: '메시지 카드 문구', v: Input({ value: '엄마, 생신 축하드려요', w: 220 }), help: '11 / 40자' }])),
                Box({ flat: true, title: '주문 목록에서 보이는 모습' }, Text('시즌 꽃다발<br><small style="color:var(--mute)">꽃다발 크기 M · 화병 추가 유리 화병</small><br><small><b>배송 희망일</b> 2026-11-14(토) · <b>메시지 카드 문구</b> 엄마, 생신 축하드려요</small>', { sm: true })),
            ),
        ))),
);

const addCols = [{ t: '', w: 30 }, { t: '묶음 이름', w: 118 }, '추가구성상품 이름', { t: '가격', w: 120 }, { t: '재고', w: 100 }, { t: '판매상태', w: 110 }, { t: '', w: 40 }];

const state6 = StateBlock({ idx: 6, title: '추가구성상품', note: '본 상품과 함께 살 수 있는 딸린 상품. 본 상품 없이는 살 수 없고, 주문서에서 본 상품 아래 한 줄로 따로 잡힙니다.' },
    Anno({ title: '왜 이렇게 하나' }, '쇼핑백·선물 포장·파우치처럼 따로 상품으로 팔기는 애매하지만 함께 팔아야 하는 것들입니다. 옵션과 달리 본 상품과 수량을 다르게 살 수 있고(젤리스틱 2개 + 쇼핑백 1개), 재고도 따로 갑니다. 여러 상품이 같이 쓰는 것은 이미 등록한 상품에서 골라 오면 재고가 한 곳에서 줄어듭니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '추가구성상품 금액은 할인·쿠폰 대상에서 빠지고 적립도 되지 않는 것이 기본입니다. 무료배송 조건 금액에는 포함됩니다. 취소·반품은 본 상품과 따로 할 수 있지만, 본 상품을 전부 취소하면 추가구성상품도 함께 취소됩니다.'),
    Canvas({ label: 'A-21 · 추가구성상품 묶음 · 이너에라(쇼핑백 · 선물 포장)' }, Page('추가구성상품', {},
        Box({ title: '추가구성상품', sub: '최대 20개', right: Toggle('사용', { on: true }) },
            Table({ dense: true, cols: addCols, rows: [
                [Icon('drag-vertical'), Input({ value: '선물 포장', w: 100 }), Input({ value: '이너에라 쇼핑백 (소)', w: 160 }), Input({ value: '500', w: 96, suffix: '원' }), Input({ value: '400', w: 84, suffix: '개' }), SALE(), Icon('trash-o')],
                [Icon('drag-vertical'), Input({ value: '선물 포장', w: 100 }), Input({ value: '선물 포장 + 손글씨 카드', w: 160 }), Input({ value: '2,000', w: 96, suffix: '원' }), Input({ value: '150', w: 84, suffix: '개' }), SALE(), Icon('trash-o')],
                [Icon('drag-vertical'), Input({ value: '함께 구매', w: 100 }), `${Thumb(32)} <u>이너에라 스틱 보관 케이스</u><small>등록한 상품에서 가져옴 · 재고 함께 차감</small>`, Input({ value: '9,000', w: 96, suffix: '원' }), Text('86개', { sm: true, mute: true }), Badge('판매중', 'solid'), Icon('trash-o')],
            ] }),
            Flex({ gap: 8 }, Btn('직접 입력으로 추가', { size: 'sm', icon: 'plus' }), Btn('등록한 상품에서 고르기', { size: 'sm', icon: 'search' })),
            Note('묶음 이름이 같은 것끼리 고객 화면에서 한 선택 목록으로 묶입니다. 금액은 예시 값입니다.'),
        ))),
    Canvas({ label: 'A-21 · 등록한 상품에서 고르기 버튼 → 팝업 (다른 업종 예시 · 화장품: 본품에 파우치 추가)' }, Overlay({ bg: Page('추가구성상품', {}, Box({ title: '추가구성상품' }, Text('추가구성상품 3개'))), h: 620 },
        Modal({ title: '추가구성상품으로 넣을 상품 고르기', w: 680, foot: [Text('2개 선택', { sm: true }), Btn('취소'), Btn('2개 추가', 'primary')] },
            Flex({ gap: 8 }, Input({ value: '파우치', icon: 'search', w: 300, focus: true }), Select({ value: '카테고리 전체', w: 160 }), Check('판매중만', { on: true })),
            '<div style="height:10px"></div>',
            Table({ check: true, checked: [0, 1], dense: true, cols: [{ t: '', w: 44 }, '상품명 · 품목', { t: '판매가', w: 90, align: 'right' }, { t: '재고', w: 70, align: 'right' }, { t: '판매상태', w: 80 }], rows: [
                [Thumb(32), '여행용 미니 파우치<small>옵션 없음</small>', '6,000원', '210', Badge('판매중', 'solid')],
                [Thumb(32), '리넨 파우치<small>색상 베이지</small>', '8,000원', '64', Badge('판매중', 'solid')],
                [Thumb(32), '리넨 파우치<small>색상 차콜</small>', '8,000원', '12', Badge('판매중', 'solid')],
                { dim: true, nocheck: true, c: [Thumb(32), '방수 파우치<small>이미 추가한 상품</small>', '9,000원', '40', Badge('판매중', 'solid')] },
            ] }),
            Note('추가구성상품 가격은 가져온 뒤 따로 바꿀 수 있습니다(함께 살 때만 싸게). 재고는 원래 상품과 같이 줄어듭니다.'),
        ))),
    Canvas({ size: 'auto', label: '추가구성상품을 쓰지 않는 상품 — 사용 꺼짐(초기값)', right: '묶음만', pad: 20 }, `<div style="width:792px">${Box({ title: '추가구성상품', right: Toggle('사용', { on: false }) }, Text('쇼핑백·선물 포장·함께 사면 좋은 상품을 본 상품과 함께 팔 수 있습니다. 사용을 켜면 입력 표가 나옵니다.', { mute: true, sm: true }))}</div>`),
);

const ImgTile = (label, o = {}) => `<div style="width:112px;flex:none;position:relative">${Img({ ratio: '1/1', label })}<div style="display:flex;justify-content:space-between;font-size:12px;margin-top:4px;color:var(--ink2)"><span>${o.main ? '<b>대표</b>' : `${Icon('drag-vertical')}${o.n}`}</span><span>${Icon('zoom-in')} ${Icon('trash-o')}</span></div></div>`;
const MAIN_GUIDE = ImageGuide({ size: '1000 × 1000 px 이상 (권장 1500 × 1500 px)', ratio: '1:1 (정사각형)', max: '장당 10MB 이하', ext: 'JPG · PNG', more: ['흰색 또는 단색 배경, 글자·테두리·워터마크 없는 제품 사진 (스마트스토어 대표 이미지 기준과 같음)', '목록용 작은 이미지(600 × 600 px)는 자동으로 만들어집니다'] });

const state7 = StateBlock({ idx: 7, title: '이미지(규격 안내)', note: '대표 이미지 1장(필수)과 추가 이미지. 규격 안내를 올리는 자리 바로 옆에 항상 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '운영자가 규격을 물어보러 오지 않게 크기·비율·용량·확장자를 화면에 적어 둡니다. 대표 이미지는 자사몰 목록·장바구니·주문 내역·알림톡·스마트스토어 대표 이미지에 모두 쓰이므로 가장 엄격한 스마트스토어 기준에 맞춥니다. 크기가 다른 사진을 올려도 목록용·썸네일용은 자동으로 줄여 만듭니다.'),
    Anno({ warn: true, title: '자산 규격' }, '대표 이미지: 1000 × 1000 px 이상 · 1:1 · JPG·PNG · 10MB 이하 · 1장. 추가 이미지: 같은 규격 · 최대 9장 · 끌어서 순서 바꾸기. 1:1이 아닌 사진은 올린 뒤 자르기 창이 뜹니다. 규격에 안 맞는 파일은 저장하지 않고 이유를 파일 옆에 적습니다.'),
    Canvas({ label: 'A-21 · 이미지 묶음 · 대표 1장 + 추가 4장 올린 상태' }, Page('이미지', {},
        Box({ title: '이미지' },
            FormTable([
                { k: '대표 이미지', required: true, v: Grid('160px minmax(0,1fr)', `<div>${Img({ ratio: '1/1', label: '석류맛 젤리스틱 상자 정면 · 1500 × 1500' })}<div style="display:flex;gap:6px;margin-top:6px">${Btn('바꾸기', { size: 'sm' })}${Btn('자르기', { size: 'sm', icon: 'crop' })}</div></div>`, `<ul style="margin:0;padding:10px 12px 10px 28px;background:#fcfcfd;border:1px solid var(--line2);border-radius:4px;font-size:12px;color:var(--ink2)">${MAIN_GUIDE.map((g) => `<li>${g}</li>`).join('')}</ul>`) },
                { k: '추가 이미지', v: `<div style="display:flex;gap:10px;flex-wrap:wrap;width:100%">${ImgTile('상자 + 스틱 14포 펼친 모습', { n: 1 })}${ImgTile('스틱 한 포 손에 든 모습', { n: 2 })}${ImgTile('젤리 제형 확대', { n: 3 })}${ImgTile('영양·기능 정보 면', { n: 4 })}<div style="width:112px;height:112px;border:1.5px dashed #a8a8b0;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;color:var(--ink2);background:var(--box)">${Icon('plus')}추가 (4 / 9)</div></div>`, help: '최대 9장 · 대표 이미지와 같은 규격 · 끌어서 순서를 바꾸면 상세 화면 사진 넘기는 순서가 바뀝니다 · 여러 장을 한 번에 끌어다 놓을 수 있습니다.' },
                { k: '목록에서 마우스 올릴 때', v: [RadioGroup(['대표 이미지 그대로', '추가 이미지 1번 보여 주기'], '추가 이미지 1번 보여 주기')] },
                { k: '동영상', v: Input({ placeholder: '유튜브 주소 붙여 넣기 (선택)', icon: 'youtube', w: 420 }), help: '넣으면 상세 화면 사진 맨 뒤에 영상이 붙습니다. 파일을 직접 올리지는 않습니다.' },
            ]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '새 상품 — 아직 올리지 않음', right: '올리는 자리만', pad: 20 }, `<div style="width:520px">${Upload({ title: '대표 이미지를 끌어다 놓거나 눌러서 고르기', guide: MAIN_GUIDE })}</div>`),
        Canvas({ size: 'auto', label: '규격에 안 맞는 파일을 올림 → 파일별 사유', right: '올리는 자리만', pad: 20 }, `<div style="width:560px">${Upload({ title: '추가 이미지를 끌어다 놓거나 눌러서 고르기', button: '파일 고르기', files: [
            { name: 'detail_03.jpg', size: '2.1MB · 1500 × 1500', icon: 'image-o' },
            { name: 'banner_wide.png', size: '3.4MB · 1920 × 720', icon: 'image-o', error: '1:1 비율이 아닙니다 — 자르기' },
            { name: 'IMG_2231.HEIC', size: '4.8MB', icon: 'image-o', error: 'JPG·PNG만 올릴 수 있습니다' },
            { name: 'studio_raw.png', size: '18.2MB', icon: 'image-o', error: '10MB를 넘습니다 (18.2MB)' },
            { name: 'thumb_small.jpg', size: '84KB · 480 × 480', icon: 'image-o', error: '1000 × 1000 px보다 작습니다' },
        ] })}</div>`),
    ),
    Canvas({ size: 'auto', label: '1:1이 아닌 사진의 자르기를 누름 → 자르기 팝업', right: '팝업만', pad: 20 },
        Modal({ title: '이미지 자르기 · banner_wide.png', w: 560, foot: [Btn('취소'), Btn('이대로 자르기', 'primary')] },
            `<div style="position:relative;height:200px;background:var(--fill);border-radius:4px;display:flex;align-items:center;justify-content:center"><div style="width:200px;height:200px;border:2px dashed var(--dark);background:rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;font-size:12px">1:1 자를 영역 · 끌어서 옮기기</div></div>`,
            Flex({ gap: 8, align: 'center', mt: 12 }, Icon('zoom-in'), Text('확대 100%', { sm: true }), `<span style="flex:1;height:4px;background:var(--line);border-radius:2px;position:relative"><span style="position:absolute;left:20%;top:-5px;width:14px;height:14px;border-radius:50%;background:var(--dark)"></span></span>`),
            Note('잘라낸 결과가 720 × 720 px이라 1000 × 1000 px보다 작습니다. 더 큰 원본을 올려 주세요.', { warn: true }),
        )),
);

const EDIT_ICONS = ['text-size', 'bold', 'italic', 'underline', 'text-color', 'align-left', 'align-center', 'align-right', 'list-dot', 'list-number', 'link', 'image-o', 'youtube', 'code'];
const Editor = (tab, body, o = {}) => `<div style="border:1px solid #b4b4bb;border-radius:4px;background:#fff;width:100%">
<div style="display:flex;align-items:center;gap:0;border-bottom:1px solid var(--line2);background:var(--box);padding:0 8px">${['글쓰기', 'HTML 직접 입력', 'PC 미리보기', '모바일 미리보기'].map((t) => `<span style="padding:9px 12px;font-size:12.5px;${t === tab ? 'font-weight:800;border-bottom:3px solid var(--dark)' : 'color:var(--mute)'}">${t}</span>`).join('')}<span style="flex:1"></span><span style="font-size:12px;color:var(--mute)">${o.right || '자동 임시 저장 11-11 10:21'}</span></div>
${tab === '글쓰기' ? `<div style="display:flex;align-items:center;gap:14px;padding:8px 12px;border-bottom:1px solid var(--line2);font-size:17px;color:var(--ink2)">${EDIT_ICONS.map((i) => Icon(i)).join('')}<span style="flex:1"></span>${Btn('이미지 여러 장 올리기', { size: 'sm', icon: 'upload' })}</div>` : ''}
<div style="padding:16px;min-height:${o.h || 320}px">${body}</div></div>`;

const state8 = StateBlock({ idx: 8, title: '상세설명 에디터', note: '상세 화면 본문. 국내 상세페이지는 대부분 긴 이미지를 이어 붙이므로 이미지 여러 장 올리기가 중심입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '디자이너가 만든 상세페이지 이미지를 여러 장으로 잘라 한 번에 올리고 순서만 맞추면 끝나는 것이 실무입니다. 글자·표를 직접 쓰는 경우를 위해 기본 편집 도구도 둡니다. PC·모바일 미리보기 탭으로 저장 전에 실제 폭에서 확인합니다.'),
    Anno({ warn: true, title: '자산 규격' }, '본문 이미지: 가로 860 px 권장(최대 1000 px, 더 크면 1000 px로 줄여 저장) · 세로 제한 없음(긴 이미지는 3000 px 안팎으로 잘라 올리기 권장) · 장당 10MB · JPG·PNG·GIF · 최대 50장. 모바일에서는 화면 폭에 맞춰 줄어듭니다. 스마트스토어에는 같은 본문이 전송되며 외부 영상·스크립트는 빠집니다.'),
    Canvas({ label: 'A-21 · 상세설명 묶음 · 글쓰기 탭 · 이미지 3장 + 글' }, Page('상세설명', {},
        Box({ title: '상세설명', sub: '필수' },
            Editor('글쓰기', [
                Img({ h: 150, label: '상세 이미지 1 · 첫 화면(석류 원물 + 제품) · 860 × 1200' }),
                '<div style="height:8px"></div>',
                Img({ h: 110, label: '상세 이미지 2 · 원료 배합 설명 · 860 × 2400' }),
                '<p style="font-size:13.5px;margin:12px 0">하루 한 포, 물 없이 간편하게 드세요. 개봉 후에는 바로 섭취해 주세요.</p>',
                Img({ h: 90, label: '상세 이미지 3 · 섭취 방법과 주의 사항 · 860 × 1600' }),
            ].join('')),
            Note('이미지 가로 860 px 권장(최대 1000 px) · 장당 10MB · JPG·PNG·GIF · 최대 50장 (지금 3장). 이미지를 누르면 대체 문구 입력·순서 이동·삭제 단추가 나옵니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '이미지 여러 장 올리기 버튼 → 팝업 (순서 바꾸기 · 규격 오류)', right: '팝업만', pad: 20 },
            Modal({ title: '상세 이미지 여러 장 올리기', w: 560, foot: [Btn('취소'), Btn('3장 본문에 넣기', 'primary')] },
                Upload({ title: '이미지를 끌어다 놓거나 눌러서 고르기', guide: ['가로 860 px 권장 (최대 1000 px, 넘으면 1000 px로 줄여 저장)', '장당 10MB 이하 · JPG · PNG · GIF', '파일 이름 순서대로 들어갑니다 (detail_01, detail_02 …) · 아래에서 끌어서 순서 변경'] }),
                [['detail_01.jpg', '860 × 1200 · 1.4MB', ''], ['detail_02.jpg', '860 × 2400 · 3.2MB', ''], ['detail_03.jpg', '1600 × 2800 · 6.1MB', '1000 px로 줄여 저장됩니다'], ['detail_04.psd', '42MB', '올릴 수 없는 형식입니다 (JPG·PNG·GIF)']].map(([n, s, e]) => `<div class="wf-dragrow"${e.startsWith('올릴') ? ' style="background:var(--warnbg)"' : ''}>${Icon('drag-vertical')}<div class="dc"><b style="font-size:13px">${n}</b> <span style="font-size:12px;color:var(--mute)">${s}</span>${e ? `<br><span style="font-size:12px;font-weight:700">${Icon(e.startsWith('올릴') ? 'error-o' : 'info-o')} ${e}</span>` : ''}</div>${Icon('trash-o')}</div>`).join(''),
            )),
        Canvas({ size: 'auto', label: '모바일 미리보기 탭', right: '에디터만', pad: 20 }, `<div style="width:430px">${Editor('모바일 미리보기', `<div style="width:390px;margin:0 auto;border:1px solid var(--line);padding:0">${Img({ h: 180, label: '상세 이미지 1 · 화면 폭 390에 맞춰 줄어듦' })}${Img({ h: 140, label: '상세 이미지 2' })}<p style="font-size:14px;padding:12px">하루 한 포, 물 없이 간편하게 드세요.</p></div>`, { h: 360, right: '폭 390' })}</div>`),
    ),
    Canvas({ size: 'auto', label: 'HTML 직접 입력 탭 — 다른 곳에서 만든 상세페이지 소스를 붙여 넣을 때', right: '에디터만', pad: 20 }, `<div style="width:792px">${Editor('HTML 직접 입력', `<pre style="margin:0;font-size:12px;line-height:1.6;color:var(--ink2);white-space:pre-wrap">&lt;img src="/files/detail_01.jpg" alt="석류 원물과 젤리스틱"&gt;
&lt;img src="/files/detail_02.jpg" alt="원료 배합"&gt;
&lt;p&gt;하루 한 포, 물 없이 간편하게 드세요.&lt;/p&gt;</pre>`, { h: 120, right: '스크립트 · 외부 틀(iframe)은 저장할 때 지워집니다' })}</div>`),
);

const NOTICE_GROUPS = [{ t: '식품(가공식품)', on: true }, '식품(농수축산물)', '건강기능식품', '화장품', '의류', '구두/신발', '가방', '패션잡화(모자/벨트/액세서리)', '주방용품', '기타 재화'];
const FOOD = [
    ['제품명', '이너에라 롱지비티 석류맛 젤리스틱'],
    ['식품의 유형', '캔디류(젤리)'],
    ['생산자 및 소재지', '제조원은 포장 표기 참조 · 판매원 이너에라, 인천광역시 제물포구'],
    ['제조연월일, 소비기한', '제조일로부터 18개월 · 주문 시점에 소비기한 6개월 이상 남은 제품 출고'],
    ['포장단위별 내용물의 용량(중량), 수량', '20 g × 14포 (280 g)'],
    ['원재료명 및 함량', '상세설명 참조'],
    ['영양성분', '상세설명 참조'],
    ['유전자변형식품 여부', '해당 없음'],
    ['소비자안전을 위한 주의사항', '알레르기 체질이신 분은 원재료를 확인 후 섭취하세요. 개봉 후 바로 섭취하세요.'],
    ['수입식품 문구', '해당 없음(국내 제조)'],
    ['소비자상담 관련 전화번호', '이너에라 고객센터 070-****-1234'],
];
const CLOTHES = [['제품 소재', ''], ['색상', ''], ['치수', ''], ['제조자(수입자)', ''], ['제조국', ''], ['세탁방법 및 취급 시 주의사항', ''], ['제조연월', ''], ['품질보증기준', ''], ['A/S 책임자와 전화번호', '']];
const noticeRows = (list, o = {}) => list.map(([k, v], i) => ({ k, required: true, v: [Input({ value: v, placeholder: '내용 입력', w: 400, error: o.err && !v && i < 2 }), Check('상세설명 참조', { on: v === '상세설명 참조' })], error: o.err && !v && i < 2 ? `${k}을(를) 적거나 상세설명 참조를 체크해 주세요.` : undefined }));

const state9 = StateBlock({ idx: 9, title: '상품정보제공고시(품목군 선택 → 항목 자동)', note: '전자상거래법에 따라 상세 화면 아래에 반드시 표시해야 하는 정보. 품목군을 고르면 그 품목군의 항목이 자동으로 깔립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '공정위 고시 품목군마다 적어야 할 항목이 다릅니다(가공식품 11개, 의류 9개 등). 운영자가 항목을 외울 필요 없이 품목군만 고르면 칸이 나오고, 스마트스토어로 보낼 때도 같은 값이 그대로 전송됩니다. 상품이 여러 개면 한 번 채운 내용을 불러와 고쳐 쓰는 것이 실무라 저장해 둔 내용 불러오기를 둡니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '모든 항목이 필수입니다. 상세 이미지에 이미 적혀 있으면 상세설명 참조를 체크합니다(한 번에 전체 체크 가능). 품목군을 바꾸면 적어 둔 내용이 사라지므로 확인 팝업을 띄웁니다. 품목군 목록은 고시가 개정되면 솔루션 쪽에서 갱신합니다 — 운영자가 항목을 더하거나 뺄 수 없습니다.'),
    Canvas({ label: 'A-21 · 상품정보제공고시 묶음 · 이너에라 — 식품(가공식품) 항목 채운 예' }, Page('상품정보제공고시', {},
        Box({ title: '상품정보제공고시', sub: '필수', right: [Btn('저장해 둔 내용 불러오기', { size: 'sm', icon: 'folder-o' }), Btn('이 내용 저장해 두기', { size: 'sm', icon: 'save' })] },
            FormTable([
                { k: '품목군', required: true, v: [Select({ value: '식품(가공식품)', w: 300 }), Btn('모든 항목 상세설명 참조로 채우기', { size: 'sm' })], help: '고르면 아래 항목이 자동으로 바뀝니다.' },
                ...noticeRows(FOOD),
            ]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '품목군 칸을 누름 → 검색형 목록', right: '입력칸만', pad: 20 }, `<div style="width:340px;min-height:420px">${Select({ value: '식품(가공식품)', w: 300, open: true, search: '', options: NOTICE_GROUPS })}<p style="font-size:12px;color:var(--mute);margin:8px 0 0">공정위 고시 품목군 전체가 들어 있습니다. 이름 일부로 찾습니다(예: 식품).</p></div>`),
        Canvas({ size: 'auto', label: '다른 업종 예시 · 의류를 고름 → 항목 9개로 바뀜(빈칸) · 저장 누름 → 빈 항목 오류', right: '묶음만', pad: 20 }, `<div style="width:760px">${FormTable([{ k: '품목군', required: true, v: Select({ value: '의류', w: 300 }) }, ...noticeRows(CLOTHES.slice(0, 5), { err: true })])}<p style="font-size:12px;color:var(--mute);margin:8px 0 0">아래로 제조국 · 세탁방법 및 취급 시 주의사항 · 제조연월 · 품질보증기준 · A/S 책임자와 전화번호 칸이 이어집니다.</p></div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '내용을 채운 상태에서 품목군을 바꿈 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '품목군을 의류로 바꿀까요?', desc: '식품(가공식품) 항목 11개에 적은 내용이 지워지고 의류 항목 9개가 빈칸으로 나옵니다.<br>지금 내용을 남기려면 먼저 이 내용 저장해 두기를 눌러 주세요.', ok: '바꾸기', danger: true })),
        Canvas({ size: 'auto', label: '저장해 둔 내용 불러오기 → 팝업', right: '팝업만', pad: 20 }, Modal({ title: '저장해 둔 고시 내용 불러오기', w: 480, foot: [Btn('취소'), Btn('불러오기', 'primary')] },
            Table({ dense: true, cols: [{ t: '', w: 30 }, '이름', { t: '품목군', w: 130 }, { t: '저장일', w: 90 }], rows: [
                { on: true, c: [Radio('', { on: true }), '젤리스틱 공통', '식품(가공식품)', '10-28'], },
                [Radio(''), '선물 세트 공통', '식품(가공식품)', '11-02'],
            ] }),
            Note('불러오면 지금 적은 내용 위에 덮어씁니다.'),
        )),
    ),
);

const SHIP_TPL = [{ t: '기본 배송 · 3,000원 (30,000원 이상 무료)', sub: '기본', on: true }, { t: '무료 배송', sub: '무료' }, { t: '냉장 배송 · 4,000원 고정', sub: '고정' }, { t: '수량별 · 3개마다 3,000원', sub: '수량별' }];

const shipRows = (open) => [
    { k: '배송비 템플릿', required: true, v: [open ? Select({ value: '기본 배송 · 3,000원 (30,000원 이상 무료)', w: 380, open: true, search: '', options: SHIP_TPL.concat([{ t: `${Icon('plus-min')} 새 배송비 템플릿 만들기`, sub: '설정 > 배송으로 이동' }]) }) : Select({ value: '기본 배송 · 3,000원 (30,000원 이상 무료)', w: 380 }), open ? '' : Btn('템플릿 내용 보기', { size: 'sm', icon: 'external-link' })], help: '배송비 규칙은 설정 > 배송에서 한 번 만들고 상품에는 연결만 합니다. 템플릿을 고치면 연결된 상품 전체에 반영됩니다.' },
    { k: '이 템플릿의 내용', v: `<div style="border:1px solid var(--line2);background:var(--box);border-radius:4px;padding:12px;width:100%">${KV([['배송비', '3,000원 · 주문 금액 30,000원 이상 무료 (조건부 무료)'], ['제주 · 도서산간', '제주 +3,000원 · 도서산간 +5,000원'], ['반품 배송비', '편도 3,000원 (처음 무료배송이었으면 왕복 6,000원)'], ['교환 배송비', '왕복 6,000원'], ['연결된 상품', '1개']], { wide: true })}</div>` },
    { k: '묶음배송', v: RadioGroup(['가능 (같은 템플릿끼리 배송비 한 번)', '불가 (이 상품은 따로 부과)'], '가능 (같은 템플릿끼리 배송비 한 번)'), help: '부피가 크거나 따로 출고되는 상품은 불가로. 불가이면 발주 확인 화면의 합포장 묶음에도 들어가지 않습니다.' },
    { k: '출고지', required: true, v: Select({ value: '이너에라 본사 · 인천광역시 제물포구 방축로83번길 23', w: 420 }) },
    { k: '반품·교환지', required: true, v: [Select({ value: '출고지와 같음', w: 420 })] },
    { k: '배송 방법', v: [RadioGroup(['택배', '직접 배송(꽃·가구 등)', '방문 수령'], '택배'), Select({ value: 'CJ대한통운 (기본 택배사)', w: 220 })] },
    { k: '출고 소요일', v: [Text('결제 완료 후', { sm: true }), Input({ value: '2', w: 70, suffix: '일' }), Text('이내 출고 (영업일 기준) · 오늘 주문 마감', { sm: true }), Input({ value: '14:00', icon: 'clock-o', w: 110 })], help: '상세 화면 배송 안내와 발주 확인 화면의 발송 기한 계산에 쓰입니다. 비우면 설정 > 주문·클레임 정책의 기본값을 따릅니다.' },
];

const state10 = StateBlock({ idx: 10, title: '배송(배송비 템플릿)', note: '배송비 규칙을 상품마다 다시 적지 않고, 설정에서 만들어 둔 배송비 템플릿을 골라 연결합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '배송비를 상품마다 적으면 정책이 바뀔 때 상품 수만큼 고쳐야 하고 하나씩 어긋납니다. 템플릿 한 곳만 고치면 연결된 상품이 다 바뀝니다. 고른 템플릿의 내용(조건·제주 추가·반품 배송비)을 바로 아래에 풀어 보여 줘 다른 화면에 가서 확인하지 않게 합니다.'),
    Anno({ warn: true, title: '초기값 · 유형별 입력칸' }, '초기값: 기본으로 지정된 템플릿 · 묶음배송 가능 · 기본 출고지 · 택배. 배송 방법이 직접 배송이면 택배사 칸 대신 배송 가능 지역 안내 칸이, 방문 수령이면 수령 장소·시간 칸이 나옵니다(입력형 옵션의 배송 희망일과 함께 꽃·케이크 업종에서 씀).'),
    Canvas({ label: 'A-21 · 배송 묶음 · 이너에라' }, Page('배송', {}, Box({ title: '배송' }, FormTable(shipRows(false))))),
    CanvasRow(
        Canvas({ size: 'auto', label: '배송비 템플릿 칸을 누름 → 검색형 목록', right: '입력칸만', pad: 20 }, `<div style="width:760px;min-height:290px">${FormTable(shipRows(true).slice(0, 1))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '다른 업종 예시 · 배송 방법 = 직접 배송(꽃)', right: '줄만', pad: 20 }, `<div style="width:700px">${FormTable([{ k: '배송 방법', v: RadioGroup(['택배', '직접 배송(꽃·가구 등)', '방문 수령'], '직접 배송(꽃·가구 등)') }, { k: '배송 가능 지역', required: true, v: Textarea({ value: '서울 전 지역, 경기 성남·하남·과천 (그 밖의 지역은 주문 전 문의)', h: 56 }), help: '상세 화면 배송 안내에 그대로 나옵니다. 송장번호 없이 발송처리할 수 있습니다.' }])}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '다른 업종 예시 · 배송 방법 = 방문 수령', right: '줄만', pad: 20 }, `<div style="width:700px">${FormTable([{ k: '배송 방법', v: RadioGroup(['택배', '직접 배송(꽃·가구 등)', '방문 수령'], '방문 수령') }, { k: '수령 장소 · 시간', required: true, v: [Input({ value: '서울 마포구 월드컵북로 *** 1층 매장', w: 320 }), Input({ value: '평일 11:00 ~ 19:00', w: 180 })], help: '방문 수령 주문은 배송비가 0원이고, 발송처리 대신 수령 완료 처리로 끝납니다.' }])}</div>`),
    ),
);

const state11 = StateBlock({ idx: 11, title: '검색 노출', note: '네이버·구글 검색 결과와 카카오톡·SNS 공유 카드에 나오는 문구와 이미지. 비워 두면 상품명·한 줄 소개·대표 이미지로 자동으로 채워집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '운영자 대부분은 이 칸을 건드리지 않으므로 비워도 문제없게 자동으로 채우고, 고치고 싶은 사람만 고칩니다. 넣은 값이 실제로 어떻게 보이는지 검색 결과 모습과 공유 카드 모습을 옆에 바로 보여 줍니다.'),
    Anno({ warn: true, title: '자산 규격 · 초기값' }, '공유 이미지: 1200 × 630 px · 약 1.91:1 · JPG·PNG · 5MB 이하 · 비우면 대표 이미지를 가운데 기준으로 잘라 씀. 검색 제목 60자 · 설명 160자까지. 주소 끝부분은 영문 소문자·숫자·붙임표만, 저장 뒤 바꾸면 예전 주소는 새 주소로 자동 연결됩니다.'),
    Canvas({ label: 'A-21 · 검색 노출 묶음 · 이너에라' }, Page('검색 노출', {},
        Box({ title: '검색 노출' },
            Grid('minmax(0,1fr) 230px',
                FormTable([
                    { k: '검색 제목', v: Input({ value: '롱지비티 석류맛 젤리스틱 14포 | 이너에라 공식몰', w: 320 }), help: '33 / 60자 · 비우면 상품명 + 쇼핑몰 이름' },
                    { k: '검색 설명', v: Textarea({ value: '하루 한 포로 챙기는 석류맛 젤리스틱. 1박스 14일분부터 4박스 56일분까지, 이너에라 공식몰에서 만나 보세요.', h: 72, count: '62 / 160' }), help: '비우면 한 줄 소개가 들어갑니다.' },
                    { k: '검색어', v: TagBox(['석류젤리', '젤리스틱', '이너뷰티', '석류스틱'], '적고 Enter', 320), help: '자사몰 검색에서 상품명에 없는 말로도 찾게 합니다. 최대 10개 · 스마트스토어 태그로도 전송됩니다.' },
                    { k: '주소 끝부분', v: [Text('/products/', { sm: true, mute: true }), Input({ value: 'longevity-pomegranate-jelly', w: 230 })], help: '비우면 상품번호(1001)가 주소가 됩니다.' },
                    { k: '공유 이미지', v: Upload({ title: '공유 이미지 올리기 (비우면 대표 이미지 사용)', guide: ImageGuide({ size: '1200 × 630 px', ratio: '약 1.91:1 (가로로 긴 직사각형)', max: '5MB 이하', ext: 'JPG · PNG' }), files: [{ name: 'share_pomegranate.jpg', size: '412KB', icon: 'image-o' }] }) },
                    { k: '검색 로봇', v: Check('검색 사이트에 이 상품을 노출하지 않기', { on: false }), help: '테스트 상품이나 특정 고객 전용 상품에 씁니다.' },
                ]),
                `<div>${Box({ flat: true, title: '검색 결과 모습' }, `<div style="font-size:12px;color:var(--mute)">innerera.example › products › longevity-pomegranate-jelly</div><div style="font-size:15px;font-weight:700;text-decoration:underline;margin:2px 0">롱지비티 석류맛 젤리스틱 14포 | 이너에라 공식몰</div><div style="font-size:12.5px;color:var(--ink2)">하루 한 포로 챙기는 석류맛 젤리스틱. 1박스 14일분부터 4박스 56일분까지, 이너에라 공식몰에서 …</div>`)}${Box({ flat: true, title: '카카오톡 공유 모습' }, `<div style="border:1px solid var(--line);border-radius:8px;overflow:hidden;background:#fff">${Img({ ratio: '1.91/1', label: '공유 이미지 1200 × 630' })}<div style="padding:10px"><b style="font-size:13px">롱지비티 석류맛 젤리스틱 14포 | 이너에라 공식몰</b><div style="font-size:12px;color:var(--mute)">innerera.example</div></div></div>`)}</div>`,
            ),
        ))),
    Canvas({ size: 'auto', label: '새 상품 — 아무것도 넣지 않은 초기 상태(자동으로 채워질 값을 흐리게 보여 줌) · 주소 끝부분 오류', right: '묶음만', pad: 20 }, `<div style="width:760px">${FormTable([
        { k: '검색 제목', v: Input({ placeholder: '이너에라 롱지비티 석류맛 젤리스틱 20 g × 14포 | 이너에라', w: 480 }), help: '0 / 60자 · 비워 두면 흐리게 보이는 값으로 나갑니다.' },
        { k: '검색 설명', v: Input({ placeholder: '하루 한 포, 석류 한 알의 리추얼', w: 480 }) },
        { k: '주소 끝부분', v: [Text('/products/', { sm: true, mute: true }), Input({ value: '석류 젤리', w: 250, error: true })], error: '영문 소문자·숫자·붙임표(-)만 쓸 수 있습니다. 예) pomegranate-jelly' },
        { k: '공유 이미지', v: Text('대표 이미지를 가운데 기준 1200 × 630으로 잘라 씁니다.', { sm: true, mute: true }) },
    ])}</div>`),
);

const SS_CATS = [{ t: '식품 > 건강식품 > 영양제 > 기타건강보조식품', on: true }, '식품 > 과자/베이커리 > 젤리', '식품 > 건강식품 > 건강분말 > 석류분말', '화장품/미용 > 이너뷰티'];

const ssRows = (o = {}) => [
    { k: '스마트스토어에 팔기', v: Toggle(o.on === false ? '끔' : '켬 — 저장할 때 스마트스토어로 함께 전송', { on: o.on !== false }) },
    { k: '스마트스토어 카테고리', required: true, v: o.catOpen
        ? Select({ value: '', placeholder: '스마트스토어 카테고리 이름으로 찾기', w: 440, open: true, search: '젤리', options: SS_CATS })
        : o.noCat ? Select({ placeholder: '스마트스토어 카테고리 이름으로 찾기', w: 440, error: true }) : Select({ value: '식품 > 건강식품 > 영양제 > 기타건강보조식품', w: 440 }),
    help: '우리 몰 카테고리와 따로입니다. 네이버 카테고리에 따라 상품정보제공고시 품목군과 필수 항목이 정해집니다. 등록 뒤에는 큰 분류를 바꿀 수 없습니다(네이버 정책).', error: o.noCat ? '스마트스토어 카테고리를 골라야 전송할 수 있습니다.' : undefined },
    { k: '스마트스토어 상품명', v: [RadioGroup(['우리 몰 상품명과 같게', '따로 적기'], '우리 몰 상품명과 같게')], help: '50자를 넘으면 뒤가 잘립니다. 지금 27자.' },
    { k: '스마트스토어 판매가', v: [RadioGroup(['우리 몰과 같게', '따로 적기'], '따로 적기'), Input({ value: '51,000', w: 130, suffix: '원' })], help: '수수료를 반영해 다르게 팔 수 있습니다. 옵션 추가금은 우리 몰과 같이 갑니다. 금액은 예시 값입니다.' },
    { k: '재고 맞추기', v: RadioGroup(['우리 몰 재고와 함께 쓰기 (어느 쪽에서 팔려도 같이 줄어듦)', '스마트스토어 몫을 따로 두기'], '우리 몰 재고와 함께 쓰기 (어느 쪽에서 팔려도 같이 줄어듦)'), help: '함께 쓰기가 기본입니다. 따로 두기를 고르면 품목별 스마트스토어 몫 재고 칸이 나옵니다.' },
    { k: '함께 전송되는 것', v: Text('상품명 · 판매가 · 옵션(구성 3개)과 재고 · 대표 이미지와 추가 이미지 · 상세설명 · 상품정보제공고시 · 배송비 · 반품·교환지 · 검색어(태그)', { sm: true }) },
];

const SsStatus = (kind) => {
    const rows = {
        ok: [['전송 상태', `${Badge('연동됨', 'check')} 우리 몰과 스마트스토어 내용이 같습니다`], ['스마트스토어 상품번호', '<u>10482716635</u> (스마트스토어에서 보기)'], ['마지막 전송', '2026-11-10 17:42 · 가격·재고 · 성공'], ['처음 등록', '2026-10-29 11:05']],
        wait: [['전송 상태', `${Badge('전송 대기', 'dash')} 저장하면 처음으로 등록됩니다`], ['스마트스토어 상품번호', '아직 없음']],
        fail: [['전송 상태', `${Badge('전송 오류', 'warn')} 스마트스토어에는 예전 내용이 그대로 있습니다`], ['오류 사유', '<b>대표 이미지 크기가 스마트스토어 기준보다 작습니다 (지금 800 × 800, 1000 × 1000 이상 필요).</b> 이미지 묶음에서 대표 이미지를 바꾼 뒤 다시 보내 주세요.'], ['마지막 시도', '2026-11-11 09:12 · 실패 (3번째)'], ['마지막 성공', '2026-11-08 15:30']],
    }[kind];
    return Box({ flat: true, title: '전송 상태', right: kind === 'wait' ? '' : [Btn('전송 기록', { size: 'sm' }), Btn('지금 다시 보내기', { size: 'sm', icon: 'refresh', kind: kind === 'fail' ? 'primary' : 'line' })] }, KV(rows, { wide: true }));
};

const state12 = StateBlock({ idx: 12, title: '스마트스토어 연동 켬', note: '기본정보의 판매 채널에서 스마트스토어를 체크하면 이 묶음이 열립니다. 스마트스토어 카테고리를 맞추고 저장하면 함께 전송됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품을 두 곳에 따로 등록하면 가격·재고가 어긋나 품절 상품이 팔리는 사고가 납니다. 우리 관리자에서 한 번 저장하면 스마트스토어까지 가고, 지금 두 곳 내용이 같은지(연동됨·전송 대기·전송 오류)를 이 자리에서 바로 보여 줍니다. 오류는 네이버가 돌려준 말을 운영자가 고칠 수 있는 말로 바꿔 어느 묶음을 고치면 되는지까지 적습니다.'),
    Anno({ warn: true, title: '기능을 껐을 때 · 연결 전' }, '설정에서 스마트스토어 기능을 끈 몰은 이 묶음이 없습니다. 기능은 켰지만 아직 연결(판매채널 > 스마트스토어 연동)을 안 했으면 입력칸 대신 연결하러 가기 안내만 나옵니다. 연동을 끄면 스마트스토어 상품은 지워지지 않고 판매중지로 바뀝니다.'),
    Canvas({ label: 'A-21 · 스마트스토어 묶음 · 연동 켬 · 연동됨' }, Page('스마트스토어', {}, Box({ title: '스마트스토어', sub: '연결된 스토어 · 이너에라 공식스토어' }, FormTable(ssRows()), '<div style="height:14px"></div>', SsStatus('ok')))),
    CanvasRow(
        Canvas({ size: 'auto', label: '새 상품에서 켬 → 카테고리 칸을 눌러 찾는 중 · 전송 대기', right: '묶음만', pad: 20 }, `<div style="width:760px;min-height:330px">${FormTable(ssRows({ catOpen: true }).slice(0, 2))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '전송 대기 (아직 한 번도 안 보냄)', right: '상태만', pad: 20 }, `<div style="width:560px">${SsStatus('wait')}</div>`),
        Canvas({ size: 'auto', label: '전송 오류 — 사유와 고칠 곳', right: '상태만', pad: 20 }, `<div style="width:640px">${SsStatus('fail')}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '기능은 켰지만 스마트스토어를 아직 연결하지 않은 몰', right: '묶음만', pad: 20 }, `<div style="width:560px">${Box({ title: '스마트스토어' }, Text(`${Icon('plug')} 스마트스토어가 아직 연결되지 않았습니다.`, { b: true }), Text('연결하면 이 상품을 스마트스토어에도 등록하고 가격·재고를 함께 맞출 수 있습니다.', { sm: true, mute: true }), Btn('스마트스토어 연결하러 가기', { kind: 'primary', iconRight: 'angle-right-min' }))}</div>`),
        Canvas({ size: 'auto', label: '연동됨 상태에서 끔 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '이 상품의 스마트스토어 판매를 끌까요?', desc: '스마트스토어 상품(10482716635)은 지워지지 않고 판매중지로 바뀝니다.<br>이미 들어온 스마트스토어 주문 4건은 그대로 처리할 수 있습니다.<br>다시 켜면 같은 상품으로 판매가 이어집니다.', ok: '스마트스토어 판매 끄기' })),
    ),
);

const errSummary = `<div style="border:2px solid var(--dark);background:var(--warnbg);border-radius:4px;padding:12px 14px;margin-bottom:14px;font-size:13.5px"><b>${Icon('error-o')} 저장하지 못했습니다. 아래 3곳을 고쳐 주세요.</b><ul style="margin:6px 0 0;padding-left:20px;line-height:1.8"><li><u>기본정보 · 카테고리</u> — 카테고리를 1개 이상 골라 주세요.</li><li><u>이미지 · 대표 이미지</u> — 대표 이미지를 올려 주세요.</li><li><u>상품정보제공고시 · 원재료명 및 함량</u> — 내용을 적거나 상세설명 참조를 체크해 주세요.</li></ul></div>`;

const state13 = StateBlock({ idx: 13, title: '저장 오류', note: '필수 항목이 비었거나 값이 틀린 채 저장을 누른 모습. 저장되지 않고 첫 번째 오류 위치로 화면이 이동합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '긴 화면에서 저장이 안 됐는데 이유가 화면 밖에 있으면 운영자는 멈춥니다. 화면 맨 위에 고칠 곳 목록을(누르면 그 칸으로 이동), 묶음 이름표와 오른쪽 저장 바에 오류 표시를, 해당 칸 아래에 고치는 방법을 적습니다. 첫 번째 오류 칸으로 자동으로 내려가 커서를 둡니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '우리 몰 저장은 됐는데 스마트스토어 전송만 실패하는 경우가 따로 있습니다. 이때는 저장 완료로 처리하고, 전송 실패를 사라지지 않는 안내로 알려 다시 보내게 합니다. 저장하지 않고 나가려 하면 확인 팝업을 띄웁니다.'),
    Canvas({ label: 'A-21 · 저장 버튼 → 저장 오류 · 맨 위 요약 + 첫 오류(카테고리)로 이동' }, Page('기본정보', { errors: { 기본정보: 1, 이미지: 1, 상품정보제공고시: 1 }, miss: ['카테고리', '대표 이미지', '상품정보제공고시'], saved: '11-10 17:42 이보림', note: '고칠 곳 3곳이 남아 저장하지 못했습니다.' },
        errSummary,
        Box({ title: '기본정보' }, FormTable([
            basicRows()[0],
            { k: '카테고리', required: true, v: `<span style="display:inline-flex;align-items:center;min-height:36px;padding:4px 8px;border:2px solid var(--dark);border-radius:4px;background:var(--warnbg);width:520px;font-size:12.5px;color:var(--mute)">카테고리 이름으로 찾기</span>`, error: '카테고리를 1개 이상 골라 주세요. 아직 카테고리가 없다면 이름을 적고 새 카테고리 만들기를 누르세요.' },
            basicRows()[3],
        ])),
        Box({ title: '이미지' }, FormTable([{ k: '대표 이미지', required: true, v: Upload({ title: '대표 이미지를 끌어다 놓거나 눌러서 고르기' }), error: '대표 이미지를 올려 주세요. 1000 × 1000 px 이상 · 1:1 · JPG·PNG · 10MB 이하' }])),
    )),
    Canvas({ label: 'A-21 · 다 고친 뒤 저장 → 저장 완료 안내 (3초 뒤 사라짐)' }, Overlay({ bg: Page('기본정보', {}, Box({ title: '기본정보' }, FormTable(basicRows().slice(0, 4)))), dim: false, align: 'top', h: 380 },
        Toast('상품을 저장했습니다. 스마트스토어에도 전송했습니다.', { action: '내 쇼핑몰에서 보기' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '우리 몰 저장은 성공 · 스마트스토어 전송만 실패 (닫기 전까지 남음)', right: '안내만', pad: 20 }, Toast('상품을 저장했습니다. 스마트스토어 전송은 실패했습니다 — 대표 이미지 크기가 기준보다 작습니다.', { kind: 'error', action: '스마트스토어 묶음으로 이동' })),
        Canvas({ size: 'auto', label: '새 상품 등록 완료', right: '안내만', pad: 20 }, Toast('상품을 등록했습니다. 전시 안 함 상태입니다.', { action: '전시함으로 바꾸기' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '고친 내용을 저장하지 않고 목록으로 버튼 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '저장하지 않고 나갈까요?', desc: '판매가·옵션에서 고친 내용 4곳이 저장되지 않았습니다.', foot: [Btn('계속 고치기'), Btn('임시 저장하고 나가기'), Btn('저장 없이 나가기', 'danger')] })),
        Canvas({ size: 'auto', label: '다른 운영자가 먼저 고쳐 저장한 경우', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '다른 운영자가 먼저 저장했습니다', desc: '운영자 정수아 님이 11-11 10:18에 이 상품의 재고를 고쳐 저장했습니다.<br>지금 저장하면 그 내용 위에 덮어씁니다.', foot: [Btn('최신 내용 다시 불러오기'), Btn('내 내용으로 덮어쓰기', 'primary')] })),
        Canvas({ size: 'auto', label: '삭제 버튼 → 주문이 있는 상품은 삭제 대신 판매중지', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '이 상품은 삭제할 수 없습니다', desc: '주문 128건에 들어 있는 상품이라 삭제하면 주문 내역이 깨집니다.<br>판매중지 + 전시 안 함으로 바꾸면 고객에게 보이지 않습니다.', foot: [Btn('닫기'), Btn('판매중지 · 전시 안 함으로 바꾸기', 'primary')] })),
    ),
);

const STOCK_OPTS = [{ t: '롱지비티 석류맛 박스 재고', sub: '이 상품 · 현재 540박스 · 품목 3개가 함께 씀', on: true }, { t: `${Icon('plus-min')} 새 재고 만들기`, sub: '이 품목만 쓰는 재고 (기본값)' }, { t: '롱지비티 체험 3포 재고', sub: '다른 상품 · 현재 0개' }, { t: '스틱 보관 케이스 베이지 재고', sub: '다른 상품 · 현재 64개' }];
const linkCols = (first = '구성') => [{ t: first }, { t: '추가금', w: 104 }, { t: '실물 재고 연결', w: 190 }, { t: '재고 차감 수량', w: 104 }, { t: '판매 가능', w: 76, align: 'right' }, { t: '판매상태', w: 100 }, { t: '기본 선택', w: 62, align: 'center' }];
const linkRow = (name, add, n, can, o = {}) => ({ ...o.row, c: [NW(name), Input({ value: add, w: 88, suffix: '원' }), o.link || Select({ value: '박스 재고 (함께 씀)', w: 172 }), `${Input({ value: n, w: 70, suffix: o.unit || '박스', error: !!o.err })}${o.err ? `<small><b>${o.err}</b></small>` : ''}`, `<b>${can}</b>`, SALE(o.sale), Radio('', { on: o.def })] });
const StockCard = Box({ flat: true, title: `${Icon('package')} 이 상품의 실물 재고`, sub: '창고에 실제로 있는 수량', right: Btn('재고 관리에서 고치기', { size: 'sm', icon: 'external-link' }) },
    KV([['재고 이름', '<b>롱지비티 석류맛 박스 재고</b> (단위: 박스)'], ['현재 재고', '<b>540박스</b> · 선점 중 6박스(결제 진행 2 · 입금 대기 4) · 안전재고 60박스'], ['이 재고를 쓰는 품목', '1박스 ×1 · 2박스 ×2 · 4박스 ×4'], ['판매 가능 계산', '(현재 540 − 선점 6) ÷ 재고 차감 수량, 소수점 버림']], { wide: true }));
const NEW_STOCK = () => Select({ value: '새 재고 (이 품목만)', w: 172 });

const state14 = StateBlock({ idx: 14, title: '품목 실물 재고 연결·재고 차감 수량(구성 옵션 1·2·4박스)', note: '품목마다 재고 숫자를 따로 적지 않고, 창고의 실물 재고 하나에 품목을 연결한 뒤 한 건 팔릴 때 몇 개가 빠지는지(재고 차감 수량)를 적습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이너에라의 1박스·2박스·4박스는 창고에서 같은 상자입니다. 구성마다 재고를 따로 적으면(1박스 100개 · 2박스 50개 · 4박스 25개) 4박스가 팔려도 1박스 재고는 그대로라 실물 100박스로 150건 넘게 팔리는 사고가 납니다. 실물 재고를 하나로 두고 구성마다 빠지는 수량만 적으면, 4박스 1건이 팔릴 때 박스 재고가 4 줄고 세 구성의 판매 가능 수량이 함께 줄어듭니다. 스마트스토어로 보내는 옵션별 재고도 같은 계산(실물 재고 ÷ 재고 차감 수량, 버림)입니다.'),
    Anno({ warn: true, title: '초기값 · 놓치면 안 되는 것' }, '초기값: 품목마다 새 재고 · 재고 차감 수량 1 — 의류처럼 품목이 곧 실물인 상품은 아무것도 건드리지 않아도 됩니다. 재고 차감 수량은 1 이상의 정수. 판매 가능 수량이 그 품목의 재고 차감 수량보다 적어지면 그 품목만 자동 품절이 됩니다(박스 3개 남으면 4박스만 품절). 재고 숫자 자체는 이 화면이 아니라 상품 > 재고 관리에서 고칩니다. 주문이 있는 품목의 연결·차감 수량을 바꾸면 그 뒤 주문부터 적용됩니다.'),
    Canvas({ label: 'A-21 · 옵션·재고 묶음 · 이너에라 — 구성 3개가 박스 재고 하나를 1 · 2 · 4씩 나눠 씀' }, Page('옵션·재고', {},
        Box({ title: '옵션·재고' },
            FormTable([
                OptMode('단독형'),
                { k: '옵션 이름 · 값', required: true, v: AxisBox([AxisRow(1, '구성', SHOP.options.map((o) => o.name))], { count: 1, made: true, calc: '구성 3 = <b>품목 3개</b>' }) },
            ]),
            '<div style="height:14px"></div>',
            StockCard,
            Table({ dense: true, cols: linkCols(), rows: [
                linkRow('1박스(14일분)', '0', '1', '534', { def: true }),
                linkRow('2박스(28일분)', '44,000', '2', '267'),
                linkRow('4박스(56일분)', '127,000', '4', '133'),
            ] }),
            Note('판매 가능 = (540 − 6) ÷ 재고 차감 수량. 4박스 1건이 결제되면 박스 재고 540 → 536, 판매 가능은 1박스 530 · 2박스 265 · 4박스 132로 함께 바뀝니다. 금액은 예시 값입니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '실물 재고 연결 칸을 누름 → 검색형 목록 (새 재고 / 기존 재고 함께 쓰기)', right: '입력칸만', pad: 20 }, `<div style="width:440px;min-height:260px">${Select({ value: '박스 재고 (함께 씀)', w: 240, open: true, search: '', options: STOCK_OPTS })}<p style="font-size:12px;color:var(--mute);margin:8px 0 0">다른 상품의 재고도 이름으로 찾아 함께 쓸 수 있습니다(선물 세트 = 박스 재고 ×2).</p></div>`),
        Canvas({ size: 'auto', label: '재고 차감 수량 입력 오류', right: '표만', pad: 20 }, `<div style="width:770px">${Table({ dense: true, cols: linkCols(), rows: [linkRow('4박스(56일분)', '127,000', '0', '-', { err: '1 이상의 숫자를 넣어 주세요', row: { hl: true } })] })}</div>`),
    ),
    Canvas({ size: 'auto', label: '박스 재고가 3박스 남았을 때 — 4박스만 자동 품절', right: '표만', pad: 20 }, `<div style="width:770px">${Table({ dense: true, cols: linkCols(), rows: [
        linkRow('1박스(14일분)', '0', '1', '3', { def: true }),
        linkRow('2박스(28일분)', '44,000', '2', '1'),
        linkRow('4박스(56일분)', '127,000', '4', '0', { sale: '품절', row: { hl: true } }),
    ] })}${Note('4박스는 재고 차감 수량(4)보다 남은 재고(3)가 적어 자동 품절입니다. 입고되면 자동으로 판매중으로 돌아옵니다. 운영자가 직접 판매중지한 품목은 그대로 둡니다.', { warn: true })}</div>`),
    Canvas({ size: 'auto', label: '다른 업종 예시 · 의류 — 품목마다 새 재고 · 재고 차감 수량 1 (초기값 그대로)', right: '표만', pad: 20 }, `<div style="width:770px">${Table({ dense: true, cols: linkCols('색상 · 사이즈'), rows: [
        linkRow('블랙 · S', '0', '1', '50', { def: true, unit: '개', link: NEW_STOCK() }),
        linkRow('블랙 · M', '0', '1', '50', { unit: '개', link: NEW_STOCK() }),
        linkRow('아이보리 · L', '2,000', '1', '0', { sale: '품절', unit: '개', link: NEW_STOCK(), row: { hl: true } }),
    ] })}</div>`),
    Canvas({ size: 'auto', label: '주문이 있는 품목의 재고 차감 수량을 바꿔 저장 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '재고 차감 수량을 바꿀까요?', desc: '2박스(28일분)의 재고 차감 수량을 2 → 3으로 바꿉니다.<br>이미 받은 주문 168건은 그대로 두고, 지금부터 들어오는 주문에만 적용됩니다.<br>판매 가능 수량이 267 → 178로 바뀌고 스마트스토어 재고도 다시 전송됩니다.', ok: '바꾸기' })),
);

const CautionBand = (open) => `<div style="border:1px solid #d9b452;background:var(--warnbg);border-radius:4px;padding:10px 14px;margin-bottom:12px;font-size:13px;color:var(--warn)"><div style="display:flex;align-items:center;gap:8px">${Icon('warning')}<b style="white-space:nowrap">식품 표시·광고 주의 표현</b><span>일반식품은 질병의 예방·치료 효과나 건강기능식품으로 오인될 표현을 쓸 수 없습니다.</span><span style="flex:1"></span><u style="white-space:nowrap">${open ? '접기' : '쓰면 안 되는 표현 보기'}</u></div>${open ? `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;color:var(--ink)"><div style="background:#fff;border:1px solid var(--line2);border-radius:4px;padding:10px 12px"><b>${Icon('close-min')} 쓰면 안 되는 표현 예</b><ul style="margin:6px 0 0;padding-left:18px;line-height:1.8"><li>질병 이름과 함께 쓰는 예방·치료·개선 (예: 당뇨에 좋은, 관절염 완화)</li><li>노화 방지 · 면역력 강화 · 항산화 효과 · 혈당 조절 · 체지방 감소</li><li>건강기능식품 · 기능성 인정 (인정받지 않은 제품)</li><li>의사·약사 추천, 체험 사례로 효과를 단정하는 문장</li></ul></div><div style="background:#fff;border:1px solid var(--line2);border-radius:4px;padding:10px 12px"><b>${Icon('check-min')} 이렇게 바꿔 쓰기</b><ul style="margin:6px 0 0;padding-left:18px;line-height:1.8"><li>원료와 함량을 사실대로 (석류 농축액 함량 표기)</li><li>먹는 방법·맛·제형 설명 (하루 한 포, 물 없이)</li><li>브랜드 이야기 · 원료 산지 · 제조 과정</li><li>고정 주석: 「본 제품은 질병의 예방 및 치료를 위한 의약품이 아닙니다」</li></ul></div></div>` : ''}</div>`;

const state15 = StateBlock({ idx: 15, title: '식품·건강 표현 주의 안내 띠', note: '식품·건강 표현 주의 안내를 켠 몰(이너에라 켬)은 상품 문구를 고치는 화면 위에 금지 표현 안내가 항상 떠 있습니다. 스크롤해도 묶음 이름표 아래에 붙어 따라옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이너에라 젤리스틱은 일반식품이라 효능·효과 표현을 쓰면 식품표시광고법 위반이 됩니다. 운영자는 규칙을 외우고 있지 않으므로, 문구를 고치는 바로 그 자리에 쓰면 안 되는 표현과 바꿔 쓸 표현을 보여 줍니다. 같은 띠가 디자인 > 메인 화면 구성 · 콘텐츠 페이지 · 배너 편집 화면과 고객응대 > 리뷰의 베스트 지정에도 뜹니다.'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '초기값: 끔(식품·건강 업종이 아닌 몰은 띠가 없음). 켜고 끄기는 설정 > 기능 켜고 끄기에서 합니다. 안내 문구와 예시 목록은 솔루션이 정한 고정 내용이며 운영자가 고치지 못합니다. 띠는 안내일 뿐 저장을 막지 않습니다 — 문구의 최종 책임은 고객사에 있습니다.'),
    Canvas({ label: 'A-21 · 안내를 켠 몰 · 상세설명 묶음 · 띠 접힘(기본)' }, Page('상세설명', {},
        CautionBand(false),
        Box({ title: '상세설명', sub: '필수' },
            Editor('글쓰기', [Img({ h: 120, label: '상세 이미지 1 · 첫 화면(석류 원물 + 제품) · 860 × 1200' }), '<p style="font-size:13.5px;margin:12px 0">하루 한 포, 물 없이 간편하게 드세요. 개봉 후에는 바로 섭취해 주세요.</p>'].join(''), { h: 200 }),
        ))),
    Canvas({ label: 'A-21 · 쓰면 안 되는 표현 보기를 누름 → 띠 펼침 · 기본정보 묶음(상품명·한 줄 소개를 고칠 때도 같은 띠)' }, Page('기본정보', {},
        CautionBand(true),
        Box({ title: '기본정보' }, FormTable(basicRows().slice(0, 2))),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '안내를 끈 몰(다른 업종) — 띠 없음', right: '묶음만', pad: 20 }, `<div style="width:640px">${Box({ title: '기본정보' }, FormTable([{ k: '상품명', required: true, v: Input({ value: '베이직 코튼 티셔츠', w: 380 }) }]))}</div>`),
        Canvas({ size: 'auto', label: '설정 > 기능 켜고 끄기에서 켜는 줄 (참고)', right: '설정 줄', pad: 20 }, `<div style="width:520px">${Box({ flat: true }, `<div style="display:flex;align-items:center;gap:12px"><div style="flex:1"><b>식품·건강 표현 주의 안내</b><div style="font-size:12.5px;color:var(--mute)">상품·메인 화면 구성·콘텐츠 페이지·배너 편집 화면과 리뷰 베스트 지정에 금지 표현 안내를 띄웁니다.</div></div>${Toggle('켬', { on: true })}</div>`)}</div>`),
    ),
);

export default function A21() {
    return [state1, state2, state3, state4, state5, state6, state7, state8, state9, state10, state11, state12, state13, state14, state15].join('');
}
