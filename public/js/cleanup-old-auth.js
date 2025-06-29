// Script temporal para limpiar tokens del sistema anterior
console.log('🧹 Limpiando tokens del sistema anterior...');

const oldTokens = [
  'auth_token',
  'admin_token', 
  'auth_user',
  'admin_user',
  'access_token',
  'id_token'
];

oldTokens.forEach(token => {
  if (localStorage.getItem(token)) {
    localStorage.removeItem(token);
    console.log(`✅ Eliminado: ${token}`);
  }
});

// Limpiar también sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage limpiado');

// Eliminar variables globales del sistema anterior
if (window.simpleAuth) {
  delete window.simpleAuth;
  console.log('✅ simpleAuth eliminado');
}

console.log('✅ Limpieza completada');

// Función para limpiar todo manualmente
window.cleanAllAuth = function() {
  console.log('🧹 Limpieza manual iniciada...');
  localStorage.clear();
  sessionStorage.clear();
  if (window.simpleAuth) delete window.simpleAuth;
  console.log('✅ Todo limpiado manualmente');
  window.location.reload();
}; 