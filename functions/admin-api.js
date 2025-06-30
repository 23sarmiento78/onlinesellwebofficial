const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://atlas-sql-6860db038f846f4c166252b6-17xoqn.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin';
const DB_NAME = 'sample_mflix'; // Cambia por el nombre de tu base si es diferente
const ARTICLES_COLLECTION = 'articles';
const FORUM_COLLECTION = 'forum_posts';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
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
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Error guardando en la base de datos', details: e.message }) };
    }
  }

  // Respuesta protegida por defecto
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Acceso concedido al API admin',
      date: new Date().toISOString()
    })
  };
};