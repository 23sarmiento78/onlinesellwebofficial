// Función para buscar en artículos
export async function searchArticles(query, articles = null) {
  try {
    // Si no se proporcionan artículos, cargarlos
    if (!articles) {
      const { getBlogArticles } = await import('./getBlogArticles');
      articles = await getBlogArticles();
    }

    // Normalizar la búsqueda
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    if (searchTerms.length === 0) return [];

    // Función para calcular relevancia
    const calculateRelevance = (article) => {
      let score = 0;
      const searchFields = {
        title: 10,        // Mayor peso para coincidencias en título
        excerpt: 5,       // Peso medio para coincidencias en extracto
        content: 3,       // Peso normal para coincidencias en contenido
        tags: 8,          // Buen peso para coincidencias en tags
        category: 7       // Buen peso para coincidencias en categoría
      };

      // Buscar en cada campo
      for (const [field, weight] of Object.entries(searchFields)) {
        const fieldContent = (article[field] || '').toString().toLowerCase();
        searchTerms.forEach(term => {
          // Coincidencia exacta
          if (fieldContent.includes(term)) {
            score += weight;
          }
          // Coincidencia parcial
          else if (fieldContent.split(' ').some(word => word.includes(term))) {
            score += weight / 2;
          }
        });
      }

      return score;
    };

    // Filtrar y ordenar artículos por relevancia
    return articles
      .map(article => ({
        ...article,
        relevance: calculateRelevance(article)
      }))
      .filter(article => article.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);

  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return [];
  }
}

// Cache para búsquedas recientes
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function searchArticlesWithCache(query) {
  // Normalizar la query para el caché
  const normalizedQuery = query.toLowerCase().trim();
  
  // Verificar caché
  const cached = searchCache.get(normalizedQuery);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.results;
  }

  // Realizar búsqueda
  const results = await searchArticles(normalizedQuery);
  
  // Guardar en caché
  searchCache.set(normalizedQuery, {
    results,
    timestamp: Date.now()
  });

  return results;
}
