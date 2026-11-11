import { GROUPS, PAGES } from './meta.js';

const j = (...c) => c.flat(Infinity).filter((x) => x !== false && x !== null && x !== undefined).join('');
const px = (v) => (typeof v === 'number' ? `${v}px` : v);
const st = (o) => {
    const s = Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}:${px(v)}`).join(';');
    return s ? ` style="${s}"` : '';
};

export const SHOP = {
    name: '이너에라',
    nameEn: 'Inner:Era',
    ceo: '이보림',
    bizNo: '384-17-02845',
    addr: '인천광역시 제물포구 방축로83번길 23, B동 3층 305호',
    product: '이너에라 롱지비티 석류맛 젤리스틱 20 g × 14포',
    productShort: '롱지비티 석류맛 젤리스틱',
    options: [
        { name: '1박스(14일분)', price: '49,000원(예시)' },
        { name: '2박스(28일분)', price: '93,000원(예시)' },
        { name: '4박스(56일분)', price: '176,000원(예시)' },
    ],
    people: ['김민지', '박서준', '이하은', '최도윤', '정수아', '강지호', '윤서연', '임재현'],
    phone: '010-****-1234',
    couriers: ['CJ대한통운', '한진택배', '롯데택배', '우체국택배', '로젠택배'],
};

export const ORDER_STATUS = {
    입금대기: 'dash', 결제완료: 'bold', 배송준비: 'fill', 배송중: 'solid', 배송완료: 'check', 구매확정: 'mute',
    취소요청: 'dot', 취소완료: 'strike', 반품요청: 'dot', 수거중: 'dot', 수거완료: 'dot', 반품완료: 'strike',
    교환요청: 'dot', 재발송: 'solid', 교환완료: 'check', 거부: 'x', 발송지연: 'warn',
};

export const Icon = (name, cls = '') => `<i class="xi-${name}${cls ? ` ${cls}` : ''}"></i>`;

export const Canvas = (o = {}, ...body) => `
<div class="wf-scroll"><div class="wf-canvas ${o.size || 'pc'}">
  ${o.label || o.right ? `<div class="wf-canvas-label"><span>${o.label || ''}</span><span>${o.right || (o.size === 'mobile' ? '모바일 390' : 'PC 1280')}</span></div>` : ''}
  <div class="wf-canvas-body"${st({ 'min-height': o.h, padding: o.pad })}>${j(body)}</div>
</div></div>`;

export const CanvasRow = (...canvases) => `<div class="wf-canvas-row">${j(canvases)}</div>`;

export const StateBlock = (o = {}, ...body) => `
<section class="wf-state-block" id="s${o.idx}">
  <h3 class="wf-state-title"><span class="idx">${o.idx}</span>${o.title}</h3>
  ${o.note ? `<p class="wf-state-note">${o.note}</p>` : ''}
  ${j(body)}
