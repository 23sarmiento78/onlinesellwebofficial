import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import { getArticlesFromHTML } from "../utils/getArticlesFromHTML.js";
// El CSS de BlogIA se debe enlazar en public/index.html con:
// <link rel="stylesheet" href="/BlogIA.css" />

export default function BlogIA() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);

  const articlesPerPage = 6;

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      // Extraer categorías únicas, reales y no vacías
      const uniqueCategories = [...new Set(articles.map(article => article.category).filter(Boolean))];
      setCategories(uniqueCategories);

      // Generar temas de tendencia basados en tags
      const allTags = articles.flatMap(article => article.tags || []);
      const tagCounts = {};
      allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      const trending = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));
      setTrendingTopics(trending);
    }
  }, [articles]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const fetchedArticles = await getArticlesFromHTML();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <BaseLayout title="Blog IA" description="Artículos sobre desarrollo web e inteligencia artificial">
        <div className="blogia-loading">
          <div className="blogia-spinner"></div>
          <p className="blogia-loading-text">Cargando artículos...</p>
        </div>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout title="Blog IA" description="Artículos sobre desarrollo web e inteligencia artificial">
        <div className="blogia-error">
          <div className="blogia-error-icon"></div>
          <h2>Error al cargar artículos</h2>
          <p className="blogia-error-text">{error}</p>
          <button onClick={fetchArticles} className="blogia-btn blogia-btn-primary">
            Reintentar
          </button>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Blog IA" description="Artículos sobre desarrollo web e inteligencia artificial">
      <div className="blogia-main">
        {/* Header del Blog */}
        <header className="blogia-header">
          <div className="blogia-header-icon"><i className="fas fa-robot"></i></div>
          <div>
            <h1 className="blogia-title">Blog IA</h1>
            <p className="blogia-subtitle">Artículos generados por IA sobre desarrollo web, programación y tecnología</p>
          </div>
        </header>

        <div className="blogia-content">
          {/* Sidebar */}
          <aside className="blogia-sidebar">
            {/* Categorías */}
            <section className="blogia-plugin blogia-categories">
              <h3 className="blogia-plugin-title"><i className="fas fa-tags"></i> Categorías</h3>
              <div className="blogia-category-list">
                <button
                  className={`blogia-category-chip${selectedCategory === "" ? " selected" : ""}`}
                  onClick={() => handleCategoryClick("")}
                >
                  <i className="fas fa-globe"></i> Todas
                  <span className="blogia-category-count">{articles.length}</span>
                </button>
                {categories.map(category => {
                  const count = articles.filter(article => article.category === category).length;
                  return (
                    <button
                      key={category}
                      className={`blogia-category-chip${selectedCategory === category ? " selected" : ""}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <i className="fas fa-folder"></i> {category}
                      <span className="blogia-category-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Temas de tendencia */}
            <section className="blogia-plugin blogia-trending">
              <h3 className="blogia-plugin-title"><i className="fas fa-fire"></i> Tendencias</h3>
              <ul className="blogia-trending-list">
                {trendingTopics.map((topic, index) => (
                  <li key={topic.tag} className="blogia-trending-item">
                    <span className="blogia-trending-rank">#{index + 1}</span>
                    <span className="blogia-trending-tag">{topic.tag}</span>
                    <span className="blogia-trending-count">{topic.count}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Estadísticas */}
            <section className="blogia-plugin blogia-stats">
              <h3 className="blogia-plugin-title"><i className="fas fa-chart-bar"></i> Estadísticas</h3>
              <div className="blogia-stats-list">
                <div className="blogia-stats-box">
                  <div className="blogia-stats-icon"><i className="fas fa-file-alt"></i></div>
                  <div className="blogia-stats-value">{articles.length}</div>
                  <div className="blogia-stats-label">Artículos</div>
                </div>
                <div className="blogia-stats-box">
                  <div className="blogia-stats-icon"><i className="fas fa-folder"></i></div>
                  <div className="blogia-stats-value">{categories.length}</div>
                  <div className="blogia-stats-label">Categorías</div>
                </div>
                <div className="blogia-stats-box">
                  <div className="blogia-stats-icon"><i className="fas fa-fire"></i></div>
                  <div className="blogia-stats-value">{trendingTopics.length}</div>
                  <div className="blogia-stats-label">Tendencias</div>
                </div>
              </div>
            </section>
          </aside>

          {/* Feed de artículos */}
          <main className="blogia-feed">
            {/* Barra de búsqueda */}
            <div className="blogia-searchbar">
              <input
                type="text"
                className="blogia-search-input"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Feed de artículos en tarjetas */}
            <div className="blogia-feed-grid">
              {paginatedArticles.map((article) => (
                <div key={article.slug} className="blogia-card">
                  <div className="blogia-card-img-wrap">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="blogia-card-img"
                    />
                    <div className="blogia-card-category">{article.category}</div>
                  </div>
                  <div className="blogia-card-content">
                    <h2 className="blogia-card-title">
                      <a href={`/blog/${article.slug}.html`} className="blogia-card-link">
                        {article.title}
                      </a>
                    </h2>
                    <p className="blogia-card-summary">{article.summary}</p>
                    <div className="blogia-card-tags">
                      {article.tags && article.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="blogia-tag">#{tag}</span>
                      ))}
                    </div>
                    <div className="blogia-card-meta">
                      <span className="blogia-card-date"><i className="fas fa-calendar-alt"></i> {formatDate(article.date)}</span>
                      <span className="blogia-card-author"><i className="fas fa-user"></i> {article.author}</span>
                    </div>
                    <a href={`/blog/${article.slug}.html`} className="blogia-btn blogia-btn-primary blogia-card-btn">
                      Leer más
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <nav className="blogia-pagination">
                <button
                  className="blogia-pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`blogia-pagination-btn${currentPage === page ? " active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="blogia-pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </nav>
            )}

            {/* Mensaje si no hay artículos */}
            {paginatedArticles.length === 0 && (
              <div className="blogia-no-articles">
                <div className="blogia-no-articles-icon"></div>
                <h3>No se encontraron artículos</h3>
                <p>Intenta con otros términos de búsqueda o categorías</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </BaseLayout>
  );
} 