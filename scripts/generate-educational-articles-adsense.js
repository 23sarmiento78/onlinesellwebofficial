// scripts/generate-educational-articles-adsense.js
// Genera artículos educativos HTML optimizados para AdSense usando Gemini

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/educational-article-template.html');
const OUTPUT_DIR = path.resolve(__dirname, '../public/blog');
const EDUCATIONAL_DIR = path.resolve(__dirname, '../public/aprende-programacion');

if (!GEMINI_API_KEY) {
  console.error('❌ Falta la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}

// Temas educativos optimizados para AdSense y SEO
const educationalTopics = {
  'Programación Básica': [
    'Cómo empezar a programar desde cero: Guía completa 2024',
    '¿Qué lenguaje de programación aprender primero?',
    'Variables y tipos de datos: Conceptos fundamentales',
    'Estructuras de control: if, for, while explicados',
    'Funciones en programación: ¿Qué son y cómo usarlas?',
    'Arrays y listas: Manejo de datos en programación',
    'Objetos y clases: Introducción a la programación orientada a objetos',
    'Debugging: Cómo encontrar y corregir errores en tu código',
    'Git y GitHub: Control de versiones para principiantes',
    'APIs: ¿Qué son y cómo consumirlas?'
  ],
  'Desarrollo Web': [
    'HTML desde cero: Estructura de páginas web',
    'CSS: Diseño y estilos para páginas web',
    'JavaScript: El lenguaje de la web moderna',
    'Responsive Design: Páginas web que se adaptan',
    'Flexbox y Grid: Layouts modernos con CSS',
    'DOM: Manipulación de elementos HTML con JavaScript',
    'Formularios web: Validación y manejo de datos',
    'AJAX: Comunicación asíncrona con el servidor',
    'Local Storage: Almacenamiento en el navegador',
    'Progressive Web Apps: Aplicaciones web modernas'
  ],
  'Frontend Frameworks': [
    'React para principiantes: Tu primera aplicación',
    'Vue.js: Framework progresivo para interfaces',
    'Angular: Desarrollo de aplicaciones escalables',
    'Svelte: El framework que compila',
    'Estado en aplicaciones: Redux, Vuex, Zustand',
    'Routing: Navegación en aplicaciones SPA',
    'Componentes reutilizables: Mejores prácticas',
    'Testing: Pruebas unitarias en frontend',
    'Build tools: Webpack, Vite, Parcel',
    'Deployment: Publicar tu aplicación web'
  ],
  'Backend y Bases de Datos': [
    'Node.js: JavaScript en el servidor',
    'Express.js: API REST con Node.js',
    'Bases de datos relacionales: SQL básico',
    'MongoDB: Base de datos NoSQL para principiantes',
    'Autenticación: Login y registro de usuarios',
    'Middleware: Procesamiento de peticiones HTTP',
    'Validación de datos: Seguridad en el backend',
    'File uploads: Subida de archivos al servidor',
    'Caching: Mejorar rendimiento con caché',
    'Testing backend: Pruebas de APIs'
  ],
  'Herramientas y Productividad': [
    'VS Code: Configuración para desarrolladores',
    'Terminal: Comandos esenciales para programadores',
    'npm y yarn: Gestión de paquetes JavaScript',
    'ESLint y Prettier: Código limpio y consistente',
    'DevTools: Debugging en el navegador',
    'Performance: Optimización de aplicaciones web',
    'Accesibilidad web: Desarrollo inclusivo',
    'SEO para desarrolladores: Optimización básica',
    'Docker: Containerización para principiantes',
    'CI/CD: Automatización de despliegues'
  ],
  'Carrera y Soft Skills': [
    'Cómo conseguir tu primer trabajo como programador',
    'Portfolio de programador: Qué proyectos incluir',
    'CV técnico: Cómo destacar como desarrollador',
    'Entrevistas técnicas: Preparación y consejos',
    'Trabajo remoto: Herramientas y mejores prácticas',
    'Comunicación efectiva para programadores',
    'Gestión del tiempo en proyectos de desarrollo',
    'Aprendizaje continuo: Mantenerse actualizado',
    'Networking: Construir una red profesional',
    'Salario de programador: Negociación y expectativas'
  ]
};

// Función para generar contenido educativo optimizado para AdSense
async function generateEducationalContent(topic, category) {
  const prompt = `Eres un experto instructor de programación que crea contenido educativo de alta calidad.

Tema: "${topic}"
Categoría: "${category}"

Crea un artículo educativo completo y detallado que incluya:

1. Una introducción clara y accesible que explique por qué es importante este tema
2. Conceptos fundamentales explicados paso a paso
3. Al menos 3 ejemplos prácticos con código (si aplica)
4. Ejercicios o actividades para practicar
5. Recursos adicionales para profundizar
6. Una conclusión con los puntos clave

REQUISITOS ESPECIALES PARA ADSENSE:
- Escribe entre 1500-2500 palabras (contenido extenso genera más ingresos)
- Incluye al menos 10 subtítulos (H2 y H3) para dividir el contenido
- Usa listas y bullet points para mejorar la legibilidad
- Incluye preguntas frecuentes al final
- Menciona herramientas, recursos y servicios relacionados
- Usa un tono educativo pero conversacional
- Incluye llamadas a la acción para mantener engagement

FORMATO HTML:
- Usa solo: <h2>, <h3>, <h4>, <p>, <ul>, <ol>, <li>, <blockquote>, <code>, <pre>, <strong>, <em>
- Estructura el contenido con buenos espacios entre secciones
- Incluye ejemplos de código en bloques <pre><code>
- Usa <blockquote> para destacar información importante

Genera SOLO el contenido HTML que va dentro del <main>, sin estructura adicional ni backticks.`;

  try {
    console.log(`🎓 Generando contenido educativo: ${topic} [${category}]`);
    
    const res = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 16000 // Más tokens para contenido extenso
        }
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000 // 90 segundos para contenido más largo
      }
    );

    let content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No se pudo obtener el contenido educativo de Gemini');
    }
    
    // Extraer metadatos mejorados
    const titleMatch = content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
    const title = titleMatch ? titleMatch[1] : topic;
    
    const summaryMatch = content.match(/<p[^>]*>([^<]{100,300})<\/p>/i);
    const summary = summaryMatch ? summaryMatch[1].substring(0, 160) + '...' : `Aprende ${topic} desde cero con esta guía completa`;
    
    // Generar slug optimizado para SEO
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 30); // Más largo para mejor SEO
    
    // Generar keywords específicas para AdSense
    const keywords = generateEducationalKeywords(topic, category, content);
    
    // Calcular tiempo de lectura
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Crear el artículo completo
    const articleData = {
      title,
      summary,
      content,
      category,
      slug,
      keywords: keywords.join(', '),
      readingTime,
      publishDate: new Date().toISOString().split('T')[0],
      educationalLevel: determineEducationalLevel(topic),
      prerequisites: generatePrerequisites(topic, category),
      learningObjectives: generateLearningObjectives(content)
    };

    return articleData;

  } catch (error) {
    console.error(`❌ Error generando contenido educativo para "${topic}":`, error.message);
    return null;
  }
}

