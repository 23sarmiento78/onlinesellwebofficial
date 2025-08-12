// scripts/validate-adsense-compliance.js
// Valida que todos los artículos cumplan con las políticas de AdSense

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const COMPLIANCE_RULES = {
  minWordCount: 500,
  maxAdsPerPage: 3,
  minH2Count: 2,
  minMetaDescriptionLength: 120,
  maxMetaDescriptionLength: 160,
  requiredMetaTags: [
    'viewport',
    'description',
    'robots'
  ],
  contentQuality: {
    minParagraphs: 5,
    minSentencesPerParagraph: 2,
    maxAdToContentRatio: 0.3
  }
};

async function validateAdSenseCompliance() {
  console.log('🔍 Iniciando validación de compliance AdSense...');
  
  const blogDir = path.resolve(__dirname, '../public/blog');
  const educationalDir = path.resolve(__dirname, '../public/aprende-programacion');
  
  const report = {
    totalFiles: 0,
    compliantFiles: 0,
    issues: [],
    summary: {}
  };
  
  // Validar directorio de blog
  if (fs.existsSync(blogDir)) {
    await validateDirectory(blogDir, 'blog', report);
  }
  
  // Validar directorio educativo
  if (fs.existsSync(educationalDir)) {
    await validateDirectory(educationalDir, 'educational', report);
  }
  
  // Generar reporte
  generateComplianceReport(report);
  
  // Retornar código de salida
  const complianceRate = report.compliantFiles / report.totalFiles;
  if (complianceRate < 0.8) {
    console.error('❌ Tasa de compliance muy baja:', Math.round(complianceRate * 100) + '%');
    process.exit(1);
  } else {
    console.log('✅ Compliance AdSense satisfactorio:', Math.round(complianceRate * 100) + '%');
  }
}

async function validateDirectory(directory, type, report) {
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.html'));
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const validation = await validateHTMLFile(filePath, type);
    
    report.totalFiles++;
    if (validation.isCompliant) {
      report.compliantFiles++;
    } else {
      report.issues.push({
        file: file,
        type: type,
        issues: validation.issues,
        wordCount: validation.wordCount,
        score: validation.score
      });
    }
  }
}

async function validateHTMLFile(filePath, type) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    
    const issues = [];
    let score = 100;
    
    // 1. Validar contenido mínimo
    const content = $('body').text();
    const wordCount = content.split(/\\s+/).filter(word => word.length > 0).length;
    
    if (wordCount < COMPLIANCE_RULES.minWordCount) {
      issues.push(`Contenido insuficiente: ${wordCount} palabras (mínimo ${COMPLIANCE_RULES.minWordCount})`);
      score -= 20;
    }
    
    // 2. Validar estructura HTML
    const structureIssues = validateHTMLStructure($);
    issues.push(...structureIssues);
    score -= structureIssues.length * 5;
    
    // 3. Validar meta tags
    const metaIssues = validateMetaTags($);
    issues.push(...metaIssues);
    score -= metaIssues.length * 10;
    
    // 4. Validar anuncios
    const adIssues = validateAdsPlacement($);
    issues.push(...adIssues);
    score -= adIssues.length * 15;
    
    // 5. Validar calidad de contenido
    const qualityIssues = validateContentQuality($);
    issues.push(...qualityIssues);
    score -= qualityIssues.length * 5;
    
    // 6. Validar SEO
    const seoIssues = validateSEO($);
    issues.push(...seoIssues);
    score -= seoIssues.length * 8;
    
    // 7. Validar performance
    const performanceIssues = validatePerformance($);
    issues.push(...performanceIssues);
    score -= performanceIssues.length * 3;
    
    return {
      isCompliant: issues.length === 0,
      issues,
      wordCount,
      score: Math.max(0, score)
    };
    
  } catch (error) {
    return {
      isCompliant: false,
      issues: [`Error validando archivo: ${error.message}`],
      wordCount: 0,
      score: 0
    };
  }
}

function validateHTMLStructure($) {
  const issues = [];
  
  // Verificar H1 único
  const h1Count = $('h1').length;
  if (h1Count === 0) {
    issues.push('Falta encabezado H1');
  } else if (h1Count > 1) {
    issues.push(`Múltiples H1 encontrados: ${h1Count}`);
  }
  
  // Verificar jerarquía de encabezados
  const h2Count = $('h2').length;
  if (h2Count < COMPLIANCE_RULES.minH2Count) {
    issues.push(`Pocos H2: ${h2Count} (mínimo ${COMPLIANCE_RULES.minH2Count})`);
  }
  
  // Verificar párrafos
  const paragraphCount = $('p').length;
  if (paragraphCount < COMPLIANCE_RULES.contentQuality.minParagraphs) {
    issues.push(`Pocos párrafos: ${paragraphCount} (mínimo ${COMPLIANCE_RULES.contentQuality.minParagraphs})`);
  }
  
  return issues;
}

function validateMetaTags($) {
  const issues = [];
  
  // Verificar meta tags requeridos
  COMPLIANCE_RULES.requiredMetaTags.forEach(tag => {
    if (!$(`meta[name="${tag}"]`).length) {
      issues.push(`Falta meta tag: ${tag}`);
    }
  });
  
  // Verificar meta description
  const metaDescription = $('meta[name="description"]').attr('content');
  if (!metaDescription) {
    issues.push('Falta meta description');
  } else {
    if (metaDescription.length < COMPLIANCE_RULES.minMetaDescriptionLength) {
      issues.push(`Meta description muy corta: ${metaDescription.length} caracteres`);
    }
    if (metaDescription.length > COMPLIANCE_RULES.maxMetaDescriptionLength) {
      issues.push(`Meta description muy larga: ${metaDescription.length} caracteres`);
    }
  }
  
  // Verificar title
  const title = $('title').text();
  if (!title) {
    issues.push('Falta título');
  } else if (title.length < 30) {
    issues.push(`Título muy corto: ${title.length} caracteres`);
  } else if (title.length > 60) {
    issues.push(`Título muy largo: ${title.length} caracteres`);
  }
  
  return issues;
}

