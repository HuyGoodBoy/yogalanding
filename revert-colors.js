import fs from 'fs';
import path from 'path';

// Mapping từ màu vàng về màu hồng/tím
const colorMappings = [
  // Yellow to Purple/Pink
  { from: 'text-yellow-600', to: 'text-purple-600' },
  { from: 'text-yellow-500', to: 'text-purple-600' },
  { from: 'text-yellow-700', to: 'text-purple-700' },
  { from: 'hover:text-yellow-600', to: 'hover:text-purple-600' },
  { from: 'hover:text-yellow-700', to: 'hover:text-purple-700' },
  { from: 'bg-yellow-600', to: 'bg-purple-600' },
  { from: 'bg-yellow-500', to: 'bg-purple-600' },
  { from: 'bg-yellow-50', to: 'bg-purple-50' },
  { from: 'border-yellow-200', to: 'border-purple-200' },
  { from: 'border-yellow-600', to: 'border-purple-600' },
  { from: 'from-yellow-500', to: 'from-purple-600' },
  { from: 'to-yellow-600', to: 'to-pink-600' },
  { from: 'hover:from-yellow-700', to: 'hover:from-purple-700' },
  { from: 'hover:to-yellow-700', to: 'hover:to-pink-700' },
  { from: 'group-hover:text-yellow-600', to: 'group-hover:text-purple-600' },
  { from: 'hover:bg-yellow-50', to: 'hover:bg-purple-50' },
  { from: 'hover:text-yellow-600', to: 'hover:text-purple-600' },
  { from: 'hover:text-yellow-700', to: 'hover:text-purple-700' },
];

// Files to process
const filesToProcess = [
  'client/pages/Index.tsx',
  'client/pages/Login.tsx',
  'client/pages/Register.tsx',
  'client/pages/CourseDetail.tsx',
  'client/pages/Payment.tsx',
  'client/pages/PaymentSuccess.tsx',
  'client/pages/Recharge.tsx',
  'client/pages/Admin.tsx',
  'client/pages/CreateCourse.tsx',
  'client/pages/TransactionHistory.tsx',
  'client/pages/MyCourses.tsx',
  'client/pages/SubscriptionPayment.tsx',
  'client/pages/PaymentManual.tsx',
  'client/App.tsx',
  'client/global.css'
];

function replaceColorsInFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    colorMappings.forEach(mapping => {
      const regex = new RegExp(mapping.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      if (content.includes(mapping.from)) {
        content = content.replace(regex, mapping.to);
        hasChanges = true;
        console.log(`  ✓ Replaced ${mapping.from} → ${mapping.to}`);
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

console.log('🔄 Reverting colors from yellow back to purple/pink...\n');

filesToProcess.forEach(file => {
  console.log(`Processing: ${file}`);
  replaceColorsInFile(file);
  console.log('');
});

console.log('🎨 Color reversion completed!');
