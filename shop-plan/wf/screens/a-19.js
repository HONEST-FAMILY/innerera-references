import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Chips, Input, Select, Check, Radio, RadioGroup,
    FormTable, ListHead, Table, Tabs, Overlay, Modal, Confirm, Toast, Upload, Box, KV, Note, Text, Icon, Flex, Grid, DragRow, Empty, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };
const TABS = [{ t: '내려받기 양식', n: 4 }, { t: '택배사 업로드 양식', n: 4 }];

const Page = (tab, actions, ...body) => AdminLayout({ active: 'a-19', counts: COUNTS, actions, desc: '주문 엑셀을 내려받을 때 쓸 항목과 순서(내려받기 양식), 택배사 프로그램이 돌려준 송장 엑셀을 읽는 방법(택배사 업로드 양식)을 저장해 둡니다.' }, Tabs(TABS, tab), body);

const FORMS = [
    ['기본 양식', '기본 제공', '32개 (전체 항목)', '모든 운영자', '-', '고칠 수 없음 · 복사해서 쓰기', true],
    ['CJ대한통운 접수 양식', '내가 만든 양식', '9개', '모든 운영자', '이보림 · 11-02', '발주 확인 엑셀의 기본 양식', false],
    ['회계 전달용', '내가 만든 양식', '14개', '대표 운영자만', '이보림 · 10-28', '', false],
    ['사은품 포장 목록', '내가 만든 양식', '6개', '모든 운영자', '정하윤 · 11-05', '', false],
];

const formList = Table({ cols: [{ t: '양식 이름', w: 220 }, { t: '종류', w: 120 }, { t: '항목', w: 130 }, { t: '쓸 수 있는 사람', w: 130 }, { t: '마지막 수정', w: 130 }, '비고', { t: '', w: 190 }],
    rows: FORMS.map((f) => [`<b>${f[0]}</b>`, f[6] ? Badge(f[1], 'mute') : Badge(f[1], 'line'), f[2], f[3], f[4], `<small>${f[5]}</small>`, f[6] ? Btn('복사', { size: 'sm' }) : `${Btn('고치기', { size: 'sm', kind: 'primary' })} ${Btn('복사', { size: 'sm' })} ${Btn('지우기', { size: 'sm' })}`]) });

const GROUPS = [
    ['주문', ['주문번호', '품목 주문번호', '주문일시', '결제일시', '채널', '스마트스토어 주문번호', '주문 상태']],
    ['상품', ['상품명', '구성(옵션)', '수량', '상품 금액', '판매자 상품 코드']],
    ['주문자', ['주문자 이름', '주문자 연락처', '주문자 이메일', '회원 등급']],
    ['받는 분', ['받는 분', '받는 분 연락처', '우편번호', '주소', '배송 메모', '공동현관 출입번호']],
    ['결제', ['결제수단', '결제 금액', '쿠폰 할인', '적립금 사용', '배송비']],
    ['배송', ['택배사', '송장번호', '발송일', '운임 구분', '발송 기한']],
];
const PICKED = ['받는 분', '받는 분 연락처', '우편번호', '주소', '상품명', '수량', '배송 메모', '주문번호', '운임 구분'];

const LeftPanel = (o = {}) => Box({ title: '전체 항목', sub: '32개 · 체크하면 오른쪽에 들어갑니다' },
    Input({ value: o.q, placeholder: '항목 이름으로 찾기', icon: 'search', w: '100%' }),
    '<div style="height:10px"></div>',
    (o.q ? [['찾은 항목 3개', ['받는 분 연락처', '주문자 연락처', '공동현관 출입번호']]] : GROUPS).map(([g, items]) => `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--ink2);padding:4px 0;border-bottom:1px solid var(--line2);margin-bottom:6px"><span>${g}</span>${o.q ? '' : '<u style="font-weight:400">모두 넣기</u>'}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px">${items.map((it) => Check(it, { on: (o.picked || PICKED).includes(it) })).join('')}</div></div>`),
);

