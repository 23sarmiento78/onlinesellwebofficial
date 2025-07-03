import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import BuilderPage from '../components/BuilderPage';
import LinkedInComponent from '../components/BuilderComponents';

export default function LinkedInIntegration() {
  return (
    <BaseLayout
      title="Integración LinkedIn | Desarrollo Web Villa Carlos Paz | hgaruna"
      description="Integración completa con LinkedIn para publicar contenido automáticamente desde tu CMS."
      keywords="linkedin integration, cms linkedin, auto post linkedin, marketing digital linkedin, villa carlos paz"
    >
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <img src="/logos-he-imagenes/fondo-hero.jpg" alt="Fondo hero" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Integración con LinkedIn</h1>
          <p className="hero-subtitle">
            Publica contenido automáticamente en LinkedIn desde tu CMS
          </p>
          <div className="hero-cta">
            <a href="#linkedin-demo" className="cta-button primary">
              <i className="fab fa-linkedin"></i>
              Probar Integración
            </a>
          </div>
        </div>
      </section>

      {/* Builder.io Content */}
      <BuilderPage 
        model="linkedin-page" 
        fallback={
          <div className="container mt-5">
            <div className="text-center">
              <h2>Contenido de Builder.io</h2>
              <p>Aquí puedes agregar contenido desde Builder.io</p>
            </div>
          </div>
        }
      />

      {/* LinkedIn Integration Demo */}
      <section id="linkedin-demo" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h2>Demo de Integración LinkedIn</h2>
                <p className="lead">
                  Conecta tu cuenta de LinkedIn y publica contenido directamente desde aquí
                </p>
              </div>
              
              <LinkedInComponent 
                title="Integración LinkedIn - Demo"
                content="¡Hola LinkedIn! Este es un contenido de prueba desde nuestro CMS integrado. #DesarrolloWeb #VillaCarlosPaz #hgaruna"
                showContent={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fab fa-linkedin"></i>
                </div>
                <h3>Autenticación Segura</h3>
                <p>Conecta tu cuenta de LinkedIn de forma segura usando OAuth 2.0</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-edit"></i>
                </div>
                <h3>Editor Visual</h3>
                <p>Crea contenido usando Builder.io y publícalo automáticamente</p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Analytics</h3>
                <p>Monitorea el rendimiento de tus publicaciones en LinkedIn</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
} 