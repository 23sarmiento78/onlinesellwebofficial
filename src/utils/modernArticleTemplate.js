// Modern article template with updated CSS styles

export const getModernArticleCSS = () => {
  return `
<style>
  /* Modern Article Styles - Updated Design */
  :root {
    --primary-color: #4f46e5;
    --primary-dark: #3730a3;
    --secondary-color: #1f2937;
    --accent-color: #10b981;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --bg-accent: #f3f4f6;
    --border-light: #e5e7eb;
    --border-medium: #d1d5db;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    line-height: 1.7;
    color: var(--text-primary);
    background: var(--bg-secondary);
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .article-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
    min-height: 100vh;
  }

  /* Header Styles */
  .article-header {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    padding: 4rem 2rem 3rem;
    margin: 0 -1rem 3rem;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    position: relative;
    overflow: hidden;
  }

  .article-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3e%3cg fill-opacity='0.1'%3e%3cpolygon fill='%23ffffff' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3e%3c/g%3e%3c/svg%3e") center/60px;
    opacity: 0.1;
  }

  .article-header-content {
    position: relative;
    z-index: 2;
    max-width: 700px;
  }

  .article-category {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .article-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .article-excerpt {
    font-size: 1.125rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    font-size: 0.875rem;
    opacity: 0.8;
  }

  .article-meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .article-meta-item i {
    opacity: 0.7;
  }

  /* Navigation */
  .article-nav {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .back-link:hover {
    gap: 0.75rem;
    color: var(--primary-dark);
  }

  /* Content Styles */
  .article-content {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    padding: 3rem;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-light);
    margin-bottom: 2rem;
  }

  .article-content h1,
  .article-content h2,
  .article-content h3,
  .article-content h4,
  .article-content h5,
  .article-content h6 {
    color: var(--text-primary);
    font-weight: 700;
    line-height: 1.3;
    margin: 2rem 0 1rem;
  }

  .article-content h1 {
    font-size: 2.25rem;
    border-bottom: 3px solid var(--primary-color);
    padding-bottom: 0.5rem;
  }

  .article-content h2 {
    font-size: 1.875rem;
    color: var(--primary-color);
    position: relative;
    padding-left: 1rem;
  }

  .article-content h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.5rem;
    width: 4px;
    height: 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    border-radius: 2px;
  }

  .article-content h3 {
    font-size: 1.5rem;
    color: var(--secondary-color);
  }

  .article-content h4 {
    font-size: 1.25rem;
    color: var(--text-primary);
  }

  .article-content p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: var(--text-primary);
  }

  .article-content a {
    color: var(--primary-color);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
    transition: all 0.2s ease;
  }

  .article-content a:hover {
    color: var(--primary-dark);
    text-decoration-color: var(--accent-color);
  }

  .article-content ul,
  .article-content ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  .article-content li {
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }

  .article-content li::marker {
    color: var(--primary-color);
  }

  /* Code Styles */
  .article-content pre {
    background: var(--bg-accent);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    overflow-x: auto;
    font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 2rem 0;
    position: relative;
  }

  .article-content pre::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }

  .article-content code {
    background: var(--bg-accent);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
    font-size: 0.875rem;
    border: 1px solid var(--border-light);
    color: var(--primary-dark);
  }

  .article-content pre code {
    background: none;
    padding: 0;
    border: none;
    color: var(--text-primary);
  }

  /* Blockquotes */
  .article-content blockquote {
    border-left: 4px solid var(--primary-color);
    background: var(--bg-secondary);
    padding: 1.5rem 2rem;
    margin: 2rem 0;
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    font-style: italic;
    position: relative;
  }

  .article-content blockquote::before {
    content: '"';
    font-size: 4rem;
    color: var(--primary-color);
    position: absolute;
    top: -0.5rem;
    left: 1rem;
    opacity: 0.3;
    font-family: serif;
  }

  /* Images */
  .article-content img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    margin: 2rem 0;
    border: 1px solid var(--border-light);
  }

  /* Tables */
  .article-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .article-content th,
  .article-content td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-light);
  }

  .article-content th {
    background: var(--primary-color);
    color: white;
    font-weight: 600;
  }

  .article-content tr:nth-child(even) {
    background: var(--bg-secondary);
  }

  /* Tags Section */
  .article-tags {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-top: 2rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
  }

  .article-tags h3 {
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-size: 1.125rem;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .tag {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }

  .tag:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--accent-color);
  }

  /* Footer */
  .article-footer {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    text-align: center;
  }

  .article-footer p {
    color: var(--text-secondary);
    font-style: italic;
    margin: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .article-container {
      padding: 0 0.5rem;
    }

    .article-header {
      padding: 3rem 1.5rem 2rem;
      margin: 0 -0.5rem 2rem;
    }

    .article-title {
      font-size: 2rem;
    }

    .article-content {
      padding: 2rem 1.5rem;
    }

    .article-meta {
      gap: 1rem;
    }

    .article-content pre {
      padding: 1rem;
      font-size: 0.8rem;
    }

    .tags-list {
      gap: 0.5rem;
    }

    .tag {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .article-header {
      padding: 2rem 1rem 1.5rem;
    }

    .article-title {
      font-size: 1.75rem;
    }

    .article-content {
      padding: 1.5rem 1rem;
    }

    .article-content h1 {
      font-size: 1.75rem;
    }

    .article-content h2 {
      font-size: 1.5rem;
    }
  }

  /* Print Styles */
  @media print {
    .article-nav,
    .article-tags,
    .article-footer {
      display: none;
    }

    .article-header {
      background: none !important;
      color: black !important;
      padding: 1rem 0;
    }

    .article-content {
      box-shadow: none;
      padding: 0;
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    :root {
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --text-muted: #9ca3af;
      --bg-primary: #1f2937;
      --bg-secondary: #111827;
      --bg-accent: #374151;
      --border-light: #374151;
      --border-medium: #4b5563;
    }

    .article-content code {
      color: #e5e7eb;
    }
  }
</style>
`;
}

