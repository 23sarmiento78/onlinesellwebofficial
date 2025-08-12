import React, { useState } from 'react';
import { AdSenseBanner, AdSenseInArticle } from '../components/AdSenseAd';
import { CodeGenerator, ColorPalette, LoremGenerator, JSONFormatter, Base64Tool, URLTool, HashTool, PasswordGenerator, RegexTester } from '../components/DeveloperTools';
import './DeveloperResources.css';

export default function DeveloperResources() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const categories = [
    'Todos', 'Editores', 'Herramientas', 'APIs', 'Librerías', 'Referencias', 'Comunidades', 'Cursos'
  ];

  const resources = [
    // Editores
    {
      id: 1,
      title: 'Visual Studio Code',
      description: 'Editor de código gratuito con extensiones potentes para desarrollo web.',
      url: 'https://code.visualstudio.com/',
      category: 'Editores',
      tags: ['Editor', 'Microsoft', 'Gratuito'],
      rating: 5,
      icon: 'fas fa-code',
      color: '#007ACC'
    },
    {
      id: 2,
      title: 'WebStorm',
      description: 'IDE profesional para JavaScript y frameworks modernos.',
      url: 'https://www.jetbrains.com/webstorm/',
      category: 'Editores',
      tags: ['IDE', 'JavaScript', 'Premium'],
      rating: 5,
      icon: 'fas fa-laptop-code',
      color: '#000000'
    },
    {
      id: 3,
      title: 'Sublime Text',
      description: 'Editor rápido y ligero con potentes características de edición.',
      url: 'https://www.sublimetext.com/',
      category: 'Editores',
      tags: ['Editor', 'Rápido', 'Ligero'],
      rating: 4,
      icon: 'fas fa-edit',
      color: '#FF9800'
    },

    // Herramientas
    {
      id: 4,
      title: 'GitHub',
      description: 'Plataforma de desarrollo colaborativo usando Git.',
      url: 'https://github.com/',
      category: 'Herramientas',
      tags: ['Git', 'Repositorio', 'Colaboración'],
      rating: 5,
      icon: 'fab fa-github',
      color: '#333333'
    },
    {
      id: 5,
      title: 'Figma',
      description: 'Herramienta de diseño colaborativo para interfaces.',
      url: 'https://figma.com/',
      category: 'Herramientas',
      tags: ['Diseño', 'UI/UX', 'Colaborativo'],
      rating: 5,
      icon: 'fab fa-figma',
      color: '#F24E1E'
    },
    {
      id: 6,
      title: 'Postman',
      description: 'Plataforma para desarrollo y testing de APIs.',
      url: 'https://www.postman.com/',
      category: 'Herramientas',
      tags: ['API', 'Testing', 'Desarrollo'],
      rating: 5,
      icon: 'fas fa-paper-plane',
      color: '#FF6C37'
    },
    {
      id: 7,
      title: 'Docker',
      description: 'Plataforma de contenedores para desarrollo y deployment.',
      url: 'https://www.docker.com/',
      category: 'Herramientas',
      tags: ['Contenedores', 'DevOps', 'Deployment'],
      rating: 5,
      icon: 'fab fa-docker',
      color: '#2496ED'
    },

    // APIs
    {
      id: 8,
      title: 'JSONPlaceholder',
      description: 'API REST gratuita para testing y prototipado.',
      url: 'https://jsonplaceholder.typicode.com/',
      category: 'APIs',
      tags: ['REST', 'Testing', 'Gratuito'],
      rating: 4,
      icon: 'fas fa-database',
      color: '#4CAF50'
    },
    {
      id: 9,
      title: 'OpenWeatherMap',
      description: 'API del clima con datos meteorológicos globales.',
      url: 'https://openweathermap.org/api',
      category: 'APIs',
      tags: ['Clima', 'Datos', 'Global'],
      rating: 4,
      icon: 'fas fa-cloud-sun',
      color: '#FF6B35'
    },
    {
      id: 10,
      title: 'Unsplash API',
      description: 'API gratuita con millones de fotos de alta calidad.',
      url: 'https://unsplash.com/developers',
      category: 'APIs',
      tags: ['Fotos', 'Imágenes', 'Gratuito'],
      rating: 5,
      icon: 'fas fa-camera',
      color: '#000000'
    },

    // Librerías
    {
      id: 11,
      title: 'React',
      description: 'Biblioteca de JavaScript para construir interfaces de usuario.',
      url: 'https://reactjs.org/',
      category: 'Librerías',
      tags: ['JavaScript', 'Frontend', 'Components'],
      rating: 5,
      icon: 'fab fa-react',
      color: '#61DAFB'
    },
    {
      id: 12,
      title: 'Vue.js',
      description: 'Framework progresivo para construir interfaces de usuario.',
      url: 'https://vuejs.org/',
      category: 'Librerías',
      tags: ['JavaScript', 'Frontend', 'Progressive'],
      rating: 5,
      icon: 'fab fa-vuejs',
      color: '#4FC08D'
    },
    {
      id: 13,
      title: 'Express.js',
      description: 'Framework web minimalista para Node.js.',
      url: 'https://expressjs.com/',
      category: 'Librerías',
      tags: ['Node.js', 'Backend', 'Framework'],
      rating: 5,
      icon: 'fab fa-node-js',
      color: '#339933'
    },
    {
      id: 14,
      title: 'Tailwind CSS',
      description: 'Framework de CSS utility-first para desarrollo r��pido.',
      url: 'https://tailwindcss.com/',
      category: 'Librerías',
      tags: ['CSS', 'Framework', 'Utility'],
      rating: 5,
      icon: 'fas fa-paint-brush',
      color: '#06B6D4'
    },

    // Referencias
    {
      id: 15,
      title: 'MDN Web Docs',
      description: 'Documentación web más completa y confiable.',
      url: 'https://developer.mozilla.org/',
      category: 'Referencias',
      tags: ['Documentación', 'Web', 'Mozilla'],
      rating: 5,
      icon: 'fab fa-firefox',
      color: '#FF7139'
    },
    {
      id: 16,
      title: 'DevDocs',
      description: 'Documentación de APIs en un solo lugar.',
      url: 'https://devdocs.io/',
      category: 'Referencias',
      tags: ['Documentación', 'API', 'Offline'],
      rating: 5,
      icon: 'fas fa-book',
      color: '#4A90E2'
    },
    {
      id: 17,
      title: 'Can I Use',
      description: 'Compatibilidad de características web en navegadores.',
      url: 'https://caniuse.com/',
      category: 'Referencias',
      tags: ['Compatibilidad', 'Navegadores', 'CSS'],
      rating: 5,
      icon: 'fas fa-globe',
      color: '#FF6B35'
    },

    // Comunidades
    {
      id: 18,
      title: 'Stack Overflow',
      description: 'La comunidad más grande de desarrolladores.',
      url: 'https://stackoverflow.com/',
      category: 'Comunidades',
      tags: ['Q&A', 'Comunidad', 'Ayuda'],
      rating: 5,
      icon: 'fab fa-stack-overflow',
      color: '#F48024'
    },
    {
      id: 19,
      title: 'GitHub Discussions',
      description: 'Foros de discusión para proyectos open source.',
      url: 'https://github.com/features/discussions',
      category: 'Comunidades',
      tags: ['GitHub', 'Open Source', 'Discusión'],
      rating: 4,
      icon: 'fab fa-github',
      color: '#333333'
    },
    {
      id: 20,
      title: 'Dev.to',
      description: 'Comunidad de desarrolladores para compartir y aprender.',
      url: 'https://dev.to/',
      category: 'Comunidades',
      tags: ['Blog', 'Comunidad', 'Aprendizaje'],
      rating: 5,
      icon: 'fab fa-dev',
      color: '#0A0A0A'
    },

    // Cursos
    {
      id: 21,
      title: 'freeCodeCamp',
      description: 'Plataforma gratuita para aprender programación.',
      url: 'https://freecodecamp.org/',
      category: 'Cursos',
      tags: ['Gratuito', 'Certificación', 'Completo'],
      rating: 5,
      icon: 'fab fa-free-code-camp',
      color: '#006400'
    },
    {
      id: 22,
      title: 'Codecademy',
      description: 'Cursos interactivos de programación paso a paso.',
      url: 'https://codecademy.com/',
      category: 'Cursos',
      tags: ['Interactivo', 'Paso a paso', 'Premium'],
      rating: 4,
      icon: 'fas fa-graduation-cap',
      color: '#1F4056'
    },
    {
      id: 23,
      title: 'Platzi',
      description: 'Plataforma de educación en tecnología en español.',
      url: 'https://platzi.com/',
      category: 'Cursos',
      tags: ['Español', 'Tecnología', 'Carrera'],
      rating: 5,
      icon: 'fas fa-laptop',
      color: '#98CA3F'
    }
  ];

  const featuredTools = [
    {
      title: 'Code Generator',
      description: 'Genera snippets de código para diferentes frameworks',
      icon: 'fas fa-magic',
      action: 'Usar Herramienta',
      modal: 'codeGenerator'
    },
    {
      title: 'Color Palette',
      description: 'Genera paletas de colores para tus proyectos',
      icon: 'fas fa-palette',
      action: 'Generar Colores',
      modal: 'colorPalette'
    },
    {
      title: 'Lorem Ipsum',
      description: 'Genera texto de prueba para tus mockups',
      icon: 'fas fa-text-height',
      action: 'Generar Texto',
      modal: 'loremGenerator'
    },
    {
      title: 'JSON Formatter',
      description: 'Formatea y valida archivos JSON',
      icon: 'fas fa-code',
      action: 'Formatear JSON',
      modal: 'jsonFormatter'
    },
    {
      title: 'Base64 Encoder',
      description: 'Codifica y decodifica texto en Base64',
      icon: 'fas fa-lock',
      action: 'Codificar/Decodificar',
      modal: 'base64Tool'
    },
    {
      title: 'URL Encoder',
      description: 'Codifica y decodifica URLs para navegadores',
      icon: 'fas fa-link',
      action: 'Codificar URL',
      modal: 'urlTool'
    },
    {
      title: 'Hash Generator',
      description: 'Genera hashes MD5, SHA-1 y SHA-256',
      icon: 'fas fa-fingerprint',
      action: 'Generar Hashes',
      modal: 'hashTool'
    },
    {
      title: 'Password Generator',
      description: 'Genera contraseñas seguras personalizables',
      icon: 'fas fa-key',
      action: 'Generar Contraseña',
      modal: 'passwordGenerator'
    },
    {
      title: 'Regex Tester',
      description: 'Prueba expresiones regulares en tiempo real',
      icon: 'fas fa-search',
      action: 'Probar Regex',
      modal: 'regexTester'
    }
  ];

  const quickLinks = [
    { title: 'Cheat Sheets', url: '#', icon: 'fas fa-file-alt' },
    { title: 'Code Snippets', url: '#', icon: 'fas fa-code' },
    { title: 'Design Patterns', url: '#', icon: 'fas fa-puzzle-piece' },
    { title: 'Best Practices', url: '#', icon: 'fas fa-star' },
    { title: 'Debugging Guide', url: '#', icon: 'fas fa-bug' },
    { title: 'Performance Tips', url: '#', icon: 'fas fa-tachometer-alt' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'Todos' || resource.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (category) => {
    if (category === 'Todos') return resources.length;
    return resources.filter(r => r.category === category).length;
  };

  return (
    <div className="resources-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid-background"></div>
        <div className="hero-content">
          <div className="hero-main">
            <h1 className="hero-title">
              <i className="fas fa-tools"></i>
              Recursos para Desarrolladores
            </h1>
            <p className="hero-description">
              Tu toolkit completo para desarrollo web. Herramientas, librerías, APIs y recursos 
              cuidadosamente seleccionados para potenciar tu productividad.
            </p>
            
            <div className="hero-search-container">
              <div className="hero-search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar herramientas, librerías, APIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="hero-search-input"
                />
                {searchTerm && (
                  <button 
                    className="hero-search-clear"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">{resources.length}+</span>
                <span className="hero-stat-label">Recursos</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">{categories.length - 1}</span>
                <span className="hero-stat-label">Categorías</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">Gratuito</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* Featured Tools */}
      <section className="featured-tools">
        <div className="container">
          <h2 className="section-title">
            <i className="fas fa-star"></i>
            Herramientas Destacadas
          </h2>
          
          <div className="tools-grid">
            {featuredTools.map((tool, index) => (
              <div key={index} className="tool-card">
                <div className="tool-icon">
                  <i className={tool.icon}></i>
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <button
                  className="tool-btn"
                  onClick={() => setActiveModal(tool.modal)}
                >
                  {tool.action}
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="adsense-container">
        <AdSenseBanner />
      </div>

{/* Categories Filter */}
      <section className="categories-filter">
        <div className="container">
          <div className="filter-header">
            <h2>Explorar por Categoría</h2>
            <p>Encuentra exactamente lo que necesitas</p>
          </div>
          
          <div className="categories-nav">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <span className="count">({getCategoryCount(category)})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="resources-content">
        <div className="container">
          <div className="results-header">
            <h3>
              {filteredResources.length} recurso{filteredResources.length !== 1 ? 's' : ''}
              {selectedCategory !== 'Todos' && ` en ${selectedCategory}`}
              {searchTerm && ` para "${searchTerm}"`}
            </h3>
          </div>

          {filteredResources.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search fa-3x"></i>
              <h3>No se encontraron recursos</h3>
              <p>
                {searchTerm 
                  ? `No hay recursos que coincidan con "${searchTerm}"`
                  : `No hay recursos en la categoría "${selectedCategory}"`
                }
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Todos');
                }}
              >
                Ver todos los recursos
              </button>
            </div>
          ) : (
            <div className="resources-grid">
              {filteredResources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <div 
                      className="resource-icon"
                      style={{ '--resource-color': resource.color }}
                    >
                      <i className={resource.icon}></i>
                    </div>
                    <div className="resource-category">
                      {resource.category}
                    </div>
                  </div>
                  
                  <div className="resource-content">
                    <h3 className="resource-title">{resource.title}</h3>
                    <p className="resource-description">{resource.description}</p>
                    
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="resource-rating">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < resource.rating ? 'filled' : ''}`}
                        ></i>
                      ))}
                      <span>({resource.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div className="resource-footer">
                    <a 
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link"
                    >
                      Visitar
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                </div>
              ))}
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
          <div className="cta-content">
            <h2>¿Quieres más recursos como estos?</h2>
            <p>Suscríbete y recibe herramientas y recursos nuevos cada semana</p>
            <div className="newsletter-form">
              <input type="email" placeholder="tu@email.com" />
              <button className="btn btn-primary">
                <i className="fas fa-rocket"></i>
                Suscribirse
              </button>
            </div>
            <p className="privacy-note">
              No spam. Solo recursos de calidad. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* Modales de Herramientas */}
      <CodeGenerator
        isOpen={activeModal === 'codeGenerator'}
        onClose={() => setActiveModal(null)}
      />
      <ColorPalette
        isOpen={activeModal === 'colorPalette'}
        onClose={() => setActiveModal(null)}
      />
      <LoremGenerator
        isOpen={activeModal === 'loremGenerator'}
        onClose={() => setActiveModal(null)}
      />
      <JSONFormatter
        isOpen={activeModal === 'jsonFormatter'}
        onClose={() => setActiveModal(null)}
      />
      <Base64Tool
        isOpen={activeModal === 'base64Tool'}
        onClose={() => setActiveModal(null)}
      />
      <URLTool
        isOpen={activeModal === 'urlTool'}
        onClose={() => setActiveModal(null)}
      />
      <HashTool
        isOpen={activeModal === 'hashTool'}
        onClose={() => setActiveModal(null)}
      />
      <PasswordGenerator
        isOpen={activeModal === 'passwordGenerator'}
        onClose={() => setActiveModal(null)}
      />
      <RegexTester
        isOpen={activeModal === 'regexTester'}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
