import React from 'react';
import { useParams } from 'react-router-dom';
import BaseLayout from '../../layouts/BaseLayout';
import { getArticleBySlug } from '../../utils/getArticles';

export default function Articulo() {
  const { slug } = useParams();
  const [article, setArticle] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      const data = await getArticleBySlug(slug);
      setArticle(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div className="container py-5 text-center">Cargando artículo...</div>;
  if (!article) return <div className="container py-5 text-center">Artículo no encontrado</div>;

  return (
    <BaseLayout
      title={article.seo_title || article.title}
      description={article.seo_description || article.summary}
      keywords={article.seo_keywords ? article.seo_keywords.join(', ') : (article.tags || []).join(', ')}
      ogTitle={article.seo_title || article.title}
      ogDescription={article.seo_description || article.summary}
      ogImage={article.image}
      ogUrl={`https://service.hgaruna.org/articulos/${slug}`}
    >
      <article className="articulo-container container py-5">
        <h1 className="articulo-title">{article.title}</h1>
        <div className="articulo-meta mb-3">
          <span className="me-3"><i className="fas fa-user"></i> {article.author || 'hgaruna'}</span>
          <span className="me-3"><i className="fas fa-calendar"></i> {new Date(article.date).toLocaleDateString('es-ES')}</span>
          {article.tags && article.tags.length > 0 && (
            <span><i className="fas fa-tags"></i> {article.tags.join(', ')}</span>
          )}
        </div>
        {article.image && (
          <img src={article.image} alt={article.title} className="img-fluid rounded mb-4" style={{maxHeight: 350}} />
        )}
        <div className="articulo-summary lead mb-4">{article.summary}</div>
        <div className="articulo-content" dangerouslySetInnerHTML={{ __html: article.html }} />
      </article>
    </BaseLayout>
  );
}import React from "react";
import { useParams } from "react-router-dom";
import { getArticleBySlug } from "../../utils/getArticles";
import BaseLayout from "../../layouts/BaseLayout";
import MarkdownRenderer from "../../components/MarkdownRenderer";

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
        console.error("Error cargando artículo:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <BaseLayout
        title="Cargando Artículo | Desarrollo Web Villa Carlos Paz | hgaruna"
        description="Cargando artículo sobre desarrollo web, diseño web y marketing digital en Villa Carlos Paz, Córdoba."
      >
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
      <BaseLayout
        title="Artículo no Encontrado | Desarrollo Web Villa Carlos Paz | hgaruna"
        description="El artículo que buscas no existe. Explora otros artículos sobre desarrollo web, diseño web y marketing digital en Villa Carlos Paz, Córdoba."
      >
        <div className="container mt-5">
          <div className="alert alert-warning">
            <h4>Artículo no encontrado</h4>
            <p>El artículo que buscas no existe o ha sido eliminado.</p>
            <a href="/articulos/" className="btn btn-primary">
              Ver todos los artículos
            </a>
          </div>
        </div>
      </BaseLayout>
    );
  }

  // Generar keywords específicos para el artículo
  const articleKeywords = [
    ...(article.tags || []),
    "desarrollo web villa carlos paz",
    "programador web villa carlos paz",
    "diseño web córdoba",
    "marketing digital villa carlos paz",
    "seo local villa carlos paz",
    "hgaruna",
  ].join(", ");

  return (
    <BaseLayout
      title={`${article.title} | Desarrollo Web Villa Carlos Paz | hgaruna`}
      description={
        article.description ||
        `Artículo sobre ${article.title} - Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten.`
      }
      keywords={articleKeywords}
      ogTitle={`${article.title} | Desarrollo Web Villa Carlos Paz | hgaruna`}
      ogDescription={
        article.description ||
        `Artículo sobre ${article.title} - Desarrollo web profesional en Villa Carlos Paz, Córdoba.`
      }
      ogImage={
        article.image ||
        "https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      }
      ogUrl={`https://service.hgaruna.org/articulos/${slug}`}
      twitterTitle={`${article.title} | Desarrollo Web Villa Carlos Paz | hgaruna`}
      twitterDescription={
        article.description ||
        `Artículo sobre ${article.title} - Desarrollo web profesional en Villa Carlos Paz, Córdoba.`
      }
      twitterImage={
        article.image ||
        "https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      }
    >
      <article className="container mt-5">
        <header className="article-header mb-4">
          <h1 className="display-4">{article.title}</h1>
          <div className="article-meta text-muted">
            <span>Por {article.author || "hgaruna"}</span>
            <span className="mx-2">•</span>
            <span>{new Date(article.date).toLocaleDateString("es-ES")}</span>
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
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          )}
        </header>

        <div className="article-content">
          <MarkdownRenderer content={article.content} />
        </div>

        {article.tags && article.tags.length > 0 && (
          <footer className="article-footer mt-5">
            <h5>Etiquetas:</h5>
            <div className="tags">
              {article.tags.map((tag) => (
                <span key={tag} className="badge bg-secondary me-2">
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* Schema.org para artículos */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.description,
              image:
                article.image ||
                "https://service.hgaruna.org/logos-he-imagenes/logo3.png",
              author: {
                "@type": "Organization",
                name: "hgaruna",
                url: "https://service.hgaruna.org/",
              },
              publisher: {
                "@type": "Organization",
                name: "hgaruna",
                logo: {
                  "@type": "ImageObject",
                  url: "https://service.hgaruna.org/logos-he-imagenes/logo3.png",
                },
              },
              datePublished: article.date,
              dateModified: article.date,
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://service.hgaruna.org/articulos/${slug}`,
              },
              keywords: articleKeywords,
            }),
          }}
        />
      </article>
    </BaseLayout>
  );
}
