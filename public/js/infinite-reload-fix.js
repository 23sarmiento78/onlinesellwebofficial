// Script específico para diagnosticar y solucionar recarga infinita
console.log('🚨 DIAGNÓSTICO DE RECARGA INFINITA');

// Contador de recargas
let reloadCount = 0;
const maxReloads = 5;

// Verificar si hay demasiadas recargas
function checkInfiniteReload() {
    reloadCount++;
    console.log(`🔄 Recarga #${reloadCount} detectada`);
    
    if (reloadCount > maxReloads) {
        console.error('🚨 ¡RECARGA INFINITA DETECTADA!');
        alert('🚨 ¡RECARGA INFINITA DETECTADA!\n\nSe ha detectado un bucle de recargas. Se aplicará solución de emergencia.');
        applyEmergencyFix();
        return true;
    }
    
    // Guardar contador en sessionStorage
    sessionStorage.setItem('reloadCount', reloadCount.toString());
    return false;
}

// Aplicar solución de emergencia
function applyEmergencyFix() {
    console.log('🛠️ Aplicando solución de emergencia...');
    
    // 1. Detener todos los intervalos
    const highestIntervalId = window.setInterval(() => {}, 999999);
    for (let i = 1; i <= highestIntervalId; i++) {
        window.clearInterval(i);
    }
    
    // 2. Detener todos los timeouts
    const highestTimeoutId = window.setTimeout(() => {}, 999999);
    for (let i = 1; i <= highestTimeoutId; i++) {
        window.clearTimeout(i);
    }
    
    // 3. Limpiar localStorage problemático
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('admin_user');
    
    // 4. Limpiar sessionStorage
    sessionStorage.clear();
    
    // 5. Deshabilitar funciones problemáticas
    if (window.simpleAuth) {
        window.simpleAuth.showAdminPanel = function() {
            console.log('🛡️ showAdminPanel bloqueada por emergencia');
        };
        window.simpleAuth.startAutoRefresh = function() {
            console.log('🛡️ startAutoRefresh bloqueada por emergencia');
        };
        window.simpleAuth.init = function() {
            console.log('🛡️ init bloqueada por emergencia');
        };
    }
    
    // 6. Mostrar mensaje de emergencia
    document.body.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: Arial, sans-serif;
            color: white;
        ">
            <div style="
                background: rgba(0,0,0,0.8);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <h1 style="color: #ff6b6b; margin-bottom: 20px;">🚨 EMERGENCIA</h1>
                <h2>Recarga Infinita Detectada</h2>
                <p style="margin: 20px 0; line-height: 1.6;">
                    Se ha detectado un bucle de recargas en el panel de administración. 
                    Se han aplicado medidas de emergencia para detener el problema.
                </p>
                <div style="margin: 30px 0;">
                    <button onclick="window.location.href='/admin/'" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        margin: 10px;
                    ">
                        🔄 Reiniciar Panel
                    </button>
                    <button onclick="window.location.href='/'" style="
                        background: #2196F3;
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        margin: 10px;
                    ">
                        🏠 Ir al Inicio
                    </button>
                </div>
                <p style="font-size: 14px; opacity: 0.8;">
                    Si el problema persiste, contacta al administrador del sistema.
                </p>
            </div>
        </div>
    `;
    
    console.log('✅ Solución de emergencia aplicada');
}

// Función para diagnosticar el problema
function diagnoseInfiniteReload() {
    console.log('🔍 Diagnóstico de recarga infinita...');
    
    const diagnosis = {
        timestamp: new Date().toISOString(),
        reloadCount: reloadCount,
        localStorage: {},
        sessionStorage: {},
        intervals: 0,
        timeouts: 0,
        simpleAuth: null,
        adminManager: null,
        adminPanel: null,
        problems: []
    };
    
    // Verificar localStorage
    const authToken = localStorage.getItem('auth_token');
    const adminToken = localStorage.getItem('admin_token');
    const authUser = localStorage.getItem('auth_user');
    const adminUser = localStorage.getItem('admin_user');
    
    diagnosis.localStorage = {
        authToken: !!authToken,
        adminToken: !!adminToken,
        authUser: !!authUser,
        adminUser: !!adminUser,
        inconsistencies: (authToken && !adminToken) || (adminToken && !authToken) || 
                        (authUser && !adminUser) || (adminUser && !authUser)
    };
    
    // Verificar sessionStorage
    diagnosis.sessionStorage = {
        reloadCount: sessionStorage.getItem('reloadCount'),
        hasData: Object.keys(sessionStorage).length > 0
    };
    
    // Verificar objetos globales
    diagnosis.simpleAuth = {
        exists: !!window.simpleAuth,
        hasShowAdminPanel: !!(window.simpleAuth && typeof window.simpleAuth.showAdminPanel === 'function'),
        hasStartAutoRefresh: !!(window.simpleAuth && typeof window.simpleAuth.startAutoRefresh === 'function')
    };
    
    diagnosis.adminManager = {
        exists: !!window.adminManager,
        hasFunctions: !!(window.adminManager && typeof window.adminManager.createArticle === 'function')
    };
    
    diagnosis.adminPanel = {
        exists: !!window.adminPanel,
        hasFunctions: !!(window.adminPanel && typeof window.adminPanel.createArticle === 'function')
    };
    
    // Identificar problemas
    if (diagnosis.localStorage.inconsistencies) {
        diagnosis.problems.push('Inconsistencias en localStorage');
    }
    
    if (reloadCount > 3) {
        diagnosis.problems.push('Demasiadas recargas detectadas');
    }
    
    if (diagnosis.simpleAuth.hasStartAutoRefresh) {
        diagnosis.problems.push('Auto-refresh activo en SimpleAuth');
    }
    
    // Mostrar diagnóstico
    console.log('📊 DIAGNÓSTICO COMPLETO:', diagnosis);
    
    if (diagnosis.problems.length > 0) {
        console.error('❌ PROBLEMAS DETECTADOS:', diagnosis.problems);
        return diagnosis;
    } else {
        console.log('✅ No se detectaron problemas críticos');
        return diagnosis;
    }
}

// Función para limpiar todo de forma segura
function safeCleanup() {
    console.log('🧹 Limpieza segura...');
    
    // Limpiar contadores
    reloadCount = 0;
    sessionStorage.removeItem('reloadCount');
    
    // Limpiar localStorage de forma segura
    const keysToRemove = ['auth_token', 'admin_token', 'auth_user', 'admin_user'];
    keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`🗑️ Removido ${key} del localStorage`);
        }
    });
    
    // Detener intervalos y timeouts
    const highestIntervalId = window.setInterval(() => {}, 999999);
    for (let i = 1; i <= highestIntervalId; i++) {
        window.clearInterval(i);
    }
    
    const highestTimeoutId = window.setTimeout(() => {}, 999999);
    for (let i = 1; i <= highestTimeoutId; i++) {
        window.clearTimeout(i);
    }
    
    console.log('✅ Limpieza segura completada');
}

// Función global para diagnóstico
window.diagnoseInfiniteReload = diagnoseInfiniteReload;
window.safeCleanup = safeCleanup;
window.applyEmergencyFix = applyEmergencyFix;

// Verificar recarga al cargar la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Recuperar contador de sessionStorage
        const storedCount = sessionStorage.getItem('reloadCount');
        if (storedCount) {
            reloadCount = parseInt(storedCount);
        }
        
        if (checkInfiniteReload()) {
            return; // Ya se aplicó solución de emergencia
        }
        
        // Ejecutar diagnóstico
        setTimeout(() => {
            diagnoseInfiniteReload();
        }, 2000);
    });
} else {
    // Recuperar contador de sessionStorage
    const storedCount = sessionStorage.getItem('reloadCount');
    if (storedCount) {
        reloadCount = parseInt(storedCount);
    }
    
    if (checkInfiniteReload()) {
        return; // Ya se aplicó solución de emergencia
    }
    
    // Ejecutar diagnóstico
    setTimeout(() => {
        diagnoseInfiniteReload();
    }, 2000);
}

console.log('🚨 Script de diagnóstico de recarga infinita cargado'); 