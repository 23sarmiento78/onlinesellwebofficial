export function parseHTML(html, filename) {
  try {
    // Crear un parser temporal
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extraer título
    const h1 = doc.querySelector('h1');
    const title = h1 
      ? h1.textContent 
      : doc.title || filename.replace('.html', '').replace(/-/g, ' ');

    // Extraer descripción
    const metaDesc = doc.querySelector('meta[name="description"]');
    const firstP = doc.querySelector('main p, article p');
    const description = metaDesc 
      ? metaDesc.getAttribute('content')
      : firstP 
        ? firstP.textContent
        : 'Artículo sobre desarrollo y programación';

    // Extraer categoría
    const metaCat = doc.querySelector('meta[name="category"]');
    const articleCat = doc.querySelector('article[data-category]');
    const badgeCat = doc.querySelector('.badge');
    let category = (
      metaCat?.getAttribute('content') ||
      articleCat?.getAttribute('data-category') ||
      badgeCat?.textContent ||
      'Programación'
    ).trim();

    // Mapear categorías
    const categoryMap = {
      'Frontend': 'Frontend',
      'Backend': 'Backend',
      'DevOps': 'DevOps',
      'JavaScript': 'JavaScript',
      'React': 'React',
      'Python': 'Python',
      'Node.js': 'Backend',
      'Database': 'Backend',
      'Security': 'DevOps',
      'Testing': 'DevOps',
      'AI': 'IA',
      'ML': 'IA',
      'Web': 'Frontend',
      'Desarrollo Web': 'Frontend',
      'Programación Web': 'Frontend'
    };
    
    category = categoryMap[category] || 'Programación';

    // Extraer fecha
    const metaDate = doc.querySelector('meta[name="published"]');
    const dateInText = html.match(/\d{1,2}\s+de\s+[a-zA-Z]+\s+de\s+\d{4}/);
    const date = metaDate 
      ? metaDate.getAttribute('content')
      : dateInText 
        ? dateInText[0]
        : new Date().toISOString().split('T')[0];

    // Extraer imagen
    const images = Array.from(doc.querySelectorAll('img'));
    const mainImage = images.find(img => {
      const src = img.getAttribute('src');
      return src && !src.includes('data:') && !src.includes('base64');
    });
    const image = mainImage 
      ? mainImage.getAttribute('src')
      : '/logos-he-imagenes/programacion.jpeg';

    // Extraer autor
    const metaAuthor = doc.querySelector('meta[name="author"]');
    const authorDiv = doc.querySelector('.author-bio, .author-info');
    const author = {
      name: metaAuthor?.getAttribute('content') || 'hgaruna Team',
      avatar: '/logos-he-imagenes/author-default.jpg',
      bio: authorDiv?.textContent?.trim() || 'Equipo de desarrollo de hgaruna'
    };

    // Extraer keywords/tags
    const metaKeywords = doc.querySelector('meta[name="keywords"]');
    const keywords = metaKeywords 
      ? metaKeywords.getAttribute('content').split(',').map(k => k.trim())
      : [];

    // Extraer h2 como tags adicionales
    const h2s = Array.from(doc.querySelectorAll('h2'))
      .map(h2 => h2.textContent.trim())
      .filter(tag => tag.length < 20);

    // Combinar y limpiar tags
    const tags = [...new Set([
      ...keywords,
      category,
      ...h2s.slice(0, 2)
    ])].slice(0, 5);

    // Calcular tiempo de lectura
    const textContent = doc.body.textContent.trim();
    const wordCount = textContent.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min';

    // Calcular estadísticas basadas en la fecha
    const publishDate = new Date(date);
    const daysSincePublish = Math.max(1, Math.floor((Date.now() - publishDate) / (1000 * 60 * 60 * 24)));
    const baseViews = Math.floor(100 + (Math.random() * 50)) * daysSincePublish;
    const views = Math.min(baseViews, 50000);
    const likes = Math.floor(views * (0.02 + Math.random() * 0.03));

    // Determinar dificultad
    const complexity = textContent.toLowerCase();
    let difficulty = 'Intermedio';
    
    if (complexity.includes('avanzado') || complexity.includes('arquitectura') || 
        complexity.includes('optimización') || h2s.length > 5) {
      difficulty = 'Avanzado';
    } else if (complexity.includes('introducción') || complexity.includes('básico') || 
               complexity.includes('principiante') || h2s.length < 3) {
      difficulty = 'Principiante';
    }

    // Determinar si es destacado o trending
    const isFeatured = views > 5000 || likes > 100;
    const isTrending = views/daysSincePublish > 100;

    return {
      title: title.length > 80 ? title.substring(0, 77) + '...' : title,
      excerpt: description.length > 150 ? description.substring(0, 147) + '...' : description,
      image,
      category,
      author,
      date,
      readTime,
      views,
      likes,
      tags,
      difficulty,
      featured: isFeatured,
      trending: isTrending
    };
  } catch (error) {
    console.error('Error parseando HTML:', error);
    return {
      title: 'Error al cargar el artículo',
      excerpt: 'No se pudo procesar el contenido del artículo correctamente.',
      image: '/logos-he-imagenes/error.jpg',
      category: 'Sistema',
      author: {
        name: 'Sistema',
        avatar: '/logos-he-imagenes/author-default.jpg',
        bio: 'Mensaje del sistema'
      },
      date: new Date().toISOString().split('T')[0],
      readTime: '1 min',
      views: 0,
      likes: 0,
      tags: ['Error', 'Sistema'],
      difficulty: 'N/A',
      featured: false,
      trending: false
    };
  }
}
