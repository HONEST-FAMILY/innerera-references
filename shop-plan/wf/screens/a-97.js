import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, Check, Radio, Toggle, Input, Select,
    FormTable, Table, Overlay, Modal, Confirm, Toast, Box, KV, Note as NoteBase, Text, Icon, Flex, Grid,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const Page = (...body) => AdminLayout({ active: 'a-97', desc: '몰에서 쓰는 기능만 켭니다. 끈 기능은 고객 화면 · 관리자 메뉴 · 알림에서 함께 사라지고, 쌓인 자료는 지워지지 않습니다.' }, body);

const MODS = [
    { n: '쿠폰', i: 'coupon', on: true, d: '할인 쿠폰을 만들어 내려받게 하거나 자동·지정 발급합니다.', user: '주문서 쿠폰 적용 · 마이페이지 쿠폰 · 가입 쿠폰 안내', admin: '혜택 > 쿠폰', noti: '쿠폰 발급 · 만료 예정 2종', stat: '사용 중인 쿠폰 3종 · 고객이 가진 쿠폰 412장', link: '쿠폰' },
    { n: '적립금', i: 'money', on: true, d: '구매·리뷰에 적립금을 주고 주문서에서 쓰게 합니다.', user: '상품 상세 적립 예정 · 주문서 적립금 사용 · 마이페이지 적립금', admin: '혜택 > 적립금 · 회원 상세 적립금 탭', noti: '적립 · 소멸 예정 등 4종', stat: '회원 1,284명이 가진 적립금 합계 2,846,300원', link: '적립금 정책' },
    { n: '회원 등급', i: 'star-o', on: false, d: '구매 금액에 따라 등급을 나누고 등급별 혜택을 줍니다.', user: '마이페이지 등급 표시 · 등급 혜택 안내', admin: '회원 > 회원 등급 · 회원 목록 등급 필터', noti: '등급 변경 1종', stat: '꺼짐 — 모든 회원이 일반 회원', link: '회원 등급' },
    { n: '리뷰', i: 'comment-o', on: true, d: '구매확정한 고객이 별점과 글·사진을 남깁니다.', user: '상품 상세 리뷰 탭 · 마이페이지 리뷰 · 메인의 후기 모음 블록 · 상단 메뉴 리뷰', admin: '고객응대 > 리뷰', noti: '리뷰 작성 요청 1종', stat: '리뷰 128개 · 평균 4.8', link: '리뷰' },
    { n: '상품 문의', i: 'help-o', on: true, d: '상품 상세에서 고객이 질문을 남기고 운영자가 답합니다.', user: '상품 상세 문의 탭 · 마이페이지 상품 문의', admin: '고객응대 > 상품 문의', noti: '문의 답변 1종 · 내부 새 문의', stat: '미답변 2건', link: '상품 문의' },
    { n: '비회원 주문', i: 'user-o', on: true, d: '가입하지 않고 주문하고, 주문번호와 휴대폰 번호로 조회합니다.', user: '로그인 화면의 비회원으로 주문하기 · 비회원 주문 조회 · 주문서 주문 비밀번호', admin: '주문 목록의 비회원 표시', noti: '비회원용 주문 알림(조회 링크 포함)', stat: '진행 중인 비회원 주문 14건', link: '회원가입·로그인 설정' },
    { n: '스마트스토어 연동', i: 'naver-square', on: true, d: '네이버 스마트스토어의 상품·주문을 이 관리자에서 함께 다룹니다.', user: '고객 화면 변화 없음', admin: '판매채널 > 스마트스토어 연동 · 주문 목록 채널 칸 · 상품 등록의 스마트스토어 연동', noti: '내부 연동 오류', stat: '처리 중인 스마트스토어 주문 37건 · 마지막 수집 14:10', link: '스마트스토어 연동' },
    { n: '정기배송', i: 'renew', on: false, soon: true, d: '정해진 주기로 자동 결제하고 보내 줍니다.', user: '상품 상세 정기배송 신청 · 마이페이지 정기배송', admin: '주문 > 정기배송', noti: '결제 예정 · 결제 실패', stat: '2단계에 제공 예정', link: '' },
];

