import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, ChannelBadge, Input, Select, Check, Radio, CheckGroup,
    FormTable, Filters, ListHead, Table, Tabs, Overlay, Modal, Toast, Box, Note, Text, Icon, Grid, Stats, BarChart, Empty,
} from '../lib/blocks.js';

const Cal = (title, from, to, last = 11) => {
    const cells = Array.from({ length: 30 }, (_, i) => i + 1);
    return `<div style="width:236px"><div style="display:flex;justify-content:space-between;font-weight:800;font-size:13px;margin-bottom:6px">${Icon('angle-left-min')}<span>${title}</span>${Icon('angle-right-min')}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px">${['일', '월', '화', '수', '목', '금', '토'].map((d) => `<span style="text-align:center;font-size:11px;color:var(--mute)">${d}</span>`).join('')}${cells.map((d) => { const on = d === from || d === to; const mid = d > from && d < to; const fut = d > last; return `<span style="height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;border-radius:3px;${on ? 'background:var(--dark);color:#fff;font-weight:800' : mid ? 'background:var(--fill)' : fut ? 'color:#b0b0b8;text-decoration:line-through' : ''}">${d}</span>`; }).join('')}</div></div>`;
};

const PeriodBar = (o = {}) => `<span class="wf-period">${['오늘', '어제', '7일', '이번 달', '지난달', '3개월', '직접 고르기'].map((p) => `<span class="wf-btn sm ${p === (o.preset || '7일') ? 'primary' : 'line'}">${p}</span>`).join('')}${Input({ value: o.from || '2026-11-05', icon: 'calendar', w: 140, focus: o.focus })}<span class="tilde">~</span>${Input({ value: o.to || '2026-11-11', icon: 'calendar', w: 140 })}</span>`;

const FRows = (o = {}) => [
    { k: '기간', v: PeriodBar(o) },
    { k: '기준', v: [Radio('결제일 기준', { on: true }), Radio('구매확정일 기준'), Text('결제일 기준 = 결제가 끝난 날의 매출, 취소·환불은 처리된 날에 뺍니다', { sm: true, mute: true })] },
    { k: '채널', v: CheckGroup(['자사몰', '스마트스토어'], o.ch || ['자사몰', '스마트스토어']) },
    { k: '결제수단', v: CheckGroup(['카드', '실시간 계좌이체', '가상계좌', '카카오페이', '네이버페이', '토스페이', '스마트스토어 결제'], ['카드', '실시간 계좌이체', '가상계좌', '카카오페이', '네이버페이', '토스페이', '스마트스토어 결제']) },
    { k: '비교', v: [Check('바로 앞 같은 기간과 비교 (10-29 ~ 11-04)', { on: true }), Check('작년 같은 기간과 비교')] },
];

const VIEW = [{ t: '날짜별' }, { t: '채널별' }, { t: '결제수단별' }];
const Page = (...body) => AdminLayout({ active: 'a-80', actions: [Btn('엑셀 내려받기', { icon: 'download' })] }, body);

const Sum = Stats([
    { k: '결제 금액', v: '6,842,000원', sub: '앞 기간보다 +12.4% · 주문 97건', icon: 'won', on: true },
    { k: '취소·환불', v: '-372,000원', sub: '6건 · 취소율 6.2%', icon: 'undo' },
    { k: '순매출', v: '6,470,000원', sub: '결제 금액 - 취소·환불', icon: 'chart-bar' },
    { k: '주문 1건당 평균', v: '70,500원', sub: '앞 기간 68,200원', icon: 'receipt' },
]);

const Chart = (title, values, labels, legend) => Box({ title, sub: legend, right: [`<span class="wf-btn sm primary">막대</span>`, `<span class="wf-btn sm line">선</span>`] },
    BarChart(values, labels),
    Text('그래프 자리 — 막대 = 그날 순매출, 마우스를 올리면 결제 금액·취소·주문 수가 말풍선으로 나옵니다. 앞 기간 비교를 켜면 옅은 막대가 옆에 겹쳐 나옵니다.', { sm: true, mute: true }),
);

