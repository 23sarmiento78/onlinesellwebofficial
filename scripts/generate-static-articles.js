const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuración
const ARTICLES_SOURCE = 'src/content/articles';
const ARTICLES_OUTPUT = 'public/articulos';
const TEMPLATE_PATH = 'templates/article-template.html';

// Función para generar slug a partir del título
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Función para leer el template HTML
function getArticleTemplate() {
  const templatePath = path.join(process.cwd(), TEMPLATE_PATH);
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }

  // Template por defecto si no existe el archivo
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} | Desarrollo Web Villa Carlos Paz | hgaruna</title>
    <meta name="description" content="{{description}}">
    <meta name="keywords" content="{{keywords}}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="language" content="es">
    <meta name="geo.region" content="AR-X">
    <meta name="geo.placename" content="Villa Carlos Paz">
    <meta name="geo.position" content="-31.4165;-64.4961">
    <link rel="canonical" href="https://service.hgaruna.org/articulos/{{slug}}/">

    <!-- Open Graph -->
    <meta property="og:title" content="{{title}} | Desarrollo Web Villa Carlos Paz | hgaruna">
    <meta property="og:description" content="{{description}}">
    <meta property="og:image" content="{{image}}">
    <meta property="og:url" content="https://service.hgaruna.org/articulos/{{slug}}/">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="hgaruna">
    <meta property="og:locale" content="es_ES">
    <meta property="article:author" content="{{author}}">
    <meta property="article:published_time" content="{{date}}">
    <meta property="article:modified_time" content="{{date}}">
    <meta property="article:section" content="{{category}}">
    <meta property="article:tag" content="{{tags}}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{title}} | Desarrollo Web Villa Carlos Paz | hgaruna">
    <meta name="twitter:description" content="{{description}}">
    <meta name="twitter:image" content="{{image}}">
    <meta name="twitter:site" content="@hgaruna">
    <meta name="twitter:creator" content="@hgaruna">

    <!-- Adicionales para SEO -->
    <meta name="author" content="{{author}}">
    <meta name="publisher" content="hgaruna">
    <meta name="theme-color" content="#2563eb">
    <meta name="msapplication-TileColor" content="#2563eb">`

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/styles.css">

    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{{title}}",
      "description": "{{description}}",
      "image": "{{image}}",
      "author": {
        "@type": "Organization",
        "name": "{{author}}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna",
        "logo": {
          "@type": "ImageObject",
          "url": "https://service.hgaruna.org/logos-he-imagenes/logo3.png"
        }
      },
      "datePublished": "{{date}}",
      "dateModified": "{{date}}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://service.hgaruna.org/articulos/{{slug}}/"
      },
      "keywords": "{{keywords}}"
    }
    </script>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="/">
                <img src="/logos-he-imagenes/logo3.png" alt="hgaruna" height="30">
                hgaruna
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/desarrollo-web-villa-carlos-paz">Desarrollo Web</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/diseño-web-villa-carlos-paz">Diseño Web</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/marketing-digital-villa-carlos-paz">Marketing Digital</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/foro">Foro</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/planes">Planes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contacto">Contacto</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Article Content -->
    <main class="container mt-5">
        <article class="article-content">
            <header class="article-header mb-4">
                <h1 class="display-4">{{title}}</h1>
                <div class="article-meta text-muted">
                    <span>Por {{author}}</span>
                    <span class="mx-2">•</span>
                    <span>{{formattedDate}}</span>
                    {{#if tags}}
                    <span class="mx-2">•</span>
                    <div class="d-inline">
                        {{#each tags}}
                        <span class="badge bg-primary me-1">{{this}}</span>
                        {{/each}}
                    </div>
                    {{/if}}
                </div>
                {{#if image}}
                <img
                    src="{{image}}"
                    alt="{{title}}"
                    class="img-fluid rounded mt-3"
                    style="max-height: 400px; object-fit: cover; width: 100%;"
                >
                {{/if}}
            </header>

            <div class="article-body">
                {{content}}
            </div>

            <footer class="article-footer mt-5">
                <div class="row">
                    <div class="col-md-6">
                        <h5>Compartir artículo:</h5>
                        <div class="social-share">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=https://service.hgaruna.org/articulos/{{slug}}/"
                               target="_blank" class="btn btn-outline-primary me-2">
                                <i class="fab fa-facebook"></i> Facebook
                            </a>
                            <a href="https://twitter.com/intent/tweet?text={{title}}&url=https://service.hgaruna.org/articulos/{{slug}}/"
                               target="_blank" class="btn btn-outline-info me-2">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                            <a href="https://wa.me/?text={{title}}%20https://service.hgaruna.org/articulos/{{slug}}/"
                               target="_blank" class="btn btn-outline-success">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6 text-end">
                        <a href="/foro" class="btn btn-primary">
                            <i class="fas fa-arrow-left me-2"></i>Volver al Foro
                        </a>
                    </div>
                </div>
            </footer>
        </article>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>hgaruna</h5>
                    <p>Desarrollo web profesional en Villa Carlos Paz, Córdoba</p>
                </div>
                <div class="col-md-6 text-end">
                    <p>WhatsApp: +54 3541 237972</p>
                    <p>Email: 23sarmiento@gmail.com</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

// Función para procesar un artículo
function processArticle(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    const slug = generateSlug(data.title);
    const description = data.description || content.substring(0, 160) + '...';
    const keywords = data.tags ? data.tags.join(', ') + ', desarrollo web villa carlos paz, programador web villa carlos paz' : 'desarrollo web villa carlos paz, programador web villa carlos paz';
    const image = data.image || 'https://service.hgaruna.org/logos-he-imagenes/logo3.png';
    const author = data.author || 'hgaruna';
    const date = data.date || new Date().toISOString();
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      slug,
      title: data.title,
      description,
      keywords,
      image,
      author,
      date,
      formattedDate,
      content: content,
      tags: data.tags || []
    };
  } catch (error) {
    console.error(`Error procesando artículo ${filePath}:`, error);
    return null;
  }
}

// Función para generar HTML del artículo
function generateArticleHTML(article, template) {
  let html = template;

  // Reemplazar variables en el template
  const replacements = {
    '{{title}}': article.title,
    '{{description}}': article.description,
    '{{keywords}}': article.keywords,
    '{{image}}': article.image,
    '{{author}}': article.author,
    '{{date}}': article.date,
    '{{formattedDate}}': article.formattedDate,
    '{{slug}}': article.slug,
    '{{content}}': article.content
  };

  Object.entries(replacements).forEach(([key, value]) => {
    html = html.replace(new RegExp(key, 'g'), value);
  });

  // Procesar tags
  if (article.tags && article.tags.length > 0) {
    const tagsHTML = article.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('');
    html = html.replace('{{#if tags}}', '');
    html = html.replace('{{/if}}', '');
    html = html.replace('{{#each tags}}', '');
    html = html.replace('{{/each}}', '');
    html = html.replace('{{this}}', tagsHTML);
  } else {
    html = html.replace(/{{#if tags}}[\s\S]*?{{\/if}}/g, '');
  }

  return html;
}

// Función principal
function generateStaticArticles() {
  console.log('🚀 Generando páginas estáticas de artículos...');

  // Crear directorio de salida si no existe
  if (!fs.existsSync(ARTICLES_OUTPUT)) {
    fs.mkdirSync(ARTICLES_OUTPUT, { recursive: true });
  }

  // Leer template
  const template = getArticleTemplate();

  // Leer archivos de artículos
  const articlesDir = path.join(process.cwd(), ARTICLES_SOURCE);
  if (!fs.existsSync(articlesDir)) {
    console.log(`📁 Directorio ${ARTICLES_SOURCE} no encontrado. Creando...`);
    fs.mkdirSync(articlesDir, { recursive: true });
    console.log('✅ Directorio creado. Agrega artículos desde el CMS.');
    return;
  }

  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));

  if (files.length === 0) {
    console.log('📝 No se encontraron artículos. Agrega artículos desde el CMS.');
    return;
  }

  console.log(`📄 Procesando ${files.length} artículo(s)...`);

  const articles = [];
  files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    const article = processArticle(filePath);

    if (article) {
      const html = generateArticleHTML(article, template);
      const outputPath = path.join(ARTICLES_OUTPUT, `${article.slug}.html`);

      fs.writeFileSync(outputPath, html);
      console.log(`✅ Generado: ${article.slug}.html`);
      articles.push(article);
    }
  });

  // Generar sitemap automáticamente
  generateSitemap(articles);

  // Generar robots.txt
  generateRobotsTxt();

  console.log('🎉 ¡Páginas estáticas generadas exitosamente!');
  console.log(`📂 Artículos disponibles en: ${ARTICLES_OUTPUT}/`);
}

// Función para generar sitemap
function generateSitemap(articles) {
  console.log('🗺️ Generando sitemap automático...');

  const siteUrl = 'https://service.hgaruna.org';
  const now = new Date().toISOString();

  // URLs estáticas
  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/planes/', priority: 0.9, changefreq: 'monthly' },
    { url: '/foro/', priority: 0.8, changefreq: 'daily' },
    { url: '/contacto/', priority: 0.7, changefreq: 'monthly' },
    { url: '/legal/', priority: 0.3, changefreq: 'yearly' },
    { url: '/desarrollo-web-villa-carlos-paz/', priority: 0.8, changefreq: 'monthly' },
    { url: '/diseño-web-villa-carlos-paz/', priority: 0.8, changefreq: 'monthly' },
    { url: '/marketing-digital-villa-carlos-paz/', priority: 0.8, changefreq: 'monthly' },
    { url: '/articulos/', priority: 0.7, changefreq: 'daily' }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Agregar páginas estáticas
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Agregar artículos
  articles.forEach(article => {
    const articleDate = new Date(article.date || now);
    const isRecent = (Date.now() - articleDate.getTime()) < (7 * 24 * 60 * 60 * 1000);

    sitemap += `  <url>
    <loc>${siteUrl}/articulos/${article.slug}</loc>
    <lastmod>${articleDate.toISOString()}</lastmod>
    <changefreq>${isRecent ? 'daily' : 'weekly'}</changefreq>
    <priority>${isRecent ? '0.8' : '0.6'}</priority>`;

    // Agregar imagen si existe
    if (article.image) {
      sitemap += `
    <image:image>
      <image:loc>${siteUrl}${article.image}</image:loc>
      <image:title>${escapeXML(article.title)}</image:title>
      <image:caption>${escapeXML(article.description || '')}</image:caption>
    </image:image>`;
    }

    // Agregar noticias para artículos recientes
    if (isRecent) {
      sitemap += `
    <news:news>
      <news:publication>
        <news:name>hgaruna</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${articleDate.toISOString()}</news:publication_date>
      <news:title>${escapeXML(article.title)}</news:title>
      <news:keywords>${article.tags ? article.tags.join(', ') : 'desarrollo web, villa carlos paz'}</news:keywords>
    </news:news>`;
    }

    sitemap += `
  </url>
`;
  });

  sitemap += '</urlset>';

  // Escribir sitemap
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Sitemap generado: public/sitemap.xml');
}

// Función para generar robots.txt
function generateRobotsTxt() {
  console.log('🤖 Generando robots.txt...');

  const robotsContent = `User-agent: *
Allow: /

# Sitemap location
Sitemap: https://service.hgaruna.org/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /admin-local/
Disallow: /.netlify/

# Allow important pages
Allow: /articulos/
Allow: /foro/
Allow: /planes/

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific rules for different bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Block AI training bots
User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /
`;

  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('✅ Robots.txt generado: public/robots.txt');
}

// Función para escapar XML
function escapeXML(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateStaticArticles();
}

module.exports = { generateStaticArticles, processArticle };