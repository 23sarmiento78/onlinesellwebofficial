// Utilidad moderna para cargar artículos del blog
export class BlogLoader {
  constructor() {
    this.articlesCache = null
    this.lastFetch = null
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  async loadArticles() {
    // Verificar cache
    if (this.articlesCache && this.lastFetch && 
        Date.now() - this.lastFetch < this.cacheTimeout) {
      return this.articlesCache
    }

    try {
      const response = await fetch('/blog/index.json')
      if (!response.ok) {
        throw new Error(`Error loading articles: ${response.status}`)
      }
      
      const articles = await response.json()
      
      // Procesar y limpiar datos de artículos
      const processedArticles = articles.map(article => this.processArticle(article))
      
      // Actualizar cache
      this.articlesCache = processedArticles
      this.lastFetch = Date.now()
      
      return processedArticles
    } catch (error) {
      console.error('Error loading blog articles:', error)
      return this.articlesCache || []
    }
  }

  processArticle(article) {
    return {
      id: article.slug,
      slug: article.slug,
      title: this.cleanTitle(article.title),
      excerpt: this.cleanExcerpt(article.excerpt),
      author: article.author || 'hgaruna',
      date: this.formatDate(article.date),
      category: this.normalizeCategory(article.category),
      tags: Array.isArray(article.tags) ? article.tags : [],
      image: this.normalizeImageUrl(article.image),
      file: article.file,
      readTime: this.calculateReadTime(article.excerpt),
      url: `/blog/${article.slug}`,
      htmlUrl: `/blog/${article.file}`
    }
  }

  cleanTitle(title) {
    if (!title || title === 'Introducción') {
      return 'Sin título'
    }
    return title.trim()
  }

  cleanExcerpt(excerpt) {
    if (!excerpt) return 'Sin descripción disponible'
    
    // Limpiar texto y limitar longitud
    const cleaned = excerpt
      .replace(/\s+/g, ' ')
      .trim()
    
    return cleaned.length > 200 
      ? cleaned.substring(0, 200) + '...'
      : cleaned
  }

  formatDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0]
    
    try {
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }

  normalizeCategory(category) {
    if (!category) return 'desarrollo'
    
    const categoryMap = {
      'desarrollo': 'desarrollo',
      'programacion': 'programación',
      'ia': 'inteligencia-artificial',
      'seguridad': 'seguridad',
      'frontend': 'frontend',
      'backend': 'backend',
      'devops': 'devops',
      'bases-de-datos': 'bases-de-datos'
    }
    
    return categoryMap[category.toLowerCase()] || category.toLowerCase()
  }

  normalizeImageUrl(imageUrl) {
    if (!imageUrl) return '/logos-he-imagenes/programacion.jpeg'
    
    // Reemplazar placeholders
    if (imageUrl.includes('{{SITE_URL}}')) {
      return imageUrl.replace('{{SITE_URL}}', '')
    }
    
    // Asegurar que la URL sea relativa o absoluta válida
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    
    if (!imageUrl.startsWith('/')) {
      return '/' + imageUrl
    }
    
    return imageUrl
  }

  calculateReadTime(text) {
    if (!text) return '5 min'
    
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    
    return `${Math.max(1, minutes)} min`
  }

  async getArticleBySlug(slug) {
    const articles = await this.loadArticles()
    return articles.find(article => article.slug === slug)
  }

  async getArticlesByCategory(category) {
    const articles = await this.loadArticles()
    if (category === 'all') return articles
    return articles.filter(article => article.category === category)
  }

  async searchArticles(searchTerm, category = 'all') {
    const articles = await this.loadArticles()
    let filtered = category === 'all' 
      ? articles 
      : articles.filter(article => article.category === category)
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }
    
    return filtered
  }

  getCategories() {
    return [
      { id: 'all', name: 'Todos', count: 0 },
      { id: 'desarrollo', name: 'Desarrollo', count: 0 },
      { id: 'programación', name: 'Programación', count: 0 },
      { id: 'inteligencia-artificial', name: 'IA', count: 0 },
      { id: 'frontend', name: 'Frontend', count: 0 },
      { id: 'backend', name: 'Backend', count: 0 },
      { id: 'devops', name: 'DevOps', count: 0 },
      { id: 'seguridad', name: 'Seguridad', count: 0 },
      { id: 'bases-de-datos', name: 'Bases de Datos', count: 0 }
    ]
  }

  async getCategoriesWithCount() {
    const articles = await this.loadArticles()
    const categories = this.getCategories()
    
    // Contar artículos por categoría
    const categoryCounts = {}
    articles.forEach(article => {
      categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1
    })
    
    return categories.map(category => ({
      ...category,
      count: category.id === 'all' ? articles.length : (categoryCounts[category.id] || 0)
    }))
  }

  clearCache() {
    this.articlesCache = null
    this.lastFetch = null
  }
}

// Instancia singleton
export const blogLoader = new BlogLoader()

// Hook para React
export function useBlogLoader() {
  return blogLoader
}
