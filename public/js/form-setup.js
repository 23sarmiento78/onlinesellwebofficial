// Script para configurar y verificar todos los formularios del panel de administración
console.log('🔧 Configurando formularios del panel de administración...');

// Función para configurar formularios
function setupForms() {
    console.log('📝 Configurando formularios...');
    
    // 1. Configurar formulario de artículos
    setupArticleForm();
    
    // 2. Configurar formulario de publicaciones de foro
    setupForumForm();
    
    // 3. Configurar botones de apertura de formularios
    setupFormButtons();
    
    // 4. Configurar validaciones
    setupValidations();
    
    console.log('✅ Formularios configurados correctamente');
}

// Configurar formulario de artículos
function setupArticleForm() {
    const articleForm = document.getElementById('article-form');
    const articleModal = document.getElementById('article-modal');
    const closeArticleBtn = document.getElementById('close-article-modal');
    const cancelArticleBtn = document.getElementById('cancel-article');
    
    if (!articleForm) {
        console.error('❌ Formulario de artículos no encontrado');
        return;
    }
    
    console.log('✅ Configurando formulario de artículos...');
    
    // Event listener para envío del formulario
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📝 Enviando formulario de artículo...');
        
        const formData = {
            title: document.getElementById('article-title').value.trim(),
            description: document.getElementById('article-description').value.trim(),
            content: document.getElementById('article-content').value.trim(),
            category: document.getElementById('article-category').value,
            image: document.getElementById('article-image').value.trim(),
            tags: document.getElementById('article-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            date: new Date().toISOString(),
            author: 'hgaruna'
        };
        
        // Validar campos requeridos
        if (!formData.title || !formData.description || !formData.content || !formData.category) {
            showFormAlert('Por favor, completa todos los campos requeridos', 'error');
            return;
        }
        
        try {
            // Usar adminManager si está disponible, sino usar adminPanel directamente
            if (window.adminManager && typeof window.adminManager.createArticle === 'function') {
                await window.adminManager.createArticle(formData);
            } else if (window.adminPanel && typeof window.adminPanel.createArticle === 'function') {
                await window.adminPanel.createArticle(formData);
            } else {
                throw new Error('No se encontró función para crear artículos');
            }
            
            showFormAlert('Artículo creado exitosamente', 'success');
            hideArticleModal();
            
            // Recargar lista de artículos
            if (window.adminManager && typeof window.adminManager.listArticles === 'function') {
                await window.adminManager.listArticles();
            } else if (window.adminPanel && typeof window.adminPanel.listArticles === 'function') {
                await window.adminPanel.listArticles();
            }
            
        } catch (error) {
            console.error('❌ Error al crear artículo:', error);
            showFormAlert('Error al crear artículo: ' + error.message, 'error');
        }
    });
    
    // Event listeners para cerrar modal
    if (closeArticleBtn) {
        closeArticleBtn.addEventListener('click', hideArticleModal);
    }
    
    if (cancelArticleBtn) {
        cancelArticleBtn.addEventListener('click', hideArticleModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (articleModal) {
        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) {
                hideArticleModal();
            }
        });
    }
}

