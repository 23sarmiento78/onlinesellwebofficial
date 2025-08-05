// Script to update all existing articles with modern styles

import { updateArticleStyles } from './modernArticleTemplate'

/**
 * Update all articles in the blog directory with modern styles
 * @returns {Promise<Object>} - Update results
 */
export const updateAllArticleStyles = async () => {
  const results = {
    total: 0,
    updated: 0,
    failed: 0,
    errors: []
  }

  try {
    // List of all article files to update
    const articleFiles = [
      'angular-18-nuevas-fu.html',
      'ansible-automatizaci.html', 
      'backup-y-recuperacion-de-datos.html',
      'cdn-content-delivery-networks.html',
      'chatbots-implementacion-practica.html',
      'cicd-automatizacin-d.html',
      'clean-architecture-principios-solid.html',
      'code-coverage-metricas-de-calidad.html',
      'code-splitting-divis.html',
      'computer-vision-en-aplicaciones-web.html',
      'content-security-policy-csp.html',
      'cqrs-command-query-r.html',
      'database-optimization-consultas-eficientes.html',
      'design-patterns-patrones-de-diseno.html',
      'docker-contenedores-.html',
      'edge-computing-compu.html',
      'estrategias-de-cach-.html',
      'google-cloud-functions-plataforma-serverless.html',
      'graphql-vs-rest-cund.html',
      'indices-de-base-de-datos-optimizacion.html',
      'jamstack-javascript-.html',
      'kubernetes-orquestacion-de-contenedores.html',
      'lazy-loading-carga-d.html',
      'linters-y-formatters.html',
      'machine-learning-par.html',
      'microservices-arquitectura-distribuida.html',
      'migrations-gestin-de.html',
      'monorepo-vs-polyrepo-estrategias.html',
      'nlp-procesamiento-de.html',
      'nodejs-22-nuevas-caracteristicas.html',
      'orm-vs-query-builder-ventajas-y-desventajas.html',
      'owasp-top-10-vulnerabilidades-web.html',
      'package-managers-npm-yarn-pnpm.html',
      'performance-testing-lighthouse-y-webpagetest.html',
      'postgresql-16-nuevas-funcionalidades.html',
      'profiling-analisis-de-rendimiento.html',
      'progressive-web-apps-pwa-en-2025.html',
      'react-19-nuevas-cara.html',
      'security-testing-owasp-y-herramientas.html',
      'sql-injection-preven.html',
      'sql-vs-nosql-decisiones-de-arquitectura.html',
      'svelte-vs-react-comparativa-completa.html',
      'terraform-infrastruc.html',
      'testing-de-accesibilidad-automatizado.html',
      'testing-de-apis-postman-y-newman.html',
      'testing-unitario-jest-y-vitest.html',
      'transacciones-distribuidas.html',
      'tree-shaking-eliminacion-de-codigo-muerto.html',
      'typescript-avanzado-.html',
      'vs-code-extensiones-esenciales.html',
      'webassembly-rendimie.html',
      'xss-prevention-cross-site-scripting.html'
    ]

    results.total = articleFiles.length

    console.log(`🎨 Starting style update for ${results.total} articles...`)

    // Process articles in batches to avoid overwhelming the system
    for (let i = 0; i < articleFiles.length; i += 3) {
      const batch = articleFiles.slice(i, i + 3)
      
      const batchPromises = batch.map(async (filename) => {
        try {
          // Fetch the original article
          const response = await fetch(`/blog/${filename}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}: ${response.status}`)
          }

          const originalHtml = await response.text()
          
          // Update styles
          const updatedHtml = updateArticleStyles(originalHtml)
          
          // Store updated version (in a real app, this would write to the file system)
          // For now, we'll store in localStorage for demonstration
          const updatedArticles = JSON.parse(localStorage.getItem('updatedArticleStyles') || '{}')
          updatedArticles[filename] = {
            originalSize: originalHtml.length,
            updatedSize: updatedHtml.length,
            updatedAt: new Date().toISOString(),
            content: updatedHtml
          }
          localStorage.setItem('updatedArticleStyles', JSON.stringify(updatedArticles))
          
          results.updated++
          console.log(`✅ Updated: ${filename}`)
          
        } catch (error) {
          results.failed++
          results.errors.push({
            file: filename,
            error: error.message
          })
          console.error(`❌ Failed to update ${filename}:`, error.message)
        }
      })

      await Promise.all(batchPromises)
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    console.log(`🎉 Style update completed!`)
    console.log(`✅ Updated: ${results.updated}`)
    console.log(`❌ Failed: ${results.failed}`)
    
    if (results.errors.length > 0) {
      console.log('❌ Errors:', results.errors)
    }

    // Save update summary
    const updateSummary = {
      ...results,
      timestamp: new Date().toISOString(),
      version: '2.0'
    }
    localStorage.setItem('articleStylesUpdateSummary', JSON.stringify(updateSummary))

    return results

  } catch (error) {
    console.error('❌ Critical error during style update:', error)
    throw error
  }
}

/**
 * Get the status of article style updates
 * @returns {Object|null} - Update status or null
 */
export const getStyleUpdateStatus = () => {
  try {
    const summary = localStorage.getItem('articleStylesUpdateSummary')
    return summary ? JSON.parse(summary) : null
  } catch (error) {
    console.error('Error getting update status:', error)
    return null
  }
}

/**
 * Get updated article content
 * @param {string} filename - Article filename
 * @returns {string|null} - Updated HTML content or null
 */
export const getUpdatedArticleContent = (filename) => {
  try {
    const updatedArticles = JSON.parse(localStorage.getItem('updatedArticleStyles') || '{}')
    return updatedArticles[filename]?.content || null
  } catch (error) {
    console.error('Error getting updated article:', error)
    return null
  }
}

/**
 * Download updated articles as a zip (simulation)
 * @returns {Promise<void>}
 */
export const downloadUpdatedArticles = async () => {
  try {
    const updatedArticles = JSON.parse(localStorage.getItem('updatedArticleStyles') || '{}')
    const fileCount = Object.keys(updatedArticles).length
    
    if (fileCount === 0) {
      alert('No hay artículos actualizados para descargar')
      return
    }

    // In a real implementation, this would create a zip file
    // For now, we'll create individual downloads or show a summary
    const summary = Object.entries(updatedArticles).map(([filename, data]) => ({
      filename,
      originalSize: data.originalSize,
      updatedSize: data.updatedSize,
      sizeDifference: data.updatedSize - data.originalSize,
      updatedAt: data.updatedAt
    }))

    const summaryJson = JSON.stringify(summary, null, 2)
    const blob = new Blob([summaryJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'updated-articles-summary.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log(`📁 Downloaded summary for ${fileCount} updated articles`)

  } catch (error) {
    console.error('Error downloading updated articles:', error)
    alert('Error al descargar los artículos actualizados')
  }
}

/**
 * Initialize style updates automatically
 */
export const initializeStyleUpdates = async () => {
  const status = getStyleUpdateStatus()
  
  // Check if we need to update styles
  if (!status || status.version !== '2.0') {
    console.log('🎨 Initializing article style updates...')
    try {
      await updateAllArticleStyles()
    } catch (error) {
      console.error('❌ Failed to initialize style updates:', error)
    }
  } else {
    console.log('✅ Article styles are up to date')
  }
}
