const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'http://localhost:8765/index.html';
const SKIP = new Set(['closeModal','smsClose','toggleNav','logout','resetDemo','switchUser','toggleMenu']);
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('dialog', d => d.dismiss());
  await p.goto(BASE); await p.waitForTimeout(500);
  await p.evaluate(() => {
    const U3 = S.users.find(u => u.id === 'U3'); const b = S.messages.find(m => m.status === 'pending');
    const mk = (camp, by) => { const m = newMsg({campaign: camp, docNo: '90/UBND-PCTT', mode: b.mode, templateId: b.templateId, vars: b.vars, areas: b.areas, priority: 4370, repetition: 15, duration: 240}, by);
      m.submittedAt = now(); m.history.push({at: now(), by, act: 'Gửi duyệt'}); S.messages.push(m); return m; };
    window.__m = {};
    for (const [k, c] of [['live', 'Lũ quét – Quảng Nam'], ['upd', 'Sạt lở đất – Nam Trà My'], ['stp', 'Mưa lớn – Tây Giang'], ['stopped', 'Triều cường – Hội An']]) { const m = mk(c, 'U1'); m.status = 'pending'; broadcast(m, U3); __m[k] = m; }
    const sc = mk('Diễn tập sơ tán – Hòa Vang', 'U1'); sc.schedAt = now() + 3 * 3600e3; sc.status = 'scheduled'; sc.approvedBy = 'U3'; sc.approverUnit = U3.unit; sc.approvedAt = now();
    const rj = mk('Cảnh báo lốc – Đại Lộc', 'U1'); rj.status = 'rejected'; rj.rejectReason = 'Thiếu số văn bản yêu cầu'; rj.rejectedBy = 'U3'; rj.rejectedAt = now();
    const cc = mk('Cảnh báo nắng nóng – Điện Bàn', 'U1'); cc.status = 'cancelled';
    save();
  });
  await p.waitForTimeout(6000);
  await p.evaluate(() => {
    const m = __m.live; const c = m.cells[0]; m.results[c] = 'fail'; const r = m.rounds[m.rounds.length - 1]; if (r) r.res[c] = 'fail';
    __m.upd.pendingAction = {type: 'update', body: __m.upd.body + ' Đã cập nhật giờ sơ tán.', reason: 'Đính chính giờ sơ tán', by: 'U1', at: now()};
    __m.stp.pendingAction = {type: 'stop', reason: 'Hết nguy cơ', by: 'U1', at: now()};
    applyStop(__m.stopped, {type: 'stop', reason: 'Hết nguy cơ', by: 'U1', at: now()}, S.users.find(u => u.id === 'U3'));
    save();
  });
  await p.waitForTimeout(3000);
  const baseLS = await p.evaluate(() => JSON.stringify(Object.fromEntries(Object.entries(localStorage))));
  const S0 = await p.evaluate(() => JSON.parse(localStorage.getItem('cbc_demo_data_v1')));
  const users = { SO: 'U1', PD: 'U3', QT: 'U5' };
  let n = 0;
  async function load(uid, hash) {
    await p.evaluate(([ls, uid]) => { localStorage.clear(); for (const [k, v] of Object.entries(JSON.parse(ls))) localStorage.setItem(k, v);
      if (uid) localStorage.setItem('cbc_demo_session_v1', JSON.stringify({ uid, at: Date.now() })); else localStorage.removeItem('cbc_demo_session_v1'); }, [baseLS, uid]);
    await p.goto(BASE + '?r=' + (n++) + hash); await p.waitForTimeout(350);
  }
  async function snap(kind) {
    return p.evaluate((kind) => {
      const orig = document.body, clone = orig.cloneNode(true);
      const o = orig.querySelectorAll('input,textarea,select'), c = clone.querySelectorAll('input,textarea,select');
      o.forEach((el, i) => { const k = c[i]; if (!k) return;
        if (el.tagName === 'TEXTAREA') k.textContent = el.value;
        else if (el.tagName === 'SELECT') [...k.options].forEach((op, j) => j === el.selectedIndex ? op.setAttribute('selected', '') : op.removeAttribute('selected'));
        else if (el.type === 'checkbox' || el.type === 'radio') el.checked ? k.setAttribute('checked', '') : k.removeAttribute('checked');
        else k.setAttribute('value', el.value); });
      clone.querySelectorAll('script').forEach(e => e.remove());
      const t = clone.querySelector('#toasts'); if (t) t.innerHTML = '';
      const md = document.querySelector('.modal');
      let h = kind === 'modal' ? Math.max(900, md ? md.getBoundingClientRect().height + 60 : 900) : Math.max(900, document.documentElement.scrollHeight);
      const mt = md ? md.querySelector('.hd h2')?.textContent.trim() : '';
      const h1 = document.querySelector('.ph h1, .content h1, h1')?.textContent.trim() || '';
      return { html: clone.innerHTML, cls: orig.className, h: Math.ceil(h), mt, h1, len: (document.querySelector('.main')||document.body).innerHTML.length };
    }, kind);
  }
  const msgById = id => S0.messages.find(m => m.id === id);
  function key(role, hash) {
    let m = hash.match(/^#\/messages\/([^/?]+)\/edit/); if (m) return role + ':edit';
    m = hash.match(/^#\/messages\/([^/?]+)$/); if (m && m[1] !== 'new') { const x = msgById(m[1]); if (!x) return null;
      return role + ':msg:' + x.status + (x.pendingAction ? '+' + x.pendingAction.type : '') + (x.createdBy === users[role] ? ':own' : ''); }
    m = hash.match(/^#\/reports\?id=/); if (m) return role + ':report';
    return role + ':' + hash;
  }
  const frames = []; const seen = new Set(); const queue = [];
  const push = (role, hash) => { const k = key(role, hash); if (k && !seen.has(k)) { seen.add(k); queue.push({ role, hash, k }); } };
  for (const r of ['SO', 'PD', 'QT']) for (const h of ['#/dashboard', '#/messages', '#/messages/new', '#/reports', '#/templates', '#/catalog/priorities', '#/catalog/areas', '#/catalog/cells', '#/settings', '#/users', '#/logs']) push(r, h);
  // every message status as SO and PD
  for (const m of S0.messages) { push('SO', '#/messages/' + m.id); push('PD', '#/messages/' + m.id); if (m.sentAt) push('SO', '#/reports?id=' + m.id); }
  // login
  await load(null, '#/'); frames.push({ role: '-', route: 'login', kind: 'page', ...(await snap('page')) });
  await p.fill('[data-form=login] [name=username]', 'soanthao1'); await p.fill('[data-form=login] [name=password]', 'Demo@123');
  await p.click('[data-form=login] button.pri'); await p.waitForTimeout(400);
  frames.push({ role: '-', route: 'login-otp', kind: 'page', ...(await snap('page')) });
  await load(null, '#/'); await p.click('[data-form=login] button.pri'); await p.waitForTimeout(300);
  frames.push({ role: '-', route: 'login-error', kind: 'state', act: 'submit rỗng', ...(await snap('page')) });
  await load('U1','#/dashboard'); await p.click('[data-act=toggleMenu]'); await p.waitForTimeout(300); frames.push({ role: 'SO', route: 'usermenu', kind: 'state', act: 'toggleMenu', ...(await snap('page')) });
  while (queue.length) {
    const st = queue.shift();
    await load(users[st.role], st.hash);
    const cur = await p.evaluate(() => location.hash);
    if (/dashboard/.test(cur) && !/dashboard/.test(st.hash) && st.hash !== '#/') { continue; }
    const base = await snap('page');
    if (/Không có quyền truy cập/.test(base.html) && !base.html.includes('class="ph"')) continue;
    frames.push({ role: st.role, route: st.k, hash: st.hash, kind: 'page', ...base });
    for (const href of await p.$$eval('.main a[href^="#/"]', as => as.map(a => a.getAttribute('href')))) push(st.role, href);
    const cands = await p.evaluate((skip) => {
      const out = [], used = new Set();
      document.querySelectorAll('.main [data-act], .main button, #umenu [data-act], .who').forEach((el, i) => {
        const r = el.getBoundingClientRect(); if (!r.width || el.disabled) return;
        const a = el.dataset.act || ''; if (skip.includes(a)) return;
        const id = a ? 'act:' + a + (el.dataset.k||el.dataset.tab||el.dataset.v||'') : 'txt:' + el.textContent.trim().slice(0, 30);
        if (used.has(id)) return; used.add(id); el.setAttribute('data-crawl', out.length); out.push({ id, label: el.textContent.trim().slice(0, 50) });
      }); return out; }, [...SKIP]);
    for (let i = 0; i < cands.length; i++) {
      await load(users[st.role], st.hash);
      await p.evaluate((skip) => { let c = 0; const used = new Set();
        document.querySelectorAll('.main [data-act], .main button, #umenu [data-act], .who').forEach(el => { const r = el.getBoundingClientRect(); if (!r.width || el.disabled) return; const a = el.dataset.act || ''; if (skip.includes(a)) return;
          const id = a ? 'act:' + a + (el.dataset.k||el.dataset.tab||el.dataset.v||'') : 'txt:' + el.textContent.trim().slice(0, 30); if (used.has(id)) return; used.add(id); el.setAttribute('data-crawl', c++); }); }, [...SKIP]);
      const before = await p.evaluate(() => [location.hash, (document.querySelector('.main')||document.body).innerHTML.length]);
      try { await p.click(`[data-crawl="${i}"]`, { timeout: 1500 }); } catch (e) { continue; }
      await p.waitForTimeout(350);
      const after = await p.evaluate(() => [location.hash, !!document.querySelector('#modal .modal'), (document.querySelector('.main')||document.body).innerHTML.length, !!document.querySelector('.menu.open, #umenu.open')]);
      if (after[1]) { const s = await snap('modal'); frames.push({ role: st.role, route: st.k, kind: 'modal', act: cands[i].id, label: cands[i].label, ...s }); }
      else if (after[0] !== before[0]) push(st.role, after[0]);
      else if (after[3] || Math.abs(after[2] - before[1]) > 200) { const s = await snap('page'); frames.push({ role: st.role, route: st.k, kind: 'state', act: cands[i].id, label: cands[i].label, ...s }); }
    }
    process.stdout.write(st.k + ' ' + cands.length + '\n');
  }
  fs.writeFileSync('frames.json', JSON.stringify(frames));
  console.log('frames', frames.length);
  await b.close();
})();
