// Configuración de Auth0
window.AUTH0_CONFIG = {
  domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com',
  clientId: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab',
  redirectUri: 'https://service.hgaruna.org/admin/',
  audience: 'https://service.hgaruna.org/api',
  scope: 'openid profile email'
};

console.log('⚙️ Configuración de Auth0 cargada:', window.AUTH0_CONFIG); 