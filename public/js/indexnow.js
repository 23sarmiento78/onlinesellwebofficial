const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * Función para enviar URLs a la API de IndexNow.
 * @param {string} host - Tu dominio (ej. "www.tudominio.com").
 * @param {string} key - Tu clave de API de IndexNow (obtenida de Bing Webmaster Tools).
 * @param {string[]} urlList - Un array de URLs a enviar.
 */
async function submitUrlsToIndexNow(host, key, urlList) {
    const data = {
        host: host,
        key: key,
        urlList: urlList
    };

    try {
        const response = await fetch(INDEXNOW_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('IndexNow submission successful:', response.status, response.statusText);
            // Puedes añadir lógica adicional aquí si necesitas manejar una respuesta exitosa
        } else {
            const errorData = await response.json();
            console.error(`IndexNow submission failed: ${response.status} ${response.statusText}`, errorData);
            // Manejo de errores basado en la respuesta de la API
        }
    } catch (error) {
        console.error('Error submitting to IndexNow:', error);
    }
}

// EJEMPLO DE CÓMO LLAMAR LA FUNCIÓN (DESCOMENTA Y AJUSTA SEGÚN NECESIDAD)
// Reemplaza con tu host real y tu clave API.
// const myHost = "tu-dominio.com"; // EJ: "miempresa.com"
// const myKey = "TU_CLAVE_API_DE_BING"; // EJ: "ce560d17b50341ff9b02fecaa3ee72fd"
// const urlsToSubmit = [
//     "https://tu-dominio.com/nueva-pagina",
//     "https://tu-dominio.com/articulo-actualizado",
//     "https://tu-dominio.com/sitemap.xml" // Puedes enviar la URL de tu sitemap
// ];

// Para evitar ejecutar esto en cada carga de página, asegúrate de llamarlo solo cuando sea necesario,
// por ejemplo, al publicar o actualizar contenido, o a través de una función de Netlify.
// submitUrlsToIndexNow(myHost, myKey, urlsToSubmit);
