/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class', // Для поддержки темной темы
  theme: {
    extend: {},
  },
  corePlugins: {
    gap: true, // Убедитесь, что утилита gap включена
  },
  plugins: [],
};