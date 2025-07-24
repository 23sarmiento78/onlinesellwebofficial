import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';
import Card from '../components/Card';

export default function Home() {
  return (
    <BaseLayout
      title="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      description="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce, SEO local y marketing digital. Precios desde $150."
      keywords="desarrollo web villa carlos paz, programador web villa carlos paz, diseñador web villa carlos paz, crear sitio web villa carlos paz, desarrollo de software villa carlos paz, web developer villa carlos paz, programación web córdoba, e-commerce villa carlos paz, seo local villa carlos paz, marketing digital villa carlos paz, sitios web profesionales villa carlos paz, tienda online villa carlos paz, google my business villa carlos paz, posicionamiento web córdoba"
      ogTitle="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      ogDescription="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce y SEO local incluido."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/"
      twitterTitle="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      twitterDescription="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes."
      twitterImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      twitterUrl="https://service.hgaruna.org/"
    >
      {/* JSON-LD SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
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
            "url": "https://service.hgaruna.org/",
            "logo": "https://service.hgaruna.org/logos-he-imagenes/logo3.png",
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
              },
              {
                "@type": "ContactPoint",
                "telephone": "+54-3541-237972",
                "contactType": "Sales",
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
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Servicios de Desarrollo Web Villa Carlos Paz",
              "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Desarrollo Web Profesional", "description": "Sitios web personalizados para negocios en Villa Carlos Paz y Córdoba", "provider": {"@type": "Organization", "name": "hgaruna"}}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "E-commerce", "description": "Tiendas online para comercios de Villa Carlos Paz", "provider": {"@type": "Organization", "name": "hgaruna"}}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "SEO Local", "description": "Optimización para búsquedas locales en Villa Carlos Paz", "provider": {"@type": "Organization", "name": "hgaruna"}}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Diseño Web Responsivo", "description": "Sitios web que se adaptan a todos los dispositivos", "provider": {"@type": "Organization", "name": "hgaruna"}}},
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Marketing Digital", "description": "Estrategias de marketing digital para empresas locales", "provider": {"@type": "Organization", "name": "hgaruna"}}}
              ]
            }
          },
          {
            "@type": "LocalBusiness",
            "name": "hgaruna - Desarrollo Web Villa Carlos Paz",
            "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba",
            "url": "https://service.hgaruna.org/",
            "telephone": "+54-3541-237972",
            "email": "23sarmiento@gmail.com",
            "address": {"@type": "PostalAddress", "addressLocality": "Villa Carlos Paz", "addressRegion": "Córdoba", "addressCountry": "AR"},
            "geo": {"@type": "GeoCoordinates", "latitude": "-31.4201", "longitude": "-64.4998"},
            "serviceArea": {"@type": "City", "name": "Villa Carlos Paz"},
            "priceRange": "$$",
            "openingHours": "Mo-Fr 09:00-18:00, Sa 10:00-14:00",
            "currenciesAccepted": "ARS",
            "paymentAccepted": "Cash, Credit Card, Bank Transfer",
            "category": "Desarrollo de Software",
            "keywords": "desarrollo web, diseño web, programador web, villa carlos paz, córdoba"
          },
          {
            "@type": "WebSite",
            "url": "https://service.hgaruna.org/",
            "name": "hgaruna - Desarrollo Web Villa Carlos Paz",
            "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {"@type": "EntryPoint", "urlTemplate": "https://service.hgaruna.org/public/blog/?q={search_term_string}"},
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "¿Cuánto cuesta un sitio web en Villa Carlos Paz?", "acceptedAnswer": {"@type": "Answer", "text": "Los precios varían según las necesidades. Tenemos planes desde $150 hasta $500. Consulta gratuita disponible."}},
              {"@type": "Question", "name": "¿Hacen SEO local para Villa Carlos Paz?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, especializamos en SEO local para que aparezcas en búsquedas de Villa Carlos Paz y alrededores."}},
              {"@type": "Question", "name": "¿Cuánto tiempo toma desarrollar un sitio web?", "acceptedAnswer": {"@type": "Answer", "text": "Depende de la complejidad. Sitios básicos en 1-2 semanas, proyectos complejos en 3-4 semanas."}},
              {"@type": "Question", "name": "¿Qué incluye el desarrollo web profesional?", "acceptedAnswer": {"@type": "Answer", "text": "Incluye diseño responsivo, optimización SEO, integración con redes sociales, panel de administración y capacitación."}},
              {"@type": "Question", "name": "¿Trabajan con empresas de Villa Carlos Paz?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, nos especializamos en negocios locales de Villa Carlos Paz y alrededores. Conocemos el mercado local."}}
            ]
          }
        ]
      }) }} />
      {/* Article Structured Data para SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Desarrollo Web Villa Carlos Paz | Programador Web Profesional | hgaruna",
        "description": "Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce, SEO local y marketing digital.",
        "image": ["https://service.hgaruna.org/logos-he-imagenes/logo3.png"],
        "author": {
          "@type": "Person",
          "name": "Hernán Sarmiento",
          "url": "https://service.hgaruna.org/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "hgaruna",
          "logo": {
            "@type": "ImageObject",
            "url": "https://service.hgaruna.org/logos-he-imagenes/logo3.png"
          }
        },
        "datePublished": "2023-01-01",
        "dateModified": "2025-07-18",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://service.hgaruna.org/"
        }
      }) }} />
      {/* BreadcrumbList Structured Data para SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Inicio",
            "item": "https://service.hgaruna.org/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Planes",
            "item": "https://service.hgaruna.org/planes/"
          }
        ]
      }) }} />

      {/* Hero Section */}
      <Hero
        title="Desarrollo Web Profesional en Villa Carlos Paz | Sitios Web que Venden"
        subtitle="¿Tu competencia ya tiene sitio web y tú no? No te quedes atrás. Creamos sitios web profesionales que convierten visitantes en clientes. Precios accesibles para negocios locales de Villa Carlos Paz y Córdoba."
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

      {/* Servicios Section */}
      <section id="servicios" className="servicios">
        <div className="container">
          <div className="public/blog-header">
            <h2 className="public/blog-title-main">Desarrollo Web Villa Carlos Paz: ¿Por qué los Negocios Locales Eligen hgaruna?</h2>
            <p className="public/blog-description">No somos solo programadores web, somos tu socio digital para hacer crecer tu negocio en Villa Carlos Paz y Córdoba</p>
          </div>
          <div className="servicios-grid">
            <Card
              image="/logos-he-imagenes/programacion.jpeg"
              title="Sitios Web que Venden"
              description="No solo creamos sitios web bonitos, creamos sitios web que convierten visitantes en clientes. Diseño enfocado en resultados para negocios de Villa Carlos Paz."
              cta={{ href: '/planes/', className: 'btn btn-primary', text: 'Desde $150' }}
              children={<div className="servicio-features">
                <span><i className="fas fa-check"></i> Diseño Responsivo</span>
                <span><i className="fas fa-check"></i> Optimizado para Móviles</span>
                <span><i className="fas fa-check"></i> Velocidad de Carga</span>
              </div>}
            />
            <Card
              image="/logos-he-imagenes/programacion.jpeg"
              title="Vende Online 24/7"
              description="Tu negocio nunca duerme. Con nuestras tiendas online, puedes vender tus productos o servicios las 24 horas del día en Villa Carlos Paz."
              cta={{ href: '/planes/', className: 'btn btn-primary', text: 'Desde $300' }}
              children={<div className="servicio-features">
                <span><i className="fas fa-check"></i> Pasarelas de Pago</span>
                <span><i className="fas fa-check"></i> Gestión de Inventario</span>
                <span><i className="fas fa-check"></i> Reportes de Ventas</span>
              </div>}
            />
            <Card
              image="/logos-he-imagenes/programacion.jpeg"
              title="Aparece Primero en Google"
              description="Cuando alguien busque tu negocio en Villa Carlos Paz, queremos que aparezcas primero. SEO local especializado para empresas de la región."
              cta={{ href: '/planes/', className: 'btn btn-primary', text: 'Incluido en Planes' }}
              children={<div className="servicio-features">
                <span><i className="fas fa-check"></i> Google My Business</span>
                <span><i className="fas fa-check"></i> Reseñas Locales</span>
                <span><i className="fas fa-check"></i> Palabras Clave Locales</span>
              </div>}
            />
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="beneficios">
        <div className="container">
          <div className="public/blog-header">
            <h2 className="public/blog-title-main">¿Qué Pasa si NO Tienes un Sitio Web?</h2>
            <p className="public/blog-description">Los números no mienten: los negocios con presencia web crecen más rápido</p>
          </div>
          <div className="beneficios-grid">
            <div className="beneficio-card warning">
              <i className="fas fa-exclamation-triangle beneficio-icon"></i>
              <h3>Pierdes Clientes</h3>
              <p>El 81% de las personas investigan online antes de comprar. Sin sitio web, no te encuentran.</p>
            </div>
            <div className="beneficio-card warning">
              <i className="fas fa-chart-line-down beneficio-icon"></i>
              <h3>Tu Competencia Te Gana</h3>
              <p>Mientras tú no tienes sitio web, tu competencia ya está vendiendo online y captando clientes.</p>
            </div>
            <div className="beneficio-card warning">
              <i className="fas fa-clock beneficio-icon"></i>
              <h3>Horarios Limitados</h3>
              <p>Tu negocio solo funciona cuando estás abierto. Un sitio web vende las 24 horas.</p>
            </div>
            <div className="beneficio-card success">
              <i className="fas fa-rocket beneficio-icon"></i>
              <h3>Con hgaruna: Crecimiento Garantizado</h3>
              <p>Nuestros clientes ven un aumento del 200% en consultas en los primeros 3 meses.</p>
            </div>
            <div className="beneficio-card success">
              <i className="fas fa-users beneficio-icon"></i>
              <h3>Más Clientes Locales</h3>
              <p>Los turistas y residentes te encuentran fácilmente cuando buscan en Google.</p>
            </div>
            <div className="beneficio-card success">
              <i className="fas fa-dollar-sign beneficio-icon"></i>
              <h3>ROI Inmediato</h3>
              <p>Recuperas la inversión en el primer mes con los nuevos clientes que lleguen.</p>
            </div>
          </div>
          <div className="cta-section">
            <h3>¿Listo para Transformar tu Negocio?</h3>
            <p>No esperes más. Cada día sin sitio web es un día perdiendo clientes.</p>
            <div className="cta-buttons">
              <a href="/planes/" className="cta-button primary large">
                <i className="fas fa-rocket"></i>
                ¡Quiero mi Sitio Web AHORA!
              </a>
              <a href="https://wa.me/+543541237972?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20sus%20servicios%20de%20desarrollo%20web" className="cta-button secondary large" target="_blank">
                <i className="fab fa-whatsapp"></i>
                Hablar con un Experto
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-header">
            <h2 className="public/blog-title-main">¿Listo para Hacer Crecer tu Negocio?</h2>
            <p className="public/blog-description">No dejes que tu competencia te gane. Contáctanos hoy mismo y comienza tu transformación digital.</p>
          </div>
          <div className="contact-grid">
            {/* Información de Contacto */}
            <div className="contact-info">
              <h3>Hablemos de tu Proyecto</h3>
              <p style={{ marginBottom: 32, color: 'var(--hgaruna-text-light)' }}>
                Estamos aquí para ayudarte a hacer crecer tu negocio en Villa Carlos Paz. ¡La primera consulta es completamente gratuita!
              </p>
              <div className="info-items">
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <div className="info-content">
                    <h4>Llamada Directa</h4>
                    <p><a href="tel:+543541237972">+54 3541 237972</a></p>
                    <small>Lunes a Viernes 9:00 - 18:00</small>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fab fa-whatsapp"></i>
                  <div className="info-content">
                    <h4>WhatsApp</h4>
                    <p><a href="https://wa.me/+543541237972" target="_blank">+54 3541 237972</a></p>
                    <small>Respuesta en menos de 1 hora</small>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <div className="info-content">
                    <h4>Email</h4>
                    <p><a href="mailto:23sarmiento@gmail.com">23sarmiento@gmail.com</a></p>
                    <small>Respuesta en 24 horas</small>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div className="info-content">
                    <h4>Ubicación</h4>
                    <p>Villa Carlos Paz, Córdoba</p>
                    <small>Atendemos toda la región</small>
                  </div>
                </div>
              </div>
              <div className="contact-cta">
                <h4>¿Prefieres WhatsApp?</h4>
                <p>Es la forma más rápida de contactarnos</p>
                <a href="https://wa.me/+543541237972?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20sus%20servicios%20de%20desarrollo%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz" className="cta-button primary" target="_blank">
                  <i className="fab fa-whatsapp"></i>
                  ¡Chatear Ahora!
                </a>
              </div>
            </div>
            {/* Formulario de Contacto */}
            <div className="contact-form-container">
              <h3>Cuéntanos Sobre tu Proyecto</h3>
              <p style={{ marginBottom: 24, color: 'var(--hgaruna-text-light)' }}>
                Completa el formulario y te contactaremos en menos de 2 horas con una propuesta personalizada.
              </p>
              <form action="https://formspree.io/f/mkgoqyjo" method="POST" className="modern-form">
                <div className="form-group-modern">
                  <label htmlFor="name">Nombre completo *</label>
                  <input type="text" id="name" name="name" required placeholder="Tu nombre completo" />
                </div>
                <div className="form-group-modern">
                  <label htmlFor="email">Email *</label>
                  <input type="email" id="email" name="email" required placeholder="tu@email.com" />
                </div>
                <div className="form-group-modern">
                  <label htmlFor="phone">Teléfono</label>
                  <input type="tel" id="phone" name="phone" placeholder="+54 9 3541 123456" />
                </div>
                <div className="form-group-modern">
                  <label htmlFor="business">Nombre de tu negocio</label>
                  <input type="text" id="business" name="business" placeholder="Ej: Restaurante La Esquina" />
                </div>
                <div className="form-group-modern">
                  <label htmlFor="service">¿Qué necesitas? *</label>
                  <select id="service" name="service" required>
                    <option value="">Selecciona lo que necesitas</option>
                    <option value="sitio-web">Sitio Web Profesional</option>
                    <option value="e-commerce">Tienda Online</option>
                    <option value="seo">SEO Local</option>
                    <option value="marketing">Marketing Digital</option>
                    <option value="rediseno">Rediseño de Sitio Web</option>
                    <option value="mantenimiento">Mantenimiento Web</option>
                    <option value="otro">Otro (especificar)</option>
                  </select>
                </div>
                <div className="form-group-modern">
                  <label htmlFor="budget">Presupuesto aproximado</label>
                  <select id="budget" name="budget">
                    <option value="">Selecciona tu presupuesto</option>
                    <option value="150-300">$150 - $300</option>
                    <option value="300-500">$300 - $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="1000+">Más de $1000</option>
                    <option value="no-se">No sé, necesito asesoría</option>
                  </select>
                </div>
                <div className="form-group-modern">
                  <label htmlFor="message">Cuéntanos más sobre tu proyecto *</label>
                  <textarea id="message" name="message" required placeholder="Describe tu proyecto, objetivos, timeline, etc. Cuanto más detalles nos des, mejor podremos ayudarte." rows={4}></textarea>
                </div>
                <div className="form-submit">
                  <button type="submit" className="cta-button primary large">
                    <i className="fas fa-paper-plane"></i>
                    ¡Enviar Propuesta Gratuita!
                  </button>
                  <p className="form-note">* Recibirás una propuesta personalizada en menos de 2 horas</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 