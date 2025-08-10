import React from 'react'
import { FiClock, FiTag, FiUser, FiCalendar } from 'react-icons/fi'

export default function ArticleHeader({ article }) {
  
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function getCategoryDisplay(category) {
    const categoryMap = {
      'desarrollo': 'Desarrollo',
      'programación': 'Programación',
      'inteligencia-artificial': 'IA',
      'frontend': 'Frontend',
      'backend': 'Backend',
      'devops': 'DevOps',
      'seguridad': 'Seguridad',
      'bases-de-datos': 'Bases de Datos'
    }
    return categoryMap[category] || category
  }

  return (
    <header className="article-header">
      <div className="article-hero">
        <img 
          src={article.image} 
          alt={article.title}
          className="article-hero-image"
          onError={(e) => {
            e.target.src = '/logos-he-imagenes/programacion.jpeg'
          }}
        />
        <div className="article-hero-overlay">
          <div className="container">
            <div className="article-header-content">
              <div className="article-category">
                <span className={`category-badge category-${article.category}`}>
                  {getCategoryDisplay(article.category)}
                </span>
              </div>
              
              <h1 className="article-title">{article.title}</h1>
              
              <p className="article-excerpt">{article.excerpt}</p>
              
              <div className="article-meta">
                <div className="meta-item">
                  <FiUser className="meta-icon" />
                  <span>{article.author}</span>
                </div>
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="meta-item">
                  <FiClock className="meta-icon" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {article.tags.length > 0 && (
                <div className="article-tags">
                  <FiTag className="tags-icon" />
                  <div className="tags-list">
                    {article.tags.map(tag => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
