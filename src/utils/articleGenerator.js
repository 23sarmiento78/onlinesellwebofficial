import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
let genAI = null

const initializeGemini = () => {
  if (!genAI && (import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY)) {
    genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY)
  }
  return genAI
}

// Article categories and their configurations
export const ARTICLE_CATEGORIES = {
  desarrollo: {
    name: 'Desarrollo Web',
    icon: 'fas fa-code',
    description: 'Tutoriales, frameworks y mejores prácticas de desarrollo',
    keywords: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Vue', 'Angular', 'Frontend', 'Backend', 'API', 'Framework']
  },
  diseno: {
    name: 'Diseño UI/UX',
    icon: 'fas fa-palette',
    description: 'Principios de diseño y experiencia de usuario',
    keywords: ['UI/UX', 'Figma', 'Adobe XD', 'Design System', 'Responsive', 'Mobile First', 'Accesibilidad', 'Prototipado']
  },
  ia: {
    name: 'Inteligencia Artificial',
    icon: 'fas fa-robot',
    description: 'IA aplicada al desarrollo y machine learning',
    keywords: ['Machine Learning', 'ChatGPT', 'OpenAI', 'TensorFlow', 'Python', 'Deep Learning', 'NLP', 'Computer Vision']
  },
  tecnologia: {
    name: 'Tecnología',
    icon: 'fas fa-microchip',
    description: 'Noticias tech y tendencias digitales',
    keywords: ['Cloud Computing', 'DevOps', 'Kubernetes', 'Docker', 'AWS', 'Blockchain', 'IoT', 'Cybersecurity']
  },
  programacion: {
    name: 'Programación',
    icon: 'fas fa-laptop-code',
    description: 'Conceptos de programación y algoritmos',
    keywords: ['Algoritmos', 'Estructuras de Datos', 'Clean Code', 'Patrones de Diseño', 'Testing', 'Git', 'Performance']
  },
  seo: {
    name: 'SEO y Marketing Digital',
    icon: 'fas fa-search',
    description: 'Optimización y marketing en línea',
    keywords: ['SEO', 'Google Analytics', 'SEM', 'Content Marketing', 'Social Media', 'Email Marketing', 'Conversion']
  }
}

// Article templates for different types
const ARTICLE_TEMPLATES = {
  tutorial: `
Escribe un artículo tutorial completo sobre: {topic}

El artículo debe:
- Tener entre 1500-2500 palabras
- Estar dirigido a desarrolladores de nivel intermedio
- Incluir ejemplos de código prácticos cuando sea relevante
- Tener una estructura clara con headers H2 y H3
- Incluir una introducción enganchante
- Tener una conclusión con próximos pasos
- Ser SEO optimizado
- Incluir tips y mejores prácticas
- Mencionar al final que el artículo fue escrito por hgaruna

Estructura requerida:
1. Introducción (por qué es importante este tema)
2. Conceptos fundamentales
3. Implementación paso a paso
4. Ejemplos prácticos
5. Mejores prácticas y tips
6. Conclusión y próximos pasos

Por favor escribe en español y con un tono profesional pero accesible.
`,
  news: `
Escribe un artículo de noticias sobre: {topic}

El artículo debe:
- Tener entre 800-1200 palabras
- Ser informativo y actual
- Incluir análisis e implicaciones
- Tener una estructura periodística clara
- Ser objetivo pero con perspectiva técnica
- Incluir contexto histórico si es relevante
- Mencionar al final que el artículo fue escrito por hgaruna

Estructura requerida:
1. Titular llamativo
2. Lead (resumen de los puntos clave)
3. Desarrollo de la noticia
4. Análisis e implicaciones
5. Opinión experta
6. Conclusión

Por favor escribe en español con estilo periodístico profesional.
`,
  guide: `
Escribe una guía completa sobre: {topic}

El artículo debe:
- Tener entre 2000-3000 palabras
- Ser una guía paso a paso
- Incluir ejemplos detallados
- Tener elementos visuales descriptivos
- Ser comprensible para principiantes
- Incluir recursos adicionales
- Mencionar al final que el artículo fue escrito por hgaruna

Estructura requerida:
1. Introducción (qué aprenderá el lector)
2. Requisitos previos
3. Guía paso a paso detallada
4. Troubleshooting común
5. Recursos adicionales
6. Conclusión

Por favor escribe en español con tono educativo y claro.
`
}

/**
 * Generate article content using Gemini AI
 * @param {Object} params - Article generation parameters
 * @param {string} params.topic - Article topic
 * @param {string} params.category - Article category
 * @param {string} params.type - Article type (tutorial, news, guide)
 * @param {string} params.difficulty - Difficulty level (beginner, intermediate, advanced)
 * @returns {Promise<Object>} Generated article content
 */
