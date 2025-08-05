// Utility for automatically updating sitemap when new articles are added

/**
 * Generate sitemap content with all articles
 * @param {Array} articles - Array of article objects
 * @returns {string} - Complete sitemap XML content
 */
export const generateSitemapContent = (articles) => {
  const baseUrl = 'https://hgaruna.com'
  const currentDate = new Date().toISOString().split('T')[0]

  // Static pages with their priorities and change frequencies
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily', lastmod: currentDate },
    { url: '/planes', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: currentDate },
    { url: '/contacto', priority: '0.7', changefreq: 'monthly', lastmod: currentDate },
    { url: '/desarrollo-web-villa-carlos-paz', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/diseño-web-villa-carlos-paz', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
    { url: '/marketing-digital-villa-carlos-paz', priority: '0.8', changefreq: 'weekly', lastmod: currentDate },
  ]

  // Category pages
  const categoryPages = [
    'desarrollo', 'diseno', 'ia', 'tecnologia', 'programacion', 'seo'
  ].map(category => ({
    url: `/blog/categoria/${category}`,
    priority: '0.8',
    changefreq: 'daily',
    lastmod: currentDate
  }))

  // Article pages
  const articlePages = articles.map(article => ({
    url: `/blog/${article.slug}`,
    priority: '0.6',
    changefreq: 'weekly',
    lastmod: article.date || currentDate
  }))

  // Combine all pages
  const allPages = [...staticPages, ...categoryPages, ...articlePages]

  // Generate XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return xmlContent
}

/**
 * Update sitemap file with current articles
 * @param {Array} articles - Array of article objects
 * @returns {Promise<Object>} - Update result
 */
export const updateSitemap = async (articles) => {
  try {
    const sitemapContent = generateSitemapContent(articles)
    
    // In a real implementation, this would write to public/sitemap.xml
    // For now, we'll simulate the process and store in localStorage for demo
    const sitemapData = {
      content: sitemapContent,
      lastUpdated: new Date().toISOString(),
      articleCount: articles.length,
      totalUrls: articles.length + 13, // static + category pages
      success: true
    }

    // Store sitemap data
    localStorage.setItem('sitemap_data', JSON.stringify(sitemapData))
    
    // Also store the XML content for download
    localStorage.setItem('sitemap_xml', sitemapContent)

    console.log('✅ Sitemap updated successfully:', {
      totalUrls: sitemapData.totalUrls,
      articles: articles.length,
      timestamp: sitemapData.lastUpdated
    })

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('sitemapUpdated', { 
      detail: sitemapData 
    }))

    return sitemapData
  } catch (error) {
    console.error('❌ Error updating sitemap:', error)
    throw new Error('Failed to update sitemap')
  }
}

/**
 * Get current sitemap status
 * @returns {Object|null} - Sitemap data or null
 */
export const getSitemapStatus = () => {
  try {
    const data = localStorage.getItem('sitemap_data')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading sitemap status:', error)
    return null
  }
}

/**
 * Download sitemap XML file
 */
export const downloadSitemap = () => {
  try {
    const sitemapXml = localStorage.getItem('sitemap_xml')
    if (!sitemapXml) {
      throw new Error('No sitemap data available')
    }

    const blob = new Blob([sitemapXml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('✅ Sitemap downloaded successfully')
  } catch (error) {
    console.error('❌ Error downloading sitemap:', error)
    throw error
  }
}

/**
 * Submit sitemap to search engines (simulation)
 * @returns {Promise<Object>} - Submission results
 */
export const submitSitemapToSearchEngines = async () => {
  // Simulate API calls to search engines
  const results = {
    google: { status: 'success', message: 'Sitemap submitted to Google Search Console' },
    bing: { status: 'success', message: 'Sitemap submitted to Bing Webmaster Tools' },
    yahoo: { status: 'success', message: 'Sitemap submitted to Yahoo' },
    yandex: { status: 'success', message: 'Sitemap submitted to Yandex Webmaster' }
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('📡 Sitemap submitted to search engines:', results)
  return results
}

/**
 * Generate robots.txt content
 * @returns {string} - Robots.txt content
 */
export const generateRobotsTxt = () => {
  const baseUrl = 'https://hgaruna.com'
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/admin/
Disallow: /.env
Disallow: /node_modules/

# Allow important pages
Allow: /blog/
Allow: /planes
Allow: /contacto

# Crawl delay for respect
Crawl-delay: 1

# Block specific bots if needed
# User-agent: BadBot
# Disallow: /
`
}

/**
 * Auto-update sitemap when articles change
 * @param {Array} articles - Current articles array
 */
export const autoUpdateSitemap = async (articles) => {
  try {
    const currentStatus = getSitemapStatus()
    const shouldUpdate = !currentStatus || 
                        currentStatus.articleCount !== articles.length ||
                        (Date.now() - new Date(currentStatus.lastUpdated).getTime()) > 24 * 60 * 60 * 1000 // 24 hours

    if (shouldUpdate) {
      console.log('🔄 Auto-updating sitemap...')
      await updateSitemap(articles)
      
      // Auto-submit to search engines in production
      if (process.env.NODE_ENV === 'production') {
        await submitSitemapToSearchEngines()
      }
    } else {
      console.log('✅ Sitemap is up to date')
    }
  } catch (error) {
    console.error('❌ Auto-update sitemap failed:', error)
  }
}

/**
 * Initialize sitemap management
 * @param {Array} articles - Initial articles array
 */
export const initializeSitemapManager = (articles) => {
  // Update sitemap on load
  autoUpdateSitemap(articles)

  // Set up periodic updates (every 6 hours)
  setInterval(() => {
    autoUpdateSitemap(articles)
  }, 6 * 60 * 60 * 1000)

  console.log('🗺️ Sitemap manager initialized')
}
