// Panel de Administración - hgaruna
class AdminPanel {
  constructor() {
    this.currentSection = 'dashboard';
    this.articles = [];
    this.forumPosts = [];
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.loadDashboard();
    this.updateUserInfo();
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
      this.showAlert('Error cargando estadísticas', 'error');
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
    const form = document.getElementById('article-form');

    if (article) {
      title.textContent = 'Editar Artículo';
      this.fillArticleForm(article);
    } else {
      title.textContent = 'Nuevo Artículo';
      form.reset();
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
    document.getElementById('article-tags').value = article.tags ? article.tags.join(', ') : '';
  }

  async saveArticle() {
    const formData = {
      title: document.getElementById('article-title').value,
      description: document.getElementById('article-description').value,
      content: document.getElementById('article-content').value,
      category: document.getElementById('article-category').value,
      image: document.getElementById('article-image').value,
      tags: document.getElementById('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      await this.apiCall('/articles', 'POST', formData);
      this.showAlert('Artículo guardado correctamente', 'success');
      this.hideArticleModal();
      this.loadArticles();
      this.loadDashboard();
    } catch (error) {
      console.error('Error guardando artículo:', error);
      this.showAlert('Error guardando artículo', 'error');
    }
  }

  showForumModal(post = null) {
    const modal = document.getElementById('forum-modal');
    const title = document.getElementById('forum-modal-title');
    const form = document.getElementById('forum-form');

    if (post) {
      title.textContent = 'Editar Publicación';
      this.fillForumForm(post);
    } else {
      title.textContent = 'Nueva Publicación';
      form.reset();
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
      category: document.getElementById('forum-category').value
    };

    try {
      await this.apiCall('/forum-posts', 'POST', formData);
      this.showAlert('Publicación guardada correctamente', 'success');
      this.hideForumModal();
      this.loadForumPosts();
      this.loadDashboard();
    } catch (error) {
      console.error('Error guardando publicación:', error);
      this.showAlert('Error guardando publicación', 'error');
    }
  }

  async apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('auth_token');
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

    const response = await fetch(`/.netlify/functions/admin-api${endpoint}`, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la API');
    }

    return await response.json();
  }

  showAlert(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = document.querySelector('.main-content');
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const avatar = document.getElementById('user-avatar');
    const name = document.getElementById('user-name');
    
    if (user.name) {
      avatar.textContent = user.name.charAt(0).toUpperCase();
      name.textContent = user.name;
    } else if (user.email) {
      avatar.textContent = user.email.charAt(0).toUpperCase();
      name.textContent = user.email;
    }
  }

  logout() {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  }

  // Métodos para editar y eliminar
  editArticle(id) {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      this.showArticleModal(article);
    }
  }

  async deleteArticle(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      try {
        await this.apiCall('/articles', 'DELETE', { id });
        this.showAlert('Artículo eliminado correctamente', 'success');
        this.loadArticles();
        this.loadDashboard();
      } catch (error) {
        console.error('Error eliminando artículo:', error);
        this.showAlert('Error eliminando artículo', 'error');
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
        await this.apiCall('/forum-posts', 'DELETE', { id });
        this.showAlert('Publicación eliminada correctamente', 'success');
        this.loadForumPosts();
        this.loadDashboard();
      } catch (error) {
        console.error('Error eliminando publicación:', error);
        this.showAlert('Error eliminando publicación', 'error');
      }
    }
  }
}

// Inicializar el panel de administración
let adminPanel;

document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación
  const token = localStorage.getItem('auth_token');
  if (!token) {
    window.location.href = '/';
    return;
  }

  adminPanel = new AdminPanel();
}); 