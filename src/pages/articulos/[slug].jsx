
import React from "react";
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

  // Inyectar estilos y links en el <head> cuando se carga el artículo
  React.useEffect(() => {
    if (!article) return;
    // Insertar <style> y <link rel="stylesheet"> en el <head>
    const head = document.head;
    const styleElements = [];
    const linkElements = [];
    if (article.styles && Array.isArray(article.styles)) {
      article.styles.forEach((styleHtml) => {
        const temp = document.createElement('div');
        temp.innerHTML = styleHtml;
        const styleTag = temp.firstChild;
        if (styleTag) {
          head.appendChild(styleTag);
          styleElements.push(styleTag);
        }
      });
    }
    if (article.links && Array.isArray(article.links)) {
      article.links.forEach((linkHtml) => {
        const temp = document.createElement('div');
        temp.innerHTML = linkHtml;
        const linkTag = temp.firstChild;
        if (linkTag) {
          head.appendChild(linkTag);
          linkElements.push(linkTag);
        }
      });
    }
    // Limpiar al desmontar
    return () => {
      styleElements.forEach((el) => head.removeChild(el));
      linkElements.forEach((el) => head.removeChild(el));
    };
  }, [article]);

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
      <div className="article-bg-gradient py-5">
        <div className="container">
          <div className="article-main-card mx-auto">
            <header className="article-header mb-4 improved-article-header">
              {/* Imagen de portada solo si existe */}
              {article.image && (
                <div className="article-cover-container text-center mb-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="img-fluid rounded shadow article-cover-img"
                    style={{ maxHeight: "340px", objectFit: "cover", width: "100%", border: "4px solid #fff" }}
                  />
                </div>
              )}
              <h1 className="display-5 fw-bold mb-3 text-center article-title-main">{article.title}</h1>
              <div className="article-meta text-center text-muted mb-2">
                <span><i className="fas fa-user me-1"></i> {article.author || "hgaruna"}</span>
                <span className="mx-2">•</span>
                <span><i className="fas fa-calendar-alt me-1"></i> {new Date(article.date).toLocaleDateString("es-ES")}</span>
                {article.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="badge bg-primary">{article.category}</span>
                  </>
                )}
              </div>
            </header>

            <div className="article-content improved-article-content">
              {/* Renderizar el HTML real del artículo */}
              {article.content ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                <div className="alert alert-warning">No se pudo cargar el contenido del artículo.</div>
              )}
            </div>

            {article.tags && article.tags.length > 0 && (
              <footer className="article-footer mt-5 improved-article-footer">
                <h5 className="mb-3 text-secondary fw-bold">Etiquetas:</h5>
                <div className="tags">
                  {article.tags.map((tag) => (
                    <span key={tag} className="badge bg-gradient-tag me-2 mb-2">
                      #{tag}
                    </span>
                  ))}
                </div>
              </footer>
            )}

            <div className="text-center mt-4">
              <a href="/articulos/" className="btn btn-lg btn-gradient-back">
                <i className="fas fa-arrow-left me-2"></i> Volver al blog
              </a>
            </div>

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
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
