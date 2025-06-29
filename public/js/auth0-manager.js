// Sistema de Autenticación Auth0 - Versión Simplificada
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
      console.log('🔧 Configuración:', AUTH0_CONFIG);
      
      // Hacer disponible globalmente inmediatamente
      window.auth0Manager = this;
      
      // Verificar si hay un token en localStorage
      const token = localStorage.getItem('auth0_token');
      const user = localStorage.getItem('auth0_user');
      
      if (token && user) {
        console.log('✅ Token encontrado en localStorage');
        this.isAuthenticated = true;
        this.user = JSON.parse(user);
        this.showAdminPanel();
        return;
      }
      
      // Si no hay token, mostrar login
      this.showLogin();
      
      console.log('✅ Auth0 Manager inicializado (modo simplificado)');
    } catch (error) {
      console.error('❌ Error inicializando Auth0:', error);
      this.showError('Error inicializando Auth0: ' + error.message);
    }
  }

  login() {
    console.log('🔐 Iniciando login con Auth0...');
    
    // Construir URL de autorización directamente
    const authUrl = `https://${AUTH0_CONFIG.domain}/authorize?` +
      `client_id=${AUTH0_CONFIG.clientId}&` +
      `redirect_uri=${encodeURIComponent(AUTH0_CONFIG.redirectUri)}&` +
      `response_type=token%20id_token&` +
      `scope=${encodeURIComponent(AUTH0_CONFIG.scope)}&` +
      `audience=${encodeURIComponent(AUTH0_CONFIG.audience)}`;
    
    console.log('🔐 Redirigiendo a Auth0:', authUrl);
    window.location.href = authUrl;
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

  logout() {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar localStorage
    localStorage.removeItem('auth0_token');
    localStorage.removeItem('auth0_user');
    this.isAuthenticated = false;
    this.user = null;
    
    // Redirigir a logout
    const logoutUrl = `https://${AUTH0_CONFIG.domain}/v2/logout?` +
      `client_id=${AUTH0_CONFIG.clientId}&` +
      `returnTo=${encodeURIComponent(AUTH0_CONFIG.logoutUri)}`;
    
    window.location.href = logoutUrl;
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
          
          <button id="login-btn" style="
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
          
          <button id="test-btn" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 0.9rem;
            cursor: pointer;
            margin-bottom: 1rem;
          ">
            🔍 Probar Configuración
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

    // Agregar event listener al botón de login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        console.log('🔘 Botón de login clickeado');
        this.login();
      });
    }

    // Agregar event listener al botón de prueba
    const testBtn = document.getElementById('test-btn');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        console.log('🔍 Probando configuración...');
        this.testConfiguration();
      });
    }
  }

  testConfiguration() {
    console.log('🔍 === PRUEBA DE CONFIGURACIÓN ===');
    console.log('1. AUTH0_CONFIG:', window.AUTH0_CONFIG);
    console.log('2. auth0Manager:', window.auth0Manager);
    console.log('3. Token en localStorage:', localStorage.getItem('auth0_token'));
    console.log('4. Usuario en localStorage:', localStorage.getItem('auth0_user'));
    
    alert('Revisa la consola para ver la información de configuración');
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
          <h3 style="color: #e74c3c; margin-bottom: 1rem;">❌ Error</h3>
          <p style="color: #666; margin-bottom: 1rem;">${message}</p>
          <button onclick="location.reload()" style="
            background: #3498db;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
          ">
            Recargar Página
          </button>
        </div>
      </div>
    `;
  }

  getToken() {
    return localStorage.getItem('auth0_token');
  }

  getUser() {
    const user = localStorage.getItem('auth0_user');
    return user ? JSON.parse(user) : null;
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