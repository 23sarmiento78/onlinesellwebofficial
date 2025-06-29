// Sistema de Auth0 Simple y Limpio
class Auth0Simple {
  constructor() {
    this.config = {
      domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com',
      clientID: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab',
      redirectUri: 'https://service.hgaruna.org/admin/',
      audience: 'https://service.hgaruna.org/api',
      scope: 'openid profile email'
    };
    
    this.auth0 = null;
    this.isAuthenticated = false;
    this.user = null;
    
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Auth0 Simple...');
    
    try {
      // Validar configuración
      this.validateConfig();
      
      // Cargar SDK de Auth0
      await this.loadAuth0SDK();
      
      // Inicializar Auth0
      this.auth0 = new auth0.WebAuth(this.config);
      
      // Verificar sesión existente
      this.checkSession();
      
      console.log('✅ Auth0 Simple inicializado');
    } catch (error) {
      console.error('❌ Error inicializando Auth0:', error);
      this.showError('Error cargando Auth0: ' + error.message);
    }
  }

  validateConfig() {
    const required = ['domain', 'clientID', 'redirectUri'];
    const missing = required.filter(field => !this.config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Configuración incompleta. Faltan: ${missing.join(', ')}`);
    }
    
    console.log('✅ Configuración validada:', this.config);
  }

  async loadAuth0SDK() {
    return new Promise((resolve, reject) => {
      if (typeof auth0 !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.auth0.com/js/auth0/9.19.2/auth0.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  checkSession() {
    if (!this.auth0) return;

    this.auth0.checkSession({}, (err, authResult) => {
      if (err) {
        console.log('❌ No hay sesión activa');
        this.showLogin();
      } else if (authResult && authResult.accessToken) {
        console.log('✅ Sesión activa encontrada');
        this.handleAuthSuccess(authResult);
      } else {
        this.showLogin();
      }
    });
  }

  handleAuthSuccess(authResult) {
    this.isAuthenticated = true;
    this.user = authResult.idTokenPayload;
    
    // Guardar tokens
    localStorage.setItem('auth0_token', authResult.accessToken);
    localStorage.setItem('auth0_user', JSON.stringify(authResult.idTokenPayload));
    
    console.log('✅ Usuario autenticado:', this.user.name);
    this.showAdminPanel();
  }

  login() {
    if (!this.auth0) {
      this.showError('Auth0 no está disponible');
      return;
    }

    console.log('🔐 Iniciando login...');
    this.auth0.authorize();
  }

  logout() {
    if (!this.auth0) {
      localStorage.removeItem('auth0_token');
      localStorage.removeItem('auth0_user');
      window.location.href = '/';
      return;
    }

    console.log('🚪 Cerrando sesión...');
    this.auth0.logout({
      returnTo: 'https://service.hgaruna.org'
    });
  }

  showLogin() {
    const container = document.querySelector('.admin-container') || document.body;
    
    container.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <div style="
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          text-align: center;
          max-width: 400px;
          width: 90%;
        ">
          <h2 style="color: #333; margin-bottom: 1rem; font-size: 2rem;">🔐 Admin Panel</h2>
          <p style="color: #666; margin-bottom: 2rem;">Inicia sesión para acceder al panel de administración</p>
          
          <button onclick="window.auth0Simple.login()" style="
            background: #eb5424;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-bottom: 1rem;
          " onmouseover="this.style.background='#d4451a'" onmouseout="this.style.background='#eb5424'">
            Iniciar Sesión con Auth0
          </button>
          
          <div style="
            background: #f8f9fa;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: left;
            margin-top: 1rem;
          ">
            <p style="margin: 0.5rem 0; color: #333;"><strong>Credenciales:</strong></p>
            <p style="margin: 0.5rem 0; color: #333;">Email: admin@hgaruna.com</p>
            <p style="margin: 0.5rem 0; color: #333;">Contraseña: (configurada en Auth0)</p>
          </div>
        </div>
      </div>
    `;
  }

  showAdminPanel() {
    const container = document.querySelector('.admin-container') || document.body;
    
    // Si ya estamos en admin.html, mostrar el contenido
    if (window.location.pathname.includes('admin.html')) {
      console.log('✅ Panel de admin cargado');
      return;
    }
    
    // Redirigir al panel
    window.location.href = '/admin.html';
  }

  showError(message) {
    const container = document.querySelector('.admin-container') || document.body;
    
    container.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f8f9fa;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <div style="
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
        ">
          <h2 style="color: #e74c3c; margin-bottom: 1rem;">⚠️ Error</h2>
          <p style="color: #666; margin-bottom: 1rem;">${message}</p>
          <button onclick="window.location.reload()" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
          ">
            Recargar
          </button>
        </div>
      </div>
    `;
  }

  getToken() {
    return localStorage.getItem('auth0_token');
  }

  getUser() {
    return this.user;
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.auth0Simple = new Auth0Simple();
});

console.log('📦 Auth0Simple cargado'); 