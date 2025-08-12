// scripts/update-educational-sitemap.js
// Genera sitemap optimizado para contenido educativo y AdSense

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://hgaruna.org';
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EDUCATIONAL_DIR = path.resolve(__dirname, '../public/aprende-programacion');

// Prioridades SEO por tipo de contenido
const PRIORITIES = {
  home: '1.0',
  learning: '0.9',
  blog: '0.8',
  educational: '0.9',
  services: '0.7',
  contact: '0.6'
};

// Frecuencias de actualización
const CHANGE_FREQUENCIES = {
  home: 'weekly',
  learning: 'weekly', 
  blog: 'monthly',
  educational: 'weekly',
  services: 'monthly',
  contact: 'yearly'
};

async function generateEducationalSitemap() {
  console.log('🗺️  Generando sitemap educativo optimizado...');
  
  const urls = [];
  
  // URLs principales
  addMainPages(urls);
  
  // URLs de contenido educativo
  await addEducationalContent(urls);
  
  // URLs del blog
  await addBlogContent(urls);
  
  // Generar XML del sitemap
  const sitemapXML = generateSitemapXML(urls);
  
  // Guardar sitemap
  fs.writeFileSync(SITEMAP_PATH, sitemapXML);
  
  console.log(`✅ Sitemap generado con ${urls.length} URLs`);
  console.log(`📍 Guardado en: ${SITEMAP_PATH}`);
  
  // Generar estadísticas
  generateSitemapStats(urls);
}

function addMainPages(urls) {
  const mainPages = [
    {
      url: '/',
      priority: PRIORITIES.home,
      changefreq: CHANGE_FREQUENCIES.home,
      type: 'home'
    },
    {
      url: '/aprende-programacion',
      priority: PRIORITIES.learning,
      changefreq: CHANGE_FREQUENCIES.learning,
      type: 'learning'
    },
    {
      url: '/blog',
      priority: PRIORITIES.blog,
      changefreq: CHANGE_FREQUENCIES.blog,
      type: 'blog'
    },
    {
      url: '/desarrollo-web-villa-carlos-paz',
      priority: PRIORITIES.services,
      changefreq: CHANGE_FREQUENCIES.services,
      type: 'services'
    },
    {
      url: '/diseño-web-villa-carlos-paz',
      priority: PRIORITIES.services,
      changefreq: CHANGE_FREQUENCIES.services,
      type: 'services'
    },
    {
      url: '/marketing-digital-villa-carlos-paz',
      priority: PRIORITIES.services,
      changefreq: CHANGE_FREQUENCIES.services,
      type: 'services'
    },
    {
      url: '/contacto',
      priority: PRIORITIES.contact,
      changefreq: CHANGE_FREQUENCIES.contact,
      type: 'contact'
    },
    {
      url: '/planes',
      priority: PRIORITIES.services,
      changefreq: CHANGE_FREQUENCIES.services,
      type: 'services'
    }
  ];
  
  mainPages.forEach(page => {
    urls.push({
      loc: BASE_URL + page.url,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: page.changefreq,
      priority: page.priority,
      type: page.type
    });
  });
}

async function addEducationalContent(urls) {
  if (!fs.existsSync(EDUCATIONAL_DIR)) {
    return;
  }
  
  const files = fs.readdirSync(EDUCATIONAL_DIR).filter(file => file.endsWith('.html'));
  
  files.forEach(file => {
    const slug = file.replace('.html', '');
    const filePath = path.join(EDUCATIONAL_DIR, file);
    const stats = fs.statSync(filePath);
    
    // Analizar contenido para determinar prioridad
    const priority = determineContentPriority(filePath, 'educational');
    
    urls.push({
      loc: `${BASE_URL}/aprende-programacion/${slug}`,
      lastmod: stats.mtime.toISOString().split('T')[0],
      changefreq: CHANGE_FREQUENCIES.educational,
      priority: priority,
      type: 'educational'
    });
  });
}

