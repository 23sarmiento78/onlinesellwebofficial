import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';

export default function Legal() {
  return (
    <BaseLayout
      title="Aviso Legal - Términos y Condiciones | Desarrollo Web Villa Carlos Paz | hgaruna"
      description="Aviso legal y términos de servicio de hgaruna. Desarrollo web profesional en Villa Carlos Paz, Córdoba. Información legal, condiciones de uso y políticas de servicio."
      keywords="aviso legal hgaruna, términos servicio desarrollo web, condiciones uso villa carlos paz, legal desarrollo web córdoba, políticas servicio hgaruna"
      ogTitle="Aviso Legal - Términos y Condiciones | Desarrollo Web Villa Carlos Paz | hgaruna"
      ogDescription="Aviso legal y términos de servicio de hgaruna. Desarrollo web profesional en Villa Carlos Paz, Córdoba. Información legal y condiciones de uso."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/legal/"
    >
      {/* Hero Section */}
      <Hero
        title="Aviso Legal y Términos de Servicio | hgaruna"
        subtitle="Información legal y términos de servicio de hgaruna. Desarrollo web profesional en Villa Carlos Paz, Córdoba. Conoce nuestras políticas y condiciones de trabajo."
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
      <section className="legal-content">
        <div className="container">
          <div className="text-center">
            <h2>Aviso Legal</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 