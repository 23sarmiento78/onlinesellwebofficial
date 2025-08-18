// Script para regenerar el blog-index.json usando los HTML actualizados
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const BLOG_DIR = path.join(process.cwd(), 'public', 'blog');
const INDEX_PATH = path.join(process.cwd(), 'public', 'data', 'blog-index.json');

function extractMetaFromHtml(html, filename) {
  const $ = cheerio.load(html);
  const title = $('title').text().trim() || $('h1').first().text().trim() || filename.replace(/\.html$/, '').replace(/-/g, ' ');
  const description = $('meta[name="description"]').attr('content') || $('p').first().text().trim().substring(0, 160) || '';
  const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()).filter(Boolean) || [];
  const author = $('meta[name="author"]').attr('content') || 'hgaruna';
  const date = $('meta[name="date"]').attr('content') || $('meta[property="article:published_time"]').attr('content') || new Date().toISOString();
  let image = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || '/logos-he-imagenes/programacion.jpeg';
  const category = $('meta[name="category"]').attr('content') || $('div.eyebrow').text().trim() || 'General';
  const excerpt = $('main p').first().text().trim() || $('p').first().text().trim() || description;
  return {
    id: filename.replace(/\.html$/, ''),
    title,
    description,
    excerpt,
    keywords,
    author,
    category,
    datePublished: date,
    path: `/blog/${filename}`,
    image
  };
}

function regenerateBlogIndex() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  const articles = files.map(file => {
    const html = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    return extractMetaFromHtml(html, file);
  });
  fs.writeFileSync(INDEX_PATH, JSON.stringify(articles, null, 2), 'utf8');
  console.log('blog-index.json regenerado con éxito.');
}

regenerateBlogIndex();