const rename = (name, as) => (as ? `<b>${name}</b> <span style="color:var(--mute);font-size:12px">열 이름</span> ${Input({ value: as, w: 150 })}` : `<b>${name}</b>`);
const RightPanel = (o = {}) => Box({ title: '선택한 항목', sub: `${(o.list || PICKED).length}개 · 위에서 아래 순서 = 엑셀 왼쪽에서 오른쪽 열 순서`, right: Btn('모두 빼기', 'ghost') },
    (o.list || PICKED).length === 0 ? Empty({ icon: 'list', title: '아직 고른 항목이 없습니다', desc: '왼쪽에서 항목을 체크하면 여기에 들어옵니다. 한 개 이상 골라야 저장할 수 있습니다.' }) :
        (o.list || PICKED).map((it, i) => (o.drag === i
            ? `<div class="wf-dragrow" style="border:2px solid var(--dark);box-shadow:0 6px 16px rgba(0,0,0,.12)">${Icon('drag-vertical')}<div class="dc"><b>${it}</b> <span style="font-size:12px;color:var(--mute)">끌어서 옮기는 중</span></div></div><div style="height:3px;background:var(--dark);margin:0 0 6px;border-radius:2px"></div>`
            : DragRow({ right: `<span style="display:inline-flex;gap:10px;align-items:center;color:var(--ink2)"><span style="font-size:12px;color:var(--mute)">${String.fromCharCode(65 + i)}열</span>${Icon('angle-up-min')}${Icon('angle-down-min')}${Icon('close-min')}</span>` }, rename(it, (o.as || {})[it])))),
    (o.list || PICKED).length ? Text('줄을 끌거나 위아래 화살표로 순서를 바꿉니다. 열 이름을 누르면 엑셀 첫 줄에 찍힐 이름을 바꿀 수 있습니다.', { sm: true, mute: true }) : '',
);

const Editor = (o = {}) => [
    Box({ title: o.title || '양식 고치기' },
        FormTable([
            { k: '양식 이름', required: true, v: Input({ value: o.name === undefined ? 'CJ대한통운 접수 양식' : o.name, placeholder: '예: CJ대한통운 접수 양식', w: 320, error: !!o.nameErr }), error: o.nameErr, help: o.nameErr ? undefined : '엑셀 내려받기 팝업의 양식 목록에 이 이름으로 나옵니다. 30자까지.' },
            { k: '쓸 수 있는 사람', v: RadioGroup(['모든 운영자', '대표 운영자만', '나만'], '모든 운영자') },
            { k: '한 줄의 단위', v: [Radio('품목 주문마다 한 줄', { on: true }), Radio('주문마다 한 줄 (품목은 한 칸에 묶어 적음)')], help: '택배 접수용은 합포장을 위해 주문마다 한 줄, 회계용은 품목마다 한 줄을 주로 씁니다.' },
            { k: '이 양식을 기본으로', v: Check('발주 확인·발송 처리의 양식 내려받기에서 처음 골라져 있게 하기', { on: true }) },
        ]),
    ),
    Grid('1fr 1fr', LeftPanel(o.left), RightPanel(o.right)),
    Box({ title: '엑셀 미리보기', sub: '실제 주문 2건으로 본 모습 · 첫 줄이 열 이름' },
        o.right && o.right.list && o.right.list.length === 0 ? Text('항목을 고르면 여기에 엑셀 모습이 나옵니다.', { mute: true, sm: true }) :
            Table({ dense: true, cols: (o.previewCols || ['받는 분', '받는 분 연락처', '우편번호', '주소', '상품명', '수량', '배송 메모', '주문번호', '운임 구분']).map((c) => ({ t: c })), rows: [
                ['김민지', '010-****-1234', '03925', '서울 마포구 월드컵북로 *** 101동 1203호', `${P} ${O2}`, '1', '문 앞에 놓아 주세요', '20261111-000128', '신용'],
                ['박서준', '0504-****-5821', '13529', '경기 성남시 분당구 판교역로 *** 3층', `${P} ${O1}`, '2', '부재 시 경비실', '2026111145821371', '신용'],
            ] }),
    ),
];

