#!/usr/bin/env node

/**
 * 🎯 Analizador Avanzado de Keywords y Tendencias
 * 
 * Características:
 * - Análisis de tendencias en tiempo real
 * - Competencia de keywords
 * - Oportunidades de nicho
 * - Keywords de long-tail
 * - Análisis semántico con IA
 * - Predicción de performance
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  OUTPUT_DIR: path.resolve(__dirname, '../public/seo-data'),
  BLOG_OUTPUT_DIR: path.resolve(__dirname, '../public/blog'),
  TRENDS_API_KEY: process.env.GOOGLE_TRENDS_API_KEY,
  
  // Configuración local Villa Carlos Paz
  LOCAL_KEYWORDS: [
    'desarrollo web villa carlos paz',
    'diseño web villa carlos paz',
    'programador web villa carlos paz',
    'marketing digital villa carlos paz',
    'seo villa carlos paz',
    'tienda online villa carlos paz',
    'e-commerce villa carlos paz',
    'sitio web villa carlos paz'
  ],
  
  // Keywords técnicas principales
  TECH_KEYWORDS: [
    'react js', 'vue js', 'angular', 'node js', 'python',
    'javascript', 'typescript', 'html css', 'api rest',
    'base de datos', 'mongodb', 'postgresql', 'docker',
    'kubernetes', 'aws', 'devops', 'ci cd', 'testing'
  ],
  
  // Configuración de análisis
  MIN_SEARCH_VOLUME: 100,
  MAX_COMPETITION: 0.7,
  TARGET_CITIES: ['villa carlos paz', 'córdoba', 'argentina']
};

// === INICIALIZACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY requerido');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === ANALIZADOR DE KEYWORDS ===
class AdvancedKeywordAnalyzer {
  constructor() {
    this.keywordData = {
      local: [],
      technical: [],
      trending: [],
      longTail: [],
      opportunities: [],
      competitors: []
    };
  }
  
  async initialize() {
    console.log('🎯 Inicializando analizador de keywords...');
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
  }
  
  // === ANÁLISIS DE TENDENCIAS CON GEMINI ===
  async analyzeTrendsWithAI() {
    console.log('🧠 Analizando tendencias con IA...');
    
    const prompt = `
Analiza las tendencias actuales en desarrollo web y tecnología para 2025.
Enfócate en keywords y temas que serían relevantes para una empresa de desarrollo web en Villa Carlos Paz, Córdoba, Argentina.

Considera:
- Tecnologías emergentes en desarrollo web
- Tendencias en diseño y UX/UI
- Marketing digital local
- SEO y optimización web
- E-commerce y comercio digital
- Desarrollo móvil
- Inteligencia artificial en web
- Sustentabilidad en desarrollo web

Para cada tendencia, proporciona:
1. Keyword principal
2. Keywords relacionadas (long-tail)
3. Volumen de búsqueda estimado (bajo/medio/alto)
4. Relevancia para negocios locales (1-10)
5. Dificultad de ranking (1-10)

Devuelve la respuesta en formato JSON con esta estructura:
{
  "trends": [
    {
      "keyword": "keyword principal",
      "related_keywords": ["keyword1", "keyword2", "keyword3"],
      "search_volume": "alto|medio|bajo",
      "local_relevance": 8,
      "difficulty": 6,
      "category": "categoria",
      "opportunity_score": 85
    }
  ],
  "local_opportunities": [
    {
      "keyword": "keyword + villa carlos paz",
      "search_intent": "comercial|informacional|transaccional",
      "business_potential": "alto|medio|bajo",
      "competition": "baja|media|alta"
    }
  ]
}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON de la respuesta');
      }
      
      const trendsData = JSON.parse(jsonMatch[0]);
      
      this.keywordData.trending = trendsData.trends || [];
      this.keywordData.opportunities = trendsData.local_opportunities || [];
      
      console.log(`✅ Identificadas ${this.keywordData.trending.length} tendencias principales`);
      console.log(`✅ Encontradas ${this.keywordData.opportunities.length} oportunidades locales`);
      
      return trendsData;
      
    } catch (error) {
      console.error('❌ Error en análisis de tendencias:', error.message);
      return { trends: [], local_opportunities: [] };
    }
  }
  
  // === ANÁLISIS DE COMPETENCIA LOCAL ===
  async analyzeLocalCompetition() {
    console.log('🏪 Analizando competencia local...');
    
    const competitorAnalysisPrompt = `
Analiza la competencia en desarrollo web y marketing digital en Villa Carlos Paz, Córdoba, Argentina.

Busca información sobre:
1. Principales competidores en desarrollo web
2. Keywords que probablemente estén usando
3. Servicios que ofrecen
4. Gaps en el mercado local
5. Oportunidades no aprovechadas

Devuelve un análisis en JSON:
{
  "competitor_keywords": [
    {
      "keyword": "keyword del competidor",
      "estimated_volume": "alto|medio|bajo",
      "our_opportunity": "alta|media|baja",
      "suggested_approach": "descripción de estrategia"
    }
  ],
  "market_gaps": [
    {
      "service": "servicio no cubierto",
      "keywords": ["keyword1", "keyword2"],
      "business_potential": "alto|medio|bajo"
    }
  ],
  "local_search_patterns": [
    {
      "pattern": "patrón de búsqueda",
      "frequency": "común|ocasional|raro",
      "target_keywords": ["keyword1", "keyword2"]
    }
  ]
}
`;

    try {
      const result = await model.generateContent(competitorAnalysisPrompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const competitorData = JSON.parse(jsonMatch[0]);
        this.keywordData.competitors = competitorData.competitor_keywords || [];
        
        console.log(`✅ Analizados ${this.keywordData.competitors.length} keywords de competencia`);
        return competitorData;
      }
    } catch (error) {
      console.error('❌ Error en análisis de competencia:', error.message);
    }
    
    return { competitor_keywords: [], market_gaps: [], local_search_patterns: [] };
  }
  
  // === GENERACIÓN DE LONG-TAIL KEYWORDS ===
  async generateLongTailKeywords() {
    console.log('📏 Generando keywords long-tail...');
    
    const longTailPrompt = `
Genera keywords long-tail específicas para una empresa de desarrollo web en Villa Carlos Paz, Córdoba.

Base: ${CONFIG.LOCAL_KEYWORDS.join(', ')}
Tecnologías: ${CONFIG.TECH_KEYWORDS.join(', ')}

Crea keywords long-tail que incluyan:
1. Intención comercial clara
2. Localización específica
3. Servicios técnicos específicos
4. Preguntas frecuentes
5. Comparaciones
6. Precios y presupuestos

Formato JSON:
{
  "commercial_longtail": [
    {
      "keyword": "keyword long-tail",
      "intent": "commercial|informational|transactional",
      "search_volume_estimate": "alto|medio|bajo",
      "conversion_potential": 85,
      "suggested_content_type": "landing page|blog post|service page"
    }
  ],
  "question_based": [
    {
      "question": "pregunta completa",
      "keyword_variation": "variación optimizada",
      "answer_opportunity": "tipo de contenido para responder"
    }
  ]
}
`;

    try {
      const result = await model.generateContent(longTailPrompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const longTailData = JSON.parse(jsonMatch[0]);
        this.keywordData.longTail = [
          ...(longTailData.commercial_longtail || []),
          ...(longTailData.question_based || [])
        ];
        
        console.log(`✅ Generadas ${this.keywordData.longTail.length} keywords long-tail`);
        return longTailData;
      }
    } catch (error) {
      console.error('❌ Error generando long-tail keywords:', error.message);
    }
    
    return { commercial_longtail: [], question_based: [] };
  }
  
  // === ANÁLISIS DE INTENCIÓN DE BÚSQUEDA ===
  async analyzeSearchIntent() {
    console.log('🎯 Analizando intención de búsqueda...');
    
    const allKeywords = [
      ...CONFIG.LOCAL_KEYWORDS,
      ...this.keywordData.trending.map(t => t.keyword),
      ...this.keywordData.longTail.map(l => l.keyword || l.question)
    ];
    
    const intentAnalysis = {};
    
    for (const keyword of allKeywords.slice(0, 20)) { // Limitar para evitar timeout
      try {
        const intentPrompt = `
Analiza la intención de búsqueda para: "${keyword}"

Clasifica en:
- INFORMATIONAL: busca información, aprende
- COMMERCIAL: investiga para comprar, compara
- TRANSACTIONAL: listo para comprar/contratar
- NAVIGATIONAL: busca sitio específico

Responde SOLO con JSON:
{
  "keyword": "${keyword}",
  "primary_intent": "COMMERCIAL",
  "confidence": 95,
  "user_journey_stage": "consideration|awareness|decision",
  "content_recommendation": "tipo de contenido óptimo",
  "cta_recommendation": "llamada a la acción sugerida"
}
`;

        const result = await model.generateContent(intentPrompt);
        const responseText = result.response.text();
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const intentData = JSON.parse(jsonMatch[0]);
          intentAnalysis[keyword] = intentData;
        }
        
      } catch (error) {
        console.warn(`⚠️ Error analizando intención para "${keyword}":`, error.message);
      }
    }
    
    console.log(`✅ Analizadas ${Object.keys(intentAnalysis).length} intenciones de búsqueda`);
    return intentAnalysis;
  }
  
  // === OPTIMIZACIÓN DE CONTENIDO ===
  async generateContentStrategy() {
    console.log('📝 Generando estrategia de contenido...');
    
    const strategyPrompt = `
Basándote en estos datos de keywords:

KEYWORDS LOCALES: ${CONFIG.LOCAL_KEYWORDS.join(', ')}
KEYWORDS TRENDING: ${this.keywordData.trending.map(t => t.keyword).join(', ')}
OPORTUNIDADES: ${this.keywordData.opportunities.map(o => o.keyword).join(', ')}

Genera una estrategia de contenido detallada en JSON:
{
  "content_calendar": [
    {
      "week": 1,
      "primary_keyword": "keyword principal",
      "content_type": "blog post|landing page|guide",
      "title_suggestion": "título optimizado",
      "target_audience": "audiencia objetivo",
      "expected_traffic": "alto|medio|bajo"
    }
  ],
  "keyword_clusters": [
    {
      "main_topic": "tema principal",
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "content_pieces": ["tipo1", "tipo2"],
      "internal_linking_strategy": "estrategia de enlaces internos"
    }
  ],
  "priority_pages": [
    {
      "page_type": "tipo de página",
      "target_keywords": ["keyword1", "keyword2"],
      "optimization_notes": "notas de optimización",
      "estimated_roi": "alto|medio|bajo"
    }
  ]
}
`;

    try {
      const result = await model.generateContent(strategyPrompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const strategy = JSON.parse(jsonMatch[0]);
        console.log('✅ Estrategia de contenido generada');
        return strategy;
      }
    } catch (error) {
      console.error('❌ Error generando estrategia:', error.message);
    }
    
    return {
      content_calendar: [],
      keyword_clusters: [],
      priority_pages: []
    };
  }
  
  // === GENERACIÓN DE ARTÍCULOS ===
  async generateArticlesFromKeywords() {
    console.log('📝 Generando artículos basados en keywords...');

    // Crear directorio de blog si no existe
    await fs.mkdir(CONFIG.BLOG_OUTPUT_DIR, { recursive: true });

    const topKeywords = [
      ...this.keywordData.trending.filter(t => t.opportunity_score > 70).slice(0, 3),
      ...this.keywordData.opportunities.filter(o => o.business_potential === 'alto').slice(0, 2)
    ];

    const generatedArticles = [];

    for (const keywordData of topKeywords) {
      try {
        const keyword = keywordData.keyword;
        const article = await this.generateSingleArticle(keyword, keywordData);

        if (article) {
          generatedArticles.push(article);
          console.log(`✅ Artículo generado para: ${keyword}`);
        }

        // Pausa entre generaciones para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Error generando artículo para ${keywordData.keyword}:`, error.message);
      }
    }

    console.log(`✅ Se generaron ${generatedArticles.length} artículos`);
    return generatedArticles;
  }

  async generateSingleArticle(keyword, keywordData) {
    const articlePrompt = `
Crea un artículo completo y profesional en HTML sobre: "${keyword}"

Contexto:
- Empresa: Desarrollo web en Villa Carlos Paz, Córdoba
- Categoría: ${keywordData.category || 'tecnología'}
- Público objetivo: Empresarios y emprendedores locales
- Nivel de dificultad SEO: ${keywordData.difficulty || 5}/10

El artículo debe:
1. Tener entre 1500-2000 palabras
2. Incluir título optimizado para SEO
3. Meta descripción atractiva
4. Estructura con H2 y H3 apropiados
5. Llamadas a la acción (CTA) locales
6. Keywords relacionadas naturalmente integradas
7. Información práctica y actualizada
8. Enfoque local (Villa Carlos Paz, Córdoba)

Devuelve SOLO el HTML completo del artículo con esta estructura:
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[TÍTULO OPTIMIZADO SEO]</title>
    <meta name="description" content="[META DESCRIPCIÓN]">
    <meta name="keywords" content="[KEYWORDS SEPARADAS POR COMAS]">
    <link rel="stylesheet" href="../blogia-custom.css">
</head>
<body>
    <article class="blog-article">
        <header class="article-header">
            <h1>[TÍTULO PRINCIPAL]</h1>
            <div class="article-meta">
                <time datetime="${new Date().toISOString().split('T')[0]}">${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                <span class="category">${keywordData.category || 'Tecnología'}</span>
            </div>
        </header>

        <div class="article-content">
            [CONTENIDO COMPLETO DEL ARTÍCULO CON H2, H3, P, ETC.]
        </div>

        <footer class="article-footer">
            <div class="cta-section">
                <h3>¿Necesitas desarrollo web en Villa Carlos Paz?</h3>
                <p>Contacta con nuestro equipo de expertos para crear la solución digital perfecta para tu negocio.</p>
                <a href="/contacto" class="cta-button">Solicitar Cotización</a>
            </div>
        </footer>
    </article>
</body>
</html>
`;

    try {
      const result = await model.generateContent(articlePrompt);
      const htmlContent = result.response.text();

      // Limpiar el contenido y extraer solo el HTML
      const cleanHtml = this.extractAndCleanHTML(htmlContent);

      // Generar nombre de archivo seguro
      const fileName = this.generateSafeFileName(keyword);
      const filePath = path.join(CONFIG.BLOG_OUTPUT_DIR, fileName);

      // Guardar el artículo
      await fs.writeFile(filePath, cleanHtml, 'utf-8');

      return {
        keyword,
        fileName,
        filePath,
        title: this.extractTitle(cleanHtml),
        category: keywordData.category || 'tecnología'
      };

    } catch (error) {
      console.error(`Error generando artículo para "${keyword}":`, error.message);
      return null;
    }
  }

  extractAndCleanHTML(content) {
    // Extraer contenido HTML y limpiar markdown
    let html = content;

    // Buscar bloques de HTML
    const htmlMatch = html.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
    if (htmlMatch) {
      html = htmlMatch[0];
    }

    // Limpiar caracteres problemáticos
    html = html.replace(/```html\s*/gi, '').replace(/```\s*$/gi, '');

    return html;
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1] : 'Artículo sin título';
  }

  generateSafeFileName(keyword) {
    const date = new Date().toISOString().split('T')[0];
    const safeName = keyword
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);

    return `${safeName}.html`;
  }

  // === GUARDADO DE RESULTADOS ===
  async saveResults() {
    console.log('💾 Guardando resultados...');

    const timestamp = new Date().toISOString();

    // Análisis completo
    const fullAnalysis = {
      timestamp,
      site_url: CONFIG.SITE_URL,
      analysis_summary: {
        total_keywords_analyzed: Object.values(this.keywordData).flat().length,
        trending_opportunities: this.keywordData.trending.length,
        local_opportunities: this.keywordData.opportunities.length,
        longtail_generated: this.keywordData.longTail.length,
        competitor_keywords: this.keywordData.competitors.length
      },
      keyword_data: this.keywordData,
      content_strategy: await this.generateContentStrategy(),
      search_intent_analysis: await this.analyzeSearchIntent()
    };

    // Guardar análisis completo
    await fs.writeFile(
      path.join(CONFIG.OUTPUT_DIR, 'keyword-analysis-complete.json'),
      JSON.stringify(fullAnalysis, null, 2)
    );

    // Guardar keywords optimizadas para uso directo
    const optimizedKeywords = {
      timestamp,
      high_priority: this.keywordData.trending
        .filter(t => t.opportunity_score > 70)
        .map(t => ({
          keyword: t.keyword,
          score: t.opportunity_score,
          category: t.category
        })),
      local_focus: this.keywordData.opportunities
        .filter(o => o.business_potential === 'alto')
        .map(o => o.keyword),
      longtail_ready: this.keywordData.longTail
        .filter(l => l.conversion_potential > 70)
        .map(l => l.keyword || l.question)
    };

    await fs.writeFile(
      path.join(CONFIG.OUTPUT_DIR, 'optimized-keywords.json'),
      JSON.stringify(optimizedKeywords, null, 2)
    );

    // Generar reporte CSV para análisis externo
    const csvData = this.generateCSVReport();
    await fs.writeFile(
      path.join(CONFIG.OUTPUT_DIR, 'keyword-report.csv'),
      csvData
    );

    console.log('✅ Resultados guardados en:', CONFIG.OUTPUT_DIR);

    return {
      total_keywords: Object.values(this.keywordData).flat().length,
      high_priority_count: optimizedKeywords.high_priority.length,
      local_opportunities: optimizedKeywords.local_focus.length
    };
  }
  
  generateCSVReport() {
    const csvRows = ['Keyword,Category,Type,Priority,Difficulty,Opportunity_Score'];
    
    // Trending keywords
    this.keywordData.trending.forEach(t => {
      csvRows.push(`"${t.keyword}","${t.category}","trending",${t.local_relevance},${t.difficulty},${t.opportunity_score}`);
    });
    
    // Local opportunities
    this.keywordData.opportunities.forEach(o => {
      const priority = o.business_potential === 'alto' ? 10 : o.business_potential === 'medio' ? 6 : 3;
      csvRows.push(`"${o.keyword}","local","opportunity",${priority},5,${priority * 10}`);
    });
    
    // Long-tail
    this.keywordData.longTail.forEach(l => {
      const keyword = l.keyword || l.question;
      const priority = l.conversion_potential || 50;
      csvRows.push(`"${keyword}","longtail","conversion",${Math.round(priority/10)},3,${priority}`);
    });
    
    return csvRows.join('\n');
  }
  
  // === MÉTODO PRINCIPAL ===
  async runAnalysis() {
    console.log('🚀 Ejecutando análisis completo de keywords...');
    
    try {
      await this.initialize();
      
      // Ejecutar análisis en paralelo cuando sea posible
      const [trendsData, competitorData] = await Promise.all([
        this.analyzeTrendsWithAI(),
        this.analyzeLocalCompetition()
      ]);
      
      // Ejecutar análisis secuenciales
      await this.generateLongTailKeywords();

      // Generar artículos basados en keywords
      const articles = await this.generateArticlesFromKeywords();

      // Guardar resultados
      const summary = await this.saveResults();

      console.log('\n🎉 Análisis de keywords y generación de artículos completado');
      console.log(`📊 Resumen:`);
      console.log(`   - Total keywords analizadas: ${summary.total_keywords}`);
      console.log(`   - Keywords alta prioridad: ${summary.high_priority_count}`);
      console.log(`   - Oportunidades locales: ${summary.local_opportunities}`);
      console.log(`   - Artículos generados: ${articles.length}`);

      return { ...summary, articles_generated: articles.length, articles };
      
    } catch (error) {
      console.error('❌ Error en análisis de keywords:', error);
      throw error;
    }
  }
}

// === EJECUCIÓN PRINCIPAL ===
async function main() {
  try {
    const analyzer = new AdvancedKeywordAnalyzer();
    const results = await analyzer.runAnalysis();
    
    // Output para GitHub Actions
    console.log('Keywords analysis completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AdvancedKeywordAnalyzer };
