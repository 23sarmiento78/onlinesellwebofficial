// scripts/generate-html-articles-gemini.js
// Genera artículos HTML estáticos usando Gemini y la plantilla

const fs = require('fs').promises; // Usar la versión de promesas de fs
const path = require('path');
const axios = require('axios');

// --- Configuración Global ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OUTPUT_DIR = path.resolve(__dirname, '../public/blog');
const SITEMAP_PATH = path.resolve(__dirname, '../public/sitemap.xml');
const POSTED_ARTICLES_PATH = path.resolve(__dirname, './posted_articles.json'); // Para llevar un registro de artículos ya publicados
const SITE_URL = process.env.SITE_URL || 'https://hgaruna.org';

// Verificar la clave API al inicio
if (!GEMINI_API_KEY) {
  console.error('❌ Error: La variable de entorno GEMINI_API_KEY no está definida.');
  process.exit(1);
}

// --- Datos de Categorías y Temas ---
const categoriesToTopics = {
  'Frontend': [
    'React 19: Nuevas características y mejoras',
    'Vue.js 4: El futuro del framework progresivo',
    'Svelte vs React: Comparativa completa',
    'Angular 18: Nuevas funcionalidades',
    'TypeScript avanzado: Patrones y mejores prácticas',
    'CSS Grid y Flexbox: Layouts modernos',
    'Web Components: El futuro del desarrollo web',
    'Progressive Web Apps (PWA) en 2025',
    'WebAssembly: Rendimiento nativo en el navegador',
    'Micro-frontends: Arquitectura escalable'
  ],
  'Backend': [
    'Node.js 22: Nuevas características',
    'Deno vs Node.js: ¿Cuál elegir?',
    'Bun: El runtime JavaScript más rápido',
    'GraphQL vs REST: Cuándo usar cada uno',
    'APIs RESTful: Diseño y mejores prácticas',
    'Autenticación JWT: Implementación segura',
    'OAuth 2.0 y OpenID Connect',
    'Rate limiting: Protección de APIs',
    'API versioning: Estrategias efectivas',
    'WebSockets vs Server-Sent Events'
  ],
  'Bases de Datos': [
    'PostgreSQL 16: Nuevas funcionalidades',
    'MongoDB 8: Mejoras y optimizaciones',
    'Redis: Caché y almacenamiento en memoria',
    'SQL vs NoSQL: Decisiones de arquitectura',
    'ORM vs Query Builder: Ventajas y desventajas',
    'Migrations: Gestión de esquemas de BD',
    'Índices de base de datos: Optimización',
    'Transacciones distribuidas',
    'Backup y recuperación de datos',
    'Sharding y particionamiento'
  ],
  'DevOps y Cloud': [
    'Docker: Contenedores para desarrolladores',
    'Kubernetes: Orquestación de contenedores',
    'CI/CD: Automatización de despliegues',
    'GitHub Actions: Workflows avanzados',
    'AWS Lambda: Serverless computing',
    'Azure Functions: Desarrollo serverless',
    'Google Cloud Functions: Plataforma serverless',
    'Terraform: Infrastructure as Code',
    'Ansible: Automatización de configuración',
    'Monitoring y observabilidad'
  ],
  'Testing y Calidad': [
    'Testing unitario: Jest y Vitest',
    'Testing de integración: Estrategias',
    'Testing E2E: Cypress y Playwright',
    'Testing de APIs: Postman y Newman',
    'Code coverage: Métricas de calidad',
    'Static analysis: ESLint',
    'Performance testing: Lighthouse y WebPageTest',
    'Security testing: OWASP y herramientas',
    'Accessibility testing: WCAG guidelines',
    'Testing de accesibilidad automatizado'
  ],
  'Inteligencia Artificial': [
    'Machine Learning para desarrolladores web',
    'APIs de IA: OpenAI, Claude, Gemini',
    'Chatbots: Implementación práctica',
    'Computer Vision en aplicaciones web',
    'NLP: Procesamiento de lenguaje natural',
    'Recomendation systems: Algoritmos',
    'AI-powered testing: Automatización inteligente',
    'Ethical AI: Principios y prácticas',
    'AI explainability: Transparencia en ML',
    'Edge AI: IA en dispositivos móviles'
  ],
  'Seguridad': [
    'OWASP Top 10: Vulnerabilidades web',
    'XSS Prevention: Cross-site scripting',
    'CSRF Protection: Cross-site request forgery',
    'SQL Injection: Prevención y detección',
    'Authentication: Múltiples factores',
    'Authorization: Control de acceso',
    'Encryption: Cifrado de datos sensibles',
    'HTTPS: Certificados SSL/TLS',
    'Content Security Policy (CSP)',
    'Security headers: Protección del navegador'
  ],
  'Performance y Optimización': [
    'Web Performance: Core Web Vitals',
    'Lazy loading: Carga diferida de recursos',
    'Code splitting: División de bundles',
    'Tree shaking: Eliminación de código muerto',
    'Image optimization: Formatos modernos',
    'CDN: Content Delivery Networks',
    'Caching strategies: Estrategias de caché',
    'Database optimization: Consultas eficientes',
    'Memory leaks: Detección y prevención',
    'Bundle analysis: Análisis de bundles'
  ],
  'Arquitectura y Patrones': [
    'Clean Architecture: Principios SOLID',
    'Design Patterns: Patrones de diseño',
    'Microservices: Arquitectura distribuida',
    'Event-driven architecture',
    'CQRS: Command Query Responsibility Segregation',
    'Event sourcing: Trazabilidad de eventos',
    'Domain-driven design (DDD)',
    'Hexagonal architecture: Ports and adapters',
    'Layered architecture: Separación de responsabilidades',
    'Monorepo vs Polyrepo: Estrategias'
  ],
  'Herramientas y Productividad': [
    'VS Code: Extensiones esenciales',
    'Git: Flujos de trabajo avanzados',
    'Terminal: Productividad en línea de comandos',
    'Package managers: npm, yarn, pnpm',
    'Build tools: Vite, Webpack, Rollup',
    'Linters y formatters: ESLint, Prettier',
    'Debugging: Herramientas y técnicas',
    'Profiling: Análisis de rendimiento',
    'Documentation: Herramientas y mejores prácticas',
    'Code review: Procesos efectivos'
  ],
  'Tendencias y Futuro': [
    'Web3: Blockchain y aplicaciones descentralizadas',
    'Metaverse: Desarrollo para realidad virtual',
    'IoT: Internet de las cosas',
    'Edge computing: Computación en el borde',
    'Quantum computing: Futuro de la computación',
    'Green computing: Desarrollo sostenible',
    'Low-code/No-code: Plataformas de desarrollo',
    'JAMstack: JavaScript, APIs, Markup',
    'Headless CMS: Gestión de contenido',
    'Composable architecture: Arquitectura modular'
  ]
};

