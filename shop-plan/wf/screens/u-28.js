import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, UserHeader, MobileTabbar, Drawer, Btn, Badge, Overlay, Toast, BottomSheet,
    ProductCard, ProductGrid, ProductRow, Img, Box, Note, Text, Icon, Divider, SHOP,
} from '../lib/blocks.js';

const W = (w, ...body) => `<div style="width:${w}px">${body.join('')}</div>`;
const Center = (o) => `<div style="text-align:center;padding:${o.pad || '56px 20px 72px'};max-width:560px;margin:0 auto">
${o.img ? `<div style="width:${o.imgW || 160}px;margin:0 auto 20px">${Img({ ratio: '1/1', label: o.img })}</div>` : `<div style="font-size:56px;line-height:1;margin-bottom:16px">${Icon(o.icon)}</div>`}
${o.code ? `<div style="font-size:13px;color:var(--mute);letter-spacing:1px;margin-bottom:6px">${o.code}</div>` : ''}
<h2 style="font-size:${o.h || 24}px;margin:0 0 10px">${o.title}</h2>
<p style="margin:0 0 20px;color:var(--ink2);font-size:14px">${o.desc}</p>
${o.extra || ''}
<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${(o.btns || []).join('')}</div>
${o.foot ? `<p style="margin:20px 0 0;font-size:12.5px;color:var(--mute)">${o.foot}</p>` : ''}
</div>`;
const CS = '고객센터 070-****-1234 · 평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)';

const state1 = StateBlock({ idx: 1, title: '404', note: '없는 주소, 삭제되거나 비공개로 바뀐 상품·콘텐츠 페이지·공지 주소로 들어왔을 때. 머리·바닥글은 그대로 두어 다른 곳으로 갈 수 있게 합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '검색이나 예전 광고 링크로 들어온 고객이 그대로 나가지 않게, 홈·이전 화면 버튼과 함께 지금 살 수 있는 상품을 바로 보여 줍니다. 판매가 끝난 상품 주소는 "없는 페이지"가 아니라 "판매가 종료된 상품"이라고 구분해 알려 줍니다. 로딩 화면은 두지 않습니다.'),
    Anno({ title: '관리자가 바꾸는 범위 · 이미지 규격' }, '문구는 모든 몰 공통으로 고정입니다. 브랜드 느낌은 가운데 대체 이미지로 냅니다 — 디자인 > 사이트 기본에 등록한 대체 이미지(1000 × 1000 px, 1:1, PNG·JPG, 1MB 이하)가 나오고, 등록하지 않으면 로고를 가운데 둔 옅은 대표색 배경을 자동으로 만들어 씁니다. 아래 추천 상품은 진열 관리의 메인 진열 첫 영역에서 최대 4개를 가져오며, 상품이 1개뿐인 몰은 1개만 크게 나옵니다.'),
    Canvas({ label: 'U-28 · 404 · 없는 주소로 들어옴' }, UserPage({},
        Center({ img: '대체 이미지 · 로고가 들어간 브랜드 이미지 · 1000 × 1000', code: '404', title: '페이지를 찾을 수 없습니다', desc: '주소가 바뀌었거나 삭제된 페이지입니다.<br>주소를 다시 확인하시거나 아래 버튼으로 이동해 주세요.', btns: [Btn('이전 화면', { size: 'lg' }), Btn('홈으로', { kind: 'primary', size: 'lg' })], pad: '24px 20px 40px' }),
        Divider(),
        `<div style="display:flex;justify-content:space-between;align-items:center;margin:20px 0 14px"><b style="font-size:16px">지금 만나 볼 수 있는 상품</b>${Btn('전체 상품 보기', 'ghost')}</div>`,
        `<div style="max-width:300px">${ProductCard({ price: '49,000원(예시)', badge: ['무료배송'], reviews: 128 })}</div>`,
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 모바일 404' }, MobilePage({ tab: '홈' },
            Center({ img: '대체 이미지 · 1000 × 1000', imgW: 120, code: '404', h: 20, title: '페이지를 찾을 수 없습니다', desc: '주소가 바뀌었거나 삭제된 페이지입니다.', btns: [Btn('이전 화면'), Btn('홈으로', 'primary')], pad: '28px 8px 24px' }),
            Divider(),
            Text('지금 만나 볼 수 있는 상품', { b: true }),
            ProductRow({ option: '49,000원(예시) 부터', size: 64, right: Btn('보기', { size: 'sm' }) }),
        )),
        Canvas({ size: 'auto', label: '판매가 종료된 상품 주소로 들어옴 (문구가 다름)', right: '본문만', pad: 20 }, W(520, Center({ icon: 'box', title: '판매가 종료된 상품입니다', desc: '찾으시는 상품은 더 이상 판매하지 않습니다.<br>다른 상품을 둘러보시겠어요?', btns: [Btn('홈으로', { size: 'lg' }), Btn('전체 상품 보기', { kind: 'primary', size: 'lg' })], pad: '32px 20px' }))),
        Canvas({ size: 'auto', label: '대체 이미지를 등록하지 않은 몰 (자동 생성 이미지)', right: '이미지 자리만', pad: 20 }, W(240, Img({ ratio: '1/1', label: '자동 생성 · 옅은 대표색 배경 가운데 Inner:Era 로고', icon: 'palette' }), Text('상품 이미지가 없거나 깨졌을 때도 같은 이미지를 씁니다.', { mute: true, sm: true }))),
    ),
);

