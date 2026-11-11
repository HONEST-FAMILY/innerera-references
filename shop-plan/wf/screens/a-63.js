import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Input, Select, Check, RadioGroup, Toggle, Tabs,
    FormTable, Overlay, Modal, Confirm, Toast, Box, Note as NoteBase, Text, Icon, Flex, DragRow, UserHeader, MobilePage, Drawer, Img, SHOP,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const TABS = [{ t: '상단 메뉴', n: 5 }, { t: '서랍 메뉴(모바일)', n: 9 }, { t: '바닥글 링크', n: 11 }];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-63', desc: '고객이 보는 메뉴 이름·순서·이동할 곳을 정합니다. 저장하면 바로 반영됩니다.', actions: [Btn('처음 구성으로 되돌리기'), Btn(o.dirty ? '저장' : '저장됨', { kind: 'primary', disabled: !o.dirty })], ...o }, Tabs(TABS, tab), body);

const kindIcon = { '콘텐츠 페이지': 'file-text-o', 카테고리: 'folder-o', 상품: 'box', 게시판: 'forum-o', '외부 주소': 'external-link', '쇼핑몰 화면': 'layout-o' };
const row = (name, kind, target, o = {}) => `<div style="${o.child ? 'margin-left:34px' : ''}">${DragRow({ off: o.off, right: [
    o.warn ? Badge(o.warn, 'warn') : '',
    o.strong ? Badge('강조 버튼', 'bold') : '',
    o.lock ? `<span style="font-size:12px;color:var(--mute)">${Icon('lock-o')} 지울 수 없음</span>` : '',
    Toggle('', { on: !o.off }),
    Btn('고치기', { size: 'sm' }),
    o.lock ? '' : `<span style="color:var(--ink2)">${Icon('trash-o')}</span>`,
] }, `<div style="display:flex;align-items:center;gap:10px;font-size:13.5px"><b style="min-width:${o.child ? 96 : 110}px">${name}</b><span style="font-size:12px;color:var(--ink2);white-space:nowrap">${Icon(kindIcon[kind] || 'link')} ${kind}</span><span style="font-size:12px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${target}</span></div>`)}</div>`;

const AddRow = (t) => `<div style="border:1.5px dashed var(--line);border-radius:4px;padding:10px;text-align:center;font-size:13px;color:var(--ink2);margin-bottom:6px">${Icon('plus')} ${t}</div>`;

const TopList = (o = {}) => [
    row('브랜드 이야기', '콘텐츠 페이지', '브랜드 이야기 · /pages/brand'),
    row('원료 이야기', '콘텐츠 페이지', '원료 이야기 · /pages/ingredients'),
    row('상품', o.oneProduct === false ? '카테고리' : '상품', o.oneProduct === false ? '전체 상품 · /products' : `${SHOP.productShort} · 상품이 1개라 상세로 바로 이동`),
    row('리뷰', '쇼핑몰 화면', '전체 리뷰 모음', o.reviewOff ? { off: true, warn: '리뷰 기능 꺼짐 · 자동 숨김' } : {}),
    row('고객센터', '게시판', '공지사항 · /notice'),
    row('공지사항', '게시판', '공지사항 · /notice', { child: true }),
    row('자주 묻는 질문', '게시판', '자주 묻는 질문 · /faq', { child: true }),
    row('1:1 문의', '쇼핑몰 화면', '마이페이지 > 문의 (로그인 필요)', { child: true }),
    o.broken ? row('블랙프라이데이', '콘텐츠 페이지', '삭제된 페이지', { warn: '연결한 페이지가 삭제됨', off: true }) : '',
    AddRow('메뉴 추가 (상단 메뉴는 7개까지 · 하위 메뉴는 메뉴마다 8개까지)'),
    Text('오른쪽 끝 버튼', { b: true }),
    row('구매하기', '상품', `${SHOP.productShort}`, { strong: true }),
];

