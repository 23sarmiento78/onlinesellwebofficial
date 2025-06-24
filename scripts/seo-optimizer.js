const fs = require('fs');
const path = require('path');

// Configuración SEO avanzada para Villa Carlos Paz
const seoConfig = {
  siteUrl: 'https://service.hgaruna.org',
  targetLocation: 'Villa Carlos Paz, Córdoba, Argentina',
  primaryKeywords: [
    'desarrollo web villa carlos paz',
    'diseño web carlos paz',
    'marketing digital córdoba',
    'sitios web profesionales villa carlos paz',
    'seo local carlos paz',
    'mantenimiento web córdoba',
    'e-commerce villa carlos paz',
    'programación web carlos paz'
  ],
  secondaryKeywords: [
    'desarrollo web para restaurantes villa carlos paz',
    'sitio web para hotel carlos paz',
    'marketing digital para turismo córdoba',
    'diseño web para comercios locales',
    'creación de páginas web villa carlos paz',
    'optimización seo córdoba',
    'tienda online villa carlos paz',
    'aplicaciones web carlos paz'
  ],
  longTailKeywords: [
    'desarrollo web profesional villa carlos paz precios',
    'mejor diseñador web carlos paz',
    'seo local para negocios villa carlos paz',
    'mantenimiento de sitios web córdoba',
    'crear tienda online villa carlos paz',
    'diseño web responsivo carlos paz',
    'marketing digital para hoteles córdoba',
    'programador web villa carlos paz'
  ]
};

// Generar meta tags optimizados
function generateOptimizedMetaTags() {
  const metaTags = {
    homepage: {
      title: "hgaruna - Desarrollo Web Profesional y Marketing Digital en Villa Carlos Paz",
      description: "Desarrollo web profesional en Villa Carlos Paz, Córdoba. Creamos sitios web personalizados, e-commerce y marketing digital para negocios locales. ¡Potencia tu presencia online!",
      keywords: "desarrollo web villa carlos paz, diseño web carlos paz, marketing digital córdoba, sitios web profesionales, seo local, e-commerce villa carlos paz",
      ogTitle: "hgaruna: Desarrollo Web y Marketing Digital en Villa Carlos Paz",
      ogDescription: "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba. Sitios web personalizados para negocios locales con las mejores tecnologías.",
      ogImage: "https://service.hgaruna.org/logos-he-imagenes/logo3.png",
      ogUrl: "https://service.hgaruna.org/"
    },
    services: {
      title: "Servicios de Desarrollo Web en Villa Carlos Paz - hgaruna",
      description: "Servicios completos de desarrollo web en Villa Carlos Paz: sitios web profesionales, e-commerce, SEO local y marketing digital. ¡Transforma tu negocio!",
      keywords: "servicios desarrollo web villa carlos paz, diseño sitios web carlos paz, marketing digital córdoba, seo local villa carlos paz",
      ogTitle: "Servicios de Desarrollo Web Villa Carlos Paz - hgaruna",
      ogDescription: "Servicios profesionales de desarrollo web en Villa Carlos Paz. Sitios web, e-commerce, SEO y marketing digital para tu negocio local.",
      ogImage: "https://service.hgaruna.org/logos-he-imagenes/programacion.jpeg",
      ogUrl: "https://service.hgaruna.org/planes/"
    },
    contact: {
      title: "Contacto Desarrollo Web Villa Carlos Paz - hgaruna",
      description: "Contacta con hgaruna para desarrollo web profesional en Villa Carlos Paz. Consultas gratuitas, presupuestos personalizados y atención local. ¡Hablemos de tu proyecto!",
      keywords: "contacto desarrollo web villa carlos paz, presupuesto sitio web carlos paz, consulta desarrollo web córdoba",
      ogTitle: "Contacto Desarrollo Web Villa Carlos Paz - hgaruna",
      ogDescription: "Contacta con expertos en desarrollo web en Villa Carlos Paz. Consultas gratuitas y presupuestos personalizados para tu proyecto digital.",
      ogImage: "https://service.hgaruna.org/logos-he-imagenes/logo3.png",
      ogUrl: "https://service.hgaruna.org/"
    }
  };

  return metaTags;
}

