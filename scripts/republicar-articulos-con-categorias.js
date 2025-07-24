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
    fs.writeFileSync(filePath, updated, 'utf-8');
    count++;
    console.log(`✅ ${file} → categoría: ${category}`);
  });
  console.log(`\nListo. ${count} artículos actualizados con nuevas categorías.`);
}

republicar();
