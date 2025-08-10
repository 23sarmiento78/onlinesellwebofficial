#!/usr/bin/env node
// Script mejorado para regeneración automática del index.json del blog
// Puede ejecutarse manualmente o ser llamado por otros procesos

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const INDEX_PATH = path.join(BLOG_DIR, 'index.json');
const BACKUP_PATH = path.join(BLOG_DIR, 'index.json.backup');

/**
 * Extrae metadatos básicos de un archivo HTML
 */
function extractMetadataFromHTML(filePath, filename) {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Extraer título
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].replace(/\s*\|\s*hgaruna\s*$/, '').trim() : filename.replace(/\.html$/, '');
    
    // Limpiar título si está vacío o es genérico
    if (!title || title === 'Introducción' || title.length < 3) {
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      title = h1Match ? h1Match[1].trim() : filename.replace(/\.html$/, '').replace(/-/g, ' ');
    }
    
    // Extraer descripción
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    let excerpt = descMatch ? descMatch[1] : '';
    
    // Si no hay descripción, usar el primer párrafo
    if (!excerpt) {
      const pMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
      excerpt = pMatch ? pMatch[1].substring(0, 200) + '...' : '';
    }
    
    // Extraer autor
    const authorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const author = authorMatch ? authorMatch[1] : 'hgaruna';
    
    // Extraer fecha
    const dateMatch = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                     html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const date = dateMatch ? dateMatch[1].split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Extraer categoría
    const catMatch = html.match(/<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                    html.match(/<meta[^>]*name=["']article:section["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    let category = catMatch ? catMatch[1] : 'desarrollo';
    
    // Inferir categoría del contenido si no está definida
    if (!catMatch) {
      const content = html.toLowerCase();
      const titleLower = title.toLowerCase();
      
      if (titleLower.includes('ia') || titleLower.includes('ai') || titleLower.includes('machine learning') || 
          content.includes('inteligencia artificial') || content.includes('machine learning')) {
        category = 'ia';
      } else if (titleLower.includes('seguridad') || titleLower.includes('security') || 
                content.includes('vulnerabilidad') || content.includes('owasp')) {
        category = 'programacion';
      } else if (titleLower.includes('backend') || titleLower.includes('servidor') || 
                content.includes('api') || content.includes('database')) {
        category = 'desarrollo';
      }
    }
    
    // Extraer keywords para tags
    const kwMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    let tags = [];
    if (kwMatch) {
      tags = kwMatch[1].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).slice(0, 5);
    } else {
      // Generar tags básicos basados en el contenido
      const techTerms = ['JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'TypeScript', 
                        'API', 'Database', 'Bases de Datos', 'Performance', 'Seguridad', 'ESLint'];
      tags = techTerms.filter(term => 
        html.toLowerCase().includes(term.toLowerCase()) || title.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 4);
      
      // Añadir categoría como tag si no está presente
      if (!tags.includes(category)) {
        tags.unshift(category);
      }
    }
    
    // Extraer imagen
    let image = '/logos-he-imagenes/programacion.jpeg'; // Default
    const imgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (imgMatch) {
      image = imgMatch[1].replace('{{SITE_URL}}', '');
      if (!image.startsWith('/') && !image.startsWith('http')) {
        image = '/' + image;
      }
    }
    
    // Generar slug del filename
    const slug = filename.replace(/\.html$/, '');
    
    return {
      slug,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      excerpt: excerpt || 'Sin descripción disponible',
      author,
      date,
      category,
      tags,
      image,
      file: filename
    };
    
  } catch (error) {
    console.error(`❌ Error extrayendo metadatos de ${filename}:`, error.message);
    
    // Retornar metadatos básicos en caso de error
    const slug = filename.replace(/\.html$/, '');
    return {
      slug,
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      excerpt: 'Error cargando descripción',
      author: 'hgaruna',
      date: new Date().toISOString().split('T')[0],
      category: 'desarrollo',
      tags: ['desarrollo'],
      image: '/logos-he-imagenes/programacion.jpeg',
      file: filename
    };
  }
}

