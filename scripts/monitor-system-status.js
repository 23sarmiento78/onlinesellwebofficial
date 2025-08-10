#!/usr/bin/env node

/**
 * 📊 Monitor del Sistema de Generación de Artículos
 * 
 * Script para monitorear el estado del sistema y generar estadísticas
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  BLOG_DIR: path.resolve(__dirname, '../public/blog'),
  CONTENT_DIR: path.resolve(__dirname, '../src/content/articles'),
  REPORTS_DIR: path.resolve(__dirname, '../reports'),
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org'
};

class SystemMonitor {
  constructor() {
    this.stats = {
      totalArticles: 0,
      recentArticles: 0,
      totalWords: 0,
      averageWords: 0,
      categories: {},
      lastGeneration: null,
      systemHealth: 'unknown'
    };
  }

  async initialize() {
    console.log('📊 Iniciando monitor del sistema...');
    await fs.mkdir(CONFIG.REPORTS_DIR, { recursive: true });
  }

  async analyzeArticles() {
    console.log('🔍 Analizando artículos existentes...');
    
    try {
      const files = await fs.readdir(CONFIG.BLOG_DIR);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      this.stats.totalArticles = htmlFiles.length;
      
      let totalWords = 0;
      const categories = {};
      const recentFiles = [];
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      for (const file of htmlFiles) {
        const filePath = path.join(CONFIG.BLOG_DIR, file);
        const stat = await fs.stat(filePath);
        
        // Archivos recientes (últimos 7 días)
        if (stat.mtime.getTime() > sevenDaysAgo) {
          recentFiles.push({
            file,
            date: stat.mtime,
            size: stat.size
          });
        }
        
        // Análisis de contenido
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          const wordCount = this.getWordCount(content);
          totalWords += wordCount;
          
          // Extraer categoría del contenido
          const category = this.extractCategory(content);
          categories[category] = (categories[category] || 0) + 1;
          
        } catch (error) {
          console.warn(`⚠️ Error analizando ${file}: ${error.message}`);
        }
      }
      
      this.stats.totalWords = totalWords;
      this.stats.averageWords = Math.round(totalWords / htmlFiles.length);
      this.stats.categories = categories;
      this.stats.recentArticles = recentFiles.length;
      
      // Encontrar última generación
      if (recentFiles.length > 0) {
        const latest = recentFiles.sort((a, b) => b.date - a.date)[0];
        this.stats.lastGeneration = latest.date.toISOString();
      }
      
      console.log(`✅ Analizados ${htmlFiles.length} artículos`);
      
    } catch (error) {
      console.error(`❌ Error analizando artículos: ${error.message}`);
    }
  }

  async checkSystemHealth() {
    console.log('🏥 Verificando salud del sistema...');
    
    const checks = {
      blogDir: await this.checkDirectory(CONFIG.BLOG_DIR),
      contentDir: await this.checkDirectory(CONFIG.CONTENT_DIR),
      reportsDir: await this.checkDirectory(CONFIG.REPORTS_DIR),
      geminiKey: !!process.env.GEMINI_API_KEY,
      recentActivity: this.stats.recentArticles > 0,
      averageQuality: this.stats.averageWords >= 800
    };
    
    const healthScore = Object.values(checks).filter(Boolean).length / Object.keys(checks).length;
    
    if (healthScore >= 0.9) {
      this.stats.systemHealth = 'excellent';
    } else if (healthScore >= 0.7) {
      this.stats.systemHealth = 'good';
    } else if (healthScore >= 0.5) {
      this.stats.systemHealth = 'fair';
    } else {
      this.stats.systemHealth = 'poor';
    }
    
    return { checks, healthScore };
  }

  async checkDirectory(dirPath) {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async generateReport() {
    const healthData = await this.checkSystemHealth();
    
    const report = {
      timestamp: new Date().toISOString(),
      site_url: CONFIG.SITE_URL,
      
      statistics: this.stats,
      
      health: {
        status: this.stats.systemHealth,
        score: healthData.healthScore,
        checks: healthData.checks
      },
      
      performance: {
        articlesPerWeek: this.stats.recentArticles,
        averageWordCount: this.stats.averageWords,
        contentQuality: this.stats.averageWords >= 1200 ? 'high' : 
                       this.stats.averageWords >= 800 ? 'medium' : 'low',
        categoryDistribution: this.stats.categories
      },
      
      recommendations: this.generateRecommendations()
    };
    
    // Guardar reporte
    const reportPath = path.join(CONFIG.REPORTS_DIR, 'system-status.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.stats.recentArticles === 0) {
      recommendations.push('⚠️ No hay artículos recientes - Ejecutar generación automática');
    }
    
    if (this.stats.averageWords < 800) {
      recommendations.push('📝 Promedio de palabras bajo - Mejorar extensión de artículos');
    }
    
    if (this.stats.totalArticles < 20) {
      recommendations.push('📊 Pocos artículos totales - Aumentar frecuencia de generación');
    }
    
    const topCategory = Object.keys(this.stats.categories)[0];
    const categoryCount = Object.keys(this.stats.categories).length;
    
    if (categoryCount < 3) {
      recommendations.push('🏷️ Poca diversidad de categorías - Generar contenido variado');
    }
    
    if (!process.env.GEMINI_API_KEY) {
      recommendations.push('🔑 GEMINI_API_KEY no configurada - Configurar para generación automática');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ Sistema funcionando óptimamente');
    }
    
    return recommendations;
  }

  getWordCount(content) {
    return content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 0).length;
  }

  extractCategory(content) {
    // Intentar extraer categoría de meta tags o contenido
    const metaMatch = content.match(/<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["']/i);
    if (metaMatch) return metaMatch[1];
    
    // Categorías por keywords en el contenido
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('react') || contentLower.includes('javascript') || contentLower.includes('desarrollo')) {
      return 'desarrollo';
    }
    if (contentLower.includes('seo') || contentLower.includes('marketing')) {
      return 'seo';
    }
    if (contentLower.includes('diseño') || contentLower.includes('ux') || contentLower.includes('ui')) {
      return 'diseno';
    }
    if (contentLower.includes('tecnología') || contentLower.includes('ia') || contentLower.includes('inteligencia')) {
      return 'tecnologia';
    }
    
    return 'general';
  }

  displayReport(report) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 REPORTE DE ESTADO DEL SISTEMA');
    console.log('='.repeat(70));
    
    console.log(`🌐 Sitio: ${report.site_url}`);
    console.log(`📅 Fecha: ${new Date(report.timestamp).toLocaleString('es-AR')}`);
    console.log(`🏥 Estado: ${this.getHealthEmoji(report.health.status)} ${report.health.status.toUpperCase()}`);
    console.log(`📈 Score: ${Math.round(report.health.score * 100)}%`);
    
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(`   📄 Total artículos: ${report.statistics.totalArticles}`);
    console.log(`   📝 Artículos recientes (7 días): ${report.statistics.recentArticles}`);
    console.log(`   📏 Promedio palabras: ${report.statistics.averageWords}`);
    console.log(`   📚 Total palabras: ${report.statistics.totalWords.toLocaleString()}`);
    
    if (report.statistics.lastGeneration) {
      const lastGen = new Date(report.statistics.lastGeneration);
      console.log(`   🕐 Última generación: ${lastGen.toLocaleString('es-AR')}`);
    }
    
    console.log('\n🏷️ CATEGORÍAS:');
    Object.entries(report.statistics.categories)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`   • ${category}: ${count} artículos`);
      });
    
    console.log('\n🔧 VERIFICACIONES:');
    Object.entries(report.health.checks).forEach(([check, status]) => {
      const emoji = status ? '✅' : '❌';
      console.log(`   ${emoji} ${check}: ${status ? 'OK' : 'FALLO'}`);
    });
    
    console.log('\n💡 RECOMENDACIONES:');
    report.recommendations.forEach(rec => {
      console.log(`   ${rec}`);
    });
    
    console.log('\n📈 RENDIMIENTO:');
    console.log(`   📊 Artículos/semana: ${report.performance.articlesPerWeek}`);
    console.log(`   📝 Calidad contenido: ${report.performance.contentQuality}`);
    console.log(`   📏 Promedio palabras: ${report.performance.averageWordCount}`);
    
    console.log('\n📁 REPORTES GUARDADOS EN:');
    console.log(`   ${CONFIG.REPORTS_DIR}/system-status.json`);
    
    console.log('\n' + '='.repeat(70));
  }

  getHealthEmoji(status) {
    const emojis = {
      excellent: '🟢',
      good: '🟡',
      fair: '🟠',
      poor: '🔴',
      unknown: '⚪'
    };
    return emojis[status] || '⚪';
  }

  async execute() {
    try {
      await this.initialize();
      await this.analyzeArticles();
      
      const report = await this.generateReport();
      this.displayReport(report);
      
      return report;
      
    } catch (error) {
      console.error('❌ Error en monitor:', error);
      throw error;
    }
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    const monitor = new SystemMonitor();
    const report = await monitor.execute();
    
    // Exit code basado en salud del sistema
    const exitCode = report.health.score >= 0.7 ? 0 : 1;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SystemMonitor };
