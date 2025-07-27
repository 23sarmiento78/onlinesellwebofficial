const fs = require('fs').promises;
const path = require('path');
const snoowrap = require('snoowrap');
const sharp = require('sharp');

// Configuración
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog');
const BLOG_INDEX_PATH = path.join(PUBLIC_DIR, 'blog', 'index.json');
const POSTED_ARTICLES_LOG = path.join(__dirname, 'posted_articles.json');
const IMAGES_OUTPUT_DIR = path.join(PUBLIC_DIR, 'social-images');
const SITE_URL = 'https://www.hgaruna.org';

// Obtener la lista de subreddits de la variable de entorno
const TARGET_SUBREDDITS = process.env.REDDIT_SUBREDDITS
  ? process.env.REDDIT_SUBREDDITS
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  : ['programming']; // Valor por defecto

// Inicializar cliente de Reddit
let redditClient;

/**
 * Publica un artículo en un subreddit
 */
async function postToReddit(article, subreddit) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}.html`;
  console.log(`Publicando en r/${subreddit}: "${article.title}"`);

  try {
    const submission = await redditClient.getSubreddit(subreddit).submitLink({
      title: article.title,
      url: articleUrl,
      sendReplies: true
    });
    console.log(`✅ Publicado exitosamente en r/${subreddit}`);
    console.log(`   URL: https://www.reddit.com${submission.permalink}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al publicar en r/${subreddit}:`, error.message);
    if (error.response?.body) {
      console.error('Detalles del error:', JSON.stringify(error.response.body, null, 2));
    }
    return false;
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    // Inicializar cliente de Reddit
    redditClient = new snoowrap({
      userAgent: 'hgaruna-bot/1.0',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });

    console.log(`📰 Iniciando publicación en ${TARGET_SUBREDDITS.length} subreddits...`);

    // Obtener el artículo más reciente
    const files = await fs.readdir(BLOG_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    if (htmlFiles.length === 0) {
      console.log('No se encontraron artículos para publicar');
      return;
    }

    // Ordenar por fecha de modificación (más reciente primero)
    const latestArticle = htmlFiles
      .map(file => ({ 
        name: file, 
        time: fs.statSync(path.join(BLOG_DIR, file)).mtime.getTime() 
      }))
      .sort((a, b) => b.time - a.time)[0].name;

    // Leer el contenido del artículo
    const htmlContent = await fs.readFile(path.join(BLOG_DIR, latestArticle), 'utf8');
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Nuevo Artículo';

    const article = {
      title,
      slug: latestArticle.replace('.html', '')
    };

    console.log(`📝 Artículo a publicar: "${article.title}"`);

    // Publicar en cada subreddit
    for (const subreddit of TARGET_SUBREDDITS) {
      await postToReddit(article, subreddit);
      
      // Esperar 1 minuto entre publicaciones para evitar límites de tasa
      if (TARGET_SUBREDDITS.indexOf(subreddit) < TARGET_SUBREDDITS.length - 1) {
        const waitTime = 60 * 1000; // 1 minuto
        console.log(`⏳ Esperando ${waitTime/1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    console.log('✅ Publicación completada en todos los subreddits');

  } catch (error) {
    console.error('❌ Error en la ejecución principal:', error);
    process.exit(1);
  }
}

main();