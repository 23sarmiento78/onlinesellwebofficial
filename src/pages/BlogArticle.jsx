import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import ReactMarkdown from "react-markdown";
import "../BlogIA.css";
import { getArticleFromHTML } from "../utils/getArticlesFromHTML";

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
      <BaseLayout title="Cargando artículo..." description="Cargando artículo del blog IA">
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
              Volver al blog
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
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/blog">Blog IA</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="blog-article">
          <header className="article-header mb-5">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                {/* Category and Date */}
                <div className="mb-3">
                  {article.category && (
                    <span className="badge bg-primary me-2">{article.category}</span>
                  )}
                  <small className="text-muted">
                    <i className="fas fa-calendar-alt me-1"></i>
                    {formatDate(article.date)}
                  </small>
                </div>

                {/* Title */}
                <h1 className="display-4 fw-bold mb-3">{article.title}</h1>

                {/* Summary */}
                {article.summary && (
                  <p className="lead text-muted mb-4">{article.summary}</p>
                )}

                {/* Featured Image */}
                {article.image && (
                  <div className="article-image mb-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Meta Information */}
                <div className="article-meta d-flex justify-content-between align-items-center mb-4">
                  <div className="author-info">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>
                      Por {article.author || 'hgaruna'}
                    </small>
                    <br />
                    <small className="text-muted">
                      <i className="fas fa-robot me-1"></i>
                      Generado por inteligencia artificial
                    </small>
                  </div>

                  {/* Share Buttons */}
                  <div className="share-buttons">
                    <small className="text-muted me-2">Compartir:</small>
                    <button
                      onClick={() => shareArticle('twitter')}
                      className="btn btn-sm btn-outline-primary me-1"
                      title="Compartir en Twitter"
                    >
                      <i className="fab fa-twitter"></i>
                    </button>
                    <button
                      onClick={() => shareArticle('linkedin')}
                      className="btn btn-sm btn-outline-primary me-1"
                      title="Compartir en LinkedIn"
                    >
                      <i className="fab fa-linkedin"></i>
                    </button>
                    <button
                      onClick={() => shareArticle('facebook')}
                      className="btn btn-sm btn-outline-primary me-1"
                      title="Compartir en Facebook"
                    >
                      <i className="fab fa-facebook"></i>
                    </button>
                    <button
                      onClick={() => shareArticle('whatsapp')}
                      className="btn btn-sm btn-outline-success"
                      title="Compartir en WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="article-tags mb-4">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="badge bg-light text-dark me-2">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="article-content">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="content-wrapper">
                  <ReactMarkdown 
                    className="markdown-content"
                    components={{
                      h1: ({node, ...props}) => <h1 className="h2 mb-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="h3 mb-3 mt-5" {...props} />,
                      h3: ({node, ...props}) => <h3 className="h4 mb-3 mt-4" {...props} />,
                      h4: ({node, ...props}) => <h4 className="h5 mb-2 mt-3" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3" {...props} />,
                      ul: ({node, ...props}) => <ul className="mb-3" {...props} />,
                      ol: ({node, ...props}) => <ol className="mb-3" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className="blockquote border-start border-primary ps-3 my-4" {...props} />
                      ),
                      code: ({node, ...props}) => (
                        <code className="bg-light px-2 py-1 rounded" {...props} />
                      ),
                      pre: ({node, ...props}) => (
                        <pre className="bg-dark text-light p-3 rounded mb-3" {...props} />
                      ),
                      a: ({node, ...props}) => (
                        <a className="text-primary" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </BaseLayout>
  );
} 