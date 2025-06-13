let auth0Client = null;

document.addEventListener('DOMContentLoaded', async () => {
  auth0Client = await Auth0Client.createAuth0Client({
    domain: 'YOUR_AUTH0_DOMAIN', // Reemplaza con tu dominio de Auth0
    client_id: 'YOUR_AUTH0_CLIENT_ID', // Reemplaza con tu Client ID de Auth0
    redirect_uri: window.location.origin
  });

  // Handle callback after authentication
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  updateUI();
});

async function login() {
  await auth0Client.loginWithRedirect({
    redirect_uri: window.location.origin
  });
}

async function logout() {
  await auth0Client.logout({
    returnTo: window.location.origin
  });
}

async function updateUI() {
  const isAuthenticated = await auth0Client.isAuthenticated();
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const userDisplayName = document.getElementById('user-display-name');
  const authButtonsContainer = document.getElementById('auth-buttons-container');

  if (authButtonsContainer) {
    if (isAuthenticated) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline-block';

      const user = await auth0Client.getUser();
      if (user && userDisplayName) {
        userDisplayName.textContent = `Hola, ${user.name || user.nickname || user.email}!`;
        userDisplayName.style.display = 'inline-block';
      }

      // Special handling for admin page
      const currentPath = window.location.pathname;
      if (currentPath.includes('admin/index.html')) {
        const adminContent = document.getElementById('admin-content');
        if (adminContent) {
          adminContent.style.display = 'block';
        }
      }

    } else {
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
      if (userDisplayName) {
        userDisplayName.style.display = 'none';
      }

      // Special handling for admin page if not authenticated
      const currentPath = window.location.pathname;
      if (currentPath.includes('admin/index.html')) {
        const adminContent = document.getElementById('admin-content');
        if (adminContent) {
          adminContent.style.display = 'none'; // Ocultar el contenido de admin
          alert('Acceso denegado. Por favor, inicie sesión para acceder a la administración.');
          window.location.href = '/'; // Redirigir a la página principal
        }
      }
    }
  }
}

// Add event listeners after auth0Client is initialized
document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      login();
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
  