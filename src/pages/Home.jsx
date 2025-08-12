import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdSenseBanner, AdSenseInArticle, AdSenseMatchedContent } from '../components/AdSenseAd';
import { useBlogArticles } from '../utils/getBlogArticles';
import './Home.css';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { articles: blogArticles, loading: articlesLoading } = useBlogArticles();

  // Categorías de filtrado
  const categories = [
    'Todos', 'JavaScript', 'Python', 'React', 'IA', 'DevOps', 'Backend', 'Frontend', 'Mobile'
  ];

  // Artículo destacado del mes
  const monthlyHighlight = {
    title: "Guía Completa de JavaScript Moderno 2024",
    subtitle: "Desde ES6 hasta las últimas funcionalidades",
    description: "Domina JavaScript moderno con esta guía definitiva que cubre desde conceptos básicos hasta técnicas avanzadas. Incluye ejercicios prácticos, proyectos reales y las mejores prácticas de la industria.",
    image: "/logos-he-imagenes/js-guide-2024.jpg",
    downloadLink: "/ebook",
    features: [
      "150+ páginas de contenido premium",
      "Proyectos prácticos incluidos", 
      "Ejercicios con soluciones",
      "Actualizaciones gratuitas",
      "Acceso a comunidad privada"
    ],
    rating: 4.9,
    downloads: "12,458"
  };

  // Estado para manejar los artículos mostrados
  const [displayedArticles, setDisplayedArticles] = useState([]);

  // Función para seleccionar artículos aleatorios
  const selectRandomArticles = React.useCallback(() => {
    if (blogArticles.length === 0) return [];
    
    // Hacer una copia del array para no modificar el original
    const shuffled = [...blogArticles].sort(() => 0.5 - Math.random());
    // Seleccionar los primeros 6 artículos del array mezclado
    return shuffled.slice(0, 6);
  }, [blogArticles]);

  // Efecto para inicializar y rotar los artículos
  React.useEffect(() => {
    // Inicializar con artículos aleatorios
    setDisplayedArticles(selectRandomArticles());
    
    // Configurar intervalo para rotar artículos cada 30 segundos
    const intervalId = setInterval(() => {
      setDisplayedArticles(selectRandomArticles());
    }, 30000);
    
    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [selectRandomArticles]);

  // Usar los artículos mostrados
  const filteredArticles = displayedArticles;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid-background"></div>
        <div className="hero-content">
          <div className="hero-main">
            <h1 className="hero-title">
              Aprende <span className="highlight">Desarrollo</span> con los 
              <span className="highlight"> Mejores Tutoriales</span>
            </h1>
            <p className="hero-description">
              Descubre artículos, tutoriales y eBooks gratuitos sobre JavaScript, Python, React, IA y más. 
              Mantente actualizado con las últimas tendencias en desarrollo de software.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">25K+</span>
                <span className="hero-stat-label">Desarrolladores</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">150+</span>
                <span className="hero-stat-label">Artículos</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Tutoriales</span>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/articulos" className="hero-button primary">
                Explorar Artículos
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link to="/ebook" className="hero-button secondary">
                <i className="fas fa-download"></i>
                eBook Gratis
              </Link>
            </div>
            
            <div className="hero-visual">
              <div className="code-snippet">
                <div className="code-header">
                  <span className="code-lang">JavaScript</span>
                  <div className="code-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div className="code-content">
                  <span className="code-line">
                    <span className="keyword">const</span> 
                    <span className="variable"> developer</span> = {'{'}
                  </span>
                  <span className="code-line">
                    &nbsp;&nbsp;<span className="property">skills</span>: 
                    <span className="string">['React', 'Node.js']</span>,
                  </span>
                  <span className="code-line">
                    &nbsp;&nbsp;<span className="property">learning</span>: 
                    <span className="boolean">true</span>
                  </span>
                  <span className="code-line">{'}'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* AdSense Banner */}
      <div className="adsense-container">
        <AdSenseBanner />
      </div>

      {/* Destacado del mes */}
      <section className="monthly-highlight">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-star"></i>
              Destacado del Mes
            </h2>
            <p className="section-subtitle">El contenido más valioso para tu carrera</p>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-content">
              <div className="highlight-badge">
                <i className="fas fa-crown"></i>
                Contenido Premium
              </div>
              <h3 className="highlight-title">{monthlyHighlight.title}</h3>
              <p className="highlight-subtitle">{monthlyHighlight.subtitle}</p>
              <p className="highlight-description">{monthlyHighlight.description}</p>
              
              <ul className="highlight-features">
                {monthlyHighlight.features.map((feature, index) => (
                  <li key={index}>
                    <i className="fas fa-check"></i>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="highlight-meta">
                <div className="rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(monthlyHighlight.rating) ? 'filled' : ''}`}></i>
                    ))}
                  </div>
                  <span className="rating-text">{monthlyHighlight.rating}/5</span>
                </div>
                <div className="downloads">
                  <i className="fas fa-download"></i>
                  {monthlyHighlight.downloads} descargas
                </div>
              </div>
              
              <Link to={monthlyHighlight.downloadLink} className="btn btn-cta">
                <i className="fas fa-gift"></i>
                Descargar Gratis
              </Link>
            </div>
            
            <div className="highlight-image">
              <div className="book-3d">
                <div className="book-cover">
                  <div className="book-spine"></div>
                  <div className="book-front">
                    <h4>JavaScript 2024</h4>
                    <p>Guía Completa</p>
                    <div className="book-logo">
                      <i className="fab fa-js-square"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de artículos destacados */}
      <section className="articles-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-star"></i>
              Artículos Destacados
            </h2>
            <p className="section-subtitle">Descubre contenido seleccionado especialmente para ti</p>
          </div>

          {/* Grid de artículos */}
          <div className="articles-grid">
            {filteredArticles.map(article => (
              <article key={article.id} className={`article-card ${article.featured ? 'featured' : ''}`}>
                <div className="article-image">
                  <img src={article.image} alt={article.title} />
                  <div className="article-category">{article.category}</div>
                  {article.featured && <div className="featured-badge">Destacado</div>}
                </div>
                
                <div className="article-content">
                  <div className="article-meta">
                    <span className="author">
                      <i className="fas fa-user"></i>
                      {article.author?.name || 'hgaruna Team'}
                    </span>
                    <span className="date">
                      <i className="fas fa-calendar"></i>
                      {new Date(article.date).toLocaleDateString('es-ES')}
                    </span>
                    <span className="read-time">
                      <i className="fas fa-clock"></i>
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h3 className="article-title">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                  </h3>
                  
                  <p className="article-excerpt">{article.excerpt}</p>
                  
                  <div className="article-tags">
                    {article.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                    Leer más
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="load-more-container">
            <Link to="/articulos" className="btn btn-outline">
              Ver Todos los Artículos
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* AdSense In-Article */}
      <div className="adsense-container">
        <AdSenseInArticle />
      </div>

      {/* AdSense Matched Content */}
      <div className="adsense-container">
        <AdSenseMatchedContent />
      </div>
    </div>
  );
}
