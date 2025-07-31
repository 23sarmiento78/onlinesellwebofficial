const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get IndexNow key from environment variables
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const SITE_URL = process.env.SITE_URL || 'https://www.hgaruna.org';

async function submitToIndexNow(urls) {
  if (!Array.isArray(urls)) {
    urls = [urls];
  }

  // Asegurarse de que las URLs sean absolutas
  urls = urls.map(url => {
    if (!url.startsWith('http')) {
      return new URL(url, SITE_URL).href;
    }
    return url;
  });

  if (!INDEXNOW_KEY) {
    console.error('❌ Error: INDEXNOW_KEY no está configurado en las variables de entorno');
    return false;
  }

  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
  console.log(`🔑 Usando clave IndexNow: ${INDEXNOW_KEY}`);
  console.log(`🔗 Ubicación de verificación: ${keyLocation}`);

  const data = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: keyLocation,
    urlList: urls
  };

  try {
    const response = await axios.post('https://api.indexnow.org/IndexNow', data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Host': 'api.indexnow.org'
      }
    });
    
    console.log('✅ URLs enviadas a IndexNow:', urls);
    console.log('Respuesta:', response.status, response.statusText);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar a IndexNow:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return false;
  }
}

// Ejemplo de uso:
// submitToIndexNow(['https://tusitio.com/articulo1', 'https://tusitio.com/articulo2']);

module.exports = { submitToIndexNow };
