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
      { number: '50+', label: 'Sitios Web Creados' },
      { number: '100%', label: 'Clientes Satisfechos' },
      { number: '24h', label: 'Tiempo de Respuesta' }
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

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-cogs"></i>
              Nuestros Servicios
            </div>
            <h2 className="section-title">Soluciones Digitales Personalizadas</h2>
            <p className="section-description">
              Ofrecemos servicios completos de desarrollo web y marketing digital para hacer crecer tu negocio en Villa Carlos Paz
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-inner">
                <div className="service-card-front">
                  <div className="service-icon">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <h3>Sitios Web Profesionales</h3>
                  <p>Diseño web personalizado que convierte visitantes en clientes.</p>
                  <div className="price-tag">Desde $150</div>
                </div>
                <div className="service-card-back">
                  <h3>Beneficios Clave</h3>
                  <ul>
                    <li><i className="fas fa-check"></i> Diseño 100% personalizado para tu marca</li>
                    <li><i className="fas fa-check"></i> Optimizado para todos los dispositivos</li>
                    <li><i className="fas fa-check"></i> Formulario de contacto integrado</li>
                    <li><i className="fas fa-check"></i> SEO básico incluido</li>
                    <li><i className="fas fa-check"></i> Dominio y hosting por 1 año</li>
                    <li><i className="fas fa-check"></i> Certificado SSL gratuito</li>
                  </ul>
                  <a href="/contacto" className="btn btn-outline">Solicitar Cotización</a>
                </div>
              </div>
            </div>
            
            <div className="service-card featured">
              <div className="service-card-inner">
                <div className="service-card-front">
                  <div className="service-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <h3>Tiendas Online</h3>
                  <p>Vende tus productos las 24 horas del día, los 7 días de la semana.</p>
                  <div className="price-tag">Desde $300</div>
                </div>
                <div className="service-card-back">
                  <h3>Características Principales</h3>
                  <ul>
                    <li><i className="fas fa-check"></i> Hasta 50 productos incluidos</li>
                    <li><i className="fas fa-check"></i> Pasarela de pagos integrada</li>
                    <li><i className="fas fa-check"></i> Gestión de inventario</li>
                    <li><i className="fas fa-check"></i> Carrito de compras seguro</li>
                    <li><i className="fas fa-check"></i> Panel de administración fácil de usar</li>
                    <li><i className="fas fa-check"></i> Integración con redes sociales</li>
                  </ul>
                  <a href="/contacto" className="btn btn-primary">Empezar a Vender</a>
                </div>
              </div>
            </div>
            
            <div className="service-card">
              <div className="service-card-inner">
                <div className="service-card-front">
                  <div className="service-icon">
                    <i className="fas fa-search-dollar"></i>
                  </div>
                  <h3>Marketing Digital</h3>
                  <p>Estrategias efectivas para aumentar tu presencia en línea.</p>
                  <div className="price-tag">Desde $200</div>
                </div>
                <div className="service-card-back">
                  <h3>Nuestro Enfoque</h3>
                  <ul>
                    <li><i className="fas fa-check"></i> Estrategias personalizadas SEO</li>
                    <li><i className="fas fa-check"></i> Campañas en Google Ads</li>
                    <li><i className="fas fa-check"></i> Publicidad en Redes Sociales</li>
                    <li><i className="fas fa-check"></i> Email Marketing</li>
                    <li><i className="fas fa-check"></i> Análisis de competencia</li>
                    <li><i className="fas fa-check"></i> Informes mensuales detallados</li>
                  </ul>
                  <a href="/contacto" className="btn btn-outline">Potenciar mi Negocio</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-cogs"></i>
              Nuestro Proceso
            </div>
            <h2 className="section-title">Cómo Trabajamos</h2>
            <p className="section-description">
              Así es como transformamos tu idea en una solución digital exitosa
            </p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3 className="step-title">Consulta Inicial</h3>
              <p className="step-description">
                Analizamos tus necesidades y objetivos en una reunión sin costo.
              </p>
            </div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <h3 className="step-title">Propuesta Personalizada</h3>
              <p className="step-description">
                Te presentamos un plan de trabajo detallado con presupuesto cerrado.
              </p>
            </div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <h3 className="step-title">Diseño y Desarrollo</h3>
              <p className="step-description">
                Creamos tu sitio web con las últimas tecnologías y diseño adaptativo.
              </p>
            </div>
            
            <div className="process-step">
              <div className="step-number">4</div>
              <h3 className="step-title">Lanzamiento</h3>
              <p className="step-description">
                Publicamos tu sitio y te capacitamos para que lo administres fácilmente.
              </p>
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
