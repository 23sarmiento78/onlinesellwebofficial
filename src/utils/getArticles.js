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

async function getLocalArticles() {
  // Por ahora, retornamos un array vacío
  // En el futuro, puedes implementar la lectura de archivos Markdown
  return [];
}

async function getCMSArticles() {
  try {
    // Obtener artículos desde tu API del CMS
    const response = await fetch('/api/articles');
    if (!response.ok) {
      throw new Error('Error al obtener artículos del CMS');
    }
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error obteniendo artículos del CMS:', error);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug);
}

export async function getArticlesByCategory(category) {
  const articles = await getArticles();
  return articles.filter(article => article.category === category);
}
