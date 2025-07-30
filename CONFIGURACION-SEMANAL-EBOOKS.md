# 📅 Configuración Semanal de Ebooks

## 🎯 Configuración Actual

### **Frecuencia de Generación:**
- ⏰ **Una vez por semana**
- 📅 **Día**: Domingo
- 🕐 **Hora**: 10:00 AM (hora Argentina)
- ⚙️ **Cron**: `0 13 * * 0`

### **¿Por qué Semanal?**

#### **Ventajas de la Generación Semanal:**
- 📊 **Menor carga de recursos** en el servidor
- 💾 **Menos commits** automáticos al repositorio
- 📈 **Mejor rendimiento** del sistema
- 🎯 **Contenido más consolidado** con más artículos acumulados
- ⏱️ **Menor tiempo de procesamiento** total

#### **Comparación con Generación Diaria:**
| Aspecto | Diaria | Semanal |
|---------|--------|---------|
| Frecuencia | 7 veces por semana | 1 vez por semana |
| Archivos generados | 28 por día | 28 por semana |
| Uso de recursos | Alto | Bajo |
| Contenido por ebook | Menos artículos | Más artículos |
| Tiempo de procesamiento | 5-10 min diarios | 5-10 min semanales |

---

## 🔧 Configuración Técnica

### **Workflow de GitHub Actions:**

```yaml
# .github/workflows/generate-ebooks.yml
on:
  schedule:
    # Generar ebooks una vez por semana los domingos a las 10:00 AM (hora Argentina)
    # cron: 'minuto hora día mes día_semana'
    - cron: '0 13 * * 0'
  workflow_dispatch:  # Ejecución manual también disponible
```

### **Cronograma Detallado:**

| Elemento | Configuración |
|----------|---------------|
| **Día de la semana** | Domingo (0) |
| **Hora local** | 10:00 AM |
| **Hora UTC** | 13:00 (UTC-3) |
| **Frecuencia** | Una vez por semana |
| **Ejecución manual** | Disponible en GitHub Actions |

---

## 📊 Contenido Generado Semanalmente

### **Ebooks por Categoría:**

#### **1. Frontend**
- `frontend.pdf` - Ebook básico
- `frontend.html` - Versión HTML básica
- `guia-avanzada-frontend.pdf` - Ebook avanzado
- `guia-avanzada-frontend.html` - Versión HTML avanzada

#### **2. Backend**
- `backend.pdf` - Ebook básico
- `backend.html` - Versión HTML básica
- `guia-avanzada-backend.pdf` - Ebook avanzado
- `guia-avanzada-backend.html` - Versión HTML avanzada

#### **3. Bases de Datos**
- `bases-de-datos.pdf` - Ebook básico
- `bases-de-datos.html` - Versión HTML básica
- `guia-avanzada-bases-de-datos.pdf` - Ebook avanzado
- `guia-avanzada-bases-de-datos.html` - Versión HTML avanzada

#### **4. DevOps y Cloud**
- `devops-y-cloud.pdf` - Ebook básico
- `devops-y-cloud.html` - Versión HTML básica
- `guia-avanzada-devops-y-cloud.pdf` - Ebook avanzado
- `guia-avanzada-devops-y-cloud.html` - Versión HTML avanzada

#### **5. Testing y Calidad**
- `testing-y-calidad.pdf` - Ebook básico
- `testing-y-calidad.html` - Versión HTML básica
- `guia-avanzada-testing-y-calidad.pdf` - Ebook avanzado
- `guia-avanzada-testing-y-calidad.html` - Versión HTML avanzada

#### **6. Inteligencia Artificial**
- `inteligencia-artificial.pdf` - Ebook básico
- `inteligencia-artificial.html` - Versión HTML básica
- `guia-avanzada-inteligencia-artificial.pdf` - Ebook avanzado
- `guia-avanzada-inteligencia-artificial.html` - Versión HTML avanzada

#### **7. Seguridad**
- `seguridad.pdf` - Ebook básico
- `seguridad.html` - Versión HTML básica
- `guia-avanzada-seguridad.pdf` - Ebook avanzado
- `guia-avanzada-seguridad.html` - Versión HTML avanzada

