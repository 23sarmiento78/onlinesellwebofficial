import React from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';
import { getAllArticles } from '../utils/getArticles';

export default function Articulos() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadArticles() {
      try {
        const articlesData = await getAllArticles();
        setArticles(articlesData);
      } catch (error) {
        console.error('Error cargando artículos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <BaseLayout
      title="Blog Desarrollo Web Villa Carlos Paz | Artículos sobre Programación Web | hgaruna"
      description="Blog sobre desarrollo web, diseño web y marketing digital en Villa Carlos Paz, Córdoba. Artículos sobre programación, SEO, e-commerce y tendencias web. Programador web profesional."
      keywords="blog desarrollo web villa carlos paz, artículos programación web, blog diseño web córdoba, marketing digital villa carlos paz, seo local villa carlos paz, programador web villa carlos paz, tendencias web 2024, e-commerce villa carlos paz"
      ogTitle="Blog Desarrollo Web Villa Carlos Paz | Artículos sobre Programación Web | hgaruna"
      ogDescription="Blog sobre desarrollo web, diseño web y marketing digital en Villa Carlos Paz, Córdoba. Artículos sobre programación, SEO y e-commerce."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/articulos/"
    >
      {/* Hero Section */}
      <Hero
        title="Blog de Desarrollo Web Villa Carlos Paz | Artículos sobre Programación Web"
        subtitle="Mantente actualizado con las últimas tendencias en desarrollo web, diseño web y marketing digital. Artículos escritos por programadores web profesionales en Villa Carlos Paz, Córdoba."
        backgroundImage="/logos-he-imagenes/fondo-hero.jpg"
        ctas={[
          {
            href: '/planes/',
            className: 'cta-button primary',
            icon: 'fas fa-rocket',
            text: '¡Quiero mi Sitio Web YA!'
          },
          {
            href: 'https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz',
            className: 'cta-button secondary',
            icon: 'fab fa-whatsapp',
            text: 'Consulta Gratuita',
            target: '_blank'
          }
        ]}
        stats={[
          { number: '20+', label: 'Sitios Web Creados' },
          { number: '100%', label: 'Clientes Satisfechos' },
          { number: '24h', label: 'Tiempo de Respuesta' }
        ]}
      />

      {/* Artículos Section */}
      <section className="articulos-section py-5">
        <div className="container">
          <div className="blog-header text-center mb-5">
            <h2 className="blog-title-main">Artículos sobre Desarrollo Web Villa Carlos Paz</h2>
            <p className="blog-description">Conoce las últimas tendencias en desarrollo web, diseño web y marketing digital</p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando artículos...</span>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center">
              <div className="alert alert-info">
                <h4>No hay artículos disponibles</h4>
                <p>Pronto publicaremos contenido sobre desarrollo web, diseño web y marketing digital.</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {articles.map((article, index) => (
                <div key={article._id || index} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    {article.image && (
                      <img 
                        src={article.image} 
                        className="card-img-top" 
                        alt={article.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{article.title}</h5>
                      <p className="card-text text-muted">
                        {article.description || (article.content ? article.content.substring(0, 150) + '...' : '')}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Por {article.author || 'hgaruna'} • {new Date(article.date || article.createdAt).toLocaleDateString('es-ES')}
                        </small>
                        <Link to={`/articulos/${article.slug || article._id}`} className="btn btn-primary btn-sm">
                          Leer más
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Schema.org para la página de artículos */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Blog de Desarrollo Web Villa Carlos Paz",
        "description": "Blog sobre desarrollo web, diseño web y marketing digital en Villa Carlos Paz, Córdoba",
        "url": "https://service.hgaruna.org/articulos/",
        "publisher": {
          "@type": "Organization",
          "name": "hgaruna",
          "logo": {
            "@type": "ImageObject",
            "url": "https://service.hgaruna.org/logos-he-imagenes/logo3.png"
          }
        },
        "blogPost": articles.map(article => ({
          "@type": "BlogPosting",
          "headline": article.title,
          "description": article.description,
          "author": {
            "@type": "Organization",
            "name": article.author || "hgaruna"
          },
          "datePublished": article.date || article.createdAt,
          "url": `https://service.hgaruna.org/articulos/${article.slug || article._id}`
        }))
      }) }} />
    </BaseLayout>
  );
} 