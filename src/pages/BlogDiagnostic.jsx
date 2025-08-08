import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

export default function BlogDiagnostic() {
  const [status, setStatus] = useState('Iniciando diagnóstico...')
  const [articles, setArticles] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function diagnose() {
      try {
        setStatus('Paso 1: Componente React cargado ✅')
        
        setStatus('Paso 2: Intentando cargar /blog/index.json...')
        const response = await fetch('/blog/index.json')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        setStatus('Paso 3: Respuesta HTTP OK ✅, parseando JSON...')
        const data = await response.json()
        
        setStatus('Paso 4: JSON parseado ✅')
        setArticles(Array.isArray(data) ? data.slice(0, 3) : [])
        
        setStatus('Paso 5: Todo funcionando correctamente ✅')
      } catch (err) {
        setError(err.message)
        setStatus(`❌ Error: ${err.message}`)
      }
    }
    
    diagnose()
  }, [])

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Helmet>
        <title>Blog - Diagnóstico</title>
      </Helmet>
      
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          🔍 Diagnóstico del Blog
        </h1>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem',
          fontFamily: 'monospace'
        }}>
          <strong>Estado:</strong> {status}
        </div>
        
        {error && (
          <div style={{ 
            background: '#ffebee', 
            color: '#c62828',
            padding: '1rem', 
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #ffcdd2'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {articles.length > 0 && (
          <div>
            <h2 style={{ color: '#333' }}>Primeros 3 artículos:</h2>
            {articles.map((article, index) => (
              <div key={article.slug || index} style={{ 
                background: '#e8f5e8',
                padding: '1rem',
                marginBottom: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #c8e6c8'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2e7d32' }}>
                  {article.title || 'Sin título'}
                </h3>
                <p style={{ margin: '0', color: '#555', fontSize: '0.9rem' }}>
                  <strong>Slug:</strong> {article.slug || 'N/A'} | 
                  <strong> Categoría:</strong> {article.category || 'N/A'} | 
                  <strong> Fecha:</strong> {article.date || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          background: '#fff3e0',
          borderRadius: '4px',
          border: '1px solid #ffcc02'
        }}>
          <strong>Información del navegador:</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
            <li>User Agent: {navigator.userAgent}</li>
            <li>URL actual: {window.location.href}</li>
            <li>Protocolo: {window.location.protocol}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
