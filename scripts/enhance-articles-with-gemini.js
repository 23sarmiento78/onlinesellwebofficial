// scripts/enhance-articles-with-gemini.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de rutas
const BLOG_DIR = path.resolve(__dirname, '../public/blog');
const EDUCATIONAL_DIR = path.resolve(__dirname, '../public/aprende-programacion');
const TEMPLATE_PATH = path.resolve(__dirname, '../templates/educational-article-template.html');

// Configuración de Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'TU_API_KEY_AQUI';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Modelo y configuración
const MODEL_NAME = 'gemini-1.5-flash';
const MAX_OUTPUT_TOKENS = 1000; // menos tokens para reducir carga
const ARTICLE_DELAY_MS = 1200; // pausa entre artículos

// Leer la plantilla base
let TEMPLATE_CONTENT = '';
try {
  TEMPLATE_CONTENT = fs.readFileSync(TEMPLATE_PATH, 'utf8');
} catch (error) {
  console.error('Error al leer la plantilla:', error.message);
  process.exit(1);
}

// Función con reintentos y backoff exponencial
async function generateWithGemini(prompt, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          topP: 0.9,
          topK: 40,
        },
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text().trim();

    } catch (error) {
      const isOverloaded = error.message.includes('503');
      if (isOverloaded && attempt < retries) {
        console.warn(`⚠️ Gemini saturado. Reintentando en ${delay * attempt}ms... (Intento ${attempt}/${retries})`);
        await new Promise(res => setTimeout(res, delay * attempt));
      } else {
        console.error('❌ Error al generar con Gemini:', error.message);
        return null;
      }
    }
  }
}

// Generar objetivos de aprendizaje
async function generateLearningObjectives(articleContent, articleTitle, category = 'Programación') {
  const prompt = `Eres un experto en crear objetivos de aprendizaje claros y específicos para artículos educativos de ${category}.

Título del artículo: ${articleTitle}

Contenido del artículo:
${articleContent.substring(0, 5000)}...

Por favor, genera entre 3 y 5 objetivos de aprendizaje específicos y medibles para este artículo. Los objetivos deben:
1. Estar escritos en tiempo verbal de infinitivo
2. Ser concretos y específicos
3. Ser alcanzables después de leer el artículo
4. Incluir verbos de acción como "identificar", "aplicar", "crear", etc.

Formato de salida (solo la lista en formato HTML):
<ul class="learning-objectives">
  <li><i class="fas fa-check-circle"></i> Objetivo 1</li>
  <li><i class="fas fa-check-circle"></i> Objetivo 2</li>
  <li><i class="fas fa-check-circle"></i> Objetivo 3</li>
</ul>`;
  return await generateWithGemini(prompt) 
    || '<ul class="learning-objectives"><li>No se pudieron generar objetivos de aprendizaje.</li></ul>';
}

// Generar ejercicios prácticos
async function generateExercises(articleContent, articleTitle, category = 'Programación') {
  const prompt = `Eres un experto en crear ejercicios prácticos para artículos educativos de ${category}.

Título del artículo: ${articleTitle}

Contenido del artículo:
${articleContent.substring(0, 5000)}...

Por favor, genera entre 2 y 3 ejercicios prácticos relacionados con este artículo. Para cada ejercicio, incluye:
1. Un título descriptivo
2. Instrucciones claras
3. Un ejemplo de entrada/salida si es aplicable
4. Pistas o sugerencias para resolverlo

Formato de salida (en HTML):
<div class="exercise">
  <h4>Ejercicio 1: [Título]</h4>
  <div class="exercise-content">
    <p><strong>Instrucciones:</strong> [Instrucciones detalladas]</p>
    <div class="example">
      <p><strong>Ejemplo:</strong></p>
      <p><strong>Entrada:</strong> [ejemplo de entrada]</p>
      <p><strong>Salida esperada:</strong> [ejemplo de salida]</p>
    </div>
    <div class="hints">
      <p><strong>Pistas:</strong></p>
      <ul>
        <li>Pista 1</li>
        <li>Pista 2</li>
      </ul>
    </div>
  </div>
</div>`;
  return await generateWithGemini(prompt) 
    || '<div class="exercise"><p>No se pudieron generar ejercicios.</p></div>';
}

// Extraer metadatos
function extractMetadata(html) {
  const $ = cheerio.load(html);
  return {
    title: $('title').first().text().trim(),
    description: $('meta[name="description"]').attr('content') || '',
    category: $('meta[name="category"]').attr('content') || 'Programación',
    keywords: $('meta[name="keywords"]').attr('content') || '',
    readingTime: $('meta[name="reading-time"]').attr('content') || '5 min',
    featuredImage: $('meta[property="og:image"]').attr('content') || ''
  };
}

// Procesar un artículo
async function processArticle(filePath) {
  try {
    console.log(`\n📝 Procesando: ${path.basename(filePath)}`);
    const html = await fs.promises.readFile(filePath, 'utf8');
    const $ = cheerio.load(html);
    const metadata = extractMetadata(html);
    const content = $('article').first().html() || $('.article-content').first().html() || $('main').html() || $('body').html();

    if (html.includes('class="generated-content"')) {
      console.log('  - Ya tiene contenido generado. Saltando...');
      return;
    }

    console.log('  - Generando contenido educativo...');
    const [learningObjectives, exercises] = await Promise.all([
      generateLearningObjectives(content, metadata.title, metadata.category),
      generateExercises(content, metadata.title, metadata.category)
    ]);

    const template = cheerio.load(TEMPLATE_CONTENT);
    template('article').html(content);
    template('article').append(`
      <section class="learning-objectives-section mb-4">
        <h2><i class="fas fa-bullseye me-2"></i>Objetivos de Aprendizaje</h2>
        <div class="generated-content">${learningObjectives}</div>
      </section>
    `);
    template('article').append(`
      <section class="exercises-section mt-5">
        <h2><i class="fas fa-tasks me-2"></i>Ejercicios Prácticos</h2>
        <div class="generated-content">${exercises}</div>
      </section>
    `);

    if (!metadata.description) {
      const desc = await generateWithGemini(`Escribe una descripción SEO optimizada de 150-160 caracteres para el artículo "${metadata.title}".`, 2);
      if (desc) {
        template('meta[name="description"]').attr('content', desc);
        template('meta[property="og:description"]').attr('content', desc);
      }
    }

    await fs.promises.writeFile(filePath, template.html());
    console.log('  - ✅ Artículo actualizado');

  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Procesar un directorio con pausa entre artículos
async function processDirectory(directory) {
  const files = await fs.promises.readdir(directory);
  let count = 0;
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (file.endsWith('.html') && !file.includes('index')) {
      await processArticle(filePath);
      count++;
      await new Promise(res => setTimeout(res, ARTICLE_DELAY_MS));
    }
  }
  if (count > 0) console.log(`  - Procesados ${count} artículos en ${path.basename(directory)}`);
}

// Ejecución principal
async function main() {
  console.log('🚀 Iniciando mejora de artículos con Gemini...\n');
  console.log('📂 Procesando artículos del blog...');
  await processDirectory(BLOG_DIR);
  console.log('\n📂 Procesando artículos educativos...');
  await processDirectory(EDUCATIONAL_DIR);
  console.log('\n✨ Proceso completado');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { generateLearningObjectives, generateExercises };

