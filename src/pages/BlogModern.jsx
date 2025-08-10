import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'

export default function BlogModern() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [filteredArticles, setFilteredArticles] = useState([])

  // Categorías optimizadas para AdSense con alto valor comercial
  const categories = [
    { id: 'all', name: '🏠 Todos los Artículos', description: 'Ver todos los artículos disponibles' },
    { id: 'desarrollo', name: '💻 Desarrollo Web', description: 'Desarrollo de aplicaciones y sitios web' },
    { id: 'tecnologia', name: '🚀 Tecnología', description: 'Últimas tendencias en tecnología' },
    { id: 'seguridad', name: '🔒 Ciberseguridad', description: 'Seguridad informática empresarial' },
    { id: 'marketing', name: '📈 Marketing Digital', description: 'Estrategias de marketing online' },
    { id: 'ecommerce', name: '🛒 E-commerce', description: 'Comercio electrónico y ventas online' },
    { id: 'finanzas', name: '💰 Finanzas Tech', description: 'Inversión en tecnología' },
    { id: 'automatizacion', name: '⚙️ Automatización', description: 'Procesos y software empresarial' },
    { id: 'educacion', name: '🎓 Educación', description: 'Capacitación y cursos tecnológicos' }
  ]

  // Inicializar AdSense
  useEffect(() => {
    // Cargar y inicializar AdSense
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.forEach(ad => {
          if (!ad.dataset.adsbygoogleStatus) {
            window.adsbygoogle.push({})
          }
        })
      } catch (e) {
        console.log('AdSense ya inicializado')
      }
    }
  }, [])

  // Cargar solo artículos nuevos generados con el sistema moderno
  useEffect(() => {
    const loadModernArticles = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log('🚀 Iniciando carga de artículos...')

        // Cargar artículos directamente desde el directorio blog
        const articles = await loadDirectlyFromBlog()

        console.log('📚 Artículos cargados:', articles.length)
        setArticles(articles)

      } catch (err) {
        console.error('❌ Error cargando artículos:', err)
        setError('Error cargando artículos. Por favor recarga la página.')
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    loadModernArticles()
  }, [])

  // Función para cargar artículos directamente desde el directorio blog
  const loadDirectlyFromBlog = async () => {
    console.log('🔍 Buscando artículos en /blog/')

    try {
      // Método principal: Cargar desde el índice JSON
      const indexResponse = await fetch('/blog/index.json')

      if (indexResponse.ok) {
        const indexData = await indexResponse.json()
        console.log('📑 Índice encontrado:', indexData.length, 'artículos')

        // Procesar artículos desde el índice (más eficiente)
        const articles = indexData.slice(0, 20).map(item => {
          if (!item.file || !item.file.endsWith('.html')) {
            return null
          }

          return {
            id: item.slug || item.file.replace('.html', ''),
            slug: item.slug || item.file.replace('.html', ''),
            title: cleanTitle(item.title || 'Artículo sin título'),
            excerpt: item.excerpt || 'Descripción no disponible',
            category: item.category || extractCategoryFromContent(item.title || '', item.excerpt || ''),
            date: item.date || new Date().toISOString().split('T')[0],
            readTime: calculateReadTime(item.excerpt || ''),
            file: item.file,
            url: `/blog/${item.file}`,
            image: item.image || '/logos-he-imagenes/logo3.png'
          }
        }).filter(Boolean) // Remover elementos null

        if (articles.length > 0) {
          console.log('✅ Artículos procesados desde índice:', articles.length)
          return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
        }
      }
    } catch (indexError) {
      console.log('📑 Índice JSON no disponible, usando método alternativo...')
    }

    // Método alternativo: Solo verificar archivo de prueba y algunos conocidos
    console.log('🔍 Buscando archivos específicos...')
    const knownFiles = [
      'test-integracion-blog-moderno.html' // Archivo de prueba que sabemos que existe
    ]

    const articles = []

    for (const filename of knownFiles) {
      try {
        const response = await fetch(`/blog/${filename}`, {
          method: 'HEAD' // Solo verificar si existe, sin descargar contenido
        })

        if (response.ok) {
          console.log(`✅ Archivo encontrado: ${filename}`)

          // Crear artículo básico basado en el nombre del archivo
          const article = {
            id: filename.replace('.html', ''),
            slug: filename.replace('.html', ''),
            title: filename.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            excerpt: 'Artículo disponible - click para leer el contenido completo',
            category: extractCategoryFromContent(filename, ''),
            date: extractDateFromFilename(filename) || new Date().toISOString().split('T')[0],
            readTime: '5 min',
            file: filename,
            url: `/blog/${filename}`,
            image: '/logos-he-imagenes/logo3.png'
          }

          articles.push(article)
        }
      } catch (err) {
        console.log(`📄 ${filename} no encontrado (normal si no existe)`)
      }
    }

    console.log(`📊 Total artículos encontrados: ${articles.length}`)
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // Extraer metadata del HTML del artículo
  const extractArticleMetadata = (html, filename) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      const title = doc.querySelector('title')?.textContent || 
                   doc.querySelector('h1')?.textContent ||
                   'Artículo sin título'
      
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                         doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                         'Descripción no disponible'
      
      const category = extractCategoryFromContent(title, description)
      const publishDate = extractDateFromFilename(filename) || new Date().toISOString()
      
      return {
        id: filename.replace('.html', ''),
        slug: filename.replace('.html', ''),
        title: cleanTitle(title),
        excerpt: description.substring(0, 200) + '...',
        category,
        date: publishDate,
        readTime: calculateReadTime(description),
        file: filename,
        url: `/blog/${filename}`,
        image: '/logos-he-imagenes/logo3.png'
      }
    } catch (error) {
      console.warn('Error extrayendo metadata:', error)
      return null
    }
  }

  // Utilidades
  const extractCategoryFromContent = (title, description) => {
    const content = (title + ' ' + description).toLowerCase()
    
    if (content.includes('seguridad') || content.includes('ciberseguridad')) return 'seguridad'
    if (content.includes('marketing') || content.includes('seo')) return 'marketing'
    if (content.includes('ecommerce') || content.includes('tienda')) return 'ecommerce'
    if (content.includes('finanza') || content.includes('inversión')) return 'finanzas'
    if (content.includes('automatización') || content.includes('software')) return 'automatizacion'
    if (content.includes('curso') || content.includes('educación')) return 'educacion'
    if (content.includes('tecnología') || content.includes('cloud')) return 'tecnologia'
    
    return 'desarrollo'
  }

  const extractDateFromFilename = (filename) => {
    const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/)
    return dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
  }

  const cleanTitle = (title) => {
    return title
      .replace(/\s*\|\s*hgaruna.*$/i, '')
      .replace(/\s*-\s*Desarrollo Web.*$/i, '')
      .trim()
  }

  const calculateReadTime = (text) => {
    const words = text.split(/\s+/).length
    const minutes = Math.max(1, Math.ceil(words / 200))
    return `${minutes} min`
  }

  // Filtrar artículos
  useEffect(() => {
    let result = articles

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      result = result.filter(article => article.category === selectedCategory)
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term)
      )
    }

    setFilteredArticles(result)
  }, [articles, selectedCategory, searchTerm])

  // Actualizar URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    setSearchParams(params, { replace: true })
  }, [searchTerm, selectedCategory, setSearchParams])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blog-modern-container">
        <div className="blog-modern-loading">
          <div className="loading-spinner"></div>
          <p>Cargando artículos educativos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-modern-container">
        <div className="blog-modern-loading">
          <div className="error-icon">⚠️</div>
          <h3>Error de Carga</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-modern-container">
      <Helmet>
        <title>Blog Educativo de Tecnología - hgaruna Digital</title>
        <meta name="description" content="Artículos educativos sobre desarrollo web, ciberseguridad, marketing digital y tecnología empresarial. Contenido profesional y actualizado." />
        <meta name="keywords" content="desarrollo web, ciberseguridad, marketing digital, tecnología empresarial, programación, software" />
        <meta property="og:title" content="Blog Educativo de Tecnología - hgaruna Digital" />
        <meta property="og:description" content="Artículos educativos sobre desarrollo web, ciberseguridad, marketing digital y tecnología empresarial." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hgaruna.org/blog" />
      </Helmet>

      {/* AdSense: Top Banner */}
      <div className="adsense-top-banner">
        <div className="adsense-label">Publicidad</div>
        <ins className="adsbygoogle"
             style={{display: 'block'}}
             data-ad-client="ca-pub-7772175009790237"
             data-ad-slot="1234567890"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      {/* Hero Section Optimizada */}
      <section className="blog-modern-hero">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              🎓 Centro Educativo Digital
            </div>
            <h1 className="hero-title">
              Blog de <span className="text-gradient">Tecnología Empresarial</span>
            </h1>
            <p className="hero-description">
              Contenido educativo premium sobre desarrollo web, ciberseguridad, marketing digital y 
              tecnologías que impulsan los negocios modernos. Información práctica para profesionales.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{articles.length}</span>
                <span className="stat-label">Artículos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{categories.length - 1}</span>
                <span className="stat-label">Categorías</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2025</span>
                <span className="stat-label">Actualizado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container blog-main-content">
        {/* Filtros Modernos */}
        <div className="blog-modern-filters">
          <div className="filters-header">
            <h2>Explora Contenido Educativo</h2>
            <p>Encuentra artículos específicos por tema o utiliza el buscador</p>
          </div>
          
          <div className="search-filter-row">
            <div className="search-group">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="modern-search-input"
                  placeholder="Buscar artículos educativos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>
          </div>

          {/* Grid de Categorías */}
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-header">
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {category.id === 'all' 
                      ? articles.length 
                      : articles.filter(a => a.category === category.id).length
                    }
                  </span>
                </div>
                <p className="category-description">{category.description}</p>
              </button>
            ))}
          </div>

          <div className="results-summary">
            <span className="results-count">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'artículo' : 'artículos'}
              {searchTerm && ` encontrados para "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* AdSense: Mid Content */}
        <div className="adsense-mid-content">
          <div className="adsense-label">Publicidad</div>
          <ins className="adsbygoogle"
               style={{display: 'block', textAlign: 'center'}}
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-7772175009790237"
               data-ad-slot="0987654321"></ins>
        </div>

        {/* Grid de Artículos Moderno */}
        {filteredArticles.length > 0 ? (
          <div className="articles-modern-grid">
            {filteredArticles.map((article, index) => (
              <article key={article.slug} className={`article-modern-card ${index === 0 ? 'featured' : ''}`}>
                <div className="article-image-container">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="article-image"
                    onError={(e) => {
                      e.target.src = '/logos-he-imagenes/logo3.png'
                    }}
                  />
                  <div className="article-overlay">
                    <span className="category-badge">
                      {categories.find(c => c.id === article.category)?.name || article.category}
                    </span>
                  </div>
                </div>

                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-date">
                      📅 {formatDate(article.date)}
                    </span>
                    <span className="article-read-time">
                      ⏱️ {article.readTime}
                    </span>
                  </div>

                  <h3 className="article-title">
                    <Link to={article.url} className="article-link">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="article-excerpt">
                    {article.excerpt}
                  </p>

                  <div className="article-footer">
                    <Link to={article.url} className="read-more-btn">
                      Leer Artículo Completo
                      <span className="btn-arrow">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-empty-state">
            <div className="empty-icon">📚</div>
            <h3>Contenido Educativo Próximamente</h3>
            <p>
              {searchTerm || selectedCategory !== 'all'
                ? 'No se encontraron artículos con esos criterios. Intenta ajustar los filtros.'
                : 'Estamos preparando contenido educativo de alta calidad. Los nuevos artículos aparecerán aquí automáticamente.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Ver Todos los Artículos
              </button>
            )}
          </div>
        )}

        {/* AdSense: Bottom Content */}
        <div className="adsense-bottom-content">
          <div className="adsense-label">Publicidad</div>
          <ins className="adsbygoogle"
               style={{display: 'block'}}
               data-ad-client="ca-pub-7772175009790237"
               data-ad-slot="1122334455"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        {/* Sección Educativa */}
        <section className="educational-section">
          <div className="educational-content">
            <h2>Centro de Recursos Educativos</h2>
            <p>
              Nuestro blog es una fuente confiable de información técnica actualizada, 
              diseñada para profesionales y empresas que buscan mantenerse al día con 
              las últimas tendencias en tecnología.
            </p>
            <div className="educational-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <h4>Contenido Especializado</h4>
                <p>Artículos técnicos y guías prácticas para profesionales</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <h4>Casos de Estudio</h4>
                <p>Análisis reales de implementaciones exitosas</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <h4>Actualizaciones Constantes</h4>
                <p>Información fresca sobre las últimas tecnologías</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
