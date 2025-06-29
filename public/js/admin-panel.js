// Panel de Administración - Sistema Limpio
class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.articles = [];
    this.forumPosts = [];
    this.init();
  }

  async init() {
    console.log('🔄 Inicializando AdminPanel...');
    
    // Esperar a que Auth0Manager esté listo
    await this.waitForAuth0();
    
    // Verificar autenticación
    if (!window.auth0Manager || !window.auth0Manager.isLoggedIn()) {
      console.log('❌ Usuario no autenticado, mostrando login');
      window.auth0Manager.showLogin();
      return;
    }

    console.log('✅ Usuario autenticado, inicializando panel');
    
    this.setupNavigation();
    this.setupEventListeners();
    this.loadDashboard();
    this.updateUserInfo();
  }

  async waitForAuth0() {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos máximo
      
      const checkAuth0 = () => {
        attempts++;
        console.log(`⏳ Esperando Auth0Manager... (intento ${attempts}/${maxAttempts})`);
        
        if (window.auth0Manager && typeof window.auth0Manager.isLoggedIn === 'function') {
          console.log('✅ Auth0Manager está listo');
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error('❌ Timeout esperando Auth0Manager');
          resolve();
        } else {
          setTimeout(checkAuth0, 100);
        }
      };
      checkAuth0();
    });
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.showSection(section);
      });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.logout();
    });
  }

  setupEventListeners() {
    // Artículos
    document.getElementById('new-article-btn').addEventListener('click', () => {
      this.showArticleModal();
    });

    document.getElementById('close-article-modal').addEventListener('click', () => {
      this.hideArticleModal();
    });

    document.getElementById('cancel-article').addEventListener('click', () => {
      this.hideArticleModal();
    });

    document.getElementById('article-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveArticle();
    });

    // Foro
    document.getElementById('new-forum-post-btn').addEventListener('click', () => {
      this.showForumModal();
    });

    document.getElementById('close-forum-modal').addEventListener('click', () => {
      this.hideForumModal();
    });

    document.getElementById('cancel-forum').addEventListener('click', () => {
      this.hideForumModal();
    });

    document.getElementById('forum-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveForumPost();
    });
  }

  showSection(section) {
    // Actualizar navegación
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Mostrar contenido
    document.querySelectorAll('.content-section').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');

    // Actualizar título
    const titles = {
      dashboard: 'Dashboard',
      articles: 'Gestión de Artículos',
      forum: 'Gestión del Foro',
      settings: 'Configuración'
    };
    document.getElementById('page-title').textContent = titles[section];

    this.currentSection = section;

    // Cargar datos según la sección
    switch (section) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'articles':
        this.loadArticles();
        break;
      case 'forum':
        this.loadForumPosts();
        break;
    }
  }

  async loadDashboard() {
    try {
      // Cargar estadísticas
      await Promise.all([
        this.loadArticlesCount(),
        this.loadForumPostsCount()
      ]);
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  }

  async loadArticlesCount() {
    try {
      const response = await this.apiCall('/articles', 'GET');
      this.articles = response;
      document.getElementById('articles-count').textContent = this.articles.length;
    } catch (error) {
      console.error('Error cargando artículos:', error);
    }
  }

  async loadForumPostsCount() {
    try {
      const response = await this.apiCall('/forum-posts', 'GET');
      this.forumPosts = response;
      document.getElementById('forum-posts-count').textContent = this.forumPosts.length;
    } catch (error) {
      console.error('Error cargando publicaciones del foro:', error);
    }
  }

  async loadArticles() {
    const container = document.getElementById('articles-list');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando artículos...</div>';

    try {
      const articles = await this.apiCall('/articles', 'GET');
      this.articles = articles;
      this.renderArticles(articles);
    } catch (error) {
      console.error('Error cargando artículos:', error);
      container.innerHTML = '<div class="alert alert-error">Error cargando artículos</div>';
    }
  }

  renderArticles(articles) {
    const container = document.getElementById('articles-list');
    if (!container) return;

    if (articles.length === 0) {
      container.innerHTML = '<div class="text-center">No hay artículos publicados</div>';
      return;
    }

    const table = `
      <table class="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${articles.map(article => `
            <tr>
              <td>${article.title}</td>
              <td>${article.category || 'Sin categoría'}</td>
              <td>${new Date(article.date).toLocaleDateString()}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="adminPanel.editArticle('${article.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteArticle('${article.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = table;
  }

  async loadForumPosts() {
    const container = document.getElementById('forum-posts-list');
    if (!container) return;
    container.innerHTML = '<div class="loading">Cargando publicaciones...</div>';

    try {
      const posts = await this.apiCall('/forum-posts', 'GET');
      this.forumPosts = posts;
      this.renderForumPosts(posts);
    } catch (error) {
      console.error('Error cargando publicaciones del foro:', error);
      container.innerHTML = '<div class="alert alert-error">Error cargando publicaciones</div>';
    }
  }

  renderForumPosts(posts) {
    const container = document.getElementById('forum-posts-list');
    if (!container) return;

    if (posts.length === 0) {
      container.innerHTML = '<div class="text-center">No hay publicaciones en el foro</div>';
      return;
    }

    const table = `
      <table class="table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${posts.map(post => `
            <tr>
              <td>${post.title}</td>
              <td>${post.category || 'Sin categoría'}</td>
              <td>${new Date(post.date).toLocaleDateString()}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="adminPanel.editForumPost('${post.id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="adminPanel.deleteForumPost('${post.id}')">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = table;
  }

  showArticleModal(article = null) {
    const modal = document.getElementById('article-modal');
    const title = document.getElementById('article-modal-title');
    
    if (article) {
      title.textContent = 'Editar Artículo';
      this.fillArticleForm(article);
    } else {
      title.textContent = 'Nuevo Artículo';
      document.getElementById('article-form').reset();
    }
    
    modal.classList.remove('d-none');
  }

  hideArticleModal() {
    document.getElementById('article-modal').classList.add('d-none');
  }

  fillArticleForm(article) {
    document.getElementById('article-title').value = article.title || '';
    document.getElementById('article-description').value = article.description || '';
    document.getElementById('article-content').value = article.content || '';
    document.getElementById('article-category').value = article.category || '';
    document.getElementById('article-image').value = article.image || '';
    document.getElementById('article-tags').value = (article.tags || []).join(', ');
  }

  async saveArticle() {
    const formData = {
      title: document.getElementById('article-title').value,
      description: document.getElementById('article-description').value,
      content: document.getElementById('article-content').value,
      category: document.getElementById('article-category').value,
      image: document.getElementById('article-image').value,
      tags: document.getElementById('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
      date: new Date().toISOString(),
      author: 'hgaruna'
    };

    try {
      const response = await this.apiCall('/articles', 'POST', formData);
      this.showAlert('Artículo guardado exitosamente', 'success');
      this.hideArticleModal();
      this.loadArticles();
    } catch (error) {
      console.error('Error guardando artículo:', error);
      this.showAlert('Error guardando artículo: ' + error.message, 'error');
    }
  }

  showForumModal(post = null) {
    const modal = document.getElementById('forum-modal');
    const title = document.getElementById('forum-modal-title');
    
    if (post) {
      title.textContent = 'Editar Publicación';
      this.fillForumForm(post);
    } else {
      title.textContent = 'Nueva Publicación';
      document.getElementById('forum-form').reset();
    }
    
    modal.classList.remove('d-none');
  }

  hideForumModal() {
    document.getElementById('forum-modal').classList.add('d-none');
  }

  fillForumForm(post) {
    document.getElementById('forum-title').value = post.title || '';
    document.getElementById('forum-content').value = post.content || '';
    document.getElementById('forum-category').value = post.category || '';
  }

  async saveForumPost() {
    const formData = {
      title: document.getElementById('forum-title').value,
      content: document.getElementById('forum-content').value,
      category: document.getElementById('forum-category').value,
      date: new Date().toISOString(),
      author: 'hgaruna'
    };

    try {
      const response = await this.apiCall('/forum-posts', 'POST', formData);
      this.showAlert('Publicación guardada exitosamente', 'success');
      this.hideForumModal();
      this.loadForumPosts();
    } catch (error) {
      console.error('Error guardando publicación:', error);
      this.showAlert('Error guardando publicación: ' + error.message, 'error');
    }
  }

  async apiCall(endpoint, method = 'GET', data = null) {
    const token = window.auth0Manager.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`/.netlify/functions/admin-api${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la petición');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en API call:', error);
      throw error;
    }
  }

  showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: 600;
      z-index: 10000;
    `;

    if (type === 'success') {
      alertDiv.style.background = '#27ae60';
    } else if (type === 'error') {
      alertDiv.style.background = '#e74c3c';
    } else {
      alertDiv.style.background = '#3498db';
    }

    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  updateUserInfo() {
    const user = window.auth0Manager.getUser();
    if (user) {
      document.getElementById('user-name').textContent = user.name || 'Administrador';
      document.getElementById('user-avatar').textContent = (user.name || 'A').charAt(0).toUpperCase();
    }
  }

  logout() {
    window.auth0Manager.logout();
  }

  editArticle(id) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      this.showArticleModal(article);
    }
  }

  async deleteArticle(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      try {
        await this.apiCall(`/articles/${id}`, 'DELETE');
        this.showAlert('Artículo eliminado exitosamente', 'success');
        this.loadArticles();
      } catch (error) {
        console.error('Error eliminando artículo:', error);
        this.showAlert('Error eliminando artículo: ' + error.message, 'error');
      }
    }
  }

  editForumPost(id) {
    const post = this.forumPosts.find(p => p.id === id);
    if (post) {
      this.showForumModal(post);
    }
  }

  async deleteForumPost(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        await this.apiCall(`/forum-posts/${id}`, 'DELETE');
        this.showAlert('Publicación eliminada exitosamente', 'success');
        this.loadForumPosts();
      } catch (error) {
        console.error('Error eliminando publicación:', error);
        this.showAlert('Error eliminando publicación: ' + error.message, 'error');
      }
    }
  }
}

// Hacer la clase AdminPanel globalmente accesible
window.AdminPanel = AdminPanel;

// Instanciar AdminPanel cuando el usuario esté autenticado
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 DOM cargado, esperando Auth0Manager...');
  
  // Esperar a que Auth0Manager se inicialice
  await new Promise((resolve) => {
    const checkAuth0 = () => {
      if (window.auth0Manager && typeof window.auth0Manager.isLoggedIn === 'function') {
        console.log('✅ Auth0Manager está listo, verificando autenticación...');
        resolve();
      } else {
        setTimeout(checkAuth0, 100);
      }
    };
    checkAuth0();
  });
  
  // Verificar si el usuario está autenticado
  if (window.auth0Manager && window.auth0Manager.isLoggedIn()) {
    window.adminPanel = new AdminPanel();
    console.log('✅ AdminPanel inicializado');
  } else {
    console.log('❌ Usuario no autenticado, no se inicializa AdminPanel');
  }
}); 