const { google } = require('googleapis');
const { Buffer } = require('buffer'); // Importa Buffer explícitamente
const { MongoClient } = require('mongodb');

const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";

// Conexión a MongoDB (gratis con MongoDB Atlas)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://atlas-sql-6860db038f846f4c166252b6-17xoqn.a.query.mongodb.net/hgaruna?ssl=true&authSource=admin';
const DB_NAME = 'hgaruna';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(DB_NAME);
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const db = await connectToDatabase();
    const { path, httpMethod, body } = event;
    
    // Parse the path to determine the resource and action
    const pathParts = path.replace('/.netlify/functions/', '').split('/');
    const resource = pathParts[1]; // 'articles' or 'forum-posts'
    const action = pathParts[2]; // 'create', 'list', 'update', 'delete'
    const id = pathParts[3]; // ID for specific operations

    console.log(`API Request: ${httpMethod} ${resource}/${action} ${id || ''}`);

    switch (resource) {
      case 'articles':
        return await handleArticles(db, httpMethod, action, id, body, headers);
      
      case 'forum-posts':
        return await handleForumPosts(db, httpMethod, action, id, body, headers);
      
      case 'stats':
        return await handleStats(db, headers);
      
      case 'views':
        return await handleViews(db, httpMethod, action, id, body, headers);
      
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Resource not found' })
        };
    }

  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function handleArticles(db, method, action, id, body, headers) {
  const collection = db.collection('articles');

  switch (method) {
    case 'GET':
      if (action === 'list') {
        const articles = await collection.find({}).sort({ date: -1 }).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(articles)
        };
      } else if (id) {
        const article = await collection.findOne({ _id: id });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(article)
        };
      }
      break;

    case 'POST':
      if (action === 'create') {
        const articleData = JSON.parse(body);
        articleData._id = `article_${Date.now()}`;
        articleData.date = new Date().toISOString();
        articleData.slug = articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        await collection.insertOne(articleData);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, article: articleData })
        };
      }
      break;

    case 'PUT':
      if (id) {
        const updateData = JSON.parse(body);
        await collection.updateOne({ _id: id }, { $set: updateData });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }
      break;

    case 'DELETE':
      if (id) {
        await collection.deleteOne({ _id: id });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }
      break;
  }

  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error: 'Invalid request' })
  };
}

async function handleForumPosts(db, method, action, id, body, headers) {
  const collection = db.collection('forum_posts');

  switch (method) {
    case 'GET':
      if (action === 'list') {
        const posts = await collection.find({}).sort({ timestamp: -1 }).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(posts)
        };
      } else if (id) {
        const post = await collection.findOne({ _id: id });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(post)
        };
      }
      break;

    case 'POST':
      if (action === 'create') {
        const postData = JSON.parse(body);
        postData._id = `post_${Date.now()}`;
        postData.timestamp = new Date().toISOString();
        postData.likes = 0;
        postData.comments = [];
        
        await collection.insertOne(postData);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, post: postData })
        };
      }
      break;

    case 'PUT':
      if (id) {
        const updateData = JSON.parse(body);
        await collection.updateOne({ _id: id }, { $set: updateData });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }
      break;

    case 'DELETE':
      if (id) {
        await collection.deleteOne({ _id: id });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true })
        };
      }
      break;
  }

  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error: 'Invalid request' })
  };
}

async function handleStats(db, headers) {
  const articlesCollection = db.collection('articles');
  const forumCollection = db.collection('forum_posts');

  const [articlesCount, forumPostsCount] = await Promise.all([
    articlesCollection.countDocuments(),
    forumCollection.countDocuments()
  ]);

  const stats = {
    articles: articlesCount,
    forumPosts: forumPostsCount,
    comments: 0, // TODO: Implement comments counting
    views: (articlesCount * 150) + (forumPostsCount * 75) // Simulated
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(stats)
  };
}

