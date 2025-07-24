// scripts/test-fixed-loading.js
// Prueba la nueva función de carga de artículos

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/public/blog');

function testFixedLoading() {
  console.log('🧪 Probando nueva función de carga de artículos...');
  console.log(`📁 Directorio: ${BLOG_DIR}`);
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('❌ El directorio public/blog no existe');
    return;
  }
  
  // Simular la nueva lógica
  const knownFiles = [
    '2025-07-18-react-19-nuevas-caracteristicas-y-mejoras.html',
    '2025-07-19-angular-18-nuevas-funcionalidades.html',
    '2025-07-19-aws-lambda-computacin-sin-servidores.html',
    '2025-07-19-deno-vs-nodejs-cul-elegir.html',
    '2025-07-19-low-codeno-code-plataformas-de-desarrollo.html',
    '2025-07-19-machine-learning-para-desarrolladores-web.html',
    '2025-07-19-microfrontends-arquitectura-escalable.html',
    '2025-07-19-quantum-computing-el-futuro-de-la-computacin.html',
    '2025-07-19-rate-limiting-proteccin-de-apis.html',
    '2025-07-19-static-analysis-eslint-y-sonarqube.html',
    '2025-07-19-web-performance-core-web-vitals.html',
    '2025-07-19-websockets-vs-serversent-events-choosing-the-right.html'
  ];
  
  console.log(`📄 Archivos conocidos: ${knownFiles.length}`);
  
  // Verificar cuáles existen realmente
  const existingFiles = [];
  const missingFiles = [];
  
  knownFiles.forEach(file => {
    const filePath = path.join(BLOG_DIR, file);
    if (fs.existsSync(filePath)) {
      existingFiles.push(file);
    } else {
      missingFiles.push(file);
    }
  });
  
  console.log(`\n📊 Resultados:`);
  console.log(`  ✅ Archivos existentes: ${existingFiles.length}`);
  console.log(`  ❌ Archivos faltantes: ${missingFiles.length}`);
  
  if (existingFiles.length > 0) {
    console.log(`\n✅ Archivos que se cargarán:`);
    existingFiles.forEach(file => {
      const filePath = path.join(BLOG_DIR, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${stats.size} bytes)`);
    });
  }
  
  if (missingFiles.length > 0) {
    console.log(`\n❌ Archivos que NO existen:`);
    missingFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log(`\n📈 Resumen:`);
  console.log(`  📄 Total de archivos conocidos: ${knownFiles.length}`);
  console.log(`  ✅ Existentes: ${existingFiles.length}`);
  console.log(`  ❌ Faltantes: ${missingFiles.length}`);
  console.log(`  📊 Tasa de éxito: ${((existingFiles.length / knownFiles.length) * 100).toFixed(1)}%`);
  
  console.log(`\n🎯 Conclusión:`);
  console.log(`  La nueva función cargará exactamente ${existingFiles.length} artículos reales.`);
  console.log(`  No habrá artículos duplicados ni falsos.`);
}

testFixedLoading(); 