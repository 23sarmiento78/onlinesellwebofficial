const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'hgaruna'; // Usar la base correcta
const FORUM_COLLECTION = 'forum_posts';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

// Función para guardar datos locales
function saveLocalData(posts) {
  try {
    const dataPath = path.join(__dirname, '../public/data/forum-posts.json');
    const data = { posts };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error guardando datos locales:', error);
    return false;
  }
}

// Función para cargar datos locales
function loadLocalData() {
  try {
    const dataPath = path.join(__dirname, '../public/data/forum-posts.json');
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return data.posts || [];
    }
  } catch (error) {
    console.error('Error cargando datos locales:', error);
  }
  return [];
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const newPost = {
      _id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      author: data.author || 'Anónimo',
      avatar: data.avatar || '/logos-he-imagenes/logo3.png',
      content: data.content,
      title: data.title || data.content.substring(0, 100) + '...',
      image: data.image || null,
      category: data.category || 'General',
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      likedBy: []
    };

    // Intentar guardar en MongoDB si está configurado
    if (MONGODB_URI) {
      try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const result = await db.collection(FORUM_COLLECTION).insertOne(newPost);
        console.log('[create-forum-post] MongoDB: Post creado exitosamente');
        
        return {
          statusCode: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ 
            success: true, 
            post: newPost,
            source: 'mongodb'
          })
        };
      } catch (mongodbError) {
        console.error('[create-forum-post] Error MongoDB:', mongodbError.message);
        // Si MongoDB falla, continuar con datos locales
      }
    }

    // Fallback a datos locales
    const localPosts = loadLocalData();
    localPosts.unshift(newPost); // Agregar al inicio
    const saved = saveLocalData(localPosts);
    
    if (saved) {
      console.log('[create-forum-post] Local: Post guardado exitosamente');
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ 
          success: true, 
          post: newPost,
          source: 'local'
        })
      };
    } else {
      throw new Error('No se pudo guardar el post localmente');
    }
    
  } catch (e) {
    console.error('[create-forum-post] Error:', e.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error creando post', 
        details: e.message 
      })
    };
  }
};
