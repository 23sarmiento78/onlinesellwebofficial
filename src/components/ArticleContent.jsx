import React, { useEffect, useRef } from 'react'

export default function ArticleContent({ content }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current && content) {
      // Procesar el contenido HTML
      processContent()
    }
  }, [content])

  function processContent() {
    const container = contentRef.current
    if (!container) return

    // Remover elementos no deseados (head, meta, scripts, etc.)
    const unwantedElements = container.querySelectorAll('head, meta, title, script, style, link[rel="stylesheet"]')
    unwantedElements.forEach(el => el.remove())

    // Remover comentarios HTML
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_COMMENT,
      null,
      false
    )
    const comments = []
    let node
    while (node = walker.nextNode()) {
      comments.push(node)
    }
    comments.forEach(comment => comment.remove())

    // Añadir clases a los elementos para mejor styling
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((heading, index) => {
      heading.classList.add('content-heading')
      heading.id = `heading-${index}`
    })

    // Procesar imágenes
    const images = container.querySelectorAll('img')
    images.forEach(img => {
      img.classList.add('content-image')
      img.loading = 'lazy'
      
      // Envolver imágenes en figura
      if (!img.parentElement.classList.contains('content-figure')) {
        const figure = document.createElement('figure')
        figure.className = 'content-figure'
        img.parentNode.insertBefore(figure, img)
        figure.appendChild(img)
        
        // Añadir caption si hay alt text
        if (img.alt) {
          const caption = document.createElement('figcaption')
          caption.className = 'content-caption'
          caption.textContent = img.alt
          figure.appendChild(caption)
        }
      }
    })

    // Procesar código
    const codeBlocks = container.querySelectorAll('pre')
    codeBlocks.forEach(pre => {
      pre.classList.add('content-code-block')
    })

    const inlineCode = container.querySelectorAll('code')
    inlineCode.forEach(code => {
      if (!code.parentElement.classList.contains('content-code-block')) {
        code.classList.add('content-code-inline')
      }
    })

    // Procesar enlaces
    const links = container.querySelectorAll('a')
    links.forEach(link => {
      link.classList.add('content-link')
      if (link.hostname !== window.location.hostname) {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
      }
    })

    // Procesar listas
    const lists = container.querySelectorAll('ul, ol')
    lists.forEach(list => {
      list.classList.add('content-list')
    })

    // Procesar párrafos
    const paragraphs = container.querySelectorAll('p')
    paragraphs.forEach(p => {
      p.classList.add('content-paragraph')
    })

    // Procesar tablas
    const tables = container.querySelectorAll('table')
    tables.forEach(table => {
      table.classList.add('content-table')
      
      // Envolver tabla en contenedor scrollable
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div')
        wrapper.className = 'table-wrapper'
        table.parentNode.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }
    })

    // Procesar blockquotes
    const blockquotes = container.querySelectorAll('blockquote')
    blockquotes.forEach(quote => {
      quote.classList.add('content-blockquote')
    })
  }

  if (!content) {
    return (
      <div className="article-content">
        <div className="content-loading">
          <p>Cargando contenido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="article-content">
      <div 
        ref={contentRef}
        className="content-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}
