import {
    Canvas, CanvasRow, StateBlock, Anno, MypageLayout, MobilePage, Btn, BtnRow, Badge, Input, Select, Check, Field, Overlay, Modal, Confirm,
    Toast, BottomSheet, Empty, Box, Note, Text, Icon, Flex, Grid, H,
} from '../lib/blocks.js';

const ADDRS = [
    { name: '집', to: '김민지', tel: '010-****-1234', zip: '03925', addr: '서울 마포구 월드컵북로 ***', detail: '101동 1203호', memo: '문 앞에 놓아 주세요', door: '공동현관 #1203*', base: true, used: '최근 사용 2026-11-11' },
    { name: '회사', to: '김민지', tel: '010-****-1234', zip: '06236', addr: '서울 강남구 테헤란로 ***', detail: '8층 안내 데스크', memo: '경비실에 맡겨 주세요', door: '', used: '최근 사용 2026-10-20' },
    { name: '부모님 댁', to: '김영숙', tel: '010-****-7742', zip: '48058', addr: '부산 해운대구 센텀중앙로 ***', detail: '302동 504호', memo: '배송 전 연락 바랍니다', door: '공동현관 자유 출입', used: '최근 사용 2026-09-28' },
];

const AddrCard = (a, o = {}) => `
<div style="border:${a.base ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:6px;padding:16px 18px;margin-bottom:12px;background:#fff">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><b style="font-size:15px">${a.name}</b>${a.base ? Badge('기본 배송지', 'solid') : ''}<span style="flex:1"></span><span style="font-size:12px;color:var(--mute)">${a.used}</span></div>
  <div style="font-size:13.5px;line-height:1.7">${a.to} · ${a.tel}<br>(${a.zip}) ${a.addr}, ${a.detail}</div>
  <div style="font-size:12.5px;color:var(--mute);margin-top:6px">${Icon('message-o')} ${a.memo}${a.door ? ` · ${Icon('key')} ${a.door}` : ''}</div>
  <div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap">${a.base ? '' : Btn('기본 배송지로 설정', { size: 'sm' })}${Btn('수정', { size: 'sm' })}${Btn('삭제', { size: 'sm', disabled: a.base && !o.only })}${a.base && !o.only ? '<span style="font-size:12px;color:var(--mute);align-self:center">기본 배송지는 다른 배송지를 기본으로 바꾼 뒤 삭제할 수 있습니다</span>' : ''}</div>
</div>`;

const ListBody = (o = {}) => [
    Flex({ justify: 'space-between', align: 'center' },
        Text(`저장한 배송지 <b>${o.count || 3}</b> / 10`, { sm: true }),
        Btn('새 배송지 추가', { kind: 'primary', icon: 'plus', disabled: o.full })),
    '<div style="height:14px"></div>',
    o.full ? Note('배송지는 10개까지 저장할 수 있습니다. 쓰지 않는 배송지를 삭제한 뒤 추가해 주세요.', { warn: true }) : '',
    ADDRS.map((a) => AddrCard(a)),
    o.full ? Text('… 아래로 7개 더 (같은 카드 모양, 최근 사용 순)', { sm: true, mute: true }) : '',
    Note('주문서에서 새로 입력한 배송지는 "배송지 목록에 저장"을 체크했을 때만 여기에 들어옵니다. 이미 접수된 주문의 배송지는 여기서 고쳐도 바뀌지 않습니다(주문 상세에서 변경).'),
];

const Page = (...body) => MypageLayout({ active: '배송지 관리', title: '배송지 관리', crumb: ['홈', '마이페이지', '배송지 관리'] }, body);

