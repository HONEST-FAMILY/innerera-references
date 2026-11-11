import {
    Canvas, CanvasRow, StateBlock, Anno, UserPage, MobilePage, Btn, Badge, Input, Select, Table, Pager, Empty, Note, Text, Icon, Flex, Img, Chips,
} from '../lib/blocks.js';

const CATS = ['전체', '안내', '배송', '이벤트'];
const NOTICES = [
    { pin: true, cat: '배송', t: '11월 택배 물량 증가에 따른 배송 지연 안내', d: '2026-11-09', isNew: true },
    { pin: true, cat: '안내', t: '개인정보처리방침 개정 안내 (2026-12-01 시행)', d: '2026-11-02' },
    { no: 14, cat: '이벤트', t: '포토 리뷰 작성 시 적립금 1,000원 지급 안내', d: '2026-11-10', isNew: true, clip: true },
    { no: 13, cat: '안내', t: '고객센터 운영 시간 변경 안내 (평일 10:00 ~ 17:00)', d: '2026-11-04' },
    { no: 12, cat: '배송', t: '제주·도서산간 지역 추가 배송비 안내', d: '2026-10-27' },
    { no: 11, cat: '안내', t: '추석 연휴 배송·고객센터 휴무 안내', d: '2026-09-18' },
    { no: 10, cat: '이벤트', t: '신규 가입 3,000원 쿠폰 지급 안내', d: '2026-09-01' },
    { no: 9, cat: '안내', t: '이너에라 공식몰 오픈 안내', d: '2026-08-20' },
];

const title = (n) => `${n.pin ? `${Badge('공지', 'solid')} ` : ''}<span style="color:var(--mute);font-size:12.5px">[${n.cat}]</span> ${n.pin ? `<b>${n.t}</b>` : n.t}${n.clip ? ` ${Icon('paperclip')}` : ''}${n.isNew ? ` ${Badge('새 글', 'bold')}` : ''}`;
const SearchRow = (q = '') => Flex({ justify: 'space-between', align: 'center' }, Chips(CATS, '전체'),
    Flex({ gap: 6 }, Select({ value: '제목 + 내용', w: 130 }), Input({ value: q, placeholder: '공지 검색', icon: 'search', w: 240 }), Btn('검색')));
const List = (rows) => Table({ cols: [{ t: '번호', w: 70, align: 'center' }, '제목', { t: '등록일', w: 120, align: 'center' }], rows: rows.map((n) => ({ hl: n.pin, c: [n.pin ? Icon('bookmark-o') : n.no, title(n), n.d] })) });
const Page = (...body) => UserPage({ active: '고객센터', crumb: ['홈', '고객센터', '공지사항'], title: '공지사항' }, body);
const gap = '<div style="height:14px"></div>';

const mItem = (n) => `<div style="padding:13px 0;border-bottom:1px solid var(--line2);${n.pin ? 'background:var(--box);margin:0 -16px;padding:13px 16px;' : ''}"><div style="font-size:14px;line-height:1.5">${title(n)}</div><div style="font-size:12px;color:var(--mute);margin-top:3px">${n.d}</div></div>`;

