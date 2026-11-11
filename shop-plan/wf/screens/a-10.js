import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Chip, Input, Select, Check, Radio, CheckGroup, RadioGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Overlay, Modal, Confirm, Toast, Box, KV, Note, Text, Icon, Flex, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };

const ROWS = [
    { no: '20261111-000128', at: '11-11 09:42', ch: '자사몰', opt: O2, qty: 1, buyer: '김민지', to: '김민지', tel: '010-****-1234', pay: '93,000원', by: '신용카드', st: '결제완료', inv: '' },
    { no: '2026111145821371', at: '11-11 09:31', ch: '스마트스토어', opt: O1, qty: 2, buyer: '박서준', to: '박서준', tel: '010-****-5821', pay: '98,000원', by: '네이버페이', st: '결제완료', inv: '' },
    { grp: '같은 주문 20261111-000125 · 강지호 · 품목 2개 · 결제 196,000원 (신용카드)' },
    { no: '20261111-000125', sub: '품목 1 / 2', at: '11-11 08:40', ch: '자사몰', opt: O1, qty: 3, buyer: '강지호', to: '강지호', tel: '010-****-4468', pay: '147,000원', by: '신용카드', st: '배송중', inv: 'CJ대한통운<small><u>581233441240</u></small>', tied: true },
    { no: '20261111-000125', sub: '품목 2 / 2', at: '11-11 08:40', ch: '자사몰', opt: O1, qty: 1, buyer: '강지호', to: '강지호', tel: '010-****-4468', pay: '49,000원', by: '신용카드', st: '배송준비', inv: '<small>송장 미입력</small>', tied: true },
    { no: '20261111-000126', at: '11-11 08:55', ch: '자사몰', opt: O1, qty: 1, buyer: '최도윤', to: '최도윤', tel: '010-****-2204', pay: '52,000원', by: '가상계좌', st: '입금대기', inv: '', extra: '입금 기한 11-12 23:59' },
    { no: '2026111045790022', at: '11-10 22:14', ch: '스마트스토어', opt: O2, qty: 1, buyer: '정수아', to: '정수아', tel: '010-****-9015', pay: '93,000원', by: '네이버페이', st: '취소요청', inv: '', extra: '요청 11-11 08:02' },
    { no: '20261109-000101', at: '11-09 14:27', ch: '자사몰', opt: O4, qty: 1, buyer: '윤서연', to: '윤서연', tel: '010-****-3317', pay: '176,000원', by: '카카오페이', st: '배송완료', inv: '한진택배<small><u>423198770215</u></small>', extra: '자동 확정 11-18' },
    { no: '20261107-000088', at: '11-07 11:03', ch: '자사몰', opt: O2, qty: 1, buyer: '임재현', to: '임수경(어머니)', tel: '010-****-6642', pay: '93,000원', by: '신용카드', st: '반품요청', inv: 'CJ대한통운<small><u>581233440877</u></small>', extra: '요청 11-10 19:40' },
    { no: '20261103-000052', at: '11-03 16:51', ch: '자사몰', opt: O1, qty: 2, buyer: '이하은', to: '이하은', tel: '010-****-7730', pay: '98,000원', by: '토스페이', st: '구매확정', inv: 'CJ대한통운<small><u>581233439912</u></small>' },
    { no: '20261102-000047', at: '11-02 10:18', ch: '자사몰', opt: O1, qty: 1, buyer: '비회원', to: '한지우', tel: '010-****-8120', pay: '52,000원', by: '실시간 계좌이체', st: '취소완료', inv: '', dim: true, extra: '환불 11-02 15:30' },
];

const COLS = [{ t: '주문번호 · 주문일시', w: 148, sort: 'desc' }, { t: '채널', w: 100 }, '상품 · 구성', { t: '수량', w: 44, align: 'center' }, { t: '주문자 · 받는 분', w: 108 }, { t: '결제금액 · 수단', w: 104, align: 'right' }, { t: '상태', w: 116 }, { t: '택배사 · 송장번호', w: 124 }];
const row = (o) => (o.grp ? { group: `${Icon('receipt')}${o.grp}` } : {
    tied: o.tied, dim: o.dim,
    c: [`<u>${o.no}</u><small>${o.sub ? `${o.sub} · ` : ''}${o.at}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt}</small>`, o.qty,
        `${o.buyer}${o.buyer === '비회원' ? '' : ''}<small class="nw">${o.to === o.buyer ? o.tel : `받는 분 ${o.to}`}</small>`, `${o.pay}<small>${o.by}</small>`,
        `${OrderBadge(o.st)}${o.extra ? `<small>${o.extra}</small>` : ''}`, o.inv || '<small>-</small>'],
});

const STATUS = ['입금대기', '결제완료', '배송준비', '배송중', '배송완료', '구매확정', '취소', '반품', '교환'];
const kwSelect = (open) => Select({ value: '주문자 이름', w: 150, open, options: open ? [{ t: '주문번호', sub: '자사몰·스마트스토어 모두' }, { t: '주문자 이름', on: true }, '주문자 연락처', '받는 분 이름', '받는 분 연락처', '상품명', '송장번호', '입금자명'] : undefined });

