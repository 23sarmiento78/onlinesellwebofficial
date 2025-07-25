import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';

export default function MarketingDigitalVillaCarlosPaz() {
  return (
    <BaseLayout
      title="Marketing Digital Villa Carlos Paz | SEO Local | Google Ads | Redes Sociales | hgaruna"
      description="Marketing digital profesional en Villa Carlos Paz, Córdoba. SEO local, Google Ads, redes sociales y publicidad online. Aumenta las ventas de tu negocio local. Precios desde $150."
      keywords="marketing digital villa carlos paz, seo local villa carlos paz, google ads villa carlos paz, redes sociales villa carlos paz, publicidad online córdoba, posicionamiento web villa carlos paz, marketing digital córdoba"
      ogTitle="Marketing Digital Villa Carlos Paz | SEO Local | Google Ads | Redes Sociales | hgaruna"
      ogDescription="Marketing digital profesional en Villa Carlos Paz, Córdoba. SEO local, Google Ads, redes sociales y publicidad online. Aumenta las ventas de tu negocio local."
      ogImage="https://hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://hgaruna.org/marketing-digital-villa-carlos-paz/"
    >
      {/* Hero Section */}
      <Hero
        title="Marketing Digital Profesional Villa Carlos Paz | Aumenta tus Ventas"
        subtitle="Lleva tu negocio al siguiente nivel con marketing digital profesional. SEO local, Google Ads, redes sociales y publicidad online. Resultados medibles y ROI garantizado."
        backgroundImage="/logos-he-imagenes/fondo-hero.jpg"
        ctas={[
          {
            href: '/planes/',
            className: 'cta-button primary',
            icon: 'fas fa-rocket',
            text: '¡Quiero mi Sitio Web YA!'
          },
          {
            href: 'https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz',
            className: 'cta-button secondary',
            icon: 'fab fa-whatsapp',
            text: 'Consulta Gratuita',
            target: '_blank'
          }
        ]}
        stats={[
          { number: '20+', label: 'Sitios Web Creados' },
          { number: '100%', label: 'Clientes Satisfechos' },
          { number: '24h', label: 'Tiempo de Respuesta' }
        ]}
      />

      {/* Contenido de Builder.io irá aquí */}
      <section className="marketing-content">
        <div className="container">
          <div className="text-center">
            <h2>Marketing Digital Villa Carlos Paz</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 