// Script de debugging para verificar el estado del panel de administración
window.debugAdmin = function() {
  console.log('🔍 Debugging del Panel de Administración');
  console.log('=====================================');
  
  // Verificar AdminPanel
  console.log('1. AdminPanel class:', typeof window.AdminPanel);
  console.log('2. adminPanel instance:', window.adminPanel);
  console.log('3. adminPanel methods:', window.adminPanel ? Object.getOwnPropertyNames(Object.getPrototypeOf(window.adminPanel)) : 'No disponible');
  
  // Verificar adminManager
  console.log('4. adminManager:', window.adminManager);
  console.log('5. adminManager methods:', window.adminManager ? Object.keys(window.adminManager) : 'No disponible');
  
  // Verificar tokens
  console.log('6. auth_token:', localStorage.getItem('auth_token') ? 'Presente' : 'Ausente');
  console.log('7. admin_token:', localStorage.getItem('admin_token') ? 'Presente' : 'Ausente');
  
  // Verificar elementos del DOM
  console.log('8. Elementos del panel:', {
    'article-modal': !!document.getElementById('article-modal'),
    'forum-modal': !!document.getElementById('forum-modal'),
    'new-article-btn': !!document.getElementById('new-article-btn'),
    'new-forum-post-btn': !!document.getElementById('new-forum-post-btn')
  });
  
  // Probar funciones
  if (window.adminPanel) {
    console.log('9. Probando showArticleModal...');
    try {
      window.adminPanel.showArticleModal();
      console.log('✅ showArticleModal funciona');
    } catch (error) {
      console.error('❌ Error en showArticleModal:', error);
    }
  }
  
  if (window.adminManager) {
    console.log('10. Probando adminManager.showCreateArticleForm...');
    try {
      window.adminManager.showCreateArticleForm();
      console.log('✅ adminManager.showCreateArticleForm funciona');
    } catch (error) {
      console.error('❌ Error en adminManager.showCreateArticleForm:', error);
    }
  }
  
  console.log('=====================================');
  console.log('🔍 Debugging completado');
};

// Ejecutar automáticamente después de un breve delay
setTimeout(() => {
  if (typeof window.debugAdmin === 'function') {
    window.debugAdmin();
  }
}, 1000);

