// Script de diagnóstico para Netlify Identity
// Ejecutar en la consola del navegador: 
// 1. Abrir DevTools (F12)
// 2. Ir a la pestaña Console
// 3. Copiar y pegar este script completo

console.log('🔍 === DIAGNÓSTICO DE NETLIFY IDENTITY ===');

// 1. Verificar si el script está cargado
console.log('\n1️⃣ Verificando script de Netlify Identity...');
const scripts = document.querySelectorAll('script[src*="netlify-identity"]');
if (scripts.length > 0) {
    console.log('✅ Script encontrado:', scripts[0].src);
    console.log('Estado del script:', scripts[0].readyState);
} else {
    console.log('❌ No se encontró el script de Netlify Identity');
}

// 2. Verificar si window.netlifyIdentity está disponible
console.log('\n2️⃣ Verificando window.netlifyIdentity...');
if (typeof window.netlifyIdentity !== 'undefined') {
    console.log('✅ window.netlifyIdentity está disponible');
    console.log('Tipo:', typeof window.netlifyIdentity);
    console.log('Métodos disponibles:', Object.keys(window.netlifyIdentity));
    
    // 3. Verificar métodos específicos
    console.log('\n3️⃣ Verificando métodos específicos...');
    const methods = ['open', 'close', 'currentUser', 'on', 'off'];
    methods.forEach(method => {
        if (typeof window.netlifyIdentity[method] === 'function') {
            console.log(`✅ ${method}(): disponible`);
        } else {
            console.log(`❌ ${method}(): NO disponible`);
        }
    });
    
    // 4. Verificar usuario actual
    console.log('\n4️⃣ Verificando usuario actual...');
    try {
        const user = window.netlifyIdentity.currentUser();
        if (user) {
            console.log('✅ Usuario autenticado:', user.email);
            console.log('ID:', user.id);
            console.log('Roles:', user.app_metadata?.roles || 'Sin roles');
        } else {
            console.log('ℹ️ No hay usuario autenticado');
        }
    } catch (error) {
        console.error('❌ Error al obtener usuario:', error);
    }
    
    // 5. Probar apertura del widget
    console.log('\n5️⃣ Probando apertura del widget...');
    try {
        console.log('Intentando abrir widget...');
        window.netlifyIdentity.open();
        console.log('✅ Comando open() ejecutado sin errores');
    } catch (error) {
        console.error('❌ Error al abrir widget:', error);
    }
    
} else {
    console.log('❌ window.netlifyIdentity NO está disponible');
    
    // Intentar cargar el script manualmente
    console.log('\n🔄 Intentando cargar script manualmente...');
    const script = document.createElement('script');
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    script.onload = () => {
        console.log('✅ Script cargado manualmente');
        console.log('window.netlifyIdentity ahora disponible:', !!window.netlifyIdentity);
    };
    script.onerror = () => {
        console.error('❌ Error al cargar script manualmente');
    };
    document.head.appendChild(script);
}

// 6. Verificar configuración del sitio
console.log('\n6️⃣ Verificando configuración del sitio...');
console.log('URL actual:', window.location.href);
console.log('Dominio:', window.location.hostname);
console.log('Protocolo:', window.location.protocol);

// 7. Verificar si hay errores en la consola
console.log('\n7️⃣ Verificando errores...');
const originalError = console.error;
let errorCount = 0;
console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
};

setTimeout(() => {
    console.error = originalError;
    console.log(`Errores detectados en los últimos 5 segundos: ${errorCount}`);
}, 5000);

// 8. Función de prueba manual
window.testNetlifyIdentity = function() {
    console.log('\n🧪 === PRUEBA MANUAL ===');
    
    if (window.netlifyIdentity) {
        console.log('Abriendo widget de login...');
        window.netlifyIdentity.open();
        
        // Configurar listeners temporales
        window.netlifyIdentity.on('login', (user) => {
            console.log('🎉 Login exitoso:', user.email);
        });
        
        window.netlifyIdentity.on('error', (error) => {
            console.error('💥 Error de login:', error);
        });
    } else {
        console.error('Netlify Identity no está disponible');
    }
};

console.log('\n✅ Diagnóstico completado');
console.log('💡 Para probar manualmente, ejecuta: testNetlifyIdentity()'); 