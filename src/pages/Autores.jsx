import React from 'react';
import BaseLayout from '../layouts/BaseLayout';

export default function Autores() {
  return (
    <BaseLayout
      title="Autor del sitio | hgaruna.org"
      description="Conoce al autor y creador de hgaruna.org, su perfil profesional y su aporte al desarrollo web."
      keywords="autor, creador, hgaruna, perfil, desarrollo web"
      ogTitle="Autor del sitio | hgaruna.org"
      ogDescription="Conoce al autor y creador de hgaruna.org, su perfil profesional y su aporte al desarrollo web."
      ogImage="/logos-he-imagenes/20241013_232706~3.jpg"
      ogUrl="/autores"
    >
      <section className="autores-section" style={{textAlign: 'center', padding: '48px 0'}}>
        <img src="/logos-he-imagenes/20241013_232706~3.jpg" alt="Foto del autor" style={{width: 140, borderRadius: '50%', marginBottom: 20}} />
        <h1>Autor y Creador</h1>
        <h2 style={{color: '#64ffda', fontWeight: 600}}>hgaruna</h2>
        <p style={{maxWidth: 540, margin: '20px auto', fontSize: 17}}>
          Soy el único autor y responsable de todo el contenido, desarrollo y diseño de hgaruna.org. <br /><br />
          Mi experiencia abarca desarrollo web, automatización, inteligencia artificial y educación digital. <br />
          Si tienes dudas, sugerencias o quieres colaborar, puedes contactarme directamente desde la sección de contacto.
        </p>
        <div style={{marginTop: 28}}>
          <strong>Especialidad:</strong> Desarrollo web, automatización, IA, educación.<br />
          <strong>Contacto:</strong> <a href="mailto:contacto@hgaruna.com">contacto@hgaruna.com</a>
        </div>
      </section>
    </BaseLayout>
  );
}
