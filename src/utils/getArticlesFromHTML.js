// src/utils/getArticlesFromHTML.js
// Función para cargar artículos desde archivos HTML estáticos

// Función para cargar artículos HTML estáticos
export async function getArticlesFromHTML() {
  try {
    console.log('🔄 Cargando artículos HTML estáticos...');
    
    // En desarrollo, leer archivos HTML directamente
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Modo desarrollo: cargando archivos locales...');
      return await loadArticlesFromFiles();
    }
    
    // En producción, intentar cargar desde la API de Netlify Functions
    console.log('🚀 Modo producción: intentando cargar desde API...');
    try {
      const response = await fetch('/.netlify/functions/get-html-articles');
      console.log('📡 Respuesta de API:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Artículos cargados desde API:', data.articles?.length || 0);
        console.log('📊 Datos de respuesta:', data);
        
        if (data.articles && data.articles.length > 0) {
          return data.articles;
        } else {
          console.log('⚠️ API devolvió array vacío, usando fallback...');
          return await loadArticlesFromFiles();
        }
      } else {
        console.log('❌ API no respondió correctamente, usando fallback...');
        return await loadArticlesFromFiles();
      }
    } catch (error) {
      console.log('❌ Error con API, cargando archivos locales...', error);
      return await loadArticlesFromFiles();
    }
    
  } catch (error) {
    console.log('❌ Error cargando artículos HTML:', error);
    return [];
  }
}

// Función para cargar artículos desde archivos HTML en desarrollo
async function loadArticlesFromFiles() {
  try {
    console.log('📁 Cargando artículos desde archivos locales...');
    
    // Intentar obtener la lista dinámica de archivos HTML
    let htmlFiles = [];
    
    try {
      // Intentar obtener la lista desde la función de Netlify
      const listResponse = await fetch('/.netlify/functions/list-html-files');
      if (listResponse.ok) {
        const listData = await listResponse.json();
        htmlFiles = listData.files || [];
        console.log('📄 Archivos HTML detectados dinámicamente:', htmlFiles.length);
      }
    } catch (error) {
      console.log('⚠️ No se pudo obtener lista dinámica, usando fallback...');
    }
    
    // Si no se pudo obtener la lista dinámica, usar fallback
    if (htmlFiles.length === 0) {
      console.log('📋 Usando lista hardcodeada de archivos...');
      htmlFiles = [
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
    }

    const articles = [];

    // Cargar cada archivo HTML
    for (const filename of htmlFiles) {
      try {
        console.log(`📖 Intentando cargar: /blog/${filename}`);
        const response = await fetch(`/blog/${filename}`);
        
        if (response.ok) {
          const htmlContent = await response.text();
          const metadata = extractMetadataFromHTML(htmlContent, filename);
          
          if (metadata) {
            articles.push(metadata);
            console.log(`✅ Artículo cargado: ${metadata.title}`);
          }
        } else {
          console.log(`⚠️ No se pudo cargar ${filename}: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error cargando ${filename}:`, error);
        // Continuar con el siguiente archivo
      }
    }

    console.log(`🎉 Artículos HTML cargados desde archivos: ${articles.length}`);
    // Ordenar por fecha (más reciente primero)
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
  } catch (error) {
    console.log('❌ Error cargando archivos HTML:', error);
    return [];
  }
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