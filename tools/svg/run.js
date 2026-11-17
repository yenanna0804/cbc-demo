// node run.js [lọc tên file]  -> ../../screens/svg/*.svg
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const SRC = path.join(__dirname, '../../screens'), OUT = path.join(SRC, 'svg'); const filt = process.argv[2] || '';
(async () => { fs.mkdirSync(OUT, { recursive: true }); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const conv = fs.readFileSync(path.join(__dirname, 'dom2svg.js'), 'utf8');
  for (const f of fs.readdirSync(SRC).filter(f => /^\d\d-.*\.html$/.test(f) && (filt.includes('-') && /^\d+-\d+$/.test(filt) ? (+f.slice(0,2) >= +filt.split('-')[0] && +f.slice(0,2) <= +filt.split('-')[1]) : f.includes(filt)))) {
    await p.goto('http://localhost:8765/screens/' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.addScriptTag({ content: conv }); const svg = await p.evaluate(() => dom2svg());
    fs.writeFileSync(path.join(OUT, f.replace('.html', '.svg')), svg); console.log(f, (svg.length / 1024).toFixed(0) + ' KB'); }
  await b.close(); })();