const state2 = StateBlock({ idx: 2, title: '오류', note: '서버나 통신에 문제가 생겨 화면을 보여 줄 수 없을 때. 화면 전체가 못 뜬 경우와 일부 동작만 실패한 경우를 나눕니다.' },
    Anno({ title: '왜 이렇게 하나' }, '고객 잘못이 아니라는 것, 잠시 뒤 다시 하면 된다는 것, 그래도 안 되면 어디로 연락하는지 세 가지를 적습니다. 오류 번호·영어 메시지는 보여 주지 않고, 문의할 때 불러 줄 수 있는 접수 번호만 작게 둡니다(운영자가 그 번호로 기록을 찾음). 고객센터 번호·운영시간은 설정 > 쇼핑몰 정보 값입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 결제 중 오류' }, '결제 도중 오류가 나면 고객은 돈이 나갔는지부터 걱정합니다. 이때는 "다시 시도"를 앞세우지 않고(중복 결제 위험) 주문 목록에서 결제 여부를 먼저 확인하게 안내합니다. 비회원은 비회원 주문 조회로 보냅니다. 인터넷이 끊긴 경우와 버튼 하나만 실패한 경우는 화면을 갈아 치우지 않고 토스트로 알립니다.'),
    Canvas({ label: 'U-28 · 오류 · 화면 전체를 불러오지 못함' }, UserPage({},
        Center({ icon: 'error-o', title: '일시적인 문제가 생겼습니다', desc: '잠시 후 다시 시도해 주세요.<br>같은 문제가 계속되면 고객센터로 알려 주시면 바로 확인하겠습니다.', btns: [Btn('홈으로', { size: 'lg' }), Btn('다시 시도', { kind: 'primary', size: 'lg', icon: 'refresh' })], foot: `${CS}<br>문의할 때 알려 주세요 · 접수 번호 E-1111-4827` }),
    )),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 모바일 · 결제 중 오류' }, MobilePage({ title: '주문서·결제', tab: false },
            Center({ icon: 'error-o', h: 20, title: '결제 결과를 확인하지 못했습니다', desc: '결제 도중 연결이 끊겼습니다.<br><b>결제가 되었는지는 주문 목록에서 확인해 주세요.</b> 주문이 보이지 않으면 결제되지 않은 것이니 다시 주문하시면 됩니다.', btns: [Btn('주문서로'), Btn('주문 목록 확인', 'primary')], foot: `${CS}<br>접수 번호 E-1111-4831`, pad: '40px 8px' }),
        )),
        Canvas({ size: 'auto', label: 'PC · 결제 중 오류 (비회원은 버튼이 비회원 주문 조회)', right: '본문만', pad: 20 }, W(520, Center({ icon: 'error-o', title: '결제 결과를 확인하지 못했습니다', desc: '결제 도중 연결이 끊겼습니다.<br><b>결제가 되었는지는 비회원 주문 조회에서 확인해 주세요.</b><br>결제가 되었다면 주문번호를 알림톡으로 보내 드렸습니다.', btns: [Btn('주문서로', { size: 'lg' }), Btn('비회원 주문 조회', { kind: 'primary', size: 'lg' })], pad: '32px 20px' }))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '버튼 하나만 실패 (화면은 그대로, 토스트)', right: '토스트만', pad: 20 }, Toast('찜하지 못했습니다. 잠시 후 다시 눌러 주세요.', { kind: 'error', action: '다시 시도' })),
        Canvas({ size: 'auto', label: '인터넷 연결이 끊김 (다시 연결될 때까지 남음)', right: '토스트만', pad: 20 }, Toast('인터넷 연결이 끊겼습니다. 연결을 확인해 주세요.', { kind: 'error' })),
        Canvas({ size: 'auto', label: '오래 열어 두어 로그인이 풀림', right: '팝업만', pad: 20 }, `<div class="wf-modal confirm" style="width:360px"><div class="mb"><b class="ct">다시 로그인해 주세요</b><p>오랫동안 사용하지 않아 로그아웃되었습니다. 로그인하면 보던 화면으로 돌아옵니다.</p></div><div class="mf">${Btn('홈으로')}${Btn('로그인', 'primary')}</div></div>`),
    ),
);