</section>`;

export const Anno = (o, ...body) => {
    const opt = typeof o === 'string' ? {} : o || {};
    const content = typeof o === 'string' ? j(o, body) : j(body);
    return `<div class="wf-anno${opt.warn ? ' warn' : ''}">${Icon(opt.warn ? 'warning' : 'lightbulb-o')}<div>${opt.title ? `<b>${opt.title}</b><br>` : ''}${content}</div></div>`;
};

export const Img = (o = {}) => `<div class="wf-img${o.round ? ' round' : ''}"${st({ width: o.w, height: o.h, 'aspect-ratio': o.ratio })}>${Icon(o.icon || 'image-o')}${o.label ? `<span>${o.label}</span>` : ''}</div>`;
export const Thumb = (size = 56, label = '') => `<div class="wf-img thumb"${st({ width: size, height: size })}>${Icon('image-o')}${label ? `<span>${label}</span>` : ''}</div>`;

export const Btn = (label, o = {}) => {
    const opt = typeof o === 'string' ? { kind: o } : o;
    const cls = ['wf-btn', opt.kind || 'line', opt.size, opt.block && 'block', opt.disabled && 'disabled'].filter(Boolean).join(' ');
    return `<span class="${cls}"${st({ width: opt.w })}>${opt.icon ? Icon(opt.icon) : ''}${label}${opt.iconRight ? Icon(opt.iconRight) : ''}</span>`;
};
export const BtnRow = (o, ...btns) => {
    const opt = typeof o === 'string' ? {} : o || {};
    const items = typeof o === 'string' ? [o, ...btns] : btns;
    return `<div class="wf-btnrow ${opt.align || ''}">${j(items)}</div>`;
};

export const Badge = (label, kind = 'line') => {
    const pre = { check: Icon('check-min'), x: Icon('close-min'), warn: Icon('warning') }[kind] || '';
    return `<span class="wf-badge ${kind}">${pre}${label}</span>`;
};
export const OrderBadge = (status) => Badge(status, ORDER_STATUS[status] || 'line');
export const ChannelBadge = (channel) => `<span class="wf-channel ${channel === '스마트스토어' ? 'ss' : 'own'}">${channel === '스마트스토어' ? Icon('naver-square') : Icon('shop')}${channel}</span>`;

export const Chip = (label, o = {}) => `<span class="wf-chip${o.on ? ' on' : ''}">${o.icon ? Icon(o.icon) : ''}${label}${o.close ? Icon('close-min') : ''}</span>`;
export const Chips = (list, active, o = {}) => `<div class="wf-chips">${list.map((c) => Chip(c, { on: c === active, close: o.close })).join('')}</div>`;

export const Input = (o = {}) => {
    const opt = typeof o === 'string' ? { value: o } : o;
    const cls = ['wf-input', opt.error && 'error', opt.disabled && 'disabled', opt.focus && 'focus'].filter(Boolean).join(' ');
    const text = opt.value ? `<span class="v">${opt.value}</span>` : `<span class="ph">${opt.placeholder || ''}</span>`;
    return `<span class="${cls}"${st({ width: opt.w })}>${opt.icon ? Icon(opt.icon) : ''}${text}${opt.suffix ? `<span class="suf">${opt.suffix}</span>` : ''}</span>`;
};
export const Textarea = (o = {}) => `<div class="wf-textarea${o.error ? ' error' : ''}"${st({ height: o.h || 96, width: o.w })}>${o.value ? `<span class="v">${o.value}</span>` : `<span class="ph">${o.placeholder || ''}</span>`}${o.count ? `<span class="cnt">${o.count}</span>` : ''}</div>`;
export const Select = (o = {}) => {
    const opt = typeof o === 'string' ? { value: o } : o;
    const head = `<span class="wf-input select${opt.error ? ' error' : ''}${opt.disabled ? ' disabled' : ''}${opt.open ? ' focus' : ''}"${st({ width: opt.w })}>${opt.value ? `<span class="v">${opt.value}</span>` : `<span class="ph">${opt.placeholder || '선택'}</span>`}${Icon(opt.open ? 'angle-up-min' : 'angle-down-min')}</span>`;
    if (!opt.open) return head;
    const list = (opt.options || []).map((it) => {
        const item = typeof it === 'string' ? { t: it } : it;
        return `<li class="${item.on ? 'on' : ''}${item.disabled ? ' disabled' : ''}">${item.t}${item.sub ? `<em>${item.sub}</em>` : ''}${item.on ? Icon('check-min') : ''}</li>`;
    }).join('');
    return `<span class="wf-select-open"${st({ width: opt.w })}>${head}<span class="wf-select-list">${opt.search !== undefined ? `<span class="wf-select-search">${Icon('search')}${opt.search || '<span class="ph">이름으로 찾기</span>'}</span>` : ''}<ul>${list}</ul></span></span>`;
};
export const Check = (label = '', o = {}) => `<span class="wf-check${o.on ? ' on' : ''}${o.disabled ? ' disabled' : ''}${o.part ? ' part' : ''}"><span class="box">${o.on ? Icon('check-min') : o.part ? Icon('minus-min') : ''}</span>${label}</span>`;
export const Radio = (label = '', o = {}) => `<span class="wf-radio${o.on ? ' on' : ''}${o.disabled ? ' disabled' : ''}"><span class="dot"></span>${label}</span>`;
export const RadioGroup = (list, active) => `<div class="wf-inline">${list.map((l) => Radio(l, { on: l === active })).join('')}</div>`;
export const CheckGroup = (list, actives = []) => `<div class="wf-inline">${list.map((l) => Check(l, { on: actives.includes(l) })).join('')}</div>`;
export const Toggle = (label = '', o = {}) => `<span class="wf-toggle${o.on ? ' on' : ''}${o.disabled ? ' disabled' : ''}"><span class="track"><span class="knob"></span></span>${label}</span>`;
export const Qty = (n = 1, o = {}) => `<span class="wf-qty${o.disabled ? ' disabled' : ''}"><span>${Icon('minus-min')}</span><b>${n}</b><span>${Icon('plus-min')}</span></span>`;
export const Field = (o = {}, ...control) => `
<div class="wf-field${o.row ? ' row' : ''}">
  <label>${o.label || ''}${o.required ? '<em class="req">필수</em>' : ''}</label>
  <div class="ctl">${j(control)}${o.help ? `<p class="help">${o.help}</p>` : ''}${o.error ? `<p class="err">${Icon('error-o')}${o.error}</p>` : ''}</div>
