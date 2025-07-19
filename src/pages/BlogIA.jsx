import React, { useState, useEffect } from "react";
import BaseLayout from "../layouts/BaseLayout";
import { Link } from "react-router-dom";
import "../BlogIA.css";
import { getArticlesLocal } from "../utils/getArticlesLocal";

export default function BlogIA() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const articles = await getArticlesLocal();
      setArticles(articles);
    } catch (error) {
      console.error('Error:', error);
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

  const categories = ["all", ...new Set(articles.map(article => article.category).filter(Boolean))];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            <div className="badge bg-primary fs-6 mb-3">
              {articles.length} artículos disponibles
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
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
          </div>
        ) : (
          <div className="row g-4">
            {filteredArticles.map((article, index) => (
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
                      {article.summary || article.description || 
                       (article.content ? article.content.substring(0, 150) + '...' : '')}
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
                      <Link 
                        to={`/blog/${article.slug}`} 
                        className="btn btn-primary w-100"
                      >
                        <i className="fas fa-arrow-right me-2"></i>
                        Leer artículo completo
                      </Link>
                    </div>
                  </div>
                  
                  <div className="card-footer bg-transparent border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <i className="fas fa-user me-1"></i>
                        {article.author || 'hgaruna'}
                      </small>
                      <small className="text-muted">
                        <i className="fas fa-robot me-1"></i>
                        Generado por IA
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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