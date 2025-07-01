const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function getArticles() {
  const articlesDir = path.resolve(process.cwd(), 'src/content/articulos');
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const filePath = path.join(articlesDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const summary = data.summary || content.split('\n')[0].slice(0, 200) + '...';
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title || 'Sin título',
      date: data.date || '',
      author: data.author || '',
      tags: data.tags || [],
      image: data.image || '',
      summary,
    };
  });
};
