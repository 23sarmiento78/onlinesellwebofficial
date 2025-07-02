import React from 'react';
import BaseLayout from '../layouts/BaseLayout';

export default function Contacto() {
  return (
    <BaseLayout
      title="Contacto - hgaruna"
      description="Contáctanos para tu proyecto de desarrollo web en Villa Carlos Paz. Consultas, cotizaciones y soporte técnico."
    >
      <div className="contact-container">
        <div className="contact-header">
          <h1>📞 Contacto</h1>
          <p className="subtitle">¿Listo para transformar tu negocio digitalmente?</p>
        </div>
        <div className="contact-content">
          <div className="contact-info">
            <h2>🚀 Comencemos tu proyecto</h2>
            <p>
              ¿Tienes una idea para tu sitio web? ¿Necesitas mejorar tu presencia online?
              Estoy aquí para ayudarte a hacer realidad tu visión digital.
            </p>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-details">
                  <h3>WhatsApp (Recomendado)</h3>
                  <p>Respuesta rápida y directa</p>
                  <a href="https://wa.link/6t7cxa" className="btn-primary" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp"></i>
                    Chatear por WhatsApp
                  </a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>Para consultas detalladas</p>
                  <a href="mailto:23sarmiento@gmail.com" className="btn-secondary">
                    <i className="fas fa-envelope"></i>
                    Enviar Email
                  </a>
                </div>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h3>Ubicación</h3>
                  <p>Villa Carlos Paz, Córdoba</p>
                  <span className="location-info">
                    <i className="fas fa-map-marker-alt"></i>
                    Servicios en toda la región
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-cta">
            <h2>💡 ¿Qué necesitas?</h2>
            <div className="services-grid">
              <div className="service-card">
                <i className="fas fa-laptop-code"></i>
                <h3>Sitio Web Profesional</h3>
                <p>Diseño moderno y funcional</p>
              </div>
              <div className="service-card">
                <i className="fas fa-shopping-cart"></i>
                <h3>E-commerce</h3>
                <p>Tienda online completa</p>
              </div>
              <div className="service-card">
                <i className="fas fa-search"></i>
                <h3>SEO Local</h3>
                <p>Posicionamiento en Google</p>
              </div>
              <div className="service-card">
                <i className="fas fa-bullhorn"></i>
                <h3>Marketing Digital</h3>
                <p>Estrategias de crecimiento</p>
              </div>
            </div>
            <div className="cta-buttons">
              <a href="https://wa.link/6t7cxa" className="btn-primary large" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
                Solicitar Cotización Gratuita
              </a>
              <a href="/planes/" className="btn-secondary large">
                <i className="fas fa-tags"></i>
                Ver Planes y Precios
              </a>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 