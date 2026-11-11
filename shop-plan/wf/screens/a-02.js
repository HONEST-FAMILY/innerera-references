import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Table, Tabs, Box, KV, Note, Text, Icon, Flex, Grid,
    Stat, BarChart, H, Empty, Select, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };

const TODO = [
    { k: '신규 주문', v: '38', sub: '자사몰 24 · 스마트스토어 14', link: '발주 확인으로', icon: 'receipt', on: true, to: '/admin/orders/dispatch?tab=new', cond: '상태 결제완료 · 발주확인 전' },
    { k: '발송 기한 임박', v: '6', sub: '내일까지 4 · 오늘까지 2', link: '기한 임박만 보기', icon: 'alarm-o', on: true, to: '/admin/orders/dispatch?tab=new&due=soon', cond: '발송 기한이 오늘·내일인 미발송 주문' },
    { k: '취소 요청', v: '2', sub: '가장 오래된 요청 11-10 16:20', link: '취소 관리로', icon: 'close', to: '/admin/claims/cancel?tab=request', cond: '취소 요청 · 승인/거부 전' },
    { k: '반품 요청', v: '1', sub: '검수 대기 2건 따로', link: '반품 관리로', icon: 'undo', to: '/admin/claims/return?tab=request', cond: '반품 요청 · 수거 지시 전' },
    { k: '교환 요청', v: '1', sub: '재발송 대기 1건 따로', link: '교환 관리로', icon: 'exchange', to: '/admin/claims/exchange?tab=request', cond: '교환 요청 · 수거 지시 전' },
    { k: '미답변 문의', v: '4', sub: '1:1 문의 3 · 상품 문의 1', link: '문의 답변으로', icon: 'message-o', to: '/admin/cs/inquiries?answered=no', cond: '답변대기 (1:1 문의 먼저, 상품 문의는 탭)' },
    { k: '품절 임박', v: '1', sub: '4박스(56일분) 재고 8개', link: '재고 관리로', icon: 'box', to: '/admin/products/stock?filter=low', cond: '재고가 안전재고 이하인 품목' },
];

const todoZero = TODO.map((t) => ({ ...t, v: '0', sub: '처리할 건이 없습니다', on: false, link: t.link }));

const Cards = (list, cols = 4) => Grid(cols, list.map((t) => Stat(t)));

const SalesCard = (k, total, cnt, own, ss, diff, split = true) => `
<div class="wf-stat">
  <span class="k">${k}</span><b>${total}</b><span class="s">주문 ${cnt}건${diff ? ` · ${diff}` : ''}</span>
  ${split ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line2);display:grid;grid-template-columns:1fr auto;gap:4px 10px;font-size:12.5px">
    <span>${ChannelBadge('자사몰')}</span><span style="font-weight:700">${own}</span>
    <span>${ChannelBadge('스마트스토어')}</span><span style="font-weight:700">${ss}</span>
  </div>` : ''}
