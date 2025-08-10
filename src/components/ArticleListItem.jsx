import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiTag, FiExternalLink } from 'react-icons/fi'

export default function ArticleListItem({ article }) {
  
  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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
    <article className="article-list-item">
      <div className="list-item-image">
        <img 
          src={article.image} 
          alt={article.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/logos-he-imagenes/programacion.jpeg'
          }}
        />
      </div>

      <div className="list-item-content">
        <div className="list-item-header">
          <span className={`category-badge category-${article.category}`}>
            {getCategoryDisplay(article.category)}
          </span>
          <div className="list-item-meta">
            <span className="meta-date">{formatDate(article.date)}</span>
            <span className="meta-separator">•</span>
            <span className="meta-read-time">
              <FiClock className="meta-icon" />
              {article.readTime}
            </span>
          </div>
        </div>

        <h2 className="list-item-title">
          <Link to={article.url} className="list-item-title-link">
            {article.title}
          </Link>
        </h2>

        <p className="list-item-excerpt">{article.excerpt}</p>

        <div className="list-item-footer">
          {article.tags.length > 0 && (
            <div className="list-item-tags">
              <FiTag className="tags-icon" />
              {article.tags.slice(0, 4).map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
              {article.tags.length > 4 && (
                <span className="tag-more">+{article.tags.length - 4}</span>
              )}
            </div>
          )}

          <Link to={article.url} className="list-read-more">
            Leer más
            <FiExternalLink className="button-icon" />
          </Link>
        </div>
      </div>
    </article>
  )
}
