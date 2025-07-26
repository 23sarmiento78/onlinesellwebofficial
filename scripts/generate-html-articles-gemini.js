// scripts/generate-html-articles-gemini.js
// Genera artículos HTML estáticos usando Gemini y la plantilla

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/article-template.html');
const OUTPUT_DIR = path.resolve(__dirname, '../public/blog');

if (!GEMINI_API_KEY) {
  console.error('❌ Falta la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}


// Definir categorías y temas asociados
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
    'Static analysis: ESLint y SonarQube',
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


function getRandomTopicsFromCategory(category, n) {
  const topics = categoriesToTopics[category] || [];
  const shuffled = topics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function generateTagsHTML(tags) {
  if (!Array.isArray(tags)) {
    tags = tags.split(',').map(t => t.trim());
  }
  return tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
}


async function generateArticleHTML(topic, category) {
  const prompt = `
Eres un experto desarrollador web y escritor técnico. Tu tarea es crear un artículo HTML completo sobre "${topic}" para la categoría "${category}".

IMPORTANTE: 
- Genera SOLO el contenido HTML que va dentro del <main> del template
- NO uses backticks de markdown (\`\`\`)
- NO incluyas <!DOCTYPE html>, <html>, <head>, <body> ni ninguna etiqueta de estructura
- Solo genera el contenido que va dentro del <main> del template

El artículo debe incluir:
1. Un párrafo introductorio con la descripción
2. Al menos 4-5 secciones con títulos H2
3. Subsecciones con H3 donde sea apropiado
4. Listas con ventajas/desventajas, pasos, consejos, etc.
5. Ejemplos de código cuando sea relevante
6. Una conclusión

Formato requerido:
- Usa solo etiquetas HTML: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <code>, <pre>
- Incluye ejemplos prácticos y casos de uso
- Mantén un tono profesional pero accesible
- Escribe entre 800-1200 palabras
- Incluye al menos 2 ejemplos de código si es relevante

Genera SOLO el contenido HTML que va dentro del <main> del template, sin backticks ni estructura adicional.
`;

  try {
    console.log(`🔄 Generando artículo HTML sobre: ${topic} [${category}]`);
    
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
        timeout: 60000 // 60 segundos timeout
      }
    );

    let content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No se pudo obtener el contenido HTML de Gemini');
    }
    
    // Extraer metadatos del contenido generado
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/i) || content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
    const title = titleMatch ? titleMatch[1] : topic;
    
    const summaryMatch = content.match(/<p[^>]*>([^<]+)<\/p>/i);
    const summary = summaryMatch ? summaryMatch[1].substring(0, 150) + '...' : `Artículo sobre ${topic}`;
    
    // Generar slug del título
    // Slug corto y SEO, sin fecha
    // Slug muy corto para el nombre del archivo
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 20);
    
    // Generar tags basados en el contenido
    const tags = [];
    if (content.toLowerCase().includes('javascript')) tags.push('JavaScript');
    if (content.toLowerCase().includes('react')) tags.push('React');
    if (content.toLowerCase().includes('angular')) tags.push('Angular');
    if (content.toLowerCase().includes('aws')) tags.push('AWS');
    if (content.toLowerCase().includes('performance')) tags.push('Performance');
    if (content.toLowerCase().includes('eslint')) tags.push('ESLint');
    if (content.toLowerCase().includes('sonarqube')) tags.push('SonarQube');
    
    // Calcular tiempo de lectura
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Leer el template HTML
    const templatePath = path.join(__dirname, '../templates/article-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Insertar meta category si no existe
    if (!template.includes('<meta name="category"')) {
      template = template.replace(/<head>/i, `<head>\n    <meta name="category" content="${category}">`);
    } else {
      template = template.replace(/<meta name="category"[^>]*>/i, `<meta name="category" content="${category}">`);
    }
    // Asegurar que la etiqueta de Google Site Verification esté presente y sea la correcta
    const googleVerificationTag = '<meta name="google-site-verification" content="L4e6eB4hwkgHXit54PWBHjUV5RtnOmznEPwSDbvWTlM" />';
    const googleVerificationRegex = /<meta\s+name="google-site-verification"[^>]*>/i;

    if (googleVerificationRegex.test(template)) {
      // Si ya existe una etiqueta de verificación, la reemplazamos para asegurar que es la correcta.
      template = template.replace(googleVerificationRegex, googleVerificationTag);
      console.log('🔄 Etiqueta de Google Site Verification actualizada.');
    } else {
      // Si no existe, la añadimos dentro del <head>.
      template = template.replace(/<head>/i, `<head>\n    ${googleVerificationTag}`);
      console.log('✨ Etiqueta de Google Site Verification añadida.');
    }
    // Reemplazar variables en el template
    const replacements = {
      '{{ARTICLE_TITLE}}': title,
      '{{ARTICLE_SUMMARY}}': summary,
      '{{ARTICLE_CONTENT}}': content,
      '{{CATEGORY}}': category,
      '{{AUTHOR}}': 'hgaruna',
      '{{PUBLISH_DATE}}': new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      '{{FEATURED_IMAGE}}': '/logos-he-imagenes/programacion.jpeg',
      '{{SEO_TITLE}}': title,
      '{{SEO_DESCRIPTION}}': summary.substring(0, 160),
      '{{SEO_KEYWORDS}}': tags.join(', '),
      '{{CANONICAL_URL}}': `https://www.hgaruna.org/blog/${slug}`, // <-- CORRECCIÓN: Dominio correcto
      '{{TAGS_HTML}}': tags.map(tag => `<span class="tag">${tag}</span>`).join(''),
      '{{READING_TIME}}': readingTime.toString(),
      '{{WORD_COUNT}}': wordCount.toString()
    };
    
    // Aplicar reemplazos
    Object.entries(replacements).forEach(([key, value]) => {
      template = template.replace(new RegExp(key, 'g'), value);
    });
    
    const today = new Date().toISOString().slice(0, 10);
    return {
      content: template,
      title,
      slug,
      filename: `${slug}.html`
    };
    
  } catch (error) {
    console.error(`❌ Error generando artículo HTML sobre ${topic} [${category}]:`, error);
    throw error;
  }
}


