// Script temporal para limpiar tokens del sistema anterior
console.log('🧹 Limpiando tokens del sistema anterior...');

const oldTokens = [
  'auth_token',
  'admin_token', 
  'auth_user',
  'admin_user'
];

oldTokens.forEach(token => {
  if (localStorage.getItem(token)) {
    localStorage.removeItem(token);
    console.log(`✅ Eliminado: ${token}`);
  }
});

console.log('✅ Limpieza completada'); 