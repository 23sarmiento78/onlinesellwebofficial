// Script batch para generar 3 artículos únicos, cada uno con una categoría distinta
import path from 'path';
import fs from 'fs-extra';
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

async function proposeTopicAndCategory(excludeCategories = [], excludeTitles = []) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const availableCategories = CATEGORY_LIST.filter(cat => !excludeCategories.includes(cat));
  const prompt = `Eres un editor técnico. Devuelve un JSON compacto con un tema educativo y una categoría de esta lista exacta: ${availableCategories.join(', ')}.
Formato estricto: {"title":"...","category":"..."}
Requisitos:
- El título debe ser educativo, actual y específico para desarrolladores.
- La categoría debe ser una de: ${availableCategories.join(', ')}.
- No repitas el título ni la categoría de los artículos ya generados: ${excludeTitles.join(', ')}.`;
  const resp = await model.generateContent(prompt);
  const text = resp.response.text();
  const m = text.match(/\{[\s\S]*\}/);
  const json = m ? JSON.parse(m[0]) : JSON.parse(text);
  if (json?.title && availableCategories.includes(json.category)) {
    return { title: json.title, category: json.category };
  }
  // fallback
  return { title: 'Tendencias de desarrollo web modernas', category: availableCategories[0] };
}

async function generateArticle(topic, category) {
  const TEMPLATES_DIR = path.join(ROOT, 'templates');
  const templatePath = path.join(TEMPLATES_DIR, 'article-template.html');
  const template = await fs.readFile(templatePath, 'utf8');
  // 1) Keywords SEO
  async function fetchKeywords(topic) {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(topic)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Keyword fetch failed ${res.status}`);
    const data = await res.json();
    const suggestions = Array.isArray(data) ? data[1] : [];
    const base = topic.toLowerCase();
    const extras = ['guía', 'tutorial', 'mejores prácticas', 'ejemplos', 'rendimiento', 'principiantes', '2025'];
    return Array.from(new Set([topic, ...suggestions, ...extras.map(e => `${base} ${e}`)])).slice(0, 15);
  }

  function tagsHtmlFromKeywords(keywords) {
    return (keywords || []).slice(0, 8)
      .map(k => `<span class="tag">#${k}</span>`)
      .join('\n        ');
  }

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
    let t = title.replace(/\b(una\s+gu[ií]a\s+completa\s+para\s+\d{4}|gu[ií]a\s+completa\s+para\s+\d{4})\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    if (t.length <= maxLen) return t;
    const cut = t.slice(0, maxLen + 1);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut.slice(0, maxLen)).replace(/[\s,:;.-]+$/, '');
  }

  // 2) Generar contenido con Gemini
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Eres un redactor técnico senior. Escribe un artículo educativo, extenso, variado y apto para Google AdSense, con excelente SEO on-page, sobre: "${topic}".\n\nRequisitos:\n- Tono claro y profesional, en español neutro.\n- Incluye introducción, secciones con subtítulos H2/H3, código cuando aporte valor, mejores prácticas, errores comunes y conclusión.\n- Longitud objetivo: 1200-1500 palabras.\n- Usa palabras clave relevantes cuando sea natural.\n- Incluye un resumen breve (1-2 oraciones) que servirá para meta description.\n- No incluyas HTML <html> ni <head>; solo el cuerpo del artículo con H2/H3, p, pre/code, listas, etc.\n- No escribas metadatos, solo el contenido del artículo.\n`;
  const { response } = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  const modelText = response.text().trim();

  // 3) Si vino en Markdown, convertir a HTML; si vino HTML, usarlo
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
  const looksLikeMd = /(^|\n)\s{0,3}(#{1,6}\s|```|\*\s|\d+\.\s)/.test(modelText || '');
  const renderedHtml = looksLikeMd ? md.render(modelText) : modelText;

  // 4) Título y resumen
  const $ = loadHtml(`<main>${renderedHtml}</main>`);
  const derivedTitle = $('h1').first().text().trim() || $('h2').first().text().trim() || topic;
  let rawExcerpt = $('p').filter((_, el) => $(el).text().trim().length > 60).first().text().trim();
  const excerpt = (rawExcerpt || `Guía sobre ${topic}`).replace(/\s+/g, ' ').slice(0, 160);

  // 5) Buscar imagen en Pexels
  let bannerUrl = '/logos-he-imagenes/programacion.jpeg';
  let bannerAttribution = 'Pexels';
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (pexelsKey) {
    let pres = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(category)}&per_page=10`, {
      headers: { Authorization: pexelsKey }
    });
    if (pres.ok) {
      let pj = await pres.json();
      for (const p of pj.photos || []) {
        const direct = p.src?.large2x || p.src?.large || p.src?.original;
        if (!direct) continue;
        bannerUrl = direct;
        bannerAttribution = p.photographer ? `Pexels - ${p.photographer}` : 'Pexels';
        break;
      }
    }
    if (bannerUrl === '/logos-he-imagenes/programacion.jpeg') {
      pres = await fetch(`https://api.pexels.com/v1/search?query=programación&per_page=10`, {
        headers: { Authorization: pexelsKey }
      });
      if (pres.ok) {
        let pj = await pres.json();
        for (const p of pj.photos || []) {
          const direct = p.src?.large2x || p.src?.large || p.src?.original;
          if (!direct) continue;
          bannerUrl = direct;
          bannerAttribution = p.photographer ? `Pexels - ${p.photographer}` : 'Pexels';
          break;
        }
      }
    }
  }

  // 6) Rellenar plantilla
  const now = new Date();
  const publishDate = now.toISOString().split('T')[0];
  const seoTitle = shortenForSeo(derivedTitle, 60);
  const slug = toSlug(seoTitle);
  const canonical = SITE_URL ? new URL(`/blog/${slug}.html`, SITE_URL).toString() : `/blog/${slug}.html`;
  const keywords = await fetchKeywords(topic);
  const tagsHtml = tagsHtmlFromKeywords(keywords);
  const ogImageUrl = SITE_URL ? new URL(bannerUrl, SITE_URL).toString() : bannerUrl;

  const filled = template
    .replaceAll('{{SEO_TITLE}}', seoTitle)
    .replaceAll('{{SEO_DESCRIPTION}}', excerpt)
    .replaceAll('{{SEO_KEYWORDS}}', keywords.join(', '))
    .replaceAll('{{FEATURED_IMAGE}}', bannerUrl)
    .replaceAll('{{OG_IMAGE_URL}}', ogImageUrl)
    .replaceAll('{{CANONICAL_URL}}', canonical)
    .replaceAll('{{CATEGORY}}', category)
    .replaceAll('{{EDUCATIONAL_LEVEL}}', 'Intermedio')
    .replaceAll('{{READING_TIME}}', '8 min')
    .replaceAll('{{TITLE}}', derivedTitle)
    .replaceAll('{{ARTICLE_TITLE}}', derivedTitle)
    .replaceAll('{{ARTICLE_SUMMARY}}', excerpt)
    .replaceAll('{{AUTHOR}}', 'hgaruna')
    .replaceAll('{{WORD_COUNT}}', '1300')
    .replaceAll('{{TAGS_HTML}}', tagsHtml)
    .replaceAll('{{ARTICLE_CONTENT}}', renderedHtml + `\n\n<p style=\"color:#a0abc6;font-size:12px\">Crédito de imagen: ${bannerAttribution}</p>`)
    .replaceAll('{{PUBLISH_DATE}}', publishDate);

  // 7) Guardar
  const outPath = path.join(BLOG_DIR, `${slug}.html`);
  await fs.writeFile(outPath, filled, 'utf8');
  // 8) Actualizar sitemap
  // ...puedes agregar lógica de sitemap si lo necesitas...
}

async function main() {
  await fs.ensureDir(BLOG_DIR);
  await fs.ensureDir(DATA_DIR);
  const templatePath = path.join(TEMPLATES_DIR, 'article-template.html');
  const template = await fs.readFile(templatePath, 'utf8');

  const generated = [];
  let excludeCategories = [];
  let excludeTitles = [];

  for (let i = 0; i < 3; i++) {
    const { title, category } = await proposeTopicAndCategory(excludeCategories, excludeTitles);
    await generateArticle(title, category); // Debe implementar la lógica completa
    generated.push({ title, category });
    excludeCategories.push(category);
    excludeTitles.push(title);
    console.log(`✅ Artículo generado: ${title} [${category}]`);
  }
}

main().catch(err => {
  console.error('❌ Error en batch de artículos:', err);
  process.exit(1);
});