const EXTRA = [
    { n: '휴면 회원', i: 'time-o', on: false, d: '1년 동안 로그인하지 않은 회원을 휴면으로 바꾸고 정보를 따로 보관합니다.', user: '휴면 회원 로그인 시 휴면 해제 화면', admin: '회원 > 휴면·탈퇴의 휴면 예정 · 휴면 탭 (끄면 탈퇴 탭만)', noti: '휴면 전환 30일 전 안내 1종', stat: '꺼짐 — 오래 로그인하지 않아도 회원 상태가 그대로', link: '휴면·탈퇴', tag: '법으로 정해진 의무 아님' },
    { n: '식품·건강 표현 주의 안내', i: 'warning', on: true, d: '식품을 파는 몰에서 운영자가 문구를 고칠 때 쓰면 안 되는 표현을 편집 화면 위에 항상 보여 줍니다.', user: '리뷰 작성 화면에 효능·효과를 단정하는 표현 안내 한 줄', admin: '상품 등록 상세설명 · 메인 화면 구성 · 콘텐츠 페이지 · 리뷰 편집 화면 위 안내 띠', noti: '없음', stat: '켜짐 — 편집 화면 4곳에 안내 띠', link: '안내 문구 보기', tag: '식품 · 건강 관련 몰용' },
];

const modRow = (m) => `<div style="border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-bottom:8px;background:${m.on ? '#fff' : 'var(--box)'}"><div style="display:flex;align-items:center;gap:12px"><span style="flex:none;width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:6px;font-size:19px;background:#fff">${Icon(m.i)}</span><div style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center"><b style="font-size:14.5px">${m.n}</b>${m.soon ? Badge('준비 중', 'dash') : m.on ? Badge('사용 중', 'check') : Badge('꺼짐', 'mute')}${m.tag ? Badge(m.tag, 'line') : ''}</div><div style="font-size:12.5px;color:var(--ink2);margin-top:2px">${m.d}</div></div>${m.link ? Btn(`${m.link}${m.link.endsWith('보기') ? '' : ' 설정'}`, { size: 'sm', iconRight: 'angle-right-min', disabled: !m.on && !m.link.endsWith('보기') }) : ''}${Toggle('', { on: m.on, disabled: m.soon })}</div><div style="display:grid;grid-template-columns:76px 1fr;gap:4px 10px;font-size:12px;margin:10px 0 0 50px;color:var(--ink2)"><span style="color:var(--mute)">고객 화면</span><span>${m.user}</span><span style="color:var(--mute)">관리자 메뉴</span><span>${m.admin}</span><span style="color:var(--mute)">알림</span><span>${m.noti}</span><span style="color:var(--mute)">지금</span><span><b>${m.stat}</b></span></div></div>`;

