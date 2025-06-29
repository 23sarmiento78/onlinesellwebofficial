// Cargador robusto de Auth0
window.Auth0Loader = {
  loaded: false,
  loading: false,
  callbacks: [],

  async load() {
    if (this.loaded) {
      return Promise.resolve();
    }

    if (this.loading) {
      return new Promise((resolve) => {
        this.callbacks.push(resolve);
      });
    }

    this.loading = true;

    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado
      if (typeof auth0 !== 'undefined') {
        this.loaded = true;
        this.loading = false;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.auth0.com/js/auth0/9.19.2/auth0.min.js';
      script.async = true;
      
      script.onload = () => {
        console.log('✅ SDK de Auth0 cargado correctamente');
        this.loaded = true;
        this.loading = false;
        resolve();
        
        // Ejecutar callbacks pendientes
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
      };
      
      script.onerror = (error) => {
        console.error('❌ Error cargando SDK de Auth0:', error);
        this.loading = false;
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
};

console.log('📦 Auth0Loader inicializado'); 