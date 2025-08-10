#!/usr/bin/env node

/**
 * 🔍 Verificador de Integración Automática
 * 
 * Verifica que los artículos nuevos se hayan integrado correctamente
 * en el sitemap y el índice del blog
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  BLOG_DIR: path.resolve(__dirname, '../public/blog'),
  SITEMAP_PATH: path.resolve(__dirname, '../public/sitemap.xml'),
  INDEX_PATH: path.resolve(__dirname, '../public/blog/index.json')
};

class IntegrationVerifier {
  constructor() {
    this.issues = [];
    this.stats = {
      totalArticles: 0,
      inIndex: 0,
      inSitemap: 0,
      recent: 0
    };
  }

  async verifyIntegration() {
    console.log('🔍 Verificando integración automática...');
    
    try {
      // 1. Verificar artículos en el directorio
      await this.checkBlogDirectory();
      
      // 2. Verificar índice del blog
      await this.checkBlogIndex();
      
      // 3. Verificar sitemap
      await this.checkSitemap();
      
      // 4. Mostrar resultados
      this.displayResults();
      
      return this.issues.length === 0;
      
    } catch (error) {
      console.error('❌ Error en verificación:', error);
      return false;
    }
  }

  async checkBlogDirectory() {
    console.log('📁 Verificando directorio del blog...');
    
    try {
      const files = await fs.readdir(CONFIG.BLOG_DIR);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      this.stats.totalArticles = htmlFiles.length;
      
      // Contar archivos recientes (últimas 24 horas)
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      for (const file of htmlFiles) {
        const filePath = path.join(CONFIG.BLOG_DIR, file);
        const stat = await fs.stat(filePath);
        
        if (stat.mtime.getTime() > oneDayAgo) {
          this.stats.recent++;
        }
      }
      
      console.log(`✅ Encontrados ${this.stats.totalArticles} artículos (${this.stats.recent} recientes)`);
      
    } catch (error) {
      this.issues.push(`Error accediendo al directorio blog: ${error.message}`);
    }
  }

  async checkBlogIndex() {
    console.log('📋 Verificando índice del blog...');
    
    try {
      const indexContent = await fs.readFile(CONFIG.INDEX_PATH, 'utf-8');
      const indexData = JSON.parse(indexContent);
      
      const articles = Array.isArray(indexData) ? indexData : indexData.articles || [];
      this.stats.inIndex = articles.length;
      
      if (this.stats.inIndex !== this.stats.totalArticles) {
        this.issues.push(`Desincronización: ${this.stats.totalArticles} archivos vs ${this.stats.inIndex} en índice`);
      } else {
        console.log(`✅ Índice sincronizado: ${this.stats.inIndex} artículos`);
      }
      
      // Verificar que artículos recientes estén en el índice
      const recentInIndex = articles.filter(article => {
        const articleDate = new Date(article.date);
        const oneDayAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));
        return articleDate > oneDayAgo;
      }).length;
      
      if (recentInIndex < this.stats.recent) {
        this.issues.push(`Artículos recientes faltantes en índice: ${this.stats.recent} creados vs ${recentInIndex} indexados`);
      }
      
    } catch (error) {
      this.issues.push(`Error leyendo índice del blog: ${error.message}`);
    }
  }

  async checkSitemap() {
    console.log('🗺️ Verificando sitemap...');
    
    try {
      const sitemapContent = await fs.readFile(CONFIG.SITEMAP_PATH, 'utf-8');
      
      // Contar URLs del blog en el sitemap
      const blogUrlMatches = sitemapContent.match(/<loc>.*\/blog\/.*?<\/loc>/g) || [];
      this.stats.inSitemap = blogUrlMatches.length;
      
      if (this.stats.inSitemap !== this.stats.totalArticles) {
        this.issues.push(`Sitemap desactualizado: ${this.stats.totalArticles} artículos vs ${this.stats.inSitemap} en sitemap`);
      } else {
        console.log(`✅ Sitemap actualizado: ${this.stats.inSitemap} artículos`);
      }
      
      // Verificar fecha de modificación del sitemap
      const sitemapStat = await fs.stat(CONFIG.SITEMAP_PATH);
      const sixHoursAgo = Date.now() - (6 * 60 * 60 * 1000);
      
      if (this.stats.recent > 0 && sitemapStat.mtime.getTime() < sixHoursAgo) {
        this.issues.push('Sitemap no se ha actualizado recientemente con artículos nuevos');
      }
      
    } catch (error) {
      this.issues.push(`Error leyendo sitemap: ${error.message}`);
    }
  }

  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 REPORTE DE VERIFICACIÓN DE INTEGRACIÓN');
    console.log('='.repeat(60));
    
    console.log('📊 ESTADÍSTICAS:');
    console.log(`   📄 Total artículos: ${this.stats.totalArticles}`);
    console.log(`   📋 En índice: ${this.stats.inIndex}`);
    console.log(`   🗺️ En sitemap: ${this.stats.inSitemap}`);
    console.log(`   🆕 Recientes (24h): ${this.stats.recent}`);
    
    if (this.issues.length === 0) {
      console.log('\n✅ INTEGRACIÓN PERFECTA');
      console.log('   🎯 Todos los artículos están correctamente integrados');
      console.log('   📋 Índice del blog sincronizado');
      console.log('   🗺️ Sitemap actualizado');
      console.log('   🚀 Sistema funcionando óptimamente');
    } else {
      console.log('\n⚠️ PROBLEMAS DETECTADOS:');
      this.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      
      console.log('\n🔧 SOLUCIONES SUGERIDAS:');
      console.log('   1. Ejecutar: npm run regenerate-blog-index');
      console.log('   2. Ejecutar: node scripts/generate-sitemap.js');
      console.log('   3. Verificar permisos de escritura');
      console.log('   4. Revisar logs de GitHub Actions');
    }
    
    const status = this.issues.length === 0 ? 'PASSED' : 'FAILED';
    const emoji = this.issues.length === 0 ? '✅' : '❌';
    
    console.log(`\n${emoji} ESTADO: ${status}`);
    console.log('='.repeat(60));
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    const verifier = new IntegrationVerifier();
    const success = await verifier.verifyIntegration();
    
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { IntegrationVerifier };
