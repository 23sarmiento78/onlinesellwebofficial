// scripts/generate-ebooks.js
// Genera ebooks a partir de los artículos HTML existentes

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

// Configuración
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EBOOKS_DIR = path.resolve(__dirname, '../ebooks');
const SITE_URL = process.env.SITE_URL || 'https://hgaruna.org';

// Categorías y sus temas
const categoriesToTopics = {
  'Frontend': [
    'React 19: Nuevas características y mejoras',
    'Vue.js 4: El futuro del framework progresivo',
    'Svelte vs React: Comparativa completa',
    'Angular 18: Nuevas funcionalidades',
    'TypeScript avanzado: Patrones y mejores prácticas',
    'CSS Grid y Flexbox: Layouts modernos',
    'Web Components: El futuro del desarrollo web',
    'Progressive Web Apps (PWA) en 2025',
    'WebAssembly: Rendimiento nativo en el navegador',
    'Micro-frontends: Arquitectura escalable'
  ],
  'Backend': [
    'Node.js 22: Nuevas características',
    'Deno vs Node.js: ¿Cuál elegir?',
    'Bun: El runtime JavaScript más rápido',
    'GraphQL vs REST: Cuándo usar cada uno',
    'APIs RESTful: Diseño y mejores prácticas',
    'Autenticación JWT: Implementación segura',
    'OAuth 2.0 y OpenID Connect',
    'Rate limiting: Protección de APIs',
    'API versioning: Estrategias efectivas',
    'WebSockets vs Server-Sent Events'
  ],
  'Bases de Datos': [
    'PostgreSQL 16: Nuevas funcionalidades',
    'MongoDB 8: Mejoras y optimizaciones',
    'Redis: Caché y almacenamiento en memoria',
    'SQL vs NoSQL: Decisiones de arquitectura',
    'ORM vs Query Builder: Ventajas y desventajas',
    'Migrations: Gestión de esquemas de BD',
    'Índices de base de datos: Optimización',
    'Transacciones distribuidas',
    'Backup y recuperación de datos',
    'Sharding y particionamiento'
  ],
  'DevOps y Cloud': [
    'Docker: Contenedores para desarrolladores',
    'Kubernetes: Orquestación de contenedores',
    'CI/CD: Automatización de despliegues',
    'GitHub Actions: Workflows avanzados',
    'AWS Lambda: Serverless computing',
    'Azure Functions: Desarrollo serverless',
    'Google Cloud Functions: Plataforma serverless',
    'Terraform: Infrastructure as Code',
    'Ansible: Automatización de configuración',
    'Monitoring y observabilidad'
  ],
  'Testing y Calidad': [
    'Testing unitario: Jest y Vitest',
    'Testing de integración: Estrategias',
    'Testing E2E: Cypress y Playwright',
    'Testing de APIs: Postman y Newman',
    'Code coverage: Métricas de calidad',
    'Static analysis: ESLint y SonarQube',
    'Performance testing: Lighthouse y WebPageTest',
    'Security testing: OWASP y herramientas',
    'Accessibility testing: WCAG guidelines',
    'Testing de accesibilidad automatizado'
  ],
  'Inteligencia Artificial': [
    'Machine Learning para desarrolladores web',
    'APIs de IA: OpenAI, Claude, Gemini',
    'Chatbots: Implementación práctica',
    'Computer Vision en aplicaciones web',
    'NLP: Procesamiento de lenguaje natural',
    'Recomendation systems: Algoritmos',
    'AI-powered testing: Automatización inteligente',
    'Ethical AI: Principios y prácticas',
    'AI explainability: Transparencia en ML',
    'Edge AI: IA en dispositivos móviles'
  ],
  'Seguridad': [
    'OWASP Top 10: Vulnerabilidades web',
    'XSS Prevention: Cross-site scripting',
    'CSRF Protection: Cross-site request forgery',
    'SQL Injection: Prevención y detección',
    'Authentication: Múltiples factores',
    'Authorization: Control de acceso',
    'HTTPS: Certificados SSL/TLS',
    'Content Security Policy (CSP)',
    'Security headers: Protección adicional',
    'Penetration testing: Evaluación de seguridad'
  ]
};

/**
 * Extrae el contenido de un artículo HTML
 */
