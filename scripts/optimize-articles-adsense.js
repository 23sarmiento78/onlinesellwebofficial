// scripts/optimize-articles-adsense.js
// Optimiza artículos existentes para AdSense compliance y mejor SEO

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EDUCATIONAL_DIR = path.resolve(__dirname, '../public/aprende-programacion');

// Configuración de optimización AdSense
const ADSENSE_CONFIG = {
  client: 'ca-pub-7772175009790237',
  minWordCount: 500, // Mínimo de palabras para AdSense
  maxAdsPerPage: 3,   // Máximo de anuncios por página
  adPlacements: [
    { position: 'top', after: 'h1', type: 'banner' },
    { position: 'middle', after: 'p', occurrence: 3, type: 'in-article' },
    { position: 'bottom', before: 'footer', type: 'matched-content' }
  ]
};

// Función principal de optimización
async function optimizeArticlesForAdSense() {
  console.log('🚀 Iniciando optimización de artículos para AdSense...');
  
  try {
    // Optimizar artículos del blog
    await optimizeDirectory(BLOG_DIR, 'blog');
    
    // Optimizar contenido educativo
    await optimizeDirectory(EDUCATIONAL_DIR, 'educational');
    
    console.log('✅ Optimización completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la optimización:', error.message);
    process.exit(1);
  }
}

// Optimizar directorio específico
async function optimizeDirectory(directory, type) {
  if (!fs.existsSync(directory)) {
    console.log(`📁 Directorio ${directory} no existe, creándolo...`);
    fs.mkdirSync(directory, { recursive: true });
    return;
  }

  const files = fs.readdirSync(directory).filter(file => file.endsWith('.html'));
  console.log(`📄 Encontrados ${files.length} archivos HTML en ${type}`);

  for (const file of files) {
    const filePath = path.join(directory, file);
    await optimizeHTMLFile(filePath, type);
  }
}

// Optimizar archivo HTML individual
async function optimizeHTMLFile(filePath, type) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    
    console.log(`🔄 Optimizando: ${path.basename(filePath)}`);
    
    // 1. Verificar y mejorar meta tags
    optimizeMetaTags($, type);
    
    // 2. Agregar Schema.org markup si no existe
    addSchemaMarkup($, type);
    
    // 3. Optimizar estructura de contenido
    optimizeContentStructure($);
    
    // 4. Agregar anuncios AdSense estratégicamente
    addAdSensePlacements($);
    
    // 5. Mejorar navegación interna
    improveInternalLinking($);
    
    // 6. Optimizar imágenes
    optimizeImages($);
    
    // 7. Verificar compliance de AdSense
    const compliance = checkAdSenseCompliance($);
    
    if (compliance.isCompliant) {
      // Guardar archivo optimizado
      fs.writeFileSync(filePath, $.html());
      console.log(`✅ ${path.basename(filePath)} optimizado correctamente`);
    } else {
      console.log(`⚠️  ${path.basename(filePath)} requiere ajustes:`, compliance.issues);
    }
    
  } catch (error) {
    console.error(`❌ Error optimizando ${filePath}:`, error.message);
  }
}

// Optimizar meta tags
function optimizeMetaTags($, type) {
  // Asegurar meta viewport
  if (!$('meta[name="viewport"]').length) {
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  
  // Asegurar Google Site Verification
  const siteVerification = 'L4e6eB4hwkgHXit54PWBHjUV5RtnOmznEPwSDbvWTlM';
  if (!$('meta[name="google-site-verification"]').length) {
    $('head').append(`<meta name="google-site-verification" content="${siteVerification}">`);
  }
  
  // Asegurar robots meta
  if (!$('meta[name="robots"]').length) {
    $('head').append('<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">');
  }
  
  // Agregar meta tags específicos para AdSense
  if (!$('meta[name="monetization"]').length) {
    $('head').append('<meta name="monetization" content="enabled">');
  }
  
  // Agregar categoría si no existe
  if (!$('meta[name="category"]').length && type === 'educational') {
    $('head').append('<meta name="category" content="Educación">');
  }
}

// Agregar Schema.org markup
function addSchemaMarkup($, type) {
  if ($('script[type="application/ld+json"]').length > 0) {
    return; // Ya tiene schema markup
  }
  
  const title = $('title').text() || $('h1').first().text();
  const description = $('meta[name="description"]').attr('content') || '';
  
  let schema;
  
  if (type === 'educational') {
    schema = {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      "name": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "hgaruna"
      },
      "publisher": {
        "@type": "Organization", 
        "name": "hgaruna",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hgaruna.org/logos-he-imagenes/logo3.png"
        }
      },
      "learningResourceType": "Tutorial",
      "isAccessibleForFree": true,
      "inLanguage": "es"
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": "hgaruna"
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hgaruna.org/logos-he-imagenes/logo3.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  }
  
  $('head').append(`<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`);
}