const Preview = (title, body) => Box({ flat: true, title, sub: '저장 전 모습' }, body);

const HeaderPreview = `<div style="border:1px solid var(--line);background:#fff;overflow:hidden"><div style="zoom:.72">${UserHeader({ band: false, active: '고객센터' })}<div style="position:relative;height:120px"><div style="position:absolute;left:560px;top:0;width:170px;border:1px solid var(--line);background:#fff;font-size:14px;padding:8px 0">${['공지사항', '자주 묻는 질문', '1:1 문의'].map((t) => `<div style="padding:8px 16px">${t}</div>`).join('')}</div></div></div></div>`;

const LinkKinds = ['콘텐츠 페이지', '카테고리', '상품', '게시판', '쇼핑몰 화면', '외부 주소'];
const kindRow = (k) => ({ k: '이동할 곳 종류', required: true, v: RadioGroup(LinkKinds, k) });
const nameRow = (v, o = {}) => ({ k: '메뉴 이름', required: true, v: Input({ value: v, placeholder: '예: 브랜드 이야기', w: 260, error: o.err }), help: '상단 메뉴는 8자, 서랍 메뉴·바닥글은 14자까지 권합니다.', error: o.err ? '메뉴 이름을 넣어 주세요.' : undefined });
const posRow = { k: '놓을 자리', v: [Select({ value: '맨 위 단계 (1단)', w: 200 }), Text('하위 메뉴로 넣으려면 위 단계 메뉴를 고르세요', { sm: true, mute: true })] };
const showRow = { k: '보여 줄 고객', v: RadioGroup(['모두', '로그인 안 한 고객만', '회원만'], '모두') };

const addModal = (title, rows, o = {}) => Modal({ title, w: 760, foot: [Btn('취소'), Btn(o.ok || '메뉴 추가', { kind: 'primary', disabled: o.disabled })] }, FormTable(rows));

const catOpen = Select({ value: '젤리스틱', w: 320, open: true, search: '', options: [{ t: '전체 상품', sub: '/products' }, { t: '젤리스틱', sub: '상품 1개', on: true }, { t: '　선물 세트', sub: '젤리스틱 > 선물 세트 · 상품 1개' }, { t: '체험 구성', sub: '상품 0개 · 메뉴에 넣으면 빈 목록이 보임' }] });
const prodOpen = Select({ value: '', placeholder: '상품명으로 찾기', w: 420, open: true, search: '롱지', options: [{ t: SHOP.product, sub: '판매중', on: true }, { t: '이너에라 롱지비티 선물 세트', sub: '판매중' }, { t: '이너에라 롱지비티 체험 3포', sub: '판매중지', disabled: true }] });
const boardOpen = Select({ value: '공지사항', w: 260, open: true, options: [{ t: '공지사항', sub: '/notice', on: true }, { t: '자주 묻는 질문', sub: '/faq' }, { t: '상품 문의 모음', sub: '상품 문의 기능 꺼짐', disabled: true }] });
const viewOpen = Select({ value: '전체 리뷰 모음', w: 280, open: true, options: [{ t: '메인', sub: '/' }, { t: '전체 리뷰 모음', sub: '/reviews', on: true }, { t: '장바구니', sub: '/cart' }, { t: '주문 조회 (비회원 포함)', sub: '/guest/orders' }, { t: '마이페이지 > 문의', sub: '로그인 필요' }, { t: '회원가입', sub: '/join' }, { t: '기획전 목록', sub: '/events' }] });

