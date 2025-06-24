const fs = require('fs');
const path = require('path');

// Configuración específica para Villa Carlos Paz
const gmbConfig = {
  businessName: "hgaruna - Desarrollo Web Villa Carlos Paz",
  location: "Villa Carlos Paz, Córdoba",
  services: [
    "Desarrollo Web Profesional",
    "Diseño de Sitios Web", 
    "Marketing Digital",
    "SEO Local",
    "E-commerce",
    "Mantenimiento Web"
  ],
  localKeywords: [
    "Villa Carlos Paz",
    "Carlos Paz", 
    "Córdoba",
    "Valle de Punilla",
    "Sierras de Córdoba"
  ]
};

// Plantillas de posts para GMB
const postTemplates = {
  casosExito: [
    "🎉 ¡Nuevo sitio web lanzado en Villa Carlos Paz! {servicio} para {tipoNegocio}. Diseño moderno y funcional que potencia la presencia online de nuestros clientes locales. #DesarrolloWeb #VillaCarlosPaz #MarketingDigital",
    "✅ Proyecto completado: {servicio} para empresa en {ubicacion}. Resultados increíbles en visibilidad y conversiones. ¿Tu negocio necesita una web profesional? ¡Contáctanos! #WebProfesional #CarlosPaz #NegociosLocales",
    "🚀 Otro éxito en {ubicacion}: {servicio} implementado con excelentes resultados. Nuestros clientes locales confían en hgaruna para su transformación digital. #ÉxitoLocal #DesarrolloWeb #VillaCarlosPaz"
  ],
  
  tips: [
    "💡 TIP SEO LOCAL: ¿Sabías que el 46% de las búsquedas en Google son locales? Optimiza tu sitio web para aparecer en búsquedas de 'Villa Carlos Paz'. #SEOLocal #MarketingDigital #CarlosPaz",
    "🔍 CONSEJO WEB: Un sitio web responsivo es fundamental para negocios en Villa Carlos Paz. Los turistas y locales buscan desde móviles. ¿Tu web está optimizada? #DiseñoWeb #Responsive #VillaCarlosPaz",
    "📱 TIP MARKETING: Las redes sociales son clave para negocios locales en {ubicacion}. Mantén contenido fresco y conecta con tu comunidad. #RedesSociales #MarketingLocal #CarlosPaz"
  ],
  
  ofertas: [
    "🔥 OFERTA ESPECIAL: Desarrollo web profesional para negocios en Villa Carlos Paz. 20% de descuento en tu primer proyecto. ¡Solo hasta fin de mes! #OfertaEspecial #DesarrolloWeb #VillaCarlosPaz",
    "🎯 PROMOCIÓN LOCAL: Sitios web para restaurantes y hoteles en {ubicacion}. Diseño personalizado + SEO local incluido. ¡Potencia tu negocio turístico! #Turismo #WebProfesional #CarlosPaz",
    "⚡ OFERTA LIMITADA: E-commerce completo para comercios en Villa Carlos Paz. Incluye diseño + configuración + capacitación. ¡No te quedes sin tu tienda online! #Ecommerce #VillaCarlosPaz #NegociosDigitales"
  ],
  
  testimonios: [
    "⭐ 'Excelente trabajo en mi sitio web. Ahora recibo más consultas desde Villa Carlos Paz y alrededores.' - Cliente satisfecho de {ubicacion}. #Testimonio #Satisfacción #VillaCarlosPaz",
    "🌟 'hgaruna transformó mi presencia online. Mi restaurante en {ubicacion} ahora tiene reservas online.' - Cliente feliz. #ÉxitoCliente #Restaurante #CarlosPaz",
    "💫 'Profesionalismo y resultados. Mi negocio en Villa Carlos Paz creció gracias a mi nueva web.' - Cliente recomendado. #Recomendación #Crecimiento #VillaCarlosPaz"
  ],
  
  informativos: [
    "📊 ESTADÍSTICAS: El 78% de las búsquedas locales terminan en una compra. ¿Tu negocio en Villa Carlos Paz está visible online? #Estadísticas #MarketingLocal #CarlosPaz",
    "🌐 TENDENCIA: Los sitios web de comercios locales en {ubicacion} aumentaron un 45% en 2024. ¿Ya tienes el tuyo? #Tendencias #ComercioLocal #VillaCarlosPaz",
    "📈 CRECIMIENTO: El e-commerce en Córdoba creció un 32% este año. ¿Tu negocio en Villa Carlos Paz está listo para vender online? #Ecommerce #Crecimiento #CarlosPaz"
  ]
};

