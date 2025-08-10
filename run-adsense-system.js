#!/usr/bin/env node

/**
 * 🚀 EJECUTOR PRINCIPAL DEL SISTEMA ADSENSE
 * 
 * Script principal que ejecuta todo el sistema de generación y optimización
 * de contenido para Google AdSense de manera ordenada y automática.
 * 
 * USO:
 * node run-adsense-system.js [opciones]
 * 
 * OPCIONES:
 * --full          Ejecuta el sistema completo (por defecto)
 * --generate      Solo genera nuevos artículos
 * --improve       Solo mejora artículos existentes
 * --integrate     Solo integra AdSense
 * --validate      Solo ejecuta validación
 * --test          Modo de prueba (no modifica archivos)
 */

import { MasterAdSenseContentSystem } from './scripts/master-adsense-content-system.js';
import { EnhancedArticleGenerator } from './scripts/enhanced-article-generator-adsense.js';
import { AdSenseIntegrator } from './scripts/integrate-adsense-all-articles.js';
import { ArticleImprover } from './scripts/improve-existing-articles.js';
import { AdSenseValidator } from './scripts/adsense-validation-test.js';

// === CONFIGURACIÓN ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MODE: process.argv.includes('--test') ? 'test' : 'production',
  EXECUTION_MODE: getExecutionMode(),
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org'
};

// === DETERMINAR MODO DE EJECUCIÓN ===
function getExecutionMode() {
  if (process.argv.includes('--generate')) return 'generate';
  if (process.argv.includes('--improve')) return 'improve';
  if (process.argv.includes('--integrate')) return 'integrate';
  if (process.argv.includes('--validate')) return 'validate';
  return 'full'; // Por defecto
}

// === MOSTRAR AYUDA ===
function showHelp() {
  console.log(`
🚀 SISTEMA MAESTRO ADSENSE - hgaruna Digital
============================================

DESCRIPCIÓN:
Sistema completo para generar, mejorar y optimizar contenido
para cumplir con las políticas de Google AdSense.

USO:
node run-adsense-system.js [opciones]

OPCIONES:
--full          Ejecuta el sistema completo (por defecto)
--generate      Solo genera nuevos artículos
--improve       Solo mejora artículos existentes  
--integrate     Solo integra scripts de AdSense
--validate      Solo ejecuta validación final
--test          Modo de prueba (no modifica archivos)
--help          Muestra esta ayuda

EJEMPLOS:
node run-adsense-system.js                    # Sistema completo
node run-adsense-system.js --generate         # Solo generar artículos
node run-adsense-system.js --validate         # Solo validar
node run-adsense-system.js --test --full      # Prueba completa

REQUISITOS:
- GEMINI_API_KEY configurada en variables de entorno
- Node.js 18+
- Conexión a internet para IA

CONFIGURACIÓN:
export GEMINI_API_KEY="tu_clave_aqui"
export SITE_URL="https://tu-sitio.com"

🎯 ¡Sistema listo para crear contenido de calidad para AdSense!
`);
}

