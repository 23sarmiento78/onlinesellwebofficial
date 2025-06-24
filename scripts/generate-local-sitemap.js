const fs = require('fs');
const path = require('path');

// Configuración específica para Villa Carlos Paz
const localConfig = {
  baseUrl: 'https://service.hgaruna.org',
  localKeywords: [
    'desarrollo-web-villa-carlos-paz',
    'diseno-web-carlos-paz',
    'marketing-digital-cordoba',
    'seo-local-villa-carlos-paz',
    'mantenimiento-web-cordoba',
    'ecommerce-villa-carlos-paz',
    'programacion-web-carlos-paz',
    'sitios-web-profesionales-villa-carlos-paz'
  ],
  pages: [
    '/',
    '/planes/',
    '/mi-experiencia/',
    '/blog/',
    '/legal/',
    '/blog/desarrollo-web-profesional-en-villa-carlos-paz-potenciando-negocios-locales/'
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
${localConfig.localKeywords.map(keyword => `  <url>
    <loc>${localConfig.baseUrl}/blog/${keyword}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

  const outputPath = path.join(__dirname, '../public/local-sitemap.xml');
  fs.writeFileSync(outputPath, sitemapContent);
  console.log('Sitemap local generado en:', outputPath);
}

generateLocalSitemap(); 