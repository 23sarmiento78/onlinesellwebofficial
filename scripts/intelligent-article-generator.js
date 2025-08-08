#!/usr/bin/env node

/**
 * 🧠 Generador Inteligente de Artículos con SEO Avanzado
 * 
 * Características:
 * - Generación basada en tendencias actuales
 * - Optimización SEO automática
 * - Análisis de competencia
 * - Estructura de contenido inteligente
 * - Schema markup automático
 * - Imágenes optimizadas
 */

import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// === CONFIGURACIÓN AVANZADA ===
const CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  SITE_URL: process.env.SITE_URL || 'https://hgaruna.org',
  OUTPUT_DIR: path.resolve(__dirname, '../public/blog'),
  ARTICLES_COUNT: parseInt(process.env.ARTICLES_COUNT) || 3,
  SEO_OPTIMIZATION: process.env.SEO_OPTIMIZATION || 'advanced',
  POSTED_ARTICLES_PATH: path.resolve(__dirname, './posted_articles.json'),
  
  // Configuración de calidad
  MIN_WORD_COUNT: 1500,
  MAX_WORD_COUNT: 3000,
  SEO_SCORE_THRESHOLD: 85,
  
  // APIs externas
  UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
  PIXABAY_API_KEY: process.env.PIXABAY_API_KEY,
};

// === VALIDACIÓN DE CONFIGURACIÓN ===
if (!CONFIG.GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY no está configurado');
  process.exit(1);
}

// === INICIALIZACIÓN DE GEMINI ===
const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// === CATEGORÍAS Y TEMAS AVANZADOS ===
const ADVANCED_TOPICS = {
  'Frontend Avanzado': {
    trends: [
      'React 19 Server Components y Streaming',
      'Vue 4 Composition API y TypeScript',
      'Svelte 5 Runes y Performance',
      'Next.js 15 App Router y Edge Runtime',
      'Astro 4 View Transitions y Islands',
      'Angular 18 Standalone Components',
      'Web Components con Lit 3',
      'Micro-frontends con Module Federation',
      'PWA con Workbox y Service Workers',
      'WebAssembly en aplicaciones React'
    ],
    keywords: ['frontend', 'react', 'vue', 'performance', 'javascript'],
    difficulty: 'avanzado',
    targetAudience: 'desarrolladores frontend senior'
  },
  
  'Backend Moderno': {
    trends: [
      'Node.js 22 Performance Hooks',
      'Deno 2.0 NPM Compatibility',
      'Bun.js Production Ready',
      'GraphQL Federation v2',
      'tRPC Type-safe APIs',
      'Prisma 5 Client Extensions',
      'Drizzle ORM Type Safety',
      'Fastify vs Express Performance',
      'Serverless con Vercel Functions',
      'Edge Computing con Cloudflare Workers'
    ],
    keywords: ['backend', 'nodejs', 'api', 'database', 'serverless'],
    difficulty: 'intermedio',
    targetAudience: 'desarrolladores backend'
  },
  
  'DevOps Cloud-Native': {
    trends: [
      'Kubernetes 1.30 Gateway API',
      'Docker BuildKit Multi-platform',
      'Terraform 1.7 Testing Framework',
      'GitHub Actions Matrix Strategies',
      'AWS CDK v2 Constructs',
      'Pulumi Infrastructure as Code',
      'ArgoCD GitOps Workflows',
      'Helm 3 Chart Testing',
      'Istio Service Mesh Security',
      'Prometheus Operator Monitoring'
    ],
    keywords: ['devops', 'kubernetes', 'docker', 'aws', 'cloud'],
    difficulty: 'avanzado',
    targetAudience: 'ingenieros devops'
  },
  
  'Inteligencia Artificial': {
    trends: [
      'LLM Local con Ollama',
      'RAG con LangChain y Pinecone',
      'Computer Vision con TensorFlow.js',
      'OpenAI GPT-4 Turbo API',
      'Anthropic Claude 3 Integration',
      'Gemini Pro Vision API',
      'AI Code Generation con GitHub Copilot',
      'Machine Learning Edge con ONNX',
      'NLP con Transformers.js',
      'AI Ethics y Responsible AI'
    ],
    keywords: ['ai', 'machine learning', 'gpt', 'automation', 'nlp'],
    difficulty: 'experto',
    targetAudience: 'desarrolladores AI/ML'
  },
  
  'Seguridad Avanzada': {
    trends: [
      'OWASP Top 10 2024 Updates',
      'OAuth 2.1 y PKCE Implementation',
      'JWT Security Best Practices',
      'CSP Level 3 y Trusted Types',
      'Web Crypto API Modern Usage',
      'Zero Trust Architecture',
      'SAST/DAST Integration CI/CD',
      'Container Security Scanning',
      'Supply Chain Security',
      'Post-Quantum Cryptography'
    ],
    keywords: ['security', 'oauth', 'jwt', 'encryption', 'privacy'],
    difficulty: 'avanzado',
    targetAudience: 'security engineers'
  }
};

