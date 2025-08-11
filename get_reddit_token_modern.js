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
  const scope = 'identity submit'; // 'submit' para publicar, 'identity' para verificar
  const state = 'cualquier-string-aleatorio'; // Buena práctica para seguridad
  const duration = 'permanent'; // MUY IMPORTANTE para obtener un refresh_token
  
  const authenticationUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&duration=${duration}&scope=${encodeURIComponent(scope)}`;

  console.log('1. Abre esta URL en tu navegador y autoriza la aplicación:\n');
  console.log(authenticationUrl);
  console.log('\n2. Después de autorizar, serás redirigido a una página. Copia la URL completa de esa página.');

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

    // 3. Intercambiar el código de autorización por un refresh token usando la API oficial
    try {
      const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': USER_AGENT
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Error en la respuesta de Reddit: ${tokenResponse.status} - ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.refresh_token) {
        throw new Error('No se recibió refresh_token en la respuesta');
      }

      console.log('\n✅ ¡ÉXITO! Tu REDDIT_REFRESH_TOKEN es:\n');
      console.log(tokenData.refresh_token);
      console.log('\nGuarda este token como un secreto en tu repositorio de GitHub con el nombre `REDDIT_REFRESH_TOKEN`.');
      
      // También mostrar el access_token por si lo necesitas
      console.log('\nTu REDDIT_ACCESS_TOKEN es:\n');
      console.log(tokenData.access_token);
      console.log('\nEste token expira en', tokenData.expires_in, 'segundos.');

    } catch (error) {
      console.error('\n❌ Error al obtener el Refresh Token:', error.message);
    } finally {
      readline.close();
    }
  });
}

getRefreshToken();
