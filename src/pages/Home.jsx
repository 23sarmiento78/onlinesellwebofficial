import React from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '@components/Hero'

export default function Home() {
  const heroProps = {
    badge: {
      icon: 'fas fa-rocket',
      text: 'Tu presencia digital comienza aquí'
    },
    title: (
      <>
        <span className="highlight">hgaruna</span> Digital
        <br />
        Tecnología y <span className="highlight">Desarrollo</span>
      </>
    ),
    subtitle: 'Tu fuente confiable de noticias, tutoriales y tendencias sobre desarrollo web, tecnología y programación. Mantente actualizado con el mundo digital desde Villa Carlos Paz.',
    backgroundVideo: '/5377684-uhd_3840_2160_25fps.mp4',
    backgroundImage: '/logos-he-imagenes/fondo-hero.jpg',
    variant: 'fullscreen',
    animated: true,
    showFloatingElements: true,
    showParticles: true,
    ctas: [
      {
        href: '/blog',
        className: 'cta-button primary',
        icon: 'fas fa-newspaper',
        text: 'Explorar Artículos'
      },
      {
        href: '/contacto',
        className: 'cta-button secondary',
        icon: 'fas fa-envelope',
        text: 'Solicitar Proyecto'
      }
    ],
    stats: [
      { number: '100+', label: 'Artículos Publicados' },
      { number: '5K+', label: 'Lectores Mensuales' },
      { number: '24h', label: 'Actualizaciones' }
    ]
  }

  return (
    <>
      <Helmet>
        <title>Desarrollo Web Villa Carlos Paz | Programador Web Profesional | hgaruna</title>
        <meta 
          name="description" 
          content="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce, SEO local y marketing digital." 
        />
        <meta 
          name="keywords" 
          content="desarrollo web villa carlos paz, programador web villa carlos paz, diseñador web villa carlos paz, crear sitio web villa carlos paz, desarrollo de software villa carlos paz, web developer villa carlos paz, programación web córdoba, e-commerce villa carlos paz, seo local villa carlos paz, marketing digital villa carlos paz" 
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | hgaruna" />
        <meta property="og:description" content="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce y SEO local incluido." />
        <meta property="og:image" content="https://hgaruna.org/logos-he-imagenes/logo3.png" />
        <meta property="og:url" content="https://hgaruna.org/" />
        
        {/* Twitter */}
        <meta property="twitter:title" content="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | hgaruna" />
        <meta property="twitter:description" content="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes." />
        <meta property="twitter:image" content="https://hgaruna.org/logos-he-imagenes/logo3.png" />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "name": "hgaruna",
                "alternateName": [
                  "hgaruna Desarrollo Web Villa Carlos Paz",
                  "Desarrollo Web Villa Carlos Paz",
                  "Programador Web Villa Carlos Paz"
                ],
                "url": "https://hgaruna.org/",
                "logo": "https://hgaruna.org/logos-he-imagenes/logo3.png",
                "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba. Creamos sitios web personalizados para negocios locales con las mejores tecnologías.",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Villa Carlos Paz",
                  "addressRegion": "Córdoba",
                  "addressCountry": "AR",
                  "postalCode": "5152"
                },
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "telephone": "+54-3541-237972",
                    "contactType": "Customer Service",
                    "email": "23sarmiento@gmail.com",
                    "availableLanguage": "Spanish"
                  }
                ],
                "sameAs": [
                  "https://www.facebook.com/profile.php?id=61557007626922",
                  "https://www.instagram.com/onlinesellweb/"
                ],
                "areaServed": [
                  {"@type": "City", "name": "Villa Carlos Paz"},
                  {"@type": "City", "name": "Córdoba"},
                  {"@type": "City", "name": "Cosquín"},
                  {"@type": "City", "name": "La Falda"},
                  {"@type": "City", "name": "Villa General Belgrano"},
                  {"@type": "City", "name": "Alta Gracia"}
                ]
              },
              {
                "@type": "LocalBusiness",
                "name": "hgaruna - Desarrollo Web Villa Carlos Paz",
                "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba",
                "url": "https://hgaruna.org/",
                "telephone": "+54-3541-237972",
                "email": "23sarmiento@gmail.com",
                "address": {"@type": "PostalAddress", "addressLocality": "Villa Carlos Paz", "addressRegion": "Córdoba", "addressCountry": "AR"},
                "geo": {"@type": "GeoCoordinates", "latitude": "-31.4201", "longitude": "-64.4998"},
                "serviceArea": {"@type": "City", "name": "Villa Carlos Paz"},
                "priceRange": "$$",
                "openingHours": "Mo-Fr 09:00-18:00, Sa 10:00-14:00",
                "currenciesAccepted": "ARS",
                "paymentAccepted": "Cash, Credit Card, Bank Transfer",
                "category": "Desarrollo de Software"
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <Hero {...heroProps} />

      {/* Success Case Section */}
      <section className="section case-study-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-trophy"></i>
              Caso de Éxito
            </div>
            <h2 className="section-title">Proyecto Destacado</h2>
            <p className="section-description">
              Uno de nuestros proyectos destacados: Veterinaria en Carlos Paz. Sitio web profesional, rápido, optimizado para dispositivos móviles y SEO local.
            </p>
          </div>
          
          <div className="case-study-preview">
            <div className="case-study-frame">
              <iframe
                src="https://www.veterinariaencarlospaz.com/"
                title="Veterinaria en Carlos Paz"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-star"></i>
              Artículos Destacados
            </div>
            <h2 className="section-title">Lo Más Leído Esta Semana</h2>
            <p className="section-description">
              Descubre los artículos más populares sobre tecnología, desarrollo web y programación
            </p>
          </div>

          <div className="cards-grid cards-grid-3">
            <article className="blog-card hover-lift">
              <div className="blog-card-image">
                <img src="/logos-he-imagenes/programacion.jpeg" alt="React 19 Nuevas Características" />
                <div className="blog-card-badge">Desarrollo</div>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span><i className="fas fa-calendar mr-1"></i>15 Ene 2024</span>
                  <span><i className="fas fa-clock mr-1"></i>8 min</span>
                </div>
                <h3 className="blog-card-title">
                  React 19: Las Nuevas Características que Cambiarán Todo
                </h3>
                <p className="blog-card-excerpt">
                  Explora las innovaciones más importantes de React 19 y cómo impactarán en el desarrollo frontend moderno.
                </p>
                <div className="blog-card-footer">
                  <span className="text-sm text-muted">Por hgaruna</span>
                  <a href="/blog/react-19-nuevas-caracteristicas" className="btn btn-outline btn-sm">
                    Leer más <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            </article>

            <article className="blog-card hover-lift">
              <div className="blog-card-image">
                <img src="/logos-he-imagenes/programacion.jpeg" alt="TypeScript Avanzado" />
                <div className="blog-card-badge">Programación</div>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span><i className="fas fa-calendar mr-1"></i>12 Ene 2024</span>
                  <span><i className="fas fa-clock mr-1"></i>12 min</span>
                </div>
                <h3 className="blog-card-title">
                  TypeScript Avanzado: Patrones y Técnicas Pro
                </h3>
                <p className="blog-card-excerpt">
                  Domina TypeScript con patrones avanzados, utility types y técnicas que todo desarrollador debe conocer.
                </p>
                <div className="blog-card-footer">
                  <span className="text-sm text-muted">Por hgaruna</span>
                  <a href="/blog/typescript-avanzado-patrones" className="btn btn-outline btn-sm">
                    Leer más <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            </article>

            <article className="blog-card hover-lift">
              <div className="blog-card-image">
                <img src="/logos-he-imagenes/programacion.jpeg" alt="Inteligencia Artificial 2024" />
                <div className="blog-card-badge">IA</div>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span><i className="fas fa-calendar mr-1"></i>10 Ene 2024</span>
                  <span><i className="fas fa-clock mr-1"></i>15 min</span>
                </div>
                <h3 className="blog-card-title">
                  IA en el Desarrollo Web: Tendencias 2024
                </h3>
                <p className="blog-card-excerpt">
                  Cómo la inteligencia artificial está transformando el desarrollo web y qué esperar este año.
                </p>
                <div className="blog-card-footer">
                  <span className="text-sm text-muted">Por hgaruna</span>
                  <a href="/blog/ia-desarrollo-web-2024" className="btn btn-outline btn-sm">
                    Leer más <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            </article>
          </div>

          <div className="text-center mt-8">
            <a href="/blog" className="btn btn-primary btn-lg">
              <i className="fas fa-newspaper mr-2"></i>
              Ver Todos los Artículos
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section section-secondary">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-th-large"></i>
              Categorías
            </div>
            <h2 className="section-title">Explora por Tema</h2>
            <p className="section-description">
              Encuentra contenido específico sobre los temas que más te interesan
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number"><i className="fas fa-code"></i></div>
              <h3 className="step-title">Desarrollo Web</h3>
              <p className="step-description">
                Tutoriales, frameworks, mejores prácticas y tendencias del desarrollo frontend y backend.
              </p>
              <a href="/blog?category=desarrollo" className="btn btn-outline btn-sm mt-3">
                Ver Artículos
              </a>
            </div>

            <div className="process-step">
              <div className="step-number"><i className="fas fa-palette"></i></div>
              <h3 className="step-title">Diseño UI/UX</h3>
              <p className="step-description">
                Principios de diseño, herramientas, tendencias y técnicas para crear interfaces excepcionales.
              </p>
              <a href="/blog?category=diseno" className="btn btn-outline btn-sm mt-3">
                Ver Artículos
              </a>
            </div>

            <div className="process-step">
              <div className="step-number"><i className="fas fa-robot"></i></div>
              <h3 className="step-title">Inteligencia Artificial</h3>
              <p className="step-description">
                IA aplicada al desarrollo, machine learning, automatización y el futuro de la tecnología.
              </p>
              <a href="/blog?category=ia" className="btn btn-outline btn-sm mt-3">
                Ver Artículos
              </a>
            </div>

            <div className="process-step">
              <div className="step-number"><i className="fas fa-chart-line"></i></div>
              <h3 className="step-title">Tecnología</h3>
              <p className="step-description">
                Noticias tech, análisis de tendencias, nuevas herramientas y el futuro digital.
              </p>
              <a href="/blog?category=tecnologia" className="btn btn-outline btn-sm mt-3">
                Ver Artículos
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Números que Hablan</h2>
            <p className="section-subtitle">
              Resultados comprobados que respaldan nuestro trabajo
            </p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Proyectos Completados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Clientes Satisfechos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Años de Experiencia</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24h</span>
              <span className="stat-label">Tiempo de Respuesta</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="section-title">¿Listo para Hacer Crecer tu Negocio?</h2>
            <p className="section-subtitle">
              No dejes que tu competencia te gane. Contáctanos hoy mismo y comienza tu transformación digital.
            </p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/+543541237972?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20sus%20servicios%20de%20desarrollo%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz"
                className="cta-button primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
                ¡Chatear Ahora!
              </a>
              <a href="/contacto" className="cta-button secondary">
                <i className="fas fa-envelope"></i>
                Enviar Mensaje
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
