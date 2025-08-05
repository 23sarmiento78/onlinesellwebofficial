import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { useArticles } from '@hooks/useArticles'
import { ARTICLE_CATEGORIES } from '@utils/articleGenerator'
import ArticleGenerator from '@components/ArticleGenerator'

export default function CategoryPage() {
  const { category } = useParams()
  const { articles, loading, getArticlesByCategory, addArticle } = useArticles()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('date')
  const [showGenerator, setShowGenerator] = useState(false)

  const categoryInfo = ARTICLE_CATEGORIES[category]
  const categoryArticles = getArticlesByCategory(category)

  // Filter articles by search term
  const filteredArticles = categoryArticles.filter(article => {
    if (!searchTerm.trim()) return true
    return article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
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
          {categoryInfo?.name}
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
            {categoryInfo?.name}
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

  if (!categoryInfo) {
    return (
      <div className="pt-20">
        <section className="section">
          <div className="container text-center">
            <h1 className="text-3xl font-bold mb-4">Categoría no encontrada</h1>
            <p className="text-muted mb-6">La categoría que buscas no existe.</p>
            <Link to="/blog" className="btn btn-primary">
              Volver al Blog
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{categoryInfo.name} | Blog hgaruna</title>
        <meta 
          name="description" 
          content={`${categoryInfo.description} - Artículos, tutoriales y noticias sobre ${categoryInfo.name.toLowerCase()}.`} 
        />
        <meta 
          name="keywords" 
          content={categoryInfo.keywords.join(', ')} 
        />
      </Helmet>

      <div className="pt-20">
        {/* Header */}
        <section className="section-sm section-secondary">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className={categoryInfo.icon}></i>
                {categoryInfo.name}
              </div>
              <h1 className="section-title">{categoryInfo.name}</h1>
              <p className="section-description">
                {categoryInfo.description}
              </p>
            </div>

            {/* Search and Controls */}
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

              {/* Navigation */}
              <div className="flex flex-wrap gap-2">
                <Link to="/blog" className="btn btn-sm btn-ghost">
                  <i className="fas fa-arrow-left mr-1"></i>
                  Todos los artículos
                </Link>
                {Object.entries(ARTICLE_CATEGORIES).map(([key, info]) => (
                  <Link
                    key={key}
                    to={`/blog/categoria/${key}`}
                    className={`btn btn-sm ${
                      key === category ? 'btn-primary' : 'btn-ghost'
                    }`}
                  >
                    <i className={`${info.icon} mr-1`}></i>
                    {info.name}
                  </Link>
                ))}
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {loading ? 'Cargando...' : `${sortedArticles.length} artículo${sortedArticles.length !== 1 ? 's' : ''} en ${categoryInfo.name}`}
                  {searchTerm && ` que coinciden con "${searchTerm}"`}
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
              <ArticleGenerator 
                onArticleGenerated={handleArticleGenerated}
                defaultCategory={category}
              />
            </div>
          </section>
        )}

        {/* Articles Display */}
        <section className="section">
          <div className="container">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted">Cargando artículos...</p>
              </div>
            ) : sortedArticles.length === 0 ? (
              <div className="text-center py-16">
                <i className={`${categoryInfo.icon} text-6xl text-muted mb-6`}></i>
                <h3 className="text-2xl font-bold mb-4">No hay artículos en {categoryInfo.name}</h3>
                <p className="text-muted mb-6">
                  {searchTerm
                    ? `No se encontraron artículos que coincidan con "${searchTerm}"`
                    : `Sé el primero en crear contenido sobre ${categoryInfo.name.toLowerCase()}`
                  }
                </p>
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn btn-outline mr-3"
                  >
                    Limpiar búsqueda
                  </button>
                ) : null}
                <button
                  onClick={() => setShowGenerator(true)}
                  className="btn btn-primary"
                >
                  <i className="fas fa-robot mr-2"></i>
                  Generar Artículo de {categoryInfo.name}
                </button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="blog-grid">
                    {sortedArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6">
                    {sortedArticles.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
