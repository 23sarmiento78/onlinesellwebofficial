// Utility para cargar artículos desde el index.json

export async function getBlogArticles() {
  try {
    console.log('Intentando cargar artículos desde:', '/data/blog-index.json');
    
    const response = await fetch('/data/blog-index.json');
    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    const articles = await response.json();
    console.log('Artículos cargados:', articles.length);
    
    const processedArticles = articles.map((article, index) => {
      const processedArticle = {
        ...article,
        id: index + 1,
        featured: index < 3,
        trending: Math.random() > 0.7,
        url: `/blog/${article.slug}.html`
      };
      console.log(`Procesando artículo ${index + 1}:`, processedArticle.title);
      return processedArticle;
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