// --- Funciones de Utilidad ---

/**
 * Genera un slug a partir de un título.
 * @param {string} title
 * @returns {string}
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres unicode (ej. ñ -> n)
    .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres no alfanuméricos excepto espacios y guiones
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/-+/g, '-') // Consolida múltiples guiones
    .trim(); // Elimina espacios al inicio/final
}

/**
 * Calcula el tiempo de lectura estimado de un contenido.
 * @param {string} content
 * @returns {number} Tiempo de lectura en minutos.
 */
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Carga la lista de artículos ya publicados.
 * @returns {Promise<Set<string>>} Un Set con los slugs de los artículos ya publicados.
 */
async function loadPostedArticles() {
  try {
    const data = await fs.readFile(POSTED_ARTICLES_PATH, 'utf8');
    return new Set(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📝 Archivo de artículos publicados no encontrado, creando uno nuevo.');
      return new Set();
    }
    console.error('❌ Error al cargar artículos publicados:', error);
    return new Set();
  }
}

/**
 * Guarda la lista de artículos publicados.
 * @param {Set<string>} postedArticles
 * @returns {Promise<void>}
 */
async function savePostedArticles(postedArticles) {
  try {
    await fs.writeFile(POSTED_ARTICLES_PATH, JSON.stringify(Array.from(postedArticles), null, 2), 'utf8');
    console.log('💾 Artículos publicados guardados.');
  } catch (error) {
    console.error('❌ Error al guardar artículos publicados:', error);
  }
}

