// Script de depuración para Auth0
console.log('🔍 DEBUG: Iniciando depuración de Auth0...');

// Verificar localStorage
console.log('📦 localStorage actual:');
Object.keys(localStorage).forEach(key => {
  console.log(`  ${key}: ${localStorage.getItem(key)}`);
});

// Verificar si Auth0 está cargado
console.log('🔐 Auth0 disponible:', typeof auth0 !== 'undefined' ? '✅ Sí' : '❌ No');

// Verificar si auth0Auth está disponible
console.log('👤 auth0Auth disponible:', typeof window.auth0Auth !== 'undefined' ? '✅ Sí' : '❌ No');

// Verificar URL actual
console.log('🌐 URL actual:', window.location.href);

// Verificar si estamos en la página de admin
console.log('🏠 En página admin:', window.location.pathname.includes('admin') ? '✅ Sí' : '❌ No');

// Función para limpiar todo
window.clearAllAuth = function() {
  console.log('🧹 Limpiando todo...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ Todo limpiado');
  window.location.reload();
};

// Función para forzar login
window.forceAuth0Login = function() {
  console.log('🔐 Forzando login de Auth0...');
  if (window.auth0Auth) {
    window.auth0Auth.login();
  } else {
    console.error('❌ auth0Auth no disponible');
  }
};

console.log('✅ Debug completado. Usa clearAllAuth() o forceAuth0Login() en la consola'); 