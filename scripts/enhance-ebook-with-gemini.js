const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { URL } = require('url');
require('dotenv').config();

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Rutas
const publicDir = path.resolve(__dirname, '../public');
const blogDir = path.resolve(publicDir, 'blog');
const ebooksDir = path.resolve(publicDir, 'ebooks');
const outputPath = path.resolve(blogDir, 'ebook_final.html');
const templatePath = path.resolve(__dirname, 'ebook-template.html');

// Asegurarse de que los directorios existan
[publicDir, blogDir, ebooksDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Directorio creado: ${dir}`);
  }
});

// Función para mejorar el contenido con Gemini
async function mejorarContenidoConGemini(contenido, titulo) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️ No se encontró GEMINI_API_KEY. Se omitirá la mejora de contenido con Gemini.');
    return contenido;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Mejora el siguiente artículo para un ebook profesional. El título es: "${titulo}".
    
    Instrucciones específicas:
    1. Corrige errores gramaticales y ortográficos
    2. Mejora la estructura y legibilidad
    3. Asegúrate de que el tono sea profesional y consistente
    4. Mantén el formato HTML pero mejóralo si es necesario
    5. Asegúrate de que las listas, encabezados y párrafos estén bien formateados
    6. Optimiza el contenido para lectura en formato PDF
    
    Contenido a mejorar:
    ${contenido.substring(0, 100000)}`; // Limitar a 100k caracteres

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('❌ Error al mejorar el contenido con Gemini:', error.message);
    return contenido; // Devolver el original si hay error
  }
}

// Función para limpiar y normalizar el HTML
async function limpiarYMejorarHTML(html, basePath, titulo) {
  try {
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    // Extraer el título si no se proporciona
    if (!titulo) {
      titulo = doc.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 'Artículo';
    }
    
    // Procesar imágenes
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (!src) return;
      
      try {
        // Convertir rutas relativas a absolutas
        if (!src.startsWith('http') && !src.startsWith('data:')) {
          const absolutePath = path.resolve(path.dirname(basePath), src);
          const relativeToPublic = path.relative(publicDir, absolutePath);
          img.setAttribute('src', `/${path.normalize(relativeToPublic).replace(/\\/g, '/')}`);
          
          // Añadir atributos para mejor visualización en PDF
          img.setAttribute('style', 'max-width: 100%; height: auto; display: block; margin: 1em auto;');
          img.setAttribute('loading', 'lazy');
        }
      } catch (e) {
        console.warn(`⚠️ No se pudo procesar la imagen: ${src}`, e.message);
      }
    });

    // Eliminar elementos no deseados
    const elementosEliminar = doc.querySelectorAll('script, iframe, form, button, input, select, textarea, nav, header, footer, .nav, .header, .footer, .ad, .ads, .advertisement');
    elementosEliminar.forEach(el => el.remove());
    
    // Mejorar la estructura de los encabezados
    const encabezados = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    encabezados.forEach((h, i) => {
      h.setAttribute('id', `heading-${i}`);
      h.setAttribute('style', 'page-break-after: avoid; break-after: avoid;');
    });
    
    // Mejorar tablas
    const tablas = doc.querySelectorAll('table');
    tablas.forEach(tabla => {
      tabla.setAttribute('style', 'width: 100%; border-collapse: collapse; margin: 1em 0; page-break-inside: avoid;');
      tabla.querySelectorAll('th, td').forEach(celda => {
        celda.setAttribute('style', 'border: 1px solid #ddd; padding: 8px;');
      });
      tabla.querySelectorAll('th').forEach(th => {
        th.setAttribute('style', 'background-color: #f5f5f5; border: 1px solid #ddd; padding: 8px; text-align: left;');
      });
    });
    
    // Mejorar bloques de código
    const codigos = doc.querySelectorAll('pre, code');
    codigos.forEach(codigo => {
      if (codigo.tagName.toLowerCase() === 'pre') {
        codigo.setAttribute('style', 'background: #f5f5f5; border: 1px solid #ddd; padding: 1em; overflow: auto; margin: 1em 0; page-break-inside: avoid;');
      } else {
        codigo.setAttribute('style', 'background: #f5f5f5; border: 1px solid #ddd; padding: 0.2em 0.4em; font-size: 90%;');
      }
    });
    
    // Obtener el contenido del body
    let contenido = doc.body.innerHTML;
    
    // Mejorar el contenido con Gemini si está disponible la API key
    if (process.env.GEMINI_API_KEY) {
      console.log('  - Mejorando contenido con Gemini...');
      contenido = await mejorarContenidoConGemini(contenido, titulo);
    }
    
    return { contenido, titulo };
  } catch (error) {
    console.error('❌ Error procesando el HTML:', error);
    return { contenido: html, titulo: 'Artículo' };
  }
}

