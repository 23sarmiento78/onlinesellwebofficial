// Configuración de Auth0
const auth0Config = {
    domain: "dev-b0qip4vee7sg3q7e.us.auth0.com",
    clientId: "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab",
    authorizationParams: {
        redirect_uri: window.location.origin + "/admin/"
    },
    cacheLocation: "localstorage"
};

// Variable global para el cliente Auth0
let auth0Client = null;

// Función para inicializar el cliente Auth0
const configureClient = async () => {
    try {
        // Verificar que auth0 esté disponible
        if (typeof auth0 === 'undefined') {
            console.error("Auth0 SDK no está cargado");
            return null;
        }
        
        console.log("Inicializando Auth0 client...");
        console.log("Configuración:", auth0Config);
        
        auth0Client = await auth0.createAuth0Client(auth0Config);
        console.log("Auth0 client initialized successfully:", auth0Client);
        
        // Verificar métodos del cliente
        console.log("Métodos del cliente Auth0:", Object.keys(auth0Client));
        console.log("isAuthenticated disponible:", typeof auth0Client.isAuthenticated);
        console.log("loginWithRedirect disponible:", typeof auth0Client.loginWithRedirect);
        
        return auth0Client;
    } catch (error) {
        console.error("Error initializing Auth0 client:", error);
        return null;
    }
};

// Función para obtener el cliente Auth0
const getAuth0Client = () => {
    return auth0Client;
};

// Inicializar el cliente inmediatamente
configureClient(); 