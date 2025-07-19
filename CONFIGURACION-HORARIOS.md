# Configuración de Horarios - GitHub Actions

## 🕐 Horario de Ejecución

El workflow de generación de artículos está configurado para ejecutarse **diariamente a las 16:00 (4:00 PM) hora argentina**.

### Configuración Técnica

```yaml
# .github/workflows/generate-articles-and-sitemap.yml
on:
  schedule:
    # 16:00 (4:00 PM) hora Argentina (UTC-3) = 19:00 UTC
    - cron: '0 19 * * *' # 16:00 ART (4:00 PM)
```

### Conversión de Horarios

| Zona Horaria | Hora | Formato |
|--------------|------|---------|
| **Argentina (ART)** | 16:00 | 4:00 PM |
| **UTC** | 19:00 | 7:00 PM |
| **Diferencia** | UTC-3 | 3 horas menos |

## 📅 Información Detallada

### ¿Por qué 16:00 ART?
- **Hora clave**: Es un momento óptimo para el tráfico web
- **Horario laboral**: La mayoría de usuarios están activos
- **Consistencia**: Horario fijo todos los días
- **Zona horaria**: Adaptado específicamente para Argentina

### ¿Qué hace el workflow?
1. **Genera 4 artículos nuevos** usando Google Gemini API
2. **Actualiza el sitemap** automáticamente
3. **Hace commit y push** de los cambios
4. **Mantiene el blog actualizado** diariamente

### Ejecución Manual
El workflow también se puede ejecutar manualmente desde:
- GitHub Actions → Workflows → "Generar artículos HTML y crear sitemap" → "Run workflow"

## 🛠️ Scripts de Verificación

### Verificar Horario Actual
```bash
node scripts/check-schedule-simple.js
```

### Verificar Próximas Ejecuciones
El script muestra:
- Hora actual en Argentina
- Tiempo hasta la próxima ejecución
- Lista de próximas 5 ejecuciones
- Información de zona horaria

## 📊 Ejemplo de Salida

```
🕐 Verificando horario de ejecución del workflow...

📅 Configuración actual:
   Cron: 0 19 * * *
   UTC: 19:00 (7:00 PM)
   Argentina: 16:00 (4:00 PM)
   Zona horaria: America/Argentina/Buenos_Aires

🕐 Hora actual en Argentina: 10:27:45 p. m.
⏰ Próxima ejecución en 17 horas y 33 minutos

📋 Próximas ejecuciones:
   1. sábado, 19/07/2025, 04:00 p. m.
   2. domingo, 20/07/2025, 04:00 p. m.
   3. lunes, 21/07/2025, 04:00 p. m.
   4. martes, 22/07/2025, 04:00 p. m.
   5. miércoles, 23/07/2025, 04:00 p. m.
```

## 🔧 Configuración de Zona Horaria

### Argentina
- **Horario estándar**: UTC-3
- **Horario de verano**: UTC-3 (Argentina no cambia horario)
- **Zona horaria**: America/Argentina/Buenos_Aires

### GitHub Actions
- **Servidor**: UTC (Tiempo Universal Coordinado)
- **Conversión**: ART = UTC - 3 horas
- **Configuración**: Automática en el workflow

## 📝 Notas Importantes

1. **Consistencia**: El horario es fijo todos los días
2. **Automatización**: No requiere intervención manual
3. **Fallback**: Si falla, se puede ejecutar manualmente
4. **Logs**: Todos los logs se guardan en GitHub Actions
5. **Notificaciones**: Se pueden configurar notificaciones por email

## 🚀 Próximos Pasos

1. **Monitorear**: Revisar logs de GitHub Actions
2. **Verificar**: Confirmar que los artículos se generan correctamente
3. **Optimizar**: Ajustar horario si es necesario
4. **Escalar**: Aumentar frecuencia si se requiere más contenido

---

**Última actualización**: 18 de Julio, 2025
**Configurado por**: Sistema de Automatización IA 