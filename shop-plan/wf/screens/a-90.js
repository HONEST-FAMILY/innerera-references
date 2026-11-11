import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Input, Select, Check, RadioGroup, CheckGroup,
    FormTable, Overlay, Modal, Toast, Box, Note as NoteBase, Text, Icon, Flex, Grid, UserFooter, SHOP,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const Page = (o, ...body) => AdminLayout({ active: 'a-90', desc: '여기에 넣은 값이 바닥글 · 주문 메일 · 영수증 · 약관의 사업자 표시에 자동으로 들어갑니다.', actions: [Btn('저장', 'primary')], ...o }, body);

const bizBox = (o = {}) => Box({ title: '사업자 정보', sub: '전자상거래법에 따라 쇼핑몰 첫 화면 아래에 반드시 표시해야 하는 항목' },
    FormTable([
        { k: '상호', required: true, v: [Input({ value: o.empty ? '' : '이너에라', placeholder: '사업자등록증의 상호', w: 220 }), Input({ value: o.empty ? '' : 'Inner:Era', placeholder: '영문·브랜드 표기 (선택)', w: 200 })], help: '바닥글에는 이너에라 Inner:Era 처럼 나란히 나옵니다.' },
        { k: '대표자', required: true, v: Input({ value: o.empty ? '' : SHOP.ceo, placeholder: '대표자 이름', w: 220 }), help: '공동대표면 쉼표로 나눠 적습니다.' },
        { k: '사업자등록번호', required: true, v: [Input({ value: o.empty ? '' : o.bizErr ? '384-17-0284' : SHOP.bizNo, placeholder: '000-00-00000', w: 180, error: o.bizErr }), Btn('국세청 조회로 확인', { size: 'sm', icon: 'search' }), o.empty || o.bizErr ? '' : Badge('확인됨 · 계속사업자 · 일반과세자', 'check')], help: '바닥글의 번호 옆에 공정거래위원회 사업자정보 확인 링크가 자동으로 붙습니다.', error: o.bizErr ? '사업자등록번호는 숫자 10자리입니다. 지금 9자리가 들어 있습니다.' : undefined },
        { k: '통신판매업 신고번호', required: true, v: [Input({ value: o.empty || o.noMail ? '' : '제2026-인천제물포-0412호', placeholder: '제0000-지역-0000호', w: 260, error: o.noMail }), Check('신고 면제 대상 (간이과세 · 거래 횟수 기준 미만)')], help: '구청에서 받은 통신판매업 신고증의 번호. 면제 대상이면 바닥글에 통신판매업 신고 면제로 표시됩니다.', error: o.noMail ? '신고번호를 넣거나 신고 면제 대상에 표시해 주세요. 비워 두면 법에서 정한 표시가 빠집니다.' : undefined },
        { k: '사업장 주소', required: true, v: [Input({ value: o.empty ? '' : '22530', placeholder: '우편번호', w: 100 }), Btn('주소 찾기', { size: 'sm', icon: 'search' }), `<div style="width:100%;display:flex;gap:8px">${Input({ value: o.empty ? '' : '인천광역시 제물포구 방축로83번길 23', placeholder: '도로명 주소', w: 380 })}${Input({ value: o.empty ? '' : 'B동 3층 305호', placeholder: '상세 주소', w: 220 })}</div>`], help: '출고지·반품지 주소가 다르면 설정 > 배송에서 따로 넣습니다.' },
        { k: '업태 · 종목', v: [Input({ value: o.empty ? '' : '도매 및 소매업', w: 200 }), Input({ value: o.empty ? '' : '전자상거래 소매업, 건강보조식품 소매업', w: 320 })], help: '세금계산서·현금영수증에 쓰입니다. 바닥글에는 안 나옵니다.' },
        { k: '호스팅 제공자', v: Input({ value: '어니스트패밀리', w: 220 }), help: '법에서 정한 표시 항목입니다. 설치할 때 채워 둔 값입니다.' },
    ]),
);

const csBox = (o = {}) => Box({ title: '고객센터', sub: '바닥글 · 주문 완료 화면 · 알림 문구의 문의처에 쓰입니다' },
    FormTable([
        { k: '전화번호', required: true, v: Input({ value: o.empty ? '' : '070-****-1234', placeholder: '02-000-0000', w: 200 }) },
        { k: '이메일', required: true, v: Input({ value: o.empty ? '' : 'help@innerera.example', placeholder: 'help@회사주소', w: 280 }), help: '고객이 보는 문의 메일 주소입니다. 운영자가 알림을 받는 주소는 설정 > 알림의 내부 수신자에서 정합니다.' },
        { k: '운영 요일', v: CheckGroup(['월', '화', '수', '목', '금', '토', '일'], ['월', '화', '수', '목', '금']) },
        { k: '운영 시간', v: [Select({ value: '10:00', w: 100 }), '~', Select({ value: '17:00', w: 100 }), Check('점심시간 표시', { on: true }), Select({ value: '12:00', w: 100 }), '~', Select({ value: '13:00', w: 100 })] },
        { k: '쉬는 날 안내', v: Input({ value: '주말 · 공휴일 휴무', w: 280 }), help: '바닥글 운영 시간 옆에 붙습니다.' },
        { k: '카카오톡 상담', v: [Check('바닥글에 카카오톡 채널 상담 버튼 보이기', { on: true }), Text('주소는 디자인 > 사이트 기본의 카카오톡 채널 값을 씁니다', { sm: true, mute: true })] },
    ]),
);

