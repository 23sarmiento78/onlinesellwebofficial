const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

exports.handler = async function(event, context) {
  try {
    const { slug } = event.queryStringParameters || {};
    
    if (!slug) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          error: 'Slug requerido',
          details: 'Debe proporcionar un slug para obtener el artículo'
        })
      };
    }

    const articlesDir = path.join(__dirname, '../src/content/articulos');
    
    // Verificar si el directorio existe
    if (!fs.existsSync(articlesDir)) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          error: 'Artículo no encontrado',
          details: 'No se encontró el directorio de artículos'
        })
      };
    }

    // Buscar el archivo que coincida con el slug
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
    let targetFile = null;

    for (const file of files) {
      const filePath = path.join(articlesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const { data } = matter(fileContent);
        const fileSlug = data.slug || file.replace('.md', '');
        
        if (fileSlug === slug) {
          targetFile = { file, filePath, fileContent };
          break;
        }
      } catch (error) {
        console.error(`Error procesando archivo ${file}:`, error);
        // Continuar con el siguiente archivo
      }
    }

    if (!targetFile) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          error: 'Artículo no encontrado',
          details: `No se encontró un artículo con el slug: ${slug}`
        })
      };
    }

    // Parsear el artículo encontrado
    const { data, content } = matter(targetFile.fileContent);
    
    // Crear objeto del artículo
    const article = {
      ...data,
      slug,
      content,
      filename: targetFile.file,
      // Asegurar que los tags sean un array
      tags: Array.isArray(data.tags) ? data.tags : 
            (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []),
      // Asegurar que la fecha sea válida
      date: data.date || new Date().toISOString(),
      // Asegurar que el autor exista
      author: data.author || 'hgaruna',
      // Asegurar que la imagen exista
      image: data.image || '/logos-he-imagenes/programacion.jpeg'
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        article,
        source: 'markdown-file'
      })
    };

  } catch (error) {
    console.error('Error en get-ia-article:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error obteniendo artículo',
        details: error.message
      })
    };
  }
}; 