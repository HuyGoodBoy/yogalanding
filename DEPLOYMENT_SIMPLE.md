# Hướng dẫn Deploy đơn giản lên GitHub Pages

## Vấn đề đã được khắc phục:
- ✅ Sửa cấu hình Vite để build ra thư mục `dist`
- ✅ Sửa file `index.html` để reference đúng file sau khi build
- ✅ Tạo file `src/main.tsx` để Vite build đúng
- ✅ Cập nhật GitHub Actions để deploy từ branch `main`

## Cách deploy:

### 1. **Push code lên branch main:**
```bash
git add .
git commit -m "Fix GitHub Pages deployment"
git push origin main
```

### 2. **Cấu hình GitHub Pages:**
1. Vào repository trên GitHub
2. Vào **Settings** > **Pages**
3. Trong **Source**, chọn **GitHub Actions**

### 3. **Thêm GitHub Secrets:**
1. Vào **Settings** > **Secrets and variables** > **Actions**
2. Thêm 2 secrets:
   - `VITE_SUPABASE_URL`: URL của Supabase project
   - `VITE_SUPABASE_ANON_KEY`: Anonymous key của Supabase

### 4. **Test build locally:**
```bash
npm run build:client
```

Sau khi build, kiểm tra thư mục `dist/` có chứa:
- `index.html`
- `assets/` (chứa CSS, JS files)

## Cấu trúc sau khi build:
```
dist/
├── index.html          # File chính
├── assets/             # CSS, JS files
│   ├── index-*.js
│   └── index-*.css
└── favicon.ico         # (nếu có)
```

## GitHub Actions Workflow:
- Trigger: Push vào branch `main`
- Build: `npm run build:client`
- Deploy: Tự động deploy lên GitHub Pages

## URL sau khi deploy:
```
https://huygoodboy.github.io/yogalanding/
```

## Troubleshooting:

### Nếu vẫn bị trắng trang:
1. Kiểm tra Console trong Developer Tools
2. Kiểm tra Network tab xem có lỗi load file nào không
3. Kiểm tra GitHub Actions logs

### Nếu có lỗi build:
1. Kiểm tra environment variables trong GitHub Secrets
2. Test build locally trước: `npm run build:client`
3. Kiểm tra file `src/main.tsx` có tồn tại không

## Lưu ý:
- Không cần branch `gh-pages` riêng nữa
- Deploy trực tiếp từ branch `main`
- GitHub Actions sẽ tự động build và deploy

