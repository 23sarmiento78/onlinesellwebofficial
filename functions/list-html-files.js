const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Directorio de artículos HTML
    const blogDir = path.join(__dirname, '../public/blog');
    
    // Verificar si el directorio existe
    if (!fs.existsSync(blogDir)) {
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
    
    // Filtrar solo archivos HTML
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`📄 Archivos HTML encontrados: ${htmlFiles.length}`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(htmlFiles)
    };
    
  } catch (error) {
    console.error('❌ Error listando archivos HTML:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
}; 