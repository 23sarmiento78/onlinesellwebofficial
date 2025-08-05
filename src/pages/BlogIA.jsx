import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useArticles } from '@hooks/useArticles'
import { ARTICLE_CATEGORIES } from '@utils/articleGenerator'
import ArticleGenerator from '@components/ArticleGenerator'
import SavedFiles from '@components/SavedFiles'

export default function BlogIA() {
  const { articles, loading, getArticlesByCategory, searchArticles, addArticle } = useArticles()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [viewMode, setViewMode] = useState('grid') // 'grid', 'list', 'magazine'
  const [sortBy, setSortBy] = useState('date') // 'date', 'readTime', 'title'
  const [showGenerator, setShowGenerator] = useState(false)
  const [filteredArticles, setFilteredArticles] = useState([])

  useEffect(() => {
    let result = articles

    // Filter by category
    if (selectedCategory !== 'all') {
      result = getArticlesByCategory(selectedCategory)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      result = searchArticles(searchTerm)
      if (selectedCategory !== 'all') {
        result = result.filter(article => article.category === selectedCategory)
      }
    }

    // Sort articles
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime)
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date)
      }
    })

    setFilteredArticles(result)
  }, [articles, selectedCategory, searchTerm, sortBy])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    setSearchParams(params)
  }, [searchTerm, selectedCategory, setSearchParams])

  const categories = ['all', ...Object.keys(ARTICLE_CATEGORIES)]

  const handleArticleGenerated = (article) => {
    addArticle(article)
    setShowGenerator(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Article Card Component
  const ArticleCard = ({ article }) => (
    <article className="blog-card hover-lift">
      <div className="blog-card-image">
        <img src={article.image} alt={article.title} loading="lazy" />
        <div className="blog-card-badge">
          {ARTICLE_CATEGORIES[article.category]?.name || article.category}
        </div>
      </div>
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>
            <i className="fas fa-calendar mr-1"></i>
            {formatDate(article.date)}
          </span>
          <span>
            <i className="fas fa-clock mr-1"></i>
            {article.readTime}
          </span>
          <span>
            <i className="fas fa-user mr-1"></i>
            {article.author}
          </span>
        </div>
        <h2 className="blog-card-title">
          <Link to={`/blog/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="blog-card-excerpt">{article.excerpt}</p>
        {article.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="blog-card-footer">
          <Link to={`/blog/${article.slug}`} className="btn btn-outline btn-sm">
            Leer más <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </div>
    </article>
  )

  // Article List Item Component
  const ArticleListItem = ({ article }) => (
    <article className="flex gap-6 p-6 bg-secondary rounded-xl border border-light hover:shadow-lg transition-all">
      <div className="flex-shrink-0">
        <img
          src={article.image}
          alt={article.title}
          className="w-32 h-24 object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 text-sm text-muted mb-2">
          <span className="bg-primary text-white px-2 py-1 rounded text-xs">
            {ARTICLE_CATEGORIES[article.category]?.name || article.category}
          </span>
          <span><i className="fas fa-calendar mr-1"></i>{formatDate(article.date)}</span>
          <span><i className="fas fa-clock mr-1"></i>{article.readTime}</span>
          <span><i className="fas fa-user mr-1"></i>{article.author}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          <Link to={`/blog/${article.slug}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </h2>
        <p className="text-secondary mb-3">{article.excerpt}</p>
        {article.tags && (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 4).map((tag, index) => (
              <span key={index} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 flex items-center">
        <Link to={`/blog/${article.slug}`} className="btn btn-outline">
          Leer artículo
        </Link>
      </div>
    </article>
  )

  // Featured Article Component
  const ArticleFeatured = ({ article }) => (
    <article className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 p-8 lg:p-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
            {ARTICLE_CATEGORIES[article.category]?.name || article.category}
          </span>
          <span className="text-sm opacity-90">
            <i className="fas fa-calendar mr-1"></i>
            {formatDate(article.date)}
          </span>
          <span className="text-sm opacity-90">
            <i className="fas fa-user mr-1"></i>
            {article.author}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-lg opacity-90 mb-6 max-w-2xl">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4">
          <Link to={`/blog/${article.slug}`} className="btn btn-white">
            Leer artículo completo
          </Link>
          <span className="text-sm opacity-75">
            <i className="fas fa-clock mr-1"></i>
            {article.readTime}
          </span>
        </div>
      </div>
    </article>
  )

  // Compact Article Component
  const ArticleCompact = ({ article }) => (
    <article className="bg-secondary rounded-xl p-4 border border-light hover:shadow-lg transition-all">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-primary text-white px-2 py-1 rounded text-xs">
          {ARTICLE_CATEGORIES[article.category]?.name || article.category}
        </span>
        <span className="text-xs text-muted">
          <i className="fas fa-calendar mr-1"></i>
          {formatDate(article.date)}
        </span>
      </div>
      <h3 className="font-semibold mb-2 leading-tight">
        <Link to={`/blog/${article.slug}`} className="hover:text-primary transition-colors">
          {article.title}
        </Link>
      </h3>
      <p className="text-sm text-secondary mb-3 line-clamp-2">
        {article.excerpt}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Por {article.author}</span>
        <span className="text-xs text-muted">{article.readTime}</span>
      </div>
    </article>
  )

  return (
    <>
      <Helmet>
        <title>Blog de Desarrollo Web | Tips y Tutoriales | hgaruna</title>
        <meta 
          name="description" 
          content="Blog con artículos, tips y tutoriales sobre desarrollo web, diseño, SEO y tecnología. Aprende con los expertos de hgaruna." 
        />
        <meta 
          name="keywords" 
          content="blog desarrollo web, tutoriales web, tips seo, diseño web, programación, marketing digital, villa carlos paz" 
        />
      </Helmet>

      <div className="pt-20">
        {/* Header */}
        <section className="section-sm section-secondary">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-blog"></i>
                Blog
              </div>
              <h1 className="section-title">Blog de Desarrollo Web</h1>
              <p className="section-description">
                Artículos, tips y tutoriales sobre desarrollo web, diseño, SEO y las últimas tendencias tecnológicas.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
                {/* Search */}
                <div className="search-form flex-1 max-w-md">
                  <div className="relative">
                    <i className="search-icon fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Buscar artículos..."
                      className="search-input form-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="search-clear"
                        onClick={() => setSearchTerm('')}
                        aria-label="Limpiar búsqueda"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Vista:</label>
                    <div className="flex border border-light rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-secondary'}`}
                      >
                        <i className="fas fa-th"></i>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-secondary'}`}
                      >
                        <i className="fas fa-list"></i>
                      </button>
                      <button
                        onClick={() => setViewMode('magazine')}
                        className={`px-3 py-1 text-sm ${viewMode === 'magazine' ? 'bg-primary text-white' : 'bg-secondary'}`}
                      >
                        <i className="fas fa-newspaper"></i>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Ordenar:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="date">Más reciente</option>
                      <option value="title">Alfabético</option>
                      <option value="readTime">Tiempo de lectura</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const categoryInfo = ARTICLE_CATEGORIES[category]
                  const displayName = category === 'all' ? 'Todos' : categoryInfo?.name || category

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`btn btn-sm ${
                        selectedCategory === category ? 'btn-primary' : 'btn-ghost'
                      }`}
                    >
                      {categoryInfo?.icon && <i className={`${categoryInfo.icon} mr-1`}></i>}
                      {displayName}
                    </button>
                  )
                })}
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {loading ? 'Cargando...' : `${filteredArticles.length} artículo${filteredArticles.length !== 1 ? 's' : ''} encontrado${filteredArticles.length !== 1 ? 's' : ''}`}
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` en ${ARTICLE_CATEGORIES[selectedCategory]?.name || selectedCategory}`}
                </p>

                <button
                  onClick={() => setShowGenerator(!showGenerator)}
                  className="btn btn-sm btn-primary"
                >
                  <i className="fas fa-robot mr-1"></i>
                  {showGenerator ? 'Ocultar' : 'Generar'} Artículo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Article Generator */}
        {showGenerator && (
          <section className="section-sm">
            <div className="container">
              <ArticleGenerator onArticleGenerated={handleArticleGenerated} />
            </div>
          </section>
        )}

        {/* Saved Files */}
        <section className="section-sm bg-light">
          <div className="container">
            <SavedFiles />
          </div>
        </section>

        {/* Articles Display */}
        <section className="section">
          <div className="container">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted">Cargando artículos...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <i className="fas fa-search text-6xl text-muted mb-6"></i>
                <h3 className="text-2xl font-bold mb-4">No se encontraron artículos</h3>
                <p className="text-muted mb-6">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Intenta con otros términos de búsqueda o categorías'
                    : 'Comienza generando algunos artículos con IA'
                  }
                </p>
                {(searchTerm || selectedCategory !== 'all') ? (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    className="btn btn-primary"
                  >
                    Ver todos los artículos
                  </button>
                ) : (
                  <button
                    onClick={() => setShowGenerator(true)}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-robot mr-2"></i>
                    Generar Primer Artículo
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="blog-grid">
                    {filteredArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6">
                    {filteredArticles.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                )}

                {/* Magazine View */}
                {viewMode === 'magazine' && (
                  <div className="magazine-layout">
                    {filteredArticles.length > 0 && (
                      <div className="featured-article mb-12">
                        <ArticleFeatured article={filteredArticles[0]} />
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArticles.slice(1).map((article) => (
                        <ArticleCompact key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="section-title">¿Te Gusta Nuestro Contenido?</h2>
              <p className="section-subtitle">
                Suscríbete a nuestro newsletter y recibe los últimos artículos directamente en tu email.
              </p>
              <div className="cta-buttons">
                <div className="newsletter-form max-w-md mx-auto">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      className="newsletter-input flex-1"
                    />
                    <button className="newsletter-button">
                      <i className="fas fa-paper-plane mr-2"></i>
                      Suscribirse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
