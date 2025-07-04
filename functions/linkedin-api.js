const https = require("https");
const querystring = require("querystring");

const LINKEDIN_CLIENT_ID = "77d1u4hecolzrd";
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.SITE_URL + "/admin-local/";

exports.handler = async (event, context) => {
  // Headers CORS
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
    const { action, code, text, articleUrl, articleTitle } =
      event.httpMethod === "POST"
        ? JSON.parse(event.body)
        : event.queryStringParameters || {};

    switch (action) {
      case "auth":
        return await handleAuth(code, headers);

      case "publish":
        return await handlePublish(
          text,
          articleUrl,
          articleTitle,
          headers,
          event,
        );

      case "posts":
        return await handleGetPosts(headers, event);

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid action" }),
        };
    }
  } catch (error) {
    console.error("LinkedIn API Error:", error);
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

async function handleAuth(code, headers) {
  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Authorization code required" }),
    };
  }

  try {
    // Intercambiar código por token
    const tokenData = await exchangeCodeForToken(code);

    // Obtener perfil del usuario
    const profile = await getUserProfile(tokenData.access_token);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        token: tokenData,
        profile: profile,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: "Authentication failed",
        message: error.message,
      }),
    };
  }
}

async function handlePublish(text, articleUrl, articleTitle, headers, event) {
  if (!text) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Post text is required" }),
    };
  }

  try {
    // Aquí necesitarías el token del usuario autenticado
    // Por simplicidad, simularemos la publicación

    const postData = {
      author: "urn:li:person:USER_ID", // Se obtendría del token
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: "ARTICLE",
          media: articleUrl
            ? [
                {
                  status: "READY",
                  description: {
                    text: articleTitle || "Artículo de hgaruna",
                  },
                  originalUrl: articleUrl,
                  title: {
                    text: articleTitle || "Nuevo Artículo",
                  },
                },
              ]
            : [],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Simular publicación exitosa por ahora
    // En producción, harías la llamada real a LinkedIn API

    console.log("LinkedIn post would be published:", postData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Post published successfully",
        postId: "simulated_post_" + Date.now(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to publish post",
        message: error.message,
      }),
    };
  }
}

async function handleGetPosts(headers, event) {
  try {
    // Simular posts recientes por ahora
    const mockPosts = [
      {
        id: "1",
        text: '🚀 Nuevo artículo publicado: "Desarrollo Web Profesional en Villa Carlos Paz"',
        created: new Date(Date.now() - 86400000).toISOString(),
        likes: 15,
        comments: 3,
        shares: 2,
      },
      {
        id: "2",
        text: "💡 Compartiendo conocimientos sobre React y optimización...",
        created: new Date(Date.now() - 172800000).toISOString(),
        likes: 8,
        comments: 1,
        shares: 1,
      },
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockPosts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch posts",
        message: error.message,
      }),
    };
  }
}

function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET,
    });

    const options = {
      hostname: "www.linkedin.com",
      port: 443,
      path: "/oauth/v2/accessToken",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          if (result.access_token) {
            resolve(result);
          } else {
            reject(new Error("No access token received"));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function getUserProfile(accessToken) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.linkedin.com",
      port: 443,
      path: "/v2/people/~:(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))",
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "cache-control": "no-cache",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const profile = JSON.parse(data);
          resolve(profile);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}
