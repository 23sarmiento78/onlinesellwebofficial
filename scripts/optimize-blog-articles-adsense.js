const fs = require('fs').promises;
const path = require('path');

const ADSENSE_SCRIPT = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7772175009790237"
     crossorigin="anonymous"></script>`;

async function optimizeBlogArticles() {
  try {
    console.log('🚀 Optimizando artículos del blog para Google AdSense...');
    
    const blogDir = path.join(process.cwd(), 'public', 'blog');
    const files = await fs.readdir(blogDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`📰 Encontrados ${htmlFiles.length} artículos HTML`);
    
    let optimizedCount = 0;
    let alreadyOptimizedCount = 0;
    
    for (const filename of htmlFiles) {
      const filePath = path.join(blogDir, filename);
      
      try {
        let content = await fs.readFile(filePath, 'utf8');
        let modified = false;
        
        // 1. Verificar y agregar script de AdSense si no existe
        if (!content.includes('pagead2.googlesyndication.com')) {
          console.log(`➕ Agregando script AdSense a ${filename}`);
          content = content.replace(
            /<\/head>/,
            `    ${ADSENSE_SCRIPT}\n</head>`
          );
          modified = true;
        }
        
        // 2. Mejorar meta description si es muy corta
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        if (descMatch && descMatch[1].length < 120) {
          console.log(`📝 Mejorando meta description de ${filename}`);
          const newDesc = enhanceDescription(descMatch[1], filename);
          content = content.replace(
            descMatch[0],
            `<meta name="description" content="${newDesc}"`
          );
          modified = true;
        }
        
        // 3. Agregar keywords si están vacías
        const keywordsMatch = content.match(/<meta name="keywords" content="(.*?)"/);
        if (keywordsMatch && keywordsMatch[1].trim() === '') {
          console.log(`🔑 Agregando keywords a ${filename}`);
          const keywords = generateKeywords(filename, content);
          content = content.replace(
            keywordsMatch[0],
            `<meta name="keywords" content="${keywords}"`
          );
          modified = true;
        }
        
        // 4. Asegurar estructura de contenido para AdSense
        content = ensureAdSenseStructure(content, filename);
        
        // 5. Mejorar contenido para compliance de AdSense
        content = improveContentForAdSense(content);
        
        // 6. Agregar Schema.org markup si no existe
        if (!content.includes('"@type": "Article"')) {
          console.log(`📋 Agregando Schema.org markup a ${filename}`);
          content = addSchemaMarkup(content, filename);
          modified = true;
        }
        
        // 7. Optimizar imágenes alt text
        content = optimizeImageAltText(content);
        
        if (modified) {
          await fs.writeFile(filePath, content, 'utf8');
          optimizedCount++;
          console.log(`✅ Optimizado: ${filename}`);
        } else {
          alreadyOptimizedCount++;
          console.log(`✓ Ya optimizado: ${filename}`);
        }
        
      } catch (error) {
        console.error(`❌ Error procesando ${filename}:`, error.message);
      }
    }
    
    console.log('\n📊 Resumen de optimización:');
    console.log(`   - Artículos optimizados: ${optimizedCount}`);
    console.log(`   - Ya optimizados: ${alreadyOptimizedCount}`);
    console.log(`   - Total procesados: ${htmlFiles.length}`);
    
    // Crear reporte de AdSense compliance
    await createAdSenseComplianceReport(htmlFiles);
    
    console.log('✅ Optimización completada!');
    
  } catch (error) {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  }
}

function enhanceDescription(originalDesc, filename) {
  const baseDesc = originalDesc.endsWith('...') ? 
    originalDesc.replace(/\.\.\.$/, '') : 
    originalDesc;
    
  const topic = extractTopicFromFilename(filename);
  
  const enhancements = [
    ` Aprende ${topic} paso a paso con ejemplos prácticos.`,
    ` Guía completa para desarrolladores.`,
    ` Tutorial actualizado 2024.`,
    ` Incluye mejores prácticas y casos de uso reales.`
  ];
  
  let enhanced = baseDesc;
  for (const enhancement of enhancements) {
    if ((enhanced + enhancement).length <= 155) {
      enhanced += enhancement;
    } else {
      break;
    }
  }
  
  return enhanced;
}

function extractTopicFromFilename(filename) {
  const topicMap = {
    'react': 'React y componentes modernos',
    'angular': 'Angular y desarrollo frontend',
    'nodejs': 'Node.js y backend',
    'python': 'Python y desarrollo backend',
    'docker': 'Docker y contenedores',
    'kubernetes': 'Kubernetes y orquestación',
    'javascript': 'JavaScript moderno',
    'typescript': 'TypeScript y tipado',
    'testing': 'testing y calidad de código',
    'security': 'seguridad en aplicaciones web',
    'database': 'bases de datos y SQL',
    'api': 'APIs REST y GraphQL',
    'devops': 'DevOps y CI/CD',
    'performance': 'optimización y rendimiento',
    'mobile': 'desarrollo móvil',
    'web': 'desarrollo web moderno'
  };
  
  for (const [key, value] of Object.entries(topicMap)) {
    if (filename.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return 'desarrollo y programación';
}

function generateKeywords(filename, content) {
  const title = content.match(/<title>(.*?)<\/title>/)?.[1] || '';
  const description = content.match(/<meta name="description" content="(.*?)"/)?.[1] || '';
  
  const keywordSets = {
    'react': ['React', 'JavaScript', 'Frontend', 'Componentes', 'JSX', 'Hooks'],
    'angular': ['Angular', 'TypeScript', 'Frontend', 'SPA', 'Framework'],
    'nodejs': ['Node.js', 'JavaScript', 'Backend', 'API', 'Express'],
    'python': ['Python', 'Backend', 'Programación', 'API', 'Flask', 'Django'],
    'docker': ['Docker', 'Contenedores', 'DevOps', 'Deployment', 'Microservicios'],
    'kubernetes': ['Kubernetes', 'DevOps', 'Orquestación', 'Containers', 'Cloud'],
    'testing': ['Testing', 'QA', 'Pruebas', 'Jest', 'Cypress', 'Automatización'],
    'security': ['Seguridad', 'OWASP', 'Vulnerabilidades', 'Pentesting', 'SSL'],
    'database': ['Base de datos', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL'],
    'performance': ['Performance', 'Optimización', 'Velocidad', 'Core Web Vitals'],
    'cicd': ['CI/CD', 'DevOps', 'Automatización', 'GitHub Actions', 'Jenkins']
  };
  
  let keywords = ['Desarrollo', 'Programación', 'Tutorial', 'Guía'];
  
  for (const [key, words] of Object.entries(keywordSets)) {
    if (filename.toLowerCase().includes(key) || 
        title.toLowerCase().includes(key) || 
        description.toLowerCase().includes(key)) {
      keywords = keywords.concat(words.slice(0, 4));
      break;
    }
  }
  
  return [...new Set(keywords)].slice(0, 8).join(', ');
}

function ensureAdSenseStructure(content, filename) {
  // Asegurar que hay suficiente contenido de calidad
  if (!content.includes('<main>') && !content.includes('role="main"')) {
    content = content.replace(
      /<body[^>]*>/,
      '$&\n<main role="main">'
    ).replace(
      /<\/body>/,
      '</main>\n$&'
    );
  }
  
  return content;
}

function improveContentForAdSense(content) {
  // Asegurar que no hay contenido que pueda ser problemático para AdSense
  const problematicPatterns = [
    /\bclick here\b/gi,
    /\bmake money fast\b/gi,
    /\bget rich quick\b/gi
  ];
  
  problematicPatterns.forEach(pattern => {
    content = content.replace(pattern, match => {
      if (match.toLowerCase().includes('click here')) {
        return 'lee más información';
      }
      return match; // Para otros patrones, mantener el texto original
    });
  });
  
  return content;
}

function addSchemaMarkup(content, filename) {
  const title = content.match(/<title>(.*?)<\/title>/)?.[1] || filename;
  const description = content.match(/<meta name="description" content="(.*?)"/)?.[1] || '';
  const canonicalUrl = content.match(/<link rel="canonical" href="(.*?)"/)?.[1] || '';
  
  const schemaMarkup = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title.replace(/"/g, '\\"')}",
      "description": "${description.replace(/"/g, '\\"')}",
      "author": {
        "@type": "Organization",
        "name": "hgaruna",
        "url": "https://hgaruna.netlify.app"
      },
      "publisher": {
        "@type": "Organization",
        "name": "hgaruna",
        "logo": {
          "@type": "ImageObject",
          "url": "https://hgaruna.netlify.app/logo.png"
        }
      },
      "datePublished": "${new Date().toISOString()}",
      "dateModified": "${new Date().toISOString()}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      }
    }
    </script>`;
  
  return content.replace(/<\/head>/, `${schemaMarkup}\n</head>`);
}