</div>`;
export const FormTable = (rows) => `<div class="wf-formtable">${rows.map((r) => `<div class="tr"><div class="th">${r.k}${r.required ? '<em class="req">필수</em>' : ''}</div><div class="td">${j(r.v)}${r.help ? `<p class="help">${r.help}</p>` : ''}${r.error ? `<p class="err">${Icon('error-o')}${r.error}</p>` : ''}</div></div>`).join('')}</div>`;

export const Period = (o = {}) => `<span class="wf-period">${['오늘', '7일', '1개월', '3개월'].map((p) => `<span class="wf-btn sm ${p === (o.preset || '7일') ? 'primary' : 'line'}">${p}</span>`).join('')}${Input({ value: o.from || '2026-11-05', icon: 'calendar', w: 140 })}<span class="tilde">~</span>${Input({ value: o.to || '2026-11-11', icon: 'calendar', w: 140 })}</span>`;

export const Filters = (o = {}) => {
    const open = o.open !== false;
    const rows = (o.rows || []).map((r) => `<div class="fr"><div class="fk">${r.k}</div><div class="fv">${j(r.v)}</div></div>`).join('');
    return `
<div class="wf-filters${open ? '' : ' closed'}">
  <div class="fhead"><b>${o.title || '검색 조건'}</b>${o.summary ? `<span class="sum">${o.summary}</span>` : ''}<span class="tg">${open ? '접기' : '펼치기'}${Icon(open ? 'angle-up-min' : 'angle-down-min')}</span></div>
  ${open ? `<div class="fbody">${rows}</div><div class="ffoot">${o.actions || j(Btn('검색', { kind: 'primary', icon: 'search' }), Btn('초기화', { icon: 'refresh' }))}</div>` : ''}
