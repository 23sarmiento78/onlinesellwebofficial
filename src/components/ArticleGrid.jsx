import React from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from './ArticleCard'
import ArticleListItem from './ArticleListItem'

export default function ArticleGrid({ articles, viewMode, loading, emptyMessage }) {
  
  if (loading) {
    return <div className="article-grid-loading">Cargando artículos...</div>
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-content">
          <h3>No hay artículos</h3>
          <p>{emptyMessage}</p>
        </div>
      </div>
    )
  }

  const gridClass = `article-grid ${viewMode}-view`

  return (
    <div className={gridClass}>
      {viewMode === 'grid' ? (
        <div className="articles-grid">
          {articles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
            />
          ))}
        </div>
      ) : (
        <div className="articles-list">
          {articles.map(article => (
            <ArticleListItem 
              key={article.id} 
              article={article} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
