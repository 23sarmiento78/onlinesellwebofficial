import React from 'react'
import { FiRefreshCw, FiBookOpen } from 'react-icons/fi'

export default function BlogHeader({ title, subtitle, totalArticles, onRefresh }) {
  return (
    <header className="blog-header">
      <div className="container">
        <div className="blog-header-content">
          <div className="blog-header-text">
            <h1 className="blog-title">
              <FiBookOpen className="blog-title-icon" />
              {title}
            </h1>
            {subtitle && <p className="blog-subtitle">{subtitle}</p>}
            {totalArticles > 0 && (
              <div className="blog-stats">
                <span className="article-count">{totalArticles} artículos disponibles</span>
              </div>
            )}
          </div>
          
          <div className="blog-header-actions">
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