</div>`;
};

export const ListHead = (o = {}) => `<div class="wf-listhead"><div class="l">${o.total !== undefined ? `<span class="total">총 <b>${o.total}</b>건</span>` : ''}${j(o.left)}</div><div class="r">${j(o.right)}</div></div>`;
export const PerPage = (active = 50) => Select({ value: `${active}개씩 보기`, w: 130 });

export const BulkBar = (o = {}, ...btns) => `<div class="wf-bulk">${Icon('check-circle-o')}<span class="cnt">선택 <b>${o.count}</b>건${o.sub ? ` <em>${o.sub}</em>` : ''}</span><span class="acts">${j(btns)}</span><span class="clear">선택 해제${Icon('close-min')}</span></div>`;

export const Table = (o = {}) => {
    const cols = (o.cols || []).map((c) => (typeof c === 'string' ? { t: c } : c));
    const checked = o.checked || [];
    const all = o.rows && o.rows.length && checked.length === o.rows.filter((r) => !r.group).length;
    const head = `${o.check ? `<th class="ck">${Check('', { on: all, part: !all && checked.length > 0 })}</th>` : ''}${cols.map((c) => `<th${st({ width: c.w, 'text-align': c.align })}>${c.t}${c.sort ? Icon(c.sort === 'asc' ? 'caret-up-min' : 'caret-down-min', 'sort') : ''}</th>`).join('')}`;
    const span = cols.length + (o.check ? 1 : 0);
    let n = -1;
    const body = (o.rows || []).map((r) => {
        const row = Array.isArray(r) ? { c: r } : r;
        if (row.group) return `<tr class="grp"><td colspan="${span}">${row.group}</td></tr>`;
        n += 1;
        const on = checked.includes(n) || row.on;
        const cls = [row.hl && 'hl', on && 'on', row.dim && 'dim', row.tied && 'tied'].filter(Boolean).join(' ');
        return `<tr class="${cls}">${o.check ? `<td class="ck">${row.nocheck ? '' : Check('', { on })}</td>` : ''}${row.c.map((cell, i) => `<td${st({ 'text-align': cols[i] && cols[i].align })}>${cell}</td>`).join('')}</tr>`;
    }).join('');
    const empty = !o.rows || !o.rows.length ? `<tr><td colspan="${span}" class="emptycell">${o.empty || '조건에 맞는 내역이 없습니다.'}</td></tr>` : '';
    const foot = o.foot ? `<tfoot><tr>${o.check ? '<td></td>' : ''}${o.foot.map((c, i) => `<td${st({ 'text-align': cols[i] && cols[i].align })}>${c}</td>`).join('')}</tr></tfoot>` : '';
    return `<div class="wf-tablewrap"><table class="wf-table${o.dense ? ' dense' : ''}"><thead><tr>${head}</tr></thead><tbody>${body}${empty}</tbody>${foot}</table></div>`;
};

export const Pager = (o = {}) => {
    const page = o.page || 1;
    const last = o.last || 5;
    const nums = Array.from({ length: Math.min(last, 5) }, (_, i) => i + 1);
    return `<div class="wf-pager"><span class="pg">${Icon('angle-left-min')}</span>${nums.map((x) => `<span class="pg${x === page ? ' on' : ''}">${x}</span>`).join('')}${last > 5 ? `<span class="pg gap">${Icon('ellipsis-h')}</span><span class="pg">${last}</span>` : ''}<span class="pg">${Icon('angle-right-min')}</span>${o.per ? `<span class="per">${[50, 100, 500].map((x) => `<span class="${x === o.per ? 'on' : ''}">${x}개씩</span>`).join('')}</span>` : ''}</div>`;
};

export const Tabs = (list, active, o = {}) => `<div class="wf-tabs ${o.kind || ''}">${list.map((it) => {
    const item = typeof it === 'string' ? { t: it } : it;
    return `<span class="tab${item.t === active ? ' on' : ''}">${item.t}${item.n !== undefined ? `<em>${item.n}</em>` : ''}</span>`;
}).join('')}</div>`;

export const Stepper = (steps, current = 0) => `<div class="wf-stepper">${steps.map((s, i) => `<div class="step${i < current ? ' done' : ''}${i === current ? ' on' : ''}"><span class="n">${i < current ? Icon('check-min') : i + 1}</span><span class="t">${s}</span></div>`).join('<span class="bar"></span>')}</div>`;
export const Timeline = (items) => `<ul class="wf-timeline">${items.map((it) => `<li class="${it.on ? 'on' : ''}"><span class="pt"></span><div><b>${it.t}</b>${it.d ? `<p>${it.d}</p>` : ''}</div><time>${it.time || ''}</time></li>`).join('')}</ul>`;

export const Overlay = (o = {}, float) => `
<div class="wf-ov ${o.align || 'center'}${o.dim === false ? ' nodim' : ''}">
  <div class="wf-ov-bg">${j(o.bg)}</div>
  ${o.dim === false ? '' : '<div class="wf-ov-dim"></div>'}
  <div class="wf-ov-float"${st({ 'min-height': o.h || 520 })}>${float}</div>
</div>`;
export const Modal = (o = {}, ...body) => `
<div class="wf-modal"${st({ width: o.w || 480 })}>
  <div class="mh"><b>${o.title || ''}</b>${Icon('close')}</div>
  <div class="mb">${j(body)}</div>
  ${o.foot ? `<div class="mf">${j(o.foot)}</div>` : ''}
