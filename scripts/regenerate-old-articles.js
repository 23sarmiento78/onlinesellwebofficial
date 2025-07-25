// scripts/regenerate-old-articles.js
// Regenera artículos viejos que no tienen CSS completo

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/article-template.html');
const OUTPUT_DIR = path.resolve(__dirname, '..//public/blog');

if (!GEMINI_API_KEY) {
  console.error('❌ Falta la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}

// Lista de archivos que necesitan ser regenerados (sin CSS)
const filesToRegenerate = [
  '2025-07-19-angular-18-nuevas-funcionalidades.html',
  '2025-07-19-low-codeno-code-plataformas-de-desarrollo.html',
  '2025-07-19-web-performance-core-web-vitals.html',
  '2025-07-19-static-analysis-eslint-y-sonarqube.html',
  '2025-07-19-monorepo-vs-polyrepo-estrategias.html',
  '2025-07-19-aws-lambda-computacin-sin-servidores.html',
  '2025-07-19-machine-learning-para-web-gua-definitiva.html',
  '2025-07-19-ansible-automatizacin-de-configuracin.html'
];

async function regenerateArticle(filename) {
  try {
    console.log(`🔄 Regenerando: ${filename}`);
    
    // Leer el contenido actual
    const filePath = path.join(OUTPUT_DIR, filename);
    const currentContent = fs.readFileSync(filePath, 'utf8');
    
    // Extraer el título del contenido actual
    const titleMatch = currentContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : filename.replace('.html', '');
    
    // Extraer el contenido del main
    const mainMatch = currentContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const content = mainMatch ? mainMatch[1] : currentContent;
    
    // Extraer resumen del primer párrafo
    const summaryMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
    const summary = summaryMatch ? summaryMatch[1].substring(0, 150) + '...' : `Artículo sobre ${title}`;
    
    // Generar slug del título
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    // Determinar categoría basada en el contenido
    let category = 'Desarrollo Web';
    if (content.toLowerCase().includes('react') || content.toLowerCase().includes('angular')) {
      category = 'Frontend';
    } else if (content.toLowerCase().includes('aws') || content.toLowerCase().includes('lambda')) {
      category = 'Cloud Computing';
    } else if (content.toLowerCase().includes('machine learning') || content.toLowerCase().includes('ai')) {
      category = 'Inteligencia Artificial';
    }
    
    // Generar tags basados en el contenido
    const tags = [];
    if (content.toLowerCase().includes('javascript')) tags.push('JavaScript');
    if (content.toLowerCase().includes('react')) tags.push('React');
    if (content.toLowerCase().includes('angular')) tags.push('Angular');
    if (content.toLowerCase().includes('aws')) tags.push('AWS');
    if (content.toLowerCase().includes('performance')) tags.push('Performance');
    if (content.toLowerCase().includes('eslint')) tags.push('ESLint');
    if (content.toLowerCase().includes('sonarqube')) tags.push('SonarQube');
    if (content.toLowerCase().includes('machine learning')) tags.push('Machine Learning');
    if (content.toLowerCase().includes('ansible')) tags.push('Ansible');
    if (content.toLowerCase().includes('monorepo')) tags.push('Monorepo');
    if (content.toLowerCase().includes('low-code')) tags.push('Low-Code');
    
    // Calcular tiempo de lectura
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Leer el template HTML
    const templatePath = path.join(__dirname, '../templates/article-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Extraer fecha del nombre del archivo
    const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : '2025-07-19';
    
    // Reemplazar variables en el template
    const replacements = {
      '{{ARTICLE_TITLE}}': title,
      '{{ARTICLE_SUMMARY}}': summary,
      '{{ARTICLE_CONTENT}}': content,
      '{{CATEGORY}}': category,
      '{{AUTHOR}}': 'hgaruna',
      '{{PUBLISH_DATE}}': new Date(date + 'T10:00:00.000Z').toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      '{{FEATURED_IMAGE}}': '/logos-he-imagenes/programacion.jpeg',
      '{{SEO_TITLE}}': title,
      '{{SEO_DESCRIPTION}}': summary.substring(0, 160),
      '{{SEO_KEYWORDS}}': tags.join(', '),
      '{{CANONICAL_URL}}': `https://hgaruna.com/public/blog/${slug}`,
      '{{TAGS_HTML}}': tags.map(tag => `<span class="tag">${tag}</span>`).join(''),
      '{{READING_TIME}}': readingTime.toString(),
      '{{WORD_COUNT}}': wordCount.toString()
    };
    
    // Aplicar reemplazos
    Object.entries(replacements).forEach(([key, value]) => {
      template = template.replace(new RegExp(key, 'g'), value);
    });
    
    // Guardar el archivo regenerado
    fs.writeFileSync(filePath, template, 'utf8');
    console.log(`✅ ${filename} regenerado con CSS completo`);
    
    return { filename, title, slug };
    
  } catch (error) {
    console.error(`❌ Error regenerando ${filename}:`, error);
    return null;
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando regeneración de artículos viejos...');
    console.log(`📁 Directorio: ${OUTPUT_DIR}`);
    
    const regeneratedArticles = [];
    
    for (const filename of filesToRegenerate) {
      const filePath = path.join(OUTPUT_DIR, filename);
      
      // Verificar si el archivo existe
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo ${filename} no existe, saltando...`);
        continue;
      }
      
      const result = await regenerateArticle(filename);
      if (result) {
        regeneratedArticles.push(result);
      }
      
      // Pausa entre archivos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 Resumen de regeneración:');
    console.log(`✅ Artículos regenerados: ${regeneratedArticles.length}/${filesToRegenerate.length}`);
    
    if (regeneratedArticles.length > 0) {
      console.log('\n📝 Artículos regenerados:');
      regeneratedArticles.forEach(article => {
        console.log(`  - ${article.filename} (${article.title})`);
      });
    }
    
    console.log('\n🎉 Regeneración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la regeneración:', error.message);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { regenerateArticle }; 