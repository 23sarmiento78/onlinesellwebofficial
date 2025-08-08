import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useSimpleArticles } from '@hooks/useSimpleArticles'

export default function BlogIA() {
  const { articles, loading, error } = useSimpleArticles()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [filteredArticles, setFilteredArticles] = useState([])

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'desarrollo', name: 'Desarrollo' },
    { id: 'programacion', name: 'Programación' },
    { id: 'ia', name: 'IA' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend' },
    { id: 'devops', name: 'DevOps' },
    { id: 'seguridad', name: 'Seguridad' }
  ]

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
        (article.excerpt && article.excerpt.toLowerCase().includes(term))
      )
    }

    // Ordenar por fecha (más recientes primero)
    result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredArticles(result)
  }, [articles, selectedCategory, searchTerm])

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    setSearchParams(params, { replace: true })
  }, [searchTerm, selectedCategory, setSearchParams])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blog-ia-container">
        <div className="container">
          <div className="blog-loading">
            <div className="blog-loading-spinner"></div>
            <p>Cargando artículos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-ia-container">
        <div className="container">
          <div className="blog-error">
            <h2>Error al cargar artículos</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-ia-container">
      <Helmet>
        <title>Blog de Desarrollo Web - HGaruna</title>
        <meta name="description" content="Artículos sobre desarrollo web, programación, frameworks modernos y las últimas tendencias en tecnología." />
        <meta property="og:title" content="Blog de Desarrollo Web - HGaruna" />
        <meta property="og:description" content="Artículos sobre desarrollo web, programación, frameworks modernos y las últimas tendencias en tecnología." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero-content">
            <h1>Blog de Desarrollo Web</h1>
            <p>
              Tu fuente confiable de noticias, tutoriales y tendencias sobre desarrollo web, 
              tecnología y programación. Mantente actualizado con el mundo digital.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container">
        {/* Filtros */}
        <div className="blog-filters">
          <div className="blog-filters-row">
            <div className="blog-search-group">
              <input
                type="text"
                className="blog-search-input"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="blog-filter-group">
              <label className="blog-filter-label">Categoría:</label>
              <select
                className="blog-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--blog-text-light)' }}>
            {filteredArticles.length} {filteredArticles.length === 1 ? 'artículo' : 'artículos'}
            {searchTerm && ` encontrados para "${searchTerm}"`}
            {selectedCategory !== 'all' && ` en ${categories.find(c => c.id === selectedCategory)?.name}`}
          </div>
        </div>

        {/* Grid de Artículos */}
        {filteredArticles.length > 0 ? (
          <div className="blog-articles-grid">
            {filteredArticles.map(article => (
              <article key={article.slug} className="blog-article-card">
                <div className="blog-card-image">
                  <img 
                    src={article.image || '/logos-he-imagenes/programacion.jpeg'} 
                    alt={article.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/logos-he-imagenes/programacion.jpeg'
                    }}
                  />
                  <div className="blog-card-category">
                    <span className="blog-category-badge">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="blog-card-content">
                  <h2 className="blog-card-title">
                    <Link to={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>
                  
                  <p className="blog-card-excerpt">
                    {article.excerpt || 'Sin descripción disponible'}
                  </p>
                  
                  <div className="blog-card-meta">
                    <span className="blog-card-date">
                      {formatDate(article.date)}
                    </span>
                    <span className="blog-card-read-time">
                      📖 {article.readTime || '5 min'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <h3>No se encontraron artículos</h3>
            <p>
              {searchTerm || selectedCategory !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay artículos disponibles en este momento'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
