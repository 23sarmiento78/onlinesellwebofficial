# 🤖 Sistema de Generación Automática con GitHub Actions

## 📋 Descripción

Sistema automatizado que genera **3 artículos de alta calidad diariamente** a las **16:00 hs Argentina** usando GitHub Actions y Gemini AI. Optimizado para Google AdSense y SEO local.

## ⚙️ Configuración Inicial

### 1. Variables de Entorno en GitHub

Ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**

#### Secrets (Obligatorios):
- `GEMINI_API_KEY`: Tu clave API de Google Gemini AI

#### Variables (Opcionales):
- `SITE_URL`: URL de tu sitio (default: https://hgaruna.org)

### 2. Cómo Obtener GEMINI_API_KEY

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API Key
3. Cópiala y añádela como Secret en GitHub

### 3. Activar GitHub Actions

1. Ve a la pestaña **Actions** de tu repositorio
2. Si está deshabilitado, haz clic en **"Enable GitHub Actions"**
3. Los workflows se activarán automáticamente

## 🕐 Programación Automática

### Ejecución Diaria
- **Hora**: 16:00 Argentina (19:00 UTC)
- **Frecuencia**: Todos los días
- **Artículos**: 3 por ejecución
- **Duración**: ~10-15 minutos

### Cron Schedule
```yaml
schedule:
  - cron: '0 19 * * *'  # 16:00 Argentina = 19:00 UTC
```

## 🚀 Workflows Disponibles

### 1. 🤖 Generación Automática (`generate-articles.yml`)
**Ejecuta automáticamente todos los días**

**Funciones:**
- Genera 3 artículos de alta calidad
- Integra AdSense automáticamente
- Optimiza SEO y contenido local
- Hace commit y push automático
- Crea reportes detallados
- Maneja errores y notificaciones

### 2. 🧪 Testing Manual (`test-article-generation.yml`)
**Ejecuta manualmente cuando necesites**

**Opciones:**
- `single`: Genera 1 artículo de prueba
- `multiple`: Genera N artículos específicos
- `full_system`: Prueba todo el sistema

**Uso:**
1. Ve a **Actions** → **Test - Generación de Artículos**
2. Click **Run workflow**
3. Selecciona opciones deseadas
4. Click **Run workflow**

## 📊 Monitoreo y Estadísticas

### Dashboard Automático
Cada ejecución genera:
- ✅ Status de la generación
- 📊 Estadísticas de palabras
- 📈 Métricas de calidad
- 🔍 Reportes de cumplimiento AdSense

### Archivos Generados
```
📁 Repositorio/
├── 📂 public/blog/           # Artículos HTML finales
├── 📂 src/content/articles/  # Versiones Markdown
├── 📂 reports/              # Reportes y estadísticas
└── 📂 .github/workflows/    # Configuración Actions
```

### 🔄 Integración Automática
El sistema se integra automáticamente con tu sitio web:

**📋 Índice del Blog (`/blog/index.json`)**
- Se actualiza automáticamente con cada nueva generación
- Los artículos aparecen inmediatamente en la página `/blog`
- Incluye metadata completa (título, fecha, categoría, etc.)

**🗺️ Sitemap (`/sitemap.xml`)**
- Se regenera con todos los nuevos artículos
- Incluye fechas de modificación actualizadas
- Mejora el SEO y indexación en Google

**✅ Sin Intervención Manual**
- Los artículos están disponibles automáticamente
- El sitio web los detecta y muestra inmediatamente
- Los buscadores pueden indexarlos al día siguiente

## 🎯 Características del Contenido

### Calidad Garantizada
- **1500-2000 palabras** por artículo
- **100% original** generado con IA
- **SEO optimizado** para Villa Carlos Paz
- **AdSense ready** con scripts integrados
- **Mobile responsive** y accesible

### Temas Automáticos
El sistema rota entre 18+ temas:
- Desarrollo Web Moderno
- SEO Local Villa Carlos Paz
- Marketing Digital PyMEs
- React y JavaScript
- Diseño UX/UI
- Inteligencia Artificial
- Seguridad Web
- E-commerce Local
- Y más...

## 🔧 Personalización

### Cambiar Hora de Ejecución
Edita `.github/workflows/generate-articles.yml`:

```yaml
schedule:
  - cron: 'MINUTO HORA * * *'
```

**Ejemplos:**
- `0 12 * * *` = 09:00 Argentina (12:00 UTC)
- `0 15 * * *` = 12:00 Argentina (15:00 UTC)
- `0 21 * * *` = 18:00 Argentina (21:00 UTC)

### Cambiar Cantidad de Artículos
Modifica la variable en el workflow:

```yaml
env:
  ARTICLE_COUNT: '5'  # Cambiar de 3 a 5 artículos
```

### Añadir Nuevos Temas
Edita `scripts/github-action-article-generator.js`:

```javascript
const DAILY_TOPICS_POOL = [
  // ... temas existentes
  {
    topic: 'Tu Nuevo Tema Aquí',
    category: 'desarrollo',  // desarrollo|seo|diseno|tecnologia
    keywords: ['keyword1', 'keyword2', 'keyword3']
  }
];
```

## 📋 Comandos Manuales

### Ejecutar Localmente
```bash
# Generar 3 artículos (como GitHub Actions)
npm run github-generate

# Monitorear estado del sistema
npm run monitor-system

# Test del sistema completo
npm run adsense-test
```

### Debug y Troubleshooting
```bash
# Verificar configuración
node -e "console.log('GEMINI_API_KEY:', !!process.env.GEMINI_API_KEY)"

# Test conexión Gemini
node scripts/test-gemini-connection.js

# Validar artículos existentes
npm run validate-adsense
```

## 🔍 Monitoreo de Ejecuciones

### Ver Logs de GitHub Actions
1. Ve a **Actions** en tu repositorio
2. Click en la ejecución que quieres revisar
3. Expande los steps para ver detalles

### Estados Posibles
- ✅ **Success**: Artículos generados correctamente
- ⚠️ **Warning**: Generados con advertencias menores
- ❌ **Failed**: Error en la generación (crea issue automático)

### Notificaciones de Error
Si algo falla, GitHub Actions automáticamente:
- 🐛 Crea un issue en el repositorio
- 📧 Envía notificación por email
- 📊 Genera logs detallados para debug

## 🚨 Solución de Problemas

### Error: "GEMINI_API_KEY not found"
```bash
# Verificar que el secret esté configurado
1. Ir a Settings → Secrets and variables → Actions
2. Verificar que GEMINI_API_KEY esté listado
3. Si no está, añadirlo con tu clave de Gemini AI
```

### Error: "Rate limit exceeded"
```bash
# Gemini AI tiene límites de uso
1. Esperar 1 hora antes de retry
2. Verificar quota en Google AI Studio
3. Considerar upgrade de plan si es necesario
```

### Error: "Git push failed"
```bash
# Problemas de permisos
1. Verificar que Actions tiene permisos de escritura
2. Ir a Settings → Actions → General
3. Habilitar "Read and write permissions"
```

### Workflow no ejecuta automáticamente
```bash
# Verificar configuración cron
1. Revisar syntax del cron en .github/workflows/
2. Verificar que el repositorio tenga actividad reciente
3. GitHub requiere actividad para mantener workflows activos
```

## 📈 Optimización y Mejores Prácticas

### Maximizar Éxito AdSense
- ✅ Genera contenido diariamente (consistency)
- ✅ Mantiene 1500+ palabras por artículo
- ✅ Enfoque local aumenta relevancia
- ✅ Scripts AdSense correctamente integrados
- ✅ SEO optimizado automáticamente

### Monitoreo Regular
```bash
# Ejecutar semanalmente
npm run monitor-system

# Revisar métricas mensuales
npm run adsense-validate
```

### Backup Automático
GitHub Actions automáticamente:
- 💾 Guarda versiones en Git history
- 📊 Crea reportes en `/reports/`
- 🔄 Mantiene backup de configuración

## 🎯 Próximos Pasos

### Después de la Configuración
1. ✅ Verificar primera ejecución automática
2. 📊 Revisar reportes generados
3. 🔍 Validar calidad de artículos
4. 🚀 Aplicar a Google AdSense
5. 📈 Monitorear métricas de tráfico

### Escalabilidad
- 📅 Aumentar frecuencia si es necesario
- 🎯 Personalizar temas según analytics
- 🔄 Ajustar horarios según audiencia
- 📊 Optimizar basado en performance

## 📞 Soporte

### Documentación Adicional
- [ADSENSE-SYSTEM-README.md](./ADSENSE-SYSTEM-README.md) - Sistema completo
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Gemini AI Docs](https://ai.google.dev/docs)

### Issues y Bugs
Si encuentras problemas:
1. 🔍 Revisa logs de la última ejecución
2. 🐛 Crea issue en el repositorio
3. 📝 Incluye logs y detalles del error
4. 🏷️ Usa labels: `github-actions`, `automation`, `bug`

---

## 🎉 ¡Sistema Listo!

Tu sistema de generación automática está configurado para:

✅ **Generar 3 artículos diarios** a las 16:00 Argentina  
✅ **Optimizar para Google AdSense** automáticamente  
✅ **SEO local** para Villa Carlos Paz  
✅ **Commits automáticos** sin intervención manual  
✅ **Monitoreo y reportes** completos  
✅ **Manejo de errores** inteligente  

**¡Tu contenido se genera automáticamente todos los días!** 🚀

---

*Desarrollado por hgaruna Digital para maximizar aprobación AdSense*
