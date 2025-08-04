#!/usr/bin/env node

/**
 * 🗺️ Generador de Sitemap Inteligente con Prioridades Automáticas
 * 
 * Características:
 * - Prioridades dinámicas basadas en contenido
 * - Frecuencias de cambio inteligentes
 * - Análisis de estructura de URLs
 * - Optimización para crawlers
 * - Múltiples formatos (XML, TXT, JSON)
 * - Integración con Google Search Console
 */

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// === CONFIGURACIÓN ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  OUTPUT_DIR: path.resolve(__dirname, '../public'),
  BLOG_DIR: path.resolve(__dirname, '../public/blog'),
  
  // Configuración de prioridades
  DEFAULT_PRIORITY: 0.5,
  MAX_URLS: 50000,
  
  // Configuración de frecuencias
  CHANGE_FREQUENCIES: {
    daily: ['blog', 'noticias', 'ofertas'],
    weekly: ['servicios', 'productos', 'portafolio'],
    monthly: ['empresa', 'contacto', 'legal'],
    yearly: ['politicas', 'terminos']
  }
};

// === INICIALIZACIÓN ===
const genAI = CONFIG.GEMINI_API_KEY ? new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;

// === ANALIZADOR DE CONTENIDO ===
class ContentAnalyzer {
  static async analyzeHTMLContent(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Extraer metadatos básicos
      const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i);
      const descMatch = content.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
      const keywordsMatch = content.match(/<meta[^>]*name="keywords"[^>]*content="([^"]*)"[^>]*>/i);
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      
      // Analizar estructura
      const headings = (content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []).length;
      const images = (content.match(/<img[^>]*>/gi) || []).length;
      const links = (content.match(/<a[^>]*href[^>]*>/gi) || []).length;
      const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(word => word.length > 0).length;
      
      // Verificar schema markup
      const hasSchema = content.includes('application/ld+json');
      const schemaTypes = this.extractSchemaTypes(content);
      
      return {
        title: titleMatch ? titleMatch[1] : '',
        description: descMatch ? descMatch[1] : '',
        keywords: keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim()) : [],
        h1: h1Match ? h1Match[1].replace(/<[^>]*>/g, '') : '',
        wordCount,
        headingsCount: headings,
        imagesCount: images,
        linksCount: links,
        hasSchema,
        schemaTypes,
        contentLength: content.length,
        lastModified: await this.getFileModifiedDate(filePath)
      };
    } catch (error) {
      console.warn(`⚠️ Error analizando ${filePath}:`, error.message);
      return null;
    }
  }
  
  static extractSchemaTypes(content) {
    const schemaTypes = [];
    const jsonLdMatches = content.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis);
    
    if (jsonLdMatches) {
      jsonLdMatches.forEach(match => {
        try {
          const jsonContent = match.replace(/<script[^>]*>|<\/script>/g, '');
          const schema = JSON.parse(jsonContent);
          if (schema['@type']) {
            schemaTypes.push(schema['@type']);
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      });
    }
    
    return schemaTypes;
  }
  
  static async getFileModifiedDate(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.mtime;
    } catch (error) {
      return new Date();
    }
  }
}