const Maint = (o = {}) => `<div style="min-height:${o.h || 620}px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:${o.mobile ? '32px 20px' : '60px 40px'};text-align:center">
<div class="u-logo" style="margin-bottom:28px">Inner:Era 로고</div>
<div style="font-size:52px;line-height:1;margin-bottom:14px">${Icon('cog')}</div>
<h2 style="font-size:${o.mobile ? 20 : 26}px;margin:0 0 10px">${o.title || '더 좋은 서비스를 위해 점검하고 있습니다'}</h2>
<p style="margin:0 0 22px;color:var(--ink2);font-size:14px;max-width:460px">${o.desc || '점검하는 동안 쇼핑몰을 이용하실 수 없습니다. 불편을 드려 죄송합니다.<br>이미 결제하신 주문은 정상적으로 배송됩니다.'}</p>
<div style="border:1px solid var(--line);border-radius:8px;padding:16px 24px;margin-bottom:22px;text-align:left;font-size:14px;min-width:${o.mobile ? 0 : 380}px"><div style="display:grid;grid-template-columns:84px 1fr;gap:8px 12px"><span style="color:var(--mute)">점검 시간</span><b>${o.time || '2026-11-18(수) 02:00 ~ 05:00'}</b><span style="color:var(--mute)">점검 내용</span><span>${o.what || '결제 시스템 개선 작업'}</span></div></div>
<p style="margin:0;font-size:12.5px;color:var(--mute)">급한 문의는 ${CS}<br>help@innerera.example</p>
</div>`;

