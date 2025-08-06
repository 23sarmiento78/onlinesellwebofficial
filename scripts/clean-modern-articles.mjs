// Script para limpiar duplicados y mejorar la sección de relacionados en los artículos modernos
// - Elimina duplicados de título, excerpt, etc. en el body
// - Corrige la sección de Artículos Relacionados para que use solo el bloque HTML estilizado
// - Corrige doble imagen destacada
// - Mejora los estilos de bloques de código (Prism.js)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../public/blog');

function cleanArticle(html) {
  // 1. Eliminar duplicados de título, excerpt, etc. en el body
  html = html.replace(/(<main[\s\S]*?<article class="article-content[\s\S]*?<\/article>)[\s\S]*?(<section class="author-bio|<section class="article-cta|<section class="related-articles)/i, '$1$2');

  // 2. Eliminar repeticiones de título, excerpt, imagen, etc. en el body (fuera de header)
  html = html.replace(/(<main[\s\S]*?<header[\s\S]*?<\/header>)([\s\S]*?)<article class="article-content/i, '$1\n<article class="article-content');

  // 3. Eliminar doble imagen destacada (solo dejar la de .article-image)
  html = html.replace(/(<div class="article-image[\s\S]*?<\/div>)[\s\S]*?(<article class="article-content)/i, '$1\n$2');

  // 4. Mejorar la sección de Artículos Relacionados: solo dejar el bloque estilizado
  html = html.replace(/<section class="related-articles[\s\S]*?<\/section>/gi, match => {
    // Mantener solo el bloque .related-articles y sus hijos directos
    const block = match.match(/<section class="related-articles[\s\S]*?<\/section>/i);
    return block ? block[0] : '';
  });

  // 5. Mejorar los estilos de bloques de código (Prism.js)
  // Asegura que los <pre><code> tengan la clase language-*
  html = html.replace(/<pre><code>/g, '<pre><code class="language-js">');

  // 6. Eliminar placeholders tipo {{RELATED_1_TITLE}} si quedaron
  html = html.replace(/\{\{[^}]+\}\}/g, '');

  return html;
}

function main() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanArticle(html);
    fs.writeFileSync(filePath, cleaned, 'utf8');
    console.log('Limpio:', file);
  }
  console.log('¡Todos los artículos han sido limpiados y mejorados!');
}

main();
