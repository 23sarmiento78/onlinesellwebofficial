import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import ReactMarkdown from "react-markdown";
import { getArticleFromHTML } from "../utils/getArticlesFromHTML.js";
// import "../BlogIA.css"; // Removed to avoid module not found error

export default function BlogArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const article = await getArticleFromHTML(slug);
      if (article) {
        setArticle(article);
      } else {
        setError('Artículo no encontrado');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article?.title || 'Artículo de hgaruna';
    const text = article?.summary || 'Artículo sobre programación y desarrollo web';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <BaseLayout title="Cargando artículo..." description="Cargando artículo del public/blog IA">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando artículo...</p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (error || !article) {
    return (
      <BaseLayout title="Artículo no encontrado" description="El artículo solicitado no existe">
        <div className="container py-5">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h2>Artículo no encontrado</h2>
            <p className="text-muted mb-4">
              {error || 'El artículo que buscas no existe o ha sido eliminado.'}
            </p>
            <Link to="/blog" className="btn btn-primary">
              <i className="fas fa-arrow-left me-2"></i>
              Volver al public/blog
            </Link>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout 
      title={article.seo_title || article.title}
      description={article.seo_description || article.summary}
      keywords={article.seo_keywords?.join(', ') || article.tags?.join(', ')}
    >
      <div className="public/blog-article-container">
        {/* Breadcrumb */}
        <nav className="custom-breadcrumb">
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/blog">Blog IA</Link></li>
            <li className="active">{article.title}</li>
          </ul>
        </nav>

        {/* Article Header */}
        <article className="public/blog-article-custom">
          <header className="article-header-custom">
            <div className="article-header-inner">
              {/* Category and Date */}
              <div className="meta-row">
                {article.category && (
                  <span className="custom-badge custom-badge-primary">{article.category}</span>
                )}
                <span className="custom-date">
                  <i className="fas fa-calendar-alt"></i> {formatDate(article.date)}
                </span>
              </div>

              {/* Title */}
              <h1 className="article-title-custom">{article.title}</h1>

              {/* Summary */}
              {article.summary && (
                <p className="article-summary-custom">{article.summary}</p>
              )}

              {/* Featured Image */}
              {article.image && (
                <div className="article-image-custom">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="img-article-custom"
                    style={{ maxHeight: '400px', width: '100%', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 2px 16px #0002' }}
                  />
                </div>
              )}

              {/* Meta Information */}
              <div className="article-meta-custom">
                <div className="author-info-custom">
                  <span className="custom-author">
                    <i className="fas fa-user"></i> Por {article.author || 'hgaruna'}
                  </span>
                  <span className="custom-ai">
                    <i className="fas fa-robot"></i> Generado por IA
                  </span>
                </div>
                <div className="share-buttons-custom">
                  <span className="custom-share-label">Compartir:</span>
                  <button onClick={() => shareArticle('twitter')} className="custom-share-btn twitter" title="Compartir en Twitter">
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button onClick={() => shareArticle('linkedin')} className="custom-share-btn linkedin" title="Compartir en LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </button>
                  <button onClick={() => shareArticle('facebook')} className="custom-share-btn facebook" title="Compartir en Facebook">
                    <i className="fab fa-facebook"></i>
                  </button>
                  <button onClick={() => shareArticle('whatsapp')} className="custom-share-btn whatsapp" title="Compartir en WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags-custom">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="custom-badge custom-badge-tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div className="article-content-custom">
            <div className="content-wrapper-custom">
              <ReactMarkdown 
                className="markdown-content-custom"
                components={{
                  h1: ({node, ...props}) => <h1 className="custom-h1" {...props} />,
                  h2: ({node, ...props}) => <h2 className="custom-h2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="custom-h3" {...props} />,
                  h4: ({node, ...props}) => <h4 className="custom-h4" {...props} />,
                  p: ({node, ...props}) => <p className="custom-p" {...props} />,
                  ul: ({node, ...props}) => <ul className="custom-ul" {...props} />,
                  ol: ({node, ...props}) => <ol className="custom-ol" {...props} />,
                  li: ({node, ...props}) => <li className="custom-li" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="custom-blockquote" {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className="custom-code" {...props} />
                  ),
                  pre: ({node, ...props}) => (
                    <pre className="custom-pre" {...props} />
                  ),
                  a: ({node, ...props}) => (
                    <a className="custom-link" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </BaseLayout>
  );
} 