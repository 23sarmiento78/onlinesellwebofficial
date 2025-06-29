# 🚀 Guía de Despliegue - Sistema Sin PC Encendida

## 📋 Resumen

Este sistema permite crear y gestionar artículos y publicaciones del foro **sin necesidad de tener la PC encendida**. Los datos se almacenan en una base de datos en la nube y el sitio se ejecuta en servidores remotos.

## 🎯 Opciones de Despliegue

### **Opción 1: Netlify + MongoDB Atlas (Recomendada)**

#### **Paso 1: Configurar MongoDB Atlas**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (gratis)
4. Crea un usuario de base de datos
5. Obtén la URL de conexión

#### **Paso 2: Configurar Netlify**
1. Ve a [Netlify](https://netlify.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   ```
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/hgaruna
   ```

#### **Paso 3: Desplegar**
```bash
# Construir el proyecto
npm run build

# Subir a GitHub
git add .
git commit -m "Sistema de admin con API"
git push

# Netlify se desplegará automáticamente
```

### **Opción 2: Vercel + Supabase**

#### **Paso 1: Configurar Supabase**
1. Ve a [Supabase](https://supabase.com)
2. Crea un proyecto
3. Crea las tablas necesarias

#### **Paso 2: Desplegar en Vercel**
1. Ve a [Vercel](https://vercel.com)
2. Conecta tu repositorio
3. Configura las variables de entorno

## 🔧 Configuración Actual

### **Estructura del Sistema**
```
proyect/
├── functions/           # Funciones serverless
│   ├── index-page.js   # API principal
│   └── package.json    # Dependencias
├── public/
│   ├── admin.html      # Panel de administración
│   └── js/
│       └── auth.js     # Sistema de autenticación
├── netlify.toml        # Configuración de Netlify
└── DEPLOYMENT.md       # Este archivo
```

### **API Endpoints**
- `GET /api/articles/list` - Listar artículos
- `POST /api/articles/create` - Crear artículo
- `DELETE /api/articles/delete/:id` - Eliminar artículo
- `GET /api/forum-posts/list` - Listar publicaciones
- `POST /api/forum-posts/create` - Crear publicación
- `DELETE /api/forum-posts/delete/:id` - Eliminar publicación

## 🌐 URLs de Acceso

### **Desarrollo Local**
- Sitio principal: `http://localhost:4322/`
- Panel admin: `http://localhost:4322/admin/`

### **Producción (Netlify)**
- Sitio principal: `https://tu-sitio.netlify.app/`
- Panel admin: `https://tu-sitio.netlify.app/admin/`

## 🔐 Credenciales de Acceso

### **Admin Panel**
- **Email**: `admin@hgaruna.com` o `23sarmiento@gmail.com`
- **Contraseña**: `admin123` o `hgaruna2024`

## 📊 Funcionalidades Disponibles

### **✅ Implementadas**
- ✅ Crear artículos con formulario completo
- ✅ Publicación automática en el foro
- ✅ Gestión de publicaciones del foro
- ✅ Dashboard con estadísticas
- ✅ Sistema de autenticación
- ✅ API serverless
- ✅ Almacenamiento en base de datos
- ✅ Modo offline (fallback a localStorage)

### **🔄 En Desarrollo**
- 🔄 Edición de artículos y publicaciones
- 🔄 Gestión de medios
- 🔄 Gestión de categorías y etiquetas
- 🔄 Configuración avanzada del sitio

## 🛠️ Comandos Útiles

### **Desarrollo Local**
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Instalar dependencias de funciones serverless
cd functions && npm install
```

### **Despliegue**
```bash
# Construir proyecto
npm run build

# Desplegar funciones serverless
netlify deploy --prod --functions
```

## 🔍 Solución de Problemas

### **Error: "Cargando panel de administración..."**
- Verifica que el archivo `auth.js` se esté cargando
- Revisa la consola del navegador para errores
- Asegúrate de que estés en la URL correcta

### **Error de Conexión a la API**
- Verifica que las funciones serverless estén desplegadas
- Revisa las variables de entorno en Netlify
- Comprueba la conexión a MongoDB Atlas

### **Error de Autenticación**
- Verifica las credenciales
- Limpia el localStorage del navegador
- Intenta acceder desde una ventana privada

## 📞 Soporte

Si tienes problemas con el despliegue:

1. **Revisa los logs** en Netlify/Vercel
2. **Verifica la consola** del navegador
3. **Comprueba las variables** de entorno
4. **Contacta soporte** si es necesario

## 🎉 ¡Listo!

Una vez desplegado, podrás:
- ✅ Crear artículos sin PC encendida
- ✅ Gestionar el foro desde cualquier lugar
- ✅ Acceder al admin desde cualquier dispositivo
- ✅ Los datos se guardan permanentemente en la nube

¡Tu sistema estará funcionando 24/7 sin necesidad de mantener la PC encendida! 