/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // Configuração para comunicar com a API do NestJS
  async rewrites() {
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3003';
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`
      }
    ];
  },

  // Configurações de imagem
  images: {
    domains: ['localhost'],
    unoptimized: true
  },

  // Variáveis de ambiente
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001'
  }
};

module.exports = nextConfig;
