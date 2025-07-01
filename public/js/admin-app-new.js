// admin-app-new.js
// Sistema admin con login local simple

const dashboard = document.getElementById('admin-app');
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('local-login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const userEmail = document.getElementById('user-email');

const ADMIN_EMAIL = '23sarmiento@gmail.com';
const ADMIN_PASS = 'adminmaria123';

function showDashboard(email) {
  loginSection.style.display = 'none';
  dashboard.style.display = 'flex';
  userEmail.textContent = email;
}

function hideDashboard() {
  loginSection.style.display = 'flex';
  dashboard.style.display = 'none';
  userEmail.textContent = '';
}

if (loginForm) {
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      showDashboard(email);
      loginError.textContent = '';
      localStorage.setItem('admin_logged', '1');
      localStorage.setItem('admin_email', email);
    } else {
      loginError.textContent = 'Usuario o contraseña incorrectos';
    }
  };
}

if (logoutBtn) {
  logoutBtn.onclick = function() {
    hideDashboard();
    localStorage.removeItem('admin_logged');
    localStorage.removeItem('admin_email');
  };
}

// Mantener sesión si ya está logueado
window.onload = function() {
  if (localStorage.getItem('admin_logged') === '1') {
    showDashboard(localStorage.getItem('admin_email'));
  } else {
    hideDashboard();
  }
  loadFeed();
};

// Feed dinámico de artículos
async function loadFeed() {
  // Artículos
  try {
    const res = await fetch('/.netlify/functions/get-articles');
    const data = await res.json();
    const articles = Array.isArray(data) ? data : (data.articles || data);
    const latestArticles = articles.slice(0, 3);
    const container = document.getElementById('latest-articles');
    if (container) {
      container.innerHTML = latestArticles.map((a, idx) => `
        <div class="feed-card" data-article-idx="${idx}">
          <div class="feed-card-title">${a.title}</div>
          <div class="feed-card-meta">Por ${a.author} | ${a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
          <div class="feed-card-content">${a.content?.slice(0, 120) || ''}${a.content && a.content.length > 120 ? '...' : ''}</div>
        </div>
      `).join('');
      // Agregar evento para mostrar artículo completo
      Array.from(container.querySelectorAll('.feed-card')).forEach((el, idx) => {
        el.onclick = () => showFullArticle(articles[idx]);
      });
    }
  } catch {}
  // Eliminado: Foro
  try {
    const res = await fetch('/.netlify/functions/get-forum-posts');
    const data = await res.json();
    const posts = Array.isArray(data) ? data : (data.posts || data);
    const latestPosts = posts.slice(0, 3);
    const container = document.getElementById('latest-forum-posts');
    if (container) {
      container.innerHTML = latestPosts.map(p => `
        <div class="feed-card">
          <div class="feed-card-title">${p.title}</div>
          <div class="feed-card-meta">Por ${p.author} | ${p.createdAt ? new Date(p.createdAt).toLocaleString() : ''}</div>
          <div class="feed-card-content">${p.content?.slice(0, 120) || ''}${p.content && p.content.length > 120 ? '...' : ''}</div>
        </div>
      `).join('');
    }
  } catch {}
}

// Validación y feedback visual para formularios
function showResult(element, message, success = true) {
  element.textContent = message;
  element.style.color = success ? '#2563eb' : '#e11d48';
  setTimeout(() => { element.textContent = ''; }, 4000);
}

