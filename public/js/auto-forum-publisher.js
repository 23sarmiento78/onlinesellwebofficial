// Sistema Automatizado de Publicación en Foro
class AutoForumPublisher {
  constructor() {
    this.apiUrl = '/.netlify/functions/admin-api/forum-posts';
    this.articlesUrl = '/.netlify/functions/admin-api/articles';
    this.checkInterval = 5 * 60 * 1000; // 5 minutos
    this.publishedArticles = new Set();
    this.isAuthenticated = false;
    this.init();
    
    // Escuchar cambios de autenticación
    document.addEventListener('auth0:authChanged', (event) => {
      this.handleAuthChange(event.detail);
    });
  }

  async init() {
    // Verificar si el usuario está autenticado
    if (!this.checkAuthentication()) {
      console.log('🔒 AutoForumPublisher: Usuario no autenticado, deshabilitando');
      return;
    }

    console.log('✅ AutoForumPublisher: Usuario autenticado, iniciando...');
    
    // Cargar artículos ya publicados
    await this.loadPublishedArticles();
    
    // Iniciar verificación periódica
    this.startPeriodicCheck();
    
    // Verificar inmediatamente
    await this.checkForNewArticles();
  }

  checkAuthentication() {
    // Verificar si hay un token de Auth0
    const token = localStorage.getItem('auth0_token');
    const user = localStorage.getItem('auth0_user');
    
    this.isAuthenticated = !!(token && user);
    
    console.log('🔍 AutoForumPublisher - Estado de autenticación:', {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated: this.isAuthenticated
    });
    
    return this.isAuthenticated;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('auth0_token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async loadPublishedArticles() {
    try {
      if (!this.isAuthenticated) {
        console.log('🔒 AutoForumPublisher: No autenticado, saltando carga de publicaciones');
        return;
      }

      const response = await fetch(this.apiUrl, {
        headers: this.getAuthHeaders()
      });
      
      if (response.ok) {
        const posts = await response.json();
        posts.forEach(post => {
          if (post.articleId) {
            this.publishedArticles.add(post.articleId);
          }
        });
        console.log(`✅ AutoForumPublisher: Cargadas ${posts.length} publicaciones existentes`);
      } else {
        console.error('❌ AutoForumPublisher: Error cargando publicaciones:', response.status);
      }
    } catch (error) {
      console.error('❌ AutoForumPublisher: Error cargando publicaciones existentes:', error);
    }
  }

  startPeriodicCheck() {
    setInterval(async () => {
      if (this.isAuthenticated) {
        await this.checkForNewArticles();
      }
    }, this.checkInterval);
  }

  async checkForNewArticles() {
    try {
      if (!this.isAuthenticated) {
        console.log('🔒 AutoForumPublisher: No autenticado, saltando verificación');
        return;
      }

      const response = await fetch(this.articlesUrl, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error obteniendo artículos: ${response.status}`);
      }

      const articles = await response.json();
      const newArticles = articles.filter(article => 
        !this.publishedArticles.has(article._id)
      );

      console.log(`🔍 AutoForumPublisher: Encontrados ${newArticles.length} artículos nuevos`);

      for (const article of newArticles) {
        await this.publishArticleToForum(article);
      }
    } catch (error) {
      console.error('❌ AutoForumPublisher: Error verificando nuevos artículos:', error);
    }
  }

  async publishArticleToForum(article) {
    try {
      const forumPost = {
        title: `📝 ${article.title}`,
        content: this.generateForumContent(article),
        author: 'hgaruna',
        date: new Date().toISOString(),
        tags: article.tags || [],
        category: 'Artículos del Blog',
        articleId: article._id,
        likes: 0,
        comments: [],
        shares: 0
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(forumPost)
      });

      if (response.ok) {
        const result = await response.json();
        this.publishedArticles.add(article._id);
        console.log('✅ Artículo publicado en el foro:', article.title);
        
        // Compartir en LinkedIn si está configurado
        await this.shareToLinkedIn(forumPost);
        
        return result;
      } else {
        throw new Error('Error publicando en el foro');
      }
    } catch (error) {
      console.error('Error publicando artículo en el foro:', error);
    }
  }

  generateForumContent(article) {
    const maxLength = 500;
    let content = article.description || article.content || '';
    
    // Truncar si es muy largo
    if (content.length > maxLength) {
      content = content.substring(0, maxLength) + '...';
    }

    return `${content}\n\n📖 Lee el artículo completo: ${window.location.origin}/blog/${article.slug || article._id}\n\n#${(article.tags || []).join(' #')}`;
  }

  async shareToLinkedIn(forumPost) {
    try {
      // Verificar si LinkedIn está conectado
      if (window.linkedInIntegration && window.linkedInIntegration.isAuthenticated()) {
        // Verificar configuración de auto-share
        const autoShare = document.getElementById('auto-share')?.checked ?? true;
        
        if (autoShare) {
          await window.linkedInIntegration.sharePost({
            title: forumPost.title,
            content: forumPost.content,
            tags: forumPost.tags
          });
          
          console.log('✅ Publicación compartida en LinkedIn');
          
          // Mostrar notificación
          this.showNotification('Publicación compartida en LinkedIn', 'success');
        }
      }
    } catch (error) {
      console.error('Error compartiendo en LinkedIn:', error);
      // No mostrar error al usuario, solo log
    }
  }

  showNotification(message, type = 'info') {
    // Crear notificación elegante
    const notification = document.createElement('div');
    notification.className = `auto-publisher-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Agregar estilos si no existen
    if (!document.getElementById('auto-publisher-styles')) {
      const style = document.createElement('style');
      style.id = 'auto-publisher-styles';
      style.textContent = `
        .auto-publisher-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          border-left: 4px solid #4CAF50;
        }
        
        .auto-publisher-notification.show {
          transform: translateX(0);
        }
        
        .auto-publisher-notification.success {
          border-left-color: #4CAF50;
        }
        
        .auto-publisher-notification.info {
          border-left-color: #2196F3;
        }
        
        .auto-publisher-notification.error {
          border-left-color: #f44336;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
          font-weight: 500;
        }
        
        .notification-content i {
          font-size: 1.2rem;
        }
        
        .auto-publisher-notification.success .notification-content i {
          color: #4CAF50;
        }
        
        .auto-publisher-notification.info .notification-content i {
          color: #2196F3;
        }
        
        .auto-publisher-notification.error .notification-content i {
          color: #f44336;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Método para publicar manualmente un artículo
  async publishArticleManually(articleId) {
    try {
      const response = await fetch(`${this.articlesUrl}/${articleId}`);
      if (!response.ok) {
        throw new Error('Artículo no encontrado');
      }

      const article = await response.json();
      return await this.publishArticleToForum(article);
    } catch (error) {
      console.error('Error publicando artículo manualmente:', error);
      throw error;
    }
  }

  // Obtener estadísticas de publicación
  getStats() {
    return {
      totalPublished: this.publishedArticles.size,
      checkInterval: this.checkInterval,
      isRunning: true
    };
  }

  handleAuthChange(authData) {
    const wasAuthenticated = this.isAuthenticated;
    this.isAuthenticated = authData.isAuthenticated;
    
    console.log('🔄 AutoForumPublisher: Cambio de autenticación detectado', {
      wasAuthenticated,
      isAuthenticated: this.isAuthenticated
    });
    
    if (!wasAuthenticated && this.isAuthenticated) {
      // Usuario se acaba de autenticar
      console.log('✅ AutoForumPublisher: Usuario autenticado, iniciando...');
      this.init();
    } else if (wasAuthenticated && !this.isAuthenticated) {
      // Usuario se acaba de desautenticar
      console.log('🔒 AutoForumPublisher: Usuario desautenticado, deteniendo...');
      this.publishedArticles.clear();
    }
  }
}

// Inicializar cuando se carga la página
let autoForumPublisher;
document.addEventListener('DOMContentLoaded', () => {
  autoForumPublisher = new AutoForumPublisher();
});

// Hacer disponible globalmente
window.autoForumPublisher = autoForumPublisher; 