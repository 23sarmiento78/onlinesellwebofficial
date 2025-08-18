// Script para mejorar/generar artículos para AdSense usando Gemini

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../public/blog');
const TEMPLATE_PATH = path.join(__dirname, '../templates/article-template.html');
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const PAUSE_MS = 10000; // 10 segundos

if (!API_KEY) {
  console.error('No se encontró la clave GEMINI_API_KEY en el archivo .env');
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isPlaceholderContent(content) {
  // Detecta si el contenido solo tiene placeholders
  return /\{\{ARTICLE_TITLE\}\}|\{\{ARTICLE_SUMMARY\}\}|\{\{AUTHOR\}\}|\{\{WORD_COUNT\}\}|\{\{TAGS_HTML\}\}|\{\{ARTICLE_CONTENT\}\}/.test(content) && content.length < 1000;
}

async function generateContentWithGemini(prompt) {
  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    console.error('Error en la API Gemini:', err.response?.data || err.message);
    return '';
  }
}

async function processArticles() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');



  const PLACEHOLDER_BLOCK = `{{ARTICLE_TITLE}}
{{ARTICLE_SUMMARY}}

 Por {{AUTHOR}}
 2025-08-18
 Generado por IA
{{ARTICLE_TITLE}}
Categoría: Tutorial
Autor: {{AUTHOR}}
Fecha: 2025-08-18
Tiempo de lectura: 5 min
Palabras: {{WORD_COUNT}}
{{TAGS_HTML}}
{{ARTICLE_CONTENT}}
Compartir artículo
   
 Artículo generado por inteligencia artificial
`;

  function isPlaceholderContent(content) {
    // Coincidencia exacta con el bloque de placeholders
    return content.trim() === PLACEHOLDER_BLOCK.trim();
  }

  function isVeryShortContent(content) {
    // Considera muy corto si tiene menos de 300 caracteres (ajustable)
    return content.trim().length < 300;
  }

  // Archivos que siempre deben procesarse
  const forceFiles = [
    '1-introduccin-y-objetivos.html',
    'ansible-automatizaci.html',
    'ajax-comunicacin-asncrona-con-.html'
  ];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = '';
    let prompt = '';

    // Procesar si es bloque de placeholders, muy corto, o está en la lista de archivos forzados
    if (isPlaceholderContent(content) || isVeryShortContent(content) || forceFiles.includes(file)) {
      // Generar contenido nuevo usando el template
  prompt = `Eres un experto en redacción web y SEO para Google AdSense. Genera un artículo profesional, original, extenso, variado y educativo sobre el tema indicado, usando el siguiente template HTML. El contenido debe aportar valor, incluir explicaciones claras, ejemplos y recursos útiles. Respeta la estructura y el CSS del template, reemplaza todos los placeholders por contenido real y relevante, y no incluyas comentarios, resúmenes ni recomendaciones al final. El artículo debe estar perfectamente estructurado, optimizado para AdSense y listo para publicar. Tema: ${file.replace(/-/g, ' ').replace('.html', '')}. Template:\n${template}`;
      newContent = await generateContentWithGemini(prompt);
    } else {
      // Mejorar el contenido actual para AdSense
  prompt = `Eres un experto en redacción web y SEO para Google AdSense. Reescribe y mejora el siguiente artículo HTML para que sea profesional, extenso, variado y educativo, usando el template proporcionado. El contenido debe aportar valor, incluir explicaciones claras, ejemplos y recursos útiles. Respeta la estructura y el CSS del template, reemplaza todos los placeholders por contenido real y relevante, y no incluyas comentarios, resúmenes ni recomendaciones al final. El artículo debe estar optimizado para AdSense y listo para publicar. Template:\n${template}\n\nArtículo original:\n${content}`;
      newContent = await generateContentWithGemini(prompt);
    }

    if (newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Artículo procesado: ${file}`);
    } else {
      console.warn(`No se pudo generar contenido para: ${file}`);
    }
    await sleep(PAUSE_MS);
  }
  console.log('Todos los artículos han sido procesados.');
}

processArticles();