// Generar Schema.org estructurado avanzado
function generateAdvancedSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "hgaruna",
        "alternateName": "hgaruna Desarrollo Web Villa Carlos Paz",
        "url": "https://service.hgaruna.org/",
        "logo": "https://service.hgaruna.org/logos-he-imagenes/logo3.png",
        "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba. Creamos sitios web personalizados para negocios locales.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Villa Carlos Paz",
          "addressRegion": "Córdoba",
          "addressCountry": "AR",
          "postalCode": "5152"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+54-3541-237972",
            "contactType": "Customer Service",
            "email": "23sarmiento@gmail.com",
            "availableLanguage": "Spanish"
          },
          {
            "@type": "ContactPoint",
            "telephone": "+54-3541-237972",
            "contactType": "Sales",
            "email": "23sarmiento@gmail.com",
            "availableLanguage": "Spanish"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61557007626922",
          "https://www.instagram.com/onlinesellweb/"
        ],
        "areaServed": [
          {
            "@type": "City",
            "name": "Villa Carlos Paz"
          },
          {
            "@type": "City", 
            "name": "Córdoba"
          },
          {
            "@type": "City",
            "name": "Cosquín"
          },
          {
            "@type": "City",
            "name": "La Falda"
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Servicios de Desarrollo Web Villa Carlos Paz",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Desarrollo Web Profesional",
                "description": "Sitios web personalizados para negocios en Villa Carlos Paz y Córdoba",
                "provider": {
                  "@type": "Organization",
                  "name": "hgaruna"
                }
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "Service",
                "name": "E-commerce",
                "description": "Tiendas online para comercios de Villa Carlos Paz",
                "provider": {
                  "@type": "Organization",
                  "name": "hgaruna"
                }
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service", 
                "name": "SEO Local",
                "description": "Optimización para búsquedas locales en Villa Carlos Paz",
                "provider": {
                  "@type": "Organization",
                  "name": "hgaruna"
                }
              }
            }
          ]
        }
      },
      {
        "@type": "LocalBusiness",
        "name": "hgaruna - Desarrollo Web Villa Carlos Paz",
        "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba",
        "url": "https://service.hgaruna.org/",
        "telephone": "+54-3541-237972",
        "email": "23sarmiento@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Villa Carlos Paz",
          "addressRegion": "Córdoba", 
          "addressCountry": "AR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "-31.4201",
          "longitude": "-64.4998"
        },
        "serviceArea": {
          "@type": "City",
          "name": "Villa Carlos Paz"
        },
        "priceRange": "$$",
        "openingHours": "Mo-Fr 09:00-18:00, Sa 10:00-14:00",
        "currenciesAccepted": "ARS",
        "paymentAccepted": "Cash, Credit Card, Bank Transfer",
        "category": "Desarrollo de Software"
      },
      {
        "@type": "WebSite",
        "url": "https://service.hgaruna.org/",
        "name": "hgaruna - Desarrollo Web Villa Carlos Paz",
        "description": "Desarrollo web profesional y marketing digital en Villa Carlos Paz, Córdoba",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://service.hgaruna.org/blog/?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Cuánto cuesta un sitio web en Villa Carlos Paz?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Los precios varían según las necesidades. Tenemos planes desde $150 hasta $500. Consulta gratuita disponible."
            }
          },
          {
            "@type": "Question", 
            "name": "¿Hacen SEO local para Villa Carlos Paz?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, especializamos en SEO local para que aparezcas en búsquedas de Villa Carlos Paz y alrededores."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuánto tiempo toma desarrollar un sitio web?",
            "acceptedAnswer": {
              "@type": "Answer", 
              "text": "Depende de la complejidad. Sitios básicos en 1-2 semanas, proyectos complejos en 3-4 semanas."
            }
          }
        ]
      }
    ]
  };

  return schema;
}

