import React, { useState, useEffect } from 'react'
import { getSitemapStatus, downloadSitemap, submitSitemapToSearchEngines } from '@utils/sitemapUpdater'

export default function SitemapStatus() {
  const [sitemapData, setSitemapData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmission, setLastSubmission] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const loadSitemapStatus = () => {
      const data = getSitemapStatus()
      setSitemapData(data)
    }

    loadSitemapStatus()

    // Listen for sitemap updates
    const handleSitemapUpdate = (event) => {
      setSitemapData(event.detail)
    }

    window.addEventListener('sitemapUpdated', handleSitemapUpdate)

    return () => {
      window.removeEventListener('sitemapUpdated', handleSitemapUpdate)
    }
  }, [])

  const handleDownload = () => {
    try {
      downloadSitemap()
    } catch (error) {
      alert('Error al descargar el sitemap: ' + error.message)
    }
  }

  const handleSubmitToSearchEngines = async () => {
    setIsSubmitting(true)
    try {
      const results = await submitSitemapToSearchEngines()
      setLastSubmission({
        timestamp: new Date().toISOString(),
        results
      })
      alert('¡Sitemap enviado exitosamente a los motores de búsqueda!')
    } catch (error) {
      alert('Error al enviar el sitemap: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!sitemapData) {
    return null // Don't show loading state to users
  }

  return (
    <div className="sitemap-status bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-sitemap text-green-600"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sitemap SEO</h3>
              <p className="text-sm text-gray-600">
                {sitemapData.totalUrls} URLs • Actualizado {formatDate(sitemapData.lastUpdated)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <i className="fas fa-check-circle"></i>
              Actualizado
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sitemapData.articleCount}</div>
                <div className="text-xs text-gray-600">Artículos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">6</div>
                <div className="text-xs text-gray-600">Categorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">7</div>
                <div className="text-xs text-gray-600">Páginas Estáticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{sitemapData.totalUrls}</div>
                <div className="text-xs text-gray-600">Total URLs</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleDownload}
                className="btn btn-sm btn-outline flex items-center gap-2"
              >
                <i className="fas fa-download"></i>
                Descargar XML
              </button>

              <button
                onClick={handleSubmitToSearchEngines}
                disabled={isSubmitting}
                className="btn btn-sm btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i>
                    Enviar a Buscadores
                  </>
                )}
              </button>

              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-ghost flex items-center gap-2"
              >
                <i className="fab fa-google"></i>
                Search Console
              </a>
            </div>

            {lastSubmission && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-check-circle text-green-600"></i>
                  <span className="text-sm font-medium text-green-800">
                    Última Submisión: {formatDate(lastSubmission.timestamp)}
                  </span>
                </div>
                <div className="text-xs text-green-700">
                  ✓ Google Search Console &nbsp;&nbsp;
                  ✓ Bing Webmaster Tools &nbsp;&nbsp;
                  ✓ Yahoo &nbsp;&nbsp;
                  ✓ Yandex
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              <p>
                <i className="fas fa-info-circle mr-1"></i>
                El sitemap se actualiza automáticamente cuando se agregan, editan o eliminan artículos.
                Se recomienda enviar a buscadores semanalmente para mejor indexación.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
