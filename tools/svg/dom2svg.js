// Chạy trong trình duyệt: chuyển DOM đang hiển thị thành SVG (khối + viền + chữ thật), giữ cấu trúc lớp theo DOM.
window.dom2svg = function () {
  const W = Math.max(document.documentElement.scrollWidth, innerWidth), H = Math.max(document.documentElement.scrollHeight, innerHeight);
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const col = c => { if (!c) return null; const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (p.length > 3 && p[3] === 0) return null; const hex = '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join(''); return p.length > 3 && p[3] < 1 ? { c: hex, a: +p[3].toFixed(3) } : { c: hex, a: 1 }; };
  const fill = (k, v) => v ? ` ${k}="${v.c}"${v.a < 1 ? ` ${k}-opacity="${v.a}"` : ''}` : '';
  const sx = scrollX, sy = scrollY; const R = r => ({ x: +(r.left + sx).toFixed(2), y: +(r.top + sy).toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) });
  const cv = document.createElement('canvas').getContext('2d'); const ascCache = {};
  const ascent = (font) => { if (ascCache[font] != null) return ascCache[font]; cv.font = font; const m = cv.measureText('Hg'); return ascCache[font] = m.fontBoundingBoxAscent; };
  const nameOf = el => { let n = el.tagName.toLowerCase(); if (el.id) n += '#' + el.id; if (el.classList.length) n += '.' + [...el.classList].slice(0, 3).join('.'); return n; };
  let uid = 0; const ids = new Set(); const idOf = n => { let b = n.replace(/[^A-Za-z0-9_.#-]/g, '_').replace(/[#.]/g, '-').replace(/^-+/, '') || 'g'; let s = b; while (ids.has(s)) s = b + '_' + (++uid); ids.add(s); return s; };
  const fontOf = cs => `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const famOf = cs => cs.fontFamily.replace(/"/g, "'");
  const tf = (t, cs) => cs.textTransform === 'uppercase' ? t.toUpperCase() : cs.textTransform === 'lowercase' ? t.toLowerCase() : t;
  function textEl(txt, x, base, cs, extra = '') {
    const c = col(cs.color) || { c: '#000', a: 1 }; const ls = parseFloat(cs.letterSpacing) || 0;
    const deco = cs.textDecorationLine && cs.textDecorationLine.includes('underline') ? ' text-decoration="underline"' : '';
    return `<text x="${x.toFixed(2)}" y="${base.toFixed(2)}" font-family="${famOf(cs)}" font-size="${parseFloat(cs.fontSize)}" font-weight="${cs.fontWeight}"${cs.fontStyle === 'italic' ? ' font-style="italic"' : ''}${ls ? ` letter-spacing="${ls}"` : ''}${fill('fill', c)}${deco}${extra} xml:space="preserve">${esc(txt)}</text>`;
  }
  function textNode(node, cs, op) {
    const s = node.textContent; if (!s.trim()) return '';
    const rg = document.createRange(); const lines = []; let cur = null;
    for (let i = 0; i < s.length; i++) { rg.setStart(node, i); rg.setEnd(node, i + 1); const rs = rg.getClientRects(); if (!rs.length) continue; const r = rs[0];
      if (!r.width && s[i] !== ' ') continue;
      if (!cur || Math.abs(r.top - cur.top) > r.height * 0.5) { cur = { top: r.top, left: r.left, txt: '', bottom: r.bottom }; lines.push(cur); }
      cur.txt += s[i]; }
    const a = ascent(fontOf(cs));
    return lines.map(l => { const t = l.txt.replace(/\s+/g, ' '); if (!t.trim()) return ''; const lead = l.txt.match(/^\s*/)[0].length ? 0 : 0;
      return textEl(tf(t.replace(/^\s+/, ''), cs), l.left + sx, l.top + sy + a, cs, op); }).join('');
  }
  function border(el, cs, r) {
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map(s => ({ w: parseFloat(cs['border' + s + 'Width']) || 0, c: col(cs['border' + s + 'Color']), st: cs['border' + s + 'Style'] }));
    const vis = sides.map(s => s.w > 0 && s.c && s.st !== 'none' && s.st !== 'hidden');
    if (!vis.some(Boolean)) return '';
    const rad = parseFloat(cs.borderTopLeftRadius) || 0;
    if (vis.every(Boolean) && sides.every(s => s.w === sides[0].w && s.c.c === sides[0].c.c)) { const w = sides[0].w;
      return `<rect x="${(r.x + w / 2).toFixed(2)}" y="${(r.y + w / 2).toFixed(2)}" width="${Math.max(0, r.w - w).toFixed(2)}" height="${Math.max(0, r.h - w).toFixed(2)}"${rad ? ` rx="${Math.max(0, rad - w / 2)}"` : ''} fill="none"${fill('stroke', sides[0].c)} stroke-width="${w}"/>`; }
    let o = ''; const L = (x1, y1, x2, y2, s) => `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"${fill('stroke', s.c)} stroke-width="${s.w}"/>`;
    if (vis[0]) o += L(r.x, r.y + sides[0].w / 2, r.x + r.w, r.y + sides[0].w / 2, sides[0]);
    if (vis[1]) o += L(r.x + r.w - sides[1].w / 2, r.y, r.x + r.w - sides[1].w / 2, r.y + r.h, sides[1]);
    if (vis[2]) o += L(r.x, r.y + r.h - sides[2].w / 2, r.x + r.w, r.y + r.h - sides[2].w / 2, sides[2]);
    if (vis[3]) o += L(r.x + sides[3].w / 2, r.y, r.x + sides[3].w / 2, r.y + r.h, sides[3]);
    return o;
  }
  function shadow(cs, r) { const sh = cs.boxShadow; if (!sh || sh === 'none') return ''; const m = sh.match(/(rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px/); if (!m) return '';
    const c = col(m[1]); if (!c) return ''; const rad = parseFloat(cs.borderTopLeftRadius) || 0; const id = 'sh' + (++uid);
    return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="${m[2]}" dy="${m[3]}" stdDeviation="${(+m[4]) / 2}" flood-color="${c.c}" flood-opacity="${c.a}"/></filter><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"${rad ? ` rx="${rad}"` : ''} fill="#fff" filter="url(#${id})"/>`; }
  function walk(el, clip) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return '';
    const rect = el.getBoundingClientRect(); const r = R(rect); const tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'head') return '';
    if (tag === 'svg') { if (!(r.w > 0 && r.h > 0)) return ''; const vb = el.getAttribute('viewBox'); // hình minh hoạ SVG: nhúng nguyên
      return `<svg id="${nameOf(el)}" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"${vb ? ` viewBox="${vb}"` : ''}>${el.innerHTML}</svg>`; }
    let out = '';
    const op = +cs.opacity < 1 ? ` opacity="${cs.opacity}"` : '';
    if (r.w > 0 && r.h > 0) {
      out += shadow(cs, r);
      const bg = col(cs.backgroundColor); const rad = parseFloat(cs.borderTopLeftRadius) || 0;
      if (bg) out += `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"${rad ? ` rx="${Math.min(rad, r.h / 2, r.w / 2)}"` : ''}${fill('fill', bg)}/>`;
      out += border(el, cs, r);
    }
    if (tag === 'input' || tag === 'textarea' || tag === 'select') {
      if (el.type === 'checkbox' || el.type === 'radio') { if (r.w) { const c = el.checked; const s = Math.min(r.w, r.h);
          out += el.type === 'radio' ? `<circle cx="${r.x + s / 2}" cy="${r.y + s / 2}" r="${s / 2 - 0.5}" fill="#fff" stroke="${c ? '#4767a4' : '#767676'}"/>${c ? `<circle cx="${r.x + s / 2}" cy="${r.y + s / 2}" r="${s / 4}" fill="#4767a4"/>` : ''}`
            : `<rect x="${r.x + .5}" y="${r.y + .5}" width="${s - 1}" height="${s - 1}" rx="2" fill="${c ? '#4767a4' : '#fff'}" stroke="${c ? '#4767a4' : '#767676'}"/>${c ? `<path d="M${r.x + s * .22} ${r.y + s * .52} L${r.x + s * .42} ${r.y + s * .72} L${r.x + s * .78} ${r.y + s * .3}" stroke="#fff" stroke-width="2" fill="none"/>` : ''}`; } }
      else { let v = tag === 'select' ? (el.options[el.selectedIndex] || {}).text || '' : el.value; let ph = false; if (!v && el.placeholder) { v = el.placeholder; ph = true; }
        if (el.type === 'password' && !ph) v = '•'.repeat(v.length);
        if (v) { const pl = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth); const fs = parseFloat(cs.fontSize); const a = ascent(fontOf(cs));
          const lh = parseFloat(cs.lineHeight) || fs * 1.2; const firstLine = tag === 'textarea' ? v.split('\n') : [v];
          const top0 = tag === 'textarea' ? r.y + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth) + (lh - (a + fs * 0.25)) / 2 : r.y + (r.h - (a + fs * 0.25)) / 2;
          const cs2 = { ...cs, color: ph ? 'rgb(118,118,118)' : cs.color, fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle, letterSpacing: cs.letterSpacing, textTransform: 'none', textDecorationLine: 'none' };
          firstLine.slice(0, Math.max(1, Math.floor((r.h - 8) / lh))).forEach((ln, i) => { out += textEl(ln, r.x + pl, top0 + a + i * lh, cs2); }); }
        if (tag === 'select') { const ax = r.x + r.w - 16, ay = r.y + r.h / 2; out += `<path d="M${ax - 4} ${ay - 2} L${ax} ${ay + 2} L${ax + 4} ${ay - 2}" stroke="${(col(cs.color) || {}).c || '#333'}" stroke-width="1.5" fill="none"/>`; } }
    }
    const ov = cs.overflow !== 'visible' && cs.overflowX !== 'visible' && r.w > 0 && r.h > 0 && tag !== 'body' && tag !== 'html';
    let kids = '';
    // vẽ theo z-index (phần tử position có z-index số được xếp sau, ổn định theo thứ tự DOM)
    const parts = [];
    for (const n of el.childNodes) { if (n.nodeType === 3) parts.push([0, textNode(n, cs, '')]); else if (n.nodeType === 1) { const c2 = getComputedStyle(n); const z = c2.position !== 'static' && c2.zIndex !== 'auto' ? +c2.zIndex : 0; parts.push([z, walk(n)]); } }
    parts.map((p, i) => [p[0], i, p[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).forEach(p => { kids += p[2]; });
    if (ov && kids) { const id = 'c' + (++uid); kids = `<clipPath id="${id}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/></clipPath><g clip-path="url(#${id})">${kids}</g>`; }
    out += kids; if (!out) return '';
    return `<g id="${idOf(nameOf(el))}"${op}>${out}</g>`;
  }
  // phần tử fixed/sticky được vẽ theo vị trí hiện tại (đã cuộn về đầu trang)
  const body = walk(document.body);
  const bg = col(getComputedStyle(document.body).backgroundColor) || { c: '#ffffff', a: 1 };
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect id="nen" width="${W}" height="${H}"${fill('fill', bg)}/>${body}</svg>`;
};
