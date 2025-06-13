document.addEventListener('DOMContentLoaded', () => {
  if (window.netlifyIdentity) {
    // Función para actualizar la interfaz de usuario basada en el estado de autenticación
    const updateUI = () => {
      const user = netlifyIdentity.currentUser();
      const loginButton = document.getElementById('login-button');
      const userDropdown = document.getElementById('user-dropdown');
      const userDisplayName = document.getElementById('user-display-name');

      if (user) {
        // Usuario logueado
        if (loginButton) loginButton.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'block';
        if (userDisplayName) {
          userDisplayName.textContent = `Hola, ${user.user_metadata.full_name || user.email}!`;
        }

        // Redirigir si está en la página de admin y no tiene rol de admin (opcional, si implementas roles)
        // const currentPath = window.location.pathname;
        // if (currentPath.includes('/admin/') && !user.app_metadata.roles?.includes('admin')) {
        //   window.location.href = '/';
        // }

      } else {
        // Usuario no logueado
        if (loginButton) loginButton.style.display = 'inline-block';
        if (userDropdown) userDropdown.style.display = 'none';

        // Si está en la página de admin y no está logueado, redirigir
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin/')) {
          alert('Acceso denegado. Por favor, inicie sesión para acceder a la administración.');
          window.location.href = '/';
        }
      }
    };

    // Inicializar el widget y actualizar la UI
    netlifyIdentity.on('init', updateUI);
    netlifyIdentity.on('login', updateUI);
    netlifyIdentity.on('logout', updateUI);

    // Manejar clics de los botones de login/logout
    const loginButton = document.getElementById('login-button');
    const logoutButtonDropdown = document.getElementById('logout-button-dropdown');

    if (loginButton) {
      loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        netlifyIdentity.open(); // Abre el modal de inicio de sesión
      });
    }

    if (logoutButtonDropdown) {
      logoutButtonDropdown.addEventListener('click', (e) => {
        e.preventDefault();
        netlifyIdentity.logout();
      });
    }

    // Asegurarse de que el widget se inicialice incluso si no hay un evento init
    // Esto puede ser útil si el script se carga después de que el evento init ya se disparó
    if (netlifyIdentity.currentUser()) {
      updateUI();
    }
  }
});
  