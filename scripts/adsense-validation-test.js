#!/usr/bin/env node

/**
 * 🧪 Sistema de Validación y Testing para AdSense
 * 
 * Este script:
 * - Valida que todos los artículos cumplan políticas de AdSense
 * - Verifica la integración correcta de scripts
 * - Analiza calidad de contenido
 * - Simula el proceso de revisión de Google
 * - Genera reporte de cumplimiento
 * - Sugiere mejoras específicas
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
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  ADSENSE_CLIENT_ID: 'ca-pub-7772175009790237',
  
  // Directorios a validar
  VALIDATION_DIRS: [
    path.resolve(__dirname, '../public/blog'),
    path.resolve(__dirname, '../public'),
    path.resolve(__dirname, '../ebooks')
  ],
  
  REPORTS_DIR: path.resolve(__dirname, '../reports'),
  
  // Criterios de validación
  QUALITY_CRITERIA: {
    MIN_WORD_COUNT: 300,
    IDEAL_WORD_COUNT: 800,
    MAX_AD_DENSITY: 0.3, // 30% máximo de contenido publicitario
    MIN_CONTENT_QUALITY: 0.7,
    REQUIRED_ELEMENTS: ['title', 'meta_description', 'headers', 'structured_content']
  },
  
  // Políticas de AdSense que verificar
  ADSENSE_POLICIES: [
    'content_quality',
    'original_content',
    'user_experience',
    'navigation_clarity',
    'content_value',
    'policy_compliance',
    'technical_requirements'
  ]
};

// === VALIDACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY requerido');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === VALIDADOR ADSENSE ===
class AdSenseValidator {
  constructor() {
    this.validationResults = [];
    this.overallScore = 0;
    this.criticalIssues = [];
    this.warnings = [];
    this.recommendations = [];
    this.statistics = {
      totalFiles: 0,
      passedValidation: 0,
      failedValidation: 0,
      averageWordCount: 0,
      averageQualityScore: 0
    };
  }

  async initialize() {
    console.log('🧪 Inicializando validador de AdSense...');
    console.log(`🎯 Cliente ID: ${CONFIG.ADSENSE_CLIENT_ID}`);
    console.log(`📊 Criterios de calidad configurados`);
    
    await fs.mkdir(CONFIG.REPORTS_DIR, { recursive: true });
  }

  // === VALIDAR ARCHIVO INDIVIDUAL ===
  async validateFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`📄 Validando: ${fileName}`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Análisis técnico básico
      const technicalAnalysis = this.analyzeTechnicalCompliance(content);
      
      // Análisis de contenido con IA
      const contentAnalysis = await this.analyzeContentQuality(content, fileName);
      
      // Análisis de AdSense específico
      const adsenseAnalysis = this.analyzeAdSenseIntegration(content);
      
      // Combinar resultados
      const validation = {
        file: fileName,
        path: filePath,
        technical: technicalAnalysis,
        content: contentAnalysis,
        adsense: adsenseAnalysis,
        overallScore: this.calculateOverallScore(technicalAnalysis, contentAnalysis, adsenseAnalysis),
        passed: false,
        issues: [],
        recommendations: []
      };
      
      // Determinar si pasa la validación
      validation.passed = validation.overallScore >= CONFIG.QUALITY_CRITERIA.MIN_CONTENT_QUALITY;
      
      // Generar issues y recomendaciones
      this.generateIssuesAndRecommendations(validation);
      
      this.validationResults.push(validation);
      this.updateStatistics(validation);
      
      const status = validation.passed ? '✅' : '❌';
      const score = Math.round(validation.overallScore * 100);
      console.log(`  ${status} Score: ${score}% (${validation.technical.wordCount} palabras)`);
      
      if (validation.issues.length > 0) {
        console.log(`  ⚠️ Issues: ${validation.issues.length}`);
      }
      
      return validation;
      
    } catch (error) {
      console.error(`  ❌ Error validando ${fileName}: ${error.message}`);
      
      const errorValidation = {
        file: fileName,
        path: filePath,
        error: error.message,
        passed: false,
        overallScore: 0
      };
      
      this.validationResults.push(errorValidation);
      return errorValidation;
    }
  }

  // === ANÁLISIS TÉCNICO ===
  analyzeTechnicalCompliance(content) {
    const analysis = {
      wordCount: this.getWordCount(content),
      hasTitle: /<title[^>]*>/.test(content),
      hasMetaDescription: /<meta[^>]*name=["']description["'][^>]*>/.test(content),
      hasMetaKeywords: /<meta[^>]*name=["']keywords["'][^>]*>/.test(content),
      hasHeaders: /<h[1-6][^>]*>/.test(content),
      hasStructuredContent: this.hasStructuredContent(content),
      hasImages: /<img[^>]*>/.test(content),
      hasLinks: /<a[^>]*href/.test(content),
      hasCanonical: /<link[^>]*rel=["']canonical["']/.test(content),
      mobileResponsive: /viewport.*width=device-width/.test(content),
      hasSchema: /application\/ld\+json/.test(content),
      loadingSpeed: this.estimateLoadingSpeed(content)
    };
    
    // Calcular score técnico
    const technicalChecks = [
      analysis.hasTitle,
      analysis.hasMetaDescription,
      analysis.hasHeaders,
      analysis.hasStructuredContent,
      analysis.mobileResponsive,
      analysis.wordCount >= CONFIG.QUALITY_CRITERIA.MIN_WORD_COUNT
    ];
    
    analysis.score = technicalChecks.filter(check => check).length / technicalChecks.length;
    
    return analysis;
  }

  // === ANÁLISIS DE CONTENIDO CON IA ===
  async analyzeContentQuality(content, fileName) {
    const contentText = this.extractTextContent(content);
    
    const qualityPrompt = `
Analiza la calidad de este contenido web para cumplir con las políticas de Google AdSense:

ARCHIVO: ${fileName}
CONTENIDO (primeros 1000 caracteres):
${contentText.substring(0, 1000)}...

TOTAL PALABRAS: ${this.getWordCount(content)}

Evalúa según políticas de AdSense:

1. **Originalidad** (0-100): ¿Es contenido único y original?
2. **Valor educativo** (0-100): ¿Proporciona información útil al usuario?
3. **Calidad de escritura** (0-100): ¿Está bien escrito y estructurado?
4. **Relevancia** (0-100): ¿Es relevante para la audiencia objetivo?
5. **Completitud** (0-100): ¿Cubre el tema de manera completa?
6. **Engagement** (0-100): ¿Es interesante y mantiene la atención?
7. **Profesionalismo** (0-100): ¿Tiene apariencia y tono profesional?

POLÍTICAS DE ADSENSE A VERIFICAR:
- ¿Cumple con políticas de contenido de AdSense?
- ¿No contiene contenido prohibido?
- ¿Proporciona valor real a los usuarios?
- ¿Es contenido sustancial (no páginas en construcción)?

Responde en formato JSON:
{
  "originality": 85,
  "educational_value": 90,
  "writing_quality": 88,
  "relevance": 92,
  "completeness": 80,
  "engagement": 85,
  "professionalism": 90,
  "overall_quality": 87,
  "adsense_compliance": 85,
  "policy_issues": [],
  "content_strengths": ["strength1", "strength2"],
  "improvement_areas": ["area1", "area2"],
  "adsense_ready": true,
  "feedback": "Comentario general sobre la calidad"
}
`;

    try {
      const result = await model.generateContent(qualityPrompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiAnalysis = JSON.parse(jsonMatch[0]);
        
        // Normalizar scores a 0-1
        Object.keys(aiAnalysis).forEach(key => {
          if (typeof aiAnalysis[key] === 'number' && aiAnalysis[key] > 1) {
            aiAnalysis[key] = aiAnalysis[key] / 100;
          }
        });
        
        return aiAnalysis;
      }
    } catch (error) {
      console.warn(`⚠️ Error en análisis IA para ${fileName}: ${error.message}`);
    }
    
    // Análisis básico si falla la IA
    return {
      overall_quality: 0.6,
      adsense_compliance: 0.6,
      policy_issues: ['Error en análisis IA'],
      adsense_ready: false,
      feedback: 'Requiere revisión manual'
    };
  }

  // === ANÁLISIS DE INTEGRACIÓN ADSENSE ===
  analyzeAdSenseIntegration(content) {
    const analysis = {
      hasAdSenseScript: content.includes('googlesyndication.com'),
      hasCorrectClientId: content.includes(CONFIG.ADSENSE_CLIENT_ID),
      adUnitCount: (content.match(/adsbygoogle/g) || []).length,
      hasAdSenseAccount: content.includes('google-adsense-account'),
      hasAsyncLoading: content.includes('async src='),
      hasCrossOrigin: content.includes('crossorigin="anonymous"'),
      hasLazyLoading: content.includes('data-ad-format'),
      responsiveAds: content.includes('data-full-width-responsive="true"'),
      adDensity: 0
    };
    
    // Calcular densidad de anuncios
    const contentLength = this.getWordCount(content);
    if (contentLength > 0) {
      analysis.adDensity = analysis.adUnitCount / (contentLength / 100); // anuncios por cada 100 palabras
    }
    
    // Verificar densidad apropiada
    analysis.appropriateAdDensity = analysis.adDensity <= CONFIG.QUALITY_CRITERIA.MAX_AD_DENSITY;
    
    // Score de integración AdSense
    const adsenseChecks = [
      analysis.hasAdSenseScript,
      analysis.hasCorrectClientId,
      analysis.adUnitCount > 0,
      analysis.hasAsyncLoading,
      analysis.appropriateAdDensity,
      analysis.responsiveAds
    ];
    
    analysis.score = adsenseChecks.filter(check => check).length / adsenseChecks.length;
    
    return analysis;
  }

  // === CALCULAR SCORE GENERAL ===
  calculateOverallScore(technical, content, adsense) {
    const weights = {
      technical: 0.3,
      content: 0.5,
      adsense: 0.2
    };
    
    return (technical.score * weights.technical) +
           (content.overall_quality * weights.content) +
           (adsense.score * weights.adsense);
  }

  // === GENERAR ISSUES Y RECOMENDACIONES ===
  generateIssuesAndRecommendations(validation) {
    const { technical, content, adsense } = validation;
    
    // Issues técnicos
    if (!technical.hasTitle) {
      validation.issues.push('Falta etiqueta <title>');
      validation.recommendations.push('Añadir título optimizado para SEO');
    }
    
    if (!technical.hasMetaDescription) {
      validation.issues.push('Falta meta descripción');
      validation.recommendations.push('Añadir meta descripción de 150-160 caracteres');
    }
    
    if (technical.wordCount < CONFIG.QUALITY_CRITERIA.MIN_WORD_COUNT) {
      validation.issues.push(`Contenido muy corto (${technical.wordCount} palabras)`);
      validation.recommendations.push(`Expandir a mínimo ${CONFIG.QUALITY_CRITERIA.MIN_WORD_COUNT} palabras`);
    }
    
    if (!technical.hasHeaders) {
      validation.issues.push('Falta estructura de headers (H2, H3)');
      validation.recommendations.push('Añadir headers para mejorar estructura');
    }
    
    if (!technical.mobileResponsive) {
      validation.issues.push('No es responsive');
      validation.recommendations.push('Añadir viewport meta tag');
    }
    
    // Issues de contenido
    if (content.overall_quality < 0.7) {
      validation.issues.push('Calidad de contenido baja');
      validation.recommendations.push('Mejorar calidad y valor educativo del contenido');
    }
    
    if (content.policy_issues && content.policy_issues.length > 0) {
      validation.issues.push(...content.policy_issues);
    }
    
    if (!content.adsense_ready) {
      validation.issues.push('No cumple políticas de AdSense');
      validation.recommendations.push('Revisar y mejorar contenido según políticas de AdSense');
    }
    
    // Issues de AdSense
    if (!adsense.hasAdSenseScript) {
      validation.issues.push('Falta script de AdSense');
      validation.recommendations.push('Integrar script principal de AdSense');
    }
    
    if (!adsense.hasCorrectClientId) {
      validation.issues.push('ID de cliente AdSense incorrecto');
      validation.recommendations.push(`Verificar que usa ${CONFIG.ADSENSE_CLIENT_ID}`);
    }
    
    if (adsense.adUnitCount === 0) {
      validation.issues.push('No tiene unidades de anuncio');
      validation.recommendations.push('Añadir unidades de anuncio estratégicamente');
    }
    
    if (!adsense.appropriateAdDensity) {
      validation.issues.push('Densidad de anuncios muy alta');
      validation.recommendations.push('Reducir número de anuncios para mejor UX');
    }
    
    if (!adsense.responsiveAds) {
      validation.issues.push('Anuncios no son responsive');
      validation.recommendations.push('Configurar anuncios responsivos');
    }
    
    // Clasificar severity
    if (validation.issues.length >= 5) {
      this.criticalIssues.push(`${validation.file}: ${validation.issues.length} issues críticos`);
    } else if (validation.issues.length > 0) {
      this.warnings.push(`${validation.file}: ${validation.issues.length} warnings`);
    }
  }

  // === VALIDAR TODOS LOS ARCHIVOS ===
  async validateAllFiles() {
    console.log('🔍 Buscando archivos para validar...');
    
    const allFiles = [];
    
    for (const dir of CONFIG.VALIDATION_DIRS) {
      try {
        const files = await glob('**/*.html', { 
          cwd: dir,
          ignore: ['**/backup/**', '**/backups/**', '**/node_modules/**']
        });
        
        allFiles.push(...files.map(file => path.join(dir, file)));
      } catch (error) {
        console.warn(`⚠️ Error accediendo a ${dir}: ${error.message}`);
      }
    }
    
    console.log(`📄 Encontrados ${allFiles.length} archivos HTML`);
    
    if (allFiles.length === 0) {
      console.log('⚠️ No se encontraron archivos para validar');
      return;
    }
    
    // Validar cada archivo
    const results = [];
    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      console.log(`\n[${i + 1}/${allFiles.length}] ${path.relative(process.cwd(), file)}`);
      
      const validation = await this.validateFile(file);
      results.push(validation);
      
      // Pausa pequeña para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }

  // === UTILIDADES ===
  getWordCount(content) {
    const textContent = this.extractTextContent(content);
    return textContent.split(/\s+/).filter(word => word.length > 0).length;
  }

  extractTextContent(html) {
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  hasStructuredContent(content) {
    const hasLists = /<[uo]l[^>]*>/.test(content);
    const hasParagraphs = /<p[^>]*>/.test(content);
    const hasHeaders = /<h[2-6][^>]*>/.test(content);
    
    return hasLists && hasParagraphs && hasHeaders;
  }

  estimateLoadingSpeed(content) {
    const contentSize = Buffer.byteLength(content, 'utf8');
    const imageCount = (content.match(/<img[^>]*>/g) || []).length;
    const scriptCount = (content.match(/<script[^>]*>/g) || []).length;
    
    // Estimación simple: tamaño + penalización por recursos
    const estimatedKB = (contentSize / 1024) + (imageCount * 50) + (scriptCount * 20);
    
    if (estimatedKB < 100) return 'fast';
    if (estimatedKB < 300) return 'medium';
    return 'slow';
  }

  updateStatistics(validation) {
    this.statistics.totalFiles++;
    
    if (validation.passed) {
      this.statistics.passedValidation++;
    } else {
      this.statistics.failedValidation++;
    }
    
    if (validation.technical && validation.technical.wordCount) {
      this.statistics.averageWordCount = (
        (this.statistics.averageWordCount * (this.statistics.totalFiles - 1)) +
        validation.technical.wordCount
      ) / this.statistics.totalFiles;
    }
    
    if (validation.overallScore) {
      this.statistics.averageQualityScore = (
        (this.statistics.averageQualityScore * (this.statistics.totalFiles - 1)) +
        validation.overallScore
      ) / this.statistics.totalFiles;
    }
  }

  // === GENERAR REPORTE FINAL ===
  generateFinalReport() {
    // Calcular score general del sitio
    this.overallScore = this.statistics.averageQualityScore;
    
    const report = {
      validation_summary: {
        timestamp: new Date().toISOString(),
        site_url: CONFIG.SITE_URL,
        adsense_client_id: CONFIG.ADSENSE_CLIENT_ID,
        overall_score: Math.round(this.overallScore * 100),
        ready_for_adsense: this.overallScore >= CONFIG.QUALITY_CRITERIA.MIN_CONTENT_QUALITY,
        confidence_level: this.getConfidenceLevel()
      },
      
      statistics: {
        ...this.statistics,
        averageWordCount: Math.round(this.statistics.averageWordCount),
        averageQualityScore: Math.round(this.statistics.averageQualityScore * 100),
        pass_rate: Math.round((this.statistics.passedValidation / this.statistics.totalFiles) * 100)
      },
      
      issues_summary: {
        critical_issues: this.criticalIssues.length,
        warnings: this.warnings.length,
        total_issues: this.validationResults.reduce((sum, v) => sum + (v.issues?.length || 0), 0)
      },
      
      validation_results: this.validationResults,
      
      recommendations: this.generateGlobalRecommendations(),
      
      next_steps: this.generateNextSteps(),
      
      adsense_readiness: {
        technical_compliance: this.calculateTechnicalCompliance(),
        content_quality: this.calculateContentQuality(),
        policy_compliance: this.calculatePolicyCompliance(),
        overall_readiness: this.overallScore >= 0.8 ? 'ready' : 
                          this.overallScore >= 0.6 ? 'needs_improvement' : 'not_ready'
      }
    };
    
    return report;
  }

  getConfidenceLevel() {
    if (this.overallScore >= 0.9) return 'muy_alta';
    if (this.overallScore >= 0.8) return 'alta';
    if (this.overallScore >= 0.7) return 'media';
    if (this.overallScore >= 0.5) return 'baja';
    return 'muy_baja';
  }

  calculateTechnicalCompliance() {
    const technicalScores = this.validationResults
      .filter(v => v.technical)
      .map(v => v.technical.score);
    
    if (technicalScores.length === 0) return 0;
    
    return technicalScores.reduce((sum, score) => sum + score, 0) / technicalScores.length;
  }

  calculateContentQuality() {
    const contentScores = this.validationResults
      .filter(v => v.content && v.content.overall_quality)
      .map(v => v.content.overall_quality);
    
    if (contentScores.length === 0) return 0;
    
    return contentScores.reduce((sum, score) => sum + score, 0) / contentScores.length;
  }

  calculatePolicyCompliance() {
    const policyScores = this.validationResults
      .filter(v => v.content && v.content.adsense_compliance)
      .map(v => v.content.adsense_compliance);
    
    if (policyScores.length === 0) return 0;
    
    return policyScores.reduce((sum, score) => sum + score, 0) / policyScores.length;
  }

  generateGlobalRecommendations() {
    const recommendations = [];
    
    // Recomendaciones basadas en estadísticas
    if (this.statistics.averageWordCount < CONFIG.QUALITY_CRITERIA.IDEAL_WORD_COUNT) {
      recommendations.push(`Expandir contenido: promedio actual ${Math.round(this.statistics.averageWordCount)} palabras, ideal ${CONFIG.QUALITY_CRITERIA.IDEAL_WORD_COUNT}+`);
    }
    
    if (this.statistics.passedValidation / this.statistics.totalFiles < 0.8) {
      recommendations.push('Mejorar calidad general: menos del 80% de archivos pasan validación');
    }
    
    if (this.criticalIssues.length > 0) {
      recommendations.push(`Resolver ${this.criticalIssues.length} issues críticos antes de aplicar a AdSense`);
    }
    
    // Recomendaciones específicas más comunes
    const commonIssues = {};
    this.validationResults.forEach(v => {
      if (v.issues) {
        v.issues.forEach(issue => {
          commonIssues[issue] = (commonIssues[issue] || 0) + 1;
        });
      }
    });
    
    Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([issue, count]) => {
        recommendations.push(`${issue} (afecta ${count} archivos)`);
      });
    
    return recommendations;
  }

  generateNextSteps() {
    const steps = [];
    
    if (this.overallScore < 0.7) {
      steps.push('1. Mejorar calidad de contenido antes de aplicar a AdSense');
      steps.push('2. Resolver todos los issues críticos identificados');
      steps.push('3. Expandir contenido de artículos cortos');
      steps.push('4. Re-ejecutar validación hasta alcanzar 80%+ score');
    } else if (this.overallScore < 0.8) {
      steps.push('1. Resolver warnings restantes');
      steps.push('2. Optimizar elementos técnicos (meta tags, headers)');
      steps.push('3. Verificar integración correcta de AdSense');
      steps.push('4. Preparar aplicación a AdSense');
    } else {
      steps.push('1. ✅ Sitio listo para aplicar a Google AdSense');
      steps.push('2. Enviar aplicación a AdSense con confianza');
      steps.push('3. Monitorear métricas post-aprobación');
      steps.push('4. Continuar manteniendo calidad de contenido');
    }
    
    return steps;
  }

  displayResults(report) {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 REPORTE DE VALIDACIÓN ADSENSE');
    console.log('='.repeat(80));
    
    console.log(`📊 Score General: ${report.validation_summary.overall_score}%`);
    console.log(`🎯 Listo para AdSense: ${report.validation_summary.ready_for_adsense ? '✅ SÍ' : '❌ NO'}`);
    console.log(`📈 Nivel de confianza: ${report.validation_summary.confidence_level}`);
    
    console.log('\n📈 ESTADÍSTICAS:');
    console.log(`   📄 Archivos analizados: ${report.statistics.totalFiles}`);
    console.log(`   ✅ Pasaron validación: ${report.statistics.passedValidation} (${report.statistics.pass_rate}%)`);
    console.log(`   ❌ Fallaron validación: ${report.statistics.failedValidation}`);
    console.log(`   📝 Promedio palabras: ${report.statistics.averageWordCount}`);
    console.log(`   🏆 Promedio calidad: ${report.statistics.averageQualityScore}%`);
    
    console.log('\n⚠️ ISSUES:');
    console.log(`   🔴 Críticos: ${report.issues_summary.critical_issues}`);
    console.log(`   🟡 Warnings: ${report.issues_summary.warnings}`);
    console.log(`   📋 Total issues: ${report.issues_summary.total_issues}`);
    
    console.log('\n🎯 PREPARACIÓN ADSENSE:');
    console.log(`   🔧 Cumplimiento técnico: ${Math.round(report.adsense_readiness.technical_compliance * 100)}%`);
    console.log(`   📝 Calidad contenido: ${Math.round(report.adsense_readiness.content_quality * 100)}%`);
    console.log(`   📋 Cumplimiento políticas: ${Math.round(report.adsense_readiness.policy_compliance * 100)}%`);
    console.log(`   🚀 Estado general: ${report.adsense_readiness.overall_readiness}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMENDACIONES PRINCIPALES:');
      report.recommendations.slice(0, 5).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    report.next_steps.forEach(step => {
      console.log(`   ${step}`);
    });
    
    console.log('\n📁 Reporte completo guardado en:');
    console.log(`   ${path.join(CONFIG.REPORTS_DIR, 'adsense-validation-report.json')}`);
    
    console.log('\n' + '='.repeat(80));
  }

  async saveReport(report) {
    const reportPath = path.join(CONFIG.REPORTS_DIR, 'adsense-validation-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // También generar CSV para análisis
    const csvPath = path.join(CONFIG.REPORTS_DIR, 'validation-results.csv');
    const csvContent = this.generateCSV();
    await fs.writeFile(csvPath, csvContent);
    
    console.log(`💾 Reportes guardados en ${CONFIG.REPORTS_DIR}`);
  }

  generateCSV() {
    const headers = 'File,Overall Score,Word Count,Technical Score,Content Quality,AdSense Score,Passed,Issues Count,Status';
    
    const rows = this.validationResults.map(v => {
      const wordCount = v.technical?.wordCount || 0;
      const technicalScore = Math.round((v.technical?.score || 0) * 100);
      const contentQuality = Math.round((v.content?.overall_quality || 0) * 100);
      const adsenseScore = Math.round((v.adsense?.score || 0) * 100);
      const overallScore = Math.round(v.overallScore * 100);
      const issuesCount = v.issues?.length || 0;
      const status = v.passed ? 'PASS' : 'FAIL';
      
      return `"${v.file}",${overallScore},${wordCount},${technicalScore},${contentQuality},${adsenseScore},${v.passed},${issuesCount},${status}`;
    });
    
    return [headers, ...rows].join('\n');
  }

  async execute() {
    try {
      await this.initialize();
      
      // Validar todos los archivos
      await this.validateAllFiles();
      
      // Generar reporte final
      const report = this.generateFinalReport();
      
      // Mostrar resultados
      this.displayResults(report);
      
      // Guardar reporte
      await this.saveReport(report);
      
      return report;
      
    } catch (error) {
      console.error('❌ Error en validación:', error);
      throw error;
    }
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    console.log('🧪 Iniciando validación completa para AdSense...');
    
    const validator = new AdSenseValidator();
    const report = await validator.execute();
    
    // Determinar código de salida
    const exitCode = report.validation_summary.ready_for_adsense ? 0 : 1;
    
    console.log('\n🎯 Validación completada');
    if (exitCode === 0) {
      console.log('✅ Sitio LISTO para aplicar a Google AdSense');
    } else {
      console.log('⚠️ Sitio necesita mejoras antes de aplicar a AdSense');
    }
    
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Error fatal en validación:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AdSenseValidator };
