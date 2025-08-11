// scripts/update_sitemap.js
// Actualiza el sitemap con los artículos HTML generados por IA

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../public/blog');
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const SITE_URL = 'https://www.hgaruna.org'; // <-- CORRECCIÓN: Usar el dominio con 'www'

function getArticleSlugs() {
  try {
    return fs.readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith('.html'))
      .map(f => f.replace(/\.html$/, ''));
  } catch (error) {
    console.log('No se encontró el directorio de artículos, usando lista vacía');
    return [];
  }
}

function generateSitemap(urls) {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Páginas principales -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/public/blog</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contacto</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/planes</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Artículos del public/blog -->
${urls
    .map( // CORRECCIÓN: La URL pública no debe incluir '/public'
      url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n')}
</urlset>`;
}

function main() {
  try {
    const slugs = getArticleSlugs();
    const urls = slugs.map(slug => `${SITE_URL}/blog/${slug}.html`);
    
    console.log(`📝 Encontrados ${slugs.length} artículos HTML`);
    console.log('📄 URLs de artículos:');
    urls.forEach(url => console.log(`  - ${url}`));
    
    const sitemap = generateSitemap(urls);
    fs.writeFileSync(SITEMAP_PATH, sitemap);
    
    console.log(`✅ Sitemap actualizado: ${SITEMAP_PATH}`);
    console.log(`📊 Total de URLs: ${urls.length + 4} (incluyendo páginas principales)`);
    
  } catch (error) {
    console.error('❌ Error actualizando sitemap:', error);
  }
}

main();
