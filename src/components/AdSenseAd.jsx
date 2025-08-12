import React from 'react';
import { useAdSenseAd, isValidAdSlot, isDevelopmentMode } from '../hooks/useAdSense';

const AdSenseAd = ({ 
  slot, 
  format = 'auto', 
  layout = null,
  style = {},
  className = 'adsense-ad',
  responsive = true,
  width = null,
  height = null,
  allowInDev = false
}) => {
  const { adElementRef, isInitialized } = useAdSenseAd(slot, { allowInDev });

  // Si no hay slot válido o estamos en desarrollo, mostrar placeholder
  if (!isValidAdSlot(slot) || (isDevelopmentMode() && !allowInDev)) {
    return (
      <div className="adsense-placeholder" style={{ 
        padding: '20px', 
        background: '#f8f9fa', 
        textAlign: 'center', 
        color: '#6c757d',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        margin: '20px 0',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <i className="fas fa-ad" style={{ fontSize: '24px', color: '#adb5bd' }}></i>
        </div>
        <small>
          {isDevelopmentMode() ? 
            `AdSense Placeholder (${format})` : 
            'Espacio publicitario'
          }
        </small>
        {isDevelopmentMode() && (
          <div style={{ fontSize: '11px', color: '#868e96', marginTop: '4px' }}>
            Slot: {slot || 'No slot provided'}
          </div>
        )}
      </div>
    );
  }

  const adStyle = {
    display: 'block',
    ...style,
    ...(width && { width }),
    ...(height && { height })
  };

  const adProps = {
    ref: adElementRef,
    className: `adsbygoogle ${className}`,
    style: adStyle,
    'data-ad-client': 'ca-pub-7772175009790237',
    'data-ad-slot': slot,
    'data-ad-format': format,
    ...(responsive && { 'data-full-width-responsive': 'true' }),
    ...(layout && { 'data-ad-layout': layout }),
    // Solo agregar data-adtest en desarrollo si está permitido
    ...(isDevelopmentMode() && allowInDev && { 'data-adtest': 'on' })
  };

  return (
    <div className="adsense-container" style={{ 
      margin: '20px 0', 
      textAlign: 'center',
      minHeight: layout === 'in-article' ? '100px' : '90px'
    }}>
      <ins {...adProps}></ins>
      {isDevelopmentMode() && allowInDev && (
        <div style={{ 
          fontSize: '10px', 
          color: '#868e96', 
          marginTop: '4px' 
        }}>
          AdSense {isInitialized ? 'Initialized' : 'Loading...'}
        </div>
      )}
    </div>
  );
};

// Componentes predefinidos con configuraciones optimizadas
export const AdSenseBanner = ({ slot, allowInDev = false }) => {
  return (
    <AdSenseAd 
      slot={slot} 
      format="auto" 
      style={{ display: 'block', minHeight: '90px' }}
      className="adsense-banner"
      allowInDev={allowInDev}
    />
  );
};

export const AdSenseSquare = ({ slot, allowInDev = false }) => {
  return (
    <AdSenseAd 
      slot={slot} 
      format="rectangle" 
      style={{ display: 'inline-block' }}
      className="adsense-square"
      width="300px"
      height="250px"
      responsive={false}
      allowInDev={allowInDev}
    />
  );
};

export const AdSenseInArticle = ({ slot, allowInDev = false }) => {
  return (
    <AdSenseAd 
      slot={slot} 
      format="fluid" 
      layout="in-article"
      style={{ display: 'block', textAlign: 'center', margin: '30px 0' }}
      className="adsense-in-article"
      allowInDev={allowInDev}
    />
  );
};

export const AdSenseMatchedContent = ({ slot, allowInDev = false }) => {
  return (
    <AdSenseAd 
      slot={slot} 
      format="autorelaxed" 
      style={{ display: 'block', margin: '30px 0' }}
      className="adsense-matched-content"
      allowInDev={allowInDev}
    />
  );
};

export const AdSenseSidebar = ({ slot, allowInDev = false }) => {
  return (
    <AdSenseAd 
      slot={slot} 
      format="auto" 
      style={{ display: 'block' }}
      className="adsense-sidebar"
      width="300px"
      height="600px"
      responsive={false}
      allowInDev={allowInDev}
    />
  );
};

// Componente de anuncio responsive que se adapta al contenedor
export const AdSenseResponsive = ({ slot, allowInDev = false }) => {
  return (
    <AdSenseAd 
      slot={slot} 
      format="auto" 
      style={{ display: 'block', width: '100%' }}
      className="adsense-responsive"
      responsive={true}
      allowInDev={allowInDev}
    />
  );
};

// Componente para mostrar información de debug en desarrollo
export const AdSenseDebug = () => {
  if (!isDevelopmentMode()) {
    return null;
  }

  const adSenseStatus = typeof window !== 'undefined' && window.adsbygoogle;

  return (
    <div style={{ 
      background: '#fff3cd', 
      border: '1px solid #ffc107', 
      padding: '12px', 
      margin: '20px 0',
      borderRadius: '6px',
      fontSize: '13px',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#856404' }}>
        🔍 AdSense Debug Information
      </div>
      <div style={{ color: '#856404' }}>
        <strong>Client ID:</strong> ca-pub-7772175009790237<br/>
        <strong>Environment:</strong> {process.env.NODE_ENV || 'unknown'}<br/>
        <strong>AdSense Script:</strong> {adSenseStatus ? '✅ Loaded' : '❌ Not loaded'}<br/>
        <strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}<br/>
        <strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'unknown'}
      </div>
      <div style={{ 
        marginTop: '8px', 
        padding: '6px', 
        background: '#fff', 
        borderRadius: '3px',
        fontSize: '11px',
        color: '#495057'
      }}>
        💡 Para ver anuncios reales en desarrollo, usa <code>allowInDev=true</code>
      </div>
    </div>
  );
};

export default AdSenseAd;
