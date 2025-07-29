const fs = require('fs');
const path = require('path');

// Rutas
const blogDir = path.join(__dirname, '../public/blog');
const outputPath = path.join(blogDir, 'ebook_final.html');
const templatePath = path.join(__dirname, 'ebook-template.html');

// Función principal
(async () => {
  try {
    // Leer archivos HTML (excluye ebook_final.html)
    const files = fs.readdirSync(blogDir)
      .filter(f => f.endsWith('.html') && f !== 'ebook_final.html')
      .sort();

    if (files.length === 0) {
      console.warn('⚠️ No se encontraron artículos HTML para el eBook.');
      process.exit(0);
    }

    // Leer y unir artículos (eliminando etiquetas <img>)
    const articulos = files.map(filename => {
      const filepath = path.join(blogDir, filename);
      const content = fs.readFileSync(filepath, 'utf-8');

      // 🔴 Eliminar todas las etiquetas <img ... >
      const contenidoLimpio = content.replace(/<img[^>]*>/gi, '');

      return `<article>\n${contenidoLimpio}\n</article>`;
    }).join('\n\n');

    // Leer plantilla
    const plantilla = fs.readFileSync(templatePath, 'utf-8');
    const htmlFinal = plantilla.replace('{{ARTICULOS}}', articulos);

    // Guardar resultado
    fs.writeFileSync(outputPath, htmlFinal);
    console.log(`✅ eBook generado exitosamente: ${outputPath}`);
  } catch (err) {
    console.error('❌ Error generando el eBook:', err);
    process.exit(1);
  }
})();
