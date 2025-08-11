// scripts/test-all-articles.js
// Prueba que se cargan todos los artículos de la carpeta

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '..//public/blog');

function testAllArticles() {
  console.log('🧪 Probando carga de todos los artículos...');
  console.log(`📁 Directorio: ${BLOG_DIR}`);
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('❌ El directorio public/blog no existe');
    return;
  }
  
  // Obtener todos los archivos HTML
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  console.log(`📄 Archivos HTML encontrados: ${files.length}`);
  
  files.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file}`);
  });
  
  console.log('\n📊 Resumen:');
  console.log(`  ✅ Total de archivos HTML: ${files.length}`);
  console.log(`  📅 Archivos por fecha:`);
  
  // Agrupar por fecha
  const filesByDate = {};
  files.forEach(file => {
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : 'Sin fecha';
    if (!filesByDate[date]) filesByDate[date] = [];
    filesByDate[date].push(file);
  });
  
  Object.keys(filesByDate).sort().forEach(date => {
    console.log(`    ${date}: ${filesByDate[date].length} archivos`);
  });
  
  console.log('\n🔍 Verificando que todos los archivos están en la lista hardcodeada...');
  
  // Lista hardcodeada actual
  const hardcodedFiles = [
    '2025-07-19-static-analysis-eslint-y-sonarqube.html',
    '2025-07-19-web-performance-core-web-vitals.html',
    '2025-07-19-low-codeno-code-plataformas-de-desarrollo.html',
    '2025-07-19-angular-18-nuevas-funcionalidades.html',
    '2025-07-19-aws-lambda-computacin-sin-servidores.html',
    '2025-07-18-react-19-nuevas-caracteristicas-y-mejoras.html',
    '2025-07-19-microfrontends-arquitectura-escalable.html',
    '2025-07-19-quantum-computing-el-futuro-de-la-computacin.html',
    '2025-07-19-websockets-vs-serversent-events-choosing-the-right.html',
    '2025-07-19-rate-limiting-proteccin-de-apis.html',
    '2025-07-19-machine-learning-para-desarrolladores-web.html',
    '2025-07-19-deno-vs-nodejs-cul-elegir.html'
  ];
  
  const missingFiles = files.filter(file => !hardcodedFiles.includes(file));
  const extraFiles = hardcodedFiles.filter(file => !files.includes(file));
  
  if (missingFiles.length > 0) {
    console.log(`❌ Archivos faltantes en la lista hardcodeada:`);
    missingFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  if (extraFiles.length > 0) {
    console.log(`⚠️ Archivos en la lista hardcodeada que no existen:`);
    extraFiles.forEach(file => console.log(`  - ${file}`));
  }
  
  if (missingFiles.length === 0 && extraFiles.length === 0) {
    console.log('✅ Todos los archivos están correctamente listados');
  }
  
  console.log(`\n📈 Estadísticas:`);
  console.log(`  📄 Archivos reales: ${files.length}`);
  console.log(`  📋 Archivos en lista: ${hardcodedFiles.length}`);
  console.log(`  ❌ Faltantes: ${missingFiles.length}`);
  console.log(`  ⚠️ Extra: ${extraFiles.length}`);
}

testAllArticles(); 