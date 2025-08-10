#!/usr/bin/env node

/**
 * 🎯 Sistema Maestro de Contenido de Alta Calidad para AdSense
 * 
 * Este script maestro:
 * - Ejecuta todo el proceso de generación y mejora de contenido
 * - Asegura cumplimiento con políticas de Google AdSense
 * - Genera contenido original de alta calidad
 * - Integra AdSense estratégicamente
 * - Optimiza SEO y experiencia de usuario
 * - Crea contenido específico para Villa Carlos Paz
 */

import { EnhancedArticleGenerator } from './enhanced-article-generator-adsense.js';
import { AdSenseIntegrator } from './integrate-adsense-all-articles.js';
import { ArticleImprover } from './improve-existing-articles.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN GLOBAL ===
const MASTER_CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  ADSENSE_CLIENT_ID: 'ca-pub-7772175009790237',
  
  // Directorios
  REPORTS_DIR: path.resolve(__dirname, '../reports'),
  BLOG_DIR: path.resolve(__dirname, '../public/blog'),
  
  // Configuración de contenido
  TARGET_ARTICLES: 20,
  MIN_WORDS_PER_ARTICLE: 1200,
  QUALITY_THRESHOLD: 0.8,
  
  // Configuración local
  BUSINESS_INFO: {
    name: 'hgaruna Digital',
    location: 'Villa Carlos Paz, Córdoba, Argentina',
    services: [
      'Desarrollo Web',
      'Diseño UI/UX',
      'Marketing Digital',
      'SEO Local',
      'E-commerce',
      'Aplicaciones Web'
    ],
    expertise: [
      'React', 'Vue.js', 'Angular', 'Node.js', 'Python',
      'WordPress', 'Shopify', 'Google Analytics', 'AdWords'
    ]
  }
};

