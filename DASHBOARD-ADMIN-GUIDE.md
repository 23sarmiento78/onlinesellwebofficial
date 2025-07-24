# 🚀 Guía del Panel de Administración

## 📋 **Descripción General**

El nuevo panel de administración te permite gestionar completamente tu sitio web desde una interfaz intuitiva y segura. Incluye gestión de artículos, publicaciones del foro e integración con LinkedIn.

## 🔐 **Autenticación**

### Configuración de Auth0
El sistema utiliza Auth0 para la autenticación segura. Las credenciales están configuradas en `netlify.toml`:

```toml
AUTH0_DOMAIN = "dev-b0qip4vee7sg3q7e.us.auth0.com"
AUTH0_CLIENT_ID = "3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab"
```

### Acceso al Panel
1. Ve a `/admin/` en tu sitio
2. Haz clic en "Iniciar Sesión"
3. Completa la autenticación con Auth0
4. ¡Listo! Ya tienes acceso al dashboard

## 📊 **Dashboard Principal**

### Estadísticas en Tiempo Real
- **Artículos**: Número total de artículos publicados
- **Publicaciones del Foro**: Número total de publicaciones
- **Vistas Totales**: Contador de visitas (en desarrollo)
- **Posts en LinkedIn**: Publicaciones realizadas en LinkedIn

### Estado de LinkedIn
- **Conectado**: Tu cuenta de LinkedIn está vinculada
- **Desconectado**: Necesitas conectar tu cuenta de LinkedIn

### Acciones Rápidas
- **📝 Nuevo Artículo**: Crear un artículo directamente
- **💬 Nueva Publicación del Foro**: Crear una publicación del foro
- **🔗 Publicar en LinkedIn**: Crear una publicación en LinkedIn

## 📝 **Gestión de Artículos**

### Crear un Nuevo Artículo
1. Haz clic en "📝 Nuevo Artículo" o "📝 Crear Nuevo Artículo"
2. Completa el formulario:
   - **Título**: Título del artículo
   - **Descripción**: Resumen del artículo
   - **Contenido**: Contenido completo (soporta Markdown)
   - **Tags**: Palabras clave separadas por comas
   - **URL de la imagen**: Imagen destacada del artículo
   - **Publicar en LinkedIn**: Opción para publicar automáticamente
3. Haz clic en "Guardar Artículo"

### Editar un Artículo
1. En la lista de artículos, haz clic en "✏️ Editar"
2. Modifica los campos necesarios
3. Haz clic en "Guardar Artículo"

### Eliminar un Artículo
1. En la lista de artículos, haz clic en "🗑️ Eliminar"
2. Confirma la eliminación

## 💬 **Gestión del Foro**

### Crear una Nueva Publicación
1. Haz clic en "💬 Nueva Publicación del Foro" o "💬 Crear Nueva Publicación"
2. Completa el formulario:
   - **Título**: Título de la publicación
   - **Contenido**: Contenido de la publicación
   - **Categoría**: Selecciona una categoría
   - **Publicar en LinkedIn**: Opción para publicar automáticamente
3. Haz clic en "Guardar Publicación"

### Editar una Publicación
1. En la lista de publicaciones, haz clic en "✏️ Editar"
2. Modifica los campos necesarios
3. Haz clic en "Guardar Publicación"

### Eliminar una Publicación
1. En la lista de publicaciones, haz clic en "🗑️ Eliminar"
2. Confirma la eliminación

## 🔗 **Integración con LinkedIn**

### Conectar Cuenta de LinkedIn
1. En el dashboard, haz clic en "Conectar LinkedIn"
2. Sigue el proceso de autorización de LinkedIn
3. Tu cuenta quedará vinculada

### Publicar en LinkedIn
1. **Automáticamente**: Al crear artículos o publicaciones del foro, marca la opción "Publicar automáticamente en LinkedIn"
2. **Manual**: Haz clic en "🔗 Publicar en LinkedIn" y escribe tu contenido

### Configuración de LinkedIn
Para que la integración funcione completamente, necesitas configurar las credenciales de LinkedIn en `netlify.toml`:

```toml
LINKEDIN_CLIENT_ID = "tu-linkedin-client-id"
LINKEDIN_CLIENT_SECRET = "tu-linkedin-client-secret"
```

## 🛠️ **Funciones Técnicas**

### API Endpoints
- `/.netlify/functions/admin-api/stats` - Estadísticas
- `/.netlify/functions/admin-api/articles` - Gestión de artículos
- `/.netlify/functions/admin-api/forum-posts` - Gestión del foro
- `/.netlify/functions/linkedin-api/*` - Integración con LinkedIn

### Almacenamiento de Datos
Los datos se almacenan en archivos JSON en `public/data/`:
- `articles.json` - Artículos del public/blog
- `forum-posts.json` - Publicaciones del foro
- `linkedin-posts.json` - Registro de publicaciones en LinkedIn

### Seguridad
- Autenticación con Auth0
- Tokens JWT para autorización
- Validación de permisos en cada endpoint

## 🚀 **Despliegue**

### Variables de Entorno Requeridas
```bash
AUTH0_DOMAIN=dev-b0qip4vee7sg3q7e.us.auth0.com
AUTH0_CLIENT_ID=3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab
AUTH0_CLIENT_SECRET=tu-auth0-client-secret
JWT_SECRET=tu-jwt-secret-key
LINKEDIN_CLIENT_ID=tu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=tu-linkedin-client-secret
SITE_URL=https://tu-sitio.netlify.app
```

### Comandos de Despliegue
```bash
npm install
npm run build
```

## 🔧 **Solución de Problemas**

### Error de Autenticación
- Verifica que las credenciales de Auth0 estén correctas
- Asegúrate de que el dominio de redirección esté configurado en Auth0

### Error al Crear Contenido
- Verifica que los archivos JSON en `public/data/` tengan permisos de escritura
- Revisa los logs de Netlify Functions

### Problemas con LinkedIn
- Verifica que las credenciales de LinkedIn estén configuradas
- Asegúrate de que la aplicación de LinkedIn tenga los permisos necesarios

## 📈 **Próximas Mejoras**

- [ ] Contador de vistas en tiempo real
- [ ] Editor de contenido rico (WYSIWYG)
- [ ] Gestión de usuarios y roles
- [ ] Análisis de rendimiento
- [ ] Backup automático de datos
- [ ] Integración con más redes sociales

## 📞 **Soporte**

Si tienes problemas o necesitas ayuda:
1. Revisa los logs de la consola del navegador
2. Verifica los logs de Netlify Functions
3. Contacta al equipo de desarrollo

---

**¡Disfruta usando tu nuevo panel de administración! 🎉** 