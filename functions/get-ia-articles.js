const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

exports.handler = async function(event, context) {
  try {
    const articlesDir = path.join(__dirname, '../src/content/articulos');
    const articles = [];

    // Verificar si el directorio existe
    if (!fs.existsSync(articlesDir)) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ articles: [] })
      };
    }

    // Leer todos los archivos .md del directorio
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));

    for (const file of files) {
      try {
        const filePath = path.join(articlesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Parsear frontmatter
        const { data, content } = matter(fileContent);
        
        // Extraer slug del nombre del archivo si no existe
        const slug = data.slug || file.replace('.md', '');
        
        // Crear objeto del artículo
        const article = {
          ...data,
          slug,
          content,
          filename: file,
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

        articles.push(article);
      } catch (error) {
        console.error(`Error procesando archivo ${file}:`, error);
        // Continuar con el siguiente archivo
      }
    }

    // Ordenar por fecha (más reciente primero)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        articles,
        total: articles.length,
        source: 'markdown-files'
      })
    };

  } catch (error) {
    console.error('Error en get-ia-articles:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error obteniendo artículos',
        details: error.message,
        articles: []
      })
    };
  }
}; 