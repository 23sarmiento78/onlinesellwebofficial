import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';

export default function DisenoWebVillaCarlosPaz() {
  return (
    <BaseLayout
      title="Diseño Web Villa Carlos Paz | Diseñador Web Profesional | Sitios Web Modernos | hgaruna"
      description="Diseño web profesional en Villa Carlos Paz, Córdoba. Diseñador web especializado en sitios web modernos y responsivos. UX/UI, branding y diseño gráfico. Precios desde $150."
      keywords="diseño web villa carlos paz, diseñador web villa carlos paz, diseño web córdoba, ux ui villa carlos paz, diseño gráfico villa carlos paz, sitios web modernos córdoba, branding villa carlos paz"
      ogTitle="Diseño Web Villa Carlos Paz | Diseñador Web Profesional | Sitios Web Modernos | hgaruna"
      ogDescription="Diseño web profesional en Villa Carlos Paz, Córdoba. Diseñador web especializado en sitios web modernos y responsivos. UX/UI y branding incluido."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/diseño-web-villa-carlos-paz/"
    >
      {/* Hero Section */}
      <Hero
        title="Diseño Web Profesional Villa Carlos Paz | Sitios Web Modernos"
        subtitle="Creamos diseños web únicos y modernos que destacan tu marca. UX/UI optimizado, diseño responsivo y branding personalizado. Precios accesibles para negocios locales de Villa Carlos Paz."
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
      <section className="diseno-content">
        <div className="container">
          <div className="text-center">
            <h2>Diseño Web Villa Carlos Paz</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 