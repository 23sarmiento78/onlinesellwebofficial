// Sistema de vigilancia automática para nuevos artículos del blog
import { blogLoader } from './blogLoader.js'

class BlogWatcher {
  constructor() {
    this.isWatching = false
    this.lastCheck = null
    this.articleCount = 0
    this.checkInterval = null
    this.callbacks = []
  }

  // Iniciar vigilancia automática
  startWatching(interval = 30000) { // Check cada 30 segundos
    if (this.isWatching) return

    this.isWatching = true
    console.log('🔍 Iniciando vigilancia automática de nuevos artículos...')
    
    // Check inicial
    this.checkForNewArticles()
    
    // Set up interval
    this.checkInterval = setInterval(() => {
      this.checkForNewArticles()
    }, interval)
  }

  // Detener vigilancia
  stopWatching() {
    if (!this.isWatching) return

    this.isWatching = false
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    console.log('⏹️ Vigilancia automática detenida')
  }

  // Verificar si hay nuevos artículos
  async checkForNewArticles() {
    try {
      // Verificar si index.json existe y obtener metadatos
      const response = await fetch('/blog/index.json?t=' + Date.now(), {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        console.log('📁 index.json no encontrado, intentando regenerar...')
        await this.regenerateIndex()
        return
      }

      const articles = await response.json()
      const currentCount = articles.length

      // Si es la primera verificación, solo almacenar el count
      if (this.lastCheck === null) {
        this.articleCount = currentCount
        this.lastCheck = Date.now()
        console.log(`📊 Vigilancia iniciada. Artículos actuales: ${currentCount}`)
        return
      }

      // Verificar si hay cambios en el número de artículos
      if (currentCount !== this.articleCount) {
        const difference = currentCount - this.articleCount
        console.log(`🆕 Detectados cambios en artículos: ${difference > 0 ? '+' : ''}${difference}`)
        
        this.articleCount = currentCount
        this.lastCheck = Date.now()
        
        // Limpiar cache del blogLoader
        blogLoader.clearCache()
        
        // Notificar a callbacks registrados
        this.notifyCallbacks({
          type: 'articles_changed',
          count: currentCount,
          difference: difference,
          timestamp: this.lastCheck
        })
      }

    } catch (error) {
      console.error('❌ Error verificando nuevos artículos:', error)
      
      // Si falla cargar index.json, intentar regenerarlo
      if (error.message.includes('index.json')) {
        await this.regenerateIndex()
      }
    }
  }

  // Intentar regenerar el index.json
  async regenerateIndex() {
    try {
      console.log('🔄 Intentando regenerar index.json...')
      
      // Intentar llamar al script de regeneración si estamos en desarrollo
      if (import.meta.env.DEV) {
        // En desarrollo, podemos intentar regenerar directamente
        await this.generateIndexFromHTML()
      } else {
        console.log('ℹ️ En producción, se requiere regeneración manual del index.json')
      }
    } catch (error) {
      console.error('❌ Error regenerando index.json:', error)
    }
  }

  // Generar index.json desde archivos HTML existentes
  async generateIndexFromHTML() {
    try {
      // Obtener lista de archivos HTML en la carpeta blog
      const blogResponse = await fetch('/blog/', {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!blogResponse.ok) {
        throw new Error('No se pudo acceder a la carpeta blog')
      }

      // Esta función requeriría un endpoint en el servidor para listar archivos
      // Por ahora, registramos que se necesita regeneración manual
      console.log('⚠️ Se requiere regeneración manual del index.json')
      console.log('💡 Ejecuta: node scripts/regenerate-blog-index.js')
      
      this.notifyCallbacks({
        type: 'regeneration_needed',
        message: 'Se detectaron cambios pero se requiere regeneración manual'
      })

    } catch (error) {
      console.error('❌ Error generando index desde HTML:', error)
    }
  }

  // Registrar callback para notificaciones
  onArticlesChanged(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback)
    }
  }

  // Remover callback
  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }

  // Notificar a todos los callbacks
  notifyCallbacks(event) {
    this.callbacks.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('❌ Error en callback de BlogWatcher:', error)
      }
    })
  }

  // Forzar verificación manual
  async forceCheck() {
    console.log('🔍 Verificación manual forzada...')
    await this.checkForNewArticles()
  }

  // Obtener estado actual
  getStatus() {
    return {
      isWatching: this.isWatching,
      articleCount: this.articleCount,
      lastCheck: this.lastCheck,
      callbacksCount: this.callbacks.length
    }
  }
}

// Instancia singleton
export const blogWatcher = new BlogWatcher()

// Hook para React
export function useBlogWatcher() {
  return blogWatcher
}

// Auto-iniciar en desarrollo
if (import.meta.env.DEV) {
  // Iniciar vigilancia automáticamente en desarrollo
  setTimeout(() => {
    blogWatcher.startWatching(30000) // Check cada 30 segundos
  }, 2000) // Delay inicial de 2 segundos
}
