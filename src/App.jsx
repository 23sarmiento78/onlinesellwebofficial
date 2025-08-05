import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Layouts
import MainLayout from '@layouts/MainLayout'

// Pages
import Home from '@pages/Home'
import Planes from '@pages/Planes'
import Legal from '@pages/Legal'
import BlogIA from '@pages/BlogIA'
import BlogArticle from '@pages/BlogArticle'
import CategoryPage from '@pages/CategoryPage'
import Contacto from '@pages/Contacto'
import DesarrolloWebVillaCarlosPaz from '@pages/DesarrolloWebVillaCarlosPaz'
import DisenoWebVillaCarlosPaz from '@pages/DisenoWebVillaCarlosPaz'
import MarketingDigitalVillaCarlosPaz from '@pages/MarketingDigitalVillaCarlosPaz'

function App() {
  return (
    <>
      <Helmet>
        <html lang="es" data-theme="light" />
      </Helmet>
      
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<BlogIA />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/desarrollo-web-villa-carlos-paz" element={<DesarrolloWebVillaCarlosPaz />} />
          <Route path="/diseño-web-villa-carlos-paz" element={<DisenoWebVillaCarlosPaz />} />
          <Route path="/marketing-digital-villa-carlos-paz" element={<MarketingDigitalVillaCarlosPaz />} />
        </Routes>
      </MainLayout>
    </>
  )
}

export default App
