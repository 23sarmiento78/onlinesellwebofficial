// scripts/regenerate-blog-index.js
// Regenera el index.json de public/blog con los nombres actuales de los archivos HTML

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const INDEX_PATH = path.join(BLOG_DIR, 'index.json');

function regenerateIndex() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html'))
    .sort();
  const articles = files.map(file => {
    const filePath = path.join(BLOG_DIR, file);
    const html = fs.readFileSync(filePath, 'utf-8');
    // Extraer metadatos
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : file.replace(/\.html$/, '');
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const description = descMatch ? descMatch[1] : '';
    const catMatch = html.match(/<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const category = catMatch ? catMatch[1] : '';
    const kwMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const keywords = kwMatch ? kwMatch[1] : '';
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const author = authorMatch ? authorMatch[1] : '';
    const dateMatch = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const date = dateMatch ? dateMatch[1] : '';
    return {
      filename: file,
      title,
      description,
      category,
      keywords,
      author,
      date
    };
  });
  fs.writeFileSync(INDEX_PATH, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`✅ index.json actualizado con ${articles.length} artículos y metadatos.`);
}

regenerateIndex();
