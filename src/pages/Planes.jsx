import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';
import { BuilderComponent, builder } from '@builder.io/react';

builder.init('e413bf72af054b07925671fff35fae24'); // Tu API Key

export default function Planes() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    builder
      .get('page', { url: '/planes-main' }) // Cambia este nombre si lo deseas, pero usa el mismo en Builder.io
      .toPromise()
      .then(setContent);
  }, []);

  return (
    <BaseLayout
      title="Planes Desarrollo Web Villa Carlos Paz | Desde $150 | Sitios Web Profesionales | hgaruna"
      description="Planes de desarrollo web profesionales en Villa Carlos Paz, Córdoba. Precios accesibles desde $150. Sitios web que convierten visitantes en clientes. E-commerce y SEO incluido."
      keywords="planes desarrollo web villa carlos paz, precios sitios web carlos paz, desarrollo web córdoba, e-commerce villa carlos paz, seo local villa carlos paz, sitios web profesionales villa carlos paz"
      ogTitle="Planes Desarrollo Web Villa Carlos Paz | Desde $150 | Sitios Web Profesionales | hgaruna"
      ogDescription="Planes de desarrollo web profesionales en Villa Carlos Paz, Córdoba. Precios accesibles desde $150. Sitios web que convierten visitantes en clientes."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/planes/"
    >
      {/* Hero fijo, NO editable desde Builder */}
      <Hero
        title="Planes de Desarrollo Web Villa Carlos Paz | Precios Accesibles"
        subtitle="Elige el plan perfecto para tu negocio. Desde sitios web básicos hasta e-commerce completos. Todos nuestros planes incluyen SEO local y soporte técnico. Precios desde $150."
        backgroundImage="/logos-he-imagenes/fondo-hero.jpg"
        ctas={[
          {
            href: '/contacto/',
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

      {/* MAIN EDITABLE DESDE BUILDER.IO */}
      <main>
        <section className="builder-content" style={{ padding: '2rem 0', minHeight: '200px' }}>
          <BuilderComponent model="page" content={content} />
        </section>
      </main>
      {/* El Footer viene de BaseLayout */}
    </BaseLayout>
  );
} 