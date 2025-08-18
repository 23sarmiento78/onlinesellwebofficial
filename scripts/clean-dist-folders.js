// Script para limpiar la carpeta dist/blog y dist/data antes de copiar los archivos generados
import fs from 'fs-extra';
import path from 'path';

const distBlog = path.join(process.cwd(), 'dist', 'blog');
const distData = path.join(process.cwd(), 'dist', 'data');

async function cleanDistFolders() {
  if (await fs.pathExists(distBlog)) {
    await fs.emptyDir(distBlog);
    console.log('dist/blog limpiado.');
  }
  if (await fs.pathExists(distData)) {
    await fs.emptyDir(distData);
    console.log('dist/data limpiado.');
  }
}

cleanDistFolders();
