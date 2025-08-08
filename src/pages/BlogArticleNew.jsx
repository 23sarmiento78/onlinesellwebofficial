import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogLoader } from '@utils/blogLoader'
import LoadingSpinner from '@components/LoadingSpinner'
import ErrorMessage from '@components/ErrorMessage'
import ArticleContent from '@components/ArticleContent'
import ArticleHeader from '@components/ArticleHeader'
import ArticleNavigation from '@components/ArticleNavigation'
import RelatedArticles from '@components/RelatedArticles'
import { FiArrowLeft, FiShare2, FiBookmark } from 'react-icons/fi'

export default function BlogArticleNew() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [articleContent, setArticleContent] = useState('')
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      loadArticle()
    }
  }, [slug])

  async function loadArticle() {
    try {
      setLoading(true)
      setError(null)

      // Cargar datos del artículo
      const articleData = await blogLoader.getArticleBySlug(slug)
      
      if (!articleData) {
        setError('Artículo no encontrado')
        return
      }

      setArticle(articleData)

      // Cargar contenido HTML del artículo
      const contentResponse = await fetch(articleData.htmlUrl)
      if (contentResponse.ok) {
        const htmlContent = await contentResponse.text()
        // Limpiar el contenido HTML
        const cleanedContent = blogLoader.cleanHTMLContent(htmlContent)
        setArticleContent(cleanedContent)
      } else {
        setArticleContent('<p>Contenido no disponible</p>')
      }

      // Cargar artículos relacionados
      const related = await blogLoader.getArticlesByCategory(articleData.category)
      setRelatedArticles(
        related
          .filter(a => a.slug !== slug)
          .slice(0, 4)
      )

    } catch (err) {
      console.error('Error loading article:', err)
      setError('Error al cargar el artículo')
    } finally {
      setLoading(false)
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      })
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('URL copiada al portapapeles'))
        .catch(() => console.error('Error al copiar URL'))
    }
  }

  function handleBookmark() {
    // Implementar lógica de marcadores si es necesario
    console.log('Marcando artículo:', article.slug)
  }

  function goBack() {
    navigate('/blog', { replace: false })
  }

  if (loading) {
    return (
      <div className="article-page">
        <div className="container">
          <LoadingSpinner message="Cargando artículo..." size="large" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="article-page">
        <div className="container">
          <ErrorMessage 
            message={error}
            onRetry={loadArticle}
          />
          <div className="article-error-actions">
            <Link to="/blog" className="back-to-blog">
              <FiArrowLeft />
              Volver al blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return null
  }

  const pageTitle = `${article.title} | Blog`
  const canonicalUrl = `${window.location.origin}/blog/${article.slug}`

  return (
    <div className="article-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={article.excerpt} />
        <meta name="author" content={article.author} />
        <meta name="keywords" content={article.tags.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={article.author} />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:section" content={article.category} />
        {article.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <meta name="twitter:image" content={article.image} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.image,
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "HGaruna Dev",
              "logo": {
                "@type": "ImageObject",
                "url": "/logos-he-imagenes/programacion.jpeg"
              }
            },
            "datePublished": article.date,
            "dateModified": article.date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            }
          })}
        </script>
      </Helmet>

      <div className="article-container">
        {/* Barra de navegación superior */}
        <div className="article-top-nav">
          <div className="container">
            <button onClick={goBack} className="back-button">
              <FiArrowLeft />
              Volver al blog
            </button>
            
            <div className="article-actions">
              <button onClick={handleShare} className="action-button" title="Compartir">
                <FiShare2 />
              </button>
              <button onClick={handleBookmark} className="action-button" title="Guardar">
                <FiBookmark />
              </button>
            </div>
          </div>
        </div>

        {/* Cabecera del artículo */}
        <ArticleHeader article={article} />

        {/* Contenido principal */}
        <main className="article-main">
          <div className="container">
            <div className="article-layout">
              <div className="article-content-wrapper">
                <ArticleContent content={articleContent} />
              </div>
              
              <aside className="article-sidebar">
                <ArticleNavigation />
              </aside>
            </div>
          </div>
        </main>

        {/* Artículos relacionados */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section">
            <div className="container">
              <RelatedArticles articles={relatedArticles} />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
