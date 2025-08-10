#!/usr/bin/env node

/**
 * 🤖 Generador de Artículos Moderno para GitHub Actions
 * 
 * Script optimizado que usa modern-article-template.html
 * Genera artículos de alta calidad con el template moderno
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN PARA GITHUB ACTIONS ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  ADSENSE_CLIENT_ID: 'ca-pub-7772175009790237',
  
  // Configuración específica para GitHub Actions
  ARTICLES_PER_RUN: parseInt(process.env.ARTICLE_COUNT) || 3,
  OUTPUT_DIR: path.resolve(__dirname, '../public/blog'),
  CONTENT_DIR: path.resolve(__dirname, '../src/content/articles'),
  TEMPLATE_PATH: path.resolve(__dirname, '../templates/modern-article-template.html'),
  REPORTS_DIR: path.resolve(__dirname, '../reports'),
  
  // Configuración de calidad
  MIN_WORD_COUNT: 1200,
  TARGET_WORD_COUNT: 1800,
  
  // Configuración local Argentina
  BUSINESS_INFO: {
    name: 'hgaruna Digital',
    location: 'Villa Carlos Paz, Córdoba, Argentina',
    timezone: 'America/Argentina/Buenos_Aires'
  }
};

// === VALIDACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está configurada en GitHub Secrets');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === TEMAS OPTIMIZADOS PARA GOOGLE ADSENSE ===
// Temas seleccionados por alto CPC y demanda publicitaria
const DAILY_TOPICS_POOL = [
  // Desarrollo Web & Tecnología (Alto CPC)
  {
    topic: 'Desarrollo de Aplicaciones Web: Guía Completa para Empresas 2025',
    category: 'desarrollo',
    keywords: ['desarrollo aplicaciones', 'software empresarial', 'tecnología', 'consultoría IT'],
    adsenseValue: 'high' // Keywords con alto valor publicitario
  },
  {
    topic: 'Ciberseguridad para PyMEs: Protege tu Negocio Digital',
    category: 'seguridad',
    keywords: ['ciberseguridad', 'seguridad informática', 'protección datos', 'antivirus empresarial'],
    adsenseValue: 'high'
  },
  {
    topic: 'Cloud Computing: Migración a la Nube para Empresas',
    category: 'tecnologia',
    keywords: ['cloud computing', 'migración nube', 'AWS', 'servicios cloud'],
    adsenseValue: 'high'
  },

  // Marketing Digital & Negocios (CPC Medio-Alto)
  {
    topic: 'Marketing Digital ROI: Cómo Medir el Retorno de Inversión',
    category: 'marketing',
    keywords: ['marketing digital', 'ROI', 'publicidad online', 'Google Ads'],
    adsenseValue: 'high'
  },
  {
    topic: 'E-commerce: Crear Tienda Online Exitosa en Argentina',
    category: 'ecommerce',
    keywords: ['tienda online', 'ecommerce', 'ventas digitales', 'comercio electrónico'],
    adsenseValue: 'high'
  },
  {
    topic: 'Automatización de Procesos: Software para Empresas',
    category: 'automatizacion',
    keywords: ['automatización', 'software empresarial', 'CRM', 'gestión procesos'],
    adsenseValue: 'high'
  },

  // Finanzas & Inversión (Alto CPC)
  {
    topic: 'Inversión en Tecnología: Digitalización de Empresas',
    category: 'finanzas',
    keywords: ['inversión tecnología', 'digitalización', 'transformación digital', 'software'],
    adsenseValue: 'high'
  },
  {
    topic: 'Costos de Desarrollo Web: Presupuesto para tu Proyecto',
    category: 'costos',
    keywords: ['costo desarrollo web', 'presupuesto web', 'precio sitio web', 'cotización'],
    adsenseValue: 'medium'
  },

  // Educación & Capacitación (CPC Medio)
  {
    topic: 'Cursos de Programación: Carreras Tecnológicas 2025',
    category: 'educacion',
    keywords: ['cursos programación', 'carrera tecnología', 'educación IT', 'certificaciones'],
    adsenseValue: 'medium'
  },
  {
    topic: 'Capacitación Digital para Empresas: Upskilling del Equipo',
    category: 'capacitacion',
    keywords: ['capacitación digital', 'formación empresarial', 'skills digitales', 'training'],
    adsenseValue: 'medium'
  },

  // Local Villa Carlos Paz (CPC Local + Turismo)
  {
    topic: 'Turismo Digital en Villa Carlos Paz: Marketing para Hoteles',
    category: 'turismo',
    keywords: ['turismo villa carlos paz', 'marketing hotelero', 'reservas online', 'turismo digital'],
    adsenseValue: 'medium'
  },
  {
    topic: 'Startups en Córdoba: Ecosistema Tecnológico Argentino',
    category: 'startups',
    keywords: ['startups córdoba', 'emprendimientos tech', 'innovación argentina', 'venture capital'],
    adsenseValue: 'medium'
  }
];

class ModernArticleGenerator {
  constructor() {
    this.generatedToday = [];
  }

  // === CARGAR TEMPLATE MODERNO ===
  async loadModernTemplate() {
    try {
      const template = await fs.readFile(CONFIG.TEMPLATE_PATH, 'utf8');
      console.log('✅ Template moderno cargado exitosamente');
      return template;
    } catch (error) {
      console.error('❌ Error cargando template moderno:', error.message);
      throw new Error('No se puede cargar modern-article-template.html');
    }
  }

  // === SELECCIONAR TEMAS PARA HOY ===
  selectDailyTopics() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const availableTopics = [...DAILY_TOPICS_POOL];
    const topics = [];
    
    for (let i = 0; i < CONFIG.ARTICLES_PER_RUN; i++) {
      const index = (dayOfYear + i) % availableTopics.length;
      const selectedTopic = availableTopics[index];
      
      const dateString = today.toISOString().split('T')[0];
      const customizedTopic = {
        ...selectedTopic,
        topic: `${selectedTopic.topic} - Edición ${dateString}`,
        dailyVariation: true,
        generationDate: dateString
      };
      
      topics.push(customizedTopic);
      availableTopics.splice(index, 1);
    }
    
    console.log('📋 Temas seleccionados para hoy:');
    topics.forEach((topic, index) => {
      console.log(`   ${index + 1}. ${topic.topic}`);
      console.log(`      Categoría: ${topic.category}`);
    });
    
    return topics;
  }

  // === GENERAR ARTÍCULO OPTIMIZADO ===
  async generateOptimizedArticle(topicData) {
    console.log(`\n📝 Generando: ${topicData.topic}`);
    
    const today = new Date().toLocaleDateString('es-AR');
    const timeAR = new Date().toLocaleTimeString('es-AR', {
      timeZone: CONFIG.BUSINESS_INFO.timezone
    });
    
    const prompt = `
Crea un artículo COMPLETO y OPTIMIZADO PARA GOOGLE ADSENSE sobre: "${topicData.topic}"

CONTEXTO ESPECÍFICO:
- Fecha de publicación: ${today}
- Hora: ${timeAR} (Hora Argentina)
- Empresa: ${CONFIG.BUSINESS_INFO.name}
- Ubicación: ${CONFIG.BUSINESS_INFO.location}
- Categoría: ${topicData.category}
- Keywords de alto valor: ${topicData.keywords.join(', ')}
- Valor AdSense: ${topicData.adsenseValue || 'medium'}

REQUISITOS PARA MAXIMIZAR INGRESOS ADSENSE:
1. **Mínimo ${CONFIG.MIN_WORD_COUNT} palabras**, ideal ${CONFIG.TARGET_WORD_COUNT}
2. **Contenido de alta calidad** que mantenga usuarios en la página
3. **Multiple puntos de parada** para colocación de anuncios
4. **Keywords comerciales** integradas naturalmente
5. **Información actualizada** y valiosa para profesionales/empresas
6. **Tono autorizado y experto** que genere confianza
7. **Estructura escaneada** con subtítulos claros para lectura rápida

ESTRUCTURA OPTIMIZADA PARA ADSENSE:
1. **Introducción Impactante** (200 palabras)
   - Hook que capture atención inmediata
   - Problema comercial/empresarial que resuelve
   - Beneficios económicos claros
   - Promesa de valor específico

2. **Panorama del Mercado** (300 palabras)
   - Estadísticas y datos actuales del sector
   - Tendencias de inversión y crecimiento
   - Oportunidades comerciales identificadas
   - Costos y beneficios comparativos

3. **Soluciones y Herramientas** (400 palabras)
   - Software/servicios recomendados con precios
   - Comparativas de proveedores
   - Guía paso a paso de implementación
   - ROI y métricas de éxito esperadas

4. **Casos de Éxito Empresariales** (300 palabras)
   - Empresas reales con resultados medibles
   - Inversiones realizadas y retornos obtenidos
   - Estrategias específicas implementadas
   - Lecciones aprendidas y mejores prácticas

5. **Guía de Inversión y Costos** (300 palabras)
   - Presupuestos típicos y rangos de inversión
   - Factores que afectan el costo
   - Opciones de financiamiento disponibles
   - Calculadoras de ROI y tiempo de recuperación

6. **Mercado Local y Oportunidades** (200 palabras)
   - Situación en Villa Carlos Paz/Córdoba/Argentina
   - Demanda local y competencia
   - Oportunidades específicas regionales
   - Servicios locales disponibles (mencionar hgaruna)

7. **Próximos Pasos y Recursos** (100 palabras)
   - Acciones concretas a tomar
   - Recursos adicionales recomendados
   - Contactos útiles y consultorías
   - Timeline de implementación sugerido

PALABRAS CLAVE DE ALTO VALOR CPC A INCLUIR:
- "software empresarial", "consultoría", "inversión", "ROI"
- "soluciones", "servicios", "presupuesto", "cotización"
- "implementación", "desarrollo", "tecnología", "digitalización"
- "automatización", "optimización", "eficiencia", "productividad"

INSTRUCCIONES ESPECÍFICAS PARA ADSENSE:
- Usa lenguaje comercial y profesional
- Incluye múltiples CTAs sutiles a lo largo del artículo
- Menciona productos/servicios específicos cuando sea relevante
- Crea "stopping points" naturales para ads (después de secciones)
- Integra keywords comerciales sin ser spam
- Genera contenido que atraiga a tomadores de decisiones empresariales
- Incluye datos financieros y estadísticas creíbles

CONTENIDO PROHIBIDO (Políticas AdSense):
- NO contenido para adultos o violento
- NO información médica sin respaldo
- NO promoción excesiva de productos específicos
- NO contenido duplicado o plagiado
- NO clickbait o información falsa

IMPORTANTE: El artículo debe ser TAN VALIOSO que los lectores permanezcan en la página el tiempo suficiente para generar múltiples impresiones de anuncios.

Genera SOLO el contenido HTML para la sección del artículo, con headers H2, H3, párrafos, listas, etc. NO incluyas el template completo.`;

    try {
      const result = await model.generateContent(prompt);
      const content = result.response.text();
      
      const wordCount = this.getWordCount(content);
      console.log(`📊 Contenido generado: ${wordCount} palabras`);
      
      if (wordCount < CONFIG.MIN_WORD_COUNT) {
        console.log(`⚠️ Artículo muy corto (${wordCount} palabras), regenerando...`);
        return await this.generateOptimizedArticle(topicData);
      }
      
      return {
        content,
        topic: topicData.topic,
        category: topicData.category,
        keywords: topicData.keywords,
        wordCount,
        generationDate: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Error generando artículo: ${error.message}`);
      return null;
    }
  }

  // === CREAR ARTÍCULO COMPLETO CON TEMPLATE MODERNO ===
  async createCompleteArticle(articleData) {
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('es-AR', {
      timeZone: CONFIG.BUSINESS_INFO.timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Generar metadata
    const title = this.extractTitle(articleData.content) || articleData.topic;
    const description = this.generateDescription(articleData.content, articleData.topic);
    const slug = this.generateSlug(title);
    const keywords = articleData.keywords.join(', ') + ', hgaruna digital, villa carlos paz';
    
    // Cargar template moderno
    const templateBase = await this.loadModernTemplate();
    
    // Calcular valores adicionales
    const readingTime = Math.ceil(articleData.wordCount / 250);
    const currentYear = today.getFullYear();
    const publishedDate = today.toISOString();
    const publishedDateFormatted = dateFormatted;
    const canonicalUrl = `${CONFIG.SITE_URL}/blog/${slug}.html`;
    const featuredImage = `/logos-he-imagenes/logo3.png`;
    const imageAlt = `${title} - hgaruna Digital`;
    const category = articleData.category || 'desarrollo';
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const author = 'hgaruna Digital';
    const wordCount = articleData.wordCount;
    
    // Generar slots AdSense únicos para evitar duplicados
    const adsenseSlots = this.generateAdSenseSlots(slug, category);

    // Reemplazar todas las variables del template moderno
    const htmlTemplate = templateBase
      .replace(/{{SEO_TITLE}}/g, title)
      .replace(/{{SEO_DESCRIPTION}}/g, description)
      .replace(/{{SEO_KEYWORDS}}/g, keywords)
      .replace(/{{ARTICLE_TITLE}}/g, title)
      .replace(/{{ARTICLE_EXCERPT}}/g, description)
      .replace(/{{ARTICLE_CONTENT}}/g, articleData.content)
      .replace(/{{AUTHOR}}/g, author)
      .replace(/{{CATEGORY}}/g, category)
      .replace(/{{CATEGORY_SLUG}}/g, categorySlug)
      .replace(/{{PUBLISHED_DATE}}/g, publishedDate)
      .replace(/{{PUBLISHED_DATE_FORMATTED}}/g, publishedDateFormatted)
      .replace(/{{MODIFIED_DATE}}/g, publishedDate)
      .replace(/{{READING_TIME}}/g, readingTime)
      .replace(/{{WORD_COUNT}}/g, wordCount)
      .replace(/{{DIFFICULTY}}/g, 'Intermedio')
      .replace(/{{CANONICAL_URL}}/g, canonicalUrl)
      .replace(/{{SITE_URL}}/g, CONFIG.SITE_URL)
      .replace(/{{FEATURED_IMAGE}}/g, featuredImage)
      .replace(/{{IMAGE_ALT}}/g, imageAlt)
      .replace(/{{IMAGE_CAPTION}}/g, `${title} - Desarrollo Web en Villa Carlos Paz`)
      .replace(/{{COPYRIGHT_YEAR}}/g, currentYear)
      .replace(/{{ADSENSE_TOP_SLOT}}/g, adsenseSlots.top)
      .replace(/{{ADSENSE_IN_ARTICLE_SLOT}}/g, adsenseSlots.inArticle)
      .replace(/{{ADSENSE_END_SLOT}}/g, adsenseSlots.end);

    // Guardar archivo
    const fileName = `${slug}.html`;
    const filePath = path.join(CONFIG.OUTPUT_DIR, fileName);
    
    await fs.writeFile(filePath, htmlTemplate, 'utf-8');
    
    // También crear versión markdown
    const markdownContent = this.convertToMarkdown(articleData);
    const mdFileName = `${today.toISOString().split('T')[0]}-${slug}.md`;
    const mdFilePath = path.join(CONFIG.CONTENT_DIR, mdFileName);
    
    await fs.writeFile(mdFilePath, markdownContent, 'utf-8');
    
    const result = {
      title,
      slug,
      fileName,
      markdownFile: mdFileName,
      wordCount: articleData.wordCount,
      category: articleData.category,
      keywords: articleData.keywords,
      url: `${CONFIG.SITE_URL}/blog/${fileName}`,
      generatedAt: today.toISOString()
    };
    
    this.generatedToday.push(result);
    
    console.log(`✅ Artículo creado: ${fileName} (${articleData.wordCount} palabras)`);
    
    return result;
  }

  // === GENERAR SLOTS ADSENSE ÚNICOS ===
  generateAdSenseSlots(slug, category) {
    // Generar slots únicos basados en el artículo y categoría
    const baseNumber = this.generateHashFromString(slug);

    return {
      top: `${baseNumber}001`,        // Slot superior
      inArticle: `${baseNumber}002`,  // Slot en medio del artículo
      end: `${baseNumber}003`,        // Slot al final
      sidebar: `${baseNumber}004`     // Slot sidebar (para futuro uso)
    };
  }

  generateHashFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString().substring(0, 6);
  }

  // === FUNCIONES DE UTILIDAD ===
  getWordCount(content) {
    return content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 0).length;
  }

  extractTitle(content) {
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const h2Match = content.match(/<h2[^>]*>(.*?)<\/h2>/i);
    
    if (h1Match) return h1Match[1].replace(/<[^>]*>/g, '').trim();
    if (h2Match) return h2Match[1].replace(/<[^>]*>/g, '').trim();
    
    return null;
  }

  generateDescription(content, fallbackTopic) {
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (firstParagraph) {
      const description = firstParagraph[1]
        .replace(/<[^>]*>/g, '')
        .trim()
        .substring(0, 150);
      return description + (description.length === 150 ? '...' : '');
    }
    
    return fallbackTopic.substring(0, 150) + ' | hgaruna Digital - Villa Carlos Paz';
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 80);
  }

  convertToMarkdown(articleData) {
    const today = new Date();
    const frontmatter = `---
title: "${this.extractTitle(articleData.content) || articleData.topic}"
description: "${this.generateDescription(articleData.content, articleData.topic)}"
date: ${today.toISOString()}
category: ${articleData.category}
keywords: [${articleData.keywords.map(k => `"${k}"`).join(', ')}]
author: "hgaruna Digital"
slug: "${this.generateSlug(this.extractTitle(articleData.content) || articleData.topic)}"
draft: false
---

`;
    
    const markdownContent = articleData.content
      .replace(/<h([1-6])[^>]*>/g, (match, level) => '#'.repeat(parseInt(level)) + ' ')
      .replace(/<\/h[1-6]>/g, '\n\n')
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '\n\n')
      .replace(/<ul[^>]*>/g, '\n')
      .replace(/<\/ul>/g, '\n')
      .replace(/<ol[^>]*>/g, '\n')
      .replace(/<\/ol>/g, '\n')
      .replace(/<li[^>]*>/g, '- ')
      .replace(/<\/li>/g, '\n')
      .replace(/<strong[^>]*>/g, '**')
      .replace(/<\/strong>/g, '**')
      .replace(/<em[^>]*>/g, '*')
      .replace(/<\/em>/g, '*')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return frontmatter + markdownContent;
  }

  // === FUNCIÓN PRINCIPAL ===
  async generateDaily() {
    console.log('🚀 Iniciando generación diaria de artículos con template moderno...');
    
    try {
      // Crear directorios si no existen
      await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
      await fs.mkdir(CONFIG.CONTENT_DIR, { recursive: true });
      
      // Seleccionar temas
      const topics = this.selectDailyTopics();
      
      // Generar artículos
      for (const topicData of topics) {
        const articleData = await this.generateOptimizedArticle(topicData);
        
        if (articleData) {
          await this.createCompleteArticle(articleData);
        } else {
          console.error(`❌ No se pudo generar artículo para: ${topicData.topic}`);
        }
        
        // Pequeña pausa para evitar límites de rate
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('\n📋 ARTÍCULOS GENERADOS:');
      this.generatedToday.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
        console.log(`      Archivo: ${article.fileName}`);
        console.log(`      Palabras: ${article.wordCount}`);
        console.log(`      URL: ${article.url}`);
      });
      
      console.log(`\n🎉 ¡Generación completada! ${this.generatedToday.length} artículos creados con template moderno.`);
      
      return this.generatedToday.length;
      
    } catch (error) {
      console.error('❌ Error en el proceso de generación:', error);
      return 0;
    }
  }
}

// === EJECUTAR SI ES LLAMADO DIRECTAMENTE ===
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new ModernArticleGenerator();
  
  generator.generateDaily()
    .then(count => {
      console.log(`\n✅ Proceso completado. ${count} artículos generados.`);
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Error fatal:', error);
      process.exit(1);
    });
}

export { ModernArticleGenerator };