export async function generateArticle({ topic, category, type = 'tutorial', difficulty = 'intermediate' }) {
  const ai = initializeGemini()
  
  if (!ai) {
    throw new Error('Gemini AI no está configurado. Verifica la variable GEMINI_API_KEY')
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' })
    
    // Select appropriate template
    const template = ARTICLE_TEMPLATES[type] || ARTICLE_TEMPLATES.tutorial
    const prompt = template.replace('{topic}', topic)
    
    // Add category-specific context
    const categoryInfo = ARTICLE_CATEGORIES[category]
    const enhancedPrompt = `
${prompt}

Contexto adicional:
- Categoría: ${categoryInfo?.name || category}
- Keywords relacionadas: ${categoryInfo?.keywords?.join(', ') || ''}
- Nivel de dificultad: ${difficulty}
- El artículo debe ser relevante para la audiencia de hgaruna Digital
- Incluir ejemplos prácticos cuando sea posible
- Optimizar para SEO con keywords naturales
`

    console.log('Generando artículo con Gemini AI...')
    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const content = response.text()

    // Parse the generated content
    const lines = content.split('\n').filter(line => line.trim())
    const title = extractTitle(lines) || `${topic} - Guía Completa`
    const excerpt = extractExcerpt(content) || `Descubre todo sobre ${topic} en esta guía completa.`
    
    // Generate metadata
    const slug = generateSlug(title)
    const readTime = calculateReadTime(content)
    const tags = generateTags(content, categoryInfo?.keywords || [])

    return {
      title,
      content,
      excerpt,
      slug,
      category,
      readTime,
      tags,
      author: 'hgaruna',
      date: new Date().toISOString().split('T')[0],
      image: '/logos-he-imagenes/programacion.jpeg' // Default image
    }
  } catch (error) {
    console.error('Error generando artículo:', error)
    throw new Error(`Error al generar artículo: ${error.message}`)
  }
}

/**
 * Generate multiple article ideas for a category
 * @param {string} category - Article category
 * @param {number} count - Number of ideas to generate
 * @returns {Promise<Array>} Array of article ideas
 */
export async function generateArticleIdeas(category, count = 5) {
  const ai = initializeGemini()
  
  if (!ai) {
    throw new Error('Gemini AI no está configurado')
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-pro' })
    const categoryInfo = ARTICLE_CATEGORIES[category]
    
    const prompt = `
Genera ${count} ideas de artículos para un blog de tecnología enfocado en ${categoryInfo?.name || category}.

Para cada idea, proporciona:
1. Título atractivo
2. Descripción breve (1-2 oraciones)
3. Tipo de artículo (tutorial, news, guide)
4. Nivel de dificultad (beginner, intermediate, advanced)

Las ideas deben ser:
- Actuales y relevantes
- Específicas y accionables
- Orientadas a desarrolladores
- SEO friendly

Keywords relacionadas: ${categoryInfo?.keywords?.join(', ') || ''}

Formato de respuesta:
1. Título: [título]
   Descripción: [descripción]
   Tipo: [tipo]
   Nivel: [nivel]

2. ...
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()

    return parseArticleIdeas(content)
  } catch (error) {
    console.error('Error generando ideas:', error)
    throw new Error(`Error al generar ideas: ${error.message}`)
  }
}

// Helper functions
function extractTitle(lines) {
  for (const line of lines) {
    if (line.startsWith('#') && !line.startsWith('##')) {
      return line.replace(/^#+\s*/, '').trim()
    }
  }
  return null
}

function extractExcerpt(content) {
  const paragraphs = content.split('\n\n').filter(p => 
    p.trim() && 
    !p.startsWith('#') && 
    !p.startsWith('```') &&
    p.length > 50
  )
  
  if (paragraphs.length > 0) {
    return paragraphs[0].substring(0, 200) + '...'
  }
  return null
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
}

function calculateReadTime(content) {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min`
}

function generateTags(content, categoryKeywords) {
  const tags = []
  const contentLower = content.toLowerCase()
  
  // Add category keywords that appear in content
  categoryKeywords.forEach(keyword => {
    if (contentLower.includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  })
  
  // Add some common tech tags
  const commonTags = ['Tutorial', 'Desarrollo', 'Programación', 'Web', 'JavaScript', 'React']
  commonTags.forEach(tag => {
    if (contentLower.includes(tag.toLowerCase()) && !tags.includes(tag)) {
      tags.push(tag)
    }
  })
  
  return tags.slice(0, 6) // Limit to 6 tags
}

function parseArticleIdeas(content) {
  const ideas = []
  const lines = content.split('\n')
  let currentIdea = {}
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    if (trimmed.match(/^\d+\./)) {
      if (Object.keys(currentIdea).length > 0) {
        ideas.push(currentIdea)
      }
      currentIdea = {}
    }
    
    if (trimmed.startsWith('Título:')) {
      currentIdea.title = trimmed.replace('Título:', '').trim()
    } else if (trimmed.startsWith('Descripción:')) {
      currentIdea.description = trimmed.replace('Descripción:', '').trim()
    } else if (trimmed.startsWith('Tipo:')) {
      currentIdea.type = trimmed.replace('Tipo:', '').trim()
    } else if (trimmed.startsWith('Nivel:')) {
      currentIdea.difficulty = trimmed.replace('Nivel:', '').trim()
    }
  }
  
  if (Object.keys(currentIdea).length > 0) {
    ideas.push(currentIdea)
  }
  
  return ideas
}

export default {
  generateArticle,
  generateArticleIdeas,
  ARTICLE_CATEGORIES
}
