const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const INDEXNOW_KEY = '48c6858d54754b4eb31de08d89be2f05';
const SITE_URL = process.env.SITE_URL || 'https://tusitio.com'; // Reemplaza con tu URL

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

  const data = {
    host: new URL(SITE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/48c6858d54754b4eb31de08d89be2f05.txt`,
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
