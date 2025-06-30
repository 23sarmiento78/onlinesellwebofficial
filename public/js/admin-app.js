// Aplicación principal del panel de administración
class AdminApp {
    constructor() {
        this.auth0 = null;
        this.init();
    }

    async init() {
        // Esperar a que Auth0 se configure
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos máximo
        
        while (!auth0Client && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!auth0Client) {
            console.error("Auth0 client no se pudo inicializar después de 5 segundos");
            return;
        }
        
        this.auth0 = auth0Client;
        console.log("AdminApp initialized with Auth0 client");
        
        this.setupEventListeners();
        this.handleAuthenticationCallback();
        this.updateUI();
    }

    setupEventListeners() {
        // Botón de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.login();
            });
        }

        // Botón de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    async handleAuthenticationCallback() {
        // Verificar si estamos en el callback de Auth0
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            try {
                await this.auth0.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname);
                this.updateUI();
            } catch (error) {
                console.error("Error en el callback:", error);
            }
        }
    }

    async updateUI() {
        try {
            const isAuthenticated = await this.auth0.isAuthenticated();
            
            if (isAuthenticated) {
                // Usuario autenticado
                this.showAuthenticatedUI();
            } else {
                // Usuario no autenticado
                this.showLoginUI();
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            this.showLoginUI();
        }
    }

    showAuthenticatedUI() {
        // Ocultar sección de login
        const loginSection = document.getElementById('login-section');
        if (loginSection) loginSection.classList.add('hidden');
        
        // Mostrar controles de usuario y dashboard
        const userControls = document.getElementById('user-controls');
        if (userControls) userControls.classList.remove('hidden');
        
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.classList.remove('hidden');
        
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.classList.remove('hidden');
        
        // Cargar información del usuario
        this.loadUserInfo();
    }

    showLoginUI() {
        // Mostrar sección de login
        const loginSection = document.getElementById('login-section');
        if (loginSection) loginSection.classList.remove('hidden');
        
        // Ocultar controles de usuario y dashboard
        const userControls = document.getElementById('user-controls');
        if (userControls) userControls.classList.add('hidden');
        
        const userInfo = document.getElementById('user-info');
        if (userInfo) userInfo.classList.add('hidden');
        
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.classList.add('hidden');
    }

    async loadUserInfo() {
        try {
            const user = await this.auth0.getUser();
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            
            if (userName) userName.textContent = user.name || user.nickname || 'Usuario';
            if (userEmail) userEmail.textContent = user.email || 'No disponible';
        } catch (error) {
            console.error("Error al cargar información del usuario:", error);
        }
    }

    async login() {
        try {
            if (!this.auth0) {
                console.error("Auth0 client not initialized");
                return;
            }
            await this.auth0.loginWithRedirect();
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }

    async logout() {
        try {
            if (!this.auth0) {
                console.error("Auth0 client not initialized");
                return;
            }
            await this.auth0.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    // Método para obtener el token de acceso
    async getAccessToken() {
        try {
            if (!this.auth0) {
                console.error("Auth0 client not initialized");
                return null;
            }
            return await this.auth0.getTokenSilently();
        } catch (error) {
            console.error("Error al obtener token:", error);
            return null;
        }
    }

    // Método para hacer llamadas API autenticadas
    async makeAuthenticatedRequest(url, options = {}) {
        const token = await this.getAccessToken();
        if (!token) {
            throw new Error("No se pudo obtener el token de acceso");
        }

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        return response.json();
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
}); 