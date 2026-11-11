import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Chips, Input, Select, Check, RadioGroup, CheckGroup, Toggle, Tabs,
    Textarea, FormTable, ListHead, BulkBar, Table, Overlay, Modal, Confirm, Toast, Upload, ImageGuide, Box, Note, Text, Icon, Flex, Grid, Img, Empty, DragRow,
    UserHeader, MobilePage,
} from '../lib/blocks.js';

const TABS = [{ t: '메인 슬라이드', n: 3 }, { t: '띠 배너', n: 3 }, { t: '팝업', n: 2 }];
const Page = (tab, o, ...body) => AdminLayout({ active: 'a-62', desc: '기간을 걸어 두면 시작 시각에 자동으로 올라가고 종료 시각에 내려갑니다.', actions: [Btn('순서 바꾸기', { icon: 'arrows-v' }), Btn(`${tab} 등록`, { kind: 'primary', icon: 'plus' })], ...o }, Tabs(TABS, tab), body);

const st = (s) => ({ '노출 중': Badge('노출 중', 'check'), 예약: Badge('예약', 'dash'), 종료: Badge('기간 종료', 'strike'), 꺼짐: Badge('꺼짐', 'mute') }[s]);
const acts = `${Btn('수정', { size: 'sm' })} ${Btn('복사', { size: 'sm' })}`;
const dev = (d) => `<span class="nw">${Icon(d === 'PC' ? 'desktop' : 'mobile')} ${d}</span>`;

const SLIDE_COLS = [{ t: '순서', w: 50, align: 'center' }, { t: '이미지', w: 130 }, '큰 글 · 버튼 · 이동', { t: '노출 기간', w: 150 }, { t: '기기', w: 96 }, { t: '상태', w: 96 }, { t: '눌린 수(7일)', w: 90, align: 'right' }, { t: '켜기', w: 56 }, { t: '', w: 116 }];
const slideRows = [
    [1, Img({ w: 110, h: 46, label: '1920 × 800' }), '하루 한 포, 롱제비티 젤리스틱<small>제품 살펴보기 → 상품 · 이너에라 롱지비티 석류맛 젤리스틱</small>', '계속', dev('PC · 모바일'), st('노출 중'), '412', Toggle('', { on: true }), acts],
    [2, Img({ w: 110, h: 46, label: '1920 × 800' }), '5가지 핵심 원료로 설계한 프리미엄 롱제비티 데일리 포뮬러<small>자세히 보기 → 콘텐츠 페이지 · 원료 이야기</small>', '계속', dev('PC · 모바일'), st('노출 중'), '138', Toggle('', { on: true }), acts],
    { dim: true, c: ['-', Img({ w: 110, h: 46, label: '1920 × 800' }), '블랙프라이데이, 2박스 구성 특가<small>지금 구매하기 → 상품</small>', '11-23 00:00<small>~ 11-30 23:59</small>', dev('PC · 모바일'), st('예약'), '-', Toggle('', { on: true }), acts] },
];

const BAND_COLS = [{ t: '순서', w: 50, align: 'center' }, '문구 · 이동', { t: '위치', w: 130 }, { t: '노출 기간', w: 150 }, { t: '기기', w: 96 }, { t: '상태', w: 96 }, { t: '켜기', w: 56 }, { t: '', w: 116 }];
const bandRows = [
    [1, '5가지 핵심 원료를 하루 한 포에 — 이너에라 롱지비티 보러가기<small>→ 상품 · 기본 문구(디자인 > 사이트 기본)와 같은 자리</small>', '맨 위 띠', '계속', dev('PC · 모바일'), st('노출 중'), Toggle('', { on: true }), acts],
    [2, '신규 가입하면 3,000원 쿠폰을 바로 드려요<small>→ 회원가입 · 쿠폰 기능이 켜져 있을 때만</small>', '맨 위 띠', '계속', dev('PC · 모바일'), st('노출 중'), Toggle('', { on: true }), acts],
    { dim: true, c: ['-', '11월 16일(월) 택배사 사정으로 출고가 하루 늦어집니다<small>이동 없음</small>', '맨 위 띠', '11-01 ~ 11-08', dev('PC · 모바일'), st('종료'), Toggle('', { on: false }), acts] },
];

