// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  // ── Server-Side Routing Rules ──
  routeRules: {
    '/fear-wonder': { redirect: '/productions/fear-wonder' },
    '/cms/**': { proxy: `${process.env.NUXT_PUBLIC_DIRECTUS_URL || 'https://flux-theatrecms-production.up.railway.app'}/cms/**` },
    // Specific items and assets proxying to handle both types
    '/items/**': { proxy: `${process.env.NUXT_PUBLIC_DIRECTUS_URL || 'https://flux-theatrecms-production.up.railway.app'}/items/**` },
    '/assets/**': { proxy: `${process.env.NUXT_PUBLIC_DIRECTUS_URL || 'https://flux-theatrecms-production.up.railway.app'}/assets/**` },
    
    // Enable ISR (Incremental Static Regeneration) to cache pages at the Netlify CDN edge for 1 hour
    '/**': { isr: 3600 },
  },

    // ── Server-Side Rendering (SSR) via Netlify Functions ──
  ssr: true,
  nitro: {
    preset: 'netlify',
    externals: {
      inline: ['tslib'],
    },
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
          content: 'Flux Theatre Ensemble — Collective care, long-term artistic collaboration, and shared power.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  // ── Runtime Config (env-driven) ──
  runtimeConfig: {
    public: {
      directusUrl: process.env.NUXT_PUBLIC_DIRECTUS_URL || 'https://flux-theatrecms-production.up.railway.app',
    },
  },

  // ── TypeScript ──
  typescript: {
    strict: true,
  },

  // ── Build ──
  build: {
    transpile: ['rrule', 'tslib'],
  },

  // ── Vite ──
  vite: {
    optimizeDeps: {
      include: ['tslib'],
    },
    resolve: {
      alias: {
        tslib: 'tslib',
      },
    },
  },
});
