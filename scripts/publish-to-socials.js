const fs = require('fs').promises;
const path = require('path');
const snoowrap = require('snoowrap');
const sharp = require('sharp');

// Configuración
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BLOG_DIR = path.join(PUBLIC_DIR, 'blog');
const POSTED_ARTICLES_LOG = path.join(__dirname, 'posted_articles.json');
const SITE_URL = 'https://www.hgaruna.org';

// Lista de subreddits con alto tráfico (más de 10M de miembros o populares)
const TARGET_SUBREDDITS = [
  'programming',        // 4.2M
  'technology',         // 13.9M
  'webdev',             // 1.1M
  'coding',             // 1.7M
  'learnprogramming',   // 4.1M
  'javascript',         // 2.4M
  'web_design',        // 1.3M
  'webdevelopment',    // 1.1M
  'frontend',          // 500K
  'reactjs',           // 500K
  'node',              // 400K
  'web',               // 300K
  'webdesign',         // 1.1M
  'webdev',            // 1.1M
  'codingbootcamp'     // 200K
];

// Inicializar cliente de Reddit
const redditClient = new snoowrap({
  userAgent: 'hgaruna-bot/1.0',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  refreshToken: process.env.REDDIT_REFRESH_TOKEN
});

/**
 * Obtiene el artículo más reciente del blog
 */
async function getLatestArticle() {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    const stats = await Promise.all(
      htmlFiles.map(file => fs.stat(path.join(BLOG_DIR, file)))
    );
    
    const filesWithStats = htmlFiles.map((file, index) => ({
      name: file,
      mtime: stats[index].mtime
    }));

    filesWithStats.sort((a, b) => b.mtime - a.mtime);
    
    if (filesWithStats.length === 0) {
      console.log('No se encontraron artículos en el blog');
      return null;
    }

    const latestArticle = filesWithStats[0];
    const articleUrl = `${SITE_URL}/blog/${latestArticle.name}`;
    
    // Extraer título del nombre del archivo
    const title = latestArticle.name
      .replace(/-/g, ' ')
      .replace(/\.html$/, '')
      .replace(/\b\w/g, l => l.toUpperCase());

    return {
      title: title,
      url: articleUrl,
      slug: latestArticle.name.replace('.html', '')
    };
  } catch (error) {
    console.error('Error al obtener el último artículo:', error);
    return null;
  }
}

/**
 * Publica en múltiples subreddits
 */
async function postToMultipleSubreddits(article) {
  const postedSubreddits = [];
  
  for (const subreddit of TARGET_SUBREDDITS) {
    try {
      console.log(`Publicando en r/${subreddit}: ${article.title}`);
      
      await redditClient.getSubreddit(subreddit).submitLink({
        title: article.title,
        url: article.url,
        sendReplies: true
      });
      
      console.log(`✅ Publicado exitosamente en r/${subreddit}`);
      postedSubreddits.push(subreddit);
      
      // Esperar 5 minutos entre publicaciones para evitar límites de tasa
      await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
      
    } catch (error) {
      console.error(`❌ Error al publicar en r/${subreddit}:`, error.message);
      
      // Si el error es por límite de tasa, esperar y continuar
      if (error.message.includes('RATELIMIT')) {
        const waitTime = error.message.match(/(\d+)\s+minutes?/i);
        const minutes = waitTime ? parseInt(waitTime[1]) + 1 : 5;
        console.log(`⏳ Esperando ${minutes} minutos debido al límite de tasa...`);
        await new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000));
      }
    }
  }
  
  return postedSubreddits;
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🚀 Iniciando publicación en Reddit...');
    
    // Obtener el artículo más reciente
    const article = await getLatestArticle();
    if (!article) {
      console.log('No se encontraron artículos para publicar');
      return;
    }
    
    console.log(`📰 Artículo a publicar: ${article.title}`);
    console.log(`🔗 URL: ${article.url}`);
    
    // Publicar en múltiples subreddits
    const postedSubreddits = await postToMultipleSubreddits(article);
    
    if (postedSubreddits.length > 0) {
      console.log(`\n✅ Publicación completada en ${postedSubreddits.length} subreddits:`);
      postedSubreddits.forEach(sub => console.log(`   - r/${sub}`));
    } else {
      console.log('❌ No se pudo publicar en ningún subreddit');
    }
    
  } catch (error) {
    console.error('Error en la ejecución principal:', error);
  }
}

// Ejecutar
main().catch(console.error);