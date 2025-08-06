// Script para renombrar archivos HTML de /public/blog para que coincidan con el slug generado desde el <title>
// Ejecuta este script con Node.js desde la raíz del proyecto

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

// Función para generar slug igual que en tu proyecto
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

const blogDir = path.join(__dirname, '../public/blog')

fs.readdirSync(blogDir).forEach(file => {
  if (!file.endsWith('.html')) return
  const filePath = path.join(blogDir, file)
  const html = fs.readFileSync(filePath, 'utf8')
  const $ = cheerio.load(html)
  let title = $('title').text() || $('h1').first().text() || file.replace('.html', '')
  title = title.replace(' | hgaruna', '').trim()
  const slug = generateSlug(title)
  const newFileName = slug + '.html'
  if (file !== newFileName) {
    const newFilePath = path.join(blogDir, newFileName)
    if (!fs.existsSync(newFilePath)) {
      fs.renameSync(filePath, newFilePath)
      console.log(`Renombrado: ${file} -> ${newFileName}`)
    } else {
      console.warn(`Ya existe: ${newFileName}, omitiendo ${file}`)
    }
  }
})

console.log('Renombrado completado.')