function optimizeImageAltText(content) {
  // Mejorar alt text de imágenes si está vacío
  return content.replace(
    /<img([^>]*)\salt=""\s*([^>]*)>/gi,
    '<img$1 alt="Imagen ilustrativa del tutorial de programación"$2>'
  ).replace(
    /<img([^>]*?)(?:\salt="[^"]*")?([^>]*?)>/gi,
    (match, before, after) => {
      if (!match.includes('alt=')) {
        return `<img${before} alt="Diagrama o imagen del tutorial"${after}>`;
      }
      return match;
    }
  );
}

async function createAdSenseComplianceReport(htmlFiles) {
  const report = {
    timestamp: new Date().toISOString(),
    totalArticles: htmlFiles.length,
    adsenseOptimized: 0,
    recommendations: [],
    checklist: {
      hasAdSenseScript: 0,
      hasQualityContent: 0,
      hasMetaDescription: 0,
      hasKeywords: 0,
      hasSchemaMarkup: 0,
      hasCanonicalUrl: 0
    }
  };
  
  for (const filename of htmlFiles) {
    const filePath = path.join(process.cwd(), 'public', 'blog', filename);
    const content = await fs.readFile(filePath, 'utf8');
    
    if (content.includes('pagead2.googlesyndication.com')) {
      report.checklist.hasAdSenseScript++;
    }
    
    const descMatch = content.match(/<meta name="description" content="(.*?)"/);
    if (descMatch && descMatch[1].length > 100) {
      report.checklist.hasQualityContent++;
    }
    
    if (descMatch) {
      report.checklist.hasMetaDescription++;
    }
    
    const keywordsMatch = content.match(/<meta name="keywords" content="(.*?)"/);
    if (keywordsMatch && keywordsMatch[1].trim() !== '') {
      report.checklist.hasKeywords++;
    }
    
    if (content.includes('"@type": "Article"')) {
      report.checklist.hasSchemaMarkup++;
    }
    
    if (content.includes('<link rel="canonical"')) {
      report.checklist.hasCanonicalUrl++;
    }
  }
  
  // Generar recomendaciones
  if (report.checklist.hasAdSenseScript < htmlFiles.length) {
    report.recommendations.push('Agregar script de AdSense a todos los artículos');
  }
  
  if (report.checklist.hasQualityContent < htmlFiles.length * 0.9) {
    report.recommendations.push('Mejorar la calidad y longitud del contenido');
  }
  
  if (report.checklist.hasSchemaMarkup < htmlFiles.length * 0.8) {
    report.recommendations.push('Agregar Schema.org markup a más artículos');
  }
  
  const reportPath = path.join(process.cwd(), 'public', 'adsense-compliance-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📋 Reporte de Compliance AdSense creado:');
  console.log(`   - Artículos con script AdSense: ${report.checklist.hasAdSenseScript}/${htmlFiles.length}`);
  console.log(`   - Artículos con contenido de calidad: ${report.checklist.hasQualityContent}/${htmlFiles.length}`);
  console.log(`   - Artículos con Schema markup: ${report.checklist.hasSchemaMarkup}/${htmlFiles.length}`);
  console.log(`   - Reporte guardado en: ${reportPath}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  optimizeBlogArticles()
    .then(() => console.log('🎉 Optimización completada exitosamente!'))
    .catch(console.error);
}

module.exports = { optimizeBlogArticles };
