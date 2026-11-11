import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Badge, Select, Tabs, Note, Text, Icon, Flex, Box, Table, SHOP,
} from '../lib/blocks.js';

const TABS = ['이용약관', '개인정보처리방침'];
const TERM_VERS = [{ t: '2026-12-01 시행 (현재)', sub: '3판', on: true }, { t: '2026-08-20 ~ 2026-11-30', sub: '2판' }, { t: '2026-03-02 ~ 2026-08-19', sub: '1판' }];

const art = (t, body) => `<h3 style="font-size:15px;margin:26px 0 8px">${t}</h3><div style="font-size:13.5px;line-height:1.9;color:var(--ink2)">${body}</div>`;

const termsBody = (o = {}) => [
    art('제1조 (목적)', `이 약관은 ${SHOP.name} ${SHOP.nameEn}(이하 "회사")가 운영하는 온라인 쇼핑몰(이하 "몰")에서 제공하는 전자상거래 서비스를 이용할 때 회사와 이용자의 권리·의무와 책임 사항을 정하는 것을 목적으로 합니다.`),
    art('제2조 (정의)', '① "몰"이란 회사가 상품을 이용자에게 제공하기 위해 컴퓨터 등 정보통신설비를 이용하여 상품을 거래할 수 있도록 만든 가상의 영업장을 말합니다.<br>② "이용자"란 몰에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원과 비회원을 말합니다.<br>③ "회원"이란 회사에 개인정보를 제공하여 회원 등록을 한 사람으로서 몰이 제공하는 서비스를 계속 이용할 수 있는 사람을 말합니다.'),
    art('제9조 (구매 신청과 계약의 성립)', '① 이용자는 몰에서 상품 선택, 받는 분 정보 입력, 약관 동의, 결제 수단 선택의 순서로 구매를 신청합니다.<br>② 회사가 주문 완료 화면 또는 알림으로 수신 확인을 알린 때에 계약이 성립한 것으로 봅니다.'),
    o.short ? '' : art('제15조 (청약 철회 등)', `① 회사와 상품 구매 계약을 맺은 이용자는 상품을 받은 날부터 7일 이내에 청약을 철회할 수 있습니다.<br>② 다음의 경우에는 청약 철회가 제한됩니다: 이용자의 책임으로 상품이 없어지거나 훼손된 경우, 포장을 뜯어 가치가 현저히 줄어든 식품의 경우.<br>③ 상품의 내용이 표시·광고와 다르거나 계약 내용과 다르게 이행된 때에는 상품을 받은 날부터 3개월 이내, 그 사실을 안 날부터 30일 이내에 청약을 철회할 수 있습니다.${o.old ? '' : '<br><span style="border-bottom:2px solid var(--dark)">④ 단순 변심으로 반품할 때 드는 왕복 배송비는 이용자가 부담하며, 금액은 몰의 배송·교환·반품 안내에 적습니다.</span>'}`),
    o.short ? '' : art('제16조 (청약 철회 등의 효과)', '① 회사는 이용자에게서 상품을 돌려받은 날부터 3영업일 이내에 이미 받은 대금을 환급합니다.<br>② 신용카드 등으로 결제한 경우에는 지체 없이 결제 업자에게 대금 청구를 멈추거나 취소하도록 요청합니다.'),
    art('부칙', o.old ? '이 약관은 2026년 8월 20일부터 시행합니다.' : '이 약관은 2026년 12월 1일부터 시행합니다. 종전 약관(2026년 8월 20일 시행)은 이 약관으로 바뀝니다.'),
];

