const fs = require('fs').promises;
const path = require('path');

// Configuración de LinkedIn
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const DATA_DIR = path.join(__dirname, '../public/data');

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

// Función para obtener token de acceso de LinkedIn
async function getLinkedInAccessToken(code, redirectUri) {
    try {
        const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: LINKEDIN_CLIENT_ID,
                client_secret: LINKEDIN_CLIENT_SECRET
            })
        });

        if (!response.ok) {
            throw new Error(`Error obteniendo token: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error obteniendo token de LinkedIn:', error);
        throw error;
    }
}

// Función para obtener información del perfil de LinkedIn
async function getLinkedInProfile(accessToken) {
    try {
        const response = await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        if (!response.ok) {
            throw new Error(`Error obteniendo perfil: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error obteniendo perfil de LinkedIn:', error);
        throw error;
    }
}

// Función para publicar en LinkedIn
async function publishToLinkedIn(accessToken, content) {
    try {
        // Primero obtener el perfil para obtener el URN
        const profile = await getLinkedInProfile(accessToken);
        
        // Crear la publicación
        const postData = {
            author: `urn:li:person:${profile.id}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: content
                    },
                    shareMediaCategory: 'NONE'
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error publicando en LinkedIn: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        // Guardar registro de la publicación
        const linkedinPosts = await readJsonFile('linkedin-posts.json') || { posts: [] };
        linkedinPosts.posts.push({
            id: generateId(),
            linkedinPostId: result.id,
            content: content,
            publishedAt: new Date().toISOString(),
            status: 'published'
        });
        
        await writeJsonFile('linkedin-posts.json', linkedinPosts);
        
        return { success: true, postId: result.id, message: 'Publicado exitosamente en LinkedIn' };
    } catch (error) {
        console.error('Error publicando en LinkedIn:', error);
        return { success: false, message: error.message };
    }
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
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
        const { path: requestPath } = event;
        const pathSegments = requestPath.split('/').filter(Boolean);
        const endpoint = pathSegments[pathSegments.length - 1];

        console.log('LinkedIn API - Endpoint:', endpoint);
        console.log('LinkedIn API - Método:', event.httpMethod);

        // Endpoint para autorización
        if (endpoint === 'auth') {
            if (event.httpMethod === 'POST') {
                console.log('🔗 Procesando autorización de LinkedIn...');
                console.log('📋 Variables de entorno:');
                console.log('- LINKEDIN_CLIENT_ID:', LINKEDIN_CLIENT_ID ? 'Configurado' : 'NO CONFIGURADO');
                console.log('- LINKEDIN_CLIENT_SECRET:', LINKEDIN_CLIENT_SECRET ? 'Configurado' : 'NO CONFIGURADO');
                
                const { code, redirectUri } = JSON.parse(event.body || '{}');
                console.log('📋 Datos recibidos:');
                console.log('- code:', code ? 'Presente' : 'Ausente');
                console.log('- redirectUri:', redirectUri);

                if (!code || !redirectUri) {
                    console.log('❌ Datos faltantes');
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Código y redirect_uri requeridos' })
                    };
                }

                try {
                    console.log('🔄 Obteniendo token de acceso...');
                    const accessToken = await getLinkedInAccessToken(code, redirectUri);
                    console.log('✅ Token obtenido:', accessToken ? 'Exitoso' : 'Fallido');
                    
                    console.log('🔄 Obteniendo perfil...');
                    const profile = await getLinkedInProfile(accessToken);
                    console.log('✅ Perfil obtenido:', profile ? 'Exitoso' : 'Fallido');

                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            accessToken: accessToken,
                            profile: profile
                        })
                    };
                } catch (error) {
                    console.error('❌ Error en autorización:', error.message);
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({
                            success: false,
                            error: error.message
                        })
                    };
                }
            }
        }

        // Endpoint para publicar
        if (endpoint === 'post') {
            if (event.httpMethod === 'POST') {
                const { content, accessToken } = JSON.parse(event.body || '{}');

                if (!content) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Contenido requerido' })
                    };
                }

                if (!accessToken) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Token de acceso requerido' })
                    };
                }

                const result = await publishToLinkedIn(accessToken, content);

                return {
                    statusCode: result.success ? 200 : 500,
                    headers,
                    body: JSON.stringify(result)
                };
            }
        }

        // Endpoint para verificar token
        if (endpoint === 'verify') {
            if (event.httpMethod === 'POST') {
                const { accessToken } = JSON.parse(event.body || '{}');

                if (!accessToken) {
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Token de acceso requerido' })
                    };
                }

                try {
                    // Verificar el token intentando obtener el perfil
                    const profile = await getLinkedInProfile(accessToken);
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            valid: true,
                            profile: profile
                        })
                    };
                } catch (error) {
                    console.error('Token de LinkedIn inválido:', error);
                    
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            valid: false,
                            message: 'Token inválido o expirado'
                        })
                    };
                }
            }
        }

        // Endpoint para obtener publicaciones
        if (endpoint === 'posts') {
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
        console.error('Error en LinkedIn API:', error);
        
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