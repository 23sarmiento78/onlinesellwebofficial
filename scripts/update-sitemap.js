// scripts/update-sitemap.js
// Regenera public/sitemap.xml incluyendo páginas principales y /blog/*.html

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog');

const SITE_URL = process.env.SITE_URL || 'https://example.com';

function url(loc, lastmod, priority = '0.6', changefreq = 'weekly') {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  await fs.ensureDir(PUBLIC_DIR);
  await fs.ensureDir(BLOG_DIR);

  const urls = [];

  // Páginas principales conocidas (ajusta según tu sitio)
  const mainPages = [
    '/',
    '/articulos',
    '/ebook',
    '/recursos',
    '/contacto'
  ];
  for (const p of mainPages) urls.push(url(p, null, '0.8', 'weekly'));

  // Artículos
  const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const full = path.join(BLOG_DIR, f);
    const stat = await fs.stat(full);
    const lastmod = stat.mtime.toISOString();
    urls.push(url(`/blog/${f}`, lastmod, '0.7', 'weekly'));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
urls.join('\n') +
`\n</urlset>\n`;

  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`✅ Sitemap actualizado con ${urls.length} URLs`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Error actualizando sitemap:', err);
    process.exit(1);
  });
}
