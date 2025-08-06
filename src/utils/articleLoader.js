// Utility to load existing articles from public/blog directory

import { ARTICLE_CATEGORIES } from './articleGenerator'

/**
 * Parse HTML content to extract article metadata
 * @param {string} html - HTML content
 * @param {string} filename - Original filename
 * @returns {Object} - Article metadata
 */
const parseArticleFromHTML = (html, filename) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Extract title
  const title = doc.querySelector('title')?.textContent?.replace(' | hgaruna', '') || 
                doc.querySelector('h1')?.textContent || 
                filename.replace('.html', '').replace(/-/g, ' ')
  
  // Extract description/excerpt
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  const excerpt = metaDesc || doc.querySelector('p')?.textContent?.slice(0, 150) + '...' || ''
  
  // Extract keywords for tags
  const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''
  const tags = metaKeywords ? metaKeywords.split(',').map(tag => tag.trim()).slice(0, 5) : []
  
  // Extract author
  const author = doc.querySelector('meta[name="author"]')?.getAttribute('content') || 'hgaruna'
  
  // Extract date
  const metaDate = doc.querySelector('meta[name="article:published_time"]')?.getAttribute('content') ||
                   doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content')
  const date = metaDate ? metaDate.split('T')[0] : new Date().toISOString().split('T')[0]
  
  // Extract category from meta or infer from content
  let category = doc.querySelector('meta[name="article:section"]')?.getAttribute('content') || 'desarrollo'
  
  // Infer category from filename and content
  const content = html.toLowerCase()
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('react') || titleLower.includes('javascript') || titleLower.includes('typescript') || 
      titleLower.includes('nodejs') || titleLower.includes('vue') || titleLower.includes('angular') ||
      content.includes('frontend') || content.includes('javascript') || content.includes('react')) {
    category = 'desarrollo'
  } else if (titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('diseño') || 
             titleLower.includes('design') || content.includes('figma') || content.includes('design')) {
    category = 'diseno'
  } else if (titleLower.includes('ia') || titleLower.includes('machine learning') || titleLower.includes('ai') ||
             titleLower.includes('chatbot') || titleLower.includes('nlp') || content.includes('artificial intelligence')) {
    category = 'ia'
  } else if (titleLower.includes('seo') || titleLower.includes('marketing') || titleLower.includes('analytics') ||
             content.includes('google analytics') || content.includes('marketing digital')) {
    category = 'seo'
  } else if (titleLower.includes('testing') || titleLower.includes('test') || titleLower.includes('coverage') ||
             titleLower.includes('jest') || titleLower.includes('cypress') || content.includes('unit test')) {
    category = 'programacion'
  } else if (titleLower.includes('docker') || titleLower.includes('kubernetes') || titleLower.includes('cloud') ||
             titleLower.includes('devops') || titleLower.includes('terraform') || content.includes('infraestructura')) {
    category = 'tecnologia'
  }
  
  // Calculate read time based on content length
  const textContent = doc.body?.textContent || ''
  const wordCount = textContent.split(/\s+/).length
  const readTime = Math.max(1, Math.round(wordCount / 200)) + ' min'
  
  // Generate slug from filename
  const slug = filename.replace('.html', '')
  
  // Generate unique ID
  const id = Date.now() + Math.random()
  
  return {
    id,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    excerpt,
    slug,
    category,
    date,
    readTime,
    author,
    tags: tags.length > 0 ? tags : generateTagsFromContent(titleLower, content),
    image: '/logos-he-imagenes/programacion.jpeg', // Default image
    featured: false,
    content: textContent.slice(0, 500) + '...' // Preview of content
  }
}

/**
 * Generate relevant tags from content
 * @param {string} title - Article title
 * @param {string} content - Article content
 * @returns {Array} - Array of relevant tags
 */
const generateTagsFromContent = (title, content) => {
  const commonTechTerms = [
    'javascript', 'react', 'vue', 'angular', 'nodejs', 'typescript', 'html', 'css',
    'python', 'docker', 'kubernetes', 'aws', 'git', 'api', 'database', 'sql',
    'testing', 'seo', 'performance', 'security', 'ui', 'ux', 'responsive',
    'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'mobile', 'web'
  ]
  
  const foundTerms = commonTechTerms.filter(term => 
    title.includes(term) || content.includes(term)
  )
  
  return foundTerms.slice(0, 4)
}

/**
 * Load all articles from the existing HTML files
 * @returns {Promise<Array>} - Array of article objects
 */
export const loadExistingArticles = async () => {
  try {
    // Cargar index.json con los metadatos de los artículos
    const response = await fetch('/blog/index.json')
    if (response.ok) {
      let articles = await response.json()
      // Normalizar los campos para compatibilidad con la vista
      articles = articles.map(article => {
        // Asegurar que la ruta de la imagen sea correcta
        let imagePath = article.image;
        if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('/')) {
          imagePath = `/${imagePath}`;
        } else if (!imagePath) {
          imagePath = '/logos-he-imagenes/programacion.jpeg';
        }
        
        return {
          ...article,
          id: article.slug,
          readTime: article.readTime || '5 min',
          featured: article.featured || false,
          content: article.excerpt, // Solo preview, el contenido completo se carga aparte
          image: imagePath, // Usar la ruta de imagen corregida
          file: article.file // Mantener el campo file para carga completa
        };
      });
      
      console.log(`✅ Loaded ${articles.length} articles from index.json`);
      return articles;
    } else {
      console.error('No se pudo cargar index.json');
      return [];
    }
  } catch (error) {
    console.error('Error loading articles from index.json:', error)
    return []
  }
}

/**
 * Merge existing articles with current articles, avoiding duplicates
 * @param {Array} currentArticles - Current articles from localStorage
 * @param {Array} existingArticles - Articles loaded from HTML files
 * @returns {Array} - Merged articles array
 */
export const mergeArticles = (currentArticles, existingArticles) => {
  const merged = [...currentArticles]
  const existingSlugs = new Set(currentArticles.map(article => article.slug))
  
  // Add only articles that don't already exist
  existingArticles.forEach(article => {
    if (!existingSlugs.has(article.slug)) {
      merged.push(article)
    }
  })
  
  // Sort by date (most recent first)
  merged.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  console.log(`✅ Merged articles: ${merged.length} total (${existingArticles.length} imported)`)
  return merged
}

/**
 * Initialize article loading process
 * @returns {Promise<Array>} - Complete articles array
 */
export const initializeArticles = async () => {
  try {
    // Load existing articles from HTML files
    const existingArticles = await loadExistingArticles()
    
    // Get current articles from localStorage
    const currentArticles = JSON.parse(localStorage.getItem('hgaruna_articles') || '[]')
    
    // Merge and deduplicate
    const allArticles = mergeArticles(currentArticles, existingArticles)
    
    // Save merged articles back to localStorage
    localStorage.setItem('hgaruna_articles', JSON.stringify(allArticles))
    
    return allArticles
  } catch (error) {
    console.error('Error initializing articles:', error)
    return []
  }
}
