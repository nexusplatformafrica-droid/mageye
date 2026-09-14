import tailwindcss from '@tailwindcss/vite';

const port = Number(process.env.PORT || 3000);
const baseURL = process.env.BASE_PATH || '/';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  telemetry: false,
  devtools: { enabled: false },
  ssr: false,
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#0d2d44' },
        { name: 'description', content: 'Hassan Mageye is a Ugandan-American writer, director and producer creating African stories, cultural narratives and character-driven drama.' },
      ],
    },
  },
  css: ['~/assets/css/main.css', '~/assets/css/admin.css'],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
  devServer: {
    host: '0.0.0.0',
    port,
  },
  nitro: {
    preset: 'node-server',
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
});