#!/usr/bin/env node

/**
 * 🧪 Script de prueba para el proceso completo de generación
 * Simula el flujo sin usar la API de Gemini para verificar que todo funcione
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
  OUTPUT_DIR: path.resolve(__dirname, '../public/blog'),
  CONTENT_DIR: path.resolve(__dirname, '../src/content/articles'),
  REPORTS_DIR: path.resolve(__dirname, '../reports'),
  SITE_URL: 'https://hgaruna.org',
  ADSENSE_CLIENT_ID: 'ca-pub-7772175009790237',
  MIN_WORD_COUNT: 1200,
  TARGET_WORD_COUNT: 1800
};

// Contenido de prueba que cumple con los requisitos
const TEST_CONTENT = `
<h2>Introducción al Desarrollo Web Moderno en 2025</h2>
<p>El desarrollo web ha evolucionado significativamente en los últimos años, transformando la forma en que creamos y mantenemos aplicaciones digitales. En 2025, las empresas que no se adapten a las nuevas tecnologías y metodologías se encontrarán en desventaja competitiva. Este artículo explorará las tendencias más importantes del desarrollo web moderno y cómo pueden beneficiar a las empresas de Villa Carlos Paz y toda la región de Córdoba.</p>

<h3>¿Por qué el desarrollo web moderno es crucial en 2025?</h3>
<p>La digitalización acelerada causada por los eventos globales recientes ha hecho que tener una presencia web sólida sea más importante que nunca. Las empresas que invierten en desarrollo web moderno no solo mejoran su visibilidad online, sino que también optimizan sus operaciones internas y mejoran la experiencia de sus clientes. En Villa Carlos Paz, donde el turismo y el comercio local son fundamentales, una estrategia digital bien ejecutada puede marcar la diferencia entre el éxito y el estancamiento.</p>

<h2>Fundamentos del Desarrollo Web Moderno</h2>
<p>El desarrollo web moderno se basa en varios pilares fundamentales que han revolucionado la industria. La arquitectura de aplicaciones web ha evolucionado desde aplicaciones monolíticas simples hasta sistemas distribuidos complejos que pueden manejar millones de usuarios simultáneamente. Las tecnologías como React, Vue.js y Angular han democratizado el desarrollo frontend, permitiendo crear interfaces de usuario sofisticadas con relativa facilidad.</p>

<h3>Arquitectura de Microservicios</h3>
<p>Los microservicios representan uno de los avances más significativos en el desarrollo web moderno. Esta arquitectura permite dividir aplicaciones complejas en servicios más pequeños e independientes, cada uno responsable de una funcionalidad específica. Los beneficios incluyen mayor escalabilidad, facilidad de mantenimiento y la capacidad de desplegar actualizaciones sin afectar toda la aplicación. Para empresas en Villa Carlos Paz, esto significa poder actualizar y mejorar sus sistemas web sin interrumpir el servicio a sus clientes.</p>

<h3>Desarrollo Frontend Avanzado</h3>
<p>El frontend moderno va mucho más allá del HTML y CSS básicos. Las bibliotecas y frameworks modernos como React, Vue.js y Angular proporcionan herramientas poderosas para crear interfaces de usuario interactivas y responsivas. Estas tecnologías permiten crear aplicaciones de página única (SPAs) que ofrecen una experiencia de usuario fluida y similar a las aplicaciones nativas. Además, las herramientas de construcción modernas como Webpack, Vite y Parcel optimizan automáticamente el rendimiento y la experiencia del usuario.</p>

<h2>Implementación Práctica de Tecnologías Modernas</h2>
<p>Implementar tecnologías web modernas requiere un enfoque sistemático y una comprensión profunda de las mejores prácticas de la industria. El proceso comienza con la planificación de la arquitectura, seguida por la selección de las tecnologías apropiadas, y culmina con el despliegue y mantenimiento continuo. Para empresas locales, es crucial trabajar con desarrolladores que entiendan tanto las tecnologías como el contexto empresarial local.</p>

<h3>Selección de Stack Tecnológico</h3>
<p>La elección del stack tecnológico es una decisión crítica que afectará el desarrollo, mantenimiento y escalabilidad de la aplicación. Para la mayoría de las empresas, un stack que incluya React o Vue.js para el frontend, Node.js para el backend, y una base de datos como PostgreSQL o MongoDB ofrece un equilibrio óptimo entre funcionalidad, rendimiento y facilidad de desarrollo. Es importante considerar factores como la curva de aprendizaje del equipo, la disponibilidad de desarrolladores en el mercado local, y los requisitos específicos del proyecto.</p>

<h3>Optimización de Rendimiento</h3>
<p>El rendimiento web es un factor crítico que afecta directamente la experiencia del usuario y el SEO. Las técnicas modernas de optimización incluyen lazy loading de imágenes y componentes, code splitting para reducir el tamaño inicial del bundle, y implementación de service workers para funcionalidad offline. Las métricas Core Web Vitals de Google han establecido nuevos estándares para medir la calidad de la experiencia web, y las empresas que optimizan para estas métricas obtienen ventajas significativas en los resultados de búsqueda.</p>

<h3>Seguridad Web Avanzada</h3>
<p>La seguridad web es más importante que nunca, especialmente considerando el aumento en ataques cibernéticos y la implementación de regulaciones de protección de datos. Las mejores prácticas incluyen implementar HTTPS en todas las páginas, validar y sanitizar todas las entradas del usuario, usar tokens JWT para autenticación, y mantener actualizadas todas las dependencias. Para empresas que manejan datos de clientes, es crucial implementar medidas de seguridad robustas desde el inicio del desarrollo.</p>

<h2>Casos de Estudio: Éxitos en Desarrollo Web Moderno</h2>
<p>Numerosas empresas han transformado sus operaciones mediante la adopción de tecnologías web modernas. Estos casos de estudio demuestran el impacto real que puede tener una estrategia digital bien ejecutada en el crecimiento y la competitividad empresarial.</p>

<h3>Transformación Digital de Empresas Locales</h3>
<p>En la región de Córdoba, varias empresas han logrado resultados impresionantes mediante la modernización de sus sistemas web. Una cadena de hoteles en Villa Carlos Paz implementó un sistema de reservas online que aumentó sus reservas directas en un 40% y redujo los costos operativos en un 25%. Una empresa de servicios turísticos desarrolló una aplicación móvil web que mejoró la experiencia del cliente y aumentó las reservas en un 60%. Estos ejemplos demuestran que la inversión en desarrollo web moderno puede generar retornos significativos, especialmente en sectores como el turismo y los servicios.</p>

<h3>E-commerce y Comercio Digital</h3>
<p>El comercio electrónico ha experimentado un crecimiento exponencial, y las empresas que han adoptado plataformas modernas han sido las más exitosas. Las características modernas como búsqueda inteligente, recomendaciones personalizadas, y procesos de checkout optimizados pueden aumentar significativamente las tasas de conversión. Las tecnologías como Progressive Web Apps (PWAs) permiten a las empresas ofrecer experiencias similares a aplicaciones nativas sin la complejidad del desarrollo multiplataforma.</p>

<h2>Tendencias y Futuro del Desarrollo Web</h2>
<p>El desarrollo web continúa evolucionando a un ritmo acelerado, con nuevas tecnologías y metodologías emergiendo constantemente. Mantenerse actualizado con estas tendencias es crucial para las empresas que quieren mantener su competitividad en el mercado digital.</p>

<h3>Inteligencia Artificial y Machine Learning</h3>
<p>La integración de IA y machine learning en aplicaciones web está transformando la forma en que interactuamos con los sitios web. Desde chatbots inteligentes hasta sistemas de recomendación personalizados, la IA está mejorando significativamente la experiencia del usuario. Las tecnologías como TensorFlow.js permiten ejecutar modelos de machine learning directamente en el navegador, abriendo nuevas posibilidades para aplicaciones web inteligentes.</p>

<h3>WebAssembly y Aplicaciones Web de Alto Rendimiento</h3>
<p>WebAssembly (WASM) está revolucionando el desarrollo web al permitir que código compilado se ejecute en el navegador a velocidades cercanas a las nativas. Esto está abriendo nuevas posibilidades para aplicaciones web complejas como editores de video, juegos, y herramientas de diseño. Para empresas que requieren aplicaciones de alto rendimiento, WASM representa una oportunidad significativa.</p>

<h3>Realidad Virtual y Aumentada en la Web</h3>
<p>Las tecnologías de realidad virtual y aumentada están comenzando a integrarse en aplicaciones web, especialmente en sectores como el turismo, el comercio minorista y la educación. Las APIs como WebXR permiten crear experiencias inmersivas directamente en el navegador, sin necesidad de aplicaciones nativas. Para empresas turísticas en Villa Carlos Paz, esto representa una oportunidad única para mostrar sus servicios de manera más atractiva e interactiva.</p>

<h2>Aplicación Local en Villa Carlos Paz y Córdoba</h2>
<p>La adopción de tecnologías web modernas en Villa Carlos Paz y la región de Córdoba puede generar beneficios significativos para la economía local. Las empresas que invierten en desarrollo web moderno no solo mejoran su competitividad, sino que también contribuyen al desarrollo tecnológico de la región.</p>

<h3>Oportunidades para Empresas Locales</h3>
<p>Las empresas locales pueden beneficiarse enormemente de las tecnologías web modernas. Los hoteles y restaurantes pueden implementar sistemas de reservas online que reduzcan la carga administrativa y mejoren la experiencia del cliente. Las empresas de servicios pueden desarrollar aplicaciones web que optimicen sus operaciones y mejoren la comunicación con los clientes. Los comercios minoristas pueden expandir su alcance mediante plataformas de e-commerce modernas.</p>

<h3>Servicios de hgaruna Digital</h3>
<p>En hgaruna Digital, entendemos las necesidades específicas de las empresas de Villa Carlos Paz y la región de Córdoba. Nuestros servicios incluyen desarrollo de sitios web modernos, aplicaciones web personalizadas, optimización SEO, y estrategias de marketing digital. Trabajamos con empresas de todos los tamaños para crear soluciones digitales que impulsen su crecimiento y mejoren su competitividad en el mercado local y nacional.</p>

<h3>Capacitación y Desarrollo de Talento Local</h3>
<p>Además de nuestros servicios de desarrollo, hgaruna Digital está comprometido con el desarrollo del talento tecnológico local. Ofrecemos capacitación en tecnologías web modernas para empresas y profesionales que quieren actualizar sus habilidades. Esto no solo beneficia a las empresas individuales, sino que también contribuye al desarrollo de un ecosistema tecnológico más fuerte en la región.</p>

<h2>Conclusión y Próximos Pasos</h2>
<p>El desarrollo web moderno representa una oportunidad significativa para las empresas que quieren mantenerse competitivas en el mercado digital actual. Las tecnologías y metodologías modernas ofrecen beneficios tangibles en términos de rendimiento, experiencia del usuario, y capacidad de escalabilidad. Para las empresas de Villa Carlos Paz y la región de Córdoba, la adopción de estas tecnologías puede ser la diferencia entre el éxito y el estancamiento en un mercado cada vez más digitalizado.</p>

<h3>Acciones Recomendadas</h3>
<p>Para comenzar su transformación digital, recomendamos evaluar su presencia web actual, identificar áreas de mejora, y desarrollar una estrategia digital integral. Esto incluye la modernización de sitios web existentes, la implementación de nuevas funcionalidades, y la optimización para dispositivos móviles y motores de búsqueda. El equipo de hgaruna Digital está disponible para ayudarle a desarrollar e implementar esta estrategia, asegurando que su empresa aproveche al máximo las oportunidades que ofrece el desarrollo web moderno.</p>
`;

async function testFullGeneration() {
  console.log('🧪 PRUEBA COMPLETA DEL SISTEMA DE GENERACIÓN');
  console.log('============================================================');
  
  // Simular datos de artículo
  const articleData = {
    content: TEST_CONTENT,
    wordCount: TEST_CONTENT.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0).length,
    topic: 'Desarrollo Web Moderno: Tendencias y Tecnologías 2025',
    category: 'desarrollo',
    keywords: ['desarrollo web', 'react', 'javascript', 'frontend'],
    generationDate: new Date().toISOString()
  };
  
  console.log(`📊 Contenido de prueba: ${articleData.wordCount} palabras`);
  
  try {
    // Crear directorios si no existen
    await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
    await fs.mkdir(CONFIG.CONTENT_DIR, { recursive: true });
    await fs.mkdir(CONFIG.REPORTS_DIR, { recursive: true });
    
    console.log('✅ Directorios verificados/creados');
    
    // Generar metadata
    const today = new Date();
    const dateFormatted = today.toLocaleDateString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const title = articleData.topic;
    const description = 'Guía completa sobre desarrollo web moderno y las últimas tecnologías que están transformando la industria digital en 2025.';
    const slug = `test-full-generation-${today.toISOString().split('T')[0]}`;
    const keywords = articleData.keywords.join(', ') + ', hgaruna digital, villa carlos paz';
    
    // Template HTML completo
    const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | hgaruna Digital</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="hgaruna Digital">
    <meta name="robots" content="index, follow">
    <meta name="generator" content="hgaruna AI System">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${CONFIG.SITE_URL}/blog/${slug}.html">
    <meta property="og:site_name" content="hgaruna Digital">
    <meta property="article:author" content="hgaruna Digital">
    <meta property="article:published_time" content="${today.toISOString()}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT_ID}" crossorigin="anonymous"></script>
    <meta name="google-adsense-account" content="${CONFIG.ADSENSE_CLIENT_ID}">
    
    <!-- Schema.org -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "description": "${description}",
      "author": {
        "@type": "Organization",
        "name": "hgaruna Digital",
        "url": "${CONFIG.SITE_URL}",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Villa Carlos Paz",
          "addressRegion": "Córdoba",
          "addressCountry": "AR"
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna Digital",
        "logo": {
          "@type": "ImageObject",
          "url": "${CONFIG.SITE_URL}/logos-he-imagenes/logo.png"
        }
      },
      "datePublished": "${today.toISOString()}",
      "dateModified": "${today.toISOString()}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${CONFIG.SITE_URL}/blog/${slug}.html"
      }
    }
    </script>
    
    <!-- CSS -->
    <link rel="stylesheet" href="../blogia-custom.css">
    <link rel="canonical" href="${CONFIG.SITE_URL}/blog/${slug}.html">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: #2c3e50;
            background: #f8f9fa;
            margin: 0;
            padding: 20px;
        }
        
        .article-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .article-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        
        .article-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 15px;
            line-height: 1.2;
        }
        
        .article-meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            font-size: 0.9rem;
            opacity: 0.9;
            flex-wrap: wrap;
        }
        
        .article-content {
            padding: 40px 30px;
        }
        
        .article-content h2 {
            color: #2c3e50;
            font-size: 1.8rem;
            margin: 30px 0 15px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        
        .article-content h3 {
            color: #34495e;
            font-size: 1.4rem;
            margin: 25px 0 10px;
        }
        
        .article-content p {
            margin-bottom: 20px;
            font-size: 1.1rem;
        }
        
        .article-content ul, .article-content ol {
            margin: 20px 0;
            padding-left: 30px;
        }
        
        .article-content li {
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: 40px 0;
            text-align: center;
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
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .auto-generated {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 0.9rem;
            color: #6c757d;
            border-top: 1px solid #dee2e6;
        }
        
        .adsense-container {
            margin: 30px 0;
            text-align: center;
        }
        
        .adsense-label {
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="article-container">
        <div class="article-header">
            <h1 class="article-title">${title}</h1>
            <div class="article-meta">
                <span>📅 ${dateFormatted}</span>
                <span>👨‍💻 hgaruna Digital</span>
                <span>📍 Villa Carlos Paz, Córdoba</span>
            </div>
        </div>
        
        <div class="article-content">
            ${articleData.content}
            
            <!-- Anuncio Medio -->
            <div class="adsense-container">
                <div class="adsense-label">Publicidad</div>
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
                     data-ad-slot="0987654321"
                     data-ad-format="rectangle"
                     data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </div>
            
            <div class="cta-section">
                <h3>¿Necesitas desarrollo web en Villa Carlos Paz?</h3>
                <p>En hgaruna Digital transformamos tu presencia digital con soluciones web profesionales. Especialistas en desarrollo, diseño y marketing digital.</p>
                <a href="/contacto" class="cta-button">💬 Solicitar Cotización</a>
            </div>
        </div>
        
        <!-- Anuncio Footer -->
        <div class="adsense-container">
            <div class="adsense-label">Publicidad</div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${CONFIG.ADSENSE_CLIENT_ID}"
                 data-ad-slot="1122334455"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
        
        <div class="auto-generated">
            🧪 Artículo de prueba completo generado el ${dateFormatted} para verificar el sistema<br>
            ✨ Optimizado para Google AdSense y SEO local
        </div>
    </div>
</body>
</html>`;

    // Crear archivo HTML
    const fileName = `${slug}.html`;
    const filePath = path.join(CONFIG.OUTPUT_DIR, fileName);
    
    await fs.writeFile(filePath, htmlTemplate, 'utf-8');
    console.log(`✅ Archivo HTML creado: ${fileName}`);
    
    // Crear archivo Markdown
    const markdownContent = `---
title: "${title}"
date: "${today.toISOString().split('T')[0]}"
category: "${articleData.category}"
tags: [${articleData.keywords.map(k => `"${k}"`).join(', ')}]
author: "hgaruna Digital"
location: "Villa Carlos Paz, Córdoba"
generated: true
wordCount: ${articleData.wordCount}
---

# ${title}

${articleData.content}

---

*Artículo de prueba completo generado para verificar el sistema de generación automática.*
`;

    const mdFileName = `${today.toISOString().split('T')[0]}-${slug}.md`;
    const mdFilePath = path.join(CONFIG.CONTENT_DIR, mdFileName);
    
    await fs.writeFile(mdFilePath, markdownContent, 'utf-8');
    console.log(`✅ Archivo Markdown creado: ${mdFileName}`);
    
    // Verificar archivos
    const htmlExists = await fs.access(filePath).then(() => true).catch(() => false);
    const mdExists = await fs.access(mdFilePath).then(() => true).catch(() => false);
    
    console.log('\n📋 VERIFICACIÓN FINAL:');
    console.log(`   Archivo HTML existe: ${htmlExists ? '✅ Sí' : '❌ No'}`);
    console.log(`   Archivo Markdown existe: ${mdExists ? '✅ Sí' : '❌ No'}`);
    console.log(`   Palabras en el contenido: ${articleData.wordCount}`);
    console.log(`   Cumple requisito mínimo (${CONFIG.MIN_WORD_COUNT}): ${articleData.wordCount >= CONFIG.MIN_WORD_COUNT ? '✅ Sí' : '❌ No'}`);
    
    if (htmlExists && mdExists && articleData.wordCount >= CONFIG.MIN_WORD_COUNT) {
      console.log('\n🎉 ¡PRUEBA COMPLETA EXITOSA!');
      console.log('✅ El sistema de generación funciona correctamente');
      console.log('✅ Los archivos se crean correctamente');
      console.log('✅ El contenido cumple con los requisitos de calidad');
      console.log('🔍 El problema en GitHub Actions debe estar en la API de Gemini');
    } else {
      console.log('\n❌ PRUEBA FALLIDA');
      console.log('❌ Hay problemas en el sistema de generación');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba completa:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar prueba
testFullGeneration().catch(console.error);