const fullFilters = (o = {}) => Filters({
    rows: [
        { k: '기간', v: [Select({ value: '주문일', w: 110 }), Period({ preset: o.preset || '1개월', from: o.from || '2026-10-12', to: o.to })] },
        { k: '주문 상태', v: CheckGroup(['전체', ...STATUS], o.status || ['전체']) },
        { k: '채널', v: RadioGroup(['전체', '자사몰', '스마트스토어'], o.ch || '전체') },
        { k: '결제수단', v: CheckGroup(['전체', '신용카드', '실시간 계좌이체', '가상계좌', '카카오페이', '네이버페이', '토스페이'], o.pay || ['전체']) },
        { k: '검색어', v: [o.kw || kwSelect(false), Input({ value: o.q, placeholder: '여러 건은 쉼표나 줄바꿈으로 구분 (최대 100건)', icon: 'search', w: 380 }), Check('정확히 일치', { on: false })] },
        { k: '상품', v: [Select({ value: o.product || '', placeholder: '상품 전체 (이름으로 찾기)', w: 320 }), Select({ placeholder: '구성 전체', w: 170 })] },
        { k: '그 밖', v: CheckGroup(['회원 주문만', '비회원 주문만', '관리자 메모 있음', '발송 지연', '부분 취소 있음'], o.etc || []) },
    ],
    actions: [Btn('검색', { kind: 'primary', icon: 'search' }), Btn('초기화', { icon: 'refresh' }), `<span style="margin-left:auto;font-size:12.5px;color:var(--ink2)">자주 쓰는 조건 ${Select({ value: '오늘 출고할 주문', w: 170 })} ${Btn('지금 조건 저장', { size: 'sm' })}</span>`].join(''),
});

const HeadActions = [Btn('엑셀 양식 설정', { icon: 'cog' }), Btn('스마트스토어 주문 지금 가져오기', { icon: 'sync' })];
const Page = (...body) => AdminLayout({ active: 'a-10', counts: COUNTS, actions: HeadActions, desc: '자사몰과 스마트스토어의 모든 주문을 품목 한 줄 단위로 찾습니다. 초기값: 주문일 최근 1개월 · 상태 전체 · 채널 전체 · 검색 조건 접힘.' }, body);

const CHIPS = ['전체 468', '입금대기 5', '결제완료 38', '배송준비 124', '배송중 42', '배송완료 97', '구매확정 148', '취소·반품·교환 14'];
const Head = (total = 468, active = '전체 468') => ListHead({ total, left: Chips(CHIPS, active), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] });
const List = (checked = [], rows = ROWS) => Table({ check: true, checked, cols: COLS, rows: rows.map(row) });
const Foot = () => [Note('금액은 예시 값입니다(판매가 미확정). 한 주문에 품목이 여럿이면 품목마다 한 줄이고, 굵은 왼쪽 띠와 머리줄로 같은 주문임을 표시합니다.'), Pager({ page: 1, last: 10, per: 50 })];

const CalDay = (d, kind) => {
    const s = { in: 'background:var(--fill)', edge: 'background:var(--dark);color:#fff;font-weight:700', today: 'border:2px solid var(--dark);font-weight:700', off: 'color:#c4c4cc;text-decoration:line-through', out: 'color:#c4c4cc' }[kind] || '';
    return `<span style="height:30px;display:flex;align-items:center;justify-content:center;font-size:12.5px;border-radius:3px;${s}">${d}</span>`;
};
const Cal = (title, cells) => `<div style="width:238px"><div style="display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:13px;margin-bottom:6px">${Icon('angle-left-min')}${title}${Icon('angle-right-min')}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${['일', '월', '화', '수', '목', '금', '토'].map((d) => `<span style="text-align:center;font-size:11.5px;color:var(--mute);height:24px">${d}</span>`).join('')}${cells.join('')}</div></div>`;
const octCells = [...[27, 28, 29, 30].map((d) => CalDay(d, 'out')), ...Array.from({ length: 31 }, (_, i) => CalDay(i + 1, i + 1 === 12 ? 'edge' : i + 1 > 12 ? 'in' : ''))];
const novCells = [...Array.from({ length: 30 }, (_, i) => CalDay(i + 1, i + 1 < 11 ? 'in' : i + 1 === 11 ? 'edge' : 'off')), ...[1, 2, 3, 4, 5].map((d) => CalDay(d, 'out'))];
const CalPop = `<div style="display:inline-block;border:1px solid var(--dark);border-radius:6px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.12);padding:16px">
  <div style="display:flex;gap:24px">${Cal('2026년 10월', octCells)}${Cal('2026년 11월', novCells)}</div>
  <div style="display:flex;align-items:center;gap:14px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line2);font-size:12px;color:var(--ink2)">
    <span style="display:inline-flex;align-items:center;gap:4px">${CalDay('12', 'edge').replace('height:30px', 'height:22px;width:26px')}시작·끝</span>
    <span style="display:inline-flex;align-items:center;gap:4px">${CalDay('20', 'in').replace('height:30px', 'height:22px;width:26px')}고른 기간</span>
    <span style="display:inline-flex;align-items:center;gap:4px">${CalDay('15', 'off').replace('height:30px', 'height:22px;width:26px')}고를 수 없음(내일 이후)</span>
    <span style="margin-left:auto"><b>2026-10-12 ~ 2026-11-11 (31일)</b></span>${Btn('적용', { kind: 'primary', size: 'sm' })}
  </div>
</div>`;

