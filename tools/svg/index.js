// node index.js -> ../../screens/svg/index.html (mục lục SVG)
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '../../screens'), OUT = path.join(SRC, 'svg');
const items = fs.readdirSync(SRC).filter(f => /^\d\d-.*\.html$/.test(f)).sort().map(f => {
  const t = (fs.readFileSync(path.join(SRC, f), 'utf8').match(/<title>([^<]*)<\/title>/) || [, f])[1];
  const svg = f.replace('.html', '.svg'); const ok = fs.existsSync(path.join(OUT, svg));
  return { no: t.slice(0, 2), title: t.slice(3), svg, html: f, ok, kb: ok ? Math.round(fs.statSync(path.join(OUT, svg)).size / 1024) : 0 }; });
const done = items.filter(i => i.ok).length;
const rows = items.map(i => `<tr class="${i.ok ? '' : 'no'}"><td>${i.no}</td><td>${i.title}</td><td>${i.ok ? `<a href="${i.svg}" download>Tải SVG</a> <span class="n">(${i.kb} KB)</span>` : '<span class="n">Chưa tạo</span>'}</td><td><a href="../${i.html}">Xem trang</a></td></tr>`).join('');
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mục lục SVG</title><link rel="stylesheet" href="../../fonts/public-sans.css"><style>
body{font:16px/1.5 "Public Sans",Arial,sans-serif;color:#1b2330;background:#fff;margin:0;padding:24px 16px}main{max-width:1000px;margin:0 auto}h1{margin:0 0 8px}
table{border-collapse:collapse;width:100%;margin:12px 0 24px}td,th{border:1px solid #d5d9df;padding:6px 10px;text-align:left;font-size:15px;vertical-align:top}th{background:#f5f6f8}a{color:#4767a4}
.n{color:#555}tr.no td{color:#767676}ol{padding-left:20px}</style></head><body><main>
<h1>Mục lục SVG – màn hình CMS Cell Broadcast</h1>
<p class="n">Đã tạo ${done}/${items.length} màn hình.</p>
<h2>Cách đưa vào Figma (không cần plugin)</h2>
<ol><li>Bấm <b>Tải SVG</b> ở màn hình cần dùng.</li><li>Kéo file .svg vào Figma (hoặc Ctrl/Cmd + Shift + K để nhập).</li><li>Figma tạo 1 khung gồm các khối, viền và <b>chữ sửa được</b>; lớp được đặt tên theo thành phần (vd. <code>div-card</code>, <code>button-btn-pri</code>).</li><li>Phông chữ Public Sans có sẵn trong Figma (Google Fonts), nếu báo thiếu phông thì chọn Public Sans.</li></ol>
<table><tr><th>STT</th><th>Màn hình</th><th>SVG</th><th>Trang gốc</th></tr>${rows}</table>
</main></body></html>`);
console.log('index', done, '/', items.length);
