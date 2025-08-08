import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Deploying to GitHub Pages...');

// Build the project
console.log('📦 Building project...');
execSync('npm run build:client', { stdio: 'inherit' });

// Check if we're on gh-pages branch
const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
console.log(`📍 Current branch: ${currentBranch}`);

if (currentBranch !== 'gh-pages') {
  console.log('🔄 Switching to gh-pages branch...');
  execSync('git checkout gh-pages', { stdio: 'inherit' });
}

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

// Add and commit changes
console.log('📝 Committing changes...');
execSync('git add .', { stdio: 'inherit' });
execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });

// Push to gh-pages branch
console.log('🚀 Pushing to gh-pages branch...');
execSync('git push origin gh-pages', { stdio: 'inherit' });

console.log('🎉 Deploy completed!');
console.log('📋 Next steps:');
console.log('1. Go to GitHub repository settings');
console.log('2. Navigate to Pages section');
console.log('3. Set source to "Deploy from a branch"');
console.log('4. Select "gh-pages" branch');
console.log('5. Set folder to "/ (root)"');
console.log('6. Click Save');
console.log('');
console.log('🌐 Your app will be available at: https://huygoodboy.github.io/yogalanding/');