// === CALCULADOR DE PRIORIDADES ===
class PriorityCalculator {
  static async calculateIntelligentPriority(url, contentData, urlType) {
    let priority = CONFIG.DEFAULT_PRIORITY;
    let reasoning = [];
    
    // === ANÁLISIS BASADO EN TIPO DE URL ===
    switch (urlType) {
      case 'homepage':
        priority = 1.0;
        reasoning.push('Página principal del sitio');
        break;
        
      case 'service_page':
        priority = 0.9;
        reasoning.push('Página de servicio principal');
        break;
        
      case 'blog_article':
        priority = await this.calculateBlogPriority(contentData);
        reasoning.push('Artículo de blog con prioridad calculada');
        break;
        
      case 'contact':
        priority = 0.8;
        reasoning.push('Página de contacto - alta importancia comercial');
        break;
        
      case 'legal':
        priority = 0.3;
        reasoning.push('Página legal - baja prioridad SEO');
        break;
        
      default:
        priority = 0.5;
        reasoning.push('Prioridad por defecto');
    }
    
    // === AJUSTES BASADOS EN CONTENIDO ===
    if (contentData) {
      // Bonificación por calidad de contenido
      if (contentData.wordCount > 1500) {
        priority += 0.1;
        reasoning.push('Contenido extenso (+0.1)');
      }
      
      if (contentData.hasSchema) {
        priority += 0.05;
        reasoning.push('Schema markup presente (+0.05)');
      }
      
      if (contentData.imagesCount > 3) {
        priority += 0.02;
        reasoning.push('Múltiples imágenes (+0.02)');
      }
      
      if (contentData.keywords && contentData.keywords.length > 5) {
        priority += 0.03;
        reasoning.push('Keywords bien definidas (+0.03)');
      }
      
      // Penalización por contenido de baja calidad
      if (contentData.wordCount < 300) {
        priority -= 0.1;
        reasoning.push('Contenido muy corto (-0.1)');
      }
      
      if (!contentData.description) {
        priority -= 0.05;
        reasoning.push('Sin meta description (-0.05)');
      }
    }
    
    // === AJUSTES BASADOS EN KEYWORDS LOCALES ===
    const localKeywords = ['villa carlos paz', 'córdoba', 'desarrollo web', 'diseño web'];
    const urlLower = url.toLowerCase();
    
    localKeywords.forEach(keyword => {
      if (urlLower.includes(keyword.replace(/\s+/g, '-'))) {
        priority += 0.05;
        reasoning.push(`Keyword local "${keyword}" (+0.05)`);
      }
    });
    
    // Normalizar prioridad (máximo 1.0)
    priority = Math.min(priority, 1.0);
    priority = Math.max(priority, 0.1);
    
    return {
      priority: Math.round(priority * 100) / 100,
      reasoning
    };
  }
  
  static async calculateBlogPriority(contentData) {
    let priority = 0.7; // Base para artículos de blog
    
    if (!contentData) return priority;
    
    // Factores que aumentan prioridad
    const factors = [
      { condition: contentData.wordCount > 2000, bonus: 0.1, reason: 'Artículo extenso' },
      { condition: contentData.wordCount > 1500, bonus: 0.05, reason: 'Buen tamaño' },
      { condition: contentData.headingsCount > 5, bonus: 0.05, reason: 'Buena estructura' },
      { condition: contentData.hasSchema, bonus: 0.05, reason: 'Schema markup' },
      { condition: contentData.imagesCount > 2, bonus: 0.03, reason: 'Imágenes múltiples' },
      { condition: contentData.linksCount > 5, bonus: 0.02, reason: 'Buenos enlaces' }
    ];
    
    factors.forEach(factor => {
      if (factor.condition) {
        priority += factor.bonus;
      }
    });
    
    // Bonificación por recencia (artículos nuevos)
    const daysSinceModified = (Date.now() - new Date(contentData.lastModified)) / (1000 * 60 * 60 * 24);
    if (daysSinceModified < 7) {
      priority += 0.1; // Artículos muy recientes
    } else if (daysSinceModified < 30) {
      priority += 0.05; // Artículos recientes
    }
    
    return Math.min(priority, 0.95); // Máximo para artículos de blog
  }
  
  static determineChangeFrequency(url, contentData, urlType) {
    // Determinar frecuencia basada en tipo y patrón de URL
    const urlLower = url.toLowerCase();
    
    // Frecuencias específicas por tipo
    if (urlType === 'blog_article') {
      // Artículos nuevos cambian más frecuentemente
      if (contentData && contentData.lastModified) {
        const daysSince = (Date.now() - new Date(contentData.lastModified)) / (1000 * 60 * 60 * 24);
        if (daysSince < 30) return 'weekly';
        if (daysSince < 90) return 'monthly';
      }
      return 'yearly';
    }
    
    // Buscar patrones en la URL
    for (const [frequency, patterns] of Object.entries(CONFIG.CHANGE_FREQUENCIES)) {
      if (patterns.some(pattern => urlLower.includes(pattern))) {
        return frequency;
      }
    }
    
    // Páginas principales cambian más frecuentemente
    if (urlType === 'homepage' || urlType === 'service_page') {
      return 'weekly';
    }
    
    return 'monthly';
  }
}

