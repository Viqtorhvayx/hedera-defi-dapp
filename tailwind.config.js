/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enforce dark mode
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // Deep black
        surface: '#121212', // Dark gray
        surfaceHighlight: '#1f1f1f', // Slightly lighter gray for hover
        accent: {
          terracotta: '#e07a5f', // Muted terracotta
          cyan: '#3d5a80', // Soft cyan/blue
        },
        textPrimary: '#f4f4f5',
        textSecondary: '#a1a1aa',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