const privacyBody = () => [
    art('1. 수집하는 개인정보 항목과 수집 방법', Table({ dense: true, cols: [{ t: '구분', w: 150 }, '수집 항목', { t: '필수·선택', w: 90 }], rows: [
        ['회원 가입', '이메일, 비밀번호, 이름, 휴대폰 번호', '필수'], ['회원 가입', '생년월일, 혜택 알림 수신 동의', '선택'],
        ['간편 로그인(카카오·네이버)', '간편 로그인 식별값, 이메일, 이름, 휴대폰 번호', '필수'], ['주문·배송', '받는 분 이름, 연락처, 주소, 배송 메모, 공동현관 출입 방법', '필수'],
        ['결제·환불', '결제 수단 정보(카드사 이름·승인번호), 환불 계좌(가상계좌 결제 시)', '필수'], ['비회원 주문', '주문자 이름, 휴대폰 번호, 이메일, 주문 비밀번호', '필수']] })),
    art('2. 개인정보의 이용 목적', '회원 관리(본인 확인, 부정 이용 방지), 주문한 상품의 배송과 대금 결제, 취소·반품·교환·환불 처리, 문의 응대, 동의한 회원에 한해 혜택·이벤트 안내.'),
    art('3. 보유 및 이용 기간', '회원 탈퇴 시 지체 없이 파기합니다. 다만 관계 법령에 따라 계약·청약 철회 기록 5년, 대금 결제와 재화 공급 기록 5년, 소비자 불만·분쟁 처리 기록 3년, 접속 기록 3개월을 보관합니다.'),
    art('4. 개인정보 처리의 위탁', Table({ dense: true, cols: [{ t: '위탁받는 곳', w: 220 }, '맡기는 일'], rows: [
        ['CJ대한통운 등 계약 택배사', '상품 배송, 반품·교환 회수'], ['포트원 및 결제 대행사', '결제 처리, 취소·환불'], ['알림톡·문자 발송 대행사', '주문·배송 안내 발송'], ['어니스트패밀리', '쇼핑몰 시스템 운영·유지보수']] })),
    art('8. 개인정보 보호책임자', `이름 ${SHOP.ceo} (대표) · 전화 070-****-1234 · 이메일 privacy@innerera.example<br>${SHOP.name} ${SHOP.nameEn} · 사업자등록번호 ${SHOP.bizNo} · ${SHOP.addr}`),
    art('부칙', '이 개인정보처리방침은 2026년 12월 1일부터 시행합니다.'),
];

const TOC = (items, on) => `<div style="width:220px;flex:none;border:1px solid var(--line);border-radius:6px;padding:16px;font-size:13px;line-height:2.1;align-self:flex-start"><b>목차</b><br>${items.map((t) => (t === on ? `<b><u>${t}</u></b>` : `<span style="color:var(--ink2)">${t}</span>`)).join('<br>')}</div>`;
const TERM_TOC = ['제1조 목적', '제2조 정의', '제3조 약관의 게시와 개정', '제9조 구매 신청과 계약의 성립', '제12조 대금 지급 방법', '제15조 청약 철회 등', '제16조 청약 철회 등의 효과', '제22조 분쟁 해결', '부칙'];
const PRIV_TOC = ['1. 수집 항목과 방법', '2. 이용 목적', '3. 보유 및 이용 기간', '4. 처리의 위탁', '5. 제3자 제공', '6. 파기 절차와 방법', '7. 이용자의 권리', '8. 개인정보 보호책임자', '부칙'];

const VerBar = (ver, o = {}) => Flex({ justify: 'space-between', align: 'center', wrap: true },
    `<div style="font-size:13.5px">${o.old ? Badge('지난 버전', 'dash') : Badge('현재 버전', 'solid')} <b style="margin-left:6px">${ver}</b> <span style="color:var(--mute)">· ${o.note || '공고일 2026-11-02'}</span></div>`,
    Flex({ gap: 8, align: 'center' }, Text('다른 버전 보기', { sm: true, mute: true }), o.open ? Select({ value: TERM_VERS[0].t, open: true, w: 260, options: TERM_VERS }) : Select({ value: o.sel || TERM_VERS[0].t, w: 260 }), Btn('인쇄', { icon: 'print', size: 'sm' })));

