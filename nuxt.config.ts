// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@nuxt/ui',
  ],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  nitro: {
    preset: 'vercel',
  },
})
