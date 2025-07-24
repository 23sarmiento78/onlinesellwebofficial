// src/utils/getArticlesFromHTML.js
// Función para cargar artículos desde archivos HTML estáticos

// Función para cargar artículos HTML estáticos
export async function getArticlesFromHTML() {
  try {
    console.log('📖 Cargando artículos HTML dinámicamente...');
    
    // Obtener lista de archivos HTML
    const files = await getHTMLFilesList();
    console.log(`📄 Archivos HTML encontrados: ${files.length}`);
    
    if (files.length === 0) {
      console.log('⚠️ No se encontraron archivos HTML');
      return [];
    }
    
    // Cargar artículos desde los archivos
    return await loadArticlesFromFiles(files);
    
  } catch (error) {
    console.log('❌ Error cargando archivos HTML:', error);
    return [];
  }
}

async function getHTMLFilesList() {
  try {
    // Leer el índice generado en el build
    console.log('🔍 Obteniendo archivos desde /blog/index.json...');
    const response = await fetch('/blog/index.json');
    if (response.ok) {
      const files = await response.json();
      console.log(`✅ index.json contiene: ${files.length} archivos`);
      return files;
    } else {
      console.log(`⚠️ Error al leer /blog/index.json: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('⚠️ Error leyendo /blog/index.json:', error.message);
  }
  console.log('🔄 No se pudo obtener la lista de archivos HTML.');
  return [];
}

async function loadArticlesFromFiles(files) {
  const articles = [];
  const failedFiles = [];
  
  console.log(`🔄 Procesando ${files.length} archivos...`);
  
  for (const filename of files) {
    try {
      console.log(`📖 Cargando: /blog/${filename}`);
      const response = await fetch(`/blog/${filename}`);
      
      if (response.ok) {
        const htmlContent = await response.text();
        console.log(`📄 Contenido obtenido para ${filename}: ${htmlContent.length} caracteres`);
        
        // Validar que el contenido sea un artículo real
        if (isValidArticleContent(htmlContent)) {
          const metadata = extractMetadataFromHTML(htmlContent, filename);
          
          if (metadata && metadata.title && metadata.title.length > 5) {
            articles.push(metadata);
            console.log(`✅ Artículo cargado: ${metadata.title}`);
          } else {
            console.log(`⚠️ Metadatos inválidos para ${filename}:`, metadata);
            failedFiles.push({ filename, reason: 'metadatos inválidos' });
          }
        } else {
          console.log(`⚠️ Contenido inválido para ${filename}`);
          failedFiles.push({ filename, reason: 'contenido inválido' });
        }
      } else {
        console.log(`❌ Error HTTP ${response.status} para ${filename}`);
        failedFiles.push({ filename, reason: `HTTP ${response.status}` });
      }
    } catch (error) {
      console.log(`❌ Error cargando ${filename}:`, error.message);
      failedFiles.push({ filename, reason: error.message });
    }
  }
  
  console.log(`🎉 Artículos cargados exitosamente: ${articles.length}`);
  if (failedFiles.length > 0) {
    console.log(`❌ Archivos que fallaron:`, failedFiles);
  }
  
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}



function isValidArticleContent(htmlContent) {
  // Verificar que sea contenido de artículo real, no página de error
  if (!htmlContent || htmlContent.length < 100) {
    console.log('⚠️ Contenido muy corto o vacío');
    return false;
  }
  
  // Verificar que tenga estructura HTML básica
  if (!htmlContent.includes('<html')) {
    console.log('⚠️ No es un archivo HTML válido');
    return false;
  }
  
  // Verificar que NO sea una página de error o página principal
  const errorIndicators = [
    'Desarrollo Web Villa Carlos Paz',
    'Programador Web Profesional',
    //'hgaruna', // Quitado para permitir artículos válidos
    'Artículo sobre desarrollo web y programación'
  ];
  
  for (const indicator of errorIndicators) {
    if (htmlContent.includes(indicator)) {
      console.log(`⚠️ Contenido detectado como página de error: ${indicator}`);
      return false;
    }
  }
  
  // Verificar que tenga contenido de artículo real (más flexible)
  const articleIndicators = [
    '<article',
    '<div class="article"',
    '<div class="content"',
    '<main',
    '<section',
    '<h1',
    '<h2',
    '<p>',
    '<body'
  ];
  
  const hasValidContent = articleIndicators.some(indicator => htmlContent.includes(indicator));
  
  if (!hasValidContent) {
    console.log('⚠️ No se encontraron indicadores de contenido de artículo');
  }
  
  return hasValidContent;
}

// Función para extraer metadatos de HTML
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
    
    // Calcular tiempo de lectura (aproximado)
    const wordCount = htmlContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 palabras por minuto
    
    // Determinar categoría basada en el contenido
    let category = 'Desarrollo Web';
    if (htmlContent.toLowerCase().includes('react') || htmlContent.toLowerCase().includes('angular')) {
      category = 'Frontend';
    } else if (htmlContent.toLowerCase().includes('aws') || htmlContent.toLowerCase().includes('lambda')) {
      category = 'Cloud Computing';
    } else if (htmlContent.toLowerCase().includes('machine learning') || htmlContent.toLowerCase().includes('ai')) {
      category = 'Inteligencia Artificial';
    }
    
    // Generar tags basados en el contenido
    const tags = [];
    if (htmlContent.toLowerCase().includes('javascript')) tags.push('JavaScript');
    if (htmlContent.toLowerCase().includes('react')) tags.push('React');
    if (htmlContent.toLowerCase().includes('angular')) tags.push('Angular');
    if (htmlContent.toLowerCase().includes('aws')) tags.push('AWS');
    if (htmlContent.toLowerCase().includes('performance')) tags.push('Performance');
    if (htmlContent.toLowerCase().includes('eslint')) tags.push('ESLint');
    if (htmlContent.toLowerCase().includes('sonarqube')) tags.push('SonarQube');
    if (htmlContent.toLowerCase().includes('quantum')) tags.push('Quantum Computing');
    if (htmlContent.toLowerCase().includes('websocket')) tags.push('WebSockets');
    if (htmlContent.toLowerCase().includes('microfrontend')) tags.push('Micro-frontends');
    if (htmlContent.toLowerCase().includes('low-code')) tags.push('Low-Code');
    
    return {
      title,
      summary,
      slug,
      date,
      author: 'hgaruna',
      image: '/logos-he-imagenes/programacion.jpeg',
      tags: tags.length > 0 ? tags : ['Desarrollo Web', 'Programación'],
      category,
      readingTime,
      wordCount,
      htmlFile: filename
    };
    
  } catch (error) {
    console.error('❌ Error extrayendo metadatos de HTML:', error);
    return null;
  }
}

// Función para obtener un artículo específico
export async function getArticleFromHTML(slug) {
  try {
    const articles = await getArticlesFromHTML();
    const article = articles.find(a => a.slug === slug);
    
    if (article) {
      // Leer el archivo HTML real
      try {
        const response = await fetch(`/blog/${article.htmlFile}`);
        if (response.ok) {
          const htmlContent = await response.text();
          // Extraer el contenido dentro de <main> si existe, si no, usar el body
          let mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
          let content = mainMatch ? mainMatch[1] : null;
          if (!content) {
            // Si no hay <main>, extraer el body
            let bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            content = bodyMatch ? bodyMatch[1] : htmlContent;
          }
          // Eliminar la imagen de portada duplicada
          if (article.image) {
            // Usar DOMParser si está disponible (navegador)
            try {
              const parser = new window.DOMParser();
              const doc = parser.parseFromString(`<div>${content}</div>`, 'text/html');
              const imgs = doc.querySelectorAll('img');
              let removed = false;
              imgs.forEach(img => {
                if (!removed && img.src && img.src.includes(article.image)) {
                  img.parentNode.removeChild(img);
                  removed = true;
                }
              });
              // Si no encontró por src, eliminar el primer <img>
              if (!removed && imgs.length > 0) {
                imgs[0].parentNode.removeChild(imgs[0]);
              }
              content = doc.body.innerHTML;
            } catch (e) {
              // Fallback: eliminar por regex (menos seguro)
              content = content.replace(new RegExp(`<img[^>]*src=["']${article.image}["'][^>]*>`, 'i'), '');
              // Si no encontró, eliminar el primer <img>
              content = content.replace(/<img[^>]*>/i, '');
            }
          }
          // Extraer estilos y links del <head>
          let headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
          let styles = [];
          let links = [];
          if (headMatch) {
            // Extraer <style>
            styles = [...headMatch[1].matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi)].map(m => m[0]);
            // Extraer <link rel="stylesheet">
            links = [...headMatch[1].matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(m => m[0]);
          }
          return {
            ...article,
            content,
            styles,
            links,
            htmlRaw: htmlContent
          };
        }
      } catch (error) {
        console.error('❌ Error leyendo el archivo HTML:', error);
      }
    }
    return null;
  } catch (error) {
    console.log('❌ Error cargando artículo HTML:', error);
    return null;
  }
}