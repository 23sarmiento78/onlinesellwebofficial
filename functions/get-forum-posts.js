const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'sample_mflix';
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
  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    // Filtrar solo los posts de hoy por 'createdAt' o 'timestamp'
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    const posts = await db.collection(FORUM_COLLECTION)
      .find({
        $or: [
          { createdAt: { $gte: start, $lte: end } },
          { timestamp: { $gte: start.toISOString(), $lte: end.toISOString() } }
        ]
      })
      .sort({ createdAt: -1, timestamp: -1 })
      .toArray();
    return {
      statusCode: 200,
      body: JSON.stringify({ posts })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error obteniendo posts del foro', details: e.message })
    };
  }
};
