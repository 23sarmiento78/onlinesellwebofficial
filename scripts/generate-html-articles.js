const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Configurar marked para HTML seguro
marked.setOptions({
  breaks: true,
  gfm: true
});

// Template HTML para los artículos
const articleTemplate = (article) => `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.seo_title || article.title} | Blog IA - hgaruna</title>
    <meta name="description" content="${article.seo_description || article.summary}">
    <meta name="keywords" content="${article.seo_keywords ? article.seo_keywords.join(', ') : article.tags.join(', ')}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${article.seo_title || article.title}">
    <meta property="og:description" content="${article.seo_description || article.summary}">
    <meta property="og:image" content="${article.image}">
    <meta property="og:url" content="https://service.hgaruna.org/public/blog/${article.slug}">
    <meta property="og:type" content="article">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${article.seo_title || article.title}">
    <meta name="twitter:description" content="${article.seo_description || article.summary}">
    <meta name="twitter:image" content="${article.image}">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${article.title}",
      "description": "${article.seo_description || article.summary}",
      "image": "${article.image}",
      "author": {
        "@type": "Person",
        "name": "${article.author || 'hgaruna'}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna",
        "logo": {
          "@type": "ImageObject",
          "url": "https://service.hgaruna.org/logos-he-imagenes/logo3.png"
        }
      },
      "datePublished": "${article.date}",
      "dateModified": "${article.date}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://service.hgaruna.org/public/blog/${article.slug}"
      }
    }
    </script>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <!-- Custom CSS -->
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .article-content { line-height: 1.8; }
        .article-content h1, .article-content h2, .article-content h3 { 
            color: #2c3e50; 
            margin-top: 2rem; 
            margin-bottom: 1rem; 
        }
        .article-content h1 { font-size: 2.5rem; }
        .article-content h2 { font-size: 2rem; }
        .article-content h3 { font-size: 1.5rem; }
        .article-content p { margin-bottom: 1.5rem; }
        .article-content ul, .article-content ol { margin-bottom: 1.5rem; }
        .article-content li { margin-bottom: 0.5rem; }
        .article-content blockquote { 
            border-left: 4px solid #007bff; 
            padding-left: 1rem; 
            margin: 2rem 0; 
            font-style: italic; 
            color: #6c757d; 
        }
        .article-content code { 
            background-color: #f8f9fa; 
            padding: 0.2rem 0.4rem; 
            border-radius: 0.25rem; 
            font-size: 0.875em; 
        }
        .article-content pre { 
            background-color: #343a40; 
            color: #f8f9fa; 
            padding: 1rem; 
            border-radius: 0.5rem; 
            overflow-x: auto; 
            margin: 1.5rem 0; 
        }
        .article-content pre code { 
            background: none; 
            padding: 0; 
            color: inherit; 
        }
        .article-content img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 0.5rem; 
            margin: 1.5rem 0; 
        }
        .article-content a { 
            color: #007bff; 
            text-decoration: none; 
        }
        .article-content a:hover { 
            text-decoration: underline; 
        }
        .article-header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 3rem 0; 
            margin-bottom: 3rem; 
        }
        .article-meta { 
            background-color: #f8f9fa; 
            padding: 1rem; 
            border-radius: 0.5rem; 
            margin-bottom: 2rem; 
        }
        .share-buttons .btn { 
            margin-right: 0.5rem; 
            margin-bottom: 0.5rem; 
        }
        .breadcrumb { 
            background: transparent; 
            padding: 0; 
        }
        .breadcrumb-item + .breadcrumb-item::before { 
            content: "›"; 
        }
        .hover-lift { 
            transition: transform 0.2s ease, box-shadow 0.2s ease; 
        }
        .hover-lift:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
        }
    </style>
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
                        <a class="nav-link" href="/blog">Blog IA</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contacto">Contacto</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Article Header -->
    <header class="article-header">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <!-- Breadcrumb -->
                    <nav aria-label="breadcrumb" class="mb-4">
                        <ol class="breadcrumb justify-content-center">
                            <li class="breadcrumb-item"><a href="/" class="text-white">Inicio</a></li>
                            <li class="breadcrumb-item"><a href="/blog" class="text-white">Blog IA</a></li>
                            <li class="breadcrumb-item active text-white" aria-current="page">${article.title}</li>
                        </ol>
                    </nav>

                    <!-- Category and Date -->
                    <div class="mb-3">
                        ${article.category ? `<span class="badge bg-light text-dark me-2">${article.category}</span>` : ''}
                        <small class="text-white-50">
                            <i class="fas fa-calendar-alt me-1"></i>
                            ${new Date(article.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </small>
                    </div>

                    <!-- Title -->
                    <h1 class="display-4 fw-bold mb-3">${article.title}</h1>

                    <!-- Summary -->
                    ${article.summary ? `<p class="lead mb-4">${article.summary}</p>` : ''}

                    <!-- Featured Image -->
                    ${article.image ? `
                    <div class="article-image mb-4">
                        <img src="${article.image}" alt="${article.title}" class="img-fluid rounded shadow" style="max-height: 400px; object-fit: cover;">
                    </div>
                    ` : ''}

                    <!-- Meta Information -->
                    <div class="d-flex justify-content-center align-items-center flex-wrap">
                        <div class="me-4">
                            <small class="text-white-50">
                                <i class="fas fa-user me-1"></i>
                                Por ${article.author || 'hgaruna'}
                            </small>
                        </div>
                        <div>
                            <small class="text-white-50">
                                <i class="fas fa-robot me-1"></i>
                                Generado por inteligencia artificial
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container py-5">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <!-- Tags -->
                ${article.tags && article.tags.length > 0 ? `
                <div class="mb-4">
                    ${article.tags.map(tag => `<span class="badge bg-light text-dark me-2">#${tag}</span>`).join('')}
                </div>
                ` : ''}

                <!-- Article Content -->
                <article class="article-content">
                    ${marked(article.content)}
                </article>

                <!-- Share Buttons -->
                <div class="share-buttons mt-5 pt-4 border-top">
                    <h5 class="mb-3">Compartir este artículo:</h5>
                    <button onclick="shareArticle('twitter')" class="btn btn-outline-primary">
                        <i class="fab fa-twitter me-2"></i>Twitter
                    </button>
                    <button onclick="shareArticle('linkedin')" class="btn btn-outline-primary">
                        <i class="fab fa-linkedin me-2"></i>LinkedIn
                    </button>
                    <button onclick="shareArticle('facebook')" class="btn btn-outline-primary">
                        <i class="fab fa-facebook me-2"></i>Facebook
                    </button>
                    <button onclick="shareArticle('whatsapp')" class="btn btn-outline-success">
                        <i class="fab fa-whatsapp me-2"></i>WhatsApp
                    </button>
                </div>

                <!-- Back to Blog -->
                <div class="text-center mt-5">
                    <a href="/blog" class="btn btn-primary">
                        <i class="fas fa-arrow-left me-2"></i>
                        Volver al Blog
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>hgaruna</h5>
                    <p class="mb-0">Desarrollo web profesional en Villa Carlos Paz</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">
                        <a href="https://wa.me/543541237972" class="text-white me-3">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="mailto:23sarmiento@gmail.com" class="text-white">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Share functionality -->
    <script>
        function shareArticle(platform) {
            const url = window.location.href;
            const title = '${article.title}';
            const text = '${article.summary || article.description || 'Artículo sobre programación y desarrollo web'}';
            
            let shareUrl = '';
            switch (platform) {
                case 'twitter':
                    shareUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}&url=\${encodeURIComponent(url)}\`;
                    break;
                case 'linkedin':
                    shareUrl = \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`;
                    break;
                case 'facebook':
                    shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`;
                    break;
                case 'whatsapp':
                    shareUrl = \`https://wa.me/?text=\${encodeURIComponent(text + ' ' + url)}\`;
                    break;
                default:
                    return;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    </script>
</body>
</html>`;

