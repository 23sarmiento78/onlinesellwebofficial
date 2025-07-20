// scripts/test-real-articles.js
// Prueba que solo se cargan artículos reales

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');

function testRealArticles() {
  console.log('🧪 Probando carga de artículos reales...');
  console.log(`📁 Directorio: ${BLOG_DIR}`);
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('❌ El directorio blog no existe');
    return;
  }
  
  // Obtener todos los archivos HTML reales
  const realFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  console.log(`📄 Archivos HTML reales: ${realFiles.length}`);
  
  // Verificar contenido de cada archivo
  const validArticles = [];
  const invalidArticles = [];
  
  realFiles.forEach(file => {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Validar contenido
      if (content && content.length > 100 && content.includes('<html')) {
        // Extraer título para verificar que es válido
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : '';
        
        if (title && title.length > 5) {
          validArticles.push({ file, title, size: content.length });
        } else {
          invalidArticles.push({ file, reason: 'Sin título válido', size: content.length });
        }
      } else {
        invalidArticles.push({ file, reason: 'Contenido vacío o sin HTML', size: content.length });
      }
    } catch (error) {
      invalidArticles.push({ file, reason: `Error leyendo archivo: ${error.message}` });
    }
  });
  
  console.log(`\n📊 Resultados:`);
  console.log(`  ✅ Artículos válidos: ${validArticles.length}`);
  console.log(`  ❌ Artículos inválidos: ${invalidArticles.length}`);
  
  if (validArticles.length > 0) {
    console.log(`\n✅ Artículos que se cargarán correctamente:`);
    validArticles.forEach(article => {
      console.log(`  - ${article.file} (${article.size} chars) - "${article.title}"`);
    });
  }
  
  if (invalidArticles.length > 0) {
    console.log(`\n❌ Artículos que NO se cargarán:`);
    invalidArticles.forEach(article => {
      console.log(`  - ${article.file}: ${article.reason} (${article.size || 0} chars)`);
    });
  }
  
  console.log(`\n📈 Resumen:`);
  console.log(`  📄 Total de archivos: ${realFiles.length}`);
  console.log(`  ✅ Válidos: ${validArticles.length}`);
  console.log(`  ❌ Inválidos: ${invalidArticles.length}`);
  console.log(`  📊 Tasa de éxito: ${((validArticles.length / realFiles.length) * 100).toFixed(1)}%`);
}

testRealArticles(); 