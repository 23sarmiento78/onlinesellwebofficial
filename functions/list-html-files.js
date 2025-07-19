const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  try {
    const blogDir = path.join(__dirname, '../public/blog');
    const files = [];

    // Verificar si el directorio existe
    if (!fs.existsSync(blogDir)) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ files: [] })
      };
    }

    // Leer todos los archivos .html del directorio
    const htmlFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        files: htmlFiles,
        total: htmlFiles.length,
        directory: blogDir
      })
    };

  } catch (error) {
    console.error('Error en list-html-files:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error listando archivos HTML',
        details: error.message,
        files: []
      })
    };
  }
}; 