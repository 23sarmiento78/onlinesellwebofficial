# 🎨 Guía de Estilos - Dark Green Theme

## 📋 Resumen de Mejoras Implementadas

### ✨ Características Principales

#### 🎯 **Sistema de Variables CSS Avanzado**
- **Paleta de colores expandida**: 8 tonos de verde diferentes
- **Sistema de espaciado**: Variables para márgenes y padding consistentes
- **Transiciones personalizadas**: Diferentes tipos de animaciones
- **Sombras y bordes**: Sistema unificado de efectos visuales

#### 🌟 **Efectos Visuales Avanzados**
- **Glassmorphism**: Efectos de cristal con backdrop-filter
- **Gradientes dinámicos**: Fondos animados y gradientes complejos
- **Animaciones CSS**: 8 animaciones personalizadas diferentes
- **Hover effects**: Transiciones suaves y efectos interactivos

#### 📱 **Diseño Responsivo Mejorado**
- **Breakpoints optimizados**: 768px y 480px
- **Tipografía escalable**: Tamaños de fuente adaptativos
- **Layout flexible**: Diseño que se adapta a diferentes pantallas

#### ♿ **Accesibilidad**
- **Reduced motion**: Soporte para usuarios con preferencias de movimiento reducido
- **Focus indicators**: Indicadores de foco claros para navegación por teclado
- **Contraste mejorado**: Colores optimizados para mejor legibilidad

### 🎨 **Paleta de Colores**

```css
/* Verdes principales */
--primary-green: #00ff41;    /* Verde neón principal */
--secondary-green: #1db954;  /* Verde secundario */
--accent-green: #39ff14;     /* Verde de acento */
--neon-green: #00ff88;       /* Verde neón suave */
--emerald-green: #50fa7b;    /* Verde esmeralda */
--forest-green: #2d5a27;     /* Verde bosque */
--dark-green: #0d4f3c;       /* Verde oscuro */
--darker-green: #041e18;     /* Verde muy oscuro */

/* Fondos */
--bg-primary: #0a0a0a;       /* Fondo principal */
--bg-secondary: #111111;     /* Fondo secundario */
--bg-tertiary: #1a1a1a;      /* Fondo terciario */
--bg-card: #181818;          /* Fondo de tarjetas */
--bg-glass: rgba(24, 24, 24, 0.8); /* Fondo cristal */
--bg-overlay: rgba(0, 0, 0, 0.7);  /* Fondo overlay */

/* Texto */
--text-primary: #ffffff;     /* Texto principal */
--text-secondary: #b3b3b3;   /* Texto secundario */
--text-muted: #888888;       /* Texto atenuado */
```

### 🎭 **Animaciones Implementadas**

#### 1. **Glow Effects**
```css
@keyframes glow {
  0%, 100% { text-shadow: 0 0 5px rgba(0, 255, 65, 0.5); }
  50% { text-shadow: 0 0 20px rgba(0, 255, 65, 0.8), 0 0 30px rgba(0, 255, 65, 0.5); }
}
```

#### 2. **Background Pulse**
```css
@keyframes backgroundPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
```

#### 3. **Hero Title Glow**
```css
@keyframes heroTitleGlow {
  0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 65, 0.3); }
  50% { text-shadow: 0 0 20px rgba(0, 255, 65, 0.6), 0 0 30px rgba(0, 255, 65, 0.4); }
}
```

#### 4. **Number Pulse**
```css
@keyframes numberPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### 🎯 **Componentes Mejorados**

#### **Navbar**
- Efecto glassmorphism con backdrop-filter
- Animaciones suaves en hover
- Sticky positioning
- Transiciones de scroll

#### **Botones**
- Gradientes dinámicos
- Efectos de hover con transform
- Animaciones de shimmer
- Estados de focus mejorados

#### **Tarjetas**
- Efectos de elevación
- Bordes con gradientes
- Animaciones de hover complejas
- Glassmorphism effects

#### **Formularios**
- Estados de focus mejorados
- Animaciones de entrada
- Validación visual
- Transiciones suaves

### 📱 **Responsive Design**

#### **Breakpoints**
```css
/* Tablet */
@media (max-width: 768px) {
  --spacing-xl: 2rem;
  --spacing-lg: 1.5rem;
}

/* Mobile */
@media (max-width: 480px) {
  .hero-stats { flex-direction: column; }
}
```

### ♿ **Accesibilidad**

#### **Reduced Motion**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### **Focus Indicators**
```css
button:focus,
input:focus,
textarea:focus,
select:focus,
a:focus {
  outline: 2px solid var(--primary-green);
  outline-offset: 2px;
}
```

### 🎨 **Uso de Variables**

#### **Espaciado**
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
```

#### **Bordes**
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
```

#### **Transiciones**
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
--transition-bounce: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

### 🚀 **Características Avanzadas**

#### **Scrollbar Personalizada**
- Gradientes en el thumb
- Efectos de hover
- Bordes redondeados
- Colores temáticos

#### **Selección de Texto**
- Colores personalizados
- Soporte para Firefox
- Contraste optimizado

#### **Print Styles**
- Estilos específicos para impresión
- Ocultación de elementos innecesarios
- Colores optimizados para papel

### 📋 **Clases Utilitarias**

#### **Animaciones**
- `.loading-spinner` - Spinner de carga animado
- `.hero-title` - Título con efecto glow
- `.hero-stat-number` - Números con pulso

#### **Estados**
- `.warning` - Tarjetas de advertencia
- `.success` - Tarjetas de éxito
- `.scrolled` - Navbar con scroll

### 🔧 **Implementación**

El tema se implementa automáticamente importando el archivo CSS:

```javascript
// En App.js
import "./dark-green-theme.css";

// En index.js
import "./dark-green-theme.css";
```

### 🎯 **Próximas Mejoras Sugeridas**

1. **Modo claro/oscuro toggle**
2. **Más animaciones de entrada**
3. **Efectos de parallax**
4. **Sistema de iconos SVG animados**
5. **Temas alternativos**
6. **Optimización de rendimiento**

---

*Esta guía documenta las mejoras implementadas en el tema Dark Green para el proyecto hgaruna.org*
