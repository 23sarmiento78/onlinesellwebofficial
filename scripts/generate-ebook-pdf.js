const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const markdownIt = require('markdown-it');

// Configurar markdown parser con plugins útiles
const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
}).use(require('markdown-it-highlightjs'))
  .use(require('markdown-it-anchor'))
  .use(require('markdown-it-toc-done-right'));

const CSS_STYLES = `
/* eBook PDF Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --primary-color: #64ffda;
  --secondary-color: #26a69a;
  --accent-color: #ff6b35;
  --text-color: #333333;
  --text-light: #666666;
  --background: #ffffff;
  --surface: #f8f9fa;
  --border: #e0e0e0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.7;
  color: var(--text-color);
  background: var(--background);
  font-size: 16px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: var(--text-color);
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  page-break-after: avoid;
}

h2 {
  font-size: 2rem;
  margin: 2rem 0 1rem 0;
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 0.5rem;
  page-break-after: avoid;
}

h3 {
  font-size: 1.5rem;
  margin: 1.5rem 0 0.8rem 0;
  color: var(--secondary-color);
  page-break-after: avoid;
}

h4 {
  font-size: 1.25rem;
  margin: 1.2rem 0 0.6rem 0;
  page-break-after: avoid;
}

h5 {
  font-size: 1.1rem;
  margin: 1rem 0 0.5rem 0;
  page-break-after: avoid;
}

p {
  margin-bottom: 1rem;
  text-align: justify;
  hyphens: auto;
  orphans: 3;
  widows: 3;
}

/* Lists */
ul, ol {
  margin: 1rem 0;
  padding-left: 2rem;
}

li {
  margin-bottom: 0.5rem;
  orphans: 2;
  widows: 2;
}

/* Code */
code {
  font-family: 'JetBrains Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  background: var(--surface);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid var(--border);
}

pre {
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
  font-family: 'JetBrains Mono', Monaco, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  border-left: 4px solid var(--primary-color);
  page-break-inside: avoid;
}

pre code {
  background: none;
  padding: 0;
  border: none;
  color: inherit;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid var(--accent-color);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background: var(--surface);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  page-break-inside: avoid;
}

blockquote p {
  margin-bottom: 0.5rem;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  page-break-inside: avoid;
}

th, td {
  border: 1px solid var(--border);
  padding: 0.75rem;
  text-align: left;
}

th {
  background: var(--surface);
  font-weight: 600;
  color: var(--text-color);
}

/* Links */
a {
  color: var(--secondary-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease;
}

a:hover {
  border-bottom-color: var(--secondary-color);
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  page-break-inside: avoid;
}

/* Page Layout */
@page {
  size: A4;
  margin: 2cm;
  @bottom-center {
    content: counter(page);
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    color: var(--text-light);
  }
}

/* Cover Page */
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  page-break-after: always;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
}

.cover h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  -webkit-text-fill-color: white;
  background: none;
}

.cover .subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cover .author {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.cover .date {
  font-size: 1rem;
  opacity: 0.8;
}

.cover .logo {
  width: 100px;
  height: 100px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 2rem auto;
  color: var(--primary-color);
}

/* Table of Contents */
.toc {
  page-break-before: always;
  page-break-after: always;
}

.toc h2 {
  border-bottom: none;
  margin-bottom: 2rem;
}

.toc ul {
  list-style: none;
  padding: 0;
}

.toc li {
  padding: 0.5rem 0;
  border-bottom: 1px dotted var(--border);
  display: flex;
  justify-content: space-between;
}

.toc a {
  border: none;
  color: var(--text-color);
}

/* Chapter Headers */
.chapter {
  page-break-before: always;
  margin-top: 0;
}

.chapter-number {
  font-size: 1rem;
  color: var(--text-light);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* Special Elements */
.highlight-box {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  page-break-inside: avoid;
}

.highlight-box h3 {
  color: white;
  margin-top: 0;
}

.tip, .warning, .info {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  page-break-inside: avoid;
}

.tip {
  background: #e8f5e8;
  border-left: 4px solid #4caf50;
}

.warning {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
}

.info {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
}

/* Footer */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1cm;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-light);
}

/* Print specific */
@media print {
  body {
    font-size: 12pt;
    line-height: 1.6;
  }
  
  h1 { font-size: 24pt; }
  h2 { font-size: 20pt; }
  h3 { font-size: 16pt; }
  h4 { font-size: 14pt; }
  
  .no-print {
    display: none !important;
  }
}

/* Syntax highlighting for code blocks */
.hljs {
  background: #1a1a1a !important;
  color: #e0e0e0 !important;
}

.hljs-keyword { color: #ff6b35; }
.hljs-string { color: #a8e6cf; }
.hljs-number { color: #ffd93d; }
.hljs-comment { color: #666; }
.hljs-function { color: #64ffda; }
.hljs-variable { color: #26a69a; }
`;