### **Total de Archivos por Semana:**
- 📄 **28 archivos** generados semanalmente
- 📚 **7 categorías** cubiertas
- 🎨 **2 niveles** de complejidad (básico y avanzado)
- 📄 **2 formatos** por nivel (PDF + HTML)

---

## 🚀 Comandos de Verificación

### **Verificar Configuración Semanal:**
```bash
npm run verify-weekly
```

### **Generar Ebooks Manualmente:**
```bash
# Generar todos los ebooks (como lo hace el workflow semanal)
npm run generate-all-ebooks

# O generar por separado
npm run generate-ebooks           # Ebooks básicos
npm run generate-advanced-ebooks  # Ebooks avanzados
```

### **Probar el Sistema:**
```bash
npm run test-ebooks
```

---

## 📈 Estadísticas Semanales

### **Contenido Procesado por Semana:**
- 📄 **50+ artículos** técnicos disponibles
- 📚 **7 categorías** principales
- 📝 **800-1200 palabras** por artículo
- 🎯 **Temas especializados** por área técnica

### **Recursos Utilizados:**
- ⏱️ **Tiempo de procesamiento**: 5-10 minutos
- 💾 **Espacio en disco**: ~50-100 MB por semana
- 🔄 **Frecuencia**: Una vez por semana
- 📊 **Eficiencia**: Alta (consolida contenido semanal)

---

## 🔄 Ejecución Manual

### **Cómo Ejecutar Manualmente:**

1. **Desde GitHub:**
   - Ve a tu repositorio en GitHub
   - Navega a Actions > generate-ebooks.yml
   - Haz clic en "Run workflow"
   - Selecciona la rama (main/master)
   - Haz clic en "Run workflow"

2. **Desde Terminal:**
   ```bash
   npm run generate-all-ebooks
   ```

3. **Verificar Configuración:**
   ```bash
   npm run verify-weekly
   ```

---

## 📊 Monitoreo y Logs

### **Logs de Ejecución Semanal:**
- 📅 **Fecha y hora** de ejecución
- 📚 **Número de ebooks** generados
- 📄 **Archivos creados** con rutas
- ⏱️ **Tiempo de procesamiento**
- ✅ **Estado de éxito/error**

### **Ejemplo de Log Semanal:**
```
📚 Generando ebooks básicos (ejecución semanal)...
📅 Fecha de ejecución: 2024-01-21 10:00:00
✅ Se generaron 7 ebooks básicos
📚 Generando ebooks avanzados (ejecución semanal)...
✅ Se generaron 7 ebooks avanzados
📊 Total: 28 archivos generados
```

---

## 🎯 Beneficios de la Configuración Semanal

### **Para el Sistema:**
- 🔋 **Menor consumo** de recursos
- ⚡ **Mejor rendimiento** general
- 💾 **Menos commits** automáticos
- 🔄 **Procesamiento más eficiente**

### **Para el Contenido:**
- 📚 **Ebooks más completos** con más artículos
- 🎯 **Mejor organización** del contenido
- 📊 **Estadísticas más precisas**
- 📈 **Calidad mejorada** del contenido

### **Para el Negocio:**
- 💰 **Menor costo** de infraestructura
- ⏱️ **Menor tiempo** de mantenimiento
- 📊 **Métricas más claras** semanales
- 🎯 **Contenido más valioso** para usuarios

---

## 🔮 Personalización

### **Cambiar Frecuencia:**
Si necesitas cambiar la frecuencia, modifica el cron en `.github/workflows/generate-ebooks.yml`:

```yaml
# Diario a las 10:00 AM
- cron: '0 13 * * *'

# Semanal (actual)
- cron: '0 13 * * 0'

# Mensual el primer domingo
- cron: '0 13 1-7 * 0'

# Cada 2 semanas
- cron: '0 13 * * 0'  # Y agregar lógica adicional
```

### **Cambiar Hora:**
```yaml
# 8:00 AM hora Argentina
- cron: '0 11 * * 0'

# 2:00 PM hora Argentina
- cron: '0 17 * * 0'

# 6:00 PM hora Argentina
- cron: '0 21 * * 0'
```

---

*Esta configuración semanal optimiza el uso de recursos mientras mantiene la calidad y completitud del contenido generado.* 