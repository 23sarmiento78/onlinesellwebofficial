const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'hgaruna'; // Cambiado a la base correcta
const FORUM_COLLECTION = 'forum_posts';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

// Función para cargar datos locales como fallback
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
  try {
    // Intentar conectar a MongoDB si está configurado
    if (MONGODB_URI) {
      try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const posts = await db.collection(FORUM_COLLECTION)
          .find({})
          .sort({ createdAt: -1, timestamp: -1 })
          .toArray();
        
        console.log(`[get-forum-posts] MongoDB: ${posts.length} posts encontrados`);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ posts, source: 'mongodb' })
        };
      } catch (mongodbError) {
        console.error('[get-forum-posts] Error MongoDB:', mongodbError.message);
        // Si MongoDB falla, continuar con datos locales
      }
    }

    // Fallback a datos locales
    const localPosts = loadLocalData();
    console.log(`[get-forum-posts] Local: ${localPosts.length} posts encontrados`);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ posts: localPosts, source: 'local' })
    };
    
  } catch (e) {
    console.error('[get-forum-posts] Error general:', e.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Error obteniendo posts del foro', 
        details: e.message,
        posts: []
      })
    };
  }
};
