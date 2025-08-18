import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdSenseBanner, AdSenseInArticle } from '../components/AdSenseAd';
import { getBlogArticles } from '../utils/getBlogArticles2';
import { searchArticles } from '../utils/searchArticles';
import './Articles.css';
import '../styles/hero.css';

export default function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('fecha');
  const [viewMode, setViewMode] = useState('grid');
  const [articlesData, setArticlesData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Categorías con iconos y colores
  const categories = [
    { name: 'Todos', icon: 'fas fa-globe', color: '#64ffda', count: 0 },
    { name: 'Frontend', icon: 'fas fa-laptop-code', color: '#e535ab', count: 0 },
    { name: 'Backend', icon: 'fas fa-server', color: '#68217a', count: 0 },
    { name: 'DevOps y Cloud', icon: 'fas fa-cogs', color: '#326ce5', count: 0 },
    { name: 'Performance y Optimización', icon: 'fas fa-tachometer-alt', color: '#f7df1e', count: 0 },
    { name: 'Arquitectura y Patrones', icon: 'fas fa-cubes', color: '#61dafb', count: 0 },
    { name: 'Bases de Datos', icon: 'fas fa-database', color: '#3776ab', count: 0 },
    { name: 'Testing y Calidad', icon: 'fas fa-vial', color: '#4caf50', count: 0 },
    { name: 'Herramientas y Productividad', icon: 'fas fa-tools', color: '#ff6b35', count: 0 },
    { name: 'Inteligencia Artificial', icon: 'fas fa-brain', color: '#9c27b0', count: 0 },
    { name: 'Seguridad', icon: 'fas fa-shield-alt', color: '#f44336', count: 0 },
    { name: 'Tendencias y Futuro', icon: 'fas fa-rocket', color: '#2196f3', count: 0 }
  ];

  // Cargar artículos
  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      console.log('Iniciando carga de artículos...');
      
      const articles = await getBlogArticles();
      console.log('Artículos cargados exitosamente:', articles.length);
      
      if (!Array.isArray(articles)) {
        throw new Error('Los artículos cargados no son un array válido');
      }
      
      if (articles.length === 0) {
        console.warn('Se cargó un array vacío de artículos');
      }
      
      setArticlesData(articles);
      setSearchResults(articles);
      
    } catch (error) {
      console.error('Error detallado cargando artículos:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });
      setLoadError(`Error al cargar artículos: ${error.message}`);
      setArticlesData([]);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para cargar artículos inicialmente
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Efecto para manejar búsquedas
  useEffect(() => {
    const handleSearch = async () => {
      if (!articlesData.length) return;
      
      if (searchTerm) {
        const results = await searchArticles(searchTerm, articlesData);
        setSearchResults(results);
      } else {
        setSearchResults(articlesData);
      }
    };

    handleSearch();
  }, [searchTerm, articlesData]);

  // Función para manejar envío del formulario de búsqueda
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // La búsqueda ya se maneja automáticamente con el useEffect
      // pero podemos agregar lógica adicional aquí si es necesario
    }
  };

  // Artículos de fallback en caso de error
  const fallbackArticles = [
    {
      id: 1,
      title: "Error al cargar artículos",
      excerpt: "No se pudieron cargar los artículos del blog. Por favor, intenta nuevamente más tarde.",
      image: "/logos-he-imagenes/error.jpg",
      category: "Sistema",
      author: {
        name: "Sistema",
        avatar: "/logos-he-imagenes/author-default.jpg",
        bio: "Mensaje del sistema"
      },
      date: new Date().toISOString().split('T')[0],
      readTime: "1 min",
      views: 0,
      likes: 0,
      tags: ["Error", "Sistema"],
      difficulty: "N/A",
      featured: false,
      trending: false,
      url: "#"
    }
  ];

  // Actualizar contadores de categorías
  useEffect(() => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: cat.name === 'Todos' 
        ? articlesData.length 
        : articlesData.filter(article => article.category === cat.name).length
    }));
    setCategories(updatedCategories);
  }, [articlesData]);

  const [filteredCategories, setCategories] = useState(categories);

  // Filtrar artículos
  const filteredArticles = searchResults
    .filter(article => {
      const matchesCategory = selectedCategory === 'Todos' || article.category === selectedCategory;
      return matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'fecha':
          return new Date(b.date) - new Date(a.date);
        case 'popularidad':
          return (Number(b.views) || 0) - (Number(a.views) || 0);
        case 'likes':
          return (Number(b.likes) || 0) - (Number(a.likes) || 0);
        case 'titulo':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Principiante': return '#4caf50';
      case 'Intermedio': return '#ff9800';
      case 'Avanzado': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || loadError) {
    return (
      <div className="articles-loading">
        {isLoading && (
          <>
            <div className="loading-spinner">
              <i className="fas fa-newspaper fa-spin"></i>
            </div>
            <p>Cargando artículos del blog...</p>
          </>
        )}
        
        {loadError && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Error al cargar artículos</h3>
            <p>{loadError}</p>
            <div className="error-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setLoadError(null);
                  loadArticles();
                }}
              >
                <i className="fas fa-sync"></i>
                Intentar nuevamente
              </button>
              <p className="error-help">
                Si el problema persiste, verifica la consola del navegador para más detalles
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="articles-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="hero-main-content">
            <div className="hero-badge-section">
              <span className="hero-badge">
                <i className="fas fa-rocket"></i>
                Blog de Desarrollo
              </span>
            </div>

            <h1 className="hero-main-title">
              Artículos de <span className="title-accent">Desarrollo</span>
            </h1>

            <p className="hero-description">
              Explora tutoriales, guías técnicas y artículos especializados
              escritos por desarrolladores para desarrolladores
            </p>

            <div className="hero-search-section">
              <form onSubmit={handleSearch} className="hero-search-form">
                <div className="search-input-container">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Buscar artículos, tecnologías, tutoriales..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      setSearchParams(value ? { q: value } : {});
                    }}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSearchTerm('')}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                <button type="submit" className="search-submit-btn">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </form>

              <div className="search-tags">
                <span className="tags-label">Populares:</span>
                <button className="search-tag" onClick={() => setSearchTerm('React')}>React</button>
                <button className="search-tag" onClick={() => setSearchTerm('JavaScript')}>JavaScript</button>
                <button className="search-tag" onClick={() => setSearchTerm('Node.js')}>Node.js</button>
                <button className="search-tag" onClick={() => setSearchTerm('CSS')}>CSS</button>
              </div>
            </div>

            <div className="hero-stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-newspaper"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">{articlesData.length}</span>
                  <span className="stat-label">Artículos</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-tags"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">{filteredCategories.length - 1}</span>
                  <span className="stat-label">Categorías</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">
                    {Math.floor(articlesData.reduce((sum, article) => sum + (Number(article.views) || 0), 0) / 1000)}K+
                  </span>
                  <span className="stat-label">Lecturas</span>
                </div>
              </div>

              <div className="stat-item live-stat">
                <div className="stat-icon">
                  <i className="fas fa-circle"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">Live</span>
                  <span className="stat-label">Actualizándose</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-background-pattern"></div>
      </section>

      {/* AdSense Banner */}
      <div className="adsense-container">
        <AdSenseBanner />
      </div>

      {/* Categories Filter */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">
            <i className="fas fa-filter"></i>
            Explora por Categoría
          </h2>
          
          <div className="categories-grid">
            {filteredCategories.map((category, index) => (
              <button
                key={category.name}
                className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category.name)}
                style={{ '--category-color': category.color }}
              >
                <div className="category-icon">
                  <i className={category.icon}></i>
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="category-count">
                    {category.count} artículo{category.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="category-arrow">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="controls-section">
        <div className="container">
          <div className="controls-bar">
            <div className="results-info">
              <span className="results-count">
                {filteredArticles.length} artículo{filteredArticles.length !== 1 ? 's' : ''}
                {selectedCategory !== 'Todos' && ` en ${selectedCategory}`}
                {searchTerm && ` para "${searchTerm}"`}
              </span>
            </div>

            <div className="controls-right">
              <div className="sort-controls">
                <label htmlFor="sort-select">Ordenar por:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="fecha">Más recientes</option>
                  <option value="popularidad">Más leídos</option>
                  <option value="likes">Más valorados</option>
                  <option value="titulo">Título A-Z</option>
                </select>
              </div>

              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Vista en cuadrícula"
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Vista en lista"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid/List */}
      <section className="articles-content">
        <div className="container">
          {filteredArticles.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search fa-3x"></i>
              <h3>No se encontraron artículos</h3>
              <p>
                {searchTerm 
                  ? `No hay artículos que coincidan con "${searchTerm}"`
                  : `No hay artículos en la categoría "${selectedCategory}"`
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                }}
              >
                Ver todos los artículos
              </button>
            </div>
          ) : (
            <div className={`articles-container ${viewMode}`}>
              {filteredArticles.map((article, index) => (
                <article key={article.id} className={`article-card ${article.featured ? 'featured' : ''}`}>
                  {article.featured && (
                    <div className="featured-badge">
                      <i className="fas fa-star"></i>
                      Destacado
                    </div>
                  )}
                  
                  {article.trending && (
                    <div className="trending-badge">
                      <i className="fas fa-fire"></i>
                      Trending
                    </div>
                  )}

                  <div className="article-image">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      onError={(e) => {
                        e.target.onerror = null; // Prevenir bucle infinito
                        e.target.src = '/logos-he-imagenes/logo3.png'; // Imagen por defecto
                        e.target.classList.add('error'); // Agregar clase de error
                      }}
                      className={article.image === '/logos-he-imagenes/logo3.png' ? 'error' : ''}
                    />
                    <div className="article-overlay">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-btn">
                        <i className="fas fa-book-open"></i>
                        Leer Artículo
                      </a>
                    </div>
                  </div>

                  <div className="article-content">
                    <div className="article-meta">
                      <span 
                        className="category-tag"
                        style={{ 
                          '--category-color': filteredCategories.find(cat => cat.name === article.category)?.color 
                        }}
                      >
                        <i className={filteredCategories.find(cat => cat.name === article.category)?.icon}></i>
                        {article.category}
                      </span>
                      
                      <span 
                        className="difficulty-tag"
                        style={{ '--difficulty-color': getDifficultyColor(article.difficulty) }}
                      >
                        {article.difficulty}
                      </span>
                    </div>

                    <h3 className="article-title">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h3>

                    <p className="article-excerpt">{article.excerpt}</p>

                    <div className="article-tags">
                      {Array.isArray(article.tags) && article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>

                    <div className="article-footer">
                      <div className="author-info">
                        <img 
                          src={article.author.avatar} 
                          alt={article.author.name} 
                          className={`author-avatar ${article.author.avatar === '/logos-he-imagenes/logo3.png' ? 'error' : ''}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/logos-he-imagenes/logo3.png';
                            e.target.classList.add('error');
                          }}
                        />
                        <div className="author-details">
                          <span className="author-name">{article.author.name}</span>
                          <span className="author-bio">{article.author.bio}</span>
                        </div>
                      </div>

                      <div className="article-stats">
                        <div className="stat-item">
                          <i className="fas fa-eye"></i>
                          <span>{(Number(article.views) || 0).toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <i className="fas fa-heart"></i>
                          <span>{Number(article.likes) || 0}</span>
                        </div>
                        <div className="stat-item">
                          <i className="fas fa-clock"></i>
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="article-date">
                      <i className="fas fa-calendar"></i>
                      {formatDate(article.date)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredArticles.length > 0 && (
            <div className="load-more-section">
              <p className="load-more-info">
                Mostrando {filteredArticles.length} artículo{filteredArticles.length !== 1 ? 's' : ''} del blog
              </p>
              {loadError && (
                <div className="error-info">
                  <i className="fas fa-info-circle"></i>
                  Los artículos se cargan directamente desde la carpeta /public/blog
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* AdSense In-Article */}
      <div className="adsense-container">
        <AdSenseInArticle />
      </div>

      {/* Newsletter CTA */}
      <section className="newsletter-cta">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <h2>¿Te gustan nuestros artículos?</h2>
            <p>Recibe los mejores tutoriales y artículos directamente en tu email</p>
            <div className="newsletter-form">
              <input type="email" placeholder="tu@email.com" />
              <button className="btn btn-primary">
                <i className="fas fa-rocket"></i>
                Suscribirse
              </button>
            </div>
            <p className="newsletter-privacy">
              No spam. Solo contenido de calidad. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