const state1 = StateBlock({ idx: 1, title: '모듈 목록(적립금·쿠폰·등급·리뷰·상품문의·비회원 주문·스마트스토어·정기배송(준비 중))', note: '설정 > 기능 켜고 끄기. 기능마다 한 칸씩, 켜면 무엇이 생기는지(고객 화면 · 관리자 메뉴 · 알림)와 지금 쌓인 자료를 보여 줍니다.' },
    Anno({ title: '왜 이렇게 하나' }, '이 솔루션은 쇼핑몰 의뢰마다 다시 씁니다. 상품이 하나뿐인 이너에라에 회원 등급은 운영 부담만 되고, 다른 몰은 적립금을 안 쓸 수 있습니다. 기능을 스위치로 두면 고객사마다 코드를 고치지 않고 이 화면에서 맞춥니다. 끈 기능은 고객 화면·관리자 메뉴·알림·권한 표에서 함께 사라져 운영자가 쓰지 않는 메뉴를 보지 않습니다.'),
    Anno({ warn: true, title: '초기값 · 관리자가 바꿀 수 있는 범위' }, '이너에라 적용 값: 쿠폰 · 적립금 · 리뷰 · 상품 문의 · 비회원 주문 · 스마트스토어 연동 = 켬 / 회원 등급 · 정기배송 = 끔. 이 화면은 최고관리자만 봅니다. 정기배송은 2단계 제공이라 준비 중으로 보이고 켤 수 없습니다. 기능을 꺼도 쌓인 자료(적립금 잔액 · 쿠폰 · 리뷰)는 지워지지 않고 다시 켜면 돌아옵니다.'),
    Canvas({ label: 'A-97 · 기능 목록 (이너에라 값: 6개 켬 · 회원 등급 끔 · 정기배송 준비 중)' }, Page(MODS.map(modRow), Note('아래에 몰의 성격에 따라 켜는 안내·정책 기능 2개(휴면 회원 · 식품·건강 표현 주의 안내)가 이어집니다.'))),
    CanvasRow(
        Canvas({ size: 'auto', label: '회원 등급 스위치를 켤 때 (켠 뒤 해야 할 설정 안내)', right: '팝업만', pad: 20 }, Modal({ title: '회원 등급을 켤까요?', w: 520, foot: [Btn('취소'), Btn('켜고 등급 설정하러 가기', 'primary')] }, Text('켜면 아래가 생깁니다.', { b: true }), KV([['고객 화면', '마이페이지에 등급과 다음 등급까지 남은 금액'], ['관리자 메뉴', '회원 > 회원 등급 · 회원 목록의 등급 필터와 일괄 등급 변경'], ['알림', '등급 변경 안내 1종 (꺼진 상태로 추가)']], { wide: true }), Note('등급 기준과 혜택을 정하기 전까지는 모든 회원이 일반 회원으로 보입니다. 켠 뒤 회원 > 회원 등급에서 등급을 만들어 주세요.'))),
        Canvas({ size: 'auto', label: '정기배송(준비 중) 스위치를 눌렀을 때', right: '토스트만', pad: 20 }, Toast('정기배송은 준비 중인 기능입니다. 제공되면 이 화면에서 켤 수 있습니다.', { icon: 'info-o' })),
    ),
    Canvas({ size: 'auto', label: '기능을 켠 뒤', right: '토스트만', pad: 20 }, Toast('회원 등급을 켰습니다. 관리자 왼쪽 메뉴에 회원 > 회원 등급이 생겼습니다.', { action: '회원 등급 설정' })),
);

const impact = (rows) => Table({ dense: true, cols: [{ t: '어디', w: 110 }, '끄면 이렇게 됩니다'], rows });
const agree = (t, on = false) => `<div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line2)">${Check(t, { on })}</div>`;

const pointOff = (o = {}) => Modal({ title: '적립금을 끌까요?', w: 640, foot: [Btn('취소'), Btn(o.pick === 1 ? '12월 31일에 끄도록 예약' : '적립금 끄기', { kind: 'danger', disabled: !o.ok })] },
    Note('회원 <b>1,284명</b>이 가진 적립금 합계 <b>2,846,300원</b>이 있습니다. 어떻게 할지 먼저 골라 주세요.', { warn: true }),
    `<div style="border:1px solid var(--line);border-radius:6px;margin:10px 0">${[
        ['그대로 보관 (권장)', '잔액은 지워지지 않지만 쓸 수 없게 됩니다. 다시 켜면 그대로 돌아옵니다. 보관 중에는 소멸 기한이 흐르지 않습니다.', true],
        ['끄기 전에 쓸 기간을 준 뒤 끄기', '고객에게 적립금 사용 종료를 알리고 고른 날짜에 꺼지게 예약합니다. 그날까지는 쓸 수 있습니다.', false],
        ['같은 금액의 쿠폰으로 바꿔 주기', '쿠폰 기능이 켜져 있을 때만. 회원마다 잔액만큼의 금액 할인 쿠폰 1장(유효 90일)을 발급하고 적립금은 0원으로 만듭니다. 되돌릴 수 없습니다.', false],
    ].map(([t, d, on], i) => `<div style="padding:12px 14px;${i ? 'border-top:1px solid var(--line2);' : ''}${(o.pick === i || (o.pick === undefined && on)) ? 'background:var(--box);' : ''}">${Radio(`<b>${t}</b>`, { on: o.pick === undefined ? on : o.pick === i })}<div style="font-size:12.5px;color:var(--ink2);margin:4px 0 0 26px">${d}</div>${o.pick === 1 && i === 1 ? `<div style="margin:8px 0 0 26px;display:flex;gap:8px;align-items:center;font-size:12.5px">${Input({ value: '2026-12-31 (목)', icon: 'calendar', w: 180 })} 까지 쓸 수 있음 · ${Check('회원 전체에게 지금 안내 메일 보내기', { on: true })}</div>` : ''}</div>`).join('')}</div>`,
    impact([['고객 화면', '상품 상세의 적립 예정 · 주문서의 적립금 사용 칸 · 마이페이지의 적립금 메뉴가 사라집니다'], ['관리자 메뉴', '혜택 > 적립금 · 회원 상세의 적립금 탭 · 리뷰의 포토 리뷰 적립금 지급이 사라집니다'], ['알림', '적립금 적립 · 소멸 예정 등 4종이 멈춥니다'], ['진행 중 주문', '적립금을 써서 결제한 주문 86건을 취소·반품하면 쓴 적립금은 보관 잔액으로 돌아갑니다'], ['구매확정 대기', '아직 지급되지 않은 적립 예정 318건은 지급되지 않습니다']]),
    agree('위 내용을 확인했습니다', o.ok),
);