// Generar sitemap XML optimizado
function generateOptimizedSitemap() {
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/planes/', priority: '0.9', changefreq: 'weekly' },
    { url: '/mi-experiencia/', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog/', priority: '0.8', changefreq: 'weekly' },
    { url: '/legal/', priority: '0.5', changefreq: 'monthly' },
    { url: '/blog/desarrollo-web-profesional-en-villa-carlos-paz-potenciando-negocios-locales/', priority: '0.9', changefreq: 'monthly' }
  ];

  // Agregar páginas de palabras clave
  seoConfig.primaryKeywords.forEach(keyword => {
    pages.push({
      url: `/servicios/${keyword.replace(/\s+/g, '-')}/`,
      priority: '0.7',
      changefreq: 'monthly'
    });
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(page => `  <url>
    <loc>${seoConfig.siteUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapContent;
}

// Generar robots.txt optimizado
function generateOptimizedRobots() {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${seoConfig.siteUrl}/sitemap-index.xml
Sitemap: ${seoConfig.siteUrl}/local-sitemap.xml
Sitemap: ${seoConfig.siteUrl}/optimized-sitemap.xml

# Crawl-delay para ser amigable con los servidores
Crawl-delay: 1

# Permitir acceso a recursos importantes
Allow: /css/
Allow: /js/
Allow: /logos-he-imagenes/
Allow: /uploads/

# Bloquear archivos innecesarios
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /*.txt$`;
}

// Generar archivo de palabras clave para SEO
function generateKeywordFile() {
  const keywordData = {
    primaryKeywords: seoConfig.primaryKeywords,
    secondaryKeywords: seoConfig.secondaryKeywords,
    longTailKeywords: seoConfig.longTailKeywords,
    locationBasedKeywords: [
      'desarrollo web villa carlos paz',
      'diseño web carlos paz',
      'programador web villa carlos paz',
      'crear sitio web villa carlos paz',
      'marketing digital córdoba',
      'seo local villa carlos paz',
      'tienda online carlos paz',
      'mantenimiento web córdoba'
    ],
    industryKeywords: [
      'desarrollo web para restaurantes',
      'sitio web para hoteles',
      'e-commerce para comercios',
      'web para profesionales',
      'marketing digital para turismo',
      'seo para negocios locales'
    ],
    searchIntent: {
      informational: [
        'cómo crear un sitio web',
        'qué es el seo local',
        'beneficios del marketing digital',
        'precios desarrollo web villa carlos paz'
      ],
      transactional: [
        'contratar desarrollador web villa carlos paz',
        'comprar sitio web carlos paz',
        'contratar seo local córdoba',
        'desarrollo web villa carlos paz precios'
      ],
      navigational: [
        'hgaruna villa carlos paz',
        'desarrollo web carlos paz',
        'programador web córdoba'
      ]
    }
  };

  return keywordData;
}

// Función principal para ejecutar todas las optimizaciones
function runSEOOptimization() {
  console.log('🚀 Iniciando optimización SEO avanzada...\n');

  // Generar meta tags optimizados
  const metaTags = generateOptimizedMetaTags();
  fs.writeFileSync(
    path.join(__dirname, '../public/optimized-meta-tags.json'),
    JSON.stringify(metaTags, null, 2)
  );
  console.log('✅ Meta tags optimizados generados');

  // Generar Schema.org avanzado
  const schema = generateAdvancedSchema();
  fs.writeFileSync(
    path.join(__dirname, '../public/advanced-schema.json'),
    JSON.stringify(schema, null, 2)
  );
  console.log('✅ Schema.org avanzado generado');

  // Generar sitemap optimizado
  const sitemap = generateOptimizedSitemap();
  fs.writeFileSync(
    path.join(__dirname, '../public/optimized-sitemap.xml'),
    sitemap
  );
  console.log('✅ Sitemap optimizado generado');

  // Generar robots.txt optimizado
  const robots = generateOptimizedRobots();
  fs.writeFileSync(
    path.join(__dirname, '../public/robots-optimized.txt'),
    robots
  );
  console.log('✅ Robots.txt optimizado generado');

  // Generar archivo de palabras clave
  const keywords = generateKeywordFile();
  fs.writeFileSync(
    path.join(__dirname, '../public/seo-keywords.json'),
    JSON.stringify(keywords, null, 2)
  );
  console.log('✅ Archivo de palabras clave generado');

  // Generar reporte de optimización
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: [
      'Meta tags optimizados para Villa Carlos Paz',
      'Schema.org estructurado avanzado',
      'Sitemap XML optimizado',
      'Robots.txt mejorado',
      'Palabras clave organizadas por intención',
      'Local SEO optimizado'
    ],
    nextSteps: [
      'Implementar meta tags en las páginas',
      'Añadir Schema.org al BaseLayout',
      'Actualizar robots.txt',
      'Enviar sitemap a Google Search Console',
      'Crear contenido basado en palabras clave',
      'Implementar breadcrumbs estructurados'
    ],
    metrics: {
      totalKeywords: seoConfig.primaryKeywords.length + seoConfig.secondaryKeywords.length + seoConfig.longTailKeywords.length,
      targetLocation: seoConfig.targetLocation,
      pagesOptimized: 6
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '../public/seo-optimization-report.json'),
    JSON.stringify(report, null, 2)
  );
  console.log('✅ Reporte de optimización generado');

  console.log('\n🎯 Optimización SEO completada exitosamente!');
  console.log(`📊 Total de palabras clave: ${report.metrics.totalKeywords}`);
  console.log(`📍 Ubicación objetivo: ${report.metrics.targetLocation}`);
  console.log(`📄 Páginas optimizadas: ${report.metrics.pagesOptimized}`);
  
  console.log('\n📋 Próximos pasos:');
  report.nextSteps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`);
  });

  return report;
}

// Ejecutar optimización si se llama directamente
if (require.main === module) {
  runSEOOptimization();
}

module.exports = {
  runSEOOptimization,
  generateOptimizedMetaTags,
  generateAdvancedSchema,
  generateOptimizedSitemap,
  generateOptimizedRobots,
  generateKeywordFile
}; 