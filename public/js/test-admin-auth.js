// Script de prueba para verificar la autenticación del admin
window.testAdminAuth = function() {
  console.log('🧪 Probando autenticación del admin...');
  
  // Verificar tokens
  const authToken = localStorage.getItem('auth_token');
  const adminToken = localStorage.getItem('admin_token');
  const authUser = localStorage.getItem('auth_user');
  const adminUser = localStorage.getItem('admin_user');
  
  console.log('📋 Estado de tokens:');
  console.log('- auth_token:', authToken ? '✅ Presente' : '❌ Ausente');
  console.log('- admin_token:', adminToken ? '✅ Presente' : '❌ Ausente');
  console.log('- auth_user:', authUser ? '✅ Presente' : '❌ Ausente');
  console.log('- admin_user:', adminUser ? '✅ Presente' : '❌ Ausente');
  
  // Verificar si los tokens coinciden
  if (authToken && adminToken && authToken === adminToken) {
    console.log('✅ Tokens coinciden correctamente');
  } else if (authToken || adminToken) {
    console.log('⚠️ Tokens no coinciden, puede haber problemas');
  } else {
    console.log('❌ No hay tokens, usuario no autenticado');
  }
  
  // Verificar si el panel está disponible
  if (window.adminPanel) {
    console.log('✅ Panel de administración disponible');
  } else {
    console.log('❌ Panel de administración no disponible');
  }
  
  // Verificar si el sistema de autenticación está disponible
  if (window.simpleAuth) {
    console.log('✅ Sistema de autenticación disponible');
    console.log('- Autenticado:', window.simpleAuth.isAuthenticated);
    console.log('- Usuario:', window.simpleAuth.currentUser);
  } else {
    console.log('❌ Sistema de autenticación no disponible');
  }
  
  // Mostrar alerta con resumen
  const summary = `
Estado de Autenticación:
- Tokens: ${authToken && adminToken ? '✅ Coinciden' : '❌ Problema'}
- Panel: ${window.adminPanel ? '✅ Disponible' : '❌ No disponible'}
- Auth System: ${window.simpleAuth ? '✅ Disponible' : '❌ No disponible'}
- Autenticado: ${window.simpleAuth?.isAuthenticated ? '✅ Sí' : '❌ No'}
  `;
  
  alert(summary);
};

// Función para limpiar todos los tokens (útil para debugging)
window.clearAllTokens = function() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  console.log('🧹 Todos los tokens eliminados');
  alert('Tokens eliminados. Recarga la página para ver el formulario de login.');
};

// Función para simular login (útil para testing)
window.simulateLogin = function() {
  const testUser = {
    email: 'admin@hgaruna.com',
    name: 'admin',
    role: 'admin',
    loginTime: new Date().toISOString()
  };
  
  const token = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  localStorage.setItem('auth_user', JSON.stringify(testUser));
  localStorage.setItem('auth_token', token);
  localStorage.setItem('admin_user', JSON.stringify(testUser));
  localStorage.setItem('admin_token', token);
  
  console.log('🔐 Login simulado completado');
  alert('Login simulado completado. Recarga la página para ver el panel.');
}; 