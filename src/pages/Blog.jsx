import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { blogLoader } from '@utils/blogLoader'
import BlogHeader from '@components/BlogHeader'
import BlogFilters from '@components/BlogFilters'
import ArticleGrid from '@components/ArticleGrid'
import LoadingSpinner from '@components/LoadingSpinner'
import ErrorMessage from '@components/ErrorMessage'

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date')
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid')

  // Cargar datos iniciales
  useEffect(() => {
    loadBlogData()
  }, [])

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (sortBy !== 'date') params.set('sort', sortBy)
    if (viewMode !== 'grid') params.set('view', viewMode)
    
    setSearchParams(params, { replace: true })
  }, [searchTerm, selectedCategory, sortBy, viewMode, setSearchParams])

  // Filtrar y ordenar artículos
  useEffect(() => {
    filterAndSortArticles()
  }, [articles, searchTerm, selectedCategory, sortBy])

  async function loadBlogData() {
    try {
      setLoading(true)
      setError(null)

      const [articlesData, categoriesData] = await Promise.all([
        blogLoader.loadArticles(),
        blogLoader.getCategoriesWithCount()
      ])

      setArticles(articlesData)
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error loading blog data:', err)
      setError('Error al cargar los artículos del blog')
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortArticles() {
    let filtered = [...articles]

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term) ||
        article.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    // Ordenar artículos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date)
      }
    })

    setFilteredArticles(filtered)
  }

  function handleSearch(term) {
    setSearchTerm(term)
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category)
  }

  function handleSortChange(sort) {
    setSortBy(sort)
  }

  function handleViewModeChange(mode) {
    setViewMode(mode)
  }

  function handleRefresh() {
    blogLoader.clearCache()
    loadBlogData()
  }

  const pageTitle = searchTerm 
    ? `Resultados para "${searchTerm}" - Blog`
    : selectedCategory !== 'all' 
      ? `${categories.find(cat => cat.id === selectedCategory)?.name || 'Categoría'} - Blog`
      : 'Blog de Desarrollo Web'

  const pageDescription = searchTerm
    ? `Artículos relacionados con "${searchTerm}" en nuestro blog de desarrollo web`
    : selectedCategory !== 'all'
      ? `Artículos de ${categories.find(cat => cat.id === selectedCategory)?.name} sobre desarrollo web, programación y tecnología`
      : 'Artículos sobre desarrollo web, programación, frameworks modernos y las últimas tendencias en tecnología'

  return (
    <div className="blog-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
      </Helmet>

      <BlogHeader 
        title="Blog de Desarrollo Web"
        subtitle="Artículos sobre programación, frameworks modernos y las últimas tendencias tecnológicas"
        totalArticles={articles.length}
        onRefresh={handleRefresh}
      />

      <main className="blog-main">
        <div className="container">
          <BlogFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            viewMode={viewMode}
            categories={categories}
            totalResults={filteredArticles.length}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onViewModeChange={handleViewModeChange}
          />

          {loading && <LoadingSpinner message="Cargando artículos..." />}
          
          {error && (
            <ErrorMessage 
              message={error}
              onRetry={handleRefresh}
            />
          )}

          {!loading && !error && (
            <ArticleGrid
              articles={filteredArticles}
              viewMode={viewMode}
              loading={loading}
              emptyMessage={
                searchTerm || selectedCategory !== 'all'
                  ? 'No se encontraron artículos con los filtros seleccionados'
                  : 'No hay artículos disponibles'
              }
            />
          )}
        </div>
      </main>
    </div>
  )
}