const DrawerList = (same) => (same
    ? [Note('상단 메뉴와 똑같이 쓰는 중입니다. 상단 메뉴를 고치면 서랍 메뉴도 같이 바뀝니다. 서랍 메뉴만 따로 꾸미려면 위 스위치를 끄세요.'), `<div style="opacity:.55">${TopList().slice(0, 8).join('')}</div>`]
    : [
        row('브랜드 이야기', '콘텐츠 페이지', '브랜드 이야기 · /pages/brand'),
        row('Daily Ritual', '쇼핑몰 화면', '메인 화면의 Daily Ritual 블록으로 내려가기'),
        row('원료 이야기', '콘텐츠 페이지', '원료 이야기 · /pages/ingredients'),
        row('구매하기', '상품', SHOP.productShort, { strong: true }),
        row('리뷰', '쇼핑몰 화면', '전체 리뷰 모음'),
        row('공지사항', '게시판', '공지사항 · /notice'),
        row('자주 묻는 질문', '게시판', '자주 묻는 질문 · /faq'),
        row('1:1 문의', '쇼핑몰 화면', '마이페이지 > 문의 (로그인 필요)'),
        row('비회원 주문 조회', '쇼핑몰 화면', '주문 조회 · /guest/orders · 비회원 주문 기능이 켜져 있을 때만'),
        AddRow('메뉴 추가 (서랍 메뉴는 16개까지)'),
    ]);

const fgroup = (title, items) => `<div style="border:1px solid var(--line);border-radius:6px;padding:12px;background:#fff"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">${Icon('drag-vertical')}${Input({ value: title, w: 150 })}<span style="margin-left:auto;color:var(--ink2)">${Icon('trash-o')}</span></div>${items.map(([n, t, lock]) => `<div style="display:flex;align-items:center;gap:8px;border:1px solid var(--line2);border-radius:4px;padding:8px;margin-bottom:5px;font-size:12.5px">${Icon('drag-vertical')}<div style="flex:1;min-width:0"><b>${n}</b><div style="color:var(--mute);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t}</div></div>${lock ? Icon('lock-o') : Icon('pen-o')}</div>`).join('')}<div style="border:1.5px dashed var(--line);border-radius:4px;padding:7px;text-align:center;font-size:12px;color:var(--ink2)">${Icon('plus')} 링크 추가</div></div>`;

const FooterTab = [
    Text('바닥글 링크 묶음 (묶음은 4개까지 · 끌어서 묶음 순서와 링크 순서를 바꿉니다)', { b: true }),
    `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px">${fgroup('STORY', [['브랜드', '콘텐츠 페이지 · 브랜드 이야기'], ['Daily Ritual', '화면 · 메인의 Daily Ritual 블록'], ['원료 이야기', '콘텐츠 페이지 · 원료 이야기']])}${fgroup('SHOP', [['구매하기', `상품 · ${SHOP.productShort}`], ['주문 조회', '화면 · 주문 조회'], ['배송 안내', '콘텐츠 페이지 · 배송 안내']])}${fgroup('HELP', [['공지사항', '게시판 · 공지사항'], ['자주 묻는 질문', '게시판 · 자주 묻는 질문'], ['1:1 문의', '화면 · 마이페이지 > 문의']])}<div style="border:1.5px dashed var(--line);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--ink2);min-height:120px">${Icon('plus')} 묶음 추가</div></div>`,
    Text('반드시 들어가는 링크 (법으로 정해진 표시 · 지우거나 끌 수 없음)', { b: true }),
    row('개인정보 처리방침', '쇼핑몰 화면', '설정 > 약관·정책의 시행 중 버전 · 굵게 표시', { lock: true }),
    row('이용약관', '쇼핑몰 화면', '설정 > 약관·정책의 시행 중 버전', { lock: true }),
    Note('사업자 정보(상호·대표·사업자등록번호·주소·고객센터)는 설정 > 쇼핑몰 정보에서, SNS 아이콘은 디자인 > 사이트 기본에서 바꿉니다.'),
];

