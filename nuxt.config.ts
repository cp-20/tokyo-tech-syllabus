// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: '東工大シラバス - Tokyo Tech Syllabus',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: '東工大の講義を爆速で検索できるサイト',
        },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'theme-color', content: '#ffffff' },
        {
          property: 'og:title',
          content: '東工大シラバス - Tokyo Tech Syllabus',
        },
        {
          property: 'og:description',
          content: '東工大の講義を爆速で検索できるサイト',
        },
        {
          property: 'og:image',
          content: 'https://tokyo-tech-syllabus.cp20.dev/ogp.png',
        },
        {
          property: 'og:url',
          content: 'https://tokyo-tech-syllabus.cp20.dev/',
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: '東工大シラバス - Tokyo Tech Syllabus',
        },
        {
          name: 'twitter:description',
          content: '東工大の講義を爆速で検索できるサイト',
        },
        {
          name: 'twitter:image',
          content: 'https://tokyo-tech-syllabus.cp20.dev/ogp.png',
        },
        {
          name: 'twitter:url',
          content: 'https://tokyo-tech-syllabus.cp20.dev/',
        },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        { rel: 'manifest', href: '/manifest.webmanifest' },
      ],
      script: [
        process.env.CLOUDFLARE_BEACON && {
          src: 'https://static.cloudflareinsights.com/beacon.min.js',
          defer: true,
          'data-cf-beacon': `{"token": "${process.env.CLOUDFLARE_BEACON}"}`,
        },
      ].filter(Boolean),
    },
  },
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
