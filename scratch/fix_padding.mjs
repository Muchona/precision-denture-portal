import fs from 'fs';

const files = [
  'src/pages/public/Contact.tsx',
  'src/pages/public/Products.tsx',
  'src/pages/public/Gallery.tsx',
  'src/pages/public/About.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/pt-28 pb-12 lg:pt-32 lg:pb-16/g, 'py-12 lg:py-16');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}