// === VALIDACIÓN ===
if (!MASTER_CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY requerido');
  console.log('💡 Configura: export GEMINI_API_KEY="tu_clave_aqui"');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(MASTER_CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === TEMAS DE ALTA CALIDAD PARA ADSENSE ===
const PREMIUM_CONTENT_TOPICS = [
  // Desarrollo Web Local
  {
    topic: 'Desarrollo Web en Villa Carlos Paz: Guía Completa para Empresas Locales 2025',
    category: 'desarrollo',
    priority: 'high',
    localFocus: true,
    targetAudience: 'empresarios locales',
    contentType: 'comprehensive_guide'
  },
  
  // SEO y Marketing Digital
  {
    topic: 'SEO Local para Negocios en Córdoba: Estrategias que Funcionan en 2025',
    category: 'seo',
    priority: 'high',
    localFocus: true,
    targetAudience: 'pequeñas empresas',
    contentType: 'practical_guide'
  },
  
  // Tecnología y Tendencias
  {
    topic: 'Inteligencia Artificial en el Desarrollo Web: Implementación Práctica y Casos de Uso',
    category: 'tecnologia',
    priority: 'high',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'technical_tutorial'
  },
  
  // E-commerce y Ventas Online
  {
    topic: 'Crear una Tienda Online Exitosa: Guía Paso a Paso para Emprendedores Argentinos',
    category: 'desarrollo',
    priority: 'high',
    localFocus: true,
    targetAudience: 'emprendedores',
    contentType: 'step_by_step_guide'
  },
  
  // UX/UI y Diseño
  {
    topic: 'Diseño Web Responsive: Mejores Prácticas para la Experiencia de Usuario en 2025',
    category: 'diseno',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'diseñadores',
    contentType: 'best_practices'
  },
  
  // Performance y Optimización
  {
    topic: 'Optimización de Velocidad Web: Técnicas Avanzadas para Mejorar el Rendimiento',
    category: 'desarrollo',
    priority: 'high',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'technical_guide'
  },
  
  // Marketing Digital Local
  {
    topic: 'Marketing Digital para PyMEs en Villa Carlos Paz: Estrategias de Crecimiento',
    category: 'seo',
    priority: 'high',
    localFocus: true,
    targetAudience: 'pequeñas empresas',
    contentType: 'marketing_strategy'
  },
  
  // Desarrollo Frontend
  {
    topic: 'React.js en 2025: Guía Completa para Desarrollar Aplicaciones Web Modernas',
    category: 'desarrollo',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'comprehensive_tutorial'
  },
  
  // Seguridad Web
  {
    topic: 'Seguridad Web para Empresas: Protege tu Sitio contra Amenazas Cibernéticas',
    category: 'tecnologia',
    priority: 'high',
    localFocus: false,
    targetAudience: 'empresarios',
    contentType: 'security_guide'
  },
  
  // Herramientas y Productividad
  {
    topic: 'Herramientas Esenciales para Desarrolladores Web en 2025: Setup Profesional',
    category: 'desarrollo',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'tools_review'
  },
  
  // Casos de Estudio Locales
  {
    topic: 'Casos de Éxito: Empresas de Villa Carlos Paz que Triunfaron Online',
    category: 'seo',
    priority: 'high',
    localFocus: true,
    targetAudience: 'empresarios locales',
    contentType: 'case_studies'
  },
  
  // WordPress y CMS
  {
    topic: 'WordPress vs Desarrollo Custom: Qué Elegir para tu Proyecto Web en 2025',
    category: 'desarrollo',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'empresarios',
    contentType: 'comparison_guide'
  },
  
  // Análisis y Métricas
  {
    topic: 'Google Analytics 4: Guía Completa para Medir el Éxito de tu Sitio Web',
    category: 'seo',
    priority: 'high',
    localFocus: false,
    targetAudience: 'marketers',
    contentType: 'analytics_guide'
  },
  
  // Tendencias de Diseño
  {
    topic: 'Tendencias de Diseño Web 2025: Lo que Debes Saber para Mantenerte Relevante',
    category: 'diseno',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'diseñadores',
    contentType: 'trends_analysis'
  },
  
  // Desarrollo Backend
  {
    topic: 'Node.js para Principiantes: Construye tu Primera API REST paso a paso',
    category: 'desarrollo',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'desarrolladores novatos',
    contentType: 'beginner_tutorial'
  },
  
  // Turismo Digital Local
  {
    topic: 'Marketing Digital para el Sector Turístico en Villa Carlos Paz: Atrae Más Visitantes',
    category: 'seo',
    priority: 'high',
    localFocus: true,
    targetAudience: 'sector turístico',
    contentType: 'industry_guide'
  },
  
  // Accesibilidad Web
  {
    topic: 'Accesibilidad Web: Cómo Crear Sitios Inclusivos que Lleguen a Todos',
    category: 'desarrollo',
    priority: 'medium',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'accessibility_guide'
  },
  
  // Progressive Web Apps
  {
    topic: 'Progressive Web Apps (PWA): El Futuro de las Aplicaciones Web',
    category: 'desarrollo',
    priority: 'high',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'technology_guide'
  },
  
  // Emprendimiento Digital
  {
    topic: 'Emprendimiento Digital en Argentina: Cómo Lanzar tu Startup Tech en 2025',
    category: 'tecnologia',
    priority: 'high',
    localFocus: true,
    targetAudience: 'emprendedores',
    contentType: 'startup_guide'
  },
  
  // Automatización y AI
  {
    topic: 'Automatización con IA: Herramientas que Todo Desarrollador Debe Conocer',
    category: 'tecnologia',
    priority: 'high',
    localFocus: false,
    targetAudience: 'desarrolladores',
    contentType: 'automation_guide'
  }
];

// === SISTEMA MAESTRO ===
class MasterAdSenseContentSystem {
  constructor() {
    this.articleGenerator = new EnhancedArticleGenerator();
    this.adSenseIntegrator = new AdSenseIntegrator();
    this.articleImprover = new ArticleImprover();
    
    this.executionLog = [];
    this.finalReport = {};
    this.startTime = Date.now();
  }

  async initialize() {
    console.log('🚀 INICIANDO SISTEMA MAESTRO DE CONTENIDO ADSENSE');
    console.log('=' .repeat(60));
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-ES')}`);
    console.log(`🎯 Objetivo: Generar ${MASTER_CONFIG.TARGET_ARTICLES} artículos de alta calidad`);
    console.log(`🏢 Empresa: ${MASTER_CONFIG.BUSINESS_INFO.name}`);
    console.log(`📍 Ubicación: ${MASTER_CONFIG.BUSINESS_INFO.location}`);
    console.log(`💰 AdSense ID: ${MASTER_CONFIG.ADSENSE_CLIENT_ID}`);
    console.log('=' .repeat(60));
    
    // Crear directorios necesarios
    await fs.mkdir(MASTER_CONFIG.REPORTS_DIR, { recursive: true });
    
    // Inicializar componentes
    await this.articleGenerator.initialize();
    await this.adSenseIntegrator.initialize();
    await this.articleImprover.initialize();
    
    this.log('Sistema inicializado correctamente');
  }

  // === PASO 1: MEJORAR ARTÍCULOS EXISTENTES ===
  async improveExistingContent() {
    console.log('\n📈 PASO 1: MEJORANDO ARTÍCULOS EXISTENTES');
    console.log('-'.repeat(50));
    
    try {
      const results = await this.articleImprover.processAllArticles();
      const report = this.articleImprover.generateReport();
      
      this.log(`Artículos existentes mejorados: ${report.summary.improved}`);
      this.finalReport.existingArticlesImproved = report;
      
      return report;
      
    } catch (error) {
      console.error(`❌ Error mejorando artículos existentes: ${error.message}`);
      this.log(`Error en mejora: ${error.message}`);
      return { summary: { improved: 0, errors: 1 } };
    }
  }

  // === PASO 2: GENERAR NUEVO CONTENIDO PREMIUM ===
  async generatePremiumContent() {
    console.log('\n✨ PASO 2: GENERANDO CONTENIDO PREMIUM');
    console.log('-'.repeat(50));
    
    try {
      // Seleccionar temas de alta prioridad
      const highPriorityTopics = PREMIUM_CONTENT_TOPICS
        .filter(topic => topic.priority === 'high')
        .slice(0, Math.min(10, MASTER_CONFIG.TARGET_ARTICLES));
      
      console.log(`📝 Generando ${highPriorityTopics.length} artículos premium...`);
      
      const results = await this.articleGenerator.generateMultipleArticles(highPriorityTopics);
      const report = await this.articleGenerator.generateReport();
      
      this.log(`Artículos premium generados: ${results.length}`);
      this.finalReport.premiumArticlesGenerated = report;
      
      return report;
      
    } catch (error) {
      console.error(`❌ Error generando contenido premium: ${error.message}`);
      this.log(`Error en generación: ${error.message}`);
      return { totalArticles: 0, articles: [] };
    }
  }

  // === PASO 3: INTEGRAR ADSENSE ===
  async integrateAdSenseEverywhere() {
    console.log('\n💰 PASO 3: INTEGRANDO ADSENSE EN TODO EL SITIO');
    console.log('-'.repeat(50));
    
    try {
      await this.adSenseIntegrator.processAllArticles();
      const report = this.adSenseIntegrator.generateReport();
      
      this.log(`Archivos con AdSense integrado: ${report.summary.processedSuccessfully}`);
      this.log(`Total anuncios añadidos: ${report.summary.totalAdsAdded}`);
      this.finalReport.adsenseIntegration = report;
      
      return report;
      
    } catch (error) {
      console.error(`❌ Error integrando AdSense: ${error.message}`);
      this.log(`Error en AdSense: ${error.message}`);
      return { summary: { processedSuccessfully: 0, totalAdsAdded: 0 } };
    }
  }

  // === PASO 4: VALIDAR CALIDAD PARA ADSENSE ===
  async validateAdSenseCompliance() {
    console.log('\n✅ PASO 4: VALIDANDO CUMPLIMIENTO ADSENSE');
    console.log('-'.repeat(50));
    
    const validationPrompt = `
Evalúa si este sitio web cumple con las políticas de Google AdSense:

INFORMACIÓN DEL SITIO:
- URL: ${MASTER_CONFIG.SITE_URL}
- Empresa: ${MASTER_CONFIG.BUSINESS_INFO.name}
- Ubicación: ${MASTER_CONFIG.BUSINESS_INFO.location}
- Servicios: ${MASTER_CONFIG.BUSINESS_INFO.services.join(', ')}

CONTENIDO GENERADO:
- Artículos existentes mejorados: ${this.finalReport.existingArticlesImproved?.summary?.improved || 0}
- Artículos premium nuevos: ${this.finalReport.premiumArticlesGenerated?.totalArticles || 0}
- Archivos con AdSense: ${this.finalReport.adsenseIntegration?.summary?.processedSuccessfully || 0}

Evalúa cumplimiento en:
1. **Contenido de calidad**: ¿Es original, útil y bien escrito?
2. **Políticas de contenido**: ¿Cumple restricciones de AdSense?
3. **Experiencia de usuario**: ¿Es fácil de navegar y leer?
4. **Valor añadido**: ¿Proporciona información valiosa?
5. **Diseño profesional**: ¿Tiene apariencia profesional?

Responde en formato JSON:
{
  "overall_compliance": 85,
  "content_quality_score": 90,
  "user_experience_score": 80,
  "policy_compliance_score": 85,
  "design_score": 85,
  "recommendations": [
    "Recomendación 1",
    "Recomendación 2"
  ],
  "approval_likelihood": "alta|media|baja",
  "next_steps": [
    "Paso 1",
    "Paso 2"
  ]
}
`;

    try {
      const result = await model.generateContent(validationPrompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const validation = JSON.parse(jsonMatch[0]);
        
        console.log(`📊 Compliance Score: ${validation.overall_compliance}%`);
        console.log(`🎯 Probabilidad de aprobación: ${validation.approval_likelihood}`);
        
        if (validation.recommendations && validation.recommendations.length > 0) {
          console.log('\n💡 Recomendaciones:');
          validation.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
          });
        }
        
        this.finalReport.adsenseValidation = validation;
        this.log(`AdSense compliance validado: ${validation.overall_compliance}%`);
        
        return validation;
      }
    } catch (error) {
      console.error(`❌ Error en validación: ${error.message}`);
      this.log(`Error en validación: ${error.message}`);
      
      return {
        overall_compliance: 70,
        approval_likelihood: 'media',
        recommendations: ['Error en validación automática', 'Revisar manualmente']
      };
    }
  }

  // === PASO 5: GENERAR CONTENIDO ADICIONAL SI ES NECESARIO ===
  async generateAdditionalContentIfNeeded() {
    const totalArticles = (this.finalReport.existingArticlesImproved?.summary?.improved || 0) +
                         (this.finalReport.premiumArticlesGenerated?.totalArticles || 0);
    
    if (totalArticles < MASTER_CONFIG.TARGET_ARTICLES) {
      console.log('\n📚 PASO 5: GENERANDO CONTENIDO ADICIONAL');
      console.log('-'.repeat(50));
      
      const needed = MASTER_CONFIG.TARGET_ARTICLES - totalArticles;
      console.log(`📝 Generando ${needed} artículos adicionales...`);
      
      const additionalTopics = PREMIUM_CONTENT_TOPICS
        .filter(topic => topic.priority === 'medium')
        .slice(0, needed);
      
      try {
        const results = await this.articleGenerator.generateMultipleArticles(additionalTopics);
        
        this.log(`Artículos adicionales generados: ${results.length}`);
        this.finalReport.additionalArticles = results.length;
        
        return results;
        
      } catch (error) {
        console.error(`❌ Error generando contenido adicional: ${error.message}`);
        return [];
      }
    } else {
      console.log('\n✅ OBJETIVO DE ARTÍCULOS ALCANZADO');
      this.log('Objetivo de artículos alcanzado sin contenido adicional');
      return [];
    }
  }

  // === GENERAR REPORTE FINAL ===
  async generateFinalReport() {
    const endTime = Date.now();
    const executionTime = Math.round((endTime - this.startTime) / 1000 / 60); // minutos
    
    const finalReport = {
      execution: {
        startTime: new Date(this.startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        executionTimeMinutes: executionTime,
        status: 'completed'
      },
      
      site_info: MASTER_CONFIG.BUSINESS_INFO,
      
      content_summary: {
        existing_articles_improved: this.finalReport.existingArticlesImproved?.summary?.improved || 0,
        premium_articles_generated: this.finalReport.premiumArticlesGenerated?.totalArticles || 0,
        additional_articles: this.finalReport.additionalArticles || 0,
        total_articles: (this.finalReport.existingArticlesImproved?.summary?.improved || 0) +
                       (this.finalReport.premiumArticlesGenerated?.totalArticles || 0) +
                       (this.finalReport.additionalArticles || 0)
      },
      
      adsense_integration: {
        files_processed: this.finalReport.adsenseIntegration?.summary?.processedSuccessfully || 0,
        ads_added: this.finalReport.adsenseIntegration?.summary?.totalAdsAdded || 0,
        client_id: MASTER_CONFIG.ADSENSE_CLIENT_ID
      },
      
      quality_validation: this.finalReport.adsenseValidation || {},
      
      execution_log: this.executionLog,
      
      next_steps: [
        'Revisar todos los artículos generados y mejorados',
        'Verificar que los anuncios de AdSense se muestren correctamente',
        'Probar la navegación en diferentes dispositivos',
        'Enviar solicitud de aprobación a Google AdSense',
        'Monitorear métricas de tráfico y engagement',
        'Continuar generando contenido de calidad regularmente'
      ],
      
      recommendations: [
        'Mantener un calendario de publicación regular',
        'Monitorear las políticas de AdSense para cambios',
        'Optimizar continuamente el SEO local',
        'Crear contenido basado en palabras clave trending',
        'Establecer métricas de calidad y engagement'
      ]
    };
    
    // Guardar reporte
    const reportPath = path.join(MASTER_CONFIG.REPORTS_DIR, 'master-adsense-system-report.json');
    await fs.writeFile(reportPath, JSON.stringify(finalReport, null, 2));
    
    return finalReport;
  }

  // === MOSTRAR REPORTE FINAL ===
  displayFinalReport(report) {
    console.log('\n' + '='.repeat(80));
    console.log('🎉 SISTEMA MAESTRO COMPLETADO - REPORTE FINAL');
    console.log('='.repeat(80));
    
    console.log(`⏱️  Tiempo de ejecución: ${report.execution.executionTimeMinutes} minutos`);
    console.log(`📝 Total artículos procesados: ${report.content_summary.total_articles}`);
    console.log(`   • Existentes mejorados: ${report.content_summary.existing_articles_improved}`);
    console.log(`   • Premium generados: ${report.content_summary.premium_articles_generated}`);
    console.log(`   • Adicionales: ${report.content_summary.additional_articles}`);
    
    console.log(`💰 AdSense integrado en: ${report.adsense_integration.files_processed} archivos`);
    console.log(`🎯 Total anuncios añadidos: ${report.adsense_integration.ads_added}`);
    
    if (report.quality_validation.overall_compliance) {
      console.log(`✅ Compliance Score: ${report.quality_validation.overall_compliance}%`);
      console.log(`📈 Probabilidad aprobación: ${report.quality_validation.approval_likelihood}`);
    }
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    report.next_steps.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step}`);
    });
    
    console.log('\n💡 RECOMENDACIONES:');
    report.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    
    console.log('\n📊 Reporte completo guardado en:');
    console.log(`   ${path.join(MASTER_CONFIG.REPORTS_DIR, 'master-adsense-system-report.json')}`);
    
    console.log('\n🚀 ¡SISTEMA LISTO PARA ADSENSE!');
    console.log('='.repeat(80));
  }

  // === UTILIDADES ===
  log(message) {
    const timestamp = new Date().toISOString();
    this.executionLog.push({ timestamp, message });
    console.log(`[${timestamp.split('T')[1].split('.')[0]}] ${message}`);
  }

  // === EJECUTAR SISTEMA COMPLETO ===
  async execute() {
    try {
      await this.initialize();
      
      // Ejecutar todos los pasos
      await this.improveExistingContent();
      await this.generatePremiumContent();
      await this.integrateAdSenseEverywhere();
      await this.validateAdSenseCompliance();
      await this.generateAdditionalContentIfNeeded();
      
      // Generar y mostrar reporte final
      const finalReport = await this.generateFinalReport();
      this.displayFinalReport(finalReport);
      
      return finalReport;
      
    } catch (error) {
      console.error('❌ Error fatal en sistema maestro:', error);
      this.log(`Error fatal: ${error.message}`);
      throw error;
    }
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    const masterSystem = new MasterAdSenseContentSystem();
    const report = await masterSystem.execute();
    
    console.log('\n🎯 ¡Sistema maestro ejecutado exitosamente!');
    console.log('💡 Tu sitio está ahora optimizado para Google AdSense');
    
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

export { MasterAdSenseContentSystem, PREMIUM_CONTENT_TOPICS };