const state1 = StateBlock({ idx: 1, title: '검색 조건 펼침(기간·상태·채널·결제수단·주문자·상품·송장)', note: '화면을 열면 검색 조건은 접혀 있고 자주 쓰는 기간·상태·검색어 한 줄만 보입니다(초기값 최근 1개월 · 상태 전체 · 채널 전체). 펼치기를 누르면 전체 조건이 나오고, 검색을 누르면 다시 한 줄 요약으로 접힙니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 전화로 대는 것은 주문번호가 아니라 이름과 휴대폰 뒷자리입니다. 그래서 검색어 종류를 주문번호·주문자·받는 분·연락처·상품명·송장번호·입금자명으로 나누고, 연락처는 뒷 4자리만 넣어도 찾습니다. 주문번호·송장번호는 엑셀에서 복사한 여러 건을 한 번에 붙여 넣을 수 있습니다. 기간은 오늘·어제·7일·1개월·3개월 버튼이 기본이고 직접 고르면 달력이 열립니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '주문이 1만 건을 넘어도 느려지지 않게 기간은 한 번에 최대 1년까지만 조회합니다. 기간 기준은 주문일·결제일·발송일·배송완료일·구매확정일 중에 고릅니다. 상품 고르기는 상품이 많은 몰을 위해 이름으로 찾는 검색형입니다(이너에라는 1개). 자주 쓰는 조건은 운영자별로 저장됩니다.'),
    Canvas({ label: 'A-10 · 처음 열었을 때 (초기값) · 검색 조건 접힘 · 자주 쓰는 한 줄만' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월(10-12 ~ 11-11) · 상태 전체 · 채널 전체 · 결제수단 전체' }),
        `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-4px 0 14px;padding:10px 14px;border:1px solid var(--line);border-radius:4px;background:var(--box)">${Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })}${Select({ value: '상태 전체', w: 120 })}${kwSelect(false)}${Input({ placeholder: '주문번호 · 이름 · 연락처 뒷 4자리', icon: 'search', w: 230 })}${Btn('검색', { kind: 'primary', icon: 'search' })}</div>`,
        Head(), List([], ROWS.slice(0, 2)))),
    Canvas({ label: 'A-10 · 펼치기를 누름 → 검색 조건 펼침 (전체 조건)' }, Page(fullFilters(), Head(), List([], ROWS.slice(0, 2)))),
    Canvas({ label: 'A-10 · 조건을 넣은 모습 (주문 상태 배송중·배송완료 · 자사몰 · 주문자 이름 2명)' }, Page(fullFilters({ preset: '1개월', from: '2026-10-12', to: '2026-11-11', status: ['배송중', '배송완료'], ch: '자사몰', q: '강지호, 윤서연' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '검색어 종류 고르는 중 (목록 열림)', right: '부분', pad: 20 }, `<div style="width:560px;min-height:330px;display:flex;gap:8px;align-items:flex-start">${kwSelect(true)}${Input({ placeholder: '여러 건은 쉼표나 줄바꿈으로 구분 (최대 100건)', icon: 'search', w: 380 })}</div>`),
        Canvas({ size: 'auto', label: '상품 고르는 중 (검색형 · 다른 업종 예시: 상품이 많은 몰)', right: '부분', pad: 20 }, `<div style="width:340px;min-height:330px">${Select({ value: '', placeholder: '상품 전체 (이름으로 찾기)', w: 320, open: true, search: '셔츠', options: [{ t: '옥스퍼드 셔츠', sub: '판매중 · 품목 12개' }, { t: '린넨 오버핏 셔츠', sub: '판매중 · 품목 9개' }, { t: '스트라이프 셔츠 원피스', sub: '품절' }, { t: '데님 셔츠 재킷', sub: '판매 중지' }] })}<p class="help">판매 중지·삭제된 상품도 지난 주문을 찾을 수 있게 목록에 나옵니다.</p></div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '기간 날짜 칸을 누름 → 달력 (시작일·끝일 고르기 · 날짜별 상태)', right: '부분', pad: 20 }, `<div style="min-height:330px">${Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' })}<div style="margin-top:4px;margin-left:170px">${CalPop}</div></div>`),
        Canvas({ size: 'auto', label: '입력 오류 2가지', right: '부분', pad: 20 }, `<div style="width:520px">${FormTable([
            { k: '기간', v: [Input({ value: '2025-09-01', icon: 'calendar', w: 140, error: true }), ' ~ ', Input({ value: '2026-11-11', icon: 'calendar', w: 140 })], error: '한 번에 1년까지만 조회할 수 있습니다. 시작일을 2025-11-12 이후로 고르세요.' },
            { k: '검색어', v: [Select({ value: '주문자 연락처', w: 150 }), Input({ value: '12', w: 160, error: true })], error: '연락처는 뒷 4자리 이상 넣어 주세요. (예: 1234 또는 01023451234)' },
        ])}</div>`),
    ),
);

const state2 = StateBlock({ idx: 2, title: '결과 목록(품목 단위 행, 체크박스)', note: '검색하면 조건이 한 줄로 접히고 목록이 올라옵니다. 한 줄 = 품목 주문 하나.' },
    Anno({ title: '왜 이렇게 하나' }, '주문 상태는 품목마다 따로 움직입니다(한 주문에서 하나는 배송중, 하나는 배송준비). 그래서 스마트스토어 판매자센터처럼 품목 주문 한 줄 단위로 보여 주고, 같은 주문은 머리줄과 왼쪽 굵은 띠로 묶습니다. 상태 칸 아래 작은 글씨로 다음에 일어날 일(입금 기한 · 자동 확정일 · 요청 시각)을 적어 눌러 보지 않아도 알게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '주문번호를 누르면 화면을 떠나지 않고 오른쪽에서 주문 상세(A-18)가 열립니다. 송장번호를 누르면 배송 추적이 열립니다. 주문자와 받는 분이 다르면 받는 분 이름을 따로 적습니다(선물 주문). 비회원 주문은 주문자 칸에 비회원이라고 적습니다. 상태별 건수 칩은 지금 검색 조건 안에서의 건수입니다.'),
    Canvas({ label: 'A-10 · 검색 뒤 · 조건 접힘 · 결과 목록 (상태가 서로 다른 품목 주문 10줄)' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월(10-12 ~ 11-11) · 상태 전체 · 채널 전체 · 결제수단 전체' }),
        Head(), List(), Foot(),
    )),
    Canvas({ label: 'A-10 · 상태 칩 배송준비를 누름 + 채널 스마트스토어 (조건 표시 칩 · 지우면 바로 다시 검색)' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월 · 상태 배송준비 · 채널 스마트스토어' }),
        `<div style="display:flex;gap:6px;align-items:center;margin-bottom:10px;font-size:12.5px;color:var(--ink2)">걸린 조건 ${Chip('상태: 배송준비', { close: true })}${Chip('채널: 스마트스토어', { close: true })}<u>모두 지우기</u></div>`,
        Head(46, '배송준비 124'),
        List([], [
            { no: '2026111145821402', at: '11-11 07:12', ch: '스마트스토어', opt: O2, qty: 1, buyer: '윤서연', to: '윤서연', tel: '010-****-3317', pay: '93,000원', by: '네이버페이', st: '배송준비', inv: '<small>송장 미입력</small>', extra: '발송 기한 11-13' },
            { no: '2026111045790187', at: '11-10 20:40', ch: '스마트스토어', opt: O1, qty: 1, buyer: '임재현', to: '임재현', tel: '010-****-6642', pay: '49,000원', by: '네이버페이', st: '발송지연', inv: '<small>송장 미입력</small>', extra: '예정일 11-16' },
        ]),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-10 · 페이지당 개수 고르는 중 · 마지막 쪽 (500개씩 보기까지)' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }),
        ListHead({ total: 468, left: Chips(CHIPS.slice(0, 4), '전체 468'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), Select({ value: '50개씩 보기', w: 130, open: true, options: [{ t: '50개씩 보기', on: true }, '100개씩 보기', '500개씩 보기'] })] }),
        List([], ROWS.slice(9)),
        Text('468건 중 451 ~ 468번째 · 마지막 쪽입니다.', { sm: true, mute: true }),
        Pager({ page: 10, last: 10, per: 50 }).replace('<span class="pg on">1</span>', '<span class="pg">1</span>').replace('<span class="pg">10</span>', '<span class="pg on">10</span>'),
    )),
);

const bulkBtns = [Btn('발주확인', 'primary'), Btn('발송 지연 처리', { kind: 'line', icon: 'clock-o' }), Btn('메모', { kind: 'line', icon: 'note-o' }), Btn('알림 다시 보내기', { kind: 'line', icon: 'send' })];

const state3 = StateBlock({ idx: 3, title: '일괄 처리 바', note: '줄을 하나라도 체크하면 목록 위 줄이 일괄 처리 바로 바뀝니다. 선택한 주문의 상태에 따라 누를 수 있는 버튼이 달라집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '전체 주문 조회의 일괄 처리는 네 가지뿐입니다: 발주확인 · 발송 지연 처리 · 메모 · 알림 다시 보내기. 상태가 섞여 있으면 버튼을 누를 때 되는 건과 안 되는 건을 나눠 알려 주고 되는 건만 처리합니다. 판매자 취소·구매확정 같은 그 밖의 처리와 본격적인 출고·클레임 처리는 주문 상세나 각 업무 메뉴(발주 확인·발송 처리, 취소 관리 등)에서 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '머리 체크박스는 지금 쪽의 줄만 고릅니다. 검색 결과 전체(468건)를 고르려면 바에 뜨는 전체 선택 줄을 누릅니다. 같은 주문 묶음의 한 줄만 골라도 됩니다(품목 단위 처리).'),
    Canvas({ label: 'A-10 · 결제완료 2건 선택 → 일괄 처리 바 (발주확인 · 발송 지연 처리 · 메모 · 알림 다시 보내기)' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }),
        BulkBar({ count: 2, sub: '결제완료 2건 · 자사몰 1 · 스마트스토어 1' }, bulkBtns),
        List([0, 1]), Foot(),
    )),
    Canvas({ label: 'A-10 · 머리 체크박스로 이 쪽 50건 선택 → 검색 결과 전체 선택 줄' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }),
        BulkBar({ count: 50, sub: '상태가 섞여 있음' }, bulkBtns),
        `<div style="background:var(--box);border:1px solid var(--line);border-top:0;padding:8px 14px;font-size:13px;text-align:center">이 쪽의 50건을 골랐습니다. <u><b>검색 결과 468건 모두 고르기</b></u></div>`,
        List([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ROWS.slice(0, 5)),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '발송 지연 처리를 누름 → 발주 확인·발송 처리(A-12)와 같은 팝업 (사유·예정일 → 고객 안내)', right: '팝업만', pad: 20 },
            Modal({ title: '발송 지연 처리 · 2건', w: 480, foot: [Btn('취소'), Btn('2건 지연 안내 보내기', 'primary')] },
                FormTable([
                    { k: '지연 사유', required: true, v: Select({ value: '재고 부족(입고 예정)', w: 240 }) },
                    { k: '발송 예정일', required: true, v: Input({ value: '2026-11-16', icon: 'calendar', w: 160 }), help: '오늘 이후만 고를 수 있습니다.' },
                ]),
                Note('결제완료 · 배송준비 주문만 처리됩니다. 한 주문에 한 번이 원칙이며, 사유 목록은 설정 > 주문·클레임 정책에서 바꿉니다.'),
            )),
        Canvas({ size: 'auto', label: '상태가 섞인 5건에서 발주확인 → 되는 건만 처리 확인', right: '팝업만', pad: 20 },
            Modal({ title: '선택한 5건 중 2건만 발주확인할 수 있습니다', w: 520, foot: [Btn('취소'), Btn('2건 발주확인', 'primary')] },
                Table({ dense: true, cols: ['상태', { t: '건수', w: 60, align: 'right' }, '처리'], rows: [
                    [OrderBadge('결제완료'), '2건', `${Icon('check-min')} 발주확인합니다 (자사몰 1 · 스마트스토어 1)`],
                    { dim: true, c: [OrderBadge('입금대기'), '1건', '입금 전이라 발주확인할 수 없습니다'] },
                    { dim: true, c: [OrderBadge('배송중'), '1건', '이미 발송한 주문입니다'] },
                    { dim: true, c: [OrderBadge('취소요청'), '1건', '취소 요청을 먼저 처리하세요 <u>취소 관리로</u>'] },
                ] }),
                Note('발주확인 뒤에는 고객이 바로 취소할 수 없고 취소 요청으로 접수됩니다. 스마트스토어 주문은 네이버에도 발주확인이 전송됩니다.'),
            )),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '알림 다시 보내기를 누름 → 보낼 알림 고르기 (선택한 주문의 지금 상태에 맞는 알림만)', right: '팝업만', pad: 20 },
            Modal({ title: '알림 다시 보내기 · 2건', w: 520, foot: [Btn('취소'), Btn('2건 다시 보내기', 'primary')] },
                FormTable([
                    { k: '보낼 알림', required: true, v: Select({ value: '결제 완료 안내', w: 260, open: true, options: [{ t: '결제 완료 안내', sub: '결제완료 2건', on: true }, { t: '발송 안내(송장)', sub: '배송중만 가능', disabled: true }, { t: '입금 안내', sub: '입금대기만 가능', disabled: true }] }) },
                    { k: '보내는 방법', v: Text('알림톡 · 실패하면 문자로 대신 보냄', { sm: true }) },
                ]),
                Note('스마트스토어 주문 1건은 구매자 안내를 네이버가 보내므로 빠집니다(자사몰 1건만 발송). 보낸 기록은 주문 상세의 알림 발송 이력에 남습니다.', { warn: true }),
            )),
        Canvas({ size: 'auto', label: '관리자 메모 일괄 붙이기', right: '팝업만', pad: 20 },
            Modal({ title: '관리자 메모 · 2건에 붙이기', w: 440, foot: [Btn('취소'), Btn('메모 저장', 'primary')] },
                Textarea({ value: '11-11 오후 출고분. 사은품 스티커 같이 넣기.', h: 80, count: '25 / 500' }),
                Note('고객에게 보이지 않습니다. 주문 상세의 관리자 메모에 작성자(이보림)와 시각이 함께 남습니다.'),
            )),
    ),
    Canvas({ label: 'A-10 · 처리 뒤 토스트 (목록의 상태가 바뀌고 선택이 풀림)' }, Overlay({ bg: Page(Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }), Head(), List([], ROWS.slice(0, 4))), dim: false, align: 'top', h: 380 },
        Toast('2건을 발주확인했습니다. 발주 확인·발송 처리에서 송장을 넣으세요.', { action: '발송 처리로 가기' }))),
);