/**
 * Obtiene un tema aleatorio de una categoría, asegurándose de que no se haya publicado recientemente.
 * @param {Set<string>} postedArticlesSlugs
 * @returns {Object|null} Objeto con { topic, category } o null si no hay temas disponibles.
 */
function getRandomUnpublishedTopic(postedArticlesSlugs) {
  const categories = Object.keys(categoriesToTopics);
  // Intenta encontrar un tema no publicado en un número limitado de intentos
  for (let i = 0; i < 50; i++) { // Intentar 50 veces para evitar bucles infinitos en caso de pocos temas
    const category = categories[Math.floor(Math.random() * categories.length)];
    const topics = categoriesToTopics[category] || [];
    if (topics.length === 0) continue;

    const topic = topics[Math.floor(Math.random() * topics.length)];
    const slug = generateSlug(topic);

    if (!postedArticlesSlugs.has(slug)) {
      return { topic, category, slug };
    }
  }
  console.warn('⚠️ No se encontraron temas sin publicar después de varios intentos.');
  return null;
}

// --- Generación de Contenido con Gemini ---

/**
 * Llama a la API de Gemini para generar contenido del artículo.
 * @param {string} topic
 * @param {string} category
 * @returns {Promise<string>} Contenido HTML generado.
 */
async function callGeminiApi(topic, category) {
  const prompt = `Eres un experto desarrollador web y escritor técnico. Tu tarea es crear el contenido HTML para un artículo sobre "${topic}" para la categoría "${category}".

IMPORTANTE:
- Genera SOLO el contenido HTML que va dentro de la etiqueta <article> de un blog (sin etiquetas <body>, <head>, <h1> principal, etc.).
- El artículo ya tendrá un título principal (<h1>) proporcionado por la plantilla. Tu contenido debe comenzar directamente con un párrafo de introducción.
- Usa la siguiente estructura para las secciones internas:
  <h2>Título de Sección</h2>
  <p>Contenido detallado...</p>
  
  <h3>Subtítulo de Sección</h3>
  <p>Más detalles...</p>
  
  <blockquote>Cita relevante.</blockquote>

- Incluye ejemplos de código con <pre><code class="language-javascript"> o el lenguaje apropiado, con comentarios si es útil.
- Usa <ul> y <ol> para listas.
- Añade <strong> y <em> para énfasis.
- No incluyas estilos CSS, solo estructura HTML semántica.

Formato requerido:
- Usa solo etiquetas HTML: <p>, <h2>, <h3>, <ul>, <ol>, <li>, blockquote, <code>, <pre>.
- Incluye ejemplos prácticos y casos de uso cuando sea relevante.
- Mantén un tono profesional pero accesible.
- Escribe entre 800-1200 palabras.
- Incluye al menos 2 ejemplos de código si es relevante.

Genera SOLO el contenido HTML que va dentro de la etiqueta <article>, sin backticks ni estructura adicional.`;

  try {
    console.log(`🔄 Solicitando contenido a Gemini para: ${topic} (${category})...`);
    const res = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 12000
        }
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000 // Aumentado a 90 segundos
      }
    );

    const content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No se pudo obtener el contenido HTML de Gemini. Respuesta vacía o inesperada.');
    }
    console.log(`✅ Contenido de Gemini recibido para: ${topic}.`);
    return content;
  } catch (error) {
    console.error(`❌ Error al llamar a la API de Gemini para "${topic}":`, error.message);
    if (error.response) {
      console.error('  Código de estado:', error.response.status);
      console.error('  Datos de respuesta:', error.response.data);
    } else if (error.request) {
      console.error('  No se recibió respuesta de la red.');
    }
    throw new Error(`Fallo en la generación con Gemini para "${topic}".`);
  }
}

