// Sistema de Autenticación Auth0 - Limpio y Simple
class Auth0Manager {
  constructor() {
    this.auth0 = null;
    this.user = null;
    this.isAuthenticated = false;
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Auth0 Manager...');
      
      // Cargar SDK de Auth0
      await this.loadAuth0SDK();
      
      // Inicializar Auth0
      this.auth0 = new auth0.WebAuth({
        domain: AUTH0_CONFIG.domain,
        clientID: AUTH0_CONFIG.clientId,
        redirectUri: AUTH0_CONFIG.redirectUri,
        responseType: 'token id_token',
        scope: AUTH0_CONFIG.scope,
        audience: AUTH0_CONFIG.audience
      });

      // Verificar sesión existente
      this.checkSession();
      
      console.log('✅ Auth0 Manager inicializado');
    } catch (error) {
      console.error('❌ Error inicializando Auth0:', error);
      this.showError('Error cargando Auth0: ' + error.message);
    }
  }

  async loadAuth0SDK() {
    return new Promise((resolve, reject) => {
      if (typeof auth0 !== 'undefined') {
        console.log('✅ SDK de Auth0 ya cargado');
        resolve();
        return;
      }

      console.log('📦 Cargando SDK de Auth0...');
      const script = document.createElement('script');
      script.src = 'https://cdn.auth0.com/js/auth0/9.18.0/auth0.min.js';
      script.onload = () => {
        console.log('✅ SDK de Auth0 cargado exitosamente');
        resolve();
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando SDK de Auth0:', error);
        reject(new Error('No se pudo cargar el SDK de Auth0'));
      };
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
      this.isAuthenticated = false;
      this.user = null;
      window.location.href = AUTH0_CONFIG.logoutUri;
      return;
    }

    console.log('🚪 Cerrando sesión...');
    this.auth0.logout({
      returnTo: AUTH0_CONFIG.logoutUri
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
          
          <button onclick="window.auth0Manager.login()" style="
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
    
    if (window.location.pathname.includes('admin.html')) {
      console.log('✅ Panel de admin cargado');
      return;
    }
    
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
    return this.isAuthenticated && !!this.getToken();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.auth0Manager = new Auth0Manager();
});

console.log('📦 Auth0Manager cargado'); 