// Función para generar keywords educativas específicas
function generateEducationalKeywords(topic, category, content) {
  const baseKeywords = [
    'aprender programación',
    'tutorial programación',
    'curso gratis',
    'programación principiantes',
    'desarrollo web',
    'coding tutorial'
  ];

  const categoryKeywords = {
    'Programación Básica': ['variables', 'funciones', 'algoritmos', 'lógica', 'sintaxis'],
    'Desarrollo Web': ['HTML', 'CSS', 'JavaScript', 'frontend', 'backend'],
    'Frontend Frameworks': ['React', 'Vue', 'Angular', 'componentes', 'estado'],
    'Backend y Bases de Datos': ['Node.js', 'API', 'SQL', 'servidor', 'autenticación'],
    'Herramientas y Productividad': ['VS Code', 'Git', 'terminal', 'debugging'],
    'Carrera y Soft Skills': ['trabajo programador', 'portfolio', 'entrevista técnica']
  };

  const contentKeywords = [];
  const lowerContent = content.toLowerCase();
  
  // Extraer keywords del contenido
  ['javascript', 'python', 'react', 'html', 'css', 'api', 'database', 'function', 'variable']
    .forEach(keyword => {
      if (lowerContent.includes(keyword)) contentKeywords.push(keyword);
    });

  return [...baseKeywords, ...(categoryKeywords[category] || []), ...contentKeywords].slice(0, 15);
}

// Función para determinar el nivel educativo
function determineEducationalLevel(topic) {
  const beginnerKeywords = ['básico', 'principiantes', 'desde cero', 'introducción', 'primer'];
  const intermediateKeywords = ['intermedio', 'avanzado', 'profundo', 'completo'];
  
  const lowerTopic = topic.toLowerCase();
  
  if (beginnerKeywords.some(keyword => lowerTopic.includes(keyword))) {
    return 'Principiante';
  } else if (intermediateKeywords.some(keyword => lowerTopic.includes(keyword))) {
    return 'Intermedio';
  }
  return 'Principiante';
}

