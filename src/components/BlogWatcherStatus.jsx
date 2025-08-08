import React, { useState, useEffect } from 'react'
import { blogWatcher } from '@utils/blogWatcher'

const BlogWatcherStatus = ({ showDetails = false }) => {
  const [status, setStatus] = useState(blogWatcher.getStatus())
  const [lastEvent, setLastEvent] = useState(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    // Actualizar estado cada segundo
    const statusInterval = setInterval(() => {
      setStatus(blogWatcher.getStatus())
    }, 1000)

    // Escuchar eventos del watcher
    const handleWatcherEvent = (event) => {
      setLastEvent({
        ...event,
        time: new Date().toLocaleTimeString()
      })
    }

    blogWatcher.onArticlesChanged(handleWatcherEvent)

    return () => {
      clearInterval(statusInterval)
      blogWatcher.removeCallback(handleWatcherEvent)
    }
  }, [])

  const handleForceCheck = async () => {
    await blogWatcher.forceCheck()
  }

  const handleRegenerateIndex = async () => {
    setIsRegenerating(true)
    try {
      // En un entorno real, esto llamaría al endpoint del servidor
      console.log('🔄 Solicitando regeneración manual del index.json')
      console.log('💡 Ejecuta: npm run regenerate-blog-index')
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Forzar verificación después de la regeneración
      await blogWatcher.forceCheck()
      
    } catch (error) {
      console.error('❌ Error regenerando index:', error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const formatLastCheck = (timestamp) => {
    if (!timestamp) return 'Nunca'
    return new Date(timestamp).toLocaleTimeString()
  }

  if (!showDetails) {
    // Vista compacta
    return (
      <div className="blog-watcher-compact">
        <span className={`status-indicator ${status.isWatching ? 'active' : 'inactive'}`}>
          {status.isWatching ? '🟢' : '🔴'}
        </span>
        <span className="status-text">
          {status.isWatching ? 'Vigilancia activa' : 'Vigilancia inactiva'}
        </span>
      </div>
    )
  }

  // Vista detallada
  return (
    <div className="blog-watcher-status">
      <div className="watcher-header">
        <h3>🔍 Estado de Vigilancia del Blog</h3>
        <div className={`status-badge ${status.isWatching ? 'active' : 'inactive'}`}>
          {status.isWatching ? 'ACTIVO' : 'INACTIVO'}
        </div>
      </div>

      <div className="watcher-details">
        <div className="detail-row">
          <span className="detail-label">Estado:</span>
          <span className={`detail-value ${status.isWatching ? 'active' : 'inactive'}`}>
            {status.isWatching ? '🟢 Vigilando cambios' : '🔴 Detenido'}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Artículos detectados:</span>
          <span className="detail-value">{status.articleCount}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Última verificación:</span>
          <span className="detail-value">{formatLastCheck(status.lastCheck)}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Callbacks registrados:</span>
          <span className="detail-value">{status.callbacksCount}</span>
        </div>
      </div>

      {lastEvent && (
        <div className="last-event">
          <h4>📊 Último Evento</h4>
          <div className="event-details">
            <div className="event-type">
              Tipo: <span className="event-value">{lastEvent.type}</span>
            </div>
            <div className="event-time">
              Hora: <span className="event-value">{lastEvent.time}</span>
            </div>
            {lastEvent.difference && (
              <div className="event-difference">
                Cambio: <span className={`event-value ${lastEvent.difference > 0 ? 'positive' : 'negative'}`}>
                  {lastEvent.difference > 0 ? '+' : ''}{lastEvent.difference} artículos
                </span>
              </div>
            )}
            {lastEvent.message && (
              <div className="event-message">
                Mensaje: <span className="event-value">{lastEvent.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="watcher-actions">
        <button 
          onClick={handleForceCheck}
          className="action-button check-button"
          disabled={!status.isWatching}
        >
          🔍 Verificar Ahora
        </button>
        
        <button 
          onClick={handleRegenerateIndex}
          className="action-button regenerate-button"
          disabled={isRegenerating}
        >
          {isRegenerating ? '🔄 Regenerando...' : '♻️ Regenerar Index'}
        </button>

        <button 
          onClick={() => status.isWatching ? blogWatcher.stopWatching() : blogWatcher.startWatching()}
          className={`action-button ${status.isWatching ? 'stop-button' : 'start-button'}`}
        >
          {status.isWatching ? '⏹️ Detener' : '▶️ Iniciar'}
        </button>
      </div>

      <div className="watcher-info">
        <p className="info-text">
          <strong>ℹ️ Información:</strong> La vigilancia automática verifica cada 30 segundos si hay cambios 
          en el número de artículos. Cuando detecta cambios, recarga automáticamente la lista de artículos.
        </p>
        <p className="info-text">
          <strong>🛠️ Regeneración manual:</strong> Si añades nuevos archivos HTML al directorio /public/blog, 
          ejecuta <code>npm run regenerate-blog-index</code> para actualizar el index.json.
        </p>
      </div>

      <style jsx>{`
        .blog-watcher-status {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border: 1px solid #e1e8f0;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .blog-watcher-compact {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .watcher-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .watcher-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 18px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .watcher-details {
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .detail-label {
          font-weight: 600;
          color: #495057;
        }

        .detail-value {
          color: #6c757d;
        }

        .detail-value.active {
          color: #28a745;
        }

        .detail-value.inactive {
          color: #dc3545;
        }

        .last-event {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .last-event h4 {
          margin: 0 0 10px 0;
          color: #495057;
          font-size: 14px;
        }

        .event-details > div {
          margin-bottom: 5px;
          font-size: 13px;
        }

        .event-value {
          font-weight: 600;
        }

        .event-value.positive {
          color: #28a745;
        }

        .event-value.negative {
          color: #dc3545;
        }

        .watcher-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .check-button {
          background: #007bff;
          color: white;
        }

        .check-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .regenerate-button {
          background: #ffc107;
          color: #212529;
        }

        .regenerate-button:hover:not(:disabled) {
          background: #e0a800;
        }

        .start-button {
          background: #28a745;
          color: white;
        }

        .start-button:hover:not(:disabled) {
          background: #1e7e34;
        }

        .stop-button {
          background: #dc3545;
          color: white;
        }

        .stop-button:hover:not(:disabled) {
          background: #c82333;
        }

        .watcher-info {
          background: #e7f3ff;
          border: 1px solid #b3d7ff;
          border-radius: 6px;
          padding: 15px;
        }

        .info-text {
          margin: 0 0 10px 0;
          font-size: 13px;
          line-height: 1.4;
          color: #495057;
        }

        .info-text:last-child {
          margin-bottom: 0;
        }

        .info-text code {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }

        .status-indicator {
          font-size: 12px;
        }

        .status-text {
          color: #495057;
          font-size: 13px;
        }

        @media (max-width: 768px) {
          .watcher-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .watcher-actions {
            flex-direction: column;
          }
          
          .action-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default BlogWatcherStatus