// Generar posts aleatorios
function generateRandomPost() {
  const categories = Object.keys(postTemplates);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const templates = postTemplates[category];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Reemplazar placeholders
  let post = template
    .replace('{servicio}', gmbConfig.services[Math.floor(Math.random() * gmbConfig.services.length)])
    .replace('{tipoNegocio}', ['restaurante', 'hotel', 'comercio', 'consultorio', 'estudio'][Math.floor(Math.random() * 5)])
    .replace('{ubicacion}', gmbConfig.localKeywords[Math.floor(Math.random() * gmbConfig.localKeywords.length)]);
  
  return {
    category: category,
    content: post,
    hashtags: extractHashtags(post),
    suggestedImage: getSuggestedImage(category)
  };
}

// Extraer hashtags del post
function extractHashtags(post) {
  const hashtagRegex = /#\w+/g;
  return post.match(hashtagRegex) || [];
}

// Obtener imagen sugerida según categoría
function getSuggestedImage(category) {
  const imageMap = {
    casosExito: "trabajo-completado.jpg",
    tips: "consejo-web.jpg", 
    ofertas: "oferta-especial.jpg",
    testimonios: "cliente-feliz.jpg",
    informativos: "estadisticas.jpg"
  };
  return imageMap[category] || "default-post.jpg";
}

// Generar calendario de posts para un mes
function generateMonthlyCalendar() {
  const calendar = [];
  const daysInMonth = 30;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const post = generateRandomPost();
    calendar.push({
      day: day,
      date: new Date(2025, 0, day).toLocaleDateString('es-AR'),
      ...post
    });
  }
  
  return calendar;
}

// Generar contenido para GMB
function generateGMBContent() {
  const monthlyCalendar = generateMonthlyCalendar();
  
  const content = {
    businessInfo: gmbConfig,
    monthlyPosts: monthlyCalendar,
    suggestedPhotos: [
      "Sitios web desarrollados para clientes locales",
      "Reuniones con clientes en Villa Carlos Paz", 
      "Certificaciones y logros profesionales",
      "Proceso de trabajo y metodología",
      "Antes y después de proyectos"
    ],
    services: gmbConfig.services.map(service => ({
      name: service,
      description: `${service} especializado para negocios en Villa Carlos Paz y alrededores`,
      price: "Consultar"
    })),
    hours: {
      monday: "9:00-18:00",
      tuesday: "9:00-18:00", 
      wednesday: "9:00-18:00",
      thursday: "9:00-18:00",
      friday: "9:00-18:00",
      saturday: "10:00-14:00",
      sunday: "Cerrado"
    }
  };
  
  // Guardar en archivo
  const outputPath = path.join(__dirname, '../public/gmb-content-calendar.json');
  fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
  
  console.log('✅ Calendario de contenido GMB generado en:', outputPath);
  console.log('📅 Posts generados:', monthlyCalendar.length);
  
  return content;
}

// Generar posts de ejemplo
function generateExamplePosts() {
  console.log('\n📝 Ejemplos de Posts para GMB:\n');
  
  for (let i = 0; i < 5; i++) {
    const post = generateRandomPost();
    console.log(`Post ${i + 1} (${post.category}):`);
    console.log(post.content);
    console.log(`Hashtags: ${post.hashtags.join(', ')}`);
    console.log(`Imagen sugerida: ${post.suggestedImage}`);
    console.log('---\n');
  }
}

// Ejecutar generador
generateGMBContent();
generateExamplePosts(); 