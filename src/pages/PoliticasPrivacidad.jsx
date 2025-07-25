import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';

export default function PoliticasPrivacidad() {
  return (
    <BaseLayout
      title="Políticas de Privacidad - Protección de Datos | Desarrollo Web Villa Carlos Paz | hgaruna"
      description="Políticas de privacidad de hgaruna. Desarrollo web profesional en Villa Carlos Paz, Córdoba. Protección de datos personales, cookies y cumplimiento GDPR."
      keywords="políticas privacidad hgaruna, protección datos desarrollo web, privacidad villa carlos paz, gdpr desarrollo web córdoba, cookies hgaruna, datos personales"
      ogTitle="Políticas de Privacidad - Protección de Datos | Desarrollo Web Villa Carlos Paz | hgaruna"
      ogDescription="Políticas de privacidad de hgaruna. Desarrollo web profesional en Villa Carlos Paz, Córdoba. Protección de datos personales y cumplimiento GDPR."
      ogImage="https://hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://hgaruna.org/politicas-privacidad/"
    >
      {/* Hero Section */}
      <Hero
        title="Políticas de Privacidad | Protección de Datos | hgaruna"
        subtitle="Tu privacidad es importante para nosotros. Conoce cómo protegemos tus datos personales en hgaruna. Desarrollo web profesional en Villa Carlos Paz, Córdoba."
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
      <section className="politicas-content">
        <div className="container">
          <div className="text-center">
            <h2>Políticas de Privacidad</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 