const state1 = StateBlock({ idx: 1, title: '다운로드 항목 고르기·순서·저장', note: '주문 엑셀에 넣을 항목을 왼쪽에서 고르고 오른쪽에서 순서를 정해 이름을 붙여 저장합니다. 저장한 양식은 모든 주문 목록의 엑셀 내려받기 팝업에 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '주문 엑셀을 받는 이유는 받는 곳마다 다릅니다. 택배사 프로그램은 정해진 열 순서가 아니면 읽지 못하고, 회계는 금액 칸만, 포장 담당은 상품과 수량만 봅니다. 매번 전체를 받아 열을 지우고 옮기는 일을 없애려고, 한 번 만들어 둔 양식을 고르면 그 열 순서대로 나오게 합니다. 엑셀 첫 줄의 열 이름도 택배사가 요구하는 이름(예: 받는분성명)으로 바꿀 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '초기값: 기본 양식(전체 32개 항목) 하나가 들어 있고 지우거나 고칠 수 없습니다(복사해서 씀). 꺼 둔 기능의 항목은 전체 항목에 나오지 않습니다(쿠폰·적립금·회원 등급·스마트스토어 주문번호). 개인정보 항목(연락처·주소·이메일)이 든 양식은 고객 정보 내려받기 권한이 있는 운영자만 쓸 수 있습니다. 다른 화면에서 기본으로 쓰는 양식은 지우기 전에 알려 줍니다.'),
    Canvas({ label: 'A-19 · 내려받기 양식 탭 · 양식 목록' }, Page('내려받기 양식', [Btn('새 양식 만들기', { kind: 'primary', icon: 'plus' })],
        ListHead({ total: 4 }), formList,
        Note('양식은 운영자 모두가 같이 씁니다. 엑셀 내려받기 팝업에는 마지막에 쓴 양식이 먼저 골라져 있습니다.'),
    )),
    Canvas({ label: 'A-19 · 고치기 버튼 → 양식 편집 (왼쪽 전체 항목 → 오른쪽 선택한 항목 · 순서 · 미리보기)' }, Page('내려받기 양식', [Btn('취소'), Btn('저장', 'primary')], Editor({ right: { as: { '받는 분': '받는분성명', '받는 분 연락처': '받는분전화번호' } }, previewCols: ['받는분성명', '받는분전화번호', '우편번호', '주소', '상품명', '수량', '배송 메모', '주문번호', '운임 구분'] }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '왼쪽 · 항목 이름으로 찾는 중', right: '부분', pad: 20 }, `<div style="width:460px">${LeftPanel({ q: '연락처' })}</div>`),
        Canvas({ size: 'auto', label: '오른쪽 · 줄을 끌어 순서를 바꾸는 중 (놓일 자리에 굵은 선)', right: '부분', pad: 20 }, `<div style="width:520px">${RightPanel({ list: PICKED.slice(0, 5), drag: 2 })}</div>`),
    ),
    Canvas({ label: 'A-19 · 새 양식 만들기 버튼 → 빈 편집 화면 (이름 없이 저장을 눌러 오류)' }, Page('내려받기 양식', [Btn('취소'), Btn('저장', 'primary')], Editor({ title: '새 양식 만들기', name: '', nameErr: '양식 이름을 넣어 주세요.', left: { picked: [] }, right: { list: [] } }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '같은 이름의 양식이 이미 있을 때', right: '부분', pad: 20 }, `<div style="width:520px">${FormTable([{ k: '양식 이름', required: true, v: Input({ value: '회계 전달용', w: 320, error: true }), error: '같은 이름의 양식이 이미 있습니다. 다른 이름을 넣어 주세요.' }])}</div>`),
        Canvas({ size: 'auto', label: '저장하지 않고 나가려 할 때', right: '팝업만', pad: 20 }, Confirm({ w: 400, title: '고친 내용을 저장하지 않고 나갈까요?', desc: '항목 2개를 더하고 순서를 바꿨습니다. 나가면 사라집니다.', foot: [Btn('계속 고치기'), Btn('저장하지 않고 나가기', 'danger')] })),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('CJ대한통운 접수 양식을 저장했습니다. 엑셀 내려받기에서 바로 쓸 수 있습니다.')),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '지우기 → 다른 화면에서 기본으로 쓰는 양식일 때', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: 'CJ대한통운 접수 양식을 지울까요?', desc: '발주 확인·발송 처리의 양식 내려받기에서 기본으로 쓰는 양식입니다. 지우면 기본 양식으로 바뀝니다.<br>이미 내려받은 엑셀 파일에는 영향이 없습니다.', ok: '지우기', danger: true })),
        Canvas({ size: 'auto', label: '복사 → 이름 정하기', right: '팝업만', pad: 20 }, Modal({ title: '양식 복사', w: 420, foot: [Btn('취소'), Btn('복사해서 고치기', 'primary')] }, FormTable([{ k: '새 양식 이름', required: true, v: Input({ value: '기본 양식 (복사)', w: 240, focus: true }) }]), Note('복사한 뒤 바로 편집 화면이 열립니다.'))),
        Canvas({ size: 'auto', label: '내가 만든 양식이 없을 때의 목록 안내', right: '부분', pad: 20 }, `<div style="width:420px">${Empty({ icon: 'file-text-o', title: '아직 만든 양식이 없습니다', desc: '지금은 기본 양식(전체 항목)으로만 내려받습니다. 택배사에 올릴 양식을 만들어 두면 매번 열을 고칠 필요가 없습니다.', action: Btn('새 양식 만들기', { kind: 'primary', icon: 'plus' }) })}</div>`),
    ),
);