/**
 * Update article HTML with modern styles
 * @param {string} originalHtml - Original article HTML
 * @returns {string} - Updated HTML with modern styles
 */
export const updateArticleStyles = (originalHtml) => {
  // Parse the HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(originalHtml, 'text/html')
  
  // Remove old stylesheets and Bootstrap
  const oldStyles = doc.querySelectorAll('link[rel="stylesheet"], style')
  oldStyles.forEach(style => style.remove())
  
  // Add modern CSS
  const modernCSS = getModernArticleCSS()
  const styleElement = doc.createElement('style')
  styleElement.innerHTML = modernCSS
  doc.head.appendChild(styleElement)
  
  // Update body structure with modern layout
  const body = doc.body
  const originalContent = body.innerHTML
  
  // Wrap content in modern structure
  body.innerHTML = `
    <div class="article-container">
      <nav class="article-nav">
        <a href="/blog" class="back-link">
          <i class="fas fa-arrow-left"></i>
          Volver al Blog
        </a>
      </nav>
      
      ${originalContent}
    </div>
  `
  
  // Update existing article structure
  const existingHeader = body.querySelector('.article-header')
  if (existingHeader) {
    existingHeader.classList.add('article-header')
    
    // Add header content wrapper
    const headerContent = existingHeader.innerHTML
    existingHeader.innerHTML = `<div class="article-header-content">${headerContent}</div>`
  }
  
  // Wrap main content
  const mainContent = body.querySelector('.article-content') || 
                     body.querySelector('main') || 
                     body.querySelector('article')
  
  if (mainContent && !mainContent.classList.contains('article-content')) {
    mainContent.classList.add('article-content')
  }
  
  // Add FontAwesome for icons
  const fontAwesome = doc.createElement('link')
  fontAwesome.rel = 'stylesheet'
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
  doc.head.appendChild(fontAwesome)
  
  return doc.documentElement.outerHTML
}
