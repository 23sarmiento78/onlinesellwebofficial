import React, { useState, useEffect } from 'react'
import { FiList } from 'react-icons/fi'

export default function ArticleNavigation() {
  const [headings, setHeadings] = useState([])
  const [activeHeading, setActiveHeading] = useState('')

  useEffect(() => {
    // Extraer encabezados del contenido
    const extractHeadings = () => {
      const headingElements = document.querySelectorAll('.content-body h1, .content-body h2, .content-body h3, .content-body h4')
      const headingsList = Array.from(headingElements).map((heading, index) => {
        // Asegurar que tenga un ID
        if (!heading.id) {
          heading.id = `heading-${index}`
        }
        
        return {
          id: heading.id,
          text: heading.textContent,
          level: parseInt(heading.tagName.charAt(1)),
          element: heading
        }
      })
      
      setHeadings(headingsList)
    }

    // Observar cambios en el DOM para detectar cuando se carga el contenido
    const observer = new MutationObserver(() => {
      extractHeadings()
    })

    observer.observe(document.body, { childList: true, subtree: true })
    
    // Extracción inicial
    setTimeout(extractHeadings, 500)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    // Observador de intersección para detectar el encabezado activo
    const observerOptions = {
      rootMargin: '-10% 0px -80% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id)
        }
      })
    }, observerOptions)

    headings.forEach(heading => {
      if (heading.element) {
        observer.observe(heading.element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  function scrollToHeading(headingId) {
    const element = document.getElementById(headingId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="article-navigation">
      <div className="nav-header">
        <FiList className="nav-icon" />
        <h3>Contenido</h3>
      </div>
      
      <ul className="nav-list">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            className={`nav-item nav-level-${heading.level} ${
              activeHeading === heading.id ? 'active' : ''
            }`}
          >
            <button
              className="nav-link"
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
