# hgaruna - Plataforma de Desarrollo y Programación

Una plataforma moderna para aprendizaje de programación y desarrollo web, con artículos, eBooks, recursos y herramientas para desarrolladores.

## 🚀 Características

- **📰 Artículos Dinámicos**: Carga automática desde `/public/blog`
- **📚 Sistema de eBooks**: Generación automática con IA (Gemini API)
- **🛠️ Herramientas de Desarrollo**: Generador de código, paletas de colores, Lorem Ipsum, JSON formatter
- **🎨 Diseño Moderno**: Responsive, dark mode, animaciones 3D
- **💰 Monetización**: Integración optimizada con Google AdSense
- **🔄 Contenido Automatizado**: GitHub Actions para generación de contenido

## 🛠️ Tecnologías

- **Frontend**: React 18, Vite, CSS3, Font Awesome
- **Backend**: Node.js, Express.js (para scripts)
- **IA**: Google Gemini API
- **Deployment**: Netlify
- **Monetización**: Google AdSense
- **Automatización**: GitHub Actions

## 📁 Estructura del Proyecto

```
├── public/
│   ├── blog/                 # Artículos HTML generados automáticamente
│   ├── ebooks/               # eBooks generados con IA
│   └── logos-he-imagenes/    # Recursos multimedia
├── src/
│   ├── components/           # Componentes React reutilizables
│   │   ├── AdSenseAd.jsx    # Componentes de AdSense
│   │   ├── Newsletter.jsx   # Sistema de newsletter
│   │   └── DeveloperTools.jsx # Herramientas funcionales
│   ├── pages/               # Páginas principales
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utilidades y helpers
├── scripts/                 # Scripts de automatización
├── .github/workflows/       # GitHub Actions
└── templates/              # Plantillas para generación de contenido
```

## 🎯 Páginas Principales

1. **Inicio** (`/`) - Homepage con artículos destacados, eBook del mes, estadísticas
2. **Artículos** (`/articulos`) - Listado dinámico con filtros por categoría
3. **eBook** (`/ebook`) - Página de venta con libro 3D y preview gratuito
4. **Recursos** (`/recursos`) - Herramientas funcionales para desarrolladores
5. **Contacto** (`/contacto`) - Formulario y múltiples métodos de contacto

## 💰 Google AdSense

### Configuración

El sitio está optimizado para Google AdSense con:

- **Client ID**: `ca-pub-7772175009790237`
- **Script de AdSense**: Incluido en `public/index.html`
- **Componentes**: `AdSenseAd.jsx` con diferentes formatos
- **Error Handling**: `AdSenseErrorBoundary.jsx` para manejar errores

### Solución de Problemas AdSense

Si experimentas **TagError** de AdSense:

1. **Verificar Script**: Asegúrate de que el script esté en `<head>`
2. **Slots Válidos**: No uses slots de ejemplo (`1234567890`)
3. **HTTPS**: AdSense requiere HTTPS en producción
4. **Error Boundary**: Implementado para capturar errores silenciosamente

### Herramientas de Debug

```javascript
import { generateAdSenseHealthReport } from './src/utils/adSenseUtils';

// Generar reporte de salud
const report = generateAdSenseHealthReport();
console.log(report);
```

## 🤖 Automatización con IA

### GitHub Actions

El sitio incluye dos workflows principales:

1. **Generación de Artículos** (`.github/workflows/generate-articles-and-sitemap.yml`)
   - Se ejecuta 3 veces al día
   - Genera contenido educativo con Gemini AI
   - Optimizado para AdSense y SEO

2. **Generación de eBooks** (`.github/workflows/generate-ebook.yml`)
   - Genera eBooks completos semanalmente
   - Crea versiones gratuitas y premium
   - Exporta a PDF automáticamente

### Scripts Principales

- `scripts/generate-educational-articles-adsense.js` - Generación de artículos
- `scripts/generate-ebook.js` - Generación de eBooks
- `scripts/optimize-blog-articles-adsense.js` - Optimización AdSense

## 🔧 Desarrollo

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/hgaruna.git
cd hgaruna

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### Variables de Entorno

```bash
# .env
GEMINI_API_KEY=tu_api_key_de_gemini
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run optimize     # Optimizar artículos para AdSense
```

## 📊 Características Técnicas

### AdSense Integration

- **Error Boundary**: Captura y maneja errores de AdSense
- **Lazy Loading**: Los anuncios se cargan cuando es necesario
- **Responsive**: Todos los formatos se adaptan al dispositivo
- **Compliance**: Contenido optimizado para políticas de AdSense

### Performance

- **Vite Build**: Build ultra-rápido
- **Code Splitting**: Carga optimizada de componentes
- **Lazy Loading**: Imágenes y componentes bajo demanda
- **CSS Optimizado**: Variables CSS y animaciones eficientes

### SEO

- **Meta Tags**: Optimización completa de metadatos
- **Schema.org**: Markup estructurado para artículos
- **Sitemap**: Generación automática con GitHub Actions
- **URLs Canónicas**: Para evitar contenido duplicado

## 🎨 Herramientas Incluidas

### Generador de Código
- Componentes React
- Hooks personalizados
- Rutas Express.js
- Estilos CSS

### Generador de Paletas
- Paletas complementarias
- Paletas triádicas
- Paletas análogas
- Paletas monocromáticas

### Lorem Ipsum
- Palabras, oraciones o párrafos
- Cantidad personalizable
- Opción "Lorem ipsum" inicial

### JSON Formatter
- Formateo con indentación
- Minificación de JSON
- Validación de sintaxis
- Carga de ejemplos

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 480px, 768px, 1024px, 1200px
- **Touch Friendly**: Botones y elementos táctiles optimizados
- **Performance**: Imágenes responsivas y lazy loading

## 🔗 Enlaces Importantes

- **Sitio Web**: [hgaruna.netlify.app](https://hgaruna.netlify.app)
- **Google AdSense**: Panel de control para estadísticas
- **GitHub Actions**: Automatización de contenido
- **Gemini AI**: Generación de contenido inteligente

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: contacto@hgaruna.com
- **WhatsApp**: [Contactar](https://wa.me/5491234567890)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/hgaruna/issues)

---

**hgaruna** - Desarrollando el futuro, un tutorial a la vez 🚀
