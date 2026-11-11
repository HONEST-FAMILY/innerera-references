import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, Badge, OrderBadge, ChannelBadge, Chips, Input, Select, Check, Radio, RadioGroup,
    Textarea, FormTable, Filters, Period, ListHead, PerPage, BulkBar, Table, Pager, Tabs, Stepper, Overlay, Modal, Confirm, Toast, ExcelResult, Upload,
    Box, KV, Note, Text, Icon, Empty, Grid, Img, Flex, SHOP,
} from '../lib/blocks.js';

const P = SHOP.productShort;
const [O1, O2, O4] = SHOP.options.map((o) => o.name);
const COUNTS = { 'a-11': 5, 'a-12': 38, 'a-15': 2, 'a-16': 1, 'a-17': 1 };
const TABS = [{ t: '교환 요청', n: 1 }, { t: '수거중', n: 2 }, { t: '재발송 대기', n: 1 }, { t: '재발송중', n: 3 }, { t: '교환완료', n: 12 }, { t: '거부', n: 2 }];
const STEPS = ['교환 요청', '수거중', '재발송', '교환완료'];

const Page = (tab, ...body) => AdminLayout({ active: 'a-17', counts: COUNTS, actions: [Btn('반품·교환 배송비 설정', { icon: 'cog' }), Btn('재발송 송장 엑셀 일괄 등록', { kind: 'primary', icon: 'file-upload-o' })], desc: '교환은 요청 → 수거 → 재발송 → 완료 순서입니다. 돌려받고 새로 보내는 택배가 두 번 움직이므로 송장도 두 개(회수 · 재발송)를 다룹니다.' }, Tabs(TABS, tab), body);
const Search = (sum) => Filters({ open: false, summary: sum || '요청일 최근 1개월 · 채널 전체 · 사유 전체' });

const REQ = { no: '20261106-000082', ch: '자사몰', opt: O1, qty: 1, name: '김민지', tel: '010-****-1234', why: '상품 불량', memo: '스틱 2포가 터져서 왔어요. 새 상품으로 바꿔 주세요.', at: '11-10 20:15', want: `같은 구성 (${O1})`, fee: '판매자 부담', stock: '재고 143개' };
const REQ_COLS = [{ t: '주문번호 · 요청 일시', w: 150 }, { t: '채널', w: 96 }, '받은 상품', { t: '주문자', w: 92 }, { t: '교환 사유', w: 180 }, { t: '바꿔 받을 구성 · 재고', w: 150 }, { t: '교환 배송비', w: 84 }, { t: '', w: 120 }];
const reqRow = (o) => ({ hl: o.noStock, c: [`<u>${o.no}</u><small>요청 ${o.at}</small>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · ${o.qty}개</small>`, `${o.name}<small class="nw">${o.tel}</small>`, `<b>${o.why}</b><small>${o.memo}</small>`,
    `${o.want}<small>${o.noStock ? Badge('재고 없음', 'warn') : o.stock}</small>`, o.fee === '고객 부담' ? Badge('고객 부담', 'bold') : Badge('판매자 부담', 'line'), o.noStock ? `${Btn('처리 고르기', { size: 'sm', kind: 'primary' })}` : `${Btn('수거 지시', { size: 'sm', kind: 'primary' })} ${Btn('거부', { size: 'sm' })}`] });

