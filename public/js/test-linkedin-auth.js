// Script de prueba para la autenticación de LinkedIn
class LinkedInAuthTest {
  constructor() {
    this.config = window.LINKEDIN_CONFIG || {};
    this.clientId = this.config.CLIENT_ID;
    this.redirectUri = this.config.REDIRECT_URI;
    this.scope = this.config.SCOPE;
  }

  // Probar el flujo completo de autenticación
  async testFullAuthFlow() {
    console.log('🧪 Iniciando prueba de autenticación de LinkedIn...');
    
    try {
      // Paso 1: Verificar configuración
      console.log('📋 Verificando configuración...');
      this.verifyConfig();
      
      // Paso 2: Generar URL de autorización
      console.log('🔗 Generando URL de autorización...');
      const authUrl = this.generateAuthUrl();
      console.log('URL de autorización:', authUrl);
      
      // Paso 3: Simular apertura de ventana
      console.log('🪟 Simulando apertura de ventana de autenticación...');
      const authWindow = window.open(authUrl, 'linkedin_auth_test', 
        'width=600,height=700,scrollbars=yes,resizable=yes');
      
      if (!authWindow) {
        throw new Error('No se pudo abrir la ventana de autenticación. Verifica el bloqueador de ventanas emergentes.');
      }
      
      console.log('✅ Ventana de autenticación abierta correctamente');
      
      // Paso 4: Escuchar mensajes de la ventana de callback
      return new Promise((resolve, reject) => {
        const messageHandler = (event) => {
          if (event.origin !== window.location.origin) return;
          
          console.log('📨 Mensaje recibido:', event.data);
          
          if (event.data.type === 'linkedin_auth_success') {
            console.log('✅ Autenticación exitosa!');
            console.log('Token recibido:', event.data.access_token ? 'SÍ' : 'NO');
            window.removeEventListener('message', messageHandler);
            authWindow.close();
            resolve({
              success: true,
              access_token: event.data.access_token,
              message: 'Autenticación completada exitosamente'
            });
          } else if (event.data.type === 'linkedin_auth_error') {
            console.log('❌ Error en autenticación:', event.data.error);
            window.removeEventListener('message', messageHandler);
            authWindow.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageHandler);

        // Verificar si la ventana se cerró manualmente
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            reject(new Error('Autenticación cancelada por el usuario'));
          }
        }, 1000);

        // Timeout después de 5 minutos
        setTimeout(() => {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          authWindow.close();
          reject(new Error('Timeout en autenticación'));
        }, 300000);
      });
      
    } catch (error) {
      console.error('❌ Error en prueba de autenticación:', error);
      throw error;
    }
  }

  // Verificar configuración
  verifyConfig() {
    const required = ['CLIENT_ID', 'REDIRECT_URI', 'SCOPE'];
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Configuración faltante: ${missing.join(', ')}`);
    }
    
    console.log('✅ Configuración verificada correctamente');
    console.log('Client ID:', this.clientId);
    console.log('Redirect URI:', this.redirectUri);
    console.log('Scope:', this.scope);
  }

  // Generar URL de autorización
  generateAuthUrl() {
    const state = this.generateState();
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${encodeURIComponent(this.scope)}&` +
      `state=${state}`;
    
    // Guardar el estado para verificación
    sessionStorage.setItem('linkedin_auth_state', state);
    
    return authUrl;
  }

  // Generar estado para seguridad OAuth
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Probar validación de token
  async testTokenValidation(accessToken) {
    console.log('🔍 Probando validación de token...');
    
    try {
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('✅ Token válido');
        console.log('Perfil:', profile);
        return profile;
      } else {
        throw new Error(`Token inválido: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error validando token:', error);
      throw error;
    }
  }
}

// Función global para ejecutar la prueba
window.testLinkedInAuth = async function() {
  const tester = new LinkedInAuthTest();
  
  try {
    const result = await tester.testFullAuthFlow();
    console.log('🎉 Prueba completada exitosamente:', result);
    
    // Probar validación del token si se recibió
    if (result.access_token) {
      await tester.testTokenValidation(result.access_token);
    }
    
    return result;
  } catch (error) {
    console.error('💥 Prueba falló:', error);
    throw error;
  }
};

// Función para probar desde la consola
console.log('🧪 LinkedIn Auth Test cargado. Usa testLinkedInAuth() para probar.'); 