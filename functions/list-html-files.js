const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    console.log('🔍 Iniciando función list-html-files...');
    
    // Directorio de artículos HTML
    const blogDir = path.join(__dirname, '../public/blog');
    console.log(`📁 Directorio a revisar: ${blogDir}`);
    
    // Verificar si el directorio existe
    if (!fs.existsSync(blogDir)) {
      console.log('❌ El directorio blog no existe');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify([])
      };
    }
    
    // Leer todos los archivos del directorio
    const files = fs.readdirSync(blogDir);
    console.log(`📄 Todos los archivos en el directorio: ${files.length}`);
    
    // Filtrar solo archivos HTML y excluir archivos especiales
    const htmlFiles = files.filter(file => {
      const isHtml = file.endsWith('.html');
      const isSpecialFile = file === '.keep' || file.startsWith('.');
      return isHtml && !isSpecialFile;
    });
    
    console.log(`📄 Archivos HTML encontrados: ${htmlFiles.length}`);
    console.log('📄 Lista de archivos HTML:', htmlFiles);
    
    // Ordenar por fecha (más recientes primero)
    const sortedFiles = htmlFiles.sort((a, b) => {
      // Extraer fecha del nombre del archivo (YYYY-MM-DD)
      const dateA = a.match(/^(\d{4}-\d{2}-\d{2})/);
      const dateB = b.match(/^(\d{4}-\d{2}-\d{2})/);
      
      if (dateA && dateB) {
        return new Date(dateB[1]) - new Date(dateA[1]);
      }
      
      // Si no tienen fecha, ordenar alfabéticamente
      return b.localeCompare(a);
    });
    
    console.log('📄 Archivos ordenados por fecha:', sortedFiles);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(sortedFiles)
    };
    
  } catch (error) {
    console.error('❌ Error listando archivos HTML:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Error interno del servidor', details: error.message })
    };
  }
}; 