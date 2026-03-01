export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    "nuxt-auth-utils",
    "@pinia/nuxt",
  ],

  css: ["~/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  experimental: {
    appManifest: false,
  },

  typescript: {
    strict: false,
  },

  compatibilityDate: "2025-01-01",
});
