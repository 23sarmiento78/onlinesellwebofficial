import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import Hero from '../components/Hero';

export default function Contacto() {
  return (
    <BaseLayout
      title="Contacto Desarrollo Web Villa Carlos Paz | WhatsApp +54 3541 237972 | hgaruna"
      description="Contacta con hgaruna para desarrollo web profesional en Villa Carlos Paz, Córdoba. WhatsApp: +54 3541 237972. Consulta gratuita. Sitios web que convierten visitantes en clientes."
      keywords="contacto desarrollo web villa carlos paz, whatsapp desarrollo web carlos paz, programador web villa carlos paz, consulta web córdoba, desarrollo web profesional villa carlos paz"
      ogTitle="Contacto Desarrollo Web Villa Carlos Paz | WhatsApp +54 3541 237972 | hgaruna"
      ogDescription="Contacta con hgaruna para desarrollo web profesional en Villa Carlos Paz, Córdoba. WhatsApp: +54 3541 237972. Consulta gratuita."
      ogImage="https://service.hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://service.hgaruna.org/contacto/"
    >
      {/* Hero Section */}
      <Hero
        title="Contacto Desarrollo Web Villa Carlos Paz | ¡Hablemos de tu Proyecto!"
        subtitle="¿Listo para transformar tu negocio digitalmente? Contáctanos y descubre cómo podemos ayudarte a crear un sitio web profesional que convierta visitantes en clientes. Consulta gratuita."
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
      <section className="contacto-content">
        <div className="container">
          <div className="text-center">
            <h2>Contacto</h2>
            <p>Contenido personalizado con Builder.io</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 