const state1 = StateBlock({ idx: 1, title: '상단 메뉴·서랍 메뉴·바닥글 링크 편집, 순서', note: '디자인 > 메뉴. 탭 3개(상단 메뉴 · 서랍 메뉴 · 바닥글 링크)에서 메뉴 이름·이동할 곳·순서·켜고 끄기를 정합니다. 세 탭과 메뉴 추가 팝업의 종류별 입력칸을 모두 그렸습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '메뉴는 고객사마다 다르고(브랜드 이야기가 없는 몰, 카테고리가 20개인 몰) 행사 때 잠깐 늘어납니다. 주소를 손으로 치게 하면 오타로 없는 페이지가 열리므로, 이동할 곳은 종류를 고른 뒤 이름으로 찾아 고릅니다. 순서는 끌어서 바꾸고 하위 메뉴는 오른쪽으로 들여 넣어 2단까지 만듭니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '① 연결한 페이지·상품이 삭제되거나 기능이 꺼지면(리뷰를 끈 몰의 리뷰 메뉴) 그 메뉴는 고객 화면에서 자동으로 숨고 여기에는 경고가 뜹니다. ② 개인정보 처리방침·이용약관 링크는 법으로 정해진 표시라 지우거나 끌 수 없습니다. ③ 초기값은 상단 = 상품 · 고객센터, 서랍 = 상단과 똑같이, 바닥글 = 필수 링크 2개입니다.'),
    Canvas({ label: 'A-63 · 상단 메뉴 탭 (1단 5개 · 고객센터 아래 하위 메뉴 3개 · 강조 버튼)' }, Page('상단 메뉴', {}, TopList(), Preview('미리보기 · PC 머리 (고객센터에 마우스를 올린 모습)', HeaderPreview))),
    Canvas({ label: 'A-63 · 메뉴 추가 버튼 → 팝업 · 종류 = 콘텐츠 페이지' }, Overlay({ bg: Page('상단 메뉴', {}, TopList()), h: 600 },
        addModal('메뉴 추가 · 상단 메뉴', [nameRow('블랙프라이데이'), kindRow('콘텐츠 페이지'), { k: '콘텐츠 페이지', required: true, v: Select({ value: '블랙프라이데이 안내', w: 320, open: true, search: '', options: [{ t: '브랜드 이야기', sub: '/pages/brand · 공개' }, { t: '원료 이야기', sub: '/pages/ingredients · 공개' }, { t: '배송 안내', sub: '/pages/shipping · 공개' }, { t: '블랙프라이데이 안내', sub: '/pages/black-friday · 비공개', on: true }] }), help: '비공개 페이지를 연결하면 페이지를 공개할 때까지 메뉴가 고객에게 안 보입니다.' }]))),
    CanvasRow(
        Canvas({ size: 'auto', label: '종류 = 카테고리 (카테고리 나무를 연 모습)', right: '팝업만', pad: 20 }, `<div style="min-height:420px">${addModal('메뉴 추가 · 상단 메뉴', [nameRow('젤리스틱'), kindRow('카테고리'), { k: '카테고리', required: true, v: [catOpen], help: '하위 카테고리를 하위 메뉴로 자동으로 펼치기' }])}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '종류 = 상품 (검색형 · 판매중지는 고를 수 없음)', right: '팝업만', pad: 20 }, `<div style="min-height:400px">${addModal('메뉴 추가 · 상단 메뉴', [nameRow('구매하기'), kindRow('상품'), { k: '상품', required: true, v: prodOpen }])}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '종류 = 게시판', right: '부분', pad: 20 }, `<div style="width:560px;min-height:230px">${FormTable([{ k: '게시판', required: true, v: boardOpen }])}</div>`),
        Canvas({ size: 'auto', label: '종류 = 쇼핑몰 화면', right: '부분', pad: 20 }, `<div style="width:560px;min-height:380px">${FormTable([{ k: '쇼핑몰 화면', required: true, v: viewOpen }])}</div>`),
    ),
    Canvas({ size: 'auto', label: '종류 = 외부 주소 · 입력 오류 (이름 비움 · 주소 형식)', right: '팝업만', pad: 20 }, addModal('메뉴 추가 · 상단 메뉴', [nameRow('', { err: true }), kindRow('외부 주소'), { k: '주소', required: true, v: [Input({ value: 'smartstore.naver.com/innerera', w: 420, error: true }), Check('새 창으로 열기', { on: true })], error: '주소는 https:// 로 시작해야 합니다. 예: https://smartstore.naver.com/innerera' }, posRow, showRow])),
    Canvas({ label: 'A-63 · 상단 메뉴 탭 · 경고가 있는 메뉴 (리뷰 기능 꺼짐 → 자동 숨김 · 연결한 페이지 삭제됨)' }, Page('상단 메뉴', { dirty: true }, Note('고객에게 안 보이는 메뉴가 2개 있습니다. 이동할 곳을 다시 고르거나 메뉴를 지워 주세요.', { warn: true }), TopList({ reviewOff: true, broken: true }))),
    Canvas({ label: 'A-63 · 서랍 메뉴(모바일) 탭 · 상단 메뉴와 똑같이 쓰기 켬 (초기값)' }, Page('서랍 메뉴(모바일)', {}, Flex({ justify: 'space-between', align: 'center' }, Toggle('상단 메뉴와 똑같이 쓰기', { on: true }), Text('모바일 왼쪽 위 줄 세 개를 누르면 열리는 메뉴', { sm: true, mute: true })), DrawerList(true))),
    Canvas({ label: 'A-63 · 서랍 메뉴(모바일) 탭 · 따로 꾸미기 (이너에라 시안 구성)' }, Page('서랍 메뉴(모바일)', { dirty: true }, Flex({ justify: 'space-between', align: 'center' }, Toggle('상단 메뉴와 똑같이 쓰기', { on: false }), Check('서랍 맨 위에 로그인·회원가입 버튼 보이기', { on: true })), DrawerList(false))),
    CanvasRow(
        Canvas({ size: 'mobile', label: '서랍 메뉴 미리보기 (모바일 · 로그인 전)' }, Overlay({ bg: MobilePage({}, Img({ h: 640, label: '메인 화면' })), align: 'left', h: 720 }, Drawer({ loggedIn: false, menu: ['브랜드 이야기', 'Daily Ritual', '원료 이야기', '구매하기', '리뷰', '공지사항', '자주 묻는 질문', '1:1 문의', '비회원 주문 조회'] }))),
        Canvas({ size: 'auto', label: '하위 메뉴가 있는 메뉴를 지울 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '고객센터 메뉴를 지울까요?', desc: '하위 메뉴 3개(공지사항 · 자주 묻는 질문 · 1:1 문의)도 함께 지워집니다. 페이지와 게시판 자체는 지워지지 않고 메뉴에서만 빠집니다.', foot: [Btn('취소'), Btn('하위 메뉴를 1단으로 올리고 지우기'), Btn('함께 지우기', 'danger')] })),
    ),
    Canvas({ label: 'A-63 · 바닥글 링크 탭 (묶음 3개 + 필수 링크)' }, Page('바닥글 링크', {}, FooterTab)),
    CanvasRow(
        Canvas({ size: 'auto', label: '상단 메뉴가 7개일 때 메뉴 추가를 누름', right: '토스트만', pad: 20 }, Toast('상단 메뉴는 7개까지 넣을 수 있습니다. 하위 메뉴로 넣거나 서랍 메뉴에 넣어 주세요.', { kind: 'error' })),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('메뉴를 저장했습니다. 쇼핑몰에 바로 반영됐습니다.', { action: '내 쇼핑몰 보기' })),
    ),
    Canvas({ size: 'auto', label: '처음 구성으로 되돌리기 버튼', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '메뉴를 처음 구성으로 되돌릴까요?', desc: '상단 메뉴 · 서랍 메뉴 · 바닥글 링크가 설치 직후 구성(상품 · 고객센터 · 필수 링크)으로 돌아갑니다. 지금 구성은 사라집니다.', ok: '되돌리기', danger: true })),
);

export default function A63() {
    return [state1].join('');
}
