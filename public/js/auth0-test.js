// Script de prueba específico para el error 400 de Auth0
class Auth0Tester {
    constructor() {
        this.config = {
            domain: "dev-b0qip4vee7sg3q7e.us.auth0.com",
            clientId: "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab",
            redirectUri: "https://service.hgaruna.org/admin/",
            audience: "https://service.hgaruna.org/api"
        };
    }

    async testAuth0Configuration() {
        console.log("🧪 Iniciando pruebas específicas para error 400...");
        
        // 1. Verificar configuración básica
        this.testBasicConfig();
        
        // 2. Verificar endpoints de Auth0
        await this.testAuth0Endpoints();
        
        // 3. Generar URL de autorización manual
        this.testAuthURL();
        
        // 4. Verificar parámetros específicos
        this.testParameters();
        
        console.log("✅ Pruebas completadas");
    }

    testBasicConfig() {
        console.log("📋 Verificando configuración básica...");
        
        const issues = [];
        
        // Verificar domain
        if (!this.config.domain || this.config.domain !== "dev-b0qip4vee7sg3q7e.us.auth0.com") {
            issues.push("Domain incorrecto o faltante");
        }
        
        // Verificar clientId
        if (!this.config.clientId || this.config.clientId !== "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab") {
            issues.push("Client ID incorrecto o faltante");
        }
        
        // Verificar redirectUri
        if (!this.config.redirectUri || this.config.redirectUri !== "https://service.hgaruna.org/admin/") {
            issues.push("Redirect URI incorrecto o faltante");
        }
        
        // Verificar audience
        if (!this.config.audience || this.config.audience !== "https://service.hgaruna.org/api") {
            issues.push("Audience incorrecto o faltante");
        }
        
        if (issues.length > 0) {
            console.error("❌ Problemas encontrados:", issues);
        } else {
            console.log("✅ Configuración básica correcta");
        }
    }

    async testAuth0Endpoints() {
        console.log("🌐 Verificando endpoints de Auth0...");
        
        try {
            // Verificar JWKS endpoint
            const jwksResponse = await fetch(`https://${this.config.domain}/.well-known/jwks.json`);
            console.log("JWKS Status:", jwksResponse.status);
            
            if (!jwksResponse.ok) {
                console.error("❌ JWKS endpoint no accesible");
            }
            
            // Verificar OpenID Configuration
            const oidcResponse = await fetch(`https://${this.config.domain}/.well-known/openid_configuration`);
            console.log("OpenID Config Status:", oidcResponse.status);
            
            if (oidcResponse.ok) {
                const oidcConfig = await oidcResponse.json();
                console.log("✅ OpenID Configuration accesible");
                console.log("- Authorization endpoint:", oidcConfig.authorization_endpoint);
                console.log("- Token endpoint:", oidcConfig.token_endpoint);
                console.log("- Userinfo endpoint:", oidcConfig.userinfo_endpoint);
            } else {
                console.error("❌ OpenID Configuration no accesible");
            }
            
        } catch (error) {
            console.error("❌ Error verificando endpoints:", error);
        }
    }

    testAuthURL() {
        console.log("🔗 Generando URL de autorización para prueba...");
        
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            scope: 'openid profile email',
            audience: this.config.audience,
            state: 'test-state-' + Math.random().toString(36).substring(7),
            nonce: 'test-nonce-' + Math.random().toString(36).substring(7)
        });
        
        const authUrl = `https://${this.config.domain}/authorize?${params.toString()}`;
        
        console.log("URL de autorización generada:");
        console.log(authUrl);
        
        // Verificar longitud de URL
        if (authUrl.length > 2048) {
            console.warn("⚠️ URL muy larga, puede causar problemas");
        }
        
        // Verificar parámetros críticos
        const urlObj = new URL(authUrl);
        console.log("Parámetros en la URL:");
        for (const [key, value] of urlObj.searchParams) {
            console.log(`- ${key}: ${value}`);
        }
        
        return authUrl;
    }

    testParameters() {
        console.log("🔍 Verificando parámetros específicos...");
        
        // Verificar que redirect_uri no tenga espacios
        if (this.config.redirectUri.includes(' ')) {
            console.error("❌ Redirect URI contiene espacios");
        }
        
        // Verificar que redirect_uri esté codificado correctamente
        const encodedUri = encodeURIComponent(this.config.redirectUri);
        console.log("Redirect URI codificado:", encodedUri);
        
        // Verificar que client_id sea válido
        if (!/^[A-Za-z0-9_-]+$/.test(this.config.clientId)) {
            console.error("❌ Client ID contiene caracteres inválidos");
        }
        
        // Verificar que domain sea válido
        if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.config.domain)) {
            console.error("❌ Domain inválido");
        }
        
        console.log("✅ Verificación de parámetros completada");
    }

    async testManualAuth() {
        console.log("🚀 Probando autorización manual...");
        
        try {
            // Crear cliente Auth0 de prueba
            if (typeof auth0 === 'undefined') {
                console.error("❌ SDK de Auth0 no disponible");
                return;
            }
            
            const testClient = await auth0.createAuth0Client({
                domain: this.config.domain,
                client_id: this.config.clientId,
                authorizationParams: {
                    redirect_uri: this.config.redirectUri,
                    audience: this.config.audience
                }
            });
            
            console.log("✅ Cliente Auth0 creado exitosamente");
            
            // Verificar si ya está autenticado
            const isAuthenticated = await testClient.isAuthenticated();
            console.log("¿Autenticado?", isAuthenticated);
            
            if (!isAuthenticated) {
                console.log("🔐 Iniciando proceso de login...");
                // No ejecutar login automáticamente, solo mostrar que está listo
                console.log("✅ Cliente listo para login");
            }
            
        } catch (error) {
            console.error("❌ Error creando cliente Auth0:", error);
            console.error("Detalles del error:", error.message);
        }
    }

    generateDebugInfo() {
        console.log("📊 Información de debug:");
        console.log("- User Agent:", navigator.userAgent);
        console.log("- URL actual:", window.location.href);
        console.log("- Origen:", window.location.origin);
        console.log("- Protocolo:", window.location.protocol);
        console.log("- Host:", window.location.host);
        console.log("- Pathname:", window.location.pathname);
        
        // Verificar si estamos en HTTPS
        if (window.location.protocol !== 'https:') {
            console.warn("⚠️ No estás usando HTTPS, Auth0 requiere HTTPS");
        }
        
        // Verificar si estamos en el dominio correcto
        if (window.location.host !== 'service.hgaruna.org') {
            console.warn("⚠️ No estás en el dominio correcto");
        }
    }
}

// Funciones globales para pruebas
window.testAuth0Config = function() {
    const tester = new Auth0Tester();
    return tester.testAuth0Configuration();
};

window.testAuth0Manual = function() {
    const tester = new Auth0Tester();
    return tester.testManualAuth();
};

window.generateDebugInfo = function() {
    const tester = new Auth0Tester();
    return tester.generateDebugInfo();
};

// Ejecutar pruebas automáticamente si estamos en modo test
if (window.location.search.includes('test')) {
    console.log("🧪 Modo test detectado, ejecutando pruebas...");
    const tester = new Auth0Tester();
    tester.testAuth0Configuration();
    tester.generateDebugInfo();
} 