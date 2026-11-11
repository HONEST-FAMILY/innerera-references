import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, BtnRow, Badge, OrderBadge, Stepper, Overlay, Toast,
    ProductRow, Box, KV, Note, Text, Icon, Divider, SHOP,
} from '../lib/blocks.js';

const STEPS = ['장바구니', '주문서·결제', '주문 완료'];
const NO = '20261111-000131';
const ADDR = '(03925) 서울 마포구 월드컵북로 ***, 101동 1203호';

const Hero = (icon, title, desc) => `<div style="text-align:center;padding:8px 0 28px"><div style="font-size:52px;line-height:1">${Icon(icon)}</div><h2 style="font-size:24px;margin:12px 0 8px">${title}</h2><p style="margin:0;color:var(--ink2);font-size:14px">${desc}</p></div>`;
const NoLine = (o = {}) => `<div style="display:flex;justify-content:center;align-items:center;gap:10px;background:var(--box);border-radius:6px;padding:14px;margin-bottom:20px;font-size:14px"><span style="color:var(--mute)">주문번호</span><b style="font-size:17px;letter-spacing:.3px">${NO}</b>${Btn('복사', { size: 'sm', icon: 'documents-o' })}${o.badge || ''}</div>`;
const two = (a, b) => `<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start"><div>${a}</div><div>${b}</div></div>`;
const Wrap = (...body) => `<div style="max-width:860px;margin:0 auto">${body.join('')}</div>`;
const pr = (rows, total) => `${rows.map(([k, v]) => `<div style="display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--ink2)"><span>${k}</span><span>${v}</span></div>`).join('')}<div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid var(--dark);margin-top:8px;padding-top:12px;font-weight:700"><span>${total[0]}</span><b style="font-size:19px">${total[1]}</b></div>`;

