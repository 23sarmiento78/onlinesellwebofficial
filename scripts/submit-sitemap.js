const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const INDEXING_FUNCTION_URL = 'https://service.hgaruna.org/.netlify/functions/index-page';
const SITEMAP_PATH = path.resolve(__dirname, '../dist/sitemap-index.xml');

async function submitUrlForIndexing(url) {
    try {
        const response = await axios.post(INDEXING_FUNCTION_URL, { url: url });
        console.log(`URL ${url} enviada con éxito:`, response.data);
    } catch (error) {
        console.error(`Error al enviar URL ${url}:`, error.response ? error.response.data : error.message);
    }
}

async function processSitemap() {
    if (!fs.existsSync(SITEMAP_PATH)) {
        console.log('Sitemap no encontrado en:', SITEMAP_PATH);
        return;
    }

    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const parser = new xml2js.Parser();

    try {
        const result = await parser.parseStringPromise(sitemapContent);
        
        // Verificar la estructura del sitemap
        if (result.sitemapindex && result.sitemapindex.sitemap) {
            // Es un sitemap index, procesar cada sitemap individual
            const sitemaps = result.sitemapindex.sitemap;
            for (const sitemap of sitemaps) {
                const sitemapUrl = sitemap.loc[0];
                console.log(`Procesando sitemap: ${sitemapUrl}`);
                // Aquí podrías hacer una petición para obtener el contenido del sitemap individual
                // Por ahora, solo enviamos la URL del sitemap
                await submitUrlForIndexing(sitemapUrl);
            }
        } else if (result.urlset && result.urlset.url) {
            // Es un sitemap normal con URLs
            const urls = result.urlset.url.map(item => item.loc[0]);
            for (const url of urls) {
                await submitUrlForIndexing(url);
            }
        } else {
            console.log('Estructura de sitemap no reconocida');
            console.log('Estructura encontrada:', JSON.stringify(result, null, 2));
        }
        
        console.log('Proceso de sitemap completado.');
    } catch (error) {
        console.error('Error al parsear el sitemap:', error.message);
        // No fallar el build por este error
        process.exit(0);
    }
}

processSitemap(); 