async function handleViews(db, method, action, id, body, headers) {
  const collection = db.collection('views');

  switch (method) {
    case 'POST':
      if (action === 'create') {
        const viewData = JSON.parse(body);
        const view = {
          page: viewData.page || '/',
          userAgent: viewData.userAgent || req.headers['user-agent'],
          ip: viewData.ip || req.ip,
          timestamp: new Date(),
          date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
        };
        
        await collection.insertOne(view);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ success: true, view: view })
        };
      }
      break;

    case 'GET':
      if (action === 'stats') {
        const { period = 'all' } = id;
        
        let dateFilter = {};
        const today = new Date();
        
        if (period === 'today') {
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          dateFilter = { timestamp: { $gte: startOfDay } };
        } else if (period === 'week') {
          const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = { timestamp: { $gte: startOfWeek } };
        } else if (period === 'month') {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          dateFilter = { timestamp: { $gte: startOfMonth } };
        }
        
        // Total de vistas
        const totalViews = await collection.countDocuments(dateFilter);
        
        // Vistas por página
        const viewsByPage = await collection
          .aggregate([
            { $match: dateFilter },
            { $group: { _id: '$page', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ]).toArray();
        
        // Vistas por día (últimos 30 días)
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const dailyViews = await collection
          .aggregate([
            { $match: { timestamp: { $gte: thirtyDaysAgo } } },
            { $group: { _id: '$date', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
          ]).toArray();
        
        // Vistas únicas (por IP)
        const uniqueViews = await collection
          .distinct('ip', dateFilter);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            totalViews,
            uniqueViews: uniqueViews.length,
            viewsByPage,
            dailyViews,
            period
          })
        };
      } else if (id === 'total') {
        const totalViews = await collection.countDocuments();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ totalViews })
        };
      }
      break;
  }

  return {
    statusCode: 400,
    headers,
    body: JSON.stringify({ error: 'Invalid request' })
  };
}

async function handleIndexNow(url) {
    // Decodificar la clave de servicio de Google desde la variable de entorno
    let googlePrivateKey;
    try {
        const privateKeyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
        if (!privateKeyBase64) {
            throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 no está configurada. Asegúrate de añadirla en tus variables de entorno de Netlify.');
        }
        googlePrivateKey = JSON.parse(Buffer.from(privateKeyBase64, 'base64').toString('utf8'));
    } catch (error) {
        console.error('Error al decodificar la clave de servicio de Google:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error de configuración de la clave de servicio de Google', details: error.message })
        };
    }

    // Obtener la clave y el host de IndexNow desde las variables de entorno
    const indexNowHost = process.env.INDEXNOW_HOST;
    const indexNowKey = process.env.INDEXNOW_KEY;

    if (!indexNowHost || !indexNowKey) {
        console.warn('ADVERTENCIA: INDEXNOW_HOST o INDEXNOW_KEY no están configuradas en Netlify. No se enviará a IndexNow.');
        // Esto no es un error crítico para la función principal, pero es importante que el usuario lo sepa.
    }

    let googleIndexingResult = null;
    let indexNowResult = null;
    let errors = [];

    // 1. Enviar a Google Indexing API
    try {
        const jwtClient = new google.auth.JWT(
            googlePrivateKey.client_email,
            null,
            googlePrivateKey.private_key,
            ['https://www.googleapis.com/auth/indexing'],
            null
        );

        await jwtClient.authorize();

        const res = await google.indexing('v3').urlNotifications.publish({
            auth: jwtClient,
            requestBody: {
                url: url,
                type: 'URL_UPDATED' // O 'URL_DELETED' si eliminas una página
            }
        });

        googleIndexingResult = { status: 'success', response: res.data };
        console.log('API de Indexación de Google Response:', res.data);

    } catch (error) {
        console.error('Error al enviar a la API de Indexación de Google:', error.message);
        googleIndexingResult = { status: 'failed', error: error.message };
        errors.push({ source: 'Google Indexing API', details: error.message });
    }

    // 2. Enviar a IndexNow (solo si las variables están configuradas)
    if (indexNowHost && indexNowKey) {
        try {
            const data = {
                host: indexNowHost,
                key: indexNowKey,
                urlList: [url]
            };

            const response = await fetch(INDEXNOW_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                indexNowResult = { status: 'success', response: { httpStatus: response.status, httpStatusText: response.statusText } };
                console.log('IndexNow submission successful:', response.status, response.statusText);
            } else {
                const errorData = await response.json();
                const errorMessage = `IndexNow submission failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`;
                indexNowResult = { status: 'failed', error: errorMessage };
                console.error(errorMessage);
                errors.push({ source: 'IndexNow API', details: errorMessage });
            }
        } catch (error) {
            indexNowResult = { status: 'failed', error: error.message };
            console.error('Error al enviar a IndexNow:', error.message);
            errors.push({ source: 'IndexNow API', details: error.message });
        }
    }

    if (errors.length > 0) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Errores durante el proceso de indexación.',
                results: { google: googleIndexingResult, indexNow: indexNowResult },
                errors: errors
            })
        };
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'URL enviada para indexación con éxito a las APIs disponibles.',
                results: { google: googleIndexingResult, indexNow: indexNowResult }
            })
        };
    }
} 