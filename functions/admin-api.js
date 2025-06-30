const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// --- NUEVO LOGIN LOCAL ---
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'hgaruna-jwt-secret-key-2025';
const ARTICLES_PATH = path.join(__dirname, '../public/data/articles.json');
const FORUM_PATH = path.join(__dirname, '../public/data/forum-posts.json');

exports.handler = async function(event, context) {
  // --- LOGIN ---
  if (event.httpMethod === 'POST' && event.path.endsWith('/login')) {
    const { username, password } = JSON.parse(event.body || '{}');
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
      return {
        statusCode: 200,
        body: JSON.stringify({ token })
      };
    } else {
      return { statusCode: 401, body: JSON.stringify({ error: 'Credenciales inválidas' }) };
    }
  }

  // --- PROTECCIÓN JWT ---
  const authHeader = event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return { statusCode: 401, body: 'No token provided' };
  }
  try {
    jwt.verify(token, JWT_SECRET, { algorithms: ['HS256', 'HS384', 'HS512', 'HS1'] });
  } catch (err) {
    return { statusCode: 403, body: 'Token inválido' };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    if (body.action === 'create-article' && body.article) {
      try {
        let articles = [];
        if (fs.existsSync(ARTICLES_PATH)) {
          articles = JSON.parse(fs.readFileSync(ARTICLES_PATH, 'utf8'));
        }
        const newArticle = {
          ...body.article,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        articles.unshift(newArticle);
        fs.writeFileSync(ARTICLES_PATH, JSON.stringify(articles, null, 2));
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, article: newArticle })
        };
      } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Error guardando el artículo' }) };
      }
    }
    if (body.action === 'create-forum-post' && body.post) {
      try {
        let posts = [];
        if (fs.existsSync(FORUM_PATH)) {
          posts = JSON.parse(fs.readFileSync(FORUM_PATH, 'utf8'));
        }
        const newPost = {
          ...body.post,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        posts.unshift(newPost);
        fs.writeFileSync(FORUM_PATH, JSON.stringify(posts, null, 2));
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, post: newPost })
        };
      } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Error guardando la publicación del foro' }) };
      }
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