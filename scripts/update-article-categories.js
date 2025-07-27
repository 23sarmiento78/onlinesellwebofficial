const fs = require('fs');
const path = require('path');

// Configuración
const DEBUG = true; // Cambiar a false en producción
const BLOG_DIR = path.join(__dirname, '..', 'public', 'blog');

// Configuración de categorías con sus pesos (actualizado según requerimiento)
const CATEGORIES = [
  { name: 'Backend', weight: 2, keywords: ['node', 'api', 'server', 'backend', 'express', 'nestjs', 'graphql', 'rest', 'microservices', 'spring', 'django', 'flask', 'laravel', 'php'] },
  { name: 'Frontend', weight: 5, keywords: ['react', 'angular', 'vue', 'frontend', 'ui', 'ux', 'component', 'svelte', 'typescript', 'javascript', 'next.js', 'gatsby', 'html', 'css', 'sass', 'web components'] },
  { name: 'Testing y Calidad', weight: 2, keywords: ['test', 'testing', 'tdd', 'bdd', 'jest', 'cypress', 'mocha', 'unit test', 'e2e', 'jasmine', 'testing library', 'sonarqube'] },
  { name: 'DevOps y Cloud', weight: 4, keywords: ['devops', 'cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'ansible', 'terraform', 'serverless'] },
  { name: 'Bases de Datos', weight: 1, keywords: ['database', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'orm', 'dynamodb', 'cassandra', 'firebase', 'prisma'] },
  { name: 'Herramientas y Productividad', weight: 3, keywords: ['tools', 'productivity', 'vscode', 'git', 'npm', 'yarn', 'webpack', 'babel', 'docker', 'vite', 'eslint', 'prettier', 'figma', 'jira'] },
  { name: 'Performance y Optimización', weight: 4, keywords: ['performance', 'optimization', 'speed', 'fast', 'lazy loading', 'bundle', 'cache', 'web vitals', 'lighthouse', 'code splitting', 'tree shaking'] },
  { name: 'Arquitectura y Patrones', weight: 1, keywords: ['architecture', 'pattern', 'design pattern', 'clean code', 'solid', 'ddd', 'cqrs', 'microservices', 'monolith', 'event sourcing', 'hexagonal'] },
  { name: 'Tendencias y Futuro', weight: 2, keywords: ['trend', 'future', 'next', 'new', 'jamstack', 'edge', 'serverless', 'web3', 'blockchain', 'metaverse', 'pwa'] },
  { name: 'Inteligencia Artificial', weight: 2, keywords: ['ai', 'machine learning', 'ml', 'tensorflow', 'nlp', 'deep learning', 'chatgpt', 'openai', 'computer vision', 'neural networks'] },
  { name: 'Seguridad', weight: 1, keywords: ['security', 'owasp', 'jwt', 'auth', 'authentication', 'authorization', 'jwt', 'oauth', 'jwt', 'https', 'cors', 'xss', 'csrf', 'sql injection'] }
];

// Función para determinar la categoría de un artículo basado en su título
function determineCategory(title) {
  const lowerTitle = title.toLowerCase();
  
  // Buscar coincidencias de palabras clave
  const matches = CATEGORIES.map(category => {
    const matchCount = category.keywords.filter(keyword => 
      lowerTitle.includes(keyword.toLowerCase())
    ).length;
    return { ...category, score: matchCount };
  });
  
  // Ordenar por puntuación y seleccionar la mejor coincidencia
  const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
  
  // Si hay una coincidencia clara, devolver esa categoría
  if (bestMatch.score > 0) {
    return bestMatch.name;
  }
  
  // Si no hay coincidencia clara, seleccionar una categoría basada en los pesos
  const totalWeight = CATEGORIES.reduce((sum, cat) => sum + cat.weight, 0);
  let random = Math.random() * totalWeight;
  let weightSum = 0;
  
  for (const cat of CATEGORIES) {
    weightSum += cat.weight;
    if (random <= weightSum) {
      return cat.name;
    }
  }
  
  // Por defecto, devolver la primera categoría
  return CATEGORIES[0].name;
}

// Función para actualizar la categoría en un archivo HTML
function updateCategoryInFile(filePath, category) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si ya existe una etiqueta meta de categoría
    const metaCategoryRegex = /<meta[^>]*name=["']category["'][^>]*>/i;
    const newMetaTag = `<meta name="category" content="${category}">`;
    
    if (metaCategoryRegex.test(content)) {
      // Reemplazar la etiqueta meta existente
      content = content.replace(metaCategoryRegex, newMetaTag);
    } else {
      // Insertar la etiqueta meta después del título si no existe
      const titleCloseTag = content.indexOf('</title>');
      if (titleCloseTag !== -1) {
        content = content.slice(0, titleCloseTag + 8) + `\n  ${newMetaTag}` + content.slice(titleCloseTag + 8);
      }
    }
    
    // Guardar los cambios
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Actualizado: ${path.basename(filePath)} - Categoría: ${category}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al procesar ${filePath}:`, error.message);
    return false;
  }
}

// Función para verificar si un archivo es accesible
function isFileAccessible(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (err) {
    if (DEBUG) console.error(`❌ No se puede acceder al archivo ${filePath}:`, err.message);
    return false;
  }
}

// Función principal
function main() {
  console.log('📂 Iniciando actualización de categorías...');
  console.log(`📁 Carpeta del blog: ${BLOG_DIR}\n`);
  
  // Verificar si la carpeta existe
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`❌ Error: La carpeta del blog no existe: ${BLOG_DIR}`);
    return;
  }

  // Leer archivos HTML
  let files;
  try {
    files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.html'));
    if (DEBUG) console.log(`🔍 Encontrados ${files.length} archivos HTML en la carpeta del blog.`);
  } catch (err) {
    console.error('❌ Error al leer la carpeta del blog:', err.message);
    return;
  }
  
  if (files.length === 0) {
    console.log('ℹ️ No se encontraron archivos HTML en la carpeta del blog.');
    return;
  }
  
  console.log(`🔄 Procesando ${files.length} artículos...\n`);
  
  let successCount = 0;
  const categoryCount = {};
  const errors = [];
  
  // Inicializar contadores de categorías
  CATEGORIES.forEach(cat => {
    categoryCount[cat.name] = 0;
  });
  
  // Procesar cada archivo
  files.forEach((file, index) => {
    const filePath = path.join(BLOG_DIR, file);
    if (DEBUG) console.log(`\n📄 [${index + 1}/${files.length}] Procesando: ${file}`);
    
    // Verificar acceso al archivo
    if (!isFileAccessible(filePath)) {
      errors.push(`No se pudo acceder al archivo: ${file}`);
      return;
    }
    
    try {
      // Extraer título del nombre del archivo
      const title = file
        .replace(/\.html$/, '')  // Eliminar extensión
        .replace(/[-_]/g, ' ')    // Reemplazar guiones y guiones bajos con espacios
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalizar palabras
      
      if (DEBUG) console.log(`   Título extraído: ${title}`);
      
      // Determinar categoría
      const category = determineCategory(title);
      if (DEBUG) console.log(`   Categoría determinada: ${category}`);
      
      // Actualizar archivo
      if (updateCategoryInFile(filePath, category)) {
        successCount++;
        categoryCount[category] = (categoryCount[category] || 0) + 1;
        if (DEBUG) console.log(`   ✅ Actualizado correctamente`);
      } else {
        errors.push(`Error al actualizar el archivo: ${file}`);
      }
    } catch (error) {
      const errorMsg = `Error al procesar ${file}: ${error.message}`;
      console.error(`   ❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  });
  
  // Mostrar resumen
  console.log('\n📊 RESUMEN DE CATEGORÍAS ASIGNADAS:');
  console.log('================================');
  
  // Ordenar categorías por cantidad de artículos (descendente)
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1]);
  
  // Mostrar estadísticas
  sortedCategories.forEach(([cat, count]) => {
    const percentage = ((count / files.length) * 100).toFixed(1);
    console.log(`- ${cat}: ${count} artículos (${percentage}%)`);
  });
  
  // Mostrar estadísticas generales
  console.log('\n📈 ESTADÍSTICAS GENERALES:');
  console.log('==========================');
  console.log(`• Total de artículos procesados: ${files.length}`);
  console.log(`• Artículos actualizados exitosamente: ${successCount}`);
  console.log(`• Fallos: ${errors.length}`);
  
  // Mostrar errores si los hay
  if (errors.length > 0) {
    console.log('\n❌ ERRORES ENCONTRADOS:');
    console.log('====================');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  console.log('\n✅ PROCESO FINALIZADO');
  console.log('=====================');
}

// Ejecutar el script
main();
