import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, SideDrawer,
    Box, KV, Note, Text, Icon, Flex, Grid, Stats, Stars, Empty, Thumb, Img, DragRow, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const TAB_LIST = [{ t: '전체', n: 128 }, { t: '답글 없음', n: 9 }, { t: '포토 리뷰', n: 47 }, { t: '베스트', n: 6 }, { t: '숨김', n: 3 }, { t: '적립금 미지급', n: 5 }];
const Page = (tab, ...body) => AdminLayout({ active: 'a-52', actions: [Btn('리뷰 정책 설정', { icon: 'cog' }), Btn('포토 리뷰 적립금 일괄 지급', { kind: 'primary', icon: 'won' })], desc: '평균 별점 4.7 · 이번 주 새 리뷰 14건 · 별점 2점 이하 1건' }, Tabs(TAB_LIST, tab), body);

const photos = (n) => (n ? `<span style="display:inline-flex;gap:3px;align-items:center">${Thumb(36)}${n > 1 ? `<small>+${n - 1}</small>` : ''}</span>` : '-');
const RV = [
    { d: '11-11', s: 5, t: '아침마다 하나씩 먹는데 석류 향이 진해서 좋아요', sub: '한 달째 먹고 있는데 물 없이 먹기 편합니다. 포장도 깔끔해요.', who: '김민지', opt: '2박스(28일분)', ph: 3, pt: '미지급', st: ['노출 중'], reply: false },
    { d: '11-10', s: 2, t: '생각보다 달아요', sub: '단맛이 강해서 저는 조금 부담스러웠습니다.', who: '최도윤', opt: '1박스(14일분)', ph: 0, pt: '글 500원 지급', st: ['노출 중'], reply: false, low: true },
    { d: '11-09', s: 5, t: '부모님 선물로 드렸는데 좋아하세요', sub: '4박스 구성으로 샀어요. 상자가 고급스러워서 선물하기 좋습니다.', who: '박서준', opt: '4박스(56일분)', ph: 2, pt: '포토 1,000원 지급', st: ['노출 중', '베스트'], reply: true },
    { d: '11-08', s: 4, t: '배송 빠르고 맛있어요', sub: '주문 다음 날 받았습니다.', who: '정수아', opt: '1박스(14일분)', ph: 1, pt: '미지급', st: ['노출 중'], reply: true },
    { d: '11-07', s: 1, t: '(욕설이 들어 있는 리뷰)', sub: '숨김 사유: 욕설·비방 · 이보림 11-07', who: '강지호', opt: '1박스(14일분)', ph: 0, pt: '지급 안 함', st: ['숨김'], reply: false, hide: true },
];
const stCell = (r) => r.st.map((s) => Badge(s, s === '베스트' ? 'bold' : s === '숨김' ? 'x' : 'line')).join(' ');
const ptCell = (r) => (r.pt === '미지급' ? Badge('미지급', 'warn') : r.pt === '지급 안 함' ? Badge('지급 안 함', 'mute') : Badge(r.pt, 'check'));
const COLS = [{ t: '작성일', w: 64, sort: 'desc' }, { t: '별점', w: 96 }, '리뷰', { t: '사진', w: 70 }, { t: '작성자 · 구성', w: 120 }, { t: '적립금', w: 130 }, { t: '상태', w: 120 }, { t: '답글', w: 76 }];
const row = (r) => ({ hl: r.low, dim: r.hide, c: [r.d, Stars(r.s), `<u>${r.t}</u><small>${r.sub}</small>`, photos(r.ph), `${r.who}<small>${r.opt}</small>`, ptCell(r), stCell(r), r.reply ? Badge('답글 있음', 'check') : r.hide ? '-' : Btn('답글', { size: 'sm' })] });

