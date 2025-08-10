#!/usr/bin/env node

/**
 * 🔧 Mejorador de Artículos Existentes con IA
 * 
 * Este script:
 * - Analiza artículos existentes con Gemini AI
 * - Mejora contenido, SEO y estructura
 * - Añade valor educativo y práctico
 * - Optimiza para políticas de AdSense
 * - Preserva el contenido original como backup
 * - Genera versiones mejoradas
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BLOG_DIR: path.resolve(__dirname, '../public/blog'),
  BACKUP_DIR: path.resolve(__dirname, '../backups/original-articles'),
  IMPROVED_DIR: path.resolve(__dirname, '../public/blog-improved'),
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  
  // Criterios de mejora
  MIN_WORD_COUNT: 800,
  TARGET_WORD_COUNT: 1500,
  QUALITY_THRESHOLD: 0.7,
  
  // Configuración local
  LOCATION_KEYWORDS: [
    'Villa Carlos Paz',
    'Córdoba',
    'Argentina',
    'desarrollo web villa carlos paz',
    'programador córdoba'
  ]
};

// === VALIDACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY requerido');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === MEJORADOR DE ARTÍCULOS ===
class ArticleImprover {
  constructor() {
    this.processedArticles = [];
    this.errors = [];
    this.improvements = {
      contentEnhanced: 0,
      seoOptimized: 0,
      structureImproved: 0,
      adsenseCompliant: 0
    };
  }

  async initialize() {
    console.log('🔧 Inicializando mejorador de artículos...');
    
    // Crear directorios necesarios
    await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true });
    await fs.mkdir(CONFIG.IMPROVED_DIR, { recursive: true });
    
    console.log(`📁 Directorio backup: ${CONFIG.BACKUP_DIR}`);
    console.log(`📁 Directorio mejorados: ${CONFIG.IMPROVED_DIR}`);
  }

  // === ANALIZAR ARTÍCULO EXISTENTE ===
  async analyzeArticle(filePath) {
    console.log(`🔍 Analizando: ${path.basename(filePath)}`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extraer información básica
      const analysis = {
        title: this.extractTitle(content),
        wordCount: this.getWordCount(content),
        hasHeaders: this.hasHeaders(content),
        hasMetadata: this.hasMetadata(content),
        hasLocalContent: this.hasLocalContent(content),
        seoScore: 0,
        contentQuality: 0,
        improvementNeeded: []
      };
      
      // Análisis con IA
      const aiAnalysis = await this.getAIAnalysis(content);
      
      // Combinar análisis
      const fullAnalysis = {
        ...analysis,
        ...aiAnalysis,
        needsImprovement: this.needsImprovement(analysis, aiAnalysis)
      };
      
      console.log(`  📊 Palabras: ${fullAnalysis.wordCount}, SEO: ${Math.round(fullAnalysis.seoScore * 100)}%, Calidad: ${Math.round(fullAnalysis.contentQuality * 100)}%`);
      
      return fullAnalysis;
      
    } catch (error) {
      console.error(`❌ Error analizando ${path.basename(filePath)}: ${error.message}`);
      return null;
    }
  }

  // === ANÁLISIS CON IA ===
  async getAIAnalysis(content) {
    const analysisPrompt = `
Analiza este artículo HTML y evalúa:

CONTENIDO:
${content.substring(0, 2000)}...

Evalúa los siguientes aspectos (0-100%):

1. **Calidad del contenido**: ¿Es útil, informativo y original?
2. **SEO**: ¿Tiene títulos, meta descripción, estructura adecuada?
3. **Compliance con AdSense**: ¿Cumple políticas de contenido de calidad?
4. **Relevancia local**: ¿Menciona ubicación geográfica apropiadamente?
5. **Estructura**: ¿Tiene headers H2/H3, párrafos bien organizados?
6. **Valor educativo**: ¿Enseña algo útil al lector?

Identifica problemas específicos y sugiere mejoras.

Responde en formato JSON:
{
  "contentQuality": 75,
  "seoScore": 60,
  "adsenseCompliance": 80,
  "localRelevance": 30,
  "structureScore": 90,
  "educationalValue": 70,
  "overallScore": 68,
  "issues": [
    "Contenido muy corto (menos de 800 palabras)",
    "Falta meta descripción",
    "No menciona ubicación local"
  ],
  "suggestions": [
    "Expandir contenido con ejemplos prácticos",
    "Añadir meta tags SEO",
    "Incluir referencias a Villa Carlos Paz"
  ],
  "priority": "high|medium|low"
}
`;

    try {
      const result = await model.generateContent(analysisPrompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiData = JSON.parse(jsonMatch[0]);
        
        return {
          contentQuality: aiData.contentQuality / 100,
          seoScore: aiData.seoScore / 100,
          adsenseCompliance: aiData.adsenseCompliance / 100,
          localRelevance: aiData.localRelevance / 100,
          structureScore: aiData.structureScore / 100,
          educationalValue: aiData.educationalValue / 100,
          overallScore: aiData.overallScore / 100,
          issues: aiData.issues || [],
          suggestions: aiData.suggestions || [],
          priority: aiData.priority || 'medium'
        };
      }
    } catch (error) {
      console.warn(`⚠️ Error en análisis IA: ${error.message}`);
    }
    
    // Valores por defecto si falla el análisis IA
    return {
      contentQuality: 0.5,
      seoScore: 0.4,
      adsenseCompliance: 0.6,
      overallScore: 0.5,
      issues: ['Análisis IA falló'],
      suggestions: ['Revisar manualmente'],
      priority: 'medium'
    };
  }

  // === MEJORAR ARTÍCULO ===
  async improveArticle(filePath, analysis) {
    console.log(`🔧 Mejorando: ${path.basename(filePath)}`);
    
    try {
      // Crear backup
      await this.createBackup(filePath);
      
      const originalContent = await fs.readFile(filePath, 'utf-8');
      
      // Generar contenido mejorado
      const improvedContent = await this.generateImprovedContent(originalContent, analysis);
      
      // Crear artículo completo con template moderno
      const enhancedArticle = await this.createEnhancedArticle(improvedContent, analysis);
      
      // Guardar versión mejorada
      const improvedFileName = path.basename(filePath);
      const improvedPath = path.join(CONFIG.IMPROVED_DIR, improvedFileName);
      
      await fs.writeFile(improvedPath, enhancedArticle, 'utf-8');
      
      // También actualizar el original si es necesario
      if (analysis.priority === 'high' || analysis.overallScore < 0.5) {
        await fs.writeFile(filePath, enhancedArticle, 'utf-8');
        console.log(`  ✅ Original actualizado (prioridad ${analysis.priority})`);
      }
      
      const result = {
        file: path.basename(filePath),
        originalWordCount: analysis.wordCount,
        improvedWordCount: this.getWordCount(enhancedArticle),
        qualityImprovement: this.calculateImprovement(analysis),
        improvements: this.getAppliedImprovements(originalContent, enhancedArticle),
        status: 'improved'
      };
      
      this.processedArticles.push(result);
      console.log(`  ✅ Mejorado: ${result.originalWordCount} → ${result.improvedWordCount} palabras`);
      
      return result;
      
    } catch (error) {
      const errorInfo = {
        file: path.basename(filePath),
        error: error.message
      };
      
      this.errors.push(errorInfo);
      console.error(`  ❌ Error: ${error.message}`);
      
      return errorInfo;
    }
  }

  // === GENERAR CONTENIDO MEJORADO ===
  async generateImprovedContent(originalContent, analysis) {
    const improvementPrompt = `
TAREA: Mejora este artículo HTML para cumplir con los estándares de Google AdSense y ser de alta calidad.

ARTÍCULO ORIGINAL:
${originalContent}

ANÁLISIS ACTUAL:
- Palabras: ${analysis.wordCount}
- Calidad: ${Math.round(analysis.contentQuality * 100)}%
- SEO: ${Math.round(analysis.seoScore * 100)}%
- Problemas identificados: ${analysis.issues?.join(', ')}

OBJETIVOS DE MEJORA:
1. **Expandir contenido** a mínimo ${CONFIG.MIN_WORD_COUNT} palabras, ideal ${CONFIG.TARGET_WORD_COUNT}
2. **Mejorar SEO**: Títulos optimizados, meta descripción, headers H2/H3
3. **Añadir valor educativo**: Ejemplos prácticos, casos de uso, tutoriales
4. **Optimizar para AdSense**: Contenido original, útil, bien estructurado
5. **Incluir contexto local**: Mencionar Villa Carlos Paz, Córdoba cuando sea relevante
6. **Mejorar legibilidad**: Párrafos claros, listas, estructura lógica

INSTRUCCIONES ESPECÍFICAS:
- Mantén el tema y enfoque original
- Añade secciones nuevas con información valiosa
- Incluye ejemplos prácticos y casos de estudio
- Integra keywords naturalmente
- Asegúrate que sea 100% original y único
- Menciona servicios de hgaruna Digital apropiadamente
- Estructura con H2, H3, listas, párrafos bien formateados

ESTRUCTURA MEJORADA SUGERIDA:
1. Introducción expandida (¿qué aprenderá el lector?)
2. Conceptos fundamentales (definiciones claras)
3. Implementación práctica (pasos detallados)
4. Ejemplos y casos de estudio
5. Mejores prácticas y tips avanzados
6. Herramientas y recursos recomendados
7. Tendencias y futuro del tema
8. Cómo aplicarlo en Villa Carlos Paz / Argentina
9. Conclusión con próximos pasos

Devuelve SOLO el HTML mejorado completo, preservando la estructura HTML original pero con contenido expandido y mejorado.
`;

    try {
      const result = await model.generateContent(improvementPrompt);
      const improvedContent = result.response.text();
      
      // Limpiar y extraer HTML
      const cleanHTML = this.extractHTML(improvedContent);
      
      return cleanHTML;
      
    } catch (error) {
      console.error(`❌ Error generando contenido mejorado: ${error.message}`);
      return originalContent; // Devolver original si falla
    }
  }

  // === CREAR ARTÍCULO COMPLETO CON TEMPLATE MODERNO ===
  async createEnhancedArticle(improvedContent, analysis) {
    // Extraer información del contenido mejorado
    const title = this.extractTitle(improvedContent) || 'Artículo Mejorado';
    const description = this.generateMetaDescription(improvedContent);
    const keywords = await this.generateKeywords(improvedContent, analysis);
    
    // Template moderno con AdSense integrado
    const enhancedTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | hgaruna Digital</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="hgaruna Digital">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${CONFIG.SITE_URL}/blog/${path.basename(analysis.file || 'article.html')}">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772175009790237" crossorigin="anonymous"></script>
    <meta name="google-adsense-account" content="ca-pub-7772175009790237">
    
    <!-- CSS Moderno -->
    <link rel="stylesheet" href="../blogia-custom.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.7;
            color: #2c3e50;
            background: #f8f9fa;
            margin: 0;
            padding: 0;
        }
        
        .article-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 15px;
            overflow: hidden;
        }
        
        .article-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .article-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .article-meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .article-content {
            padding: 40px 30px;
        }
        
        .article-content h2 {
            color: #2c3e50;
            font-size: 1.8rem;
            margin: 30px 0 15px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .article-content h3 {
            color: #34495e;
            font-size: 1.4rem;
            margin: 25px 0 15px;
        }
        
        .article-content p {
            margin-bottom: 20px;
            text-align: justify;
        }
        
        .article-content ul, .article-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }
        
        .article-content li {
            margin-bottom: 8px;
        }
        
        .adsense-container {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        
        .adsense-label {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            margin: 40px 0;
            border-radius: 15px;
            text-align: center;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 12px 25px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 15px;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .article-container {
                margin: 0;
                border-radius: 0;
            }
            
            .article-header {
                padding: 30px 20px;
            }
            
            .article-title {
                font-size: 2rem;
            }
            
            .article-content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="article-container">
        <header class="article-header">
            <h1 class="article-title">${title}</h1>
            <div class="article-meta">
                <span><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString('es-ES')}</span>
                <span><i class="fas fa-user"></i> hgaruna Digital</span>
                <span><i class="fas fa-map-marker-alt"></i> Villa Carlos Paz</span>
            </div>
        </header>
        
        <!-- Anuncio Header -->
        <div class="adsense-container">
            <div class="adsense-label">Publicidad</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-7772175009790237"
                 data-ad-slot="1234567890"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
        
        <div class="article-content">
            ${improvedContent}
            
            <!-- Anuncio Medio -->
            <div class="adsense-container">
                <div class="adsense-label">Publicidad</div>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-7772175009790237"
                     data-ad-slot="0987654321"
                     data-ad-format="rectangle"
                     data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            
            <div class="cta-section">
                <h3>¿Necesitas desarrollo web profesional en Villa Carlos Paz?</h3>
                <p>En hgaruna Digital somos especialistas en crear soluciones web que impulsan tu negocio. Contacta con nuestro equipo de expertos.</p>
                <a href="/contacto" class="cta-button">Solicitar Cotización</a>
            </div>
        </div>
        
        <!-- Anuncio Footer -->
        <div class="adsense-container">
            <div class="adsense-label">Publicidad</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-7772175009790237"
                 data-ad-slot="1122334455"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
    </div>
</body>
</html>`;

    return enhancedTemplate;
  }

  // === FUNCIONES DE UTILIDAD ===
  async createBackup(filePath) {
    const fileName = path.basename(filePath);
    const backupPath = path.join(CONFIG.BACKUP_DIR, `${Date.now()}-${fileName}`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(backupPath, content, 'utf-8');
    } catch (error) {
      console.warn(`⚠️ Error creando backup: ${error.message}`);
    }
  }

  extractTitle(content) {
    const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i) || 
                      content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : null;
  }

  getWordCount(content) {
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textContent.split(' ').filter(word => word.length > 0).length;
  }

  hasHeaders(content) {
    return /<h[2-6][^>]*>/i.test(content);
  }

  hasMetadata(content) {
    return content.includes('<meta name="description"') || 
           content.includes('<meta name="keywords"');
  }

  hasLocalContent(content) {
    const localKeywords = CONFIG.LOCATION_KEYWORDS;
    const contentLower = content.toLowerCase();
    return localKeywords.some(keyword => contentLower.includes(keyword.toLowerCase()));
  }

  needsImprovement(analysis, aiAnalysis) {
    return analysis.wordCount < CONFIG.MIN_WORD_COUNT ||
           aiAnalysis.overallScore < CONFIG.QUALITY_THRESHOLD ||
           !analysis.hasMetadata ||
           !analysis.hasLocalContent;
  }

  calculateImprovement(analysis) {
    let improvement = 0;
    
    if (analysis.wordCount < CONFIG.MIN_WORD_COUNT) improvement += 0.3;
    if (!analysis.hasMetadata) improvement += 0.2;
    if (!analysis.hasLocalContent) improvement += 0.2;
    if (analysis.overallScore < 0.7) improvement += 0.3;
    
    return Math.min(1.0, improvement);
  }

  getAppliedImprovements(original, improved) {
    const improvements = [];
    
    const originalWordCount = this.getWordCount(original);
    const improvedWordCount = this.getWordCount(improved);
    
    if (improvedWordCount > originalWordCount * 1.5) {
      improvements.push('Contenido expandido significativamente');
      this.improvements.contentEnhanced++;
    }
    
    if (improved.includes('<meta name="description"') && !original.includes('<meta name="description"')) {
      improvements.push('Meta descripción añadida');
      this.improvements.seoOptimized++;
    }
    
    if (improved.includes('<h2>') && original.split('<h2>').length < improved.split('<h2>').length) {
      improvements.push('Estructura mejorada con headers');
      this.improvements.structureImproved++;
    }
    
    const hasLocalContent = CONFIG.LOCATION_KEYWORDS.some(keyword => 
      improved.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasLocalContent) {
      improvements.push('Contenido local añadido');
    }
    
    if (improved.includes('adsbygoogle')) {
      improvements.push('AdSense integrado');
      this.improvements.adsenseCompliant++;
    }
    
    return improvements;
  }

  extractHTML(content) {
    // Extraer HTML limpio del contenido generado
    const htmlMatch = content.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
    if (htmlMatch) {
      return htmlMatch[0];
    }
    
    // Si no hay HTML completo, extraer el contenido del body
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1];
    }
    
    // Limpiar markdown y código
    return content
      .replace(/```html\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim();
  }

  generateMetaDescription(content) {
    // Extraer el primer párrafo como descripción
    const pMatch = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (pMatch) {
      const description = pMatch[1].replace(/<[^>]*>/g, '').trim();
      return description.substring(0, 155) + (description.length > 155 ? '...' : '');
    }
    
    return 'Artículo especializado de hgaruna Digital sobre desarrollo web y tecnología.';
  }

  async generateKeywords(content, analysis) {
    try {
      const keywordPrompt = `
Genera keywords SEO para este contenido:

${content.substring(0, 500)}...

Incluye:
- Keywords principales del tema
- Keywords locales (Villa Carlos Paz, Córdoba)
- Keywords técnicos relevantes
- Long-tail keywords

Devuelve máximo 10 keywords separadas por comas.
`;

      const result = await model.generateContent(keywordPrompt);
      const keywords = result.response.text().trim();
      
      return keywords.substring(0, 200); // Limitar longitud
      
    } catch (error) {
      return 'desarrollo web, programación, tecnología, Villa Carlos Paz, Córdoba';
    }
  }

  // === PROCESAR TODOS LOS ARTÍCULOS ===
  async processAllArticles() {
    console.log('🔍 Buscando artículos existentes...');
    
    const htmlFiles = await glob('*.html', { cwd: CONFIG.BLOG_DIR });
    console.log(`📄 Encontrados ${htmlFiles.length} artículos`);
    
    if (htmlFiles.length === 0) {
      console.log('⚠️ No se encontraron artículos para mejorar');
      return [];
    }
    
    const results = [];
    
    for (let i = 0; i < htmlFiles.length; i++) {
      const fileName = htmlFiles[i];
      const filePath = path.join(CONFIG.BLOG_DIR, fileName);
      
      console.log(`\n[${i + 1}/${htmlFiles.length}] Procesando: ${fileName}`);
      
      try {
        // Analizar artículo
        const analysis = await this.analyzeArticle(filePath);
        
        if (!analysis) {
          console.log('  ⚠️ No se pudo analizar, saltando...');
          continue;
        }
        
        // Determinar si necesita mejora
        if (analysis.needsImprovement) {
          console.log(`  🔧 Necesita mejora (Score: ${Math.round(analysis.overallScore * 100)}%)`);
          
          const result = await this.improveArticle(filePath, analysis);
          results.push(result);
        } else {
          console.log(`  ✅ Ya cumple estándares (Score: ${Math.round(analysis.overallScore * 100)}%)`);
          results.push({
            file: fileName,
            status: 'already_good',
            score: analysis.overallScore
          });
        }
        
        // Pausa entre procesamientos
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        this.errors.push({ file: fileName, error: error.message });
      }
    }
    
    return results;
  }

  // === GENERAR REPORTE ===
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalArticles: this.processedArticles.length + this.errors.length,
        improved: this.processedArticles.filter(a => a.status === 'improved').length,
        alreadyGood: this.processedArticles.filter(a => a.status === 'already_good').length,
        errors: this.errors.length,
        totalWordCount: this.processedArticles.reduce((sum, a) => sum + (a.improvedWordCount || 0), 0)
      },
      improvements: this.improvements,
      processedArticles: this.processedArticles,
      errors: this.errors
    };
    
    console.log('\n📊 REPORTE DE MEJORAS:');
    console.log(`   📝 Artículos procesados: ${report.summary.totalArticles}`);
    console.log(`   🔧 Artículos mejorados: ${report.summary.improved}`);
    console.log(`   ✅ Ya cumplían estándares: ${report.summary.alreadyGood}`);
    console.log(`   ❌ Errores: ${report.summary.errors}`);
    console.log(`   📄 Total palabras añadidas: ${report.summary.totalWordCount}`);
    
    console.log('\n🎯 MEJORAS APLICADAS:');
    console.log(`   📝 Contenido expandido: ${this.improvements.contentEnhanced}`);
    console.log(`   🔍 SEO optimizado: ${this.improvements.seoOptimized}`);
    console.log(`   📋 Estructura mejorada: ${this.improvements.structureImproved}`);
    console.log(`   🎯 AdSense integrado: ${this.improvements.adsenseCompliant}`);
    
    return report;
  }

  async saveReport(report) {
    const reportPath = path.resolve(__dirname, '../reports/article-improvement-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n💾 Reporte guardado en: ${reportPath}`);
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    console.log('🚀 Iniciando mejora de artículos existentes...');
    
    const improver = new ArticleImprover();
    await improver.initialize();
    
    // Procesar todos los artículos
    await improver.processAllArticles();
    
    // Generar reporte
    const report = improver.generateReport();
    await improver.saveReport(report);
    
    console.log('\n🎉 ¡Mejora de artículos completada!');
    console.log('💡 Próximos pasos:');
    console.log('   1. Revisar artículos mejorados en /public/blog-improved/');
    console.log('   2. Validar que cumplen políticas de AdSense');
    console.log('   3. Probar en diferentes dispositivos');
    console.log('   4. Monitorear performance y engagement');
    
    return report;
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ArticleImprover };
