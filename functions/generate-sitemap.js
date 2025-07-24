const fs = require("fs");
const path = require("path");


class ServerSitemapGenerator {
  constructor(siteUrl = "https://service.hgaruna.org") {
    this.siteUrl = siteUrl;
    this.staticPages = [
      { url: "/", priority: 1.0, changefreq: "weekly" },
      { url: "/planes/", priority: 0.9, changefreq: "monthly" },
      { url: "/blog/", priority: 0.8, changefreq: "daily" },
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
      const articles = await this.getArticlesFromFiles();
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

  async getArticlesFromFiles() {
    try {
      const indexPath = path.join(process.cwd(), "public", "blog", "index.json");
      if (!fs.existsSync(indexPath)) {
        console.error("No se encontró public/blog/index.json");
        return [];
      }
      const data = fs.readFileSync(indexPath, "utf8");
      const articles = JSON.parse(data);
      return articles;
    } catch (error) {
      console.error("Error leyendo index.json:", error);
      return [];
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
Allow: /blog/
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

  escapeXML(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Verificar autenticación para POST
    if (event.httpMethod === "POST") {
      const authHeader = event.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }
    }

    const { action } = event.queryStringParameters || {};
    const generator = new ServerSitemapGenerator();

    switch (action) {
      case "robots":
        const robotsContent = await generator.generateRobotsTxt();

        // Escribir robots.txt
        const robotsPath = path.join(process.cwd(), "public", "robots.txt");
        fs.writeFileSync(robotsPath, robotsContent, "utf8");

        return {
          statusCode: 200,
          headers: { ...headers, "Content-Type": "text/plain" },
          body: robotsContent,
        };

      case "sitemap":
      default:
        const sitemapContent = await generator.generateSitemap();

        // Escribir sitemap.xml
        const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
        fs.writeFileSync(sitemapPath, sitemapContent, "utf8");

        if (event.httpMethod === "GET") {
          return {
            statusCode: 200,
            headers: { ...headers, "Content-Type": "application/xml" },
            body: sitemapContent,
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: "Sitemap generated successfully",
            timestamp: new Date().toISOString(),
            url: `${generator.siteUrl}/sitemap.xml`,
          }),
        };
    }
  } catch (error) {
    console.error("Error in sitemap generation:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