// Configurar formulario de publicaciones de foro
function setupForumForm() {
    const forumForm = document.getElementById('forum-form');
    const forumModal = document.getElementById('forum-modal');
    const closeForumBtn = document.getElementById('close-forum-modal');
    const cancelForumBtn = document.getElementById('cancel-forum');
    
    if (!forumForm) {
        console.error('❌ Formulario de foro no encontrado');
        return;
    }
    
    console.log('✅ Configurando formulario de foro...');
    
    // Event listener para envío del formulario
    forumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('💬 Enviando formulario de publicación de foro...');
        
        const formData = {
            title: document.getElementById('forum-title').value.trim(),
            content: document.getElementById('forum-content').value.trim(),
            category: document.getElementById('forum-category').value,
            date: new Date().toISOString(),
            author: 'hgaruna'
        };
        
        // Validar campos requeridos
        if (!formData.title || !formData.content || !formData.category) {
            showFormAlert('Por favor, completa todos los campos requeridos', 'error');
            return;
        }
        
        try {
            // Usar adminManager si está disponible, sino usar adminPanel directamente
            if (window.adminManager && typeof window.adminManager.createForumPost === 'function') {
                await window.adminManager.createForumPost(formData);
            } else if (window.adminPanel && typeof window.adminPanel.createForumPost === 'function') {
                await window.adminPanel.createForumPost(formData);
            } else {
                throw new Error('No se encontró función para crear publicaciones de foro');
            }
            
            showFormAlert('Publicación creada exitosamente', 'success');
            hideForumModal();
            
            // Recargar lista de publicaciones
            if (window.adminManager && typeof window.adminManager.listForumPosts === 'function') {
                await window.adminManager.listForumPosts();
            } else if (window.adminPanel && typeof window.adminPanel.listForumPosts === 'function') {
                await window.adminPanel.listForumPosts();
            }
            
        } catch (error) {
            console.error('❌ Error al crear publicación de foro:', error);
            showFormAlert('Error al crear publicación: ' + error.message, 'error');
        }
    });
    
    // Event listeners para cerrar modal
    if (closeForumBtn) {
        closeForumBtn.addEventListener('click', hideForumModal);
    }
    
    if (cancelForumBtn) {
        cancelForumBtn.addEventListener('click', hideForumModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (forumModal) {
        forumModal.addEventListener('click', (e) => {
            if (e.target === forumModal) {
                hideForumModal();
            }
        });
    }
}

// Configurar botones de apertura de formularios
function setupFormButtons() {
    console.log('🔘 Configurando botones de formularios...');
    
    // Botón para nuevo artículo
    const newArticleBtn = document.getElementById('new-article-btn');
    if (newArticleBtn) {
        newArticleBtn.addEventListener('click', () => {
            console.log('📝 Abriendo formulario de nuevo artículo...');
            showArticleModal();
        });
    } else {
        console.warn('⚠️ Botón de nuevo artículo no encontrado');
    }
    
    // Botón para nueva publicación de foro
    const newForumBtn = document.getElementById('new-forum-post-btn');
    if (newForumBtn) {
        newForumBtn.addEventListener('click', () => {
            console.log('💬 Abriendo formulario de nueva publicación...');
            showForumModal();
        });
    } else {
        console.warn('⚠️ Botón de nueva publicación no encontrado');
    }
}

// Configurar validaciones
function setupValidations() {
    console.log('✅ Configurando validaciones...');
    
    // Validación en tiempo real para campos requeridos
    const requiredFields = [
        'article-title', 'article-description', 'article-content', 'article-category',
        'forum-title', 'forum-content', 'forum-category'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => {
                validateField(field);
            });
            
            field.addEventListener('input', () => {
                clearFieldError(field);
            });
        }
    });
}

// Funciones auxiliares
function showArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) {
        modal.classList.remove('d-none');
        document.getElementById('article-modal-title').textContent = 'Nuevo Artículo';
        document.getElementById('article-form').reset();
        console.log('✅ Modal de artículo abierto');
    } else {
        console.error('❌ Modal de artículo no encontrado');
    }
}

function hideArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) {
        modal.classList.add('d-none');
        console.log('✅ Modal de artículo cerrado');
    }
}

function showForumModal() {
    const modal = document.getElementById('forum-modal');
    if (modal) {
        modal.classList.remove('d-none');
        document.getElementById('forum-modal-title').textContent = 'Nueva Publicación';
        document.getElementById('forum-form').reset();
        console.log('✅ Modal de foro abierto');
    } else {
        console.error('❌ Modal de foro no encontrado');
    }
}

function hideForumModal() {
    const modal = document.getElementById('forum-modal');
    if (modal) {
        modal.classList.add('d-none');
        console.log('✅ Modal de foro cerrado');
    }
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
        return false;
    } else {
        field.classList.remove('error');
        field.style.borderColor = '';
        return true;
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
}

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
    }, 3000);
}

// Función para verificar que todos los elementos estén presentes
function verifyFormElements() {
    console.log('🔍 Verificando elementos de formularios...');
    
    const requiredElements = [
        'article-form', 'article-modal', 'article-title', 'article-description', 
        'article-content', 'article-category', 'article-image', 'article-tags',
        'forum-form', 'forum-modal', 'forum-title', 'forum-content', 'forum-category',
        'new-article-btn', 'new-forum-post-btn'
    ];
    
    const missingElements = [];
    
    requiredElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (!element) {
            missingElements.push(elementId);
            console.error(`❌ Elemento ${elementId} no encontrado`);
        } else {
            console.log(`✅ Elemento ${elementId} encontrado`);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos faltantes:', missingElements);
        return false;
    } else {
        console.log('✅ Todos los elementos de formularios están presentes');
        return true;
    }
}

// Ejecutar configuración cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM cargado, configurando formularios...');
        if (verifyFormElements()) {
            setupForms();
        } else {
            console.error('❌ No se pueden configurar formularios - elementos faltantes');
        }
    });
} else {
    console.log('🚀 DOM ya cargado, configurando formularios...');
    if (verifyFormElements()) {
        setupForms();
    } else {
        console.error('❌ No se pueden configurar formularios - elementos faltantes');
    }
}

// También ejecutar después de un delay para asegurar que otros scripts se hayan cargado
setTimeout(() => {
    console.log('🔄 Verificación tardía de formularios...');
    if (verifyFormElements()) {
        setupForms();
    }
}, 2000);

console.log('🔧 Script de configuración de formularios cargado'); 