// === GENERADOR DE SITEMAP ===
class IntelligentSitemapGenerator {
  constructor() {
    this.urls = [];
    this.stats = {
      totalUrls: 0,
      byPriority: { high: 0, medium: 0, low: 0 },
      byFrequency: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
      byType: {}
    };
  }
  
  async initialize() {
    console.log('🗺️ Inicializando generador de sitemap inteligente...');
    console.log(`🎯 Sitio: ${CONFIG.SITE_URL}`);
  }
  
  async discoverURLs() {
    console.log('🔍 Descubriendo URLs...');
    
    const urls = new Set();
    
    // URLs principales estáticas
    const mainUrls = [
      { url: '/', type: 'homepage', file: 'index.html' },
      { url: '/contacto', type: 'contact', file: null },
      { url: '/planes', type: 'service_page', file: null },
      { url: '/legal', type: 'legal', file: null },
      { url: '/politicas-privacidad', type: 'legal', file: null },
      { url: '/desarrollo-web-villa-carlos-paz', type: 'service_page', file: null },
      { url: '/diseño-web-villa-carlos-paz', type: 'service_page', file: null },
      { url: '/marketing-digital-villa-carlos-paz', type: 'service_page', file: null },
      { url: '/blog', type: 'blog_index', file: null }
    ];
    
    mainUrls.forEach(urlData => {
      urls.add(JSON.stringify(urlData));
    });
    
    // Artículos del blog
    try {
      const blogFiles = await fs.readdir(CONFIG.BLOG_DIR);
      
      for (const file of blogFiles) {
        if (file.endsWith('.html') && file !== 'index.html') {
          const slug = file.replace('.html', '');
          urls.add(JSON.stringify({
            url: `/blog/${slug}`,
            type: 'blog_article',
            file: path.join(CONFIG.BLOG_DIR, file)
          }));
        }
      }
      
      console.log(`📄 Encontrados ${blogFiles.length} archivos de blog`);
      
    } catch (error) {
      console.warn('⚠️ Error leyendo directorio de blog:', error.message);
    }
    
    // Convertir set a array de objetos
    this.urls = Array.from(urls).map(urlStr => JSON.parse(urlStr));
    
    console.log(`✅ Descubiertas ${this.urls.length} URLs`);
    return this.urls;
  }
  
  async analyzeURLs() {
    console.log('🔍 Analizando contenido de URLs...');
    
    for (let i = 0; i < this.urls.length; i++) {
      const urlData = this.urls[i];
      
      try {
        // Analizar contenido si existe archivo
        let contentData = null;
        if (urlData.file && await fs.access(urlData.file).then(() => true).catch(() => false)) {
          contentData = await ContentAnalyzer.analyzeHTMLContent(urlData.file);
        }
        
        // Calcular prioridad inteligente
        const priorityResult = await PriorityCalculator.calculateIntelligentPriority(
          urlData.url, 
          contentData, 
          urlData.type
        );
        
        // Determinar frecuencia de cambio
        const changefreq = PriorityCalculator.determineChangeFrequency(
          urlData.url, 
          contentData, 
          urlData.type
        );
        
        // Actualizar datos de URL
        urlData.priority = priorityResult.priority;
        urlData.changefreq = changefreq;
        urlData.lastmod = contentData?.lastModified || new Date();
        urlData.analysis = {
          contentData,
          reasoning: priorityResult.reasoning
        };
        
        // Actualizar estadísticas
        this.updateStats(urlData);
        
        console.log(`  ✅ ${urlData.url}: Priority ${priorityResult.priority}, ${changefreq}`);
        
      } catch (error) {
        console.warn(`  ⚠️ Error analizando ${urlData.url}:`, error.message);
        
        // Valores por defecto en caso de error
        urlData.priority = CONFIG.DEFAULT_PRIORITY;
        urlData.changefreq = 'monthly';
        urlData.lastmod = new Date();
      }
    }
    
    // Ordenar por prioridad
    this.urls.sort((a, b) => b.priority - a.priority);
    
    console.log('✅ Análisis de URLs completado');
  }
  
