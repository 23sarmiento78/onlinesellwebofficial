window.onload = function () {
    if (typeof auth0 === 'undefined') {
      console.error("El SDK de Auth0 no está disponible.");
      return;
    }
  
    const auth0Instance = new auth0.WebAuth({
      domain: 'dev-b0qip4vee7sg3q7e.us.auth0.com',
      clientID: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab',
      redirectUri: window.location.origin,
      responseType: 'token id_token',
      scope: 'openid profile email'
    });
  
    function handleAuthentication() {
      auth0Instance.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          setSession(authResult);
        } else if (err) {
          console.error(err);
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
      localStorage.clear();
      auth0Instance.logout({ returnTo: window.location.origin });
    }
  
    function isAuthenticated() {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
      return new Date().getTime() < expiresAt;
    }
  
    function displayButtons() {
      const loginButton = document.getElementById('login-button');
      const logoutButton = document.getElementById('logout-button');
      const userDisplayName = document.getElementById('user-display-name');
  
      if (isAuthenticated()) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        const userProfile = JSON.parse(localStorage.getItem('user_profile'));
        if (userProfile && userDisplayName) {
          userDisplayName.textContent = `Hola, ${userProfile.name || userProfile.nickname || userProfile.email}!`;
        }
      } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        userDisplayName.style.display = 'none';
      }
    }
  
    function getUserInfo(accessToken) {
      auth0Instance.client.userInfo(accessToken, (err, profile) => {
        if (profile) {
          localStorage.setItem('user_profile', JSON.stringify(profile));
          const userDisplayName = document.getElementById('user-display-name');
          if (userDisplayName) {
            userDisplayName.textContent = `Hola, ${profile.name || profile.nickname || profile.email}!`;
          }
        }
      });
    }
  
    handleAuthentication();
  };
  