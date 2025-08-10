import React from 'react'
import { Link } from 'react-router-dom'
import { FiClock, FiArrowRight } from 'react-icons/fi'

export default function RelatedArticles({ articles }) {
  
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

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="related-articles">
      <div className="related-header">
        <h2>Artículos relacionados</h2>
        <p>Continúa leyendo sobre temas similares</p>
      </div>
      
      <div className="related-grid">
        {articles.map(article => (
          <article key={article.id} className="related-card">
            <div className="related-image">
              <img 
                src={article.image} 
                alt={article.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/logos-he-imagenes/programacion.jpeg'
                }}
              />
              <div className="related-category">
                <span className={`category-badge category-${article.category}`}>
                  {getCategoryDisplay(article.category)}
                </span>
              </div>
            </div>
            
            <div className="related-content">
              <h3 className="related-title">
                <Link to={article.url} className="related-title-link">
                  {article.title}
                </Link>
              </h3>
              
              <p className="related-excerpt">{article.excerpt}</p>
              
              <div className="related-meta">
                <span className="related-date">{formatDate(article.date)}</span>
                <span className="meta-separator">•</span>
                <span className="related-read-time">
                  <FiClock className="meta-icon" />
                  {article.readTime}
                </span>
              </div>
              
              <Link to={article.url} className="related-link">
                Leer artículo
                <FiArrowRight className="link-icon" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      
      <div className="related-footer">
        <Link to="/blog" className="view-all-button">
          Ver todos los artículos
          <FiArrowRight className="button-icon" />
        </Link>
      </div>
    </section>
  )
}
