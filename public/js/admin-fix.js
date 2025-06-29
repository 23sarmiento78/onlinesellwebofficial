// Script de diagnóstico y corrección para el panel de administración
console.log('🔧 Iniciando diagnóstico del panel de administración...');

// Función para esperar a que adminPanel esté disponible
function waitForAdminPanel() {
    return new Promise((resolve) => {
        const checkPanel = () => {
            if (window.adminPanel) {
                console.log('✅ adminPanel encontrado:', window.adminPanel);
                resolve(window.adminPanel);
            } else {
                console.log('⏳ Esperando adminPanel...');
                setTimeout(checkPanel, 100);
            }
        };
        checkPanel();
    });
}

// Función para crear adminManager con adminPanel garantizado
async function createAdminManager() {
    console.log('🔄 Creando adminManager...');
    
    const adminPanel = await waitForAdminPanel();
    
    // Crear adminManager que use directamente adminPanel
    window.adminManager = {
        // Gestión de artículos
        createArticle: async (articleData) => {
            console.log('📝 Creando artículo:', articleData);
            try {
                return await adminPanel.createArticle(articleData);
            } catch (error) {
                console.error('❌ Error al crear artículo:', error);
                throw error;
            }
        },
        
        updateArticle: async (id, articleData) => {
            console.log('✏️ Actualizando artículo:', id, articleData);
            try {
                return await adminPanel.updateArticle(id, articleData);
            } catch (error) {
                console.error('❌ Error al actualizar artículo:', error);
                throw error;
            }
        },
        
        deleteArticle: async (id) => {
            console.log('🗑️ Eliminando artículo:', id);
            try {
                return await adminPanel.deleteArticle(id);
            } catch (error) {
                console.error('❌ Error al eliminar artículo:', error);
                throw error;
            }
        },
        
        listArticles: async () => {
            console.log('📋 Listando artículos...');
            try {
                return await adminPanel.listArticles();
            } catch (error) {
                console.error('❌ Error al listar artículos:', error);
                throw error;
            }
        },
        
        // Gestión de publicaciones de foro
        createForumPost: async (postData) => {
            console.log('💬 Creando publicación de foro:', postData);
            try {
                return await adminPanel.createForumPost(postData);
            } catch (error) {
                console.error('❌ Error al crear publicación de foro:', error);
                throw error;
            }
        },
        
        updateForumPost: async (id, postData) => {
            console.log('✏️ Actualizando publicación de foro:', id, postData);
            try {
                return await adminPanel.updateForumPost(id, postData);
            } catch (error) {
                console.error('❌ Error al actualizar publicación de foro:', error);
                throw error;
            }
        },
        
        deleteForumPost: async (id) => {
            console.log('🗑️ Eliminando publicación de foro:', id);
            try {
                return await adminPanel.deleteForumPost(id);
            } catch (error) {
                console.error('❌ Error al eliminar publicación de foro:', error);
                throw error;
            }
        },
        
        listForumPosts: async () => {
            console.log('📋 Listando publicaciones de foro...');
            try {
                return await adminPanel.listForumPosts();
            } catch (error) {
                console.error('❌ Error al listar publicaciones de foro:', error);
                throw error;
            }
        },
        
        // Autenticación
        login: async (credentials) => {
            console.log('🔐 Iniciando sesión...');
            try {
                return await adminPanel.login(credentials);
            } catch (error) {
                console.error('❌ Error al iniciar sesión:', error);
                throw error;
            }
        },
        
        logout: async () => {
            console.log('🚪 Cerrando sesión...');
            try {
                return await adminPanel.logout();
            } catch (error) {
                console.error('❌ Error al cerrar sesión:', error);
                throw error;
            }
        },
        
        isAuthenticated: () => {
            return adminPanel.isAuthenticated();
        }
    };
    
    console.log('✅ adminManager creado exitosamente:', window.adminManager);
    
    // Verificar que todas las funciones estén disponibles
    const functions = [
        'createArticle', 'updateArticle', 'deleteArticle', 'listArticles',
        'createForumPost', 'updateForumPost', 'deleteForumPost', 'listForumPosts',
        'login', 'logout', 'isAuthenticated'
    ];
    
    functions.forEach(func => {
        if (typeof window.adminManager[func] === 'function') {
            console.log(`✅ Función ${func} disponible`);
        } else {
            console.error(`❌ Función ${func} NO disponible`);
        }
    });
    
    return window.adminManager;
}

// Ejecutar la corrección cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAdminManager);
} else {
    createAdminManager();
}

// También ejecutar después de un pequeño delay para asegurar que admin.js se haya cargado
setTimeout(() => {
    if (!window.adminManager) {
        console.log('🔄 Reintentando creación de adminManager...');
        createAdminManager();
    }
}, 1000);

console.log('🔧 Script de diagnóstico cargado'); 