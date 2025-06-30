// Aplicación principal del panel de administración
class AdminApp {
    constructor() {
        this.auth0 = null;
        this.init();
    }

    async init() {
        console.log("AdminApp: Iniciando aplicación...");
        
        // Esperar a que Auth0 se configure
        let attempts = 0;
        const maxAttempts = 100; // 10 segundos máximo
        
        while (!auth0Client && attempts < maxAttempts) {
            console.log(`AdminApp: Intento ${attempts + 1} - Esperando Auth0 client...`);
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!auth0Client) {
            console.error("AdminApp: Auth0 client no se pudo inicializar después de 10 segundos");
            this.showError("Error: No se pudo inicializar Auth0");
            return;
        }
        
        this.auth0 = auth0Client;
        console.log("AdminApp: Auth0 client asignado:", this.auth0);
        console.log("AdminApp: Tipo de auth0:", typeof this.auth0);
        console.log("AdminApp: Métodos disponibles:", Object.keys(this.auth0));
        
        // Verificar que el cliente tenga los métodos necesarios
        if (typeof this.auth0.isAuthenticated !== 'function') {
            console.error("AdminApp: isAuthenticated no es una función en el cliente Auth0");
            console.error("AdminApp: Tipo de isAuthenticated:", typeof this.auth0.isAuthenticated);
            console.error("AdminApp: Valor de isAuthenticated:", this.auth0.isAuthenticated);
            this.showError("Error: Cliente Auth0 no válido - isAuthenticated no disponible");
            return;
        }
        
        if (typeof this.auth0.loginWithRedirect !== 'function') {
            console.error("AdminApp: loginWithRedirect no es una función en el cliente Auth0");
            console.error("AdminApp: Tipo de loginWithRedirect:", typeof this.auth0.loginWithRedirect);
            console.error("AdminApp: Valor de loginWithRedirect:", this.auth0.loginWithRedirect);
            this.showError("Error: Cliente Auth0 no válido - loginWithRedirect no disponible");
            return;
        }
        
        console.log("AdminApp: Cliente Auth0 verificado correctamente");
        
        this.setupEventListeners();
        this.handleAuthenticationCallback();
        this.updateUI();
    }

    showError(message) {
        const loginSection = document.getElementById('login-section');
        if (loginSection) {
            loginSection.innerHTML = `
                <h2>Error</h2>
                <p style="color: red;">${message}</p>
                <p style="font-size: 12px; color: #666;">Revisa la consola para más detalles</p>
                <button onclick="location.reload()" class="btn">Recargar Página</button>
            `;
        }
    }

    setupEventListeners() {
        console.log("AdminApp: Configurando event listeners...");
        
        // Botón de login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log("AdminApp: Botón de login clickeado");
                this.login();
            });
        } else {
            console.error("AdminApp: No se encontró el botón de login");
        }

        // Botón de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log("AdminApp: Botón de logout clickeado");
                this.logout();
            });
        } else {
            console.error("AdminApp: No se encontró el botón de logout");
        }
    }

    async handleAuthenticationCallback() {
        console.log("AdminApp: Verificando callback de autenticación...");
        
        // Verificar si estamos en el callback de Auth0
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            try {
                console.log("AdminApp: Procesando callback de Auth0...");
                await this.auth0.handleRedirectCallback();
                window.history.replaceState({}, document.title, window.location.pathname);
                console.log("AdminApp: Callback procesado exitosamente");
                this.updateUI();
            } catch (error) {
                console.error("AdminApp: Error en el callback:", error);
            }
        } else {
            console.log("AdminApp: No hay callback de Auth0");
        }
    }

    async updateUI() {
        console.log("AdminApp: Actualizando UI...");
        
        try {
            console.log("AdminApp: Llamando a isAuthenticated...");
            const isAuthenticated = await this.auth0.isAuthenticated();
            console.log("AdminApp: Estado de autenticación:", isAuthenticated);
            
            if (isAuthenticated) {
                // Usuario autenticado
                this.showAuthenticatedUI();
            } else {
                // Usuario no autenticado
                this.showLoginUI();
            }
        } catch (error) {
            console.error("AdminApp: Error checking authentication:", error);
            console.error("AdminApp: Stack trace:", error.stack);
            this.showLoginUI();
        }
    }

    showAuthenticatedUI() {
        console.log("AdminApp: Mostrando UI autenticada");
        
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
        console.log("AdminApp: Mostrando UI de login");
        
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
            console.log("AdminApp: Cargando información del usuario...");
            const user = await this.auth0.getUser();
            console.log("AdminApp: Información del usuario:", user);
            
            const userName = document.getElementById('user-name');
            const userEmail = document.getElementById('user-email');
            
            if (userName) userName.textContent = user.name || user.nickname || 'Usuario';
            if (userEmail) userEmail.textContent = user.email || 'No disponible';
        } catch (error) {
            console.error("AdminApp: Error al cargar información del usuario:", error);
        }
    }

    async login() {
        try {
            console.log("AdminApp: Iniciando proceso de login...");
            
            if (!this.auth0) {
                console.error("AdminApp: Auth0 client not initialized");
                return;
            }
            
            console.log("AdminApp: Llamando a loginWithRedirect...");
            await this.auth0.loginWithRedirect();
        } catch (error) {
            console.error("AdminApp: Error al iniciar sesión:", error);
            console.error("AdminApp: Stack trace:", error.stack);
        }
    }

    async logout() {
        try {
            console.log("AdminApp: Iniciando proceso de logout...");
            
            if (!this.auth0) {
                console.error("AdminApp: Auth0 client not initialized");
                return;
            }
            
            await this.auth0.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
        } catch (error) {
            console.error("AdminApp: Error al cerrar sesión:", error);
        }
    }

    // Método para obtener el token de acceso
    async getAccessToken() {
        try {
            if (!this.auth0) {
                console.error("AdminApp: Auth0 client not initialized");
                return null;
            }
            return await this.auth0.getTokenSilently();
        } catch (error) {
            console.error("AdminApp: Error al obtener token:", error);
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
    console.log("AdminApp: DOM cargado, iniciando aplicación...");
    new AdminApp();
}); 