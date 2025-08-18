// Script para copiar artículos y datos generados a la carpeta dist antes del build
import fs from 'fs-extra';
import path from 'path';

const srcBlog = path.join(process.cwd(), 'public', 'blog');
const distBlog = path.join(process.cwd(), 'dist', 'blog');
const srcData = path.join(process.cwd(), 'public', 'data');
const distData = path.join(process.cwd(), 'dist', 'data');

async function copyGeneratedContent() {
  await fs.ensureDir(distBlog);
  await fs.ensureDir(distData);
  await fs.copy(srcBlog, distBlog, { overwrite: true });
  await fs.copy(srcData, distData, { overwrite: true });
  console.log('Artículos y datos copiados a dist/ para el deploy.');
}

copyGeneratedContent();
