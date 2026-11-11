import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup, CheckGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Overlay, Modal, Confirm, Toast, SideDrawer,
    Box, KV, Note, Text, Icon, Flex, Empty, Thumb, UserPage, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const TAB_LIST = [{ t: '미답변', n: 3 }, { t: '답변완료', n: 148 }, { t: '숨김', n: 2 }, { t: '전체', n: 153 }];
const Page = (tab, ...body) => AdminLayout({ active: 'a-51', counts: { 'a-50': 7, 'a-51': 3 }, actions: [Btn('자주 쓰는 답변 관리', { icon: 'bookmark-o' })], desc: '상품 상세의 문의 탭에 고객이 남긴 질문입니다. 답변은 상품 상세에 공개됩니다(비밀글 제외).' }, Tabs(TAB_LIST, tab), body);

const lock = `${Icon('lock-o')} `;
const COLS = [{ t: '경과', w: 100, sort: 'desc' }, { t: '상품', w: 220 }, { t: '유형', w: 70 }, '문의 내용', { t: '작성자', w: 120 }, { t: '공개', w: 76 }, { t: '접수', w: 90 }, { t: '답변', w: 110 }];
const QS = [
    { hl: true, c: [Badge('11시간 4분', 'warn'), `${P}<small>전체 구성</small>`, '상품', `${lock}<u>임신 중인데 먹어도 되는지 궁금합니다</u><small>성분 중에 피해야 할 게 있을까요</small>`, '이하은<small>구매한 회원</small>', Badge('비밀글', 'fill'), '11-11 03:18', Btn('답변하기', { size: 'sm', kind: 'primary' })] },
    [`2시간 30분`, `${P}<small>4박스(56일분)</small>`, '재입고', '<u>4박스 구성은 언제 다시 들어오나요?</u><small>선물용으로 사려고 합니다</small>', '박서준<small>구매 이력 없음</small>', Badge('공개', 'line'), '11-11 11:52', Btn('답변하기', { size: 'sm', kind: 'primary' })],
    ['40분', `${P}<small>전체 구성</small>`, '배송', '<u>오늘 주문하면 내일 받을 수 있나요</u>', '윤서연<small>구매 이력 없음</small>', Badge('공개', 'line'), '11-11 13:42', Btn('답변하기', { size: 'sm', kind: 'primary' })],
];

const filterOpen = Filters({ rows: [
    { k: '상품', v: Select({ value: '롱지비티 석류맛 젤리스틱', w: 340, open: true, search: '젤리', options: [{ t: '롱지비티 석류맛 젤리스틱', sub: '문의 151건 · 미답변 3', on: true }, { t: '석류맛 젤리스틱 체험 3포', sub: '문의 2건 · 판매 중지' }] }) },
    { k: '기간', v: Period({ preset: '1개월', from: '2026-10-12', to: '2026-11-11' }) },
    { k: '유형', v: CheckGroup(['전체', '상품', '배송', '재입고', '기타'], ['전체']) },
    { k: '공개 여부', v: RadioGroup(['전체', '공개', '비밀글'], '전체') },
    { k: '검색어', v: Input({ placeholder: '문의 내용 · 작성자 이름', icon: 'search', w: 320 }) },
] });