</div>`;
export const Confirm = (o = {}) => `
<div class="wf-modal confirm"${st({ width: o.w || 360 })}>
  <div class="mb"><b class="ct">${o.title}</b>${o.desc ? `<p>${o.desc}</p>` : ''}</div>
  <div class="mf">${j(o.foot || [Btn('취소'), Btn(o.ok || '확인', { kind: o.danger ? 'danger' : 'primary' })])}</div>
</div>`;
export const SideDrawer = (o = {}, ...body) => `
<div class="wf-sidedrawer"${st({ width: o.w || 560 })}>
  <div class="mh"><b>${o.title || ''}</b>${o.sub ? `<span class="sub">${o.sub}</span>` : ''}${Icon('close')}</div>
  <div class="mb">${j(body)}</div>
  ${o.foot ? `<div class="mf">${j(o.foot)}</div>` : ''}
</div>`;
export const BottomSheet = (o = {}, ...body) => `
<div class="wf-sheet">
  <div class="grip"></div>
  ${o.title ? `<div class="mh"><b>${o.title}</b>${Icon('close')}</div>` : ''}
  <div class="mb">${j(body)}</div>
  ${o.foot ? `<div class="mf">${j(o.foot)}</div>` : ''}
</div>`;
export const Toast = (text, o = {}) => `<div class="wf-toast${o.kind ? ` ${o.kind}` : ''}">${Icon(o.icon || (o.kind === 'error' ? 'error-o' : 'check-circle-o'))}<span>${text}</span>${o.action ? `<u>${o.action}</u>` : ''}</div>`;

export const Empty = (o = {}) => `<div class="wf-empty">${Icon(o.icon || 'file-text-o')}<b>${o.title}</b>${o.desc ? `<p>${o.desc}</p>` : ''}${o.action ? `<div class="act">${typeof o.action === 'string' && !o.action.startsWith('<') ? Btn(o.action, 'primary') : j(o.action)}</div>` : ''}</div>`;

export const Upload = (o = {}) => `
<div class="wf-upload"${st({ width: o.w })}>
  <div class="drop">${Icon(o.icon || 'cloud-upload-o')}<b>${o.title || '파일을 끌어다 놓거나 눌러서 고르기'}</b>${o.button !== false ? Btn(o.button || '파일 고르기', { size: 'sm' }) : ''}</div>
  ${o.guide ? `<ul class="guide">${o.guide.map((g) => `<li>${g}</li>`).join('')}</ul>` : ''}
  ${(o.files || []).map((f) => `<div class="file">${Icon(f.icon || 'file-o')}<span class="nm">${f.name}</span><span class="sz">${f.size || ''}</span>${f.error ? `<span class="fe">${f.error}</span>` : ''}${Icon('close-min')}</div>`).join('')}
</div>`;
export const ImageGuide = (o = {}) => [`권장 크기 ${o.size || '1000 × 1000 px'}`, `비율 ${o.ratio || '1:1'}`, `용량 ${o.max || '5MB 이하'}`, `확장자 ${o.ext || 'JPG · PNG · WEBP'}`].concat(o.more || []);

export const ExcelResult = (o = {}) => `
<div class="wf-excel">
  <div class="sumrow"><div class="s"><span>전체</span><b>${o.total}행</b></div><div class="s ok">${Icon('check-circle-o')}<span>성공</span><b>${o.ok}행</b></div><div class="s fail">${Icon('error-o')}<span>오류</span><b>${o.fail}행</b></div></div>
  ${o.rows && o.rows.length ? Table({ dense: true, cols: [{ t: '엑셀 행', w: 70 }, { t: o.keyLabel || '주문번호', w: 170 }, { t: '입력한 값', w: 170 }, '오류 사유'], rows: o.rows.map((r) => ({ hl: true, c: [`${r.row}행`, r.key, r.value || '-', `${Icon('error-o')} ${r.reason}`] })) }) : ''}
  ${o.note ? `<p class="note">${o.note}</p>` : ''}
