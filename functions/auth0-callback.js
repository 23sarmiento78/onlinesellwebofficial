const jwt = require('jsonwebtoken');

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || 'dev-b0qip4vee7sg3q7e.us.auth0.com';
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab';
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Método no permitido' })
            };
        }

        const { auth0Token } = JSON.parse(event.body || '{}');

        if (!auth0Token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Token de Auth0 requerido' })
            };
        }

        // Verificar el token de Auth0
        const auth0Response = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
            headers: {
                'Authorization': `Bearer ${auth0Token}`
            }
        });

        if (!auth0Response.ok) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Token de Auth0 inválido' })
            };
        }

        const userInfo = await auth0Response.json();

        // Generar token JWT personalizado
        const jwtToken = jwt.sign({
            sub: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
        }, JWT_SECRET);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                token: jwtToken,
                user: {
                    sub: userInfo.sub,
                    email: userInfo.email,
                    name: userInfo.name,
                    picture: userInfo.picture
                }
            })
        };

    } catch (error) {
        console.error('Error en auth0-callback:', error);
        
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