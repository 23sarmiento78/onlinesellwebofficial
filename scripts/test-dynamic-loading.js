// scripts/test-dynamic-loading.js
// Prueba la carga dinámica de artículos

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');

function testDynamicLoading() {
  console.log('🧪 Probando carga dinámica de artículos...');
  console.log(`📁 Directorio: ${BLOG_DIR}`);
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('❌ El directorio blog no existe');
    return;
  }
  
  // Obtener todos los archivos HTML reales
  const realFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  console.log(`📄 Archivos HTML reales: ${realFiles.length}`);
  
  // Simular la función generatePossibleFileList
  const today = new Date();
  const possibleFiles = [];
  
  // Generar archivos para los últimos 30 días
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Lista de posibles temas
    const topics = [
      'react-19-nuevas-caracteristicas-y-mejoras',
      'angular-18-nuevas-funcionalidades',
      'aws-lambda-computacin-sin-servidores',
      'static-analysis-eslint-y-sonarqube',
      'web-performance-core-web-vitals',
      'low-codeno-code-plataformas-de-desarrollo',
      'microfrontends-arquitectura-escalable',
      'quantum-computing-el-futuro-de-la-computacin',
      'websockets-vs-serversent-events-choosing-the-right',
      'rate-limiting-proteccin-de-apis',
      'machine-learning-para-desarrolladores-web',
      'deno-vs-nodejs-cul-elegir'
    ];
    
    // Generar archivos para cada tema
    topics.forEach(topic => {
      possibleFiles.push(`${dateStr}-${topic}.html`);
    });
  }
  
  console.log(`🔍 Archivos posibles generados: ${possibleFiles.length}`);
  
  // Encontrar coincidencias
  const matches = possibleFiles.filter(file => realFiles.includes(file));
  const missing = realFiles.filter(file => !possibleFiles.includes(file));
  
  console.log(`\n📊 Resultados:`);
  console.log(`  ✅ Coincidencias encontradas: ${matches.length}`);
  console.log(`  ❌ Archivos reales no en la lista: ${missing.length}`);
  
  if (matches.length > 0) {
    console.log(`\n✅ Archivos que SÍ se cargarán:`);
    matches.forEach(file => console.log(`  - ${file}`));
  }
  
  if (missing.length > 0) {
    console.log(`\n❌ Archivos que NO se cargarán (faltan en la lista):`);
    missing.forEach(file => console.log(`  - ${file}`));
  }
  
  console.log(`\n📈 Eficiencia:`);
  console.log(`  📄 Archivos reales: ${realFiles.length}`);
  console.log(`  🔍 Archivos probados: ${possibleFiles.length}`);
  console.log(`  ✅ Tasa de éxito: ${((matches.length / realFiles.length) * 100).toFixed(1)}%`);
  
  if (missing.length > 0) {
    console.log(`\n💡 Recomendación: Agregar estos temas a la lista:`);
    missing.forEach(file => {
      const topic = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.html', '');
      console.log(`  - '${topic}'`);
    });
  }
}

testDynamicLoading(); 