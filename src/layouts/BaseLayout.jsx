import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function BaseLayout({ children }) {
  return (
    <>
      <NavBar />
      {/* Aquí va el head, meta y estructura base migrada de BaseLayout.astro */}
      {children}
      <Footer />
    </>
  );
} 