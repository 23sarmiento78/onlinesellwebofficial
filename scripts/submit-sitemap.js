const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const INDEXING_FUNCTION_URL = 'https://service.hgaruna.org/.netlify/functions/index-page';
const SITEMAP_PATH = path.resolve(__dirname, '../dist/sitemap-index.xml'); // Ruta corregida

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
        const urls = result.urlset.url.map(item => item.loc[0]);

        for (const url of urls) {
            await submitUrlForIndexing(url);
        }
        console.log('Proceso de sitemap completado.');
    } catch (error) {
        console.error('Error al parsear el sitemap:', error.message);
    }
}

processSitemap(); 