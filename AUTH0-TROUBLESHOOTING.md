# 🔐 Guía de Solución de Problemas - Auth0

## ❌ Error 400 (Bad Request) - Solución

### Problema Identificado
El error `GET https://dev-b0qip4vee7sg3q7e.us.auth0.com/authorize?scope=openid+profile+em…256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjIuMi4wIn0%3D 400 (Bad Request)` indica que hay un problema con los parámetros enviados a Auth0.

### ✅ Soluciones Implementadas

#### 1. Configuración Consistente
- **Problema**: Había múltiples configuraciones de `redirect_uri` inconsistentes
- **Solución**: Unificada la configuración en todos los archivos

```javascript
// Configuración corregida
const auth0Config = {
    domain: "dev-b0qip4vee7sg3q7e.us.auth0.com",
    clientId: "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab",
    authorizationParams: {
        redirect_uri: "https://service.hgaruna.org/admin/",
        audience: "https://service.hgaruna.org/api"
    },
    cacheLocation: "localstorage"
};
```

#### 2. Verificación de Configuración en Auth0 Dashboard

**Verifica en tu Auth0 Dashboard:**

1. **Allowed Callback URLs**: Debe incluir exactamente:
   ```
   https://service.hgaruna.org/admin/
   ```

2. **Allowed Logout URLs**: Debe incluir:
   ```
   https://service.hgaruna.org/
   ```

3. **Allowed Web Origins**: Debe incluir:
   ```
   https://service.hgaruna.org
   ```

4. **API Identifier**: Debe ser:
   ```
   https://service.hgaruna.org/api
   ```

### 🔍 Herramientas de Diagnóstico

#### Script de Diagnóstico Automático
Se ha agregado un script de diagnóstico que se ejecuta automáticamente:

```javascript
// Ejecutar en la consola del navegador
window.runAuth0Diagnostics();
```

#### Verificación Manual
1. Abre las **DevTools** del navegador (F12)
2. Ve a la pestaña **Console**
3. Ejecuta: `window.runAuth0Diagnostics()`
4. Revisa los resultados para identificar problemas

### 🚀 Pasos para Solucionar

#### Paso 1: Verificar Configuración de Auth0
1. Ve a [Auth0 Dashboard](https://manage.auth0.com/)
2. Selecciona tu aplicación
3. Ve a **Settings**
4. Verifica que las URLs coincidan exactamente

#### Paso 2: Limpiar Cache
1. Abre las DevTools (F12)
2. Ve a **Application** > **Storage**
3. Limpia **Local Storage** y **Session Storage**
4. Recarga la página

#### Paso 3: Verificar Variables de Entorno
En tu `netlify.toml`, verifica que las variables estén correctas:

```toml
[context.production.environment]
  AUTH0_DOMAIN = "dev-b0qip4vee7sg3q7e.us.auth0.com"
  AUTH0_CLIENT_ID = "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab"
  AUTH0_AUDIENCE = "https://service.hgaruna.org/api"
```

#### Paso 4: Probar Conexión
1. Ve a: `https://service.hgaruna.org/admin/?debug`
2. Abre las DevTools
3. Revisa la consola para ver el diagnóstico automático

### 🐛 Modo Debug

Para activar el modo debug, agrega `?debug` a la URL:
```
https://service.hgaruna.org/admin/?debug
```

Esto ejecutará automáticamente:
- ✅ Verificación de configuración
- ✅ Verificación del SDK
- ✅ Verificación de conectividad
- ✅ Verificación de URLs

### 📋 Checklist de Verificación

- [ ] **Auth0 Dashboard**: URLs configuradas correctamente
- [ ] **Variables de entorno**: Configuradas en Netlify
- [ ] **Configuración local**: Consistente en todos los archivos
- [ ] **Cache limpiado**: Local Storage y Session Storage
- [ ] **Conexión a internet**: Sin problemas de red
- [ ] **URL correcta**: Accediendo desde `https://service.hgaruna.org/admin/`

### 🔧 Comandos Útiles

#### En la Consola del Navegador:
```javascript
// Ejecutar diagnóstico completo
window.runAuth0Diagnostics();

// Generar URL de autorización manual
window.generateAuth0URL();

// Verificar configuración actual
console.log(auth0Config);

// Limpiar cache de Auth0
localStorage.clear();
sessionStorage.clear();
```

### 📞 Contacto para Soporte

Si el problema persiste después de seguir estos pasos:

1. **Ejecuta el diagnóstico**: `window.runAuth0Diagnostics()`
2. **Toma captura de pantalla** de la consola
3. **Verifica la configuración** en Auth0 Dashboard
4. **Comparte los logs** de error

### 🎯 Causas Comunes del Error 400

1. **redirect_uri incorrecto**: La URL no coincide exactamente
2. **client_id inválido**: ID de cliente incorrecto
3. **audience incorrecto**: Identificador de API mal configurado
4. **scope inválido**: Permisos no configurados correctamente
5. **URLs no permitidas**: No están en la lista blanca de Auth0

### ✅ Estado Actual

- [x] Configuración unificada
- [x] Script de diagnóstico agregado
- [x] URLs corregidas
- [x] Variables de entorno verificadas
- [ ] **Pendiente**: Verificación en Auth0 Dashboard

**Próximo paso**: Verificar la configuración en tu Auth0 Dashboard siguiendo los pasos anteriores. 