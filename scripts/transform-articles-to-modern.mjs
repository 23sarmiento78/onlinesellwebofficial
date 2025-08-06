// Versión compatible con ES Modules ("type": "module")
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../public/blog');
const TEMPLATE_PATH = path.join(__dirname, '../templates/modern-article-template.html');

function extractMeta(html, name) {
  const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : '';
}

function extractContent(html) {
  let match = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (match) return match[1];
  match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (match) return match[1];
  match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (match) return match[1];
  return '';
}

function extractImage(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : '';
}

function transformArticle(oldHtml, template) {
  const title = extractTitle(oldHtml);
  const description = extractMeta(oldHtml, 'description');
  const keywords = extractMeta(oldHtml, 'keywords');
  const author = extractMeta(oldHtml, 'author') || 'hgaruna';
  const category = extractMeta(oldHtml, 'category') || 'General';
  const date = extractMeta(oldHtml, 'date') || new Date().toISOString();
  const image = extractImage(oldHtml) || '/logos-he-imagenes/logo3.png';
  const content = extractContent(oldHtml);

  let modern = template
    .replace(/\{\{SEO_TITLE\}\}/g, title)
    .replace(/\{\{SEO_DESCRIPTION\}\}/g, description)
    .replace(/\{\{SEO_KEYWORDS\}\}/g, keywords)
    .replace(/\{\{AUTHOR\}\}/g, author)
    .replace(/\{\{CATEGORY\}\}/g, category)
    .replace(/\{\{ARTICLE_TITLE\}\}/g, title)
    .replace(/\{\{ARTICLE_EXCERPT\}\}/g, description)
    .replace(/\{\{FEATURED_IMAGE\}\}/g, image)
    .replace(/\{\{IMAGE_ALT\}\}/g, title)
    .replace(/\{\{IMAGE_CAPTION\}\}/g, '')
    .replace(/\{\{PUBLISHED_DATE\}\}/g, date)
    .replace(/\{\{PUBLISHED_DATE_FORMATTED\}\}/g, date.split('T')[0])
    .replace(/\{\{MODIFIED_DATE\}\}/g, date)
    .replace(/\{\{ARTICLE_CONTENT\}\}/g, content || '<p>Sin contenido</p>');
  return modern;
}

function main() {
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const oldHtml = fs.readFileSync(filePath, 'utf8');
    const modernHtml = transformArticle(oldHtml, template);
    fs.writeFileSync(filePath, modernHtml, 'utf8');
    console.log('Transformado:', file);
  }
  console.log('¡Todos los artículos han sido modernizados!');
}

main();
