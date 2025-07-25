const snoowrap = require('snoowrap');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Reemplaza con tus valores:
const REDDIT_CLIENT_ID = 'TU_CLIENT_ID';
const REDDIT_CLIENT_SECRET = 'TU_CLIENT_SECRET';
const REDIRECT_URI = 'https://www.hgaruna.org/'; // Debe coincidir con el que configuraste en Reddit

async function getRefreshToken() {
  const authenticationUrl = snoowrap.get = snoowrap.get=snoowrap.get=snoowrap.getAuthUrl({
    clientId: REDDIT_CLIENT_ID,
    scope: ['identity', 'submit'], // 'submit' para publicar, 'identity' para verificar usuario
    redirectUri: REDIRECT_URI,
    permanent: true // Muy importante para obtener un refresh_token
  });

  console.log('1. Abre esta URL en tu navegador y autoriza la aplicación:');
  console.log(authenticationUrl);
  console.log('\n2. Después de autorizar, serás redirigido a una página. Copia la URL completa de esa página.');

  readline.question('3. Pega aquí la URL completa a la que fuiste redirigido: ', async (redirectedUrl) => {
    const urlParams = new URLSearchParams(new URL(redirectedUrl).search);
    const code = urlParams.get('code');

    if (!code) {
      console.error('No se pudo encontrar el código de autorización en la URL.');
      readline.close();
      return;
    }

    console.log('\nObteniendo Refresh Token...');
    try {
      const r = new snoowrap({
        userAgent: 'https://www.reddit.com/user/Israelsarmiento5/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button', // Cambia a tu usuario de Reddit
        clientId: REDDIT_CLIENT_ID,
        clientSecret: REDDIT_CLIENT_SECRET,
        redirectUri: REDIRECT_URI,
        code: code
      });

      const { refreshToken } = await r.getMe(); // Esto es lo que devuelve el refresh token
      console.log('\n¡ÉXITO! Tu REDDIT_REFRESH_TOKEN es:');
      console.log(refreshToken);
      console.log('\nGuarda este token como secreto en GitHub.');
    } catch (error) {
      console.error('Error al obtener el Refresh Token:', error.message);
    } finally {
      readline.close();
    }
  });
}

getRefreshToken();