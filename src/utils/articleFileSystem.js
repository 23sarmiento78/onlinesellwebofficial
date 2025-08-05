// Utility functions for managing articles in the file system

// Generate article filename from title
export const generateFileName = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50) // Limit filename length
}

// Generate article slug from title
export const generateSlug = (title) => {
  return generateFileName(title)
}

// Create HTML content for article
export const createArticleHTML = (article) => {
  const currentDate = new Date().toISOString().split('T')[0]
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} | hgaruna</title>
    <meta name="description" content="${article.excerpt}">
    <meta name="keywords" content="${article.tags ? article.tags.join(', ') : ''}">
    <meta name="author" content="${article.author}">
    <meta name="article:published_time" content="${article.date}">
    <meta name="article:section" content="${article.category}">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.excerpt}">
    <meta property="og:image" content="${article.image}">
    <meta property="og:type" content="article">
    <link rel="canonical" href="https://hgaruna.com/blog/${article.slug}">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .article-header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .article-meta {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        .article-title {
            color: #2c3e50;
            margin-bottom: 1rem;
            font-size: 2.5rem;
            font-weight: 700;
        }
        .article-excerpt {
            color: #555;
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        .article-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        .article-content {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .article-tags {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #eee;
        }
        .tag {
            display: inline-block;
            background: #4f46e5;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-right: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .back-link {
            display: inline-block;
            color: #4f46e5;
            text-decoration: none;
            margin-bottom: 2rem;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            .article-header, .article-content {
                padding: 1.5rem;
            }
            .article-title {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <a href="/blog" class="back-link">← Volver al Blog</a>
    
    <article>
        <header class="article-header">
            <div class="article-meta">
                <time datetime="${article.date}">${new Date(article.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</time>
                • ${article.readTime}
                • Por ${article.author}
                • ${article.category}
            </div>
            <h1 class="article-title">${article.title}</h1>
            <p class="article-excerpt">${article.excerpt}</p>
            <img src="${article.image}" alt="${article.title}" class="article-image">
        </header>

        <div class="article-content">
            ${article.content || '<p>Contenido del artículo se genera aquí...</p>'}
        </div>

        ${article.tags && article.tags.length > 0 ? `
        <div class="article-tags">
            <strong>Etiquetas:</strong><br>
            ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
        ` : ''}
    </article>

    <script>
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            // Track reading time
            const startTime = Date.now();
            
            window.addEventListener('beforeunload', function() {
                const readingTime = Math.round((Date.now() - startTime) / 1000);
                if (readingTime > 10) {
                    // Could send analytics data here
                    console.log('Reading time:', readingTime, 'seconds');
                }
            });
        });
    </script>
</body>
</html>`
}

// Create markdown content for article
export const createArticleMarkdown = (article) => {
  return `---
title: "${article.title}"
date: "${article.date}"
author: "${article.author}"
category: "${article.category}"
excerpt: "${article.excerpt}"
image: "${article.image}"
slug: "${article.slug}"
readTime: "${article.readTime}"
tags: [${article.tags ? article.tags.map(tag => `"${tag}"`).join(', ') : ''}]
---

# ${article.title}

${article.excerpt}

![${article.title}](${article.image})

${article.content || 'Contenido del artículo se genera aquí...'}

---

**Etiquetas:** ${article.tags ? article.tags.map(tag => `#${tag}`).join(' ') : ''}

**Autor:** ${article.author}  
**Fecha:** ${new Date(article.date).toLocaleDateString('es-ES')}  
**Tiempo de lectura:** ${article.readTime}
`
}

// Save article to public/blog directory (simulation)
export const saveArticleToFile = async (article, format = 'html') => {
  try {
    const fileName = generateFileName(article.title)
    const content = format === 'html' 
      ? createArticleHTML(article) 
      : createArticleMarkdown(article)
    
    // In a real implementation, you would use Node.js fs or a server endpoint
    // For now, we'll simulate the save and provide the content
    
    const fileData = {
      fileName: `${fileName}.${format}`,
      content: content,
      path: `public/blog/${fileName}.${format}`,
      url: `/blog/${fileName}.${format}`,
      success: true,
      message: `Artículo guardado como ${fileName}.${format}`
    }
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store in localStorage for persistence in this demo
    const savedArticles = JSON.parse(localStorage.getItem('savedArticleFiles') || '[]')
    savedArticles.push(fileData)
    localStorage.setItem('savedArticleFiles', JSON.stringify(savedArticles))
    
    return fileData
  } catch (error) {
    console.error('Error saving article to file:', error)
    throw new Error('No se pudo guardar el artículo')
  }
}

// Get list of saved article files
export const getSavedArticleFiles = () => {
  return JSON.parse(localStorage.getItem('savedArticleFiles') || '[]')
}

// Download article file
export const downloadArticleFile = (article, format = 'html') => {
  const fileName = generateFileName(article.title)
  const content = format === 'html' 
    ? createArticleHTML(article) 
    : createArticleMarkdown(article)
  
  const blob = new Blob([content], { type: format === 'html' ? 'text/html' : 'text/markdown' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.${format}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Get articles by category from saved files
export const getArticleFilesByCategory = (category) => {
  const savedFiles = getSavedArticleFiles()
  return savedFiles.filter(file => {
    // Extract category from content or filename
    return file.content.includes(`"category": "${category}"`) || 
           file.content.includes(`category: "${category}"`)
  })
}
