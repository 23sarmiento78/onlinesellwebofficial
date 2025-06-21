const { google } = require('googleapis');
const { Buffer } = require('buffer'); // Importa Buffer explícitamente

const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Método no permitido. Usa POST.'
        };
    }

    let requestBody;
    try {
        requestBody = JSON.parse(event.body);
    } catch (e) {
        return {
            statusCode: 400,
            body: 'El cuerpo de la solicitud debe ser un JSON válido.'
        };
    }

    const { url } = requestBody;

    if (!url) {
        return {
            statusCode: 400,
            body: 'Falta el parámetro "url" en el cuerpo JSON.'
        };
    }

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
}; 