const POP_COLS = [{ t: '순서', w: 50, align: 'center' }, { t: '이미지', w: 90 }, '제목(관리용) · 이동', { t: '위치 · 크기', w: 150 }, { t: '노출 페이지', w: 110 }, { t: '노출 기간', w: 140 }, { t: '상태', w: 96 }, { t: '켜기', w: 56 }, { t: '', w: 116 }];
const popRows = [
    [1, Img({ w: 60, h: 72, label: '600 × 720' }), '오픈 기념 무료배송 안내<small>→ 상품 · 오늘 하루 보지 않기 사용</small>', 'PC 왼쪽 위 · 400 px<small>모바일 가운데 · 화면 86%</small>', '메인', '11-02 ~ 11-30', st('노출 중'), Toggle('', { on: true }), acts],
    { dim: true, c: ['-', Img({ w: 60, h: 72, label: '600 × 720' }), '설 연휴 배송 일정 안내<small>이동 없음</small>', 'PC 가운데 · 480 px', '전체 페이지', '2027-01-25 ~ 02-02', st('예약'), Toggle('', { on: true }), acts] },
];

const Lh = (n, chips) => ListHead({ total: n, left: Chips(chips, chips[0]), right: [Check('기간 종료된 것도 보기', { on: true })] });

const state1 = StateBlock({ idx: 1, title: '유형 탭(메인 슬라이드·띠 배너·팝업)', note: '디자인 > 배너·팝업. 유형마다 탭이 나뉘고 탭마다 목록 칸이 다릅니다. 세 탭을 모두 그렸습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '행사·공지·배송 지연 안내는 대부분 배너와 팝업으로 나갑니다. 유형별로 넣는 것과 규격이 달라 탭으로 나누고, 목록에서 지금 노출 중인지·예약인지·끝났는지와 지난 7일 동안 몇 번 눌렸는지를 보여 줍니다. 끝난 배너는 지우지 않고 남겨 다음 행사 때 복사해 씁니다.'),
    Anno({ warn: true, title: '메인 화면 구성과의 관계' }, '메인 슬라이드 탭의 목록은 메인 화면 구성의 첫 배너 슬라이드 블록 안 장과 같은 것입니다(어느 화면에서 고쳐도 같이 바뀜). 메인 화면 구성은 블록의 자리와 순서를, 이 화면은 장마다의 기간 예약과 눌린 수를 봅니다. 띠 배너 탭이 비어 있으면 디자인 > 사이트 기본의 상단 띠 문구가 나옵니다.'),
    Canvas({ label: 'A-62 · 메인 슬라이드 탭' }, Page('메인 슬라이드', {}, Lh(3, ['전체 3', '노출 중 2', '예약 1', '종료 0']), Table({ check: true, cols: SLIDE_COLS, rows: slideRows }), Note('순서 숫자가 - 인 줄은 지금 화면에 안 나오는 배너입니다. 예약된 배너는 시작되면 맨 앞(1번)에 들어갑니다 — 등록할 때 정한 자리.'))),
    Canvas({ label: 'A-62 · 띠 배너 탭 (여러 개면 4초마다 위로 넘어가며 번갈아 나옴)' }, Page('띠 배너', {}, Lh(3, ['전체 3', '노출 중 2', '예약 0', '종료 1']), Table({ check: true, cols: BAND_COLS, rows: bandRows }))),
    Canvas({ label: 'A-62 · 팝업 탭' }, Page('팝업', {}, Lh(2, ['전체 2', '노출 중 1', '예약 1', '종료 0']), Table({ check: true, cols: POP_COLS, rows: popRows }), Note('같은 페이지에 팝업이 2개 넘게 겹치면 PC 는 옆으로 나란히, 모바일은 순서 1번 하나만 보여 줍니다(모바일에서 팝업이 겹치면 닫기 어렵습니다).', { warn: true }))),
    Canvas({ label: 'A-62 · 2건 선택 → 일괄 처리 바' }, Page('메인 슬라이드', {}, BulkBar({ count: 2, sub: '노출 중 2건' }, Btn('끄기'), Btn('켜기'), Btn('기간 한꺼번에 바꾸기', { icon: 'calendar' }), Btn('삭제', 'danger')), Table({ check: true, checked: [0, 1], cols: SLIDE_COLS, rows: slideRows }))),
    Canvas({ label: 'A-62 · 팝업 탭 · 등록된 팝업이 없을 때' }, Page('팝업', {}, Empty({ icon: 'image-o', title: '등록한 팝업이 없습니다', desc: '행사 안내·배송 지연 공지처럼 꼭 알려야 할 내용을 메인 화면에 띄울 수 있습니다.', action: Btn('팝업 등록', { kind: 'primary', icon: 'plus' }) }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '노출 중인 슬라이드의 스위치를 끌 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '이 슬라이드를 지금 내릴까요?', desc: '하루 한 포, 롱제비티 젤리스틱 — 끄는 즉시 메인 화면에서 빠집니다. 슬라이드가 1장만 남으면 넘김 없이 고정으로 보입니다.', ok: '지금 내리기' })),
        Canvas({ size: 'auto', label: '마지막 1장을 끄려 할 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '노출 중인 슬라이드가 하나도 없게 됩니다', desc: '슬라이드를 모두 끄면 메인 화면 맨 위 첫 배너 구역이 통째로 사라집니다. 계속할까요?', ok: '그래도 끄기', danger: true })),
    ),
);

const Cal = (o = {}) => {
    const cells = Array.from({ length: 30 }, (_, i) => i + 1);
    const cell = (d) => {
        const edge = d === o.from || d === o.to;
        const mid = o.from && o.to && d > o.from && d < o.to;
        const s = edge ? 'background:var(--dark);color:#fff;font-weight:700;border-radius:4px' : mid ? 'background:var(--fill)' : d < 11 ? 'color:#b9b9c0;text-decoration:line-through' : d === 11 ? 'border:1px solid var(--dark);border-radius:4px' : '';
        return `<span style="height:30px;line-height:30px;${s}">${d}</span>`;
    };
    return `<div style="width:264px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:12px;font-size:12.5px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">${Icon('angle-left-min')}<b>2026년 11월</b>${Icon('angle-right-min')}</div><div style="display:grid;grid-template-columns:repeat(7,34px);text-align:center;row-gap:2px">${['일', '월', '화', '수', '목', '금', '토'].map((d) => `<span style="color:var(--mute);height:26px">${d}</span>`).join('')}${cells.map(cell).join('')}</div><div style="display:flex;gap:6px;margin-top:8px">${['오늘부터 7일', '이번 달 말까지', '기간 없음'].map((t) => Btn(t, { size: 'sm' })).join('')}</div><div style="margin-top:8px;font-size:11.5px;color:var(--mute);line-height:1.7">테두리 = 오늘 · 줄 그은 날 = 지난 날(고를 수 없음) · 채운 칸 = 시작·종료 · 옅은 칸 = 기간</div></div>`;
};

const periodRow = (o = {}) => ({ k: '노출 기간', required: true, v: [RadioGroup(['계속', '기간 정하기'], '기간 정하기'), Input({ value: o.from || '2026-11-23 00:00', icon: 'calendar', w: 170, focus: o.cal }), '~', Input({ value: o.to || '2026-11-30 23:59', icon: 'calendar', w: 170, error: o.err })], help: '시작 시각에 자동으로 올라가고 종료 시각에 자동으로 내려갑니다.', error: o.err ? '종료일이 시작일보다 빠릅니다. 종료일을 11-23 뒤로 골라 주세요.' : undefined });
const devRow = { k: '노출 기기', required: true, v: CheckGroup(['PC', '모바일'], ['PC', '모바일']) };
const linkRow = (kind, target) => ({ k: '누르면 이동', v: [Select({ value: kind, w: 150 }), Select({ value: target, w: 300 }), Check('새 창으로 열기')], help: '상품 · 카테고리 · 콘텐츠 페이지 · 기획전 · 게시판 · 외부 주소 · 이동 없음 중에서 고릅니다.' });

const slideForm = (o = {}) => FormTable([
    { k: 'PC 이미지', required: true, v: Upload({ title: 'PC 이미지 고르기', button: '파일 바꾸기', guide: ImageGuide({ size: '1920 × 800 px', ratio: '12:5', max: '2MB 이하', more: ['가운데 1280 px 안에 주요 피사체 · 글자는 이미지에 넣지 않기'] }), files: [{ name: 'bf_2box_pc.jpg', size: '388KB · 1920 × 800', icon: 'image-o' }] }) },
    { k: '모바일 이미지', v: Upload({ title: '모바일 이미지 고르기', guide: ImageGuide({ size: '750 × 900 px', ratio: '5:6', max: '1MB 이하', more: ['안 올리면 PC 이미지 가운데를 잘라 씁니다'] }) }) },
    { k: '작은 글 · 큰 글', required: true, v: [Input({ value: 'Black Friday', w: 180 }), Input({ value: '블랙프라이데이, 2박스 구성 특가', w: 340 })] },
    { k: '버튼 문구', v: Input({ value: '지금 구매하기', w: 200 }) },
    linkRow('상품', '이너에라 롱지비티 석류맛 젤리스틱'),
    periodRow(o), devRow,
    { k: '들어갈 자리', v: RadioGroup(['맨 앞(1번)', '맨 뒤'], '맨 앞(1번)'), help: '시작 시각이 되면 이 자리에 들어갑니다. 나중에 순서 바꾸기에서 옮길 수 있습니다.' },
]);

const bandForm = FormTable([
    { k: '문구', required: true, v: Input({ value: '블랙프라이데이 — 11월 30일까지 2박스 구성 특가', w: 520 }), help: '27 / 40자 · 모바일 한 줄은 22자 안팎, 넘으면 옆으로 흐릅니다.' },
    { k: '배경색 · 글자색', v: [`<span style="display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 10px;border:1px solid var(--line);border-radius:4px;font-size:12.5px"><span style="width:20px;height:20px;border-radius:3px;background:var(--dark)"></span>대표색 #7A1F2B</span>`, Btn('색 고르기', { size: 'sm', icon: 'palette' }), RadioGroup(['밝은 글자', '어두운 글자'], '밝은 글자')] },
    linkRow('상품', '이너에라 롱지비티 석류맛 젤리스틱'),
    { k: '닫기 버튼', v: Check('고객이 닫을 수 있게 하기 (닫으면 하루 동안 안 보임)', { on: true }) },
    periodRow(), devRow,
]);

const popForm = () => FormTable([
    { k: '제목(관리용)', required: true, v: Input({ value: '오픈 기념 무료배송 안내', w: 360 }), help: '목록에서 알아보는 이름입니다. 고객에게는 안 보입니다.' },
    { k: '이미지', required: true, v: Upload({ title: '팝업 이미지 고르기', button: '파일 바꾸기', guide: ImageGuide({ size: '600 × 720 px (세로형) 또는 600 × 600 px', ratio: '5:6 또는 1:1', max: '500KB 이하', more: ['모바일에서도 같은 이미지를 화면 폭에 맞춰 줄여 씁니다 — 글자는 24 px 이상으로'] }), files: [{ name: 'open_freeship_popup.jpg', size: '212KB · 600 × 720', icon: 'image-o' }] }) },
    { k: '대체 글', required: true, v: Input({ value: '오픈 기념 11월 한 달 전 상품 무료배송', w: 420 }), help: '이미지 속 글을 그대로 적어 주세요. 화면 읽기 프로그램과 검색에 쓰입니다.' },
    linkRow('상품', '이너에라 롱지비티 석류맛 젤리스틱'),
    { k: 'PC 위치 · 크기', v: [Select({ value: '왼쪽 위', w: 130 }), [Text('가로', { sm: true }), Input({ value: '400', suffix: 'px', w: 110 }), Text('위에서', { sm: true }), Input({ value: '120', suffix: 'px', w: 100 }), Text('왼쪽에서', { sm: true }), Input({ value: '40', suffix: 'px', w: 100 })]], help: '가로 280 ~ 600 px. 세로는 이미지 비율대로 정해집니다. 가운데를 고르면 뒤 화면이 어두워집니다.' },
    { k: '모바일 위치', v: RadioGroup(['가운데', '아래에서 올라오는 시트'], '가운데'), help: '모바일은 화면 폭의 86% 로 고정입니다.' },
    { k: '닫기 방식', v: [Check('오늘 하루 보지 않기', { on: true }), Check('7일 동안 보지 않기'), Check('닫기 버튼만')], help: '고객이 고른 뒤에는 그 기간 동안 같은 기기에서 다시 뜨지 않습니다.' },
    { k: '노출 페이지', required: true, v: CheckGroup(['메인', '상품 목록', '상품 상세', '장바구니', '전체 페이지'], ['메인']), help: '주문서·결제 화면에는 팝업을 띄우지 않습니다(결제를 방해하지 않게).' },
    { k: '보여 줄 고객', v: RadioGroup(['모두', '로그인 안 한 고객만', '회원만'], '모두') },
    periodRow({ from: '2026-11-02 00:00', to: '2026-11-30 23:59' }), devRow,
]);

const PopPreviewPc = `<div style="position:relative;border:1px solid var(--line);height:330px;overflow:hidden;width:560px"><div style="zoom:.44">${UserHeader({})}${Img({ h: 520, label: '메인 화면' })}</div><div style="position:absolute;left:18px;top:54px;width:176px;border:1px solid var(--dark);background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.2)">${Img({ h: 190, label: '팝업 이미지 600 × 720' })}<div style="display:flex;justify-content:space-between;font-size:10.5px;padding:6px 8px;background:var(--dark);color:#fff"><span>오늘 하루 보지 않기</span><span>닫기 ${Icon('close-min')}</span></div></div></div>`;

const PopPreviewM = MobilePage({ tab: '홈' }, `<div style="position:relative;height:560px">${Img({ h: 560, label: '메인 화면' })}<div style="position:absolute;inset:0;background:rgba(20,20,26,.5)"></div><div style="position:absolute;left:7%;top:60px;width:86%;background:#fff;border-radius:6px;overflow:hidden">${Img({ h: 380, label: '팝업 이미지 (화면 폭 86%)' })}<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:12px 14px;border-top:1px solid var(--line)"><span>${Icon('check-min')} 오늘 하루 보지 않기</span><b>닫기</b></div></div></div>`);

const RegModal = (type, w, ...body) => Modal({ title: `${type} 등록`, w, foot: [Btn('취소'), Btn('미리보기', { icon: 'eye-o' }), Btn('등록', 'primary')] }, body);

const state2 = StateBlock({ idx: 2, title: '등록(유형별 입력칸·이미지 규격 안내·기간·기기)', note: '탭마다 등록 버튼을 누르면 그 유형에 맞는 입력칸만 있는 등록 화면이 열립니다. 수정도 같은 화면입니다.' },
    Anno({ title: '유형별 입력칸 분기' }, '메인 슬라이드 = PC·모바일 이미지 + 큰 글·버튼·링크 + 들어갈 자리 / 띠 배너 = 문구·배경색·닫기 버튼(이미지 없음) / 팝업 = 이미지 한 장 + PC 위치·크기 + 모바일 위치 + 오늘 하루 보지 않기 + 노출 페이지 + 보여 줄 고객. 기간·기기·링크는 세 유형 공통입니다.'),
    Anno({ warn: true, title: '자산 규격' }, '슬라이드 PC 1920 × 800(2MB) · 모바일 750 × 900(1MB), 팝업 600 × 720 또는 600 × 600(500KB), 확장자는 JPG · PNG · WEBP. 움직이는 GIF 는 용량이 커서 받지 않습니다. 규격이 안 맞으면 올리는 순간 파일 줄에 이유가 나옵니다.'),
    Canvas({ label: 'A-62 · 메인 슬라이드 탭 → 메인 슬라이드 등록 버튼 → 등록 팝업' }, Overlay({ bg: Page('메인 슬라이드', {}, Table({ check: true, cols: SLIDE_COLS, rows: slideRows })), h: 1180 }, RegModal('메인 슬라이드', 820, slideForm()))),
    CanvasRow(
        Canvas({ size: 'auto', label: '노출 기간 시작일을 눌렀을 때 · 달력', right: '부분', pad: 20 }, `<div style="width:720px">${FormTable([periodRow({ cal: true })])}</div>${Cal({ from: 23, to: 30 })}`),
        Canvas({ size: 'auto', label: '입력 오류 · 이미지 확장자 + 종료일이 시작일보다 빠름', right: '부분', pad: 20 }, `<div style="width:720px">${FormTable([{ k: 'PC 이미지', required: true, v: Upload({ title: 'PC 이미지 고르기', guide: ['권장 크기 1920 × 800 px · 2MB 이하 · JPG · PNG · WEBP'], files: [{ name: 'bf_banner_final.gif', size: '4.1MB', error: 'GIF 는 올릴 수 없습니다. JPG · PNG · WEBP 로 저장해 올려 주세요.' }] }) }, periodRow({ from: '2026-11-23 00:00', to: '2026-11-20 23:59', err: true })])}</div>`),
    ),
    Canvas({ size: 'auto', label: '띠 배너 등록 (이미지 칸 없음 · 문구와 색)', right: '팝업만', pad: 20 }, RegModal('띠 배너', 820, bandForm, Box({ flat: true, title: '미리보기' }, `<div style="background:var(--dark);color:#fff;text-align:center;font-size:12.5px;padding:9px;position:relative">블랙프라이데이 — 11월 30일까지 2박스 구성 특가<span style="position:absolute;right:12px">${Icon('close-min')}</span></div>`))),
    Canvas({ size: 'auto', label: '팝업 등록 (위치 · 크기 · 오늘 하루 보지 않기 · 노출 페이지)', right: '팝업만', pad: 20 }, RegModal('팝업', 860, popForm())),
    CanvasRow(
        Canvas({ size: 'auto', label: '팝업 · PC 위치 목록을 연 모습', right: '부분', pad: 20 }, `<div style="width:520px;min-height:250px">${FormTable([{ k: 'PC 위치 · 크기', v: Select({ value: '왼쪽 위', w: 150, open: true, options: [{ t: '왼쪽 위', on: true }, { t: '가운데', sub: '뒤 화면 어둡게' }, '오른쪽 위', '왼쪽 아래', '오른쪽 아래'] }) }])}</div>`),
        Canvas({ size: 'auto', label: '팝업 미리보기 · PC (왼쪽 위 · 400 px)', right: '부분', pad: 20 }, PopPreviewPc),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: '팝업 미리보기 · 모바일 (가운데 · 뒤 화면 어둡게)' }, PopPreviewM),
        Canvas({ size: 'auto', label: '등록 완료 (예약)', right: '토스트만', pad: 20 }, Toast('슬라이드를 등록했습니다. 11월 23일(월) 00:00 에 자동으로 올라갑니다.', { action: '미리보기' })),
    ),
    Canvas({ size: 'auto', label: '수정 화면에서 삭제를 눌렀을 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '이 팝업을 삭제할까요?', desc: '오픈 기념 무료배송 안내 — 지금 노출 중입니다. 삭제하면 바로 내려가고 되살릴 수 없습니다. 다음에 다시 쓰려면 삭제 대신 끄기를 권합니다.', foot: [Btn('취소'), Btn('끄기만 하기'), Btn('삭제', 'danger')] })),
);

const ord = (n, t, sub, o = {}) => DragRow({ off: o.off, right: [o.off ? Badge(o.off, o.off === '예약' ? 'dash' : 'mute') : Badge('노출 중', 'check'), o.off ? '' : `<span style="display:inline-flex;gap:4px">${Btn('', { size: 'sm', icon: 'angle-up' })}${Btn('', { size: 'sm', icon: 'angle-down' })}</span>`] }, `<div style="display:flex;gap:12px;align-items:center"><b style="width:18px;text-align:center">${n}</b>${Img({ w: 96, h: 40 })}<div style="font-size:13px"><b>${t}</b><div style="font-size:12px;color:var(--mute)">${sub}</div></div></div>`);

const orderModal = (moved) => Modal({ title: '순서 바꾸기 · 메인 슬라이드', w: 640, foot: [Btn('취소'), Btn('순서 저장', { kind: 'primary', disabled: !moved })] },
    Text('줄을 끌거나 오른쪽 화살표로 옮기세요. 위에 있는 것이 먼저 나옵니다.', { sm: true, mute: true }),
    moved
        ? [ord(1, '5가지 핵심 원료로 설계한 프리미엄 롱제비티 데일리 포뮬러', '자세히 보기 → 원료 이야기 · 2번에서 옮김'), ord(2, '하루 한 포, 롱제비티 젤리스틱', '제품 살펴보기 → 상품')]
        : [ord(1, '하루 한 포, 롱제비티 젤리스틱', '제품 살펴보기 → 상품'), ord(2, '5가지 핵심 원료로 설계한 프리미엄 롱제비티 데일리 포뮬러', '자세히 보기 → 원료 이야기')],
    Text('지금 화면에 안 나오는 것 (순서 없음)', { sm: true, b: true }),
    ord('-', '블랙프라이데이, 2박스 구성 특가', '11-23 시작 · 시작되면 맨 앞(1번)에 들어감', { off: '예약' }),
);

const state3 = StateBlock({ idx: 3, title: '순서', note: '순서 바꾸기 버튼을 누르면 지금 노출 중인 것만 모아 순서를 정합니다. 슬라이드는 넘어가는 순서, 띠 배너는 번갈아 나오는 순서, 팝업은 겹칠 때 앞에 오는 순서입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '목록 표에서 바로 끌게 하면 기간이 끝난 것·예약된 것이 섞여 실제 화면 순서와 달라 보입니다. 순서 화면에서는 지금 나오는 것만 번호를 매겨 보여 주고, 끌기와 위아래 화살표 두 가지 수단을 줍니다(끌기가 어려운 노트북 터치패드 사용자용).'),
    Canvas({ label: 'A-62 · 순서 바꾸기 버튼 → 팝업' }, Overlay({ bg: Page('메인 슬라이드', {}, Table({ check: true, cols: SLIDE_COLS, rows: slideRows })), h: 560 }, orderModal(false))),
    CanvasRow(
        Canvas({ size: 'auto', label: '2번을 1번으로 옮긴 뒤 → 순서 저장 활성', right: '팝업만', pad: 20 }, orderModal(true)),
        Canvas({ size: 'auto', label: '순서 저장 완료', right: '토스트만', pad: 20 }, Toast('슬라이드 순서를 저장했습니다. 메인 화면에 바로 반영됐습니다.', { action: '내 쇼핑몰 보기' })),
    ),
);

export default function A62() {
    return [state1, state2, state3].join('');
}
