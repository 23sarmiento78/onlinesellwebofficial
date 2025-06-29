// Aplicación principal del panel de administración
class AdminApp {
    constructor() {
        this.auth0 = null;
        this.init();
    }

    async init() {
        // Esperar a que Auth0 se configure
        while (!auth0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.auth0 = auth0;
        this.setupEventListeners();
        this.handleAuthenticationCallback();
        this.updateUI();
    }

    setupEventListeners() {
        // Botón de login
        document.getElementById('login-btn').addEventListener('click', () => {
            this.login();
        });

        // Botón de logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });
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
        const isAuthenticated = await this.auth0.isAuthenticated();
        
        if (isAuthenticated) {
            // Usuario autenticado
            this.showAuthenticatedUI();
        } else {
            // Usuario no autenticado
            this.showLoginUI();
        }
    }

    showAuthenticatedUI() {
        // Ocultar sección de login
        document.getElementById('login-section').classList.add('hidden');
        
        // Mostrar controles de usuario y dashboard
        document.getElementById('user-controls').classList.remove('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Cargar información del usuario
        this.loadUserInfo();
    }

    showLoginUI() {
        // Mostrar sección de login
        document.getElementById('login-section').classList.remove('hidden');
        
        // Ocultar controles de usuario y dashboard
        document.getElementById('user-controls').classList.add('hidden');
        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    async loadUserInfo() {
        try {
            const user = await this.auth0.getUser();
            document.getElementById('user-name').textContent = user.name || user.nickname || 'Usuario';
            document.getElementById('user-email').textContent = user.email || 'No disponible';
        } catch (error) {
            console.error("Error al cargar información del usuario:", error);
        }
    }

    async login() {
        try {
            await this.auth0.loginWithRedirect();
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    }

    async logout() {
        try {
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