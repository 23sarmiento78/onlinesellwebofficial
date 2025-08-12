import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

config({ path: '.env.local' });

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de la API de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro-latest",  // Usando el modelo gratuito más reciente
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE"
    }
  ],
  generationConfig: {
    temperature: 0.6,    // Más conservador para mantener coherencia
    topK: 20,           // Reducido para mayor precisión
    topP: 0.85,         // Más conservador
    maxOutputTokens: 4096 // Ajustado para límites del modelo gratuito
  }
});

const EBOOK_TOPICS = {
  'JavaScript Moderno': {
    title: 'JavaScript Moderno 2024: Guía Completa para Desarrolladores',
    description: 'Domina JavaScript desde ES6 hasta las últimas funcionalidades con ejemplos prácticos y proyectos reales.',
    chapters: [
      'Introducción a JavaScript Moderno',
      'ES6+ Características Esenciales',
      'Programación Asíncrona Avanzada',
      'Módulos y Bundlers Modernos',
      'Testing y Depuración',
      'Optimización y Performance',
      'Frameworks y Librerías',
      'Mejores Prácticas y Patrones'
    ]
  },
  'React Avanzado': {
    title: 'React Avanzado: Técnicas Pro para Aplicaciones Escalables',
    description: 'Técnicas avanzadas de React para crear aplicaciones robustas y escalables.',
    chapters: [
      'Arquitectura de Aplicaciones React',
      'Hooks Avanzados y Personalizados',
      'Context API y State Management',
      'Performance y Optimización',
      'Testing en React',
      'Server-Side Rendering (SSR)',
      'Patrones de Diseño en React',
      'Deployment y Monitoreo'
    ]
  },
  'Python para IA': {
    title: 'Python para Inteligencia Artificial: De Básico a Experto',
    description: 'Aprende a usar Python para proyectos de IA y Machine Learning con casos prácticos.',
    chapters: [
      'Fundamentos de Python para IA',
      'NumPy y Manipulación de Datos',
      'Pandas para Análisis de Datos',
      'Matplotlib y Visualización',
      'Scikit-learn y ML Básico',
      'Deep Learning con TensorFlow',
      'Procesamiento de Lenguaje Natural',
      'Proyectos Prácticos de IA'
    ]
  },
  'DevOps Completo': {
    title: 'DevOps Completo: Automatización y CI/CD Profesional',
    description: 'Guía completa de DevOps desde conceptos básicos hasta implementación empresarial.',
    chapters: [
      'Introducción a DevOps',
      'Control de Versiones con Git',
      'Contenedores con Docker',
      'Orquestación con Kubernetes',
      'CI/CD con GitHub Actions',
      'Infraestructura como Código',
      'Monitoreo y Logging',
      'Seguridad en DevOps'
    ]
  },
  'Backend con Node.js': {
    title: 'Backend Profesional con Node.js: APIs REST y GraphQL',
    description: 'Desarrolla backends robustos y escalables con Node.js y las mejores prácticas.',
    chapters: [
      'Fundamentos de Node.js',
      'Express.js y Middleware',
      'Bases de Datos y ORMs',
      'Autenticación y Autorización',
      'APIs REST Profesionales',
      'GraphQL Implementation',
      'Testing y Documentación',
      'Deployment y Escalabilidad'
    ]
  },
  'Frontend Moderno': {
    title: 'Frontend Moderno: Herramientas y Técnicas Actuales',
    description: 'Domina las herramientas y técnicas más actuales del desarrollo frontend.',
    chapters: [
      'HTML5 y CSS3 Avanzado',
      'JavaScript ES2024',
      'Frameworks Modernos',
      'Build Tools y Bundlers',
      'CSS-in-JS y Styling',
      'Progressive Web Apps',
      'Performance Web',
      'Accesibilidad y UX'
    ]
  }
};

