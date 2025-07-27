// scripts/update_sitemap.js
// Actualiza el sitemap con los artículos HTML generados por IA

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../public/blog');
const SITEMAP_PATH = path.resolve(__dirname, '../public/optimized-sitemap.xml');
const SITE_URL = process.env.SITE_URL || 'https://hgaruna.org';

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

function generateSitemap(articles) {
  const now = new Date().toISOString();
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/contacto', priority: '0.7', changefreq: 'monthly' },
    { url: '/planes', priority: '0.8', changefreq: 'monthly' }
  ];

  // Generar entradas para páginas estáticas
  const staticPages = pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  // Generar entradas para artículos
  const articleEntries = articles.map(article => {
    const lastmod = article.lastmod || now;
    return `
  <url>
    <loc>${SITE_URL}/blog/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticPages}${articleEntries}
</urlset>`;
}

async function getArticleMetadata(slug) {
  try {
    const filePath = path.join(ARTICLES_DIR, `${slug}.html`);
    const content = fs.readFileSync(filePath, 'utf8');
    const lastmod = fs.statSync(filePath).mtime.toISOString();
    
    // Extraer título del artículo para mejor legibilidad en logs
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace('| Blog IA - hgaruna', '').trim() : slug;
    
    return {
      slug: slug.replace(/\.html$/, ''),
      lastmod,
      title
    };
  } catch (error) {
    console.error(`❌ Error procesando artículo ${slug}:`, error.message);
    return null;
  }
}

async function main() {
  try {
    console.log('🔄 Iniciando actualización del sitemap...');
    
    // Obtener slugs de artículos
    const slugs = getArticleSlugs();
    console.log(`📝 Encontrados ${slugs.length} artículos HTML`);
    
    // Obtener metadatos de cada artículo
    const articles = [];
    for (const slug of slugs) {
      const metadata = await getArticleMetadata(slug);
      if (metadata) {
        articles.push(metadata);
        console.log(`  - ${metadata.title}`);
      }
    }
    
    // Generar sitemap
    const sitemap = generateSitemap(articles);
    fs.writeFileSync(SITEMAP_PATH, sitemap);
    
    console.log(`\n✅ Sitemap actualizado: ${SITEMAP_PATH}`);
    console.log(`📊 Total de URLs: ${articles.length + 4} (incluyendo páginas principales)`);
    
  } catch (error) {
    console.error('❌ Error actualizando sitemap:', error);
    process.exit(1);
  }
}

main();
