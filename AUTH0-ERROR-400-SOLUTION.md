# 🔐 Solución Específica para Error 400 de Auth0

## ❌ Problema: Error 400 (Bad Request)

```
GET https://dev-b0qip4vee7sg3q7e.us.auth0.com/authorize?scope=openid+profile+em…256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjIuMi4wIn0%3D 400 (Bad Request)
```

## 🎯 Causas Más Comunes

### 1. **redirect_uri Mismatch** (Más común)
- La URL de redirección no coincide exactamente con la configurada en Auth0
- Diferencias en trailing slashes (`/` vs sin `/`)
- Diferencias en protocolo (`http` vs `https`)
- Diferencias en puerto o subdominio

### 2. **client_id Inválido**
- El Client ID no existe o está mal configurado
- El Client ID no corresponde a la aplicación correcta

### 3. **audience Incorrecto**
- El audience no está configurado en Auth0
- El audience no coincide con el API Identifier

### 4. **scope Inválido**
- Los scopes solicitados no están habilitados
- Combinación incorrecta de scopes

## 🚀 Solución Paso a Paso

### Paso 1: Verificar Configuración en Auth0 Dashboard

1. **Ve a [Auth0 Dashboard](https://manage.auth0.com/)**
2. **Selecciona tu aplicación** (`3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab`)
3. **Ve a Settings**
4. **Verifica estas configuraciones:**

#### ✅ Allowed Callback URLs
```
https://service.hgaruna.org/admin/
```

#### ✅ Allowed Logout URLs
```
https://service.hgaruna.org/
```

#### ✅ Allowed Web Origins
```
https://service.hgaruna.org
```

#### ✅ Application Type
```
Single Page Application
```

### Paso 2: Verificar API Configuration

1. **Ve a APIs en Auth0 Dashboard**
2. **Verifica que existe una API con:**
   - **Identifier**: `https://service.hgaruna.org/api`
   - **Name**: `Service API` (o similar)

### Paso 3: Usar Herramientas de Diagnóstico

#### Opción A: Página de Prueba
Ve a: `https://service.hgaruna.org/auth0-test.html`

#### Opción B: Modo Debug
Ve a: `https://service.hgaruna.org/admin/?debug`

#### Opción C: Consola del Navegador
1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Ejecuta: `window.testAuth0Config()`

### Paso 4: Verificar Variables de Entorno

En tu `netlify.toml`, verifica:

```toml
[context.production.environment]
  AUTH0_DOMAIN = "dev-b0qip4vee7sg3q7e.us.auth0.com"
  AUTH0_CLIENT_ID = "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab"
  AUTH0_AUDIENCE = "https://service.hgaruna.org/api"
```

### Paso 5: Limpiar Cache y Cookies

1. **Abre DevTools (F12)**
2. **Ve a Application > Storage**
3. **Limpia:**
   - Local Storage
   - Session Storage
   - Cookies
4. **Recarga la página**

## 🔧 Herramientas de Diagnóstico

### Scripts Disponibles

```javascript
// Diagnóstico completo
window.testAuth0Config();

// Prueba de autorización manual
window.testAuth0Manual();

// Información de debug
window.generateDebugInfo();

// Generar URL de autorización
window.generateAuth0URL();
```

### Verificación Manual de URL

1. **Genera la URL manualmente:**
```javascript
const params = new URLSearchParams({
    response_type: 'code',
    client_id: '3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab',
    redirect_uri: 'https://service.hgaruna.org/admin/',
    scope: 'openid profile email',
    audience: 'https://service.hgaruna.org/api',
    state: 'test-state'
});

const authUrl = `https://dev-b0qip4vee7sg3q7e.us.auth0.com/authorize?${params.toString()}`;
console.log(authUrl);
```

2. **Copia la URL y pégala en el navegador**
3. **Verifica si obtienes el mismo error 400**

## 📋 Checklist de Verificación

- [ ] **Auth0 Dashboard**: URLs configuradas correctamente
- [ ] **API Configuration**: Audience configurado
- [ ] **Application Type**: Single Page Application
- [ ] **Variables de entorno**: Configuradas en Netlify
- [ ] **Cache limpiado**: Local Storage y Session Storage
- [ ] **HTTPS**: Accediendo desde HTTPS
- [ ] **Dominio correcto**: `service.hgaruna.org`
- [ ] **Ruta correcta**: `/admin/`

## 🐛 Debug Avanzado

### Verificar Logs de Auth0

1. **Ve a Auth0 Dashboard > Logs**
2. **Busca logs relacionados con tu Client ID**
3. **Verifica errores específicos**

### Verificar Network Requests

1. **Abre DevTools > Network**
2. **Intenta hacer login**
3. **Busca la request a `/authorize`**
4. **Verifica los parámetros enviados**

### Verificar OpenID Configuration

```javascript
fetch('https://dev-b0qip4vee7sg3q7e.us.auth0.com/.well-known/openid_configuration')
  .then(response => response.json())
  .then(config => console.log(config));
```

## 🚨 Casos Especiales

### Si el error persiste después de verificar todo:

1. **Verifica que no haya espacios en las URLs**
2. **Verifica que las URLs estén correctamente codificadas**
3. **Verifica que no haya caracteres especiales**
4. **Verifica que el Client ID sea exactamente el correcto**
5. **Verifica que el Domain sea exactamente el correcto**

### Si estás en desarrollo local:

1. **Agrega `http://localhost:3000/admin/` a Allowed Callback URLs**
2. **Agrega `http://localhost:3000` a Allowed Web Origins**

## 📞 Contacto para Soporte

Si el problema persiste:

1. **Ejecuta el diagnóstico completo**
2. **Toma captura de pantalla de la consola**
3. **Comparte los logs de Auth0**
4. **Verifica la configuración paso a paso**

## ✅ Estado de la Solución

- [x] Configuración unificada en código
- [x] Herramientas de diagnóstico creadas
- [x] Página de prueba disponible
- [x] Scripts de verificación implementados
- [ ] **Pendiente**: Verificación en Auth0 Dashboard
- [ ] **Pendiente**: Prueba en producción

**Próximo paso**: Verificar la configuración en tu Auth0 Dashboard siguiendo el Paso 1. 