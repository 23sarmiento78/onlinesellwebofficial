// scripts/update-article-list.js
// Script para actualizar automáticamente la lista de archivos HTML

const fs = require('fs');
const path = require('path');

function updateArticleList() {
  console.log('🔄 Actualizando lista de artículos...');
  
  // Leer archivos de public/public/blog
  const public/blogDir = path.join(__dirname, '../public/public/blog');
  const files = fs.readdirSync(public/blogDir);
  
  // Filtrar archivos HTML
  const htmlFiles = files.filter(file => {
    const isHtml = file.endsWith('.html');
    const isSpecialFile = file === '.keep' || file.startsWith('.');
    return isHtml && !isSpecialFile;
  });
  
  console.log(`📄 Encontrados ${htmlFiles.length} archivos HTML`);
  
  // Ordenar por fecha
  const sortedFiles = htmlFiles.sort((a, b) => {
    const dateA = a.match(/^(\d{4}-\d{2}-\d{2})/);
    const dateB = b.match(/^(\d{4}-\d{2}-\d{2})/);
    
    if (dateA && dateB) {
      return new Date(dateB[1]) - new Date(dateA[1]);
    }
    
    return b.localeCompare(a);
  });
  
  // Leer el archivo getArticlesFromHTML.js
  const filePath = path.join(__dirname, '../src/utils/getArticlesFromHTML.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Generar la nueva lista de archivos
  const fileList = sortedFiles.map(file => `    '${file}'`).join(',\n');
  
  // Reemplazar la lista existente
  const regex = /const knownFiles = \[\n([\s\S]*?)\n  \];/;
  const replacement = `const knownFiles = [
${fileList}
  ];`;
  
  if (regex.test(content)) {
    content = content.replace(regex, replacement);
    
    // Escribir el archivo actualizado
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Lista de artículos actualizada automáticamente');
    console.log('📄 Archivos incluidos:', sortedFiles);
  } else {
    console.log('❌ No se pudo encontrar la lista de archivos en el código');
  }
}

// Ejecutar la actualización
updateArticleList(); 