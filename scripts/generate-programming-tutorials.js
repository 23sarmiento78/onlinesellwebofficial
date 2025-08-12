// scripts/generate-programming-tutorials.js
// Genera tutoriales de programación paso a paso usando Gemini

import fs from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TEMPLATE_PATH = resolve(__dirname, '../templates/article-template.html');
const OUTPUT_DIR = resolve(__dirname, '../public/blog');

if (!GEMINI_API_KEY) {
  console.error('❌ Falta la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}

// Tutoriales de programación paso a paso
const programmingTutorials = {
  'JavaScript': [
    'Crear una calculadora con JavaScript desde cero',
    'Todo List app con JavaScript vanilla',
    'Juego de memoria con JavaScript',
    'API Weather App con JavaScript',
    'Slider de imágenes interactivo',
    'Validador de formularios JavaScript',
    'Cronómetro digital con JavaScript',
    'Generador de contraseñas aleatorias'
  ],
  'React': [
    'Primera app React: Lista de tareas',
    'E-commerce básico con React',
    'Blog personal con React y Markdown',
    'Chat en tiempo real con React',
    'Dashboard de analytics con React',
    'Galería de fotos con React',
    'Buscador de películas con React',
    'App de notas con React Hooks'
  ],
  'Node.js': [
    'API REST completa con Express',
    'Sistema de autenticación con JWT',
    'Chat server con Socket.io',
    'File upload system con Multer',
    'Blog backend con MongoDB',
    'URL Shortener con Node.js',
    'Email sender con Nodemailer',
    'Rate limiting y middleware'
  ],
  'CSS': [
    'Landing page responsive desde cero',
    'Animaciones CSS avanzadas',
    'Grid layout moderno con CSS',
    'Dark mode toggle con CSS',
    'Loader animations con CSS',
    'Card components con CSS',
    'Navigation menu responsive',
    'Form styling moderno'
  ],
  'Python': [
    'Web scraper con BeautifulSoup',
    'API REST con FastAPI',
    'Chatbot básico con Python',
    'Analizador de datos con Pandas',
    'Juego de adivinanzas en Python',
    'Generador de QR codes',
    'Password manager con Python',
    'Email automation con Python'
  ]
};

// Función para generar tutorial paso a paso
async function generateProgrammingTutorial(topic, language) {
  const prompt = `Eres un instructor experto de programación que crea tutoriales prácticos paso a paso.

Lenguaje/Tecnología: "${language}"
Proyecto: "${topic}"

Crea un tutorial completo y práctico que incluya:

1. Introducción del proyecto y objetivos
2. Requisitos previos y herramientas necesarias
3. Estructura del proyecto (archivos y carpetas)
4. Desarrollo paso a paso con código completo
5. Explicación detallada de cada paso
6. Testing y debugging
7. Posibles mejoras y extensiones
8. Conclusión y recursos adicionales

REQUISITOS TÉCNICOS:
- Código funcional y completo (no fragmentos)
- Explicaciones claras de cada línea importante
- Buenas prácticas y patrones de desarrollo
- Manejo de errores donde sea necesario
- Comentarios en el código cuando sea útil
- Al menos 2000 palabras de contenido
- Incluir capturas de pantalla conceptuales (describe qué se vería)

ESTRUCTURA HTML:
- Usa: <h2>, <h3>, <h4>, <p>, <ul>, <ol>, <li>, <blockquote>, <code>, <pre>, <strong>, <em>
- Código en bloques <pre><code class="language-${language.toLowerCase()}">
- Usa <blockquote> para tips importantes
- Divide en secciones claras con subtítulos

Genera SOLO el contenido HTML que va dentro del <main>, sin estructura adicional ni backticks.`;

  try {
    console.log(`💻 Generando tutorial: ${topic} [${language}]`);
    
    const res = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 16000
        }
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000
      }
    );

    let content = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No se pudo obtener el contenido del tutorial de Gemini');
    }
    
    // Extraer metadatos
    const titleMatch = content.match(/<h2[^>]*>([^<]+)<\/h2>/i);
    const title = titleMatch ? titleMatch[1] : topic;
    
    const summaryMatch = content.match(/<p[^>]*>([^<]{100,300})<\/p>/i);
    const summary = summaryMatch ? summaryMatch[1].substring(0, 160) + '...' : `Tutorial completo: ${topic} con ${language}`;
    
    // Generar slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40);
    
    // Generar keywords
    const keywords = generateTutorialKeywords(topic, language, content);
    
    // Calcular tiempo de lectura
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Determinar dificultad
    const difficulty = determineDifficulty(topic, content);
    
    // Crear el artículo completo
    const articleData = {
      title,
      summary,
      content,
      category: 'Tutorial',
      language,
      slug,
      keywords: keywords.join(', '),
      readingTime,
      publishDate: new Date().toISOString().split('T')[0],
      difficulty,
      projectType: determineProjectType(topic),
      technologies: extractTechnologies(content, language)
    };

    return articleData;

  } catch (error) {
    console.error(`❌ Error generando tutorial para "${topic}":`, error.message);
    return null;
  }
}

// Función para generar keywords de tutorial
function generateTutorialKeywords(topic, language, content) {
  const baseKeywords = [
    'tutorial programación',
    'proyecto programación',
    'código paso a paso',
    'desarrollo web',
    'programming tutorial',
    language.toLowerCase()
  ];

  const languageKeywords = {
    'JavaScript': ['js', 'vanilla javascript', 'frontend', 'dom'],
    'React': ['react.js', 'components', 'hooks', 'jsx'],
    'Node.js': ['nodejs', 'backend', 'express', 'npm'],
    'CSS': ['styles', 'responsive', 'flexbox', 'grid'],
    'Python': ['python3', 'script', 'automation', 'backend']
  };

  const contentKeywords = [];
  const lowerContent = content.toLowerCase();
  
  // Extraer keywords técnicas del contenido
  ['api', 'database', 'authentication', 'responsive', 'animation', 'async', 'fetch', 'crud']
    .forEach(keyword => {
      if (lowerContent.includes(keyword)) contentKeywords.push(keyword);
    });

  return [...baseKeywords, ...(languageKeywords[language] || []), ...contentKeywords].slice(0, 12);
}