// Optimizar estructura de contenido
function optimizeContentStructure($) {
  // Asegurar estructura de encabezados correcta
  const headings = $('h1, h2, h3, h4, h5, h6');
  let hasH1 = false;
  
  headings.each((i, el) => {
    const $el = $(el);
    if (el.tagName.toLowerCase() === 'h1') {
      if (hasH1) {
        // Convertir H1 adicionales a H2
        $el.replaceWith(`<h2>${$el.html()}</h2>`);
      } else {
        hasH1 = true;
      }
    }
  });
  
  // Agregar IDs a encabezados para navegación
  $('h2, h3').each((i, el) => {
    const $el = $(el);
    if (!$el.attr('id')) {
      const id = $el.text()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      $el.attr('id', id);
    }
  });
  
  // Mejorar párrafos - dividir párrafos muy largos
  $('p').each((i, el) => {
    const $el = $(el);
    const text = $el.text();
    if (text.length > 300 && text.includes('.')) {
      // Dividir párrafo largo en múltiples párrafos
      const sentences = text.split('. ');
      if (sentences.length > 3) {
        const midPoint = Math.ceil(sentences.length / 2);
        const firstHalf = sentences.slice(0, midPoint).join('. ') + '.';
        const secondHalf = sentences.slice(midPoint).join('. ');
        
        $el.html(firstHalf);
        $el.after(`<p>${secondHalf}</p>`);
      }
    }
  });
}

// Agregar anuncios AdSense estratégicamente
function addAdSensePlacements($) {
  // Verificar si ya tiene anuncios
  if ($('.adsbygoogle').length > 0) {
    return;
  }
  
  const paragraphs = $('p');
  const totalParagraphs = paragraphs.length;
  
  if (totalParagraphs < 3) {
    return; // Muy poco contenido para anuncios
  }
  
  // Anuncio después del primer encabezado
  const firstH2 = $('h2').first();
  if (firstH2.length) {
    const bannerAd = createAdSenseUnit('1234567890', 'auto', 'block');
    firstH2.after(`<div class="adsense-container my-4">${bannerAd}</div>`);
  }
  
  // Anuncio en el medio del contenido
  const middleIndex = Math.floor(totalParagraphs / 2);
  const middleParagraph = paragraphs.eq(middleIndex);
  if (middleParagraph.length) {
    const inArticleAd = createAdSenseUnit('5555555555', 'fluid', 'block', 'in-article');
    middleParagraph.after(`<div class="adsense-container my-4">${inArticleAd}</div>`);
  }
  
  // Anuncio al final del contenido
  const lastParagraph = paragraphs.last();
  if (lastParagraph.length) {
    const matchedContentAd = createAdSenseUnit('7777777777', 'autorelaxed', 'block');
    lastParagraph.after(`<div class="adsense-container my-4">${matchedContentAd}</div>`);
  }
}

// Crear unidad de AdSense
function createAdSenseUnit(slot, format, display, layout = null) {
  const layoutAttr = layout ? ` data-ad-layout="${layout}"` : '';
  return `
    <ins class="adsbygoogle"
         style="display:${display}"
         data-ad-client="${ADSENSE_CONFIG.client}"
         data-ad-slot="${slot}"
         data-ad-format="${format}"${layoutAttr}
         data-full-width-responsive="true"></ins>
  `;
}

// Mejorar enlaces internos
function improveInternalLinking($) {
  // Agregar enlaces a contenido relacionado
  const lastSection = $('section').last();
  if (lastSection.length) {
    const relatedLinks = `
      <section class="related-content py-4">
        <div class="container">
          <h3>Contenido Relacionado</h3>
          <ul>
            <li><a href="/aprende-programacion">🎓 Aprende Programación Gratis</a></li>
            <li><a href="/blog">📰 Más Artículos del Blog</a></li>
            <li><a href="/desarrollo-web-villa-carlos-paz">💼 Servicios de Desarrollo</a></li>
          </ul>
        </div>
      </section>
    `;
    lastSection.after(relatedLinks);
  }
}

// Optimizar imágenes
function optimizeImages($) {
  $('img').each((i, el) => {
    const $img = $(el);
    
    // Agregar lazy loading
    if (!$img.attr('loading')) {
      $img.attr('loading', 'lazy');
    }
    
    // Agregar alt text si falta
    if (!$img.attr('alt')) {
      const src = $img.attr('src') || '';
      const altText = src.split('/').pop().split('.')[0].replace(/-/g, ' ');
      $img.attr('alt', altText);
    }
    
    // Agregar dimensiones para Core Web Vitals
    if (!$img.attr('width') && !$img.attr('height')) {
      $img.attr('width', '300');
      $img.attr('height', '200');
    }
  });
}

// Verificar compliance de AdSense
function checkAdSenseCompliance($) {
  const issues = [];
  const content = $('body').text();
  const wordCount = content.split(/\s+/).length;
  
  // Verificar longitud mínima
  if (wordCount < ADSENSE_CONFIG.minWordCount) {
    issues.push(`Contenido muy corto: ${wordCount} palabras (mínimo ${ADSENSE_CONFIG.minWordCount})`);
  }
  
  // Verificar estructura
  if (!$('h1').length) {
    issues.push('Falta encabezado H1');
  }
  
  if ($('h2').length < 2) {
    issues.push('Pocos subtítulos H2 (mínimo 2)');
  }
  
  // Verificar meta description
  const metaDescription = $('meta[name="description"]').attr('content');
  if (!metaDescription || metaDescription.length < 120) {
    issues.push('Meta description muy corta o ausente');
  }
  
  // Verificar anuncios excesivos
  const adCount = $('.adsbygoogle').length;
  if (adCount > ADSENSE_CONFIG.maxAdsPerPage) {
    issues.push(`Demasiados anuncios: ${adCount} (máximo ${ADSENSE_CONFIG.maxAdsPerPage})`);
  }
  
  return {
    isCompliant: issues.length === 0,
    issues,
    wordCount,
    adCount
  };
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeArticlesForAdSense().catch(console.error);
}

export { optimizeArticlesForAdSense, checkAdSenseCompliance };
