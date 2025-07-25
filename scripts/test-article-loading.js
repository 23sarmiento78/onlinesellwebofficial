// scripts/test-article-loading.js
// Prueba la carga de artículos HTML

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.resolve(__dirname, '..//public/blog');

// Función simplificada para extraer metadatos (copiada de getArticlesFromHTML.js)
function extractMetadataFromHTML(htmlContent, filename) {
  try {
    // Extraer título del contenido HTML - buscar en múltiples lugares
    let title = '';
    
    // 1. Buscar en <title>
    const titleTagMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleTagMatch) {
      title = titleTagMatch[1];
    }
    
    // 2. Si no hay title tag, buscar en h1
    if (!title) {
      const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (h1Match) {
        title = h1Match[1];
      }
    }
    
    // 3. Si no hay h1, buscar en h2
    if (!title) {
      const h2Match = htmlContent.match(/<h2[^>]*>([^<]+)<\/h2>/i);
      if (h2Match) {
        title = h2Match[1];
      }
    }
    
    // 4. Si no hay nada, usar el nombre del archivo
    if (!title) {
      title = filename.replace('.html', '').replace(/-/g, ' ');
    }
    
    // Extraer fecha del nombre del archivo
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] + 'T10:00:00.000Z' : new Date().toISOString();
    
    // Extraer slug del nombre del archivo
    const slug = filename.replace('.html', '');
    
    // Extraer resumen del primer párrafo - buscar en múltiples lugares
    let summary = '';
    
    // 1. Buscar en meta description
    const metaDescMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
    if (metaDescMatch) {
      summary = metaDescMatch[1];
    }
    
    // 2. Si no hay meta description, buscar en párrafos
    if (!summary) {
      const pMatch = htmlContent.match(/<p[^>]*>([^<]+)<\/p>/i);
      if (pMatch) {
        summary = pMatch[1].substring(0, 150) + '...';
      }
    }
    
    // 3. Si no hay nada, usar descripción por defecto
    if (!summary) {
      summary = 'Artículo sobre desarrollo web y programación.';
    }
    
    return {
      title,
      summary,
      slug,
      date,
      author: 'hgaruna',
      image: '/logos-he-imagenes/programacion.jpeg',
      tags: ['Desarrollo Web', 'Programación'],
      category: 'Desarrollo Web',
      readingTime: 5,
      wordCount: 1000,
      htmlFile: filename
    };
    
  } catch (error) {
    console.error('❌ Error extrayendo metadatos de HTML:', error);
    return null;
  }
}

function testArticleLoading() {
  console.log('🧪 Probando carga de artículos...');
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log('❌ El directorio public/blog no existe');
    return;
  }
  
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  console.log(`📄 Encontrados ${files.length} archivos HTML`);
  
  const results = [];
  
  files.forEach(file => {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const metadata = extractMetadataFromHTML(content, file);
      
      if (metadata) {
        results.push(metadata);
        console.log(`✅ ${file}: "${metadata.title}"`);
      } else {
        console.log(`❌ ${file}: No se pudo extraer metadatos`);
      }
    } catch (error) {
      console.log(`❌ ${file}: Error - ${error.message}`);
    }
  });
  
  console.log(`\n📊 Resultado: ${results.length}/${files.length} artículos cargados correctamente`);
  
  if (results.length > 0) {
    console.log('\n📝 Artículos cargados:');
    results.forEach(article => {
      console.log(`  - ${article.title} (${article.slug})`);
    });
  }
}

testArticleLoading(); 