const formOptions = [{ t: '기본 양식', sub: '전체 항목 32개' }, { t: 'CJ대한통운 접수 양식', sub: '택배사 양식 · 9개 항목', on: true }, { t: '한진택배 접수 양식', sub: '택배사 양식 · 10개 항목' }, { t: '회계 전달용', sub: '내가 만든 양식 · 14개 항목' }, { t: '사은품 포장 목록', sub: '내가 만든 양식 · 6개 항목' }];

const excelModal = (o = {}) => Modal({ title: '엑셀 내려받기', w: 600, foot: [Btn('취소'), Btn(o.btn || '468건 내려받기', { kind: 'primary', icon: 'download', disabled: o.disabled })] },
    FormTable([
        { k: '대상', required: true, v: [Radio('검색 결과 전체 468건', { on: !o.sel }), Radio('선택한 주문 2건', { on: o.sel, disabled: !o.sel })], help: '대상은 품목 주문 단위입니다. 한 주문에 품목이 2개면 2행이 됩니다.' },
        { k: '양식', required: true, v: o.form || Select({ value: 'CJ대한통운 접수 양식 (9개 항목)', w: 340 }), help: '양식은 주문 > 엑셀 양식 설정에서 만들고 고칩니다. 마지막에 쓴 양식이 기억됩니다.' },
        { k: '들어가는 항목', v: Text('받는 분 · 받는 분 연락처 · 우편번호 · 주소 · 상품명 · 수량 · 배송 메모 · 주문번호 · 운임 구분', { sm: true }) },
        { k: '파일 형식', v: RadioGroup(['XLSX', 'CSV'], 'XLSX') },
        { k: '개인정보 표시', v: [Radio('가림 (김*지 · 010-****-1234)'), Radio('모두 표시', { on: true })], help: '모두 표시는 고객 정보 내려받기 권한이 있는 운영자만 고를 수 있습니다.' },
        { k: '개인정보', v: Text(`${Badge('개인정보 포함 양식', 'bold')} 이름 · 연락처 · 주소가 들어 있어 내려받기를 누르면 사유를 묻습니다`, { sm: true }) },
    ]),
    o.extra || '',
);

