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

      <section className="politicas-content">
        <div className="container">
          <div className="text-center">
            <h2>Políticas de Privacidad</h2>
          </div>
          <div className="privacy-section">
            <h3>1. Responsable del sitio</h3>
            <p>El único responsable y autor de hgaruna.org es Fernando Larrondo, quien garantiza el cumplimiento de la normativa vigente en materia de protección de datos personales.</p>
            <h3>2. Datos que se recopilan</h3>
            <ul>
              <li>Datos de contacto proporcionados por el usuario (nombre, email, mensaje).</li>
              <li>Datos de navegación y cookies para mejorar la experiencia y analizar el uso del sitio.</li>
            </ul>
            <h3>3. Finalidad del tratamiento</h3>
            <p>Los datos se utilizan exclusivamente para responder consultas, mejorar el sitio y ofrecer contenido relevante. No se comparten con terceros salvo obligación legal.</p>
            <h3>4. Derechos del usuario</h3>
            <p>El usuario puede ejercer sus derechos de acceso, rectificación, cancelación y oposición enviando un correo a contacto@hgaruna.com.</p>
            <h3>5. Uso de cookies</h3>
            <p>Este sitio utiliza cookies propias y de terceros para analizar el tráfico y personalizar la experiencia. El usuario puede configurar su navegador para rechazar las cookies.</p>
            <h3>6. Cumplimiento legal</h3>
            <p>hgaruna.org cumple con la Ley de Protección de Datos Personales de Argentina y el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.</p>
            <h3>7. Seguridad</h3>
            <p>Se aplican medidas técnicas y organizativas para proteger los datos personales contra accesos no autorizados, pérdida o alteración.</p>
            <h3>8. Cambios en la política</h3>
            <p>Esta política puede actualizarse periódicamente. Se recomienda revisarla regularmente.</p>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 