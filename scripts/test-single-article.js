const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Rutas
const publicDir = path.resolve(__dirname, '../public');
const blogDir = path.resolve(publicDir, 'blog');

// Función para limpiar el HTML
async function limpiarHTML(html) {
  try {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
      .replace(/<link[^>]*>/g, '')
      .replace(/<meta[^>]*>/g, '')
      .replace(/<form[^>]*>[\s\S]*?<\/form>/g, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/g, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/g, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g, '')
      .replace(/<button[^>]*>[\s\S]*?<\/button>/g, '')
      .replace(/class=\"[^\"]*\"/g, '')
      .replace(/id=\"[^\"]*\"/g, '')
      .replace(/style=\"[^\"]*\"/g, '');
  } catch (error) {
    console.warn('⚠️ Error al limpiar HTML:', error.message);
    return html;
  }
}

// Función para extraer contenido del artículo
async function extraerContenidoArticulo(contenido, titulo) {
  try {
    const htmlLimpio = limpiarHTML(contenido);
    const dom = new JSDOM(htmlLimpio);
    const doc = dom.window.document;
    
    // Buscar específicamente la clase article-content y luego el main dentro
    const articleElement = doc.querySelector('article.article-content') || 
                          doc.querySelector('.article-content') ||
                          doc.querySelector('article');
    
    if (!articleElement) {
      console.log('⚠️ No se encontró el elemento article, usando body');
      return contenido;
    }
    
    console.log(`  - Encontrado elemento: ${articleElement.tagName}${articleElement.className ? '.' + articleElement.className : ''}`);
    
    // Buscar el main dentro del article
    const contenidoPrincipal = articleElement.querySelector('main') || articleElement;
    
    console.log(`  - Contenido principal: ${contenidoPrincipal.tagName}`);
    
    const elementosARemover = [
      'nav', 'header', 'footer', 'script', 'style', 'iframe',
      '.nav', '.header', '.footer', '.sidebar', '.comments',
      '.social-share', '.related-posts', '.ads', '.ad'
    ];
    
    elementosARemover.forEach(selector => {
      const elementos = contenidoPrincipal.querySelectorAll(selector);
      elementos.forEach(el => el.remove());
    });
    
    return contenidoPrincipal.innerHTML;
    
  } catch (error) {
    console.error('❌ Error al extraer contenido del artículo:', error.message);
    return contenido;
  }
}

// Función para obtener retroalimentación de Gemini
async function obtenerRetroalimentacionGemini(contenido, titulo) {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Eres un experto revisor de contenido técnico especializado en programación.

TAREA: Proporcionar retroalimentación constructiva sobre el siguiente artículo.

ARTÍCULO A REVISAR:
- Título: "${titulo}"
- Contenido: ${contenido.substring(0, 8000)}

INSTRUCCIONES PARA LA RETROALIMENTACIÓN:
1. Analiza la calidad técnica del contenido
2. Identifica fortalezas del artículo
3. Sugiere mejoras específicas (si las hay)
4. Evalúa la claridad y estructura
5. Comenta sobre la relevancia para desarrolladores
6. Proporciona un puntaje del 1-10 con justificación

FORMATO DE RESPUESTA:
- Máximo 200 palabras
- Tono constructivo y profesional
- Enfocado en aspectos técnicos y educativos
- Incluir puntaje final

Devuelve SOLO la retroalimentación, sin formato adicional.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.warn('⚠️ Error al obtener retroalimentación:', error.message);
    return null;
  }
}

// Función principal de prueba
async function probarArticuloUnico() {
  try {
    console.log('🧪 PRUEBA: Procesamiento de un solo artículo');
    console.log('=' .repeat(50));
    
    // Verificar que existe el directorio
    if (!fs.existsSync(blogDir)) {
      console.error('❌ No se encontró el directorio del blog');
      return;
    }
    
    // Obtener archivos HTML
    const files = fs.readdirSync(blogDir)
      .filter(f => f.endsWith('.html') && f !== 'ebook_final.html')
      .sort();
    
    if (files.length === 0) {
      console.error('❌ No se encontraron artículos HTML');
      return;
    }
    
    // Tomar solo el primer artículo para la prueba
    const testFile = files[0];
    console.log(`📄 Probando con: ${testFile}`);
    
    const filePath = path.join(blogDir, testFile);
    const html = fs.readFileSync(filePath, 'utf8');
    const titulo = path.basename(testFile, '.html').replace(/-/g, ' ');
    
    console.log(`📝 Título: ${titulo}`);
    console.log(`📊 Tamaño del archivo: ${Math.round(html.length / 1024)} KB`);
    
    // Extraer contenido
    console.log('\n🔄 Extrayendo contenido...');
    const contenidoExtraido = await extraerContenidoArticulo(html, titulo);
    console.log(`✅ Contenido extraído: ${Math.round(contenidoExtraido.length / 1024)} KB`);
    
    // Limpiar HTML
    console.log('\n🔄 Limpiando HTML...');
    const contenidoLimpio = await limpiarHTML(contenidoExtraido);
    console.log(`✅ HTML limpiado: ${Math.round(contenidoLimpio.length / 1024)} KB`);
    
    // Obtener retroalimentación
    console.log('\n🔄 Obteniendo retroalimentación...');
    const retroalimentacion = await obtenerRetroalimentacionGemini(contenidoLimpio, titulo);
    
    if (retroalimentacion) {
      console.log('✅ Retroalimentación obtenida:');
      console.log('─' .repeat(40));
      console.log(retroalimentacion);
      console.log('─' .repeat(40));
    } else {
      console.log('⚠️ No se pudo obtener retroalimentación');
    }
    
    // Mostrar estadísticas
    console.log('\n📊 Estadísticas del procesamiento:');
    console.log(`   - Archivo original: ${Math.round(html.length / 1024)} KB`);
    console.log(`   - Contenido extraído: ${Math.round(contenidoExtraido.length / 1024)} KB`);
    console.log(`   - HTML final: ${Math.round(contenidoLimpio.length / 1024)} KB`);
    console.log(`   - Retroalimentación: ${retroalimentacion ? 'Sí' : 'No'}`);
    
    console.log('\n✅ Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar la prueba
probarArticuloUnico(); 