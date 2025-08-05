import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function MarketingDigitalVillaCarlosPaz() {
  return (
    <>
      <Helmet>
        <title>Marketing Digital Villa Carlos Paz | Página en Construcción | hgaruna</title>
        <meta name="description" content="Página en construcción - Marketing Digital especializado en Villa Carlos Paz" />
      </Helmet>

      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="container text-center">
          <i className="fas fa-chart-line text-6xl text-primary mb-6"></i>
          <h1 className="text-4xl font-bold mb-4">Página en Construcción</h1>
          <p className="text-xl text-secondary mb-8">
            Estamos trabajando en contenido especializado sobre marketing digital en Villa Carlos Paz.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn btn-primary">
              <i className="fas fa-home mr-2"></i>
              Volver al Inicio
            </Link>
            <Link to="/contacto" className="btn btn-outline">
              <i className="fas fa-envelope mr-2"></i>
              Contactanos
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
