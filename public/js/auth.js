// Sistema de Autenticación con Auth0
class Auth0Auth {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.auth0 = null;
    this.init();
  }

  async init() {
    console.log('🔐 Inicializando Auth0...');
    
    // Usar configuración externa si está disponible
    const config = window.AUTH0_CONFIG || {
      domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com',
      clientId: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab',
      redirectUri: window.location.origin + '/admin/',
      audience: 'https://service.hgaruna.org/api',
      scope: 'openid profile email'
    };

    console.log('📋 Configuración Auth0:', config);

    try {
      // Cargar Auth0 usando el cargador robusto
      if (window.Auth0Loader) {
        await window.Auth0Loader.load();
      } else {
        await this.loadAuth0Script();
      }

      // Inicializar Auth0
      this.auth0 = new auth0.WebAuth(config);
      
      // Configurar eventos
      this.setupEventListeners();
      
      // Verificar sesión existente
      this.checkSession();
      
      console.log('✅ Auth0 inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Auth0:', error);
      this.showFallbackLogin();
    }
  }

  async loadAuth0Script() {
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado
      if (typeof auth0 !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.auth0.com/js/auth0/9.19.2/auth0.min.js';
      script.onload = () => {
        console.log('✅ SDK de Auth0 cargado correctamente');
        resolve();
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando SDK de Auth0:', error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  checkSession() {
    if (!this.auth0) {
      console.log('❌ Auth0 no inicializado, mostrando login');
      this.handleUnauthenticated();
      return;
    }

    console.log('🔍 Verificando sesión...');
    
    this.auth0.checkSession({}, (err, authResult) => {
      if (err) {
        console.log('❌ No hay sesión activa:', err.error);
        this.handleUnauthenticated();
      } else if (authResult && authResult.accessToken) {
        console.log('✅ Sesión activa encontrada');
        this.handleAuthenticationResult(authResult);
      } else {
        console.log('❌ No hay token válido');
        this.handleUnauthenticated();
      }
    });
  }

  setupEventListeners() {
    // Escuchar eventos de Auth0
    if (this.auth0) {
      this.auth0.parseHash((err, authResult) => {
        if (err) {
          console.error('❌ Error parseando hash:', err);
          return;
        }
        
        if (authResult && authResult.accessToken) {
          this.handleAuthenticationResult(authResult);
        }
      });
    }
  }

  handleAuthenticationResult(authResult) {
    this.isAuthenticated = true;
    this.currentUser = authResult.idTokenPayload;
    
    // Guardar tokens con nombres consistentes
    localStorage.setItem('auth0_token', authResult.accessToken);
    localStorage.setItem('auth0_user', JSON.stringify(authResult.idTokenPayload));
    
    console.log('✅ Usuario autenticado:', this.currentUser.name);
    
    // Mostrar panel de admin
    if (window.location.pathname.includes('admin')) {
      this.showAdminPanel();
    } else {
      this.updateUI();
    }
  }

  handleUnauthenticated() {
    this.isAuthenticated = false;
    this.currentUser = null;
    
    // Limpiar tokens
    localStorage.removeItem('auth0_token');
    localStorage.removeItem('auth0_user');
    
    if (window.location.pathname.includes('admin')) {
      this.showLoginForm();
    } else {
      this.updateUI();
    }
  }

  login() {
    if (!this.auth0) {
      console.error('❌ Auth0 no inicializado');
      return;
    }

    console.log('🔐 Iniciando login con Auth0...');
    this.auth0.authorize();
  }

  logout() {
    if (!this.auth0) {
      console.error('❌ Auth0 no inicializado');
      return;
    }

    console.log('🚪 Cerrando sesión...');
    
    this.auth0.logout({
      returnTo: window.location.origin
    });
  }

  updateUI() {
    const loginButton = document.getElementById('login-button');
    const adminButton = document.getElementById('admin-button');
    const userDropdown = document.getElementById('user-dropdown');

    if (this.isAuthenticated) {
      // Usuario autenticado
      if (loginButton) {
        loginButton.innerHTML = `
          <i class="fas fa-user"></i>
          <span>${this.currentUser.name}</span>
        `;
        loginButton.href = '#';
        loginButton.onclick = (e) => {
          e.preventDefault();
          this.logout();
        };
      }

      if (adminButton) {
        adminButton.style.display = 'inline-flex';
        adminButton.onclick = (e) => {
          e.preventDefault();
          window.location.href = '/admin/';
        };
      }

      if (userDropdown) {
        userDropdown.style.display = 'block';
      }
    } else {
      // Usuario no autenticado
      if (loginButton) {
        loginButton.innerHTML = `
          <i class="fas fa-user"></i>
          <span>Iniciar Sesión</span>
        `;
        loginButton.href = '#';
        loginButton.onclick = (e) => {
          e.preventDefault();
          this.login();
        };
      }

      if (adminButton) {
        adminButton.style.display = 'none';
      }

      if (userDropdown) {
        userDropdown.style.display = 'none';
      }
    }
  }

  showLoginForm() {
    const adminContainer = document.querySelector('.admin-container') || document.body;
    
    adminContainer.innerHTML = `
      <div class="login-form">
        <div class="login-card">
          <h2>🔐 Acceso Administrativo</h2>
          <p>Inicia sesión con tu cuenta de Auth0 para acceder al panel de administración</p>
          
          <button class="login-btn auth0-btn" onclick="window.auth0Auth.login()">
            <i class="fas fa-sign-in-alt"></i>
            Iniciar Sesión con Auth0
          </button>
          
          <div class="login-info">
            <p><strong>Credenciales de prueba:</strong></p>
            <p>Email: admin@hgaruna.com</p>
            <p>Contraseña: (configurada en Auth0)</p>
          </div>
        </div>
      </div>
    `;
    
    this.addLoginStyles();
  }

  showAdminPanel() {
    console.log('🏠 Mostrando panel de administración...');
    
    // Si ya estamos en admin.html, solo mostrar el contenido
    if (window.location.pathname.includes('admin.html')) {
      console.log('✅ Ya estamos en admin.html, mostrando contenido');
      return;
    }
    
    // Si estamos en /admin/, redirigir a admin.html
    if (window.location.pathname.includes('/admin/')) {
      console.log('🔄 Redirigiendo a admin.html...');
      window.location.href = '/admin.html';
      return;
    }
    
    // Para otras páginas, mostrar mensaje de carga
    const adminContainer = document.querySelector('.admin-container') || document.body;
    adminContainer.innerHTML = `
      <div class="admin-panel">
        <div class="loading-container">
          <h2>🔄 Cargando Panel de Administración</h2>
          <p>Redirigiendo al panel...</p>
        </div>
      </div>
    `;
    
    // Redirigir al panel real
    setTimeout(() => {
      window.location.href = '/admin.html';
    }, 1000);
  }

  addLoginStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .login-form {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .login-card {
        background: white;
        border-radius: 20px;
        padding: 3rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        text-align: center;
        max-width: 400px;
        width: 90%;
      }
      
      .login-card h2 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 2rem;
      }
      
      .login-card p {
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.6;
      }
      
      .auth0-btn {
        background: #eb5424;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        margin-bottom: 2rem;
      }
      
      .auth0-btn:hover {
        background: #d4451a;
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(235, 84, 36, 0.4);
      }
      
      .login-info {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: left;
      }
      
      .login-info p {
        margin: 0.5rem 0;
        color: #333;
      }
      
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
      }
      
      .loading-container h2 {
        margin-bottom: 1rem;
        font-size: 2rem;
      }
    `;
    document.head.appendChild(style);
  }

  showFallbackLogin() {
    console.log('⚠️ Usando login de fallback');
    const adminContainer = document.querySelector('.admin-container') || document.body;
    
    adminContainer.innerHTML = `
      <div class="login-form">
        <div class="login-card">
          <h2>⚠️ Auth0 No Disponible</h2>
          <p>El sistema de autenticación no está configurado correctamente.</p>
          <p><strong>Posibles causas:</strong></p>
          <ul style="text-align: left; margin: 1rem 0;">
            <li>Las variables de entorno no están configuradas en Netlify</li>
            <li>Las URLs en Auth0 no coinciden con tu dominio</li>
            <li>El SDK de Auth0 no se cargó correctamente</li>
          </ul>
          <p><strong>Para solucionarlo:</strong></p>
          <ol style="text-align: left; margin: 1rem 0;">
            <li>Configura las variables de entorno en Netlify</li>
            <li>Actualiza las URLs en Auth0 Dashboard</li>
            <li>Verifica que tu dominio esté en las URLs permitidas</li>
          </ol>
          <button onclick="window.location.reload()" class="auth0-btn" style="margin-top: 1rem;">
            🔄 Recargar Página
          </button>
        </div>
      </div>
    `;
    
    this.addLoginStyles();
  }

  // Obtener token de acceso para API calls
  getAccessToken() {
    return localStorage.getItem('auth0_token');
  }

  // Verificar si está autenticado
  isUserAuthenticated() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }
}

// Inicializar Auth0 cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 DOM cargado, inicializando Auth0...');
  
  // Solo inicializar si no existe ya
  if (!window.auth0Auth) {
    window.auth0Auth = new Auth0Auth();
  }
});

// Exportar para uso global
window.Auth0Auth = Auth0Auth; 