const COURIER = [
    ['CJ대한통운', '기본 제공', '운송장번호 → 송장번호 · 고객주문번호 → 주문번호', '숫자 12자리', '11-11 16:18 · 121행 성공', true],
    ['한진택배', '기본 제공', '운송장번호 → 송장번호 · 주문번호 → 주문번호', '숫자 12자리', '11-10 15:02 · 14행 성공', true],
    ['롯데택배', '기본 제공', '운송장번호 → 송장번호 · 주문번호1 → 주문번호', '숫자 12자리', '쓴 적 없음', true],
    ['우체국택배', '기본 제공', '등기번호 → 송장번호 · 주문번호 → 주문번호', '숫자 13자리', '11-06 11:20 · 3행 성공', true],
];

const MapRow = (ours, req, sel, o = {}) => ({ hl: o.err, c: [`<b>${ours}</b>${req ? ' <em class="req">필수</em>' : ''}`, sel, o.sample || '', o.err ? `${Icon('error-o')} ${o.err}` : o.ok === false ? '<small>쓰지 않음</small>' : Badge('맞춤', 'check')] });
const colSel = (v, o = {}) => Select({ value: v, placeholder: '엑셀의 열을 고르세요', w: 220, ...o });
const EXCEL_COLS = ['A 접수일자', 'B 운송장번호', 'C 받는분성명', 'D 받는분전화번호', 'E 받는분주소', 'F 품목명', 'G 수량', 'H 고객주문번호', 'I 운임구분'];

const mapTable = (rows) => Table({ cols: [{ t: '우리 쪽 항목', w: 170 }, { t: '택배사 엑셀의 열 이름', w: 250 }, { t: '올린 파일의 첫 행 값', w: 220 }, '상태'], rows });

const courierEdit = (o = {}) => [
    Box({ title: o.title || 'CJ대한통운 업로드 양식' },
        FormTable([
            { k: '택배사', required: true, v: o.courier || Text('<b>CJ대한통운</b> (설정 > 배송에 등록된 택배사)') },
            { k: '양식 이름', required: true, v: Input({ value: o.name || 'CJ대한통운', w: 280 }) },
            { k: '제목 줄 위치', v: [Select({ value: '1행', w: 100 }), Text('데이터는 2행부터 읽습니다', { sm: true, mute: true })], help: '택배사 엑셀 맨 위에 안내 문구가 몇 줄 있으면 제목 줄이 몇 번째 행인지 고릅니다.' },
            { k: '송장번호 형식', v: [Select({ value: '숫자 12자리', w: 160 }), Check('줄표(-)와 빈칸은 자동으로 지우기', { on: true })], help: '형식에 안 맞는 송장번호는 검증 결과에서 오류로 알려 줍니다.' },
        ]),
    ),
    Box({ title: '열 이름 맞추기', sub: '택배사 엑셀의 어느 열이 우리 쪽 무슨 항목인지', right: Btn('택배사 엑셀 올려서 열 이름 읽어 오기', { size: 'sm', icon: 'file-upload-o' }) },
        o.file === false ? '' : Text(`${Icon('file-text-o')} 읽어 온 파일: CJ대한통운_운송장출력_20261111.xlsx · 열 9개 · 124행`, { sm: true, mute: true }),
        mapTable(o.rows || [
            MapRow('주문번호', true, colSel('H 고객주문번호'), { sample: '20261111-000128' }),
            MapRow('송장번호', true, colSel('B 운송장번호'), { sample: '581233441201' }),
            MapRow('택배사', false, colSel('', { placeholder: '열 없음 → 이 양식의 택배사(CJ대한통운)로 넣음' }), { ok: false }),
            MapRow('발송일', false, colSel('A 접수일자'), { sample: '2026-11-11' }),
        ]),
        Note('주문번호와 송장번호 두 가지만 맞으면 됩니다. 나머지 열은 읽지 않습니다. 스마트스토어 주문번호도 주문번호 열에 그대로 두면 알아봅니다.'),
    ),
];