const state4 = StateBlock({ idx: 4, title: '엑셀 다운로드(양식 고르기)', note: '엑셀 내려받기 버튼 → 팝업에서 대상과 양식을 고르고 받습니다. 양식은 A-19 엑셀 양식 설정에서 만든 것이 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '같은 주문 자료라도 택배사에 올릴 엑셀, 회계에 넘길 엑셀, 포장할 때 볼 엑셀의 칸이 다 다릅니다. 매번 받아서 칸을 지우고 옮기지 않도록 미리 만든 양식을 고르면 그 칸 순서대로 나옵니다. 택배사 양식으로 받으면 택배사 프로그램에 그대로 올릴 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '주문 엑셀에는 이름·연락처·주소가 들어갑니다. 개인정보가 든 양식은 내려받기 전에 사유를 묻고 기록을 남깁니다(상태 6). 5,000행이 넘으면 화면을 붙잡지 않고 만들어지는 대로 알림으로 알려 주며, 파일은 24시간 뒤 지워집니다.'),
    Canvas({ label: 'A-10 · 엑셀 내려받기 버튼 → 팝업 (검색 결과 전체)' }, Overlay({ bg: Page(Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }), Head(), List([], ROWS.slice(0, 6))), h: 740 }, excelModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '양식 고르는 중 (목록 열림 · 택배사 양식과 내가 만든 양식)', right: '팝업만', pad: 20 }, excelModal({ form: Select({ value: 'CJ대한통운 접수 양식 (9개 항목)', w: 340, open: true, search: '', options: formOptions }) })),
        Canvas({ size: 'auto', label: '2건 선택 뒤 연 모습 (대상이 선택한 주문으로 바뀜)', right: '팝업만', pad: 20 }, excelModal({ sel: true, btn: '2건 내려받기' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '내려받기 완료', right: '토스트만', pad: 20 }, Toast('주문_20261111_CJ대한통운접수양식.xlsx (468행)을 내려받았습니다.')),
        Canvas({ size: 'auto', label: '5,000행이 넘을 때 (만들어지면 알림)', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '12,480행은 만드는 데 1~2분 걸립니다', desc: '다 만들어지면 위쪽 알림(종 모양)에 내려받기 주소가 뜹니다. 그동안 다른 일을 하셔도 됩니다.<br>파일은 24시간 뒤 지워집니다.', ok: '만들기 시작' })),
        Canvas({ size: 'auto', label: '알림에서 받기', right: '알림 목록', pad: 20 }, `<div style="width:340px">${Box({ title: '알림 3' }, KV([['10:21', `${Badge('엑셀 준비됨', 'check')}<br>주문 12,480행 · 기본 양식<br><u>내려받기</u> <small style="color:var(--mute)">11-12 10:21까지</small>`]]))}</div>`),
    ),
);

