import React, { useState, useEffect } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { AdSenseBanner, AdSenseInArticle, AdSenseMatchedContent } from '../components/AdSenseAd';

export default function AprenderProgramacion() {
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [tutorials, setTutorials] = useState([]);
  const [featuredCourse, setFeaturedCourse] = useState(null);

  // Tutoriales destacados estilo periódico
  const tutorialData = [
    {
      id: 1,
      title: "JavaScript para Principiantes: Tu Primera Línea de Código",
      excerpt: "Comienza tu viaje en la programación con JavaScript. Aprende las bases de forma práctica y divertida.",
      image: "/logos-he-imagenes/js-beginners.jpg",
      category: "JavaScript",
      level: "Principiante",
      author: "Prof. Ana García",
      date: "Publicado hoy",
      readTime: "15 min",
      students: "2,847",
      rating: 4.9,
      featured: true,
      progress: 0,
      lessons: 12,
      difficulty: "Fácil"
    },
    {
      id: 2,
      title: "React desde Cero: Construye tu Primera Aplicación",
      excerpt: "Aprende React paso a paso creando una aplicación real. Desde componentes hasta hooks avanzados.",
      image: "/logos-he-imagenes/react-beginners.jpg",
      category: "React",
      level: "Intermedio",
      author: "Prof. Carlos Ruiz",
      date: "Hace 2 días",
      readTime: "45 min",
      students: "1,923",
      rating: 4.8,
      featured: false,
      progress: 0,
      lessons: 24,
      difficulty: "Medio"
    },
    {
      id: 3,
      title: "Python para Data Science: Análisis de Datos Real",
      excerpt: "Domina Python aplicado a ciencia de datos. Pandas, NumPy y visualizaciones que impresionan.",
      image: "/logos-he-imagenes/python-data.jpg",
      category: "Python",
      level: "Avanzado",
      author: "Dra. María Fernández",
      date: "Hace 3 días",
      readTime: "60 min",
      students: "1,456",
      rating: 4.9,
      featured: false,
      progress: 0,
      lessons: 18,
      difficulty: "Difícil"
    }
  ];

  // Categorías de aprendizaje
  const learningCategories = [
    { 
      name: "Todos los Niveles", 
      key: "todos", 
      icon: "fas fa-layer-group", 
      count: 342,
      color: "#6c5ce7",
      description: "Explora todo nuestro contenido educativo"
    },
    { 
      name: "Principiante", 
      key: "principiante", 
      icon: "fas fa-seedling", 
      count: 156,
      color: "#00b894",
      description: "Perfecto para empezar desde cero"
    },
    { 
      name: "Intermedio", 
      key: "intermedio", 
      icon: "fas fa-chart-line", 
      count: 124,
      color: "#fdcb6e",
      description: "Lleva tus habilidades al siguiente nivel"
    },
    { 
      name: "Avanzado", 
      key: "avanzado", 
      icon: "fas fa-rocket", 
      count: 62,
      color: "#e17055",
      description: "Para desarrolladores experimentados"
    }
  ];

  // Estadísticas de la academia
  const academyStats = [
    { number: "50,000+", label: "Estudiantes Activos", icon: "fas fa-user-graduate" },
    { number: "342", label: "Tutoriales Disponibles", icon: "fas fa-book" },
    { number: "95%", label: "Tasa de Completación", icon: "fas fa-trophy" },
    { number: "24/7", label: "Soporte Disponible", icon: "fas fa-headset" }
  ];

  // Testimonios de estudiantes
  const studentStories = [
    {
      name: "Laura Martínez",
      role: "Frontend Developer @ Google",
      story: "CodeDaily cambió mi carrera completamente. En 6 meses pasé de no saber nada a conseguir trabajo en una Big Tech.",
      image: "/logos-he-imagenes/student-1.jpg",
      before: "Contadora sin experiencia",
      after: "Frontend Developer",
      timeline: "6 meses"
    },
    {
      name: "Diego Herrera",
      role: "Full Stack Developer @ Spotify",
      story: "Los tutoriales son tan claros que cualquiera puede entender. Ahora trabajo en mi empresa soñada.",
      image: "/logos-he-imagenes/student-2.jpg",
      before: "Vendedor de seguros",
      after: "Full Stack Developer",
      timeline: "8 meses"
    }
  ];

  useEffect(() => {
    setTutorials(tutorialData);
    setFeaturedCourse(tutorialData[0]);
  }, []);

  const filteredTutorials = selectedLevel === 'todos' 
    ? tutorials 
    : tutorials.filter(tutorial => tutorial.level.toLowerCase() === selectedLevel);

  return (
    <BaseLayout
      title="Academia CodeDaily | Aprende Programación con Tutoriales Profesionales"
      description="La academia de programación más completa. Tutoriales paso a paso, proyectos reales y certificaciones reconocidas por la industria."
      keywords="academia programación, tutoriales código, cursos online programación, aprender javascript, curso react, python data science, certificación desarrollador"
    >
      {/* Breaking News for Education */}
      <section className="education-news-bar">
        <div className="container">
          <div className="news-ticker">
            <span className="news-label">
              <i className="fas fa-graduation-cap"></i>
              ACADEMIA
            </span>
            <div className="news-content">
              <span>🎉 Nuevo curso de TypeScript disponible | </span>
              <span>🚀 +1000 estudiantes certificados este mes | </span>
              <span>💼 85% de nuestros graduados consigue trabajo en 3 meses | </span>
              <span>🆓 Nuevos tutoriales gratuitos cada semana</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid-background"></div>
        <div className="hero-content">
          <div className="hero-main">
            <div className="hero-badge">
              <i className="fas fa-certificate"></i>
              ACADEMIA CERTIFICADA
            </div>
            <h1 className="hero-title">
              Conviértete en <span className="highlight">Desarrollador</span>
              <br />
              con la Academia #1
            </h1>
            <p className="hero-description">
              Más de 50,000 estudiantes han transformado sus carreras con nuestros 
              tutoriales paso a paso. Únete a la nueva generación de programadores.
            </p>
            
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">4.9</span>
                <div className="hero-stat-label">
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  Valoración estudiantes
                </div>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">85%</span>
                <span className="hero-stat-label">Consigue trabajo en 3 meses</span>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#cursos" className="hero-button primary">
                <i className="fas fa-play"></i>
                Comenzar Gratis
              </a>
              <a href="#testimonios" className="hero-button secondary">
                <i className="fas fa-users"></i>
                Ver Historias de Éxito
              </a>
            </div>

            <div className="hero-visual">
              <div className="code-editor-mockup">
                <div className="editor-header">
                  <div className="editor-buttons">
                    <span className="btn-close"></span>
                    <span className="btn-minimize"></span>
                    <span className="btn-maximize"></span>
                  </div>
                  <div className="editor-title">mi-primer-proyecto.js</div>
                </div>
                <div className="editor-content">
                  <div className="code-line">
                    <span className="line-number">1</span>
                    <span className="code">const estudiante = "Tu nombre aquí";</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">2</span>
                    <span className="code">console.log(`¡Hola ${estudiante}!`);</span>
                  </div>
                  <div className="code-line">
                    <span className="line-number">3</span>
                    <span className="code">// Tu viaje como dev comienza aquí 🚀</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* Academy Stats */}
      <section className="academy-stats">
        <div className="container">
          <div className="row">
            {academyStats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className={stat.icon}></i>
                  </div>
                  <div className="stat-content">
                    <h3>{stat.number}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              </div>
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

      {/* Featured Course */}
      {featuredCourse && (
        <section className="featured-course">
          <div className="container">
            <div className="featured-badge">CURSO DESTACADO DE HOY</div>
            <div className="course-card featured">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="course-image">
                    <img src={featuredCourse.image} alt={featuredCourse.title} />
                    <div className="course-overlay">
                      <button className="play-btn">
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="course-content">
                    <div className="course-meta">
                      <span className="category-badge">{featuredCourse.category}</span>
                      <span className="level-badge">{featuredCourse.level}</span>
                      <span className="new-badge">NUEVO</span>
                    </div>
                    <h2>{featuredCourse.title}</h2>
                    <p>{featuredCourse.excerpt}</p>
                    
                    <div className="course-details">
                      <div className="detail-item">
                        <i className="fas fa-clock"></i>
                        <span>{featuredCourse.readTime}</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-users"></i>
                        <span>{featuredCourse.students} estudiantes</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-book"></i>
                        <span>{featuredCourse.lessons} lecciones</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-star"></i>
                        <span>{featuredCourse.rating} valoración</span>
                      </div>
                    </div>

                    <div className="instructor-info">
                      <img src="/logos-he-imagenes/instructor-1.jpg" alt={featuredCourse.author} />
                      <div>
                        <h6>Instructor: {featuredCourse.author}</h6>
                        <small>Senior Developer con 10+ años de experiencia</small>
                      </div>
                    </div>

                    <div className="course-actions">
                      <a href={`/tutorial/${featuredCourse.id}`} className="btn-enroll-now">
                        <i className="fas fa-graduation-cap"></i>
                        Comenzar Curso Gratis
                      </a>
                      <button className="btn-save-later">
                        <i className="fas fa-bookmark"></i>
                        Guardar para después
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Learning Categories */}
      <section id="cursos" className="learning-categories">
        <div className="container">
          <div className="section-header">
            <h2>
              <i className="fas fa-graduation-cap"></i>
              Explora por Nivel
            </h2>
            <p>Encuentra el contenido perfecto para tu nivel actual</p>
          </div>

          <div className="categories-grid">
            {learningCategories.map((category, index) => (
              <div 
                key={index} 
                className={`category-card ${selectedLevel === category.key ? 'active' : ''}`}
                onClick={() => setSelectedLevel(category.key)}
              >
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  <i className={category.icon}></i>
                </div>
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <p>{category.description}</p>
                  <div className="category-stats">
                    <span className="tutorial-count">{category.count} tutoriales</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense In-Article */}
      <section className="ad-section">
        <div className="container">
          <AdSenseInArticle slot="5555555555" />
        </div>
      </section>

      {/* Tutorials Grid */}
      <section className="tutorials-grid">
        <div className="container">
          <div className="section-header">
            <h3>
              <i className="fas fa-book-open"></i>
              Tutoriales Recomendados
            </h3>
            <div className="filter-info">
              Mostrando {filteredTutorials.length} tutoriales para 
              <strong> {learningCategories.find(cat => cat.key === selectedLevel)?.name}</strong>
            </div>
          </div>

          <div className="tutorials-container">
            {filteredTutorials.map((tutorial, index) => (
              <div key={index} className="tutorial-card">
                <div className="tutorial-image">
                  <img src={tutorial.image} alt={tutorial.title} />
                  <div className="tutorial-overlay">
                    <div className="play-button">
                      <i className="fas fa-play"></i>
                    </div>
                  </div>
                  <div className="tutorial-badges">
                    <span className="level-badge">{tutorial.level}</span>
                    <span className="category-badge">{tutorial.category}</span>
                  </div>
                </div>
                
                <div className="tutorial-content">
                  <div className="tutorial-meta">
                    <span className="author">
                      <i className="fas fa-user"></i>
                      {tutorial.author}
                    </span>
                    <span className="date">{tutorial.date}</span>
                  </div>
                  
                  <h4>{tutorial.title}</h4>
                  <p>{tutorial.excerpt}</p>
                  
                  <div className="tutorial-stats">
                    <div className="stat">
                      <i className="fas fa-clock"></i>
                      <span>{tutorial.readTime}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-users"></i>
                      <span>{tutorial.students}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-star"></i>
                      <span>{tutorial.rating}</span>
                    </div>
                    <div className="stat">
                      <i className="fas fa-book"></i>
                      <span>{tutorial.lessons} lecciones</span>
                    </div>
                  </div>

                  <div className="tutorial-actions">
                    <a href={`/tutorial/${tutorial.id}`} className="btn-start-tutorial">
                      Comenzar Tutorial
                    </a>
                    <button className="btn-preview">
                      <i className="fas fa-eye"></i>
                      Vista previa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section id="testimonios" className="success-stories">
        <div className="container">
          <div className="section-header">
            <h2>
              <i className="fas fa-trophy"></i>
              Historias de Éxito
            </h2>
            <p>Conoce a algunos de nuestros graduados que han transformado sus carreras</p>
          </div>

          <div className="stories-grid">
            {studentStories.map((story, index) => (
              <div key={index} className="story-card">
                <div className="story-header">
                  <img src={story.image} alt={story.name} />
                  <div className="story-info">
                    <h5>{story.name}</h5>
                    <p>{story.role}</p>
                  </div>
                </div>
                
                <div className="transformation">
                  <div className="before-after">
                    <div className="before">
                      <span className="label">Antes:</span>
                      <span className="value">{story.before}</span>
                    </div>
                    <div className="arrow">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="after">
                      <span className="label">Después:</span>
                      <span className="value">{story.after}</span>
                    </div>
                  </div>
                  <div className="timeline">
                    <i className="fas fa-clock"></i>
                    <span>En solo {story.timeline}</span>
                  </div>
                </div>
                
                <blockquote>
                  "{story.story}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom AdSense */}
      <section className="ad-section">
        <div className="container">
          <AdSenseMatchedContent slot="7777777777" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="academy-cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para Cambiar tu Futuro?</h2>
            <p>
              Únete a los miles de desarrolladores que han transformado sus carreras 
              con CodeDaily Academy. Tu futuro en tech comienza hoy.
            </p>
            <div className="cta-actions">
              <a href="#cursos" className="btn-start-now">
                <i className="fas fa-rocket"></i>
                Comenzar Mi Viaje Gratis
              </a>
              <a href="/contact" className="btn-talk-advisor">
                <i className="fas fa-comments"></i>
                Hablar con un Asesor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        .education-news-bar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 0;
          overflow: hidden;
        }
        
        .news-ticker {
          display: flex;
          align-items: center;
        }
        
        .news-label {
          background: rgba(255,255,255,0.2);
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          margin-right: 20px;
          white-space: nowrap;
        }
        
        .news-content {
          display: flex;
          animation: scroll 45s linear infinite;
        }
        
        .news-content span {
          margin-right: 50px;
          white-space: nowrap;
        }
        
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .academy-hero {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }
        
        .academy-hero::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 50%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(102,126,234,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.5;
        }
        
        .hero-badge {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .academy-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 25px;
          color: #2d3436;
        }
        
        .highlight {
          background: linear-gradient(135deg, #00ff41, #00cc33);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .academy-subtitle {
          font-size: 1.2rem;
          color: #636e72;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        
        .hero-stats {
          display: flex;
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #00ff41;
          display: block;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #636e72;
        }
        
        .stars {
          color: #f39c12;
          margin-bottom: 5px;
        }
        
        .hero-actions {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .btn-start-learning,
        .btn-start-now {
          background: linear-gradient(135deg, #00ff41, #00cc33);
          color: #000;
          padding: 15px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);
        }
        
        .btn-start-learning:hover,
        .btn-start-now:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 65, 0.4);
          text-decoration: none;
          color: #000;
        }
        
        .btn-see-stories,
        .btn-talk-advisor {
          background: transparent;
          color: #636e72;
          padding: 15px 30px;
          border: 2px solid #ddd;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        
        .btn-see-stories:hover,
        .btn-talk-advisor:hover {
          border-color: #00ff41;
          color: #00ff41;
          text-decoration: none;
        }
        
        .code-editor-mockup {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          margin-left: 50px;
        }
        
        .editor-header {
          background: #2d2d2d;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .editor-buttons {
          display: flex;
          gap: 8px;
        }
        
        .editor-buttons span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        .btn-close { background: #ff5f56; }
        .btn-minimize { background: #ffbd2e; }
        .btn-maximize { background: #27ca3f; }
        
        .editor-title {
          color: #fff;
          font-size: 0.9rem;
        }
        
        .editor-content {
          padding: 20px;
          font-family: 'Monaco', 'Consolas', monospace;
        }
        
        .code-line {
          display: flex;
          margin-bottom: 10px;
        }
        
        .line-number {
          color: #666;
          margin-right: 20px;
          width: 20px;
        }
        
        .code {
          color: #fff;
        }
        
        .academy-stats {
          padding: 60px 0;
          background: #fff;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
          border-left: 4px solid #00ff41;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #00ff41, #00cc33);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 1.5rem;
        }
        
        .stat-content h3 {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          color: #2d3436;
        }
        
        .stat-content p {
          margin: 0;
          color: #636e72;
          font-weight: 500;
        }
        
        .featured-course {
          padding: 60px 0;
          background: #f8f9fa;
        }
        
        .featured-badge {
          background: #ff0000;
          color: white;
          padding: 8px 20px;
          font-size: 0.85rem;
          font-weight: bold;
          margin-bottom: 30px;
          display: inline-block;
          letter-spacing: 1px;
        }
        
        .course-card.featured {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border: 3px solid #00ff41;
        }
        
        .course-image {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .course-image img {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }
        
        .course-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .course-image:hover .course-overlay {
          opacity: 1;
        }
        
        .play-btn {
          width: 60px;
          height: 60px;
          background: #00ff41;
          border: none;
          border-radius: 50%;
          color: #000;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .play-btn:hover {
          transform: scale(1.1);
        }
        
        .course-meta {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .category-badge,
        .level-badge,
        .new-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .category-badge {
          background: #667eea;
          color: white;
        }
        
        .level-badge {
          background: #00ff41;
          color: #000;
        }
        
        .new-badge {
          background: #ff0000;
          color: white;
        }
        
        .course-details {
          display: flex;
          gap: 20px;
          margin: 20px 0;
          flex-wrap: wrap;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #636e72;
          font-size: 0.9rem;
        }
        
        .instructor-info {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 25px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .instructor-info img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .instructor-info h6 {
          margin: 0;
          color: #2d3436;
        }
        
        .instructor-info small {
          color: #636e72;
        }
        
        .course-actions {
          display: flex;
          gap: 15px;
          margin-top: 25px;
          flex-wrap: wrap;
        }
        
        .btn-enroll-now {
          background: linear-gradient(135deg, #00ff41, #00cc33);
          color: #000;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .btn-enroll-now:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 65, 0.3);
          text-decoration: none;
          color: #000;
        }
        
        .btn-save-later {
          background: transparent;
          border: 2px solid #ddd;
          color: #636e72;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .btn-save-later:hover {
          border-color: #00ff41;
          color: #00ff41;
        }
        
        .learning-categories {
          padding: 60px 0;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .section-header h2,
        .section-header h3 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2d3436;
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: #636e72;
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .category-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          border: 2px solid #eee;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .category-card:hover,
        .category-card.active {
          border-color: #00ff41;
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .category-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          font-size: 2rem;
        }
        
        .category-info h4 {
          margin-bottom: 10px;
          color: #2d3436;
        }
        
        .category-info p {
          color: #636e72;
          margin-bottom: 15px;
        }
        
        .tutorial-count {
          background: #00ff41;
          color: #000;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
        }
        
        .tutorials-grid {
          padding: 60px 0;
          background: #f8f9fa;
        }
        
        .filter-info {
          color: #636e72;
          font-size: 1rem;
        }
        
        .tutorials-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }
        
        .tutorial-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        
        .tutorial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        
        .tutorial-image {
          position: relative;
          overflow: hidden;
        }
        
        .tutorial-image img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .tutorial-card:hover .tutorial-image img {
          transform: scale(1.05);
        }
        
        .tutorial-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .tutorial-card:hover .tutorial-overlay {
          opacity: 1;
        }
        
        .play-button {
          width: 50px;
          height: 50px;
          background: #00ff41;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-size: 1.2rem;
        }
        
        .tutorial-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 5px;
        }
        
        .tutorial-content {
          padding: 25px;
        }
        
        .tutorial-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 0.85rem;
          color: #636e72;
        }
        
        .tutorial-content h4 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #2d3436;
          line-height: 1.3;
        }
        
        .tutorial-content p {
          color: #636e72;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .tutorial-stats {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .stat {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.85rem;
          color: #636e72;
        }
        
        .tutorial-actions {
          display: flex;
          gap: 10px;
        }
        
        .btn-start-tutorial {
          flex: 1;
          background: #00ff41;
          color: #000;
          padding: 10px;
          border-radius: 6px;
          text-decoration: none;
          text-align: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .btn-start-tutorial:hover {
          background: #00cc33;
          text-decoration: none;
          color: #000;
        }
        
        .btn-preview {
          background: transparent;
          border: 1px solid #ddd;
          color: #636e72;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-preview:hover {
          border-color: #00ff41;
          color: #00ff41;
        }
        
        .success-stories {
          padding: 80px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .success-stories .section-header h2 {
          color: white;
        }
        
        .success-stories .section-header p {
          color: rgba(255,255,255,0.8);
        }
        
        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
        }
        
        .story-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .story-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
        }
        
        .story-header img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(255,255,255,0.3);
        }
        
        .story-info h5 {
          margin: 0;
          color: white;
        }
        
        .story-info p {
          margin: 0;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
        }
        
        .transformation {
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .before-after {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        
        .before,
        .after {
          flex: 1;
          min-width: 120px;
        }
        
        .before .label,
        .after .label {
          display: block;
          font-size: 0.8rem;
          opacity: 0.8;
          margin-bottom: 5px;
        }
        
        .before .value,
        .after .value {
          font-weight: bold;
          color: #00ff41;
        }
        
        .arrow {
          color: #00ff41;
          font-size: 1.2rem;
        }
        
        .timeline {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
        }
        
        blockquote {
          font-style: italic;
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
        }
        
        .academy-cta {
          padding: 80px 0;
          background: #2d3436;
          color: white;
          text-align: center;
        }
        
        .cta-content h2 {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        
        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          color: rgba(255,255,255,0.8);
        }
        
        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .ad-section {
          padding: 30px 0;
          text-align: center;
          background: #f8f9fa;
        }
        
        @media (max-width: 768px) {
          .academy-title {
            font-size: 2.5rem;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 15px;
          }
          
          .hero-actions {
            justify-content: center;
          }
          
          .code-editor-mockup {
            margin-left: 0;
            margin-top: 40px;
          }
          
          .categories-grid {
            grid-template-columns: 1fr;
          }
          
          .tutorials-container {
            grid-template-columns: 1fr;
          }
          
          .stories-grid {
            grid-template-columns: 1fr;
          }
          
          .before-after {
            flex-direction: column;
            gap: 10px;
          }
          
          .arrow {
            transform: rotate(90deg);
          }
          
          .cta-content h2 {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </BaseLayout>
  );
}
