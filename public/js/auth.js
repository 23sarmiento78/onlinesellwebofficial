let auth0Client = null;

document.addEventListener('DOMContentLoaded', async () => {
  auth0Client = await createAuth0Client({
    domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com', // Reemplaza con tu dominio de Auth0
    client_id: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab', // Reemplaza con tu Client ID de Auth0
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
  const userDropdown = document.getElementById('user-dropdown');
  const userDisplayName = document.getElementById('user-display-name');
  const authButtonsContainer = document.getElementById('auth-buttons-container');
  const logoutButtonDropdown = document.getElementById('logout-button-dropdown');

  if (authButtonsContainer) {
    if (isAuthenticated) {
      loginButton.style.display = 'none';
      userDropdown.style.display = 'block';

      const user = await auth0Client.getUser();
      if (user && userDisplayName) {
        userDisplayName.textContent = `Hola, ${user.name || user.nickname || user.email}!`;
      }

      // Special handling for admin page
      const currentPath = window.location.pathname;
      if (currentPath.includes('admin.html')) {
        const adminContent = document.getElementById('admin-content');
        if (adminContent) {
          adminContent.style.display = 'block';
        }
      }

    } else {
      loginButton.style.display = 'inline-block';
      userDropdown.style.display = 'none';
      // Special handling for admin page if not authenticated
      const currentPath = window.location.pathname;
      if (currentPath.includes('admin.html')) {
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
  const logoutButtonDropdown = document.getElementById('logout-button-dropdown');

  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      login();
    });
  }

  if (logoutButtonDropdown) {
    logoutButtonDropdown.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
