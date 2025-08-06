// Script para reemplazar el bloque <style>...</style> de todos los artículos por el del template actualizado
import fs from 'fs/promises';
import path from 'path';

const BLOG_DIR = path.resolve('public/blog');
const TEMPLATE_PATH = path.resolve('templates/modern-article-template.html');

async function getTemplateStyleBlock() {
  const template = await fs.readFile(TEMPLATE_PATH, 'utf8');
  const match = template.match(/<style[\s\S]*?<\/style>/i);
  if (!match) throw new Error('No se encontró el bloque <style> en el template');
  return match[0];
}

async function replaceStyleInFile(filePath, styleBlock) {
  let content = await fs.readFile(filePath, 'utf8');
  // Reemplaza el primer bloque <style>...</style> por el nuevo
  const newContent = content.replace(/<style[\s\S]*?<\/style>/i, styleBlock);
  if (newContent !== content) {
    await fs.writeFile(filePath, newContent, 'utf8');
    console.log('Estilos actualizados en:', filePath);
  }
}

async function main() {
  const styleBlock = await getTemplateStyleBlock();
  const files = await fs.readdir(BLOG_DIR);
  for (const file of files) {
    if (file.endsWith('.html')) {
      await replaceStyleInFile(path.join(BLOG_DIR, file), styleBlock);
    }
  }
  console.log('Todos los estilos de artículos han sido actualizados.');
}

main();
