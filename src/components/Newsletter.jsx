import React, { useState } from 'react';
import './Newsletter.css';

export default function Newsletter({ 
  title = "¡No te pierdas nada!",
  subtitle = "Suscríbete para recibir los mejores tutoriales y recursos directamente en tu email",
  placeholder = "tu@email.com",
  buttonText = "Suscribirse",
  compact = false
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Por favor, ingresa tu email');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Por favor, ingresa un email válido');
      return;
    }

    setStatus('loading');
    
    try {
      // Simular envío a newsletter service
      // En producción aquí iría la llamada a tu API de newsletter
      const response = await subscribeToNewsletter({ email, name });
      
      if (response.success) {
        setStatus('success');
        setMessage('¡Suscripción exitosa! Revisa tu email para confirmar.');
        setEmail('');
        setName('');
        
        // Opcional: track en analytics
        if (window.gtag) {
          window.gtag('event', 'newsletter_subscribe', {
            event_category: 'engagement',
            event_label: 'newsletter'
          });
        }
      } else {
        throw new Error(response.message || 'Error al suscribir');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Hubo un error. Intenta nuevamente.');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const subscribeToNewsletter = async ({ email, name }) => {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular éxito en 95% de los casos
        if (Math.random() > 0.05) {
          resolve({ success: true });
        } else {
          resolve({ 
            success: false, 
            message: 'Este email ya está suscrito' 
          });
        }
      }, 1500);
    });
  };

  const resetStatus = () => {
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  React.useEffect(() => {
    if (status === 'success' || status === 'error') {
      resetStatus();
    }
  }, [status]);

  if (compact) {
    return (
      <div className="newsletter-compact">
        <form onSubmit={handleSubmit} className="newsletter-form-compact">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            disabled={status === 'loading'}
            className="newsletter-input-compact"
          />
          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="newsletter-button-compact"
          >
            {status === 'loading' ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-rocket"></i>
                {buttonText}
              </>
            )}
          </button>
        </form>
        
        {status === 'success' && (
          <div className="newsletter-message success">
            <i className="fas fa-check-circle"></i>
            {message}
          </div>
        )}
        
        {status === 'error' && (
          <div className="newsletter-message error">
            <i className="fas fa-exclamation-circle"></i>
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="newsletter-container">
      <div className="newsletter-content">
        <div className="newsletter-header">
          <h2 className="newsletter-title">
            <i className="fas fa-envelope"></i>
            {title}
          </h2>
          <p className="newsletter-subtitle">{subtitle}</p>
        </div>

        {status === 'success' ? (
          <div className="newsletter-success">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>¡Bienvenido a la comunidad!</h3>
            <p>{message}</p>
            <div className="success-benefits">
              <div className="benefit">
                <i className="fas fa-newspaper"></i>
                <span>Artículos exclusivos semanales</span>
              </div>
              <div className="benefit">
                <i className="fas fa-gift"></i>
                <span>Recursos y herramientas gratis</span>
              </div>
              <div className="benefit">
                <i className="fas fa-bolt"></i>
                <span>Acceso anticipado a contenido</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre (opcional)"
                  disabled={status === 'loading'}
                  className="newsletter-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  required
                  disabled={status === 'loading'}
                  className="newsletter-input"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="newsletter-button"
            >
              {status === 'loading' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Suscribiendo...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket"></i>
                  {buttonText}
                </>
              )}
            </button>

            {status === 'error' && (
              <div className="newsletter-message error">
                <i className="fas fa-exclamation-circle"></i>
                {message}
              </div>
            )}
          </form>
        )}

        <div className="newsletter-benefits">
          <div className="benefit-item">
            <i className="fas fa-shield-alt"></i>
            <span>Sin spam. Cancela cuando quieras.</span>
          </div>
          <div className="benefit-item">
            <i className="fas fa-users"></i>
            <span>Únete a 25,000+ desarrolladores</span>
          </div>
          <div className="benefit-item">
            <i className="fas fa-heart"></i>
            <span>Solo contenido de calidad</span>
          </div>
        </div>

        <p className="newsletter-privacy">
          Al suscribirte, aceptas nuestra <a href="/politicas-privacidad">política de privacidad</a>. 
          Respetamos tu inbox y tu privacidad.
        </p>
      </div>
    </div>
  );
}

// Hook personalizado para usar el newsletter
export function useNewsletter() {
  const [subscribers, setSubscribers] = useState(0);

  React.useEffect(() => {
    // Cargar número de suscriptores
    const loadSubscriberCount = async () => {
      try {
        // En producción esto vendría de tu API
        setSubscribers(25247);
      } catch (error) {
        console.error('Error loading subscriber count:', error);
      }
    };

    loadSubscriberCount();
  }, []);

  return {
    subscribers,
    formatSubscribers: (count) => {
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toLocaleString();
    }
  };
}

// Componente para mostrar contador de suscriptores
export function SubscriberCount() {
  const { subscribers, formatSubscribers } = useNewsletter();

  return (
    <div className="subscriber-count">
      <i className="fas fa-users"></i>
      <span>
        {formatSubscribers(subscribers)} desarrolladores ya suscriptos
      </span>
    </div>
  );
}
