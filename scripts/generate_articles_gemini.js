// scripts/generate_articles_gemini.js
// Genera 4 artículos diarios usando Gemini 2.5 Flash y los guarda en src/content/articulos/

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OUTPUT_DIR = path.resolve(__dirname, '../src/content/articulos');

if (!GEMINI_API_KEY) {
  console.error('Falta la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}

const topics = [
  // Categorías de programación y desarrollo web
  'Tendencias en desarrollo web',
  'Nuevos frameworks JavaScript',
  'Comparativa de frameworks frontend',
  'Backend moderno: Node.js, Deno, Bun',
  'Desarrollo con Python: Django, Flask, FastAPI',
  'Programación en Go para web',
  'Rust en el desarrollo web',
  'PHP moderno y Laravel',
  'Ruby on Rails en 2025',
  'Bases de datos SQL vs NoSQL',
  'GraphQL vs REST',
  'Microservicios y arquitecturas serverless',
  'Desarrollo mobile-first',
  'PWAs: apps web progresivas',
  'Jamstack y sitios estáticos',
  'Automatización de despliegues (CI/CD)',
  'Testing automatizado: unitario, integración, e2e',
  'DevOps para programadores',
  'Contenedores y Docker',
  'Kubernetes para desarrolladores',
  'Cloud computing: AWS, Azure, GCP',
  'Desarrollo seguro: OWASP y mejores prácticas',
  'Accesibilidad web avanzada',
  'SEO técnico para programadores',
  'Optimización de rendimiento web',
  'WebAssembly y el futuro del navegador',
  'Desarrollo de APIs robustas',
  'Integración de pagos online',
  'Desarrollo de chatbots',
  'Inteligencia artificial en la web',
  'Machine Learning para desarrolladores web',
  'Automatización de tareas con scripts',
  'Scraping web ético y legal',
  'Desarrollo de plugins y extensiones',
  'Desarrollo multiplataforma',
  'Desarrollo de videojuegos web',
  'Realidad aumentada y virtual en la web',
  'Desarrollo para IoT',
  'Programación funcional vs orientada a objetos',
  'Patrones de diseño en JavaScript',
  'Refactorización de código legacy',
  'Errores comunes en proyectos de programación',
  'Cómo aprender a programar desde cero',
  'Carreras y especializaciones en programación',
  'Soft skills para programadores',
  'Productividad y organización para devs',
  'Freelance vs trabajo en empresa',
  'Cómo contribuir a proyectos open source',
  'Entrevistas técnicas y preparación',
  'Tendencias en marketing digital para devs',
  'Growth hacking para programadores',
  'Estrategias de contenido para blogs técnicos',
  'Casos de éxito en desarrollo web',
  'Historias de programadores famosos',
  'Comunidades y foros de programación',
  'Eventos y conferencias tech',
  // ...agrega más temas aquí para nunca quedarte sin contenido
];

function getRandomTopics(n) {
  const shuffled = topics.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

async function generateArticle(topic) {
  const prompt = `Redacta un artículo original, profesional y extenso (mínimo 4000 caracteres, no palabras) sobre "${topic}". El título debe tener máximo 60 caracteres. Incluye: título, resumen (summary), subtítulos, ejemplos prácticos, consejos, errores comunes. El texto debe ser útil para programadores de todos los niveles y especialidades (frontend, backend, fullstack, mobile, devops, IA, etc). El formato debe ser Markdown con frontmatter YAML completo: title, summary, date, tags, author, image, slug, seo_title, seo_description, seo_keywords. Usa siempre la imagen: /logos-he-imagenes/programacion.jpeg. Los tags deben ser amplios y relevantes. El slug debe ser único, amigable para URL y corto. El artículo debe ser compatible con foros y blogs técnicos. Las metas SEO deben ser atractivas y relevantes para buscadores. IMPORTANTE: Puedes elegir libremente cualquier tema o categoría de la siguiente lista para cada artículo, y debes variar y rotar entre ellas para máxima diversidad de contenido: ${topics.join(", ")}`;

  const res = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    },
    {
      params: { key: GEMINI_API_KEY },
      headers: { 'Content-Type': 'application/json' }
    }
  );

  let text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No se pudo obtener el texto de Gemini');

  // Si el frontmatter no tiene los campos requeridos, los agregamos
  if (!/^image:/m.test(text)) {
    text = text.replace(/^---\n/, `---\nimage: /logos-he-imagenes/programacion.jpeg\n`);
  }
  if (!/^tags:/m.test(text)) {
    text = text.replace(/^---\n/, `---\ntags: [programación, desarrollo web]\n`);
  }
  if (!/^slug:/m.test(text)) {
    const match = text.match(/title:\s*['"]?(.+?)['"]?\n/i);
    const slug = match ? match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-') : Date.now().toString();
    text = text.replace(/^---\n/, `---\nslug: ${slug}\n`);
  }
  if (!/^seo_title:/m.test(text)) {
    const match = text.match(/title:\s*['"]?(.+?)['"]?\n/i);
    const seoTitle = match ? match[1] : 'Artículo de programación';
    text = text.replace(/^---\n/, `---\nseo_title: "${seoTitle}"\n`);
  }
  if (!/^seo_description:/m.test(text)) {
    const match = text.match(/summary:\s*['"]?(.+?)['"]?\n/i);
    const seoDesc = match ? match[1] : 'Artículo sobre programación y desarrollo web.';
    text = text.replace(/^---\n/, `---\nseo_description: "${seoDesc}"\n`);
  }
  if (!/^seo_keywords:/m.test(text)) {
    text = text.replace(/^---\n/, `---\nseo_keywords: [programación, desarrollo web, tendencias, errores, frameworks]\n`);
  }
  // Forzar título corto
  text = text.replace(/title:\s*['"]?(.{61,})['"]?/i, (m, t) => `title: "${t.slice(0, 60)}"`);
  return text;
}

(async () => {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const topicsToday = getRandomTopics(4);
  for (const topic of topicsToday) {
    try {
      const article = await generateArticle(topic);
      // Extraer título del frontmatter generado
      const match = article.match(/title:\s*['"]?(.+?)['"]?\n/i);
      const titleSlug = match ? match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-') : topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `${today}-${titleSlug}.md`;
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), article);
      console.log('Artículo generado:', filename);
    } catch (e) {
      console.error('Error generando artículo para', topic, e.message);
    }
  }
})();
