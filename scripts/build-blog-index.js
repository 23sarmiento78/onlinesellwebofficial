// scripts/build-blog-index.js
// Genera public/blog/index.json y public/data/blog-index.json recorriendo public/blog/*.html

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { load as loadHtml } from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const DATA_DIR = path.resolve(__dirname, '../public/data');

function toSlug(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function estimateReadingTime(text) {
  const words = String(text || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractMeta($) {
  const title = $('head > title').first().text().trim() || $('h1, h2').first().text().trim();
  const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim().slice(0, 160);
  const keywords = ($('meta[name="keywords"]').attr('content') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const author = $('meta[name="author"]').attr('content') || 'hgaruna.com';
  const date = $('meta[name="date"]').attr('content') || $('time[datetime]').attr('datetime') || '';
  const excerpt = $('main p').first().text().trim() || $('p').first().text().trim();
  const contentText = $('main').text() || $('body').text();
  const readingTime = estimateReadingTime(contentText);
  return { title, description, keywords, author, date, excerpt, readingTime };
}

async function main() {
  await fs.ensureDir(BLOG_DIR);
  await fs.ensureDir(DATA_DIR);

  const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith('.html'));

  const items = [];
  for (const file of files) {
    try {
      const full = path.join(BLOG_DIR, file);
      const html = await fs.readFile(full, 'utf8');
      const $ = loadHtml(html);
      const meta = extractMeta($);

      const stat = await fs.stat(full);
      const lastmod = stat.mtime.toISOString();
      const datePublished = meta.date || lastmod;

      const nameNoExt = file.replace(/\.html$/i, '');
      const slug = toSlug(meta.title) || nameNoExt;

      const item = {
        id: slug,
        title: meta.title || nameNoExt,
        description: meta.description || meta.excerpt?.slice(0, 160) || '',
        excerpt: meta.excerpt || '',
        keywords: meta.keywords,
        tags: meta.keywords,
        author: meta.author,
        datePublished,
        lastmod,
        readingTime: meta.readingTime,
        path: `/blog/${file}`,
        image: $('meta[property="og:image"]').attr('content') || ''
      };
      items.push(item);
    } catch (e) {
      console.error(`Error procesando ${file}:`, e.message);
    }
  }

  // Ordenar por fecha descendente
  items.sort((a, b) => (new Date(b.datePublished).getTime() || 0) - (new Date(a.datePublished).getTime() || 0));

  // Mantener el esquema histórico de public/blog/index.json como array de archivos HTML
  const filenames = files;
  await fs.writeJson(path.join(BLOG_DIR, 'index.json'), filenames, { spaces: 2 });
  // Escribir el índice enriquecido solo en public/data/blog-index.json
  await fs.writeJson(path.join(DATA_DIR, 'blog-index.json'), items, { spaces: 2 });

  console.log(`✅ Índices generados: blog/index.json (${filenames.length} entradas) y data/blog-index.json (${items.length} artículos)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Error generando índices:', err);
    process.exit(1);
  });
}