// Función para determinar dificultad
function determineDifficulty(topic, content) {
  const beginnerWords = ['básico', 'simple', 'primer', 'introducción', 'desde cero'];
  const intermediateWords = ['intermedio', 'api', 'database', 'authentication'];
  const advancedWords = ['avanzado', 'optimización', 'performance', 'complejo'];
  
  const lowerTopic = topic.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  if (advancedWords.some(word => lowerTopic.includes(word) || lowerContent.includes(word))) {
    return 'Avanzado';
  } else if (intermediateWords.some(word => lowerTopic.includes(word) || lowerContent.includes(word))) {
    return 'Intermedio';
  }
  return 'Principiante';
}

// Función para determinar tipo de proyecto
function determineProjectType(topic) {
  const lowerTopic = topic.toLowerCase();
  
  if (lowerTopic.includes('app') || lowerTopic.includes('aplicación')) return 'Aplicación';
  if (lowerTopic.includes('api') || lowerTopic.includes('backend')) return 'Backend';
  if (lowerTopic.includes('web') || lowerTopic.includes('landing')) return 'Website';
  if (lowerTopic.includes('juego') || lowerTopic.includes('game')) return 'Juego';
  if (lowerTopic.includes('chat') || lowerTopic.includes('social')) return 'Social';
  
  return 'Proyecto Web';
}

// Función para extraer tecnologías
function extractTechnologies(content, language) {
  const technologies = [language];
  const lowerContent = content.toLowerCase();
  
  const techMap = {
    'html': 'HTML',
    'css': 'CSS', 
    'javascript': 'JavaScript',
    'react': 'React',
    'node': 'Node.js',
    'express': 'Express',
    'mongodb': 'MongoDB',
    'mysql': 'MySQL',
    'bootstrap': 'Bootstrap',
    'tailwind': 'Tailwind CSS'
  };
  
  Object.entries(techMap).forEach(([key, value]) => {
    if (lowerContent.includes(key) && !technologies.includes(value)) {
      technologies.push(value);
    }
  });
  
  return technologies;
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const countArg = args.find(arg => arg.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1]) : 2;

  console.log(`🚀 Iniciando generación de ${count} tutoriales de programación...`);

  // Crear directorio de salida
  const outputDir = join(__dirname, 'generated-tutorials');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Seleccionar tutoriales diversos
  const languages = Object.keys(programmingTutorials);
  const selectedTutorials = [];
  
  for (let i = 0; i < count; i++) {
    const language = languages[i % languages.length];
    const tutorials = programmingTutorials[language];
    const topic = tutorials[Math.floor(Math.random() * tutorials.length)];
    selectedTutorials.push({ topic, language });
  }

  const generatedTutorials = [];

  for (const { topic, language } of selectedTutorials) {
    const tutorialData = await generateProgrammingTutorial(topic, language);
    
    if (tutorialData) {
      // Generar archivo HTML
      await generateTutorialHTML(tutorialData, outputDir);
      generatedTutorials.push(tutorialData);
      
      // Esperar entre generaciones
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Guardar índice
  const indexPath = join(__dirname, 'generated-tutorials-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(generatedTutorials, null, 2));

  console.log(`✅ Generados ${generatedTutorials.length} tutoriales de programación`);
  console.log(`📁 Archivos guardados en: ${outputDir}`);
  console.log(`📋 Índice guardado en: ${indexPath}`);
}

// Función para generar HTML del tutorial
async function generateTutorialHTML(tutorialData, outputDir) {
  try {
    // Usar template básico si no existe el específico para tutoriales
    let templatePath = join(__dirname, '../templates/tutorial-template.html');
    if (!fs.existsSync(templatePath)) {
      templatePath = join(__dirname, '../templates/article-template.html');
    }
    
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Reemplazar placeholders
    template = template
      .replace(/{{TITLE}}/g, tutorialData.title)
      .replace(/{{SEO_TITLE}}/g, `${tutorialData.title} | Tutorial ${tutorialData.language}`)
      .replace(/{{SEO_DESCRIPTION}}/g, tutorialData.summary)
      .replace(/{{SEO_KEYWORDS}}/g, tutorialData.keywords)
      .replace(/{{CONTENT}}/g, tutorialData.content)
      .replace(/{{CATEGORY}}/g, tutorialData.category)
      .replace(/{{LANGUAGE}}/g, tutorialData.language)
      .replace(/{{READING_TIME}}/g, tutorialData.readingTime)
      .replace(/{{PUBLISH_DATE}}/g, tutorialData.publishDate)
      .replace(/{{DIFFICULTY}}/g, tutorialData.difficulty)
      .replace(/{{PROJECT_TYPE}}/g, tutorialData.projectType)
      .replace(/{{TECHNOLOGIES}}/g, tutorialData.technologies.join(', '))
      .replace(/{{CANONICAL_URL}}/g, `https://hgaruna.org/tutoriales/${tutorialData.slug}.html`);

    // Guardar archivo HTML
    const fileName = `${tutorialData.slug}.html`;
    const filePath = join(outputDir, fileName);
    fs.writeFileSync(filePath, template);
    
    console.log(`✅ Tutorial generado: ${fileName}`);
    
  } catch (error) {
    console.error(`❌ Error generando HTML del tutorial:`, error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { generateProgrammingTutorial };
