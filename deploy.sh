#!/bin/bash

# Deploy script for Thuý An Yoga Landing Page
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build:client

# Check if build was successful
if [ ! -d "dist/spa" ]; then
    echo "❌ Error: Build failed. dist/spa directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Built files are in dist/spa/"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Enable GitHub Pages in your repository settings"
echo "3. Add your Supabase environment variables as GitHub secrets:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "4. The GitHub Actions workflow will automatically deploy your app"
echo ""
echo "🌐 Your app will be available at: https://your-username.github.io/your-repo-name"