const state3 = StateBlock({ idx: 3, title: '점검 중', note: '관리자가 디자인 > 사이트 기본에서 점검을 켜면 쇼핑몰의 모든 화면이 이 안내로 바뀝니다. 머리·바닥글·탭바 없이 안내만 나옵니다.' },
    Anno({ title: '왜 이렇게 하나 · 관리자가 바꾸는 범위' }, '점검 중에는 주문이 들어오면 안 되므로 메뉴를 모두 감춥니다. 고객이 알아야 하는 것은 언제 끝나는지와 이미 한 주문은 어떻게 되는지입니다. 점검 시작·종료 시각과 안내 문구(점검 내용 한 줄)는 관리자가 입력하고, 기간을 정해 두면 그 시각에 자동으로 켜지고 꺼집니다. 제목·기본 문구·고객센터 정보는 고정(고객센터는 설정 > 쇼핑몰 정보 값)입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '운영자는 점검 중에도 관리자(/admin)에 들어갈 수 있고, 관리자에 로그인한 브라우저로는 쇼핑몰도 볼 수 있습니다(화면 위에 "점검 중 · 고객에게는 점검 안내가 보입니다" 띠). 결제 대행사의 입금 통보와 스마트스토어 주문 수집은 점검 중에도 계속 받습니다. 예정된 점검은 미리 상단 띠 문구로 알립니다(아래 캔버스).'),
    Canvas({ label: 'U-28 · 점검 중 (모든 주소가 이 화면으로)' }, Maint()),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 모바일 점검 중' }, Maint({ mobile: true, h: 640 })),
        Canvas({ size: 'auto', label: '종료 시각을 정하지 않은 긴급 점검', right: '본문만', pad: 0 }, W(560, Maint({ h: 520, title: '긴급 점검을 하고 있습니다', desc: '결제가 원활하지 않아 급히 점검하고 있습니다. 최대한 빨리 마치겠습니다.<br>이미 결제하신 주문은 정상적으로 배송됩니다.', time: '2026-11-11(수) 14:20 ~ 마치는 대로', what: '결제 연결 오류 복구' }))),
    ),
    Canvas({ label: 'U-28 · 점검 전날 · 상단 띠 문구로 미리 알림 / 운영자가 점검 중에 쇼핑몰을 볼 때의 띠' }, [
        UserHeader({ band: '점검 안내 · 11월 18일(수) 새벽 2시 ~ 5시에는 쇼핑몰을 이용할 수 없습니다' }),
        `<div style="height:24px;background:var(--box)"></div>`,
        `<div style="background:var(--warnbg);color:var(--warn);text-align:center;font-size:12.5px;padding:8px;font-weight:700">${Icon('warning')} 점검 중입니다 · 고객에게는 점검 안내 화면이 보입니다 · 운영자 이보림 님만 쇼핑몰을 볼 수 있습니다 <u>점검 끄기</u></div>`,
        UserHeader({ band: false, loggedIn: false }),
    ].join('')),
);

const mBg = MobilePage({ tab: '홈', cart: 1 },
    Img({ h: 300, label: '첫 배너 슬라이드 · 모바일 780 × 900' }),
    `<div style="height:14px"></div>`,
    ProductGrid([ProductCard({ price: '49,000원(예시)' }), ProductCard({ price: '93,000원(예시)', name: '롱지비티 석류맛 젤리스틱 2박스' })], 2),
);
const DrawerFoot = () => `<div style="padding:16px 18px;font-size:12.5px;color:var(--ink2)"><b style="font-size:13px">고객센터</b><div style="font-size:17px;font-weight:800;color:var(--ink);margin:2px 0">070-****-1234</div>평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)</div>`;
const SubMenu = () => `<div style="border-top:8px solid var(--box)">${[['상품', true, ['전체 상품', '스킨케어', '이너뷰티', '선물 세트']], ['브랜드 이야기', false], ['고객센터', false]].map(([m, open, subs]) => `<div style="border-bottom:1px solid var(--line2)"><div style="display:flex;justify-content:space-between;align-items:center;padding:15px 18px;font-size:15px;font-weight:${open ? 800 : 400}">${m}${Icon(subs ? (open ? 'angle-up-min' : 'angle-down-min') : 'angle-right-min')}</div>${open && subs ? `<div style="background:var(--box);padding:6px 0">${subs.map((s) => `<div style="padding:10px 18px 10px 30px;font-size:14px;color:var(--ink2)">${s}</div>`).join('')}</div>` : ''}</div>`).join('')}</div>`;

