/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      colors: {
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        accent: 'var(--accent)',
        border: 'var(--border)',
      },
      boxShadow: {
        glow: '0 20px 60px -24px rgba(249, 115, 22, 0.55)',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
