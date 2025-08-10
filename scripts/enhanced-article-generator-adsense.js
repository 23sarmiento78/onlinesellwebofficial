#!/usr/bin/env node

/**
 * 🚀 Sistema Mejorado de Generación de Artículos con AdSense
 * 
 * Características:
 * - Generación con Gemini AI optimizada para AdSense
 * - Contenido de alta calidad para aprobar políticas de Google
 * - Integración automática de scripts AdSense
 * - SEO avanzado y metadata completa
 * - Validación de calidad de contenido
 * - Templates modernos y responsive
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURACIÓN ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  ADSENSE_CLIENT_ID: 'ca-pub-7772175009790237',
  OUTPUT_DIR: path.resolve(__dirname, '../public/blog'),
  CONTENT_DIR: path.resolve(__dirname, '../src/content/articles'),
  
  // Configuración de calidad para AdSense
  MIN_WORD_COUNT: 800,
  TARGET_WORD_COUNT: 1500,
  MAX_WORD_COUNT: 3000,
  
  // Keywords locales principales
  LOCAL_KEYWORDS: [
    'desarrollo web villa carlos paz',
    'diseño web villa carlos paz',
    'programador web córdoba',
    'marketing digital villa carlos paz',
    'seo villa carlos paz',
    'tienda online villa carlos paz'
  ],
  
  // Categorías mejoradas
  CATEGORIES: {
    desarrollo: {
      name: 'Desarrollo Web',
      description: 'Tutoriales y guías de desarrollo web profesional',
      keywords: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Vue', 'Angular', 'PHP', 'Python']
    },
    diseno: {
      name: 'Diseño Web',
      description: 'Principios de diseño UI/UX y experiencia de usuario',
      keywords: ['UI/UX', 'Figma', 'Adobe XD', 'Design System', 'Responsive', 'CSS', 'HTML']
    },
    seo: {
      name: 'SEO y Marketing',
      description: 'Estrategias de SEO y marketing digital',
      keywords: ['SEO', 'Google Analytics', 'SEM', 'Content Marketing', 'Social Media']
    },
    tecnologia: {
      name: 'Tecnología',
      description: 'Tendencias y noticias tecnológicas',
      keywords: ['Cloud Computing', 'DevOps', 'Kubernetes', 'AI', 'Blockchain', 'IoT']
    }
  }
};

// === VALIDACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY requerido');
  console.log('💡 Configura la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === TEMPLATES CON ADSENSE ===
const ADSENSE_SCRIPTS = `
<!-- AdSense Script Principal -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT_ID}" crossorigin="anonymous"></script>

<!-- Meta para AdSense -->
<meta name="google-adsense-account" content="${CONFIG.ADSENSE_CLIENT_ID}">
`;

const ADSENSE_AD_UNITS = {
  header: `
<!-- Anuncio Header -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
`,
  
  sidebar: `
<!-- Anuncio Sidebar -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
     data-ad-slot="0987654321"
     data-ad-format="rectangle"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
`,
  
  footer: `
<!-- Anuncio Footer -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
     data-ad-slot="1122334455"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
`
};

const MODERN_ARTICLE_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | hgaruna Digital - Villa Carlos Paz</title>
    <meta name="description" content="{{DESCRIPTION}}">
    <meta name="keywords" content="{{KEYWORDS}}">
    <meta name="author" content="hgaruna Digital">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph -->
    <meta property="og:title" content="{{TITLE}}">
    <meta property="og:description" content="{{DESCRIPTION}}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${CONFIG.SITE_URL}/blog/{{SLUG}}.html">
    <meta property="og:image" content="${CONFIG.SITE_URL}/logos-he-imagenes/{{CATEGORY}}.jpeg">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{TITLE}}">
    <meta name="twitter:description" content="{{DESCRIPTION}}">
    <meta name="twitter:image" content="${CONFIG.SITE_URL}/logos-he-imagenes/{{CATEGORY}}.jpeg">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{{TITLE}}",
      "description": "{{DESCRIPTION}}",
      "author": {
        "@type": "Organization",
        "name": "hgaruna Digital",
        "url": "${CONFIG.SITE_URL}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna Digital",
        "logo": {
          "@type": "ImageObject",
          "url": "${CONFIG.SITE_URL}/logos-he-imagenes/logo.png"
        }
      },
      "datePublished": "{{DATE}}",
      "dateModified": "{{DATE}}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${CONFIG.SITE_URL}/blog/{{SLUG}}.html"
      },
      "image": "${CONFIG.SITE_URL}/logos-he-imagenes/{{CATEGORY}}.jpeg"
    }
    </script>
    
    ${ADSENSE_SCRIPTS}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${CONFIG.SITE_URL}/blog/{{SLUG}}.html">
    
    <!-- CSS Moderno -->
    <link rel="stylesheet" href="../blogia-custom.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <style>
        .adsense-container {
            margin: 20px 0;
            text-align: center;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .adsense-label {
            font-size: 12px;
            color: #6c757d;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .article-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.8;
        }
        
        .article-meta {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .article-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .article-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .meta-info {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            font-size: 0.9rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .content-section {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .content-section h2 {
            color: #2c3e50;
            font-size: 2rem;
            margin: 30px 0 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .content-section h3 {
            color: #34495e;
            font-size: 1.5rem;
            margin: 25px 0 15px;
        }
        
        .content-section p {
            margin-bottom: 20px;
            color: #2c3e50;
            text-align: justify;
        }
        
        .content-section ul, .content-section ol {
            margin: 20px 0;
            padding-left: 30px;
        }
        
        .content-section li {
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
            .article-content {
                padding: 15px;
            }
            
            .article-title {
                font-size: 2rem;
            }
            
            .content-section {
                padding: 25px 20px;
            }
            
            .meta-info {
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="article-content">
        <!-- Anuncio Header -->
        <div class="adsense-container">
            <div class="adsense-label">Publicidad</div>
            ${ADSENSE_AD_UNITS.header}
        </div>
        
        <!-- Meta del Artículo -->
        <div class="article-meta">
            <h1 class="article-title">{{TITLE}}</h1>
            <p class="article-subtitle">{{SUBTITLE}}</p>
            <div class="meta-info">
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>{{DATE_FORMATTED}}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-user"></i>
                    <span>hgaruna Digital</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-clock"></i>
                    <span>{{READ_TIME}} min lectura</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>{{CATEGORY_NAME}}</span>
                </div>
            </div>
        </div>
        
        <!-- Contenido Principal -->
        <div class="content-section">
            {{CONTENT}}
        </div>
        
        <!-- Anuncio Medio -->
        <div class="adsense-container">
            <div class="adsense-label">Publicidad</div>
            ${ADSENSE_AD_UNITS.sidebar}
        </div>
        
        <!-- CTA Villa Carlos Paz -->
        <div class="cta-section">
            <h3><i class="fas fa-map-marker-alt"></i> ¿Necesitas desarrollo web en Villa Carlos Paz?</h3>
            <p>Nuestro equipo de expertos en hgaruna Digital está listo para llevar tu proyecto al siguiente nivel. Especialistas en desarrollo web, diseño UI/UX y marketing digital en Villa Carlos Paz, Córdoba.</p>
            <a href="/contacto" class="cta-button">
                <i class="fas fa-phone"></i> Solicitar Cotización Gratuita
            </a>
        </div>
        
        <!-- Anuncio Footer -->
        <div class="adsense-container">
            <div class="adsense-label">Publicidad</div>
            ${ADSENSE_AD_UNITS.footer}
        </div>
        
        <!-- Footer del Artículo -->
        <div class="content-section" style="text-align: center; background: #f8f9fa;">
            <p><strong>Sobre el autor:</strong> Este artículo fue creado por el equipo de hgaruna Digital, especialistas en desarrollo web y marketing digital en Villa Carlos Paz, Córdoba, Argentina.</p>
            <p><em>¿Te gustó este artículo? Compártelo y síguenos para más contenido sobre desarrollo web y tecnología.</em></p>
        </div>
    </div>
    
    <!-- Scripts adicionales -->
    <script>
        // Lazy loading para AdSense
        if ('IntersectionObserver' in window) {
            const adObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Activar anuncios cuando entren en viewport
                        const ads = entry.target.querySelectorAll('.adsbygoogle');
                        ads.forEach(ad => {
                            if (!ad.hasAttribute('data-activated')) {
                                ad.setAttribute('data-activated', 'true');
                                (adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        });
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.adsense-container').forEach(container => {
                adObserver.observe(container);
            });
        }
        
        // Analytics de tiempo de lectura
        let readingTime = 0;
        const timer = setInterval(() => {
            readingTime++;
            if (readingTime % 30 === 0) { // Cada 30 segundos
                // Opcional: Enviar evento a Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'reading_time', {
                        'time_seconds': readingTime,
                        'article_title': '{{TITLE}}'
                    });
                }
            }
        }, 1000);
        
        // Parar timer cuando sale de la página
        window.addEventListener('beforeunload', () => {
            clearInterval(timer);
        });
    </script>
</body>
</html>`;

// === GENERADOR DE ARTÍCULOS MEJORADO ===
class EnhancedArticleGenerator {
  constructor() {
    this.generatedArticles = [];
    this.qualityThreshold = 0.8; // Threshold de calidad mínima
  }

  async initialize() {
    console.log('🚀 Inicializando generador mejorado de artículos...');
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    await fs.mkdir(CONFIG.CONTENT_DIR, { recursive: true });
  }

  // === GENERACIÓN DE CONTENIDO DE ALTA CALIDAD ===
  async generateHighQualityArticle(topic, category = 'desarrollo') {
    console.log(`📝 Generando artículo de alta calidad: ${topic}`);
    
    const categoryInfo = CONFIG.CATEGORIES[category] || CONFIG.CATEGORIES.desarrollo;
    
    const prompt = `
Genera un artículo COMPLETO y de ALTA CALIDAD sobre: "${topic}"

REQUISITOS ESTRICTOS para aprobar Google AdSense:
1. Mínimo ${CONFIG.MIN_WORD_COUNT} palabras, ideal ${CONFIG.TARGET_WORD_COUNT}-${CONFIG.MAX_WORD_COUNT}
2. Contenido 100% original y único
3. Información precisa y actualizada
4. Valor educativo real para lectores
5. Sin contenido duplicado o parafraseo
6. Estructura profesional y bien organizada
7. Ejemplos prácticos y casos de uso reales

CONTEXTO:
- Empresa: hgaruna Digital, Villa Carlos Paz, Córdoba, Argentina
- Audiencia: Empresarios, emprendedores y desarrolladores
- Categoría: ${categoryInfo.name}
- Keywords objetivo: ${categoryInfo.keywords.join(', ')}
- Keywords locales: ${CONFIG.LOCAL_KEYWORDS.join(', ')}

ESTRUCTURA REQUERIDA:
1. **Introducción impactante** (150-200 palabras)
   - Hook que capture atención
   - Problema que resuelve el artículo
   - Promesa de valor al lector

2. **¿Qué es [TEMA]?** (200-300 palabras)
   - Definición clara y completa
   - Contexto histórico si es relevante
   - Por qué es importante hoy

3. **Beneficios y Ventajas** (300-400 palabras)
   - Lista detallada de beneficios
   - Ejemplos específicos
   - Casos de éxito reales

4. **Implementación Práctica** (400-500 palabras)
   - Pasos detallados
   - Mejores prácticas
   - Herramientas recomendadas
   - Código o ejemplos técnicos (si aplica)

5. **Casos de Estudio/Ejemplos** (300-400 palabras)
   - Empresas exitosas
   - Proyectos reales
   - Resultados medibles

6. **Tendencias y Futuro** (200-300 palabras)
   - Evolución del tema
   - Predicciones para 2025-2026
   - Tecnologías emergentes

7. **Cómo hgaruna Digital puede ayudar** (150-200 palabras)
   - Servicios específicos en Villa Carlos Paz
   - Experiencia del equipo
   - Casos de éxito locales

8. **Conclusión y Próximos Pasos** (150-200 palabras)
   - Resumen de puntos clave
   - Llamada a la acción clara
   - Recursos adicionales

INSTRUCCIONES ESPECÍFICAS:
- Usa un tono profesional pero accesible
- Incluye datos, estadísticas y fuentes cuando sea posible
- Integra naturalmente las keywords sin sobreoptimización
- Menciona Villa Carlos Paz y Córdoba de forma natural
- Crea contenido que realmente ayude al lector
- Evita contenido promocional excesivo
- Incluye preguntas retóricas para engagement
- Usa listas, bullets y elementos visuales conceptuales

IMPORTANTE: El contenido debe ser TAN BUENO que los lectores quieran compartirlo y Google lo considere valioso para los usuarios.

Genera SOLO el contenido del artículo en HTML, con headers H2, H3, párrafos, listas, etc. NO incluyas el template completo, solo el contenido que irá en la sección {{CONTENT}}.
`;

    try {
      const result = await model.generateContent(prompt);
      const content = result.response.text();
      
      // Validar calidad del contenido
      const quality = await this.validateContentQuality(content, topic);
      
      if (quality.score < this.qualityThreshold) {
        console.log(`⚠️ Contenido no cumple estándares de calidad (${Math.round(quality.score * 100)}%). Regenerando...`);
        return await this.generateHighQualityArticle(topic, category); // Retry
      }
      
      // Generar metadata
      const metadata = await this.generateArticleMetadata(content, topic, category);
      
      // Crear artículo completo
      const article = await this.createCompleteArticle(content, metadata, category);
      
      console.log(`✅ Artículo generado: ${metadata.title} (${quality.wordCount} palabras, calidad: ${Math.round(quality.score * 100)}%)`);
      
      return article;
      
    } catch (error) {
      console.error(`❌ Error generando artículo: ${error.message}`);
      throw error;
    }
  }

  // === VALIDACIÓN DE CALIDAD ===
  async validateContentQuality(content, topic) {
    const wordCount = content.split(/\s+/).length;
    const hasHeaders = /<h[2-6]/.test(content);
    const hasLists = /<[uo]l>/.test(content);
    const hasParagraphs = /<p>/.test(content);
    
    // Verificar originalidad con Gemini
    const originalityPrompt = `
Analiza este contenido y evalúa:
1. Originalidad (0-100%)
2. Calidad educativa (0-100%)
3. Relevancia para "${topic}" (0-100%)
4. Estructura y organización (0-100%)

Contenido a analizar:
${content.substring(0, 1000)}...

Responde en formato JSON:
{
  "originality": 85,
  "educational_value": 90,
  "relevance": 95,
  "structure": 88,
  "overall_score": 89,
  "feedback": "breve comentario"
}
`;

    try {
      const qualityResult = await model.generateContent(originalityPrompt);
      const qualityResponse = qualityResult.response.text();
      
      const jsonMatch = qualityResponse.match(/\{[\s\S]*\}/);
      let qualityData = { overall_score: 70 }; // Default
      
      if (jsonMatch) {
        qualityData = JSON.parse(jsonMatch[0]);
      }
      
      const score = Math.min(1.0, (
        (wordCount >= CONFIG.MIN_WORD_COUNT ? 0.3 : 0) +
        (hasHeaders ? 0.2 : 0) +
        (hasLists ? 0.1 : 0) +
        (hasParagraphs ? 0.1 : 0) +
        (qualityData.overall_score / 100 * 0.3)
      ));
      
      return {
        score,
        wordCount,
        hasHeaders,
        hasLists,
        hasParagraphs,
        aiQuality: qualityData.overall_score,
        feedback: qualityData.feedback
      };
      
    } catch (error) {
      console.warn('⚠️ Error en validación de calidad, usando evaluación básica');
      
      const score = Math.min(1.0, (
        (wordCount >= CONFIG.MIN_WORD_COUNT ? 0.4 : 0) +
        (hasHeaders ? 0.3 : 0) +
        (hasLists ? 0.15 : 0) +
        (hasParagraphs ? 0.15 : 0)
      ));
      
      return { score, wordCount, hasHeaders, hasLists, hasParagraphs };
    }
  }

  // === GENERACIÓN DE METADATA ===
  async generateArticleMetadata(content, topic, category) {
    const metadataPrompt = `
Basándote en este contenido, genera metadata optimizada para SEO:

CONTENIDO: ${content.substring(0, 500)}...
TEMA: ${topic}
CATEGORÍA: ${category}

Genera en formato JSON:
{
  "title": "Título SEO optimizado (50-60 caracteres)",
  "subtitle": "Subtítulo descriptivo",
  "description": "Meta descripción SEO (150-160 caracteres)",
  "keywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "slug": "url-amigable-sin-espacios",
  "readTime": 8
}

Asegúrate de incluir "Villa Carlos Paz" o "Córdoba" naturalmente cuando sea relevante.
`;

    try {
      const result = await model.generateContent(metadataPrompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const metadata = JSON.parse(jsonMatch[0]);
        
        // Generar slug alternativo si no está presente
        if (!metadata.slug) {
          metadata.slug = this.generateSlug(metadata.title || topic);
        }
        
        return metadata;
      }
    } catch (error) {
      console.warn('⚠️ Error generando metadata, usando valores por defecto');
    }
    
    // Metadata por defecto
    return {
      title: `${topic} - Guía Completa | hgaruna Digital`,
      subtitle: `Todo lo que necesitas saber sobre ${topic}`,
      description: `Descubre ${topic} con nuestra guía completa. Consejos expertos de desarrollo web en Villa Carlos Paz.`,
      keywords: `${topic}, desarrollo web, Villa Carlos Paz, ${category}`,
      slug: this.generateSlug(topic),
      readTime: Math.ceil(content.split(/\s+/).length / 200)
    };
  }

  // === CREAR ARTÍCULO COMPLETO ===
  async createCompleteArticle(content, metadata, category) {
    const date = new Date();
    const dateFormatted = date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const categoryInfo = CONFIG.CATEGORIES[category] || CONFIG.CATEGORIES.desarrollo;
    
    // Reemplazar placeholders en template
    let articleHtml = MODERN_ARTICLE_TEMPLATE
      .replace(/\{\{TITLE\}\}/g, metadata.title)
      .replace(/\{\{SUBTITLE\}\}/g, metadata.subtitle)
      .replace(/\{\{DESCRIPTION\}\}/g, metadata.description)
      .replace(/\{\{KEYWORDS\}\}/g, metadata.keywords)
      .replace(/\{\{SLUG\}\}/g, metadata.slug)
      .replace(/\{\{CATEGORY\}\}/g, category)
      .replace(/\{\{CATEGORY_NAME\}\}/g, categoryInfo.name)
      .replace(/\{\{DATE\}\}/g, date.toISOString().split('T')[0])
      .replace(/\{\{DATE_FORMATTED\}\}/g, dateFormatted)
      .replace(/\{\{READ_time\}\}/g, metadata.readTime)
      .replace(/\{\{CONTENT\}\}/g, content);
    
    // Guardar archivo HTML
    const fileName = `${metadata.slug}.html`;
    const filePath = path.join(CONFIG.OUTPUT_DIR, fileName);
    
    await fs.writeFile(filePath, articleHtml, 'utf-8');
    
    // Guardar también en formato markdown
    const markdownContent = this.convertToMarkdown(content, metadata);
    const mdFileName = `${date.toISOString().split('T')[0]}-${metadata.slug}.md`;
    const mdFilePath = path.join(CONFIG.CONTENT_DIR, mdFileName);
    
    await fs.writeFile(mdFilePath, markdownContent, 'utf-8');
    
    const article = {
      title: metadata.title,
      slug: metadata.slug,
      category,
      htmlFile: fileName,
      markdownFile: mdFileName,
      wordCount: content.split(/\s+/).length,
      readTime: metadata.readTime,
      date: date.toISOString().split('T')[0],
      url: `${CONFIG.SITE_URL}/blog/${fileName}`
    };
    
    this.generatedArticles.push(article);
    return article;
  }

  // === UTILIDADES ===
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')
      .substring(0, 50);
  }

  convertToMarkdown(htmlContent, metadata) {
    // Conversión básica HTML a Markdown
    let markdown = `---
title: "${metadata.title}"
description: "${metadata.description}"
date: "${new Date().toISOString().split('T')[0]}"
category: "${metadata.category || 'desarrollo'}"
tags: [${metadata.keywords.split(',').map(k => `"${k.trim()}"`).join(', ')}]
author: "hgaruna Digital"
---

# ${metadata.title}

${htmlContent
  .replace(/<h2>/g, '\n## ')
  .replace(/<\/h2>/g, '\n')
  .replace(/<h3>/g, '\n### ')
  .replace(/<\/h3>/g, '\n')
  .replace(/<p>/g, '\n')
  .replace(/<\/p>/g, '\n')
  .replace(/<strong>/g, '**')
  .replace(/<\/strong>/g, '**')
  .replace(/<em>/g, '*')
  .replace(/<\/em>/g, '*')
  .replace(/<ul>/g, '\n')
  .replace(/<\/ul>/g, '\n')
  .replace(/<ol>/g, '\n')
  .replace(/<\/ol>/g, '\n')
  .replace(/<li>/g, '- ')
  .replace(/<\/li>/g, '\n')
  .replace(/<[^>]*>/g, '')
  .replace(/\n\s*\n/g, '\n\n')
  .trim()}
`;

    return markdown;
  }

  // === GENERACIÓN MASIVA ===
  async generateMultipleArticles(topics) {
    console.log(`📚 Generando ${topics.length} artículos de alta calidad...`);
    
    const results = [];
    
    for (let i = 0; i < topics.length; i++) {
      const { topic, category = 'desarrollo' } = typeof topics[i] === 'string' 
        ? { topic: topics[i] } 
        : topics[i];
      
      try {
        console.log(`\n[${i + 1}/${topics.length}] Procesando: ${topic}`);
        
        const article = await this.generateHighQualityArticle(topic, category);
        results.push(article);
        
        // Pausa entre generaciones
        if (i < topics.length - 1) {
          console.log('⏸️ Pausa de 3 segundos...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
      } catch (error) {
        console.error(`❌ Error con "${topic}": ${error.message}`);
        results.push({ topic, error: error.message });
      }
    }
    
    return results;
  }

  // === REPORTES ===
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalArticles: this.generatedArticles.length,
      averageWordCount: this.generatedArticles.reduce((sum, a) => sum + a.wordCount, 0) / this.generatedArticles.length,
      categories: {},
      articles: this.generatedArticles
    };
    
    // Agrupar por categorías
    this.generatedArticles.forEach(article => {
      if (!report.categories[article.category]) {
        report.categories[article.category] = 0;
      }
      report.categories[article.category]++;
    });
    
    // Guardar reporte
    const reportPath = path.join(CONFIG.OUTPUT_DIR, '../reports/article-generation-report.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 REPORTE DE GENERACIÓN:');
    console.log(`   📝 Artículos generados: ${report.totalArticles}`);
    console.log(`   📏 Promedio de palabras: ${Math.round(report.averageWordCount)}`);
    console.log(`   📁 Categorías:`);
    Object.entries(report.categories).forEach(([cat, count]) => {
      console.log(`      - ${cat}: ${count} artículos`);
    });
    
    return report;
  }
}

// === TEMAS PREDEFINIDOS DE ALTA CALIDAD ===
const HIGH_QUALITY_TOPICS = [
  {
    topic: 'Desarrollo Web con React 2025: Guía Completa para Empresas',
    category: 'desarrollo'
  },
  {
    topic: 'SEO Local para Empresas en Villa Carlos Paz: Estrategias Comprobadas',
    category: 'seo'
  },
  {
    topic: 'Diseño UX/UI Responsive: Mejores Prácticas para E-commerce',
    category: 'diseno'
  },
  {
    topic: 'Inteligencia Artificial en el Desarrollo Web: Tendencias 2025',
    category: 'tecnologia'
  },
  {
    topic: 'Optimización de Performance Web: Técnicas Avanzadas',
    category: 'desarrollo'
  },
  {
    topic: 'Marketing Digital para PyMES en Córdoba: Guía Práctica',
    category: 'seo'
  },
  {
    topic: 'Progressive Web Apps (PWA): Implementación Profesional',
    category: 'desarrollo'
  },
  {
    topic: 'Accesibilidad Web: Desarrollo Inclusivo y Estándares WCAG',
    category: 'desarrollo'
  }
];

// === FUNCIÓN PRINCIPAL ===
async function main() {
  try {
    const generator = new EnhancedArticleGenerator();
    await generator.initialize();
    
    // Generar artículos de alta calidad
    console.log('🚀 Iniciando generación de artículos de alta calidad para AdSense...');
    
    const results = await generator.generateMultipleArticles(HIGH_QUALITY_TOPICS);
    
    // Generar reporte
    const report = await generator.generateReport();
    
    console.log('\n✅ GENERACIÓN COMPLETADA');
    console.log(`📝 ${report.totalArticles} artículos generados exitosamente`);
    console.log(`🎯 Todos optimizados para AdSense y SEO`);
    console.log(`📍 Enfoque local: Villa Carlos Paz, Córdoba`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Error en generación:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { EnhancedArticleGenerator, HIGH_QUALITY_TOPICS };
