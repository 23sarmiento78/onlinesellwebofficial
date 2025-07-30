// scripts/generate-styled-ebooks.js
// Genera ebooks con estilos modulares del proyecto

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// Configuración
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EBOOKS_DIR = path.resolve(__dirname, '../ebooks');
const CSS_DIR = path.resolve(__dirname, '../public/css');
const SITE_URL = process.env.SITE_URL || 'https://hgaruna.org';

/**
 * Carga todos los estilos CSS del proyecto
 */
async function loadProjectStyles() {
  console.log('🎨 Cargando estilos modulares del proyecto...');
  
  const styles = {
    base: '',
    components: {},
    darkTheme: '',
    utilities: {}
  };
  
  try {
    // Cargar estilos base
    styles.base = await fs.readFile(path.join(CSS_DIR, 'base.css'), 'utf8');
    console.log('✅ Estilos base cargados');
    
    // Cargar tema oscuro
    styles.darkTheme = await fs.readFile(path.join(CSS_DIR, 'dark-theme.css'), 'utf8');
    console.log('✅ Tema oscuro cargado');
    
    // Cargar componentes
    const componentsDir = path.join(CSS_DIR, 'components');
    const componentFiles = await fs.readdir(componentsDir);
    
    for (const file of componentFiles) {
      if (file.endsWith('.css')) {
        const componentName = file.replace('.css', '');
        const componentPath = path.join(componentsDir, file);
        styles.components[componentName] = await fs.readFile(componentPath, 'utf8');
        console.log(`✅ Componente ${componentName} cargado`);
      }
    }
    
    // Cargar utilidades
    const utilitiesDir = path.join(CSS_DIR, 'utilities');
    try {
      const utilityFiles = await fs.readdir(utilitiesDir);
      for (const file of utilityFiles) {
        if (file.endsWith('.css')) {
          const utilityName = file.replace('.css', '');
          const utilityPath = path.join(utilitiesDir, file);
          styles.utilities[utilityName] = await fs.readFile(utilityPath, 'utf8');
          console.log(`✅ Utilidad ${utilityName} cargada`);
        }
      }
    } catch (error) {
      console.log('⚠️ Directorio de utilidades no encontrado, continuando...');
    }
    
    return styles;
  } catch (error) {
    console.error('❌ Error cargando estilos:', error.message);
    throw error;
  }
}

/**
 * Combina todos los estilos en un solo CSS
 */
