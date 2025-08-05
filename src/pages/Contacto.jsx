import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    service: '',
    budget: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        business: '',
        service: '',
        budget: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: 'fas fa-phone',
      title: 'Llamada Directa',
      content: '+54 3541 237972',
      link: 'tel:+543541237972',
      subtitle: 'Lunes a Viernes 9:00 - 18:00'
    },
    {
      icon: 'fab fa-whatsapp',
      title: 'WhatsApp',
      content: '+54 3541 237972',
      link: 'https://wa.me/+543541237972',
      subtitle: 'Respuesta en menos de 1 hora'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      content: '23sarmiento@gmail.com',
      link: 'mailto:23sarmiento@gmail.com',
      subtitle: 'Respuesta en 24 horas'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Ubicación',
      content: 'Villa Carlos Paz, Córdoba',
      link: null,
      subtitle: 'Atendemos toda la región'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Contacto | Desarrollo Web Villa Carlos Paz | hgaruna</title>
        <meta 
          name="description" 
          content="Contáctanos para tu proyecto de desarrollo web en Villa Carlos Paz. Consulta gratuita, respuesta rápida. WhatsApp, email y teléfono disponibles." 
        />
        <meta 
          name="keywords" 
          content="contacto desarrollo web villa carlos paz, presupuesto sitio web, consulta gratuita desarrollo web, programador web villa carlos paz contacto" 
        />
      </Helmet>

      <div className="pt-20">
        {/* Header */}
        <section className="section-sm section-primary">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-envelope"></i>
                Contacto
              </div>
              <h1 className="section-title">¡Hablemos de tu Proyecto!</h1>
              <p className="section-description">
                Estamos aquí para ayudarte a hacer crecer tu negocio en Villa Carlos Paz. 
                La primera consulta es completamente gratuita.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact-section">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Info */}
              <div className="contact-info">
                <h2 className="contact-info-title">Información de Contacto</h2>
                <p className="mb-8 text-secondary">
                  Elige la forma de contacto que prefieras. Estamos disponibles para responder 
                  todas tus preguntas sobre desarrollo web y marketing digital.
                </p>

                <div className="contact-items">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-item">
                      <div className="contact-item-icon">
                        <i className={info.icon}></i>
                      </div>
                      <div className="contact-item-content">
                        <h4>{info.title}</h4>
                        {info.link ? (
                          <a 
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p>{info.content}</p>
                        )}
                        <small>{info.subtitle}</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <div className="bg-success/10 border border-success/20 rounded-2xl p-6 mt-8">
                  <h3 className="text-xl font-bold mb-3 text-success">
                    <i className="fab fa-whatsapp mr-2"></i>
                    ¿Prefieres WhatsApp?
                  </h3>
                  <p className="mb-4 text-secondary">
                    Es la forma más rápida de contactarnos. Respuesta garantizada en menos de 1 hora.
                  </p>
                  <a
                    href="https://wa.me/+543541237972?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20sus%20servicios%20de%20desarrollo%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz"
                    className="btn btn-success"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp mr-2"></i>
                    ¡Chatear Ahora!
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-container">
                <div className="contact-form">
                  <div className="contact-form-header">
                    <h2 className="contact-form-title">Cuéntanos sobre tu Proyecto</h2>
                    <p className="contact-form-description">
                      Completa el formulario y te contactaremos en menos de 2 horas con una propuesta personalizada.
                    </p>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-check-circle text-success text-xl"></i>
                        <div>
                          <h4 className="font-semibold text-success">¡Mensaje enviado!</h4>
                          <p className="text-sm text-secondary">Te contactaremos pronto con una propuesta personalizada.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3">
                        <i className="fas fa-exclamation-triangle text-error text-xl"></i>
                        <div>
                          <h4 className="font-semibold text-error">Error al enviar</h4>
                          <p className="text-sm text-secondary">Intenta nuevamente o contáctanos por WhatsApp.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label required">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label required">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="+54 9 3541 123456"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="business" className="form-label">
                          Nombre del negocio
                        </label>
                        <input
                          type="text"
                          id="business"
                          name="business"
                          value={formData.business}
                          onChange={handleChange}
                          className="form-input"
                          placeholder="Ej: Restaurante La Esquina"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="service" className="form-label required">
                          ¿Qué necesitas?
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="form-select"
                          required
                        >
                          <option value="">Selecciona lo que necesitas</option>
                          <option value="sitio-web">Sitio Web Profesional</option>
                          <option value="e-commerce">Tienda Online</option>
                          <option value="seo">SEO Local</option>
                          <option value="marketing">Marketing Digital</option>
                          <option value="rediseno">Rediseño de Sitio Web</option>
                          <option value="mantenimiento">Mantenimiento Web</option>
                          <option value="otro">Otro (especificar en mensaje)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="budget" className="form-label">
                          Presupuesto aproximado
                        </label>
                        <select
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Selecciona tu presupuesto</option>
                          <option value="150-300">$150 - $300</option>
                          <option value="300-500">$300 - $500</option>
                          <option value="500-1000">$500 - $1000</option>
                          <option value="1000+">Más de $1000</option>
                          <option value="no-se">No sé, necesito asesoría</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message" className="form-label required">
                        Cuéntanos más sobre tu proyecto
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Describe tu proyecto, objetivos, timeline, etc. Cuanto más detalles nos des, mejor podremos ayudarte."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="form-submit">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn btn-primary btn-lg ${isSubmitting ? 'btn-loading' : ''}`}
                      >
                        {!isSubmitting && <i className="fas fa-paper-plane mr-2"></i>}
                        {isSubmitting ? 'Enviando...' : '¡Enviar Propuesta Gratuita!'}
                      </button>
                      <p className="form-note">
                        * Recibirás una propuesta personalizada en menos de 2 horas
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section section-secondary">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-question-circle"></i>
                Preguntas Frecuentes
              </div>
              <h2 className="section-title">¿Tienes Dudas?</h2>
              <p className="section-description">
                Resolvemos las preguntas más comunes antes de contactarnos
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <details className="group bg-primary/5 border border-primary/20 rounded-xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">¿Cuánto tiempo toma desarrollar un sitio web?</h3>
                    <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-secondary">
                      Depende del plan: Básico 7-10 días, Profesional 15-20 días, Premium 25-30 días. 
                      El tiempo puede variar según la complejidad y rapidez en la entrega de contenidos.
                    </p>
                  </div>
                </details>

                <details className="group bg-primary/5 border border-primary/20 rounded-xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">¿La consulta inicial realmente es gratuita?</h3>
                    <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-secondary">
                      Sí, completamente gratuita y sin compromiso. Analizamos tus necesidades, 
                      te asesoramos sobre la mejor solución y te damos un presupuesto detallado.
                    </p>
                  </div>
                </details>

                <details className="group bg-primary/5 border border-primary/20 rounded-xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">¿Trabajan con empresas fuera de Villa Carlos Paz?</h3>
                    <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-secondary">
                      Sí, trabajamos con clientes de toda Argentina y otros países. 
                      Nos especializamos en Villa Carlos Paz pero no nos limitamos a la zona.
                    </p>
                  </div>
                </details>

                <details className="group bg-primary/5 border border-primary/20 rounded-xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="text-lg font-semibold">¿Qué necesito tener listo antes de contactarlos?</h3>
                    <i className="fas fa-chevron-down group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-secondary">
                      Solo necesitas tener clara la idea de lo que quieres lograr. Nosotros te ayudamos 
                      con todo lo demás: contenido, imágenes, estructura, diseño, etc.
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
              <h2 className="section-title">¿Prefieres Hablar Directamente?</h2>
              <p className="section-subtitle">
                A veces es más fácil explicar tu proyecto por teléfono o WhatsApp. 
                ¡Estamos disponibles para una charla!
              </p>
              <div className="cta-buttons">
                <a
                  href="https://wa.me/+543541237972?text=Hola%2C%20quiero%20hablar%20sobre%20mi%20proyecto%20web"
                  className="cta-button primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-whatsapp"></i>
                  Hablar por WhatsApp
                </a>
                <a
                  href="tel:+543541237972"
                  className="cta-button secondary"
                >
                  <i className="fas fa-phone"></i>
                  Llamar Ahora
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
