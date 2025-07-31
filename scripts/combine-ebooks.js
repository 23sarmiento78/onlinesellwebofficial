const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cheerio = require('cheerio');

// --- Configuración ---
const EBOOKS_DIR = path.resolve(__dirname, '../ebooks');
const OUTPUT_PDF = path.join(EBOOKS_DIR, 'guia-completa-desarrollo-web.pdf');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ Error: La variable de entorno GEMINI_API_KEY no está configurada.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Obtiene y ordena los archivos HTML de los ebooks individuales.
 */
async function getEbookHtmlFiles() {
  const files = await fs.readdir(EBOOKS_DIR);
  return files
    .filter(file => file.endsWith('.html') && !file.startsWith('guia-completa'))
    .sort((a, b) => a.localeCompare(b)); // Orden alfabético para consistencia
}

/**
 * Extrae el contenido del body de un archivo HTML.
 */
async function extractBodyContent(filePath) {
  try {
    const html = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(html);
    // Extraemos solo el contenido dentro de la etiqueta <article> o <body> si no existe
    const content = $('article').html() || $('body').html();
    if (!content) {
        console.warn(`⚠️ No se encontró contenido en ${path.basename(filePath)}`);
        return '';
    }
    return content;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return '';
  }
}

/**
 * Llama a la API de Gemini para mejorar y estructurar el ebook.
 */
async function getImprovedContentFromGemini(combinedContent) {
  console.log('🤖 Contactando a Gemini 1.5 Flash para mejorar el ebook...');
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Eres un editor técnico experto y diseñador de contenido, especializado en crear ebooks profesionales.
    Tu tarea es transformar la siguiente colección de artículos HTML en un único y cohesivo ebook, listo para ser convertido a PDF.

    Contenido de los artículos (en formato HTML):
    ---
    ${combinedContent}
    ---

    Por favor, realiza las siguientes acciones y devuelve un ÚNICO y completo archivo HTML:

    1.  **Crea una Portada (Cover Page):** Diseña una portada elegante y profesional. Debe ser el primer elemento en el <body>. Usa CSS inline para el estilo. La portada debe incluir:
        - Título principal: "Guía Completa de Desarrollo Web y Buenas Prácticas"
        - Subtítulo: "De los Fundamentos a la Automatización"
        - Nombre del autor: "hgaruna"
        - Un diseño moderno y limpio.

    2.  **Crea una Introducción:** Justo después de la portada, escribe una introducción atractiva para el ebook, explicando su propósito y lo que el lector aprenderá.

    3.  **Crea una Tabla de Contenidos (Índice):** Después de la introducción, genera una tabla de contenidos. Analiza las etiquetas <h2> y <h3> del contenido proporcionado para crear las entradas. Usa enlaces de anclaje (ej: <a href="#seccion-1">Título</a>). Deberás añadir los IDs correspondientes a los encabezados en el contenido principal.

    4.  **Revisa y Mejora el Contenido Principal:**
        - Integra los artículos de manera fluida, asegurando que el texto fluya como un libro cohesivo.
        - Corrige cualquier error gramatical o de estilo. Mantén un tono profesional y educativo.
        - Conserva la estructura de los bloques de código (<pre><code>...</code></pre>).

    5.  **Crea un Glosario de Términos:** Al final del documento, antes de cerrar el <body>, crea una sección de "Glosario". Identifica términos técnicos clave (como Docker, PWA, Monorepo, ESLint, API, CI/CD) y proporciona definiciones claras y concisas.

    6.  **Estructura Final del HTML:** El resultado debe ser un archivo HTML válido con <head> y <body>. El <head> debe incluir un <title> y una etiqueta <style> con CSS profesional adecuado para la conversión a PDF (buena tipografía, márgenes, control de saltos de página para encabezados, etc.). El <body> debe contener, en este orden: Portada, Introducción, Tabla de Contenidos, Contenido Principal Mejorado y Glosario.
    `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpiar el markdown de Gemini si lo devuelve
    text = text.replace(/^```html\s*/, '').replace(/```$/, '');
    
    console.log('✅ Contenido mejorado recibido de Gemini.');
    return text;
  } catch (error) {
    console.error('❌ Error al comunicarse con la API de Gemini:', error);
    throw error;
  }
}

/**
 * Genera el PDF final a partir del HTML mejorado.
 */
async function generateFinalPDF(htmlContent, outputPath) {
  console.log('🔄 Generando PDF final...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: { top: '2.5cm', right: '2cm', bottom: '2.5cm', left: '2cm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 9px; text-align: center; width: 100%; color: #888;">Guía Completa de Desarrollo Web - hgaruna</div>',
    footerTemplate: '<div style="font-size: 9px; text-align: center; width: 100%; color: #888;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
  });
  
  await browser.close();
  console.log(`✅ PDF final generado con éxito: ${outputPath}`);
}

/**
 * Función principal que orquesta todo el proceso.
 */
async function main() {
  console.log('📚 Iniciando la creación del ebook combinado...');
  
  const htmlFiles = await getEbookHtmlFiles();
  if (htmlFiles.length === 0) {
    console.log('ℹ️ No se encontraron archivos HTML para combinar.');
    return;
  }
  console.log(`📄 Encontrados ${htmlFiles.length} artículos para combinar.`);

  let combinedContent = '';
  for (const file of htmlFiles) {
    const filePath = path.join(EBOOKS_DIR, file);
    console.log(`   -> Procesando: ${file}`);
    const content = await extractBodyContent(filePath);
    combinedContent += content + '<div style="page-break-after: always;"></div>'; // Añade un salto de página entre artículos
  }

  if (!combinedContent.trim()) {
      console.error('❌ No se pudo extraer contenido de los archivos HTML.');
      return;
  }

  const improvedHtml = await getImprovedContentFromGemini(combinedContent);
  
  // Guardar el HTML mejorado para depuración (opcional pero recomendado)
  await fs.writeFile(path.join(EBOOKS_DIR, 'guia-completa-mejorada.html'), improvedHtml);

  await generateFinalPDF(improvedHtml, OUTPUT_PDF);
  
  console.log('🎉 ¡Proceso completado!');
}

main().catch(error => {
  console.error('❌ Ocurrió un error fatal en el script:', error);
  process.exit(1);
});
