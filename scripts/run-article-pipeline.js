#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import { load as loadHtml } from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'public', 'blog');
const DATA_DIR = path.join(ROOT, 'public', 'data');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SITE_URL = process.env.SITE_URL || process.env.VERCEL_URL || '';
const TOPIC = process.env.ARTICLE_TOPIC || 'Buenas prácticas de React y rendimiento';
const CATEGORY = process.env.ARTICLE_CATEGORY || 'Frontend';

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

function tagsHtmlFromKeywords(keywords) {
  return (keywords || []).slice(0, 8)
    .map(k => `<span class="tag">#${k}</span>`) // coincide con template
    .join('\n        ');
}

async function fetchKeywords(topic) {
  // Usa Google Suggest para obtener keywords relacionadas
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(topic)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Keyword fetch failed ${res.status}`);
  const data = await res.json();
  const suggestions = Array.isArray(data) ? data[1] : [];
  const base = topic.toLowerCase();
  // Agrega variantes útiles para SEO
  const extras = ['guía', 'tutorial', 'mejores prácticas', 'ejemplos', 'rendimiento', 'principiantes', '2025'];
  return Array.from(new Set([topic, ...suggestions, ...extras.map(e => `${base} ${e}`)])).slice(0, 15);
}

async function fetchImage(topic) {
  // Busca en Wikimedia Commons (sin API key)
  const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(topic)}&gsrlimit=5&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
  const res = await fetch(api);
  if (!res.ok) throw new Error(`Image search failed ${res.status}`);
  const json = await res.json();
  const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii?.url) continue;
    const url = ii.url;
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    const attribution = ii.extmetadata?.Artist?.value || p.title || 'Wikimedia Commons';
    return { url, ext, attribution, source: 'Wikimedia Commons' };
  }
  // Fallback a una imagen local
  return { url: '/logos-he-imagenes/programacion.jpeg', ext: '.jpg', attribution: 'Default', source: 'Local' };
}

async function downloadImageToPublic(url, slug, ext) {
  if (url.startsWith('/')) return url; // imagen local
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Image download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const outRel = path.join('images', 'articles', `${slug}${ext}`);
  const outAbs = path.join(ROOT, 'public', outRel);
  await fs.ensureDir(path.dirname(outAbs));
  await fs.writeFile(outAbs, buf);
  return `/${outRel.replace(/\\/g, '/')}`;
}

async function generateArticleWithGemini(topic, category, keywords) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no está configurada');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Eres un redactor técnico senior. Escribe un artículo educativo y apto para Google AdSense, con excelente SEO on-page, sobre: "${topic}".

Requisitos:
- Tono claro y profesional, en español neutro.
- Incluye introducción, secciones con subtítulos H2/H3, código cuando aporte valor, mejores prácticas, errores comunes y conclusión.
- Longitud objetivo: 1200-1500 palabras.
- Usa las siguientes palabras clave cuando sea natural: ${keywords.join(', ')}.
- Incluye un resumen breve (1-2 oraciones) que servirá para meta description.
- No incluyas HTML <html> ni <head>; solo el cuerpo del artículo con H2/H3, p, pre/code, listas, etc.
- No escribas metadatos, solo el contenido del artículo.
`;

  const { response } = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  const text = response.text();
  return text.trim();
}

function applyTemplate(templateHtml, data) {
  let out = templateHtml;
  for (const [k, v] of Object.entries(data)) {
    out = out.replaceAll(`{{${k}}}`, v ?? '');
  }
  return out;
}

async function updateSitemap(newPath, siteUrl) {
  const sitemapPath = path.join(ROOT, 'public', 'sitemap.xml');
  const url = siteUrl ? new URL(newPath, siteUrl).toString() : newPath;
  const lastmod = new Date().toISOString();
  const entry = `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;

  let xml;
  if (await fs.pathExists(sitemapPath)) {
    xml = await fs.readFile(sitemapPath, 'utf8');
    if (xml.includes(`<loc>${url}</loc>`)) return; // ya existe
    xml = xml.replace('</urlset>', `${entry}\n</urlset>`);
  } else {
    xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entry}\n</urlset>\n`;
  }
  await fs.writeFile(sitemapPath, xml, 'utf8');
}

async function main() {
  await fs.ensureDir(BLOG_DIR);
  await fs.ensureDir(DATA_DIR);

  const templatePath = path.join(TEMPLATES_DIR, 'article-template.html');
  const template = await fs.readFile(templatePath, 'utf8');

  // 1) Keywords SEO
  const keywords = await fetchKeywords(TOPIC);

  // 2) Generar artículo (cuerpo HTML) con Gemini
  const articleHtml = await generateArticleWithGemini(TOPIC, CATEGORY, keywords);

  // 3) Título y resumen (derivar si hace falta)
  // Extraer primer H1/H2 como título si no se provee explícito
  const $ = loadHtml(`<main>${articleHtml}</main>`);
  const derivedTitle = $('h1').first().text().trim() || $('h2').first().text().trim() || TOPIC;
  const excerpt = $('p').first().text().trim().slice(0, 160) || `Guía sobre ${TOPIC}`;

  // 4) Imagen destacada y atribución
  const slug = toSlug(derivedTitle);
  const imgInfo = await fetchImage(TOPIC);
  const featuredImage = await downloadImageToPublic(imgInfo.url, slug, imgInfo.ext);

  // 5) Rellenar plantilla
  const now = new Date();
  const publishDate = now.toISOString().split('T')[0];
  const canonical = SITE_URL ? new URL(`/blog/${slug}.html`, SITE_URL).toString() : `/blog/${slug}.html`;
  const tagsHtml = tagsHtmlFromKeywords(keywords);

  const filled = applyTemplate(template, {
    SEO_TITLE: derivedTitle,
    SEO_DESCRIPTION: excerpt,
    SEO_KEYWORDS: keywords.join(', '),
    FEATURED_IMAGE: featuredImage,
    CANONICAL_URL: canonical,
    CATEGORY: CATEGORY,
    EDUCATIONAL_LEVEL: 'Intermedio',
    READING_TIME: '8 min',
    TITLE: derivedTitle,
    ARTICLE_TITLE: derivedTitle,
    ARTICLE_SUMMARY: excerpt,
    AUTHOR: 'hgaruna',
    WORD_COUNT: '1300',
    TAGS_HTML: tagsHtml,
    ARTICLE_CONTENT: articleHtml + `\n\n<p style="color:#a0abc6;font-size:12px">Crédito de imagen: ${imgInfo.attribution} (${imgInfo.source})</p>`,
    PUBLISH_DATE: publishDate
  });

  // 6) Guardar
  const outPath = path.join(BLOG_DIR, `${slug}.html`);
  await fs.writeFile(outPath, filled, 'utf8');

  // 7) Actualizar sitemap
  await updateSitemap(`/blog/${slug}.html`, SITE_URL);

  console.log(`✅ Artículo generado: /blog/${slug}.html`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    console.error('❌ Error en pipeline de artículo:', err);
    process.exit(1);
  });
}
