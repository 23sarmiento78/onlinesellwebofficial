// Configuración de LinkedIn API para Perfil Personal
// ✅ CONFIGURADO CON CREDENCIALES REALES

window.LINKEDIN_CONFIG = {
  // 🔑 CLIENT_ID: Credencial real de LinkedIn
  CLIENT_ID: '77d1u4hecolzrd',
  
  // 🎫 ACCESS_TOKEN: Token de acceso real (opcional, solo para pruebas locales)
  // ACCESS_TOKEN: '',
  
  // 🔗 REDIRECT_URI: URL de redirección (debe coincidir con LinkedIn)
  REDIRECT_URI: 'https://hgaruna.org/linkedin-callback.html',
  
  // 📝 SCOPE: Permisos necesarios para publicar en empresa
  SCOPE: 'openid profile email w_member_social',
  
  // 🔧 API_VERSION: Versión de la API
  API_VERSION: 'v2',
  
  // 👤 ACCOUNT_TYPE: Tipo de cuenta
  ACCOUNT_TYPE: 'personal',
  
  // 🤖 AUTO_SHARE: Configuración de auto-compartir
  AUTO_SHARE: {
    enabled: true,
    includeHashtags: true,
    includeLink: true,
    maxLength: 3000,
    personalProfile: {
      includeName: true,
      includeTitle: false,
      includeCompany: false
    }
  },
  
  // 🔔 NOTIFICATIONS: Configuración de notificaciones
  NOTIFICATIONS: {
    showSuccess: true,
    showErrors: true,
    duration: 5000
  },
  
  // 👔 ORGANIZATION_URL: URL de la página de empresa
  ORGANIZATION_URL: 'https://www.linkedin.com/company/hgaruna/'
};

// Función para actualizar configuración
window.updateLinkedInConfig = function(newConfig) {
  Object.assign(window.LINKEDIN_CONFIG, newConfig);
  localStorage.setItem('linkedin_config', JSON.stringify(window.LINKEDIN_CONFIG));
  console.log('✅ Configuración de LinkedIn actualizada');
};

// Función para cargar configuración guardada
window.loadLinkedInConfig = function() {
  const savedConfig = localStorage.getItem('linkedin_config');
  if (savedConfig) {
    const config = JSON.parse(savedConfig);
    Object.assign(window.LINKEDIN_CONFIG, config);
  }
};

// Cargar configuración al inicializar
document.addEventListener('DOMContentLoaded', () => {
  window.loadLinkedInConfig();
});

// Función para obtener configuración
window.getLinkedInConfig = function() {
  return window.LINKEDIN_CONFIG;
};
