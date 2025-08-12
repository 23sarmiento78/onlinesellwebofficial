import React, { useState, useEffect } from 'react';
import { AdSenseBanner, AdSenseInArticle } from '../components/AdSenseAd';
import './EbookPage.css';

export default function EbookPage() {
  const [currentEbook, setCurrentEbook] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadForm, setDownloadForm] = useState({ email: '', name: '', downloaded: false });
  const [testimonials] = useState([
    {
      id: 1,
      name: "Carlos Rodríguez",
      role: "Frontend Developer",
      text: "Este eBook cambió completamente mi forma de programar en JavaScript. Los ejemplos son increíbles y muy prácticos.",
      rating: 5,
      image: "/logos-he-imagenes/testimonial-1.jpg"
    },
    {
      id: 2,
      name: "María González",
      role: "Full Stack Developer",
      text: "La mejor inversión que he hecho en mi carrera. El contenido es súper actualizado y fácil de seguir.",
      rating: 5,
      image: "/logos-he-imagenes/testimonial-2.jpg"
    },
    {
      id: 3,
      name: "Luis Torres",
      role: "React Developer",
      text: "Pasé de junior a senior aplicando las técnicas de este eBook. ¡Totalmente recomendado!",
      rating: 5,
      image: "/logos-he-imagenes/testimonial-3.jpg"
    }
  ]);

  // eBook principal destacado
  const featuredEbook = {
    id: 1,
    title: "JavaScript Moderno 2024: Guía Completa para Desarrolladores",
    subtitle: "Desde ES6 hasta las últimas funcionalidades",
    description: "Domina JavaScript moderno con esta guía definitiva que cubre desde conceptos básicos hasta técnicas avanzadas. Incluye proyectos reales, ejercicios prácticos y las mejores prácticas de la industria.",
    image: "/logos-he-imagenes/ebook-javascript-2024.jpg",
    author: "hgaruna.com",
    pages: 250,
    chapters: 8,
    language: "Español",
    format: ["PDF", "EPUB", "HTML"],
    lastUpdated: "2024-01-15",
    rating: 4.9,
    downloads: "12,458",
    price: {
      original: 39.99,
      current: 19.99,
      currency: "USD"
    },
    features: [
      "8 capítulos completos con contenido actualizado",
      "50+ ejemplos de código prácticos",
      "Proyectos reales paso a paso",
      "Ejercicios con soluciones detalladas",
      "Código fuente de todos los ejemplos",
      "Actualizaciones gratuitas de por vida",
      "Acceso a comunidad privada de desarrolladores",
      "Certificado de finalización",
      "Soporte por email",
      "30 días de garantía"
    ],
    whatYouLearn: [
      "ES6+ características esenciales y sintaxis moderna",
      "Programación asíncrona con Promises y Async/Await",
      "Módulos ES6 y sistemas de bundling modernos",
      "Testing avanzado con Jest y herramientas modernas",
      "Optimización de performance y mejores prácticas",
      "Frameworks modernos y ecosistema JavaScript",
      "Patrones de diseño aplicados a JavaScript",
      "Técnicas de debugging y herramientas de desarrollo"
    ],
    tableOfContents: [
      {
        chapter: 1,
        title: "Introducción a JavaScript Moderno",
        duration: "45 min",
        topics: ["Historia de JavaScript", "ES6+ Overview", "Configuración del entorno"]
      },
      {
        chapter: 2,
        title: "ES6+ Características Esenciales",
        duration: "60 min",
        topics: ["Let, const y scope", "Arrow functions", "Template literals", "Destructuring"]
      },
      {
        chapter: 3,
        title: "Programación Asíncrona Avanzada",
        duration: "90 min",
        topics: ["Promises en profundidad", "Async/Await mastery", "Manejo de errores"]
      },
      {
        chapter: 4,
        title: "Módulos y Bundlers Modernos",
        duration: "75 min",
        topics: ["ES6 Modules", "Webpack", "Vite", "Rollup"]
      },
      {
        chapter: 5,
        title: "Testing y Depuración",
        duration: "80 min",
        topics: ["Jest testing", "Unit tests", "Integration tests", "Debugging tools"]
      },
      {
        chapter: 6,
        title: "Optimización y Performance",
        duration: "70 min",
        topics: ["Performance API", "Memory management", "Code splitting", "Lazy loading"]
      },
      {
        chapter: 7,
        title: "Frameworks y Librerías",
        duration: "85 min",
        topics: ["React avanzado", "Vue.js", "Angular", "Comparativas"]
      },
      {
        chapter: 8,
        title: "Mejores Prácticas y Patrones",
        duration: "65 min",
        topics: ["Design patterns", "Clean code", "SOLID principles", "Arquitectura"]
      }
    ],
    bonus: [
      "Plantillas de proyecto listas para usar",
      "Cheat sheets de referencia rápida",
      "Video tutoriales complementarios",
      "Webinar en vivo mensual",
      "Grupo de Telegram exclusivo"
    ]
  };

  useEffect(() => {
    setCurrentEbook(featuredEbook);
  }, []);

  const handleDownloadFree = (e) => {
    e.preventDefault();
    if (downloadForm.email && downloadForm.name) {
      setDownloadForm({ ...downloadForm, downloaded: true });
      // Aquí se implementaría el envío del email
      setTimeout(() => {
        // Simular descarga
        const link = document.createElement('a');
        link.href = '/ebooks/javascript-moderno-gratis.pdf';
        link.download = 'JavaScript-Moderno-2024-Muestra-Gratis.pdf';
        link.click();
      }, 1000);
    }
  };

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(
      `¡Hola! Estoy interesado en el eBook "${currentEbook?.title}". ¿Podrían darme más información sobre la versión completa?`
    );
    window.open(`https://wa.me/5491234567890?text=${message}`, '_blank');
  };

  if (!currentEbook) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="ebook-page">
      {/* Hero Section con libro 3D */}
      <section className="ebook-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="ebook-badge">
                <i className="fas fa-star"></i>
                eBook Más Descargado
              </div>
              <h1 className="ebook-title">{currentEbook.title}</h1>
              <p className="ebook-subtitle">{currentEbook.subtitle}</p>
              <p className="ebook-description">{currentEbook.description}</p>
              
              <div className="ebook-meta">
                <div className="meta-item">
                  <i className="fas fa-file-pdf"></i>
                  <span>{currentEbook.pages} páginas</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-list"></i>
                  <span>{currentEbook.chapters} capítulos</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-language"></i>
                  <span>{currentEbook.language}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-download"></i>
                  <span>{currentEbook.downloads} descargas</span>
                </div>
              </div>

              <div className="rating-section">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < Math.floor(currentEbook.rating) ? 'filled' : ''}`}></i>
                  ))}
                </div>
                <span className="rating-text">{currentEbook.rating}/5</span>
                <span className="rating-count">(2,847 reseñas)</span>
              </div>

              <div className="cta-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowPreview(true)}
                >
                  <i className="fas fa-eye"></i>
                  Vista Previa Gratis
                </button>
                <button 
                  className="btn btn-whatsapp"
                  onClick={handleContactWhatsApp}
                >
                  <i className="fab fa-whatsapp"></i>
                  Versión Completa
                </button>
              </div>

              <div className="trust-indicators">
                <div className="trust-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>30 días de garantía</span>
                </div>
                <div className="trust-item">
                  <i className="fas fa-sync"></i>
                  <span>Actualizaciones gratuitas</span>
                </div>
                <div className="trust-item">
                  <i className="fas fa-support"></i>
                  <span>Soporte incluido</span>
                </div>
              </div>
            </div>

            <div className="hero-book">
              <div className="book-3d-container">
                <div className="book-3d">
                  <div className="book-cover">
                    <div className="book-spine"></div>
                    <div className="book-front">
                      <div className="book-title">JavaScript</div>
                      <div className="book-subtitle">Moderno 2024</div>
                      <div className="book-author">hgaruna.com</div>
                      <div className="book-icon">
                        <i className="fab fa-js-square"></i>
                      </div>
                      <div className="book-edition">Guía Completa</div>
                    </div>
                  </div>
                  <div className="floating-elements">
                    <div className="code-float">{ }</div>
                    <div className="arrow-float">⇒</div>
                    <div className="star-float">★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="adsense-container">
        <AdSenseBanner />
      </div>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Elige tu Versión</h2>
            <p className="section-subtitle">Empieza gratis o accede al contenido completo</p>
          </div>

          <div className="pricing-cards">
            {/* Versión Gratuita */}
            <div className="pricing-card free">
              <div className="card-header">
                <h3 className="card-title">Versión Gratuita</h3>
                <div className="card-price">
                  <span className="price">$0</span>
                  <span className="period">Gratis</span>
                </div>
              </div>
              <div className="card-content">
                <ul className="features-list">
                  <li><i className="fas fa-check"></i>Primeros 3 capítulos completos</li>
                  <li><i className="fas fa-check"></i>Introducción y conceptos básicos</li>
                  <li><i className="fas fa-check"></i>Algunos ejemplos de código</li>
                  <li><i className="fas fa-check"></i>Acceso inmediato por email</li>
                  <li><i className="fas fa-times"></i>Capítulos avanzados</li>
                  <li><i className="fas fa-times"></i>Proyectos completos</li>
                  <li><i className="fas fa-times"></i>Código fuente</li>
                  <li><i className="fas fa-times"></i>Actualizaciones</li>
                </ul>
                
                {downloadForm.downloaded ? (
                  <div className="download-success">
                    <i className="fas fa-check-circle"></i>
                    <p>¡Descarga iniciada!</p>
                    <p className="small">Revisa tu email para el enlace de descarga</p>
                  </div>
                ) : (
                  <form onSubmit={handleDownloadFree} className="download-form">
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={downloadForm.name}
                      onChange={(e) => setDownloadForm({...downloadForm, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Tu email"
                      value={downloadForm.email}
                      onChange={(e) => setDownloadForm({...downloadForm, email: e.target.value})}
                      required
                    />
                    <button type="submit" className="btn btn-free">
                      <i className="fas fa-download"></i>
                      Descargar Gratis
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Versión Completa */}
            <div className="pricing-card premium">
              <div className="popular-badge">
                <i className="fas fa-crown"></i>
                Más Popular
              </div>
              <div className="card-header">
                <h3 className="card-title">Versión Completa</h3>
                <div className="card-price">
                  <span className="price-original">${currentEbook.price.original}</span>
                  <span className="price">${currentEbook.price.current}</span>
                  <span className="period">Oferta limitada</span>
                </div>
                <div className="savings">
                  Ahorras ${(currentEbook.price.original - currentEbook.price.current).toFixed(2)}
                </div>
              </div>
              <div className="card-content">
                <ul className="features-list">
                  {currentEbook.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className="btn btn-premium"
                  onClick={handleContactWhatsApp}
                >
                  <i className="fab fa-whatsapp"></i>
                  Obtener por WhatsApp
                </button>
                
                <div className="payment-info">
                  <p className="small">
                    <i className="fas fa-info-circle"></i>
                    Contacta por WhatsApp para métodos de pago seguros
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="learning-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-graduation-cap"></i>
              Lo que Aprenderás
            </h2>
            <p className="section-subtitle">Habilidades que transformarán tu carrera como desarrollador</p>
          </div>

          <div className="learning-grid">
            {currentEbook.whatYouLearn.map((skill, index) => (
              <div key={index} className="learning-item">
                <div className="learning-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <p>{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="toc-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-list"></i>
              Contenido del eBook
            </h2>
            <p className="section-subtitle">8 capítulos estructurados para tu aprendizaje progresivo</p>
          </div>

          <div className="toc-list">
            {currentEbook.tableOfContents.map((chapter, index) => (
              <div key={index} className="toc-item">
                <div className="chapter-header">
                  <div className="chapter-number">
                    Capítulo {chapter.chapter}
                  </div>
                  <div className="chapter-info">
                    <h3 className="chapter-title">{chapter.title}</h3>
                    <div className="chapter-duration">
                      <i className="fas fa-clock"></i>
                      {chapter.duration}
                    </div>
                  </div>
                  <div className="chapter-status">
                    {chapter.chapter <= 3 ? (
                      <span className="free-badge">Gratis</span>
                    ) : (
                      <span className="premium-badge">Premium</span>
                    )}
                  </div>
                </div>
                <div className="chapter-topics">
                  {chapter.topics.map((topic, topicIndex) => (
                    <span key={topicIndex} className="topic-tag">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense In-Article */}
      <div className="adsense-container">
        <AdSenseInArticle />
      </div>

      {/* Bonus Content */}
      <section className="bonus-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-gift"></i>
              Contenido Bonus Incluido
            </h2>
            <p className="section-subtitle">Valor agregado exclusivo para maximizar tu aprendizaje</p>
          </div>

          <div className="bonus-grid">
            {currentEbook.bonus.map((bonus, index) => (
              <div key={index} className="bonus-item">
                <div className="bonus-icon">
                  <i className="fas fa-star"></i>
                </div>
                <h3>{bonus}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-comments"></i>
              Lo que Dicen Nuestros Lectores
            </h2>
            <p className="section-subtitle">Miles de desarrolladores han transformado sus carreras</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para Llevar tu JavaScript al Siguiente Nivel?</h2>
            <p>Únete a más de 12,000 desarrolladores que ya transformaron sus carreras</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => setShowPreview(true)}
              >
                <i className="fas fa-eye"></i>
                Comenzar con Versión Gratis
              </button>
              <button 
                className="btn btn-whatsapp btn-large"
                onClick={handleContactWhatsApp}
              >
                <i className="fab fa-whatsapp"></i>
                Obtener Versión Completa
              </button>
            </div>
            <p className="cta-guarantee">
              <i className="fas fa-shield-alt"></i>
              Garantía de 30 días - Si no estás satisfecho, te devolvemos tu dinero
            </p>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Vista Previa - Capítulo 1</h3>
              <button className="close-btn" onClick={() => setShowPreview(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="preview-body">
              <h4>1. Introducción a JavaScript Moderno</h4>
              <p>JavaScript ha evolucionado tremendamente desde sus inicios en 1995. Lo que comenzó como un simple lenguaje de scripting para añadir interactividad básica a las páginas web, se ha convertido en uno de los lenguajes de programación más versátiles y poderosos del mundo.</p>
              
              <h5>¿Por qué JavaScript Moderno?</h5>
              <p>Con la introducción de ES6 (ECMAScript 2015) y las subsecuentes actualizaciones anuales, JavaScript ha incorporado características que lo hacen más poderoso, expresivo y fácil de mantener:</p>
              
              <ul>
                <li><strong>Sintaxis más limpia:</strong> Arrow functions, destructuring, template literals</li>
                <li><strong>Mejor gestión de datos:</strong> Promises, async/await</li>
                <li><strong>Programación orientada a objetos mejorada:</strong> Classes, módulos ES6</li>
                <li><strong>Herramientas avanzadas:</strong> Nuevos métodos para arrays, objetos y strings</li>
              </ul>

              <div className="code-example">
                <h6>Ejemplo: Before vs After ES6</h6>
                <pre><code>{`// Antes de ES6
function createUser(name, email) {
  return {
    name: name,
    email: email,
    greet: function() {
      return 'Hola, soy ' + this.name;
    }
  };
}

// Con ES6+
const createUser = (name, email) => ({
  name,
  email,
  greet() {
    return \`Hola, soy \${this.name}\`;
  }
});`}</code></pre>
              </div>

              <p><em>Este es solo el comienzo. La versión completa incluye 7 capítulos más con contenido avanzado, proyectos prácticos y ejercicios detallados.</em></p>
            </div>
            <div className="preview-footer">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowPreview(false);
                  document.querySelector('.download-form input[type="email"]')?.focus();
                }}
              >
                Descargar Versión Gratuita
              </button>
              <button 
                className="btn btn-whatsapp"
                onClick={() => {
                  setShowPreview(false);
                  handleContactWhatsApp();
                }}
              >
                Obtener Versión Completa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
