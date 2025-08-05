import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useArticles } from '@hooks/useArticles'
import { ARTICLE_CATEGORIES } from '@utils/articleGenerator'

export default function BlogArticle() {
  const { slug } = useParams()
  const { getArticleBySlug, getArticlesByCategory } = useArticles()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = () => {
      try {
        const foundArticle = getArticleBySlug(slug)

        if (foundArticle) {
          setArticle(foundArticle)

          // Get related articles from the same category
          const categoryArticles = getArticlesByCategory(foundArticle.category)
            .filter(a => a.slug !== slug)
            .slice(0, 3)

          setRelatedArticles(categoryArticles)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading article:', error)
        setLoading(false)
      }
    }

    loadArticle()
  }, [slug, getArticleBySlug, getArticlesByCategory])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-6xl text-warning mb-6"></i>
          <h1 className="text-3xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-muted mb-6">El artículo que buscas no existe o ha sido movido.</p>
          <Link to="/blog" className="btn btn-primary">
            <i className="fas fa-arrow-left mr-2"></i>
            Volver al Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Blog hgaruna</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.tags?.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        
        {/* Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.image,
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "hgaruna",
              "logo": {
                "@type": "ImageObject",
                "url": "https://hgaruna.org/logos-he-imagenes/logo3.png"
              }
            },
            "datePublished": article.date,
            "dateModified": article.date
          })}
        </script>
      </Helmet>

      <article className="pt-20">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs py-4 bg-secondary">
          <div className="container">
            <div className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link">Inicio</Link>
            </div>
            <div className="breadcrumb-item">
              <Link to="/blog" className="breadcrumb-link">Blog</Link>
            </div>
            <div className="breadcrumb-item">
              <span className="breadcrumb-current">{article.title}</span>
            </div>
          </div>
        </nav>

        {/* Article Header */}
        <header className="section-sm">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {article.category}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                  {article.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-6 text-muted">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user"></i>
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar"></i>
                    <span>{formatDate(article.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-clock"></i>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden mb-8">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <section className="section-sm">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-light">
                  <h3 className="text-lg font-semibold mb-4">Etiquetas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-secondary text-primary px-3 py-1 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-light">
                <h3 className="text-lg font-semibold mb-4">Compartir artículo:</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <i className="fab fa-twitter mr-2"></i>
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <i className="fab fa-facebook-f mr-2"></i>
                    Facebook
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <i className="fab fa-linkedin-in mr-2"></i>
                    LinkedIn
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${window.location.href}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <i className="fab fa-whatsapp mr-2"></i>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="section section-secondary">
            <div className="container">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-center">Artículos Relacionados</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedArticles.map((related) => (
                    <div key={related.id} className="blog-card">
                      <div className="blog-card-image">
                        <img src={related.image} alt={related.title} />
                        <div className="blog-card-badge">{related.category}</div>
                      </div>
                      <div className="blog-card-content">
                        <h3 className="blog-card-title">
                          <Link to={`/blog/${related.slug}`}>
                            {related.title}
                          </Link>
                        </h3>
                        <div className="blog-card-footer">
                          <Link
                            to={`/blog/${related.slug}`}
                            className="btn btn-outline btn-sm"
                          >
                            Leer artículo
                            <i className="fas fa-arrow-right ml-2"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="section-title">¿Te Gustó Este Artículo?</h2>
              <p className="section-subtitle">
                Si necesitas ayuda con tu proyecto web, estamos aquí para ayudarte.
              </p>
              <div className="cta-buttons">
                <a
                  href="https://wa.me/+543541237972?text=Hola%2C%20leí%20su%20artículo%20y%20me%20interesa%20sus%20servicios"
                  className="cta-button primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i>
                  Consultar Servicios
                </a>
                <Link to="/blog" className="cta-button secondary">
                  <i className="fas fa-arrow-left"></i>
                  Volver al Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
