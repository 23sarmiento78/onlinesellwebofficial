const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  // Verificar método HTTP
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Verificar autenticación (básica)
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    // Parsear datos del artículo
    const { filename, content } = JSON.parse(event.body);

    if (!filename || !content) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Filename and content are required" }),
      };
    }

    // Ruta donde guardar el archivo
    const articlesDir = path.join(process.cwd(), "src", "content", "articles");
    const filePath = path.join(articlesDir, filename);

    // Crear directorio si no existe
    if (!fs.existsSync(articlesDir)) {
      fs.mkdirSync(articlesDir, { recursive: true });
    }

    // Guardar el archivo
    fs.writeFileSync(filePath, content, "utf8");

    // También guardar en public para acceso directo
    const publicDir = path.join(process.cwd(), "public", "content", "articles");
    const publicFilePath = path.join(publicDir, filename);

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(publicFilePath, content, "utf8");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({
        success: true,
        message: "Article saved successfully",
        filename: filename,
        paths: {
          source: filePath,
          public: publicFilePath,
        },
      }),
    };
  } catch (error) {
    console.error("Error saving article:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
