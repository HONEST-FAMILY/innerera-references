import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup, Toggle,
    Textarea, FormTable, Filters, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast,
    Upload, Box, KV, Note, Text, Icon, Flex, Grid, Empty, DragRow,
} from '../lib/blocks.js';

const Col = (...c) => `<div style="min-width:0">${c.join('')}</div>`;

const Side = (k, ...v) => `<div style="margin-bottom:14px"><div style="font-size:12.5px;font-weight:700;margin-bottom:6px">${k}</div>${v.join('')}</div>`;

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
<div style="margin-top:8px;font-size:11.5px;color:var(--mute)">테두리 = 오늘 · 줄 그은 날 = 지난 날이라 고를 수 없음 · 검은 칸 = 시작·끝 · 회색 = 노출 기간</div></div>`;
};

const TOP = ['공지사항', '자주 묻는 질문'];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-53', ...o }, Tabs(TOP, tab), body);

const NOTICES = [
    { pin: true, cat: '배송', t: '12월 1일부터 무료배송 기준이 5만원에서 3만원으로 바뀝니다', period: '11-11 ~ 상시', st: '노출 중', view: '1,204', at: '11-11', by: '이보림' },
    { pin: true, cat: '안내', t: '연말 택배 물량 증가에 따른 배송 지연 안내', period: '12-15 ~ 12-31', st: '예약', view: '-', at: '11-10', by: '이보림' },
    { cat: '이벤트', t: '블랙위크 2박스 구성 10% 할인 (11-20 ~ 11-30)', period: '11-18 ~ 11-30', st: '예약', view: '-', at: '11-09', by: '정수아' },
    { cat: '안내', t: '개인정보처리방침 변경 안내 (2026-12-01 시행)', period: '11-01 ~ 상시', st: '노출 중', view: '318', at: '11-01', by: '이보림' },
    { cat: '안내', t: '한가위 연휴 배송·고객센터 휴무 안내', period: '09-20 ~ 10-06', st: '기간 종료', view: '2,877', at: '09-20', by: '이보림' },
    { cat: '안내', t: '(작성 중) 정기배송 시작 안내', period: '-', st: '임시 저장', view: '-', at: '11-11', by: '정수아' },
];
const stB = (s) => Badge(s, { '노출 중': 'solid', 예약: 'dash', '기간 종료': 'mute', '임시 저장': 'line' }[s]);
const NCOLS = [{ t: '고정', w: 56 }, { t: '분류', w: 70 }, '제목', { t: '노출 기간', w: 130 }, { t: '상태', w: 90 }, { t: '조회', w: 60, align: 'right' }, { t: '작성일 · 작성자', w: 120, sort: 'desc' }, { t: '노출', w: 60 }];
const nrow = (n) => ({ dim: n.st === '기간 종료', tied: n.pin, c: [n.pin ? Badge('고정', 'bold') : '-', n.cat, `<u>${n.t}</u>`, n.period, stB(n.st), n.view, `${n.at}<small>${n.by}</small>`, Toggle('', { on: n.st === '노출 중' || n.st === '예약' })] });

const noticeList = (checked = []) => [
    Filters({ open: false, summary: '분류 전체 · 상태 전체 · 검색어 없음' }),
    checked.length
        ? BulkBar({ count: checked.length }, Btn('상단 고정', 'primary'), Btn('고정 해제', 'line'), Btn('노출 끄기', 'line'), Btn('삭제', 'line'))
        : ListHead({ total: 24, left: Chips(['전체 24', '노출 중 15', '예약 2', '기간 종료 6', '임시 저장 1'], '전체 24'), right: PerPage(50) }),
    Table({ check: true, checked, cols: NCOLS, rows: NOTICES.map(nrow) }),
    Note('상단 고정 글은 고객 화면 공지 목록 맨 위에 항상 나오고(왼쪽 굵은 띠), 고정 글끼리의 순서는 "고정 순서 바꾸기"에서 끌어서 정합니다. 고정은 5개까지.'),
    Pager({ page: 1, last: 1, per: 50 }),
];

const FAQS = [
    { cat: '배송', q: '주문하면 언제 받을 수 있나요?', view: '2,140', on: true, top: true },
    { cat: '배송', q: '제주·도서산간도 배송되나요? 추가 배송비가 있나요?', view: '611', on: true },
    { cat: '배송', q: '배송지를 바꾸고 싶어요', view: '480', on: true },
    { cat: '배송', q: '해외로도 보내 주나요?', view: '92', on: false },
];
const faqList = [
    Grid('220px 1fr',
        `<div style="border:1px solid var(--line);border-radius:4px;font-size:13px">${[['전체', 31], ['배송', 9, true], ['주문·결제', 7], ['취소·반품·교환', 6], ['상품', 5], ['회원·혜택', 4]].map(([c, n, on]) => `<div style="padding:10px 12px;border-bottom:1px solid var(--line2);display:flex;justify-content:space-between;${on ? 'background:var(--fill);font-weight:700' : ''}"><span>${c}</span><span style="color:var(--mute)">${n}</span></div>`).join('')}<div style="padding:10px 12px;color:var(--ink2)">${Icon('cog')} 분류 관리 · 순서 바꾸기</div></div>`,
        Col(
            ListHead({ total: 9, left: Text('배송 분류 · 위에서부터 고객 화면에 나오는 순서', { sm: true, mute: true }), right: [Input({ placeholder: '질문 · 답변에서 찾기', icon: 'search', w: 220 }), Btn('순서 저장', { size: 'sm' })] }),
            FAQS.map((f, i) => DragRow({ off: !f.on, right: [f.top ? Badge('자주 찾는 질문', 'bold') : '', Text(`조회 ${f.view}`, { sm: true, mute: true }), Toggle('', { on: f.on }), Btn('수정', { size: 'sm' })] }, `<b>Q${i + 1}.</b> ${f.q}`)).join(''),
            Note('"자주 찾는 질문"으로 표시한 글은 분류와 관계없이 고객 화면 자주 묻는 질문 첫 화면과 1:1 문의 작성 화면 위쪽에 나옵니다(문의를 쓰기 전에 답을 찾게 함). 6개까지.'),
        ),
    ),
];

const state1 = StateBlock({ idx: 1, title: '목록', note: '고객응대 > 공지사항·FAQ. 위쪽 탭으로 공지사항과 자주 묻는 질문을 오갑니다. 처음 열리는 탭은 공지사항.' },
    Anno({ title: '왜 이렇게 하나' }, '공지는 "언제부터 언제까지 보일지"가 핵심이라 노출 기간과 상태(노출 중·예약·기간 종료·임시 저장)를 목록에서 바로 봅니다. 연휴 공지를 미리 써 두면 시작일에 저절로 올라가고 끝나면 내려갑니다. 자주 묻는 질문은 분류별로 묶여 순서가 중요하므로 표가 아니라 끌어서 옮기는 줄로 보여 줍니다.'),
    Anno({ title: '초기값 · 운영자가 바꿀 수 있는 범위' }, '새 몰에는 공지 0건, 자주 묻는 질문은 기본 분류 5개(배송·주문·결제·취소·반품·교환·상품·회원·혜택)와 예시 질문 12개가 들어 있습니다(배송비·반품 기한은 설정 값을 읽어 채움). 분류 이름·순서·질문·답변·노출 여부 모두 운영자가 바꿉니다.'),
    Canvas({ label: 'A-53 · 공지사항 탭 · 목록' }, Page('공지사항', { actions: [Btn('고정 순서 바꾸기', { icon: 'arrows-v' }), Btn('공지 작성', { kind: 'primary', icon: 'plus' })] }, noticeList())),
    Canvas({ label: 'A-53 · 자주 묻는 질문 탭 · 분류별 목록(순서 끌어 바꾸기)' }, Page('자주 묻는 질문', { actions: [Btn('분류 관리', { icon: 'cog' }), Btn('질문 추가', { kind: 'primary', icon: 'plus' })] }, faqList)),
    CanvasRow(
        Canvas({ size: 'auto', label: '공지 2건 선택 → 일괄 처리 바 → 삭제 확인', right: '부분', pad: 20 }, `<div style="width:620px">${BulkBar({ count: 2 }, Btn('상단 고정', 'primary'), Btn('고정 해제', 'line'), Btn('노출 끄기', 'line'), Btn('삭제', 'line'))}</div>`, '<div style="height:12px"></div>',
            Confirm({ w: 400, title: '공지 2건을 삭제할까요?', desc: '고객 화면에서 바로 사라지고 되살릴 수 없습니다.<br>잠깐 내리는 것이라면 "노출 끄기"를 쓰세요.', ok: '삭제', danger: true })),
        Canvas({ size: 'auto', label: '공지가 없는 새 몰 · 고정이 5개를 넘을 때', right: '부분', pad: 20 }, `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'bell-o', title: '아직 올린 공지가 없습니다', desc: '배송 휴무·정책 변경처럼 모든 고객에게 알릴 일을 올립니다.<br>공지가 없으면 고객 화면에는 "등록된 공지가 없습니다"로 보입니다.', action: Btn('공지 작성', { kind: 'primary', icon: 'plus' }) })}</div>`, '<div style="height:12px"></div>',
            Toast('상단 고정은 5개까지입니다. 다른 고정 글을 먼저 해제해 주세요.', { kind: 'error', action: '고정 글 보기' })),
    ),
);

const noticeForm = (o = {}) => AdminLayout({ active: 'a-53', crumb: ['고객응대', '공지사항·FAQ', '공지 작성'], title: '공지 작성', actions: [Btn('미리보기', { icon: 'eye-o' }), Btn('임시 저장'), Btn('등록', 'primary')] },
    Grid('1fr 300px',
        Col(Box({ title: '내용' }, FormTable([
            { k: '분류', required: true, v: Select({ value: '배송', w: 160 }) },
            { k: '제목', required: true, v: Input({ value: o.err ? '' : '연말 택배 물량 증가에 따른 배송 지연 안내', placeholder: '제목을 입력하세요', w: 520, error: o.err }), error: o.err ? '제목을 입력해 주세요.' : undefined, help: '60자까지.' },
            { k: '내용', required: true, v: `<div style="width:100%"><div style="border:1px solid var(--line);border-bottom:0;border-radius:4px 4px 0 0;padding:6px 10px;display:flex;gap:14px;font-size:13px;color:var(--ink2);background:var(--box)"><b>굵게</b><span><u>밑줄</u></span><span>글자 크기</span><span>${Icon('list-dot')} 목록</span><span>${Icon('link')} 링크</span><span>${Icon('image-o')} 사진</span><span>표</span></div>${Textarea({ value: '안녕하세요, 이너에라입니다.<br>12월 15일부터 31일까지 택배 물량이 늘어 배송이 평소보다 1~2일 늦어질 수 있습니다.<br><br>· 평소: 출고 다음 날 도착<br>· 12-15 ~ 12-31: 출고 뒤 2~3일<br><br>12월 24일(목) 오후 2시까지 결제하신 주문은 연내에 출고됩니다.', h: 190 })}</div>`, help: '본문 사진: 가로 1000 px 권장(더 크면 자동으로 줄임) · 장당 5MB 이하 · JPG · PNG · WEBP · GIF, 10장까지.' },
            { k: '첨부 파일', v: Upload({ title: '파일을 끌어다 놓거나 눌러서 고르기', guide: ['PDF · JPG · PNG · XLSX · HWP', '파일당 10MB 이하, 3개까지'] }) },
        ]))),
        Col(
            Box({ title: '노출 설정' },
                Side('노출', Toggle('고객 화면에 보여 줍니다', { on: true })),
                Side('상단 고정', Check('목록 맨 위에 고정', { on: true }), Text('지금 고정 2개 / 5개', { sm: true, mute: true })),
                Side('노출 기간 <em class="req">필수</em>', RadioGroup(['바로 · 계속', '기간 지정'], '기간 지정'), Flex({ mt: 8, col: true, gap: 6 }, Input({ value: '2026-12-15 00:00', icon: 'calendar', w: 200 }), Input({ value: '2026-12-31 23:59', icon: 'calendar', w: 200 })), Text('시작 전에는 "예약", 끝나면 "기간 종료"로 바뀌고 목록에서 내려갑니다.', { sm: true, mute: true })),
                Side('메인 알림', Check('메인 상단 띠에 제목 띄우기', { on: false })),
            ),
            Box({ title: '고객에게 알리기', sub: '선택' }, Check('등록할 때 전체 회원에게 알림톡 보내기', { on: false }), Note('공지 알림은 정보성 안내일 때만 보낼 수 있습니다. 이벤트 분류 공지는 광고라 수신 동의 회원에게만 문자로 나갑니다. 예상 2,418명 · 약 19,344원.')),
        ),
    ));

const faqModal = (o = {}) => Modal({ title: o.edit ? '질문 수정' : '질문 추가', w: 640, foot: [Btn('취소'), Btn('저장', 'primary')] }, FormTable([
    { k: '분류', required: true, v: o.open
        ? Select({ value: '배송', w: 220, open: true, options: [{ t: '배송', on: true }, '주문·결제', '취소·반품·교환', '상품', '회원·혜택', { t: '+ 새 분류 만들기', sub: '분류 관리로' }] })
        : Select({ value: '배송', w: 220 }) },
    ...(o.open ? [] : [
        { k: '질문', required: true, v: Input({ value: '주문하면 언제 받을 수 있나요?', w: 440 }), help: '고객이 실제로 묻는 말투로. 60자까지.' },
        { k: '답변', required: true, v: Textarea({ value: '평일 오후 2시까지 결제하신 주문은 당일 출고되고, 보통 출고 다음 날 도착합니다.<br>제주·도서산간은 1~2일 더 걸립니다. 출고되면 송장번호를 알림톡으로 보내 드립니다.', h: 110, count: '96 / 1,000' }), help: '링크·굵게·사진(가로 1000 px 권장, 5MB 이하)을 넣을 수 있습니다.' },
        { k: '노출', v: [Toggle('고객 화면에 보여 줍니다', { on: true }), Check('자주 찾는 질문으로 표시(첫 화면 · 1:1 문의 작성 위쪽)', { on: true })] },
        { k: '검색어', v: Input({ value: '배송 기간, 도착, 며칠', w: 340 }), help: '고객이 이 말로 찾아도 이 질문이 나옵니다. 쉼표로 구분.' },
    ]),
]), o.open ? '<div style="height:190px"></div>' : '');

const state2 = StateBlock({ idx: 2, title: '작성(상단 고정·노출 기간)', note: '공지 작성 버튼을 누르면 열리는 화면과, 자주 묻는 질문의 질문 추가 팝업.' },
    Anno({ title: '왜 이렇게 하나' }, '공지는 긴 글이라 화면 전체를 쓰고(왼쪽 내용 · 오른쪽 노출 설정), 자주 묻는 질문은 짧아서 팝업으로 씁니다. 노출 기간을 "기간 지정"으로 두면 연휴 안내처럼 끝이 있는 공지가 저절로 내려가 지난 공지가 목록에 쌓이지 않습니다. 초기값: 노출 켜짐 · 고정 안 함 · 바로 · 계속.'),
    Anno({ title: '자산 규격' }, '본문 사진 가로 1000 px 권장 · 장당 5MB 이하 · JPG · PNG · WEBP · GIF · 10장까지 / 첨부 파일 PDF · JPG · PNG · XLSX · HWP · 파일당 10MB · 3개까지. 본문은 굵게·밑줄·글자 크기·목록·링크·사진·표만 쓸 수 있는 간단한 편집기입니다(글꼴·색은 고객사 디자인을 따름).'),
    Canvas({ label: 'A-53 · 공지 작성 버튼 → 작성 화면(상단 고정 · 기간 지정)' }, noticeForm()),
    CanvasRow(
        Canvas({ size: 'auto', label: '노출 기간 시작 칸 누름 → 달력(12월)', right: '부분', pad: 20 },
            Flex({ col: true, gap: 6 }, Input({ value: '2026-12-15 00:00', icon: 'calendar', w: 180, focus: true }), Input({ value: '2026-12-31 23:59', icon: 'calendar', w: 180 })),
            `<div style="margin-top:6px">${Cal({ ym: '2026년 12월', start: 2, days: 31, from: 15, to: 31 })}<div style="width:262px;margin-top:6px;display:flex;gap:6px;align-items:center;font-size:12.5px">시작 시각 ${Select({ value: '00:00', w: 100 })} ${Btn('적용', { size: 'sm', kind: 'primary' })}</div></div>`),
        Canvas({ size: 'auto', label: '분류 고르는 중 · 등록 오류(제목 없음 · 기간 거꾸로)', right: '부분', pad: 20 },
            Select({ value: '배송', w: 180, open: true, options: ['안내', { t: '배송', on: true }, '이벤트', '상품', '점검'] }),
            '<div style="height:150px"></div>',
            `<div style="width:560px">${FormTable([
                { k: '제목', required: true, v: Input({ placeholder: '제목을 입력하세요', w: 380, error: true }), error: '제목을 입력해 주세요.' },
                { k: '노출 기간', required: true, v: [Input({ value: '2026-12-15 00:00', icon: 'calendar', w: 170 }), Input({ value: '2026-12-10 23:59', icon: 'calendar', w: 170, error: true })], error: '끝나는 날이 시작하는 날보다 빠릅니다. 12월 15일 이후로 골라 주세요.' },
            ])}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '미리보기 버튼 → 고객 화면에서 보이는 모습', right: '팝업만', pad: 20 },
            Modal({ title: '미리보기 · 고객 화면', w: 560, foot: [Btn('닫기')] },
                Tabs(['PC', '모바일'], 'PC', { kind: 'pill' }),
                `<div style="border:1px solid var(--line);border-radius:4px;padding:16px">${Badge('고정', 'bold')} <span style="font-size:12px;color:var(--mute)">배송 · 2026-12-15</span><h3 style="margin:6px 0 10px;font-size:17px">연말 택배 물량 증가에 따른 배송 지연 안내</h3><p style="margin:0;font-size:13.5px;color:var(--ink2)">안녕하세요, 이너에라입니다.<br>12월 15일부터 31일까지 택배 물량이 늘어 배송이 평소보다 1~2일 늦어질 수 있습니다. ...</p></div>`,
                Note('예약 상태라 지금은 고객에게 보이지 않습니다. 12-15 00:00 에 올라갑니다.'))),
        Canvas({ size: 'auto', label: '등록 완료(예약) · 임시 저장', right: '부분', pad: 20 }, Toast('공지를 예약했습니다. 12-15 00:00 에 고객 화면에 올라갑니다.', { action: '목록으로' }), '<div style="height:10px"></div>', Toast('임시 저장했습니다. 고객에게는 보이지 않습니다.'),
            '<div style="height:14px"></div>',
            Confirm({ w: 400, title: '쓰던 내용을 저장하지 않고 나갈까요?', desc: '입력한 제목과 내용이 사라집니다.', foot: [Btn('계속 쓰기'), Btn('임시 저장하고 나가기', 'primary')] })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '자주 묻는 질문 탭 > 질문 추가 버튼 → 팝업', right: '팝업만', pad: 20 }, faqModal()),
        Canvas({ size: 'auto', label: '분류 고르는 중(목록 열림)', right: '팝업만', pad: 20 }, faqModal({ open: true })),
    ),
);

