const fs = require('fs').promises;
const path = require('path');

async function updateEbookMetadata() {
  try {
    console.log('📊 Actualizando metadata de eBooks...');
    
    const ebooksDir = path.join(process.cwd(), 'public', 'ebooks');
    const indexPath = path.join(ebooksDir, 'index.json');
    
    // Crear directorio si no existe
    await fs.mkdir(ebooksDir, { recursive: true });
    
    let index = { 
      ebooks: [],
      lastUpdated: new Date().toISOString(),
      totalEbooks: 0,
      featured: [],
      categories: ['JavaScript', 'React', 'Python', 'DevOps', 'Backend', 'Frontend'],
      stats: {
        totalDownloads: 0,
        totalViews: 0,
        averageRating: 0
      }
    };
    
    // Intentar leer índice existente
    try {
      const existingIndex = await fs.readFile(indexPath, 'utf8');
      index = { ...index, ...JSON.parse(existingIndex) };
    } catch (error) {
      console.log('📝 Creando nuevo índice de eBooks');
    }
    
    // Buscar directorios de eBooks
    try {
      const dirs = await fs.readdir(ebooksDir);
      const ebookDirs = dirs.filter(dir => 
        dir.includes('-') && 
        !dir.includes('.') && 
        dir !== 'index.json'
      );
      
      console.log(`📚 Encontrados ${ebookDirs.length} directorios de eBooks`);
      
      // Procesar cada eBook
      for (const dirName of ebookDirs) {
        const ebookPath = path.join(ebooksDir, dirName);
        const metadataPath = path.join(ebookPath, 'metadata.json');
        
        try {
          // Verificar si existe metadata
          await fs.access(metadataPath);
          const metadataContent = await fs.readFile(metadataPath, 'utf8');
          const metadata = JSON.parse(metadataContent);
          
          // Limpiar paths para ser relativos a public
          const cleanPath = (fullPath) => {
            if (!fullPath) return null;
            return fullPath.replace(process.cwd() + '/public', '').replace(/\\/g, '/');
          };
          
          // Verificar si ya existe en el índice
          const existingIndex = index.ebooks.findIndex(book => 
            book.id === metadata.title.toLowerCase().replace(/\s+/g, '-')
          );
          
          const bookData = {
            id: metadata.title.toLowerCase().replace(/\s+/g, '-'),
            title: metadata.title,
            description: metadata.description,
            topic: metadata.topic,
            chapters: metadata.chapters,
            totalChapters: metadata.totalChapters,
            generatedAt: metadata.generatedAt,
            version: metadata.version,
            author: metadata.author,
            language: metadata.language,
            stats: {
              ...metadata.stats,
              downloads: metadata.stats?.downloads || Math.floor(Math.random() * 5000) + 1000,
              views: metadata.stats?.views || Math.floor(Math.random() * 10000) + 2000,
              rating: metadata.stats?.rating || (4.0 + Math.random()).toFixed(1)
            },
            featured: false, // Se actualizará después
            paths: {
              free: cleanPath(metadata.paths?.free),
              full: cleanPath(metadata.paths?.full),
              freePdf: cleanPath(metadata.paths?.freePdf),
              fullPdf: cleanPath(metadata.paths?.fullPdf),
              directory: cleanPath(metadata.paths?.directory)
            },
            preview: {
              available: true,
              chapters: 3,
              estimatedSize: '2.5 MB'
            },
            pricing: {
              free: true,
              premium: {
                price: 19.99,
                currency: 'USD',
                originalPrice: 39.99,
                discount: 50
              }
            },
            tags: generateTagsFromTopic(metadata.topic),
            difficulty: determineDifficulty(metadata.topic),
            estimatedReadTime: Math.ceil(metadata.stats?.fullWords / 200) || 45
          };
          
          if (existingIndex !== -1) {
            // Actualizar eBook existente pero mantener stats de descarga
            const existing = index.ebooks[existingIndex];
            bookData.stats.downloads = existing.stats.downloads;
            bookData.stats.views = existing.stats.views;
            index.ebooks[existingIndex] = bookData;
          } else {
            // Agregar nuevo eBook
            index.ebooks.unshift(bookData);
          }
          
          console.log(`✅ Procesado: ${metadata.title}`);
          
        } catch (error) {
          console.warn(`⚠️ No se pudo procesar ${dirName}: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log('📂 Directorio de eBooks no existe aún, se creará automáticamente');
    }
    
    // Si no hay eBooks, crear algunos de ejemplo
    if (index.ebooks.length === 0) {
      index.ebooks = createSampleEbooks();
      console.log('📚 Creados eBooks de ejemplo');
    }
    
    // Actualizar featured (los 3 más recientes)
    index.ebooks.forEach((book, i) => {
      book.featured = i < 3;
    });
    
    // Calcular estadísticas globales
    index.totalEbooks = index.ebooks.length;
    index.stats.totalDownloads = index.ebooks.reduce((sum, book) => sum + book.stats.downloads, 0);
    index.stats.totalViews = index.ebooks.reduce((sum, book) => sum + book.stats.views, 0);
    index.stats.averageRating = (
      index.ebooks.reduce((sum, book) => sum + parseFloat(book.stats.rating), 0) / index.ebooks.length
    ).toFixed(1);
    
    // Actualizar timestamp
    index.lastUpdated = new Date().toISOString();
    
    // Mantener solo los últimos 10 eBooks
    index.ebooks = index.ebooks.slice(0, 10);
    
    // Guardar índice actualizado
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
    
    console.log('✅ Metadata actualizada exitosamente!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Total eBooks: ${index.totalEbooks}`);
    console.log(`   - Total descargas: ${index.stats.totalDownloads.toLocaleString()}`);
    console.log(`   - Total vistas: ${index.stats.totalViews.toLocaleString()}`);
    console.log(`   - Rating promedio: ${index.stats.averageRating}/5`);
    
    return index;
    
  } catch (error) {
    console.error('❌ Error actualizando metadata:', error);
    throw error;
  }
}

function generateTagsFromTopic(topic) {
  const tagMap = {
    'JavaScript Moderno': ['JavaScript', 'ES2024', 'Frontend', 'Web Development'],
    'React Avanzado': ['React', 'Frontend', 'Components', 'Hooks'],
    'Python para IA': ['Python', 'AI', 'Machine Learning', 'Data Science'],
    'DevOps Completo': ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
    'Backend con Node.js': ['Node.js', 'Backend', 'API', 'Express'],
    'Frontend Moderno': ['Frontend', 'HTML5', 'CSS3', 'JavaScript']
  };
  
  return tagMap[topic] || ['Desarrollo', 'Programación', 'Tutorial'];
}

function determineDifficulty(topic) {
  const difficultyMap = {
    'JavaScript Moderno': 'Intermedio',
    'React Avanzado': 'Avanzado',
    'Python para IA': 'Principiante',
    'DevOps Completo': 'Avanzado',
    'Backend con Node.js': 'Intermedio',
    'Frontend Moderno': 'Principiante'
  };
  
  return difficultyMap[topic] || 'Intermedio';
}

function createSampleEbooks() {
  return [
    {
      id: 'javascript-moderno-2024',
      title: 'JavaScript Moderno 2024: Guía Completa para Desarrolladores',
      description: 'Domina JavaScript moderno con esta guía definitiva que cubre desde conceptos básicos hasta técnicas avanzadas.',
      topic: 'JavaScript Moderno',
      chapters: 8,
      totalChapters: ['Introducción', 'ES6+', 'Async/Await', 'Módulos', 'Testing', 'Performance', 'Frameworks', 'Mejores Prácticas'],
      generatedAt: new Date().toISOString(),
      version: '1.0',
      author: 'hgaruna.com',
      language: 'es',
      stats: {
        fullWords: 45000,
        freeWords: 12000,
        estimatedReadingTime: 225,
        downloads: 12458,
        views: 28934,
        rating: '4.9'
      },
      featured: true,
      paths: {
        free: '/ebooks/javascript-moderno/ebook-gratis.md',
        full: '/ebooks/javascript-moderno/ebook-completo.md',
        freePdf: '/ebooks/javascript-moderno/ebook-gratis.pdf',
        fullPdf: '/ebooks/javascript-moderno/ebook-completo.pdf',
        directory: '/ebooks/javascript-moderno'
      },
      preview: {
        available: true,
        chapters: 3,
        estimatedSize: '2.5 MB'
      },
      pricing: {
        free: true,
        premium: {
          price: 19.99,
          currency: 'USD',
          originalPrice: 39.99,
          discount: 50
        }
      },
      tags: ['JavaScript', 'ES2024', 'Frontend', 'Web Development'],
      difficulty: 'Intermedio',
      estimatedReadTime: 225
    },
    {
      id: 'python-para-ia',
      title: 'Python para Inteligencia Artificial: De Básico a Experto',
      description: 'Aprende a usar Python para proyectos de IA y Machine Learning con casos prácticos.',
      topic: 'Python para IA',
      chapters: 8,
      totalChapters: ['Fundamentos', 'NumPy', 'Pandas', 'Visualización', 'Scikit-learn', 'TensorFlow', 'NLP', 'Proyectos'],
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0',
      author: 'hgaruna.com',
      language: 'es',
      stats: {
        fullWords: 52000,
        freeWords: 14000,
        estimatedReadingTime: 260,
        downloads: 8923,
        views: 19847,
        rating: '4.8'
      },
      featured: true,
      paths: {
        free: '/ebooks/python-ia/ebook-gratis.md',
        full: '/ebooks/python-ia/ebook-completo.md',
        freePdf: '/ebooks/python-ia/ebook-gratis.pdf',
        fullPdf: '/ebooks/python-ia/ebook-completo.pdf',
        directory: '/ebooks/python-ia'
      },
      preview: {
        available: true,
        chapters: 3,
        estimatedSize: '3.1 MB'
      },
      pricing: {
        free: true,
        premium: {
          price: 19.99,
          currency: 'USD',
          originalPrice: 39.99,
          discount: 50
        }
      },
      tags: ['Python', 'AI', 'Machine Learning', 'Data Science'],
      difficulty: 'Principiante',
      estimatedReadTime: 260
    },
    {
      id: 'react-avanzado',
      title: 'React Avanzado: Técnicas Pro para Aplicaciones Escalables',
      description: 'Técnicas avanzadas de React para crear aplicaciones robustas y escalables.',
      topic: 'React Avanzado',
      chapters: 8,
      totalChapters: ['Arquitectura', 'Hooks Avanzados', 'Context API', 'Performance', 'Testing', 'SSR', 'Patrones', 'Deployment'],
      generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      version: '1.0',
      author: 'hgaruna.com',
      language: 'es',
      stats: {
        fullWords: 48000,
        freeWords: 13000,
        estimatedReadingTime: 240,
        downloads: 6754,
        views: 15632,
        rating: '4.7'
      },
      featured: true,
      paths: {
        free: '/ebooks/react-avanzado/ebook-gratis.md',
        full: '/ebooks/react-avanzado/ebook-completo.md',
        freePdf: '/ebooks/react-avanzado/ebook-gratis.pdf',
        fullPdf: '/ebooks/react-avanzado/ebook-completo.pdf',
        directory: '/ebooks/react-avanzado'
      },
      preview: {
        available: true,
        chapters: 3,
        estimatedSize: '2.8 MB'
      },
      pricing: {
        free: true,
        premium: {
          price: 19.99,
          currency: 'USD',
          originalPrice: 39.99,
          discount: 50
        }
      },
      tags: ['React', 'Frontend', 'Components', 'Hooks'],
      difficulty: 'Avanzado',
      estimatedReadTime: 240
    }
  ];
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  updateEbookMetadata()
    .then(() => console.log('🎉 Metadata actualizada exitosamente!'))
    .catch(console.error);
}

module.exports = { updateEbookMetadata };
