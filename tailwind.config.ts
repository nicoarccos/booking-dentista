import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dental': {
          primary: '#2B6CB0',    // Azul principal
          secondary: '#48BB78',  // Verde menta
          accent: '#F56565',     // Coral
          light: '#F7FAFC',      // Fondo claro
          dark: '#2D3748',       // Texto oscuro
          gray: {
            100: '#F7FAFC',
            200: '#EDF2F7',
            300: '#E2E8F0',
            400: '#CBD5E0',
            500: '#A0AEC0',
            600: '#718096',
            700: '#4A5568',
            800: '#2D3748',
            900: '#1A202C',
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}

export default config;