const state2 = StateBlock({ idx: 2, title: '끌 때 영향 안내 팝업', note: '켜져 있는 기능의 스위치를 끄면 바로 꺼지지 않고, 무엇이 사라지고 쌓인 자료는 어떻게 되는지 먼저 알려 줍니다. 기능마다 내용이 달라 모두 그렸습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '기능을 끄는 것은 스위치 하나지만 영향은 고객 돈(적립금 잔액), 진행 중인 주문, 이미 나간 쿠폰에 미칩니다. 끄기 전에 숫자로 보여 주고(회원 몇 명 · 얼마 · 주문 몇 건), 고객 돈이 걸린 적립금은 잔액을 어떻게 할지 고르게 합니다. 확인 체크를 해야 끄기 버튼이 눌립니다.'),
    Anno({ warn: true, title: '기능별 분기' }, '적립금 = 잔액 처리 방법 3가지 중 선택 / 쿠폰 = 이미 발급된 쿠폰 처리 / 리뷰 = 메인의 후기 모음 블록과 상단 메뉴가 함께 숨음 / 비회원 주문 = 진행 중 주문의 조회는 유지 / 스마트스토어 = 처리 중인 주문이 있으면 끌 수 없음(막힘). 어떤 경우에도 자료는 지우지 않습니다.'),
    Canvas({ label: 'A-97 · 적립금 스위치 끄기 → 영향 안내 팝업 (보유 적립금 처리 방법 선택 · 확인 전 = 끄기 버튼 비활성)' }, Overlay({ bg: Page(MODS.slice(0, 5).map(modRow)), h: 880 }, pointOff())),
    Canvas({ size: 'auto', label: '처리 방법 = 쓸 기간을 준 뒤 끄기 (날짜 칸이 생김) · 확인 체크 → 버튼 활성', right: '팝업만', pad: 20 }, pointOff({ pick: 1, ok: true })),
    CanvasRow(
        Canvas({ size: 'auto', label: '쿠폰 끄기', right: '팝업만', pad: 20 }, Modal({ title: '쿠폰을 끌까요?', w: 560, foot: [Btn('취소'), Btn('쿠폰 끄기', { kind: 'danger', disabled: true })] },
            Note('고객이 가진 쓰지 않은 쿠폰이 <b>412장</b> 있습니다. 끄면 쓸 수 없게 되고, 다시 켜면 유효 기간이 남은 쿠폰은 다시 쓸 수 있습니다.', { warn: true }),
            impact([['고객 화면', '주문서의 쿠폰 적용 · 마이페이지 쿠폰 · 가입 화면의 가입 쿠폰 안내가 사라집니다'], ['관리자 메뉴', '혜택 > 쿠폰 · 회원 상세의 쿠폰 탭이 사라집니다'], ['자동 발급', '가입 쿠폰 · 첫 구매 쿠폰 발급이 멈춥니다 (설정 > 회원가입·로그인 설정의 가입 혜택도 꺼짐 표시)'], ['진행 중 주문', '쿠폰을 써서 결제한 주문은 그대로 처리됩니다'], ['띠 배너', '신규 가입하면 3,000원 쿠폰 문구의 띠 배너 1개가 자동으로 내려갑니다']]),
            agree('위 내용을 확인했습니다'))),
        Canvas({ size: 'auto', label: '리뷰 끄기', right: '팝업만', pad: 20 }, Modal({ title: '리뷰를 끌까요?', w: 560, foot: [Btn('취소'), Btn('리뷰 끄기', { kind: 'danger', disabled: true })] },
            Note('리뷰 <b>128개</b>는 지워지지 않고 숨겨집니다. 다시 켜면 그대로 보입니다.'),
            impact([['고객 화면', '상품 상세의 리뷰 탭과 별점 · 마이페이지 리뷰 · 상품 카드의 리뷰 수가 사라집니다'], ['메인 화면', '후기 모음 블록 1개가 자동으로 숨겨집니다'], ['메뉴', '상단 메뉴 · 서랍 메뉴의 리뷰가 자동으로 숨겨집니다'], ['관리자 메뉴', '고객응대 > 리뷰가 사라집니다'], ['적립금', '리뷰 적립금 지급이 멈춥니다']]),
            agree('위 내용을 확인했습니다'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '비회원 주문 끄기', right: '팝업만', pad: 20 }, Modal({ title: '비회원 주문을 끌까요?', w: 560, foot: [Btn('취소'), Btn('비회원 주문 끄기', { kind: 'danger', disabled: true })] },
            Note('진행 중인 비회원 주문이 <b>14건</b> 있습니다. 이 주문들의 조회 · 취소 · 반품은 끝날 때까지 그대로 됩니다.'),
            impact([['고객 화면', '로그인 화면의 비회원으로 주문하기 버튼이 사라지고, 주문하려면 가입해야 합니다'], ['주문 조회', '비회원 주문 조회 화면은 진행 중 주문이 모두 끝나고 90일 뒤까지 남습니다'], ['영향', '가입을 꺼리는 고객의 주문이 줄 수 있습니다 (지난 30일 비회원 주문 비중 22%)']]),
            agree('위 내용을 확인했습니다'))),
        Canvas({ size: 'auto', label: '상품 문의 · 회원 등급 끄기 (자료만 숨김 · 간단한 확인)', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '상품 문의를 끌까요?', desc: '상품 상세의 문의 탭과 관리자 메뉴 고객응대 > 상품 문의가 사라집니다. 미답변 문의 2건이 있습니다 — 답변한 뒤 끄는 것을 권합니다. 쌓인 문의는 지워지지 않습니다.', foot: [Btn('취소'), Btn('미답변 문의 보기'), Btn('끄기', 'danger')] })),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '스마트스토어 연동 끄기 — 처리 중인 주문이 있어 끌 수 없음 (막힘)', right: '팝업만', pad: 20 }, Modal({ title: '지금은 스마트스토어 연동을 끌 수 없습니다', w: 560, foot: [Btn('닫기'), Btn('처리 중인 주문 보기', 'primary')] },
            Note('처리 중인 스마트스토어 주문이 <b>37건</b> 있습니다. 끄면 이 주문들의 발송처리·취소 결과를 네이버에 보낼 수 없어 벌점이 생길 수 있습니다.', { warn: true }),
            Table({ dense: true, cols: ['상태', { t: '건수', w: 70, align: 'right' }], rows: [['결제완료 (발주확인 전)', '14건'], ['배송준비', '9건'], ['배송중', '12건'], ['취소·반품·교환 처리 중', '2건']] }),
            Text('모든 주문이 구매확정되거나 취소·반품이 끝난 뒤 끌 수 있습니다. 새 주문 수집만 먼저 멈추려면 판매채널 > 스마트스토어 연동에서 주문 수집 일시 멈춤을 쓰세요.', { sm: true }))),
        Canvas({ size: 'auto', label: '끈 뒤', right: '토스트만', pad: 20 }, Toast('적립금을 껐습니다. 잔액 2,846,300원은 보관되고 다시 켜면 돌아옵니다.', { action: '되돌리기 (10분 안)' })),
    ),
    Canvas({ label: 'A-97 · 적립금 · 리뷰를 끈 몰의 모습 (다른 고객사 예시 — 관리자 왼쪽 메뉴와 목록이 달라짐)' }, Page(
        Grid(2,
            Box({ flat: true, title: '끄기 전 관리자 메뉴' }, Text('혜택: 쿠폰 · <b>적립금</b> · 기획전<br>고객응대: 1:1 문의 · 상품 문의 · <b>리뷰</b> · 공지사항·FAQ', { sm: true })),
            Box({ flat: true, title: '끈 뒤 관리자 메뉴' }, Text('혜택: 쿠폰 · 기획전<br>고객응대: 1:1 문의 · 상품 문의 · 공지사항·FAQ', { sm: true })),
        ),
        [{ ...MODS[1], on: false, stat: '꺼짐 — 보관 중인 잔액 2,846,300원 (회원 1,284명) · 2026-11-11 이보림이 끔' }, { ...MODS[3], on: false, stat: '꺼짐 — 숨겨진 리뷰 128개 · 2026-11-11 이보림이 끔' }].map(modRow),
    )),
);