// Función para generar prerrequisitos
function generatePrerequisites(topic, category) {
  const prerequisites = {
    'Programación Básica': ['Conocimientos básicos de computación'],
    'Desarrollo Web': ['Conceptos básicos de programación', 'Uso básico de navegador web'],
    'Frontend Frameworks': ['HTML, CSS, JavaScript básico'],
    'Backend y Bases de Datos': ['JavaScript fundamentals', 'Conceptos de web'],
    'Herramientas y Productividad': ['Conocimientos básicos de programación'],
    'Carrera y Soft Skills': ['Interés en programación']
  };
  
  return prerequisites[category] || ['Ninguno - Apto para principiantes'];
}

// Función para generar objetivos de aprendizaje
function generateLearningObjectives(content) {
  const objectives = [];
  
  if (content.includes('ejemplo')) objectives.push('Aplicar conceptos con ejemplos prácticos');
  if (content.includes('código')) objectives.push('Escribir código funcional');
  if (content.includes('proyecto')) objectives.push('Desarrollar proyectos reales');
  if (content.includes('herramienta')) objectives.push('Dominar herramientas del desarrollo');
  
  if (objectives.length === 0) {
    objectives.push('Comprender conceptos fundamentales', 'Aplicar conocimientos en práctica');
  }
  
  return objectives;
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const countArg = args.find(arg => arg.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1]) : 3;

  console.log(`🚀 Iniciando generación de ${count} artículos educativos optimizados para AdSense...`);

  // Crear directorios necesarios
  const outputDir = path.join(__dirname, 'generated-html');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(EDUCATIONAL_DIR)) {
    fs.mkdirSync(EDUCATIONAL_DIR, { recursive: true });
  }

  const allTopics = Object.values(educationalTopics).flat();
  const selectedTopics = [];
  
  // Seleccionar temas diversos
  const categories = Object.keys(educationalTopics);
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const topics = educationalTopics[category];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    selectedTopics.push({ topic, category });
  }

  const generatedArticles = [];

  for (const { topic, category } of selectedTopics) {
    const articleData = await generateEducationalContent(topic, category);
    
    if (articleData) {
      // Generar archivo HTML usando template educativo
      await generateEducationalHTML(articleData, outputDir);
      generatedArticles.push(articleData);
      
      // Esperar entre generaciones para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Guardar índice de artículos generados
  const indexPath = path.join(__dirname, 'generated-educational-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(generatedArticles, null, 2));

  console.log(`✅ Generados ${generatedArticles.length} artículos educativos optimizados para AdSense`);
  console.log(`📁 Archivos guardados en: ${outputDir}`);
  console.log(`📋 Índice guardado en: ${indexPath}`);
}

// Función para generar HTML educativo
async function generateEducationalHTML(articleData, outputDir) {
  try {
    // Leer template educativo
    const templatePath = path.join(__dirname, '../templates/educational-article-template.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Reemplazar placeholders
    template = template
      .replace(/{{TITLE}}/g, articleData.title)
      .replace(/{{SEO_TITLE}}/g, `${articleData.title} | Aprende Programación Gratis`)
      .replace(/{{SEO_DESCRIPTION}}/g, articleData.summary)
      .replace(/{{SEO_KEYWORDS}}/g, articleData.keywords)
      .replace(/{{CONTENT}}/g, articleData.content)
      .replace(/{{CATEGORY}}/g, articleData.category)
      .replace(/{{READING_TIME}}/g, articleData.readingTime)
      .replace(/{{PUBLISH_DATE}}/g, articleData.publishDate)
      .replace(/{{EDUCATIONAL_LEVEL}}/g, articleData.educationalLevel)
      .replace(/{{PREREQUISITES}}/g, articleData.prerequisites.join(', '))
      .replace(/{{LEARNING_OBJECTIVES}}/g, articleData.learningObjectives.map(obj => `<li>${obj}</li>`).join(''))
      .replace(/{{CANONICAL_URL}}/g, `https://hgaruna.org/aprende-programacion/${articleData.slug}.html`)
      .replace(/{{FEATURED_IMAGE}}/g, `https://hgaruna.org/logos-he-imagenes/education-${articleData.slug}.jpg`);

    // Guardar archivo HTML
    const fileName = `${articleData.slug}.html`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, template);
    
    console.log(`✅ Artículo educativo generado: ${fileName}`);
    
  } catch (error) {
    console.error(`❌ Error generando HTML educativo:`, error.message);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateEducationalContent };
