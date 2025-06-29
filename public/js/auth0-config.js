// Configuración de Auth0
const auth0Config = {
    domain: "dev-b0qip4vee7sg3q7e.us.auth0.com",
    clientId: "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab",
    authorizationParams: {
        redirect_uri: window.location.origin + "/admin/",
        audience: "https://service.hgaruna.org/api"
    },
    cacheLocation: "localstorage"
};

// Inicializar Auth0
let auth0 = null;

const configureClient = async () => {
    auth0 = await auth0.createAuth0Client(auth0Config);
};

// Configurar el cliente cuando se carga la página
configureClient(); 