// --- Procesamiento y Guardado de Artículo ---

/**
 * Extrae metadatos básicos del contenido HTML generado.
 * @param {string} content El contenido HTML generado por Gemini.
 * @param {string} articleTopic El tema principal del artículo, que será el título real.
 * @returns {{title: string, summary: string, tags: string[]}}
 */
function extractMetadata(content, articleTopic) {
  // El título principal (h1) se toma directamente del 'articleTopic'
  const title = articleTopic;

  // Extraer el primer párrafo como resumen
  // Buscamos el primer <p> en el contenido de Gemini
  const summaryMatch = content.match(/<p[^>]*>([\s\S]+?)<\/p>/i); // Usamos [\s\S]+? para que coincida con cualquier caracter (incluyendo saltos de línea) de forma no-greedy
  const summary = summaryMatch 
    ? summaryMatch[1].replace(/<[^>]*>/g, '').trim().substring(0, 160) + '...' // Limpiamos cualquier HTML anidado en el párrafo
    : `Artículo sobre ${articleTopic}.`; // Fallback si no hay ningún párrafo

  // Generar tags basados en palabras clave comunes en el contenido y el tema
  const combinedText = (content + ' ' + articleTopic).toLowerCase();
  const tags = new Set();
  if (combinedText.includes('javascript') || combinedText.includes('js')) tags.add('JavaScript');
  if (combinedText.includes('react')) tags.add('React');
  if (combinedText.includes('angular')) tags.add('Angular');
  if (combinedText.includes('vue')) tags.add('Vue.js');
  if (combinedText.includes('node.js') || combinedText.includes('nodejs')) tags.add('Node.js');
  if (combinedText.includes('python')) tags.add('Python');
  if (combinedText.includes('aws')) tags.add('AWS');
  if (combinedText.includes('docker')) tags.add('Docker');
  if (combinedText.includes('kubernetes')) tags.add('Kubernetes');
  if (combinedText.includes('api')) tags.add('API');
  if (combinedText.includes('seguridad')) tags.add('Seguridad');
  if (combinedText.includes('rendimiento') || combinedText.includes('performance')) tags.add('Performance');
  if (combinedText.includes('inteligencia artificial') || combinedText.includes('ia') || combinedText.includes('ai')) tags.add('IA');
  if (combinedText.includes('bases de datos')) tags.add('Bases de Datos');
  if (combinedText.includes('testing')) tags.add('Testing');
  if (combinedText.includes('devops')) tags.add('DevOps');

  return { title, summary, tags: Array.from(tags) };
}

/**
 * Rellena la plantilla HTML con el contenido y metadatos del artículo.
 * @param {Object} articleData
 * @param {string} articleData.title
 * @param {string} articleData.summary
 * @param {string} articleData.content
 * @param {string} articleData.category
 * @param {string[]} articleData.tags
 * @param {string} articleData.slug
 * @returns {Promise<string>} HTML completo del artículo.
 */
