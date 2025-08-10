import React from 'react'
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

export default function ErrorMessage({ message, onRetry, showRetry = true }) {
  return (
    <div className="error-message">
      <div className="error-content">
        <FiAlertCircle className="error-icon" />
        <div className="error-text">
          <h3>Error</h3>
          <p>{message}</p>
        </div>
        {showRetry && onRetry && (
          <button className="retry-button" onClick={onRetry}>
            <FiRefreshCw />
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}
