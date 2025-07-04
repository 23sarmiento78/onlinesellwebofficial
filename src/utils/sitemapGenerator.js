// Utilidad para generar sitemap automático con SEO avanzado
import { getAllArticles } from "./getArticles";

export class SitemapGenerator {
  constructor(siteUrl = "https://service.hgaruna.org") {
    this.siteUrl = siteUrl;
    this.staticPages = [
      { url: "/", priority: 1.0, changefreq: "weekly" },
      { url: "/planes/", priority: 0.9, changefreq: "monthly" },
      { url: "/foro/", priority: 0.8, changefreq: "daily" },
      { url: "/contacto/", priority: 0.7, changefreq: "monthly" },
      { url: "/legal/", priority: 0.3, changefreq: "yearly" },
      {
        url: "/desarrollo-web-villa-carlos-paz/",
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        url: "/diseño-web-villa-carlos-paz/",
        priority: 0.8,
        changefreq: "monthly",
      },
      {
        url: "/marketing-digital-villa-carlos-paz/",
        priority: 0.8,
        changefreq: "monthly",
      },
    ];
  }

  async generateSitemap() {
    try {
      const articles = await getAllArticles();
      const allUrls = [...this.staticPages];

      // Agregar páginas de artículos
      articles.forEach((article) => {
        allUrls.push({
          url: `/articulos/${article.slug || article._id}`,
          priority: 0.6,
          changefreq: "weekly",
          lastmod: new Date(article.date || article.createdAt).toISOString(),
        });
      });

      // Agregar página de listado de artículos
      allUrls.push({
        url: "/articulos/",
        priority: 0.7,
        changefreq: "daily",
      });

      return this.generateSitemapXML(allUrls);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      return this.generateBasicSitemap();
    }
  }

  generateSitemapXML(urls) {
    const now = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    urls.forEach((page) => {
      sitemap += `  <url>
    <loc>${this.siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod || now}</lastmod>
    <changefreq>${page.changefreq || "monthly"}</changefreq>
    <priority>${page.priority || 0.5}</priority>
  </url>
`;
    });

    sitemap += "</urlset>";
    return sitemap;
  }

  generateBasicSitemap() {
    return this.generateSitemapXML(this.staticPages);
  }

  async generateRobotsTxt() {
    const robotsContent = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${this.siteUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /admin-local/
Disallow: /.netlify/

# Allow important pages
Allow: /articulos/
Allow: /foro/
Allow: /planes/

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific rules for different bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Block AI training bots (optional)
User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /
`;

    return robotsContent;
  }

  async generateSitemapIndex() {
    const now = new Date().toISOString();

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${this.siteUrl}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${this.siteUrl}/sitemap-articles.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

    return sitemapIndex;
  }

  async generateArticlesSitemap() {
    try {
      const articles = await getAllArticles();
      const now = new Date().toISOString();

      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

      articles.forEach((article) => {
        const articleDate = new Date(article.date || article.createdAt);
        const isRecent =
          Date.now() - articleDate.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 días

        sitemap += `  <url>
    <loc>${this.siteUrl}/articulos/${article.slug || article._id}</loc>
    <lastmod>${articleDate.toISOString()}</lastmod>
    <changefreq>${isRecent ? "daily" : "weekly"}</changefreq>
    <priority>${isRecent ? "0.8" : "0.6"}</priority>`;

        // Agregar información de imagen si existe
        if (article.image) {
          sitemap += `
    <image:image>
      <image:loc>${this.siteUrl}${article.image}</image:loc>
      <image:title>${this.escapeXML(article.title)}</image:title>
      <image:caption>${this.escapeXML(article.description || "")}</image:caption>
    </image:image>`;
        }

        // Agregar información de noticias para artículos recientes
        if (isRecent) {
          sitemap += `
    <news:news>
      <news:publication>
        <news:name>hgaruna</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${articleDate.toISOString()}</news:publication_date>
      <news:title>${this.escapeXML(article.title)}</news:title>
      <news:keywords>${article.tags ? article.tags.join(", ") : "desarrollo web, villa carlos paz"}</news:keywords>
    </news:news>`;
        }

        sitemap += `
  </url>
`;
      });

      sitemap += "</urlset>";
      return sitemap;
    } catch (error) {
      console.error("Error generating articles sitemap:", error);
      return this.generateBasicSitemap();
    }
  }

  escapeXML(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  // Método para generar JSON-LD estructurado
  generateStructuredData(article) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: article.image
        ? `${this.siteUrl}${article.image}`
        : `${this.siteUrl}/logos-he-imagenes/logo3.png`,
      author: {
        "@type": "Organization",
        name: article.author || "hgaruna",
        url: this.siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${this.siteUrl}/logos-he-imagenes/logo3.png`,
        },
      },
      publisher: {
        "@type": "Organization",
        name: "hgaruna",
        logo: {
          "@type": "ImageObject",
          url: `${this.siteUrl}/logos-he-imagenes/logo3.png`,
        },
      },
      datePublished: article.date || article.createdAt,
      dateModified: article.date || article.createdAt,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${this.siteUrl}/articulos/${article.slug || article._id}`,
      },
      keywords: article.tags
        ? article.tags.join(", ")
        : "desarrollo web, villa carlos paz, programación",
      articleSection: article.category || "Desarrollo Web",
      inLanguage: "es-ES",
      isPartOf: {
        "@type": "WebSite",
        name: "hgaruna",
        url: this.siteUrl,
      },
    };

    return JSON.stringify(structuredData, null, 2);
  }

  // Generar meta tags completos para SEO
  generateMetaTags(article) {
    const title = `${article.title} | Desarrollo Web Villa Carlos Paz | hgaruna`;
    const description =
      article.description ||
      `${article.title} - Artículo sobre desarrollo web, programación y tecnología en Villa Carlos Paz, Córdoba.`;
    const keywords = article.tags
      ? [
          ...article.tags,
          "desarrollo web villa carlos paz",
          "programador web villa carlos paz",
          "hgaruna",
        ].join(", ")
      : "desarrollo web villa carlos paz, programador web villa carlos paz, diseño web córdoba, hgaruna";
    const url = `${this.siteUrl}/articulos/${article.slug || article._id}`;
    const image = article.image
      ? `${this.siteUrl}${article.image}`
      : `${this.siteUrl}/logos-he-imagenes/logo3.png`;

    return {
      // Meta tags básicos
      title,
      description,
      keywords,

      // Open Graph
      "og:title": title,
      "og:description": description,
      "og:image": image,
      "og:url": url,
      "og:type": "article",
      "og:site_name": "hgaruna",
      "og:locale": "es_ES",

      // Twitter Cards
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image,
      "twitter:site": "@hgaruna",
      "twitter:creator": "@hgaruna",

      // Article específico
      "article:author": article.author || "hgaruna",
      "article:published_time": article.date || article.createdAt,
      "article:modified_time": article.date || article.createdAt,
      "article:section": article.category || "Desarrollo Web",
      "article:tag": article.tags ? article.tags.join(",") : "",

      // Adicionales para SEO
      robots:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      canonical: url,
      language: "es",
      "geo.region": "AR-X",
      "geo.placename": "Villa Carlos Paz",
      "geo.position": "-31.4165;-64.4961",
    };
  }
}

// Instancia singleton
export const sitemapGenerator = new SitemapGenerator();
