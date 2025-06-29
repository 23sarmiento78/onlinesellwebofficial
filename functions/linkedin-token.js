// Función de Netlify para intercambiar código de autorización de LinkedIn por token de acceso
exports.handler = async (event, context) => {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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

  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { code, redirect_uri } = JSON.parse(event.body);

    if (!code || !redirect_uri) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Código y redirect_uri son requeridos' })
      };
    }

    // Configuración de LinkedIn (usar variables de entorno en producción)
    const clientId = process.env.LINKEDIN_CLIENT_ID || '86qj8qj8qj8qj8qj8qj8';
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_LINKEDIN_CLIENT_SECRET';

    // URL para intercambiar código por token
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

    // Datos para el intercambio
    const tokenData = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri,
      client_id: clientId,
      client_secret: clientSecret
    });

    // Realizar la petición a LinkedIn
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenData.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de LinkedIn:', errorText);
      
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Error intercambiando código por token',
          details: errorText
        })
      };
    }

    const tokenResponse = await response.json();

    // Verificar que tenemos el token de acceso
    if (!tokenResponse.access_token) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'No se recibió el token de acceso de LinkedIn',
          response: tokenResponse
        })
      };
    }

    // Devolver el token de acceso
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: tokenResponse.access_token,
        expires_in: tokenResponse.expires_in,
        scope: tokenResponse.scope
      })
    };

  } catch (error) {
    console.error('Error en linkedin-token:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error interno del servidor',
        message: error.message
      })
    };
  }
}; 