import React from "react";
import "./FAQ.css";

export default function FAQ() {
  return (
    <div className="faq-page container">
      <h1>Preguntas Frecuentes (FAQ)</h1>
      <section className="faq-list">
        <div className="faq-item">
          <h3>¿Quién es el autor de este sitio?</h3>
          <p>El único autor y responsable de hgaruna.org es Fernando Larrondo, desarrollador web y creador de todo el contenido y diseño.</p>
        </div>
        <div className="faq-item">
          <h3>¿Cómo se seleccionan los artículos y recursos?</h3>
          <p>Todos los artículos y recursos son generados y seleccionados manualmente, priorizando la calidad, relevancia y utilidad para los usuarios.</p>
        </div>
        <div className="faq-item">
          <h3>¿Qué datos personales recopila el sitio?</h3>
          <p>Solo se recopilan los datos necesarios para el funcionamiento del sitio y la comunicación con los usuarios, respetando la privacidad y cumpliendo con las políticas legales.</p>
        </div>
        <div className="faq-item">
          <h3>¿Cómo puedo contactar al autor?</h3>
          <p>Puedes usar el formulario de contacto o escribir directamente a contacto@hgaruna.com.</p>
        </div>
        <div className="faq-item">
          <h3>¿El sitio cumple con los requisitos de Google AdSense?</h3>
          <p>Sí, el sitio está diseñado para cumplir con las políticas de Google AdSense, incluyendo contenido original, navegación clara, páginas legales y privacidad.</p>
        </div>
      </section>
    </div>
  );
}
