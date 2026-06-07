/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 60px -24px rgba(249, 115, 22, 0.55)',
      },
    },
  },
  plugins: [],
};
