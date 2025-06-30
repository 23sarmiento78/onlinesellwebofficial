const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DATA_DIR = path.join(__dirname, '../public/data');

// Verificar token JWT
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// Función para leer archivos JSON
async function readJsonFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error leyendo ${filename}:`, error);
        return null;
    }
}

// Función para escribir archivos JSON
async function writeJsonFile(filename, data) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error escribiendo ${filename}:`, error);
        return false;
    }
}

// Función para generar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para publicar en LinkedIn
async function publishToLinkedIn(content, linkedinToken) {
    try {
        // Aquí implementarías la lógica real de LinkedIn API
        // Por ahora simulamos la publicación
        console.log('Publicando en LinkedIn:', content);
        
        // Guardar registro de publicación
        const linkedinPosts = await readJsonFile('linkedin-posts.json') || { posts: [] };
        linkedinPosts.posts.push({
            id: generateId(),
            content: content,
            publishedAt: new Date().toISOString(),
            status: 'published'
        });
        
        await writeJsonFile('linkedin-posts.json', linkedinPosts);
        
        return { success: true, message: 'Publicado en LinkedIn' };
    } catch (error) {
        console.error('Error publicando en LinkedIn:', error);
        return { success: false, message: 'Error al publicar en LinkedIn' };
    }
}

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
        // Verificar autenticación
        const authHeader = event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Token de autorización requerido' })
            };
        }

        const token = authHeader.substring(7);
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Token inválido' })
            };
        }

        const { path: requestPath } = event;
        const pathSegments = requestPath.split('/').filter(Boolean);
        const endpoint = pathSegments[pathSegments.length - 1];

        console.log('Endpoint solicitado:', endpoint);
        console.log('Método HTTP:', event.httpMethod);

        // Endpoint de estadísticas
        if (endpoint === 'stats') {
            if (event.httpMethod === 'GET') {
                const articles = await readJsonFile('articles.json') || { articles: [] };
                const forumPosts = await readJsonFile('forum-posts.json') || { posts: [] };
                const linkedinPosts = await readJsonFile('linkedin-posts.json') || { posts: [] };

                const stats = {
                    articles: articles.articles.length,
                    posts: forumPosts.posts.length,
                    views: 0, // Implementar contador de vistas
                    linkedinPosts: linkedinPosts.posts.length
                };

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(stats)
                };
            }
        }

        // Endpoint de artículos
        if (endpoint === 'articles') {
            const articlesFile = await readJsonFile('articles.json') || { articles: [] };

            if (event.httpMethod === 'GET') {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(articlesFile)
                };
            }

            if (event.httpMethod === 'POST') {
                const articleData = JSON.parse(event.body);
                
                const newArticle = {
                    id: generateId(),
                    title: articleData.title,
                    description: articleData.description,
                    content: articleData.content,
                    tags: articleData.tags || [],
                    image: articleData.image || '',
                    author: decoded.email || 'Admin',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    published: true,
                    views: 0
                };

                articlesFile.articles.push(newArticle);
                await writeJsonFile('articles.json', articlesFile);

                // Publicar en LinkedIn si está habilitado
                if (articleData.publishLinkedIn) {
                    const linkedinContent = `${articleData.title}\n\n${articleData.description}\n\nLee más en nuestro blog: ${process.env.SITE_URL || 'https://tusitio.com'}`;
                    await publishToLinkedIn(linkedinContent, null);
                }

                return {
                    statusCode: 201,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        article: newArticle,
                        message: 'Artículo creado exitosamente'
                    })
                };
            }

            if (event.httpMethod === 'PUT') {
                const articleData = JSON.parse(event.body);
                const articleId = articleData.id;

                const articleIndex = articlesFile.articles.findIndex(a => a.id === articleId);
                if (articleIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Artículo no encontrado' })
                    };
                }

                articlesFile.articles[articleIndex] = {
                    ...articlesFile.articles[articleIndex],
                    ...articleData,
                    updatedAt: new Date().toISOString()
                };

                await writeJsonFile('articles.json', articlesFile);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        article: articlesFile.articles[articleIndex],
                        message: 'Artículo actualizado exitosamente'
                    })
                };
            }

            if (event.httpMethod === 'DELETE') {
                const { id } = JSON.parse(event.body);
                
                const articleIndex = articlesFile.articles.findIndex(a => a.id === id);
                if (articleIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Artículo no encontrado' })
                    };
                }

                articlesFile.articles.splice(articleIndex, 1);
                await writeJsonFile('articles.json', articlesFile);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        message: 'Artículo eliminado exitosamente'
                    })
                };
            }
        }

        // Endpoint de publicaciones del foro
        if (endpoint === 'forum-posts') {
            const forumPostsFile = await readJsonFile('forum-posts.json') || { posts: [] };

            if (event.httpMethod === 'GET') {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(forumPostsFile)
                };
            }

            if (event.httpMethod === 'POST') {
                const postData = JSON.parse(event.body);
                
                const newPost = {
                    id: generateId(),
                    title: postData.title,
                    content: postData.content,
                    category: postData.category,
                    author: decoded.email || 'Admin',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    published: true,
                    views: 0,
                    replies: []
                };

                forumPostsFile.posts.push(newPost);
                await writeJsonFile('forum-posts.json', forumPostsFile);

                // Publicar en LinkedIn si está habilitado
                if (postData.publishLinkedIn) {
                    const linkedinContent = `Nueva discusión en nuestro foro: ${postData.title}\n\n${postData.content.substring(0, 200)}...\n\nÚnete a la conversación: ${process.env.SITE_URL || 'https://tusitio.com'}/foro`;
                    await publishToLinkedIn(linkedinContent, null);
                }

                return {
                    statusCode: 201,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        post: newPost,
                        message: 'Publicación del foro creada exitosamente'
                    })
                };
            }

            if (event.httpMethod === 'PUT') {
                const postData = JSON.parse(event.body);
                const postId = postData.id;

                const postIndex = forumPostsFile.posts.findIndex(p => p.id === postId);
                if (postIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Publicación no encontrada' })
                    };
                }

                forumPostsFile.posts[postIndex] = {
                    ...forumPostsFile.posts[postIndex],
                    ...postData,
                    updatedAt: new Date().toISOString()
                };

                await writeJsonFile('forum-posts.json', forumPostsFile);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        post: forumPostsFile.posts[postIndex],
                        message: 'Publicación actualizada exitosamente'
                    })
                };
            }

            if (event.httpMethod === 'DELETE') {
                const { id } = JSON.parse(event.body);
                
                const postIndex = forumPostsFile.posts.findIndex(p => p.id === id);
                if (postIndex === -1) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Publicación no encontrada' })
                    };
                }

                forumPostsFile.posts.splice(postIndex, 1);
                await writeJsonFile('forum-posts.json', forumPostsFile);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ 
                        success: true, 
                        message: 'Publicación eliminada exitosamente'
                    })
                };
            }
        }

        // Endpoint de LinkedIn
        if (endpoint === 'linkedin') {
            if (event.httpMethod === 'POST') {
                const { content, linkedinToken } = JSON.parse(event.body);
                
                if (!content) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Contenido requerido' })
                    };
                }

                const result = await publishToLinkedIn(content, linkedinToken);

                return {
                    statusCode: result.success ? 200 : 500,
                    headers,
                    body: JSON.stringify(result)
                };
            }

            if (event.httpMethod === 'GET') {
                const linkedinPosts = await readJsonFile('linkedin-posts.json') || { posts: [] };
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(linkedinPosts)
                };
            }
        }

        // Endpoint no encontrado
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Endpoint no encontrado' })
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