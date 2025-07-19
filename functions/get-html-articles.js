const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    console.log('🔍 Función get-html-articles ejecutándose...');
    
    // En Netlify, el directorio puede estar en diferentes ubicaciones
    const possiblePaths = [
      path.join(__dirname, '../public/blog'),
      path.join(__dirname, '../../public/blog'),
      path.join(process.cwd(), 'public/blog'),
      './public/blog'
    ];
    
    let blogDir = null;
    for (const testPath of possiblePaths) {
      console.log(`🔍 Probando ruta: ${testPath}`);
      if (fs.existsSync(testPath)) {
        blogDir = testPath;
        console.log(`✅ Directorio encontrado en: ${blogDir}`);
        break;
      }
    }
    
    if (!blogDir) {
      console.log('❌ No se encontró el directorio blog en ninguna ubicación');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          articles: [],
          error: 'Directorio blog no encontrado',
          searchedPaths: possiblePaths
        })
      };
    }

    // Leer todos los archivos .html del directorio
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));
    console.log(`📁 Archivos HTML encontrados: ${files.length}`);
    console.log('📄 Archivos:', files);

    const articles = [];

    for (const file of files) {
      try {
        const filePath = path.join(blogDir, file);
        console.log(`📖 Leyendo archivo: ${filePath}`);
        
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Extraer metadatos del HTML
        const metadata = extractMetadataFromHTML(fileContent, file);
        
        if (metadata) {
          articles.push(metadata);
          console.log(`✅ Artículo procesado: ${metadata.title}`);
        }
      } catch (error) {
        console.error(`❌ Error procesando archivo ${file}:`, error);
        // Continuar con el siguiente archivo
      }
    }

    // Ordenar por fecha (más reciente primero)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log(`🎉 Total de artículos procesados: ${articles.length}`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        articles,
        total: articles.length,
        source: 'html-files',
        directory: blogDir,
        files: files
      })
    };

  } catch (error) {
    console.error('❌ Error en get-html-articles:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error obteniendo artículos HTML',
        details: error.message,
        articles: []
      })
    };
  }
};

function extractMetadataFromHTML(htmlContent, filename) {
  try {
    // Extraer título
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : filename.replace('.html', '');
    
    // Extraer descripción
    const descMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
    const description = descMatch ? descMatch[1] : '';
    
    // Extraer keywords
    const keywordsMatch = htmlContent.match(/<meta[^>]*name="keywords"[^>]*content="([^"]+)"/i);
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [];
    
    // Extraer autor
    const authorMatch = htmlContent.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i);
    const author = authorMatch ? authorMatch[1] : 'hgaruna';
    
    // Extraer imagen
    const imageMatch = htmlContent.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
    const image = imageMatch ? imageMatch[1] : '/logos-he-imagenes/programacion.jpeg';
    
    // Extraer fecha del nombre del archivo
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] + 'T10:00:00.000Z' : new Date().toISOString();
    
    // Extraer slug del nombre del archivo
    const slug = filename.replace('.html', '');
    
    // Extraer categoría del contenido
    const categoryMatch = htmlContent.match(/{{CATEGORY}}/);
    const category = categoryMatch ? 'Desarrollo Web' : 'General';
    
    // Calcular tiempo de lectura (aproximado)
    const wordCount = htmlContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 palabras por minuto
    
    // Extraer resumen del contenido
    const summaryMatch = htmlContent.match(/<p class="lead[^>]*>([^<]+)<\/p>/i);
    const summary = summaryMatch ? summaryMatch[1] : description.substring(0, 150) + '...';
    
    return {
      title,
      summary,
      slug,
      date,
      author,
      image,
      tags: keywords,
      category,
      readingTime,
      wordCount,
      htmlFile: filename
    };
    
  } catch (error) {
    console.error('Error extrayendo metadatos de HTML:', error);
    return null;
  }
} 