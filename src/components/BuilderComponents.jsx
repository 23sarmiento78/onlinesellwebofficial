import React from 'react';
import { Builder } from '@builder.io/sdk';
import { registerComponent } from '../utils/builder';

// Componente Hero personalizado
function HeroComponent(props) {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <img src={props.image || '/logos-he-imagenes/fondo-hero.jpg'} alt="Fondo hero" />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{props.title || 'Título del Hero'}</h1>
        <p className="hero-subtitle">{props.subtitle || 'Subtítulo del hero'}</p>
        {props.ctaText && (
          <div className="hero-cta">
            <a href={props.ctaLink || '#'} className="cta-button primary">
              {props.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

// Componente de contenido de texto
function TextContentComponent(props) {
  return (
    <section className="text-content-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2>{props.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: props.content }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente de servicios
function ServicesComponent(props) {
  const services = props.services || [];
  
  return (
    <section className="services-section py-5">
      <div className="container">
        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="service-card">
                <div className="service-icon">
                  <i className={service.icon || 'fas fa-cog'}></i>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Componente de contacto
function ContactComponent(props) {
  return (
    <section className="contact-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2>{props.title || 'Contáctanos'}</h2>
            <div className="contact-info">
              <p><i className="fas fa-phone"></i> {props.phone || '+54 3541 237972'}</p>
              <p><i className="fas fa-envelope"></i> {props.email || '23sarmiento@gmail.com'}</p>
              <p><i className="fas fa-map-marker-alt"></i> {props.address || 'Villa Carlos Paz, Córdoba'}</p>
            </div>
            {props.showWhatsApp && (
              <a href="https://wa.link/6t7cxa" className="btn-filled" target="_blank" rel="noopener">
                <i className="fab fa-whatsapp"></i>
                Contactar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Registrar componentes en Builder.io
export function registerBuilderComponents() {
  // Hero Component
  registerComponent(HeroComponent, {
    name: 'Hero',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Título del Hero' },
      { name: 'subtitle', type: 'string', defaultValue: 'Subtítulo del hero' },
      { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'webp'] },
      { name: 'ctaText', type: 'string', defaultValue: 'Comenzar' },
      { name: 'ctaLink', type: 'string', defaultValue: '#' }
    ]
  });

  // Text Content Component
  registerComponent(TextContentComponent, {
    name: 'Text Content',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Título de la sección' },
      { name: 'content', type: 'richText', defaultValue: '<p>Contenido de la sección...</p>' }
    ]
  });

  // Services Component
  registerComponent(ServicesComponent, {
    name: 'Services',
    inputs: [
      {
        name: 'services',
        type: 'list',
        subFields: [
          { name: 'title', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'icon', type: 'string', defaultValue: 'fas fa-cog' }
        ]
      }
    ]
  });

  // Contact Component
  registerComponent(ContactComponent, {
    name: 'Contact',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Contáctanos' },
      { name: 'phone', type: 'string', defaultValue: '+54 3541 237972' },
      { name: 'email', type: 'string', defaultValue: '23sarmiento@gmail.com' },
      { name: 'address', type: 'string', defaultValue: 'Villa Carlos Paz, Córdoba' },
      { name: 'showWhatsApp', type: 'boolean', defaultValue: true }
    ]
  });
}

export {
  HeroComponent,
  TextContentComponent,
  ServicesComponent,
  ContactComponent
}; 