// === UTILIDADES AVANZADAS ===
class AdvancedUtils {
  static async loadPostedArticles() {
    try {
      const data = await fs.readFile(CONFIG.POSTED_ARTICLES_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { articles: [], lastGenerated: null };
    }
  }
  
  static async savePostedArticles(data) {
    await fs.writeFile(CONFIG.POSTED_ARTICLES_PATH, JSON.stringify(data, null, 2));
  }
  
  static generateSafeFilename(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }
  
  static async fetchImageForTopic(topic, keywords) {
    try {
      if (CONFIG.UNSPLASH_API_KEY) {
        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
          params: {
            query: keywords.join(' '),
            per_page: 1,
            orientation: 'landscape'
          },
          headers: {
            'Authorization': `Client-ID ${CONFIG.UNSPLASH_API_KEY}`
          }
        });
        
        if (response.data.results.length > 0) {
          return {
            url: response.data.results[0].urls.regular,
            alt: response.data.results[0].alt_description || topic,
            photographer: response.data.results[0].user.name,
            source: 'Unsplash'
          };
        }
      }
    } catch (error) {
      console.warn('⚠️ Error fetching image:', error.message);
    }
    
    // Fallback image
    return {
      url: '/logos-he-imagenes/programacion.jpeg',
      alt: topic,
      photographer: 'hgaruna',
      source: 'Local'
    };
  }
}

// === ANALIZADOR SEO AVANZADO ===
class SEOAnalyzer {
  static calculateKeywordDensity(content, keyword) {
    const words = content.toLowerCase().split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let count = 0;
    
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      const slice = words.slice(i, i + keywordWords.length).join(' ');
      if (slice === keyword.toLowerCase()) {
        count++;
      }
    }
    
