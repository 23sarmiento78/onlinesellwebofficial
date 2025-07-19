import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BaseLayout from "../layouts/BaseLayout";
import { getArticlesFromHTML } from "../utils/getArticlesFromHTML";
import "../BlogIA.css";

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
      // Extraer categorías únicas
      const uniqueCategories = [...new Set(articles.map(article => article.category))];
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
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando artículos...</p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout title="Blog IA" description="Artículos sobre desarrollo web e inteligencia artificial">
        <div className="container py-5">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h2>Error al cargar artículos</h2>
            <p className="text-muted">{error}</p>
            <button onClick={fetchArticles} className="btn btn-primary">
              <i className="fas fa-redo me-2"></i>
              Reintentar
            </button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Blog IA" description="Artículos sobre desarrollo web e inteligencia artificial">
      <div className="container py-5">
        {/* Header del Blog */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center">
              <h1 className="display-4 fw-bold mb-3">
                <i className="fas fa-robot text-primary me-3"></i>
                Blog IA
              </h1>
              <p className="lead text-muted mb-4">
                Artículos generados por inteligencia artificial sobre desarrollo web, programación y tecnología
              </p>
            </div>
          </div>
        </div>

        <div className="blog-main-container">
          {/* Columna principal - Feed de artículos */}
          <div className="blog-feed">
            {/* Barra de búsqueda y filtros */}
            <div className="card mb-4 search-card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar artículos..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => handleCategoryClick(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed de artículos en cartas */}
            <div className="row">
              {paginatedArticles.map((article) => (
                <div key={article.slug} className="col-lg-6 col-md-6 mb-4">
                  <div className="card h-100 article-card shadow-sm">
                    {/* Imagen del artículo */}
                    <div className="card-img-top-container">
                      <img
                        src={article.image}
                        className="card-img-top"
                        alt={article.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-img-overlay">
                        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                          {article.category}
                        </span>
                        <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
                          <i className="fas fa-clock me-1"></i>
                          {article.readingTime} min
                        </span>
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column">
                      {/* Título */}
                      <h5 className="card-title fw-bold mb-2">
                        <Link to={`/articulos/${article.slug}`} className="text-decoration-none text-dark">
                          {article.title}
                        </Link>
                      </h5>

                      {/* Resumen */}
                      <p className="card-text text-muted flex-grow-1">
                        {article.summary}
                      </p>

                      {/* Tags */}
                      <div className="mb-3">
                        {article.tags && article.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta información */}
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-calendar-alt me-1"></i>
                          {formatDate(article.date)}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-user me-1"></i>
                          {article.author}
                        </small>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent border-top-0">
                      <Link 
                        to={`/articulos/${article.slug}`} 
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        <i className="fas fa-arrow-right me-2"></i>
                        Leer más
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <nav aria-label="Paginación de artículos" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* Mensaje si no hay artículos */}
            {paginatedArticles.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h3>No se encontraron artículos</h3>
                <p className="text-muted">
                  Intenta con otros términos de búsqueda o categorías
                </p>
              </div>
            )}
          </div>

          {/* Columna lateral - Categorías y tendencias */}
          <div className="blog-sidebar">
            {/* Categorías */}
            <div className="card mb-4 sidebar-card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-tags me-2"></i>
                  Categorías
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    className={`btn category-btn ${selectedCategory === "" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => handleCategoryClick("")}
                  >
                    <i className="fas fa-globe me-2"></i>
                    Todas las categorías
                    <span className="badge bg-light text-dark">{articles.length}</span>
                  </button>
                  {categories.map(category => {
                    const count = articles.filter(article => article.category === category).length;
                    return (
                      <button
                        key={category}
                        className={`btn category-btn ${selectedCategory === category ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <i className="fas fa-folder me-2"></i>
                        {category}
                        <span className="badge bg-light text-dark">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Temas de tendencia */}
            <div className="card mb-4 sidebar-card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-fire me-2"></i>
                  Temas de Tendencia
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush trending-list">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.tag} className="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                      <div>
                        <span className="badge bg-primary me-2">#{index + 1}</span>
                        <span className="fw-medium">{topic.tag}</span>
                      </div>
                      <span className="badge bg-secondary rounded-pill">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="card sidebar-card stats-card">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">
                  <i className="fas fa-chart-bar me-2"></i>
                  Estadísticas
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="border-end">
                      <h4 className="text-primary mb-0">{articles.length}</h4>
                      <small className="text-muted">Artículos</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <h4 className="text-success mb-0">{categories.length}</h4>
                    <small className="text-muted">Categorías</small>
                  </div>
                </div>
                <hr />
                <div className="text-center">
                  <h4 className="text-warning mb-0">{trendingTopics.length}</h4>
                  <small className="text-muted">Temas populares</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 