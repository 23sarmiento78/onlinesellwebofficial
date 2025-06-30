// Integración con LinkedIn API para compartir publicaciones del foro
class LinkedInIntegration {
  constructor() {
    this.config = window.LINKEDIN_CONFIG || {};
    this.clientId = this.config.CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
    this.redirectUri = this.config.REDIRECT_URI || 'https://service.hgaruna.org/linkedin-callback.html';
    this.scope = this.config.SCOPE || 'w_member_social';
    this.apiVersion = this.config.API_VERSION || 'v2';
    this.accessToken = localStorage.getItem('linkedin_access_token');
    this.init();
  }

  async init() {
    // Verificar si ya tenemos un token válido
    if (this.accessToken) {
      const isValid = await this.validateToken();
      if (!isValid) {
        this.accessToken = null;
        localStorage.removeItem('linkedin_access_token');
      }
    }
  }

  // Autenticación con LinkedIn
  async authenticate() {
    const state = this.generateState();
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${encodeURIComponent(this.scope)}&` +
      `state=${state}`;

    // Guardar el estado para verificación
    sessionStorage.setItem('linkedin_auth_state', state);

    // Abrir ventana de autenticación
    const authWindow = window.open(authUrl, 'linkedin_auth', 
      'width=600,height=700,scrollbars=yes,resizable=yes');

    return new Promise((resolve, reject) => {
      // Escuchar mensaje de la ventana de autenticación
      const messageHandler = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'linkedin_auth_success') {
          this.accessToken = event.data.access_token;
          localStorage.setItem('linkedin_access_token', this.accessToken);
          sessionStorage.removeItem('linkedin_auth_state');
          window.removeEventListener('message', messageHandler);
          authWindow.close();
          resolve(true);
        } else if (event.data.type === 'linkedin_auth_error') {
          sessionStorage.removeItem('linkedin_auth_state');
          window.removeEventListener('message', messageHandler);
          authWindow.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageHandler);

      // Verificar si la ventana se cerró manualmente
      const checkClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          sessionStorage.removeItem('linkedin_auth_state');
          reject(new Error('Autenticación cancelada por el usuario'));
        }
      }, 1000);

      // Timeout después de 5 minutos
      setTimeout(() => {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        sessionStorage.removeItem('linkedin_auth_state');
        authWindow.close();
        reject(new Error('Timeout en autenticación'));
      }, 300000);
    });
  }

  // Intercambiar código por token de acceso
  async exchangeCodeForToken(code) {
    try {
      const response = await fetch('/.netlify/functions/linkedin-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUri: this.redirectUri })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error intercambiando código por token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error intercambiando código:', error);
      throw error;
    }
  }

  // Validar token de acceso
  async validateToken() {
    try {
      const response = await fetch(`https://api.linkedin.com/${this.apiVersion}/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await fetch(`https://api.linkedin.com/${this.apiVersion}/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo perfil');
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }

  // Compartir publicación en LinkedIn
  async sharePost(postData) {
    try {
      if (!this.accessToken) {
        throw new Error('No hay token de acceso. Autentícate primero.');
      }

      const shareData = {
        author: `urn:li:person:${await this.getPersonURN()}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: this.formatPostForLinkedIn(postData)
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      const response = await fetch(`https://api.linkedin.com/${this.apiVersion}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(shareData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error compartiendo en LinkedIn: ${errorData.message}`);
      }

      const result = await response.json();
      console.log('✅ Publicación compartida en LinkedIn:', result);
      return result;
    } catch (error) {
      console.error('❌ Error compartiendo en LinkedIn:', error);
      throw error;
    }
  }

  // Obtener URN de la persona
  async getPersonURN() {
    try {
      const profile = await this.getProfile();
      return profile.id;
    } catch (error) {
      console.error('Error obteniendo URN:', error);
      throw error;
    }
  }

  // Formatear publicación para LinkedIn
  formatPostForLinkedIn(postData) {
    const maxLength = this.config.AUTO_SHARE?.maxLength || 3000;
    let text = `${postData.title}\n\n`;
    
    // Agregar contenido
    if (postData.content) {
      const content = postData.content.length > maxLength - text.length 
        ? postData.content.substring(0, maxLength - text.length - 3) + '...'
        : postData.content;
      text += content;
    }

    // Agregar hashtags si están habilitados
    if (this.config.AUTO_SHARE?.includeHashtags && postData.tags && postData.tags.length > 0) {
      const hashtags = postData.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
      text += `\n\n${hashtags}`;
    }

    // Agregar enlace al foro si está habilitado
    if (this.config.AUTO_SHARE?.includeLink) {
      text += `\n\n💬 Comenta en nuestro foro: ${window.location.origin}/foro/`;
    }
    
    // Agregar firma personal si está configurado
    if (this.config.AUTO_SHARE?.personalProfile?.includeName) {
      text += `\n\n---\nCompartido desde hgaruna - Desarrollo Web en Villa Carlos Paz`;
    }
    
    return text;
  }

  // Generar estado para seguridad OAuth
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.accessToken;
  }

  // Cerrar sesión
  logout() {
    this.accessToken = null;
    localStorage.removeItem('linkedin_access_token');
  }

  // Mostrar estado de conexión
  getConnectionStatus() {
    return {
      isAuthenticated: this.isAuthenticated(),
      hasToken: !!this.accessToken
    };
  }
}

// Inicializar integración cuando se carga la página
let linkedInIntegration;
document.addEventListener('DOMContentLoaded', () => {
  linkedInIntegration = new LinkedInIntegration();
});

// Hacer disponible globalmente
window.linkedInIntegration = linkedInIntegration;