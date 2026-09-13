import tailwindcss from '@tailwindcss/vite';

const port = Number(process.env.PORT || 3000);
const baseURL = process.env.BASE_PATH || '/';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  telemetry: false,
  devtools: { enabled: false },
  ssr: true,
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#f1eadc' },
        { name: 'description', content: 'Amara Kato is a Nairobi-based film director making intimate human documentaries and atmospheric brand films.' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
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