    return (count / words.length) * 100;
  }
  
  static generateLSIKeywords(mainKeyword, category) {
    const lsiMap = {
      'frontend': ['desarrollo frontend', 'javascript moderno', 'frameworks', 'ui/ux', 'responsive design'],
      'backend': ['desarrollo backend', 'apis rest', 'base de datos', 'servidor', 'microservicios'],
      'devops': ['automatización', 'contenedores', 'ci/cd', 'infraestructura', 'monitoreo'],
      'ai': ['inteligencia artificial', 'machine learning', 'automatización', 'algoritmos', 'datos'],
      'security': ['ciberseguridad', 'encriptación', 'autenticación', 'vulnerabilidades', 'privacidad']
    };
    
    const categoryKeywords = lsiMap[category.toLowerCase().split(' ')[0]] || [];
    return [...categoryKeywords, `${mainKeyword} villa carlos paz`, `${mainKeyword} córdoba`];
  }
  
  static analyzeContent(content, title, keywords) {
    const analysis = {
      wordCount: content.split(/\s+/).length,
      titleLength: title.length,
      hasHeadings: /<h[2-6]>/i.test(content),
      hasImages: /<img/i.test(content),
      hasLinks: /<a href/i.test(content),
      keywordDensity: {},
      score: 0
    };
    
    // Analizar densidad de keywords
    keywords.forEach(keyword => {
      analysis.keywordDensity[keyword] = this.calculateKeywordDensity(content, keyword);
    });
    
    // Calcular score SEO
    let score = 0;
    
    // Word count (20 puntos)
    if (analysis.wordCount >= CONFIG.MIN_WORD_COUNT && analysis.wordCount <= CONFIG.MAX_WORD_COUNT) {
      score += 20;
    } else if (analysis.wordCount >= 1000) {
      score += 15;
    }
    
    // Title length (15 puntos)
    if (analysis.titleLength >= 30 && analysis.titleLength <= 60) {
      score += 15;
    } else if (analysis.titleLength >= 20) {
      score += 10;
    }
    
    // Estructura (25 puntos)
    if (analysis.hasHeadings) score += 10;
    if (analysis.hasImages) score += 8;
    if (analysis.hasLinks) score += 7;
    
    // Keyword density (40 puntos)
    const mainKeywordDensity = Object.values(analysis.keywordDensity)[0] || 0;
    if (mainKeywordDensity >= 1 && mainKeywordDensity <= 3) {
      score += 40;
    } else if (mainKeywordDensity >= 0.5 && mainKeywordDensity <= 5) {
      score += 30;
    }
    
    analysis.score = score;
    return analysis;
  }
}

