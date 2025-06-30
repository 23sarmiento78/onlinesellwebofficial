const { MongoClient } = require('mongodb');

// Log para verificar si la variable de entorno está presente
echoEnv();
function echoEnv() {
  if (!process.env.MONGODB_URI) {
    console.log('[admin-api] ⚠️ Variable MONGODB_URI NO definida');
  } else {
    console.log('[admin-api] ✅ Variable MONGODB_URI definida');
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'sample_mflix'; // Cambia por el nombre de tu base si es diferente
const ARTICLES_COLLECTION = 'articles';
const FORUM_COLLECTION = 'forum_posts';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  try {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    cachedClient = client;
    return client;
  } catch (err) {
    console.log('[admin-api] ❌ Error conectando a MongoDB:', err.message);
    throw err;
  }
}

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = JSON.parse(event.body || '{}');
      } catch (parseError) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'JSON inválido en el body', details: parseError.message })
        };
      }
      try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        if (body.action === 'create-article' && body.article) {
          const newArticle = {
            ...body.article,
            createdAt: new Date().toISOString()
          };
          await db.collection(ARTICLES_COLLECTION).insertOne(newArticle);
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, article: newArticle })
          };
        }
        if (body.action === 'create-forum-post' && body.post) {
          const newPost = {
            ...body.post,
            createdAt: new Date().toISOString()
          };
          await db.collection(FORUM_COLLECTION).insertOne(newPost);
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, post: newPost })
          };
        }
        // Acción no reconocida
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Acción no reconocida o datos incompletos' })
        };
      } catch (e) {
        console.log('[admin-api] ❌ Error en handler:', e.message);
        return { statusCode: 500, body: JSON.stringify({ error: 'Error guardando en la base de datos', details: e.message }) };
      }
    }
    // Respuesta protegida por defecto para otros métodos
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Acceso concedido al API admin',
        date: new Date().toISOString()
      })
    };
  } catch (fatalError) {
    console.error('[admin-api] ❌ Error fatal:', fatalError);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno inesperado', details: fatalError.message })
    };
  }
};