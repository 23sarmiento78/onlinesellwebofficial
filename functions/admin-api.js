const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configuración de Auth0
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'dev-b0qip4vee7sg3q7e.us.auth0.com';
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || 'https://service.hgaruna.org/api';

// Cliente JWKS para verificar tokens
const client = jwksClient({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

// Función para obtener la clave pública
function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

// Función para verificar el token JWT
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
            audience: AUTH0_AUDIENCE,
            issuer: `https://${AUTH0_DOMAIN}/`,
            algorithms: ['RS256']
        }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

// Función para extraer el token del header Authorization
function extractToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

// Middleware para verificar autenticación
async function requireAuth(event) {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = extractToken(authHeader);
    
    if (!token) {
        throw new Error('Token no proporcionado');
    }
    
    try {
        const decoded = await verifyToken(token);
        return decoded;
    } catch (error) {
        throw new Error('Token inválido');
    }
}

// Función principal de la API
exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': 'https://service.hgaruna.org',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
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
        // Verificar autenticación para todas las rutas excepto OPTIONS
        const user = await requireAuth(event);
        
        const { path } = event;
        const method = event.httpMethod;

        // Rutas de la API
        if (path.includes('/api/articles')) {
            return handleArticles(event, method, user);
        } else if (path.includes('/api/forum-posts')) {
            return handleForumPosts(event, method, user);
        } else if (path.includes('/api/stats')) {
            return handleStats(event, method, user);
        } else {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Ruta no encontrada' })
            };
        }

    } catch (error) {
        console.error('Error en la API:', error);
        
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ 
                error: 'No autorizado',
                message: error.message 
            })
        };
    }
};

// Manejador para artículos
function handleArticles(event, method, user) {
    const headers = {
        'Access-Control-Allow-Origin': 'https://service.hgaruna.org',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    switch (method) {
        case 'GET':
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: 'Lista de artículos',
                    user: user.sub,
                    articles: []
                })
            };
        
        case 'POST':
            const body = JSON.parse(event.body || '{}');
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    message: 'Artículo creado',
                    article: body,
                    user: user.sub
                })
            };
        
        default:
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
    }
}

// Manejador para publicaciones del foro
function handleForumPosts(event, method, user) {
    const headers = {
        'Access-Control-Allow-Origin': 'https://service.hgaruna.org',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    switch (method) {
        case 'GET':
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: 'Lista de publicaciones del foro',
                    user: user.sub,
                    posts: []
                })
            };
        
        case 'POST':
            const body = JSON.parse(event.body || '{}');
            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    message: 'Publicación creada',
                    post: body,
                    user: user.sub
                })
            };
        
        default:
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
    }
}

// Manejador para estadísticas
function handleStats(event, method, user) {
    const headers = {
        'Access-Control-Allow-Origin': 'https://service.hgaruna.org',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (method === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: 'Estadísticas del sitio',
                user: user.sub,
                stats: {
                    totalArticles: 0,
                    totalPosts: 0,
                    totalUsers: 0,
                    lastActivity: new Date().toISOString()
                }
            })
        };
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método no permitido' })
    };
} 