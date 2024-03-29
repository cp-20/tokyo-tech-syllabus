// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare-pages',
  },

  modules: [
    'nitro-cloudflare-dev',
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Noto Sans JP': [400, 500, 600],
        },
      },
    ],
  ],
});
