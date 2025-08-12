import React from 'react';

class AdSenseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Verificar si es un error relacionado con AdSense
    if (error && (
      error.message?.includes('adsbygoogle') ||
      error.message?.includes('TagError') ||
      error.message?.includes('googlesyndication') ||
      error.stack?.includes('pagead2.googlesyndication.com')
    )) {
      return { hasError: true, error };
    }
    
    // Si no es un error de AdSense, dejarlo pasar
    return null;
  }

  componentDidCatch(error, errorInfo) {
    // Solo capturar errores de AdSense
    if (error && (
      error.message?.includes('adsbygoogle') ||
      error.message?.includes('TagError') ||
      error.message?.includes('googlesyndication')
    )) {
      console.warn('AdSense Error Caught:', error, errorInfo);
      
      // Opcional: enviar error a servicio de monitoreo
      if (this.props.onAdSenseError) {
        this.props.onAdSenseError(error, errorInfo);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Mostrar un fallback silencioso para errores de AdSense
      return (
        <div className="adsense-error-fallback" style={{
          padding: '20px',
          margin: '10px 0',
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          textAlign: 'center',
          color: '#6c757d',
          fontSize: '14px'
        }}>
          {process.env.NODE_ENV === 'development' ? (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#ffc107' }}></i>
              </div>
              <strong>AdSense Error</strong>
              <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                {this.state.error?.message || 'Unknown AdSense error'}
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.5 }}>
              <i className="fas fa-ad"></i>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para manejar errores globales de AdSense
export const useAdSenseErrorHandler = () => {
  React.useEffect(() => {
    const handleGlobalError = (event) => {
      // Verificar si es un error de AdSense
      if (event.error && (
        event.error.message?.includes('adsbygoogle') ||
        event.error.message?.includes('TagError') ||
        event.filename?.includes('pagead2.googlesyndication.com')
      )) {
        console.warn('Global AdSense Error:', event.error);
        
        // Prevenir que el error se propague y rompa la aplicación
        event.preventDefault();
        event.stopPropagation();
        
        // Intentar reinicializar AdSense después de un delay
        setTimeout(() => {
          try {
            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
              // Limpiar cualquier estado corrupto
              window.adsbygoogle.length = 0;
            }
          } catch (e) {
            console.warn('Failed to reset AdSense state:', e);
          }
        }, 1000);
        
        return false;
      }
    };

    const handleUnhandledRejection = (event) => {
      // Manejar promesas rechazadas relacionadas con AdSense
      if (event.reason && (
        event.reason.message?.includes('adsbygoogle') ||
        event.reason.message?.includes('TagError')
      )) {
        console.warn('AdSense Promise Rejection:', event.reason);
        event.preventDefault();
        return false;
      }
    };

    // Agregar listeners globales
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};

// Componente para inicializar AdSense de manera segura
export const AdSenseInitializer = ({ children }) => {
  const [isReady, setIsReady] = React.useState(false);
  
  React.useEffect(() => {
    const initializeAdSense = () => {
      try {
        // Verificar que el script esté cargado
        if (typeof window.adsbygoogle !== 'undefined') {
          // Asegurar que adsbygoogle es un array
          if (!Array.isArray(window.adsbygoogle)) {
            window.adsbygoogle = [];
          }
          
          setIsReady(true);
          return;
        }

        // Si no está disponible, reintentar
        const checkAdSense = () => {
          if (typeof window.adsbygoogle !== 'undefined') {
            if (!Array.isArray(window.adsbygoogle)) {
              window.adsbygoogle = [];
            }
            setIsReady(true);
          } else {
            // Reintentar después de 500ms
            setTimeout(checkAdSense, 500);
          }
        };

        checkAdSense();
        
      } catch (error) {
        console.warn('AdSense initialization error:', error);
        // Marcar como listo incluso con error para no bloquear la app
        setIsReady(true);
      }
    };

    // Verificar si el documento está listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeAdSense);
    } else {
      initializeAdSense();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', initializeAdSense);
    };
  }, []);

  // Usar el error handler global
  useAdSenseErrorHandler();

  // Renderizar children solo cuando AdSense esté listo
  return isReady ? children : (
    <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
      <i className="fas fa-spinner fa-spin"></i>
      <div style={{ marginTop: '8px', fontSize: '14px' }}>
        Cargando contenido...
      </div>
    </div>
  );
};

export default AdSenseErrorBoundary;
