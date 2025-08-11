import React from "react";
import BaseLayout from "../layouts/BaseLayout";
import Hero from "../components/Hero";
import "./Planes.css";

const planes = [
  {
    id: 1,
    name: "Básico",
    price: "$200",
    period: "USD",
    description: "Perfecto para emprendedores que necesitan presencia online",
    features: [
      "Landing Page de 1 página",
      "Diseño responsive",
      "Formulario de contacto",
      "Optimización SEO básica",
      "SSL incluido",
      "1 mes de soporte",
    ],
    cta: "Empezar Ahora",
    popular: false,
    color: "basic",
  },
  {
    id: 2,
    name: "Estándar",
    price: "$400",
    period: "USD",
    description: "Ideal para pequeños negocios que buscan mayor funcionalidad",
    features: [
      "Sitio web de hasta 5 páginas",
      "Diseño responsive premium",
      "CMS para actualizar contenido",
      "Formularios avanzados",
      "SEO intermedio",
      "Integración redes sociales",
      "3 meses de soporte",
    ],
    cta: "Elegir Plan",
    popular: false,
    color: "standard",
  },
  {
    id: 3,
    name: "Profesional",
    price: "$600",
    period: "USD",
    description: "Para empresas que necesitan una presencia web sólida",
    features: [
      "Sitio web ilimitado",
      "Panel de administración",
      "Blog integrado",
      "Galería de imágenes",
      "SEO avanzado",
      "Analíticas web",
      "Chat en vivo",
      "6 meses de soporte",
    ],
    cta: "Más Popular",
    popular: true,
    color: "professional",
  },
  {
    id: 4,
    name: "E-commerce",
    price: "$800",
    period: "USD",
    description: "Tienda online completa para vender tus productos",
    features: [
      "Tienda online completa",
      "Carrito de compras",
      "Pasarelas de pago",
      "Gestión de inventario",
      "Panel de ventas",
      "SEO para e-commerce",
      "Productos ilimitados",
      "1 año de soporte",
    ],
    cta: "Vender Online",
    popular: false,
    color: "ecommerce",
  },
  {
    id: 5,
    name: "E-commerce Pro",
    price: "$1,200",
    period: "USD",
    description: "Solución avanzada para negocios de alto volumen",
    features: [
      "E-commerce premium",
      "Multi-pasarelas de pago",
      "Sistema de envíos",
      "Facturación automática",
      "Reportes avanzados",
      "Marketing automation",
      "Multi-idioma",
      "Integración ERP",
      "1 año de soporte premium",
    ],
    cta: "Escalar Negocio",
    popular: false,
    color: "ecommerce-pro",
  },
  {
    id: 6,
    name: "Completo",
    price: "$1,500",
    period: "USD",
    description: "Solución integral: Sitio web + Aplicación móvil",
    features: [
      "Sitio web completo",
      "Aplicación móvil nativa",
      "Publicación en Play Store",
      "Panel de administración unificado",
      "Push notifications",
      "Sincronización en tiempo real",
      "SEO completo",
      "Soporte prioritario 24/7",
      "2 años de soporte",
    ],
    cta: "Solución Total",
    popular: false,
    color: "complete",
  },
];

export default function Planes() {
  return (
    <BaseLayout
      title="Planes Desarrollo Web Villa Carlos Paz | Desde $200 | Sitios Web Profesionales"
      description="Planes de desarrollo web profesionales en Villa Carlos Paz, Córdoba. Precios accesibles desde $200. Sitios web que convierten visitantes en clientes. E-commerce y apps móviles."
      keywords="planes desarrollo web villa carlos paz, precios sitios web carlos paz, desarrollo web córdoba, e-commerce villa carlos paz, apps móviles villa carlos paz"
      ogTitle="Planes Desarrollo Web Villa Carlos Paz | Desde $200"
      ogDescription="Planes de desarrollo web profesionales en Villa Carlos Paz. Desde landing pages hasta e-commerce y apps móviles. Soporte incluido."
      ogImage="https://hgaruna.org/logos-he-imagenes/logo3.png"
      ogUrl="https://hgaruna.org/planes/"
    >
      <Hero
        title="Planes de Desarrollo Web Villa Carlos Paz"
        subtitle="Elige el plan perfecto para tu negocio. Desde sitios web básicos hasta e-commerce completos con app móvil. Todos nuestros planes incluyen SEO y soporte técnico."
        backgroundImage="/logos-he-imagenes/fondo-hero.jpg"
        ctas={[
          {
            href: "#planes",
            className: "cta-button primary",
            icon: "fas fa-eye",
            text: "Ver Planes",
          },
          {
            href: "https://wa.me/+543541237972?text=Hola%2C%20quiero%20consultar%20sobre%20los%20planes%20de%20desarrollo%20web",
            className: "cta-button secondary",
            icon: "fab fa-whatsapp",
            text: "Consulta Gratuita",
            target: "_blank",
          },
        ]}
        stats={[
          { number: "6", label: "Planes Disponibles" },
          { number: "$200", label: "Desde" },
          { number: "24h", label: "Respuesta" },
        ]}
      />

      <main>
        <section id="planes" className="planes-section">
          <div className="container">
            <div className="section-header">
              <h2>Nuestros Planes de Desarrollo</h2>
              <p>Soluciones adaptadas a cada tipo de negocio y presupuesto</p>
            </div>

            <div className="planes-grid">
              {planes.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.color} ${plan.popular ? "popular" : ""}`}
                >
                  {plan.popular && (
                    <div className="popular-badge">
                      <i className="fas fa-star"></i>
                      Más Elegido
                    </div>
                  )}

                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="price">{plan.price}</span>
                      <span className="period">{plan.period}</span>
                    </div>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="plan-features">
                    <ul>
                      {plan.features.map((feature, index) => (
                        <li key={index}>
                          <i className="fas fa-check"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="plan-footer">
                    <a
                      href={`https://wa.me/+543541237972?text=Hola%2C%20me%20interesa%20el%20plan%20${plan.name}%20de%20${plan.price}%20USD`}
                      className={`plan-cta ${plan.popular ? "primary" : "secondary"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-whatsapp"></i>
                      {plan.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="plans-footer">
              <div className="guarantee">
                <h3>
                  <i className="fas fa-shield-alt"></i> Garantía de Satisfacción
                </h3>
                <p>
                  Si no estás 100% satisfecho con tu sitio web, te devolvemos tu
                  dinero.
                </p>
              </div>

              <div className="contact-info">
                <h3>¿Necesitas un plan personalizado?</h3>
                <p>
                  Contactanos para una cotización a medida de tus necesidades
                  específicas.
                </p>
                <div className="contact-buttons">
                  <a href="/contacto" className="contact-btn">
                    <i className="fas fa-envelope"></i>
                    Contacto
                  </a>
                  <a
                    href="https://wa.me/+543541237972?text=Hola%2C%20necesito%20un%20plan%20personalizado%20para%20mi%20proyecto"
                    className="whatsapp-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </BaseLayout>
  );
}
