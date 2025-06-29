const { MongoClient } = require('mongodb');

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'hgaruna';

// Función para conectar a MongoDB
async function connectToMongo() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
}

// Función para verificar autenticación
function verifyAuth(headers) {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token de autenticación requerido');
  }
  
  const token = authHeader.substring(7);
  // Aquí deberías verificar el token JWT real
  // Por ahora, usamos una verificación simple
  if (token !== process.env.ADMIN_TOKEN) {
    throw new Error('Token inválido');
  }
  
  return true;
}

// API para gestionar artículos
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Manejar preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Verificar autenticación
    verifyAuth(event.headers);
    
    const db = await connectToMongo();
    const { httpMethod, path, body } = event;
    
    // Parsear el body si existe
    let data = {};
    if (body) {
      try {
        data = JSON.parse(body);
      } catch (e) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Body JSON inválido' })
        };
      }
    }

    // Rutas para artículos
    if (path.includes('/articles')) {
      const articlesCollection = db.collection('articles');
      
      if (httpMethod === 'GET') {
        // Obtener todos los artículos
        const articles = await articlesCollection.find({}).sort({ date: -1 }).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(articles)
        };
      }
      
      if (httpMethod === 'POST') {
        // Crear nuevo artículo
        const newArticle = {
          ...data,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          author: 'hgaruna',
          status: 'published'
        };
        
        await articlesCollection.insertOne(newArticle);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newArticle)
        };
      }
      
      if (httpMethod === 'PUT') {
        // Actualizar artículo
        const { id } = data;
        if (!id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID de artículo requerido' })
          };
        }
        
        const updateData = { ...data };
        delete updateData.id;
        updateData.updatedAt = new Date().toISOString();
        
        const result = await articlesCollection.updateOne(
          { id },
          { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Artículo no encontrado' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Artículo actualizado correctamente' })
        };
      }
      
      if (httpMethod === 'DELETE') {
        // Eliminar artículo
        const { id } = data;
        if (!id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID de artículo requerido' })
          };
        }
        
        const result = await articlesCollection.deleteOne({ id });
        
        if (result.deletedCount === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Artículo no encontrado' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Artículo eliminado correctamente' })
        };
      }
    }

    // Rutas para publicaciones del foro
    if (path.includes('/forum-posts')) {
      const forumCollection = db.collection('forum_posts');
      
      if (httpMethod === 'GET') {
        // Obtener todas las publicaciones
        const posts = await forumCollection.find({}).sort({ date: -1 }).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(posts)
        };
      }
      
      if (httpMethod === 'POST') {
        // Crear nueva publicación
        const newPost = {
          ...data,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          author: 'hgaruna',
          status: 'published',
          likes: 0,
          replies: []
        };
        
        await forumCollection.insertOne(newPost);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(newPost)
        };
      }
      
      if (httpMethod === 'PUT') {
        // Actualizar publicación
        const { id } = data;
        if (!id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID de publicación requerido' })
          };
        }
        
        const updateData = { ...data };
        delete updateData.id;
        updateData.updatedAt = new Date().toISOString();
        
        const result = await forumCollection.updateOne(
          { id },
          { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Publicación no encontrada' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Publicación actualizada correctamente' })
        };
      }
      
      if (httpMethod === 'DELETE') {
        // Eliminar publicación
        const { id } = data;
        if (!id) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'ID de publicación requerido' })
          };
        }
        
        const result = await forumCollection.deleteOne({ id });
        
        if (result.deletedCount === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Publicación no encontrada' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Publicación eliminada correctamente' })
        };
      }
    }

    // Ruta no encontrada
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Ruta no encontrada' })
    };

  } catch (error) {
    console.error('Error en admin-api:', error);
    
    if (error.message.includes('Token')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
}; 