import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'public', 'blog');
const GENERATED_EDU_DIR = path.join(__dirname, 'generated-html');
const GENERATED_TUT_DIR = path.join(__dirname, 'generated-tutorials');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'article-template.html');

async function maybeWrapWithTemplate(html) {
  try {
    // Si ya es un documento HTML completo, devolver igual
    if (/<html[\s>]/i.test(html)) return html;

    // Intentar cargar template
    const exists = await fs.pathExists(TEMPLATE_PATH);
    if (!exists) return html; // sin template, dejar como está

    const tpl = await fs.readFile(TEMPLATE_PATH, 'utf8');
    const content = tpl.includes('{{CONTENT}}') ? tpl.replace('{{CONTENT}}', html) : tpl.replace('</body>', `${html}\n</body>`);
    return content;
  } catch {
    return html;
  }
}

async function publishFromDir(dir) {
  const exists = await fs.pathExists(dir);
  if (!exists) return 0;
  const files = (await fs.readdir(dir)).filter(f => f.toLowerCase().endsWith('.html'));
  let count = 0;
  await fs.ensureDir(BLOG_DIR);

  for (const file of files) {
    const src = path.join(dir, file);
    const dst = path.join(BLOG_DIR, file);
    let html = await fs.readFile(src, 'utf8');
    html = await maybeWrapWithTemplate(html);
    await fs.writeFile(dst, html, 'utf8');
    console.log(`📦 Publicado: ${file} -> public/blog/${file}`);
    count++;
  }
  return count;
}

async function main() {
  try {
    const edu = await publishFromDir(GENERATED_EDU_DIR);
    const tut = await publishFromDir(GENERATED_TUT_DIR);
    const total = edu + tut;
    console.log(`✅ Publicación completada. Artículos movidos: ${total} (Edu: ${edu}, Tut: ${tut})`);
  } catch (err) {
    console.error('Error publicando artículos generados:', err.message || err);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
