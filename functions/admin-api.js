// API de Administración - Sistema Limpio
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Configuración de Auth0
const AUTH0_CONFIG = {
  domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com',
  audience: 'https://service.hgaruna.org/api'
};

// Cliente JWKS para validar tokens
const client = jwksClient({
  jwksUri: `https://${AUTH0_CONFIG.domain}/.well-known/jwks.json`
});

// Función para obtener la clave pública
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Función para validar token JWT
function validateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      audience: AUTH0_CONFIG.audience,
      issuer: `https://${AUTH0_CONFIG.domain}/`,
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

// Middleware de autenticación
async function authenticateUser(event) {
  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Token de autorización requerido');
    }

    const token = authHeader.substring(7);
    const decoded = await validateToken(token);
    
    return decoded;
  } catch (error) {
    throw new Error('Token inválido: ' + error.message);
  }
}

// Datos simulados (en producción usarías una base de datos)
let articles = [
  {
    id: '1',
    title: 'Desarrollo Web en Villa Carlos Paz',
    description: 'Servicios profesionales de desarrollo web',
    content: 'Contenido del artículo...',
    category: 'Desarrollo Web',
    image: '/images/web-dev.jpg',
    tags: ['web', 'desarrollo', 'villa carlos paz'],
    date: '2024-01-15T10:00:00Z',
    author: 'hgaruna'
  }
];

let forumPosts = [
  {
    id: '1',
    title: 'Bienvenidos al foro',
    content: '¡Bienvenidos a nuestro foro de desarrollo web!',
    category: 'General',
    date: '2024-01-15T10:00:00Z',
    author: 'hgaruna',
    likes: 5,
    comments: [],
    shares: 2
  }
];

// Función principal del handler
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://service.hgaruna.org',
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
    // Autenticar usuario
    const user = await authenticateUser(event);
    console.log('✅ Usuario autenticado:', user.email);

    const path = event.path.replace('/.netlify/functions/admin-api', '');
    const method = event.httpMethod;

    // Rutas de artículos
    if (path.startsWith('/articles')) {
      return await handleArticles(path, method, event, headers);
    }

    // Rutas del foro
    if (path.startsWith('/forum-posts')) {
      return await handleForumPosts(path, method, event, headers);
    }

    // Ruta no encontrada
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Ruta no encontrada' })
    };

  } catch (error) {
    console.error('❌ Error en API:', error);
    
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ 
        message: 'No autorizado',
        error: error.message 
      })
    };
  }
};

// Manejar rutas de artículos
async function handleArticles(path, method, event, headers) {
  const articleId = path.split('/')[2];

  switch (method) {
    case 'GET':
      if (articleId) {
        const article = articles.find(a => a.id === articleId);
        if (!article) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Artículo no encontrado' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(article)
        };
      } else {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(articles)
        };
      }

    case 'POST':
      const newArticle = JSON.parse(event.body);
      newArticle.id = Date.now().toString();
      newArticle.date = new Date().toISOString();
      articles.push(newArticle);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newArticle)
      };

    case 'PUT':
      if (!articleId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'ID de artículo requerido' })
        };
      }
      
      const updateData = JSON.parse(event.body);
      const articleIndex = articles.findIndex(a => a.id === articleId);
      
      if (articleIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Artículo no encontrado' })
        };
      }
      
      articles[articleIndex] = { ...articles[articleIndex], ...updateData };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articles[articleIndex])
      };

    case 'DELETE':
      if (!articleId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'ID de artículo requerido' })
        };
      }
      
      const deleteIndex = articles.findIndex(a => a.id === articleId);
      
      if (deleteIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Artículo no encontrado' })
        };
      }
      
      articles.splice(deleteIndex, 1);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Artículo eliminado' })
      };

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Método no permitido' })
      };
  }
}

// Manejar rutas del foro
async function handleForumPosts(path, method, event, headers) {
  const postId = path.split('/')[2];

  switch (method) {
    case 'GET':
      if (postId) {
        const post = forumPosts.find(p => p.id === postId);
        if (!post) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Publicación no encontrada' })
          };
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(post)
        };
      } else {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(forumPosts)
        };
      }

    case 'POST':
      const newPost = JSON.parse(event.body);
      newPost.id = Date.now().toString();
      newPost.date = new Date().toISOString();
      newPost.likes = 0;
      newPost.comments = [];
      newPost.shares = 0;
      forumPosts.push(newPost);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newPost)
      };

    case 'PUT':
      if (!postId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'ID de publicación requerido' })
        };
      }
      
      const updateData = JSON.parse(event.body);
      const postIndex = forumPosts.findIndex(p => p.id === postId);
      
      if (postIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Publicación no encontrada' })
        };
      }
      
      forumPosts[postIndex] = { ...forumPosts[postIndex], ...updateData };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(forumPosts[postIndex])
      };

    case 'DELETE':
      if (!postId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'ID de publicación requerido' })
        };
      }
      
      const deleteIndex = forumPosts.findIndex(p => p.id === postId);
      
      if (deleteIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: 'Publicación no encontrada' })
        };
      }
      
      forumPosts.splice(deleteIndex, 1);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Publicación eliminada' })
      };

    default:
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ message: 'Método no permitido' })
      };
  }
} 