// Script de corrección definitiva para adminManager
console.log('🔧 Aplicando corrección definitiva para adminManager...');

// Función para esperar a que adminPanel esté disponible
function waitForAdminPanel() {
    return new Promise((resolve) => {
        const checkPanel = () => {
            if (window.adminPanel && typeof window.adminPanel.createArticle === 'function') {
                console.log('✅ adminPanel encontrado y funcional:', window.adminPanel);
                resolve(window.adminPanel);
            } else {
                console.log('⏳ Esperando adminPanel funcional...');
                setTimeout(checkPanel, 200);
            }
        };
        checkPanel();
    });
}

// Función para crear un adminManager completamente funcional
async function createFixedAdminManager() {
    console.log('🔄 Creando adminManager corregido...');
    
    const adminPanel = await waitForAdminPanel();
    
    // Crear adminManager que reemplace completamente el anterior
    const fixedAdminManager = {
        // Gestión de artículos
        showCreateArticleForm: () => {
            console.log('📝 Mostrando formulario de creación de artículo');
            const modal = document.getElementById('article-modal');
            if (modal) {
                modal.classList.remove('d-none');
                document.getElementById('article-modal-title').textContent = 'Nuevo Artículo';
                document.getElementById('article-form').reset();
            }
        },
        
        showEditArticleForm: (article) => {
            console.log('✏️ Mostrando formulario de edición de artículo:', article);
            const modal = document.getElementById('article-modal');
            if (modal) {
                modal.classList.remove('d-none');
                document.getElementById('article-modal-title').textContent = 'Editar Artículo';
                
                // Llenar formulario con datos del artículo
                document.getElementById('article-title').value = article.title || '';
                document.getElementById('article-description').value = article.description || '';
                document.getElementById('article-content').value = article.content || '';
                document.getElementById('article-category').value = article.category || '';
                document.getElementById('article-image').value = article.image || '';
                document.getElementById('article-tags').value = article.tags ? article.tags.join(', ') : '';
                
                // Guardar ID del artículo para la actualización
                modal.dataset.articleId = article.id;
            }
        },
        
        createArticle: async (articleData) => {
            console.log('📝 Creando artículo:', articleData);
            try {
                const result = await adminPanel.createArticle(articleData);
                console.log('✅ Artículo creado exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al crear artículo:', error);
                throw error;
            }
        },
        
        updateArticle: async (id, articleData) => {
            console.log('✏️ Actualizando artículo:', id, articleData);
            try {
                const result = await adminPanel.updateArticle(id, articleData);
                console.log('✅ Artículo actualizado exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al actualizar artículo:', error);
                throw error;
            }
        },
        
        deleteArticle: async (id) => {
            console.log('🗑️ Eliminando artículo:', id);
            try {
                const result = await adminPanel.deleteArticle(id);
                console.log('✅ Artículo eliminado exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al eliminar artículo:', error);
                throw error;
            }
        },
        
        listArticles: async () => {
            console.log('📋 Listando artículos...');
            try {
                const articles = await adminPanel.listArticles();
                console.log('✅ Artículos obtenidos:', articles);
                return articles;
            } catch (error) {
                console.error('❌ Error al listar artículos:', error);
                throw error;
            }
        },
        
        // Gestión de publicaciones de foro
        showCreateForumPostForm: () => {
            console.log('💬 Mostrando formulario de creación de publicación de foro');
            const modal = document.getElementById('forum-modal');
            if (modal) {
                modal.classList.remove('d-none');
                document.getElementById('forum-modal-title').textContent = 'Nueva Publicación';
                document.getElementById('forum-form').reset();
            }
        },
        
        showEditForumPostForm: (post) => {
            console.log('✏️ Mostrando formulario de edición de publicación de foro:', post);
            const modal = document.getElementById('forum-modal');
            if (modal) {
                modal.classList.remove('d-none');
                document.getElementById('forum-modal-title').textContent = 'Editar Publicación';
                
                // Llenar formulario con datos de la publicación
                document.getElementById('forum-title').value = post.title || '';
                document.getElementById('forum-content').value = post.content || '';
                document.getElementById('forum-category').value = post.category || '';
                
                // Guardar ID de la publicación para la actualización
                modal.dataset.postId = post.id;
            }
        },
        
        createForumPost: async (postData) => {
            console.log('💬 Creando publicación de foro:', postData);
            try {
                const result = await adminPanel.createForumPost(postData);
                console.log('✅ Publicación de foro creada exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al crear publicación de foro:', error);
                throw error;
            }
        },
        
        updateForumPost: async (id, postData) => {
            console.log('✏️ Actualizando publicación de foro:', id, postData);
            try {
                const result = await adminPanel.updateForumPost(id, postData);
                console.log('✅ Publicación de foro actualizada exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al actualizar publicación de foro:', error);
                throw error;
            }
        },
        
        deleteForumPost: async (id) => {
            console.log('🗑️ Eliminando publicación de foro:', id);
            try {
                const result = await adminPanel.deleteForumPost(id);
                console.log('✅ Publicación de foro eliminada exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al eliminar publicación de foro:', error);
                throw error;
            }
        },
        
        listForumPosts: async () => {
            console.log('📋 Listando publicaciones de foro...');
            try {
                const posts = await adminPanel.listForumPosts();
                console.log('✅ Publicaciones de foro obtenidas:', posts);
                return posts;
            } catch (error) {
                console.error('❌ Error al listar publicaciones de foro:', error);
                throw error;
            }
        },
        
        // Autenticación
        login: async (credentials) => {
            console.log('🔐 Iniciando sesión...');
            try {
                const result = await adminPanel.login(credentials);
                console.log('✅ Sesión iniciada exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al iniciar sesión:', error);
                throw error;
            }
        },
        
        logout: async () => {
            console.log('🚪 Cerrando sesión...');
            try {
                const result = await adminPanel.logout();
                console.log('✅ Sesión cerrada exitosamente:', result);
                return result;
            } catch (error) {
                console.error('❌ Error al cerrar sesión:', error);
                throw error;
            }
        },
        
        isAuthenticated: () => {
            return adminPanel.isAuthenticated();
        },
        
        // Funciones adicionales
        showLinkedInIntegration: () => {
            console.log('🔗 Mostrando integración de LinkedIn');
            alert('Configuración de LinkedIn - Función en desarrollo');
        },
        
        showDetailedStats: () => {
            console.log('📊 Mostrando estadísticas detalladas');
            alert('Estadísticas detalladas - Función en desarrollo');
        },
        
        manageSystemSettings: () => {
            console.log('⚙️ Mostrando configuración del sistema');
            alert('Configuración del sistema - Función en desarrollo');
        }
    };
    
    // Reemplazar el adminManager existente
    window.adminManager = fixedAdminManager;
    
    console.log('✅ adminManager corregido creado exitosamente:', window.adminManager);
    
    // Verificar que todas las funciones estén disponibles
    const functions = [
        'showCreateArticleForm', 'showEditArticleForm', 'createArticle', 'updateArticle', 'deleteArticle', 'listArticles',
        'showCreateForumPostForm', 'showEditForumPostForm', 'createForumPost', 'updateForumPost', 'deleteForumPost', 'listForumPosts',
        'login', 'logout', 'isAuthenticated', 'showLinkedInIntegration', 'showDetailedStats', 'manageSystemSettings'
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
    document.addEventListener('DOMContentLoaded', createFixedAdminManager);
} else {
    createFixedAdminManager();
}

// También ejecutar después de un delay para asegurar que admin.js se haya cargado
setTimeout(() => {
    if (!window.adminManager || typeof window.adminManager.createArticle !== 'function') {
        console.log('🔄 Reintentando creación de adminManager corregido...');
        createFixedAdminManager();
    }
}, 1500);

console.log('🔧 Script de corrección definitiva cargado'); 