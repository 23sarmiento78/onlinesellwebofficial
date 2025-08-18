// Utility para cargar artículos HTML desde la carpeta blog con mejor procesamiento
import { load as loadHtml } from 'cheerio';

// Mapeo de keywords a categorías
const CATEGORY_MAPPING = {
  'react': 'Frontend',
  'javascript': 'Frontend', 
  'typescript': 'Frontend',
  'vue': 'Frontend',
  'angular': 'Frontend',
  'html': 'Frontend',
  'css': 'Frontend',
  'frontend': 'Frontend',
  'node': 'Backend',
  'nodejs': 'Backend',
  'backend': 'Backend',
  'api': 'Backend',
  'database': 'Bases de Datos',
  'sql': 'Bases de Datos',
  'mongodb': 'Bases de Datos',
  'docker': 'DevOps y Cloud',
  'aws': 'DevOps y Cloud',
  'devops': 'DevOps y Cloud',
  'terraform': 'DevOps y Cloud',
  'ansible': 'DevOps y Cloud',
  'ci/cd': 'DevOps y Cloud',
  'testing': 'Testing y Calidad',
  'eslint': 'Herramientas y Productividad',
  'webpack': 'Herramientas y Productividad',
  'security': 'Seguridad',
  'performance': 'Performance y Optimización',
  'optimization': 'Performance y Optimización',
  'cache': 'Performance y Optimización',
  'ia': 'Inteligencia Artificial',
  'ai': 'Inteligencia Artificial',
  'nlp': 'Inteligencia Artificial',
  'webassembly': 'Tendencias y Futuro',
  'pwa': 'Tendencias y Futuro',
  'jamstack': 'Arquitectura y Patrones',
  'cqrs': 'Arquitectura y Patrones',
  'microservices': 'Arquitectura y Patrones'
};

function determineCategory(keywords, tags, title, content) {
  const searchText = [
    ...(keywords || []),
    ...(tags || []),
    title || '',
    (content || '').substring(0, 500)
  ].join(' ').toLowerCase();

  for (const [keyword, category] of Object.entries(CATEGORY_MAPPING)) {
    if (searchText.includes(keyword)) {
      return category;
    }
  }
  
  return 'General';
}

function processPlaceholders(text, fallbacks = {}) {
  if (!text || typeof text !== 'string') return text;
  
  const replacements = {
    '{{SEO_TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{SEO_DESCRIPTION}}': fallbacks.description || 'Artículo generado por inteligencia artificial',
    '{{SEO_KEYWORDS}}': fallbacks.keywords || 'desarrollo web, programación',
    '{{FEATURED_IMAGE}}': fallbacks.image || '/logos-he-imagenes/programacion.jpeg',
    '{{CANONICAL_URL}}': fallbacks.url || '#',
    '{{CATEGORY}}': fallbacks.category || 'General',
    '{{EDUCATIONAL_LEVEL}}': 'Intermedio',
    '{{READING_TIME}}': fallbacks.readingTime || '5 min',
    '{{TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{ARTICLE_TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{ARTICLE_SUMMARY}}': fallbacks.description || 'Artículo generado por inteligencia artificial',
    '{{AUTHOR}}': fallbacks.author || 'hgaruna',
    '{{WORD_COUNT}}': '800',
    '{{TAGS_HTML}}': fallbacks.tagsHtml || '',
    '{{ARTICLE_CONTENT}}': fallbacks.content || '',
    '{{PUBLISH_DATE}}': fallbacks.date || new Date().toISOString().split('T')[0]
  };

  let processed = text;
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    processed = processed.replaceAll(placeholder, replacement);
  }
  
  return processed;
}

function extractMetaFromHtml(html, filename) {
  const $ = loadHtml(html);
  
  // Extraer metadatos básicos
  const title = $('title').text().trim() || 
                $('meta[property="og:title"]').attr('content') || 
                $('h1').first().text().trim() || 
                filename.replace(/\.html$/, '').replace(/-/g, ' ');
  
  const description = $('meta[name="description"]').attr('content') || 
                     $('meta[property="og:description"]').attr('content') || 
                     $('p').first().text().trim().substring(0, 160) || 
                     'Artículo generado por inteligencia artificial';
  
  const keywords = $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim()).filter(Boolean) || [];
  
  const author = $('meta[name="author"]').attr('content') || 'hgaruna';
  
  const date = $('meta[name="date"]').attr('content') || 
               $('meta[property="article:published_time"]').attr('content') || 
               new Date().toISOString();
  
  let image = $('meta[property="og:image"]').attr('content') || '/logos-he-imagenes/programacion.jpeg';
  
  // Si la imagen tiene placeholders, usar imagen por defecto
  if (image.includes('{{')) {
    image = '/logos-he-imagenes/programacion.jpeg';
  }
  
  // Extraer contenido del artículo
  const contentText = $('main').text() || $('body').text() || '';
  const excerpt = $('main p').first().text().trim() || 
                 $('p').first().text().trim() || 
                 description;
  
  // Calcular tiempo de lectura
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // Determinar categoría
  const category = determineCategory(keywords, [], title, contentText);
  
  // Determinar dificultad basándose en keywords y contenido
  const difficulty = keywords.some(k => ['avanzado', 'advanced', 'expert'].includes(k.toLowerCase())) ? 'Avanzado' :
                    keywords.some(k => ['principiante', 'beginner', 'básico', 'intro'].includes(k.toLowerCase())) ? 'Principiante' :
                    'Intermedio';

  return {
    title,
    description,
    excerpt,
    keywords,
    tags: keywords,
    author,
    date,
    image,
    category,
    difficulty,
    readTime: `${readTime} min`,
    wordCount,
    contentText
  };
}

