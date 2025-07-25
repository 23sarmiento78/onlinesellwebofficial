#!/usr/bin/env node

/**
 * Script para enviar sitemap a múltiples motores de búsqueda
 * Mejora el SEO del sitio enviando el sitemap a Google, Bing y otros motores
 */

const https = require('https');
const http = require('http');

const SITEMAP_URL = 'https://hgaruna.org/sitemap.xml';
const SITE_URL = 'https://hgaruna.org/';

// URLs de envío de sitemap
const SUBMISSION_URLS = {
  google: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  bing: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  yandex: `https://public/blogs.yandex.com/pings/?status=success&url=${encodeURIComponent(SITEMAP_URL)}`,
  duckduckgo: `https://duckduckgo.com/?q=site:${encodeURIComponent(SITE_URL)}`
};

// Función para hacer petición HTTP
function makeRequest(url, engine) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ ${engine}: Sitemap enviado exitosamente (${res.statusCode})`);
        resolve({ engine, status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${engine}: Error al enviar sitemap - ${error.message}`);
      reject({ engine, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`⏰ ${engine}: Timeout al enviar sitemap`);
      reject({ engine, error: 'Timeout' });
    });
  });
}

// Función principal
async function submitSitemap() {
  console.log('🚀 Iniciando envío de sitemap a motores de búsqueda...');
  console.log(`📍 Sitemap URL: ${SITEMAP_URL}`);
  console.log('---');
  
  const results = [];
  
  // Enviar a todos los motores de búsqueda
  for (const [engine, url] of Object.entries(SUBMISSION_URLS)) {
    try {
      const result = await makeRequest(url, engine);
      results.push(result);
      
      // Esperar un poco entre envíos para no sobrecargar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      results.push(error);
    }
  }
  
  // Resumen de resultados
  console.log('---');
  console.log('📊 Resumen de envío de sitemap:');
  
  const successful = results.filter(r => !r.error).length;
  const failed = results.filter(r => r.error).length;
  
  console.log(`✅ Exitosos: ${successful}`);
  console.log(`❌ Fallidos: ${failed}`);
  
  if (successful > 0) {
    console.log('🎉 Sitemap enviado exitosamente a los motores de búsqueda');
    console.log('📈 Esto mejorará la indexación y SEO del sitio');
  }
  
  // Información adicional
  console.log('---');
  console.log('💡 Consejos adicionales para SEO:');
  console.log('• Verifica que el sitemap esté actualizado');
  console.log('• Revisa Google Search Console para ver la indexación');
  console.log('• Optimiza las palabras clave en cada página');
  console.log('• Mantén contenido fresco y relevante');
  
  return results;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  submitSitemap()
    .then(() => {
      console.log('✅ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = { submitSitemap, SUBMISSION_URLS }; 