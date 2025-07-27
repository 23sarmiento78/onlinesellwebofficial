const fs = require('fs').promises;
const path = require('path');
const snoowrap = require('snoowrap');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog');
const POSTED_ARTICLES_LOG = path.join(__dirname, 'posted_articles.json');
const SITE_URL = 'https://www.hgaruna.org';

// Prefijo para el título
const TITLE_PREFIX = process.env.REDDIT_PREFIX_TEXT || '💡 hgaruna tips y mini consejos de programación:';

// Obtener la lista de subreddits
const TARGET_SUBREDDITS = process.env.REDDIT_SUBREDDITS
  ? process.env.REDDIT_SUBREDDITS.split(',').map(s => s.trim()).filter(Boolean)
  : ['programming'];

let redditClient;

// Leer el archivo de artículos ya publicados
async function loadPostedArticles() {
  try {
    const data = await fs.readFile(POSTED_ARTICLES_LOG, 'utf8');
    return JSON.parse(data);
  } catch {
    return []; // Si no existe o está vacío
  }
}

// Guardar en el archivo de artículos publicados
async function savePostedArticles(log) {
  await fs.writeFile(POSTED_ARTICLES_LOG, JSON.stringify(log, null, 2));
}

// Verifica si un artículo ya fue publicado
function wasAlreadyPosted(log, slug) {
  return log.some(entry => entry.slug === slug);
}

// Publica un artículo
async function postToReddit(article, subreddit) {
  const articleUrl = `${SITE_URL}/blog/${article.slug}.html`;
  const title = `${TITLE_PREFIX} ${article.title}`;

  console.log(`📢 Publicando en r/${subreddit}:\n→ Título: "${title}"\n→ URL: ${articleUrl}`);

  try {
    const submission = await redditClient.getSubreddit(subreddit).submitLink({
      title,
      url: articleUrl,
      sendReplies: true
    });

    console.log(`✅ Publicado en r/${subreddit}: https://www.reddit.com${submission.permalink}`);
    return true;
  } catch (error) {
    console.error(`❌ Error en r/${subreddit}:`, error.message);
    return false;
  }
}

// Función principal
async function main() {
  try {
    // Validar credenciales
    if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET || !process.env.REDDIT_REFRESH_TOKEN) {
      throw new Error('❌ Faltan credenciales de Reddit');
    }

    redditClient = new snoowrap({
      userAgent: 'hgaruna-bot/1.0',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });

    const files = (await fs.readdir(BLOG_DIR)).filter(f => f.endsWith('.html'));
    if (files.length === 0) return console.log('📭 No se encontraron artículos HTML');

    // Ordenar por fecha de modificación
    const fileStats = await Promise.all(
      files.map(async file => ({
        name: file,
        time: (await fs.stat(path.join(BLOG_DIR, file))).mtime.getTime()
      }))
    );
    fileStats.sort((a, b) => b.time - a.time);
    const latestFile = fileStats[0].name;

    const htmlContent = await fs.readFile(path.join(BLOG_DIR, latestFile), 'utf8');
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Artículo sin título';
    const slug = latestFile.replace('.html', '');

    const postedLog = await loadPostedArticles();
    if (wasAlreadyPosted(postedLog, slug)) {
      return console.log(`⏭️ El artículo "${slug}" ya fue publicado anteriormente.`);
    }

    const article = { title, slug };

    for (let i = 0; i < TARGET_SUBREDDITS.length; i++) {
      const subreddit = TARGET_SUBREDDITS[i];
      const success = await postToReddit(article, subreddit);

      if (!success) continue;

      // Esperar 60 segundos si hay más subreddits
      if (i < TARGET_SUBREDDITS.length - 1) {
        console.log('⏳ Esperando 60 segundos antes del siguiente subreddit...');
        await new Promise(r => setTimeout(r, 60000));
      }
    }

    // Guardar como publicado
    postedLog.push({ slug, date: new Date().toISOString() });
    await savePostedArticles(postedLog);

    console.log('📝 Registro de artículos actualizado');
  } catch (error) {
    console.error('❌ Error general:', error.message);
    process.exit(1);
  }
}

main();
