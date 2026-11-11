import {
    Canvas, CanvasRow, StateBlock, Anno, AdminLayout, Btn, BtnRow, Badge, Input, Select, Check, Toggle, Tabs,
    FormTable, Overlay, Modal, Confirm, Toast, Upload, ImageGuide, Box, Note as NoteBase, Text, Icon, Flex, Grid, Img,
    UserHeader, UserFooter, MobilePage, SHOP,
} from '../lib/blocks.js';

const Note = (text, o) => NoteBase(`<span>${text}</span>`, o);

const BAND = '5가지 핵심 원료를 하루 한 포에 — 이너에라 롱지비티 보러가기';

const Page = (o, ...body) => AdminLayout({ active: 'a-60', desc: '여기서 바꾼 값은 저장하는 즉시 쇼핑몰의 모든 화면(머리·바닥글·버튼·브라우저 탭)에 반영됩니다.', actions: [Btn('미리보기', { icon: 'eye-o' }), Btn('저장', 'primary')], ...o }, body);

const Swatch = (label, hex, o = {}) => `<span style="display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 10px;border:${o.on ? '2px solid var(--dark)' : '1px solid var(--line)'};border-radius:4px;font-size:12.5px;background:#fff"><span style="width:20px;height:20px;border-radius:3px;border:1px solid var(--line);background:${o.dark ? 'var(--dark)' : 'var(--fill)'}"></span>${label}<span style="color:var(--mute)">${hex}</span></span>`;

const LOGO_GUIDE = ImageGuide({ size: '가로형 · 높이 80 px 이상(화면에는 높이 32 px 로 줄여 보여 줌)', ratio: '가로 2:1 ~ 6:1', max: '1MB 이하', ext: 'SVG(권장) · PNG(배경 투명)', more: ['여백 없이 글자·심볼에 꼭 맞게 잘라 올리세요'] });
const FAV_GUIDE = ImageGuide({ size: '512 × 512 px', ratio: '1:1', max: '1MB 이하', ext: 'PNG', more: ['브라우저 탭·즐겨찾기·휴대폰 홈 화면 아이콘으로 자동 변환됩니다(16 · 32 · 180 · 192 · 512)'] });

const logoBox = (o = {}) => Box({ title: '로고', sub: '머리·바닥글·주문 메일·알림톡에 쓰입니다' },
    Grid(2,
        `<div>${Text('기본 로고 (밝은 배경용)', { b: true })}${Upload({ title: o.empty ? '로고 파일을 끌어다 놓거나 눌러서 고르기' : '다른 파일로 바꾸려면 끌어다 놓기', button: o.empty ? '파일 고르기' : '파일 바꾸기', guide: LOGO_GUIDE, files: o.empty ? [] : o.error ? [{ name: 'innerera_logo_square.jpg', size: '2.4MB', error: 'JPG 는 배경이 투명하지 않아 올릴 수 없습니다. SVG 나 PNG 로 올려 주세요.' }] : [{ name: 'innerera_logo.svg', size: '6KB · 가로 4.2:1', icon: 'image-o' }] })}</div>`,
        `<div>${Text('어두운 배경용 로고 (선택)', { b: true })}${Upload({ title: '흰색 로고 파일 고르기', guide: ['규격은 기본 로고와 같습니다', '안 올리면 어두운 배경(바닥글·띠)에서도 기본 로고를 씁니다'], files: o.empty ? [] : [{ name: 'innerera_logo_white.svg', size: '6KB', icon: 'image-o' }] })}</div>`,
    ),
    o.empty ? Note('로고를 올리기 전에는 머리에 상호 글자(이너에라 Inner:Era)가 로고 자리에 나옵니다.') : '',
);

const favBox = (o = {}) => Box({ title: '파비콘', sub: '브라우저 탭과 휴대폰 홈 화면 아이콘' },
    Flex({ gap: 20, align: 'flex-start' },
        `<div style="flex:none">${Img({ w: 96, h: 96, label: o.empty ? '없음' : '512 × 512' })}<div style="margin-top:6px;display:flex;gap:6px;align-items:center;font-size:11.5px;color:var(--mute)">${Img({ w: 16, h: 16, icon: 'image-o' })}탭 16 px ${Img({ w: 32, h: 32 })}32 px</div></div>`,
        `<div class="grow">${Upload({ title: '파비콘 이미지 고르기', guide: FAV_GUIDE, files: o.empty ? [] : [{ name: 'innerera_favicon_512.png', size: '38KB · 512 × 512', icon: 'image-o' }] })}</div>`,
    ),
);

