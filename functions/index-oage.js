    // functions/index-page.js
    const { google } = require('googleapis');

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

        // Decodificar la clave de servicio desde la variable de entorno
        let privatekey;
        try {
            const privateKeyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
            if (!privateKeyBase64) {
                throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 no está configurada.');
            }
            privatekey = JSON.parse(Buffer.from(privateKeyBase64, 'base64').toString('utf8'));
        } catch (error) {
            console.error('Error al decodificar la clave de servicio:', error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error de configuración de la clave de servicio', details: error.message })
            };
        }

        try {
            // Configura la autenticación JWT
            const jwtClient = new google.auth.JWT(
                privatekey.client_email,
                null,
                privatekey.private_key,
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

            console.log('API de Indexación Response:', res.data);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'URL enviada para indexación', response: res.data })
            };
        } catch (error) {
            console.error('Error al enviar a la API de Indexación:', error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error al enviar a la API de Indexación', details: error.message })
            };
        }
    };