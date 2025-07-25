import React from 'react';
import { Builder, builder } from '@builder.io/sdk';
import { BuilderComponent } from '@builder.io/react';

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

// Componente de LinkedIn Integration
function LinkedInComponent(props) {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [lastPublished, setLastPublished] = React.useState(null);

  React.useEffect(() => {
    // Verificar si hay token de LinkedIn
    const token = localStorage.getItem('linkedin_access_token');
    setIsConnected(!!token);
  }, []);

  const handleConnectLinkedIn = () => {
    // Redirigir a autenticación de LinkedIn
    const clientId = '77d1u4hecolzrd';
    const redirectUri = encodeURIComponent('https://hgaruna.org/linkedin-callback.html');
    const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
    const state = Math.random().toString(36).substring(7);
    
    sessionStorage.setItem('linkedin_auth_state', state);
    
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    
    window.open(authUrl, 'linkedin_auth', 'width=600,height=600');
  };

  const handlePublishToLinkedIn = async () => {
    if (!isConnected) {
      alert('Primero debes conectar tu cuenta de LinkedIn');
      return;
    }

    setIsPublishing(true);
    try {
      const token = localStorage.getItem('linkedin_access_token');
      const content = props.content || 'Contenido de prueba desde Builder.io';
      
      const response = await fetch('/.netlify/functions/linkedin-api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          accessToken: token
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setLastPublished(new Date().toLocaleString());
        alert('¡Publicado exitosamente en LinkedIn!');
      } else {
        alert('Error al publicar: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al publicar en LinkedIn');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('linkedin_access_token');
    setIsConnected(false);
    setLastPublished(null);
  };

  return (
    <section className="linkedin-integration-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="linkedin-card">
              <div className="linkedin-header">
                <i className="fab fa-linkedin"></i>
                <h3>{props.title || 'Integración con LinkedIn'}</h3>
              </div>
              
              <div className="linkedin-status">
                <p>
                  <strong>Estado:</strong> 
                  {isConnected ? (
                    <span className="text-success">✅ Conectado</span>
                  ) : (
                    <span className="text-warning">❌ No conectado</span>
                  )}
                </p>
                
                {lastPublished && (
                  <p><strong>Última publicación:</strong> {lastPublished}</p>
                )}
              </div>

              <div className="linkedin-actions">
                {!isConnected ? (
                  <button 
                    onClick={handleConnectLinkedIn}
                    className="btn-linkedin-connect"
                  >
                    <i className="fab fa-linkedin"></i>
                    Conectar LinkedIn
                  </button>
                ) : (
                  <div className="linkedin-connected-actions">
                    <button 
                      onClick={handlePublishToLinkedIn}
                      disabled={isPublishing}
                      className="btn-linkedin-publish"
                    >
                      {isPublishing ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Publicando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-share"></i>
                          Publicar en LinkedIn
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleDisconnect}
                      className="btn-linkedin-disconnect"
                    >
                      <i className="fas fa-unlink"></i>
                      Desconectar
                    </button>
                  </div>
                )}
              </div>

              {props.showContent && (
                <div className="linkedin-content-preview">
                  <h4>Vista previa del contenido:</h4>
                  <div className="content-preview">
                    {props.content || 'Contenido de ejemplo para LinkedIn...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Registrar componentes en Builder.io
export function registerBuilderComponents() {
  // Hero Component
  Builder.registerComponent(HeroComponent, {
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
  Builder.registerComponent(TextContentComponent, {
    name: 'Text Content',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Título de la sección' },
      { name: 'content', type: 'richText', defaultValue: '<p>Contenido de la sección...</p>' }
    ]
  });

  // Services Component
  Builder.registerComponent(ServicesComponent, {
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
  Builder.registerComponent(ContactComponent, {
    name: 'Contact',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Contáctanos' },
      { name: 'phone', type: 'string', defaultValue: '+54 3541 237972' },
      { name: 'email', type: 'string', defaultValue: '23sarmiento@gmail.com' },
      { name: 'address', type: 'string', defaultValue: 'Villa Carlos Paz, Córdoba' },
      { name: 'showWhatsApp', type: 'boolean', defaultValue: true }
    ]
  });

  // LinkedIn Component
  Builder.registerComponent(LinkedInComponent, {
    name: 'LinkedIn Integration',
    inputs: [
      { name: 'title', type: 'string', defaultValue: 'Integración con LinkedIn' },
      { name: 'content', type: 'text', defaultValue: 'Contenido de ejemplo para LinkedIn...' },
      { name: 'showContent', type: 'boolean', defaultValue: true }
    ]
  });
}

export {
  HeroComponent,
  TextContentComponent,
  ServicesComponent,
  ContactComponent,
  LinkedInComponent
}; 