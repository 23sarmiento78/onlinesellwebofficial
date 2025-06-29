const { MongoClient } = require('mongodb');

// Configuración optimizada - solo variables necesarias
const MONGODB_URI = process.env.NETLIFY_DATABASE_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'default-admin-token';

// Validar token de administración
function validateAdminToken(token) {
    return token === ADMIN_TOKEN;
}

// Conectar a MongoDB
async function connectToDatabase() {
    if (!MONGODB_URI) {
        throw new Error('NETLIFY_DATABASE_URL no está configurada');
    }
    
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
}

// Función principal
exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Manejar preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Validar token de administración
        const authHeader = event.headers.authorization || event.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Token de autorización requerido' })
            };
        }

        const token = authHeader.replace('Bearer ', '');
        if (!validateAdminToken(token)) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Token de autorización inválido' })
            };
        }

        const client = await connectToDatabase();
        const db = client.db();

        // Determinar la acción basada en el método HTTP y la ruta
        const path = event.path.replace('/.netlify/functions/admin-api/', '');
        const method = event.httpMethod;

        let result;

        switch (method) {
            case 'GET':
                if (path === 'articles' || path === '') {
                    const articles = await db.collection('articles').find({}).sort({ date: -1 }).toArray();
                    result = { articles };
                } else if (path === 'forum-posts' || path === 'posts') {
                    const posts = await db.collection('forum-posts').find({}).sort({ date: -1 }).toArray();
                    result = { posts };
                } else if (path.startsWith('articles/')) {
                    const articleId = path.replace('articles/', '');
                    const article = await db.collection('articles').findOne({ _id: articleId });
                    result = { article };
                } else if (path.startsWith('posts/')) {
                    const postId = path.replace('posts/', '');
                    const post = await db.collection('forum-posts').findOne({ _id: postId });
                    result = { post };
                }
                break;

            case 'POST':
                const body = JSON.parse(event.body || '{}');
                
                if (path === 'articles' || path === '') {
                    const article = {
                        ...body,
                        _id: body.slug || Date.now().toString(),
                        date: new Date().toISOString(),
                        createdAt: new Date().toISOString()
                    };
                    
                    await db.collection('articles').insertOne(article);
                    result = { success: true, article };
                } else if (path === 'forum-posts' || path === 'posts') {
                    const post = {
                        ...body,
                        _id: Date.now().toString(),
                        date: new Date().toISOString(),
                        createdAt: new Date().toISOString()
                    };
                    
                    await db.collection('forum-posts').insertOne(post);
                    result = { success: true, post };
                }
                break;

            case 'PUT':
                const updateBody = JSON.parse(event.body || '{}');
                
                if (path.startsWith('articles/')) {
                    const articleId = path.replace('articles/', '');
                    const updateData = { ...updateBody, updatedAt: new Date().toISOString() };
                    delete updateData._id; // No permitir actualizar el ID
                    
                    await db.collection('articles').updateOne(
                        { _id: articleId },
                        { $set: updateData }
                    );
                    result = { success: true };
                } else if (path.startsWith('posts/')) {
                    const postId = path.replace('posts/', '');
                    const updateData = { ...updateBody, updatedAt: new Date().toISOString() };
                    delete updateData._id; // No permitir actualizar el ID
                    
                    await db.collection('forum-posts').updateOne(
                        { _id: postId },
                        { $set: updateData }
                    );
                    result = { success: true };
                }
                break;

            case 'DELETE':
                if (path.startsWith('articles/')) {
                    const articleId = path.replace('articles/', '');
                    await db.collection('articles').deleteOne({ _id: articleId });
                    result = { success: true };
                } else if (path.startsWith('posts/')) {
                    const postId = path.replace('posts/', '');
                    await db.collection('forum-posts').deleteOne({ _id: postId });
                    result = { success: true };
                }
                break;

            default:
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Método no permitido' })
                };
        }

        await client.close();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Error en admin-api:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Error interno del servidor',
                details: error.message 
            })
        };
    }
}; 