async function main() {
  try {
    console.log('🚀 Iniciando generación de artículos HTML multi-categoría...');

    // Crear directorio si no existe
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log('📁 Directorio de artículos HTML creado');
    }

    const generatedArticles = [];
    // Seleccionar 2 categorías aleatorias
    const allCategories = Object.keys(categoriesToTopics);
    const shuffledCategories = allCategories.sort(() => 0.5 - Math.random());
    const selectedCategories = shuffledCategories.slice(0, 2);

    for (const category of selectedCategories) {
      const topics = categoriesToTopics[category];
      // Seleccionar 1 tema aleatorio por categoría
      const shuffledTopics = topics.sort(() => 0.5 - Math.random());
      const topic = shuffledTopics[0];
      console.log(`\n📅 Generando artículo para la categoría: ${category}`);
      try {
        const { content, filename, title, slug } = await generateArticleHTML(topic, category);
        const filepath = path.join(OUTPUT_DIR, filename);

        // Verificar si el archivo ya existe
        if (fs.existsSync(filepath)) {
          console.log(`⚠️  Archivo ${filename} ya existe, saltando...`);
          continue;
        }

        fs.writeFileSync(filepath, content);
        generatedArticles.push({ filename, title, slug, category });
        console.log(`✅ ${filename} guardado`);

        // Pausa entre artículos para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error(`❌ Error con artículo [${category}]:`, error.message);
        // Continuar con el siguiente artículo
      }
    }

    console.log('\n📊 Resumen de generación HTML:');
    console.log(`✅ Artículos HTML generados: ${generatedArticles.length}`);
    console.log(`📁 Directorio: ${OUTPUT_DIR}`);

    if (generatedArticles.length > 0) {
      console.log('\n📝 Artículos HTML creados:');
      generatedArticles.forEach(article => {
        console.log(`  - ${article.filename} (${article.title}) [${article.category}]`);
      });
    }

    if (generatedArticles.length === 0) {
      console.log('⚠️  No se generaron nuevos artículos HTML');
      process.exit(1);
    }

    console.log('\n🎉 Generación HTML multi-categoría completada exitosamente!');

  } catch (error) {
    console.error('❌ Error en la generación HTML:', error.message);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { generateArticleHTML }; 