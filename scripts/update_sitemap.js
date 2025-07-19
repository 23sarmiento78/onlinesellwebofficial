// scripts/update_sitemap.js
// Actualiza el sitemap con los artículos generados por IA

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../src/content/articulos');
const SITEMAP_PATH = path.resolve(__dirname, '../public/optimized-sitemap.xml');
const SITE_URL = 'https://service.hgaruna.org';

function getArticleSlugs() {
  return fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

function generateSitemap(urls) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      url => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`;
}

function main() {
  const slugs = getArticleSlugs();
  const urls = slugs.map(slug => `${SITE_URL}/articulos/${slug}`);
  // Puedes agregar aquí otras URLs estáticas si lo deseas
  const sitemap = generateSitemap(urls);
  fs.writeFileSync(SITEMAP_PATH, sitemap);
  console.log('Sitemap actualizado:', SITEMAP_PATH);
}

main();
