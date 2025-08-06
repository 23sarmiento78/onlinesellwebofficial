import { useState, useEffect } from 'react'

// Hook simple para cargar artículos desde /blog/index.json
export function useSimpleArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    fetch('/blog/index.json')
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar index.json')
        return res.json()
      })
      .then(data => {
        if (isMounted) {
          setArticles(Array.isArray(data) ? data : data.articles || [])
          setLoading(false)
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { isMounted = false }
  }, [])

  return { articles, loading, error }
}

// Hook para obtener un artículo por slug
export function useSimpleArticle(slug) {
  const { articles, loading, error } = useSimpleArticles()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    if (!loading && articles.length > 0) {
      setArticle(articles.find(a => a.slug === slug) || null)
    }
  }, [loading, articles, slug])

  return { article, loading, error }
}