  updateStats(urlData) {
    this.stats.totalUrls++;
    
    // Estadísticas por prioridad
    if (urlData.priority >= 0.8) {
      this.stats.byPriority.high++;
    } else if (urlData.priority >= 0.5) {
      this.stats.byPriority.medium++;
    } else {
      this.stats.byPriority.low++;
    }
    
    // Estadísticas por frecuencia
    this.stats.byFrequency[urlData.changefreq] = (this.stats.byFrequency[urlData.changefreq] || 0) + 1;
    
    // Estadísticas por tipo
    this.stats.byType[urlData.type] = (this.stats.byType[urlData.type] || 0) + 1;
  }
  
  async optimizeSitemapWithAI() {
    if (!model) {
      console.log('⚠️ Gemini no disponible, usando optimizaciones básicas');
      return;
    }
    
    console.log('🧠 Optimizando sitemap con IA...');
    
    // Preparar datos para análisis IA
    const urlSummary = this.urls.slice(0, 20).map(url => ({
      url: url.url,
      type: url.type,
      priority: url.priority,
      changefreq: url.changefreq,
      wordCount: url.analysis?.contentData?.wordCount || 0,
      hasSchema: url.analysis?.contentData?.hasSchema || false
    }));
    
    const prompt = `
Analiza esta estructura de sitemap para el sitio web de desarrollo web hgaruna en Villa Carlos Paz.

URLs del sitemap:
${JSON.stringify(urlSummary, null, 2)}

Estadísticas:
- Total URLs: ${this.stats.totalUrls}
- Alta prioridad: ${this.stats.byPriority.high}
- Media prioridad: ${this.stats.byPriority.medium}
- Baja prioridad: ${this.stats.byPriority.low}

Proporciona recomendaciones para optimizar el sitemap en formato JSON:
{
  "sitemap_analysis": {
    "strengths": ["fortaleza1", "fortaleza2"],
    "weaknesses": ["debilidad1", "debilidad2"],
    "opportunities": ["oportunidad1", "oportunidad2"]
  },
  "priority_adjustments": [
    {
      "url": "/path/example",
      "current_priority": 0.5,
      "suggested_priority": 0.8,
      "reason": "razón del cambio"
    }
  ],
  "frequency_adjustments": [
    {
      "url": "/path/example",
      "current_frequency": "monthly",
      "suggested_frequency": "weekly",
      "reason": "razón del cambio"
    }
  ],
  "missing_urls": [
    {
      "suggested_url": "/nueva/url",
      "reason": "por qué debería incluirse",
      "priority": 0.7,
      "type": "service_page"
    }
  ],
  "seo_recommendations": [
    "recomendación de SEO 1",
    "recomendación de SEO 2"
  ]
}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiRecommendations = JSON.parse(jsonMatch[0]);
        
        // Aplicar ajustes recomendados por IA
        this.applyAIRecommendations(aiRecommendations);
        
        console.log('✅ Optimizaciones IA aplicadas');
        return aiRecommendations;
      }
    } catch (error) {
      console.warn('⚠️ Error en optimización IA:', error.message);
    }
    
    return null;
  }
  
  applyAIRecommendations(recommendations) {
    // Aplicar ajustes de prioridad
    if (recommendations.priority_adjustments) {
      recommendations.priority_adjustments.forEach(adjustment => {
        const url = this.urls.find(u => u.url === adjustment.url);
        if (url && adjustment.suggested_priority) {
          console.log(`🔧 Ajustando prioridad ${url.url}: ${url.priority} → ${adjustment.suggested_priority}`);
          url.priority = adjustment.suggested_priority;
          url.analysis.reasoning.push(`IA: ${adjustment.reason}`);
        }
      });
    }
    
    // Aplicar ajustes de frecuencia
    if (recommendations.frequency_adjustments) {
      recommendations.frequency_adjustments.forEach(adjustment => {
        const url = this.urls.find(u => u.url === adjustment.url);
        if (url && adjustment.suggested_frequency) {
          console.log(`🔧 Ajustando frecuencia ${url.url}: ${url.changefreq} → ${adjustment.suggested_frequency}`);
          url.changefreq = adjustment.suggested_frequency;
          url.analysis.reasoning.push(`IA: ${adjustment.reason}`);
        }
      });
    }
  }
  
  async generateXMLSitemap() {
    console.log('📄 Generando sitemap XML...');
    
    const urlEntries = this.urls.map(url => {
      const lastmod = new Date(url.lastmod).toISOString().split('T')[0];
      
      return `  <url>
    <loc>${CONFIG.SITE_URL}${url.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    }).join('\n');
    
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
    