async function generateEbookPDF() {
  try {
    console.log('🚀 Iniciando generación de PDF del eBook...');
    
    // Buscar el eBook más reciente
    const ebooksDir = path.join(process.cwd(), 'public', 'ebooks');
    const dirs = await fs.readdir(ebooksDir);
    const ebookDirs = dirs.filter(dir => dir.includes('-')).sort().reverse();
    
    if (ebookDirs.length === 0) {
      throw new Error('No se encontraron eBooks para generar PDF');
    }
    
    const latestEbookDir = path.join(ebooksDir, ebookDirs[0]);
    const markdownFile = path.join(latestEbookDir, 'ebook-completo.md');
    const metadataFile = path.join(latestEbookDir, 'metadata.json');
    
    // Leer archivos
    const markdownContent = await fs.readFile(markdownFile, 'utf8');
    const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
    
    console.log(`📖 Procesando: ${metadata.title}`);
    
    // Convertir markdown a HTML
    const htmlContent = md.render(markdownContent);
    
    // Crear HTML completo con estilos
    const fullHTML = createFullHTML(htmlContent, metadata);
    
    // Configurar Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar el contenido
    await page.setContent(fullHTML, {
      waitUntil: 'networkidle0'
    });
    
    // Generar PDF
    const pdfPath = path.join(latestEbookDir, 'ebook-completo.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 12px; color: #666; text-align: center; width: 100%;">
          <span class="pageNumber"></span> | ${metadata.title} | hgaruna.com
        </div>
      `
    });
    
    await browser.close();
    
    // Generar también versión gratuita
    await generateFreePDF(latestEbookDir, metadata);
    
    // Actualizar metadata con rutas de PDF
    metadata.paths.fullPdf = pdfPath;
    metadata.paths.freePdf = path.join(latestEbookDir, 'ebook-gratis.pdf');
    
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
    
    console.log('✅ PDF generado exitosamente!');
    console.log(`📁 Archivo: ${pdfPath}`);
    
    return pdfPath;
    
  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    throw error;
  }
}

function createFullHTML(content, metadata) {
  const coverPage = `
    <div class="cover">
      <div class="logo">📚</div>
      <h1>${metadata.title}</h1>
      <div class="subtitle">${metadata.description}</div>
      <div class="author">Por ${metadata.author}</div>
      <div class="date">${new Date(metadata.generatedAt).toLocaleDateString('es-ES')}</div>
    </div>
  `;
  
  // Agregar números de capítulo
  const processedContent = content.replace(
    /<h1>Capítulo (\d+): (.+?)<\/h1>/g,
    '<div class="chapter"><div class="chapter-number">Capítulo $1</div><h1>$2</h1></div>'
  );
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${metadata.title}</title>
      <style>${CSS_STYLES}</style>
    </head>
    <body>
      ${coverPage}
      <div class="content">
        ${processedContent}
      </div>
    </body>
    </html>
  `;
}

async function generateFreePDF(ebookDir, metadata) {
  try {
    const freeMarkdownFile = path.join(ebookDir, 'ebook-gratis.md');
    const freeMarkdownContent = await fs.readFile(freeMarkdownFile, 'utf8');
    
    const freeHtmlContent = md.render(freeMarkdownContent);
    const fullHTML = createFullHTML(freeHtmlContent, {
      ...metadata,
      title: metadata.title + ' - Muestra Gratuita'
    });
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(fullHTML, { waitUntil: 'networkidle0' });
    
    const freePdfPath = path.join(ebookDir, 'ebook-gratis.pdf');
    await page.pdf({
      path: freePdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size: 12px; color: #666; text-align: center; width: 100%;">
          <span class="pageNumber"></span> | ${metadata.title} - Muestra Gratuita | hgaruna.com
        </div>
      `
    });
    
    await browser.close();
    
    console.log('✅ PDF gratuito generado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error generando PDF gratuito:', error);
  }
}

// Script para actualizar metadata de eBooks
async function updateEbookMetadata() {
  try {
    const ebooksDir = path.join(process.cwd(), 'public', 'ebooks');
    const indexPath = path.join(ebooksDir, 'index.json');
    
    let index = { ebooks: [] };
    try {
      const indexContent = await fs.readFile(indexPath, 'utf8');
      index = JSON.parse(indexContent);
    } catch (error) {
      // Archivo no existe, se creará uno nuevo
    }
    
    // Buscar todos los eBooks
    const dirs = await fs.readdir(ebooksDir);
    const ebookDirs = dirs.filter(dir => dir.includes('-'));
    
    for (const dirName of ebookDirs) {
      const metadataPath = path.join(ebooksDir, dirName, 'metadata.json');
      
      try {
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        
        // Verificar si ya existe en el índice
        const existingIndex = index.ebooks.findIndex(book => 
          book.paths.directory === metadata.paths.directory.replace(process.cwd() + '/public', '')
        );
        
        const bookData = {
          id: Date.now() + Math.random(),
          title: metadata.title,
          description: metadata.description,
          topic: metadata.topic,
          chapters: metadata.chapters,
          generatedAt: metadata.generatedAt,
          version: metadata.version,
          stats: metadata.stats,
          featured: existingIndex === -1, // Nuevo eBook es featured
          paths: {
            free: metadata.paths.free.replace(process.cwd() + '/public', ''),
            full: metadata.paths.full.replace(process.cwd() + '/public', ''),
            directory: metadata.paths.directory.replace(process.cwd() + '/public', ''),
            freePdf: metadata.paths.freePdf ? metadata.paths.freePdf.replace(process.cwd() + '/public', '') : null,
            fullPdf: metadata.paths.fullPdf ? metadata.paths.fullPdf.replace(process.cwd() + '/public', '') : null
          }
        };
        
        if (existingIndex !== -1) {
          index.ebooks[existingIndex] = bookData;
        } else {
          index.ebooks.unshift(bookData);
        }
        
      } catch (error) {
        console.warn(`⚠️ No se pudo leer metadata para ${dirName}:`, error.message);
      }
    }
    
    // Actualizar metadata del índice
    index.lastUpdated = new Date().toISOString();
    index.totalEbooks = index.ebooks.length;
    
    // Mantener solo featured los 3 más recientes
    index.ebooks.forEach((book, i) => {
      book.featured = i < 3;
    });
    
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
    
    console.log('📇 Índice de eBooks actualizado');
    console.log(`📊 Total de eBooks: ${index.totalEbooks}`);
    
  } catch (error) {
    console.error('❌ Error actualizando metadata:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  generateEbookPDF()
    .then(() => updateEbookMetadata())
    .then(() => console.log('🎉 Proceso completado exitosamente!'))
    .catch(console.error);
}

module.exports = { generateEbookPDF, updateEbookMetadata };
