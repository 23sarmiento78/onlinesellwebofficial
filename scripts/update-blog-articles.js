// scripts/update-blog-articles.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { optimizeArticlesForAdSense } from './optimize-articles-adsense.js';
import fsExtra from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de rutas
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/educational-article-template.html');
const BACKUP_DIR = path.resolve(__dirname, '../backup/blog');

// Crear directorio de respaldo si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fsExtra.ensureDirSync(BACKUP_DIR);
}

// Función para leer el archivo de plantilla
function readTemplate() {
  try {
    return fs.readFileSync(TEMPLATE_PATH, 'utf8');
  } catch (error) {
    console.error('❌ Error al leer la plantilla:', error.message);
    process.exit(1);
  }
}

// Función para extraer el contenido principal del artículo
function extractArticleContent(html) {
  const $ = cheerio.load(html);
  
  // Extraer el contenido principal (ajusta los selectores según sea necesario)
  const content = $('.article-content, main, article').html() || $('body').html();
  const title = $('title, h1').first().text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  
  return { content, title, description, keywords };
}

// Función para aplicar la plantilla al contenido
function applyTemplate(template, { content, title, description, keywords }) {
  // Reemplazar placeholders en la plantilla
  return template
    .replace(/{{TITLE}}/g, title)
    .replace(/{{SEO_TITLE}}/g, title)
    .replace(/{{SEO_DESCRIPTION}}/g, description)
    .replace(/{{SEO_KEYWORDS}}/g, keywords)
    .replace(/{{CONTENT}}/g, content)
    .replace(/{{PUBLISH_DATE}}/g, new Date().toISOString())
    .replace(/{{CATEGORY}}/g, 'Programación')
    .replace(/{{EDUCATIONAL_LEVEL}}/g, 'Intermedio')
    .replace(/{{READING_TIME}}/g, '10')
    .replace(/{{CANONICAL_URL}}/g, 'https://hgaruna.com/blog/' + path.basename(process.argv[2] || ''))
    .replace(/{{FEATURED_IMAGE}}/g, '/logos-he-imagenes/programacion.jpeg')
    .replace(/{{PREREQUISITES}}/g, 'Conocimientos básicos de programación web');
}

// Función para procesar un archivo de artículo
async function processArticle(filePath) {
  try {
    const filename = path.basename(filePath);
    console.log(`🔄 Procesando: ${filename}`);
    
    // Crear respaldo
    const backupPath = path.join(BACKUP_DIR, filename);
    if (!fs.existsSync(backupPath)) {
      fsExtra.copySync(filePath, backupPath);
      console.log(`✅ Respaldado en: ${backupPath}`);
    }
    
    // Leer el contenido original
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Extraer contenido
    const articleData = extractArticleContent(originalContent);
    
    // Leer plantilla
    const template = readTemplate();
    
    // Aplicar plantilla
    const newContent = applyTemplate(template, articleData);
    
    // Guardar cambios
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Actualizado: ${filename}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
async function main() {
  try {
    console.log('🚀 Iniciando actualización de artículos del blog...');
    
    // Leer archivos del directorio del blog
    const files = fs.readdirSync(BLOG_DIR)
      .filter(file => file.endsWith('.html'));
    
    if (files.length === 0) {
      console.log('ℹ️ No se encontraron archivos HTML en el directorio del blog');
      return;
    }
    
    console.log(`📄 Encontrados ${files.length} artículos para actualizar`);
    
    // Procesar cada archivo
    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      await processArticle(filePath);
    }
    
    // Ejecutar optimización de AdSense
    console.log('🔍 Aplicando optimizaciones de AdSense...');
    await optimizeArticlesForAdSense();
    
    console.log('✅ Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en el proceso principal:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { processArticle };