async function addBlogContent(urls) {
  if (!fs.existsSync(BLOG_DIR)) {
    return;
  }
  
  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.html'));
  
  files.forEach(file => {
    const slug = file.replace('.html', '');
    const filePath = path.join(BLOG_DIR, file);
    const stats = fs.statSync(filePath);
    
    // Analizar contenido para determinar prioridad
    const priority = determineContentPriority(filePath, 'blog');
    
    urls.push({
      loc: `${BASE_URL}/blog/${slug}`,
      lastmod: stats.mtime.toISOString().split('T')[0],
      changefreq: CHANGE_FREQUENCIES.blog,
      priority: priority,
      type: 'blog'
    });
  });
}

function determineContentPriority(filePath, type) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const wordCount = content.split(/\s+/).length;
    
    // Prioridad basada en calidad del contenido
    let priority = PRIORITIES[type];
    
    // Bonificación por contenido extenso
    if (wordCount > 1500) {
      priority = Math.min(parseFloat(priority) + 0.1, 1.0).toString();
    }
    
    // Bonificación por contenido educativo estructurado
    if (type === 'educational') {
      const h2Count = (content.match(/<h2/g) || []).length;
      const codeBlocks = (content.match(/<pre|<code/g) || []).length;
      
      if (h2Count >= 5 && codeBlocks >= 2) {
        priority = Math.min(parseFloat(priority) + 0.1, 1.0).toString();
      }
    }
    
    return priority;
    
  } catch (error) {
    return PRIORITIES[type];
  }
}

function generateSitemapXML(urls) {
  const urlElements = urls.map(url => `
  <url>
    <loc>${escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlElements}
</urlset>`;
}

function escapeXML(str) {
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateSitemapStats(urls) {
  const stats = {
    total: urls.length,
    byType: {},
    byPriority: {},
    byChangeFreq: {}
  };
  
  urls.forEach(url => {
    // Por tipo
    stats.byType[url.type] = (stats.byType[url.type] || 0) + 1;
    
    // Por prioridad
    stats.byPriority[url.priority] = (stats.byPriority[url.priority] || 0) + 1;
    
    // Por frecuencia
    stats.byChangeFreq[url.changefreq] = (stats.byChangeFreq[url.changefreq] || 0) + 1;
  });
  
  console.log('\n📊 ESTADÍSTICAS DEL SITEMAP:');
  console.log('============================');
  console.log(`📄 Total URLs: ${stats.total}`);
  
  console.log('\n📋 Por tipo de contenido:');
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });
  
  console.log('\n⭐ Por prioridad:');
  Object.entries(stats.byPriority)
    .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
    .forEach(([priority, count]) => {
      console.log(`   ${priority}: ${count}`);
    });
  
  console.log('\n🔄 Por frecuencia de cambio:');
  Object.entries(stats.byChangeFreq).forEach(([freq, count]) => {
    console.log(`   ${freq}: ${count}`);
  });
  
  // Guardar estadísticas
  const statsPath = path.join(__dirname, '../sitemap-stats.json');
  fs.writeFileSync(statsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    ...stats
  }, null, 2));
  
  console.log(`\n💾 Estadísticas guardadas en: ${statsPath}`);
}

// Generar robots.txt optimizado
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Permitir indexación de contenido educativo
Allow: /aprende-programacion/
Allow: /blog/

# Optimización para AdSense
Allow: /logos-he-imagenes/
Allow: /css/
Allow: /js/

# Bloquear archivos innecesarios
Disallow: *.json$
Disallow: /admin/
Disallow: /scripts/
Disallow: /templates/

# Crawl-delay para bots
Crawl-delay: 1

# Bots específicos para mejor indexación
User-agent: Googlebot
Crawl-delay: 0

User-agent: Bingbot
Crawl-delay: 1
`;

  const robotsPath = path.resolve(__dirname, '../public/robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`🤖 robots.txt generado en: ${robotsPath}`);
}

if (require.main === module) {
  generateEducationalSitemap()
    .then(() => {
      generateRobotsTxt();
      console.log('✅ Sitemap y robots.txt actualizados');
    })
    .catch(console.error);
}

module.exports = { generateEducationalSitemap };
