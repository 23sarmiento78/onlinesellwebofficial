const fs = require('fs');
const path = require('path');

// Configuración específica para Villa Carlos Paz
const localConfig = {
  baseUrl: 'https://service.hgaruna.org',
  pages: [
    '/',
    '/planes/',
    '/foro/',
    '/foro/articulos/',
    '/legal/'
  ]
};

function generateLocalSitemap() {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${localConfig.pages.map(page => `  <url>
    <loc>${localConfig.baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/local-sitemap.xml');
  fs.writeFileSync(outputPath, sitemapContent);
  console.log('Sitemap local generado en:', outputPath);
}

generateLocalSitemap();