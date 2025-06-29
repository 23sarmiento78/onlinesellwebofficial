# Configuración de Auth0 para el Panel de Administración

## 📋 Pasos para configurar Auth0

### 1. **Crear cuenta en Auth0**
- Ve a [auth0.com](https://auth0.com)
- Crea una cuenta gratuita
- Crea una nueva aplicación

### 2. **Configurar la aplicación en Auth0**

#### **Configuración básica:**
- **Application Type:** Single Page Application (SPA)
- **Allowed Callback URLs:** `https://service.hgaruna.org/admin/`
- **Allowed Logout URLs:** `https://service.hgaruna.org`
- **Allowed Web Origins:** `https://service.hgaruna.org`

#### **Configuración avanzada:**
- **Token Endpoint Authentication Method:** None
- **Grant Types:** Authorization Code, Implicit, Refresh Token

### 3. **Obtener credenciales**
- **Domain:** `hgaruna.us.auth0.com` (o tu dominio personalizado)
- **Client ID:** Copiar desde la configuración de la aplicación
- **Client Secret:** No necesario para SPA

### 4. **Configurar variables de entorno en Netlify**

Agregar las siguientes variables en la configuración de Netlify:

```bash
AUTH0_DOMAIN=hgaruna.us.auth0.com
AUTH0_CLIENT_ID=tu-client-id-aqui
AUTH0_AUDIENCE=https://service.hgaruna.org/api
NETLIFY_DATABASE_URL=tu-url-de-mongodb
```

### 5. **Actualizar el código**

#### **En `public/js/auth.js`:**
```javascript
const config = {
  domain: 'hgaruna.us.auth0.com', // Tu dominio de Auth0
  clientId: 'tu-client-id-aqui', // Tu Client ID
  redirectUri: window.location.origin + '/admin/',
  audience: 'https://service.hgaruna.org/api',
  scope: 'openid profile email'
};
```

### 6. **Instalar dependencias para la API**

En el directorio `functions/`, instalar las dependencias necesarias:

```bash
npm install jsonwebtoken jwks-rsa
```

### 7. **Crear usuarios en Auth0**

#### **Opción 1: Usuarios de base de datos**
- Ve a "User Management" > "Users"
- Crea un nuevo usuario
- Email: `admin@hgaruna.com`
- Contraseña: (configura una contraseña segura)

#### **Opción 2: Conexión social**
- Configura Google, GitHub, o Microsoft
- Permite login con cuentas sociales

### 8. **Configurar reglas (opcional)**

En Auth0, puedes crear reglas para:
- Asignar roles específicos
- Validar dominios de email
- Agregar metadatos personalizados

## 🔧 Configuración de desarrollo local

### **Variables de entorno locales:**
```bash
# .env.local
AUTH0_DOMAIN=hgaruna.us.auth0.com
AUTH0_CLIENT_ID=tu-client-id-aqui
AUTH0_AUDIENCE=https://service.hgaruna.org/api
NETLIFY_DATABASE_URL=tu-url-de-mongodb
```

### **URLs de desarrollo:**
- **Callback URL:** `http://localhost:3000/admin/`
- **Logout URL:** `http://localhost:3000`

## 🚀 Despliegue

### **1. Commit y push:**
```bash
git add .
git commit -m "Implementar autenticación con Auth0"
git push origin main
```

### **2. Verificar en Netlify:**
- El deploy se ejecutará automáticamente
- Verificar que las variables de entorno estén configuradas
- Probar el login en `/admin/`

## 🔍 Solución de problemas

### **Error: "Auth0 no inicializado"**
- Verificar que el script de Auth0 se cargue correctamente
- Revisar la consola del navegador para errores

### **Error: "Token inválido"**
- Verificar que las variables de entorno estén correctas
- Asegurar que el dominio y client ID coincidan

### **Error: "Callback URL no permitida"**
- Verificar que la URL de callback esté configurada en Auth0
- Asegurar que coincida exactamente con la URL de redirección

## 📞 Soporte

Si tienes problemas con la configuración:
1. Revisar los logs de Netlify
2. Verificar la consola del navegador
3. Comprobar la configuración en Auth0 Dashboard 