async function fillTemplate(articleData) {
  const { title, summary, content, category, tags, slug } = articleData;
  const date = new Date().toISOString().split('T')[0];
  const readingTime = calculateReadingTime(content);
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  const templatePath = path.join(__dirname, '../templates/article-template.html');
  let template = await fs.readFile(templatePath, 'utf8');

  // Asegurar la meta etiqueta de categoría
  const categoryMetaTag = `<meta name="category" content="${category}">`;
  if (!template.includes('<meta name="category"')) {
    template = template.replace(/<head>/i, `<head>\n    ${categoryMetaTag}`);
  } else {
    template = template.replace(/<meta name="category"[^>]*>/i, categoryMetaTag);
  }

  // Asegurar la etiqueta de Google Site Verification
  const googleVerificationTag = '<meta name="google-site-verification" content="L4e6eB4hwkgHXit54PWBHjUV5RtnOmznEPwSDbvWTlM" />';
  const googleVerificationRegex = /<meta\s+name="google-site-verification"[^>]*>/i;
  if (googleVerificationRegex.test(template)) {
    template = template.replace(googleVerificationRegex, googleVerificationTag);
  } else {
    template = template.replace(/<meta charset="UTF-8">/i, `<meta charset="UTF-8">\n    ${googleVerificationTag}`);
  }

  // Asegurar el script de AdSense
  const adsenseScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772175009790237" crossorigin="anonymous"></script>';
  if (!template.includes('adsbygoogle.js')) { // Verificar si el script ya existe para no duplicar
    template = template.replace('</head>', `    ${adsenseScript}\n</head>`);
  }

  // Asegurar las meta etiquetas Open Graph y Twitter Cards para compartir en redes sociales
  const ogTags = `
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${summary}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${SITE_URL}/blog/${slug}.html">
    <meta property="og:image" content="${SITE_URL}/logos-he-imagenes/programacion.jpeg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${summary}">
    <meta name="twitter:image" content="${SITE_URL}/logos-he-imagenes/programacion.jpeg">
  `.trim();

  // Insertar Open Graph y Twitter Cards justo antes del </head>
  if (!template.includes('property="og:title"')) { // Evitar duplicar si ya existen
    template = template.replace('</head>', `    ${ogTags}\n</head>`);
  } else {
    // Si ya existen, reemplazarlas para asegurar que estén actualizadas
    template = template.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}">`);
    template = template.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${summary}">`);
    template = template.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${SITE_URL}/blog/${slug}.html">`);
    template = template.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${SITE_URL}/logos-he-imagenes/programacion.jpeg">`);
    template = template.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}">`);
    template = template.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${summary}">`);
    template = template.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${SITE_URL}/logos-he-imagenes/programacion.jpeg">`);
  }


  // Reemplazar marcadores de posición en la plantilla
  const replacements = {
    '{{ARTICLE_TITLE}}': title,
    '{{ARTICLE_SUMMARY}}': summary,
    '{{ARTICLE_CONTENT}}': content,
    '{{CATEGORY}}': category,
    '{{AUTHOR}}': 'hgaruna',
    '{{PUBLISH_DATE}}': date,
    '{{FEATURED_IMAGE}}': '/logos-he-imagenes/programacion.jpeg', // Asegúrate de que esta ruta sea correcta y exista
    '{{SEO_TITLE}}': title,
    '{{SEO_DESCRIPTION}}': summary, // Usamos el summary ya cortado y limpio
    '{{SEO_KEYWORDS}}': tags.join(', '),
    '{{CANONICAL_URL}}': `${SITE_URL}/blog/${slug}.html`,
    '{{TAGS_HTML}}': tags.map(tag => `<a href="/blog/tag/${generateSlug(tag)}" class="tag">#${tag}</a>`).join(''), // Tags ahora son enlaces
    '{{READING_TIME}}': readingTime.toString(),
    '{{WORD_COUNT}}': wordCount.toString()
  };

  Object.entries(replacements).forEach(([key, value]) => {
    template = template.replace(new RegExp(key, 'g'), value);
  });

  return template;
}

/**
 * Genera un artículo HTML completo, desde la llamada a Gemini hasta guardarlo en disco.
 * @param {string} topic
 * @param {string} category
 * @param {string} slug
 * @returns {Promise<{ filename: string, title: string, slug: string, category: string }>}
 */
async function generateArticleFile(topic, category, slug) {
  const filename = `${slug}.html`;
  const filepath = path.join(OUTPUT_DIR, filename);

  try {
    const geminiContent = await callGeminiApi(topic, category);
    const { title, summary, tags } = extractMetadata(geminiContent, topic); // Pasamos 'topic' como el título principal

    const articleHTML = await fillTemplate({
      title,
      summary,
      content: geminiContent,
      category,
      tags,
      slug
    });

    await fs.writeFile(filepath, articleHTML);
    console.log(`✅ Artículo "${filename}" guardado exitosamente.`);
    return { filename, title, slug, category };
  } catch (error) {
    console.error(`❌ Fallo al generar o guardar el artículo "${topic}":`, error.message);
    throw error;
  }
}