const state2 = StateBlock({ idx: 2, title: '택배사 업로드 양식', note: '택배사 프로그램이 돌려준 송장 엑셀을 그대로 올릴 수 있게, 택배사마다 열 이름을 맞춰 두는 곳. CJ대한통운 · 한진 · 롯데 · 우체국은 미리 맞춰져 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '송장 일괄 등록의 핵심은 택배사 프로그램에서 받은 파일을 손대지 않고 그대로 올리는 것입니다. 그런데 택배사마다 송장번호 열 이름이 다릅니다(운송장번호 · 등기번호 · 송장번호). 그래서 택배사별로 어느 열이 주문번호이고 어느 열이 송장번호인지 한 번만 맞춰 두면, 올릴 때 양식만 고르면 됩니다. 많이 쓰는 네 곳은 처음부터 들어 있고, 택배사가 양식을 바꾸면 여기서 고칩니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '택배사 프로그램에 올리는 접수 엑셀(내려받기)과 돌려받는 송장 엑셀(업로드)은 짝입니다. 내려받을 때 주문번호를 택배사 엑셀의 고객주문번호 칸에 넣어 보내야 돌아온 파일에서 주문번호로 짝을 맞출 수 있습니다. 열 이름을 직접 치지 않도록 택배사 엑셀을 올리면 첫 줄에서 열 이름을 읽어 와 고르게 합니다. 같은 이름의 열이 두 개면 열 문자(A · B)로 구분합니다.'),
    Canvas({ label: 'A-19 · 택배사 업로드 양식 탭 · 목록 (기본 제공 4곳)' }, Page('택배사 업로드 양식', [Btn('택배사 양식 추가', { kind: 'primary', icon: 'plus' })],
        ListHead({ total: 4 }),
        Table({ cols: [{ t: '택배사', w: 130 }, { t: '종류', w: 100 }, '열 이름 맞추기', { t: '송장번호 형식', w: 110 }, { t: '마지막으로 쓴 때', w: 180 }, { t: '', w: 190 }], rows: COURIER.map((c) => [`<b>${c[0]}</b>`, Badge(c[1], 'mute'), `<small>${c[2]}</small>`, c[3], `<small>${c[4]}</small>`, `${Btn('고치기', { size: 'sm', kind: 'primary' })} ${Btn('시험 올리기', { size: 'sm' })} ${Btn('처음 값으로', { size: 'sm' })}`]) }),
        Note('설정 > 배송에 등록한 택배사만 양식을 만들 수 있습니다. 목록에 없는 택배사(로젠택배 등)는 택배사 양식 추가로 만듭니다. 택배사 프로그램을 쓰지 않으면 기본 양식(주문번호 · 택배사 · 송장번호)으로 올리면 됩니다.'),
    )),
    Canvas({ label: 'A-19 · CJ대한통운 고치기 → 열 이름 맞추기 (택배사 엑셀을 올려 열 이름을 읽어 온 뒤)' }, Page('택배사 업로드 양식', [Btn('취소'), Btn('시험 올리기'), Btn('저장', 'primary')], courierEdit())),
    CanvasRow(
        Canvas({ size: 'auto', label: '택배사 엑셀의 열 고르는 중 (읽어 온 열 이름 목록 · 검색형)', right: '부분', pad: 20 }, `<div style="width:340px;min-height:420px">${colSel('B 운송장번호', { open: true, search: '', w: 320, options: EXCEL_COLS.map((c) => (c === 'B 운송장번호' ? { t: c, sub: '첫 행 값 581233441201', on: true } : c === 'H 고객주문번호' ? { t: c, sub: '주문번호에 쓰는 중', disabled: true } : c)) })}</div>`),
        Canvas({ size: 'auto', label: '맞추기 오류 (필수 항목을 안 고름 · 값이 형식에 안 맞음)', right: '부분', pad: 20 }, `<div style="width:900px">${mapTable([
            MapRow('주문번호', true, colSel('', { error: true }), { err: '주문번호가 들어 있는 열을 골라 주세요. 없으면 택배사 프로그램에 접수 엑셀을 올릴 때 주문번호 칸을 함께 보내야 합니다.' }),
            MapRow('송장번호', true, colSel('C 받는분성명', { error: true }), { sample: '김민지', err: '이 열의 값(김민지)은 숫자 12자리가 아닙니다. 송장번호 열이 맞는지 확인하세요.' }),
        ])}</div>`),
    ),
    Canvas({ label: 'A-19 · 택배사 양식 추가 버튼 → 새 양식 (택배사 고르는 중 · 엑셀을 올리기 전)' }, Page('택배사 업로드 양식', [Btn('취소'), Btn('저장', { kind: 'primary', disabled: true })],
        Box({ title: '새 택배사 업로드 양식' },
            FormTable([
                { k: '택배사', required: true, v: Select({ placeholder: '택배사를 고르세요', w: 260, open: true, search: '', options: [{ t: '로젠택배', sub: '양식 없음' }, { t: 'CJ대한통운', sub: '양식 있음', disabled: true }, { t: '한진택배', sub: '양식 있음', disabled: true }, { t: '롯데택배', sub: '양식 있음', disabled: true }, { t: '우체국택배', sub: '양식 있음', disabled: true }] }), help: '여기에 없는 택배사는 설정 > 배송에서 먼저 추가하세요.' },
            ]),
        ),
        Box({ title: '열 이름 맞추기', sub: '택배사 프로그램에서 받은 송장 엑셀을 한 번 올려 주세요' },
            Upload({ title: '택배사 송장 엑셀을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · XLS · CSV', '용량 10MB 이하', '첫 줄(제목 줄)에서 열 이름을 읽어 옵니다', '이 파일의 송장은 등록되지 않습니다 (열 이름만 읽음)'] }),
        ),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '시험 올리기 → 결과 (저장 전에 실제 파일로 확인 · 송장은 등록되지 않음)', right: '팝업만', pad: 20 },
            Modal({ title: '시험 올리기 · CJ대한통운', w: 620, foot: [Btn('닫기'), Btn('이대로 저장', 'primary')] },
                Text('CJ대한통운_운송장출력_20261111.xlsx · 124행', { sm: true, mute: true }),
                KV([['읽은 행', '124행'], ['주문번호를 찾은 행', `${Badge('123행', 'check')} 배송준비 주문과 짝이 맞음`], ['못 찾은 행', `${Badge('1행', 'warn')} 37행 · 고객주문번호 칸이 비어 있음`], ['송장번호 형식', `${Badge('124행 모두 맞음', 'check')} 숫자 12자리`]], { wide: true }),
                Note('시험 올리기는 열 이름이 맞는지만 봅니다. 실제 송장 등록은 발주 확인·발송 처리의 송장 엑셀 일괄 등록에서 합니다.'),
            )),
        Canvas({ size: 'auto', label: '처음 값으로 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: 'CJ대한통운 양식을 처음 값으로 되돌릴까요?', desc: '고친 열 이름 맞추기가 사라지고 기본 제공 값(운송장번호 · 고객주문번호)으로 돌아갑니다.', ok: '되돌리기', danger: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '택배사별 기본 제공 값 (택배사 프로그램의 표준 열 이름)', right: '기준 표', pad: 20 }, `<div style="width:900px">${Table({ dense: true, cols: [{ t: '택배사', w: 120 }, { t: '주문번호 열', w: 150 }, { t: '송장번호 열', w: 150 }, { t: '송장번호 형식', w: 130 }, '접수 엑셀을 내려받을 때 맞춰 둔 내려받기 양식'], rows: [
            ['CJ대한통운', '고객주문번호', '운송장번호', '숫자 12자리', 'CJ대한통운 접수 양식 (받는분성명 · 받는분전화번호 · 받는분주소 · 품목명 · 수량 · 고객주문번호)'],
            ['한진택배', '주문번호', '운송장번호', '숫자 12자리', '한진택배 접수 양식 (수하인명 · 수하인전화 · 수하인주소 · 품명 · 수량 · 주문번호)'],
            ['롯데택배', '주문번호1', '운송장번호', '숫자 12자리', '롯데택배 접수 양식 (받는분 · 전화번호 · 주소 · 상품명 · 수량 · 주문번호1)'],
            ['우체국택배', '주문번호', '등기번호', '숫자 13자리', '우체국택배 접수 양식 (수취인 · 수취인전화 · 수취인주소 · 내용품명 · 수량 · 주문번호)'],
        ] })}${Note('열 이름은 택배사 프로그램 버전에 따라 다를 수 있어 개발 때 각 택배사의 최신 양식 파일로 확인합니다. 달라지면 운영자가 이 화면에서 고칠 수 있습니다.')}</div>`),
    ),
);

export default function A19() {
    return [state1, state2].join('');
}