// === VALIDAR CONFIGURACIÓN ===
function validateConfig() {
  console.log('🔍 Validando configuración...');
  
  const errors = [];
  
  if (!CONFIG.GEMINI_API_KEY) {
    errors.push('GEMINI_API_KEY no está configurada');
  }
  
  if (CONFIG.GEMINI_API_KEY === '___PRIVATE_KEY___') {
    errors.push('GEMINI_API_KEY tiene valor placeholder');
  }
  
  if (errors.length > 0) {
    console.error('❌ Errores de configuración:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.log('\n💡 Para configurar:');
    console.log('   export GEMINI_API_KEY="tu_clave_gemini_aqui"');
    console.log('   export SITE_URL="https://tu-sitio.com"');
    process.exit(1);
  }
  
  console.log('✅ Configuración válida');
  console.log(`   🤖 Gemini API: Configurada`);
  console.log(`   🌐 Sitio: ${CONFIG.SITE_URL}`);
  console.log(`   🔧 Modo: ${CONFIG.MODE}`);
  console.log(`   ⚡ Ejecución: ${CONFIG.EXECUTION_MODE}`);
}

// === EJECUTOR PRINCIPAL ===
class AdSenseSystemRunner {
  constructor() {
    this.startTime = Date.now();
    this.results = {};
  }

  async showWelcome() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 SISTEMA MAESTRO ADSENSE - HGARUNA DIGITAL');
    console.log('='.repeat(80));
    console.log(`📅 Iniciado: ${new Date().toLocaleString('es-ES')}`);
    console.log(`🎯 Modo: ${CONFIG.EXECUTION_MODE.toUpperCase()}`);
    console.log(`🏢 Sitio: ${CONFIG.SITE_URL}`);
    console.log(`🔧 Entorno: ${CONFIG.MODE}`);
    console.log('='.repeat(80));
    
    if (CONFIG.MODE === 'test') {
      console.log('⚠️ MODO PRUEBA: No se modificarán archivos');
      console.log('-'.repeat(80));
    }
  }

  async executeFullSystem() {
    console.log('\n🚀 EJECUTANDO SISTEMA COMPLETO...');
    
    try {
      const masterSystem = new MasterAdSenseContentSystem();
      const report = await masterSystem.execute();
      
      this.results.fullSystem = report;
      return report;
      
    } catch (error) {
      console.error('❌ Error en sistema completo:', error.message);
      throw error;
    }
  }

  async executeGenerate() {
    console.log('\n✨ GENERANDO NUEVOS ARTÍCULOS...');
    
    try {
      const generator = new EnhancedArticleGenerator();
      await generator.initialize();
      
      // Generar artículos de alta calidad
      const topics = [
        { topic: 'Desarrollo Web en Villa Carlos Paz: Guía 2025', category: 'desarrollo' },
        { topic: 'SEO Local para Negocios en Córdoba', category: 'seo' },
        { topic: 'Marketing Digital para PyMEs Argentinas', category: 'seo' },
        { topic: 'React.js: Desarrollo de Apps Modernas', category: 'desarrollo' },
        { topic: 'Diseño UX/UI: Mejores Prácticas 2025', category: 'diseno' }
      ];
      
      const results = await generator.generateMultipleArticles(topics);
      const report = await generator.generateReport();
      
      this.results.generation = report;
      
      console.log(`✅ Generados ${results.length} artículos nuevos`);
      return report;
      
    } catch (error) {
      console.error('❌ Error generando artículos:', error.message);
      throw error;
    }
  }

  async executeImprove() {
    console.log('\n📈 MEJORANDO ARTÍCULOS EXISTENTES...');
    
    try {
      const improver = new ArticleImprover();
      await improver.initialize();
      
      await improver.processAllArticles();
      const report = improver.generateReport();
      
      this.results.improvement = report;
      
      console.log(`✅ Mejorados ${report.summary.improved} artículos`);
      return report;
      
    } catch (error) {
      console.error('❌ Error mejorando artículos:', error.message);
      throw error;
    }
  }

  async executeIntegrate() {
    console.log('\n💰 INTEGRANDO ADSENSE...');
    
    try {
      const integrator = new AdSenseIntegrator();
      await integrator.initialize();
      
      await integrator.processAllArticles();
      const report = integrator.generateReport();
      
      this.results.integration = report;
      
      console.log(`✅ AdSense integrado en ${report.summary.processedSuccessfully} archivos`);
      return report;
      
    } catch (error) {
      console.error('❌ Error integrando AdSense:', error.message);
      throw error;
    }
  }

  async executeValidate() {
    console.log('\n🧪 VALIDANDO CUMPLIMIENTO ADSENSE...');
    
    try {
      const validator = new AdSenseValidator();
      const report = await validator.execute();
      
      this.results.validation = report;
      
      const score = report.validation_summary.overall_score;
      const ready = report.validation_summary.ready_for_adsense;
      
      console.log(`✅ Validación completada: ${score}% - ${ready ? 'LISTO' : 'NECESITA MEJORAS'}`);
      return report;
      
    } catch (error) {
      console.error('❌ Error en validación:', error.message);
      throw error;
    }
  }

  async execute() {
    try {
      await this.showWelcome();
      
      let finalReport;
      
      switch (CONFIG.EXECUTION_MODE) {
        case 'full':
          finalReport = await this.executeFullSystem();
          break;
          
        case 'generate':
          finalReport = await this.executeGenerate();
          break;
          
        case 'improve':
          finalReport = await this.executeImprove();
          break;
          
        case 'integrate':
          finalReport = await this.executeIntegrate();
          break;
          
        case 'validate':
          finalReport = await this.executeValidate();
          break;
          
        default:
          throw new Error(`Modo de ejecución desconocido: ${CONFIG.EXECUTION_MODE}`);
      }
      
      await this.showFinalSummary(finalReport);
      
      return finalReport;
      
    } catch (error) {
      console.error('\n❌ ERROR FATAL:', error.message);
      console.log('\n🆘 Si el problema persiste:');
      console.log('   1. Verifica tu GEMINI_API_KEY');
      console.log('   2. Revisa la conexión a internet');
      console.log('   3. Ejecuta: node run-adsense-system.js --help');
      
      process.exit(1);
    }
  }

  async showFinalSummary(report) {
    const endTime = Date.now();
    const duration = Math.round((endTime - this.startTime) / 1000 / 60);
    
    console.log('\n' + '='.repeat(80));
    console.log('🎉 EJECUCIÓN COMPLETADA');
    console.log('='.repeat(80));
    
    console.log(`⏱️  Duración: ${duration} minutos`);
    console.log(`🎯 Modo ejecutado: ${CONFIG.EXECUTION_MODE}`);
    console.log(`📊 Estado: ${report ? 'ÉXITO' : 'ERROR'}`);
    
    if (CONFIG.EXECUTION_MODE === 'full' && report) {
      console.log('\n📈 RESUMEN COMPLETO:');
      console.log(`   📝 Artículos generados: ${report.content_summary?.premium_articles_generated || 0}`);
      console.log(`   🔧 Artículos mejorados: ${report.content_summary?.existing_articles_improved || 0}`);
      console.log(`   💰 Archivos con AdSense: ${report.adsense_integration?.files_processed || 0}`);
      console.log(`   ✅ Score de calidad: ${report.quality_validation?.overall_compliance || 'N/A'}%`);
    }
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('   1. Revisar los reportes generados en /reports/');
    console.log('   2. Verificar que AdSense se muestre correctamente');
    console.log('   3. Probar en dispositivos móviles');
    console.log('   4. Aplicar a Google AdSense cuando esté listo');
    console.log('   5. Monitorear métricas y performance');
    
    console.log('\n📁 ARCHIVOS GENERADOS:');
    console.log('   • Artículos nuevos: /public/blog/');
    console.log('   • Artículos mejorados: /public/blog-improved/');
    console.log('   • Reportes: /reports/');
    console.log('   • Backups: /backups/');
    
    console.log('\n💡 CONSEJOS:');
    console.log('   • Mantén contenido fresco y actualizado');
    console.log('   • Monitorea las políticas de AdSense');
    console.log('   • Optimiza basado en métricas de usuario');
    console.log('   • Genera contenido regularmente');
    
    console.log('\n🚀 ¡SISTEMA ADSENSE LISTO!');
    console.log('='.repeat(80));
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  // Manejar argumentos de ayuda
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  // Validar configuración
  validateConfig();
  
  // Ejecutar sistema
  const runner = new AdSenseSystemRunner();
  await runner.execute();
}

// === MANEJO DE ERRORES Y SEÑALES ===
process.on('uncaughtException', (error) => {
  console.error('\n💥 Error no capturado:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n💥 Promesa rechazada:', reason);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n⏹️ Ejecución interrumpida por usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Ejecución terminada');
  process.exit(0);
});

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export default AdSenseSystemRunner;