// --- Gestión de Sitemap ---

/**
 * Actualiza el sitemap.xml añadiendo la nueva URL del artículo.
 * @param {{filename: string, slug: string}} articleInfo
 * @returns {Promise<void>}
 */
async function updateSitemap({ filename, slug }) {
  const articleUrl = `${SITE_URL}/blog/${filename}`;
  try {
    let sitemapContent;
    try {
      sitemapContent = await fs.readFile(SITEMAP_PATH, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn('⚠️ sitemap.xml no encontrado. Creando uno nuevo.');
        sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      } else {
        throw error;
      }
    }

    // Verificar si la URL ya existe en el sitemap
    if (sitemapContent.includes(`<loc>${articleUrl}</loc>`)) {
      console.log(`⚠️ URL ${articleUrl} ya existe en el sitemap. Saltando actualización.`);
      return;
    }

    const newEntry = `
  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Insertar antes de la etiqueta de cierre </urlset>
    sitemapContent = sitemapContent.replace('</urlset>', `${newEntry}\n</urlset>`);

    await fs.writeFile(SITEMAP_PATH, sitemapContent);
    console.log(`✅ sitemap.xml actualizado con ${filename}.`);
  } catch (error) {
    console.error(`❌ Error al actualizar sitemap.xml para ${filename}:`, error.message);
  }
}

// --- Función Principal ---

async function main() {
  console.log('🚀 Iniciando generación de artículos HTML con Gemini...');

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    console.log(`📂 Directorio de salida verificado/creado: ${OUTPUT_DIR}`);

    const postedArticlesSlugs = await loadPostedArticles();
    const generatedArticles = [];

    const numberOfArticlesToGenerate = 3; // Puedes hacer esto configurable si lo deseas

    for (let i = 0; i < numberOfArticlesToGenerate; i++) {
      console.log(`\n--- Intentando generar artículo ${i + 1} de ${numberOfArticlesToGenerate} ---`);
      const topicInfo = getRandomUnpublishedTopic(postedArticlesSlugs);

      if (!topicInfo) {
        console.warn(`🛑 No hay temas únicos disponibles para generar más artículos.`);
        break;
      }

      const { topic, category, slug } = topicInfo;

      try {
        const articleResult = await generateArticleFile(topic, category, slug);
        generatedArticles.push(articleResult);
        postedArticlesSlugs.add(slug); // Añadir el slug a la lista de publicados

        await updateSitemap(articleResult);

        // Pequeña pausa para evitar sobrecargar APIs o para visibilidad en logs
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`❌ Fallo crítico al generar artículo para "${topic}":`, error.message);
        // Continuar con el siguiente intento si falla un artículo
      }
    }

    await savePostedArticles(postedArticlesSlugs);

    console.log('\n--- Resumen de Generación ---');
    if (generatedArticles.length > 0) {
      console.log(`✅ Se generaron y guardaron ${generatedArticles.length} nuevos artículos.`);
      generatedArticles.forEach(article => {
        console.log(`  - "${article.title}" (${article.filename}) [Categoría: ${article.category}]`);
      });
    } else {
      console.log('ℹ️ No se generaron nuevos artículos en esta ejecución.');
    }

    console.log('\n🎉 Proceso de generación HTML completado.');

  } catch (error) {
    console.error('Fatal error during HTML generation process:', error.message);
    process.exit(1);
  }
}

// Ejecutar main si el script es llamado directamente
if (require.main === module) {
  main();
}

// Exportar funciones si se necesita para testing u otros scripts
module.exports = {
  generateArticleFile,
  updateSitemap,
  main,
  // Para testing:
  generateSlug,
  calculateReadingTime,
  extractMetadata
};