const listBody = (checked = [], sub) => [
    Filters({ open: false, summary: '기간 최근 1개월 · 별점 전체 · 상품 전체' }),
    checked.length
        ? BulkBar({ count: checked.length, sub }, Btn('베스트 지정', 'primary'), Btn('숨김', 'line'), Btn('적립금 지급', 'line'), Btn('같은 답글 달기', 'line'))
        : ListHead({ total: 128, left: Chips(['별점 전체', '5점 96', '4점 22', '3점 6', '2점 이하 4'], '별점 전체'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
    Table({ check: true, checked, cols: COLS, rows: RV.map(row) }),
    Pager({ page: 1, last: 3, per: 50 }),
];

const state1 = StateBlock({ idx: 1, title: '목록(별점·포토)', note: '고객응대 > 리뷰의 첫 화면. 새 리뷰가 위에 오고, 별점 2점 이하는 줄이 강조됩니다.' },
    Anno({ title: '왜 이렇게 하나' }, '리뷰 관리에서 매일 하는 일은 네 가지입니다: 낮은 별점 먼저 확인, 답글 달기, 좋은 포토 리뷰를 베스트로 올리기, 적립금 지급. 그래서 탭이 "답글 없음·포토 리뷰·베스트·숨김·적립금 미지급"으로 나뉘고, 줄마다 사진·적립금 지급 여부·답글 여부가 보입니다. 초기값: 최근 1개월 · 최신 순 · 50개씩.'),
    Anno({ warn: true, title: '기능 켜고 끄기 · 스마트스토어' }, '리뷰 기능이 꺼진 몰은 이 메뉴와 상품 상세의 리뷰 탭, 리뷰 적립이 사라집니다. 스마트스토어에서 달린 리뷰는 네이버 소유라 이 목록에 들어오지 않습니다(판매자센터에서 관리). 리뷰는 구매확정한 주문에만 쓸 수 있어 작성자·구성이 항상 주문과 연결됩니다.'),
    Canvas({ label: 'A-52 · 리뷰 목록 · 전체 탭' }, Page('전체',
        Stats([{ k: '평균 별점', v: '4.7', sub: '리뷰 128건' }, { k: '답글 없는 리뷰', v: '9건', sub: '그중 별점 2점 이하 1건', on: true }, { k: '포토 리뷰', v: '47건', sub: '전체의 37%' }, { k: '적립금 미지급', v: '5건', sub: '포토 3 · 글 2 · 합계 4,000원' }]),
        listBody(),
    )),
    Canvas({ label: 'A-52 · 검색 조건 펼침' }, Page('전체', Filters({ rows: [
        { k: '기간', v: Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' }) },
        { k: '상품', v: Select({ value: '전체 상품', w: 300 }) },
        { k: '별점', v: CheckGroup(['전체', '5점', '4점', '3점', '2점', '1점'], ['전체']) },
        { k: '종류', v: CheckGroup(['포토 리뷰', '글 리뷰', '답글 없음', '베스트', '숨김'], []) },
        { k: '적립금', v: RadioGroup(['전체', '미지급', '지급 완료', '지급 안 함'], '전체') },
        { k: '검색어', v: [Select({ value: '리뷰 내용', w: 130 }), Input({ placeholder: '리뷰 내용 · 작성자 이름 · 주문번호', icon: 'search', w: 300 })] },
    ] }))),
    Canvas({ label: 'A-52 · 리뷰 제목 누름 → 오른쪽 리뷰 상세(사진 크게 · 주문 연결)' }, Overlay({ bg: Page('전체', listBody()), align: 'right', h: 800 },
        SideDrawer({ title: '리뷰 상세', sub: '김민지 · 11-11', w: 600, foot: [Btn('숨김'), Btn('베스트 지정'), Btn('포토 적립금 1,000원 지급', 'primary')] },
            Flex({ align: 'center', gap: 10 }, Stars(5), Badge('노출 중', 'line'), Badge('적립금 미지급', 'warn')),
            Text('<b>아침마다 하나씩 먹는데 석류 향이 진해서 좋아요</b><br>한 달째 먹고 있는데 물 없이 먹기 편합니다. 포장도 깔끔해요. 다음엔 4박스로 사려고요.'),
            Grid(3, Img({ ratio: '1/1', label: '고객 사진 1 · 누르면 크게' }), Img({ ratio: '1/1', label: '고객 사진 2' }), Img({ ratio: '1/1', label: '고객 사진 3' })),
            Note('사진마다 따로 숨길 수 있습니다(다른 사람 얼굴·송장이 찍힌 사진). 고객이 올릴 수 있는 사진: 5장까지 · 장당 10MB 이하 · JPG · PNG · HEIC, 올릴 때 긴 쪽 1600 px 로 줄여 저장.'),
            KV([['작성자', '김민지 · VIP · <u>회원 상세</u>'], ['주문', '<u>20261028-000092</u> · 2박스(28일분) · 구매확정 11-03'], ['도움이 돼요', '12명'], ['신고', '0건']]),
            Box({ title: '답글', sub: '상품 상세에 "이너에라" 이름으로 공개됩니다' }, Textarea({ placeholder: '답글을 입력하세요', h: 70, count: '0 / 500' }), Flex({ mt: 8, justify: 'flex-end' }, Btn('자주 쓰는 답글', { size: 'sm', icon: 'bookmark-o' }), Btn('답글 등록', { size: 'sm', kind: 'primary' }))),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '리뷰가 아직 없는 몰', right: '부분', pad: 20 }, `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'star-o', title: '아직 등록된 리뷰가 없습니다', desc: '구매확정한 고객이 리뷰를 쓰면 여기에 나타납니다.<br>구매확정 3일 뒤 리뷰 작성 안내 알림을 보내 리뷰를 모을 수 있습니다.', action: Btn('리뷰 작성 안내 알림 설정', 'primary') })}</div>`),
        Canvas({ size: 'auto', label: '조건에 맞는 리뷰 없음', right: '부분', pad: 20 }, `<div style="width:480px">${Table({ cols: ['작성일', '별점', '리뷰'], rows: [], empty: '별점 1점 · 포토 리뷰 조건에 맞는 리뷰가 없습니다. 조건을 줄여 보세요.' })}</div>`),
    ),
);

const state2 = StateBlock({ idx: 2, title: '숨김·베스트', note: '리뷰를 고객 화면에서 내리거나(숨김), 상품 상세 리뷰 맨 위에 올립니다(베스트).' },
    Anno({ title: '왜 이렇게 하나' }, '베스트는 상품 상세 리뷰 탭 맨 위와 메인 리뷰 영역에 나오는 리뷰입니다. 사진이 좋은 리뷰를 골라 올리고 순서를 끌어서 정합니다. 숨김은 삭제가 아니라 고객 화면에서만 내리는 것이고, 사유를 반드시 남깁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '별점이 낮다는 이유만으로 리뷰를 숨기면 표시광고법 위반(소비자 기만)이 될 수 있습니다. 그래서 숨김 사유 목록에 "별점이 낮아서"는 없고, 별점 3점 이하 리뷰를 숨길 때는 경고를 한 번 더 띄웁니다. 숨긴 리뷰의 적립금은 회수할지 고릅니다.'),
    Canvas({ label: 'A-52 · 2건 선택 → 일괄 처리 바' }, Page('전체', listBody([0, 2], '포토 리뷰 2건 · 별점 5점 2건'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '숨김 버튼 → 사유 팝업(사유 목록 열림 · 낮은 별점 경고)', right: '팝업만', pad: 20 },
            Modal({ title: '리뷰 숨김', w: 520, foot: [Btn('취소'), Btn('숨김 처리', 'primary')] },
                Note('별점 2점 리뷰입니다. 내용이 마음에 들지 않는다는 이유로 숨기면 법 위반이 될 수 있습니다. 아래 사유에 해당할 때만 숨기세요.', { warn: true }),
                FormTable([{ k: '숨김 사유', required: true, v: Select({ placeholder: '사유를 고르세요', w: 300, open: true, options: ['욕설·비방', '광고·도배', '개인정보가 들어 있음(전화번호·주소·송장)', '다른 상품에 대한 내용', '다른 사람의 사진·글을 가져옴', '작성자 요청', '기타(직접 입력)'] }) }]),
                '<div style="height:210px"></div>',
                FormTable([
                    { k: '지급한 적립금', v: [Radio('그대로 둠', { on: true }), Radio('회수(500원)')] },
                    { k: '작성자 알림', v: Check('숨김 처리 사실과 사유를 작성자에게 안내', { on: true }) },
                ]))),
        Canvas({ size: 'auto', label: '베스트 지정 버튼 → 확인 · 완료 · 숨김 풀기', right: '부분', pad: 20 },
            Confirm({ w: 420, title: '선택한 2건을 베스트 리뷰로 올릴까요?', desc: '상품 상세 리뷰 탭 맨 위와 메인 리뷰 영역에 먼저 보입니다.<br>지금 베스트 6건 + 2건 = 8건(상품당 10건까지).', ok: '베스트 지정' }),
            '<div style="height:14px"></div>', Toast('2건을 베스트 리뷰로 올렸습니다.', { action: '순서 정하기' }),
            '<div style="height:10px"></div>', Toast('리뷰를 숨겼습니다. 고객 화면에서 내려갔습니다.', { action: '되돌리기' })),
    ),
    Canvas({ label: 'A-52 · 베스트 탭 — 노출 순서 끌어 바꾸기' }, Page('베스트',
        ListHead({ left: Text('위에서부터 상품 상세 리뷰 탭에 나옵니다. 손잡이를 끌어 순서를 바꾸고, 메인 리뷰 영역에는 위 4건이 나옵니다.', { sm: true, mute: true }), right: Btn('순서 저장', { kind: 'primary', size: 'sm' }) }),
        [RV[2], RV[0], RV[3]].map((r, i) => DragRow({ right: [Btn('맨 위로', { size: 'sm', icon: 'angle-up-min' }), Btn('베스트 해제', { size: 'sm' })] }, Flex({ gap: 12, align: 'center' }, `<b style="width:18px">${i + 1}</b>`, Thumb(44), `<div style="flex:1;min-width:0"><b>${r.t}</b> ${Stars(r.s)}<br><span style="font-size:12.5px;color:var(--ink2)">${r.who} · ${r.opt} · ${r.d} · 사진 ${r.ph}장 · 메인 노출 ${i < 4 ? '중' : '안 함'}</span></div>`))).join(''),
    )),
    Canvas({ label: 'A-52 · 숨김 탭' }, Page('숨김',
        Table({ check: true, cols: [{ t: '숨긴 날', w: 80 }, { t: '별점', w: 96 }, '리뷰', { t: '작성자', w: 90 }, '숨김 사유', { t: '숨긴 사람', w: 90 }, { t: '관리', w: 170 }], rows: [
            ['11-07', Stars(1), '<u>(욕설이 들어 있는 리뷰)</u>', '강지호', '욕설·비방', '이보림', `${Btn('숨김 풀기', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`],
            ['10-30', Stars(5), '<u>최저가 공구 링크 공유합니다</u>', '비공개', '광고·도배', '정수아', `${Btn('숨김 풀기', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`],
            ['10-12', Stars(4), '<u>송장 사진이 같이 찍힌 리뷰</u>', '윤서연', '개인정보가 들어 있음 · 사진 1장만 숨김', '이보림', `${Btn('숨김 풀기', { size: 'sm' })}`],
        ] }),
        Note('삭제는 숨긴 뒤에만 할 수 있고 되살릴 수 없습니다. 숨김은 언제든 풀 수 있습니다.'),
    )),
);

const replyModal = (o = {}) => Modal({ title: o.bulk ? '같은 답글 달기 · 3건' : '답글 달기', w: 600, foot: [Btn('취소'), Btn(o.bulk ? '3건에 답글 등록' : '답글 등록', 'primary')] },
    o.bulk ? Text('선택한 <b>3건</b>(별점 5점 2건 · 4점 1건)에 같은 답글을 답니다. #{고객이름}은 리뷰마다 바뀝니다.') : Box({ flat: true }, Flex({ gap: 8, align: 'center' }, Stars(2), '<b>생각보다 달아요</b>'), Text('단맛이 강해서 저는 조금 부담스러웠습니다.<br><span style="color:var(--mute)">최도윤 · 1박스(14일분) · 11-10</span>', { sm: true })),
    FormTable([
        { k: '자주 쓰는 답글', v: o.open
            ? Select({ value: '아쉬운 점 답글(맛)', w: 320, open: true, search: '', options: ['감사 답글(기본)', '감사 답글(포토 리뷰)', { t: '아쉬운 점 답글(맛)', on: true }, '아쉬운 점 답글(배송)', '직접 쓰기'] })
            : Select({ value: o.bulk ? '감사 답글(기본)' : '아쉬운 점 답글(맛)', w: 320 }) },
    ]),
    o.open ? '<div style="height:160px"></div>' : [
        Textarea({ value: o.bulk ? '#{고객이름} 님, 소중한 후기 감사합니다. 매일 한 포로 건강한 하루 보내세요. 이너에라 드림' : '최도윤 님, 솔직한 후기 감사합니다. 단맛이 부담스러우셨다니 아쉽습니다. 차갑게 보관했다가 드시면 단맛이 덜 느껴진다는 분들이 많아 한번 권해 드립니다. 남겨 주신 의견은 다음 생산 때 꼭 참고하겠습니다. 이너에라 드림', h: 110, count: o.bulk ? '52 / 500' : '128 / 500' }),
        FormTable([{ k: '작성자 알림', v: Check('답글이 달렸다고 작성자에게 안내 (알림톡)', { on: !o.bulk }), help: '답글은 상품 상세에 "이너에라" 이름으로 모두에게 보입니다. 개인정보(주문번호·연락처)를 쓰지 마세요.' }]),
    ],
);

const state3 = StateBlock({ idx: 3, title: '답글', note: '리뷰에 판매자 답글을 답니다. 줄의 답글 버튼, 리뷰 상세, 여러 건 선택 뒤 "같은 답글 달기" 세 곳에서 열립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '답글은 그 고객만이 아니라 상품 상세를 보는 다음 고객이 읽습니다. 낮은 별점에 성의 있게 답하는 것이 가장 중요해서 "답글 없음" 탭이 따로 있고 낮은 별점이 위에 옵니다. 감사 답글은 여러 건에 한 번에 달 수 있고 고객 이름만 바뀝니다.'),
    Canvas({ label: 'A-52 · 답글 없음 탭 → 별점 2점 리뷰의 답글 버튼 → 팝업' }, Overlay({ bg: Page('답글 없음', listBody()), h: 640 }, replyModal())),
    CanvasRow(
        Canvas({ size: 'auto', label: '자주 쓰는 답글 고르는 중(검색형 목록 열림)', right: '팝업만', pad: 20 }, replyModal({ open: true })),
        Canvas({ size: 'auto', label: '3건 선택 → 같은 답글 달기', right: '팝업만', pad: 20 }, replyModal({ bulk: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '답글이 달린 리뷰 — 수정·삭제', right: '부분', pad: 20 }, `<div style="width:560px">${Box({ title: '부모님 선물로 드렸는데 좋아하세요', sub: '박서준 · 11-09', right: Stars(5) }, Text('4박스 구성으로 샀어요. 상자가 고급스러워서 선물하기 좋습니다.', { sm: true }),
            `<div style="border-left:3px solid var(--ink);background:var(--box);padding:10px 12px;margin-top:8px;font-size:12.5px">${Icon('reply')} <b>이너에라</b> <span style="color:var(--mute)">11-09 16:20 · 정수아</span><br>박서준 님, 소중한 후기 감사합니다. 부모님께서 좋아하셨다니 저희도 기쁩니다.<div style="margin-top:6px"><u>수정</u> · <u>삭제</u></div></div>`)}</div>`),
        Canvas({ size: 'auto', label: '등록 완료 · 빈 답글', right: '부분', pad: 20 }, Toast('답글을 등록했습니다. 상품 상세에 바로 보입니다.', { action: '고객 화면에서 보기' }), '<div style="height:14px"></div>',
            `<div style="width:420px">${Textarea({ placeholder: '답글을 입력하세요', h: 60, count: '0 / 500', error: true })}<p class="err">${Icon('error-o')}답글 내용을 입력해 주세요.</p></div>`),
    ),
);

const PAY_COLS = [{ t: '작성일', w: 64 }, '리뷰', { t: '사진', w: 70 }, { t: '작성자', w: 90 }, { t: '주문 · 구매확정', w: 170 }, { t: '종류', w: 70 }, { t: '지급할 금액', w: 100, align: 'right' }, { t: '적립금', w: 130 }];
const payRows = [
    ['11-11', '<u>아침마다 하나씩 먹는데 석류 향이 진해서 좋아요</u>', photos(3), '김민지', '<u>20261028-000092</u><small>11-03 확정</small>', '포토', '1,000원', Badge('미지급', 'warn')],
    ['11-08', '<u>배송 빠르고 맛있어요</u>', photos(1), '정수아', '<u>20261102-000104</u><small>11-07 확정</small>', '포토', '1,000원', Badge('미지급', 'warn')],
    ['11-08', '<u>맛있고 먹기 편해서 매일 챙겨 먹고 있어요</u>', '-', '임재현', '<u>20261101-000099</u><small>11-06 확정</small>', '글', '500원', Badge('미지급', 'warn')],
    ['11-06', '<u>두 번째 구매입니다. 꾸준히 먹어 볼게요</u>', photos(2), '윤서연', '<u>20261027-000090</u><small>11-02 확정</small>', '포토', '1,000원', Badge('미지급', 'warn')],
    { dim: true, nocheck: true, c: ['11-09', '<u>부모님 선물로 드렸는데 좋아하세요</u>', photos(2), '박서준', '<u>20261030-000096</u><small>11-05 확정</small>', '포토', '1,000원', `${Badge('적립 완료', 'check')}<small>11-09 16:22 · 정수아</small>`] },
];

const state4 = StateBlock({ idx: 4, title: '포토 리뷰 적립금 일괄 지급', note: '운영자가 사진을 확인하고 적립금을 한꺼번에 주는 화면. "적립금 미지급" 탭 또는 위 버튼으로 들어옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '솔루션 기본값은 리뷰를 쓰면 바로 자동 지급입니다. 상품과 관계없는 사진으로 적립금만 받아 가는 일을 막고 싶은 몰은 혜택 > 적립금 정책에서 "운영자가 확인하고 지급"으로 바꾸고, 그때 이 화면에서 사진을 보고 골라 한 번에 지급합니다(자동 지급인 몰에는 "적립금 미지급" 탭과 이 버튼이 없습니다). 금액은 정책 값(글 500원 · 포토 1,000원)이 미리 들어갑니다.'),
    Anno({ warn: true, title: '중복 지급 막기' }, '지급한 리뷰는 "적립 완료(지급한 때 · 사람)"로 표시되고 체크박스가 없어져 다시 고를 수 없습니다. 주문 한 건의 한 상품에 리뷰 적립은 한 번뿐이라, 고객이 리뷰를 지우고 다시 써도 "이미 적립한 주문"으로 걸러집니다. 리뷰를 숨기거나 지우면 지급한 적립금을 회수할지 묻습니다.'),
    Canvas({ label: 'A-52 · 적립금 미지급 탭 · 3건 선택' }, Page('적립금 미지급',
        BulkBar({ count: 3, sub: '포토 리뷰 3건 · 합계 3,000원' }, Btn('선택한 3건 적립금 지급', 'primary'), Btn('지급 안 함으로 표시', 'line')),
        Table({ check: true, checked: [0, 1, 3], cols: PAY_COLS, rows: payRows }),
        Note('맨 아래 흐린 줄은 이미 지급한 리뷰입니다(확인용으로 최근 지급 1건을 보여 줌). 상품과 관계없는 리뷰는 "지급 안 함"으로 정리합니다. 여러 건을 고르면 글 n건 × 500원 + 포토 m건 × 1,000원 = 합계로 미리 보여 줍니다.'),
    )),
    Canvas({ label: 'A-52 · 선택한 3건 적립금 지급 버튼 → 확인 팝업' }, Overlay({ bg: Page('적립금 미지급', Table({ check: true, checked: [0, 1, 3], cols: PAY_COLS, rows: payRows })), h: 640 },
        Modal({ title: '포토 리뷰 적립금 지급', w: 600, foot: [Btn('취소'), Btn('3명에게 3,000원 지급', 'primary')] },
            Table({ dense: true, cols: ['작성자', '리뷰', { t: '종류', w: 60 }, { t: '금액', w: 110 }], rows: [
                ['김민지', '아침마다 하나씩 먹는데...', '포토', Input({ value: '1,000', suffix: '원', w: 100 })],
                ['정수아', '배송 빠르고 맛있어요', '포토', Input({ value: '1,000', suffix: '원', w: 100 })],
                ['윤서연', '두 번째 구매입니다...', '포토', Input({ value: '1,000', suffix: '원', w: 100 })],
            ], foot: ['합계', '', '', '3,000원'] }),
            FormTable([
                { k: '사유', v: Text('포토 리뷰 작성 (고객 적립금 내역에 보이는 말)') },
                { k: '유효기간', v: Text('정책대로 지급일부터 1년 (2027-11-11 까지)') },
                { k: '고객 알림', v: Check('적립금 지급 안내 보내기 (알림톡 · 실패 시 문자)', { on: true }) },
            ]),
            Note('지급하면 이 리뷰들은 "적립 완료"로 바뀌어 다시 지급할 수 없습니다.'),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '지급 완료 → 목록에서 빠지고 표시가 바뀜', right: '부분', pad: 20 }, Toast('3명에게 3,000원을 지급했습니다.', { action: '적립금 내역 보기' }), '<div style="height:14px"></div>',
            `<div style="width:560px">${Table({ dense: true, cols: ['리뷰', { t: '작성자', w: 80 }, { t: '적립금', w: 220 }], rows: [
                ['아침마다 하나씩 먹는데...', '김민지', `${Badge('적립 완료', 'check')} 11-11 14:40 · 이보림`],
                ['배송 빠르고 맛있어요', '정수아', `${Badge('적립 완료', 'check')} 11-11 14:40 · 이보림`],
            ] })}</div>`),
        Canvas({ size: 'auto', label: '이미 지급한 리뷰가 섞였을 때(전체 목록에서 고른 경우)', right: '팝업만', pad: 20 },
            Confirm({ w: 440, title: '4건 중 1건은 이미 적립금을 지급했습니다', desc: '박서준 님 리뷰(주문 20261030-000096)는 11-09 에 1,000원을 지급했습니다.<br>같은 주문에는 한 번만 지급할 수 있어 이 건은 빼고 3건만 지급합니다.', ok: '3건만 지급' })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '리뷰 정책 설정 버튼 → 팝업', right: '팝업만', pad: 20 },
            Modal({ title: '리뷰 정책 설정', w: 600, foot: [Btn('취소'), Btn('저장', 'primary')] }, FormTable([
                { k: '쓸 수 있는 때', v: [Text('구매확정 뒤', { sm: true }), Input({ value: '90', suffix: '일 안', w: 110 })] },
                { k: '사진', v: [Input({ value: '5', suffix: '장까지', w: 110 }), Text('장당 10MB 이하 · JPG · PNG · HEIC', { sm: true, mute: true })] },
                { k: '노출', v: RadioGroup(['쓰면 바로 노출', '운영자가 확인한 뒤 노출'], '쓰면 바로 노출') },
                { k: '적립금 지급', v: Text('운영자가 확인하고 지급(기본은 자동 지급) · 글 500원 · 포토 1,000원 — <u>혜택 > 적립금 정책에서 바꾸기</u>') },
                { k: '리뷰 작성 안내', v: [Check('구매확정 3일 뒤 작성 안내 알림 보내기', { on: true }), Text('광고 수신 동의 회원만', { sm: true, mute: true })] },
                { k: '금칙어', v: Input({ value: '최저가, 공구, 카톡 아이디', w: 340 }), help: '쉼표로 구분. 들어 있으면 자동으로 숨기고 숨김 탭에 "금칙어"로 표시합니다.' },
            ]))),
        Canvas({ size: 'auto', label: '적립금 기능이 꺼진 몰의 리뷰 화면', right: '부분', pad: 20 }, `<div style="width:640px">${Note('적립금 기능이 꺼져 있어 "적립금 미지급" 탭, 적립금 칸, 일괄 지급 버튼이 보이지 않습니다. 나머지(숨김·베스트·답글)는 그대로 씁니다.')}${Tabs([{ t: '전체', n: 128 }, { t: '답글 없음', n: 9 }, { t: '포토 리뷰', n: 47 }, { t: '베스트', n: 6 }, { t: '숨김', n: 3 }], '전체')}</div>`),
    ),
);

const cautionBand = `<div style="border:2px solid var(--ink);border-radius:4px;background:var(--warnbg);padding:10px 12px;font-size:12.5px;margin-bottom:10px">${Icon('warning')} <b>식품·건강 표현 주의</b> — 이 상품은 건강기능식품이 아닌 일반식품입니다. 답글에 아래 표현을 쓰면 표시·광고 위반이 될 수 있습니다.<br><span style="color:var(--ink2)">쓰지 않는 표현: 노화 방지 · 항산화 효과 · 피로 회복 · 면역 · 피부 개선 같은 효능·기능 표현, 질병 이름, 의사 추천, 확인되지 않은 수치·수상</span><br><span style="color:var(--ink2)">고객이 쓴 효능 표현을 답글에서 되풀이하거나 맞다고 답하지 마세요. <u>전체 안내 보기</u></span></div>`;

const cautionReply = (o = {}) => Modal({ title: '답글 달기', w: 620, foot: [Btn('취소'), Btn('답글 등록', { kind: 'primary', disabled: o.bad })] },
    cautionBand,
    Box({ flat: true }, Flex({ gap: 8, align: 'center' }, Stars(5), '<b>먹고 나서 피로가 싹 풀렸어요</b>'), Text('일주일 먹었는데 피부도 좋아진 것 같아요. 강추합니다.<br><span style="color:var(--mute)">이하은 · 2박스(28일분) · 11-10</span>', { sm: true })),
    Textarea({ value: o.bad ? '이하은 님, 후기 감사합니다. 저희 제품은 <u><b>피로 회복</b></u>과 <u><b>피부 개선</b></u>에 도움을 드립니다. 꾸준히 드셔 보세요.' : '이하은 님, 소중한 후기 감사합니다. 매일 한 포씩 간편하게 챙기실 수 있도록 더 잘 준비하겠습니다. 이너에라 드림', h: 90, count: o.bad ? '58 / 500' : '54 / 500', error: o.bad }),
    o.bad ? `<p class="err">${Icon('error-o')}주의 표현 2개가 들어 있습니다: 피로 회복 · 피부 개선. 지우거나 바꿔야 등록할 수 있습니다.</p>` : Text('주의 표현이 없습니다.', { sm: true, mute: true }),
    FormTable([{ k: '작성자 알림', v: Check('답글이 달렸다고 작성자에게 안내 (알림톡)', { on: true }) }]),
);

const state5 = StateBlock({ idx: 5, title: '식품·건강 표현 주의 안내 띠(답글 작성)', note: '설정 > 기능 켜고 끄기에서 "식품·건강 표현 주의 안내"를 켠 몰(이너에라는 켬). 답글을 쓰는 칸 위에 금지 표현 안내가 항상 붙어 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이너에라 롱지비티는 일반식품이라 효능·기능을 말하면 안 됩니다. 고객 리뷰에는 "피로가 풀렸다" 같은 말이 흔하고, 운영자가 반갑게 맞장구치는 답글을 달면 그 답글이 판매자의 광고가 됩니다. 그래서 답글 칸 위에 쓰지 않는 표현을 고정해 보여 주고, 답글에 그 표현이 들어가면 밑줄로 표시하고 등록을 막습니다. 안내 문구와 금지 표현 목록은 고객사 적용 값(이너에라 표현 규칙 문서)을 그대로 싣습니다.'),
    Anno({ warn: true, title: '함께 나오는 곳 · 꺼진 몰' }, '같은 안내가 리뷰 상세의 답글 칸, 여러 건에 같은 답글 달기 팝업에도 붙습니다. 베스트로 지정할 때는 "효능·효과를 단정하는 리뷰를 베스트로 올리거나 홍보에 쓰면 표시·광고 위반이 될 수 있습니다" 안내가 뜹니다. 이 기능을 끈 몰(식품이 아닌 업종)은 띠와 표현 검사가 없고 3번 상태 그대로입니다. 띠 문구는 운영자가 지우거나 접을 수 없습니다(고정).'),
    Canvas({ label: 'A-52 · 답글 버튼 → 팝업 · 답글 칸 위에 주의 안내 띠가 고정(이너에라)' }, Overlay({ bg: Page('답글 없음', listBody()), h: 680 }, cautionReply())),
    CanvasRow(
        Canvas({ size: 'auto', label: '답글에 주의 표현이 들어갔을 때 — 밑줄 표시 · 등록 막힘', right: '팝업만', pad: 20 }, cautionReply({ bad: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '리뷰 상세(오른쪽 칸)의 답글 칸에도 같은 띠', right: '부분', pad: 20 },
            `<div style="width:560px">${Box({ title: '답글', sub: '상품 상세에 "이너에라" 이름으로 공개됩니다' }, cautionBand, Textarea({ placeholder: '답글을 입력하세요', h: 70, count: '0 / 500' }), Flex({ mt: 8, justify: 'flex-end' }, Btn('자주 쓰는 답글', { size: 'sm', icon: 'bookmark-o' }), Btn('답글 등록', { size: 'sm', kind: 'primary' })))}</div>`),
        Canvas({ size: 'auto', label: '효능 표현이 든 리뷰를 베스트로 지정할 때', right: '팝업만', pad: 20 },
            Confirm({ w: 440, title: '이 리뷰를 베스트로 올릴까요?', desc: '리뷰에 "피로가 싹 풀렸어요", "피부도 좋아진"이라는 표현이 있습니다.<br>효능·효과를 단정하는 리뷰를 베스트로 올리거나 홍보에 쓰면 표시·광고 위반이 될 수 있습니다.', foot: [Btn('올리지 않기', 'primary'), Btn('그래도 베스트 지정')] })),
    ),
);

export default function A52() {
    return [state1, state2, state3, state4, state5].join('');
}
