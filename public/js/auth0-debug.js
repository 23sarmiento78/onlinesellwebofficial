// Script de diagnóstico para Auth0
class Auth0Debugger {
    constructor() {
        this.config = {
            domain: "dev-b0qip4vee7sg3q7e.us.auth0.com",
            clientId: "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab",
            redirectUri: "https://service.hgaruna.org/admin/",
            audience: "https://service.hgaruna.org/api"
        };
    }

    async runDiagnostics() {
        console.log("🔍 Iniciando diagnóstico de Auth0...");
        
        // 1. Verificar configuración
        this.checkConfiguration();
        
        // 2. Verificar SDK
        await this.checkSDK();
        
        // 3. Verificar conectividad
        await this.checkConnectivity();
        
        // 4. Verificar URLs
        this.checkURLs();
        
        console.log("✅ Diagnóstico completado");
    }

    checkConfiguration() {
        console.log("📋 Verificando configuración...");
        console.log("- Domain:", this.config.domain);
        console.log("- Client ID:", this.config.clientId);
        console.log("- Redirect URI:", this.config.redirectUri);
        console.log("- Audience:", this.config.audience);
        
        // Verificar que todos los valores estén presentes
        const required = ['domain', 'clientId', 'redirectUri', 'audience'];
        const missing = required.filter(key => !this.config[key]);
        
        if (missing.length > 0) {
            console.error("❌ Configuración faltante:", missing);
        } else {
            console.log("✅ Configuración completa");
        }
    }

    async checkSDK() {
        console.log("📦 Verificando SDK de Auth0...");
        
        if (typeof auth0 === 'undefined') {
            console.error("❌ SDK de Auth0 no está cargado");
            return false;
        }
        
        console.log("✅ SDK de Auth0 disponible");
        console.log("- Versión:", auth0.version || 'No disponible');
        
        // Intentar crear cliente de prueba
        try {
            const testClient = await auth0.createAuth0Client({
                domain: this.config.domain,
                client_id: this.config.clientId,
                authorizationParams: {
                    redirect_uri: this.config.redirectUri,
                    audience: this.config.audience
                }
            });
            console.log("✅ Cliente de Auth0 creado exitosamente");
            return true;
        } catch (error) {
            console.error("❌ Error creando cliente de Auth0:", error);
            return false;
        }
    }

    async checkConnectivity() {
        console.log("🌐 Verificando conectividad...");
        
        try {
            // Verificar JWKS endpoint
            const jwksResponse = await fetch(`https://${this.config.domain}/.well-known/jwks.json`);
            if (jwksResponse.ok) {
                console.log("✅ JWKS endpoint accesible");
            } else {
                console.error("❌ JWKS endpoint no accesible:", jwksResponse.status);
            }
            
            // Verificar OpenID Configuration
            const oidcResponse = await fetch(`https://${this.config.domain}/.well-known/openid_configuration`);
            if (oidcResponse.ok) {
                const oidcConfig = await oidcResponse.json();
                console.log("✅ OpenID Configuration accesible");
                console.log("- Authorization endpoint:", oidcConfig.authorization_endpoint);
            } else {
                console.error("❌ OpenID Configuration no accesible:", oidcResponse.status);
            }
            
        } catch (error) {
            console.error("❌ Error verificando conectividad:", error);
        }
    }

    checkURLs() {
        console.log("🔗 Verificando URLs...");
        
        const currentOrigin = window.location.origin;
        const currentPath = window.location.pathname;
        
        console.log("- Origen actual:", currentOrigin);
        console.log("- Ruta actual:", currentPath);
        console.log("- URL completa:", window.location.href);
        
        // Verificar si estamos en la URL correcta
        if (currentOrigin === 'https://service.hgaruna.org' && currentPath === '/admin/') {
            console.log("✅ Estamos en la URL correcta");
        } else {
            console.warn("⚠️ No estamos en la URL esperada");
            console.warn("Esperado: https://service.hgaruna.org/admin/");
            console.warn("Actual:", window.location.href);
        }
        
        // Verificar parámetros de URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('code') || urlParams.has('state')) {
            console.log("📋 Parámetros de callback detectados:");
            console.log("- Code:", urlParams.has('code') ? 'Presente' : 'Ausente');
            console.log("- State:", urlParams.has('state') ? 'Presente' : 'Ausente');
            console.log("- Error:", urlParams.get('error') || 'Ninguno');
            console.log("- Error Description:", urlParams.get('error_description') || 'Ninguno');
        } else {
            console.log("✅ No hay parámetros de callback");
        }
    }

    generateAuthURL() {
        console.log("🔗 Generando URL de autorización...");
        
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            scope: 'openid profile email',
            audience: this.config.audience,
            state: Math.random().toString(36).substring(7)
        });
        
        const authUrl = `https://${this.config.domain}/authorize?${params.toString()}`;
        console.log("URL de autorización generada:", authUrl);
        
        return authUrl;
    }
}

// Función global para ejecutar diagnóstico
window.runAuth0Diagnostics = function() {
    const auth0Debugger = new Auth0Debugger();
    return auth0Debugger.runDiagnostics();
};

// Función para generar URL de autorización
window.generateAuth0URL = function() {
    const auth0Debugger = new Auth0Debugger();
    return auth0Debugger.generateAuthURL();
};

// Ejecutar diagnóstico automáticamente si estamos en modo debug
if (window.location.search.includes('debug')) {
    console.log("🐛 Modo debug detectado, ejecutando diagnóstico...");
    window.runAuth0Diagnostics();
} 