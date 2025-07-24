// scripts/check-missing-articles.js
// Verifica qué archivos de artículos existen y cuáles faltan

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/public/blog');

// Lista de archivos que deberían existir (basada en la lista hardcodeada)
const expectedFiles = [
  '2025-07-19-static-analysis-eslint-y-sonarqube.html',
  '2025-07-19-web-performance-core-web-vitals.html',
  '2025-07-19-low-codeno-code-plataformas-de-desarrollo.html',
  '2025-07-19-angular-18-nuevas-funcionalidades.html',
  '2025-07-19-aws-lambda-computacin-sin-servidores.html',
  '2025-07-18-react-19-nuevas-caracteristicas-y-mejoras.html',
  '2025-07-19-microfrontends-arquitectura-escalable.html',
  '2025-07-19-quantum-computing-el-futuro-de-la-computacin.html',
  '2025-07-19-websockets-vs-serversent-events-choosing-the-right.html'
];

function checkArticles() {
  console.log('🔍 Verificando archivos de artículos...');
  console.log(`📁 Directorio: ${BLOG_DIR}`);
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('❌ El directorio public/blog no existe');
    return;
  }
  
  // Obtener archivos que realmente existen
  const existingFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  console.log(`\n📄 Archivos HTML existentes (${existingFiles.length}):`);
  existingFiles.forEach(file => console.log(`  ✅ ${file}`));
  
  // Verificar archivos esperados
  console.log(`\n📋 Verificando archivos esperados (${expectedFiles.length}):`);
  const missingFiles = [];
  const foundFiles = [];
  
  expectedFiles.forEach(file => {
    if (existingFiles.includes(file)) {
      foundFiles.push(file);
      console.log(`  ✅ ${file}`);
    } else {
      missingFiles.push(file);
      console.log(`  ❌ ${file} - FALTANTE`);
    }
  });
  
  // Archivos adicionales (no esperados)
  const additionalFiles = existingFiles.filter(file => !expectedFiles.includes(file));
  
  console.log(`\n📊 Resumen:`);
  console.log(`  ✅ Archivos encontrados: ${foundFiles.length}/${expectedFiles.length}`);
  console.log(`  ❌ Archivos faltantes: ${missingFiles.length}`);
  console.log(`  ➕ Archivos adicionales: ${additionalFiles.length}`);
  
  if (missingFiles.length > 0) {
    console.log(`\n❌ Archivos faltantes:`);
    missingFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  if (additionalFiles.length > 0) {
    console.log(`\n➕ Archivos adicionales:`);
    additionalFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  // Verificar contenido de archivos
  console.log(`\n🔍 Verificando contenido de archivos...`);
  existingFiles.forEach(file => {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const hasTitle = content.includes('<title>');
      const hasMain = content.includes('<main>');
      const hasCSS = content.includes('<style>') || content.includes('bootstrap');
      const size = content.length;
      
      console.log(`  📄 ${file}:`);
      console.log(`    - Tamaño: ${size} caracteres`);
      console.log(`    - Título: ${hasTitle ? '✅' : '❌'}`);
      console.log(`    - Main: ${hasMain ? '✅' : '❌'}`);
      console.log(`    - CSS: ${hasCSS ? '✅' : '❌'}`);
      
    } catch (error) {
      console.log(`  ❌ Error leyendo ${file}: ${error.message}`);
    }
  });
}

checkArticles(); 