const state1 = StateBlock({ idx: 1, title: '목록(기본 배송지)', note: '저장한 배송지를 카드로 보여 줍니다. 기본 배송지가 맨 위, 나머지는 최근에 쓴 순서입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '기본 배송지는 주문서에 처음부터 채워지는 주소입니다. 그래서 테두리를 굵게 하고 배지를 붙여 한눈에 구분하고, 다른 카드에는 "기본 배송지로 설정" 버튼을 둡니다. 초기값: 가입 후 첫 주문에서 입력한 주소가 자동으로 기본 배송지가 됩니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '기본 배송지는 삭제 버튼이 잠깁니다(배송지가 그것 하나뿐일 때만 삭제 가능). 최대 10개이며 10개가 차면 추가 버튼이 잠기고 이유를 알려 줍니다. 여기서 고친 주소는 이미 접수된 주문에 반영되지 않습니다.'),
    Canvas({ label: 'U-22 · 배송지 3개 · 기본 배송지 = 집' }, Page(ListBody())),
    Canvas({ label: 'U-22 · 회사 카드의 삭제 버튼 → 확인 팝업' }, Overlay({ bg: Page(ListBody()), h: 440 },
        Confirm({ w: 400, title: '"회사" 배송지를 삭제할까요?', desc: '서울 강남구 테헤란로 ***, 8층 안내 데스크<br>삭제해도 이 주소로 보낸 지난 주문 기록은 그대로 남습니다.', ok: '삭제', danger: true }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '부모님 댁 → 기본 배송지로 설정 → 안내', right: '토스트만', pad: 20 }, Toast('기본 배송지를 "부모님 댁"으로 바꿨습니다. 다음 주문서부터 이 주소가 먼저 채워집니다.')),
        Canvas({ size: 'auto', label: '삭제 완료', right: '토스트만', pad: 20 }, Toast('"회사" 배송지를 삭제했습니다.', { action: '되돌리기' })),
    ),
    Canvas({ label: 'U-22 · 10개가 다 찼을 때 — 추가 버튼 잠김' }, Page(ListBody({ count: 10, full: true }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-22 · 모바일 목록' }, MobilePage({ title: '배송지 관리', tab: '마이', bottom: [Btn('새 배송지 추가', { kind: 'primary', icon: 'plus' })] },
            Text('저장한 배송지 <b>3</b> / 10', { sm: true }), '<div style="height:10px"></div>', ADDRS.map((a) => AddrCard(a)))),
        Canvas({ size: 'mobile', label: 'U-22 · 모바일 · 삭제 → 확인 시트' }, Overlay({ bg: MobilePage({ title: '배송지 관리', tab: '마이' }, ADDRS.map((a) => AddrCard(a))), align: 'bottom', h: 720 },
            BottomSheet({ title: '"회사" 배송지를 삭제할까요?', foot: [Btn('취소'), Btn('삭제', 'danger')] },
                Text('서울 강남구 테헤란로 ***, 8층 안내 데스크', { sm: true }),
                Text('삭제해도 이 주소로 보낸 지난 주문 기록은 그대로 남습니다.', { sm: true, mute: true })))),
    ),
);

const MEMOS = ['문 앞에 놓아 주세요', '경비실에 맡겨 주세요', '택배함에 넣어 주세요', '배송 전 연락 바랍니다', '직접 입력'];

