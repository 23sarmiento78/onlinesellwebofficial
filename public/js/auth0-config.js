// Configuración de Auth0 - Sistema Limpio
const AUTH0_CONFIG = {
  domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com',
  clientId: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab',
  clientSecret: 'W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS',
  redirectUri: 'https://service.hgaruna.org/admin/',
  logoutUri: 'https://service.hgaruna.org/',
  audience: 'https://service.hgaruna.org/api',
  scope: 'openid profile email'
};

// Hacer la configuración globalmente accesible
window.AUTH0_CONFIG = AUTH0_CONFIG;

console.log('✅ Configuración de Auth0 cargada'); 