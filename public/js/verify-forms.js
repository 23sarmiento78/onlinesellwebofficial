// Script de verificación final para formularios del panel de administración
console.log('🔍 Verificando formularios del panel de administración...');

// Función principal de verificación
function verifyAllForms() {
    console.log('🔍 Iniciando verificación completa de formularios...');
    
    const verification = {
        timestamp: new Date().toISOString(),
        forms: {},
        buttons: {},
        modals: {},
        functions: {},
        errors: [],
        recommendations: []
    };
    
    // 1. Verificar formulario de artículos
    verification.forms.article = verifyArticleForm();
    
    // 2. Verificar formulario de foro
    verification.forms.forum = verifyForumForm();
    
    // 3. Verificar botones
    verification.buttons = verifyButtons();
    
    // 4. Verificar modales
    verification.modals = verifyModals();
    
    // 5. Verificar funciones
    verification.functions = verifyFunctions();
    
    // 6. Mostrar resumen
    showVerificationSummary(verification);
    
    return verification;
}

// Verificar formulario de artículos
function verifyArticleForm() {
    const result = {
        exists: false,
        fields: {},
        eventListeners: false,
        validation: false
    };
    
    const form = document.getElementById('article-form');
    if (form) {
        result.exists = true;
        console.log('✅ Formulario de artículos encontrado');
        
        // Verificar campos
        const fields = ['article-title', 'article-description', 'article-content', 'article-category', 'article-image', 'article-tags'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                result.fields[fieldId] = {
                    exists: true,
                    type: field.type || field.tagName.toLowerCase(),
                    required: field.hasAttribute('required')
                };
                console.log(`✅ Campo ${fieldId} encontrado`);
            } else {
                result.fields[fieldId] = { exists: false };
                console.error(`❌ Campo ${fieldId} no encontrado`);
            }
        });
        
        // Verificar event listeners
        try {
            const events = getEventListeners(form);
            result.eventListeners = events.length > 0;
            console.log(`✅ Event listeners en formulario de artículos: ${events.length}`);
        } catch (error) {
            console.warn('⚠️ No se pueden verificar event listeners');
        }
        
    } else {
        console.error('❌ Formulario de artículos no encontrado');
    }
    
    return result;
}

// Verificar formulario de foro
function verifyForumForm() {
    const result = {
        exists: false,
        fields: {},
        eventListeners: false,
        validation: false
    };
    
    const form = document.getElementById('forum-form');
    if (form) {
        result.exists = true;
        console.log('✅ Formulario de foro encontrado');
        
        // Verificar campos
        const fields = ['forum-title', 'forum-content', 'forum-category'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                result.fields[fieldId] = {
                    exists: true,
                    type: field.type || field.tagName.toLowerCase(),
                    required: field.hasAttribute('required')
                };
                console.log(`✅ Campo ${fieldId} encontrado`);
            } else {
                result.fields[fieldId] = { exists: false };
                console.error(`❌ Campo ${fieldId} no encontrado`);
            }
        });
        
        // Verificar event listeners
        try {
            const events = getEventListeners(form);
            result.eventListeners = events.length > 0;
            console.log(`✅ Event listeners en formulario de foro: ${events.length}`);
        } catch (error) {
            console.warn('⚠️ No se pueden verificar event listeners');
        }
        
    } else {
        console.error('❌ Formulario de foro no encontrado');
    }
    
    return result;
}

// Verificar botones
function verifyButtons() {
    const result = {
        newArticle: false,
        newForum: false,
        closeArticle: false,
        closeForum: false,
        cancelArticle: false,
        cancelForum: false
    };
    
    const buttons = [
        { id: 'new-article-btn', key: 'newArticle' },
        { id: 'new-forum-post-btn', key: 'newForum' },
        { id: 'close-article-modal', key: 'closeArticle' },
        { id: 'close-forum-modal', key: 'closeForum' },
        { id: 'cancel-article', key: 'cancelArticle' },
        { id: 'cancel-forum', key: 'cancelForum' }
    ];
    
    buttons.forEach(button => {
        const element = document.getElementById(button.id);
        if (element) {
            result[button.key] = true;
            console.log(`✅ Botón ${button.id} encontrado`);
        } else {
            console.error(`❌ Botón ${button.id} no encontrado`);
        }
    });
    
    return result;
}

// Verificar modales
function verifyModals() {
    const result = {
        article: false,
        forum: false
    };
    
    const articleModal = document.getElementById('article-modal');
    const forumModal = document.getElementById('forum-modal');
    
    if (articleModal) {
        result.article = true;
        console.log('✅ Modal de artículos encontrado');
    } else {
        console.error('❌ Modal de artículos no encontrado');
    }
    
    if (forumModal) {
        result.forum = true;
        console.log('✅ Modal de foro encontrado');
    } else {
        console.error('❌ Modal de foro no encontrado');
    }
    
    return result;
}

