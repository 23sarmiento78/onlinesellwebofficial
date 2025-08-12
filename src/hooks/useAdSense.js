import { useEffect, useCallback, useRef } from 'react';

export const useAdSense = () => {
  const isLoadedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const loadAdSense = useCallback(() => {
    // Si ya está cargado, no hacer nada
    if (isLoadedRef.current) {
      return true;
    }

    // Verificar si el script de AdSense está disponible
    if (typeof window === 'undefined') {
      return false;
    }

    // Verificar si adsbygoogle está disponible
    if (window.adsbygoogle) {
      isLoadedRef.current = true;
      return true;
    }

    // Si no está disponible y aún tenemos reintentos
    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      
      // Reintentar después de un pequeño delay
      setTimeout(() => {
        loadAdSense();
      }, 1000 * retryCountRef.current); // Delay incremental
    }

    return false;
  }, []);

  const pushAd = useCallback((adConfig = {}) => {
    if (!loadAdSense()) {
      console.warn('AdSense not available, skipping ad push');
      return false;
    }

    try {
      // Asegurar que adsbygoogle.push existe
      if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
        window.adsbygoogle.push(adConfig);
        return true;
      }
    } catch (error) {
      console.error('AdSense push error:', error);
      
      // Reset para reintentar
      isLoadedRef.current = false;
      retryCountRef.current = 0;
    }

    return false;
  }, [loadAdSense]);

  const isAdSenseAvailable = useCallback(() => {
    return typeof window !== 'undefined' && 
           window.adsbygoogle && 
           typeof window.adsbygoogle.push === 'function';
  }, []);

  // Verificar disponibilidad al montar
  useEffect(() => {
    const checkAdSense = () => {
      if (isAdSenseAvailable()) {
        isLoadedRef.current = true;
      } else {
        // Reintentar si no está disponible
        loadAdSense();
      }
    };

    // Verificar inmediatamente
    checkAdSense();

    // También verificar cuando el documento esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAdSense);
      return () => document.removeEventListener('DOMContentLoaded', checkAdSense);
    }
  }, [loadAdSense, isAdSenseAvailable]);

  return {
    pushAd,
    isAdSenseAvailable,
    isLoaded: isLoadedRef.current
  };
};

// Hook específico para componentes de anuncios
export const useAdSenseAd = (slot, options = {}) => {
  const { pushAd, isAdSenseAvailable } = useAdSense();
  const adElementRef = useRef(null);
  const initializedRef = useRef(false);

  const initializeAd = useCallback(() => {
    // Verificar que tenemos todo lo necesario
    if (!slot || !adElementRef.current || initializedRef.current) {
      return;
    }

    // Verificar que AdSense está disponible
    if (!isAdSenseAvailable()) {
      console.warn('AdSense not available for slot:', slot);
      return;
    }

    // Solo inicializar en producción o si explícitamente se permite en desarrollo
    if (process.env.NODE_ENV === 'development' && !options.allowInDev) {
      console.log('AdSense disabled in development for slot:', slot);
      return;
    }

    try {
      // Marcar como inicializado
      initializedRef.current = true;

      // Pequeño delay para asegurar que el elemento está en el DOM
      setTimeout(() => {
        const success = pushAd({});
        if (!success) {
          // Reset si falló
          initializedRef.current = false;
        }
      }, 100);

    } catch (error) {
      console.error('Error initializing AdSense ad:', error);
      initializedRef.current = false;
    }
  }, [slot, pushAd, isAdSenseAvailable, options.allowInDev]);

  // Inicializar cuando el elemento esté disponible
  useEffect(() => {
    if (adElementRef.current) {
      initializeAd();
    }
  }, [initializeAd]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      initializedRef.current = false;
    };
  }, []);

  return {
    adElementRef,
    isInitialized: initializedRef.current,
    reinitialize: () => {
      initializedRef.current = false;
      initializeAd();
    }
  };
};

// Función utilitaria para validar slots de AdSense
export const isValidAdSlot = (slot) => {
  // Un slot válido debe ser un número de 10 dígitos
  return slot && 
         typeof slot === 'string' && 
         /^\d{10}$/.test(slot) &&
         slot !== '1234567890' && // No usar slots de ejemplo
         slot !== '0000000000';
};

// Función para detectar si estamos en un entorno de desarrollo
export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === 'development' || 
         (typeof window !== 'undefined' && window.location.hostname === 'localhost');
};
