// scripts/check-github-actions.js
// Script para monitorear el estado de las GitHub Actions y verificar la generación de artículos

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'hgaruna'; // Cambiar por tu usuario de GitHub
const REPO_NAME = 'proyect'; // Cambiar por tu repositorio

async function checkGitHubActions() {
  try {
    console.log('🔍 Verificando estado de GitHub Actions...\n');

    if (!GITHUB_TOKEN) {
      console.log('⚠️  GITHUB_TOKEN no configurado. Solo se mostrará información básica.');
    }

    // Verificar workflows existentes
    const workflowsDir = path.join(__dirname, '../.github/workflows');
    if (fs.existsSync(workflowsDir)) {
      const workflows = fs.readdirSync(workflowsDir).filter(file => file.endsWith('.yml'));
      
      console.log('📋 Workflows configurados:');
      workflows.forEach(workflow => {
        const workflowPath = path.join(workflowsDir, workflow);
        const content = fs.readFileSync(workflowPath, 'utf8');
        
        // Extraer información básica del workflow
        const nameMatch = content.match(/name:\s*(.+)/);
        const scheduleMatch = content.match(/cron:\s*['"`]([^'"`]+)['"`]/g);
        const triggerMatch = content.match(/on:\s*\n\s*(\w+):/g);
        
        console.log(`  📄 ${workflow}`);
        if (nameMatch) {
          console.log(`     Nombre: ${nameMatch[1]}`);
        }
        if (scheduleMatch) {
          console.log(`     Programación: ${scheduleMatch.join(', ')}`);
        }
        if (triggerMatch) {
          console.log(`     Triggers: ${triggerMatch.map(t => t.replace('on:\n      ', '')).join(', ')}`);
        }
        console.log('');
      });
    } else {
      console.log('❌ No se encontró el directorio .github/workflows');
    }

    // Verificar artículos generados
    const articlesDir = path.join(__dirname, '../src/content/articulos');
    if (fs.existsSync(articlesDir)) {
      const articles = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
      
      console.log('📝 Artículos generados:');
      console.log(`  Total: ${articles.length} artículos`);
      
      if (articles.length > 0) {
        // Agrupar por fecha
        const articlesByDate = {};
        articles.forEach(article => {
          const dateMatch = article.match(/^(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            const date = dateMatch[1];
            if (!articlesByDate[date]) {
              articlesByDate[date] = [];
            }
            articlesByDate[date].push(article);
          }
        });

        // Mostrar últimos 5 días
        const sortedDates = Object.keys(articlesByDate).sort().reverse().slice(0, 5);
        sortedDates.forEach(date => {
          console.log(`  📅 ${date}: ${articlesByDate[date].length} artículos`);
          articlesByDate[date].forEach(article => {
            const title = article.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');
            console.log(`    - ${title}`);
          });
        });
      }
      console.log('');
    } else {
      console.log('❌ No se encontró el directorio de artículos');
    }

    // Verificar archivos HTML generados
    const htmlDir = path.join(__dirname, '..//public/blog');
    if (fs.existsSync(htmlDir)) {
      const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
      console.log('🌐 Archivos HTML generados:');
      console.log(`  Total: ${htmlFiles.length} archivos HTML`);
      console.log('');
    }

    // Verificar sitemap
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      const stats = fs.statSync(sitemapPath);
      console.log('🗺️  Sitemap:');
      console.log(`  Archivo: sitemap.xml`);
      console.log(`  Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`  Última modificación: ${stats.mtime.toLocaleString()}`);
      console.log('');
    }

    // Verificar variables de entorno necesarias
    console.log('🔧 Variables de entorno:');
    console.log(`  GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`  GITHUB_TOKEN: ${GITHUB_TOKEN ? '✅ Configurada' : '❌ No configurada'}`);
    console.log('');

    // Verificar próximas ejecuciones programadas
    console.log('⏰ Próximas ejecuciones programadas:');
    const now = new Date();
    const schedules = [
      { name: 'generate-articles.yml', cron: '0 6,12,18,23 * * *' },
      { name: 'generate-articles-and-sitemap.yml', cron: '0 16,18,20,22 * * *' }
    ];

    schedules.forEach(schedule => {
      console.log(`  📅 ${schedule.name}: ${schedule.cron}`);
      // Aquí podrías agregar lógica para calcular la próxima ejecución
    });

    // Verificar estado de las funciones de Netlify
    console.log('\n🔌 Funciones de Netlify:');
    const functionsDir = path.join(__dirname, '../functions');
    if (fs.existsSync(functionsDir)) {
      const functions = fs.readdirSync(functionsDir).filter(file => file.endsWith('.js'));
      console.log(`  Total: ${functions.length} funciones`);
      functions.forEach(func => {
        console.log(`    - ${func}`);
      });
    }

    console.log('\n✅ Verificación completada');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message);
  }
}

async function checkRecentRuns() {
  if (!GITHUB_TOKEN) {
    console.log('⚠️  GITHUB_TOKEN requerido para verificar ejecuciones recientes');
    return;
  }

  try {
    console.log('\n🔄 Verificando ejecuciones recientes...');
    
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          per_page: 10
        }
      }
    );

    const runs = response.data.workflow_runs;
    
    console.log(`📊 Últimas ${runs.length} ejecuciones:`);
    
    runs.forEach(run => {
      const status = run.status;
      const conclusion = run.conclusion;
      const emoji = conclusion === 'success' ? '✅' : 
                   conclusion === 'failure' ? '❌' : 
                   status === 'in_progress' ? '🔄' : '⏸️';
      
      console.log(`  ${emoji} ${run.name} (${run.head_branch})`);
      console.log(`     Estado: ${status} ${conclusion ? `(${conclusion})` : ''}`);
      console.log(`     Fecha: ${new Date(run.created_at).toLocaleString()}`);
      console.log(`     Duración: ${run.duration ? Math.round(run.duration / 60) + ' min' : 'N/A'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error obteniendo ejecuciones recientes:', error.message);
  }
}

// Función principal
async function main() {
  console.log('🚀 Verificador de GitHub Actions y Generación de Artículos\n');
  
  await checkGitHubActions();
  await checkRecentRuns();
  
  console.log('\n📋 Resumen de recomendaciones:');
  console.log('  1. Verifica que GEMINI_API_KEY esté configurada en GitHub Secrets');
  console.log('  2. Asegúrate de que los workflows tengan permisos de escritura');
  console.log('  3. Revisa los logs de las últimas ejecuciones si hay errores');
  console.log('  4. Verifica que los archivos generados se estén commiteando correctamente');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { checkGitHubActions, checkRecentRuns }; 