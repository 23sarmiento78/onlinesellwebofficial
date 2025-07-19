import matter from 'gray-matter';

// Función para cargar artículos localmente en desarrollo
export async function getArticlesLocal() {
  try {
    // En desarrollo, intentar cargar desde la API local
    const response = await fetch('/.netlify/functions/get-ia-articles');
    
    if (response.ok) {
      const data = await response.json();
      return data.articles || [];
    }
    
    // Si la API no funciona, cargar desde archivos estáticos
    console.log('API no disponible, cargando artículos estáticos...');
    return getStaticArticles();
    
  } catch (error) {
    console.log('Error con API, cargando artículos estáticos:', error);
    return getStaticArticles();
  }
}

// Función para cargar artículos estáticos
function getStaticArticles() {
  // Lista de artículos conocidos (basada en los archivos que existen)
  const articles = [
    {
      title: "Automatización con Scripts: Aumenta tu Productividad",
      summary: "Descubre cómo la automatización con scripts puede transformar tu flujo de trabajo y aumentar significativamente tu productividad como desarrollador.",
      slug: "2025-07-19-automatizaci-n-con-scripts-aumenta-tu-productividad",
      date: "2025-07-19T10:00:00.000Z",
      author: "hgaruna",
      image: "/logos-he-imagenes/programacion.jpeg",
      tags: ["automatización", "productividad", "scripts", "desarrollo"],
      category: "Productividad"
    },
    {
      title: "Freelance vs Empresa: ¿Qué Camino Elegir?",
      summary: "Análisis completo de las ventajas y desventajas de trabajar como freelancer versus empleado en una empresa de tecnología.",
      slug: "2025-07-19-freelance-vs-empresa-qu-camino-elegir-",
      date: "2025-07-19T10:00:00.000Z",
      author: "hgaruna",
      image: "/logos-he-imagenes/programacion.jpeg",
      tags: ["freelance", "carrera", "empleo", "tecnología"],
      category: "Carrera"
    },
    {
      title: "GraphQL vs REST: La Batalla de las APIs",
      summary: "Comparación detallada entre GraphQL y REST, analizando cuándo usar cada uno y sus ventajas en diferentes escenarios.",
      slug: "2025-07-19-graphql-vs-rest-la-batalla-de-las-apis",
      date: "2025-07-19T10:00:00.000Z",
      author: "hgaruna",
      image: "/logos-he-imagenes/programacion.jpeg",
      tags: ["graphql", "rest", "api", "desarrollo"],
      category: "Desarrollo Web"
    },
    {
      title: "Nuevos Frameworks JavaScript: Una Guía Completa",
      summary: "Explora los frameworks JavaScript más prometedores y emergentes que están definiendo el futuro del desarrollo web.",
      slug: "2025-07-19-nuevos-frameworks-javascript-una-gu-a-completa",
      date: "2025-07-19T10:00:00.000Z",
      author: "hgaruna",
      image: "/logos-he-imagenes/programacion.jpeg",
      tags: ["javascript", "frameworks", "desarrollo web", "tendencias"],
      category: "Desarrollo Web"
    }
  ];

  // Ordenar por fecha (más reciente primero)
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Función para obtener un artículo específico
export async function getArticleLocal(slug) {
  try {
    // En desarrollo, intentar cargar desde la API local
    const response = await fetch(`/.netlify/functions/get-ia-article?slug=${slug}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.article;
    }
    
    // Si la API no funciona, cargar desde archivos estáticos
    console.log('API no disponible, cargando artículo estático...');
    return getStaticArticle(slug);
    
  } catch (error) {
    console.log('Error con API, cargando artículo estático:', error);
    return getStaticArticle(slug);
  }
}

// Función para cargar un artículo estático específico
function getStaticArticle(slug) {
  // Aquí podrías cargar el contenido real del archivo markdown
  // Por ahora, devolvemos un artículo de ejemplo
  const articles = getStaticArticles();
  const article = articles.find(a => a.slug === slug);
  
  if (article) {
    return {
      ...article,
      content: `# ${article.title}

${article.summary}

## Introducción

Este es un artículo generado por inteligencia artificial sobre ${article.category.toLowerCase()}.

## Contenido Principal

El contenido completo del artículo estaría aquí, incluyendo:

- Puntos importantes
- Ejemplos prácticos
- Mejores prácticas
- Conclusiones

## Conclusión

Este artículo proporciona información valiosa sobre ${article.tags.join(', ')}.

---

*Generado por inteligencia artificial - hgaruna*`
    };
  }
  
  return null;
} 