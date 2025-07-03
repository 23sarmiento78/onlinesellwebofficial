// Utilidad para obtener artículos desde múltiples fuentes
// 1. Archivos Markdown locales (desarrollo)
// 2. API del CMS (producción)

export async function getArticles() {
  try {
    // En desarrollo, usar archivos Markdown locales
    if (process.env.NODE_ENV === 'development') {
      return await getLocalArticles();
    }
    
    // En producción, intentar obtener del CMS
    return await getCMSArticles();
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    return [];
  }
}

// Función para obtener todos los artículos (alias de getArticles)
export async function getAllArticles() {
  return await getArticles();
}

async function getLocalArticles() {
  // Por ahora, retornamos un array vacío
  // En el futuro, puedes implementar la lectura de archivos Markdown
  return [];
}

async function getCMSArticles() {
  try {
    // Obtener artículos desde tu API del CMS (Netlify Functions)
    const response = await fetch('/.netlify/functions/get-articles');
    if (!response.ok) {
      throw new Error('Error al obtener artículos del CMS');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.articles || []);
  } catch (error) {
    console.error('Error obteniendo artículos del CMS:', error);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  try {
    const articles = await getArticles();
    return articles.find(article => 
      article.slug === slug || 
      article._id === slug ||
      article.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    );
  } catch (error) {
    console.error('Error obteniendo artículo por slug:', error);
    return null;
  }
}

export async function getArticlesByCategory(category) {
  const articles = await getArticles();
  return articles.filter(article => article.category === category);
}