const colorBox = (o = {}) => Box({ title: '대표색', sub: '버튼·링크·선택 표시·배지에 쓰이는 색' },
    FormTable([
        { k: '대표색', required: true, v: [Swatch('', o.hex || '#7A1F2B', { on: true, dark: true }), Input({ value: o.hex || '#7A1F2B', w: 120, error: o.hexError, focus: o.picker }), Btn('색 고르기', { size: 'sm', icon: 'palette' })], help: '구매 버튼·선택된 탭·링크에 쓰입니다. 흰 글자가 잘 읽히는 어두운 색을 권합니다.', error: o.hexError ? '색 값은 # 뒤에 영문·숫자 6자리로 넣어 주세요. 예: #7A1F2B' : undefined },
        { k: '보조색', v: [Swatch('', '#F3EDE6'), Input({ value: '#F3EDE6', w: 120 }), Btn('색 고르기', { size: 'sm', icon: 'palette' })], help: '띠·카드 배경처럼 넓은 면에 쓰이는 옅은 색입니다.' },
        { k: '버튼 글자색', v: [Text('흰색 (대표색 밝기에 맞춰 자동)', { sm: true }), Badge('읽기 쉬움 · 대비 9.1:1', 'check')], help: '대표색이 밝으면 글자색이 자동으로 검정으로 바뀝니다. 대비가 4.5:1 아래면 경고가 뜹니다.' },
        { k: '적용 모습', v: [Btn('구매하기', 'primary'), Btn('장바구니'), Badge('무료배송', 'bold'), '<u style="font-size:13px">자세히 보기</u>'] },
    ]),
);

const snsRow = (name, on, value, ph) => ({ k: name, v: [Toggle('', { on }), Input({ value: on ? value : '', placeholder: ph, w: 420, disabled: !on })] });

const snsBox = (o = {}) => Box({ title: 'SNS 링크', sub: '켜 둔 것만 바닥글과 서랍 메뉴 아래에 아이콘으로 나옵니다' },
    FormTable([
        snsRow('인스타그램', !o.empty, 'https://www.instagram.com/innerera.official', 'https://www.instagram.com/계정'),
        { ...snsRow('카카오톡 채널', !o.empty, 'https://pf.kakao.com/_innerera', 'https://pf.kakao.com/_채널'), help: '알림톡을 보내는 채널과 같은 채널이면 고객이 채널 추가를 하기 쉽습니다.' },
        snsRow('네이버 블로그', false, '', 'https://blog.naver.com/아이디'),
        o.snsError
            ? { k: '유튜브', v: [Toggle('', { on: true }), Input({ value: 'youtube.com/@innerera', w: 420, error: true })], error: '주소는 https:// 로 시작해야 합니다. 주소창의 주소를 그대로 붙여 넣어 주세요.' }
            : snsRow('유튜브', false, '', 'https://www.youtube.com/@채널'),
    ]),
);

const bandBox = (o = {}) => Box({ title: '상단 띠 문구', sub: '모든 화면 맨 위에 한 줄로 나오는 안내', right: Toggle('사용', { on: !o.empty }) },
    FormTable([
        { k: '문구', required: true, v: Input({ value: o.empty ? '' : BAND, placeholder: '예: 5만원 이상 구매 시 무료배송', w: 560 }), help: `${o.empty ? '0' : '33'} / 40자 · 모바일에서 한 줄에 들어가는 길이는 22자 안팎이고, 넘으면 오른쪽에서 왼쪽으로 흐릅니다.` },
        { k: '누르면 이동', v: [Select({ value: o.empty ? '' : '상품 · 이너에라 롱지비티 석류맛 젤리스틱', placeholder: '이동 없음', w: 360 }), Check('새 창으로 열기')] },
        { k: '노출 기간', v: [Check('기간 없이 계속', { on: true }), Input({ placeholder: '시작일', icon: 'calendar', w: 150, disabled: true }), '~', Input({ placeholder: '종료일', icon: 'calendar', w: 150, disabled: true })] },
        { k: '닫기 버튼', v: [Check('고객이 닫을 수 있게 하기 (닫으면 하루 동안 안 보임)')] },
    ]),
    Note('문구를 여러 개 돌려 가며 보여 주거나 기간을 예약하려면 디자인 > 배너·팝업의 띠 배너 탭을 쓰세요. 여기 문구는 예약된 띠 배너가 없을 때 나오는 기본 문구입니다.'),
);

const SaveBar = (o = {}) => BtnRow({ align: 'right' }, o.dirty ? Text(`${Icon('info-o')} 저장하지 않은 변경 2건`, { sm: true }) : '', Btn('처음 값으로 되돌리기'), Btn('미리보기', { icon: 'eye-o' }), Btn('저장', 'primary'));

