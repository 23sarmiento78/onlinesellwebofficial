import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { load as loadHtml } from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'public', 'blog');

function validateDocument($) {
  const issues = [];

  // Title and meta description
  const title = $('head > title').text().trim();
  const metaDesc = $('head meta[name="description"]').attr('content')?.trim();
  if (!title) issues.push('Falta <title>');
  if (!metaDesc) issues.push('Falta meta description');

  // Charset and viewport
  const hasCharset = $('head meta[charset]').length > 0;
  const hasViewport = $('head meta[name="viewport"]').length > 0;
  if (!hasCharset) issues.push('Falta meta charset');
  if (!hasViewport) issues.push('Falta meta viewport');

  // Canonical link recommended
  const canonical = $('head link[rel="canonical"]').attr('href');
  if (!canonical) issues.push('Falta link rel=canonical (recomendado)');

  // Check that there are no excessive inline scripts before content (simple heuristic)
  const scriptCount = $('script').length;
  if (scriptCount > 20) issues.push(`Demasiados <script> (${scriptCount})`);

  // Basic content presence
  const hasMainContent = $('article, main, .article-content, #main').length > 0;
  if (!hasMainContent) issues.push('No se detectó contenedor de contenido principal');

  return issues;
}

async function main() {
  try {
    const verbose = process.argv.includes('--verbose');
    const exists = await fs.pathExists(BLOG_DIR);
    if (!exists) {
      console.log('ℹ️  No existe public/blog; nada para validar.');
      return;
    }

    const files = (await fs.readdir(BLOG_DIR)).filter(f => f.toLowerCase().endsWith('.html'));
    let total = 0;
    let conIssues = 0;

    for (const file of files) {
      total++;
      const full = path.join(BLOG_DIR, file);
      const html = await fs.readFile(full, 'utf8');
      const $ = loadHtml(html);
      const issues = validateDocument($);
      if (issues.length) {
        conIssues++;
        console.log(`⚠️  ${file}:`);
        for (const i of issues) console.log(`   - ${i}`);
      } else if (verbose) {
        console.log(`✅ ${file}: OK`);
      }
    }

    if (total === 0) {
      console.log('ℹ️  No se encontraron artículos HTML para validar.');
    }

    console.log(`✅ Validación AdSense/SEO básica completada. Archivos: ${total}, con advertencias: ${conIssues}`);
    // Nota: no hacemos process.exit(1). Dejar warnings sin romper el pipeline.
  } catch (err) {
    console.error('Error en validación:', err.message || err);
    // Evitar romper el pipeline por validación; registrar y salir OK.
  }
}

// Ejecutar main cuando se llama con `node scripts/validate-adsense-compliance.mjs`
const invokedDirectly = (() => {
  try {
    const arg = process.argv[1] || '';
    // Coincidencia por nombre de archivo para evitar diferencias de formato file:// en Windows
    return /validate-adsense-compliance\.mjs$/i.test(arg);
  } catch {
    return true;
  }
})();

if (invokedDirectly) {
  main();
}
