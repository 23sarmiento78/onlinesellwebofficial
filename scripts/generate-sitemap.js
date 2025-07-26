const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const SITE_URL = 'https://hgaruna.org'; // URL base de tu sitio (sin www para consistencia)

// 1. Definir las páginas estáticas importantes (extraídas de tu router)
const staticPages = [
  '/',
  '/blog',
  '/planes',
  '/legal',
  '/politicas-privacidad',
  '/contacto',
];

// 2. Encontrar dinámicamente todos los artículos del blog
const blogArticles = globSync('public/blog/*.html');

// 3. Construir el contenido del sitemap en formato XML
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Añadir las páginas estáticas
staticPages.forEach(page => {
  const pagePath = page === '/' ? '' : page;
  sitemapXml += `
  <url>
    <loc>${SITE_URL}${pagePath}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
});

// Añadir los artículos del blog
blogArticles.forEach(articlePath => {
  // Extrae el nombre del archivo (slug)
  const slug = path.basename(articlePath);
  // Obtiene la fecha de modificación real del archivo
  const stats = fs.statSync(articlePath);
  const lastMod = stats.mtime.toISOString().split('T')[0];

  sitemapXml += `
  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

sitemapXml += `
</urlset>`;

// 4. Escribir el archivo en la carpeta `public` con el nombre estándar
const sitemapPath = path.join('public', 'sitemap.xml');
try {
  fs.writeFileSync(sitemapPath, sitemapXml);
  console.log(`Sitemap generado exitosamente en ${sitemapPath}`);
} catch (error) {
  console.error(`Error al escribir el sitemap en ${sitemapPath}:`, error);
  process.exit(1);
}