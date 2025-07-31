// api/admin/index.js - Vercel Serverless Function
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD, Content-Type, Date, X-Api-V, Authorization'
  );

  // Manejo de solicitudes OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB connection string not configured');
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await client.connect();
    const db = client.db();
    
    // Aquí iría la lógica específica de tu API de administración
    // Por ejemplo, manejo de diferentes métodos HTTP
    switch (req.method) {
      case 'GET':
        // Lógica para GET
        const items = await db.collection('items').find({}).toArray();
        res.status(200).json(items);
        break;
        
      case 'POST':
        // Lógica para POST
        const newItem = req.body;
        const result = await db.collection('items').insertOne(newItem);
        res.status(201).json(result.ops[0]);
        break;
        
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
    
    await client.close();
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