const state1 = StateBlock({ idx: 1, title: '미답변', note: '고객응대 > 상품 문의의 첫 화면. 미답변 탭이 먼저 열리고 오래 기다린 문의가 위입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품 문의는 구매 직전의 질문이라 답이 늦으면 그대로 이탈입니다. 1:1 문의와 같이 미답변·경과 시간 순이 기본이고, 상품이 많은 몰은 상품별로 걸러 그 상품 담당자가 자기 것만 봅니다(상품 고르기는 이름으로 찾는 검색형). 작성자가 그 상품을 산 적이 있는지도 같이 보여 줍니다.'),
    Anno({ warn: true, title: '기능 켜고 끄기' }, '설정 > 기능 켜고 끄기에서 상품 문의를 끄면 이 메뉴와 상품 상세의 문의 탭이 함께 사라지고, 고객은 1:1 문의만 쓰게 됩니다. 이너에라처럼 상품이 1개인 몰은 상품 칸과 상품 필터가 있어도 값이 하나뿐입니다.'),
    Canvas({ label: 'A-51 · 미답변 탭' }, Page('미답변',
        Filters({ open: false, summary: '상품 전체 · 기간 전체 · 유형 전체' }),
        ListHead({ total: 3, left: Chips(['전체 3', '상품 1', '배송 1', '재입고 1'], '전체 3'), right: PerPage(50) }),
        Table({ check: true, cols: COLS, rows: QS }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    Canvas({ label: 'A-51 · 검색 조건 펼침 · 상품별 필터(검색형 목록 열림)' }, Page('전체', filterOpen)),
    CanvasRow(
        Canvas({ size: 'auto', label: '미답변이 없을 때', right: '부분', pad: 20 }, `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'check-circle-o', title: '답변을 기다리는 상품 문의가 없습니다', desc: '이번 주 12건에 모두 답했습니다.', action: Btn('답변완료 문의 보기') })}</div>`),
        Canvas({ size: 'auto', label: '상품 문의 기능이 꺼진 몰', right: '부분', pad: 20 }, `<div style="width:520px;border:1px solid var(--line);border-radius:4px">${Empty({ icon: 'switch-on', title: '상품 문의 기능이 꺼져 있습니다', desc: '상품 상세에 문의 탭이 보이지 않습니다. 고객 질문은 1:1 문의로 들어옵니다.<br>전에 받은 문의 153건은 보관 중입니다.', action: Btn('설정 > 기능 켜고 끄기로 가기', 'primary') })}</div>`),
    ),
);

const answerDrawer = (o = {}) => SideDrawer({ title: '상품 문의 답변', sub: o.secret ? '비밀글 · 이하은' : '공개 · 박서준', w: 600, foot: [Btn('닫기'), Btn(o.done ? '답변 수정 저장' : '답변 등록하고 알림 보내기', 'primary')] },
    Box({ flat: true }, Flex({ gap: 10, align: 'center' }, Thumb(48), `<div><b>${SHOP.product}</b><br><span style="font-size:12.5px;color:var(--ink2)">${o.secret ? '전체 구성 · 판매 중' : '4박스(56일분) · 품절 · 다음 입고 예정 11-16 (재고 관리에 입력된 날짜)'}</span></div>`)),
    Box({ title: '문의', sub: o.secret ? '11-11 03:18 · 11시간 4분 경과' : '11-11 11:52 · 2시간 30분 경과', right: Badge(o.secret ? '비밀글' : '공개', o.secret ? 'fill' : 'line') },
        Text(o.secret ? '<b>임신 중인데 먹어도 되는지 궁금합니다</b><br>성분 중에 피해야 할 게 있을까요. 지금 20주차입니다.' : '<b>4박스 구성은 언제 다시 들어오나요?</b><br>선물용으로 사려고 합니다.'),
        KV([['작성자', o.secret ? '이하은 · 010-****-7730 · <u>회원 상세</u>' : '박서준 · 010-****-5821 · <u>회원 상세</u>'], ['구매 이력', o.secret ? '이 상품 2번 구매(최근 10-22)' : '이 상품 구매 이력 없음']])),
    Box({ title: '답변', right: Btn('자주 쓰는 답변 불러오기', { size: 'sm', icon: 'bookmark-o' }) },
        Textarea({ value: o.secret ? '안녕하세요, 이너에라입니다. 임신·수유 중에는 섭취 전에 담당 의사와 상의하시기를 권해 드립니다. 원료 전체 목록은 상세정보의 "원료·함량" 표에서 확인하실 수 있습니다.' : '안녕하세요, 이너에라입니다. 4박스(56일분) 구성은 11월 16일(월)에 다시 들어올 예정입니다. 상품 상세의 "재입고 알림 신청"을 눌러 두시면 입고되는 날 알림톡으로 알려 드립니다.', h: 120, count: '112 / 1,000' }),
        '<div style="height:8px"></div>',
        FormTable([
            { k: '답변 공개', v: o.secret ? Text(`${Icon('lock-o')} 비밀글이라 답변도 작성자에게만 보입니다(바꿀 수 없음)`) : RadioGroup(['공개(상품 상세에 보임)', '작성자에게만'], '공개(상품 상세에 보임)') },
            { k: '고객 알림', v: Check('답변 등록 알림 보내기 (알림톡 · 실패 시 문자)', { on: true }), help: '비회원이 쓴 문의는 작성할 때 남긴 휴대폰 번호로 보냅니다.' },
        ]),
        Box({ flat: true, title: '고객에게 가는 알림 미리보기' }, Text(`[이너에라] ${o.secret ? '이하은' : '박서준'} 님, 상품 문의에 답변이 등록되었습니다.<br>상품: 롱지비티 석류맛 젤리스틱<br>답변 보기: innerera.example/mypage/inquiries?tab=product`, { sm: true }))),
);

const state2 = StateBlock({ idx: 2, title: '답변', note: '목록에서 답변하기를 누르면 목록 위로 오른쪽에서 답변 칸이 열립니다. 목록을 떠나지 않고 다음 문의로 넘어갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '상품 문의는 짧고 수가 많아 한 건마다 화면을 옮기지 않습니다. 오른쪽 답변 칸에는 그 상품의 지금 판매 상태·재고·입고 예정일이 함께 보여서 "언제 들어오나요"에 재고 화면을 열지 않고 답합니다. 답변은 상품 상세에 공개되므로 다른 고객도 읽는 글이라는 점을 공개 여부 줄로 알립니다.'),
    Canvas({ label: 'A-51 · 답변하기 버튼 → 오른쪽 답변 칸(공개 문의)' }, Overlay({ bg: Page('미답변', Table({ check: true, cols: COLS, rows: QS })), align: 'right', h: 860 }, answerDrawer())),
    Canvas({ label: 'A-51 · 답변완료 탭 — 답변 수정·숨김·삭제' }, Page('답변완료',
        Filters({ open: false, summary: '상품 전체 · 최근 1개월' }),
        ListHead({ total: 148, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '답변일', w: 100, sort: 'desc' }, { t: '상품', w: 190 }, '문의 · 답변', { t: '작성자', w: 90 }, { t: '공개', w: 76 }, { t: '답변한 사람', w: 90 }, { t: '관리', w: 150 }], rows: [
            ['11-11 10:40', `${P}`, '<u>하루 몇 포 먹나요</u><small>답변: 하루 1포를 권해 드립니다. 물 없이 그대로...</small>', '정수아', Badge('공개', 'line'), '이보림', `${Btn('수정', { size: 'sm' })} ${Btn('숨김', { size: 'sm' })}`],
            ['11-10 15:12', `${P}`, `${lock}<u>카드 영수증 문의</u><small>답변: 마이페이지 > 주문 상세 > 영수증에서...</small>`, '강지호', Badge('비밀글', 'fill'), '정수아', `${Btn('수정', { size: 'sm' })} ${Btn('숨김', { size: 'sm' })}`],
            { dim: true, c: ['11-09 09:30', `${P}`, '<u>(광고) 최저가 구매대행 ...</u><small>답변 없음 · 숨김 사유: 광고·도배</small>', '비회원', Badge('숨김', 'x'), '이보림', `${Btn('숨김 풀기', { size: 'sm' })} ${Btn('삭제', { size: 'sm' })}`] },
        ] }),
        Pager({ page: 1, last: 3, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '숨김 버튼 → 사유 팝업(목록 열림)', right: '팝업만', pad: 20 },
            Modal({ title: '상품 문의 숨김', w: 460, foot: [Btn('취소'), Btn('숨김 처리', 'primary')] },
                FormTable([{ k: '사유', required: true, v: Select({ placeholder: '사유를 고르세요', w: 260, open: true, options: ['광고·도배', '욕설·비방', '개인정보가 들어 있음', '상품과 관계없는 내용', '기타(직접 입력)'] }) }]),
                '<div style="height:150px"></div>',
                Note('숨기면 상품 상세에서 사라지고 작성자에게는 "운영 정책에 따라 숨김 처리된 글입니다"로 보입니다. 지우지는 않습니다.'))),
        Canvas({ size: 'auto', label: '등록 완료 · 답변 없이 등록', right: '부분', pad: 20 },
            Toast('답변을 등록하고 박서준 님에게 알림톡을 보냈습니다.', { action: '다음 미답변 문의' }),
            '<div style="height:14px"></div>',
            `<div style="width:480px">${Textarea({ placeholder: '답변을 입력하세요', h: 70, count: '0 / 1,000', error: true })}<p class="err">${Icon('error-o')}답변 내용을 입력해 주세요.</p></div>`,
            '<div style="height:14px"></div>',
            Confirm({ w: 400, title: '선택한 2건에 같은 답변을 보낼까요?', desc: '배송 문의 2건 · 공개 답변<br>고객 2명에게 답변 알림이 갑니다.', ok: '2건 답변 등록' })),
    ),
);

const state3 = StateBlock({ idx: 3, title: '비밀글', note: '고객이 "비밀글"로 쓴 문의. 관리자에서는 내용이 다 보이지만 상품 상세에서는 작성자 본인만 볼 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '건강 상태·주문 정보처럼 남에게 보이기 싫은 질문은 비밀글로 들어옵니다. 관리자 목록에서는 자물쇠 표시와 "비밀글" 배지로 구분하고, 답변도 자동으로 작성자에게만 보이게 고정합니다(운영자가 실수로 공개하지 못하게 답변 공개 칸이 잠김).'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '비밀글의 제목과 내용은 상품 상세에서 다른 고객에게 "비밀글입니다"로만 보입니다. 운영자가 비밀글을 공개로 바꿀 수는 없습니다. 반대로 공개 글에 개인정보(전화번호·주소)가 들어 있으면 운영자가 비밀글로 바꿀 수 있습니다.'),
    Canvas({ label: 'A-51 · 비밀글 답변하기 → 오른쪽 답변 칸(답변 공개 칸이 잠김)' }, Overlay({ bg: Page('미답변', Table({ check: true, cols: COLS, rows: QS })), align: 'right', h: 860 }, answerDrawer({ secret: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '고객 화면에서 보이는 모습 — 상품 상세 문의 탭(다른 고객이 볼 때)', right: '참고', pad: 20 }, `<div style="width:620px">${Table({ cols: [{ t: '상태', w: 90 }, '문의', { t: '작성자', w: 80 }, { t: '작성일', w: 90 }], rows: [
            [Badge('답변완료', 'check'), '4박스 구성은 언제 다시 들어오나요?', '박*준', '11-11'],
            [Badge('답변완료', 'check'), `${lock}<span style="color:var(--mute)">비밀글입니다</span>`, '이*은', '11-11'],
            [Badge('답변대기', 'line'), '오늘 주문하면 내일 받을 수 있나요', '윤*연', '11-11'],
        ] })}${Note('작성자 이름은 고객 화면에서 가운데 글자를 가립니다. 비밀글은 본인이 로그인했을 때만 제목과 답변이 열립니다.')}</div>`),
        Canvas({ size: 'auto', label: '공개 글을 비밀글로 바꾸기(개인정보가 들어 있을 때)', right: '팝업만', pad: 20 },
            Confirm({ w: 420, title: '이 문의를 비밀글로 바꿀까요?', desc: '문의 내용에 휴대폰 번호가 들어 있습니다(010-****-4468).<br>비밀글로 바꾸면 작성자와 운영자만 볼 수 있고, 다시 공개로 되돌릴 수 없습니다.', ok: '비밀글로 바꾸기' })),
    ),
);

export default function A51() {
    return [state1, state2, state3].join('');
}
