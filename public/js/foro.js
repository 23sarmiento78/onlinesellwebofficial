// Sistema de Foro con Almacenamiento Local - Mejorado para uso sin registro
class ForoManager {
  constructor() {
    this.posts = [];
    this.currentUser = this.getCurrentUser();
    this.comments = this.loadComments();
    this.init();
  }

  // Obtener usuario actual (sistema temporal sin registro)
  getCurrentUser() {
    let user = localStorage.getItem('foro_temp_user');
    if (!user) {
      // Crear usuario temporal
      const tempNames = ['Visitante', 'Usuario', 'Anónimo', 'Invitado'];
      const randomName = tempNames[Math.floor(Math.random() * tempNames.length)];
      const randomId = Math.random().toString(36).substr(2, 9);
      user = {
        name: `${randomName}${randomId}`,
        avatar: '/logos-he-imagenes/logo3.png',
        verified: false,
        isTemp: true
      };
      localStorage.setItem('foro_temp_user', JSON.stringify(user));
    } else {
      user = JSON.parse(user);
    }
    return user;
  }

  // Cargar comentarios desde localStorage
  loadComments() {
    const savedComments = localStorage.getItem('foro_comments');
    return savedComments ? JSON.parse(savedComments) : {};
  }

  // Guardar comentarios en localStorage
  saveComments() {
    localStorage.setItem('foro_comments', JSON.stringify(this.comments));
  }

  // Cargar publicaciones desde MongoDB (Netlify Function)
  async loadForumPosts() {
    try {
      const res = await fetch('/.netlify/functions/get-forum-posts');
      const data = await res.json();
      const posts = Array.isArray(data) ? data : (data.posts || data);
      this.renderForumPosts(posts);
    } catch (e) {
      console.error('Error cargando posts del foro:', e);
    }
  }

  // Renderizar publicaciones en el foro
  renderForumPosts(posts) {
    const container = document.querySelector('.main-content');
    if (!container) return;
    container.innerHTML = posts.map(post => `
      <div class="foro-post">
        <div class="foro-post-header">
          <img src="${post.avatar || '/logos-he-imagenes/logo3.png'}" class="foro-post-avatar" alt="avatar" />
          <div>
            <strong>${post.author || 'Anónimo'}</strong>
            <span class="foro-post-date">${post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</span>
          </div>
        </div>
        <div class="foro-post-content">${post.content}</div>
        ${post.image ? `<img src="${post.image}" class="foro-post-image" alt="imagen post" />` : ''}
        <div class="foro-post-tags">${post.tags ? post.tags : ''}</div>
      </div>
    `).join('');
  }

  // Guardar publicaciones en localStorage
  savePosts() {
    localStorage.setItem('foro_posts', JSON.stringify(this.posts));
  }

  // Crear nueva publicación
  async createPost(content, image = null, category = 'General', tags = []) {
    const newPost = {
      author: this.currentUser.name,
      avatar: this.currentUser.avatar,
      content: content,
      image: image,
      category: category,
      tags: tags || [],
    };
    try {
      const res = await fetch('/.netlify/functions/create-forum-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        // Recargar posts desde el backend para mostrar el nuevo
        await this.loadForumPosts();
      } else {
        const error = await res.json();
        console.error('Error creando post:', error);
      }
    } catch (e) {
      console.error('Error creando post:', e);
    }
  }

  // Dar like a una publicación
  toggleLike(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const userIndex = post.likedBy.indexOf(this.currentUser.name);
    
    if (userIndex > -1) {
      // Quitar like
      post.likedBy.splice(userIndex, 1);
      post.likes--;
    } else {
      // Dar like
      post.likedBy.push(this.currentUser.name);
      post.likes++;
    }

    this.savePosts();
    this.updatePostStats(postId);
  }

  // Agregar comentario
  addComment(postId, content) {
    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }

    const newComment = {
      id: Date.now(),
      author: this.currentUser,
      content: content,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    this.comments[postId].push(newComment);
    this.saveComments();

    // Actualizar contador de comentarios en la publicación
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.comments = this.comments[postId].length;
      this.savePosts();
      this.updatePostStats(postId);
    }