</div>`;

export const ProductCard = (o = {}) => `
<div class="wf-pcard${o.soldout ? ' soldout' : ''}">
  <div class="pimg">${Img({ ratio: '1/1', label: o.imgLabel || '상품 대표 이미지' })}${o.soldout ? '<span class="so">품절</span>' : ''}${o.heart !== false ? `<span class="hb">${Icon(o.liked ? 'heart' : 'heart-o')}</span>` : ''}</div>
  ${o.badge ? `<div class="pb">${[].concat(o.badge).map((b) => Badge(b, 'line')).join('')}</div>` : ''}
  <div class="pn">${o.name || SHOP.product}</div>
  ${o.desc ? `<div class="pd">${o.desc}</div>` : ''}
  <div class="pp">${o.rate ? `<em>${o.rate}</em>` : ''}<b>${o.price || SHOP.options[0].price}</b>${o.orig ? `<s>${o.orig}</s>` : ''}</div>
  ${o.reviews !== undefined ? `<div class="pr">${Icon('star')}${o.rating || '4.8'} <span>리뷰 ${o.reviews}</span></div>` : ''}
</div>`;
export const ProductGrid = (cards, cols = 4) => `<div class="wf-grid"${st({ 'grid-template-columns': `repeat(${cols}, minmax(0, 1fr))` })}>${j(cards)}</div>`;
export const ProductRow = (o = {}) => `<div class="wf-prow">${Thumb(o.size || 56)}<div class="pi"><b>${o.name || SHOP.product}</b><span>${o.option || SHOP.options[0].name}${o.qty ? ` · ${o.qty}개` : ''}</span>${o.extra ? `<span>${o.extra}</span>` : ''}</div>${o.price ? `<div class="pv">${o.price}</div>` : ''}${o.right || ''}</div>`;

export const PriceSummary = (o = {}) => `
<div class="wf-price">
  ${o.title ? `<b class="pt">${o.title}</b>` : ''}
  ${(o.rows || []).map(([k, v, sub]) => `<div class="r"><span>${k}</span><span>${v}</span></div>${sub ? `<div class="r sub"><span>${sub}</span></div>` : ''}`).join('')}
  ${o.total ? `<div class="r total"><span>${o.total[0]}</span><b>${o.total[1]}</b></div>` : ''}
  ${o.note ? `<p class="note">${o.note}</p>` : ''}
  ${o.action ? `<div class="act">${j(o.action)}</div>` : ''}
</div>`;

export const Box = (o = {}, ...body) => `<div class="wf-box${o.flat ? ' flat' : ''}"${st({ width: o.w, 'min-height': o.h })}>${o.title ? `<div class="bh"><b>${o.title}</b>${o.sub ? `<span class="sub">${o.sub}</span>` : ''}<span class="sp"></span>${j(o.right)}</div>` : ''}<div class="bb">${j(body)}</div></div>`;
export const KV = (rows, o = {}) => `<dl class="wf-kv${o.wide ? ' wide' : ''}">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
export const Grid = (cols, ...children) => `<div class="wf-grid"${st({ 'grid-template-columns': typeof cols === 'number' ? `repeat(${cols}, minmax(0, 1fr))` : cols })}>${j(children)}</div>`;
export const Flex = (o = {}, ...children) => `<div class="wf-flex"${st({ gap: o.gap === undefined ? 12 : o.gap, 'align-items': o.align, 'justify-content': o.justify, 'flex-direction': o.col ? 'column' : undefined, 'flex-wrap': o.wrap ? 'wrap' : undefined, 'margin-top': o.mt })}>${j(children)}</div>`;
export const Stat = (o = {}) => `<div class="wf-stat${o.on ? ' on' : ''}"><span class="k">${o.icon ? Icon(o.icon) : ''}${o.k}</span><b>${o.v}</b>${o.sub ? `<span class="s">${o.sub}</span>` : ''}${o.link ? `<span class="go">${o.link}${Icon('angle-right-min')}</span>` : ''}</div>`;
export const Stats = (list, cols) => Grid(cols || list.length, list.map(Stat));
export const BarChart = (values, labels = []) => {
    const max = Math.max(...values, 1);
    return `<div class="wf-chart"><div class="bars">${values.map((v) => `<span${st({ height: `${Math.round((v / max) * 100)}%` })}></span>`).join('')}</div><div class="xs">${values.map((_, i) => `<span>${labels[i] || ''}</span>`).join('')}</div></div>`;
};
export const H = (text, o = {}) => `<div class="wf-h${o.size === 'lg' ? ' lg' : ''}"><b>${text}</b>${o.sub ? `<span>${o.sub}</span>` : ''}<span class="sp"></span>${j(o.right)}</div>`;
export const Note = (text, o = {}) => `<p class="wf-note${o.warn ? ' warn' : ''}">${Icon(o.warn ? 'warning' : 'info-o')}${text}</p>`;
export const Divider = () => '<hr class="wf-hr">';
export const Text = (text, o = {}) => `<p class="wf-text${o.mute ? ' mute' : ''}${o.sm ? ' sm' : ''}${o.b ? ' b' : ''}">${text}</p>`;
export const Stars = (n = 5) => `<span class="wf-stars">${Array.from({ length: 5 }, (_, i) => Icon(i < n ? 'star' : 'star-o')).join('')}</span>`;
export const DragRow = (o = {}, ...body) => `<div class="wf-dragrow${o.off ? ' off' : ''}">${Icon('drag-vertical')}<div class="dc">${j(body)}</div>${j(o.right)}</div>`;

