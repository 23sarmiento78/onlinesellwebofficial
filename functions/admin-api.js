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
    console.log('[admin-api] Nueva petición recibida:', { method: event.httpMethod, body: event.body });
    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = JSON.parse(event.body || '{}');
        console.log('[admin-api] Body parseado correctamente:', body);
      } catch (parseError) {
        console.error('[admin-api] Error de parseo JSON:', parseError.message);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'JSON inválido en el body', details: parseError.message })
        };
      }
      try {
        const client = await connectToDatabase();
        console.log('[admin-api] Conexión a MongoDB exitosa');
        const db = client.db(DB_NAME);
        if (body.action === 'create-article' && body.article) {
          const newArticle = {
            ...body.article,
            createdAt: new Date().toISOString()
          };
          console.log('[admin-api] Intentando insertar artículo...');
          await db.collection(ARTICLES_COLLECTION).insertOne(newArticle);
          console.log('[admin-api] Artículo insertado correctamente');

          // Crear archivo Markdown para Astro
          try {
            const { exec } = require('child_process');
            // Prepara el JSON para pasarlo como argumento seguro
            const safeJson = JSON.stringify({
              title: newArticle.title,
              description: newArticle.description || '',
              date: newArticle.date || newArticle.createdAt,
              image: newArticle.image || '',
              category: newArticle.category || '',
              author: newArticle.author || '',
              tags: newArticle.tags || [],
              content: newArticle.content || ''
            }).replace(/'/g, "\\'");
            exec(`node ./scripts/create-astro-article-md.js '${safeJson}'`, (err, stdout, stderr) => {
              if (err) {
                console.error('[admin-api] Error creando archivo Astro:', stderr);
              } else {
                console.log('[admin-api] Archivo Astro creado:', stdout);
              }
            });
          } catch (err) {
            console.error('[admin-api] Error al intentar crear archivo Astro:', err.message);
          }

          // Eliminado: Crear post resumido en el foro
          const resumen = newArticle.content.length > 200 ? newArticle.content.substring(0, 197) + '...' : newArticle.content;
          const forumPost = {
            title: newArticle.title,
            content: resumen,
            author: newArticle.author,
            createdAt: newArticle.createdAt,
            tags: newArticle.seoKeywords || '',
            articleId: newArticle._id || null // para referencia cruzada
          };
          await db.collection(FORUM_COLLECTION).insertOne(forumPost);
          // Eliminado: console.log('[admin-api] Post de foro creado automáticamente');

          // Automatizar publicación en LinkedIn (solo si hay token en el body)
          if (body.linkedinToken) {
            const linkedinContent = `${forumPost.title}\n\n${resumen}\n\n${forumPost.tags ? forumPost.tags.split(',').map(t => '#' + t.trim().replace(/\s+/g, '')).join(' ') : ''}\n\nLee el artículo completo en: ${body.articleUrl || ''}`;
            try {
              const linkedinRes = await fetch('https://service.hgaruna.org/.netlify/functions/linkedin-api/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: linkedinContent, accessToken: body.linkedinToken })
              });
              const linkedinData = await linkedinRes.json();
              if (linkedinRes.ok && linkedinData.success) {
                console.log('[admin-api] Publicado en LinkedIn');
              } else {
                console.warn('[admin-api] Error publicando en LinkedIn:', linkedinData.message || 'Error desconocido');
              }
            } catch (err) {
              console.warn('[admin-api] Error al conectar con LinkedIn:', err.message);
            }
          }

          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, article: newArticle, forumPost })
          };
        }
        if (body.action === 'create-forum-post' && body.post) {
          const newPost = {
            ...body.post,
            createdAt: new Date().toISOString()
          };
          await db.collection(FORUM_COLLECTION).insertOne(newPost);
          console.log('[admin-api] Post insertado:', newPost);
          return {
            statusCode: 200,
            body: JSON.stringify({ success: true, post: newPost })
          };
        }
        // Acción no reconocida
        console.warn('[admin-api] Acción no reconocida o datos incompletos:', body);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Acción no reconocida o datos incompletos' })
        };
      } catch (e) {
        console.error('[admin-api] ❌ Error en handler:', e.message, e);
        return { statusCode: 500, body: JSON.stringify({ error: 'Error guardando en la base de datos', details: e.message }) };
      }
    }
    // Respuesta protegida por defecto para otros métodos
    console.log('[admin-api] Método no POST, acceso concedido');
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