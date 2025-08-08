import React from 'react'
import { FiLoader } from 'react-icons/fi'

export default function LoadingSpinner({ message = 'Cargando...', size = 'medium' }) {
  return (
    <div className={`loading-spinner ${size}`}>
      <FiLoader className="spinner-icon" />
      <span className="spinner-message">{message}</span>
    </div>
  )
}