const state4 = StateBlock({ idx: 4, title: '서랍 메뉴', note: '모바일 머리의 왼쪽 메뉴 아이콘을 누르면 왼쪽에서 밀려 나오는 전체 메뉴. 바깥 어두운 곳이나 닫기를 누르면 닫힙니다. PC 에는 없습니다(머리 메뉴가 대신함).' },
    Anno({ title: '왜 이렇게 하나 · 초기값' }, '위에서부터 로그인 상태(비로그인: 로그인·회원가입 버튼과 가입 혜택 한 줄 / 로그인: 이름·등급·적립금·쿠폰 수) → 메뉴 → 고객센터 번호·운영시간 순서입니다. 초기값은 닫힘이며, 하위 메뉴가 있는 항목은 접힌 채 시작해 누르면 그 자리에서 펼쳐집니다. 메뉴를 고르면 서랍이 닫히고 그 화면으로 갑니다.'),
    Anno({ title: '관리자가 바꾸는 범위 · 기능 켜고 끄기 · 빈 상태' }, '메뉴 항목과 순서는 디자인 > 메뉴의 서랍 메뉴에서 편집합니다. 메뉴를 하나도 등록하지 않으면 기본 메뉴(홈·전체 상품)가 나옵니다. "비회원 주문 조회"는 비회원 주문을 켠 몰에서 비로그인일 때만, 적립금·쿠폰 줄은 그 기능을 켠 몰에서만, 회원 등급은 등급 기능을 켠 몰에서만 나옵니다.'),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 서랍 열림 · 비로그인' }, Overlay({ bg: mBg, align: 'left', h: 760 }, Drawer({ loggedIn: false }, DrawerFoot()))),
        Canvas({ size: 'mobile', label: 'U-28 · 서랍 열림 · 로그인 (마이페이지 바로 가기·로그아웃)' }, Overlay({ bg: mBg, align: 'left', h: 760 }, Drawer({ loggedIn: true, menu: ['브랜드 이야기', '원료 이야기', '상품', '리뷰', '고객센터', '공지사항', '자주 묻는 질문'] },
            `<div style="display:flex;border-bottom:1px solid var(--line2)">${[['주문 목록', 'receipt'], ['쿠폰·적립금', 'coupon'], ['회원정보', 'user-o']].map(([t, i]) => `<span style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 0;font-size:12.5px"><span style="font-size:20px">${Icon(i)}</span>${t}</span>`).join('')}</div>`,
            DrawerFoot(),
            `<div style="padding:0 18px 16px;font-size:13px;color:var(--mute)"><u>로그아웃</u></div>`))),
        Canvas({ size: 'mobile', label: '다른 업종 예시 · 하위 메뉴가 있는 몰 (상품을 펼친 모습)' }, Overlay({ bg: mBg, align: 'left', h: 760 }, `<div class="m-drawer"><div class="dh"><b>로그인해 주세요</b><span>가입하면 3,000원 쿠폰을 드립니다</span>${Icon('close')}</div><div class="da">${Btn('로그인', { kind: 'primary', block: true })}${Btn('회원가입', { block: true })}</div>${SubMenu()}${DrawerFoot()}</div>`)),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: '쿠폰·적립금·비회원 주문을 끈 몰 · 메뉴 미등록 (기본 메뉴)' }, Overlay({ bg: mBg, align: 'left', h: 600 }, `<div class="m-drawer" style="min-height:600px"><div class="dh"><b>로그인해 주세요</b><span>로그인하면 주문 내역을 볼 수 있습니다</span>${Icon('close')}</div><div class="da">${Btn('로그인', { kind: 'primary', block: true })}${Btn('회원가입', { block: true })}</div><ul>${['홈', '전체 상품'].map((m) => `<li>${m}${Icon('angle-right-min')}</li>`).join('')}</ul>${DrawerFoot()}</div>`)),
        Canvas({ size: 'mobile', label: '닫힌 모습 · 머리 왼쪽 메뉴 아이콘이 여는 버튼' }, mBg),
    ),
);

const TabOnly = (active, note, cart) => `<div style="width:390px">${MobileTabbar(active).replace(`${Icon('cart-o')}장바구니`, `<i style="position:relative;display:inline-flex;font-style:normal">${Icon('cart-o')}${cart ? `<em style="position:absolute;top:-4px;right:-12px;font-style:normal;font-size:10px;line-height:15px;background:var(--dark);color:#fff;border-radius:8px;padding:0 5px;font-weight:700">${cart}</em>` : ''}</i>장바구니`)}</div><p style="font-size:12.5px;color:var(--ink2);margin:8px 12px 0;width:366px">${note}</p>`;

