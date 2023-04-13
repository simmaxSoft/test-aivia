export default defineNuxtConfig({
  css: [
    '@/assets/styles/main.scss'
  ],
  ssr:false,
  modules: [
    ['@nuxtjs/tailwindcss', { viewer: false }],
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    './modules/router',
    './modules/imports',
    './modules/unplugin'
  ]
})