const Changes = (o = {}) => Box({ flat: true, title: '이번 버전에서 바뀐 내용', sub: '2판(2026-08-20) → 3판(2026-12-01)' },
    `<ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.9"><li>제15조 4항 신설 — 단순 변심 반품의 왕복 배송비를 이용자가 부담한다는 내용을 적었습니다.</li><li>제12조 — 결제 수단에 토스페이를 더했습니다.</li></ul>`,
    o.m ? '' : Text('바뀐 조항은 본문에서 굵은 밑줄로 표시됩니다. 이용자에게 불리한 변경이라 시행 30일 전에 공지했습니다.', { sm: true, mute: true }));

const Page = (tab, ...body) => UserPage({ crumb: ['홈', tab], title: '약관·방침' }, Tabs(TABS, tab, { kind: 'box' }), '<div style="height:20px"></div>', body);
const Doc = (toc, on, body) => `<div style="display:flex;gap:40px;margin-top:8px">${TOC(toc, on)}<div style="flex:1;min-width:0">${body.flat(Infinity).join('')}</div></div>`;
const gap = '<div style="height:16px"></div>';

const OldBand = (m) => `<div style="border:2px dashed var(--dark);border-radius:6px;padding:${m ? 12 : 14}px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:13.5px;margin-bottom:16px">${Icon('warning')}<div style="flex:1;min-width:180px"><b>지금 보는 것은 지난 버전입니다.</b> 2026-08-20부터 2026-11-30까지 적용된 약관이며 지금은 효력이 없습니다.</div>${Btn('현재 버전으로 돌아가기', { kind: 'primary', size: 'sm' })}</div>`;

const state1 = StateBlock({ idx: 1, title: '현재 버전', note: '바닥글·가입·주문서의 약관 링크에서 들어옵니다. 지금 시행 중인 버전이 나오고, 탭으로 이용약관과 개인정보처리방침을 오갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '약관과 방침은 "언제부터 적용되는 어느 판인지"가 본문만큼 중요합니다. 맨 위에 시행일과 공고일을 두고, 바뀐 내용 요약을 본문 앞에 보여 줍니다. 본문·시행일·바뀐 내용 요약은 운영자가 관리자 설정 > 약관·정책에서 새 버전으로 등록하고, 시행일이 되면 자동으로 현재 버전이 바뀝니다. 사업자 정보는 설정 > 쇼핑몰 정보 값이 들어갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '초기값: 솔루션 표준 약관·방침(공정위 전자상거래 표준약관 바탕)에 고객사 정보가 채워진 1판. 시행 예정인 새 버전이 등록돼 있으면 시행 전까지 "0월 0일부터 바뀝니다" 띠와 미리 보기 링크를 보여 줍니다. 개인정보처리방침은 수집 항목·위탁처를 표로 보여 주고, 결제·택배·알림 설정에서 켠 업체가 위탁 표에 맞게 들어갔는지 운영자가 확인합니다. 로그인 없이 볼 수 있습니다.'),
    Canvas({ label: 'U-26 · 이용약관 · 현재 버전 (바뀐 조항 밑줄)' }, Page('이용약관', VerBar('2026-12-01 시행 · 3판'), gap, Changes(), Doc(TERM_TOC, '제15조 청약 철회 등', termsBody()))),
    Canvas({ label: 'U-26 · 개인정보처리방침 탭 · 현재 버전 (수집 항목·위탁 표)' }, Page('개인정보처리방침', VerBar('2026-12-01 시행 · 4판', { note: '공고일 2026-11-02' }), Doc(PRIV_TOC, '1. 수집 항목과 방법', privacyBody()))),
    Canvas({ label: 'U-26 · 새 버전 시행 전 (2026-11-11 기준) — 예고 띠' }, Page('이용약관',
        Note('이용약관이 2026-12-01부터 바뀝니다. 지금은 2판(2026-08-20 시행)이 적용됩니다. <u>바뀔 약관 미리 보기</u>', { warn: true }),
        VerBar('2026-08-20 시행 · 2판', { note: '다음 버전 2026-12-01 시행 예정', sel: '2026-08-20 시행 (현재)' }), Doc(TERM_TOC, '제1조 목적', termsBody({ old: true, short: true })))),
    Canvas({ size: 'mobile', label: 'U-26 · 모바일 · 목차는 접힌 select, 본문 한 단' }, MobilePage({ title: '약관·방침', tab: false },
        Tabs(TABS, '이용약관', { kind: 'box' }), '<div style="height:12px"></div>',
        `<div style="font-size:13px;margin-bottom:8px">${Badge('현재 버전', 'solid')} <b>2026-12-01 시행 · 3판</b></div>`,
        Select({ value: '2026-12-01 시행 (현재)', w: '100%' }), '<div style="height:8px"></div>',
        Select({ value: '목차 · 제1조 목적', w: '100%' }), '<div style="height:12px"></div>', Changes({ m: true }), termsBody({ short: true }))),
);

