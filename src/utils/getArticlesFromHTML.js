// src/utils/getArticlesFromHTML.js
// Carga dinámica y robusta de artículos HTML desde /blog usando index.json

/**
 * Obtiene la lista de artículos HTML desde /blog/index.json y extrae metadatos de cada uno.
 * Devuelve un array de objetos artículo ordenados por fecha descendente.
 */
export async function getArticlesFromHTML() {
  try {
    // 1. Obtener lista de archivos HTML desde index.json
    const files = await fetchHTMLFilesIndex();
    if (!Array.isArray(files) || files.length === 0) return [];

    // 2. Cargar y procesar metadatos de cada archivo
    const articles = await Promise.all(
      files.map(async (filename) => {
        try {
          const html = await fetchHTMLFile(filename);
          if (!html) return null;
          const meta = extractArticleMetadata(html, filename);
          return meta && meta.title ? meta : null;
        } catch {
          return null;
        }
      })
    );
    // 3. Filtrar nulos y ordenar por fecha descendente
    return articles.filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return [];
  }
}

/**
 * Obtiene el contenido HTML de un artículo específico por slug.
 * Devuelve objeto con metadatos y contenido HTML limpio.
 */
export async function getArticleFromHTML(slug) {
  const articles = await getArticlesFromHTML();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return null;
  const html = await fetchHTMLFile(article.htmlFile);
  if (!html) return null;
  // Extraer solo el contenido principal
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = mainMatch ? mainMatch[1] : (bodyMatch ? bodyMatch[1] : html);
  return { ...article, content, htmlRaw: html };
}

// --- Utilidades internas ---

// Lee y parsea /blog/index.json
async function fetchHTMLFilesIndex() {
  try {
    const res = await fetch('/blog/index.json');
    if (!res.ok) return [];
    const files = await res.json();
    // Solo archivos .html
    return Array.isArray(files) ? files.filter(f => f.endsWith('.html')) : [];
  } catch {
    return [];
  }
}

// Descarga el HTML de un archivo
async function fetchHTMLFile(filename) {
  try {
    const res = await fetch(`/blog/${filename}`);
    if (!res.ok) return null;
    const html = await res.text();
    // Validación mínima
    if (!html || html.length < 100 || !/<html/i.test(html)) return null;
    return html;
  } catch {
    return null;
  }
}

// Extrae metadatos básicos de un HTML
function extractArticleMetadata(html, filename) {
  // Título
  let title = '';
  const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleTag) title = titleTag[1];
  if (!title) {
    const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (h1) title = h1[1];
  }
  if (!title) title = filename.replace('.html', '').replace(/-/g, ' ');

  // Fecha
  const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] + 'T10:00:00.000Z' : new Date().toISOString();

  // Slug
  const slug = filename.replace('.html', '');

  // Resumen
  let summary = '';
  const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDesc) summary = metaDesc[1];
  if (!summary) {
    const p = html.match(/<p[^>]*>([^<]+)<\/p>/i);
    if (p) summary = p[1].substring(0, 150) + '...';
  }
  if (!summary) summary = 'Artículo sobre desarrollo web y programación.';

  // Autor y otros campos fijos
  return {
    title,
    summary,
    slug,
    date,
    author: 'hgaruna',
    image: '/logos-he-imagenes/programacion.jpeg',
    tags: ['Desarrollo Web', 'Programación'],
    category: 'Desarrollo Web',
    htmlFile: filename
  };
}