export async function getBlogArticles() {
  try {
    console.log('Cargando artículos desde carpeta HTML...');
    
    // Primero intentar cargar el índice existente
    const response = await fetch('/data/blog-index.json');
    
    if (!response.ok) {
      console.warn('No se pudo cargar blog-index.json, usando fallback');
      return [];
    }
    
    const indexData = await response.json();
    
    if (!Array.isArray(indexData)) {
      console.warn('blog-index.json no contiene un array válido');
      return [];
    }
    
    console.log(`Procesando ${indexData.length} artículos del índice...`);
    
    const processedArticles = indexData.map((article, index) => {
      // Procesar placeholders en títulos y descripciones
      const cleanTitle = processPlaceholders(article.title || '', { 
        title: 'Artículo de Desarrollo',
        author: article.author || 'hgaruna'
      });
      
      const cleanDescription = processPlaceholders(article.description || '', {
        description: 'Artículo generado por inteligencia artificial'
      });
      
      const cleanExcerpt = processPlaceholders(article.excerpt || '', {
        description: cleanDescription
      });
      
      let cleanImage = processPlaceholders(article.image || '', {
        image: '/logos-he-imagenes/programacion.jpeg'
      });
      
      // Si aún tiene placeholders, usar imagen por defecto
      if (cleanImage.includes('{{')) {
        cleanImage = '/logos-he-imagenes/programacion.jpeg';
      }
      
      // Determinar categoría basándose en tags/keywords
      const category = determineCategory(
        article.keywords || [], 
        article.tags || [], 
        cleanTitle, 
        cleanDescription
      );
      
      // Limpiar autor
      const cleanAuthor = processPlaceholders(article.author || 'hgaruna', {
        author: 'hgaruna'
      });
      
      return {
        id: article.id || `article-${index + 1}`,
        title: cleanTitle,
        excerpt: cleanExcerpt || cleanDescription.substring(0, 160),
        description: cleanDescription,
        image: cleanImage,
        category,
        author: {
          name: cleanAuthor,
          avatar: '/logos-he-imagenes/logo3.png',
          bio: 'Desarrollador Web'
        },
        date: article.datePublished || article.date || new Date().toISOString(),
        readTime: article.readingTime ? `${article.readingTime} min` : '5 min',
        views: Math.floor(Math.random() * 1000) + 100, // Vista simulada
        likes: Math.floor(Math.random() * 50) + 5, // Likes simulados
        tags: Array.isArray(article.tags) ? article.tags.slice(0, 5) : 
              Array.isArray(article.keywords) ? article.keywords.slice(0, 5) : 
              ['desarrollo web', 'programación'],
        difficulty: ['Principiante', 'Intermedio', 'Avanzado'][Math.floor(Math.random() * 3)],
        featured: index < 3, // Los primeros 3 como destacados
        trending: Math.random() > 0.7,
        url: article.path || `/blog/${article.id}.html`
      };
    });
    
    // Ordenar por fecha descendente
    const sortedArticles = processedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log(`✅ Procesados ${sortedArticles.length} artículos exitosamente`);
    
    return sortedArticles;
    
  } catch (error) {
    console.error('Error cargando artículos:', error);
    
    // Fallback con artículos de ejemplo
    return [
      {
        id: 'fallback-1',
        title: 'Error al cargar artículos del blog',
        excerpt: 'No se pudieron cargar los artículos. Por favor, verifica la configuración.',
        image: '/logos-he-imagenes/programacion.jpeg',
        category: 'Sistema',
        author: {
          name: 'Sistema',
          avatar: '/logos-he-imagenes/logo3.png',
          bio: 'Mensaje del sistema'
        },
        date: new Date().toISOString(),
        readTime: '1 min',
        views: 0,
        likes: 0,
        tags: ['Error', 'Sistema'],
        difficulty: 'N/A',
        featured: false,
        trending: false,
        url: '#'
      }
    ];
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
        setLoading(true);
        const loadedArticles = await getBlogArticles();
        setArticles(loadedArticles);
        setError(null);
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