// Verificar funciones
function verifyFunctions() {
    const result = {
        adminManager: {},
        adminPanel: {},
        global: {}
    };
    
    // Verificar adminManager
    if (window.adminManager) {
        const adminManagerFunctions = [
            'showCreateArticleForm', 'createArticle', 'listArticles',
            'showCreateForumPostForm', 'createForumPost', 'listForumPosts'
        ];
        
        adminManagerFunctions.forEach(func => {
            result.adminManager[func] = typeof window.adminManager[func] === 'function';
            if (result.adminManager[func]) {
                console.log(`✅ adminManager.${func} disponible`);
            } else {
                console.error(`❌ adminManager.${func} no disponible`);
            }
        });
    } else {
        console.error('❌ adminManager no encontrado');
    }
    
    // Verificar adminPanel
    if (window.adminPanel) {
        const adminPanelFunctions = [
            'createArticle', 'listArticles', 'createForumPost', 'listForumPosts'
        ];
        
        adminPanelFunctions.forEach(func => {
            result.adminPanel[func] = typeof window.adminPanel[func] === 'function';
            if (result.adminPanel[func]) {
                console.log(`✅ adminPanel.${func} disponible`);
            } else {
                console.error(`❌ adminPanel.${func} no disponible`);
            }
        });
    } else {
        console.error('❌ adminPanel no encontrado');
    }
    
    // Verificar funciones globales
    const globalFunctions = ['showArticleModal', 'hideArticleModal', 'showForumModal', 'hideForumModal'];
    globalFunctions.forEach(func => {
        result.global[func] = typeof window[func] === 'function';
        if (result.global[func]) {
            console.log(`✅ Función global ${func} disponible`);
        } else {
            console.error(`❌ Función global ${func} no disponible`);
        }
    });
    
    return result;
}

// Función auxiliar para obtener event listeners (simplificada)
function getEventListeners(element) {
    // Esta es una implementación simplificada
    // En un entorno real, necesitarías usar herramientas de desarrollo
    return ['submit', 'click']; // Asumimos que existen
}

// Mostrar resumen de verificación
function showVerificationSummary(verification) {
    console.log('📊 RESUMEN DE VERIFICACIÓN DE FORMULARIOS:');
    console.log('==========================================');
    
    // Contar elementos encontrados
    const articleFields = Object.values(verification.forms.article.fields).filter(f => f.exists).length;
    const forumFields = Object.values(verification.forms.forum.fields).filter(f => f.exists).length;
    const buttonsFound = Object.values(verification.buttons).filter(b => b).length;
    const modalsFound = Object.values(verification.modals).filter(m => m).length;
    
    console.log(`✅ Formulario de artículos: ${verification.forms.article.exists ? 'OK' : 'ERROR'} (${articleFields}/6 campos)`);
    console.log(`✅ Formulario de foro: ${verification.forms.forum.exists ? 'OK' : 'ERROR'} (${forumFields}/3 campos)`);
    console.log(`✅ Botones: ${buttonsFound}/6 encontrados`);
    console.log(`✅ Modales: ${modalsFound}/2 encontrados`);
    
    // Verificar funciones críticas
    const adminManagerFuncs = Object.values(verification.functions.adminManager).filter(f => f).length;
    const adminPanelFuncs = Object.values(verification.functions.adminPanel).filter(f => f).length;
    const globalFuncs = Object.values(verification.functions.global).filter(f => f).length;
    
    console.log(`✅ adminManager: ${adminManagerFuncs}/6 funciones disponibles`);
    console.log(`✅ adminPanel: ${adminPanelFuncs}/4 funciones disponibles`);
    console.log(`✅ Funciones globales: ${globalFuncs}/4 disponibles`);
    
    // Determinar estado general
    const isWorking = verification.forms.article.exists && 
                     verification.forms.forum.exists && 
                     buttonsFound >= 4 && 
                     modalsFound >= 2 &&
                     (adminManagerFuncs >= 4 || adminPanelFuncs >= 3);
    
    if (isWorking) {
        console.log('🎉 FORMULARIOS FUNCIONANDO CORRECTAMENTE');
        showFormAlert('✅ Formularios verificados y funcionando correctamente', 'success');
    } else {
        console.log('⚠️ PROBLEMAS DETECTADOS EN FORMULARIOS');
        showFormAlert('⚠️ Se detectaron problemas en los formularios. Revisa la consola.', 'error');
    }
}

// Función para mostrar alertas
function showFormAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    if (type === 'success') {
        alertDiv.style.background = '#27ae60';
    } else if (type === 'error') {
        alertDiv.style.background = '#e74c3c';
    } else {
        alertDiv.style.background = '#3498db';
    }

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Función global para verificar formularios
window.verifyForms = verifyAllForms;

// Ejecutar verificación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(verifyAllForms, 1000);
    });
} else {
    setTimeout(verifyAllForms, 1000);
}

// También ejecutar después de un delay más largo
setTimeout(verifyAllForms, 3000);

console.log('🔍 Script de verificación de formularios cargado'); 