const CATS = [['배송', 9, true], ['주문·결제', 7, true], ['취소·반품·교환', 6, true], ['상품', 5, true], ['회원·혜택', 4, true], ['정기배송', 0, false]];

const catModal = (drag) => Modal({ title: '자주 묻는 질문 분류 관리', w: 600, foot: [Btn('취소'), Btn('저장', 'primary')] },
    Text('고객 화면 분류 탭이 위에서부터 왼쪽 → 오른쪽 순서로 나옵니다. 손잡이를 끌거나 화살표로 옮깁니다.', { sm: true, mute: true }),
    CATS.map(([c, n, on], i) => {
        const line = DragRow({ off: !on, right: [Text(`질문 ${n}개`, { sm: true, mute: true }), Btn('', { size: 'sm', icon: 'angle-up-min', disabled: i === 0 }), Btn('', { size: 'sm', icon: 'angle-down-min', disabled: i === CATS.length - 1 }), Toggle('', { on }), Icon('trash-o')] }, Input({ value: c, w: 200 }));
        if (drag && i === 2) return `<div style="border:1px dashed var(--ink);border-radius:4px;height:44px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--mute)">여기에 놓기</div>`;
        if (drag && i === 0) return `${line}<div style="margin:-4px 0 8px 28px;box-shadow:0 6px 16px rgba(0,0,0,.2);transform:rotate(-1deg)">${DragRow({ right: Text('끄는 중', { sm: true }) }, '<b>취소·반품·교환</b>')}</div>`;
        return line;
    }).join(''),
    Flex({ mt: 8, gap: 6 }, Input({ placeholder: '새 분류 이름(10자까지)', w: 240 }), Btn('분류 추가', { size: 'sm', icon: 'plus' })),
    Note('분류는 10개까지. 노출을 끈 분류는 고객 화면에서 탭과 안의 질문이 함께 숨습니다. 기능이 꺼진 몰의 분류(예: 정기배송)는 꺼 두었다가 기능을 켤 때 함께 켭니다.'),
);