async function extractArticleContent(htmlPath) {
  try {
    const html = await fs.readFile(htmlPath, 'utf8');
    const $ = cheerio.load(html);
    
    // Extraer título
    const title = $('.article-title').text().trim();
    
    // Extraer contenido del artículo
    const content = $('.article-content').html();
    
    // Extraer metadatos
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
 * Crea el HTML para un ebook
 */
function createEbookHTML(category, articles) {
  const now = new Date();
  const ebookTitle = `Guía Completa de ${category} - ${now.getFullYear()}`;
  
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
        }
        
        .ebook-title {
            font-size: 2.5rem;
            font-weight: 800;
            color: #10b981;
            margin-bottom: 10px;
        }
        
        .ebook-subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 20px;
        }
        
        .ebook-meta {
            font-size: 0.9rem;
            color: #888;
        }
        
        .toc {
            margin: 40px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .toc h2 {
            color: #10b981;
            margin-bottom: 20px;
        }
        
        .toc ul {
            list-style: none;
            padding: 0;
        }
        
        .toc li {
            margin: 10px 0;
            padding: 5px 0;
        }
        
        .toc a {
            color: #333;
            text-decoration: none;
            font-weight: 500;
        }
        
        .toc a:hover {
            color: #10b981;
        }
        
        .article {
            margin: 40px 0;
            page-break-inside: avoid;
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
        }
        
        .article pre {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 15px 0;
            border: 1px solid #e9ecef;
        }
        
        .article code {
            background: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Fira Code', monospace;
        }
        
        .article img {
            max-width: 100%;
            height: auto;
            border-radius: 5px;
            margin: 15px 0;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            font-size: 0.9rem;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="ebook-header">
        <h1 class="ebook-title">${ebookTitle}</h1>
        <p class="ebook-subtitle">Una guía completa para desarrolladores web</p>
        <div class="ebook-meta">
            <p>Generado el ${now.toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</p>
            <p>${articles.length} artículos • ${articles.reduce((total, article) => total + (article.wordCount || 0), 0)} palabras</p>
        </div>
    </div>
    
    <div class="toc">
        <h2>Índice</h2>
        <ul>
            ${articles.map((article, index) => `
                <li><a href="#article-${index}">${article.meta.title}</a></li>
            `).join('')}
        </ul>
    </div>
    
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
        <p>© ${now.getFullYear()} hgaruna - Todos los derechos reservados</p>
        <p>Este ebook fue generado automáticamente a partir de artículos técnicos publicados en <a href="${SITE_URL}">${SITE_URL}</a></p>
    </div>
</body>
</html>`;
}

/**
 * Genera un PDF a partir del HTML del ebook
 */
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

/**
 * Función principal para generar ebooks
 */
async function generateEbooks() {
  console.log('🚀 Iniciando generación de ebooks...');
  
  try {
    // Crear directorio de ebooks
    await fs.mkdir(EBOOKS_DIR, { recursive: true });
    
    // Obtener todos los archivos HTML
    const htmlFiles = await fs.readdir(BLOG_DIR);
    const articleFiles = htmlFiles.filter(file => file.endsWith('.html') && file !== 'index.html');
    
    console.log(`📄 Encontrados ${articleFiles.length} artículos`);
    
    // Procesar cada categoría
    for (const [category, topics] of Object.entries(categoriesToTopics)) {
      console.log(`\n📚 Procesando categoría: ${category}`);
      
      const categoryArticles = [];
      
      // Buscar artículos que coincidan con los temas de esta categoría
      for (const topic of topics) {
        const matchingFile = articleFiles.find(file => {
          const fileName = file.replace('.html', '').replace(/-/g, ' ');
          return topic.toLowerCase().includes(fileName) || fileName.includes(topic.toLowerCase());
        });
        
        if (matchingFile) {
          const articlePath = path.join(BLOG_DIR, matchingFile);
          const articleContent = await extractArticleContent(articlePath);
          
          if (articleContent) {
            // Calcular palabras
            const wordCount = articleContent.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
            categoryArticles.push({
              ...articleContent,
              wordCount
            });
            console.log(`  ✅ ${articleContent.meta.title}`);
          }
        }
      }
      
      if (categoryArticles.length > 0) {
        console.log(`  📖 ${categoryArticles.length} artículos encontrados para ${category}`);
        
        // Crear HTML del ebook
        const ebookHTML = createEbookHTML(category, categoryArticles);
        const htmlPath = path.join(EBOOKS_DIR, `${category.toLowerCase().replace(/\s+/g, '-')}.html`);
        await fs.writeFile(htmlPath, ebookHTML);
        
        // Generar PDF
        const pdfPath = path.join(EBOOKS_DIR, `${category.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        await generatePDF(ebookHTML, pdfPath);
        
        console.log(`  📚 Ebook generado: ${category} (${categoryArticles.length} artículos)`);
      } else {
        console.log(`  ⚠️ No se encontraron artículos para ${category}`);
      }
    }
    
    // Generar ebook completo con todos los artículos
    console.log('\n📚 Generando ebook completo...');
    const allArticles = [];
    
    for (const file of articleFiles) {
      const articlePath = path.join(BLOG_DIR, file);
      const articleContent = await extractArticleContent(articlePath);
      
      if (articleContent && articleContent.content) {
        const wordCount = articleContent.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        allArticles.push({
          ...articleContent,
          wordCount
        });
      } else {
        console.log(`  ⚠️ No se pudo procesar el artículo: ${file}`);
      }
    }
    
    if (allArticles.length > 0) {
      const completeEbookHTML = createEbookHTML('Desarrollo Web', allArticles);
      const completeHtmlPath = path.join(EBOOKS_DIR, 'guia-completa-desarrollo-web.html');
      await fs.writeFile(completeHtmlPath, completeEbookHTML);
      
      const completePdfPath = path.join(EBOOKS_DIR, 'guia-completa-desarrollo-web.pdf');
      await generatePDF(completeEbookHTML, completePdfPath);
      
      console.log(`  📚 Ebook completo generado: ${allArticles.length} artículos`);
    }
    
    console.log('\n🎉 Generación de ebooks completada!');
    console.log(`📁 Los ebooks se encuentran en: ${EBOOKS_DIR}`);
    
  } catch (error) {
    console.error('❌ Error durante la generación de ebooks:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateEbooks();
}

module.exports = { generateEbooks }; 