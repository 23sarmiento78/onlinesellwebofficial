import React, { useState, useEffect } from "react";
import BaseLayout from "../layouts/BaseLayout";
import { Link } from "react-router-dom";
import "../BlogIA.css";
import { getArticlesFromHTML } from "../utils/getArticlesFromHTML";

export default function BlogIA() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(9);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await getArticlesFromHTML();
      setArticles(articles);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los artículos. Intenta recargar la página.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || 
                           article.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Paginación
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const categories = ["all", ...new Set(articles.map(article => article.category).filter(Boolean))];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset a primera página al buscar
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset a primera página al cambiar categoría
  };

  // Estadísticas
  const totalArticles = articles.length;
  const totalCategories = categories.length - 1; // Excluir "all"
  const averageArticlesPerCategory = totalCategories > 0 ? (totalArticles / totalCategories).toFixed(1) : 0;

  if (loading) {
    return (
      <BaseLayout title="Blog IA - Artículos Generados por Inteligencia Artificial" 
                  description="Descubre los últimos artículos sobre programación y desarrollo web generados por IA">
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
      <BaseLayout title="Blog IA - Error" description="Error al cargar el blog">
        <div className="container py-5">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h3>Error al cargar el blog</h3>
            <p className="text-muted mb-4">{error}</p>
            <button onClick={fetchArticles} className="btn btn-primary">
              <i className="fas fa-redo me-2"></i>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout title="Blog IA - Artículos Generados por Inteligencia Artificial" 
                description="Descubre los últimos artículos sobre programación y desarrollo web generados por IA">
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 fw-bold mb-3">
              🤖 Blog IA
            </h1>
            <p className="lead text-muted">
              Artículos sobre programación y desarrollo web generados por inteligencia artificial
            </p>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <div className="badge bg-primary fs-6">
                  <i className="fas fa-file-alt me-1"></i>
                  {totalArticles} artículos
                </div>
              </div>
              <div className="col-md-4">
                <div className="badge bg-success fs-6">
                  <i className="fas fa-tags me-1"></i>
                  {totalCategories} categorías
                </div>
              </div>
              <div className="col-md-4">
                <div className="badge bg-info fs-6">
                  <i className="fas fa-chart-line me-1"></i>
                  {averageArticlesPerCategory} por categoría
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row g-3">
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
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === "all" ? "Todas las categorías" : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {filteredArticles.length > 0 && (
          <div className="row mb-4">
            <div className="col-12 text-center">
              <p className="text-muted">
                Mostrando {currentArticles.length} de {filteredArticles.length} artículos
                {searchTerm && ` para "${searchTerm}"`}
                {selectedCategory !== "all" && ` en categoría "${selectedCategory}"`}
              </p>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h3>No se encontraron artículos</h3>
            <p className="text-muted">
              {searchTerm || selectedCategory !== "all" 
                ? "Intenta con otros términos de búsqueda o categorías"
                : "No hay artículos disponibles en este momento"}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="btn btn-outline-primary"
              >
                <i className="fas fa-times me-2"></i>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="row g-4">
              {currentArticles.map((article, index) => (
                <div key={article.slug || index} className="col-lg-4 col-md-6">
                  <div className="card h-100 shadow-sm hover-lift">
                    {article.image && (
                      <div className="card-img-top-container">
                        <img
                          src={article.image}
                          className="card-img-top"
                          alt={article.title}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <div className="mb-2">
                        {article.category && (
                          <span className="badge bg-secondary me-2">{article.category}</span>
                        )}
                        <small className="text-muted">
                          <i className="fas fa-calendar-alt me-1"></i>
                          {formatDate(article.date)}
                        </small>
                      </div>
                      
                      <h5 className="card-title fw-bold">{article.title}</h5>
                      
                      <p className="card-text text-muted flex-grow-1">
                        {article.summary}
                      </p>
                      
                      {article.tags && article.tags.length > 0 && (
                        <div className="mb-3">
                          {article.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="badge bg-light text-dark me-1">
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="badge bg-light text-dark">
                              +{article.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-auto">
                        <a 
                          href={`/blog/${article.htmlFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary w-100"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          Leer artículo completo
                        </a>
                      </div>
                    </div>
                    
                    <div className="card-footer bg-transparent border-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-user me-1"></i>
                          {article.author || 'hgaruna'}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {article.readingTime || 5} min
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="row mt-5">
                <div className="col-12">
                  <nav aria-label="Navegación de páginas">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                      </li>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="row mt-5">
          <div className="col-lg-8 mx-auto text-center">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              <strong>¿Sabías que?</strong> Estos artículos son generados automáticamente por inteligencia artificial 
              y se actualizan diariamente con el contenido más relevante sobre programación y desarrollo web.
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 