const state1 = StateBlock({ idx: 1, title: '요청', note: '고객이 교환을 신청한 직후. 사유와 바꿔 받을 구성, 그 구성의 재고를 보고 수거를 지시하거나 거부합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '교환은 반품과 달리 새 상품을 다시 보내야 하므로, 요청을 받는 순간 바꿔 줄 재고가 있는지가 가장 중요합니다. 그래서 목록에 바꿔 받을 구성과 그 재고를 나란히 보여 주고, 수거를 지시하면 그 수량을 교환용으로 잡아 둡니다. 교환 배송비는 고객 부담 사유(구성 변경 · 단순 변심)면 왕복, 판매자 부담 사유(불량 · 파손 · 오배송)면 받지 않습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '교환은 같은 상품의 같은 가격 구성끼리만 받습니다(같은 구성 새 상품, 또는 의류의 색상·사이즈처럼 추가금이 같은 옵션). 가격이 다른 구성으로 바꾸려면 차액 결제·환불이 얽히므로 고객 화면에서 반품 뒤 다시 주문하도록 안내합니다. 교환을 아예 받지 않는 몰은 설정 > 주문·클레임 정책에서 끄면 이 메뉴와 고객의 교환 신청 버튼이 사라집니다.'),
    Canvas({ label: 'A-17 · 교환 요청 탭' }, Page('교환 요청', Search(),
        ListHead({ total: 1, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] }),
        Note('교환 배송비는 설정 > 배송의 반품·교환 배송비(지금 왕복 6,000원)를 따릅니다.'),
    )),
    Canvas({ label: 'A-17 · 요청 줄을 누름 → 요청 내용 팝업' }, Overlay({ bg: Page('교환 요청', Search(), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), h: 700 },
        Modal({ title: '교환 요청 내용 · 20261106-000082', w: 720, foot: [Btn('닫기'), Btn('거부'), Btn('수거 지시', 'primary')] },
            Stepper(STEPS, 0),
            Grid(2,
                KV([['주문자', '김민지 · 010-****-1234'], ['받은 상품', `${P}<br>${O1} · 1개`], ['배송완료', '11-08 13:40 (3일 전 · 교환 기한 11-15까지)'], ['재발송 받을 곳', '서울 마포구 월드컵북로 *** (주문 배송지와 같음)']]),
                KV([['교환 사유', '<b>상품 불량</b> (판매자 부담 사유)'], ['고객이 쓴 말', '스틱 2포가 터져서 왔어요. 새 상품으로 바꿔 주세요.'], ['바꿔 받을 구성', `${O1} · 1개 (같은 구성)`], ['그 구성 재고', `${Badge('있음', 'check')} 143개`]]),
            ),
            '<div style="height:14px"></div>',
            Box({ title: '고객이 올린 사진', sub: '2장' }, Flex({ gap: 8 }, Img({ w: 120, h: 120, label: '터진 스틱' }), Img({ w: 120, h: 120, label: '상자 안쪽' }))),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '다른 업종 예시 · 의류 몰의 요청 줄 (사이즈 교환 · 고객 부담)', right: '부분', pad: 20 }, `<div style="width:560px">${Box({ flat: true }, Text(`${ChannelBadge('자사몰')} <b>옥스퍼드 셔츠 · 화이트 / M · 1개</b><br>교환 사유: 사이즈가 맞지 않음 (고객 부담 · 왕복 6,000원)<br>바꿔 받을 옵션: <b>화이트 / L</b> · 재고 4개 · 추가금 같음<br>옵션 축이 여러 개인 상품은 축마다 바꿀 값을 보여 줍니다. 추가금이 다른 옵션은 고객 화면에서 고를 수 없습니다.`, { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '교환 요청이 없을 때', right: '빈 상태만', pad: 20 }, `<div style="width:440px">${Empty({ icon: 'check-circle-o', title: '처리할 교환 요청이 없습니다', desc: '고객이 교환을 신청하면 여기에 나타나고 알림이 갑니다.' })}</div>`),
    ),
);

const PICK = [
    ['20261105-000068', '자사몰', O2, '이하은', '오배송(1박스가 옴)', 'CJ대한통운', '690012345420', '회수 완료 · 이동 중', '11-10 11:05', '2일째', false],
    ['20261104-000062', '자사몰', O1, '정수아', '상품 파손', 'CJ대한통운', '690012345388', '반품지 도착', '11-11 09:02', '3일째', true],
];
const PICK_COLS = [{ t: '주문번호', w: 146 }, { t: '채널', w: 96 }, '돌려받을 상품', { t: '주문자', w: 64 }, { t: '교환 사유', w: 130 }, { t: '회수 택배사 · 송장', w: 124 }, { t: '회수 단계', w: 150 }, { t: '경과', w: 60 }, { t: '', w: 150 }];
const pickRow = (p) => [`<u>${p[0]}</u>`, ChannelBadge(p[1]), `${P}<small>${p[2]} · 1개</small>`, p[3], p[4], `${p[5]}<small><u>${p[6]}</u></small>`, `<b>${p[7]}</b><small>${p[8]}</small>`, p[9], p[10] ? Btn('수거 확인 · 재발송으로', { size: 'sm', kind: 'primary' }) : Btn('송장 수정', { size: 'sm' })];

const state2 = StateBlock({ idx: 2, title: '수거', note: '요청을 받아들이고 받은 상품을 돌려받는 단계. 수거 지시는 반품과 같은 팝업을 쓰고, 교환에만 있는 선택(먼저 보내기)이 하나 더 있습니다.' },
    Anno({ title: '왜 이렇게 하나' }, '수거 지시의 회수 접수·회수 송장·고객 알림은 반품(A-16)과 똑같이 움직입니다. 교환에서만 정하는 것은 언제 새 상품을 보내느냐입니다. 원칙은 돌려받고 확인한 뒤 보내는 것이지만, 불량·오배송처럼 우리 잘못이면 고객을 기다리게 하지 않도록 수거와 동시에 먼저 보낼 수 있습니다(맞교환). 이 선택에 따라 다음 단계가 달라집니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '먼저 보내기를 고르면 수거가 끝나기 전에 재발송 대기 탭에도 나타납니다. 돌려받은 상품은 도착했을 때 간단히 확인만 하고(수량 · 상태), 문제가 있으면 그때 고객과 연락합니다. 수거 지시와 함께 바꿔 줄 구성의 재고를 교환용으로 잡아 두어 그사이 품절되지 않게 합니다.'),
    Canvas({ label: 'A-17 · 수거 지시 버튼 → 팝업 (반품과 같은 회수 접수 + 새 상품 보내는 때)' }, Overlay({ bg: Page('교환 요청', Search(), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), h: 800 },
        Modal({ title: '수거 지시 · 20261106-000082', w: 640, foot: [Btn('닫기'), Btn('회수 접수하고 수거중으로', 'primary')] },
            Stepper(STEPS, 0),
            FormTable([
                { k: '대상', v: Text(`김민지 · ${P} ${O1} 1개 → 같은 구성 새 상품`) },
                { k: '회수 방법', required: true, v: [Radio('판매자 회수 요청 (택배사에 회수 접수)', { on: true }), Radio('고객이 직접 보냄')] },
                { k: '회수 택배사', required: true, v: Select({ value: 'CJ대한통운 (계약 택배사)', w: 240 }) },
                { k: '회수 접수', required: true, v: [Radio('지금 자동으로 회수 접수하기', { on: true }), Radio('이미 접수했음 (회수 송장 직접 입력)')] },
                { k: '회수지', v: [Text('서울 마포구 월드컵북로 *** · 김민지 010-****-1234'), Btn('회수지 고치기', { size: 'sm' })] },
                { k: '새 상품 보내는 때', required: true, v: [Radio('돌려받은 상품을 확인한 뒤 보내기'), Radio('수거와 동시에 먼저 보내기 (맞교환)', { on: true })], help: '판매자 부담 사유(불량 · 파손 · 오배송)는 먼저 보내기가 초기값입니다. 고객 부담 사유는 확인한 뒤 보내기가 초기값입니다.' },
                { k: '교환용 재고', v: Text(`${O1} 1개를 교환용으로 잡아 둡니다 (판매 가능 재고 143 → 142)`) },
                { k: '고객 알림', v: Check('교환 접수 · 회수 방문 안내 보내기', { on: true }) },
            ]),
        ))),
    Canvas({ label: 'A-17 · 수거중 탭 (반품지 도착 줄에 수거 확인 버튼)' }, Page('수거중', Search(),
        ListHead({ total: 2, left: Chips(['전체 2', '이동 중 1', '반품지 도착 1'], '전체 2'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: PICK_COLS, rows: PICK.map(pickRow) }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '수거 확인 · 재발송으로 → 팝업 (돌려받은 상품 확인)', right: '팝업만', pad: 20 },
            Modal({ title: '수거 확인 · 20261104-000062', w: 600, foot: [Btn('닫기'), Btn('교환 거부'), Btn('확인하고 재발송 대기로', 'primary')] },
                Stepper(STEPS, 1),
                FormTable([
                    { k: '돌려받은 수량', required: true, v: [Input({ value: '1', suffix: '개', w: 100 }), Text('요청 수량 1개', { sm: true, mute: true })] },
                    { k: '확인 결과', required: true, v: [Radio('고객이 말한 대로임 (파손 확인)', { on: true }), Radio('고객이 말한 것과 다름 (이상 없음 · 사용 흔적)')], help: '다름을 고르면 교환 배송비 부담을 고객으로 바꾸거나 교환을 거부할 수 있습니다.' },
                    { k: '돌려받은 상품', required: true, v: [Radio('되돌리지 않기 (폐기 · 불량 재고)', { on: true }), Radio('판매 가능 재고로 되돌리기')] },
                    { k: '고객 알림', v: Check('상품 도착 · 새 상품 발송 예정 안내 보내기', { on: true }) },
                ]),
            )),
        Canvas({ size: 'auto', label: '고객 부담 사유 · 교환 배송비를 아직 받지 못했을 때', right: '팝업만', pad: 20 },
            Modal({ title: '수거 확인 · 교환 배송비', w: 520, foot: [Btn('닫기'), Btn('확인하고 재발송 대기로', { kind: 'primary', disabled: true })] },
                Note('고객 부담 교환입니다. 교환 배송비 6,000원(왕복)을 받아야 새 상품을 보낼 수 있습니다.', { warn: true }),
                FormTable([{ k: '교환 배송비', required: true, v: [Radio('상자에 동봉되어 있음'), Radio('입금 확인함 (무통장 계좌)'), Radio('고객에게 결제 주소 보내기 (카드·간편결제)', { on: true }), Radio('받지 않기로 함 (판매자가 냄)')], help: '결제 주소를 보내면 고객이 결제하는 대로 재발송 대기로 넘어갑니다.' }]),
                Flex({ mt: 8 }, Btn('결제 주소 알림 보내기', { icon: 'send' })),
            )),
    ),
);

const RESEND = [
    { no: '20261106-000082', ch: '자사몰', name: '김민지', tel: '010-****-1234', opt: O1, addr: '서울 마포구 월드컵북로 ***', pick: '수거중(먼저 보내기)', v: 'empty' },
];
const RS_COLS = [{ t: '주문번호', w: 146 }, { t: '채널', w: 96 }, '새로 보낼 상품', { t: '받는 분 · 받을 곳', w: 210 }, { t: '택배사', w: 124 }, { t: '재발송 송장번호', w: 150 }];
const rsRow = (o, inv) => [`<u>${o.no}</u>`, ChannelBadge(o.ch), `${P}<small>${o.opt} · 1개 · 교환용 재고 잡힘 · ${o.pick}</small>`, `${o.name} · ${o.tel}<small>${o.addr}</small>`, Select({ value: 'CJ대한통운', w: 112 }), inv];

const state3 = StateBlock({ idx: 3, title: '재발송 송장', note: '새 상품을 다시 보내는 단계. 출고와 똑같이 목록에서 송장을 바로 넣거나 엑셀로 한 번에 올립니다. 넣으면 재발송중이 되고 고객에게 발송 안내가 갑니다.' },
    Anno({ title: '왜 이렇게 하나' }, '재발송은 출고와 같은 일입니다. 포장해서 택배사에 넘기고 송장을 넣습니다. 그래서 발주 확인·발송 처리(A-12)와 같은 방식(목록에서 바로 입력 · 엑셀 일괄 등록 · 검증 결과에서 되는 것만 처리)을 그대로 씁니다. 교환 재발송분을 출고 엑셀에 함께 넣을 수 있도록, 재발송 대기 주문은 A-12의 양식 내려받기에도 교환 표시와 함께 포함시킬 수 있습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '재발송 송장은 원래 출고 송장·회수 송장과 다른 세 번째 번호입니다. 주문 상세에는 세 송장이 모두 남습니다. 스마트스토어 교환은 재발송 송장을 네이버로 전송해야 네이버에서 교환이 끝납니다. 재발송분은 새 결제가 없으므로 매출에 다시 잡히지 않습니다.'),
    Canvas({ label: 'A-17 · 재발송 대기 탭 · 목록에서 재발송 송장 바로 입력' }, Page('재발송 대기', Search(),
        ListHead({ total: 1, right: [Text('입력한 주문 <b>1</b>건', { sm: true }), Btn('입력한 1건 재발송 처리', { kind: 'primary', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: RS_COLS, rows: [{ on: true, c: rsRow(RESEND[0], Input({ value: '581233441377', w: 138 })) }] }),
        Note('송장번호를 넣고 엔터를 누르면 다음 줄로 내려갑니다. 바코드 스캐너로 찍어도 같은 칸에 들어갑니다.'),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '입력칸 상태 (빈칸 · 입력 중 · 오류)', right: '부분', pad: 20 }, `<div style="width:420px">${KV([['빈칸', Input({ placeholder: '송장번호', w: 160 })], ['입력 중', Input({ value: '5812334413', w: 160, focus: true })], ['오류', `${Input({ value: '690012345388', w: 160, error: true })}<p class="err">${Icon('error-o')}이 주문의 회수 송장번호입니다. 재발송용 새 송장번호를 넣으세요.</p>`]])}</div>`),
        Canvas({ size: 'auto', label: '재발송 처리 → 확인', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '1건을 재발송 처리할까요?', desc: '김민지 · CJ대한통운 581233441377<br>상태가 재발송중으로 바뀌고 고객에게 교환 상품 발송 안내(택배사 · 송장번호)가 갑니다.<br>교환용으로 잡아 둔 재고 1개가 실제로 빠집니다.', ok: '재발송 처리' })),
    ),
    Canvas({ label: 'A-17 · 재발송 송장 엑셀 일괄 등록 버튼 → 팝업 (재발송 대기가 여러 건인 날 · 검증 결과)' }, Overlay({ bg: Page('재발송 대기', Search()), h: 700 },
        Modal({ title: '재발송 송장 엑셀 일괄 등록', w: 720, foot: [Btn('오류 1행만 엑셀로 받기', { icon: 'download' }), Btn('파일 다시 올리기'), Btn('성공 7건 재발송 처리', 'primary')] },
            Stepper(['양식 내려받기', '엑셀 올리기', '검증 결과', '재발송 처리'], 2),
            Text('교환재발송_20261111_CJ대한통운.xlsx · 8행 · 양식: CJ대한통운 접수 양식', { sm: true, mute: true }),
            ExcelResult({ total: 8, ok: 7, fail: 1, rows: [{ row: 6, key: '20261103-000057', value: '581233441380', reason: '아직 수거 확인 전입니다. 확인한 뒤 보내기로 한 교환이라 수거 확인을 먼저 하세요' }], note: '성공한 7건은 재발송중으로 바뀌고 고객에게 발송 안내가 갑니다. 스마트스토어 2건은 네이버로 재발송 송장이 전송됩니다.' }),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '엑셀 일괄 등록 1단계 (양식 내려받기 · 올리기 전)', right: '팝업만', pad: 20 },
            Modal({ title: '재발송 송장 엑셀 일괄 등록', w: 600, foot: [Btn('닫기'), Btn('검증하기', { kind: 'primary', disabled: true })] },
                Stepper(['양식 내려받기', '엑셀 올리기', '검증 결과', '재발송 처리'], 0),
                FormTable([{ k: '양식', v: Select({ value: 'CJ대한통운 접수 양식', w: 280 }), help: '주문 > 엑셀 양식 설정에서 만든 양식입니다.' }]),
                Flex({ mt: 10 }, Btn('양식 내려받기 (재발송 대기 8건)', { icon: 'file-download-o' })),
                '<div style="height:12px"></div>',
                Upload({ title: '엑셀 파일을 끌어다 놓거나 눌러서 고르기', guide: ['확장자 XLSX · XLS · CSV', '용량 10MB 이하', '주문번호로 짝을 맞춥니다'] }),
            )),
        Canvas({ size: 'auto', label: '재발송 처리 완료', right: '토스트만', pad: 20 }, Toast('1건을 재발송 처리하고 고객에게 발송 안내를 보냈습니다.', { action: '재발송중 탭 보기' })),
    ),
    Canvas({ label: 'A-17 · 재발송중 탭 (새 상품 배송 추적 · 수거가 아직 안 끝난 맞교환 표시)' }, Page('재발송중', Search(),
        ListHead({ total: 3, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '주문번호', w: 146 }, { t: '채널', w: 100 }, '보낸 상품', { t: '받는 분', w: 70 }, { t: '재발송 송장', w: 130 }, { t: '추적 단계', w: 150 }, { t: '수거', w: 130 }, { t: '상태', w: 80 }], rows: [
            ['<u>20261106-000082</u>', ChannelBadge('자사몰'), `${P}<small>${O1} · 1개</small>`, '김민지', 'CJ대한통운<small><u>581233441377</u></small>', '<b>집화 완료</b><small>11-11 17:40</small>', `${Badge('아직 수거중', 'warn')}<small>회수 접수 11-11</small>`, OrderBadge('재발송')],
            ['<u>20261102-000050</u>', ChannelBadge('자사몰'), `${P}<small>${O2} · 1개</small>`, '강지호', 'CJ대한통운<small><u>581233441299</u></small>', '<b>배송 출발</b><small>11-11 08:10</small>', '<small>수거 확인 11-09</small>', OrderBadge('재발송')],
            ['<u>2026110244870902</u>', ChannelBadge('스마트스토어'), `${P}<small>${O1} · 1개</small>`, '윤서연', '한진택배<small><u>423198770388</u></small>', '<b>간선 하차</b><small>11-11 04:30</small>', '<small>수거 확인 11-09</small>', OrderBadge('재발송')],
        ] }),
        Note('새 상품이 배송완료되고 수거 확인도 끝나면 자동으로 교환완료가 됩니다.'),
    )),
);

const state4 = StateBlock({ idx: 4, title: '완료', note: '새 상품이 도착하고 돌려받는 것도 끝난 교환. 송장 세 개(처음 출고 · 회수 · 재발송)와 걸린 날을 남깁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '교환완료는 사람이 누르지 않습니다. 재발송 상품이 배송완료되고 수거 확인이 끝나면 자동으로 됩니다. 완료된 교환은 같은 상품의 불량이 반복되는지 보는 자료가 되므로 사유별 칩으로 걸러 봅니다. 교환완료 뒤의 자동 구매확정은 재발송 배송완료일부터 다시 셉니다.'),
    Canvas({ label: 'A-17 · 교환완료 탭' }, Page('교환완료', Search('완료일 최근 1개월'),
        ListHead({ total: 12, left: Chips(['전체 12', '상품 불량 5', '상품 파손 4', '오배송 2', '고객 부담 사유 1'], '전체 12'), right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '주문번호 · 완료 일시', w: 150, sort: 'desc' }, { t: '채널', w: 100 }, '교환한 상품', { t: '주문자', w: 70 }, { t: '교환 사유', w: 100 }, { t: '배송비 부담', w: 96 }, { t: '재발송 송장', w: 130 }, { t: '걸린 날', w: 70 }, { t: '자동 구매확정', w: 96 }], rows: [
            ['<u>20261030-000035</u><small>11-10 13:20</small>', ChannelBadge('자사몰'), `${P}<small>${O1} → 같은 구성 · 1개</small>`, '박서준', '상품 파손', Badge('판매자 부담', 'line'), 'CJ대한통운<small><u>581233440990</u></small>', '4일', '11-17'],
            ['<u>20261029-000028</u><small>11-08 16:05</small>', ChannelBadge('자사몰'), `${P}<small>${O2} → 같은 구성 · 1개</small>`, '임재현', '상품 불량', Badge('판매자 부담', 'line'), 'CJ대한통운<small><u>581233440802</u></small>', '5일', '11-15'],
            ['<u>2026102744450061</u><small>11-06 11:40</small>', ChannelBadge('스마트스토어'), `${P}<small>${O1} → 같은 구성 · 1개</small>`, '최도윤', '오배송', Badge('판매자 부담', 'line'), '한진택배<small><u>423198770102</u></small>', '6일', '네이버 기준'],
        ] }),
        Pager({ page: 1, last: 1, per: 50 }),
    )),
    CanvasRow(
        Canvas({ size: 'auto', label: '완료 줄을 누름 → 주문 상세의 클레임 이력에 남는 내용', right: '부분', pad: 20 }, `<div style="width:560px">${Box({ title: '교환 · 20261030-000035', sub: '교환완료 11-10 13:20' }, KV([['사유', '상품 파손 (판매자 부담) · 사진 2장'], ['처음 출고', 'CJ대한통운 581233440620 · 11-01 배송완료'], ['회수', 'CJ대한통운 690012345102 · 11-08 반품지 도착 · 파손 확인 · 폐기'], ['재발송', 'CJ대한통운 581233440990 · 11-10 배송완료'], ['처리한 사람', '이보림 (수거 지시 11-06 · 수거 확인 11-08 · 재발송 11-08)'], ['고객 알림', '교환 접수 · 상품 도착 · 교환 상품 발송 · 교환 완료 (모두 성공)']], { wide: true }))}</div>`),
        Canvas({ size: 'auto', label: '교환완료가 자동으로 될 때 운영자에게 가는 알림', right: '토스트만', pad: 20 }, Toast('교환 1건이 끝났습니다. 20261030-000035 박서준 · 재발송 상품 배송완료.', { action: '보기' })),
    ),
);

const state5 = StateBlock({ idx: 5, title: '거부', note: '교환을 받아 줄 수 없을 때. 사유는 필수이고 고객 알림에 들어갑니다. 반품 거부와 같은 팝업을 씁니다.' },
    Anno({ title: '왜 이렇게 하나' }, '교환 거부도 반품 거부와 같은 두 시점(요청 단계 · 수거 확인 뒤)에 일어나고 같은 규칙을 따릅니다. 수거한 뒤 거부하면 받은 상품을 어떻게 돌려줄지 정해야 하고, 교환용으로 잡아 둔 재고는 자동으로 풀립니다. 거부하면 주문은 배송완료로 돌아가 자동 구매확정이 다시 흐릅니다.'),
    Canvas({ label: 'A-17 · 거부 버튼 → 팝업 (요청 단계)' }, Overlay({ bg: Page('교환 요청', Search(), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), h: 700 },
        Modal({ title: '교환 거부 · 20261106-000082', w: 620, foot: [Btn('닫기'), Btn('거부하고 고객에게 알리기', 'danger')] },
            FormTable([
                { k: '대상', v: Text(`김민지 · ${P} ${O1} 1개 · 요청 사유 상품 불량`) },
                { k: '거부 사유', required: true, v: Select({ value: '교환할 수 있는 기간(배송완료 뒤 7일)이 지났습니다', w: 380, open: true, options: [{ t: '교환할 수 있는 기간(배송완료 뒤 7일)이 지났습니다', on: true }, '상품을 사용했거나 훼손되어 가치가 줄었습니다', '확인 결과 불량이 아닙니다', '고객이 교환 요청을 거두었습니다', '기타(직접 입력)'] }) },
                { k: '고객에게 할 말', v: Textarea({ placeholder: '거부 사유 아래에 덧붙일 말 (선택)', h: 64, count: '0 / 200' }) },
                { k: '거부 뒤', v: Text(`주문은 ${OrderBadge('배송완료')} 로 돌아가고, 교환용으로 잡아 둔 재고가 풀립니다`) },
            ]),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '수거 확인 뒤 거부 (받은 상품 돌려보내기 · 알림 미리보기)', right: '팝업만', pad: 20 },
            Modal({ title: '교환 거부 · 20261104-000062', w: 620, foot: [Btn('닫기'), Btn('거부하고 고객에게 알리기', 'danger')] },
                FormTable([
                    { k: '거부 사유', required: true, v: Select({ value: '확인 결과 불량이 아닙니다', w: 380 }) },
                    { k: '고객에게 할 말', v: Textarea({ value: '보내 주신 상품을 확인했으나 파손이 없었습니다. 상품을 다시 보내 드립니다.', h: 64, count: '41 / 200' }) },
                    { k: '받은 상품 돌려보내기', required: true, v: [Radio('고객에게 다시 보냄 (착불)'), Radio('고객에게 다시 보냄 (선불 · 판매자 부담)', { on: true }), Radio('고객이 폐기에 동의함')] },
                ]),
                Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 정수아 님, 요청하신 교환이 어렵게 되었습니다.<br>주문번호 20261104-000062<br>사유: 확인 결과 불량이 아닙니다<br>보내 주신 상품을 확인했으나 파손이 없었습니다. 상품을 다시 보내 드립니다.<br>문의: 고객센터 070-****-1234', { sm: true })),
            )),
        Canvas({ size: 'auto', label: '이미 먼저 보낸 교환(맞교환)은 거부할 수 없음', right: '팝업만', pad: 20 }, Confirm({ w: 440, title: '이미 새 상품을 보낸 교환입니다', desc: '재발송 송장 581233441377 · 11-11 발송<br>새 상품이 나간 뒤에는 교환을 거부할 수 없습니다. 돌려받은 상품에 문제가 있으면 고객과 연락해 반품으로 처리하거나 관리자 메모에 남기세요.', foot: [Btn('닫기'), Btn('주문 상세에서 메모 쓰기', 'primary')] })),
    ),
    Canvas({ label: 'A-17 · 거부 탭' }, Page('거부', Search('거부일 최근 1개월'),
        ListHead({ total: 2, right: [Btn('엑셀 내려받기', { icon: 'download', size: 'sm' }), PerPage(50)] }),
        Table({ check: true, cols: [{ t: '주문번호 · 거부 일시', w: 150 }, { t: '채널', w: 100 }, '상품 · 구성', { t: '주문자', w: 70 }, { t: '거부 시점', w: 90 }, { t: '거부 사유', w: 230 }, { t: '받은 상품', w: 130 }, { t: '지금 상태', w: 90 }], rows: [
            ['<u>20261104-000062</u><small>11-11 11:30</small>', ChannelBadge('자사몰'), `${P}<small>${O1} · 1개</small>`, '정수아', '수거 확인 뒤', '확인 결과 불량이 아닙니다', '다시 보냄(선불)<small><u>581233441390</u></small>', OrderBadge('배송완료')],
            ['<u>20261022-000012</u><small>11-03 09:45</small>', ChannelBadge('자사몰'), `${P}<small>${O2} · 1개</small>`, '이하은', '요청 단계', '교환할 수 있는 기간이 지났습니다', '<small>수거 안 함</small>', OrderBadge('구매확정')],
        ] }),
    )),
);

const NS = { ...REQ, no: '20261109-000105', name: '윤서연', tel: '010-****-3317', opt: O4, why: '상품 파손', memo: '상자가 찌그러지고 안의 박스 하나가 눌렸어요.', at: '11-11 09:20', want: `같은 구성 (${O4})`, noStock: true };

const state6 = StateBlock({ idx: 6, title: '교환 옵션 재고 없음', note: '바꿔 줄 구성의 재고가 없는 요청. 수거 지시 대신 처리 고르기 버튼이 나오고, 반품으로 바꾸거나 입고를 기다리게 합니다.' },
    Anno({ title: '왜 이렇게 하나' }, '재고가 없는데 교환을 접수하면 고객은 상품을 돌려보내고 하염없이 기다리게 됩니다. 그래서 재고가 없는 요청은 목록에서 바로 표시하고 수거 지시를 막습니다. 운영자가 고를 수 있는 길은 세 가지입니다. 반품(환불)으로 바꾸기, 입고 예정일을 알리고 기다리게 하기, 재고가 있는 다른 같은 가격 옵션으로 바꾸기(고객 동의). 어느 쪽이든 고객에게 알림이 가고 고객이 동의해야 다음으로 넘어갑니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '요청 때는 재고가 있었지만 수거하는 사이 품절될 수도 있습니다(교환용 재고를 잡기 전). 그래서 재발송 대기 탭에서도 같은 표시와 같은 처리 고르기가 나옵니다. 반품으로 바꾸면 반품 관리(A-16)의 수거 단계로 이어지고, 판매자 부담 사유였다면 그대로 판매자 부담으로 넘어갑니다.'),
    Canvas({ label: 'A-17 · 교환 요청 탭 · 재고 없는 요청 (줄 강조 · 처리 고르기 버튼)' }, Page('교환 요청', Search(),
        ListHead({ total: 2, left: Chips(['전체 2', '교환 재고 없음 1'], '전체 2'), right: PerPage(50) }),
        Table({ check: true, cols: REQ_COLS, rows: [reqRow(NS), reqRow(REQ)] }),
    )),
    Canvas({ label: 'A-17 · 처리 고르기 버튼 → 팝업 (반품으로 전환 안내가 초기값)' }, Overlay({ bg: Page('교환 요청', Search(), Table({ check: true, cols: REQ_COLS, rows: [reqRow(NS), reqRow(REQ)] })), h: 800 },
        Modal({ title: '교환할 재고가 없습니다 · 20261109-000105', w: 660, foot: [Btn('닫기'), Btn('반품 전환 안내 보내기', 'primary')] },
            Note(`바꿔 줄 ${O4} 의 재고가 0개입니다. 입고 예정일 2026-11-16 (재고 관리에 적힌 값).`, { warn: true }),
            FormTable([
                { k: '처리', required: true, v: [Radio('반품(환불)으로 바꾸기 — 고객에게 동의를 구함', { on: true }), Radio('입고를 기다리게 하기 — 예정일을 알림'), Radio('재고가 있는 다른 구성으로 바꾸기 (같은 가격만)', { disabled: true })], help: '같은 가격의 다른 구성이 없어 세 번째는 고를 수 없습니다(이너에라는 구성마다 가격이 다름).' },
                { k: '환불 예정 금액', v: Text('<b>176,000원</b> 전액 · 판매자 부담 사유(상품 파손)라 반품 배송비 없음') },
                { k: '고객 응답 기한', v: Select({ value: '3일 안에 응답 없으면 다시 알림', w: 280 }) },
            ]),
            Box({ flat: true, title: '고객에게 가는 알림 미리보기', sub: '알림톡 · 실패 시 문자' }, Text('[이너에라] 윤서연 님, 교환 요청하신 상품의 재고가 없어 바로 바꿔 드리기 어렵습니다. 죄송합니다.<br>주문번호 20261109-000105 · 롱지비티 석류맛 젤리스틱 4박스(56일분)<br>환불(176,000원 전액, 반품 배송비 없음)로 바꿔 진행해도 될까요?<br>아래에서 골라 주세요.<br>환불로 진행하기 / 입고(11월 16일 예정)까지 기다리기', { sm: true })),
        ))),
    CanvasRow(
        Canvas({ size: 'auto', label: '입고를 기다리게 하기를 고른 모습 (입력칸이 바뀜)', right: '팝업만', pad: 20 },
            Modal({ title: '교환할 재고가 없습니다 · 20261109-000105', w: 620, foot: [Btn('닫기'), Btn('입고 대기 안내 보내기', 'primary')] },
                FormTable([
                    { k: '처리', required: true, v: [Radio('반품(환불)으로 바꾸기'), Radio('입고를 기다리게 하기 — 예정일을 알림', { on: true })] },
                    { k: '입고 예정일', required: true, v: Input({ value: '2026-11-16 (월)', icon: 'calendar', w: 200 }), help: '재고 관리의 입고 예정일이 채워져 있습니다. 재고가 들어오면 이 요청이 맨 위로 올라오고 알림이 옵니다.' },
                    { k: '수거', v: [Radio('입고된 뒤에 수거 지시', { on: true }), Radio('지금 수거 지시 (파손 상품을 먼저 가져옴)')] },
                ]),
            )),
        Canvas({ size: 'auto', label: '다른 업종 예시 · 의류 몰 (같은 가격의 다른 옵션으로 바꾸기)', right: '팝업만', pad: 20 },
            Modal({ title: '교환할 재고가 없습니다 · 옥스퍼드 셔츠', w: 560, foot: [Btn('닫기'), Btn('옵션 변경 안내 보내기', 'primary')] },
                Note('바꿔 줄 화이트 / L 의 재고가 0개입니다.', { warn: true }),
                FormTable([
                    { k: '처리', required: true, v: [Radio('반품(환불)으로 바꾸기'), Radio('입고를 기다리게 하기'), Radio('재고가 있는 다른 옵션으로 바꾸기 (같은 가격만)', { on: true })] },
                    { k: '바꿔 줄 옵션', required: true, v: Select({ value: '스카이블루 / L', w: 260, open: true, search: '', options: [{ t: '스카이블루 / L', sub: '재고 6개', on: true }, { t: '화이트 / XL', sub: '재고 2개' }, { t: '화이트 / L', sub: '품절', disabled: true }, { t: '네이비 / L', sub: '추가금 다름', disabled: true }] }) },
                ]),
            )),
    ),
    Canvas({ label: 'A-17 · 고객이 환불로 진행하기를 고른 뒤 (반품 관리로 넘어감 · 교환 요청에서 빠짐)' }, Overlay({ bg: Page('교환 요청', Search(), ListHead({ total: 1, right: PerPage(50) }), Table({ check: true, cols: REQ_COLS, rows: [reqRow(REQ)] })), dim: false, align: 'top', h: 360 },
        Toast('윤서연 님이 환불을 골랐습니다. 20261109-000105 를 반품 관리의 반품 요청으로 옮겼습니다.', { action: '반품 관리에서 수거 지시' }))),
    CanvasRow(
        Canvas({ size: 'auto', label: '고객 응답을 기다리는 동안 줄의 모습', right: '부분', pad: 20 }, `<div style="width:520px">${Box({ flat: true }, Text(`${Badge('고객 응답 대기', 'dash')} <b>20261109-000105 · 윤서연</b><br>반품 전환 안내 11-11 10:40 발송 · 아직 응답 없음 (2일 20시간 남음)<br>${Btn('안내 다시 보내기', { size: 'sm', icon: 'send' })} ${Btn('전화로 동의받음 · 반품으로 전환', { size: 'sm', kind: 'primary' })} ${Btn('처리 다시 고르기', { size: 'sm' })}`, { sm: true }))}</div>`),
        Canvas({ size: 'auto', label: '재고가 들어왔을 때 (입고 대기 중이던 요청)', right: '토스트만', pad: 20 }, Toast(`${O4} 재고가 들어왔습니다(24개). 입고를 기다리던 교환 1건을 진행할 수 있습니다.`, { action: '수거 지시' })),
    ),
);

export default function A17() {
    return [state1, state2, state3, state4, state5, state6].join('');
}
