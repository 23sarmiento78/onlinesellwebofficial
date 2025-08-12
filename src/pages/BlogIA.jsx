import React, { useState, useEffect } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { AdSenseBanner, AdSenseInArticle, AdSenseMatchedContent } from '../components/AdSenseAd';
import '../styles/hero.css';

export default function BlogIA() {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [articles, setArticles] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Noticias de última hora
  const breakingNewsData = [
    {
      id: 1,
      title: "OpenAI lanza GPT-5: ¿El fin de la programación tradicional?",
      timestamp: "Hace 23 minutos",
      priority: "urgent",
      category: "IA"
    },
    {
      id: 2,
      title: "GitHub Copilot ahora puede escribir aplicaciones completas",
      timestamp: "Hace 1 hora",
      priority: "high",
      category: "Herramientas"
    },
    {
      id: 3,
      title: "Stack Overflow registra caída del 38% en preguntas de JavaScript",
      timestamp: "Hace 2 horas",
      priority: "medium",
      category: "Industria"
    }
  ];

  // Artículos principales estilo periódico
  const articlesData = [
    {
      id: 1,
      title: "La IA Generativa Está Cambiando el Desarrollo de Software Para Siempre",
      headline: "Análisis Exclusivo: Cómo ChatGPT y GitHub Copilot Han Revolucionado la Forma de Programar",
      excerpt: "Una investigación profunda sobre el impacto real de la inteligencia artificial en el desarrollo de software. Entrevistas exclusivas con CTOs de las principales empresas tech.",
      image: "/logos-he-imagenes/ai-programming-revolution.jpg",
      category: "Inteligencia Artificial",
      author: "Dr. Elena Rodríguez",
      authorRole: "Investigadora en IA",
      authorImage: "/logos-he-imagenes/author-elena.jpg",
      publishDate: "15 de Enero, 2024",
      readTime: "12 min",
      views: "15,420",
      comments: 234,
      featured: true,
      urgent: false,
      tags: ["IA", "Desarrollo", "Futuro", "Análisis"]
    },
    {
      id: 2,
      title: "JavaScript 2024: Las 15 Nuevas Características que Debes Conocer",
      headline: "Especial Técnico: ES2024 Trae Funcionalidades que Cambiarán tu Forma de Codificar",
      excerpt: "Un análisis completo de las nuevas características de JavaScript ES2024, con ejemplos prácticos y casos de uso reales en producción.",
      image: "/logos-he-imagenes/javascript-2024-features.jpg",
      category: "JavaScript",
      author: "Miguel Santos",
      authorRole: "Senior Developer",
      authorImage: "/logos-he-imagenes/author-miguel.jpg",
      publishDate: "14 de Enero, 2024",
      readTime: "18 min",
      views: "22,150",
      comments: 456,
      featured: true,
      urgent: false,
      tags: ["JavaScript", "ES2024", "Nuevas Features", "Tutorial"]
    },
    {
      id: 3,
      title: "React 19: ¿Revolución o Evolución? Análisis Completo",
      headline: "Primera Impresión: Probamos React 19 en Producción Durante 30 Días",
      excerpt: "Nuestro equipo ha estado probando React 19 en aplicaciones reales. Te contamos todo lo que necesitas saber antes de migrar.",
      image: "/logos-he-imagenes/react-19-analysis.jpg",
      category: "React",
      author: "Carmen López",
      authorRole: "React Expert",
      authorImage: "/logos-he-imagenes/author-carmen.jpg",
      publishDate: "13 de Enero, 2024",
      readTime: "25 min",
      views: "18,930",
      comments: 189,
      featured: true,
      urgent: false,
      tags: ["React", "React 19", "Performance", "Migration"]
    },
    {
      id: 4,
      title: "Python vs JavaScript en 2024: La Batalla Continúa",
      headline: "Encuesta Exclusiva: 10,000 Desarrolladores Revelan su Lenguaje Preferido",
      excerpt: "Resultados sorprendentes de nuestra encuesta anual a desarrolladores. Los datos que no esperabas sobre la popularidad de los lenguajes.",
      image: "/logos-he-imagenes/python-vs-js-2024.jpg",
      category: "Industria",
      author: "Roberto Chen",
      authorRole: "Data Analyst",
      authorImage: "/logos-he-imagenes/author-roberto.jpg",
      publishDate: "12 de Enero, 2024",
      readTime: "8 min",
      views: "31,240",
      comments: 678,
      featured: false,
      urgent: false,
      tags: ["Python", "JavaScript", "Encuesta", "Estadísticas"]
    }
  ];

  // Categorías de noticias
  const newsCategories = [
    { name: "Todas las Noticias", key: "todas", icon: "fas fa-newspaper", count: 247, color: "#2d3436" },
    { name: "Inteligencia Artificial", key: "ia", icon: "fas fa-robot", count: 89, color: "#6c5ce7" },
    { name: "JavaScript", key: "javascript", icon: "fab fa-js-square", count: 124, color: "#f1c40f" },
    { name: "React", key: "react", icon: "fab fa-react", count: 67, color: "#00d2d3" },
    { name: "Python", key: "python", icon: "fab fa-python", color: "#3776ab", count: 98 },
    { name: "Industria", key: "industria", icon: "fas fa-industry", count: 156, color: "#e17055" },
    { name: "Herramientas", key: "herramientas", icon: "fas fa-tools", count: 78, color: "#00b894" }
  ];

  // Trending topics
  const trendingTopics = [
    { topic: "GitHub Copilot", mentions: 1234, trend: "up" },
    { topic: "TypeScript 5.3", mentions: 892, trend: "up" },
    { topic: "Vercel AI SDK", mentions: 567, trend: "up" },
    { topic: "Remix vs Next.js", mentions: 445, trend: "down" },
    { topic: "Bun Runtime", mentions: 334, trend: "up" }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setArticles(articlesData);
      setBreakingNews(breakingNewsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredArticles = selectedCategory === 'todas' 
    ? articles 
    : articles.filter(article => 
        article.category.toLowerCase().includes(selectedCategory) ||
        article.tags.some(tag => tag.toLowerCase().includes(selectedCategory))
      );

  const featuredArticle = articles.find(article => article.featured);
  const otherFeatured = articles.filter(article => article.featured && article.id !== featuredArticle?.id);

  return (
    <BaseLayout
      title="CodeDaily Noticias | Últimas Noticias de Programación y Tecnología"
      description="Mantente al día con las últimas noticias, análisis y tendencias del mundo de la programación. Cobertura exclusiva de JavaScript, Python, IA y más."
      keywords="noticias programación, últimas noticias tecnología, javascript noticias, python updates, react news, inteligencia artificial, desarrollo software"
    >
      {/* Hero Section */}
      <section className="hero-section blog">
        <div className="hero-background">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-main">
              <div className="hero-badge">
                <i className="fas fa-bolt"></i>
                Últimas Noticias de Tecnología
              </div>
              <h1 className="hero-title">
                Blog de Desarrollo e Inteligencia Artificial
              </h1>
              <p className="hero-description">
                Mantente al día con las últimas noticias y tendencias en desarrollo de software, 
                programación e inteligencia artificial. Artículos escritos por expertos del sector.
              </p>
              <div className="hero-actions">
                <a href="#featured" className="hero-button primary">
                  <i className="fas fa-newspaper"></i>
                  Ver Últimas Noticias
                </a>
                <a href="#categories" className="hero-button secondary">
                  <i className="fas fa-th-large"></i>
                  Explorar Categorías
                </a>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-newspaper"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">247</span>
                  <span className="stat-label">Artículos</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">15K+</span>
                  <span className="stat-label">Lectores</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">Diario</span>
                  <span className="stat-label">Actualizaciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breaking News Ticker */}
      <section className="breaking-news-section">
        <div className="container-fluid">
          <div className="breaking-news-ticker">
            {breakingNews.map((news, index) => (
              <div key={news.id} className={`breaking-item ${news.priority}`}>
                <span className="news-time">{news.timestamp}</span>
                <span className="news-title">{news.title}</span>
                <span className="news-category">{news.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newspaper Header */}
      <section className="news-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="edition-info">
                <div className="current-date">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="edition-number">Edición Digital #1,847</div>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <h1 className="news-masthead">
                <span className="code">CODE</span>
                <span className="daily">DAILY</span>
                <span className="news">NEWS</span>
              </h1>
              <p className="news-tagline">Tu Fuente Diaria de Noticias Tech</p>
            </div>
            <div className="col-md-3">
              <div className="weather-widget">
                <div className="live-readers">
                  <i className="fas fa-eye"></i>
                  <span>3,247 leyendo ahora</span>
                </div>
                <div className="today-articles">
                  <i className="fas fa-newspaper"></i>
                  <span>12 artículos hoy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Categories Navigation */}
      <section className="news-categories">
        <div className="container">
          <div className="categories-nav">
            {newsCategories.map((category, index) => (
              <button
                key={index}
                className={`category-btn ${selectedCategory === category.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <i className={category.icon} style={{ color: category.color }}></i>
                <span>{category.name}</span>
                <span className="count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <section className="ad-section">
        <div className="container">
          <AdSenseBanner slot="1234567890" />
        </div>
      </section>

      {/* Main News Content */}
      <section className="main-news-content">
        <div className="container">
          <div className="row">
            {/* Main Content Column */}
            <div className="col-lg-8">
              {featuredArticle && (
                <>
                  {/* Front Page Story */}
                  <div className="front-page-story">
                    <div className="story-header">
                      <div className="story-label">HISTORIA DE PORTADA</div>
                      <div className="story-meta">
                        <span className="category" style={{ backgroundColor: newsCategories.find(cat => cat.name === featuredArticle.category)?.color }}>
                          {featuredArticle.category}
                        </span>
                        <span className="publish-date">{featuredArticle.publishDate}</span>
                      </div>
                    </div>
                    
                    <div className="story-content">
                      <h1 className="main-headline">{featuredArticle.title}</h1>
                      <h2 className="sub-headline">{featuredArticle.headline}</h2>
                      
                      <div className="story-image">
                        <img src={featuredArticle.image} alt={featuredArticle.title} />
                        <div className="image-caption">
                          Foto: La revolución de la IA en el desarrollo de software está aquí
                        </div>
                      </div>
                      
                      <div className="story-byline">
                        <div className="author-info">
                          <img src={featuredArticle.authorImage} alt={featuredArticle.author} />
                          <div>
                            <h6>Por {featuredArticle.author}</h6>
                            <small>{featuredArticle.authorRole}</small>
                          </div>
                        </div>
                        <div className="story-stats">
                          <span><i className="fas fa-clock"></i> {featuredArticle.readTime}</span>
                          <span><i className="fas fa-eye"></i> {featuredArticle.views}</span>
                          <span><i className="fas fa-comments"></i> {featuredArticle.comments}</span>
                        </div>
                      </div>
                      
                      <div className="story-excerpt">
                        <p>{featuredArticle.excerpt}</p>
                      </div>
                      
                      <div className="story-actions">
                        <a href={`/articulo/${featuredArticle.id}`} className="read-full-story">
                          Leer Historia Completa
                          <i className="fas fa-arrow-right"></i>
                        </a>
                        <div className="story-sharing">
                          <button className="share-btn twitter">
                            <i className="fab fa-twitter"></i>
                          </button>
                          <button className="share-btn facebook">
                            <i className="fab fa-facebook-f"></i>
                          </button>
                          <button className="share-btn linkedin">
                            <i className="fab fa-linkedin-in"></i>
                          </button>
                          <button className="share-btn copy">
                            <i className="fas fa-link"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Stories */}
                  <div className="secondary-stories">
                    <h3 className="section-title">
                      <i className="fas fa-newspaper"></i>
                      Otras Historias Destacadas
                    </h3>
                    <div className="stories-grid">
                      {otherFeatured.map((article, index) => (
                        <div key={index} className="secondary-story">
                          <div className="story-image">
                            <img src={article.image} alt={article.title} />
                            <div className="category-tag" style={{ backgroundColor: newsCategories.find(cat => cat.name === article.category)?.color }}>
                              {article.category}
                            </div>
                          </div>
                          <div className="story-content">
                            <h4>{article.title}</h4>
                            <p>{article.excerpt.substring(0, 120)}...</p>
                            <div className="story-meta">
                              <span className="author">Por {article.author}</span>
                              <span className="date">{article.publishDate}</span>
                              <span className="read-time">{article.readTime}</span>
                            </div>
                            <a href={`/articulo/${article.id}`} className="read-more">
                              Leer más →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* AdSense In-Article */}
              <div className="ad-section my-5">
                <AdSenseInArticle slot="5555555555" />
              </div>

              {/* Latest News Grid */}
              <div className="latest-news">
                <h3 className="section-title">
                  <i className="fas fa-clock"></i>
                  Últimas Publicaciones
                  {selectedCategory !== 'todas' && (
                    <span className="filter-indicator">
                      en {newsCategories.find(cat => cat.key === selectedCategory)?.name}
                    </span>
                  )}
                </h3>
                
                {isLoading ? (
                  <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando últimas noticias...</p>
                  </div>
                ) : (
                  <div className="news-grid">
                    {filteredArticles.map((article, index) => (
                      <article key={index} className="news-item">
                        <div className="news-image">
                          <img src={article.image} alt={article.title} />
                          <div className="news-category" style={{ backgroundColor: newsCategories.find(cat => cat.name === article.category)?.color }}>
                            {article.category}
                          </div>
                        </div>
                        <div className="news-content">
                          <div className="news-meta">
                            <span className="author">{article.author}</span>
                            <span className="date">{article.publishDate}</span>
                          </div>
                          <h5>{article.title}</h5>
                          <p>{article.excerpt.substring(0, 150)}...</p>
                          <div className="news-stats">
                            <span><i className="fas fa-eye"></i> {article.views}</span>
                            <span><i className="fas fa-comments"></i> {article.comments}</span>
                            <span><i className="fas fa-clock"></i> {article.readTime}</span>
                          </div>
                          <a href={`/articulo/${article.id}`} className="news-link">
                            Leer artículo completo →
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Trending Topics */}
              <div className="sidebar-section trending-section">
                <h4 className="sidebar-title">
                  <i className="fas fa-fire"></i>
                  Tendencias Hoy
                </h4>
                <div className="trending-list">
                  {trendingTopics.map((item, index) => (
                    <div key={index} className="trending-item">
                      <div className="trending-rank">#{index + 1}</div>
                      <div className="trending-content">
                        <h6>{item.topic}</h6>
                        <div className="trending-stats">
                          <span className="mentions">{item.mentions} menciones</span>
                          <span className={`trend ${item.trend}`}>
                            <i className={`fas fa-arrow-${item.trend === 'up' ? 'up' : 'down'}`}></i>
                            {item.trend === 'up' ? 'Subiendo' : 'Bajando'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AdSense Sidebar */}
              <div className="sidebar-section ad-section">
                <div className="ad-label">PUBLICIDAD</div>
                <AdSenseBanner slot="3333333333" />
              </div>

              {/* Newsletter Signup */}
              <div className="sidebar-section newsletter-section">
                <h4 className="sidebar-title">
                  <i className="fas fa-envelope-open"></i>
                  Boletín de Noticias
                </h4>
                <p>Recibe las noticias más importantes directo en tu email</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="newsletter-input"
                  />
                  <button type="submit" className="newsletter-btn">
                    <i className="fas fa-paper-plane"></i>
                    Suscribirse
                  </button>
                </form>
                <div className="newsletter-benefits">
                  <small>
                    ✓ Resumen diario de noticias<br/>
                    ✓ Análisis exclusivos<br/>
                    ✓ Sin spam, cancela cuando quieras
                  </small>
                </div>
              </div>

              {/* Quick Links */}
              <div className="sidebar-section quick-links-section">
                <h4 className="sidebar-title">
                  <i className="fas fa-bolt"></i>
                  Accesos Rápidos
                </h4>
                <div className="quick-links">
                  <a href="/tutorials" className="quick-link">
                    <i className="fas fa-graduation-cap"></i>
                    <span>Tutoriales</span>
                  </a>
                  <a href="/tools" className="quick-link">
                    <i className="fas fa-tools"></i>
                    <span>Herramientas</span>
                  </a>
                  <a href="/jobs" className="quick-link">
                    <i className="fas fa-briefcase"></i>
                    <span>Empleos</span>
                  </a>
                  <a href="/events" className="quick-link">
                    <i className="fas fa-calendar"></i>
                    <span>Eventos</span>
                  </a>
                </div>
              </div>

              {/* Most Read */}
              <div className="sidebar-section most-read-section">
                <h4 className="sidebar-title">
                  <i className="fas fa-chart-line"></i>
                  Más Leídos Esta Semana
                </h4>
                <div className="most-read-list">
                  {articles.slice(0, 5).map((article, index) => (
                    <div key={index} className="most-read-item">
                      <div className="read-rank">#{index + 1}</div>
                      <div className="read-content">
                        <h6>{article.title.substring(0, 60)}...</h6>
                        <small>{article.views} visualizaciones</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom AdSense */}
      <section className="ad-section">
        <div className="container">
          <AdSenseMatchedContent slot="7777777777" />
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        .breaking-news-section {
          background: #ff0000;
          color: white;
          padding: 10px 0;
          border-bottom: 2px solid #cc0000;
        }
        
        .breaking-news-header {
          background: #000;
          padding: 5px 0;
          text-align: center;
        }
        
        .breaking-label {
          font-weight: bold;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
        
        .breaking-news-ticker {
          padding: 8px 0;
          overflow: hidden;
          white-space: nowrap;
        }
        
        .breaking-item {
          display: inline-block;
          margin-right: 100px;
          animation: scroll 60s linear infinite;
        }
        
        .breaking-item.urgent {
          font-weight: bold;
        }
        
        .news-time {
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          margin-right: 10px;
        }
        
        .news-category {
          background: rgba(255,255,255,0.3);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          margin-left: 10px;
        }
        
        @keyframes scroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        
        .news-header {
          background: #f8f9fa;
          border-bottom: 3px solid #000;
          padding: 25px 0;
        }
        
        .news-masthead {
          font-family: 'Times New Roman', serif;
          font-size: 3rem;
          font-weight: bold;
          margin: 0;
          letter-spacing: 2px;
        }
        
        .news-masthead .code {
          color: #00ff41;
        }
        
        .news-masthead .daily {
          color: #000;
        }
        
        .news-masthead .news {
          color: #ff0000;
          margin-left: 10px;
        }
        
        .news-tagline {
          font-style: italic;
          color: #666;
          margin-top: 8px;
        }
        
        .edition-info {
          font-size: 0.9rem;
          color: #333;
        }
        
        .edition-number {
          font-weight: bold;
          margin-top: 5px;
        }
        
        .weather-widget {
          text-align: right;
          font-size: 0.9rem;
          color: #333;
        }
        
        .live-readers,
        .today-articles {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: flex-end;
          margin-bottom: 5px;
        }
        
        .news-categories {
          background: #000;
          color: white;
          padding: 15px 0;
        }
        
        .categories-nav {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .category-btn {
          background: transparent;
          border: 1px solid #333;
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }
        
        .category-btn:hover,
        .category-btn.active {
          background: #00ff41;
          color: #000;
          border-color: #00ff41;
        }
        
        .category-btn .count {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .front-page-story {
          background: white;
          border: 3px solid #000;
          margin-bottom: 40px;
          position: relative;
        }
        
        .story-header {
          background: #000;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .story-label {
          font-weight: bold;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
        
        .story-meta {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .category {
          padding: 4px 12px;
          border-radius: 15px;
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .story-content {
          padding: 40px;
        }
        
        .main-headline {
          font-size: 2.8rem;
          font-weight: bold;
          line-height: 1.1;
          margin-bottom: 15px;
          font-family: 'Times New Roman', serif;
        }
        
        .sub-headline {
          font-size: 1.3rem;
          color: #666;
          font-weight: normal;
          margin-bottom: 25px;
          font-style: italic;
        }
        
        .story-image {
          margin: 30px 0;
        }
        
        .story-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .image-caption {
          font-size: 0.9rem;
          color: #666;
          font-style: italic;
          margin-top: 10px;
          text-align: center;
        }
        
        .story-byline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 25px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .author-info img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .author-info h6 {
          margin: 0;
          color: #000;
        }
        
        .author-info small {
          color: #666;
        }
        
        .story-stats {
          display: flex;
          gap: 20px;
          color: #666;
          font-size: 0.9rem;
        }
        
        .story-excerpt {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #333;
          margin: 25px 0;
        }
        
        .story-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
        }
        
        .read-full-story {
          background: #00ff41;
          color: #000;
          padding: 15px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        
        .read-full-story:hover {
          background: #00cc33;
          text-decoration: none;
          color: #000;
          transform: translateY(-2px);
        }
        
        .story-sharing {
          display: flex;
          gap: 10px;
        }
        
        .share-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .share-btn.twitter { background: #1da1f2; }
        .share-btn.facebook { background: #1877f2; }
        .share-btn.linkedin { background: #0077b5; }
        .share-btn.copy { background: #666; }
        
        .share-btn:hover {
          transform: translateY(-2px);
        }
        
        .section-title {
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid #000;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .filter-indicator {
          font-size: 1rem;
          color: #666;
          font-weight: normal;
        }
        
        .stories-grid,
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }
        
        .secondary-story,
        .news-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .secondary-story:hover,
        .news-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .secondary-story .story-image,
        .news-image {
          position: relative;
          overflow: hidden;
        }
        
        .secondary-story .story-image img,
        .news-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .secondary-story:hover .story-image img,
        .news-item:hover .news-image img {
          transform: scale(1.05);
        }
        
        .category-tag,
        .news-category {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .secondary-story .story-content,
        .news-content {
          padding: 20px;
        }
        
        .secondary-story h4,
        .news-content h5 {
          font-size: 1.1rem;
          margin-bottom: 10px;
          line-height: 1.3;
          color: #000;
        }
        
        .secondary-story p,
        .news-content p {
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }
        
        .secondary-story .story-meta,
        .news-meta {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 10px;
          display: flex;
          gap: 10px;
        }
        
        .news-stats {
          display: flex;
          gap: 15px;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 10px;
        }
        
        .read-more,
        .news-link {
          color: #00ff41;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        
        .read-more:hover,
        .news-link:hover {
          color: #00cc33;
          text-decoration: none;
        }
        
        .sidebar-section {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 30px;
        }
        
        .sidebar-title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #00ff41;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #000;
        }
        
        .trending-list,
        .most-read-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .trending-item,
        .most-read-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .trending-item:hover,
        .most-read-item:hover {
          background: #e9ecef;
        }
        
        .trending-rank,
        .read-rank {
          width: 30px;
          height: 30px;
          background: #00ff41;
          color: #000;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .trending-content h6,
        .read-content h6 {
          margin: 0 0 5px 0;
          font-size: 0.95rem;
          line-height: 1.3;
        }
        
        .trending-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #666;
        }
        
        .trend.up {
          color: #00ff41;
        }
        
        .trend.down {
          color: #ff6b6b;
        }
        
        .newsletter-form {
          display: flex;
          margin-bottom: 15px;
        }
        
        .newsletter-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px 0 0 6px;
          outline: none;
        }
        
        .newsletter-input:focus {
          border-color: #00ff41;
        }
        
        .newsletter-btn {
          background: #00ff41;
          color: #000;
          border: none;
          padding: 12px 15px;
          border-radius: 0 6px 6px 0;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.3s ease;
        }
        
        .newsletter-btn:hover {
          background: #00cc33;
        }
        
        .newsletter-benefits {
          color: #666;
          line-height: 1.4;
        }
        
        .quick-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        
        .quick-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
        }
        
        .quick-link:hover {
          background: #00ff41;
          color: #000;
          text-decoration: none;
        }
        
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #eee;
          border-top: 3px solid #00ff41;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .ad-section {
          padding: 25px 0;
          text-align: center;
          background: #f8f9fa;
        }
        
        .ad-label {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        @media (max-width: 768px) {
          .news-masthead {
            font-size: 2.2rem;
          }
          
          .main-headline {
            font-size: 2rem;
          }
          
          .sub-headline {
            font-size: 1.1rem;
          }
          
          .story-content {
            padding: 25px;
          }
          
          .story-byline {
            flex-direction: column;
            gap: 15px;
          }
          
          .story-actions {
            flex-direction: column;
            gap: 20px;
          }
          
          .categories-nav {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 10px;
          }
          
          .stories-grid,
          .news-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-links {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </BaseLayout>
  );
}
