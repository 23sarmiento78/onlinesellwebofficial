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

//
function inferCategory({ title = '', keywords = [] }, text = '') {
  const t = `${title} ${keywords.join(' ')} ${text}`.toLowerCase();
  if (/(react|vue|angular|frontend|css|html|javascript(?!\s*node))/i.test(t)) return 'Frontend';
  if (/(node|express|django|flask|spring|backend|api|graphql)/i.test(t)) return 'Backend';
  if (/(devops|docker|kubernetes|k8s|aws|azure|gcp|cloud|ci\/cd)/i.test(t)) return 'DevOps y Cloud';
  if (/(performance|optimiza|web vitals|lighthouse)/i.test(t)) return 'Performance y Optimización';
  if (/(arquitectura|patrones|ddd|microservicios|clean architecture|design pattern)/i.test(t)) return 'Arquitectura y Patrones';
  if (/(database|sql|postgres|mysql|mongodb|redis)/i.test(t)) return 'Bases de Datos';
  if (/(test|jest|cypress|qa|quality)/i.test(t)) return 'Testing y Calidad';
  if (/(productividad|herramientas|vscode|tips|trucos|workflow)/i.test(t)) return 'Herramientas y Productividad';
  if (/(ia|ai|machine learning|ml|deep learning|inteligencia artificial|gemini|openai)/i.test(t)) return 'Inteligencia Artificial';
  if (/(seguridad|security|owasp|auth|jwt)/i.test(t)) return 'Seguridad';
  if (/(tendencias|trend|futuro|roadmap)/i.test(t)) return 'Tendencias y Futuro';
  return 'Todos';
}
function processPlaceholders(text, fallbacks = {}) {
  if (!text || typeof text !== 'string') return text;

  const replacements = {
    '{{SEO_TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{SEO_DESCRIPTION}}': fallbacks.description || 'Artículo generado por inteligencia artificial',
    '{{SEO_KEYWORDS}}': fallbacks.keywords || 'desarrollo web, programación',
    '{{FEATURED_IMAGE}}': fallbacks.image || '/logos-he-imagenes/programacion.jpeg',
    '{{CANONICAL_URL}}': fallbacks.url || '#',
    '{{CATEGORY}}': fallbacks.category || 'General',
    '{{EDUCATIONAL_LEVEL}}': 'Intermedio',
    '{{READING_TIME}}': fallbacks.readingTime || '5 min',
    '{{TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{ARTICLE_TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{ARTICLE_SUMMARY}}': fallbacks.description || 'Artículo generado por inteligencia artificial',
    '{{AUTHOR}}': fallbacks.author || 'hgaruna',
    '{{WORD_COUNT}}': '800',
    '{{TAGS_HTML}}': fallbacks.tagsHtml || '',
    '{{ARTICLE_CONTENT}}': fallbacks.content || '',
    '{{PUBLISH_DATE}}': fallbacks.date || new Date().toISOString().split('T')[0]
  };

  let processed = text;
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    processed = processed.replaceAll(placeholder, replacement);
  }

  return processed;
}


function extractMeta($) {
  const rawTitle = $('head > title').first().text().trim() || $('h1, h2').first().text().trim();
  const rawDescription = $('meta[name="description"]').attr('content') || $('p').first().text().trim().slice(0, 160);
  const rawKeywords = ($('meta[name="keywords"]').attr('content') || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const rawAuthor = $('meta[name="author"]').attr('content') || 'hgaruna';
  const date = $('meta[name="date"]').attr('content') || $('time[datetime]').attr('datetime') || '';
//
  const category = $('meta[name="category"]').attr('content')
    || $('meta[property="article:section"]').attr('content')
    || '';
  // Eliminadas declaraciones duplicadas
  const rawExcerpt = $('main p').first().text().trim() || $('p').first().text().trim();
  const contentText = $('main').text() || $('body').text();
  const readingTime = estimateReadingTime(contentText);

  // Procesar placeholders
  const title = processPlaceholders(rawTitle, { title: 'Artículo de Desarrollo' });
  const description = processPlaceholders(rawDescription, { description: 'Artículo generado por inteligencia artificial' });
  const keywords = rawKeywords.map(k => processPlaceholders(k, { keywords: 'desarrollo web' })).filter(k => !k.includes('{{'));
  const author = processPlaceholders(rawAuthor, { author: 'hgaruna' });
  const excerpt = processPlaceholders(rawExcerpt, { description });

  return { title, description, keywords, author, date, category, excerpt, readingTime };
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

      const category = meta.category || inferCategory({ title: meta.title, keywords: meta.keywords }, $('main').text());
      const item = {
        id: slug,
        title: meta.title || nameNoExt,
        description: meta.description || meta.excerpt?.slice(0, 160) || '',
        excerpt: meta.excerpt || '',
        keywords: meta.keywords,
        tags: meta.keywords,
        author: meta.author,
        category,
        datePublished,
        lastmod,
        readingTime: meta.readingTime,
        path: `/blog/${file}`,
        image: processPlaceholders($('meta[property="og:image"]').attr('content') || '', { image: '/logos-he-imagenes/programacion.jpeg' })
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