const DAY_COLS = [{ t: '날짜', w: 110, sort: 'desc' }, { t: '주문 수', w: 76, align: 'right' }, { t: '결제 금액', w: 120, align: 'right' }, { t: '할인(쿠폰·적립금)', w: 130, align: 'right' }, { t: '배송비', w: 90, align: 'right' }, { t: '취소·환불', w: 110, align: 'right' }, { t: '순매출', w: 120, align: 'right' }, { t: '자사몰', w: 110, align: 'right' }, { t: '스마트스토어', w: 110, align: 'right' }];
const DAYS = [
    ['11-11(수) <small>10:30까지</small>', '9', '612,000원', '-18,000원', '6,000원', '0원', '<b>612,000원</b>', '421,000원', '191,000원'],
    ['11-10(화)', '16', '1,138,000원', '-42,000원', '9,000원', '-93,000원', '<b>1,045,000원</b>', '702,000원', '343,000원'],
    ['11-09(월)', '14', '987,000원', '-31,000원', '12,000원', '0원', '<b>987,000원</b>', '655,000원', '332,000원'],
    ['11-08(일)', '11', '764,000원', '-22,000원', '6,000원', '-49,000원', '<b>715,000원</b>', '480,000원', '235,000원'],
    ['11-07(토)', '13', '905,000원', '-27,000원', '9,000원', '0원', '<b>905,000원</b>', '611,000원', '294,000원'],
    ['11-06(금)', '18', '1,296,000원', '-51,000원', '15,000원', '-176,000원', '<b>1,120,000원</b>', '748,000원', '372,000원'],
    ['11-05(목)', '16', '1,140,000원', '-39,000원', '12,000원', '-54,000원', '<b>1,086,000원</b>', '731,000원', '355,000원'],
];
const DAY_FOOT = ['합계', '97', '6,842,000원', '-230,000원', '69,000원', '-372,000원', '6,470,000원', '4,348,000원', '2,122,000원'];
const NOTE = Note('금액은 예시 값입니다(판매가 미확정). 결제 금액 = 상품 금액 - 할인 + 배송비. 날짜를 누르면 그날 주문 목록(주문 > 전체 주문 조회)이 같은 조건으로 열립니다.');

