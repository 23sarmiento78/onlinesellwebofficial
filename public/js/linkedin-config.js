// Configuración de LinkedIn API para Perfil Personal
// Reemplaza estos valores con tus credenciales reales de LinkedIn

window.LINKEDIN_CONFIG = {
  // Client ID de tu aplicación de LinkedIn
  // Obtén esto en: https://www.linkedin.com/developers/apps
  CLIENT_ID: 'YOUR_LINKEDIN_CLIENT_ID',
  
  // URL de redirección (debe coincidir con la configurada en LinkedIn)
  REDIRECT_URI: window.location.origin + '/admin/',
  
  // Permisos necesarios para perfil personal
  SCOPE: 'w_member_social',
  
  // Versión de la API
  API_VERSION: 'v2',
  
  // Tipo de cuenta (personal o empresa)
  ACCOUNT_TYPE: 'personal', // 'personal' o 'company'
  
  // Configuración de auto-share
  AUTO_SHARE: {
    enabled: true,
    includeHashtags: true,
    includeLink: true,
    maxLength: 3000,
    // Configuración específica para perfil personal
    personalProfile: {
      includeName: true,
      includeTitle: false,
      includeCompany: false
    }
  },
  
  // Configuración de notificaciones
  NOTIFICATIONS: {
    showSuccess: true,
    showErrors: true,
    duration: 5000
  }
};

// Función para actualizar configuración
window.updateLinkedInConfig = function(newConfig) {
  Object.assign(window.LINKEDIN_CONFIG, newConfig);
  
  // Guardar en localStorage
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