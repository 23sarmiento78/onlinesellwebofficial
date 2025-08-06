// Script para eliminar por completo la sección de Artículos Relacionados de todos los HTML de /public/blog/
// Borra desde <section class="related-articles ...> hasta </section>
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../public/blog');

function removeRelatedArticles(html) {
  // Elimina cualquier bloque <section class="related-articles ...> ... </section>
  return html.replace(/<section class="related-articles[\s\S]*?<\/section>/gi, '');
}

function main() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const cleaned = removeRelatedArticles(html);
    fs.writeFileSync(filePath, cleaned, 'utf8');
    console.log('Eliminado relacionados en:', file);
  }
  console.log('¡Se eliminaron todas las secciones de Artículos Relacionados!');
}

main();
