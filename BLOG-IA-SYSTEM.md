# 🤖 Sistema de Blog IA - hgaruna

## 📋 Resumen del Sistema

El nuevo sistema de blog IA reemplaza completamente el sistema anterior de foro y proporciona:

1. **Generación automática de artículos** usando Gemini 2.5 Flash
2. **Archivos HTML estáticos** generados automáticamente
3. **Blog React moderno** con búsqueda y filtros
4. **SEO optimizado** con metadatos completos
5. **GitHub Actions automatizado** para generación diaria

## 🚀 Características Implementadas

### ✅ Generación Automática de Contenido
- **Frecuencia**: 4 artículos diarios (13:00, 15:00, 17:00, 19:00 ART)
- **IA**: Gemini 2.5 Flash con 50+ categorías de programación
- **Formato**: Markdown con frontmatter completo
- **Ubicación**: `src/content/articulos/`

### ✅ Archivos HTML Estáticos
- **Generación**: Automática desde archivos markdown
- **Template**: HTML completo con Bootstrap 5
- **SEO**: Metadatos, Open Graph, Schema.org
- **Ubicación**: `public/blog/`

### ✅ Blog React Moderno
- **Página principal**: `/blog` - Lista de artículos
- **Página individual**: `/blog/[slug]` - Artículo completo
- **Búsqueda**: En tiempo real por título, contenido y tags
- **Filtros**: Por categoría
- **Responsive**: Diseño adaptativo

### ✅ GitHub Actions Optimizado
- **Workflow único**: `generate-articles-and-sitemap.yml`
- **Proceso**: Markdown → HTML → Sitemap → Commit
- **Automatización**: Completamente automático

## 🛠️ Estructura de Archivos

```
src/
├── content/
│   └── articulos/           # Archivos markdown generados por IA
│       ├── 2025-01-22-articulo-1.md
│       ├── 2025-01-22-articulo-2.md
│       └── ...
├── pages/
│   ├── BlogIA.jsx          # Página principal del blog
│   └── BlogArticle.jsx     # Página individual de artículo
├── BlogIA.css              # Estilos específicos del blog
└── ...

public/
├── blog/                   # Archivos HTML estáticos
│   ├── index.html          # Index del blog
│   ├── articulo-1.html     # Artículo individual
│   ├── articulo-2.html
│   └── ...
└── ...

functions/
├── get-ia-articles.js      # API para obtener todos los artículos
└── get-ia-article.js       # API para obtener artículo específico

scripts/
├── generate_articles_gemini.js    # Genera artículos markdown
└── generate-html-articles.js      # Genera archivos HTML

.github/workflows/
└── generate-articles-and-sitemap.yml  # GitHub Action principal
```

## 📝 Flujo de Trabajo

### 1. Generación Automática (GitHub Actions)
```yaml
# Se ejecuta 4 veces al día
- Genera 4 artículos markdown con Gemini IA
- Convierte markdown a HTML estático
- Actualiza sitemap.xml
- Hace commit y push automático
```

### 2. Estructura de Artículo Markdown
```markdown
---
title: "Título del Artículo"
summary: "Resumen del artículo"
date: "2025-01-22T10:00:00.000Z"
author: "hgaruna"
image: "/logos-he-imagenes/programacion.jpeg"
tags: ["programación", "desarrollo web", "javascript"]
category: "Desarrollo Web"
slug: "titulo-del-articulo"
seo_title: "Título SEO optimizado"
seo_description: "Descripción para buscadores"
seo_keywords: ["palabra clave 1", "palabra clave 2"]
---

# Contenido del artículo en Markdown

## Subtítulo

Contenido del artículo...
```

### 3. Archivo HTML Generado
- **Template completo** con Bootstrap 5
- **Navegación** integrada
- **SEO optimizado** con metadatos
- **Botones de compartir** en redes sociales
- **Responsive design**

## 🎨 Interfaz de Usuario

### Página Principal (`/blog`)
- **Header**: Título y descripción del blog
- **Buscador**: Búsqueda en tiempo real
- **Filtros**: Por categoría
- **Grid de artículos**: Cards con hover effects
- **Contador**: Número total de artículos
- **Footer informativo**: Sobre la generación por IA

### Página de Artículo (`/blog/[slug]`)
- **Breadcrumb**: Navegación
- **Header**: Título, fecha, autor, imagen
- **Contenido**: Markdown renderizado
- **Tags**: Etiquetas del artículo
- **Botones de compartir**: Twitter, LinkedIn, Facebook, WhatsApp
- **Meta información**: Autor, fecha de publicación

## 🔧 Configuración

### Variables de Entorno Requeridas
```env
GEMINI_API_KEY=tu_api_key_de_gemini
```

### Dependencias Instaladas
```json
{
  "marked": "^9.1.6",
  "react-markdown": "^9.0.1",
  "gray-matter": "^4.0.3"
}
```

