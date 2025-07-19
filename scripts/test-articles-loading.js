// scripts/test-articles-loading.js
// Script para probar la carga de artículos

const { getArticlesLocal, getArticleLocal } = require('../src/utils/getArticlesLocal');

async function testArticlesLoading() {
  try {
    console.log('🧪 Probando carga de artículos...\n');
    
    // Probar carga de todos los artículos
    console.log('1. Probando getArticlesLocal()...');
    const articles = await getArticlesLocal();
    
    console.log(`✅ Artículos cargados: ${articles.length}`);
    
    if (articles.length > 0) {
      console.log('\n📝 Artículos encontrados:');
      articles.forEach((article, index) => {
        console.log(`  ${index + 1}. ${article.title}`);
        console.log(`     Categoría: ${article.category}`);
        console.log(`     Slug: ${article.slug}`);
        console.log(`     Tags: ${article.tags?.join(', ')}`);
        console.log('');
      });
      
      // Probar carga de artículo específico
      const firstArticle = articles[0];
      console.log(`2. Probando getArticleLocal("${firstArticle.slug}")...`);
      
      const singleArticle = await getArticleLocal(firstArticle.slug);
      
      if (singleArticle) {
        console.log(`✅ Artículo cargado: ${singleArticle.title}`);
        console.log(`   Contenido: ${singleArticle.content?.substring(0, 100)}...`);
      } else {
        console.log('❌ No se pudo cargar el artículo específico');
      }
      
    } else {
      console.log('❌ No se encontraron artículos');
    }
    
    console.log('\n✅ Prueba completada');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  testArticlesLoading();
}

module.exports = { testArticlesLoading }; 