    return newComment;
  }

  // Dar like a un comentario
  toggleCommentLike(postId, commentId) {
    if (!this.comments[postId]) return;

    const comment = this.comments[postId].find(c => c.id === commentId);
    if (!comment) return;

    const userIndex = comment.likedBy.indexOf(this.currentUser.name);
    
    if (userIndex > -1) {
      comment.likedBy.splice(userIndex, 1);
      comment.likes--;
    } else {
      comment.likedBy.push(this.currentUser.name);
      comment.likes++;
    }

    this.saveComments();
    this.updateCommentStats(postId, commentId);
  }

  // Actualizar estadísticas de comentario
  updateCommentStats(postId, commentId) {
    const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (!commentElement) return;

    const comment = this.comments[postId]?.find(c => c.id === commentId);
    if (!comment) return;

    const likeCount = commentElement.querySelector('.comment-likes');
    if (likeCount) {
      likeCount.textContent = comment.likes > 0 ? `${comment.likes} me gusta` : '';
    }

    const likeButton = commentElement.querySelector('.comment-like-btn');
    if (likeButton) {
      if (comment.likedBy.includes(this.currentUser.name)) {
        likeButton.classList.add('liked');
      } else {
        likeButton.classList.remove('liked');
      }
    }
  }

  // Actualizar estadísticas de una publicación
  updatePostStats(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const statsElement = document.querySelector(`[data-post-id="${postId}"] .post-stats`);
    if (statsElement) {
      statsElement.innerHTML = `
        <span>${post.likes} me gusta</span>
        <span>${post.comments} comentarios</span>
        <span>${post.shares} compartidos</span>
      `;
    }

    const likeButton = document.querySelector(`[data-post-id="${postId}"][data-action="like"]`);
    if (likeButton) {
      if (post.likedBy.includes(this.currentUser.name)) {
        likeButton.classList.add('liked');
      } else {
        likeButton.classList.remove('liked');
      }
    }
  }

  // Formatear fecha
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  // Renderizar publicaciones
  renderPosts() {
    const postsContainer = document.querySelector('.main-content');
    if (!postsContainer) return;

    // Encontrar el contenedor de publicaciones (después del formulario de crear post)
    const createPostElement = document.querySelector('.create-post');
    if (!createPostElement) return;

    // Remover publicaciones existentes
    const existingPosts = postsContainer.querySelectorAll('.post-card');
    existingPosts.forEach(post => {
      if (!post.closest('.create-post')) {
        post.remove();
      }
    });

    // Agregar nuevas publicaciones
    this.posts.forEach(post => {
      const postElement = this.createPostElement(post);
      createPostElement.insertAdjacentElement('afterend', postElement);
    });
  }

  // Crear elemento de publicación
  createPostElement(post) {
    const postElement = document.createElement('article');
    postElement.className = 'post-card';
    postElement.dataset.postId = post.id;

    const isLiked = post.likedBy.includes(this.currentUser.name);

    // Generar HTML de etiquetas
    const tagsHTML = post.tags && post.tags.length > 0 ? `
      <div class="post-tags">
        ${post.tags.map(tag => `<span class="post-tag">#${tag.replace(/\s+/g, '')}</span>`).join('')}
      </div>
    ` : '';

    // Indicador de publicación automática
    const autoGeneratedBadge = post.isAutoGenerated ? '<span class="auto-generated-badge">🤖 Auto</span>' : '';

    postElement.innerHTML = `
      <div class="post-header">
        <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar" />
        <div class="author-info">
          <div class="author-name">
            ${post.author.name}
            ${post.author.verified ? '<span class="verified-badge">✓</span>' : ''}
            ${autoGeneratedBadge}
          </div>
          <div class="post-meta">
            ${this.formatDate(post.timestamp)}
            <span style="margin: 0 5px;">•</span>
            <span class="post-category">${post.category}</span>
          </div>
        </div>
      </div>

      <div class="post-content">
        ${this.formatContent(post.content)}
        ${post.image ? `<img src="${post.image}" alt="Imagen de la publicación" />` : ''}
      </div>

      ${tagsHTML}

      <div class="post-stats">
        <span>${post.likes} me gusta</span>
        <span>${post.comments} comentarios</span>
        <span>${post.shares} compartidos</span>
      </div>

      <div class="post-actions">
        <button class="action-btn ${isLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
          <i class="material-icons">${isLiked ? 'favorite' : 'favorite_border'}</i>
          Me gusta
        </button>
        <button class="action-btn" data-action="comment" data-post-id="${post.id}">
          <i class="material-icons">comment</i>
          Comentar
        </button>
        <button class="action-btn" data-action="share" data-post-id="${post.id}">
          <i class="material-icons">share</i>
          Compartir
        </button>
      </div>
    `;

    return postElement;
  }

  // Formatear contenido (soporte para markdown básico)
  formatContent(content) {
    // Convertir **texto** a <strong>texto</strong>
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convertir [texto](url) a enlaces
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Convertir saltos de línea a <br>
    content = content.replace(/\n/g, '<br>');
    
    return content;
  }

  // Inicializar el foro
  init() {
    this.loadForumPosts();
    this.setupEventListeners();
    this.setupFilters();
    this.setupSearch();
  }

  // Configurar event listeners
  setupEventListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.dataset.action;
      const postId = parseInt(target.dataset.postId);
      const commentId = parseInt(target.dataset.commentId);

      switch (action) {
        case 'like':
          this.toggleLike(postId);
          break;
        case 'comment':
          this.showCommentDialog(postId);
          break;
        case 'share':
          this.sharePost(postId);
          break;
        case 'like-comment':
          // Encontrar el postId del comentario
          const commentItem = target.closest('.comment-item');
          const modal = commentItem.closest('.comment-modal');
          if (modal) {
            const postIdFromModal = parseInt(modal.querySelector('.comment-submit-btn').dataset.postId);
            this.toggleCommentLike(postIdFromModal, commentId);
          }
          break;
        case 'close-modal':
          const modalToClose = target.closest('.comment-modal');
          if (modalToClose) {
            modalToClose.classList.remove('show');
            setTimeout(() => modalToClose.remove(), 300);
          }
          break;
      }
    });

    // Crear nueva publicación
    const createPostForm = document.querySelector('.create-post');
    if (createPostForm) {
      const postInput = createPostForm.querySelector('.create-post-input');
      const postBtn = createPostForm.querySelector('.post-btn');
      const categorySelect = createPostForm.querySelector('.post-category');

      if (postBtn) {
        postBtn.addEventListener('click', () => {
          const content = postInput ? postInput.value.trim() : '';
          const category = categorySelect ? categorySelect.value : 'General';
          
          if (content) {
            this.createPost(content, null, category);
            if (postInput) postInput.value = '';
            if (categorySelect) categorySelect.value = 'General';
            this.showNotification('¡Publicación creada exitosamente!', 'success');
          }
        });
      }
    }
  }

  // Mostrar diálogo de comentarios
  showCommentDialog(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    // Remover diálogos existentes
    const existingModal = document.querySelector('.comment-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'comment-modal';
    
    // Obtener comentarios existentes
    const comments = this.comments[postId] || [];
    
    modal.innerHTML = `
      <div class="comment-modal-content">
        <div class="comment-modal-header">
          <h3>Comentarios (${comments.length})</h3>
          <button class="close-btn" data-action="close-modal">
            <i class="material-icons">close</i>
          </button>
        </div>
        
        <div class="comment-modal-body">
          <div class="comments-list">
            ${comments.length > 0 ? comments.map(comment => this.createCommentElement(comment)).join('') : 
              '<div class="no-comments">Sé el primero en comentar</div>'}
          </div>
          
          <div class="comment-input-section">
            <div class="comment-input-wrapper">
              <img src="${this.currentUser.avatar}" alt="${this.currentUser.name}" class="comment-user-avatar" />
              <textarea class="comment-input" placeholder="Escribe tu comentario..." rows="2"></textarea>
            </div>
            <button class="comment-submit-btn" data-post-id="${postId}">
              <i class="material-icons">send</i>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // Mostrar modal con animación
    setTimeout(() => modal.classList.add('show'), 10);

    // Event listeners para el modal
    const closeBtn = modal.querySelector('.close-btn');
    const commentInput = modal.querySelector('.comment-input');
    const submitBtn = modal.querySelector('.comment-submit-btn');

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300);
    });

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    });

    // Enviar comentario con Enter
    commentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submitComment(postId, commentInput);
      }
    });

    // Enviar comentario con botón
    submitBtn.addEventListener('click', () => {
      this.submitComment(postId, commentInput);
    });

    // Focus en el input
    commentInput.focus();
  }

  // Enviar comentario
  submitComment(postId, inputElement) {
    const content = inputElement.value.trim();
    if (!content) return;

    const comment = this.addComment(postId, content);
    
    // Agregar el nuevo comentario a la lista
    const commentsList = document.querySelector('.comments-list');
    const noComments = commentsList.querySelector('.no-comments');
    if (noComments) {
      noComments.remove();
    }
    
    const commentElement = this.createCommentElement(comment);
    commentsList.insertBefore(commentElement, commentsList.firstChild);
    
    // Limpiar input
    inputElement.value = '';
    
    // Actualizar contador en el header
    const header = document.querySelector('.comment-modal-header h3');
    const comments = this.comments[postId] || [];
    header.textContent = `Comentarios (${comments.length})`;
    
    // Mostrar notificación
    this.showNotification('¡Comentario publicado!', 'success');
    
    // Cerrar automáticamente la ventana después de 1 segundo
    setTimeout(() => {
      const modal = document.querySelector('.comment-modal');
      if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
      }
    }, 1000);
  }

  // Crear elemento de comentario
  createCommentElement(comment) {
    const isLiked = comment.likedBy.includes(this.currentUser.name);
    
    return `
      <div class="comment-item" data-comment-id="${comment.id}">
        <div class="comment-header">
          <img src="${comment.author.avatar}" alt="${comment.author.name}" class="comment-avatar" />
          <div class="comment-info">
            <div class="comment-author">
              ${comment.author.name}
              ${comment.author.verified ? '<span class="verified-badge">✓</span>' : ''}
            </div>
            <div class="comment-meta">
              ${this.formatDate(comment.timestamp)}
            </div>
          </div>
        </div>
        
        <div class="comment-content">
          ${this.formatContent(comment.content)}
        </div>
        
        <div class="comment-actions">
          <button class="comment-like-btn ${isLiked ? 'liked' : ''}" data-action="like-comment" data-comment-id="${comment.id}">
            <i class="material-icons">${isLiked ? 'favorite' : 'favorite_border'}</i>
            <span class="comment-likes">${comment.likes > 0 ? `${comment.likes} me gusta` : ''}</span>
          </button>
        </div>
      </div>
    `;
  }

  // Compartir publicación
  sharePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    // Incrementar contador de compartidos
    post.shares++;
    this.savePosts();
    this.updatePostStats(postId);

    // Crear URL para compartir
    const shareUrl = `${window.location.origin}/foro?post=${postId}`;
    const shareText = `${post.content.substring(0, 100)}... - Compartido desde el foro de hgaruna`;

    // Intentar usar Web Share API si está disponible
    if (navigator.share) {
      navigator.share({
        title: 'Foro hgaruna - Desarrollo Web Villa Carlos Paz',
        text: shareText,
        url: shareUrl
      }).catch(err => {
        this.fallbackShare(shareUrl, shareText);
      });
    } else {
      this.fallbackShare(shareUrl, shareText);
    }
  }

  // Método alternativo para compartir
  fallbackShare(url, text) {
    // Crear elemento temporal para copiar al portapapeles
    const textArea = document.createElement('textarea');
    textArea.value = `${text}\n\n${url}`;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showNotification('¡Enlace copiado al portapapeles!', 'success');
    } catch (err) {
      this.showNotification('Error al copiar el enlace', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  // Mostrar notificación
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Configurar filtros
  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        // Actualizar botones activos
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.filterPosts(category);
      });
    });
  }

  // Filtrar publicaciones
  filterPosts(category) {
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
      const postId = parseInt(card.dataset.postId);
      const post = this.posts.find(p => p.id === postId);
      
      if (category === 'all' || post.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Configurar búsqueda
  setupSearch() {
    const searchInput = document.querySelector('.foro-search input');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
          this.performSearch(query);
        } else if (query.length === 0) {
          this.clearSearch();
        }
      }, 300);
    });
  }

  // Realizar búsqueda
  performSearch(query) {
    const postCards = document.querySelectorAll('.post-card');
    let foundPosts = 0;
    
    postCards.forEach(card => {
      const postId = parseInt(card.dataset.postId);
      const post = this.posts.find(p => p.id === postId);
      
      const searchText = `${post.content} ${post.category} ${post.tags.join(' ')}`.toLowerCase();
      const queryLower = query.toLowerCase();
      
      if (searchText.includes(queryLower)) {
        card.style.display = 'block';
        this.highlightSearchTerm(card, query);
        foundPosts++;
      } else {
        card.style.display = 'none';
      }
    });
    
    this.showSearchResults(query, foundPosts);
  }

  // Limpiar búsqueda
  clearSearch() {
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
      card.style.display = 'block';
      this.clearSearchHighlight(card);
    });
    
    this.clearSearchResults();
  }

  // Resaltar término buscado
  highlightSearchTerm(postElement, searchTerm) {
    const content = postElement.querySelector('.post-content');
    if (content) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      content.innerHTML = content.innerHTML.replace(regex, '<mark>$1</mark>');
    }
  }

  // Limpiar resaltado de búsqueda
  clearSearchHighlight(postElement) {
    const content = postElement.querySelector('.post-content');
    if (content) {
      content.innerHTML = content.innerHTML.replace(/<mark>(.*?)<\/mark>/g, '$1');
    }
  }

  // Mostrar resultados de búsqueda
  showSearchResults(query, count) {
    let resultsElement = document.querySelector('.search-results');
    if (!resultsElement) {
      resultsElement = document.createElement('div');
      resultsElement.className = 'search-results';
      document.querySelector('.foro-controls').appendChild(resultsElement);
    }
    
    resultsElement.innerHTML = `
      <div style="background: #f1f5f9; padding: 10px; border-radius: 8px; margin-top: 10px;">
        <strong>Búsqueda:</strong> "${query}" - ${count} resultado${count !== 1 ? 's' : ''}
        <button onclick="this.parentElement.parentElement.remove()" style="float: right; background: none; border: none; cursor: pointer;">&times;</button>
      </div>
    `;
  }

  // Limpiar mensaje de resultados
  clearSearchResults() {
    const resultsElement = document.querySelector('.search-results');
    if (resultsElement) {
      resultsElement.remove();
    }
  }
}

// Inicializar el foro cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.foroManager = new ForoManager();
});