const state5 = StateBlock({ idx: 5, title: '하단 탭바', note: '모바일 화면 맨 아래에 항상 붙어 있는 다섯 칸 바로 가기. PC 에는 없습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '한 손으로 쥔 엄지가 닿는 자리에 가장 자주 가는 다섯 곳(홈·상품·검색·장바구니·마이)을 둡니다. 지금 있는 화면의 칸은 굵은 글자로 표시하고(색이 아니라 굵기·채움으로 구분), 장바구니 칸에는 담긴 수량을 숫자로 보여 줍니다. 비로그인으로 "마이"를 누르면 로그인 화면으로 가고, 로그인하면 마이페이지로 돌아옵니다.'),
    Anno({ title: '유형별 분기 · 관리자가 바꾸는 범위' }, '다섯 칸 구성은 모든 몰 공통으로 고정입니다. 상품이 1개뿐인 몰(이너에라)은 두 번째 칸이 "상품"이고 누르면 그 상품 상세로 바로 갑니다. 카테고리가 있는 몰은 같은 칸이 "카테고리"로 바뀌어 상품 목록으로 갑니다. 아래에 고정 버튼이 있는 화면(상품 상세의 구매 바, 장바구니·주문서의 결제 바)과 로그인·가입·점검 화면에서는 탭바를 숨겨 버튼과 겹치지 않게 합니다.'),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 탭바가 있는 화면 (홈 · 장바구니 1개)' }, mBg),
        Canvas({ size: 'mobile', label: '탭바를 숨기는 화면 · 상품 상세 (구매 바가 그 자리에)' }, MobilePage({ title: '상품 상세', tab: false, bottom: [`<span class="wf-btn" style="flex:none;width:48px;height:48px;padding:0">${Icon('heart-o')}</span>`, Btn('장바구니'), Btn('바로 구매', 'primary')] },
            Img({ ratio: '1/1', label: '상품 대표 이미지 · 1000 × 1000' }),
            `<div style="height:12px"></div>`,
            Text(SHOP.product, { b: true }), Text('49,000원(예시)', { b: true }),
            Note('구매 바가 화면 아래에 고정되는 화면에서는 탭바를 숨깁니다. 다른 곳으로 가려면 머리의 뒤로·홈 아이콘을 씁니다.'))),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '칸마다 선택된 모습', right: '탭바만', pad: 16 }, [
            TabOnly('홈', '홈 · 장바구니가 비어 있으면 숫자 없음'),
            `<div style="height:18px"></div>`, TabOnly('상품', '상품 · 상품 1개 몰은 누르면 상품 상세로', 1),
            `<div style="height:18px"></div>`, TabOnly('검색', '검색 · 누르면 검색 화면(U-04)에서 입력칸에 커서', 1),
        ].join('')),
        Canvas({ size: 'auto', label: '칸마다 선택된 모습 (이어서) · 수량 표시', right: '탭바만', pad: 16 }, [
            TabOnly('장바구니', '장바구니 · 담긴 상품 종류 수. 100개 이상은 99+', 3),
            `<div style="height:18px"></div>`, TabOnly('마이', '마이 · 비로그인으로 누르면 로그인 화면으로', '99+'),
            `<div style="height:18px"></div>`, `<div style="width:390px">${MobileTabbar('').replace('>상품<', '>카테고리<')}</div><p style="font-size:12.5px;color:var(--ink2);margin:8px 12px 0;width:366px">다른 업종 예시 · 카테고리가 있는 몰은 두 번째 칸이 "카테고리"</p>`,
        ].join('')),
    ),
);

