#!/usr/bin/env node

// Script de verificación de configuración Auth0
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración de Auth0...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'public/js/auth0-config.js',
  'public/js/auth0-manager.js',
  'public/js/admin-panel.js',
  'public/admin.html',
  'functions/admin-api.js'
];

console.log('📁 Verificando archivos necesarios:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('');

// Verificar dependencias en package.json
console.log('📦 Verificando dependencias:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['jsonwebtoken', 'jwks-rsa'];

requiredDeps.forEach(dep => {
  const installed = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
  console.log(`${installed ? '✅' : '❌'} ${dep}${installed ? ` (${installed})` : ''}`);
});

console.log('');

// Verificar configuración en netlify.toml
console.log('🌐 Verificando variables de entorno en netlify.toml:');
const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
const requiredEnvVars = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID', 
  'AUTH0_CLIENT_SECRET',
  'AUTH0_AUDIENCE'
];

requiredEnvVars.forEach(varName => {
  const hasVar = netlifyToml.includes(varName);
  console.log(`${hasVar ? '✅' : '❌'} ${varName}`);
});

console.log('');

// Verificar configuración en auth0-config.js
console.log('⚙️ Verificando configuración en auth0-config.js:');
const auth0Config = fs.readFileSync('public/js/auth0-config.js', 'utf8');
const configChecks = [
  { name: 'Domain configurado', check: auth0Config.includes('dev-b0qip4vee7sg3q7e.us.auth0.com') },
  { name: 'Client ID configurado', check: auth0Config.includes('3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab') },
  { name: 'Redirect URI configurado', check: auth0Config.includes('https://service.hgaruna.org/admin/') },
  { name: 'Audience configurado', check: auth0Config.includes('https://service.hgaruna.org/api') }
];

configChecks.forEach(check => {
  console.log(`${check.check ? '✅' : '❌'} ${check.name}`);
});

console.log('');

// Verificar configuración en admin-api.js
console.log('🔧 Verificando configuración en admin-api.js:');
const adminApi = fs.readFileSync('functions/admin-api.js', 'utf8');
const apiChecks = [
  { name: 'JWT importado', check: adminApi.includes('require(\'jsonwebtoken\')') },
  { name: 'JWKS importado', check: adminApi.includes('require(\'jwks-rsa\')') },
  { name: 'Validación de tokens', check: adminApi.includes('validateToken') },
  { name: 'CORS configurado', check: adminApi.includes('Access-Control-Allow-Origin') },
  { name: 'Rutas de artículos', check: adminApi.includes('handleArticles') },
  { name: 'Rutas del foro', check: adminApi.includes('handleForumPosts') }
];

apiChecks.forEach(check => {
  console.log(`${check.check ? '✅' : '❌'} ${check.name}`);
});

console.log('\n' + '='.repeat(50));
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(50));

if (allFilesExist) {
  console.log('✅ Todos los archivos necesarios están presentes');
} else {
  console.log('❌ Faltan algunos archivos necesarios');
}

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('1. Verifica que las variables de entorno estén configuradas en Netlify');
console.log('2. Confirma que las URLs de callback estén configuradas en Auth0');
console.log('3. Prueba el login en: https://service.hgaruna.org/admin/');
console.log('4. Verifica los logs de Netlify Functions si hay errores');

console.log('\n🔗 URLs importantes:');
console.log('- Panel de admin: https://service.hgaruna.org/admin/');
console.log('- Dashboard de Auth0: https://manage.auth0.com/dashboard/us/dev-b0qip4vee7sg3q7e');
console.log('- Logs de Netlify: https://app.netlify.com/sites/[tu-site]/functions');

console.log('\n✨ ¡Verificación completada!'); 