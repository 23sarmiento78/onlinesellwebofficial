// admin-app-new.js
// Nuevo sistema admin compatible con Astro y Auth0

let auth0Client;
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const dashboard = document.getElementById('dashboard');
const loginSection = document.getElementById('login-section');
const userEmail = document.getElementById('user-email');
const getDataBtn = document.getElementById('get-data-btn');
const apiResponse = document.getElementById('api-response');

// Configuración: valores reales de Auth0
const AUTH0_DOMAIN = 'dev-b0qip4vee7sg3q7e.us.auth0.com';
const AUTH0_CLIENT_ID = '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab';
const AUTH0_AUDIENCE = 'https://service.hgaruna.org/api';
const AUTH0_REDIRECT_URI = 'https://service.hgaruna.org/admin/'; // Fijo y seguro

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
    dashboard.style.display = 'block';
    const user = await auth0Client.getUser();
    userEmail.textContent = user.email;
  } else {
    loginSection.style.display = 'block';
    dashboard.style.display = 'none';
  }
}

loginBtn.onclick = async () => {
  await auth0Client.loginWithRedirect();
};

logoutBtn.onclick = async () => {
  await auth0Client.logout({ returnTo: window.location.origin + '/admin/' });
};

getDataBtn.onclick = async () => {
  const token = await auth0Client.getTokenSilently();
  const res = await fetch('/.netlify/functions/admin-api', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  apiResponse.textContent = JSON.stringify(data, null, 2);
};

// --- Formulario de creación de artículos ---
const articleForm = document.getElementById('article-form');
const articleResult = document.getElementById('article-result');

if (articleForm) {
  articleForm.onsubmit = async (e) => {
    e.preventDefault();
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
      articleResult.textContent = 'Artículo publicado correctamente.';
      articleForm.reset();
    } else {
      articleResult.textContent = 'Error: ' + (data.error || 'No se pudo publicar el artículo');
    }
  };
}

// --- Formulario de creación de publicaciones en el foro ---
const forumForm = document.getElementById('forum-form');
const forumResult = document.getElementById('forum-result');

if (forumForm) {
  forumForm.onsubmit = async (e) => {
    e.preventDefault();
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
      forumResult.textContent = 'Publicación creada correctamente.';
      forumForm.reset();
    } else {
      forumResult.textContent = 'Error: ' + (data.error || 'No se pudo crear la publicación');
    }
  };
}

// --- Feed dinámico de artículos y posts del foro ---
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
if (document.getElementById('latest-articles') || document.getElementById('latest-forum-posts')) {
  loadFeed();
}

handleAuth();