// Función principal
(async () => {
  try {
    console.log('📚 Iniciando generación del eBook...');
    
    // Leer archivos HTML (excluye ebook_final.html)
    const files = fs.readdirSync(blogDir)
      .filter(f => f.endsWith('.html') && f !== 'ebook_final.html')
      .sort();

    if (files.length === 0) {
      console.warn('⚠️ No se encontraron artículos HTML para el eBook.');
      process.exit(0);
    }

    console.log(`📄 Procesando ${files.length} artículos...`);
    
    // Configuración de lotes
    const BATCH_SIZE = 5; // Tamaño del lote (ajustar según sea necesario)
    const articulos = [];
    let indice = [];
    
    // Función para procesar un lote de artículos
    const processBatch = async (batch, batchIndex) => {
      const batchResults = [];
      const startIndex = batchIndex * BATCH_SIZE;
      
      await Promise.all(batch.map(async (filename, indexInBatch) => {
        try {
          const fileIndex = startIndex + indexInBatch;
          const filepath = path.join(blogDir, filename);
          console.log(`  - Procesando: ${filename} (${fileIndex + 1}/${files.length})`);
          
          const content = fs.readFileSync(filepath, 'utf-8');
          const { contenido: contenidoMejorado, titulo } = await limpiarYMejorarHTML(content, filepath);
          
          batchResults.push({
            index: fileIndex,
            titulo,
            contenido: contenidoMejorado
          });
          
        } catch (error) {
          console.error(`❌ Error procesando ${filename}:`, error.message);
        }
      }));
      
      return batchResults;
    };
    
    // Procesar todos los archivos en lotes
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchResults = await processBatch(batch, i / BATCH_SIZE);
      
      // Procesar resultados del lote
      batchResults.forEach(({ index, titulo, contenido }) => {
        indice.push(`<li><a href="#articulo-${index}">${titulo}</a></li>`);
        
        articulos.push(`
          <section id="articulo-${index}" class="article">
            <h1>${titulo}</h1>
            <div class="contenido">
              ${contenido}
            </div>
            <div class="firma">
              <hr>
              <p>Artículo generado por Hgaruna - ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </section>
          <div class="page-break"></div>
        `);
      });
      
      // Pequeña pausa entre lotes para evitar sobrecargar la API
      if (i + BATCH_SIZE < files.length) {
        const progress = Math.min(100, Math.round(((i + BATCH_SIZE) / files.length) * 100));
        console.log(`⏳ Progreso: ${progress}% (${i + batch.length}/${files.length} artículos procesados)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (articulos.length === 0) {
      throw new Error('No se pudo procesar ningún artículo correctamente');
    }

    console.log('📖 Generando documento final...');
    
    // Leer plantilla
    let plantilla = fs.readFileSync(templatePath, 'utf-8');
    
    // Actualizar el índice en la plantilla
    const indiceHTML = `
      <h2>Tabla de Contenidos</h2>
      <ul class="indice-lista">
        ${indice.join('\n')}
      </ul>
      <div class="page-break"></div>
    `;
    
    // Reemplazar marcadores en la plantilla
    plantilla = plantilla
      .replace('{{INDICE}}', indiceHTML)
      .replace('{{ARTICULOS}}', articulos.join('\n\n'))
      .replace('{{FECHA}}', new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }))
      .replace('{{ANIO}}', new Date().getFullYear());
    
    const htmlFinal = plantilla;

    // Validar HTML final
    try {
      const dom = new JSDOM(htmlFinal);
      
      // Asegurar que todas las imágenes tengan atributos alt
      const imagenes = dom.window.document.querySelectorAll('img');
      imagenes.forEach((img, i) => {
        if (!img.hasAttribute('alt')) {
          img.setAttribute('alt', `Imagen ${i + 1} - ${img.getAttribute('src')?.split('/').pop() || ''}`);
        }
      });
      
      // Actualizar el HTML con las mejoras
      const htmlMejorado = dom.serialize();
      
      // Asegurar que el directorio existe
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      // Guardar resultado
      fs.writeFileSync(outputPath, htmlMejorado, 'utf8');
      
      // Verificar que el archivo se creó correctamente
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`✅ eBook generado exitosamente: ${outputPath} (${Math.ceil(stats.size / 1024)} KB)`);
        console.log(`📄 Ruta absoluta: ${path.resolve(outputPath)}`);
      } else {
        console.error('❌ Error: No se pudo verificar la creación del archivo');
      }
      
    } catch (error) {
      console.warn('⚠️ El HTML generado podría tener problemas de validación:', error.message);
      // Guardar de todos modos
      fs.writeFileSync(outputPath, htmlFinal);
      console.log(`✅ eBook generado con advertencias: ${outputPath}`);
    }

    // El guardado ahora se maneja en el bloque try-catch de validación
    
  } catch (err) {
    console.error('❌ Error crítico generando el eBook:', err);
    process.exit(1);
  }
})();
