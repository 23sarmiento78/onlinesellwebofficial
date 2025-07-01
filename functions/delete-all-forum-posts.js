const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'hgaruna';
const FORUM_COLLECTION = 'forum_posts';

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido'
    };
  }
  try {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME);
    await db.collection(FORUM_COLLECTION).deleteMany({});
    await client.close();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Todos los posts del foro han sido eliminados.' })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al limpiar los posts del foro', details: e.message })
    };
  }
};
