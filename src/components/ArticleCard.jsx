import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiTag, FiExternalLink } from 'react-icons/fi'

export default function ArticleCard({ article }) {
  
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
    <article className="article-card">
      <div className="card-image">
        <img 
          src={article.image} 
          alt={article.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/logos-he-imagenes/programacion.jpeg'
          }}
        />
        <div className="card-category">
          <span className={`category-badge category-${article.category}`}>
            {getCategoryDisplay(article.category)}
          </span>
        </div>
      </div>

      <div className="card-content">
        <header className="card-header">
          <h2 className="card-title">
            <Link to={article.url} className="card-title-link">
              {article.title}
            </Link>
          </h2>
        </header>

        <div className="card-excerpt">
          <p>{article.excerpt}</p>
        </div>

        <div className="card-meta">
          <div className="meta-info">
            <span className="meta-date">{formatDate(article.date)}</span>
            <span className="meta-separator">•</span>
            <span className="meta-read-time">
              <FiClock className="meta-icon" />
              {article.readTime}
            </span>
          </div>

          {article.tags.length > 0 && (
            <div className="card-tags">
              <FiTag className="tags-icon" />
              {article.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="tag-more">+{article.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        <footer className="card-footer">
          <Link to={article.url} className="read-more-button">
            Leer artículo
            <FiExternalLink className="button-icon" />
          </Link>
        </footer>
      </div>
    </article>
  )
}
