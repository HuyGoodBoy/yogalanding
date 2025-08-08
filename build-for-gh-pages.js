const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for GitHub Pages...');

// Build the project
console.log('📦 Building project...');
execSync('npm run build:client', { stdio: 'inherit' });

// Copy index.html to root
console.log('📄 Copying index.html to root...');
const buildIndexPath = path.join(__dirname, 'dist', 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');

if (fs.existsSync(buildIndexPath)) {
  fs.copyFileSync(buildIndexPath, rootIndexPath);
  console.log('✅ index.html copied to root');
} else {
  console.log('❌ Build index.html not found');
  process.exit(1);
}

// Copy assets to root
console.log('📁 Copying assets to root...');
const assetsDir = path.join(__dirname, 'dist', 'assets');
const rootAssetsDir = path.join(__dirname, 'assets');

if (fs.existsSync(assetsDir)) {
  if (!fs.existsSync(rootAssetsDir)) {
    fs.mkdirSync(rootAssetsDir, { recursive: true });
  }
  
  const files = fs.readdirSync(assetsDir);
  files.forEach(file => {
    const srcPath = path.join(assetsDir, file);
    const destPath = path.join(rootAssetsDir, file);
    fs.copyFileSync(srcPath, destPath);
  });
  console.log('✅ Assets copied to root');
}

// Copy .gitignore-gh-pages to .gitignore
console.log('📄 Setting up .gitignore for gh-pages...');
const gitignoreGhPages = path.join(__dirname, '.gitignore-gh-pages');
const gitignore = path.join(__dirname, '.gitignore');

if (fs.existsSync(gitignoreGhPages)) {
  fs.copyFileSync(gitignoreGhPages, gitignore);
  console.log('✅ .gitignore updated for gh-pages');
}

console.log('🎉 Build for GitHub Pages completed!');
console.log('📋 Next steps:');
console.log('1. Commit and push to gh-pages branch');
console.log('2. Enable GitHub Pages in repository settings');
console.log('3. Set source to gh-pages branch');
