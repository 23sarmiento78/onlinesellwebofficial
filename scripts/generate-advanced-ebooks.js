// scripts/generate-advanced-ebooks.js
// Genera ebooks avanzados con características profesionales

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// Configuración
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EBOOKS_DIR = path.resolve(__dirname, '../ebooks');
const SITE_URL = process.env.SITE_URL || 'https://hgaruna.org';

/**
 * Genera un resumen ejecutivo para una categoría
 */
function generateExecutiveSummary(category, articles) {
  const totalArticles = articles.length;
  const totalWords = articles.reduce((sum, article) => sum + (article.wordCount || 0), 0);
  const avgWordsPerArticle = Math.round(totalWords / totalArticles);
  
  const topics = articles.map(article => article.meta.title).join(', ');
  
  return `
    <div class="executive-summary">
      <h2>Resumen Ejecutivo</h2>
      <p>Esta guía completa de <strong>${category}</strong> reúne ${totalArticles} artículos técnicos especializados, 
      con un total de ${totalWords.toLocaleString()} palabras de contenido de alta calidad.</p>
      
      <div class="summary-stats">
        <div class="stat">
          <span class="stat-number">${totalArticles}</span>
          <span class="stat-label">Artículos</span>
        </div>
        <div class="stat">
          <span class="stat-number">${totalWords.toLocaleString()}</span>
          <span class="stat-label">Palabras</span>
        </div>
        <div class="stat">
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
 * Genera un índice interactivo con enlaces
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
 * Crea el HTML avanzado para un ebook
 */
function createAdvancedEbookHTML(category, articles) {
  const now = new Date();
  const ebookTitle = `Guía Avanzada de ${category} - ${now.getFullYear()}`;
  const totalWords = articles.reduce((sum, article) => sum + (article.wordCount || 0), 0);
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ebookTitle}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .ebook-header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            border-radius: 10px;
        }
        
        .ebook-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #10b981;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .ebook-subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 20px;
        }
        
        .ebook-meta {
            font-size: 0.9rem;
            color: #888;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .executive-summary {
            margin: 40px 0;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #10b981;
        }
        
        .summary-stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .stat {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-width: 120px;
        }
        
        .stat-number {
            display: block;
            font-size: 2rem;
            font-weight: bold;
            color: #10b981;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #666;
        }
        
        .interactive-toc {
            margin: 40px 0;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .toc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .toc-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s ease;
        }
        
        .toc-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .toc-link {
            display: flex;
            text-decoration: none;
            color: inherit;
            padding: 20px;
        }
        
        .toc-number {
            background: #10b981;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }
        
        .toc-content h4 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 1.1rem;
        }
        
        .toc-content p {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .toc-meta {
            display: flex;
            gap: 15px;
            font-size: 0.8rem;
            color: #888;
        }
        
        .article {
            margin: 40px 0;
            page-break-inside: avoid;
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .article h1 {
            font-size: 2rem;
            color: #10b981;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .article h2 {
            font-size: 1.5rem;
            color: #333;
            margin-top: 30px;
            margin-bottom: 15px;
            position: relative;
            padding-left: 20px;
        }
        
        .article h2::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: #10b981;
            border-radius: 2px;
        }
        
        .article h3 {
            font-size: 1.2rem;
            color: #555;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        
        .article p {
            margin-bottom: 15px;
            text-align: justify;
        }
        
        .article ul, .article ol {
            margin-bottom: 15px;
            padding-left: 20px;
        }
        
        .article li {
            margin-bottom: 5px;
        }
        
        .article blockquote {
            border-left: 4px solid #10b981;
            padding: 15px 20px;
            margin: 20px 0;
            background: #f8f9fa;
            font-style: italic;
            border-radius: 0 5px 5px 0;
        }
        
        .article pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
            border: 1px solid #334155;
            position: relative;
        }
        
        .article code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            color: #dc2626;
        }
        
        .article pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        
        .article img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 15px 0;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .footer {
            margin-top: 40px;
            padding: 30px;
            border-top: 2px solid #e9ecef;
            text-align: center;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .footer h3 {
            color: #10b981;
            margin-bottom: 15px;
        }
        
        .footer p {
            color: #666;
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #10b981;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        @media print {
            .toc-item:hover {
                transform: none;
            }
        }
    </style>
</head>
<body>
    <div class="ebook-header">
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
    </div>
    
    ${generateExecutiveSummary(category, articles)}
    
    ${generateInteractiveTOC(articles)}
    
    ${articles.map((article, index) => `
        <div class="article ${index > 0 ? 'page-break' : ''}" id="article-${index}">
            <h1>${article.meta.title}</h1>
            <div class="article-meta">
                <p><strong>Autor:</strong> ${article.meta.author} | <strong>Fecha:</strong> ${article.meta.date} | <strong>Tiempo de lectura:</strong> ${article.meta.readingTime}</p>
            </div>
            ${article.content}
        </div>
    `).join('')}
    
    <div class="footer">
        <h3>¿Te gustó esta guía?</h3>
        <p>Este ebook es parte de una colección completa de recursos técnicos.</p>
        <p>Visita <a href="${SITE_URL}">${SITE_URL}</a> para más contenido técnico y actualizaciones.</p>
        <p>© ${now.getFullYear()} hgaruna - Todos los derechos reservados</p>
    </div>
</body>
</html>`;
}

/**
 * Función principal para generar ebooks avanzados
 */
async function generateAdvancedEbooks() {
  console.log('🚀 Iniciando generación de ebooks avanzados...');
  
  try {
    // Crear directorio de ebooks
    await fs.mkdir(EBOOKS_DIR, { recursive: true });
    
    // Obtener todos los archivos HTML
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    
    console.log(`📄 Encontrados ${articleFiles.length} artículos`);
    
    // Procesar cada categoría
    const categories = [
      'Frontend',
      'Backend', 
      'Bases de Datos',
      'DevOps y Cloud',
      'Testing y Calidad',
      'Inteligencia Artificial',
      'Seguridad'
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
        
        // Crear HTML del ebook avanzado
        const ebookHTML = createAdvancedEbookHTML(category, categoryArticles);
        const htmlPath = path.join(EBOOKS_DIR, `guia-avanzada-${category.toLowerCase().replace(/\s+/g, '-')}.html`);
        await fs.writeFile(htmlPath, ebookHTML);
        
        // Generar PDF
        const pdfPath = path.join(EBOOKS_DIR, `guia-avanzada-${category.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        await generatePDF(ebookHTML, pdfPath);
        
        console.log(`  📚 Ebook avanzado generado: ${category} (${categoryArticles.length} artículos)`);
      } else {
        console.log(`  ⚠️ No se encontraron artículos para ${category}`);
      }
    }
    
    console.log('\n🎉 Generación de ebooks avanzados completada!');
    console.log(`📁 Los ebooks se encuentran en: ${EBOOKS_DIR}`);
    
  } catch (error) {
    console.error('❌ Error durante la generación de ebooks avanzados:', error.message);
    process.exit(1);
  }
}

// Funciones auxiliares (reutilizadas del script anterior)
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

async function generatePDF(htmlContent, outputPath) {
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
    console.log(`✅ PDF generado: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generando PDF:`, error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateAdvancedEbooks();
}

module.exports = { generateAdvancedEbooks }; 