const full = (o = {}) => Page({}, logoBox(o), Grid(2, favBox(o), colorBox(o)), snsBox(o), bandBox(o), SaveBar(o));

const Picker = `<div style="width:260px;border:1px solid var(--line);border-radius:6px;background:#fff;padding:12px;font-size:12.5px">
<div style="height:120px;border:1px solid var(--line);border-radius:4px;background:var(--fill);position:relative"><span style="position:absolute;right:38px;top:44px;width:14px;height:14px;border:2px solid #fff;border-radius:50%;outline:1px solid var(--dark)"></span><span style="position:absolute;left:8px;bottom:6px;color:var(--mute)">색 고르는 면 (밝기 · 선명함)</span></div>
<div style="height:12px;margin:10px 0;border:1px solid var(--line);border-radius:6px;background:var(--box);position:relative"><span style="position:absolute;left:8px;top:-3px;width:8px;height:16px;border:1px solid var(--dark);background:#fff;border-radius:2px"></span></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:10px">${Input({ value: '#7A1F2B', w: 110, focus: true })}<span style="color:var(--mute)">직접 입력</span></div>
<div style="color:var(--mute);margin-bottom:6px">최근에 쓴 색</div>
<div style="display:flex;gap:6px">${['#7A1F2B', '#F3EDE6', '#2B2B31', '#B8894A'].map((h, i) => `<span title="${h}" style="width:24px;height:24px;border-radius:3px;border:${i === 0 ? '2px solid var(--dark)' : '1px solid var(--line)'};background:${i === 2 ? 'var(--dark)' : 'var(--fill)'}"></span>`).join('')}</div>
<div style="display:flex;justify-content:flex-end;gap:6px;margin-top:12px">${Btn('취소', { size: 'sm' })}${Btn('이 색 쓰기', { kind: 'primary', size: 'sm' })}</div></div>`;

const state1 = StateBlock({ idx: 1, title: '로고·파비콘·대표색·SNS 링크·상단 띠 문구', note: '디자인 > 사이트 기본에 들어오면 보이는 한 장짜리 설정 화면. 위에서부터 로고 → 파비콘·대표색 → SNS → 상단 띠 순서입니다.' },
    Anno({ title: '왜 이렇게 하나' }, '로고·색·SNS 주소는 고객사가 바뀔 때마다, 리뉴얼할 때마다 바뀌는 값입니다. 코드에 박아 두면 그때마다 개발자를 불러야 하므로 운영자가 파일을 올리고 색 값을 넣으면 머리·바닥글·버튼·주문 메일에 한꺼번에 반영되게 합니다. 다음 고객사는 이 화면만 채우면 몰의 얼굴이 바뀝니다.'),
    Anno({ warn: true, title: '자산 규격 · 초기값' }, '로고는 가로형 SVG 또는 배경이 투명한 PNG(높이 80 px 이상, 1MB 이하), 파비콘은 512 × 512 PNG 한 장만 받아 나머지 크기는 자동으로 만듭니다. 설치 직후에는 로고 없음(상호 글자로 대신 표시) · 대표색 #2B2B31 · SNS 전부 꺼짐 · 상단 띠 꺼짐입니다.'),
    Canvas({ label: 'A-60 · 기본 (이너에라 값이 들어간 모습)' }, full()),
    Canvas({ label: 'A-60 · 설치 직후 빈 상태 (로고 없음 · SNS 꺼짐 · 띠 꺼짐)' }, Page({}, logoBox({ empty: true }), snsBox({ empty: true }), bandBox({ empty: true }), SaveBar())),
    CanvasRow(
        Canvas({ size: 'auto', label: '대표색 · 색 고르기 버튼 → 색 선택 창', right: '부분', pad: 20 }, `<div style="width:640px">${colorBox({ picker: true })}</div>${Picker}`),
        Canvas({ size: 'auto', label: '입력 오류 · 색 값 형식이 틀림', right: '부분', pad: 20 }, `<div style="width:640px">${colorBox({ hex: '7A1F2', hexError: true })}</div>`),
    ),
    Canvas({ label: 'A-60 · 저장 버튼 → 오류가 있어 저장되지 않음 (로고 확장자 · 유튜브 주소)' }, Page({}, Note('고칠 곳이 2군데 있습니다. 로고 파일 · 유튜브 주소를 확인해 주세요.', { warn: true }), logoBox({ error: true }), snsBox({ snsError: true }), SaveBar({ dirty: true }))),
    Canvas({ label: 'A-60 · 저장 완료 토스트' }, Overlay({ bg: full(), dim: false, align: 'top', h: 360 }, Toast('사이트 기본 설정을 저장했습니다. 쇼핑몰에 바로 반영됐습니다.', { action: '내 쇼핑몰 보기' }))),
    Canvas({ label: 'A-60 · 저장하지 않고 다른 메뉴를 눌렀을 때' }, Overlay({ bg: full({ dirty: true }), h: 380 }, Confirm({ w: 400, title: '저장하지 않은 변경이 있습니다', desc: '대표색 · 상단 띠 문구를 바꾸고 저장하지 않았습니다. 이대로 나가면 바꾼 내용이 사라집니다.', foot: [Btn('계속 편집'), Btn('저장하지 않고 나가기', 'danger'), Btn('저장하고 나가기', 'primary')] }))),
);

