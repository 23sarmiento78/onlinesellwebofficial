import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSimpleArticles } from '@hooks/useSimpleArticles'

// Función para extraer solo el contenido principal del HTML
const extractMainContent = (html) => {
  if (!html) return '';
  
  // Crear un elemento temporal para el parsing
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Intentar encontrar el contenido principal
  const content = temp.querySelector('article') || 
                 temp.querySelector('.article-content') || 
                 temp.querySelector('.post-content') ||
                 temp;
  
  // Limpiar elementos no deseados
  const elementsToRemove = content.querySelectorAll('script, style, iframe, noscript, .ad, .ads, .advertisement, .comments, .related-posts, .social-share, .share-buttons, .post-meta, .post-tags, .author-box, .post-navigation, .pagination, .wp-caption, .wp-block-embed, .wp-block-image');
  elementsToRemove.forEach(el => el.remove());
  
  // Corregir rutas de imágenes
  const images = content.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('//')) {
      img.src = `/blog/${src}`;
    }
  });
  
  return content.innerHTML;
};

export default function BlogArticle() {
  const { slug } = useParams();
  const location = useLocation();
  const { articles, loading, error } = useSimpleArticles();
  const [article, setArticle] = useState(null);
  const [htmlContent, setHtmlContent] = useState(null); // HTML real del archivo
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!loading && articles.length > 0) {
      const foundArticle = articles.find(a => a.slug === slug);
      setArticle(foundArticle || null);
      setHtmlContent(null);
      setFetchError(false);
      if (foundArticle && foundArticle.file) {
        // Intentar cargar el HTML completo
        fetch(`/blog/${foundArticle.file}`)
          .then(res => {
            if (!res.ok) throw new Error('No se pudo cargar el HTML');
            return res.text();
          })
          .then(html => {
            setHtmlContent(html);
          })
          .catch(() => {
            setFetchError(true);
          });
      }
    }
  }, [loading, articles, slug]);

  // Calcular artículos relacionados cuando cambie el artículo
  const relatedArticles = useMemo(() => {
    if (!article || !article.category) return [];
    return articles.filter(a => a.category === article.category && a.slug !== slug).slice(0, 3);
  }, [article, articles, slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Función para renderizar el contenido HTML de forma segura
  const renderArticleContent = (htmlContent) => {
    if (!htmlContent) return { __html: '<p style="color: #333;">No hay contenido disponible para mostrar.</p>' };

    const content = typeof htmlContent === 'string' ? htmlContent : '';
    const cleanedContent = extractMainContent(content);

    return { __html: cleanedContent };
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Cargando artículo...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }
  if (!article) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <i className="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-6"></i>
          <h1 className="text-3xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-6">
            Lo sentimos, el artículo que buscas no está disponible en este momento. 
            Puede que la URL sea incorrecta o el artículo haya sido movido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog" className="btn btn-primary">
              <i className="fas fa-arrow-left mr-2"></i>
              Volver al Blog
            </Link>
            <Link to="/" className="btn btn-outline">
              <i className="fas fa-home mr-2"></i>
              Ir al Inicio
            </Link>
          </div>
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
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {htmlContent ? (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={renderArticleContent(htmlContent)}
                  />
                ) : article && article.excerpt && (article.file || fetchError) ? (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          No se pudo cargar el contenido completo del artículo. Estamos mostrando una vista previa.
                        </p>
                        <div className="mt-2 text-sm text-yellow-600">
                          <p>{article.excerpt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          No hay contenido disponible para mostrar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
