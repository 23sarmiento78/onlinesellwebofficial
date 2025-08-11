import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import FAQAccordion from '../components/FAQAccordion';
import Timeline from '../components/Timeline';
import Hero from '../components/Hero';

export default function DesarrolloWebVillaCarlosPaz() {
  return (
    <BaseLayout
      title="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      description="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web para negocios locales. E-commerce, SEO local y marketing digital. Precios desde $150."
      keywords="desarrollo web villa carlos paz, programador web villa carlos paz, diseñador web villa carlos paz, crear sitio web villa carlos paz, desarrollo de software villa carlos paz, web developer villa carlos paz, programación web córdoba, e-commerce villa carlos paz"
      ogTitle="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      ogDescription="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web para negocios locales. E-commerce y SEO local incluido."
      ogImage="https://hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://hgaruna.org/desarrollo-web-villa-carlos-paz/"
    >
      {/* Hero Section */}
      <Hero
        title="Desarrollo Web Profesional Villa Carlos Paz | Sitios Web que Venden"
        subtitle="¿Tu competencia ya tiene sitio web y tú no? Creamos sitios web profesionales que convierten visitantes en clientes. E-commerce, SEO local y marketing digital incluido. Precios accesibles para negocios locales."
        backgroundImage="/logos-he-imagenes/fondo-hero.jpg"
        ctas={[
          {
            href: '/planes/',
            className: 'cta-button primary',
            icon: 'fas fa-rocket',
            text: '¡Quiero mi Sitio Web YA!'
          },
          {
            href: 'https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz',
            className: 'cta-button secondary',
            icon: 'fab fa-whatsapp',
            text: 'Consulta Gratuita',
            target: '_blank'
          }
        ]}
        stats={[
          { number: '20+', label: 'Sitios Web Creados' },
          { number: '100%', label: 'Clientes Satisfechos' },
          { number: '24h', label: 'Tiempo de Respuesta' }
        ]}
      />

      {/* Contenido de Builder.io irá aquí */}
      <section className="desarrollo-content">
        <div className="container">
          <div className="text-center">
            <h2>Desarrollo Web Villa Carlos Paz</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Desarrollo Web Villa Carlos Paz",
        "description": "Desarrollo web profesional en Villa Carlos Paz, Córdoba. Sitios web que convierten visitantes en clientes.",
        "provider": {
          "@type": "Organization",
          "name": "hgaruna",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Villa Carlos Paz",
            "addressRegion": "Córdoba",
            "addressCountry": "AR"
          }
        },
        "areaServed": {
          "@type": "City",
          "name": "Villa Carlos Paz"
        },
        "serviceType": "Desarrollo Web",
        "priceRange": "$$"
      }) }} />
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="text-center mb-4">Desarrollo Web Profesional en Villa Carlos Paz</h1>
            <div className="alert alert-info">
              <h4><i className="fas fa-map-marker-alt"></i> ¿Necesitas un sitio web para tu negocio en Villa Carlos Paz?</h4>
              <p>Somos programadores web especializados en desarrollo web para empresas locales de Villa Carlos Paz y Córdoba. Creamos sitios web profesionales que convierten visitantes en clientes.</p>
            </div>
            <section className="mb-5">
              <h2>¿Por qué elegir nuestro desarrollo web en Villa Carlos Paz?</h2>
              <div className="row">
                <div className="col-md-6">
                  <h3><i className="fas fa-code"></i> Programación Web Profesional</h3>
                  <ul>
                    <li>Sitios web responsivos que se adaptan a todos los dispositivos</li>
                    <li>Código limpio y optimizado para velocidad</li>
                    <li>Tecnologías modernas (React, JavaScript, HTML5, CSS3)</li>
                    <li>Panel de administración fácil de usar</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h3><i className="fas fa-search"></i> SEO Local Villa Carlos Paz</h3>
                  <ul>
                    <li>Optimización para búsquedas locales</li>
                    <li>Google My Business configurado</li>
                    <li>Palabras clave específicas de la región</li>
                    <li>Reseñas y testimonios locales</li>
                  </ul>
                </div>
              </div>
            </section>
            <section className="mb-5">
              <h2>Nuestros servicios de desarrollo web en Villa Carlos Paz</h2>
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h4><i className="fas fa-laptop"></i> Sitios Web Corporativos</h4>
                      <p>Sitios web profesionales para empresas de Villa Carlos Paz con diseño moderno y funcionalidades avanzadas.</p>
                      <strong>Desde $150</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h4><i className="fas fa-shopping-cart"></i> E-commerce</h4>
                      <p>Tiendas online completas para vender tus productos las 24 horas en Villa Carlos Paz y alrededores.</p>
                      <strong>Desde $300</strong>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h4><i className="fas fa-mobile-alt"></i> Aplicaciones Web</h4>
                      <p>Aplicaciones web personalizadas para automatizar procesos de tu negocio en Villa Carlos Paz.</p>
                      <strong>Desde $500</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="mb-5">
              <h2>Proceso de desarrollo web en Villa Carlos Paz</h2>
              <Timeline
                steps={[
                  {
                    title: 'Consulta Gratuita',
                    description: 'Analizamos las necesidades de tu negocio en Villa Carlos Paz y te damos una propuesta personalizada.'
                  },
                  {
                    title: 'Diseño y Planificación',
                    description: 'Creamos el diseño de tu sitio web considerando tu público objetivo en Villa Carlos Paz.'
                  },
                  {
                    title: 'Desarrollo y Programación',
                    description: 'Programamos tu sitio web con las mejores tecnologías y optimizaciones SEO.'
                  },
                  {
                    title: 'Lanzamiento y Capacitación',
                    description: 'Lanzamos tu sitio web y te capacitamos para administrarlo fácilmente.'
                  }
                ]}
              />
            </section>
            <section className="mb-5">
              <h2>Preguntas frecuentes sobre desarrollo web en Villa Carlos Paz</h2>
              <FAQAccordion
                faqs={[
                  {
                    question: '¿Cuánto cuesta un sitio web en Villa Carlos Paz?',
                    answer: 'Los precios varían según las necesidades de tu negocio. Tenemos planes desde $150 para sitios web básicos hasta $500 para proyectos más complejos. Ofrecemos consulta gratuita para evaluar tus necesidades específicas.'
                  },
                  {
                    question: '¿Cuánto tiempo toma desarrollar un sitio web?',
                    answer: 'Depende de la complejidad del proyecto. Sitios web básicos los entregamos en 1-2 semanas, mientras que proyectos más complejos pueden tomar 3-4 semanas. Siempre mantenemos comunicación constante durante el proceso.'
                  },
                  {
                    question: '¿Incluyen SEO local para Villa Carlos Paz?',
                    answer: 'Sí, todos nuestros sitios web incluyen optimización SEO local para que aparezcas en búsquedas de Villa Carlos Paz y alrededores. Configuramos Google My Business y optimizamos para palabras clave locales.'
                  }
                ]}
              />
            </section>
            <section className="text-center mb-5">
              <h2>¿Listo para empezar tu proyecto de desarrollo web en Villa Carlos Paz?</h2>
              <p className="lead">Contáctanos hoy mismo para una consulta gratuita</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz" className="btn btn-success btn-lg" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a href="/planes/" className="btn btn-primary btn-lg">
                  <i className="fas fa-rocket"></i> Ver Planes
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 