# 🚀 Configuración del Panel de Administración - hgaruna

## 📋 Requisitos Previos

Para que el panel de administración funcione correctamente, necesitas configurar las siguientes variables de entorno en Netlify:

## 🔧 Variables de Entorno Requeridas

### 1. **MongoDB Atlas**
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hgaruna?retryWrites=true&w=majority
```

### 2. **Token de Administración**
```
ADMIN_TOKEN=tu_token_secreto_aqui
```

### 3. **Variables de LinkedIn (Opcionales)**
```
LINKEDIN_CLIENT_ID=tu_client_id
LINKEDIN_CLIENT_SECRET=tu_client_secret
LINKEDIN_ACCESS_TOKEN=tu_access_token
```

## 🛠️ Configuración en Netlify

### Paso 1: Acceder a las Variables de Entorno
1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio web
3. Ve a **Site settings** → **Environment variables**

### Paso 2: Agregar Variables

#### **MONGODB_URI**
- **Key**: `MONGODB_URI`
- **Value**: Tu URI de conexión de MongoDB Atlas
- **Scopes**: All scopes
- **Values**: Same value for all deploy contexts

#### **ADMIN_TOKEN**
- **Key**: `ADMIN_TOKEN`
- **Value**: Un token secreto para autenticación (ej: `hgaruna-admin-2025-secret`)
- **Scopes**: All scopes
- **Values**: Same value for all deploy contexts

### Paso 3: Configurar MongoDB Atlas

1. **Crear una cuenta en MongoDB Atlas** (si no tienes una)
2. **Crear un cluster gratuito**
3. **Configurar acceso de red** (0.0.0.0/0 para permitir acceso desde Netlify)
4. **Crear un usuario de base de datos**
5. **Obtener la URI de conexión**

## 🔐 Configuración de Autenticación

### Sistema de Autenticación Simple
El panel usa un sistema de autenticación simple basado en tokens. Para acceder:

1. **Iniciar sesión** en el sitio principal
2. **Ir a** `/admin` o `/admin.html`
3. **Usar el token configurado** en `ADMIN_TOKEN`

### Crear un Token Seguro
```bash
# Generar un token seguro
openssl rand -base64 32
```

## 📊 Funcionalidades del Panel

### ✅ **Dashboard**
- Resumen de artículos y publicaciones
- Estadísticas generales

### ✅ **Gestión de Artículos**
- Crear nuevos artículos
- Editar artículos existentes
- Eliminar artículos
- Categorización y tags

### ✅ **Gestión del Foro**
- Crear nuevas publicaciones
- Editar publicaciones existentes
- Eliminar publicaciones
- Categorización

### ✅ **Configuración**
- Configuración del sistema (en desarrollo)

## 🚀 Despliegue

### 1. **Commit y Push**
```bash
git add .
git commit -m "Agregar panel de administración"
git push origin main
```

### 2. **Verificar en Netlify**
- El deploy se ejecutará automáticamente
- Verificar que las funciones se desplieguen correctamente
- Revisar los logs por errores

### 3. **Probar el Panel**
- Ir a `https://tu-dominio.netlify.app/admin`
- Verificar que la autenticación funcione
- Probar crear/editar/eliminar contenido

## 🔍 Solución de Problemas

### Error: "Token de autenticación requerido"
- Verificar que `ADMIN_TOKEN` esté configurado en Netlify
- Verificar que el token coincida en el código

### Error: "Error conectando a MongoDB"
- Verificar que `MONGODB_URI` esté correcto
- Verificar que el cluster esté activo
- Verificar que el usuario tenga permisos

### Error: "Ruta no encontrada"
- Verificar que las funciones de Netlify se hayan desplegado
- Verificar la configuración en `netlify.toml`

## 📝 Estructura de Datos

### Artículos
```json
{
  "id": "timestamp",
  "title": "Título del artículo",
  "description": "Descripción breve",
  "content": "Contenido completo en markdown",
  "category": "Desarrollo Web",
  "image": "/ruta/a/imagen.jpg",
  "tags": ["web", "desarrollo"],
  "date": "2025-01-22T10:00:00.000Z",
  "author": "hgaruna",
  "status": "published"
}
```

### Publicaciones del Foro
```json
{
  "id": "timestamp",
  "title": "Título de la publicación",
  "content": "Contenido de la publicación",
  "category": "General",
  "date": "2025-01-22T10:00:00.000Z",
  "author": "hgaruna",
  "status": "published",
  "likes": 0,
  "replies": []
}
```

## 🔒 Seguridad

### Recomendaciones
1. **Usar tokens seguros** y únicos
2. **Limitar acceso** a IPs específicas si es posible
3. **Monitorear logs** de acceso
4. **Actualizar tokens** regularmente
5. **Usar HTTPS** siempre

### Variables Sensibles
- `MONGODB_URI` contiene credenciales de base de datos
- `ADMIN_TOKEN` es la clave de acceso al panel
- Nunca committear estas variables al repositorio

## 📞 Soporte

Si tienes problemas con la configuración:

1. **Revisar logs** en Netlify
2. **Verificar variables** de entorno
3. **Probar conexión** a MongoDB
4. **Contactar soporte** si es necesario

---

**¡El panel de administración está listo para usar! 🎉** 