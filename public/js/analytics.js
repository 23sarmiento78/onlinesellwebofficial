// Sistema de Analytics para registrar vistas reales
class Analytics {
  constructor() {
    this.apiUrl = '/.netlify/functions/admin-api/views';
    this.init();
  }

  async init() {
    // Registrar la vista actual
    await this.recordView();
    
    // Configurar para registrar navegación SPA si es necesario
    this.setupSPATracking();
  }

  async recordView() {
    try {
      const viewData = {
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        ip: await this.getClientIP(),
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewData)
      });

      if (response.ok) {
        console.log('Vista registrada correctamente');
      } else {
        console.error('Error registrando vista:', response.statusText);
      }
    } catch (error) {
      console.error('Error en analytics:', error);
    }
  }

  async getClientIP() {
    try {
      // Intentar obtener IP real desde un servicio externo
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      // Fallback: usar una IP local o timestamp
      return 'unknown';
    }
  }

  setupSPATracking() {
    // Para aplicaciones SPA, registrar cambios de ruta
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.history.pushState = function(...args) {
        originalPushState.apply(this, args);
        setTimeout(() => analytics.recordView(), 100);
      };

      window.history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        setTimeout(() => analytics.recordView(), 100);
      };

      // Escuchar eventos de navegación
      window.addEventListener('popstate', () => {
        setTimeout(() => analytics.recordView(), 100);
      });
    }
  }

  // Método para obtener estadísticas
  async getStats(period = 'all') {
    try {
      const response = await fetch(`/.netlify/functions/admin-api/views/stats?period=${period}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Error obteniendo estadísticas');
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return null;
    }
  }

  // Método para obtener total de vistas
  async getTotalViews() {
    try {
      const response = await fetch('/.netlify/functions/admin-api/views/total');
      if (response.ok) {
        const data = await response.json();
        return data.totalViews;
      }
      throw new Error('Error obteniendo total de vistas');
    } catch (error) {
      console.error('Error obteniendo total de vistas:', error);
      return 0;
    }
  }
}

// Inicializar analytics cuando se carga la página
let analytics;
document.addEventListener('DOMContentLoaded', () => {
  analytics = new Analytics();
});

// Hacer disponible globalmente
window.analytics = analytics; 