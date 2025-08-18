// Script para automatizar el workflow de actualización de imágenes y regeneración del índice
import { execSync } from 'child_process';

try {
  console.log('Ejecutando actualización de imágenes en artículos...');
  execSync('node scripts/update-articles-with-pexels.js', { stdio: 'inherit' });
  console.log('Actualización de imágenes completada.');

  console.log('Regenerando blog-index.json...');
  execSync('node scripts/regenerate-blog-index.js', { stdio: 'inherit' });
  console.log('Regeneración de blog-index.json completada.');

  console.log('Workflow de imágenes y blog-index finalizado correctamente.');
} catch (err) {
  console.error('Error en el workflow:', err);
  process.exit(1);
}