const pcBg = UserPage({ active: '상품', cart: 1, footer: false, crumb: ['홈', '상품', SHOP.productShort] },
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:48px">${Img({ ratio: '1/1', label: '상품 대표 이미지 · 1000 × 1000' })}<div><h2 style="margin:0 0 8px;font-size:22px">${SHOP.product}</h2><b style="font-size:22px">49,000원(예시)</b>${Divider()}${Text('구성 · 2박스(28일분) · 1개', { sm: true })}<div style="display:flex;gap:8px;margin-top:20px"><span class="wf-btn lg" style="width:48px;padding:0">${Icon('heart-o')}</span>${Btn('장바구니', { size: 'lg', w: 200 })}${Btn('바로 구매', { kind: 'primary', size: 'lg', w: 200 })}</div></div></div>`);
const mDetail = MobilePage({ title: '상품 상세', tab: false, bottom: [`<span class="wf-btn" style="flex:none;width:48px;height:48px;padding:0">${Icon('heart-o')}</span>`, Btn('장바구니'), Btn('바로 구매', 'primary')] },
    Img({ ratio: '1/1', label: '상품 대표 이미지 · 1000 × 1000' }), `<div style="height:12px"></div>`, Text(SHOP.product, { b: true }), Text('49,000원(예시)', { b: true }));

const state6 = StateBlock({ idx: 6, title: '장바구니 담기 토스트', note: '상품 상세·상품 목록·찜 목록 어디서든 "장바구니"를 눌러 담기에 성공하면 잠깐 떴다 사라지는 안내. 화면은 그대로 머뭅니다.' },
    Anno({ title: '왜 이렇게 하나' }, '담을 때마다 장바구니 화면으로 끌고 가면 여러 상품을 둘러보기 어렵습니다. 그래서 화면은 그대로 두고 담겼다는 사실과 "장바구니 보기" 바로 가기만 3초 동안 보여 줍니다. 동시에 머리의 장바구니 숫자가 바뀝니다. PC 는 머리 아래 가운데, 모바일은 아래쪽 버튼 바로 위에 뜹니다(엄지로 누르기 쉬운 자리). 모바일 옵션 시트에서 담은 경우의 안내는 U-06 에 있습니다.'),
    Anno({ title: '문구 분기' }, '이미 담겨 있던 같은 구성을 또 담으면 수량이 합쳐졌다고 알립니다. 담지 못한 경우(재고 부족·1회 최대 구매 수량 초과·품절)는 사유와 남은 수량을 적은 실패형 토스트가 뜨고 숫자는 바뀌지 않습니다. 실패형은 고객이 닫을 때까지 남습니다.'),
    Canvas({ label: "U-28 · PC · 상품 상세에서 '장바구니' → 토스트 (3초 뒤 사라짐, 머리 숫자 0 → 1)" }, Overlay({ bg: pcBg, dim: false, align: 'top', h: 560 }, `<div style="margin-top:110px">${Toast('장바구니에 담았습니다.', { action: '장바구니 보기' })}</div>`)),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 모바일 · 구매 바 위에 뜸' }, Overlay({ bg: mDetail, dim: false, align: 'toast-bottom', h: 720 }, `<div style="margin-bottom:56px">${Toast('장바구니에 담았습니다.', { action: '장바구니 보기' })}</div>`)),
        Canvas({ size: 'auto', label: '문구 모음', right: '토스트만', pad: 20 }, `<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start">
${Toast('장바구니에 담았습니다.', { action: '장바구니 보기' })}
${Toast('이미 담긴 상품이라 수량을 1개 더했습니다. (2박스 구성 2개)', { action: '장바구니 보기' })}
${Toast('3개 상품을 장바구니에 담았습니다.', { action: '장바구니 보기' })}
${Toast('재고가 2개 남아 2개까지만 담을 수 있습니다.', { kind: 'error' })}
${Toast('이 상품은 한 번에 5개까지 주문할 수 있습니다.', { kind: 'error' })}
${Toast('방금 품절되어 담지 못했습니다.', { kind: 'error', action: '재입고 알림 신청' })}
${Toast('장바구니에는 50종까지 담을 수 있습니다. 담긴 상품을 정리해 주세요.', { kind: 'error', action: '장바구니 보기' })}
</div>`),
    ),
);

const LoginNeed = (o = {}) => `<div class="wf-modal confirm" style="width:${o.w || 360}px"><div class="mb"><div style="font-size:34px;line-height:1;margin-bottom:10px">${Icon('lock-o')}</div><b class="ct">로그인이 필요합니다</b><p>${o.desc || '찜한 상품은 로그인한 뒤 마이페이지에서 모아 볼 수 있습니다.'}</p>${o.extra || ''}</div><div class="mf">${Btn('닫기')}${Btn('로그인', 'primary')}</div></div>`;
const JoinLine = `<p style="font-size:12.5px;margin-top:10px">아직 회원이 아니신가요? <u><b>회원가입</b></u> · 3,000원 쿠폰 지급</p>`;

