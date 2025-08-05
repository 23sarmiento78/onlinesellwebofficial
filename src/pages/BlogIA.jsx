import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { useArticles } from '@hooks/useArticles'
import { ARTICLE_CATEGORIES } from '@utils/articleGenerator'
import ArticleGenerator from '@components/ArticleGenerator'
import SavedFiles from '@components/SavedFiles'
import SitemapStatus from '@components/SitemapStatus'
import StyleUpdateStatus from '@components/StyleUpdateStatus'
import Hero from '@components/Hero'

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

  // Enhanced Article Card Component
  const EnhancedArticleCard = ({ article }) => (
    <article className="blog-article-card animate-fade-in-up">
      <div className="blog-article-image">
        <img src={article.image} alt={article.title} loading="lazy" />
        <div className="blog-article-category">
          {ARTICLE_CATEGORIES[article.category]?.name || article.category}
        </div>
      </div>
      <div className="blog-article-content">
        <div className="blog-article-meta">
          <div className="blog-article-meta-item">
            <i className="fas fa-calendar"></i>
            {formatDate(article.date)}
          </div>
          <div className="blog-article-meta-item">
            <i className="fas fa-clock"></i>
            {article.readTime}
          </div>
          <div className="blog-article-meta-item">
            <i className="fas fa-user"></i>
            {article.author}
          </div>
        </div>
        <h2 className="blog-article-title">
          <Link to={`/blog/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="blog-article-excerpt">{article.excerpt}</p>
        {article.tags && (
          <div className="blog-article-tags">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="blog-article-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="blog-article-footer">
          <Link to={`/blog/${article.slug}`} className="blog-read-more">
            Leer artículo completo
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </article>
  )

  // Keep original for compatibility
  const ArticleCard = ({ article }) => <EnhancedArticleCard article={article} />

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

      <div>
        {/* Advanced Hero Section */}
        <Hero
          badge={{
            icon: 'fas fa-newspaper',
            text: 'Tu fuente de conocimiento tech'
          }}
          title={
            <>
              Blog de <span className="highlight">Desarrollo</span>
              <br />
              Web y <span className="highlight">Tecnología</span>
            </>
          }
          subtitle="Artículos, tutoriales y tendencias sobre desarrollo web, programación, IA y las últimas innovaciones tecnológicas. Mantente actualizado con contenido de calidad desde Villa Carlos Paz."
          backgroundVideo="/5377684-uhd_3840_2160_25fps.mp4"
          backgroundImage="/logos-he-imagenes/fondo-hero.jpg"
          variant="fullscreen"
          animated={true}
          showFloatingElements={true}
          showParticles={true}
          ctas={[
            {
              href: "#articles",
              className: 'cta-button primary',
              icon: 'fas fa-scroll',
              text: 'Ver Artículos'
            },
            {
              href: "#generator",
              className: 'cta-button secondary',
              icon: 'fas fa-robot',
              text: 'Generar Contenido'
            }
          ]}
          stats={[
            { number: `${articles.length}+`, label: 'Artículos Publicados' },
            { number: `${Object.keys(ARTICLE_CATEGORIES).length}`, label: 'Categorías Tech' },
            { number: '15K+', label: 'Lectores Mensuales' },
            { number: '98%', label: 'Satisfacción' }
          ]}
        />

        {/* Filters Section */}
        <section className="blog-filters-section">
          <div className="container">
            <div className="blog-filters-container">

              {/* Search Bar */}
              <div className="blog-search-bar">
                <i className="blog-search-icon fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar artículos, tutoriales, tips..."
                  className="blog-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filters Row */}
              <div className="blog-filters-row">
                {/* Categories */}
                <div className="blog-categories">
                  {categories.map((category) => {
                    const categoryInfo = ARTICLE_CATEGORIES[category]
                    const displayName = category === 'all' ? 'Todos los Artículos' : categoryInfo?.name || category
                    const articleCount = category === 'all' ? articles.length : getArticlesByCategory(category).length

                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`blog-category-btn ${
                          selectedCategory === category ? 'active' : ''
                        }`}
                      >
                        {categoryInfo?.icon && <i className={categoryInfo.icon}></i>}
                        {displayName}
                        <span className="ml-1 text-xs opacity-75">({articleCount})</span>
                      </button>
                    )
                  })}
                </div>

                {/* Controls */}
                <div className="blog-controls">
                  {/* View Switcher */}
                  <div className="blog-view-switcher">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`blog-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    >
                      <i className="fas fa-th"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`blog-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('magazine')}
                      className={`blog-view-btn ${viewMode === 'magazine' ? 'active' : ''}`}
                    >
                      <i className="fas fa-newspaper"></i>
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="blog-sort-select"
                  >
                    <option value="date">Más reciente</option>
                    <option value="title">Alfabético</option>
                    <option value="readTime">Tiempo de lectura</option>
                  </select>

                  {/* Generate Button */}
                  <button
                    onClick={() => setShowGenerator(!showGenerator)}
                    className="btn btn-primary"
                  >
                    <i className="fas fa-robot mr-2"></i>
                    {showGenerator ? 'Ocultar' : 'Generar'} Artículo
                  </button>
                </div>
              </div>

              {/* Results Summary */}
              {(searchTerm || selectedCategory !== 'all') && (
                <div className="text-center py-4">
                  <p className="text-muted">
                    {loading ? 'Buscando...' : `${filteredArticles.length} artículo${filteredArticles.length !== 1 ? 's' : ''} encontrado${filteredArticles.length !== 1 ? 's' : ''}`}
                    {searchTerm && ` para "${searchTerm}"`}
                    {selectedCategory !== 'all' && ` en ${ARTICLE_CATEGORIES[selectedCategory]?.name || selectedCategory}`}
                  </p>
                </div>
              )}
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

        {/* Trending Articles Section */}
        {filteredArticles.length > 3 && (
          <section className="blog-trending-section">
            <div className="container">
              <div className="blog-trending-content">
                <div className="blog-trending-header">
                  <h2 className="blog-trending-title">🔥 Artículos Trending</h2>
                  <p className="blog-trending-subtitle">
                    Los artículos más leídos y populares esta semana
                  </p>
                </div>
                <div className="blog-trending-grid">
                  {filteredArticles.slice(0, 3).map((article) => (
                    <div key={article.id} className="blog-trending-card">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <i className={ARTICLE_CATEGORIES[article.category]?.icon || 'fas fa-star'}></i>
                        </div>
                        <div>
                          <div className="text-sm opacity-80">{ARTICLE_CATEGORIES[article.category]?.name}</div>
                          <div className="text-xs opacity-60">{formatDate(article.date)}</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        <Link to={`/blog/${article.slug}`} className="text-white hover:text-gray-200 transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-sm opacity-80 mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs opacity-60">{article.readTime}</span>
                        <Link
                          to={`/blog/${article.slug}`}
                          className="text-white hover:text-gray-200 text-sm font-medium"
                        >
                          Leer más →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Stats Section */}
        <section className="blog-stats-section">
          <div className="container">
            <div className="blog-stats-grid">
              <div className="blog-stats-item">
                <div className="blog-stats-icon">
                  <i className="fas fa-newspaper"></i>
                </div>
                <div className="blog-stats-number">{articles.length}</div>
                <div className="blog-stats-label">Artículos Publicados</div>
              </div>
              <div className="blog-stats-item">
                <div className="blog-stats-icon">
                  <i className="fas fa-tags"></i>
                </div>
                <div className="blog-stats-number">{Object.keys(ARTICLE_CATEGORIES).length}</div>
                <div className="blog-stats-label">Categorías</div>
              </div>
              <div className="blog-stats-item">
                <div className="blog-stats-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="blog-stats-number">15.2k</div>
                <div className="blog-stats-label">Lecturas Mensuales</div>
              </div>
              <div className="blog-stats-item">
                <div className="blog-stats-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="blog-stats-number">98%</div>
                <div className="blog-stats-label">Satisfacción</div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Tools & Status - Only show when generator is visible */}
        {showGenerator && (
          <section className="section-sm bg-light">
            <div className="container">
              <div className="grid lg:grid-cols-3 gap-6">
                <SavedFiles />
                <SitemapStatus />
                <StyleUpdateStatus />
              </div>
            </div>
          </section>
        )}

        {/* Articles Display */}
        <section id="articles" className="section">
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
                      <EnhancedArticleCard key={article.id} article={article} />
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

        {/* Enhanced Newsletter Section */}
        <section className="blog-newsletter-section">
          <div className="container">
            <div className="blog-newsletter-content">
              <h2 className="blog-newsletter-title">📧 ¡Mantente Actualizado!</h2>
              <p className="blog-newsletter-subtitle">
                Únete a más de 5,000 desarrolladores que reciben nuestros mejores artículos, tips y recursos directamente en su email. Sin spam, solo contenido de calidad.
              </p>
              <form className="blog-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="blog-newsletter-input"
                  required
                />
                <button type="submit" className="blog-newsletter-btn">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Suscribirse Gratis
                </button>
              </form>
              <div className="text-center mt-4">
                <p className="text-sm opacity-80">
                  ✓ Contenido exclusivo &nbsp;&nbsp; ✓ Tips semanales &nbsp;&nbsp; ✓ Recursos gratuitos
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