</div>`;

const Sales = (split = true) => [
    H('매출 요약', { sub: '결제완료 기준 · 취소·반품 환불액을 뺀 금액 · 2026-11-11 10:05 기준', right: [Btn('새로 고침', { size: 'sm', icon: 'refresh' }), Btn('매출 통계 자세히', 'ghost')] }),
    Grid(3,
        SalesCard('오늘 (11-11 수)', '2,418,000원', 31, '1,539,000원 · 19건', '879,000원 · 12건', '어제 같은 시각보다 12% 많음', split),
        SalesCard('어제 (11-10 화)', '5,842,000원', 74, '3,611,000원 · 45건', '2,231,000원 · 29건', '그제보다 4% 적음', split),
        SalesCard('최근 7일 (11-05 ~ 11-11)', '36,905,000원', 468, '22,870,000원 · 287건', '14,035,000원 · 181건', '직전 7일보다 9% 많음', split),
    ),
];

const Chart = (split = true) => Box({ title: '최근 7일 매출', sub: split ? '막대 = 자사몰 + 스마트스토어 합계' : '막대 = 하루 매출', right: split ? Tabs(['전체', '자사몰', '스마트스토어'], '전체', { kind: 'pill' }) : '' },
    BarChart([498, 512, 455, 601, 583, 584, 242], ['11-05 목', '11-06 금', '11-07 토', '11-08 일', '11-09 월', '11-10 화', '11-11 수(진행 중)']),
    Text('단위 만 원. 가장 많이 판 날 11-08(일) 6,010,000원 · 하루 평균 5,272,000원. 막대에 마우스를 올리면 그날 금액과 주문 건수가 뜹니다.', { sm: true, mute: true }),
);

const RECENT = [
    ['20261111-000128', '11-11 09:42', '자사몰', O2, 1, '김민지', '93,000원', '신용카드', '결제완료'],
    ['2026111145821371', '11-11 09:31', '스마트스토어', O1, 2, '박서준', '98,000원', '네이버페이', '결제완료'],
    ['20261111-000127', '11-11 09:18', '자사몰', O4, 1, '이하은', '176,000원', '카카오페이', '결제완료'],
    ['20261111-000126', '11-11 08:55', '자사몰', O1, 1, '최도윤', '52,000원', '가상계좌', '입금대기'],
    ['2026111045790022', '11-10 22:14', '스마트스토어', O2, 1, '정수아', '93,000원', '네이버페이', '배송준비'],
];

const Recent = (rows = RECENT, split = true) => Box({ title: '최근 주문 5건', sub: '주문번호를 누르면 주문 상세가 오른쪽에서 열립니다', right: Btn('전체 주문 보기', 'ghost') },
    Table({ dense: true, cols: [{ t: '주문번호 · 주문일시', w: 160 }, ...(split ? [{ t: '채널', w: 104 }] : []), '상품 · 구성', { t: '수량', w: 44, align: 'center' }, { t: '주문자', w: 70 }, { t: '결제금액', w: 90, align: 'right' }, { t: '결제수단', w: 80 }, { t: '상태', w: 80 }],
        rows: rows.map((r) => [`<u>${r[0]}</u><small>${r[1]}</small>`, ...(split ? [ChannelBadge(r[2])] : []), `${P}<small>${r[3]}</small>`, r[4], r[5], r[6], r[7], OrderBadge(r[8])]),
        empty: '아직 들어온 주문이 없습니다.' }),
);

const Side = () => Grid(2,
    Box({ title: '알림', sub: '자동으로 처리된 일 · 오늘' },
        KV([
            ['09:10', `${Badge('전송 실패', 'warn')} 스마트스토어 발송 전송 1건 실패 <u>다시 보내기</u>`],
            ['09:00', '입금 기한이 지난 주문 2건을 자동 취소했습니다'],
            ['06:00', '배송완료 7일이 지난 주문 41건을 자동 구매확정했습니다'],
            ['00:10', '스마트스토어 주문 3건을 새로 가져왔습니다'],
        ]),
    ),
    Box({ title: '연결 상태', sub: '끊기면 주문·결제·알림이 멈춥니다', right: Btn('설정으로', 'ghost') },
        KV([
            ['결제 연결', `${Badge('정상', 'check')} 마지막 결제 09:42`],
            ['스마트스토어', `${Badge('정상', 'check')} 마지막 수집 10:00 (10분마다)`],
            ['택배 조회', `${Badge('정상', 'check')} 마지막 조회 09:30`],
            ['알림톡', `${Badge('잔액 부족 임박', 'warn')} 남은 발송 약 180건`],
        ]),
    ),
);

const Greeting = (text) => `<div style="display:flex;align-items:center;gap:10px;margin:0 0 12px;font-size:13.5px;color:var(--ink2)">${Icon('calendar')}<b style="color:var(--ink)">2026-11-11 (수) 10:05</b><span>${text}</span></div>`;

const Page = (...body) => AdminLayout({ active: 'a-02', counts: COUNTS, desc: '숫자를 누르면 그 조건이 걸린 목록으로 바로 갑니다.' }, body);

const routeTable = Table({ dense: true, cols: [{ t: '카드', w: 170 }, { t: '세는 기준', w: 330 }, '누르면 가는 곳 (조건이 걸린 채로 열림)', { t: '안 보이는 경우', w: 200 }],
    rows: TODO.map((t) => [`<b>${t.k}</b>`, t.cond, `<code style="font-size:12px">${t.to}</code>`,
        t.k === '스마트스토어 전송 실패' ? '스마트스토어 연동을 끈 몰' : t.k === '교환 요청' ? '교환을 받지 않는 몰(정책에서 끔)' : t.k === '미답변 문의' ? '상품 문의를 끈 몰은 1:1 문의만 셈' : '항상 보임']) });

const state1 = StateBlock({ idx: 1, title: '오늘 할 일 카드(신규주문·발송 지연 위험·취소/반품/교환 요청·미답변 문의·품절 임박, 누르면 그 조건으로 걸러진 목록)', note: '로그인하면 처음 보는 화면. 맨 위가 오늘 할 일, 그 아래 매출 요약과 최근 주문이 이어집니다.' },
    Anno({ title: '왜 이렇게 하나' }, '출근한 운영자가 묻는 것은 하나입니다. 지금 무엇부터 해야 하나. 그래서 매출보다 할 일을 위에 두고, 카드마다 건수와 채널 구분을 적고, 누르면 그 조건이 이미 걸린 목록이 열립니다. 급한 일(신규 주문 · 발송 기한 임박)은 굵은 테두리로 먼저 보이게 합니다. 숫자는 화면을 열 때와 1분마다 다시 셉니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '카드 숫자와 왼쪽 메뉴 숫자, 이동한 목록의 총 건수는 같은 기준으로 세어 항상 같아야 합니다. 꺼 둔 기능의 카드는 자리째 사라집니다(교환을 받지 않는 몰은 교환 요청 카드가 없고, 스마트스토어 연동을 끄면 채널 구분이 없어짐). 자동 처리가 실패한 일은 따로 실패 카드로 올라옵니다(상태 4). 운영자 권한에 없는 메뉴의 카드는 숫자 대신 보이지 않습니다.'),
    Canvas({ label: 'A-02 · 대시보드 전체 (오늘 할 일 → 매출 요약 → 최근 주문 → 알림·연결 상태)' }, Page(
        Greeting('이보림 님, 오늘 처리할 일이 <b>53건</b> 있습니다.'),
        H('오늘 할 일', { sub: '굵은 테두리 = 오늘 안에 끝내야 하는 일' }),
        Cards(TODO),
        Sales(), Chart(), Recent(), Side(),
    )),
    Canvas({ size: 'auto', label: '카드별 세는 기준과 이동 주소', right: '기준 표', pad: 20 }, `<div style="width:1180px">${routeTable}</div>`),
    CanvasRow(
        Canvas({ size: 'auto', label: '카드 한 장의 모습 4가지', right: '부분', pad: 20 }, `<div style="width:760px">${Grid(4,
            Stat({ ...TODO[1] }),
            Stat({ ...TODO[2] }),
            Stat({ ...TODO[2], v: '0', sub: '처리할 건이 없습니다' }),
            Stat({ k: '발송 기한 임박', v: '2', sub: `${Badge('기한 지남 2', 'warn')}`, link: '기한 지난 주문 보기', icon: 'alarm-o', on: true }),
        )}${Text('왼쪽부터: 급한 일(굵은 테두리) · 보통 · 0건(숫자 0, 눌러도 빈 목록으로 감) · 기한이 이미 지난 건이 있을 때(경고 표시)', { sm: true, mute: true })}</div>`),
        Canvas({ size: 'mobile', label: 'A-02 · 모바일 (사장님 폰 확인용 · 왼쪽 메뉴는 서랍으로 접힘)' },
            `<div style="background:#f5f5f7;min-height:720px">
              <div style="display:flex;align-items:center;gap:12px;height:52px;padding:0 16px;background:#fff;border-bottom:1px solid var(--line);font-size:20px">${Icon('bars')}<b style="font-size:15px">Inner:Era 관리자</b><span style="margin-left:auto;font-size:13px;display:inline-flex;align-items:center;gap:4px">${Icon('bell-o')}3</span></div>
              <div style="padding:16px">
                <div style="font-size:12.5px;color:var(--ink2);margin-bottom:10px">2026-11-11 (수) 10:05 · 처리할 일 <b>53건</b></div>
                ${Grid(2, TODO.slice(0, 8).map((t) => Stat({ ...t, sub: undefined, link: undefined })))}
                <div style="height:14px"></div>
                ${SalesCard('오늘 (11-11 수)', '2,418,000원', 31, '1,539,000원', '879,000원', '')}
                <div style="height:10px"></div>
                ${Grid(2, Stat({ k: '어제', v: '<span style="font-size:17px">5,842,000원</span>', sub: '74건' }), Stat({ k: '최근 7일', v: '<span style="font-size:17px">36,905,000원</span>', sub: '468건' }))}
                ${H('최근 주문', { right: Btn('전체', 'ghost') })}
                ${RECENT.slice(0, 3).map((r) => `<div style="background:#fff;border:1px solid var(--line);border-radius:6px;padding:12px;margin-bottom:8px;font-size:13px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">${ChannelBadge(r[2])}${OrderBadge(r[8])}</div><b>${r[5]}</b> · ${r[3]} ${r[4]}개<div style="display:flex;justify-content:space-between;color:var(--mute);font-size:12px;margin-top:2px"><span>${r[0]} · ${r[1]}</span><b style="color:var(--ink)">${r[6]}</b></div></div>`).join('')}
                ${Note('모바일에서는 주문 확인과 문의 답변만 할 수 있습니다. 송장 엑셀 등록·상품 수정은 PC에서 하세요.')}
              </div>
            </div>`),
    ),
);

const state2 = StateBlock({ idx: 2, title: '매출 요약(오늘·어제·7일·채널별)', note: '대시보드 가운데 영역. 오늘·어제·최근 7일을 나란히 놓고, 각각 자사몰과 스마트스토어로 나눠 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '사장님이 폰으로 가장 자주 보는 숫자입니다. 채널을 합쳐서만 보여 주면 어느 쪽 광고가 먹혔는지 알 수 없어 나눠 적습니다. 금액 기준은 결제완료이고 취소·반품 환불액은 뺍니다(입금대기는 넣지 않음). 자세한 기간·결제수단별 분석은 통계 > 매출로 보냅니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '스마트스토어 매출은 네이버가 정산하는 금액이 아니라 주문 결제 금액입니다(수수료 빼기 전). 카드 아래에 기준 시각을 적어, 방금 들어온 주문이 왜 안 보이는지 묻지 않게 합니다. 스마트스토어 연동을 끈 몰은 채널 구분 줄과 채널 탭이 통째로 사라집니다.'),
    Canvas({ label: 'A-02 · 매출 요약 영역 (스마트스토어 연동 켠 몰 · 이너에라)' }, Page(Sales(), Chart(),
        Box({ title: '오늘 결제수단별', sub: '자사몰 주문만 (스마트스토어는 네이버페이로 묶임)' },
            Table({ dense: true, cols: ['결제수단', { t: '주문', w: 90, align: 'right' }, { t: '금액', w: 140, align: 'right' }, { t: '비중', w: 220 }],
                rows: [
                    ['신용카드', '9건', '744,000원', `<span style="display:inline-block;width:96px;height:8px;background:var(--dark);vertical-align:middle"></span> 48%`],
                    ['카카오페이', '5건', '421,000원', `<span style="display:inline-block;width:54px;height:8px;background:var(--dark);vertical-align:middle"></span> 27%`],
                    ['네이버페이', '3건', '235,000원', `<span style="display:inline-block;width:30px;height:8px;background:var(--dark);vertical-align:middle"></span> 15%`],
                    ['가상계좌(입금 완료)', '2건', '139,000원', `<span style="display:inline-block;width:20px;height:8px;background:var(--dark);vertical-align:middle"></span> 10%`],
                ], foot: ['합계', '19건', '1,539,000원', '입금대기 3건 147,000원은 넣지 않음'] })),
        Note('금액은 예시 값입니다(판매가 미확정).'),
    )),
    Canvas({ label: 'A-02 · 최근 7일 매출 → 스마트스토어 탭을 누른 모습 (그 채널 막대만)' }, Page(
        Box({ title: '최근 7일 매출', sub: '스마트스토어만', right: Tabs(['전체', '자사몰', '스마트스토어'], '스마트스토어', { kind: 'pill' }) },
            BarChart([188, 201, 170, 236, 221, 223, 88], ['11-05 목', '11-06 금', '11-07 토', '11-08 일', '11-09 월', '11-10 화', '11-11 수(진행 중)']),
            Text('단위 만 원. 스마트스토어 7일 합계 14,035,000원 · 181건.', { sm: true, mute: true })),
    )),
    Canvas({ label: 'A-02 · 스마트스토어 연동을 끈 몰 (채널 구분 없음 · 최근 주문에 채널 칸 없음)' }, Page(
        Greeting('오늘 처리할 일이 <b>32건</b> 있습니다.'),
        H('오늘 할 일'),
        Cards(TODO.slice(0, 7).map((t, i) => (i === 0 ? { ...t, v: '24', sub: '오늘 들어온 주문 19건' } : t)), 4),
        Sales(false), Recent(RECENT.filter((r) => r[2] === '자사몰'), false),
    )),
);

const state3 = StateBlock({ idx: 3, title: '할 일 0건', note: '처리할 일이 하나도 없을 때. 카드는 사라지지 않고 숫자 0으로 남습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '카드를 숨기면 정말 0건인지 화면이 덜 열린 건지 알 수 없습니다. 자리는 그대로 두고 0과 함께 다 끝났다는 한 줄을 줍니다. 초기값(몰을 막 열어 주문이 한 건도 없는 날)은 여기에 첫 준비 안내를 더해 다음에 할 일을 알려 줍니다.'),
    Canvas({ label: 'A-02 · 운영 중인 몰 · 오늘 할 일을 모두 끝냄' }, Page(
        Greeting('오늘 처리할 일을 모두 끝냈습니다.'),
        H('오늘 할 일'),
        Cards(todoZero),
        Note('새 주문·요청·문의가 들어오면 이 화면 숫자가 1분 안에 바뀌고, 설정 > 알림의 내부 수신자에게 알림이 갑니다.'),
        Sales(), Recent(RECENT.map((r) => [...r.slice(0, 8), r[8] === '입금대기' ? '입금대기' : '배송중'])),
    )),
    Canvas({ label: 'A-02 · 막 문을 연 몰 · 주문이 한 건도 없음 (처음 준비 안내)' }, Page(
        Greeting('쇼핑몰을 열 준비를 마저 해 주세요.'),
        Box({ title: '판매 시작 전 준비', sub: '6개 중 4개 완료 · 다 끝나면 이 상자는 사라집니다' },
            Table({ dense: true, cols: [{ t: '', w: 40 }, '할 일', { t: '상태', w: 110 }, { t: '', w: 130 }], rows: [
                [Icon('check-circle-o'), '쇼핑몰 정보 넣기 (사업자 정보 · 고객센터)', Badge('완료', 'check'), '<u>설정 > 쇼핑몰 정보</u>'],
                [Icon('check-circle-o'), '상품 1개 이상 등록하고 판매중으로 바꾸기', Badge('완료', 'check'), '<u>상품 > 상품 목록</u>'],
                [Icon('check-circle-o'), '배송비 규칙과 택배사 정하기', Badge('완료', 'check'), '<u>설정 > 배송</u>'],
                [Icon('check-circle-o'), '약관 · 개인정보처리방침 등록', Badge('완료', 'check'), '<u>설정 > 약관·정책</u>'],
                { hl: true, c: [Icon('warning'), '<b>결제 연결하기</b> (결제 대행사 심사가 끝나야 실제 결제가 됩니다)', Badge('심사 중', 'warn'), '<u>설정 > 결제</u>'] },
                { hl: true, c: [Icon('warning'), '<b>알림톡 발신 프로필 연결하기</b> (안 하면 문자로만 나갑니다)', Badge('안 함', 'dash'), '<u>설정 > 알림</u>'] },
            ] })),
        H('오늘 할 일'),
        Cards(todoZero.slice(0, 7).map((t) => ({ ...t, sub: '아직 없습니다' }))),
        H('매출 요약', { sub: '첫 주문이 들어오면 채워집니다' }),
        Grid(3, Stat({ k: '오늘 (11-11 수)', v: '0원', sub: '주문 0건' }), Stat({ k: '어제 (11-10 화)', v: '0원', sub: '주문 0건' }), Stat({ k: '최근 7일', v: '0원', sub: '주문 0건' })),
        Box({ title: '최근 주문 5건' }, Empty({ icon: 'receipt', title: '아직 들어온 주문이 없습니다', desc: '내 쇼핑몰에서 시험 주문을 한 번 넣어 보면 주문이 어떻게 흘러가는지 확인할 수 있습니다.', action: [Btn('내 쇼핑몰 보기', { kind: 'primary', icon: 'external-link' }), Btn('스마트스토어 주문 가져오기')] })),
    )),
);

const FAILS = [
    { k: '입금 기한 임박', v: '2', sub: '오늘 안에 기한이 끝나 자동 취소될 주문', link: '입금 대기로', to: '/admin/orders/unpaid?due=today', cond: '입금 기한이 24시간 안으로 남은 입금대기 주문', fix: '고객에게 입금 안내 다시 보내기 · 기한 늘리기' },
    { k: '환불 실패', v: '1', sub: '결제 취소 실패 1건 · 환불 기한 임박 0건', link: '환불 실패 탭으로', to: '/admin/claims/cancel?tab=refund-failed', cond: '결제 대행사가 실패를 돌려준 환불 + 승인 뒤 3영업일 넘게 끝나지 않은 환불 (반품 환불 포함)', fix: '다시 시도 · 수동 환불 완료 확인' },
    { k: '스마트스토어 연동 오류', v: '1', sub: '발송 전송 실패 1건 · 11-11 09:10', link: '스마트스토어 연동으로', to: '/admin/channels/smartstore?tab=send&result=fail', cond: '네이버로 보내지 못한 발송·취소·반품 처리, 주문 수집 실패, 상품 연동 오류', fix: '다시 보내기 · 연결 다시 확인' },
    { k: '배송 추적 실패', v: '3', sub: '발송 3일이 지나도 추적 결과 없음', link: '추적 실패 탭으로', to: '/admin/orders/shipping?tab=track-failed', cond: '발송 뒤 3일이 지나도 추적 결과가 없는 송장', fix: '송장 수정 · 다시 조회 · 배송완료 처리' },
    { k: '알림 발송 실패', v: '4', sub: '알림톡·문자 모두 실패 · 오늘', link: '알림 발송 이력으로', to: '/admin/settings/notifications?tab=history&result=fail', cond: '알림톡 실패 → 문자 대체까지 실패한 고객 알림 (최근 24시간)', fix: '다시 보내기 · 발송 잔액·발신 프로필 확인' },
];
const FailCard = (f) => `<div class="wf-stat" style="border:2px solid var(--dark);background:var(--warnbg)"><span class="k">${Icon('warning')}${f.k}</span><b>${f.v}</b><span class="s" style="color:var(--warn)">${f.sub}</span><span class="go">${f.link}${Icon('angle-right-min')}</span></div>`;
const FailRow = (list) => [H('자동 처리 실패', { sub: '자동으로 되어야 할 일이 안 된 건 · 건수가 있을 때만 나타납니다' }), Grid(list.length < 4 ? 4 : list.length, list.map(FailCard))];
const ConnItem = (name) => `<span style="display:inline-flex;align-items:center;gap:6px">${name} ${Badge('정상', 'check')}</span>`;
const ConnLine = (open) => (open
    ? `<div style="border:2px solid var(--dark);border-radius:6px;background:#fff;margin:14px 0">
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--line2);font-size:13.5px">${Icon('warning')}<b>연결 상태</b><span style="color:var(--ink2);font-size:12.5px">4개 중 1개 오류 · 오류가 있으면 펼쳐집니다</span><span style="margin-left:auto;font-size:12.5px;color:var(--ink2)">접기${Icon('angle-up-min')}</span></div>
        <div style="padding:12px 14px">${Table({ dense: true, cols: [{ t: '연결', w: 140 }, { t: '상태', w: 80 }, '내용', { t: '마지막 정상 시각', w: 120 }, { t: '', w: 170 }], rows: [
            ['결제(결제 대행사)', Badge('정상', 'check'), '마지막 결제 09:42 · 결제 취소 응답 정상', '11-11 09:42', '<u>설정 > 결제</u>'],
            { hl: true, c: ['알림(알림톡·문자)', Badge('오류', 'warn'), '<b>발송 잔액이 떨어져 알림톡·문자가 나가지 않고 있습니다.</b> 09:20부터 4건 실패. 잔액을 채우면 실패한 알림을 다시 보낼 수 있습니다.', '11-11 09:18', `${Btn('설정 > 알림으로', { size: 'sm', kind: 'primary' })}`] },
            ['배송 추적', Badge('정상', 'check'), '마지막 조회 09:30 (2시간마다) · 추적 중 42건', '11-11 09:30', '<u>설정 > 배송</u>'],
            ['스마트스토어', Badge('정상', 'check'), '마지막 주문 수집 10:00 (10분마다) · 전송 실패 1건은 연결이 아니라 주문 1건의 문제', '11-11 10:00', '<u>판매채널 > 스마트스토어 연동</u>'],
        ] })}</div></div>`
    : `<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap;border:1px solid var(--line);border-radius:6px;background:#fff;padding:10px 14px;margin:14px 0;font-size:13px">${Icon('check-circle-o')}<b>연결 상태</b>${ConnItem('결제')}${ConnItem('알림')}${ConnItem('배송 추적')}${ConnItem('스마트스토어')}<span style="color:var(--mute);font-size:12px">모두 정상 · 11-11 10:05 확인</span><span style="margin-left:auto;font-size:12.5px;color:var(--ink2)">펼치기${Icon('angle-down-min')}</span></div>`);

