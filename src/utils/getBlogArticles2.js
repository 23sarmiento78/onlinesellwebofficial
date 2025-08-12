import { parseHTML } from './htmlParser';

export async function getBlogArticles() {
  try {
    console.log('Iniciando carga de artículos...');
    
    // Intentar cargar el índice
    const indexResponse = await fetch(process.env.PUBLIC_URL + '/blog/index.json');
    if (!indexResponse.ok) {
      console.error('Error cargando index.json:', indexResponse.status);
      throw new Error('No se pudo cargar el índice de artículos');
    }
    
    // Parsear el índice
    const articleFiles = await indexResponse.json();
    console.log('Archivos encontrados:', articleFiles);
    
    // Cargar cada artículo
    const articles = await Promise.all(
      articleFiles.map(async (filename, index) => {
        try {
          console.log(`Cargando artículo ${filename}...`);
          
          // Cargar el contenido del artículo
          const articleResponse = await fetch(process.env.PUBLIC_URL + `/blog/${filename}`);
          if (!articleResponse.ok) {
            console.error(`Error cargando ${filename}:`, articleResponse.status);
            return null;
          }
          
          // Obtener el contenido HTML
          const html = await articleResponse.text();
          
          // Extraer metadatos
          const metadata = parseHTML(html, filename);
          
          // Crear objeto del artículo
          return {
            id: index + 1,
            ...metadata,
            filename,
            url: process.env.PUBLIC_URL + `/blog/${filename}`
          };
          
        } catch (error) {
          console.error(`Error procesando ${filename}:`, error);
          return null;
        }
      })
    );
    
    // Filtrar artículos nulos y ordenar por fecha
    const validArticles = articles
      .filter(article => article !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
      
    console.log(`Artículos cargados exitosamente: ${validArticles.length}`);
    return validArticles;
    
  } catch (error) {
    console.error('Error en getBlogArticles:', error);
    throw error;
  }
}
