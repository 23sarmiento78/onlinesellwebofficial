// scripts/generate-blog-index.js
// Genera un index.json con la lista de archivos HTML en public/blog

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const OUTPUT_FILE = path.resolve(BLOG_DIR, 'index.json');

function generateIndex() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error('❌ No existe el directorio public/blog');
    process.exit(1);
  }
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html'));
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(files, null, 2), 'utf-8');
  console.log(`✅ Generado index.json con ${files.length} archivos en public/blog`);
}

generateIndex();