    const sitemapPath = path.join(CONFIG.OUTPUT_DIR, 'sitemap.xml');
    await fs.writeFile(sitemapPath, xmlContent, 'utf8');
    
    console.log(`✅ Sitemap XML generado: ${sitemapPath}`);
    return sitemapPath;
  }
  
  async generateAdditionalFormats() {
    console.log('📄 Generando formatos adicionales...');
    
    // Sitemap.txt para robots simples
    const txtContent = this.urls
      .map(url => `${CONFIG.SITE_URL}${url.url}`)
      .join('\n');
    
    await fs.writeFile(
      path.join(CONFIG.OUTPUT_DIR, 'sitemap.txt'),
      txtContent,
      'utf8'
    );
    
    // Sitemap JSON para análisis
    const jsonSitemap = {
      generated: new Date().toISOString(),
      site_url: CONFIG.SITE_URL,
      total_urls: this.stats.totalUrls,
      statistics: this.stats,
      urls: this.urls.map(url => ({
        url: url.url,
        type: url.type,
        priority: url.priority,
        changefreq: url.changefreq,
        lastmod: url.lastmod,
        analysis_summary: {
          word_count: url.analysis?.contentData?.wordCount || 0,
          has_schema: url.analysis?.contentData?.hasSchema || false,
          reasoning: url.analysis?.reasoning || []
        }
      }))
    };
    
    await fs.writeFile(
      path.join(CONFIG.OUTPUT_DIR, 'sitemap-analysis.json'),
      JSON.stringify(jsonSitemap, null, 2),
      'utf8'
    );
    
    console.log('✅ Formatos adicionales generados');
  }
  
  printStats() {
    console.log('\n📊 Estadísticas del Sitemap:');
    console.log(`   Total URLs: ${this.stats.totalUrls}`);
    console.log(`   Alta prioridad (≥0.8): ${this.stats.byPriority.high}`);
    console.log(`   Media prioridad (0.5-0.7): ${this.stats.byPriority.medium}`);
    console.log(`   Baja prioridad (<0.5): ${this.stats.byPriority.low}`);
    console.log('\n📅 Por frecuencia de cambio:');
    Object.entries(this.stats.byFrequency).forEach(([freq, count]) => {
      console.log(`   ${freq}: ${count}`);
    });
    console.log('\n🔖 Por tipo de contenido:');
    Object.entries(this.stats.byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  }
  
  async generateSitemap() {
    try {
      await this.initialize();
      await this.discoverURLs();
      await this.analyzeURLs();
      await this.optimizeSitemapWithAI();
      await this.generateXMLSitemap();
      await this.generateAdditionalFormats();
      
      this.printStats();
      
      console.log('\n🎉 Sitemap inteligente generado exitosamente');
      return this.stats.totalUrls;
      
    } catch (error) {
      console.error('❌ Error generando sitemap:', error);
      throw error;
    }
  }
}

// === EJECUCIÓN PRINCIPAL ===
async function main() {
  try {
    const generator = new IntelligentSitemapGenerator();
    const urlCount = await generator.generateSitemap();
    
    console.log(`Sitemap generated with ${urlCount} URLs`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { IntelligentSitemapGenerator, PriorityCalculator, ContentAnalyzer };
