// admin-app-new.js
// Nuevo sistema admin compatible con Astro y Auth0

// --- NUEVA LÓGICA ADMIN ---
let auth0Client;
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const dashboard = document.getElementById('admin-app');
const loginSection = document.getElementById('login-section');
const userEmail = document.getElementById('user-email');

// Configuración Auth0 (desde archivo de respaldo)
const AUTH0_DOMAIN = 'dev-b0qip4vee7sg3q7e.us.auth0.com';
const AUTH0_CLIENT_ID = '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab';
const AUTH0_AUDIENCE = 'https://service.hgaruna.org/api';
const AUTH0_REDIRECT_URI = 'https://service.hgaruna.org/admin/';

async function configureAuth0() {
  auth0Client = await createAuth0Client({
    domain: AUTH0_DOMAIN,
    client_id: AUTH0_CLIENT_ID,
    audience: AUTH0_AUDIENCE,
    redirect_uri: AUTH0_REDIRECT_URI
  });
}

async function handleAuth() {
  await configureAuth0();
  if (window.location.search.includes('code=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/admin/');
  }
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    loginSection.style.display = 'none';
    dashboard.style.display = 'flex';
    const user = await auth0Client.getUser();
    userEmail.textContent = user.email;
    loadFeed();
  } else {
    loginSection.style.display = 'flex';
    dashboard.style.display = 'none';
  }
}

if (loginBtn) loginBtn.onclick = async () => { await auth0Client.loginWithRedirect(); };
if (logoutBtn) logoutBtn.onclick = async () => { await auth0Client.logout({ returnTo: AUTH0_REDIRECT_URI }); };

// Feed dinámico de artículos y posts del foro
async function loadFeed() {
  // Artículos
  try {
    const res = await fetch('/data/articles.json');
    const data = await res.json();
    const articles = Array.isArray(data) ? data : (data.articles || data);
    const latestArticles = articles.slice(0, 3);
    const container = document.getElementById('latest-articles');
    if (container) {
      container.innerHTML = latestArticles.map(a => `
        <div class="feed-card">
          <div class="feed-card-title">${a.title}</div>
          <div class="feed-card-meta">Por ${a.author} | ${a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
          <div class="feed-card-content">${a.content?.slice(0, 120) || ''}${a.content && a.content.length > 120 ? '...' : ''}</div>
        </div>
      `).join('');
    }
  } catch {}
  // Foro
  try {
    const res = await fetch('/data/forum-posts.json');
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
  const token = await auth0Client.getTokenSilently();
  const body = {
    title: document.getElementById('article-title').value,
    content: document.getElementById('article-content').value,
    author: document.getElementById('article-author').value,
    seoDescription: document.getElementById('article-seo-description').value,
    seoKeywords: document.getElementById('article-seo-keywords').value,
    image: document.getElementById('article-image').value
  };
  const res = await fetch('/.netlify/functions/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ action: 'create-article', article: body })
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
  const token = await auth0Client.getTokenSilently();
  const body = {
    title: document.getElementById('forum-title').value,
    content: document.getElementById('forum-content').value,
    author: document.getElementById('forum-author').value,
    tags: document.getElementById('forum-tags').value
  };
  const res = await fetch('/.netlify/functions/admin-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ action: 'create-forum-post', post: body })
  });
  const data = await res.json();
  if (res.ok) {
    showResult(forumResult, 'Publicación creada correctamente.');
    forumForm.reset();
    loadFeed();
  } else {
    showResult(forumResult, 'Error: ' + (data.error || 'No se pudo crear la publicación'), false);
  }
}

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

handleAuth();
