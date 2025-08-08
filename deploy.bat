@echo off
echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build the project
echo 🔨 Building the project...
call npm run build:client

REM Check if build was successful
if not exist "dist\spa" (
    echo ❌ Error: Build failed. dist/spa directory not found.
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📁 Built files are in dist/spa/
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub
echo 2. Enable GitHub Pages in your repository settings
echo 3. Add your Supabase environment variables as GitHub secrets:
echo    - VITE_SUPABASE_URL
echo    - VITE_SUPABASE_ANON_KEY
echo 4. The GitHub Actions workflow will automatically deploy your app
echo.
echo 🌐 Your app will be available at: https://your-username.github.io/your-repo-name
pause
