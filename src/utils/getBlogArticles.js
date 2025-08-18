// Utility para cargar artículos desde el index.json, tolerando distintos esquemas

function basenameNoExt(p) {
  try {
    const name = p.split('/').pop() || '';
    return name.replace(/\.html$/i, '');
  } catch { return ''; }
}

function toArticleModel(raw, index) {
  // Soporta dos esquemas:
  // A) Enriquecido (scripts/build-blog-index.js): { id, title, description, excerpt, keywords, author, datePublished, lastmod, readingTime, path, image }
  // B) Antiguo: { slug, title, excerpt, image, category, date, ... }
  const slug = raw.slug || basenameNoExt(raw.path || '');
  let url = raw.path || (slug ? `/blog/${slug}.html` : undefined);
  // Asegurar que la URL apunte a /blog/... (evitar dobles // o rutas relativas)
  if (url && !url.startsWith('/')) url = `/${url.replace(/^\/+/, '')}`;
  const date = raw.date || raw.datePublished || raw.lastmod || new Date().toISOString();
  const image = raw.image || '/logos-he-imagenes/logo3.png';
  const category = normalizeCategory(raw.category);
  const tags = raw.tags || raw.keywords || [];
  const readTime = raw.readTime || (raw.readingTime ? `${raw.readingTime} min` : '5 min');
  const author = typeof raw.author === 'string'
    ? { name: raw.author, avatar: '/logos-he-imagenes/author-default.jpg', bio: '' }
    : (raw.author || { name: 'Equipo', avatar: '/logos-he-imagenes/author-default.jpg', bio: '' });

  return {
    id: raw.id || slug || String(index + 1),
    title: raw.title || slug || 'Artículo',
    excerpt: raw.excerpt || raw.description || '',
    image,
    category,
    author,
    date,
    readTime,
    views: Number(raw.views) || 0,
    likes: Number(raw.likes) || 0,
    tags,
    difficulty: raw.difficulty || 'Intermedio',
    featured: index < 3,
    trending: Math.random() > 0.7,
    url: url || '#',
  };
}

function normalizeCategory(name) {
  const n = String(name || '').toLowerCase();
  if (!n) return 'Todos';
  if (n.includes('front')) return 'Frontend';
  if (n.includes('back')) return 'Backend';
  if (n.includes('devops') || n.includes('cloud') || n.includes('aws') || n.includes('azure') || n.includes('gcp')) return 'DevOps y Cloud';
  if (n.includes('performance') || n.includes('optim')) return 'Performance y Optimización';
  if (n.includes('arquitect') || n.includes('patron') || n.includes('pattern')) return 'Arquitectura y Patrones';
  if (n.includes('database') || n.includes('sql') || n.includes('mongo') || n.includes('db')) return 'Bases de Datos';
  if (n.includes('test')) return 'Testing y Calidad';
  if (n.includes('herramient') || n.includes('product')) return 'Herramientas y Productividad';
  if (n.includes('ia') || n.includes('ai') || n.includes('machine') || n.includes('ml') || n.includes('inteligencia')) return 'Inteligencia Artificial';
  if (n.includes('segur') || n.includes('security')) return 'Seguridad';
  if (n.includes('tendenc') || n.includes('trend') || n.includes('futuro') || n.includes('future')) return 'Tendencias y Futuro';
  return 'Todos';
}

export async function getBlogArticles() {
  try {
    console.log('Intentando cargar artículos desde:', '/data/blog-index.json');

    const response = await fetch('/data/blog-index.json');
    console.log('Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const articles = await response.json();
    console.log('Artículos cargados:', Array.isArray(articles) ? articles.length : 'formato inválido');
    if (!Array.isArray(articles)) throw new Error('El índice no es un array');

    const processedArticles = articles.map((raw, index) => {
      const a = toArticleModel(raw, index);
      console.log(`Procesando artículo ${index + 1}:`, a.title);
      return a;
    });

    const sortedArticles = processedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('Total de artículos procesados:', sortedArticles.length);

    return sortedArticles;

  } catch (error) {
    console.error('Error detallado al cargar artículos:', {
      message: error.message,
      stack: error.stack,
      type: error.name
    });
    throw new Error(`Error al cargar artículos: ${error.message}`);
  }
}

// Hook para usar en componentes React
import { useState, useEffect } from 'react';

export function useBlogArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const loadedArticles = await getBlogArticles();
        setArticles(loadedArticles);
      } catch (err) {
        console.error('Error al cargar artículos:', err);
        setError(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  return { articles, loading, error };
}
