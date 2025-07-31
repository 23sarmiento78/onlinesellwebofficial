/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configuración de redirecciones
  async redirects() {
    return [
      // Aquí puedes agregar redirecciones específicas si es necesario
    ]
  },
  // Configuración de encabezados para seguridad y SEO
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  // Configuración de imágenes si usas el componente Image de Next.js
  images: {
    domains: ['assets.vercel.com', 'your-image-domain.com'],
  },
  // Configuración de webpack si es necesario
  webpack: (config, { isServer }) => {
    // Aquí puedes personalizar la configuración de webpack
    return config
  },
}

module.exports = nextConfig
