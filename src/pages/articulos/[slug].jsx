import React from 'react';
import { useParams } from 'react-router-dom';
import { getArticleBySlug } from '../../utils/getArticles';
import BaseLayout from '../../layouts/BaseLayout';

export default function Articulo() {
  const { slug } = useParams();
  const [article, setArticle] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadArticle() {
      try {
        const articleData = await getArticleBySlug(slug);
        setArticle(articleData);
      } catch (error) {
        console.error('Error cargando artículo:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (!article) {
    return (
      <BaseLayout>
        <div className="container mt-5">
          <div className="alert alert-warning">
            <h4>Artículo no encontrado</h4>
            <p>El artículo que buscas no existe o ha sido eliminado.</p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      title={article.title}
      description={article.description}
      keywords={article.tags?.join(', ')}
      ogTitle={article.title}
      ogDescription={article.description}
      ogImage={article.image}
      ogUrl={`https://service.hgaruna.org/articulos/${slug}`}
    >
      <article className="container mt-5">
        <header className="article-header mb-4">
          <h1 className="display-4">{article.title}</h1>
          <div className="article-meta text-muted">
            <span>Por {article.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.date).toLocaleDateString('es-ES')}</span>
            {article.category && (
              <>
                <span className="mx-2">•</span>
                <span className="badge bg-primary">{article.category}</span>
              </>
            )}
          </div>
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title}
              className="img-fluid rounded mt-3"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          )}
        </header>

        <div className="article-content">
          {/* Aquí iría el contenido del artículo */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <footer className="article-footer mt-5">
            <h5>Etiquetas:</h5>
            <div className="tags">
              {article.tags.map(tag => (
                <span key={tag} className="badge bg-secondary me-2">
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </BaseLayout>
  );
} 