const privBox = (o = {}) => Box({ title: '개인정보 보호책임자', sub: '개인정보처리방침과 바닥글에 표시' },
    FormTable([
        { k: '이름', required: true, v: [Input({ value: o.empty ? '' : SHOP.ceo, w: 180 }), Check('대표자와 같음', { on: !o.empty })] },
        { k: '직책', v: Input({ value: o.empty ? '' : '대표', w: 180 }) },
        { k: '연락처', required: true, v: [Input({ value: o.empty ? '' : 'privacy@innerera.example', placeholder: '이메일', w: 260 }), Input({ value: o.empty ? '' : '070-****-1234', placeholder: '전화', w: 180 })], help: '개인정보 열람·삭제 요청을 받는 연락처입니다.' },
    ]),
);

const FooterPv = (o = {}) => `<div style="border:1px solid var(--line);overflow:hidden"><div style="zoom:.78">${o.blank ? `<div class="u-footer"><div class="fl"><div class="u-logo">Inner:Era 로고</div><div class="links"><span>이용약관</span><b>개인정보처리방침</b></div><p>상호 <u>입력 필요</u> · 대표 <u>입력 필요</u> · 사업자등록번호 <u>입력 필요</u> · 통신판매업 신고번호 <u>입력 필요</u><br>주소 <u>입력 필요</u><br>개인정보 보호책임자 <u>입력 필요</u> · 호스팅 제공자 어니스트패밀리</p></div><div class="fr"><b>고객센터</b><strong>입력 필요</strong></div></div>` : UserFooter().replace('통신판매업 신고번호 관리자 설정값', '통신판매업 신고번호 제2026-인천제물포-0412호(예시) <u>사업자정보 확인</u>').replace(SHOP.addr, `(22530) ${SHOP.addr}`).replace('결제 서비스 포트원', '호스팅 제공자 어니스트패밀리').replace('(점심 12:00 ~ 13:00)', '(점심 12:00 ~ 13:00) · 주말 · 공휴일 휴무')}</div></div>`;

const pvBox = (o = {}) => Box({ flat: true, title: '바닥글 미리보기', sub: '입력하는 대로 바뀝니다 · 저장해야 고객에게 반영', right: Btn('모바일로 보기', { size: 'sm', icon: 'mobile' }) }, FooterPv(o));

const SaveBar = BtnRow({ align: 'right' }, Btn('취소'), Btn('저장', 'primary'));
const full = (o = {}) => Page({}, o.top || '', bizBox(o), csBox(o), privBox(o), pvBox(o), SaveBar);

const addrModal = Modal({ title: '주소 찾기', w: 520, foot: [Btn('닫기')] },
    Flex({ gap: 8 }, Input({ value: '방축로83번길 23', icon: 'search', w: 360, focus: true }), Btn('검색', 'primary')),
    Text('도로명 + 건물번호, 건물 이름, 지번으로 찾을 수 있습니다. 검색 결과 <b>2</b>건', { sm: true, mute: true }),
    `<div style="border:1px solid var(--line);border-radius:4px;font-size:13px"><div style="padding:10px 12px;border-bottom:1px solid var(--line2);background:var(--box)"><b>22530</b> · 인천광역시 제물포구 방축로83번길 23<div style="font-size:12px;color:var(--mute)">지번 인천광역시 제물포구 송림동 ***</div></div><div style="padding:10px 12px"><b>22530</b> · 인천광역시 제물포구 방축로83번길 23-1<div style="font-size:12px;color:var(--mute)">지번 인천광역시 제물포구 송림동 ***</div></div></div>`,
    Note('주소를 누르면 우편번호와 도로명 주소가 채워지고 상세 주소 칸으로 넘어갑니다.'),
);

const bizCheck = (ok) => Modal({ title: '국세청 사업자 상태 조회', w: 460, foot: ok ? [Btn('닫기', 'primary')] : [Btn('닫기'), Btn('번호 다시 입력', 'primary')] },
    ok
        ? [Text(`${Icon('check-circle-o')} 정상 등록된 사업자입니다.`, { b: true }), FormTable([{ k: '사업자등록번호', v: SHOP.bizNo }, { k: '상태', v: '계속사업자' }, { k: '과세 유형', v: '부가가치세 일반과세자' }, { k: '조회 일시', v: '2026-11-11 14:02' }])]
        : [Text(`${Icon('error-o')} 국세청에 등록되지 않은 번호입니다.`, { b: true }), Text('입력한 번호 384-17-02854 — 사업자등록증의 번호와 한 자리씩 다시 확인해 주세요. 휴업·폐업 상태여도 여기에 표시됩니다.', { sm: true })],
);

