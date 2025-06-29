// Verificador de configuración de Auth0
window.Auth0Checker = {
  check() {
    console.log('🔍 Verificando configuración de Auth0...');
    
    const checks = {
      config: this.checkConfig(),
      sdk: this.checkSDK(),
      urls: this.checkURLs(),
      environment: this.checkEnvironment()
    };
    
    console.log('📋 Resultados de verificación:', checks);
    
    if (checks.config && checks.sdk && checks.urls && checks.environment) {
      console.log('✅ Configuración de Auth0 correcta');
      return true;
    } else {
      console.log('❌ Problemas encontrados en la configuración de Auth0');
      this.showProblems(checks);
      return false;
    }
  },
  
  checkConfig() {
    const config = window.AUTH0_CONFIG;
    if (!config) {
      console.error('❌ AUTH0_CONFIG no encontrado');
      return false;
    }
    
    const required = ['domain', 'clientId', 'redirectUri'];
    for (const field of required) {
      if (!config[field]) {
        console.error(`❌ Campo requerido faltante: ${field}`);
        return false;
      }
    }
    
    console.log('✅ Configuración básica correcta');
    return true;
  },
  
  checkSDK() {
    if (typeof auth0 === 'undefined') {
      console.error('❌ SDK de Auth0 no cargado');
      return false;
    }
    
    console.log('✅ SDK de Auth0 disponible');
    return true;
  },
  
  checkURLs() {
    const currentDomain = window.location.hostname;
    const config = window.AUTH0_CONFIG;
    
    if (!config || !config.redirectUri) {
      console.error('❌ No se puede verificar URLs');
      return false;
    }
    
    const redirectDomain = new URL(config.redirectUri).hostname;
    
    if (redirectDomain !== currentDomain) {
      console.warn(`⚠️ Dominio de redirect no coincide: ${redirectDomain} vs ${currentDomain}`);
      return false;
    }
    
    console.log('✅ URLs configuradas correctamente');
    return true;
  },
  
  checkEnvironment() {
    // Verificar si estamos en un entorno de desarrollo
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      console.warn('⚠️ Ejecutando en localhost - algunas funciones pueden no funcionar');
    }
    
    console.log('✅ Entorno verificado');
    return true;
  },
  
  showProblems(checks) {
    const problems = [];
    
    if (!checks.config) problems.push('Configuración faltante');
    if (!checks.sdk) problems.push('SDK no cargado');
    if (!checks.urls) problems.push('URLs incorrectas');
    if (!checks.environment) problems.push('Problema de entorno');
    
    console.error('🚨 Problemas encontrados:', problems.join(', '));
  }
};

// Verificar automáticamente cuando se carga
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.Auth0Checker.check();
  }, 1000);
});

console.log('🔍 Auth0Checker cargado'); 