const state7 = StateBlock({ idx: 7, title: '로그인 필요 안내', note: '로그인하지 않은 채 회원만 할 수 있는 동작(찜·리뷰 쓰기·문의 쓰기·쿠폰 받기·재입고 알림)을 눌렀을 때 뜨는 확인 팝업.' },
    Anno({ title: '왜 이렇게 하나' }, '말없이 로그인 화면으로 넘기면 왜 화면이 바뀌었는지 모릅니다. 그래서 무엇을 하려면 로그인이 필요한지 한 문장으로 먼저 알리고 고르게 합니다. "로그인"을 누르면 로그인(또는 가입)한 뒤 원래 화면으로 돌아와 하려던 동작이 끝난 상태가 됩니다(찜이면 하트가 채워진 채, 리뷰면 작성 폼이 열린 채). "닫기"를 누르면 아무 일도 일어나지 않습니다.'),
    Anno({ title: '문구 분기 · 다른 길과의 구분' }, '제목과 버튼은 고정이고 설명 한 줄만 동작에 따라 바뀝니다. 마이페이지·주문 목록처럼 화면 전체가 회원 전용인 주소는 팝업 없이 로그인 화면으로 바로 갑니다. 장바구니 담기는 로그인 없이 되고, 주문하기는 비회원 주문을 켠 몰이면 로그인 화면의 "비회원으로 주문하기"(U-10 상태 4)로 이어지므로 이 팝업을 쓰지 않습니다. 모바일은 가운데 팝업 대신 아래에서 올라오는 시트입니다.'),
    Canvas({ label: 'U-28 · PC · 비로그인으로 찜(하트)을 누름 → 로그인 필요 안내' }, Overlay({ bg: pcBg, h: 520 }, LoginNeed({ extra: JoinLine }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-28 · 모바일 · 아래에서 올라오는 시트' }, Overlay({ bg: mDetail, align: 'bottom', h: 720 }, BottomSheet({ foot: [Btn('닫기'), Btn('로그인', 'primary')] },
            `<div style="text-align:center;padding:8px 0 4px"><div style="font-size:34px;line-height:1;margin-bottom:10px">${Icon('lock-o')}</div><b style="font-size:16px">로그인이 필요합니다</b><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">찜한 상품은 로그인한 뒤 마이페이지에서 모아 볼 수 있습니다.</p>${JoinLine}</div>`))),
        Canvas({ size: 'auto', label: '동작별 설명 문구', right: '팝업만', pad: 20 }, `<div style="display:grid;grid-template-columns:repeat(2,320px);gap:16px">
${LoginNeed({ w: 320, desc: '리뷰는 상품을 구매한 회원만 쓸 수 있습니다.' })}
${LoginNeed({ w: 320, desc: '문의 답변을 알림으로 받으려면 로그인해 주세요.' })}
${LoginNeed({ w: 320, desc: '쿠폰은 로그인한 뒤 내 쿠폰함으로 받을 수 있습니다.' })}
${LoginNeed({ w: 320, desc: '재입고되면 알림톡으로 알려 드리려면 로그인이 필요합니다.' })}
</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '로그인하고 돌아온 뒤 · 하려던 동작이 끝난 상태 + 토스트', right: '달라지는 부분만', pad: 20 }, `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start"><div style="display:flex;gap:8px"><span class="wf-btn lg" style="width:48px;padding:0;border:2px solid var(--dark)">${Icon('heart')}</span>${Btn('장바구니', { size: 'lg', w: 160 })}${Btn('바로 구매', { kind: 'primary', size: 'lg', w: 160 })}</div>${Toast('김민지 님, 로그인했습니다. 상품을 찜했습니다.', { action: '찜 목록 보기' })}</div>`),
        Canvas({ size: 'auto', label: '리뷰 기능은 켰지만 구매 이력이 없는 회원이 리뷰 쓰기를 누름 (로그인 안내가 아님)', right: '토스트만', pad: 20 }, Toast('이 상품을 구매하고 배송이 끝난 뒤에 리뷰를 쓸 수 있습니다.', { kind: 'error' })),
    ),
);

export default function U28() {
    return [state1, state2, state3, state4, state5, state6, state7].join('');
}
