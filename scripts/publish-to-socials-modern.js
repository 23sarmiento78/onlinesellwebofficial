const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog'); // Directorio para leer los HTML
const BLOG_INDEX_PATH = path.join(PUBLIC_DIR, 'blog', 'index.json');
const POSTED_ARTICLES_LOG = path.join(__dirname, 'posted_articles.json');
const IMAGES_OUTPUT_DIR = path.join(__dirname, '..', 'public', 'social-images'); // Guardar imágenes en una carpeta pública

const SITE_URL = 'https://www.hgaruna.org'; // <-- CORRECCIÓN: Usar el dominio con 'www' para que coincida con el certificado SSL

// Configuración de Reddit (usar variables de entorno en producción)
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const REDDIT_REFRESH_TOKEN = process.env.REDDIT_REFRESH_TOKEN;
const REDDIT_USER_AGENT = process.env.REDDIT_USER_AGENT || 'Node.js:hgaruna.org_publisher:v1.0 (by /u/Israelsarmiento5)';

/**
 * Lee un archivo JSON de forma segura.
 * @param {string} filePath - Ruta al archivo.
 * @returns {Promise<any>} - Contenido del JSON o un array vacío si no existe.
 */
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []; // Si el archivo no existe, es la primera vez que se ejecuta.
    }
    throw error;
  }
}

/**
 * Obtiene un nuevo access token usando el refresh token
 */
async function getRedditAccessToken() {
  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': REDDIT_USER_AGENT
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REDDIT_REFRESH_TOKEN
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('❌ Error al obtener access token de Reddit:', error.message);
    throw error;
  }
}

/**
 * Publica un artículo en Reddit usando la API oficial.
 * @param {string} accessToken - Token de acceso de Reddit.
 * @param {object} article - Objeto del artículo.
 * @param {string} subreddit - Nombre del subreddit.
 */
async function postToReddit(accessToken, article, subreddit) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}.html`;
  console.log(`Intentando publicar en Reddit: "${article.title}" en r/${subreddit}`);

  try {
    const response = await fetch(`https://oauth.reddit.com/api/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': REDDIT_USER_AGENT
      },
      body: new URLSearchParams({
        sr: subreddit,
        title: article.title,
        url: articleUrl,
        kind: 'link'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta de Reddit: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.json && data.json.errors && data.json.errors.length > 0) {
      throw new Error(`Error de Reddit: ${JSON.stringify(data.json.errors)}`);
    }

    if (data.json && data.json.data && data.json.data.id) {
      const postId = data.json.data.id;
      console.log(`✅ Publicado en Reddit exitosamente: ${article.title}`);
      console.log(`   URL del post: https://www.reddit.com/r/${subreddit}/comments/${postId}/`);
      return true;
    } else {
      throw new Error('Respuesta inesperada de Reddit');
    }
  } catch (error) {
    console.error(`❌ Error al publicar en Reddit: ${error.message}`);
    return false;
  }
}

/**
 * Genera una imagen para redes sociales a partir de un artículo.
 * @param {object} article - Objeto del artículo.
 */
async function generateInstagramImage(article) {
  console.log(`Generando imagen para Instagram: "${article.title}"`);
  const width = 1080;
  const height = 1080;
  const outputImagePath = path.join(IMAGES_OUTPUT_DIR, `${article.slug}.png`);

  // Limpia el título para que se vea bien en el SVG
  const cleanTitle = article.title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  // Plantilla SVG para la imagen
  const svgImage = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4a00e0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8e2de2;stop-opacity:1" />
        </linearGradient>
        <style>
          .title {
            font-size: 72px;
            font-family: 'Arial', sans-serif;
            fill: white;
            font-weight: bold;
            text-anchor: middle;
            white-space: pre-wrap;
          }
          .brand {
            font-size: 40px;
            font-family: 'Arial', sans-serif;
            fill: #ffffff;
            opacity: 0.8;
            text-anchor: middle;
          }
        </style>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      <text x="${width/2}" y="${height/2}" class="title">${cleanTitle}</text>
      <text x="${width/2}" y="${height-100}" class="brand">hgaruna.org</text>
    </svg>
  `;

  try {
    // Asegurar que el directorio existe
    await fs.mkdir(IMAGES_OUTPUT_DIR, { recursive: true });
    
    // Convertir SVG a PNG usando sharp
    await sharp(Buffer.from(svgImage))
      .png()
      .toFile(outputImagePath);
    
    console.log(`✅ Imagen generada: ${outputImagePath}`);
    return outputImagePath;
  } catch (error) {
    console.error(`❌ Error al generar imagen: ${error.message}`);
    return null;
  }
}

/**
 * Función principal que ejecuta todo el proceso.
 */
async function main() {
  try {
    console.log('🚀 Iniciando publicación en redes sociales...\n');

    // Verificar configuración de Reddit
    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_REFRESH_TOKEN) {
      console.error('❌ Error: Faltan variables de entorno de Reddit.');
      console.error('   Asegúrate de configurar: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_REFRESH_TOKEN');
      process.exit(1);
    }

    // Leer el índice de artículos
    const articles = await readJsonFile(BLOG_INDEX_PATH);
    if (!articles || articles.length === 0) {
      console.log('ℹ️ No se encontraron artículos para publicar.');
      return;
    }

    // Leer el registro de artículos ya publicados
    const postedArticles = await readJsonFile(POSTED_ARTICLES_LOG);
    const postedSlugs = new Set(postedArticles.map(article => article.slug));

    // Filtrar artículos no publicados
    const unpublishedArticles = articles.filter(article => !postedSlugs.has(article.slug));

    if (unpublishedArticles.length === 0) {
      console.log('ℹ️ Todos los artículos ya han sido publicados.');
      return;
    }

    console.log(`📝 Encontrados ${unpublishedArticles.length} artículos sin publicar.`);

    // Obtener access token de Reddit
    console.log('🔑 Obteniendo access token de Reddit...');
    const accessToken = await getRedditAccessToken();
    console.log('✅ Access token obtenido exitosamente.');

    // Subreddits donde publicar (ajusta según tu nicho)
    const subreddits = [
      'programming',
      'webdev',
      'javascript',
      'reactjs'
    ];

    let successCount = 0;

    // Procesar cada artículo
    for (const article of unpublishedArticles) {
      console.log(`\n📄 Procesando: "${article.title}"`);
      
      // Generar imagen para Instagram
      const imagePath = await generateInstagramImage(article);
      
      // Publicar en Reddit
      let redditSuccess = false;
      for (const subreddit of subreddits) {
        try {
          redditSuccess = await postToReddit(accessToken, article, subreddit);
          if (redditSuccess) {
            break; // Si se publicó exitosamente en un subreddit, no intentar en otros
          }
          // Esperar un poco entre intentos para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`   Error en r/${subreddit}: ${error.message}`);
        }
      }

      if (redditSuccess) {
        successCount++;
        // Registrar el artículo como publicado
        postedArticles.push({
          slug: article.slug,
          title: article.title,
          publishedAt: new Date().toISOString(),
          platforms: ['reddit']
        });
      }

      // Esperar entre publicaciones para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Guardar el registro actualizado
    await fs.writeFile(POSTED_ARTICLES_LOG, JSON.stringify(postedArticles, null, 2));
    
    console.log(`\n✅ Proceso completado. ${successCount} artículos publicados exitosamente.`);
    console.log(`📊 Total de artículos publicados: ${postedArticles.length}`);

  } catch (error) {
    console.error('❌ Error en el proceso principal:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  main,
  postToReddit,
  generateInstagramImage
};