function combineStyles(styles) {
  console.log('🔗 Combinando estilos modulares...');
  
  let combinedCSS = `
/* ===== EBOOK STYLES - BASADO EN ESTILOS MODULARES DEL PROYECTO ===== */
/* Generado automáticamente desde los estilos del proyecto */

/* Estilos base del proyecto */
${styles.base}

/* Tema oscuro del proyecto */
${styles.darkTheme}

/* Componentes modulares */
`;

  // Agregar componentes
  Object.entries(styles.components).forEach(([name, css]) => {
    combinedCSS += `\n/* Componente: ${name} */\n${css}\n`;
  });
  
  // Agregar utilidades
  Object.entries(styles.utilities).forEach(([name, css]) => {
    combinedCSS += `\n/* Utilidad: ${name} */\n${css}\n`;
  });
  
  // Agregar estilos específicos para ebooks
  combinedCSS += `

/* ===== ESTILOS ESPECÍFICOS PARA EBOOKS ===== */

/* Configuración de página para PDF */
@page {
  size: A4;
  margin: 2cm;
}

/* Contenedor principal del ebook */
.ebook-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--white);
  color: var(--gray-900);
  font-family: var(--font-sans);
  line-height: 1.6;
}

.dark-theme .ebook-container {
  background: var(--dark-bg);
  color: var(--dark-fg);
}

/* Header del ebook */
.ebook-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
  color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.ebook-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ebook-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.ebook-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Resumen ejecutivo */
.executive-summary {
  background: var(--gray-50);
  border-left: 4px solid var(--primary);
  padding: 2rem;
  margin: 2rem 0;
  border-radius: var(--radius);
}

.dark-theme .executive-summary {
  background: var(--gray-800);
  border-left-color: var(--accent-color);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius);
  text-align: center;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
}

.dark-theme .stat-card {
  background: var(--gray-700);
  border-color: var(--gray-600);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-top: 0.5rem;
}

.dark-theme .stat-label {
  color: var(--gray-400);
}

/* Índice interactivo */
.interactive-toc {
  background: var(--gray-50);
  padding: 2rem;
  margin: 2rem 0;
  border-radius: var(--radius-lg);
}

.dark-theme .interactive-toc {
  background: var(--gray-800);
}

.toc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.toc-item {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  border: 1px solid var(--gray-200);
}

.dark-theme .toc-item {
  background: var(--gray-700);
  border-color: var(--gray-600);
}

.toc-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary);
}

.toc-link {
  display: flex;
  text-decoration: none;
  color: inherit;
  padding: 1.5rem;
}

.toc-number {
  background: var(--primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.toc-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--gray-900);
  font-size: 1.1rem;
}

.dark-theme .toc-content h4 {
  color: var(--white);
}

.toc-content p {
  margin: 0 0 0.5rem 0;
  color: var(--gray-600);
  font-size: 0.9rem;
  line-height: 1.4;
}

.dark-theme .toc-content p {
  color: var(--gray-400);
}

.toc-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--gray-500);
}

.dark-theme .toc-meta {
  color: var(--gray-500);
}

/* Artículos */
.article {
  margin: 3rem 0;
  page-break-inside: avoid;
  background: white;
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
}

.dark-theme .article {
  background: var(--gray-700);
  border-color: var(--gray-600);
}

.article h1 {
  font-size: 2rem;
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

.article h2 {
  font-size: 1.5rem;
  color: var(--gray-800);
  margin-top: 2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 1.5rem;
}

.dark-theme .article h2 {
  color: var(--white);
}

.article h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: var(--primary);
  border-radius: 2px;
}

.article h3 {
  font-size: 1.25rem;
  color: var(--gray-700);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.dark-theme .article h3 {
  color: var(--gray-300);
}

.article p {
  margin-bottom: 1.5rem;
  color: var(--gray-600);
  line-height: 1.7;
}

.dark-theme .article p {
  color: var(--gray-300);
}

.article ul, .article ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

.article li {
  margin-bottom: 0.5rem;
  color: var(--gray-600);
}

.dark-theme .article li {
  color: var(--gray-300);
}

.article blockquote {
  border-left: 4px solid var(--primary);
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  background: var(--gray-50);
  border-radius: 0 var(--radius) var(--radius) 0;
  font-style: italic;
  color: var(--gray-700);
}

.dark-theme .article blockquote {
  background: var(--gray-800);
  color: var(--gray-300);
}

.article pre {
  background: var(--gray-900);
  color: var(--gray-100);
  padding: 1.5rem;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--gray-700);
  position: relative;
}

.article code {
  background: var(--gray-100);
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  color: var(--primary);
  font-size: 0.9em;
}

.dark-theme .article code {
  background: var(--gray-800);
  color: var(--accent-color);
}

.article pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.article img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  margin: 1.5rem 0;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
}

.dark-theme .article img {
  border-color: var(--gray-600);
}

/* Footer del ebook */
.ebook-footer {
  margin-top: 4rem;
  padding: 2rem;
  border-top: 2px solid var(--gray-200);
  background: var(--gray-50);
  border-radius: var(--radius);
  text-align: center;
}

.dark-theme .ebook-footer {
  border-color: var(--gray-600);
  background: var(--gray-800);
}

.ebook-footer h3 {
  color: var(--primary);
  margin-bottom: 1rem;
}

.ebook-footer p {
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.dark-theme .ebook-footer p {
  color: var(--gray-400);
}

.ebook-footer a {
  color: var(--primary);
  text-decoration: none;
}

.ebook-footer a:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .ebook-container {
    padding: 1rem;
  }
  
  .ebook-title {
    font-size: 2rem;
  }
  
  .ebook-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .toc-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .article {
    padding: 1.5rem;
  }
}

/* Print styles */
@media print {
  .ebook-container {
    max-width: none;
    padding: 0;
  }
  
  .ebook-header {
    page-break-after: always;
  }
  
  .article {
    page-break-inside: avoid;
  }
  
  .toc-item:hover {
    transform: none;
  }
}
`;

  return combinedCSS;
}

