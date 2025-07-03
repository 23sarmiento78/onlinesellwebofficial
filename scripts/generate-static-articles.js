const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuración
const ARTICLES_SOURCE = 'src/content/articulos';
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
    
    <!-- Open Graph -->
    <meta property="og:title" content="{{title}} | Desarrollo Web Villa Carlos Paz | hgaruna">
    <meta property="og:description" content="{{description}}">
    <meta property="og:image" content="{{image}}">
    <meta property="og:url" content="https://service.hgaruna.org/articulos/{{slug}}/">
    <meta property="og:type" content="article">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{title}} | Desarrollo Web Villa Carlos Paz | hgaruna">
    <meta name="twitter:description" content="{{description}}">
    <meta name="twitter:image" content="{{image}}">
    
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
  
  files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    const article = processArticle(filePath);
    
    if (article) {
      const html = generateArticleHTML(article, template);
      const outputPath = path.join(ARTICLES_OUTPUT, `${article.slug}.html`);
      
      fs.writeFileSync(outputPath, html);
      console.log(`✅ Generado: ${article.slug}.html`);
    }
  });
  
  console.log('🎉 ¡Páginas estáticas generadas exitosamente!');
  console.log(`📂 Artículos disponibles en: ${ARTICLES_OUTPUT}/`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateStaticArticles();
}

module.exports = { generateStaticArticles, processArticle }; 