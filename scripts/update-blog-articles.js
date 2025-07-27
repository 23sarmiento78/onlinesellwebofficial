const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Paths
const BLOG_DIR = path.join(__dirname, '..', 'public', 'blog');
const TEMPLATE_PATH = path.join(__dirname, '..', 'templates', 'article-template.html');

// Read the template
const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Get all HTML files in the blog directory
const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.html'));

// Process each file
files.forEach(file => {
    try {
        const filePath = path.join(BLOG_DIR, file);
        const html = fs.readFileSync(filePath, 'utf8');
        
        // Load the HTML with cheerio
        const $ = cheerio.load(html);
        
        // Extract metadata from the current article
        const title = $('h1').first().text().trim() || 'Artículo sin título';
        let content = $('article').html() || $('main').html() || $('body').html();
        const date = $('meta[property="article:published_time"]').attr('content') || 
                    $('time').first().attr('datetime') || 
                    new Date().toISOString().split('T')[0];
        
        // Extract categories/tags
        const categories = [];
        $('.post-categories a, .categories a, .tags a, [rel="category tag"]').each((i, el) => {
            categories.push($(el).text().trim());
        });
        
        // Remove category links from content to avoid duplication
        $('.post-categories, .categories, .tags, .entry-meta').remove();
        content = $('article').html() || $('main').html() || $('body').html();
        
        // Extract image if exists
        let image = $('meta[property="og:image"]').attr('content') || $('img').first().attr('src') || '';
        
        // Extract description
        const description = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') ||
                          'Artículo sobre desarrollo web y tecnología';
        
        // Extract keywords
        const keywords = $('meta[name="keywords"]').attr('content') || 
                        categories.join(', ') || 'desarrollo web, programación, tecnología';
        
        // Extract author
        const author = $('meta[name="author"]').attr('content') || 'hgaruna';
        
        // Generate the new HTML with the template
        let newHtml = template
            .replace(/\{\{SEO_TITLE\}\}/g, title)
            .replace(/\{\{ARTICLE_TITLE\}\}/g, title)
            .replace(/\{\{ARTICLE_CONTENT\}\}/g, content || '')
            .replace(/\{\{PUBLICATION_DATE\}\}/g, formatDate(date))
            .replace(/\{\{AUTHOR\}\}/g, author)
            .replace(/\{\{FEATURED_IMAGE\}\}/g, image)
            .replace(/\{\{FEATURED_IMAGE_ALT\}\}/g, title)
            .replace(/\{\{SEO_DESCRIPTION\}\}/g, description)
            .replace(/\{\{SEO_KEYWORDS\}\}/g, keywords)
            .replace(/\{\{CANONICAL_URL\}\}/g, `https://tudominio.com/blog/${file}`)
            .replace(/\{\{SHARE_TEXT\}\}/g, `Mira este artículo: ${title}`)
            .replace(/\{\{READING_TIME\}\}/g, calculateReadingTime(content || ''))
            .replace(/\{\{AUTHOR_IMAGE\}\}/g, '/ruta/a/la/imagen/del/autor.jpg')
            .replace(/\{\{AUTHOR_BIO\}\}/g, 'Experto en desarrollo web y tecnología')
            .replace(/\{\{AUTHOR_SOCIAL\}\}/g, JSON.stringify([
                { platform: 'twitter', url: 'https://twitter.com/tu-usuario' },
                { platform: 'linkedin', url: 'https://linkedin.com/in/tu-perfil' },
                { platform: 'github', url: 'https://github.com/tu-usuario' }
            ]).replace(/"/g, '&quot;'));
            
        // Handle tags section
        if (categories.length > 0) {
            const tagsHtml = `
                <div class="article-tags mt-4">
                    <h4>Categorías:</h4>
                    <div class="tags-list">
                        ${categories.map(tag => 
                            `<a href="/blog/category/${tag.toLowerCase().replace(/\s+/g, '-')}" class="tag">${tag}</a>`
                        ).join('\n')}
                    </div>
                </div>`;
            newHtml = newHtml.replace(/\{\{#TAGS\}\}[\s\S]*?\{\{\/TAGS\}\}/, tagsHtml);
        } else {
            newHtml = newHtml.replace(/\{\{#TAGS\}\}[\s\S]*?\{\{\/TAGS\}\}/, '');
        }
        
        // Save the updated file
        fs.writeFileSync(filePath, newHtml);
        console.log(`✅ Updated: ${file}`);
        
    } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
    }
});

console.log('\n🎉 Todos los artículos han sido actualizados!');

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
}

// Helper function to estimate reading time
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
}
