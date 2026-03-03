// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  // ── Static Site Generation (SSG) ──
  ssr: true,
  nitro: {
    preset: 'static',
  },

  // ── Tailwind CSS ──
  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/tailwind.css',
  },

  // ── Google Fonts ──
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      'Playfair Display': [400, 500, 600, 700, 800],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },

  // ── App Meta ──
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Flux Theatre Ensemble',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Flux Theatre Ensemble — Adventurous theatre in New York City.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // ── Runtime Config (env-driven) ──
  runtimeConfig: {
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055',
    },
  },

  // ── TypeScript ──
  typescript: {
    strict: true,
  },
});