// Función principal
async function generateHTMLArticles() {
  try {
    console.log('🚀 Iniciando generación de artículos HTML...\n');
    
    const articlesDir = path.join(__dirname, '../src/content/articulos');
    const outputDir = path.join(__dirname, '../public/public/blog');
    
    // Crear directorio de salida si no existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('✅ Directorio de salida creado:', outputDir);
    }
    
    // Verificar si el directorio de artículos existe
    if (!fs.existsSync(articlesDir)) {
      console.log('❌ No se encontró el directorio de artículos:', articlesDir);
      return;
    }
    
    // Leer todos los archivos .md
    const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
    console.log(`📁 Encontrados ${files.length} archivos markdown\n`);
    
    let generatedCount = 0;
    let errorCount = 0;
    
    for (const file of files) {
      try {
        const filePath = path.join(articlesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Parsear frontmatter
        const { data, content } = matter(fileContent);
        
        // Extraer slug
        const slug = data.slug || file.replace('.md', '');
        
        // Crear objeto del artículo
        const article = {
          ...data,
          slug,
          content,
          // Asegurar campos requeridos
          title: data.title || 'Artículo sin título',
          summary: data.summary || data.description || '',
          date: data.date || new Date().toISOString(),
          author: data.author || 'hgaruna',
          image: data.image || '/logos-he-imagenes/programacion.jpeg',
          tags: Array.isArray(data.tags) ? data.tags : 
                (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []),
          seo_keywords: Array.isArray(data.seo_keywords) ? data.seo_keywords : 
                       (typeof data.seo_keywords === 'string' ? data.seo_keywords.split(',').map(k => k.trim()) : []),
          category: data.category || 'Programación'
        };
        
        // Generar HTML
        const htmlContent = articleTemplate(article);
        
        // Guardar archivo HTML
        const outputPath = path.join(outputDir, `${slug}.html`);
        fs.writeFileSync(outputPath, htmlContent, 'utf8');
        
        console.log(`✅ Generado: ${slug}.html`);
        generatedCount++;
        
      } catch (error) {
        console.error(`❌ Error procesando ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Proceso completado:`);
    console.log(`   ✅ Artículos generados: ${generatedCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📁 Ubicación: ${outputDir}`);
    
    // Crear archivo index.html para el public/blog
    createBlogIndex(outputDir);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para crear index del public/blog
function createBlogIndex(outputDir) {
  try {
    const indexTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog IA - Artículos Generados por Inteligencia Artificial | hgaruna</title>
    <meta name="description" content="Descubre los últimos artículos sobre programación y desarrollo web generados por inteligencia artificial">
    <meta name="keywords" content="public/blog, IA, programación, desarrollo web, inteligencia artificial">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    
    <style>
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    </style>
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
                        <a class="nav-link active" href="/blog">Blog IA</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contacto">Contacto</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <div class="bg-primary text-white py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h1 class="display-4 fw-bold mb-3">🤖 Blog IA</h1>
                    <p class="lead">Artículos sobre programación y desarrollo web generados por inteligencia artificial</p>
                    <div class="badge bg-light text-dark fs-6">
                        Artículos generados automáticamente
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Content -->
    <div class="container py-5">
        <div class="text-center">
            <h2>Artículos Disponibles</h2>
            <p class="text-muted mb-5">Haz clic en cualquier artículo para leerlo completo</p>
        </div>
        
        <div class="row g-4" id="articles-container">
            <!-- Los artículos se cargarán dinámicamente -->
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>hgaruna</h5>
                    <p class="mb-0">Desarrollo web profesional en Villa Carlos Paz</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">
                        <a href="https://wa.me/543541237972" class="text-white me-3">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>
                        <a href="mailto:23sarmiento@gmail.com" class="text-white">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Cargar lista de artículos
        fetch('/.netlify/functions/get-ia-articles')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('articles-container');
                if (data.articles && data.articles.length > 0) {
                    data.articles.forEach(article => {
                        const card = createArticleCard(article);
                        container.appendChild(card);
                    });
                } else {
                    container.innerHTML = '<div class="col-12 text-center"><p>No hay artículos disponibles</p></div>';
                }
            })
            .catch(error => {
                console.error('Error cargando artículos:', error);
                document.getElementById('articles-container').innerHTML = 
                    '<div class="col-12 text-center"><p>Error cargando artículos</p></div>';
            });

        function createArticleCard(article) {
            const col = document.createElement('div');
            col.className = 'col-lg-4 col-md-6';
            
            const formatDate = (dateString) => {
                return new Date(dateString).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };
            
            col.innerHTML = \`
                <div class="card h-100 shadow-sm hover-lift">
                    \${article.image ? \`
                    <img src="\${article.image}" class="card-img-top" alt="\${article.title}" style="height: 200px; object-fit: cover;">
                    \` : ''}
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            \${article.category ? \`<span class="badge bg-secondary me-2">\${article.category}</span>\` : ''}
                            <small class="text-muted">
                                <i class="fas fa-calendar-alt me-1"></i>
                                \${formatDate(article.date)}
                            </small>
                        </div>
                        <h5 class="card-title fw-bold">\${article.title}</h5>
                        <p class="card-text text-muted flex-grow-1">
                            \${article.summary || article.description || (article.content ? article.content.substring(0, 150) + '...' : '')}
                        </p>
                        <div class="mt-auto">
                            <a href="\${article.slug}.html" class="btn btn-primary w-100">
                                <i class="fas fa-arrow-right me-2"></i>
                                Leer artículo completo
                            </a>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-user me-1"></i>
                                \${article.author || 'hgaruna'}
                            </small>
                            <small class="text-muted">
                                <i class="fas fa-robot me-1"></i>
                                Generado por IA
                            </small>
                        </div>
                    </div>
                </div>
            \`;
            
            return col;
        }
    </script>
</body>
</html>`;
    
    const indexPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(indexPath, indexTemplate, 'utf8');
    console.log('✅ Index del public/blog creado:', indexPath);
    
  } catch (error) {
    console.error('❌ Error creando index del public/blog:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateHTMLArticles();
}

module.exports = { generateHTMLArticles }; 