// Función de diagnóstico para el panel de administración
window.diagnoseAdminPanel = function() {
    console.log('🔍 Iniciando diagnóstico completo del panel de administración...');
    
    let diagnosis = {
        timestamp: new Date().toISOString(),
        adminPanel: null,
        adminManager: null,
        simpleAuth: null,
        linkedInIntegration: null,
        functions: {},
        errors: [],
        recommendations: []
    };
    
    // 1. Verificar adminPanel
    if (window.adminPanel) {
        diagnosis.adminPanel = {
            exists: true,
            type: typeof window.adminPanel,
            constructor: window.adminPanel.constructor.name,
            methods: Object.getOwnPropertyNames(Object.getPrototypeOf(window.adminPanel))
        };
        console.log('✅ adminPanel encontrado:', diagnosis.adminPanel);
    } else {
        diagnosis.adminPanel = { exists: false };
        diagnosis.errors.push('adminPanel no encontrado');
        diagnosis.recommendations.push('Recargar la página con Ctrl+F5');
        console.error('❌ adminPanel no encontrado');
    }
    
    // 2. Verificar adminManager
    if (window.adminManager) {
        diagnosis.adminManager = {
            exists: true,
            type: typeof window.adminManager,
            methods: Object.keys(window.adminManager).filter(key => typeof window.adminManager[key] === 'function')
        };
        console.log('✅ adminManager encontrado:', diagnosis.adminManager);
    } else {
        diagnosis.adminManager = { exists: false };
        diagnosis.errors.push('adminManager no encontrado');
        diagnosis.recommendations.push('Recargar la página con Ctrl+F5');
        console.error('❌ adminManager no encontrado');
    }
    
    // 3. Verificar simpleAuth
    if (window.simpleAuth) {
        diagnosis.simpleAuth = {
            exists: true,
            type: typeof window.simpleAuth,
            constructor: window.simpleAuth.constructor.name
        };
        console.log('✅ simpleAuth encontrado:', diagnosis.simpleAuth);
    } else {
        diagnosis.simpleAuth = { exists: false };
        diagnosis.errors.push('simpleAuth no encontrado');
        console.warn('⚠️ simpleAuth no encontrado');
    }
    
    // 4. Verificar LinkedInIntegration
    if (window.linkedInIntegration) {
        diagnosis.linkedInIntegration = {
            exists: true,
            type: typeof window.linkedInIntegration,
            constructor: window.linkedInIntegration.constructor.name
        };
        console.log('✅ linkedInIntegration encontrado:', diagnosis.linkedInIntegration);
    } else {
        diagnosis.linkedInIntegration = { exists: false };
        console.warn('⚠️ linkedInIntegration no encontrado');
    }
    
    // 5. Probar funciones específicas
    const testFunctions = [
        'showCreateArticleForm',
        'createArticle',
        'listArticles',
        'showCreateForumPostForm',
        'createForumPost',
        'listForumPosts',
        'login',
        'logout',
        'isAuthenticated'
    ];
    
    testFunctions.forEach(funcName => {
        if (window.adminManager && typeof window.adminManager[funcName] === 'function') {
            diagnosis.functions[funcName] = '✅ Disponible';
            console.log(`✅ Función ${funcName} disponible`);
        } else {
            diagnosis.functions[funcName] = '❌ No disponible';
            diagnosis.errors.push(`Función ${funcName} no disponible`);
            console.error(`❌ Función ${funcName} no disponible`);
        }
    });
    
    // 6. Probar funciones de adminPanel
    if (window.adminPanel) {
        const adminPanelFunctions = [
            'createArticle',
            'updateArticle',
            'deleteArticle',
            'listArticles',
            'createForumPost',
            'updateForumPost',
            'deleteForumPost',
            'listForumPosts',
            'login',
            'logout',
            'isAuthenticated'
        ];
        
        adminPanelFunctions.forEach(funcName => {
            if (typeof window.adminPanel[funcName] === 'function') {
                console.log(`✅ adminPanel.${funcName} disponible`);
            } else {
                console.error(`❌ adminPanel.${funcName} no disponible`);
                diagnosis.errors.push(`adminPanel.${funcName} no disponible`);
            }
        });
    }
    
    // 7. Verificar localStorage
    const authToken = localStorage.getItem('adminAuthToken');
    if (authToken) {
        console.log('✅ Token de autenticación encontrado en localStorage');
    } else {
        console.warn('⚠️ No hay token de autenticación en localStorage');
    }
    
    // 8. Mostrar resumen
    console.log('📊 RESUMEN DEL DIAGNÓSTICO:');
    console.log('========================');
    console.log(`✅ adminPanel: ${diagnosis.adminPanel.exists ? 'Disponible' : 'No disponible'}`);
    console.log(`✅ adminManager: ${diagnosis.adminManager.exists ? 'Disponible' : 'No disponible'}`);
    console.log(`✅ simpleAuth: ${diagnosis.simpleAuth.exists ? 'Disponible' : 'No disponible'}`);
    console.log(`✅ linkedInIntegration: ${diagnosis.linkedInIntegration.exists ? 'Disponible' : 'No disponible'}`);
    console.log(`✅ Funciones disponibles: ${Object.values(diagnosis.functions).filter(f => f === '✅ Disponible').length}/${testFunctions.length}`);
    
    if (diagnosis.errors.length > 0) {
        console.log('❌ Errores encontrados:', diagnosis.errors);
        console.log('💡 Recomendaciones:', diagnosis.recommendations);
    }
    
    // 9. Mostrar alerta con resumen
    const successCount = Object.values(diagnosis.functions).filter(f => f === '✅ Disponible').length;
    const totalFunctions = testFunctions.length;
    
    let message = `🔍 DIAGNÓSTICO COMPLETADO\n\n`;
    message += `✅ adminPanel: ${diagnosis.adminPanel.exists ? 'OK' : 'ERROR'}\n`;
    message += `✅ adminManager: ${diagnosis.adminManager.exists ? 'OK' : 'ERROR'}\n`;
    message += `✅ Funciones: ${successCount}/${totalFunctions} disponibles\n\n`;
    
    if (diagnosis.errors.length > 0) {
        message += `❌ PROBLEMAS DETECTADOS:\n`;
        diagnosis.errors.slice(0, 3).forEach(error => {
            message += `• ${error}\n`;
        });
        if (diagnosis.errors.length > 3) {
            message += `• ... y ${diagnosis.errors.length - 3} más\n`;
        }
        message += `\n💡 SOLUCIÓN: Recarga la página con Ctrl+F5`;
    } else {
        message += `🎉 TODO FUNCIONANDO CORRECTAMENTE`;
    }
    
    alert(message);
    
    // 10. Guardar diagnóstico en localStorage para referencia
    localStorage.setItem('adminDiagnosis', JSON.stringify(diagnosis));
    
    return diagnosis;
};

// Función para limpiar todo y reiniciar
window.resetAdminPanel = function() {
    console.log('🔄 Reiniciando panel de administración...');
    
    // Limpiar localStorage
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminDiagnosis');
    
    // Limpiar variables globales
    delete window.adminPanel;
    delete window.adminManager;
    delete window.simpleAuth;
    delete window.linkedInIntegration;
    
    console.log('✅ Panel reiniciado. Recarga la página para continuar.');
    alert('🔄 Panel reiniciado. Recarga la página para continuar.');
};

console.log('🔧 Script de diagnóstico cargado'); 