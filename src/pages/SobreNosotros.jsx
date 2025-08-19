import React from 'react';
import BaseLayout from '../layouts/BaseLayout';

export default function SobreNosotros() {
  return (
    <BaseLayout
      title="Sobre mí y Autor | Israel Sarmiento"
      description="Conoce a Israel Sarmiento, creador y autor de hgaruna.org: misión, visión y perfil profesional en desarrollo web y educación tecnológica."
      keywords="israel sarmiento, sobre mí, autor, hgaruna, desarrollo web, misión, visión, perfil"
      ogTitle="Sobre mí y Autor | Israel Sarmiento"
      ogDescription="Conoce a Israel Sarmiento, su misión, visión y perfil profesional en el desarrollo web y la educación tecnológica."
      ogImage="/logos-he-imagenes/israel.jpg"
      ogUrl="/nosotros"
    >
      <section className="sobre-nosotros-hero" style={{textAlign: 'center', padding: '48px 0'}}>
        <img src="/logos-he-imagenes/israel.jpg" alt="Foto de Israel Sarmiento" style={{width: 160, height: 160, objectFit: 'cover', borderRadius: '50%', marginBottom: 24}} />
        <h1>Sobre mí y Autor</h1>
        <h2 style={{color: '#64ffda', fontWeight: 600}}>Israel Sarmiento - Creador de hgaruna.org</h2>
        <p style={{maxWidth: 600, margin: '24px auto', fontSize: 18}}>
          ¡Hola! Soy Israel Sarmiento, autor y responsable de todo el contenido, desarrollo y diseño de hgaruna.org. Mi misión es compartir conocimiento, recursos y herramientas de calidad para ayudar a desarrolladores y entusiastas de la tecnología a crecer profesionalmente.<br /><br />
          Desde Villa Carlos Paz, Argentina, creo contenido educativo, tutoriales y soluciones digitales con pasión y compromiso. Me enfoco en construir una comunidad abierta, colaborativa y siempre actualizada en tendencias del desarrollo web.<br /><br />
          Mi experiencia abarca desarrollo web, automatización, inteligencia artificial y educación digital. Si tienes dudas, sugerencias o quieres colaborar, puedes contactarme desde la sección de contacto.
        </p>
        <div style={{marginTop: 32}}>
          <strong>Misión:</strong> Democratizar el acceso al conocimiento tecnológico y promover el aprendizaje continuo.<br />
          <strong>Visión:</strong> Ser referente en educación digital y desarrollo web en habla hispana.<br />
          <strong>Especialidad:</strong> Desarrollo web, automatización, IA, educación.<br />
          <strong>Contacto:</strong> <a href="mailto:contacto@hgaruna.com">contacto@hgaruna.com</a>
        </div>
      </section>
    </BaseLayout>
  );
}
