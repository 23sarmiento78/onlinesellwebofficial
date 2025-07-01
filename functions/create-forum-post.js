const { MongoClient } = require('mongodb');

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

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const data = JSON.parse(event.body);
    const newPost = {
      author: data.author || 'Anónimo',
      avatar: data.avatar || '/logos-he-imagenes/logo3.png',
      content: data.content,
      image: data.image || null,
      category: data.category || 'General',
      tags: data.tags || [],
      createdAt: new Date(),
    };
    const result = await db.collection(FORUM_COLLECTION).insertOne(newPost);
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, post: newPost })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error creando post', details: e.message })
    };
  }
};