/**
 * Crear backup del index.json actual
 */
function createBackup() {
  try {
    if (fs.existsSync(INDEX_PATH)) {
      fs.copyFileSync(INDEX_PATH, BACKUP_PATH);
      console.log('💾 Backup creado:', BACKUP_PATH);
    }
  } catch (error) {
    console.warn('⚠️ No se pudo crear backup:', error.message);
  }
}

/**
 * Regenerar el index.json
 */
function regenerateIndex() {
  try {
    console.log('🔄 Regenerando index.json...');
    
    // Verificar que existe el directorio
    if (!fs.existsSync(BLOG_DIR)) {
      console.error('❌ No existe el directorio /public/blog');
      process.exit(1);
    }
    
    // Crear backup del archivo actual
    createBackup();
    
    // Leer archivos HTML
    const files = fs.readdirSync(BLOG_DIR)
      .filter(f => f.endsWith('.html'))
      .filter(f => !f.startsWith('.')) // Ignorar archivos ocultos
      .sort();
    
    console.log(`📄 Encontrados ${files.length} archivos HTML`);
    
    if (files.length === 0) {
      console.warn('⚠️ No se encontraron archivos HTML en /public/blog');
      return;
    }
    
    // Extraer metadatos de cada archivo
    const articles = [];
    let processedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        const filePath = path.join(BLOG_DIR, file);
        const metadata = extractMetadataFromHTML(filePath, file);
        articles.push(metadata);
        processedCount++;
        
        // Log cada 10 archivos procesados
        if (processedCount % 10 === 0) {
          console.log(`📊 Procesados ${processedCount}/${files.length} archículos...`);
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error.message);
        errorCount++;
      }
    }
    
    // Ordenar artículos por fecha (más recientes primero)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Escribir el nuevo index.json
    fs.writeFileSync(INDEX_PATH, JSON.stringify(articles, null, 2), 'utf-8');
    
    console.log('✅ index.json regenerado exitosamente');
    console.log(`📊 Total: ${articles.length} artículos procesados`);
    if (errorCount > 0) {
      console.log(`⚠️ Errores: ${errorCount} archivos no se pudieron procesar`);
    }
    
    // Mostrar estadísticas por categoría
    const categories = {};
    articles.forEach(article => {
      categories[article.category] = (categories[article.category] || 0) + 1;
    });
    
    console.log('📈 Artículos por categoría:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error regenerando index.json:', error);
    
    // Restaurar backup si existe
    if (fs.existsSync(BACKUP_PATH)) {
      try {
        fs.copyFileSync(BACKUP_PATH, INDEX_PATH);
        console.log('🔄 Backup restaurado');
      } catch (restoreError) {
        console.error('❌ Error restaurando backup:', restoreError.message);
      }
    }
    
    process.exit(1);
  }
}

/**
 * Verificar si hay cambios desde la última regeneración
 */
function hasChanges() {
  try {
    if (!fs.existsSync(INDEX_PATH)) return true;
    
    // Obtener fecha de modificación del index.json
    const indexStats = fs.statSync(INDEX_PATH);
    const indexTime = indexStats.mtime;
    
    // Verificar si algún archivo HTML es más nuevo
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const fileStats = fs.statSync(filePath);
      
      if (fileStats.mtime > indexTime) {
        console.log(`🆕 Archivo modificado detectado: ${file}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error verificando cambios:', error.message);
    return true; // En caso de error, regenerar
  }
}

// Función principal
function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force') || args.includes('-f');
  
  console.log('🔍 Verificando artículos del blog...');
  
  if (force) {
    console.log('🔧 Regeneración forzada solicitada');
    regenerateIndex();
  } else if (hasChanges()) {
    console.log('📝 Cambios detectados, regenerando...');
    regenerateIndex();
  } else {
    console.log('✅ index.json está actualizado');
  }
}

// Exportar funciones para uso programático
module.exports = {
  regenerateIndex,
  hasChanges,
  extractMetadataFromHTML
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}