const Form = (o = {}) => [
    Grid('1fr 1fr',
        Field({ label: '배송지 이름', help: '비워 두면 받는 분 이름으로 저장됩니다. 최대 10자.' }, Input({ value: o.name === undefined ? '회사' : o.name, placeholder: '예: 집, 회사' })),
        Field({ label: '받는 분', required: true, error: o.err ? '받는 분 이름을 입력해 주세요.' : '' }, Input({ value: o.err ? '' : '김민지', placeholder: '이름', error: o.err })),
    ),
    Field({ label: '휴대폰 번호', required: true, error: o.err ? '휴대폰 번호는 숫자 10~11자리로 입력해 주세요. (예: 01012345678)' : '', help: o.err ? '' : '택배 기사님이 연락하는 번호입니다.' }, Input({ value: o.err ? '010-1234' : '010-****-1234', w: 280, error: o.err })),
    Field({ label: '주소', required: true, error: o.err ? '주소 검색을 눌러 주소를 골라 주세요.' : '' },
        Flex({ gap: 8 }, Input({ value: o.err || o.blank ? '' : '06236', placeholder: '우편번호', w: 140, disabled: true }), Btn('주소 검색', { icon: 'search' })),
        '<div style="height:8px"></div>',
        Input({ value: o.err || o.blank ? '' : '서울 강남구 테헤란로 ***', placeholder: '주소 검색으로 채워집니다', disabled: true, w: '100%' }),
        '<div style="height:8px"></div>',
        Input({ value: o.err || o.blank ? '' : '8층 안내 데스크', placeholder: '상세 주소 (동·호수)', w: '100%' }),
    ),
    Field({ label: '배송 메모' }, o.memoOpen
        ? Select({ value: '경비실에 맡겨 주세요', open: true, w: 360, options: MEMOS.map((m) => ({ t: m, on: m === '경비실에 맡겨 주세요' })) })
        : o.memoDirect
            ? [Select({ value: '직접 입력', w: 360 }), '<div style="height:8px"></div>', Input({ value: '부재 시 1층 무인 택배함 3번에 넣어 주세요', focus: true, w: '100%' }), '<p class="help">23 / 50자</p>']
            : Select({ value: o.blank ? '' : '경비실에 맡겨 주세요', placeholder: '배송 메모를 골라 주세요', w: 360 })),
    Field({ label: '공동현관 출입 방법', help: '출입번호는 택배 기사님에게만 전달되고, 주문 내역 화면에는 일부만 보입니다.' },
        Flex({ gap: 16, align: 'center', wrap: true },
            `<span class="wf-radio${o.blank ? '' : ' on'}"><span class="dot"></span>출입번호</span>`, Input({ value: o.blank ? '' : '#0825*', placeholder: '예: #1234*', w: 160 }),
            `<span class="wf-radio${o.blank ? ' on' : ''}"><span class="dot"></span>자유 출입</span>`, '<span class="wf-radio"><span class="dot"></span>경비실 호출</span>')),
    Check('기본 배송지로 설정', { on: !!o.base }),
];

const formModal = (title, o = {}, foot) => Modal({ title, w: 600, foot: foot || [Btn('취소'), Btn('저장', 'primary')] }, Form(o));

const zipModal = Modal({ title: '주소 검색', w: 520 },
    Input({ value: '테헤란로 152', icon: 'search', focus: true, w: '100%' }),
    '<div style="height:6px"></div>',
    Text('도로명 + 건물번호, 지번, 건물 이름으로 찾을 수 있습니다. 검색 결과 <b>3</b>건', { sm: true, mute: true }),
    '<div style="height:10px"></div>',
    [['06236', '서울 강남구 테헤란로 152 (역삼동, 강남파이낸스센터)', '지번 서울 강남구 역삼동 737', true], ['06236', '서울 강남구 테헤란로 152-1 (역삼동)', '지번 서울 강남구 역삼동 737-1'], ['06237', '서울 강남구 테헤란로 152길 ** (역삼동)', '지번 서울 강남구 역삼동 738-2']]
        .map(([z, a, j, on]) => `<div style="display:flex;gap:12px;padding:12px;border:1px solid ${on ? 'var(--dark)' : 'var(--line2)'};border-radius:4px;margin-bottom:6px;font-size:13px;background:${on ? 'var(--box)' : '#fff'}"><b style="flex:none">${z}</b><div>${a}<div style="color:var(--mute);font-size:12px">${j}</div></div></div>`),
    Note('주소 검색은 우편번호 서비스(카카오 우편번호) 창을 그대로 띄웁니다. 고른 주소가 우편번호·기본 주소 칸에 채워지고 상세 주소 칸으로 넘어갑니다.'),
);

const zipEmpty = Modal({ title: '주소 검색', w: 520 },
    Input({ value: '태헤란노 152', icon: 'search', w: '100%' }),
    Empty({ icon: 'map-marker', title: '검색 결과가 없습니다', desc: '도로명과 건물번호를 띄어 써 보세요. 예: 테헤란로 152' }),
);

