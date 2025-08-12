// Utilidades para manejar AdSense de manera segura

/**
 * Limpia y reinicia el estado de AdSense
 */
export const resetAdSenseState = () => {
  try {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      // Limpiar el array de AdSense
      if (Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.length = 0;
      } else {
        window.adsbygoogle = [];
      }
      console.log('AdSense state reset successfully');
      return true;
    }
  } catch (error) {
    console.warn('Failed to reset AdSense state:', error);
  }
  return false;
};

/**
 * Valida que AdSense esté correctamente configurado
 */
export const validateAdSenseSetup = () => {
  const validation = {
    isValid: true,
    issues: [],
    warnings: []
  };

  // Verificar que el script esté cargado
  if (typeof window === 'undefined') {
    validation.warnings.push('Running in SSR environment');
    return validation;
  }

  // Verificar script de AdSense
  const adSenseScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
  if (!adSenseScript) {
    validation.isValid = false;
    validation.issues.push('AdSense script not found in document head');
  } else {
    const clientId = adSenseScript.src.match(/client=([^&]+)/)?.[1];
    if (!clientId || clientId === 'test') {
      validation.isValid = false;
      validation.issues.push('Invalid or missing AdSense client ID');
    }
  }

  // Verificar objeto adsbygoogle
  if (typeof window.adsbygoogle === 'undefined') {
    validation.warnings.push('adsbygoogle object not yet available');
  } else if (!Array.isArray(window.adsbygoogle)) {
    validation.isValid = false;
    validation.issues.push('adsbygoogle is not an array');
  }

  // Verificar elementos de anuncios
  const adElements = document.querySelectorAll('ins.adsbygoogle');
  adElements.forEach((element, index) => {
    const clientId = element.getAttribute('data-ad-client');
    const slot = element.getAttribute('data-ad-slot');
    const format = element.getAttribute('data-ad-format');

    if (!clientId) {
      validation.issues.push(`Ad element ${index + 1}: Missing data-ad-client`);
    }

    if (!slot || slot === '1234567890') {
      validation.issues.push(`Ad element ${index + 1}: Invalid or placeholder slot ID`);
    }

    if (!format) {
      validation.warnings.push(`Ad element ${index + 1}: Missing data-ad-format`);
    }
  });

  // Verificar HTTPS
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    validation.isValid = false;
    validation.issues.push('AdSense requires HTTPS in production');
  }

  return validation;
};

/**
 * Obtiene información de debug sobre AdSense
 */
export const getAdSenseDebugInfo = () => {
  if (typeof window === 'undefined') {
    return { environment: 'SSR' };
  }

  return {
    environment: process.env.NODE_ENV || 'unknown',
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent,
    adsbygoogleAvailable: typeof window.adsbygoogle !== 'undefined',
    adsbygoogleType: typeof window.adsbygoogle,
    adsbygoogleLength: Array.isArray(window.adsbygoogle) ? window.adsbygoogle.length : 'N/A',
    adElements: document.querySelectorAll('ins.adsbygoogle').length,
    scriptLoaded: !!document.querySelector('script[src*="pagead2.googlesyndication.com"]'),
    timestamp: new Date().toISOString()
  };
};

/**
 * Maneja errores de AdSense de manera segura
 */
export const handleAdSenseError = (error, context = '') => {
  // Log del error para debug
  console.group('🚨 AdSense Error');
  console.error('Context:', context);
  console.error('Error:', error);
  console.log('Debug Info:', getAdSenseDebugInfo());
  console.groupEnd();

  // Si es un TagError conocido, intentar reinicializar
  if (error.message?.includes('TagError') || error.name === 'TagError') {
    console.log('Attempting to recover from TagError...');
    
    setTimeout(() => {
      resetAdSenseState();
    }, 1000);
  }

  // Prevenir que el error se propague si es de AdSense
  if (error.stack?.includes('googlesyndication') || 
      error.message?.includes('adsbygoogle')) {
    return true; // Error manejado
  }

  return false; // Dejar que otros errores se propaguen
};

/**
 * Inicializa AdSense de manera segura con reintentos
 */
export const safeInitializeAdSense = (maxRetries = 3) => {
  return new Promise((resolve) => {
    let attempts = 0;

    const tryInitialize = () => {
      attempts++;
      
      try {
        if (typeof window.adsbygoogle !== 'undefined') {
          if (!Array.isArray(window.adsbygoogle)) {
            window.adsbygoogle = [];
          }
          resolve(true);
          return;
        }

        if (attempts < maxRetries) {
          setTimeout(tryInitialize, 1000);
        } else {
          console.warn('AdSense initialization failed after', maxRetries, 'attempts');
          resolve(false);
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
        if (attempts < maxRetries) {
          setTimeout(tryInitialize, 1000);
        } else {
          resolve(false);
        }
      }
    };

    tryInitialize();
  });
};

/**
 * Verifica si un slot de AdSense es válido
 */
export const isValidAdSlot = (slot) => {
  if (!slot || typeof slot !== 'string') {
    return false;
  }

  // Un slot válido debe ser un número de 10 dígitos
  const isNumeric = /^\d{10}$/.test(slot);
  
  // No debe ser un placeholder
  const isNotPlaceholder = !['1234567890', '0000000000', 'test', 'example'].includes(slot.toLowerCase());

  return isNumeric && isNotPlaceholder;
};

/**
 * Genera un reporte de salud de AdSense
 */
export const generateAdSenseHealthReport = () => {
  const validation = validateAdSenseSetup();
  const debugInfo = getAdSenseDebugInfo();
  
  const report = {
    timestamp: new Date().toISOString(),
    overall: validation.isValid ? 'HEALTHY' : 'ISSUES_FOUND',
    validation,
    debugInfo,
    recommendations: []
  };

  // Generar recomendaciones
  if (validation.issues.length > 0) {
    report.recommendations.push('Fix critical issues before deploying to production');
  }

  if (validation.warnings.length > 0) {
    report.recommendations.push('Review warnings for optimal AdSense performance');
  }

  if (debugInfo.adElements === 0) {
    report.recommendations.push('Add AdSense ad units to monetize your content');
  } else if (debugInfo.adElements > 3) {
    report.recommendations.push('Consider ad density - too many ads may hurt user experience');
  }

  if (debugInfo.hostname === 'localhost') {
    report.recommendations.push('Test on a real domain before production deployment');
  }

  return report;
};

/**
 * Configuración por defecto para AdSense
 */
export const ADSENSE_CONFIG = {
  CLIENT_ID: 'ca-pub-7772175009790237',
  FORMATS: {
    AUTO: 'auto',
    RECTANGLE: 'rectangle',
    FLUID: 'fluid',
    AUTORELAXED: 'autorelaxed'
  },
  LAYOUTS: {
    IN_ARTICLE: 'in-article'
  },
  DEFAULT_STYLE: {
    display: 'block',
    textAlign: 'center'
  }
};