const banPreview = `<div style="border:1px solid #ecd9a4;border-left:4px solid #c08a00;background:var(--warnbg);border-radius:4px;padding:10px 14px;font-size:12.5px;color:#5c4200;line-height:1.7">${Icon('warning')} <b>식품·건강 표현 주의</b> — 이 몰의 상품은 일반식품입니다. 아래 표현은 쓰면 안 됩니다.<br>노화 방지 · 항산화 효과 · 피로 회복 · 면역 · 피부 개선 같은 효능·기능 표현 / 질병 이름(예방·치료·완화) / 의사·전문가 추천 / 확인되지 않은 후기·수상·수치 <u>자세히 보기</u></div>`;

const state3 = StateBlock({ idx: 3, title: '휴면 회원·식품·건강 표현 주의 안내 모듈', note: '기능 목록 아래쪽의 두 칸. 몰의 성격에 따라 켜는 정책·안내 기능입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '휴면 회원: 1년 동안 로그인하지 않은 회원의 정보를 따로 보관하게 했던 제도(개인정보 유효기간제)는 2023년 9월 15일에 폐지돼 지금은 법으로 정해진 의무가 아닙니다. 휴면은 다시 사러 온 고객에게 해제 절차만 늘리므로 기본은 끔이고, 회사 방침상 필요한 고객사만 켭니다. 식품·건강 표현 주의 안내: 이너에라 상품은 일반식품이라 효능 표현을 쓰면 표시·광고 위반이 됩니다. 운영자가 문구를 고치다 실수하지 않게 편집 화면 위에 쓰면 안 되는 표현을 항상 보여 줍니다.'),
    Anno({ warn: true, title: '초기값' }, '휴면 회원 = 끔(솔루션 기본 · 이너에라도 끔) → 회원 > 휴면·탈퇴 메뉴에는 탈퇴 탭만 보이고 휴면 전환 예정 알림은 알림 목록에 나오지 않습니다. 식품·건강 표현 주의 안내 = 이너에라 켬(식품이 아닌 몰은 끔) → 상품 등록 상세설명 · 메인 화면 구성 · 콘텐츠 페이지 · 리뷰 화면 위에 안내 띠가 고정됩니다. 안내는 알려 주기만 하고 저장을 막지는 않습니다.'),
    Canvas({ label: 'A-97 · 기능 목록 아래쪽 (휴면 회원 = 끔 · 식품·건강 표현 주의 안내 = 켬)' }, Page(Text('몰의 성격에 따라 켜는 기능', { b: true }), EXTRA.map(modRow))),
    CanvasRow(
        Canvas({ size: 'auto', label: '휴면 회원 스위치를 켤 때 (법정 의무가 아님을 알리고 기준을 받음)', right: '팝업만', pad: 20 }, Modal({ title: '휴면 회원을 켤까요?', w: 600, foot: [Btn('취소'), Btn('켜기', 'primary')] },
            Note('휴면 전환은 법으로 정해진 의무가 아닙니다(개인정보 유효기간제 2023-09-15 폐지). 회사 방침으로 필요할 때만 켜 주세요. 켜면 오래 로그인하지 않은 회원이 다시 살 때 휴면 해제를 거쳐야 합니다.', { warn: true }),
            FormTable([
                { k: '휴면 기준', required: true, v: [Text('마지막 로그인 뒤', { sm: true }), Select({ value: '1년', w: 100 }), Text('동안 로그인이 없으면 휴면', { sm: true })] },
                { k: '미리 알림', v: [Text('휴면 전환', { sm: true }), Select({ value: '30일 전', w: 110 }), Text('에 메일 + 알림톡으로 안내', { sm: true })] },
                { k: '휴면 해제', v: Text('로그인하면 본인 확인(휴대폰 문자 인증) 뒤 바로 해제', { sm: true }) },
            ]),
            KV([['지금 대상', '1년 넘게 로그인하지 않은 회원 0명 (11월 2일 오픈)'], ['생기는 것', '회원 > 휴면·탈퇴에 휴면 예정 · 휴면 탭 / 알림 목록에 휴면 전환 예정 1종']], { wide: true }))),
        Canvas({ size: 'auto', label: '휴면 회원을 다시 끌 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '휴면 회원을 끌까요?', desc: '지금 휴면 상태인 회원 38명은 일반 회원으로 돌아오고 따로 보관하던 정보가 원래대로 합쳐집니다. 휴면 전환 예정 알림이 멈추고, 회원 > 휴면·탈퇴에는 탈퇴 탭만 남습니다.', ok: '끄기' })),
    ),
    Canvas({ label: 'A-97 · 식품·건강 표현 주의 안내 → 안내 문구 보기 버튼 → 팝업 (편집 화면에 뜨는 띠와 전체 목록)' }, Overlay({ bg: Page(EXTRA.map(modRow)), h: 760 }, Modal({ title: '식품·건강 표현 주의 안내', w: 760, foot: [Btn('닫기'), Btn('문구 저장', 'primary')] },
        Text('편집 화면 위에 고정으로 보이는 띠', { b: true }), banPreview,
        '<div style="height:12px"></div>',
        Table({ dense: true, cols: [{ t: '묶음', w: 150 }, '쓰면 안 되는 표현 (예)', { t: '대신 쓸 수 있는 말 (예)', w: 230 }], rows: [
            ['효능·기능', '노화 방지 · 항산화 효과 · 피로 회복 · 면역력 · 피부 개선 · 활력 충전', '원료 이름과 유래 · 하루 한 포 같은 먹는 방법'],
            ['질병', '○○ 예방 · 치료 · 완화 · 개선, 병 이름을 드는 문구', '쓰지 않음'],
            ['권위', '의사·약사·전문가 추천, 병원에서 쓰는', '인증·특허는 받은 그대로 표기 (HACCP · 특허 번호)'],
            ['근거 없는 자랑', '확인되지 않은 후기 · 수상 · 판매 1위 · 만족도 수치', '실제 리뷰 원문 · 확인된 수치와 출처'],
        ] }),
        FormTable([
            { k: '띠가 보이는 화면', v: [Check('상품 등록 · 상세설명', { on: true }), Check('메인 화면 구성', { on: true }), Check('콘텐츠 페이지', { on: true }), Check('배너·팝업', { on: true }), Check('리뷰 (베스트 지정 · 답글)', { on: true })] },
            { k: '원료 안내 주석', v: Input({ value: '*상기 내용은 제품이 아닌 원료에 대한 정보입니다.', w: 440 }), help: '원료를 소개하는 블록 아래에 자동으로 붙는 고정 문구입니다.' },
        ]),
        Note('표현 목록은 고객사의 표시·광고 기준 문서를 옮긴 것이고 최고관리자가 고칠 수 있습니다. 안내는 알려 주기만 하고 저장을 막지 않습니다 — 최종 판단은 고객사 몫입니다.'),
    ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '식품·건강 표현 주의 안내를 끌 때', right: '팝업만', pad: 20 }, Confirm({ w: 420, title: '식품·건강 표현 주의 안내를 끌까요?', desc: '상품 등록 · 메인 화면 구성 · 콘텐츠 페이지 · 배너·팝업 · 리뷰 화면 위의 안내 띠가 사라집니다. 식품을 파는 몰이라면 켜 두는 것을 권합니다 — 효능 표현은 표시·광고 위반이 될 수 있습니다.', ok: '끄기', danger: true })),
        Canvas({ size: 'auto', label: '켠 몰의 편집 화면 위 모습 (메인 화면 구성 · 콘텐츠 페이지에서 자세히 그림)', right: '부분', pad: 20 }, `<div style="width:640px">${banPreview}</div>`),
    ),
);

export default function A97() {
    return [state1, state2, state3].join('');
}
