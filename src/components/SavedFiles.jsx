import React, { useState, useEffect } from 'react'
import { getSavedArticleFiles, downloadArticleFile } from '@utils/articleFileSystem'

export default function SavedFiles() {
  const [savedFiles, setSavedFiles] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const loadSavedFiles = () => {
      const files = getSavedArticleFiles()
      setSavedFiles(files)
    }

    loadSavedFiles()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadSavedFiles()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for when new files are saved
    window.addEventListener('articleFileSaved', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('articleFileSaved', handleStorageChange)
    }
  }, [])

  const handleDownload = (file) => {
    const blob = new Blob([file.content], { 
      type: file.fileName.endsWith('.html') ? 'text/html' : 'text/markdown' 
    })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = file.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAllFiles = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los archivos guardados?')) {
      localStorage.removeItem('savedArticleFiles')
      setSavedFiles([])
    }
  }

  const formatFileSize = (content) => {
    const bytes = new Blob([content]).size
    return bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} KB`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (savedFiles.length === 0) {
    return (
      <div className="saved-files-empty">
        <div className="text-center p-6 bg-secondary rounded-lg border border-light">
          <i className="fas fa-folder-open text-4xl text-muted mb-3"></i>
          <h3 className="text-lg font-semibold mb-2">No hay archivos guardados</h3>
          <p className="text-muted text-sm">
            Los artículos generados se guardarán automáticamente y aparecerán aquí.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="saved-files">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <i className="fas fa-file-alt mr-2"></i>
          Archivos Guardados ({savedFiles.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-ghost"
          >
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </button>
          {savedFiles.length > 0 && (
            <button
              onClick={clearAllFiles}
              className="btn btn-sm btn-outline text-red-600 hover:bg-red-50"
            >
              <i className="fas fa-trash mr-1"></i>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3">
          {savedFiles.map((file, index) => (
            <div key={index} className="file-item bg-secondary rounded-lg p-4 border border-light">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`fas ${file.fileName.endsWith('.html') ? 'fa-code' : 'fa-markdown'} text-primary`}></i>
                    <span className="font-medium text-sm">{file.fileName}</span>
                    <span className="text-xs text-muted">{formatFileSize(file.content)}</span>
                  </div>
                  
                  <div className="text-xs text-muted mb-2">
                    <i className="fas fa-folder mr-1"></i>
                    {file.path}
                  </div>

                  {file.message && (
                    <div className="text-xs text-success bg-success/10 px-2 py-1 rounded">
                      <i className="fas fa-check-circle mr-1"></i>
                      {file.message}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleDownload(file)}
                    className="btn btn-xs btn-primary"
                    title="Descargar archivo"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  
                  {file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-outline"
                      title="Ver archivo"
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isExpanded && (
        <div className="saved-files-preview">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {savedFiles.slice(0, 4).map((file, index) => (
              <div key={index} className="file-preview bg-secondary rounded-lg p-3 border border-light">
                <div className="flex items-center gap-2 mb-2">
                  <i className={`fas ${file.fileName.endsWith('.html') ? 'fa-code' : 'fa-markdown'} text-primary`}></i>
                  <span className="text-xs font-medium truncate">{file.fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{formatFileSize(file.content)}</span>
                  <button
                    onClick={() => handleDownload(file)}
                    className="text-xs text-primary hover:text-primary-dark"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              </div>
            ))}
            {savedFiles.length > 4 && (
              <div className="file-preview bg-light rounded-lg p-3 border border-light flex items-center justify-center">
                <span className="text-xs text-muted">
                  +{savedFiles.length - 4} más
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
