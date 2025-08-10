import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogLoader } from '@utils/blogLoader'
import BlogFilters from '@components/BlogFilters'
import ArticleGrid from '@components/ArticleGrid'
import LoadingSpinner from '@components/LoadingSpinner'
import ErrorMessage from '@components/ErrorMessage'
import CategoryHeader from '@components/CategoryHeader'

export default function BlogCategory() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date')
  const [viewMode, setViewMode] = useState(searchParams.get('view') || 'grid')

  // Validar categoría
  const validCategories = [
    'desarrollo', 'programación', 'inteligencia-artificial', 
    'frontend', 'backend', 'devops', 'seguridad', 'bases-de-datos'
  ]

  if (!validCategories.includes(category)) {
    return <Navigate to="/blog" replace />
  }

  // Cargar datos cuando cambia la categoría
  useEffect(() => {
    loadCategoryData()
  }, [category])

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (sortBy !== 'date') params.set('sort', sortBy)
    if (viewMode !== 'grid') params.set('view', viewMode)
    
    setSearchParams(params, { replace: true })
  }, [searchTerm, sortBy, viewMode, setSearchParams])

  // Filtrar y ordenar artículos
  useEffect(() => {
    filterAndSortArticles()
  }, [articles, searchTerm, sortBy])

  async function loadCategoryData() {
    try {
      setLoading(true)
      setError(null)

      const [articlesData, categoriesData] = await Promise.all([
        blogLoader.getArticlesByCategory(category),
        blogLoader.getCategoriesWithCount()
      ])

      setArticles(articlesData)
      setCategories(categoriesData)
      
      // Encontrar información de la categoría actual
      const currentCategory = categoriesData.find(cat => cat.id === category)
      setCategoryInfo(currentCategory)

    } catch (err) {
      console.error('Error loading category data:', err)
      setError('Error al cargar los artículos de la categoría')
    } finally {
      setLoading(false)
    }
  }

  function filterAndSortArticles() {
    let filtered = [...articles]

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

  function handleSortChange(sort) {
    setSortBy(sort)
  }

  function handleViewModeChange(mode) {
    setViewMode(mode)
  }

  function handleRefresh() {
    blogLoader.clearCache()
    loadCategoryData()
  }

  const pageTitle = categoryInfo 
    ? `${categoryInfo.name} - Blog`
    : `${category} - Blog`

  const pageDescription = categoryInfo
    ? `Artículos de ${categoryInfo.name} sobre desarrollo web, programación y tecnología`
    : `Artículos sobre ${category} en nuestro blog de desarrollo web`

  return (
    <div className="category-page">
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

      <CategoryHeader 
        category={categoryInfo}
        totalArticles={articles.length}
        onRefresh={handleRefresh}
      />

      <main className="category-main">
        <div className="container">
          <BlogFilters
            searchTerm={searchTerm}
            selectedCategory={category}
            sortBy={sortBy}
            viewMode={viewMode}
            categories={categories}
            totalResults={filteredArticles.length}
            onSearch={handleSearch}
            onCategoryChange={() => {}} // Deshabilitado en vista de categoría
            onSortChange={handleSortChange}
            onViewModeChange={handleViewModeChange}
            hideCategoryFilter={true}
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
                searchTerm
                  ? `No se encontraron artículos de ${categoryInfo?.name || category} que coincidan con "${searchTerm}"`
                  : `No hay artículos disponibles en la categoría ${categoryInfo?.name || category}`
              }
            />
          )}
        </div>
      </main>
    </div>
  )
}
