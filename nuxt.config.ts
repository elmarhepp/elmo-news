export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
  ],

  typescript: {
    strict: false,
  },

  compatibilityDate: "2025-01-01",
});
