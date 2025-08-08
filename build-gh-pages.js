const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building for GitHub Pages...');

// Build the project
console.log('📦 Building project...');
execSync('npm run build:client', { stdio: 'inherit' });

// Copy all files from dist to root
console.log('📁 Copying build files to root...');
const distDir = path.join(__dirname, 'dist');
const rootDir = __dirname;

if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  files.forEach(file => {
    const srcPath = path.join(distDir, file);
    const destPath = path.join(rootDir, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      // Copy directory
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true });
      }
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  });
  console.log('✅ Build files copied to root');
} else {
  console.log('❌ Build directory not found');
  process.exit(1);
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