const ItemBox = () => Box({ title: '주문 상품' }, ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' }));
const ShipBox = () => Box({ title: '배송지' }, KV([['받는 분', '김민지'], ['연락처', '010-****-1234'], ['주소', ADDR], ['배송 요청', '문 앞에 놓아 주세요']]));
const PaidBox = (method, o = {}) => Box({ title: '결제 정보' },
    pr([['상품 금액', '93,000원'], ['주문서 쿠폰 · 신규 가입 3,000원', '-3,000원'], ['적립금 사용', '-6,400원'], ['배송비', '0원']], [o.totalLabel || '결제한 금액', '83,600원']),
    `<div style="margin-top:12px;font-size:13px;color:var(--ink2)">${method}</div>`,
    o.noEarn ? '' : `<div style="margin-top:8px;font-size:13px">${Icon('gift-o')} 구매확정하면 <b>836원</b>이 적립됩니다</div>`,
);
const Notice = (lines) => `<div style="border:1px solid var(--line);border-radius:6px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:var(--ink2)">${lines.map((l) => `<div style="display:flex;gap:8px;padding:3px 0">${l}</div>`).join('')}</div>`;
const Actions = (...btns) => `<div style="display:flex;gap:8px;justify-content:center;margin-top:8px">${btns.join('')}</div>`;
const Page = (o, ...body) => UserPage({ loggedIn: o.guest ? false : true, cart: o.cart || 0, footer: !!o.footer }, Stepper(STEPS, o.step === undefined ? 2 : o.step), Wrap(...body));

const doneNotice = Notice([
    `${Icon('kakaotalk')}<span>주문 내용을 <b>카카오 알림톡</b>(010-****-1234)과 메일(minji.kim@example.com)로 보냈습니다. 알림톡을 받지 못하면 문자로 다시 보냅니다.</span>`,
    `${Icon('truck')}<span>평일 오후 2시 이전 결제는 당일 출고되며, 출고하면 송장번호를 알림톡으로 알려 드립니다.</span>`,
    `${Icon('info-o')}<span>출고 준비를 시작하기 전(결제완료 단계)에는 주문 상세에서 바로 취소할 수 있습니다.</span>`,
]);

const mBox = (title, ...body) => `<div style="border-bottom:8px solid var(--box);margin:0 -16px;padding:16px"><b style="display:block;font-size:15px;margin-bottom:10px">${title}</b>${body.join('')}</div>`;
const mHero = (icon, title, desc) => `<div style="text-align:center;padding:12px 0 18px"><div style="font-size:44px;line-height:1">${Icon(icon)}</div><h2 style="font-size:20px;margin:10px 0 6px">${title}</h2><p style="margin:0;color:var(--ink2);font-size:13px">${desc}</p></div>`;
const mNo = `<div style="display:flex;justify-content:center;align-items:center;gap:8px;background:var(--box);border-radius:6px;padding:12px;font-size:13px"><span style="color:var(--mute)">주문번호</span><b style="font-size:15px">${NO}</b>${Btn('복사', { size: 'sm' })}</div>`;

const state1 = StateBlock({ idx: 1, title: '카드·간편결제 완료', note: '카드·실시간 계좌이체·카카오페이·네이버페이·토스페이로 결제가 끝나 결제창에서 돌아온 모습. 주문 상태는 결제완료입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객이 이 화면에서 확인하려는 것은 세 가지 — 결제가 됐는지, 어디로 오는지, 얼마 나갔는지입니다. 그래서 주문번호(복사 버튼)·배송지·결제 금액만 크게 두고 나머지는 주문 상세로 보냅니다. 알림톡·메일이 나갔다는 사실을 적어 "주문 확인 문자가 안 와요" 문의를 줄입니다. 이 화면을 새로 고쳐도 결제가 다시 되지 않습니다.'),
    Anno({ title: '기능 켜고 끄기 · 유형별 분기 · 관리자가 바꾸는 범위' }, '적립금을 끈 몰은 적립 예정 줄이 없고, 쿠폰을 끈 몰은 쿠폰 할인 줄이 없습니다. 비회원 주문은 "주문 상세 보기" 대신 "비회원 주문 조회"로 가고, 주문번호와 주문 비밀번호가 조회에 필요하다는 안내와 회원가입 권유가 붙습니다. 완료 화면 아래 안내 문구(출고 안내 1칸)는 설정 > 주문·클레임 정책, 알림 수단은 설정 > 알림 값입니다.'),
    Canvas({ label: 'U-09 · 회원 · 신용카드 결제 완료' }, Page({ footer: true },
        Hero('check-circle-o', '주문이 완료되었습니다', '김민지 님, 주문해 주셔서 감사합니다. 2026-11-11(수) 14:07 결제'),
        NoLine({ badge: OrderBadge('결제완료') }),
        doneNotice,
        ItemBox(),
        two(ShipBox(), PaidBox('신용카드 · 신한카드(일시불) · 승인 2026-11-11 14:07')),
        Actions(Btn('쇼핑 계속하기', { size: 'lg' }), Btn('주문 상세 보기', { kind: 'primary', size: 'lg' })),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-09 · 모바일 · 카카오페이 결제 완료' }, MobilePage({ title: '주문 완료', tab: false, right: '', bottom: [Btn('쇼핑 계속하기'), Btn('주문 상세 보기', 'primary')] },
            mHero('check-circle-o', '주문이 완료되었습니다', '2026-11-11(수) 14:07 결제'),
            mNo,
            mBox('안내', Text(`${Icon('kakaotalk')} 주문 내용을 카카오 알림톡과 메일로 보냈습니다.`, { sm: true }), Text(`${Icon('truck')} 평일 오후 2시 이전 결제는 당일 출고됩니다.`, { sm: true })),
            mBox('주문 상품', ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' })),
            mBox('배송지', Text('김민지 · 010-****-1234', { sm: true }), Text(ADDR, { sm: true }), Text('문 앞에 놓아 주세요', { sm: true, mute: true })),
            mBox('결제 정보', pr([['상품 금액', '93,000원'], ['쿠폰 할인', '-3,000원'], ['적립금 사용', '-6,400원'], ['배송비', '0원']], ['결제한 금액', '83,600원']), Text('카카오페이 · 카카오페이머니', { sm: true, mute: true }), Text(`${Icon('gift-o')} 구매확정하면 836원이 적립됩니다`, { sm: true })),
        )),
        Canvas({ size: 'auto', label: '비회원 주문 완료 (아래 버튼·안내가 다름)', right: '달라지는 부분만', pad: 24 }, `<div style="width:560px">${Hero('check-circle-o', '주문이 완료되었습니다', '윤서연 님, 주문해 주셔서 감사합니다.')}${NoLine({ badge: OrderBadge('결제완료') })}${Notice([
            `${Icon('key')}<span>비회원 주문은 <b>주문번호 + 휴대폰 번호 + 주문 비밀번호</b>로 조회합니다. 주문번호는 알림톡(010-****-8834)과 메일로도 보냈습니다.</span>`,
            `${Icon('truck')}<span>평일 오후 2시 이전 결제는 당일 출고되며, 출고하면 송장번호를 알림톡으로 알려 드립니다.</span>`,
        ])}<div style="border:1px dashed var(--ink2);border-radius:6px;padding:14px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px"><span>${Icon('gift-o')} <b>지금 가입하면 이 주문도 내 주문 목록에 담기고 3,000원 쿠폰을 드립니다.</b><br><span style="color:var(--mute)">주문 때 입력한 이름·휴대폰·이메일이 채워진 채로 시작합니다.</span></span>${Btn('회원가입', { kind: 'primary', size: 'sm' })}</div>${Actions(Btn('쇼핑 계속하기', { size: 'lg' }), Btn('비회원 주문 조회', { kind: 'primary', size: 'lg' }))}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: "주문번호 '복사' → 토스트", right: '토스트만', pad: 20 }, Toast('주문번호를 복사했습니다.')),
        Canvas({ size: 'auto', label: '적립금 전액 결제(0원 결제)인 경우 결제 정보', right: '상자만', pad: 20 }, `<div style="width:420px">${Box({ title: '결제 정보' }, pr([['상품 금액', '49,000원'], ['적립금 사용', '-49,000원'], ['배송비', '0원']], ['결제한 금액', '0원']), `<div style="margin-top:12px;font-size:13px;color:var(--ink2)">적립금 전액 결제 (결제창 없이 완료)</div>`)}</div>`),
    ),
);

const Vbank = (o = {}) => `<div style="border:2px solid var(--dark);border-radius:8px;padding:20px;margin-bottom:20px">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><b style="font-size:16px">입금하실 계좌</b>${Badge('입금 기한까지 2일 23시간 남음', 'warn')}</div>
<div style="display:grid;grid-template-columns:${o.mobile ? '84px 1fr' : '120px 1fr'};gap:10px 12px;font-size:14px;align-items:center">
<span style="color:var(--mute)">입금 은행</span><b>국민은행</b>
<span style="color:var(--mute)">계좌번호</span><span style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b style="font-size:${o.mobile ? 17 : 20}px;letter-spacing:.5px">4380-1901-582614</b>${Btn('계좌번호 복사', { size: 'sm', icon: 'documents-o' })}</span>
<span style="color:var(--mute)">예금주</span><b>이너에라(이보림)</b>
<span style="color:var(--mute)">입금할 금액</span><b style="font-size:${o.mobile ? 17 : 20}px">83,600원</b>
<span style="color:var(--mute)">입금 기한</span><b>2026-11-14(토) 23:59 까지</b>
</div></div>`;
const vbNotice = Notice([
    `${Icon('warning')}<span><b>기한까지 입금하지 않으면 주문이 자동으로 취소</b>되고, 사용한 쿠폰·적립금은 되돌려 드립니다.</span>`,
    `${Icon('info-o')}<span>금액이 1원이라도 다르면 입금되지 않습니다. 입금자 이름은 달라도 됩니다.</span>`,
    `${Icon('kakaotalk')}<span>계좌 정보를 알림톡(010-****-1234)으로 보냈습니다. 입금 기한 하루 전에 한 번 더 알려 드리고, 입금이 확인되면 결제완료 알림을 보냅니다.</span>`,
    `${Icon('receipt')}<span>현금영수증(소득공제용 010-****-1234)은 입금 확인 뒤 자동 발급됩니다.</span>`,
]);

const state2 = StateBlock({ idx: 2, title: '가상계좌 입금 안내(계좌·기한)', note: '가상계좌(무통장)를 고르고 결제하기를 눌러 계좌가 발급된 모습. 주문 상태는 입금대기이며, 아직 결제가 끝난 것이 아닙니다.' },
    Anno({ title: '왜 이렇게 하나' }, '제목을 "주문 완료"가 아니라 "입금을 기다리고 있습니다"로 써서 아직 끝나지 않았음을 분명히 합니다. 은행·계좌번호·예금주·금액·기한 다섯 가지를 한 상자에 크게 두고 계좌번호는 한 번에 복사하게 합니다. 이 화면을 닫아도 같은 계좌 정보를 마이페이지 주문 상세(U-15)와 알림톡에서 다시 볼 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 관리자가 바꾸는 범위' }, '입금 기한(예시 3일)과 기한 뒤 자동 취소는 설정 > 결제·주문 정책 값이며, 화면의 기한·남은 시간은 그 값으로 계산합니다. 입금이 확인되면 운영자가 손대지 않아도 결제완료로 넘어갑니다(관리자 A-11 입금 대기 목록에서 빠짐). 재고는 입금대기 동안 잡아 두었다가 자동 취소되면 풀립니다.'),
    Canvas({ label: 'U-09 · 회원 · 가상계좌 발급 직후' }, Page({},
        Hero('time-o', '입금을 기다리고 있습니다', '아래 계좌로 입금하시면 주문이 확정됩니다. 2026-11-11(수) 14:07 주문'),
        NoLine({ badge: OrderBadge('입금대기') }),
        Vbank(),
        vbNotice,
        ItemBox(),
        two(ShipBox(), PaidBox('가상계좌(무통장) · 국민은행', { totalLabel: '입금할 금액', noEarn: false })),
        Actions(Btn('쇼핑 계속하기', { size: 'lg' }), Btn('주문 상세 보기', { kind: 'primary', size: 'lg' })),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-09 · 모바일 · 가상계좌 입금 안내' }, MobilePage({ title: '입금 안내', tab: false, right: '', bottom: [Btn('쇼핑 계속하기'), Btn('주문 상세 보기', 'primary')] },
            mHero('time-o', '입금을 기다리고 있습니다', '아래 계좌로 입금하시면 주문이 확정됩니다.'),
            mNo,
            `<div style="height:14px"></div>`,
            Vbank({ mobile: true }),
            Text(`${Icon('warning')} <b>기한까지 입금하지 않으면 주문이 자동으로 취소됩니다.</b>`, { sm: true }),
            Text(`${Icon('info-o')} 금액이 1원이라도 다르면 입금되지 않습니다.`, { sm: true }),
            Text(`${Icon('kakaotalk')} 계좌 정보를 알림톡으로 보냈습니다.`, { sm: true }),
            mBox('주문 상품', ProductRow({ option: SHOP.options[1].name, qty: 1, price: '93,000원(예시)' })),
        )),
        Canvas({ size: 'auto', label: "'계좌번호 복사' → 토스트", right: '토스트만', pad: 20 }, Toast('계좌번호를 복사했습니다. 국민은행 4380-1901-582614')),
        Canvas({ size: 'auto', label: '기한이 지난 뒤 이 주소로 다시 들어온 경우', right: '달라지는 부분만', pad: 24 }, `<div style="width:520px">${Hero('error-o', '입금 기한이 지나 주문이 취소되었습니다', '2026-11-14(토) 23:59 까지 입금이 확인되지 않았습니다.')}${NoLine({ badge: OrderBadge('취소완료') })}${Notice([`${Icon('info-o')}<span>사용한 쿠폰(신규 가입 3,000원)과 적립금 6,400원은 되돌려 드렸습니다. 이 계좌로는 더 이상 입금되지 않습니다.</span>`])}${Actions(Btn('주문 상세 보기', { size: 'lg' }), Btn('같은 상품 다시 주문하기', { kind: 'primary', size: 'lg' }))}</div>`),
    ),
);

const FailBody = (o) => [
    Hero(o.icon || 'error-o', o.title, o.desc),
    `<div style="border:2px solid var(--dark);border-radius:8px;padding:16px 20px;margin-bottom:20px"><b>${Icon('info-o')} ${o.reasonTitle}</b><p style="margin:6px 0 0;font-size:13.5px;color:var(--ink2)">${o.reason}</p></div>`,
    Notice([
        `${Icon('check')}<span>결제 금액은 빠져나가지 않았습니다. 주문도 접수되지 않았습니다.</span>`,
        `${Icon('check')}<span>주문서에 입력한 배송지·쿠폰·적립금은 그대로 남아 있습니다. 상품은 장바구니에 있습니다.</span>`,
    ]),
].join('');

const state3 = StateBlock({ idx: 3, title: '결제 실패·취소(다시 시도)', note: '결제창에서 결제가 승인되지 않았거나, 고객이 결제창을 닫아 돌아온 모습. 주문은 만들어지지 않습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '실패 화면에서 고객이 가장 불안해하는 것은 "돈이 나갔나"입니다. 그래서 사유 한 문장 바로 아래에 금액이 빠져나가지 않았다는 것과 입력 내용이 남아 있다는 것을 먼저 적습니다. 버튼은 두 개 — "다시 결제"(같은 수단으로 결제창 다시 열기)와 "주문서로"(수단을 바꾸러 돌아가기)입니다.'),
    Anno({ title: '사유 문장 · 유형별 분기' }, '사유는 결제 대행사가 돌려준 실패 내용을 고객 말로 바꿔 보여 줍니다(한도 초과 / 잔액 부족 / 카드 정보 오류 / 본인 인증 실패 / 고객이 창을 닫음 / 결제 시간 초과). 분류할 수 없는 실패는 "결제가 승인되지 않았습니다. 카드사에 확인하거나 다른 결제수단으로 시도해 주세요."로 표시합니다. 금액이 나갔는데 주문이 실패한 드문 경우(서버 오류)는 자동 환불하고 별도 문구를 씁니다(마지막 캔버스).'),
    Canvas({ label: 'U-09 · 카드 한도 초과로 승인 거절' }, Page({ step: 1, cart: 1 },
        FailBody({ title: '결제가 완료되지 않았습니다', desc: '2026-11-11(수) 14:07 · 신용카드 · 83,600원', reasonTitle: '카드 한도가 부족합니다', reason: '카드사에서 한도 초과로 승인을 거절했습니다. 다른 카드나 다른 결제수단으로 다시 시도해 주세요.' }),
        Actions(Btn('주문서로 돌아가기', { size: 'lg' }), Btn('같은 수단으로 다시 결제', { kind: 'primary', size: 'lg' })),
        `<p style="text-align:center;font-size:12.5px;color:var(--mute);margin-top:16px">계속 실패하면 고객센터 070-****-1234 (평일 10:00 ~ 17:00) 로 문의해 주세요.</p>`,
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '고객이 결제창을 닫음 (취소)', right: '달라지는 부분만', pad: 24 }, `<div style="width:520px">${FailBody({ icon: 'close', title: '결제를 취소했습니다', desc: '결제창을 닫아 결제가 진행되지 않았습니다.', reasonTitle: '결제창이 닫혔습니다', reason: '결제를 계속하려면 다시 결제를 눌러 주세요. 결제수단을 바꾸려면 주문서로 돌아가세요.' })}${Actions(Btn('주문서로 돌아가기', { size: 'lg' }), Btn('다시 결제', { kind: 'primary', size: 'lg' }))}</div>`),
        Canvas({ size: 'auto', label: '사유 상자 문장 모음 (결제 대행사 실패 내용 → 고객 말)', right: '사유 상자만', pad: 24 }, `<div style="width:520px;font-size:13px">${[
            ['잔액이 부족합니다', '계좌 잔액이 결제 금액보다 적습니다. 잔액을 확인하거나 다른 결제수단으로 시도해 주세요.'],
            ['카드 정보가 맞지 않습니다', '카드번호·유효기간·비밀번호 중 맞지 않는 값이 있습니다. 다시 입력해 주세요.'],
            ['본인 인증에 실패했습니다', '간편결제 앱에서 인증이 완료되지 않았습니다. 앱을 최신 버전으로 올린 뒤 다시 시도해 주세요.'],
            ['결제 시간이 지났습니다', '결제창을 연 뒤 30분 안에 결제하지 않아 종료되었습니다. 다시 결제를 눌러 주세요.'],
            ['결제가 승인되지 않았습니다', '카드사에 확인하거나 다른 결제수단으로 시도해 주세요.'],
        ].map(([t, d]) => `<div style="border:1px solid var(--line);border-radius:6px;padding:10px 14px;margin-bottom:8px"><b>${Icon('info-o')} ${t}</b><div style="color:var(--ink2);margin-top:2px">${d}</div></div>`).join('')}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-09 · 모바일 · 결제 실패' }, MobilePage({ title: '결제 실패', tab: false, right: '', bottom: [Btn('주문서로'), Btn('다시 결제', 'primary')] },
            mHero('error-o', '결제가 완료되지 않았습니다', '신용카드 · 83,600원'),
            `<div style="border:2px solid var(--dark);border-radius:8px;padding:14px;margin-bottom:14px"><b>${Icon('info-o')} 카드 한도가 부족합니다</b><p style="margin:6px 0 0;font-size:13px;color:var(--ink2)">카드사에서 한도 초과로 승인을 거절했습니다. 다른 카드나 다른 결제수단으로 다시 시도해 주세요.</p></div>`,
            Text(`${Icon('check')} 결제 금액은 빠져나가지 않았습니다.`, { sm: true }),
            Text(`${Icon('check')} 입력한 배송지·쿠폰·적립금은 그대로 남아 있습니다.`, { sm: true }),
            Divider(),
            Text('계속 실패하면 고객센터 070-****-1234 (평일 10:00 ~ 17:00)', { sm: true, mute: true }),
        )),
        Canvas({ size: 'auto', label: '결제는 됐는데 주문 접수에 실패 → 자동 환불 안내', right: '달라지는 부분만', pad: 24 }, `<div style="width:520px">${Hero('error-o', '주문이 접수되지 않아 결제를 취소했습니다', '2026-11-11(수) 14:07 · 신용카드 · 83,600원')}<div style="border:2px solid var(--dark);border-radius:8px;padding:16px 20px;margin-bottom:20px"><b>${Icon('info-o')} 결제한 83,600원은 바로 취소했습니다</b><p style="margin:6px 0 0;font-size:13.5px;color:var(--ink2)">결제 직후 주문을 저장하는 중 문제가 생겼습니다. 카드 승인은 자동으로 취소했으며, 카드사에 따라 취소 문자가 오기까지 몇 분 걸릴 수 있습니다. 불편을 드려 죄송합니다.</p></div>${Actions(Btn('고객센터 문의', { size: 'lg' }), Btn('주문서에서 다시 주문', { kind: 'primary', size: 'lg' }))}</div>`),
    ),
);

export default function U09() {
    return [state1, state2, state3].join('');
}
