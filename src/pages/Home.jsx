import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';
import Card from '../components/Card';
import RecursosYTips from '../components/RecursosYTips';
import StyleTest from '../components/StyleTest';

export default function Home() {
  return (
    <BaseLayout
      title="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      description="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce, SEO local y marketing digital. Precios desde $150."
      keywords="desarrollo web villa carlos paz, programador web villa carlos paz, diseñador web villa carlos paz, crear sitio web villa carlos paz, desarrollo de software villa carlos paz, web developer villa carlos paz, programación web córdoba, e-commerce villa carlos paz, seo local villa carlos paz, marketing digital villa carlos paz, sitios web profesionales villa carlos paz, tienda online villa carlos paz, google my business villa carlos paz, posicionamiento web córdoba"
      ogTitle="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      ogDescription="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes. E-commerce y SEO local incluido."
      ogImage="https://hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://hgaruna.org/"
      twitterTitle="Desarrollo Web Villa Carlos Paz | Programador Web Profesional | Sitios Web que Venden | hgaruna"
      twitterDescription="Desarrollo web profesional en Villa Carlos Paz, Córdoba. Programador web especializado en sitios web que convierten visitantes en clientes."
      twitterImage="https://hgaruna.org/logos-he-imagenes/logo3.png"
      twitterUrl="https://hgaruna.org/"
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
            "category": "Desarrollo de Software",
            "keywords": "desarrollo web, diseño web, programador web, villa carlos paz, córdoba"
          },
          {
            "@type": "WebSite",
            "url": "https://hgaruna.org/",
            "name": "hgaruna - Desarrollo Web Villa Carlos Paz",
            "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {"@type": "EntryPoint", "urlTemplate": "https://hgaruna.org/blog/?q={search_term_string}"},
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {"@type": "Question", "name": "¿Cuánto cuesta un sitio web en Villa Carlos Paz?", "acceptedAnswer": {"@type": "Answer", "text": "Los precios varían según las necesidades. Tenemos planes desde $150 hasta $500. Consulta gratuita disponible."}},
              {"@type": "Question", "name": "��Hacen SEO local para Villa Carlos Paz?", "acceptedAnswer": {"@type": "Answer", "text": "Sí, especializamos en SEO local para que aparezcas en búsquedas de Villa Carlos Paz y alrededores."}},
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
        "image": ["https://hgaruna.org/logos-he-imagenes/logo3.png"],
        "author": {
          "@type": "Person",
          "name": "Hernán Sarmiento",
          "url": "https://hgaruna.org/"
        },
        "publisher": {
          "@type": "Organization",
          "name": "hgaruna",
          "logo": {
            "@type": "ImageObject",
            "url": "https://hgaruna.org/logos-he-imagenes/logo3.png"
          }
        },
        "datePublished": "2023-01-01",
        "dateModified": "2025-07-18",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://hgaruna.org/"
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
            "item": "https://hgaruna.org/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Planes",
            "item": "https://hgaruna.org/planes/"
          }
        ]
      }) }} />

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

      
      <section className="success-case-section">
        <div className="container">
          <h2 className="section-title">Caso de Éxito</h2>
          <p className="section-description">
            Uno de nuestros proyectos destacados: Veterinaria en Carlos Paz. Sitio web profesional, rápido, optimizado para dispositivos móviles y SEO local.
          </p>
          <div className="live-site-preview">
            <iframe
              src="https://www.veterinariaencarlospaz.com/"
              title="Veterinaria en Carlos Paz"
              style={{
                width: "100%",
                minHeight: "600px",
                border: "1px solid #eee",
                borderRadius: "12px",
                boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
              }}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Recursos y Tips Gratuitos */}
      <RecursosYTips />

      {/* Prueba de Estilos CSS */}
      <StyleTest />

      {/* Sección de Servicios */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Nuestros Servicios</h2>
            <p>Soluciones digitales personalizadas para hacer crecer tu negocio en Villa Carlos Paz</p>
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
                  <div className="price-tag">
                    Desde $150
                  </div>
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
                  <a href="/contacto/" className="btn btn-outline">Solicitar Cotización</a>
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
                  <div className="price-tag">
                    Desde $300
                  </div>
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
                  <a href="/contacto/" className="btn btn-primary">Empezar a Vender</a>
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
                  <div className="price-tag">
                    Desde $200
                  </div>
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
                  <a href="/contacto/" className="btn btn-outline">Potenciar mi Negocio</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cta-box">
            <div className="cta-content">
              <h3>¿No encuentras lo que buscas?</h3>
              <p>Tenemos soluciones personalizadas para cada necesidad.</p>
            </div>
            <a href="https://wa.me/+543541237972" className="btn btn-primary" target="_blank">
              <i className="fab fa-whatsapp"></i> Consulta sin compromiso
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Proceso de Trabajo */}
      <section className="work-process">
        <div className="container">
          <div className="section-header">
            <h2>Nuestro Proceso de Trabajo</h2>
            <p>Así es como transformamos tu idea en una solución digital exitosa</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Consulta Inicial</h3>
              <p>Analizamos tus necesidades y objetivos en una reunión sin costo.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Propuesta Personalizada</h3>
              <p>Te presentamos un plan de trabajo detallado con presupuesto cerrado.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Diseño y Desarrollo</h3>
              <p>Creamos tu sitio web con las últimas tecnologías y diseño adaptativo.</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Lanzamiento</h3>
              <p>Publicamos tu sitio y te capacitamos para que lo administres fácilmente.</p>
            </div>
          </div>
          
          <div className="cta-box secondary">
            <div className="cta-content">
              <h3>¿Listo para comenzar?</h3>
              <p>Agenda una consulta gratuita y descubre cómo podemos ayudarte a crecer en línea.</p>
            </div>
            <a href="https://wa.me/+543541237972" className="btn btn-secondary" target="_blank">
              <i className="fas fa-calendar-alt"></i> Agendar Consulta
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
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