const state4 = StateBlock({ idx: 4, title: '자동 처리 실패 카드(입금 기한 임박·환불 실패·스마트스토어 연동 오류·배송 추적 실패·알림 발송 실패)와 연결 상태 줄', note: '자동으로 되어야 할 일이 안 됐을 때 사람이 알 수 있는 곳. 실패 카드는 건수가 있을 때만 오늘 할 일 위에 나타나고, 연결 상태 줄은 항상 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이 솔루션은 입금 확인 · 결제 취소 · 스마트스토어 전송 · 배송 추적 · 고객 알림을 자동으로 합니다. 자동이 조용히 실패하면 화면에는 아무 일도 없어 보이고 고객만 기다립니다. 그래서 실패한 건을 종류별 카드로 대시보드 맨 위에 올리고, 누르면 그 실패 건만 걸러진 목록으로 갑니다. 0건인 실패 카드는 자리를 차지하지 않습니다(오늘 할 일 카드는 0이어도 남는 것과 다름). 디자인에서는 경고색으로 눈에 띄게 합니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '실패 카드(건마다의 실패)와 연결 상태 줄(연결 자체가 끊김)은 다른 것입니다. 연결이 끊기면 그 뒤의 모든 건이 실패하므로 줄이 펼쳐지고 고칠 설정 화면으로 보냅니다. 전부 정상이면 한 줄로 접혀 있습니다. 실패가 생긴 순간에는 설정 > 알림의 내부 수신자에게도 알림이 갑니다(대시보드를 안 보고 있어도 알 수 있게). 권한이 없는 메뉴의 실패 카드와 꺼 둔 기능의 카드(스마트스토어)는 나오지 않습니다.'),
    Canvas({ label: 'A-02 · 자동 처리 실패 5종이 모두 있는 날 + 연결 상태 줄 펼쳐짐(알림 연결 오류)' }, Page(
        Greeting('자동으로 처리하지 못한 일이 <b>11건</b> 있습니다. 먼저 확인하세요.'),
        FailRow(FAILS), ConnLine(true),
        H('오늘 할 일', { sub: '굵은 테두리 = 오늘 안에 끝내야 하는 일' }), Cards(TODO),
    )),
    Canvas({ size: 'auto', label: '실패 카드별 세는 기준 · 이동 주소 · 가서 하는 일', right: '기준 표', pad: 20 }, `<div style="width:1180px">${Table({ dense: true, cols: [{ t: '카드', w: 160 }, { t: '세는 기준', w: 330 }, { t: '누르면 가는 곳', w: 400 }, '가서 하는 일'], rows: FAILS.map((f) => [`<b>${f.k}</b>`, f.cond, `<code style="font-size:12px">${f.to}</code>`, f.fix]) })}</div>`),
    Canvas({ label: 'A-02 · 실패가 1종만 있는 날 (그 카드만 나타남) + 연결 상태 모두 정상(한 줄로 접힘)' }, Page(
        Greeting('이보림 님, 오늘 처리할 일이 <b>53건</b> 있습니다.'),
        FailRow([FAILS[3]]), ConnLine(false),
        H('오늘 할 일'), Cards(TODO),
    )),
    Canvas({ label: 'A-02 · 실패가 없는 날 (실패 카드 구역 자체가 없음 · 연결 상태 줄만)' }, Page(
        Greeting('이보림 님, 오늘 처리할 일이 <b>53건</b> 있습니다.'),
        ConnLine(false),
        H('오늘 할 일'), Cards(TODO.slice(0, 4)),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '연결 오류별 문구 (연결 상태 줄 · 오류 줄의 내용과 가는 곳)', right: '문구 표', pad: 20 }, `<div style="width:860px">${Table({ dense: true, cols: [{ t: '연결', w: 110 }, '오류일 때 문구', { t: '가는 곳', w: 210 }], rows: [
            ['결제', '결제 대행사와 연결이 끊겼습니다. 고객이 결제할 수 없고 결제 취소도 되지 않습니다. 연결 정보가 바뀌었는지 확인하세요.', '설정 > 결제'],
            ['알림', '발송 잔액이 떨어져 알림톡·문자가 나가지 않고 있습니다. / 알림톡 발신 프로필이 정지되어 문자로만 나가고 있습니다.', '설정 > 알림'],
            ['배송 추적', '택배 조회 연결이 끊겨 추적 단계가 갱신되지 않고 있습니다. 송장을 고칠 필요는 없습니다.', '설정 > 배송'],
            ['스마트스토어', '네이버 연결 정보가 만료되어 주문을 가져오지 못하고 있습니다. 마지막 수집 08:40. 다시 연결해 주세요.', '판매채널 > 스마트스토어 연동'],
        ] })}</div>`),
        Canvas({ size: 'mobile', label: 'A-02 · 모바일 · 실패 카드가 맨 위 (사장님 폰)' },
            `<div style="background:#f5f5f7;min-height:560px">
              <div style="display:flex;align-items:center;gap:12px;height:52px;padding:0 16px;background:#fff;border-bottom:1px solid var(--line);font-size:20px">${Icon('bars')}<b style="font-size:15px">Inner:Era 관리자</b><span style="margin-left:auto;font-size:13px;display:inline-flex;align-items:center;gap:4px">${Icon('bell-o')}3</span></div>
              <div style="padding:16px">
                <div style="font-size:13px;font-weight:700;margin-bottom:8px">${Icon('warning')} 자동 처리 실패 11건</div>
                ${FAILS.map((f) => `<div style="display:flex;align-items:center;gap:8px;border:2px solid var(--dark);background:var(--warnbg);border-radius:6px;padding:10px 12px;margin-bottom:6px;font-size:13px"><b style="flex:1">${f.k}</b><b style="font-size:16px">${f.v}</b>${Icon('angle-right-min')}</div>`).join('')}
                <div style="border:2px solid var(--dark);border-radius:6px;background:#fff;padding:10px 12px;margin:10px 0;font-size:12.5px"><b>연결 상태</b> · 알림 ${Badge('오류', 'warn')}<br>발송 잔액이 떨어져 알림이 나가지 않고 있습니다. <u>설정으로</u></div>
                ${Grid(2, TODO.slice(0, 4).map((t) => Stat({ ...t, sub: undefined, link: undefined })))}
              </div>
            </div>`),
    ),
);

export default function A02() {
    return [state1, state2, state3, state4].join('');
}
