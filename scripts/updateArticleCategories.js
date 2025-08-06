import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapeo de categorías antiguas a las nuevas
const CATEGORY_MAPPING = {
  'Frontend': 'desarrollo',
  'Diseño': 'diseno',
  'UI/UX': 'diseno',
  'IA': 'ia',
  'Inteligencia Artificial': 'ia',
  'Machine Learning': 'ia',
  'Tecnología': 'tecnologia',
  'Programación': 'programacion',
  'Desarrollo': 'desarrollo',
  'Testing': 'programacion',
  'DevOps': 'tecnologia',
  'Cloud': 'tecnologia',
  'Base de Datos': 'programacion',
  'Seguridad': 'programacion',
  'SEO': 'seo',
  'Marketing Digital': 'seo',
  'Herramientas': 'programacion',
  'Arquitectura': 'programacion',
  'Rendimiento': 'programacion',
  'Accesibilidad': 'diseno',
  'Responsive': 'diseno'
};

// Función para leer un directorio recursivamente
async function* walkDir(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      yield* walkDir(res);
    } else {
      yield res;
    }
  }
}

async function updateCategories() {
  try {
    const blogDir = path.join(__dirname, '..', 'public', 'blog');
    let updatedCount = 0;
    
    // Recorrer todos los archivos HTML
    for await (const filePath of walkDir(blogDir)) {
      if (!filePath.endsWith('.html')) continue;
      
      let content = await fs.readFile(filePath, 'utf8');
      let modified = false;
      
      // Buscar y reemplazar categorías
      for (const [oldCat, newCat] of Object.entries(CATEGORY_MAPPING)) {
        const categoryRegex = new RegExp(`<meta name="category" content="${oldCat}"`, 'i');
        
        if (categoryRegex.test(content)) {
          content = content.replace(categoryRegex, `<meta name="category" content="${newCat}"`);
          modified = true;
          
          // Actualizar keywords si existen
          const keywordsMatch = content.match(/<meta name="keywords" content="([^"]*)"/i);
          if (keywordsMatch && keywordsMatch[1]) {
            const keywords = keywordsMatch[1].split(',').map(k => k.trim());
            const filteredKeywords = keywords.filter(k => !Object.keys(CATEGORY_MAPPING).includes(k));
            
            if (!filteredKeywords.includes(newCat)) {
              filteredKeywords.unshift(newCat);
            }
            
            content = content.replace(
              /<meta name="keywords" content="[^"]*"/i,
              `<meta name="keywords" content="${filteredKeywords.join(', ')}"`
            );
          }
          
          console.log(`Actualizado: ${path.basename(filePath)} - Categoría cambiada de "${oldCat}" a "${newCat}"`);
          updatedCount++;
          break; // Pasar al siguiente archivo
        }
      }
      
      // Guardar los cambios si hubo modificaciones
      if (modified) {
        await fs.writeFile(filePath, content, 'utf8');
      }
    }
    
    console.log(`\nProceso completado. Se actualizaron ${updatedCount} artículos.`);
    
  } catch (error) {
    console.error('Error al actualizar categorías:', error);
  }
}

// Exportar la función para su uso en otros módulos
export { updateCategories };
