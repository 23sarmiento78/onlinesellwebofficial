// Utilidad para obtener artículos desde múltiples fuentes
// 1. Archivos Markdown locales (desarrollo)
// 2. API del CMS (producción)

export async function getArticles() {
  try {
    // En desarrollo, usar archivos Markdown locales
    if (process.env.NODE_ENV === "development") {
      return await getLocalArticles();
    }

    // En producción, intentar obtener del CMS
    return await getCMSArticles();
  } catch (error) {
    console.error("Error obteniendo artículos:", error);
    return [];
  }
}

// Función para obtener todos los artículos (alias de getArticles)
export async function getAllArticles() {
  return await getArticles();
}

async function getLocalArticles() {
  try {
    // Importar dinámicamente los archivos markdown
    const articlesContext = require.context(
      "../content/articles",
      false,
      /\.md$/,
    );
    const articles = [];

    for (const key of articlesContext.keys()) {
      try {
        const articlePath = key.replace("./", "");
        const response = await fetch(`/content/articles/${articlePath}`);
        if (!response.ok) continue;

        const content = await response.text();
        const matter = await import("gray-matter");
        const { data, content: markdownContent } = matter.default(content);

        // Generar slug desde el nombre del archivo o título
        const slug =
          articlePath.replace(".md", "").replace(/^\d{4}-\d{2}-\d{2}-/, "") ||
          data.title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const article = {
          _id: slug,
          slug,
          title: data.title,
          description:
            data.description || markdownContent.substring(0, 200) + "...",
          content: markdownContent,
          author: data.author || "hgaruna",
          date: data.date || new Date().toISOString(),
          createdAt: data.date || new Date().toISOString(),
          category: data.category || "Desarrollo Web",
          tags: data.tags || [],
          image: data.image || "/logos-he-imagenes/logo3.png",
        };

        articles.push(article);
      } catch (error) {
        console.error(`Error procesando artículo ${key}:`, error);
      }
    }

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error cargando artículos locales:", error);

    // Fallback: retornar artículos hardcodeados basados en los archivos existentes
    return [
      {
        _id: "desarrollo-web-villa-carlos-paz",
        slug: "desarrollo-web-villa-carlos-paz",
        title:
          "Desarrollo Web Profesional en Villa Carlos Paz: Potenciando Negocios Locales",
        description:
          "Descubre cómo el desarrollo web profesional está transformando los negocios en Villa Carlos Paz, Córdoba. Soluciones digitales a medida para empresas locales.",
        content:
          "Villa Carlos Paz, ubicada en el corazón de las Sierras de Córdoba, no solo es un destino turístico reconocido, sino que también se está convirtiendo en un centro de innovación digital...",
        author: "hgaruna",
        date: "2025-01-22",
        createdAt: "2025-01-22",
        category: "Desarrollo Web Local",
        tags: [
          "Villa Carlos Paz",
          "Desarrollo Web",
          "Marketing Digital",
          "Córdoba",
          "Negocios Locales",
          "SEO Local",
        ],
        image: "/logos-he-imagenes/programacion.jpeg",
      },
      {
        _id: "tendencias-diseno-ui-ux",
        slug: "tendencias-diseno-ui-ux",
        title:
          "Tendencias de Diseño UI/UX 2024: Lo que Todo Desarrollador Debe Saber",
        description:
          "Explora las últimas tendencias en diseño UI/UX que están definiendo la experiencia digital en 2024. Guía completa para desarrolladores y diseñadores.",
        content:
          "El diseño UI/UX continúa evolucionando rápidamente en 2024. Desde la integración de IA hasta nuevos paradigmas de interacción...",
        author: "hgaruna",
        date: "2024-03-10",
        createdAt: "2024-03-10",
        category: "Diseño Web",
        tags: ["UI/UX", "Diseño Web", "Tendencias", "2024"],
        image: "/logos-he-imagenes/logo3.png",
      },
      {
        _id: "react-optimizacion",
        slug: "react-optimizacion",
        title:
          "Optimización de Aplicaciones React: Mejores Prácticas y Técnicas Avanzadas",
        description:
          "Aprende las mejores técnicas para optimizar tus aplicaciones React y mejorar el rendimiento significativamente.",
        content:
          "React es una de las librerías más populares para el desarrollo frontend, pero optimizar aplicaciones React puede ser un desafío...",
        author: "hgaruna",
        date: "2024-03-12",
        createdAt: "2024-03-12",
        category: "Desarrollo Web",
        tags: ["React", "Optimización", "Performance", "JavaScript"],
        image: "/logos-he-imagenes/logo3.png",
      },
      {
        _id: "estrategias-seo-avanzadas",
        slug: "estrategias-seo-avanzadas",
        title:
          "10 Estrategias SEO Avanzadas para Posicionar tu Sitio Web en 2024",
        description:
          "Descubre las estrategias SEO más efectivas para mejorar el posicionamiento de tu sitio web y aumentar el tráfico orgánico.",
        content:
          "El SEO sigue siendo fundamental para el éxito digital. En 2024, las estrategias se han vuelto más sofisticadas...",
        author: "hgaruna",
        date: "2024-03-15",
        createdAt: "2024-03-15",
        category: "Marketing Digital",
        tags: ["SEO", "Marketing Digital", "Posicionamiento Web", "Google"],
        image: "/logos-he-imagenes/logo3.png",
      },
      {
        _id: "futuro-inteligencia-artificial-desarrollo-web",
        slug: "futuro-inteligencia-artificial-desarrollo-web",
        title: "El Futuro de la Inteligencia Artificial en el Desarrollo Web",
        description:
          "Explora cómo la inteligencia artificial está revolucionando el desarrollo web y qué podemos esperar en los próximos años.",
        content:
          "La inteligencia artificial está transformando la industria del desarrollo web de maneras que apenas estamos comenzando a comprender...",
        author: "hgaruna",
        date: "2025-06-13",
        createdAt: "2025-06-13",
        category: "Tecnología",
        tags: [
          "IA",
          "Inteligencia Artificial",
          "Desarrollo Web",
          "Futuro",
          "Tecnología",
        ],
        image: "/logos-he-imagenes/logo3.png",
      },
    ];
  }
}

async function getCMSArticles() {
  try {
    // Obtener artículos desde tu API del CMS (Netlify Functions)
    const response = await fetch("/.netlify/functions/get-articles");
    if (!response.ok) {
      throw new Error("Error al obtener artículos del CMS");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : data.articles || [];
  } catch (error) {
    console.error("Error obteniendo artículos del CMS:", error);
    return [];
  }
}

export async function getArticleBySlug(slug) {
  try {
    const articles = await getArticles();
    return articles.find(
      (article) =>
        article.slug === slug ||
        article._id === slug ||
        article.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug,
    );
  } catch (error) {
    console.error("Error obteniendo artículo por slug:", error);
    return null;
  }
}

export async function getArticlesByCategory(category) {
  const articles = await getArticles();
  return articles.filter((article) => article.category === category);
}
