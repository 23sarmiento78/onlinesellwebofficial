// scripts/generate-blog-index.js
// Genera un index.json robusto con la lista de archivos HTML en public/blog

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const OUTPUT_FILE = path.resolve(BLOG_DIR, 'index.json');

function generateIndex() {
  try {
    if (!fs.existsSync(BLOG_DIR)) {
      console.error('❌ No existe el directorio public/blog');
      process.exit(1);
    }
    // Leer solo archivos .html, ignorar otros
    let files = fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.html'));
    // Ordenar alfabéticamente para consistencia
    files = files.sort((a, b) => a.localeCompare(b));
    // Chequear permisos de escritura
    try {
      fs.accessSync(BLOG_DIR, fs.constants.W_OK);
    } catch {
      console.error('❌ No hay permisos de escritura en public/blog');
      process.exit(1);
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(files, null, 2), 'utf-8');
    console.log(`✅ Generado index.json con ${files.length} archivos en public/blog`);
    if (files.length === 0) {
      console.warn('⚠️ Advertencia: No se encontraron archivos HTML en public/blog');
    }
  } catch (err) {
    console.error('❌ Error generando index.json:', err.message);
    process.exit(1);
  }
}

generateIndex();
