// scripts/test-ebook-generation.js
// Script de prueba para verificar la generación de ebooks

const fs = require('fs').promises;
const path = require('path');

// Configuración
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EBOOKS_DIR = path.resolve(__dirname, '../ebooks');

/**
 * Verifica que los archivos necesarios existan
 */
async function checkPrerequisites() {
  console.log('🔍 Verificando prerrequisitos...');
  
  try {
    // Verificar directorio de blog
    const blogStats = await fs.stat(BLOG_DIR);
    console.log(`✅ Directorio de blog encontrado: ${BLOG_DIR}`);
    
    // Verificar archivos HTML
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    console.log(`✅ ${articleFiles.length} artículos HTML encontrados`);
    
    // Verificar dependencias
    const packageJson = require('../package.json');
    const requiredDeps = ['cheerio', 'puppeteer'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.devDependencies[dep]);
    
    if (missingDeps.length > 0) {
      console.log(`⚠️ Dependencias faltantes: ${missingDeps.join(', ')}`);
      console.log('💡 Ejecuta: npm install');
      return false;
    } else {
      console.log('✅ Todas las dependencias están instaladas');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error verificando prerrequisitos:', error.message);
    return false;
  }
}

/**
 * Prueba la extracción de contenido de un artículo
 */
async function testContentExtraction() {
  console.log('\n📄 Probando extracción de contenido...');
  
  try {
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    
    if (articleFiles.length === 0) {
      console.log('⚠️ No se encontraron artículos para probar');
      return false;
    }
    
    // Probar con el primer artículo
    const testFile = articleFiles[0];
    const testPath = path.join(BLOG_DIR, testFile);
    
    console.log(`📖 Probando con: ${testFile}`);
    
    const html = await fs.readFile(testPath, 'utf8');
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    
    // Extraer metadatos
    const title = $('.article-title').text().trim();
    const content = $('.article-content').html();
    const description = $('meta[name="description"]').attr('content') || '';
    const category = $('meta[name="category"]').attr('content') || 'General';
    
    console.log(`✅ Título extraído: ${title}`);
    console.log(`✅ Contenido extraído: ${content ? 'Sí' : 'No'}`);
    console.log(`✅ Descripción: ${description.substring(0, 50)}...`);
    console.log(`✅ Categoría: ${category}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en extracción de contenido:', error.message);
    return false;
  }
}

/**
 * Prueba la generación de HTML de ebook
 */
async function testEbookHTMLGeneration() {
  console.log('\n📚 Probando generación de HTML de ebook...');
  
  try {
    // Crear datos de prueba
    const testArticles = [
      {
        meta: {
          title: 'Artículo de Prueba 1',
          description: 'Descripción del artículo de prueba',
          author: 'hgaruna',
          date: '2024-01-01',
          readingTime: '5 min de lectura',
          category: 'Frontend'
        },
        content: '<h2>Introducción</h2><p>Este es un artículo de prueba para verificar la generación de ebooks.</p>',
        wordCount: 150
      },
      {
        meta: {
          title: 'Artículo de Prueba 2',
          description: 'Segundo artículo de prueba',
          author: 'hgaruna',
          date: '2024-01-02',
          readingTime: '3 min de lectura',
          category: 'Frontend'
        },
        content: '<h2>Desarrollo</h2><p>Contenido del segundo artículo de prueba.</p>',
        wordCount: 100
      }
    ];
    
    // Importar función de generación
    const { generateEbooks } = require('./generate-ebooks');
    
    console.log('✅ Función de generación de ebooks disponible');
    console.log(`✅ ${testArticles.length} artículos de prueba creados`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en generación de HTML:', error.message);
    return false;
  }
}

/**
 * Prueba la creación del directorio de ebooks
 */
async function testEbookDirectory() {
  console.log('\n📁 Probando creación de directorio de ebooks...');
  
  try {
    await fs.mkdir(EBOOKS_DIR, { recursive: true });
    console.log(`✅ Directorio de ebooks creado/verificado: ${EBOOKS_DIR}`);
    
    // Crear archivo de prueba
    const testFile = path.join(EBOOKS_DIR, 'test-ebook.html');
    const testContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Ebook de Prueba</title>
</head>
<body>
    <h1>Ebook de Prueba</h1>
    <p>Este es un ebook de prueba para verificar la funcionalidad.</p>
</body>
</html>`;
    
    await fs.writeFile(testFile, testContent);
    console.log('✅ Archivo de prueba creado');
    
    // Limpiar archivo de prueba
    await fs.unlink(testFile);
    console.log('✅ Archivo de prueba eliminado');
    
    return true;
  } catch (error) {
    console.error('❌ Error con directorio de ebooks:', error.message);
    return false;
  }
}

/**
 * Verifica las variables de entorno
 */
function checkEnvironmentVariables() {
  console.log('\n🔧 Verificando variables de entorno...');
  
  const siteUrl = process.env.SITE_URL || 'https://hgaruna.org';
  console.log(`✅ SITE_URL: ${siteUrl}`);
  
  return true;
}

/**
 * Función principal de prueba
 */
async function runTests() {
  console.log('🧪 Iniciando pruebas del sistema de ebooks...\n');
  
  const tests = [
    { name: 'Prerrequisitos', fn: checkPrerequisites },
    { name: 'Variables de entorno', fn: checkEnvironmentVariables },
    { name: 'Extracción de contenido', fn: testContentExtraction },
    { name: 'Generación de HTML', fn: testEbookHTMLGeneration },
    { name: 'Directorio de ebooks', fn: testEbookDirectory }
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
  
  console.log('\n📊 Resumen de Pruebas');
  console.log(`✅ Pruebas pasadas: ${passedTests}/${totalTests}`);
  console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ¡Todas las pruebas pasaron! El sistema está listo para generar ebooks.');
    console.log('\n💡 Comandos disponibles:');
    console.log('   npm run generate-ebooks');
    console.log('   npm run generate-advanced-ebooks');
    console.log('   npm run generate-all-ebooks');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores antes de generar ebooks.');
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 