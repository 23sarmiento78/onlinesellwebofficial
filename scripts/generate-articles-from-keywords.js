#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BLOG_OUTPUT_DIR: path.resolve(__dirname, '../public/blog'),
  SITE_URL: 'https://hgaruna.org',
  
  // Keywords principales para Villa Carlos Paz
  TARGET_KEYWORDS: [
    'desarrollo web villa carlos paz',
    'diseño web villa carlos paz',
    'programador web villa carlos paz',
    'marketing digital villa carlos paz',
    'seo villa carlos paz',
    'tienda online villa carlos paz',
    'react js desarrollo web',
    'vue js aplicaciones web',
    'nodejs backend desarrollo',
    'javascript moderno 2025'
  ]
};

// === INICIALIZACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY requerido');
  console.log('💡 Asegúrate de que la variable esté configurada en GitHub Secrets');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === GENERADOR DE ARTÍCULOS ===
class ArticleGenerator {
  constructor() {
    this.generatedArticles = [];
  }

  async initialize() {
    console.log('🚀 Inicializando generador de artículos...');
    await fs.mkdir(CONFIG.BLOG_OUTPUT_DIR, { recursive: true });
  }

  async generateArticlesFromKeywords() {
    console.log('📝 Generando artículos desde keywords...');
    
    // Tomar solo los primeros 3 keywords para no sobrecargar
    const selectedKeywords = CONFIG.TARGET_KEYWORDS.slice(0, 3);
    
    for (const keyword of selectedKeywords) {
      try {
        console.log(`🔍 Generando artículo para: "${keyword}"`);
        
        const article = await this.generateSingleArticle(keyword);
        
        if (article) {
          this.generatedArticles.push(article);
          console.log(`✅ Artículo generado: ${article.fileName}`);
        }
        
        // Pausa entre generaciones
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error generando artículo para "${keyword}":`, error.message);
      }
    }
    
    console.log(`🎉 Total artículos generados: ${this.generatedArticles.length}`);
    return this.generatedArticles;
  }

  async generateSingleArticle(keyword) {
    const category = this.determineCategory(keyword);
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];
    const formattedDate = currentDate.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const articlePrompt = `
Crea un artículo completo y profesional en HTML sobre: "${keyword}"

CONTEXTO:
- Empresa: Desarrollo web en Villa Carlos Paz, Córdoba, Argentina
- Categoría: ${category}
- Público objetivo: Empresarios locales, emprendedores y desarrolladores
- Enfoque: Práctico, informativo y con orientación local

REQUISITOS DEL ARTÍCULO:
1. Entre 1200-1800 palabras
2. Título SEO optimizado y atractivo
3. Meta descripción de 150-160 caracteres
4. Estructura clara con H2 y H3
5. Llamadas a la acción locales
6. Información actualizada y práctica
7. Enfoque en Villa Carlos Paz y región

DEVUELVE SOLO HTML COMPLETO:
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[TÍTULO OPTIMIZADO PARA SEO]</title>
    <meta name="description" content="[META DESCRIPCIÓN 150-160 CARACTERES]">
    <meta name="keywords" content="${keyword}, villa carlos paz, desarrollo web, programación">
    <meta name="author" content="HGaruna.org">
    <meta name="robots" content="index, follow">
    <link rel="stylesheet" href="../blogia-custom.css">
</head>
<body>
    <article class="blog-article">
        <header class="article-header">
            <h1>[TÍTULO PRINCIPAL H1]</h1>
            <div class="article-meta">
                <time datetime="${dateString}">${formattedDate}</time>
                <span class="category">${category}</span>
                <span class="reading-time">📖 5 min lectura</span>
            </div>
        </header>
        
        <div class="article-content">
            <div class="intro-section">
                [PÁRRAFO INTRODUCTORIO ATRACTIVO]
            </div>
            
            [CONTENIDO COMPLETO DEL ARTÍCULO CON ESTRUCTURA H2, H3, PÁRRAFOS, LISTAS, ETC.]
            
            <div class="conclusion-section">
                [CONCLUSIÓN SÓLIDA]
            </div>
        </div>
        
        <footer class="article-footer">
            <div class="cta-section">
                <h3>¿Necesitas ${this.getServiceFromKeyword(keyword)} en Villa Carlos Paz?</h3>
                <p>Nuestro equipo de expertos está listo para ayudarte a llevar tu proyecto al siguiente nivel.</p>
                <div class="cta-buttons">
                    <a href="/contacto" class="cta-button primary">Solicitar Cotización</a>
                    <a href="/blog" class="cta-button secondary">Ver Más Artículos</a>
                </div>
            </div>
            
            <div class="related-tags">
                <h4>Temas relacionados:</h4>
                <div class="tag-list">
                    ${this.generateRelatedTags(keyword)}
                </div>
            </div>
        </footer>
    </article>
</body>
</html>

IMPORTANTE: 
- Usa un lenguaje profesional pero accesible
- Incluye ejemplos prácticos cuando sea posible
- Mantén el enfoque local en Villa Carlos Paz
- Asegúrate de que el contenido sea valioso y único`;

    try {
      const result = await model.generateContent(articlePrompt);
      const htmlContent = result.response.text();
      
      // Limpiar y procesar el HTML
      const cleanHtml = this.cleanHTML(htmlContent);
      
      // Generar nombre de archivo
      const fileName = this.generateFileName(keyword);
      const filePath = path.join(CONFIG.BLOG_OUTPUT_DIR, fileName);
      
      // Guardar artículo
      await fs.writeFile(filePath, cleanHtml, 'utf-8');
      
      return {
        keyword,
        fileName,
        filePath,
        title: this.extractTitle(cleanHtml),
        category,
        dateGenerated: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`Error generando artículo para "${keyword}":`, error.message);
      return null;
    }
  }

  determineCategory(keyword) {
    const categoryMap = {
      'desarrollo web': 'Desarrollo Web',
      'diseño web': 'Diseño Web',
      'programador': 'Programación',
      'marketing digital': 'Marketing Digital',
      'seo': 'SEO',
      'tienda online': 'E-commerce',
      'react': 'Frontend',
      'vue': 'Frontend',
      'nodejs': 'Backend',
      'javascript': 'Programación'
    };

    for (const [key, category] of Object.entries(categoryMap)) {
      if (keyword.toLowerCase().includes(key)) {
        return category;
      }
    }
    
    return 'Tecnología';
  }

  getServiceFromKeyword(keyword) {
    if (keyword.includes('desarrollo web')) return 'desarrollo web';
    if (keyword.includes('diseño web')) return 'diseño web';
    if (keyword.includes('marketing')) return 'marketing digital';
    if (keyword.includes('seo')) return 'optimización SEO';
    if (keyword.includes('tienda')) return 'desarrollo de e-commerce';
    return 'desarrollo de software';
  }

  generateRelatedTags(keyword) {
    const tags = [
      'villa carlos paz',
      'córdoba',
      'desarrollo web',
      'programación',
      'tecnología'
    ];
    
    // Agregar tags específicos según keyword
    if (keyword.includes('react')) tags.push('react', 'frontend');
    if (keyword.includes('vue')) tags.push('vue', 'frontend');
    if (keyword.includes('nodejs')) tags.push('nodejs', 'backend');
    if (keyword.includes('marketing')) tags.push('marketing digital', 'seo');
    
    return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  }

  cleanHTML(content) {
    // Extraer solo el HTML válido
    let html = content;
    
    // Buscar el bloque HTML completo
    const htmlMatch = html.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
    if (htmlMatch) {
      html = htmlMatch[0];
    }
    
    // Limpiar marcadores de código
    html = html.replace(/```html\s*/gi, '').replace(/```\s*$/gi, '');
    
    return html.trim();
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1] : 'Artículo sin título';
  }

  generateFileName(keyword) {
    // Crear nombre de archivo seguro y descriptivo
    const safeName = keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);
    
    return `${safeName}.html`;
  }

  async generateSummaryReport() {
    const report = {
      timestamp: new Date().toISOString(),
      total_articles: this.generatedArticles.length,
      articles: this.generatedArticles.map(article => ({
        title: article.title,
        keyword: article.keyword,
        category: article.category,
        fileName: article.fileName
      })),
      status: 'completed'
    };

    const reportPath = path.join(CONFIG.BLOG_OUTPUT_DIR, 'generation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Reporte generado:', reportPath);
    return report;
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    console.log('🎯 Iniciando generación de artículos desde keywords...');
    
    const generator = new ArticleGenerator();
    await generator.initialize();
    
    const articles = await generator.generateArticlesFromKeywords();
    const report = await generator.generateSummaryReport();
    
    console.log('\n🎉 Proceso completado exitosamente');
    console.log(`📝 Artículos generados: ${articles.length}`);
    console.log(`📁 Guardados en: ${CONFIG.BLOG_OUTPUT_DIR}`);
    
    // Output para GitHub Actions
    if (articles.length > 0) {
      console.log('::set-output name=articles_generated::' + articles.length);
      console.log('::set-output name=status::success');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    console.log('::set-output name=status::error');
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ArticleGenerator };
