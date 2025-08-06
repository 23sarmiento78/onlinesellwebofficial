// Script para generar index.json con los metadatos de todos los artículos HTML en /public/blog
// Ejecuta este script con Node.js desde la raíz del proyecto

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

const blogDir = path.join(__dirname, '../public/blog')
const indexPath = path.join(blogDir, 'index.json')

const articles = []

fs.readdirSync(blogDir).forEach(file => {
  if (!file.endsWith('.html')) return
  const filePath = path.join(blogDir, file)
  const html = fs.readFileSync(filePath, 'utf8')
  const $ = cheerio.load(html)
  let title = $('title').text() || $('h1').first().text() || file.replace('.html', '')
  title = title.replace(' | hgaruna', '').trim()
  const slug = generateSlug(title)
  const excerpt = $('meta[name="description"]').attr('content') || $('p').first().text().slice(0, 150)
  const author = $('meta[name="author"]').attr('content') || 'hgaruna'
  const date = $('meta[name="article:published_time"]').attr('content') || new Date().toISOString().split('T')[0]
  const category = $('meta[name="category"]').attr('content') || 'desarrollo'
  const tags = ($('meta[name="keywords"]').attr('content') || '').split(',').map(t => t.trim()).filter(Boolean)
  const image = $('meta[property="og:image"]').attr('content') || '/logos-he-imagenes/programacion.jpeg'
  articles.push({
    slug,
    title,
    excerpt,
    author,
    date,
    category,
    tags,
    image,
    file: file
  })
})

fs.writeFileSync(indexPath, JSON.stringify(articles, null, 2), 'utf8')
console.log(`Index generado con ${articles.length} artículos en ${indexPath}`)
