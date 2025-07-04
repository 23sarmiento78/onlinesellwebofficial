// Auth0 Configuration for Admin Panel
class Auth0Manager {
  constructor() {
    this.auth0Client = null;
    this.domain = "dev-b0qip4vee7sg3q7e.us.auth0.com";
    this.clientId = "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab";
    this.redirectUri = window.location.origin + "/admin-local/";
    this.audience = "https://service.hgaruna.org/api";

    this.init();
  }

  async init() {
    try {
      this.auth0Client = await auth0.createAuth0Client({
        domain: this.domain,
        clientId: this.clientId,
        authorizationParams: {
          redirect_uri: this.redirectUri,
          audience: this.audience,
        },
      });

      // Check if user is returning from Auth0 redirect
      const query = window.location.search;
      if (query.includes("code=") && query.includes("state=")) {
        await this.handleRedirectCallback();
      }

      // Check if user is already authenticated
      const isAuthenticated = await this.auth0Client.isAuthenticated();
      if (isAuthenticated) {
        const user = await this.auth0Client.getUser();
        this.handleAuthenticatedUser(user);
      }
    } catch (error) {
      console.error("Error initializing Auth0:", error);
    }
  }

  async login(connection = null) {
    try {
      const options = {
        authorizationParams: {
          redirect_uri: this.redirectUri,
          audience: this.audience,
        },
      };

      if (connection) {
        options.authorizationParams.connection = connection;
      }

      await this.auth0Client.loginWithRedirect(options);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async loginWithGoogle() {
    return this.login("google-oauth2");
  }

  async loginWithGithub() {
    return this.login("github");
  }

  async handleRedirectCallback() {
    try {
      await this.auth0Client.handleRedirectCallback();

      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);

      const user = await this.auth0Client.getUser();
      this.handleAuthenticatedUser(user);
    } catch (error) {
      console.error("Error handling redirect callback:", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.auth0Client.logout({
        logoutParams: {
          returnTo: window.location.origin + "/admin-local/",
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  }

  async getUser() {
    try {
      return await this.auth0Client.getUser();
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  async getToken() {
    try {
      return await this.auth0Client.getTokenSilently();
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  async isAuthenticated() {
    try {
      return await this.auth0Client.isAuthenticated();
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  handleAuthenticatedUser(user) {
    // Check if user has admin permissions
    if (this.isAuthorizedUser(user)) {
      // Dispatch custom event for the admin panel
      const event = new CustomEvent("auth0LoginSuccess", {
        detail: { user, token: null },
      });
      window.dispatchEvent(event);
    } else {
      alert("No tienes permisos para acceder al panel de administración.");
      this.logout();
    }
  }

  isAuthorizedUser(user) {
    // Define authorized emails or user IDs
    const authorizedEmails = ["23sarmiento@gmail.com", "admin@hgaruna.org"];

    // Check if user email is in the authorized list
    return authorizedEmails.includes(user.email);
  }

  // Utility method to check admin permissions with user metadata
  hasAdminRole(user) {
    // Check if user has admin role in Auth0 metadata
    if (user && user.app_metadata && user.app_metadata.roles) {
      return user.app_metadata.roles.includes("admin");
    }

    // Fallback to email check
    return this.isAuthorizedUser(user);
  }
}

// Initialize Auth0 when script loads
window.auth0Manager = new Auth0Manager();
