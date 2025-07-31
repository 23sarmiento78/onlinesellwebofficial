# Migración a Vercel

Esta guía te ayudará a completar la migración de tu aplicación de Netlify a Vercel.

## Configuración de Variables de Entorno

1. Copia el archivo `.env.local.example` a `.env.local`
2. Completa todas las variables de entorno necesarias en `.env.local`
3. Asegúrate de configurar las mismas variables en la configuración de tu proyecto en Vercel:
   - Ve a la configuración de tu proyecto en Vercel
   - Navega a "Environment Variables"
   - Agrega todas las variables del archivo `.env.local`

## Despliegue en Vercel

1. Instala la CLI de Vercel si aún no lo has hecho:
   ```bash
   npm install -g vercel
   ```

2. Inicia sesión en tu cuenta de Vercel:
   ```bash
   vercel login
   ```

3. Despliega tu proyecto:
   ```bash
   vercel
   ```

4. Sigue las instrucciones en pantalla para completar el despliegue.

## Configuración de Dominio Personalizado (Opcional)

Si deseas usar un dominio personalizado:

1. Ve a la configuración de tu proyecto en Vercel
2. Navega a "Domains"
3. Sigue las instrucciones para agregar y verificar tu dominio personalizado

## Configuración de Redirecciones

Las redirecciones se han configurado en `vercel.json`. Si necesitas agregar más redirecciones, edita este archivo.

## Funciones Serverless

Las funciones de la API se han migrado al directorio `/api`. Cada función debe exportar un manejador que acepte `req` y `res` como parámetros.

## Solución de Problemas Comunes

- **Error de conexión a la base de datos**: Asegúrate de que la variable `MONGODB_URI` esté correctamente configurada.
- **Problemas de CORS**: Las cabeceras CORS ya están configuradas en las funciones de la API. Asegúrate de que los orígenes permitidos sean correctos.
- **Variables de entorno no definidas**: Verifica que todas las variables de entorno necesarias estén configuradas en Vercel.

## Soporte

Si encuentras algún problema, consulta la [documentación de Vercel](https://vercel.com/docs) o crea un issue en el repositorio del proyecto.
