/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mono: {
          50: 'rgba(255, 255, 255, 0.95)',  // Blanc presque pur
          100: 'rgba(255, 255, 255, 0.9)',  // Blanc translucide
          200: 'rgba(255, 255, 255, 0.8)',  // Blanc plus translucide
          300: 'rgba(255, 255, 255, 0.7)',  // Blanc très translucide
          400: 'rgba(128, 128, 128, 0.7)',  // Gris translucide
          500: 'rgba(64, 64, 64, 0.8)',     // Gris foncé translucide
          600: 'rgba(32, 32, 32, 0.85)',    // Noir léger translucide
          700: 'rgba(16, 16, 16, 0.9)',     // Noir moyen translucide
          800: 'rgba(8, 8, 8, 0.95)',       // Noir profond translucide
          900: 'rgba(0, 0, 0, 0.98)',       // Noir pur translucide
        },
        accent: {
          light: 'rgba(255, 255, 255, 0.9)', // Accent blanc translucide
          dark: 'rgba(0, 0, 0, 0.9)',        // Accent noir translucide
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};