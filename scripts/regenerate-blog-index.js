// scripts/regenerate-blog-index.js
// Regenera el blog-index.json con metadatos completos de los artículos

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BLOG_DIR = resolve(__dirname, '../public/blog');
const DATA_DIR = resolve(__dirname, '../public/data');
const SIMPLE_INDEX_PATH = join(BLOG_DIR, 'index.json');
const FULL_INDEX_PATH = join(DATA_DIR, 'blog-index.json');

// Asegurarse de que existe el directorio data
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

function getDifficulty(content, title) {
  const text = content.toLowerCase();
  const titleLower = title.toLowerCase();
  
  const advancedKeywords = [
    'avanzado', 'advanced', 'profesional', 'arquitectura', 'optimización',
    'performance', 'escalabilidad', 'microservicios', 'kubernetes', 'terraform'
  ];
  
  const beginnerKeywords = [
    'introducción', 'básico', 'empezar', 'principiante', 'tutorial',
    'primeros pasos', 'fundamentos', 'inicio'
  ];
  
  if (advancedKeywords.some(kw => text.includes(kw) || titleLower.includes(kw))) {
    return 'Avanzado';
  }
  if (beginnerKeywords.some(kw => text.includes(kw) || titleLower.includes(kw))) {
    return 'Principiante';
  }
  return 'Intermedio';
}

function getReadTime(content) {
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / 200) + ' min';
}

function generateTags(title, category, keywords) {
  const tags = new Set();
  
  // Añadir categoría como tag
  if (category) tags.add(category);
  
  // Añadir keywords como tags
  if (keywords) {
    keywords.split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .forEach(k => tags.add(k));
  }
  
  // Añadir tags basados en el título
  const commonKeywords = {
    'React': ['Frontend', 'JavaScript'],
    'Angular': ['Frontend', 'TypeScript'],
    'Node': ['Backend', 'JavaScript'],
    'Python': ['Backend', 'Programming'],
    'Docker': ['DevOps', 'Containers'],
    'JavaScript': ['Frontend', 'Web'],
    'TypeScript': ['Frontend', 'JavaScript']
  };
  
  for (const [key, relatedTags] of Object.entries(commonKeywords)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      relatedTags.forEach(tag => tags.add(tag));
      tags.add(key);
    }
  }
  
  return Array.from(tags).slice(0, 5);
}

function regenerateIndex() {
  const files = readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html'))
    .sort();

  // Generar índice simple para compatibilidad
  writeFileSync(SIMPLE_INDEX_PATH, JSON.stringify(files, null, 2));
    
  const articles = files.map(file => {
    const filePath = join(BLOG_DIR, file);
    const html = readFileSync(filePath, 'utf-8');
    
    // Extraer metadatos básicos
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : file.replace(/\.html$/, '');
    
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const description = descMatch ? descMatch[1] : '';
    
    const catMatch = html.match(/<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const category = catMatch ? catMatch[1] : 'Programación';
    
    const kwMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const keywords = kwMatch ? kwMatch[1] : '';
    
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const authorName = authorMatch ? authorMatch[1] : 'hgaruna Team';
    
    const dateMatch = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
    
    const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const image = imgMatch ? imgMatch[1] : '/logos-he-imagenes/programacion.jpeg';

    // Extraer contenido para análisis
    const content = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Generar estadísticas realistas
    const views = Math.floor(Math.random() * 5000) + 500;
    const likes = Math.floor(views * 0.05) + Math.floor(Math.random() * 100);
    
    return {
      slug: file.replace('.html', ''),
      title: title.length > 80 ? title.substring(0, 77) + '...' : title,
      excerpt: description.length > 150 ? description.substring(0, 147) + '...' : description,
      image,
      category,
      author: {
        name: authorName,
        avatar: '/logos-he-imagenes/author-default.jpg',
        bio: 'Equipo de desarrollo de hgaruna'
      },
      date,
      readTime: getReadTime(content),
      views,
      likes,
      tags: generateTags(title, category, keywords),
      difficulty: getDifficulty(content, title)
    };
  });

  // Guardar índice completo con todos los metadatos
  writeFileSync(FULL_INDEX_PATH, JSON.stringify(articles, null, 2));
  
  console.log(`✅ Índices actualizados:
- ${SIMPLE_INDEX_PATH} (compatibilidad)
- ${FULL_INDEX_PATH} (nuevo formato)
Total: ${articles.length} artículos`);
}

regenerateIndex();