const state1 = StateBlock({ idx: 1, title: '기간·채널·결제수단별', note: '기간을 고르면 위에 요약 카드, 가운데 그래프, 아래 표가 나옵니다. 표는 날짜별·채널별·결제수단별 세 가지 보기로 바꿉니다.' },
    Anno({ title: '왜 이렇게 하나' }, '사장님이 매일 묻는 것은 오늘 얼마 팔았나, 어디서(자사몰·스마트스토어) 더 팔리나, 지난주보다 늘었나입니다. 그래서 결제 금액과 취소·환불을 나눠 순매출을 보여 주고, 바로 앞 같은 기간과의 차이를 숫자로 붙입니다. 결제수단별 보기는 결제 대행사 정산 금액과 맞춰 볼 때 씁니다.'),
    Anno({ warn: true, title: '초기값 · 기능을 껐을 때' }, '초기값: 최근 7일 · 결제일 기준 · 채널 전체 · 결제수단 전체 · 앞 기간 비교 켬 · 날짜별 보기. 기간은 한 번에 최대 1년까지. 스마트스토어 기능을 끈 몰은 채널 조건·채널별 보기·표의 채널 칸이 없습니다. 스마트스토어 주문 금액은 네이버 결제 금액 기준이며 네이버 수수료는 빼지 않은 값입니다(표 아래에 적음).'),
    Canvas({ label: 'A-80 · 최근 7일 · 날짜별 보기' }, Page(
        Filters({ rows: FRows() }),
        Sum,
        '<div style="height:16px"></div>',
        Chart('날짜별 순매출', [1086, 1120, 905, 715, 987, 1045, 612], ['11-05', '11-06', '11-07', '11-08', '11-09', '11-10', '11-11'], '단위 천 원 · 최근 7일'),
        Tabs(VIEW, '날짜별'),
        ListHead({ total: 7, left: Text('일 단위', { sm: true, mute: true }), right: [Select({ value: '일 단위', w: 110 }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' })] }),
        Table({ cols: DAY_COLS, rows: DAYS, foot: DAY_FOOT }),
        NOTE,
    )),
    Canvas({ label: 'A-80 · 채널별 보기' }, Page(
        Filters({ open: false, summary: '기간 11-05 ~ 11-11 (최근 7일) · 결제일 기준 · 채널 전체 · 결제수단 전체' }),
        Grid('1fr 1fr',
            Chart('채널별 순매출', [4348, 2122], ['자사몰', '스마트스토어'], '단위 천 원'),
            Box({ title: '채널 비중' }, `<div style="display:flex;height:36px;border-radius:4px;overflow:hidden;border:1px solid var(--line);font-size:12.5px;font-weight:700"><span style="width:67%;background:var(--dark);color:#fff;display:flex;align-items:center;justify-content:center">자사몰 67%</span><span style="flex:1;background:var(--fill);display:flex;align-items:center;justify-content:center">스마트스토어 33%</span></div>`, Text('앞 기간 자사몰 62% · 스마트스토어 38%', { sm: true, mute: true })),
        ),
        Tabs(VIEW, '채널별'),
        Table({ cols: [{ t: '채널', w: 140 }, { t: '주문 수', w: 80, align: 'right' }, { t: '결제 금액', w: 130, align: 'right' }, { t: '취소·환불', w: 120, align: 'right' }, { t: '순매출', w: 130, align: 'right' }, { t: '비중', w: 70, align: 'right' }, { t: '주문 1건당 평균', w: 120, align: 'right' }, { t: '앞 기간 대비', w: 100, align: 'right' }], rows: [
            [ChannelBadge('자사몰'), '61', '4,627,000원', '-279,000원', '<b>4,348,000원</b>', '67%', '75,900원', '+18.2%'],
            [ChannelBadge('스마트스토어'), '36', '2,215,000원', '-93,000원', '<b>2,122,000원</b>', '33%', '61,500원', '+2.1%'],
        ], foot: ['합계', '97', '6,842,000원', '-372,000원', '6,470,000원', '100%', '70,500원', '+12.4%'] }),
        Note('스마트스토어 금액은 네이버 결제 금액이며 네이버 수수료를 빼기 전 값입니다. 실제 정산 금액은 스마트스토어 판매자센터 정산 내역에서 확인하세요.'),
    )),
    Canvas({ label: 'A-80 · 결제수단별 보기' }, Page(
        Filters({ open: false, summary: '기간 11-05 ~ 11-11 (최근 7일) · 결제일 기준 · 채널 전체 · 결제수단 전체' }),
        Tabs(VIEW, '결제수단별'),
        Table({ cols: [{ t: '결제수단', w: 170 }, { t: '주문 수', w: 80, align: 'right' }, { t: '결제 금액', w: 130, align: 'right' }, { t: '취소·환불', w: 120, align: 'right' }, { t: '순매출', w: 130, align: 'right' }, { t: '비중', w: 70, align: 'right' }, '비고'], rows: [
            ['카드', '28', '2,105,000원', '-176,000원', '<b>1,929,000원</b>', '30%', ''],
            ['카카오페이', '14', '1,012,000원', '-54,000원', '<b>958,000원</b>', '15%', ''],
            ['네이버페이', '9', '688,000원', '-49,000원', '<b>639,000원</b>', '10%', '<small>자사몰에서 네이버페이로 결제한 주문</small>'],
            ['토스페이', '5', '391,000원', '0원', '<b>391,000원</b>', '6%', ''],
            ['가상계좌', '4', '333,000원', '0원', '<b>333,000원</b>', '5%', '<small>입금 확인된 주문만 · 입금 대기 2건 196,000원 제외</small>'],
            ['실시간 계좌이체', '1', '98,000원', '0원', '<b>98,000원</b>', '2%', ''],
            ['스마트스토어 결제', '36', '2,215,000원', '-93,000원', '<b>2,122,000원</b>', '33%', '<small>네이버가 결제를 받아 정산해 주는 주문</small>'],
        ], foot: ['합계', '97', '6,842,000원', '-372,000원', '6,470,000원', '100%', ''] }),
        Note('설정 > 결제에서 끈 결제수단은 조건과 표에서 빠집니다(과거 매출이 있으면 흐리게 남음). 금액은 예시 값입니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '직접 고르기 → 시작일 칸을 누름 → 달력 (지난 날짜만 고를 수 있음)', right: '조건만', pad: 20 }, `<div style="width:800px">${PeriodBar({ preset: '직접 고르기', from: '2026-11-02', to: '2026-11-08', focus: true })}<div style="display:flex;gap:20px;border:1px solid var(--dark);border-radius:4px;padding:14px;margin-top:4px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.12);width:fit-content">${Cal('2026년 10월', 99, 99, 31)}${Cal('2026년 11월', 2, 8)}</div><p style="font-size:11.5px;color:var(--mute);margin:8px 0 0">검은 칸 = 시작일·종료일 · 회색 = 기간 안 · 취소선 = 아직 오지 않은 날(고를 수 없음) · 최대 1년</p></div>`),
        Canvas({ size: 'auto', label: '표 단위를 누름', right: '입력칸만', pad: 20 }, `<div style="width:160px;min-height:190px">${Select({ value: '일 단위', w: 110, open: true, options: [{ t: '일 단위', on: true }, '주 단위', '월 단위', '시간대별'] })}</div>`),
    ),
    Canvas({ label: 'A-80 · 고른 기간에 매출이 없을 때' }, Page(
        Filters({ open: false, summary: '기간 10-01 ~ 10-07 · 결제일 기준 · 채널 스마트스토어' }),
        Empty({ icon: 'chart-bar', title: '이 기간에는 매출이 없습니다', desc: '10-01 ~ 10-07 · 스마트스토어 조건으로 찾았습니다. 스마트스토어는 2026-10-29에 연결했습니다.', action: [Btn('최근 7일로 보기', 'primary'), Btn('조건 초기화')] }),
    )),
    Canvas({ size: 'auto', label: '스마트스토어 기능을 끈 몰 — 채널 조건·채널별 보기·채널 칸 없음', right: '표만', pad: 20 }, `<div style="width:860px">${Tabs([{ t: '날짜별' }, { t: '결제수단별' }], '날짜별')}${Table({ cols: DAY_COLS.slice(0, 7), rows: DAYS.slice(0, 3).map((r) => r.slice(0, 7)) })}</div>`),
);

const state2 = StateBlock({ idx: 2, title: '엑셀', note: '지금 보고 있는 조건 그대로 엑셀로 내려받습니다. 요약표만 받을지, 주문 한 건 한 건까지 받을지 고릅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '월말에 세무사에게 보내거나 결제 대행사 정산 내역과 맞춰 볼 때는 화면 숫자가 아니라 주문별 내역이 필요합니다. 요약표(화면과 같은 표)와 주문별 내역(한 줄 = 주문 품목 하나)을 고를 수 있게 하고, 개인정보가 들어가는 내역은 받은 사람과 사유를 기록합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '주문별 내역에는 주문자 이름·연락처가 들어가므로 개인정보 내려받기 권한이 있는 운영자만 받을 수 있고, 설정 > 운영자·권한의 작업 기록에 남습니다. 행이 많으면(1만 행 이상) 바로 받지 않고 만들어지면 알림으로 알려 줍니다. 파일 형식 XLSX.'),
    Canvas({ label: 'A-80 · 엑셀 내려받기 버튼 → 팝업' }, Overlay({ bg: Page(Filters({ open: false, summary: '기간 11-05 ~ 11-11 (최근 7일) · 결제일 기준' }), Sum), h: 600 },
        Modal({ title: '매출 엑셀 내려받기', w: 600, foot: [Btn('취소'), Btn('내려받기', { kind: 'primary', icon: 'download' })] },
            FormTable([
                { k: '조건', v: Text('11-05 ~ 11-11 · 결제일 기준 · 채널 전체 · 결제수단 전체', { sm: true }) },
                { k: '받을 내용', required: true, v: `<div style="display:flex;flex-direction:column;gap:8px">${Radio('요약표 — 날짜별 · 채널별 · 결제수단별 (시트 3개)')}${Radio('주문별 내역 — 한 줄 = 주문 품목 하나 (약 112행)', { on: true })}${Radio('둘 다')}</div>` },
                { k: '주문별 내역 항목', v: CheckGroup(['주문번호·결제일', '채널·결제수단', '상품·옵션·수량', '상품 금액·할인·배송비', '취소·환불 금액', '주문자 이름·연락처'], ['주문번호·결제일', '채널·결제수단', '상품·옵션·수량', '상품 금액·할인·배송비', '취소·환불 금액']), help: '주문자 이름·연락처를 넣으면 내려받는 사유를 적어야 합니다.' },
                { k: '파일 이름', v: Input({ value: '매출_20261105-20261111.xlsx', w: 300 }) },
            ]),
            Note('내려받은 기록은 설정 > 운영자·권한 > 작업 기록에 남습니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '주문자 이름·연락처를 체크함 → 사유 칸이 생김 · 비운 채 내려받기 → 오류', right: '팝업 일부', pad: 20 }, `<div style="width:560px">${FormTable([
            { k: '주문별 내역 항목', v: CheckGroup(['주문번호·결제일', '상품·옵션·수량', '주문자 이름·연락처'], ['주문번호·결제일', '상품·옵션·수량', '주문자 이름·연락처']) },
            { k: '내려받는 사유', required: true, v: Input({ placeholder: '예) 11월 1주 세무 자료 전달', w: 340, error: true }), error: '개인정보가 들어간 파일은 사유를 적어야 내려받을 수 있습니다.' },
        ])}</div>`),
        Canvas({ size: 'auto', label: '개인정보 내려받기 권한이 없는 운영자', right: '팝업 일부', pad: 20 }, `<div style="width:460px">${Note('주문자 이름·연락처 항목은 개인정보 내려받기 권한이 있는 운영자만 고를 수 있습니다. 권한은 대표 운영자(이보림)에게 요청하세요.', { warn: true })}${Check('주문자 이름·연락처', { disabled: true })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '내려받기 완료', right: '안내만', pad: 20 }, Toast('매출_20261105-20261111.xlsx 를 내려받았습니다. (주문별 내역 112행)')),
        Canvas({ size: 'auto', label: '행이 많을 때 (1년 치 주문별 내역)', right: '안내만', pad: 20 }, Toast('행이 많아 파일을 만드는 중입니다(약 14,200행). 다 되면 오른쪽 위 알림에서 받을 수 있습니다.', { icon: 'bell-o', action: '알림 열기' })),
        Canvas({ size: 'auto', label: '오른쪽 위 알림을 엶 → 다 만들어진 파일', right: '알림 목록', pad: 20 }, `<div style="width:340px;border:1px solid var(--line);border-radius:6px;background:#fff"><div style="padding:10px 14px;border-bottom:1px solid var(--line2);font-weight:800;font-size:13.5px">알림</div><div style="padding:12px 14px;font-size:13px;display:flex;gap:10px;align-items:flex-start">${Icon('file-download-o')}<div><b>매출 엑셀이 준비됐습니다</b><div style="color:var(--mute);font-size:12px">매출_20251112-20261111.xlsx · 14,203행 · 7일 뒤 지워짐</div><div style="margin-top:6px">${Btn('내려받기', { size: 'sm', kind: 'primary', icon: 'download' })}</div></div></div></div>`),
    ),
);

const NET_STATS = [
    { k: '결제 금액', v: '27,418,000원', sub: '전 기간보다 +14.2%', icon: 'won' },
    { k: '주문 건수', v: '389건', sub: '전 기간 342건', icon: 'receipt' },
    { k: '환불 금액', v: '-1,612,000원', sub: '24건 · 전 기간 -1,105,000원', icon: 'undo' },
    { k: '순매출 (결제 − 환불)', v: '25,806,000원', sub: '전 기간보다 +12.7%', icon: 'chart-bar', on: true },
];
const NET_STATS2 = (o = {}) => [
    { k: '객단가', v: '70,500원', sub: '결제 금액 ÷ 주문 건수', icon: 'user-o' },
    o.noCoupon ? null : { k: '쿠폰 할인', v: '-684,000원', sub: '쿠폰 사용 주문 96건', icon: 'coupon' },
    o.noPoint ? null : { k: '적립금 사용', v: '-231,000원', sub: '적립금 사용 주문 58건', icon: 'wallet' },
    { k: '배송비', v: '276,000원', sub: '고객이 낸 배송비', icon: 'truck' },
].filter(Boolean);
const BASIS = `<div style="display:flex;gap:8px;align-items:flex-start;border:1px solid var(--line);background:var(--box);border-radius:4px;padding:10px 14px;margin:0 0 12px;font-size:12.5px;color:var(--ink2)">${Icon('info-o')}<div><b style="color:var(--ink)">집계 기준</b> 결제 금액은 결제완료 일자, 환불은 환불 완료 일자 기준입니다. 어제까지는 새벽에 확정되고 오늘은 실시간 값입니다.<br>결제 금액은 고객이 실제로 낸 돈입니다(쿠폰 할인·적립금 사용은 이미 빠져 있고 참고로 보여 줍니다). 스마트스토어 주문은 네이버 결제 금액이며 환불도 네이버가 처리한 금액입니다.</div></div>`;
const NET_COLS = [{ t: '기간', w: 150, sort: 'desc' }, { t: '결제 건수', w: 70, align: 'right' }, { t: '결제 금액', w: 110, align: 'right' }, { t: '환불 건수', w: 70, align: 'right' }, { t: '환불 금액', w: 100, align: 'right' }, { t: '순매출', w: 110, align: 'right' }, { t: '배송비', w: 80, align: 'right' }, { t: '쿠폰 할인', w: 90, align: 'right' }, { t: '적립금 사용', w: 90, align: 'right' }];
const NET_ROWS = [
    ['11-09 ~ 11-11 <small>오늘 10:30까지 · 실시간</small>', '39', '2,737,000원', '2', '-93,000원', '<b>2,644,000원</b>', '27,000원', '-71,000원', '-22,000원'],
    ['11-02 ~ 11-08', '104', '7,331,000원', '<u>7</u>', '<u>-470,000원</u>', '<b>6,861,000원</b>', '75,000원', '-188,000원', '-61,000원'],
    ['10-26 ~ 11-01', '97', '6,842,000원', '<u>6</u>', '<u>-372,000원</u>', '<b>6,470,000원</b>', '69,000원', '-171,000원', '-58,000원'],
    ['10-19 ~ 10-25', '82', '5,774,000원', '<u>5</u>', '<u>-382,000원</u>', '<b>5,392,000원</b>', '57,000원', '-139,000원', '-49,000원'],
    ['10-13 ~ 10-18', '67', '4,734,000원', '<u>4</u>', '<u>-295,000원</u>', '<b>4,439,000원</b>', '48,000원', '-115,000원', '-41,000원'],
];
const NET_FOOT = ['합계', '389', '27,418,000원', '24', '-1,612,000원', '25,806,000원', '276,000원', '-684,000원', '-231,000원'];

const state3 = StateBlock({ idx: 3, title: '순매출 요약(환불·쿠폰 할인·적립금 사용 열)과 집계 기준 안내', note: '요약 카드에 환불 금액과 순매출(결제 − 환불), 객단가, 쿠폰 할인, 적립금 사용을 함께 보여 주고, 표 위에 무엇을 어느 날짜 기준으로 셌는지 항상 적어 둡니다.' },
    Anno({ title: '왜 이렇게 하나' }, '결제 금액만 보면 많이 판 것 같지만 환불을 빼야 실제 매출입니다. 또 쿠폰과 적립금으로 얼마를 깎아 줬는지 알아야 행사 효과를 판단합니다. 숫자가 결제 대행사 정산 내역이나 세무 자료와 다르다는 문의는 대부분 집계 기준(결제일인지 환불일인지, 오늘 값이 확정인지)을 몰라서 생기므로 기준을 표 위에 고정으로 적습니다.'),
    Anno({ warn: true, title: '초기값 · 기능을 껐을 때' }, '초기값: 최근 30일 · 일 단위 · 채널 전체. 지난달에 결제하고 이번 달에 환불한 주문은 결제 금액은 지난달, 환불 금액은 이번 달에 잡힙니다. 오늘 줄은 실시간이라 새로 고칠 때마다 바뀌고, 어제까지는 새벽에 확정됩니다. 쿠폰·적립금 기능을 끈 몰은 그 카드와 열이 없습니다. 금액은 예시 값입니다.'),
    Canvas({ label: 'A-80 · 최근 30일 · 주 단위로 본 순매출 요약 · 집계 기준 안내 고정' }, Page(
        Filters({ open: false, summary: '기간 10-13 ~ 11-11 (최근 30일) · 주 단위 · 채널 전체 · 결제수단 전체' }),
        Stats(NET_STATS),
        '<div style="height:12px"></div>',
        Stats(NET_STATS2()),
        '<div style="height:16px"></div>',
        BASIS,
        Tabs(VIEW, '날짜별'),
        ListHead({ total: 5, right: [Select({ value: '주 단위', w: 110 }), Btn('엑셀 내려받기', { icon: 'download', size: 'sm' })] }),
        Table({ cols: NET_COLS, rows: NET_ROWS, foot: NET_FOOT }),
        Note('순매출 = 결제 금액 − 환불 금액. 환불 건수·금액을 누르면 그 기간에 환불 완료된 취소·반품 목록이 열립니다.'),
    )),
    Canvas({ size: 'auto', label: '쿠폰·적립금 기능을 끈 몰 — 카드와 열이 없음', right: '요약·표', pad: 20 }, `<div style="width:900px">${Stats(NET_STATS2({ noCoupon: true, noPoint: true }))}<div style="height:12px"></div>${Table({ cols: NET_COLS.slice(0, 7), rows: NET_ROWS.slice(0, 2).map((r) => r.slice(0, 7)) })}</div>`),
    CanvasRow(
        Canvas({ size: 'auto', label: '환불 금액(7건)을 누름 → 그 기간에 환불 완료된 건', right: '팝업만', pad: 20 }, Modal({ title: '환불 완료 7건 · 11-02 ~ 11-08', w: 680, foot: [Btn('취소 관리에서 보기'), Btn('닫기', 'primary')] },
            Table({ dense: true, cols: [{ t: '환불 완료일', w: 86 }, { t: '주문번호 · 결제일', w: 180 }, { t: '구분', w: 50 }, '상품 · 구성', { t: '환불 금액', w: 96, align: 'right' }], rows: [
                ['11-08', '<u>20261106-000091</u><small>결제 11-06</small>', '취소', '롱지비티 석류맛 젤리스틱<small>4박스(56일분)</small>', '-176,000원'],
                ['11-06', '<u>20261029-000052</u><small>결제 10-29 · 지난 기간 결제</small>', '반품', '롱지비티 석류맛 젤리스틱<small>2박스(28일분) · 반품 배송비 6,000원 차감</small>', '-87,000원'],
                ['11-05', '<u>2026110342550631</u><small>결제 11-03 · 스마트스토어</small>', '취소', '롱지비티 석류맛 젤리스틱<small>1박스(14일분) · 네이버가 환불</small>', '-49,000원'],
            ] }),
            Note('앞 3건만 보여 줍니다. 결제일이 이 기간 밖인 환불도 환불 완료일 기준으로 여기에 잡힙니다.'),
        )),
        Canvas({ size: 'auto', label: '오늘만 볼 때 — 실시간 값 표시', right: '요약만', pad: 20 }, `<div style="width:380px">${Stats([{ k: '순매출 (결제 − 환불)', v: '612,000원', sub: '오늘 10:30 기준 · 실시간(새벽에 확정)', icon: 'chart-bar', on: true }])}<div style="height:8px"></div>${Btn('새로 고침', { size: 'sm', icon: 'refresh' })}</div>`),
    ),
);

export default function A80() {
    return [state1, state2, state3].join('');
}
