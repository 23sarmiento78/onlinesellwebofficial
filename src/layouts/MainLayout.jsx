import React from 'react'
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
