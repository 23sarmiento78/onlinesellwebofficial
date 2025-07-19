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
        '2025-07-19-monorepo-vs-polyrepo-estrategias.html',
        '2025-07-19-aws-lambda-computacin-sin-servidores.html',
        '2025-07-19-machine-learning-para-web-gua-definitiva.html',
        '2025-07-19-ansible-automatizacin-de-configuracin.html',
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
    // Extraer título del contenido HTML
    const titleMatch = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : filename.replace('.html', '');
    
    // Extraer fecha del nombre del archivo
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] + 'T10:00:00.000Z' : new Date().toISOString();
    
    // Extraer slug del nombre del archivo
    const slug = filename.replace('.html', '');
    
    // Extraer resumen del primer párrafo
    const summaryMatch = htmlContent.match(/<p[^>]*>([^<]+)<\/p>/i);
    const summary = summaryMatch ? summaryMatch[1].substring(0, 150) + '...' : 'Artículo sobre desarrollo web y programación.';
    
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
      // En desarrollo, devolver información básica del artículo
      // En producción, esto cargaría el contenido HTML completo
      return {
        ...article,
        content: `# ${article.title}

${article.summary}

## Introducción

Este es un artículo generado por inteligencia artificial sobre ${article.category.toLowerCase()}.

## Contenido Principal

El contenido completo del artículo estaría aquí, incluyendo:

- Puntos importantes
- Ejemplos prácticos
- Mejores prácticas
- Conclusiones

## Conclusión

Este artículo proporciona información valiosa sobre ${article.tags.join(', ')}.

---

*Generado por inteligencia artificial - hgaruna*`
      };
    }
    
    return null;
  } catch (error) {
    console.log('❌ Error cargando artículo HTML:', error);
    return null;
  }
} 