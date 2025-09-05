import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Tìm tất cả file TypeScript và CSS
const files = glob.sync('client/**/*.{ts,tsx,css}');

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  
  // Thay thế các màu gradient
  content = content.replace(/from-purple-600 to-pink-600/g, 'from-yellow-500 to-yellow-600');
  content = content.replace(/from-purple-700 to-pink-700/g, 'from-yellow-600 to-yellow-700');
  content = content.replace(/from-purple-400 to-pink-400/g, 'from-yellow-400 to-yellow-500');
  
  // Thay thế các màu hover
  content = content.replace(/hover:text-purple-600/g, 'hover:text-yellow-600');
  content = content.replace(/border-purple-200/g, 'border-yellow-200');
  content = content.replace(/text-purple-600/g, 'text-yellow-600');
  content = content.replace(/hover:bg-purple-50/g, 'hover:bg-yellow-50');
  content = content.replace(/border-purple-600/g, 'border-yellow-600');
  
  // Thay thế các màu background
  content = content.replace(/bg-purple-400/g, 'bg-yellow-400');
  content = content.replace(/bg-pink-400/g, 'bg-yellow-500');
  content = content.replace(/bg-indigo-400/g, 'bg-yellow-600');
  
  writeFileSync(file, content);
  console.log(`Updated: ${file}`);
});

console.log('Color replacement completed!');