### Scripts Disponibles
```bash
# Generar solo archivos HTML
npm run generate-html-articles

# Build completo con artículos
npm run build-with-articles
```

## 📊 API Endpoints

### GET `/.netlify/functions/get-ia-articles`
Obtiene todos los artículos del blog.

**Respuesta:**
```json
{
  "articles": [
    {
      "title": "Título del artículo",
      "summary": "Resumen...",
      "slug": "titulo-del-articulo",
      "date": "2025-01-22T10:00:00.000Z",
      "author": "hgaruna",
      "image": "/logos-he-imagenes/programacion.jpeg",
      "tags": ["programación", "web"],
      "category": "Desarrollo Web"
    }
  ],
  "total": 4,
  "source": "markdown-files"
}
```

### GET `/.netlify/functions/get-ia-article?slug=articulo-slug`
Obtiene un artículo específico por slug.

**Respuesta:**
```json
{
  "article": {
    "title": "Título del artículo",
    "content": "Contenido markdown...",
    "slug": "articulo-slug",
    "date": "2025-01-22T10:00:00.000Z",
    "author": "hgaruna",
    "image": "/logos-he-imagenes/programacion.jpeg",
    "tags": ["programación", "web"],
    "category": "Desarrollo Web"
  },
  "source": "markdown-file"
}
```

## 🎯 Categorías de Artículos

El sistema genera artículos sobre:
- **Frameworks JavaScript** (React, Vue, Angular)
- **Backend moderno** (Node.js, Python, Go, Rust)
- **DevOps y CI/CD**
- **Cloud computing** (AWS, Azure, GCP)
- **Inteligencia artificial** y machine learning
- **Desarrollo mobile** y PWAs
- **Bases de datos** (SQL vs NoSQL)
- **Arquitecturas** (Microservicios, Serverless)
- **Testing** y calidad de código
- **Productividad** y herramientas
- **Carreras** y soft skills
- **Tendencias** y mejores prácticas

## 🔍 SEO y Metadatos

### Metadatos Automáticos
- **Title**: `[Título] | Blog IA - hgaruna`
- **Description**: Resumen del artículo
- **Keywords**: Tags del artículo
- **Open Graph**: Para redes sociales
- **Twitter Cards**: Para Twitter
- **Schema.org**: Para motores de búsqueda

### URLs Amigables
- **Formato**: `/blog/[slug]`
- **Ejemplo**: `/blog/nuevos-frameworks-javascript-2025`
- **Generación**: Automática desde el título

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 992px
- **Tablet**: 768px - 991px
- **Mobile**: < 767px

### Características
- Grid adaptativo de artículos
- Imágenes responsivas
- Navegación móvil optimizada
- Botones táctiles

## 🚀 Despliegue

### Netlify
1. El sistema se despliega automáticamente
2. Los archivos HTML están en `public/blog/`
3. Las rutas React están en `/blog` y `/blog/[slug]`
4. El sitemap se actualiza automáticamente

### URLs Disponibles
- **Blog principal**: `https://service.hgaruna.org/blog`
- **Artículos HTML**: `https://service.hgaruna.org/blog/[slug].html`
- **Artículos React**: `https://service.hgaruna.org/blog/[slug]`

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Artículos no aparecen
- Verificar que los archivos estén en `src/content/articulos/`
- Ejecutar `npm run generate-html-articles`
- Revisar la consola del navegador

#### 2. Error en GitHub Actions
- Verificar `GEMINI_API_KEY` en secrets
- Revisar logs del workflow
- Asegurar que las dependencias estén instaladas

#### 3. Archivos HTML no se generan
- Verificar que `marked` esté instalado
- Revisar que los archivos markdown tengan frontmatter válido
- Ejecutar el script manualmente para debug

### Logs Útiles
```bash
# Ver artículos procesados
npm run generate-html-articles

# Verificar archivos generados
ls -la public/blog/

# Debug de funciones Netlify
netlify functions:invoke get-ia-articles
```

## 📈 Próximas Mejoras

### Funcionalidades Planificadas
- [ ] Comentarios en artículos
- [ ] Sistema de likes/favoritos
- [ ] Newsletter integrado
- [ ] Analytics de artículos
- [ ] Categorías más específicas
- [ ] Búsqueda avanzada con filtros

### Optimizaciones
- [ ] Lazy loading de imágenes
- [ ] Cache de búsqueda
- [ ] PWA para offline
- [ ] AMP pages para móviles
- [ ] CDN para archivos estáticos

## 📞 Soporte

Para dudas o problemas:
- **WhatsApp**: +54 3541 237972
- **Email**: 23sarmiento@gmail.com
- **Sitio**: https://service.hgaruna.org

---

**Desarrollado por hgaruna - Desarrollo Web Villa Carlos Paz** 🚀 