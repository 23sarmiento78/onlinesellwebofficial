// Script para sobrescribir todos los artículos en public/blog/ con nuevas imágenes de Pexels
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BLOG_DIR = path.join(process.cwd(), 'public', 'blog');
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'KH9zxpntlujprYHyJ4q4xevZPsEZJ4MOmT1tF9vRLWX9GPHOjdCyn2DJ';
const FALLBACK_IMG = '/logos-he-imagenes/programacion.jpeg';

async function getPexelsImage(query) {
  if (!PEXELS_API_KEY) return FALLBACK_IMG;
  // 1. Buscar por la categoría
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    if (res.ok) {
      const data = await res.json();
      const images = (data.photos || []).map(p => p.src?.large2x || p.src?.large || p.src?.original).filter(Boolean);
      if (images.length > 0) {
        // Elegir una imagen aleatoria
        return images[Math.floor(Math.random() * images.length)];
      }
    }
  } catch {}
  // 2. Si no se encontró, buscar por 'programming'
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=programming&per_page=10`, {
      headers: { Authorization: PEXELS_API_KEY }
    });
    if (res.ok) {
      const data = await res.json();
      const images = (data.photos || []).map(p => p.src?.large2x || p.src?.large || p.src?.original).filter(Boolean);
      if (images.length > 0) {
        // Elegir una imagen aleatoria
        return images[Math.floor(Math.random() * images.length)];
      }
    }
  } catch {}
  // 3. Si no se encontró nada, usar imagen local
  return FALLBACK_IMG;
}

async function updateArticles() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    // Extraer categoría del artículo
    const match = html.match(/<div class="eyebrow">(.*?)<\/div>/);
    const category = match ? match[1].trim() : 'programación';
    const imgUrl = await getPexelsImage(category);
    // Mostrar info en consola
    console.log(`Procesando: ${file}`);
    console.log(`Categoría detectada: ${category}`);
    console.log(`Imagen asignada: ${imgUrl}`);
    // Reemplazar src de la imagen destacada (más robusto)
    const imgRegex = /<img\s+src="[^"]*"\s+alt="Imagen destacada"[^>]*>/gi;
    html = html.replace(imgRegex, match => {
      return match.replace(/src="[^"]*"/, `src="${imgUrl}"`);
    });

    // Reemplazar meta og:image
    const ogImgRegex = /(<meta[^>]*property=["']og:image["'][^>]*content=")[^"]+(")/gi;
    html = html.replace(ogImgRegex, `$1${imgUrl}$2`);

    // Reemplazar imagen en JSON-LD ("image": [ ... ])
    const jsonLdImgRegex = /("image":\s*\[\s*")[^"]+(")/gi;
    html = html.replace(jsonLdImgRegex, `$1${imgUrl}$2`);
    // Si hay array de imágenes, reemplazar todas por la nueva
    html = html.replace(/("image":\s*\[)([^\]]+)(\])/gi, (match, p1, p2, p3) => {
      return `${p1}"${imgUrl}"${p3}`;
    });

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Artículo actualizado: ${file}\n`);
  }
  console.log('Todos los artículos han sido actualizados con imágenes de Pexels.');
}

updateArticles();
