# Guía de Solución de Problemas de Despliegue

## Problemas Identificados y Solucionados

### 1. **Paths Absolutos vs Relativos**
- **Problema**: Los archivos CSS y recursos estaban usando paths absolutos (`/css/base.css`) que fallan cuando el sitio no está en el root del dominio.
- **Solución**: Cambiamos a usar `%PUBLIC_URL%` en HTML y `process.env.PUBLIC_URL` en JSX.

### 2. **Múltiples Archivos CSS Externos**
- **Problema**: Demasiadas dependencias de archivos CSS en `public/css/` que pueden fallar al cargar.
- **Solución**: Consolidamos los estilos críticos en `src/index.css` para que se incluyan en el bundle.

### 3. **Configuración de Vercel**
- **Problema**: La configuración en `vercel.json` puede estar causando problemas de routing.
- **Solución**: La configuración actual debería funcionar, pero verifica que el `distDir` sea correcto.

## Cambios Realizados

### Archivos Modificados:

1. **`public/index.html`**:
   - Cambié paths absolutos a `%PUBLIC_URL%/logos-he-imagenes/logo3.png`
   - Simplifiqué las referencias CSS para reducir dependencias externas

2. **`src/index.css`**:
   - Agregué estilos críticos del hero, botones, y navegación
   - Reorganicé imports para que las variables se carguen primero

3. **`src/components/NavBar.jsx`**:
   - Cambié paths de imágenes a usar `process.env.PUBLIC_URL`

4. **`src/components/Hero.jsx`**:
   - Cambié path del video a usar `process.env.PUBLIC_URL`

## Pasos para Resolver en tu Entorno

### Para Tu PC Local:

1. **Instala dependencias** (si no lo has hecho):
   ```bash
   npm install
   ```

2. **Verifica que tienes todos los archivos**:
   - `public/logos-he-imagenes/logo3.png`
   - `public/5377684-uhd_3840_2160_25fps.mp4`
   - Carpeta `public/css/` con todos los archivos CSS

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   npm start
   ```

4. **Si ves errores**, revisa la consola del navegador (F12) para identificar archivos faltantes.

### Para Vercel:

1. **Verifica tu `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "build"
         }
       }
     ],
     "routes": [
       {
         "src": "/static/(.*)",
         "dest": "/static/$1"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

2. **Configura el `homepage` en `package.json`** si tu sitio no está en el root:
   ```json
   {
     "homepage": "https://tudominio.com/",
     ...
   }
   ```

3. **Construye y despliega**:
   ```bash
   npm run build
   vercel --prod
   ```

## Archivos Críticos a Verificar

### En `public/`:
- ✅ `logos-he-imagenes/logo3.png`
- ✅ `5377684-uhd_3840_2160_25fps.mp4`
- ✅ `css/` (carpeta completa)
- ✅ `index.html` (con paths corregidos)

### En `src/`:
- ✅ `index.css` (con estilos consolidados)
- ✅ `components/NavBar.jsx` (con paths corregidos)
- ✅ `components/Hero.jsx` (con paths corregidos)

## Comandos para Verificar

```bash
# Verificar que el build funciona
npm run build

# Servir localmente el build de producción
npx serve -s build -p 3001

# Ver el sitio en http://localhost:3001
```

## Errores Comunes y Soluciones

### Error: "Failed to load resource"
- **Causa**: Archivos faltantes en `public/`
- **Solución**: Verifica que todos los archivos existan en las rutas correctas

### Error: "Blank white page"
- **Causa**: JavaScript errors o CSS no cargado
- **Solución**: Abre DevTools (F12) y revisa la consola para errores específicos

### Error: "CSS not loading"
- **Causa**: Paths incorrectos o archivos faltantes
- **Solución**: Los estilos críticos ahora están en `src/index.css`, pero verifica que `public/css/` existe

## Verificación Final

1. **Local Development**: `npm start` debe mostrar el sitio correctamente
2. **Production Build**: `npm run build` debe completarse sin errores
3. **Local Production**: `npx serve -s build` debe mostrar el sitio igual que development

Si el sitio funciona localmente con `npx serve -s build`, entonces funcionará en Vercel.