const USER_MENU = ['브랜드 이야기', '원료 이야기', '상품', '리뷰', '고객센터'];

export const UserHeader = (o = {}) => `
<div class="u-top">${o.band === false ? '' : `<div class="u-band">${o.band || '3만원 이상 구매 시 무료배송 · 신규 가입 3,000원 쿠폰'}</div>`}
<div class="u-header">
  <div class="u-logo">Inner:Era 로고</div>
  <div class="u-menu">${USER_MENU.map((m) => `<span class="${m === o.active ? 'on' : ''}">${m}</span>`).join('')}</div>
  <div class="u-icons"><span>${o.loggedIn ? `${o.name || SHOP.people[0]} 님` : '로그인'}</span>${o.loggedIn ? '' : '<span>회원가입</span>'}${Icon('search')}${Icon('user-o')}<span class="cart">${Icon('cart-o')}${o.cart ? `<em>${o.cart}</em>` : ''}</span></div>
</div></div>`;
export const UserFooter = () => `
<div class="u-footer">
  <div class="fl"><div class="u-logo">Inner:Era 로고</div><div class="links"><span>이용약관</span><b>개인정보처리방침</b><span>공지사항</span><span>자주 묻는 질문</span></div>
  <p>상호 ${SHOP.name} ${SHOP.nameEn} · 대표 ${SHOP.ceo} · 사업자등록번호 ${SHOP.bizNo} · 통신판매업 신고번호 관리자 설정값<br>${SHOP.addr}<br>개인정보 보호책임자 ${SHOP.ceo} · 결제 서비스 포트원</p></div>
  <div class="fr"><b>고객센터</b><strong>070-****-1234</strong><span>평일 10:00 ~ 17:00 (점심 12:00 ~ 13:00)</span><span>help@innerera.example</span></div>
</div>`;
export const UserPage = (o = {}, ...body) => `${UserHeader(o)}<div class="u-container${o.narrow ? ' narrow' : ''}">${o.crumb ? `<div class="u-crumb">${o.crumb.join(Icon('angle-right-min'))}</div>` : ''}${o.title ? `<h1 class="u-title">${o.title}</h1>` : ''}${j(body)}</div>${o.footer === false ? '' : UserFooter()}`;

const MYPAGE_MENU = [
    ['나의 쇼핑', ['주문 목록', '취소·반품·교환 내역']],
    ['나의 혜택', ['쿠폰·적립금']],
    ['나의 활동', ['리뷰', '문의']],
    ['나의 정보', ['배송지 관리', '회원정보']],
];
export const MypageLayout = (o = {}, ...body) => UserPage({ loggedIn: true, ...o, title: undefined },
    `<div class="u-my"><div class="u-myside"><div class="hello"><b>${o.name || SHOP.people[0]} 님</b><span>${o.grade || '일반 회원'}</span></div>${MYPAGE_MENU.filter(([g]) => !(o.hideBenefit && g === '나의 혜택')).map(([g, items]) => `<div class="mg"><em>${g}</em>${items.map((it) => `<span class="${it === o.active ? 'on' : ''}">${it}</span>`).join('')}</div>`).join('')}</div><div class="u-mybody">${o.title ? `<h1 class="u-title">${o.title}</h1>` : ''}${j(body)}</div></div>`);

