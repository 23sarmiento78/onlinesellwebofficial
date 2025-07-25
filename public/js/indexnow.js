// IndexNow API Configuration
// ✅ CONFIGURADO CON CREDENCIALES REALES

const INDEXNOW_CONFIG = {
  // 🌐 HOST: Tu dominio (sin https://)
  HOST: 'hgaruna.org',
  
  // 🔑 KEY: Tu clave API de Bing Webmaster Tools
  KEY: 'a47126d3c4454692a3089dfa0c5d6ba6',
  
  // 🔗 API_ENDPOINT: URL de la API de IndexNow
  API_ENDPOINT: 'https://api.indexnow.org/IndexNow'
};

/**
 * Función para enviar URLs a la API de IndexNow.
 * @param {string[]} urlList - Array de URLs a enviar
 */
async function submitUrlsToIndexNow(urlList) {
    if (!INDEXNOW_CONFIG.KEY || INDEXNOW_CONFIG.KEY === 'TU_CLAVE_API_AQUI') {
        console.log('⚠️ IndexNow no configurado. Configura tu clave API en indexnow.js');
        return;
    }

    const data = {
        host: INDEXNOW_CONFIG.HOST,
        key: INDEXNOW_CONFIG.KEY,
        urlList: urlList
    };

    try {
        const response = await fetch(INDEXNOW_CONFIG.API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('✅ IndexNow: URLs enviadas exitosamente');
            return { success: true, status: response.status };
        } else {
            const errorData = await response.json();
            console.error('❌ IndexNow: Error al enviar URLs', errorData);
            return { success: false, error: errorData };
        }
    } catch (error) {
        console.error('❌ IndexNow: Error de conexión', error);
        return { success: false, error: error.message };
    }
}

// Función para enviar una sola URL
async function submitUrlToIndexNow(url) {
    return await submitUrlsToIndexNow([url]);
}

// Función para enviar sitemap
async function submitSitemapToIndexNow() {
    const sitemapUrl = `https://${INDEXNOW_CONFIG.HOST}/sitemap.xml`;
    return await submitUrlToIndexNow(sitemapUrl);
}

// Exportar funciones para uso global
window.IndexNow = {
    submitUrls: submitUrlsToIndexNow,
    submitUrl: submitUrlToIndexNow,
    submitSitemap: submitSitemapToIndexNow,
    config: INDEXNOW_CONFIG
};
