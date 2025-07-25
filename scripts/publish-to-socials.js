const fs = require('fs').promises;
const path = require('path');
const snoowrap = require('snoowrap');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_INDEX_PATH = path.join(PUBLIC_DIR, 'blog', 'index.json');
const POSTED_ARTICLES_LOG = path.join(__dirname, 'posted_articles.json');
const IMAGES_OUTPUT_DIR = path.join(__dirname, 'generated-social-images');

const SITE_URL = 'https://hgaruna.org'; // <-- IMPORTANTE: Cambia esto a tu dominio final

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
 * Publica un artículo en Reddit.
 * @param {snoowrap} redditClient - Cliente de snoowrap.
 * @param {object} article - Objeto del artículo.
 * @param {string} subreddit - Nombre del subreddit.
 */
async function postToReddit(redditClient, article, subreddit) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}.html`;
  console.log(`Intentando publicar en Reddit: "${article.title}" en r/${subreddit}`);

  try {
    await redditClient.getSubreddit(subreddit).submitLink({
      title: article.title,
      url: articleUrl,
    });
    console.log(`✅ Publicado en Reddit exitosamente: ${article.title}`);
  } catch (error) {
    console.error(`❌ Error al publicar en Reddit: ${error.message}`);
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
      <text x="50%" y="45%" class="title">
        ${
          // Simple word wrap
          cleanTitle.split(' ').reduce((acc, word) => {
            let lastLine = acc[acc.length - 1];
            if (lastLine && lastLine.length + word.length + 1 < 25) {
              acc[acc.length - 1] = lastLine + ' ' + word;
            } else {
              acc.push(word);
            }
            return acc;
          }, []).map((line, index) => `<tspan x="50%" dy="${index === 0 ? 0 : '1.2em'}">${line}</tspan>`).join('')
        }
      </text>
      <text x="50%" y="90%" class="brand">hgaruna.org</text>
    </svg>
  `;

  try {
    await fs.mkdir(IMAGES_OUTPUT_DIR, { recursive: true });
    await sharp(Buffer.from(svgImage)).toFile(outputImagePath);
    console.log(`✅ Imagen para Instagram generada en: ${outputImagePath}`);
  } catch (error) {
    console.error(`❌ Error al generar la imagen para Instagram: ${error.message}`);
  }
}

/**
 * Función principal
 */
async function main() {
  // --- Lógica de Reddit ---
  const {
    REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET,
    REDDIT_USERNAME,
    REDDIT_PASSWORD,
    REDDIT_REFRESH_TOKEN,
    REDDIT_SUBREDDIT,
  } = process.env;

  const redditEnabled = REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET && REDDIT_USERNAME && REDDIT_PASSWORD && REDDIT_REFRESH_TOKEN && REDDIT_SUBREDDIT;

  let redditClient;
  if (redditEnabled) {
    redditClient = new snoowrap({
      userAgent: 'GitHub Actions Article Publisher v1.0 by /u/' + REDDIT_USERNAME,
      clientId: REDDIT_CLIENT_ID,
      clientSecret: REDDIT_CLIENT_SECRET,
      refreshToken: REDDIT_REFRESH_TOKEN,
    });
    console.log("Cliente de Reddit inicializado.");
  } else {
    console.log("Credenciales de Reddit no configuradas. Omitiendo publicación en Reddit.");
  }

  // --- Lógica para encontrar nuevos artículos ---
  const allArticleFiles = await readJsonFile(BLOG_INDEX_PATH);
  const postedArticleSlugs = await readJsonFile(POSTED_ARTICLES_LOG);
  
  // Asumimos que el `index.json` solo tiene los slugs de los archivos html
  const allArticleSlugs = allArticleFiles.map(file => file.replace('.html', ''));

  const newArticleSlugs = allArticleSlugs.filter(slug => !postedArticleSlugs.includes(slug));

  if (newArticleSlugs.length === 0) {
    console.log("No hay artículos nuevos para publicar.");
    return;
  }

  console.log(`Se encontraron ${newArticleSlugs.length} artículos nuevos para publicar.`);

  // Para obtener el título, necesitamos leer la información del artículo.
  // Asumimos que tienes un JSON con todos los datos de los artículos.
  // Usaremos `public/data/articles.json` que parece tener esta info.
  const articlesData = await readJsonFile(path.join(PUBLIC_DIR, 'data', 'articles.json'));
  const newArticles = articlesData.articles.filter(article => newArticleSlugs.includes(article.slug));

  for (const article of newArticles) {
    if (redditEnabled) {
      await postToReddit(redditClient, article, REDDIT_SUBREDDIT);
    }
    await generateInstagramImage(article);
  }

  // Actualizar el log de artículos publicados
  const updatedPostedSlugs = [...postedArticleSlugs, ...newArticleSlugs];
  await fs.writeFile(POSTED_ARTICLES_LOG, JSON.stringify(updatedPostedSlugs, null, 2));
  console.log("Log de artículos publicados actualizado.");
}

main().catch(console.error);