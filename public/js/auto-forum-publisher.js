// Sistema Automatizado de Publicación en Foro
class AutoForumPublisher {
  constructor() {
    this.foroManager = window.foroManager;
    this.init();
  }

  init() {
    // Escuchar eventos de publicación de artículos
    this.setupArticleListeners();
    
    // Verificar si hay artículos nuevos que necesiten publicación en foro
    this.checkForNewArticles();
  }

  // Configurar listeners para detectar nuevas publicaciones de artículos
  setupArticleListeners() {
    // Escuchar cambios en el localStorage (simulación de nueva publicación)
    window.addEventListener('storage', (e) => {
      if (e.key === 'new_article_published') {
        const articleData = JSON.parse(e.newValue);
        if (articleData) {
          this.createForumPostFromArticle(articleData);
        }
      }
    });

    // También escuchar eventos personalizados
    document.addEventListener('articlePublished', (e) => {
      this.createForumPostFromArticle(e.detail);
    });
  }

  // Verificar artículos existentes que no tengan publicación en foro
  checkForNewArticles() {
    const publishedArticles = this.getPublishedArticles();
    const forumPosts = this.foroManager ? this.foroManager.posts : [];
    
    publishedArticles.forEach(article => {
      const hasForumPost = forumPosts.some(post => 
        post.articleId === article.id || 
        post.content.includes(article.title.substring(0, 30))
      );
      
      if (!hasForumPost) {
        console.log(`📝 Creando publicación automática para: ${article.title}`);
        this.createForumPostFromArticle(article);
      } else {
        console.log(`✅ Artículo ya tiene publicación en foro: ${article.title}`);
      }
    });
  }

  // Obtener artículos publicados (simulado)
  getPublishedArticles() {
    // En un entorno real, esto vendría de la API del blog
    const savedArticles = localStorage.getItem('published_articles');
    if (savedArticles) {
      return JSON.parse(savedArticles);
    }
    
    // Artículos de ejemplo basados en el contenido del blog
    return [
      {
        id: '2025-01-22-desarrollo-web-villa-carlos-paz',
        title: 'Desarrollo Web Profesional en Villa Carlos Paz: Potenciando Negocios Locales',
        description: 'Descubre cómo el desarrollo web profesional está transformando los negocios en Villa Carlos Paz, Córdoba. Soluciones digitales a medida para empresas locales.',
        category: 'Desarrollo Web Local',
        tags: ['Villa Carlos Paz', 'Desarrollo Web', 'Marketing Digital', 'Córdoba', 'Negocios Locales', 'SEO Local'],
        image: '/logos-he-imagenes/programacion.jpeg',
        publishedAt: '2025-01-22',
        author: 'hgaruna',
        articleUrl: '/blog/2025-01-22-desarrollo-web-villa-carlos-paz/'
      },
      {
        id: '2024-03-15-10-estrategias-seo-avanzadas',
        title: '10 Estrategias SEO Avanzadas para 2024',
        description: 'Descubre las técnicas más efectivas de SEO para mejorar el posicionamiento de tu sitio web en los motores de búsqueda.',
        category: 'SEO',
        tags: ['SEO', 'Marketing Digital', 'Posicionamiento', 'Google', 'Optimización'],
        image: '/logos-he-imagenes/programacion.jpeg',
        publishedAt: '2024-03-15',
        author: 'hgaruna',
        articleUrl: '/blog/2024-03-15-10-estrategias-seo-avanzadas/'
      },
      {
        id: '2024-03-12-react-optimizacion',
        title: 'Optimización de React: Mejores Prácticas para 2024',
        description: 'Aprende las técnicas más efectivas para optimizar aplicaciones React y mejorar el rendimiento de tus proyectos web.',
        category: 'Desarrollo Web',
        tags: ['React', 'JavaScript', 'Optimización', 'Frontend', 'Performance'],
        image: '/logos-he-imagenes/programacion.jpeg',
        publishedAt: '2024-03-12',
        author: 'hgaruna',
        articleUrl: '/blog/2024-03-12-react-optimizacion/'
      },
      {
        id: '2024-03-10-tendencias-diseno-ui-ux',
        title: 'Tendencias de Diseño UI/UX para 2024',
        description: 'Explora las tendencias más importantes en diseño de interfaces y experiencia de usuario que dominarán este año.',
        category: 'Diseño Web',
        tags: ['UI/UX', 'Diseño', 'Tendencias', 'Interfaces', 'Experiencia de Usuario'],
        image: '/logos-he-imagenes/programacion.jpeg',
        publishedAt: '2024-03-10',
        author: 'hgaruna',
        articleUrl: '/blog/2024-03-10-tendencias-diseno-ui-ux/'
      },
      {
        id: '2025-06-13-el-futuro-de-la-inteligencia-artificial-en-el-desarrollo-web',
        title: 'El Futuro de la Inteligencia Artificial en el Desarrollo Web',
        description: 'Descubre cómo la IA está transformando el desarrollo web y qué podemos esperar en los próximos años.',
        category: 'Tecnología',
        tags: ['Inteligencia Artificial', 'IA', 'Desarrollo Web', 'Futuro', 'Innovación'],
        image: '/logos-he-imagenes/programacion.jpeg',
        publishedAt: '2025-06-13',
        author: 'hgaruna',
        articleUrl: '/blog/2025-06-13-el-futuro-de-la-inteligencia-artificial-en-el-desarrollo-web/'
      }
    ];
  }

