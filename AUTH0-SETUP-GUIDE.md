# Guía de Configuración de Auth0

## Paso 1: Configurar URLs en Auth0 Dashboard

Ve a tu dashboard de Auth0 y configura las siguientes URLs:

### Allowed Callback URLs:
```
https://service.hgaruna.org/admin/
https://service.hgaruna.org/admin.html
```

### Allowed Logout URLs:
```
https://service.hgaruna.org/
https://service.hgaruna.org/admin/
```

### Allowed Web Origins:
```
https://service.hgaruna.org
```

## Paso 2: Configurar Variables de Entorno en Netlify

Ve a tu dashboard de Netlify > Settings > Environment variables y agrega:

```bash
AUTH0_DOMAIN=dev-b0qip4vee7sg3q7e.us.auth0.com
AUTH0_CLIENT_ID=3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab
AUTH0_CLIENT_SECRET=W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS
AUTH0_AUDIENCE=https://service.hgaruna.org/api
NETLIFY_DATABASE_URL=tu-url-de-mongodb
SITE_URL=https://service.hgaruna.org
```

## Paso 3: Crear Usuario de Prueba

En Auth0 Dashboard > User Management > Users > Create User:

- Email: admin@hgaruna.com
- Password: (una contraseña segura)
- Connection: Username-Password-Authentication

## Paso 4: Verificar Configuración

1. Haz deploy de tu proyecto
2. Ve a `https://service.hgaruna.org/admin/`
3. Debería aparecer el login de Auth0
4. Inicia sesión con las credenciales creadas

## Datos de tu Aplicación Auth0:

- **Domain:** dev-b0qip4vee7sg3q7e.us.auth0.com
- **Client ID:** 3X8sfPyJFDFhKetUdmn6gEs6tPH2lCab
- **Client Secret:** W87b_wOoUYCuSV_kM4uoMT5sHouXgSe6jkSQGgGbqOk7YAEi1uEv9_sj37h3DtOS
- **Application Login URI:** https://service.hgaruna.org
- **Allowed Callback URLs:** https://service.hgaruna.org/, https://service.hgaruna.org/index/
- **Allowed Logout URLs:** https://service.hgaruna.org/, https://service.hgaruna.org/index/
- **Allowed Web Origins:** https://service.hgaruna.org

## URLs que necesitas actualizar en Auth0 Dashboard:

**Cambiar de:**
- Allowed Callback URLs: `https://service.hgaruna.org/, https://service.hgaruna.org/index/`
- Allowed Logout URLs: `https://service.hgaruna.org/, https://service.hgaruna.org/index/`

**A:**
- Allowed Callback URLs: `https://service.hgaruna.org/admin/, https://service.hgaruna.org/admin.html`
- Allowed Logout URLs: `https://service.hgaruna.org/, https://service.hgaruna.org/admin/`

## Nota Importante:

**Necesitas cambiar las URLs en Auth0 de `service.hgaruna.org` a tu dominio real de Netlify** (ej: `tu-proyecto.netlify.app`). 