// Script para crear un archivo Markdown de artículo Astro a partir de datos recibidos
// Uso: node scripts/create-astro-article-md.js '{JSON_ARTICULO}'

const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createMarkdown(article) {
  const frontmatter = [
    '---',
    `title: "${article.title.replace(/"/g, '\"')}"`,
    `description: "${article.description ? article.description.replace(/"/g, '\"') : ''}"`,
    `date: ${article.date ? article.date : new Date().toISOString()}`,
    article.image ? `image: "${article.image}"` : '',
    article.category ? `category: "${article.category}"` : '',
    article.author ? `author: "${article.author}"` : '',
    article.tags ? `tags: [${article.tags.map(t => '"'+t+'"').join(', ')}]` : '',
    '---',
    '',
  ].filter(Boolean).join('\n');
  return `${frontmatter}\n${article.content || ''}\n`;
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Debes pasar el JSON del artículo como argumento.');
    process.exit(1);
  }
  let article;
  try {
    article = JSON.parse(arg);
  } catch (e) {
    console.error('JSON inválido:', e.message);
    process.exit(1);
  }
  const slug = article.slug || slugify(article.title);
  const filePath = path.join(__dirname, '../src/content/articles/', `${slug}.md`);
  const md = createMarkdown(article);
  fs.writeFileSync(filePath, md, 'utf8');
  console.log(`✅ Archivo creado: ${filePath}`);
}

main();
