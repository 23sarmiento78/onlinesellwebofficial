import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiRefreshCw, FiFolder } from 'react-icons/fi'

export default function CategoryHeader({ category, totalArticles, onRefresh }) {
  
  function getCategoryDescription(categoryId) {
    const descriptions = {
      'desarrollo': 'Artículos sobre desarrollo de software, mejores prácticas y metodologías',
      'programación': 'Tutoriales y guías sobre lenguajes de programación y algoritmos',
      'inteligencia-artificial': 'Todo sobre IA, machine learning y tecnologías emergentes',
      'frontend': 'Desarrollo frontend, frameworks, UX/UI y tecnologías web',
      'backend': 'Arquitectura backend, APIs, bases de datos y servicios',
      'devops': 'DevOps, CI/CD, contenedores y automatización',
      'seguridad': 'Seguridad informática, buenas prácticas y prevención',
      'bases-de-datos': 'Gestión de datos, SQL, NoSQL y optimización'
    }
    return descriptions[categoryId] || 'Artículos especializados sobre tecnología'
  }

  function getCategoryIcon(categoryId) {
    const icons = {
      'desarrollo': '💻',
      'programación': '⚡',
      'inteligencia-artificial': '🤖',
      'frontend': '🎨',
      'backend': '⚙️',
      'devops': '🚀',
      'seguridad': '🔒',
      'bases-de-datos': '📊'
    }
    return icons[categoryId] || '📝'
  }

  const categoryName = category?.name || 'Categoría'
  const categoryId = category?.id || ''
  const icon = getCategoryIcon(categoryId)
  const description = getCategoryDescription(categoryId)

  return (
    <header className="category-header">
      <div className="container">
        <div className="category-breadcrumb">
          <Link to="/blog" className="breadcrumb-link">
            <FiArrowLeft />
            Blog
          </Link>
          <span className="breadcrumb-separator">•</span>
          <span className="breadcrumb-current">{categoryName}</span>
        </div>

        <div className="category-header-content">
          <div className="category-info">
            <div className="category-title-wrapper">
              <span className="category-icon">{icon}</span>
              <h1 className="category-title">
                <FiFolder className="title-icon" />
                {categoryName}
              </h1>
            </div>
            
            <p className="category-description">{description}</p>
            
            {totalArticles > 0 && (
              <div className="category-stats">
                <span className="article-count">
                  {totalArticles} {totalArticles === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>
            )}
          </div>
          
          <div className="category-actions">
            <button 
              className="refresh-button"
              onClick={onRefresh}
              aria-label="Actualizar artículos"
            >
              <FiRefreshCw />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
