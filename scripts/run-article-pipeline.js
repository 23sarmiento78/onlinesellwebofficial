#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import { load as loadHtml } from 'cheerio';
import MarkdownIt from 'markdown-it';

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
    .slice(0, 48);
}

function shortenForSeo(title, maxLen = 60) {
  if (!title) return '';
  // Quitar año largo y frases redundantes
  let t = title.replace(/\b(una\s+gu[ií]a\s+completa\s+para\s+\d{4}|gu[ií]a\s+completa\s+para\s+\d{4})\b/gi, '').replace(/\s{2,}/g, ' ').trim();
  if (t.length <= maxLen) return t;
  // Cortar por palabra
  const cut = t.slice(0, maxLen + 1);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut.slice(0, maxLen)).replace(/[\s,:;.-]+$/, '');
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
  // 1) Wikimedia Commons (namespace 6 = File), imágenes raster
  const commons = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(topic)}&gsrlimit=10&prop=imageinfo&iiprop=url|extmetadata&format=json&origin=*`;
  try {
    const res = await fetch(commons);
    if (res.ok) {
      const json = await res.json();
      const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
      for (const p of pages) {
        const ii = p.imageinfo?.[0];
        if (!ii?.url) continue;
        const url = ii.url;
        const pathname = new URL(url).pathname;
        const ext = (path.extname(pathname) || '').toLowerCase();
        if (!/(\.jpe?g|\.png|\.webp)$/.test(ext)) continue;
        const attribution = ii.extmetadata?.Artist?.value || p.title || 'Wikimedia Commons';
        return { url, ext, attribution, source: 'Wikimedia Commons' };
      }
    }
  } catch {}

  // 2) Wikipedia: buscar página relacionada y tomar imagen principal
  try {
    const wikiSearch = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=1&format=json&origin=*`;
    const sres = await fetch(wikiSearch);
    if (sres.ok) {
      const sjson = await sres.json();
      const pageTitle = sjson?.query?.search?.[0]?.title;
      if (pageTitle) {
        const imgApi = `https://es.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&pithumbsize=1200&format=json&origin=*`;
        const ires = await fetch(imgApi);
        if (ires.ok) {
          const ijson = await ires.json();
          const pages = ijson?.query?.pages ? Object.values(ijson.query.pages) : [];
          for (const p of pages) {
            const thumb = p?.thumbnail?.source;
            if (thumb) {
              const pathname = new URL(thumb).pathname;
              const ext = (path.extname(pathname) || '.jpg').toLowerCase();
              if (/(\.jpe?g|\.png|\.webp)$/.test(ext)) {
                return { url: thumb, ext, attribution: pageTitle, source: 'Wikipedia' };
              }
            }
          }
        }
      }
    }
  } catch {}

  // 3) Fallback local
  return { url: '/logos-he-imagenes/programacion.jpeg', ext: '.jpg', attribution: 'Default', source: 'Local' };
}

async function downloadImageToPublic(url, slug, ext) {
  if (url.startsWith('/')) return url; // imagen local
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Image download failed ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const outRel = path.join('images', 'articles', `${slug}${ext}`);
    const outAbs = path.join(ROOT, 'public', outRel);
    await fs.ensureDir(path.dirname(outAbs));
    await fs.writeFile(outAbs, buf);
    return `/${outRel.replace(/\\/g, '/')}`;
  } catch (e) {
    // fallback a local placeholder si descarga falla
    return '/logos-he-imagenes/programacion.jpeg';
  }
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
  return text.trim(); // Puede venir en Markdown
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

  // 2) Generar artículo (Markdown o HTML) con Gemini y convertir a HTML si es necesario
  const articleBody = await generateArticleWithGemini(TOPIC, CATEGORY, keywords);
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
  // Heurística: si contiene encabezados markdown o code fences, lo tratamos como MD
  const looksLikeMd = /(^|\n)\s{0,3}(#{1,6}\s|```|\*\s|\d+\.\s)/.test(articleBody);
  const articleHtml = looksLikeMd ? md.render(articleBody) : articleBody;

  // 3) Título y resumen (derivar si hace falta)
  // Extraer primer H1/H2 como título si no se provee explícito
  const $ = loadHtml(`<main>${articleHtml}</main>`);
  const derivedTitle = $('h1').first().text().trim() || $('h2').first().text().trim() || TOPIC;
  // Obtener el primer párrafo significativo
  let rawExcerpt = $('p').map((i, el) => $(el).text().trim()).get().find(t => t && t.length > 40) || $('p').first().text().trim() || '';
  // Sanitizar: eliminar placeholders tipo {result} y prefijos como "Meta Description:"
  rawExcerpt = rawExcerpt.replace(/\{[^}]*\}/g, '').replace(/^meta\s*description\s*:\s*/i, '').trim();
  const excerpt = (rawExcerpt || `Guía sobre ${TOPIC}`).replace(/\s+/g, ' ').slice(0, 160);

  // 4) Imagen destacada y atribución
  // Definir título SEO corto y basar el slug en él para evitar nombres de archivo demasiado largos
  const seoTitle = shortenForSeo(derivedTitle, 60);
  const slug = toSlug(seoTitle);
  const imgInfo = await fetchImage(TOPIC);
  const featuredImage = await downloadImageToPublic(imgInfo.url, slug, imgInfo.ext);

  // 5) Rellenar plantilla
  const now = new Date();
  const publishDate = now.toISOString().split('T')[0];
  const canonical = SITE_URL ? new URL(`/blog/${slug}.html`, SITE_URL).toString() : `/blog/${slug}.html`;
  const tagsHtml = tagsHtmlFromKeywords(keywords);
  // featured img relativa para <img> y absoluta para OG
  const ogImageUrl = SITE_URL ? new URL(featuredImage, SITE_URL).toString() : featuredImage;

  const filled = applyTemplate(template, {
    SEO_TITLE: seoTitle,
    SEO_DESCRIPTION: excerpt,
    SEO_KEYWORDS: keywords.join(', '),
    FEATURED_IMAGE: featuredImage,
    OG_IMAGE_URL: ogImageUrl,
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
    ARTICLE_CONTENT: articleHtml + `\n\n<p style=\"color:#a0abc6;font-size:12px\">Crédito de imagen: ${imgInfo.attribution} (${imgInfo.source})</p>`,
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
