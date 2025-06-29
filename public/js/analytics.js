// Sistema de Analytics para registrar vistas reales
class Analytics {
  constructor() {
    this.apiUrl = '/.netlify/functions/admin-api/views';
    this.isAuthenticated = false;
    this.init();
    
    // Escuchar cambios de autenticación
    document.addEventListener('auth0:authChanged', (event) => {
      this.handleAuthChange(event.detail);
    });
  }

  async init() {
    // Verificar autenticación
    this.checkAuthentication();
    
    // Solo registrar vista si está autenticado o es una página pública
    if (this.isAuthenticated || this.isPublicPage()) {
      await this.recordView();
    } else {
      console.log('🔒 Analytics: Usuario no autenticado, saltando registro de vista');
    }
    
    // Configurar para registrar navegación SPA si es necesario
    this.setupSPATracking();
  }

  checkAuthentication() {
    const token = localStorage.getItem('auth0_token');
    const user = localStorage.getItem('auth0_user');
    this.isAuthenticated = !!(token && user);
    
    console.log('🔍 Analytics - Estado de autenticación:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated: this.isAuthenticated
    });
  }

  isPublicPage() {
    // Páginas públicas que no requieren autenticación para analytics
    const publicPages = ['/', '/blog', '/planes', '/contacto', '/legal', '/politicas-privacidad'];
    return publicPages.includes(window.location.pathname);
  }

  getAuthHeaders() {
    const token = localStorage.getItem('auth0_token');
    if (!token) {
      return {
        'Content-Type': 'application/json'
      };
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
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
        headers: this.getAuthHeaders(),
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
      if (!this.isAuthenticated) {
        console.log('🔒 Analytics: No autenticado, no se pueden obtener estadísticas');
        return null;
      }

      const response = await fetch(`/.netlify/functions/admin-api/views/stats?period=${period}`, {
        headers: this.getAuthHeaders()
      });
      
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`Error obteniendo estadísticas: ${response.status}`);
    } catch (error) {
      console.error('❌ Analytics: Error obteniendo estadísticas:', error);
      return null;
    }
  }

  // Método para obtener total de vistas
  async getTotalViews() {
    try {
      if (!this.isAuthenticated) {
        console.log('🔒 Analytics: No autenticado, no se pueden obtener estadísticas');
        return 0;
      }

      const response = await fetch('/.netlify/functions/admin-api/views/total', {
        headers: this.getAuthHeaders()
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.totalViews;
      }
      throw new Error(`Error obteniendo total de vistas: ${response.status}`);
    } catch (error) {
      console.error('❌ Analytics: Error obteniendo total de vistas:', error);
      return 0;
    }
  }

  handleAuthChange(authData) {
    const wasAuthenticated = this.isAuthenticated;
    this.isAuthenticated = authData.isAuthenticated;
    
    console.log('🔄 Analytics: Cambio de autenticación detectado', {
      wasAuthenticated,
      isAuthenticated: this.isAuthenticated
    });
    
    if (!wasAuthenticated && this.isAuthenticated) {
      // Usuario se acaba de autenticar, registrar vista
      console.log('✅ Analytics: Usuario autenticado, registrando vista...');
      this.recordView();
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