const state3 = StateBlock({ idx: 3, title: 'FAQ 분류 순서', note: '자주 묻는 질문 탭의 분류 관리 버튼. 분류 이름·순서·노출을 정하고, 분류 안 질문 순서는 목록에서 끌어 바꿉니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객은 맨 앞 분류, 맨 위 질문만 봅니다. 가장 많이 묻는 것(배송)이 앞에 오도록 운영자가 직접 순서를 정해야 하므로 번호 입력이 아니라 끌어 옮기기와 위·아래 화살표 두 가지를 줍니다(끌기가 어려운 노트북 터치패드를 위해). 조회 수를 옆에 보여 줘 순서를 정하는 근거로 씁니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '질문이 들어 있는 분류는 바로 지울 수 없고 질문을 옮길 분류를 고르게 합니다. 순서는 저장을 눌러야 고객 화면에 반영되고, 저장하지 않고 나가면 묻습니다.'),
    Canvas({ label: 'A-53 · 분류 관리 버튼 → 팝업' }, Overlay({ bg: Page('자주 묻는 질문', { actions: [Btn('분류 관리', { icon: 'cog' }), Btn('질문 추가', { kind: 'primary', icon: 'plus' })] }, faqList), h: 700 }, catModal(false))),
    CanvasRow(
        Canvas({ size: 'auto', label: '분류를 끌어 옮기는 중(취소·반품·교환을 배송 아래로)', right: '팝업만', pad: 20 }, catModal(true)),
        Canvas({ size: 'auto', label: '질문이 있는 분류 삭제 → 옮길 곳 고르기', right: '팝업만', pad: 20 },
            Modal({ title: '"상품" 분류 삭제', w: 440, foot: [Btn('취소'), Btn('5개 옮기고 삭제', 'danger')] },
                Text('이 분류에 질문 <b>5개</b>가 있습니다. 옮길 분류를 고르세요.'),
                Select({ value: '주문·결제', w: 380, open: true, options: ['배송', { t: '주문·결제', on: true }, '취소·반품·교환', '회원·혜택', { t: '질문도 함께 삭제', sub: '되살릴 수 없음' }] }),
                '<div style="height:170px"></div>')),
    ),
    Canvas({ label: 'A-53 · 분류 안 질문 순서 끌어 바꾸는 중 → 순서 저장' }, Page('자주 묻는 질문', { actions: [Btn('분류 관리', { icon: 'cog' }), Btn('질문 추가', { kind: 'primary', icon: 'plus' })] },
        Note('순서를 바꿨습니다. <b>순서 저장</b>을 눌러야 고객 화면에 반영됩니다.', { warn: true }),
        ListHead({ total: 9, left: Text('배송 분류', { sm: true, mute: true }), right: [Btn('되돌리기', { size: 'sm' }), Btn('순서 저장', { size: 'sm', kind: 'primary' })] }),
        DragRow({ right: [Text('조회 2,140', { sm: true, mute: true }), Toggle('', { on: true }), Btn('수정', { size: 'sm' })] }, '<b>Q1.</b> 주문하면 언제 받을 수 있나요?'),
        `<div style="border:1px dashed var(--ink);border-radius:4px;height:44px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--mute)">여기에 놓기 (Q2 자리)</div>`,
        DragRow({ right: [Text('조회 611', { sm: true, mute: true }), Toggle('', { on: true }), Btn('수정', { size: 'sm' })] }, '<b>Q3.</b> 제주·도서산간도 배송되나요? 추가 배송비가 있나요?'),
        `<div style="margin:-10px 0 8px 40px;box-shadow:0 6px 16px rgba(0,0,0,.2);transform:rotate(-0.5deg)">${DragRow({ right: [Text('조회 480 · 끄는 중', { sm: true }), Toggle('', { on: true })] }, '<b>배송지를 바꾸고 싶어요</b>')}</div>`,
        DragRow({ off: true, right: [Text('조회 92', { sm: true, mute: true }), Toggle('', { on: false }), Btn('수정', { size: 'sm' })] }, '<b>Q4.</b> 해외로도 보내 주나요? (노출 꺼짐)'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '순서 저장 완료', right: '토스트만', pad: 20 }, Toast('질문 순서를 저장했습니다. 고객 화면에 반영됐습니다.', { action: '고객 화면에서 보기' })),
        Canvas({ size: 'auto', label: '저장하지 않고 다른 분류를 눌렀을 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '바꾼 순서를 저장할까요?', desc: '배송 분류의 질문 순서를 바꾸고 아직 저장하지 않았습니다.', foot: [Btn('저장 안 함'), Btn('저장하고 이동', 'primary')] })),
    ),
);

export default function A53() {
    return [state1, state2, state3].join('');
}
