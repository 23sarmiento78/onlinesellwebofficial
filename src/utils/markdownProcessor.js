// Utilidad para procesar archivos markdown del servidor
export async function processMarkdownFromServer() {
  try {
    const articles = [];

    // Listas de archivos markdown conocidos en ambas carpetas
    const markdownFilesArticles = [
      "2025-01-22-desarrollo-web-villa-carlos-paz.md",
      "2024-03-10-tendencias-diseno-ui-ux.md",
      "2024-03-12-react-optimizacion.md",
      "2024-03-15-10-estrategias-seo-avanzadas.md",
      "2025-06-13-el-futuro-de-la-inteligencia-artificial-en-el-desarrollo-web.md",
    ];
    // Detectar archivos en articulos (IA)
    let markdownFilesArticulos = [];
    try {
      // Si tienes una forma de listar archivos dinámicamente, reemplaza esto
      markdownFilesArticulos = [];
    } catch (e) {}

    // Procesar ambas carpetas
    const sources = [
      { files: markdownFilesArticles, url: "/content/articles/" },
      { files: markdownFilesArticulos, url: "/content/articulos/" },
    ];

    for (const { files, url } of sources) {
      for (const filename of files) {
        try {
          const response = await fetch(`${url}${filename}`);
          if (!response.ok) continue;

          const content = await response.text();

          // Procesar frontmatter manualmente (sin gray-matter en el cliente)
          const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
          const match = content.match(frontmatterRegex);

          if (!match) continue;

          const frontmatterText = match[1];
          const markdownContent = match[2];

          // Parsear frontmatter YAML básico
          const data = {};
          frontmatterText.split("\n").forEach((line) => {
            const colonIndex = line.indexOf(":");
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              let value = line.substring(colonIndex + 1).trim();

              // Remover comillas
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }

              // Procesar arrays (tags)
              if (value.startsWith("[") && value.endsWith("]")) {
                value = value
                  .slice(1, -1)
                  .split(",")
                  .map((item) => item.trim().replace(/"/g, ""));
              }

              data[key] = value;
            }
          });

          // Generar slug desde el nombre del archivo
          const slug = filename
            .replace(".md", "")
            .replace(/^\d{4}-\d{2}-\d{2}-/, "");

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
            tags: Array.isArray(data.tags) ? data.tags : [],
            image: data.image || "/logos-he-imagenes/logo3.png",
          };

          articles.push(article);
        } catch (error) {
          console.error(`Error procesando ${filename}:`, error);
        }
      }
    }

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error procesando archivos markdown:", error);
    return [];
  }
}

// Función para obtener un artículo específico por slug
export async function getMarkdownArticleBySlug(slug) {
  const articles = await processMarkdownFromServer();
  return articles.find(
    (article) => article.slug === slug || article._id === slug,
  );
}
