import React from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';
import { getAllArticles } from '../utils/getArticles';

export default function Foro() {
  const [articles, setArticles] = React.useState([]);
  const [filteredArticles, setFilteredArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    async function loadArticles() {
      try {
        const articlesData = await getAllArticles();
        setArticles(articlesData);
        setFilteredArticles(articlesData);
      } catch (error) {
        console.error('Error cargando artículos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  // Función de búsqueda
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  }, [searchTerm, articles]);

  return (
    <BaseLayout
      title="Foro de Desarrollo Web Villa Carlos Paz | Comunidad de Programadores | hgaruna"
      description="Foro de desarrollo web en Villa Carlos Paz, Córdoba. Comunidad de programadores, diseñadores web y profesionales del marketing digital. Comparte conocimientos y conecta con otros profesionales."
      keywords="foro desarrollo web villa carlos paz, comunidad programadores villa carlos paz, foro web córdoba, programadores villa carlos paz, diseñadores web villa carlos paz, marketing digital villa carlos paz"
      ogTitle="Foro de Desarrollo Web Villa Carlos Paz | Comunidad de Programadores | hgaruna"
      ogDescription="Foro de desarrollo web en Villa Carlos Paz, Córdoba. Comunidad de programadores, diseñadores web y profesionales del marketing digital."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/foro/"
    >
      {/* Hero Section */}
      <Hero
        title="Foro de Desarrollo Web Villa Carlos Paz | Comunidad de Programadores"
        subtitle="Únete a nuestra comunidad de programadores, diseñadores web y profesionales del marketing digital en Villa Carlos Paz. Comparte conocimientos, resuelve dudas y conecta con otros profesionales."
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

      {/* Buscador Global */}
      <section className="buscador-section py-4 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar artículos sobre desarrollo web, diseño web, marketing digital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-2">
                  <small className="text-muted">
                    {filteredArticles.length} resultado{filteredArticles.length !== 1 ? 's' : ''} encontrado{filteredArticles.length !== 1 ? 's' : ''}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feed de Artículos Estilo Facebook */}
      <section className="foro-feed py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando artículos...</span>
                  </div>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center">
                  <div className="alert alert-info">
                    <h4>No se encontraron artículos</h4>
                    <p>
                      {searchTerm 
                        ? `No hay artículos que coincidan con "${searchTerm}". Intenta con otros términos.`
                        : 'Pronto publicaremos contenido sobre desarrollo web, diseño web y marketing digital.'
                      }
                    </p>
                    {searchTerm && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setSearchTerm('')}
                      >
                        Ver todos los artículos
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="feed-container">
                  {filteredArticles.map((article, index) => (
                    <div key={article._id || index} className="feed-card mb-4">
                      <div className="feed-card-header">
                        <div className="feed-card-avatar">
                          <img 
                            src="/logos-he-imagenes/logo3.png" 
                            alt="hgaruna"
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="feed-card-meta">
                          <div className="feed-card-author">
                            {article.author || 'hgaruna'}
                          </div>
                          <div className="feed-card-date">
                            {new Date(article.date || article.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="feed-card-content">
                        <h5 className="feed-card-title">{article.title}</h5>
                        <p className="feed-card-description">
                          {article.description || (article.content ? article.content.substring(0, 200) + '...' : '')}
                        </p>
                        
                        {article.image && (
                          <div className="feed-card-image">
                            <img 
                              src={article.image} 
                              alt={article.title}
                              className="img-fluid rounded"
                              style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                        )}
                        
                        {article.tags && article.tags.length > 0 && (
                          <div className="feed-card-tags mt-2">
                            {article.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="badge bg-light text-dark me-1">
                                #{tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="badge bg-light text-dark">
                                +{article.tags.length - 3} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="feed-card-actions">
                        <Link 
                          to={`/articulos/${article.slug || article._id}`} 
                          className="btn btn-primary"
                        >
                          <i className="fas fa-eye me-2"></i>
                          Ver artículo completo
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .feed-container {
          max-width: 100%;
        }
        
        .feed-card {
          background: white;
          border: 1px solid #e1e8ed;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .feed-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }
        
        .feed-card-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .feed-card-avatar {
          margin-right: 12px;
        }
        
        .feed-card-meta {
          flex: 1;
        }
        
        .feed-card-author {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 14px;
        }
        
        .feed-card-date {
          color: #666;
          font-size: 12px;
        }
        
        .feed-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        
        .feed-card-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .feed-card-image {
          margin: 15px 0;
        }
        
        .feed-card-tags {
          margin-top: 10px;
        }
        
        .feed-card-actions {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e1e8ed;
        }
        
        .buscador-section {
          border-bottom: 1px solid #e1e8ed;
        }
      `}</style>
    </BaseLayout>
  );
} 