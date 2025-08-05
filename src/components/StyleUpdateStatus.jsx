import React, { useState, useEffect } from 'react'
import { getStyleUpdateStatus, downloadUpdatedArticles } from '@utils/updateArticleStyles'

export default function StyleUpdateStatus() {
  const [updateStatus, setUpdateStatus] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const loadStatus = () => {
      const status = getStyleUpdateStatus()
      setUpdateStatus(status)
    }

    loadStatus()

    // Listen for updates
    const interval = setInterval(loadStatus, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleDownload = () => {
    downloadUpdatedArticles()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!updateStatus) {
    return (
      <div className="style-update-status bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 text-blue-600">
          <i className="fas fa-paint-brush animate-spin"></i>
          <span className="text-sm font-medium">Actualizando estilos de artículos...</span>
        </div>
      </div>
    )
  }

  const successRate = updateStatus.total > 0 ? 
    Math.round((updateStatus.updated / updateStatus.total) * 100) : 0

  return (
    <div className="style-update-status bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              successRate === 100 ? 'bg-green-100' : successRate > 50 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <i className={`fas ${
                successRate === 100 ? 'fa-check-circle text-green-600' : 
                successRate > 50 ? 'fa-exclamation-triangle text-yellow-600' : 
                'fa-times-circle text-red-600'
              }`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Estilos Modernos</h3>
              <p className="text-sm text-gray-600">
                {updateStatus.updated}/{updateStatus.total} artículos actualizados • {successRate}% completado
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              successRate === 100 ? 'text-green-600 bg-green-50' :
              successRate > 50 ? 'text-yellow-600 bg-yellow-50' :
              'text-red-600 bg-red-50'
            }`}>
              <i className={`fas ${
                successRate === 100 ? 'fa-check' : 
                successRate > 50 ? 'fa-clock' : 'fa-warning'
              }`}></i>
              {successRate === 100 ? 'Completado' : successRate > 50 ? 'En Progreso' : 'Con Errores'}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progreso de actualización</span>
            <span>{successRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                successRate === 100 ? 'bg-green-500' :
                successRate > 50 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{updateStatus.updated}</div>
                <div className="text-xs text-gray-600">Actualizados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{updateStatus.failed}</div>
                <div className="text-xs text-gray-600">Fallidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{updateStatus.total}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>

            <div className="text-xs text-gray-600 mb-4">
              <strong>Actualizado:</strong> {formatDate(updateStatus.timestamp)}
            </div>

            {updateStatus.errors && updateStatus.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Errores ({updateStatus.errors.length})
                </h4>
                <div className="max-h-32 overflow-y-auto">
                  {updateStatus.errors.slice(0, 5).map((error, index) => (
                    <div key={index} className="text-xs text-red-700 bg-red-50 p-2 rounded mb-1">
                      <strong>{error.file}:</strong> {error.error}
                    </div>
                  ))}
                  {updateStatus.errors.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      ... y {updateStatus.errors.length - 5} errores más
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="btn btn-sm btn-outline flex items-center gap-2"
                disabled={updateStatus.updated === 0}
              >
                <i className="fas fa-download"></i>
                Descargar Resumen
              </button>

              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary flex items-center gap-2"
              >
                <i className="fas fa-eye"></i>
                Ver Artículos
              </a>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-800">
                <strong>ℹ️ Mejoras aplicadas:</strong>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Diseño moderno y responsivo</li>
                  <li>Mejor tipografía y espaciado</li>
                  <li>Código syntax highlighting mejorado</li>
                  <li>Navegación y estructura optimizada</li>
                  <li>Estilos dark mode compatible</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
