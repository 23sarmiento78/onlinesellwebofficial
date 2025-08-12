import React, { useState } from 'react';
import { AdSenseBanner } from '../components/AdSenseAd';
import './Contacto.css';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactTypes = [
    { value: 'general', label: 'Consulta General', icon: 'fas fa-question-circle' },
    { value: 'ebook', label: 'eBook / Contenido Premium', icon: 'fas fa-book' },
    { value: 'collaboration', label: 'Colaboración / Partnership', icon: 'fas fa-handshake' },
    { value: 'technical', label: 'Soporte Técnico', icon: 'fas fa-wrench' },
    { value: 'business', label: 'Propuesta de Negocio', icon: 'fas fa-briefcase' }
  ];

  const contactMethods = [
    {
      title: 'WhatsApp',
      description: 'Respuesta rápida para consultas urgentes',
      icon: 'fab fa-whatsapp',
      color: '#25d366',
      link: 'https://wa.me/5491234567890',
      linkText: 'Enviar WhatsApp',
      availability: '9:00 - 18:00 (GMT-3)'
    },
    {
      title: 'Email',
      description: 'Para consultas detalladas y documentación',
      icon: 'fas fa-envelope',
      color: '#64ffda',
      link: 'mailto:contacto@hgaruna.com',
      linkText: 'contacto@hgaruna.com',
      availability: 'Respuesta en 24-48h'
    },
    {
      title: 'LinkedIn',
      description: 'Conecta para oportunidades profesionales',
      icon: 'fab fa-linkedin',
      color: '#0077b5',
      link: 'https://linkedin.com/company/hgaruna',
      linkText: 'Conectar en LinkedIn',
      availability: 'Red profesional'
    }
  ];

  const faq = [
    {
      question: '¿Cuál es el tiempo promedio de respuesta?',
      answer: 'Nos comprometemos a responder todas las consultas en menos de 24 horas hábiles. Para consultas urgentes, recomendamos usar nuestro canal de WhatsApp donde la respuesta suele ser inmediata durante el horario laboral (9:00 - 18:00 GMT-3).',
      icon: 'fas fa-clock'
    },
    {
      question: '¿Qué servicios de desarrollo web ofrecen?',
      answer: 'Ofrecemos un amplio espectro de servicios de desarrollo web, incluyendo: diseño y desarrollo de sitios web responsivos, desarrollo de aplicaciones web personalizadas, optimización SEO, integración de sistemas, consultoría técnica y mantenimiento continuo. Cada proyecto se adapta a las necesidades específicas del cliente.',
      icon: 'fas fa-code'
    },
    {
      question: '¿Cómo funciona el proceso de colaboración?',
      answer: 'Nuestro proceso de colaboración se divide en 4 etapas: 1) Consulta inicial y relevamiento de requisitos, 2) Propuesta detallada y presupuesto, 3) Desarrollo iterativo con feedback constante, 4) Implementación y soporte post-lanzamiento. Mantenemos una comunicación clara y transparente durante todo el proceso.',
      icon: 'fas fa-handshake'
    },
    {
      question: '¿Cuáles son los métodos de pago aceptados?',
      answer: 'Aceptamos múltiples métodos de pago para tu comodidad: transferencia bancaria, tarjetas de crédito/débito, PayPal, y criptomonedas. Ofrecemos planes de pago flexibles para proyectos grandes, con la posibilidad de dividir los pagos en hitos del proyecto.',
      icon: 'fas fa-credit-card'
    },
    {
      question: '¿Ofrecen soporte técnico continuo?',
      answer: 'Sí, ofrecemos planes de soporte técnico continuo que incluyen mantenimiento preventivo, actualizaciones de seguridad, backups regulares, y resolución de problemas. También proporcionamos capacitación para que tu equipo pueda gestionar el sistema de forma independiente.',
      icon: 'fas fa-headset'
    },
    {
      question: '¿Realizan proyectos para clientes internacionales?',
      answer: 'Absolutamente. Trabajamos con clientes de todo el mundo y tenemos experiencia en gestión de proyectos remotos. Utilizamos herramientas de colaboración en línea y nos adaptamos a diferentes zonas horarias para garantizar una comunicación efectiva.',
      icon: 'fas fa-globe'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica real de envío del formulario
      // Por ahora simulamos una respuesta exitosa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `¡Hola! Me contacto desde hgaruna.com. Me interesa: ${contactTypes.find(t => t.value === formData.type)?.label}`
    );
    window.open(`https://wa.me/5491234567890?text=${message}`, '_blank');
  };

  return (
    <div className="contacto-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="hero-grid"></div>
          <div className="hero-glow"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-main">
              <div className="hero-badge">
                <i className="fas fa-headset"></i>
                Soporte Prioritario 24/7
              </div>
              <h1 className="hero-title">
                Conecta con Nuestro Equipo
              </h1>
              <p className="hero-description">
                Estamos aquí para impulsar tus ideas y proyectos al siguiente nivel.
                Nuestro equipo de expertos está listo para ayudarte.
              </p>
              <div className="hero-actions">
                <button onClick={handleWhatsAppClick} className="hero-button primary">
                  <i className="fab fa-whatsapp"></i>
                  Chat Instantáneo
                </button>
                <a href="#contact-form" className="hero-button secondary">
                  <i className="fas fa-envelope"></i>
                  Enviar Mensaje
                </a>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-bolt"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">&lt; 24h</span>
                  <span className="stat-label">Tiempo de respuesta</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Consultas resueltas</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="stat-info">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfacción</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="contact-methods">
        <div className="container">
          <h2 className="section-title">
            <i className="fas fa-phone"></i>
            Múltiples Formas de Contactar
          </h2>
          
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card" style={{'--method-color': method.color}}>
                <div className="method-icon">
                  <i className={method.icon}></i>
                </div>
                <h3 className="method-title">{method.title}</h3>
                <p className="method-description">{method.description}</p>
                <a 
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="method-link"
                >
                  {method.linkText}
                  <i className="fas fa-external-link-alt"></i>
                </a>
                <div className="method-availability">
                  <i className="fas fa-clock"></i>
                  {method.availability}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense Banner */}
      <div className="adsense-container">
        <AdSenseBanner />
      </div>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2 className="section-title">
                <i className="fas fa-paper-plane"></i>
                Envía tu Consulta
              </h2>
              <p className="section-subtitle">
                Completa el formulario y nos pondremos en contacto contigo pronto
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <h3>¡Mensaje enviado exitosamente!</h3>
                <p>Gracias por contactarnos. Te responderemos en las próximas 24 horas.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <h3>Error al enviar el mensaje</h3>
                <p>Hubo un problema al enviar tu mensaje. Por favor, intenta nuevamente o contáctanos por WhatsApp.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <i className="fas fa-user"></i>
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <i className="fas fa-envelope"></i>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="type">
                  <i className="fas fa-tag"></i>
                  Tipo de consulta *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {contactTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  <i className="fas fa-lightbulb"></i>
                  Asunto *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Resumen de tu consulta"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <i className="fas fa-comment"></i>
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Describe tu consulta o proyecto en detalle..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Enviar Mensaje
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  className="btn btn-whatsapp"
                  onClick={handleWhatsAppClick}
                >
                  <i className="fab fa-whatsapp"></i>
                  WhatsApp Directo
                </button>
              </div>

              <p className="form-privacy">
                <i className="fas fa-shield-alt"></i>
                Tu información está protegida. Consulta nuestra 
                <a href="/politicas-privacidad"> política de privacidad</a>.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">
            <i className="fas fa-question-circle"></i>
            Respuestas a Tus Dudas
          </h2>
          
          <div className="faq-list">
            {faq.map((item, index) => (
              <FAQItem 
                key={index} 
                question={item.question} 
                answer={item.answer}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="alternative-contact">
        <div className="container">
          <div className="contact-cta">
            <div className="cta-content">
              <span className="cta-badge">
                <i className="fas fa-bolt"></i>
                Respuesta Rápida
              </span>
              <h2>¿Necesitas una Respuesta Inmediata?</h2>
              <p>Nuestro equipo de expertos está listo para ayudarte al instante a través de WhatsApp</p>
              <button 
                className="btn btn-whatsapp btn-large"
                onClick={handleWhatsAppClick}
              >
                <i className="fab fa-whatsapp"></i>
                Iniciar Chat en WhatsApp
              </button>
              <div className="availability-note">
                <i className="fas fa-clock pulse"></i>
                <div className="availability-text">
                  <span className="availability-label">Horario de Atención</span>
                  <span className="availability-hours">Lunes a Viernes, 9:00 - 18:00 (GMT-3)</span>
                </div>
              </div>
            </div>
            <div className="cta-decoration">
              <i className="fas fa-comments-alt"></i>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// FAQ Component
function FAQItem({ question, answer, icon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button 
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="question-content">
          <div className="question-icon">
            <i className={icon}></i>
          </div>
          <span>{question}</span>
        </div>
        <div className="question-toggle">
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </div>
      </button>
      <div className={`faq-answer ${isOpen ? 'active' : ''}`}>
        <div className="answer-content">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}
