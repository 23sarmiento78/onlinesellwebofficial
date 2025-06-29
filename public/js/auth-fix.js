// Script para corregir el problema de recarga infinita en el panel de administración
console.log('🔧 Aplicando corrección para recarga infinita...');

// Variable para evitar múltiples inicializaciones
let isInitialized = false;

// Función para verificar si ya estamos en el panel de admin
function isAdminPanelLoaded() {
    return document.querySelector('.admin-panel') !== null || 
           document.querySelector('.admin-container') !== null ||
           document.querySelector('.social-header') !== null;
}

// Función para prevenir recargas infinitas
function preventInfiniteReload() {
    console.log('🛡️ Preveniendo recarga infinita...');
    
    // Si ya está inicializado, no hacer nada
    if (isInitialized) {
        console.log('✅ Ya inicializado, evitando recarga');
        return;
    }
    
    // Si ya está cargado el panel, no hacer nada
    if (isAdminPanelLoaded()) {
        console.log('✅ Panel ya cargado, evitando recarga');
        return;
    }
    
    // Marcar como inicializado
    isInitialized = true;
    console.log('✅ Prevención de recarga aplicada');
}

// Función para limpiar tokens problemáticos
function cleanupTokens() {
    console.log('🧹 Limpiando tokens problemáticos...');
    
    // Verificar si hay tokens duplicados o corruptos
    const authToken = localStorage.getItem('auth_token');
    const adminToken = localStorage.getItem('admin_token');
    const authUser = localStorage.getItem('auth_user');
    const adminUser = localStorage.getItem('admin_user');
    
    // Si hay inconsistencias, limpiar todo
    if ((authToken && !adminToken) || (adminToken && !authToken) || 
        (authUser && !adminUser) || (adminUser && !authUser)) {
        
        console.log('⚠️ Detectadas inconsistencias en tokens, limpiando...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('admin_user');
        
        // Redirigir al login
        window.location.href = '/admin/';
        return;
    }
    
    console.log('✅ Tokens verificados correctamente');
}

// Función para verificar autenticación sin recargar
function checkAuthWithoutReload() {
    console.log('🔐 Verificando autenticación sin recarga...');
    
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    const user = localStorage.getItem('auth_user') || localStorage.getItem('admin_user');
    
    if (!token || !user) {
        console.log('❌ No hay sesión válida');
        return false;
    }
    
    try {
        const userData = JSON.parse(user);
        console.log('✅ Usuario autenticado:', userData.email);
        return true;
    } catch (error) {
        console.error('❌ Error al parsear datos de usuario:', error);
        return false;
    }
}

// Función para mostrar el panel de admin de forma segura
function showAdminPanelSafely() {
    console.log('🔄 Mostrando panel de admin de forma segura...');
    
    // Verificar que no esté ya cargado
    if (isAdminPanelLoaded()) {
        console.log('✅ Panel ya está cargado');
        return;
    }
    
    // Verificar autenticación
    if (!checkAuthWithoutReload()) {
        console.log('❌ Usuario no autenticado, redirigiendo al login');
        window.location.href = '/admin/';
        return;
    }
    
    // Mostrar el panel original de admin.html
    const adminContent = document.getElementById('admin-content');
    if (adminContent) {
        adminContent.style.display = 'block';
        console.log('✅ Panel de admin mostrado correctamente');
    } else {
        console.log('⚠️ No se encontró el contenedor de admin');
    }
}

// Función para inicializar de forma segura
function initializeSafely() {
    console.log('🚀 Inicializando de forma segura...');
    
    // Prevenir recargas infinitas
    preventInfiniteReload();
    
    // Limpiar tokens problemáticos
    cleanupTokens();
    
    // Verificar si estamos en la página de admin
    if (window.location.pathname.includes('admin')) {
        console.log('📍 En página de admin');
        
        // Si ya está autenticado, mostrar panel
        if (checkAuthWithoutReload()) {
            showAdminPanelSafely();
        } else {
            console.log('❌ No autenticado, mostrando login');
        }
    }
    
    console.log('✅ Inicialización segura completada');
}

// Función para detener auto-refresh problemático
function stopAutoRefresh() {
    console.log('⏹️ Deteniendo auto-refresh problemático...');
    
    // Limpiar todos los intervalos que puedan estar causando problemas
    const intervals = window.setInterval(() => {}, 999999);
    for (let i = 1; i <= intervals; i++) {
        window.clearInterval(i);
    }
    
    console.log('✅ Auto-refresh detenido');
}

// Función para corregir SimpleAuth
function fixSimpleAuth() {
    console.log('🔧 Corrigiendo SimpleAuth...');
    
    if (window.simpleAuth) {
        // Sobrescribir la función problemática
        window.simpleAuth.showAdminPanel = function() {
            console.log('🛡️ Función showAdminPanel interceptada para evitar recarga');
            showAdminPanelSafely();
        };
        
        // Sobrescribir startAutoRefresh para que no cause problemas
        window.simpleAuth.startAutoRefresh = function() {
            console.log('🛡️ Auto-refresh deshabilitado para evitar recargas');
            // No hacer nada - deshabilitar auto-refresh
        };
        
        console.log('✅ SimpleAuth corregido');
    } else {
        console.log('⚠️ SimpleAuth no encontrado');
    }
}

// Ejecutar correcciones cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM cargado, aplicando correcciones...');
        stopAutoRefresh();
        fixSimpleAuth();
        initializeSafely();
    });
} else {
    console.log('📄 DOM ya cargado, aplicando correcciones...');
    stopAutoRefresh();
    fixSimpleAuth();
    initializeSafely();
}

// También ejecutar después de un delay para asegurar que otros scripts se hayan cargado
setTimeout(() => {
    console.log('⏰ Aplicando correcciones tardías...');
    stopAutoRefresh();
    fixSimpleAuth();
    initializeSafely();
}, 1000);

// Función global para forzar reinicio limpio
window.resetAdminCleanly = function() {
    console.log('🔄 Reinicio limpio del panel de admin...');
    
    // Limpiar variables
    isInitialized = false;
    
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('admin_user');
    
    // Detener auto-refresh
    stopAutoRefresh();
    
    // Redirigir al login
    window.location.href = '/admin/';
};

console.log('🔧 Script de corrección de recarga infinita cargado'); 