function validateAdsPlacement($) {
  const issues = [];
  
  const adCount = $('.adsbygoogle').length;
  const content = $('body').text();
  const wordCount = content.split(/\\s+/).length;
  
  // Verificar cantidad de anuncios
  if (adCount > COMPLIANCE_RULES.maxAdsPerPage) {
    issues.push(`Demasiados anuncios: ${adCount} (máximo ${COMPLIANCE_RULES.maxAdsPerPage})`);
  }
  
  // Verificar ratio anuncios/contenido
  const adToContentRatio = adCount / wordCount * 1000; // anuncios por 1000 palabras
  if (adToContentRatio > COMPLIANCE_RULES.contentQuality.maxAdToContentRatio * 1000) {
    issues.push(`Ratio anuncios/contenido muy alto: ${adToContentRatio.toFixed(2)}/1000 palabras`);
  }
  
  // Verificar que los anuncios tengan los atributos correctos
  $('.adsbygoogle').each((i, el) => {
    const $ad = $(el);
    if (!$ad.attr('data-ad-client')) {
      issues.push(`Anuncio ${i + 1} sin data-ad-client`);
    }
    if (!$ad.attr('data-ad-slot')) {
      issues.push(`Anuncio ${i + 1} sin data-ad-slot`);
    }
  });
  
  return issues;
}

function validateContentQuality($) {
  const issues = [];
  
  // Verificar longitud de párrafos
  $('p').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 0) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length < COMPLIANCE_RULES.contentQuality.minSentencesPerParagraph) {
        issues.push(`Párrafo ${i + 1} muy corto: ${sentences.length} oraciones`);
      }
    }
  });
  
  // Verificar diversidad de contenido
  const headings = $('h2, h3').length;
  const lists = $('ul, ol').length;
  const images = $('img').length;
  
  if (headings < 3) {
    issues.push(`Pocos subtítulos para estructurar contenido: ${headings}`);
  }
  
  if (lists === 0) {
    issues.push('No hay listas para mejorar legibilidad');
  }
  
  return issues;
}

function validateSEO($) {
  const issues = [];
  
  // Verificar imágenes con alt
  $('img').each((i, el) => {
    const $img = $(el);
    if (!$img.attr('alt')) {
      issues.push(`Imagen ${i + 1} sin atributo alt`);
    }
  });
  
  // Verificar enlaces internos
  const internalLinks = $('a[href^="/"], a[href^="./"], a[href^="../"]').length;
  if (internalLinks < 2) {
    issues.push(`Pocos enlaces internos: ${internalLinks} (recomendado: 3+)`);
  }
  
  // Verificar Schema.org
  if (!$('script[type="application/ld+json"]').length) {
    issues.push('Falta markup Schema.org');
  }
  
  return issues;
}

function validatePerformance($) {
  const issues = [];
  
  // Verificar lazy loading en imágenes
  const images = $('img');
  const lazyImages = $('img[loading="lazy"]');
  
  if (images.length > 0 && lazyImages.length === 0) {
    issues.push('Ninguna imagen tiene lazy loading');
  }
  
  // Verificar CSS inline excesivo
  const inlineStyles = $('[style]').length;
  if (inlineStyles > 5) {
    issues.push(`Demasiados estilos inline: ${inlineStyles}`);
  }
  
  return issues;
}

function generateComplianceReport(report) {
  console.log('\\n📊 REPORTE DE COMPLIANCE ADSENSE');
  console.log('================================');
  console.log(`📁 Archivos analizados: ${report.totalFiles}`);
  console.log(`✅ Archivos conformes: ${report.compliantFiles}`);
  console.log(`❌ Archivos con problemas: ${report.totalFiles - report.compliantFiles}`);
  console.log(`📈 Tasa de compliance: ${Math.round((report.compliantFiles / report.totalFiles) * 100)}%`);
  
  if (report.issues.length > 0) {
    console.log('\\n🚨 PROBLEMAS ENCONTRADOS:');
    console.log('==========================');
    
    report.issues.forEach(fileIssue => {
      console.log(`\\n📄 ${fileIssue.file} (${fileIssue.type})`);
      console.log(`   📊 Score: ${fileIssue.score}/100`);
      console.log(`   📝 Palabras: ${fileIssue.wordCount}`);
      console.log('   ⚠️  Problemas:');
      fileIssue.issues.forEach(issue => {
        console.log(`      • ${issue}`);
      });
    });
    
    // Resumen de problemas más comunes
    const allIssues = report.issues.flatMap(f => f.issues);
    const issueCount = {};
    allIssues.forEach(issue => {
      const category = issue.split(':')[0];
      issueCount[category] = (issueCount[category] || 0) + 1;
    });
    
    console.log('\\n📈 PROBLEMAS MÁS COMUNES:');
    console.log('==========================');
    Object.entries(issueCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([issue, count]) => {
        console.log(`   ${count}x ${issue}`);
      });
  }
  
  // Guardar reporte en archivo
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: report.totalFiles,
      compliantFiles: report.compliantFiles,
      complianceRate: Math.round((report.compliantFiles / report.totalFiles) * 100)
    },
    issues: report.issues
  };
  
  const reportPath = path.join(__dirname, '../adsense-compliance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\\n💾 Reporte guardado en: ${reportPath}`);
}

if (require.main === module) {
  validateAdSenseCompliance().catch(console.error);
}

module.exports = { validateAdSenseCompliance };