const PreviewPc = (o = {}) => `<div style="border:1px solid var(--line);border-radius:4px;overflow:hidden"><div style="zoom:.76">${UserHeader({ band: o.band === false ? false : BAND })}<div style="padding:28px 40px">${Img({ h: 220, label: '메인 화면 첫 배너 (디자인 > 메인 화면 구성에서 관리)' })}<div style="display:flex;gap:10px;margin-top:20px;align-items:center">${Btn('구매하기', { kind: 'primary', size: 'lg' })}${Btn('장바구니', { size: 'lg' })}${Badge('무료배송', 'bold')}<u>자세히 보기</u></div></div>${UserFooter()}<div style="background:var(--box);padding:0 40px 24px;display:flex;gap:14px;font-size:20px;color:var(--ink2)">${Icon('camera-o')}${Icon('kakaotalk')}<span style="font-size:12.5px;color:var(--mute)">인스타그램 · 카카오톡 채널 (켜 둔 SNS 만)</span></div></div></div>`;

const PreviewMobile = (o = {}) => `<div style="border:1px solid var(--line)">${o.band === false ? '' : `<div class="u-band" style="font-size:11.5px">${BAND}</div>`}${MobilePage({ tab: '홈' }, `<div style="padding:16px">${Img({ h: 300, label: '첫 배너 (모바일 750 × 900)' })}<div style="margin-top:14px">${Btn('구매하기', { kind: 'primary', block: true, size: 'lg' })}</div></div>`)}</div>`;

const state2 = StateBlock({ idx: 2, title: '미리보기', note: '저장하기 전에 바꾼 로고·색·띠 문구가 실제 화면에서 어떻게 보이는지 확인합니다. 미리보기 버튼을 누르면 설정 화면 오른쪽에서 큰 창으로 열립니다.' },
    Anno({ title: '왜 이렇게 하나' }, '색 값만 보고는 버튼이 어떻게 보일지 알 수 없습니다. 저장 전에 머리·버튼·바닥글이 들어간 실제 틀로 보여 주고, PC 와 모바일을 탭으로 바꿔 봅니다. 미리보기는 운영자 화면에서만 보이고 고객에게는 저장을 눌러야 반영됩니다.'),
    Canvas({ label: 'A-60 · 미리보기 버튼 → 미리보기 창 · PC 탭' }, Overlay({ bg: full({ dirty: true }), h: 900 },
        Modal({ title: '미리보기 · 아직 저장하지 않은 변경 2건 포함', w: 1080, foot: [Btn('닫고 계속 편집'), Btn('이대로 저장', 'primary')] },
            Flex({ justify: 'space-between', align: 'center' }, Tabs([{ t: 'PC' }, { t: '모바일' }], 'PC', { kind: 'pill' }), Text('바뀐 곳: 대표색 #2B2B31 → #7A1F2B · 상단 띠 문구', { sm: true, mute: true })),
            PreviewPc(),
        ))),
    CanvasRow(
        Canvas({ size: 'mobile', label: '미리보기 창 · 모바일 탭 (띠 문구가 길어 흐르는 모습)' }, PreviewMobile()),
        Canvas({ size: 'mobile', label: '미리보기 · 로고를 안 올렸을 때 (상호 글자) · 띠 꺼짐' }, `<div style="border:1px solid var(--line)"><div class="m-header">${Icon('bars')}<b style="font-size:16px">${SHOP.name} ${SHOP.nameEn}</b><span class="r">${Icon('search')}${Icon('cart-o')}</span></div><div style="padding:16px">${Img({ h: 300, label: '첫 배너 (모바일 750 × 900)' })}<div style="margin-top:14px">${Btn('구매하기', { kind: 'primary', block: true, size: 'lg' })}</div>${Note('로고 파일이 없으면 설정 > 쇼핑몰 정보의 상호가 글자로 나옵니다.')}</div></div>`),
    ),
);

export default function A60() {
    return [state1, state2].join('');
}