/**
 * Crea el HTML del ebook con estilos modulares
 */
function createStyledEbookHTML(category, articles, combinedCSS) {
  const now = new Date();
  const ebookTitle = `Guía Avanzada de ${category} - ${now.getFullYear()}`;
  const totalWords = articles.reduce((sum, article) => sum + (article.wordCount || 0), 0);
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ebookTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <style>
${combinedCSS}
    </style>
</head>
<body class="dark-theme">
    <div class="ebook-container">
        <header class="ebook-header">
            <h1 class="ebook-title">${ebookTitle}</h1>
            <p class="ebook-subtitle">Una guía completa y avanzada para desarrolladores web</p>
            <div class="ebook-meta">
                <span>📅 Generado el ${now.toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</span>
                <span>📄 ${articles.length} artículos</span>
                <span>📝 ${totalWords.toLocaleString()} palabras</span>
            </div>
        </header>
        
        ${generateExecutiveSummary(category, articles)}
        
        ${generateInteractiveTOC(articles)}
        
        ${articles.map((article, index) => `
            <article class="article" id="article-${index}">
                <h1>${article.meta.title}</h1>
                <div class="article-meta">
                    <p><strong>Autor:</strong> ${article.meta.author} | <strong>Fecha:</strong> ${article.meta.date} | <strong>Tiempo de lectura:</strong> ${article.meta.readingTime}</p>
                </div>
                ${article.content}
            </article>
        `).join('')}
        
        <footer class="ebook-footer">
            <h3>¿Te gustó esta guía?</h3>
            <p>Este ebook es parte de una colección completa de recursos técnicos.</p>
            <p>Visita <a href="${SITE_URL}">${SITE_URL}</a> para más contenido técnico y actualizaciones.</p>
            <p>© ${now.getFullYear()} hgaruna - Todos los derechos reservados</p>
        </footer>
    </div>
</body>
</html>`;
}

/**
 * Genera un resumen ejecutivo con estilos modulares
 */
function generateExecutiveSummary(category, articles) {
  const totalArticles = articles.length;
  const totalWords = articles.reduce((sum, article) => sum + (article.wordCount || 0), 0);
  const avgWordsPerArticle = Math.round(totalWords / totalArticles);
  
  return `
    <div class="executive-summary">
      <h2>Resumen Ejecutivo</h2>
      <p>Esta guía completa de <strong>${category}</strong> reúne ${totalArticles} artículos técnicos especializados, 
      con un total de ${totalWords.toLocaleString()} palabras de contenido de alta calidad.</p>
      
      <div class="summary-stats">
        <div class="stat-card">
          <span class="stat-number">${totalArticles}</span>
          <span class="stat-label">Artículos</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${totalWords.toLocaleString()}</span>
          <span class="stat-label">Palabras</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">${avgWordsPerArticle}</span>
          <span class="stat-label">Promedio por artículo</span>
        </div>
      </div>
      
      <h3>Temas Cubiertos</h3>
      <ul>
        ${articles.map(article => `<li>${article.meta.title}</li>`).join('')}
      </ul>
      
      <h3>¿Para Quién es Esta Guía?</h3>
      <p>Esta guía está diseñada para:</p>
      <ul>
        <li><strong>Desarrolladores web</strong> que buscan profundizar en ${category.toLowerCase()}</li>
        <li><strong>Arquitectos de software</strong> que necesitan tomar decisiones técnicas</li>
        <li><strong>Tech leads</strong> que quieren mantenerse actualizados</li>
        <li><strong>Estudiantes</strong> de desarrollo web y programación</li>
      </ul>
    </div>
  `;
}

/**
 * Genera un índice interactivo con estilos modulares
 */
function generateInteractiveTOC(articles) {
  return `
    <div class="interactive-toc">
      <h2>Índice Interactivo</h2>
      <div class="toc-grid">
        ${articles.map((article, index) => `
          <div class="toc-item">
            <a href="#article-${index}" class="toc-link">
              <div class="toc-number">${index + 1}</div>
              <div class="toc-content">
                <h4>${article.meta.title}</h4>
                <p>${article.meta.description.substring(0, 100)}...</p>
                <div class="toc-meta">
                  <span class="reading-time">${article.meta.readingTime}</span>
                  <span class="word-count">${article.wordCount} palabras</span>
                </div>
              </div>
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Extrae el contenido de un artículo HTML
 */
async function extractArticleContent(htmlPath) {
  try {
    const html = await fs.readFile(htmlPath, 'utf8');
    const $ = cheerio.load(html);
    
    const title = $('.article-title').text().trim();
    const content = $('.article-content').html();
    
    const meta = {
      title: title,
      description: $('meta[name="description"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || 'hgaruna',
      date: $('.article-meta span').first().text().trim(),
      readingTime: $('.article-meta span').eq(1).text().trim(),
      category: $('meta[name="category"]').attr('content') || 'General'
    };
    
    return { meta, content };
  } catch (error) {
    console.error(`Error extrayendo contenido de ${htmlPath}:`, error.message);
    return null;
  }
}

/**
 * Genera un PDF con estilos modulares
 */
async function generateStyledPDF(htmlContent, outputPath) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
    });
    
    await browser.close();
    console.log(`✅ PDF con estilos modulares generado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generando PDF con estilos modulares:`, error.message);
  }
}

/**
 * Función principal para generar ebooks con estilos modulares
 */
async function generateStyledEbooks() {
  console.log('🎨 Iniciando generación de ebooks con estilos modulares...');
  
  try {
    // Cargar estilos del proyecto
    const projectStyles = await loadProjectStyles();
    const combinedCSS = combineStyles(projectStyles);
    
    // Crear directorio de ebooks
    await fs.mkdir(EBOOKS_DIR, { recursive: true });
    
    // Obtener todos los archivos HTML
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    
    console.log(`📄 Encontrados ${articleFiles.length} artículos`);
    
    // Procesar cada categoría
    const categories = [
      'Frontend', 'Backend', 'Bases de Datos', 'DevOps y Cloud',
      'Testing y Calidad', 'Inteligencia Artificial', 'Seguridad'
    ];
    
    for (const category of categories) {
      console.log(`\n📚 Procesando categoría: ${category}`);
      
      const categoryArticles = [];
      
      // Buscar artículos por categoría usando metadatos
      for (const file of articleFiles) {
        const articlePath = path.join(BLOG_DIR, file);
        const articleContent = await extractArticleContent(articlePath);
        
        if (articleContent && articleContent.meta.category === category) {
          const wordCount = articleContent.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
          categoryArticles.push({
            ...articleContent,
            wordCount
          });
          console.log(`  ✅ ${articleContent.meta.title}`);
        }
      }
      
      if (categoryArticles.length > 0) {
        console.log(`  📖 ${categoryArticles.length} artículos encontrados para ${category}`);
        
        // Crear HTML del ebook con estilos modulares
        const ebookHTML = createStyledEbookHTML(category, categoryArticles, combinedCSS);
        const htmlPath = path.join(EBOOKS_DIR, `guia-estilizada-${category.toLowerCase().replace(/\s+/g, '-')}.html`);
        await fs.writeFile(htmlPath, ebookHTML);
        
        // Generar PDF con estilos modulares
        const pdfPath = path.join(EBOOKS_DIR, `guia-estilizada-${category.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        await generateStyledPDF(ebookHTML, pdfPath);
        
        console.log(`  📚 Ebook con estilos modulares generado: ${category} (${categoryArticles.length} artículos)`);
      } else {
        console.log(`  ⚠️ No se encontraron artículos para ${category}`);
      }
    }
    
    console.log('\n🎉 Generación de ebooks con estilos modulares completada!');
    console.log(`📁 Los ebooks se encuentran en: ${EBOOKS_DIR}`);
    
  } catch (error) {
    console.error('❌ Error durante la generación de ebooks con estilos modulares:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateStyledEbooks();
}

module.exports = { generateStyledEbooks }; 