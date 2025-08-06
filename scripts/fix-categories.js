import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Categorías objetivo
const TARGET_CATEGORIES = ['desarrollo', 'diseno', 'ia', 'tecnologia', 'programacion', 'seo'];

// Mapeo de categorías antiguas a las nuevas
const CATEGORY_MAPPING = {
  // Desarrollo
  'Frontend': 'desarrollo',
  'Front-end': 'desarrollo',
  'JavaScript': 'desarrollo',
  'React': 'desarrollo',
  'Vue': 'desarrollo',
  'Angular': 'desarrollo',
  'Node.js': 'desarrollo',
  'TypeScript': 'desarrollo',
  'HTML': 'desarrollo',
  'CSS': 'diseno',
  'Sass': 'diseno',
  'Less': 'diseno',
  'Bootstrap': 'diseno',
  'Tailwind': 'diseno',
  'Material UI': 'diseno',
  
  // IA
  'IA': 'ia',
  'Inteligencia Artificial': 'ia',
  'Machine Learning': 'ia',
  'ML': 'ia',
  'AI': 'ia',
  
  // Tecnología
  'Tecnología': 'tecnologia',
  'Tecnologia': 'tecnologia',
  'DevOps': 'tecnologia',
  'Cloud': 'tecnologia',
  'Docker': 'tecnologia',
  'Kubernetes': 'tecnologia',
  'AWS': 'tecnologia',
  'Azure': 'tecnologia',
  'Google Cloud': 'tecnologia',
  
  // Programación
  'Programación': 'programacion',
  'Programacion': 'programacion',
  'Desarrollo': 'desarrollo',
  'Testing': 'programacion',
  'Base de Datos': 'programacion',
  'Bases de Datos': 'programacion',
  'SQL': 'programacion',
  'NoSQL': 'programacion',
  'MongoDB': 'programacion',
  'MySQL': 'programacion',
  'PostgreSQL': 'programacion',
  'Git': 'programacion',
  
  // SEO
  'SEO': 'seo',
  'Marketing Digital': 'seo',
  'Marketing': 'seo',
  'Posicionamiento': 'seo',
  'SEM': 'seo',
  
  // Diseño
  'Diseño': 'diseno',
  'UI/UX': 'diseno',
  'UI': 'diseno',
  'UX': 'diseno',
  'Diseño Web': 'diseno',
  'Web Design': 'diseno',
  'Figma': 'diseno',
  'Sketch': 'diseno',
  'Adobe XD': 'diseno',
  
  // Otras categorías comunes
  'Herramientas': 'programacion',
  'Arquitectura': 'programacion',
  'Rendimiento': 'programacion',
  'Performance': 'programacion',
  'Accesibilidad': 'diseno',
  'Accessibility': 'diseno',
  'Responsive': 'diseno'
};

// Función para normalizar categorías
function normalizeCategory(category) {
  if (!category) return null;
  
  // Convertir a minúsculas y quitar espacios
  const normalized = category.trim().toLowerCase();
  
  // Buscar en el mapeo
  const mappedCategory = CATEGORY_MAPPING[category] || 
    Object.entries(CATEGORY_MAPPING).find(([key]) => 
      key.toLowerCase() === normalized
    )?.[1];
  
  return mappedCategory || 'desarrollo'; // Valor por defecto
}

// Función para actualizar un archivo HTML
async function updateFileCategories(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const $ = cheerio.load(content);
    
    // Obtener la categoría actual
    const categoryMeta = $('meta[name="category"]');
    if (categoryMeta.length === 0) {
      console.log(`No se encontró meta categoría en ${path.basename(filePath)}`);
      return false;
    }
    
    const currentCategory = categoryMeta.attr('content');
    if (!currentCategory) {
      console.log(`Categoría vacía en ${path.basename(filePath)}`);
      return false;
    }
    
    // Normalizar la categoría
    const newCategory = normalizeCategory(currentCategory);
    
    // Si la categoría ya está normalizada, no hacer nada
    if (currentCategory === newCategory) {
      return false;
    }
    
    // Actualizar la categoría
    categoryMeta.attr('content', newCategory);
    
    // Actualizar keywords si existen
    const keywordsMeta = $('meta[name="keywords"]');
    if (keywordsMeta.length > 0) {
      const keywords = (keywordsMeta.attr('content') || '').split(',').map(k => k.trim());
      
      // Eliminar categorías antiguas de las keywords
      const filteredKeywords = keywords.filter(k => !Object.keys(CATEGORY_MAPPING).includes(k));
      
      // Añadir la nueva categoría si no está ya presente
      if (!filteredKeywords.includes(newCategory)) {
        filteredKeywords.unshift(newCategory);
      }
      
      keywordsMeta.attr('content', filteredKeywords.join(', '));
    }
    
    // Guardar los cambios
    await fs.writeFile(filePath, $.html(), 'utf8');
    console.log(`Actualizado: ${path.basename(filePath)} - Categoría cambiada de "${currentCategory}" a "${newCategory}"`);
    return true;
    
  } catch (error) {
    console.error(`Error al procesar ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

// Función principal
async function main() {
  try {
    const blogDir = path.join(__dirname, '..', 'public', 'blog');
    const files = await fs.readdir(blogDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`Encontrados ${htmlFiles.length} archivos HTML para procesar...`);
    
    let updatedCount = 0;
    
    for (const file of htmlFiles) {
      const filePath = path.join(blogDir, file);
      const updated = await updateFileCategories(filePath);
      if (updated) updatedCount++;
    }
    
    console.log(`\nProceso completado. Se actualizaron ${updatedCount} de ${htmlFiles.length} artículos.`);
    
  } catch (error) {
    console.error('Error en el proceso principal:', error);
    process.exit(1);
  }
}

// Ejecutar el script
main().catch(console.error);
