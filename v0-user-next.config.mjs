/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para Vercel
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'vercel.app'],
    // Añadir otros dominios si usas imágenes externas
  },
  // Configuración para Stripe Webhook
  async headers() {
    return [
      {
        // Configurar CORS para el webhook de Stripe
        source: '/api/webhooks/stripe',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Stripe-Signature' },
        ],
      },
    ]
  },
  // Configuración para variables de entorno públicas
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default nextConfig
