# 🔐 Configuración de Auth0 - Sistema Limpio

## ✅ Configuración Completada

Tu aplicación Auth0 ya está configurada con las siguientes credenciales:

### 📋 Información de la Aplicación
- **Domain**: `dev-b0qip4vee7sg3q7e.us.auth0.com`
- **Client ID**: `3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab`
- **Client Secret**: `W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS`

### 🌐 URLs Configuradas
- **Allowed Callback URLs**: `https://service.hgaruna.org/admin/`, `https://service.hgaruna.org/admin.html`
- **Allowed Logout URLs**: `https://service.hgaruna.org/`, `https://service.hgaruna.org/admin/`
- **Allowed Web Origins**: `https://service.hgaruna.org`

## 🔧 Configuración en Netlify

### Variables de Entorno Requeridas

Ve a tu **Dashboard de Netlify** → **Site settings** → **Environment variables** y agrega:

```bash
AUTH0_DOMAIN=dev-b0qip4vee7sg3q7e.us.auth0.com
AUTH0_CLIENT_ID=3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab
AUTH0_CLIENT_SECRET=W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS
AUTH0_AUDIENCE=https://service.hgaruna.org/api
SITE_URL=https://service.hgaruna.org
```

### Pasos para Configurar Variables de Entorno:

1. **Ve a Netlify Dashboard**: https://app.netlify.com/
2. **Selecciona tu sitio**: `service.hgaruna.org`
3. **Ve a Settings**: Pestaña "Site settings"
4. **Environment variables**: Sección "Environment variables"
5. **Agrega cada variable** con los valores exactos de arriba
6. **Guarda los cambios**

## 🚀 Cómo Usar el Sistema

### 1. Acceder al Panel de Administración
Ve a: `https://service.hgaruna.org/admin/`

### 2. Iniciar Sesión
- Usa las credenciales configuradas en Auth0
- El sistema redirigirá automáticamente después del login

### 3. Funcionalidades Disponibles
- ✅ **Dashboard**: Estadísticas generales
- ✅ **Gestión de Artículos**: Crear, editar, eliminar artículos
- ✅ **Gestión del Foro**: Crear, editar, eliminar publicaciones
- ✅ **Configuración**: Ajustes del sistema

## 🔧 Estructura del Sistema

### Archivos Principales
```
public/
├── js/
│   ├── auth0-config.js      # Configuración de Auth0
│   ├── auth0-manager.js     # Sistema de autenticación
│   └── admin-panel.js       # Panel de administración
├── admin.html               # Página del panel
└── functions/
    └── admin-api.js         # API del backend
```

### Flujo de Autenticación
1. **Usuario visita** `/admin/`
2. **Auth0Manager** verifica sesión
3. **Si no autenticado**: Muestra pantalla de login
4. **Si autenticado**: Carga el panel
5. **Todas las llamadas API** usan tokens JWT

## 🛡️ Seguridad

### Validación de Tokens
- ✅ Tokens JWT validados con JWKS
- ✅ Verificación de audience e issuer
- ✅ Tokens expiran automáticamente
- ✅ CORS configurado correctamente

### Headers de Seguridad
```javascript
headers: {
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

## 📝 API Endpoints

### Artículos
- `GET /articles` - Listar artículos
- `POST /articles` - Crear artículo
- `PUT /articles/:id` - Actualizar artículo
- `DELETE /articles/:id` - Eliminar artículo

### Foro
- `GET /forum-posts` - Listar publicaciones
- `POST /forum-posts` - Crear publicación
- `PUT /forum-posts/:id` - Actualizar publicación
- `DELETE /forum-posts/:id` - Eliminar publicación

## 🔍 Troubleshooting

### Error: "Token inválido"
- Verifica que el usuario esté autenticado
- Revisa la configuración de Auth0
- Verifica que el token no haya expirado

### Error: "No autorizado"
- Verifica que el usuario tenga permisos
- Revisa los logs de Auth0
- Verifica la configuración de audience

### Error: "CORS"
- Verifica que las URLs estén configuradas correctamente
- Revisa la configuración de allowed origins

### Error: "Variables de entorno no encontradas"
- Verifica que las variables estén configuradas en Netlify
- Confirma que los nombres sean exactos (mayúsculas/minúsculas)
- Revisa los logs de Netlify Functions

## 📊 Verificación de Configuración

Ejecuta el script de verificación:

```bash
node scripts/verify-auth0-setup.js
```

Este script verificará:
- ✅ Archivos necesarios presentes
- ✅ Dependencias instaladas
- ✅ Configuración en archivos
- ✅ Variables de entorno en netlify.toml

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador
2. Verifica los logs de Netlify Functions
3. Confirma la configuración de Auth0
4. Verifica las variables de entorno en Netlify
5. Contacta al administrador del sistema

## 🎉 ¡Listo!

Tu sistema de autenticación Auth0 está completamente configurado y funcionando. Puedes acceder al panel de administración en:

**https://service.hgaruna.org/admin/**

### 🔗 Enlaces Útiles:
- **Panel de Admin**: https://service.hgaruna.org/admin/
- **Dashboard Auth0**: https://manage.auth0.com/dashboard/us/dev-b0qip4vee7sg3q7e
- **Netlify Dashboard**: https://app.netlify.com/
- **Logs de Netlify**: https://app.netlify.com/sites/[tu-site]/functions 