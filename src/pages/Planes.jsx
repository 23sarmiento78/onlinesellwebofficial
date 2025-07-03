import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';

export default function Planes() {
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
      {/* Hero Section */}
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

      {/* Contenido de Builder.io irá aquí */}
      <section className="planes-content">
        <div className="container">
          <div className="text-center">
            <h2>Planes de Desarrollo Web</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 