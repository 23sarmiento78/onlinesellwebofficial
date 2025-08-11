const https = require('https');
const querystring = require('querystring');

// Configuración - Usar variables de entorno
const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || 'TU_CLIENT_ID_AQUI';
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || 'TU_CLIENT_SECRET_AQUI';
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI || 'https://tu-dominio.netlify.app/.netlify/functions/linkedin-callback';

// Función para intercambiar código por token
function exchangeCodeForToken(authorizationCode) {
  const postData = querystring.stringify({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI
  });

  const options = {
    hostname: 'www.linkedin.com',
    port: 443,
    path: '/oauth/v2/accessToken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Token generado exitosamente:');
        console.log('Access Token:', response.access_token);
        console.log('Expires In:', response.expires_in);
        console.log('\n📝 Copia este token a Netlify como LINKEDIN_ACCESS_TOKEN');
      } catch (error) {
        console.error('❌ Error al procesar la respuesta:', error);
        console.log('Respuesta del servidor:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error en la solicitud:', error);
  });

  req.write(postData);
  req.end();
}

// Instrucciones
console.log('🔗 Generador de Token de LinkedIn');
console.log('=====================================\n');

console.log('📋 Pasos para obtener el token:');
console.log('1. Configura las variables de entorno LINKEDIN_CLIENT_ID y LINKEDIN_CLIENT_SECRET');
console.log('2. Construye la URL de autorización:');
console.log(`   https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email%20w_member_social`);
console.log('3. Abre esa URL en tu navegador y autoriza la aplicación');
console.log('4. Copia el código de autorización de la URL de callback');
console.log('5. Ejecuta: node scripts/generate-linkedin-token.js CODIGO_DE_AUTORIZACION\n');

// Si se proporciona un código de autorización como argumento
if (process.argv[2]) {
  const authCode = process.argv[2];
  console.log('🔄 Intercambiando código por token...');
  exchangeCodeForToken(authCode);
} else {
  console.log('💡 Ejemplo de uso:');
  console.log('   node scripts/generate-linkedin-token.js AQTF123abc456def789');
}