// scripts/republicar-articulos-con-categorias.js
// Añade o actualiza la meta categoría en todos los HTML de public/blog
// y asigna nuevas categorías de forma cíclica para diversificar el blog

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const CATEGORIES = [
  'Frontend',
  'Backend',
  'DevOps y Cloud',
  'Testing y Calidad',
  'Seguridad',
  'Bases de Datos',
  'Inteligencia Artificial',
  'Mobile',
  'UX/UI',
  'Cloud Native'
];

function updateCategoryMeta(html, category) {
  // Si ya existe meta category, reemplazarla
  if (/<meta[^>]*name=["']category["'][^>]*>/i.test(html)) {
    return html.replace(
      /(<meta[^>]*name=["']category["'][^>]*content=["'])([^"']+)(["'][^>]*>)/i,
      `$1${category}$3`
    );
  }
  // Si no existe, insertar después del <head> o al principio del <html>
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(
      /(<head[^>]*>)/i,
      `$1\n    <meta name="category" content="${category}">`
    );
  }
  // Si no hay <head>, insertar al principio
  return `<meta name="category" content="${category}">\n` + html;
}

function republicar() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  let count = 0;
  files.forEach((file, i) => {
    const filePath = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    // Asignar categoría cíclicamente
    const category = CATEGORIES[i % CATEGORIES.length];
    const updated = updateCategoryMeta(html, category);

    // Extraer título del artículo
    let titleMatch = updated.match(/<h1[^>]*>([^<]+)<\/h1>/i) || updated.match(/<h2[^>]*>([^<]+)<\/h2>/i);
    let title = titleMatch ? titleMatch[1] : file.replace(/\.html$/, '');
    // Generar slug corto
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 20);
    let newFileName = slug + '.html';
    let newFilePath = path.join(BLOG_DIR, newFileName);

    // Renombrar archivo si el nombre cambia
    if (newFileName !== file) {
      fs.writeFileSync(newFilePath, updated, 'utf-8');
      fs.unlinkSync(filePath);
      console.log(`✅ ${file} → ${newFileName} | categoría: ${category}`);
    } else {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`✅ ${file} (sin cambio de nombre) | categoría: ${category}`);
    }
    count++;
  });
  console.log(`\nListo. ${count} artículos renombrados y actualizados con nuevas categorías.`);
}

republicar();
