const auth0 = new auth0.WebAuth({
  domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com', // Reemplaza con tu dominio de Auth0
  clientID: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab', // Reemplaza con tu Client ID de Auth0
  redirectUri: window.location.origin,
  responseType: 'token id_token',
  scope: 'openid profile email'
});

const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const userDisplayName = document.getElementById('user-display-name');
const authButtonsContainer = document.getElementById('auth-buttons-container');

function handleAuthentication() {
  auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      setSession(authResult);
    } else if (err) {
      console.log(err);
      alert('Error: ' + err.error + '. Check the console for more details.');
    }
    displayButtons();
  });
}

function setSession(authResult) {
  const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  getUserInfo(authResult.accessToken);
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('user_profile'); // Limpiar el perfil de usuario también
  auth0.logout({
    returnTo: window.location.origin
  });
}

function isAuthenticated() {
  const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
  return new Date().getTime() < expiresAt;
}

function displayButtons() {
  if (authButtonsContainer) {
    if (isAuthenticated()) {
      loginButton.style.display = 'none';
      logoutButton.style.display = 'inline-block';
      const userProfile = JSON.parse(localStorage.getItem('user_profile'));
      if (userProfile && userDisplayName) {
        userDisplayName.textContent = `Hola, ${userProfile.name || userProfile.nickname || userProfile.email}!`;
        userDisplayName.style.display = 'inline-block';
      }
    } else {
      loginButton.style.display = 'inline-block';
      logoutButton.style.display = 'none';
      if (userDisplayName) {
        userDisplayName.style.display = 'none';
      }
    }
  }
}

function getUserInfo(accessToken) {
  auth0.client.userInfo(accessToken, (err, profile) => {
    if (profile) {
      localStorage.setItem('user_profile', JSON.stringify(profile));
      if (userDisplayName) {
        userDisplayName.textContent = `Hola, ${profile.name || profile.nickname || profile.email}!`;
        userDisplayName.style.display = 'inline-block';
      }
    }
  });
}

if (loginButton) {
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth0.authorize();
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

handleAuthentication(); 