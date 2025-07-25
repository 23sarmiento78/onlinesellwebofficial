const snoowrap = require('snoowrap');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// --- CONFIGURACIÓN ---
// Asegúrate de que estos valores coincidan con los de tu app en Reddit.
// Es recomendable usar variables de entorno para esto (process.env.REDDIT_CLIENT_ID).
//const REDDIT_CLIENT_ID = //'fFFB-IL4_lhJAAUorYGcgg';
//const REDDIT_CLIENT_SECRET = //'zQbNvzF1ImyzpCxcb8-PLsbJ3AQaxA';
//const REDIRECT_URI = 'https://www.hgaruna.org/';

// Un user-agent único y descriptivo es requerido por la API de Reddit.
// Formato: <platform>:<app ID>:<version string> (by /u/<reddit username>)
//const USER_AGENT = 'Node.js:hgaruna.org_token_getter:v1.0 (by /u/Israelsarmiento5)'; // <-- Cambia tu username si es diferente

async function getRefreshToken() {
  // 1. Generar la URL de autorización
  const authenticationUrl = snoowrap.getAuthUrl({
    clientId: REDDIT_CLIENT_ID,
    scope: ['identity', 'submit'], // 'submit' para publicar, 'identity' para verificar
    redirectUri: REDIRECT_URI,
    permanent: true, // MUY IMPORTANTE para obtener un refresh_token
    state: 'cualquier-string-aleatorio' // Buena práctica para seguridad
  });

  console.log('1. Abre esta URL en tu navegador y autoriza la aplicación:\n');
  console.log(authenticationUrl);
  Sconsole.log('\n2. Después de autorizar, serás redirigido a una página. Copia la URL completa de esa página.');

  // 2. Pedir al usuario la URL de redirección
  readline.question('\n3. Pega aquí la URL completa a la que fuiste redirigido: ', async (redirectedUrl) => {
    let code;
    try {
      const urlParams = new URL(redirectedUrl).searchParams;
      code = urlParams.get('code');
    } catch (error) {
        console.error('\n❌ URL inválida. Asegúrate de pegar la URL completa, incluyendo "https://".');
        readline.close();
        return;
    }

    if (!code) {
      console.error('\n❌ No se pudo encontrar el código de autorización en la URL. Asegúrate de copiar la URL completa.');
      readline.close();
      return;
    }

    console.log('\n🔄 Obteniendo Refresh Token...');

    // 3. Intercambiar el código de autorización por un refresh token
    try {
      // **CORRECCIÓN CLAVE:** Se usa `snoowrap.fromAuthCode` para este paso.
      // Este método está diseñado específicamente para intercambiar el código temporal.
      const r = await snoowrap.fromAuthCode({
        code: code,
        userAgent: USER_AGENT,
        clientId: REDDIT_CLIENT_ID,
        clientSecret: REDDIT_CLIENT_SECRET,
        redirectUri: REDIRECT_URI
      });

      const refreshToken = r.refreshToken;

      console.log('\n✅ ¡ÉXITO! Tu REDDIT_REFRESH_TOKEN es:\n');
      console.log(refreshToken);
      console.log('\nGuarda este token como un secreto en tu repositorio de GitHub con el nombre `REDDIT_REFRESH_TOKEN`.');

    } catch (error) {
      console.error('\n❌ Error al obtener el Refresh Token:', error.message);
    } finally {
      readline.close();
    }
  });
}

getRefreshToken();

