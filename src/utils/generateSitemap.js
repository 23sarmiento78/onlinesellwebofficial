import { getArticles } from './getArticles';

// Configuración del sitio
const SITE_URL = 'https://service.hgaruna.org';

// Páginas estáticas del sitio
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/contacto', priority: '0.8', changefreq: 'monthly' },
  { path: '/planes', priority: '0.9', changefreq: 'monthly' },
  { path: '/legal', priority: '0.3', changefreq: 'yearly' },
  { path: '/politicas-privacidad', priority: '0.3', changefreq: 'yearly' },
  { path: '/desarrollo-web-villa-carlos-paz', priority: '0.9', changefreq: 'monthly' },
  { path: '/diseño-web-villa-carlos-paz', priority: '0.9', changefreq: 'monthly' },
  { path: '/marketing-digital-villa-carlos-paz', priority: '0.9', changefreq: 'monthly' },
];

export async function generateSitemap() {
  try {
    // Obtener artículos dinámicos
    const articles = await getArticles();
    
    // Generar URLs de artículos
    const articleUrls = articles.map(article => ({
      path: `/articulos/${article.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: article.updatedAt || article.date
    }));
    
    // Combinar páginas estáticas y dinámicas
    const allUrls = [...STATIC_PAGES, ...articleUrls];
    
    // Generar XML del sitemap
    const sitemap = generateSitemapXML(allUrls);
    
    return sitemap;
  } catch (error) {
    console.error('Error generando sitemap:', error);
    // Fallback: solo páginas estáticas
    return generateSitemapXML(STATIC_PAGES);
  }
}

function generateSitemapXML(urls) {
  const xmlUrls = urls.map(url => {
    const lastmod = url.lastmod ? new Date(url.lastmod).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `  <url>
    <loc>${SITE_URL}${url.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

// Función para generar sitemap en tiempo de build
// Esta función se ejecutará en el servidor, no en el cliente
export async function generateSitemapAtBuild() {
  const sitemap = await generateSitemap();
  return sitemap;
} 