const state1 = StateBlock({ idx: 1, title: '목록(상단 고정)', note: '바닥글·고객센터 메뉴에서 들어옵니다. 상단 고정 글이 맨 위에 채움 줄로, 그 아래 최신순.' },
    Anno({ title: '왜 이렇게 하나' }, '배송 지연·약관 개정처럼 모든 고객이 봐야 하는 글은 새 글에 밀려 내려가면 안 됩니다. 운영자가 관리자 고객응대 > 공지사항·FAQ에서 "상단 고정"과 노출 기간을 정하면, 기간이 끝난 고정 글은 자동으로 일반 글 자리로 내려갑니다. 등록 후 7일 안의 글에는 새 글 표시가 붙습니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '상단 고정 글은 페이지를 넘겨도 계속 맨 위에 나옵니다(최대 5개). 분류(안내·배송·이벤트)는 관리자가 이름과 순서를 바꿀 수 있고 분류가 1개뿐이면 분류 칩이 사라집니다. 로그인 없이 볼 수 있습니다.'),
    Canvas({ label: 'U-24 · 공지사항 목록 · 고정 2건 + 일반 글' }, Page(SearchRow(), gap, List(NOTICES), Pager({ page: 1, last: 2 }))),
    Canvas({ label: 'U-24 · "배송"으로 검색 → 결과 3건 (고정 글도 조건에 맞는 것만)' }, Page(SearchRow('배송'), gap,
        Text('"배송" 검색 결과 <b>3</b>건 · <u>검색 지우기</u>', { sm: true }), List(NOTICES.filter((n) => n.t.includes('배송'))), Pager({ page: 1, last: 1 }))),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-24 · 모바일 목록 (표 대신 줄 목록)' }, MobilePage({ title: '공지사항', tab: false },
            Input({ placeholder: '공지 검색', icon: 'search', w: '100%' }), '<div style="height:10px"></div>', Chips(CATS, '전체'), '<div style="height:6px"></div>',
            NOTICES.slice(0, 6).map(mItem), '<div style="height:14px"></div>', Btn('더 보기 (6 / 14)', { block: true }))),
        Canvas({ size: 'auto', label: '검색 조건 목록 열림', right: '부분', pad: 20 }, Select({ value: '제목 + 내용', open: true, w: 160, options: [{ t: '제목 + 내용', on: true }, '제목', '내용'] })),
    ),
);

const Detail = (o = {}) => `
<div style="border-top:2px solid var(--dark)">
  <div style="padding:20px 4px;border-bottom:1px solid var(--line)"><div style="font-size:12.5px;color:var(--mute);margin-bottom:6px">${Badge('공지', 'solid')} [배송]</div><b style="font-size:20px">11월 택배 물량 증가에 따른 배송 지연 안내</b><div style="font-size:12.5px;color:var(--mute);margin-top:8px">2026-11-09 · 이너에라</div></div>
  <div style="padding:28px 4px;font-size:14.5px;line-height:1.9;border-bottom:1px solid var(--line)">
    안녕하세요, 이너에라입니다.<br><br>
    11월 대형 할인 행사 기간에 택배 물량이 크게 늘어 일부 지역의 배송이 평소보다 1~2일 늦어지고 있습니다.<br><br>
    <b>배송 지연 예상 기간</b> 2026년 11월 9일(월) ~ 11월 20일(금)<br>
    <b>평소 배송 기간</b> 결제 완료 후 영업일 1~2일 → <b>지연 기간</b> 영업일 2~4일<br>
    <b>택배사</b> CJ대한통운<br><br>
    주문하신 상품의 위치는 마이페이지 &gt; 주문 목록 &gt; 배송 조회에서 확인하실 수 있습니다. 발송이 늦어지는 주문은 알림톡으로 따로 안내드리겠습니다.<br><br>
    기다려 주셔서 감사합니다.
    ${o.mobile ? '' : `<div style="margin-top:20px;max-width:640px">${Img({ h: 220, label: '본문에 넣은 이미지 · 가로 최대 860 px 로 줄여 표시 · JPG · PNG · WEBP · 장당 5MB 이하' })}</div>`}
  </div>
  <div style="padding:14px 4px;border-bottom:1px solid var(--line);font-size:13px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span style="color:var(--mute)">첨부 파일</span>${Icon('paperclip')}<u>11월_지역별_배송_지연_안내.pdf</u><span style="color:var(--mute)">312KB</span>${Icon('download')}</div>
  <div style="font-size:13.5px">
    <div style="display:flex;gap:16px;padding:13px 4px;border-bottom:1px solid var(--line2)"><span style="color:var(--mute);width:60px;flex:none">${Icon('angle-up-min')} 다음 글</span><span>포토 리뷰 작성 시 적립금 1,000원 지급 안내</span></div>
    <div style="display:flex;gap:16px;padding:13px 4px;border-bottom:1px solid var(--line)"><span style="color:var(--mute);width:60px;flex:none">${Icon('angle-down-min')} 이전 글</span><span>고객센터 운영 시간 변경 안내 (평일 10:00 ~ 17:00)</span></div>
  </div>
  <div style="display:flex;justify-content:center;margin-top:24px">${Btn('목록으로', { w: 160 })}</div>
</div>`;