const MobileFooter = `<div style="padding:24px 16px;background:var(--box);font-size:12px;color:var(--ink2);line-height:1.8"><div class="u-logo" style="margin-bottom:10px">Inner:Era 로고</div><div style="display:flex;gap:14px;color:var(--ink);margin-bottom:10px"><span>이용약관</span><b>개인정보처리방침</b></div><div style="border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:10px 0;display:flex;justify-content:space-between;color:var(--ink)"><b>사업자 정보</b>${Icon('angle-up-min')}</div><p style="margin:10px 0;color:var(--mute)">상호 이너에라 Inner:Era · 대표 ${SHOP.ceo}<br>사업자등록번호 ${SHOP.bizNo} <u>사업자정보 확인</u><br>통신판매업 신고번호 제2026-인천제물포-0412호(예시)<br>(22530) ${SHOP.addr}<br>개인정보 보호책임자 ${SHOP.ceo}<br>호스팅 제공자 어니스트패밀리</p><b style="color:var(--ink)">고객센터 070-****-1234(예시)</b><br>평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)<br>주말 · 공휴일 휴무 · help@innerera.example<div style="margin-top:10px">${Btn('전화 걸기', { size: 'sm', icon: 'call' })} ${Btn('카카오톡 상담', { size: 'sm', icon: 'kakaotalk' })}</div></div>`;

const state1 = StateBlock({ idx: 1, title: '사업자 정보·고객센터·개인정보 책임자(바닥글 자동 반영)', note: '설정 > 쇼핑몰 정보. 사업자 정보 · 고객센터 · 개인정보 보호책임자 세 묶음을 채우면 아래 바닥글 미리보기가 따라 바뀝니다.' },
    Anno({ title: '왜 이렇게 하나' }, '사업자 정보는 바닥글·주문 메일·영수증·약관 여러 곳에 똑같이 나와야 하는데, 곳곳에 따로 적으면 주소를 옮기거나 대표가 바뀔 때 한 군데씩 빠집니다. 여기 한 곳에만 넣고 나머지는 자동으로 가져다 쓰게 합니다. 이너에라 값(상호 · 대표 이보림 · 384-17-02845 · 인천 제물포구 방축로83번길 23)이 들어간 모습입니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것 · 초기값' }, '상호·대표자·사업자등록번호·통신판매업 신고번호·주소·전화·이메일은 전자상거래법이 정한 표시 항목이라 필수입니다. 설치 직후에는 호스팅 제공자만 채워져 있고 나머지는 비어 있어, 바닥글에 입력 필요가 표시되고 대시보드에 채우라는 안내가 뜹니다. 통신판매업 신고번호와 고객센터 전화·메일은 고객사가 알려 줘야 하는 값입니다(와이어프레임의 번호는 예시).'),
    Canvas({ label: 'A-90 · 기본 (이너에라 값이 들어간 모습)' }, full()),
    Canvas({ label: 'A-90 · 설치 직후 빈 상태 (바닥글에 입력 필요 표시)' }, full({ empty: true, blank: true, top: Note('아직 채우지 않은 필수 항목이 8개 있습니다. 쇼핑몰을 열기 전에 반드시 채워 주세요 — 법에서 정한 표시입니다.', { warn: true }) })),
    Canvas({ label: 'A-90 · 저장 버튼 → 입력 오류 (사업자등록번호 자릿수 · 통신판매업 신고번호 비움)' }, Page({}, Note('고칠 곳이 2군데 있습니다.', { warn: true }), bizBox({ bizErr: true, noMail: true }), SaveBar)),
    CanvasRow(
        Canvas({ size: 'auto', label: '국세청 조회로 확인 버튼 → 정상', right: '팝업만', pad: 20 }, bizCheck(true)),
        Canvas({ size: 'auto', label: '국세청 조회 → 등록되지 않은 번호', right: '팝업만', pad: 20 }, bizCheck(false)),
    ),
    CanvasRow(
        Canvas({ size: 'auto', label: '주소 찾기 버튼 → 주소 검색 팝업', right: '팝업만', pad: 20 }, addrModal),
        Canvas({ size: 'auto', label: '운영 시간 · 시각 목록을 연 모습', right: '부분', pad: 20 }, `<div style="width:200px;min-height:290px">${Select({ value: '17:00', w: 120, open: true, options: ['15:00', '15:30', '16:00', '16:30', { t: '17:00', on: true }, '17:30', '18:00'] })}</div>`),
    ),
    CanvasRow(
        Canvas({ size: 'mobile', label: '바닥글 미리보기 · 모바일로 보기 (사업자 정보 펼친 모습)' }, MobileFooter),
        Canvas({ size: 'auto', label: '저장 완료', right: '토스트만', pad: 20 }, Toast('쇼핑몰 정보를 저장했습니다. 바닥글 · 주문 메일 · 약관의 사업자 표시에 반영됐습니다.', { action: '내 쇼핑몰 보기' })),
    ),
);

export default function A90() {
    return [state1].join('');
}
