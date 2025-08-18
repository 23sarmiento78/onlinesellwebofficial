// Script para arreglar placeholders en blog-index.json
import fs from 'fs-extra';
import path from 'path';

function processPlaceholders(text, fallbacks = {}) {
  if (!text || typeof text !== 'string') return text;
  
  const replacements = {
    '{{SEO_TITLE}}': fallbacks.title || 'Angular 18: Nuevas Funcionalidades',
    '{{SEO_DESCRIPTION}}': fallbacks.description || 'Descubre las nuevas características y mejoras de Angular 18 para el desarrollo web moderno',
    '{{SEO_KEYWORDS}}': fallbacks.keywords || 'Angular, JavaScript, Frontend, Desarrollo Web',
    '{{FEATURED_IMAGE}}': fallbacks.image || '/logos-he-imagenes/programacion.jpeg',
    '{{CANONICAL_URL}}': fallbacks.url || '#',
    '{{CATEGORY}}': fallbacks.category || 'Frontend',
    '{{EDUCATIONAL_LEVEL}}': 'Intermedio',
    '{{READING_TIME}}': fallbacks.readingTime || '5 min',
    '{{TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{ARTICLE_TITLE}}': fallbacks.title || 'Artículo de Desarrollo',
    '{{ARTICLE_SUMMARY}}': fallbacks.description || 'Artículo generado por inteligencia artificial',
    '{{AUTHOR}}': fallbacks.author || 'hgaruna',
    '{{WORD_COUNT}}': '800',
    '{{TAGS_HTML}}': fallbacks.tagsHtml || '',
    '{{ARTICLE_CONTENT}}': fallbacks.content || '',
    '{{PUBLISH_DATE}}': fallbacks.date || new Date().toISOString().split('T')[0]
  };

  let processed = text;
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    processed = processed.replaceAll(placeholder, replacement);
  }
  
  return processed;
}

// Mapeo de categorías basado en contenido
function determineCategory(title, description, keywords = []) {
  const text = `${title} ${description} ${keywords.join(' ')}`.toLowerCase();
  
  if (text.includes('react')) return 'Frontend';
  if (text.includes('angular')) return 'Frontend';
  if (text.includes('javascript') || text.includes('js')) return 'Frontend';
  if (text.includes('typescript')) return 'Frontend';
  if (text.includes('vue')) return 'Frontend';
  if (text.includes('frontend')) return 'Frontend';
  if (text.includes('html') || text.includes('css')) return 'Frontend';
  
  if (text.includes('node') || text.includes('backend')) return 'Backend';
  if (text.includes('api') || text.includes('server')) return 'Backend';
  
  if (text.includes('database') || text.includes('sql')) return 'Bases de Datos';
  if (text.includes('mongodb') || text.includes('mysql')) return 'Bases de Datos';
  
  if (text.includes('docker') || text.includes('aws')) return 'DevOps y Cloud';
  if (text.includes('devops') || text.includes('ci/cd')) return 'DevOps y Cloud';
  if (text.includes('terraform') || text.includes('ansible')) return 'DevOps y Cloud';
  
  if (text.includes('test') || text.includes('testing')) return 'Testing y Calidad';
  
  if (text.includes('security') || text.includes('seguridad')) return 'Seguridad';
  
  if (text.includes('performance') || text.includes('optimization')) return 'Performance y Optimización';
  if (text.includes('cache') || text.includes('speed')) return 'Performance y Optimización';
  
  if (text.includes('ia') || text.includes('ai') || text.includes('inteligencia artificial')) return 'Inteligencia Artificial';
  if (text.includes('nlp') || text.includes('machine learning')) return 'Inteligencia Artificial';
  
  if (text.includes('webassembly') || text.includes('pwa')) return 'Tendencias y Futuro';
  
  if (text.includes('architecture') || text.includes('patterns')) return 'Arquitectura y Patrones';
  if (text.includes('cqrs') || text.includes('microservices')) return 'Arquitectura y Patrones';
  
  if (text.includes('tools') || text.includes('eslint')) return 'Herramientas y Productividad';
  
  return 'General';
}

async function main() {
  try {
    console.log('🔄 Procesando blog-index.json...');
    
    const blogIndexPath = path.resolve('public/data/blog-index.json');
    const data = await fs.readJson(blogIndexPath);
    
    if (!Array.isArray(data)) {
      console.error('❌ blog-index.json no contiene un array válido');
      return;
    }
    
    const processedData = data.map((article, index) => {
      const processedArticle = { ...article };
      
      // Procesar título
      if (processedArticle.title && processedArticle.title.includes('{{')) {
        if (processedArticle.title === '{{SEO_TITLE}}') {
          // Usar información del excerpt o path para generar título
          const titleFromPath = processedArticle.path?.split('/').pop()?.replace('.html', '')?.replace(/-/g, ' ') || 'Artículo de Desarrollo';
          const titleFromExcerpt = processedArticle.excerpt?.split('.')[0] || titleFromPath;
          processedArticle.title = titleFromExcerpt.length > 5 ? titleFromExcerpt : titleFromPath;
        } else {
          processedArticle.title = processPlaceholders(processedArticle.title, {
            title: 'Artículo de Desarrollo'
          });
        }
      }
      
      // Procesar descripción
      if (processedArticle.description && processedArticle.description.includes('{{')) {
        processedArticle.description = processPlaceholders(processedArticle.description, {
          description: processedArticle.excerpt || 'Artículo generado por inteligencia artificial'
        });
      }
      
      // Procesar keywords
      if (Array.isArray(processedArticle.keywords)) {
        processedArticle.keywords = processedArticle.keywords
          .map(keyword => processPlaceholders(keyword, { keywords: 'desarrollo web' }))
          .filter(keyword => !keyword.includes('{{'));
        
        if (processedArticle.keywords.length === 0) {
          processedArticle.keywords = ['desarrollo web', 'programación'];
        }
      }
      
      // Procesar tags
      if (Array.isArray(processedArticle.tags)) {
        processedArticle.tags = processedArticle.tags
          .map(tag => processPlaceholders(tag, { keywords: 'desarrollo web' }))
          .filter(tag => !tag.includes('{{'));
        
        if (processedArticle.tags.length === 0) {
          processedArticle.tags = processedArticle.keywords || ['desarrollo web', 'programación'];
        }
      }
      
      // Procesar imagen
      if (processedArticle.image && processedArticle.image.includes('{{')) {
        processedArticle.image = '/logos-he-imagenes/programacion.jpeg';
      }
      
      // Determinar categoría si no existe o es inválida
      if (!processedArticle.category || processedArticle.category === '{{CATEGORY}}') {
        processedArticle.category = determineCategory(
          processedArticle.title, 
          processedArticle.description || processedArticle.excerpt, 
          processedArticle.keywords
        );
      }
      
      // Asegurar que tiene ID válido
      if (!processedArticle.id || processedArticle.id === 'seotitle') {
        processedArticle.id = `article-${index + 1}-${Date.now()}`;
      }
      
      return processedArticle;
    });
    
    // Guardar archivo procesado
    await fs.writeJson(blogIndexPath, processedData, { spaces: 2 });
    
    console.log(`✅ blog-index.json procesado exitosamente. ${processedData.length} artículos actualizados.`);
    console.log('📊 Categorías encontradas:', [...new Set(processedData.map(a => a.category))]);
    
  } catch (error) {
    console.error('❌ Error procesando blog-index.json:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
