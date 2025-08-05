import React from 'react'
import { Helmet } from 'react-helmet-async'
import Hero from '@components/Hero'

export default function Planes() {
  const heroProps = {
    title: 'Planes de Desarrollo Web',
    subtitle: 'Encuentra el plan perfecto para tu negocio. Precios transparentes, sin sorpresas, con todo lo que necesitas para triunfar online.',
    variant: 'minimal',
    backgroundImage: '/logos-he-imagenes/fondo-hero.jpg'
  }

  const planes = [
    {
      name: 'Básico',
      price: '150',
      period: 'único',
      featured: false,
      description: 'Perfecto para emprendedores y pequeños negocios',
      features: [
        'Diseño web responsivo',
        'Hasta 5 páginas',
        'Formulario de contacto',
        'SEO básico',
        'Dominio .com por 1 año',
        'Hosting por 1 año',
        'Certificado SSL',
        'Soporte por email',
        'Panel de administración',
        'Integración redes sociales'
      ],
      cta: {
        text: 'Comenzar Ahora',
        href: '/contacto?plan=basico',
        className: 'btn btn-outline btn-lg'
      }
    },
    {
      name: 'Profesional',
      price: '300',
      period: 'único',
      featured: true,
      description: 'La opción más popular para negocios en crecimiento',
      features: [
        'Todo lo del plan Básico',
        'Hasta 10 páginas',
        'Tienda online (hasta 20 productos)',
        'SEO avanzado',
        'Blog integrado',
        'Google Analytics',
        'Chat en vivo',
        'Backup automático',
        'Optimización de velocidad',
        'Soporte prioritario',
        'Capacitación personalizada',
        '2 revisiones gratuitas'
      ],
      cta: {
        text: '¡El Más Popular!',
        href: '/contacto?plan=profesional',
        className: 'btn btn-primary btn-lg'
      }
    },
    {
      name: 'Premium',
      price: '500',
      period: 'único',
      featured: false,
      description: 'Para empresas que quieren la máxima funcionalidad',
      features: [
        'Todo lo del plan Profesional',
        'Páginas ilimitadas',
        'Tienda online (hasta 100 productos)',
        'Sistema de reservas/citas',
        'Múltiples idiomas',
        'Integración CRM',
        'Email marketing',
        'Reportes avanzados',
        'API personalizada',
        'Mantenimiento 3 meses',
        'Soporte telefónico',
        'Revisiones ilimitadas'
      ],
      cta: {
        text: 'Máxima Potencia',
        href: '/contacto?plan=premium',
        className: 'btn btn-outline btn-lg'
      }
    }
  ]

  const addons = [
    {
      name: 'Mantenimiento Mensual',
      price: '50',
      period: 'mes',
      description: 'Actualizaciones, copias de seguridad y soporte continuo',
      icon: 'fas fa-tools'
    },
    {
      name: 'Marketing Digital',
      price: '200',
      period: 'mes',
      description: 'Gestión de redes sociales y campañas publicitarias',
      icon: 'fas fa-chart-line'
    },
    {
      name: 'SEO Avanzado',
      price: '150',
      period: 'mes',
      description: 'Optimización continua para aparecer en Google',
      icon: 'fas fa-search'
    },
    {
      name: 'E-commerce Plus',
      price: '100',
      period: 'único',
      description: 'Funcionalidades avanzadas para tu tienda online',
      icon: 'fas fa-shopping-cart'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Planes de Desarrollo Web Villa Carlos Paz | Precios Transparentes | hgaruna</title>
        <meta 
          name="description" 
          content="Planes de desarrollo web en Villa Carlos Paz desde $150. Precios transparentes, sin sorpresas. Básico, Profesional y Premium. ¡Encuentra tu plan ideal!" 
        />
        <meta 
          name="keywords" 
          content="planes desarrollo web villa carlos paz, precios sitio web villa carlos paz, costo desarrollo web córdoba, planes web económicos, desarrollo web barato villa carlos paz" 
        />
      </Helmet>

      {/* Hero Section */}
      <Hero {...heroProps} />

      {/* Pricing Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-tag"></i>
              Precios Transparentes
            </div>
            <h2 className="section-title">Elige el Plan Perfecto</h2>
            <p className="section-description">
              Sin letra chica, sin costos ocultos. Todo lo que necesitas para comenzar tu presencia digital.
            </p>
          </div>

          <div className="cards-grid cards-grid-3">
            {planes.map((plan, index) => (
              <div key={index} className={`card pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && (
                  <div className="card-badge">Más Popular</div>
                )}
                
                <div className="card-header pricing-header">
                  <h3 className="pricing-title">{plan.name}</h3>
                  <div className="pricing-price">
                    <span className="pricing-currency">$</span>
                    {plan.price}
                    <span className="pricing-period">/{plan.period}</span>
                  </div>
                  <p className="pricing-description">{plan.description}</p>
                </div>

                <div className="card-body">
                  <ul className="pricing-features">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="card-footer pricing-footer">
                  <a href={plan.cta.href} className={plan.cta.className}>
                    {plan.cta.text}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee */}
          <div className="text-center mt-12">
            <div className="guarantee-box p-8 bg-secondary rounded-2xl border border-light">
              <div className="flex items-center justify-center gap-4 mb-4">
                <i className="fas fa-shield-alt text-3xl text-success"></i>
                <h3 className="text-2xl font-bold">Garantía de Satisfacción</h3>
              </div>
              <p className="text-lg text-secondary mb-4">
                Si no estás 100% satisfecho con tu sitio web, trabajamos hasta que lo estés o te devolvemos tu dinero.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check text-success"></i>
                  <span>30 días de garantía</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check text-success"></i>
                  <span>Revisiones ilimitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check text-success"></i>
                  <span>Soporte incluido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="section section-secondary">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-plus"></i>
              Servicios Adicionales
            </div>
            <h2 className="section-title">Potencia tu Sitio Web</h2>
            <p className="section-description">
              Servicios complementarios para maximizar el rendimiento de tu sitio web
            </p>
          </div>

          <div className="cards-grid cards-grid-4">
            {addons.map((addon, index) => (
              <div key={index} className="card feature-card">
                <div className="feature-icon">
                  <i className={addon.icon}></i>
                </div>
                <h3 className="feature-title">{addon.name}</h3>
                <p className="feature-text">{addon.description}</p>
                <div className="pricing-price mb-4">
                  <span className="pricing-currency">$</span>
                  {addon.price}
                  <span className="pricing-period">/{addon.period}</span>
                </div>
                <a href="/contacto" className="btn btn-outline">
                  Más Información
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-question-circle"></i>
              Preguntas Frecuentes
            </div>
            <h2 className="section-title">¿Tienes Dudas?</h2>
            <p className="section-description">
              Resolvemos las preguntas más comunes sobre nuestros planes
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <details className="group bg-secondary rounded-xl border border-light">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold">¿Qué incluye el hosting y dominio por 1 año?</h3>
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-secondary">
                    Incluimos el registro de tu dominio .com por un año completo y hosting en servidores confiables con 99.9% de uptime. 
                    Después del primer año, puedes renovar por $50 anuales o transferir a otro proveedor si prefieres.
                  </p>
                </div>
              </details>

              <details className="group bg-secondary rounded-xl border border-light">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold">¿Cuánto tiempo toma desarrollar mi sitio web?</h3>
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-secondary">
                    El plan Básico toma 7-10 días, el Profesional 15-20 días, y el Premium 25-30 días. 
                    El tiempo puede variar según la complejidad y la rapidez en la entrega de contenidos.
                  </p>
                </div>
              </details>

              <details className="group bg-secondary rounded-xl border border-light">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold">¿Puedo actualizar mi plan después?</h3>
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-secondary">
                    ¡Por supuesto! Puedes actualizar tu plan en cualquier momento pagando solo la diferencia. 
                    También ofrecemos funcionalidades adicionales según tus necesidades.
                  </p>
                </div>
              </details>

              <details className="group bg-secondary rounded-xl border border-light">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold">¿Qué pasa si necesito más páginas?</h3>
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-secondary">
                    Puedes agregar páginas adicionales por $30 cada una. También podemos evaluar actualizar 
                    tu plan si necesitas muchas páginas adicionales para que sea más económico.
                  </p>
                </div>
              </details>

              <details className="group bg-secondary rounded-xl border border-light">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold">¿Ofrecen soporte después de la entrega?</h3>
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-secondary">
                    Sí, todos los planes incluyen 30 días de soporte gratuito. Después puedes contratar 
                    nuestro plan de mantenimiento mensual o soporte por horas según necesites.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="section-title">¿Listo para Comenzar?</h2>
            <p className="section-subtitle">
              Elige tu plan y comienza tu transformación digital hoy mismo. 
              ¡Tu competencia no esperará!
            </p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/+543541237972?text=Hola%2C%20quiero%20contratar%20un%20plan%20de%20desarrollo%20web"
                className="cta-button primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
                Consultar por WhatsApp
              </a>
              <a href="/contacto" className="cta-button secondary">
                <i className="fas fa-envelope"></i>
                Contactar por Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
