import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AdSenseBanner, AdSenseInArticle } from '../components/AdSenseAd';
import { getBlogArticles } from '../utils/getBlogArticles2';

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        // Primero intentamos cargar el artículo específico directamente
        const response = await fetch(`${process.env.PUBLIC_URL}/blog/${slug}.html`);
        
        if (!response.ok) {
          // Si no se encuentra, cargamos todos los artículos y buscamos por slug
          const articles = await getBlogArticles();
          const foundArticle = articles.find(a => 
            a.filename === `${slug}.html` || 
            a.url.includes(slug) ||
            a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
          );
          
          if (foundArticle) {
            const articleResponse = await fetch(foundArticle.url);
            const html = await articleResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extraer el contenido principal
            const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body;
            const content = mainContent.innerHTML;
            
            setArticle({
              ...foundArticle,
              content: content || '<p>No se pudo cargar el contenido del artículo.</p>'
            });
          } else {
            setError('Artículo no encontrado');
          }
        } else {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Extraer metadatos
          const title = doc.querySelector('h1')?.textContent || slug.replace(/-/g, ' ');
          const date = doc.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
          const author = {
            name: doc.querySelector('[itemprop="author"]')?.textContent || 'Autor desconocido',
            avatar: doc.querySelector('.author-avatar')?.getAttribute('src') || '/logos-he-imagenes/author-default.jpg'
          };
          
          // Extraer el contenido principal
          const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body;
          const content = mainContent.innerHTML;
          
          setArticle({
            title,
            content,
            author,
            date,
            readTime: '5 min', // Podrías calcular esto basado en el contenido
            category: doc.querySelector('[itemprop="articleSection"]')?.textContent || 'Programación'
          });
        }
      } catch (err) {
        console.error('Error cargando el artículo:', err);
        setError('Error al cargar el artículo');
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div style={{padding: '100px', textAlign: 'center'}}>
        <div className="loading-spinner">
          <i className="fas fa-newspaper fa-spin"></i>
        </div>
        <p>Cargando artículo...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{padding: '100px', textAlign: 'center'}}>
        <h2>{error || 'Artículo no encontrado'}</h2>
        <p>El artículo que estás buscando no existe o no se pudo cargar.</p>
        <Link to="/articulos" className="btn btn-primary">
          <i className="fas fa-arrow-left"></i> Volver a artículos
        </Link>
      </div>
    );
  }

  return (
    <div className="article-detail" style={{maxWidth: '800px', margin: '0 auto', padding: '40px 20px'}}>
      <Link to="/articulos" className="back-link">
        <i className="fas fa-arrow-left"></i> Volver a artículos
      </Link>
      
      <article className="article-content">
        <header className="article-header">
          <div className="article-category">{article.category}</div>
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="author-info">
              <img 
                src={article.author.avatar} 
                alt={article.author.name}
                className="author-avatar"
              />
              <div>
                <div className="author-name">{article.author.name}</div>
                <div className="article-date">
                  <i className="far fa-calendar-alt"></i> {new Date(article.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  <span className="separator">•</span>
                  <i className="far fa-clock"></i> {article.readTime} de lectura
                </div>
              </div>
            </div>
            
            <div className="article-actions">
              <button className="btn btn-icon" aria-label="Compartir">
                <i className="fas fa-share-alt"></i>
              </button>
              <button className="btn btn-icon" aria-label="Guardar">
                <i className="far fa-bookmark"></i>
              </button>
            </div>
          </div>
          
          {article.image && (
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>
          )}
        </header>

        <AdSenseBanner />

        <div 
          className="article-body"
          dangerouslySetInnerHTML={{__html: article.content}}
        />

        <AdSenseInArticle />
        
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="article-footer">
          <div className="author-bio">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="author-avatar"
            />
            <div>
              <h3>Escrito por {article.author.name}</h3>
              <p>{article.author.bio || 'Autor en HGARUNA'}</p>
            </div>
          </div>
          
          <div className="article-cta">
            <h3>¿Te gustó este artículo?</h3>
            <p>Comparte tus pensamientos en los comentarios o difunde el conocimiento.</p>
            <div className="share-buttons">
              <button className="btn btn-twitter">
                <i className="fab fa-twitter"></i> Twitter
              </button>
              <button className="btn btn-facebook">
                <i className="fab fa-facebook-f"></i> Facebook
              </button>
              <button className="btn btn-linkedin">
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </button>
            </div>
          </div>
        </div>
      </article>
      
      <div className="related-articles">
        <h2>Artículos Relacionados</h2>
        <div className="related-grid">
          {/* Aquí podrías cargar artículos relacionados */}
          <div className="related-article">
            <div className="related-category">JavaScript</div>
            <h3>Guía de ES2024: Nuevas características</h3>
            <p>Descubre las últimas características de JavaScript que llegarán en 2024.</p>
            <Link to="/articulos/javascript-es2024" className="read-more">
              Leer más <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className="related-article">
            <div className="related-category">React</div>
            <h3>React 19: Novedades y mejoras</h3>
            <p>Todo lo que necesitas saber sobre la próxima versión de React.</p>
            <Link to="/articulos/react-19" className="read-more">
              Leer más <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