export const UserHeaderMobile = (o = {}) => o.title
    ? `<div class="m-header sub">${Icon('angle-left')}<b>${o.title}</b><span class="r">${o.right === undefined ? Icon('home-o') : o.right}</span></div>`
    : `<div class="m-header">${Icon('bars')}<div class="u-logo">Inner:Era 로고</div><span class="r">${Icon('search')}<span class="cart">${Icon('cart-o')}${o.cart ? `<em>${o.cart}</em>` : ''}</span></span></div>`;
const TABBAR = [['홈', 'home-o'], ['카테고리', 'apps'], ['검색', 'search'], ['마이', 'user-o'], ['장바구니', 'cart-o']];
export const MobileTabbar = (active = '홈') => `<div class="m-tabbar">${TABBAR.map(([t, i]) => `<span class="${t === active ? 'on' : ''}">${Icon(i)}${t}</span>`).join('')}</div>`;
export const MobilePage = (o = {}, ...body) => `<div class="m-page">${UserHeaderMobile(o)}<div class="m-body">${j(body)}</div>${o.bottom ? `<div class="m-bottom">${j(o.bottom)}</div>` : ''}${o.tab === false ? '' : MobileTabbar(o.tab || '홈')}</div>`;
export const Drawer = (o = {}, ...body) => `
<div class="m-drawer">
  <div class="dh">${o.loggedIn ? `<b>${o.name || SHOP.people[0]} 님</b><span>적립금 2,400원 · 쿠폰 1장</span>` : `<b>로그인해 주세요</b><span>가입하면 3,000원 쿠폰을 드립니다</span>`}${Icon('close')}</div>
  ${o.loggedIn ? '' : `<div class="da">${Btn('로그인', { kind: 'primary', block: true })}${Btn('회원가입', { block: true })}</div>`}
  <ul>${(o.menu || USER_MENU.concat(['공지사항', '자주 묻는 질문', '비회원 주문 조회'])).map((m) => `<li>${m}${Icon('angle-right-min')}</li>`).join('')}</ul>
  ${j(body)}
</div>`;

const ADMIN_HIDE = ['a-01', 'a-18'];
export const AdminLayout = (o = {}, ...body) => {
    const cur = PAGES.find((p) => p.id === o.active);
    const groups = GROUPS.filter((g) => g.side === 'admin');
    const side = groups.map((g) => {
        const items = PAGES.filter((p) => p.group === g.id && !ADMIN_HIDE.includes(p.id));
        const open = cur && cur.group === g.id;
        return `<div class="ag${open ? ' open' : ''}"><div class="agt">${Icon(g.icon.replace('xi-', ''))}${g.label}${items.length > 1 ? Icon(open ? 'angle-up-min' : 'angle-down-min', 'ar') : ''}</div>${open && items.length > 1 ? `<div class="agi">${items.map((p) => `<span class="${p.id === o.active ? 'on' : ''}">${p.title}${o.counts && o.counts[p.id] !== undefined ? `<em>${o.counts[p.id]}</em>` : ''}</span>`).join('')}</div>` : ''}</div>`;
    }).join('');
    const title = o.title || (cur ? cur.title : '');
    const crumb = o.crumb || (cur ? [cur.menu, cur.title] : []);
    return `
<div class="a-shell">
  <div class="a-side"><div class="a-logo">Inner:Era 관리자</div>${side}</div>
  <div class="a-main">
    <div class="a-top"><span class="shop">${Icon('external-link')}내 쇼핑몰 보기</span><span class="sp"></span><span>${Icon('bell-o')}알림 3</span><span>${Icon('user-o')}${o.user || '운영자 이보림'}</span><span>${Icon('log-out')}로그아웃</span></div>
    <div class="a-content">
      <div class="a-pagehead"><div><div class="a-crumb">${crumb.join(Icon('angle-right-min'))}</div><h1>${title}</h1>${o.desc ? `<p>${o.desc}</p>` : ''}</div><div class="acts">${j(o.actions)}</div></div>
      ${j(body)}
    </div>
  </div>
</div>`;
};