const state2 = StateBlock({ idx: 2, title: '추가·수정 폼', note: '목록 위에 뜨는 팝업. 추가와 수정이 같은 폼이고, 수정은 값이 채워져 열립니다. 주문서(U-08)의 새 배송지 입력과 같은 입력칸을 씁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '주소는 직접 치지 않고 주소 검색으로만 넣게 해서 잘못된 주소로 반송되는 일을 막습니다. 배송 메모는 자주 쓰는 문장을 고르게 하고 "직접 입력"을 골랐을 때만 입력칸이 열립니다(유형별 입력칸 분기). 공동현관 출입 방법은 새벽·비대면 배송에서 재배송을 줄이는 항목이라 따로 둡니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '초기값: 추가 폼은 받는 분·휴대폰에 회원 정보가 미리 들어가고 나머지는 빈칸, 배송지가 하나도 없을 때는 "기본 배송지로 설정"이 체크된 채 잠깁니다. 배송 메모 문장 목록은 관리자 설정 > 배송에서 바꿀 수 있습니다. 필수 항목이 비면 저장되지 않고 칸 아래에 고칠 방법을 적습니다.'),
    Canvas({ label: 'U-22 · 새 배송지 추가 버튼 → 추가 팝업 (빈 폼)' }, Overlay({ bg: Page(ListBody()), h: 860 },
        formModal('새 배송지 추가', { name: '', blank: true }, [Btn('취소'), Btn('저장', { kind: 'primary', disabled: true })]))),
    CanvasRow(
        Canvas({ size: 'auto', label: '주소 검색 버튼 → 검색 결과에서 고르는 중', right: '팝업만', pad: 20 }, zipModal),
        Canvas({ size: 'auto', label: '주소 검색 · 결과 없음', right: '팝업만', pad: 20 }, zipEmpty),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '회사 카드의 수정 → 수정 팝업 (값 채워짐) · 배송 메모 목록 열림', right: '팝업만', pad: 20 }, formModal('배송지 수정', { memoOpen: true })),
        Canvas({ size: 'auto', label: '배송 메모 = 직접 입력을 고른 뒤', right: '팝업만', pad: 20 }, formModal('배송지 수정', { memoDirect: true, base: true })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '저장을 눌렀는데 필수 항목이 비었을 때', right: '팝업만', pad: 20 }, formModal('새 배송지 추가', { name: '', err: true })),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, [
            Toast('배송지를 저장했습니다.'), '<div style="height:10px"></div>',
            Toast('배송지를 저장하고 기본 배송지로 바꿨습니다.'), '<div style="height:10px"></div>',
            Toast('저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요.', { kind: 'error' })]),
    ),
    Canvas({ size: 'mobile', label: 'U-22 · 모바일 · 추가 폼은 팝업이 아니라 한 화면' }, MobilePage({ title: '새 배송지 추가', tab: false, bottom: [Btn('저장', 'primary')] }, Form({ name: '' }))),
);

const state3 = StateBlock({ idx: 3, title: '없음', note: '아직 주문한 적이 없거나 배송지를 모두 지운 회원.' },
    Anno({ title: '왜 이렇게 하나' }, '빈 화면에서 끝내지 않고 바로 추가하게 합니다. 여기서 처음 추가하는 배송지는 자동으로 기본 배송지가 되고(체크 잠김), 배송지를 저장해 두지 않아도 주문서에서 입력하면 주문은 할 수 있습니다.'),
    Canvas({ label: 'U-22 · 저장한 배송지 없음' }, Page(
        Empty({ icon: 'map-marker', title: '저장한 배송지가 없습니다', desc: '자주 받는 주소를 저장해 두면 주문할 때 다시 입력하지 않아도 됩니다.', action: Btn('새 배송지 추가', { kind: 'primary', icon: 'plus' }) }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '첫 배송지 추가 팝업 — 기본 배송지 체크가 켜진 채 잠김', right: '팝업 아랫부분', pad: 20 },
            Box({ w: 520 }, Check('기본 배송지로 설정', { on: true, disabled: true }), Text('처음 저장하는 배송지는 기본 배송지가 됩니다.', { sm: true, mute: true }), BtnRow({ align: 'right' }, Btn('취소'), Btn('저장', 'primary')))),
        Canvas({ size: 'mobile', label: 'U-22 · 모바일 없음' }, MobilePage({ title: '배송지 관리', tab: '마이' },
            Empty({ icon: 'map-marker', title: '저장한 배송지가 없습니다', desc: '자주 받는 주소를 저장해 두면 주문할 때 다시 입력하지 않아도 됩니다.', action: Btn('새 배송지 추가', { kind: 'primary', icon: 'plus' }) }))),
    ),
);

export default function U22() {
    return [state1, state2, state3].join('');
}