const state2 = StateBlock({ idx: 2, title: '상세', note: '목록에서 제목을 눌렀을 때. 본문은 관리자 에디터에서 쓴 글·이미지·표가 그대로 나옵니다.' },
    Anno({ title: '왜 이렇게 하나' }, '공지 주소(/notice/14)는 알림톡·메인 띠 배너에서 바로 연결하는 일이 많아 상세 하나만 봐도 분류·날짜·첨부가 다 보여야 합니다. 이전 글·다음 글은 목록으로 돌아가지 않고 이어 읽게 합니다. "목록으로"는 보던 페이지·검색 조건을 그대로 되살립니다.'),
    Anno({ warn: true, title: '놓치면 안 되는 것' }, '첨부 파일은 관리자가 올린 것만(파일당 10MB, 최대 5개, PDF·JPG·PNG·XLSX·HWP·ZIP). 본문 이미지는 장당 5MB 이하, 가로 860 px 를 넘으면 줄여 보여 줍니다. 노출 기간이 끝났거나 삭제된 글 주소로 들어오면 아래 "없는 글" 화면이 나옵니다.'),
    Canvas({ label: 'U-24 · 공지 상세 (고정 글 · 첨부 1개)' }, UserPage({ active: '고객센터', crumb: ['홈', '고객센터', '공지사항'], title: '공지사항' }, Detail())),
    CanvasRow(
        Canvas({ size: 'mobile', label: 'U-24 · 모바일 상세' }, MobilePage({ title: '공지사항', tab: false }, Detail({ mobile: true }))),
        Canvas({ size: 'mobile', label: 'U-24 · 모바일 · 내려갔거나 삭제된 글 주소' }, MobilePage({ title: '공지사항', tab: false },
            Empty({ icon: 'error-o', title: '지금은 볼 수 없는 공지입니다', desc: '게시 기간이 끝났거나 삭제된 글입니다.', action: '공지사항 목록으로' }))),
    ),
);

const state3 = StateBlock({ idx: 3, title: '없음', note: '등록된 공지가 하나도 없는 몰(오픈 직후), 그리고 검색 결과가 없을 때.' },
    Anno({ title: '왜 이렇게 하나' }, '공지가 없는 것과 검색 결과가 없는 것은 다음 행동이 다릅니다. 글이 아예 없으면 검색칸·분류 칩을 숨기고 홈으로 보내고, 검색 결과가 없으면 검색어를 남긴 채 지우기 버튼을 줍니다.'),
    Canvas({ label: 'U-24 · 등록된 공지 없음' }, Page(Empty({ icon: 'bell-o', title: '등록된 공지사항이 없습니다', desc: '새 소식이 생기면 이곳에 올리겠습니다.', action: '홈으로' }))),
    Canvas({ label: 'U-24 · "환불 지연"으로 검색 → 결과 없음' }, Page(SearchRow('환불 지연'), gap,
        Empty({ icon: 'search', title: '"환불 지연"에 맞는 공지가 없습니다', desc: '다른 낱말로 검색하거나, 궁금한 점은 자주 묻는 질문에서 찾아보세요.', action: Flex({ gap: 8, justify: 'center' }, Btn('검색 지우기'), Btn('자주 묻는 질문 보기', 'primary')) }))),
    Canvas({ size: 'mobile', label: 'U-24 · 모바일 없음' }, MobilePage({ title: '공지사항', tab: false }, Empty({ icon: 'bell-o', title: '등록된 공지사항이 없습니다', desc: '새 소식이 생기면 이곳에 올리겠습니다.', action: '홈으로' }))),
);

export default function U24() {
    return [state1, state2, state3].join('');
}
