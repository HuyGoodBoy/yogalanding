# Hướng dẫn Deploy lên GitHub Pages

## Vấn đề hiện tại
- Branch `main` bị trắng trang vì GitHub Pages yêu cầu file `index.html` ở thư mục gốc
- Cần tạo branch `gh-pages` riêng để deploy

## Giải pháp đã chuẩn bị

### 1. Files đã được tạo/cập nhật:
- ✅ `index.html` ở thư mục gốc với SPA routing script
- ✅ `build-for-gh-pages.js` - script build tự động
- ✅ `.gitignore-gh-pages` - file gitignore cho branch gh-pages
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Script build mới trong `package.json`

### 2. Cách thực hiện thủ công:

#### Bước 1: Push branch gh-pages
```bash
# Nếu có lỗi permission, hãy:
# 1. Kiểm tra remote URL
git remote -v

# 2. Nếu cần, set lại remote với token
git remote set-url origin https://YOUR_GITHUB_TOKEN@github.com/HuyGoodBoy/yogalanding.git

# 3. Push branch
git push origin gh-pages
```

#### Bước 2: Cấu hình GitHub Pages
1. Vào repository trên GitHub
2. Vào **Settings** > **Pages**
3. Trong **Source**, chọn **Deploy from a branch**
4. Chọn branch: **gh-pages**
5. Folder: **/** (root)
6. Click **Save**

#### Bước 3: Thêm GitHub Secrets
1. Vào **Settings** > **Secrets and variables** > **Actions**
2. Thêm 2 secrets:
   - `VITE_SUPABASE_URL`: URL của Supabase project
   - `VITE_SUPABASE_ANON_KEY`: Anonymous key của Supabase

#### Bước 4: Test build locally (tùy chọn)
```bash
# Chạy script build
npm run build:gh-pages

# Kiểm tra file index.html đã được tạo ở root
ls index.html
```

### 3. Cấu trúc sau khi build:
```
yogalanding/
├── index.html          # File chính cho GitHub Pages
├── assets/             # CSS, JS files
│   ├── index-*.js
│   └── index-*.css
└── .gitignore          # Đã được cập nhật cho gh-pages
```

### 4. GitHub Actions Workflow:
- Trigger: Push vào branch `gh-pages`
- Build: Sử dụng `npm run build:gh-pages`
- Deploy: Tự động deploy lên GitHub Pages

### 5. Troubleshooting:

#### Nếu vẫn bị trắng trang:
1. Kiểm tra Console trong Developer Tools
2. Kiểm tra Network tab xem có lỗi load file nào không
3. Kiểm tra file `index.html` có đúng cấu trúc không

#### Nếu có lỗi build:
1. Kiểm tra environment variables trong GitHub Secrets
2. Kiểm tra logs trong GitHub Actions
3. Test build locally trước

### 6. URL sau khi deploy:
```
https://huygoodboy.github.io/yogalanding/
```

## Lưu ý quan trọng:
- Branch `gh-pages` sẽ chỉ chứa files build, không chứa source code
- Mỗi lần push vào `gh-pages` sẽ trigger deploy tự động
- Có thể cần vài phút để deploy hoàn tất
