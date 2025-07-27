import React, { useEffect, useState } from "react";
import { getArticlesFromHTML } from "../utils/getArticlesFromHTML";

export default function RecursosYTips() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      const allArticles = await getArticlesFromHTML();
      // Seleccionar 3 artículos aleatorios
      const shuffled = allArticles.sort(() => 0.5 - Math.random());
      setArticles(shuffled.slice(0, 3));
    }
    fetchArticles();
  }, []);

  // Formatear fecha igual que BlogIA
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="resources-section">
      <div className="container">
        <h2 className="section-title">Recursos y Tips Gratuitos</h2>
        <p className="section-description">
          Consejos y recursos prácticos para mejorar tu presencia digital, seleccionados de nuestro blog.
        </p>
        <div className="blogia-feed-grid">
          {articles.map(article => (
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
      </div>
    </section>
  );
}
