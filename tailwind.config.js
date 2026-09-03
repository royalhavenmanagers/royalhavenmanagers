/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF7',
          100: '#FBF4E8',
          200: '#F7E7CE',
          300: '#EBD2A0',
          400: '#E2BD6B',
          500: '#D4AF37', // Royal Gold
          600: '#B89025',
          700: '#946E19',
          800: '#755418',
          900: '#614317',
          950: '#38240A',
        },
        obsidian: {
          950: '#060608',
          900: '#0a0a0e',
          800: '#121217',
          700: '#16161C',
          600: '#1E1E26',
          500: '#2A2A36',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(8,8,10,0) 70%)',
        'dark-glass': 'linear-gradient(180deg, rgba(22, 22, 28, 0.75) 0%, rgba(16, 16, 20, 0.85) 100%)',
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
