const { chromium } = require('playwright'); const fs = require('fs');
const DEMO = require('path').join(__dirname,'../../index.html');
const src = fs.readFileSync(DEMO, 'utf8');
const style = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const frames = JSON.parse(fs.readFileSync('frames.json', 'utf8'));
const meta = JSON.parse(fs.readFileSync('meta.json', 'utf8')); // [{i, title, group, keep}]
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(300);
  const mapSel = x => x.replace(/:hover/g, '.st-hover').replace(/:focus-visible/g, '.st-focus').replace(/:focus-within/g, '.st-focus').replace(/:focus/g, '.st-focus').replace(/:active/g, '.st-active');
  const style2 = style.replace(/([^{}]+)\{/g, (m, sel) => { const t = sel.trim(); if (t.startsWith('@') || !/:(hover|focus|active)/.test(t)) return m;
    const extra = t.split(',').filter(x => /:(hover|focus|active)/.test(x)).map(mapSel).join(','); return sel + ',' + extra + '{'; });
  const pseudo = '';
  await b.close();
  const BTN = [['Nút chính', 'btn pri', 'Gửi duyệt'], ['Nút xác nhận', 'btn ok', 'Phê duyệt'], ['Nút phụ', 'btn', 'Lưu nháp'], ['Nút nguy hiểm (viền)', 'btn danger', 'Dừng phát'], ['Nút nguy hiểm (nền)', 'btn dangerfill', 'Xác nhận dừng'], ['Nút dạng link', 'btn link', 'Huỷ'], ['Nút nhỏ', 'btn sm', 'Xem']];
  const btnRows = BTN.map(([n, c, t]) => `<tr><td><b>${n}</b><div class="small muted mono">.${c.replace(/ /g, '.')}</div></td><td><button class="${c}">${t}</button></td><td><button class="${c} st-hover">${t}</button></td><td><button class="${c} st-focus">${t}</button></td><td><button class="${c}" aria-busy="true" disabled>${t}</button></td><td><button class="${c}" disabled>${t}</button></td></tr>`).join('');
  const IN = [['Ô chữ', v => `<input type="text" ${v}>`, 'Bão số 3'], ['Danh sách chọn', v => `<select ${v}><option>Hà Nội</option></select>`, ''], ['Ô nhiều dòng', v => `<textarea rows="2" ${v}>`, '']];
  const fld = (n, mk, val, st) => { const v = (val ? `value="${val}"` : '') + (st === 'dis' ? ' disabled' : '') + (st === 'focus' ? ' class="st-focus"' : '');
    let h = mk(v); if (h.startsWith('<textarea')) h += 'Nội dung cảnh báo…</textarea>';
    return `<div class="${st === 'err' ? 'has-err' : ''}" style="width:220px"><label class="f">${n} <span class="req">*</span></label>${h}${st === 'err' ? '<div class="ferr">Trường này bắt buộc.</div>' : ''}</div>`; };
  const inRows = IN.map(([n, mk, val]) => `<tr><td><b>${n}</b></td>${['', 'focus', 'err', 'dis'].map(s => `<td>${fld(n, mk, val, s)}</td>`).join('')}</tr>`).join('');
  const ST = { draft: 'Nháp', pending: 'Chờ duyệt', rejected: 'Bị từ chối', cancelled: 'Đã huỷ', scheduled: 'Chờ phát', broadcasting: 'Đang phát', stopped: 'Đã dừng', expired: 'Hết hạn' };
  const tipBtn = open => `<span class="tipw${open ? ' open' : ''}"><button type="button" class="tipb" aria-label="Chú thích">i</button><span class="tipt" role="tooltip">Dấu * đỏ là trường bắt buộc</span></span>`;
  let states = fs.readFileSync('states.html', 'utf8').replace('__BTNROWS__', btnRows).replace('__INROWS__', inRows).replace('__TIP__', tipBtn(false)).replace('__TIPOPEN__', tipBtn(true))
    .replace('__BADGES__', Object.entries(ST).map(([k, v]) => `<span class="badge b-${k}">${v}</span>`).join(''));
  const kept = meta.filter(m => m.keep);
  const groups = [...new Set(kept.map(m => m.group))];
  let no = 0; const toc = [], body = [];
  for (const g of groups) {
    body.push(`<h2 class="g-h">${g}</h2>`);
    for (const m of kept.filter(x => x.group === g)) { const f = frames[m.i]; no++;
      toc.push(`<tr><td>${no}</td><td>${g}</td><td><a href="#f${no}">${m.title}</a></td><td>${f.kind === 'modal' ? 'Popup' : f.kind === 'state' ? 'Trạng thái' : 'Màn hình'}</td><td>${m.role || ''}</td></tr>`);
      body.push(`<section class="fr" id="f${no}"><div class="fr-t"><span class="fr-no">${no}</span>${m.title}<span class="fr-k">${f.kind === 'modal' ? 'Popup' : f.kind === 'state' ? 'Trạng thái' : 'Màn hình'}${m.role ? ' · ' + m.role : ''}</span></div>
<div class="vp ${f.cls}" style="height:${f.h}px">${f.html.replace(/ name="/g, " name=\"f" + no + "_")}</div></section>`); }
  }
  no++; toc.push(`<tr><td>${no}</td><td>Thành phần giao diện</td><td><a href="#f${no}">Bảng trạng thái: nút, ô nhập, tooltip, nhãn, thông báo, tab</a></td><td>Bảng trạng thái</td><td></td></tr>`);
  body.push(`<h2 class="g-h">Thành phần giao diện</h2><section class="fr" id="f${no}"><div class="fr-t"><span class="fr-no">${no}</span>Bảng trạng thái thành phần<span class="fr-k">Hover / Focus / Lỗi / Khoá</span></div><div class="vp sboard" style="width:1440px">${states}</div></section>`);
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=1600">
<title>Tất cả màn hình CMS</title><link rel="stylesheet" href="fonts/public-sans.css"><style>${style2}
/* ---- trạng thái ép sẵn để xuất Figma ---- */
${pseudo}
/* ---- khung trang tổng hợp ---- */
html,body{background:#e9ecf1}
.cover{width:1440px;margin:40px auto 24px;background:#fff;border:1px solid #d5d9df;padding:28px 32px}
.cover h1{margin:0 0 6px}.cover table{border-collapse:collapse;width:100%;margin-top:16px}.cover td,.cover th{border:1px solid #d5d9df;padding:6px 10px;text-align:left;font-size:14px;vertical-align:top}.cover th{background:#f5f6f8}
.g-h{width:1440px;margin:48px auto 12px;font-size:24px}
.fr{width:1440px;margin:0 auto 40px}
.fr-t{font-weight:700;font-size:18px;padding:10px 0;display:flex;gap:10px;align-items:center}
.fr-no{background:#4767a4;color:#fff;border-radius:3px;padding:1px 9px;font-size:15px}
.fr-k{margin-left:auto;font-weight:400;font-size:14px;color:#555}
.vp{position:relative;transform:translateZ(0);width:1440px;overflow:hidden;background:var(--bg,#f5f6f8);border:1px solid #c9ced6;box-shadow:0 2px 10px rgba(0,0,0,.08)}
.vp.sboard{background:#fff;padding:28px 32px;box-sizing:border-box}
.sb-h{font-size:20px;margin:28px 0 12px}.sb-h:first-child{margin-top:0}.sb-s{font-size:16px;margin:18px 0 8px}
.sb-t{border-collapse:collapse}.sb-t th,.sb-t td{border:1px solid #e1e4e8;padding:12px 14px;text-align:left;vertical-align:middle}.sb-t th{background:#f5f6f8;font-size:14px}
</style></head><body>
<div class="cover"><h1>Tất cả màn hình CMS Cell Broadcast</h1>
<div class="muted">Trang tổng hợp để nhập vào Figma bằng plugin html.to.design: mỗi khung là một màn hình, popup hoặc trạng thái, đã mở sẵn. Kích thước khung 1440 px. Sinh tự động từ bản demo ngày ${new Date().toLocaleDateString('vi-VN')}.</div>
<table><tr><th>STT</th><th>Nhóm</th><th>Khung</th><th>Loại</th><th>Vai trò</th></tr>${toc.join('')}</table></div>
${body.join('\n')}
</body></html>`;
  fs.writeFileSync(require('path').join(__dirname,'../../screens.html'), html);
  console.log('frames kept', kept.length, 'bytes', html.length);
})();