const state5 = StateBlock({ idx: 5, title: '결과 없음', note: '조건에 맞는 주문이 없을 때. 왜 없는지 짐작할 단서와 다음 행동을 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결과가 없으면 운영자는 조건이 좁았는지 정말 주문이 없는지 헷갈립니다. 걸린 조건을 그대로 보여 주고, 가장 흔한 원인(기간이 짧음 · 스마트스토어 주문이 아직 안 들어옴)을 한 번에 풀 수 있는 버튼을 둡니다. 주문이 한 건도 없는 새 몰은 문구가 다릅니다.'),
    Canvas({ label: 'A-10 · 검색 결과 없음 (조건이 걸려 있음)' }, Page(
        Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체 · 주문자 이름 "한지우"' }),
        ListHead({ total: 0, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm', disabled: true }), PerPage(50)] }),
        `<div class="wf-tablewrap">${Empty({ icon: 'search', title: '조건에 맞는 주문이 없습니다', desc: '주문일 최근 1개월 안에 주문자 이름이 "한지우"인 주문이 없습니다.<br>기간을 넓히거나, 받는 분 이름·연락처 뒷자리로 다시 찾아보세요.', action: [Btn('기간을 3개월로 넓혀 다시 검색', 'primary'), Btn('검색어 종류를 받는 분 이름으로 바꾸기'), Btn('조건 초기화', { icon: 'refresh' })] })}</div>`,
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '스마트스토어 주문번호로 찾았는데 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:600px">${Empty({ icon: 'naver-square', title: '주문번호 2026111145829999 를 찾지 못했습니다', desc: '스마트스토어 주문은 10분마다 가져옵니다. 마지막으로 가져온 시각 10:00.<br>방금 들어온 주문이면 지금 가져오기를 눌러 주세요.', action: [Btn('스마트스토어 주문 지금 가져오기', { kind: 'primary', icon: 'sync' })] })}</div>`),
        Canvas({ size: 'auto', label: '주문이 한 건도 없는 새 몰', right: '빈 상태만', pad: 20 }, `<div style="width:560px">${Empty({ icon: 'receipt', title: '아직 들어온 주문이 없습니다', desc: '첫 주문이 들어오면 이 목록에 나타나고, 설정 > 알림의 내부 수신자에게 알림이 갑니다.', action: [Btn('내 쇼핑몰 보기', { kind: 'primary', icon: 'external-link' })] })}</div>`),
    ),
);

const REASONS = ['택배 접수·출고', '회계·정산', '고객 응대', '세무 신고·증빙', '기타(직접 입력)'];
const reasonModal = (o = {}) => Modal({ title: '개인정보가 포함된 파일입니다', w: 560, foot: [Btn('취소'), Btn(o.btn || '사유 남기고 468건 내려받기', { kind: 'primary', icon: 'download', disabled: o.disabled })] },
    Note('이 양식에는 고객의 이름 · 연락처 · 주소가 들어 있습니다. 누가 언제 왜 받았는지 기록됩니다.', { warn: true }),
    KV([['양식', 'CJ대한통운 접수 양식 (9개 항목)'], ['개인정보 항목', '받는 분 · 받는 분 연락처 · 우편번호 · 주소'], ['대상', o.target || '검색 결과 전체 468건'], ['내려받는 사람', '이보림 (대표 운영자) · IP 211.***.***.45']], { wide: true }),
    '<div style="height:12px"></div>',
    FormTable([
        { k: '내려받는 사유', required: true, v: o.reason || Select({ value: '택배 접수·출고', w: 260 }), error: o.err },
        ...(o.direct !== undefined ? [{ k: '사유 직접 입력', required: true, v: Input({ value: o.direct, placeholder: '예: 11월 2주차 사은품 발송 대상 확인', w: 320, error: !!o.directErr }), error: o.directErr, help: o.directErr ? undefined : '5자 이상 100자까지. 작업 기록에 그대로 남습니다.' }] : []),
        { k: '파일 보관', v: Check('받은 파일은 업무가 끝나면 지우겠습니다', { on: o.agree !== false }), help: '체크해야 내려받을 수 있습니다.' },
    ]),
    Text('기록은 설정 > 운영자·권한의 작업 기록에 남고 대표 운영자가 볼 수 있습니다.', { sm: true, mute: true }),
);

const state6 = StateBlock({ idx: 6, title: '개인정보 포함 엑셀 다운로드 사유 입력 팝업', note: '개인정보 항목이 든 양식으로 내려받기를 누르면 한 번 더 뜨는 팝업. 사유를 고르거나 직접 적어야 파일이 내려옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '주문 엑셀 한 파일에 고객 수백 명의 이름·연락처·주소가 들어갑니다. 운영자가 여럿이면 파일이 어디로 나갔는지 추적할 수 있어야 하므로, 개인정보 항목(이름 · 연락처 · 이메일 · 주소 · 환불 계좌)이 하나라도 든 양식은 받을 때마다 사유를 남깁니다. 사유는 자주 쓰는 것을 목록에서 고르고, 없으면 직접 적습니다. 개인정보 항목이 없는 양식(상품·수량·금액만)은 이 팝업 없이 바로 내려옵니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '기록되는 것: 내려받은 사람 · 일시 · IP · 양식 · 대상 건수 · 검색 조건 · 사유. 설정 > 운영자·권한(A-96)의 작업 기록에 남고 지울 수 없습니다. 고객 정보 내려받기 권한이 없는 역할은 개인정보 포함 양식을 고를 수 없습니다. 같은 팝업을 회원 목록 엑셀에서도 씁니다. 사유 목록은 설정 > 운영자·권한에서 고칩니다.'),
    Canvas({ label: 'A-10 · 엑셀 내려받기 팝업에서 내려받기 → 사유 입력 팝업 (사유를 고른 모습)' }, Overlay({ bg: Page(Filters({ open: false, summary: '주문일 최근 1개월 · 상태 전체 · 채널 전체' }), Head(), List([], ROWS.slice(0, 6))), h: 680 }, reasonModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '처음 뜬 모습 · 사유 목록 열림 (고르기 전에는 버튼 비활성)', right: '팝업만', pad: 20 }, reasonModal({ reason: Select({ placeholder: '사유를 고르세요', w: 260, open: true, options: REASONS }), agree: false, disabled: true })),
        Canvas({ size: 'auto', label: '기타(직접 입력)를 고름 → 입력칸이 생김', right: '팝업만', pad: 20 }, reasonModal({ reason: Select({ value: '기타(직접 입력)', w: 260 }), direct: '11월 2주차 사은품 발송 대상 확인' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력 오류 (직접 입력이 너무 짧음)', right: '팝업만', pad: 20 }, reasonModal({ reason: Select({ value: '기타(직접 입력)', w: 260 }), direct: '확인', directErr: '사유를 5자 이상 적어 주세요. 나중에 기록을 볼 때 무슨 일로 받았는지 알 수 있어야 합니다.', disabled: true })),
        Canvas({ size: 'auto', label: '권한이 없는 운영자의 양식 목록 (개인정보 포함 양식은 고를 수 없음)', right: '부분', pad: 20 }, `<div style="width:380px;min-height:300px">${Select({ value: '사은품 포장 목록 (6개 항목)', w: 360, open: true, options: [{ t: '사은품 포장 목록', sub: '개인정보 없음', on: true }, { t: 'CJ대한통운 접수 양식', sub: '개인정보 포함 · 권한 없음', disabled: true }, { t: '기본 양식', sub: '개인정보 포함 · 권한 없음', disabled: true }] })}<p class="help">고객 정보 내려받기 권한은 대표 운영자가 설정 > 운영자·권한에서 줍니다.</p></div>`),
    ),
    Canvas({ size: 'auto', label: '내려받은 뒤 토스트', right: '토스트만', pad: 20 }, Toast('주문_20261111_CJ대한통운접수양식.xlsx (468행)을 내려받았습니다. 내려받은 기록을 남겼습니다.')),
    Canvas({ size: 'auto', label: '설정 > 운영자·권한의 작업 기록에 남는 모습 (A-96)', right: '기록 한 줄', pad: 20 }, `<div style="width:1000px">${Table({ dense: true, cols: [{ t: '일시', w: 120 }, { t: '운영자', w: 70 }, { t: '한 일', w: 150 }, '내용', { t: '사유', w: 130 }, { t: 'IP', w: 120 }], rows: [['11-11 10:21:05', '이보림', '주문 엑셀 내려받기', 'CJ대한통운 접수 양식 · 468건 · 조건: 주문일 최근 1개월 · 상태 전체 · 채널 전체', '택배 접수·출고', '211.***.***.45']] })}</div>`),
);

export default function A10() {
    return [state1, state2, state3, state4, state5, state6].join('');
}
