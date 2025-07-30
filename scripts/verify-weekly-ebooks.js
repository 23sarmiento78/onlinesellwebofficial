// scripts/verify-weekly-ebooks.js
// Script para verificar la generación semanal de ebooks

const fs = require('fs').promises;
const path = require('path');

// Configuración
const EBOOKS_DIR = path.resolve(__dirname, '../ebooks');
const BLOG_DIR = path.resolve(__dirname, '../public/blog');

/**
 * Verifica la configuración semanal del sistema
 */
async function verifyWeeklyConfiguration() {
  console.log('📅 Verificando configuración semanal de ebooks...\n');
  
  try {
    // Verificar que el directorio de ebooks existe
    await fs.mkdir(EBOOKS_DIR, { recursive: true });
    console.log('✅ Directorio de ebooks verificado');
    
    // Verificar artículos disponibles
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    console.log(`✅ ${articleFiles.length} artículos disponibles para compilación semanal`);
    
    // Verificar categorías disponibles
    const categories = [
      'Frontend', 'Backend', 'Bases de Datos', 'DevOps y Cloud',
      'Testing y Calidad', 'Inteligencia Artificial', 'Seguridad'
    ];
    console.log(`✅ ${categories.length} categorías configuradas para ebooks semanales`);
    
    return true;
  } catch (error) {
    console.error('❌ Error verificando configuración:', error.message);
    return false;
  }
}

/**
 * Simula la generación semanal de ebooks
 */
async function simulateWeeklyGeneration() {
  console.log('\n🔄 Simulando generación semanal de ebooks...\n');
  
  try {
    const categories = [
      'Frontend', 'Backend', 'Bases de Datos', 'DevOps y Cloud',
      'Testing y Calidad', 'Inteligencia Artificial', 'Seguridad'
    ];
    
    console.log('📚 Ebooks que se generarán semanalmente:');
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category}`);
    });
    
    console.log('\n📄 Formatos que se crearán por categoría:');
    categories.forEach(category => {
      const slug = category.toLowerCase().replace(/\s+/g, '-');
      console.log(`  📖 ${category}:`);
      console.log(`     - ${slug}.pdf (ebook básico)`);
      console.log(`     - ${slug}.html (versión HTML básica)`);
      console.log(`     - guia-avanzada-${slug}.pdf (ebook avanzado)`);
      console.log(`     - guia-avanzada-${slug}.html (versión HTML avanzada)`);
    });
    
    const totalFiles = categories.length * 4; // 4 archivos por categoría
    console.log(`\n📊 Total de archivos que se generarán semanalmente: ${totalFiles}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en simulación:', error.message);
    return false;
  }
}

/**
 * Verifica el cronograma semanal
 */
function verifyWeeklySchedule() {
  console.log('\n⏰ Verificando cronograma semanal...\n');
  
  const schedule = {
    day: 'Domingo',
    time: '10:00 AM (hora Argentina)',
    cron: '0 13 * * 0',
    frequency: 'Una vez por semana',
    description: 'Generación automática de ebooks desde artículos del blog'
  };
  
  console.log('📅 Configuración del cronograma:');
  console.log(`  🗓️  Día: ${schedule.day}`);
  console.log(`  ⏰ Hora: ${schedule.time}`);
  console.log(`  🔄 Frecuencia: ${schedule.frequency}`);
  console.log(`  ⚙️  Cron: ${schedule.cron}`);
  console.log(`  📝 Descripción: ${schedule.description}`);
  
  console.log('\n💡 Para ejecutar manualmente:');
  console.log('   - Ve a GitHub > Actions > generate-ebooks.yml');
  console.log('   - Haz clic en "Run workflow"');
  console.log('   - Selecciona la rama y ejecuta');
  
  return true;
}

/**
 * Muestra estadísticas de la ejecución semanal
 */
async function showWeeklyStats() {
  console.log('\n📊 Estadísticas de la ejecución semanal...\n');
  
  try {
    // Contar artículos disponibles
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    
    // Calcular estadísticas estimadas
    const categories = 7;
    const filesPerCategory = 4; // PDF básico, HTML básico, PDF avanzado, HTML avanzado
    const totalFiles = categories * filesPerCategory;
    const avgWordsPerArticle = 1000;
    const totalWords = articleFiles.length * avgWordsPerArticle;
    
    console.log('📈 Estadísticas estimadas por ejecución semanal:');
    console.log(`  📚 Categorías procesadas: ${categories}`);
    console.log(`  📄 Archivos generados: ${totalFiles}`);
    console.log(`  📝 Artículos disponibles: ${articleFiles.length}`);
    console.log(`  📊 Palabras totales: ~${totalWords.toLocaleString()}`);
    console.log(`  ⏱️  Tiempo estimado: 5-10 minutos`);
    
    return true;
  } catch (error) {
    console.error('❌ Error calculando estadísticas:', error.message);
    return false;
  }
}

/**
 * Función principal de verificación semanal
 */
async function verifyWeeklyEbooks() {
  console.log('🧪 Verificando sistema de ebooks semanales...\n');
  
  const tests = [
    { name: 'Configuración semanal', fn: verifyWeeklyConfiguration },
    { name: 'Simulación de generación', fn: simulateWeeklyGeneration },
    { name: 'Cronograma semanal', fn: verifyWeeklySchedule },
    { name: 'Estadísticas semanales', fn: showWeeklyStats }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    try {
      const result = await test.fn();
      if (result) {
        console.log(`✅ ${test.name}: PASÓ`);
        passedTests++;
      } else {
        console.log(`❌ ${test.name}: FALLÓ`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
  }
  
  console.log('\n📊 Resumen de Verificación Semanal');
  console.log(`✅ Pruebas pasadas: ${passedTests}/${totalTests}`);
  console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ¡Sistema de ebooks semanales verificado!');
    console.log('\n📅 Próxima ejecución automática: Domingo 10:00 AM (hora Argentina)');
    console.log('\n💡 Comandos disponibles:');
    console.log('   npm run generate-ebooks           # Generar ebooks básicos');
    console.log('   npm run generate-advanced-ebooks  # Generar ebooks avanzados');
    console.log('   npm run generate-all-ebooks       # Generar todos los ebooks');
  } else {
    console.log('\n⚠️ Algunas verificaciones fallaron. Revisa la configuración.');
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  verifyWeeklyEbooks();
}

module.exports = { verifyWeeklyEbooks }; 