async function generateChapterContent(topic, chapterTitle, chapterNumber, totalChapters) {
  const prompt = `
Genera el contenido completo para el capítulo "${chapterTitle}" de un eBook sobre "${topic}".

ESPECIFICACIONES:
- Este es el capítulo ${chapterNumber} de ${totalChapters} capítulos totales
- El contenido debe ser profesional, educativo y práctico
- Incluir ejemplos de código cuando sea relevante
- Usar markdown para el formato
- Longitud: 2000-3000 palabras
- Incluir ejercicios prácticos al final
- Añadir tips y mejores prácticas

ESTRUCTURA REQUERIDA:
1. Introducción al tema del capítulo
2. Conceptos fundamentales
3. Ejemplos prácticos con código
4. Casos de uso reales
5. Mejores prácticas
6. Ejercicios y proyectos
7. Resumen y siguientes pasos

Asegúrate de que el contenido sea:
- Actualizado y relevante para 2024
- Progresivo (considerando capítulos anteriores)
- Práctico con ejemplos reales
- Bien estructurado y fácil de seguir

Responde ÚNICAMENTE con el contenido del capítulo en formato markdown, sin introducción ni explicaciones adicionales.
`;

  try {
    console.log(`\n📝 Generando capítulo ${chapterNumber}: ${chapterTitle}...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    let errorMessage = `Error al generar capítulo ${chapterNumber}`;
    const isCI = process.env.CI === 'true';
    
    if (error.status === 404) {
      errorMessage = 'Error al acceder al modelo gemini-1.5-pro-latest. Verifica que el modelo esté disponible en tu región.';
    } else if (error.message.includes('api key')) {
      errorMessage = isCI 
        ? 'Error de autenticación con la API de Gemini. Verifica el secret GEMINI_API_KEY en GitHub Actions.'
        : 'Error de autenticación con la API de Gemini. Verifica tu API key en .env.local.';
    }
    console.error(`❌ ${errorMessage}:`, error);
    return `# ${chapterTitle}\n\n*${errorMessage}*`;
  }
}

async function generateIntroduction(topic, bookInfo) {
  const prompt = `
Genera una introducción completa para un eBook titulado "${bookInfo.title}".

DESCRIPCIÓN: ${bookInfo.description}

CAPÍTULOS INCLUIDOS:
${bookInfo.chapters.map((chapter, index) => `${index + 1}. ${chapter}`).join('\n')}

La introducción debe incluir:
1. Bienvenida y motivación
2. Para quién está dirigido este libro
3. Qué aprenderás
4. Cómo usar este libro
5. Prerrequisitos
6. Estructura del libro
7. Recursos adicionales y comunidad

Escribe en tono profesional pero accesible, motivacional y que genere expectativa.
Longitud: 800-1200 palabras.
Formato: Markdown

Responde ÚNICAMENTE con el contenido de la introducción en markdown.
`;

  try {
    console.log('📖 Generando introducción...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    let errorMessage = 'Error al generar la introducción';
    if (error.status === 404) {
      errorMessage = 'La API de Gemini v1beta no está disponible. Por favor, verifica la versión de la API.';
    } else if (error.message.includes('api key')) {
      errorMessage = 'Error de autenticación con la API de Gemini. Verifica tu API key.';
    }
    console.error(`❌ ${errorMessage}:`, error);
    return `# Introducción\n\n*${errorMessage}*`;
  }
}

async function generateConclusion(topic, bookInfo) {
  const prompt = `
Genera una conclusión impactante para el eBook "${bookInfo.title}".

La conclusión debe incluir:
1. Resumen de lo aprendido
2. Siguientes pasos recomendados
3. Recursos para continuar aprendiendo
4. Motivación para seguir creciendo
5. Invitación a la comunidad
6. Agradecimientos
7. Información de contacto y redes sociales

Tono: Inspiracional, motivador y que deje al lector con ganas de aplicar lo aprendido.
Longitud: 600-800 palabras.
Formato: Markdown

Responde ÚNICAMENTE con el contenido de la conclusión en markdown.
`;

  try {
    console.log('🎯 Generando conclusión...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    let errorMessage = 'Error al generar la conclusión';
    if (error.status === 404) {
      errorMessage = 'La API de Gemini v1beta no está disponible. Por favor, verifica la versión de la API.';
    } else if (error.message.includes('api key')) {
      errorMessage = 'Error de autenticación con la API de Gemini. Verifica tu API key.';
    }
    console.error(`❌ ${errorMessage}:`, error);
    return `# Conclusión\n\n*${errorMessage}*`;
  }
}

async function createEbookStructure(topic, chaptersCount) {
  const bookInfo = EBOOK_TOPICS[topic];
  if (!bookInfo) {
    throw new Error(`Tema no encontrado: ${topic}`);
  }

  // Ajustar número de capítulos si es necesario
  const selectedChapters = bookInfo.chapters.slice(0, parseInt(chaptersCount));
  
  console.log(`\n🚀 Generando eBook: ${bookInfo.title}`);
  console.log(`📊 Capítulos: ${selectedChapters.length}`);
  
  // Crear directorio para el eBook
  const ebookDir = join(process.cwd(), 'public', 'ebooks');
  const currentEbookDir = join(ebookDir, `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`);
  
  await fs.mkdir(ebookDir, { recursive: true });
  await fs.mkdir(currentEbookDir, { recursive: true });
  
  // Generar contenido
  let fullContent = `# ${bookInfo.title}\n\n`;
  fullContent += `**Autor:** hgaruna.com\n`;
  fullContent += `**Fecha:** ${new Date().toLocaleDateString('es-ES')}\n`;
  fullContent += `**Versión:** 1.0\n\n`;
  fullContent += `---\n\n`;
  
  // Introducción
  const introduction = await generateIntroduction(topic, { ...bookInfo, chapters: selectedChapters });
  fullContent += introduction + '\n\n---\n\n';
  
  // Tabla de contenidos
  fullContent += `# Tabla de Contenidos\n\n`;
  selectedChapters.forEach((chapter, index) => {
    fullContent += `${index + 1}. [${chapter}](#capítulo-${index + 1}-${chapter.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')})\n`;
  });
  fullContent += '\n---\n\n';
  
  // Generar capítulos
  for (let i = 0; i < selectedChapters.length; i++) {
    const chapterContent = await generateChapterContent(
      topic, 
      selectedChapters[i], 
      i + 1, 
      selectedChapters.length
    );
    
    fullContent += `# Capítulo ${i + 1}: ${selectedChapters[i]}\n\n`;
    fullContent += chapterContent + '\n\n---\n\n';
    
    // Pausa para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Conclusión
  const conclusion = await generateConclusion(topic, { ...bookInfo, chapters: selectedChapters });
  fullContent += conclusion + '\n\n';
  
  // Pie de página
  fullContent += `---\n\n`;
  fullContent += `**© 2024 hgaruna.com**\n\n`;
  fullContent += `Este eBook fue generado automáticamente usando IA. Para la versión completa y actualizaciones, visita [hgaruna.com](https://hgaruna.netlify.app)\n\n`;
  fullContent += `**Síguenos:**\n`;
  fullContent += `- 🌐 Web: https://hgaruna.netlify.app\n`;
  fullContent += `- 📧 Email: contacto@hgaruna.com\n`;
  fullContent += `- 💬 WhatsApp: [Contactar para versión premium](https://wa.me/message/...)\n\n`;
  
  // Guardar versión completa
  const fullEbookPath = join(currentEbookDir, 'ebook-completo.md');
  await fs.writeFile(fullEbookPath, fullContent, 'utf8');
  
  // Crear versión gratuita (primeros 3 capítulos)
  const freeChapters = 3;
  const contentLines = fullContent.split('\n');
  let freeContent = '';
  let chapterCount = 0;
  let inChapter = false;
  
  for (const line of contentLines) {
    if (line.startsWith('# Capítulo ')) {
      chapterCount++;
      if (chapterCount > freeChapters) {
        freeContent += `# Capítulo ${chapterCount}: ${selectedChapters[chapterCount - 1]}\n\n`;
        freeContent += `> **🔒 Contenido Premium**\n>\n`;
        freeContent += `> Este capítulo está disponible en la versión completa del eBook.\n>\n`;
        freeContent += `> [Contactar por WhatsApp para obtener versión completa](https://wa.me/message/...)\n\n`;
        freeContent += `---\n\n`;
        continue;
      }
      inChapter = true;
    }
    
    if (chapterCount <= freeChapters || !inChapter) {
      freeContent += line + '\n';
    }
  }
  
  // Agregar mensaje de promoción al final de la versión gratuita
  freeContent += `\n## 🎁 ¿Te gustó esta muestra?\n\n`;
  freeContent += `Esta es solo una **muestra gratuita** de "${bookInfo.title}".\n\n`;
  freeContent += `### 📚 La versión completa incluye:\n`;
  freeContent += `- ${selectedChapters.length} capítulos completos\n`;
  freeContent += `- Proyectos prácticos paso a paso\n`;
  freeContent += `- Código fuente de todos los ejemplos\n`;
  freeContent += `- Ejercicios con soluciones\n`;
  freeContent += `- Recursos adicionales y plantillas\n`;
  freeContent += `- Actualizaciones gratuitas de por vida\n`;
  freeContent += `- Acceso a comunidad privada\n\n`;
  freeContent += `### 💬 Obtener Versión Completa\n`;
  freeContent += `Contacta por WhatsApp para obtener la versión completa:\n`;
  freeContent += `[**👉 Contactar por WhatsApp**](https://wa.me/message/...)\n\n`;
  freeContent += `**Precio especial de lanzamiento:** $19.99 USD\n`;
  freeContent += `*(Precio regular: $39.99)*\n\n`;
  
  // Guardar versión gratuita
  const freeEbookPath = join(currentEbookDir, 'ebook-gratis.md');
  await fs.writeFile(freeEbookPath, freeContent, 'utf8');
  
  // Crear archivo de metadatos
  const metadata = {
    title: bookInfo.title,
    description: bookInfo.description,
    topic: topic,
    chapters: selectedChapters.length,
    totalChapters: selectedChapters,
    generatedAt: new Date().toISOString(),
    version: '1.0',
    author: 'hgaruna.com',
    language: 'es',
    paths: {
      full: fullEbookPath,
      free: freeEbookPath,
      directory: currentEbookDir
    },
    stats: {
      fullWords: fullContent.split(' ').length,
      freeWords: freeContent.split(' ').length,
      estimatedReadingTime: Math.ceil(fullContent.split(' ').length / 200)
    }
  };
  
  const metadataPath = join(currentEbookDir, 'metadata.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf8');
  
  // Actualizar índice de eBooks
  await updateEbooksIndex(metadata);
  
  console.log('\n✅ eBook generado exitosamente!');
  console.log(`📁 Directorio: ${currentEbookDir}`);
  console.log(`📊 Estadísticas:`);
  console.log(`   - Capítulos: ${selectedChapters.length}`);
  console.log(`   - Palabras (completo): ${metadata.stats.fullWords.toLocaleString()}`);
  console.log(`   - Palabras (gratis): ${metadata.stats.freeWords.toLocaleString()}`);
  console.log(`   - Tiempo estimado de lectura: ${metadata.stats.estimatedReadingTime} minutos`);
  
  return metadata;
}

async function updateEbooksIndex(metadata) {
  const indexPath = join(process.cwd(), 'public', 'ebooks', 'index.json');
  
  let index = { ebooks: [] };
  try {
    const indexContent = await fs.readFile(indexPath, 'utf8');
    index = JSON.parse(indexContent);
  } catch (error) {
    // El archivo no existe, se creará uno nuevo
  }
  
  // Agregar nuevo eBook al índice
  index.ebooks.unshift({
    id: Date.now(),
    title: metadata.title,
    description: metadata.description,
    topic: metadata.topic,
    chapters: metadata.chapters,
    generatedAt: metadata.generatedAt,
    version: metadata.version,
    stats: metadata.stats,
    featured: true, // El más reciente es featured
    paths: {
      free: metadata.paths.free.replace(process.cwd() + '/public', ''),
      full: metadata.paths.full.replace(process.cwd() + '/public', ''),
      directory: metadata.paths.directory.replace(process.cwd() + '/public', '')
    }
  });
  
  // Marcar otros eBooks como no featured
  index.ebooks.forEach((ebook, i) => {
    if (i > 0) ebook.featured = false;
  });
  
  // Mantener solo los últimos 10 eBooks
  index.ebooks = index.ebooks.slice(0, 10);
  
  // Actualizar metadata del índice
  index.lastUpdated = new Date().toISOString();
  index.totalEbooks = index.ebooks.length;
  
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
  
  console.log('📇 Índice de eBooks actualizado');
}

async function validateGeminiApiKey() {
  const isCI = process.env.CI === 'true';

  if (!process.env.GEMINI_API_KEY) {
    if (isCI) {
      throw new Error('GEMINI_API_KEY no está configurada en GitHub Actions. Por favor, verifica los secrets del repositorio.');
    } else {
      throw new Error('GEMINI_API_KEY no está configurada. Por favor, configura la variable GEMINI_API_KEY en el archivo .env.local');
    }
  }
  
  if (!isCI && process.env.GEMINI_API_KEY === 'your_api_key_here') {
    throw new Error('GEMINI_API_KEY tiene un valor de placeholder. Por favor, reemplaza "your_api_key_here" con tu API key real en el archivo .env.local');
  }
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    await model.generateContent("Test"); // Prueba simple para validar la API key
  } catch (error) {
    if (error.status === 404) {
      throw new Error('La API de Gemini v1beta no está disponible. Por favor, verifica la versión de la API o contacta al soporte de Google.');
    }
    throw new Error(`Error validando GEMINI_API_KEY: ${error.message}`);
  }
}

async function main() {
  try {
    // Validar API key antes de continuar
    await validateGeminiApiKey();
    
    const topic = process.env.EBOOK_TOPIC || 'JavaScript Moderno';
    const chaptersCount = process.env.CHAPTERS_COUNT || '8';
    
    console.log(`🎯 Tema: ${topic}`);
    console.log(`📖 Capítulos: ${chaptersCount}`);
    
    const metadata = await createEbookStructure(topic, chaptersCount);
    
    console.log('\n🎉 ¡Proceso completado exitosamente!');
    return metadata;
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createEbookStructure, updateEbooksIndex };
