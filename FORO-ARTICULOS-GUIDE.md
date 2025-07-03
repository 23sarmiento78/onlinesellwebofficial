# 🚀 Guía del Sistema de Foro y Artículos - hgaruna

## 📋 Resumen del Sistema

El sistema implementado incluye:

1. **Feed de Artículos Estilo Facebook** - En `/foro`
2. **Buscador Global** - Filtra artículos en tiempo real
3. **Páginas Estáticas de Artículos** - Generadas desde Netlify CMS
4. **SEO Optimizado** - Cada artículo tiene metadatos completos

## 🎯 Características Implementadas

### ✅ Feed de Artículos (Estilo Facebook)
- **Ubicación**: `/foro`
- **Características**:
  - Scroll vertical infinito
  - Cards con avatar, autor y fecha
  - Imágenes destacadas
  - Etiquetas (tags)
  - Botón "Ver artículo completo"
  - Animaciones suaves
  - Responsive design

### ✅ Buscador Global
- **Funcionalidad**:
  - Búsqueda en tiempo real
  - Filtra por título, descripción, contenido, autor y tags
  - Contador de resultados
  - Botón para limpiar búsqueda
  - Diseño moderno con iconos

### ✅ Páginas Estáticas de Artículos
- **Generación**: Desde Netlify CMS
- **Ubicación**: `/articulos/[slug]`
- **SEO**: Metadatos completos, Schema.org, Open Graph
- **Navegación**: Breadcrumbs y botones de compartir

## 🛠️ Configuración del CMS

### Netlify CMS Config
```yaml
# public/admin/config.yml
collections:
  - name: "articulos"
    label: "Artículos"
    folder: "src/content/articulos"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Título", name: "title", widget: "string" }
      - { label: "Fecha", name: "date", widget: "datetime" }
      - { label: "Autor", name: "author", widget: "string" }
      - { label: "Contenido", name: "body", widget: "markdown" }
      - { label: "Imagen", name: "image", widget: "image", required: false }
      - { label: "Etiquetas", name: "tags", widget: "list", required: false }
```

### Estructura de Archivos
```
src/
├── content/
│   └── articulos/
│       ├── mi-primer-articulo.md
│       ├── desarrollo-web-villa-carlos-paz.md
│       └── ...
public/
├── articulos/          # Páginas estáticas generadas
│   ├── mi-primer-articulo.html
│   ├── desarrollo-web-villa-carlos-paz.html
│   └── ...
└── admin/
    └── index.html      # Panel de Netlify CMS
```

## 📝 Cómo Crear Artículos

### 1. Desde el Panel de Administración
1. Ve a `/admin` en tu sitio
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "Artículos" → "New Article"
4. Completa los campos:
   - **Título**: Título del artículo
   - **Fecha**: Fecha de publicación
   - **Autor**: Tu nombre o "hgaruna"
   - **Contenido**: Contenido en Markdown
   - **Imagen**: Imagen destacada (opcional)
   - **Etiquetas**: Tags separados por comas

### 2. Estructura del Artículo Markdown
```markdown
---
title: "Mi Primer Artículo sobre Desarrollo Web"
date: 2024-01-15T10:00:00.000Z
author: "hgaruna"
image: "/uploads/mi-imagen.jpg"
tags: ["desarrollo web", "villa carlos paz", "react"]
---

# Mi Primer Artículo

Este es el contenido de mi artículo en **Markdown**.

## Subtítulo

- Punto 1
- Punto 2
- Punto 3

[Enlace a mi sitio](https://service.hgaruna.org)
```

## 🔧 Generación de Páginas Estáticas

### Script de Generación
```bash
# Generar solo las páginas de artículos
npm run generate-articles

# Generar artículos + build completo
npm run build-with-articles
```

### Proceso Automático
1. Lee archivos `.md` de `src/content/articulos/`
2. Procesa frontmatter y contenido
3. Genera HTML estático con template
4. Guarda en `public/articulos/[slug].html`

## 🎨 Personalización

### Estilos CSS
- **Feed**: `public/css/foro.css`
- **Artículos**: Incluidos en el template HTML
- **Responsive**: Bootstrap 5 + CSS personalizado

### Template de Artículos
- **Ubicación**: `templates/article-template.html`
- **Variables disponibles**:
  - `{{title}}` - Título del artículo
  - `{{description}}` - Descripción SEO
  - `{{content}}` - Contenido HTML
  - `{{author}}` - Autor
  - `{{date}}` - Fecha
  - `{{image}}` - Imagen destacada
  - `{{tags}}` - Etiquetas

## 🔍 SEO y Metadatos

### Metadatos Automáticos
- **Title**: `[Título] | Desarrollo Web Villa Carlos Paz | hgaruna`
- **Description**: Primera línea del contenido o descripción personalizada
- **Keywords**: Tags + palabras clave base
- **Open Graph**: Para redes sociales
- **Twitter Cards**: Para Twitter
- **Schema.org**: Para motores de búsqueda

### URLs Amigables
- **Formato**: `/articulos/[slug]`
- **Ejemplo**: `/articulos/desarrollo-web-villa-carlos-paz`
- **Generación**: Automática desde el título

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 992px
- **Tablet**: 768px - 991px
- **Mobile**: < 767px

### Características
- Feed adaptativo
- Imágenes responsivas
- Navegación móvil
- Botones táctiles

## 🚀 Despliegue

### Netlify
1. Conecta tu repositorio a Netlify
2. Configura el build command: `npm run build-with-articles`
3. El CMS estará disponible en `/admin`

### Variables de Entorno
```env
# Netlify CMS
REACT_APP_NETLIFY_CMS_BACKEND=git-gateway
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Artículos no aparecen en el feed
- Verifica que los archivos estén en `src/content/articulos/`
- Ejecuta `npm run generate-articles`
- Revisa la consola del navegador

#### 2. Error en el CMS
- Verifica la configuración en `public/admin/config.yml`
- Asegúrate de tener permisos en el repositorio
- Revisa los logs de Netlify

#### 3. Páginas estáticas no se generan
- Instala `gray-matter`: `npm install gray-matter`
- Verifica que los archivos `.md` tengan frontmatter válido
- Revisa la estructura de carpetas

### Logs Útiles
```bash
# Ver artículos procesados
npm run generate-articles

# Build completo con logs
npm run build-with-articles
```

## 📈 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Comentarios en artículos
- [ ] Sistema de likes/favoritos
- [ ] Categorías de artículos
- [ ] Búsqueda avanzada con filtros
- [ ] Newsletter integrado
- [ ] Analytics de artículos

### Optimizaciones
- [ ] Lazy loading de imágenes
- [ ] Cache de búsqueda
- [ ] PWA para offline
- [ ] AMP pages para móviles

## 📞 Soporte

Para dudas o problemas:
- **WhatsApp**: +54 3541 237972
- **Email**: 23sarmiento@gmail.com
- **Sitio**: https://service.hgaruna.org

---

**Desarrollado por hgaruna - Desarrollo Web Villa Carlos Paz** 🚀 