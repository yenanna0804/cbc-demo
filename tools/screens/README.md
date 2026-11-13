# Trang "Tất cả màn hình" (screens.html)

Sinh tự động từ index.html để nhập vào Figma bằng plugin html.to.design (1 lần dán link là đủ mọi màn hình, popup, trạng thái).

Chạy lại khi demo thay đổi (cần Node + Playwright):

```
python3 -m http.server 8765        # tại thư mục gốc repo
cd tools/screens
node crawl.js     # tự đăng nhập 3 vai trò, bấm mọi nút, chụp màn hình/popup -> frames.json
node extra.js     # thêm khung "soạn tự do"
node build.js     # ghép theo meta.json (chọn khung + tiêu đề) -> ../../screens.html
```

Khung mới do crawl.js tìm thấy cần thêm vào meta.json (chỉ số trong frames.json, nhóm, tiêu đề).
