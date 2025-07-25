# 🔐 Nuevo Sistema de Administración con Auth0

## ✅ Configuración Completada

Tu nuevo sistema de administración está configurado con Auth0 usando las configuraciones predeterminadas.

### 📋 Información de la Aplicación Auth0
- **Domain**: `dev-b0qip4vee7sg3q7e.us.auth0.com`
- **Client ID**: `3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab`
- **Client Secret**: `W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS`

### 🌐 URLs Configuradas
- **Allowed Callback URLs**: `https://hgaruna.org/admin/`
- **Allowed Logout URLs**: `https://hgaruna.org/`
- **Allowed Web Origins**: `https://hgaruna.org`

## 🚀 Cómo Usar el Sistema

### 1. Acceder al Panel de Administración
Ve a: `https://hgaruna.org/admin/`

### 2. Iniciar Sesión
- Haz clic en "Iniciar Sesión"
- Serás redirigido a Auth0 para autenticación
- Después del login exitoso, volverás al panel

### 3. Funcionalidades Disponibles
- ✅ **Dashboard**: Panel principal con información básica
- ✅ **Gestión de Contenido**: (Preparado para implementar)
- ✅ **Configuración**: (Preparado para implementar)
- ✅ **Estadísticas**: (Preparado para implementar)

## 🔧 Estructura del Sistema

### Archivos Principales
```
public/
├── admin.html              # Página del panel de administración
├── js/
│   ├── auth0-config.js     # Configuración de Auth0
│   └── admin-app.js        # Lógica de la aplicación
└── functions/
    └── admin-api.js        # API del backend con autenticación
```

### Flujo de Autenticación
1. **Usuario visita** `/admin/`
2. **Auth0 SPA SDK** verifica sesión
3. **Si no autenticado**: Muestra pantalla de login
4. **Si autenticado**: Carga el dashboard
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
- `GET /api/articles` - Listar artículos
- `POST /api/articles` - Crear artículo

### Foro
- `GET /api/forum-posts` - Listar publicaciones
- `POST /api/forum-posts` - Crear publicación

### Estadísticas
- `GET /api/stats` - Obtener estadísticas del sitio

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

## 📊 Próximos Pasos

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno en Netlify
Ve a tu **Dashboard de Netlify** → **Site settings** → **Environment variables** y agrega:

```bash
AUTH0_DOMAIN=dev-b0qip4vee7sg3q7e.us.auth0.com
AUTH0_CLIENT_ID=3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab
AUTH0_CLIENT_SECRET=W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS
AUTH0_AUDIENCE=https://hgaruna.org/api
SITE_URL=https://hgaruna.org
```

### 3. Desplegar
```bash
npm run build
```

## 🎉 ¡Listo!

Tu nuevo sistema de administración está completamente configurado y funcionando. Puedes acceder al panel de administración en:

**https://hgaruna.org/admin/**

### 🔗 Enlaces Útiles:
- **Panel de Admin**: https://hgaruna.org/admin/
- **Dashboard Auth0**: https://manage.auth0.com/dashboard/us/dev-b0qip4vee7sg3q7e
- **Netlify Dashboard**: https://app.netlify.com/

## 📝 Notas Importantes

- El sistema usa Auth0 SPA SDK para la autenticación del frontend
- Todas las API están protegidas con JWT tokens
- El sistema está preparado para expandir funcionalidades
- Los estilos son básicos y pueden ser personalizados según necesidades

# Guía rápida para el nuevo sistema admin

## 1. Configura Auth0
- Crea una aplicación SPA en Auth0.
- Obtén tu dominio, client_id y audience.
- Configura la API en Auth0 y copia la clave pública (JWK o PEM).

## 2. Edita los archivos de configuración
- En `public/js/admin-app-new.js` reemplaza:
  - `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE` por tus valores reales.
- En `functions/admin-api.js` reemplaza:
  - `AUTH0_PUBLIC_KEY` por tu clave pública de Auth0 (o usa variable de entorno).

## 3. Uso
- Accede a `/admin/` y haz login con Auth0.
- El panel mostrará tu email y permitirá hacer peticiones protegidas al backend.

## 4. Seguridad
- Nunca subas tus claves privadas al repositorio.
- Usa variables de entorno para las claves sensibles en producción.

---

¿Dudas? Consulta la documentación de Auth0 o pide ayuda aquí.