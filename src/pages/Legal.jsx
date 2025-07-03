import React from "react";
import BaseLayout from "../layouts/BaseLayout";
import Hero from "../components/Hero";
import "./Legal.css";

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
            href: "/planes/",
            className: "cta-button primary",
            icon: "fas fa-rocket",
            text: "¡Quiero mi Sitio Web YA!",
          },
          {
            href: "https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20sitio%20web%20para%20mi%20negocio%20en%20Villa%20Carlos%20Paz",
            className: "cta-button secondary",
            icon: "fab fa-whatsapp",
            text: "Consulta Gratuita",
            target: "_blank",
          },
        ]}
        stats={[
          { number: "20+", label: "Sitios Web Creados" },
          { number: "100%", label: "Clientes Satisfechos" },
          { number: "24h", label: "Tiempo de Respuesta" },
        ]}
      />

      <main className="legal-content">
        <div className="container">
          <div className="legal-sections">
            {/* Información de la Empresa */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-building"></i> Información de la Empresa
              </h2>
              <div className="legal-text">
                <p>
                  <strong>Razón Social:</strong> hgaruna - Desarrollo Web y
                  Soluciones Digitales
                </p>
                <p>
                  <strong>Ubicación:</strong> Villa Carlos Paz, Córdoba,
                  Argentina
                </p>
                <p>
                  <strong>Contacto:</strong> +54 3541 237972
                </p>
                <p>
                  <strong>Email:</strong> info@hgaruna.org
                </p>
                <p>
                  <strong>Sitio Web:</strong> https://service.hgaruna.org
                </p>
                <p>
                  <strong>Fecha de última actualización:</strong> Enero 2025
                </p>
              </div>
            </section>

            {/* Términos y Condiciones */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-file-contract"></i> Términos y Condiciones
                de Servicio
              </h2>
              <div className="legal-text">
                <h3>1. Objeto del Contrato</h3>
                <p>
                  hgaruna se compromete a prestar servicios de desarrollo web,
                  diseño de sitios web, e-commerce, aplicaciones móviles y
                  consultoría digital según los planes y características
                  especificadas en cada propuesta comercial.
                </p>

                <h3>2. Servicios Incluidos</h3>
                <ul>
                  <li>Desarrollo de sitios web responsivos</li>
                  <li>Diseño UX/UI profesional</li>
                  <li>Optimización SEO básica/avanzada</li>
                  <li>
                    Integración de sistemas de gestión de contenidos (CMS)
                  </li>
                  <li>Desarrollo de tiendas online (e-commerce)</li>
                  <li>Desarrollo de aplicaciones móviles</li>
                  <li>Soporte técnico según plan contratado</li>
                </ul>

                <h3>3. Plazos de Entrega</h3>
                <ul>
                  <li>
                    <strong>Plan Básico:</strong> 5-7 días hábiles
                  </li>
                  <li>
                    <strong>Plan Estándar:</strong> 10-15 días hábiles
                  </li>
                  <li>
                    <strong>Plan Profesional:</strong> 15-20 días hábiles
                  </li>
                  <li>
                    <strong>Plan E-commerce:</strong> 20-30 días hábiles
                  </li>
                  <li>
                    <strong>Plan E-commerce Pro:</strong> 30-45 días hábiles
                  </li>
                  <li>
                    <strong>Plan Completo:</strong> 45-60 días hábiles
                  </li>
                </ul>

                <h3>4. Precios y Forma de Pago</h3>
                <p>
                  Los precios están expresados en dólares estadounidenses (USD)
                  y pueden abonarse en pesos argentinos al tipo de cambio
                  oficial del día de la facturación.
                </p>
                <ul>
                  <li>50% al confirmar el proyecto</li>
                  <li>50% al finalizar y entregar el proyecto</li>
                </ul>

                <h3>5. Propiedad Intelectual</h3>
                <p>
                  Una vez completado el pago total, el cliente adquiere todos
                  los derechos sobre el sitio web desarrollado. hgaruna se
                  reserva el derecho de utilizar el proyecto como referencia en
                  su portafolio.
                </p>

                <h3>6. Garantía</h3>
                <p>
                  Ofrecemos garantía de satisfacción al 100%. Si el cliente no
                  está conforme con el resultado final, se realizarán las
                  modificaciones necesarias sin costo adicional durante los
                  primeros 30 días.
                </p>
              </div>
            </section>

            {/* Política de Privacidad */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-shield-alt"></i> Política de Privacidad
              </h2>
              <div className="legal-text">
                <h3>1. Información que Recopilamos</h3>
                <ul>
                  <li>Datos de contacto (nombre, email, teléfono)</li>
                  <li>Información del proyecto y requerimientos técnicos</li>
                  <li>Datos de navegación web (cookies técnicas)</li>
                </ul>

                <h3>2. Uso de la Información</h3>
                <p>La información recopilada se utiliza exclusivamente para:</p>
                <ul>
                  <li>Brindar los servicios contratados</li>
                  <li>Comunicación relacionada con el proyecto</li>
                  <li>Soporte técnico post-entrega</li>
                  <li>Mejora de nuestros servicios</li>
                </ul>

                <h3>3. Protección de Datos</h3>
                <p>
                  Cumplimos con la Ley Argentina de Protección de Datos
                  Personales (Ley 25.326). Los datos personales son tratados de
                  forma confidencial y no se comparten con terceros sin
                  consentimiento expreso.
                </p>

                <h3>4. Derechos del Usuario</h3>
                <p>El usuario tiene derecho a:</p>
                <ul>
                  <li>Acceder a sus datos personales</li>
                  <li>Rectificar información incorrecta</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Oponerse al tratamiento de sus datos</li>
                </ul>
              </div>
            </section>

            {/* Política de Reembolsos */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-undo"></i> Política de Reembolsos
              </h2>
              <div className="legal-text">
                <h3>1. Reembolso Completo</h3>
                <p>
                  Se otorgará reembolso completo en las siguientes situaciones:
                </p>
                <ul>
                  <li>
                    Incapacidad técnica comprobada para realizar el proyecto
                  </li>
                  <li>
                    Cancelación del proyecto por parte del cliente antes del
                    inicio del desarrollo
                  </li>
                  <li>
                    Incumplimiento de plazos por causas atribuibles a hgaruna
                    (más de 15 días de retraso)
                  </li>
                </ul>

                <h3>2. Reembolso Parcial</h3>
                <p>Se otorgará reembolso del 50% en caso de:</p>
                <ul>
                  <li>
                    Cancelación del proyecto una vez iniciado el desarrollo
                  </li>
                  <li>
                    Cambios sustanciales en los requerimientos que hagan
                    inviable el proyecto original
                  </li>
                </ul>

                <h3>3. Sin Reembolso</h3>
                <p>No procede reembolso en casos de:</p>
                <ul>
                  <li>Proyecto completado según especificaciones acordadas</li>
                  <li>
                    Cancelación por cambio de opinión del cliente tras la
                    entrega
                  </li>
                  <li>
                    Falta de colaboración del cliente en la provisión de
                    contenidos
                  </li>
                </ul>
              </div>
            </section>

            {/* Soporte y Mantenimiento */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-tools"></i> Soporte y Mantenimiento
              </h2>
              <div className="legal-text">
                <h3>1. Soporte Incluido</h3>
                <p>Cada plan incluye un período de soporte técnico gratuito:</p>
                <ul>
                  <li>Resolución de errores técnicos</li>
                  <li>Asistencia en el uso del CMS</li>
                  <li>Actualizaciones de seguridad críticas</li>
                  <li>Backup automático de contenidos</li>
                </ul>

                <h3>2. Soporte Adicional</h3>
                <p>
                  Tras el período de soporte incluido, se ofrecen planes de
                  mantenimiento:
                </p>
                <ul>
                  <li>
                    <strong>Básico:</strong> $50 USD/mes
                  </li>
                  <li>
                    <strong>Profesional:</strong> $100 USD/mes
                  </li>
                  <li>
                    <strong>Premium:</strong> $200 USD/mes
                  </li>
                </ul>

                <h3>3. Modificaciones</h3>
                <p>
                  Las modificaciones de diseño o funcionalidad fuera del alcance
                  original se cobran por separado según la complejidad del
                  trabajo.
                </p>
              </div>
            </section>

            {/* Limitación de Responsabilidad */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-exclamation-triangle"></i> Limitación de
                Responsabilidad
              </h2>
              <div className="legal-text">
                <h3>1. Responsabilidades de hgaruna</h3>
                <ul>
                  <li>
                    Desarrollo del sitio web según especificaciones acordadas
                  </li>
                  <li>Cumplimiento de estándares web actuales</li>
                  <li>Entrega en los plazos establecidos</li>
                  <li>Soporte técnico durante el período incluido</li>
                </ul>

                <h3>2. Responsabilidades del Cliente</h3>
                <ul>
                  <li>Provisión de contenidos (textos, imágenes, videos)</li>
                  <li>Pago según términos acordados</li>
                  <li>Colaboración en procesos de revisión y aprobación</li>
                  <li>Mantenimiento de credenciales de acceso seguras</li>
                </ul>

                <h3>3. Limitaciones</h3>
                <p>hgaruna no se hace responsable por:</p>
                <ul>
                  <li>Pérdida de datos por mal uso del sistema</li>
                  <li>Caídas de servidor de hosting externo</li>
                  <li>Cambios en algoritmos de motores de búsqueda</li>
                  <li>
                    Contenido subido por el cliente que infrinja derechos de
                    terceros
                  </li>
                </ul>
              </div>
            </section>

            {/* Resolución de Conflictos */}
            <section className="legal-section">
              <h2>
                <i className="fas fa-balance-scale"></i> Resolución de
                Conflictos
              </h2>
              <div className="legal-text">
                <h3>1. Mediación</h3>
                <p>
                  Ante cualquier conflicto, las partes se comprometen a buscar
                  una solución amigable mediante mediación antes de recurrir a
                  instancias judiciales.
                </p>

                <h3>2. Jurisdicción</h3>
                <p>
                  En caso de conflicto legal, las partes se someten a la
                  jurisdicción de los Tribunales Ordinarios de la Ciudad de
                  Córdoba, Argentina.
                </p>

                <h3>3. Legislación Aplicable</h3>
                <p>
                  Este acuerdo se rige por las leyes de la República Argentina,
                  especialmente:
                </p>
                <ul>
                  <li>Código Civil y Comercial de la Nación</li>
                  <li>Ley de Defensa del Consumidor (24.240)</li>
                  <li>Ley de Protección de Datos Personales (25.326)</li>
                </ul>
              </div>
            </section>

            {/* Contacto Legal */}
            <section className="legal-section contact-section">
              <h2>
                <i className="fas fa-phone"></i> Contacto para Consultas Legales
              </h2>
              <div className="legal-text">
                <p>
                  Para cualquier consulta relacionada con estos términos
                  legales, puedes contactarnos:
                </p>
                <div className="contact-grid">
                  <div className="contact-item">
                    <i className="fab fa-whatsapp"></i>
                    <div>
                      <strong>WhatsApp</strong>
                      <a
                        href="https://wa.me/+543541237972"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        +54 3541 237972
                      </a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <strong>Email</strong>
                      <a href="mailto:legal@hgaruna.org">legal@hgaruna.org</a>
                    </div>
                  </div>
                  <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Ubicación</strong>
                      <span>Villa Carlos Paz, Córdoba, Argentina</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </BaseLayout>
  );
}
