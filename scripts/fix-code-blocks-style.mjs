// Script para forzar el fondo oscuro y texto claro en bloques de código en todos los artículos
import fs from 'fs/promises';
import path from 'path';

const BLOG_DIR = path.resolve('public/blog');

const codeBlockRegex = /<pre(.*?)>([\s\S]*?)<\/pre>/gi;

async function fixCodeBlocksInFile(filePath) {
  let content = await fs.readFile(filePath, 'utf8');
  let changed = false;

  content = content.replace(codeBlockRegex, (match, preAttrs, inner) => {
    // Si ya tiene clase, la extendemos, si no, la agregamos
    let newPre;
    if (/class=["']([^"']*)["']/.test(preAttrs)) {
      newPre = match.replace(/class=["']([^"']*)["']/, (m, cls) => {
        if (cls.includes('article-content')) return m;
        return `class="${cls} article-content"`;
      });
    } else {
      newPre = `<pre class="article-content"${preAttrs}>${inner}</pre>`;
    }
    changed = true;
    return newPre;
  });

  if (changed) {
    await fs.writeFile(filePath, content, 'utf8');
    console.log('Actualizado:', filePath);
  }
}

async function main() {
  const files = await fs.readdir(BLOG_DIR);
  for (const file of files) {
    if (file.endsWith('.html')) {
      await fixCodeBlocksInFile(path.join(BLOG_DIR, file));
    }
  }
  console.log('Bloques de código actualizados en todos los artículos.');
}

main();