async function submitArticleForm(articleForm, articleResult) {
  articleResult.textContent = 'Publicando...';
  const body = {
    title: document.getElementById('article-title').value,
    content: document.getElementById('article-content').value,
    author: document.getElementById('article-author').value,
    seoDescription: document.getElementById('article-seo-description').value,
    seoKeywords: document.getElementById('article-seo-keywords').value,
    image: document.getElementById('article-image').value
  };
  // Obtener token de LinkedIn si existe
  const linkedinToken = localStorage.getItem('linkedin_token') || '';
  // Construir URL del artículo (puedes ajustar la ruta según tu estructura)
  const articleUrl = window.location.origin + '/blog/';
  const res = await fetch('/.netlify/functions/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'create-article', article: body, linkedinToken, articleUrl })
  });
  const data = await res.json();
  if (res.ok) {
    showResult(articleResult, 'Artículo publicado correctamente.');
    articleForm.reset();
    loadFeed();
  } else {
    showResult(articleResult, 'Error: ' + (data.error || 'No se pudo publicar el artículo'), false);
  }
}

async function submitForumForm(forumForm, forumResult) {
  forumResult.textContent = 'Publicando...';
  const body = {
    title: document.getElementById('forum-title').value,
    content: document.getElementById('forum-content').value,
    author: document.getElementById('forum-author').value,
    tags: document.getElementById('forum-tags').value
  };
  const res = await fetch('/.netlify/functions/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'create-forum-post', post: body })
  });
  const data = await res.json();
  if (res.ok) {
    showResult(forumResult, 'Publicación creada correctamente.');
    forumForm.reset();
    loadFeed();
    // --- Publicar automáticamente en LinkedIn si hay token ---
    const linkedinToken = localStorage.getItem('linkedin_token');
    if (linkedinToken) {
      forumResult.textContent = 'Publicando en LinkedIn...';
      // Construir contenido para LinkedIn: título, resumen, hashtags y llamado a la acción
      let linkedinContent = `${body.title}\n\n`;
      // Resumen: primeros 200 caracteres del contenido
      if (body.content) {
        const resumen = body.content.length > 200 ? body.content.substring(0, 197) + '...' : body.content;
        linkedinContent += resumen + '\n\n';
      }
      // Hashtags
      if (body.tags) {
        const hashtags = body.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => `#${t.replace(/\s+/g, '')}`).join(' ');
        if (hashtags) linkedinContent += hashtags + '\n\n';
      }
      // Llamado a la acción
      // Eliminado: enlace al foro
      try {
        const linkedinRes = await fetch('/.netlify/functions/linkedin-api/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: linkedinContent, accessToken: linkedinToken })
        });
        const linkedinData = await linkedinRes.json();
        if (linkedinRes.ok && linkedinData.success) {
          showResult(forumResult, '¡Publicación creada y compartida en LinkedIn!');
        } else {
          // Eliminado: mensaje de publicación en foro
        }
      } catch (err) {
        // Eliminado: mensaje de publicación en foro
      }
    }
    // --- Fin LinkedIn ---
  } else {
    showResult(forumResult, 'Error: ' + (data.error || 'No se pudo crear la publicación'), false);
  }
}

const articleForm = document.getElementById('article-form');
const articleResult = document.getElementById('article-result');
const forumForm = document.getElementById('forum-form');
const forumResult = document.getElementById('forum-result');

if (articleForm) {
  articleForm.onsubmit = async (e) => {
    e.preventDefault();
    submitArticleForm(articleForm, articleResult);
  };
}
if (forumForm) {
  forumForm.onsubmit = async (e) => {
    e.preventDefault();
    submitForumForm(forumForm, forumResult);
  };
}

// Mostrar artículo completo al hacer clic en el feed
function showFullArticle(article) {
  const modal = document.getElementById('article-modal');
  if (!modal) return;
  modal.querySelector('.modal-title').textContent = article.title;
  modal.querySelector('.modal-author').textContent = article.author;
  modal.querySelector('.modal-date').textContent = article.createdAt ? new Date(article.createdAt).toLocaleString() : '';
  modal.querySelector('.modal-content').textContent = article.content;
  modal.style.display = 'block';
}

// Cerrar modal de artículo completo
window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('article-modal');
  if (modal) {
    modal.querySelector('.modal-close').onclick = () => {
      modal.style.display = 'none';
    };
  }
});