  // Crear publicación en foro basada en artículo
  createForumPostFromArticle(article) {
    if (!this.foroManager) {
      console.error('❌ ForoManager no está disponible');
      return;
    }

    // Generar contenido para el foro
    const forumContent = this.generateForumContent(article);
    
    // Crear la publicación en el foro
    const forumPost = this.foroManager.createPost(
      forumContent,
      article.image,
      article.category
    );

    // Agregar metadatos del artículo
    forumPost.articleId = article.id;
    forumPost.articleTitle = article.title;
    forumPost.articleUrl = article.articleUrl || `/blog/${article.id}/`;
    forumPost.tags = article.tags;
    forumPost.isAutoGenerated = true;
    forumPost.articleAuthor = article.author;
    forumPost.articlePublishedAt = article.publishedAt;

    // Guardar la publicación actualizada
    this.foroManager.savePosts();

    console.log(`✅ Publicación automática creada en foro para: ${article.title}`);
    
    // Mostrar notificación
    if (this.foroManager.showNotification) {
      this.foroManager.showNotification(
        `📝 Artículo "${article.title}" publicado automáticamente en el foro`,
        'success'
      );
    }
    
    // Disparar evento para integración futura con LinkedIn
    this.triggerLinkedInIntegration(forumPost, article);
  }

  // Generar contenido para el foro basado en el artículo
  generateForumContent(article) {
    const content = `
🚀 **¡Nuevo artículo publicado!** 

📖 **${article.title}**

${this.generateSummary(article.description)}

🔗 **Lee el artículo completo:** [${article.title}](${article.articleUrl})

📅 **Publicado:** ${new Date(article.publishedAt).toLocaleDateString('es-ES')}
👨‍💻 **Autor:** ${article.author}

💡 **¿Qué opinas sobre este tema?** Comparte tus experiencias y conocimientos en los comentarios.

#${article.tags.map(tag => tag.replace(/\s+/g, '')).join(' #')} #hgaruna #DesarrolloWeb
    `.trim();

    return content;
  }

  // Generar resumen del artículo
  generateSummary(description) {
    // Limitar a 200 caracteres y agregar puntos suspensivos si es necesario
    if (description.length <= 200) {
      return description;
    }
    
    return description.substring(0, 200).trim() + '...';
  }

  // Disparar evento para integración con LinkedIn (futuro)
  triggerLinkedInIntegration(forumPost, article) {
    const linkedInData = {
      forumPost: forumPost,
      article: article,
      timestamp: new Date().toISOString()
    };

    // Guardar datos para integración futura
    localStorage.setItem('linkedin_integration_queue', JSON.stringify(linkedInData));
    
    // Disparar evento personalizado
    document.dispatchEvent(new CustomEvent('linkedinIntegrationReady', {
      detail: linkedInData
    }));

    console.log('🔗 Datos preparados para integración con LinkedIn:', linkedInData);
  }

  // Método para publicar manualmente un artículo en el foro
  manualPublishArticle(articleData) {
    this.createForumPostFromArticle(articleData);
  }

  // Obtener estadísticas de publicaciones automáticas
  getAutoPublishStats() {
    const forumPosts = this.foroManager ? this.foroManager.posts : [];
    const autoPosts = forumPosts.filter(post => post.isAutoGenerated);
    
    return {
      totalAutoPosts: autoPosts.length,
      totalForumPosts: forumPosts.length,
      autoPostsPercentage: forumPosts.length > 0 ? (autoPosts.length / forumPosts.length * 100).toFixed(1) : 0
    };
  }
}

// Función para simular la publicación de un nuevo artículo
function simulateArticlePublication(articleData) {
  console.log('🤖 Simulando publicación automática de artículo:', articleData.title);
  
  // Guardar en localStorage para simular nueva publicación
  localStorage.setItem('new_article_published', JSON.stringify(articleData));
  
  // Disparar evento personalizado
  document.dispatchEvent(new CustomEvent('articlePublished', {
    detail: articleData
  }));
}

// Función para publicar artículo manualmente desde el admin
function publishArticleToForum(articleData) {
  if (window.autoForumPublisher) {
    window.autoForumPublisher.manualPublishArticle(articleData);
    return true;
  }
  return false;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que el ForoManager esté disponible
  const checkForoManager = setInterval(() => {
    if (window.foroManager) {
      clearInterval(checkForoManager);
      window.autoForumPublisher = new AutoForumPublisher();
      console.log('✅ AutoForumPublisher inicializado');
      
      // Mostrar estadísticas iniciales
      setTimeout(() => {
        const stats = window.autoForumPublisher.getAutoPublishStats();
        console.log('📊 Estadísticas iniciales:', stats);
      }, 1000);
    }
  }, 100);
});

// Exportar para uso global
window.AutoForumPublisher = AutoForumPublisher;
window.simulateArticlePublication = simulateArticlePublication;
window.publishArticleToForum = publishArticleToForum; 