// === GENERADOR DE SCHEMA MARKUP ===
class SchemaGenerator {
  static generateArticleSchema(article, category) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "image": [article.image.url],
      "author": {
        "@type": "Person",
        "name": "Hernán Sarmiento - hgaruna",
        "url": "https://hgaruna.org/",
        "sameAs": [
          "https://www.instagram.com/onlinesellweb/",
          "https://www.facebook.com/profile.php?id=61557007626922"
        ]
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hgaruna.org/logos-he-imagenes/logo3.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${CONFIG.SITE_URL}/blog/${article.filename}`
      },
      "articleSection": category,
      "keywords": article.keywords.join(', '),
      "inLanguage": "es-ES",
      "about": {
        "@type": "Thing",
        "name": category,
        "description": `Artículo sobre ${category.toLowerCase()} para desarrolladores`
      }
    };
  }
  
  static generateBreadcrumbSchema(article) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": CONFIG.SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${CONFIG.SITE_URL}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `${CONFIG.SITE_URL}/blog/${article.filename}`
        }
      ]
    };
  }
}

// === GENERADOR PRINCIPAL ===
class IntelligentArticleGenerator {
  constructor() {
    this.postedArticles = null;
    this.generatedCount = 0;
  }
  
  async initialize() {
    console.log('🚀 Inicializando generador inteligente de artículos...');
    
    // Crear directorio de salida
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    
    // Cargar artículos previos
    this.postedArticles = await AdvancedUtils.loadPostedArticles();
    
    console.log(`📊 Artículos previos: ${this.postedArticles.articles.length}`);
    console.log(`🎯 Configuración: ${CONFIG.ARTICLES_COUNT} artículos, optimización ${CONFIG.SEO_OPTIMIZATION}`);
  }
  
  async selectTopicsIntelligently() {
    console.log('🎯 Seleccionando temas de forma inteligente...');
    
    const allTopics = [];
    Object.entries(ADVANCED_TOPICS).forEach(([category, data]) => {
      data.trends.forEach(topic => {
        allTopics.push({
          category,
          topic,
          keywords: data.keywords,
          difficulty: data.difficulty,
          audience: data.targetAudience
        });
      });
    });
    
    // Filtrar temas ya publicados
    const usedTopics = this.postedArticles.articles.map(a => a.topic);
    const availableTopics = allTopics.filter(t => !usedTopics.includes(t.topic));
    
    if (availableTopics.length === 0) {
      console.log('⚠️ Todos los temas han sido utilizados, reseleccionando...');
      return allTopics.slice(0, CONFIG.ARTICLES_COUNT);
    }
    
    // Seleccionar temas balanceados por categoría
    const selectedTopics = [];
    const categoriesUsed = new Set();
    
    for (const topic of availableTopics) {
      if (selectedTopics.length >= CONFIG.ARTICLES_COUNT) break;
      
      // Preferir temas de categorías no utilizadas
      if (!categoriesUsed.has(topic.category) || selectedTopics.length < CONFIG.ARTICLES_COUNT) {
        selectedTopics.push(topic);
        categoriesUsed.add(topic.category);
      }
    }
    
    console.log(`✅ Temas seleccionados: ${selectedTopics.map(t => t.topic).join(', ')}`);
    return selectedTopics;
  }
  
  async generateArticleWithGemini(topicData) {
    console.log(`🧠 Generando artículo: ${topicData.topic}`);
    
    const lsiKeywords = SEOAnalyzer.generateLSIKeywords(topicData.keywords[0], topicData.category);
    
    const prompt = `
Crea un artículo técnico completo y profesional sobre "${topicData.topic}" para desarrolladores en español.

INFORMACIÓN DEL SITIO:
- Empresa: hgaruna
- Ubicación: Villa Carlos Paz, Córdoba, Argentina
- Especialidad: Desarrollo web profesional
- Audiencia: ${topicData.audience}
- Nivel: ${topicData.difficulty}

REQUISITOS TÉCNICOS:
- Longitud: ${CONFIG.MIN_WORD_COUNT}-${CONFIG.MAX_WORD_COUNT} palabras
- Formato: HTML semántico
- SEO: Optimización ${CONFIG.SEO_OPTIMIZATION}
- Keywords principales: ${topicData.keywords.join(', ')}
- LSI Keywords: ${lsiKeywords.join(', ')}

ESTRUCTURA REQUERIDA:
1. Título SEO-optimizado (H1)
2. Introducción enganchante (150-200 palabras)
3. Secciones con subtítulos (H2, H3)
4. Ejemplos de código prácticos
5. Mejores prácticas
6. Conclusión con call-to-action
7. Meta description (150-160 caracteres)

CONTENIDO ESPECÍFICO:
- Enfoque práctico y técnico
- Ejemplos de código funcionales
- Casos de uso reales
- Consideraciones de performance
- Mejores prácticas de la industria
- Enlaces internos relevantes
- Mencionar hgaruna como experto en desarrollo web en Villa Carlos Paz

FORMATO DE SALIDA:
Devuelve SOLO un objeto JSON con esta estructura exacta:
{
  "title": "Título optimizado para SEO",
  "description": "Meta description de 150-160 caracteres",
  "content": "Contenido HTML completo",
  "excerpt": "Resumen de 120 caracteres",
  "readingTime": numero_minutos,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "${topicData.category}",
  "difficulty": "${topicData.difficulty}",
  "lastUpdated": "${new Date().toISOString()}"
}
`;

    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Limpiar la respuesta para extraer JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No se pudo extraer JSON de la respuesta');
      }
      
      const articleData = JSON.parse(jsonMatch[0]);
      
      // Validar contenido
      if (!articleData.content || articleData.content.length < 1000) {
        throw new Error('Contenido generado insuficiente');
      }
      
      // Obtener imagen
      articleData.image = await AdvancedUtils.fetchImageForTopic(topicData.topic, topicData.keywords);
      
      return articleData;
      
    } catch (error) {
      console.error(`❌ Error generando artículo para ${topicData.topic}:`, error.message);
      return null;
    }
  }
  
  async optimizeArticleForSEO(article, topicData) {
    console.log(`🔍 Optimizando SEO para: ${article.title}`);
    
    // Analizar contenido actual
    const seoAnalysis = SEOAnalyzer.analyzeContent(article.content, article.title, article.keywords);
    
    if (seoAnalysis.score < CONFIG.SEO_SCORE_THRESHOLD) {
      console.log(`⚠️ Score SEO bajo (${seoAnalysis.score}), optimizando...`);
      
      // Optimizaciones automáticas
      let optimizedContent = article.content;
      
      // Agregar enlaces internos
      optimizedContent = optimizedContent.replace(
        /desarrollo web/gi,
        '<a href="/desarrollo-web-villa-carlos-paz/">desarrollo web</a>'
      );
      
      optimizedContent = optimizedContent.replace(
        /diseño web/gi,
        '<a href="/diseño-web-villa-carlos-paz/">diseño web</a>'
      );
      
      // Agregar imagen si no existe
      if (!seoAnalysis.hasImages && article.image) {
        const imageHtml = `
<div class="article-hero-image">
  <img src="${article.image.url}" 
       alt="${article.image.alt}" 
       loading="lazy" 
       width="800" 
       height="400"
       style="width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
  <p class="image-credit">Imagen: ${article.image.photographer} (${article.image.source})</p>
</div>`;
        
        optimizedContent = optimizedContent.replace(
          /<h2/i,
          imageHtml + '\n<h2'
        );
      }
      
      article.content = optimizedContent;
      
      // Recalcular score
      const newAnalysis = SEOAnalyzer.analyzeContent(article.content, article.title, article.keywords);
      console.log(`✅ Score SEO mejorado: ${seoAnalysis.score} → ${newAnalysis.score}`);
    }
    
    return article;
  }
  
  async generateHTMLFile(article, topicData) {
    const filename = AdvancedUtils.generateSafeFilename(article.title) + '.html';
    const filePath = path.join(CONFIG.OUTPUT_DIR, filename);
    
    // Generar schemas
    const articleSchema = SchemaGenerator.generateArticleSchema({...article, filename}, topicData.category);
    const breadcrumbSchema = SchemaGenerator.generateBreadcrumbSchema({...article, filename});
    
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.description}">
    <meta name="keywords" content="${article.keywords.join(', ')}">
    <meta name="author" content="hgaruna - Desarrollo Web Villa Carlos Paz">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${CONFIG.SITE_URL}/blog/${filename}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.description}">
    <meta property="og:image" content="${article.image.url}">
    <meta property="og:url" content="${CONFIG.SITE_URL}/blog/${filename}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="hgaruna">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${article.title}">
    <meta name="twitter:description" content="${article.description}">
    <meta name="twitter:image" content="${article.image.url}">
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    ${JSON.stringify(articleSchema, null, 2)}
    </script>
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbSchema, null, 2)}
    </script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/components/buttons.css">
    <link rel="stylesheet" href="/BlogIA.css">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="article-header">
        <nav class="breadcrumb">
            <a href="/">Inicio</a> > 
            <a href="/blog">Blog</a> > 
            <span>${article.title}</span>
        </nav>
    </header>
    
    <main class="article-main">
        <article class="blog-article">
            <div class="article-meta">
                <span class="category">${topicData.category}</span>
                <span class="difficulty">${article.difficulty}</span>
                <span class="reading-time">${article.readingTime} min lectura</span>
            </div>
            
            <h1 class="article-title">${article.title}</h1>
            
            <div class="article-excerpt">
                <p>${article.excerpt}</p>
            </div>
            
            <div class="article-content">
                ${article.content}
            </div>
            
            <div class="article-footer">
                <div class="article-author">
                    <h3>Sobre el Autor</h3>
                    <p>
                        <strong>Hernán Sarmiento - hgaruna</strong><br>
                        Desarrollador web profesional en Villa Carlos Paz, Córdoba. 
                        Especialista en ${topicData.category.toLowerCase()} y soluciones web modernas.
                    </p>
                    <div class="author-links">
                        <a href="/contacto" class="btn-contact">Trabajemos Juntos</a>
                        <a href="/planes" class="btn-services">Ver Servicios</a>
                    </div>
                </div>
                
                <div class="related-topics">
                    <h3>Temas Relacionados</h3>
                    <div class="topic-tags">
                        ${article.keywords.map(keyword => 
                          `<span class="topic-tag">${keyword}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </article>
        
        <aside class="article-sidebar">
            <div class="cta-box">
                <h3>¿Necesitas Desarrollo Web Profesional?</h3>
                <p>En hgaruna creamos sitios web modernos y optimizados para negocios en Villa Carlos Paz.</p>
                <a href="https://wa.me/+543541237972" class="cta-button" target="_blank">
                    💬 Consulta Gratuita
                </a>
            </div>
            
            <div class="services-box">
                <h3>Nuestros Servicios</h3>
                <ul>
                    <li><a href="/desarrollo-web-villa-carlos-paz">Desarrollo Web</a></li>
                    <li><a href="/diseño-web-villa-carlos-paz">Diseño Web</a></li>
                    <li><a href="/marketing-digital-villa-carlos-paz">Marketing Digital</a></li>
                    <li><a href="/planes">Ver Todos los Planes</a></li>
                </ul>
            </div>
        </aside>
    </main>
    
    <footer class="article-footer-global">
        <p>&copy; 2025 hgaruna - Desarrollo Web Villa Carlos Paz, Córdoba</p>
        <p>
            <a href="/legal">Términos</a> | 
            <a href="/politicas-privacidad">Privacidad</a> | 
            <a href="/contacto">Contacto</a>
        </p>
    </footer>
    
    <!-- Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-5ZCGMRFV8Z"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-5ZCGMRFV8Z');
    </script>
</body>
</html>`;

    await fs.writeFile(filePath, htmlContent, 'utf8');
    console.log(`✅ Archivo generado: ${filename}`);
    
    return {
      filename,
      path: filePath,
      size: htmlContent.length
    };
  }
  
  async generateArticles() {
    console.log('🚀 Iniciando generación de artículos...');
    
    const selectedTopics = await this.selectTopicsIntelligently();
    const generatedArticles = [];
    
    for (let i = 0; i < Math.min(CONFIG.ARTICLES_COUNT, selectedTopics.length); i++) {
      const topicData = selectedTopics[i];
      
      try {
        console.log(`\n📝 Generando artículo ${i + 1}/${CONFIG.ARTICLES_COUNT}: ${topicData.topic}`);
        
        // Generar artículo con Gemini
        const article = await this.generateArticleWithGemini(topicData);
        if (!article) {
          console.error(`❌ No se pudo generar artículo para: ${topicData.topic}`);
          continue;
        }
        
        // Optimizar SEO
        const optimizedArticle = await this.optimizeArticleForSEO(article, topicData);
        
        // Generar archivo HTML
        const fileInfo = await this.generateHTMLFile(optimizedArticle, topicData);
        
        // Guardar información del artículo
        const articleRecord = {
          topic: topicData.topic,
          category: topicData.category,
          title: optimizedArticle.title,
          filename: fileInfo.filename,
          generated: new Date().toISOString(),
          keywords: optimizedArticle.keywords,
          seoScore: SEOAnalyzer.analyzeContent(optimizedArticle.content, optimizedArticle.title, optimizedArticle.keywords).score
        };
        
        generatedArticles.push(articleRecord);
        this.generatedCount++;
        
        console.log(`✅ Artículo completado: ${optimizedArticle.title} (SEO: ${articleRecord.seoScore}/100)`);
        
      } catch (error) {
        console.error(`❌ Error generando artículo ${i + 1}:`, error.message);
      }
    }
    
    // Actualizar registro de artículos
    this.postedArticles.articles.push(...generatedArticles);
    this.postedArticles.lastGenerated = new Date().toISOString();
    await AdvancedUtils.savePostedArticles(this.postedArticles);
    
    console.log(`\n🎉 Generación completada: ${this.generatedCount} artículos creados`);
    return this.generatedCount;
  }
}

// === EJECUCIÓN PRINCIPAL ===
async function main() {
  try {
    const generator = new IntelligentArticleGenerator();
    await generator.initialize();
    const count = await generator.generateArticles();
    
    // Salida para GitHub Actions
    console.log(`Generated ${count} articles`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { IntelligentArticleGenerator, SEOAnalyzer, SchemaGenerator };
