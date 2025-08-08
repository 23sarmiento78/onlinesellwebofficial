import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

export default function BlogSimple() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadArticles()
  }, [])

  async function loadArticles() {
    try {
      setLoading(true)
      const response = await fetch('/blog/index.json')
      if (!response.ok) {
        throw new Error('Error loading articles')
      }
      const data = await response.json()
      setArticles(data.slice(0, 10)) // Solo primeros 10 para testing
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Cargando artículos...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Error: {error}</h2>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Helmet>
        <title>Blog Simple - Test</title>
      </Helmet>
      
      <h1>Blog - Test Simple</h1>
      <p>Total artículos: {articles.length}</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {articles.map(article => (
          <div key={article.slug} style={{ 
            border: '1px solid #ddd', 
            padding: '1rem', 
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <h3>{article.title || 'Sin título'}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              {article.category} • {article.date}
            </p>
            <p>{article.excerpt?.substring(0, 150)}...</p>
          </div>
        ))}
      </div>
    </div>
  )
}
