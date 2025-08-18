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

const CATEGORY_LIST = [
  'Frontend',
  'Backend',
  'DevOps y Cloud',
  'Performance y Optimización',
  'Arquitectura y Patrones',
  'Bases de Datos',
  'Testing y Calidad',
  'Herramientas y Productividad',
  'Inteligencia Artificial',
  'Seguridad',
  'Tendencias y Futuro'
];

// Si no se proporciona un tema, pedimos a Gemini que proponga uno y además una categoría
async function proposeTopicAndCategory() {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Eres un editor técnico. Devuelve un JSON compacto con un tema atractivo y una categoría de esta lista exacta: ${CATEGORY_LIST.join(', ')}.
Formato estricto: {"title":"...","category":"..."}
Requisitos:
- El título debe ser educativo, actual y específico para desarrolladores.
- La categoría debe ser una de: ${CATEGORY_LIST.join(', ')}.`;
    const resp = await model.generateContent(prompt);
    const text = resp.response.text();
    const m = text.match(/\{[\s\S]*\}/);
    const json = m ? JSON.parse(m[0]) : JSON.parse(text);
    if (json?.title) {
      const cat = CATEGORY_LIST.includes(json.category) ? json.category : undefined;
      return { title: json.title, category: cat };
    }
  } catch (e) {
    // fallback silencioso
  }
  return { title: 'Tendencias de desarrollo web modernas', category: undefined };
}

function pickCategory(title, keywords) {
  const text = `${title} ${(keywords||[]).join(' ')}`.toLowerCase();
  const rules = [
    ['Frontend', [/react|next\.js|vue|nuxt|angular|svelte|css|tailwind|sass|html\b|vite|dom\b|ui\b|ux\b|frontend/]],
    ['Backend', [/node\b|express|nest\b|spring|django|flask|fastapi|api\b|rest\b|graphql|php|laravel|dotnet|backend/]],
    ['DevOps y Cloud', [/docker|kubernetes|helm|terraform|ansible|ci\/cd|github actions|aws|azure|gcp|cloud|devops/]],
    ['Performance y Optimización', [/rendimiento|performance|optimiza|carga|lighthouse|web vitals|memo|cache|profiling|bottleneck/]],
    ['Arquitectura y Patrones', [/arquitectura|ddd|hexagonal|patrones|design pattern|microservicios|monolito|event sourcing/]],
    ['Bases de Datos', [/sql\b|mysql|postgres|sqlite|mongodb|redis|database|prisma|orm|indexación|query plan/]],
    ['Testing y Calidad', [/test\b|jest|cypress|playwright|tdd|bdd|qa\b|calidad|coverage|lint/]],
    ['Herramientas y Productividad', [/productividad|herramientas|editor|vs\s?code|cli\b|automatiza|snippets|atalhos|teclas/]],
    ['Inteligencia Artificial', [/\bia\b|\bai\b|gpt|gemini|ml\b|machine learning|llm|modelo|transformer|rnn/]],
    ['Seguridad', [/seguridad|security|auth\b|oauth|jwt|csrf|xss|cifrado|owasp|sast|dast/]],
    ['Tendencias y Futuro', [/tendencia|futuro|roadmap|202[4-9]|novedad|innovación|state of|encuesta/]]
  ];
  for (const [cat, pats] of rules) {
    if (pats.some(r => r.test(text))) return cat;
  }
  return 'Frontend';
}

function getImagePrefs() {
  const order = (process.env.IMAGE_SOURCE_ORDER || 'commons,wikipedia,openverse,unsplash,pexels').split(',').map(s => s.trim());
  const minW = parseInt(process.env.MIN_IMAGE_WIDTH || '1000', 10);
  const minH = parseInt(process.env.MIN_IMAGE_HEIGHT || '600', 10);
  const landscape = String(process.env.PREFER_LANDSCAPE || 'true').toLowerCase() !== 'false';
  return { order, minW, minH, landscape };
}

function acceptableWH(w, h, prefs) {
  if (!w || !h) return false;
  if (w < prefs.minW || h < prefs.minH) return false;
  if (prefs.landscape && w < h) return false;
  return true;
}

// Eliminar función fetchImage (Pexels)

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

async function callGeminiForArticle(topic) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY no está configurada');
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Puedes ajustar el prompt aquí para que sea extenso, variado y educativo
  const prompt = `Eres un redactor técnico senior. Escribe un artículo educativo, extenso, variado y apto para Google AdSense, con excelente SEO on-page, sobre: "${topic}".

Requisitos:
- Tono claro y profesional, en español neutro.
- Incluye introducción, secciones con subtítulos H2/H3, código cuando aporte valor, mejores prácticas, errores comunes y conclusión.
- Longitud objetivo: 1200-1500 palabras.
- Usa palabras clave relevantes cuando sea natural.
- Incluye un resumen breve (1-2 oraciones) que servirá para meta description.
- No incluyas HTML <html> ni <head>; solo el cuerpo del artículo con H2/H3, p, pre/code, listas, etc.
- No escribas metadatos, solo el contenido del artículo.
`;

  const { response } = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  const text = response.text();
  // Devuelve tanto markdown como html (html vacío por defecto)
  return { text: text.trim(), html: '' };
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

  // 0) Resolver tema y categoría iniciales
  let TOPIC = process.env.ARTICLE_TOPIC || undefined;
  let initialCategory = process.env.ARTICLE_CATEGORY || undefined;
  if (!TOPIC) {
    const proposed = await proposeTopicAndCategory();
    TOPIC = proposed.title;
    if (!initialCategory && proposed.category) initialCategory = proposed.category;
  }

  // 1) Keywords SEO
  const keywords = await fetchKeywords(TOPIC);
  
  // 2) Generar contenido con Gemini
  const { text: modelText, html: geminiHtml } = await callGeminiForArticle(TOPIC);

  // 3) Si vino en Markdown, convertir a HTML; si vino HTML, usarlo
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
  const looksLikeMd = /(^|\n)\s{0,3}(#{1,6}\s|```|\*\s|\d+\.\s)/.test(modelText || '');
  const renderedHtml = looksLikeMd ? md.render(modelText) : (geminiHtml || modelText || '');

  // 3) Título y resumen (derivar si hace falta)
  // Extraer primer H1/H2 como título si no se provee explícito
  const $ = loadHtml(`<main>${renderedHtml}</main>`);
  const derivedTitle = $('h1').first().text().trim() || $('h2').first().text().trim() || TOPIC;
  // Obtener el primer párrafo significativo
  let rawExcerpt = $('p').filter((_, el) => $(el).text().trim().length > 60).first().text().trim();
  const excerpt = (rawExcerpt || `Guía sobre ${TOPIC}`).replace(/\s+/g, ' ').slice(0, 160);


  // 4) Generar banner con Gemini
  const seoTitle = shortenForSeo(derivedTitle, 60);
  const slug = toSlug(seoTitle);
  const envCategory = process.env.ARTICLE_CATEGORY && CATEGORY_LIST.includes(process.env.ARTICLE_CATEGORY) ? process.env.ARTICLE_CATEGORY : undefined;
  const heuristicCategory = pickCategory(derivedTitle, keywords);
  const selectedCategory = envCategory || initialCategory || heuristicCategory;

  // Prompt para imagen
  const imagePrompt = `Crea un banner llamativo en formato JPG para el siguiente artículo: "${derivedTitle}". El banner debe ser profesional, atractivo y representar visualmente el tema del artículo. El texto del banner debe ser: "${derivedTitle}". El estilo debe ser moderno y adecuado para una tarjeta de blog.`;

  // Llamada a Gemini para generar imagen
  let bannerUrl = '/logos-he-imagenes/programacion.jpeg';
  let bannerAttribution = 'Generado por Gemini';
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imgResp = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: imagePrompt }] }], generationConfig: { responseMimeType: 'image/jpeg' } });
    const imgData = imgResp.response.parts?.[0]?.data;
    if (imgData) {
      const imgBuffer = Buffer.from(imgData, 'base64');
      const imgPath = path.join(ROOT, 'public', 'images', 'articles', `${slug}.jpg`);
      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, imgBuffer);
      bannerUrl = `/images/articles/${slug}.jpg`;
      bannerAttribution = 'Generado por Gemini';
    }
  } catch (e) {
    console.warn('No se pudo generar imagen con Gemini, usando imagen local.');
  }

  // 5) Rellenar plantilla
  const now = new Date();
  const publishDate = now.toISOString().split('T')[0];
  const canonical = SITE_URL ? new URL(`/blog/${slug}.html`, SITE_URL).toString() : `/blog/${slug}.html`;
  const tagsHtml = tagsHtmlFromKeywords(keywords);
  const ogImageUrl = SITE_URL ? new URL(bannerUrl, SITE_URL).toString() : bannerUrl;

  const filled = applyTemplate(template, {
    SEO_TITLE: seoTitle,
    SEO_DESCRIPTION: excerpt,
    SEO_KEYWORDS: keywords.join(', '),
    FEATURED_IMAGE: bannerUrl,
    OG_IMAGE_URL: ogImageUrl,
    CANONICAL_URL: canonical,
    CATEGORY: selectedCategory,
    EDUCATIONAL_LEVEL: 'Intermedio',
    READING_TIME: '8 min',
    TITLE: derivedTitle,
    ARTICLE_TITLE: derivedTitle,
    ARTICLE_SUMMARY: excerpt,
    AUTHOR: 'hgaruna',
    WORD_COUNT: '1300',
    TAGS_HTML: tagsHtml,
    ARTICLE_CONTENT: renderedHtml + `\n\n<p style=\"color:#a0abc6;font-size:12px\">Crédito de imagen: ${bannerAttribution}</p>`,
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
