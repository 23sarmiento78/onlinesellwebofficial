#!/usr/bin/env node

/**
 * 🎯 Integrador de AdSense para Todos los Artículos
 * 
 * Este script:
 * - Añade scripts de AdSense a todos los artículos HTML existentes
 * - Integra unidades de anuncios estratégicamente
 * - Preserva el contenido original
 * - Aplica mejores prácticas de AdSense
 * - Crea backups de seguridad
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN ===
const CONFIG = {
  ADSENSE_CLIENT_ID: 'ca-pub-7772175009790237',
  BLOG_DIR: path.resolve(__dirname, '../public/blog'),
  BACKUP_DIR: path.resolve(__dirname, '../backups/articles'),
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  
  // Patrones de archivos a procesar
  HTML_PATTERNS: [
    'public/blog/*.html',
    'public/*.html',
    'ebooks/*.html'
  ]
};

// === SCRIPTS Y ELEMENTOS DE ADSENSE ===
const ADSENSE_SCRIPTS = {
  mainScript: `
<!-- AdSense Script Principal -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT_ID}" crossorigin="anonymous"></script>
<meta name="google-adsense-account" content="${CONFIG.ADSENSE_CLIENT_ID}">`,

  // Unidades de anuncios responsivas
  displayAd: (slot = '1234567890') => `
<!-- Anuncio Display Responsivo -->
<div class="adsense-container">
  <div class="adsense-label">Publicidad</div>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
       data-ad-slot="${slot}"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>`,

  rectangleAd: (slot = '0987654321') => `
<!-- Anuncio Rectángulo -->
<div class="adsense-container">
  <div class="adsense-label">Publicidad</div>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
       data-ad-slot="${slot}"
       data-ad-format="rectangle"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>`,

  bannerAd: (slot = '1122334455') => `
<!-- Anuncio Banner -->
<div class="adsense-container">
  <div class="adsense-label">Publicidad</div>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
       data-ad-slot="${slot}"
       data-ad-format="horizontal"
       data-full-width-responsive="true"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>`,

  articleAd: (slot = '5566778899') => `
<!-- Anuncio In-Article -->
<div class="adsense-container in-article">
  <div class="adsense-label">Publicidad</div>
  <ins class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
       data-ad-slot="${slot}"></ins>
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>`
};

// === CSS PARA ANUNCIOS ===
const ADSENSE_CSS = `
<style>
/* Estilos para contenedores de AdSense */
.adsense-container {
  margin: 25px auto;
  padding: 15px;
  text-align: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  max-width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.adsense-container.in-article {
  margin: 30px auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.adsense-label {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Responsive para móviles */
@media (max-width: 768px) {
  .adsense-container {
    margin: 20px auto;
    padding: 12px;
  }
  
  .adsense-label {
    font-size: 11px;
  }
}

/* Asegurar que los anuncios no interfieran con el contenido */
.adsbygoogle {
  display: block !important;
}

/* Animación suave para carga de anuncios */
.adsense-container {
  opacity: 0;
  animation: fadeInAd 0.5s ease-in-out 0.3s forwards;
}

@keyframes fadeInAd {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Prevenir layout shift */
.adsense-container ins {
  min-height: 100px;
  background: #f8f9fa;
  border-radius: 4px;
}
</style>`;

// === INTEGRADOR DE ADSENSE ===
class AdSenseIntegrator {
  constructor() {
    this.processedFiles = [];
    this.errors = [];
    this.backupCreated = false;
  }

  async initialize() {
    console.log('🎯 Inicializando integrador de AdSense...');
    
    // Crear directorio de backup
    await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true });
    
    console.log(`📁 Backup directory: ${CONFIG.BACKUP_DIR}`);
    console.log(`🎯 AdSense Client ID: ${CONFIG.ADSENSE_CLIENT_ID}`);
  }

  // === CREAR BACKUP ===
  async createBackup(filePath) {
    if (!this.backupCreated) {
      console.log('💾 Creando backup de artículos...');
      this.backupCreated = true;
    }
    
    const fileName = path.basename(filePath);
    const backupPath = path.join(CONFIG.BACKUP_DIR, fileName);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(backupPath, content, 'utf-8');
    } catch (error) {
      console.warn(`⚠️ No se pudo crear backup de ${fileName}: ${error.message}`);
    }
  }

  // === PROCESAR ARCHIVO HTML ===
  async processHTMLFile(filePath) {
    console.log(`📝 Procesando: ${path.basename(filePath)}`);
    
    try {
      // Crear backup
      await this.createBackup(filePath);
      
      // Leer contenido
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Verificar si ya tiene AdSense
      if (content.includes('googlesyndication.com') || content.includes(CONFIG.ADSENSE_CLIENT_ID)) {
        console.log(`  ⚠️ Ya tiene AdSense integrado, saltando...`);
        return { skipped: true, reason: 'AdSense ya integrado' };
      }
      
      // Procesar el contenido
      const updatedContent = await this.integrateAdSense(content, filePath);
      
      // Guardar archivo actualizado
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      
      const result = {
        file: path.basename(filePath),
        processed: true,
        adsAdded: this.countAdsInContent(updatedContent),
        wordCount: this.getWordCount(content)
      };
      
      this.processedFiles.push(result);
      console.log(`  ✅ Completado: ${result.adsAdded} anuncios añadidos`);
      
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

  // === INTEGRAR ADSENSE EN CONTENIDO ===
  async integrateAdSense(content, filePath) {
    let updatedContent = content;
    
    // 1. Añadir script principal en <head>
    if (updatedContent.includes('<head>')) {
      updatedContent = updatedContent.replace(
        '<head>',
        `<head>${ADSENSE_SCRIPTS.mainScript}`
      );
    }
    
    // 2. Añadir CSS de AdSense
    if (updatedContent.includes('</head>')) {
      updatedContent = updatedContent.replace(
        '</head>',
        `${ADSENSE_CSS}\n</head>`
      );
    }
    
    // 3. Añadir anuncios estratégicamente según el tipo de contenido
    updatedContent = this.addStrategicAds(updatedContent);
    
    return updatedContent;
  }

  // === AÑADIR ANUNCIOS ESTRATÉGICAMENTE ===
  addStrategicAds(content) {
    let updatedContent = content;
    
    // 1. Anuncio después del título/header principal
    if (updatedContent.includes('<h1>') || updatedContent.includes('<h2>')) {
      const headerMatch = updatedContent.match(/(<h[12][^>]*>.*?<\/h[12]>)/i);
      if (headerMatch) {
        const headerEnd = updatedContent.indexOf(headerMatch[0]) + headerMatch[0].length;
        updatedContent = 
          updatedContent.slice(0, headerEnd) + 
          '\n' + ADSENSE_SCRIPTS.displayAd('1234567890') + '\n' +
          updatedContent.slice(headerEnd);
      }
    }
    
    // 2. Anuncio en el medio del contenido (después del primer párrafo largo)
    const paragraphs = updatedContent.match(/<p[^>]*>.*?<\/p>/gi) || [];
    if (paragraphs.length >= 3) {
      // Buscar el tercer párrafo y añadir anuncio después
      let thirdParagraphIndex = -1;
      let count = 0;
      
      for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].length > 100) { // Solo párrafos largos
          count++;
          if (count === 3) {
            thirdParagraphIndex = updatedContent.indexOf(paragraphs[i]) + paragraphs[i].length;
            break;
          }
        }
      }
      
      if (thirdParagraphIndex > -1) {
        updatedContent = 
          updatedContent.slice(0, thirdParagraphIndex) + 
          '\n' + ADSENSE_SCRIPTS.articleAd('5566778899') + '\n' +
          updatedContent.slice(thirdParagraphIndex);
      }
    }
    
    // 3. Anuncio antes de la conclusión o último párrafo
    const lastParagraphMatch = updatedContent.match(/(<p[^>]*>.*?<\/p>)(?!.*<p)/gi);
    if (lastParagraphMatch && lastParagraphMatch.length > 0) {
      const lastParagraph = lastParagraphMatch[lastParagraphMatch.length - 1];
      const lastParagraphIndex = updatedContent.lastIndexOf(lastParagraph);
      
      if (lastParagraphIndex > -1) {
        updatedContent = 
          updatedContent.slice(0, lastParagraphIndex) + 
          ADSENSE_SCRIPTS.rectangleAd('0987654321') + '\n' +
          updatedContent.slice(lastParagraphIndex);
      }
    }
    
    // 4. Anuncio antes del footer o final del body
    if (updatedContent.includes('</body>')) {
      updatedContent = updatedContent.replace(
        '</body>',
        ADSENSE_SCRIPTS.bannerAd('1122334455') + '\n</body>'
      );
    }
    
    return updatedContent;
  }

  // === FUNCIONES DE UTILIDAD ===
  countAdsInContent(content) {
    const matches = content.match(/adsbygoogle/g);
    return matches ? matches.length : 0;
  }

  getWordCount(content) {
    // Extraer solo texto, sin HTML
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textContent.split(' ').length;
  }

  // === PROCESAR TODOS LOS ARCHIVOS ===
  async processAllArticles() {
    console.log('🔍 Buscando archivos HTML...');
    
    const files = [];
    
    // Buscar archivos según patrones
    for (const pattern of CONFIG.HTML_PATTERNS) {
      try {
        const patternFiles = await glob(pattern, { cwd: path.resolve(__dirname, '..') });
        files.push(...patternFiles.map(f => path.resolve(__dirname, '..', f)));
      } catch (error) {
        console.warn(`⚠️ Error buscando patrón ${pattern}: ${error.message}`);
      }
    }
    
    // Filtrar solo archivos HTML válidos
    const htmlFiles = files.filter(file => 
      file.endsWith('.html') && 
      !file.includes('backup') && 
      !file.includes('template')
    );
    
    console.log(`📄 Encontrados ${htmlFiles.length} archivos HTML`);
    
    if (htmlFiles.length === 0) {
      console.log('⚠️ No se encontraron archivos HTML para procesar');
      return;
    }
    
    // Procesar cada archivo
    const results = [];
    for (let i = 0; i < htmlFiles.length; i++) {
      const file = htmlFiles[i];
      console.log(`\n[${i + 1}/${htmlFiles.length}] ${path.basename(file)}`);
      
      const result = await this.processHTMLFile(file);
      results.push(result);
      
      // Pausa pequeña entre archivos
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // === GENERAR REPORTE ===
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFiles: this.processedFiles.length + this.errors.length,
        processedSuccessfully: this.processedFiles.length,
        errors: this.errors.length,
        totalAdsAdded: this.processedFiles.reduce((sum, file) => sum + (file.adsAdded || 0), 0)
      },
      processedFiles: this.processedFiles,
      errors: this.errors,
      adsenseConfig: {
        clientId: CONFIG.ADSENSE_CLIENT_ID,
        adTypes: ['display', 'rectangle', 'banner', 'in-article']
      }
    };
    
    console.log('\n📊 REPORTE DE INTEGRACIÓN ADSENSE:');
    console.log(`   📄 Archivos procesados: ${report.summary.processedSuccessfully}`);
    console.log(`   🎯 Total anuncios añadidos: ${report.summary.totalAdsAdded}`);
    console.log(`   ❌ Errores: ${report.summary.errors}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ ERRORES:');
      this.errors.forEach(error => {
        console.log(`   - ${error.file}: ${error.error}`);
      });
    }
    
    console.log('\n✅ ARCHIVOS PROCESADOS:');
    this.processedFiles.forEach(file => {
      if (file.processed) {
        console.log(`   ✓ ${file.file} (${file.adsAdded} anuncios)`);
      } else {
        console.log(`   ⚠️ ${file.file} (saltado: ${file.reason})`);
      }
    });
    
    return report;
  }

  // === GUARDAR REPORTE ===
  async saveReport(report) {
    const reportPath = path.resolve(__dirname, '../reports/adsense-integration-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n💾 Reporte guardado en: ${reportPath}`);
  }
}

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    console.log('🚀 Iniciando integración de AdSense en todos los artículos...');
    
    const integrator = new AdSenseIntegrator();
    await integrator.initialize();
    
    // Procesar todos los artículos
    await integrator.processAllArticles();
    
    // Generar y guardar reporte
    const report = integrator.generateReport();
    await integrator.saveReport(report);
    
    console.log('\n🎉 ¡Integración de AdSense completada!');
    console.log('💡 Recuerda:');
    console.log('   1. Verificar que los anuncios se muestren correctamente');
    console.log('   2. Revisar las políticas de AdSense');
    console.log('   3. Configurar las unidades de anuncios en Google AdSense');
    console.log('   4. Probar en diferentes dispositivos');
    
    return report;
    
  } catch (error) {
    console.error('❌ Error fatal en integración:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AdSenseIntegrator, CONFIG as ADSENSE_CONFIG };