const state2 = StateBlock({ idx: 2, title: '이전 버전 보기', note: '"다른 버전 보기"에서 지난 시행일을 고르면 그때의 글을 그대로 보여 줍니다. 주소에 버전이 붙어(/policy/terms?v=2) 그대로 공유할 수 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '분쟁이 생기면 "주문한 날에 적용되던 약관"을 봐야 합니다. 그래서 지난 버전을 지우지 않고 시행 기간과 함께 남겨 두고, 고객이 지난 버전을 현재 약관으로 오해하지 않게 점선 띠와 "현재 버전으로 돌아가기"를 본문 위에 고정합니다. 개인정보처리방침도 같은 방식입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '버전 목록은 최신이 위, 각 줄에 적용 기간과 판 번호. 등록만 하고 시행일이 오지 않은 버전은 "시행 예정"으로 표시됩니다. 운영자는 한 번 시행된 버전의 본문을 고칠 수 없고(오타도 새 버전으로) 이 화면에서 지난 버전이 사라지지 않습니다.'),
    Canvas({ label: 'U-26 · 다른 버전 보기 목록을 연 모습', h: 420 }, Page('이용약관', VerBar('2026-12-01 시행 · 3판', { open: true }))),
    Canvas({ label: 'U-26 · 2026-08-20 ~ 2026-11-30 (2판)을 고른 뒤 — 지난 버전 띠' }, Page('이용약관', OldBand(),
        VerBar('2026-08-20 ~ 2026-11-30 적용 · 2판', { old: true, note: '공고일 2026-08-13', sel: '2026-08-20 ~ 2026-11-30' }), Doc(TERM_TOC, '제15조 청약 철회 등', termsBody({ old: true })))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-26 · 모바일 · 지난 버전' }, MobilePage({ title: '약관·방침', tab: false },
            Tabs(TABS, '이용약관', { kind: 'box' }), '<div style="height:12px"></div>', OldBand(true),
            Select({ value: '2026-08-20 ~ 2026-11-30', w: '100%' }), termsBody({ old: true, short: true }))),
        Canvas({ size: 'auto', label: '개인정보처리방침 버전 목록 (시행 예정 포함)', right: '부분', pad: 20 },
            Select({ value: '2026-12-01 시행 (현재)', open: true, w: 300, options: [{ t: '2027-01-15 시행 예정', sub: '5판' }, { t: '2026-12-01 시행 (현재)', sub: '4판', on: true }, { t: '2026-08-20 ~ 2026-11-30', sub: '3판' }, { t: '2026-05-11 ~ 2026-08-19', sub: '2판' }, { t: '2026-03-02 ~ 2026-05-10', sub: '1판' }] })),
        Canvas({ size: 'auto', label: '없는 버전 주소(?v=9)로 들어왔을 때', right: '안내만', pad: 20 },
            `<div style="width:360px">${Note('찾는 버전이 없어 현재 버전을 보여 드립니다.', { warn: true })}</div>`),
    ),
);

export default function U26() {
    return [state1, state2].join('');
}
